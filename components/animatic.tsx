"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, type MotionValue } from "framer-motion"
import { Pause, Play } from "lucide-react"
import { CropMarks, Sketch } from "@/components/storyboard"
import { EASE_SETTLE } from "@/lib/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { cn } from "@/lib/utils"
import { sfx } from "@/lib/sound"

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATIC — a storyboard played in time (the film term for exactly this).
// Scene 03 is "the rhythm", so it PLAYS: beats advance on a clock, a timeline
// fills, a timecode runs, a metronome dot pulses on every beat. Hover the stage
// to hold a beat; click any beat to cut to it. Reduced motion → paused, manual.
// ─────────────────────────────────────────────────────────────────────────────

export interface Beat {
  title: string
  meta: string
  caption: string
  sketch: string
}

const BEAT_MS = 3800

function Segment({
  beat,
  index,
  active,
  past,
  progress,
  onSelect,
}: {
  beat: Beat
  index: number
  active: boolean
  past: boolean
  progress: MotionValue<number>
  onSelect: (i: number) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      data-sfx-skip
      aria-current={active ? "step" : undefined}
      aria-label={`Beat ${index + 1}: ${beat.title}`}
      className="group flex flex-col gap-2 pt-1 text-left"
    >
      <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-hair-2">
        {/* Past beats sit full, future beats empty, the live beat follows the clock */}
        <motion.span className="absolute inset-0 origin-left rounded-full bg-chapter" style={{ scaleX: active ? progress : past ? 1 : 0 }} />
      </span>
      <span className="flex items-baseline justify-between gap-2">
        <span
          className={cn(
            "text-[13.5px] tracking-[-0.01em] transition-colors",
            active ? "text-bone" : past ? "text-bone-2" : "text-bone-3 group-hover:text-bone-2",
          )}
        >
          {beat.title}
        </span>
        <span className="hidden @xl:inline font-mono text-[9.5px] text-bone-4">{beat.meta}</span>
      </span>
    </button>
  )
}

export function Animatic({ beats }: { beats: Beat[] }) {
  const reduced = useReducedMotion()
  const [beat, setBeat] = useState(0)
  const [playing, setPlaying] = useState(!reduced)
  const [held, setHeld] = useState(false) // hover-hold on the stage
  const [pulse, setPulse] = useState(0) // bumps each beat → metronome dot
  const progress = useMotionValue(0)
  const elapsed = useRef(0)
  const timecodeRef = useRef<HTMLSpanElement>(null)
  const beatRef = useRef(0) // the clock reads this; only cutTo writes it

  const writeTimecode = useCallback((b: number, e: number) => {
    const t = (b * BEAT_MS + e) / 1000
    const s = Math.floor(t)
    if (timecodeRef.current)
      timecodeRef.current.textContent = `00:${String(s).padStart(2, "0")}.${Math.floor((t - s) * 10)}`
  }, [])

  const cutTo = useCallback(
    (i: number) => {
      elapsed.current = 0
      beatRef.current = i
      progress.set(0)
      setBeat(i)
      sfx.beat(i)
      setPulse((p) => p + 1)
      writeTimecode(i, 0)
    },
    [progress, writeTimecode],
  )

  // The clock — rAF, frame-rate independent, never re-renders per frame.
  useEffect(() => {
    if (!playing || held) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      elapsed.current += dt
      if (elapsed.current >= BEAT_MS) {
        cutTo((beatRef.current + 1) % beats.length)
      } else {
        progress.set(elapsed.current / BEAT_MS)
        writeTimecode(beatRef.current, elapsed.current)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, held, beats.length, cutTo, progress, writeTimecode])

  const current = beats[beat]

  return (
    <div className="space-y-4">
      {/* ── Stage ───────────────────────────────────────────────── */}
      <div
        className="group relative aspect-[16/8] @3xl:aspect-[16/7] overflow-hidden rounded-[14px] border border-hair bg-[#131312]"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(242,241,236,0.05) 1px, transparent 1px)", backgroundSize: "12px 12px" }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(60% 80% at 75% 45%, color-mix(in oklab, var(--chapter) 16%, transparent), transparent 70%)" }}
        />
        <CropMarks inset={10} />

        {/* Slate — shot + timecode + metronome */}
        <div className="absolute inset-x-4 top-3 z-10 flex items-center justify-between font-mono text-[10px] text-bone-3">
          <span className="tabular-nums">
            SH {String(beat + 1).padStart(2, "0")} / {String(beats.length).padStart(2, "0")}
          </span>
          <span className="flex items-center gap-2 tabular-nums">
            <motion.span
              key={pulse}
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-chapter"
              initial={{ scale: 2.4, opacity: 1 }}
              animate={{ scale: 1, opacity: playing && !held ? 0.9 : 0.35 }}
              transition={{ duration: 0.6, ease: EASE_SETTLE }}
            />
            <span ref={timecodeRef}>00:00.0</span>
            {held && playing && <span className="text-bone-4">· held</span>}
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={beat}
            className="absolute inset-0 grid grid-cols-[1fr_1.15fr] items-center"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.45, ease: EASE_SETTLE }}
          >
            {/* Title card */}
            <div className="pl-[7%] pr-2 space-y-3 @3xl:space-y-4">
              <motion.p
                initial={{ y: 14 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: EASE_SETTLE }}
                className="ink-accent font-medium leading-[0.95] tracking-[-0.05em] text-[clamp(1.9rem,7.5cqi,3.6rem)]"
              >
                {current.title}.
              </motion.p>
              <p className="label-mono !text-chapter">In practice · {current.meta}</p>
              <p className="hidden @xl:block text-[clamp(0.85rem,1.9cqi,1.05rem)] leading-[1.45] text-bone-2 max-w-[30ch]">
                {current.caption}
              </p>
            </div>
            {/* The frame's drawing */}
            <motion.div
              className="h-[72%] pr-[6%]"
              initial={{ scale: 0.94, x: 16 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE_SETTLE }}
              style={{ color: "var(--chapter)" }}
            >
              <Sketch name={current.sketch} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption on narrow stages (the title card drops it) */}
      <p className="@xl:hidden text-[13.5px] leading-[1.5] text-bone-2">{current.caption}</p>

      {/* ── Transport ───────────────────────────────────────────── */}
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause the rhythm" : "Play the rhythm"}
          aria-pressed={playing}
          className="mt-[-3px] flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-hair-3 text-bone transition-colors hover:border-chapter hover:bg-chapter hover:text-[#111110]"
        >
          {playing ? <Pause className="h-3.5 w-3.5" strokeWidth={1.8} /> : <Play className="h-3.5 w-3.5 translate-x-[1px]" strokeWidth={1.8} />}
        </button>
        <div className="grid flex-1 grid-cols-4 gap-2">
          {beats.map((b, i) => (
            <Segment key={b.title} beat={b} index={i} active={i === beat} past={i < beat} progress={progress} onSelect={cutTo} />
          ))}
        </div>
      </div>
    </div>
  )
}
