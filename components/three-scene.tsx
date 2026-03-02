"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import * as THREE from "three"

// ─────────────────────────────────────────────────────────────────────────────
// VISHAL'S SYSTEM MAP
//
// The 3D scene is a visual metaphor for who Vishal is:
//   Left cluster  (cyan)   = Design / UX world
//   Right cluster (violet) = AI / Systems / Engineering world
//   Bridge nodes  (sky)    = The translation layer — his core value
//   Central node  (white)  = "Clarity" — where both worlds converge
//
// Node shapes tell the hierarchy:
//   Icosahedron  = Central convergence point (the designer's mind)
//   Octahedra    = Anchor nodes of each domain
//   Spheres      = Supporting nodes
// ─────────────────────────────────────────────────────────────────────────────

interface NodeData {
  position: [number, number, number]
  size: number
  color: string
  floatSpeed: number
  floatOffset: number
  floatAmp: number
  shape: "sphere" | "octahedron" | "icosahedron"
  emissiveIntensity: number
}

const CONNECTION_DISTANCE = 4.2

// Fixed positions — deterministic, same every render (no hydration issues)
const NODE_DEFINITIONS: NodeData[] = [
  // ── CENTRAL CONVERGENCE NODE ─────────────────────────────────────
  { position: [0, 0, 0],      size: 0.22, color: "#e0f9ff", shape: "icosahedron", floatSpeed: 0.18, floatOffset: 0.00, floatAmp: 0.05, emissiveIntensity: 3.5 },

  // ── DESIGN CLUSTER — cyan (left) ─────────────────────────────────
  // Anchor octahedron
  { position: [-3.8, 0.4, 0.3],  size: 0.18, color: "#22d3ee", shape: "octahedron", floatSpeed: 0.28, floatOffset: 0.0, floatAmp: 0.12, emissiveIntensity: 3.0 },
  // Hero spheres
  { position: [-5.2, 1.8, -0.8], size: 0.13, color: "#06b6d4", shape: "sphere",    floatSpeed: 0.35, floatOffset: 1.2, floatAmp: 0.10, emissiveIntensity: 2.5 },
  { position: [-2.4, 2.2, 1.1],  size: 0.12, color: "#22d3ee", shape: "sphere",    floatSpeed: 0.30, floatOffset: 2.5, floatAmp: 0.11, emissiveIntensity: 2.5 },
  { position: [-4.5, -1.2, 0.6], size: 0.11, color: "#0ea5e9", shape: "sphere",    floatSpeed: 0.25, floatOffset: 3.8, floatAmp: 0.09, emissiveIntensity: 2.2 },
  // Medium nodes
  { position: [-1.8, -0.5, -1.2],size: 0.09, color: "#67e8f9", shape: "sphere",    floatSpeed: 0.42, floatOffset: 0.8, floatAmp: 0.08, emissiveIntensity: 2.0 },
  { position: [-5.8, -0.3, 1.0], size: 0.08, color: "#a5f3fc", shape: "sphere",    floatSpeed: 0.38, floatOffset: 4.1, floatAmp: 0.07, emissiveIntensity: 1.8 },
  { position: [-3.0, 3.1, -0.5], size: 0.07, color: "#67e8f9", shape: "sphere",    floatSpeed: 0.33, floatOffset: 1.9, floatAmp: 0.08, emissiveIntensity: 1.8 },
  { position: [-6.0, 2.4, 0.2],  size: 0.06, color: "#a5f3fc", shape: "sphere",    floatSpeed: 0.45, floatOffset: 5.2, floatAmp: 0.07, emissiveIntensity: 1.5 },
  { position: [-4.2, -2.8, -0.3],size: 0.06, color: "#67e8f9", shape: "sphere",    floatSpeed: 0.50, floatOffset: 2.7, floatAmp: 0.06, emissiveIntensity: 1.5 },
  // Micro nodes
  { position: [-2.0, 1.5, 2.2],  size: 0.05, color: "#a5f3fc", shape: "sphere",    floatSpeed: 0.48, floatOffset: 0.3, floatAmp: 0.06, emissiveIntensity: 1.4 },
  { position: [-5.5, 0.8, -1.5], size: 0.05, color: "#67e8f9", shape: "sphere",    floatSpeed: 0.40, floatOffset: 3.3, floatAmp: 0.05, emissiveIntensity: 1.4 },
  { position: [-3.5, -1.8, 1.8], size: 0.05, color: "#a5f3fc", shape: "sphere",    floatSpeed: 0.44, floatOffset: 1.5, floatAmp: 0.06, emissiveIntensity: 1.3 },
  { position: [-1.5, 3.5, 0.8],  size: 0.04, color: "#67e8f9", shape: "sphere",    floatSpeed: 0.52, floatOffset: 4.7, floatAmp: 0.05, emissiveIntensity: 1.3 },
  { position: [-6.2, -1.5, 0.8], size: 0.04, color: "#a5f3fc", shape: "sphere",    floatSpeed: 0.46, floatOffset: 2.1, floatAmp: 0.05, emissiveIntensity: 1.2 },
  { position: [-2.8, -3.2, -0.9],size: 0.04, color: "#67e8f9", shape: "sphere",    floatSpeed: 0.55, floatOffset: 5.8, floatAmp: 0.04, emissiveIntensity: 1.2 },
  { position: [-4.8, 3.0, 1.2],  size: 0.04, color: "#a5f3fc", shape: "sphere",    floatSpeed: 0.43, floatOffset: 3.0, floatAmp: 0.05, emissiveIntensity: 1.2 },

  // ── AI / SYSTEMS CLUSTER — violet (right) ────────────────────────
  // Anchor octahedron
  { position: [3.8, 0.4, 0.3],   size: 0.18, color: "#a78bfa", shape: "octahedron", floatSpeed: 0.28, floatOffset: 0.6, floatAmp: 0.12, emissiveIntensity: 3.0 },
  // Hero spheres
  { position: [5.2, 1.8, -0.8],  size: 0.13, color: "#8b5cf6", shape: "sphere",    floatSpeed: 0.35, floatOffset: 1.8, floatAmp: 0.10, emissiveIntensity: 2.5 },
  { position: [2.4, 2.2, 1.1],   size: 0.12, color: "#a78bfa", shape: "sphere",    floatSpeed: 0.30, floatOffset: 3.1, floatAmp: 0.11, emissiveIntensity: 2.5 },
  { position: [4.5, -1.2, 0.6],  size: 0.11, color: "#7c3aed", shape: "sphere",    floatSpeed: 0.25, floatOffset: 4.4, floatAmp: 0.09, emissiveIntensity: 2.2 },
  // Medium nodes
  { position: [1.8, -0.5, -1.2], size: 0.09, color: "#c4b5fd", shape: "sphere",    floatSpeed: 0.42, floatOffset: 1.4, floatAmp: 0.08, emissiveIntensity: 2.0 },
  { position: [5.8, -0.3, 1.0],  size: 0.08, color: "#ddd6fe", shape: "sphere",    floatSpeed: 0.38, floatOffset: 4.7, floatAmp: 0.07, emissiveIntensity: 1.8 },
  { position: [3.0, 3.1, -0.5],  size: 0.07, color: "#c4b5fd", shape: "sphere",    floatSpeed: 0.33, floatOffset: 2.5, floatAmp: 0.08, emissiveIntensity: 1.8 },
  { position: [6.0, 2.4, 0.2],   size: 0.06, color: "#ddd6fe", shape: "sphere",    floatSpeed: 0.45, floatOffset: 5.8, floatAmp: 0.07, emissiveIntensity: 1.5 },
  { position: [4.2, -2.8, -0.3], size: 0.06, color: "#c4b5fd", shape: "sphere",    floatSpeed: 0.50, floatOffset: 3.3, floatAmp: 0.06, emissiveIntensity: 1.5 },
  // Micro nodes
  { position: [2.0, 1.5, 2.2],   size: 0.05, color: "#ddd6fe", shape: "sphere",    floatSpeed: 0.48, floatOffset: 0.9, floatAmp: 0.06, emissiveIntensity: 1.4 },
  { position: [5.5, 0.8, -1.5],  size: 0.05, color: "#c4b5fd", shape: "sphere",    floatSpeed: 0.40, floatOffset: 3.9, floatAmp: 0.05, emissiveIntensity: 1.4 },
  { position: [3.5, -1.8, 1.8],  size: 0.05, color: "#ddd6fe", shape: "sphere",    floatSpeed: 0.44, floatOffset: 2.1, floatAmp: 0.06, emissiveIntensity: 1.3 },
  { position: [1.5, 3.5, 0.8],   size: 0.04, color: "#c4b5fd", shape: "sphere",    floatSpeed: 0.52, floatOffset: 5.3, floatAmp: 0.05, emissiveIntensity: 1.3 },
  { position: [6.2, -1.5, 0.8],  size: 0.04, color: "#ddd6fe", shape: "sphere",    floatSpeed: 0.46, floatOffset: 2.7, floatAmp: 0.05, emissiveIntensity: 1.2 },
  { position: [2.8, -3.2, -0.9], size: 0.04, color: "#c4b5fd", shape: "sphere",    floatSpeed: 0.55, floatOffset: 6.4, floatAmp: 0.04, emissiveIntensity: 1.2 },
  { position: [4.8, 3.0, 1.2],   size: 0.04, color: "#ddd6fe", shape: "sphere",    floatSpeed: 0.43, floatOffset: 3.6, floatAmp: 0.05, emissiveIntensity: 1.2 },

  // ── BRIDGE NODES — sky blue (center) — the translation layer ─────
  { position: [0.8,  1.5,  0.5], size: 0.09, color: "#7dd3fc", shape: "sphere",    floatSpeed: 0.32, floatOffset: 1.0, floatAmp: 0.13, emissiveIntensity: 2.2 },
  { position: [-0.6,-1.8,  0.3], size: 0.08, color: "#93c5fd", shape: "sphere",    floatSpeed: 0.28, floatOffset: 2.2, floatAmp: 0.12, emissiveIntensity: 2.0 },
  { position: [1.2, -0.8,  1.5], size: 0.07, color: "#7dd3fc", shape: "sphere",    floatSpeed: 0.35, floatOffset: 3.5, floatAmp: 0.10, emissiveIntensity: 2.0 },
  { position: [-1.0, 0.9, -1.0], size: 0.07, color: "#93c5fd", shape: "sphere",    floatSpeed: 0.25, floatOffset: 4.8, floatAmp: 0.11, emissiveIntensity: 2.0 },
  { position: [0.5,  2.8, -0.8], size: 0.06, color: "#7dd3fc", shape: "sphere",    floatSpeed: 0.40, floatOffset: 0.5, floatAmp: 0.09, emissiveIntensity: 1.8 },
  { position: [-0.3,-2.5,  1.2], size: 0.05, color: "#93c5fd", shape: "sphere",    floatSpeed: 0.45, floatOffset: 1.7, floatAmp: 0.08, emissiveIntensity: 1.6 },
  { position: [1.5,  0.3, -1.8], size: 0.05, color: "#7dd3fc", shape: "sphere",    floatSpeed: 0.38, floatOffset: 5.1, floatAmp: 0.09, emissiveIntensity: 1.6 },
  { position: [-1.3, 2.0,  1.3], size: 0.05, color: "#93c5fd", shape: "sphere",    floatSpeed: 0.42, floatOffset: 2.9, floatAmp: 0.08, emissiveIntensity: 1.6 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Network Scene — inner R3F component
// ─────────────────────────────────────────────────────────────────────────────
function NetworkScene() {
  const groupRef = useRef<THREE.Group>(null!)
  const centralRef = useRef<THREE.Mesh>(null!)
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  // Static line geometry built from initial node positions
  const linePositions = useMemo(() => {
    const positions: number[] = []
    const pts = NODE_DEFINITIONS.map((n) => new THREE.Vector3(...n.position))
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < CONNECTION_DISTANCE) {
          positions.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z)
        }
      }
    }
    return new Float32Array(positions)
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Whole scene: slow cinematic Y rotation + gentle breathing on X
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.034
      groupRef.current.rotation.x = Math.sin(t * 0.017) * 0.07
    }

    // Central icosahedron spins on its own axis (active "mind" metaphor)
    if (centralRef.current) {
      centralRef.current.rotation.y = t * 0.4
      centralRef.current.rotation.z = t * 0.25
    }

    // Individual node floating — very subtle so line mismatch is invisible
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const n = NODE_DEFINITIONS[i]
      mesh.position.y = n.position[1] + Math.sin(t * n.floatSpeed + n.floatOffset) * n.floatAmp
      mesh.position.x = n.position[0] + Math.cos(t * n.floatSpeed * 0.6 + n.floatOffset) * n.floatAmp * 0.4
    })
  })

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          {/* @ts-expect-error – R3F bufferAttribute via args tuple */}
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.07} />
      </lineSegments>

      {/* Nodes */}
      {NODE_DEFINITIONS.map((node, i) => {
        const isCentral = node.shape === "icosahedron"

        return (
          <mesh
            key={i}
            ref={(el) => {
              meshRefs.current[i] = el
              if (isCentral && el) (centralRef as React.MutableRefObject<THREE.Mesh>).current = el
            }}
            position={node.position}
          >
            {node.shape === "icosahedron" && (
              <icosahedronGeometry args={[node.size, 1]} />
            )}
            {node.shape === "octahedron" && (
              <octahedronGeometry args={[node.size, 0]} />
            )}
            {node.shape === "sphere" && (
              <sphereGeometry args={[node.size, 10, 10]} />
            )}
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={node.emissiveIntensity}
              roughness={0.15}
              metalness={0.6}
              toneMapped={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported Canvas wrapper
// ─────────────────────────────────────────────────────────────────────────────
export default function ThreeDScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 65 }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Dark background matching the boot screen palette */}
      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={0.04} />

      <NetworkScene />

      <EffectComposer>
        <Bloom
          intensity={1.1}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  )
}
