"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL-DRIVEN CAMERA JOURNEY
//
// The portfolio is a narrative. As you read through chapters, the camera
// slowly drifts through the same living network — each chapter seen from a
// different perspective. The world never changes; only your viewpoint does.
// ─────────────────────────────────────────────────────────────────────────────

interface CamFrame { scroll: number; x: number; y: number; z: number }

const CAM_PATH: CamFrame[] = [
  { scroll: 0.00, x:  0.0, y:  0.0, z: 11.0 }, // Prologue
  { scroll: 0.17, x: -2.0, y:  0.7, z: 10.5 }, // Origin Story   — lean into Design cluster
  { scroll: 0.36, x:  0.0, y:  1.2, z: 13.0 }, // Capabilities   — pull back, full overview
  { scroll: 0.53, x:  2.0, y:  0.3, z: 10.5 }, // Process        — lean into AI/Systems cluster
  { scroll: 0.70, x:  0.8, y: -0.8, z: 11.5 }, // Case Stories   — slightly below, intimate
  { scroll: 0.86, x:  0.0, y:  1.0, z: 12.5 }, // Notes          — elevated, serene
  { scroll: 1.00, x:  0.0, y:  0.0, z: 15.0 }, // Contact        — far back, open, calm
]

// ─────────────────────────────────────────────────────────────────────────────
// PER-CHAPTER ATMOSPHERE PALETTES
//
// Each chapter gets a distinct visual mood: background tint, connection line
// color, bloom intensity, and ambient warmth — all lerped smoothly between
// scroll positions so transitions feel like breathing, not cutting.
//
//   Prologue     → deep navy, full cyan glow
//   Origin Story → darker, cyan surge — leaning into the design cluster
//   Capabilities → violet deep space — abstract, expansive
//   Process      → lavender wash — methodical, considered
//   Case Stories → sky blue, open — the work revealed
//   Notes        → pale blue serenity — reflective, quiet
//   Contact      → still ice-white — journey complete
// ─────────────────────────────────────────────────────────────────────────────

interface Atmosphere {
  scroll: number
  bg: string
  line: string
  bloom: number
  ambient: number
}

const ATMOSPHERES: Atmosphere[] = [
  { scroll: 0.00, bg: "#020617", line: "#22d3ee", bloom: 0.75, ambient: 0.04 },
  { scroll: 0.17, bg: "#041822", line: "#06b6d4", bloom: 1.00, ambient: 0.07 },
  { scroll: 0.36, bg: "#0e0520", line: "#7c3aed", bloom: 1.20, ambient: 0.04 },
  { scroll: 0.53, bg: "#12032a", line: "#a78bfa", bloom: 1.00, ambient: 0.06 },
  { scroll: 0.70, bg: "#031018", line: "#38bdf8", bloom: 0.90, ambient: 0.08 },
  { scroll: 0.86, bg: "#061525", line: "#93c5fd", bloom: 0.85, ambient: 0.05 },
  { scroll: 1.00, bg: "#020617", line: "#e0f9ff", bloom: 0.65, ambient: 0.03 },
]

// Pre-allocated scratch colors — avoids per-frame GC pressure
const _colA = new THREE.Color()
const _colB = new THREE.Color()

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

function getCamTarget(s: number): { x: number; y: number; z: number } {
  s = Math.max(0, Math.min(1, s))
  for (let i = 0; i < CAM_PATH.length - 1; i++) {
    const a = CAM_PATH[i], b = CAM_PATH[i + 1]
    if (s >= a.scroll && s <= b.scroll) {
      const t = easeInOut((s - a.scroll) / (b.scroll - a.scroll))
      return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t) }
    }
  }
  const last = CAM_PATH[CAM_PATH.length - 1]
  return { x: last.x, y: last.y, z: last.z }
}

interface AtmosphereLerp {
  bgA: string; bgB: string; bgT: number
  lineA: string; lineB: string; lineT: number
  bloom: number
  ambient: number
}

