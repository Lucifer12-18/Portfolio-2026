"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ── Types ─────────────────────────────────────────────────────────────────────
type WordStyle = "muted" | "normal" | "emphasis" | "hero" | "cyan" | "strike"

interface SceneWord {
  text: string
  style: WordStyle
}

interface Scene {
  startAt: number        // ms from audio start when this scene appears
  stagger: number        // seconds between each word appearing
  lines: SceneWord[][]   // each inner array = one visual line
}

// ── Audio-locked scene timestamps (audio = 12.6s) ─────────────────────────────
//
// Each `startAt` is tuned to when Dylan Field speaks that phrase.
// Scenes transition via AnimatePresence — the exit animation (~220ms) overlaps
// with the gap before the next scene arrives.
//
const SCENES: Scene[] = [
  {
    // "Good enough is not enough."   ~0.0s – 1.7s
    startAt: 0,
    stagger: 0.10,
    lines: [
      [
        { text: "Good",   style: "muted" },
        { text: "enough", style: "muted" },
      ],
      [
        { text: "is",      style: "normal" },
        { text: "not",     style: "emphasis" },
        { text: "enough.", style: "emphasis" },
      ],
    ],
  },
  {
    // "It's mediocre."    ~1.8s – 2.7s
    startAt: 1750,
    stagger: 0.18,
    lines: [
      [{ text: "It's",      style: "muted" }],
      [{ text: "mediocre.", style: "hero" }],
    ],
  },
  {
    // "You gotta get to great"   ~2.8s – 4.1s
    startAt: 2750,
    stagger: 0.11,
    lines: [
      [
        { text: "You",   style: "muted" },
        { text: "gotta", style: "muted" },
        { text: "get",   style: "normal" },
        { text: "to",    style: "normal" },
      ],
      [{ text: "GREAT", style: "cyan" }],
    ],
  },
  {
    // "if you wanna win, preferably excellent."   ~4.2s – 5.8s
    startAt: 4150,
    stagger: 0.11,
    lines: [
      [
        { text: "if",    style: "muted" },
        { text: "you",   style: "muted" },
        { text: "wanna", style: "muted" },
        { text: "win,",  style: "muted" },
      ],
      [{ text: "preferably", style: "normal" }],
      [{ text: "EXCELLENT.", style: "hero"   }],
    ],
  },
  {
    // "If you wanna win in game of software"   ~5.9s – 7.4s
    startAt: 5900,
    stagger: 0.09,
    lines: [
      [
        { text: "If",        style: "muted" },
        { text: "you",       style: "muted" },
        { text: "wanna",     style: "muted" },
        { text: "win",       style: "muted" },
        { text: "in",        style: "muted" },
        { text: "game",      style: "normal" },
        { text: "of",        style: "normal" },
        { text: "software —", style: "normal" },
      ],
    ],
  },
  {
    // "you need to differentiate through design"   ~7.5s – 9.0s
    startAt: 7450,
    stagger: 0.10,
    lines: [
      [
        { text: "you",           style: "muted" },
        { text: "need",          style: "normal" },
        { text: "to",            style: "normal" },
        { text: "differentiate", style: "emphasis" },
      ],
      [
        { text: "through", style: "normal" },
        { text: "design.", style: "cyan" },
      ],
    ],
  },
  {
    // "and so we are no longer in this era of"   ~9.1s – 10.5s
    startAt: 9050,
    stagger: 0.20,  // slowed — deliberate, weighted build-up
    lines: [
      [
        { text: "we",     style: "muted" },
        { text: "are",    style: "muted" },
        { text: "no",     style: "muted" },
        { text: "longer", style: "muted" },
        { text: "in",     style: "muted" },
        { text: "this",   style: "muted" },
        { text: "era",    style: "muted" },
        { text: "of",     style: "muted" },
      ],
    ],
  },
  {
    // "good enough is fine."   ~10.5s – 12.3s
    startAt: 10500,
    stagger: 0.40,  // slowed — each struck word lands with heavy weight
    lines: [
      [
        { text: "good",   style: "strike" },
        { text: "enough", style: "strike" },
        { text: "is",     style: "strike" },
        { text: "fine.",  style: "strike" },
      ],
    ],
  },
]

