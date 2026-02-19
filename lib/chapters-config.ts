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

export const CHAPTERS: ChapterConfig[] = [
  {
    id: "prologue",
    chapterNumber: 0,
    label: "Prologue",
    fullLabel: "Prologue · Pixelogic OS",
    sectionId: "prologue", // matches HeroSection section/id
  },
  {
    id: "origin",
    chapterNumber: 1,
    label: "Chapter 1",
    fullLabel: "Chapter 1 · Origin Story",
    sectionId: "chapter-1", // AboutSection
  },
  {
    id: "shift",
    chapterNumber: 2,
    label: "Chapter 2",
    fullLabel: "Chapter 2 · Shift into UX & Product",
    sectionId: "chapter-2", // CapabilitiesSection
  },
  {
    id: "how",
    chapterNumber: 3,
    label: "Chapter 3",
    fullLabel: "Chapter 3 · How I Work",
    sectionId: "chapter-3", // ProcessSection
  },
  {
    id: "cases",
    chapterNumber: 4,
    label: "Chapter 4",
    fullLabel: "Chapter 4 · Case Stories",
    sectionId: "chapter-4", // WorkSection
  },
  {
    id: "notes",
    chapterNumber: 5,
    label: "Chapter 5",
    fullLabel: "Chapter 5 · Notes from the System",
    sectionId: "chapter-5", // NotesSection
  },
  {
    id: "epilogue",
    chapterNumber: 6,
    label: "Epilogue",
    fullLabel: "Epilogue · Contact",
    sectionId: "epilogue", // ContactSection
  },
]






