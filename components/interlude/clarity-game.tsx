"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, RotateCcw, X } from "lucide-react"
import { interlude } from "@/lib/interlude"
import { sfx } from "@/lib/sound"
import { accentAt, accentHex, FORMATION_IDS } from "@/lib/chapter-palette"
import { EASE_SETTLE } from "@/lib/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { DecodeText } from "@/components/decode-text"
import { FormationGlyph } from "@/components/storyboard"
import { ClarityEngine, LEVEL_COUNT, WIN_AT } from "@/components/interlude/clarity-engine"

// ─────────────────────────────────────────────────────────────────────────────
// CLARITY — an interlude. The overlay: iris-wipes open from whatever button
// launched it, owns the HUD and the cinematic cards, and hands every frame to
// ClarityEngine. Seven formations, one per scene, each in its pigment.
// ─────────────────────────────────────────────────────────────────────────────

const NAMES = ["Sphere", "Helix", "Torus", "Knot", "Lattice", "Wave", "Starburst"]
const BEST_KEY = "plx.clarity.best"
const SERVER_STATE = { open: false, origin: { x: 0, y: 0 } }

type Phase = "intro" | "title" | "playing" | "formed" | "complete"

const fmt = (ms: number) => {
  const s = ms / 1000
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, "0")}:${(s % 60).toFixed(1).padStart(4, "0")}`
}

function loadBest(): (number | null)[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(BEST_KEY) ?? "[]")
    return Array.from({ length: LEVEL_COUNT }, (_, i) => (typeof v[i] === "number" ? v[i] : null))
  } catch {
    return Array(LEVEL_COUNT).fill(null)
  }
}

export function ClarityGame() {
  const s = useSyncExternalStore(interlude.subscribe, interlude.get, () => SERVER_STATE)
  return <AnimatePresence>{s.open && <ClarityOverlay key="clarity" origin={s.origin} />}</AnimatePresence>
}

function Card({ children, k }: { children: React.ReactNode; k: string }) {
  return (
    <motion.div
      key={k}
      initial={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, scale: 0.99, filter: "blur(8px)" }}
      transition={{ duration: 0.7, ease: EASE_SETTLE }}
      className="pointer-events-auto relative w-[min(560px,calc(100vw-32px))] rounded-[20px] border border-hair-2 bg-[rgb(14_14_13/0.72)] p-7 sm:p-9 backdrop-blur-xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
    >
      {children}
    </motion.div>
  )
}

function ClarityOverlay({ origin }: { origin: { x: number; y: number } }) {
  const reduced = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<ClarityEngine | null>(null)
  const levelRef = useRef(0)
  const startedAt = useRef<number | null>(null)
  const phaseRef = useRef<Phase>("intro")

  const [phase, setPhaseState] = useState<Phase>("intro")
  const [level, setLevelState] = useState(0)
  const [binding, setBinding] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [times, setTimes] = useState<(number | null)[]>(() => Array(LEVEL_COUNT).fill(null))
  const [best, setBest] = useState<(number | null)[]>(() => Array(LEVEL_COUNT).fill(null))
  const [newBest, setNewBest] = useState(false)
  const [storm, setStorm] = useState(0)

  const setPhase = (p: Phase) => {
    phaseRef.current = p
    setPhaseState(p)
  }

  const pigment = accentHex(level)
  const rgb = (i: number) => {
    const { r, g, b } = accentAt(i)
    return [r, g, b] as [number, number, number]
  }

  // ── Engine lifecycle ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    setBest(loadBest())
    const engine = new ClarityEngine(
      canvas,
      {
        onLock: (b) => sfx.bind(levelRef.current, b),
        onStorm: () => {
          sfx.storm()
          setStorm((n) => n + 1)
        },
        onFirstMove: () => {
          startedAt.current = performance.now()
        },
        onFormed: () => {
          const lv = levelRef.current
          const ms = startedAt.current ? performance.now() - startedAt.current : 0
          setElapsed(ms)
          setTimes((t) => t.map((v, i) => (i === lv ? ms : v)))
          setBest((b) => {
            const prev = b[lv]
            const isBest = prev === null || ms < prev
            setNewBest(isBest)
            const next = b.map((v, i) => (i === lv && isBest ? ms : v))
            try {
              window.localStorage.setItem(BEST_KEY, JSON.stringify(next))
            } catch {}
            return next
          })
          sfx.formed(lv)
          setPhase("formed")
        },
      },
      reduced,
    )
    engine.setLevel(0, rgb(0), false)
    engine.start()
    engineRef.current = engine
    // Dev-only handle for stepping/inspecting the engine from devtools
    if (process.env.NODE_ENV !== "production") (window as unknown as { __clarity?: ClarityEngine }).__clarity = engine

    const ro = new ResizeObserver(() => engine.resize())
    ro.observe(canvas)

    // HUD readouts at ~12Hz — never re-render per frame
    const hud = window.setInterval(() => {
      setBinding(engine.binding)
      if (phaseRef.current === "playing" && startedAt.current) setElapsed(performance.now() - startedAt.current)
    }, 80)

    sfx.sheet(true)
    return () => {
      engine.stop()
      ro.disconnect()
      window.clearInterval(hud)
      sfx.sheet(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Pointer → lens ──────────────────────────────────────────────────────
  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>, down?: boolean) => {
    const r = e.currentTarget.getBoundingClientRect()
    engineRef.current?.setPointer(e.clientX - r.left, e.clientY - r.top, true, down)
  }

  // ── Flow ─────────────────────────────────────────────────────────────────
  const startLevel = useCallback(
    (lv: number, burst: boolean) => {
      const engine = engineRef.current
      if (!engine) return
      levelRef.current = lv
      setLevelState(lv)
      startedAt.current = null
      setElapsed(0)
      setNewBest(false)
      engine.setLevel(lv, rgb(lv), burst)
      setPhase("title")
      // The scene card holds while the burst settles, then play begins.
      window.setTimeout(() => {
        if (phaseRef.current !== "title") return
        engine.play()
        setPhase("playing")
      }, reduced ? 400 : 1500)
    },
    [reduced],
  )

  const next = useCallback(() => {
    const lv = levelRef.current
    if (lv >= LEVEL_COUNT - 1) setPhase("complete")
    else startLevel(lv + 1, true)
  }, [startLevel])

  const close = useCallback(() => interlude.close(), [])

  // Keyboard: Esc closes; Enter begins / advances. Focus moves in, and back out.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    rootRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
      } else if (e.key === "Enter") {
        const p = phaseRef.current
        if (p === "intro") startLevel(0, false)
        else if (p === "formed") next()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      opener?.focus?.({ preventScroll: true })
    }
  }, [close, next, startLevel])

  // Iris geometry — a circle grown from the launching button to cover the screen
  const vw = typeof window !== "undefined" ? window.innerWidth : 1440
  const vh = typeof window !== "undefined" ? window.innerHeight : 900
  const R = Math.hypot(Math.max(origin.x, vw - origin.x), Math.max(origin.y, vh - origin.y)) + 20
  const at = `${origin.x}px ${origin.y}px`

  const total = times.reduce<number>((s, t) => s + (t ?? 0), 0)

  return (
    <motion.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Clarity, an interactive interlude"
      tabIndex={-1}
      className="fixed inset-0 z-[300] bg-[#0b0b0a] outline-none"
      style={{ cursor: "default", ["--chapter" as string]: pigment }}
      initial={{ clipPath: `circle(0px at ${at})` }}
      animate={{ clipPath: `circle(${R}px at ${at})` }}
      exit={{ clipPath: `circle(0px at ${at})` }}
      transition={{ duration: reduced ? 0.25 : 0.95, ease: EASE_SETTLE }}
    >
      <p className="sr-only">
        A small game. Move the lens over the faint outline to pull particles into a formation. Hold to focus. Bind ninety
        percent before noise storms undo it. Press Escape to return to the portfolio.
      </p>

      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full touch-none"
        style={{ cursor: phase === "playing" ? "none" : "default" }}
        onPointerMove={(e) => onPointer(e)}
        onPointerDown={(e) => {
          ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
          onPointer(e, true)
        }}
        onPointerUp={(e) => onPointer(e, false)}
        onPointerLeave={() => engineRef.current?.setPointer(-999, -999, false, false)}
      />

      {/* ── Top bar ───────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-16 items-center justify-between px-5 sm:px-8">
        <div className="flex items-baseline gap-3">
          <span className="label-mono">Interlude</span>
          <span className="text-[15px] font-medium tracking-[-0.01em] text-bone">Clarity</span>
        </div>

        <ol className="hidden sm:flex items-center gap-2.5" aria-label="Formations">
          {Array.from({ length: LEVEL_COUNT }, (_, i) => {
            const done = times[i] !== null
            const current = i === level && phase !== "complete"
            return (
              <li key={i} className="relative flex h-3 w-3 items-center justify-center" title={NAMES[i]}>
                {current && (
                  <motion.span
                    className="absolute inset-[-4px] rounded-full border"
                    style={{ borderColor: accentHex(i) }}
                    animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0.3, 0.9] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <span
                  className="h-2 w-2 rounded-full transition-colors duration-500"
                  style={{ background: done || current ? accentHex(i) : "rgba(242,241,236,0.16)" }}
                />
              </li>
            )
          })}
        </ol>

        <div className="pointer-events-auto flex items-center gap-4">
          <span className="hidden sm:flex items-baseline gap-2 font-mono text-[11px] tabular-nums text-bone-3">
            <span className="text-bone">{fmt(elapsed)}</span>
            {best[level] !== null && <span>best {fmt(best[level]!)}</span>}
          </span>
          <button
            type="button"
            onClick={close}
            aria-label="Close the interlude"
            className="group flex items-center gap-2 rounded-full border border-hair-2 py-1 pl-3 pr-1 font-mono text-[10.5px] text-bone-3 transition-colors hover:border-chapter hover:text-bone"
            style={{ cursor: "pointer" }}
          >
            Esc
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] transition-colors group-hover:bg-chapter group-hover:text-[#111110]">
              <X className="h-3 w-3" strokeWidth={1.8} />
            </span>
          </button>
        </div>
      </div>

      {/* ── Bottom: binding meter + hint ────────────────────────────── */}
      <AnimatePresence>
        {(phase === "playing" || phase === "title") && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease: EASE_SETTLE }}
            className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 px-5 pb-6 sm:px-8"
          >
            <div className="w-[min(320px,60vw)]">
              <div className="flex items-baseline justify-between">
                <span className="label-mono">Binding</span>
                <span className="text-[26px] leading-none tracking-[-0.04em] text-bone tabular-nums">
                  {binding.toFixed(2)}
                </span>
              </div>
              <div className="relative mt-2.5 h-[3px] w-full rounded-full bg-hair-2">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-chapter"
                  animate={{ width: `${Math.min(100, (binding / WIN_AT) * 100)}%` }}
                  transition={{ duration: 0.25, ease: "linear" }}
                />
                <span className="absolute -top-1.5 right-0 h-[15px] w-px bg-bone/50" />
              </div>
              <span className="mt-1.5 block text-right font-mono text-[9.5px] text-bone-4">bind {WIN_AT.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-4 font-mono text-[10.5px] text-bone-3">
              {/* Flashes on each storm (re-keyed so it replays) */}
              {storm > 0 && (
                <motion.span
                  key={storm}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 2.4, times: [0, 0.08, 0.7, 1] }}
                  className="text-bone"
                >
                  noise storm
                </motion.span>
              )}
              <span className="hidden md:inline">sweep the outline · hold to focus · storms unbind</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cards ───────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <Card k="intro">
              <span className="eyebrow">Interlude · a small game</span>
              <h2 className="mt-5 display-xl">
                <span className="ink-accent">Clarity.</span>
              </h2>
              <p className="mt-4 text-[16px] leading-[1.55] text-bone-2">
                Every system starts as noise. Sweep the lens along the faint outline to pull the pieces home. Hold to
                focus. Bind {Math.round(WIN_AT * 100)}% before the storms undo it.
              </p>
              <ul className="mt-6 grid grid-cols-3 gap-3 border-y border-hair py-4 font-mono text-[10.5px] text-bone-3">
                <li>
                  <span className="block text-bone">Sweep</span>pull pieces home
                </li>
                <li>
                  <span className="block text-bone">Hold</span>focus harder
                </li>
                <li>
                  <span className="block text-bone">Storms</span>undo your work
                </li>
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button type="button" onClick={() => startLevel(0, false)} className="btn-solid h-11 px-5" style={{ cursor: "pointer" }}>
                  Begin
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                </button>
                <button type="button" onClick={close} className="font-mono text-[12px] text-bone-3 hover:text-bone" style={{ cursor: "pointer" }}>
                  Not now
                </button>
                <span className="ml-auto hidden sm:inline font-mono text-[10.5px] text-bone-4">7 formations · ↵ to begin</span>
              </div>
            </Card>
          )}

          {phase === "title" && (
            <motion.div
              key={`title-${level}`}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: EASE_SETTLE }}
              className="text-center"
            >
              <span className="label-mono">
                Formation {String(level + 1).padStart(2, "0")} / {String(LEVEL_COUNT).padStart(2, "0")} · {FORMATION_IDS[level]}
              </span>
              <p className="mt-3 text-[clamp(3rem,9vw,7rem)] font-medium leading-[0.9] tracking-[-0.06em]">
                <span className="ink-accent">{NAMES[level]}.</span>
              </p>
            </motion.div>
          )}

          {phase === "formed" && (
            <Card k={`formed-${level}`}>
              <span className="eyebrow">Formation bound</span>
              <h2 className="mt-5 display-lg">
                <DecodeText text={`${NAMES[level]}.`} className="ink-accent" />
              </h2>
              <dl className="mt-6 grid grid-cols-3 border-y border-hair">
                <div className="py-4 pr-3">
                  <dt className="label-mono">Time</dt>
                  <dd className="mt-1.5 text-[22px] tracking-[-0.03em] text-bone tabular-nums">{fmt(elapsed)}</dd>
                </div>
                <div className="py-4 pl-4 border-l border-hair">
                  <dt className="label-mono">Best</dt>
                  <dd className="mt-1.5 flex items-center gap-2 text-[22px] tracking-[-0.03em] text-bone tabular-nums">
                    {best[level] !== null ? fmt(best[level]!) : "·"}
                    {newBest && (
                      <span className="rounded-full bg-chapter px-2 py-0.5 font-mono text-[9px] tracking-normal text-[#111110]">new</span>
                    )}
                  </dd>
                </div>
                <div className="py-4 pl-4 border-l border-hair">
                  <dt className="label-mono">Scene</dt>
                  <dd className="mt-1.5 text-[22px] tracking-[-0.03em] text-bone tabular-nums">
                    {level + 1}
                    <span className="text-bone-3">/{LEVEL_COUNT}</span>
                  </dd>
                </div>
              </dl>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button type="button" onClick={next} className="btn-solid h-11 px-5" style={{ cursor: "pointer" }}>
                  {level >= LEVEL_COUNT - 1 ? "Finish the storyboard" : `Next: ${NAMES[level + 1]}`}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                </button>
                <button type="button" onClick={() => startLevel(level, true)} className="inline-flex items-center gap-2 font-mono text-[12px] text-bone-3 hover:text-bone" style={{ cursor: "pointer" }}>
                  <RotateCcw className="h-3 w-3" strokeWidth={1.8} aria-hidden />
                  Replay
                </button>
                <span className="ml-auto hidden sm:inline font-mono text-[10.5px] text-bone-4">↵ to continue</span>
              </div>
            </Card>
          )}

          {phase === "complete" && (
            <Card k="complete">
              <span className="eyebrow">Interlude complete</span>
              <h2 className="mt-5 display-lg">
                <span className="ink-dim">Storyboard</span> <span className="ink-accent">bound.</span>
              </h2>
              <p className="mt-3 text-[15px] text-bone-3">
                Seven formations in <span className="text-bone tabular-nums">{fmt(total)}</span>. Noise into clarity, which is
                the whole job.
              </p>
              <ol className="mt-6 grid grid-cols-7 gap-1.5">
                {Array.from({ length: LEVEL_COUNT }, (_, i) => (
                  <li key={i} className="text-center">
                    <span
                      className="relative block aspect-square overflow-hidden rounded-[8px] border bg-[#131312]"
                      style={{ color: accentHex(i), borderColor: `color-mix(in oklab, ${accentHex(i)} 45%, transparent)` }}
                    >
                      <span className="absolute inset-[16%]">
                        <FormationGlyph index={i} dot={3.4} gap={6.6} />
                      </span>
                    </span>
                    <span className="mt-1.5 block font-mono text-[9px] text-bone-3 tabular-nums">
                      {times[i] !== null ? fmt(times[i]!).slice(1) : "·"}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setTimes(Array(LEVEL_COUNT).fill(null))
                    startLevel(0, true)
                  }}
                  className="btn-ghost h-11 px-5"
                  style={{ cursor: "pointer" }}
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                  Play again
                </button>
                <button type="button" onClick={close} className="btn-solid h-11 px-5" style={{ cursor: "pointer" }}>
                  Back to the portfolio
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                </button>
              </div>
            </Card>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
