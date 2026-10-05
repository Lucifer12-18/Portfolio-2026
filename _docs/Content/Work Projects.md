# Work Projects

4 cases shown in Chapter 4 (Work section). Data lives in `lib/cases.ts` (`CASES`) and is shared by the Work cards, the case modal, the deep case-study pages and the `/stats` labels.

---

## Cases

### 1. Hirello · Networking Hub — featured
- **file:** `hirello_networking.vue` · **page:** `/case-stories/hirello-networking` · pigment 4 (periwinkle)
- Prototype → Figma → Vishal's own Vue front end (16 screens, 14 shared components). Import, Organize, LeadGen, outreach + sequences, Hub, replies/pipeline/targets, the confirm-first agent, send caps, the Networking Hub design language.
- Visuals: coded mockups in `components/case/hirello/networking.tsx`; v1 evidence from `public/hirello-outreach-step-2.png`, `public/hirello-contacts.png`.

### 2. Hirello · Platform & Agents
- **file:** `hirello_platform.vue` · **page:** `/case-stories/hirello-platform` · pigment 3 (lavender)
- Dashboard row (network → pipeline), Toolbox mega-menu, agent tasks popup (front end + API), Interview Gym, onboarding A/B (+18% / −30% / +14%, résumé-backed), a labelled team-context strip, and the design-system token proposal.
- Visuals: `components/case/hirello/platform.tsx`; v1 evidence `public/hirello-pipeline.png`; Interview Gym screenshots `public/hirello-interview-*.png`, `hirello-what-went-wrong.png`.

### 3. 1 Second Everyday · One commit contract
- **file:** `1se_one_contract.fig` · **page:** `/case-stories/1-second-everyday` · pigment 0 (amber)
- Home task: Track A Day screen, Track B Mashing, Track C Rewind. Thesis: 4 / 6 / 3 entry points with inconsistent commits → one commit contract. Audits, flows, 29 states, metrics, design-system board.
- Visuals: `components/case/onese/screens.tsx` (photos replaced with abstract gradients). Source: the Figma export PDF in `D:/UMBC/1se assgn/`.

### 4. AI Policy by Design · UMBC HCC Research
- **file:** `ai_policy_by_design.fig` · modal only (no deep page) · cover drawn in `components/covers.tsx`.

---

## Shape

```ts
interface CaseMeta {
  slug: string
  file: string           // stable key: covers, case_open:<file>, case_full:<file>
  title: string          // "Name · Subtitle"
  hook: string
  tags: string[]
  role: string
  team: string
  timeline: string
  year: string
  platform: string
  status: string
  pigment: number        // chapter-palette index
  featured?: boolean     // only one
  metrics?: { value: string; label: string }[]
  tools: string[]
  problem: string        // modal
  approach: string[]     // modal
  outcome: string        // modal
  href?: string          // deep page → the modal's "Read the full case study"
}
```

> Retired: Reddit Redesign and AI Job Market Dashboard (removed 2026-10-04). Their stats labels live on in `CASE_NAMES`.
