// Les DEUX NIVEAUX d'une manipulation — la partie sans React.
//
// PRINCIPE PRODUIT (2026-09-20). Le manuel dit CE QUE l'élève doit
// apprendre ; Smarter Academy décide COMMENT il le vit. La fidélité se
// sépare donc en deux :
//
//   • FIDÉLITÉ MATHÉMATIQUE — concept, définition, propriété, méthode,
//     notation, vocabulaire, progression, objectif : intouchables. Elles
//     viennent du manuel et de `packages/core/arithmetic/`.
//   • FIDÉLITÉ CONTEXTUELLE — l'habillage de la situation. Une situation du
//     manuel peut être REMPLACÉE par une situation plus engageante si la
//     STRUCTURE mathématique et l'objectif sont préservés.
//
// Un remplacement n'est jamais silencieux : il porte sa traçabilité
// (`source` = d'où vient la mathématique, `experience` = ce qui a été adapté
// et pourquoi). C'est ce que `manipulationExperience()` construit et ce que
// `validate-lessons.mjs` vérifie.
//
// Ici ne vivent que les FORMES (quels champs, quelles valeurs admises) et
// les vérificateurs. Les contenus vivent dans les leçons ; les composants
// dans apps/web/src/lessons/common/manipulations/.

/** Les deux niveaux, dans l'ordre. `beginner` est TOUJOURS le niveau par défaut. */
export const MANIPULATION_LEVEL_IDS = Object.freeze(['beginner', 'advanced']);

export const DEFAULT_MANIPULATION_LEVEL = 'beginner';

/**
 * Les natures d'expérience :
 *   textbook             la situation du manuel, gardée telle quelle
 *   platform_adaptation  la situation du manuel, réhabillée (même structure)
 *   platform_context     une situation nouvelle, choisie par la plateforme
 *
 * Les deux dernières EXIGENT une raison ; c'est ce qui rend l'adaptation
 * auditable, leçon par leçon.
 */
export const EXPERIENCE_TYPES = Object.freeze(['textbook', 'platform_adaptation', 'platform_context']);

/** Les raisons admises d'une adaptation — une énumération fermée, pas du texte libre. */
export const ADAPTATION_REASONS = Object.freeze([
  'improved_interactivity_and_age_appropriateness',
  'smaller_numbers_for_first_contact',
  'larger_numbers_for_autonomy',
  'multiple_representations',
  'reduced_scaffolding',
]);

/**
 * Les thèmes visuels disponibles. Le thème est une DONNÉE : il choisit le
 * vocabulaire et le dessin des objets, jamais la mathématique. Un thème ne
 * s'impose que lorsqu'il SERT la structure (§11 du brief : ne jamais forcer
 * un contexte qui rend la mathématique moins claire).
 */
