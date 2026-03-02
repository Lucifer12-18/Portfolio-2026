"use client"

import { Command } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-6 border-t border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:pl-24">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Command className="h-4 w-4" />
              <span className="font-semibold text-foreground">Pixelogic OS</span>
            </div>
            <span className="text-border">|</span>
            <span className="font-mono text-xs">v1.0.0</span>
            <span className="text-border">|</span>
            <span>© {currentYear} Vishal Deshmukh</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              {/* Subtle Framer Motion pulse */}
              <motion.span
                className="h-2 w-2 rounded-full bg-green-500"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <span>system.status: operational</span>
            </div>
            <span className="text-border">|</span>
            <span>uptime: 99.9%</span>
            <span className="text-border">|</span>
            <span>ping: 12ms</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-sm font-mono text-muted-foreground">
            &gt; end of log. ready for next chapter.
          </p>
        </div>
      </div>
    </footer>
  )
}
