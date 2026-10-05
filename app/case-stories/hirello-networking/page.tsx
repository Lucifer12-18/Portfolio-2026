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
  KeyTable,
  ProcessStrip,
  Scene,
  ScreenFrame,
  Stage,
  ThirtySecondRead,
} from "@/components/case/blocks"
import { BeforeAfter, ChatDemo, Reveal, ScaleToFit } from "@/components/case/kit"
import { ShotOr } from "@/components/case/shot"
import {
  BuildOutreach,
  HubDashboard,
  ImportSources,
  OrganizeGroups,
  PipelineBoard,
  RepliesInbox,
  SequenceEditor,
  TargetCompanies,
  TiersV1,
} from "@/components/case/hirello/networking"
import { Avatar, Bar, Btn, H, Pill, Steps } from "@/components/case/hirello/ui"

const meta = caseBySlug("hirello-networking")!

// Title, canonical, share text; the image comes from ./opengraph-image.tsx.
export const metadata: Metadata = caseMetadata(meta)

const SCENES = [
  { id: "before", label: "Before" },
  { id: "process", label: "Process" },
  { id: "import", label: "Import" },
  { id: "organize", label: "Organize" },
  { id: "outreach", label: "Outreach" },
  { id: "sequences", label: "Sequences" },
  { id: "tracking", label: "Tracking" },
  { id: "agent", label: "The agent" },
  { id: "caps", label: "Send caps" },
  { id: "system", label: "Design system" },
  { id: "outcome", label: "Outcome" },
]

const P = "case/hirello-networking"

/** A v1 screenshot, letterboxed onto white inside a before/after frame. */
function V1({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute inset-0 bg-white">
      <Image src={src} alt={alt} fill sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover object-top" />
    </div>
  )
}

