// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, 'src/data/articles');

// Slug → date réelle de l'article (updated ou date de publication)
const articleDates = {};
try {
  for (const f of readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'))) {
    const data = JSON.parse(readFileSync(join(ARTICLES_DIR, f), 'utf-8'));
    if (data.slug) articleDates[data.slug] = new Date(data.updated ?? data.date);
  }
} catch {}

export default defineConfig({
  site: 'https://monsite.fr', // à remplacer par le vrai domaine

  adapter: vercel(),

  integrations: [
    sitemap({
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-FR' } },
      filter: (page) => !page.includes('/api/') && !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        // Lastmod article-spécifique pour éviter le recrawl inutile à chaque build
        const slugMatch = item.url.match(/\/articles\/([^/]+?)\/?$/);
        if (slugMatch?.[1] && articleDates[slugMatch[1]]) {
          item.lastmod = articleDates[slugMatch[1]];
        }

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
