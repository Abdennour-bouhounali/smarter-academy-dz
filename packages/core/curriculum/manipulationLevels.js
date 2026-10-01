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
