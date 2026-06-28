# Portfolio Website — Project Vault

> **Start here every session.** Read [[Working Context]] first — it has the current state, what's done, and what's next. Then use the maps below to navigate to whatever you're working on.

---

## Quick Maps

### Architecture
- [[Architecture/Project Overview]] — tech stack, folder structure, how it all fits together
- [[Architecture/Routes & Pages]] — every URL and what it renders
- [[Architecture/State & Contexts]] — all React contexts and what they manage
- [[Architecture/Animation System]] — chapter transitions, particle sync, luminous burst

### Components
- [[Components/Layout Components]] — Navbar, Footer, WindowShell, SectionWrapper, ChapterRail
- [[Components/Section Components]] — all 7 chapter sections + their content
- [[Components/3D & Particles]] — PersistentScene, ForegroundParticles, Three.js setup

### Content
- [[Content/Notes Articles]] — all 5 notes with slugs, tags, and SVG infographic inventory
- [[Content/Work Projects]] — the 3 case studies with outcomes and modal data

### Sessions
- [[Sessions/Session Log]] — running log of every session and what changed

---

## Key Facts at a Glance

| Thing | Value |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind v4 + shadcn/ui |
| 3D | Three.js via @react-three/fiber |
| Animations | Framer Motion |
| Content | Markdown via gray-matter + remark |
| Port | localhost:3000 |
| Chapters | 7 (Prologue → Epilogue) |
| Notes | 5 articles with SVG infographics |
| Case studies | 3 (1 featured + 2 grid) |

---

## Running the Project

```bash
cd portfolio-website-design
npm run dev
# → http://localhost:3000
```

> Note: node_modules must be installed in /sessions/ (not /mnt/) due to symlink permissions. Claude handles this automatically.
