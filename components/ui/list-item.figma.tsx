/**
 * Figma Code Connect — List / ListItem
 *
 * Replace FIGMA_LIST_NODE_URL with the URL of your List component in Figma.
 */

import figma from "@figma/code-connect"
import { List, ListItem } from "@/components/ui/list-item"

figma.connect(
  List,
  "FIGMA_LIST_NODE_URL", // ← paste Figma node URL here
  {
    props: {
      spacing: figma.enum("Spacing", {
        Tight:  "tight",
        Normal: "normal",
        Loose:  "loose",
      }),
      marker: figma.enum("Marker", {
        Bullet:   "bullet",
        Dot:      "dot",
        Dash:     "dash",
        Numbered: "numbered",
        None:     "none",
      }),
    },
    example: ({ spacing, marker }) => (
      <List spacing={spacing}>
        <ListItem marker={marker}>First item</ListItem>
        <ListItem marker={marker}>Second item</ListItem>
        <ListItem marker={marker}>Third item</ListItem>
      </List>
    ),
  }
)
