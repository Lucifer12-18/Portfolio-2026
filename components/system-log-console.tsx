"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { useReadingStore } from "@/contexts/reading-store-context"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useViewMode } from "@/contexts/view-mode-context"
import { TypewriterText } from "@/components/typewriter-text"

const BASE_LOGS = [
  "> boot: Pixelogic OS v1.0",
  "> system.status: operational",
  "> primary user: Vishal Deshmukh (Product Designer)",
  "> focus: UX, AI, and systems-heavy products",
  "> hint: toggle recruiter/designer view in the top bar",
]

export function SystemLogConsole() {
  const { activeChapterConfig } = useReadingStore()
  const { viewMode } = useViewMode()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMobileExpanded, setIsMobileExpanded] = useState(false)

  // Compute logs based on reading store state
  const logs = useMemo(() => {
    const computedLogs = [...BASE_LOGS]

    if (activeChapterConfig) {
      computedLogs.push(`> loaded chapter: ${activeChapterConfig.fullLabel}`)
      computedLogs.push(`> chapter.id: ${activeChapterConfig.chapterNumber}`)
    }

    if (viewMode) {
      computedLogs.push(`> view.mode: ${viewMode}`)
    }

    return computedLogs.map((message, index) => ({ id: index, message, timestamp: new Date() }))
  }, [activeChapterConfig, viewMode])

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  // Desktop view
  const DesktopConsole = () => (
    <div className="w-full h-full min-h-0 flex flex-col rounded-[28px] bg-slate-950 text-[11px] text-slate-50 shadow-xl border border-slate-800/60 overflow-hidden whitespace-pre-wrap break-words animate-system-log-in breathing">
      {/* Header - fixed height */}
      <div className="flex items-center gap-3 px-4 pt-2.5 pb-2 flex-shrink-0 bg-slate-900/70 border-b border-slate-800/60">
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setIsOpen(false)}
            className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 transition-colors"
          />
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 transition-colors"
          />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        <span className="font-pixel text-[10px] leading-none tracking-[0.24em] uppercase text-sky-100">
          SYSTEM.LOG
        </span>
      </div>

      {/* Log body - flex-1 min-h-0 overflow-y-auto */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto p-4 pb-6"
          >
            <div className="font-mono text-xs leading-relaxed text-emerald-200">
              {logs.map((log, index) => (
                <motion.div
                  key={`${index}-${log.message ?? ""}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  {index === 0 ? (
                    <TypewriterText text={log.message} speed={35} className="text-emerald-200" />
                  ) : (
                    log.message
                  )}
                </motion.div>
              ))}
            </div>
            <span className="inline-block w-1.5 h-3 bg-[#5EEAD4]/60 animate-pulse mt-0.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const MobileConsole = () => (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <AnimatePresence mode="wait">
        {isMobileExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-[#0F172A] rounded-xl border border-[#1E293B] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 bg-[#1E293B]/50 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMobileExpanded(false)}
                    className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"
                  />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <span className="font-pixel text-[10px] leading-none tracking-[0.24em] uppercase text-sky-100 ml-2">SYSTEM.LOG</span>
              </div>
            </div>
            <div ref={scrollRef} className="overflow-y-auto p-3 max-h-32">
              <div className="font-mono text-xs leading-relaxed text-emerald-200">
                {logs.map((log, index) => (
                  <div key={`${index}-${log.message ?? ""}`}>
                    {log.message}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileExpanded(true)}
            className="w-full py-2 px-4 bg-[#0F172A] rounded-xl border border-[#1E293B] flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#5EEAD4]/70" />
              <span className="text-xs font-medium text-[#94A3B8]">View system log</span>
            </div>
            <span className="text-[10px] font-mono text-[#5EEAD4]/60">{logs.length} entries</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-900/80 backdrop-blur rounded-xl border border-slate-700/60 shadow-lg hover:bg-slate-800/80 transition-colors"
      >
        <Sparkles className="h-3.5 w-3.5 text-[#5EEAD4]/70" />
        <span className="text-xs font-medium text-slate-300">system.log</span>
      </motion.button>
    )
  }

  return (
    <>
      <DesktopConsole />
      <MobileConsole />
    </>
  )
}
