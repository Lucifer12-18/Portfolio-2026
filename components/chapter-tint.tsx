"use client"

import { useEffect } from "react"
import { accentHex } from "@/lib/chapter-palette"

/**
 * Sets the interface pigment (--chapter on <html>). The property is registered
 * with @property in globals.css, so changing it CROSSFADES every consumer —
 * headline payoffs, rail, progress hairlines, chips, selection — in step with
 * the particle field's own color blend.
 *
 * Home drives it from the active chapter; standalone pages pin the chapter
 * they belong to (case stories → Work, notes → Notes).
 */
export function ChapterTint({ index }: { index: number }) {
  useEffect(() => {
    document.documentElement.style.setProperty("--chapter", accentHex(index))
  }, [index])
  return null
}
