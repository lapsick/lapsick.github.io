# Quickstart & Validation Guide

**Feature**: 001-portfolio-blog-site | **Date**: 2026-08-24

Constitution III forbids automated tests, and the Development Workflow requires every user story to
be **manually verified against its acceptance scenarios before it counts as done**. This file is
that verification pass. Record the outcome; unverified work must not be reported as complete.

---

## Prerequisites

- **Node.js 22.12.0 or newer** — Astro 6 minimum; Node 18 and 20 will not work. Check with `node -v`.
- An SMTP account (any provider) and a `From` mailbox on a domain the owner controls.

## Setup

```powershell
npm install
Copy-Item .env.example .env    # then fill in real values
```

`.env` (never committed — see [contracts/contact-api.md](./contracts/contact-api.md#configuration)):

```text
SMTP_HOST=…
SMTP_PORT=587
SMTP_USER=…
SMTP_PASS=…
SMTP_FROM="Portfolio Contact <noreply@your-domain>"
CONTACT_TO_EMAIL=you@your-domain
PUBLIC_FALLBACK_EMAIL=you@your-domain
```

## Commands

```powershell
npm run dev      # local preview at http://localhost:4321 (FR-023 — preview before deploy)
npm run check    # astro check — TypeScript + content schema validation
npm run build    # production build; fails loudly on a malformed post
npm run preview  # serve the built output exactly as deployed
npm start        # run the built Node standalone server
```

---

## Build-time gates

These fail the build, so they need no manual step — confirm each fails as intended once, then trust it.

| Gate | Provoke it by | Expected |
|---|---|---|
| Frontmatter schema | Remove `title` from a post | Build fails naming the file and field |
| Duplicate slug | Give two posts the same `slug` | Build fails listing both files |
| Missing cover image | Point `coverImage` at a nonexistent file | Build fails naming the path |
| Alt text required | Set `coverImage` without `coverImageAlt` | Build fails |
| Type errors | Malform a `profile.ts` entry | `npm run check` reports it |

---

## Manual acceptance pass

Run against `npm run preview` (built output), not the dev server. Tick each; note failures against
the requirement ID.

### User Story 1 — Recruiter evaluates background (P1)

- [ ] Landing page shows name, "Software Engineer and Architect", summary, and nav to about, blog, contact (FR-001)
- [ ] About page shows roles with companies and dates, achievements, skills, education (FR-002)
- [ ] GitHub link opens the profile in a new tab, site stays open (FR-003); LinkedIn link present (FR-004)
- [ ] Résumé reachable as a page and/or PDF download (FR-008)
- [ ] At 320px width: readable, no horizontal page scroll (FR-034, SC-009)
- [ ] Tab through the page: every control reachable, visible focus ring (FR-035)

### User Story 2 — Recruiter makes contact (P1)

- [ ] Valid submission → on-screen success **and** email arrives in the destination inbox (FR-011, FR-013)
- [ ] Reply to that email addresses the **sender**, not the site (FR-012) ← the single most commonly broken behaviour
- [ ] Email body contains name, email, company, message, timestamp (FR-012)
- [ ] Submit with bad email and empty message → both errors shown, entered input preserved (FR-010)
- [ ] Message over 5000 chars → rejected with a stated limit (FR-018)
- [ ] Break `SMTP_HOST` deliberately → failure notice shows the fallback address, content preserved (FR-014)
- [ ] Fill the honeypot via devtools → apparent success, **no email arrives** (FR-015)
- [ ] Submit 6 times in an hour → 6th returns the rate-limit message (FR-016)
- [ ] Submit `<script>alert(1)</script>` → arrives as inert plain text in the email (FR-017)
- [ ] Privacy note visible on the contact page (FR-019)
- [ ] **Disable JavaScript** → form still submits and confirms (FR-039) ← easy to regress

### User Story 3 — Owner publishes a post (P2)

- [ ] Author a post file, `npm run dev`, see it rendered as visitors will (FR-023)
- [ ] Build and preview → post on the index at its own `/blog/{slug}` URL (FR-022, FR-026)
- [ ] Set `draft: true`, rebuild → post absent from index **and** its URL 404s. Grep `dist/` for the draft's title: **zero matches** (FR-025)
- [ ] Post renders headings, lists, links, inline code, images; code blocks highlighted and scrolling inside their own box, page does not scroll sideways (FR-020, FR-027)
- [ ] Probe the running site for `/admin`, `/login`, `/api/posts` → nothing exists (FR-022, SC-006)
- [ ] Add a post and rebuild → index, tag pages, `/rss.xml`, sitemap all include it with no hand-editing (FR-026)

### User Story 4 — Visitor browses the blog (P3)

- [ ] Index lists posts newest first with title, date, summary, tags (FR-028)
- [ ] Tag page lists only that tag's posts (FR-029)
- [ ] With zero published posts → purposeful empty state, not a broken page (FR-030)
- [ ] Past the first page of posts → older posts reachable (FR-028)
- [ ] View source on a post: `og:title`, `og:description`, `og:image` present with **absolute** URLs (FR-032)
- [ ] `/blog/does-not-exist` → branded 404 with navigation back (FR-007)
- [ ] `/rss.xml` is valid and lists published posts only (FR-033)

### Cross-cutting

- [ ] OS dark mode → legible palette; contrast passes AA in **both** schemes (FR-036, FR-037, SC-008)
- [ ] Reduced-motion enabled → non-essential animation suppressed (FR-038)
- [ ] Lighthouse/axe accessibility: zero violations on every page type (SC-008)
- [ ] All non-decorative images have meaningful alt text (FR-041)
- [ ] Every page has a distinct title and description; `/sitemap-index.xml` lists all public pages (FR-040)
- [ ] Layout intact at 320, 768, 1280, 1920px (SC-009)
- [ ] Content readable within 3s on throttled 4G (SC-007)

---

## Pre-deploy checklist

1. `npm run check` clean, `npm run build` clean.
2. Manual pass above completed for every story touched by the change.
3. No secrets in the repository; `.env` gitignored.
4. `profile.ts` holds **real** LinkedIn content, not placeholders.
5. `From` domain has SPF/DKIM configured, or recruiter mail will land in spam (SC-003).
6. Deploy. If it fails, the previously deployed site must remain serving (Development Workflow).

---

## Known gaps this guide cannot cover

- **Visual regressions** on pages you did not touch. Nothing catches them — keep changes small and
  preview before every deploy.
- **Real-world deliverability**. A local success proves the code path, not that mail reaches a
  corporate recruiter's inbox. Send a test to a Gmail *and* an Outlook address before launch.
