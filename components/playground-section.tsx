import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModuleBadge } from "@/components/module-badge"
import { SectionWrapper } from "@/components/section-wrapper"
import { Beaker, Palette, Lightbulb, Sparkles } from "lucide-react"

const experiments = [
  {
    icon: Beaker,
    label: "Prototype",
    file: "voice_ui.proto",
    title: "Voice-to-UI Concept",
    description: "Exploring conversational interfaces for form filling.",
  },
  {
    icon: Palette,
    label: "Visual Study",
    file: "glassmorphism.fig",
    title: "Glassmorphism in B2B",
    description: "Can glassy effects work in enterprise dashboards?",
  },
  {
    icon: Lightbulb,
    label: "Concept",
    file: "ai_copilot.sketch",
    title: "AI Copilot Patterns",
    description: "Interaction models for in-product AI assistants.",
  },
  {
    icon: Sparkles,
    label: "Experiment",
    file: "micro_lib.json",
    title: "Micro-interactions Library",
    description: "A collection of delightful feedback animations.",
  },
]

export function PlaygroundSection() {
  return (
    <SectionWrapper id="playground" windowTitle="experiments_sandbox.ts">
      <ModuleBadge module="05.5" label="EXPERIMENTS" />

      <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Playground</h2>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Side projects, explorations, and concepts I'm tinkering with.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {experiments.map((exp) => (
          <Card
            key={exp.title}
            className="border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                  <exp.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{exp.file}</span>
              </div>

              <Badge variant="secondary" className="text-[10px] mb-2 px-2 py-0">
                {exp.label}
              </Badge>

              <h3 className="text-sm font-semibold text-foreground mb-1">{exp.title}</h3>

              <p className="text-xs text-muted-foreground">{exp.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}
