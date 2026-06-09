/**
 * Maillage interne automatique — Complément Guide
 *
 * Tourne en prebuild (voir package.json).
 * Injecte des liens internes dans les articles JSON depuis les titres des autres articles
 * et depuis les pages piliers (compléments).
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, '../src/data/articles');
const MAX_LINKS = 6;

// Pages piliers compléments
const PILLAR_LINKS = [
  { expressions: ['oméga 3', 'EPA', 'DHA', 'huile de poisson'], url: '/complement/omega-3' },
  { expressions: ['magnésium', 'bisglycinate de magnésium', 'malate de magnésium'], url: '/complement/magnesium' },
  { expressions: ['vitamine D', 'vitamine D3', 'cholécalciférol'], url: '/complement/vitamine-d' },
  { expressions: ['collagène', 'collagène marin', 'collagène hydrolysé'], url: '/complement/collagene' },
  { expressions: ['whey', 'protéine de lactosérum', 'whey protéine'], url: '/complement/whey' },
  { expressions: ['créatine', 'créatine monohydrate'], url: '/complement/creatine' },
  { expressions: ['probiotiques', 'lactobacillus', 'bifidobacterium', 'microbiote'], url: '/complement/probiotiques' },
  { expressions: ['multivitamines', 'complexe de vitamines'], url: '/complement/multivitamines' },
  { expressions: ['ashwagandha', 'withania somnifera', 'KSM-66', 'withanolides'], url: '/complement/ashwagandha' },
  { expressions: ['zinc', 'bisglycinate de zinc', 'gluconate de zinc'], url: '/complement/zinc' },
  { expressions: ['fer', 'bisglycinate de fer', 'carence en fer', 'ferritine'], url: '/complement/fer' },
];

// ─── Charge tous les articles JSON ───────────────────────────────────────────
let fileNames;
try {
  fileNames = readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
} catch {
  console.log('⚡ Maillage : dossier articles vide ou absent — skip.');
  process.exit(0);
}

if (fileNames.length === 0) {
  console.log('⚡ Maillage : aucun article JSON — skip.');
  process.exit(0);
}

const articles = fileNames.map(fn => {
  const raw = readFileSync(join(ARTICLES_DIR, fn), 'utf-8');
  return { fn, data: JSON.parse(raw) };
});

// ─── Construit la LINK_MAP ────────────────────────────────────────────────────
// Entrées : { expression: string, url: string }[]
// Priorité : les titres les plus longs en premier (pour éviter les sous-correspondances)
const LINK_MAP = [];

// 1. Pages piliers
for (const p of PILLAR_LINKS) {
  for (const expr of p.expressions) {
    LINK_MAP.push({ expression: expr, url: p.url });
  }
}

// 2. Titres des articles (première occurrence de chaque mot-clé)
for (const { data } of articles) {
  if (!data.slug || !data.titre) continue;
  // On utilise le titre complet comme expression à linker
  LINK_MAP.push({ expression: data.titre, url: `/articles/${data.slug}` });
  // On extrait aussi le premier syntagme nominal significatif (heuristique simple)
  const words = data.titre.split(' ');
  if (words.length >= 3) {
    const short = words.slice(0, 5).join(' ');
    if (short !== data.titre) {
      LINK_MAP.push({ expression: short, url: `/articles/${data.slug}` });
    }
  }
}

// Trie par longueur décroissante (match le plus long en premier)
LINK_MAP.sort((a, b) => b.expression.length - a.expression.length);

// ─── Injection ────────────────────────────────────────────────────────────────
let modified = 0;

for (const { fn, data } of articles) {
  if (!data.contenu_html) continue;

  let html = data.contenu_html;
  const usedUrls = new Set();
  const selfUrl = `/articles/${data.slug}`;
  let linksAdded = 0;

  for (const { expression, url } of LINK_MAP) {
    if (linksAdded >= MAX_LINKS) break;
    if (url === selfUrl) continue;
    if (usedUrls.has(url)) continue;

    // Regex : première occurrence hors balise <a> existante
    const escaped = expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<!<a[^>]*>|href="[^"]*")\\b(${escaped})\\b`, 'i');

    if (regex.test(html) && !html.includes(`href="${url}"`)) {
      html = html.replace(regex, `<a href="${url}">$1</a>`);
      usedUrls.add(url);
      linksAdded++;
    }
  }

  if (html !== data.contenu_html) {
    data.contenu_html = html;
    writeFileSync(join(ARTICLES_DIR, fn), JSON.stringify(data, null, 2), 'utf-8');
    modified++;
  }
}

console.log(`✅ Maillage interne : ${modified} article(s) mis à jour sur ${articles.length}.`);
