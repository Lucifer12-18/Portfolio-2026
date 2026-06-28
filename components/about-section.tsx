"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SectionWrapper } from "@/components/section-wrapper"
import { useViewMode } from "@/contexts/view-mode-context"
import { motion } from "framer-motion"
import { childRise, childRiseHeavy, childSlide } from "@/lib/motion"
import { DecodeText } from "@/components/decode-text"

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
    color: "rgba(245, 158, 11, 0.8)",
  },
  {
    year: "2022–2023",
    milestone: "Web Development Team Lead — Wipro",
    description:
      "Delivering enterprise product modules in sprint cycles, translating ambiguous business requirements into structured user stories and production-ready flows.",
    color: "rgba(167, 139, 250, 0.8)",
  },
  {
    year: "2023",
    milestone: "Full Stack Development — DevTown",
    description:
      "Designing and developing production-ready web applications, strengthening product thinking through UI systems and backend integration.",
    color: "rgba(34, 211, 238, 0.8)",
  },
  {
    year: "2024–2025",
    milestone: "Master's in Information Systems — UMBC",
    description:
      "Shifting into workflows, data ecosystems, UX research, and decision-support systems.",
    color: "rgba(249, 115, 98, 0.8)",
  },
  {
    year: "2025–Present",
    milestone: "Founding Product Designer — Hirello.ai",
    description:
      "Designing AI-driven career workflows, translating complex AI capabilities into clear, trustworthy user experiences.",
    color: "rgba(245, 158, 11, 0.9)",
  },
]

type RecruiterAbout = { paragraphs: string[]; bullets: string[] }
type DesignerAbout = {
  blocks: {
    type: string
    text?: string
    sectionBreak?: boolean
    intro?: string
    items?: string[]
    lines?: string[]
  }[]
}

export function AboutSection() {
  const { viewMode } = useViewMode()
  const content = aboutContent[viewMode as keyof typeof aboutContent]
  const recruiterContent = content as RecruiterAbout
  const designerContent = content as DesignerAbout

  return (
    <SectionWrapper id="chapter-1" windowTitle="ORIGIN · THE SYSTEMS BACKGROUND" moduleLabel="ORIGIN · THE SYSTEMS BACKGROUND">
      {/* Decorative chapter numeral */}
      <div aria-hidden="true" className="absolute top-4 right-6 md:right-10 marquee-num select-none">
        01
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column - Story Text */}
        <div className="space-y-5">
          <motion.div variants={childRise} initial="hidden" animate="show" custom={0}>
            <span className="eyebrow">Chapter 01 · Origin · Systems Background</span>
          </motion.div>

          <motion.h2
            variants={childRiseHeavy}
            initial="hidden"
            animate="show"
            custom={1}
            className="display-lg text-slate-50 leading-[1.04]"
          >
            The{" "}
            <em
              className="not-italic"
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              <DecodeText text="systems" delay={300} />
            </em>{" "}
            background.
          </motion.h2>

          <motion.div
            key={viewMode}
            variants={childRise}
            initial="hidden"
            animate="show"
            custom={2}
            className="space-y-4"
          >
            {viewMode === "recruiter" && recruiterContent.bullets && (
              <div className="flex flex-col gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10 mb-4">
                <span className="text-xs font-mono text-primary uppercase tracking-wide">Quick Summary</span>
                <ul className="space-y-1.5">
                  {recruiterContent.bullets.map((bullet: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {viewMode === "recruiter" && (
              <div className="text-muted-foreground text-base leading-[1.7] [&>p]:mb-4 last:mb-0">
                {recruiterContent.paragraphs?.map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {viewMode === "designer" && designerContent.blocks && (
              <div className="text-muted-foreground text-sm leading-[1.7] space-y-3">
                {designerContent.blocks.map((block: DesignerAbout["blocks"][0], i: number) => {
                  if (block.type === "paragraph") {
                    return (
                      <motion.p
                        key={i}
                        variants={childRise}
                        initial="hidden"
                        animate="show"
                        custom={3 + i}
                        className={block.sectionBreak ? "mb-1" : ""}
                      >
                        {block.text}
                      </motion.p>
                    )
                  }
                  if (block.type === "translation") {
                    return (
                      <motion.div
                        key={i}
                        variants={childRise}
                        initial="hidden"
                        animate="show"
                        custom={3 + i}
                        className="pl-4 border-l-2 border-primary/30 py-1 bg-primary/5 rounded-r-lg pr-3"
                      >
                        <p className="mb-2 text-foreground/80">{block.intro}</p>
                        <ul className="flex flex-col gap-1.5 list-none pl-0">
                          {(block.items ?? []).map((item: string, j: number) => (
                            <li key={j} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )
                  }
                  if (block.type === "poetic") {
                    return (
                      <motion.div
                        key={i}
                        variants={childRise}
                        initial="hidden"
                        animate="show"
                        custom={3 + i}
                        className="relative my-4 pl-5 border-l-2 border-accent/50 italic text-foreground/70 leading-[2]"
                        style={{
                          background: "linear-gradient(90deg, rgba(249,115,98,0.04), transparent)",
                          borderRadius: "0 8px 8px 0",
                          paddingTop: "8px",
                          paddingBottom: "8px",
                        }}
                      >
                        {(block.lines ?? []).map((line: string, j: number) => (
                          <motion.span
                            key={j}
                            className="block"
                            variants={childRise}
                            initial="hidden"
                            animate="show"
                            custom={3 + i + j}
                          >
                            {line}
                          </motion.span>
                        ))}
                      </motion.div>
                    )
                  }
                  return null
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column - Timeline */}
        <div className="relative">
          {/* Gradient track line */}
          <div
            className="absolute left-[18px] top-3 bottom-3 w-0.5 rounded-full"
            style={{
              background: "linear-gradient(to bottom, rgba(245,158,11,0.6), rgba(167,139,250,0.4), rgba(245,158,11,0.2))",
            }}
          />

          <div className="space-y-3">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                variants={childSlide}
                initial="hidden"
                animate="show"
                custom={3 + index}
                className="relative pl-14"
              >
                {/* Numbered node with glow */}
                <div
                  className="absolute left-0 top-2.5 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-md z-10"
                  style={{
                    background: `radial-gradient(circle, ${item.color}, ${item.color}88)`,
                    boxShadow: `0 0 12px ${item.color}60, 0 2px 8px rgba(0,0,0,0.4)`,
                    border: `2px solid ${item.color}44`,
                  }}
                >
                  {index + 1}
                </div>

                <Card className="border-border shadow-sm hover:shadow-md transition-all group"
                  style={{
                    background: "rgba(16, 16, 20, 0.62)",
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                >
                  <CardContent className="p-3.5">
                    <div
                      className="text-[10px] font-mono mb-0.5"
                      style={{ color: item.color }}
                    >
 
                      {item.year}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                      {item.milestone}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
