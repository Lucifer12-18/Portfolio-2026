"use client"

import type React from "react"

import { SectionWrapper } from "@/components/section-wrapper"
import { motion } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { useSystemLog } from "@/contexts/system-log-context"
import { useModal } from "@/contexts/modal-context"
import { Spotlight } from "@/components/spotlight"
import { DecodeText } from "@/components/decode-text"
import { ArrowChip, InBrief } from "@/components/primitives"
import { childRise, childRiseHeavy, childSlide } from "@/lib/motion"
import { CaseCover } from "@/components/covers"
import { trackEvent } from "@/lib/stats"
import { accentRgb } from "@/lib/chapter-palette"
import { CASES, shortTitle, type CaseMeta } from "@/lib/cases"

type Project = CaseMeta

const projects = CASES

const recruiterBrief = [
  "Founding-designer work at an AI startup: designed and built, with measured outcomes",
  "Two deep Hirello cases: the Networking Hub and the agent platform around it",
  "A systems-level product home task for 1 Second Everyday, plus graduate HCC research",
]


export function WorkSection() {
  const { viewMode } = useViewMode()
  const { addLog } = useSystemLog()
  const { openModal } = useModal()

  const open = (project: Project) => {
    openModal({
      title: project.title,
      file: project.file,
      tags: project.tags,
      tools: project.tools,
      problem: project.problem,
      approach: project.approach,
      outcome: project.outcome,
      href: project.href,
    })
    addLog(`> opened case study: ${shortTitle(project.title)}`)
    trackEvent(`case_open:${project.file}`)
  }

  const cardProps = (project: Project) => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-haspopup": "dialog" as const,
    "aria-label": `Open case study: ${project.title}`,
    onClick: () => open(project),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        open(project)
      }
    },
  })

  const featured = projects.find((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <SectionWrapper id="chapter-4" windowTitle="WORK · CASE STORIES IN PRACTICE" moduleLabel="WORK · CASE STORIES IN PRACTICE">
      <div className="relative space-y-8">
        {/* Header */}
        <div className="grid @3xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 @3xl:gap-12 items-end">
          <div className="space-y-6">
            <motion.div variants={childRise} initial="hidden" animate="show" custom={0}>
              <span className="eyebrow">Scene 04 · Work</span>
            </motion.div>
            <motion.h2 variants={childRiseHeavy} initial="hidden" animate="show" custom={1} className="display-lg text-bone">
              <span className="ink-dim">Case stories,</span>
              <br />
              not a <DecodeText text="résumé gallery." delay={300} className="ink-accent" />
            </motion.h2>
          </div>
          <motion.div key={viewMode} variants={childRise} initial="hidden" animate="show" custom={2} className="space-y-5">
            <p className="lede">Three deep dives and a research piece.</p>
            {viewMode === "recruiter" && <InBrief items={recruiterBrief} />}
          </motion.div>
        </div>

        {/* ── Featured ─────────────────────────────────────────────────── */}
        {featured && (
          <motion.div variants={childSlide} initial="hidden" animate="show" custom={3}>
            <Spotlight size={460} color={accentRgb(4)} intensity={0.09} className="rounded-2xl">
              <article
                {...cardProps(featured)}
                className="group surface surface-interactive overflow-hidden cursor-pointer grid @2xl:grid-cols-5"
              >
                <div className="@2xl:col-span-3 relative aspect-[16/10] @2xl:aspect-auto @2xl:min-h-[340px] overflow-hidden border-b @2xl:border-b-0 @2xl:border-r border-hair">
                  <CaseCover file={featured.file} featured />
                </div>

                <div className="@2xl:col-span-2 p-6 @2xl:p-7 flex flex-col gap-6">
                  <div>
                    <p className="label-mono">Featured · {featured.year} · {featured.role.split(" · ")[0]}</p>
                    <h3 className="mt-3 text-[28px] leading-[1.05] tracking-[-0.04em] text-bone">{shortTitle(featured.title)}</h3>
                    <p className="mt-1 text-[16px] tracking-[-0.02em] text-bone-3">{featured.title.split(" · ")[1]}</p>
                    <p className="mt-4 text-[15px] leading-[1.5] text-bone-2">{featured.hook}</p>
                  </div>

                  {featured.metrics && (
                    <dl className="grid grid-cols-3 border-y border-hair">
                      {featured.metrics.map((m, i) => (
                        <div key={m.label} className={`py-3.5 ${i > 0 ? "pl-3.5 border-l border-hair" : ""}`}>
                          <dt className="sr-only">{m.label}</dt>
                          <dd className="text-[22px] leading-none tracking-[-0.04em] text-chapter tabular-nums">{m.value}</dd>
                          <dd aria-hidden className="mt-1.5 font-mono text-[10px] leading-snug text-bone-3">{m.label}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-mono text-[12px] text-bone">Open case study</span>
                    <ArrowChip large />
                  </div>
                </div>
              </article>
            </Spotlight>
          </motion.div>
        )}

        {/* ── The rest ─────────────────────────────────────────────────── */}
        <div className="grid @xl:grid-cols-2 @5xl:grid-cols-3 gap-4">
          {others.map((project, i) => (
            <motion.div key={project.title} variants={childSlide} initial="hidden" animate="show" custom={4 + i} className="h-full">
              <Spotlight size={320} color={accentRgb(4)} intensity={0.09} className="rounded-2xl h-full">
                <article
                  {...cardProps(project)}
                  className="group surface surface-interactive h-full overflow-hidden cursor-pointer flex flex-col"
                >
                  <div className="aspect-[16/10] relative overflow-hidden border-b border-hair">
                    <CaseCover file={project.file} />
                  </div>

                  <div className="p-5 flex flex-col flex-1 gap-2.5">
                    <h3 className="text-[19px] leading-[1.15] tracking-[-0.03em] text-bone">{shortTitle(project.title)}</h3>
                    <p className="text-[13.5px] leading-[1.5] text-bone-3">{project.hook}</p>

                    <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                      <span className="font-mono text-[10.5px] text-bone-3 truncate">{project.year} · {project.tags[0]}</span>
                      <ArrowChip />
                    </div>
                  </div>
                </article>
              </Spotlight>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