const CREDIT_AT  = 13000  // ms — credit appears ~400ms after audio ends (12.6s)
const FADE_AT    = 16200  // ms — fade out after credit has 3.2s to breathe

// ── Style map ─────────────────────────────────────────────────────────────────
const WORD_CLASS: Record<WordStyle, string> = {
  muted:    "text-white/35 text-2xl sm:text-3xl font-light  font-display tracking-wide",
  normal:   "text-white/65 text-3xl sm:text-4xl font-normal font-display",
  emphasis: "text-white    text-4xl sm:text-5xl font-bold   font-display tracking-tight",
  hero:     "text-white    text-5xl sm:text-7xl lg:text-8xl font-black  font-display tracking-tighter leading-none",
  cyan:     "text-cyan-400 text-5xl sm:text-7xl lg:text-8xl font-black  font-display tracking-tighter leading-none",
  strike:   "text-white/50 text-3xl sm:text-5xl font-semibold font-display line-through decoration-white/40 decoration-[2px]",
}

// ── Framer variants ───────────────────────────────────────────────────────────
const sceneIn  = { opacity: 0 }
const sceneAni = { opacity: 1, transition: { duration: 0.28, ease: "easeOut" } }
const sceneOut = { opacity: 0, transition: { duration: 0.2,  ease: "easeIn"  } }

// wordDuration can be overridden per scene for the slow final stretch
const makeWordVariants = (wordDuration = 0.48) => ({
  hidden:  { opacity: 0, y: 22, filter: "blur(8px)" },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: wordDuration, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
})
const wordVariants        = makeWordVariants(0.48)
const wordVariantsSlow    = makeWordVariants(0.85)  // scenes 7 & 8 — heavier, slower reveal

