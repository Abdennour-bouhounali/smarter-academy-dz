// Oracle du banc « tarrid-muthallathiya » (unité 10 « حساب المثلثات في المثلث القائم », درس 4) — chaque réponse construite
// RECALCULÉE ici à partir des nombres de l'énoncé : Math.sin / cos / tan en DEGRÉS, les fonctions inverses en degrés, Pythagore,
// et un arrondi « au plus près » écrit ici (rnd), sans lire le contenu ni packages/core/arithmetic/trigonometry.js. Fusionné dans
// scripts/practice-answer-oracle.test.mjs. Les QCM sont vérifiés par l'aller-retour du validateur. Écrit par le générateur de
// l'auteur (scratchpad unit10-tarrid-muthallathiya/gen/gen.py).
import { R } from './helpers.mjs';

const rad = (d) => (d * Math.PI) / 180;
const sin = (d) => Math.sin(rad(d));
const cos = (d) => Math.cos(rad(d));
const tan = (d) => Math.tan(rad(d));
const asin = (v) => (Math.asin(v) * 180) / Math.PI;
const acos = (v) => (Math.acos(v) * 180) / Math.PI;
const atan = (v) => (Math.atan(v) * 180) / Math.PI;
/** L'arrondi du manuel (« المدوّر إلى الجزء من 10 / 100 / إلى الوحدة ») : au plus près, n décimales, écrit avec un point. */
const rnd = (x, n) => { const k = 10 ** n; return (Math.floor(x * k + 0.5 + 1e-9) / k).toFixed(n); };

