/**
 * LES TROUSSES ET LES LISTES pour la leçon : le labo `coprime-explorer` joué en MANCHES avec étoiles dans le lecteur de mission
 * (rollout 2026-11-09, traitement v2 : prédire → compter d'un toucher → BÂTIR l'égalité de ce qui reste, le journal des essais dans la
 * colonne du labo, une seconde chance plus petite).
 *
 *   MODULE 1 (les trousses, thème `school`) : 8 stylos et 9 cahiers à la main avec ses questions → 17 et 18 avec prédictions et
 *            « جرّب كل الإمكانيات » → défi ⭐ 21 et 28 (un k > 1 marche : 7) → terrain libre.
 *   MODULE 2 (les listes) : 15 et 22 avec ses questions → 35 et 48 avec une prédiction → défi ⭐ 51 et 85 (le commun caché 17) → terrain libre.
 *
 * Buts sans questions : trousses — « tout essayé » = { exact: 1 } + { above: min − 1 } (une trousse s'ajoute une à une : atteindre min(a ; b)
 * passe par chaque k), ou { exact: k } quand un k > 1 réfute ; listes — un « تحقّق » concluant ({ exact: 1 } premiers entre eux, sinon
 * { exact: le commun posé }). Aucun nombre de la مسألة (26, 45, 39, 65, PGCD 13). Les vérités sont recalculées par content/kits.test.js.
 */
export const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const pair = (a, b) => ({ a, b });
const free = { chains: [], predict: false, checkpoints: false, levels: false };
/** « Tout essayé » (premiers entre eux) : k = 1 marche, et le plus grand k possible a été atteint. */
const allTried = ({ a, b }) => [{ exact: 1 }, { above: Math.min(a, b) - 1 }];

export const START = pair(8, 9);
export const ACT = pair(17, 18);
export const CHALLENGE_M1 = pair(21, 28);
export const EXAMPLE = pair(15, 22);
export const SECOND = pair(35, 48);
export const CHALLENGE_M2 = pair(51, 85);
export const PRACTICE = { m1: pair(5, 6), m1r2: pair(7, 8), m2: pair(4, 9), m2r2: pair(8, 15) };
export const FREE_PAIRS = [START, ACT, CHALLENGE_M1, pair(10, 21), pair(12, 18), pair(14, 15)];
export const FREE_LISTS = [EXAMPLE, SECOND, pair(27, 36), pair(16, 25), pair(34, 51), pair(20, 33)];

const groupsPractice = (p, lead) => ({
  goal: allTried(p), helpLine: 'جرّب أوّلًا بعددين أصغر، ثم عُد.',
  props: { type: 'coprime-explorer', ...p, startWith: 'groups', theme: 'school', ...free, handDone: true, lead },
});
const listsPractice = (p, lead) => ({
  goal: [{ exact: 1 }], helpLine: 'جرّب أوّلًا بعددين أصغر، ثم عُد.',
  props: { type: 'coprime-explorer', ...p, ...free, lead },
});

