The thing that tipped me off was the arm crossing.

I was watching usability sessions for Hirello's interview feedback panel — the screen that appears after you practice an answer. User submits, AI processes, panel loads. Simple. In three separate sessions I watched users shift in their seat the moment it appeared. One crossed her arms. They'd look at the panel, then look away.

When I asked people to think aloud, I kept hearing "okay so there's a lot here" followed by silence. And then they'd move on.

The feedback wasn't bad. The AI was catching real things — missing structure, no concrete examples, pacing way too fast. But users were skimming past it like terms and conditions.

---

For a while I assumed it was a trust problem. Maybe they didn't believe the AI was accurate. So I ran another round and asked directly: did you read the feedback? Most said yes. But when I sat with the session recordings, the eye tracking told a different story. They'd land on the score, look for context, hit four categories with a dozen data points each, and stop. Their eyes literally moved away from the screen.

The panel was showing everything at once. Four sections. Twelve data points. A score. Recommendations. All visible the moment feedback loaded. We'd built this thing and we were proud of it and we'd put all of it right there because why would you hide information that's useful?

Turns out showing everything is what made it useless.

![Before and after: all-at-once feedback vs progressive disclosure](/images/notes/progressive-disclosure.svg)

---

The rebuild took two days. The panel now opens to one line — the most critical diagnostic. "Your answer was missing a concrete example." Below that, three dots. One lit, two dimmed. There's more, but you have to choose to go get it.

That's it. That's the whole change.

Users who'd been glossing over a full feedback panel started spending three or four times as long reading it. More importantly, they started doing something with it. Retrying their answer with the specific fix in mind. Then coming back for the second signal.

---

I've been sitting with why this wasn't obvious earlier. I think it's that when you build an AI product, there's this quiet pressure to demonstrate intelligence. The model worked hard to generate these insights. It feels wrong to hide them. Like you're shortchanging the user.

But that's about the builder's confidence, not the user's capacity. The AI earns trust one correct insight at a time. You can show it all — just not all at once, before the user has any reason to care.

I don't know that I have a clean rule for this. The closest I've gotten is: figure out what the user's actual next step is, and make that the only visible thing until they're ready for more.
