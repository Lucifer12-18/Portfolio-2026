AI features have latency built in. That's not a bug—it's physics. LLM inference takes time. Resume parsing takes time. Generating structured feedback on a spoken answer takes time.

For Hirello's interview feedback screen, we were looking at 3 to 4 seconds from submission to results. For users who've just finished a high-stakes practice answer and are waiting to find out how they did, that's a long time.

We put a spinner there first. Simple, clean, centered. Users hated it.

Not vocally—they didn't complain in testing. But the behavioral signal was clear: they'd submit an answer, watch the spinner, and by the time the feedback appeared, they'd already started disengaging. The wait had convinced them the system was working on something irrelevant to them.

## What the Wait Actually Is

A spinner communicates one thing: something is happening. It doesn't say what's happening, why it matters, or how close the user is to what they're waiting for.

That ambiguity is where anxiety lives.

Users filling a vague wait with their own imagination will always fill it with something worse than the reality. They assume the delay means the system is struggling. They wonder if they should refresh. They start to regret submitting.

The wait isn't dead time. It's the moment when the user has your full, undivided attention. They're not scrolling. They're not multitasking. They're watching. That's rare. Most teams treat it as a gap to minimize. It's actually a surface to design.

## What We Built Instead

We replaced the spinner with a three-step labeled progress sequence:

*"Reading your response..."*

*"Checking STAR structure..."*

*"Calculating pacing and delivery..."*

Each step appeared sequentially, with a brief animation between transitions. The total displayed time was the same—we weren't faking speed. We were narrating the actual steps the system was running.

The effect was immediate. Users reported in post-session interviews that the system felt like it was "working with them." One user said it felt like watching a coach take notes while they answered.

Nobody mentioned the wait.

## Three Patterns That Actually Work

**Semantic skeleton screens.** Not generic loading placeholders, but labeled ones. "Analyzing answer structure" is more trustworthy than an anonymous grey block. It tells the user what they'll see when it loads.

**Progressive result streaming.** Show partial results as they arrive. If the STAR score is ready before the pacing analysis, show it. Partial information is better than no information—it proves the system is working and gives the user something to engage with.

**Redirect attention productively.** Ask the user something useful while they wait. For Hirello, we tested prompting users with "What role was this answer targeting?" during the wait—data we needed anyway, and a question that kept users mentally in the context of the feedback they were about to receive.

## What Doesn't Work

A progress bar that lies. Jumping to 99% and stalling is worse than a spinner—it introduces a specific, violated expectation.

Optimistic UI that shows results before the model is confident. If you display a score that then changes when the full analysis completes, you've broken trust in the number itself.

Generic copy. "Loading" is not a label. "Please wait" is not reassurance. If you can't say what you're doing, you haven't thought carefully enough about what you're doing.

The wait is part of the product. Design it like you designed everything else.
