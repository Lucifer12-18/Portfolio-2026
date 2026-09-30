"use client"

import type React from "react"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { childSlide } from "@/lib/motion"

// ─────────────────────────────────────────────────────────────────────────────
// STORYBOARD — the site is told as scenes, and scenes are told in PANELS: a
// framed sketch (crop marks, shot number) with a one-line caption underneath,
// the way a film storyboard reads. Text shrinks to captions; the drawing
// carries the idea.
//
// Every drawing is made of DOTTED strokes (round caps on a 0-length dash) so it
// reads as the same particle matter as the 3D field, in the chapter pigment
// (currentColor ← text-chapter). Hovering a panel sets the dots marching.
// ─────────────────────────────────────────────────────────────────────────────

const BONE_LINE = "rgba(242,241,236,0.26)"
const BONE_FAINT = "rgba(242,241,236,0.1)"

/** Dotted stroke props — the "particle" line. */
const dots = (size = 1.9, gap = 3.6) =>
  ({
    fill: "none",
    stroke: "currentColor",
    strokeWidth: size,
    strokeLinecap: "round",
    strokeDasharray: `0 ${gap}`,
    className: "sb-dots",
  }) as const

const hair = { fill: "none", stroke: BONE_LINE, strokeWidth: 0.8 } as const

