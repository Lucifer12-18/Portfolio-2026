"use client"

import { useRef, useMemo } from "react"
import { formationWatchRef } from "@/lib/formation-state"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useReadingStore } from "@/contexts/reading-store-context"
import { damp } from "@/lib/motion"
import { pointerState, fieldPulse, railHover } from "@/lib/pointer-state"

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 1500

const CHAPTER_COLORS: [number, number, number][] = [
  [0.133, 0.827, 0.933], // 0 Prologue  — cyan
  [0.024, 0.714, 0.831], // 1 Origin    — teal
  [0.486, 0.227, 0.929], // 2 Shift     — violet
  [0.655, 0.545, 0.980], // 3 Method    — lavender
  [0.220, 0.741, 0.973], // 4 Cases     — sky
  [0.576, 0.773, 0.992], // 5 Notes     — ice blue
  [0.878, 0.976, 1.000], // 6 Epilogue  — white
]

const CHAPTER_BG = [
  "#0a0a0c", "#041822", "#0e0520", "#12032a",
  "#031018", "#061525", "#0a0a0c",
]

const CHAPTER_BLOOM = [0.75, 1.0, 1.2, 1.0, 0.9, 0.85, 0.65]

const CAM_TARGETS: [number, number, number][] = [
  [0.0, 0.0, 8.0],  // Prologue  — centered
  [-1.5, 0.5, 7.5],  // Origin    — lean into the helix
  [0.0, 1.0, 9.0],  // Shift     — pull back, see full torus
  [1.5, 0.3, 7.5],  // Method    — lean into the knot
  [0.5, -0.5, 8.0],  // Cases     — slightly below the lattice
  [0.0, 0.8, 8.5],  // Notes     — elevated, serene
  [0.0, 0.0, 10.0], // Epilogue  — far back, starburst fills view
]

// ─────────────────────────────────────────────────────────────────────────────
// GLSL VERTEX SHADER
//
// Each chapter maps to a mathematically generated formation.
// Transitions use curl noise displacement — particles flow like luminous
// spirit energy between shapes rather than teleporting.
//
//   0  Prologue  →  Fibonacci Sphere  (the universe before the story)
//   1  Origin    →  Double Helix      (DNA, foundations)
//   2  Shift     →  Torus             (transformation, cyclic change)
//   3  Method    →  Trefoil Knot      (interconnected, rhythmic)
//   4  Cases     →  Crystal Lattice   (structured, concrete work)
//   5  Notes     →  Wave Surface      (reflective, flowing thoughts)
//   6  Epilogue  →  Starburst         (expanding, opening up)
// ─────────────────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
precision highp float;

#define PI 3.14159265359
#define TAU 6.28318530718
#define GOLDEN 1.6180339887
#define N ${PARTICLE_COUNT.toFixed(1)}

attribute float aIndex;
attribute vec3 aRandom;

uniform float uTime;
uniform float uChapterFrom;
uniform float uChapterTo;
uniform float uTransition;
uniform float uPixelRatio;
uniform vec3 uColorFrom;
uniform vec3 uColorTo;
uniform vec2 uMouse;

// Pointer / click reactivity (B10) — all zero at rest, so the field is
// mathematically unchanged unless you sweep fast or click.
uniform float uPointerVel;   // 0..~1.5, rises with cursor speed, decays
uniform float uClickPulse;   // 1 → 0 after a click
uniform vec2  uClickOrigin;  // click origin in NDC
uniform float uAspect;       // viewport width / height

varying vec3 vColor;
varying float vAlpha;

// ─── Simplex 3D Noise (Ashima Arts / Stefan Gustavson) ──────────────────
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// ─── Curl Noise (approximate, divergence-free-ish) ──────────────────────
vec3 curlNoise(vec3 p) {
  float e = 0.1;

  float x1 = snoise(p + vec3(e, 0.0, 0.0));
  float x2 = snoise(p - vec3(e, 0.0, 0.0));
  float y1 = snoise(p + vec3(0.0, e, 0.0));
  float y2 = snoise(p - vec3(0.0, e, 0.0));
  float z1 = snoise(p + vec3(0.0, 0.0, e));
  float z2 = snoise(p - vec3(0.0, 0.0, e));

  return vec3(
    (y1 - y2) - (z1 - z2),
    (z1 - z2) - (x1 - x2),
    (x1 - x2) - (y1 - y2)
  ) / (2.0 * e);
}

