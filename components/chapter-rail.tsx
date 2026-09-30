"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { CHAPTERS, type ChapterConfig } from "@/lib/chapters-config"
import { useReadingStore } from "@/contexts/reading-store-context"
import { EASE_SETTLE } from "@/lib/motion"
import { railHover } from "@/lib/pointer-state"
import { accentHex } from "@/lib/chapter-palette"
import { FormationGlyph } from "@/components/storyboard"

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER RAIL — a filmstrip. Each scene is a tiny frame showing its particle
// formation in its own pigment; the spine behind the frames fills to where the
// reader is. Hovering still leans the 3D camera toward that scene (railHover).
// ─────────────────────────────────────────────────────────────────────────────

const ROW_H = 50 // px — keeps the spine math exact
const FRAME_W = 46
const FRAME_H = 30

interface RailItemProps {
  chapter: ChapterConfig
  index: number
  isActive: boolean
  isPast: boolean
  onSelect: (index: number) => void
}

function RailItem({ chapter, index, isActive, isPast, onSelect }: RailItemProps) {
  const pigment = accentHex(index)

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      onMouseEnter={() => {
        railHover.chapter = index
      }}
      onMouseLeave={() => {
        if (railHover.chapter === index) railHover.chapter = -1
      }}
      aria-current={isActive ? "step" : undefined}
      aria-label={`Scene ${index}: ${chapter.fullLabel}`}
      className="group relative flex w-full items-center gap-3.5 text-left"
      style={{ height: ROW_H }}
    >
      {/* The frame */}
      <span
        className={cn(
          "relative z-10 flex-shrink-0 overflow-hidden rounded-[7px] border bg-[#131312] transition-colors duration-500",
          !isActive && "group-hover:border-hair-3",
        )}
        style={{ width: FRAME_W, height: FRAME_H, color: pigment, borderColor: isActive ? pigment : undefined }}
      >
        <span
          aria-hidden
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: isActive ? 1 : 0,
            background: `radial-gradient(80% 90% at 50% 50%, color-mix(in oklab, ${pigment} 22%, transparent), transparent 75%)`,
          }}
        />
        {/* Dim the drawing, never the frame — an opaque frame keeps the spine hidden behind it */}
        <span
          className={cn(
            "absolute inset-[12%] transition-[transform,opacity] duration-500 group-hover:scale-110",
            isActive ? "opacity-100" : "opacity-45 group-hover:opacity-100",
          )}
        >
          <FormationGlyph index={index} dot={isActive ? 3.4 : 3} gap={6.6} />
        </span>
      </span>

      {/* Number + label */}
      <span className="flex min-w-0 flex-col gap-1">
        <span
          className={cn(
            "font-mono text-[10px] tabular-nums leading-none transition-colors",
            isActive ? "" : "text-bone-4 group-hover:text-bone-3",
          )}
          style={isActive ? { color: pigment } : undefined}
        >
          SC {String(chapter.chapterNumber).padStart(2, "0")}
        </span>
        <span
          className={cn(
            "truncate text-[13.5px] leading-none tracking-[-0.01em] transition-colors duration-300",
            isActive ? "text-bone" : isPast ? "text-bone-2 group-hover:text-bone" : "text-bone-3 group-hover:text-bone-2",
          )}
        >
          {chapter.label}
        </span>
      </span>
    </button>
  )
}

export function ChapterRail() {
  const { activeChapterIndex, setActiveChapterIndex } = useReadingStore()
  const last = CHAPTERS.length - 1
  const spineX = FRAME_W / 2

  return (
    <nav aria-label="Chapters" className="relative w-full py-2 pl-6">
      <p className="label-mono mb-3">Storyboard</p>

      <div className="relative">
        {/* Film spine + fill — runs through the frame centres */}
        <span
          aria-hidden
          className="absolute w-px bg-hair-2"
          style={{ left: spineX, top: ROW_H / 2, height: ROW_H * last }}
        />
        <motion.span
          aria-hidden
          className="absolute w-px bg-chapter origin-top"
          style={{ left: spineX, top: ROW_H / 2, height: ROW_H * last }}
          animate={{ scaleY: last > 0 ? activeChapterIndex / last : 0 }}
          transition={{ duration: 0.9, ease: EASE_SETTLE }}
        />

        <div className="relative flex flex-col">
          {CHAPTERS.map((chapter, index) => (
            <RailItem
              key={chapter.id}
              chapter={chapter}
              index={index}
              isActive={index === activeChapterIndex}
              isPast={index < activeChapterIndex}
              onSelect={setActiveChapterIndex}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}
