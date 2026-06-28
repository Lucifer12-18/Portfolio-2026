# Section Components

The 7 chapter sections. Each wraps its content in `SectionWrapper`. All support `ViewModeContext` for dual Recruiter/Designer content.

**As of 2026-04-18, all 7 chapters use the unified editorial header pattern:**
1. Decorative `.marquee-num` chapter numeral (`aria-hidden`, absolute top-right)
2. `.eyebrow` mono uppercase label
3. `.display-xl` (hero) or `.display-lg` (chapters 1-6) headline with per-chapter gradient `<em>`
4. `.lede` opening paragraph

`ModuleBadge` is no longer used inside section bodies. See `Working Context.md → Editorial Design System` for the full utility list and recipe.

---

## OpeningHero (Boot Screen)
**File:** `components/opening-hero.tsx`
**Not a chapter** — renders before anything else. The boot splash / CRT startup screen. Must be dismissed (click or keyboard) before the main UI becomes interactive.

Props: `onDismiss: () => void`

---

## Chapter 0 — HeroSection (Prologue)
**File:** `components/hero-section.tsx`
**Module ID:** `MODULE_00_PROLOGUE`

The opening chapter. Introduces the designer/site concept. Contains the main headline and the "Pixelogic OS" identity statement.

---

## Chapter 1 — AboutSection (Origin)
**File:** `components/about-section.tsx`
**Module ID:** `MODULE_01_ORIGIN`

Personal background. Engineering → UX career narrative. Has Recruiter mode (quick bio bullets) and Designer mode (full story).

---

## Chapter 2 — CapabilitiesSection (Shift)
**File:** `components/capabilities-section.tsx`
**Module ID:** `MODULE_02_SHIFT`

Skills and capabilities. Shows the shift from systems/engineering thinking to UX. Recruiter mode = skill tags list. Designer mode = narrative about the shift.

---

## Chapter 3 — ProcessSection (Method)
**File:** `components/process-section.tsx`
**Module ID:** `MODULE_03_METHOD`

Design process / design rhythm. How the work gets done. Shows the repeatable approach to design problems.

---

## Chapter 4 — WorkSection (Work · Case Stories)
**File:** `components/work-section.tsx`
**Module ID:** `MODULE_04_WORK`

The portfolio work. Contains 3 projects (hardcoded in the `projects` array at the top of the file):

| Project | Type | Featured |
|---|---|---|
| Hirello.ai – AI-First Hiring Flow | Product Design, AI & UX | ✅ Featured (large card) |
| Reddit Redesign | Product Design, Concept | Grid |
| AI Job Market Dashboard | Data Visualization, Systems | Grid |

Clicking any card calls `openModal()` from `ModalContext` → renders `ProjectModal`.

**Recruiter mode:** Shows a "Quick Summary" box with 3 bullets above the cards.

---

## Chapter 5 — NotesSection (Notes)
**File:** `components/notes-section.tsx`

Cards for the 5 note articles. Each card links to `/notes/{slug}`. Card data comes from `lib/notes-data.ts` (the `NOTES` array).

Card layout uses `height` field from metadata: `"tall"` | `"medium"` | `"short"` — creates a masonry-like grid feel.

---

## Chapter 6 — ContactSection (Epilogue)
**File:** `components/contact-section.tsx`
**Module ID:** `MODULE_06_EPILOGUE`

Final chapter. Contact info, links, call to action. The "open channel" — email, LinkedIn, etc.

---

## ProjectModal
**File:** `components/project-modal.tsx`

Full-screen modal overlay for case study details. Receives project data from `ModalContext`.

**Displays:**
- Project image
- Tags + tools
- Problem statement
- Approach (bullet list)
- Outcome

**Links to** the full case story page (for Hirello.ai).

Rendered at page level in `app/page.tsx` as `<PageLevelModal />` — outside the perspective container to avoid `clip-path` clipping issues.
