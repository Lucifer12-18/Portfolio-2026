# Work Projects

3 case studies shown in Chapter 4 (Work section). Data lives in the `projects` array at the top of `components/work-section.tsx`.

---

## Projects

### Hirello.ai – AI-First Hiring Flow
- **Featured:** ✅ (large card, top of section)
- **Tags:** Product Design · AI & UX
- **Role:** Founding Product Designer
- **Context:** AI hiring platform
- **Year:** 2024
- **Tools:** Figma · FigJam · Maze
- **Image:** `/images/hirello-mockup.svg`

**Problem:** Recruiters were spending 60% of their time manually screening resumes that AI had already scored. Existing interface buried AI insights and forced redundant manual reviews.

**Approach:**
1. Contextual inquiry with 8 recruiters to map current workflows
2. Identified key decision points where AI confidence could reduce manual effort
3. Designed progressive disclosure pattern — high-confidence candidates surface automatically
4. Created calibration flow for recruiters to train AI on team-specific preferences

**Outcome:** 40% reduction in screening time. Recruiter satisfaction 3.2 → 4.6/5. Pattern adopted across 3 other product teams.

**Deep-dive pages:** `/case-stories/hirello-ai/` → `/full`, `/interview`, `/networking`

---

### Reddit Redesign – Reducing Cognitive Overload
- **Featured:** ❌ (grid card)
- **Tags:** Product Design · Concept
- **Role:** Product Designer
- **Context:** Content ecosystem concept
- **Year:** 2023
- **Tools:** Figma · FigJam
- **Image:** `/images/reddit-mockup.svg`

**Problem:** Reddit's density works for power users but overwhelms casual browsers. Reduce cognitive load without losing serendipity.

**Approach:**
1. Analyzed heatmaps/session recordings from Reddit's public UX research
2. Identified 3 user modes: browsing, seeking, participating
3. Designed adaptive density system that responds to behavior patterns
4. Created 'focus mode' for deep reading without infinite scroll

**Outcome:** Concept exploration. Featured in design community discussion with 2K+ views.

---

### AI Job Market Dashboard
- **Featured:** ❌ (grid card)
- **Tags:** Data Visualization · Systems
- **Role:** Product Designer
- **Context:** Data systems dashboard
- **Year:** 2024
- **Tools:** Tableau · Figma · SQL
- **Image:** `/images/dashboard-mockup.svg`

**Problem:** IS students needed to understand AI's impact on job markets but existing data was too academic or sensationalized.

**Approach:**
1. Aggregated data from Bureau of Labor Statistics, LinkedIn, industry reports
2. Designed narrative: macro trends → specific roles → skill gaps
3. Created interactive "what-if" scenarios for different career paths
4. Built comparison tools for regional/industry insights

**Outcome:** Adopted by UMBC career services. 300+ students in first semester. Professors requested curriculum integration.

---

## Adding a New Project

Edit the `projects` array in `components/work-section.tsx`. Fields:

```ts
{
  title: string
  hook: string           // one-line description shown on card
  file: string           // filename metaphor (e.g. "my_project.tsx")
  tags: string[]
  role: string
  context: string
  year: string
  featured: boolean      // only one should be true
  imagePath: string      // /images/{name}.svg
  description: {
    recruiter: string    // short for recruiter mode
    designer: string     // full for designer mode
  }
  tools: string[]
  problem: string
  approach: string[]
  outcome: string
}
```

> Only one project should have `featured: true` — it renders as the large hero card. All others go in the 2-col grid.
