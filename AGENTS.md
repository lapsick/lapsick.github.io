# AGENTS.md

Guidance for coding agents working in this repository.

## Project

This is an implemented personal portfolio and blog built with Astro 6 and TypeScript.
It is a Git repository. Pages are generated as static assets and deployed to GitHub Pages.
Contact submissions go directly to Formspree; there is no application backend.

The Spec Kit skills and tooling have been removed. Work directly in the existing codebase.
Do not require slash commands, feature numbering, feature state files, or generated specs,
plans and task lists before making changes. Existing `specs/` documents are historical
context; the current implementation and these instructions guide new work.

## Structure

- `src/pages/`: Astro routes, including the blog, tag pages, contact page and RSS feed.
- `src/layouts/`: Shared page markup and metadata in `BaseLayout.astro`; blog layout in `PostLayout.astro`.
- `src/components/`: Reusable Astro components, including navigation and the contact form.
- `src/styles/global.css`: Shared styling.
- `src/data/profile.ts`: Profile, experience and contact information.
- `src/content/blog/`: Markdown blog posts.
- `src/content.config.ts`: Blog frontmatter schema.
- `src/lib/posts.ts`: Published-post loading and validation.
- `public/`: Static assets copied into the build.
- `astro.config.mjs`: Static output, canonical site URL and sitemap integration.
- `.github/workflows/deploy-pages.yml`: Build and GitHub Pages deployment.
- `README.md`: Setup, content authoring and deployment instructions.

Do not edit generated `dist/`, `.astro/` or installed `node_modules/` files.

## Development

Use Node.js 22.12.0 or newer and npm. The local shell is PowerShell.

```powershell
npm install
npm run dev       # Local development at http://localhost:4321
npm run check     # Astro/TypeScript and content checks
npm run build     # Generate dist/
npm run preview   # Preview the production build
```

For code changes, run `npm run check` and `npm run build`, then manually verify the
changed behavior in a local preview. Record what was verified and any external behavior
that still needs an account, credentials or a deployment. Documentation-only changes
need a content and diff review rather than a build.

## Implementation principles

- Keep the site static and compatible with GitHub Pages. Use Node.js for application
  build tooling and any future server-side code; do not introduce a server or runtime
  endpoint without an explicit requirement.
- Do not add an application database or persist runtime visitor/contact state in the
  application. Hosted integrations may manage their own data; document their setup.
- Do not add automated test suites, runners or testing dependencies. Use the existing
  checks, production build and manual verification.
- Prefer small, readable changes and existing Astro components over new abstractions
  or packages. Justify new dependencies with a current requirement.
- Preserve accessible navigation, semantic markup, responsive layouts and usable
  fallbacks when optional services or browser JavaScript are unavailable.
- Keep secrets in environment variables and out of committed files. Variables prefixed
  `PUBLIC_` are exposed to browsers and must never contain secrets.
- Document new configuration in `.env.example` and `README.md`. Build-time settings
  used in production must also be wired into the deployment workflow.
- Preserve unrelated local changes. Do not deploy or push unless the user requests it.

## Content and integrations

Blog posts are authored as Markdown with frontmatter matching `src/content.config.ts`.
Draft posts must stay out of published listings, feeds and generated pages. The build
validates required fields, duplicate slugs and cover images; keep that validation intact.

Contact uses `PUBLIC_FORMSPREE_ENDPOINT`. Without it, the page shows direct email and
LinkedIn links. Keep the native form submission and non-JavaScript fallback working.
Formspree handles delivery and spam filtering. Live delivery requires an activated form
and a verified destination inbox; do not claim it was verified from a local build.

Static deployment publishes `dist/`. Keep build and deploy stages separate so a failed
build leaves the previously published site intact.
