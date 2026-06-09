# CLAUDE.md — Complément Guide
> Lis ce fichier en entier avant de toucher quoi que ce soit sur ce projet.

---

## Le projet en une phrase

**[DOMAINE À DÉFINIR]** est un blog éditorial indépendant sur les compléments alimentaires, généré en grande partie par IA, qui sert aussi de vecteur de backlinks discrets vers **[MARQUE PARTENAIRE À DÉFINIR]**.

---

## Infos essentielles

- **Propriétaire** : Lucas Simon Turcan
- **Repo GitHub** : À définir (GITHUB_OWNER / GITHUB_REPO dans `generate-article.ts`)
- **URL prod** : À définir (changer `monsite.fr` dans `astro.config.mjs` et `layouts/Layout.astro`)
- **Stack** : Astro + @astrojs/vercel + @astrojs/sitemap + @vercel/analytics
- **Deploy** : Vercel (push sur `main` → rebuild automatique)
- **Chemin local** : `/Users/lucassimon/Desktop/edp-clone/`

---

## Architecture du site

```
src/
  pages/
    index.astro                  → Homepage (hero + objectifs + compléments + articles)
    articles/
      index.astro                → Liste articles groupés par complément
      [slug].astro               → Page article individuelle avec sidebar
    complement/
      [slug].astro               → Pages piliers par complément (11 compléments)
    comparatifs.astro            → Liste des comparatifs
    conseils.astro               → Liste des conseils
    tests.astro                  → Liste des tests & avis
    qui-sommes-nous.astro
    methodologie.astro           → À créer si besoin
    mentions-legales.astro
    confidentialite.astro
    api/
      generate-article.ts        → Robot de publication (cron Vercel)
      refresh-article.ts         → Robot de mise à jour éditoriale (cron Vercel)
  data/
    articles/                    → 1 fichier JSON par article
    articles.ts                  → Types + compléments[] + objectifs[]
    topics.ts                    → Sujets disponibles par complément
  components/
    Header.astro
    Footer.astro
  layouts/
    Layout.astro
  styles/
    global.css
scripts/
  maillage-interne.mjs          → Injection automatique des liens internes (prebuild)
vercel.json                     → Crons Vercel
```

---

## Données articles (JSON)

Chaque article est `src/data/articles/{slug}.json` :

```json
{
  "slug": "omega-3-meilleure-dose",
  "titre": "Titre de l'article",
  "extrait": "Meta description (150-200 chars)",
  "complement": "omega-3",
  "objectif": "Bien vieillir",
  "type": "comparatif",
  "duree": "7 min",
  "date": "2026-06-09",
  "updated": "2026-06-15",
  "canonical": "/articles/autre-slug",
  "contenu_html": "<p>...</p>",
  "marque_produit": "Nom marque partenaire",
  "marque_lien": "https://...",
  "marque_description": "Description courte"
}
```

Les 11 compléments : `omega-3`, `magnesium`, `vitamine-d`, `collagene`, `whey`, `creatine`, `probiotiques`, `multivitamines`, `ashwagandha`, `zinc`, `fer`

Les 4 types d'articles : `comparatif`, `conseil`, `test`, `code-promo`

---

## Robots automatiques (Crons Vercel)

| Cron | Schedule | Rôle |
|------|----------|------|
| `/api/generate-article` | `23 7 * * 1,3,5,0` | Publie un nouvel article (lun/mer/ven/dim à 7h23) |
| `/api/refresh-article` | `17 10 * * 2` | Met à jour l'article le plus vieux (mardi à 10h17) |

**Variables d'environnement Vercel à configurer :**
- `CRON_SECRET` — protège les routes API
- `ANTHROPIC_API_KEY` — pour la génération Claude
- `GITHUB_TOKEN` — pour push GitHub
- `PARTNER_BRAND` — nom de la marque partenaire (ex: "Golf Centre")
- `PARTNER_URL` — URL de la marque partenaire
- `PARTNER_DESC` — description courte (ex: "spécialiste des compléments sportifs")

**Test manuel :**
```
https://monsite.fr/api/generate-article?manual=true&secret=VALEUR_CRON_SECRET
https://monsite.fr/api/refresh-article?manual=true&secret=VALEUR_CRON_SECRET
```

---

## Design system (EDP Nutrition)

| Token | Valeur |
|-------|--------|
| Fond | `#F9FAFB` |
| Texte | `#333333` |
| Bleu (liens) | `#3B82F6` |
| Orange (boutons CTA) | `#FF7043` |
| Bordures | `#E5E7EB` |
| Font heading | Montserrat |
| Font body | Roboto |

- Border-radius cartes : `16px`
- Border-radius boutons : `8px`
- Max-width : `1140px`
- Boutons CTA : fond orange `#FF7043`, hover `#F7835F`
- Liens : bleu `#3B82F6`, hover orange `#FF7043`

---

## Discrétion marque partenaire (règle absolue)

- **AUCUNE mention de la marque partenaire** dans : header, footer, qui-sommes-nous, JSON-LD Organization, pages compléments, mentions légales
- **La marque est uniquement** dans le `contenu_html` des articles, via **1 mention discrète et naturelle** insérée par le robot
- Le site doit toujours paraître **100% indépendant éditorialement**

---

## Choses à faire avant le lancement

- [ ] Définir le vrai domaine → remplacer `monsite.fr` dans `astro.config.mjs` et `Layout.astro`
- [ ] Créer le repo GitHub et mettre à jour `GITHUB_OWNER` / `GITHUB_REPO` dans les routes API
- [ ] Configurer les variables d'environnement Vercel
- [ ] Connecter Vercel au repo GitHub
- [ ] Remplacer le logo texte par un vrai logo (si dispo)
- [ ] Définir la marque partenaire et ses URLs

---

## Commandes utiles

```bash
cd "/Users/lucassimon/Desktop/edp-clone"

# Dev local
npm install
npm run dev

# Build (lance le maillage interne en prebuild)
npm run build

# Push
git add -A && git commit -m "message" && git push origin main
```

---

## Historique des décisions

- **Création** : nouveau projet basé sur guide-tendinites.fr, design EDP Nutrition (Montserrat + Roboto, orange #FF7043)
- **Niche** : compléments alimentaires (11 catégories, 4 types d'articles)
- **Marque partenaire** : à définir par Lucas (variable `PARTNER_BRAND`)
- **Robot** : 1 article/publication 4x/semaine (lun/mer/ven/dim), refresh le mardi
- **Images** : pas de génération Gemini pour l'instant (simplifié vs guide-tendinites)
