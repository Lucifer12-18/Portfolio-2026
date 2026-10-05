import type React from "react"

// ─────────────────────────────────────────────────────────────────────────────
// 1SE UI — 1 Second Everyday's language, sampled from the shipped app: teal
// header #0C8A93, the signature yellow #FFBA00, a near-black canvas, bold
// date numerals on day tiles, pill CTAs. Screens are drawn at 390×844 (an
// iPhone in points) and scaled by <PhoneFrame>. Real photos are replaced with
// abstract "moment" gradients: the audit screenshots had real people in them.
// ─────────────────────────────────────────────────────────────────────────────

export const S = {
  teal: "#0C8A93",
  tealSoft: "#63ABBB",
  yellow: "#FFBA00",
  canvas: "#0C0C0C",
  panel: "#1F1F1F",
  raised: "#2A2A2C",
  tab: "#353A40",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.62)",
  faint: "rgba(255,255,255,0.38)",
  hair: "rgba(255,255,255,0.12)",
  red: "#FF453A",
} as const

export const FONT = "var(--font-figtree), system-ui, sans-serif"

/** Abstract stand-ins for a day's one-second clip. */
export const MOMENTS = [
  "radial-gradient(60% 50% at 70% 25%, #ffd59a 0%, transparent 60%), linear-gradient(170deg, #f39c6b 0%, #b0577a 55%, #3b2a5a 100%)", // sunset drive
  "radial-gradient(50% 40% at 30% 70%, #9fd37a 0%, transparent 65%), linear-gradient(160deg, #6fae4a 0%, #2f5e2a 60%, #1c3519 100%)", // grass, the cat
  "radial-gradient(40% 30% at 60% 30%, #ffe08a 0%, transparent 70%), linear-gradient(180deg, #1d2a4a 0%, #0f1424 100%)", // city lights
  "radial-gradient(60% 60% at 40% 40%, #f5e6c8 0%, transparent 70%), linear-gradient(150deg, #c9a27a 0%, #7a5236 100%)", // coffee, a table
  "radial-gradient(55% 45% at 50% 30%, #bfe7ff 0%, transparent 70%), linear-gradient(170deg, #5aa7d6 0%, #2b5d8a 60%, #183652 100%)", // lake
  "radial-gradient(50% 50% at 60% 60%, #ffb3a8 0%, transparent 70%), linear-gradient(140deg, #e86f6f 0%, #8a2f4a 100%)", // concert
  "radial-gradient(45% 30% at 72% 16%, #fff1c2 0%, transparent 62%), radial-gradient(60% 40% at 50% 92%, #b9bcc0 0%, transparent 70%), linear-gradient(176deg, #9cb877 0%, #5f7a47 38%, #6e7479 68%, #3a3e43 100%)", // bike path, late sun
  "radial-gradient(50% 50% at 30% 30%, #fff1b8 0%, transparent 70%), linear-gradient(160deg, #e2b84d 0%, #8a6a1f 100%)", // beach
]

export const moment = (i: number) => MOMENTS[((i % MOMENTS.length) + MOMENTS.length) % MOMENTS.length]

export function Screen({ children, bg = S.canvas }: { children: React.ReactNode; bg?: string }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden" style={{ background: bg, color: S.text, fontFamily: FONT }}>
      {children}
    </div>
  )
}

export function StatusBar({ tint = "transparent" }: { tint?: string }) {
  return (
    <div className="flex h-[54px] flex-shrink-0 items-end justify-between px-8 pb-2 text-[16px] font-semibold" style={{ background: tint }}>
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <span className="flex items-end gap-[2px]">
          {[5, 7, 9, 11].map((h) => (
            <span key={h} className="w-[3px] rounded-[1px] bg-white" style={{ height: h }} />
          ))}
        </span>
        <span className="ml-1 h-[11px] w-[22px] rounded-[3px] border border-white/70 p-[1.5px]">
          <span className="block h-full w-[70%] rounded-[1px] bg-white" />
        </span>
      </span>
    </div>
  )
}

