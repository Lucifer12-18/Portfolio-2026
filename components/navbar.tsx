"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Download, Users, Palette } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useViewMode } from "@/contexts/view-mode-context"
import { useSystemLog } from "@/contexts/system-log-context"
import { useReadingStore } from "@/contexts/reading-store-context"

const contextTags = ["UX Design", "AI", "Systems"]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { viewMode, setViewMode } = useViewMode()
  const { addLog } = useSystemLog()
  const { activeChapterConfig } = useReadingStore()

  const handleViewModeToggle = (mode: "recruiter" | "designer") => {
    setViewMode(mode)
    addLog(`> mode.switch: ${mode}_view enabled`)
  }

  return (
    <header className="relative sticky top-0 z-40 bg-[#fafafa]/95 backdrop-blur border-b border-slate-100 py-2.5 lg:py-2">
      <nav className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="group">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="relative inline-flex items-center">
                      <span className="font-pixel text-[13px] leading-none tracking-[0.18em] uppercase text-slate-900">
                        Pixelogic OS
                      </span>
                      {/* tiny animated underline */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-sky-400/0 via-sky-400/70 to-sky-400/0 animate-pulse"
                      />
                    </span>
                    <span className="hidden sm:inline text-[11px] lg:text-xs text-slate-400">
                      by Vishal Deshmukh
                    </span>
                  </div>
                  <span className="hidden md:inline mt-1 inline-flex items-center rounded-full border border-slate-100 bg-slate-50/80 px-2.5 py-0.5 font-pixel text-[9px] leading-none tracking-[0.24em] uppercase text-slate-400">
                    Personal UX OS for complex systems
                  </span>
                </div>
              </Link>
            </div>

            {/* Right - Toggle + Status + CTA */}
            <div className="hidden lg:flex items-center justify-end gap-3 ml-auto">
              <div className="flex flex-col items-end gap-1">
                {/* View mode toggle */}
                <div className="flex items-center bg-slate-100/80 rounded-full p-0.5 border border-slate-200/60">
                  <button
                    onClick={() => handleViewModeToggle("recruiter")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      viewMode === "recruiter"
                        ? "bg-[#4A7BF7] text-white shadow-sm"
                        : "text-[#6B7280] hover:text-[#0F172A]"
                    }`}
                  >
                    <Users className="h-2.5 w-2.5" />
                    Recruiter
                  </button>
                  <button
                    onClick={() => handleViewModeToggle("designer")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      viewMode === "designer"
                        ? "bg-[#4A7BF7] text-white shadow-sm"
                        : "text-[#6B7280] hover:text-[#0F172A]"
                    }`}
                  >
                    <Palette className="h-2.5 w-2.5" />
                    Designer
                  </button>
                </div>

                {/* Open to work pill */}
                <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-50/60 px-3 py-[3px] text-[11px] font-medium text-emerald-700 shadow-lg breathing">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Open to roles: Product · UX · Systems</span>
                </div>

                {/* Mini status line */}
                <p className="font-pixel text-[10px] leading-relaxed tracking-[0.26em] uppercase text-slate-500">
                  SYSTEM.STATUS: OPERATIONAL · VIEW.MODE: {viewMode.toUpperCase()}
                </p>
              </div>

              {/* Resume button */}
              <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }} transition={{ duration: 0.15 }}>
                <Button
                  size="sm"
                  className="gap-1.5 h-7 px-3 text-[11px] bg-[#4A7BF7] hover:bg-[#3B6CE8] text-white rounded-full shadow-sm hover:shadow-md transition-all"
                  asChild
                >
                  <a
                    href="https://drive.google.com/file/d/1jaaSJL7kWIxkYDRnyQOkN-DpAu9-hZTG/view?usp=drive_link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-3 w-3" />
                    Resume
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-[#6B7280] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent animate-pulse"
      />

      <div className="hidden lg:block bg-[#EEEEE9]/90 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-7">
            {/* Left - Current view label */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#9CA3AF] font-medium">Reading:</span>
              <span className="font-pixel text-[10px] leading-relaxed tracking-[0.26em] uppercase text-slate-500">
                {activeChapterConfig?.fullLabel || "Prologue · Pixelogic OS"}
              </span>
            </div>

            {/* Right - Context tags */}
            <div className="flex items-center gap-1.5">
              {contextTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[9px] font-medium text-[#6B7280] bg-white/60 rounded-full border border-slate-200/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - unchanged */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-[#F7F6F3]/98 backdrop-blur-md border-b border-slate-200"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {/* Mobile context label */}
              <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-[#EEEEE9]/60 rounded-lg">
                <span className="text-[10px] text-[#9CA3AF]">Reading:</span>
                <span className="font-pixel text-[10px] leading-relaxed tracking-[0.26em] uppercase text-slate-500">
                  {activeChapterConfig?.fullLabel || "Prologue · Pixelogic OS"}
                </span>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center justify-center gap-2 p-2 mb-2">
                <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200">
                  <button
                    onClick={() => handleViewModeToggle("recruiter")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      viewMode === "recruiter" ? "bg-[#4A7BF7] text-white shadow-sm" : "text-[#6B7280]"
                    }`}
                  >
                    <Users className="h-3 w-3" />
                    Recruiter
                  </button>
                  <button
                    onClick={() => handleViewModeToggle("designer")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      viewMode === "designer" ? "bg-[#4A7BF7] text-white shadow-sm" : "text-[#6B7280]"
                    }`}
                  >
                    <Palette className="h-3 w-3" />
                    Designer
                  </button>
                </div>
              </div>

              {/* Resume button */}
              <div className="pt-4 mt-2 border-t border-slate-200">
                <Button size="sm" className="w-full gap-2 bg-[#4A7BF7] hover:bg-[#3B6CE8] rounded-full" asChild>
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
