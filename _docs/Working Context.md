# Working Context
> **Read this at the start of every session.** It's the single source of truth for current project state.
> Update it whenever something significant changes.

---

## Current Status
**Last updated:** 2026-09-29
**Dev server:** `npm run dev` → localhost:3000
**Build status:** ⏳ Visual verification pending (sandbox npm install timed out — run `npm run dev` locally to confirm)

**Current design system (2026-09-29): "Pigment on Charcoal" — see the section of that name below.** It supersedes the warm-amber iter-2 palette notes and the font/colour details of the Editorial Design System further down (the utility class NAMES still exist; their styling changed).

**Superseded experiment (2026-04-20, iter 2):** full warm-amber shift. Base went fully black/graphite AND brand accent (`--primary`) moved from electric blue `#4a7bf7` → warm amber `#f59e0b`. The first iteration (neutral dark base only) looked "basically the same" per user feedback because the blue `--primary` and cyan/blue `text-gradient` still dominated the hero headline + CTAs + eyebrow labels. Iter 2 rebuilds the accent chrome around amber + coral + lavender. Cyan is preserved only in contextual places (system-log, chapter-0 particle accents, 3D scene). Revertible — see _docs/Sessions/Session Log.md entry dated 2026-04-20 (iter 2).

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
- [x] 4 cases from `lib/cases.ts` — Hirello Networking Hub (featured), Hirello Platform & Agents, 1 Second Everyday, AI Policy by Design (modal only). Reddit + Job Dashboard removed 2026-10-04.
- [x] `ProjectModal` — the card's "trailer"; its "Read the full case study" CTA comes from the case's `href`
- [x] Deep pages: `/case-stories/hirello-networking`, `/hirello-platform`, `/1-second-everyday` (old `/case-stories/hirello-ai/**` 308-redirect, see next.config.mjs)

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

- [ ] User review of the 2026-09-29 Pigment-on-Charcoal pass (colour intensity, DevTown removal, Hirello copy)
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

## Accessibility + recruiter-readiness overhaul (shipped 2026-06-28)

WCAG-level pass across the whole site. The important mechanics:

