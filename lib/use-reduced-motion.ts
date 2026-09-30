"use client"

import { useEffect, useState } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// REDUCED MOTION — the single source of truth for motion accommodation.
//
// Every component that adapts to `prefers-reduced-motion` reads THIS module
// (no scattered matchMedia calls), so the whole site flips together.
//
// Dev/test override: adding `?reducedMotion` to the URL forces it on — the OS
// setting can't be toggled from automated previews, so this makes the entire
// reduced path testable end-to-end.
// ─────────────────────────────────────────────────────────────────────────────

function queryOverride(): boolean {
  if (typeof window === "undefined") return false
  return new URLSearchParams(window.location.search).has("reducedMotion")
}

/** Reactive hook — SSR-safe (false on server / first paint, then syncs). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (queryOverride()) {
      setReduced(true)
      return
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return reduced
}

/** Imperative accessor for event handlers / one-shot effects (non-reactive). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return queryOverride() || window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
