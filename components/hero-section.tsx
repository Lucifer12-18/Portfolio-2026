"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SectionWrapper } from "@/components/section-wrapper"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { useReadingStore } from "@/contexts/reading-store-context"
import { Magnetic } from "@/components/magnetic"
import { Spotlight } from "@/components/spotlight"
import Image from "next/image"

const roles = ["Product Design", "UX Research", "AI & Systems Thinking", "Information Systems @ UMBC"]

type ViewMode = "recruiter" | "designer"

type HeroCopy = {
  eyebrow: string
  headline: [string, string, string] // [pre, emphasis, post] — middle word gets the shimmer
  lede: string
  description: string
  bullets?: string[]
}

const heroContent: Record<ViewMode, HeroCopy> = {
  recruiter: {
    eyebrow: "Chapter 00 · Prologue · Pixelogic OS",
    headline: ["Designing", "clarity", "inside complex systems."],
    lede:
      "Product Designer with an engineering + systems background. I design calm, trustworthy interfaces for AI workflows, data-heavy tools, and multi-step user journeys.",
    description:
      "Currently Founding Product Designer at Hirello, building AI-driven career tools end-to-end.",
    bullets: [
      "Founding Product Designer at Hirello (AI-driven career tools)",
      "Information Systems background — data, APIs, architecture",
      "Focus: AI + product + complexity; systems-thinking narrative",
    ],
  },
  designer: {
    eyebrow: "Chapter 00 · Prologue · Pixelogic OS",
    headline: ["Designing", "clarity", "inside complex systems."],
    lede:
      "I'm Vishal Deshmukh. I design calm, trustworthy interfaces for products where the complexity lives under the hood — AI workflows, data-heavy tools, multi-step journeys.",
    description: `I started in Information Systems, learning how data moves, how APIs connect, and how architecture quietly keeps things running. Over time I realized the real challenge wasn't just making systems work — it was making them understandable.

Right now, I'm Founding Product Designer at Hirello, designing AI-driven career tools end-to-end — from research and flow mapping to high-fidelity UI.

This portfolio is a record of how I think and ship: from "how it works" → to "how it feels to use."`,
  },
}

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

