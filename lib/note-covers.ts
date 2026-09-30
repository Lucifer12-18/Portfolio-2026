// Note cover specs — plain data (NOT a client module) so server components
// like the note article page can read a note's pigment directly.
import { accentHex } from "@/lib/chapter-palette"

export type NoteMotif = "stack" | "grid" | "path" | "ruler" | "ring"

export const NOTE_COVERS: Record<string, { word: string; pigment: number; motif: NoteMotif }> = {
  ai_ux_balance: { word: "Reveal.", pigment: 0, motif: "stack" },
  is_to_ux: { word: "Systems.", pigment: 3, motif: "grid" },
  storytelling: { word: "Story.", pigment: 2, motif: "path" },
  feedback_loops: { word: "Measure.", pigment: 5, motif: "ruler" },
  designing_for_latency: { word: "Wait.", pigment: 4, motif: "ring" },
}

/** Palette index a note wears — note pages tint the whole UI to match. */
export function notePigmentIndex(slug: string) {
  return NOTE_COVERS[slug]?.pigment ?? 5
}

/** "#rrggbb" pigment of a note's cover. */
export function notePigment(slug: string) {
  return accentHex(notePigmentIndex(slug))
}
