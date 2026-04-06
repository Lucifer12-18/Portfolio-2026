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
import { ModalProvider, useModal } from "@/contexts/modal-context"
import { ProjectModal } from "@/components/project-modal"
import { formationWatchRef } from "@/lib/formation-state"

// ── CRT module IDs shown during transition ────────────────────────────────────
const MODULE_IDS = [
  "MODULE_00_PROLOGUE",
  "MODULE_01_ORIGIN",
  "MODULE_02_SHIFT",
  "MODULE_03_METHOD",
  "MODULE_04_WORK",
  "MODULE_05_NOTES",
  "MODULE_06_EPILOGUE",
]

const PersistentScene = dynamic(() => import("@/components/persistent-scene"), { ssr: false })
const ForegroundParticles = dynamic(() => import("@/components/foreground-particles"), { ssr: false })

const ACCENT_COLORS = [
  { r: 34, g: 211, b: 238 },
  { r: 6, g: 182, b: 212 },
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

// ── Particle formation IDs — mirror the GLSL shape names ────────────────────
// Using the actual formation names creates coherence: the status line speaks
// the same language as the 3D engine. A detail only a designer would notice.
const FORMATION_IDS = [
  "fibonacci_sphere",
  "double_helix",
  "torus",
  "trefoil_knot",
  "crystal_lattice",
  "wave_surface",
  "starburst",
]

// ── Formation watch timing ────────────────────────────────────────────────────
//
// After the old content exits (~380ms), we open a "formation watch window"
// before the new content enters. During this window the particle field is
// completely exposed and the viewer can watch the 3D formation build itself.
//
// EXIT_DURATION_MS   — how long the exit animation takes (matches exit.transition.duration)
// FORMATION_WATCH_MS — how long to hold the naked particle field
// ENTER_DELAY_MS     — total delay from chapter-change to content-enter start
//
const EXIT_DURATION_MS   = 380
const FORMATION_WATCH_MS = 2600
const ENTER_DELAY_MS     = EXIT_DURATION_MS + FORMATION_WATCH_MS   // 2 980 ms

// ── Luminous burst — the cinematic connector between 2D and 3D ───────────────
//
// When a chapter fires, this component erupts from the center of the viewport
// as a radial surge in the target chapter's accent color — the same color the
// 3D particle bloom is simultaneously surging to.
//
// For the first time, the content layer and the 3D layer are doing the same
// thing, at the same moment. That synchronisation is what makes it feel like
// ONE immersive system instead of two unrelated animations layered on top of
// each other.
//
// The burst expands outward (scale 0.3 → 1.8) as it fades, like energy
// radiating from an explosion rather than a static glow — this gives it
// physical weight and direction.
function LuminousBurst() {
  const { activeChapterIndex } = useReadingStore()
  const [color, setColor] = useState<{ r: number; g: number; b: number } | null>(null)
  const [key, setKey] = useState(0)
  const prevIdx = useRef(activeChapterIndex)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (activeChapterIndex === prevIdx.current) return
    prevIdx.current = activeChapterIndex
    if (timer.current) clearTimeout(timer.current)

    setColor(ACCENT_COLORS[activeChapterIndex] ?? ACCENT_COLORS[0])
    setKey(k => k + 1)
    timer.current = setTimeout(() => setColor(null), 1400)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [activeChapterIndex])

  if (!color) return null
  const { r, g, b } = color

  return (
    <motion.div
      key={key}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 8 }}
      aria-hidden
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{
        opacity: [0, 0.55, 0.22, 0],
        scale:   [0.3, 1.0, 1.4, 1.9],
      }}
      transition={{
        duration: 1.4,
        times: [0, 0.22, 0.55, 1],
        ease: "easeOut",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 75% 65% at 50% 52%,
            rgba(${r},${g},${b},1)    0%,
            rgba(${r},${g},${b},0.55) 28%,
            rgba(${r},${g},${b},0.18) 55%,
            transparent 72%)`,
        }}
      />
    </motion.div>
  )
}

// ── Particle system status — lives at the bottom of the content frame ────────
// Reads the formation ID currently being computed in the 3D engine.
// Never blocks anything; just a quiet pulse of system language.
function ParticleSystemStatus() {
  const { activeChapterIndex } = useReadingStore()
  const [status, setStatus] = useState<string | null>(null)
  const prevIdx = useRef(activeChapterIndex)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (activeChapterIndex === prevIdx.current) return
    prevIdx.current = activeChapterIndex
    timers.current.forEach(clearTimeout)

    const formation = FORMATION_IDS[activeChapterIndex] ?? "fibonacci_sphere"
    setStatus(`compiling.${formation}`)
    // Switch to "render.complete" 680ms before the content enters so it
    // reads as a countdown — then let it linger 400ms into the enter so
    // it feels like the content is assembling from the completed formation.
    const t1 = setTimeout(() => setStatus("render.complete"), ENTER_DELAY_MS - 680)
    const t2 = setTimeout(() => setStatus(null),              ENTER_DELAY_MS + 400)
    timers.current = [t1, t2]
    return () => timers.current.forEach(clearTimeout)
  }, [activeChapterIndex])

  return (
    <AnimatePresence mode="wait">
      {status && (
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none select-none"
          aria-hidden
        >
          <span style={{
            fontFamily: "'JetBrains Mono','Fira Code',monospace",
            fontSize: 9,
            letterSpacing: "0.13em",
            color: status === "render.complete"
              ? "rgba(34,211,238,0.6)"
              : "rgba(34,211,238,0.28)",
          }}>
            ▸ {status}{status !== "render.complete" && <span className="crt-cursor" />}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Chapter transition variants ───────────────────────────────────────────────
//
// The design principle: content is made of the same energy as the particles.
//
// EXIT  (0.38s) — implosion:
//   Content contracts toward its own center via clip-path while brightness
//   flares to white. Reads as: "chapter energy returning to the field."
//   The simultaneous LuminousBurst erupts from the same center point —
//   visually the content IS collapsing INTO the particle burst.
//
// ENTER (0.72s) — emergence:
//   Content expands outward from the center of the burst, starting completely
//   desaturated (grey, like raw particle matter) and saturating into full
//   color as it "compiles." The brightness starts high (2×) to blend with
//   the fading burst, then resolves to 1. Content and burst feel continuous.
//
// Together: content implodes → light erupts → new content emerges from light.
// The 3D morph happens through the whole sequence; both layers tell the same story.
const pageFlipVariants = {
  initial: {
    opacity: 0,
    clipPath: "inset(32% 28% 32% 28% round 8px)",
    filter: "blur(18px) brightness(3.2) saturate(0)",
    scale: 1.02,
  },
  animate: {
    opacity: 1,
    clipPath: "inset(0% 0% 0% 0% round 0px)",
    filter: "blur(0px) brightness(1) saturate(1)",
    scale: 1,
    transition: {
      duration: 0.72,
      ease: [0.16, 1, 0.3, 1] as const,
      clipPath: { duration: 0.68, ease: [0.22, 1, 0.36, 1] as const },
      filter:   { duration: 0.62, delay: 0.06, ease: [0.25, 1, 0.4, 1] as const },
      opacity:  { duration: 0.42, delay: 0.06 },
      scale:    { duration: 0.72, ease: [0.16, 1, 0.3, 1] as const },
    },
  },
  exit: {
    opacity: 0,
    clipPath: "inset(32% 28% 32% 28% round 8px)",
    filter: "blur(14px) brightness(3.5) saturate(0)",
    scale: 0.96,
    transition: {
      duration: 0.38,
      ease: [0.88, 0, 1, 0] as const,
      clipPath: { duration: 0.34 },
    },
  },
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

  // ── Formation-watch pattern ───────────────────────────────────────────────
  //
  // displayedIndex    — which chapter's content is currently rendered.
  //                     Lags behind activeChapterIndex during transitions.
  //
  // isWatching        — true during the formation-watch window.
  //                     When true, the content motion.div is absent from the
  //                     React tree, so AnimatePresence plays the exit animation
  //                     and the viewport becomes entirely the 3D particle field.
  //
  // targetIndexRef    — always holds the latest activeChapterIndex so the
  //                     setTimeout callback resolves rapid changes correctly.
  //
  // displayedIndexRef — ref mirror of displayedIndex state; used inside the
  //                     effect to compare WITHOUT adding displayedIndex to deps
  //                     (avoids feedback loops) and without stale-closure risk.
  //                     This also correctly handles React Strict Mode's double-
  //                     invoke: both runs see the same stale/equal indices so
  //                     the guard fires and we skip — no phantom watch window
  //                     on first mount.
  //
  const [displayedIndex, setDisplayedIndex] = useState(activeChapterIndex)
  const [isWatching,     setIsWatching]     = useState(false)
  const enterTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const targetIndexRef     = useRef(activeChapterIndex)
  const displayedIndexRef  = useRef(activeChapterIndex)   // mirrors displayedIndex state

  // Keep both refs live on every render
  targetIndexRef.current    = activeChapterIndex
  displayedIndexRef.current = displayedIndex

  useEffect(() => {
    // Guard: skip if there is no real chapter change.
    // - Fires correctly on first mount  (displayedIndex === activeChapterIndex)
    // - Fires correctly on React Strict Mode double-invoke (same values, same check)
    // - Only runs the watch logic when the user actually navigates to a new chapter
    if (displayedIndexRef.current === activeChapterIndex) return

    // 1. Unmount current content → AnimatePresence fires the exit variant.
    //    Signal the 3D scene to switch into showcase-rotation mode.
    setIsWatching(true)
    formationWatchRef.current = true

    // 2. Clear any pending enter timer (handles rapid chapter-changes cleanly —
    //    the timer always resolves to the LATEST targetIndexRef.current)
    if (enterTimerRef.current) clearTimeout(enterTimerRef.current)

    // 3. After exit (380ms) + formation-watch window (2600ms) → mount new content
    enterTimerRef.current = setTimeout(() => {
      formationWatchRef.current = false            // back to normal rotation before content enters
      setDisplayedIndex(targetIndexRef.current)   // React 18 batches these two
      setIsWatching(false)                         // into one render — no flash
    }, ENTER_DELAY_MS)

    return () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current)
    }
  }, [activeChapterIndex])

  // ── Keyboard navigation ───────────────────────────────────────────────────
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

  // ── Swipe support for mobile ──────────────────────────────────────────────
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

  // Render the chapter that is currently displayed (not the newly active one)
  const DisplayedComponent = CHAPTER_COMPONENTS[displayedIndex]

  return (
    <div
      className="relative min-w-0 w-full h-[calc(100vh-220px)] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Particle system status — "▸ compiling.torus" → "▸ render.complete" */}
      <ParticleSystemStatus />

      <AnimatePresence mode="wait">
        {/* Content is absent (isWatching=true) during the formation-watch window.
            AnimatePresence sees the removal and fires the exit variant on the
            outgoing motion.div, then holds the empty slot until isWatching flips
            back and the new key mounts with the enter variant. */}
        {!isWatching && (
          <motion.div
            key={displayedIndex}
            variants={pageFlipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 pt-3 pb-8"
          >
            <DisplayedComponent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page indicator dots (mobile) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden z-20">
        {CHAPTERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveChapterIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === activeChapterIndex
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

function PageLevelModal() {
  const { project, isOpen, closeModal } = useModal()
  return <ProjectModal project={project} isOpen={isOpen} onClose={closeModal} />
}

export default function Home() {
  const [bootScreenDismissed, setBootScreenDismissed] = useState(false)

  return (
    <SystemLogProvider>
      <ReadingStoreProvider>
        <ViewModeProvider>
          <ModalProvider>
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

              {/* Luminous burst — fires on chapter change, syncs with particle bloom */}
              <LuminousBurst />

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

            {/* Modal rendered at page-level, OUTSIDE the perspective container */}
            <PageLevelModal />
          </ModalProvider>
        </ViewModeProvider>
      </ReadingStoreProvider>
    </SystemLogProvider>
  )
}
