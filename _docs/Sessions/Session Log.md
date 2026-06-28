# Session Log

Running log of every session — what changed, what was decided, what to watch out for.

---

## 2026-04-20 — Warm-Amber Palette Shift (Iter 2)

**User course-correction:** "well it basically looks the same — what I meant is can turn whole aesthetics and color palette into dark like black and grey instead of that navy blue in background, and then adjust other colors accordingly that will suit the website."

**Root cause of "looks the same":** Iter 1 only moved the surface colors (bg, cards, popover). The headline still read as *blue* because:
1. `--primary` was still electric blue (`#4a7bf7`) — this drove the hero CTA, eyebrow labels, chapter-rail active dot, filter pills, nav status indicator, project bullets.
2. `.text-gradient` was `cyan → blue → lavender` — this drove the italicized phrase in every chapter headline ("not a résumé gallery", "from in-between work", etc.).
3. Dozens of hardcoded `rgba(74, 123, 247, …)` values across section components re-introduced blue tints on hover, Spotlight washes, shimmer lines, drop shadows.

**What changed in iter 2:**

Brand accent swapped in `globals.css`:
- `--primary` / `--ring` / `--sidebar-primary` / `--sidebar-ring`: `#4a7bf7` → `#f59e0b` (warm amber)
- `--primary-foreground` / `--sidebar-primary-foreground`: `#ffffff` → `#0a0a0c` (pure near-black so amber text is legible on amber fills)
- `--muted-foreground` shifted to neutral grey `#9ca0a8` (was blue-tinted slate-400)
- Base `--background` pushed darker from `#0a0a0c` → `#08080a` (real graphite instead of mostly-black-with-a-hint)
- `--card` bumped slightly to `rgba(20, 20, 23, 0.72)` for the darker bg contrast

Gradient utilities rebuilt:
- `.text-gradient` : cyan/blue/lavender → amber (`#f59e0b`) → coral (`#f97362`) → lavender (`#a78bfa`)
- `.text-gradient-warm` : cream (`#fcd34d`) → coral → lavender
- `.text-shimmer` : amber/coral/cream/coral/lavender loop (was blue/cyan/lavender)
- `.drop-cap::first-letter` gradient : amber → lavender
- `.section-separator` stripe : amber → lavender
- `.shimmer-line` color : amber
- `@keyframes glow-pulse` : box-shadow color amber (drives `.breathing` animation)

Contextual amber accents:
- `.rule-tick::before` dot : cyan → amber
- `.pull-quote` border-left : cyan → amber
- `.card-glow-hover:hover` : amber border + shadow
- `.glass-card:hover` ring + `.glass-card-glow::before` : amber/lavender
- `.note-prose blockquote` border, `.note-prose code` color, `.note-prose a` : amber
- `.note-prose > p:first-of-type::first-letter` : amber → lavender
- Body dot-pattern bg-image : cyan `rgba(34,211,238,0.04)` → amber `rgba(245,158,11,0.04)` (both light and `.dark body`)

Component hardcoded-blue sweep (`rgba(74, 123, 247, …)` and `rgba(74,123,247,…)`) → `rgba(245, 158, 11, …)`:
- `hero-section.tsx`
- `about-section.tsx` (timeline line-height gradient, hover border, card shadow)
- `chapter-rail.tsx` (active marker shadow, drop-shadow, pulse animation)
- `contact-section.tsx` (interest pill border, avatar border, Remote work-pref tile, recruiter eyebrow)
- `capabilities-section.tsx` (recruiter eyebrow, fallback accent, hero arrow gradient `#4a7bf7 → #22d3ee` → `#f59e0b → #a78bfa`)
- `notes-section.tsx` (filter pill active bg/border/shadow/text, recruiter eyebrow)
- `process-section.tsx` (pipeline progress gradient, node pulse ring, drop-shadow filters, mobile step marker, recruiter eyebrow)
- `work-section.tsx` (featured card hover border/shadow/shimmer line/overlay, grid card variants, recruiter eyebrow, plus both `<Spotlight color="74, 123, 247">` → `color="245, 158, 11"`)
- `navbar.tsx` (`bg-[#4A7BF7]` → `bg-[#F59E0B]`, status-dot shadow, mobile resume button hover from `#3B6CE8` → `#D97706`, VIEW.MODE text color `#4A7BF7` → `#FBBF24`)
- `project-modal.tsx` (approach bullets, focus-ring color)
- `lib/notes-data.ts` (first note `accentColor`)