export default function NetworkingCase() {
  return (
    <CaseShell meta={meta} scenes={SCENES}>
      <CaseHero
        kicker="Case 01 · Hirello.ai · Networking"
        dim="A contact list,"
        accent="turned into conversations."
        hook="I redesigned and built Hirello's networking module: from a two-button page and a dead-end wizard to a hub where job seekers import their network, sort it, reach out in gentle sequences and watch every reply land in one pipeline."
        meta={[
          { k: "Role", v: meta.role },
          { k: "Team", v: meta.team },
          { k: "Timeline", v: meta.timeline },
          { k: "Platform", v: meta.platform },
          { k: "Status", v: meta.status },
        ]}
        visual={
          <Stage shot="SH 01 · networking hub" pad="p-4 md:p-10">
            <ScreenFrame url="app.hirello.ai/networking-hub">
              <ShotOr src={`${P}/hub.png`} alt="Networking Hub dashboard">
                <HubDashboard />
              </ShotOr>
            </ScreenFrame>
          </Stage>
        }
      />

      <ThirtySecondRead
        bullets={[
          "Rebuilt networking as a hub: import, organise, reach out, track. Every screen leads somewhere instead of ending.",
          "Designed it, then built it: an HTML prototype across 58 versions, Figma for the hard parts, then 16 screens and 14 shared components in Vue.",
          "Made the AI safe to trust: the agent proposes with real numbers, the candidate confirms, and outreach only leaves when they press Send.",
        ]}
        stats={[
          { value: "16", label: "Screens designed + built" },
          { value: "14", label: "Shared components" },
          { value: "17", label: "Agent actions, all confirm-first" },
          { value: "5", label: "Hard send caps" },
        ]}
      />

      <Contents scenes={SCENES} />

      <Scene
        id="before"
        n={1}
        label="Before"
        title={
          <>
            <span className="ink-dim">Two buttons and</span> a wizard that ended.
          </>
        }
        caption="The old module was one page, “Your Network is Your Net Worth”, with two cards and a three-step campaign wizard. Importing meant requesting a LinkedIn export and waiting for the email. Nothing tracked what happened after Send."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["/hirello-outreach-step-2.png", "v1 · the three-step campaign wizard"],
            ["/hirello-contacts.png", "v1 · contacts added one form at a time"],
          ].map(([src, cap]) => (
            <Reveal key={src}>
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-hair bg-white">
                  <Image src={src} alt={cap} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover object-top" />
                </div>
                <figcaption className="mt-2.5 font-mono text-[10.5px] text-bone-3">{cap}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Findings
          cols={4}
          items={[
            "No way to organise people. Everyone sat in one long list.",
            "One message at a time: no follow-ups, no sequences.",
            "Replies, meetings and target companies lived nowhere.",
            "The PM's ask, one of five priorities: simplify the Networking Wizard.",
          ]}
        />
      </Scene>

      <Scene
        id="process"
        n={2}
        label="Process"
        title={
          <>
            <span className="ink-dim">Prototype first,</span> then Figma, then code.
          </>
        }
        caption="I worked in the medium closest to the product: a single-file HTML prototype the team could click, reviewed with leadership, product and the PM until the flow held. Figma took over where layout needed precision; then I built it."
      >
        <ProcessStrip
          steps={[
            { k: "August", title: "HTML prototype", note: "58 versions. 10 screens grew into 16 sections." },
            { k: "Reviews", title: "Leadership, product, PM", note: "One question per screen: what's the next step?" },
            { k: "Figma", title: "Organize, refined", note: "Drag-to-group, AI suggestions, two views." },
            { k: "Aug 30", title: "Front end, built", note: "31 files, +13.9k lines, typed to the real API." },
            { k: "September", title: "Wired + adopted", note: "Backend connected. Career GPS restyled to match." },
          ]}
        />
      </Scene>

      <Scene
        id="import"
        n={3}
        label="Import"
        title={
          <>
            <span className="ink-dim">LinkedIn first.</span> The CSV stays, quietly.
          </>
        }
        caption="Reading the connected account removes the export-and-wait step. LinkedIn shares no email addresses, though, and outreach needs them, so Google and the CSV stay as the second route: one quiet link."
      >
        <Stage shot="SH 03 · import" pad="p-4 md:p-10">
          <ScreenFrame url="app.hirello.ai/networking-wizard/import">
            <ShotOr src={`${P}/import.png`} alt="Import your network">
              <ImportSources />
            </ShotOr>
          </ScreenFrame>
        </Stage>
        <Decisions
          items={[
            { decision: "One LinkedIn connection, shared by four modules.", why: "Onboarding, Career GPS, LinkedIn Labs and Networking read the same connection, so people connect once." },
            { decision: "Three equal sources. The button appears on hover.", why: "No source wins visually until you show intent. Calm by default, direct on approach." },
            { decision: "Nobody to send to? Go to Import.", why: "Starting a campaign with zero eligible contacts used to dead-end. Now it says “Import first” and takes you there." },
          ]}
        />
      </Scene>

      <Scene
        id="organize"
        n={4}
        label="Organize"
        title={
          <>
            <span className="ink-dim">Tiers became</span> groups you can drag.
          </>
        }
        caption="v1 asked for a form per contact and a tier for each. v2 seeds eight relationship groups, lets you drag people onto them, and has Hiro suggest the rest. You accept or reject; nothing moves on its own."
      >
        <BeforeAfter
          beforeLabel="v1 · four tiers (re-drawn)"
          afterLabel="v2 · drag to group"
          before={
            <ScaleToFit width={1280} height={800}>
              <TiersV1 />
            </ScaleToFit>
          }
          after={
            <ScaleToFit width={1280} height={800}>
              <ShotOr src={`${P}/organize.png`} alt="Organize your network">
                <OrganizeGroups />
              </ShotOr>
            </ScaleToFit>
          }
        />
        <Decisions
          cols={2}
          items={[
            { decision: "Groups are relationships, not scores.", why: "“Alumni” and “Previous bosses” tell you how to write the message. A tier only said how much someone mattered." },
            { decision: "AI suggests. People decide.", why: "47 contacts sorted in one tap, but only after you see the proposal. Accept all, or review first." },
          ]}
        />
      </Scene>

      <Scene
        id="outreach"
        n={5}
        label="Outreach"
        title={
          <>
            <span className="ink-dim">One message,</span> or a gentle sequence.
          </>
        }
        caption="LeadGen only shows people you can actually reach: they have an email and aren't already in your pipeline. Then pick a mode. Templates are filtered by group, so an alumni note never reaches a hiring manager."
      >
        <BeforeAfter
          beforeLabel="v1 · campaign wizard"
          afterLabel="v2 · build outreach"
          before={<V1 src="/hirello-outreach-step-2.png" alt="v1 outreach wizard" />}
          after={
            <ScaleToFit width={1280} height={800}>
              <ShotOr src={`${P}/build-outreach.png`} alt="Build your outreach">
                <BuildOutreach />
              </ShotOr>
            </ScaleToFit>
          }
        />
        <Decisions
          items={[
            { decision: "Templates carry the groups they're for.", why: "My rule from review: an alumni template should never sit in front of a hiring manager. The filter makes the mistake impossible." },
            { decision: "Missing variables block Send.", why: "“Hi {{first_name}}” costs a relationship. The preview fills every token, per recipient, before anything can go." },
            { decision: "Phone and text are shown, not sendable.", why: "Honest about the channels that exist today, without hiding where the product is going." },
          ]}
        />
      </Scene>

      <Scene
        id="sequences"
        n={6}
        label="Sequences"
        title={
          <>
            <span className="ink-dim">Editing a live campaign</span> pauses it.
          </>
        }
        caption="Steps follow LinkedIn's real limits: 300 characters for a connection note, 1,900 for InMail. Change a step mid-flight and the campaign pauses until you resume. Steps already sent are locked."
      >
        <Stage shot="SH 06 · sequence editor" pad="p-4 md:p-10">
          <ScreenFrame url="app.hirello.ai/networking-wizard/sequence-editor">
            <ShotOr src={`${P}/sequence-editor.png`} alt="Sequence editor">
              <SequenceEditor />
            </ShotOr>
          </ScreenFrame>
        </Stage>
      </Scene>

      <Scene
        id="tracking"
        n={7}
        label="Tracking"
        title={
          <>
            <span className="ink-dim">Everything after Send,</span> in one place.
          </>
        }
        caption="The hub's four numbers open onto the follow-through: replies with suggested answers in your tone, target companies scored by how warm your paths in are, and a pipeline from LeadGen to Interview."
      >
        <Reveal>
          <ScreenFrame url="app.hirello.ai/networking-wizard/replies">
            <ShotOr src={`${P}/replies.png`} alt="Replies to act on">
              <RepliesInbox />
            </ShotOr>
          </ScreenFrame>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <ScreenFrame url="app.hirello.ai/networking-wizard/pipeline" height={540}>
              <ShotOr src={`${P}/pipeline.png`} alt="Opportunity pipeline" height={540}>
                <PipelineBoard />
              </ShotOr>
            </ScreenFrame>
          </Reveal>
          <Reveal delay={0.08}>
            <ScreenFrame url="app.hirello.ai/networking-wizard/target-companies" height={540}>
              <TargetCompanies />
            </ScreenFrame>
          </Reveal>
        </div>
      </Scene>

      <Scene
        id="agent"
        n={8}
        label="The agent"
        title={
          <>
            <span className="ink-dim">Hiro proposes.</span> You confirm.
          </>
        }
        caption="The Networking agent can sort contacts, manage groups and templates, scan replies and draft campaigns: 17 actions. Each is proposed with the real numbers first and runs only after an explicit yes. It never sends outreach itself."
      >
        <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Reveal>
            <ChatDemo
              lines={[
                { from: "user", text: "Can you sort my unsorted contacts?" },
                {
                  from: "agent",
                  text: "I can sort 47 contacts into 6 groups: 18 Alumni, 11 Previous coworkers, 7 Recruiters and 11 more. Go ahead?",
                  actions: ["Yes, sort them", "Not now"],
                },
                { from: "user", text: "Yes" },
                { from: "system", text: "Sorted 47 contacts into 6 groups" },
                { from: "user", text: "Now email the alumni" },
                {
                  from: "agent",
                  text: "I'll draft a campaign for 34 alumni with the coffee-chat template. You'll review every message and press Send yourself.",
                  actions: ["Draft campaign", "Change template"],
                },
              ]}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="divide-y divide-hair border-y border-hair">
              {[
                ["Propose, then confirm", "An offer waits for a yes. Change the subject and it's dropped."],
                ["Real numbers first", "“Sort 47 contacts into 6 groups”, never a blank cheque."],
                ["One question at a time", "Missing a group name? It asks, then asks the next."],
                ["Destructive means confirm", "Deletes always confirm. Slow actions warn first (15–25s)."],
                ["Never sends", "Outreach leaves only when the candidate presses Send."],
                ["No model picks the action", "Routing is deterministic. The model writes; it doesn't decide."],
              ].map(([k, v]) => (
                <li key={k} className="py-3.5">
                  <p className="text-[15px] tracking-[-0.01em] text-bone">{k}</p>
                  <p className="mt-0.5 text-[13.5px] leading-[1.5] text-bone-3">{v}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[10.5px] leading-[1.6] text-bone-4">
              Agent logic built by our AI engineer on top of the hub&apos;s actions. 13 intents · 17 actions · 7 instant reads · ~293 tests.
            </p>
          </Reveal>
        </div>
      </Scene>

      <Scene
        id="caps"
        n={9}
        label="Send caps"
        title={
          <>
            <span className="ink-dim">Hard caps,</span> counted the way LinkedIn counts.
          </>
        }
        caption="Automated outreach is a terms-of-service risk, so limits live on the server, per calendar day, in one shared ledger. Invitations are capped weekly too: a daily cap alone would allow about 350 a week."
      >
        <KeyTable
          head={["Channel", "Cap", "Counted"]}
          rows={[
            ["Email", "50 / day", "Per calendar day; shown on the hub as today's Gmail quota"],
            ["LinkedIn message", "50 / day", "Per calendar day"],
            ["Connection invitation", "20 / day · 100 / week", "Daily and weekly, the way LinkedIn counts"],
            ["InMail", "10 / day", "Per calendar day"],
            ["Comment", "20 / day", "Per calendar day"],
          ]}
        />
      </Scene>

      <Scene
        id="system"
        n={10}
        label="Design system"
        title={
          <>
            <span className="ink-dim">A language</span> other modules borrowed.
          </>
        }
        caption="Fraunces for headings and every number, Inter for the rest, one blue-to-violet gradient for the single next step on each screen, and stage colours that mean the same thing everywhere. Career GPS was later restyled with these exact parts."
      >
        <DesignSystemBoard
          name="Hirello · Networking Hub language"
          surface={H.bg}
          ink={H.ink}
          colors={[
            { name: "Primary", hex: "#3B5BFF", role: "Primary action, links, focus" },
            { name: "Primary soft", hex: "#EBEFFF", role: "Selected rows, tinted chips" },
            { name: "Ink", hex: "#171826", role: "Headings and body" },
            { name: "Muted", hex: "#6B6F85", role: "Secondary text" },
            { name: "Faint", hex: "#9A9EB2", role: "Labels, placeholders" },
            { name: "Border", hex: "#E9EAF1", role: "Hairlines, card edges" },
            { name: "LeadGen", hex: "#8B5CF6", role: "Stage 1 · messaged" },
            { name: "Cold", hex: "#3B82F6", role: "Stage 2 · no reply yet" },
            { name: "Engaged", hex: "#E5A02E", role: "Stage 3 · talking" },
            { name: "Interview", hex: "#10A37F", role: "Stage 4 · success states" },
            { name: "Error", hex: "#DC5B4A", role: "Weak paths, failures" },
          ]}
          gradients={[{ name: "Next step", css: H.grad, use: "One per screen: the action you came for" }]}
          type={[
            { family: "Fraunces", cssVar: "--font-fraunces", role: "Headings + numbers", sample: "412 contacts", weight: 400, specs: "Display 40/44 · Title 30/33 · Stat 32–44 · 400–500" },
            { family: "Inter", cssVar: "--font-inter", role: "Interface", sample: "Start campaign", weight: 500, specs: "Body 14/21 · Small 12.5 · Label 11 caps +0.07em · 400–600" },
          ]}
          shape={[
            { label: "Input", value: "12px", radius: 12 },
            { label: "Card", value: "14px", radius: 14 },
            { label: "Hero", value: "18px", radius: 18 },
            { label: "Dialog", value: "28px", radius: 28 },
            { label: "Pill", value: "999px", radius: 999 },
          ]}
          motion={[
            { name: "nh-rise", spec: "fade-up 12px · 520ms · cubic-bezier(.32,.72,0,1) · 60ms stagger" },
            { name: "Step pills", spec: "active pill slides between steps · 300ms" },
            { name: "Hover lift", spec: "−4px · soft primary shadow · on source tiles" },
            { name: "Reduced", spec: "prefers-reduced-motion turns all of it off" },
          ]}
          components={
            <div className="flex flex-wrap items-center gap-4" style={{ fontFamily: "var(--font-inter)" }}>
              <Steps at={1} />
              <Btn>+ Start campaign</Btn>
              <Btn kind="ghost">Add sources</Btn>
              <Btn kind="soft">Review</Btn>
              <span className="flex gap-1.5">
                <Pill color={H.stage.lead}>● LeadGen</Pill>
                <Pill color={H.stage.cold}>● Cold</Pill>
                <Pill color={H.stage.engaged}>● Engaged</Pill>
                <Pill color={H.stage.interview}>● Interview</Pill>
              </span>
              <span className="flex items-center gap-3 rounded-[12px] border bg-white px-3.5 py-2.5" style={{ borderColor: H.border }}>
                <Avatar name="Priya Nair" size={34} />
                <span>
                  <span className="block text-[13.5px] font-medium" style={{ color: H.ink }}>
                    Priya Nair
                  </span>
                  <span className="block text-[12px]" style={{ color: H.muted }}>
                    Design Lead · Stripe
                  </span>
                </span>
              </span>
              <span className="w-[200px]">
                <Bar value={0.45} color={H.stage.interview} />
              </span>
            </div>
          }
        />
      </Scene>

      <Scene
        id="outcome"
        n={11}
        label="Outcome"
        title={
          <>
            <span className="ink-dim">What shipped,</span> and what I&apos;d measure next.
          </>
        }
        caption="The hub is built on staging and rolling out, with import, dashboard, organize, LeadGen and outreach wired to the API. No usage numbers yet, so these are the ones I'll watch."
      >
        <Columns
          cols={[
            {
              title: "Shipped",
              tone: "accent",
              items: ["16 screens, 14 shared components", "22 routes in the module", "API wiring for import, organize, LeadGen and outreach", "Career GPS restyled in the hub's language"],
            },
            {
              title: "I'd measure",
              items: ["Reply rate by campaign type", "Time from import to first send", "Share of sends that come from sequences", "How often people accept Hiro's sorting"],
            },
            {
              title: "What I learned",
              tone: "dim",
              items: [
                "Sequences add power and weight. The PM's “advanced tab” is the right next step.",
                "Designing in code made handoff a data swap: placeholders typed to the real API.",
                "Guardrails are UX. People trust an agent that can't surprise them.",
              ],
            },
          ]}
        />
        <Credits
          rows={[
            { who: "Me", what: "Product design end to end (prototype, Figma, every screen) and the front-end build in Vue.", me: true },
            { who: "Product manager", what: "Priorities, reviews, and the idea to move advanced sequencing to its own tab." },
            { who: "AI engineer", what: "The Networking agent: intents, actions, the confirm flow." },
            { who: "Backend engineers", what: "API wiring, the LinkedIn integration, send caps and pacing." },
            { who: "Platform engineer", what: "Restyled Career GPS in the hub's visual language." },
          ]}
        />
      </Scene>
    </CaseShell>
  )
}
