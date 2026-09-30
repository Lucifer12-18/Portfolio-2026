"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { WindowShell } from "@/components/window-shell"
import { useSystemLog } from "@/contexts/system-log-context"
import { useReadingStore } from "@/contexts/reading-store-context"
import { CHAPTERS } from "@/lib/chapters-config"
import { accentRgb } from "@/lib/chapter-palette"

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

  const chapterIndex = CHAPTERS.findIndex((c) => c.sectionId === id)
  const chapter = CHAPTERS[chapterIndex]
  // Shell titles read as sentence-case labels ("Work · Case Stories in
  // Practice"), not the old SHOUTED module IDs.
  const shellTitle = chapter?.fullLabel ?? windowTitle ?? id

  useEffect(() => {
    if (hasLoggedRef.current) return
    hasLoggedRef.current = true

    const sectionName = chapter ? chapter.fullLabel.toUpperCase() : id.toUpperCase()
    addLog(`> loaded section: ${sectionName}`)
    if (moduleLabel) {
      setActiveModule(moduleLabel)
    }
  }, [id, chapter, moduleLabel, addLog, setActiveModule])

  return (
    <section id={id} className={cn("relative h-full flex flex-col", className)}>
      {/* Ambient wash in this chapter's pigment — barely there, ties the
          window to the field behind it. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-[0.08]"
          style={{
            background: `radial-gradient(ellipse at center, rgba(${accentRgb(Math.max(0, chapterIndex))}, 0.6) 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative flex-1 min-h-0 w-full">
        {/* The page-level shell (pageFlipVariants) reveals the window; the
            per-element childRise cascade reveals the content. */}
        <div className="h-full">
          {windowTitle ? (
            <WindowShell title={shellTitle} chapterIndex={chapterIndex >= 0 ? chapterIndex : undefined}>
              {children}
            </WindowShell>
          ) : (
            children
          )}
        </div>
      </div>
    </section>
  )
}
