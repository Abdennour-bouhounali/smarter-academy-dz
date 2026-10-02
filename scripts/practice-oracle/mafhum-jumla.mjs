// Oracle du banc « mafhum-jumla » (unité 5 « جمل معادلتين من الدرجة الأولى بمجهولين ») — chaque réponse
// RECALCULÉE ici, sans lire le contenu ni le code testé. Fusionné dans scripts/practice-answer-oracle.test.mjs.
// Une ثنائية se recalcule par Cramer en rationnels exacts (`solve2` de helpers.mjs) ; un choix « quelle
// ثنائية / quel statut / quel cas » est rejoué ici sur les coefficients et les ثنائيات proposées, en
// rationnels exacts (`q`). Généré avec le banc par le script de l'auteur (le calcul Python des clés et
// ce calcul JS sont indépendants) ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, P, q, solve2 } from './helpers.mjs';

const LETTERS = ['A', 'B', 'C', 'D'];
/** L'équation [a, b, c] (a·x + b·y = c) est-elle vraie en (x ; y) ? */
const holds = ([a, b, c], x, y) => q(a).mul(x).add(q(b).mul(y)).sub(c).isZero();
const both = (s, x, y) => s.every((e) => holds(e, x, y));
const status = (s, x, y) => s.map((e) => holds(e, x, y));
/** « نعم / لا » (ou « صحيحة / خاطئة ») : A si vrai quand `yesFirst`. */
const yesNo = (truth, yesFirst = true) => C(truth === yesFirst ? 'A' : 'B');
/** LA ثنائية qui vérifie les deux équations (exactement une parmi les options). */
function pickPair(s, pairs) {
  const ok = pairs.map(([x, y], i) => (both(s, x, y) ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`mafhum-jumla oracle: ${ok.length} ثنائيات solutions`);
  return C(ok[0]);
}
/** Options : les deux / (1) seulement / (2) seulement / aucune. */
function pickStatus(s, [x, y]) {
  const [a, b] = status(s, x, y);
  return C(a && b ? 'A' : a ? 'B' : b ? 'C' : 'D');
}
/** Le cas d'une jumla : options « حل وحيد » / « ليس لها حلول » / « عدد غير منته ». */
function pickKind([[a1, b1, c1], [a2, b2, c2]]) {
  const d = q(a1).mul(b2).sub(q(a2).mul(b1));
  if (!d.isZero()) return C('A');
  const same = q(a1).mul(c2).sub(q(a2).mul(c1)).isZero() && q(b1).mul(c2).sub(q(b2).mul(c1)).isZero();
  return C(same ? 'C' : 'B');
}
/** Laquelle des équations accepte la ثنائية (exactement une). */
function pickEquation(eqs, [x, y]) {
  const ok = eqs.map((e, i) => (holds(e, x, y) ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error('mafhum-jumla oracle: pickEquation');
  return C(ok[0]);
}
/**
 * Un choix entre SOUS-ENSEMBLES : soit les équations `eqs` vérifiées par la ثنائية `pt`
 * (`subsets` = indices d'équations), soit les ثنائيات `pts` qui vérifient l'unique équation
 * `eqs[0]` (`sets` = indices de ثنائيات). La bonne option est celle qui est EXACTEMENT l'ensemble.
 */
function pickSubset(eqs, pt, subsets, pts = null, sets = null) {
  const truth = pts ? pts.map(([x, y], i) => (holds(eqs[0], x, y) ? i : null)).filter((i) => i !== null)
    : eqs.map((e, i) => (holds(e, pt[0], pt[1]) ? i : null)).filter((i) => i !== null);
  const opts = pts ? sets : subsets;
  const ok = opts.map((o, i) => (o.length === truth.length && o.every((v) => truth.includes(v)) ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error('mafhum-jumla oracle: pickSubset');
  return C(ok[0]);
}
/** Le couple de ثنائيات dont les DEUX vérifient l'équation (exactement un). */
function pickTwo(e, couples) {
  const ok = couples.map((cp, i) => (cp.every(([x, y]) => holds(e, x, y)) ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error('mafhum-jumla oracle: pickTwo');
  return C(ok[0]);
}
/** L'équation qu'AUCUNE des ثنائيات ne vérifie (exactement une). */
function noneAccepts(eqs, pts) {
  const ok = eqs.map((e, i) => (pts.some(([x, y]) => holds(e, x, y)) ? null : LETTERS[i])).filter(Boolean);
  if (ok.length !== 1) throw new Error('mafhum-jumla oracle: noneAccepts');
  return C(ok[0]);
}
/** « Raison » : la ثنائية vérifie (2) seulement → l'option B (« لا: … (1) غير محقّقة »). */
function onlySecondReason(s, x, y) {
  const [a, b] = status(s, x, y);
  if (a || !b) throw new Error('mafhum-jumla oracle: onlySecondReason');
  return C('B');
}
/** « Raison » : la ثنائية vérifie (1) seulement → l'option B (« لا / خطأ : … (2) غير محقّقة »). */
function onlyFirstReason(s, x, y) {
  const [a, b] = status(s, x, y);
  if (!a || b) throw new Error('mafhum-jumla oracle: onlyFirstReason');
  return C('B');
}

export const ORACLE = {
  'ex-4am-mafhum-jumla-l1-001:q1': yesNo(holds(["1", "-2", "7"], "7", "0"), true),
  'ex-4am-mafhum-jumla-l1-001:q2': yesNo(holds(["1", "-2", "7"], "0", "1"), true),
  'ex-4am-mafhum-jumla-l1-001:q3': yesNo(holds(["1", "-2", "7"], "1", "-3"), true),
  'ex-4am-mafhum-jumla-l1-002:q1': C('B') /* deux lettres inconnues x et y, chacune au degré 1 */,
  'ex-4am-mafhum-jumla-l1-003:q1': C('C') /* a et b au degré 1 dans les deux équations */,
  'ex-4am-mafhum-jumla-l1-004:q1': pickEquation([["1", "1", "0"], ["2", "-1/2", "0"], ["1/2", "1", "1/4"]], ["1/2", "-1/2"]),
  'ex-4am-mafhum-jumla-l1-005:q1': R(-1) /* x - y = 1·x + (-1)·y */,
  'ex-4am-mafhum-jumla-l1-005:q2': R(-5) /* 2x - 5y = 2·x + (-5)·y */,
  'ex-4am-mafhum-jumla-l1-006:q1': pickStatus([["1", "1", "10"], ["3", "1", "22"]], ["7", "1"]),
  'ex-4am-mafhum-jumla-l1-006:q2': pickStatus([["1", "1", "10"], ["3", "1", "22"]], ["6", "4"]),
  'ex-4am-mafhum-jumla-l1-007:q1': C('A') /* seule A n'a ni produit xy ni carré */,
  'ex-4am-mafhum-jumla-l1-008:q1': R(9) /* (x ; y) = (4 ; 9) */,
  'ex-4am-mafhum-jumla-l1-008:q2': C('A') /* 4 ≠ 9 en première position */,
  'ex-4am-mafhum-jumla-l1-009:q1': yesNo(holds(["2", "5", "40"], "10", "4"), true),
  'ex-4am-mafhum-jumla-l1-009:q2': yesNo(holds(["2", "5", "40"], "4", "10"), true),
  'ex-4am-mafhum-jumla-l1-010:q1': yesNo(holds(["2", "-1", "0"], '1', '0'), true),
  'ex-4am-mafhum-jumla-l2-001:q1': yesNo(both([["2", "1", "4"], ["1", "1", "3"]], "3", "-2"), true),
  'ex-4am-mafhum-jumla-l2-001:q2': yesNo(both([["2", "1", "4"], ["1", "1", "3"]], "1", "2"), true),
  'ex-4am-mafhum-jumla-l2-002:q1': pickSubset([["3", "1", "0"], ["1", "-3", "0"], ["1/3", "-1", "3"]], ['0', '0'], [[0], [0, 1], [1, 2], [0, 1, 2]]),
  'ex-4am-mafhum-jumla-l2-003:q1': yesNo(both([["1", "-1", "2"], ["2", "-5", "4"]], "2", "0"), true),
  'ex-4am-mafhum-jumla-l2-003:q2': yesNo(both([["1", "-1", "2"], ["2", "-5", "4"]], "3", "1"), true),
  'ex-4am-mafhum-jumla-l2-003:q3': yesNo(both([["1", "-1", "2"], ["2", "-5", "4"]], "0", "2"), true),
  'ex-4am-mafhum-jumla-l2-004:q1': pickPair([["1", "1", "32"], ["2", "-1", "7"]], [["24", "8"], ["13", "19"], ["19", "13"], ["12", "17"]]),
  'ex-4am-mafhum-jumla-l2-005:q1': pickSubset([["1", "-1", "2"]], null, null, [["1/2", "-3/2"], ["0", "-2"], ["0", "1/3"], ["1", "-2"], ["1/5", "0"]], [[1], [0, 1], [3, 1]]),
  'ex-4am-mafhum-jumla-l2-006:q1': onlySecondReason([["1", "1", "10"], ["3", "1", "22"]], '4', '10'),
  'ex-4am-mafhum-jumla-l2-007:q1': yesNo(both([["1", "1", "37"], ["20", "10", "610"]], "24", "13"), true),
  'ex-4am-mafhum-jumla-l2-007:q2': yesNo(both([["1", "1", "37"], ["20", "10", "610"]], "13", "24"), true),
  'ex-4am-mafhum-jumla-l2-008:q1': R(-1) /* -x = (-1)·x */,
  'ex-4am-mafhum-jumla-l2-008:q2': R(9),
  'ex-4am-mafhum-jumla-l2-009:q1': pickKind([["1", "1", "6"], ["2", "2", "12"]]),
  'ex-4am-mafhum-jumla-l2-010:q1': pickKind([["1", "-1", "1"], ["1", "-1", "3"]]),
  'ex-4am-mafhum-jumla-l3-001:q1': P(...solve2("1", "0", "1/3", "3", "-1", "4")),
  'ex-4am-mafhum-jumla-l3-002:q1': P(...solve2("-1", "1", "-1", "-2", "1", "0")),
  'ex-4am-mafhum-jumla-l3-003:q1': pickTwo(["4", "2", "5"], [[["0", "5/2"], ["1", "1"]], [["0", "5/2"], ["1", "1/2"]], [["1", "1/2"], ["2", "0"]]]),
  'ex-4am-mafhum-jumla-l3-004:q1': pickSubset([["5", "3", "1"]], null, null, [["1/2", "-3/2"], ["0", "-2"], ["0", "1/3"], ["1", "-2"], ["1/5", "0"]], [[4], [2, 4], [1, 2]]),
  'ex-4am-mafhum-jumla-l3-005:q1': P(...solve2("1", "1", "9", "-2", "1", "0")),
  'ex-4am-mafhum-jumla-l3-006:q1': P(...solve2("1", "0", "4", "1", "3", "19")),
  'ex-4am-mafhum-jumla-l3-007:q1': R(q(-3).add(10)) /* 2x - 10 = y - 3 ⇒ 2x - y = -3 + 10 */,
  'ex-4am-mafhum-jumla-l3-008:q1': pickKind([["4", "6", "2"], ["-2", "-3", "-1"]]),
  'ex-4am-mafhum-jumla-l3-008:q2': yesNo(both([["4", "6", "2"], ["-2", "-3", "-1"]], "-1", "1"), true),
  'ex-4am-mafhum-jumla-l3-009:q1': pickKind([["2", "-1", "0"], ["-1", "1/2", "-2"]]),
  'ex-4am-mafhum-jumla-l3-010:q1': onlyFirstReason([["1", "1", "7"], ["1", "-1", "3"]], '2', '5'),
  'ex-4am-mafhum-jumla-l4-001:q1': pickPair([["1", "1", "25"], ["300", "150", "6000"]], [["10", "15"], ["15", "10"], ["17", "6"], ["12", "13"]]),
  'ex-4am-mafhum-jumla-l4-002:q1': pickStatus([["1", "1", "7"], ["100", "500", "1900"]], ["4", "3"]),
  'ex-4am-mafhum-jumla-l4-002:q2': pickStatus([["1", "1", "7"], ["100", "500", "1900"]], ["3", "4"]),
  'ex-4am-mafhum-jumla-l4-003:q1': P(...solve2("1", "1", "12", "1", "-3", "0")),
  'ex-4am-mafhum-jumla-l4-004:q1': pickStatus([["2", "1", "130"], ["1", "2", "110"]], ["50", "30"]),
  'ex-4am-mafhum-jumla-l4-004:q2': pickStatus([["2", "1", "130"], ["1", "2", "110"]], ["30", "50"]),
  'ex-4am-mafhum-jumla-l4-005:q1': pickKind([["1", "1", "40"], ["2", "2", "80"]]),
  'ex-4am-mafhum-jumla-l4-006:q1': pickKind([["1", "1", "40"], ["3", "3", "100"]]),
  'ex-4am-mafhum-jumla-l4-007:q1': P(...solve2("1", "1", "30", "1", "-1", "2")),
  'ex-4am-mafhum-jumla-l4-008:q1': pickStatus([["2", "-1", "3"], ["1", "-2", "-5"]], ["3", "3"]),
  'ex-4am-mafhum-jumla-l4-008:q2': pickStatus([["2", "-1", "3"], ["1", "-2", "-5"]], ["1", "3"]),
  'ex-4am-mafhum-jumla-l4-009:q1': yesNo(both([["1", "-2", "7"], ["1/3", "1/3", "0"]], '-3', '-2'), true),
  'ex-4am-mafhum-jumla-l4-010:q1': C('A') /* a = 2, b = -3, c = 1 ; a' = b' = 1, c' = 4 */,
  'ex-4am-mafhum-jumla-l5-001:q1': P(...solve2("1", "1", "37", "20", "10", "610")),
  'ex-4am-mafhum-jumla-l5-002:q1': P(...solve2("1", "1", "32", "2", "-1", "7")),
  'ex-4am-mafhum-jumla-l5-003:q1': P(...solve2("1", "1", "12", "3", "1", "28")),
  'ex-4am-mafhum-jumla-l5-004:q1': R(q(5).mul(2)) /* 2x + 4y = 2(x + 2y) */,
  'ex-4am-mafhum-jumla-l5-004:q2': pickKind([["1", "2", "5"], ["2", "4", "12"]]),
  'ex-4am-mafhum-jumla-l5-005:q1': pickKind([["3", "-1", "2"], ["6", "-2", "5"]]),
  'ex-4am-mafhum-jumla-l5-005:q2': onlyFirstReason([["3", "-1", "2"], ["6", "-2", "5"]], '1', '1'),
  'ex-4am-mafhum-jumla-l5-006:q1': pickPair([["1", "1", "50"], ["2", "5", "160"]], [["20", "30"], ["25", "22"], ["30", "20"], ["35", "15"]]),
  'ex-4am-mafhum-jumla-l5-007:q1': C('A') /* définition du manuel (معارف 2) */,
  'ex-4am-mafhum-jumla-l5-007:q2': P(...solve2("1", "1", "10", "1", "-1", "4")),
  'ex-4am-mafhum-jumla-l5-008:q1': R(3) /* même membre gauche x + y : il faut k = 3 */,
  'ex-4am-mafhum-jumla-l5-008:q2': pickKind([["1", "1", "3"], ["1", "1", "5"]]),
  'ex-4am-mafhum-jumla-l5-009:q1': C('A') /* y = 2 × (x − 4), les parenthèses portent le 2 */,
  'ex-4am-mafhum-jumla-l5-009:q2': P(...solve2("1", "1", "28", "-2", "1", "-8")),
  'ex-4am-mafhum-jumla-l5-010:q1': noneAccepts([["3", "2", "-1"], ["3", "5", "1"], ["1", "-2", "4"], ["5", "3", "1"]], [["1/2", "-3/2"], ["0", "-2"], ["0", "1/3"], ["1", "-2"], ["1/5", "0"]]),
};
