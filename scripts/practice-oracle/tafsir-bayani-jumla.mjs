// Oracle du banc « tafsir-bayani-jumla » (unité 7 « الدالة التآلفية ») — chaque réponse RECALCULÉE ici en
// rationnels exacts (helpers.mjs), sans lire le contenu ni le code testé. Fusionné dans
// scripts/practice-answer-oracle.test.mjs.
//
// Une équation est [a, b, c] pour a·x + b·y = c (b ≠ 0) ; sa droite est y = m·x + p avec m = −a/b, p = c/b.
// Une ثنائية se recalcule par Cramer (`solve2`). Les QCM mathématiques sont rejoués par les aides ci-dessous
// (elles rendent la LETTRE de l'unique option juste, et lèvent une erreur s'il y en a zéro ou deux) ; les QCM
// d'INTERPRÉTATION dans une situation sont conceptuels et vérifiés par l'aller-retour du validateur.
//   pickLine(e, [[m, p]…])            l'écriture y = m·x + p de e
//   pickEqForLine([m, p], [e…])       l'équation dont la droite est y = m·x + p
//   pickCase(e1, e2, kinds)           'unique' | 'none' | 'infinite' (sécantes / parallèles / confondues)
//   pickLamps(e1, e2, [x, y], states) [l'équation (1) est vraie, la (2) est vraie] en 0/1
//   pickYIntercept(m, p, [[x, y]…])   le point (0 ; p)
//   pickOnLine(e, [[x, y]…])          le point qui vérifie e
//   pickAxes(e, [[p, x0]…])           (0 ; p) et (x0 ; 0)
//   pickSystem([x, y], [[e1, e2]…])   la جملة à solution UNIQUE (x ; y)
//   pickConcurrent(lines, pts)        le point commun à toutes les droites [m, p] (null : aucun)
// Généré avec le banc par le script de l'auteur ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, P, q, solve2 } from './helpers.mjs';

const LETTERS = 'ABCD';
const unique = (flags, what) => {
  const hits = flags.map((f, i) => (f ? i : -1)).filter((i) => i >= 0);
  if (hits.length !== 1) throw new Error(`oracle tafsir-bayani-jumla : ${what} — ${hits.length} options justes`);
  return LETTERS[hits[0]];
};
const eqQ = (a, b) => q(a).sub(q(b)).isZero();
const lineOf = ([a, b, c]) => [q(0).sub(q(a)).div(q(b)), q(c).div(q(b))];
const holds = ([a, b, c], x, y) => eqQ(q(a).mul(q(x)).add(q(b).mul(q(y))), c);
const caseOf = (e1, e2) => {
  const [m1, p1] = lineOf(e1); const [m2, p2] = lineOf(e2);
  if (!eqQ(m1, m2)) return 'unique';
  return eqQ(p1, p2) ? 'infinite' : 'none';
};

const pickLine = (e, opts) => { const [m, p] = lineOf(e); return unique(opts.map(([om, op]) => eqQ(om, m) && eqQ(op, p)), 'pickLine'); };
const pickEqForLine = ([m, p], eqs) => unique(eqs.map((e) => { const [em, ep] = lineOf(e); return eqQ(em, m) && eqQ(ep, p); }), 'pickEqForLine');
const pickCase = (e1, e2, kinds) => unique(kinds.map((k) => k === caseOf(e1, e2)), 'pickCase');
const pickLamps = (e1, e2, [x, y], states) => {
  const s = [holds(e1, x, y) ? 1 : 0, holds(e2, x, y) ? 1 : 0];
  return unique(states.map(([a, b]) => a === s[0] && b === s[1]), 'pickLamps');
};
const pickYIntercept = (m, p, pts) => unique(pts.map(([x, y]) => eqQ(x, 0) && eqQ(y, p)), 'pickYIntercept');
const pickOnLine = (e, pts) => unique(pts.map(([x, y]) => holds(e, x, y)), 'pickOnLine');
const pickAxes = ([a, b, c], opts) => unique(opts.map(([p, x0]) => eqQ(q(b).mul(q(p)), c) && eqQ(q(a).mul(q(x0)), c)), 'pickAxes');
const pickSystem = ([x, y], systems) => unique(systems.map(([e1, e2]) => holds(e1, x, y) && holds(e2, x, y) && caseOf(e1, e2) === 'unique'), 'pickSystem');
const pickConcurrent = (lines, pts) => {
  // le point commun aux deux premières droites, s'il existe, puis vérifié sur toutes
  const [[m1, p1], [m2, p2]] = lines;
  const eqs = [[q(0).sub(q(m1)), 1, p1], [q(0).sub(q(m2)), 1, p2]];
  let common = null;
  try {
    const [x, y] = solve2(...eqs[0].map(String), ...eqs[1].map(String));
    if (lines.every(([m, p]) => eqQ(q(m).mul(q(x)).add(q(p)), y))) common = [x, y];
  } catch { common = null; }
  return unique(pts.map((pt) => (pt === null ? common === null : common !== null && eqQ(pt[0], common[0]) && eqQ(pt[1], common[1]))), 'pickConcurrent');
};

