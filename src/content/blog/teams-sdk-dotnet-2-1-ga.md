---
title: "Teams SDK 2.1 for .NET Is Now GA: A Teams Agent Is Just an ASP.NET Core App"
slug: teams-sdk-dotnet-2-1-ga
summary: The Teams SDK stopped owning hosting, DI, logging, and the event bus, and now sits on ASP.NET Core — a Teams agent is just a small ASP.NET Core app with a message handler.
publishDate: 2026-08-20
tags: [dotnet, aspnetcore, csharp, microsoft-teams]
draft: false
---

[Teams SDK 2.1 for .NET is now GA](https://microsoft.github.io/teams-sdk/blog/announcing-teams-sdk-dotnet-2-1/).
The SDK stopped owning hosting, DI, logging, and the event bus, and now sits on ASP.NET Core — a
Teams agent is just a small ASP.NET Core app with a message handler. The bundled AI helpers are
gone too: the SDK handles the Teams runtime, and your agent framework of choice handles the model
loop. If you're coming from 2.0, there's a migration guide covering the moves.

## Key points

- **ASP.NET Core foundation.** DI, config, logging, and middleware, plus MSAL auth, work exactly
  as they would in any other .NET service.
- **2.0's plugin architecture, custom server lifecycle, and event bus are gone.** The framework no
  longer owns the process — your app does.
- **Agentic identity.** Agents call APIs under their own identity, with actions attributed in
  audit logs.
- **Per-connection OAuth flows** replace 2.0's single shared sign-in callback.
- **`ConversationState` / `UserState` built in**, backed by `IDistributedCache` — 2.0 had no state
  model at all.
- **OpenTelemetry** via `ActivitySource`, `Meter`, and `ILogger`.
- **AI helpers removed.** `ChatPrompt` and the MCP/A2A plugins from 2.0 are gone in 2.1 — that's
  now your agent framework's job, not the Teams SDK's.

## Why this matters

Moving hosting, DI, and lifecycle ownership onto ASP.NET Core itself — rather than a
framework-specific runtime — means a Teams agent composes with the rest of your .NET service
architecture instead of living beside it as a special case. That's a meaningfully cleaner
boundary if you're already running ASP.NET Core services and want Teams as one more surface
rather than a separate stack to operate.
