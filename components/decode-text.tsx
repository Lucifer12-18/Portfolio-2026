"use client"

import { useEffect, useRef, useState } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// DECODE TEXT — scramble-resolve reveal.
//
// The text "compiles" into place: starts as cycling mono glyphs and resolves
// left-to-right to the real string. Used on chapter headlines as the final beat
// of the cascade, so the literal thesis lands — particles form the shape, the
// telemetry binding completes, and the headline finishes compiling, all one event.
//
// Subtle + fast by default so it reads as "the OS resolving text", not a gimmick.
// Renders the FINAL text on the server / first paint (no hydration mismatch, and
// screen readers always get the real text via aria-label); the scramble runs on
// mount via rAF and is skipped entirely under prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

const GLYPHS = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789/<>{}[]#*+=_".split("")

interface DecodeTextProps {
  text: string
  className?: string
  /** Resolve duration in ms. Default 460 (fast). */
  duration?: number
  /** Delay before scrambling begins, in ms. Default 0. */
  delay?: number
}

export function DecodeText({ text, className, duration = 460, delay = 0 }: DecodeTextProps) {
  const [display, setDisplay] = useState(text)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text)
      return
    }

    let startTime = 0
    const beginAt = performance.now() + delay
    let started = false

    const run = (now: number) => {
      if (now < beginAt) {
        // Hold fully scrambled until the delay elapses (so it reads as "queued").
        setDisplay(scramble(text, now, text.length))
        rafRef.current = requestAnimationFrame(run)
        return
      }
      if (!started) {
        started = true
        startTime = now
      }
      const p = Math.min(1, (now - startTime) / duration)
      const revealCount = Math.floor(p * text.length)
      setDisplay(scramble(text, now, revealCount))
      if (p < 1) rafRef.current = requestAnimationFrame(run)
      else setDisplay(text)
    }

    rafRef.current = requestAnimationFrame(run)
    return () => cancelAnimationFrame(rafRef.current)
  }, [text, duration, delay])

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  )
}

// Reveal the first `revealCount` chars as real, the rest as cycling glyphs.
// Spaces are preserved so word shape stays stable while it resolves.
function scramble(text: string, now: number, revealCount: number): string {
  let out = ""
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === " " || ch === "\n") {
      out += ch
    } else if (i < revealCount) {
      out += ch
    } else {
      out += GLYPHS[(Math.floor(now / 36) + i * 7) % GLYPHS.length]
    }
  }
  return out
}
