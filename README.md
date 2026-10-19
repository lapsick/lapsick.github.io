# Portfolio

A static personal portfolio and blog for a Software Engineer and Architect. Contact submissions
are handled by Formspree. Built with [Astro](https://astro.build).

See [specs/001-portfolio-blog-site/](specs/001-portfolio-blog-site/) for the full specification,
architecture plan, and task list this project was built from, and
[.specify/memory/constitution.md](.specify/memory/constitution.md) for the project's non-negotiable
constraints (Node.js only, no database, no automated tests, static by default).

## Prerequisites

- **Node.js 22.12.0 or newer** (Astro 6's minimum). Check with `node -v`.
- A Formspree account and form endpoint, if you want the contact form enabled.

## Setup

```powershell
npm install
Copy-Item .env.example .env
# Set PUBLIC_FORMSPREE_ENDPOINT to your Formspree form endpoint.
```

Create a form at https://formspree.io, verify your destination inbox, and copy the
`https://formspree.io/f/<form-id>` endpoint from its Integration tab into `.env`:

```dotenv
PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

Use your actual endpoint, not the example above. The endpoint is public and is not an API key.
Restart the dev server after changing `.env`. For deployment, set the same variable in your
build environment and rebuild: the endpoint is embedded into the static Contact page at build time.
Without an endpoint, Contact shows direct email and LinkedIn links instead of a broken form.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server at `http://localhost:4321` |
| `npm run check` | Type-check and content schema validation |
| `npm run build` | Generate the static site in `dist/` |
| `npm run preview` / `npm start` | Preview the generated site locally |

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

## Contact delivery

The Contact page posts directly to Formspree; there is no `/api/contact` backend and no SMTP
configuration. JavaScript adds pending state and trimmed field validation. The native form posts
to Formspree's hosted response page, where CAPTCHA challenges and confirmation are handled.
The same submission flow works without JavaScript.
An always-visible email link offers a fallback if delivery fails.

Spam filtering and submission limits are handled by Formspree. The form includes its `_gotcha`
honeypot. Configure additional spam protection in your Formspree dashboard.
Submissions are processed and may be stored by Formspree; the page includes its privacy policy.

Manual verification: check required fields and invalid email handling; confirm the endpoint in the
rendered form; send a message to your own configured form, confirm Formspree's confirmation page
and inbox receipt, and verify replies address the visitor. Check the browser Back button restores
the form for retry after a delivery error.
Live delivery can only be verified with an activated form and verified destination inbox.

## Deployment

```powershell
npm run check
npm run build
```

Publish `dist/` to static hosting, including GitHub Pages. No Node server or SMTP secrets are
needed in production. Supply `PUBLIC_FORMSPREE_ENDPOINT` during the build. A failed deployment
must leave the previously published site intact.

## Architecture note

The Formspree migration supersedes the original SMTP/contact-endpoint design in the initial
feature documents. The application stores no submissions and has no runtime endpoints. The
original specification and plan remain as historical design records. No test framework or test
suite is included; changes are verified manually and with Astro's checks and production build.
