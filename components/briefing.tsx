"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { tour, TOUR_SEEN_KEY } from "@/lib/tour"
import { sfx } from "@/lib/sound"
import { trackEvent } from "@/lib/stats"
import { EASE_SETTLE } from "@/lib/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { DecodeText } from "@/components/decode-text"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────────────────────
// BRIEFING — the first-visit tutorial, AAA-style. A scrim with a spotlight
// cut-out glides between the real UI pieces; viewfinder crop marks snap around
// each one, a leader line draws out to a short callout. Five beats at most,
// skippable at any moment, replayable from the footer.
//
// Targets are marked in the UI with data-tour="…". Each step lists fallbacks
// (desktop rail → mobile dots, mode toggle → mobile menu); steps whose target
// isn't visible at this screen size are dropped.
// ─────────────────────────────────────────────────────────────────────────────

interface Step {
  targets: string[]
  title: string
  body: Record<string, string>
  keys?: string[]
}

const STEPS: Step[] = [
  {
    targets: ["rail", "dots"],
    title: "The storyboard",
    body: {
      rail: "Seven scenes, one story. Pick any frame to travel; the particles re-form for every scene.",
      dots: "Seven scenes, one story. Tap a dot or swipe to travel; the particles re-form for every scene.",
    },
  },
  {
    targets: ["window"],
    title: "The scene window",
    body: { window: "Each scene plays in here. Move with these arrows or your keyboard, and scroll inside for more." },
    keys: ["←", "→"],
  },
  {
    targets: ["modes", "menu"],
    title: "Two ways to read",
    body: {
      modes: "Recruiter is the 30-second version. Designer tells the full story.",
      menu: "View modes, the résumé, sound and the game all live in here.",
    },
  },
  {
    targets: ["now"],
    title: "Right now",
    body: { now: "Current role and the path here. The full résumé is one click away." },
  },
  {
    targets: ["extras"],
    title: "Sound and play",
    body: { extras: "The site is scored, so keep sound on if you can. When you have a minute, play Clarity." },
  },
]

type Rect = { x: number; y: number; w: number; h: number }
const PAD = 8

function visibleRect(key: string): Rect | null {
  const els = document.querySelectorAll<HTMLElement>(`[data-tour="${key}"]`)
  for (const el of els) {
    const r = el.getBoundingClientRect()
    if (r.width < 4 || r.height < 4) continue
    if (r.bottom < 0 || r.top > window.innerHeight || r.right < 0 || r.left > window.innerWidth) continue
    if (getComputedStyle(el).visibility === "hidden") continue
    return { x: r.left - PAD, y: r.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 }
  }
  return null
}

/** Where a ray from the rect's centre toward (tx,ty) leaves the rect. */
function edgePoint(r: Rect, tx: number, ty: number) {
  const cx = r.x + r.w / 2
  const cy = r.y + r.h / 2
  const dx = tx - cx
  const dy = ty - cy
  if (!dx && !dy) return { x: cx, y: cy }
  const s = Math.min(dx ? r.w / 2 / Math.abs(dx) : Infinity, dy ? r.h / 2 / Math.abs(dy) : Infinity)
  return { x: cx + dx * s, y: cy + dy * s }
}

/** First callout placement (right, left, below, above) that fits on screen. */
function place(t: Rect, cw: number, ch: number, vw: number, vh: number) {
  const gap = 34
  const m = 16
  const clampY = (y: number) => Math.max(m, Math.min(vh - ch - m, y))
  const clampX = (x: number) => Math.max(m, Math.min(vw - cw - m, x))
  const options = [
    { x: t.x + t.w + gap, y: clampY(t.y + t.h / 2 - ch / 2) },
    { x: t.x - gap - cw, y: clampY(t.y + t.h / 2 - ch / 2) },
    { x: clampX(t.x + t.w / 2 - cw / 2), y: t.y + t.h + gap },
    { x: clampX(t.x + t.w / 2 - cw / 2), y: t.y - gap - ch },
  ]
  for (const o of options) {
    if (o.x >= m && o.x + cw <= vw - m && o.y >= m && o.y + ch <= vh - m) return o
  }
  return { x: clampX(vw / 2 - cw / 2), y: vh - ch - m }
}

export function Briefing({ ready }: { ready: boolean }) {
  const open = useSyncExternalStore(tour.subscribe, tour.isOpen, () => false)

  // Auto-play once per visitor, after the prologue has settled. ?tour forces it;
  // deep links (#chapter-…) skip it — that visitor came for something specific.
  useEffect(() => {
    if (!ready) return
    const force = new URLSearchParams(window.location.search).has("tour")
    let seen = false
    try {
      seen = window.localStorage.getItem(TOUR_SEEN_KEY) === "1"
    } catch {}
    if (!force && (seen || window.location.hash)) return
    const id = window.setTimeout(() => tour.open(), 1700)
    return () => window.clearTimeout(id)
  }, [ready])

  return <AnimatePresence>{open && <BriefingOverlay key="briefing" />}</AnimatePresence>
}

