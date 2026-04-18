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

export default function HirelloNetworkingPage() {
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
                    <span className="text-foreground">Networking Intelligence</span>
                  </nav>

                  <WindowShell title="hirello_networking_module.tsx" className="max-h-full">
                    <div className="space-y-14 md:space-y-18">

                      {/* ── Hero ─────────────────────────────────────────── */}
                      <header className="space-y-5">
                        <Label>Module 01 · Networking Intelligence System</Label>
                        <H1>Designing a CRM for job seekers</H1>
                        <P className="max-w-2xl">
                          Job seekers don't need "contacts" — they need strategy. This module replaced
                          ad-hoc spreadsheets with a structured, priority-driven networking workflow:
                          contact tiers, guided outreach, and a visual opportunity pipeline.
                        </P>

                        <div className="flex flex-wrap gap-2 text-xs">
                          {["Product Design", "AI & UX", "Systems Design"].map((tag) => (
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
                          <span>tools: <span className="text-foreground">Figma · FigJam · Maze</span></span>
                        </div>
                      </header>

                      {/* ── 1. The Problem ──────────────────────────────── */}
                      <section className="space-y-4">
                        <SectionLabel>1. The problem</SectionLabel>
                        <Lead>
                          Networking is one of the highest-leverage job search activities. But almost
                          no one does it well — because the tooling doesn't support it.
                        </Lead>
                        <P>
                          Job seekers track contacts in spreadsheets, forget who they reached out to,
                          send the same generic LinkedIn message to everyone, and have no way to see
                          where momentum is building. The result is reactive outreach instead of
                          intentional relationship building.
                        </P>
                        <ModuleCard variant="dashed" eyebrow="Core insight">
                          <Lead className="mt-1">
                            "Networking fails because it lacks structure, not because people don't try."
                          </Lead>
                        </ModuleCard>
                      </section>

                      {/* ── 2. Design principles ────────────────────────── */}
                      <section className="space-y-4">
                        <SectionLabel>2. Design principles</SectionLabel>
                        <P>Three principles constrained every decision in this module:</P>
                        <ModuleCardGrid cols={3}>
                          <ModuleCard
                            variant="default"
                            eyebrow="Principle 01"
                            title="Prioritisation over completeness"
                            description="Not every contact matters equally. The system should surface high-leverage relationships, not just list everyone."
                          />
                          <ModuleCard
                            variant="default"
                            eyebrow="Principle 02"
                            title="Reduce decision fatigue"
                            description="Outreach fails because the path forward is unclear. Every step should have an obvious next action."
                          />
                          <ModuleCard
                            variant="default"
                            eyebrow="Principle 03"
                            title="Make momentum visible"
                            description="Users need to feel progress. A visual pipeline replaces the anxiety of scattered spreadsheets."
                          />
                        </ModuleCardGrid>
                      </section>

                      {/* ── 3. Contact architecture ─────────────────────── */}
                      <section className="space-y-6">
                        <SectionLabel>3. Contact architecture</SectionLabel>
                        <H3>A. Structured contact intelligence</H3>
                        <P>
                          The first problem to solve was the flat contact list. When everything is equal,
                          nothing is actionable. I introduced relationship tiers to reframe networking as
                          intentional momentum-building rather than random outreach.
                        </P>

                        <div className="grid gap-6 md:grid-cols-[3fr_2fr] md:items-start">
                          <div className="space-y-3">
                            <P className="font-medium text-foreground">Four tiers, each with distinct follow-up logic:</P>
                            <List spacing="normal">
                              <ListItem marker="dot">
                                <span><span className="font-medium text-foreground">Inner Circle</span> — warm contacts, prioritised for direct referrals</span>
                              </ListItem>
                              <ListItem marker="dot">
                                <span><span className="font-medium text-foreground">Close Network</span> — second-degree connections worth cultivating</span>
                              </ListItem>
                              <ListItem marker="dot">
                                <span><span className="font-medium text-foreground">Specialty Recruiting Firms</span> — niche recruiters relevant to target roles</span>
                              </ListItem>
                              <ListItem marker="dot">
                                <span><span className="font-medium text-foreground">Previous Co-Workers</span> — historical context, re-engagement opportunities</span>
                              </ListItem>
                            </List>
                            <P>
                              Tiers drive prioritisation logic throughout the pipeline — inner circle
                              contacts surface first, have tighter follow-up windows, and get richer
                              outreach templates.
                            </P>
                          </div>
                          <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden">
                            <img
                              src="/hirello-contacts.png"
                              alt="Hirello Add Contact modal showing tier selection, metadata fields, and follow-up state"
                              className="block h-auto w-full"
                            />
                            <Caption className="px-3 py-2 border-t border-slate-200">
                              Add Contact modal — tier, metadata, and follow-up state in one view.
                            </Caption>
                          </div>
                        </div>

                        {/* Design decision callout */}
                        <ModuleCard variant="dashed" eyebrow="Design decision">
                          <P className="mt-1">
                            Early explorations used tags instead of tiers. Tags felt flexible but created
                            decision paralysis — users didn't know which tags mattered. Fixed tiers with
                            clear definitions removed the ambiguity without removing control.
                          </P>
                        </ModuleCard>
                      </section>

                      {/* ── 4. Outreach wizard ──────────────────────────── */}
                      <section className="space-y-6">
                        <H3>B. Guided outreach wizard — reducing decision fatigue</H3>
                        <P>
                          Cold outreach is paralysing because there are too many open questions at once:
                          who to reach out to, what to say, whether to follow up. The wizard collapses
                          those decisions into a linear, three-step sequence.
                        </P>

                        <Lead>"Cold outreach should feel guided, not overwhelming."</Lead>

                        <List spacing="loose" className="max-w-lg">
                          <ListItem marker="numbered">
                            <div>
                              <span className="font-medium text-foreground">Select contacts</span>
                              <P className="mt-0.5">Filter by tier, role, or last interaction. The system surfaces overdue contacts automatically.</P>
                            </div>
                          </ListItem>
                          <ListItem marker="numbered">
                            <div>
                              <span className="font-medium text-foreground">Choose a template</span>
                              <P className="mt-0.5">Role-relevant templates reduce blank-page anxiety. Templates are tone-matched to tier (warm vs. cold).</P>
                            </div>
                          </ListItem>
                          <ListItem marker="numbered">
                            <div>
                              <span className="font-medium text-foreground">Preview and send</span>
                              <P className="mt-0.5">One-click confirmation with personalisation fields pre-filled. No context-switching to LinkedIn.</P>
                            </div>
                          </ListItem>
                        </List>

                        <div className="flex flex-wrap gap-3">
                          {[
                            { src: "/hirello-outreach-step-1.png", alt: "Outreach wizard step 1 — contact selection" },
                            { src: "/hirello-outreach-step-2.png", alt: "Outreach wizard step 2 — template selection" },
                            { src: "/hirello-outreach-step-3.png", alt: "Outreach wizard step 3 — preview and send" },
                          ].map(({ src, alt }) => (
                            <div
                              key={src}
                              className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden"
                            >
                              <img src={src} alt={alt} className="block h-auto w-36 md:w-44" />
                            </div>
                          ))}
                        </div>
                        <Caption>Three-step wizard — each screen has a single decision to make.</Caption>

                        <ModuleCard variant="dashed" eyebrow="Design decision">
                          <P className="mt-1">
                            Tested a free-form compose view first. Users spent more time editing
                            templates than sending messages. The wizard format shifted the mental model
                            from "writing an email" to "completing a workflow step" — send rates
                            improved noticeably in usability testing.
                          </P>
                        </ModuleCard>
                      </section>

                      {/* ── 5. Pipeline ─────────────────────────────────── */}
                      <section className="space-y-6">
                        <H3>C. Opportunity pipeline — making momentum visible</H3>
                        <P>
                          Networking without a view of overall progress feels chaotic. The pipeline
                          gives users a Kanban-style view of where every lead sits and what should
                          happen next — shifting networking from reactive to repeatable.
                        </P>

                        <div className="rounded-lg border border-slate-200 bg-slate-50/80 overflow-hidden">
                          <img
                            src="/hirello-pipeline.png"
                            alt="Hirello opportunity pipeline Kanban view showing leads across stages"
                            className="block h-auto w-full"
                          />
                          <Caption className="px-4 py-2 border-t border-slate-200">
                            Kanban pipeline — leads move through stages with clear next-action prompts.
                          </Caption>
                        </div>

                        <List spacing="normal">
                          <ListItem marker="bullet">
                            Pipeline stages map to real job-search milestones, not generic CRM stages.
                          </ListItem>
                          <ListItem marker="bullet">
                            Cards show last-contact date and suggested next action — no need to click in.
                          </ListItem>
                          <ListItem marker="bullet">
                            Overdue follow-ups are flagged visually, eliminating the "out of sight, out of mind" problem.
                          </ListItem>
                        </List>
                      </section>

                      {/* ── 6. Outcome ──────────────────────────────────── */}
                      <section className="space-y-4">
                        <SectionLabel>4. Outcome</SectionLabel>
                        <ModuleCardGrid cols={2}>
                          <ModuleCard variant="elevated" eyebrow="Workflow change">
                            <Lead className="mt-1">Structured replaced scattered</Lead>
                            <P className="mt-1">
                              Networking moved from ad-hoc spreadsheets to a repeatable, tier-driven workflow with clear next actions at every stage.
                            </P>
                          </ModuleCard>
                          <ModuleCard variant="elevated" eyebrow="Behavioural shift">
                            <Lead className="mt-1">Reactive → intentional outreach</Lead>
                            <P className="mt-1">
                              The guided wizard reduced decision fatigue and increased outreach consistency — users sent more messages with less friction.
                            </P>
                          </ModuleCard>
                        </ModuleCardGrid>
                        <P>
                          Both modules shipped into live production. Networking Intelligence now forms
                          the foundation of Hirello's career operating system — the data collected here
                          feeds into the platform's broader recommendation and coaching layers.
                        </P>
                      </section>

                      {/* ── 7. What I learned ───────────────────────────── */}
                      <section className="space-y-3">
                        <SectionLabel>5. What this taught me</SectionLabel>
                        <P>
                          CRM design for consumers is fundamentally different from enterprise CRM. Users
                          don't want full control — they want guidance. Every extra configuration option
                          is a decision they have to make under stress. The best design decisions here
                          removed choices, not added them.
                        </P>
                        <Lead>
                          "The job seeker doesn't want a powerful tool. They want the right answer fast."
                        </Lead>
                      </section>

                      {/* ── Navigation ──────────────────────────────────── */}
                      <section className="space-y-4 border-t border-slate-200 pt-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link
                            href="/case-stories/hirello-ai"
                            className="text-xs md:text-sm font-medium inline-flex items-center gap-1.5 rounded-full px-4 py-2 border border-slate-200 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                          >
                            ← Case snapshot
                          </Link>
                          <Link
                            href="/case-stories/hirello-ai/interview"
                            className="text-xs md:text-sm font-medium inline-flex items-center gap-1.5 rounded-full px-4 py-2 border border-transparent bg-foreground text-background hover:bg-background hover:text-foreground hover:border-foreground/40 transition-colors"
                          >
                            Module 02 — AI Interview Gym →
                          </Link>
                        </div>
                        <Link
                          href="/case-stories/hirello-ai/full"
                          className="text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
                        >
                          Read full case study (both modules)
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
