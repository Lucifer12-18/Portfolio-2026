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
import { accentRgb } from "@/lib/chapter-palette"

interface Project {
  title: string
  hook: string
  file: string
  tags: string[]
  role: string
  context: string
  year: string
  featured?: boolean
  imagePath: string
  metrics?: { value: string; label: string }[]
  tools: string[]
  problem: string
  approach: string[]
  outcome: string
}

const projects: Project[] = [
  {
    title: "Hirello.ai · AI Career Operating System",
    hook: "One guided system for a fragmented job search.",
    file: "hirello_ai.tsx",
    tags: ["Product Design", "AI & UX", "Design Systems"],
    role: "Founding Product Designer",
    context: "AI career platform · web + mobile",
    year: "2025–26",
    featured: true,
    imagePath: "/hirello-pipeline.png",
    metrics: [
      { value: "+18%", label: "Onboarding completion" },
      { value: "−30%", label: "User drop-off" },
      { value: "+14%", label: "Feature adoption" },
    ],
    tools: ["Figma", "FigJam", "Maze"],
    problem:
      "Job seekers rely on 3–5 fragmented tools with no system connecting them. Interviews revealed two core gaps: no structured flow for networking outreach, and no practice tool that gives detailed, diagnostic feedback.",
    approach: [
      "Owned end-to-end product flows: user flows, wireframes, and interactive Figma prototypes for web and mobile.",
      "Designed a Networking Intelligence System: contact tiers, guided outreach, and a visual opportunity pipeline.",
      "Built an AI Interview Gym with layered, diagnostic feedback instead of a single score.",
      "Ran customer research with 12+ users and A/B tested 6 onboarding flow variations.",
      "Built and maintained the Figma component library shared across web and mobile.",
    ],
    outcome:
      "The winning onboarding variants lifted completion by 18% and cut drop-off by 30%; research-driven changes raised feature adoption by 14%. Networking and interview prep now live in one guided system instead of a handful of disconnected tools.",
  },
  {
    title: "AI Policy by Design · UMBC HCC Research",
    hook: "Designing AI policy into the interface itself.",
    file: "ai_policy_by_design.fig",
    tags: ["UX Research", "AI & UX"],
    role: "Product Designer",
    context: "Human-Centered Computing research",
    year: "2025",
    imagePath: "/images/ai-policy-by-design.svg",
    tools: ["Figma", "Surveys", "Interviews", "Contextual observation"],
    problem:
      "AI policies usually live in documents, not in the tools students use while they work. The research question: what if the interface itself carried those policies?",
    approach: [
      "Led participatory design research with 11 graduate students.",
      "Mixed methods (surveys, user interviews, and contextual observation) to surface AI usage patterns and needs.",
      "Synthesized findings into 12 co-designed AI policies and actionable design decisions.",
      "Redesigned an AI tool interface in Figma from first principles, embedding all 12 policies into the UX.",
    ],
    outcome:
      "A redesigned AI tool interface with 12 co-designed policies built into the experience. A working demonstration of how interaction design decisions can operationalize institutional values.",
  },
  {
    title: "Reddit Redesign · Reducing Cognitive Overload",
    hook: "Less overload in a feed that never ends.",
    file: "reddit_redesign.tsx",
    tags: ["Product Design", "Concept"],
    role: "Product Designer",
    context: "Content ecosystem concept",
    year: "2023",
    imagePath: "/images/reddit-mockup.svg",
    tools: ["Figma", "FigJam"],
    problem:
      "Reddit's density works for power users but overwhelms casual browsers. The challenge: reduce cognitive load without losing the serendipity that makes Reddit addictive.",
    approach: [
      "Analyzed heatmaps and session recordings from Reddit's public UX research",
      "Identified 3 distinct user modes: browsing, seeking, and participating",
      "Designed an adaptive density system that responds to user behavior patterns",
      "Created a 'focus mode' for deep reading without infinite-scroll temptation",
    ],
    outcome:
      "Concept exploration demonstrating how progressive complexity could serve both casual and power users. Featured in design community discussion with 2K+ views.",
  },
  {
    title: "AI Job Market Dashboard",
    hook: "Where AI is really changing careers.",
    file: "job_dashboard.tsx",
    tags: ["Data Visualization", "Systems"],
    role: "Product Designer",
    context: "Data systems dashboard",
    year: "2024",
    imagePath: "/images/dashboard-mockup.svg",
    tools: ["Tableau", "Figma", "SQL"],
    problem:
      "IS students needed to understand how AI was reshaping job markets, but existing data was either too academic or too sensationalized. They needed actionable insights for career planning.",
    approach: [
      "Aggregated data from Bureau of Labor Statistics, LinkedIn, and industry reports",
      "Designed a narrative structure: macro trends → specific roles → skill gaps",
      "Created interactive 'what-if' scenarios for different career paths",
      "Built comparison tools for regional and industry-specific insights",
    ],
    outcome:
      "Adopted by UMBC career services for student advising. 300+ students used the dashboard in its first semester. Professors requested integration into curriculum.",
  },
]

const recruiterBrief = [
  "Founding-designer work at an AI startup, with measured outcomes",
  "Graduate HCC research on AI policy and interaction design",
  "Concept and data-visualization work across web and dashboards",
]

const shortTitle = (t: string) => t.split(" · ")[0]

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
      imagePath: project.imagePath,
    })
    addLog(`> opened case study: ${shortTitle(project.title)}`)
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
            <p className="lede">Four episodes: shipped, researched, imagined.</p>
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
                    <p className="label-mono">Featured · {featured.year} · {featured.role}</p>
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
