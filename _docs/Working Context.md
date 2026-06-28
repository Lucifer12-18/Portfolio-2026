# Working Context
> **Read this at the start of every session.** It's the single source of truth for current project state.
> Update it whenever something significant changes.

---

## Current Status
**Last updated:** 2026-04-20
**Dev server:** `npm run dev` → localhost:3000
**Build status:** ⏳ Visual verification pending (sandbox npm install timed out — run `npm run dev` locally to confirm)

**Active experiment (2026-04-20, iter 2):** full warm-amber shift. Base went fully black/graphite AND brand accent (`--primary`) moved from electric blue `#4a7bf7` → warm amber `#f59e0b`. The first iteration (neutral dark base only) looked "basically the same" per user feedback because the blue `--primary` and cyan/blue `text-gradient` still dominated the hero headline + CTAs + eyebrow labels. Iter 2 rebuilds the accent chrome around amber + coral + lavender. Cyan is preserved only in contextual places (system-log, chapter-0 particle accents, 3D scene). Revertible — see _docs/Sessions/Session Log.md entry dated 2026-04-20 (iter 2).

---

## What's Done ✅

### Core Site
- [x] Full 7-chapter single-page layout with `PageFlipContainer`
- [x] 3D particle system (`PersistentScene`) — chapter-synced formations, formation-watch window (2.6s exposure between chapters)
- [x] `LuminousBurst` — radial color burst synced with particle bloom on chapter change
- [x] `ParticleSystemStatus` — live monospace status line ("▸ compiling.torus" → "▸ render.complete")
- [x] Keyboard navigation (arrow keys) + swipe (mobile)
- [x] `OpeningHero` — boot/splash screen that must be dismissed before main UI appears
- [x] `ChapterRail` — left sidebar with chapter numbers and labels (desktop only)
- [x] `SystemLogConsole` — right sidebar live activity log (desktop only)
- [x] `Navbar` — top navigation with view mode toggle (Recruiter / Designer)
- [x] `ViewMode` — dual-mode content system (Recruiter mode shows quick bullets, Designer mode shows full detail)

### Sections (all 7 chapters)
- [x] Chapter 0 — `HeroSection` (Prologue · Pixelogic OS)
- [x] Chapter 1 — `AboutSection` (Origin · The Systems Background)
- [x] Chapter 2 — `CapabilitiesSection` (Shift · From Logic to Experience)
- [x] Chapter 3 — `ProcessSection` (Method · The Design Rhythm)
- [x] Chapter 4 — `WorkSection` (Work · Case Stories in Practice)
- [x] Chapter 5 — `NotesSection` (Notes · Observations from the Field)
- [x] Chapter 6 — `ContactSection` (Epilogue · Open Channel)

### Work / Case Studies
- [x] 3 projects in `WorkSection` — Hirello.ai (featured), Reddit Redesign, AI Job Dashboard
- [x] `ProjectModal` — click any project card → full modal overlay with problem/approach/outcome
- [x] Case story pages: `/case-stories/hirello-ai/` (snapshot), `/full`, `/interview`, `/networking`

### Notes Section
- [x] 5 articles in `/content/notes/` (markdown)
- [x] `lib/notes-data.ts` — typed metadata for all notes (slug, title, excerpt, date, tag, accentColor, height)
- [x] `lib/notes.ts` — markdown parsing with gray-matter + remark
- [x] Dynamic route: `/notes/[slug]` with static generation + OG metadata
- [x] 5 dark-themed SVG infographics in `/public/images/notes/`
- [x] Note prose styles in `globals.css` (`.note-prose`, `.note-prose img`)

---

## What's In Progress / Next 🚧

> Add tasks here as they come up. Remove when done.

- [ ] Visually verify the warm-amber palette shift in the browser (2026-04-20 iter 2) — does it look good or roll back to blue?
- [ ] Visually verify the editorial redesign in the browser (all 7 chapters + notes article pages)
- [ ] Consider editorial polish on case story pages (`/case-stories/hirello-ai/*`) — typography primitives already propagate, but layouts haven't been touched

---

## Known Issues / Gotchas ⚠️

