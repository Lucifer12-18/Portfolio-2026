"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ModuleBadge } from "@/components/module-badge"
import { SectionWrapper } from "@/components/section-wrapper"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { TypewriterText } from "@/components/typewriter-text"
import Image from "next/image"

const roles = ["Product Design", "UX Research", "AI & Systems Thinking", "Information Systems @ UMBC"]

const systemInfo = {
  focus: ["UX", "AI", "Systems"],
  strengths: ["Systems Thinking", "Communication"],
  tools: ["Figma", "FigJam", "Miro", "Notion"],
}

type ViewMode = "recruiter" | "designer"

type HeroCopy = {
  headline: string
  description: string
  bullets?: string[]
}

const heroContent: Record<ViewMode, HeroCopy> = {
  recruiter: {
    headline: "Designing clarity inside complex systems.",
    description:
      "I'm Vishal Deshmukh, a Product Designer with an engineering + systems background. I design calm, trustworthy interfaces for AI workflows, data-heavy tools, and multi-step user journeys. Currently Founding Product Designer at Hirello, building AI-driven career tools end-to-end.",
    bullets: [
      "Founding Product Designer at Hirello (AI-driven career tools)",
      "Information Systems background — data, APIs, architecture",
      "Focus: AI + product + complexity; systems-thinking narrative",
    ],
  },
  designer: {
    headline: "Designing clarity inside complex systems.",
    description: `Hi, I'm Vishal Deshmukh, a Product Designer with an engineering + systems background. I design calm, trustworthy interfaces for products where the complexity lives under the hood: AI workflows, data-heavy tools, and multi-step user journeys.

I started in Information Systems, learning how data moves, how APIs connect, and how architecture quietly keeps things running. Over time I realized the real challenge wasn't just making systems work  it was making them understandable.

Right now, I'm a Founding Product Designer at Hirello, designing AI-driven career tools end-to-end  from research and flow mapping to high-fidelity UI and iteration with cross-functional teams.

This portfolio is a record of how I think and ship:
from "how it works" → to "how it feels to use."`,
  },
}


export function HeroSection() {
  const { viewMode } = useViewMode()
  const content = heroContent[viewMode as ViewMode]

  const miniWindows = [
    { filename: "system_arch.fig", image: "/images/prologue-system-arch.png" },
    { filename: "ai_integration.ai", image: "/images/prologue-ai-integration.png" },
  ]

  const skillSet = [
    { label: "UX Research", borderClass: "border-l-blue-500" },
    { label: "Systems Design", borderClass: "border-l-violet-500" },
    { label: "AI/ML UX", borderClass: "border-l-cyan-500" },
    { label: "Figma", borderClass: "border-l-red-500" },
    { label: "Prototyping", borderClass: "border-l-amber-500" },
    { label: "Design Ops", borderClass: "border-l-emerald-500" },
    { label: "Data Viz", borderClass: "border-l-purple-500" },
  ]

  return (
    <SectionWrapper
      id="prologue"
      className="pt-20 md:pt-24"
      windowTitle="PROLOGUE · PIXELOGIC OS"
      moduleLabel="PROLOGUE · PIXELOGIC OS"
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left Column */}
        <div className="space-y-5">
          <ModuleBadge module="00" label="PROLOGUE" />

          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TypewriterText
              text={content.headline}
              speed={28}
              loop={false}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight text-slate-50"
            />
          </motion.div>

          <p className="text-xs font-mono text-slate-500 tracking-wide">
            <span className="text-cyan-400/60">$</span> boot: designing clarity inside complex systems<span className="inline-block w-[2px] h-3 bg-cyan-400/50 animate-pulse ml-0.5 align-middle rounded-full" />
          </p>

          <motion.div
            key={`desc-${viewMode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-3"
          >
            {viewMode === "recruiter" && content.bullets && (
              <div className="flex flex-col gap-2 p-3.5 bg-primary/5 rounded-xl border border-primary/10 mb-3">
                <span className="text-xs font-mono text-primary uppercase tracking-wide">Quick Summary</span>
                <ul className="space-y-1.5">
                  {content.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl whitespace-pre-line">
              {content.description}
            </p>
          </motion.div>

          {/* Role Pills */}
          <div className="flex flex-wrap gap-2">
            {roles.map((role, i) => (
              <Badge
                key={role}
                variant="outline"
                className={`px-4 py-2 text-sm font-medium bg-background border-border text-foreground ${
                  i === 2 ? "border-[#A78BFA]/30 bg-[#EDE9FE]/30" : ""
                }`}
              >
                {role}
              </Badge>
            ))}
          </div>

          {/* Status Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-3 px-4 bg-secondary/50 rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-green-400"
                  style={{ filter: "drop-shadow(0 0 6px #22c55e)" }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.75, 0, 0.75],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                  }}
                />
                <span
                  className="relative inline-flex rounded-full h-3 w-3 bg-green-500"
                  style={{ filter: "drop-shadow(0 0 4px #22c55e)" }}
                ></span>
              </span>
              <span className="text-sm font-medium text-foreground font-mono">status: available</span>
            </div>
            <div className="text-sm text-muted-foreground font-mono">location: Baltimore, MD | remote: true</div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.15 }}>
              <Button
                size="lg"
                className="gap-2 shadow-md hover:shadow-lg transition-all rounded-full px-8 py-6 text-base btn-soft-hover"
                asChild
              >
                <a href="#work">
                  View Case Stories
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} transition={{ duration: 0.15 }}>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent rounded-full px-8 py-6 text-base hover:bg-[#EDE9FE]/50 hover:border-[#A78BFA]/30 transition-all"
                asChild
              >
                <a href="#process">See How I Work</a>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Mini Window Stack + SKILL.SET (with spacing) */}
        <div className="space-y-5">
          {miniWindows.map((window, index) => (
            <motion.div
              key={window.filename}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{
                delay: 0.2 + index * 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 250,
                damping: 24,
              }}
            >
              <Card className="overflow-hidden border-white/8 bg-slate-900/70 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border-b border-white/5">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                    <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                    <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">{window.filename}</span>
                </div>
                <div className="aspect-video relative overflow-hidden bg-slate-800/50 flex items-center justify-center">
                  <Image
                    src={window.image}
                    alt={window.filename}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </Card>
            </motion.div>
          ))}

          {/* SKILL.SET — comfortable spacing between heading, tags, and between tags */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="pt-4"
          >
            <h3 className="font-pixel text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-4">
              SKILL.SET:
            </h3>
            <div className="flex flex-wrap gap-3">
              {skillSet.map((skill) => (
                <span
                  key={skill.label}
                  className={`inline-flex items-center rounded-md border-l-4 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-300 shadow-sm border border-white/8 ${skill.borderClass}`}
                >
                  {skill.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
