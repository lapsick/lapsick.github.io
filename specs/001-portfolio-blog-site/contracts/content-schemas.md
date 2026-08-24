# Contract: Content Schemas

**Feature**: 001-portfolio-blog-site | **Date**: 2026-08-24

The authoring contract the owner writes against (FR-021). Field semantics and validation rationale
are in [data-model.md](../data-model.md); this file is the concrete shape.

---

## Blog collection — `src/content.config.ts`

Astro 6 specifics: config lives at **`src/content.config.ts`** (not the Astro 4 `src/content/config.ts`
path), Zod comes from **`astro/zod`** (the `z` re-export from `astro:content` is deprecated), and the
loader is explicit.

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1).max(120),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    summary: z.string().min(1).max(300),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).max(8).default([]),
    coverImage: z.string().optional(),
    coverImageAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }).refine(
    (d) => !d.coverImage || !!d.coverImageAlt,
    { message: 'coverImageAlt is required when coverImage is set', path: ['coverImageAlt'] },
  ).refine(
    (d) => !d.updatedDate || d.updatedDate >= d.publishDate,
    { message: 'updatedDate must not precede publishDate', path: ['updatedDate'] },
  ),
});

export const collections = { blog };
```

Two rules the schema cannot express, enforced in build code instead:

- **Unique `slug` across the collection** — fail the build listing the colliding files.
- **`coverImage` resolves to a real file under `public/`** — fail the build naming the missing path.

### Authoring example — `src/content/blog/hexagonal-boundaries.md`

```markdown
---
title: Where to Draw the Boundary in Hexagonal Architecture
slug: hexagonal-boundaries
summary: Ports and adapters fail when the boundary follows the org chart instead of the domain.
publishDate: 2026-08-20
tags: [architecture, dotnet]
coverImage: /images/hexagonal.png
coverImageAlt: Diagram of a domain core surrounded by adapter rings
draft: false
---

## The mistake

Body in Markdown — headings, lists, links, `inline code`, fenced blocks, images.
```

### Draft handling (FR-025)

Every query filters drafts, so a draft generates **no page, no feed entry, no sitemap entry** — it is
absent from the build output, not merely hidden:

```ts
const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
```

This single filtered query is the source for the index, tag pages, RSS, and sitemap — which is what
makes FR-026 (no hand-maintained listings) structurally true rather than a discipline.

---

## Profile data — `src/data/profile.ts`

Plain typed TypeScript. No runtime validation needed: `astro check` catches a malformed entry at
build time, which is the substitute for the test suite Constitution III forbids (R8).

```ts
export interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string;              // YYYY-MM
  endDate: string | 'present';    // YYYY-MM | 'present'
  location?: string;
  highlights: string[];           // at least one
  technologies?: string[];
}

export interface EducationEntry {
  institution: string;
  qualification: string;
  startDate?: string;             // YYYY | YYYY-MM
  endDate: string;
  credentialUrl?: string;
}

export interface FocusArea {
  title: string;
  description: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Language {
  name: string;
  level: string;
}

export interface Profile {
  name: string;
  title: string;
  summary: string;                // short, hero-length
  about: string;                  // longer-form, About page intro
  photo?: string;
  photoAlt?: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  location?: string;
  skills: string[];               // at least three, so SC-001 is satisfiable; curated for hero chips
  skillCategories: SkillCategory[]; // full categorized skill set, About page
  focusAreas: FocusArea[];        // core competencies, About page
  languages: Language[];
  resumePdf?: string;
  experience: ExperienceEntry[];  // newest first
  education: EducationEntry[];
}

export const profile: Profile = { /* transcribed from the owner's résumé/LinkedIn — see research.md R6 */ };
```

`about`, `skillCategories`, `focusAreas`, and `languages` were added during implementation to
capture the full structure of the owner's real résumé (categorized technical skills, a "core
competencies" value proposition, and spoken languages) rather than flattening it into `summary` and
`skills` alone. All four are optional in spirit but typed as required arrays/strings — pass empty
arrays or an empty string if a future owner's source material doesn't have an equivalent section;
the pages that render them already guard on `.length > 0`.

**Blocking input**: real values for `name`, `about`, `githubUrl`, `linkedinUrl`, `email`,
`experience`, and `education` must come from the owner. Implementation may proceed against
placeholders; the site must not ship on them.

---

## Derived outputs

All generated from the filtered post query — never hand-written (FR-026).

| Output | Route | Requirement |
|---|---|---|
| Paginated index, newest first | `/blog`, `/blog/2`, … | FR-028 |
| Post page | `/blog/{slug}` | FR-026 |
| Tag page | `/tags/{tag}` | FR-029 |
| RSS feed | `/rss.xml` | FR-033 |
| Sitemap | `/sitemap-index.xml` | FR-040 |

### Social preview metadata (FR-032)

Each post page emits Open Graph and Twitter Card tags: `og:title` ← `title`, `og:description` ←
`summary`, `og:image` ← `coverImage` or `/og-default.png`, `og:type` = `article`, `og:url` ←
absolute canonical URL. **Absolute URLs are mandatory** — relative image paths produce no preview on
most platforms, which would fail SC-010.
