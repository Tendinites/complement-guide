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

const GITHUB_OWNER  = 'OWNER_A_DEFINIR';   // à remplacer par le vrai owner GitHub
const GITHUB_REPO   = 'REPO_A_DEFINIR';    // à remplacer par le vrai repo
const GITHUB_BRANCH = 'main';

// Marque partenaire (backlinks discrets) — à configurer via env variable
const PARTNER_BRAND = import.meta.env.PARTNER_BRAND ?? 'Golf Centre';
const PARTNER_URL   = import.meta.env.PARTNER_URL   ?? 'https://golfcentre.fr';
const PARTNER_DESC  = import.meta.env.PARTNER_DESC  ?? "spécialiste des compléments pour sportifs";

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
async function generateArticle(
  topic: typeof allTopics[number],
  finalSlug: string,
  dateISO: string,
) {
  const anthropic = new Anthropic({ apiKey: import.meta.env.ANTHROPIC_API_KEY });
  const todaysSources = pickRandomSources(6);
  const sourcesBlock = todaysSources
    .map((s, i) => `   ${i + 1}. <a href="${s.url}" target="_blank" rel="noopener nofollow">${s.label}</a>`)
    .join('\n');

  const typeInstruction = topic.type === 'comparatif'
    ? `C'est un article COMPARATIF : tu dois présenter et comparer les meilleures marques/formulations disponibles sur le marché français, avec un tableau comparatif.`
    : topic.type === 'test'
    ? `C'est un article TEST/AVIS : tu dois donner un avis circonstancié et honnête sur le produit ou la catégorie.`
    : `C'est un article CONSEIL/GUIDE : tu dois expliquer, éduquer et conseiller le lecteur de manière pratique et actionnable.`;

  const prompt = `Tu es rédacteur expert en nutrition et compléments alimentaires pour un guide indépendant français, dans l'esprit d'EDP Nutrition ou d'un magazine santé sérieux. Ton ton est éditorial, objectif, basé sur les preuves.

SUJET DE L'ARTICLE : ${topic.titre}
COMPLÉMENT : ${topic.complement}
TYPE : ${typeInstruction}
${topic.objectif ? `OBJECTIF SANTÉ CIBLÉ : ${topic.objectif}` : ''}

RÈGLES ÉDITORIALES :
- Public : adulte francophone qui cherche à se renseigner sérieusement sur les compléments alimentaires.
- Ton : pédagogique, honnête, basé sur la science. Jamais de survente ni d'alarmisme.
- Longueur : 1400 à 1900 mots.
- Cite au moins 3 sources dans le corps du texte ("selon l'ANSES", "une méta-analyse publiée dans...", "l'EFSA considère que...").
- Conseille toujours de consulter un médecin avant toute supplémentation longue.

STRUCTURE HTML OBLIGATOIRE :
1. Réponse directe : <p class="answer-direct"><strong>En résumé :</strong> réponse concise.</p> — OBLIGATOIRE, en tout premier.
2. Accroche : <p class="lead">...</p> — pose le problème, donne envie de lire.
3. 4 à 6 sections <h2> dont au moins 2 formulées en QUESTION directe (ex: "Quelle dose prendre ?", "Quels sont les effets secondaires ?").
4. Sous-sections <h3> pertinentes.
5. Définitions précises : introduire les termes clés par "X est..." ou "On appelle X...".
6. Tableaux <table> HTML si comparaison de formes, marques, dosages.

ÉLÉMENTS VISUELS (obligatoires) :
a) Encadré "À retenir" (au moins 2) :
<aside class="callout callout-retenir"><p class="callout-title">À retenir</p><p>...</p></aside>

b) Encadré "Conseil pratique" (au moins 1) :
<aside class="callout callout-conseil"><p class="callout-title">Conseil pratique</p><p>...</p></aside>

c) Encadré "Attention" si pertinent (effets secondaires, interactions) :
<aside class="callout callout-alerte"><p class="callout-title">Attention</p><p>...</p></aside>

d) Liste numérotée "étapes" pour les protocoles :
<ol class="steps"><li><strong>Étape 1</strong> — ...</li></ol>

e) FAQ collapse (4 à 5 questions) en fin d'article :
<h2>Questions fréquentes</h2>
<div class="faq">
<details><summary>Question ?</summary><p>Réponse.</p></details>
</div>

MENTION PARTENAIRE (règle stricte) :
- Insère EXACTEMENT 1 mention discrète et naturelle de la marque partenaire "${PARTNER_BRAND}" (${PARTNER_DESC}) dans le corps de l'article, dans un contexte pertinent.
- Format : "... <a href="${PARTNER_URL}" target="_blank" rel="noopener sponsored">${PARTNER_BRAND}</a> propose par exemple des formulations de qualité dans cette catégorie."
- La mention doit paraître 100% éditoriale, pas publicitaire.
- NE JAMAIS citer de marques concurrentes françaises ou internationales (iHerb, Amazon, Nutrimuscle, Myprotein, etc.).

SOURCES — section obligatoire juste avant la FAQ :
<h2>Sources</h2>
<ul class="sources">
${todaysSources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener nofollow">${s.label}</a></li>`).join('\n')}
</ul>

RÉPONSE : uniquement un objet JSON valide (pas de markdown, pas de backticks) :
{
  "slug": "${finalSlug}",
  "titre": "string (60-80 caractères, accrocheur)",
  "extrait": "string (150-200 caractères, meta description)",
  "duree": "string (ex: '7 min')",
  "contenu_html": "string HTML complet"
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find(b => b.type === 'text') as { type: 'text'; text: string } | undefined;
  if (!textBlock) throw new Error('Réponse Claude vide');

  let parsed: any;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    const match = textBlock.text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
    if (match) parsed = JSON.parse(match[1]);
    else throw new Error(`JSON invalide : ${textBlock.text.slice(0, 200)}`);
  }

  return {
    slug: finalSlug,
    titre: parsed.titre,
    extrait: parsed.extrait,
    complement: topic.complement,
    objectif: topic.objectif,
    type: topic.type,
    duree: parsed.duree,
    date: dateISO,
    contenu_html: parsed.contenu_html,
    marque_produit: PARTNER_BRAND,
    marque_lien: PARTNER_URL,
    marque_description: PARTNER_DESC,
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