**What was explicitly NOT touched (preserved blue/cyan by design):**
- System-log-console terminal aesthetic (cyan-on-black is the retro-terminal vibe)
- Chapter-rail `CHAPTER_ACCENTS` array — each chapter retains its color identity (cyan, teal, violet, lavender, sky, ice blue, cream)
- Chapter-0 (Prologue) particle/3D scene rainbow
- `opening-hero.tsx` boot-screen cyan accent pulse
- Emerald "OPERATIONAL" status dot (green = available)
- All typography, spacing, motion primitives

**Revert procedure:**
```
git checkout -- app/globals.css \
                components/hero-section.tsx \
                components/about-section.tsx \
                components/chapter-rail.tsx \
                components/contact-section.tsx \
                components/capabilities-section.tsx \
                components/notes-section.tsx \
                components/process-section.tsx \
                components/work-section.tsx \
                components/navbar.tsx \
                components/project-modal.tsx \
                lib/notes-data.ts
```

**Verification:** User to run `npm run dev` locally — sandbox still has `/mnt/v0/` symlink install issues so no headless verification was possible this session.

**Open question for next session:** if amber reads too "marketing-y" or too warm for the systems-thinking aesthetic, consider a cooler alternative: deep bronze (`#b45309`), brass (`#a16207`), or muted gold (`#ca8a04`). Or rotate to coral (`#f97362`) as primary with amber as highlight.

---

## 2026-04-20 — Neutral-Dark Palette Experiment

**User observation:** "our website aesthetics are kind of blue and other colors so can we switch it into black or grey as dark aesthetic so other colors would look good too."

**Hypothesis:** The chapter accents (cyan, lavender, coral, amber) fight the background because the base itself is blue-tinted (slate-950 / rgba(8,15,40,...)). Shifting the base to a neutral near-black lets the accent tokens carry more weight.

**What changed:**

CSS variables (`app/globals.css` — both `:root` and `.dark`):
- `--background`: `#020617` → `#0a0a0c`
- `--card`: `rgba(8, 15, 40, 0.65)` → `rgba(16, 16, 20, 0.7)`
- `--popover` / `--sidebar`: `#0f172a` → `#131316`
- `--secondary`: `rgba(15, 23, 42, 0.6)` → `rgba(24, 24, 28, 0.6)`
- `--muted`: `rgba(15, 23, 42, 0.5)` → `rgba(24, 24, 28, 0.55)`
- `--sidebar-accent`: same neutral shift
- Accent tokens (`--primary`, `--accent`, `--lavender`, `--ring`, all `--chart-*`) intentionally untouched

Tailwind utility override (new `@layer utilities` block in globals.css):
- Retargets `.bg-slate-950` + variants to `#0a0a0c` with alpha variants
- Retargets `.bg-slate-900` + variants to `#131316`
- Keeps `.text-slate-*`, `.border-slate-*`, gradient-stop utilities alone
- Covers chrome that uses Tailwind directly: `navbar.tsx`, `window-shell.tsx`, `project-modal.tsx`, `system-log-console.tsx`, hero mini-windows, etc.

Inline-style shifts across section components:
- `notes-section.tsx` — featured & grid card bg `rgba(8,15,40,0.65)` → `rgba(16,16,20,0.72)`; gradient fades; filter pill inactive bg
- `about-section.tsx` — timeline card bg
- `capabilities-section.tsx` — capability card bg + icon container bg
- `contact-section.tsx` — interest pill, profile card, status tiles, online-dot border

Hex literals shifted:
- `three-scene.tsx` — R3F canvas `<color attach="background">` from `#020617` to `#0a0a0c`
- `persistent-scene.tsx` — Prologue (idx 0) and Epilogue (idx 6) chapter BG from `#020617` to `#0a0a0c`; middle chapters kept their intentional atmospheric tints (teal, purple, magenta, etc.) so chapter transitions still breathe different colors
- `opening-hero.tsx` — boot-screen base gradient `from-slate-950 via-[#020617] to-slate-950` → all three stops `#0a0a0c`
- `app/notes/[slug]/page.tsx` + `not-found.tsx` — article page bg

globals.css additional tweaks:
- `.glass-card` + `.glass-card-glow` bg `rgba(2,6,23,0.55)` → `rgba(10,10,12,0.6)`
- `.breathing` animation box-shadow color switched from slate to pure black (no blue cast)
- `.note-prose code` bg shifted to neutral

