"use client"

import type React from "react"

import { useRef, useState } from "react"
import { SectionWrapper } from "@/components/section-wrapper"
import { AnimatePresence, motion } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { childRise, childRiseHeavy, childSlide, EASE_SETTLE } from "@/lib/motion"
import { DecodeText } from "@/components/decode-text"
import { InBrief } from "@/components/primitives"
import { LogicLens } from "@/components/logic-lens"
import { accentHex } from "@/lib/chapter-palette"
import { SKILLS } from "@/lib/profile"
import { cn } from "@/lib/utils"

// Scene 02 is interactive: pick a capability, then drag the seam between its
// raw logic and the experience it becomes. (Method, by contrast, PLAYS.)
const CAPABILITIES = [
  {
    title: "Product & interaction",
    caption: "A flowchart becomes screens people can actually move through.",
    tags: ["Web + mobile", "Prototypes", "Handoff"],
  },
  {
    title: "Design systems",
    caption: "Tokens and rules become components a team can ship with.",
    tags: ["Tokens", "Components", "WCAG 2.1"],
  },
  {
    title: "Research & evaluation",
    caption: "A wall of raw notes becomes one insight worth building on.",
    tags: ["Interviews", "Usability", "A/B tests"],
  },
  {
    title: "AI, data & systems",
    caption: "A model's JSON becomes feedback a person can act on.",
    tags: ["AI workflows", "AI evaluation", "Dashboards"],
  },
]

const recruiterBrief = [
  "End-to-end: research through high-fidelity UI and handoff",
  "Specialized in AI products and data-heavy tools",
  "Design systems: tokens, components, WCAG 2.1",
]

export function CapabilitiesSection() {
  const { viewMode } = useViewMode()
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const pigment = accentHex(2)

  // ARIA tabs — ↑/↓ (and ←/→) move between capabilities while focused.
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const n = CAPABILITIES.length
    let next = -1
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n
    if (next < 0) return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <SectionWrapper id="chapter-2" windowTitle="SHIFT · FROM LOGIC TO EXPERIENCE" moduleLabel="SHIFT · FROM LOGIC TO EXPERIENCE">
      <div className="relative flex flex-col gap-9">
        <div className="grid @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 @3xl:gap-12 items-end">
          <div className="space-y-6">
            <motion.div variants={childRise} initial="hidden" animate="show" custom={0}>
              <span className="eyebrow">Scene 02 · Shift</span>
            </motion.div>
            <motion.h2 variants={childRiseHeavy} initial="hidden" animate="show" custom={1} className="display-lg text-bone">
              <span className="ink-dim">From logic</span>
              <br />
              <span className="ink-dim">to </span>
              <DecodeText text="experience." delay={300} className="ink-accent" />
            </motion.h2>
          </div>

          <motion.div key={viewMode} variants={childRise} initial="hidden" animate="show" custom={2} className="space-y-5">
            <p className="lede">Every capability starts as logic. Drag the seam to watch it become experience.</p>
            {viewMode === "recruiter" && <InBrief items={recruiterBrief} />}
          </motion.div>
        </div>

        <div className="grid @3xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] gap-5 @3xl:gap-8 items-start">
          {/* ── Capability list ───────────────────────────────────── */}
          <motion.div
            variants={childSlide}
            initial="hidden"
            animate="show"
            custom={3}
            role="tablist"
            aria-label="Capabilities"
            aria-orientation="vertical"
            className="flex @3xl:flex-col gap-1.5 overflow-x-auto @3xl:overflow-visible scrollbar-hide -mx-1 px-1"
          >
            {CAPABILITIES.map((c, i) => {
              const on = i === active
              return (
                <button
                  key={c.title}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  role="tab"
                  id={`cap-tab-${i}`}
                  aria-selected={on}
                  aria-controls="cap-lens"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={cn(
                    "group relative flex-shrink-0 text-left rounded-[12px] border px-4 py-3 transition-colors duration-300",
                    on ? "border-chapter/50 bg-chapter/[0.07]" : "border-transparent hover:border-hair-2",
                  )}
                >
                  <span className="flex items-baseline gap-3">
                    <span className={cn("font-mono text-[10.5px] tabular-nums", on ? "text-chapter" : "text-bone-4")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={cn("whitespace-nowrap text-[15px] tracking-[-0.015em] transition-colors", on ? "text-bone" : "text-bone-3 group-hover:text-bone-2")}>
                      {c.title}
                    </span>
                  </span>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span
                        key="detail"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE_SETTLE }}
                        className="hidden @3xl:block overflow-hidden pl-[34px]"
                      >
                        <span className="block pt-2 text-[13px] leading-[1.5] text-bone-3">{c.caption}</span>
                        <span className="block pt-2 font-mono text-[10px] text-bone-3">{c.tags.join("  ·  ")}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </motion.div>

          {/* ── The lens ─────────────────────────────────────────── */}
          <motion.div
            variants={childSlide}
            initial="hidden"
            animate="show"
            custom={4}
            id="cap-lens"
            role="tabpanel"
            aria-labelledby={`cap-tab-${active}`}
            className="space-y-2.5"
          >
            <LogicLens view={active} pigment={pigment} />
            <div className="flex items-center justify-between gap-4 font-mono text-[10.5px] text-bone-3">
              <span className="@3xl:hidden text-bone-2">{CAPABILITIES[active].caption}</span>
              <span className="hidden @3xl:inline">← drag the seam →</span>
              <span className="tabular-nums whitespace-nowrap">
                SH 0{active + 1} / 0{CAPABILITIES.length}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Toolkit — one line, not a list */}
        <motion.p
          variants={childRise}
          initial="hidden"
          animate="show"
          custom={6}
          className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-hair pt-4"
        >
          <span className="label-mono">Toolkit</span>
          <span className="font-mono text-[11px] leading-[1.7] text-bone-2">{SKILLS.tools.join("  ·  ")}</span>
        </motion.p>
      </div>
    </SectionWrapper>
  )
}
