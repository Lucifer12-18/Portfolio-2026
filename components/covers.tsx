"use client"

import type React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { CropMarks, FormationGlyph } from "@/components/storyboard"
import { accentHex } from "@/lib/chapter-palette"
import { NOTE_COVERS, type NoteMotif } from "@/lib/note-covers"

// ─────────────────────────────────────────────────────────────────────────────
// COVERS — the preview pictures on case-study and note cards (plus the case
// modal and note article heroes). One series, like book covers from the same
// press: charcoal stage, dotted paper, a pool of the cover's own pigment, crop
// marks, a shot label. Case covers show the WORK (real product where we have
// it); note covers are typographic posters — one oversized word + a motif.
// Colors come from the chapter palette so covers sit inside the site's arc.
// ─────────────────────────────────────────────────────────────────────────────

const mix = (hex: string, pct: number) => `color-mix(in oklab, ${hex} ${pct}%, transparent)`
const BONE_LINE = "rgba(242,241,236,0.24)"
const BONE_FAINT = "rgba(242,241,236,0.09)"
const INK = "#1a1a19"

function Stage({
  pigment,
  label,
  tag,
  glow = "72% 28%",
  className,
  children,
}: {
  pigment: string
  label?: string
  tag?: string
  glow?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("cover-stage @container h-full w-full", className)} style={{ color: pigment }}>
      <div
        aria-hidden
        className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.12]"
        style={{
          background: `radial-gradient(62% 78% at ${glow}, ${mix(pigment, 30)}, transparent 70%), radial-gradient(55% 60% at 8% 105%, ${mix(pigment, 12)}, transparent 70%)`,
        }}
      />
      {children}
      <CropMarks inset={10} color="rgba(242,241,236,0.28)" />
      {label && (
        <span className="absolute left-4 bottom-3 z-10 font-mono text-[9.5px] tracking-[0.04em] text-bone-3">{label}</span>
      )}
      {tag && (
        <span className="absolute right-4 top-3 z-10 font-mono text-[9.5px] tracking-[0.04em] text-bone-3">{tag}</span>
      )}
    </div>
  )
}

/** Shared SVG canvas — fills the stage, crops like a photograph. */
function Art({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 400 250"
      preserveAspectRatio="xMidYMid slice"
      className={cn(
        "absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]",
        className,
      )}
      aria-hidden
    >
      {children}
    </svg>
  )
}

const dotted = (w = 2.2, gap = 5) =>
  ({ fill: "none", stroke: "currentColor", strokeWidth: w, strokeLinecap: "round", strokeDasharray: `0 ${gap}`, className: "sb-dots" }) as const

// ── Case covers ──────────────────────────────────────────────────────────────

function HirelloCover({ featured }: { featured?: boolean }) {
  const p = accentHex(4) // periwinkle — the Work chapter
  return (
    <Stage pigment={p} label="SH 04.1 · hirello.ai / pipeline" glow="80% 18%">
      {/* Real product, framed and tilted onto the stage */}
      <div className="absolute left-[8%] top-[14%] w-[108%] -rotate-[2.5deg] origin-top-left transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0 group-hover:-translate-y-[2%]">
        <div className="overflow-hidden rounded-[10px] border border-hair-2 bg-[#1a1a19] shadow-[0_40px_80px_-24px_rgba(0,0,0,0.85)]">
          <div className="flex items-center gap-1.5 px-3 h-[22px] border-b border-hair">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-[5px] w-[5px] rounded-full bg-bone-4" />
            ))}
            <span className="ml-2 font-mono text-[8.5px] text-bone-3">hirello.ai/pipeline</span>
          </div>
          <div className="relative aspect-[1315/1080]">
            <Image
              src="/hirello-pipeline.png"
              alt=""
              fill
              sizes={featured ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 768px) 100vw, 40vw"}
              loading={featured ? "eager" : "lazy"}
              className="object-cover object-left-top brightness-[0.93]"
            />
          </div>
        </div>
      </div>
      {/* Floating evidence chip */}
      <div
        className="absolute right-[5%] bottom-[11%] z-10 rounded-[10px] border bg-[rgb(17_17_16/0.82)] px-3 py-2 backdrop-blur-md transition-transform duration-700 group-hover:-translate-y-1"
        style={{ borderColor: mix(p, 45) }}
      >
        <span className="block font-mono text-[9px] text-bone-3">onboarding completion</span>
        <span className="block text-[20px] leading-none tracking-[-0.04em] tabular-nums" style={{ color: p }}>
          +18%
        </span>
      </div>
    </Stage>
  )
}

