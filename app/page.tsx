"use client"

import { useState, useEffect, useCallback, useRef, type ComponentType } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { OpeningHero } from "@/components/opening-hero"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { CapabilitiesSection } from "@/components/capabilities-section"
import { WorkSection } from "@/components/work-section"
import { ProcessSection } from "@/components/process-section"
import { NotesSection } from "@/components/notes-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { SystemLogConsole } from "@/components/system-log-console"
import { ChapterRail } from "@/components/chapter-rail"
import { ViewModeProvider } from "@/contexts/view-mode-context"
import { SystemLogProvider } from "@/contexts/system-log-context"
import { ReadingStoreProvider, useReadingStore } from "@/contexts/reading-store-context"
import { CHAPTERS } from "@/lib/chapters-config"

const PersistentScene = dynamic(() => import("@/components/persistent-scene"), { ssr: false })
const ForegroundParticles = dynamic(() => import("@/components/foreground-particles"), { ssr: false })

const ACCENT_COLORS = [
  { r: 34, g: 211, b: 238 },
  { r:  6, g: 182, b: 212 },
  { r: 124, g: 58, b: 237 },
  { r: 167, g: 139, b: 250 },
  { r: 56, g: 189, b: 248 },
  { r: 147, g: 197, b: 253 },
  { r: 224, g: 249, b: 255 },
]

const CHAPTER_COMPONENTS: ComponentType[] = [
  HeroSection,
  AboutSection,
  CapabilitiesSection,
  ProcessSection,
  WorkSection,
  NotesSection,
  ContactSection,
]

const pageFlipVariants = {
  initial: (direction: number) => ({
    rotateY: direction > 0 ? 85 : -85,
    rotateX: direction > 0 ? 5 : -5,
    skewY: direction > 0 ? -3 : 3,
    scale: 0.88,
    opacity: 0,
    x: direction > 0 ? "6%" : "-6%",
    z: -80,
    transformOrigin: direction > 0 ? "left center" : "right center",
  }),
  animate: {
    rotateY: 0,
    rotateX: 0,
    skewY: 0,
    scale: 1,
    opacity: 1,
    x: "0%",
    z: 0,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as const,
      opacity: {
        duration: 0.6,
        delay: 1.8,
        ease: "easeOut",
      },
      delay: 1.8,
    },
  },
  exit: (direction: number) => ({
    rotateY: direction > 0 ? -85 : 85,
    rotateX: direction > 0 ? -5 : 5,
    skewY: direction > 0 ? 3 : -3,
    scale: 0.88,
    opacity: 0,
    x: direction > 0 ? "-6%" : "6%",
    z: -80,
    transformOrigin: direction > 0 ? "left center" : "right center",
    transition: {
      duration: 0.9,
      ease: [0.55, 0.06, 0.68, 0.19] as const,
      opacity: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  }),
}

function GradientOverlay() {
  const { activeChapterIndex } = useReadingStore()
  const c = ACCENT_COLORS[activeChapterIndex] ?? ACCENT_COLORS[0]

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
      animate={{
        background: `radial-gradient(ellipse at 50% 30%, rgba(${c.r},${c.g},${c.b},0.06) 0%, transparent 65%)`,
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  )
}

function PageFlipContainer() {
  const { activeChapterIndex, goToNextChapter, goToPrevChapter, setActiveChapterIndex } = useReadingStore()
  const prevIndexRef = useRef(activeChapterIndex)
  const direction =
    activeChapterIndex > prevIndexRef.current ? 1
    : activeChapterIndex < prevIndexRef.current ? -1
    : 0

  useEffect(() => {
    prevIndexRef.current = activeChapterIndex
  })

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        goToNextChapter()
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        goToPrevChapter()
      }
    },
    [goToNextChapter, goToPrevChapter],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart === null) return
      const diff = touchStart - e.changedTouches[0].clientX
      const threshold = 60
      if (diff > threshold) goToNextChapter()
      else if (diff < -threshold) goToPrevChapter()
      setTouchStart(null)
    },
    [touchStart, goToNextChapter, goToPrevChapter],
  )

  const ActiveComponent = CHAPTER_COMPONENTS[activeChapterIndex]

  return (
    <div
      className="relative min-w-0 w-full h-[calc(100vh-160px)] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 overflow-y-auto scrollbar-hide pt-4 pb-8">
        <div style={{ perspective: "1800px" }}>
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={activeChapterIndex}
              custom={direction}
              variants={pageFlipVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ transformStyle: "preserve-3d" }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Page indicator dots (mobile) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden z-20">
        {CHAPTERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveChapterIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeChapterIndex
                ? "w-6 bg-primary"
                : "w-1.5 bg-slate-600 hover:bg-slate-400"
            }`}
            aria-label={`Go to ${CHAPTERS[i].label}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [bootScreenDismissed, setBootScreenDismissed] = useState(false)

  return (
    <SystemLogProvider>
      <ReadingStoreProvider>
        <ViewModeProvider>
          <OpeningHero onDismiss={() => setBootScreenDismissed(true)} />

          <div
            className={bootScreenDismissed ? "" : "invisible pointer-events-none fixed inset-0 overflow-hidden"}
            aria-hidden={!bootScreenDismissed}
          >
            {/* Persistent 3D scene — fixed behind all content */}
            <div
              className="fixed inset-0 pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <PersistentScene />
            </div>

            {/* Index-reactive gradient overlay */}
            <GradientOverlay />

            {/* Foreground wisps — very subtle layer above content */}
            <div
              className="fixed inset-0 pointer-events-none"
              style={{ zIndex: 3 }}
            >
              <ForegroundParticles />
            </div>

            {/* All content above the 3D background */}
            <div className="relative bg-transparent h-screen overflow-hidden" style={{ zIndex: 2 }}>
              <Navbar />
              <main
                className="mx-auto w-full max-w-[1440px] lg:max-w-[1680px] px-6 lg:px-4
                 lg:grid lg:grid-cols-[220px_1fr_360px] lg:gap-7 h-[calc(100vh-160px)]"
              >
                {/* Left column: sticky ChapterRail */}
                <div className="hidden lg:block">
                  <div className="sticky top-0 h-full min-h-0 flex items-center justify-center">
                    <div className="w-full max-h-full overflow-y-auto pb-4">
                      <ChapterRail />
                    </div>
                  </div>
                </div>

                {/* Middle column: single page at a time with flip animation */}
                <PageFlipContainer />

                {/* Right column: SystemLogConsole */}
                <div className="hidden lg:block min-w-0">
                  <div className="sticky top-0 self-start z-40">
                    <div className="pt-6 flex justify-end">
                      <SystemLogConsole />
                    </div>
                  </div>
                </div>
              </main>

              {/* Footer pinned at bottom */}
              <div className="absolute bottom-0 left-0 right-0">
                <Footer />
              </div>
            </div>
          </div>
        </ViewModeProvider>
      </ReadingStoreProvider>
    </SystemLogProvider>
  )
}
