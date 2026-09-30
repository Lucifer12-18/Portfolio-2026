"use client"

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react"

interface LogEntry {
  id: number
  message: string
  timestamp: Date
}

interface SystemLogContextType {
  logs: LogEntry[]
  addLog: (message: string) => void
  clearLogs: () => void
}

const BOOT_LINES = [
  "> boot: Pixelogic OS v2.0",
  "> user: Vishal Deshmukh, product designer",
  "> now: TasteMakers · design systems for AI",
  "> hint: ← → moves between chapters",
]

const SystemLogContext = createContext<SystemLogContextType | undefined>(undefined)

export function SystemLogProvider({ children }: { children: ReactNode }) {
  // Boot lines are the INITIAL state, not an effect: child effects run before
  // this provider's, so an effect-based boot landed after the first chapter's
  // "loaded section" entry.
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    BOOT_LINES.map((message, id) => ({ id, message, timestamp: new Date() })),
  )
  // Ref counter, not state — a state counter read from a stale closure used to
  // stamp every entry with the same id (duplicate keys).
  const nextId = useRef(BOOT_LINES.length)

  const addLog = useCallback((message: string) => {
    const id = nextId.current++
    // Keep the buffer bounded — the panel only shows the tail.
    setLogs((prev) => [...prev.slice(-39), { id, message, timestamp: new Date() }])
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  return <SystemLogContext.Provider value={{ logs, addLog, clearLogs }}>{children}</SystemLogContext.Provider>
}

export function useSystemLog() {
  const context = useContext(SystemLogContext)
  if (context === undefined) {
    throw new Error("useSystemLog must be used within a SystemLogProvider")
  }
  return context
}
