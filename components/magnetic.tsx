"use client"

import { useRef, type PropsWithChildren, type CSSProperties } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

type MagneticProps = PropsWithChildren<{
  /** How far the element drifts toward the cursor, in px. Default 8 */
  strength?: number
  /** Activation distance from element center, in px. Default 90 */
  range?: number
  className?: string
  style?: CSSProperties
}>

/**
 * Magnetic — wraps children in a spring-tracked element that drifts toward
 * the cursor when it's near. Subtle by default — keeps the cursor in charge,
 * the element just acknowledges proximity.
 *
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
export function Magnetic({
  children,
  strength = 8,
  range = 90,
  className,
  style,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    if (dist > range) {
      x.set(0)
      y.set(0)
      return
    }
    // Linear falloff — closer = stronger pull, eases off at the activation edge.
    const pull = (1 - dist / range) * strength
    x.set((dx / dist) * pull)
    y.set((dy / dist) * pull)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
