# Notes Articles

5 personal articles written in a thinking-out-loud voice. Accessible at `/notes/{slug}`.

All metadata lives in `lib/notes-data.ts`. Markdown content in `content/notes/`.

---

## Articles

### 1. Designing with AI without overwhelming users
- **Slug:** `ai_ux_balance`
- **File:** `content/notes/ai_ux_balance.md`
- **Tag:** AI & Design
- **Date:** Nov 2024
- **Accent:** rgba(74, 123, 247, 0.6) — blue
- **Card height:** tall
- **SVG infographic:** `public/images/notes/progressive-disclosure.svg`
- **Excerpt:** In early testing of Hirello's interview feedback panel, users ignored the AI output entirely—not because it was wrong, but because it appeared all at once. Here's what progressive disclosure actually looks like in an AI product.

### 2. From engineering to UX: thinking in systems
- **Slug:** `is_to_ux`
- **File:** `content/notes/is_to_ux.md`
- **Tag:** Career
- **Date:** Oct 2024
- **Accent:** rgba(167, 139, 250, 0.6) — lavender
- **Card height:** short
- **SVG infographic:** `public/images/notes/two-lenses.svg`
- **Excerpt:** The honest version of my career pivot—it wasn't dissatisfaction with engineering. It was noticing that the systems I was building had invisible failure modes that only showed up when humans used them.

### 3. Why complex tools need simple stories
- **Slug:** `storytelling`
- **File:** `content/notes/storytelling.md`
- **Tag:** Process
- **Date:** Sep 2024
- **Accent:** rgba(249, 115, 98, 0.6) — coral
- **Card height:** medium
- **SVG infographic:** `public/images/notes/pipeline-story.svg`
- **Excerpt:** Hirello's networking pipeline had seven stages. Users completed onboarding but didn't return after day two. The system was logical. The story was missing.

### 4. Feedback should be measurable, not emotional
- **Slug:** `feedback_loops`
- **File:** `content/notes/feedback_loops.md`
- **Tag:** AI & Design
- **Date:** Dec 2024
- **Accent:** rgba(34, 211, 238, 0.6) — cyan
- **Card height:** medium
- **SVG infographic:** `public/images/notes/feedback-framing.svg`
- **Excerpt:** During user testing of the AI Interview Gym, when the AI said 'your answer felt weak,' users got defensive. When it said 'your answer had one concrete example out of four expected,' they took notes.

### 5. Designing for the seconds AI makes you wait
- **Slug:** `designing_for_latency`
- **File:** `content/notes/designing_for_latency.md`
- **Tag:** Systems
- **Date:** Jan 2025
- **Accent:** rgba(56, 189, 248, 0.6) — sky
- **Card height:** tall
- **SVG infographic:** `public/images/notes/latency-design.svg`
- **Excerpt:** AI features have unavoidable latency. A 3-second wait for resume analysis, 4 seconds for interview feedback. Users fill that void with anxiety or abandonment. The wait is a design surface.

---

## SVG Infographics Inventory

All in `public/images/notes/`:

| File | Used in article | Theme |
|---|---|---|
| `progressive-disclosure.svg` | ai_ux_balance | Dark, shows staged reveal pattern |
| `two-lenses.svg` | is_to_ux | Dark, engineering lens vs UX lens |
| `pipeline-story.svg` | storytelling | Dark, 7-stage pipeline visualization |
| `feedback-framing.svg` | feedback_loops | Dark, emotional vs measurable feedback |
| `latency-design.svg` | designing_for_latency | Dark, wait time as design surface |

There are also thumbnail SVGs referenced in the metadata (`thumb-ai-ux.svg`, `thumb-career.svg`, etc.) — these live at the same path and are used for the note cards on the main site.

---

## Adding a New Note

1. Add entry to `NOTES` array in `lib/notes-data.ts` with all metadata fields
2. Create `content/notes/{slug}.md` with markdown content
3. (Optional) Create SVG infographic in `public/images/notes/`
4. The dynamic route `/notes/[slug]` handles everything automatically — `generateStaticParams()` picks up the new slug

---

## Writing Style Guide (established voice)

The notes were deliberately rewritten to avoid AI patterns. Voice rules:
- Sound like a person thinking out loud, mid-process
- Use specific moments ("I was sitting in a call with a recruiter who...")
- Include doubt and unresolved thoughts
- Avoid clean section headers, quotable closings, perfect structure
- Use body language details when relevant
- Leave some things open-ended
