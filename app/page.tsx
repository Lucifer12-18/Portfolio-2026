"use client"

import { useState, useEffect, useCallback, useRef, useSyncExternalStore, type ComponentType } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
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
import { CHAPTERS, sectionIdToChapterIndex } from "@/lib/chapters-config"
import { ModalProvider, useModal } from "@/contexts/modal-context"
import { ProjectModal } from "@/components/project-modal"
import { CursorEffect } from "@/components/cursor-effect"
import { FilmGrain } from "@/components/film-grain"
import { CinematicIntro } from "@/components/cinematic-intro"
import { formationWatchRef, skipTransitionRef } from "@/lib/formation-state"
import { EASE_SETTLE } from "@/lib/motion"
import { useReducedMotion, prefersReducedMotion } from "@/lib/use-reduced-motion"
import { PointerProvider, PointerParallax } from "@/contexts/pointer-context"
import { FormationTelemetry } from "@/components/formation-telemetry"
import { NowPanel } from "@/components/now-panel"
import { ChapterTint } from "@/components/chapter-tint"
import { sfx } from "@/lib/sound"
import { interlude } from "@/lib/interlude"
import { tour } from "@/lib/tour"
import { Briefing } from "@/components/briefing"
import { CHAPTER_ACCENTS as ACCENT_COLORS, FORMATION_IDS } from "@/lib/chapter-palette"

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

const CHAPTER_COMPONENTS: ComponentType[] = [
  HeroSection,
  AboutSection,
  CapabilitiesSection,
  ProcessSection,
  WorkSection,
  NotesSection,
  ContactSection,
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

// The luminous burst is no longer a quick early spike — it's a SUSTAINED surge
// that rises with the content implosion and holds through the particle scatter
// peak (the field's bloom peaks mid-transition, ~1.6s), so 2D burst + 3D bloom
// read as one light event rather than two. ~2.2s spans implosion→scatter→reform.
const BURST_MS           = 2200

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
  const reduced = useReducedMotion()
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
    timer.current = setTimeout(() => setColor(null), BURST_MS)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [activeChapterIndex])

  // Reduced motion: the burst is a full-viewport brightness flash — skip it.
  if (reduced || !color) return null
  const { r, g, b } = color

  return (
    <motion.div
      key={key}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 8 }}
      aria-hidden
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{
        // Bell-shaped surge (rise → hold through scatter peak → long fade) that
        // mirrors the field bloom's sin(progress·π) envelope — one light event.
        opacity: [0, 0.3, 0.34, 0.14, 0],
        scale:   [0.3, 0.9, 1.4, 1.8, 2.1],
      }}
      transition={{
        duration: BURST_MS / 1000,
        times: [0, 0.18, 0.45, 0.72, 1],
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

    // Instant paths (deep-link jump / reduced motion): the full-length
    // "compiling…" countdown would appear AFTER the content did. This child's
    // effect runs before PageFlipContainer consumes skipTransitionRef.
    if (skipTransitionRef.current || prefersReducedMotion()) return

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
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.04em",
              color: status === "render.complete" ? "rgba(242,241,236,0.7)" : "rgba(242,241,236,0.35)",
            }}
          >
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
    // Contracts harder toward its own centre as it flares white — content
    // visibly FEEDS the LuminousBurst erupting from the same point (B9).
    scale: 0.9,
    transition: {
      duration: 0.38,
      ease: [0.88, 0, 1, 0] as const,
      clipPath: { duration: 0.34 },
    },
  },
}

// ── Reduced-motion transition — WCAG accommodation ───────────────────────────
// Users with OS "reduce motion" get a quick opacity crossfade instead of the
// implosion/burst/watch-window choreography: no clip-path contraction, no
// brightness flashes, no 3s exposure gap. Everyone else is unchanged.
const reducedFadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
}
const REDUCED_ENTER_DELAY_MS = 200

