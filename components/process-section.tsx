"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ModuleBadge } from "@/components/module-badge"
import { SectionWrapper } from "@/components/section-wrapper"
import { Ear, Map, PenTool, Rocket } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: Ear,
    number: "01",
    title: "Listen & Frame the Story",
    description:
      "Shape the problem with research and stakeholder alignment so we solve the right thing.",
    bullets: [
      "Interview stakeholders and surface hidden constraints",
      "Clarify business goals and technical realities",
      "Define the right problem before designing solutions",
    ],
  },
  {
    icon: Map,
    number: "02",
    title: "Map the System",
    description: "Map flows, touchpoints, and friction so we see the full system before committing.",
    bullets: [
      "Map end-to-end user journeys and system touchpoints",
      "Identify decision logic and friction points",
      "Explore multiple solution directions before committing",
    ],
  },
  {
    icon: PenTool,
    number: "03",
    title: "Prototype & Reality-Check",
    description: "Build and test against real constraints; iterate based on evidence, not assumption.",
    bullets: [
      "Build prototypes aligned to real constraints",
      "Validate decisions with users and stakeholders",
      "Iterate quickly based on evidence, not assumption",
    ],
  },
  {
    icon: Rocket,
    number: "04",
    title: "Ship & Learn",
    description: "Ship with engineering, measure impact, and refine from data and feedback.",
    bullets: [
      "Partner closely with engineering through delivery",
      "Measure product impact post-launch",
      "Use data and feedback to refine continuously",
    ],
  },
]

const processContent = {
  recruiter: {
    bullets: [
      "Structured, repeatable design process",
      "Research-driven, not just pixels",
      "Collaborative with eng through delivery",
    ],
  },
}

export function ProcessSection() {
  const { viewMode } = useViewMode()
  const [activeStep, setActiveStep] = useState(0)
  const currentStep = steps[activeStep]

  return (
    <SectionWrapper id="chapter-3" windowTitle="METHOD · THE DESIGN RHYTHM" moduleLabel="METHOD · THE DESIGN RHYTHM">
      <ModuleBadge module="03" label="METHOD" />

      <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">The Design Rhythm</h2>

      {viewMode === "recruiter" && (
        <div className="flex flex-col gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10 mb-6 max-w-lg">
          <span className="text-xs font-mono text-primary uppercase tracking-wide">Quick Summary</span>
          <ul className="space-y-1.5">
            {processContent.recruiter.bullets.map((bullet, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="max-w-2xl mb-6">
        <p className="text-muted-foreground leading-relaxed mb-2">
          Most of my work follows a structured loop.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Not because design is linear - but because complex systems require discipline.
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="border-l-2 border-primary/30 bg-primary/5 pl-4 py-2.5 pr-4 rounded-r-md text-base font-medium tracking-wide leading-snug text-foreground/90"
        >
          Understand the system.
          <br />
          Map the constraints.
          <br />
          Prototype with intent.
          <br />
          Ship, measure, refine.
        </motion.div>
      </div>

      {/* Desktop/Tablet: Interactive Pipeline */}
      <div className="hidden md:block">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">
          Execution Loop
        </p>
        {/* Pipeline Bar */}
        <div className="relative py-8 mb-10">
          {/* Tinted background band */}
          <div className="absolute inset-0 bg-primary/5 rounded-2xl border border-primary/8" />

          {/* Pipeline line with nodes */}
          <div className="relative h-20 flex items-center px-4">
            {/* Base horizontal line */}
            <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-primary/15 rounded-full" />
            {/* Animated progress fill */}
            <motion.div
              className="absolute top-1/2 left-4 h-[2px] rounded-full origin-left"
              style={{
                background: "linear-gradient(90deg, rgba(74,123,247,0.8), rgba(167,139,250,0.6))",
                boxShadow: "0 0 6px rgba(74,123,247,0.4)",
              }}
              animate={{
                width: `${(activeStep / (steps.length - 1)) * (100 - 6)}%`,
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Step nodes */}
            <div className="relative grid grid-cols-4 gap-0 w-full z-10">
              {steps.map((step, index) => {
                const isActive = activeStep === index
                const isPast = index < activeStep
                return (
                  <motion.button
                    key={step.number}
                    onClick={() => setActiveStep(index)}
                    className="flex flex-col items-center gap-2 group relative"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Hover tooltip */}
                    <motion.div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none"
                      initial={{ opacity: 0, y: 4 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="bg-slate-800 border border-white/10 rounded-md px-2.5 py-1 text-[10px] font-mono text-slate-300 whitespace-nowrap shadow-lg">
                        {step.title}
                      </div>
                    </motion.div>

                    {/* Node circle */}
                    <div className="relative flex flex-col items-center gap-2">
                      <motion.div
                        className={cn(
                          "w-14 h-14 rounded-full flex flex-col items-center justify-center text-xs font-bold shadow-lg border-4 border-background transition-colors relative",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : isPast
                            ? "bg-primary/30 text-primary border-primary/20"
                            : "bg-background text-muted-foreground border-muted-foreground/30"
                        )}
                        animate={
                          isActive
                            ? {
                                boxShadow: [
                                  "0 0 0 0 rgba(74, 123, 247, 0.5)",
                                  "0 0 0 14px rgba(74, 123, 247, 0)",
                                ],
                              }
                            : {}
                        }
                        transition={{ duration: 1.8, repeat: isActive ? Infinity : 0 }}
                        style={
                          isActive
                            ? { filter: "drop-shadow(0 0 14px rgba(74, 123, 247, 0.7))" }
                            : isPast
                            ? { filter: "drop-shadow(0 0 6px rgba(74, 123, 247, 0.25))" }
                            : {}
                        }
                      >
                        <span>{step.number}</span>
                        <step.icon
                          className={cn(
                            "h-3.5 w-3.5 mt-0.5 transition-colors",
                            isActive ? "text-primary-foreground" : isPast ? "text-primary" : "text-muted-foreground/60"
                          )}
                        />
                      </motion.div>
                      {/* Step label */}
                      <span
                        className={cn(
                          "text-xs font-mono transition-colors text-center max-w-[90px] leading-tight",
                          isActive ? "text-primary font-semibold" : isPast ? "text-primary/60" : "text-muted-foreground/50"
                        )}
                      >
                        {step.title.split(" ")[0]}
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="border-border shadow-md rounded-2xl">
              <CardContent className="p-8">
                {/* Step label */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="px-3 py-1 bg-primary/10 rounded-lg">
                    <span className="text-xs font-mono text-primary uppercase tracking-wide">
                      STEP {currentStep.number} · {currentStep.title.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Step title */}
                <h3 className="text-2xl font-semibold text-foreground mb-4">{currentStep.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                  {currentStep.description}
                </p>

                {/* Bullet points */}
                <ul className="space-y-3">
                  {currentStep.bullets.map((bullet, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.03 }}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{bullet}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: Simple vertical stack */}
      <div className="md:hidden relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="relative pl-16"
            >
              <div
                className="absolute left-3 top-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-md z-10"
                style={{ filter: "drop-shadow(0 0 6px rgba(74, 123, 247, 0.4))" }}
              >
                {step.number}
              </div>

              <Card className="border-border shadow-sm hover:shadow-md transition-all rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10 icon-container-glow">
                      <step.icon className="h-4 w-4 text-primary icon-glow" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                  <ul className="space-y-2">
                    {step.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