- **Keyboard access everywhere**: cinematic intro overlay is a focusable role=button (Enter begins, Escape skips — it autofocuses); work cards are role=button with Enter/Space; project modal has role=dialog + aria-modal + focus trap + focus restore + labeled ≥24px close; WindowShell scroll region is `tabIndex=0 role=region` (Tab in → arrows scroll natively). Global `:focus-visible` amber outline in globals.css (system cursor is hidden by CursorEffect, so this is the only indicator).
- **Arrow-key guard** (`app/page.tsx` handleKeyDown): chapter flipping only when no modifiers, no open modal, and activeElement is body or inside `[data-chapter-nav]` — otherwise arrows do their native thing.
- **Reduced motion** (`lib/use-reduced-motion.ts`, the ONE source of truth; `?reducedMotion` URL param forces it for testing): auto-skips the intro, ~200ms chapter crossfades (no watch window/burst/flashes), calm near-static particle field, CursorEffect disabled (system cursor stays), global CSS animation kill in globals.css.
- **Gate logic** (`app/page.tsx` Home): intro plays once per session (`sessionStorage plx.introSeen`); skipped for `?skipIntro` (localStorage), chapter deep-links, and reduced motion; `?showIntro` clears flags and replays.
- **Hash deep links**: `/#chapter-4` etc. resolve BEFORE first content mount (PageFlipContainer `hydrated` gate + mount-time sync of both indices — nothing to interrupt). In-page hashchange uses `skipTransitionRef` (lib/formation-state) through the quick unmount-gap flow. URL hash syncs on chapter change (replaceState).
- **AnimatePresence NOTE**: the chapter slot deliberately uses DEFAULT mode, not mode="wait" — "wait" wedges permanently if an exit interrupts a just-started enter (blank chapter). Sequencing comes from the isWatching gap; don't reintroduce mode="wait" here.
- **SR semantics**: single sr-only h1 in page.tsx (hero headline demoted to h2); aria-live polite region announces chapter changes; aria-pressed/expanded/current on toggles/menu/pills/steps/dots; decorative layers + separators aria-hidden; DecodeText renders sr-only real text + aria-hidden scramble.
- **Metadata**: root layout has metadataBase (NEXT_PUBLIC_SITE_URL → on any Vercel build the public domain https://vishal-deshmukh.vercel.app → localhost; never VERCEL_URL, whose per-deploy hosts sit behind Vercel login and break LinkedIn previews), OG + twitter cards, title template; `app/opengraph-image.tsx` renders the share card via next/og; case pages get titles via per-segment layout.tsx files (pages are client components — and the hirello-ai layout must keep its nested title TEMPLATE or grandchildren lose the suffix).
- **Hygiene**: `ignoreBuildErrors` REMOVED (tsc must stay clean — it is); ESLint 9 + eslint-config-next flat config (`eslint.config.mjs`; native flat exports, no FlatCompat; vault/scaffold dirs ignored; React-Compiler-era rules demoted to warn); postprocessing deps removed; three-scene dpr capped [1,1.5]; hidden canvases pause via `frameloop` gated on an `active` prop.
- Global styled 404 (`app/not-found.tsx`); broken `#work` back-link fixed to `/#chapter-4`.

## Case-story pages joined the system (shipped 2026-06-28) — superseded 2026-10-04, see "Case studies v2"

All 4 pages under `app/case-stories/hirello-ai/` (snapshot, full, interview, networking): light-theme remnants (`#F0EDE8`, `bg-slate-50`, `border-slate-200/300`, dark `text-slate-600..900`) mapped to dark (`bg-white/[0.08]`, `bg-slate-900/50`, `border-white/10`, `text-slate-200/400`); major blocks wrapped in the shared `childRise`/`childRiseHeavy` cascade; H1s use `DecodeText`; `CursorEffect` + `FilmGrain` rendered inside the providers for ambient continuity (no 3D Canvas — keeps these content pages fast). Full-scroll responsiveness preserved.

---

## "Pigment on Charcoal" — Taste pass + résumé update (shipped 2026-09-29)

Brief: update the portfolio to the Sep 2026 résumé (new role: **Product Designer, Design Systems @ TasteMakers by Taste Labs**) and lift the aesthetic toward tastelabs.com / tastemakers.tastelabs.com — restraint, grotesk + mono labels, hairlines, two-tone grey→bone headlines, round arrow chips. **User feedback mid-pass: "don't just go black and white — keep good colour that suits the aesthetic."** So: calm charcoal/bone base + ONE living colour per chapter.

**Single sources of truth (edit these, not section copy):**
| File | Owns |
|---|---|
| `lib/profile.ts` | Résumé as data — PROFILE (email/links/summary), EXPERIENCE (TasteMakers → Hirello → UMBC HCC → Wipro), EDUCATION, SKILLS, CURRENT_ROLE. Hero, Origin ledger, Now panel, navbar, boot screen, contact all read it. |
| `lib/chapter-palette.ts` | Per-chapter pigments (dusk→dawn arc: amber, terracotta, rose, lavender, periwinkle, sage, champagne), scene bg tints, FORMATION_IDS, `accentHex/accentRgb`, SPECTRUM_GRADIENT. Particles, cursor, burst, rail, telemetry AND the UI pigment all derive from it (was copy-pasted in 6 files). |
| `components/primitives.tsx` | ArrowChip, ActionLink (mono label + round chip), InBrief (recruiter summary), WordCycle (rolling word slot — all words stay mounted, no AnimatePresence churn). |
| `components/chapter-tint.tsx` | Sets `--chapter` on <html>. Home follows activeChapterIndex (`<ChapterAccent/>` in page.tsx); case stories pin Work (4); notes pin Notes (5). |

**Tokens (globals.css):** ink scale `--ink-0..3` (#0f0f0e…), bone scale `--bone..bone-4` (bone-4 is decorative only, 3:1), hairlines `--hair/-2/-3`, `--signal` (fixed amber, "live" dots only), and `--chapter` — registered with `@property` so it CROSSFADES (1.4s settle) in step with the particle blend. Tailwind colours: `bone*`, `ink*`, `hair*`, `signal`, `chapter` (e.g. `text-chapter`, `bg-chapter/20`).
**Type:** Geist (display + text, weight 500, tight tracking) + Azeret Mono (labels/buttons, sentence case). Syne / DM Sans / JetBrains / Press Start 2P removed; `font-pixel` aliases to mono. Display sizes use **container units (cqi)**.
**Headline recipe:** `<span className="ink-dim">setup</span> <DecodeText text="payoff" className="ink-accent" />` — grey setup, payoff in the chapter pigment easing into bone.
**Primitive classes:** `.surface` / `.surface-interactive` (hairline glass card, pigment glow on hover), `.btn-solid` / `.btn-ghost` (+`.btn-sm`), `.arrow-chip` (fills with pigment on `.group` hover), `.live-dot`, `.label-mono`, `.keycap`, `.eyebrow` (pigment square bullet).

**Layout:** WindowShell's scroll region is a `@container`; chapter grids use `@xl/@2xl/@3xl/@4xl` variants, NOT viewport `md/lg` — the window's width depends on the rails. Page grid: rail + content at lg, plus the right Now panel at xl (`[184px_1fr_300px]`, 2xl `[200px_1fr_340px]`). WindowShell in chapter mode shows `04 / 06`, prev/next chips and a pigment progress hairline.

**Shell:** navbar = wordmark (PIXELOGIC + pigment OS), Now line (only where the Now panel isn't: lg on home, xl elsewhere; the hero has its own Now card below lg), segmented mode toggle, Résumé. Status strip + UTC clock removed. Footer = one hairline row + ←→ hint + spectrum hairline. Right rail = `NowPanel` (current role + previous roles) above a slim `SystemLogConsole` showing the LIVE log tail (boot lines are initial state in system-log-context; ids from a ref counter). DecodeText now always settles via a timeout even if rAF is throttled.

**Content:** Hirello card rewritten to match the résumé AND its own case pages (AI Career Operating System; +18% completion, −30% drop-off, +14% adoption; real `/hirello-pipeline.png`). Old "AI recruiting / −40% screening time" copy removed. New case card: **AI Policy by Design — UMBC HCC Research** (`/images/ai-policy-by-design.svg`), strictly from résumé bullets. Origin timeline → expandable résumé ledger (Experience + Education). **DevTown (2023) was dropped** to match the résumé — restore in lib/profile.ts if wanted. Capabilities gained a Design Systems column; each Method step cites résumé evidence. Boot screen, OG image, 404s and note pages restyled.

**Revert:** `git stash list` → "pre-taste-refresh snapshot 2026-09-29" holds the prior tracked working tree (`git stash apply` onto a clean tree).

---

## Storyboard pass + cover series (shipped 2026-09-29, same day)

User feedback: "a lot of text — it should feel like moving through a storyboard" + "the preview pictures on case studies and notes look weird" (they were the old navy/cyan SVGs).

**Storyboard vocabulary** (`components/storyboard.tsx`): chapters are **Scenes** (eyebrows read "Scene 04 · Work"). Ideas are told in **Panels** = `Frame` (dotted paper, pigment pool, viewfinder `CropMarks`, "SH 01" shot label) + a one-line caption (+ optional mono `tags` instead of bullet lists). Drawings are `<Sketch name=…/>` (12: logic, deliver, network, components, screens, tokens, abtest, signal, listen, map, prototype, ship) and `<FormationGlyph index/>` (the 7 particle shapes). Everything is drawn in DOTTED strokes (0-length dash + round caps) so it reads as particle matter; `.sb-dots` march on `.group:hover` (globals.css).
- Prologue: body copy cut to one lede; right column = **contact sheet** of the 6 scenes ahead (glyph frames in each scene's pigment; hover leans the 3D camera via railHover, click plays the transition).
- Origin: 4 panels (Engineering → Wipro → UMBC → design systems for AI) + one statement line + compact résumé ledger; the long story is behind "Read the long version".
- Shift: 4 panels with tags + one-line Toolkit. Method: 4-panel sequence with arrows, each caption is résumé evidence; tabs/detail panel removed.
- Epilogue: one lede + email bar + a 7-frame **credits** strip to replay any scene.
- Rail = **filmstrip**: mini glyph frames on a spine that fills in the chapter pigment (frames stay opaque; only the glyph dims — otherwise the spine shows through).

**Cover series** (`components/covers.tsx`, data for notes in `lib/note-covers.ts` — plain module so server pages can read it): `CaseCover({file})` keyed by project `file` — Hirello = real screenshot in a tilted browser frame + floating metric chip (periwinkle); AI Policy (lavender), Reddit (terracotta), Dashboard (sage) = composed SVG scenes. `NoteCover({slug, number, tag})` = typographic posters (Reveal. / Systems. / Story. / Measure. / Wait.) + a motif, each in its own pigment; note article pages use the same cover and `ChapterTint` to the note's pigment. The case modal opens on the same cover. Old `public/images/*-mockup.svg` and `notes/thumb-*.svg` are no longer referenced by cards (in-article infographics still are).

---

## Clarity: the interlude game (built 2026-10-01)

A small art game that is the portfolio's thesis as a mechanic: the screen is noise; the pointer is a storyboard viewfinder lens; sweeping it along a formation's faint outline pulls particles home until they BIND (glow in the scene's pigment, pluck a rising note). Bind 90% to clear a formation; noise storms (from formation 3) telegraph, then unbind ~30% of what their front crosses. Seven formations = the seven scenes, each in its pigment; finale card "Storyboard bound." Hold = focus (pull speed ×1.85) and is the intended skill.

| File | Owns |
|---|---|
| `lib/interlude.ts` | open/close store + iris origin (external store, no provider) |
| `lib/formations.ts` | the 7 formations as polylines + even arc-length sampler (`formationPoints`) |
| `components/interlude/clarity-engine.ts` | framework-free canvas engine: flow-field noise, lens claim (particles keep homing ~1.1s after the lens passes), capped streaming speed (`HOME_SPEED`), binding, storms, additive sprite rendering, trails, shockwave. Tunables at top + `levelConfig` |
| `components/interlude/clarity-game.tsx` | overlay: iris clip-path wipe from the launching button, HUD (pips, timer, best, binding meter), intro / scene-title / bound / complete cards; best times in localStorage `plx.clarity.best` |
| `components/interlude/play-button.tsx` | navbar + Epilogue launcher (morphing mini glyph) |

Mounted globally in `app/layout.tsx`. While open, page.tsx pauses both R3F canvases, hides CursorEffect, and the arrow-key chapter flip yields. Sound cues in `lib/sound.ts`: `bind`, `storm`, `formed`.

Balance was tuned with a headless sim (perfect tracer at 650 px/s, 1440×900): no-hold ≈ 7 / 9 / 31 / 6 / 13 / 31-49 / 22-31 s per formation; with hold every formation clears (Wave ≈ 22-28 s). Dev builds expose `window.__clarity` to step the engine manually (rAF doesn't run in hidden tabs).

---

## Briefing (first-visit tutorial) + AAA sound pass (2026-10-01)

**Briefing** (`components/briefing.tsx`, store `lib/tour.ts`): AAA-style onboarding. After the boot gates, a "System briefing." title flash, then a scrim with a spotlight cut-out springs between real UI marked `data-tour`: `rail`/`dots` → `window` (chapter title bar) → `modes`/`menu` → `now` → `extras` (Play + sound). Pigment crop marks + one scan pass frame each target; a leader line draws to an auto-placed callout (right/left/below/above). Steps whose target isn't visible at the current size are dropped (desktop 5, phone 3). Esc skips, ←/→/Enter step; page.tsx yields arrows while open. Auto-plays once (`plx.tour.seen`), skipped on deep links; `?tour` forces it; footer "Replay briefing" (home only).

**Sound** (`lib/sound.ts`) rebuilt from melodic plucks to a cinematic palette: muted ticks (hover), weighted thocks (press), saturated sub impacts, stereo-travelling noise whooshes, dark detuned-saw pads (root/5th/9th, no third), FM glass shimmer, darker 3.2s room, bus compression. Roots dropped an octave (D2 to F#3). Same public API plus `tourOpen/tourStep/tourClose`. Dev builds expose `window.__sfx` to audition cues.

---

## Case studies v2 (2026-10-04)

Three deep, recruiter-first case studies replaced the old Hirello pages and two thin concept cards.

- **Data:** `lib/cases.ts` (`CASES`, `CaseMeta`, `caseBySlug`, `DEEP_CASES`, `CASE_NAMES`) feeds the Work cards, the modal, the deep pages and the /stats labels. `file` is the stable key (covers, `case_open:<file>`, `case_full:<file>`); never rename a shipped one.
- **Kit:** `components/case/blocks.tsx` (server: CaseShell, CaseHero, ThirtySecondRead, Scene, Stage, ScreenFrame, PhoneFrame, Decisions, Findings, ProcessStrip, Columns, ContractDiagram, StatesGrid, KeyTable, Insight, DesignSystemBoard, Credits) + `components/case/kit.tsx` (client: Reveal, ScaleToFit, SceneIndex, BeforeAfter, ChatDemo). A case = numbered Scenes: headline, ≤2-line caption, one big visual, "Decision → Why" cards.
- **Mockups:** coded re-drawings at product size, scaled by `ScaleToFit` — `components/case/hirello/{ui,networking,platform}.tsx` (Hirello tokens: #3B5BFF, gradient #3B5BFF→#7C5CFF, Fraunces + Inter) and `components/case/onese/{ui,screens}.tsx` (1SE: teal #0C8A93, yellow #FFBA00, Figtree stand-in). Fictional people/data only; 1SE photos replaced by abstract `MOMENTS` gradients (real screenshots had real people).
- **Real screenshots:** drop PNGs at `public/case/<slug>/<name>.png` and `<ShotOr>` (`components/case/shot.tsx`, fs check at build) swaps them in for the mockup. Slots: hirello-networking/{hub,import,organize,build-outreach,sequence-editor,replies,pipeline}, hirello-platform/{dashboard,toolbox,agent-tasks}, 1se/{day-today,day-after}.
- **Fonts:** Fraunces / Inter / Figtree are declared in the root layout with `preload:false` — files load only where a mockup renders them.
- **Honesty rules (keep them):** teammates credited by role, not name; only Vishal's own work is claimed (Platform case shows teammates' pieces in a labelled "team context" strip); no invented metrics (Networking has none yet; onboarding numbers are résumé-backed).
- **Sources:** facts came from the Hirello stage-server repos (read-only — never modify Hirello code) and the 1SE Figma PDF in `D:/UMBC/1se assgn/`.

- **Jump to a section:** header `SceneJump` (kit.tsx) names the current scene ("04 / 10 Toolbox") and opens a list of every scene at any width; `Contents` (blocks.tsx) lists all scenes as numbered links under the 30-second read; the 2xl rail stays. All three share `useActiveScene` (a scene is current once its top passes 35% of the viewport). Plain `#id` anchors, smooth-scrolled via `html:has([data-case-page])` in globals.css (instant under reduced motion).

## SEO (shipped 2026-10-05)

- `lib/seo.ts` is the single source: `SITE_URL`, `METADATA_BASE` (public domain on any Vercel build), `caseMetadata()` (title, ~150-char `summary` from lib/cases, canonical, OG/Twitter), JSON-LD builders (`siteGraph` = WebSite + Person in the root layout; `caseGraph` = Article + BreadcrumbList in CaseShell; `noteGraph` = BlogPosting + BreadcrumbList on note pages).
- `app/sitemap.ts` (home, 3 cases, 5 notes) and `app/robots.ts` (disallow /stats, /api/).
- Share images: `lib/og-card.tsx` renders 1200×630 PNG cards; each case route and `notes/[slug]` has an `opengraph-image.tsx` (the old SVG note thumbnails can't be shown by LinkedIn/X).
- Canonical: root sets "/", every route overrides with its own.
- Home: one h1 (the boot-screen name is a `<p>`), plus an sr-only "Case studies and notes" link index in app/page.tsx so crawlers and screen readers reach the deep pages (the chapters are hash states, not routes).
- To do on the user's side: add the domain in Google Search Console and submit `/sitemap.xml`.

## Visitor stats (shipped 2026-10-01)

Upstash Redis via REST (`lib/stats-server.ts`), `/api/stats` (visit + event counters, bot filter, event-name regex), private dashboard `/stats?key=<STATS_KEY>` (404 without it), footer "● N visitors" + log line. Disabled cleanly when env vars are missing. Clicks tracked through `data-track` attributes (delegated listener in `components/stats.tsx`).

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