export const VISUAL_THEMES = Object.freeze({
  library: { kind: 'objects', shows: 'كتب ورفوف' },
  football: { kind: 'people', shows: 'لاعبون وفرق' },
  garden: { kind: 'objects', shows: 'زهور وباقات' },
  // Les thèmes ajoutés le 2026-09-21 pour propager la qualité du terrain et
  // de la bibliothèque aux autres leçons de l'unité. Chacun DESSINE ses
  // objets (primitives/ItemFigure.jsx, BrickWall.jsx, RibbonStrip.jsx) et
  // n'est choisi que lorsqu'il rend la structure mathématique visible :
  //   school        des fournitures réparties en trousses identiques
  //                 (groupes identiques → قواسم مشتركة)
  //   kitchen       une recette : deux ingrédients répartis en parts égales
  //                 (diviser numérateur et dénominateur → اختزال)
  //   construction  des murs en briques de longueur n (n | a et n | b ⇒ …)
  //   workshop      des rubans qu'on coupe ou qu'on reporte (الفروق، إقليدس)
  school: { kind: 'objects', shows: 'أقلام وكراريس في حقائب' },
  kitchen: { kind: 'objects', shows: 'ملاعق وأكواب في حصص' },
  construction: { kind: 'lengths', shows: 'جدران من طوب بطول n' },
  workshop: { kind: 'lengths', shows: 'أشرطة تُقصّ وتُقاس' },
  abstract: { kind: 'tiles', shows: 'بلاطات ومناطق' },
  // Unité 4 « معادلات ومتراجحات » (2026-10-01), mondes du lab growth-race :
  //   family  des personnes dont l'âge grandit avec x (ترييض مشكلة : le père et ses enfants)
  //   pool    deux formules d'abonnement au مسبح : coût par séance et carte annuelle
  family: { kind: 'people', shows: 'أفراد عائلة تكبر أعمارهم' },
  pool: { kind: 'objects', shows: 'مسبح وتذاكر وصيغ اشتراك' },
  // Unité 5 « جمل معادلتين » (2026-10-01) :
  //   staff    les agents d'un service avant / après les départs à la retraite (نشاط 1)
  //   coins    les pièces de 20DA et 10DA de la cagnotte de la classe (تحدّ)
  //   snack    la كرنتيكة et la gazouz du kiosque : deux prix inconnus (cartes d'élimination)
  //   stadium  les tribunes d'un derby : billets adultes / enfants (modéliser une histoire)
  //   museum   l'entrée du musée : billets adultes / enfants (نشاط 3)
  //   party    le goûter de la fête : jus et gâteaux (أدمج تعلّماتي)
  staff: { kind: 'people', shows: 'عمّال مصلحة قبل وبعد الإحالة على التقاعد' },
  coins: { kind: 'objects', shows: 'قطع نقدية من فئتي 20DA و 10DA' },
  snack: { kind: 'objects', shows: 'كرنتيكة ومشروب: سعران مجهولان' },
  stadium: { kind: 'people', shows: 'مناصرون يدخلون الملعب بتذاكر الكبار والصغار' },
  museum: { kind: 'people', shows: 'زوّار متحف بتذاكر البالغين والصغار' },
  party: { kind: 'objects', shows: 'علب عصير وقطع حلوى حفل' },
  // Unité 6 « الدالة الخطية والتناسبية » (2026-10-02) :
  //   scooter   les trottinettes louées à la minute sur la promenade (compteur de trajet)
  //   souk      les étiquettes de la remise de l'Aïd (machine linéaire, نشاط 1)
  //   cablecar  le téléphérique : une cabine sur un câble droit (droite par O ; أدمج تعلّماتي)
  //   spring    le ressort et ses masses (طرائق : y = 0,3x)
  //   mall      les soldes du centre commercial (étiquette étirée)
  //   tank      le réservoir d'eau vidé puis rempli (changements successifs)
  scooter: { kind: 'objects', shows: 'تروتينات كهربائية تؤجَّر بالدقيقة' },
  souk: { kind: 'objects', shows: 'سلع بأسعار قبل وبعد تخفيض العيد' },
  cablecar: { kind: 'objects', shows: 'مصعد هوائي يسير على حبل مستقيم' },
  spring: { kind: 'objects', shows: 'نابض تعلّق به كتل' },
  mall: { kind: 'objects', shows: 'أحذية رياضية بأسعار التخفيضات' },
  tank: { kind: 'objects', shows: 'خزان ماء يُفرَغ ويُملأ' },
  // Unité 7 « الدالة التآلفية » (2026-10-02) :
  //   payroll  la fiche de paie : un salaire de base et des heures supplémentaires (نشاط 1)
  //   ride     la course en taxi-application : prise en charge + prix au km (compteur à partie fixe)
  //   ramp     la rampe du skatepark : une pente qui part d'une hauteur b (droite affine)
  //   thermo   le thermomètre °C / °F du تحدّ (deux couples lus, f(x) = 1,8x + 32)
  //   gaming   la salle de jeux vidéo : carte d'abonnement contre paiement à l'heure (deux tarifs)
  //   rental   la location de vélos / kayaks à la plage : forfait contre prix à l'heure (synthèse)
  payroll: { kind: 'objects', shows: 'أجرة قاعدية وساعات إضافية' },
  ride: { kind: 'objects', shows: 'رحلة سيارة أجرة بتطبيق: ثمن الانطلاق وثمن الكيلومتر' },
  ramp: { kind: 'objects', shows: 'منحدر حديقة التزلج يبدأ من ارتفاع b' },
  thermo: { kind: 'objects', shows: 'محرار بتدريجتي سلسيوس وفهرنهايت' },
  gaming: { kind: 'objects', shows: 'قاعة ألعاب إلكترونية: اشتراك أو دفع بالساعة' },
  rental: { kind: 'objects', shows: 'كراء دراجات وقوارب على الشاطئ: جزافي أو بالساعة' },
  //   laser    (line-crossing, مبتدئ) un spectacle de lumière : deux faisceaux laser droits qui se croisent
  laser: { kind: 'objects', shows: 'عرض ضوئي: شعاعا ليزر مستقيمان يتقاطعان' },
  // Unité 8 « الإحصاء » (2026-10-02) :
  //   funpark  la file d'un manège au parc d'attractions : « القامة t على الأقل » (barre de taille)
  //   heatwave le thermomètre d'El Oued : dix jours de canicule (balance des valeurs, نشاط 4)
  //   esport   un mini-tournoi de jeu vidéo entre amis : les scores des joueurs (balance, مبتدئ)
  //   sheet    l'écran d'ordinateur de la salle d'informatique : un majdoul (sheet-lab)
  //   beach    les déchets ramassés sur la plage (تمرين 15 : diagramme circulaire)
  //   quiz     le quiz de la classe : deux groupes et leurs moyennes réunis (réservoirs)
  //   medals   le tableau des médailles d'or olympiques (أدمج تعلّماتي)
  funpark: { kind: 'people', shows: 'طابور لعبة في حديقة التسلية بشرط على القامة' },
  heatwave: { kind: 'objects', shows: 'محرار مدينة الوادي في أيام الحر' },
  esport: { kind: 'people', shows: 'دورة ألعاب إلكترونية بين الأصدقاء: نقاط اللاعبين' },
  sheet: { kind: 'objects', shows: 'مجدول على حاسوب قاعة الإعلام الآلي' },
  beach: { kind: 'objects', shows: 'نفايات مجموعة على الشاطئ' },
  quiz: { kind: 'people', shows: 'مسابقة القسم: فوجان ومعدّلاهما' },
  medals: { kind: 'objects', shows: 'ميداليات ذهبية في الألعاب الأولمبية' },
  // Unité 9 « خاصية طالس » (2026-10-02) :
  //   cinema   la projection en plein air du quartier : un vidéoprojecteur, un écran qu'on recule (faisceau, نشاط 1)
  //   camera   la chambre noire (un trou d'épingle) : l'image renversée de l'autre côté de A (وضعية الفراشة)
  //   mural    l'échelle double des graffeurs du quartier : la barre doit être de niveau (الخاصية العكسية)
  //   minaret  l'ombre de la minaret et du bâton (تحدّ, أدمج تعلّماتي)
  //   cornet   le cornet de glace et le pot cylindrique (أدمج تعلّماتي, cône et cylindre)
  //   river    viser par-dessus l'oued pour en estimer la largeur (أتعمّق 22)
  cinema: { kind: 'objects', shows: 'عرض سينمائي في الحي: جهاز إسقاط وشاشة تُبعَد' },
  camera: { kind: 'objects', shows: 'غرفة مظلمة بثقب: صورة مقلوبة' },
  mural: { kind: 'objects', shows: 'سلّم مزدوج لرسّامي الجداريات وعارضة أفقية' },
  minaret: { kind: 'objects', shows: 'مئذنة وعصا وظلاهما' },
  cornet: { kind: 'objects', shows: 'مخروط مثلجات وعلبة أسطوانية داخله' },
  river: { kind: 'objects', shows: 'تقدير عرض وادٍ بالتسديد البصري' },
  //   tifo     la banderole géante des ultras du quartier, partagée en bandes égales (ou p : q) au compas (segment-divider)
  tifo: { kind: 'lengths', shows: 'لافتة تيفو للأنصار تُقسَّم إلى أشرطة بالمسطرة غير المدرّجة والمدور' },
  // Unité 10 « حساب المثلثات في المثلث القائم » (2026-10-04) :
  //   skatepark  les rampes du skatepark : la planche (hypoténuse), la hauteur, le sol ; trois rampes au même angle (نشاط 2)
  //   drone      la nacelle inclinée d'une caméra de drone : l'angle tapé sur la calculatrice (نشاط 4)
  //   kite       le cerf-volant sur la plage : le fil (compas, hypoténuse) et la hauteur (إنشاء زاوية)
  //   floodlight le projecteur du stade visé au clinomètre du téléphone depuis la ligne de touche
  //   maqam      مقام الشهيد visé par-dessus un poteau électrique (أدمج تعلّماتي) ; l'échelle du تحدّ réutilise `mural`
  skatepark: { kind: 'objects', shows: 'منحدرات حديقة التزلج: اللوح والارتفاع والأرض' },
  drone: { kind: 'objects', shows: 'كاميرا طائرة مسيّرة تميل بزاوية تُكتب على الحاسبة' },
  kite: { kind: 'objects', shows: 'طائرة ورقية على الشاطئ: الخيط والارتفاع' },
  floodlight: { kind: 'objects', shows: 'كشّاف إنارة الملعب يُسدَّد بمقياس الميل في الهاتف' },
  maqam: { kind: 'objects', shows: 'مقام الشهيد يُرى من فوق عمود كهربائي' },
  // Unités 11 « الأشعة والانسحاب » et 12 « الأشعة في معلم » (2026-10-04) :
  //   drone-show  une formation de drones lumineux au-dessus de la baie d'Alger qui glisse d'un bloc (انسحاب)
  //   scooter     (déjà déclaré plus haut) réutilisé : deux trajets de trottinette enchaînés dans Alger (علاقة شال)
  //   swim        un nageur traverse l'oued et le courant le déporte (قاعدة متوازي الأضلاع, تحدّ)
  //   metro       les tronçons et correspondances du métro d'Alger (sommes de plusieurs vecteurs)
  //   bridge      un pont jeté sur le Rhummel de Constantine (le plus court chemin par translation)
  //   delivery    l'appli de livraison : le livreur sur le quadrillage d'un quartier (مركبتا شعاع)
  //   game-map    deux portails d'une carte de jeu mobile (حساب المركبتين)
  //   gps-meet    deux amis partagent leur position GPS et se retrouvent à mi-chemin (المنتصف والمسافة)
  //   rally       deux itinéraires d'un rallye dans le Sahara (مقارنة مسارين)
  'drone-show': { kind: 'objects', shows: 'عرض طائرات مسيّرة مضيئة فوق خليج الجزائر' },
  swim: { kind: 'people', shows: 'سبّاح يعبر الوادي والتيار يجرفه' },
  metro: { kind: 'objects', shows: 'محطات وخطوط مترو الجزائر' },
  bridge: { kind: 'objects', shows: 'جسر فوق وادي الرمال بقسنطينة' },
  // crosswalk  la rue de l'école du manuel (أدمج تعلّماتي) : deux trottoirs, la cité, l'école, un passage piéton qu'on déplace
  crosswalk: { kind: 'objects', shows: 'شارع المدرسة: رصيفان وحيّ ومدرسة وممر للراجلين' },
  delivery: { kind: 'objects', shows: 'تطبيق توصيل: سائق على شبكة شوارع حيّ' },
  'game-map': { kind: 'objects', shows: 'بوابتا عبور في خريطة لعبة على الهاتف' },
  'gps-meet': { kind: 'people', shows: 'صديقان يتشاركان موقعيهما ويلتقيان في منتصف الطريق' },
  rally: { kind: 'objects', shows: 'مساران لرالي في الصحراء الجزائرية' },
  // cross       le cross-country des Sablettes (أدمج تعلّماتي, وضعية p. 148) : deux coureurs et leurs montres connectées, trois
  //             bassins ronds contournés par des demi-cercles, une ligne brisée de balises
  cross: { kind: 'people', shows: 'عدّاءان بساعتين ذكيتين في سباق الضاحية على واجهة الصابلات' },
});

