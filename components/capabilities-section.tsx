"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ModuleBadge } from "@/components/module-badge"
import { SectionWrapper } from "@/components/section-wrapper"
import { Layers, Search, Cpu } from "lucide-react"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"


const capabilities = [
  {
    icon: Layers,
    title: "Product & UX Design",
    subtitle: "Translating constraints and requirements into structured, usable interfaces.",
    file: "design.ts",
    bullets: [
      "End-to-end product flows",
      "Interaction design for multi-step systems",
      "Design systems & scalable components",
      "High-fidelity prototypes for validation",
    ],
  },
  {
    icon: Search,
    title: "UX Research & Strategy",
    subtitle: "Framing the right problem before designing the solution.",
    file: "research.ts",
    bullets: [
      "Stakeholder and contextual interviews",
      "Workflow mapping & journey modeling",
      "Problem definition & prioritization",
      "Usability testing and iteration loops",
    ],
  },
  {
    icon: Cpu,
    title: "AI, Data & Systems",
    subtitle: "Designing interfaces around data logic and algorithmic behavior.",
    file: "systems.ts",
    bullets: [
      "Interfaces for AI-assisted workflows",
      "Decision-support dashboards",
      "Simplifying complex data visualization",
      "Transparency and AI confidence patterns",
    ],
  },
]

const capabilitiesContent = {
  recruiter: {
    bullets: [
      "Full-stack design: research through high-fidelity UI",
      "Specialized in AI/ML and data-heavy products",
      "Design systems & scalable component thinking",
    ],
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.05 + i * 0.06,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

export function CapabilitiesSection() {
  const { viewMode } = useViewMode()

  return (
    <SectionWrapper
      id="chapter-2"
      windowTitle="SHIFT · FROM LOGIC TO EXPERIENCE"
      moduleLabel="SHIFT · FROM LOGIC TO EXPERIENCE"
    >
      <div className="flex flex-col h-full gap-4">
        <ModuleBadge module="02" label="SHIFT" />

        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">From Logic to Experience</h2>

          {viewMode === "recruiter" && (
            <div className="flex flex-col gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10 mb-6 max-w-lg mx-auto text-left">
              <span className="text-xs font-mono text-primary uppercase tracking-wide">Quick Summary</span>
              <ul className="space-y-1.5">
                {capabilitiesContent.recruiter.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            As my projects became more complex, I stopped separating engineering from design. I began seeing products as
            systems - shaped by constraints, workflows, and decision logic. That shift shows up in three areas of my
            work: structured product design, research-driven problem framing, and systems-aware interface thinking.
            Cleaner. Sharper. More confident.
          </p>
        </div>

        {/* Desktop layout - 3 cards that stretch to fill available height */}
        <div className="hidden md:grid grid-cols-3 gap-6 flex-1 min-h-0">
          {capabilities.map((capability, i) => (
            <motion.div
              key={capability.title}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -8, rotate: 2 }}
              className="h-full"
            >
              <Card className="h-full border-border shadow-sm hover:shadow-xl transition-all group rounded-2xl">
                <CardContent className="h-full p-6 flex flex-col">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors icon-container-glow">
                      <capability.icon className="h-8 w-8 text-primary icon-glow" />
                    </div>
                  </div>

                  <div className="text-center mb-3">
                    <span className="text-xs font-mono text-muted-foreground">{capability.file}</span>
                    <h3 className="text-xl font-semibold text-foreground mt-2 mb-2">{capability.title}</h3>
                    <p className="text-sm text-foreground/85 italic">{capability.subtitle}</p>
                  </div>

                  <ul className="space-y-2 mt-auto">
                    {capability.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile layout - horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4 snap-x snap-mandatory pb-4" style={{ width: "max-content" }}>
            {capabilities.map((capability, i) => (
              <motion.div
                key={capability.title}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="snap-center"
                style={{ width: "280px" }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full border-border shadow-sm hover:shadow-md transition-shadow group rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors icon-container-glow">
                        <capability.icon className="h-8 w-8 text-primary icon-glow" />
                      </div>
                    </div>

                    <div className="text-center mb-3">
                      <span className="text-xs font-mono text-muted-foreground">{capability.file}</span>
                      <h3 className="text-base font-semibold text-foreground mt-1">{capability.title}</h3>
                      <p className="text-xs text-foreground/85 mt-1 italic">{capability.subtitle}</p>
                    </div>

                    <ul className="space-y-3">
                      {capability.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="h-1 w-1 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>


      </div> {/* end flex-col h-full wrapper */}
    </SectionWrapper>
  )
}
