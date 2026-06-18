// Sujets d'articles par complément — utilisés par le robot de génération automatique
// RÈGLE : les comparatifs principaux ("Meilleur X 2026") sont DÉJÀ écrits manuellement.
// Ce fichier contient uniquement des angles spécifiques non encore couverts.

export type TopicEntry = {
  titre: string;
  type: 'comparatif' | 'conseil' | 'test';
  objectif?: string;
  intentionRecherche: string; // question exacte que le lecteur pose sur Google
};

export const topicsParComplement: Record<string, TopicEntry[]> = {

  'omega-3': [
    {
      titre: "EPA vs DHA : quelles différences et lequel prendre selon votre objectif ?",
      type: 'conseil',
      objectif: 'Bien vieillir',
      intentionRecherche: "différence EPA DHA oméga 3",
    },
    {
      titre: "Oméga 3 et inflammation chronique : ce que disent vraiment les études",
      type: 'conseil',
      intentionRecherche: "oméga 3 anti-inflammatoire efficace",
    },
    {
      titre: "Oméga 3 vegan : les meilleures huiles d'algues pour remplacer le poisson",
      type: 'comparatif',
      intentionRecherche: "oméga 3 vegan sans poisson",
    },
    {
      titre: "Quelle dose d'oméga 3 prendre par jour ? Le guide complet par objectif",
      type: 'conseil',
      intentionRecherche: "dose oméga 3 par jour",
    },
    {
      titre: "Huile de poisson vs huile de krill : laquelle est vraiment plus efficace ?",
      type: 'conseil',
      intentionRecherche: "krill vs poisson oméga 3 différence",
    },
  ],

  'magnesium': [
    {
      titre: "Magnésium et stress : comment il régule le cortisol (mécanisme expliqué)",
      type: 'conseil',
      objectif: 'Stress',
      intentionRecherche: "magnésium stress cortisol",
    },
    {
      titre: "Carence en magnésium : 10 signes qui ne trompent pas",
      type: 'conseil',
      intentionRecherche: "symptômes carence magnésium",
    },
    {
      titre: "Magnésium et sommeil : quelle forme prendre le soir pour mieux dormir ?",
      type: 'conseil',
      intentionRecherche: "magnésium pour dormir soir",
    },
    {
      titre: "Magnésium bisglycinate vs oxyde : pourquoi la forme change tout",
      type: 'conseil',
      intentionRecherche: "bisglycinate vs oxyde magnésium différence",
    },
    {
      titre: "Magnésium et crampes musculaires : efficace ou mythe ?",
      type: 'conseil',
      objectif: 'Nutrition sportive',
      intentionRecherche: "magnésium crampes musculaires efficace",
    },
  ],

  'vitamine-d': [
    {
      titre: "Vitamine D3 vs D2 : laquelle est vraiment plus efficace pour le corps ?",
      type: 'conseil',
      intentionRecherche: "vitamine D3 vs D2 différence",
    },
    {
      titre: "Carence en vitamine D : symptômes, causes et comment la diagnostiquer",
      type: 'conseil',
      intentionRecherche: "symptômes carence vitamine D",
    },
    {
      titre: "Vitamine D et immunité : ce que montrent les méta-analyses en 2026",
      type: 'conseil',
      intentionRecherche: "vitamine D immunité études",
    },
    {
      titre: "Vitamine D et dépression saisonnière : y a-t-il un lien prouvé ?",
      type: 'conseil',
      intentionRecherche: "vitamine D dépression saisonnière",
    },
    {
      titre: "Vitamine D et calcium : faut-il toujours les prendre ensemble ?",
      type: 'conseil',
      intentionRecherche: "vitamine D calcium association",
    },
  ],

  'collagene': [
    {
      titre: "Collagène type I, II ou III : lequel prendre selon votre objectif ?",
      type: 'conseil',
      objectif: 'Bien vieillir',
      intentionRecherche: "type collagène 1 2 3 différence",
    },
    {
      titre: "Collagène et rides : les preuves scientifiques sur l'élasticité de la peau",
      type: 'conseil',
      intentionRecherche: "collagène peau rides efficace",
    },
    {
      titre: "Collagène marin vs bovin : toutes les différences pour bien choisir",
      type: 'conseil',
      intentionRecherche: "collagène marin ou bovin lequel choisir",
    },
    {
      titre: "Collagène pour les articulations : quelle dose et quelle forme choisir ?",
      type: 'conseil',
      objectif: 'Nutrition sportive',
      intentionRecherche: "collagène articulations dose",
    },
    {
      titre: "Existe-t-il un vrai collagène végétalien ? Ce que la science dit",
      type: 'conseil',
      intentionRecherche: "collagène vegan végétalien existe",
    },
  ],

  'whey': [
    {
      titre: "Whey concentrée vs isolat : quelle différence réelle pour vos muscles ?",
      type: 'conseil',
      objectif: 'Nutrition sportive',
      intentionRecherche: "whey concentrée vs isolat différence",
    },
    {
      titre: "Whey native vs classique : pourquoi la matière première change tout",
      type: 'conseil',
      intentionRecherche: "whey native vs classique",
    },
    {
      titre: "Quelle whey pour maigrir et préserver ses muscles en sèche ?",
      type: 'conseil',
      objectif: 'Perte de poids',
      intentionRecherche: "whey pour maigrir sécher",
    },
    {
      titre: "Quand prendre sa whey : avant ou après l'entraînement ? La réponse scientifique",
      type: 'conseil',
      objectif: 'Nutrition sportive',
      intentionRecherche: "whey avant ou après entraînement",
    },
    {
      titre: "Whey sans lactose : les meilleures options pour les intolérants",
      type: 'comparatif',
      objectif: 'Digestion',
      intentionRecherche: "whey sans lactose intolérant",
    },
  ],

  'creatine': [
    {
      titre: "Créatine monohydrate vs HCL : laquelle choisir vraiment et pourquoi ?",
      type: 'conseil',
      intentionRecherche: "créatine monohydrate vs HCL différence",
    },
    {
      titre: "Phase de charge créatine : utile ou inutile selon la science ?",
      type: 'conseil',
      intentionRecherche: "phase de charge créatine nécessaire",
    },
    {
      titre: "Créatine et femmes : 5 idées reçues à démystifier",
      type: 'conseil',
      objectif: 'Santé féminine',
      intentionRecherche: "créatine femme danger effet",
    },
    {
      titre: "Créatine et rétention d'eau : ce qui se passe vraiment dans le corps",
      type: 'conseil',
      intentionRecherche: "créatine rétention eau gonflement",
    },
    {
      titre: "Créatine pour la force : résultats attendus, délais et protocole optimal",
      type: 'conseil',
      intentionRecherche: "créatine gain de force résultats délai",
    },
  ],

  'probiotiques': [
    {
      titre: "Lactobacillus vs Bifidobacterium : quelle souche pour quel problème digestif ?",
      type: 'conseil',
      objectif: 'Digestion',
      intentionRecherche: "lactobacillus bifidobacterium différence",
    },
    {
      titre: "Probiotiques et ballonnements : comment ça fonctionne vraiment ?",
      type: 'conseil',
      objectif: 'Digestion',
      intentionRecherche: "probiotiques ballonnements efficace",
    },
    {
      titre: "Probiotiques et immunité : ce que prouvent les études en 2026",
      type: 'conseil',
      intentionRecherche: "probiotiques immunité études preuves",
    },
    {
      titre: "Probiotiques femme : les meilleures souches pour la flore vaginale",
      type: 'conseil',
      objectif: 'Santé féminine',
      intentionRecherche: "probiotiques flore vaginale femme",
    },
    {
      titre: "Probiotiques après antibiotiques : quand commencer et lesquels choisir ?",
      type: 'conseil',
      objectif: 'Digestion',
      intentionRecherche: "probiotiques après antibiotiques quand prendre",
    },
  ],

  'multivitamines': [
    {
      titre: "Multivitamines et biodisponibilité : pourquoi la forme chimique change tout",
      type: 'conseil',
      intentionRecherche: "biodisponibilité multivitamines formes actives",
    },
    {
      titre: "Multivitamines femme : les formules adaptées aux besoins spécifiques",
      type: 'comparatif',
      objectif: 'Santé féminine',
      intentionRecherche: "multivitamines femme meilleur",
    },
    {
      titre: "Multivitamines après 50 ans : ce qui change dans les besoins nutritionnels",
      type: 'conseil',
      objectif: 'Bien vieillir',
      intentionRecherche: "multivitamines 50 ans senior",
    },
    {
      titre: "Peut-on surdoser les multivitamines ? Les risques réels à connaître",
      type: 'conseil',
      intentionRecherche: "surdosage multivitamines danger",
    },
  ],

  'ashwagandha': [
    {
      titre: "Ashwagandha et cortisol : ce que disent les études cliniques sur le stress",
      type: 'conseil',
      objectif: 'Stress',
      intentionRecherche: "ashwagandha cortisol stress études",
    },
    {
      titre: "Ashwagandha et sommeil : faut-il vraiment le prendre le soir ?",
      type: 'conseil',
      intentionRecherche: "ashwagandha sommeil soir matin",
    },
    {
      titre: "Ashwagandha : effets secondaires et contre-indications à connaître absolument",
      type: 'conseil',
      intentionRecherche: "ashwagandha effets secondaires contre-indication",
    },
    {
      titre: "Rhodiola vs ashwagandha : lequel choisir pour mieux gérer son stress ?",
      type: 'conseil',
      objectif: 'Stress',
      intentionRecherche: "rhodiola vs ashwagandha stress différence",
    },
    {
      titre: "Ashwagandha et testostérone : ce que disent vraiment les études chez l'homme",
      type: 'conseil',
      intentionRecherche: "ashwagandha testostérone homme",
    },
  ],

  'zinc': [
    {
      titre: "Zinc et immunité : pourquoi il est indispensable en automne-hiver",
      type: 'conseil',
      intentionRecherche: "zinc immunité hiver grippe",
    },
    {
      titre: "Zinc et acné : ce que les études disent vraiment sur l'efficacité",
      type: 'conseil',
      intentionRecherche: "zinc acné efficace études",
    },
    {
      titre: "Carence en zinc : 8 signes à ne pas ignorer",
      type: 'conseil',
      intentionRecherche: "symptômes carence zinc signes",
    },
    {
      titre: "Zinc et fertilité masculine : ce que la science prouve",
      type: 'conseil',
      intentionRecherche: "zinc fertilité masculine spermatozoïdes",
    },
  ],

  'fer': [
    {
      titre: "Fer bisglycinate vs sulfate ferreux : pourquoi la forme change tout",
      type: 'conseil',
      objectif: 'Santé féminine',
      intentionRecherche: "bisglycinate fer vs sulfate ferreux",
    },
    {
      titre: "Fatigue et carence en fer : comment savoir si votre fatigue vient d'une anémie ?",
      type: 'conseil',
      intentionRecherche: "fatigue anémie carence fer comment savoir",
    },
    {
      titre: "Aliments riches en fer : lesquels sont vraiment bien absorbés par le corps ?",
      type: 'conseil',
      intentionRecherche: "aliments riches en fer bien absorbés",
    },
    {
      titre: "Fer et grossesse : quels besoins et quelle supplémentation ?",
      type: 'conseil',
      objectif: 'Santé féminine',
      intentionRecherche: "fer grossesse supplémentation dose",
    },
  ],

  // ── APPAREILS DE RÉCUPÉRATION ────────────────────────────────────────

  'pistolet-massage': [
    {
      titre: "Comment utiliser un pistolet de massage pour vraiment récupérer après le sport ?",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "comment utiliser pistolet de massage",
    },
    {
      titre: "Pistolet de massage avant ou après le sport ? Ce que dit la science",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "pistolet massage avant ou après sport",
    },
    {
      titre: "Pistolet de massage pour les courbatures : efficace ou effet placebo ?",
      type: 'conseil',
      intentionRecherche: "pistolet massage courbatures DOMS efficace",
    },
    {
      titre: "5 zones à masser en priorité avec un pistolet de percussion après le sport",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "zones masser pistolet massage sport",
    },
  ],

  'bottes-compression': [
    {
      titre: "Bottes de compression : comment ça marche exactement ?",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "comment fonctionnent bottes de compression",
    },
    {
      titre: "Bottes de compression vs chaussettes de contention : quelle vraie différence ?",
      type: 'conseil',
      intentionRecherche: "bottes compression vs chaussettes contention",
    },
    {
      titre: "Bottes de compression après un marathon : utiles ou pas ?",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "bottes compression marathon récupération",
    },
  ],

  'cryotherapie': [
    {
      titre: "Bain froid après le sport : protocole scientifique et bienfaits prouvés",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "bain froid après sport protocole",
    },
    {
      titre: "Douche froide vs immersion complète : laquelle est vraiment plus efficace ?",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "douche froide vs bain froid efficacité",
    },
    {
      titre: "Froid et inflammation musculaire : ce que disent les méta-analyses",
      type: 'conseil',
      intentionRecherche: "froid inflammation musculaire études",
    },
  ],

  'foam-roller': [
    {
      titre: "Trigger points et foam roller : le guide complet pour débutants",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "trigger points foam roller guide débutant",
    },
    {
      titre: "5 exercices de foam roller indispensables pour les coureurs",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "exercices foam roller coureur running",
    },
    {
      titre: "Foam roller vibrant : vaut-il vraiment le supplément de prix ?",
      type: 'conseil',
      intentionRecherche: "foam roller vibrant avis efficace",
    },
  ],

  'electrostimulation': [
    {
      titre: "Électrostimulation EMS : bienfaits, protocoles et résultats attendus",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "électrostimulation EMS résultats bienfaits",
    },
    {
      titre: "TENS contre la douleur musculaire chronique : est-ce vraiment efficace ?",
      type: 'conseil',
      intentionRecherche: "TENS douleur musculaire efficace",
    },
    {
      titre: "EMS après une séance intense : comment l'utiliser pour accélérer la récupération ?",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "EMS récupération après séance sport",
    },
  ],

  'bain-froid': [
    {
      titre: "Ice bath : le protocole scientifique pour les sportifs (durée, température, fréquence)",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "ice bath protocole sportif durée température",
    },
    {
      titre: "Bain froid et système immunitaire : ce que dit vraiment la science",
      type: 'conseil',
      intentionRecherche: "bain froid immunité études",
    },
    {
      titre: "La méthode Wim Hof : bienfaits prouvés et mythes à déconstruire",
      type: 'conseil',
      intentionRecherche: "méthode Wim Hof bienfaits vrai faux",
    },
    {
      titre: "Bain froid vs sauna : lequel choisir pour la récupération sportive ?",
      type: 'conseil',
      objectif: 'Récupération sportive',
      intentionRecherche: "bain froid vs sauna récupération",
    },
  ],
};

export const allTopics: Array<TopicEntry & { complement: string }> = Object.entries(topicsParComplement)
  .flatMap(([complement, sujets]) =>
    sujets.map(s => ({ ...s, complement }))
  );
