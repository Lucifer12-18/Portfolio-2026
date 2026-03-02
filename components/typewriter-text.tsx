"use client"

import { useEffect, useState } from "react"

interface TypewriterTextProps {
  text: string
  speed?: number
  className?: string
  loop?: boolean
}

export function TypewriterText({
  text,
  speed = 40,
  className = "",
  loop = false,
}: TypewriterTextProps) {
  const [index, setIndex] = useState(0)
  const done = index >= text.length && !loop

  useEffect(() => {
    if (index >= text.length) {
      if (!loop) return
      const resetTimeout = setTimeout(() => setIndex(0), 1400)
      return () => clearTimeout(resetTimeout)
    }

    const timeout = setTimeout(() => {
      setIndex((prev) => prev + 1)
    }, speed)

    return () => clearTimeout(timeout)
  }, [index, text, speed, loop])

  const visible = text.slice(0, index)

  return (
    <span className={className}>
      <span>{visible}</span>
      {!done && (
        <span
          className="inline-block ml-0.5 w-[2px] bg-cyan-400/80 animate-pulse rounded-full align-middle"
          style={{ height: "0.75em" }}
        />
      )}
    </span>
  )
}

