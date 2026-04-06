/**
 * Figma Code Connect — Badge
 *
 * Replace FIGMA_BADGE_NODE_URL with the URL of your Badge component in Figma.
 */

import figma from "@figma/code-connect"
import { Badge } from "@/components/ui/badge"

figma.connect(
  Badge,
  "FIGMA_BADGE_NODE_URL", // ← paste Figma node URL here
  {
    props: {
      variant: figma.enum("Variant", {
        Default:     "default",
        Secondary:   "secondary",
        Outline:     "outline",
        Destructive: "destructive",
      }),
      label: figma.string("Label"),
    },
    example: ({ variant, label }) => (
      <Badge variant={variant}>{label}</Badge>
    ),
  }
)