/** Le terme constant p de la droite de e (son point sur l'axe des ordonnées). */
const yIntercept = (e) => lineOf(e)[1].toString();
/** La pente a qui rend y = a·x + … parallèle à la droite de e. */
const parallelA = (e) => lineOf(e)[0].toString();
/** b qui rend y = m·x + b confondue avec la droite de e. */
const sameB = (e) => lineOf(e)[1].toString();
/** k tel que a2·x + k·y = c2 soit la droite de e = [a, b, c] (a2 et c2 donnés, proportionnels à a et c). */
const sameCoefY = ([a, b, c], a2, c2) => {
  const r = q(a2).div(q(a));
  if (!eqQ(q(c).mul(r), c2)) throw new Error('sameCoefY : seconds membres non proportionnels');
  return q(b).mul(r).toString();
};
/** c tel que a2·x + b2·y = c soit la droite de e. */
const sameC = ([a, b, c], a2, b2) => {
  const r = q(a2).div(q(a));
  if (!eqQ(q(b).mul(r), b2)) throw new Error('sameC : coefficients non proportionnels');
  return q(c).mul(r).toString();
};
/** a tel que y = (a − shift)x + … soit parallèle à la droite de e. */
const parallelShifted = (shift, e) => lineOf(e)[0].add(q(shift)).toString();

