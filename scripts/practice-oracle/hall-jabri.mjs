// Oracle du banc « hall-jabri » (unité 5 « جمل معادلتين من الدرجة الأولى بمجهولين ») — chaque réponse
// RECALCULÉE ici, sans lire le contenu ni le code testé. Fusionné dans scripts/practice-answer-oracle.test.mjs.
// Une ثنائية se recalcule par Cramer en rationnels exacts (`solve2` de helpers.mjs) depuis les
// coefficients de la jumla écrits ici ; la réponse attendue d'un `point` s'écrit P(x, y).
//
// Les QCM sont rejoués par le calcul quand ils portent sur un objet mathématique (les aides
// ci-dessous rendent la LETTRE de l'unique option juste, et lèvent une erreur s'il y en a zéro ou
// deux) ; les QCM de CHOIX DE MÉTHODE (« الطريقة الأنسب، مع سببها ») sont conceptuels et vérifiés
// par l'aller-retour du validateur.
//   pickPair(sys, opts)          la ثنائية solution parmi des couples (null = option qui n'en est pas un)
//   pickIsolate(e, v, opts)      v = k·u + m équivalente à e : opts = [k, m]
//   pickIsolateAny(e, opts)      idem, l'inconnue isolée donnée par option : [v, k, m]
//   substInto(e, v, [k, m])      e où v est remplacé par k·u + m → [A, C] (A·u = C)
//   sumOf(e1, e2)                la somme طرفا لطرف
//   pickEq(target, opts)         l'unique option PROPORTIONNELLE à la cible (même équation)
//   pickLine(e, opts)            l'unique écriture équivalente d'une équation [a, b, c]
//   pickFactor(p, q, opts)       l'unique k tel que p + k·q = 0 (un multiplicateur qui oppose)
//   pickFactors(p, q, opts)      l'unique [k1, k2] tel que k1·p + k2·q = 0 (k1, k2 ≠ 0)
//   pickCombo(e, exprs, combos)  l'unique combinaison = l'ensemble exact des écritures équivalentes à e
// Généré avec le banc par le script de l'auteur ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, P, q, solve2 } from './helpers.mjs';

const LETTERS = 'ABCD';
const unique = (flags, what) => {
  const hits = flags.map((f, i) => (f ? i : -1)).filter((i) => i >= 0);
  if (hits.length !== 1) throw new Error(`oracle hall-jabri : ${what} — ${hits.length} options justes`);
  return LETTERS[hits[0]];
};
const eqQ = (a, b) => q(a).sub(q(b)).isZero();

function pickPair(sys, opts) {
  const [x, y] = solve2(...sys);
  return unique(opts.map((o) => !!o && eqQ(o[0], x) && eqQ(o[1], y)), 'pickPair');
}
/** v = k·u + m pour a·x + b·y = c. */
function isolated([a, b, c], v) {
  const own = v === 'x' ? a : b; const oth = v === 'x' ? b : a;
  return [q(0).sub(q(oth)).div(q(own)), q(c).div(q(own))];
}
function pickIsolate(e, v, opts) {
  const [k, m] = isolated(e, v);
  return unique(opts.map(([ok, om]) => eqQ(ok, k) && eqQ(om, m)), 'pickIsolate');
}
function pickIsolateAny(e, opts) {
  return unique(opts.map(([v, ok, om]) => { const [k, m] = isolated(e, v); return eqQ(ok, k) && eqQ(om, m); }), 'pickIsolateAny');
}
function substInto([a, b, c], v, [k, m]) {
  const own = q(v === 'x' ? a : b); const oth = q(v === 'x' ? b : a);
  return [oth.add(own.mul(k)), q(c).sub(own.mul(m))];
}
const sumOf = (e1, e2) => e1.map((v, i) => q(v).add(q(e2[i])));
/** Deux équations proportionnelles (même ensemble de solutions) ; l'équation nulle n'est équivalente qu'à elle-même. */
function proportional(t, o) {
  const T = t.map(q); const O = o.map(q);
  if (T.length !== O.length) return false;
  const tz = T.every((v) => v.isZero()); const oz = O.every((v) => v.isZero());
  if (tz || oz) return tz && oz;
  const i = T.findIndex((v) => !v.isZero());
  if (O[i].isZero()) return false;
  const r = O[i].div(T[i]);
  return T.every((v, j) => v.mul(r).sub(O[j]).isZero());
}
const pickEq = (target, opts) => unique(opts.map((o) => proportional(target, o)), 'pickEq');
const pickLine = (e, opts) => unique(opts.map((o) => proportional(e, o)), 'pickLine');
const pickFactor = (p, qq, opts) => unique(opts.map((k) => q(p).add(q(k).mul(q(qq))).isZero()), 'pickFactor');
const pickFactors = (p, qq, opts) => unique(opts.map(([k1, k2]) => !q(k1).isZero() && !q(k2).isZero() && q(k1).mul(q(p)).add(q(k2).mul(q(qq))).isZero()), 'pickFactors');
function pickCombo(e, exprs, combos) {
  const ok = exprs.map((x, i) => (proportional(e, x) ? i : -1)).filter((i) => i >= 0).join(',');
  return unique(combos.map((c) => [...c].sort().join(',') === ok), 'pickCombo');
}

