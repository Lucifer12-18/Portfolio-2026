The realization didn't happen dramatically. It happened during a code review.

I'd built a form validation system at Wipro — clean logic, handled all the edge cases, worked exactly as specified. Someone from QA filed a bug: "Users are confused about why their input is being rejected. The error just says 'invalid format.'"

The system was correct. The user had no idea what was wrong with what they typed. Those are two different problems and I'd only solved one.

That gap — between a system that works and a system that makes sense to the person using it — is the thing that eventually pointed me toward design. Not dissatisfaction with engineering. Just a specific type of problem I kept noticing and didn't have the tools for.

---

The Information Systems program at UMBC gave me a frame I didn't expect to find useful: organizations as information-processing systems. Where does data enter, transform, break down? Where are the bottlenecks? What happens when a step in the chain receives input it wasn't designed for?

I expected database theory and ERP implementations. What I found was a lens for thinking about broken workflows — and the humans stuck navigating them.

![Two lenses: engineering and UX, and where they intersect](/images/notes/two-lenses.svg)

When I started designing, I figured the engineering background would mostly sit in a drawer. Turns out it's the part that matters most in the rooms I actually end up in.

Not because I write code. Because I can read a constraint as information rather than an obstacle. When an engineer says we can't store that state server-side, I understand what we're designing around rather than against. When a PM says this feature needs two sprints, I know which design decisions to simplify now.

---

A concrete version of this: when I was designing Hirello's networking tier system, the first version was a data model. Three tiers — warm contacts, cold contacts, and cold contacts worth warming. Logic was clean, labels were precise.

Then I ran interviews.

Nobody thought in those categories. Users had mental models like: people I'm comfortable reaching out to, people I'd feel weird cold-messaging, and people I'd forgotten existed. The data model was right. The categories were wrong. The fix was renaming things, not rebuilding the architecture. But I wouldn't have known to look there without understanding both sides.

---

The career path, in the version I tell at interviews, sounds planned. It wasn't. I just kept following the specific problem I hadn't solved yet. The degree was useful. The trajectory was obvious only in retrospect.

What I'd say now is that engineering and design aren't two fields — they're two languages for the same problem. Engineering describes the mechanism. Design describes what it's like to be the person using it. Neither one is complete on its own, and the interesting work lives at the seam between them.
