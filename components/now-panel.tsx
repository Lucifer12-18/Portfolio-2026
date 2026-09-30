"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useReadingStore } from "@/contexts/reading-store-context"
import { CURRENT_ROLE, EXPERIENCE, PROFILE } from "@/lib/profile"
import { childSlide } from "@/lib/motion"
import { ActionLink } from "@/components/primitives"

// ─────────────────────────────────────────────────────────────────────────────
// NOW PANEL — right-rail résumé at a glance. The current role leads (it's the
// newest, most relevant fact), the three before it sit underneath as a quiet
// ledger. Everything reads from lib/profile.ts.
// ─────────────────────────────────────────────────────────────────────────────

export function NowPanel() {
  const { setActiveChapterIndex } = useReadingStore()
  const previous = EXPERIENCE.filter((r) => r !== CURRENT_ROLE)

  return (
    <motion.aside
      aria-label="Current role"
      variants={childSlide}
      initial="hidden"
      animate="show"
      custom={2}
      className="surface relative w-full overflow-hidden"
    >
      {/* Pigment hairline — the current role is the live thread */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-chapter via-chapter/40 to-transparent" />
      {/* ── Current ─────────────────────────────────────────────────── */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 label-mono">
            <span className="live-dot" aria-hidden />
            Now
          </span>
          <span className="label-mono tabular-nums">{CURRENT_ROLE.start} →</span>
        </div>

        <p className="mt-4 text-[19px] font-medium leading-[1.18] tracking-[-0.025em] text-bone">{CURRENT_ROLE.role}</p>
        <p className="mt-1.5 text-[13px] text-bone-3">
          {CURRENT_ROLE.org}
          {CURRENT_ROLE.orgNote && <span> · {CURRENT_ROLE.orgNote}</span>}
        </p>
        <p className="mt-3.5 text-[13px] leading-[1.55] text-bone-2">{CURRENT_ROLE.highlights[0]}</p>
      </div>

      {/* ── Previously ──────────────────────────────────────────────── */}
      <div className="border-t border-hair px-5 py-4">
        <p className="label-mono mb-2.5">Previously</p>
        <ul className="space-y-2.5">
          {previous.map((r) => (
            <li key={r.org} className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 text-[12.5px] leading-[1.4]">
              <span className="text-bone-2">{r.org}</span>
              <span className="font-mono text-[10.5px] text-bone-3 tabular-nums">{r.short}</span>
              <span className="col-span-2 text-[12px] text-bone-3">{r.role}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Actions ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-hair px-5 py-3.5">
        <a
          href={PROFILE.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-bone-2 hover:text-bone transition-colors"
        >
          Full résumé
          <ArrowUpRight className="h-3 w-3" strokeWidth={1.6} aria-hidden />
          <span className="sr-only">(opens in new tab)</span>
        </a>
        <ActionLink onClick={() => setActiveChapterIndex(1)} className="text-[11px]">
          Timeline
        </ActionLink>
      </div>
    </motion.aside>
  )
}
