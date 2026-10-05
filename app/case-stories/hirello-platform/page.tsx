import type { Metadata } from "next"
import Image from "next/image"
import { caseBySlug } from "@/lib/cases"
import { caseMetadata } from "@/lib/seo"
import {
  CaseHero,
  CaseShell,
  Contents,
  Columns,
  Credits,
  Decisions,
  DesignSystemBoard,
  Findings,
  Insight,
  ProcessStrip,
  Scene,
  ScreenFrame,
  Stage,
  ThirtySecondRead,
} from "@/components/case/blocks"
import { BeforeAfter, Reveal, ScaleToFit } from "@/components/case/kit"
import { ShotOr } from "@/components/case/shot"
import { AgentChips, AgentTasksPopup, DashboardRow, PipelineBubble, ToolboxMegaMenu, ToolboxV1, YourNetworkCard } from "@/components/case/hirello/platform"
import { Btn, H, Pill } from "@/components/case/hirello/ui"

const meta = caseBySlug("hirello-platform")!

// Title, canonical, share text; the image comes from ./opengraph-image.tsx.
export const metadata: Metadata = caseMetadata(meta)

const SCENES = [
  { id: "before", label: "Before" },
  { id: "process", label: "Process" },
  { id: "dashboard", label: "Dashboard" },
  { id: "toolbox", label: "Toolbox" },
  { id: "popup", label: "Tasks popup" },
  { id: "interview-gym", label: "Interview Gym" },
  { id: "onboarding", label: "Onboarding" },
  { id: "team", label: "The team" },
  { id: "system", label: "Design system" },
  { id: "outcome", label: "Outcome" },
]

const P = "case/hirello-platform"

