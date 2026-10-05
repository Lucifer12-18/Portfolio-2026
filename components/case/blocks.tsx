import type React from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChapterTint } from "@/components/chapter-tint"
import { CropMarks } from "@/components/storyboard"
import { Reveal, ScaleToFit, SceneIndex, SceneJump } from "@/components/case/kit"
import { DEEP_CASES, shortTitle, type CaseMeta } from "@/lib/cases"
import { caseGraph } from "@/lib/seo"

// ─────────────────────────────────────────────────────────────────────────────
// CASE KIT (static half) — the storyboard grammar every case study is written
// in. A case is a sequence of numbered Scenes; each scene is a headline, a
// caption no longer than two lines, and one big visual. Decisions sit beside
// visuals as "Decision → Why" cards so a recruiter can skim the reasoning
// without reading paragraphs. Server-rendered; motion comes from kit.tsx.
// ─────────────────────────────────────────────────────────────────────────────

// ── Shell ────────────────────────────────────────────────────────────────────

export function CaseShell({
  meta,
  scenes,
  children,
}: {
  meta: CaseMeta
  scenes: { id: string; label: string }[]
  children: React.ReactNode
}) {
  const i = DEEP_CASES.findIndex((c) => c.slug === meta.slug)
  const next = DEEP_CASES[(i + 1) % DEEP_CASES.length]
  return (
    <div className="min-h-screen bg-ink-0" data-case-page>
      <ChapterTint index={meta.pigment} />
      {/* The case as an Article + breadcrumb trail, for search engines. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(caseGraph(meta)) }} />
      <header className="sticky top-0 z-50 grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-hair bg-[rgb(15_15_14/0.8)] px-5 backdrop-blur-xl md:px-8">
        <Link
          href="/#chapter-4"
          className="inline-flex items-center gap-2 justify-self-start font-mono text-[11px] text-bone-3 transition-colors hover:text-bone"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span className="hidden sm:inline">All work</span>
          <span className="sm:hidden">Work</span>
        </Link>
        <SceneJump scenes={scenes} />
        <span className="justify-self-end font-sans text-[14px] font-semibold uppercase tracking-[0.02em]">
          <span className="hidden text-bone sm:inline">Pixelogic </span>
          <span className="text-chapter">OS</span>
        </span>
      </header>
      <SceneIndex scenes={scenes} />
      <main id="top" className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 md:px-8">
        {children}
      </main>
      <footer className="mx-auto mt-10 w-full max-w-6xl px-5 pb-16 md:px-8">
        {next && next.slug !== meta.slug && (
          <Link
            href={next.href!}
            className="group flex items-center justify-between gap-6 rounded-[18px] border border-hair-2 px-6 py-6 transition-colors hover:border-bone/40 md:px-8 md:py-8"
          >
            <span>
              <span className="label-mono block">Next case</span>
              <span className="mt-2 block text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] tracking-[-0.04em] text-bone">
                {shortTitle(next.title)}
                <span className="text-bone-3"> · {next.title.split(" · ")[1]}</span>
              </span>
              <span className="mt-1 block text-[14px] text-bone-3">{next.hook}</span>
            </span>
            <span className="arrow-chip arrow-chip-lg">
              <ArrowUpRight strokeWidth={1.6} />
            </span>
          </Link>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-bone-3">
          <Link href="/#chapter-4" className="inline-flex items-center gap-2 hover:text-bone">
            <ArrowLeft className="h-3 w-3" strokeWidth={1.6} /> Back to all work
          </Link>
          <span>Vishal Deshmukh · Product Designer</span>
        </div>
      </footer>
    </div>
  )
}

// ── Hero + the 30-second read ────────────────────────────────────────────────

export function CaseHero({
  kicker,
  dim,
  accent,
  hook,
  meta,
  visual,
}: {
  kicker: string
  dim: string
  accent: string
  hook: string
  meta: { k: string; v: string }[]
  visual: React.ReactNode
}) {
  return (
    <section className="pt-14 md:pt-20">
      <Reveal>
        <span className="eyebrow">{kicker}</span>
        <h1 className="mt-6 max-w-[16ch] text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.055em] text-bone">
          <span className="ink-dim">{dim}</span> <span className="ink-accent">{accent}</span>
        </h1>
        <p className="lede mt-6 !max-w-[54ch]">{hook}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <dl className="mt-10 grid grid-cols-2 border-y border-hair md:grid-cols-5">
          {meta.map((m, i) => (
            <div
              key={m.k}
              className={cn(
                "py-4 pr-4",
                i % 2 === 1 && "border-l border-hair pl-4 md:pl-5",
                i > 0 && "md:border-l md:border-hair md:pl-5",
                i >= 2 && "border-t border-hair md:border-t-0",
              )}
            >
              <dt className="label-mono">{m.k}</dt>
              <dd className="mt-1.5 text-[13.5px] leading-[1.4] text-bone">{m.v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal delay={0.18} className="mt-10">
        {visual}
      </Reveal>
    </section>
  )
}

export function ThirtySecondRead({
  bullets,
  stats,
}: {
  bullets: string[]
  stats: { value: string; label: string }[]
}) {
  return (
    <section aria-label="The 30-second read" className="pb-10 pt-14 md:pb-12 md:pt-20">
      <Reveal>
        <div className="grid gap-8 rounded-[20px] border border-hair-2 bg-[rgb(22_22_21/0.6)] p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-12 md:p-9">
          <div>
            <span className="label-mono">The 30-second read</span>
            <ul className="mt-5 space-y-3.5">
              {bullets.map((b) => (
                <li key={b} className="flex gap-3 text-[15.5px] leading-[1.55] text-bone-2">
                  <span aria-hidden className="mt-[0.6em] h-[5px] w-[5px] flex-shrink-0 rounded-[1px] bg-chapter" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <dl className="grid grid-cols-2 self-center border-t border-hair md:border-l md:border-t-0">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={cn("py-5 pl-0 md:pl-7", i % 2 === 1 && "border-l border-hair pl-5 md:pl-7", i >= 2 && "border-t border-hair")}
              >
                <dd className="text-[clamp(2rem,4vw,3rem)] leading-none tracking-[-0.05em] text-chapter tabular-nums">{s.value}</dd>
                <dt className="mt-2 font-mono text-[10.5px] leading-snug text-bone-3">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  )
}

/** "In this case study" — every scene as a numbered jump link, near the top. */
export function Contents({ scenes }: { scenes: { id: string; label: string }[] }) {
  return (
    <nav aria-label="In this case study" className="pb-14 md:pb-20">
      <Reveal>
        <div className="flex items-baseline justify-between border-b border-hair pb-3">
          <span className="label-mono">In this case study</span>
          <span className="label-mono">{scenes.length} scenes · jump to any</span>
        </div>
        <ol className="mt-3 grid grid-cols-1 gap-x-8 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {scenes.map((s, i) => (
            <li key={s.id} className="border-b border-hair/60">
              <a
                href={`#${s.id}`}
                className="group flex items-baseline gap-3 py-3 text-[14.5px] tracking-[-0.01em] text-bone-2 transition-colors hover:text-bone"
              >
                <span className="font-mono text-[10.5px] tabular-nums text-bone-4 transition-colors group-hover:text-chapter">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{s.label}</span>
                <span aria-hidden className="text-[12px] text-chapter opacity-0 transition-opacity group-hover:opacity-100">
                  ↓
                </span>
              </a>
            </li>
          ))}
        </ol>
      </Reveal>
    </nav>
  )
}