- **node_modules location:** The workspace `/mnt/v0/` folder has symlink permission issues. Always install deps in `/sessions/gracious-cool-newton/portfolio-dev/` and run dev server from there. The source files are in `/mnt/v0/portfolio-website-design/` — edit those, run from the copy.
- **pnpm-lock.yaml exists but pnpm can't be used in sandbox** — use `npm install --legacy-peer-deps` instead.
- **next.config.mjs** — check this if image domains need updating.
- **Tailwind v4** — uses `@tailwindcss/postcss` plugin, not the classic config. PostCSS config is at `postcss.config.mjs`.
- **Three.js version r183** — `CapsuleGeometry` doesn't exist in this version. Use `CylinderGeometry` or `SphereGeometry` instead.

---

## Palette (as of 2026-04-20 — warm-amber iter 2)

| Token | Value | Notes |
|---|---|---|
| `--background` | `#08080a` | full near-black graphite (was `#020617` slate-950 → `#0a0a0c` iter 1) |
| `--card` | `rgba(20, 20, 23, 0.72)` | dark charcoal glass |
| `--popover` / `--sidebar` | `#121215` | |
| `--secondary` | `rgba(28, 28, 32, 0.62)` | |
| `--muted` | `rgba(28, 28, 32, 0.55)` | |
| `--muted-foreground` | `#9ca0a8` | neutral grey (was blue-tinted slate-400) |
| `--primary` / `--ring` | `#f59e0b` | **THE shift** — warm amber (was electric blue `#4a7bf7`) |
| `--primary-foreground` | `#0a0a0c` | |
| `--accent` | `#f97362` | coral (unchanged, already warm) |
| `--lavender` | `#a78bfa` | unchanged — chromatic foil to amber |

**Gradients rebuilt:**
- `.text-gradient`: `amber → coral → lavender` (was cyan → blue → lavender)
- `.text-gradient-warm`: `cream → coral → lavender`
- `.text-shimmer`: amber/coral/cream/coral/lavender loop
- `.drop-cap::first-letter`: amber → lavender
- `@keyframes glow-pulse`: amber glow ring

**Blue `rgba(74, 123, 247, …)` values swept across:** `hero-section`, `about-section`, `chapter-rail`, `contact-section`, `capabilities-section`, `notes-section`, `process-section`, `work-section`, `navbar`, `project-modal`, `lib/notes-data.ts` (first note accent). Also `Spotlight color="74, 123, 247"` → `"245, 158, 11"` on both work-section calls.

**Tailwind `slate-950` / `slate-900` bg utilities** are retargeted in `globals.css` under `@layer utilities` so the section chrome (navbar, window-shell, project-modal, system-log-console) follows the neutral base without editing each component.

**Preserved blues/cyans on purpose:** system-log-console (monospace terminal aesthetic), chapter-0 particle accent, 3D particle scene rainbow, chapter-rail per-chapter accent array (each chapter keeps its color identity).

**To revert to blue:** `git checkout -- app/globals.css components/{hero,about,chapter-rail,contact,capabilities,notes,process,work,project-modal}-section.tsx components/navbar.tsx components/chapter-rail.tsx lib/notes-data.ts`. Or more surgically: in `globals.css`, change `--primary` back to `#4a7bf7`, revert the gradient rebuilds, and the components should re-tint via token propagation — except for the hardcoded rgba sweeps listed above, which need the git-revert above.

---

## Editorial Design System (shipped 2026-04-18)

The site now uses an editorial / cinematic visual language inspired by Basic Agency / Active Theory.
All chapter headers follow a unified pattern. Reach for these utilities before writing custom inline styles.

| Utility | Use for |
|---|---|
| `.display-xl` | Hero headline only — `clamp(2.75rem, 6.5vw, 5.25rem)`, line-height 0.98 |
| `.display-lg` | Chapter h2 headlines — `clamp(2.25rem, 4.8vw, 3.75rem)` |
| `.display-md` | Sub-section headings inside long chapters |
| `.eyebrow` | Mono uppercase label above headline (auto-prefixed with a 1.75rem gradient line) |
| `.lede` | Opening paragraph after a headline (light weight, 40ch max) |
| `.pull-quote` | Italic display-font block-quote with cyan left border |
| `.drop-cap` | Manual drop cap class. `.note-prose > p:first-of-type` applies it automatically. |
| `.marquee-num` | Decorative chapter numeral — large italic gradient digit, `aria-hidden`, absolute-positioned top-right |
| `.rule-tick` | 1px gradient divider with cyan dot prefix |
| `.text-shimmer` | Animated light sweep on gradient text (use sparingly — hero headline word) |

**Chapter header recipe:**
```tsx
<div aria-hidden="true" className="absolute top-4 right-6 md:right-10 marquee-num select-none">04</div>
<span className="eyebrow">Chapter 04 · Work · Case Stories</span>
<h2 className="display-lg text-slate-50">
  Case stories, <em className="not-italic text-gradient">not a résumé gallery.</em>
</h2>
<p className="lede">…</p>
```

