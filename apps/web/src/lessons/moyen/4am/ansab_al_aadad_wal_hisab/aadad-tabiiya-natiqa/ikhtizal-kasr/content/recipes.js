/**
 * LA CUISINE pour la leçon : le labo `fraction-reduction` (une recette n/d partagée en k parts identiques ; le chemin أ divise par des diviseurs
 * communs jusqu'à « لا يمكن الاختزال أكثر », le chemin ب divise UNE fois par le PGCD) joué en MANCHES avec étoiles dans le lecteur de mission
 * (rollout 2026-11-09, traitement v2 : prédire → compter d'un toucher → BÂTIR la première division, la chaîne dans la colonne du labo, une seconde
 * chance plus petite).
 *
 *   MODULE 1 : 12/18 à la main avec ses questions → 84/48 (le chemin de سمير) avec prédictions → défi ⭐ 126/90 → cuisine libre.
 *   MODULE 2 : 84/48 en une division (la question « pourquoi une seule suffit ») → 60/36 avec prédictions → défi ⭐ 595/560 → cuisine libre.
 *
 * Une manche sans questions est gagnée quand le chemin ب est fait (la division par le PGCD est le verdict) ; 3e étoile : du premier coup.
 * Aucun nombre de la مسألة (105 cuillères de sucre, 147 tasses, PGCD 21) ne figure ici. Les vérités sont recalculées par content/recipes.test.js.
 */
import { ACTIVITY } from './textbook.js';

export const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const frac = (n, d) => ({ n, d });
const free = { chains: [], predict: false, checkpoints: false, levels: false };
const pathB = ({ n, d }) => [{ exact: gcd(n, d) }];

const START = frac(12, 18);
const SAMIR = frac(ACTIVITY.numbers.n, ACTIVITY.numbers.d);
export const PRACTICE = { m1: frac(8, 12), m2: frac(10, 15), m2r2: frac(9, 12) };
export const CHALLENGE_M1 = frac(126, 90);
export const CHALLENGE_M2 = frac(595, 560);
export const FREE_FRACS = [START, SAMIR, frac(60, 36), frac(45, 75), CHALLENGE_M1, frac(28, 42)];

const practice = (p, lead) => ({
  goal: pathB(p),
  helpLine: 'جرّب أوّلًا بكسر أصغر، ثم عُد.',
  props: { type: 'fraction-reduction', ...p, ...free, lead },
});

export const M1_ROUNDS = [
  { id: 'r1', title: `${START.n}/${START.d}`, goal: [{ checkpoint: 'pgcd' }], stars: { maxTrials: 1, predict: false },
    props: { type: 'fraction-reduction', ...START, levels: false, chains: ['steps', 'pgcd'], predict: false,
      lead: `وصفة صغيرة: ${START.n} ملعقة سكّر لـ ${START.d} كوب دقيق. اقسمها حصصًا متماثلة حتى لا تستطيع المواصلة، ثم اقسمها مرّة واحدة.` } },
  { id: 'r2', title: `وصفة سمير: ${SAMIR.n}/${SAMIR.d}`, goal: pathB(SAMIR), stars: { maxTrials: 1 },
    easier: practice(PRACTICE.m1, `جولة تدريب: ${PRACTICE.m1.n}/${PRACTICE.m1.d}. اختزل خطوة بخطوة، ثم مرّة واحدة.`),
    props: { type: 'fraction-reduction', ...SAMIR, levels: false, chains: [], predict: true,
      lead: `${SAMIR.n} ملعقة سكّر لـ ${SAMIR.d} كوب دقيق. توقّع، ثم اختزل خطوة بخطوة، ثم مرّة واحدة.` } },
  { id: 'challenge', optional: true, title: `تحدٍّ: ${CHALLENGE_M1.n}/${CHALLENGE_M1.d}`, goal: pathB(CHALLENGE_M1), stars: { maxTrials: 1, predict: false },
    props: { type: 'fraction-reduction', ...CHALLENGE_M1, ...free, lead: `تحدٍّ: اختزل ${CHALLENGE_M1.n}/${CHALLENGE_M1.d} حتى النهاية، ثم بقسمة واحدة.` } },
  { id: 'free', free: true, title: 'المطبخ الحرّ',
    props: { type: 'fraction-reduction', ...FREE_FRACS[3], ...free, choices: FREE_FRACS, lead: 'المطبخ الحرّ: اختر كسرًا واختزله كما تشاء.' } },
];

export const M2_ROUNDS = [
  { id: 'r1', title: `${SAMIR.n}/${SAMIR.d} مرّة واحدة`, goal: [{ checkpoint: 'pgcd' }], stars: { maxTrials: 1, predict: false },
    easier: practice(PRACTICE.m2, `جولة تدريب: ${PRACTICE.m2.n}/${PRACTICE.m2.d}. اختزل، ثم اقسم مرّة واحدة على PGCD.`),
    props: { type: 'fraction-reduction', ...SAMIR, path: [12], levels: false, chains: ['pgcd'], predict: false,
      lead: `${SAMIR.n}/${SAMIR.d} مرّة أخرى: اختزل كما تشاء، ثم جد العدد الذي يختزله في قسمة واحدة.` } },
  { id: 'r2', title: '60/36', goal: pathB(frac(60, 36)), stars: { maxTrials: 1 },
    easier: practice(PRACTICE.m2r2, `جولة تدريب: ${PRACTICE.m2r2.n}/${PRACTICE.m2r2.d}. اختزل، ثم اقسم مرّة واحدة على PGCD.`),
    props: { type: 'fraction-reduction', ...frac(60, 36), levels: false, chains: [], predict: true,
      lead: 'وصفة 60 ملعقة لـ 36 كوبًا: توقّع، ثم اختزل، ثم جد القسمة الواحدة.' } },
  { id: 'challenge', optional: true, title: `تحدٍّ: ${CHALLENGE_M2.n}/${CHALLENGE_M2.d}`, goal: pathB(CHALLENGE_M2), stars: { maxTrials: 1, predict: false },
    props: { type: 'fraction-reduction', ...CHALLENGE_M2, ...free, lead: `تحدٍّ: ${CHALLENGE_M2.n}/${CHALLENGE_M2.d}. القسمة الواحدة هنا على عدد أكبر من 12.` } },
  { id: 'free', free: true, title: 'المطبخ الحرّ',
    props: { type: 'fraction-reduction', ...FREE_FRACS[2], ...free, choices: FREE_FRACS, lead: 'المطبخ الحرّ: اختر كسرًا واختزله كما تشاء.' } },
];