// ── Scenes ───────────────────────────────────────────────────────────────────

export function Scene({
  id,
  n,
  label,
  title,
  caption,
  children,
}: {
  id: string
  n: number
  label: string
  title: React.ReactNode
  caption?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-14 border-t border-hair py-16 md:py-24">
      <Reveal>
        <div className="mb-9 grid items-end gap-5 md:mb-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14">
          <div>
            <span className="eyebrow">
              Scene {String(n).padStart(2, "0")} · {label}
            </span>
            <h2 className="mt-4 text-[clamp(1.85rem,3.8vw,3rem)] font-medium leading-[1.02] tracking-[-0.045em] text-bone">
              {title}
            </h2>
          </div>
          {caption && <p className="max-w-[52ch] text-[15.5px] leading-[1.6] text-bone-2">{caption}</p>}
        </div>
      </Reveal>
      {children && <div className="space-y-6">{children}</div>}
    </section>
  )
}

/** A dark storyboard stage that holds a mockup: dotted paper, pigment pool, crop marks. */
export function Stage({
  children,
  shot,
  className,
  pad = "p-5 md:p-10",
}: {
  children: React.ReactNode
  shot?: string
  className?: string
  pad?: string
}) {
  return (
    <Reveal>
      <div className={cn("relative overflow-hidden rounded-[18px] border border-hair bg-[#131312]", className)}>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(242,241,236,0.05) 1px, transparent 1px)", backgroundSize: "12px 12px" }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(70% 70% at 60% 35%, color-mix(in oklab, var(--chapter) 16%, transparent), transparent 72%)" }}
        />
        <CropMarks inset={10} />
        {shot && <span className="absolute left-4 top-3 z-10 font-mono text-[9.5px] tracking-[0.04em] text-bone-3">{shot}</span>}
        <div className={cn("relative", pad)}>{children}</div>
      </div>
    </Reveal>
  )
}

