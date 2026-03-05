"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import { CHAPTERS, type ChapterId, type ChapterConfig } from "@/lib/chapters-config"

interface ReadingStoreContextType {
  activeSection: string | null
  activeModule: string | null
  activeChapterId: ChapterId | null
  activeChapterConfig: ChapterConfig | null
  activeChapterIndex: number
  setActiveChapterIndex: (index: number) => void
  goToNextChapter: () => void
  goToPrevChapter: () => void
  setActiveModule: (module: string | null) => void
}

const ReadingStoreContext = createContext<ReadingStoreContextType | undefined>(undefined)

export function ReadingStoreProvider({ children }: { children: ReactNode }) {
  const [activeChapterIndex, setActiveChapterIndexRaw] = useState(0)
  const [activeModule, setActiveModule] = useState<string | null>(null)

  const setActiveChapterIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(CHAPTERS.length - 1, index))
    setActiveChapterIndexRaw(clamped)
  }, [])

  const goToNextChapter = useCallback(() => {
    setActiveChapterIndexRaw((prev) => Math.min(CHAPTERS.length - 1, prev + 1))
  }, [])

  const goToPrevChapter = useCallback(() => {
    setActiveChapterIndexRaw((prev) => Math.max(0, prev - 1))
  }, [])

  const activeChapterConfig = useMemo(() => CHAPTERS[activeChapterIndex] ?? null, [activeChapterIndex])
  const activeChapterId = activeChapterConfig?.id ?? null
  const activeSection = activeChapterConfig?.sectionId ?? null

  return (
    <ReadingStoreContext.Provider
      value={{
        activeSection,
        activeModule,
        activeChapterId,
        activeChapterConfig,
        activeChapterIndex,
        setActiveChapterIndex,
        goToNextChapter,
        goToPrevChapter,
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
