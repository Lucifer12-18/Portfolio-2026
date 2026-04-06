/**
 * Figma Code Connect — Button
 *
 * Setup: pnpm add -D @figma/code-connect
 * Publish: npx figma connect publish
 *
 * Replace FIGMA_BUTTON_NODE_URL with the URL of your Button component in Figma:
 *   1. Right-click the component in Figma → "Copy link to selection"
 *   2. Paste below as the second argument to figma.connect()
 */

import figma from "@figma/code-connect"
import { Button } from "@/components/ui/button"

figma.connect(
  Button,
  "FIGMA_BUTTON_NODE_URL", // ← paste Figma node URL here
  {
    props: {
      variant: figma.enum("Variant", {
        Default:     "default",
        Secondary:   "secondary",
        Outline:     "outline",
        Ghost:       "ghost",
        Destructive: "destructive",
        Link:        "link",
      }),
      size: figma.enum("Size", {
        Default: "default",
        Small:   "sm",
        Large:   "lg",
        Icon:    "icon",
      }),
      label:    figma.string("Label"),
      disabled: figma.boolean("Disabled"),
    },
    example: ({ variant, size, label, disabled }) => (
      <Button variant={variant} size={size} disabled={disabled}>
        {label}
      </Button>
    ),
  }
)
