// Oracle du banc « alaqat-muthallathiya » (unité 10 « حساب المثلثات في المثلث القائم ») — chaque réponse RECALCULÉE ici,
// sans lire le contenu ni packages/core/arithmetic/trigonometry.js : les valeurs exactes rationnelles en fractions
// exactes (helpers.mjs, `q`), les racines et les angles avec Math.sqrt / Math.sin… EN DEGRÉS et un arrondi écrit ici.
// Les QCM sont recalculés aussi (`pick` : exactement une option vraie, dans l'ordre AFFICHÉ — chaque option est
// évaluée numériquement : une identité testée sur plusieurs angles, une valeur comparée à la vraie).
// Fusionné dans scripts/practice-answer-oracle.test.mjs. Généré avec le banc par le script de l'auteur
// (gen.py, scratchpad de l'unité 10).
import { R, C, q } from './helpers.mjs';

const LETTERS = ['A', 'B', 'C', 'D'];
function pick(flags) {
  const ok = flags.map((f, i) => (f ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`alaqat-muthallathiya oracle: ${ok.length} options vraies`);
  return C(ok[0]);
}
const RAD = Math.PI / 180;
const sin = (d) => Math.sin(d * RAD);
const cos = (d) => Math.cos(d * RAD);
const tan = (d) => Math.tan(d * RAD);
const asin = (v) => Math.asin(v) / RAD;
const acos = (v) => Math.acos(v) / RAD;
const atan = (v) => Math.atan(v) / RAD;
const near = (a, b) => Math.abs(a - b) < 1e-9;
/** L'arrondi décimal (« المدوّر إلى الجزء من 10^d »), en chaîne à point — indépendant de trigonometry.roundTo. */
const round = (x, d) => (Math.round(x * 10 ** d + 1e-9) / 10 ** d).toFixed(d);
/** Une identité f = g vérifiée sur des angles aigus variés (vraie partout, ou fausse quelque part). */
const id1 = (f, g) => [10, 25, 30, 45, 60, 73, 85].every((d) => near(f(d), g(d)));

export const ORACLE = {
  'ex-4am-alaqat-muthallathiya-l1-001:q1': pick([id1(d => cos(d) ** 2, d => sin(d) ** 2 - 1), id1(d => cos(d), d => 1 - sin(d)), id1(d => cos(d) ** 2, d => 1 - sin(d) ** 2)]),
  'ex-4am-alaqat-muthallathiya-l1-002:q1': R(q('0.87').mul('0.87').add(q('0.5').mul('0.5'))),
  'ex-4am-alaqat-muthallathiya-l1-003:q1': pick([near(2 * sin(30), 0.25), near(sin(30) ** 2, 0.25), near(sin(30 * 30), 0.25)]),
  'ex-4am-alaqat-muthallathiya-l1-004:q1': R(q('0.6').div('0.8')),
  'ex-4am-alaqat-muthallathiya-l1-005:q1': R(q(12).div(13).mul(q(12).div(13)).add(q(5).div(13).mul(q(5).div(13)))),
  'ex-4am-alaqat-muthallathiya-l1-006:q1': pick([false, false, true]),
  'ex-4am-alaqat-muthallathiya-l1-007:q1': pick([near(3 / 4, 0.75), near(3 / Math.sqrt(16 - 9), 0.75), Math.sqrt(9 - 16) > 0]),
  'ex-4am-alaqat-muthallathiya-l1-008:q1': pick([-0.5 > 0 && -0.5 < 1, 0.9 > 0 && 0.9 < 1, 1.1 > 0 && 1.1 < 1]),
  'ex-4am-alaqat-muthallathiya-l1-009:q1': pick([near((3 / 5) / (4 / 5), 4 / 3), near((3 / 5) / (4 / 5), 3 / 5), near((3 / 5) / (4 / 5), 3 / 4)]),
  'ex-4am-alaqat-muthallathiya-l1-010:q1': R(q(3).div(4)),
  'ex-4am-alaqat-muthallathiya-l2-001:q1': R(Math.sqrt(1 - 0.6 ** 2).toFixed(6).replace(/0+$/, "")),
  'ex-4am-alaqat-muthallathiya-l2-001:q2': R(q('0.8').div('0.6')),
  'ex-4am-alaqat-muthallathiya-l2-002:q1': pick([near(21 / 25, Math.sqrt(1 - 0.16)), near(Math.sqrt(21) / 25, Math.sqrt(1 - 0.16)), near(Math.sqrt(21) / 5, Math.sqrt(1 - 0.16)), near(0.6, Math.sqrt(1 - 0.16))]),
  'ex-4am-alaqat-muthallathiya-l2-003:q1': R(round(Math.sqrt(1 - 0.4 ** 2), 2)),
  'ex-4am-alaqat-muthallathiya-l2-004:q1': pick([near(Math.SQRT2 / 2, Math.sqrt(1 - 0.5)), near(0.5, Math.sqrt(1 - 0.5)), near(1 - Math.SQRT2 / 2, Math.sqrt(1 - 0.5))]),
  'ex-4am-alaqat-muthallathiya-l2-005:q1': R(round((Math.sqrt(3) / 2) / 0.5, 2)),
  'ex-4am-alaqat-muthallathiya-l2-006:q1': pick([near(0.25, Math.sqrt(1 - 0.75)), near(1 - Math.sqrt(3) / 2, Math.sqrt(1 - 0.75)), near(0.5, Math.sqrt(1 - 0.75))]),
  'ex-4am-alaqat-muthallathiya-l2-007:q1': R(q(12).div(13)),
  'ex-4am-alaqat-muthallathiya-l2-008:q1': pick([near(Math.sqrt(3) / 4, tan(60)), near(1 / Math.sqrt(3), tan(60)), near(Math.sqrt(3), tan(60))]),
  'ex-4am-alaqat-muthallathiya-l2-009:q1': pick([false, near(2 / 3, 2 / 3), near(Math.sqrt(9 - 4) / 3, 2 / 3)]),
  'ex-4am-alaqat-muthallathiya-l2-010:q1': R(q(7)),
  'ex-4am-alaqat-muthallathiya-l3-001:q1': R(round(asin(2 / 5), 1)),
  'ex-4am-alaqat-muthallathiya-l3-002:q1': R(round(atan(7 / 3), 1)),
  'ex-4am-alaqat-muthallathiya-l3-003:q1': R(round(asin(3 / 5), 1)),
  'ex-4am-alaqat-muthallathiya-l3-004:q1': pick([near(3 / Math.sqrt(9 + 16), 0.75), near(Math.sqrt(16 - 9) / 4, 0.75), near(3 / 4, 0.75)]),
  'ex-4am-alaqat-muthallathiya-l3-004:q2': R(round(acos(3 / 4), 1)),
  'ex-4am-alaqat-muthallathiya-l3-005:q1': pick([near(1 / 2, sin(60)), near(Math.sqrt(3) / 2, sin(60)), near(3 / 4, sin(60))]),
  'ex-4am-alaqat-muthallathiya-l3-006:q1': pick([near(Math.SQRT2 / 2, cos(45)), near(Math.SQRT2, cos(45)), near(0.5, cos(45))]),
  'ex-4am-alaqat-muthallathiya-l3-007:q1': R(Math.sqrt(1 - 0.28 ** 2).toFixed(6).replace(/0+$/, "")),
  'ex-4am-alaqat-muthallathiya-l3-008:q1': R(q(3).div(4).mul(q(4).div(5))),
  'ex-4am-alaqat-muthallathiya-l3-009:q1': pick([near(3 * Math.sqrt(5) / 2, (2 / 7) / (3 * Math.sqrt(5) / 7)), near(6 * Math.sqrt(5) / 49, (2 / 7) / (3 * Math.sqrt(5) / 7)), near(2 * Math.sqrt(5) / 15, (2 / 7) / (3 * Math.sqrt(5) / 7))]),
  'ex-4am-alaqat-muthallathiya-l3-010:q1': R(q(5).div('2.5')),
  'ex-4am-alaqat-muthallathiya-l4-001:q1': pick([3 / 2 < 1, 3 / 2 > 1, 3 / 2 < 1]),
  'ex-4am-alaqat-muthallathiya-l4-002:q1': pick([Math.sqrt(5) / 2 < 1, Math.sqrt(5) / 2 > 1]),
  'ex-4am-alaqat-muthallathiya-l4-003:q1': pick([near(Math.sqrt(21) / 2, (Math.sqrt(21) / 5) / 0.4), near(2 * Math.sqrt(21) / 21, (Math.sqrt(21) / 5) / 0.4), near(Math.sqrt(21) / 5, (Math.sqrt(21) / 5) / 0.4)]),
  'ex-4am-alaqat-muthallathiya-l4-004:q1': R(round(acos(0.18), 0)),
  'ex-4am-alaqat-muthallathiya-l4-005:q1': R(round(atan(5.4), 1)),
  'ex-4am-alaqat-muthallathiya-l4-006:q1': R(round(atan(3 / 8), 1)),
  'ex-4am-alaqat-muthallathiya-l4-007:q1': R(Math.sqrt(1 - 0.96 ** 2).toFixed(6).replace(/0+$/, "")),
  'ex-4am-alaqat-muthallathiya-l4-008:q1': pick([near(cos(45) + sin(45), 1), !near(cos(30) + sin(30), 1) && near(cos(30) ** 2 + sin(30) ** 2, 1), near(cos(30) + sin(30), 1)]),
  'ex-4am-alaqat-muthallathiya-l4-009:q1': pick([near(0.5, sin(45)), near(1, sin(45)), near(Math.SQRT2 / 2, sin(45))]),
  'ex-4am-alaqat-muthallathiya-l4-010:q1': pick([near(Math.sqrt(15) / 4, Math.sqrt(1 - 1 / 16)), near(1, Math.sqrt(15) * 0.25), near(4 * Math.sqrt(15), Math.sqrt(15) * 0.25)]),
  'ex-4am-alaqat-muthallathiya-l5-001:q1': R(Math.sqrt(1 - 0.28 ** 2).toFixed(6).replace(/0+$/, "")),
  'ex-4am-alaqat-muthallathiya-l5-001:q2': R(q('0.28').div(q(Math.sqrt(1 - 0.28 ** 2).toFixed(6)))),
  'ex-4am-alaqat-muthallathiya-l5-002:q1': pick([1.08 < 1, 0.08 < 1 && 1.08 < 1, 0.08 < 1 && 1.08 > 1]),
  'ex-4am-alaqat-muthallathiya-l5-002:q2': R(round(Math.sqrt(1 - 0.08 ** 2), 3)),
  'ex-4am-alaqat-muthallathiya-l5-003:q1': pick([5 > 13, near(5 / 13, 5 / 13), near(5 / Math.sqrt(25 + 169), 5 / 13)]),
  'ex-4am-alaqat-muthallathiya-l5-003:q2': R(round(acos(5 / 13), 1)),
  'ex-4am-alaqat-muthallathiya-l5-004:q1': R(round(0.6 / Math.sqrt(1 - 0.36), 6).replace(/0+$/, "")),
  'ex-4am-alaqat-muthallathiya-l5-005:q1': R(q(3).div(5)),
  'ex-4am-alaqat-muthallathiya-l5-005:q2': R(round((4 / 5) / Math.sqrt(1 - 16 / 25), 2)),
  'ex-4am-alaqat-muthallathiya-l5-006:q1': R(round(atan(2 / 3), 1)),
  'ex-4am-alaqat-muthallathiya-l5-007:q1': R(q(12).div(13)),
  'ex-4am-alaqat-muthallathiya-l5-008:q1': pick([3 + 4 === 5, 3 ** 2 === 4 ** 2 + 5 ** 2, 3 ** 2 + 4 ** 2 === 5 ** 2]),
  'ex-4am-alaqat-muthallathiya-l5-009:q1': pick([near(Math.sqrt(1 - 0.64), 0.36), near(Math.sqrt(1 - 0.64), 0.6), near(Math.sqrt(1 - 0.64), 0.2)]),
  'ex-4am-alaqat-muthallathiya-l5-010:q1': R(round(acos(3 / 5), 1)),
};
