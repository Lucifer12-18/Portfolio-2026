# Animation System

The whole site is built around one core idea: content and the 3D particle field are made of the "same energy." When you switch chapters, the content collapses into light, the particles morph, and new content emerges from the light.

---

## Chapter Transition Flow

```
User navigates (click / arrow key / swipe)
        ↓
activeChapterIndex updates in ReadingStoreContext
        ↓
PageFlipContainer effect fires
        ↓
1. setIsWatching(true) → content unmounts → AnimatePresence fires EXIT variant
2. formationWatchRef.current = true → 3D scene enters showcase rotation
3. LuminousBurst erupts (radial color blast, same accent color as 3D bloom)
4. ParticleSystemStatus shows "▸ compiling.{formation}"
        ↓
[EXIT_DURATION_MS = 380ms — content animates out]
        ↓
[FORMATION_WATCH_MS = 2600ms — naked 3D field, user watches morph]
        ↓
[At ENTER_DELAY_MS - 680ms = 2300ms — status switches to "▸ render.complete"]
        ↓
[At ENTER_DELAY_MS = 2980ms total]
5. formationWatchRef.current = false
6. setDisplayedIndex(newIndex) → setIsWatching(false) (batched)
   → new content mounts → AnimatePresence fires ENTER variant
        ↓
[ENTER variant = 720ms — content expands from burst, desaturated → full color]
        ↓
[At ENTER_DELAY_MS + 400ms — ParticleSystemStatus clears]
```

---

## Animation Variants (pageFlipVariants)

Defined in `app/page.tsx`.

### EXIT (380ms)
Content contracts toward center via `clip-path`, brightness flares to white.
Reads as: "chapter energy returning to the field."

```js
exit: {
  opacity: 0,
  clipPath: "inset(32% 28% 32% 28% round 8px)",  // contracts inward
  filter: "blur(14px) brightness(3.5) saturate(0)",  // flares + desaturates
  scale: 0.96,
  transition: { duration: 0.38, ease: [0.88, 0, 1, 0] }
}
```

### ENTER (720ms)
Content expands from the burst center, starts completely grey (raw matter) and saturates into full color as it "compiles."

```js
animate: {
  opacity: 1,
  clipPath: "inset(0% 0% 0% 0% round 0px)",  // expands to full
  filter: "blur(0px) brightness(1) saturate(1)",  // resolves to normal
  scale: 1,
  transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] }
}
```

---

## LuminousBurst

A `fixed` overlay that erupts from the center of the viewport on chapter change. Fires immediately when `activeChapterIndex` changes (not waiting for content to exit — they overlap).

- Color: `ACCENT_COLORS[activeChapterIndex]` (matches the 3D particle bloom color)
- Scale: 0.3 → 1.0 → 1.4 → 1.9 (expanding like a shockwave)
- Opacity: 0 → 0.55 → 0.22 → 0 (fast rise, slow fade)
- Duration: 1.4s
- z-index: 8

---

## GradientOverlay

A persistent `fixed` radial gradient that subtly tints the background with the current chapter's accent color. Updates smoothly (0.8s ease) on chapter change. Very subtle — `rgba(r,g,b, 0.06)`.

---

## ParticleSystemStatus

Monospace status line at the bottom of the content frame. Visible only during transitions.

- Shows `"▸ compiling.{formationId}"` immediately after chapter change
- Switches to `"▸ render.complete"` at ENTER_DELAY_MS - 680ms
- Clears at ENTER_DELAY_MS + 400ms
- Font: JetBrains Mono / Fira Code, 9px, letter-spacing 0.13em
- Color: `rgba(34,211,238,0.28)` compiling → `rgba(34,211,238,0.6)` complete

---

## Accent Colors (per chapter)

| Chapter | Index | RGB |
|---|---|---|
| Prologue / HeroSection | 0 | 34, 211, 238 (cyan) |
| Origin / AboutSection | 1 | 6, 182, 212 (dark cyan) |
| Shift / CapabilitiesSection | 2 | 124, 58, 237 (purple) |
| Method / ProcessSection | 3 | 167, 139, 250 (lavender) |
| Work / WorkSection | 4 | 56, 189, 248 (sky blue) |
| Notes / NotesSection | 5 | 147, 197, 253 (light blue) |
| Epilogue / ContactSection | 6 | 224, 249, 255 (ice white) |

---

## Formation IDs (per chapter)

These are GLSL shape names used in the particle system:

| Chapter | Formation |
|---|---|
| 0 | fibonacci_sphere |
| 1 | double_helix |
| 2 | torus |
| 3 | trefoil_knot |
| 4 | crystal_lattice |
| 5 | wave_surface |
| 6 | starburst |

---

## Other Animations

- **Card hover** (`work-section.tsx`): `y: -4` on hover, shimmer line at top, blue glow border
- **Typewriter** (`TypewriterText` component): character-by-character reveal, configurable speed
- **ForegroundParticles**: subtle wisps above content layer (z-3), always running
- **Module badge**: appears on each section with monospace label
