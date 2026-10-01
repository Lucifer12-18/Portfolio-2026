"use client"

import { useEffect, useSyncExternalStore } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { trackEvent, trackVisit, visitorStore } from "@/lib/stats"
import { cn } from "@/lib/utils"

/**
 * Mount once (root layout). Counts the visit and turns every element marked
 * data-track="event_name" into a tracked click — no per-component wiring.
 */
export function StatsBeacon() {
  useEffect(() => {
    void trackVisit()
    const onClick = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-track]") : null
      const name = el?.dataset.track
      if (name) trackEvent(name)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])
  return null
}

export function useVisitors() {
  return useSyncExternalStore(visitorStore.subscribe, visitorStore.get, () => null)
}

/** "● 1,284 visitors" — quiet OS telemetry for the footer corner. */
export function VisitorCounter({ className }: { className?: string }) {
  const n = useVisitors()
  return (
    <AnimatePresence>
      {n !== null && n > 0 && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn("inline-flex items-center gap-2 whitespace-nowrap tabular-nums", className)}
          title="Unique visitors to this portfolio"
        >
          <span className="live-dot" aria-hidden />
          <span>
            <span className="text-bone-2">{n.toLocaleString("en-US")}</span> visitors
          </span>
        </motion.span>
      )}
    </AnimatePresence>
  )
}
