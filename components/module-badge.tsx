import { Badge } from "@/components/ui/badge"

interface ModuleBadgeProps {
  module: string
  label: string
}

const MODULE_ACCENTS: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  "00": { color: "#22d3ee", bg: "rgba(34,211,238,0.10)",  border: "rgba(34,211,238,0.25)",  glow: "rgba(34,211,238,0.35)"  },
  "01": { color: "#06b6d4", bg: "rgba(6,182,212,0.10)",   border: "rgba(6,182,212,0.25)",   glow: "rgba(6,182,212,0.35)"   },
  "02": { color: "#a78bfa", bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.25)", glow: "rgba(167,139,250,0.35)" },
  "03": { color: "#8b5cf6", bg: "rgba(139,92,246,0.10)",  border: "rgba(139,92,246,0.25)",  glow: "rgba(139,92,246,0.35)"  },
  "04": { color: "#38bdf8", bg: "rgba(56,189,248,0.10)",  border: "rgba(56,189,248,0.25)",  glow: "rgba(56,189,248,0.35)"  },
  "05": { color: "#93c5fd", bg: "rgba(147,197,253,0.10)", border: "rgba(147,197,253,0.25)", glow: "rgba(147,197,253,0.35)" },
  "06": { color: "#e0f9ff", bg: "rgba(224,249,255,0.08)", border: "rgba(224,249,255,0.20)", glow: "rgba(224,249,255,0.30)" },
}

const DEFAULT_ACCENT = { color: "#a78bfa", bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.25)", glow: "rgba(167,139,250,0.35)" }

export function ModuleBadge({ module, label }: ModuleBadgeProps) {
  const accent = MODULE_ACCENTS[module] ?? DEFAULT_ACCENT

  return (
    <Badge
      variant="secondary"
      className="font-pixel text-[10px] leading-none tracking-[0.22em] uppercase mb-4 gap-1.5 px-3 py-1.5"
      style={{
        background: accent.bg,
        borderColor: accent.border,
        borderWidth: "1px",
        borderStyle: "solid",
        boxShadow: `0 0 12px ${accent.glow}, inset 0 0 8px ${accent.bg}`,
      }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-[1px]"
        style={{ backgroundColor: accent.color, boxShadow: `0 0 6px ${accent.color}` }}
      />
      <span style={{ color: accent.color }} className="font-semibold">MODULE</span>
      <span style={{ color: accent.color, opacity: 0.5 }} className="mx-0.5">_</span>
      <span style={{ color: accent.color }}>{module}</span>
      <span style={{ color: accent.color, opacity: 0.5 }} className="mx-0.5">::</span>
      <span className="text-slate-200">{label}</span>
      <span
        className="inline-block w-1.5 h-1.5 rounded-[1px]"
        style={{ backgroundColor: accent.color, opacity: 0.5 }}
      />
    </Badge>
  )
}
