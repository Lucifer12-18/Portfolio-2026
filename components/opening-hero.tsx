"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"

const ThreeDScene = dynamic(() => import("./three-scene"), { ssr: false })

interface OpeningHeroProps {
  onDismiss: () => void
}

export function OpeningHero({ onDismiss }: OpeningHeroProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Small delay for entrance animation
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleEnter = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss()
      // No scrollIntoView — the chapter window owns its own scroll (and resets
      // to top on mount). Calling it here pushed the headline off the top on mobile.
    }, 350) // Wait for exit animation
  }, [onDismiss])


  useEffect(() => {
    // Lock scroll when boot screen is visible
    if (isVisible) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleEnter()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isVisible, handleEnter])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[100] min-h-[100svh] flex items-center justify-center overflow-hidden"
        >
          {/* Base background — visible instantly before 3D loads */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-[#0a0a0c] to-[#0a0a0c]" />

          {/* 3D scene — Vishal's system map (Design ↔ AI/Systems via translation layer) */}
          <div className="absolute inset-0">
            <ThreeDScene />
          </div>

          {/* Vignette — darkens edges so terminal card pops */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)]" />

          {/* Subtle noise overlay */}
          <div className="absolute inset-0 opacity-[0.025] noise-texture" />

          {/* Corner brackets */}
          <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-cyan-400/60" />
          <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-cyan-400/60" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-cyan-400/60" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-cyan-400/60" />

          {/* Centered content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center space-y-8"
            >
              {/* SYSTEM ONLINE label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -10 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="flex items-center gap-2"
              >
                <div className="flex gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-cyan-400/70" />
                  ))}
                </div>
                <span className="text-xs font-mono text-cyan-400/80 tracking-wider">SYSTEM ONLINE</span>
                <div className="flex gap-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-cyan-400/70" />
                  ))}
                </div>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-mono tracking-[0.15em] text-center whitespace-nowrap"
                style={{
                  textShadow: "0 0 20px rgba(34, 211, 238, 0.3), 0 0 40px rgba(34, 211, 238, 0.15)",
                }}
              >
                VISHAL//DESHMUKH
              </motion.h1>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 10 }}
                transition={{ delay: 0.3, duration: 0.35 }}
                className="flex items-center gap-2"
              >
                <span className="text-sm font-mono text-cyan-400/70 tracking-wider">
                  DESIGNER • DEVELOPER • CREATOR
                </span>
              </motion.div>

              {/* Terminal card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: showContent ? 1 : 0, scale: showContent ? 1 : 0.95 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="w-full max-w-2xl mt-8"
              >
                <div
                  className="rounded-2xl bg-slate-900/90 border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-sm overflow-hidden"
                  style={{
                    boxShadow: "0 0 30px rgba(34, 211, 238, 0.2), inset 0 0 60px rgba(34, 211, 238, 0.05)",
                  }}
                >
                  {/* Terminal header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/50 border-b border-cyan-400/20">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400/80">{'>'} PIXELOGIC_OS</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                  </div>

                  {/* Terminal body */}
                  <div className="p-5 font-mono text-sm text-cyan-300/90 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">$</span>
                      <span className="text-cyan-300">cat about.txt</span>
                    </div>
                    <div className="pl-6 space-y-1.5 text-cyan-200/80">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">{'>'}</span>
                        <span>Designing clarity inside complex systems.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">{'>'}</span>
                        <span>Founding Product Designer → Hirello.ai</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400">{'>'}</span>
                        <span>AI workflows · data-heavy tools · multi-step UX</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-cyan-400">$</span>
                      <span className="text-cyan-300">status</span>
                    </div>
                    <div className="pl-6 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-400">System: OPERATIONAL</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-400">Mode: OPEN_TO_WORK</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-cyan-400">$</span>
                      <span className="inline-block w-2 h-4 bg-cyan-400/60 animate-pulse" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 0.6, duration: 0.35 }}
                className="flex flex-col items-center gap-3 mt-8"
              >
                <motion.button
                  onClick={handleEnter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 text-sm font-mono text-white bg-cyan-400/20 border border-cyan-400/60 rounded-lg 
                           hover:bg-cyan-400/30 hover:border-cyan-400/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] 
                           transition-all duration-200"
                >
                  Enter Pixelogic OS
                </motion.button>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showContent ? 1 : 0 }}
                  transition={{ delay: 0.7, duration: 0.35 }}
                  className="text-xs font-mono text-cyan-400/50 text-center max-w-md"
                >
                  Navigate by chapter · Arrow keys or click to move through the story.
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