export const VISUAL_THEME_IDS = Object.freeze(Object.keys(VISUAL_THEMES));

/**
 * La traçabilité d'une expérience (§33 du brief) :
 *
 *   {
 *     source:     { type: 'textbook', elementId: 'act-1', page: 8 },
 *     experience: { type: 'platform_context', reason: '…', theme: 'football' },
 *   }
 *
 * `source` dit d'où vient la MATHÉMATIQUE — elle vient toujours du manuel.
 * `experience` dit ce que la plateforme a fait de la SITUATION.
 */
export function manipulationExperience({ sourceElementId, page, type, reason, theme }) {
  return Object.freeze({
    source: Object.freeze({ type: 'textbook', elementId: sourceElementId, ...(page != null ? { page } : {}) }),
    experience: Object.freeze({ type, ...(reason ? { reason } : {}), ...(theme ? { theme } : {}) }),
  });
}

/**
 * Vérifie une expérience. Retourne un tableau de problèmes (vide = conforme).
 * Appelé par `validate-lessons.mjs` et par les tests des leçons.
 */
export function checkExperience(exp, { where = 'experience' } = {}) {
  const problems = [];
  if (!exp || typeof exp !== 'object') return [`${where}: missing experience object`];
  const { source, experience } = exp;
  if (!source || source.type !== 'textbook' || typeof source.elementId !== 'string' || source.elementId === '') {
    problems.push(`${where}: source must cite a textbook elementId — the mathematics always comes from the textbook`);
  }
  if (!experience || !EXPERIENCE_TYPES.includes(experience.type)) {
    problems.push(`${where}: experience.type must be one of ${EXPERIENCE_TYPES.join('/')}`);
  } else if (experience.type !== 'textbook') {
    // Un contexte remplacé DOIT dire pourquoi : c'est la règle « jamais
    // silencieusement » (§33). Une adaptation sans raison est un défaut.
    if (!ADAPTATION_REASONS.includes(experience.reason)) {
      problems.push(`${where}: an adapted context must carry one of these reasons: ${ADAPTATION_REASONS.join('/')}`);
    }
    if (experience.theme !== undefined && !VISUAL_THEME_IDS.includes(experience.theme)) {
      problems.push(`${where}: unknown visual theme '${experience.theme}'`);
    }
  }
  return problems;
}

