"use client"

import { Button } from "@/components/ui/button"
import { ModuleBadge } from "@/components/module-badge"
import { SectionWrapper } from "@/components/section-wrapper"
import { WindowShell } from "@/components/window-shell"
import { Mail, Linkedin, MapPin, Wifi } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const interests = [
  "AI-assisted workflows",
  "Data-heavy products",
  "Multi-step user journeys",
  "Design systems",
  "Cross-functional teams",
]

export function ContactSection() {
  return (
    <SectionWrapper id="epilogue" windowTitle="EPILOGUE · OPEN CHANNEL">
      <div className="flex justify-center mb-5">
        <ModuleBadge module="06" label="EPILOGUE" />
      </div>

      {/* Centered dialog-style window */}
      <WindowShell title="EPILOGUE · OPEN CHANNEL">
        <div className="grid lg:grid-cols-2 gap-8 h-full">
          {/* Left Column - Text */}
          <div className="space-y-5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                What I'm Looking For Next
              </h2>

              <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                <p>
                  I'm looking for teams who are building tools that matter — especially where there's complexity under the
                  hood and a need for calm, trustworthy interfaces on the surface.
                </p>
                <p>
                  If you're a recruiter, PM, founder, or designer and any of this resonates, I'd love to talk.
                </p>
              </div>
            </motion.div>

            {/* Interest tags */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2.5">
                Areas I care about:
              </p>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                  <motion.span
                    key={interest}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.3 }}
                    className="px-2.5 py-1 rounded-full text-xs font-medium text-slate-300 border"
                    style={{
                      background: "rgba(15, 23, 42, 0.6)",
                      borderColor: "rgba(74, 123, 247, 0.2)",
                    }}
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  size="lg"
                  className="gap-2 rounded-full px-7 w-full sm:w-auto shadow-md hover:shadow-primary/20 hover:shadow-lg transition-all"
                  asChild
                >
                  <a href="mailto:vishald089@gmail.com">
                    <Mail className="h-4 w-4" />
                    Send me a note
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-transparent rounded-full px-7 w-full sm:w-auto hover:bg-[#EDE9FE]/10 hover:border-[#A78BFA]/40 transition-all"
                  asChild
                >
                  <a href="https://www.linkedin.com/in/vishal-deshmukh-813189210/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                    Connect on LinkedIn
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Profile card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="flex flex-col"
          >
            <div
              className="rounded-xl overflow-hidden flex flex-col h-full"
              style={{
                background: "rgba(8, 15, 40, 0.7)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Card header */}
              <div
                className="px-5 py-3 flex items-center gap-2 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(15,23,42,0.5)" }}
              >
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">contact.json</span>
              </div>

              <div className="p-5 flex flex-col gap-5 flex-1">
                {/* Avatar + name */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className="w-16 h-16 rounded-full overflow-hidden border-2"
                      style={{ borderColor: "rgba(74, 123, 247, 0.4)" }}
                    >
                      <Image
                        src="/images/vishal-portrait.jpg"
                        alt="Vishal Deshmukh"
                        width={64}
                        height={64}
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    {/* Online indicator */}
                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 bg-green-500 flex items-center justify-center"
                      style={{ borderColor: "rgba(8, 15, 40, 0.9)" }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full bg-green-400"
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Vishal Deshmukh</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Product Designer · Pixelogic OS</p>
                  </div>
                </div>

                {/* Status grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: Wifi,
                      label: "Status",
                      value: "available",
                      valueColor: "#22c55e",
                      live: true,
                    },
                    {
                      icon: MapPin,
                      label: "Location",
                      value: "Baltimore, MD",
                      valueColor: "rgb(148,163,184)",
                      live: false,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg p-3 flex flex-col gap-1.5"
                      style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-center gap-1.5">
                        {item.live && (
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">{item.label}</span>
                      </div>
                      <span className="text-sm font-mono" style={{ color: item.valueColor }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Remote / preference */}
                <div
                  className="rounded-lg p-3"
                  style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide block mb-1.5">
                    Work preference
                  </span>
                  <div className="flex gap-2">
                    {["Remote", "Hybrid", "On-site"].map((mode, i) => (
                      <span
                        key={mode}
                        className="px-2 py-0.5 rounded text-[10px] font-mono"
                        style={{
                          background: i === 0 ? "rgba(74,123,247,0.15)" : "rgba(255,255,255,0.04)",
                          border: i === 0 ? "1px solid rgba(74,123,247,0.3)" : "1px solid rgba(255,255,255,0.06)",
                          color: i === 0 ? "rgb(74,123,247)" : "rgb(100,116,139)",
                        }}
                      >
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>

                {/* EOF marker */}
                <div className="mt-auto flex items-center gap-2 pt-2">
                  <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <span className="text-[10px] font-mono text-slate-600">EOF</span>
                  <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </WindowShell>
    </SectionWrapper>
  )
}
