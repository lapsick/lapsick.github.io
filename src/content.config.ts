import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  // generateId is pinned to the file path, not the frontmatter `slug`. The
  // glob loader's default behavior derives its internal id from `slug` when
  // present, which means two posts sharing a slug silently collapse into one
  // entry at the loader level (last file wins, only a warning) before our own
  // duplicate-slug check in src/lib/posts.ts ever runs. Keying id on the file
  // path instead guarantees every post is a distinct entry, so a real slug
  // collision surfaces as our own build-failing error naming both files.
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z
    .object({
      title: z.string().min(1).max(120),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      summary: z.string().min(1).max(300),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z
        .array(z.string().regex(/^[a-z0-9-]+$/))
        .max(8)
        .default([]),
      coverImage: z.string().optional(),
      coverImageAlt: z.string().optional(),
      draft: z.boolean().default(false),
    })
    .refine((d) => !d.coverImage || !!d.coverImageAlt, {
      message: 'coverImageAlt is required when coverImage is set',
      path: ['coverImageAlt'],
    })
    .refine((d) => !d.updatedDate || d.updatedDate >= d.publishDate, {
      message: 'updatedDate must not precede publishDate',
      path: ['updatedDate'],
    }),
});

export const collections = { blog };
