"use client"

import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { CHAPTERS } from "@/lib/chapters-config"
import { useReadingStore } from "@/contexts/reading-store-context"
import { useState, useCallback } from "react"

// ── Per-chapter accent colors — mirrors ACCENT_COLORS in page.tsx ─────────────
const CHAPTER_ACCENTS = [
  { r: 34,  g: 211, b: 238 }, // 0 Prologue  — cyan
  { r: 6,   g: 182, b: 212 }, // 1 Origin    — teal
  { r: 124, g: 58,  b: 237 }, // 2 Shift     — violet
  { r: 167, g: 139, b: 250 }, // 3 Method    — lavender
  { r: 56,  g: 189, b: 248 }, // 4 Cases     — sky
  { r: 147, g: 197, b: 253 }, // 5 Notes     — ice blue
  { r: 224, g: 249, b: 255 }, // 6 Epilogue  — white
]

// ── Per-chapter formation names — mirrors FORMATION_IDS in page.tsx ──────────
const CHAPTER_FORMATIONS = [
  "fibonacci_sphere",
  "double_helix",
  "torus",
  "trefoil_knot",
  "crystal_lattice",
  "wave_surface",
  "starburst",
]

interface TiltState {
  index: number
  rotX: number
  rotY: number
}

export function ChapterRail() {
  const { activeChapterConfig, setActiveChapterIndex } = useReadingStore()

  // ── Hover state ────────────────────────────────────────────────────────────
  const [tilt,         setTilt]         = useState<TiltState | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2
      // ±5° yaw, ±4° pitch — enough to read as 3D, not enough to feel like a toy
      const rotY =   ((e.clientX - cx) / (rect.width  / 2)) * 5
      const rotX = -(  (e.clientY - cy) / (rect.height / 2)) * 4
      setTilt({ index, rotX, rotY })
    },
    [],
  )

  const handleMouseLeave = useCallback(() => {
    setTilt(null)
    setHoveredIndex(null)
  }, [])

  return (
    <div className="flex flex-col items-center min-h-[400px]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2.5 items-center">
          {CHAPTERS.map((chapter, index) => {
            const isActive    = activeChapterConfig?.id === chapter.id
            const nextChapter = CHAPTERS[index + 1]
            const isHovered   = hoveredIndex === index
            const accent      = CHAPTER_ACCENTS[index]    ?? CHAPTER_ACCENTS[0]
            const formation   = CHAPTER_FORMATIONS[index] ?? "fibonacci_sphere"

            // Current tilt for this item — zeroes when not hovered → spring back
            const rotX = tilt?.index === index ? tilt.rotX : 0
            const rotY = tilt?.index === index ? tilt.rotY : 0

            return (
              // Using a plain <button> so that CSS transform on style never
              // conflicts with Framer Motion's internal animation transforms
              // on the child motion elements.
              <button
                key={chapter.id}
                onClick={() => setActiveChapterIndex(index)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={handleMouseLeave}
                className="group relative flex flex-col items-center gap-2"
                style={{
                  // Perspective tilt — tracks cursor inside the element
                  transform: `perspective(400px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                  // Fast follow on hover, springy return on leave
                  transition: isHovered
                    ? "transform 0.08s ease-out"
                    : "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transformStyle: "preserve-3d",
                  willChange: "transform",
                  // Reset native button chrome
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {/* ── Accent glow — radiates from chapter color on hover ─────── */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      key="glow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      aria-hidden
                      className="absolute pointer-events-none"
                      style={{
                        inset: "-10px -18px",
                        background: `radial-gradient(ellipse 100% 60% at 50% 50%,
                          rgba(${accent.r},${accent.g},${accent.b},0.16) 0%,
                          rgba(${accent.r},${accent.g},${accent.b},0.05) 60%,
                          transparent 100%)`,
                        filter: "blur(7px)",
                        borderRadius: "10px",
                        zIndex: 0,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* ── Chapter label — above the marker ─────────────────────── */}
                <motion.span
                  className={cn(
                    "font-pixel text-[9px] leading-none tracking-[0.22em] uppercase transition-all whitespace-nowrap relative z-10",
                    isActive
                      ? "text-primary font-semibold drop-shadow-[0_0_4px_rgba(74,123,247,0.3)]"
                      : "text-slate-400 group-hover:text-primary/80 group-hover:font-medium"
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isActive ? 1 : 0.6, x: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {chapter.label}
                </motion.span>

                {/* ── Marker + connecting line ──────────────────────────────── */}
                <div className="relative flex flex-col items-center z-10">

                  {/* Prologue: filled diamond start marker */}
                  {chapter.id === "prologue" && (
                    <motion.div
                      className={cn(
                        "w-3 h-3 rotate-45 border-2 transition-all relative z-10",
                        isActive
                          ? "bg-primary border-primary shadow-[0_0_10px_3px_rgba(74,123,247,0.55)]"
                          : "bg-transparent border-muted-foreground/40 group-hover:border-primary/70 group-hover:bg-primary/20"
                      )}
                      animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                    />
                  )}

                  {/* Numbered chapters: circle */}
                  {chapter.id !== "prologue" && chapter.id !== "epilogue" && (
                    <motion.div
                      className={cn(
                        "w-3 h-3 rounded-full border-2 transition-all relative z-10",
                        isActive
                          ? "bg-primary border-primary shadow-[0_0_10px_3px_rgba(74,123,247,0.55)]"
                          : "bg-transparent border-muted-foreground/40 group-hover:border-primary/70 group-hover:bg-primary/20"
                      )}
                      animate={
                        isActive
                          ? {
                              scale: [1, 1.3, 1],
                              boxShadow: [
                                "0 0 0 0 rgba(74, 123, 247, 0.4)",
                                "0 0 0 8px rgba(74, 123, 247, 0)",
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                    />
                  )}

                  {/* Epilogue: horizontal terminal bars */}
                  {chapter.id === "epilogue" && (
                    <div className="flex flex-col items-center gap-1 mt-1">
                      <div
                        className={cn(
                          "w-6 h-[2px] rounded-full transition-all",
                          isActive ? "bg-primary" : "bg-muted-foreground/30 group-hover:bg-primary/50"
                        )}
                      />
                      <div
                        className={cn(
                          "w-3 h-[2px] rounded-full transition-all",
                          isActive ? "bg-primary/60" : "bg-muted-foreground/20 group-hover:bg-primary/30"
                        )}
                      />
                    </div>
                  )}

                  {/* Active glow for non-epilogue markers */}
                  {isActive && chapter.id !== "epilogue" && (
                    <motion.div
                      className="absolute inset-0 w-3 h-3 rounded-full bg-primary/30 blur-md"
                      animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}

                  {/* Connecting line — all chapters except Epilogue */}
                  {chapter.id !== "epilogue" && (
                    <motion.div
                      className={cn(
                        "w-0.5 h-12 transition-colors mt-1",
                        isActive || activeChapterConfig?.id === nextChapter?.id
                          ? "bg-primary/40"
                          : "bg-muted-foreground/20 group-hover:bg-primary/20"
                      )}
                      whileHover={{ backgroundColor: "rgba(74, 123, 247, 0.3)" }}
                    />
                  )}
                </div>

                {/* ── Formation label — whispered in the chapter's accent color ─ */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      key="formation-label"
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      aria-hidden
                      className="relative z-10"
                      style={{
                        fontFamily: "'JetBrains Mono','Fira Code',monospace",
                        fontSize: 7,
                        letterSpacing: "0.10em",
                        color: `rgba(${accent.r},${accent.g},${accent.b},0.55)`,
                        whiteSpace: "nowrap",
                        lineHeight: 1,
                        marginTop: -2,
                      }}
                    >
                      → {formation}
                    </motion.span>
                  )}
                </AnimatePresence>

              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
