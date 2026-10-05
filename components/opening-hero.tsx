"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { CURRENT_ROLE, PROFILE } from "@/lib/profile"
import { sfx } from "@/lib/sound"

const ThreeDScene = dynamic(() => import("./three-scene"), { ssr: false })

interface OpeningHeroProps {
  onDismiss: () => void
}

export function OpeningHero({ onDismiss }: OpeningHeroProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    // Small delay for entrance animation
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleEnter = useCallback(() => {
    sfx.unlock()
    sfx.boot()
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
          <div className="absolute inset-0 bg-ink-0" />

          {/* 3D scene — Vishal's system map (Design ↔ AI/Systems via translation layer).
              Decorative; skipped under reduced motion (static background remains). */}
          <div className="absolute inset-0" aria-hidden>
            {!reduced && <ThreeDScene />}
          </div>

          {/* Vignette — darkens edges so the card reads */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(10,10,9,0.8)_100%)]" />

          {/* Frame chrome — wordmark + version, like the cover of a document */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 sm:px-8 h-16 font-mono text-[11px] text-bone-3" aria-hidden>
            <span className="font-sans text-[15px] font-semibold uppercase tracking-[0.02em]">
              <span className="text-bone">Pixelogic</span> <span className="text-chapter">OS</span>
            </span>
            <span>v2.0 · {new Date().getFullYear()}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 sm:px-8 h-14 font-mono text-[11px] text-bone-4" aria-hidden>
            <span>{PROFILE.location}</span>
            <span className="hidden sm:inline">Designing clarity inside complex systems</span>
          </div>

          {/* Centered content */}
          <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -8 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2.5 label-mono"
              >
                <span className="live-dot" aria-hidden />
                System online
              </motion.div>

              {/* A paragraph, not an h1: the page's one h1 lives in app/page.tsx */}
              <motion.p
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 18, filter: showContent ? "blur(0px)" : "blur(8px)" }}
                transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 display-xl text-bone"
              >
                {PROFILE.name}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 10 }}
                transition={{ delay: 0.32, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 text-[clamp(1.05rem,1.6vw,1.35rem)] tracking-[-0.02em] text-bone-3"
              >
                Product designer · <span className="text-bone-2">design systems &amp; AI products</span>
              </motion.p>

              {/* Terminal card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 16 }}
                transition={{ delay: 0.45, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 w-full max-w-xl text-left"
              >
                <div className="surface overflow-hidden">
                  <div className="flex items-center justify-between px-4 h-9 border-b border-hair font-mono text-[10.5px] text-bone-3">
                    <span>~/pixelogic</span>
                    <span className="text-bone-4">zsh</span>
                  </div>
                  <div className="p-5 font-mono text-[12.5px] leading-[1.9]">
                    <p className="text-bone-3">
                      <span className="text-bone-4">$</span> cat about.txt
                    </p>
                    <p className="text-bone-2 pl-4">Designing clarity inside complex systems.</p>
                    <p className="text-bone-2 pl-4">
                      <span className="text-bone-3">now&nbsp;&nbsp;&nbsp;</span> {CURRENT_ROLE.role} @ {CURRENT_ROLE.org}
                    </p>
                    <p className="text-bone-2 pl-4">
                      <span className="text-bone-3">before</span> Founding Product Designer @ Hirello.ai
                    </p>
                    <p className="text-bone-3 pt-2">
                      <span className="text-bone-4">$</span> status
                    </p>
                    <p className="text-bone pl-4 flex items-center gap-2.5">
                      <span className="live-dot" aria-hidden /> open to product design roles
                    </p>
                    <p className="text-bone-3 pt-1">
                      <span className="text-bone-4">$</span> <span className="crt-cursor" />
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 16 }}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 flex flex-col items-center gap-4"
              >
                <motion.button
                  onClick={handleEnter}
                  data-sfx-skip
                  whileTap={{ scale: 0.97 }}
                  className="btn-solid h-12 px-7 text-[13px]"
                >
                  Enter Pixelogic OS
                  <span className="keycap !border-[#111110]/20 !text-[#111110]/60" aria-hidden>↵</span>
                </motion.button>
                <p className="font-mono text-[11px] text-bone-3">Seven chapters · ← → to move through the story</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
