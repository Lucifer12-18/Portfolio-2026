Six weeks into Hirello, the networking pipeline had a retention problem.

People were logging in. They just weren't using the pipeline past the first two days. The data was clear: onboarding completion was solid, day-one logins looked fine, then a cliff at day three. I spent two days convinced it was a UX issue with the pipeline itself — too many stages, unclear labels, confusing entry flow. Redesigned three things. Shipped them. Checked the data. No change.

So I sat down with three users and watched them open the app.

Same pattern every time. They'd see the pipeline, see twelve contacts scattered across six stages, and just... pause. "I'm not sure what to do from here." Not confused exactly — they understood the pipeline. They just didn't know what it was telling them to do right now.

---

The fix took about forty minutes to build.

One line of text at the top of the networking view, dynamically generated from what the pipeline actually showed:

*3 contacts haven't heard from you in over 2 weeks.*

Or: *You have 2 follow-ups due this week.*

Or: *Your pipeline looks healthy — 4 contacts are actively engaged.*

That's it. Same stages, same data. But now the pipeline was saying something instead of just sitting there.

![Before and after: pipeline without context vs. pipeline with a summary sentence](/images/notes/pipeline-story.svg)

Users who'd logged in once and disappeared started coming back. The stages had stakes now. The sentence told them what their network meant, not just what it contained.

---

The thing I keep sitting with is that this wasn't really a UX problem in the normal sense. The flows were fine. What was missing was a narrator — something to tell the user what they were looking at and why it mattered *today*, not in general.

I see this a lot in tools built around organizing information. They're good at storing and structuring data. They're not good at explaining what the data means in the context of what you're trying to do right now. The interpretation is left entirely to the user, which is a bigger ask than most builders realize.

I don't have a rule for when this becomes the critical bottleneck. It's one of those things you can only see by watching people actually use the thing. But "what should this screen *say* to the user?" has become a first question for me now, before I get anywhere near layout or hierarchy.

If I can't answer it, the screen isn't done yet.
