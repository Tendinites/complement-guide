// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://monsite.fr', // à remplacer par le vrai domaine

  adapter: vercel(),

  integrations: [
    sitemap({
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR' } },
      filter: (page) => !page.includes('/api/') && !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url.endsWith('/')) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (item.url.includes('/articles/')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/complement/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        }
        return item;
      },
    }),
  ],
});
