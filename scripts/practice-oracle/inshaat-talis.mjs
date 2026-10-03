// Oracle du banc « inshaat-talis » (unité 9 « خاصية طالس ») — chaque réponse construite RECALCULÉE ici en rationnels
// exacts (helpers.mjs), sans lire le contenu ni packages/core/arithmetic/thales.js : parts d'un segment (k/n), point de
// rapport p/q (dedans p/(p + q), dehors p/|p − q|), quatrième proportionnel, Pythagore (comparé sur les CARRÉS, exacts).
// Les QCM calculables sont aussi recalculés (`pick` : exactement une option vraie). Fusionné dans
// scripts/practice-answer-oracle.test.mjs. Généré avec le banc par le script de l'auteur (gen-inshaat.mjs, scratchpad).
import { R, C, q } from './helpers.mjs';

const LETTERS = ['A', 'B', 'C', 'D'];
function pick(flags) {
  const ok = flags.map((f, i) => (f ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`inshaat-talis oracle: ${ok.length} options vraies`);
  return C(ok[0]);
}
const eq = (a, b) => q(a).sub(q(b)).isZero();

export const ORACLE = {
  'ex-4am-inshaat-talis-l1-001:q1': R(q(1).div(1 + 1 + 1)),
  'ex-4am-inshaat-talis-l1-002:q1': R(4),
  'ex-4am-inshaat-talis-l1-003:q1': pick([5, 4, 1].map((k) => k === 5)),
  'ex-4am-inshaat-talis-l1-004:q1': R(6 - 1),
  'ex-4am-inshaat-talis-l1-005:q1': R(q(12).div(3)),
  'ex-4am-inshaat-talis-l1-007:q1': pick([[3, 7, 2], [7, 3, 2], [2, 3, 7]].map(([a, b, c]) => eq(q(b).mul(c).div(a), q(14).div(3)))),
  'ex-4am-inshaat-talis-l1-008:q1': R(q(5).mul(3).div(2)),
  'ex-4am-inshaat-talis-l1-009:q1': R(2 + 3),
  'ex-4am-inshaat-talis-l1-010:q1': pick([q(2), q(4), q(1).div(4)].map((v) => eq(v, 1 * 1 + 1 * 1))),
  'ex-4am-inshaat-talis-l2-001:q1': R(7),
  'ex-4am-inshaat-talis-l2-002:q1': R(q(3).div(7).mul(7)),
  'ex-4am-inshaat-talis-l2-003:q1': R(q(3).div(3 + 2)),
  'ex-4am-inshaat-talis-l2-004:q1': pick([q(3).div(2), q(2).div(3), q(3).div(5)].map((v) => eq(v, q(3).div(2)))),
  'ex-4am-inshaat-talis-l2-005:q1': R(q(10).mul(2).div(2 + 3)),
  'ex-4am-inshaat-talis-l2-006:q1': R(q(7).mul(2).div(3)),
  'ex-4am-inshaat-talis-l2-007:q1': R(q(7).mul(q(10).div(7)).div(2)),
  'ex-4am-inshaat-talis-l2-008:q1': pick([[2, 3], [1, 12], [4, 9]].map(([a, b]) => a * a + b * b === 13)),
  'ex-4am-inshaat-talis-l2-009:q1': R(q(9).div(4)),
  'ex-4am-inshaat-talis-l2-010:q1': R(q(3).div(5)),
  'ex-4am-inshaat-talis-l3-001:q1': pick([q(4).div(9).n < q(4).div(9).d, false, q(4).div(9).n > q(4).div(9).d]),
  'ex-4am-inshaat-talis-l3-002:q1': R(q(11).div(11 + 7)),
  'ex-4am-inshaat-talis-l3-003:q1': R(q(2).div(2 + 5)),
  'ex-4am-inshaat-talis-l3-004:q1': pick([q(3).div(2), q(2).div(3), q(3).div(5)].map((v) => eq(v, q(3).div(2)))),
  'ex-4am-inshaat-talis-l3-005:q1': pick([q(4).mul(3).div(5), q(5).mul(4).div(3), q(5).mul(3).div(4)].map((v) => eq(v, q(12).div(5)))),
  'ex-4am-inshaat-talis-l3-006:q1': pick([[2, 3], [3, 2], [2, 13]].map(([k, n]) => eq(q(k).div(n), q(2).div(3)))),
  'ex-4am-inshaat-talis-l3-007:q1': R(q(2).div(5)),
  'ex-4am-inshaat-talis-l3-008:q1': R(q(9).mul(6).div(4)),
  'ex-4am-inshaat-talis-l3-009:q1': R(q(16).mul(3).div(5 + 3)),
  'ex-4am-inshaat-talis-l3-010:q1': R(q(2).div(3).mul(4)),
  'ex-4am-inshaat-talis-l4-001:q1': R(q(11).div(11 - 7)),
  'ex-4am-inshaat-talis-l4-002:q1': R(q(2).div(5 - 2)),
  'ex-4am-inshaat-talis-l4-003:q1': pick([3 < 5, 3 > 5, 3 === 5]),
  'ex-4am-inshaat-talis-l4-004:q1': R(q(4).div(4 - 1)),
  'ex-4am-inshaat-talis-l4-005:q1': R(q(2).div(3).mul(Math.sqrt(4 * 4 + 3 * 3))),
  'ex-4am-inshaat-talis-l4-006:q1': R(q(8).div(3).mul(2).div(q(10).div(3))),
  'ex-4am-inshaat-talis-l4-007:q1': pick([q(9).div(16).mul(5), q(225).div(16), q(16).div(9).mul(5)].map((v) => eq(v, q(3).div(4).mul(q(3).div(4)).mul(1 * 1 + 2 * 2)))),
  'ex-4am-inshaat-talis-l4-008:q1': R(q(18).mul(3).div(2 + 2 + 2 + 3)),
  'ex-4am-inshaat-talis-l4-009:q1': R(q(3).mul(q(5).div(3)).div(1)),
  'ex-4am-inshaat-talis-l4-010:q1': R(q(3).mul(10).div(5)),
  'ex-4am-inshaat-talis-l5-001:q1': R(q(2).div(3).mul(4).mul(q(2).div(3).mul(3)).div(2)),
  'ex-4am-inshaat-talis-l5-002:q1': R(2 + 3 + 2),
  'ex-4am-inshaat-talis-l5-002:q2': R(q(7).mul(3).div(7)),
  'ex-4am-inshaat-talis-l5-003:q1': R(q(3).div(3 + 1)),
  'ex-4am-inshaat-talis-l5-003:q2': R(q(3).div(3 - 1)),
  'ex-4am-inshaat-talis-l5-004:q1': pick([q(9).div(25).mul(10), q(36), q(25).div(9).mul(10)].map((v) => eq(v, q(3).div(5).mul(q(3).div(5)).mul(1 + 9)))),
  'ex-4am-inshaat-talis-l5-005:q1': R(q(6).mul(5).div(4)),
  'ex-4am-inshaat-talis-l5-006:q1': R(q(10).mul(1).div(1 + 2 + 2)),
  'ex-4am-inshaat-talis-l5-006:q2': R(q(10).mul(1 + 2).div(1 + 2 + 2)),
  'ex-4am-inshaat-talis-l5-007:q1': pick([true, false, eq(q(3).mul(2), 7)]),
  'ex-4am-inshaat-talis-l5-008:q1': R(q(3).div(2)),
  'ex-4am-inshaat-talis-l5-009:q1': pick([q(4).div(9).mul(2), q(4).div(9).mul(8), q(9).div(4).mul(2)].map((v) => eq(v, q(8).div(9)))),
  'ex-4am-inshaat-talis-l5-010:q1': R(q(4).div(9).add(1)),
};
