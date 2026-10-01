// ─────────────────────────────────────────────────────────────────────────────
// STATS (client) — reports visits and tracked clicks to /api/stats.
//   · a VISITOR is a browser seen for the first time (localStorage plx.visitor)
//   · a SESSION is counted once per tab session (sessionStorage plx.session)
//   · EVENTS are named clicks (elements with data-track="…", or trackEvent())
// The visitor count is kept in a tiny store for the footer counter.
// ─────────────────────────────────────────────────────────────────────────────

type Listener = () => void

let visitors: number | null = null
let you: number | null = null // "you are visitor #n" (first visit only)
const listeners = new Set<Listener>()
const emit = () => listeners.forEach((l) => l())

export const visitorStore = {
  subscribe(l: Listener) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
  get: () => visitors,
  you: () => you,
}

let started = false

/** Count this visit (once per tab session) and load the visitor total. */
export async function trackVisit() {
  if (started || typeof window === "undefined") return
  started = true
  try {
    let first = false
    let newSession = true
    try {
      first = !window.localStorage.getItem("plx.visitor")
      newSession = !window.sessionStorage.getItem("plx.session")
    } catch {}

    const res = newSession
      ? await fetch("/api/stats", { method: "POST", body: JSON.stringify({ kind: "visit", first }), keepalive: true })
      : await fetch("/api/stats", { cache: "no-store" })
    const data = (await res.json()) as { enabled?: boolean; visitors?: number }
    if (!data.enabled) return

    try {
      if (first) window.localStorage.setItem("plx.visitor", "1")
      window.sessionStorage.setItem("plx.session", "1")
    } catch {}
    visitors = data.visitors ?? null
    if (first && newSession) you = visitors
    emit()
  } catch {
    // Stats are a nicety — never let them surface an error.
  }
}

/** Count a named click. Fire-and-forget; survives navigation via sendBeacon. */
export function trackEvent(name: string) {
  if (typeof window === "undefined") return
  const body = JSON.stringify({ kind: "event", name })
  try {
    if (navigator.sendBeacon?.("/api/stats", body)) return
  } catch {}
  void fetch("/api/stats", { method: "POST", body, keepalive: true }).catch(() => {})
}
