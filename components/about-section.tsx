"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModuleBadge } from "@/components/module-badge"
import { SectionWrapper } from "@/components/section-wrapper"
import { Users, Wrench } from "lucide-react"
import { useViewMode } from "@/contexts/view-mode-context"
import { motion } from "framer-motion"
import Image from "next/image"

const cardData = {
  strengths: {
    title: "What I bring",
    file: "strengths.ts",
    items: [
      "Systems thinking & big-picture perspective",
      "Structured problem-solving approach",
      "Calm, clear communication style",
    ],
  },
  comfortZone: {
    title: "Where I'm most useful",
    file: "preferences.ts",
    items: [
      "Cross-functional team collaboration",
      "Navigating ambiguity with confidence",
      "AI & analytics tool integration",
    ],
  },
  tools: {
    title: "Tools I reach for",
    file: "toolkit.json",
    items: ["Figma", "FigJam", "Miro", "Notion", "SQL", "Tableau"],
  },
}

const aboutContent = {
  recruiter: {
    paragraphs: [
      "Product designer with an IS background—I understand both user needs and technical constraints.",
      "I thrive in ambiguous problem spaces and deliver clear, actionable design solutions that ship.",
    ],
    bullets: [
      "IS background = technical fluency with engineers",
      "Comfortable with complex, data-heavy products",
      "Clear communicator across disciplines",
    ],
  },
  designer: {
    blocks: [
      {
        type: "paragraph",
        text: "I didn't start in design. I started in Computer Engineering - writing logic, understanding data structures, and learning how systems hold together under pressure.",
      },
      {
        type: "paragraph",
        text: "I was trained to think in constraints: inputs and outputs, architecture before interface. But something kept pulling my attention away from just how systems worked… and toward how people experienced them.",
      },
      {
        type: "paragraph",
        text: "During my Master's in Information Systems, that shift became clearer. I wasn't only thinking about backend logic anymore - I was mapping workflows, studying decision systems, and understanding how data, processes, and people intersect.",
        sectionBreak: true,
      },
      {
        type: "translation",
        intro: "In projects and internships, I naturally gravitated toward the \"translation layer\":",
        items: [
          "Turning messy requirements into structured flows",
          "Explaining technical systems to non-technical stakeholders",
          "Designing clarity inside complex constraints",
        ],
      },
      {
        type: "paragraph",
        text: "That's when I realized design, for me, wasn't decoration.",
      },
      {
        type: "poetic",
        lines: [
          "It was system decisions.",
          "What should be visible.",
          "What should be automated.",
          "What should be simplified.",
          "What should stay hidden.",
        ],
      },
      {
        type: "paragraph",
        text: "Today, my work lives at that intersection: engineering discipline, systems thinking, and human-centered clarity.",
        sectionBreak: true,
      },
      {
        type: "paragraph",
        text: "Pixelogic OS isn't just a portfolio. It's the documentation of that evolution - from building systems to shaping how people move through them.",
      },
    ],
  },
}

const timeline = [
  {
    year: "2018–2022",
    milestone: "Computer Engineering Foundation",
    description:
      "Learning how systems are built, optimized, and constrained — from backend logic to scalable architecture.",
  },
  {
    year: "2022–2023",
    milestone: "Web Development Team Lead — Wipro",
    description:
      "Delivering enterprise product modules in sprint cycles, translating ambiguous business requirements into structured user stories and production-ready flows.",
  },
  {
    year: "2023",
    milestone: "Full Stack Development — DevTown",
    description:
      "Designing and developing production-ready web applications, strengthening product thinking through UI systems and backend integration.",
  },
  {
    year: "2024–2025",
    milestone: "Master’s in Information Systems — UMBC",
    description:
      "Shifting into workflows, data ecosystems, UX research, and decision-support systems.",
  },
  {
    year: "2025–Present",
    milestone: "Founding Product Designer — Hirello.ai",
    description:
      "Designing AI-driven career workflows, translating complex AI capabilities into clear, trustworthy user experiences.",
  },
]

export function AboutSection() {
  const { viewMode } = useViewMode()
  const content = aboutContent[viewMode]

  return (
    <SectionWrapper id="chapter-1" windowTitle="ORIGIN · THE SYSTEMS BACKGROUND" moduleLabel="ORIGIN · THE SYSTEMS BACKGROUND">
      <ModuleBadge module="01" label="ORIGIN" />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Left Column - Story Text + Pull Quote */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">The Systems Background</h2>

          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            {viewMode === "recruiter" && content.bullets && (
              <div className="flex flex-col gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10 mb-4">
                <span className="text-xs font-mono text-primary uppercase tracking-wide">Quick Summary</span>
                <ul className="space-y-1.5">
                  {content.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {viewMode === "recruiter" && (
              <div className="text-muted-foreground text-lg leading-[1.7] [&>p]:mb-4 last:mb-0">
                {content.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            {viewMode === "designer" && content.blocks && (
              <div className="text-muted-foreground text-sm leading-[1.6]">
                {content.blocks.map((block, i) => {
                  if (block.type === "paragraph") {
                    return (
                      <p
                        key={i}
                        className={block.sectionBreak ? "mb-3" : "mb-2"}
                      >
                        {block.text}
                      </p>
                    )
                  }
                  if (block.type === "translation") {
                    return (
                      <div key={i}>
                        <p className="mb-4">{block.intro}</p>
                        <ul className="mt-2 mb-3 flex flex-col gap-1.5 list-none pl-0">
                          {block.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-[0.4em]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  }
                  if (block.type === "poetic") {
                    return (
                      <div key={i} className="mt-5 mb-4 leading-[1.8]">
                        {block.lines.map((line, j) => (
                          <span key={j} className="block">{line}</span>
                        ))}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            )}
          </motion.div>

          {/* Pull quote removed for density */}
        </div>

        {/* Right Column - Timeline + Sketch */}
        <div className="space-y-8">
          {/* Vertical Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-3">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.04 + index * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-16"
                >
                  <div className="absolute left-3 top-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-lg z-10">
                    {index + 1}
                  </div>
                  <Card className="border-border shadow-sm">
                    <CardContent className="p-3">
                      <div className="text-xs font-mono text-muted-foreground mb-0.5">{item.year}</div>
                      <h3 className="font-semibold text-foreground text-sm mb-0.5">{item.milestone}</h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sketch image removed for density — timeline alone fills column */}
        </div>
      </div>
    </SectionWrapper>
  )
}
