"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { animate, motion, useMotionTemplate, useMotionValue, useMotionValueEvent } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CropMarks } from "@/components/storyboard"
import { EASE_SETTLE } from "@/lib/motion"
import { prefersReducedMotion } from "@/lib/use-reduced-motion"
import { sfx } from "@/lib/sound"

// ─────────────────────────────────────────────────────────────────────────────
// LOGIC ↔ EXPERIENCE LENS — Scene 02's thesis made literal. One frame, two
// drawings of the same capability: the raw LOGIC (flowcharts, tokens, sticky
// notes, JSON) and the finished EXPERIENCE (screens, components, insights, a
// feedback card). Drag the seam to move between them; each new capability
// sweeps the experience in from the right.
// ─────────────────────────────────────────────────────────────────────────────

const MONO = "var(--font-mono)"
const SANS = "var(--font-sans)"
const G_TEXT = "rgba(242,241,236,0.46)"
const G_LINE = "rgba(242,241,236,0.24)"
const G_FAINT = "rgba(242,241,236,0.08)"
const INK = "#1b1b1a"
const BONE = "rgba(242,241,236,0.9)"

const hair = { fill: "none", stroke: G_LINE, strokeWidth: 1 } as const
const dotted = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeDasharray: "0 5", className: "sb-dots" } as const

function Label({ x, y, children, size = 10, fill = G_TEXT, anchor }: { x: number; y: number; children: React.ReactNode; size?: number; fill?: string; anchor?: "middle" | "end" }) {
  return (
    <text x={x} y={y} fontSize={size} fontFamily={MONO} fill={fill} textAnchor={anchor}>
      {children}
    </text>
  )
}

// ── 01 Product & interaction ────────────────────────────────────────────────

const flowsLogic = (
  <>
    <rect x={24} y={96} width={58} height={30} rx={4} {...hair} />
    <Label x={53} y={115} anchor="middle">start</Label>
    <path d="M82 111 L104 111" {...hair} />
    <path d="M130 88 L154 111 L130 134 L106 111 Z" {...hair} />
    <Label x={130} y={114} anchor="middle" size={9}>auth?</Label>
    <path d="M154 111 L172 111" {...hair} />
    <rect x={172} y={96} width={66} height={30} rx={4} {...hair} />
    <Label x={205} y={115} anchor="middle">onboard</Label>
    <path d="M238 111 L256 111" {...hair} />
    <rect x={256} y={96} width={58} height={30} rx={4} {...hair} />
    <Label x={285} y={115} anchor="middle">profile</Label>
    <path d="M314 111 L330 111" {...hair} />
    <rect x={330} y={96} width={48} height={30} rx={4} {...hair} />
    <Label x={354} y={115} anchor="middle">home</Label>
    <path d="M130 134 L130 160" {...hair} />
    <rect x={102} y={160} width={56} height={26} rx={4} {...hair} />
    <Label x={130} y={177} anchor="middle">login</Label>
    <Label x={172} y={84} size={9}>step 1/3 · if !user → login</Label>
    <Label x={24} y={44} size={9} fill="rgba(242,241,236,0.3)">flow.onboarding.v6</Label>
  </>
)