function PolicyCover() {
  const p = accentHex(3) // lavender
  const lit = new Set([5, 7, 11])
  return (
    <Stage pigment={p} label="SH 04.2 · 12 policies → 1 interface" glow="75% 40%">
      <Art>
        {Array.from({ length: 12 }, (_, i) => {
          const c = i % 4
          const r = Math.floor(i / 4)
          const on = lit.has(i)
          return (
            <g key={i}>
              <rect
                x={42 + c * 36}
                y={62 + r * 38}
                width={26}
                height={26}
                rx={7}
                fill={on ? mix(p, 22) : "rgba(242,241,236,0.03)"}
                stroke={on ? p : BONE_LINE}
                strokeWidth={on ? 1.3 : 0.8}
              />
              <text x={47 + c * 36} y={79 + r * 38} fontSize={8} fontFamily="var(--font-mono)" fill={on ? p : "rgba(242,241,236,0.4)"}>
                {String(i + 1).padStart(2, "0")}
              </text>
            </g>
          )
        })}
        <path d="M188 113 C 214 113, 222 96, 250 96" {...dotted()} />
        <path d="M152 151 C 206 151, 216 138, 250 138" {...dotted()} />
        <path d="M188 189 C 216 189, 222 178, 250 178" {...dotted()} />

        <rect x={250} y={56} width={120} height={150} rx={12} fill={INK} stroke={BONE_LINE} />
        <path d="M250 76 L370 76" stroke={BONE_FAINT} />
        <circle cx={262} cy={66} r={2.2} fill={BONE_LINE} />
        <circle cx={270} cy={66} r={2.2} fill={BONE_LINE} />
        <rect x={262} y={86} width={70} height={7} rx={3.5} fill={BONE_FAINT} />
        <rect x={262} y={98} width={52} height={7} rx={3.5} fill={BONE_FAINT} />
        <rect x={262} y={116} width={96} height={34} rx={8} fill={mix(p, 12)} stroke={p} strokeOpacity={0.55} />
        <circle cx={274} cy={128} r={3.5} fill={p} />
        <rect x={284} y={125} width={56} height={6} rx={3} fill="rgba(242,241,236,0.6)" />
        <rect x={274} y={138} width={40} height={5} rx={2.5} fill={BONE_LINE} />
        <rect x={262} y={176} width={96} height={20} rx={10} fill="none" stroke={BONE_LINE} />
        <circle cx={348} cy={186} r={6} fill="rgba(242,241,236,0.9)" />
      </Art>
    </Stage>
  )
}

