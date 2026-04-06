The spinner was fine, honestly. Well-designed. Centered, clean, appropriate size.

Users hated it.

Not in an "I have feedback" way — nobody said anything about it in testing. But the behavioral signal was hard to miss: submit an answer, watch the spinner, and within two seconds their body language shifted. Less engaged. Somewhere else. By the time the feedback loaded, they'd have to re-engage with something they'd mentally left.

Hirello's interview feedback takes 3–4 seconds to generate. For someone who just finished a practice answer and wants to know how they did, that's a long time.

---

What I eventually figured out is that a spinner doesn't tell you what's happening, so your brain fills the gap. Under any kind of stress — and interview practice definitely qualifies — your brain fills it with something worse than the reality. The system is struggling. Something's wrong. Maybe I should refresh.

Not consciously. Just a low-level unease that shows up as disengagement.

The fix was almost embarrassingly simple. Three labeled steps, appearing in sequence:

*Reading your response...*

*Checking STAR structure...*

*Calculating pacing...*

Same actual processing time. We weren't speeding anything up. Just narrating the steps the system was already running.

![Spinner vs. labeled steps — same 3-second wait, completely different experience](/images/notes/latency-design.svg)

Users in post-session interviews described the experience as the system working "with" them. One person said it felt like watching a coach take notes while she answered. Nobody mentioned the wait, even though the wait was identical.

---

Two things I've seen go wrong that are worth naming.

Progress bars that lie — jumping to 99% and stalling. That's worse than a spinner. Specific violated expectations feel worse than vague ambiguity. Once users see the bar stuck, they start distrusting the feedback itself before they've even read it.

Optimistic UI in this context is similarly risky. Showing a preliminary score that updates when the full analysis arrives breaks trust in the number. Users don't know which version to believe.

The only version of "make the wait feel shorter" that consistently works is semantic narration — plain-language descriptions of real steps, shown while they happen. Which is really just honesty, not a trick.

---

I keep coming back to the idea that the seconds a user waits are the seconds when they have your full attention. They're not scrolling. They're not multitasking. They're watching. That's rare. Most teams treat it as dead time to minimize. It's actually a surface to design — maybe one of the most available ones in the whole product.
