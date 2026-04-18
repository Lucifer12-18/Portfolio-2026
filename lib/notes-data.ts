export interface NoteMetadata {
  slug: string
  title: string
  excerpt: string
  date: string
  isoDate: string
  tag: string
  category: string
  file: string
  imagePath: string
  accentColor: string
  height: "tall" | "medium" | "short"
}

export const NOTES: NoteMetadata[] = [
  {
    slug: "ai_ux_balance",
    tag: "AI & Design",
    category: "AI",
    file: "ai_ux_balance.md",
    title: "Designing with AI without overwhelming users",
    excerpt:
      "In early testing of Hirello's interview feedback panel, users ignored the AI output entirely—not because it was wrong, but because it appeared all at once. Here's what progressive disclosure actually looks like in an AI product.",
    date: "Nov 2024",
    isoDate: "2024-11-01",
    imagePath: "/images/notes/thumb-ai-ux.svg",
    accentColor: "rgba(74, 123, 247, 0.6)",
    height: "tall",
  },
  {
    slug: "is_to_ux",
    tag: "Career",
    category: "Career",
    file: "is_to_ux.md",
    title: "From engineering to UX: thinking in systems",
    excerpt:
      "The honest version of my career pivot—it wasn't dissatisfaction with engineering. It was noticing that the systems I was building had invisible failure modes that only showed up when humans used them.",
    date: "Oct 2024",
    isoDate: "2024-10-01",
    imagePath: "/images/notes/thumb-career.svg",
    accentColor: "rgba(167, 139, 250, 0.6)",
    height: "short",
  },
  {
    slug: "storytelling",
    tag: "Process",
    category: "UX",
    file: "storytelling.md",
    title: "Why complex tools need simple stories",
    excerpt:
      "Hirello's networking pipeline had seven stages. Users completed onboarding but didn't return after day two. The system was logical. The story was missing.",
    date: "Sep 2024",
    isoDate: "2024-09-01",
    imagePath: "/images/notes/thumb-story.svg",
    accentColor: "rgba(249, 115, 98, 0.6)",
    height: "medium",
  },
  {
    slug: "feedback_loops",
    tag: "AI & Design",
    category: "AI",
    file: "feedback_loops.md",
    title: "Feedback should be measurable, not emotional",
    excerpt:
      "During user testing of the AI Interview Gym, when the AI said 'your answer felt weak,' users got defensive. When it said 'your answer had one concrete example out of four expected,' they took notes.",
    date: "Dec 2024",
    isoDate: "2024-12-01",
    imagePath: "/images/notes/thumb-feedback.svg",
    accentColor: "rgba(34, 211, 238, 0.6)",
    height: "medium",
  },
  {
    slug: "designing_for_latency",
    tag: "Systems",
    category: "Systems",
    file: "designing_for_latency.md",
    title: "Designing for the seconds AI makes you wait",
    excerpt:
      "AI features have unavoidable latency. A 3-second wait for resume analysis, 4 seconds for interview feedback. Users fill that void with anxiety or abandonment. The wait is a design surface.",
    date: "Jan 2025",
    isoDate: "2025-01-01",
    imagePath: "/images/notes/thumb-systems.svg",
    accentColor: "rgba(56, 189, 248, 0.6)",
    height: "tall",
  },
]
