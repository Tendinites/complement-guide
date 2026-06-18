/**
 * Maillage interne automatique — Complément Guide
 *
 * Tourne en prebuild (voir package.json).
 * Injecte des liens internes dans les articles JSON vers :
 *   - les pages piliers compléments (/complement/xxx)
 *   - les pages piliers récupération (/articles/xxx pour les catégories recup)
 *   - les autres articles du site (/articles/xxx)
 *
 * ALGO FIABLE : on masque les zones protégées (balises <a>, titres, tableaux,
 * figures) avant injection → jamais de double-lien ou de lien dans un heading.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, '../src/data/articles');
const MAX_LINKS_PER_ARTICLE = 8;

// ── Pages piliers compléments ─────────────────────────────────────────────────
const PILLAR_COMPLEMENTS = [
  { expressions: ['oméga 3', 'oméga-3', 'EPA', 'DHA', 'huile de poisson', 'acides gras oméga', 'acides gras essentiels', 'inflammation chronique', 'anti-inflammatoire naturel', 'gestion de la douleur', 'douleurs inflammatoires'], url: '/complement/omega-3' },
  { expressions: ['magnésium', 'bisglycinate de magnésium', 'malate de magnésium', 'glycinate de magnésium', 'récupération musculaire', 'crampes musculaires', 'courbatures', 'fatigue musculaire', 'contraction musculaire', 'récupération active', 'flux sanguin', 'tension musculaire'], url: '/complement/magnesium' },
  { expressions: ['vitamine D', 'vitamine D3', 'cholécalciférol', 'carence en vitamine', 'système immunitaire', 'immunité'],                    url: '/complement/vitamine-d' },
  { expressions: ['collagène', 'collagène marin', 'collagène hydrolysé', 'collagène bovin', 'tendons et ligaments', 'cartilage', 'articulations'],                 url: '/complement/collagene' },
  { expressions: ['whey', 'whey protéine', 'protéine de lactosérum', 'protéine whey', 'synthèse protéique', 'protéines musculaires', 'apport en protéines'],       url: '/complement/whey' },
  { expressions: ['créatine', 'créatine monohydrate', 'monohydrate de créatine', 'force musculaire', 'performance sportive', 'puissance musculaire'],              url: '/complement/creatine' },
  { expressions: ['probiotiques', 'Lactobacillus', 'Bifidobacterium', 'microbiote intestinal', 'flore intestinale', 'santé intestinale'],                          url: '/complement/probiotiques' },
  { expressions: ['multivitamines', 'complexe vitaminé', 'complexe de vitamines', 'carences nutritionnelles', 'apports nutritionnels'],                            url: '/complement/multivitamines' },
  { expressions: ['ashwagandha', 'withania somnifera', 'KSM-66', 'withanolides', 'gestion du stress', 'cortisol', 'stress oxydatif', 'adaptogène'],               url: '/complement/ashwagandha' },
  { expressions: ['zinc', 'bisglycinate de zinc', 'gluconate de zinc', 'picolinate de zinc', 'cicatrisation', 'défenses immunitaires'],                            url: '/complement/zinc' },
  { expressions: ['fer', 'carence en fer', 'ferritine', 'hémoglobine', 'bisglycinate de fer', 'anémie', 'oxygénation musculaire'],                                url: '/complement/fer' },
];

// ── Pages piliers récupération ────────────────────────────────────────────────
const PILLAR_RECUP = [
  { expressions: ['pistolet de massage', 'pistolet massage', 'massage percussif', 'gun de massage'],        url: '/articles/pistolet-massage' },
  { expressions: ['bottes de compression', 'bottes de récupération', 'compression pneumatique', 'NormaTec'], url: '/articles/bottes-compression' },
  { expressions: ['bain froid', 'bain de glace', 'ice bath', 'immersion froide', 'cold plunge'],            url: '/articles/bain-froid' },
  { expressions: ['foam roller', 'rouleau de massage', 'rouleau mousse'],                                   url: '/articles/foam-roller' },
  { expressions: ['électrostimulation', 'EMS', 'électrostimulateur', 'Compex'],                             url: '/articles/electrostimulation' },
  { expressions: ['cryothérapie', 'cryothérapie corps entier', 'cabine de cryothérapie'],                   url: '/articles/cryotherapie' },
];

// ── Charge les articles ───────────────────────────────────────────────────────
let fileNames;
try {
  fileNames = readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.json'));
} catch {
  console.log('⚡ Maillage : dossier articles absent — skip.');
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

// ── Construit la LINK_MAP (ordre : longueur décroissante) ─────────────────────
const LINK_MAP = [];

for (const p of [...PILLAR_COMPLEMENTS, ...PILLAR_RECUP]) {
  for (const expr of p.expressions) {
    LINK_MAP.push({ expression: expr, url: p.url });
  }
}

// Ajoute les titres et premiers syntagmes des autres articles
for (const { data } of articles) {
  if (!data.slug || !data.titre) continue;
  LINK_MAP.push({ expression: data.titre, url: `/articles/${data.slug}` });
  // Syntagme court = 3 premiers mots si le titre est long
  const words = data.titre.replace(/[^a-zA-ZÀ-ÿ0-9 ]/g, '').trim().split(/\s+/);
  if (words.length >= 4) {
    LINK_MAP.push({ expression: words.slice(0, 4).join(' '), url: `/articles/${data.slug}` });
  }
}

// Trie par longueur décroissante (priorité aux expressions spécifiques)
LINK_MAP.sort((a, b) => b.expression.length - a.expression.length);

// ── Fonction d'injection fiable ───────────────────────────────────────────────
/**
 * Protège les zones où on NE DOIT PAS injecter de liens :
 *   - balises <a>…</a> déjà existantes
 *   - titres <h1>…<h6>
 *   - tableaux <table>…</table>
 *   - figures <figure>…</figure>
 *   - blocs <strong> dans les callouts (optionnel — on les laisse libres)
 * Puis injecte les liens dans le texte restant, 1 lien max par URL.
 */
