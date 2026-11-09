/**
 * L'ATELIER DE COUTURE pour la leçon : les deux labos de rubans joués en MANCHES avec étoiles dans le lecteur de mission (rollout 2026-11-08,
 * traitement v2 : prédire au début d'une coupe / d'une division → compter d'un toucher → BÂTIR la première étape, la chaîne dans la colonne
 * du labo, une seconde chance plus petite).
 *
 *   MODULE 1 (`pgcd-differences`) : 21 et 14 à la main avec ses questions → 252 et 140 (l'activité) avec prédictions → 378 et 315 (« de la même
 *              manière ») → défi ⭐ 91 et 65 → atelier libre.
 *   MODULE 3 (`euclidean-algorithm`) : 45 et 18 à la main avec ses questions → 765 et 135 (l'activité) avec prédictions → 3356 et 1528 → défi ⭐
 *              1938 et 836 → atelier libre.
 *
 * Une manche sans questions est gagnée quand le PGCD est posé (le labo le remonte comme verdict) ; la 3e étoile : posé juste du premier coup.
 * Aucun nombre de la مسألة (rubans de 210 et 150, PGCD 30) ne figure ici. Les vérités sont recalculées par content/ribbons.test.js.
 */
import { ACTIVITY_A, ACTIVITY_B } from './textbook.js';

export const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const pair = (a, b) => ({ a, b });
const free = { handDone: true, chains: [], predict: false, checkpoints: false, levels: false };
const placed = ({ a, b }) => [{ exact: gcd(a, b) }];

const D1 = pair(21, 14);
const D2 = pair(ACTIVITY_A.numbers.a, ACTIVITY_A.numbers.b);
const D3 = pair(ACTIVITY_A.numbers.second.a, ACTIVITY_A.numbers.second.b);
export const D_PRACTICE = { r2: pair(16, 12), r3: pair(15, 10) };
export const D_CHALLENGE = pair(91, 65);
export const D_FREE = [D1, D2, D3, D_CHALLENGE, pair(48, 36), pair(117, 91)];

const E1 = pair(45, 18);
const E2 = pair(ACTIVITY_B.numbers.a, ACTIVITY_B.numbers.b);
const E3 = pair(ACTIVITY_B.numbers.second.a, ACTIVITY_B.numbers.second.b);
export const E_PRACTICE = { r2: pair(50, 15), r3: pair(84, 36) };
export const E_CHALLENGE = pair(1938, 836);
export const E_FREE = [E1, E2, E3, E_CHALLENGE, pair(391, 221), pair(252, 140)];

const practice = (type, p, lead) => ({
  goal: placed(p),
  helpLine: 'جرّب أوّلًا بعددين أصغر، ثم عُد.',
  props: { type, ...p, theme: 'workshop', ...free, lead },
});

