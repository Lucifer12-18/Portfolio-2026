"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ModuleBadge } from "@/components/module-badge"
import { SectionWrapper } from "@/components/section-wrapper"
import { WindowShell } from "@/components/window-shell"
import { Mail, Linkedin } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export function ContactSection() {
  return (
    <SectionWrapper id="epilogue" windowTitle="EPILOGUE · OPEN CHANNEL">
      <div className="flex justify-center mb-6">
        <ModuleBadge module="06" label="EPILOGUE" />
      </div>

      {/* Centered dialog-style window */}
      <WindowShell title="EPILOGUE · OPEN CHANNEL">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">What I'm Looking For Next</h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm looking for teams who are building tools that matter—especially where there's a lot of complexity
                under the hood and a need for calm, trustworthy interfaces on the surface.
              </p>
              <p>
                If you're a recruiter, PM, founder, or designer and any of this resonates, I'd love to talk.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button size="lg" className="gap-2 rounded-full px-8 w-full sm:w-auto" asChild>
                  <a href="mailto:vishald089@gmail.com">
                    <Mail className="h-4 w-4" />
                    Send me a note
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Button size="lg" variant="outline" className="gap-2 bg-transparent rounded-full px-8 w-full sm:w-auto" asChild>
                  <a href="https://www.linkedin.com/in/vishal-deshmukh-813189210/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                    Connect on LinkedIn
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Compact Profile/Status Card */}
          <div>
            <Card className="border-border shadow-sm h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EDE9FE]/60 via-[#FEF3C7]/30 to-[#F0F7FF] flex items-center justify-center border-2 border-background shadow-md overflow-hidden">
                    <Image
                      src="/images/vishal-portrait.jpg"
                      alt="Vishal Deshmukh"
                      width={64}
                      height={64}
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Vishal Deshmukh</p>
                    <p className="text-sm text-muted-foreground">Product Designer</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-2">status</div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <motion.span
                          className="absolute inline-flex h-full w-full rounded-full bg-green-400"
                          style={{ filter: "drop-shadow(0 0 6px #22c55e)" }}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.75, 0, 0.75],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeOut",
                          }}
                        />
                        <span
                          className="relative inline-flex rounded-full h-3 w-3 bg-green-500"
                          style={{ filter: "drop-shadow(0 0 4px #22c55e)" }}
                        ></span>
                      </span>
                      <span className="text-sm font-medium text-foreground font-mono">available</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-2">location</div>
                    <div className="text-sm text-foreground font-mono">baltimore_md</div>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-2">remote</div>
                    <div className="text-sm text-foreground font-mono">true</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </WindowShell>
    </SectionWrapper>
  )
}
