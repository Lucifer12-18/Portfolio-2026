"use client"

import { SectionWrapper } from "@/components/section-wrapper"
import { motion } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { childRise, childRiseHeavy, childSlide } from "@/lib/motion"
import { DecodeText } from "@/components/decode-text"
import { InBrief } from "@/components/primitives"
import { Animatic, type Beat } from "@/components/animatic"

// Scene 03 is the rhythm, so it PLAYS (Shift, by contrast, is dragged).
// Each beat's caption is evidence from the résumé, not a description.
const BEATS: Beat[] = [
  { title: "Listen", meta: "UMBC", caption: "Participatory research with 11 graduate students.", sketch: "listen" },
  { title: "Map", meta: "Wipro", caption: "Ambiguous requirements turned into user flows and UI specs.", sketch: "map" },
  { title: "Prototype", meta: "Hirello", caption: "6 onboarding variants A/B tested: +18% completion, −30% drop-off.", sketch: "prototype" },
  { title: "Ship", meta: "Wipro", caption: "Structured handoff cut post-release defects by ~30%.", sketch: "ship" },
]

const recruiterBrief = [
  "Structured, repeatable process from research to release",
  "Evidence-led: interviews, A/B tests, usability studies",
  "Works shoulder-to-shoulder with engineering and QA",
]

export function ProcessSection() {
  const { viewMode } = useViewMode()

  return (
    <SectionWrapper id="chapter-3" windowTitle="METHOD · THE DESIGN RHYTHM" moduleLabel="METHOD · THE DESIGN RHYTHM">
      <div className="flex flex-col gap-9">
        <div className="grid @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 @3xl:gap-12 items-end">
          <div className="space-y-6">
            <motion.div variants={childRise} initial="hidden" animate="show" custom={0}>
              <span className="eyebrow">Scene 03 · Method</span>
            </motion.div>
            <motion.h2 variants={childRiseHeavy} initial="hidden" animate="show" custom={1} className="display-lg text-bone">
              <span className="ink-dim">The design</span> <DecodeText text="rhythm." delay={300} className="ink-accent" />
            </motion.h2>
          </div>

          <motion.div key={viewMode} variants={childRise} initial="hidden" animate="show" custom={2} className="space-y-5">
            <p className="lede">Not linear, just disciplined. Four beats on repeat. Hover to hold one.</p>
            {viewMode === "recruiter" && <InBrief items={recruiterBrief} />}
          </motion.div>
        </div>

        <motion.div variants={childSlide} initial="hidden" animate="show" custom={3}>
          <Animatic beats={BEATS} />
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
