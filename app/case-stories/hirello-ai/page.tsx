"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WindowShell } from "@/components/window-shell"
import { Badge } from "@/components/ui/badge"
import { SystemLogProvider } from "@/contexts/system-log-context"
import { ReadingStoreProvider } from "@/contexts/reading-store-context"
import { ViewModeProvider } from "@/contexts/view-mode-context"
import { childRise, childRiseHeavy } from "@/lib/motion"
import { DecodeText } from "@/components/decode-text"
import { CursorEffect } from "@/components/cursor-effect"
import { FilmGrain } from "@/components/film-grain"

const hirelloSnapshot = {
  title: "Hirello – AI Career Operating System",
  tags: ["Product Design", "AI & UX", "Systems Thinking"],
  tools: ["Figma", "FigJam", "Maze"],
  imagePath: "/hirello-hero.png",
  problem:
    "Job seekers rely on 3–5 fragmented tools with no system connecting them. User interviews revealed two core gaps: no structured flow for networking outreach, and no practice tool that gives detailed, diagnostic feedback. Existing platforms like LinkedIn handle messaging but offer no guided pipeline — and interview tools like Huru.ai work in isolation. No product combined both with a structured guide.",
  approach: [
    "Designed a Networking Intelligence System with contact tiers, guided outreach wizards, and a visual opportunity pipeline — giving users the repeatable workflow they were missing.",
    "Built an AI Interview Gym that delivers layered, diagnostic feedback: analysis on structure, pacing, STAR compliance, and clear 'what went wrong + how to fix it' loops — not just a score.",
    "Connected both modules into one career operating system, so networking conversations directly inform interview prep — making practice contextual and high-stakes, not generic.",
  ],
  outcome:
    "During early testing and demos, users consistently described the experience as 'something new we actually needed.' Structured outreach replaced ad-hoc spreadsheets, and interview prep gained measurable diagnostics for the first time. The product fills a gap no existing tool addresses: networking + interview coaching + a guided system in one place.",
}

export default function HirelloSnapshotPage() {
  return (
    <SystemLogProvider>
      <ReadingStoreProvider>
        <ViewModeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex">
              <div className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16 flex-1 flex">
                <div className="w-full">
                  <motion.div className="mb-8" variants={childRise} initial="hidden" animate="show" custom={0}>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span aria-hidden>←</span>
                      Back to home
                    </Link>
                  </motion.div>
                  <WindowShell title="case_story_hirello.tsx" className="max-h-full">
                    <div className="space-y-8">
                      {/* Hero / Snapshot */}
                      <motion.div
                        className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start"
                        variants={childRise}
                        initial="hidden"
                        animate="show"
                        custom={1}
                      >
                        <div className="space-y-4">
                          <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">
                            CASE SNAPSHOT · AI Career OS
                          </p>
                          <motion.h1
                            className="text-2xl md:text-3xl font-semibold text-foreground"
                            variants={childRiseHeavy}
                            initial="hidden"
                            animate="show"
                            custom={2}
                          >
                            <DecodeText text="Hirello – AI-First Hiring & Career Flow" delay={250} />
                          </motion.h1>
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            How I designed two connected systems — Networking Intelligence and AI Interview Gym — to turn a
                            chaotic job search into a structured, feedback-driven workflow.
                          </p>

                          <div className="flex flex-wrap gap-2 text-xs">
                            {hirelloSnapshot.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-white/[0.08] text-slate-200 border-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="relative h-40 md:h-48 rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                          <Image
                            src={hirelloSnapshot.imagePath}
                            alt="Hirello welcome screen with Hiro, the AI career co‑pilot"
                            fill
                            className="object-contain object-center"
                          />
                        </div>
                      </motion.div>

                      {/* Problem */}
                      <motion.section className="space-y-2" variants={childRise} initial="hidden" animate="show" custom={3}>
                        <h2 className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-[2px]" />
                          What was broken or unclear
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{hirelloSnapshot.problem}</p>
                      </motion.section>

                      {/* Approach */}
                      <motion.section className="space-y-2" variants={childRise} initial="hidden" animate="show" custom={4}>
                        <h2 className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-[2px]" />
                          How I explored, mapped, and designed
                        </h2>
                        <ul className="space-y-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                          {hirelloSnapshot.approach.map((item) => (
                            <li key={item} className="flex items-start gap-2">
                              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/70" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.section>

                      {/* Outcome */}
                      <motion.section className="space-y-2" variants={childRise} initial="hidden" animate="show" custom={5}>
                        <h2 className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-[2px]" />
                          What changed for users / stakeholders
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{hirelloSnapshot.outcome}</p>
                      </motion.section>

                      {/* Tools + CTA */}
                      <motion.section
                        className="space-y-4 border-t border-white/10 pt-6"
                        variants={childRise}
                        initial="hidden"
                        animate="show"
                        custom={6}
                      >
                        <div>
                          <h2 className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2 mb-2">
                            <span className="inline-block w-1.5 h-1.5 bg-primary rounded-[2px]" />
                            Tools used
                          </h2>
                          <div className="flex flex-wrap gap-2">
                            {hirelloSnapshot.tools.map((tool) => (
                              <Badge
                                key={tool}
                                variant="secondary"
                                className="font-mono text-xs bg-white/[0.08] text-slate-400 border-0"
                              >
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Level 3 CTA */}
                        <div className="border border-dashed border-white/15 rounded-lg px-4 py-3 md:px-5 md:py-4 bg-white/[0.05] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">
                              NEXT MODULE
                            </p>
                            <h3 className="text-sm md:text-base font-medium text-foreground">Explore Full Case Study</h3>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              Decisions, flows, tradeoffs, and what shipped.
                            </p>
                          </div>
                          <Link
                            href="/case-stories/hirello-ai/full"
                            className="text-xs md:text-sm font-medium inline-flex items-center gap-1 rounded-full px-4 py-2 border border-transparent bg-foreground text-background hover:bg-background hover:text-foreground hover:border-foreground/40 transition-colors underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                          >
                            Open system log →
                          </Link>
                        </div>
                      </motion.section>
                    </div>
                  </WindowShell>
                </div>
              </div>
            </main>
            <Footer />
          </div>

          {/* Custom cursor — always on top, chapter-color reactive */}
          <CursorEffect />

          {/* Cinematic film grain — sits above scene, below cursor */}
          <FilmGrain />
        </ViewModeProvider>
      </ReadingStoreProvider>
    </SystemLogProvider>
  )
}
