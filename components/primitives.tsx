"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { EASE_SETTLE } from "@/lib/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES — the small vocabulary of the "ink on charcoal" pass. Every chapter
// speaks through these instead of re-inventing buttons, summaries and labels.
// Styling lives in globals.css (.arrow-chip, .btn-*, .label-mono…); these only
// add structure + behaviour.
// ─────────────────────────────────────────────────────────────────────────────

/** Round arrow chip. Fills bone when an ancestor `.group` is hovered/focused. */
export function ArrowChip({ large, className }: { large?: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("arrow-chip", large && "arrow-chip-lg", className)}>
      <ArrowUpRight strokeWidth={1.6} />
    </span>
  )
}

type ActionLinkProps = {
  children: React.ReactNode
  className?: string
  /** Chip before the label instead of after. */
  chipFirst?: boolean
  /** Stats event name, counted on click (see lib/stats.ts). */
  track?: string
} & (
  | { href: string; external?: boolean; onClick?: never }
  | { onClick: () => void; href?: never; external?: never }
)

/** Mono label + arrow chip — the site's text-link / tertiary action. */
export function ActionLink(props: ActionLinkProps) {
  const { children, className, chipFirst, track } = props
  const cls = cn(
    "group inline-flex items-center gap-3 font-mono text-[12px] tracking-[0.01em] text-bone rounded-full",
    className,
  )
  const inner = (
    <>
      {chipFirst && <ArrowChip />}
      <span className="transition-colors group-hover:text-white">{children}</span>
      {!chipFirst && <ArrowChip />}
    </>
  )
  if ("href" in props && props.href) {
    return (
      <a
        href={props.href}
        data-track={track}
        className={cls}
        {...(props.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
        {props.external && <span className="sr-only">(opens in new tab)</span>}
      </a>
    )
  }
  return (
    <button type="button" onClick={props.onClick} data-track={track} className={cls}>
      {inner}
    </button>
  )
}

/** Recruiter-mode summary — hairline-ruled list, replaces the tinted boxes. */
export function InBrief({ items, label = "In brief", className }: { items: readonly string[]; label?: string; className?: string }) {
  return (
    <div className={cn("grid grid-cols-[auto_1fr] gap-x-6 gap-y-0 border-y border-hair py-3.5", className)}>
      <span className="label-mono pt-[3px]">{label}</span>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[14px] leading-[1.55] text-bone-2">
            <span aria-hidden className="mt-[0.62em] h-[4px] w-[4px] flex-shrink-0 rounded-[1px] bg-bone-4" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Vertical word cycle — one word at a time rolls up through a masked slot
 * (the TasteMakers "product / illustration / 3D…" gesture). Screen readers get
 * the full list once; reduced motion shows the first word, static.
 */
export function WordCycle({
  words,
  interval = 2400,
  className,
}: {
  words: readonly string[]
  interval?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduced || words.length < 2) return
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [reduced, words.length, interval])

  return (
    <span className={cn("relative inline-flex overflow-hidden align-bottom word-cycle-mask", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      {/* Invisible sizers stacked in one grid cell — the slot takes the widest
          RENDERED word (character count lies: "workflows" outruns "flows"). */}
      <span aria-hidden className="invisible grid">
        {words.map((w) => (
          <span key={w} className="col-start-1 row-start-1 whitespace-nowrap">
            {w}
          </span>
        ))}
      </span>
      {/* Every word stays mounted and just changes state (current / leaving /
          waiting below). No mount-unmount churn, so a throttled rAF (background
          tab, low-power) can never pile up half-finished transitions. */}
      {words.map((word, k) => {
        const n = words.length
        const state = k === i ? "current" : k === (i - 1 + n) % n ? "leaving" : "waiting"
        return (
          <motion.span
            key={word}
            aria-hidden
            className="absolute left-0 top-0 whitespace-nowrap"
            initial={false}
            animate={
              state === "current"
                ? { y: "0%", opacity: 1, filter: "blur(0px)" }
                : state === "leaving"
                  ? { y: "-100%", opacity: 0, filter: "blur(4px)" }
                  : { y: "100%", opacity: 0, filter: "blur(4px)" }
            }
            // Waiting words reset below instantly (they are invisible anyway)
            transition={state === "waiting" ? { duration: 0 } : { duration: 0.7, ease: EASE_SETTLE }}
          >
            {word}
          </motion.span>
        )
      })}
    </span>
  )
}