// ─── Chapter Shape Functions ────────────────────────────────────────────

// 0 · Fibonacci sphere — meditative breathing
vec3 shapeSphere(float i, vec3 r, float t) {
  float phi = acos(1.0 - 2.0 * i);
  float theta = PI * (1.0 + sqrt(5.0)) * i * N;
  float radius = 3.0 + sin(t * 0.4 + r.x * TAU) * 0.15;
  return vec3(
    radius * sin(phi) * cos(theta),
    radius * sin(phi) * sin(theta),
    radius * cos(phi)
  );
}

// 1 · Double helix — DNA, foundational origins
vec3 shapeHelix(float i, vec3 r, float t) {
  float angle = i * 10.0 * PI;
  float y = (i - 0.5) * 8.0;
  float strand = step(0.5, r.x) * PI;
  float helixR = 1.8 + sin(t * 0.3 + i * 6.0) * 0.15;
  return vec3(
    cos(angle + strand) * helixR,
    y + sin(t * 0.2 + r.y * 3.0) * 0.1,
    sin(angle + strand) * helixR
  );
}

// 2 · Torus — cyclic transformation
vec3 shapeTorus(float i, vec3 r, float t) {
  float theta = i * TAU * 24.0;
  float phi = fract(i * GOLDEN) * TAU;
  float R = 2.8;
  float rr = 0.9 + r.x * 0.2;
  return vec3(
    (R + rr * cos(phi)) * cos(theta) + sin(t * 0.2) * 0.08,
    rr * sin(phi) + sin(t * 0.25 + i * 4.0) * 0.08,
    (R + rr * cos(phi)) * sin(theta)
  );
}

// 3 · Trefoil knot — interconnected rhythm
vec3 shapeKnot(float i, vec3 r, float t) {
  float a = i * TAU * 2.0;
  float R = 2.2;
  float rr = 0.6;
  float cx = (R + rr * cos(3.0 * a)) * cos(2.0 * a);
  float cy = rr * sin(3.0 * a);
  float cz = (R + rr * cos(3.0 * a)) * sin(2.0 * a);
  vec3 offset = (r - 0.5) * 0.4;
  return vec3(cx, cy, cz) + offset + sin(t * 0.3) * 0.05;
}

// 4 · Crystal lattice — structured, concrete
vec3 shapeLattice(float i, vec3 r, float t) {
  float idx = i * N;
  float side = ceil(pow(N, 1.0 / 3.0));
  float x = mod(idx, side);
  float y = mod(floor(idx / side), side);
  float z = floor(idx / (side * side));
  vec3 pos = (vec3(x, y, z) / side - 0.5) * 5.0;
  pos += (r - 0.5) * 0.15;
  pos += sin(t * 0.3 + pos * 0.5) * 0.06;
  return pos;
}

// 5 · Wave surface — reflective, flowing
vec3 shapeWave(float i, vec3 r, float t) {
  float side = sqrt(N);
  float idx = i * N;
  float col = mod(idx, side) / side;
  float row = floor(idx / side) / side;
  float x = (col - 0.5) * 8.0 + (r.x - 0.5) * 0.2;
  float z = (row - 0.5) * 8.0 + (r.z - 0.5) * 0.2;
  float y = sin(x * 0.7 + t * 0.3) * cos(z * 0.5 + t * 0.25) * 1.2;
  return vec3(x, y, z);
}

// 6 · Starburst — dissolving outward
vec3 shapeStarburst(float i, vec3 r, float t) {
  float phi = acos(1.0 - 2.0 * i);
  float theta = PI * (1.0 + sqrt(5.0)) * i * N;
  float radius = 0.5 + pow(i, 0.6) * 5.5 + sin(t * 0.4 + r.x * TAU) * 0.3;
  return vec3(
    radius * sin(phi) * cos(theta),
    radius * sin(phi) * sin(theta),
    radius * cos(phi)
  );
}

