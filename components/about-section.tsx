"use client"

import { useState } from "react"
import { SectionWrapper } from "@/components/section-wrapper"
import { useViewMode } from "@/contexts/view-mode-context"
import { AnimatePresence, motion } from "framer-motion"
import { Plus } from "lucide-react"
import { childRise, childRiseHeavy, childSlide, EASE_SETTLE } from "@/lib/motion"
import { DecodeText } from "@/components/decode-text"
import { InBrief } from "@/components/primitives"
import { Panel } from "@/components/storyboard"
import { EDUCATION, EXPERIENCE, type Role } from "@/lib/profile"

// The origin, told in four frames.
const PANELS = [
  { shot: "SH 01", title: "Engineering", meta: "’18–’22", caption: "Logic, data structures, systems under pressure.", sketch: "logic" },
  { shot: "SH 02", title: "Enterprise delivery", meta: "Wipro", caption: "Ambiguous asks → flows engineers can ship.", sketch: "deliver" },
  { shot: "SH 03", title: "Information systems", meta: "UMBC", caption: "Workflows, research, people and data.", sketch: "network" },
  { shot: "SH 04", title: "Design systems for AI", meta: "Now", caption: "Founding designer at Hirello → TasteMakers.", sketch: "components" },
]

const recruiterBrief = [
  "Engineering + IS background, fluent with engineers, APIs, data",
  "Founding-designer reps: ambiguity, speed, ownership",
  "Design systems: tokens, hierarchy, consistency",
]

// The long version — one click away, never in the way.
const LONG_STORY = [
  "I didn't start in design. I started in Computer Engineering: writing logic, understanding data structures, and learning how systems hold together under pressure.",
  "I was trained to think in constraints: inputs and outputs, architecture before interface. But my attention kept drifting from how systems worked to how people experienced them.",
  "My Master's in Information Systems made the shift clear: mapping workflows, studying decision systems, understanding how data, processes, and people intersect. Across every role I gravitated to the translation layer: messy requirements into structured flows, technical systems explained to non-technical people.",
  "Today that lives in design systems for AI products at TasteMakers: tokens, hierarchy, and consistency that let teams move fast without the product falling apart.",
]

/** One résumé row — collapses to title + org, expands to the highlights. */
function LedgerRow({ role, open, onToggle, index }: { role: Role; open: boolean; onToggle: () => void; index: number }) {
  const panelId = `role-${role.org.replace(/\W+/g, "-").toLowerCase()}`
  return (
    <motion.li variants={childSlide} initial="hidden" animate="show" custom={8 + index} className="border-b border-hair">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="group w-full grid grid-cols-[1fr_auto] items-center gap-4 py-3.5 text-left"
      >
        <span className="min-w-0">
          <span className="flex items-baseline justify-between gap-3">
            <span className="text-[15px] leading-snug tracking-[-0.015em] text-bone">{role.role}</span>
            <span className="flex items-center gap-2 font-mono text-[10.5px] text-bone-3 tabular-nums whitespace-nowrap">
              {role.current && <span className="live-dot" aria-hidden />}
              {role.short}
            </span>
          </span>
          <span className="mt-0.5 block text-[12.5px] text-bone-3">
            {role.org}
            {role.orgNote && <span> · {role.orgNote}</span>}
          </span>
        </span>
        <span
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-full border border-hair-2 text-bone-2 transition-colors group-hover:border-chapter group-hover:bg-chapter group-hover:text-[#111110]"
        >
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.35, ease: EASE_SETTLE }}>
            <Plus className="h-3.5 w-3.5" strokeWidth={1.6} />
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_SETTLE }}
            className="overflow-hidden"
          >
            <ul className="pb-4 pr-11 space-y-1.5">
              {role.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-[13px] leading-[1.55] text-bone-2">
                  <span aria-hidden className="mt-[0.62em] h-[4px] w-[4px] flex-shrink-0 rounded-[1px] bg-bone-4" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}

