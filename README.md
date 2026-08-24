# Portfolio

A static personal portfolio and blog for a Software Engineer and Architect, with one dynamic
feature: a contact form that emails submissions to the owner. Built with [Astro](https://astro.build).

See [specs/001-portfolio-blog-site/](specs/001-portfolio-blog-site/) for the full specification,
architecture plan, and task list this project was built from, and
[.specify/memory/constitution.md](.specify/memory/constitution.md) for the project's non-negotiable
constraints (Node.js only, no database, no automated tests, static by default).

## Prerequisites

- **Node.js 22.12.0 or newer** (Astro 6's minimum). Check with `node -v`.
- An SMTP account (any provider) and a `From` mailbox on a domain you control, with SPF/DKIM
  configured — see [Email delivery](#email-delivery) below.

## Setup

```powershell
npm install
Copy-Item .env.example .env
# then edit .env with real SMTP credentials and addresses
```

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server at `http://localhost:4321` |
| `npm run check` | Type-check + content schema validation (`astro check`) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built output via Astro's preview server |
| `npm start` | Run the built standalone Node server directly |

The standalone server does **not** auto-load `.env` — Node 22+ supports loading it natively:

```powershell
node --env-file=.env dist/server/entry.mjs
```

For any other host or process manager, provide the variables in `.env.example` as real environment
variables however that platform expects (shell export, systemd `EnvironmentFile`, a platform's
secrets/env UI, etc).

## Writing and publishing a blog post

Blog posts are Markdown files — there is no admin interface, login, or database (Constitution II
and IV; see [specs/001-portfolio-blog-site/research.md](specs/001-portfolio-blog-site/research.md)
R5 for why).

1. Add a new file under `src/content/blog/`, e.g. `src/content/blog/my-new-post.md`.
2. Give it frontmatter matching the schema in `src/content.config.ts`:

   ```markdown
   ---
   title: My New Post
   slug: my-new-post
   summary: One or two sentences shown on the index and in link previews.
   publishDate: 2026-09-01
   tags: [architecture]
   draft: false
   ---

   Post body in Markdown — headings, lists, links, `inline code`, fenced code blocks, and images
   are all supported.
   ```

3. Run `npm run dev` and preview the post locally before publishing.
4. Set `draft: false` (or omit `draft` — it defaults to `false`) and deploy. The post appears on the
   blog index, its tag page(s), the RSS feed, and the sitemap automatically — none of those are
   hand-maintained.
5. To unpublish, set `draft: true` and deploy again, or delete the file.

A malformed post (missing required frontmatter, a duplicate `slug`, or a `coverImage` that doesn't
exist under `public/`) fails the build with a message naming the file — see
`src/lib/posts.ts` and `src/content.config.ts`.

## Updating the profile

Edit `src/data/profile.ts` directly — it's plain TypeScript, validated by `npm run check`.

> **The committed `profile.ts` currently holds placeholder content**, not the real owner's LinkedIn
> profile. Replace `name`, `title`, `summary`, `email`, `githubUrl`, `linkedinUrl`, `skills`,
> `experience`, and `education` before deploying — see the specification's Assumptions section on
> why this is manual rather than a live LinkedIn integration.

## Email delivery

The contact form (`src/pages/contact.astro` + `src/pages/api/contact.ts`) sends mail via
[Nodemailer](https://nodemailer.com) over SMTP. Two things that are easy to get wrong:

- **`SMTP_FROM` must be a mailbox on a domain you control**, never the visitor's address — putting
  their address in `From` is sender spoofing and gets rejected or spam-filed by DMARC. The visitor's
  address goes in `Reply-To` instead, which is what makes "Reply" in your mail client address them.
- **Configure SPF and DKIM** for the sending domain before relying on this in production, then send
  a real test message to both a Gmail and an Outlook address to confirm it lands in the inbox, not
  spam.

## Deployment

Build and run one Node process; nothing else is required:

```powershell
npm run build
node --env-file=.env dist/server/entry.mjs
```

If a deploy fails partway, the previously deployed `dist/` must remain in place and serving — don't
replace it until the new build has succeeded end-to-end (see the constitution's Development
Workflow).

## What's deliberately absent

Per the project constitution: no test framework or test suite (verification is the manual pass in
[specs/001-portfolio-blog-site/quickstart.md](specs/001-portfolio-blog-site/quickstart.md)), no
database, no runtime other than Node.js, and no page or endpoint beyond the contact flow that
executes at request time — every other page is prerendered static HTML.
