"use client"

import { SectionWrapper } from "@/components/section-wrapper"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { useReadingStore } from "@/contexts/reading-store-context"
import { Magnetic } from "@/components/magnetic"
import { childRise, childRiseHeavy, childSlide } from "@/lib/motion"
import { DecodeText } from "@/components/decode-text"
import { ActionLink, ArrowChip, InBrief, WordCycle } from "@/components/primitives"
import { Frame, FormationGlyph } from "@/components/storyboard"
import { CHAPTERS } from "@/lib/chapters-config"
import { accentHex } from "@/lib/chapter-palette"
import { railHover } from "@/lib/pointer-state"
import { CURRENT_ROLE, EXPERIENCE, PROFILE } from "@/lib/profile"

type ViewMode = "recruiter" | "designer"

const FOCUS_WORDS = ["AI products", "design systems", "research-led flows", "complex workflows"] as const

// Evidence, not adjectives — every figure is on the résumé.
const STATS = [
  { value: "2+", unit: "yrs", label: "AI products, end-to-end" },
  { value: "+18", unit: "%", label: "Onboarding completion" },
  { value: "−30", unit: "%", label: "User drop-off" },
  { value: "+14", unit: "%", label: "Feature adoption" },
]

// 2×2 on phones, 1×4 from @lg — hairlines between cells, never on the outer edge.
const STAT_CELL = [
  "",
  "pl-4 border-l",
  "border-t @lg:border-t-0 @lg:pl-4 @lg:border-l",
  "pl-4 border-l border-t @lg:border-t-0",
]

const hirello = EXPERIENCE.find((r) => r.org === "Hirello.ai")

const LEDE: Record<ViewMode, string> = {
  designer: "I design calm interfaces for products where the complexity lives under the hood.",
  recruiter: "Product designer with 2+ years shipping customer-facing AI products, end to end.",
}

const BRIEF = [
  `${CURRENT_ROLE.role} · ${CURRENT_ROLE.org}`,
  `Previously ${hirello?.role} · Hirello.ai`,
  "Research → flows → prototypes → handoff",
]

/** The contact sheet — every scene ahead as a small frame in its own pigment.
 *  Hover leans the 3D camera toward that scene (railHover bus); click plays
 *  the full formation transition. */