export function HeroSection() {
  const { viewMode } = useViewMode()
  const { setActiveChapterIndex } = useReadingStore()
  const content = heroContent[viewMode as ViewMode]

  const miniWindows = [
    { filename: "system_arch.fig", image: "/images/prologue-system-arch.svg" },
    { filename: "ai_integration.ai", image: "/images/prologue-ai-integration.svg" },
  ]

  return (
    <SectionWrapper
      id="prologue"
      className="pt-20 md:pt-24"
      windowTitle="PROLOGUE · PIXELOGIC OS"
      moduleLabel="PROLOGUE · PIXELOGIC OS"
    >
      {/* Decorative chapter numeral — anchors the composition */}
      <div
        aria-hidden="true"
        className="absolute top-4 right-6 md:right-10 marquee-num select-none"
      >
        00
      </div>

      <div className="relative grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Left Column — editorial text block (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <span className="eyebrow">{content.eyebrow}</span>
          </motion.div>

          {/* Editorial headline */}
          <motion.h1
            key={viewMode}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="display-xl text-slate-50"
          >
            {content.headline[0]}{" "}
            <em className="not-italic text-shimmer">{content.headline[1]}</em>{" "}
            <span className="text-slate-300/90">{content.headline[2]}</span>
          </motion.h1>

          {/* System boot line — keeps the Pixelogic OS voice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="text-[11px] font-mono text-slate-500 tracking-wide"
          >
            <span className="text-cyan-400/70">$</span> boot: designing clarity inside complex systems
            <span className="inline-block w-[2px] h-3 bg-cyan-400/60 animate-pulse ml-1 align-middle rounded-full" />
          </motion.p>

          {/* Lede */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="lede"
          >
            {content.lede}
          </motion.p>

          {/* Rule + body */}
          <div className="rule-tick" />

          <motion.div
            key={`desc-${viewMode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28, ease }}
            className="space-y-5"
          >
            {viewMode === "recruiter" && content.bullets && (
              <div className="flex flex-col gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <span className="eyebrow" style={{ color: "rgba(74, 123, 247, 0.9)" }}>
                  Quick Summary
                </span>
                <ul className="space-y-1.5 mt-2">
                  {content.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-[15px] lg:text-base text-muted-foreground leading-[1.75] max-w-xl whitespace-pre-line">
              {content.description}
            </p>
          </motion.div>

          {/* Role pills — restrained */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono text-slate-400 uppercase tracking-[0.18em]"
          >
            {roles.map((role, i) => (
              <span key={role} className="inline-flex items-center gap-2">
                {i > 0 && <span className="text-slate-600">·</span>}
                <span className={i === 2 ? "text-[#c7b7ff]" : ""}>{role}</span>
              </span>
            ))}
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-2.5 px-4 bg-secondary/50 rounded-xl border border-border"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-green-400"
                  style={{ filter: "drop-shadow(0 0 6px #22c55e)" }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"
                  style={{ filter: "drop-shadow(0 0 4px #22c55e)" }}
                />
              </span>
              <span className="text-sm font-medium text-foreground font-mono">status: available</span>
            </div>
            <div className="text-sm text-muted-foreground font-mono">Baltimore, MD · remote: true</div>
          </motion.div>

          {/* CTAs — magnetic pull for tactile hero moment */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.58 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Magnetic strength={10} range={110}>
              <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Button
                  size="lg"
                  className="gap-2 shadow-md hover:shadow-lg transition-all rounded-full px-8 py-6 text-base btn-soft-hover"
                  onClick={() => setActiveChapterIndex(4)}
                >
                  View Case Stories
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </Magnetic>
            <Magnetic strength={8} range={100}>
              <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent rounded-full px-8 py-6 text-base hover:bg-[#EDE9FE]/50 hover:border-[#A78BFA]/30 transition-all"
                  onClick={() => setActiveChapterIndex(3)}
                >
                  See How I Work
                </Button>
              </motion.div>
            </Magnetic>
          </motion.div>
        </div>

        {/* Right Column — mini windows (5 cols, small offset for asymmetry) */}
        <div className="lg:col-span-5 lg:pt-10 space-y-5">
          {miniWindows.map((window, index) => (
            <motion.div
              key={window.filename}
              initial={{ opacity: 0, x: 24, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              whileHover={{ y: -5, scale: 1.015 }}
              transition={{
                delay: 0.25 + index * 0.12,
                duration: 0.6,
                ease,
              }}
            >
              <Spotlight size={240} color={index === 0 ? "34, 211, 238" : "167, 139, 250"} intensity={0.18} className="rounded-xl">
              <Card className="overflow-hidden border-white/8 bg-slate-900/70 shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.65)] transition-all">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border-b border-white/5">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                    <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                    <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">{window.filename}</span>
                </div>
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-800/50 flex items-center justify-center">
                  <Image
                    src={window.image}
                    alt={window.filename}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </Card>
              </Spotlight>
            </motion.div>
          ))}

          {/* Skill tags — editorial, inline, restrained */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4, ease }}
            className="pt-4 border-t border-white/5"
          >
            <span className="eyebrow mb-4 block">Skill Set</span>
            <p className="mt-3 text-sm text-slate-400 leading-[1.9]">
              <span className="text-slate-200">UX Research</span>
              <span className="text-slate-600 mx-2">/</span>
              <span className="text-slate-200">Systems Design</span>
              <span className="text-slate-600 mx-2">/</span>
              <span className="text-cyan-300/90">AI · ML UX</span>
              <span className="text-slate-600 mx-2">/</span>
              <span className="text-slate-200">Figma</span>
              <span className="text-slate-600 mx-2">/</span>
              <span className="text-slate-200">Prototyping</span>
              <span className="text-slate-600 mx-2">/</span>
              <span className="text-slate-200">Design Ops</span>
              <span className="text-slate-600 mx-2">/</span>
              <span className="text-violet-300/90">Data Viz</span>
            </p>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
