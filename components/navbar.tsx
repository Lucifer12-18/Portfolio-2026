"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { useSystemLog } from "@/contexts/system-log-context"
import { useReadingStore } from "@/contexts/reading-store-context"
import { CURRENT_ROLE, PROFILE } from "@/lib/profile"
import { SNAP } from "@/lib/motion"
import { SoundToggle } from "@/components/sound"
import { sfx } from "@/lib/sound"

type Mode = "recruiter" | "designer"

/** Segmented view-mode control — a bone pill slides under the active label. */
function ModeToggle({ mode, onChange, id }: { mode: Mode; onChange: (m: Mode) => void; id: string }) {
  return (
    <div
      role="group"
      aria-label="View mode"
      data-sfx-skip
      className="relative flex items-center rounded-[9px] border border-hair-2 p-[3px]"
    >
      {(["recruiter", "designer"] as const).map((m) => {
        const active = mode === m
        return (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            aria-pressed={active}
            className={`relative z-10 h-7 px-3 font-mono text-[11px] tracking-[0.01em] capitalize rounded-[6px] transition-colors duration-200 ${
              active ? "text-[#111110]" : "text-bone-3 hover:text-bone"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`mode-pill-${id}`}
                className="absolute inset-0 -z-10 rounded-[6px] bg-bone"
                transition={SNAP}
              />
            )}
            {m}
          </button>
        )
      })}
    </div>
  )
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { viewMode, setViewMode } = useViewMode()
  const { addLog } = useSystemLog()
  const { activeChapterConfig, setActiveChapterIndex } = useReadingStore()
  const onHome = usePathname() === "/"

  const handleViewModeToggle = (mode: Mode) => {
    if (mode !== viewMode) sfx.toggle(mode === "designer")
    setViewMode(mode)
    addLog(`> mode.switch: ${mode}_view enabled`)
  }

  return (
    <header className="relative sticky top-0 z-40 border-b border-hair bg-[rgb(15_15_14/0.72)] backdrop-blur-xl">
      <nav aria-label="Primary" className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* ── Wordmark ─────────────────────────────────────────────── */}
          <Link href="/" className="group flex items-center gap-4 rounded-md">
            <span className="flex items-baseline gap-[0.35em] text-[15px] font-semibold uppercase leading-none tracking-[0.02em]">
              <span className="text-bone">Pixelogic</span>
              <span className="text-chapter">OS</span>
            </span>
            <span aria-hidden className="hidden sm:block h-4 w-px bg-hair-2" />
            <span className="hidden sm:flex items-baseline gap-2 text-[13px] leading-none">
              <span className="text-bone-2">{PROFILE.name}</span>
              <span className={`${onHome ? "hidden md:inline lg:hidden xl:inline" : "hidden md:inline"} text-bone-3`}>{PROFILE.title}</span>
            </span>
          </Link>

          {/* ── Now line (xl) — the current role, one click from the timeline ── */}
          {(() => {
            // On home, the right-rail Now panel carries this from xl up — the
            // navbar only says it where that panel isn't (lg). Elsewhere: xl+.
            const nowCls = `group ${onHome ? "hidden lg:flex xl:hidden" : "hidden xl:flex"} items-center gap-2.5 rounded-full px-3 py-1.5 text-[12px] text-bone-3 transition-colors hover:text-bone-2`
            const nowInner = (
              <>
                <span className="live-dot" aria-hidden />
                <span>
                  Now · <span className="text-bone-2 group-hover:text-bone transition-colors">{CURRENT_ROLE.role}</span> at{" "}
                  <span className="text-bone-2 group-hover:text-bone transition-colors">{CURRENT_ROLE.org}</span>
                </span>
              </>
            )
            // On the home page, flip chapters through the full formation
            // transition; elsewhere (case stories, notes) deep-link back.
            return onHome ? (
              <button type="button" onClick={() => setActiveChapterIndex(1)} className={nowCls}>
                {nowInner}
              </button>
            ) : (
              <Link href="/#chapter-1" className={nowCls}>
                {nowInner}
              </Link>
            )
          })()}

          {/* ── Controls ─────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            <SoundToggle />
            <ModeToggle mode={viewMode as Mode} onChange={handleViewModeToggle} id="desk" />
            <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm h-[36px]">
              Résumé
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>

          {/* ── Mobile menu button ─────────────────────────────────── */}
          <button
            type="button"
            className="lg:hidden -mr-2 p-2 rounded-md text-bone-2 hover:text-bone transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden overflow-hidden border-t border-hair bg-[rgb(15_15_14/0.96)] backdrop-blur-xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-4 sm:px-6 py-5 flex flex-col gap-5">
              <div className="flex items-start gap-2.5 text-[13px] text-bone-3">
                <span className="live-dot mt-[7px]" aria-hidden />
                <span>
                  Now · <span className="text-bone-2">{CURRENT_ROLE.role}</span> at{" "}
                  <span className="text-bone-2">{CURRENT_ROLE.org}</span>
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="label-mono">
                  Reading · <span className="text-bone-2">{activeChapterConfig?.label ?? "Prologue"}</span>
                </span>
                <span className="flex items-center gap-2">
                  <SoundToggle />
                  <ModeToggle mode={viewMode as Mode} onChange={handleViewModeToggle} id="mob" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer" className="btn-solid">
                  Résumé
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
                <a href={`mailto:${PROFILE.email}`} className="btn-ghost">
                  Email
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
