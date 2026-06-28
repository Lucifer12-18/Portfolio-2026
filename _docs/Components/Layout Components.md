# Layout Components

These are the structural/chrome components — they frame the experience, not the content.

---

## Navbar
**File:** `components/navbar.tsx`

Top navigation bar. Contains:
- Portfolio title / logo
- Current chapter label (reads from `ReadingStoreContext`)
- View mode toggle: Recruiter ↔ Designer (updates `ViewModeContext`)

---

## Footer
**File:** `components/footer.tsx`

Pinned to the bottom of the viewport via `absolute bottom-0` in the main layout. Minimal — copyright / links.

---

## ChapterRail
**File:** `components/chapter-rail.tsx`

Left sidebar (desktop only, hidden on mobile). Renders the 7 chapter entries from `CHAPTERS` config. Highlights the active chapter. Clicking a chapter calls `setActiveChapterIndex()`.

**Source of truth:** `lib/chapters-config.ts` → `CHAPTERS` array

---

## SystemLogConsole
**File:** `components/system-log-console.tsx`

Right sidebar (desktop only). Displays a rolling list of log messages from `SystemLogContext`. Messages are added by any component calling `addLog()`. Shows the live "system" activity as the user navigates — project opens, chapter changes, etc.

---

## WindowShell
**File:** `components/window-shell.tsx`

A reusable "file/window" frame with a monospace title bar (like a code editor tab). Used on case story pages to wrap content in the OS metaphor. Props: `title`, `className`, `children`.

---

## SectionWrapper
**File:** `components/section-wrapper.tsx`

Wraps each chapter section with consistent padding, a `windowTitle` shown in the frame header, and a `moduleLabel`. Sets the DOM `id` for each section. All 7 chapter components use this as their outermost wrapper.

Props: `id`, `windowTitle`, `moduleLabel`, `className`, `children`

---

## ModuleBadge
**File:** `components/module-badge.tsx`

The monospace badge shown at the top of each section. Displays the module number and label, e.g. `MODULE · 04 / WORK`. Styled with font-mono, uppercase, muted color.

Props: `module` (e.g. `"04"`), `label` (e.g. `"WORK"`)

---

## ThemeProvider
**File:** `components/theme-provider.tsx`

Thin wrapper around `next-themes`. Provides dark/light mode context. Currently the site is dark-mode only in practice, but the provider is set up for future theming.

---

## TypewriterText
**File:** `components/typewriter-text.tsx`

Animated text reveal component. Renders characters one at a time.

Props: `text`, `speed` (ms per char), `loop` (boolean), `className`

Used in section headings for the "chapter is booting up" feel.

---

## CursorEffect
**File:** `components/cursor-effect.tsx`

Custom cursor system that replaces the native OS cursor on non-touch devices. Three-layer stack:

| Layer | z-index | What it does |
|---|---|---|
| Canvas particle trail | 9996 | 22-point trail drawn via `requestAnimationFrame`, fades with age |
| Idle targeting reticle | 9997 | Crosshair + corner brackets + pulsing ring — appears after 1.8s of no movement |
| Spring ring | 9998 | Lagged follower ring — morphs to rounded-rect on hover, shrinks on click |
| Dot | 9999 | Instant-snap dot — hides on hover, grows on click |

All colors track the active chapter via `CHAPTER_ACCENTS[]` array — same palette as `tailwind.config.ts chapter.*`. Accent ref is kept in sync via `accentRef` pattern (separate `useEffect` updates a ref; RAF reads the ref, so no effect recreation on chapter change).

Touch devices: returns `null`, restores the native cursor.

**Mounted in:** `app/page.tsx` — inside `ModalProvider` / `ReadingStoreProvider`, after `<PageLevelModal />` so it always appears above everything.

## Sidebar Dock
**File:** `components/sidebar-dock.tsx`

A floating action dock. Check this file if you want to add persistent floating actions/buttons.