function BriefingOverlay() {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<"intro" | "steps">("intro")
  // Only ever rendered on the client (it mounts when the store opens), so the
  // steps that exist at this screen size can be resolved straight from the DOM.
  const [steps] = useState(() =>
    STEPS.flatMap((step) => {
      const key = step.targets.find((k) => visibleRect(k))
      return key ? [{ step, key }] : []
    }),
  )
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [rect, setRect] = useState<Rect | null>(null)
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  const [card, setCard] = useState({ w: 360, h: 230 })
  const cardRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  // Open: score it, bail if nothing to show, auto-advance past the title.
  useEffect(() => {
    sfx.tourOpen()
    if (!steps.length) tour.close()
    const id = window.setTimeout(() => setPhase((p) => (p === "intro" ? "steps" : p)), reduced ? 300 : 1700)
    return () => window.clearTimeout(id)
  }, [reduced, steps.length])

  const current = steps[i]

  // Track the live target (columns drift with the pointer parallax).
  useEffect(() => {
    if (phase !== "steps" || !current) return
    let raf = 0
    let last = ""
    const loop = () => {
      const r = visibleRect(current.key)
      const sig = r ? `${r.x | 0},${r.y | 0},${r.w | 0},${r.h | 0}` : ""
      if (sig !== last) {
        last = sig
        setRect(r)
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [phase, current])

  useLayoutEffect(() => {
    const el = cardRef.current
    if (el) setCard({ w: el.offsetWidth, h: el.offsetHeight })
  }, [i, phase, steps.length])

  useEffect(() => {
    if (phase === "steps") nextRef.current?.focus({ preventScroll: true })
  }, [phase, i])

  const finish = useCallback((completed = false) => {
    trackEvent(completed ? "briefing_done" : "briefing_skip")
    sfx.tourClose()
    tour.close()
  }, [])

  const go = useCallback(
    (d: number) => {
      if (phase === "intro") {
        setPhase("steps")
        sfx.tourStep(1)
        return
      }
      const n = i + d
      if (n < 0) return
      if (n >= steps.length) return finish(true)
      setDir(d)
      setI(n)
      sfx.tourStep(d)
    },
    [phase, i, steps.length, finish],
  )

  // Keyboard owns the briefing: Esc skips, ←/→/Enter step. (page.tsx yields arrows.)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        finish()
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault()
        go(1)
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        go(-1)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, finish])

  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 170, damping: 26, mass: 0.9 }
  const hole = phase === "steps" && rect ? rect : { x: vp.w / 2, y: vp.h / 2, w: 0, h: 0 }
  const pos = rect ? place(rect, card.w, card.h, vp.w, vp.h) : { x: vp.w / 2 - card.w / 2, y: vp.h / 2 - card.h / 2 }
  const A = rect ? edgePoint(rect, pos.x + card.w / 2, pos.y + card.h / 2) : null
  const B = rect ? edgePoint({ x: pos.x, y: pos.y, w: card.w, h: card.h }, rect.x + rect.w / 2, rect.y + rect.h / 2) : null

  return (
    <motion.div
      className="fixed inset-0 z-[250]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.5, ease: EASE_SETTLE }}
    >
      {/* ── Scrim with the spotlight cut-out ─────────────────────── */}
      <svg aria-hidden className="absolute inset-0 h-full w-full">
        <defs>
          <mask id="briefing-hole">
            <rect width="100%" height="100%" fill="white" />
            <motion.rect
              fill="black"
              rx={14}
              initial={false}
              animate={{ x: hole.x, y: hole.y, width: hole.w, height: hole.h }}
              transition={spring}
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(7,7,6,0.72)" mask="url(#briefing-hole)" />

        {/* Leader line — draws out from the target to the callout */}
        {phase === "steps" && A && B && (
          <g key={`lead-${i}`}>
            <motion.line
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="var(--chapter)"
              strokeWidth={1}
              strokeDasharray="2 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.28, ease: EASE_SETTLE }}
            />
            <motion.circle
              cx={A.x}
              cy={A.y}
              r={3}
              fill="var(--chapter)"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.6, 1] }}
              transition={{ duration: 0.5, delay: reduced ? 0 : 0.25 }}
            />
            <circle cx={B.x} cy={B.y} r={2} fill="var(--bone)" opacity={0.7} />
          </g>
        )}
      </svg>

      {/* ── Viewfinder frame around the target ───────────────────── */}
      {phase === "steps" && rect && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute"
          initial={false}
          animate={{ x: rect.x, y: rect.y, width: rect.w, height: rect.h }}
          transition={spring}
          style={{ left: 0, top: 0 }}
        >
          <motion.div
            key={`frame-${i}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.18, ease: EASE_SETTLE }}
          >
            {[
              "left-0 top-0 border-l border-t",
              "right-0 top-0 border-r border-t",
              "left-0 bottom-0 border-l border-b",
              "right-0 bottom-0 border-r border-b",
            ].map((c) => (
              <span key={c} className={cn("absolute h-3.5 w-3.5 border-chapter", c)} />
            ))}
            <span className="absolute inset-0 rounded-[14px] ring-1 ring-chapter/30" />
            {/* one scan pass — the system "reads" the element */}
            {!reduced && (
              <motion.span
                className="absolute inset-x-1 h-px bg-gradient-to-r from-transparent via-chapter to-transparent"
                initial={{ top: "0%", opacity: 0 }}
                animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
              />
            )}
          </motion.div>
        </motion.div>
      )}

      {/* ── Intro title ──────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            key="intro"
            className="absolute inset-0 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: EASE_SETTLE }}
          >
            <div className="text-center">
              <span className="label-mono">Pixelogic OS</span>
              <h2 id="briefing-title" className="mt-4 display-lg text-bone">
                <span className="ink-dim">System</span> <DecodeText text="briefing." className="ink-accent" />
              </h2>
              <motion.span
                aria-hidden
                className="mx-auto mt-5 block h-px bg-gradient-to-r from-transparent via-chapter to-transparent"
                initial={{ width: 0 }}
                animate={{ width: 260 }}
                transition={{ duration: 1.1, ease: EASE_SETTLE }}
              />
              <p className="mt-4 font-mono text-[11px] text-bone-3">
                {Math.max(steps.length, 1)} quick stops · about 20 seconds
              </p>
              <div className="mt-6 flex items-center justify-center gap-5">
                <button type="button" onClick={() => go(1)} className="btn-solid h-10 px-5">
                  Start
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                </button>
                <button type="button" onClick={() => finish()} className="font-mono text-[12px] text-bone-3 hover:text-bone">
                  Skip <span className="keycap ml-1">Esc</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Callout card ─────────────────────────────────────────── */}
      {phase === "steps" && current && (
        <motion.div
          ref={cardRef}
          className="absolute left-0 top-0 w-[min(360px,calc(100vw-32px))] rounded-[16px] border border-hair-2 bg-[rgb(14_14_13/0.88)] p-5 backdrop-blur-xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]"
          initial={{ x: pos.x, y: pos.y + 10, opacity: 0 }}
          animate={{ x: pos.x, y: pos.y, opacity: 1 }}
          transition={spring}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] rounded-t-[16px] bg-gradient-to-r from-chapter via-chapter/40 to-transparent" />
          <div className="flex items-center justify-between font-mono text-[10.5px] text-bone-3">
            <span className="flex items-center gap-2">
              <span className="live-dot" aria-hidden />
              Briefing
            </span>
            <span className="tabular-nums">
              {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={i}
              initial={{ opacity: 0, x: reduced ? 0 : 10 * dir, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: reduced ? 0 : -10 * dir, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: EASE_SETTLE }}
            >
              <h2 id="briefing-title" className="mt-3.5 text-[21px] font-medium leading-tight tracking-[-0.03em] text-bone">
                <DecodeText text={current.step.title} duration={380} />
              </h2>
              <p className="mt-2 text-[14px] leading-[1.55] text-bone-2">{current.step.body[current.key]}</p>
              {current.step.keys && (
                <p className="mt-3 flex items-center gap-1.5 font-mono text-[10.5px] text-bone-3">
                  {current.step.keys.map((k) => (
                    <span key={k} className="keycap">
                      {k}
                    </span>
                  ))}
                  <span className="ml-1">also work</span>
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* progress + controls */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex flex-1 gap-1" aria-hidden>
              {steps.map((_, k) => (
                <span key={k} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-hair-2">
                  <motion.span
                    className="absolute inset-0 origin-left rounded-full bg-chapter"
                    initial={false}
                    animate={{ scaleX: k <= i ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: EASE_SETTLE }}
                  />
                </span>
              ))}
            </div>
            <button type="button" onClick={() => finish()} className="font-mono text-[11px] text-bone-3 hover:text-bone">
              Skip
            </button>
            {i > 0 && (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-hair-2 text-bone-2 transition-colors hover:border-chapter hover:text-bone"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>
            )}
            <button ref={nextRef} type="button" onClick={() => go(1)} className="btn-solid btn-sm h-8">
              {i === steps.length - 1 ? "Got it" : "Next"}
              <ArrowRight className="h-3 w-3" strokeWidth={1.6} aria-hidden />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