/**
 * Vérifie un couple de niveaux. Ce que la forme GARANTIT, et que les tests
 * verrouillent :
 *
 *   1. les deux niveaux existent — jamais un seul (§3 du brief) ;
 *   2. chacun cite sa source du manuel et déclare son expérience ;
 *   3. chacun porte son objectif mathématique, et les DEUX objectifs sont
 *      le même — c'est la définition de « même concept, deux expériences » ;
 *   4. `advanced` n'est pas « beginner avec de plus grands nombres » : il
 *      doit déclarer ce qu'il retire comme étayage ou ce qu'il ajoute comme
 *      exigence (`autonomy`), sans quoi ce n'est pas un second niveau.
 */
export function checkLevelPair(pair, { where = 'levels' } = {}) {
  const problems = [];
  if (!pair || typeof pair !== 'object') return [`${where}: missing level pair`];
  for (const id of MANIPULATION_LEVEL_IDS) {
    const lvl = pair[id];
    if (!lvl || typeof lvl !== 'object') { problems.push(`${where}: missing '${id}' level`); continue; }
    if (typeof lvl.objective !== 'string' || lvl.objective === '') {
      problems.push(`${where}.${id}: objective must be a non-empty string (the mathematical objective, identical at both levels)`);
    }
    if (!lvl.numbers || typeof lvl.numbers !== 'object') {
      problems.push(`${where}.${id}: numbers must be an object`);
    }
    problems.push(...checkExperience(lvl, { where: `${where}.${id}` }));
  }
  const b = pair.beginner; const a = pair.advanced;
  if (b?.objective && a?.objective && b.objective !== a.objective) {
    problems.push(`${where}: both levels must serve the SAME mathematical objective — the context may change, the objective may not`);
  }
  if (a && (typeof a.autonomy !== 'string' || a.autonomy === '')) {
    problems.push(`${where}.advanced: must declare its 'autonomy' — what scaffolding it removes or what it demands more of. 'Beginner with bigger numbers' is not an advanced level.`);
  }
  return problems;
}

/** Le niveau demandé, borné — un id inconnu retombe sur `beginner`, jamais sur rien. */
export function resolveLevelId(id) {
  return MANIPULATION_LEVEL_IDS.includes(id) ? id : DEFAULT_MANIPULATION_LEVEL;
}
