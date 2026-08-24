---

description: "Task list for 001-portfolio-blog-site"
---

# Tasks: Personal Portfolio Site with Blog

**Input**: Design documents from `/specs/001-portfolio-blog-site/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/)

**Tests**: **NONE.** Constitution III (NON-NEGOTIABLE) forbids test suites, frameworks, runners, and
test-producing tasks. No task below creates a test. Verification is the manual acceptance pass in
[quickstart.md](./quickstart.md), which the constitution's Development Workflow requires before any
story counts as done — tasks T020, T031, T041 and T050 are those gates.

**Organization**: Grouped by user story so each can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Exact file paths included in every task

## Path Conventions

Single Astro project at repository root — `src/`, `public/`, no `tests/` directory (Constitution III).
Layout per [plan.md](./plan.md#project-structure).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization

- [X] T001 Initialize Astro 6 project at repository root: create `package.json` with `"type": "module"`, `"engines": { "node": ">=22.12.0" }`, and scripts `dev`, `build`, `preview`, `start`, `check` (`astro check`)
- [X] T002 Install dependencies in `package.json`: `astro@^6`, `@astrojs/node`, `@astrojs/rss`, `@astrojs/sitemap`, `nodemailer`, and dev dependency `@types/nodemailer`. Add nothing else — every dependency must trace to a requirement (Constitution V)
- [X] T003 [P] Create `astro.config.mjs`: set `site` to the production URL, leave `output` at its default `'static'`, add `adapter: node({ mode: 'standalone' })` and the `sitemap()` integration
- [X] T004 [P] Create `tsconfig.json` extending `astro/tsconfigs/strict`
- [X] T005 [P] Create `.gitignore` (`node_modules/`, `dist/`, `.env`) and `.env.example` with the seven variables listed in [contracts/contact-api.md](./contracts/contact-api.md#configuration) — placeholder values only, never real secrets
- [X] T006 [P] Create `public/robots.txt` allowing all crawlers and pointing at `/sitemap-index.xml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared shell every user story renders inside

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 [P] Create `src/styles/global.css`: colour/spacing/type tokens on bare `:root`, dark values redefined under `@media (prefers-color-scheme: dark)`, `@media (prefers-reduced-motion: reduce)` suppressing non-essential animation, visible `:focus-visible` outlines, base typography and container widths (FR-035, FR-036, FR-037, FR-038)
- [X] T008 [P] Create `src/data/profile.ts`: the `Profile`, `ExperienceEntry`, and `EducationEntry` interfaces exactly as specified in [contracts/content-schemas.md](./contracts/content-schemas.md#profile-data--srcdataprofilets), plus a placeholder `profile` export. Real content arrives in T058
- [X] T009 Create `src/layouts/BaseLayout.astro`: `<html lang>`, per-page `<title>` and `<meta name="description">` from props, canonical URL, default Open Graph tags, a skip-to-content link, imports `src/styles/global.css`, renders Nav and Footer around a `<slot />` (FR-040)
- [X] T010 [P] Create `src/components/Nav.astro`: persistent links to `/`, `/about`, `/blog`, `/contact` with `aria-current="page"` on the active route (FR-005)
- [X] T011 [P] Create `src/components/Footer.astro`: GitHub and LinkedIn links read from `profile`, each `target="_blank" rel="noopener noreferrer"` (FR-003, FR-004)
- [X] T012 Create `src/pages/404.astro` using `BaseLayout`, with navigation back to `/` and `/blog` (FR-007)
- [X] T013 Verify `npm run build` succeeds and `npm start` serves `dist/` — the foundation is provably deployable before any story begins

**Checkpoint**: Shared shell ready — user stories can now proceed

---

## Phase 3: User Story 1 - Recruiter evaluates the owner's background (Priority: P1) 🎯 MVP

**Goal**: A visitor understands who the owner is, their career history, and can reach their GitHub

**Independent Test**: A person unfamiliar with the owner states their title, three technologies, and career trajectory, then opens the GitHub profile — with no other part of the site built

- [X] T014 [P] [US1] Create `src/components/ExperienceItem.astro`: renders one `ExperienceEntry` — role, company, date range (rendering `'present'` as "Present"), location, highlights list, technologies
- [X] T015 [US1] Create `src/pages/index.astro`: name, professional title, positioning summary, skills, GitHub and LinkedIn links, and calls-to-action into `/about`, `/blog`, `/contact` (FR-001, FR-003)
- [X] T016 [US1] Create `src/pages/about.astro`: experience entries newest-first via `ExperienceItem`, education/certifications, full skills list (FR-002)
- [X] T017 [P] [US1] Create `src/pages/resume.astro`: résumé content as a page plus a download link to `/resume.pdf` (FR-008)
- [X] T018 [P] [US1] Add `public/resume.pdf` and the profile photo under `public/images/`, wiring `photoAlt` through so the image carries meaningful alternative text (FR-041)
- [X] T019 [US1] Pass a distinct title and description to `BaseLayout` from each of `index.astro`, `about.astro`, and `resume.astro` (FR-040)
- [X] T020 [US1] Run the **User Story 1** section of [quickstart.md](./quickstart.md#user-story-1--recruiter-evaluates-background-p1) and record the outcome — required by the constitution before this story is done

**Checkpoint**: US1 fully functional and independently verifiable — this alone is a deployable MVP

---

## Phase 4: User Story 2 - Recruiter makes contact (Priority: P1)

**Goal**: A recruiter submits the contact form and the owner receives a replyable email

**Independent Test**: Submit the form; confirm on-screen success, an email in the destination inbox containing every field, and that Reply addresses the sender

- [X] T021 [P] [US2] Create `src/lib/validate.ts`: validate `name` (1–100), `email` (well-formed, ≤254), `company` (≤100), `message` (1–5000), returning **all** errors as a field→message map rather than stopping at the first (FR-010, FR-018)
- [X] T022 [P] [US2] Create `src/lib/ratelimit.ts`: in-memory `Map` keyed by client IP, 5 submissions per hour, entries expiring on read plus a periodic sweep to bound growth. Nothing written to disk (Constitution II)
- [X] T023 [P] [US2] Create `src/lib/mail.ts`: Nodemailer SMTP transport from environment variables, failing loudly at startup if any required variable is missing; composes a **`text/plain` only** message with `From` = the site's own address, `Reply-To` = the visitor's address, `To` = `CONTACT_TO_EMAIL`; strips CR/LF from `name` and `email` before they reach any header (FR-011, FR-012, FR-017)
- [X] T024 [US2] Create `src/components/ContactForm.astro`: labelled name/email/company/message fields, a `_hp` honeypot hidden from sight **and** from assistive technology, a `_t` render-timestamp field, a native `method="post" action="/api/contact"` so it works without scripting, and repopulation of submitted values plus inline errors (FR-009, FR-015, FR-039)
- [X] T025 [US2] Create `src/pages/api/contact.ts` with `export const prerender = false`. Handle method and content-type negotiation: reject non-POST with 405, accept `application/x-www-form-urlencoded` and `application/json`, reject anything else with 415 (Constitution IV)
- [X] T026 [US2] In `src/pages/api/contact.ts`, wire the rejection sequence in order: honeypot and sub-3-second timing check returning a **fake success** with no email sent, then the rate limit returning 429 with `Retry-After`, then validation returning 400 with the full error map (FR-015, FR-016, FR-010)
- [X] T027 [US2] In `src/pages/api/contact.ts`, wire delivery: on success return 200 JSON for a fetch submission or 303 to `/contact?sent=1` for a native form post; on SMTP failure return 502 carrying `PUBLIC_FALLBACK_EMAIL` and preserving the visitor's input. Never log the message body or sender address (FR-013, FR-014)
- [X] T028 [US2] Create `src/pages/contact.astro`: renders `ContactForm`, the `?sent=1` success confirmation, the privacy note stating the data is emailed to the owner, and the owner's direct address as a fallback (FR-013, FR-019)
- [X] T029 [US2] Add an optional progressive-enhancement script to `src/components/ContactForm.astro` that submits via `fetch` and renders inline results — it must degrade cleanly to the native POST when scripting is unavailable (FR-039)
- [X] T030 [US2] Verify the deployed route surface: `/api/contact` accepts only POST, and no authoring/admin/login route exists anywhere in the build — the only server-rendered routes are `GET /contact` and `POST /api/contact`, both part of the contact flow (SC-006)
- [X] T031 [US2] Run the **User Story 2** section of [quickstart.md](./quickstart.md#user-story-2--recruiter-makes-contact-p1), including the deliberate SMTP-failure and scripting-disabled checks, and record the outcome

**Checkpoint**: US1 and US2 both work independently — the site now converts

---

## Phase 5: User Story 3 - Owner publishes a blog post (Priority: P2)

**Goal**: The owner authors a Markdown file locally, previews it, deploys, and it is live

**Independent Test**: Author a post, preview locally, deploy, then confirm from a separate browser that it renders at its own URL with formatting intact

- [X] T032 [US3] Create `src/content.config.ts` (the Astro 6 path — **not** `src/content/config.ts`) defining the `blog` collection with the `glob` loader and the Zod schema from [contracts/content-schemas.md](./contracts/content-schemas.md#blog-collection--srccontentconfigts), importing `z` from `astro/zod`, including both refinements (cover-image alt required, `updatedDate` not before `publishDate`)
- [X] T033 [P] [US3] Create `src/content/blog/` with three sample Markdown posts exercising headings, lists, links, inline code, fenced code blocks, and an image — one of them with `draft: true` so draft exclusion is verifiable (FR-020)
- [X] T034 [US3] Create `src/lib/posts.ts` exporting `getPublishedPosts()` (filters `draft`, sorts by `publishDate` descending) and `getAllTags()`. **Every** listing, feed, and sitemap entry must derive from this single source so no listing is ever hand-maintained (FR-026, FR-028)
- [X] T035 [US3] Add a build-time guard that fails the build listing the offending files when two posts share a `slug`, preventing the duplicate-title edge case from silently overwriting a post
- [X] T036 [US3] Add a build-time guard that fails the build naming the path when a post's `coverImage` does not resolve to a real file under `public/`
- [X] T037 [P] [US3] Create `src/layouts/PostLayout.astro`: article shell, title, publish and updated dates, tags, prose typography, and fenced code blocks confined to an `overflow-x: auto` container so the page itself never scrolls sideways (FR-027)
- [X] T038 [US3] Create `src/pages/blog/[slug].astro`: `getStaticPaths` built from `getPublishedPosts()` only, keyed on the frontmatter `slug` rather than the filename, so drafts generate no page and renaming a file cannot break a shared link (FR-025, FR-026)
- [X] T039 [US3] Create `src/pages/blog/index.astro`: a simple newest-first listing of published posts (pagination arrives in US4)
- [X] T040 [US3] Verify draft exclusion is genuine, not cosmetic: after a build, grep `dist/` for the draft post's title and confirm **zero matches**, and that its URL 404s (FR-025)
- [X] T041 [US3] Run the **User Story 3** section of [quickstart.md](./quickstart.md#user-story-3--owner-publishes-a-post-p2) and record the outcome

**Checkpoint**: The owner can publish. US1–US3 all independently functional

---

## Phase 6: User Story 4 - Visitor browses and finds blog content (Priority: P3)

**Goal**: Readers browse, filter by tag, subscribe, and share posts with correct previews

**Independent Test**: With several posts published, locate one by browsing and by tag filter, and confirm a pasted post URL previews correctly on a social platform

- [X] T042 [P] [US4] Create `src/components/PostCard.astro`: title, publish date, summary, and tags for one index entry (FR-028)
- [X] T043 [P] [US4] Create `src/components/TagList.astro`: tag chips linking to `/tags/{tag}` (FR-029)
- [X] T044 [US4] Replace `src/pages/blog/index.astro` with `src/pages/blog/[...page].astro` using Astro's `paginate()` over `getPublishedPosts()`, rendering `PostCard`s newest-first with clear previous/next controls (FR-028)
- [X] T045 [US4] Create `src/pages/tags/[tag].astro`: `getStaticPaths` from `getAllTags()`, listing only that tag's published posts (FR-029)
- [X] T046 [US4] Add a purposeful empty state to the blog index for when no posts are published (FR-030)
- [X] T047 [P] [US4] Create `src/pages/rss.xml.ts` using `@astrojs/rss` over `getPublishedPosts()` — published posts only, never drafts (FR-033)
- [X] T048 [US4] Add Open Graph and Twitter Card tags to `src/layouts/PostLayout.astro`: `og:title`, `og:description`, `og:type=article`, `og:url`, and `og:image` falling back to `/og-default.png`. **All URLs absolute** — relative image paths produce no preview on most platforms (FR-032, SC-010)
- [X] T049 [P] [US4] Add `public/og-default.png` as the fallback social preview image
- [X] T050 [US4] Run the **User Story 4** section of [quickstart.md](./quickstart.md#user-story-4--visitor-browses-the-blog-p3) and record the outcome

**Checkpoint**: All four user stories independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Requirements spanning every page, plus the real content and delivery setup the site cannot ship without

- [X] T051 Run an accessibility audit (axe or Lighthouse) on every page type — landing, about, résumé, contact, blog index, post, tag, 404 — and fix until zero violations (SC-008)
- [X] T052 Verify every page at 320px, 768px, 1280px, and 1920px in both light and dark schemes: no layout breakage, no horizontal page scroll (SC-009)
- [X] T053 With scripting disabled, confirm landing, about, résumé, and post pages remain readable and the contact page still offers a usable way to reach the owner (FR-039)
- [X] T054 Measure primary-content readability within 3 seconds on throttled 4G, mid-range mobile profile; confirm content pages ship no client-side JavaScript (SC-007)
- [X] T055 [P] Audit every non-decorative image for meaningful alternative text (FR-041)
- [X] T056 Verify `/sitemap-index.xml` lists all public pages, excludes drafts, and that `robots.txt` blocks nothing public (FR-040, SC-012)
- [X] T057 [P] Write `README.md`: prerequisites (Node 22.12+), setup, the four commands, how to author and publish a post, and how to deploy
- [X] T058 Replace the placeholder in `src/data/profile.ts` with the owner's **real** résumé content — name, summary, experience, education, skills, focus areas, languages — plus real GitHub URL, LinkedIn URL, and email. Done from the owner's supplied résumé PDF (2026-08-24). Outstanding: real headshot photo (letter-mark SVG placeholder still in use), real formatted résumé PDF (a plain-text reconstruction is in place pending the actual file), and education end year (inferred, not stated on the source résumé — confirm)
- [ ] T059 Configure SPF and DKIM on the sending domain, then send test submissions to both a Gmail and an Outlook address and confirm inbox delivery. Without this, recruiter mail lands in spam and SC-003 fails despite correct code
- [X] T060 Run the complete [quickstart.md](./quickstart.md) pass end-to-end against the built output and record outcomes for every story before declaring the feature done

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — **blocks all user stories**
- **User Stories (Phases 3–6)**: All depend on Foundational; then parallelizable or sequential by priority
- **Polish (Phase 7)**: Depends on all desired stories being complete

### User Story Dependencies

- **US1 (P1)**: After Foundational. No dependency on other stories
- **US2 (P1)**: After Foundational. Independent of US1 — the contact page stands alone
- **US3 (P2)**: After Foundational. Independent of US1 and US2
- **US4 (P3)**: After Foundational. **Genuinely depends on US3** — pagination, tag pages, and the feed have nothing to list until posts and `src/lib/posts.ts` exist. This is the one real cross-story dependency; T044 also replaces the index file created in T039

### Within Each Story

- Library modules before the routes that consume them (T021–T023 before T025)
- Content schema before the pages that query it (T032, T034 before T038, T039)
- Layout before the pages using it (T037 before T038)
- Manual verification task last — it gates the story as done

### Parallel Opportunities

- Setup: T003, T004, T005, T006 together
- Foundational: T007, T008 together; then T010, T011 together after T009
- **US2's three library modules — T021, T022, T023 — are the largest parallel block**: separate files, no shared state
- US1: T014, T017, T018 together
- US4: T042, T043, T047, T049 together
- **Across stories**: with more than one person, US1, US2, and US3 can run fully in parallel once Phase 2 lands. US4 must wait for US3

---

## Parallel Example: User Story 2

```bash
# The three server-side modules — different files, no shared state:
Task: "Create src/lib/validate.ts — field validation returning a full error map"
Task: "Create src/lib/ratelimit.ts — in-memory per-IP window, 5/hour"
Task: "Create src/lib/mail.ts — Nodemailer SMTP, plain-text, From/Reply-To split"

# Then sequentially, all in src/pages/api/contact.ts: T025 → T026 → T027
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1: Setup
2. Phase 2: Foundational (blocks everything)
3. Phase 3: User Story 1
4. **STOP and VALIDATE** — run the US1 quickstart section
5. Deployable: a credible portfolio, minus contact and blog

### Recommended: both P1 stories before deploying

US1 and US2 are tied P1 in the spec for a reason — a portfolio that presents well but cannot be
replied to fails at its business purpose. Ship Phases 1–4 together as the real first release.

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. + US1 → validate → deployable MVP
3. + US2 → validate → **recommended first public release**
4. + US3 → validate → the owner can publish
5. + US4 → validate → discovery, subscription, and sharing
6. Polish → T058 and T059 before any public launch

---

## Notes

- **No test tasks anywhere** — Constitution III. The four verification tasks (T020, T031, T041, T050) plus T060 are manual passes against [quickstart.md](./quickstart.md), which the Development Workflow requires before a story is done. Do not report a story complete without running its pass
- Build-time guards (T032, T035, T036) plus `astro check` are the substitute for the safety net a test suite would give — treat a failing build as the feature working as designed
- `[P]` = different files, no dependencies
- Commit after each task or logical group; keep changes small enough to review by reading (Development Workflow)
- **T058 and T059 gate public launch**, not implementation. Everything else can be built and verified against placeholder content