// Interface pigment follows the reader — same index that drives the field.
function ChapterAccent() {
  const { activeChapterIndex } = useReadingStore()
  return <ChapterTint index={activeChapterIndex} />
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
        background: `radial-gradient(ellipse at 50% 30%, rgba(${c.r},${c.g},${c.b},0.09) 0%, transparent 65%)`,
      }}
      transition={{ duration: 1.2, ease: EASE_SETTLE }}
    />
  )
}

function PageFlipContainer() {
  const { activeChapterIndex, goToNextChapter, goToPrevChapter, setActiveChapterIndex } = useReadingStore()
  const { isOpen: modalIsOpen } = useModal()
  const reduced = useReducedMotion()

  // Ref mirrors so stable callbacks/effects read fresh values without re-binding
  const modalOpenRef = useRef(modalIsOpen)
  modalOpenRef.current = modalIsOpen
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced

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
  // Content mounts only after the mount effect resolved any hash deep-link, so
  // a /#chapter-4 visit renders Work as the FIRST child AnimatePresence ever
  // sees — no chapter-0 flash, no interrupted enter, no hydration mismatch
  // (server and first client render both show an empty slot).
  const [hydrated,       setHydrated]       = useState(false)
  const enterTimerRef      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const targetIndexRef     = useRef(activeChapterIndex)
  const displayedIndexRef  = useRef(activeChapterIndex)   // mirrors displayedIndex state

  // Keep both refs live on every render
  targetIndexRef.current    = activeChapterIndex
  displayedIndexRef.current = displayedIndex

  // ── Hash deep-links (#chapter-4 etc.) ─────────────────────────────────────
  // Mount: resolve the hash BEFORE content ever mounts — both indices update in
  // the same batch as setHydrated, so the landed chapter is AnimatePresence's
  // first child (idempotent under Strict Mode's double-invoke).
  // In-page hash navigation afterwards (e.g. a Link to /#chapter-5) goes
  // through the quick unmount-gap flow via skipTransitionRef.
  useEffect(() => {
    if (typeof window === "undefined") return
    const idx = sectionIdToChapterIndex(window.location.hash)
    if (idx >= 0) {
      setActiveChapterIndex(idx)
      setDisplayedIndex(idx)
    }
    setHydrated(true)

    const onHashChange = () => {
      const i = sectionIdToChapterIndex(window.location.hash)
      if (i >= 0 && i !== displayedIndexRef.current) {
        skipTransitionRef.current = true
        setActiveChapterIndex(i)
      }
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [setActiveChapterIndex])

  useEffect(() => {
    // Guard: skip if there is no real chapter change.
    // - Fires correctly on first mount  (displayedIndex === activeChapterIndex)
    // - Fires correctly on React Strict Mode double-invoke (same values, same check)
    // - Only runs the watch logic when the user actually navigates to a new chapter
    if (displayedIndexRef.current === activeChapterIndex) return

    if (enterTimerRef.current) clearTimeout(enterTimerRef.current)

    // Instant jump (hash deep-link) and reduced motion both reuse the SAME
    // unmount-gap flow as the full transition (absent → remount) — the one
    // path AnimatePresence mode="wait" handles reliably. Swapping the child
    // key directly (without the gap) can wedge its exit bookkeeping forever.
    // Jump ≈ one frame; reduced motion ≈ 200ms crossfade.
    if (skipTransitionRef.current || reducedRef.current) {
      const gap = skipTransitionRef.current ? 30 : REDUCED_ENTER_DELAY_MS
      skipTransitionRef.current = false
      setIsWatching(true)
      enterTimerRef.current = setTimeout(() => {
        setDisplayedIndex(targetIndexRef.current)
        setIsWatching(false)
      }, gap)
      return () => {
        if (enterTimerRef.current) clearTimeout(enterTimerRef.current)
      }
    }

    // 1. Unmount current content → AnimatePresence fires the exit variant.
    //    Signal the 3D scene to switch into showcase-rotation mode, and score
    //    the window (inhale → bloom → compile → land, pitched per chapter).
    setIsWatching(true)
    formationWatchRef.current = true
    sfx.transition(activeChapterIndex)

    // 2. After exit (380ms) + formation-watch window (2600ms) → mount new content.
    //    The timer always resolves to the LATEST targetIndexRef.current, which
    //    handles rapid chapter-changes cleanly.
    enterTimerRef.current = setTimeout(() => {
      formationWatchRef.current = false            // back to normal rotation before content enters
      setDisplayedIndex(targetIndexRef.current)   // React 18 batches these two
      setIsWatching(false)                         // into one render — no flash
    }, ENTER_DELAY_MS)

    return () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current)
    }
  }, [activeChapterIndex])

  // ── Hash sync — keep the URL shareable ────────────────────────────────────
  // replaceState only (no history spam); clean "/" for the prologue. Never
  // writes while a deep-link jump is pending or a transition is in flight —
  // otherwise the mount-time sync (displayedIndex still 0) would wipe the
  // very hash the jump effect is about to consume.
  useEffect(() => {
    if (typeof window === "undefined") return
    if (skipTransitionRef.current || displayedIndex !== targetIndexRef.current) return
    const id = CHAPTERS[displayedIndex]?.sectionId
    if (!id) return
    const target = displayedIndex === 0 ? "" : `#${id}`
    if (window.location.hash === target || (target === "" && !window.location.hash)) return
    history.replaceState(null, "", target === "" ? window.location.pathname + window.location.search : target)
  }, [displayedIndex])

  // ── Keyboard navigation ───────────────────────────────────────────────────
  // Arrows flip chapters ONLY when nothing else owns them: no modifier keys,
  // no open modal, and focus is on <body> (or inside the chapter nav). When a
  // scroll region / control is focused, arrows do their native thing — this is
  // what lets keyboard users scroll the chapter window (WindowShell is focusable).
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isArrow =
        e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowLeft"
      if (!isArrow) return
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      if (modalOpenRef.current) return
      if (interlude.isOpen()) return // the game owns the keyboard while open
      if (tour.isOpen()) return // so does the briefing
      const ae = document.activeElement as HTMLElement | null
      const inChapterNav = !!ae?.closest?.("[data-chapter-nav]")
      if (ae && ae !== document.body && !inChapterNav) return

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        goToNextChapter()
      } else {
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
      className="relative min-w-0 w-full h-full min-h-0 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Particle system status — "▸ compiling.torus" → "▸ render.complete" */}
      <ParticleSystemStatus />

      {/* Formation telemetry — diegetic HUD over the exposed field during the
          watch window. Shows the DESTINATION chapter's formation + accent.
          (Skipped under reduced motion — there is no watch window to instrument.) */}
      <FormationTelemetry
        active={isWatching && !reduced}
        accent={ACCENT_COLORS[activeChapterIndex] ?? ACCENT_COLORS[0]}
        formation={FORMATION_IDS[activeChapterIndex] ?? "fibonacci_sphere"}
        durationMs={ENTER_DELAY_MS}
      />

      {/* Chapter-change announcement for screen readers — persistent node
          OUTSIDE AnimatePresence so it never unmounts mid-announcement. */}
      <div aria-live="polite" className="sr-only">
        {!isWatching ? CHAPTERS[displayedIndex]?.fullLabel : ""}
      </div>

      {/* Default mode (not "wait"): sequencing is already enforced by the
          isWatching gap (exit → empty window → enter), children are absolutely
          positioned so rare overlaps crossfade cleanly — and mode="wait" has a
          failure mode where an exit interrupting a just-started enter loses its
          completion callback and wedges the slot forever (blank chapter). */}
      <AnimatePresence>
        {/* Content is absent (isWatching=true) during the formation-watch window.
            AnimatePresence sees the removal and fires the exit variant on the
            outgoing motion.div, then mounts the next key whenever it appears. */}
        {hydrated && !isWatching && (
          <motion.div
            key={displayedIndex}
            variants={reduced ? reducedFadeVariants : pageFlipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 pt-3 pb-8"
          >
            <DisplayedComponent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page indicator dots (mobile) — padded buttons so tap targets are ≥24px
          while the visual dot stays small. data-chapter-nav keeps arrow-key
          chapter flipping active while a dot is focused. */}
      <nav
        aria-label="Chapters"
        data-chapter-nav
        data-tour="dots"
        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex lg:hidden z-20"
      >
        {CHAPTERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveChapterIndex(i)}
            className="flex items-center justify-center p-2.5"
            aria-label={`Go to ${CHAPTERS[i].label}`}
            aria-current={i === activeChapterIndex ? "true" : undefined}
          >
            <span
              aria-hidden
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeChapterIndex
                ? "w-6 bg-chapter"
                : "w-1.5 bg-bone-4 hover:bg-bone-3"
                }`}
            />
          </button>
        ))}
      </nav>
    </div>
  )
}

function PageLevelModal() {
  const { project, isOpen, closeModal } = useModal()
  return <ProjectModal project={project} isOpen={isOpen} onClose={closeModal} />
}

export default function Home() {
  const [cinematicDone, setCinematicDone]     = useState(false)
  // While Clarity is open the 3D field pauses (the game gets the GPU) and the
  // custom cursor steps aside (the lens IS the cursor).
  const playing = useSyncExternalStore(interlude.subscribe, interlude.isOpen, () => false)
  const [bootScreenDismissed, setBootScreenDismissed] = useState(false)

  // ── Unified gate logic ───────────────────────────────────────────────────
  // The cinematic intro + boot screen play ONCE PER SESSION. Skip both gates when:
  //   · this session already saw them (sessionStorage) — so "Back to home" from
  //     a case story never replays the ~16s sequence,
  //   · `?skipIntro` (persistent dev skip, localStorage),
  //   · the URL deep-links to a chapter (#chapter-4 …) — a recruiter following
  //     a link should land on the content, not a gate,
  //   · the visitor prefers reduced motion (the intro is heavy motion + flashes).
  // `?showIntro` clears the stored flags and forces the full sequence.
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.has("showIntro")) {
      try {
        window.localStorage.removeItem("skipIntro")
        window.sessionStorage.removeItem("plx.introSeen")
      } catch {}
      return
    }
    let skip = false
    try {
      if (params.has("skipIntro")) window.localStorage.setItem("skipIntro", "1")
      skip =
        params.has("skipIntro") ||
        window.localStorage.getItem("skipIntro") === "1" ||
        window.sessionStorage.getItem("plx.introSeen") === "1" ||
        sectionIdToChapterIndex(window.location.hash) >= 0 ||
        prefersReducedMotion()
    } catch {
      skip = prefersReducedMotion()
    }
    if (skip) {
      setCinematicDone(true)
      setBootScreenDismissed(true)
      try {
        window.sessionStorage.setItem("plx.introSeen", "1")
      } catch {}
    }
  }, [])

  const handleBootDismiss = useCallback(() => {
    setBootScreenDismissed(true)
    // Mark the gates as seen for this session — returning to "/" won't replay them.
    try {
      window.sessionStorage.setItem("plx.introSeen", "1")
    } catch {}
  }, [])

  return (
    <MotionConfig reducedMotion="user">
    <SystemLogProvider>
      <ReadingStoreProvider>
        <ViewModeProvider>
          <ModalProvider>
            {/* Skip link — first focusable element; critical since the custom
                cursor hides the pointer and the navbar/rail precede content. */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[10000] focus:rounded-md focus:border focus:border-hair-3 focus:bg-ink-1 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bone"
            >
              Skip to content
            </a>

            {/* Document h1 — chapters render their visible headings as h2 */}
            <h1 className="sr-only">Vishal Deshmukh, Product Designer · Pixelogic OS</h1>

            {/* ── Cinematic intro — z-[9999] overlay, covers OpeningHero until done ── */}
            {!cinematicDone && (
              <CinematicIntro onComplete={() => setCinematicDone(true)} />
            )}

            {/* Boot screen — unmounts once dismissed (or when gates are skipped:
                session flag, deep link, ?skipIntro, reduced motion) */}
            {!bootScreenDismissed && <OpeningHero onDismiss={handleBootDismiss} />}

            <PointerProvider>
            <div
              className={bootScreenDismissed ? "" : "invisible pointer-events-none fixed inset-0 overflow-hidden"}
              aria-hidden={!bootScreenDismissed}
            >
              {/* Persistent 3D scene — fixed behind all content. Decorative
                  (aria-hidden); its frame loop pauses while the boot gate hides it. */}
              <div
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 1 }}
                aria-hidden
              >
                <PersistentScene active={bootScreenDismissed && !playing} />
              </div>

              {/* Index-reactive gradient overlay + the interface pigment */}
              <GradientOverlay />
              <ChapterAccent />

              {/* Luminous burst — fires on chapter change, syncs with particle bloom */}
              <LuminousBurst />

              {/* Foreground wisps — very subtle layer above content */}
              <div
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 3 }}
                aria-hidden
              >
                <ForegroundParticles active={bootScreenDismissed && !playing} />
              </div>

              {/* All content above the 3D background — flex column so navbar /
                  content / footer resolve their heights at ANY viewport size
                  (no fragile magic-number calc heights). */}
              <div className="relative bg-transparent h-[100svh] overflow-hidden flex flex-col" style={{ zIndex: 2 }}>
                <Navbar />
                <main
                  className="mx-auto w-full max-w-[1440px] lg:max-w-[1680px] px-6 lg:px-4
                 flex-1 min-h-0 flex flex-col
                 lg:grid lg:grid-cols-[184px_1fr] xl:grid-cols-[184px_1fr_300px] 2xl:grid-cols-[200px_1fr_340px] lg:gap-6 2xl:gap-8"
                >
                  {/* Left column: sticky ChapterRail — subtlest parallax depth.
                      data-chapter-nav keeps arrow-key flipping active while a
                      rail button is focused. */}
                  <PointerParallax strength={2} className="hidden lg:block">
                    <div className="sticky top-0 h-full min-h-0 flex items-center" data-chapter-nav>
                      <div className="w-full max-h-full overflow-y-auto pb-4 scrollbar-hide">
                        <ChapterRail />
                      </div>
                    </div>
                  </PointerParallax>

                  {/* Middle column: single page at a time with flip animation.
                      flex-1 fills the column on mobile (flex-col main); on lg the
                      grid stretches it. id="main-content" is the skip-link target. */}
                  <PointerParallax strength={5} className="min-w-0 flex-1 min-h-0">
                    <div id="main-content" tabIndex={-1} className="h-full min-h-0 outline-none">
                      <PageFlipContainer />
                    </div>
                  </PointerParallax>

                  {/* Right column: Now panel (résumé at a glance) + the live system
                      log — subtlest parallax depth, vertically centred like the rail */}
                  <PointerParallax strength={2} className="hidden xl:block min-w-0 min-h-0">
                    <div className="h-full min-h-0 flex flex-col justify-center gap-4 py-3 z-40">
                      <NowPanel />
                      <SystemLogConsole />
                    </div>
                  </PointerParallax>
                </main>

                {/* Footer — in flow at the bottom of the flex column */}
                <Footer />
              </div>
            </div>
            </PointerProvider>

            {/* First-visit briefing — waits for the boot gates, then plays once */}
            <Briefing ready={bootScreenDismissed && cinematicDone} />

            {/* Modal rendered at page-level, OUTSIDE the perspective container */}
            <PageLevelModal />

            {/* Custom cursor — always on top, chapter-color reactive */}
            <CursorEffect hidden={playing} />

            {/* Cinematic film grain — sits above scene, below cursor */}
            <FilmGrain />
          </ModalProvider>
        </ViewModeProvider>
      </ReadingStoreProvider>
    </SystemLogProvider>
    </MotionConfig>
  )
}
