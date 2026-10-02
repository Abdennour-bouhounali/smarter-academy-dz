// Oracle du banc « tamthil-bayani-khatti » (unité 6 « الدالة الخطية والتناسبية », leçon 3) — chaque réponse
// RECALCULÉE ici, sans lire le contenu ni le code testé (packages/core/arithmetic/proportional.js). Fusionné
// dans scripts/practice-answer-oracle.test.mjs.
//
// Arithmétique : les rationnels exacts de helpers.mjs (`q`). Les QCM sont rejoués par le calcul : les aides
// rendent la LETTRE de l'unique option juste et lèvent une erreur s'il y en a zéro ou deux.
//   coef(m, n)                  le coefficient de la droite par O et (m ; n) : n / m
//   onLine(a, x, y)             (x ; y) est-il sur y = a·x ?
//   pickPoint(a, pts)           l'unique point de la droite y = a·x
//   pickBelongs(a, x, y)        options [تنتمي, لا تنتمي]
//   pickStatement(a, pts)       l'unique écriture « f(x) = y » vraie (pts = [[x, y], …])
//   pickEquation(a, lines)      l'unique y = s·x + b (lines = [[s, b], …]) égale à y = a·x
//   pickFunction(m, n, coefs)   l'unique x ⟼ c·x passant par (m ; n) (null = option non linéaire)
//   pickFunctionThrough(pts, coefs)  l'unique x ⟼ c·x passant par TOUS les points
//   pickDir(a)                  options [يصعد, ينزل]
//   pickRising(as) / pickFalling(as)  l'unique fonction dont le graphe monte / descend
//   pickWhich(as, x, y)         l'unique fonction dont le graphe passe par (x ; y)
//   pickMembership(as, x, y, combos)  la combinaison [appartient à f ?, à g ?] exacte
//   pickIneq(a, c, opts)        les solutions de a·x ≤ c (opts = [[rel, borne], …])
//   pickSigns(dirF, dirG, opts) les signes de a et b (opts = [['+', '-'], …])
//   pickAlignedSet(pts, sets)   l'ensemble exact des points alignés avec O sur une même droite (le plus grand)
//   commonRatio(pts)            le rapport commun y / x, ou null
//   onLineSqrt(a, X2, Y2)       (√X2 ; √Y2) sur y = a·x (a > 0) : a²·X2 = Y2
//   pickReal(v, opts)           l'unique option réelle égale à v (calcul flottant, |écart| < 1e-9)
// Généré avec le banc par le script de l'auteur ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, q } from './helpers.mjs';

const LETTERS = 'ABCD';
const unique = (flags, what) => {
  const hits = flags.map((f, i) => (f ? i : -1)).filter((i) => i >= 0);
  if (hits.length !== 1) throw new Error(`oracle tamthil-bayani-khatti : ${what} — ${hits.length} options justes`);
  return LETTERS[hits[0]];
};
const sign = (v) => { const s = q(v).toString(); return s === '0' ? 0 : s.startsWith('-') ? -1 : 1; };
const coef = (m, n) => q(n).div(q(m));
const onLine = (a, x, y) => q(a).mul(q(x)).sub(q(y)).isZero();
const same = (u, v) => q(u).sub(q(v)).isZero();
const pickPoint = (a, pts) => C(unique(pts.map(([x, y]) => onLine(a, x, y)), 'pickPoint'));
const pickBelongs = (a, x, y) => C(onLine(a, x, y) ? 'A' : 'B');
const pickStatement = (a, pts) => C(unique(pts.map(([x, y]) => onLine(a, x, y)), 'pickStatement'));
const pickEquation = (a, lines) => C(unique(lines.map(([s, b]) => same(s, a) && q(b).isZero()), 'pickEquation'));
const pickFunction = (m, n, coefs) => C(unique(coefs.map((c) => c !== null && onLine(c, m, n)), 'pickFunction'));
const pickFunctionThrough = (pts, coefs) => C(unique(coefs.map((c) => pts.every(([x, y]) => onLine(c, x, y))), 'pickFunctionThrough'));
const pickDir = (a) => { const s = sign(a); if (s === 0) throw new Error('pickDir : a = 0'); return C(s > 0 ? 'A' : 'B'); };
const pickRising = (as) => C(unique(as.map((a) => sign(a) > 0), 'pickRising'));
const pickFalling = (as) => C(unique(as.map((a) => sign(a) < 0), 'pickFalling'));
const pickWhich = (as, x, y) => C(unique(as.map((a) => onLine(a, x, y)), 'pickWhich'));
const pickMembership = (as, x, y, combos) => {
  const truth = as.map((a) => onLine(a, x, y));
  return C(unique(combos.map((c) => c.every((v, i) => v === truth[i])), 'pickMembership'));
};
/** a·x ≤ c : x ≤ c/a si a > 0, x ≥ c/a si a < 0. */
const pickIneq = (a, c, opts) => {
  const bound = q(c).div(q(a));
  const rel = sign(a) > 0 ? '<=' : '>=';
  return C(unique(opts.map(([r, b]) => r === rel && same(b, bound)), 'pickIneq'));
};
const pickSigns = (dirF, dirG, opts) => {
  const want = [dirF === 'up' ? '+' : '-', dirG === 'up' ? '+' : '-'];
  return C(unique(opts.map(([u, v]) => u === want[0] && v === want[1]), 'pickSigns'));
};
const commonRatio = (pts) => {
  const r = coef(pts[0][0], pts[0][1]);
  return pts.every(([x, y]) => onLine(r, x, y)) ? r : null;
};
const pickAlignedSet = (pts, sets) => {
  // le plus grand groupe de points ayant le même rapport y / x
  const groups = {};
  for (const [k, [x, y]] of Object.entries(pts)) { const r = coef(x, y).toString(); (groups[r] ??= []).push(k); }
  const best = Object.values(groups).sort((u, v) => v.length - u.length)[0].sort().join(',');
  return C(unique(sets.map((s) => [...s].sort().join(',') === best), 'pickAlignedSet'));
};
const onLineSqrt = (a, X2, Y2) => sign(a) > 0 && q(a).mul(q(a)).mul(X2).sub(q(Y2)).isZero();
const pickReal = (v, opts) => C(unique(opts.map((o) => Math.abs(o - v) < 1e-9), 'pickReal'));