vec3 getShape(float i, vec3 r, float chapter, float t) {
  if (chapter < 0.5) return shapeSphere(i, r, t);
  if (chapter < 1.5) return shapeHelix(i, r, t);
  if (chapter < 2.5) return shapeTorus(i, r, t);
  if (chapter < 3.5) return shapeKnot(i, r, t);
  if (chapter < 4.5) return shapeLattice(i, r, t);
  if (chapter < 5.5) return shapeWave(i, r, t);
  return shapeStarburst(i, r, t);
}

// ─── Main ───────────────────────────────────────────────────────────────
void main() {
  vec3 posA = getShape(aIndex, aRandom, uChapterFrom, uTime);
  vec3 posB = getShape(aIndex, aRandom, uChapterTo, uTime);

  float t = smoothstep(0.0, 1.0, uTransition);

  // Spirit flow: turbulence peaks at transition midpoint
  // More dramatic scatter — particles visibly explode outward then reform
  float turbulence = sin(t * PI) * 2.8;
  vec3 noiseInput = mix(posA, posB, t) * 0.4 + uTime * 0.10;
  vec3 curl = curlNoise(noiseInput);

  vec3 finalPos = mix(posA, posB, t) + curl * turbulence;

  // Held breath when settled: very slow, very subtle — almost still
  // Fades out completely during transition so scatter feels pure
  float settled = 1.0 - sin(t * PI);
  finalPos += vec3(
    sin(uTime * 0.07 + aRandom.x * TAU) * 0.04,
    cos(uTime * 0.06 + aRandom.y * TAU) * 0.05,
    sin(uTime * 0.05 + aRandom.z * TAU) * 0.03
  ) * settled;

  // Subtle mouse-driven parallax — closer points react more
  float depth = clamp(length(finalPos) * 0.12, 0.2, 1.4);
  vec2 parallax = uMouse * depth * 0.45;
  finalPos.x += parallax.x;
  finalPos.y += parallax.y;

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // ── Pointer & click reactivity (screen space) ──────────────────────────
  // Gated by uPointerVel / uClickPulse (both 0 at rest) so the field is
  // untouched until you sweep the cursor fast or click.
  vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.0001);
  // (a) Parting: particles near a FAST-moving cursor get pushed aside, like water.
  vec2 toP = ndc - uMouse;
  toP.x *= uAspect;
  float pInfluence = smoothstep(0.45, 0.0, length(toP));
  gl_Position.xy += normalize(toP + 0.0001) * pInfluence * uPointerVel * 0.12 * gl_Position.w;
  // (b) Click ripple: an expanding ring of displacement from the click origin.
  vec2 toC = ndc - uClickOrigin;
  toC.x *= uAspect;
  float ringR = (1.0 - uClickPulse) * 1.3;                       // expands as the pulse fades
  float ring  = smoothstep(0.16, 0.0, abs(length(toC) - ringR)) * uClickPulse;
  gl_Position.xy += normalize(toC + 0.0001) * ring * 0.12 * gl_Position.w;

  // Size: swell dramatically during transition, subtle depth attenuation
  float baseSize = 2.0 + aRandom.x * 3.0;
  float sizePulse = 1.0 + sin(t * PI) * 1.1;
  float depthScale = clamp(8.0 / -mvPosition.z, 0.5, 2.0);
  gl_PointSize = baseSize * sizePulse * uPixelRatio * depthScale;

  // Color: blend palettes, bloom brighter during transition
  vColor = mix(uColorFrom, uColorTo, t);
  vColor += vec3(0.15, 0.18, 0.30) * sin(t * PI);

  vAlpha = 0.5 + aRandom.y * 0.4 + sin(t * PI) * 0.22;
}
`

// ─────────────────────────────────────────────────────────────────────────────
// GLSL FRAGMENT SHADER
// ─────────────────────────────────────────────────────────────────────────────

const fragmentShader = /* glsl */ `
precision highp float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;

  float alpha = smoothstep(0.5, 0.05, d) * vAlpha;
  float core = smoothstep(0.3, 0.0, d) * 0.3;

  gl_FragColor = vec4(vColor + core, alpha);
}
`

// ─────────────────────────────────────────────────────────────────────────────
// R3F INNER SCENE — runs inside the Canvas reconciler
// ─────────────────────────────────────────────────────────────────────────────

interface MorphingSceneProps {
  chapterIndex: number
  bloomRef: React.MutableRefObject<number>
}

function MorphingScene({ chapterIndex, bloomRef }: MorphingSceneProps) {
  const groupRef = useRef<THREE.Group>(null!)

  const chapterRef = useRef(chapterIndex)
  chapterRef.current = chapterIndex

  const transitionRef = useRef({ from: 0, to: 0, progress: 1.0 })
  const prevChapter = useRef(0)

  const camPos = useRef(new THREE.Vector3(...CAM_TARGETS[0]))
  const currentBg = useRef(new THREE.Color(CHAPTER_BG[0]))
  const targetBg = useRef(new THREE.Color(CHAPTER_BG[0]))

  const { positions, indices, randoms } = useMemo(() => {
    const count = PARTICLE_COUNT
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
      uChapterFrom: { value: 0.0 },
      uChapterTo: { value: 0.0 },
      uTransition: { value: 1.0 },
      uPixelRatio: { value: 1.0 },
      uColorFrom: { value: new THREE.Vector3(...CHAPTER_COLORS[0]) },
      uColorTo: { value: new THREE.Vector3(...CHAPTER_COLORS[0]) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPointerVel: { value: 0 },
      uClickPulse: { value: 0 },
      uClickOrigin: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
    }),
    [],
  )

  // Pointer-velocity tracking for the "parting" reactivity (B10).
  const prevPointer = useRef(new THREE.Vector2(0, 0))

  useFrame((state, delta) => {
    const chapter = chapterRef.current

    // Detect chapter change and start a new transition
    if (chapter !== prevChapter.current) {
      transitionRef.current = {
        from: prevChapter.current,
        to: chapter,
        progress: 0,
      }
      prevChapter.current = chapter
      targetBg.current.set(CHAPTER_BG[chapter] ?? CHAPTER_BG[0])
    }

    const tr = transitionRef.current

    // Animate transition progress (~3.2 s total — slow enough to appreciate
    // each shape morphing from one mathematical form into the next)
    if (tr.progress < 1.0) {
      tr.progress = Math.min(1.0, tr.progress + delta * 0.31)
    }

    // ── Uniforms ──────────────────────────────────────────────────────────
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uChapterFrom.value = tr.from
    uniforms.uChapterTo.value = tr.to
    uniforms.uTransition.value = tr.progress
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()

    // Ease mouse uniform toward the SHARED pointer bus (~150ms follow,
    // frame-rate independent). One signal feeds field + wisps + content.
    const uMouse = uniforms.uMouse.value as THREE.Vector2
    uMouse.x = damp(uMouse.x, pointerState.x, 5, delta)
    uMouse.y = damp(uMouse.y, pointerState.y, 5, delta)

    // ── Pointer / click reactivity (B10) ──────────────────────────────────
    // Cursor speed → uPointerVel (rises fast, decays); drives the "parting".
    const pdx = pointerState.x - prevPointer.current.x
    const pdy = pointerState.y - prevPointer.current.y
    prevPointer.current.set(pointerState.x, pointerState.y)
    const speed = Math.hypot(pdx, pdy) / Math.max(delta, 0.001)
    uniforms.uPointerVel.value = damp(uniforms.uPointerVel.value, Math.min(speed * 0.3, 1.0), 7, delta)
    // Click ripple — decays toward 0 (~1s); feed origin into the shader.
    fieldPulse.value = damp(fieldPulse.value, 0, 2.4, delta)
    uniforms.uClickPulse.value = fieldPulse.value
    ;(uniforms.uClickOrigin.value as THREE.Vector2).set(fieldPulse.x, fieldPulse.y)
    uniforms.uAspect.value = state.size.width / Math.max(state.size.height, 1)

    const fromColor = CHAPTER_COLORS[tr.from] ?? CHAPTER_COLORS[0]
    const toColor = CHAPTER_COLORS[tr.to] ?? CHAPTER_COLORS[0]
    uniforms.uColorFrom.value.set(fromColor[0], fromColor[1], fromColor[2])
    uniforms.uColorTo.value.set(toColor[0], toColor[1], toColor[2])

    // ── Camera ────────────────────────────────────────────────────────────
    // Camera sweeps decisively toward the new chapter, eases into place
    const camTarget = CAM_TARGETS[tr.to] ?? CAM_TARGETS[0]
    const camTransitionPeak = Math.sin(tr.progress * Math.PI)
    // Frame-rate-independent glide; faster during the scatter peak (same intent
    // as the old 0.028 + peak*0.012 per-frame factor, expressed as a damp rate).
    const camK = 1.8 + camTransitionPeak * 0.8
    // Rail-hover "preview lean" — when settled, ease ~14% toward the hovered
    // chapter's vantage, then return when the hover ends (B10).
    let camX = camTarget[0], camY = camTarget[1], camZ = camTarget[2]
    const hov = railHover.chapter
    if (hov >= 0 && hov !== tr.to && tr.progress > 0.98 && CAM_TARGETS[hov]) {
      const ht = CAM_TARGETS[hov]
      camX += (ht[0] - camX) * 0.14
      camY += (ht[1] - camY) * 0.14
      camZ += (ht[2] - camZ) * 0.14
    }
    camPos.current.x = damp(camPos.current.x, camX, camK, delta)
    camPos.current.y = damp(camPos.current.y, camY, camK, delta)
    camPos.current.z = damp(camPos.current.z, camZ, camK, delta)
    state.camera.position.copy(camPos.current)
    state.camera.lookAt(0, 0, 0)

    // ── Background ────────────────────────────────────────────────────────
    currentBg.current.r = damp(currentBg.current.r, targetBg.current.r, 0.9, delta)
    currentBg.current.g = damp(currentBg.current.g, targetBg.current.g, 0.9, delta)
    currentBg.current.b = damp(currentBg.current.b, targetBg.current.b, 0.9, delta)
    state.scene.background = currentBg.current

    // ── Bloom (synced to PersistentScene via shared ref) ──────────────────
    const baseBloom = CHAPTER_BLOOM[tr.to] ?? CHAPTER_BLOOM[0]
    const transitionBoost = Math.sin(tr.progress * Math.PI)
    // Bloom surges at transition peak, creating a brief luminous flash
    const boostedBloom = baseBloom * (1.0 + 0.75 * transitionBoost)
    bloomRef.current = damp(bloomRef.current, boostedBloom, 1.2, delta)

    // ── Rotation ──────────────────────────────────────────────────────────
    if (groupRef.current) {
      if (formationWatchRef.current) {
        // Formation watch window: content is absent, the 3D shape is the
        // entire experience. Rotate at a steady showcase speed — fast enough
        // to clearly present the shape from all angles over 2.6 s, with a
        // gentle tumble on X so it feels fully three-dimensional.
        groupRef.current.rotation.y += 0.11 * delta
        groupRef.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 0.045) * 0.14
      } else {
        // Normal operation: breath-hold slows rotation during the
        // scatter peak so the turbulence reads as chaos, not spin.
        const breathHold = 1.0 - Math.sin(tr.progress * Math.PI) * 0.82
        groupRef.current.rotation.y += 0.055 * delta * breathHold
        groupRef.current.rotation.x =
          Math.sin(state.clock.elapsedTime * 0.015) * 0.03
      }
    }
  })

  return (
    <group ref={groupRef}>
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
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED CANVAS WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

export default function PersistentScene() {
  const { activeChapterIndex } = useReadingStore()
  const bloomRef = useRef(0.75)

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 65 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "default" }}
      style={{ width: "100%", height: "100%" }}
    >
      <MorphingScene chapterIndex={activeChapterIndex} bloomRef={bloomRef} />
    </Canvas>
  )
}
