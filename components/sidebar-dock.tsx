"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Home, User, Layers, Briefcase, Workflow, Beaker, FileText, Mail } from "lucide-react"

const dockItems = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: User, label: "About", href: "#about" },
  { icon: Layers, label: "Capabilities", href: "#capabilities" },
  { icon: Briefcase, label: "Work", href: "#work" },
  { icon: Workflow, label: "Process", href: "#process" },
  { icon: Beaker, label: "Playground", href: "#playground" },
  { icon: FileText, label: "Notes", href: "#notes" },
  { icon: Mail, label: "Contact", href: "#contact" },
]

export function SidebarDock() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <nav
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-1 p-2 bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-lg"
      aria-label="Section navigation"
    >
      {dockItems.map((item) => (
        <motion.a
          key={item.href}
          href={item.href}
          className={cn(
            "relative p-3 rounded-xl text-muted-foreground transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          )}
          onMouseEnter={() => setHoveredItem(item.label)}
          onMouseLeave={() => setHoveredItem(null)}
          aria-label={item.label}
          whileHover={{
            scale: 1.1,
            color: "var(--primary)",
            backgroundColor: "var(--secondary)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <item.icon
            className={cn("h-5 w-5 transition-all duration-200", hoveredItem === item.label && "icon-glow")}
            style={
              hoveredItem === item.label
                ? {
                    filter: "drop-shadow(0 0 6px var(--primary)) drop-shadow(0 0 10px var(--primary))",
                  }
                : undefined
            }
          />
          {/* Tooltip with AnimatePresence */}
          <AnimatePresence>
            {hoveredItem === item.label && (
              <motion.div
                className="absolute left-full ml-3 px-2 py-1 bg-foreground text-background text-xs font-medium rounded-md whitespace-nowrap"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15 }}
              >
                {item.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.a>
      ))}
    </nav>
  )
}
