"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Download, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { useSystemLog } from "@/contexts/system-log-context"
import { useReadingStore } from "@/contexts/reading-store-context"

const TOTAL_CHAPTERS = 6

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [utcTime, setUtcTime] = useState("")
  const { viewMode, setViewMode } = useViewMode()
  const { addLog } = useSystemLog()
  const { activeChapterConfig } = useReadingStore()

  useEffect(() => {
    const format = () => {
      const d = new Date()
      const h = d.getUTCHours().toString().padStart(2, "0")
      const m = d.getUTCMinutes().toString().padStart(2, "0")
      const s = d.getUTCSeconds().toString().padStart(2, "0")
      setUtcTime(`${h}:${m}:${s} UTC`)
    }
    format()
    const id = setInterval(format, 1000)
    return () => clearInterval(id)
  }, [])

  const handleViewModeToggle = (mode: "recruiter" | "designer") => {
    setViewMode(mode)
    addLog(`> mode.switch: ${mode}_view enabled`)
  }

  return (
    <header className="relative sticky top-0 z-40 bg-slate-950/85 backdrop-blur-lg border-b border-white/6 pt-6 pb-0 lg:pt-7 lg:pb-0">
      <nav className="relative w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 w-full">
            {/* Left - Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="group">
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-2.5">
                    <span className="relative inline-flex items-center">
                      <span className="font-pixel text-[15px] sm:text-[16px] leading-none tracking-[0.18em] uppercase text-slate-100 font-bold">
                        PIXELOGIC OS
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-sky-400/0 via-sky-400/70 to-sky-400/0 animate-pulse"
                      />
                    </span>
                    <span className="hidden sm:inline text-[11px] lg:text-[12px] text-slate-400">
                      by Vishal Deshmukh
                    </span>
                  </div>
                  <span className="hidden md:inline font-pixel text-[9px] leading-none tracking-[0.24em] uppercase text-slate-500">
                    PERSONAL UX OS FOR COMPLEX SYSTEMS
                  </span>
                </div>
              </Link>
            </div>

            {/* Right - Open roles + Rectangular buttons */}
            <div className="hidden lg:flex items-center justify-end gap-6 ml-auto">
              <div className="flex items-center gap-2.5 text-[11px] text-slate-400">
                <span>Open roles:</span>
                <span
                  className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_8px_3px_rgba(52,211,153,0.55)] animate-pulse"
                  aria-hidden
                />
                <span className="font-medium text-slate-200">Product · UX · Systems</span>
              </div>
              <div className="flex items-center gap-2.5">
                {/* Joined slider toggle */}
                <div className="relative flex items-center bg-slate-800/80 border border-white/10 rounded-sm p-0 gap-0 overflow-hidden">
                  {/* Sliding indicator */}
                  <motion.div
                    className="absolute inset-y-0 bg-[#F59E0B] rounded-none"
                    layout
                    layoutId="view-mode-slider"
                    style={{
                      left: viewMode === "recruiter" ? "0" : "50%",
                      right: viewMode === "recruiter" ? "50%" : "0",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                  <button
                    onClick={() => handleViewModeToggle("recruiter")}
                    className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-medium transition-colors duration-150 rounded-[3px] ${
                      viewMode === "recruiter" ? "text-white" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    <span className="text-[13px] leading-none">🤝</span>
                    Recruiter
                  </button>
                  <button
                    onClick={() => handleViewModeToggle("designer")}
                    className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-medium transition-colors duration-150 rounded-[3px] ${
                      viewMode === "designer" ? "text-white" : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    <span className="text-[13px] leading-none">🎨</span>
                    Designer
                  </button>
                </div>

                {/* Resume button */}
                <Button
                  size="sm"
                  className="gap-1.5 h-9 px-3.5 text-[11px] rounded-sm bg-slate-100 hover:bg-white text-slate-900 border-0"
                  asChild
                >
                  <a
                    href="https://drive.google.com/file/d/1jaaSJL7kWIxkYDRnyQOkN-DpAu9-hZTG/view?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-3 w-3" />
                    Resume
                  </a>
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent animate-pulse"
      />

      {/* Chapter status bar */}
      <div
        className="hidden lg:flex items-center justify-between w-full px-4 sm:px-6 lg:px-8 py-3 mt-5 border-t border-white/5 bg-slate-950/60"
        style={{ fontFamily: "var(--font-pixel), monospace" }}
      >
        {/* Left: SYSTEM.STATUS · VIEW.MODE · READING */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[10px] tracking-[0.12em] uppercase text-slate-500">
          <span className="flex items-center gap-1.5">
            <span>SYSTEM.STATUS:</span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_6px_2px_rgba(52,211,153,0.55)]"
              aria-hidden
            />
            <span className="text-emerald-400 font-medium">OPERATIONAL</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5">
            <span>VIEW.MODE:</span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] flex-shrink-0 shadow-[0_0_6px_2px_rgba(245,158,11,0.6)]"
              aria-hidden
            />
            <span className="text-[#FBBF24] font-medium">
              {viewMode === "designer" ? "DESIGNER" : "RECRUITER"}
            </span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1.5">
            <span>READING:</span>
            <span className="text-slate-300 font-medium">
              {activeChapterConfig?.fullLabel ?? "Prologue · Pixelogic OS"}
            </span>
          </span>
        </div>

        {/* Right: timestamp */}
        {utcTime && (
          <span className="text-[9px] text-slate-500 tracking-[0.1em] flex-shrink-0">
            {utcTime}
          </span>
        )}
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-slate-950/95 backdrop-blur-md border-b border-white/6"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {/* Mobile context label */}
              <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-slate-900/60 rounded-lg">
                <span className="text-[10px] text-slate-500">Reading:</span>
                <span className="font-pixel text-[10px] leading-relaxed tracking-[0.26em] uppercase text-slate-400">
                  {activeChapterConfig?.fullLabel || "Prologue · Pixelogic OS"}
                </span>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center justify-center gap-2 p-2 mb-2">
                <div className="flex items-center bg-slate-800/80 rounded-full p-0.5 border border-white/10">
                  <button
                    onClick={() => handleViewModeToggle("recruiter")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      viewMode === "recruiter" ? "bg-[#F59E0B] text-white shadow-sm" : "text-slate-400"
                    }`}
                  >
                    Recruiter
                  </button>
                  <button
                    onClick={() => handleViewModeToggle("designer")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      viewMode === "designer" ? "bg-[#F59E0B] text-white shadow-sm" : "text-slate-400"
                    }`}
                  >
                    Designer
                  </button>
                </div>
              </div>

              {/* Resume button */}
              <div className="pt-4 mt-2 border-t border-white/8">
                <Button size="sm" className="w-full gap-2 bg-[#F59E0B] hover:bg-[#D97706] rounded-full" asChild>
                  <a
                    href="https://drive.google.com/file/d/1jaaSJL7kWIxkYDRnyQOkN-DpAu9-hZTG/view?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
