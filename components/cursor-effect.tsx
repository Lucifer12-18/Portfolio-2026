"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { useReadingStore } from "@/contexts/reading-store-context"
import { FOLLOW_SPRING, SNAP } from "@/lib/motion"

// Matches the chapter accent palette in page.tsx exactly
const CHAPTER_ACCENTS: [number, number, number][] = [
  [34,  211, 238],  // cyan     — Prologue
  [6,   182, 212],  // dk-cyan  — Origin
  [124, 58,  237],  // purple   — Shift
  [167, 139, 250],  // lavender — Method
  [56,  189, 248],  // sky      — Work
  [147, 197, 253],  // lt-blue  — Notes
  [224, 249, 255],  // ice      — Epilogue
]

export function CursorEffect() {
  const { activeChapterIndex } = useReadingStore()
  const [r, g, b] = CHAPTER_ACCENTS[activeChapterIndex] ?? CHAPTER_ACCENTS[0]

  // Raw cursor position — dot snaps here instantly
  const cursorX = useMotionValue(-200)
  const cursorY = useMotionValue(-200)

  // Spring-lagged ring — shared FOLLOW physics (same family as the parallax bus + magnetic)
  const springX = useSpring(cursorX, FOLLOW_SPRING)
  const springY = useSpring(cursorY, FOLLOW_SPRING)

  const [isHover,   setIsHover]   = useState(false)
  const [isClick,   setIsClick]   = useState(false)
  const [isIdle,    setIsIdle]    = useState(false)
  const [mounted,   setMounted]   = useState(false)
  const [isTouch,   setIsTouch]   = useState(false)

  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const accentRef   = useRef<[number, number, number]>([r, g, b])
  const trailRef    = useRef<{ x: number; y: number; born: number }[]>([])
  const rafRef      = useRef<number>(0)
  const idleTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep accent ref in sync with chapter changes (used inside RAF without re-creating effect)
  useEffect(() => { accentRef.current = [r, g, b] }, [r, g, b])

  useEffect(() => {
    setMounted(true)
    // Touch devices — bail out entirely, leave default cursor
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true)
      return
    }

    // Hide system cursor
    document.documentElement.style.cursor = "none"

    const canvas = canvasRef.current
    const ctx    = canvas ? canvas.getContext("2d") : null

    const resize = () => {
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    // ── Trail draw loop ──────────────────────────────────────────────────
    // Cull by elapsed TIME (not frame count) so the trail length is identical
    // at 60Hz and 144Hz — same fps-independence law as the particle scene.
    const TRAIL_LIFE_MS = 300
    const drawLoop = () => {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const now = performance.now()
        // Cull expired points
        trailRef.current = trailRef.current.filter(p => now - p.born < TRAIL_LIFE_MS)

        trailRef.current.forEach((p, i) => {
          const [cr, cg, cb] = accentRef.current
          const life    = 1 - (now - p.born) / TRAIL_LIFE_MS
          const density = (i + 1) / trailRef.current.length
          const opacity = life * density * 0.45
          const size    = life * 2.8

          ctx.beginPath()
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
          ctx.fillStyle    = `rgba(${cr},${cg},${cb},${opacity})`
          ctx.shadowColor  = `rgba(${cr},${cg},${cb},${opacity * 0.8})`
          ctx.shadowBlur   = 5
          ctx.fill()
        })
      }
      rafRef.current = requestAnimationFrame(drawLoop)
    }
    rafRef.current = requestAnimationFrame(drawLoop)

    // ── Mouse handlers ───────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)

      trailRef.current.push({ x: e.clientX, y: e.clientY, born: performance.now() })
      if (trailRef.current.length > 22) trailRef.current.shift()

      setIsIdle(false)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => setIsIdle(true), 1800)
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null
      setIsHover(!!el?.closest('a, button, [role="button"], input, select, textarea, label, .cursor-pointer'))
    }

    const onDown  = () => setIsClick(true)
    const onUp    = () => setIsClick(false)
    const onLeave = () => { cursorX.set(-200); cursorY.set(-200) }

    window.addEventListener("mousemove",  onMove,  { passive: true })
    window.addEventListener("mouseover",  onOver,  { passive: true })
    window.addEventListener("mousedown",  onDown)
    window.addEventListener("mouseup",    onUp)
    document.addEventListener("mouseleave", onLeave)
    window.addEventListener("resize",     resize,  { passive: true })

    return () => {
      document.documentElement.style.cursor = ""
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("mousemove",  onMove)
      window.removeEventListener("mouseover",  onOver)
      window.removeEventListener("mousedown",  onDown)
      window.removeEventListener("mouseup",    onUp)
      document.removeEventListener("mouseleave", onLeave)
      window.removeEventListener("resize",     resize)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!mounted || isTouch) return null

  const accent    = `rgba(${r},${g},${b}`
  const ringSize  = isHover ? 44 : isClick ? 16 : 28

  return (
    <>
      {/* ── Particle trail canvas ──────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9996 }}
        aria-hidden
      />

      {/* ── Idle targeting reticle ─────────────────────────────────────── */}
      <AnimatePresence>
        {isIdle && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none"
            style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%", zIndex: 9997 }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25 }}
            aria-hidden
          >
            {/* Crosshair lines */}
            <div style={{ position: "absolute", width: 26, height: 1, top: "50%", left: "50%",
              transform: "translate(-50%,-50%)", background: `${accent},0.3)` }} />
            <div style={{ position: "absolute", width: 1, height: 26, top: "50%", left: "50%",
              transform: "translate(-50%,-50%)", background: `${accent},0.3)` }} />
            {/* Corner brackets */}
            {[
              { top: "-10px", left: "-10px",  borderTop:    `1px solid ${accent},0.55)`, borderLeft:   `1px solid ${accent},0.55)` },
              { top: "-10px", right: "-10px", borderTop:    `1px solid ${accent},0.55)`, borderRight:  `1px solid ${accent},0.55)` },
              { bottom: "-10px", left: "-10px",  borderBottom: `1px solid ${accent},0.55)`, borderLeft:   `1px solid ${accent},0.55)` },
              { bottom: "-10px", right: "-10px", borderBottom: `1px solid ${accent},0.55)`, borderRight:  `1px solid ${accent},0.55)` },
            ].map((s, i) => (
              <div key={i} style={{ position: "absolute", width: 7, height: 7, ...s }} />
            ))}
            {/* Pulsing center ring */}
            <motion.div
              style={{ position: "absolute", top: "50%", left: "50%", width: 6, height: 6,
                translateX: "-50%", translateY: "-50%", borderRadius: "50%",
                border: `1px solid ${accent},0.5)` }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ring follower (spring-lagged) ──────────────────────────────── */}
      {/* All morph (size / radius / glow / press) runs on ONE SNAP spring —
          no mixed CSS-ease + spring. Auto-centred via -50% so size changes
          never shift the ring off the cursor. */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9998,
          borderWidth: 1.5,
          borderStyle: "solid",
        }}
        animate={{
          width:  ringSize,
          height: ringSize,
          borderRadius: isHover ? 10 : ringSize / 2,
          borderColor: `${accent},${isHover ? 0.7 : 0.38})`,
          boxShadow: `0 0 ${isHover ? 18 : 10}px 1px ${accent},${isHover ? 0.22 : 0.09})`,
          scale: isClick ? 0.65 : 1,
        }}
        transition={SNAP}
        aria-hidden
      />

      {/* ── Dot (instant) ─────────────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9999,
          borderRadius: "50%",
          background: `${accent},0.95)`,
          boxShadow: `0 0 7px 2px ${accent},0.45)`,
        }}
        animate={{
          width:  isHover ? 0  : isClick ? 9 : 5,
          height: isHover ? 0  : isClick ? 9 : 5,
          scale:  isClick ? 1.4 : 1,
        }}
        transition={SNAP}
        aria-hidden
      />
    </>
  )
}
