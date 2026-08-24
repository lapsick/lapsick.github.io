# Phase 0 Research: Personal Portfolio Site with Blog

**Feature**: 001-portfolio-blog-site | **Date**: 2026-08-24

Every Technical Context entry in [plan.md](./plan.md) is resolved below. **No NEEDS CLARIFICATION
markers remain.** Decisions are constrained by the constitution: Node.js only, no database, no
tests, static by default, simplest sufficient solution.

---

## R1. Site framework

**Decision**: Astro 6.x, default `output: 'static'`, with `@astrojs/node` in standalone mode so a
single route can opt out of prerendering.

**Rationale**: Astro is the only mainstream Node framework whose *default* is exactly what
Constitution IV mandates — everything prerendered, with per-route opt-out via `export const
prerender = false`. That makes "static by default, one dynamic endpoint" a configuration fact rather
than a discipline the implementer must maintain. It also brings four spec requirements in-box with
no extra dependency: Markdown content collections with schema validation (FR-020, FR-021), Shiki
syntax highlighting (FR-027), zero client-side JavaScript by default (SC-007), and first-party RSS
and sitemap integrations (FR-033, FR-040).

**Version specifics confirmed for Astro 6**: minimum **Node.js 22.12.0** (Node 18 and 20 dropped);
content collection config lives at **`src/content.config.ts`**, not the Astro 4 path
`src/content/config.ts`; Zod is imported from **`astro/zod`**, as the `z` re-export from
`astro:content` is deprecated; legacy collections are off by default. Astro 6 also ships *live*
content collections (`src/live.config.ts`) for request-time API data — **not used here**, as all
content is build-time files (Constitution II and IV).

**Alternatives considered**:
- *Eleventy* — excellent static generator, but has no server-route concept, so the contact endpoint
  would need a second, separately deployed serverless function. Two deploy targets for one form;
  rejected under Principle V.
- *Next.js* — capable but server-first: static export is the exception rather than the default, it
  ships a client runtime on pages that do not need one, and its surface area vastly exceeds this
  feature. Rejected under Principle V.
- *Hand-rolled Node build script* — maximally simple in dependencies, but we would hand-write
  Markdown parsing, frontmatter validation, syntax highlighting, pagination, RSS, and sitemap. That
  is more code and more risk than one well-scoped dependency, especially with no test suite to catch
  regressions (Constitution III). Rejected.

---

## R2. Hosting and deployment target

**Decision**: Build to an Astro Node **standalone** server — one Node 22 process serving static
assets plus `/api/contact`. Host-agnostic; deployable to any Node host or as a container.

**Rationale**: Constitution I requires a Node.js backend. Standalone mode delivers precisely that
and keeps the project portable — no vendor adapter, no platform-specific primitives in the source.
The owner can run it on a VPS, Render, Railway, Fly, or Docker without a code change.

**Alternatives considered**:
- *Static host + serverless function* (Vercel/Netlify adapters) — cheaper and scales to zero, but
  couples the repository to one vendor's adapter and function signature, and splits the app across
  two runtimes. If the owner later prefers this, only `astro.config.mjs` changes: swap the adapter,
  and `/api/contact` deploys as a function automatically. Recorded as a supported future pivot.
- *Fully static site + third-party form service* (Formspree, Netlify Forms) — would remove the
  backend entirely, but Constitution I explicitly *requires* a Node.js backend. Rejected on the
  constitution.

**Consequence to accept**: a standalone Node process must stay running and does not scale to zero, so
hosting costs a few dollars a month rather than nothing. Acceptable at this scale.

---

## R3. Email delivery

**Decision**: `nodemailer` over SMTP, configured entirely through environment variables.

**Rationale**: SMTP is the one email interface every provider supports, so the owner can point it at
Fastmail, Gmail, Postmark, Resend, Brevo, or their own domain host without a code change. A
vendor-specific SDK would hard-code that choice for no functional gain (Principle V).

**Deliverability requirement (important, affects SC-003's "100% arrive")**: the `From:` address MUST
be a mailbox on a domain the owner controls and has SPF/DKIM configured for. The site MUST NOT put
the visitor's address in `From:` — that is sender spoofing and will be rejected by DMARC or land in
spam, silently breaking the core conversion path. Instead:

- `From:` — the site's own address, e.g. `noreply@<owner-domain>`
- `Reply-To:` — the visitor's submitted address, which is what satisfies FR-012's reply behaviour
- `To:` — the owner's configured destination inbox

**Alternatives considered**: Resend/Postmark SDKs (better deliverability tooling, but vendor
lock-in and an unnecessary dependency); sending directly from the visitor's address (fails DMARC —
actively harmful, rejected).

---

## R4. Spam protection without a database

**Decision**: Layered, all stateless or in-memory — (1) a honeypot field hidden from humans and
screen readers, rejected if filled; (2) a minimum time-to-submit check via a timestamp field, since
bots submit near-instantly; (3) an in-memory per-IP rate limit.

