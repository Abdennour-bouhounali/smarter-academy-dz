/**
 * LE CHANTIER pour toute la leçon : le labo `divisor-properties` (deux murs en briques de longueur n ; on porte le mur de b pour
 * l'ALLER coller, l'ENLEVER, ou MESURER avec) joué en MANCHES avec étoiles dans le lecteur de mission (rollout 2026-11-08, traitement
 * v2 : prédire → observer d'un toucher → bâtir l'égalité, le journal des murs dans le labo, une seconde chance plus petite).
 *
 *   MODULE 1 : 3 | 18 et 12 (à la main, avec les questions) → les cas 2 et 3 du manuel à la suite (5 | 35 et 15, puis 7 | 56 et 21, avec
 *              prédiction) → 9 | 900 et 90 (trop de briques pour les compter : on PRÉDIT avec la propriété) → défi ⭐ → rayon libre.
 *              Seule la manche 1 se joue à la main ; ensuite chaque zone du chantier devient un bouton (`handDone`).
 *
 * Les cas des manuels sont les CAS DE LA LEÇON (ACTIVITY.cases) ; aucun nombre de la مسألة (briques de 25, murs de 875 et 350) ne
 * figure ici. Les vérités sont recalculées par content/walls.test.js.
 */
import { ACTIVITY } from './textbook.js';

const [CASE1, CASE2, CASE3] = ACTIVITY.cases;
const triple = ({ n, a, b }) => ({ n, a, b });

/** Les trois murs d'un cas : groups 1 (ألصق) · 2 (انزع) · 3 (قِس) ; un cas de plus décale de 3. */
const walls = (cases) => Array.from({ length: cases * 3 }, (_, i) => i + 1);

/**
 * LA SECONDE CHANCE (« لا بأس — جرّب أصغر ») : un cas plus petit, avec des nombres qu'on voit d'un coup d'œil, sans questions ni
 * étoiles ; but : les trois murs.
 */
const practice = ({ n, a, b }, lead) => ({
  goal: [{ allExact: walls(1) }],
  helpLine: 'جرّب أوّلًا بعددين أصغر، ثم عُد.',
  props: { type: 'divisor-properties', ...triple({ n, a, b }), handDone: true, chains: [], predict: false, checkpoints: false, lead },
});

export const PRACTICE_CASES = { r2: { n: 2, a: 8, b: 6 }, r3: { n: 3, a: 12, b: 9 }, r4: { n: 5, a: 50, b: 20 } };
export const BIG_CASE = { n: 9, a: 900, b: 90 };
export const CHALLENGE_CASE = { n: 12, a: 480, b: 84 };
export const FREE_CASES = [triple(CASE1), triple(CASE2), triple(CASE3), { n: 4, a: 60, b: 24 }, { n: 6, a: 90, b: 42 }, BIG_CASE, CHALLENGE_CASE];

export const M1_ROUNDS = [
  { id: 'r1', title: `${CASE1.n} | ${CASE1.a} و ${CASE1.b}`, goal: [{ checkpoint: 'rem' }], stars: { maxTrials: 3, predict: false },
    props: { type: 'divisor-properties', ...triple(CASE1), chains: ['sum', 'diff', 'rem'], predict: false,
      lead: `في الورشة جداران مبنيّان بطوب طوله ${CASE1.n}: طولاهما ${CASE1.a} و ${CASE1.b}. اسحب جدار b: ألصقه، ثم انزعه، ثم قِس به جدار a.` } },
  { id: 'r2', title: 'حالتان أخريان', goal: [{ allExact: walls(2) }], stars: { maxTrials: 6 },
    easier: practice(PRACTICE_CASES.r2, `جولة تدريب: ${PRACTICE_CASES.r2.n} يقسم ${PRACTICE_CASES.r2.a} و ${PRACTICE_CASES.r2.b}. ابنِ الجدران الثلاثة.`),
    props: { type: 'divisor-properties', ...triple(CASE2), sequence: [triple(CASE2), triple(CASE3)], handDone: true, chains: [], predict: true,
      lead: `هل يصحّ ما لاحظته مع أعداد أخرى؟ ${CASE2.n} يقسم ${CASE2.a} و ${CASE2.b}، ثم ${CASE3.n} يقسم ${CASE3.a} و ${CASE3.b}.` } },
  { id: 'r3', title: `أعداد لا تُعدّ: ${BIG_CASE.n} | ${BIG_CASE.a} و ${BIG_CASE.b}`, goal: [{ allExact: walls(1) }], stars: { maxTrials: 3 },
    easier: practice(PRACTICE_CASES.r4, `جولة تدريب: ${PRACTICE_CASES.r4.n} يقسم ${PRACTICE_CASES.r4.a} و ${PRACTICE_CASES.r4.b}. ابنِ الجدران الثلاثة.`),
    props: { type: 'divisor-properties', ...triple(BIG_CASE), handDone: true, chains: [], predict: true,
      lead: `الطوب هنا أصغر من أن يُعدّ: ${BIG_CASE.n} يقسم ${BIG_CASE.a} و ${BIG_CASE.b}. توقّع بالخاصية قبل أن تبني كل جدار.` } },
  { id: 'challenge', optional: true, title: `تحدٍّ: ${CHALLENGE_CASE.n} | ${CHALLENGE_CASE.a} و ${CHALLENGE_CASE.b}`, goal: [{ allExact: walls(1) }], stars: { maxTrials: 3, predict: false },
    props: { type: 'divisor-properties', ...triple(CHALLENGE_CASE), handDone: true, chains: [], predict: false, checkpoints: false,
      lead: `تحدٍّ: ${CHALLENGE_CASE.n} يقسم ${CHALLENGE_CASE.a} و ${CHALLENGE_CASE.b}. ابنِ الجدران الثلاثة وانظر كم طوبة في كل منها.` } },
  { id: 'free', free: true, title: 'الورشة الحرّة',
    props: { type: 'divisor-properties', ...triple({ n: 6, a: 90, b: 42 }), handDone: true, chains: [], predict: false, checkpoints: false, choices: FREE_CASES,
      lead: 'الورشة الحرّة: اختر الأعداد وجرّب ما تشاء.' } },
];
