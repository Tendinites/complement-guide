// Sujets d'articles par complément — utilisés par le robot de génération automatique

export type TopicEntry = {
  titre: string;
  type: 'comparatif' | 'conseil' | 'test';
  objectif?: string;
};

export const topicsParComplement: Record<string, TopicEntry[]> = {
  'omega-3': [
    { titre: "Quel oméga 3 acheter en 2026 ? Notre sélection des meilleures marques", type: 'comparatif', objectif: 'Bien vieillir' },
    { titre: "EPA vs DHA : quelles différences et lequel prendre selon votre objectif ?", type: 'conseil', objectif: 'Bien vieillir' },
    { titre: "Oméga 3 et inflammation : ce que disent vraiment les études cliniques", type: 'conseil' },
    { titre: "Oméga 3 vegan : les meilleures huiles d'algues pour remplacer les poissons", type: 'comparatif' },
    { titre: "Oméga 3 : quelle dose prendre par jour ? Le guide complet", type: 'conseil' },
    { titre: "Huile de poisson vs krill : laquelle est vraiment plus efficace ?", type: 'conseil' },
  ],
  'magnesium': [
    { titre: "Meilleur magnésium 2026 : bisglycinate, malate ou marin — notre comparatif", type: 'comparatif', objectif: 'Stress' },
    { titre: "Magnésium et stress : comment il régule le cortisol", type: 'conseil', objectif: 'Stress' },
    { titre: "Carence en magnésium : 10 signes qui ne trompent pas", type: 'conseil' },
    { titre: "Magnésium pour dormir : quelle forme prendre le soir ?", type: 'conseil' },
    { titre: "Magnésium bisglycinate vs oxyde : pourquoi la forme change tout", type: 'conseil' },
    { titre: "Magnésium et crampes musculaires : est-ce vraiment efficace ?", type: 'conseil', objectif: 'Nutrition sportive' },
  ],
  'vitamine-d': [
    { titre: "Meilleure vitamine D en 2026 : D3 seule ou D3+K2 ?", type: 'comparatif', objectif: 'Bien vieillir' },
    { titre: "Vitamine D3 vs D2 : laquelle est vraiment plus efficace ?", type: 'conseil' },
    { titre: "Carence en vitamine D : symptômes et comment la diagnostiquer", type: 'conseil' },
    { titre: "Vitamine D et immunité : ce que montrent les méta-analyses", type: 'conseil' },
    { titre: "Vitamine D en hiver : quelle dose prendre selon votre taux sanguin ?", type: 'conseil' },
    { titre: "Vitamine D et dépression saisonnière : y a-t-il un lien prouvé ?", type: 'conseil' },
  ],
  'collagene': [
    { titre: "Meilleur collagène marin 2026 : notre comparatif des meilleures marques", type: 'comparatif', objectif: 'Bien vieillir' },
    { titre: "Collagène type I, II ou III : lequel prendre selon votre objectif ?", type: 'conseil' },
    { titre: "Collagène et peau : les preuves scientifiques sur les rides", type: 'conseil', objectif: 'Cosmétique' },
    { titre: "Collagène marin vs bovin : différences et lequel choisir", type: 'conseil' },
    { titre: "Collagène pour les articulations : quelle dose et quelle forme ?", type: 'conseil', objectif: 'Nutrition sportive' },
    { titre: "Collagène végétalien : existe-t-il vraiment une alternative vegan ?", type: 'conseil' },
  ],
  'whey': [
    { titre: "Meilleure whey protéine française en 2026 : notre top comparatif", type: 'comparatif', objectif: 'Nutrition sportive' },
    { titre: "Whey concentrate vs isolate : quelle différence pour vos muscles ?", type: 'conseil' },
    { titre: "Whey native vs classique : pourquoi la matière première change tout", type: 'conseil' },
    { titre: "Whey sans lactose : les meilleures options pour les intolérants", type: 'comparatif', objectif: 'Digestion' },
    { titre: "Quelle whey pour maigrir ? Protéines et perte de poids", type: 'conseil', objectif: 'Perte de poids' },
    { titre: "Quand prendre sa whey : avant ou après l'entraînement ?", type: 'conseil', objectif: 'Nutrition sportive' },
  ],
  'creatine': [
    { titre: "Meilleure créatine monohydrate 2026 : comparatif et guide d'achat", type: 'comparatif', objectif: 'Nutrition sportive' },
    { titre: "Créatine monohydrate vs HCL : laquelle choisir vraiment ?", type: 'conseil' },
    { titre: "Phase de charge créatine : utile ou inutile selon la science ?", type: 'conseil' },
    { titre: "Créatine et femmes : 5 idées reçues à démystifier", type: 'conseil', objectif: 'Santé féminine' },
    { titre: "Créatine et rétention d'eau : ce qui se passe vraiment", type: 'conseil' },
    { titre: "Créatine pour la force : résultats attendus et délai réel", type: 'conseil' },
  ],
  'probiotiques': [
    { titre: "Meilleurs probiotiques 2026 : comparatif des meilleures souches", type: 'comparatif', objectif: 'Digestion' },
    { titre: "Lactobacillus vs Bifidobacterium : quelle souche pour quel problème ?", type: 'conseil', objectif: 'Digestion' },
    { titre: "Probiotiques et ballonnements : comment ça marche vraiment ?", type: 'conseil', objectif: 'Digestion' },
    { titre: "Probiotiques et immunité : ce que prouvent les études", type: 'conseil' },
    { titre: "Probiotiques femme : les meilleures souches pour la flore vaginale", type: 'conseil', objectif: 'Santé féminine' },
    { titre: "Probiotiques après antibiotiques : quand et lesquels reprendre ?", type: 'conseil', objectif: 'Digestion' },
  ],
  'multivitamines': [
    { titre: "Meilleures multivitamines 2026 : notre comparatif des formules les plus complètes", type: 'comparatif' },
    { titre: "Multivitamines : sont-elles vraiment utiles si l'on mange équilibré ?", type: 'conseil' },
    { titre: "Multivitamines femme : les 5 meilleures formules spécifiques", type: 'comparatif', objectif: 'Santé féminine' },
    { titre: "Multivitamines et biodisponibilité : pourquoi la forme chimique change tout", type: 'conseil' },
  ],
  'ashwagandha': [
    { titre: "Meilleur ashwagandha 2026 : KSM-66 ou Sensoril — notre comparatif", type: 'comparatif', objectif: 'Stress' },
    { titre: "Ashwagandha et cortisol : ce que disent les études sur le stress", type: 'conseil', objectif: 'Stress' },
    { titre: "Ashwagandha et sommeil : faut-il le prendre le soir ?", type: 'conseil' },
    { titre: "Ashwagandha : effets secondaires et contre-indications à connaître", type: 'conseil' },
    { titre: "Rhodiola vs ashwagandha : lequel choisir pour le stress ?", type: 'conseil', objectif: 'Stress' },
  ],
  'zinc': [
    { titre: "Meilleur zinc 2026 : bisglycinate, gluconate ou picolinate — comparatif", type: 'comparatif' },
    { titre: "Zinc et immunité : pourquoi il est indispensable en automne-hiver", type: 'conseil' },
    { titre: "Zinc et peau : ce que les études disent vraiment sur l'acné", type: 'conseil', objectif: 'Cosmétique' },
    { titre: "Carence en zinc : 8 signes à ne pas ignorer", type: 'conseil' },
  ],
  'fer': [
    { titre: "Meilleur complément de fer 2026 : bisglycinate vs sulfate — notre comparatif", type: 'comparatif', objectif: 'Santé féminine' },
    { titre: "Carence en fer chez la femme : symptômes, causes et traitement naturel", type: 'conseil', objectif: 'Santé féminine' },
    { titre: "Fer bisglycinate : pourquoi c'est la meilleure forme sans effets secondaires", type: 'conseil' },
    { titre: "Fer et fatigue : comment savoir si votre fatigue vient d'une anémie ?", type: 'conseil' },
    { titre: "Aliments riches en fer : lesquels assimile-t-on vraiment ?", type: 'conseil' },
  ],
};

export const allTopics: Array<TopicEntry & { complement: string }> = Object.entries(topicsParComplement)
  .flatMap(([complement, sujets]) =>
    sujets.map(s => ({ ...s, complement }))
  );
