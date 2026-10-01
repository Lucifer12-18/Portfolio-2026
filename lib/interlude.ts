// ─────────────────────────────────────────────────────────────────────────────
// INTERLUDE store — whether the Clarity game overlay is open, and where the
// iris wipe should originate (the button that opened it). A tiny external store
// so the navbar, the Epilogue and page.tsx can all talk to it without a
// provider (same pattern as lib/sound.ts).
// ─────────────────────────────────────────────────────────────────────────────

type Listener = () => void

interface InterludeState {
  open: boolean
  /** Viewport coords the iris opens from / closes into. */
  origin: { x: number; y: number }
}

let state: InterludeState = { open: false, origin: { x: 0, y: 0 } }
const listeners = new Set<Listener>()
const emit = () => listeners.forEach((l) => l())

export const interlude = {
  subscribe(l: Listener) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
  get: () => state,
  isOpen: () => state.open,
  /** Open from an element (its centre becomes the iris origin) or a point. */
  open(from?: Element | { x: number; y: number }) {
    let origin = { x: typeof window !== "undefined" ? window.innerWidth / 2 : 0, y: 80 }
    if (from && "getBoundingClientRect" in from) {
      const r = from.getBoundingClientRect()
      origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    } else if (from) origin = from
    state = { open: true, origin }
    emit()
  },
  close() {
    if (!state.open) return
    state = { ...state, open: false }
    emit()
  },
}
