import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lapsick.github.io',
  output: 'static',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
});