function ContactSheet() {
  const { setActiveChapterIndex } = useReadingStore()
  const scenes = CHAPTERS.slice(1)

  return (
    <motion.div variants={childSlide} initial="hidden" animate="show" custom={3} className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="label-mono">The storyboard</span>
        <span className="label-mono tabular-nums">{scenes.length} scenes</span>
      </div>
      <ol className="grid grid-cols-3 @xl:grid-cols-6 @4xl:grid-cols-2 gap-2.5">
        {scenes.map((scene) => {
          const i = scene.chapterNumber
          const subtitle = scene.fullLabel.split(" · ")[1] ?? ""
          return (
            <li key={scene.id}>
              <button
                type="button"
                onClick={() => setActiveChapterIndex(i)}
                onMouseEnter={() => (railHover.chapter = i)}
                onMouseLeave={() => {
                  if (railHover.chapter === i) railHover.chapter = -1
                }}
                className="group w-full text-left rounded-[12px]"
                aria-label={`Go to scene ${i}: ${scene.fullLabel}`}
              >
                <Frame
                  shot={`SC ${String(i).padStart(2, "0")}`}
                  pigment={accentHex(i)}
                  className="aspect-[16/10] transition-colors duration-500 group-hover:border-hair-3"
                >
                  <div className="absolute inset-x-[18%] inset-y-[20%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                    <FormationGlyph index={i} dot={2.4} gap={4.4} />
                  </div>
                </Frame>
                <span className="mt-2 flex items-baseline justify-between gap-2 px-0.5">
                  <span className="text-[13px] tracking-[-0.01em] text-bone">{scene.label}</span>
                  <span className="hidden @5xl:inline truncate font-mono text-[9.5px] text-bone-4">{subtitle}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </motion.div>
  )
}

export function HeroSection() {
  const { viewMode } = useViewMode()
  const { setActiveChapterIndex } = useReadingStore()
  const mode = viewMode as ViewMode

  return (
    <SectionWrapper id="prologue" windowTitle="PROLOGUE · PIXELOGIC OS" moduleLabel="PROLOGUE · PIXELOGIC OS">
      <div className="relative grid @4xl:grid-cols-12 gap-10 @4xl:gap-12 items-start">
        {/* ── Left — the statement ─────────────────────────────────── */}
        <div className="@4xl:col-span-7 space-y-7">
          <motion.div variants={childRise} initial="hidden" animate="show" custom={0}>
            <span className="eyebrow">Scene 00 · Prologue</span>
          </motion.div>

          {/* h2: the document's single h1 lives (sr-only) in page.tsx */}
          <motion.h2 variants={childRiseHeavy} initial="hidden" animate="show" custom={1} className="display-xl text-bone">
            Designing{" "}
            <em className="not-italic text-shimmer">
              <DecodeText text="clarity" delay={300} />
            </em>
            <br />
            <span className="ink-dim">inside complex systems.</span>
          </motion.h2>

          <motion.p
            variants={childRise}
            initial="hidden"
            animate="show"
            custom={2}
            className="text-[clamp(1.05rem,1.4vw,1.3rem)] leading-tight tracking-[-0.02em] text-bone-3"
          >
            Product designer for <WordCycle words={FOCUS_WORDS} className="text-bone" />
          </motion.p>

          <motion.div key={`copy-${mode}`} variants={childRise} initial="hidden" animate="show" custom={3} className="space-y-5">
            {/* Phones/tablets: the Now panel (xl) and navbar Now line (lg) are
                hidden, so the current role surfaces here instead. */}
            <button
              type="button"
              onClick={() => setActiveChapterIndex(1)}
              className="group lg:hidden flex w-full items-start gap-3 rounded-[12px] border border-hair-2 px-4 py-3 text-left transition-colors hover:border-chapter"
            >
              <span className="live-dot mt-[7px]" aria-hidden />
              <span className="min-w-0 flex-1 text-[13px] leading-[1.45] text-bone-3">
                Now · <span className="text-bone">{CURRENT_ROLE.role}</span> at{" "}
                <span className="text-bone">{CURRENT_ROLE.org}</span>
                <span className="block font-mono text-[10.5px] text-bone-3 mt-0.5">
                  {CURRENT_ROLE.orgNote} · since {CURRENT_ROLE.start}
                </span>
              </span>
              <ArrowChip />
            </button>
            <p className="lede">{LEDE[mode]}</p>
            {mode === "recruiter" && <InBrief items={BRIEF} className="max-w-xl" />}
          </motion.div>

          {/* Evidence row */}
          <motion.dl variants={childRise} initial="hidden" animate="show" custom={4} className="grid grid-cols-2 @lg:grid-cols-4 border-y border-hair">
            {STATS.map((s, i) => (
              <div key={s.label} className={`py-4 pr-4 border-hair ${STAT_CELL[i]}`}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-[28px] leading-none tracking-[-0.04em] text-bone tabular-nums">
                  {s.value}
                  <span className="text-chapter text-[18px] ml-0.5">{s.unit}</span>
                </dd>
                <dd aria-hidden className="mt-2 font-mono text-[10.5px] leading-[1.45] text-bone-3">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>

          {/* CTAs + status */}
          <motion.div variants={childRise} initial="hidden" animate="show" custom={5} className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <Magnetic strength={8} range={100}>
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveChapterIndex(4)}
                className="btn-solid h-11 px-5 text-[12.5px]"
              >
                View case stories
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
              </motion.button>
            </Magnetic>
            <ActionLink onClick={() => setActiveChapterIndex(1)}>Start the story</ActionLink>
          </motion.div>
          <motion.p variants={childRise} initial="hidden" animate="show" custom={6} className="flex items-center gap-2 font-mono text-[11px] text-bone-3">
            <span className="live-dot" aria-hidden />
            Open to product design roles · {PROFILE.location}
          </motion.p>
        </div>

        {/* ── Right — the contact sheet ────────────────────────────── */}
        <div className="@4xl:col-span-5 @4xl:pt-14">
          <ContactSheet />
        </div>
      </div>
    </SectionWrapper>
  )
}
