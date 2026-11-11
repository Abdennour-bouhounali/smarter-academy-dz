/**
 * LES GROUPES ET LES LISTES pour toute la leçon : le labo `common-divisors` (ajouter un groupe à la fois ; tous les objets se
 * redistribuent ; puis les deux listes de diviseurs et la case PGCD) joué en MANCHES avec étoiles dans le lecteur de mission
 * (rollout 2026-11-08, traitement v2 : prédire → observer d'un toucher → bâtir a = k × q, le journal des essais dans le labo,
 * une seconde chance plus petite).
 *
 *   MODULE 1 : 12 balles et 18 maillots, à la main avec ses questions → les 90 fleurs rouges et 54 blanches de l'activité, avec
 *              prédictions (« جرّب كل الإمكانيات » s'ouvre) → les LISTES de 90 et 54 et la case PGCD → défi ⭐ 60 et 45 → terrain libre.
 *   MODULE 2 : les listes de 28 et 42 (l'exemple des معارف) avec leurs questions → défi ⭐ 45 et 75 → listes libres.
 *
 * Aucun nombre de la مسألة (120 roses rouges, 84 blanches, PGCD 12) ne figure ici. Les vérités sont recalculées par
 * content/bouquets.test.js.
 */
import { ACTIVITY, STARTER } from './textbook.js';

const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
/** « le plus grand nombre de groupes est VU » : le PGCD tombé juste, et un nombre plus grand essayé (comme greatestGroupFound) */
const greatestSeen = (a, b) => [{ exact: gcd(a, b) }, { above: gcd(a, b) }];

const START = { a: STARTER.numbers.a, b: STARTER.numbers.b };
const BOOK = { a: ACTIVITY.numbers.red, b: ACTIVITY.numbers.white };
export const PRACTICE = { groups: { a: 8, b: 12 }, lists: { a: 6, b: 9 }, lists2: { a: 10, b: 15 } };
export const CHALLENGE_M1 = { a: 60, b: 45 };
export const CHALLENGE_M2 = { a: 45, b: 75 };
export const FREE_GROUPS = [START, { a: 8, b: 12 }, { a: 20, b: 30 }, { a: 24, b: 40 }, CHALLENGE_M1, BOOK];
export const FREE_LISTS = [{ a: 28, b: 42 }, { a: 20, b: 30 }, { a: 32, b: 48 }, CHALLENGE_M2, { a: 64, b: 40 }, BOOK];

const free = { handDone: true, chains: [], predict: false, checkpoints: false, levels: false };

/** La seconde chance (« لا بأس — جرّب أصغر ») : des nombres qu'on voit d'un coup d'œil, sans questions ni étoiles. */
const practiceGroups = ({ a, b }, theme, lead) => ({
  goal: greatestSeen(a, b),
  helpLine: 'جرّب أوّلًا بعددين أصغر، ثم عُد.',
  props: { type: 'common-divisors', a, b, theme, ...free, lead },
});
const practiceLists = ({ a, b }, lead) => ({
  goal: [{ exact: gcd(a, b) }],
  helpLine: 'جرّب أوّلًا بعددين أصغر، ثم عُد.',
  props: { type: 'common-divisors', a, b, startWith: 'lists', ...free, lead },
});

