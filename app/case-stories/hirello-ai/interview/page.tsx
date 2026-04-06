"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WindowShell } from "@/components/window-shell"
import { Badge } from "@/components/ui/badge"
import { ModuleCard, ModuleCardGrid } from "@/components/ui/module-card"
import { List, ListItem } from "@/components/ui/list-item"
import { H1, H3, P, Lead, Label, SectionLabel, Caption } from "@/components/ui/typography"
import { SystemLogProvider } from "@/contexts/system-log-context"
import { ReadingStoreProvider } from "@/contexts/reading-store-context"
import { ViewModeProvider } from "@/contexts/view-mode-context"

export default function HirelloInterviewPage() {
  return (
    <SystemLogProvider>
      <ReadingStoreProvider>
        <ViewModeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex">
              <div className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16 flex-1 flex">
                <div className="w-full">

                  {/* Breadcrumb */}
                  <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/case-stories/hirello-ai" className="hover:text-foreground transition-colors">Hirello</Link>
                    <span>/</span>
                    <span className="text-foreground">AI Interview Gym</span>
                  </nav>

                  <WindowShell title="hirello_interview_gym.tsx" className="max-h-full">
                    <div className="space-y-14 md:space-y-18">

                      {/* ── Hero ─────────────────────────────────────────── */}
                      <header className="space-y-5">
                        <Label>Module 02 · AI Interview Gym</Label>
                        <H1>Designing structured AI interview feedback</H1>
                        <P className="max-w-2xl">
                          Most mock interview tools ask questions and return vague scores. This module
                          was designed to replace emotional, unhelpful feedback with a measurable
                          diagnostic system — turning every practice session into a structured
                          improvement loop.
                        </P>

                        <div className="flex flex-wrap gap-2 text-xs">
                          {["Product Design", "AI & UX", "Feedback Systems"].map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-[#F0EDE8] text-[#44403c] border-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-mono text-muted-foreground">
                          <span>role: <span className="text-foreground">Founding Product Designer</span></span>
                          <span className="h-3 w-px bg-slate-300" />
                          <span>platform: <span className="text-foreground">Hirello.ai</span></span>
                          <span className="h-3 w-px bg-slate-300" />
                          <span>status: <span className="text-foreground">Live in production</span></span>
                          <span className="h-3 w-px bg-slate-300" />
                          <span>AI model: <span className="text-foreground">Hiro — career co‑pilot</span></span>
                        </div>
                      </header>

                      {/* ── 1. The Problem ──────────────────────────────── */}
                      <section className="space-y-4">
                        <SectionLabel>1. The problem</SectionLabel>
                        <Lead>
                          Practicing interviews is only useful if the feedback helps you improve.
                          Most tools don't close that loop.
                        </Lead>
                        <P>
                          Existing mock interview tools fall into two failure modes: generic encouragement
                          that doesn't identify specific weaknesses, or overwhelming transcripts that require
                          self-diagnosis. Neither produces a clear path to improvement.
                        </P>

                        <ModuleCardGrid cols={2}>
                          <ModuleCard variant="default" eyebrow="Failure mode A">
                            <Lead className="mt-1">Generic feedback</Lead>
                            <P className="mt-1">
                              "Good answer! Try to be more specific." — tells the user nothing about what
                              specifically failed or how to fix it.
                            </P>
                          </ModuleCard>
                          <ModuleCard variant="default" eyebrow="Failure mode B">
                            <Lead className="mt-1">Overwhelming transcripts</Lead>
                            <P className="mt-1">
                              Raw transcripts require the user to self-diagnose. Most people don't know
                              what "good" looks like, so they can't identify what "bad" is.
                            </P>
                          </ModuleCard>
                        </ModuleCardGrid>

                        <ModuleCard variant="dashed" eyebrow="Core insight">
                          <Lead className="mt-1">
                            "Feedback should be measurable, not emotional. And it should tell you exactly what to do next."
                          </Lead>
                        </ModuleCard>
                      </section>

                      {/* ── 2. Design principles ────────────────────────── */}
                      <section className="space-y-4">
                        <SectionLabel>2. Design principles</SectionLabel>
                        <ModuleCardGrid cols={3}>
                          <ModuleCard
                            variant="default"
                            eyebrow="Principle 01"
                            title="Structured over subjective"
                            description="Replace emotional qualifiers ('good', 'okay') with measurable dimensions: duration, pace, STAR compliance, content strength."
                          />
                          <ModuleCard
                            variant="default"
                            eyebrow="Principle 02"
                            title="Diagnosis before prescription"
                            description="Before telling users what to do, clearly surface what went wrong and why it matters. No prescription without diagnosis."
                          />
                          <ModuleCard
                            variant="default"
                            eyebrow="Principle 03"
                            title="Close the loop"
                            description="Feedback without a retry path is useless. Every insight must connect to a resource and a retry action."
                          />
                        </ModuleCardGrid>
                      </section>

                      {/* ── 3. Interview experience ──────────────────────── */}
                      <section className="space-y-6">
                        <SectionLabel>3. The system — four layers</SectionLabel>
                        <H3>Layer 1 — Interview experience design</H3>
                        <P>
                          The interview environment needed to feel immersive without being intimidating.
                          Users choose difficulty level, then enter a voice-enabled, conversational
                          interface with Hiro — Hirello's AI career co‑pilot.
                        </P>

                        <List spacing="normal">
                          <ListItem marker="bullet">
                            Difficulty selection sets user expectations and calibrates AI question complexity.
                          </ListItem>
                          <ListItem marker="bullet">
                            Voice-enabled interaction mirrors a real interview more closely than text alone.
                          </ListItem>
                          <ListItem marker="bullet">
                            Dark, focused UI during the session reduces environmental distraction — "interview mode".
                          </ListItem>
                        </List>

                        <div className="grid gap-3 md:grid-cols-2 md:items-start">
                          <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden">
                            <img
                              src="/hirello-interview-landing.png"
                              alt="Hirello Interview Gym landing screen with Hiro and difficulty selection"
                              className="block h-auto w-full"
                            />
                            <Caption className="px-3 py-2 border-t border-slate-200">
                              Landing screen — difficulty selection before entering the session.
                            </Caption>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden">
                            <img
                              src="/hirello-interview-live.png"
                              alt="Hirello live AI interview screen in dark immersive mode"
                              className="block h-auto w-full"
                            />
                            <Caption className="px-3 py-2 border-t border-slate-200">
                              Live session — focused dark UI, voice controls, Hiro as interviewer.
                            </Caption>
                          </div>
                        </div>
                      </section>

                      {/* ── 4. Performance snapshot ─────────────────────── */}
                      <section className="space-y-6">
                        <H3>Layer 2 — Performance snapshot system</H3>
                        <P>
                          After each session, users receive a structured evaluation dashboard — not a
                          pass/fail score, but a multi-dimensional breakdown that shows exactly where
                          to focus improvement efforts.
                        </P>

                        <ModuleCardGrid cols={2}>
                          {[
                            { label: "Duration",         desc: "Was the answer appropriately concise or overlong?" },
                            { label: "Pace",             desc: "Was delivery measured and clear, or rushed and unclear?" },
                            { label: "STAR compliance",  desc: "Did the answer follow Situation → Task → Action → Result structure?" },
                            { label: "Content strength", desc: "Were claims specific and evidence-backed, or vague and generic?" },
                          ].map(({ label, desc }) => (
                            <ModuleCard key={label} variant="default" eyebrow="Scored dimension">
                              <Lead className="mt-1">{label}</Lead>
                              <P className="mt-0.5">{desc}</P>
                            </ModuleCard>
                          ))}
                        </ModuleCardGrid>

                        <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden">
                          <img
                            src="/hirello-interview-summary.png"
                            alt="Hirello interview analysis dashboard with overall score and question breakdown"
                            className="block h-auto w-full"
                          />
                          <Caption className="px-4 py-2 border-t border-slate-200">
                            Post-session dashboard — multi-dimensional scoring with per-question breakdown.
                          </Caption>
                        </div>

                        <ModuleCard variant="dashed" eyebrow="Design decision">
                          <P className="mt-1">
                            Early designs showed a single overall score. Testing revealed users fixated
                            on the number and ignored the breakdown. Hiding the overall score until after
                            users reviewed all dimensions increased engagement with actionable feedback
                            by a significant margin.
                          </P>
                        </ModuleCard>
                      </section>

                      {/* ── 5. Diagnostic layer ──────────────────────────── */}
                      <section className="space-y-6">
                        <H3>Layer 3 — "What went wrong" diagnostic layer</H3>
                        <Lead>Turning vague criticism into structured growth.</Lead>
                        <P>
                          For each identified issue, the system surfaces a layered breakdown rather
                          than a single comment. The structure forces specificity and maps directly to
                          an action.
                        </P>

                        <List spacing="loose" marker="numbered">
                          <ListItem marker="numbered">
                            <div>
                              <span className="font-medium text-foreground">Issue identified</span>
                              <P className="mt-0.5">What specifically went wrong — named precisely, not vaguely.</P>
                            </div>
                          </ListItem>
                          <ListItem marker="numbered">
                            <div>
                              <span className="font-medium text-foreground">Why it matters</span>
                              <P className="mt-0.5">Connects the issue to interviewer perception — gives it stakes.</P>
                            </div>
                          </ListItem>
                          <ListItem marker="numbered">
                            <div>
                              <span className="font-medium text-foreground">Missing elements</span>
                              <P className="mt-0.5">The specific things that were absent — Result, quantification, context, etc.</P>
                            </div>
                          </ListItem>
                          <ListItem marker="numbered">
                            <div>
                              <span className="font-medium text-foreground">Fix instructions</span>
                              <P className="mt-0.5">Concrete, actionable rewrite guidance — not "be more specific".</P>
                            </div>
                          </ListItem>
                        </List>

                        <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden shadow-sm">
                          <img
                            src="/hirello-what-went-wrong.png"
                            alt="Hirello detailed feedback panel — issue, why it matters, missing elements, fix instructions"
                            className="block h-auto w-full"
                          />
                          <Caption className="px-4 py-2 border-t border-slate-200">
                            Diagnostic panel — four-layer structure turns criticism into a clear repair plan.
                          </Caption>
                        </div>
                      </section>

                      {/* ── 6. Learning loop ─────────────────────────────── */}
                      <section className="space-y-6">
                        <H3>Layer 4 — Learning loop integration</H3>
                        <P>
                          Feedback is only valuable if the user can immediately act on it. After
                          reviewing the diagnostic, users are guided into a learning sequence before
                          retrying the same question.
                        </P>

                        <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden max-w-xl">
                          <img
                            src="/hirello-learn-loop.png"
                            alt="Hirello learn-before-you-retry panel with STAR method video and framework resources"
                            className="block h-auto w-full"
                          />
                          <Caption className="px-4 py-2 border-t border-slate-200">
                            Learn panel — STAR content, sample answers, and retry button form a closed loop.
                          </Caption>
                        </div>

                        <P>
                          The loop is: <span className="font-medium text-foreground">answer → feedback → diagnose → learn → retry → improve</span>.
                          The retry button returns users to the same question with their context preserved,
                          so they can directly apply what they just learned.
                        </P>

                        <ModuleCard variant="dashed" eyebrow="Design decision">
                          <P className="mt-1">
                            The retry button was the most debated feature. The concern was that users would
                            keep retrying until they got a good score without actually improving.
                            The fix: the learning content is gated before retry, and previous attempts are
                            shown alongside the new attempt so users can see their own progression.
                          </P>
                        </ModuleCard>
                      </section>

                      {/* ── 7. Outcome ──────────────────────────────────── */}
                      <section className="space-y-4">
                        <SectionLabel>4. Outcome</SectionLabel>
                        <ModuleCardGrid cols={2}>
                          <ModuleCard variant="elevated" eyebrow="Feedback quality">
                            <Lead className="mt-1">Measurable replaced emotional</Lead>
                            <P className="mt-1">
                              Users shifted from "I think I did okay" to specific scores and actionable
                              gap analysis across four dimensions.
                            </P>
                          </ModuleCard>
                          <ModuleCard variant="elevated" eyebrow="Loop closure">
                            <Lead className="mt-1">Practice became progressive</Lead>
                            <P className="mt-1">
                              The feedback → learn → retry loop turned isolated practice sessions into
                              a compounding improvement system.
                            </P>
                          </ModuleCard>
                        </ModuleCardGrid>
                        <P>
                          The AI Interview Gym shipped into live production alongside the Networking
                          module, completing Hirello's vision of a full career operating system.
                          Both modules now inform the platform's roadmap for coaching and
                          personalisation features.
                        </P>
                      </section>

                      {/* ── 8. What I learned ───────────────────────────── */}
                      <section className="space-y-3">
                        <SectionLabel>5. What this taught me</SectionLabel>
                        <P>
                          Designing AI feedback systems is less about making the AI smarter and more
                          about making the output human-readable and actionable. The hardest design
                          problem wasn't the AI — it was figuring out how much structure was helpful
                          versus overwhelming, and how to make criticism feel constructive rather
                          than discouraging.
                        </P>
                        <Lead>
                          "AI should reduce the gap between 'I got feedback' and 'I know what to do next' to zero."
                        </Lead>
                      </section>

                      {/* ── Navigation ──────────────────────────────────── */}
                      <section className="space-y-4 border-t border-slate-200 pt-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link
                            href="/case-stories/hirello-ai/networking"
                            className="text-xs md:text-sm font-medium inline-flex items-center gap-1.5 rounded-full px-4 py-2 border border-slate-200 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                          >
                            ← Module 01 — Networking Intelligence
                          </Link>
                          <Link
                            href="/case-stories/hirello-ai/full"
                            className="text-xs md:text-sm font-medium inline-flex items-center gap-1.5 rounded-full px-4 py-2 border border-transparent bg-foreground text-background hover:bg-background hover:text-foreground hover:border-foreground/40 transition-colors"
                          >
                            Full case study →
                          </Link>
                        </div>
                        <Link
                          href="/case-stories/hirello-ai"
                          className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
                        >
                          Back to snapshot
                        </Link>
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