const DT = 'pgcd-differences';
export const M1_ROUNDS = [
  { id: 'r1', title: `${D1.a} سم و ${D1.b} سم`, goal: [{ checkpoint: 'pgcd' }], stars: { maxTrials: 1, predict: false },
    props: { type: DT, ...D1, levels: false, chains: ['cuts', 'pgcd'], predict: false,
      lead: `شريطان في ورشة الخياطة: ${D1.a} سم و ${D1.b} سم. اسحب الأصغر على الأكبر لتقصّ منه طوله، وأعد إلى أن لا يبقى شيء.` } },
  { id: 'r2', title: `${D2.a} سم و ${D2.b} سم`, goal: placed(D2), stars: { maxTrials: 1 },
    easier: practice(DT, D_PRACTICE.r2, `جولة تدريب: ${D_PRACTICE.r2.a} سم و ${D_PRACTICE.r2.b} سم. قصّ حتى لا يبقى شيء، ثم ضع PGCD في خانته.`),
    props: { type: DT, ...D2, levels: false, handDone: true, chains: [], predict: true,
      lead: `شريطان أطول: ${D2.a} سم و ${D2.b} سم. توقّع قبل القصّ، ثم ضع PGCD في خانته.` } },
  { id: 'r3', title: `${D3.a} سم و ${D3.b} سم`, goal: placed(D3), stars: { maxTrials: 1, predict: false },
    easier: practice(DT, D_PRACTICE.r3, `جولة تدريب: ${D_PRACTICE.r3.a} سم و ${D_PRACTICE.r3.b} سم. قصّ حتى لا يبقى شيء، ثم ضع PGCD في خانته.`),
    props: { type: DT, ...D3, ...free,
      lead: `بالطريقة نفسها: ${D3.a} سم و ${D3.b} سم. ما PGCD الشريطين؟` } },
  { id: 'challenge', optional: true, title: `تحدٍّ: ${D_CHALLENGE.a} و ${D_CHALLENGE.b}`, goal: placed(D_CHALLENGE), stars: { maxTrials: 1, predict: false },
    props: { type: DT, ...D_CHALLENGE, ...free, lead: `تحدٍّ: ${D_CHALLENGE.a} سم و ${D_CHALLENGE.b} سم. ما أطول قطعة تقيس الشريطين معًا؟` } },
  { id: 'free', free: true, title: 'الورشة الحرّة',
    props: { type: DT, ...D_FREE[4], ...free, choices: D_FREE, lead: 'الورشة الحرّة: اختر شريطين وقصّ كما تشاء.' } },
];

const ET = 'euclidean-algorithm';
export const M3_ROUNDS = [
  { id: 'r1', title: `${E1.a} سم و ${E1.b} سم`, goal: [{ checkpoint: 'pgcd' }], stars: { maxTrials: 1, predict: false },
    props: { type: ET, ...E1, levels: false, chains: ['divs', 'pgcd'], predict: false,
      lead: `شريطان: ${E1.a} سم و ${E1.b} سم. ضع نسخًا من الأصغر على الأكبر إلى أن لا تتّسع نسخة أخرى، ثم انقل ما يبقى.` } },
  { id: 'r2', title: `${E2.a} سم و ${E2.b} سم`, goal: placed(E2), stars: { maxTrials: 1 },
    easier: practice(ET, E_PRACTICE.r2, `جولة تدريب: ${E_PRACTICE.r2.a} سم و ${E_PRACTICE.r2.b} سم. اقسم حتى يصير الباقي 0، ثم ضع PGCD في خانته.`),
    props: { type: ET, ...E2, levels: false, handDone: true, chains: [], predict: true,
      lead: `شريطان طويلان: ${E2.a} سم و ${E2.b} سم. توقّع كم نسخة تدخل قبل أن تضعها، ثم ضع PGCD في خانته.` } },
  { id: 'r3', title: `${E3.a} و ${E3.b}`, goal: placed(E3), stars: { maxTrials: 1, predict: false },
    easier: practice(ET, E_PRACTICE.r3, `جولة تدريب: ${E_PRACTICE.r3.a} سم و ${E_PRACTICE.r3.b} سم. اقسم حتى يصير الباقي 0، ثم ضع PGCD في خانته.`),
    props: { type: ET, ...E3, ...free,
      lead: `بالطريقة نفسها: ${E3.a} و ${E3.b}. كم قسمة تلزم؟ وما PGCD؟` } },
  { id: 'challenge', optional: true, title: `تحدٍّ: ${E_CHALLENGE.a} و ${E_CHALLENGE.b}`, goal: placed(E_CHALLENGE), stars: { maxTrials: 1, predict: false },
    props: { type: ET, ...E_CHALLENGE, ...free, lead: `تحدٍّ: ${E_CHALLENGE.a} و ${E_CHALLENGE.b}. ما قاسمهما المشترك الأكبر؟` } },
  { id: 'free', free: true, title: 'الورشة الحرّة',
    props: { type: ET, ...E_FREE[4], ...free, choices: E_FREE, lead: 'الورشة الحرّة: اختر عددين وطبّق خوارزمية إقليدس.' } },
];
