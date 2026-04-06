"use client"

import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WindowShell } from "@/components/window-shell"
import { Badge } from "@/components/ui/badge"
import { SystemLogProvider } from "@/contexts/system-log-context"
import { ReadingStoreProvider } from "@/contexts/reading-store-context"
import { ViewModeProvider } from "@/contexts/view-mode-context"

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
                  <div className="mb-8">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span aria-hidden>←</span>
                      Back to home
                    </Link>
                  </div>
                  <WindowShell title="case_story_hirello.tsx" className="max-h-full">
                    <div className="space-y-8">
                      {/* Hero / Snapshot */}
                      <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
                        <div className="space-y-4">
                          <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">
                            CASE SNAPSHOT · AI Career OS
                          </p>
                          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
                            Hirello – AI-First Hiring & Career Flow
                          </h1>
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            How I designed two connected systems — Networking Intelligence and AI Interview Gym — to turn a
                            chaotic job search into a structured, feedback-driven workflow.
                          </p>

                          <div className="flex flex-wrap gap-2 text-xs">
                            {hirelloSnapshot.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-[#F0EDE8] text-[#44403c] border-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="relative h-40 md:h-48 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                          <Image
                            src={hirelloSnapshot.imagePath}
                            alt="Hirello welcome screen with Hiro, the AI career co‑pilot"
                            fill
                            className="object-contain object-center"
                          />
                        </div>
                      </div>

                      {/* Problem */}
                      <section className="space-y-2">
                        <h2 className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-[2px]" />
                          What was broken or unclear
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{hirelloSnapshot.problem}</p>
                      </section>

                      {/* Approach */}
                      <section className="space-y-2">
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
                      </section>

                      {/* Outcome */}
                      <section className="space-y-2">
                        <h2 className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                          <span className="inline-block w-1.5 h-1.5 bg-primary rounded-[2px]" />
                          What changed for users / stakeholders
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{hirelloSnapshot.outcome}</p>
                      </section>

                      {/* Tools + CTA */}
                      <section className="space-y-4 border-t border-slate-200 pt-6">
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
                                className="font-mono text-xs bg-[#F0EDE8] text-[#6B6B7B] border-0"
                              >
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Level 3 CTA */}
                        <div className="border border-dashed border-slate-300/80 rounded-lg px-4 py-3 md:px-5 md:py-4 bg-slate-50/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                      </section>
                    </div>
                  </WindowShell>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </ViewModeProvider>
      </ReadingStoreProvider>
    </SystemLogProvider>
  )
}

