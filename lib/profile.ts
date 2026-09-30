// ─────────────────────────────────────────────────────────────────────────────
// PROFILE — the résumé as data. Single source of truth for every place the site
// states a fact about Vishal (hero, origin timeline, the "Now" panel, contact,
// metadata). When the résumé changes, change it HERE — not in section copy.
//
// Source: VISHAL_S_DESHMUKH_UI_UX_Design_Expert.pdf (Sep 2026).
// ─────────────────────────────────────────────────────────────────────────────

export const PROFILE = {
  name: "Vishal Deshmukh",
  title: "Product Designer",
  location: "Baltimore, MD",
  email: "vishald089@gmail.com",
  linkedin: "https://www.linkedin.com/in/vishal-deshmukh-813189210/",
  // Self-hosted so it always matches the site (public/Vishal-Deshmukh-Resume.pdf).
  // To update: replace that PDF — every Résumé button points here.
  resume: "/Vishal-Deshmukh-Resume.pdf",
  summary:
    "Product Designer with 2+ years designing customer-facing AI products end-to-end: interaction and visual design, responsive prototyping, design systems, user research, and evidence-based UX evaluation.",
} as const

export interface Role {
  org: string
  /** Short qualifier shown next to the org (parent company, department…) */
  orgNote?: string
  role: string
  start: string
  end: string
  /** Compact range for dense lists, e.g. "’25–’26" */
  short: string
  blurb: string
  highlights: string[]
  current?: boolean
}

export const EXPERIENCE: Role[] = [
  {
    org: "TasteMakers",
    orgNote: "by Taste Labs",
    role: "Product Designer, Design Systems",
    start: "Sep 2026",
    end: "Present",
    short: "’26–now",
    blurb: "Design consultancy focused on design systems and AI-related design initiatives.",
    highlights: [
      "Contribute design-systems expertise to AI-related product design initiatives: design tokens, component hierarchy, and visual consistency.",
      "Collaborate cross-functionally to uphold design quality and consistency standards across deliverables.",
      "Bring product and design-systems experience from prior AI product work to a consultancy engagement.",
    ],
    current: true,
  },
  {
    org: "Hirello.ai",
    role: "Founding Product Designer",
    start: "Nov 2025",
    end: "Sep 2026",
    short: "’25–’26",
    blurb: "AI-driven career platform for interview preparation and job-search accountability.",
    highlights: [
      "Owned end-to-end product flows: user flows, wireframes, and interactive Figma prototypes for web and mobile.",
      "A/B tested 6 onboarding variations: +18% completion, −30% drop-off.",
      "Customer research with 12+ users; changes lifted feature adoption by 14%.",
      "Built and maintained the Figma component library shared across mobile and web.",
    ],
  },
  {
    org: "UMBC",
    orgNote: "Human-Centered Computing Research",
    role: "Product Designer",
    start: "Mar 2025",
    end: "Jun 2025",
    short: "’25",
    blurb: "Participatory design research on how graduate students use AI tools.",
    highlights: [
      "Led participatory design research with 11 graduate students through surveys, interviews, and contextual observation.",
      "Redesigned an AI tool interface from first principles, embedding 12 co-designed AI policies into the UX.",
    ],
  },
  {
    org: "Wipro",
    role: "Web Development Team Lead",
    start: "Feb 2022",
    end: "Jan 2023",
    short: "’22–’23",
    blurb: "Global IT services company delivering enterprise-scale digital products.",
    highlights: [
      "Translated ambiguous stakeholder requirements into user flows, UI specs, and product workflows.",
      "Structured handoff with engineering and QA cut post-release defects ~30% and fix turnaround ~20%.",
    ],
  },
]

export const EDUCATION = [
  {
    school: "University of Maryland, Baltimore County",
    degree: "Master of Information Systems",
    range: "Jan 2024 to Dec 2025",
    note: "GPA 3.74 · HCC, UX Research, Product Management, Information Architecture, Data Visualization",
  },
  {
    school: "Dr. Babasaheb Ambedkar Technological University",
    degree: "B.Tech, Computer Engineering",
    range: "Jun 2018 to Aug 2022",
    note: "GPA 3.4",
  },
] as const

export const SKILLS = {
  design: [
    "Product & Interaction Design",
    "Design Systems & Tokens",
    "Responsive & Mobile-First",
    "Prototyping",
    "Accessibility (WCAG 2.1)",
    "UX Writing",
  ],
  research: [
    "Usability Testing",
    "User Interviews",
    "Participatory Design",
    "Mixed-Methods Research",
    "Heuristic Evaluation",
    "A/B Testing",
  ],
  tools: ["Figma", "FigJam", "Dev Mode", "Framer", "Miro", "Tableau", "Jira", "Notion"],
  technical: ["HTML / CSS", "Vue.js", "React (basic)", "Design-to-Code", "Developer Handoff", "AI Evaluation"],
} as const

export const CURRENT_ROLE = EXPERIENCE.find((r) => r.current) ?? EXPERIENCE[0]
