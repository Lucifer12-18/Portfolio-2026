"use client"

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react"
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion"
import { FOLLOW_SPRING } from "@/lib/motion"
import { pointerState, fieldPulse } from "@/lib/pointer-state"

// ─────────────────────────────────────────────────────────────────────────────
// The single pointer signal. One listener, one source of truth. DOM consumers
// read the FOLLOW-spring-smoothed motion values; the 3D layers read the raw
// pointerState singleton in their frame loops. Everything that reacts to the
// pointer — field, wisps, content parallax, cursor — leans the same way at
// depth-correct ratios, so one mouse move moves the whole world coherently.
// ─────────────────────────────────────────────────────────────────────────────

interface PointerCtx {
  sx: MotionValue<number>
  sy: MotionValue<number>
}

const PointerContext = createContext<PointerCtx | null>(null)

export function PointerProvider({ children }: { children: ReactNode }) {
  // Raw normalized pointer, fed into a FOLLOW spring for buttery DOM parallax.
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, FOLLOW_SPRING)
  const sy = useSpring(y, FOLLOW_SPRING)

  useEffect(() => {
    if (typeof window === "undefined") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -((e.clientY / window.innerHeight) * 2 - 1) // +1 at top, -1 at bottom
      // Raw singleton — for the R3F field + wisps (they damp it themselves).
      pointerState.x = nx
      pointerState.y = ny
      // DOM spring source — skip entirely under reduced-motion.
      if (!reduce) {
        x.set(nx)
        y.set(ny)
      }
    }

    // Click ripple — record the origin in NDC and fire the pulse; the field reads it.
    const onDown = (e: PointerEvent) => {
      fieldPulse.x = (e.clientX / window.innerWidth) * 2 - 1
      fieldPulse.y = -((e.clientY / window.innerHeight) * 2 - 1)
      fieldPulse.value = 1
    }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [x, y])

  return <PointerContext.Provider value={{ sx, sy }}>{children}</PointerContext.Provider>
}

export function usePointer() {
  return useContext(PointerContext)
}

// ── Depth-scaled parallax layer ─────────────────────────────────────────────
// Wrap any DOM layer; it drifts a few px with the shared pointer. `strength` is
// the max travel in px — give nearer/heavier layers a smaller value than the
// field so the depth ordering reads correctly. Leans the same visual direction
// as the 3D field (content rises when you point up).
export function PointerParallax({
  strength = 6,
  className,
  style,
  children,
}: {
  strength?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const ctx = useContext(PointerContext)
  // Unconditional fallback motion value keeps hook order stable if used outside a provider.
  const fallback = useMotionValue(0)
  const sx = ctx?.sx ?? fallback
  const sy = ctx?.sy ?? fallback
  const tx = useTransform(sx, (v) => v * strength)
  const ty = useTransform(sy, (v) => -v * strength) // screen-down is +y, so invert

  return (
    <motion.div className={className} style={{ x: tx, y: ty, ...style }}>
      {children}
    </motion.div>
  )
}
