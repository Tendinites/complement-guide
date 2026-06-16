// =============================================================================
// ROBOT D'AUTO-PUBLICATION — Complément Guide
// =============================================================================
// Cette route serverless est déclenchée par le cron Vercel.
//
// Chaque exécution :
//   1. Choisit le complément et le sujet du jour (rotation intelligente)
//   2. Demande à Claude un article complet (HTML structuré, style EDP Nutrition)
//   3. Push le fichier JSON sur GitHub via Octokit
//   4. Le push déclenche un rebuild Vercel automatique
//
// Protection : header Authorization: Bearer CRON_SECRET
// Test manuel : ?manual=true&secret=CRON_SECRET
// =============================================================================

import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { Octokit } from '@octokit/rest';
import { allTopics } from '../../data/topics';
import { articles as publishedArticles } from '../../data/articles';

export const prerender = false;
export const maxDuration = 60;

const GITHUB_OWNER  = 'Tendinites';
const GITHUB_REPO   = 'complement-guide';
const GITHUB_BRANCH = 'main';

// Marque partenaire (backlinks discrets) — à configurer via env variable
const PARTNER_BRAND = import.meta.env.PARTNER_BRAND ?? 'JOLT Recovery';
const PARTNER_URL   = import.meta.env.PARTNER_URL   ?? 'https://getjolt.fr';
const PARTNER_DESC  = import.meta.env.PARTNER_DESC  ?? "spécialiste des appareils de récupération sportive";

// Pool de sources nutrition — variété SEO inter-articles
const NUTRITION_SOURCES_POOL = [
  { url: 'https://www.anses.fr',             label: 'ANSES — Agence nationale de sécurité sanitaire' },
  { url: 'https://www.has-sante.fr',         label: 'Haute Autorité de Santé (HAS)' },
  { url: 'https://www.inserm.fr',            label: 'Inserm — Institut national de la recherche médicale' },
  { url: 'https://www.efsa.europa.eu',       label: 'EFSA — Autorité européenne de sécurité des aliments' },
  { url: 'https://pubmed.ncbi.nlm.nih.gov',  label: 'PubMed — Base de données biomédicale internationale' },
  { url: 'https://www.ncbi.nlm.nih.gov',     label: 'NCBI — National Center for Biotechnology Information' },
  { url: 'https://www.who.int/fr',           label: 'OMS — Organisation mondiale de la santé' },
  { url: 'https://www.santepubliquefrance.fr', label: 'Santé Publique France' },
  { url: 'https://www.vidal.fr',             label: 'Vidal — Référence médicamenteuse française' },
  { url: 'https://www.nutraceutique-soc.fr', label: 'Société Française de Nutraceutique' },
];

function pickRandomSources(n = 6) {
  const arr = [...NUTRITION_SOURCES_POOL];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
}

// Slugify simple
function slugify(str: string): string {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Sélectionne le prochain topic non encore publié
async function pickTopic(existingSlugs: string[]) {
  // Filtre les topics déjà couverts (slug approximatif)
  const available = allTopics.filter(t => {
    const guessSlug = slugify(t.titre).slice(0, 40);
    return !existingSlugs.some(s => s.includes(t.complement) && s.includes(guessSlug.slice(0, 20)));
  });

  if (available.length === 0) {
    // Tous les topics ont été couverts — recommence depuis le début
    return allTopics[Math.floor(Math.random() * allTopics.length)];
  }

  // Préfère les compléments les moins couverts
  const countByComplement: Record<string, number> = {};
  for (const s of existingSlugs) {
    const parts = s.split('-');
    if (parts.length > 0) {
      countByComplement[parts[0]] = (countByComplement[parts[0]] ?? 0) + 1;
    }
  }

  available.sort((a, b) =>
    (countByComplement[a.complement] ?? 0) - (countByComplement[b.complement] ?? 0)
  );

  return available[0];
}

async function getExistingSlugs(): Promise<string[]> {
  try {
    const octokit = new Octokit({ auth: import.meta.env.GITHUB_TOKEN });
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER, repo: GITHUB_REPO, path: 'src/data/articles', ref: GITHUB_BRANCH,
    });
    if (!Array.isArray(data)) return [];
    return data.filter(f => f.type === 'file' && f.name.endsWith('.json')).map(f => f.name.replace(/\.json$/, ''));
  } catch {
    return [];
  }
}