`ModuleBadge` is no longer used inside section bodies — the chapter numeral + eyebrow replaces it.
The numeral and the section's accent color stay consistent per chapter (00 cyan, 01 lavender, 02 cyan, 03 amber→orange, 04 cyan, 05 lavender, 06 warm).

## Immersive Primitives (shipped 2026-04-18)

Three reusable effects — all respect `prefers-reduced-motion`.

| Component | Use for |
|---|---|
| `<FilmGrain />` | Mount once at page root. Subtle global noise overlay at z-9990, 5% opacity, `mix-blend-overlay`. Already wired in `app/page.tsx`. |
| `<Spotlight>` | Wrap any card / surface. Cursor-follow radial wash painted via CSS vars. Props: `size`, `color` (rgb triple string), `intensity`, `as`. |
| `<Magnetic>` | Wrap buttons / small interactive targets. Element drifts toward cursor within `range` (default 90px) by `strength` (default 8px). |

**When to use which:**
- Big content surfaces (project cards, note cards, hero mini-windows) → `Spotlight`
- Primary CTAs, small pill buttons → `Magnetic`
- Don't stack them on the same element — they compete.

Type sizes were tuned down on 2026-04-18 because the first editorial pass overflowed the windowed chapter viewport (`h-[calc(100vh-160px)]`). If you're adding new sections, reach for `.display-lg` (not `.display-xl`) unless you're on a full-scroll page like `/notes/[slug]` or `/case-stories/*`.

---

## Motion System — "The Conserved Current" (shipped 2026-06-27)

A cohesive motion-language overhaul. Core idea: the whole interface is ONE luminous
substance — particle field, content, cursor, bloom, tint are the same matter at
different scales. Every motion routes through one of three shared singletons so it
feels like one machine, not a pile of effects.

**The three singletons (reach for these before writing bespoke motion):**

| Singleton | File | Use for |
|---|---|---|
| Physics tokens | `lib/motion.ts` | `damp(cur,target,k,dt)` (frame-rate-independent — NEVER write a bare `*constant` lerp in a useFrame again); `EASE_SETTLE` / `EASE_DEPART` (the only two discrete-motion curves); spring tokens `FOLLOW`/`SNAP`/`DRIFT` (+ `*_SPRING` bare-config variants for `useSpring`); cascade variants `childRise`/`childRiseHeavy`/`childSlide` + `cascadeContainer`; `STAGGER`/`DELAY_CHILDREN` |
| Pointer bus | `lib/pointer-state.ts` (raw singleton for R3F) + `contexts/pointer-context.tsx` (`PointerProvider`, `usePointer`, `<PointerParallax strength>`) | ONE pointer signal drives field uMouse + wisps + DOM parallax at depth-correct ratios. Don't add per-component mousemove listeners — read the bus |
| Accent crossfade | per-chapter `ACCENT_COLORS` (page.tsx) etc. | cursor, particles, bloom, burst, gradient, telemetry all derive from active chapter index |

