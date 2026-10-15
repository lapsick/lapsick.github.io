---
title: Code Is No Longer the Bottleneck. Knowing It's Correct Is.
slug: agentic-verification
summary: Models already write code well enough — the real question is how we verify it. Agents that run their own checks iterate toward the result before a human ever sees a diff.
publishDate: 2026-10-15
tags: [ai, agents, testing, software-engineering]
draft: false
---

I just read Addy Osmani's new piece, [*Agentic Verification*](https://addyo.substack.com/p/agentic-verification),
and it puts into words something I've been feeling while working with AI agents. Models already
write code well enough, so the real question is no longer "how do we write it" but "how do we
verify it."

If an agent can't check its own work, it's essentially guessing, and we end up stuck in a slow
loop of reading diffs, finding bugs and sending them back. An agent that runs its own checks, on
the other hand, iterates toward the result before a human ever sees anything.

## Tests as the agent's senses

That gives tests a new role: they're not just a safety net for refactoring anymore, they're how
the agent senses the world and knows when it's done.

- **End-to-end tests** are the most valuable here because they're hard to fool — a real user
  flow either works or it doesn't.
- **Property-based tests** cover what humans don't anticipate: define what must never happen and
  generate thousands of attempts to break it.
- **During migrations**, the best oracle is the old system itself, compared against the new one
  on the same inputs.

## Fast and deterministic, or it doesn't count

One more key lesson: tests must be fast and deterministic, or the agent will learn to just rerun
them instead of fixing the problem.

So our job is shifting from reviewing every line to building verification loops and defining
what success looks like before any code is written.
