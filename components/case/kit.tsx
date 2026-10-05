"use client"

import type React from "react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useMotionValueEvent } from "framer-motion"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { EASE_SETTLE } from "@/lib/motion"
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion"
import { CropMarks } from "@/components/storyboard"
import { sfx } from "@/lib/sound"

// ─────────────────────────────────────────────────────────────────────────────
// CASE KIT (client half) — the few pieces of the case-study pages that move:
// scroll reveals, mockups scaled to their frame, the scene filmstrip, the
// before/after seam and the agent conversation. Everything static lives in
// blocks.tsx so the pages stay server-rendered.
// ─────────────────────────────────────────────────────────────────────────────

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

/** Rises into place the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.8, ease: EASE_SETTLE, delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Renders a mockup at its design size (e.g. 1280×800) and scales it to the
 * width it's given — the mockup reads like a real screen at any viewport,
 * with no reflow inside it.
 */
export function ScaleToFit({
  width,
  height,
  children,
  className,
}: {
  width: number
  height: number
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setScale(el.clientWidth / width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])

  return (
    <div ref={ref} className={cn("relative w-full overflow-hidden", className)} style={{ aspectRatio: `${width} / ${height}` }}>
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width, height, transform: `scale(${scale})`, opacity: scale ? 1 : 0 }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * The scene filmstrip — a quiet vertical index on wide screens that tracks
 * where you are and jumps on click; a hairline progress bar everywhere else.
 */
export function SceneIndex({ scenes }: { scenes: { id: string; label: string }[] }) {
  const [active, setActive] = useState(scenes[0]?.id)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const els = scenes.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-30% 0px -55% 0px" },
    )
    els.forEach((el) => io.observe(el))
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [scenes])

  return (
    <>
      <div aria-hidden className="fixed left-0 right-0 top-14 z-40 h-px bg-hair">
        <div className="h-full origin-left bg-chapter" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <nav
        aria-label="Scenes"
        className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block"
      >
        <ol className="space-y-2.5">
          {scenes.map((s, i) => {
            const on = s.id === active
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="group flex items-center gap-3"
                  aria-current={on ? "true" : undefined}
                >
                  <span
                    className={cn(
                      "h-px transition-all duration-500",
                      on ? "w-8 bg-chapter" : "w-4 bg-bone-4 group-hover:w-6 group-hover:bg-bone-3",
                    )}
                  />
                  <span
                    className={cn(
                      "font-mono text-[10px] transition-colors",
                      on ? "text-bone" : "text-bone-4 group-hover:text-bone-3",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                    <span className={cn("ml-2 transition-opacity", on ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                      {s.label}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

/**
 * Before ↔ after on one frame. Drag the seam (or arrow-key it); the "after"
 * sweeps in from the right the first time the frame scrolls into view.
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  ratio = "16 / 10",
}: {
  before: React.ReactNode
  after: React.ReactNode
  beforeLabel?: string
  afterLabel?: string
  ratio?: string
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const inView = useInView(stageRef, { once: true, margin: "0px 0px -20% 0px" })
  const pos = useMotionValue(96)
  const [ariaPos, setAriaPos] = useState(96)
  const [dragging, setDragging] = useState(false)
  const draggingRef = useRef(false)
  useMotionValueEvent(pos, "change", (v) => {
    setAriaPos(Math.round(v))
    if (draggingRef.current) sfx.seamMove(1 - v / 100)
  })
  const clip = useMotionTemplate`inset(0 0 0 ${pos}%)`
  const left = useMotionTemplate`${pos}%`

  useEffect(() => {
    // Reduced motion: rest at the midpoint from the start, no sweep.
    if (prefersReducedMotion()) {
      pos.set(50)
      return
    }
    if (!inView) return
    const a = animate(pos, 50, { duration: 1.4, ease: EASE_SETTLE, delay: 0.2 })
    return () => a.stop()
  }, [inView, pos])

  const setFromClientX = (clientX: number) => {
    const r = stageRef.current?.getBoundingClientRect()
    if (!r) return
    pos.set(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }
  const end = () => {
    draggingRef.current = false
    setDragging(false)
    sfx.seamEnd()
  }
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5
    let next: number | null = null
    if (e.key === "ArrowLeft") next = pos.get() - step
    else if (e.key === "ArrowRight") next = pos.get() + step
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = 100
    if (next === null) return
    e.preventDefault()
    animate(pos, Math.max(0, Math.min(100, next)), { duration: 0.35, ease: EASE_SETTLE })
  }

  return (
    <div
      ref={stageRef}
      className={cn(
        "group relative overflow-hidden rounded-[14px] border border-hair bg-[#131312] select-none touch-pan-y",
        dragging ? "cursor-grabbing" : "cursor-ew-resize",
      )}
      style={{ aspectRatio: ratio }}
      onPointerDown={(e) => {
        ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
        draggingRef.current = true
        setDragging(true)
        setFromClientX(e.clientX)
        sfx.seamStart(1 - pos.get() / 100)
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) setFromClientX(e.clientX)
      }}
      onPointerUp={end}
      onPointerCancel={end}
      data-sfx-skip
    >
      <div className="absolute inset-0">{before}</div>
      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
        {after}
      </motion.div>
      <CropMarks inset={10} />
      <span className="pointer-events-none absolute left-4 top-3 z-10 rounded-full border border-hair-2 bg-[rgb(19_19_18/0.85)] px-2.5 py-0.5 font-mono text-[10px] text-bone-2">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-4 top-3 z-10 rounded-full border border-chapter bg-chapter px-2.5 py-0.5 font-mono text-[10px] text-[#111110]">
        {afterLabel}
      </span>
      <motion.div className="absolute inset-y-0 z-20 w-0" style={{ left }}>
        <span aria-hidden className="absolute inset-y-0 -left-px w-[2px] bg-bone/80 shadow-[0_0_24px_rgba(242,241,236,0.35)]" />
        <button
          type="button"
          role="slider"
          aria-label={`Compare ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={ariaPos}
          aria-valuetext={`${100 - ariaPos}% ${afterLabel.toLowerCase()}`}
          onKeyDown={onKey}
          className="absolute top-1/2 left-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone bg-bone text-[#111110] shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-transform hover:scale-110"
        >
          <ChevronLeft className="h-3.5 w-3.5 -mr-1" strokeWidth={2} />
          <ChevronRight className="h-3.5 w-3.5 -ml-1" strokeWidth={2} />
        </button>
      </motion.div>
    </div>
  )
}

export type ChatLine =
  | { from: "user"; text: string }
  | { from: "agent"; text: string; actions?: string[] }
  | { from: "system"; text: string }

/**
 * A conversation that plays itself once it's on screen — each line lands
 * after the one before it, with a typing beat for the agent. Reduced motion
 * shows the whole exchange at once.
 */
export function ChatDemo({ lines, title = "Hiro · Networking" }: { lines: ChatLine[]; title?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" })
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(false)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    let t = 400
    lines.forEach((line, i) => {
      if (line.from === "agent") {
        timers.push(setTimeout(() => !cancelled && setTyping(true), t))
        t += 900
      }
      timers.push(
        setTimeout(() => {
          if (cancelled) return
          setTyping(false)
          setShown(i + 1)
        }, t),
      )
      t += line.from === "user" ? 900 : 1300
    })
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [inView, reduced, lines, run])

  // Reduced motion: the whole exchange, at once.
  const visible = reduced ? lines.length : shown

  return (
    <div ref={ref} className="overflow-hidden rounded-[18px] border border-[#E9EAF1] bg-white text-[#171826] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <div className="flex items-center justify-between border-b border-[#E9EAF1] px-4 py-3">
        <span className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#3B5BFF] to-[#7C5CFF] text-[11px] font-semibold text-white">H</span>
          <span className="text-[13px] font-semibold">{title}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            setShown(0)
            setRun((r) => r + 1)
          }}
          className="flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] text-[#6B6F85] transition-colors hover:bg-[#F3F4F8]"
          aria-label="Replay conversation"
        >
          <RotateCcw className="h-3 w-3" /> Replay
        </button>
      </div>
      <div className="flex min-h-[340px] flex-col gap-2.5 bg-[#FAFAFC] p-4" aria-live="polite">
        {lines.slice(0, visible).map((line, i) => (
          <motion.div
            key={`${run}-${i}`}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE_SETTLE }}
            className={cn(
              "max-w-[86%] text-[13px] leading-[1.5]",
              line.from === "user" && "self-end rounded-[14px] rounded-br-[4px] bg-[#3B5BFF] px-3.5 py-2 text-white",
              line.from === "agent" && "self-start rounded-[14px] rounded-bl-[4px] border border-[#E9EAF1] bg-white px-3.5 py-2.5",
              line.from === "system" && "self-center rounded-full bg-[#EAF7F2] px-3 py-1 text-[11.5px] font-medium text-[#10805F]",
            )}
          >
            {line.text}
            {line.from === "agent" && line.actions && (
              <span className="mt-2.5 flex gap-1.5">
                {line.actions.map((a, k) => (
                  <span
                    key={a}
                    className={cn(
                      "rounded-full px-3 py-1 text-[12px] font-medium",
                      k === 0 ? "bg-[#3B5BFF] text-white" : "border border-[#E9EAF1] text-[#6B6F85]",
                    )}
                  >
                    {a}
                  </span>
                ))}
              </span>
            )}
          </motion.div>
        ))}
        {typing && (
          <span className="flex gap-1 self-start rounded-[14px] border border-[#E9EAF1] bg-white px-3.5 py-3" aria-label="Hiro is typing">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="h-1.5 w-1.5 rounded-full bg-[#9A9EB2]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
              />
            ))}
          </span>
        )}
      </div>
    </div>
  )
}