export function TealHeader({ title, left, right }: { title: string; left?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ background: S.teal }}>
      <StatusBar />
      <div className="flex h-[60px] items-center justify-between px-6">
        <span className="flex items-center gap-3 text-[24px] font-bold tracking-[-0.01em]">
          {left}
          {title}
        </span>
        {right}
      </div>
    </div>
  )
}

export function TabBar({ active = "Project" }: { active?: string }) {
  return (
    <div className="mt-auto grid h-[86px] flex-shrink-0 grid-cols-5 pt-3" style={{ background: S.tab }}>
      {["Now", "Project", "Rewind", "Get Pro", "Profile"].map((t) => (
        <span key={t} className="flex flex-col items-center gap-1.5 text-[11.5px]" style={{ color: t === active ? S.tealSoft : S.text }}>
          <span className="h-[22px] w-[22px] rounded-[7px] border-2" style={{ borderColor: t === active ? S.tealSoft : "rgba(255,255,255,0.85)" }} />
          {t}
        </span>
      ))}
    </div>
  )
}

/** A day tile: the clip as background, weekday + bold date numeral on top. */
export function DayTile({ i, dow, n, dim, className, style }: { i: number; dow?: string; n?: number; dim?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`} style={{ background: moment(i), opacity: dim ? 0.45 : 1, ...style }}>
      {dow && (
        <span className="absolute left-2.5 top-2 leading-none">
          <span className="block text-[12px] font-medium opacity-90">{dow}</span>
          <span className="block text-[30px] font-extrabold tracking-[-0.03em]">{n}</span>
        </span>
      )}
    </div>
  )
}

/** Numbered audit marker. */
export function Pin({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <span
      className="absolute z-20 grid h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[16px] font-bold"
      style={{ left: x, top: y, background: S.yellow, color: "#111", boxShadow: "0 0 0 5px rgba(255,186,0,0.25), 0 6px 16px rgba(0,0,0,0.5)" }}
    >
      {n}
    </span>
  )
}

export function PillBtn({ children, kind = "white", className }: { children: React.ReactNode; kind?: "white" | "yellow" | "teal" | "ghost" | "disabled"; className?: string }) {
  const style: React.CSSProperties =
    kind === "yellow"
      ? { background: S.yellow, color: "#111" }
      : kind === "teal"
        ? { background: S.tealSoft, color: "#0b2b30" }
        : kind === "ghost"
          ? { border: `1px solid ${S.hair}`, color: S.text }
          : kind === "disabled"
            ? { background: "#8E9399", color: "#B9BEC3" }
            : { background: "#fff", color: "#111" }
  return (
    <span className={`flex h-[56px] items-center justify-center rounded-full text-[17px] font-bold ${className ?? ""}`} style={style}>
      {children}
    </span>
  )
}

/** The redesign's day header: the date is the hero. */
export function DateHero({ dow, date, sub }: { dow: string; date: string; sub?: string }) {
  return (
    <div className="px-6 pt-1">
      <span className="text-[14px] font-medium" style={{ color: S.tealSoft }}>
        ‹ Project
      </span>
      <p className="mt-3 text-[40px] font-extrabold leading-none tracking-[-0.035em]">{dow}</p>
      <p className="mt-2 text-[15px]" style={{ color: S.muted }}>
        {date}
        {sub && <span style={{ color: S.faint }}> · {sub}</span>}
      </p>
    </div>
  )
}

/** The yellow record ring — the one place the signature colour appears. */
export function RecordRing({ recording, progress = 0 }: { recording?: boolean; progress?: number }) {
  const r = 38
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 96 96" className="h-[96px] w-[96px]" aria-hidden>
      <circle cx={48} cy={48} r={r} fill="none" stroke={recording ? "rgba(255,255,255,0.18)" : S.yellow} strokeWidth={6} />
      {recording && (
        <circle cx={48} cy={48} r={r} fill="none" stroke={S.yellow} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${c * progress} ${c}`} transform="rotate(-90 48 48)" />
      )}
      {recording ? <rect x={34} y={34} width={28} height={28} rx={6} fill={S.red} /> : <circle cx={48} cy={48} r={30} fill="#fff" />}
    </svg>
  )
}
