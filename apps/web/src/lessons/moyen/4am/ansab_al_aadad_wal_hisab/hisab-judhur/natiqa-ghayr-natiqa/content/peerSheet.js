import * as squareRoots from '@smarter-academy/core/arithmetic/squareRoots.js';

const { rationalSqrt } = squareRoots;

/**
 * « ورقة زميل » du module 2 (rollout 2026-11-09, unité 2 leçon 2) — contenu PROPRE à la plateforme : le camarade est inventé (KidFigure).
 * L'idée fausse visée : juger « مربّع عدد ناطق » sur le NUMÉRATEUR seul — « 49 = 7², donc √(49/20) est ناطق ». Le critère porte sur la fraction
 * entière (irréductible) : 49/20 n'est pas le carré d'un rationnel car 20 n'est pas un carré. Les nombres sont CALCULÉS, jamais retapés ;
 * la lecture de la calculatrice est arrondie à 9 décimales comme sur l'écran.
 */
export const AREA = { num: 49, den: 20 };
const ROOT_NUM = 7; // √49
const HALF_DEN = AREA.den / 2; // le faux « dénominateur » de la 2e fausse correction
export const CALC = Math.sqrt(AREA.num / AREA.den).toFixed(9).replace('.', ',');
const frac = (p, q) => `\\dfrac{${p}}{${q}}`;
const A = frac(AREA.num, AREA.den);
const LOW = Math.floor(Math.sqrt(AREA.den));
const HIGH = LOW + 1;

export const PEER_KID = { name: 'يونس', figure: { outfit: 'blue' } };

export const PEER_SHEET = {
  id: 'm2-younes',
  task: `صنّف يونس العدد $\\sqrt{${A}}$: ناطق أم غير ناطق؟`,
  lines: [
    `$${AREA.num} = ${ROOT_NUM}^2$: البسط مربّع العدد ${ROOT_NUM}.`,
    `إذن $${A}$ مربّع عدد ناطق، و $\\sqrt{${A}}$ عدد ناطق.`,
    `الخلاصة: $\\sqrt{${A}}$ من صنف الجذور التي تقع على تدريجة.`,
  ],
  errorLine: 1,
  // la conclusion découle de l'erreur : corrigée elle aussi, barrée puis réécrite (revue ECC 2026-11-09)
  fixedLines: [null, null, `الخلاصة: $\\sqrt{${A}}$ من صنف الجذور التي لا تقع على أيّ تدريجة.`],
  fixes: [
    { text: `البسط وحده لا يكفي: الكسر $${A}$ مختزل، والمقام ${AREA.den} ليس مربّعًا، لأنّ $${LOW}^2 = ${LOW * LOW}$ و $${HIGH}^2 = ${HIGH * HIGH}$. إذن $${A}$ ليس مربّع عدد ناطق و $\\sqrt{${A}}$ ليس عددًا ناطقًا.`, ok: true },
    { text: `$\\sqrt{${A}} = ${frac(ROOT_NUM, HALF_DEN)}$ لأنّ $\\sqrt{${AREA.num}} = ${ROOT_NUM}$ ونصف ${AREA.den} هو ${HALF_DEN}.`, why: `$\\left(${frac(ROOT_NUM, HALF_DEN)}\\right)^2 = ${frac(ROOT_NUM * ROOT_NUM, HALF_DEN * HALF_DEN)}$ وليس $${A}$: جذر المقام ليس نصفه.` },
    { text: `الحاسبة تعرض ${CALC}، وهو عدد عشري، إذن الجذر ناطق.`, why: `ما تعرضه الحاسبة قيمة مقرّبة فقط: مربّع ${CALC} لا يساوي $${A}$ بالضبط.` },
  ],
  why: 'العدد a مربّع عدد ناطق حين يكون البسط والمقام في كسره المختزل كلاهما مربّعًا: لا يكفي أن يكون أحدهما كذلك.',
};

/** Vérité (test) : 49/20 n'a pas de racine rationnelle. */
export const AREA_IS_SQUARE = Boolean(rationalSqrt(AREA));
