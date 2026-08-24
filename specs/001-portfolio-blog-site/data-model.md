# Phase 1 Data Model: Personal Portfolio Site with Blog

**Feature**: 001-portfolio-blog-site | **Date**: 2026-08-24

There is **no database** (Constitution II). "Entities" here are file-backed content shapes resolved
at build time, plus one transient in-memory shape. Field-level schema definitions live in
[contracts/content-schemas.md](./contracts/content-schemas.md).

| Entity | Lives in | Lifetime |
|---|---|---|
| Blog Post | `src/content/blog/*.md` | Committed; resolved at build |
| Tag | Derived from post frontmatter | Build only — never stored |
| Profile | `src/data/profile.ts` | Committed |
| Experience Entry | `src/data/profile.ts` | Committed |
| Education / Certification Entry | `src/data/profile.ts` | Committed |
| Contact Submission | Request body → email | Milliseconds; never persisted |
| Rate-limit Counter | Process memory | Until window expiry or restart |

---

## Blog Post

One Markdown file per post. Frontmatter is Zod-validated at build; a violation fails the build and
names the file (FR-025 edge case).

| Field | Type | Required | Rules |
|---|---|---|---|
| `title` | string | yes | 1–120 chars |
| `slug` | string | yes | Lowercase, `a-z0-9-`, unique across the collection. Explicit, **not** derived from filename (FR-026, SC-011) |
| `summary` | string | yes | 1–300 chars. Used on the index and as the social preview description (FR-032) |
| `publishDate` | date | yes | ISO `YYYY-MM-DD`. Sort key for the index, newest first (FR-028) |
| `updatedDate` | date | no | Must be ≥ `publishDate` if present |
| `tags` | string[] | yes | 0–8 entries; each lowercase `a-z0-9-`. Empty array allowed |
| `coverImage` | string | no | Path under `public/`. Falls back to `og-default.png` (FR-032) |
| `coverImageAlt` | string | conditional | **Required when `coverImage` is set** (FR-041) |
| `draft` | boolean | no | Defaults `false`. When `true`, the post is excluded from the build entirely (FR-025) |

**Body**: Markdown supporting headings, lists, links, inline code, fenced code blocks, and images
(FR-020). Fenced blocks are highlighted by Shiki and wrapped in an `overflow-x: auto` container
(FR-027).

**Derived at build time, never hand-maintained** (FR-026): the paginated index, per-tag pages, the
RSS feed, and the sitemap.

**Validation rules**
- Duplicate `slug` across two posts → build fails. Prevents the spec's duplicate-title edge case
  from silently overwriting a post.
- `draft: true` → post is filtered out of every collection query, so no page, no feed entry, no
  sitemap entry, and no URL to guess is generated.
- A referenced `coverImage` that does not exist under `public/` → build fails.

**State transitions**: `draft: true` → `draft: false` → deployed = published. Unpublishing reverses
it. There is no runtime state — a post's visibility is decided entirely at build time.

---

## Profile

Exactly one, in `src/data/profile.ts`. Sourced manually from LinkedIn (R6).

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | FR-001 |
| `title` | string | yes | "Software Engineer and Architect" (FR-001) |
| `summary` | string | yes | Short, hero-length positioning statement |
| `about` | string | yes | Longer-form introduction shown on the About page |
| `photo` | string | no | Path under `public/`; needs alt text (FR-041) |
| `email` | string | yes | Public fallback address shown on delivery failure (FR-014) |
| `githubUrl` | string | yes | FR-003 |
| `linkedinUrl` | string | yes | FR-004 |
| `location` | string | no | |
| `skills` | string[] | yes | ≥3 entries, so SC-001 is satisfiable; curated subset for the hero/chip display |
| `skillCategories` | SkillCategory[] | yes | Full categorized technical skill set (e.g. "Backend", "Cloud"), About/résumé pages |
| `focusAreas` | FocusArea[] | yes | Core-competency statements, About page |
| `languages` | Language[] | yes | Spoken languages with proficiency level |
| `resumePdf` | string | no | Path to `public/resume.pdf` (FR-008) |

Relationships: Profile has many Experience Entries, many Education Entries, many Skill Categories,
many Focus Areas, and many Languages — all embedded arrays on the Profile module, not separate files.

---

## Experience Entry

| Field | Type | Required | Rules |
|---|---|---|---|
| `company` | string | yes | |
| `role` | string | yes | |
| `startDate` | string | yes | `YYYY-MM` |
| `endDate` | string \| `"present"` | yes | `YYYY-MM` or the literal `present` |
| `location` | string | no | |
| `highlights` | string[] | yes | ≥1 responsibility or achievement |
| `technologies` | string[] | no | |

Ordered newest first on the about page. `endDate` must be ≥ `startDate` unless `"present"`.

---

## Education / Certification Entry

| Field | Type | Required | Rules |
|---|---|---|---|
| `institution` | string | yes | Institution or issuing body |
| `qualification` | string | yes | Degree or certification name |
| `startDate` | string | no | `YYYY` or `YYYY-MM` |
| `endDate` | string | yes | `YYYY` or `YYYY-MM` |
| `credentialUrl` | string | no | |

---

## Contact Submission

Transient. Exists only inside one request: parsed, validated, emailed, discarded. **Never written to
disk or memory beyond the request** (Constitution II). Wire format in
[contracts/contact-api.md](./contracts/contact-api.md).

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | string | yes | 1–100 chars after trim |
| `email` | string | yes | Well-formed address, ≤254 chars (FR-010) |
| `company` | string | no | ≤100 chars (FR-009) |
| `message` | string | yes | 1–5000 chars (FR-018) |
| `_hp` | string | no | Honeypot — **must be empty**; any value ⇒ silent rejection (FR-015) |
| `_t` | number | yes | Form render timestamp; submission faster than 3s ⇒ rejection (FR-015) |

Derived, not submitted: `submittedAt` (server time, FR-012) and `clientIp` (rate limiting only,
never emailed or stored).

**Validation is server-side and authoritative.** Client-side validation is a convenience only — the
endpoint revalidates everything, because FR-039 requires the form to work without scripting.

**Sanitisation (FR-017)**: the email is composed as `text/plain`. Submitted content is never
interpolated into HTML, so injected markup cannot render or execute in the owner's mail client.
Header-injection characters (CR/LF) are stripped from `name` and `email` before they reach any
header field.

---

## Rate-limit Counter

In-memory only, in `src/lib/ratelimit.ts`.

| Field | Type | Notes |
|---|---|---|
| key | string | Client IP |
| count | number | Submissions in the current window |
| windowStart | number | Epoch ms |

Policy: **5 submissions per IP per hour** (FR-016). Exceeding it returns HTTP 429 with an
explanatory message. Entries expire on read; a periodic sweep prevents unbounded growth.

Accepted limitations (R4): counters are per-process and reset on restart. Not persisted — deliberately,
per Constitution II.