function RedditCover() {
  const p = accentHex(1) // terracotta
  // Before: a dense, noisy feed. After: two calm cards and one focus.
  const noise = [34, 22, 40, 28, 16, 36, 24, 30, 20, 38, 26, 18]
  return (
    <Stage pigment={p} label="SH 04.3 · density → focus" glow="78% 45%">
      <Art>
        {noise.map((w, i) => (
          <g key={i} opacity={0.35 + (i % 3) * 0.15}>
            <rect x={36} y={40 + i * 14} width={112} height={10} rx={3} fill="rgba(242,241,236,0.04)" stroke={BONE_FAINT} />
            <rect x={41} y={43 + i * 14} width={w} height={4} rx={2} fill={BONE_LINE} />
            <rect x={45 + w} y={43 + i * 14} width={48 - (w % 20)} height={4} rx={2} fill={BONE_FAINT} />
          </g>
        ))}
        <path d="M162 125 L206 125" {...dotted()} />
        <path d="M200 119 L207 125 L200 131" fill="none" stroke={p} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />

        <rect x={222} y={46} width={140} height={70} rx={12} fill={INK} stroke={p} strokeOpacity={0.7} />
        <rect x={236} y={60} width={56} height={8} rx={4} fill="rgba(242,241,236,0.75)" />
        <rect x={236} y={76} width={108} height={5} rx={2.5} fill={BONE_LINE} />
        <rect x={236} y={86} width={84} height={5} rx={2.5} fill={BONE_LINE} />
        <rect x={236} y={98} width={38} height={10} rx={5} fill={p} />
        <rect x={222} y={128} width={140} height={46} rx={12} fill={INK} stroke={BONE_LINE} opacity={0.8} />
        <rect x={236} y={142} width={70} height={6} rx={3} fill={BONE_LINE} />
        <rect x={236} y={154} width={96} height={5} rx={2.5} fill={BONE_FAINT} />
        <rect x={222} y={186} width={140} height={30} rx={12} fill={INK} stroke={BONE_FAINT} opacity={0.6} />
      </Art>
    </Stage>
  )
}

