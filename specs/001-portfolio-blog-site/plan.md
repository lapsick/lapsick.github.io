# Implementation Plan: Personal Portfolio Site with Blog

**Branch**: `001-portfolio-blog-site` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-portfolio-blog-site/spec.md`

## Summary

A statically generated personal portfolio (landing, about/experience, résumé, blog) with runtime
execution confined to the contact flow: the `POST /api/contact` handler that emails submissions to
the owner, and the `/contact` page itself (server-rendered so it can show a per-submission success
or error state without a database — see below). Blog posts are Markdown files authored locally and
published by deploying; the index, tag pages, RSS feed, and sitemap are all derived from those files
at build time.

Technical approach: **Astro 6** in its default static output, with the **Node standalone adapter**
so that exactly two routes opt out of prerendering via `export const prerender = false`: the contact
page and its POST handler. Every other page ships as static HTML. FR-006 explicitly excepts the
contact page from the static-only rule, and FR-010/FR-014 require preserving a visitor's entered
input and showing field-level errors after a failed no-JavaScript submission — since Constitution II
forbids a database, this is implemented as a short-lived, `httpOnly` flash cookie set by the POST
handler and read once by the GET page, not as server-side session storage. Email is sent with
**Nodemailer over SMTP** (no vendor SDK, no lock-in). Content lives in `src/content/blog/*.md`
(Astro content collections, Zod-validated frontmatter) and `src/data/profile.ts` (LinkedIn-sourced
profile). Styling is hand-written CSS with custom properties — no UI framework. The deliverable is
one Node process serving static assets plus the contact flow.

## Technical Context

**Language/Version**: TypeScript on Node.js 22.12+ (Astro 6 minimum; Node 18/20 unsupported)

**Primary Dependencies**: `astro` 6.x, `@astrojs/node` (standalone mode), `@astrojs/rss`,
`@astrojs/sitemap`, `nodemailer`. Syntax highlighting via Shiki (built into Astro, no dependency).
Zod via `astro/zod` for content schemas (bundled).

**Storage**: Filesystem only. Markdown blog posts and a TypeScript profile data module, both
committed to the repository. No database, no runtime persistence (Constitution II).

**Testing**: None. No test framework, runner, or test dependency (Constitution III). Verification is
manual against the acceptance scenarios in the spec, scripted as checks in [quickstart.md](./quickstart.md).

**Target Platform**: A single Node.js 22 process (Astro Node standalone server) serving static
assets and one endpoint. Host-agnostic and containerizable — runs on a VPS, Render, Railway, Fly, or
any Node host.

**Project Type**: Static site generator output plus one on-demand server route. Not a SPA, not a
conventional client/server split — one Astro project, no separate frontend/backend directories.

**Performance Goals**: Primary content readable within 3s on mid-range mobile over 4G (SC-007).
Achieved by shipping zero JavaScript on content pages — Astro emits none by default.

**Constraints**: Constitution I–V. Zero authoring/admin/login surface on the deployed site (SC-006).
WCAG 2.1 AA (SC-008). No horizontal page scroll at 320/768/1280/1920px in both colour schemes (SC-009).

**Scale/Scope**: Single author, hundreds to low thousands of visits per month. Roughly 8 page
templates, ~6 components, 3 library modules, one endpoint.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Pre-Phase 0 | Post-Phase 1 |
|---|---|---|---|
| I. Node.js Backend (NON-NEGOTIABLE) | All server-side and build tooling runs on Node.js; no other runtime | **PASS** — Astro build and the Node standalone adapter are both Node.js | **PASS** — no non-Node tooling introduced |
| II. No Database (NON-NEGOTIABLE) | No DB of any kind; content in files; no runtime persistence | **PASS** — Markdown + TS data modules; contact messages go to email, never stored | **PASS** — see rate-limiter note below |
| III. No Automated Tests (NON-NEGOTIABLE) | No test framework, runner, or test-producing task | **PASS** — no test dependency planned | **PASS** — quickstart.md defines manual checks only |
| IV. Static by Default | Build-time generation; runtime execution only for the contact flow | **PASS** — Astro default static output; contact routes set `prerender = false` | **PASS** — two non-prerendered routes, both part of the one contact flow FR-006 excepts: `GET /contact` (reads a flash cookie, no DB) and `POST /api/contact` |
| V. Simplicity Over Capability | Smallest solution; every dependency traceable to a requirement | **PASS** — see dependency justification below | **PASS** — no dependency added during design |

**Dependency justification (Principle V)** — five runtime/build dependencies, each traceable:

| Dependency | Required by |
|---|---|
| `astro` | FR-006, FR-022, FR-026 (static generation, publish-by-deploy) |
| `@astrojs/node` | FR-011 (server-rendering the contact flow: the POST handler that sends email, and the contact page that reads its flash cookie) |
| `@astrojs/rss` | FR-033 (machine-readable subscription feed) |
| `@astrojs/sitemap` | FR-040 (sitemap of public pages) |
| `nodemailer` | FR-011, FR-012 (SMTP delivery with correct Reply-To) |

No CSS framework, no UI component library, no client-side router, no analytics, no image CDN — none
is traceable to a requirement.

**Principle II note (resolved, not a violation)**: the contact-form rate limiter (FR-016) keeps
counters in process memory only. Principle II forbids a database and forbids *persisting* runtime
state; in-memory counters are neither, and they are lost on restart by design. The accepted
consequence — a restart resets the window, and counters are per-process — is documented in
[research.md](./research.md) and is acceptable at this traffic scale.

**Result: PASS on all five principles, both before Phase 0 and after Phase 1. No violations to justify.**

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-blog-site/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── contact-api.md   # POST /api/contact request/response contract
│   └── content-schemas.md  # Blog frontmatter + profile data schemas
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
astro.config.mjs             # static output + node adapter + sitemap integration
package.json
.env.example                 # SMTP + owner email vars (never commit real values)

src/
├── content.config.ts        # Astro 6 content collection schema for blog (astro/zod)
├── content/
│   └── blog/                # One Markdown file per post — the entire blog "database"
│       └── *.md
├── data/
│   └── profile.ts           # LinkedIn-sourced profile, experience, education, skills, links
├── layouts/
│   ├── BaseLayout.astro     # <head>, SEO meta, skip link, header/footer, theme tokens
│   └── PostLayout.astro     # Article shell, post metadata, Open Graph tags
├── components/
│   ├── Nav.astro            # FR-005 persistent navigation
│   ├── Footer.astro         # GitHub + LinkedIn links (FR-003, FR-004)
│   ├── PostCard.astro       # Blog index entry
│   ├── TagList.astro        # Tag chips linking to tag pages
│   ├── ExperienceItem.astro # One role on the about page
│   └── ContactForm.astro    # Progressive-enhancement form (FR-039)
├── pages/
│   ├── index.astro          # Landing (FR-001)
│   ├── about.astro          # Experience/education/skills (FR-002)
│   ├── resume.astro         # Résumé page + link to PDF (FR-008)
│   ├── contact.astro        # Contact form + privacy note (FR-009, FR-019); server-rendered
│   ├── 404.astro            # Branded not-found (FR-007)
│   ├── blog/
│   │   ├── [...page].astro  # Paginated index, newest first (FR-028)
│   │   └── [slug].astro     # Individual post (FR-026)
│   ├── tags/
│   │   └── [tag].astro      # Posts by tag (FR-029)
│   ├── rss.xml.ts           # Feed (FR-033)
│   └── api/
│       └── contact.ts       # POST handler, server-rendered — export const prerender = false
├── lib/
│   ├── mail.ts              # Nodemailer transport + message composition (FR-012, FR-017)
│   ├── validate.ts          # Server-side field validation (FR-010, FR-018)
│   └── ratelimit.ts         # In-memory per-IP window (FR-016)
└── styles/
    └── global.css           # Custom properties, light/dark, reduced-motion, focus rings

public/
├── resume.pdf               # Downloadable CV (FR-008)
├── og-default.png           # Fallback social preview image (FR-032)
├── robots.txt
└── images/
```

**Structure Decision**: A single Astro project at the repository root, not a `frontend/` +
`backend/` split. The spec's only server-side behaviour is one endpoint (FR-011), so a two-package
layout would add build and deployment complexity with nothing to put in the second package —
rejected under Principle V. `src/lib/` holds the three server-side modules the endpoint uses; the
`tests/` directory that the template's default layout suggests is deliberately absent per
Constitution III.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

No violations. All five principles pass without exception, so this table is intentionally empty.
