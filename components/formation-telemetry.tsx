"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EASE_SETTLE } from "@/lib/motion"

// ─────────────────────────────────────────────────────────────────────────────
// FORMATION TELEMETRY — the diegetic instrumentation of the watch window.
//
// During the kept ~2.6s "formation watch" (content unmounted, naked particle
// field morphing), this frames the exposed field with corner brackets and a
// live readout in the DESTINATION chapter's accent — the OS visibly "compiling"
// the next chapter from the field. It is NEVER on while content is present, so
// it reads as the field's own instrumentation, not UI decoration.
//
// Vocabulary is borrowed wholesale from elsewhere in the build (cursor reticle
// brackets, ParticleSystemStatus mono styling, the crt scanline) so it feels
// native — one machine, not a new effect.
// ─────────────────────────────────────────────────────────────────────────────

interface FormationTelemetryProps {
  active: boolean
  /** Destination chapter accent, rgb triple. */
  accent: { r: number; g: number; b: number }
  /** GLSL formation name being built, e.g. "torus". */
  formation: string
  /** Total watch duration in ms — the binding readout fills over this. */
  durationMs: number
}

export function FormationTelemetry({ active, accent, formation, durationMs }: FormationTelemetryProps) {
  const { r, g, b } = accent
  const rgb = `${r}, ${g}, ${b}`

  // ── Binding readout: 0.00 → 1.00 across the watch window ──────────────────
  const [binding, setBinding] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (!active) {
      setBinding(0)
      return
    }
    const start = performance.now()
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / durationMs)
      // ease-out so the count decelerates as it "locks in"
      setBinding(1 - Math.pow(1 - p, 2))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, durationMs])

  // Corner bracket geometry — reuses the cursor reticle bracket language.
  const corners = [
    { top: 10, left: 10, borderTop: true, borderLeft: true },
    { top: 10, right: 10, borderTop: true, borderRight: true },
    { bottom: 10, left: 10, borderBottom: true, borderLeft: true },
    { bottom: 10, right: 10, borderBottom: true, borderRight: true },
  ]

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="telemetry"
          className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE_SETTLE } }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE_SETTLE } }}
          aria-hidden
        >
          {/* Corner brackets — frame the exposed field */}
          {corners.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.05 * i, ease: EASE_SETTLE } }}
              style={{
                position: "absolute",
                width: 22,
                height: 22,
                top: c.top,
                left: c.left,
                right: c.right,
                bottom: c.bottom,
                borderTop: c.borderTop ? `1px solid rgba(${rgb}, 0.45)` : undefined,
                borderLeft: c.borderLeft ? `1px solid rgba(${rgb}, 0.45)` : undefined,
                borderRight: c.borderRight ? `1px solid rgba(${rgb}, 0.45)` : undefined,
                borderBottom: c.borderBottom ? `1px solid rgba(${rgb}, 0.45)` : undefined,
              }}
            />
          ))}

          {/* Scanline sweep — accent-tinted, slow */}
          <div
            className="absolute left-0 right-0"
            style={{
              height: 140,
              background: `linear-gradient(to bottom, transparent 0%, rgba(${rgb}, 0.05) 45%, rgba(${rgb}, 0.08) 50%, rgba(${rgb}, 0.05) 55%, transparent 100%)`,
              animation: "crt-scanline-sweep 2.4s linear infinite",
            }}
          />

          {/* Centre HUD readout — the OS compiling the formation */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 select-none"
            style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
          >
            <span style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: `rgba(${rgb}, 0.5)` }}>
              compiling formation
            </span>
            <span style={{ fontSize: 15, letterSpacing: "0.16em", color: `rgba(${rgb}, 0.85)`, fontWeight: 500 }}>
              {formation}
            </span>

            {/* Binding bar */}
            <div className="flex items-center gap-2 mt-1" style={{ fontSize: 9, letterSpacing: "0.1em", color: `rgba(${rgb}, 0.55)` }}>
              <span>vertices 1500</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>binding</span>
              <span
                style={{
                  position: "relative",
                  width: 90,
                  height: 2,
                  background: `rgba(${rgb}, 0.15)`,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    transformOrigin: "left",
                    transform: `scaleX(${binding})`,
                    background: `rgba(${rgb}, 0.7)`,
                    boxShadow: `0 0 6px rgba(${rgb}, 0.6)`,
                  }}
                />
              </span>
              <span style={{ width: 34, textAlign: "right", color: `rgba(${rgb}, 0.75)` }}>
                {binding.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