export const M1_ROUNDS = [
  { id: 'r1', title: `${START.a} و ${START.b}`, goal: [{ checkpoint: 'groups' }], stars: { maxTrials: Math.min(START.a, START.b), predict: false },
    easier: groupsPractice(PRACTICE.m1, `جولة تدريب: ${PRACTICE.m1.a} أقلام و ${PRACTICE.m1.b} كراريس. جرّب كل عدد من الحقائب.`),
    props: { type: 'coprime-explorer', ...START, startWith: 'groups', theme: 'school', levels: false, chains: ['groups'], predict: false,
      lead: `${START.a} أقلام و ${START.b} كراريس لحقائب متماثلة. أضف الحقائب واحدة بعد أخرى: أيّ عدد منها يوزّع كل شيء؟` } },
  { id: 'r2', title: `${ACT.a} و ${ACT.b}`, goal: allTried(ACT), stars: { maxTrials: Math.min(ACT.a, ACT.b) },
    easier: groupsPractice(PRACTICE.m1r2, `جولة تدريب: ${PRACTICE.m1r2.a} أقلام و ${PRACTICE.m1r2.b} كراريس.`),
    props: { type: 'coprime-explorer', ...ACT, startWith: 'groups', theme: 'school', levels: false, chains: [], predict: true, handDone: true,
      lead: `${ACT.a} قلمًا و ${ACT.b} كراسًا. توقّع قبل أن تضيف، ثم جرّب كل الإمكانيات: هل ينجح عدد غير 1؟` } },
  { id: 'challenge', optional: true, title: `تحدٍّ: ${CHALLENGE_M1.a} و ${CHALLENGE_M1.b}`, goal: [{ exact: gcd(CHALLENGE_M1.a, CHALLENGE_M1.b) }],
    stars: { maxTrials: gcd(CHALLENGE_M1.a, CHALLENGE_M1.b), predict: false },
    props: { type: 'coprime-explorer', ...CHALLENGE_M1, startWith: 'groups', theme: 'school', ...free,
      lead: `تحدٍّ: ${CHALLENGE_M1.a} قلمًا و ${CHALLENGE_M1.b} كراسًا. هل هما أوليان فيما بينهما؟ أضف الحقائب حتى تعرف.` } },
  { id: 'free', free: true, title: 'الطاولة الحرّة',
    props: { type: 'coprime-explorer', ...FREE_PAIRS[3], startWith: 'groups', theme: 'school', ...free, handDone: true, choices: FREE_PAIRS,
      lead: 'الطاولة الحرّة: اختر عددين ووزّعهما كما تشاء.' } },
];

export const M2_ROUNDS = [
  { id: 'r1', title: `${EXAMPLE.a} و ${EXAMPLE.b}`, goal: [{ checkpoint: 'lists' }], stars: { maxTrials: 1, predict: false },
    easier: listsPractice(PRACTICE.m2, `جولة تدريب: ${PRACTICE.m2.a} و ${PRACTICE.m2.b}. اختبر قواسم العدد الأصغر، ثم «تحقّق».`),
    props: { type: 'coprime-explorer', ...EXAMPLE, levels: false, chains: ['lists'], predict: false,
      lead: `${EXAMPLE.a} و ${EXAMPLE.b}: أنزل قواسم ${EXAMPLE.a} إلى الوسط واحدًا واحدًا، ثم «تحقّق».` } },
  { id: 'r2', title: `${SECOND.a} و ${SECOND.b}`, goal: [{ exact: 1 }], stars: { maxTrials: 1 },
    easier: listsPractice(PRACTICE.m2r2, `جولة تدريب: ${PRACTICE.m2r2.a} و ${PRACTICE.m2r2.b}.`),
    props: { type: 'coprime-explorer', ...SECOND, levels: false, chains: [], predict: true,
      lead: `${SECOND.a} و ${SECOND.b}: توقّع أوّلًا، ثم أثبت بالقائمتين.` } },
  { id: 'challenge', optional: true, title: `تحدٍّ: ${CHALLENGE_M2.a} و ${CHALLENGE_M2.b}`, goal: [{ exact: gcd(CHALLENGE_M2.a, CHALLENGE_M2.b) }],
    stars: { maxTrials: 1, predict: false },
    props: { type: 'coprime-explorer', ...CHALLENGE_M2, ...free,
      lead: `تحدٍّ: ${CHALLENGE_M2.a} و ${CHALLENGE_M2.b} فرديان، ولا يقسمهما 3 ولا 5 معًا. هل هما أوليان فيما بينهما؟` } },
  { id: 'free', free: true, title: 'القوائم الحرّة',
    props: { type: 'coprime-explorer', ...FREE_LISTS[2], ...free, choices: FREE_LISTS, lead: 'القوائم الحرّة: اختر عددين وأثبت أو انفِ.' } },
];
