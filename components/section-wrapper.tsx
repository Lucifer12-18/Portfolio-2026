"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { WindowShell } from "@/components/window-shell"
import { motion } from "framer-motion"
import { useSystemLog } from "@/contexts/system-log-context"
import { useReadingStore } from "@/contexts/reading-store-context"
import { CHAPTERS } from "@/lib/chapters-config"

const SECTION_ACCENT: Record<string, string> = {
  prologue:   "34, 211, 238",
  "chapter-1": "6, 182, 212",
  "chapter-2": "124, 58, 237",
  "chapter-3": "167, 139, 250",
  "chapter-4": "56, 189, 248",
  "chapter-5": "147, 197, 253",
  epilogue:   "224, 249, 255",
}

interface SectionWrapperProps {
  id: string
  children: React.ReactNode
  className?: string
  windowTitle?: string
  moduleLabel?: string
}

export function SectionWrapper({ id, children, className, windowTitle, moduleLabel }: SectionWrapperProps) {
  const { addLog } = useSystemLog()
  const { setActiveModule } = useReadingStore()
  const [hasLogged, setHasLogged] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const accentRgb = SECTION_ACCENT[id] ?? "34, 211, 238"

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLogged) {
            const chapterConfig = CHAPTERS.find((c) => c.sectionId === id)
            const sectionName = chapterConfig ? chapterConfig.fullLabel.toUpperCase() : id.toUpperCase()
            addLog(`> loaded section: ${sectionName}`)
            if (moduleLabel) {
              setActiveModule(moduleLabel)
            }
            setHasLogged(true)
          }
        })
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [id, moduleLabel, windowTitle, addLog, hasLogged, setActiveModule])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "relative py-16 md:py-24 scroll-mt-16 lg:snap-start lg:min-h-[90vh] lg:flex lg:items-center",
        className
      )}
    >
      {/* Radial gradient spotlight — per-section accent glow */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-[0.035]"
          style={{
            background: `radial-gradient(ellipse at center, rgba(${accentRgb}, 0.6) 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative mx-auto w-full space-y-8 lg:space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {windowTitle ? <WindowShell title={windowTitle}>{children}</WindowShell> : children}
        </motion.div>
      </div>
    </section>
  )
}
