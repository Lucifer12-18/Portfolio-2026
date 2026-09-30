export type ChapterId =
  | "prologue"
  | "origin"
  | "shift"
  | "how"
  | "cases"
  | "notes"
  | "epilogue"

export interface ChapterConfig {
  id: ChapterId
  chapterNumber: number
  label: string // short label for ChapterRail
  fullLabel: string // rich label for header / console
  sectionId: string // DOM id of the section
}

/**
 * Map a URL hash (e.g. "#chapter-4", "chapter-4", "#prologue") to a chapter
 * index, or -1 when it doesn't name a chapter. Used for deep links: notes and
 * case-story pages link back to specific chapters via /#chapter-N.
 */
export function sectionIdToChapterIndex(hash: string): number {
  const id = hash.replace(/^#/, "")
  if (!id) return -1
  return CHAPTERS.findIndex((c) => c.sectionId === id)
}

export const CHAPTERS: ChapterConfig[] = [
  {
    id: "prologue",
    chapterNumber: 0,
    label: "Prologue",
    fullLabel: "Prologue · Pixelogic OS",
    sectionId: "prologue",
  },
  {
    id: "origin",
    chapterNumber: 1,
    label: "Origin",
    fullLabel: "Origin · The Systems Background",
    sectionId: "chapter-1",
  },
  {
    id: "shift",
    chapterNumber: 2,
    label: "Shift",
    fullLabel: "Shift · From Logic to Experience",
    sectionId: "chapter-2",
  },
  {
    id: "how",
    chapterNumber: 3,
    label: "Method",
    fullLabel: "Method · The Design Rhythm",
    sectionId: "chapter-3",
  },
  {
    id: "cases",
    chapterNumber: 4,
    label: "Work",
    fullLabel: "Work · Case Stories in Practice",
    sectionId: "chapter-4",
  },
  {
    id: "notes",
    chapterNumber: 5,
    label: "Notes",
    fullLabel: "Notes · Observations from the Field",
    sectionId: "chapter-5",
  },
  {
    id: "epilogue",
    chapterNumber: 6,
    label: "Epilogue",
    fullLabel: "Epilogue · Open Channel",
    sectionId: "epilogue",
  },
]






