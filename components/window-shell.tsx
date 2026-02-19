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
        "w-full h-full min-h-0 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group/window",
        className
      )}
      whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Window Title Bar */}
      <div className="flex items-center gap-3 px-4 h-10 flex-shrink-0 bg-slate-50 border-b border-slate-200">
        {/* Traffic Light Buttons - animate on window hover */}
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
        <span className="text-xs font-mono text-[#6B7280] uppercase tracking-wide">{title}</span>
      </div>
      {/* Window Content */}
      <div className="flex-1 min-h-0 overflow-hidden p-4 md:p-6">{children}</div>
    </motion.div>
  )
}