export function AboutSection() {
  const { viewMode } = useViewMode()
  // The current role opens by default — it's what a visitor came to check.
  const [openOrg, setOpenOrg] = useState<string | null>(EXPERIENCE[0]?.org ?? null)
  const [longOpen, setLongOpen] = useState(false)

  return (
    <SectionWrapper id="chapter-1" windowTitle="ORIGIN · THE SYSTEMS BACKGROUND" moduleLabel="ORIGIN · THE SYSTEMS BACKGROUND">
      <div className="space-y-10">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="grid @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 @3xl:gap-12 items-end">
          <div className="space-y-6">
            <motion.div variants={childRise} initial="hidden" animate="show" custom={0}>
              <span className="eyebrow">Scene 01 · Origin</span>
            </motion.div>
            <motion.h2 variants={childRiseHeavy} initial="hidden" animate="show" custom={1} className="display-lg text-bone">
              <span className="ink-dim">The</span> <DecodeText text="systems" delay={300} className="ink-accent" />
              <br />
              <span className="ink-dim">background.</span>
            </motion.h2>
          </div>
          <motion.div key={viewMode} variants={childRise} initial="hidden" animate="show" custom={2} className="space-y-5">
            <p className="lede">From writing the logic to designing how people move through it.</p>
            {viewMode === "recruiter" && <InBrief items={recruiterBrief} />}
          </motion.div>
        </div>

        {/* ── The four frames ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-x-4 gap-y-7">
          {PANELS.map((p, i) => (
            <Panel key={p.shot} {...p} index={i} />
          ))}
        </div>

        {/* ── The line it all adds up to ──────────────────────────────── */}
        <motion.p variants={childRise} initial="hidden" animate="show" custom={7} className="display-md max-w-[26ch] text-bone">
          <span className="ink-dim">Design isn&apos;t decoration.</span> It&apos;s system decisions.
        </motion.p>

        {/* ── Résumé ledger ───────────────────────────────────────────── */}
        <div className="grid @4xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-8 @4xl:gap-12">
          <div>
            <div className="flex items-baseline justify-between border-b border-hair pb-3">
              <span className="label-mono">Experience</span>
              <span className="label-mono tabular-nums">{String(EXPERIENCE.length).padStart(2, "0")}</span>
            </div>
            <ul>
              {EXPERIENCE.map((role, i) => (
                <LedgerRow
                  key={role.org}
                  role={role}
                  index={i}
                  open={openOrg === role.org}
                  onToggle={() => setOpenOrg((o) => (o === role.org ? null : role.org))}
                />
              ))}
            </ul>
          </div>

          <motion.div variants={childSlide} initial="hidden" animate="show" custom={12}>
            <div className="flex items-baseline justify-between border-b border-hair pb-3">
              <span className="label-mono">Education</span>
              <span className="label-mono tabular-nums">{String(EDUCATION.length).padStart(2, "0")}</span>
            </div>
            <ul>
              {EDUCATION.map((e) => (
                <li key={e.school} className="border-b border-hair py-3.5">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[15px] leading-snug tracking-[-0.015em] text-bone">{e.degree}</span>
                    <span className="font-mono text-[10.5px] text-bone-3 tabular-nums whitespace-nowrap">
                      {e.range.slice(-4)}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[12.5px] text-bone-3">{e.school}</span>
                </li>
              ))}
            </ul>

            {/* The long version, on request */}
            <button
              type="button"
              onClick={() => setLongOpen((v) => !v)}
              aria-expanded={longOpen}
              aria-controls="origin-long"
              className="group mt-5 inline-flex items-center gap-3 font-mono text-[12px] text-bone"
            >
              <span className="arrow-chip">
                <motion.span animate={{ rotate: longOpen ? 45 : 0 }} transition={{ duration: 0.35, ease: EASE_SETTLE }} className="flex">
                  <Plus className="h-3 w-3" strokeWidth={1.6} />
                </motion.span>
              </span>
              {longOpen ? "Close the long version" : "Read the long version"}
            </button>
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {longOpen && (
            <motion.div
              id="origin-long"
              key="long"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_SETTLE }}
              className="overflow-hidden"
            >
              <div className="grid @3xl:grid-cols-2 gap-x-10 gap-y-4 border-t border-hair pt-6 text-[14px] leading-[1.75] text-bone-3">
                {LONG_STORY.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}
