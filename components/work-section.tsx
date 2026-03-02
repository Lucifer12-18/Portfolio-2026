"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ModuleBadge } from "@/components/module-badge"
import { SectionWrapper } from "@/components/section-wrapper"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { useSystemLog } from "@/contexts/system-log-context"
import { ProjectModal } from "@/components/project-modal"
import { TypewriterText } from "@/components/typewriter-text"
import Image from "next/image"

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
      delay: 0.1 + i * 0.12,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

export function WorkSection() {
  const { viewMode } = useViewMode()
  const { addLog } = useSystemLog()
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProjectClick = (project: (typeof projects)[0]) => {
    // All projects open inline modal snapshot; deeper links live inside the modal
    setSelectedProject(project)
    setIsModalOpen(true)
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

      <p className="text-muted-foreground mb-16 max-w-2xl leading-relaxed">
        Instead of a long list of projects, here are a few 'episodes' that show how I think—from AI hiring tools to
        dashboards and community redesigns.
      </p>

      {/* Featured Project - Separate section */}
      {featuredProject && (
        <div className="mb-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            custom={0}
          >
            <Card
              className="border-border shadow-sm group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/20 py-0 rounded-[0.6rem]"
              onClick={() => handleProjectClick(featuredProject)}
            >
              <div className="grid lg:grid-cols-2">
                <div className="h-[220px] md:h-[260px] relative overflow-hidden bg-muted/60 border-b border-border/60">
                  <Image
                    src={featuredProject.imagePath || "/placeholder.svg"}
                    alt={featuredProject.title}
                    fill
                    className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                <CardContent className="p-7 flex flex-col justify-center">
                  {featuredProject.role && featuredProject.context && featuredProject.year && (
                    <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground mb-3">
                      role: {featuredProject.role} · context: {featuredProject.context} · year: {featuredProject.year}
                    </p>
                  )}

                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {featuredProject.title}
                  </h3>

                  <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-1">
                    {featuredProject.hook}
                  </p>

                  <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground/70 hover:text-primary hover:underline underline-offset-4 w-fit">
                    View case →
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Other Projects - Standardized grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {otherProjects.map((project, i) => (
          <motion.div
            key={project.title}
            custom={i + 1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <Card
              className="h-full border-border shadow-sm group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/20 flex flex-col py-0 rounded-[0.6rem]"
              onClick={() => handleProjectClick(project)}
            >
              <div className="h-[220px] md:h-[260px] relative overflow-hidden bg-muted/60 border-b border-border/60">
                <Image
                  src={project.imagePath || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              <CardContent className="p-6 md:p-7 flex flex-col h-full">
                {project.role && project.context && project.year && (
                  <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground mb-3">
                    role: {project.role} · context: {project.context} · year: {project.year}
                  </p>
                )}

                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {project.title}
                </h3>

                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-muted-foreground mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-muted/60 text-[10px] leading-none whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed text-sm line-clamp-2">{project.hook}</p>

                <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-foreground/70 hover:text-primary hover:underline underline-offset-4 w-fit">
                  View case →
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={
          selectedProject
            ? {
                title: selectedProject.title,
                file: selectedProject.file,
                tags: selectedProject.tags,
                tools: selectedProject.tools,
                problem: selectedProject.problem,
                approach: selectedProject.approach,
                outcome: selectedProject.outcome,
                imagePath: selectedProject.imagePath,
              }
            : null
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </SectionWrapper>
  )
}
