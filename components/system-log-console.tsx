"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus } from "lucide-react"
import { useSystemLog } from "@/contexts/system-log-context"
import { useVisitors } from "@/components/stats"
import { visitorStore } from "@/lib/stats"
import { childSlide, EASE_SETTLE } from "@/lib/motion"

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM LOG — the OS voice, turned down. Shows the live tail of the shared log
// (boot, chapter loads, mode switches, opened case studies). Mono, grey, the
// newest line in bone with a caret. Collapsible. Desktop only (lg column).
// ─────────────────────────────────────────────────────────────────────────────

const VISIBLE = 7

export function SystemLogConsole() {
  const { logs, addLog } = useSystemLog()
  const visitors = useVisitors()
  const greeted = useRef(false)

  // Once the count arrives: "visitor #1,285 connected" (or the running total)
  useEffect(() => {
    if (visitors === null || greeted.current) return
    greeted.current = true
    const you = visitorStore.you()
    addLog(you ? `> visitor #${you.toLocaleString("en-US")} connected` : `> visitors.total: ${visitors.toLocaleString("en-US")}`)
  }, [visitors, addLog])
  const [collapsed, setCollapsed] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const tail = logs.slice(-VISIBLE)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [logs])

  return (
    <motion.div
      variants={childSlide}
      initial="hidden"
      animate="show"
      custom={4}
      className="surface w-full overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 h-10 border-b border-hair">
        <span className="label-mono">System log</span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand system log" : "Collapse system log"}
          aria-expanded={!collapsed}
          className="-mr-1.5 flex h-6 w-6 items-center justify-center rounded-full text-bone-3 hover:text-bone hover:bg-white/5 transition-colors"
        >
          {collapsed ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_SETTLE }}
          >
            <div
              ref={scrollRef}
              aria-hidden
              className="px-5 py-4 max-h-[190px] overflow-hidden font-mono text-[10.5px] leading-[1.75] break-words"
            >
              {tail.map((log, i) => {
                const newest = i === tail.length - 1
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    // First paint staggers the boot lines in; later entries arrive alone.
                    transition={{ duration: 0.35, ease: EASE_SETTLE, delay: log.id < 5 ? 0.25 + log.id * 0.07 : 0 }}
                    className={newest ? "text-bone-2" : "text-bone-4"}
                  >
                    {log.message}
                    {newest && <span className="crt-cursor text-bone-3" />}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
