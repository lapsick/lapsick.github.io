---
title: "Microsoft Copilot Harness in Foundry Agent Service"
slug: microsoft-copilot-harness-foundry
summary: Microsoft introduces a managed Copilot harness for building agents with reusable skills, connected tools, and coordinated execution in Foundry Agent Service.
publishDate: 2026-11-10
tags: [ai, agents, microsoft-foundry, copilot]
draft: false
---

## Summary

Microsoft has introduced the Copilot harness in Foundry Agent Service as a public preview. It provides a managed execution layer for agents that need to reason, use tools, work with files, and carry out complex tasks. Microsoft manages the agent loop and sandbox, while developers provide the agent's instructions, knowledge, skills, and tools.

## Key takeaways

- **Reusable skills** package instructions, scripts, and supporting resources into procedures agents can apply across tasks.
- **Connected tools** include supported Foundry and Model Context Protocol (MCP) tools, with authentication and approvals configured explicitly.
- **Managed execution and delegation** let agents coordinate model and tool calls, work with files and code, and delegate bounded tasks to built-in subagents.
- **Source-controlled definitions** allow teams to develop in Foundry or keep agent definitions and resources alongside application code. Developers can choose a supported Foundry model.
- **Hosted agents offer another path** for teams that need to bring their own framework, agent loop, dependencies, or runtime behavior. Long-running resilience for hosted agents is generally available: Foundry restarts interrupted work, while application code must save progress and prevent duplicate external actions.
- **Preview limitations matter:** the harness is selected when an agent is created, and switching it afterward is not yet supported. Microsoft manages sandbox CPU, memory, and idle settings.

## Conclusion

The Copilot harness gives teams a way to focus more on an agent's expertise and results while Foundry handles much of its execution infrastructure. The right choice still depends on the workflow: a prompt agent may be enough for simpler tasks, while a hosted agent offers more control when a custom runtime is needed.

Source: [Introducing the Microsoft Copilot harness in Foundry Agent Service](https://devblogs.microsoft.com/foundry/microsoft-copilot-harness-in-foundry/)
