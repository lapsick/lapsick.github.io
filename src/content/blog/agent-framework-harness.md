---
title: "Microsoft Agent Framework's New Agent Harness"
slug: agent-framework-harness
summary: A harness is the runtime around a model — the tool-calling loop, history and context management, approval policies, and everything that keeps an agent working until the task is done.
publishDate: 2026-08-24
tags: [ai, agents, dotnet]
draft: false
---

[Microsoft's Agent Framework now ships an agent harness](https://learn.microsoft.com/en-us/agent-framework/agents/harness)
— worth a look if you keep rebuilding the same scaffolding around a model.

A harness is the runtime around a model: it runs the tool-calling loop, manages history and
context, applies approval policies, and keeps the agent working until the task is done.

## What it gives you

- **`HarnessAgent`** in C# (`create_harness_agent` in Python) wraps any chat client — you bring
  the client, the rest comes configured.
- **Defaults** include function invocation, history persisted after every model call, context
  compaction, a todo list, file memory, file access, tool approval, OpenTelemetry, and web search.
- **Every capability has its own disable flag**, so you keep what you need and drop the rest.
  Optional extras: skills discovery, background sub-agents, shell execution, and looping until a
  completion condition is met.
- **Plan/execute modes** are a nice touch: the agent drafts a plan and gets your approval first,
  then works through it on its own.

If you've hand-rolled this scaffolding more than once — the tool loop, the history management,
the approval gate before a risky action — this is the kind of thing worth evaluating before
building it again from scratch.
