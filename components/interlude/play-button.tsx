"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { interlude } from "@/lib/interlude"
import { accentHex } from "@/lib/chapter-palette"
import { FormationGlyph } from "@/components/storyboard"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"

/** A tiny formation that keeps morphing through all seven shapes. */
function CyclingGlyph({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setI((n) => (n + 1) % 7), 1700)
    return () => window.clearInterval(id)
  }, [reduced])
  return (
    <span className={cn("relative block", className)} style={{ color: accentHex(i) }}>
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.25, rotate: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <FormationGlyph index={i} dot={4.2} gap={7.6} />
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Opens the Clarity interlude; the iris wipe grows out of this button. */
export function PlayButton({
  labelClassName = "hidden xl:inline",
  className,
}: {
  /** Visibility of the "Play" word — icon-only where space is tight. */
  labelClassName?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={(e) => interlude.open(e.currentTarget)}
      data-track="play_clarity"
      aria-label="Play Clarity, a small interactive interlude"
      title="Play · Clarity"
      className={cn(
        "group flex h-9 items-center gap-2 rounded-[9px] border border-hair-2 px-2.5 font-mono text-[11px] text-bone-2 transition-colors hover:border-chapter hover:text-bone",
        className,
      )}
    >
      <CyclingGlyph className="h-[14px] w-[22px] transition-transform duration-500 group-hover:scale-110" />
      <span className={labelClassName}>Play</span>
    </button>
  )
}
