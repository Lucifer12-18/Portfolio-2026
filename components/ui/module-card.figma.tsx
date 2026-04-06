/**
 * Figma Code Connect — ModuleCard
 *
 * Replace FIGMA_MODULE_CARD_NODE_URL with the URL of your ModuleCard component in Figma.
 */

import figma from "@figma/code-connect"
import { ModuleCard } from "@/components/ui/module-card"

figma.connect(
  ModuleCard,
  "FIGMA_MODULE_CARD_NODE_URL", // ← paste Figma node URL here
  {
    props: {
      variant: figma.enum("Variant", {
        Default:  "default",
        Elevated: "elevated",
        Dashed:   "dashed",
        Ghost:    "ghost",
      }),
      eyebrow:     figma.string("Eyebrow"),
      title:       figma.string("Title"),
      description: figma.string("Description"),
    },
    example: ({ variant, eyebrow, title, description }) => (
      <ModuleCard
        variant={variant}
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
    ),
  }
)
