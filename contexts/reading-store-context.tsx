"use client"

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react"
import { CHAPTERS, type ChapterId, type ChapterConfig } from "@/lib/chapters-config"

interface ReadingStoreContextType {
  activeSection: string | null
  activeModule: string | null
  activeChapterId: ChapterId | null
  activeChapterConfig: ChapterConfig | null
  setActiveSection: (section: string | null) => void
  setActiveModule: (module: string | null) => void
}

const ReadingStoreContext = createContext<ReadingStoreContextType | undefined>(undefined)

export function ReadingStoreProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [activeModule, setActiveModule] = useState<string | null>(null)

  // Derive activeChapterId and activeChapterConfig from activeSection
  const activeChapterConfig = useMemo(() => {
    if (!activeSection) return null
    return CHAPTERS.find((c) => c.sectionId === activeSection) ?? null
  }, [activeSection])

  const activeChapterId = activeChapterConfig?.id ?? null

  // Track active section based on scroll position using CHAPTERS order
  useEffect(() => {
    const sections = CHAPTERS.map((c) => c.sectionId)

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2

      // Go through sections in reverse order (bottom to top) to find the first match
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section) {
          const rect = section.getBoundingClientRect()
          const sectionTop = rect.top + window.scrollY
          const sectionBottom = sectionTop + rect.height

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <ReadingStoreContext.Provider
      value={{
        activeSection,
        activeModule,
        activeChapterId,
        activeChapterConfig,
        setActiveSection,
        setActiveModule,
      }}
    >
      {children}
    </ReadingStoreContext.Provider>
  )
}

export function useReadingStore() {
  const context = useContext(ReadingStoreContext)
  if (context === undefined) {
    throw new Error("useReadingStore must be used within a ReadingStoreProvider")
  }
  return context
}

