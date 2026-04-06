import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkHtml from "remark-html"
import { NOTES, type NoteMetadata } from "./notes-data"

const notesDirectory = path.join(process.cwd(), "content/notes")

export type { NoteMetadata }

export interface NoteWithContent extends NoteMetadata {
  contentHtml: string
  readingTime: number
}

export function getAllNoteSlugs(): string[] {
  return NOTES.map((note) => note.slug)
}

export async function getNoteBySlug(slug: string): Promise<NoteWithContent | null> {
  const meta = NOTES.find((n) => n.slug === slug)
  if (!meta) return null

  const filePath = path.join(notesDirectory, meta.file)
  if (!fs.existsSync(filePath)) return null

  const fileContents = fs.readFileSync(filePath, "utf8")
  const { content } = matter(fileContents)

  const processed = await remark().use(remarkHtml, { sanitize: false }).process(content)
  const contentHtml = processed.toString()

  const wordCount = content.split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return { ...meta, contentHtml, readingTime }
}
