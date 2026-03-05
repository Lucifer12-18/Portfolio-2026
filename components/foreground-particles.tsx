"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useReadingStore } from "@/contexts/reading-store-context"

const FOREGROUND_PARTICLE_COUNT = 180

// Tunable feel constants
const FG_PARALLAX_STRENGTH = 0.18
const FG_PARALLAX_EASING = 0.12
const FG_SCROLL_Y_OFFSET = 0.3
const FG_SCROLL_Z_OFFSET = 0.2
const FG_SCROLL_INFLUENCE = 0.12

const FG_CHAPTER_COLORS: [number, number, number][] = [
  [0.133, 0.827, 0.933],
  [0.024, 0.714, 0.831],
  [0.486, 0.227, 0.929],
  [0.655, 0.545, 0.98],
  [0.22, 0.741, 0.973],
  [0.576, 0.773, 0.992],
  [0.878, 0.976, 1.0],
]

const fgVertexShader = /* glsl */ `
precision highp float;

#define PI 3.14159265359

attribute float aIndex;
attribute vec3 aRandom;

uniform float uTime;
uniform vec3 uColor;
uniform float uPixelRatio;

varying vec3 vColor;
varying float vAlpha;

// Simple 3D noise-ish wobble
float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

void main() {
  // Scatter in a loose shell around the camera, but bias some particles closer
  float radiusBase = 3.4 + aRandom.x * 4.0;
  float foregroundBias = mix(0.6, 1.0, aRandom.z);
  float radius = radiusBase * foregroundBias;
  float theta = aRandom.y * PI * 2.0;
  float phi = acos(1.0 - 2.0 * aRandom.z);

  vec3 basePos = vec3(
    radius * sin(phi) * cos(theta),
    radius * sin(phi) * sin(theta),
    radius * cos(phi)
  );

  // Slow drifting motion so wisps feel alive
  float t = uTime * 0.08;
  vec3 wobble =
    vec3(
      hash(basePos + vec3(t, 0.0, 0.0)),
      hash(basePos + vec3(0.0, t, 0.0)),
      hash(basePos + vec3(0.0, 0.0, t))
    ) - 0.5;

  // Slight per-point scale wobble so each particle feels unique (kept subtle)
  float wobbleAmp = mix(0.5, 1.0, aRandom.x);
  vec3 finalPos = basePos + wobble * wobbleAmp;

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Emphasize nearby points just a bit for depth, but avoid very large sprites
  float depthScale = clamp(7.0 / -mvPosition.z, 0.4, 1.6);
  float size = mix(5.0, 13.0, aRandom.x);
  gl_PointSize = size * depthScale * uPixelRatio;

  // Tiny per-particle brightness jitter around the target color (very subtle)
  float brightnessJitter = mix(-0.02, 0.04, aRandom.z);
  vColor = uColor * (1.0 + brightnessJitter);

  // Keep alpha quite low overall so this layer stays in the background
  vAlpha = mix(0.03, 0.14, aRandom.y);
}
`

const fgFragmentShader = /* glsl */ `
precision highp float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float d = length(p);
  if (d > 0.5) discard;

  float falloff = smoothstep(0.5, 0.0, d);
  float core = smoothstep(0.25, 0.0, d);

  float alpha = vAlpha * falloff;
  vec3 color = vColor + core * 0.35;

  gl_FragColor = vec4(color, alpha);
}
`

interface ForegroundParticleCloudProps {
  targetColor: [number, number, number]
  scrollProgress: number
}

function ForegroundParticleCloud({ targetColor, scrollProgress }: ForegroundParticleCloudProps) {
  const pointsRef = useRef<THREE.Points>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const mouseLerped = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))
  const scrollLerped = useRef(0)

  const { positions, indices, randoms } = useMemo(() => {
    const count = FOREGROUND_PARTICLE_COUNT
    const pos = new Float32Array(count * 3)
    const idx = new Float32Array(count)
    const rnd = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      idx[i] = i / count
      rnd[i * 3] = Math.random()
      rnd[i * 3 + 1] = Math.random()
      rnd[i * 3 + 2] = Math.random()
    }

    return { positions: pos, indices: idx, randoms: rnd }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Vector3(...FG_CHAPTER_COLORS[0]) },
      uPixelRatio: { value: 1.0 },
    }),
    [],
  )

  const targetColorVec = useMemo(
    () => new THREE.Vector3(targetColor[0], targetColor[1], targetColor[2]),
    [targetColor],
  )

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()

    // Smoothly follow mouse for gentle parallax
    const mouse = state.mouse
    const targetMouseX = mouse.x
    const targetMouseY = mouse.y
    mouseLerped.current.x += (targetMouseX - mouseLerped.current.x) * FG_PARALLAX_EASING
    mouseLerped.current.y += (targetMouseY - mouseLerped.current.y) * FG_PARALLAX_EASING

    // Smooth scroll influence
    scrollLerped.current += (scrollProgress - scrollLerped.current) * 0.08

    const parallaxX = -mouseLerped.current.x * FG_PARALLAX_STRENGTH
    const parallaxY = -mouseLerped.current.y * FG_PARALLAX_STRENGTH
    const scrollYOffset = scrollLerped.current * FG_SCROLL_Y_OFFSET
    const scrollZOffset = scrollLerped.current * FG_SCROLL_Z_OFFSET

    // Slow global rotation so wisps feel like they're drifting around viewer,
    // with just a hint of extra movement when the user scrolls.
    if (pointsRef.current) {
      const baseRotSpeed = 0.025 + Math.abs(scrollLerped.current) * FG_SCROLL_INFLUENCE
      pointsRef.current.rotation.y += delta * baseRotSpeed
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.025) * 0.05
    }

    if (groupRef.current) {
      groupRef.current.position.x = parallaxX
      groupRef.current.position.y = parallaxY + scrollYOffset
      groupRef.current.position.z = -scrollZOffset
    }

    // Softly blend color toward current chapter accent
    uniforms.uColor.value.lerp(targetColorVec, 0.08)
  })

  return (
    <group ref={groupRef}>
      <group ref={pointsRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          {/* @ts-expect-error – R3F bufferAttribute args tuple */}
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          {/* @ts-expect-error – R3F bufferAttribute args tuple */}
          <bufferAttribute attach="attributes-aIndex" args={[indices, 1]} />
          {/* @ts-expect-error – R3F bufferAttribute args tuple */}
          <bufferAttribute attach="attributes-aRandom" args={[randoms, 3]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={fgVertexShader}
          fragmentShader={fgFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      </group>
    </group>
  )
}

function ForegroundParticlesInner() {
  const { activeChapterIndex } = useReadingStore()
  const colorIndex = FG_CHAPTER_COLORS[activeChapterIndex] ? activeChapterIndex : 0
  const palette = FG_CHAPTER_COLORS[colorIndex] ?? FG_CHAPTER_COLORS[0]

  const { viewport } = useThree()

  // Track scroll progress within the main document, normalized 0–1
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || window.scrollY || 0
      const maxScroll = Math.max(doc.scrollHeight - doc.clientHeight, 1)
      const next = scrollTop / maxScroll
      setScrollProgress(next)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <ambientLight intensity={0.2} />
      <group position={[0, 0, 0]}>
        <ForegroundParticleCloud targetColor={palette} scrollProgress={scrollProgress} />
      </group>
    </>
  )
}

export default function ForegroundParticles() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <ForegroundParticlesInner />
    </Canvas>
  )
}