function DashboardCover() {
  const p = accentHex(5) // sage
  const pts: [number, number][] = [
    [70, 178], [100, 170], [130, 174], [160, 156], [190, 160], [220, 138], [250, 142], [280, 116], [310, 104], [340, 84],
  ]
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ")
  return (
    <Stage pigment={p} label="SH 04.4 · ai × jobs, 2020 → now" glow="80% 25%">
      <Art>
        <rect x={52} y={36} width={306} height={178} rx={14} fill={INK} stroke={BONE_LINE} />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${68 + i * 96} 52)`}>
            <rect width={84} height={34} rx={8} fill="rgba(242,241,236,0.03)" stroke={i === 0 ? p : BONE_FAINT} strokeOpacity={i === 0 ? 0.6 : 1} />
            <rect x={10} y={9} width={30} height={4} rx={2} fill={BONE_LINE} />
            <rect x={10} y={19} width={i === 0 ? 46 : 36} height={8} rx={3} fill={i === 0 ? p : "rgba(242,241,236,0.55)"} />
          </g>
        ))}
        {[110, 140, 170, 200].map((y) => (
          <path key={y} d={`M68 ${y} L342 ${y}`} stroke={BONE_FAINT} strokeWidth={0.8} />
        ))}
        <path d={`${line} L340 200 L70 200 Z`} fill={mix(p, 14)} />
        <path d={line} {...dotted(2.4, 5.5)} />
        <circle cx={340} cy={84} r={4.5} fill={p} />
        <circle cx={340} cy={84} r={9} fill="none" stroke={p} strokeOpacity={0.35} />
      </Art>
    </Stage>
  )
}

export function CaseCover({ file, featured, className }: { file: string; featured?: boolean; className?: string }) {
  let cover: React.ReactNode
  switch (file) {
    case "hirello_ai.tsx":
      cover = <HirelloCover featured={featured} />
      break
    case "ai_policy_by_design.fig":
      cover = <PolicyCover />
      break
    case "reddit_redesign.tsx":
      cover = <RedditCover />
      break
    case "job_dashboard.tsx":
      cover = <DashboardCover />
      break
    default:
      cover = (
        <Stage pigment={accentHex(4)}>
          <div className="absolute inset-[22%]">
            <FormationGlyph index={4} />
          </div>
        </Stage>
      )
  }
  return <div className={cn("absolute inset-0", className)}>{cover}</div>
}

// ── Note covers — typographic posters ───────────────────────────────────────

type Motif = NoteMotif

function MotifArt({ motif, p }: { motif: Motif; p: string }) {
  switch (motif) {
    case "stack": // progressive disclosure — one card revealed, the rest waiting
      return (
        <>
          {[2, 1, 0].map((i) => (
            <rect
              key={i}
              x={20 + i * 10}
              y={14 + i * 12}
              width={80}
              height={46}
              rx={8}
              fill={i === 0 ? INK : "none"}
              stroke={i === 0 ? p : BONE_LINE}
              strokeOpacity={i === 0 ? 0.8 : 0.6 - i * 0.2}
            />
          ))}
          <rect x={30} y={26} width={36} height={5} rx={2.5} fill="rgba(242,241,236,0.7)" />
          <rect x={30} y={36} width={56} height={4} rx={2} fill={BONE_LINE} />
          <rect x={30} y={46} width={20} height={7} rx={3.5} fill={p} />
        </>
      )
    case "grid": // systems — nodes and the one path through them
      return (
        <>
          {Array.from({ length: 16 }, (_, i) => (
            <circle key={i} cx={24 + (i % 4) * 24} cy={16 + Math.floor(i / 4) * 16} r={2.4} fill={BONE_LINE} />
          ))}
          <path d="M24 16 L48 32 L72 32 L96 64" {...dotted(2, 4.5)} />
          <circle cx={96} cy={64} r={4} fill={p} />
        </>
      )
    case "path": // story — seven stages, one arc
      return (
        <>
          <path d="M14 60 C 34 60, 30 20, 56 22 S 86 56, 108 26" {...dotted(2.2, 4.8)} />
          {[
            [14, 60], [30, 44], [44, 26], [60, 23], [76, 36], [92, 46], [108, 26],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 6 ? 4.2 : 2.6} fill={i === 6 ? p : "#161615"} stroke={i === 6 ? "none" : BONE_LINE} />
          ))}
        </>
      )
    case "ruler": // measurement — ticks, one reading
      return (
        <>
          <path d="M12 52 L112 52" stroke={BONE_LINE} strokeWidth={1} />
          {Array.from({ length: 21 }, (_, i) => (
            <path key={i} d={`M${12 + i * 5} 52 L${12 + i * 5} ${i % 5 === 0 ? 40 : 46}`} stroke={i <= 13 ? p : BONE_LINE} strokeWidth={1} />
          ))}
          <path d="M77 30 L77 58" stroke={p} strokeWidth={1.4} />
          <text x={82} y={34} fontSize={9} fontFamily="var(--font-mono)" fill={p}>
            1 / 4
          </text>
        </>
      )
    default: // wait — a loading ring caught mid-turn
      return (
        <>
          <circle cx={62} cy={38} r={24} fill="none" stroke={BONE_FAINT} strokeWidth={4} />
          <path d="M62 14 A 24 24 0 1 1 38 38" {...dotted(3, 6.2)} />
          <text x={52} y={42} fontSize={10} fontFamily="var(--font-mono)" fill="rgba(242,241,236,0.7)">
            3s
          </text>
        </>
      )
  }
}

export function NoteCover({
  slug,
  number,
  tag,
  className,
}: {
  slug: string
  number: number
  tag?: string
  className?: string
}) {
  const spec = NOTE_COVERS[slug] ?? { word: "Note.", pigment: 5, motif: "grid" as Motif }
  const p = accentHex(spec.pigment)
  // Longer words set smaller so every poster fills its width the same way.
  const size = Math.min(34, 150 / spec.word.length)
  return (
    <div className={cn("absolute inset-0", className)}>
      <Stage pigment={p} glow="85% 20%">
        <span className="absolute left-4 top-3 z-10 font-mono text-[9.5px] tracking-[0.04em] text-bone-3">
          N°{String(number).padStart(2, "0")}
          {tag && <span className="text-bone-4"> · {tag}</span>}
        </span>
        <svg
          viewBox="0 0 124 76"
          className="absolute right-[7%] top-[16%] w-[34%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-[1.05]"
          aria-hidden
        >
          <MotifArt motif={spec.motif} p={p} />
        </svg>
        <span
          aria-hidden
          className="absolute left-[6%] bottom-[5%] font-medium leading-none pb-[0.08em] tracking-[-0.065em] whitespace-nowrap transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[4%]"
          style={{
            fontSize: `${size}cqw`,
            background: `linear-gradient(100deg, ${p} 0%, color-mix(in oklab, ${p} 50%, #f2f1ec) 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {spec.word}
        </span>
      </Stage>
    </div>
  )
}

