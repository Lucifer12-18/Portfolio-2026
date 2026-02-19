"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WindowShell } from "@/components/window-shell"
import { SystemLogProvider } from "@/contexts/system-log-context"
import { ReadingStoreProvider } from "@/contexts/reading-store-context"
import { ViewModeProvider } from "@/contexts/view-mode-context"

export default function HirelloFullCaseStudyPage() {
  return (
    <SystemLogProvider>
      <ReadingStoreProvider>
        <ViewModeProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
            <WindowShell title="hirello_ai_full_case.tsx">
              <div className="space-y-16 md:space-y-20">
                {/* 1. Hero / Overview */}
                <header className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">
                      CASE STUDY · PRODUCT / UX
                    </p>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-wide text-foreground">Hirello</h1>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Designing an AI Career Operating System for Job Seekers.
                    </p>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-mono text-muted-foreground">
                    <span>
                      role: <span className="text-foreground">Founding Product Designer</span>
                    </span>
                    <span className="h-3 w-px bg-slate-300" />
                    <span>
                      team: <span className="text-foreground">2 (Product + Engineering)</span>
                    </span>
                    <span className="h-3 w-px bg-slate-300" />
                    <span>
                      stage: <span className="text-foreground">Live Production Platform</span>
                    </span>
                    <span className="h-3 w-px bg-slate-300" />
                    <span>
                      users: <span className="text-foreground">Job Seekers</span>
                    </span>
                    <span className="h-3 w-px bg-slate-300" />
                    <span>
                      scope:{" "}
                      <span className="text-foreground">
                        End-to-End UX · Systems Thinking · Interaction Design · Production Handoff
                      </span>
                    </span>
                  </div>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Hirello is a live AI-powered career platform helping job seekers structure their networking, outreach,
                    and interview preparation.
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    As Founding Product Designer, I designed and shipped two core systems: a Networking Intelligence
                    System and an AI Interview Gym. Both live in production today.
                  </p>

                  <p className="text-sm md:text-base font-semibold text-center text-foreground/90">
                    Two systems. One goal: turn chaos into measurable momentum.
                  </p>

                  {/* Hero product image */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden inline-block max-w-xl mx-auto">
                    <img
                      src="/hirello-hero.png"
                      alt="Welcome screen for Hirello with Hiro, the AI career co-pilot"
                      className="block h-auto w-full"
                    />
                  </div>
                </header>

                {/* 2. The Opportunity / Problem */}
                <section className="space-y-4 pt-6">
                  <h2 className="text-sm font-mono uppercase tracking-[0.18em] text-muted-foreground">1. The problem</h2>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Modern job search is chaotic.
                  </p>
                  <ul className="space-y-1.5 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <li>• Job seekers track networking in spreadsheets.</li>
                    <li>• Forget follow-ups.</li>
                    <li>• Send generic outreach messages.</li>
                    <li>• Practice interviews without structured feedback.</li>
                    <li>• Repeat mistakes without knowing why.</li>
                  </ul>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Job seekers don’t fail because they lack skill. They fail because they lack structure and feedback
                    loops.
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    The opportunity: design a system that reduces chaos and increases momentum.
                  </p>
                </section>

                {/* 3. Design Strategy */}
                <section className="space-y-4 pt-4">
                  <h2 className="text-sm font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    2. Design philosophy
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Instead of designing features, I designed systems. Two principles guided the work:
                  </p>
                  <ul className="space-y-1.5 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <li>• Structure reduces anxiety — when everything has a place, users feel in control.</li>
                    <li>• Feedback accelerates growth — without measurable feedback, practice doesn’t compound.</li>
                  </ul>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Everything in Hirello maps back to those two ideas.
                  </p>
                </section>

                {/* Module 01 — Networking Intelligence System */}
                <section className="space-y-8 pt-6">
                  <h2 className="text-sm font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    Module 1 — Networking Intelligence System
                  </h2>
                  <h3 className="text-base font-semibold text-foreground">Designing a CRM for job seekers</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Job seekers don’t need “contacts” — they need strategy. Networking is typically unstructured and
                    reactive. The goal was to create a prioritisation system, a contact tracking system, a guided outreach
                    workflow, and a visual opportunity pipeline.
                  </p>

                  {/* Contact architecture */}
                  <div className="space-y-4 md:grid md:grid-cols-[3fr_2fr] md:gap-8 md:items-start">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">A. Structured contact intelligence</h4>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        Instead of a flat list, I introduced relationship tiers:
                      </p>
                      <ul className="space-y-1.5 text-sm md:text-base text-muted-foreground leading-relaxed">
                        <li>• Inner Circle</li>
                        <li>• Close Network</li>
                        <li>• Specialty Recruiting Firms</li>
                        <li>• Previous Co-Workers</li>
                      </ul>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        This reframed networking from random outreach to intentional momentum building.
                      </p>
                    </div>
                    <div className="space-y-2 flex justify-center md:justify-end">
                      <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden inline-block w-[85%]">
                        <img
                          src="/hirello-contacts.png"
                          alt="Hirello Add Contact modal with tiers, metadata, and follow-up fields"
                          className="block h-auto w-full"
                        />
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground/80 md:col-span-2">
                      Contacts structured with tier, metadata, and follow-up state.
                    </p>
                  </div>

                  {/* Guided outreach wizard */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      B. Guided outreach wizard (reducing decision fatigue)
                    </h4>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Cold outreach creates decision fatigue. To reduce friction, I designed a three-step guided system:
                    </p>
                    <ul className="space-y-1.5 text-sm md:text-base text-muted-foreground leading-relaxed">
                      <li>• Step 1 — Select contacts</li>
                      <li>• Step 2 — Choose template</li>
                      <li>• Step 3 — Preview and send</li>
                    </ul>
                    <p className="text-sm md:text-base font-semibold text-foreground/90">
                      Cold outreach should feel guided, not overwhelming.
                    </p>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      This progressive structure reduced cognitive overload and increased clarity.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden inline-block transform scale-[0.95] opacity-90">
                        <img
                          src="/hirello-outreach-step-1.png"
                          alt="Hirello outreach wizard — step 1 thumbnail"
                          className="block h-auto w-40 md:w-48"
                        />
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden inline-block transform scale-[0.95] opacity-90">
                        <img
                          src="/hirello-outreach-step-2.png"
                          alt="Hirello outreach wizard — step 2 thumbnail"
                          className="block h-auto w-40 md:w-48"
                        />
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden inline-block transform scale-[0.95] opacity-90">
                        <img
                          src="/hirello-outreach-step-3.png"
                          alt="Hirello outreach wizard — step 3 thumbnail"
                          className="block h-auto w-40 md:w-48"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Opportunity pipeline */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">C. Opportunity pipeline</h4>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Momentum must be visible. Users needed a clear sense of where every lead sat and what should happen
                      next.
                    </p>
                    <div className="flex justify-center">
                      <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden inline-block">
                        <img
                          src="/hirello-pipeline.png"
                          alt="Hirello opportunity pipeline Kanban view"
                          className="block h-auto w-full"
                        />
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Networking shifted from reactive to repeatable — a job-seeker-specific CRM with prioritisation logic
                      and outreach sequencing.
                    </p>
                  </div>
                </section>

                {/* Module break */}
                <section className="pt-12 md:pt-16">
                  <div className="border-t border-slate-200 mb-6" />
                  <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-center text-muted-foreground">
                    Module 2 — AI Interview Gym
                  </p>
                </section>

                {/* Module 02 — AI Interview Gym */}
                <section className="space-y-8 pt-2">
                  <h2 className="text-sm font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    Module 2 — AI Interview Gym
                  </h2>
                  <h3 className="text-base font-semibold text-foreground">Designing structured AI interview feedback</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Most mock interview tools ask questions, provide generic feedback, and rarely explain impact. The goal
                    for Hirello was to design real-time interaction, structured scoring, clear diagnostics, and actionable
                    improvement loops.
                  </p>

                  {/* Interview experience */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">1. Interview experience design</h4>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Users begin with difficulty selection, voice-enabled interaction, and a conversational AI interface
                      designed to feel immersive but not intimidating.
                    </p>
                    <div className="grid gap-3 md:grid-cols-2 md:items-start">
                      <div className="flex justify-center">
                        <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden inline-block w-[80%]">
                          <img
                            src="/hirello-interview-landing.png"
                            alt="Hirello Interview Gym landing screen with Hiro and difficulty selection"
                            className="block h-auto w-full"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden inline-block w-[80%]">
                          <img
                            src="/hirello-interview-live.png"
                            alt="Hirello live AI interview screen in dark immersive mode"
                            className="block h-auto w-full"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground/80">
                      Voice-enabled, immersive but non-intimidating interaction.
                    </p>
                  </div>

                  {/* Performance snapshot */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">2. Performance snapshot system</h4>
                    <p className="text-sm md:text-base font-semibold text-foreground/90">
                      Feedback should be measurable, not emotional.
                    </p>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      After each session, users receive structured evaluation across duration, pace, structure (STAR
                      compliance), content strength, and an overall score. Feedback becomes measurable, not emotional.
                    </p>
                    <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden inline-block">
                      <img
                        src="/hirello-interview-summary.png"
                        alt="Hirello interview analysis dashboard with overall score and detailed question breakdown"
                        className="block h-auto w-full"
                      />
                    </div>
                  </div>

                  {/* Diagnostic layer */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">3. “What went wrong” diagnostic layer</h4>
                    <p className="text-sm md:text-base font-semibold text-foreground/90">
                      Turning vague criticism into structured growth.
                    </p>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Instead of vague comments, I designed a layered breakdown: the issue identified, why it matters,
                      missing elements, fix instructions, and a clear retry option. This turns criticism into growth.
                    </p>
                    <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden inline-block shadow-sm">
                      <img
                        src="/hirello-what-went-wrong.png"
                        alt="Hirello detailed feedback panel showing issue, why it matters, missing elements and how to fix"
                        className="block h-auto w-full"
                      />
                    </div>
                  </div>

                  {/* Learning loop */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-foreground">4. Learning loop integration</h4>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      Users are guided to improve via STAR method content, framework guides, sample high-scoring answers,
                      and a retry answer button — forming a loop of feedback → learn → retry → improve.
                    </p>
                    <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden inline-block max-w-xl">
                      <img
                        src="/hirello-learn-loop.png"
                        alt="Hirello learn-before-you-retry panel with STAR method video and resources"
                        className="block h-auto w-full"
                      />
                    </div>
                  </div>
                </section>

                {/* Impact */}
                <section className="space-y-3 pt-10">
                  <h2 className="text-sm font-mono uppercase tracking-[0.18em] text-muted-foreground">4. Impact</h2>
                  <div className="space-y-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                    <p className="font-semibold">
                      Structured networking workflows replaced ad-hoc, spreadsheet-based tracking.
                    </p>
                    <p className="font-semibold">
                      Outreach became a repeatable sequence instead of one-off, generic messages.
                    </p>
                    <p className="font-semibold">
                      Interview preparation gained measurable metrics and clear diagnostics.
                    </p>
                    <p className="font-semibold">
                      Two AI-driven modules now run in a live production platform, informing future product work.
                    </p>
                  </div>
                </section>

                {/* My role */}
                <section className="space-y-3 pt-8">
                  <h2 className="text-sm font-mono uppercase tracking-[0.18em] text-muted-foreground">5. My role</h2>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    As Founding Product Designer, I owned the end-to-end experience: mapping workflows, defining IA and
                    interaction patterns, structuring feedback systems, and partnering directly with engineering to ship
                    and iterate in production.
                  </p>
                </section>

                {/* What this taught me */}
                <section className="space-y-3 pt-4">
                  <h2 className="text-sm font-mono uppercase tracking-[0.18em] text-muted-foreground">
                    6. What this taught me
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Designing AI products is less about raw intelligence and more about structuring ambiguity, making
                    feedback safe but honest, and creating measurable improvement loops. Hirello reinforced that AI
                    products should guide decisions without overwhelming users or taking control away from them.
                  </p>
                </section>

                {/* Why this matters */}
                <section className="space-y-3 border-t border-slate-200 pt-5">
                  <h2 className="text-sm font-mono uppercase tracking-wide text-muted-foreground">
                    Why this matters
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    Job search is emotionally heavy. Designing structured systems reduces anxiety, creates clarity,
                    encourages consistency, and turns uncertainty into measurable progress.
                  </p>
                </section>

                {/* Back links */}
                <section className="flex flex-wrap gap-4 border-t border-slate-200 pt-5 text-sm">
                  <Link
                    href="#work"
                    className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                  >
                    ← Back to Case Stories
                  </Link>
                </section>
              </div>
            </WindowShell>
          </main>
          <Footer />
        </ViewModeProvider>
      </ReadingStoreProvider>
    </SystemLogProvider>
  )
}

