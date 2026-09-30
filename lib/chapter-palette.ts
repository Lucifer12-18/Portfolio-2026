// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER PALETTE — singleton (3) of the Conserved Current: the per-chapter
// accent crossfade. Particles, bloom, burst, cursor, telemetry, rail AND the
// interface accent (CSS var --chapter, see <ChapterAccent/> in page.tsx) all
// derive from THIS table — it used to be copy-pasted into six files and drifted.
//
// The palette is a dusk-to-dawn arc across the story: warm and earthy in the
// opening chapters, cooling through violet and blue into sage, resolving on
// champagne. Every pigment is mid-saturation, high-luminance — rich on
// charcoal (≥6:1 as text) without tipping into neon. Charcoal + bone stay the
// calm base; the pigment is what moves.
// ─────────────────────────────────────────────────────────────────────────────

export interface Rgb {
  r: number
  g: number
  b: number
}

export const CHAPTER_ACCENTS: Rgb[] = [
  { r: 242, g: 166, b: 90 },  // 0 Prologue — amber      #f2a65a
  { r: 230, g: 126, b: 98 },  // 1 Origin   — terracotta #e67e62
  { r: 224, g: 122, b: 158 }, // 2 Shift    — rose       #e07a9e
  { r: 168, g: 144, b: 232 }, // 3 Method   — lavender   #a890e8
  { r: 122, g: 156, b: 242 }, // 4 Work     — periwinkle #7a9cf2
  { r: 110, g: 196, b: 170 }, // 5 Notes    — sage       #6ec4aa
  { r: 236, g: 214, b: 170 }, // 6 Epilogue — champagne  #ecd6aa
]

/** Same accents normalised to 0–1 for shader uniforms. */
export const CHAPTER_ACCENTS_VEC: [number, number, number][] = CHAPTER_ACCENTS.map(({ r, g, b }) => [
  r / 255,
  g / 255,
  b / 255,
])

/** Scene clear colors — charcoal carrying a breath of each chapter's hue. */
export const CHAPTER_SCENE_BG = [
  "#14110d",
  "#150f0d",
  "#140e11",
  "#110f16",
  "#0e1017",
  "#0d1311",
  "#13120f",
]

// Mirrors the GLSL shape names — the status line, rail and telemetry speak the
// same language as the 3D engine.
export const FORMATION_IDS = [
  "fibonacci_sphere",
  "double_helix",
  "torus",
  "trefoil_knot",
  "crystal_lattice",
  "wave_surface",
  "starburst",
]

export function accentAt(index: number): Rgb {
  return CHAPTER_ACCENTS[index] ?? CHAPTER_ACCENTS[0]
}

/** "r, g, b" — for rgba() strings and Spotlight's `color` prop. */
export function accentRgb(index: number): string {
  const { r, g, b } = accentAt(index)
  return `${r}, ${g}, ${b}`
}

/** "#rrggbb" — for the --chapter CSS custom property. */
export function accentHex(index: number): string {
  const { r, g, b } = accentAt(index)
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`
}

/** The whole arc as one gradient — the site's signature hairline. */
export const SPECTRUM_GRADIENT = `linear-gradient(90deg, ${CHAPTER_ACCENTS.map((_, i) => accentHex(i)).join(", ")})`