/** Browser chrome around a light product screen, scaled from its design size. */
export function ScreenFrame({
  url,
  width = 1280,
  height = 800,
  children,
  className,
}: {
  url: string
  width?: number
  height?: number
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("overflow-hidden rounded-[12px] border border-hair-2 bg-[#1a1a19] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]", className)}>
      <div className="flex h-7 items-center gap-1.5 border-b border-hair px-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-[7px] w-[7px] rounded-full bg-bone-4" />
        ))}
        {/* Zero-basis wrapper: a long URL truncates instead of widening the
            frame (and the grid column it sits in) on small screens. */}
        <span className="ml-3 flex w-0 min-w-0 flex-1">
          <span className="max-w-full truncate rounded-full bg-white/[0.04] px-3 py-0.5 font-mono text-[9.5px] text-bone-3">{url}</span>
        </span>
      </div>
      <ScaleToFit width={width} height={height}>
        {children}
      </ScaleToFit>
    </div>
  )
}

/** An iPhone, drawn: bezel, island, a 390×844 screen scaled to fit. */
export function PhoneFrame({ children, className, label }: { children: React.ReactNode; className?: string; label?: string }) {
  return (
    <figure className={cn("mx-auto w-full max-w-[290px]", className)}>
      <div className="rounded-[46px] border border-hair-2 bg-[#0a0a0a] p-[9px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)]">
        <div className="relative overflow-hidden rounded-[38px] bg-black">
          <ScaleToFit width={390} height={844}>
            {children}
          </ScaleToFit>
          <span aria-hidden className="absolute left-1/2 top-[1.6%] h-[3.6%] w-[31%] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
      {label && <figcaption className="mt-3 text-center font-mono text-[10.5px] text-bone-3">{label}</figcaption>}
    </figure>
  )
}

// ── Reasoning blocks ─────────────────────────────────────────────────────────

