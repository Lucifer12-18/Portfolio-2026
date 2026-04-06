Something I noticed early in testing: the way feedback is framed determines whether someone can actually use it.

During one session I deliberately varied how the AI phrased the same observation. Both versions were accurate. The reactions were completely different.

Version A: *"Your answer felt weak and lacked confidence."*

Version B: *"Your answer had one concrete example, where this question type typically expects three or four."*

Users who got version A got quiet. Some crossed their arms. A few pushed back. None of them wrote anything down.

Users who got version B opened their notes app. Started asking follow-up questions — what counts as a concrete example, is one always wrong or does it depend on the question? They treated it like information they could do something with.

Same observation. One framing closed the conversation. The other opened it.

![Emotional framing vs. measurable framing — and what each triggers](/images/notes/feedback-framing.svg)

---

The distinction isn't really about tone. "Weak" and "lacking confidence" are judgments — they say something about the person, not just the answer. When you hear a judgment, the instinct is to defend or deflect. Neither is useful.

"One example instead of four" is a gap. It tells you exactly where you are relative to where you need to be, with no implication about who you are as a person. It's information, not assessment.

This shaped everything about how we built Hirello's feedback panel. The metrics we track now: STAR compliance broken down by component, not just a score. Concrete example count, because recruiters flag this constantly and users can feel when they're giving a real example vs. a general statement. Pacing in actual words per minute with a target range. Filler word count — "you used 9 filler words" lands completely differently than "you say um a lot."

Not ratings. Counts. The difference matters more than I expected.

---

Worth naming: some users pushed back on this. "I'm a person, not a rubric." That reaction is fair and I don't think it's wrong.

What we found was that sequence mattered more than the metrics themselves. If the panel opened with numbers, it felt clinical. If it opened with something genuine about what landed well in the answer — and *then* went into measurements — users received the data differently. They weren't being reduced to a score. They were getting a diagnosis after someone had actually listened.

The order we landed on: what worked → what the data shows → what to try next. We tested a few orderings. That one consistently felt right.