export default function PlatformCase() {
  return (
    <CaseShell meta={meta} scenes={SCENES}>
      <CaseHero
        kicker="Case 02 · Hirello.ai · Platform"
        dim="Nine AI agents,"
        accent="one front door."
        hook="Hirello had grown nine capable agents and no map between them. I redesigned the layer that ties them together: a dashboard where your network visibly feeds your pipeline, a Toolbox grouped by intent, and one popup that teaches every agent, designed and built end to end."
        meta={[
          { k: "Role", v: meta.role },
          { k: "Team", v: meta.team },
          { k: "Timeline", v: meta.timeline },
          { k: "Platform", v: meta.platform },
          { k: "Status", v: meta.status },
        ]}
        visual={
          <Stage shot="SH 01 · dashboard" pad="p-4 md:p-10">
            <ScreenFrame url="app.hirello.ai/ai-dashboard">
              <ShotOr src={`${P}/dashboard.png`} alt="Hirello dashboard">
                <DashboardRow />
              </ShotOr>
            </ScreenFrame>
          </Stage>
        }
      />

      <ThirtySecondRead
        bullets={[
          "Prototyped the platform layer across 58 versions of an HTML prototype, then built it in Vue and Python.",
          "Made the dashboard tell one story: your network flows into your pipeline, on read-only data, with no invented numbers.",
          "Shipped the PM's top priority: one agent-tasks popup on 8 agent pages, driven by a single registry file.",
        ]}
        stats={[
          { value: "9", label: "Agents behind one Toolbox" },
          { value: "58", label: "Prototype versions" },
          { value: "8", label: "Agent pages, one popup" },
          { value: "+18%", label: "Onboarding completion (A/B)" },
        ]}
      />

      <Contents scenes={SCENES} />

      <Scene
        id="before"
        n={1}
        label="Before"
        title={
          <>
            <span className="ink-dim">Nine agents,</span> no map between them.
          </>
        }
        caption="Each agent was good on its own: Interview Gym, LinkedIn Labs, Resume Optimizer, Career GPS and five more. Together they had no front door, and the screens that should have connected them didn't."
      >
        <Findings
          cols={4}
          items={[
            "The dashboard's pipeline was three grey columns, two names each.",
            "An activity chart ran on hard-coded data.",
            "The Toolbox was a 300px list of eight links.",
            "An empty chat box hid what each agent could do.",
          ]}
        />
        <Insight by="From the 21 September team meeting">The PM ranked five priorities. First: one popup component across every agent.</Insight>
      </Scene>

      <Scene
        id="process"
        n={2}
        label="Process"
        title={
          <>
            <span className="ink-dim">58 versions</span> before production code.
          </>
        }
        caption="The prototype was the design file: a single HTML page the team could click through, iterated daily. Rules came out of it that the build then kept, like “networking is not a parallel system: contacts flow into the pipeline.”"
      >
        <ProcessStrip
          steps={[
            { k: "Aug 9", title: "Prototype v1", note: "Dashboard, Toolbox and the networking flows in one file." },
            { k: "Aug 29", title: "v58", note: "The Network card, the pipeline bubble, the mega-menu." },
            { k: "Sep 2", title: "Popup prototype", note: "Brought to the team with a Figma file." },
            { k: "Sep 21", title: "Priority #1", note: "The PM ranks the popup first of five." },
            { k: "Sep 27", title: "Built + committed", note: "Front end in Vue, the tasks API in Python." },
          ]}
        />
      </Scene>

      <Scene
        id="dashboard"
        n={3}
        label="Dashboard"
        title={
          <>
            <span className="ink-dim">Your network</span> flows into your pipeline.
          </>
        }
        caption="The new row reads left to right: your network, an animated connector, then four stages, each with a live count, a one-line status and a volume bar. Leadgen is new: people you've messaged who aren't interviewing yet."
      >
        <BeforeAfter
          beforeLabel="v1 · three columns"
          afterLabel="v2 · network → pipeline"
          before={
            <div className="absolute inset-0 bg-white">
              <Image src="/hirello-pipeline.png" alt="v1 opportunity pipeline" fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover object-top" />
            </div>
          }
          after={
            <ScaleToFit width={1280} height={800}>
              <DashboardRow />
            </ScaleToFit>
          }
        />
        <Decisions
          items={[
            { decision: "Read-only data, or nothing.", why: "Three endpoints had side effects: one wrote a “visited” flag, one created default groups. The cards read one read-only call instead." },
            { decision: "No invented numbers.", why: "I removed a “65% → 86%” chance claim from the design because the chart behind it was still placeholder data." },
            { decision: "Motion that explains, then rests.", why: "Counts tick up in 0.7s, the replied dot pulses, connector dots flow. All of it stops for reduced motion and background tabs." },
          ]}
        />
      </Scene>

      <Scene
        id="toolbox"
        n={4}
        label="Toolbox"
        title={
          <>
            <span className="ink-dim">Grouped by intent,</span> not by feature.
          </>
        }
        caption="A plain list of eight links became a mega-menu in three jobs-to-be-done columns, with coloured tiles and one-line descriptions. If you're not sure, the footer hands you to Hiro."
      >
        <BeforeAfter
          ratio="1280 / 640"
          beforeLabel="v1 · list of links"
          afterLabel="v2 · mega-menu"
          before={
            <ScaleToFit width={1280} height={640}>
              <ToolboxV1 />
            </ScaleToFit>
          }
          after={
            <ScaleToFit width={1280} height={640}>
              <ShotOr src={`${P}/toolbox.png`} alt="Toolbox mega-menu" height={640}>
                <ToolboxMegaMenu />
              </ShotOr>
            </ScaleToFit>
          }
        />
        <Decisions
          cols={2}
          items={[
            { decision: "Three questions, not nine names.", why: "Grow your network, sharpen your application, prepare and navigate. People arrive with a goal, not a product name." },
            { decision: "Tools live only in the Toolbox.", why: "A second toolbox on the dashboard competed with it. One home per thing keeps the map honest." },
          ]}
        />
      </Scene>

      <Scene
        id="popup"
        n={5}
        label="Tasks popup"
        title={
          <>
            <span className="ink-dim">One popup</span> that teaches every agent.
          </>
        }
        caption="The dialog knows which agent you're on, titles itself from the data (“3 steps unlock your Interview Gym”), and ticks off setup steps the moment the real data exists. I designed it and built both ends."
      >
        <Stage shot="SH 05 · agent tasks" pad="p-4 md:p-10">
          <ScreenFrame url="app.hirello.ai/interview-gym">
            <ShotOr src={`${P}/agent-tasks.png`} alt="Agent tasks popup">
              <AgentTasksPopup />
            </ShotOr>
          </ScreenFrame>
        </Stage>
        <Decisions
          items={[
            { decision: "One component, one registry file.", why: "Agent owners add steps by editing one Python file. No schema change: manual completions reuse an existing list." },
            { decision: "It opens only when there's something to do.", why: "Dismiss it and it stays closed for the session. Finished setup steps disappear on their own." },
            { decision: "Courses bring you back.", why: "Opening a course passes a return link, so finishing it lands you on the agent you came from." },
          ]}
        />
        <p className="font-mono text-[11px] text-bone-3">8 agent pages · 32 courses (15 for interviews) · 9 backend tests · switched on with one line per page</p>
      </Scene>

      <Scene
        id="interview-gym"
        n={6}
        label="Interview Gym"
        title={
          <>
            <span className="ink-dim">Feedback you can</span> act on first.
          </>
        }
        caption="Earlier Hirello work. A mock interview used to end in one score. The analysis now leads with the answer that needs fixing, in red, with a single “Improve answer” action, then four plain metrics and a learning loop before the retry."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["/hirello-interview-summary.png", "Analysis · fix-first ordering", "aspect-[4/5]"],
            ["/hirello-what-went-wrong.png", "What went wrong · why it matters · how to fix", "aspect-[4/5]"],
            ["/hirello-interview-landing.png", "The gym · pick a session", "aspect-[16/10]"],
            ["/hirello-interview-live.png", "Live session with Hiro", "aspect-[16/10]"],
          ].map(([src, cap, ratio]) => (
            <Reveal key={src}>
              <figure>
                <div className={`relative ${ratio} overflow-hidden rounded-[14px] border border-hair bg-white`}>
                  <Image src={src} alt={cap} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover object-top" />
                </div>
                <figcaption className="mt-2.5 font-mono text-[10.5px] text-bone-3">{cap}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Decisions
          cols={2}
          items={[
            { decision: "The weakest answer leads.", why: "“Fix red answers first” is the fastest way up. A ranked list beats an average." },
            { decision: "Learn before you retry.", why: "Diagnosis, then a short lesson, then the retry, with the last attempt beside it." },
          ]}
        />
      </Scene>

      <Scene
        id="onboarding"
        n={7}
        label="Onboarding"
        title={
          <>
            <span className="ink-dim">Six onboarding variants,</span> tested.
          </>
        }
        caption="Before the agent layer matters, people have to get through the door. I ran 12+ user interviews and A/B tested six onboarding variants; research-driven changes then lifted feature adoption."
      >
        <Reveal>
          <dl className="grid gap-px overflow-hidden rounded-[18px] border border-hair bg-hair sm:grid-cols-3">
            {[
              ["+18%", "Onboarding completion", "winning variants vs control"],
              ["−30%", "Drop-off", "across the onboarding flow"],
              ["+14%", "Feature adoption", "after research-driven changes"],
            ].map(([v, k, n]) => (
              <div key={k} className="bg-ink-0 p-6 md:p-8">
                <dd className="text-[clamp(2.75rem,6vw,4.5rem)] leading-none tracking-[-0.05em] text-chapter tabular-nums">{v}</dd>
                <dt className="mt-3 text-[15px] text-bone">{k}</dt>
                <p className="mt-1 font-mono text-[10.5px] text-bone-3">{n}</p>
              </div>
            ))}
          </dl>
        </Reveal>
      </Scene>

      <Scene
        id="team"
        n={8}
        label="The team"
        title={
          <>
            <span className="ink-dim">The platform</span> around my work.
          </>
        }
        caption="Shipped by teammates in the same weeks, shown for context, not claimed. Good platform design is a team sport; these are the pieces my work plugged into."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { who: "Platform engineer", what: "A profile-gate popup replaced an 8-screen onboarding wizard: source, confirm, ready." },
            { who: "Engineer + content lead", what: "Prompt chips on every agent: 11 dashboard and 57 in-agent prompts, each checked against routing.", chips: true },
            { who: "Platform engineer", what: "Routing: 40 of 91 real phrasings reached the right agent. After: 51 of 51, no misroutes." },
            { who: "Engineer", what: "Chat replies settle in 1.68s instead of 9.9s, and greetings no longer talk over you." },
          ].map((t, i) => (
            <Reveal key={t.what} delay={(i % 2) * 0.06}>
              <div className="h-full rounded-[16px] border border-hair-2 p-5">
                <span className="font-mono text-[10.5px] text-bone-3">{t.who}</span>
                <p className="mt-2 text-[15px] leading-[1.45] tracking-[-0.01em] text-bone-2">{t.what}</p>
                {t.chips && (
                  <div className="mt-4 overflow-hidden rounded-[12px] border border-hair">
                    <ScaleToFit width={760} height={180}>
                      <AgentChips />
                    </ScaleToFit>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Scene>

      <Scene
        id="system"
        n={9}
        label="Design system"
        title={
          <>
            <span className="ink-dim">A proposal:</span> one system for every module.
          </>
        }
        caption="The platform engineer asked for a shared design system. The audit says why: four gradients, two serifs and two sets of pipeline colours in one codebase. This is the token set I proposed to collapse them into."
      >
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-[18px] border border-hair bg-hair md:grid-cols-3">
            {[
              {
                k: "Gradients",
                from: ["linear-gradient(120deg,#3B5BFF,#7C5CFF)", "linear-gradient(120deg,#3D5AFE,#6A7DFF)", "linear-gradient(120deg,#459AFF,#6054FF)", "linear-gradient(120deg,#7C3AED,#C026D3,#EC4899)"],
                to: "4 → 2",
                note: "One action gradient, one learning accent.",
              },
              {
                k: "Serifs",
                from: ["Fraunces", "DM Serif → Georgia"],
                to: "2 → 1",
                note: "Dashboard numbers asked for a font that never loaded.",
              },
              {
                k: "Pipeline colours",
                from: ["#8B5CF6", "#3B82F6", "#E5A02E", "#10A37F", "#1F6BEF", "#F59E0B", "#22C55E"],
                to: "2 sets → 1",
                note: "Stages mean the same colour on every screen.",
              },
            ].map((a) => (
              <div key={a.k} className="bg-ink-0 p-6">
                <div className="flex items-baseline justify-between">
                  <span className="label-mono">{a.k}</span>
                  <span className="font-mono text-[12px] text-chapter">{a.to}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {a.from.map((f) =>
                    f.startsWith("linear") || f.startsWith("#") ? (
                      <span key={f} className="h-8 w-8 rounded-full border border-hair" style={{ background: f }} />
                    ) : (
                      <span key={f} className="rounded-full border border-hair-2 px-3 py-1 font-mono text-[10.5px] text-bone-2">
                        {f}
                      </span>
                    ),
                  )}
                </div>
                <p className="mt-4 text-[13px] leading-[1.5] text-bone-3">{a.note}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <DesignSystemBoard
          name="Hirello · platform tokens (proposal)"
          surface={H.bg}
          ink={H.ink}
          colors={[
            { name: "Brand blue", hex: "#3B5BFF", role: "Primary action everywhere" },
            { name: "Network indigo", hex: "#3B4CC0", role: "The Network card, dark surfaces" },
            { name: "Ink", hex: "#171826", role: "Text" },
            { name: "Muted", hex: "#6B6F85", role: "Secondary text" },
            { name: "Canvas", hex: "#F8F7FA", role: "App background" },
            { name: "Border", hex: "#E9EAF1", role: "Hairlines" },
            { name: "Leadgen", hex: "#8B5CF6", role: "Pipeline stage 1" },
            { name: "Cold", hex: "#1F6BEF", role: "Pipeline stage 2" },
            { name: "Engaged", hex: "#F59E0B", role: "Pipeline stage 3" },
            { name: "Interview", hex: "#22C55E", role: "Pipeline stage 4" },
          ]}
          gradients={[
            { name: "Action", css: "linear-gradient(120deg,#3B5BFF,#7C5CFF)", use: "Primary buttons, the Goal card" },
            { name: "Learning", css: "linear-gradient(120deg,#7C3AED,#C026D3,#EC4899)", use: "Courses and the tasks popup only" },
          ]}
          type={[
            { family: "Fraunces", cssVar: "--font-fraunces", role: "Numbers + titles", sample: "3 steps", weight: 400, specs: "Replaces DM Serif Display · counts 34–44 · titles 24–30" },
            { family: "Inter", cssVar: "--font-inter", role: "Interface", sample: "Open pipeline", weight: 500, specs: "Body 13–14 · labels 11 caps +0.06–0.08em" },
          ]}
          shape={[
            { label: "Tile", value: "12px", radius: 12 },
            { label: "Card", value: "14px", radius: 14 },
            { label: "Bubble", value: "18px", radius: 18 },
            { label: "Dialog", value: "28px", radius: 28 },
            { label: "Pill", value: "999px", radius: 999 },
          ]}
          motion={[
            { name: "Ease", spec: "cubic-bezier(.32,.72,0,1) for everything" },
            { name: "Count-up", spec: "0.7s on first paint of a number" },
            { name: "Stagger", spec: "90ms between chips and rows" },
            { name: "Live pulse", spec: "1.8s, only on things that are live" },
          ]}
          components={
            <div className="flex flex-wrap items-center gap-5" style={{ fontFamily: "var(--font-inter)" }}>
              <YourNetworkCard />
              <div className="w-[520px] max-w-full">
                <PipelineBubble />
              </div>
              <span className="flex flex-col gap-2">
                <Btn>Open pipeline →</Btn>
                <span className="inline-flex rounded-full px-4 py-[8px] text-[13px] font-semibold text-white" style={{ background: H.accent }}>
                  Start course
                </span>
                <Pill color={H.primary}>9 tools</Pill>
              </span>
            </div>
          }
        />
      </Scene>

      <Scene
        id="outcome"
        n={10}
        label="Outcome"
        title={
          <>
            <span className="ink-dim">What shipped,</span> and what&apos;s next.
          </>
        }
        caption="All three pieces are built and committed on staging, front end and API. The onboarding numbers come from the A/B tests; the rest is waiting on real usage."
      >
        <Columns
          cols={[
            {
              title: "Shipped",
              tone: "accent",
              items: ["Dashboard row: network → pipeline", "Toolbox mega-menu: 9 tools, 3 intents", "Agent tasks popup + API on 8 agent pages", "+18% completion, −30% drop-off from onboarding tests"],
            },
            {
              title: "Next",
              items: ["“Ask Hiro to pick a tool” should send the question, not just open the dashboard", "Ship the token proposal as one shared file", "Load one serif everywhere"],
            },
            {
              title: "What I learned",
              tone: "dim",
              items: [
                "Honesty is a design decision: no number on screen that the data can't back.",
                "One component with a registry beats eight bespoke ones. Agent owners move faster.",
                "Prototype in the real medium and the build inherits the decisions.",
              ],
            },
          ]}
        />
        <Credits
          rows={[
            { who: "Me", what: "Design and build of the dashboard row, Toolbox and agent tasks popup (front end + API); the 58-version prototype; onboarding research and A/B tests.", me: true },
            { who: "Product manager", what: "Priorities; the popup as priority one; chip placement." },
            { who: "Platform engineer", what: "Profile-gate popup, routing coverage, the shared design-system ask." },
            { who: "Engineers + content lead", what: "Prompt chips and their copy, chat speed, Interview Gym fixes." },
          ]}
        />
      </Scene>
    </CaseShell>
  )
}
