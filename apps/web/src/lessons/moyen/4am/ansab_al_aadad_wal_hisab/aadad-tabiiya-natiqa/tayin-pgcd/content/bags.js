/**
 * LES TROUSSES ET LES LISTES pour la leçon : le labo `common-divisors` joué en MANCHES avec étoiles dans le lecteur de mission (rollout
 * 2026-11-08, traitement v2 du labo — voir qasim-mushtarak-akbar › content/bouquets.js) :
 *
 *   MODULE 1 : 8 stylos et 12 cahiers à la main avec ses questions → 20 et 30 avec prédictions (« جرّب كل الإمكانيات » s'ouvre) → les LISTES
 *              de 42 et 60 (l'activité du manuel) avec leurs questions → défi ⭐ 48 et 72 → listes libres.
 *
 * Aucun nombre de la مسألة (90 stylos, 126 cahiers, PGCD 18) ne figure ici. Les vérités sont recalculées par content/bags.test.js.
 */
import { ACTIVITY } from './textbook.js';

const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
/** « le plus grand nombre de groupes est VU » : le PGCD tombé juste, et un nombre plus grand essayé */
const greatestSeen = (a, b) => [{ exact: gcd(a, b) }, { above: gcd(a, b) }];

const START = { a: 8, b: 12 };
const PREDICT = { a: 20, b: 30 };
const BOOK = { a: ACTIVITY.numbers.a, b: ACTIVITY.numbers.b };
export const PRACTICE = { groups: { a: 6, b: 9 }, lists: { a: 10, b: 15 } };
export const CHALLENGE = { a: 48, b: 72 };
export const FREE_LISTS = [BOOK, START, PREDICT, { a: 28, b: 42 }, CHALLENGE, { a: 45, b: 75 }];

const free = { handDone: true, chains: [], predict: false, checkpoints: false, levels: false };

export const M1_ROUNDS = [
  { id: 'r1', title: `${START.a} أقلام و ${START.b} كراسًا`, goal: [{ checkpoint: 'groups' }], stars: { maxTrials: 6, predict: false },
    props: { type: 'common-divisors', ...START, theme: 'school', levels: false, chains: ['groups'], predict: false,
      lead: `عندنا ${START.a} أقلام و ${START.b} كراسًا، نريد وضعها كلّها في حقائب متماثلة. أضف الحقائب واحدة بعد أخرى: ما أكبر عدد منها لا يبقى معه شيء؟` } },
  { id: 'r2', title: `${PREDICT.a} قلمًا و ${PREDICT.b} كراسًا`, goal: greatestSeen(PREDICT.a, PREDICT.b), stars: { maxTrials: 12 },
    easier: {
      goal: greatestSeen(PRACTICE.groups.a, PRACTICE.groups.b),
      helpLine: 'جرّب أوّلًا بعددين أصغر، ثم عُد.',
      props: { type: 'common-divisors', ...PRACTICE.groups, theme: 'school', ...free,
        lead: `جولة تدريب: ${PRACTICE.groups.a} أقلام و ${PRACTICE.groups.b} كراريس. ما أكبر عدد من الحقائب؟` },
    },
    props: { type: 'common-divisors', ...PREDICT, theme: 'school', levels: false, handDone: true, chains: [], predict: true,
      lead: `${PREDICT.a} قلمًا و ${PREDICT.b} كراسًا في حقائب متماثلة. توقّع قبل كل حقيبة جديدة، ثم جد أكبر عدد من الحقائب.` } },
  { id: 'r3', title: `قواسم ${BOOK.a} وقواسم ${BOOK.b}`, goal: [{ checkpoint: 'lists' }], stars: { predict: false },
    easier: {
      goal: [{ exact: gcd(PRACTICE.lists.a, PRACTICE.lists.b) }],
      helpLine: 'جرّب أوّلًا بعددين أصغر، ثم عُد.',
      props: { type: 'common-divisors', ...PRACTICE.lists, startWith: 'lists', ...free,
        lead: `جولة تدريب: قواسم ${PRACTICE.lists.a} وقواسم ${PRACTICE.lists.b}. ضع المشتركة في الوسط وأكبرها في خانة PGCD.` },
    },
    props: { type: 'common-divisors', ...BOOK, startWith: 'lists', levels: false, chains: ['lists'], predict: false,
      lead: `العددان ${BOOK.a} و ${BOOK.b} كبيران على الحقائب: نعمل على قائمتَي قواسمهما. ضع القواسم المشتركة في الوسط، وأكبرها في خانة PGCD.` } },
  { id: 'challenge', optional: true, title: `تحدٍّ: ${CHALLENGE.a} و ${CHALLENGE.b}`, goal: [{ exact: gcd(CHALLENGE.a, CHALLENGE.b) }], stars: { predict: false },
    props: { type: 'common-divisors', ...CHALLENGE, startWith: 'lists', ...free,
      lead: `تحدٍّ: ${CHALLENGE.b} له اثنا عشر قاسمًا. ما القواسم المشتركة للعددين ${CHALLENGE.a} و ${CHALLENGE.b}؟ وما أكبرها؟` } },
  { id: 'free', free: true, title: 'القوائم الحرّة',
    props: { type: 'common-divisors', ...FREE_LISTS[3], startWith: 'lists', ...free, choices: FREE_LISTS,
      lead: 'القوائم الحرّة: اختر عددين وجد قاسمهما المشترك الأكبر.' } },
];