**Rationale**: FR-015 requires rejecting bots *without* imposing a disruptive challenge on humans,
which rules out a visible CAPTCHA as the primary defence. This trio costs no dependency, no
third-party request, and no storage — and honeypot plus timing alone stops the overwhelming majority
of untargeted form spam, which is what SC-004 measures.

**Constitution II compliance**: rate-limit counters live in a plain `Map` in process memory and are
never written to disk. Principle II forbids a database and forbids *persisting* runtime state;
ephemeral counters are neither.

**Consequences to accept**: counters reset on restart and are per-process, so a determined attacker
could exceed the intended rate across a restart or a second instance. At hundreds-to-low-thousands
of visits per month with a single process, this is not worth solving with infrastructure. If
targeted spam does appear, the documented escalation is to add a privacy-respecting challenge
(Cloudflare Turnstile or hCaptcha) — a change that would need justification against Principle V.

---

## R5. Blog content shape

**Decision**: One Markdown file per post in `src/content/blog/`, frontmatter validated by an
`astro/zod` schema in `src/content.config.ts`. Drafts are excluded by a `draft: true` frontmatter
flag filtered out of every query at build time.

**Rationale**: Directly implements the Option A authoring decision (FR-021, FR-022) — the owner's
editor is the CMS, and `git` is the version history. The Zod schema is what makes the FR-025 edge
case ("malformed post file") a build-time failure naming the offending file, rather than a broken
page on the live site.

**Draft handling is exclusion, not hiding** — FR-025 requires that no draft content be *present* in
what was deployed. Filtering drafts out of `getStaticPaths` means draft pages are never generated,
so there is no URL to guess and no content in the build output. A runtime `if (draft) return 404`
would be weaker and is rejected.

**Slug stability (FR-026, SC-011)**: the URL slug comes from an explicit `slug` frontmatter field,
not from the filename. This lets the owner rename or reorganise files without breaking links already
shared by readers, and makes a deliberate slug change a visible, reviewable edit.

**Alternatives considered**: MDX (allows components in posts, but pulls in a dependency and a
client runtime for a blog that needs neither — Principle V); a headless CMS (contradicts the Option
A decision and Constitution II).

---

## R6. Profile content from LinkedIn

**Decision**: A typed `src/data/profile.ts` module holding name, title, summary, links, skills,
experience entries, and education entries. Transcribed manually, once.

**Rationale**: The spec's assumption already establishes manual transfer — LinkedIn offers no
general programmatic profile access for this purpose, and scraping it violates their terms. A typed
module gives editor autocomplete and a compile-time error on a malformed entry, which is the closest
available substitute for the validation a test suite would otherwise provide (Constitution III).

**Blocking input**: the owner must supply the actual LinkedIn content, GitHub URL, LinkedIn URL, and
destination email before the site can be completed. Implementation can proceed against placeholder
data; the site cannot ship on it.

---

## R7. Styling, theming, accessibility

**Decision**: Hand-written CSS in `src/styles/global.css` using custom properties, plus Astro's
scoped component styles. No CSS framework.

**Rationale**: The site has roughly eight page templates. A utility or component framework would add
a build step and a dependency to solve a problem this small does not have (Principle V).

**Implementation notes tied to requirements**:
- Light/dark via `:root` tokens redefined under `@media (prefers-color-scheme: dark)` (FR-037).
  Contrast pairs must be checked against WCAG 2.1 AA in *both* schemes (SC-008).
- `@media (prefers-reduced-motion: reduce)` suppresses non-essential animation (FR-038).
- Visible `:focus-visible` outlines on every interactive element; never remove the default without a
  replacement (FR-035).
- Code blocks get `overflow-x: auto` on their container so the page itself never scrolls sideways
  (FR-027, SC-009).

---

## R8. Working without a test suite

**Decision**: Substitute three build-time guarantees plus one scripted manual pass, defined in
[quickstart.md](./quickstart.md).

**Rationale**: Constitution III removes automated verification, and the constitution's Development
Workflow requires each user story to be manually verified against its acceptance scenarios. What
partially compensates, at no cost in dependencies:

1. **TypeScript** — `astro check` catches type errors in the profile data and endpoint code.
2. **Zod frontmatter schema** — a malformed post fails the build with the filename.
3. **Build-time link and route generation** — a link to a non-existent post fails at build, not in
   production.
4. **Manual acceptance pass** — quickstart.md walks the spec's acceptance scenarios in order.

**Consequence to accept**: nothing catches a visual or behavioural regression on a previously working
page. Changes must stay small and be previewed locally before every deploy (Development Workflow).

---

## Sources

- [Astro 6.0 announcement](https://astro.build/blog/astro-6/)
- [Upgrade to Astro v6 — Astro Docs](https://docs.astro.build/en/guides/upgrade-to/v6/)
- [Astro Content Collections guide (2026)](https://inhaq.com/blog/getting-started-with-astro-content-collections)
- [Migrating from Astro 5 to Astro 6](https://harshil.dev/writings/migrating-astro-5-to-astro-6/)
