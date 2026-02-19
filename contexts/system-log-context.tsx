"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

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

const SystemLogContext = createContext<SystemLogContextType | undefined>(undefined)

export function SystemLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [nextId, setNextId] = useState(0)

  const addLog = useCallback(
    (message: string) => {
      setLogs((prev) => [...prev, { id: nextId, message, timestamp: new Date() }])
      setNextId((prev) => prev + 1)
    },
    [nextId],
  )

  useEffect(() => {
    const bootSequence = async () => {
      addLog("> boot: Pixelogic OS v1.0")
      await new Promise((r) => setTimeout(r, 400))
      addLog("> system.status: operational")
      await new Promise((r) => setTimeout(r, 300))
      addLog("> primary user: Vishal Deshmukh (Product Designer)")
      await new Promise((r) => setTimeout(r, 350))
      addLog("> focus: UX, AI, and systems-heavy products")
      await new Promise((r) => setTimeout(r, 300))
      addLog("> hint: toggle recruiter/designer view in the top bar")
    }
    bootSequence()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearLogs = useCallback(() => {
    setLogs([])
    setNextId(0)
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