export const M1_ROUNDS = [
  { id: 'r1', title: `${START.a} كرة و ${START.b} قميصًا`, goal: [{ checkpoint: 'groups' }], stars: { maxTrials: 8, predict: false },
    props: { type: 'common-divisors', ...START, theme: 'football', levels: false, chains: ['groups'], predict: false,
      lead: `${START.a} كرة و ${START.b} قميصًا تُوزَّع كلّها على فرق متماثلة. أضف الفرق واحدًا بعد الآخر: ما أكبر عدد من الفرق لا يبقى معه شيء؟` } },
  { id: 'r2', title: `${BOOK.a} زهرة حمراء و ${BOOK.b} بيضاء`, goal: greatestSeen(BOOK.a, BOOK.b), stars: { maxTrials: 20 },
    easier: practiceGroups(PRACTICE.groups, 'garden', `جولة تدريب: ${PRACTICE.groups.a} زهرات حمراء و ${PRACTICE.groups.b} بيضاء. ما أكبر عدد من الباقات؟`),
    props: { type: 'common-divisors', ...BOOK, theme: 'garden', levels: false, handDone: true, chains: [], predict: true,
      lead: `${BOOK.a} زهرة حمراء و ${BOOK.b} زهرة بيضاء تدخل كلّها في باقات متماثلة. توقّع قبل كل باقة جديدة، ثم جد أكبر عدد من الباقات.` } },
  { id: 'r3', title: `قواسم ${BOOK.a} وقواسم ${BOOK.b}`, goal: [{ checkpoint: 'lists' }], stars: { predict: false },
    easier: practiceLists(PRACTICE.lists, `جولة تدريب: قواسم ${PRACTICE.lists.a} وقواسم ${PRACTICE.lists.b}. ضع المشتركة في الوسط وأكبرها في خانة PGCD.`),
    props: { type: 'common-divisors', ...BOOK, startWith: 'lists', levels: false, chains: ['lists'], predict: false,
      lead: `كل عدد من الباقات نجح يقسم ${BOOK.a} و ${BOOK.b} معًا. ضع القواسم المشتركة في الوسط، وأكبرها في خانة PGCD.` } },
  { id: 'challenge', optional: true, title: `تحدٍّ: ${CHALLENGE_M1.a} و ${CHALLENGE_M1.b}`, goal: greatestSeen(CHALLENGE_M1.a, CHALLENGE_M1.b), stars: { maxTrials: 17, predict: false },
    props: { type: 'common-divisors', ...CHALLENGE_M1, theme: 'garden', ...free,
      lead: `تحدٍّ: ${CHALLENGE_M1.a} زهرة حمراء و ${CHALLENGE_M1.b} بيضاء. ما أكبر عدد من الباقات المتماثلة؟` } },
  { id: 'free', free: true, title: 'المحلّ الحرّ',
    props: { type: 'common-divisors', ...FREE_GROUPS[2], theme: 'garden', ...free, choices: FREE_GROUPS,
      lead: 'المحلّ الحرّ: اختر عددين وجرّب ما تشاء.' } },
];

export const M2_ROUNDS = [
  { id: 'r1', title: 'قواسم 28 وقواسم 42', goal: [{ checkpoint: 'lists' }], stars: { predict: false },
    easier: practiceLists(PRACTICE.lists2, `جولة تدريب: قواسم ${PRACTICE.lists2.a} وقواسم ${PRACTICE.lists2.b}. ضع المشتركة في الوسط وأكبرها في خانة PGCD.`),
    props: { type: 'common-divisors', a: 28, b: 42, startWith: 'lists', levels: false, chains: ['lists'], predict: false,
      lead: 'اكشف قواسم 28 وقواسم 42، ثم ضع القواسم المشتركة في الوسط، وأكبرها في خانة PGCD.' } },
  { id: 'challenge', optional: true, title: `تحدٍّ: ${CHALLENGE_M2.a} و ${CHALLENGE_M2.b}`, goal: [{ exact: gcd(CHALLENGE_M2.a, CHALLENGE_M2.b) }], stars: { predict: false },
    props: { type: 'common-divisors', ...CHALLENGE_M2, startWith: 'lists', ...free,
      lead: `تحدٍّ: ما القواسم المشتركة للعددين ${CHALLENGE_M2.a} و ${CHALLENGE_M2.b}؟ وما أكبرها؟` } },
  { id: 'free', free: true, title: 'القوائم الحرّة',
    props: { type: 'common-divisors', ...FREE_LISTS[1], startWith: 'lists', ...free, choices: FREE_LISTS,
      lead: 'القوائم الحرّة: اختر عددين وجد قواسمهما المشتركة.' } },
];