const flowsExperience = (p: string) => (
  <>
    <rect x={56} y={26} width={84} height={174} rx={16} fill={INK} stroke={G_LINE} />
    <rect x={84} y={34} width={28} height={5} rx={2.5} fill={G_FAINT} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={70 + i * 20} y={52} width={16} height={4} rx={2} fill={i === 0 ? p : G_LINE} />
    ))}
    <rect x={68} y={68} width={52} height={8} rx={4} fill={BONE} />
    <rect x={68} y={82} width={60} height={5} rx={2.5} fill={G_LINE} />
    <rect x={68} y={92} width={44} height={5} rx={2.5} fill={G_LINE} />
    <rect x={68} y={108} width={60} height={30} rx={8} fill="none" stroke={p} strokeOpacity={0.7} />
    <circle cx={80} cy={123} r={5} fill={p} />
    <rect x={90} y={120} width={30} height={5} rx={2.5} fill={BONE} opacity={0.7} />
    <rect x={68} y={170} width={60} height={18} rx={9} fill={p} />
    <text x={98} y={182} fontSize={8} fontFamily={SANS} fill="#111" textAnchor="middle" fontWeight={500}>Continue</text>

    <path d="M140 179 C 158 179, 156 120, 172 120" {...dotted} />

    <rect x={172} y={42} width={200} height={146} rx={10} fill={INK} stroke={G_LINE} />
    <path d="M172 58 L372 58" stroke={G_FAINT} />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={182 + i * 8} cy={50} r={2.2} fill={G_LINE} />
    ))}
    <rect x={180} y={66} width={40} height={112} rx={6} fill={G_FAINT} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={186} y={76 + i * 14} width={i === 0 ? 28 : 22} height={5} rx={2.5} fill={i === 0 ? p : G_LINE} />
    ))}
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${228 + i * 72} 66)`}>
        <rect width={64} height={40} rx={7} fill="rgba(242,241,236,0.03)" stroke={i === 0 ? p : G_FAINT} strokeOpacity={i === 0 ? 0.6 : 1} />
        <rect x={9} y={10} width={24} height={4} rx={2} fill={G_LINE} />
        <rect x={9} y={21} width={i === 0 ? 38 : 30} height={9} rx={3} fill={i === 0 ? p : BONE} opacity={i === 0 ? 1 : 0.55} />
      </g>
    ))}
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={228} y={116 + i * 20} width={136} height={14} rx={5} fill="rgba(242,241,236,0.03)" />
        <rect x={236} y={121 + i * 20} width={50 - i * 8} height={4} rx={2} fill={G_LINE} />
        <rect x={340} y={120 + i * 20} width={16} height={6} rx={3} fill={i === 0 ? p : G_FAINT} />
      </g>
    ))}
  </>
)

// ── 02 Design systems ────────────────────────────────────────────────────────

const tokenLines = [
  "--chapter:   #e07a9e;",
  "--radius-md: 12px;",
  "--space-4:   16px;",
  "--font:      Geist 500;",
  ".btn-solid { bg: var(--bone) }",
  ".chip:hover { bg: var(--chapter) }",
]

const tokensLogic = (
  <>
    <Label x={28} y={42} size={9} fill="rgba(242,241,236,0.3)">tokens.css</Label>
    {tokenLines.map((l, i) => (
      <Label key={l} x={28} y={66 + i * 24} size={11}>
        {l}
      </Label>
    ))}
    <Label x={250} y={42} size={9} fill="rgba(242,241,236,0.3)">tokens.json</Label>
    {['{', '  "color": { … },', '  "space": [4, 8, 16],', '  "type":  [12, 15, 21],', '  "radius": [6, 12, 18]', '}'].map((l, i) => (
      <Label key={i} x={250} y={66 + i * 20} size={10}>
        {l}
      </Label>
    ))}
  </>
)

const tokensExperience = (p: string) => (
  <>
    {[p, "#f2f1ec", "#8f8e88", "#262624", "#e2c49a"].map((c, i) => (
      <circle key={i} cx={40 + i * 26} cy={52} r={9} fill={c} stroke={i === 3 ? G_LINE : "none"} />
    ))}
    <rect x={30} y={82} width={96} height={30} rx={8} fill={p} />
    <text x={78} y={101} fontSize={10} fontFamily={MONO} fill="#111" textAnchor="middle">Send a note</text>
    <rect x={134} y={82} width={78} height={30} rx={8} fill="none" stroke={G_LINE} />
    <text x={173} y={101} fontSize={10} fontFamily={MONO} fill={BONE} textAnchor="middle">Résumé</text>
    <rect x={30} y={126} width={44} height={24} rx={12} fill={p} />
    <circle cx={62} cy={138} r={9} fill="#111" />
    <rect x={84} y={126} width={44} height={24} rx={12} fill="none" stroke={G_LINE} />
    <circle cx={96} cy={138} r={9} fill={G_LINE} />
    <text x={30} y={200} fontSize={40} fontFamily={SANS} fontWeight={500} fill={BONE} letterSpacing={-2}>Aa</text>
    {[0, 1, 2].map((i) => (
      <rect key={i} x={96} y={172 + i * 10} width={[70, 52, 36][i]} height={4} rx={2} fill={i === 0 ? p : G_LINE} />
    ))}
    <rect x={232} y={46} width={140} height={150} rx={14} fill={INK} stroke={G_LINE} />
    <circle cx={256} cy={72} r={11} fill={G_FAINT} stroke={p} strokeOpacity={0.6} />
    <rect x={274} y={64} width={60} height={6} rx={3} fill={BONE} />
    <rect x={274} y={76} width={42} height={5} rx={2.5} fill={G_LINE} />
    <rect x={246} y={98} width={112} height={5} rx={2.5} fill={G_LINE} />
    <rect x={246} y={108} width={92} height={5} rx={2.5} fill={G_LINE} />
    <rect x={246} y={118} width={100} height={5} rx={2.5} fill={G_FAINT} />
    <rect x={246} y={140} width={46} height={16} rx={8} fill="none" stroke={p} />
    <rect x={298} y={140} width={46} height={16} rx={8} fill="none" stroke={G_LINE} />
    <rect x={246} y={168} width={112} height={16} rx={6} fill={p} opacity={0.9} />
  </>
)

// ── 03 Research & evaluation ────────────────────────────────────────────────

const notes: [number, number, number][] = [
  [30, 40, -6], [86, 62, 5], [150, 34, -3], [210, 70, 7], [270, 38, -8], [330, 64, 4],
  [44, 118, 6], [112, 136, -5], [178, 112, 3], [246, 140, -4], [316, 120, 8],
  [70, 176, -3], [196, 180, 6], [296, 178, -6],
]

const researchLogic = (
  <>
    {notes.map(([x, y, r], i) => (
      <g key={i} transform={`rotate(${r} ${x + 18} ${y + 14})`}>
        <rect x={x} y={y} width={40} height={30} rx={3} fill="rgba(242,241,236,0.04)" stroke={G_LINE} />
        <path d={`M${x + 6} ${y + 10} q 6 -3 12 0 t 12 0 M${x + 6} ${y + 18} q 5 -3 10 0 t 10 0`} fill="none" stroke={G_TEXT} strokeWidth={1} />
      </g>
    ))}
    <Label x={186} y={24} size={9} fill="rgba(242,241,236,0.3)" anchor="middle">12 interviews · raw notes</Label>
  </>
)

const researchExperience = (p: string) => (
  <>
    {["onboarding", "trust", "pace"].map((h, c) => (
      <g key={h}>
        <Label x={36 + c * 92} y={38} size={9} fill={c === 0 ? p : G_TEXT}>
          {h}
        </Label>
        {Array.from({ length: c === 0 ? 4 : 3 }, (_, i) => (
          <rect
            key={i}
            x={36 + c * 92}
            y={46 + i * 24}
            width={78}
            height={18}
            rx={4}
            fill={c === 0 ? `color-mix(in oklab, ${p} 14%, transparent)` : "rgba(242,241,236,0.04)"}
            stroke={c === 0 ? p : G_FAINT}
            strokeOpacity={c === 0 ? 0.5 : 1}
          />
        ))}
      </g>
    ))}
    <rect x={236} y={150} width={140} height={52} rx={10} fill={INK} stroke={p} />
    <circle cx={250} cy={166} r={4} fill={p} />
    <text x={260} y={169} fontSize={10} fontFamily={SANS} fill={BONE} fontWeight={500}>Friction at step 3</text>
    <text x={250} y={190} fontSize={16} fontFamily={SANS} fill={p} fontWeight={500} letterSpacing={-0.5}>+18%</text>
    <Label x={294} y={189} size={8.5}>completion</Label>
    <path d="M114 128 C 150 150, 190 176, 236 176" {...dotted} />
  </>
)

// ── 04 AI, data & systems ────────────────────────────────────────────────────

const jsonLines = ["{", '  "answer_id": "a_1042",', '  "examples_found": 1,', '  "examples_expected": 4,', '  "confidence": 0.62,', '  "latency_ms": 3120', "}"]
const scatter: [number, number][] = [
  [262, 150], [276, 132], [290, 158], [300, 118], [314, 140], [326, 104], [338, 126], [350, 92], [360, 116], [284, 176], [332, 170], [306, 86],
]

const aiLogic = (
  <>
    <Label x={28} y={42} size={9} fill="rgba(242,241,236,0.3)">POST /v1/feedback → 200</Label>
    {jsonLines.map((l, i) => (
      <Label key={i} x={28} y={66 + i * 20} size={11}>
        {l}
      </Label>
    ))}
    {scatter.map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={2.4} fill={G_TEXT} />
    ))}
    <path d="M256 60 L256 190 L376 190" {...hair} />
  </>
)

const aiExperience = (p: string) => {
  const r = 30
  const c = 2 * Math.PI * r
  return (
    <>
      <rect x={40} y={30} width={320} height={166} rx={16} fill={INK} stroke={G_LINE} />
      <Label x={60} y={56} size={9}>Your answer · feedback</Label>
      <circle cx={100} cy={112} r={r} fill="none" stroke={G_FAINT} strokeWidth={7} />
      <circle
        cx={100}
        cy={112}
        r={r}
        fill="none"
        stroke={p}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={`${c * 0.25} ${c}`}
        transform="rotate(-90 100 112)"
      />
      <text x={100} y={118} fontSize={16} fontFamily={SANS} fill={BONE} textAnchor="middle" fontWeight={500}>1/4</text>
      <text x={150} y={96} fontSize={15} fontFamily={SANS} fill={BONE} fontWeight={500} letterSpacing={-0.4}>1 of 4 concrete examples</text>
      <rect x={150} y={106} width={150} height={5} rx={2.5} fill={G_LINE} />
      <rect x={150} y={116} width={120} height={5} rx={2.5} fill={G_LINE} />
      <rect x={150} y={132} width={96} height={18} rx={9} fill={`color-mix(in oklab, ${p} 16%, transparent)`} stroke={p} strokeOpacity={0.5} />
      <Label x={162} y={144} size={8.5} fill={p}>medium confidence</Label>
      <path d="M60 170 L340 170" stroke={G_FAINT} />
      <Label x={60} y={186} size={9}>how to fix →</Label>
      <Label x={340} y={186} size={9} anchor="end">analysed in 3.1s</Label>
    </>
  )
}

// ── The lens ────────────────────────────────────────────────────────────────

export const LENS_VIEWS = [
  { logic: flowsLogic, experience: flowsExperience },
  { logic: tokensLogic, experience: tokensExperience },
  { logic: researchLogic, experience: researchExperience },
  { logic: aiLogic, experience: aiExperience },
]

export function LogicLens({ view, pigment = "var(--chapter)" }: { view: number; pigment?: string }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const pos = useMotionValue(50) // % of width where the seam sits
  const [ariaPos, setAriaPos] = useState(50)
  const [dragging, setDragging] = useState(false) // cursor styling only
  const draggingRef = useRef(false) // the truth — no waiting on a re-render
  useMotionValueEvent(pos, "change", (v) => {
    setAriaPos(Math.round(v))
    // While dragging, the tone crossfades logic → experience with the seam
    if (draggingRef.current) sfx.seamMove(1 - v / 100)
  })

  const clip = useMotionTemplate`inset(0 0 0 ${pos}%)`
  const left = useMotionTemplate`${pos}%`

  // Each capability sweeps its experience in from the right edge.
  useEffect(() => {
    if (prefersReducedMotion()) {
      pos.set(50)
      return
    }
    pos.set(96)
    const a = animate(pos, 50, { duration: 1.3, ease: EASE_SETTLE, delay: 0.15 })
    return () => a.stop()
  }, [view, pos])

  const setFromClientX = (clientX: number) => {
    const r = stageRef.current?.getBoundingClientRect()
    if (!r) return
    pos.set(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
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

  const { logic, experience } = LENS_VIEWS[view] ?? LENS_VIEWS[0]

  return (
    <div
      ref={stageRef}
      className={`group relative aspect-[16/9] overflow-hidden rounded-[14px] border border-hair bg-[#131312] select-none touch-pan-y ${
        dragging ? "cursor-grabbing" : "cursor-ew-resize"
      }`}
      style={{ color: pigment }}
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
      onPointerUp={() => {
        draggingRef.current = false
        setDragging(false)
        sfx.seamEnd()
      }}
      onPointerCancel={() => {
        draggingRef.current = false
        setDragging(false)
        sfx.seamEnd()
      }}
      data-sfx-skip
      // Horizontal drags here must not become chapter swipes
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: "radial-gradient(circle, rgba(242,241,236,0.05) 1px, transparent 1px)", backgroundSize: "12px 12px" }}
      />

      {/* LOGIC — full width underneath */}
      <svg viewBox="0 0 400 225" className="absolute inset-0 h-full w-full" aria-hidden>
        {logic}
      </svg>

      {/* EXPERIENCE — revealed to the right of the seam */}
      <motion.div aria-hidden className="absolute inset-0" style={{ clipPath: clip }}>
        <div
          className="absolute inset-0 bg-[#141413]"
          style={{ background: `radial-gradient(70% 90% at 70% 40%, color-mix(in oklab, ${pigment} 16%, #141413), #141413 70%)` }}
        />
        <svg viewBox="0 0 400 225" className="absolute inset-0 h-full w-full">
          {experience(pigment)}
        </svg>
      </motion.div>

      <CropMarks inset={10} />
      <span className="pointer-events-none absolute left-4 top-3 z-10 rounded-full border border-hair-2 bg-[rgb(19_19_18/0.8)] px-2.5 py-0.5 font-mono text-[10px] text-bone-3">
        Logic
      </span>
      <span
        className="pointer-events-none absolute right-4 top-3 z-10 rounded-full border px-2.5 py-0.5 font-mono text-[10px] text-[#111110]"
        style={{ background: pigment, borderColor: pigment }}
      >
        Experience
      </span>

      {/* The seam */}
      <motion.div className="absolute inset-y-0 z-20 w-0" style={{ left }}>
        <span aria-hidden className="absolute inset-y-0 -left-px w-[2px] bg-bone/80 shadow-[0_0_24px_rgba(242,241,236,0.35)]" />
        <button
          type="button"
          role="slider"
          aria-label="Compare logic and experience"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={ariaPos}
          aria-valuetext={`${100 - ariaPos}% experience`}
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
