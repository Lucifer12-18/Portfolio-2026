# Routes & Pages

All routes live in `app/` using the Next.js App Router.

---

## Route Map

```
/                                    → app/page.tsx
/case-stories/hirello-ai/            → app/case-stories/hirello-ai/page.tsx
/case-stories/hirello-ai/full        → app/case-stories/hirello-ai/full/page.tsx
/case-stories/hirello-ai/interview   → app/case-stories/hirello-ai/interview/page.tsx
/case-stories/hirello-ai/networking  → app/case-stories/hirello-ai/networking/page.tsx
/notes/[slug]                        → app/notes/[slug]/page.tsx
/notes/[slug] (404)                  → app/notes/[slug]/not-found.tsx
```

---

## Page Details

### `/` — Home (app/page.tsx)
The entire portfolio experience. A single-page app with 7 chapters swapped via `AnimatePresence`. Not a scroll site — chapters are paginated.

**Providers wrapping everything:**
`SystemLogProvider` → `ReadingStoreProvider` → `ViewModeProvider` → `ModalProvider`

**Layout (desktop — 3-column grid):**
- Left col (220px): `ChapterRail` — sticky chapter navigation
- Center col (1fr): `PageFlipContainer` — animated chapter content
- Right col (360px): `SystemLogConsole` — live activity log

**Fixed layers (z-index stack):**
- z-1: `PersistentScene` (Three.js, behind everything)
- z-1: `GradientOverlay` (reactive color tint)
- z-2: Main content (`Navbar` + `PageFlipContainer` + `Footer`)
- z-3: `ForegroundParticles` (subtle wisps above content)
- z-8: `LuminousBurst` (chapter-change radial burst)

**Special components rendered here (not in sections):**
- `OpeningHero` — boot splash, hides main UI until dismissed
- `PageLevelModal` — `ProjectModal` rendered outside the perspective container to avoid clip-path clipping

---

### `/case-stories/hirello-ai/` — Hirello Snapshot
A standalone page (not part of the chapter system) with its own `Navbar` + `Footer`. Uses `WindowShell` to present the case in a "file" UI metaphor.

**Content:** Problem, approach (3 items), outcome, tools used, CTA to `/full`
**Tags:** Product Design · AI & UX · Systems Thinking
**Tools:** Figma · FigJam · Maze

---

### `/case-stories/hirello-ai/full` — Full Case Study
Deep-dive page for Hirello. Longer format with decisions, flows, and tradeoffs.

### `/case-stories/hirello-ai/interview` — Interview Module
Case story focused specifically on the AI Interview Gym module.

### `/case-stories/hirello-ai/networking` — Networking Module
Case story focused on the Networking Intelligence System module.

---

### `/notes/[slug]` — Note Article Page (app/notes/[slug]/page.tsx)
Dynamic route. Statically generated at build time from `NOTES` in `lib/notes-data.ts`.

**Slugs (5 total):**
- `ai_ux_balance`
- `is_to_ux`
- `storytelling`
- `feedback_loops`
- `designing_for_latency`

**Features:**
- `generateStaticParams()` — pre-renders all 5 slugs
- `generateMetadata()` — per-article OG title, description, og:image
- Renders markdown via `lib/notes.ts` (gray-matter + remark → HTML)
- Applies `.note-prose` CSS class from `globals.css`
- SVG infographics are embedded inline in the markdown

**Not found:** `app/notes/[slug]/not-found.tsx` — custom 404 for unknown slugs

---

## Layout (app/layout.tsx)
Root layout. Wraps everything in `ThemeProvider` (next-themes). Sets font, viewport, base metadata.
