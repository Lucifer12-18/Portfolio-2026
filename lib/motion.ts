// ─────────────────────────────────────────────────────────────────────────────
// THE CONSERVED CURRENT — shared motion system
//
// One luminous substance, observed at different scales. Every per-frame motion,
// every spring, every reveal in the portfolio routes through THIS module so the
// whole interface feels like one machine instead of a pile of effects.
//
// The cohesion test for any new effect: can it be wired to one of the three
// shared singletons — (1) this damp()/spring/easing set, (2) the pointer bus
// (contexts/pointer-context.tsx), (3) the active-chapter accent crossfade?
// If not, it doesn't ship.
// ─────────────────────────────────────────────────────────────────────────────

import type { Variants, Transition } from "framer-motion"

// ── (1) Frame-rate-independent damping ──────────────────────────────────────
//
// The law: every per-frame approach uses
//     current += (target - current) * (1 - exp(-lambda * dt))
// so 60Hz and 144Hz feel identical. No bare `* constant` lerp survives a
// useFrame loop. `lambda` (k) is a rate in 1/seconds: higher = snappier.
//
//   k ≈ 5   → ~150ms to close most of the gap (responsive follow)
//   k ≈ 1.8 → ~slow cinematic glide
//   k ≈ 0.9 → ~very slow color/atmosphere settle
//
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}

// Damp toward an angle (radians), taking the shortest path around the circle.
export function dampAngle(current: number, target: number, lambda: number, dt: number): number {
  let diff = (target - current) % (Math.PI * 2)
  if (diff > Math.PI) diff -= Math.PI * 2
  if (diff < -Math.PI) diff += Math.PI * 2
  return current + diff * (1 - Math.exp(-lambda * dt))
}

// ── (2) Easing — two curves only for DISCRETE motion ────────────────────────
//
// settle  — things arriving / resolving (long ease-out tail, has weight)
// depart  — things leaving / imploding (aggressive ease-in, energy returns to field)
//
// Continuous followers (cursor, parallax, magnetic) use the SPRING tokens below,
// never an ease. No new bezier ships without retiring one.
export const EASE_SETTLE = [0.16, 1, 0.3, 1] as const
export const EASE_DEPART = [0.88, 0, 1, 0] as const

// CSS-string equivalents (for inline `transition:` strings / non-framer code).
export const EASE_SETTLE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)"
export const EASE_DEPART_CSS = "cubic-bezier(0.88, 0, 1, 0)"

// ── Spring tokens — the shared physics family ───────────────────────────────
//
// FOLLOW — laggy followers that should feel like they have inertia
//          (cursor ring, pointer-bus parallax). Visible trail, never twitchy.
// SNAP   — discrete state changes that should feel tactile but weighted
//          (cursor dot/ring morph, click press). Quick settle, faint give.
// DRIFT  — gentle proximity / tilt reactions (magnetic, card tilt). Soft, slow.
// Bare numeric configs — pass these to useSpring(value, config).
export const FOLLOW_SPRING = { stiffness: 210, damping: 24, mass: 0.55 }
export const SNAP_SPRING = { stiffness: 380, damping: 26 }
export const DRIFT_SPRING = { stiffness: 220, damping: 20, mass: 0.45 }

// Transition forms — pass these to a framer `transition={...}` prop.
export const FOLLOW: Transition = { type: "spring", ...FOLLOW_SPRING }
export const SNAP: Transition = { type: "spring", ...SNAP_SPRING }
export const DRIFT: Transition = { type: "spring", ...DRIFT_SPRING }

// ── (3 supporting) Content cascade — one beat for every chapter ─────────────
//
// Chapters reveal top-to-bottom on ONE shared rhythm. Elements declare a reading
// order via `custom={index}`; timing comes from STAGGER/DELAY_CHILDREN here, so
// there are zero hand-tuned magic delays scattered across the 7 section files.
//
// Usage:
//   <motion.div variants={childRise} initial="hidden" animate="show" custom={0} />
//   ...heaviest element (headline) uses childRiseHeavy.
//
// Or, for a flat vertical stack, wrap in cascadeContainer and let the children
// stagger automatically (no custom index needed).
export const STAGGER = 0.06
export const DELAY_CHILDREN = 0.18

type CascadeCustom = number | undefined

const settleTransition = (i: CascadeCustom, duration: number): Transition => ({
  delay: DELAY_CHILDREN + (i ?? 0) * STAGGER,
  duration,
  ease: EASE_SETTLE,
})

// Standard content element — rises and de-blurs into place.
export const childRise: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: (i: CascadeCustom) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: settleTransition(i, 0.55),
  }),
}

// Heaviest element (chapter headline) — more mass: longer travel, longer tail.
// The slight start-scale makes it CONDENSE out of the burst centroid (materialise)
// rather than merely rise — the emergence half of the burst seam handoff (B9).
export const childRiseHeavy: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.94, filter: "blur(8px)" },
  show: (i: CascadeCustom) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: settleTransition(i, 0.85),
  }),
}

// Side-entry variant (mini-windows / right-column cards) — same beat, drifts in
// from the side so asymmetric columns still read as one cascade.
export const childSlide: Variants = {
  hidden: { opacity: 0, x: 22, y: 6, filter: "blur(6px)" },
  show: (i: CascadeCustom) => ({
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: settleTransition(i, 0.6),
  }),
}

// Container for flat vertical stacks — staggers its direct variant children.
export const cascadeContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: STAGGER, delayChildren: DELAY_CHILDREN },
  },
}

// Reduced-motion: instant, no transform. Spread onto a child to opt a single
// element out; global handling is via <MotionConfig reducedMotion="user">.
export const childInstant: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
}
