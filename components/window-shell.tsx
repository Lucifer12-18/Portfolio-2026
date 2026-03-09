"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface WindowShellProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function WindowShell({ title, children, className }: WindowShellProps) {
  return (
    <motion.div
      className={cn(
        "w-full h-full min-h-0 flex flex-col bg-slate-950/[0.87] backdrop-blur-xl rounded-xl border border-white/8 shadow-[0_8px_40px_rgba(0,0,0,0.65)] overflow-hidden group/window",
        className
      )}
      whileHover={{
        boxShadow:
          "0 0 0 1px rgba(34,211,238,0.18), 0 12px 48px rgba(0,0,0,0.7)",
      }}
      transition={{ duration: 0.25 }}
    >
      {/* Window Title Bar */}
      <div className="relative flex items-center gap-3 px-4 h-10 flex-shrink-0 bg-slate-900/70 backdrop-blur-sm border-b border-white/5">
        {/* Traffic Light Buttons */}
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-3 h-3 rounded-full bg-[#FF5F57]"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-[#FEBC2E]"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-[#28C840]"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.15 }}
          />
        </div>
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">{title}</span>
        {/* Animated glow line at bottom of title bar — echoes the navbar's sky pulse */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent animate-pulse"
        />
      </div>
      {/* Window Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 modal-scroll flex flex-col">{children}</div>
    </motion.div>
  )
}
