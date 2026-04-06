"use client"


import { Card, CardContent } from "@/components/ui/card"
import { ModuleBadge } from "@/components/module-badge"
import { SectionWrapper } from "@/components/section-wrapper"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { useSystemLog } from "@/contexts/system-log-context"
import { useModal } from "@/contexts/modal-context"
import { TypewriterText } from "@/components/typewriter-text"
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
    imagePath: "/images/hirello-mockup.jpg",
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
    imagePath: "/images/reddit-mockup.jpg",
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
    imagePath: "/images/dashboard-mockup.jpg",
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

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.05 + i * 0.06,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
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
      <ModuleBadge module="04" label="WORK" />

      <h2 className="mb-4">
        <TypewriterText
          text="Case Stories"
          speed={32}
          loop={false}
          className="text-3xl md:text-4xl font-semibold text-foreground"
        />
      </h2>

      {viewMode === "recruiter" && (
        <div className="flex flex-col gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10 mb-6 max-w-lg">
          <span className="text-xs font-mono text-primary uppercase tracking-wide">Quick Summary</span>
          <ul className="space-y-1.5">
            {workContent.recruiter.bullets.map((bullet, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
        Instead of a long list of projects, here are a few 'episodes' that show how I think—from AI hiring tools to
        dashboards and community redesigns.
      </p>

      {/* Featured Project */}
      {featuredProject && (
        <div className="mb-6">
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
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card
                className="border-border shadow-sm group overflow-hidden cursor-pointer py-0 rounded-xl relative"
                style={{
                  transition: "box-shadow 0.35s ease, border-color 0.35s ease",
                  boxShadow: hoveredCard === featuredProject.title
                    ? "0 0 0 1px rgba(74,123,247,0.3), 0 8px 32px rgba(74,123,247,0.12), 0 2px 8px rgba(0,0,0,0.3)"
                    : "0 2px 8px rgba(0,0,0,0.15)",
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
                <div className="grid md:grid-cols-2">
                  <div className="h-[180px] md:h-[220px] relative overflow-hidden bg-muted/60 border-b md:border-b-0 md:border-r border-border/60">
                    <Image
                      src={featuredProject.imagePath || "/placeholder.svg"}
                      alt={featuredProject.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {/* Gradient overlay that lifts on hover */}
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{
                        background: "linear-gradient(to right, transparent 60%, rgba(74,123,247,0.06))",
                        opacity: hoveredCard === featuredProject.title ? 1 : 0,
                      }}
                    />
                  </div>

                  <CardContent className="p-7 flex flex-col justify-center">
                    {featuredProject.role && featuredProject.context && featuredProject.year && (
                      <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground mb-3">
                        role: {featuredProject.role} · context: {featuredProject.context} · year: {featuredProject.year}
                      </p>
                    )}

                    <h3 className="text-2xl font-bold text-foreground mb-3 transition-colors duration-200"
                      style={{ color: hoveredCard === featuredProject.title ? "rgb(74,123,247)" : undefined }}>
                      {featuredProject.title}
                    </h3>

                    <p className="text-muted-foreground mb-5 leading-relaxed line-clamp-2">
                      {featuredProject.hook}
                    </p>

                    <motion.span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary w-fit"
                      animate={{ x: hoveredCard === featuredProject.title ? 3 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      View case study
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </motion.span>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Other Projects */}
      <div className="grid md:grid-cols-2 gap-5">
        {otherProjects.map((project, i) => (
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
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Card
                className="h-full border-border group overflow-hidden cursor-pointer flex flex-col py-0 rounded-xl relative"
                style={{
                  transition: "box-shadow 0.35s ease, border-color 0.35s ease",
                  boxShadow: hoveredCard === project.title
                    ? "0 0 0 1px rgba(74,123,247,0.25), 0 8px 28px rgba(74,123,247,0.1), 0 2px 8px rgba(0,0,0,0.25)"
                    : "0 1px 4px rgba(0,0,0,0.12)",
                  borderColor: hoveredCard === project.title ? "rgba(74,123,247,0.25)" : undefined,
                }}
                onClick={() => handleProjectClick(project)}
              >
                {/* Shimmer top line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] z-10"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(74,123,247,0.6), transparent)",
                    opacity: hoveredCard === project.title ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                />

                <div className="h-[180px] relative overflow-hidden bg-muted/60 border-b border-border/60">
                  <Image
                    src={project.imagePath || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {/* Subtle gradient overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(to bottom, transparent 50%, rgba(74,123,247,0.04))",
                      opacity: hoveredCard === project.title ? 1 : 0,
                    }}
                  />
                </div>

                <CardContent className="p-5 flex flex-col flex-1">
                  {project.role && project.context && project.year && (
                    <p className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground mb-2">
                      role: {project.role} · {project.year}
                    </p>
                  )}

                  <h3
                    className="text-base font-bold mb-2 transition-colors duration-200 line-clamp-2"
                    style={{ color: hoveredCard === project.title ? "rgb(74,123,247)" : "rgb(248,250,252)" }}
                  >
                    {project.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-muted/60 text-[10px] font-mono text-muted-foreground leading-none whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">{project.hook}</p>

                  <motion.span
                    className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary w-fit"
                    animate={{ x: hoveredCard === project.title ? 3 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    View case
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </motion.span>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>

    </SectionWrapper>
  )
}
