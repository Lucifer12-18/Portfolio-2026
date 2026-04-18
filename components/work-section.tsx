"use client"


import { Card, CardContent } from "@/components/ui/card"
import { SectionWrapper } from "@/components/section-wrapper"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { useSystemLog } from "@/contexts/system-log-context"
import { useModal } from "@/contexts/modal-context"
import { Spotlight } from "@/components/spotlight"
import Image from "next/image"
import { useState } from "react"

const projects = [
  {
    title: "Hirello.ai – AI-First Hiring Flow",
    hook: "Helping recruiters trust an AI assistant instead of fighting it.",
    file: "hirello_ai.tsx",
    tags: ["Product Design", "AI & UX"],
    role: "Founding Product Designer",
    context: "AI hiring platform",
    year: "2024",
    featured: true,
    imagePath: "/images/hirello-mockup.svg",
    description: {
      recruiter: "Led end-to-end design for AI recruiting platform. Reduced recruiter screening time by 40%.",
      designer:
        "Redesigned the candidate screening experience for an AI recruiting platform. Led end-to-end design, reducing recruiter screening time by 40%.",
    },
    tools: ["Figma", "FigJam", "Maze"],
    problem:
      "Recruiters were spending 60% of their time manually screening resumes that AI had already scored. The existing interface buried AI insights and forced redundant manual reviews.",
    approach: [
      "Conducted contextual inquiry with 8 recruiters to map current workflows",
      "Identified key decision points where AI confidence could reduce manual effort",
      "Designed progressive disclosure pattern—high-confidence candidates surface automatically",
      "Created calibration flow for recruiters to train AI on team-specific preferences",
    ],
    outcome:
      "40% reduction in screening time. Recruiter satisfaction scores improved from 3.2 to 4.6/5. Pattern adopted across 3 other product teams.",
  },
  {
    title: "Reddit Redesign – Reducing Cognitive Overload",
    hook: "Reducing cognitive overload in a feed that never ends.",
    file: "reddit_redesign.tsx",
    tags: ["Product Design", "Concept"],
    role: "Product Designer",
    context: "Content ecosystem concept",
    year: "2023",
    featured: false,
    imagePath: "/images/reddit-mockup.svg",
    description: {
      recruiter: "Speculative redesign exploring simplified information architecture while maintaining engagement.",
      designer:
        "A speculative redesign exploring how Reddit could simplify its information architecture while maintaining community identity and engagement.",
    },
    tools: ["Figma", "FigJam"],
    problem:
      "Reddit's density works for power users but overwhelms casual browsers. The challenge: reduce cognitive load without losing the serendipity that makes Reddit addictive.",
    approach: [
      "Analyzed heatmaps and session recordings from Reddit's public UX research",
      "Identified 3 distinct user modes: browsing, seeking, and participating",
      "Designed adaptive density system that responds to user behavior patterns",
      "Created 'focus mode' for deep reading without infinite scroll temptation",
    ],
    outcome:
      "Concept exploration demonstrating how progressive complexity could serve both casual and power users. Featured in design community discussion with 2K+ views.",
  },
  {
    title: "AI Job Market Dashboard",
    hook: "Helping students see where AI is changing careers, not just headlines.",
    file: "job_dashboard.tsx",
    tags: ["Data Visualization", "Systems"],
    role: "Product Designer",
    context: "Data systems dashboard",
    year: "2024",
    featured: false,
    imagePath: "/images/dashboard-mockup.svg",
    description: {
      recruiter: "Built interactive dashboard helping students understand AI's impact on job markets.",
      designer:
        "Built an interactive dashboard helping IS students understand AI's impact on job markets. Combined data storytelling with actionable insights.",
    },
    tools: ["Tableau", "Figma", "SQL"],
    problem:
      "IS students needed to understand how AI was reshaping job markets, but existing data was either too academic or too sensationalized. They needed actionable insights for career planning.",
    approach: [
      "Aggregated data from Bureau of Labor Statistics, LinkedIn, and industry reports",
      "Designed narrative structure: macro trends → specific roles → skill gaps",
      "Created interactive 'what-if' scenarios for different career paths",
      "Built comparison tools for regional and industry-specific insights",
    ],
    outcome:
      "Adopted by UMBC career services for student advising. 300+ students used dashboard in first semester. Professors requested integration into curriculum.",
  },
]

