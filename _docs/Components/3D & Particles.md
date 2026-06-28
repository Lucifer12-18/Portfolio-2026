# 3D & Particles

The 3D layer is the visual backbone of the site. It runs persistently behind all content and responds to chapter navigation.

---

## PersistentScene
**File:** `components/persistent-scene.tsx`

The main Three.js canvas. Loaded dynamically (`next/dynamic`, `ssr: false`) to avoid SSR issues with WebGL.

Reads `formationWatchRef` from `lib/formation-state.ts` to know when to enter "showcase rotation" mode (slower, more dramatic rotation during the formation-watch window between chapters).

**How it works:**
- Renders a `<Canvas>` from `@react-three/fiber`
- Mounts `<ThreeScene>` inside the canvas
- `formationWatchRef.current === true` → scene rotates more slowly/dramatically
- `formationWatchRef.current === false` → normal ambient rotation

---

## ThreeScene
**File:** `components/three-scene.tsx`

The actual particle system inside the canvas. Manages:
- Particle positions (computed per formation shape)
- Bloom/glow post-processing (`@react-three/postprocessing`)
- Formation morphing between chapter transitions
- Color bloom synced to chapter accent colors

**Formations (GLSL shape names):**
- `fibonacci_sphere` — classic sphere with Fibonacci spiral distribution
- `double_helix` — DNA-like double helix
- `torus` — donut shape
- `trefoil_knot` — knotted curve
- `crystal_lattice` — crystalline grid
- `wave_surface` — undulating plane
- `starburst` — radial burst pattern

> ⚠️ **Three.js version note:** This is r183. `CapsuleGeometry` doesn't exist in r183 — use `CylinderGeometry` or `SphereGeometry` instead if adding geometry.

---

## ForegroundParticles
**File:** `components/foreground-particles.tsx`

A separate, simpler particle layer rendered above the content (z-3). Very subtle wisps/dust that drift across the screen. Always running, not chapter-reactive. Creates depth — content feels like it exists inside the particle environment.

Also loaded dynamically (`ssr: false`).

---

## Signal: formationWatchRef
**File:** `lib/formation-state.ts`

```ts
export const formationWatchRef = { current: false }
```

A plain module-level ref (not React state, not context). Used as a cross-component signal:
- `app/page.tsx` sets it to `true` when entering the formation-watch window
- `components/persistent-scene.tsx` reads it on each animation frame
- Avoids triggering any React re-renders for what is just a behavior signal

---

## Performance Notes

- Three.js canvas is `fixed` and `pointer-events-none` — never blocks user interaction
- Postprocessing (bloom) adds GPU cost; if perf is bad on lower-end devices, check `@react-three/postprocessing` config in `three-scene.tsx`
- `ForegroundParticles` is intentionally simple to keep the frame budget reasonable
