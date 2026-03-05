"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { CHAPTERS } from "@/lib/chapters-config"
import { useReadingStore } from "@/contexts/reading-store-context"

export function ChapterRail() {
  const { activeChapterConfig, setActiveChapterIndex } = useReadingStore()

  return (
    <div className="flex flex-col items-center min-h-[400px]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2.5 items-center">
          {CHAPTERS.map((chapter, index) => {
            const isActive = activeChapterConfig?.id === chapter.id
            const nextChapter = CHAPTERS[index + 1]
            // Show connector for all items except Epilogue - this includes Chapter 5
            // Explicitly check: if not epilogue, show the line
            const shouldShowConnector = chapter.id !== "epilogue"
            return (
              <motion.button
                key={chapter.id}
                onClick={() => setActiveChapterIndex(index)}
                className="group relative flex flex-col items-center gap-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Label — above the marker */}
                <motion.span
                  className={cn(
                    "font-pixel text-[9px] leading-none tracking-[0.22em] uppercase transition-all whitespace-nowrap",
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

                {/* Marker + connecting line */}
                <div className="relative flex flex-col items-center">

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

                  {/* Numbered chapters: standard circle */}
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

                  {/* Epilogue: small horizontal terminal bar instead of floating dot */}
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

                  {/* Active glow for non-epilogue */}
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
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