// ── Component ─────────────────────────────────────────────────────────────────
interface CinematicIntroProps {
  onComplete: () => void
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase]       = useState<"waiting" | "playing" | "credit" | "fading" | "done">("waiting")
  const [sceneIdx, setSceneIdx] = useState(-1)
  const [visible, setVisible]   = useState(true)
  const audioRef                = useRef<HTMLAudioElement | null>(null)
  const fadeTimer               = useRef<ReturnType<typeof setTimeout> | null>(null)
  const creditTimer             = useRef<ReturnType<typeof setTimeout> | null>(null)
  const phaseRef                = useRef(phase)
  phaseRef.current              = phase

  const finish = useCallback(() => {
    if (fadeTimer.current)  clearTimeout(fadeTimer.current)
    if (creditTimer.current) clearTimeout(creditTimer.current)
    audioRef.current?.pause()
    setVisible(false)
    setTimeout(() => {
      setPhase("done")
      if (typeof window !== "undefined") sessionStorage.setItem("cinematic_seen", "1")
      onComplete()
    }, 900)
  }, [onComplete])

  const begin = useCallback(() => {
    if (phaseRef.current !== "waiting") return
    setPhase("playing")
    audioRef.current?.play().catch(() => {})
    // Safety net — auto-proceed if something goes wrong
    fadeTimer.current = setTimeout(finish, FADE_AT)
  }, [finish])

  // ── Audio-locked scene driver ─────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // timeupdate fires ~4× per second while audio plays — drives scene changes
    const onTimeUpdate = () => {
      if (phaseRef.current !== "playing") return
      const ms = audio.currentTime * 1000
      let active = -1
      for (let i = 0; i < SCENES.length; i++) {
        if (ms >= SCENES[i].startAt) active = i
      }
      setSceneIdx(active)
    }

    // onEnded fires when audio finishes — triggers credit then auto-proceeds
    // (timeupdate stops after audio ends so we can't rely on it for CREDIT_AT)
    const onEnded = () => {
      if (phaseRef.current !== "playing") return
      setSceneIdx(-1)
      // Small breath after audio ends, then show credit
      creditTimer.current = setTimeout(() => {
        setPhase("credit")
        // Auto-proceed after credit has had its moment — no click needed
        fadeTimer.current = setTimeout(finish, 3200)
      }, 400)
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("ended", onEnded)
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("ended", onEnded)
    }
  }, [finish])

  const skip = useCallback(() => {
    if (phaseRef.current === "waiting" || phaseRef.current === "fading" || phaseRef.current === "done") return
    finish()
  }, [finish])

  // Cleanup on unmount
  useEffect(() => () => { if (fadeTimer.current) clearTimeout(fadeTimer.current) }, [])

  if (phase === "done") return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.9s ease-in-out",
        pointerEvents: phase === "fading" ? "none" : "auto",
      }}
      onClick={phase === "waiting" ? begin : phase === "playing" ? skip : undefined}
    >
      {/* Hidden audio */}
      <audio ref={audioRef} src="/audio/dylan-field.mp3" preload="auto" />

      {/* Subtle radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* ── Waiting prompt ── */}
      <AnimatePresence>
        {phase === "waiting" && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.9 } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="flex flex-col items-center gap-5 select-none pointer-events-none"
          >
            {/* Top line — CSS pulse so it doesn't freeze the tab */}
            <div className="cinematic-pulse-line" />
            <div className="flex flex-col items-center gap-2">
              <p className="text-white/50 text-sm tracking-[0.4em] uppercase font-mono">
                press anywhere
              </p>
              <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase font-mono">
                to begin
              </p>
            </div>
            {/* Bottom line */}
            <div className="cinematic-pulse-line" style={{ animationDelay: "1.1s" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scene player ── */}
      <AnimatePresence mode="wait">
        {phase === "playing" && sceneIdx >= 0 && (
          <motion.div
            key={`scene-${sceneIdx}`}
            initial={sceneIn}
            animate={sceneAni}
            exit={sceneOut}
            className="w-full max-w-4xl px-10 sm:px-16 lg:px-24 select-none space-y-3"
          >
            {SCENES[sceneIdx].lines.map((line, li) => {
              const wordsBefore = SCENES[sceneIdx].lines
                .slice(0, li)
                .reduce((acc, l) => acc + l.length, 0)

              return (
                <div key={li} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {line.map((word, wi) => {
                    const delay   = (wordsBefore + wi) * SCENES[sceneIdx].stagger
                    // Use slower animation for the final two scenes (6 & 7)
                    const variants = sceneIdx >= 6 ? wordVariantsSlow : wordVariants
                    return (
                      <motion.span
                        key={wi}
                        custom={delay}
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        className={WORD_CLASS[word.style]}
                      >
                        {word.text}
                      </motion.span>
                    )
                  })}
                </div>
              )
            })}

            {/* Skip hint after scene 3 */}
            {sceneIdx >= 3 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.8 } }}
                className="absolute bottom-7 right-8 text-white/15 text-[9px] tracking-[0.3em] uppercase font-mono"
              >
                tap to skip
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Credit card ── */}
      <AnimatePresence>
        {phase === "credit" && (
          <motion.div
            key="credit"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="flex flex-col items-center gap-3 select-none"
          >
            <motion.div
              className="h-px bg-cyan-400/50 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 40, transition: { duration: 0.6, delay: 0.2 } }}
            />
            <p className="text-white/25 text-[9px] tracking-[0.55em] uppercase font-mono">ft.</p>
            <p className="text-white/65 text-xs sm:text-sm tracking-[0.22em] uppercase font-mono">
              Figma CEO Dylan Field
            </p>
            <motion.div
              className="h-px bg-cyan-400/50 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 40, transition: { duration: 0.6, delay: 0.4 } }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