**What changed:**
- `lib/motion.ts`, `lib/pointer-state.ts`, `contexts/pointer-context.tsx` created.
- `persistent-scene.tsx` + `foreground-particles.tsx`: every useFrame lerp now `damp()`-based (fps-independent); both read the pointer bus (removed duplicate listeners; foreground's old `state.mouse` parallax was dead — canvas is pointer-events:none).
- All 7 section components: entrance animations converted from hardcoded `initial/animate` delays to shared `childRise`/`childRiseHeavy`/`childSlide` variants + `custom={readingOrderIndex}`. One central cascade beat. `SectionWrapper` block-fade removed (was competing).
- `app/page.tsx`: `<MotionConfig reducedMotion="user">` wraps everything (global reduced-motion); `PointerProvider` wraps content; columns wrapped in `<PointerParallax>` (middle 5px, rails 2px); LuminousBurst + GradientOverlay timing locked to the field window (`BURST_MS`, `EASE_SETTLE`).
- `cursor-effect.tsx`: ring/dot on `FOLLOW`/`SNAP` springs, ring morph off CSS-ease onto one spring, trail culls by elapsed time not frame count.
- `magnetic.tsx` → `DRIFT_SPRING`; `chapter-rail.tsx` → `RailItem` with per-item `DRIFT` spring tilt (killed the bouncy overshoot bezier).
- NEW `components/formation-telemetry.tsx`: diegetic HUD over the exposed field during the 2.6s watch window (corner brackets + `binding 0.00→1.00` readout in destination accent + scanline). The kept watch window is now an authored "OS compiling" beat.

**All shipped (2026-06-28):** DecodeText headline scramble-resolve on every chapter headline (`components/decode-text.tsx`); content gathers-into/emerges-from the burst at the seams (B9 — `childRiseHeavy` start-scale + exit scale 0.9); pointer-reactive field (`persistent-scene.tsx` uPointerVel/uClickPulse/uClickOrigin + `railHover` camera lean — all idle-safe, gated at zero when at rest).

## Responsive overhaul (shipped 2026-06-28)

The shell is now **flexbox-driven** (`app/page.tsx`): content div is `h-[100svh] flex flex-col`, `<main>` is `flex-1 min-h-0 flex flex-col lg:grid`, `<Footer/>` is in-flow (was `absolute bottom-0`). Heights resolve automatically at any viewport — no magic-number `calc` heights. `PageFlipContainer` root is `h-full`, the middle column `PointerParallax` carries `flex-1 min-h-0` so it fills on mobile (flex-col) and stretches in the lg grid.
- **Clipped-headline fix:** `WindowShell` resets its scroll container to `scrollTop=0` on mount; removed `OpeningHero`'s `scrollIntoView` (it left a ~110px offset that cut "Designing" off the top on mobile).
- Footer compacted on mobile (194px→~120px); hero top padding `pt-20`→`pt-4 sm:pt-10 md:pt-24`.
- Verified zero horizontal overflow at 375 / 768 / 1024 / 1440; 3-col grid engages at `lg` (1024) and fits exactly.

## Case-story pages joined the system (shipped 2026-06-28)

All 4 pages under `app/case-stories/hirello-ai/` (snapshot, full, interview, networking): light-theme remnants (`#F0EDE8`, `bg-slate-50`, `border-slate-200/300`, dark `text-slate-600..900`) mapped to dark (`bg-white/[0.08]`, `bg-slate-900/50`, `border-white/10`, `text-slate-200/400`); major blocks wrapped in the shared `childRise`/`childRiseHeavy` cascade; H1s use `DecodeText`; `CursorEffect` + `FilmGrain` rendered inside the providers for ambient continuity (no 3D Canvas — keeps these content pages fast). Full-scroll responsiveness preserved.

---

## Architecture Decisions (the "why" behind choices)

- **Formation-watch window (2.6s):** Intentional — gives users time to watch the 3D particle formation morph between shapes. The content is deliberately hidden during this window (`isWatching=true`).
- **7 chapters as pages, not scroll sections:** The site uses `AnimatePresence` with page-flip variants. Content is swapped, not scrolled. Scroll exists within a chapter's content pane only.
- **Dual view mode (Recruiter/Designer):** `ViewModeContext` controls which content variant renders. Recruiter = bullets + quick stats. Designer = full narrative. Toggle is in Navbar.
- **`formationWatchRef`:** A plain ref (not state) used to signal the 3D scene to switch into "showcase rotation" mode during chapter transitions. Avoids re-renders.
- **Notes as markdown:** `/content/notes/*.md` parsed at build time via `lib/notes.ts`. Metadata lives separately in `lib/notes-data.ts` for easy iteration without re-parsing.

---

## File Editing Guide (where to go for what)

| Want to change... | Edit this file |
|---|---|
| Chapter content (text, layout) | `components/{section-name}.tsx` |
| Chapter list / labels / order | `lib/chapters-config.ts` |
| Notes articles | `content/notes/{slug}.md` |
| Notes metadata (title, date, tag) | `lib/notes-data.ts` |
| Note card UI | `components/notes-section.tsx` |
| Note article page | `app/notes/[slug]/page.tsx` |
| Case study modal content | `components/work-section.tsx` → `projects` array |
| Case study pages | `app/case-stories/hirello-ai/` |
| 3D particle system | `components/persistent-scene.tsx` + `components/three-scene.tsx` |
| Chapter transitions (animation) | `app/page.tsx` → `pageFlipVariants` |
| Global styles / typography | `app/globals.css` |
| Navbar / view mode toggle | `components/navbar.tsx` |
| System log events | Call `addLog()` from `useSystemLog()` hook |
| Project modal | `components/project-modal.tsx` |
| SVG infographics | `public/images/notes/{name}.svg` |
