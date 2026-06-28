// ─────────────────────────────────────────────────────────────────────────────
// POINTER BUS (raw singleton)
//
// One normalized pointer signal (-1..1, +y is up) shared across the whole app.
// The R3F particle layers read this in their useFrame loops and damp toward it
// (so they can't consume React context — they live in a separate reconciler).
// The DOM layers consume the spring-smoothed version via contexts/pointer-context.
//
// Written once by PointerProvider's single mousemove listener — no duplicate
// per-component listeners. This is the same plain-ref pattern as formation-state.
// ─────────────────────────────────────────────────────────────────────────────

export const pointerState = { x: 0, y: 0 }

// Click ripple — set on pointerdown (value 1, origin in NDC -1..1). The field
// damps `value` back to 0, expanding a displacement ring from (x, y) as it fades.
export const fieldPulse = { value: 0, x: 0, y: 0 }

// Rail hover lean — the chapter index currently hovered in the ChapterRail
// (-1 = none). The field eases its camera a little toward that chapter's
// vantage as a "preview lean", then returns when the hover ends.
export const railHover = { chapter: -1 }