export const ORACLE = {
  'ex-4am-hall-jabri-l1-001:q1': C(pickIsolate([1, 3, 10], 'x', [['-3', '10'], ['3', '10'], ['3', '-10']])),
  'ex-4am-hall-jabri-l1-001:q2': P(...solve2(1, 3, 10, 3, 5, 18)),
  'ex-4am-hall-jabri-l1-001:q3': P(...solve2(3, 2, 0, 6, 3, -24)),
  'ex-4am-hall-jabri-l1-002:q1': C(pickIsolate([1, -1, 2], 'y', [['-1', '2'], ['1', '-2'], ['1', '2']])),
  'ex-4am-hall-jabri-l1-002:q2': P(...solve2(3, 1, -4, 1, -1, 2)),
  'ex-4am-hall-jabri-l1-003:q1': C(pickCombo([3, -1, 1], [[-3, 1, -1], [1, '-1/3', '1/3'], [3, -1, 1]], [[0], [0, 2], [0, 1, 2], [1, 2]])),
  'ex-4am-hall-jabri-l1-003:q2': R(q(3).mul(2).sub(1)),
  'ex-4am-hall-jabri-l1-004:q1': C(pickEq(sumOf([1, 1, 100], [1, -1, 20]), [[2, 0, 120], [0, 2, 80], [2, 0, 80]])),
  'ex-4am-hall-jabri-l1-004:q2': P(...solve2(1, 1, 100, 1, -1, 20)),
  'ex-4am-hall-jabri-l1-005:q1': P(...solve2(2, -1, 0, 1, 1, 45)),
  'ex-4am-hall-jabri-l1-006:q1': C(pickEq(substInto([2, 1, 12], 'x', [1, 3]), [[3, 6], [3, 9], [0, 0]])),
  'ex-4am-hall-jabri-l1-006:q2': P(...solve2(1, -1, 3, 2, 1, 12)),
  'ex-4am-hall-jabri-l1-007:q1': C(pickEq(sumOf([2, 1, 1], [-2, 4, -6]), [[0, 5, -5], [0, 3, -5], [0, 5, -7]])),
  'ex-4am-hall-jabri-l1-007:q2': P(...solve2(2, 1, 1, -2, 4, -6)),
  'ex-4am-hall-jabri-l1-008:q1': R(solve2(-2, 1, 0, 3, -1, 4)[0]),
  'ex-4am-hall-jabri-l1-008:q2': P(...solve2(-2, 1, 0, 3, -1, 4)),
  'ex-4am-hall-jabri-l1-009:q1': C(pickPair([1, 1, 7, 1, -1, 1], [null, [4, 3], [3, 4]])),
  'ex-4am-hall-jabri-l1-010:q2': P(...solve2(-4, 1, 0, 3, 1, 21)),
  'ex-4am-hall-jabri-l2-001:q1': R(solve2(4, 2, 9, -4, 3, 6)[1]),
  'ex-4am-hall-jabri-l2-001:q2': P(...solve2(4, 2, 9, -4, 3, 6)),
  'ex-4am-hall-jabri-l2-002:q1': C(pickPair([3, -1, -1, 3, 1, 5], [[1, 4], [4, 1], ['2/3', 3]])),
  'ex-4am-hall-jabri-l2-003:q1': C(pickFactor(2, -1, [2, -2, 3])),
  'ex-4am-hall-jabri-l2-003:q2': P(...solve2(-1, 3, 2, 2, 1, 3)),
  'ex-4am-hall-jabri-l2-004:q1': C(pickFactor(5, -1, [5, -5, 3])),
  'ex-4am-hall-jabri-l2-004:q2': P(...solve2(2, -1, 1, 3, 5, 21)),
  'ex-4am-hall-jabri-l2-005:q1': C(pickIsolate([1, 2, 1400], 'x', [['-2', '1400'], ['2', '1400'], ['2', '-1400']])),
  'ex-4am-hall-jabri-l2-005:q2': P(...solve2(3, 1, 2200, 1, 2, 1400)),
  'ex-4am-hall-jabri-l2-006:q1': R(solve2(2, 3, 700, 1, -3, 80)[0]),
  'ex-4am-hall-jabri-l2-006:q2': P(...solve2(2, 3, 700, 1, -3, 80)),
  'ex-4am-hall-jabri-l2-007:q1': C(pickEq(sumOf([1, 2, 11], [3, -2, 1]), [[4, 0, 12], [4, 4, 12], [-2, 0, 10]])),
  'ex-4am-hall-jabri-l2-007:q2': P(...solve2(1, 2, 11, 3, -2, 1)),
  'ex-4am-hall-jabri-l2-008:q1': C(pickIsolateAny([2, 1, 50], [['y', '-2', '50'], ['y', '2', '-50'], ['x', '-2', '50']])),
  'ex-4am-hall-jabri-l2-008:q2': P(...solve2(2, 1, 50, 1, 3, 45)),
  'ex-4am-hall-jabri-l2-009:q2': P(...solve2(3, 1, 1, 6, -1, 8)),
  'ex-4am-hall-jabri-l2-010:q2': P(...solve2(6, 5, 17, 6, -2, 10)),
  'ex-4am-hall-jabri-l3-001:q1': C(pickFactor(-2, 1, [2, -2, 3])),
  'ex-4am-hall-jabri-l3-001:q2': P(...solve2(2, 1, 7, 3, -2, '4.2')),
  'ex-4am-hall-jabri-l3-002:q1': C(pickEq(substInto([5, 3, 1], 'x', [-4, 7]), [[-17, -34], [23, -34], [0, 0]])),
  'ex-4am-hall-jabri-l3-002:q2': P(...solve2(1, 4, 7, 5, 3, 1)),
  'ex-4am-hall-jabri-l3-003:q1': C(pickFactor(12, 6, [-2, 2, -3])),
  'ex-4am-hall-jabri-l3-003:q2': P(...solve2(5, 4, 16, 3, 6, 15)),
  'ex-4am-hall-jabri-l3-004:q2': P(...solve2(1, 1, 12, 3, 2, 31)),
  'ex-4am-hall-jabri-l3-005:q1': C(pickIsolate([12, -1, -5], 'y', [['12', '5'], ['12', '-5'], ['-12', '-5']])),
  'ex-4am-hall-jabri-l3-005:q2': P(...solve2(4, -3, 1, 12, -1, -5)),
  'ex-4am-hall-jabri-l3-006:q1': P(...solve2(6, -5, 0, 2, -1, 12)),
  'ex-4am-hall-jabri-l3-007:q1': C(pickEq(sumOf([2, 1, 6], ['1/2', -1, -2]), [['5/2', 0, 4], ['5/2', 0, 8], ['3/2', 0, 4]])),
  'ex-4am-hall-jabri-l3-007:q2': P(...solve2(2, 1, 6, '1/2', -1, -2)),
  'ex-4am-hall-jabri-l3-008:q1': C(pickFactor(-2, 1, [2, -2, 3])),
  'ex-4am-hall-jabri-l3-008:q2': P(...solve2(2, 1, 70, 3, -2, 42)),
  'ex-4am-hall-jabri-l3-009:q1': C(pickFactor(4, 2, [-2, 2, -4])),
  'ex-4am-hall-jabri-l3-009:q2': P(...solve2(4, 2, 216, 2, 5, 140)),
  'ex-4am-hall-jabri-l3-010:q2': P(...solve2(1, -3, -2, 5, -4, 23)),
  'ex-4am-hall-jabri-l4-001:q1': C(pickEq(substInto([3, 5, 21], 'x', ['3/2', '1/2']), [[19, 39], [14, 18], [1, 39]])),
  'ex-4am-hall-jabri-l4-001:q2': P(...solve2(2, -3, 1, 3, 5, 21)),
  'ex-4am-hall-jabri-l4-001:q3': P(...solve2(1, -90, 0, 1, 50, 280)),
  'ex-4am-hall-jabri-l4-002:q1': C(pickFactor(15, -5, [3, -3, 5])),
  'ex-4am-hall-jabri-l4-002:q2': P(...solve2(3, 7, 11, -5, 2, 5)),
  'ex-4am-hall-jabri-l4-003:q2': P(...solve2(8, 3, '39.5', 7, 9, '50.5')),
  'ex-4am-hall-jabri-l4-004:q1': C(pickIsolate([1, 3, 1], 'x', [['-3', '1'], ['3', '1'], ['3', '-1']])),
  'ex-4am-hall-jabri-l4-004:q2': P(...solve2(6, -2, 8, 1, 3, 1)),
  'ex-4am-hall-jabri-l4-005:q1': P(...solve2('1/6', -1, -1, 3, -2, 6)),
  'ex-4am-hall-jabri-l4-006:q1': P(...solve2(1, -1, 6, 3, '-1/2', 3)),
  'ex-4am-hall-jabri-l4-007:q1': C(pickEq(substInto([3, -2, 0], 'y', [3, -9]), [[-3, -18], [-3, -6], [-3, -3]])),
  'ex-4am-hall-jabri-l4-007:q2': P(...solve2(3, -2, 0, -3, 1, -9)),
  'ex-4am-hall-jabri-l4-007:q3': P(...solve2(1, -1, 0, 3, 2, 0)),
  'ex-4am-hall-jabri-l4-008:q1': C(pickFactor('-0.4', '0.2', [2, -2, 4])),
  'ex-4am-hall-jabri-l4-008:q2': P(...solve2('0.5', '0.2', '3.4', '1.5', '-0.4', '4.2')),
  'ex-4am-hall-jabri-l4-009:q1': C(pickFactors(5, 2, [[2, -5], [2, 5], [7, 3]])),
  'ex-4am-hall-jabri-l4-009:q2': P(...solve2(5, 3, 7900, 2, 7, 7800)),
  'ex-4am-hall-jabri-l4-010:q1': R(solve2(-2, 1, -7, 3, 4, 5)[0]),
  'ex-4am-hall-jabri-l4-010:q2': P(...solve2(-2, 1, -7, 3, 4, 5)),
  'ex-4am-hall-jabri-l5-001:q1': C(pickLine([-3, 5, -1], [[3, -5, 1], [3, -5, -1], [3, -5, 5]])),
  'ex-4am-hall-jabri-l5-001:q2': P(...solve2(1, 3, 7, 3, -5, 1)),
  'ex-4am-hall-jabri-l5-002:q1': C(pickLine([-3, 3, 6], [[1, -1, -2], [1, -1, 2], [1, -1, 3]])),
  'ex-4am-hall-jabri-l5-002:q2': P(...solve2(1, -2, 1, 1, -1, -2)),
  'ex-4am-hall-jabri-l5-003:q2': P(...solve2(3, 2, 260, 2, 3, 290)),
  'ex-4am-hall-jabri-l5-004:q1': C(pickIsolate([2, 1, 1100], 'y', [['-2', '1100'], ['2', '-1100'], ['2', '1100']])),
  'ex-4am-hall-jabri-l5-004:q2': P(...solve2(2, 1, 1100, 1, 2, 1300)),
  'ex-4am-hall-jabri-l5-005:q1': R(solve2(1, 1, 30, 3, 1, 74)[0]),
  'ex-4am-hall-jabri-l5-005:q2': P(...solve2(1, 1, 30, 3, 1, 74)),
  'ex-4am-hall-jabri-l5-006:q2': R(solve2(4, 1, 9, 2, -3, 1)[0]),
  'ex-4am-hall-jabri-l5-007:q1': P(...solve2('0.4', '0.5', 9, '0.2', '-0.5', 0)),
  'ex-4am-hall-jabri-l5-008:q1': C(pickPair([2, 3, 12, 1, -1, 1], [[3, 2], null, null])),
  'ex-4am-hall-jabri-l5-009:q1': R(solve2(5, -2, 4, 3, 2, 12)[1]),
  'ex-4am-hall-jabri-l5-009:q2': P(...solve2(5, -2, 4, 3, 2, 12)),
  'ex-4am-hall-jabri-l5-010:q2': P(...solve2(3, 2, 1800, 2, 1, 1150)),
};
