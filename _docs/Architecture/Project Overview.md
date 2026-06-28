# Project Overview

A portfolio website for a UX/Product designer with an engineering background. The design concept is a "Pixelogic OS" — a dark-themed, terminal/OS-aesthetic interface with a live 3D particle system, chapter-based navigation, and a dual-mode content system (Recruiter vs Designer).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.0.7 (App Router) |
| Bundler | Turbopack (via `next dev`) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| UI Components | Radix UI primitives |
| 3D | Three.js r183 via @react-three/fiber + @react-three/postprocessing |
| Animations | Framer Motion (latest) |
| Content parsing | gray-matter + remark + remark-html |
| Analytics | @vercel/analytics |
| Forms | react-hook-form + zod |
| Icons | lucide-react |

---

## Folder Structure

```
portfolio-website-design/
├── _docs/                    ← Obsidian vault (this folder)
├── app/                      ← Next.js App Router pages
│   ├── layout.tsx            ← Root layout (ThemeProvider, fonts)
│   ├── page.tsx              ← Home — the full portfolio experience
│   ├── globals.css           ← Global styles, .note-prose, animations
│   ├── case-stories/
│   │   └── hirello-ai/       ← 4 case story pages
│   └── notes/
│       └── [slug]/           ← Dynamic note article pages
├── components/               ← All React components
│   ├── ui/                   ← shadcn/ui primitives (don't edit these)
│   └── *.tsx                 ← Custom components (see Components docs)
├── content/
│   └── notes/                ← 5 markdown articles
├── contexts/                 ← React context providers
├── hooks/                    ← Custom hooks
├── lib/                      ← Data, config, utilities
│   ├── chapters-config.ts    ← CHAPTERS array — single source of truth for nav
│   ├── notes-data.ts         ← NOTES metadata array
│   ├── notes.ts              ← Markdown parsing functions
│   ├── formation-state.ts    ← Ref used to signal 3D scene during transitions
│   ├── tokens.json           ← Design tokens
│   └── utils.ts              ← cn() utility (clsx + tailwind-merge)
├── public/
│   └── images/
│       └── notes/            ← 5 SVG infographics + thumbnail SVGs
├── styles/                   ← Additional style files
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Design Concept

**"Pixelogic OS"** — the portfolio presents as if it's an operating system or developer environment:
- Dark background with a live 3D particle field
- Monospace labels, module IDs (MODULE_00_PROLOGUE, etc.), CRT cursor effects
- System log console (right rail) shows live events as the user navigates
- Terminal-style typewriter text effects
- Chapter transitions look like "energy returning to the field" and reassembling

**Two modes:**
- **Designer mode** (default) — full narrative, process details, long-form
- **Recruiter mode** — quick bullets, key stats, scannable summaries

---

## Key Config Files

### `lib/chapters-config.ts`
Defines all 7 chapters. **This is the single source of truth** for chapter order, labels, IDs, and section DOM IDs. If you add/rename a chapter, start here.

### `next.config.mjs`
Next.js config. Check here for image domain allowlists, experimental flags.

### `tailwind.config.ts`
Tailwind config. Note: v4 uses `@tailwindcss/postcss` plugin approach.

### `components.json`
shadcn/ui config. Used by the shadcn CLI to know where to install components.