const workContent = {
  recruiter: {
    bullets: [
      "4 shipped/concept projects across AI, mobile, web",
      "Full case studies with measurable outcomes",
      "Mix of enterprise (B2B) and consumer (B2C)",
    ],
  },
}

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 + i * 0.08, duration: 0.55, ease },
  }),
}

export function WorkSection() {
  const { viewMode } = useViewMode()
  const { addLog } = useSystemLog()
  const { openModal } = useModal()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleProjectClick = (project: (typeof projects)[0]) => {
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
    addLog(`> opened case study: ${project.title.split(" – ")[0]}`)
  }

  const featuredProject = projects.find((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <SectionWrapper
      id="chapter-4"
      windowTitle="WORK · CASE STORIES IN PRACTICE"
      moduleLabel="WORK · CASE STORIES IN PRACTICE"
      className="py-20 md:py-20"
    >
      {/* Decorative chapter numeral */}
      <div aria-hidden="true" className="absolute top-4 right-6 md:right-10 marquee-num select-none">
        04
      </div>

      <div className="relative space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="space-y-4 max-w-3xl"
        >
          <span className="eyebrow">Chapter 04 · Work · Case Stories</span>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease }}
            className="display-lg text-slate-50"
          >
            Case stories, not a{" "}
            <em className="not-italic text-gradient">résumé gallery.</em>
          </motion.h2>

          {viewMode === "recruiter" && (
            <div className="flex flex-col gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10 max-w-lg">
              <span className="eyebrow" style={{ color: "rgba(74, 123, 247, 0.9)" }}>
                Quick Summary
              </span>
              <ul className="space-y-1.5 mt-2">
                {workContent.recruiter.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="lede">
            Instead of a long list of projects, here are a few episodes that show how I think —
            from AI hiring tools to dashboards and community redesigns.
          </p>
        </motion.div>

        <div className="rule-tick" />

        {/* Featured Project — cinematic treatment */}
        {featuredProject && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            custom={0}
          >
            <motion.div
              onHoverStart={() => setHoveredCard(featuredProject.title)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease }}
            >
              <Spotlight size={420} color="74, 123, 247" intensity={0.12} className="rounded-2xl">
              <Card
                className="border-border shadow-sm group overflow-hidden cursor-pointer py-0 rounded-2xl relative"
                style={{
                  transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                  boxShadow: hoveredCard === featuredProject.title
                    ? "0 0 0 1px rgba(74,123,247,0.3), 0 16px 48px rgba(74,123,247,0.14), 0 2px 8px rgba(0,0,0,0.4)"
                    : "0 2px 12px rgba(0,0,0,0.2)",
                  borderColor: hoveredCard === featuredProject.title ? "rgba(74,123,247,0.3)" : undefined,
                }}
                onClick={() => handleProjectClick(featuredProject)}
              >
                {/* Shimmer line at top */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[1px] z-10"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(74,123,247,0.8), transparent)",
                    opacity: hoveredCard === featuredProject.title ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                />
                <div className="grid md:grid-cols-5">
                  {/* Image — 3 cols, cinematic aspect */}
                  <div className="md:col-span-3 h-[200px] md:h-[260px] relative overflow-hidden bg-muted/60 border-b md:border-b-0 md:border-r border-border/60">
                    <Image
                      src={featuredProject.imagePath || "/placeholder.svg"}
                      alt={featuredProject.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    {/* Oversized project numeral overlay */}
                    <div
                      aria-hidden="true"
                      className="absolute bottom-3 left-4 marquee-num select-none"
                      style={{ fontSize: "clamp(3.5rem, 6vw, 6rem)", opacity: 0.7 }}
                    >
                      01
                    </div>
                    <div
                      className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: "linear-gradient(to right, transparent 60%, rgba(74,123,247,0.08))",
                        opacity: hoveredCard === featuredProject.title ? 1 : 0,
                      }}
                    />
                  </div>

                  {/* Text — 2 cols, editorial */}
                  <CardContent className="md:col-span-2 p-7 md:p-9 flex flex-col justify-between gap-6">
                    <div>
                      <p className="eyebrow mb-5">
                        Featured · {featuredProject.year}
                      </p>

                      <h3
                        className="display-md text-slate-50 mb-3 transition-colors duration-300 leading-[1.05]"
                        style={{ color: hoveredCard === featuredProject.title ? "rgb(147, 197, 253)" : undefined }}
                      >
                        {featuredProject.title.split(" – ")[0]}
                      </h3>
                      <p className="text-[15px] text-muted-foreground leading-relaxed">
                        {featuredProject.hook}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">
                        {featuredProject.role} · {featuredProject.context}
                      </p>

                      <motion.span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary w-fit"
                        animate={{ x: hoveredCard === featuredProject.title ? 3 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        View case study
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </motion.span>
                    </div>
                  </CardContent>
                </div>
              </Card>
              </Spotlight>
            </motion.div>
          </motion.div>
        )}

        {/* Other Projects */}
        <div className="grid md:grid-cols-2 gap-6">
          {otherProjects.map((project, i) => {
            const numeral = String(i + 2).padStart(2, "0")
            return (
              <motion.div
                key={project.title}
                custom={i + 1}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <motion.div
                  onHoverStart={() => setHoveredCard(project.title)}
                  onHoverEnd={() => setHoveredCard(null)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease }}
                  className="h-full"
                >
                  <Spotlight size={320} color="74, 123, 247" intensity={0.11} className="rounded-2xl h-full">
                  <Card
                    className="h-full border-border group overflow-hidden cursor-pointer flex flex-col py-0 rounded-2xl relative"
                    style={{
                      transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                      boxShadow: hoveredCard === project.title
                        ? "0 0 0 1px rgba(74,123,247,0.25), 0 12px 36px rgba(74,123,247,0.12), 0 2px 8px rgba(0,0,0,0.3)"
                        : "0 1px 6px rgba(0,0,0,0.15)",
                      borderColor: hoveredCard === project.title ? "rgba(74,123,247,0.25)" : undefined,
                    }}
                    onClick={() => handleProjectClick(project)}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[1px] z-10"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(74,123,247,0.6), transparent)",
                        opacity: hoveredCard === project.title ? 1 : 0,
                        transition: "opacity 0.3s ease",
                      }}
                    />

                    <div className="h-[170px] relative overflow-hidden bg-muted/60 border-b border-border/60">
                      <Image
                        src={project.imagePath || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      {/* Project numeral overlay */}
                      <div
                        aria-hidden="true"
                        className="absolute bottom-2 left-3 marquee-num select-none"
                        style={{ fontSize: "clamp(2.75rem, 4.5vw, 4.5rem)", opacity: 0.65 }}
                      >
                        {numeral}
                      </div>
                      <div
                        className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: "linear-gradient(to bottom, transparent 50%, rgba(74,123,247,0.05))",
                          opacity: hoveredCard === project.title ? 1 : 0,
                        }}
                      />
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1 gap-3">
                      <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500">
                        {project.role} · {project.year}
                      </p>

                      <h3
                        className="display-md text-slate-50 transition-colors duration-300 line-clamp-2 leading-[1.08]"
                        style={{
                          fontSize: "1.375rem",
                          color: hoveredCard === project.title ? "rgb(147, 197, 253)" : undefined,
                        }}
                      >
                        {project.title.split(" – ")[0]}
                      </h3>

                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{project.hook}</p>

                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500 mt-auto pt-3 border-t border-white/5">
                        {project.tags.map((tag, idx) => (
                          <span key={tag} className="inline-flex items-center gap-2">
                            {idx > 0 && <span className="text-slate-700">·</span>}
                            {tag}
                          </span>
                        ))}
                      </div>

                      <motion.span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary w-fit"
                        animate={{ x: hoveredCard === project.title ? 3 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        View case
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </motion.span>
                    </CardContent>
                  </Card>
                  </Spotlight>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
