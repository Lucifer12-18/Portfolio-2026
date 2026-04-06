"use client"

import { useState } from "react"
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
    accentColor: "rgba(74, 123, 247, 0.8)",
    accentBg: "rgba(74, 123, 247, 0.08)",
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
    accentColor: "rgba(167, 139, 250, 0.8)",
    accentBg: "rgba(167, 139, 250, 0.08)",
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
    accentColor: "rgba(34, 211, 238, 0.8)",
    accentBg: "rgba(34, 211, 238, 0.08)",
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
      delay: 0.05 + i * 0.07,
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

function CapabilityCard({ capability, index }: { capability: (typeof capabilities)[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <div
        className="relative h-full rounded-2xl overflow-hidden flex flex-col p-6"
        style={{
          background: hovered
            ? `linear-gradient(135deg, rgba(8,15,40,0.85), rgba(8,15,40,0.70))`
            : "rgba(8, 15, 40, 0.55)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: hovered
            ? `1px solid ${capability.accentColor}50`
            : "1px solid rgba(255,255,255,0.07)",
          boxShadow: hovered
            ? `0 0 0 1px ${capability.accentColor}20, 0 12px 40px rgba(0,0,0,0.5), 0 0 60px ${capability.accentColor}08`
            : "0 2px 8px rgba(0,0,0,0.2)",
          transition: "all 0.35s ease",
        }}
      >
        {/* Shimmer top line on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${capability.accentColor}, transparent)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />

        {/* Filename */}
        <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-500 opacity-60">
          {capability.file}
        </div>

        {/* Icon */}
        <div className="flex items-center justify-center mb-5 mt-2">
          <motion.div
            className="p-4 rounded-2xl flex items-center justify-center"
            style={{
              background: hovered ? capability.accentBg : "rgba(15, 23, 42, 0.6)",
              border: `1px solid ${hovered ? capability.accentColor + "30" : "rgba(255,255,255,0.06)"}`,
              transition: "all 0.35s ease",
            }}
            animate={{
              boxShadow: hovered
                ? `0 0 20px ${capability.accentColor}30`
                : "none",
            }}
          >
            <capability.icon
              className="h-8 w-8 transition-all duration-300"
              style={{ color: hovered ? capability.accentColor : "rgba(148, 163, 184, 0.8)" }}
            />
          </motion.div>
        </div>

        {/* Title and subtitle */}
        <div className="text-center mb-4">
          <h3
            className="text-lg font-semibold mb-1.5 transition-colors duration-300"
            style={{ color: hovered ? capability.accentColor : "rgb(226, 232, 240)" }}
          >
            {capability.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-snug italic">{capability.subtitle}</p>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-4"
          style={{
            background: hovered
              ? `linear-gradient(90deg, transparent, ${capability.accentColor}40, transparent)`
              : "rgba(255,255,255,0.06)",
            transition: "background 0.35s ease",
          }}
        />

        {/* Bullets */}
        <ul className="space-y-2 mt-auto">
          {capability.bullets.map((bullet, i) => (
            <motion.li
              key={bullet}
              className="flex items-start gap-2 text-sm text-muted-foreground"
              animate={{ x: hovered ? 2 : 0 }}
              transition={{ delay: i * 0.04, duration: 0.2 }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 transition-colors duration-300"
                style={{ background: hovered ? capability.accentColor : "rgba(74, 123, 247, 0.6)" }}
              />
              {bullet}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
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

        <div className="text-center mb-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">From Logic to Experience</h2>

          {viewMode === "recruiter" && (
            <div className="flex flex-col gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10 mb-5 max-w-lg mx-auto text-left">
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

          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            As my projects became more complex, I stopped separating engineering from design. I began seeing products as
            systems — shaped by constraints, workflows, and decision logic. That shift shows up in three areas:
            structured product design, research-driven problem framing, and systems-aware interface thinking.
          </p>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-3 gap-5 flex-1 min-h-0">
          {capabilities.map((capability, i) => (
            <CapabilityCard key={capability.title} capability={capability} index={i} />
          ))}
        </div>

        {/* Mobile layout - horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4 snap-x snap-mandatory pb-4" style={{ width: "max-content" }}>
            {capabilities.map((capability, i) => (
              <div
                key={capability.title}
                className="snap-center"
                style={{ width: "280px" }}
              >
                <CapabilityCard capability={capability} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
