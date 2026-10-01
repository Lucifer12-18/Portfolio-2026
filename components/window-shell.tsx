"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useOptionalReadingStore } from "@/contexts/reading-store-context"
import { CHAPTERS } from "@/lib/chapters-config"
import { EASE_SETTLE } from "@/lib/motion"

interface WindowShellProps {
  title: string
  children: React.ReactNode
  className?: string
  /** Chapter index — when set, the title bar shows "04 / 06", a progress
   *  hairline, and prev/next controls. Omit for standalone windows. */
  chapterIndex?: number
}

const pad = (n: number) => String(n).padStart(2, "0")

export function WindowShell({ title, children, className, chapterIndex }: WindowShellProps) {
  // Each chapter remounts this shell (keyed parent), so reset the internal
  // scroll to the top on mount — otherwise a prior scroll position clips the
  // headline off the top on mobile.
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [])

  const store = useOptionalReadingStore()
  const last = CHAPTERS.length - 1
  const isChapter = typeof chapterIndex === "number" && !!store

  return (
    <div
      className={cn(
        "w-full h-full min-h-0 flex flex-col rounded-[18px] border border-hair bg-[rgb(17_17_16/0.8)] backdrop-blur-2xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]",
        className,
      )}
      // A breath of the chapter pigment pooling in from the top-left corner
      style={{
        backgroundImage:
          "radial-gradient(120% 55% at 0% 0%, color-mix(in oklab, var(--chapter) 9%, transparent), transparent 60%)",
      }}
    >
      {/* ── Title bar ───────────────────────────────────────────────── */}
      <div
        data-tour={isChapter ? "window" : undefined}
        className="relative flex items-center justify-between gap-4 px-5 h-11 flex-shrink-0 border-b border-hair"
      >
        <div className="flex items-center gap-3 min-w-0 font-mono text-[11px] tracking-[0.02em]">
          {isChapter && <span className="text-bone tabular-nums">{pad(chapterIndex)}</span>}
          <span className="text-bone-3 truncate">{title}</span>
        </div>

        {isChapter && (
          <div className="flex items-center gap-3 flex-shrink-0" data-chapter-nav>
            <span className="hidden sm:inline font-mono text-[11px] text-bone-4 tabular-nums" aria-hidden>
              {pad(chapterIndex)} / {pad(last)}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => store?.goToPrevChapter()}
                disabled={chapterIndex === 0}
                aria-label="Previous chapter"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-hair-2 text-bone-2 transition-colors hover:border-chapter hover:bg-chapter hover:text-[#111110] disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowLeft className="h-3 w-3" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => store?.goToNextChapter()}
                disabled={chapterIndex === last}
                aria-label="Next chapter"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-hair-2 text-bone-2 transition-colors hover:border-chapter hover:bg-chapter hover:text-[#111110] disabled:opacity-30 disabled:pointer-events-none"
              >
                <ArrowRight className="h-3 w-3" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        )}

        {/* Reading progress — a single bone hairline that grows to this chapter */}
        {isChapter && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-0 bottom-[-1px] h-px bg-chapter origin-left"
            style={{ width: "100%" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: last > 0 ? chapterIndex / last : 1 }}
            transition={{ duration: 1.1, delay: 0.25, ease: EASE_SETTLE }}
          />
        )}
      </div>

      {/* ── Content — keyboard-focusable scroll region: Tab in, then arrow
          keys scroll natively (the chapter-flip handler yields whenever
          focus is off <body>). */}
      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label={title}
        className="@container flex-1 min-h-0 overflow-y-auto p-5 md:p-7 2xl:p-9 modal-scroll flex flex-col focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bone/60 focus-visible:ring-inset"
      >
        {children}
      </div>
    </div>
  )
}
