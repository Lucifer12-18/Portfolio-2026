"use client"

import { useRef, useCallback, type PropsWithChildren, type CSSProperties } from "react"
import { cn } from "@/lib/utils"

type SpotlightProps = PropsWithChildren<{
  /** Spotlight radius in px (default 260) */
  size?: number
  /** Override tint — rgb triple "r, g, b". Default: cyan */
  color?: string
  /** Strength of the spotlight fill, 0–1. Default 0.14 */
  intensity?: number
  className?: string
  style?: CSSProperties
  /** Render as <article> / <section> etc. Default <div>. */
  as?: "div" | "article" | "section"
}>

/**
 * Spotlight — a cursor-follow radial wash painted through the wrapping element.
 *
 * Sets `--mx` / `--my` CSS vars on mousemove; a child pseudo-element renders
 * the radial-gradient using those vars. Uses rAF + a ref-set CSS variable so
 * there's zero React re-render per mouse event.
 */
export function Spotlight({
  children,
  size = 260,
  color = "34, 211, 238",
  intensity = 0.14,
  className,
  style,
  as = "div",
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      node.style.setProperty("--mx", `${x}px`)
      node.style.setProperty("--my", `${y}px`)
    })
  }, [])

  const onLeave = useCallback(() => {
    const node = ref.current
    if (!node) return
    // Move the light off-canvas on leave so the tint fades without animating opacity.
    node.style.setProperty("--mx", `-9999px`)
    node.style.setProperty("--my", `-9999px`)
  }, [])

  const Tag = as as "div"

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("spotlight-root", className)}
      style={{
        ...style,
        ["--spot-size" as string]: `${size}px`,
        ["--spot-color" as string]: color,
        ["--spot-intensity" as string]: intensity,
      }}
    >
      {children}
    </Tag>
  )
}