function sample(fn: (t: number) => [number, number], steps: number, t0: number, t1: number, close = false) {
  let d = ""
  for (let i = 0; i <= steps; i++) {
    const [x, y] = fn(t0 + ((t1 - t0) * i) / steps)
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `
  }
  return close ? d + "Z" : d
}

// ── Formation glyphs — the seven particle shapes, one per scene ─────────────

export function FormationGlyph({
  index,
  className,
  dot = 1.9,
  gap = 3.6,
}: {
  index: number
  className?: string
  dot?: number
  gap?: number
}) {
  const d = dots(dot, gap)
  const body = useMemo(() => {
    switch (index) {
      case 0: // fibonacci sphere
        return (
          <>
            <circle cx="50" cy="32" r="26" {...d} />
            <ellipse cx="50" cy="32" rx="26" ry="8" {...d} />
            <ellipse cx="50" cy="32" rx="26" ry="17" {...d} opacity={0.55} />
            <ellipse cx="50" cy="32" rx="10" ry="26" {...d} opacity={0.55} />
          </>
        )
      case 1: {
        // double helix
        const a = sample((x) => [x, 32 + 15 * Math.sin((x / 40) * Math.PI * 2)], 60, 8, 92)
        const b = sample((x) => [x, 32 + 15 * Math.sin((x / 40) * Math.PI * 2 + Math.PI)], 60, 8, 92)
        const rungs = Array.from({ length: 11 }, (_, i) => 12 + i * 7.6)
        return (
          <>
            {rungs.map((x) => (
              <line
                key={x}
                x1={x}
                x2={x}
                y1={32 + 15 * Math.sin((x / 40) * Math.PI * 2)}
                y2={32 - 15 * Math.sin((x / 40) * Math.PI * 2)}
                stroke={BONE_FAINT}
                strokeWidth={0.8}
              />
            ))}
            <path d={a} {...d} />
            <path d={b} {...d} opacity={0.6} />
          </>
        )
      }
      case 2: // torus
        return (
          <>
            <ellipse cx="50" cy="33" rx="40" ry="21" {...d} />
            <ellipse cx="50" cy="33" rx="27" ry="13" {...d} opacity={0.5} />
            <ellipse cx="50" cy="31" rx="14" ry="5.5" {...d} />
          </>
        )
      case 3: {
        // trefoil knot
        const p = sample(
          (t) => [50 + 8.6 * (Math.sin(t) + 2 * Math.sin(2 * t)), 33 + 8.6 * (Math.cos(t) - 2 * Math.cos(2 * t)) * 0.95],
          120,
          0,
          Math.PI * 2,
          true,
        )
        return <path d={p} {...d} />
      }
      case 4: {
        // crystal lattice — an isometric cube with its inner grid
        const top = "M50 8 L74 20 L50 32 L26 20 Z"
        return (
          <>
            <path d="M38 14 L62 26 M62 14 L38 26 M26 20 L26 44 M50 32 L50 56 M74 20 L74 44" {...hair} stroke={BONE_FAINT} />
            <path d={top} {...d} />
            <path d="M26 20 L26 44 L50 56 L74 44 L74 20" {...d} />
            <path d="M50 32 L50 56" {...d} opacity={0.6} />
            {[
              [50, 8],
              [74, 20],
              [50, 32],
              [26, 20],
              [26, 44],
              [50, 56],
              [74, 44],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={dot * 0.9} fill="currentColor" />
            ))}
          </>
        )
      }
      case 5: // wave surface
        return (
          <>
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={sample((x) => [x, 17 + i * 10 + (6.5 - i * 1.1) * Math.sin((x / 26) * Math.PI + i * 0.9)], 60, 8, 92)}
                {...d}
                opacity={1 - i * 0.18}
              />
            ))}
          </>
        )
      default: {
        // starburst
        const rays = Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2
          const r = i % 2 ? 17 : 27
          return `M${50 + Math.cos(a) * 6} ${32 + Math.sin(a) * 6} L${50 + Math.cos(a) * r} ${32 + Math.sin(a) * r}`
        }).join(" ")
        return (
          <>
            <path d={rays} {...d} />
            <circle cx="50" cy="32" r={dot * 1.3} fill="currentColor" />
          </>
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, dot, gap])

  return (
    <svg viewBox="0 0 100 64" className={cn("h-full w-full overflow-visible", className)} aria-hidden>
      {body}
    </svg>
  )
}

// ── Sketches — one small drawing per panel idea ─────────────────────────────

const d = dots()

const SKETCHES: Record<string, React.ReactNode> = {
  // Origin
  logic: (
    <>
      <path d="M80 18 L48 46 M80 18 L112 46 M48 46 L32 76 M48 46 L64 76 M112 46 L96 76 M112 46 L128 76" {...hair} />
      <path d="M80 18 L112 46 L96 76" {...d} />
      {[
        [80, 18],
        [48, 46],
        [112, 46],
        [32, 76],
        [64, 76],
        [96, 76],
        [128, 76],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4.5} fill={i === 0 || i === 2 || i === 5 ? "currentColor" : "#161615"} stroke={i === 0 || i === 2 || i === 5 ? "none" : BONE_LINE} />
      ))}
    </>
  ),
  deliver: (
    <>
      {[22, 30, 38, 46, 54, 62, 70, 78].map((y, i) => (
        <line key={y} x1={20} x2={20 + [34, 22, 40, 18, 30, 38, 14, 26][i]} y1={y} y2={y} stroke={BONE_LINE} strokeWidth={2} strokeLinecap="round" />
      ))}
      <path d="M68 50 L88 50" {...d} />
      <path d="M85 46 L89 50 L85 54" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      {[22, 44, 66].map((y) => (
        <rect key={y} x={98} y={y} width={42} height={14} rx={4} fill="none" stroke="currentColor" strokeWidth={1.2} />
      ))}
      <path d="M119 36 L119 44 M119 58 L119 66" {...d} />
    </>
  ),
  network: (
    <>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2
        return <path key={i} d={`M80 50 L${80 + Math.cos(a) * 34} ${50 + Math.sin(a) * 30}`} {...d} />
      })}
      <ellipse cx="80" cy="50" rx="34" ry="30" {...hair} stroke={BONE_FAINT} />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2
        return <circle key={i} cx={80 + Math.cos(a) * 34} cy={50 + Math.sin(a) * 30} r={5} fill="#161615" stroke={BONE_LINE} />
      })}
      <circle cx="80" cy="50" r="8" fill="currentColor" />
    </>
  ),
  components: (
    <>
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => (
          <rect
            key={`${c}-${r}`}
            x={34 + c * 32}
            y={24 + r * 28}
            width={26}
            height={22}
            rx={5}
            fill={c === 1 && r === 0 ? "currentColor" : "none"}
            fillOpacity={0.9}
            stroke={c === 1 && r === 0 ? "currentColor" : BONE_LINE}
            strokeWidth={1}
          />
        )),
      )}
      <path d="M79 46 L79 52" {...d} />
      <path d="M128 18 l2.6 6 6 2.6 -6 2.6 -2.6 6 -2.6 -6 -6 -2.6 6 -2.6 z" fill="currentColor" />
    </>
  ),

  // Shift — capabilities
  screens: (
    <>
      <rect x={22} y={22} width={74} height={52} rx={5} fill="none" stroke={BONE_LINE} />
      <path d="M22 32 L96 32" {...hair} />
      <rect x={30} y={40} width={30} height={6} rx={2} fill={BONE_FAINT} />
      <rect x={30} y={52} width={46} height={4} rx={2} fill={BONE_FAINT} />
      <rect x={112} y={30} width={28} height={50} rx={6} fill="none" stroke="currentColor" strokeWidth={1.2} />
      <rect x={118} y={40} width={16} height={4} rx={2} fill="currentColor" opacity={0.7} />
      <path d="M96 56 C 104 56, 104 62, 112 62" {...d} />
    </>
  ),
  tokens: (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={34 + i * 16} cy={30} r={6} fill={i === 2 ? "currentColor" : "none"} stroke={i === 2 ? "none" : BONE_LINE} />
      ))}
      <text x={30} y={66} fill="rgba(242,241,236,0.8)" fontSize={20} fontFamily="var(--font-sans)" fontWeight={500}>
        Aa
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={64} y={52 + i * 8} width={[44, 34, 24][i]} height={3} rx={1.5} fill={i === 0 ? "currentColor" : BONE_LINE} />
      ))}
      <rect x={116} y={50} width={24} height={24} rx={6} fill="none" stroke="currentColor" strokeWidth={1.2} />
      <path d="M122 62 L134 62" {...d} />
    </>
  ),
  abtest: (
    <>
      {["A", "B"].map((l, k) => (
        <g key={l} transform={`translate(${28 + k * 58} 18)`}>
          <rect width={46} height={62} rx={5} fill="none" stroke={k ? "currentColor" : BONE_LINE} strokeWidth={k ? 1.2 : 1} />
          <text x={6} y={13} fontSize={8} fontFamily="var(--font-mono)" fill={k ? "currentColor" : "rgba(242,241,236,0.5)"}>
            {l}
          </text>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={8 + i * 11}
              y={52 - (k ? [18, 26, 34] : [14, 18, 12])[i]}
              width={7}
              height={(k ? [18, 26, 34] : [14, 18, 12])[i]}
              rx={1.5}
              fill={k ? "currentColor" : BONE_LINE}
              opacity={k ? 0.85 : 1}
            />
          ))}
        </g>
      ))}
    </>
  ),
  signal: (
    <>
      {[
        [28, 70], [38, 62], [44, 72], [52, 56], [60, 64], [68, 50], [76, 58], [84, 44], [92, 50], [100, 38], [108, 46], [116, 32], [124, 40], [132, 26],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2} fill={BONE_LINE} />
      ))}
      <path d="M26 72 L134 26" {...d} />
      <path d="M134 60 l2.4 5.6 5.6 2.4 -5.6 2.4 -2.4 5.6 -2.4 -5.6 -5.6 -2.4 5.6 -2.4 z" fill="currentColor" />
    </>
  ),

  // Method
  listen: (
    <>
      <circle cx={46} cy={50} r={6} fill="currentColor" />
      {[16, 28, 40, 52].map((r, i) => (
        <path key={r} d={`M${46 + r * Math.cos(-0.9)} ${50 + r * Math.sin(-0.9)} A ${r} ${r} 0 0 1 ${46 + r * Math.cos(0.9)} ${50 + r * Math.sin(0.9)}`} {...d} opacity={1 - i * 0.2} />
      ))}
      <rect x={112} y={30} width={30} height={8} rx={4} fill={BONE_FAINT} />
      <rect x={112} y={46} width={22} height={8} rx={4} fill={BONE_FAINT} />
      <rect x={112} y={62} width={26} height={8} rx={4} fill={BONE_FAINT} />
    </>
  ),
  map: (
    <>
      <path d="M22 70 C 44 70, 44 30, 66 30 S 92 70, 112 58 S 130 30, 140 30" {...d} />
      {[
        [22, 70],
        [66, 30],
        [104, 62],
        [140, 30],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={5} fill={i === 3 ? "currentColor" : "#161615"} stroke={i === 3 ? "none" : BONE_LINE} />
        </g>
      ))}
      <path d="M100 22 L108 22 M104 18 L104 26" stroke={BONE_LINE} strokeWidth={1} />
    </>
  ),
  prototype: (
    <>
      <rect x={34} y={16} width={92} height={66} rx={6} fill="none" stroke={BONE_LINE} />
      <path d="M34 28 L126 28" {...hair} />
      <rect x={42} y={36} width={34} height={22} rx={3} fill={BONE_FAINT} />
      <rect x={84} y={36} width={34} height={6} rx={3} fill={BONE_FAINT} />
      <rect x={84} y={48} width={24} height={6} rx={3} fill={BONE_FAINT} />
      <rect x={42} y={64} width={30} height={10} rx={5} fill="currentColor" />
      <path d="M92 58 L92 74 L96 70 L100 78 L103 76.5 L99 69 L104 68 Z" fill="rgba(242,241,236,0.9)" />
    </>
  ),
  ship: (
    <>
      <path d="M22 78 L138 78" {...hair} />
      <path d="M26 72 L54 64 L78 66 L104 44 L132 26" {...d} />
      <path d="M132 26 L132 10" stroke={BONE_LINE} strokeWidth={1} />
      <path d="M132 10 L146 14 L132 18 Z" fill="currentColor" />
      {[
        [54, 64],
        [78, 66],
        [104, 44],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={3} fill="#161615" stroke={BONE_LINE} />
      ))}
    </>
  ),
}

export type SketchName = keyof typeof SKETCHES

export function Sketch({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 160 100" className={cn("h-full w-full", className)} aria-hidden>
      {SKETCHES[name]}
    </svg>
  )
}

// ── Frame + Panel ────────────────────────────────────────────────────────────

/** Viewfinder crop marks — the storyboard frame language. */
export function CropMarks({ inset = 8, size = 9, color = "rgba(242,241,236,0.3)" }: { inset?: number; size?: number; color?: string }) {
  const s = { position: "absolute", width: size, height: size, borderColor: color } as const
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      <span style={{ ...s, top: inset, left: inset, borderTopWidth: 1, borderLeftWidth: 1 }} />
      <span style={{ ...s, top: inset, right: inset, borderTopWidth: 1, borderRightWidth: 1 }} />
      <span style={{ ...s, bottom: inset, left: inset, borderBottomWidth: 1, borderLeftWidth: 1 }} />
      <span style={{ ...s, bottom: inset, right: inset, borderBottomWidth: 1, borderRightWidth: 1 }} />
    </span>
  )
}

/** A storyboard frame — dotted paper, a pool of pigment, crop marks, shot label. */
export function Frame({
  children,
  shot,
  className,
  pigment,
}: {
  children: React.ReactNode
  shot?: string
  className?: string
  /** Hex override; defaults to the live chapter pigment. */
  pigment?: string
}) {
  const p = pigment ?? "var(--chapter)"
  return (
    <div
      className={cn("relative overflow-hidden rounded-[12px] border border-hair bg-[#131312]", className)}
      style={{ color: p }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: "radial-gradient(circle, rgba(242,241,236,0.05) 1px, transparent 1px)", backgroundSize: "12px 12px" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-700 opacity-70 group-hover:opacity-100"
        style={{ background: `radial-gradient(70% 80% at 50% 45%, color-mix(in oklab, ${p} 14%, transparent), transparent 72%)` }}
      />
      <CropMarks />
      {shot && <span className="absolute left-3 top-2.5 z-10 font-mono text-[9.5px] tracking-[0.04em] text-bone-3">{shot}</span>}
      <div className="absolute inset-0">{children}</div>
    </div>
  )
}

/** Panel = frame + caption. The unit of storytelling on every scene. */
export function Panel({
  shot,
  title,
  caption,
  meta,
  sketch,
  tags,
  index = 0,
  className,
}: {
  shot: string
  title: string
  caption: string
  meta?: string
  sketch: string
  /** Short mono tags under the caption — replaces bullet lists. */
  tags?: readonly string[]
  index?: number
  className?: string
}) {
  return (
    <motion.figure
      variants={childSlide}
      initial="hidden"
      animate="show"
      custom={3 + index}
      className={cn("group flex flex-col gap-3", className)}
    >
      <Frame shot={shot} className="aspect-[16/11]">
        <div className="absolute inset-x-[8%] inset-y-[14%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
          <Sketch name={sketch} />
        </div>
      </Frame>
      <figcaption className="space-y-1 px-0.5">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[15px] leading-tight tracking-[-0.02em] text-bone">{title}</span>
          {meta && <span className="font-mono text-[10px] text-bone-3 tabular-nums whitespace-nowrap">{meta}</span>}
        </span>
        <span className="block text-[13px] leading-[1.45] text-bone-3">{caption}</span>
        {tags && (
          <span className="block pt-1 font-mono text-[10px] leading-[1.6] text-bone-3">
            {tags.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className="text-bone-4"> · </span>}
                {t}
              </span>
            ))}
          </span>
        )}
      </figcaption>
    </motion.figure>
  )
}
