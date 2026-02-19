"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { WindowShell } from "@/components/window-shell"
import { motion } from "framer-motion"
import { useSystemLog } from "@/contexts/system-log-context"
import { useReadingStore } from "@/contexts/reading-store-context"
import { CHAPTERS } from "@/lib/chapters-config"

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
        "py-16 md:py-24 scroll-mt-16 lg:snap-start lg:min-h-[90vh] lg:flex lg:items-center",
        className
      )}
    >
      <div className="mx-auto w-full space-y-8 lg:space-y-10">
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
