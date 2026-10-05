import type React from "react"

// ─────────────────────────────────────────────────────────────────────────────
// HIRELLO UI — a faithful re-drawing of the Networking Hub's visual language
// (tokens lifted from the product: primary #3B5BFF, gradient #3B5BFF→#7C5CFF,
// Fraunces for headings and numbers, Inter for everything else). Mockups are
// drawn at a fixed 1280-wide design size and scaled by <ScaleToFit>, so px
// values here are product pixels. All people and numbers are fictional.
// ─────────────────────────────────────────────────────────────────────────────

export const H = {
  primary: "#3B5BFF",
  soft: "#EBEFFF",
  violet: "#7C5CFF",
  grad: "linear-gradient(120deg, #3B5BFF 0%, #7C5CFF 100%)",
  accent: "linear-gradient(120deg, #7C3AED 0%, #C026D3 55%, #EC4899 100%)",
  ink: "#171826",
  muted: "#6B6F85",
  faint: "#9A9EB2",
  border: "#E9EAF1",
  bg: "#F8F7FA",
  card: "#FFFFFF",
  error: "#DC5B4A",
  linkedin: "#0A66C2",
  stage: { lead: "#8B5CF6", cold: "#3B82F6", engaged: "#E5A02E", interview: "#10A37F" },
} as const

export const SERIF = "var(--font-fraunces), Georgia, serif"
export const SANS = "var(--font-inter), system-ui, sans-serif"

const AVATAR_TINTS = ["#E8EDFF", "#FDECEC", "#E7F7F1", "#FFF3E0", "#F1EAFE", "#E6F4FB"]
const AVATAR_INK = ["#3B5BFF", "#C2453A", "#10805F", "#B7791F", "#7C3AED", "#0A6C9C"]

export function Avatar({ name, size = 32, i = 0 }: { name: string; size?: number; i?: number }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
  const k = i % AVATAR_TINTS.length
  return (
    <span
      className="grid flex-shrink-0 place-items-center rounded-full font-semibold"
      style={{ width: size, height: size, background: AVATAR_TINTS[k], color: AVATAR_INK[k], fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  )
}

export function Wordmark() {
  return (
    <span className="flex items-center text-[25px] font-bold tracking-[-0.04em]" style={{ fontFamily: SANS }}>
      <span style={{ background: "linear-gradient(90deg,#FF4D3A,#FF8A3C)", WebkitBackgroundClip: "text", color: "transparent" }}>hirell</span>
      <span className="ml-[1px] inline-block h-[17px] w-[17px] rounded-full border-[4px] border-[#3B9BFF]" />
    </span>
  )
}

/** The signed-in frame every Hirello screen sits in. */
export function AppShell({
  active = "Dashboard",
  children,
  pad = true,
}: {
  active?: "Dashboard" | "Toolbox" | "Academy"
  children: React.ReactNode
  pad?: boolean
}) {
  return (
    <div className="flex h-full w-full flex-col" style={{ background: H.bg, color: H.ink, fontFamily: SANS }}>
      <div className="flex h-[60px] flex-shrink-0 items-center justify-between border-b bg-white px-8" style={{ borderColor: H.border }}>
        <Wordmark />
        <nav className="flex items-center gap-1.5 text-[14px]">
          {(["Dashboard", "Toolbox", "Academy"] as const).map((n) => (
            <span
              key={n}
              className="rounded-full px-4 py-[7px]"
              style={n === active ? { background: H.grad, color: "#fff", fontWeight: 500 } : { color: H.muted }}
            >
              {n}
              {n === "Toolbox" && <span className="ml-1.5 text-[10px] opacity-70">▾</span>}
            </span>
          ))}
        </nav>
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-[13px]" style={{ color: H.muted }}>
            <span className="relative h-[18px] w-[32px] rounded-full" style={{ background: H.primary }}>
              <span className="absolute right-[2px] top-[2px] h-[14px] w-[14px] rounded-full bg-white" />
            </span>
            AI Mode
          </span>
          <span className="h-[18px] w-[18px] rounded-[5px] border-2" style={{ borderColor: H.faint }} />
          <Avatar name="Alex Rivera" size={34} i={3} />
        </span>
      </div>
      <div className={pad ? "min-h-0 flex-1 px-10 pb-8 pt-6" : "min-h-0 flex-1"}>{children}</div>
    </div>
  )
}

export function Crumbs({ items }: { items: string[] }) {
  return (
    <p className="text-[12.5px]" style={{ color: H.faint }}>
      {items.map((it, i) => (
        <span key={it}>
          <span style={i === items.length - 1 ? { color: H.ink, fontWeight: 500 } : undefined}>{it}</span>
          {i < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </p>
  )
}

/** Import → Organize → LeadGen — the wizard's sliding step pills. */
export function Steps({ steps = ["Import", "Organize", "LeadGen"], at }: { steps?: string[]; at: number }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border bg-white p-1" style={{ borderColor: H.border }}>
      {steps.map((s, i) => (
        <span
          key={s}
          className="flex items-center gap-2 rounded-full px-4 py-[7px] text-[13px]"
          style={i === at ? { background: H.grad, color: "#fff", fontWeight: 500 } : { color: i < at ? H.ink : H.faint }}
        >
          <span
            className="grid h-[18px] w-[18px] place-items-center rounded-full text-[10px] font-semibold"
            style={i === at ? { background: "rgba(255,255,255,0.25)" } : i < at ? { background: H.soft, color: H.primary } : { background: "#F1F2F6" }}
          >
            {i < at ? "✓" : i + 1}
          </span>
          {s}
        </span>
      ))}
    </div>
  )
}

export function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-[14px] border bg-white ${className ?? ""}`} style={{ borderColor: H.border, ...style }}>
      {children}
    </div>
  )
}

export function Btn({
  children,
  kind = "primary",
  className,
}: {
  children: React.ReactNode
  kind?: "primary" | "ghost" | "soft" | "white"
  className?: string
}) {
  const style: React.CSSProperties =
    kind === "primary"
      ? { background: H.grad, color: "#fff" }
      : kind === "soft"
        ? { background: H.soft, color: H.primary }
        : kind === "white"
          ? { background: "#fff", color: H.primary }
          : { border: `1px solid ${H.border}`, color: H.ink, background: "#fff" }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-[8px] text-[13px] font-medium ${className ?? ""}`} style={style}>
      {children}
    </span>
  )
}

export function Pill({ children, color = H.primary, bg }: { children: React.ReactNode; color?: string; bg?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11.5px] font-medium"
      style={{ color, background: bg ?? `color-mix(in oklab, ${color} 12%, white)` }}
    >
      {children}
    </span>
  )
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.07em]" style={{ color: H.faint }}>
      {children}
    </span>
  )
}

export function Bar({ value, color = H.primary, track = "#EEF0F6", h = 6 }: { value: number; color?: string; track?: string; h?: number }) {
  return (
    <span className="block w-full overflow-hidden rounded-full" style={{ height: h, background: track }}>
      <span className="block h-full rounded-full" style={{ width: `${value * 100}%`, background: color }} />
    </span>
  )
}

export function Title({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div>
      <h3 className="text-[30px] font-medium leading-[1.1] tracking-[-0.02em]" style={{ fontFamily: SERIF, color: H.ink }}>
        {children}
      </h3>
      {sub && (
        <p className="mt-1.5 text-[14px]" style={{ color: H.muted }}>
          {sub}
        </p>
      )}
    </div>
  )
}
