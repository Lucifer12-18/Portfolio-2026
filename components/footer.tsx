"use client"

import { PROFILE } from "@/lib/profile"
import { SPECTRUM_GRADIENT } from "@/lib/chapter-palette"
import { usePathname } from "next/navigation"
import { tour } from "@/lib/tour"
import { VisitorCounter } from "@/components/stats"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const onHome = usePathname() === "/"

  return (
    <footer className="relative border-t border-hair bg-[rgb(15_15_14/0.72)] backdrop-blur-xl">
      {/* Signature hairline — the seven chapter pigments, dusk to dawn */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-50" style={{ background: SPECTRUM_GRADIENT }} />
      <div className="px-4 sm:px-6 lg:px-8 h-11 sm:h-12 flex items-center justify-between gap-4 font-mono text-[11px] text-bone-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="whitespace-nowrap">© {currentYear} {PROFILE.name}</span>
          <span aria-hidden className="hidden sm:inline text-bone-4">/</span>
          <span className="hidden lg:inline whitespace-nowrap">{PROFILE.location}</span>
          <span aria-hidden className="hidden lg:inline text-bone-4">/</span>
          <VisitorCounter />
        </div>

        {/* Navigation hint — the chapter model isn't obvious; say it once, quietly */}
        <div className="hidden md:flex items-center gap-2">
          <span className="keycap" aria-hidden>←</span>
          <span className="keycap" aria-hidden>→</span>
          <span className="ml-1" aria-hidden>to move between chapters</span>
          {onHome && (
            <>
              <span aria-hidden className="mx-1.5 text-bone-4">/</span>
              <button type="button" onClick={() => tour.open()} className="text-bone-2 hover:text-bone transition-colors">
                Replay briefing
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`mailto:${PROFILE.email}`}
            data-track="email_send"
            className="hidden sm:inline text-bone-2 hover:text-bone underline decoration-hair-2 underline-offset-4 hover:decoration-bone transition-colors"
          >
            {PROFILE.email}
          </a>
          <a
            href={PROFILE.linkedin}
            data-track="linkedin_open"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bone-2 hover:text-bone transition-colors"
          >
            LinkedIn<span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
