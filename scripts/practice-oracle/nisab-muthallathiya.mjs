// Oracle du banc « nisab-muthallathiya » (unité 10 « حساب المثلثات في المثلث القائم ») — chaque réponse construite
// RECALCULÉE ici, sans lire le contenu ni packages/core/arithmetic/trigonometry.js : un rapport exact en rationnels
// (helpers.mjs, q), une longueur approchée avec Math.sin / cos / tan en DEGRÉS et l'arrondi de l'oracle (au demi
// supérieur, `rnd`). Les QCM sont vérifiés par l'aller-retour du validateur. Écrit par le générateur de l'auteur
// (scratchpad unit10-nisab-muthallathiya/gen/gen.py) ; fusionné dans scripts/practice-answer-oracle.test.mjs.
import { R, q } from './helpers.mjs';

const D = Math.PI / 180;
const sin = (d) => Math.sin(d * D);
const cos = (d) => Math.cos(d * D);
const tan = (d) => Math.tan(d * D);
/** L'arrondi de l'oracle : au demi supérieur, à `d` décimales, écrit avec un point. */
const rnd = (x, d) => (Math.round(x * 10 ** d + 1e-9) / 10 ** d).toFixed(d);

export const ORACLE = {
  'ex-4am-nisab-muthallathiya-l2-001:q1': R(q(3).div(5)),
  'ex-4am-nisab-muthallathiya-l2-002:q1': R(q(3).div(4)),
  'ex-4am-nisab-muthallathiya-l2-003:q1': R(q('1.2').div(q('3.5'))),
  'ex-4am-nisab-muthallathiya-l2-004:q1': R(q('10.4').div(q('7.8'))),
  'ex-4am-nisab-muthallathiya-l2-005:q1': R(q(15).div(17)),
  'ex-4am-nisab-muthallathiya-l2-006:q1': R(q(24).div(25)),
  'ex-4am-nisab-muthallathiya-l2-008:q1': R(rnd(10 * sin(30), 0)),
  'ex-4am-nisab-muthallathiya-l3-001:q1': R(rnd(2.5 / sin(25), 2)),
  'ex-4am-nisab-muthallathiya-l3-002:q1': R(rnd(3.5 * cos(37), 1)),
  'ex-4am-nisab-muthallathiya-l3-003:q1': R(rnd(4.5 * tan(53), 2)),
  'ex-4am-nisab-muthallathiya-l3-004:q1': R(rnd(Math.sqrt(18), 1)),
  'ex-4am-nisab-muthallathiya-l3-005:q1': R(rnd(2.8 / tan(72), 1)),
  'ex-4am-nisab-muthallathiya-l3-006:q1': R(rnd(10 * cos(55), 2)),
  'ex-4am-nisab-muthallathiya-l3-007:q1': R(rnd(5.2 * sin(23), 1)),
  'ex-4am-nisab-muthallathiya-l3-008:q1': R(rnd(14 / Math.sqrt(14 * 14 + 17 * 17), 2)),
  'ex-4am-nisab-muthallathiya-l4-004:q1': R(rnd(120 / cos(18), 0)),
  'ex-4am-nisab-muthallathiya-l4-005:q1': R(rnd(4 * sin(70), 2)),
  'ex-4am-nisab-muthallathiya-l4-006:q1': R(rnd(0.5 / tan(5), 2)),
  'ex-4am-nisab-muthallathiya-l5-001:q1': R(rnd(45 * sin(32), 1)),
  'ex-4am-nisab-muthallathiya-l5-002:q1': R(rnd(25 * sin(65), 1)),
  'ex-4am-nisab-muthallathiya-l5-003:q1': R(rnd(3.2 * sin(25), 2)),
  'ex-4am-nisab-muthallathiya-l5-003:q2': R(rnd(3.2 * cos(25), 2)),
  'ex-4am-nisab-muthallathiya-l5-004:q1': R(rnd(6 * tan(35), 2)),
  'ex-4am-nisab-muthallathiya-l5-004:q2': R(rnd(6 / cos(35), 2)),
  'ex-4am-nisab-muthallathiya-l5-007:q1': R(rnd(800 * sin(15), 0)),
  'ex-4am-nisab-muthallathiya-l5-008:q1': R(rnd(15.5 * sin(62), 1)),
  'ex-4am-nisab-muthallathiya-l5-010:q1': R(rnd(1.6 * sin(32), 2)),
};
