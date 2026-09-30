// ── Formation watch signal ────────────────────────────────────────────────────
//
// A plain mutable ref shared between the content layer (PageFlipContainer) and
// the 3D scene (MorphingScene). No React overhead — the 3D engine reads this
// every animation frame inside useFrame, so a plain object is the right tool.
//
// When true  → content is absent; formation is fully exposed for the viewer.
//              The 3D scene should rotate more prominently so the shape can
//              present itself from all angles.
//
// When false → normal idle / transition mode; standard breath-hold rotation.
//
export const formationWatchRef = { current: false }

// ── Skip-transition signal ────────────────────────────────────────────────────
//
// When true, the next chapter change swaps content INSTANTLY — no formation
// watch window, no exit/enter choreography. Set by hash deep-links on load
// (a recruiter following /#chapter-4 shouldn't sit through the transition)
// and consumed + reset by PageFlipContainer.
//
export const skipTransitionRef = { current: false }
