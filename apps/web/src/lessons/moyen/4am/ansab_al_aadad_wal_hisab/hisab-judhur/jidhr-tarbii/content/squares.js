/**
 * LES CARRÉS À ÉTIRER de la leçon : le labo `square-root-side` (mode refine) joué en MANCHES avec étoiles dans le lecteur de mission
 * (rollout 2026-11-09, traitement v2 ; conseil du 2026-11-09 : prédire → lire d'un toucher → BÂTIR → compter les décimales de c² → la règle).
 *
 *   MODULE 1 : 16 à la main avec ses questions (le côté tombe juste) → 5, le carré sur l'hypoténuse de l'activité, jusqu'au millième, avec deux
 *              prédictions (à 1 et à 0,01 — pas deux fois de suite : sinon c'est un motif, pas une prédiction) et ses questions (jamais juste) →
 *              2,25 (« pas à 1, mais oui à 0,1 » : la prédiction qui se RETOURNE ; manche REQUISE, conseil) → défi ⭐ 20 au centième en peu
 *              d'essais (la dichotomie) → jardin libre.
 *   MODULE 2 : 0,04 (l'exemple des معارف) avec ses questions → défi ⭐ 1,69 avec prédictions → jardin libre.
 *
 * Étoiles « peu d'essais » : un budget par graduation (≈ 4 relâchements par graduation affinée : la dichotomie, log₂ 10 ≈ 3,3 — conseil). Buts sans questions : { anyExact } (un côté
 * tombé juste), { bracketed: g } (encadré à la graduation 1/g). Aucun nombre de la مسألة (côtés 3 et 5, aire 34, la lecture 5,83…).
 * Les vérités sont recalculées par content/squares.test.js.
 */
const area = (num, den = 1) => ({ num, den });
const props = (a, maxScale, extra) => ({ type: 'square-root-side', mode: 'refine', num: a.num, den: a.den, scale: maxScale, ...extra });
const quiet = { chains: [], predict: false };

export const R1 = area(16);
export const ACT = area(5);
export const FLIP = area(225, 100);
export const CHALLENGE_M1 = area(20);
export const EXAMPLE = area(4, 100);
export const CHALLENGE_M2 = area(169, 100);
export const PRACTICE = { r1: area(4), r2: area(2), r3: area(25, 100), m2: area(1, 100) };
export const FREE_M1 = [R1, ACT, FLIP, CHALLENGE_M1, area(49, 100), area(7)];
export const FREE_M2 = [EXAMPLE, CHALLENGE_M2, area(49, 100), area(625, 100), area(3)];

const practice = (a, maxScale, goal, lead) => ({
  goal, helpLine: 'جرّب أوّلًا مربّعًا أصغر، ثم عُد.',
  props: props(a, maxScale, { ...quiet, handDone: true, lead }),
});

export const M1_ROUNDS = [
  { id: 'r1', title: 'المساحة 16', goal: [{ checkpoint: 'rule' }], stars: { maxTrials: 3, predict: false },
    easier: practice(PRACTICE.r1, 10, [{ anyExact: true }], 'جولة تدريب: مربّع مساحته 4. اسحب طرف الضلع حتى يغطّي المربّع المنقّط.'),
    props: props(R1, 10, { chains: ['exact'], predict: false,
      lead: 'مربّع مساحته 16. اسحب طرف الضلع على المسطرة حتى يغطّي مربّعك المربّعَ المنقّط تمامًا.' }) },
  { id: 'r2', title: 'المساحة 5', goal: [{ checkpoint: 'rule' }], stars: { maxTrials: 15 },
    easier: practice(PRACTICE.r2, 10, [{ bracketed: 10 }], 'جولة تدريب: مربّع مساحته 2. احصر ضلعه بين تدريجتين، ثم دقّق مرّة واحدة.'),
    props: props(ACT, 1000, { chains: ['never'], predict: true, predictAt: [1, 100], handDone: true,
      lead: 'مثلث قائم ضلعا زاويته القائمة 1 و 2، والمربّع المبنيّ على وتره مساحته 5. هل تجد طولًا مربّعه 5 بالضبط؟ إن لم تجده، احصره بين تدريجتين متجاورتين ثم دقّق.' }) },
  { id: 'r3', title: 'المساحة 2,25', goal: [{ anyExact: true }], stars: { maxTrials: 6 },
    easier: practice(PRACTICE.r3, 10, [{ anyExact: true }], 'جولة تدريب: مربّع مساحته 0,25.'),
    props: props(FLIP, 100, { chains: [], predict: true, predictAt: [1, 10], handDone: true,
      lead: 'مربّع مساحته 2,25. توقّع، ثم احصر ضلعه ودقّق: هل يقع يومًا على تدريجة؟' }) },
  { id: 'challenge', optional: true, title: 'تحدٍّ: المساحة 20', goal: [{ bracketed: 100 }], stars: { maxTrials: 11, predict: false },
    props: props(CHALLENGE_M1, 100, { ...quiet,
      lead: 'تحدٍّ: مربّع مساحته 20. احصر ضلعه حتى التدريجة 0,01 بأقلّ عدد من المحاولات: اختر كل مرّة منتصف ما بقي.' }) },
  { id: 'free', free: true, title: 'الحديقة الحرّة',
    props: props(FREE_M1[5], 100, { ...quiet, checkpoints: false, handDone: true, choices: FREE_M1,
      lead: 'الحديقة الحرّة: اختر مساحة واحصر ضلع مربّعها.' }) },
];

export const M2_ROUNDS = [
  { id: 'r1', title: 'المساحة 0,04', goal: [{ checkpoint: 'rule' }], stars: { maxTrials: 5, predict: false },
    easier: practice(PRACTICE.m2, 10, [{ anyExact: true }], 'جولة تدريب: مربّع مساحته 0,01.'),
    props: props(EXAMPLE, 100, { chains: ['exact'], predict: false,
      lead: 'مربّع مساحته 0,04. احصر ضلعه بين تدريجتين، ثم دقّق حتى يغطّي مربّعك المربّعَ المنقّط.' }) },
  { id: 'challenge', optional: true, title: 'تحدٍّ: المساحة 1,69', goal: [{ anyExact: true }], stars: { maxTrials: 6 },
    props: props(CHALLENGE_M2, 100, { chains: [], predict: true, predictAt: [1, 10], handDone: true,
      lead: 'تحدٍّ: مربّع مساحته 1,69. توقّع، ثم جد ضلعه.' }) },
  { id: 'free', free: true, title: 'الحديقة الحرّة',
    props: props(FREE_M2[2], 100, { ...quiet, checkpoints: false, handDone: true, choices: FREE_M2,
      lead: 'الحديقة الحرّة: اختر مساحة واحصر ضلع مربّعها.' }) },
];