export function Decisions({ items, cols = 3 }: { items: { decision: string; why: string }[]; cols?: 2 | 3 }) {
  return (
    <div className={cn("grid gap-3", cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
      {items.map((d, i) => (
        <Reveal key={d.decision} delay={i * 0.06}>
          <div className="h-full rounded-[16px] border border-hair-2 bg-[rgb(22_22_21/0.5)] p-5">
            <span className="label-mono">Decision</span>
            <p className="mt-2 text-[15.5px] leading-[1.4] tracking-[-0.015em] text-bone">{d.decision}</p>
            <span className="mt-4 block border-t border-hair pt-3 font-mono text-[10.5px] text-chapter">Why</span>
            <p className="mt-1.5 text-[13.5px] leading-[1.55] text-bone-3">{d.why}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

/** Numbered findings — the audit voice. */
export function Findings({ items, cols = 2 }: { items: string[]; cols?: 1 | 2 | 3 | 4 }) {
  const grid = { 1: "", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-2 lg:grid-cols-4" }[cols]
  return (
    <ol className={cn("grid gap-x-8 gap-y-4", grid)}>
      {items.map((t, i) => (
        <li key={t} className="flex gap-3.5 border-t border-hair pt-4">
          <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-chapter font-mono text-[10.5px] text-[#111110]">{i + 1}</span>
          <span className="text-[14px] leading-[1.55] text-bone-2">{t}</span>
        </li>
      ))}
    </ol>
  )
}

/** Short storyboard of how the work was made. */
export function ProcessStrip({ steps }: { steps: { k: string; title: string; note: string }[] }) {
  return (
    <ol className="grid gap-px overflow-hidden rounded-[16px] border border-hair bg-hair sm:grid-cols-2 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={{ ["--n" as string]: steps.length }}>
      {steps.map((s, i) => (
        <li key={s.title} className="relative bg-ink-0 p-5">
          <span className="font-mono text-[10px] text-bone-4">{String(i + 1).padStart(2, "0")}</span>
          <span className="mt-3 block font-mono text-[10.5px] text-chapter">{s.k}</span>
          <span className="mt-1 block text-[15px] leading-[1.3] tracking-[-0.015em] text-bone">{s.title}</span>
          <span className="mt-2 block text-[13px] leading-[1.5] text-bone-3">{s.note}</span>
        </li>
      ))}
    </ol>
  )
}

/** Remove / Keep / Rework, Now / Later — hairline columns. */
export function Columns({ cols }: { cols: { title: string; tone?: "accent" | "dim"; items: string[] }[] }) {
  return (
    <div className={cn("grid gap-3", cols.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
      {cols.map((c) => (
        <Reveal key={c.title}>
          <div className="h-full rounded-[16px] border border-hair-2 p-5">
            <span className={cn("font-mono text-[11px] tracking-[0.04em]", c.tone === "accent" ? "text-chapter" : c.tone === "dim" ? "text-bone-4" : "text-bone-2")}>
              {c.title}
            </span>
            <ul className="mt-3 space-y-2.5">
              {c.items.map((it) => (
                <li key={it} className="flex gap-2.5 text-[14px] leading-[1.5] text-bone-2">
                  <span aria-hidden className={cn("mt-[0.6em] h-px w-3 flex-shrink-0", c.tone === "accent" ? "bg-chapter" : "bg-bone-4")} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

/**
 * Many doors, one commit — the systems diagram behind the 1SE work, and a
 * useful shape for any "N entry points → one outcome" argument.
 */
export function ContractDiagram({
  entries,
  commit,
  label,
}: {
  entries: string[]
  commit: string
  label: string
}) {
  const h = Math.max(entries.length * 34, 120)
  return (
    <div className="grid items-center gap-4 rounded-[16px] border border-hair-2 p-5 sm:grid-cols-[minmax(0,1fr)_80px_minmax(0,0.8fr)] md:p-6">
      <ul className="space-y-2">
        {entries.map((e) => (
          <li key={e} className="rounded-full border border-hair-2 px-3.5 py-1.5 font-mono text-[11px] text-bone-2">
            {e}
          </li>
        ))}
      </ul>
      <svg viewBox={`0 0 80 ${h}`} className="hidden h-full w-full sm:block" preserveAspectRatio="none" aria-hidden>
        {entries.map((_, i) => {
          const y = (h / entries.length) * (i + 0.5)
          return (
            <path
              key={i}
              d={`M0 ${y} C 40 ${y}, 40 ${h / 2}, 80 ${h / 2}`}
              fill="none"
              stroke="var(--chapter)"
              strokeOpacity={0.55}
              strokeWidth={1.2}
              strokeDasharray="0 4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}
      </svg>
      <div className="rounded-[14px] border border-chapter bg-[color-mix(in_oklab,var(--chapter)_10%,transparent)] p-4">
        <span className="font-mono text-[10px] text-chapter">{label}</span>
        <p className="mt-1.5 text-[16px] leading-[1.3] tracking-[-0.02em] text-bone">{commit}</p>
      </div>
    </div>
  )
}

/** A wall of designed states, each a small labelled tile. */
export function StatesGrid({ states, phone }: { states: { label: string; node: React.ReactNode }[]; phone?: boolean }) {
  return (
    <div className={cn("grid gap-4", phone ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
      {states.map((s, i) => (
        <Reveal key={s.label} delay={(i % 6) * 0.05}>
          <figure>
            {s.node}
            <figcaption className="mt-2.5 text-center font-mono text-[10.5px] text-bone-3">{s.label}</figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  )
}

export function KeyTable({
  head,
  rows,
  highlightFirst,
}: {
  head: [string, string] | [string, string, string]
  rows: string[][]
  highlightFirst?: boolean
}) {
  return (
    <Reveal>
      <div className="overflow-x-auto rounded-[16px] border border-hair-2">
        <table className="w-full min-w-[520px] text-left">
          <thead>
            <tr className="border-b border-hair">
              {head.map((h) => (
                <th key={h} className="px-5 py-3 font-mono text-[10.5px] font-normal text-bone-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r[0]} className="border-b border-hair last:border-0">
                {r.map((c, k) => (
                  <td
                    key={k}
                    className={cn(
                      "px-5 py-3.5 align-top text-[14px] leading-[1.5]",
                      k === 0 ? "text-bone" : "text-bone-2",
                      k === 0 && highlightFirst && i === 0 && "text-chapter",
                    )}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  )
}

/** Quote-sized single line — the insight a scene turns on. */
export function Insight({ children, by }: { children: React.ReactNode; by?: string }) {
  return (
    <Reveal>
      <figure className="mx-auto max-w-3xl py-4 text-center">
        <blockquote className="text-[clamp(1.5rem,3.2vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.04em] text-bone">
          {children}
        </blockquote>
        {by && <figcaption className="mt-4 font-mono text-[11px] text-bone-3">{by}</figcaption>}
      </figure>
    </Reveal>
  )
}

// ── Design-system board ──────────────────────────────────────────────────────

const lum = (hex: string) => {
  const c = hex.replace("#", "")
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

export interface DSColor {
  name: string
  hex: string
  role: string
}

export function DesignSystemBoard({
  name,
  surface,
  ink,
  colors,
  gradients = [],
  type,
  shape,
  motion = [],
  components,
}: {
  name: string
  /** The product's canvas colour — swatches are checked for contrast against it. */
  surface: string
  /** The product's body text colour. */
  ink: string
  colors: DSColor[]
  gradients?: { name: string; css: string; use: string }[]
  type: { family: string; cssVar: string; role: string; sample: string; weight?: number; specs: string }[]
  shape: { label: string; value: string; radius?: number }[]
  motion?: { name: string; spec: string }[]
  components?: React.ReactNode
}) {
  return (
    <Reveal>
      <div className="overflow-hidden rounded-[20px] border border-hair-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hair px-5 py-3.5 md:px-7">
          <span className="font-mono text-[11px] text-bone-2">{name}</span>
          <span className="font-mono text-[10.5px] text-bone-4">tokens · type · shape · motion · components</span>
        </div>

        {/* Colour */}
        <div className="grid gap-px bg-hair md:grid-cols-[180px_1fr]">
          <div className="bg-ink-0 p-5 md:p-7">
            <span className="label-mono">Colour</span>
            <p className="mt-2 text-[12.5px] leading-[1.5] text-bone-3">Contrast checked against the product&apos;s own canvas.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-ink-0 p-5 sm:grid-cols-3 lg:grid-cols-4 md:p-7">
            {colors.map((c) => {
              // A colour that can't carry text on the canvas is a surface:
              // judge it by the product's text colour sitting on it instead.
              const asText = contrast(c.hex, surface)
              const asSurface = contrast(c.hex, ink)
              const grade = (x: number) => (x >= 4.5 ? "AA" : x >= 3 ? "AA large" : "below AA")
              const check = asText >= 3 ? `${grade(asText)} as text · ${asText.toFixed(1)}:1` : `${grade(asSurface)} under text · ${asSurface.toFixed(1)}:1`
              return (
                <div key={c.name} className="overflow-hidden rounded-[12px] border border-hair">
                  <div className="h-16" style={{ background: c.hex }} />
                  <div className="space-y-0.5 p-3">
                    <p className="text-[13px] text-bone">{c.name}</p>
                    <p className="font-mono text-[10.5px] text-bone-3">{c.hex.toUpperCase()}</p>
                    <p className="text-[11.5px] leading-[1.4] text-bone-3">{c.role}</p>
                    <p className="pt-1 font-mono text-[10px] text-bone-4">{check}</p>
                  </div>
                </div>
              )
            })}
            {gradients.map((g) => (
              <div key={g.name} className="overflow-hidden rounded-[12px] border border-hair">
                <div className="h-16" style={{ background: g.css }} />
                <div className="space-y-0.5 p-3">
                  <p className="text-[13px] text-bone">{g.name}</p>
                  <p className="text-[11.5px] leading-[1.4] text-bone-3">{g.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="grid gap-px border-t border-hair bg-hair md:grid-cols-[180px_1fr]">
          <div className="bg-ink-0 p-5 md:p-7">
            <span className="label-mono">Type</span>
          </div>
          <div className="grid gap-px bg-hair lg:grid-cols-2">
            {type.map((t) => (
              <div key={t.family} className="bg-ink-0 p-5 md:p-7">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[13px] text-bone">{t.family}</span>
                  <span className="font-mono text-[10.5px] text-bone-3">{t.role}</span>
                </div>
                <p
                  className="mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1] tracking-[-0.03em] text-bone"
                  style={{ fontFamily: `var(${t.cssVar}), serif`, fontWeight: t.weight ?? 500 }}
                >
                  {t.sample}
                </p>
                <p className="mt-4 font-mono text-[10.5px] leading-[1.7] text-bone-3">{t.specs}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shape + motion */}
        <div className="grid gap-px border-t border-hair bg-hair md:grid-cols-[180px_1fr]">
          <div className="bg-ink-0 p-5 md:p-7">
            <span className="label-mono">Shape &amp; motion</span>
          </div>
          <div className="grid gap-6 bg-ink-0 p-5 md:grid-cols-2 md:p-7">
            <ul className="flex flex-wrap gap-4">
              {shape.map((s) => (
                <li key={s.label} className="flex flex-col items-center gap-2">
                  <span
                    className="block h-14 w-14 border border-bone-3 bg-white/[0.03]"
                    style={{ borderRadius: s.radius ?? 0 }}
                    aria-hidden
                  />
                  <span className="text-center font-mono text-[10px] leading-[1.4] text-bone-3">
                    {s.label}
                    <br />
                    <span className="text-bone-4">{s.value}</span>
                  </span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              {motion.map((m) => (
                <li key={m.name} className="grid grid-cols-[110px_1fr] gap-3 border-t border-hair pt-2.5">
                  <span className="text-[13px] text-bone">{m.name}</span>
                  <span className="font-mono text-[10.5px] leading-[1.6] text-bone-3">{m.spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Components */}
        {components && (
          <div className="grid gap-px border-t border-hair bg-hair md:grid-cols-[180px_1fr]">
            <div className="bg-ink-0 p-5 md:p-7">
              <span className="label-mono">Components</span>
              <p className="mt-2 text-[12.5px] leading-[1.5] text-bone-3">Rendered live, in the product&apos;s own tokens.</p>
            </div>
            <div className="p-5 md:p-7" style={{ background: surface }}>
              {components}
            </div>
          </div>
        )}
      </div>
    </Reveal>
  )
}

/** Who did what — credit by role, honestly. */
export function Credits({ rows }: { rows: { who: string; what: string; me?: boolean }[] }) {
  return (
    <Reveal>
      <dl className="divide-y divide-hair border-y border-hair">
        {rows.map((r) => (
          <div key={r.who + r.what} className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-6">
            <dt className={cn("font-mono text-[11px]", r.me ? "text-chapter" : "text-bone-3")}>{r.who}</dt>
            <dd className="text-[14px] leading-[1.55] text-bone-2">{r.what}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}