export const ORACLE = {
  'ex-4am-tafsir-bayani-jumla-l1-001:q2': C(pickYIntercept(-1, 43, [[0, 43], [43, 0], [0, -43]])),
  'ex-4am-tafsir-bayani-jumla-l1-002:q1': C(pickLine([1, 1, 5], [[-1, 5], [1, 5], [-1, -5]])),
  'ex-4am-tafsir-bayani-jumla-l1-003:q1': C(pickLine([-2, 1, 3], [[-2, 3], [2, 3], [2, -3]])),
  'ex-4am-tafsir-bayani-jumla-l1-004:q1': C(pickLamps([-1, 1, 3], [1, 1, 5], [1, 4], [[1, 1], [1, 0], [0, 1], [0, 0]])),
  'ex-4am-tafsir-bayani-jumla-l1-005:q1': P(...solve2(-1, 1, 2, 1, 1, 4)),
  'ex-4am-tafsir-bayani-jumla-l1-006:q1': C(pickCase([-2, 1, 1], [-2, 1, 4], ['unique', 'none', 'infinite'])),
  'ex-4am-tafsir-bayani-jumla-l1-007:q1': C(pickCase([1, 1, 2], [-1, 1, 0], ['unique', 'none', 'infinite'])),
  'ex-4am-tafsir-bayani-jumla-l1-009:q1': R(yIntercept([2, 1, 7])),
  'ex-4am-tafsir-bayani-jumla-l1-010:q1': C(pickEqForLine([-2, 6], [[2, 1, 6], [2, -1, 6], [1, 2, 6]])),
  'ex-4am-tafsir-bayani-jumla-l2-001:q1': C(pickLine([100, 200, 5000], [['-1/2', 25], [-100, 5000], ['1/2', 25]])),
  'ex-4am-tafsir-bayani-jumla-l2-002:q1': C(pickLine([3, 1, 10], [[-3, 10], [3, 10], [-3, -10]])),
  'ex-4am-tafsir-bayani-jumla-l2-003:q1': C(pickLine([1, 2, 8], [['-1/2', 4], [-1, 8], ['1/2', 4]])),
  'ex-4am-tafsir-bayani-jumla-l2-004:q1': P(...solve2(-2, 1, -3, 1, 1, 6)),
  'ex-4am-tafsir-bayani-jumla-l2-005:q1': P(...solve2(-1, 1, -2, 2, 1, 7)),
  'ex-4am-tafsir-bayani-jumla-l2-006:q1': C(pickCase([1, 1, 4], [2, 2, 8], ['unique', 'none', 'infinite'])),
  'ex-4am-tafsir-bayani-jumla-l2-007:q1': C(pickCase([1, 1, 1], [1, 1, 5], ['unique', 'none', 'infinite'])),
  'ex-4am-tafsir-bayani-jumla-l2-008:q1': C(pickLamps([1, -1, 3], [2, 1, 3], [2, -1], [[1, 1], [1, 0], [0, 1], [0, 0]])),
  'ex-4am-tafsir-bayani-jumla-l2-009:q1': C(pickOnLine([1, -1, 2], [[5, 3], [3, 5], [2, 2]])),
  'ex-4am-tafsir-bayani-jumla-l3-001:q1': P(...solve2(1, 1, 43, '1/2', 1, 25)),
  'ex-4am-tafsir-bayani-jumla-l3-002:q1': P(...solve2(2, 1, 7, 1, -1, 2)),
  'ex-4am-tafsir-bayani-jumla-l3-003:q1': P(...solve2(1, 3, 9, -1, 1, -1)),
  'ex-4am-tafsir-bayani-jumla-l3-004:q2': P(...solve2(-2, 1, 0, 1, 1, 5)),
  'ex-4am-tafsir-bayani-jumla-l3-005:q1': C(pickCase([3, -1, 2], [6, -2, 1], ['unique', 'none', 'infinite'])),
  'ex-4am-tafsir-bayani-jumla-l3-006:q1': C(pickCase(['1/2', 1, 3], [1, 2, 6], ['unique', 'none', 'infinite'])),
  'ex-4am-tafsir-bayani-jumla-l3-007:q1': C(pickAxes([2, 3, 12], [[4, 6], [6, 4], [12, 12]])),
  'ex-4am-tafsir-bayani-jumla-l3-008:q1': C(pickSystem([-1, 2], [[[1, 1, 1], [2, -1, -4]], [[1, -1, 1], [2, 1, 0]], [[1, 1, 1], [1, 1, 3]]])),
  'ex-4am-tafsir-bayani-jumla-l3-009:q1': C(pickLine([4, -6, 3], [['2/3', '-1/2'], ['-2/3', '1/2'], ['2/3', '1/2']])),
  'ex-4am-tafsir-bayani-jumla-l3-010:q1': R(parallelA([-3, 1, -2])),
  'ex-4am-tafsir-bayani-jumla-l4-001:q1': C(pickLamps([1, 1, 43], [100, 200, 5000], [40, 3], [[1, 1], [1, 0], [0, 1], [0, 0]])),
  'ex-4am-tafsir-bayani-jumla-l4-001:q2': P(...solve2(1, 1, 43, 100, 200, 5600)),
  'ex-4am-tafsir-bayani-jumla-l4-002:q1': P(...solve2(3, 2, 12, 1, -2, -4)),
  'ex-4am-tafsir-bayani-jumla-l4-003:q1': P(...solve2(5, -2, 1, 3, 4, 11)),
  'ex-4am-tafsir-bayani-jumla-l4-004:q1': P(...solve2(1, 1, 3, 2, -1, 1)),
  'ex-4am-tafsir-bayani-jumla-l4-005:q1': C(pickCase([2, -3, 6], [-4, 6, -12], ['unique', 'none', 'infinite'])),
  'ex-4am-tafsir-bayani-jumla-l4-006:q1': C(pickCase(['1/2', 1, 2], [1, 2, 3], ['unique', 'none', 'infinite'])),
  'ex-4am-tafsir-bayani-jumla-l4-007:q1': R(sameB([4, -2, 6])),
  'ex-4am-tafsir-bayani-jumla-l4-008:q1': C(pickEqForLine([2, -1], [[2, -1, 1], [1, -2, 1], [2, 1, -1]])),
  'ex-4am-tafsir-bayani-jumla-l4-009:q1': P(...solve2(3, 2, 190, 1, 2, 130)),
  'ex-4am-tafsir-bayani-jumla-l4-010:q1': P(...solve2('-1/2', 1, 1, 2, 1, 4)),
  'ex-4am-tafsir-bayani-jumla-l5-001:q1': C(pickCase([1, 1, 43], [100, 100, 5000], ['unique', 'none', 'infinite'])),
  'ex-4am-tafsir-bayani-jumla-l5-002:q1': R(sameCoefY([2, 3, 7], 4, 14)),
  'ex-4am-tafsir-bayani-jumla-l5-003:q1': R(sameC([-3, 1, 2], 6, -2)),
  'ex-4am-tafsir-bayani-jumla-l5-004:q1': P(...solve2('1/5', '1/2', 3, 1, -1, 1)),
  'ex-4am-tafsir-bayani-jumla-l5-005:q1': P(...solve2(-60, 1, 120, -45, 1, 210)),
  'ex-4am-tafsir-bayani-jumla-l5-006:q1': C(pickConcurrent([[1, 1], [-1, 7], [2, -2]], [[3, 4], null, [4, 3]])),
  'ex-4am-tafsir-bayani-jumla-l5-007:q1': R(parallelShifted(1, [-2, 1, -5])),
  'ex-4am-tafsir-bayani-jumla-l5-008:q1': P(...solve2('1/3', '1/2', 2, 1, -1, 1)),
  'ex-4am-tafsir-bayani-jumla-l5-009:q1': C(pickCase(['2/3', -1, 1], [2, -3, 3], ['unique', 'none', 'infinite'])),
  'ex-4am-tafsir-bayani-jumla-l5-010:q1': P(...solve2(3, 2, 1, 2, -5, 7)),
};
