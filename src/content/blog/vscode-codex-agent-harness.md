---
title: "Codex Is Now an Agent Harness in VS Code Chat"
slug: vscode-codex-agent-harness
summary: VS Code officially supports Codex in its Chat interface, with an extension integration and an experimental Agent Host option.
publishDate: 2026-10-19
tags: [ai, agents, vscode, codex]
draft: false
---

[VS Code now documents Codex as an agent harness](https://code.visualstudio.com/docs/agents/run/agent-harnesses#_codex) in its Chat experience.
That means Codex is available as an agent session, not merely as a model choice inside a different harness.

To use Codex in the Chat view, install and enable the OpenAI Codex extension, then follow its sign-in and permission setup.
VS Code also offers an experimental Agent Host integration that can run Codex without the extension in the Agents window; using that integration in Chat requires an additional setting and a restart.
Only one Codex integration appears in a VS Code window at a time.

I like this direction because the editor now makes the agent harness an explicit choice alongside the coding work it supports.
When starting a session, I can choose the runtime I want and keep the conversation close to the files I'm changing.