export const GET: APIRoute = async ({ request }) => {
  // Auth
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const isManual = url.searchParams.get('manual') === 'true';
  const manualSecret = url.searchParams.get('secret');
  const secret = import.meta.env.CRON_SECRET;

  if (authHeader !== `Bearer ${secret}` && !(isManual && manualSecret === secret)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const dateISO = new Date().toISOString().split('T')[0];
    const existingSlugs = await getExistingSlugs();
    const topic = await pickTopic(existingSlugs);
    const slug = `${topic.complement}-${slugify(topic.titre).slice(0, 45)}`;

    console.log(`🎯 Topic : ${topic.titre} (${topic.complement}) → ${slug}`);

    const article = await generateArticle(topic, slug, dateISO);
    console.log(`📝 Article généré : ${article.titre}`);

    await pushToGitHub(article);
    console.log(`🚀 Push GitHub réussi`);

    return new Response(JSON.stringify({ success: true, slug, titre: article.titre }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Erreur :', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GÉNÉRATION (Claude)
// ─────────────────────────────────────────────────────────────────────────────

// Compléments récupération sportive (seuls à pouvoir mentionner JOLT)
const RECOVERY_COMPLEMENTS = new Set([
  'pistolet-massage', 'bottes-compression', 'foam-roller',
  'electrostimulation', 'cryotherapie', 'bain-froid',
]);

async function generateArticle(
  topic: typeof allTopics[number],
  finalSlug: string,
  dateISO: string,
) {
  const anthropic = new Anthropic({ apiKey: import.meta.env.ANTHROPIC_API_KEY });
  const todaysSources = pickRandomSources(4);

  const isRecovery = RECOVERY_COMPLEMENTS.has(topic.complement);
  const isComparatif = topic.type === 'comparatif';

  // Bloc partenaire — uniquement pour les articles récupération
  const partnerBlock = isRecovery
    ? `MENTION PARTENAIRE (règle stricte) :
- Insère EXACTEMENT 1 mention discrète et naturelle de "${PARTNER_BRAND}" (${PARTNER_DESC}) dans le corps du texte.
- Format : un lien <a href="${PARTNER_URL}" target="_blank" rel="noopener sponsored">${PARTNER_BRAND}</a> intégré naturellement dans une phrase.
- La mention doit paraître 100% éditoriale. Jamais dans la section produits.`
    : `MENTION PARTENAIRE : aucune — cet article porte sur des compléments alimentaires, pas sur des équipements de récupération. N'insère aucun lien partenaire.`;

  // Template produits pour les comparatifs (même format que les articles manuels)
  const productsTableTemplate = isComparatif ? `
SECTION 2 — "2. Quels sont les meilleurs [X] en 2026 ?" — tableau produits OBLIGATOIRE :
Utilise EXACTEMENT ce HTML (3 produits minimum) :

<div style='overflow-x:auto;margin:1.5rem 0'>
<table class='cg-products-table'>
  <thead><tr><th>#</th><th>Produit</th><th>Note</th><th>Prix/mois</th><th>Points forts</th><th>Limite</th><th>Pour qui</th></tr></thead>
  <tbody>
    <tr class='cg-products-table__top'>
      <td><span class='cg-num cg-num--1'>1</span></td>
      <td><strong>Nom produit</strong><br/><span class='cg-tag'>Notre choix</span></td>
      <td><span class='cg-stars'>★★★★★</span></td>
      <td><strong>~XX€</strong></td>
      <td>Point fort 1 · Point fort 2 · Point fort 3</td>
      <td>Limite principale</td>
      <td>Profil idéal</td>
    </tr>
    <tr>
      <td><span class='cg-num cg-num--2'>2</span></td>
      <td><strong>Nom produit 2</strong></td>
      <td><span class='cg-stars'>★★★★<span class='cg-star-empty'>★</span></span></td>
      <td>~XX€</td>
      <td>Points forts</td>
      <td>Limite</td>
      <td>Pour qui</td>
    </tr>
    <tr>
      <td><span class='cg-num cg-num--2'>3</span></td>
      <td><strong>Nom produit 3</strong></td>
      <td><span class='cg-stars'>★★★★<span class='cg-star-empty'>★</span></span></td>
      <td>~XX€</td>
      <td>Points forts</td>
      <td>Limite</td>
      <td>Pour qui</td>
    </tr>
  </tbody>
</table>
</div>` : `
SECTION 2 — "2. [Question spécifique liée au sujet]" — PAS de tableau produits (article conseil).
À la place : explication approfondie du mécanisme, données scientifiques, études citées.
Un seul tableau si nécessaire pour comparer des données (ex: résultats d'études, valeurs normales).
Inclure un lien interne vers l'article comparatif principal : <a href="/articles/${topic.complement}-comparatif">notre comparatif des meilleurs ${topic.complement.replace(/-/g, ' ')}</a> si pertinent.`;

  const prompt = `Tu es rédacteur expert en nutrition et compléments alimentaires pour Complément Guide, un blog éditorial indépendant français. Ton ton est pédagogique, honnête, basé sur la science — jamais de survente.

SUJET : ${topic.titre}
INTENTION DE RECHERCHE : Le lecteur a tapé "${topic.intentionRecherche}" sur Google. Ton article doit être LA meilleure réponse à cette question.
COMPLÉMENT : ${topic.complement}
TYPE : ${topic.type === 'comparatif' ? 'COMPARATIF' : 'CONSEIL / GUIDE PRATIQUE'}
${topic.objectif ? `OBJECTIF SANTÉ : ${topic.objectif}` : ''}

════════════════════════════════════════
STRUCTURE OBLIGATOIRE (respecte l'ordre exact)
════════════════════════════════════════

1. VERDICT RAPIDE — en tout premier, avant tout autre contenu :
<div class='verdict-rapide'>
  <div class='verdict-rapide__header'>
    <span class='verdict-rapide__icon'>✓</span>
    <span class='verdict-rapide__label'>[Thème] : notre verdict</span>
  </div>
  <p class='verdict-rapide__top'>Réponse directe en 1 phrase (ex: "Notre choix : <strong>Produit X</strong> — ★★★★★ — ~XX€/mois")</p>
  <p class='verdict-rapide__text'>2-3 phrases : la réponse essentielle, les chiffres clés, ce qu'il faut retenir. Concis et actionnable.</p>
</div>

2. H2 "1. Qu'est-ce que [X] ?" — définition + image + 1 seul tableau
- Image : <figure style='margin:1.5rem 0;border-radius:12px;overflow:hidden'><img src='URL_UNSPLASH_OU_PEXELS' alt='description' style='width:100%;display:block' loading='lazy'/></figure>
- Paragraphes d'introduction (contexte, chiffres épidémio, pourquoi c'est important)
- Callout retenir : <div class='callout-retenir'><strong>À retenir</strong> — ...</div>
- 1 tableau HTML (inline styles, pas de classes CSS custom) qui répond à UNE SEULE question :
  "Quelles sont les formes/variantes/mécanismes ?" OU "Quels sont les signes/niveaux ?" — JAMAIS les dosages ici
  Style du tableau : <table style='width:100%;border-collapse:collapse;font-size:.88rem'>
  Header : <thead><tr style='background:#1E293B;color:#fff'>
  Lignes alternées : alternez style='background:#F8FAFC' et rien

${productsTableTemplate}

3. H2 "3. Comment utiliser [X] ?" — pratique + 1 seul tableau dosage/timing
- Image différente de la section 1
- 1 tableau qui répond UNIQUEMENT à "Quelle dose / quel timing / quelle durée ?"
  Colonnes possibles : Objectif | Dose | Quand prendre | Durée — PAS de colonne "Forme" (déjà dans S1)
- Callout conseil : <div class='callout-conseil'><strong>💡 Conseils pratiques</strong> — ...</div>

4. FAQ — 3 à 4 questions/réponses ciblées sur l'intention de recherche :
<h2>FAQ</h2>
<details><summary>Question ?</summary><p>Réponse complète.</p></details>

════════════════════════════════════════
RÈGLES TABLEAUX (CRITIQUE)
════════════════════════════════════════
- MAXIMUM 3 tableaux dans tout l'article (S1 + produits + S3)
- Chaque tableau répond à UNE seule question distincte
- Aucune colonne ne doit apparaître dans 2 tableaux différents
- Pas de tableau dans la FAQ ni dans le verdict

════════════════════════════════════════
RÈGLES ÉDITORIALES
════════════════════════════════════════
- Cite au moins 2 études ou sources ("selon l'ANSES", "une méta-analyse de 2023 publiée dans Nutrients montre...", "l'EFSA fixe...")
- Longueur : 1 200 à 1 800 mots
- Jamais de code promo, jamais de lien mort (href="#"), jamais de CTA vers des URLs inexistantes
- Liens internes uniquement vers /articles/ ou /complement/ — pas de liens externes sauf sources
- Ton affirmatif : "Le bisglycinate est la forme la mieux absorbée" pas "pourrait être"

${partnerBlock}

SOURCES — juste avant la FAQ :
<h2>Sources</h2>
<ul class='sources'>
${todaysSources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener nofollow">${s.label}</a></li>`).join('\n')}
</ul>

════════════════════════════════════════
RÉPONSE : uniquement JSON valide, pas de markdown, pas de backticks
════════════════════════════════════════
{
  "titre": "string (55-75 caractères, reprend le mot-clé exact de l'intention)",
  "extrait": "string (150-170 caractères, meta description qui répond directement à la question)",
  "duree": "string (ex: '6 min')",
  "contenu_html": "string HTML complet — les guillemets internes doivent être échappés"
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 10000,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find(b => b.type === 'text') as { type: 'text'; text: string } | undefined;
  if (!textBlock) throw new Error('Réponse Claude vide');

  let parsed: any;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    const match = textBlock.text.match(/```(?:json)?\s*([\s\S]+?)\s*```/s);
    if (match) parsed = JSON.parse(match[1]);
    else throw new Error(`JSON invalide : ${textBlock.text.slice(0, 300)}`);
  }

  return {
    slug: finalSlug,
    titre: parsed.titre,
    extrait: parsed.extrait,
    complement: topic.complement,
    objectif: topic.objectif ?? '',
    type: topic.type,
    duree: parsed.duree,
    date: dateISO,
    updated: dateISO,
    contenu_html: parsed.contenu_html,
    // JOLT uniquement pour les équipements de récupération
    marque_produit: isRecovery ? PARTNER_BRAND : '',
    marque_lien:    isRecovery ? PARTNER_URL   : '',
    marque_description: isRecovery ? PARTNER_DESC : '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PUSH GITHUB
// ─────────────────────────────────────────────────────────────────────────────
async function pushToGitHub(article: any) {
  const octokit = new Octokit({ auth: import.meta.env.GITHUB_TOKEN });
  const articlePath = `src/data/articles/${article.slug}.json`;

  const { data: ref } = await octokit.git.getRef({ owner: GITHUB_OWNER, repo: GITHUB_REPO, ref: `heads/${GITHUB_BRANCH}` });
  const baseSha = ref.object.sha;

  const { data: baseCommit } = await octokit.git.getCommit({ owner: GITHUB_OWNER, repo: GITHUB_REPO, commit_sha: baseSha });

  const blob = await octokit.git.createBlob({
    owner: GITHUB_OWNER, repo: GITHUB_REPO,
    content: JSON.stringify(article, null, 2),
    encoding: 'utf-8',
  });

  const { data: tree } = await octokit.git.createTree({
    owner: GITHUB_OWNER, repo: GITHUB_REPO,
    base_tree: baseCommit.tree.sha,
    tree: [{ path: articlePath, mode: '100644', type: 'blob', sha: blob.data.sha }],
  });

  const { data: newCommit } = await octokit.git.createCommit({
    owner: GITHUB_OWNER, repo: GITHUB_REPO,
    message: `🤖 Article auto : ${article.titre}`,
    tree: tree.sha,
    parents: [baseSha],
  });

  await octokit.git.updateRef({ owner: GITHUB_OWNER, repo: GITHUB_REPO, ref: `heads/${GITHUB_BRANCH}`, sha: newCommit.sha });

  return newCommit.sha;
}
