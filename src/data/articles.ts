// Système de chargement auto des articles.
// Chaque article est un fichier JSON dans /src/data/articles/{slug}.json
// → Le robot d'auto-publication dépose un nouveau fichier JSON ici pour publier.

export type ArticleType = 'comparatif' | 'conseil' | 'test' | 'code-promo';

export type Article = {
  slug: string;
  titre: string;
  extrait: string;
  complement: string;   // ex: "Oméga 3", "Whey", "Magnésium"...
  objectif?: string;    // ex: "Perte de poids", "Stress", "Nutrition sportive"...
  type: ArticleType;    // 'comparatif' | 'conseil' | 'test' | 'code-promo'
  duree: string;
  date: string;
  updated?: string;
  canonical?: string;
  contenu_html?: string;
  marque_produit?: string;   // nom de la marque partenaire à mentionner discrètement
  marque_lien?: string;      // lien vers la marque partenaire
  marque_description?: string; // description courte du produit partenaire
};

const modules = import.meta.glob<{ default: Article }>('./articles/*.json', { eager: true });

export const articles: Article[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Catégories de compléments alimentaires
export const complements: Array<{
  slug: string;
  nom: string;
  description: string;
  objectifs: string[];
  seoTitle: string;
  seoDescription: string;
  introText: string;
  statA: { valeur: string; unite: string; label: string };
  statB: { valeur: string; unite: string; label: string };
}> = [
  {
    slug: 'omega-3',
    nom: 'Oméga 3',
    description: "Acides gras essentiels EPA et DHA pour le cœur, le cerveau et les articulations.",
    objectifs: ['Bien vieillir', 'Nutrition sportive'],
    seoTitle: "Oméga 3 : bienfaits, dosage et meilleur complément en 2026",
    seoDescription: "Tout savoir sur les oméga 3 : EPA, DHA, bienfaits scientifiquement prouvés, dosage optimal et comment choisir le meilleur complément alimentaire.",
    introText: "Les oméga 3 sont des acides gras polyinsaturés essentiels que l'organisme ne peut pas synthétiser seul. On distingue principalement l'EPA (acide eicosapentaénoïque) et le DHA (acide docosahexaénoïque), tous deux présents dans les poissons gras, et l'ALA (acide alpha-linolénique), d'origine végétale. Des centaines d'études cliniques confirment leur rôle dans la santé cardiovasculaire, la fonction cérébrale, la réduction de l'inflammation et la santé oculaire.",
    statA: { valeur: "1 milliard", unite: "", label: "de personnes dans le monde manquent d'oméga 3 selon l'OMS" },
    statB: { valeur: "2-3", unite: "g/j", label: "d'EPA+DHA recommandés pour un effet anti-inflammatoire clinique" },
  },
  {
    slug: 'magnesium',
    nom: 'Magnésium',
    description: "Minéral essentiel contre le stress, la fatigue et les crampes musculaires.",
    objectifs: ['Stress', 'Nutrition sportive'],
    seoTitle: "Magnésium : bienfaits, formes et dosage — Guide complet 2026",
    seoDescription: "Magnésium bisglycinate, malate ou marin : quelle forme choisir ? Bienfaits prouvés, signes de carence, dosage optimal et notre sélection des meilleurs compléments.",
    introText: "Le magnésium est impliqué dans plus de 300 réactions enzymatiques dans l'organisme. Il joue un rôle clé dans la production d'énergie, la contraction musculaire, la transmission nerveuse et la régulation du cortisol. En France, 70 % de la population adulte consomme moins que les apports journaliers recommandés. La carence se manifeste par fatigue chronique, crampes, irritabilité et troubles du sommeil.",
    statA: { valeur: "70", unite: "%", label: "des Français ont des apports en magnésium insuffisants" },
    statB: { valeur: "300-400", unite: "mg/j", label: "d'apport recommandé selon l'âge et le sexe" },
  },
  {
    slug: 'vitamine-d',
    nom: 'Vitamine D',
    description: "La vitamine du soleil : immunité, os, humeur et prévention des carences.",
    objectifs: ['Bien vieillir', 'Santé féminine'],
    seoTitle: "Vitamine D : carence, bienfaits et quel complément choisir en 2026",
    seoDescription: "80 % des Français manquent de vitamine D en hiver. Bienfaits pour l'immunité et les os, signes de carence, dosage en UI et comparatif des meilleurs compléments.",
    introText: "La vitamine D3 (cholécalciférol) est synthétisée par la peau sous l'action des rayons UVB. En France, sa carence touche 80 % de la population en hiver et 40 % en été. Au-delà de son rôle bien connu dans la fixation du calcium et la santé osseuse, la vitamine D est un régulateur immunitaire puissant, impliqué dans la prévention des infections, de la dépression saisonnière et de certains cancers.",
    statA: { valeur: "80", unite: "%", label: "des Français en carence de vitamine D en période hivernale" },
    statB: { valeur: "1000-2000", unite: "UI/j", label: "dose d'entretien recommandée par la majorité des sociétés savantes" },
  },
  {
    slug: 'collagene',
    nom: 'Collagène',
    description: "Protéine structurelle pour les articulations, la peau et les tendons.",
    objectifs: ['Bien vieillir', 'Cosmétique', 'Nutrition sportive'],
    seoTitle: "Collagène : bienfaits, types et meilleur complément 2026",
    seoDescription: "Collagène marin, bovin, type I ou II : lequel choisir ? Bienfaits pour les articulations, la peau et les tendons, dosage optimal et comparatif des meilleures marques.",
    introText: "Le collagène est la protéine la plus abondante du corps humain — elle représente environ 30 % de la masse protéique totale. Il constitue la trame structurelle de la peau, des tendons, des ligaments, des cartilages et des os. À partir de 25 ans, la production naturelle de collagène diminue d'environ 1 % par an, entraînant progressivement rides, douleurs articulaires et fragilité tendineuse.",
    statA: { valeur: "1", unite: "%/an", label: "de perte de collagène naturel à partir de 25 ans" },
    statB: { valeur: "5-10", unite: "g/j", label: "de collagène hydrolysé recommandé pour un effet articulaire prouvé" },
  },
  {
    slug: 'whey',
    nom: 'Whey',
    description: "Protéine de lactosérum : récupération musculaire, prise de masse, satiété.",
    objectifs: ['Nutrition sportive', 'Perte de poids'],
    seoTitle: "Whey protéine : laquelle choisir en 2026 ? Comparatif et guide complet",
    seoDescription: "Whey native, concentrate ou isolate : quelle protéine choisir pour la prise de muscle ? Composition, digestibilité, marques et notre top des meilleures whey françaises.",
    introText: "La whey (protéine de lactosérum) est un sous-produit de la fabrication du fromage. Riche en acides aminés essentiels et en BCAA, elle présente le meilleur profil d'absorption parmi toutes les protéines alimentaires. Elle favorise la synthèse protéique musculaire, la récupération post-effort et la satiété. On distingue la concentrate (70-80 % de protéines), l'isolate (90 %+, moins de lactose) et la whey native (extraction directe, moins transformée).",
    statA: { valeur: "20-30", unite: "g", label: "de whey post-entraînement pour maximiser la synthèse protéique" },
    statB: { valeur: "1.6-2.2", unite: "g/kg", label: "d'apport en protéines recommandé par jour pour la prise de masse" },
  },
  {
    slug: 'creatine',
    nom: 'Créatine',
    description: "Le complément le plus étudié au monde pour la force et la performance.",
    objectifs: ['Nutrition sportive'],
    seoTitle: "Créatine monohydrate : bienfaits, dosage et meilleure marque 2026",
    seoDescription: "La créatine monohydrate est le complément sportif le mieux documenté. Bienfaits prouvés pour la force, le volume musculaire et la récupération — guide complet.",
    introText: "La créatine est un composé naturellement présent dans les muscles sous forme de phosphocréatine. Elle permet la régénération rapide de l'ATP (carburant musculaire) lors des efforts intenses et courts. C'est le complément alimentaire sportif le plus étudié au monde, avec plus de 500 études cliniques confirmant son efficacité sur la force, la puissance et la masse musculaire. La monohydrate reste la forme la plus efficace et la plus économique.",
    statA: { valeur: "+8", unite: "%", label: "de gain de force moyen documenté dans les études cliniques" },
    statB: { valeur: "3-5", unite: "g/j", label: "dose d'entretien recommandée sans phase de charge nécessaire" },
  },
  {
    slug: 'probiotiques',
    nom: 'Probiotiques',
    description: "Bactéries vivantes pour l'équilibre du microbiote, la digestion et l'immunité.",
    objectifs: ['Digestion', 'Santé féminine'],
    seoTitle: "Probiotiques : bienfaits, souches et meilleur complément 2026",
    seoDescription: "Lactobacillus, Bifidobacterium : quelles souches choisir pour la digestion, l'immunité ou le microbiote féminin ? Guide complet et comparatif des meilleures marques.",
    introText: "Les probiotiques sont des micro-organismes vivants qui, administrés en quantité adéquate, exercent un effet bénéfique sur la santé de l'hôte. Ils renforcent la barrière intestinale, modulent l'immunité et rééquilibrent le microbiote perturbé par le stress, les antibiotiques ou une alimentation déséquilibrée. L'efficacité d'un probiotique dépend fortement de la souche (pas seulement de l'espèce), de la dose (en UFC) et de la tolérance gastrique.",
    statA: { valeur: "38", unite: "000 milliards", label: "de bactéries composent le microbiote intestinal humain" },
    statB: { valeur: "10⁹", unite: "UFC/j", label: "dose minimale cliniquement efficace pour la plupart des souches" },
  },
  {
    slug: 'multivitamines',
    nom: 'Multivitamines',
    description: "Complexes de vitamines et minéraux pour combler les carences alimentaires.",
    objectifs: ['Bien vieillir', 'Santé féminine'],
    seoTitle: "Multivitamines : lesquelles choisir en 2026 ? Comparatif complet",
    seoDescription: "Toutes les multivitamines ne se valent pas. Formes biodisponibles, dosages réels, additifs inutiles : notre guide pour choisir les meilleures et éviter les pièges.",
    introText: "Les multivitamines regroupent en une seule formule les vitamines et minéraux essentiels dont l'alimentation moderne peine souvent à couvrir les besoins. Mais toutes les formules ne se valent pas : la forme chimique des nutriments (ex : citrate de magnésium vs oxyde), les dosages réels par rapport aux valeurs nutritionnelles de référence, et l'absence d'excipients controversés font une différence majeure sur l'absorption et l'efficacité.",
    statA: { valeur: "1 sur 3", unite: "", label: "Français présente au moins une carence en micronutriments" },
    statB: { valeur: "100", unite: "%", label: "des VNR — objectif minimum pour chaque nutriment dans un bon complexe" },
  },
  {
    slug: 'ashwagandha',
    nom: 'Ashwagandha',
    description: "Adaptogène ayurvédique contre le stress, la fatigue et l'anxiété.",
    objectifs: ['Stress', 'Bien vieillir'],
    seoTitle: "Ashwagandha : bienfaits prouvés, dosage et meilleur extrait 2026",
    seoDescription: "L'ashwagandha (Withania somnifera) réduit le cortisol, améliore la résistance au stress et la qualité du sommeil. Guide complet sur les extraits, les dosages et les risques.",
    introText: "L'ashwagandha (Withania somnifera), également appelée ginseng indien, est une plante adaptogène utilisée depuis 3 000 ans en médecine ayurvédique. Ses principaux actifs, les withanolides, agissent sur l'axe hypothalamo-hypophyso-surrénalien pour moduler la réponse au stress et réduire le taux de cortisol. Des études randomisées en double aveugle confirment son efficacité sur la réduction du stress perçu, l'amélioration du sommeil et la récupération sportive.",
    statA: { valeur: "-27", unite: "%", label: "de réduction du cortisol mesurée dans les études cliniques" },
    statB: { valeur: "300-600", unite: "mg/j", label: "d'extrait standardisé en withanolides (KSM-66 ou Sensoril)" },
  },
  {
    slug: 'zinc',
    nom: 'Zinc',
    description: "Oligoélément essentiel pour l'immunité, la peau et la fertilité masculine.",
    objectifs: ['Bien vieillir', 'Santé féminine'],
    seoTitle: "Zinc : bienfaits, carence et meilleur complément alimentaire 2026",
    seoDescription: "Zinc bisglycinate, gluconate ou oxyde : quelle forme choisir ? Bienfaits pour l'immunité, la peau et la testostérone, signes de carence et comparatif des meilleures marques.",
    introText: "Le zinc est un oligoélément impliqué dans plus de 300 réactions enzymatiques. Il joue un rôle central dans l'immunité (activation des lymphocytes T), la cicatrisation cutanée, la synthèse de testostérone, la fertilité masculine et la perception des goûts et odeurs. La carence légère est fréquente chez les végétariens, les sportifs intensifs et les personnes âgées, souvent asymptomatique mais avec un impact mesurable sur l'immunité.",
    statA: { valeur: "17", unite: "%", label: "de la population mondiale présente une carence en zinc" },
    statB: { valeur: "10-15", unite: "mg/j", label: "de zinc élémentaire recommandé (préférer bisglycinate pour l'absorption)" },
  },
  {
    slug: 'fer',
    nom: 'Fer',
    description: "Minéral clé contre la fatigue, l'anémie et les carences chez les femmes.",
    objectifs: ['Santé féminine', 'Nutrition sportive'],
    seoTitle: "Fer : carence, bienfaits et meilleur complément en 2026",
    seoDescription: "Carence en fer : symptômes, causes et traitements. Fer bisglycinate vs sulfate : laquelle choisir ? Guide complet pour les femmes, sportifs et végétariens.",
    introText: "La carence en fer est la déficience nutritionnelle la plus répandue dans le monde, touchant 1,6 milliard de personnes selon l'OMS. En France, elle concerne 25 % des femmes en âge de procréer. Le fer est indispensable à la synthèse de l'hémoglobine et à la production d'énergie cellulaire. La fatigue chronique, la pâleur et les troubles de la concentration sont les signes les plus fréquents d'une carence, souvent confirmée par une ferritinémie basse.",
    statA: { valeur: "25", unite: "%", label: "des femmes françaises en âge de procréer manquent de fer" },
    statB: { valeur: "14-18", unite: "mg/j", label: "d'apport journalier recommandé pour les femmes (vs 9 mg pour les hommes)" },
  },
];

// Objectifs de santé (navigation secondaire homepage)
export const objectifs = [
  { slug: 'perte-de-poids', nom: 'Perte de poids', icon: '⚖️' },
  { slug: 'bien-vieillir', nom: 'Bien vieillir', icon: '🌿' },
  { slug: 'digestion', nom: 'Digestion', icon: '🌀' },
  { slug: 'stress', nom: 'Stress', icon: '🧘' },
  { slug: 'nutrition-sportive', nom: 'Nutrition sportive', icon: '💪' },
  { slug: 'sante-feminine', nom: 'Santé féminine', icon: '🌸' },
  { slug: 'cosmetique', nom: 'Cosmétique', icon: '✨' },
];

export function findComplement(slug: string) {
  return complements.find(c => c.slug === slug);
}
