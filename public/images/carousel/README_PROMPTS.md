# 🎨 Génération des images carrousel — Nano Banana Pro

## Comment faire

1. Va sur **https://aistudio.google.com**
2. Connecte-toi avec ton compte Google JOLT
3. Clique sur **"Create" → "Image"** (modèle Nano Banana Pro / Gemini 2.5 Flash Image)
4. Pour chaque zone ci-dessous, copie-colle le prompt
5. Génère l'image, **télécharge-la**
6. Renomme-la avec le nom indiqué (ex: `epaule.jpg`)
7. Dépose-la dans **ce dossier** (`public/images/carousel/`)
8. Le site la prend automatiquement (pas de redéploiement nécessaire)

---

## 📐 Format universel (à toutes les images)

- **Ratio** : portrait 3:4 (par ex. 900×1200 px)
- **Style** : photo éditoriale magazine (Kinfolk, Cereal), spa contemporain, médical doux
- **Pas de texte** dans l'image
- **Composition** : sujet centré ou décalé tiers, beaucoup d'air négatif
- **Éclairage** : naturel diffus, doux, jamais flash dur
- **Ambiance** : apaisante, professionnelle, jamais clinique froide

---

## 🎯 Les 8 prompts (1 par zone)

### 1. `epaule.jpg` — thème **sage** (vert sauge)

```
Editorial magazine photography, soft natural light, portrait orientation 3:4 ratio.
A close-up artistic shot of a person's bare shoulder and upper back from behind,
in a calm minimalist setting. The lighting is diffused, warm and natural,
casting gentle shadows. Background is soft sage green with subtle gradient.
The shoulder is gently illuminated, showing skin texture in fine detail.
Aesthetic similar to Kinfolk magazine, contemplative mood, no text, no logos,
no faces visible, focus on the shoulder anatomy. Soft beige and sage green color palette.
```

---

### 2. `coude.jpg` — thème **warm** (terracotta/sand)

```
Editorial magazine photography, soft natural light, portrait orientation 3:4 ratio.
A close-up artistic shot of a person's bent elbow joint, arm at 90-degree angle,
in a warm minimalist setting. The lighting is diffused and golden, like late afternoon sun.
Background is warm terracotta and sand tones with soft gradient.
The elbow is gently highlighted, showing skin texture and the natural anatomy.
Aesthetic similar to Cereal magazine, calm and contemplative, no text, no logos,
no face visible. Warm beige, clay terracotta and cream color palette.
```

---

### 3. `genou.jpg` — thème **dark** (forest green deep)

```
Editorial magazine photography, dramatic moody lighting, portrait orientation 3:4 ratio.
A close-up artistic shot of a person's knee joint, leg slightly bent,
in a dark minimalist setting. The lighting is low-key and atmospheric, with selective
illumination on the knee from a single soft light source. Background is deep forest green,
almost black, with subtle gradient. The knee skin is gently illuminated, sage tones,
showing natural anatomy and shadows. Aesthetic similar to Wallpaper magazine,
moody and intimate, no text, no logos, no face. Dark forest green and warm skin tones.
```

---

### 4. `poignet.jpg` — thème **light** (cream/beige)

```
Editorial magazine photography, bright soft natural light, portrait orientation 3:4 ratio.
A close-up artistic shot of a person's wrist and hand, fingers gently extended,
resting on a soft neutral surface. The lighting is bright, airy and diffused,
like morning light through curtains. Background is cream beige with very subtle gradient.
The wrist and hand are gently illuminated, showing skin texture and the delicate anatomy.
Aesthetic similar to Aesop campaign or Apartamento magazine, minimal and serene,
no text, no logos, no face. Cream, beige and soft warm tones color palette.
```

---

### 5. `hanche.jpg` — thème **sage** (vert sauge)

```
Editorial magazine photography, soft natural light, portrait orientation 3:4 ratio.
A close-up artistic shot of a person's hip area from the side, wearing soft neutral
loose clothing or wrapped in beige fabric. The lighting is diffused and warm,
like spa atmosphere. Background is soft sage green with subtle gradient.
The hip silhouette is gently illuminated, showing the natural curve and form
in an elegant abstract way. Aesthetic similar to a luxury wellness brand campaign,
contemplative and refined, no text, no logos, no face visible.
Soft beige and sage green color palette.
```

---

### 6. `cheville.jpg` — thème **warm** (terracotta/sand)

```
Editorial magazine photography, soft natural light, portrait orientation 3:4 ratio.
A close-up artistic shot of a person's bare ankle and foot, foot at rest on a
soft neutral surface like raw linen fabric. The lighting is diffused and golden, warm.
Background is warm terracotta and sand tones with soft gradient. The ankle is gently
illuminated, showing the delicate anatomy of the joint. Aesthetic similar to Cereal
magazine still life, contemplative and minimal, no text, no logos.
Warm beige, clay terracotta and cream color palette.
```

---

### 7. `pied.jpg` — thème **dark** (forest green deep)

```
Editorial magazine photography, dramatic moody lighting, portrait orientation 3:4 ratio.
A close-up artistic shot of a person's bare foot from above, toes pointed naturally,
in a dark minimalist setting. The lighting is low-key with a single soft light source
illuminating the foot from above. Background is deep forest green, almost black,
with subtle gradient. The foot skin is gently illuminated showing natural anatomy.
Aesthetic similar to Wallpaper magazine still life, moody and intimate,
no text, no logos. Dark forest green and warm skin tones.
```

---

### 8. `achille.jpg` — thème **sage** (vert sauge)

```
Editorial magazine photography, soft natural light, portrait orientation 3:4 ratio.
A close-up artistic shot of a person's bare ankle from behind, showing the Achilles
tendon area, in a calm minimalist setting. The lighting is diffused and natural,
casting soft shadows. Background is soft sage green with subtle gradient.
The ankle and Achilles area is gently illuminated, showing the delicate anatomy.
Aesthetic similar to a luxury wellness brand or Kinfolk magazine, refined and serene,
no text, no logos, no face. Soft beige and sage green color palette.
```

---

## ✅ Liste des fichiers à déposer dans CE dossier

```
public/images/carousel/
├── epaule.jpg     ← prompt 1
├── coude.jpg      ← prompt 2
├── genou.jpg      ← prompt 3
├── poignet.jpg    ← prompt 4
├── hanche.jpg     ← prompt 5
├── cheville.jpg   ← prompt 6
├── pied.jpg       ← prompt 7
└── achille.jpg    ← prompt 8
```

## 🎨 Cohérence chromatique

Pour que les 8 cards soient cohérentes dans le carrousel, respecte les **4 thèmes** :

| Card | Thème palette |
|---|---|
| Épaule, Hanche, Achille | **Sage** (vert sauge clair) |
| Coude, Cheville | **Warm** (terracotta / sand) |
| Genou, Pied | **Dark** (vert forest profond) |
| Poignet | **Light** (cream / beige) |

→ Si une image généré ne matche pas son thème, dis-moi, j'adapte les couleurs côté code.

---

## 🚀 Astuce pour aller plus vite

Tu peux générer **les 8 d'un coup** dans Google AI Studio en collant les prompts l'un après l'autre. Compte ~30-45 sec par image, donc **5-7 minutes total**.

Une fois déposées dans ce dossier, le site les prend automatiquement (pas besoin de relancer ou redéployer).