function injectLinks(html, selfUrl) {
  const PLACEHOLDER = '\x00PZ';
  const protectedZones = [];

  // Masque les zones protégées
  let safe = html.replace(
    /(<a[\s\S]*?<\/a>|<h[1-6][\s\S]*?<\/h[1-6]>|<figure[\s\S]*?<\/figure>|<table[\s\S]*?<\/table>|<thead[\s\S]*?<\/thead>|<tbody[\s\S]*?<\/tbody>)/gi,
    (match) => {
      protectedZones.push(match);
      return `${PLACEHOLDER}${protectedZones.length - 1}\x00`;
    }
  );

  const usedUrls = new Set();
  let linksAdded = 0;

  for (const { expression, url } of LINK_MAP) {
    if (linksAdded >= MAX_LINKS_PER_ARTICLE) break;
    if (url === selfUrl) continue;
    if (usedUrls.has(url)) continue;

    const escaped = expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match le mot entier (ou expression), sensible à la casse uniquement sur les acronymes
    const isAcronym = expression === expression.toUpperCase() && expression.length <= 5;
    const flags = isAcronym ? 'g' : 'gi';
    const regex = new RegExp(`\\b(${escaped})\\b`, flags);

    // Vérifie qu'il y a une occurrence dans le texte libre
    if (regex.test(safe)) {
      // Remplace seulement la PREMIÈRE occurrence
      safe = safe.replace(
        new RegExp(`\\b(${escaped})\\b`, isAcronym ? '' : 'i'),
        `<a href="${url}">$1</a>`
      );
      usedUrls.add(url);
      linksAdded++;
    }
  }

  // Restaure les zones protégées
  safe = safe.replace(
    new RegExp(`${PLACEHOLDER}(\\d+)\x00`, 'g'),
    (_, i) => protectedZones[parseInt(i)]
  );

  return safe;
}

// ── Injection sur tous les articles ──────────────────────────────────────────
let modified = 0;

for (const { fn, data } of articles) {
  if (!data.contenu_html) continue;

  const selfUrl = `/articles/${data.slug}`;
  const newHtml = injectLinks(data.contenu_html, selfUrl);

  if (newHtml !== data.contenu_html) {
    data.contenu_html = newHtml;
    writeFileSync(join(ARTICLES_DIR, fn), JSON.stringify(data, null, 2), 'utf-8');
    modified++;
  }
}

console.log(`✅ Maillage interne : ${modified}/${articles.length} article(s) mis à jour.`);
