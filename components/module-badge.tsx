import { Badge } from "@/components/ui/badge"

interface ModuleBadgeProps {
  module: string
  label: string
}

export function ModuleBadge({ module, label }: ModuleBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className="font-pixel text-[9px] leading-none tracking-[0.22em] uppercase text-slate-500 bg-[#EDE9FE]/50 border border-[#A78BFA]/20 mb-4 gap-1.5"
    >
      {/* Pixel-like square before module */}
      <span className="inline-block w-1.5 h-1.5 bg-[#A78BFA] rounded-[1px]" />
      <span className="text-[#A78BFA] font-semibold">MODULE</span>
      <span className="mx-1 text-[#A78BFA]/40">_</span>
      <span>{module}</span>
      <span className="mx-1 text-[#A78BFA]/40">::</span>
      <span>{label}</span>
      {/* Pixel-like square after label */}
      <span className="inline-block w-1.5 h-1.5 bg-[#A78BFA]/50 rounded-[1px]" />
    </Badge>
  )
}