function getAtmosphereLerp(s: number): AtmosphereLerp {
  s = Math.max(0, Math.min(1, s))
  for (let i = 0; i < ATMOSPHERES.length - 1; i++) {
    const a = ATMOSPHERES[i], b = ATMOSPHERES[i + 1]
    if (s >= a.scroll && s <= b.scroll) {
      const t = easeInOut((s - a.scroll) / (b.scroll - a.scroll))
      return {
        bgA: a.bg, bgB: b.bg, bgT: t,
        lineA: a.line, lineB: b.line, lineT: t,
        bloom: lerp(a.bloom, b.bloom, t),
        ambient: lerp(a.ambient, b.ambient, t),
      }
    }
  }
  const last = ATMOSPHERES[ATMOSPHERES.length - 1]
  return {
    bgA: last.bg, bgB: last.bg, bgT: 0,
    lineA: last.line, lineB: last.line, lineT: 0,
    bloom: last.bloom, ambient: last.ambient,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NODE TOPOLOGY
// ─────────────────────────────────────────────────────────────────────────────

interface NodeData {
  position: [number, number, number]
  size: number
  color: string
  floatSpeed: number
  floatOffset: number
  floatAmp: number
  shape: "sphere" | "octahedron" | "icosahedron"
  emissive: number
}

const CONNECTION_DISTANCE = 4.2

const NODES: NodeData[] = [
  // Central convergence — icosahedron
  { position: [0, 0, 0],       size: 0.22, color: "#e0f9ff", shape: "icosahedron", floatSpeed: 0.18, floatOffset: 0.00, floatAmp: 0.05, emissive: 2.8 },

  // Design cluster — cyan (left)
  { position: [-3.8, 0.4, 0.3],  size: 0.18, color: "#22d3ee", shape: "octahedron", floatSpeed: 0.28, floatOffset: 0.0,  floatAmp: 0.12, emissive: 2.4 },
  { position: [-5.2, 1.8, -0.8], size: 0.13, color: "#06b6d4", shape: "sphere",     floatSpeed: 0.35, floatOffset: 1.2,  floatAmp: 0.10, emissive: 2.0 },
  { position: [-2.4, 2.2, 1.1],  size: 0.12, color: "#22d3ee", shape: "sphere",     floatSpeed: 0.30, floatOffset: 2.5,  floatAmp: 0.11, emissive: 2.0 },
  { position: [-4.5, -1.2, 0.6], size: 0.11, color: "#0ea5e9", shape: "sphere",     floatSpeed: 0.25, floatOffset: 3.8,  floatAmp: 0.09, emissive: 1.8 },
  { position: [-1.8, -0.5,-1.2], size: 0.09, color: "#67e8f9", shape: "sphere",     floatSpeed: 0.42, floatOffset: 0.8,  floatAmp: 0.08, emissive: 1.6 },
  { position: [-5.8, -0.3, 1.0], size: 0.08, color: "#a5f3fc", shape: "sphere",     floatSpeed: 0.38, floatOffset: 4.1,  floatAmp: 0.07, emissive: 1.5 },
  { position: [-3.0, 3.1, -0.5], size: 0.07, color: "#67e8f9", shape: "sphere",     floatSpeed: 0.33, floatOffset: 1.9,  floatAmp: 0.08, emissive: 1.5 },
  { position: [-6.0, 2.4, 0.2],  size: 0.06, color: "#a5f3fc", shape: "sphere",     floatSpeed: 0.45, floatOffset: 5.2,  floatAmp: 0.07, emissive: 1.3 },
  { position: [-4.2,-2.8, -0.3], size: 0.06, color: "#67e8f9", shape: "sphere",     floatSpeed: 0.50, floatOffset: 2.7,  floatAmp: 0.06, emissive: 1.3 },
  { position: [-2.0, 1.5, 2.2],  size: 0.05, color: "#a5f3fc", shape: "sphere",     floatSpeed: 0.48, floatOffset: 0.3,  floatAmp: 0.06, emissive: 1.2 },
  { position: [-5.5, 0.8,-1.5],  size: 0.05, color: "#67e8f9", shape: "sphere",     floatSpeed: 0.40, floatOffset: 3.3,  floatAmp: 0.05, emissive: 1.2 },
  { position: [-3.5,-1.8, 1.8],  size: 0.05, color: "#a5f3fc", shape: "sphere",     floatSpeed: 0.44, floatOffset: 1.5,  floatAmp: 0.06, emissive: 1.2 },
  { position: [-1.5, 3.5, 0.8],  size: 0.04, color: "#67e8f9", shape: "sphere",     floatSpeed: 0.52, floatOffset: 4.7,  floatAmp: 0.05, emissive: 1.1 },
  { position: [-6.2,-1.5, 0.8],  size: 0.04, color: "#a5f3fc", shape: "sphere",     floatSpeed: 0.46, floatOffset: 2.1,  floatAmp: 0.05, emissive: 1.1 },
  { position: [-2.8,-3.2,-0.9],  size: 0.04, color: "#67e8f9", shape: "sphere",     floatSpeed: 0.55, floatOffset: 5.8,  floatAmp: 0.04, emissive: 1.0 },
  { position: [-4.8, 3.0, 1.2],  size: 0.04, color: "#a5f3fc", shape: "sphere",     floatSpeed: 0.43, floatOffset: 3.0,  floatAmp: 0.05, emissive: 1.0 },

  // AI / Systems cluster — violet (right)
  { position: [3.8, 0.4, 0.3],   size: 0.18, color: "#a78bfa", shape: "octahedron", floatSpeed: 0.28, floatOffset: 0.6,  floatAmp: 0.12, emissive: 2.4 },
  { position: [5.2, 1.8, -0.8],  size: 0.13, color: "#8b5cf6", shape: "sphere",     floatSpeed: 0.35, floatOffset: 1.8,  floatAmp: 0.10, emissive: 2.0 },
  { position: [2.4, 2.2, 1.1],   size: 0.12, color: "#a78bfa", shape: "sphere",     floatSpeed: 0.30, floatOffset: 3.1,  floatAmp: 0.11, emissive: 2.0 },
  { position: [4.5, -1.2, 0.6],  size: 0.11, color: "#7c3aed", shape: "sphere",     floatSpeed: 0.25, floatOffset: 4.4,  floatAmp: 0.09, emissive: 1.8 },
  { position: [1.8, -0.5,-1.2],  size: 0.09, color: "#c4b5fd", shape: "sphere",     floatSpeed: 0.42, floatOffset: 1.4,  floatAmp: 0.08, emissive: 1.6 },
  { position: [5.8, -0.3, 1.0],  size: 0.08, color: "#ddd6fe", shape: "sphere",     floatSpeed: 0.38, floatOffset: 4.7,  floatAmp: 0.07, emissive: 1.5 },
  { position: [3.0, 3.1, -0.5],  size: 0.07, color: "#c4b5fd", shape: "sphere",     floatSpeed: 0.33, floatOffset: 2.5,  floatAmp: 0.08, emissive: 1.5 },
  { position: [6.0, 2.4, 0.2],   size: 0.06, color: "#ddd6fe", shape: "sphere",     floatSpeed: 0.45, floatOffset: 5.8,  floatAmp: 0.07, emissive: 1.3 },
  { position: [4.2,-2.8, -0.3],  size: 0.06, color: "#c4b5fd", shape: "sphere",     floatSpeed: 0.50, floatOffset: 3.3,  floatAmp: 0.06, emissive: 1.3 },
  { position: [2.0, 1.5, 2.2],   size: 0.05, color: "#ddd6fe", shape: "sphere",     floatSpeed: 0.48, floatOffset: 0.9,  floatAmp: 0.06, emissive: 1.2 },
  { position: [5.5, 0.8,-1.5],   size: 0.05, color: "#c4b5fd", shape: "sphere",     floatSpeed: 0.40, floatOffset: 3.9,  floatAmp: 0.05, emissive: 1.2 },
  { position: [3.5,-1.8, 1.8],   size: 0.05, color: "#ddd6fe", shape: "sphere",     floatSpeed: 0.44, floatOffset: 2.1,  floatAmp: 0.06, emissive: 1.2 },
  { position: [1.5, 3.5, 0.8],   size: 0.04, color: "#c4b5fd", shape: "sphere",     floatSpeed: 0.52, floatOffset: 5.3,  floatAmp: 0.05, emissive: 1.1 },
  { position: [6.2,-1.5, 0.8],   size: 0.04, color: "#ddd6fe", shape: "sphere",     floatSpeed: 0.46, floatOffset: 2.7,  floatAmp: 0.05, emissive: 1.1 },
  { position: [2.8,-3.2,-0.9],   size: 0.04, color: "#c4b5fd", shape: "sphere",     floatSpeed: 0.55, floatOffset: 6.4,  floatAmp: 0.04, emissive: 1.0 },
  { position: [4.8, 3.0, 1.2],   size: 0.04, color: "#ddd6fe", shape: "sphere",     floatSpeed: 0.43, floatOffset: 3.6,  floatAmp: 0.05, emissive: 1.0 },

  // Bridge nodes — sky blue (center, the translation layer)
  { position: [ 0.8, 1.5,  0.5], size: 0.09, color: "#7dd3fc", shape: "sphere",     floatSpeed: 0.32, floatOffset: 1.0,  floatAmp: 0.13, emissive: 1.8 },
  { position: [-0.6,-1.8,  0.3], size: 0.08, color: "#93c5fd", shape: "sphere",     floatSpeed: 0.28, floatOffset: 2.2,  floatAmp: 0.12, emissive: 1.7 },
  { position: [ 1.2,-0.8,  1.5], size: 0.07, color: "#7dd3fc", shape: "sphere",     floatSpeed: 0.35, floatOffset: 3.5,  floatAmp: 0.10, emissive: 1.7 },
  { position: [-1.0, 0.9, -1.0], size: 0.07, color: "#93c5fd", shape: "sphere",     floatSpeed: 0.25, floatOffset: 4.8,  floatAmp: 0.11, emissive: 1.7 },
  { position: [ 0.5, 2.8, -0.8], size: 0.06, color: "#7dd3fc", shape: "sphere",     floatSpeed: 0.40, floatOffset: 0.5,  floatAmp: 0.09, emissive: 1.5 },
  { position: [-0.3,-2.5,  1.2], size: 0.05, color: "#93c5fd", shape: "sphere",     floatSpeed: 0.45, floatOffset: 1.7,  floatAmp: 0.08, emissive: 1.4 },
  { position: [ 1.5, 0.3, -1.8], size: 0.05, color: "#7dd3fc", shape: "sphere",     floatSpeed: 0.38, floatOffset: 5.1,  floatAmp: 0.09, emissive: 1.4 },
  { position: [-1.3, 2.0,  1.3], size: 0.05, color: "#93c5fd", shape: "sphere",     floatSpeed: 0.42, floatOffset: 2.9,  floatAmp: 0.08, emissive: 1.4 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Scene inner component
// ─────────────────────────────────────────────────────────────────────────────

interface SceneProps {
  scrollRef: React.MutableRefObject<number>
  bloomRef:  React.MutableRefObject<number>
}

function AmbientNetworkScene({ scrollRef, bloomRef }: SceneProps) {
  const groupRef     = useRef<THREE.Group>(null!)
  const centralRef   = useRef<THREE.Mesh>(null!)
  const meshRefs     = useRef<(THREE.Mesh | null)[]>([])
  const lineMatRef   = useRef<THREE.LineBasicMaterial>(null!)
  const ambientRef   = useRef<THREE.AmbientLight>(null!)
  const camPos       = useRef(new THREE.Vector3(0, 0, 11))
  const currentBg    = useRef(new THREE.Color("#020617"))
  const currentLine  = useRef(new THREE.Color("#22d3ee"))
  const currentAmb   = useRef(0.04)
  const currentBloom = useRef(0.75)

  const linePositions = useMemo(() => {
    const pts = NODES.map(n => new THREE.Vector3(...n.position))
    const pos: number[] = []
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++)
        if (pts[i].distanceTo(pts[j]) < CONNECTION_DISTANCE)
          pos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z)
    return new Float32Array(pos)
  }, [])

  useFrame((state, delta) => {
    const s = Math.max(0, Math.min(1, scrollRef.current))

    // ── Camera ──────────────────────────────────────────────────────────────
    const camTarget = getCamTarget(s)
    camPos.current.x += (camTarget.x - camPos.current.x) * 0.022
    camPos.current.y += (camTarget.y - camPos.current.y) * 0.022
    camPos.current.z += (camTarget.z - camPos.current.z) * 0.022
    state.camera.position.copy(camPos.current)
    state.camera.lookAt(0, 0, 0)

    // ── Atmosphere ───────────────────────────────────────────────────────────
    const atm = getAtmosphereLerp(s)

    // Background — set once as the scene.background reference, then lerp in place
    _colA.set(atm.bgA)
    _colB.set(atm.bgB)
    _colA.lerp(_colB, atm.bgT)
    currentBg.current.lerp(_colA, 0.015)
    state.scene.background = currentBg.current

    // Connection line color
    _colA.set(atm.lineA)
    _colB.set(atm.lineB)
    _colA.lerp(_colB, atm.lineT)
    currentLine.current.lerp(_colA, 0.02)
    if (lineMatRef.current) {
      lineMatRef.current.color.copy(currentLine.current)
    }

    // Ambient light intensity
    currentAmb.current += (atm.ambient - currentAmb.current) * 0.02
    if (ambientRef.current) ambientRef.current.intensity = currentAmb.current

    // Bloom (written to shared ref — synced to React state via RAF in PersistentScene)
    currentBloom.current += (atm.bloom - currentBloom.current) * 0.015
    bloomRef.current = currentBloom.current

    // ── Scene motion ─────────────────────────────────────────────────────────
    const speed = 0.020 * (1 - s * 0.65)
    if (groupRef.current) {
      groupRef.current.rotation.y += speed * delta
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.013) * 0.05
    }

    if (centralRef.current) {
      centralRef.current.rotation.y = state.clock.getElapsedTime() * 0.35
      centralRef.current.rotation.z = state.clock.getElapsedTime() * 0.22
    }

    const t = state.clock.getElapsedTime()
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh || !NODES[i]) return
      const n = NODES[i]
      mesh.position.y = n.position[1] + Math.sin(t * n.floatSpeed + n.floatOffset) * n.floatAmp
      mesh.position.x = n.position[0] + Math.cos(t * n.floatSpeed * 0.6 + n.floatOffset) * n.floatAmp * 0.4
    })
  })

  return (
    <group ref={groupRef}>
      <ambientLight ref={ambientRef} intensity={0.04} />

      {/* Connection lines — color shifts with each chapter atmosphere */}
      <lineSegments>
        <bufferGeometry>
          {/* @ts-expect-error – R3F bufferAttribute args tuple */}
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={lineMatRef} color="#22d3ee" transparent opacity={0.13} />
      </lineSegments>

      {/* Nodes */}
      {NODES.map((node, i) => {
        const isCentral = node.shape === "icosahedron"
        return (
          <mesh
            key={i}
            ref={(el) => {
              meshRefs.current[i] = el
              if (isCentral && el)
                (centralRef as React.MutableRefObject<THREE.Mesh>).current = el
            }}
            position={node.position}
          >
            {node.shape === "icosahedron" && <icosahedronGeometry args={[node.size, 1]} />}
            {node.shape === "octahedron"  && <octahedronGeometry  args={[node.size, 0]} />}
            {node.shape === "sphere"      && <sphereGeometry      args={[node.size, 10, 10]} />}
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={node.emissive}
              roughness={0.15}
              metalness={0.5}
              toneMapped={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported canvas wrapper
// ─────────────────────────────────────────────────────────────────────────────
export default function PersistentScene() {
  const scrollRef      = useRef<number>(0)
  const bloomRef       = useRef(0.75)
  const [bloomIntensity, setBloomIntensity] = useState(0.75)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollRef.current = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    // RAF loop: sync bloom ref → React state. Uses bail-out optimization so
    // React only re-renders when the value actually changes meaningfully.
    let rafId: number
    const tick = () => {
      setBloomIntensity(prev => {
        const next = Math.round(bloomRef.current * 100) / 100
        return Math.abs(next - prev) > 0.01 ? next : prev
      })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 65 }}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <AmbientNetworkScene scrollRef={scrollRef} bloomRef={bloomRef} />
      <EffectComposer>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
