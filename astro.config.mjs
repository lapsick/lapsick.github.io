import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lapsick.github.io',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    sitemap({
      // /contact is server-rendered and never produces a static file, so it
      // must not appear in the sitemap even though the route still exists —
      // otherwise crawlers get handed a link that 404s.
      filter: (page) => !page.includes('/contact'),
    }),
  ],
  devToolbar: { enabled: false },
});