**What was explicitly NOT touched:**
- Chapter accent colors — they're the "other colors" the user wanted to pop
- Typography, type scale, editorial primitives
- Film grain, spotlight, magnetic effects
- 3D particle colors
- `CHAPTER_BG` for chapters 1–5 (atmospheric tint per chapter)
- `text-gradient` / `text-gradient-warm` / `.text-shimmer` — these use the accent palette

**Revert procedure (if the user prefers the old look):**
1. `git checkout -- app/globals.css components/{notes,about,contact,capabilities}-section.tsx components/opening-hero.tsx components/three-scene.tsx components/persistent-scene.tsx app/notes/[slug]/page.tsx app/notes/[slug]/not-found.tsx`
2. That's it — every change in this session lives in those files.

**Open:** user needs to run `npm run dev` locally and judge — this is an experiment, not a committed direction.

---

## 2026-04-18 — Size Tune + Immersive Layers (iteration 2)

**What we did (follow-up to the editorial pass earlier today):**

After a first pass with editorial-scale type, sizes were overflowing the windowed chapter viewport (`h-[calc(100vh-160px)]` ≈ 640–840px usable on desktop).
Tuned scales down for the chapter frame and added a proper immersive layer.

**Size tune-down (globals.css):**
- `.display-xl` clamp max 5.25rem → 4.25rem
- `.display-lg` clamp max 3.75rem → 3.125rem
- `.display-md` clamp max 2.5rem → 2.125rem
- `.marquee-num` clamp max 11rem → 7.5rem, opacity nudged softer, `z-index: 0` so it stays behind content
- `.lede` clamp max 1.25rem → 1.125rem, max-width 40ch → 44ch
- `.rule-tick` margin 2.5rem → 1.5rem

**Hero spacing tightening (hero-section.tsx):**
- Left column `space-y-8` → `space-y-5`
- Right column `lg:pt-24` → `lg:pt-10`
- Grid gap `8/12` → `6/10`

**Work section (work-section.tsx):**
- Featured image `h-[220px] md:h-[320px]` → `h-[200px] md:h-[260px]`
- Secondary image `h-[200px]` → `h-[170px]`
- Outer `space-y-10` → `space-y-6`

**Notes section:** outer `space-y-10` → `space-y-6`

**New immersive primitives:**
- `components/film-grain.tsx` — subtle SVG-turbulence grain overlay at z-9990, ~5% opacity, `mix-blend-overlay`. Drift animation via `@keyframes film-grain-drift`. Respects `prefers-reduced-motion`. Wired at page root in `app/page.tsx`.
- `components/spotlight.tsx` — cursor-follow radial wash painted through the wrapper via `--mx/--my` CSS vars + `::before` pseudo. rAF-batched CSS var updates (zero React re-renders per mousemove). CSS in globals.css `.spotlight-root` rules.
- `components/magnetic.tsx` — framer-motion spring-tracked element drifts toward cursor when within activation range. Respects `prefers-reduced-motion`.