export const ORACLE = {
  'ex-4am-tarrid-muthallathiya-l1-006:q1': R(90 - 38),
  'ex-4am-tarrid-muthallathiya-l1-007:q1': R(Math.sqrt(9 ** 2 + 12 ** 2)),
  'ex-4am-tarrid-muthallathiya-l2-001:q1': R(rnd(1.6 / sin(59), 1)),
  'ex-4am-tarrid-muthallathiya-l2-002:q1': R(rnd(10 * tan(36), 1)),
  'ex-4am-tarrid-muthallathiya-l2-003:q1': R(rnd(30 * sin(50), 1)),
  'ex-4am-tarrid-muthallathiya-l2-004:q1': R(rnd(8 * tan(35), 1)),
  'ex-4am-tarrid-muthallathiya-l2-005:q1': R(rnd(6 * sin(5), 2)),
  'ex-4am-tarrid-muthallathiya-l2-006:q1': R(rnd(8 * cos(40), 2)),
  'ex-4am-tarrid-muthallathiya-l2-007:q1': R(rnd(7 * tan(25), 2)),
  'ex-4am-tarrid-muthallathiya-l2-008:q1': R(rnd(asin(1.2 / 3), 0)),
  'ex-4am-tarrid-muthallathiya-l2-009:q1': R(rnd(asin(3 / 5), 0)),
  'ex-4am-tarrid-muthallathiya-l2-010:q1': R(Math.sqrt(5 ** 2 - 3 ** 2)),
  'ex-4am-tarrid-muthallathiya-l3-001:q1': R(rnd(6 * sin(18), 1)),
  'ex-4am-tarrid-muthallathiya-l3-001:q2': R(rnd(6 * cos(18), 1)),
  'ex-4am-tarrid-muthallathiya-l3-002:q1': R(rnd(9 / tan(32), 2)),
  'ex-4am-tarrid-muthallathiya-l3-002:q2': R(rnd(9 / sin(32), 1)),
  'ex-4am-tarrid-muthallathiya-l3-003:q1': R(rnd(atan(18 / 25), 0)),
  'ex-4am-tarrid-muthallathiya-l3-004:q1': R(rnd(12 * sin(70), 1)),
  'ex-4am-tarrid-muthallathiya-l3-004:q2': R(rnd(12 * cos(70), 1)),
  'ex-4am-tarrid-muthallathiya-l3-005:q1': R(rnd(290 * tan(31), 0)),
  'ex-4am-tarrid-muthallathiya-l3-006:q1': R(rnd(5 / sin(28), 2)),
  'ex-4am-tarrid-muthallathiya-l3-007:q1': R(90 - (180 - 30) / 2),
  'ex-4am-tarrid-muthallathiya-l3-007:q2': R(rnd(10 * cos(15), 2)),
  'ex-4am-tarrid-muthallathiya-l3-008:q1': R(rnd(10.35 / 4.5, 1)),
  'ex-4am-tarrid-muthallathiya-l3-008:q2': R(rnd(asin(2.3 / 2.7), 0)),
  'ex-4am-tarrid-muthallathiya-l3-009:q1': R(Math.sqrt(5 ** 2 + 12 ** 2)),
  'ex-4am-tarrid-muthallathiya-l3-009:q2': R(rnd(atan(12 / 5), 0)),
  'ex-4am-tarrid-muthallathiya-l3-010:q2': R(rnd(acos(3.4 / 4.25), 0)),
  'ex-4am-tarrid-muthallathiya-l4-001:q1': R(rnd(1.9 / tan(18), 1)),
  'ex-4am-tarrid-muthallathiya-l4-002:q2': R(Math.sqrt(5 ** 2 - 3 ** 2)),
  'ex-4am-tarrid-muthallathiya-l4-002:q3': R(rnd(acos(3 / 5), 0)),
  'ex-4am-tarrid-muthallathiya-l4-003:q1': R(rnd(10 * sin(15), 2)),
  'ex-4am-tarrid-muthallathiya-l4-003:q2': R(rnd((10 * cos(15)) ** 2 + (10 * sin(15)) ** 2, 0)),
  'ex-4am-tarrid-muthallathiya-l4-004:q1': R(180 - rnd(asin(2.3 / 2.7), 0)),
  'ex-4am-tarrid-muthallathiya-l4-005:q1': R(90 - 35),
  'ex-4am-tarrid-muthallathiya-l4-005:q2': R(rnd(12 * cos(35), 2)),
  'ex-4am-tarrid-muthallathiya-l4-005:q3': R(rnd(12 * sin(35), 2)),
  'ex-4am-tarrid-muthallathiya-l4-006:q1': R(rnd(Math.sqrt(7 ** 2 + 4 ** 2), 2)),
  'ex-4am-tarrid-muthallathiya-l4-006:q2': R(rnd(atan(4 / 7), 0)),
  'ex-4am-tarrid-muthallathiya-l4-007:q1': R(Math.sqrt(10 ** 2 - 6 ** 2)),
  'ex-4am-tarrid-muthallathiya-l4-007:q2': R(rnd(acos(6 / 10), 0)),
  'ex-4am-tarrid-muthallathiya-l4-008:q1': R(rnd(Math.sqrt(3.5 ** 2 + 2 ** 2), 2)),
  'ex-4am-tarrid-muthallathiya-l4-008:q2': R(rnd(2 * atan(2 / 3.5), 0)),
  'ex-4am-tarrid-muthallathiya-l4-009:q1': R(rnd(5 * sin(50), 2)),
  'ex-4am-tarrid-muthallathiya-l4-009:q2': R(rnd(8 * 5 * sin(50), 1)),
  'ex-4am-tarrid-muthallathiya-l4-010:q2': R(rnd(asin(7 / 25), 0)),
  'ex-4am-tarrid-muthallathiya-l5-001:q1': R(rnd(40 * tan(28), 1)),
  'ex-4am-tarrid-muthallathiya-l5-001:q2': R(rnd(1.5 + 40 * tan(28), 1)),
  'ex-4am-tarrid-muthallathiya-l5-002:q2': R(rnd(20 * tan(30) / (1 - tan(30)), 1)),
  'ex-4am-tarrid-muthallathiya-l5-003:q1': R(rnd(50 * sin(62), 1)),
  'ex-4am-tarrid-muthallathiya-l5-003:q2': R(rnd(50 * cos(62), 1)),
  'ex-4am-tarrid-muthallathiya-l5-004:q1': R(rnd(800 * tan(12), 0)),
  'ex-4am-tarrid-muthallathiya-l5-004:q2': R(rnd(800 / cos(12), 0)),
  'ex-4am-tarrid-muthallathiya-l5-005:q1': R(rnd(atan(9 / 100), 0)),
  'ex-4am-tarrid-muthallathiya-l5-005:q2': R(rnd(Math.sqrt(100 ** 2 + 9 ** 2), 1)),
  'ex-4am-tarrid-muthallathiya-l5-006:q1': R(rnd(600 * sin(18), 0)),
  'ex-4am-tarrid-muthallathiya-l5-006:q2': R(rnd(600 * cos(18), 0)),
  'ex-4am-tarrid-muthallathiya-l5-007:q1': R(rnd(4 / sin(52), 1)),
  'ex-4am-tarrid-muthallathiya-l5-007:q2': R(rnd(4 / tan(52), 2)),
  'ex-4am-tarrid-muthallathiya-l5-008:q1': R(rnd(64 / tan(8), 0)),
  'ex-4am-tarrid-muthallathiya-l5-009:q1': R(rnd(4.5 / cos(35), 2)),
  'ex-4am-tarrid-muthallathiya-l5-009:q2': R(rnd(4.5 * tan(35), 2)),
  'ex-4am-tarrid-muthallathiya-l5-010:q1': R(rnd(40 * sin(25), 1)),
  'ex-4am-tarrid-muthallathiya-l5-010:q2': R(rnd(40 * cos(25), 1)),
};
