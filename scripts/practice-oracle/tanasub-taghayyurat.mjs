// Oracle du banc « tanasub-taghayyurat » (unité 7 « الدالة التآلفية ») — chaque réponse RECALCULÉE ici en
// rationnels exacts (helpers.mjs), à partir des COUPLES de l'énoncé, sans lire le contenu ni le code testé.
// Fusionné dans scripts/practice-answer-oracle.test.mjs. Généré avec le banc par le script de l'auteur
// (gen.mjs, scratchpad) ; ne pas éditer une entrée sans recalculer l'autre côté.
//   A(x1, y1, x2, y2)  le coefficient (y2 − y1) / (x2 − x1) ; B(…) = y1 − A·x1 ; fits(a, b, pts) : y = ax + b passe-t-il par pts ?
//   pick(flags)        la lettre de l'UNIQUE option vraie (zéro ou deux options vraies → erreur)
import { R, C, P, q, solve2 } from './helpers.mjs';

const A = (x1, y1, x2, y2) => q(y2).sub(y1).div(q(x2).sub(x1));
const B = (x1, y1, x2, y2) => q(y1).sub(A(x1, y1, x2, y2).mul(x1));
const fits = (a, b, pts) => pts.every(([x, y]) => q(a).mul(x).add(b).toString() === q(y).toString());
const LETTERS = ['A', 'B', 'C', 'D'];
function pick(flags) {
  const ok = flags.map((f, i) => (f ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`tanasub-taghayyurat oracle: ${ok.length} options vraies`);
  return C(ok[0]);
}

export const ORACLE = {
  'ex-4am-tanasub-taghayyurat-l1-001:q1': R(q(200).mul(4).add(2000).sub(q(200).mul(1).add(2000)).div(3)),
  'ex-4am-tanasub-taghayyurat-l1-001:q2': R(q(200).mul(6).add(2000).sub(q(200).mul(4).add(2000)).div(2)),
  'ex-4am-tanasub-taghayyurat-l1-002:q1': C('A') /* les trois quotients valent 200 = a (vérifié en l1-001) ; 2000 = b ; rien ne grandit */,
  'ex-4am-tanasub-taghayyurat-l1-003:q1': R(q(3).mul(5).add(1).sub(q(3).mul(2).add(1)).div(q(5).sub(2))),
  'ex-4am-tanasub-taghayyurat-l1-004:q1': R(A(1, 4, 3, 10)),
  'ex-4am-tanasub-taghayyurat-l1-005:q1': R(q(11).sub(q(2).mul(3))),
  'ex-4am-tanasub-taghayyurat-l1-006:q1': pick([[2, 5], [4, 5], [2, 9], [5, 2]].map(([a, b]) => fits(a, b, [[0, 5], [2, 9]]))),
  'ex-4am-tanasub-taghayyurat-l1-007:q1': R(A(2, 5, 6, 13)),
  'ex-4am-tanasub-taghayyurat-l1-008:q1': C('B') /* (ax1+b)−(ax2+b) = a(x1−x2) ; A oublie de diviser, C est l'inverse, D change le signe */,
  'ex-4am-tanasub-taghayyurat-l1-009:q1': R(q(7).sub(q(4).mul(1))),
  'ex-4am-tanasub-taghayyurat-l1-010:q1': P(A(2, 10, 4, 16), B(2, 10, 4, 16)),
  'ex-4am-tanasub-taghayyurat-l2-001:q1': R(A(10, 50, 30, 86)),
  'ex-4am-tanasub-taghayyurat-l2-001:q2': R(B(10, 50, 30, 86)),
  'ex-4am-tanasub-taghayyurat-l2-002:q1': R(A(-1, 2, 3, 10)),
  'ex-4am-tanasub-taghayyurat-l2-003:q1': R(A(1, 8, 5, -4)),
  'ex-4am-tanasub-taghayyurat-l2-003:q2': R(B(1, 8, 5, -4)),
  'ex-4am-tanasub-taghayyurat-l2-004:q1': pick([[8, -3], [-3, 2], [2, -3], [2, 5]].map(([a, b]) => fits(a, b, [[0, -3], [4, 5]]))),
  'ex-4am-tanasub-taghayyurat-l2-005:q1': R(A(2, 1, 6, 3)),
  'ex-4am-tanasub-taghayyurat-l2-005:q2': R(B(2, 1, 6, 3)),
  'ex-4am-tanasub-taghayyurat-l2-006:q1': R(A(2, 700, 5, 1300)),
  'ex-4am-tanasub-taghayyurat-l2-006:q2': R(B(2, 700, 5, 1300)),
  'ex-4am-tanasub-taghayyurat-l2-007:q1': pick([A(2, 4, 5, 13).toString() === "-3", A(2, 4, 5, 13).toString() === "3", A(2, 4, 5, 13).toString() === "9"]),
  'ex-4am-tanasub-taghayyurat-l2-008:q1': P(A(-2, -7, 1, 2), B(-2, -7, 1, 2)),
  'ex-4am-tanasub-taghayyurat-l2-009:q1': R(A(3, 7, 7, 7)),
  'ex-4am-tanasub-taghayyurat-l2-010:q1': R(A(0, 4, 2, 0)),
  'ex-4am-tanasub-taghayyurat-l2-010:q2': R(B(0, 4, 2, 0)),
  'ex-4am-tanasub-taghayyurat-l3-001:q1': pick([[36, 50], ['1.8', 5], ['1.8', 32], [32, '1.8']].map(([a, b]) => fits(a, b, [[10, 50], [30, 86]]))),
  'ex-4am-tanasub-taghayyurat-l3-002:q1': R(A(1, 2, 4, 4)),
  'ex-4am-tanasub-taghayyurat-l3-002:q2': R(B(1, 2, 4, 4)),
  'ex-4am-tanasub-taghayyurat-l3-003:q1': R(A(2, '3.5', 6, '5.5')),
  'ex-4am-tanasub-taghayyurat-l3-003:q2': R(B(2, '3.5', 6, '5.5').add(A(2, '3.5', 6, '5.5').mul(10))),
  'ex-4am-tanasub-taghayyurat-l3-004:q1': P(...solve2(3, 1, 11, 5, 1, 17)),
  'ex-4am-tanasub-taghayyurat-l3-005:q1': R(A(1, 5, 3, 11)),
  'ex-4am-tanasub-taghayyurat-l3-005:q2': R(q(11).add(A(1, 5, 3, 11).mul(q(7).sub(3)))),
  'ex-4am-tanasub-taghayyurat-l3-006:q1': R(A(-3, 5, 1, 3)),
  'ex-4am-tanasub-taghayyurat-l3-006:q2': R(B(-3, 5, 1, 3)),
  'ex-4am-tanasub-taghayyurat-l3-007:q1': pick([[40, 100], [200, 260], [65, 0], [40, 260]].map(([a, b]) => fits(a, b, [[4, 260], [9, 460]]))),
  'ex-4am-tanasub-taghayyurat-l3-007:q2': R(A(4, 260, 9, 460).mul(12).add(B(4, 260, 9, 460))),
  'ex-4am-tanasub-taghayyurat-l3-008:q1': R(q(-2).mul(7).add(5).sub(q(-2).mul(3).add(5)).div(4)),
  'ex-4am-tanasub-taghayyurat-l3-009:q1': R(B(4, 13, 8, 21)),
  'ex-4am-tanasub-taghayyurat-l3-010:q1': pick([false, fits(3, -2, [[2, 4], [5, 13]]), false]) /* A et C invoquent un critère faux : ce sont des NON */,
  'ex-4am-tanasub-taghayyurat-l4-001:q1': R(A(20, 68, 35, 95)),
  'ex-4am-tanasub-taghayyurat-l4-001:q2': R(B(20, 68, 35, 95)),
  'ex-4am-tanasub-taghayyurat-l4-002:q1': R(A(2, 17, 5, 11)),
  'ex-4am-tanasub-taghayyurat-l4-002:q2': R(B(2, 17, 5, 11)),
  'ex-4am-tanasub-taghayyurat-l4-003:q1': P(A(2, 3500, 6, 7500), B(2, 3500, 6, 7500)),
  'ex-4am-tanasub-taghayyurat-l4-004:q1': R(A(3, 95, 8, 220)),
  'ex-4am-tanasub-taghayyurat-l4-004:q2': R(B(3, 95, 8, 220)),
  'ex-4am-tanasub-taghayyurat-l4-005:q1': R(A(10, 650, 30, 1250)),
  'ex-4am-tanasub-taghayyurat-l4-005:q2': R(A(10, 650, 30, 1250).mul(50).add(B(10, 650, 30, 1250))),
  'ex-4am-tanasub-taghayyurat-l4-006:q1': R(q(500).sub(B(3, 220, 7, 380)).div(A(3, 220, 7, 380))),
  'ex-4am-tanasub-taghayyurat-l4-007:q1': R(A(-4, 1, 6, 6)),
  'ex-4am-tanasub-taghayyurat-l4-007:q2': R(B(-4, 1, 6, 6)),
  'ex-4am-tanasub-taghayyurat-l4-008:q1': R(A(2, 9, 7, 24)),
  'ex-4am-tanasub-taghayyurat-l4-008:q2': R(B(2, 9, 7, 24)),
  'ex-4am-tanasub-taghayyurat-l4-009:q1': pick([[1, 5, 2, 7, 4, 11], [1, 5, 2, 7, 4, 13], [1, 3, 2, 6, 4, 10]].map(([a, p, b, r, d, s]) => A(a, p, b, r).toString() === A(b, r, d, s).toString())),
  'ex-4am-tanasub-taghayyurat-l4-010:q1': pick([[300, 650], [150, 650], [150, 200], [190, 0]].map(([a, b]) => fits(a, b, [[3, 650], [5, 950]]))),
  'ex-4am-tanasub-taghayyurat-l5-001:q1': C('B') /* (7a + b) − (3a + b) = 4a : b disparaît */,
  'ex-4am-tanasub-taghayyurat-l5-002:q1': R(q(5).add(q(-3).mul(q(10).sub(2)))),
  'ex-4am-tanasub-taghayyurat-l5-003:q1': R(q(20).sub(B(1, 4, 5, 12)).div(A(1, 4, 5, 12))),
  'ex-4am-tanasub-taghayyurat-l5-004:q1': P(A('1/2', 3, 2, 6), B('1/2', 3, 2, 6)),
  'ex-4am-tanasub-taghayyurat-l5-005:q1': R(q(32).neg().div(q('1.8').sub(1))),
  'ex-4am-tanasub-taghayyurat-l5-006:q1': R(A(4, 300, 10, 600)),
  'ex-4am-tanasub-taghayyurat-l5-006:q2': R(A(4, 300, 10, 600).mul(20).add(B(4, 300, 10, 600))),
  'ex-4am-tanasub-taghayyurat-l5-007:q1': pick([A(1, 3, 4, 9).toString() === A(4, 9, 10, 21).toString(), false, false]) /* B et C appliquent un critère faux */,
  'ex-4am-tanasub-taghayyurat-l5-008:q1': R(q(16).add(A(2, 7, 5, 16).mul(4))),
  'ex-4am-tanasub-taghayyurat-l5-009:q1': R(q(12).div(q(7).sub(3))),
  'ex-4am-tanasub-taghayyurat-l5-010:q1': P(A(4, 52, 10, 34), B(4, 52, 10, 34)),
};
