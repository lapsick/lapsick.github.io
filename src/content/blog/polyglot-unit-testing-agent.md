---
title: A Testing Agent That Actually Reads Your Codebase First
slug: polyglot-unit-testing-agent
summary: Microsoft open-sourced a testing agent that reads your repo before writing anything — your test framework, your conventions, even how CI finds tests — then writes tests and tries to break them.
publishDate: 2026-07-24
tags: [ai, agents, dotnet, testing]
draft: false
---

Microsoft [open-sourced a testing agent](https://devblogs.microsoft.com/dotnet/polyglot-unit-testing-agent/)
that actually understands your codebase. You type "Generate unit tests" and instead of guessing,
it reads your repo first — figures out your test framework, your conventions, even how your CI
finds tests — then writes and checks them. It doesn't just make tests pass; it tries to break them
to see if they're any good.

## The numbers

In their benchmark it finished 140 of 152 tasks vs. 120 for stock Copilot, same model. The gap was
biggest on lazy one-line prompts, which is kind of the whole point — the value shows up exactly
when you give it the least to go on.

## Polyglot by design

It works across .NET, Python, Go, Java, Rust, C++, and more — learning each repo's conventions
instead of forcing C# habits everywhere.

Good tests aren't just generated — they're planned, run, and checked.