**Wired into:**
- Hero: Magnetic on both CTAs; Spotlight on both mini-windows (cyan + lavender)
- Work: Spotlight on featured card (size 420, primary blue) + every secondary card (size 320)
- Notes: Spotlight on FeaturedNote + every NoteCard (color derived from each note's accentColor via new `hexToRgb` helper)

**Files changed:**
- `app/globals.css` (type scale reductions + spotlight-root rules + film-grain-drift keyframe)
- `app/page.tsx` (FilmGrain import + render at page root)
- `components/hero-section.tsx` (spacing tightening + Magnetic CTAs + Spotlight mini-windows)
- `components/work-section.tsx` (image heights + Spotlight wrappers)
- `components/notes-section.tsx` (outer spacing + Spotlight wrappers + hexToRgb helper)
- `components/film-grain.tsx` (new)
- `components/spotlight.tsx` (new)
- `components/magnetic.tsx` (new)

**Known issues:**
- Still unable to visually verify in sandbox (Chrome MCP is disconnected; `npm install` in sandbox times out). Visual confirmation needs a local `npm run dev`.

---

## 2026-04-18 — Editorial / Cinematic Redesign Pass

**What we did:**
Full-site aesthetic overhaul. Direction: editorial / cinematic — Syne display type, generous whitespace, magazine rhythm, subtle motion (Basic Agency / Active Theory reference points).

- **New CSS token system** in `app/globals.css`:
  - `.display-xl` / `.display-lg` / `.display-md` — fluid clamp-scaled headline sizes with negative tracking
  - `.eyebrow` — mono uppercase label with a 1.75rem gradient rule prefix (via `::before`)
  - `.lede` — light-weight opening paragraph, 40ch max
  - `.pull-quote` — italic Syne block-quote with cyan left border
  - `.drop-cap` + `.note-prose > p:first-of-type::first-letter` — 4.5rem gradient drop cap
  - `.marquee-num` — large italic gradient chapter numerals (decorative, `aria-hidden`)
  - `.rule-tick` — 1px gradient divider with cyan dot
  - Removed the old `.note-prose blockquote` style (replaced with pull-quote treatment in `article` CSS)

- **Upgraded typography primitives** in `components/ui/typography.tsx`:
  - `H1` → font-display bold, clamp sizing, tracking -0.035em
  - `H2/H3` → Syne semibold, tighter tracking
  - `Lead` → light weight, 1.55 line-height
  - `Label` → tracking widened 0.18em → 0.28em
  - Propagates to all hirello-ai case story pages automatically

- **Full rewrites** — editorial header pattern (marquee numeral + eyebrow + display headline + lede):
  - `components/hero-section.tsx` — 7/5 grid, "00" numeral, `display-xl`, text-shimmer on "clarity", mono role pills with `rule-tick`
  - `components/work-section.tsx` — "04" numeral, featured project on 3/2 grid with cinematic 16:10 image + "01/02/03" overlay numerals
  - `components/notes-section.tsx` — "05" numeral, FeaturedNote component (2/3 grid), 16:9 note cards, active-tag in cyan
  - `app/notes/[slug]/page.tsx` — editorial article header (eyebrow + display H1 + lede excerpt), 21:10 cinematic hero image, mono meta row, drop cap auto-applied

- **Header pattern applied** to remaining sections (each keeps its chapter accent color in the gradient):
  - `components/about-section.tsx` — "01" numeral, lavender→indigo gradient on "systems"
  - `components/capabilities-section.tsx` — "02" numeral, cyan→blue gradient on the arrow + "experience"
  - `components/process-section.tsx` — "03" numeral, amber→orange gradient on "rhythm", pull-quote for the four-line process statement
  - `components/contact-section.tsx` — "06" numeral, warm gradient on "for next"

- **Cleanup:** Removed `ModuleBadge` imports from all 7 section files (replaced by chapter numeral + eyebrow). Removed `Badge` and `TypewriterText` imports from hero.

**Why:**
User asked to push design capability at max level. The previous look was good but chapter headers felt interchangeable. Editorial typography gives each chapter a distinct cinematic rhythm while the numerals create a magazine-like through-line across the whole site.

**Files changed:**
- `app/globals.css` (new utilities + drop cap rule + pull-quote)
- `components/ui/typography.tsx` (upgraded primitives)
- `components/hero-section.tsx` (full rewrite)
- `components/work-section.tsx` (full rewrite)
- `components/notes-section.tsx` (full rewrite)
- `app/notes/[slug]/page.tsx` (full rewrite)
- `components/about-section.tsx` (header pattern)
- `components/capabilities-section.tsx` (header pattern)
- `components/process-section.tsx` (header pattern + pull-quote)
- `components/contact-section.tsx` (header pattern)

**Known issues introduced:**
- Build verification blocked — sandbox `npm install` repeatedly timed out (/mnt/v0/ symlink issue + workspace process collision). Manual grep audit confirmed no orphaned imports. User needs to run `npm run dev` locally to visually verify.
- Case story pages (`/case-stories/hirello-ai/*`) only got primitive-level upgrades via `typography.tsx`; their layouts weren't redesigned — flagged as a next-pass candidate.

---

## 2026-04-17 — Typography System Overhaul

**What we did:**
- Added `Syne` (display/headings) + `DM Sans` (body) via `next/font/google`
- Kept `JetBrains Mono` and `Press Start 2P` unchanged
- Added CSS typography system: `h1/h2/h3` globally use Syne with negative letter-spacing
- Added `.text-gradient` utility (cyan → blue → lavender, matches chapter palette)
- Added `.text-gradient-warm` variant (blue → lavender → coral)
- Added `.text-shimmer` utility — animated light sweep on gradient text (used on hero headline)
- Added `font-display` utility class for explicit overrides
- Applied `text-shimmer` to the hero headline (TypewriterText)
- Applied `text-gradient + font-display` to all 6 section h2 headings
- Updated `note-prose` typography — Syne for h2/h3, improved line-height (1.8), slightly larger body (1.0625rem)
- Updated `tailwind.config.ts` fontFamily with CSS variable references

**Files changed:**
- `app/layout.tsx` — new font imports
- `app/globals.css` — typography system + text effect utilities
- `tailwind.config.ts` — fontFamily updated
- `components/hero-section.tsx` — text-shimmer on headline
- `components/work-section.tsx` — text-gradient on heading
- `components/about-section.tsx` — text-gradient on h2
- `components/capabilities-section.tsx` — text-gradient on h2
- `components/process-section.tsx` — text-gradient on h2
- `components/notes-section.tsx` — text-gradient on h2
- `components/contact-section.tsx` — text-gradient on h2

---

## 2026-04-08 — Obsidian Vault Setup

**What we did:**
- Created the `_docs/` Obsidian vault inside the project
- Documented the full project: architecture, routes, components, content, state, animation system
- Created `Working Context.md` as the "start here every session" file

**Why:**
- To reduce credit burn re-auditing the project from scratch every session
- Now: just read `Working Context.md` at session start → already know the state

**Dev server note:**
- node_modules in `/mnt/v0/` have symlink issues (pnpm can't be used in sandbox)
- Working fix: copy project to `/sessions/.../portfolio-dev/`, install there with `npm install --legacy-peer-deps`, run dev from there
- Source files still in `/mnt/v0/portfolio-website-design/` — edit those

---

## 2026-04-06 — Notes Rewrite + SVG Infographics

**What we did:**
- Rewrote all 5 notes articles to sound like a person thinking out loud (not an essay)
- Removed AI patterns: clean headers, quotable closings, perfect structure
- Added specific moments, doubt, body language details, unresolved thoughts
- Created 5 dark-themed SVG infographics embedded mid-content:
  - `progressive-disclosure.svg` (ai_ux_balance)
  - `two-lenses.svg` (is_to_ux)
  - `pipeline-story.svg` (storytelling)
  - `feedback-framing.svg` (feedback_loops)
  - `latency-design.svg` (designing_for_latency)
- Added `.note-prose img` styles to `globals.css`

**Files changed:**
- `app/globals.css` (added note-prose img styles)
- `content/notes/*.md` (all 5 rewrites)
- `public/images/notes/*.svg` (5 new SVGs)

---

## 2026-04-06 — Notes Section Built (same session, earlier)

**What we did:**
- Added `lib/notes-data.ts` — typed metadata for all 5 notes
- Added `lib/notes.ts` — markdown parsing with gray-matter + remark
- Created 5 notes articles in `content/notes/`
- Created `app/notes/[slug]/page.tsx` — dynamic route with static generation + OG metadata
- Created `app/notes/[slug]/not-found.tsx` — custom 404
- Wired `components/notes-section.tsx` cards to real `/notes/[slug]` routes
- Added `.note-prose` typography styles to `globals.css`
- Added gray-matter, remark, remark-html to package.json

**Files changed:**
- `lib/notes-data.ts` (new)
- `lib/notes.ts` (new)
- `app/notes/[slug]/page.tsx` (new)
- `app/notes/[slug]/not-found.tsx` (new)
- `content/notes/*.md` (5 new files)
- `components/notes-section.tsx` (updated routing)
- `app/globals.css` (typography styles)
- `package.json` + `pnpm-lock.yaml`

---

## Earlier Sessions (pre-log, reconstructed from git)

### UI components, Figma integration, case study pages, visual polish
- Built case story pages: `/case-stories/hirello-ai/` (snapshot + full + interview + networking)
- Added `WindowShell` component
- Figma integration work (`figma.config.json`, `.figma` component files)

### Performance + modal scroll fix
- Reduced lag in chapter transitions
- Fixed modal scroll clipping (moved `ProjectModal` outside perspective container)

### Fixed-height chapter window + content density
- Chapter content area has fixed height, inner scroll
- Density optimizations so content doesn't overflow

### Visual polish
- Draftly-inspired animations
- Chapter renaming
- Various UI fixes

### Update header, chapter bar, hero section
- Navbar updates
- ChapterRail refinements
- HeroSection content

### Initial commit
- Next.js project setup
- Core layout, 3D scene, basic sections

---

## Session Template (copy for new sessions)

```
## YYYY-MM-DD — [Session Title]

**What we did:**
- 

**Why:**
- 

**Files changed:**
- 

**Known issues introduced:**
- 
```