export const ORACLE = {
  'ex-4am-tamthil-bayani-khatti-l1-001:q1': R(q('0,5').mul(1)),
  'ex-4am-tamthil-bayani-khatti-l1-001:q2': pickPoint('0,5', [[1, '0,5'], ['0,5', 1], [1, '1,5']]),
  'ex-4am-tamthil-bayani-khatti-l1-002:q1': pickPoint(3, [[0, 0], [0, 1], [1, 0]]),
  'ex-4am-tamthil-bayani-khatti-l1-003:q1': R(q(-2).mul(1)),
  'ex-4am-tamthil-bayani-khatti-l1-003:q2': pickDir(-2),
  'ex-4am-tamthil-bayani-khatti-l1-004:q1': pickDir(4),
  'ex-4am-tamthil-bayani-khatti-l1-004:q2': pickDir('-0,5'),
  'ex-4am-tamthil-bayani-khatti-l1-005:q1': R(q(2).div(5).mul(5)),
  'ex-4am-tamthil-bayani-khatti-l1-005:q2': R(q(2).div(q(2).div(5))),
  'ex-4am-tamthil-bayani-khatti-l1-006:q1': R(q(6).div(3).mul(3)),
  'ex-4am-tamthil-bayani-khatti-l1-006:q2': pickStatement(2, [[3, 6], [6, 3], [0, 3]]),
  'ex-4am-tamthil-bayani-khatti-l1-007:q1': pickBelongs(2, 3, 6),
  'ex-4am-tamthil-bayani-khatti-l1-007:q2': pickBelongs(2, 6, 3),
  'ex-4am-tamthil-bayani-khatti-l1-008:q1': R(q('1,5')),
  'ex-4am-tamthil-bayani-khatti-l1-008:q2': pickPoint('1,5', [[1, '1,5'], ['1,5', 1], [0, '1,5']]),
  'ex-4am-tamthil-bayani-khatti-l1-009:q1': pickEquation(-3, [[-3, 0], [1, -3], [0, -3]]),
  'ex-4am-tamthil-bayani-khatti-l1-010:q1': pickDir('0,2'),
  'ex-4am-tamthil-bayani-khatti-l1-010:q2': pickDir(-7),
  'ex-4am-tamthil-bayani-khatti-l2-001:q1': R(q('2,5').mul(2)),
  'ex-4am-tamthil-bayani-khatti-l2-001:q2': R(q('2,5').mul(-2)),
  'ex-4am-tamthil-bayani-khatti-l2-002:q1': R(q('0,5').mul(-2)),
  'ex-4am-tamthil-bayani-khatti-l2-002:q2': pickEquation('0,5', [['0,5', 0], [1, '0,5'], [2, 0]]),
  'ex-4am-tamthil-bayani-khatti-l2-003:q1': R(q(3).div(4).mul(8)),
  'ex-4am-tamthil-bayani-khatti-l2-003:q2': R(q('1,5').div(q(3).div(4))),
  'ex-4am-tamthil-bayani-khatti-l2-004:q1': pickFunction(2, 5, ['2,5', '0,4', null, 5]),
  'ex-4am-tamthil-bayani-khatti-l2-005:q1': R(coef(4, 10)),
  'ex-4am-tamthil-bayani-khatti-l2-005:q2': pickDir(coef(4, 10)),
  'ex-4am-tamthil-bayani-khatti-l2-006:q1': R(coef(2, -6)),
  'ex-4am-tamthil-bayani-khatti-l2-006:q2': pickDir(coef(2, -6)),
  'ex-4am-tamthil-bayani-khatti-l2-007:q1': pickBelongs('-1,5', 2, 3),
  'ex-4am-tamthil-bayani-khatti-l2-007:q2': pickBelongs('-1,5', 2, -3),
  'ex-4am-tamthil-bayani-khatti-l2-008:q1': pickRising(['-0,5', 3, -1]),
  'ex-4am-tamthil-bayani-khatti-l2-009:q1': R(q(60).mul(3)),
  'ex-4am-tamthil-bayani-khatti-l2-009:q2': R(q(150).div(60)),
  'ex-4am-tamthil-bayani-khatti-l2-010:q1': pickPoint('-0,8', [[1, '-0,8'], [1, '0,8'], ['-0,8', 1]]),
  'ex-4am-tamthil-bayani-khatti-l2-010:q2': pickDir('-0,8'),
  'ex-4am-tamthil-bayani-khatti-l3-001:q1': R(coef('-2,5', 4)),
  'ex-4am-tamthil-bayani-khatti-l3-001:q2': R(q('2,5').div(coef('-2,5', 4))),
  'ex-4am-tamthil-bayani-khatti-l3-001:q3': pickDir(coef('-2,5', 4)),
  'ex-4am-tamthil-bayani-khatti-l3-002:q1': pickPoint('-3/2', [[2, -3], [2, 3], [-3, 2]]),
  'ex-4am-tamthil-bayani-khatti-l3-002:q2': pickDir('-3/2'),
  'ex-4am-tamthil-bayani-khatti-l3-003:q1': R(coef('2/7', '-1/3')),
  'ex-4am-tamthil-bayani-khatti-l3-003:q2': R(q(-3).div(coef('2/7', '-1/3'))),
  'ex-4am-tamthil-bayani-khatti-l3-004:q1': R(q('4,5').div(q(3).div(5))),
  'ex-4am-tamthil-bayani-khatti-l3-004:q2': R(q(3).div(5).mul('2,5')),
  'ex-4am-tamthil-bayani-khatti-l3-005:q1': pickBelongs('-3,2', 5, 16),
  'ex-4am-tamthil-bayani-khatti-l3-005:q2': pickFunctionThrough([[5, 16], [10, 32]], ['3,2', '-3,2', '0,32']),
  'ex-4am-tamthil-bayani-khatti-l3-006:q1': pickWhich(['0,8', '-0,8'], -5, 4),
  'ex-4am-tamthil-bayani-khatti-l3-006:q2': pickRising(['0,8', '-0,8']),
  'ex-4am-tamthil-bayani-khatti-l3-007:q1': R(coef('-3/4', '-2/3')),
  'ex-4am-tamthil-bayani-khatti-l3-007:q2': pickDir(coef('-3/4', '-2/3')),
  'ex-4am-tamthil-bayani-khatti-l3-008:q1': R(coef(-2, 5)),
  'ex-4am-tamthil-bayani-khatti-l3-008:q2': R(coef(-2, 5).mul(4)),
  'ex-4am-tamthil-bayani-khatti-l3-009:q1': R(q(80).mul('2,5')),
  'ex-4am-tamthil-bayani-khatti-l3-009:q2': R(q(120).div(80)),
  'ex-4am-tamthil-bayani-khatti-l3-010:q1': R(coef(400, 80).mul(1954)),
  'ex-4am-tamthil-bayani-khatti-l3-010:q2': R(q(10085).div(coef(400, 80))),
  'ex-4am-tamthil-bayani-khatti-l4-001:q1': pickFunction(4, 3, [null, '0,75', '4/3']),
  'ex-4am-tamthil-bayani-khatti-l4-002:q1': R(commonRatio([[2, 5], [4, 10], [6, 15]])),
  'ex-4am-tamthil-bayani-khatti-l4-002:q2': C(commonRatio([[1, 3], [2, 5], [3, 7]]) === null ? 'B' : 'A'),
  'ex-4am-tamthil-bayani-khatti-l4-003:q1': R(coef('-2/3', '-3/2')),
  'ex-4am-tamthil-bayani-khatti-l4-003:q2': C(onLineSqrt(coef('-2/3', '-3/2'), 32, 162) ? 'A' : 'B'),
  'ex-4am-tamthil-bayani-khatti-l4-004:q1': pickReal(Math.sqrt(3) - Math.sqrt(2), [Math.sqrt(3) - Math.sqrt(2), Math.sqrt(3) + Math.sqrt(2), 1]),
  'ex-4am-tamthil-bayani-khatti-l4-004:q2': C(Math.abs((Math.sqrt(3) - Math.sqrt(2)) ** 2 - (Math.sqrt(3) + Math.sqrt(2))) < 1e-9 ? 'A' : 'B'),
  'ex-4am-tamthil-bayani-khatti-l4-005:q1': pickReal(4 / (2 * Math.SQRT2), [Math.SQRT2, 2, 2 * Math.SQRT2, Math.SQRT2 / 2]),
  'ex-4am-tamthil-bayani-khatti-l4-005:q2': R(Math.round((4 / (2 * Math.SQRT2)) * Math.SQRT2)),
  'ex-4am-tamthil-bayani-khatti-l4-006:q1': R(q(4).div('-5/2')),
  'ex-4am-tamthil-bayani-khatti-l4-006:q2': pickIneq('-5/2', 3, [['>=', '-1,2'], ['<=', '-1,2'], ['>=', '1,2']]),
  'ex-4am-tamthil-bayani-khatti-l4-007:q1': R(coef(100, 250).mul(40)),
  'ex-4am-tamthil-bayani-khatti-l4-007:q2': R(q(750).div(coef(100, 250))),
  'ex-4am-tamthil-bayani-khatti-l4-008:q1': pickSigns('up', 'down', [['+', '-'], ['-', '+'], ['+', '+']]),
  'ex-4am-tamthil-bayani-khatti-l4-009:q1': pickDir(coef(-4, -6)),
  'ex-4am-tamthil-bayani-khatti-l4-009:q2': R(coef(-4, -6).mul(-2)),
  'ex-4am-tamthil-bayani-khatti-l4-010:q1': pickMembership([-2, 2], -1, -2, [[false, true], [true, false], [true, true], [false, false]]),
  'ex-4am-tamthil-bayani-khatti-l4-010:q2': pickRising([2, -2]),
  'ex-4am-tamthil-bayani-khatti-l5-001:q1': R(q(6).div('1,2')),
  'ex-4am-tamthil-bayani-khatti-l5-001:q2': pickIneq('1,2', 6, [['<=', 5], ['>=', 5], ['<=', '7,2']]),
  'ex-4am-tamthil-bayani-khatti-l5-002:q1': R(coef(-6, 4)),
  'ex-4am-tamthil-bayani-khatti-l5-002:q2': R(q(-10).div(coef(-6, 4))),
  'ex-4am-tamthil-bayani-khatti-l5-002:q3': pickDir(coef(-6, 4)),
  'ex-4am-tamthil-bayani-khatti-l5-003:q1': R(q(3).mul(60)),
  'ex-4am-tamthil-bayani-khatti-l5-003:q2': R(q(450).div(3)),
  'ex-4am-tamthil-bayani-khatti-l5-003:q3': C(onLine(3, 100, 280) ? 'A' : 'B'),
  'ex-4am-tamthil-bayani-khatti-l5-004:q1': R(q('-0,4')),
  'ex-4am-tamthil-bayani-khatti-l5-004:q2': pickDir('-0,4'),
  'ex-4am-tamthil-bayani-khatti-l5-005:q1': R(q(12).div(8)),
  'ex-4am-tamthil-bayani-khatti-l5-005:q2': R(q(12).div(8).mul(-4)),
  'ex-4am-tamthil-bayani-khatti-l5-006:q1': pickAlignedSet({ A: [2, 3], B: [-4, -6], C: [6, 8] }, [['A', 'B'], ['A', 'C'], ['A', 'B', 'C'], ['B', 'C']]),
  'ex-4am-tamthil-bayani-khatti-l5-007:q1': R(q(6).div('1,5')),
  'ex-4am-tamthil-bayani-khatti-l5-007:q2': pickDir(coef(-4, 6)),
  'ex-4am-tamthil-bayani-khatti-l5-008:q1': R(q('4,5').div('0,3')),
  'ex-4am-tamthil-bayani-khatti-l5-008:q2': R(q('0,3').mul(12)),
  'ex-4am-tamthil-bayani-khatti-l5-009:q1': R(coef(-2, 3).mul(4)),
  'ex-4am-tamthil-bayani-khatti-l5-009:q2': R(q('4,5').div(coef(-2, 3))),
  'ex-4am-tamthil-bayani-khatti-l5-009:q3': pickDir(coef(-2, 3)),
  'ex-4am-tamthil-bayani-khatti-l5-010:q1': pickMembership(['0,5', '-0,5'], 6, -3, [[true, false], [false, true], [true, true], [false, false]]),
  'ex-4am-tamthil-bayani-khatti-l5-010:q2': pickFalling(['0,5', '-0,5']),
};

// Toutes les aides ne servent pas forcément à chaque génération du banc.
void pickFalling; void pickWhich; void R;
