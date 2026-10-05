// ─────────────────────────────────────────────────────────────────────────────
// CASES — the single source for every case study: the Work cards, the modal
// trailer, the deep pages and the stats labels all read from here. Plain
// module (no "use client") so server pages and client cards share it.
// `file` is the stable key: covers, analytics (case_open:<file>) and the modal
// title bar all hang off it, so never rename one that has shipped.
// ─────────────────────────────────────────────────────────────────────────────

export interface CaseMeta {
  slug: string
  file: string
  /** "Name · Subtitle" — cards and the modal split on " · ". */
  title: string
  hook: string
  /** Search/share description, ~150 characters, written for someone who
   *  has never heard of the product. */
  summary: string
  tags: string[]
  role: string
  team: string
  timeline: string
  year: string
  platform: string
  status: string
  /** Chapter-palette index the case wears (cover, page tint). */
  pigment: number
  featured?: boolean
  metrics?: { value: string; label: string }[]
  tools: string[]
  problem: string
  approach: string[]
  outcome: string
  /** Deep page, when the case has one. */
  href?: string
  /** ISO dates for the deep page (structured data + sitemap). */
  published?: string
  updated?: string
}

export const CASES: CaseMeta[] = [
  {
    slug: "hirello-networking",
    file: "hirello_networking.vue",
    title: "Hirello · Networking Hub",
    hook: "A job seeker's contact list, turned into a pipeline of conversations.",
    summary:
      "Case study: how Vishal Deshmukh redesigned and built Hirello's AI networking hub, from LinkedIn import and contact groups to outreach sequences and a confirm-first agent.",
    tags: ["Product Design", "AI & UX", "Design Systems"],
    role: "Founding Product Designer · design + front end",
    team: "PM, AI engineer, 3 backend engineers",
    timeline: "May–Sep 2026",
    year: "2026",
    platform: "Web · Vue 3",
    status: "On staging, rolling out",
    pigment: 4,
    featured: true,
    metrics: [
      { value: "16", label: "Screens designed + built" },
      { value: "17", label: "Agent actions, all confirm-first" },
      { value: "5", label: "Hard send caps" },
    ],
    tools: ["Figma", "HTML prototyping", "Vue 3", "Vuetify", "Claude Code"],
    problem:
      "Networking in Hirello was one page with two buttons and a three-step wizard. Importing meant exporting a LinkedIn CSV and waiting for an email. There was nowhere to organise people, follow up, or see what came back. The PM's top ask: make it simple.",
    approach: [
      "Prototyped the whole module in one HTML file across 58 versions, reviewed with leadership, product and the PM.",
      "Rebuilt it as a hub: import, organise into groups, choose who to reach, send one message or a sequence, then track replies, meetings and the pipeline.",
      "Built the front end myself: 16 screens and 14 shared components, typed to the real API so wiring was a data swap.",
      "Designed the guardrails with the AI team: the agent proposes, the candidate confirms, and sending stays a human tap.",
    ],
    outcome:
      "One hub instead of a dead-end wizard, built on staging and rolling out. Its visual language became the reference: Career GPS was restyled to match it.",
    href: "/case-stories/hirello-networking",
    published: "2026-10-04",
    updated: "2026-10-05",
  },
  {
    slug: "hirello-platform",
    file: "hirello_platform.vue",
    title: "Hirello · Platform & Agents",
    hook: "One front door for nine AI agents.",
    summary:
      "Case study: one front door for nine AI agents. Vishal Deshmukh's dashboard redesign, Toolbox mega-menu and agent tasks popup for Hirello, plus a design-system proposal.",
    tags: ["Product Design", "AI & UX", "Systems"],
    role: "Founding Product Designer · design + full-stack build",
    team: "PM, platform engineer, agent owners",
    timeline: "Nov 2025–Sep 2026",
    year: "2025–26",
    platform: "Web · Vue 3 + Python",
    status: "Shipped to staging",
    pigment: 3,
    metrics: [
      { value: "+18%", label: "Onboarding completion" },
      { value: "−30%", label: "Drop-off" },
      { value: "9", label: "Agents, one Toolbox" },
    ],
    tools: ["Figma", "HTML prototyping", "Maze", "Vue 3", "Python", "Claude Code"],
    problem:
      "Nine AI agents had grown up side by side. The dashboard showed placeholder charts, the Toolbox was a list of eight links, and an empty chat box hid what each agent could do. The PM's number-one priority: one popup that teaches every agent.",
    approach: [
      "Prototyped the dashboard and Toolbox across 58 versions of an HTML prototype before touching the codebase.",
      "Redesigned the dashboard so your network visibly flows into your pipeline, on read-only data with no invented numbers.",
      "Turned the Toolbox into a mega-menu grouped by what you're trying to do, not by feature name.",
      "Designed and built the agent tasks popup end to end: one component, one registry file agent owners edit, no schema change.",
      "Ran 12+ user interviews and A/B tested 6 onboarding variants.",
    ],
    outcome:
      "The winning onboarding variants lifted completion 18% and cut drop-off 30%; feature adoption rose 14%. One popup now teaches 8 agent pages.",
    href: "/case-stories/hirello-platform",
    published: "2026-10-04",
    updated: "2026-10-05",
  },
  {
    slug: "1-second-everyday",
    file: "1se_one_contract.fig",
    title: "1 Second Everyday · One commit contract",
    hook: "Three features, one promise: every path ends the same way.",
    summary:
      "Product design case study for 1 Second Everyday: auditing the Day screen, mashing and Rewind, and redesigning all three around one consistent commit contract.",
    tags: ["Product Design", "Mobile", "Systems Thinking"],
    role: "Product Designer · home task",
    team: "Solo",
    timeline: "Sep 2026",
    year: "2026",
    platform: "iOS",
    status: "Design exercise",
    pigment: 0,
    metrics: [
      { value: "4·6·3", label: "Entry points found" },
      { value: "1", label: "Commit contract" },
      { value: "29", label: "States designed" },
    ],
    tools: ["Figma", "Product audit", "Flow mapping", "Success metrics"],
    problem:
      "1SE asked for three redesigns: the Day screen, mashing, and Rewind. The audit found one pattern under all three: four ways in for the Day screen, six for mashing, three for Rewind, each ending in a different contract.",
    approach: [
      "Audited the shipped app track by track and named the shared failure: many entry points, inconsistent commits.",
      "Day screen: one adaptive Add sheet that changes with the day (today, past, future), camera first.",
      "Mashing: two paths instead of six, a full-bleed player, and an Adjust sheet that tags Pro instead of locking mid-strip.",
      "Rewind: opens on the moment, feeling first, with one verb: Keep.",
      "Designed every state and edge case, with success metrics and a Pro-conversion guardrail.",
    ],
    outcome:
      "A single commit contract shared by capture, mashing and Rewind, so the mental model holds everywhere. 29 states designed across three tracks.",
    href: "/case-stories/1-second-everyday",
    published: "2026-10-04",
    updated: "2026-10-05",
  },
  {
    slug: "ai-policy-by-design",
    file: "ai_policy_by_design.fig",
    title: "AI Policy by Design · UMBC HCC Research",
    hook: "Designing AI policy into the interface itself.",
    summary:
      "UMBC HCC research by Vishal Deshmukh: participatory design with 11 graduate students that built 12 AI policies directly into an AI tool's interface.",
    tags: ["UX Research", "AI & UX"],
    role: "Product Designer",
    team: "HCC research group",
    timeline: "2025",
    year: "2025",
    platform: "Research",
    status: "Published in coursework",
    pigment: 3,
    tools: ["Figma", "Surveys", "Interviews", "Contextual observation"],
    problem:
      "AI policies usually live in documents, not in the tools students use while they work. The research question: what if the interface itself carried those policies?",
    approach: [
      "Led participatory design research with 11 graduate students.",
      "Mixed methods (surveys, user interviews, and contextual observation) to surface AI usage patterns and needs.",
      "Synthesized findings into 12 co-designed AI policies and actionable design decisions.",
      "Redesigned an AI tool interface in Figma from first principles, embedding all 12 policies into the UX.",
    ],
    outcome:
      "A redesigned AI tool interface with 12 co-designed policies built into the experience. A working demonstration of how interaction design decisions can operationalize institutional values.",
  },
]

export const shortTitle = (t: string) => t.split(" · ")[0]

export const caseBySlug = (slug: string) => CASES.find((c) => c.slug === slug)

/** The reading order of the deep pages, for prev/next links. */
export const DEEP_CASES = CASES.filter((c) => c.href)

/** Case-file → readable name, for the stats dashboard. Retired cases keep
 *  their labels so clicks recorded before they were removed still read well. */
export const CASE_NAMES: Record<string, string> = {
  ...Object.fromEntries(CASES.map((c) => [c.file, c.title.replace(" · ", ": ")])),
  "hirello_ai.tsx": "Hirello.ai (retired card)",
  "reddit_redesign.tsx": "Reddit Redesign (retired)",
  "job_dashboard.tsx": "AI Job Market Dashboard (retired)",
}
