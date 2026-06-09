// =============================================================================
// ROBOT DE MISE À JOUR ÉDITORIALE — Complément Guide
// =============================================================================
// Déclenché par le cron Vercel tous les mardis à 10h17.
// Prend l'article le plus ancien et demande à Claude de le rafraîchir
// (nouvelles études, mise à jour du contenu, ajout d'une FAQ si absente).
// =============================================================================

import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { Octokit } from '@octokit/rest';

export const prerender = false;
export const maxDuration = 60;

const GITHUB_OWNER  = 'OWNER_A_DEFINIR';
const GITHUB_REPO   = 'REPO_A_DEFINIR';
const GITHUB_BRANCH = 'main';

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const isManual = url.searchParams.get('manual') === 'true';
  const manualSecret = url.searchParams.get('secret');
  const secret = import.meta.env.CRON_SECRET;

  if (authHeader !== `Bearer ${secret}` && !(isManual && manualSecret === secret)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const octokit = new Octokit({ auth: import.meta.env.GITHUB_TOKEN });

    // Récupère la liste des articles
    const { data: files } = await octokit.repos.getContent({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      path: 'src/data/articles', ref: GITHUB_BRANCH,
    });

    if (!Array.isArray(files) || files.length === 0) {
      return new Response(JSON.stringify({ message: 'Aucun article à mettre à jour.' }), { status: 200 });
    }

    // Charge les articles et trouve le plus vieux sans updated récent
    const jsonFiles = files.filter(f => f.type === 'file' && f.name.endsWith('.json'));

    let oldestFile = jsonFiles[0];
    let oldestArticle: any = null;
    let oldestDate = '9999-99-99';

    for (const file of jsonFiles) {
      const { data: content } = await octokit.repos.getContent({
        owner: GITHUB_OWNER, repo: GITHUB_REPO,
        path: `src/data/articles/${file.name}`, ref: GITHUB_BRANCH,
      });
      if (!('content' in content)) continue;
      const article = JSON.parse(Buffer.from(content.content, 'base64').toString());
      const sortDate = article.updated ?? article.date ?? '0000-00-00';
      if (sortDate < oldestDate) {
        oldestDate = sortDate;
        oldestFile = file;
        oldestArticle = article;
      }
    }

    if (!oldestArticle) {
      return new Response(JSON.stringify({ message: 'Impossible de lire les articles.' }), { status: 500 });
    }

    console.log(`🔄 Refresh : ${oldestArticle.slug} (dernière update : ${oldestDate})`);

    // Rafraîchissement via Claude
    const anthropic = new Anthropic({ apiKey: import.meta.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `Tu es rédacteur expert en nutrition pour un guide indépendant de compléments alimentaires.

Voici un article existant à rafraîchir :
Titre : ${oldestArticle.titre}
Extrait : ${oldestArticle.extrait}
Contenu HTML actuel :
${oldestArticle.contenu_html ?? '(vide)'}

Ta mission :
1. Mettre à jour l'introduction avec des données 2026 si pertinent.
2. Vérifier/améliorer les conseils (dosages, formes, recommandations).
3. Ajouter une section FAQ collapse si absente (4-5 questions), avec balises <details>/<summary>.
4. Ajouter un encadré "À retenir" si aucun n'est présent.
5. Améliorer la lisibilité générale (phrases plus courtes, meilleur aérage).
6. NE PAS changer le titre ni l'extrait.

Réponds uniquement avec le HTML mis à jour du contenu (champ contenu_html uniquement), sans markdown, sans backticks, sans JSON wrapper.`,
      }],
    });

    const textBlock = response.content.find(b => b.type === 'text') as { type: 'text'; text: string } | undefined;
    if (!textBlock) throw new Error('Réponse Claude vide');

    // Mise à jour de l'article
    const updatedArticle = {
      ...oldestArticle,
      contenu_html: textBlock.text.trim(),
      updated: new Date().toISOString().split('T')[0],
    };

    // Push
    const { data: currentFile } = await octokit.repos.getContent({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      path: `src/data/articles/${oldestFile.name}`, ref: GITHUB_BRANCH,
    });

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER, repo: GITHUB_REPO,
      path: `src/data/articles/${oldestFile.name}`,
      message: `🔄 Refresh éditorial : ${oldestArticle.titre}`,
      content: Buffer.from(JSON.stringify(updatedArticle, null, 2)).toString('base64'),
      sha: 'sha' in currentFile ? currentFile.sha : '',
      branch: GITHUB_BRANCH,
    });

    return new Response(JSON.stringify({ success: true, slug: oldestArticle.slug, updated: updatedArticle.updated }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Refresh error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
