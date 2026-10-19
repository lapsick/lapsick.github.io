# Portfolio

A static personal portfolio and blog for a Software Engineer and Architect. Contact submissions
are handled by Formspree. Built with [Astro](https://astro.build).

See [AGENTS.md](AGENTS.md) for current development guidance. The documents in
[specs/001-portfolio-blog-site/](specs/001-portfolio-blog-site/) record the original design;
Spec Kit tooling has been removed. The project stays static, uses Node.js build tooling,
and has no application database or automated test suite.

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

Blog posts are Markdown files — there is no admin interface, login, or application database.

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

## Private visitor analytics

Optional [GoatCounter](https://www.goatcounter.com/) integration lets you see traffic in
its hosted dashboard. No visitor data is stored by this application.

1. Create a hosted GoatCounter account and register your production site domain.
2. Copy the collection endpoint from its integration settings into `.env`:

   ```dotenv
   PUBLIC_GOATCOUNTER_ENDPOINT=https://your-account.goatcounter.com/count
   ```

   Use your actual endpoint. This URL is public; do not use an API key or dashboard access token.
3. In GoatCounter's settings, set **Dashboard viewable by** to logged-in users. Leave
   public visitor counters disabled. Check that a signed-out browser cannot read statistics.
4. For GitHub Pages, add `PUBLIC_GOATCOUNTER_ENDPOINT` under repository **Settings →
   Secrets and variables → Actions → Variables**. Rebuild and deploy to activate it.
5. Sign in at `https://your-account.goatcounter.com` to see traffic and select a date range.

Collection runs on pages using the shared layout, only in production builds and when
the browser hostname matches `site` in `astro.config.mjs`. Keep that URL accurate if you
change domains. Development, localhost and previews on other hostnames do not count.
Blank or malformed endpoints disable collection. A valid endpoint uses the hosted
`https://<account>.goatcounter.com/count` format. Self-hosted endpoints are not supported
by this integration. Blocking the collector leaves the site usable.

Counts start after activation; historical visits cannot be recovered. GoatCounter's
session-based measurements are estimates, not exact lifetime counts of distinct people.
Reloads and visits to different pages follow its session rules. Disabled JavaScript,
blockers and network failures can suppress visits. See the provider's
[integration guide](https://www.goatcounter.com/help/start),
[session rules](https://www.goatcounter.com/help/sessions) and
[dashboard visibility guidance](https://www.goatcounter.com/help/frame).

Manual verification: confirm blank and malformed configuration emit no collector;
confirm development emits none even with a configured endpoint. Build with a configured
endpoint and preview locally: the hostname guard must prevent external requests. After
deployment, visit the production home page and a blog post with analytics unblocked,
check the browser Network panel for collection requests and confirm dashboard updates.
Repeat with the collector blocked and verify navigation and contact remain usable.
Live collection and private dashboard access require the owner's activated account and
a deployment; local build checks alone do not verify them.

## Deployment

```powershell
npm run check
npm run build
```

Publish `dist/` to static hosting, including GitHub Pages. No Node server or SMTP secrets are
needed in production. Supply `PUBLIC_FORMSPREE_ENDPOINT` and, optionally,
`PUBLIC_GOATCOUNTER_ENDPOINT` during the build. A failed deployment
must leave the previously published site intact.

## Architecture note

The Formspree migration supersedes the original SMTP/contact-endpoint design in the initial
feature documents. The application stores no submissions and has no runtime endpoints. The
original specification and plan remain as historical design records. No test framework or test
suite is included; changes are verified manually and with Astro's checks and production build.
