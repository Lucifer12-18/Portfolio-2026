# State & Contexts

All global state is managed through React Context. Providers nest inside each other in `app/page.tsx`.

---

## Provider Nesting Order

```
SystemLogProvider
  └── ReadingStoreProvider
        └── ViewModeProvider
              └── ModalProvider
                    └── [all page content]
```

---

## ReadingStoreContext
**File:** `contexts/reading-store-context.tsx`
**The most important context.** Manages which chapter is active.

### State
- `activeChapterIndex` — 0–6, which chapter is currently shown
- `activeModule` — string or null (for system log events)

### Derived values (computed from index)
- `activeChapterId` — e.g. `"prologue"`, `"notes"`
- `activeChapterConfig` — full `ChapterConfig` object from CHAPTERS
- `activeSection` — DOM section ID (e.g. `"chapter-4"`)

### Actions
- `setActiveChapterIndex(index)` — navigate to specific chapter (clamped 0–6)
- `goToNextChapter()` — increment
- `goToPrevChapter()` — decrement

### Used by
- `app/page.tsx` — `PageFlipContainer`, `LuminousBurst`, `GradientOverlay`, `ParticleSystemStatus`
- `components/chapter-rail.tsx` — highlight active chapter
- `components/navbar.tsx` — show current chapter label
- `components/system-log-console.tsx` — log chapter changes

---

## ViewModeContext
**File:** `contexts/view-mode-context.tsx`
Controls Recruiter vs Designer mode.

### State
- `viewMode: "recruiter" | "designer"` (default: `"designer"`)

### Actions
- `setViewMode(mode)` — toggle from Navbar

### Used by
- `components/work-section.tsx` — shows bullets in recruiter mode
- `components/about-section.tsx` — shows condensed bio in recruiter mode
- `components/capabilities-section.tsx` — shows quick list in recruiter mode
- Navbar toggle button

---

## SystemLogContext
**File:** `contexts/system-log-context.tsx`
Powers the right-rail `SystemLogConsole`. Maintains a rolling log of events.

### State
- `logs: string[]` — array of log messages

### Actions
- `addLog(message: string)` — append a line

### Used by
- Any component that wants to surface an event (project click, chapter change, etc.)
- `components/system-log-console.tsx` — renders the log

### Pattern
```tsx
const { addLog } = useSystemLog()
addLog(`> opened case study: Hirello.ai`)
```

---

## ModalContext
**File:** `contexts/modal-context.tsx`
Controls the `ProjectModal` overlay.

### State
- `project` — the currently selected project's data (or null)
- `isOpen` — boolean

### Actions
- `openModal(projectData)` — open modal with project data
- `closeModal()` — close

### Used by
- `components/work-section.tsx` — calls `openModal()` on card click
- `app/page.tsx` — `PageLevelModal` consumes `isOpen` + `project`

---

## formation-state.ts (not a context — a plain ref)
**File:** `lib/formation-state.ts`
A module-level ref shared between `app/page.tsx` and `components/persistent-scene.tsx`.

```ts
export const formationWatchRef = { current: false }
```

When `true`, the 3D scene switches into "showcase rotation" (slower, more dramatic rotation during the formation-watch window). Avoids a context re-render for what is essentially a signal to the canvas.

---

## Custom Hooks
**File:** `hooks/use-mobile.ts`
Returns `isMobile: boolean` based on viewport width. Used to conditionally render mobile-only elements.

**File:** `hooks/use-toast.ts`
Standard shadcn toast hook. Provides `toast()` function.
