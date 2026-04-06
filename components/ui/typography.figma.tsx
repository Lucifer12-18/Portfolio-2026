/**
 * Figma Code Connect — Typography
 *
 * Maps the Figma "Typography" component set to the matching code export.
 * Replace each FIGMA_*_NODE_URL with the Figma node URL for that text style.
 *
 * Tip: in Figma, each text style variant (H1, H2, Lead…) can be a separate
 * component, or a single component with a "Variant" enum property.
 * Adjust the figma.enum() mappings to match your Figma structure.
 */

import figma from "@figma/code-connect"
import { H1, H2, H3, H4, P, Lead, Label, SectionLabel, Caption } from "@/components/ui/typography"

// ── H1 ──────────────────────────────────────────────────────────────────────
figma.connect(H1, "FIGMA_H1_NODE_URL", {
  props: { text: figma.string("Text") },
  example: ({ text }) => <H1>{text}</H1>,
})

// ── H2 ──────────────────────────────────────────────────────────────────────
figma.connect(H2, "FIGMA_H2_NODE_URL", {
  props: { text: figma.string("Text") },
  example: ({ text }) => <H2>{text}</H2>,
})

// ── H3 ──────────────────────────────────────────────────────────────────────
figma.connect(H3, "FIGMA_H3_NODE_URL", {
  props: { text: figma.string("Text") },
  example: ({ text }) => <H3>{text}</H3>,
})

// ── Body paragraph ───────────────────────────────────────────────────────────
figma.connect(P, "FIGMA_P_NODE_URL", {
  props: { text: figma.string("Text") },
  example: ({ text }) => <P>{text}</P>,
})

// ── Lead (bold body) ─────────────────────────────────────────────────────────
figma.connect(Lead, "FIGMA_LEAD_NODE_URL", {
  props: { text: figma.string("Text") },
  example: ({ text }) => <Lead>{text}</Lead>,
})

// ── Uppercase mono label ─────────────────────────────────────────────────────
figma.connect(Label, "FIGMA_LABEL_NODE_URL", {
  props: { text: figma.string("Text") },
  example: ({ text }) => <Label>{text}</Label>,
})

// ── Section label with dot marker ────────────────────────────────────────────
figma.connect(SectionLabel, "FIGMA_SECTION_LABEL_NODE_URL", {
  props: { text: figma.string("Text") },
  example: ({ text }) => <SectionLabel>{text}</SectionLabel>,
})

// ── Caption ──────────────────────────────────────────────────────────────────
figma.connect(Caption, "FIGMA_CAPTION_NODE_URL", {
  props: { text: figma.string("Text") },
  example: ({ text }) => <Caption>{text}</Caption>,
})
