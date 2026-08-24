import { getCollection, type CollectionEntry } from 'astro:content';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export type Post = CollectionEntry<'blog'>;

let cachedPosts: Post[] | undefined;

/**
 * The single source every blog listing derives from: the index, tag pages,
 * the RSS feed, and the sitemap all call this and nothing else, so none of
 * them is ever hand-maintained (FR-026). Drafts are filtered out here, which
 * means a draft generates no page, no feed entry, and no sitemap entry — it
 * is absent from the build output, not merely hidden (FR-025).
 */
export async function getPublishedPosts(): Promise<Post[]> {
  if (cachedPosts) return cachedPosts;

  const all = await getCollection('blog', ({ data }) => !data.draft);

  assertUniqueSlugs(all);
  assertCoverImagesExist(all);

  cachedPosts = all.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );
  return cachedPosts;
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) tags.add(tag);
  }
  return [...tags].sort();
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.data.tags.includes(tag));
}

function assertUniqueSlugs(posts: Post[]): void {
  const bySlug = new Map<string, string[]>();
  for (const post of posts) {
    const files = bySlug.get(post.data.slug) ?? [];
    files.push(post.id);
    bySlug.set(post.data.slug, files);
  }

  const duplicates = [...bySlug.entries()].filter(([, files]) => files.length > 1);
  if (duplicates.length > 0) {
    const detail = duplicates
      .map(([slug, files]) => `  slug "${slug}" used by: ${files.join(', ')}`)
      .join('\n');
    throw new Error(`Duplicate blog post slug(s) found:\n${detail}`);
  }
}

function assertCoverImagesExist(posts: Post[]): void {
  const missing: string[] = [];
  for (const post of posts) {
    const coverImage = post.data.coverImage;
    if (!coverImage) continue;
    // process.cwd() rather than an import.meta.url-relative path: this module
    // gets bundled into a different directory at build time, which would
    // otherwise silently break the relative path.
    const publicPath = join(process.cwd(), 'public', coverImage);
    if (!existsSync(publicPath)) {
      missing.push(`  ${post.id}: coverImage "${coverImage}" not found under public/`);
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing blog post cover image(s):\n${missing.join('\n')}`);
  }
}
