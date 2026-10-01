// ─────────────────────────────────────────────────────────────────────────────
// TOUR store — whether the first-visit briefing is open. External store (same
// pattern as lib/interlude.ts) so page.tsx can yield the arrow keys and the
// footer can replay it without a provider.
// ─────────────────────────────────────────────────────────────────────────────

type Listener = () => void

export const TOUR_SEEN_KEY = "plx.tour.seen"

let open = false
const listeners = new Set<Listener>()
const emit = () => listeners.forEach((l) => l())

export const tour = {
  subscribe(l: Listener) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
  isOpen: () => open,
  open() {
    if (open) return
    open = true
    emit()
  },
  /** Close and remember — the briefing auto-plays once per visitor. */
  close() {
    if (!open) return
    open = false
    try {
      window.localStorage.setItem(TOUR_SEEN_KEY, "1")
    } catch {}
    emit()
  },
}
