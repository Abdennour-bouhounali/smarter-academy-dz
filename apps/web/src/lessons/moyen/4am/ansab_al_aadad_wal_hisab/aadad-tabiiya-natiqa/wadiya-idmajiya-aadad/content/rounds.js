/**
 * MODULE 7 « وضعية الوحدة » DANS LE LECTEUR DE MISSION (la synthèse de l'unité 1, 2026-11-12 — recette PROVISOIRE de la synthèse, point 5) :
 * UN `LabRounds` sur des nombres FRÈRES de la وضعية des tabliers (deux sortes d'objets, le plus grand nombre d'écoles, la part de chaque école),
 * jamais ses nombres ni sa solution (content/forbidden.js, recalculé et balayé par content/mission.test.js).
 *
 *   r1 « لوازم المدارس » (`common-divisors`, les groupes, à la main) : 42 أقلام و 35 كرّاسًا sur le plus grand nombre d'écoles — l'élève ajoute
 *      les écoles une à une : 7 écoles tombent juste, 8 non ; puis il lit la part (6 et 5) et BÂTIT 42 = 7 × 6. Entraînement : 15 et 6.
 *   r2 « المخزن الكبير » (`euclidean-algorithm`, avec prédictions) : 816 et 697 — trop grands pour ajouter les écoles une à une : les
 *      divisions successives donnent les restes 119, 102, 17, 0 ; le PGCD 17 posé, la chaîne `share` (ajout de la synthèse, additif) finit sur
 *      la construction NUMÉRIQUE 816 = 17 × 48. Entraînement : 57 et 38.
 *   free : le labo d'Euclide, libre.
 * Les manches d'entraînement LIBÈRENT leur manche (`easier.releases`) : un élève bloqué ne l'est ni des étapes au crayon ni du défi 🏆.
 */
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
export { gcd };

/** Les mots de l'école sur la scène des cartables (`theme: 'school'` dessine des stylos et des cahiers dans des cartables). */
export const SCHOOL_WORDS = {
  group: 'مدرسة', groups: 'مدارس', theGroups: 'المدارس', stock: 'حقائب المدارس', add: 'أضف مدرسة', remove: 'أزل مدرسة',
};
/** La part de chaque école, dite par la chaîne `share` du labo d'Euclide. */
export const SHARE_WORDS = { all: 'كل الأقلام', groups: 'عدد المدارس', each: 'أقلام كل مدرسة' };

export const SUPPLY = { a: 42, b: 35 };
export const SUPPLY_EASY = { a: 15, b: 6 };
export const STORE = { a: 816, b: 697 };
export const STORE_EASY = { a: 57, b: 38 };
export const FREE_PAIRS = [STORE, STORE_EASY, { a: 408, b: 153 }, { a: 98, b: 70 }];

const free = { handDone: true, chains: [], predict: false, checkpoints: false, levels: false };
/** « le plus grand nombre d'écoles est VU » : le PGCD tombé juste, et un nombre plus grand essayé. */
const greatestSeen = ({ a, b }) => [{ exact: gcd(a, b) }, { above: gcd(a, b) }];
const help = 'جرّب أوّلًا بعددين أصغر، ثم عُد.';

export const M7_ROUNDS = [
  {
    id: 'r1', title: 'لوازم المدارس', goal: [{ checkpoint: 'groups' }], stars: { maxTrials: 9, predict: false },
    easier: {
      goal: greatestSeen(SUPPLY_EASY), helpLine: help, releases: true, stars: { maxTrials: 6, predict: false },
      props: { type: 'common-divisors', ...SUPPLY_EASY, theme: 'school', context: SCHOOL_WORDS, ...free,
        lead: `جولة تدريب: ${SUPPLY_EASY.a} قلمًا و ${SUPPLY_EASY.b} كراريس. ما أكبر عدد من المدارس لا يبقى معه شيء؟` },
    },
    props: {
      type: 'common-divisors', ...SUPPLY, theme: 'school', context: SCHOOL_WORDS, levels: false, chains: ['groups'], predict: false,
      lead: `${SUPPLY.a} قلمًا و ${SUPPLY.b} كرّاسًا تُوزَّع كلّها على مدارس: لكل مدرسة العدد نفسه من الأقلام والعدد نفسه من الكراريس. أضف المدارس واحدة بعد الأخرى: ما أكبر عدد من المدارس لا يبقى معه شيء؟`,
    },
  },
  {
    id: 'r2', title: 'المخزن الكبير', goal: [{ checkpoint: 'pgcd' }], stars: { maxTrials: 1 },
    easier: {
      goal: [{ exact: gcd(STORE_EASY.a, STORE_EASY.b) }], helpLine: help, releases: true, stars: { maxTrials: 1, predict: false },
      props: { type: 'euclidean-algorithm', ...STORE_EASY, ...free,
        lead: `جولة تدريب: ${STORE_EASY.a} و ${STORE_EASY.b}. اقسم حتى يصير الباقي 0، ثم ضع PGCD في خانته.` },
    },
    props: {
      type: 'euclidean-algorithm', ...STORE, levels: false, handDone: true, chains: ['pgcd'], predict: true, share: SHARE_WORDS,
      lead: `في المخزن الكبير ${STORE.a} قلمًا و ${STORE.b} كرّاسًا لأكبر عدد من المدارس. العددان كبيران على إضافة المدارس واحدة واحدة: يمثّلهما الشريطان. توقّع قبل كل قسمة، ثم ضع PGCD في خانته.`,
    },
  },
  {
    id: 'free', free: true, title: 'المخزن الحرّ',
    props: { type: 'euclidean-algorithm', ...FREE_PAIRS[2], ...free, choices: FREE_PAIRS, lead: 'المخزن الحرّ: اختر عددين وطبّق خوارزمية إقليدس.' },
  },
];
