"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { WindowShell } from "@/components/window-shell"
import { motion } from "framer-motion"
import { useSystemLog } from "@/contexts/system-log-context"
import { useReadingStore } from "@/contexts/reading-store-context"
import { CHAPTERS } from "@/lib/chapters-config"

const SECTION_ACCENT: Record<string, string> = {
  prologue: "34, 211, 238",
  "chapter-1": "6, 182, 212",
  "chapter-2": "124, 58, 237",
  "chapter-3": "167, 139, 250",
  "chapter-4": "56, 189, 248",
  "chapter-5": "147, 197, 253",
  epilogue: "224, 249, 255",
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
  const hasLoggedRef = useRef(false)
  const accentRgb = SECTION_ACCENT[id] ?? "34, 211, 238"

  useEffect(() => {
    if (hasLoggedRef.current) return
    hasLoggedRef.current = true

    const chapterConfig = CHAPTERS.find((c) => c.sectionId === id)
    const sectionName = chapterConfig ? chapterConfig.fullLabel.toUpperCase() : id.toUpperCase()
    addLog(`> loaded section: ${sectionName}`)
    if (moduleLabel) {
      setActiveModule(moduleLabel)
    }
  }, [id, moduleLabel, addLog, setActiveModule])

  return (
    <section
      id={id}
      className={cn("relative h-full flex flex-col", className)}
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

      <div className="relative flex-1 min-h-0 w-full">
        <motion.div
          className="h-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {windowTitle ? <WindowShell title={windowTitle}>{children}</WindowShell> : children}
        </motion.div>
      </div>
    </section>
  )
}
