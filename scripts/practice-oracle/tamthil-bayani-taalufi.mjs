// Oracle du banc « tamthil-bayani-taalufi » (unité 7 « الدالة التآلفية », leçon 2) — chaque réponse RECALCULÉE
// ici en rationnels exacts (helpers.mjs), sans lire le contenu ni le code testé (packages/core/arithmetic/affine.js).
// Fusionné dans scripts/practice-answer-oracle.test.mjs. Les QCM sont rejoués : chaque aide rend la LETTRE de
// l'unique option juste et lève une erreur s'il y en a zéro ou deux.
//   fn(a, b)                     la fonction x ⟼ a·x + b
//   line(x1, y1, x2, y2)         la droite par deux points : { a, b } (a = Δy / Δx, b = y1 − a·x1)
//   img(f, x) / ante(f, y)       f(x) ; la solution de a·x + b = y (a ≠ 0)
//   pickPoint(f, pts)            l'unique point du graphe
//   pickPair(f, pairs)           l'unique couple de points [x1, y1, x2, y2] tous deux sur le graphe
//   pickFormula(f, opts)         l'unique [a, b] égal à f
//   pickParallel(f, opts)        l'unique [a, b] de même a et de b différent
//   pickBelongs(f, x, y)         options [نعم, لا]
//   pickDir(f)                   options [يصعد, ينزل, يوازي محور الفواصل]
//   pickRelation(f, g)           options [متوازيان, متقاطعان على محور التراتيب, منطبقان]
// Généré avec le banc par le script de l'auteur ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, P, q } from './helpers.mjs';

const LETTERS = 'ABCD';
const unique = (flags, what) => {
  const hits = flags.map((f, i) => (f ? i : -1)).filter((i) => i >= 0);
  if (hits.length !== 1) throw new Error(`oracle tamthil-bayani-taalufi : ${what} — ${hits.length} options justes`);
  return LETTERS[hits[0]];
};
const same = (u, v) => q(u).sub(q(v)).isZero();
const fn = (a, b) => ({ a: q(a), b: q(b) });
const line = (x1, y1, x2, y2) => { const a = q(y2).sub(q(y1)).div(q(x2).sub(q(x1))); return { a, b: q(y1).sub(a.mul(q(x1))) }; };
const img = (f, x) => f.a.mul(q(x)).add(f.b);
const ante = (f, y) => q(y).sub(f.b).div(f.a);
const on = (f, x, y) => same(img(f, x), y);
const sign = (v) => { const s = q(v).toString(); return s === '0' ? 0 : s.startsWith('-') ? -1 : 1; };
const pickPoint = (f, pts) => C(unique(pts.map(([x, y]) => on(f, x, y)), 'pickPoint'));
const pickPair = (f, pairs) => C(unique(pairs.map(([x1, y1, x2, y2]) => on(f, x1, y1) && on(f, x2, y2)), 'pickPair'));
const pickFormula = (f, opts) => C(unique(opts.map(([a, b]) => same(a, f.a) && same(b, f.b)), 'pickFormula'));
const pickParallel = (f, opts) => C(unique(opts.map(([a, b]) => same(a, f.a) && !same(b, f.b)), 'pickParallel'));
const pickBelongs = (f, x, y) => C(on(f, x, y) ? 'A' : 'B');
const pickDir = (f) => C(LETTERS[sign(f.a) > 0 ? 0 : sign(f.a) < 0 ? 1 : 2]);
const pickRelation = (f, g) => {
  if (!same(f.a, g.a)) return C(same(f.b, g.b) ? 'B' : 'X');
  return C(same(f.b, g.b) ? 'C' : 'A');
};
// R() rend { value } : P() reçoit des chaînes exactes
const val = (v) => v.toString();

export const ORACLE = {
  'ex-4am-tamthil-bayani-taalufi-l1-001:q1': R(img(fn('3/2', 0), 2)),
  'ex-4am-tamthil-bayani-taalufi-l1-001:q2': R(img(fn('3/2', 1), 2)),
  'ex-4am-tamthil-bayani-taalufi-l1-002:q1': pickPoint(fn('3/2', 1), [[0, 1], [1, 0], [0, 0]]),
  'ex-4am-tamthil-bayani-taalufi-l1-002:q2': R(line(0, 1, 2, 4).b),
  'ex-4am-tamthil-bayani-taalufi-l1-003:q1': pickPair(fn('1/2', 3), [[0, 3, 2, 4], [0, 0, 2, 1], [0, 3, 2, 1]]),
  'ex-4am-tamthil-bayani-taalufi-l1-004:q1': pickFormula(line(0, 0, 1, -1), [[-1, 0], [1, 0], [1, -1]]),
  'ex-4am-tamthil-bayani-taalufi-l1-005:q1': P(0, val(img(fn(1, 2), 0))),
  'ex-4am-tamthil-bayani-taalufi-l1-006:q1': R(img(fn(2, 1), 1)),
  'ex-4am-tamthil-bayani-taalufi-l1-006:q2': pickBelongs(fn(2, 1), 2, 5),
  'ex-4am-tamthil-bayani-taalufi-l1-007:q1': R(line(0, 1, 1, 3).b),
  'ex-4am-tamthil-bayani-taalufi-l1-007:q2': R(line(0, 1, 1, 3).a),
  'ex-4am-tamthil-bayani-taalufi-l1-008:q1': R(line(0, 4, 1, 3).a),
  'ex-4am-tamthil-bayani-taalufi-l1-008:q2': pickDir(line(0, 4, 1, 3)),
  'ex-4am-tamthil-bayani-taalufi-l1-009:q1': R(img(line(0, 1, 2, 3), 4)),
  'ex-4am-tamthil-bayani-taalufi-l1-010:q1': R(ante(line(0, 2, 1, 4), 6)),
  'ex-4am-tamthil-bayani-taalufi-l2-001:q1': P(0, val(img(fn(3, -2), 0))),
  'ex-4am-tamthil-bayani-taalufi-l2-001:q2': pickBelongs(fn(3, -2), 1, 1),
  'ex-4am-tamthil-bayani-taalufi-l2-002:q1': pickPair(fn(-2, 3), [[0, 3, 1, 1], [0, -2, 1, 1], [0, 0, 1, -2], [0, 3, 1, 5]]),
  'ex-4am-tamthil-bayani-taalufi-l2-003:q1': R(line(0, -1, 1, 2).b),
  'ex-4am-tamthil-bayani-taalufi-l2-003:q2': R(line(0, -1, 1, 2).a),
  'ex-4am-tamthil-bayani-taalufi-l2-004:q1': R(line(0, 3, 2, 4).a),
  'ex-4am-tamthil-bayani-taalufi-l2-004:q2': pickFormula(line(0, 3, 2, 4), [['1/2', 3], [2, 3], [3, '1/2']]),
  'ex-4am-tamthil-bayani-taalufi-l2-005:q1': R(line(0, -2, 3, -2).a),
  'ex-4am-tamthil-bayani-taalufi-l2-005:q2': pickDir(line(0, -2, 3, -2)),
  'ex-4am-tamthil-bayani-taalufi-l2-006:q1': R(line(-1, 0, 0, 2).b),
  'ex-4am-tamthil-bayani-taalufi-l2-006:q2': R(img(line(-1, 0, 0, 2), 1)),
  'ex-4am-tamthil-bayani-taalufi-l2-007:q1': R(img(line(0, 5, 1, 3), 2)),
  'ex-4am-tamthil-bayani-taalufi-l2-007:q2': R(ante(line(0, 5, 1, 3), 3)),
  'ex-4am-tamthil-bayani-taalufi-l2-008:q1': R(img(fn(-1, 0), 3)),
  'ex-4am-tamthil-bayani-taalufi-l2-008:q2': R(img(fn(-1, 4), 3)),
  'ex-4am-tamthil-bayani-taalufi-l2-009:q1': pickParallel(fn(2, 1), [[2, -3], [1, 2], [-2, 1]]),
  'ex-4am-tamthil-bayani-taalufi-l2-010:q1': R(ante(line(0, -3, 1, -1), 1)),
  'ex-4am-tamthil-bayani-taalufi-l2-010:q2': R(ante(line(0, -3, 1, -1), 0)),
  'ex-4am-tamthil-bayani-taalufi-l3-001:q1': R(line(0, 1, 2, 0).a),
  'ex-4am-tamthil-bayani-taalufi-l3-001:q2': R(line(0, 1, 2, 0).b),
  'ex-4am-tamthil-bayani-taalufi-l3-002:q1': pickPair(fn('1/2', -1), [[0, -1, 2, 0], [0, 0, 2, 1], [0, -1, 1, 1], [0, '1/2', 2, '3/2']]),
  'ex-4am-tamthil-bayani-taalufi-l3-003:q1': R(line(0, -2, 4, 1).a),
  'ex-4am-tamthil-bayani-taalufi-l3-003:q2': pickFormula(line(0, -2, 4, 1), [['3/4', -2], ['4/3', -2], ['3/4', 2]]),
  'ex-4am-tamthil-bayani-taalufi-l3-004:q1': R(line(-2, 0, 0, 3).b),
  'ex-4am-tamthil-bayani-taalufi-l3-004:q2': R(img(line(-2, 0, 0, 3), 2)),
  'ex-4am-tamthil-bayani-taalufi-l3-005:q1': R(ante(line(0, 2, 2, -1), 5)),
  'ex-4am-tamthil-bayani-taalufi-l3-005:q2': R(img(line(0, 2, 2, -1), 4)),
  'ex-4am-tamthil-bayani-taalufi-l3-006:q1': R(img(fn('3/2', -2), -2)),
  'ex-4am-tamthil-bayani-taalufi-l3-007:q1': pickBelongs(fn('-1/2', 3), 4, 1),
  'ex-4am-tamthil-bayani-taalufi-l3-007:q2': pickBelongs(fn('-1/2', 3), -2, 2),
  'ex-4am-tamthil-bayani-taalufi-l3-008:q1': R(line(1, 1, 3, 5).a),
  'ex-4am-tamthil-bayani-taalufi-l3-008:q2': P(0, line(1, 1, 3, 5).b),
  'ex-4am-tamthil-bayani-taalufi-l3-009:q1': R(ante(line(0, -1, 2, 2), 5)),
  'ex-4am-tamthil-bayani-taalufi-l3-009:q2': R(ante(line(0, -1, 2, 2), 0)),
  'ex-4am-tamthil-bayani-taalufi-l3-010:q1': pickRelation(line(0, 2, 1, 3), line(0, -1, 1, 0)),
  'ex-4am-tamthil-bayani-taalufi-l3-010:q2': R(line(0, -1, 1, 0).b),
  'ex-4am-tamthil-bayani-taalufi-l4-001:q1': R(line(-2, 5, 2, -1).a),
  'ex-4am-tamthil-bayani-taalufi-l4-001:q2': R(line(-2, 5, 2, -1).b),
  'ex-4am-tamthil-bayani-taalufi-l4-002:q1': P(0, line(-1, -4, 3, 4).b),
  'ex-4am-tamthil-bayani-taalufi-l4-003:q1': pickPair(fn('-3/2', '3/2'), [[0, '3/2', 1, 0], [0, '-3/2', 1, 0], [0, 0, 1, '-3/2'], ['3/2', 0, 0, 1]]),
  'ex-4am-tamthil-bayani-taalufi-l4-004:q1': R(ante(line(0, '5/2', 2, '7/2'), 4)),
  'ex-4am-tamthil-bayani-taalufi-l4-004:q2': R(img(line(0, '5/2', 2, '7/2'), -1)),
  'ex-4am-tamthil-bayani-taalufi-l4-005:q1': R(line(-3, 0, 0, -2).a),
  'ex-4am-tamthil-bayani-taalufi-l4-005:q2': pickFormula(line(-3, 0, 0, -2), [['-2/3', -2], ['-3/2', -2], ['-2/3', -3]]),
  'ex-4am-tamthil-bayani-taalufi-l4-006:q1': pickFormula(line(0, -3, 2, 2), [['5/2', -3], ['5/2', 3], ['2/5', -3]]),
  'ex-4am-tamthil-bayani-taalufi-l4-007:q1': R(line(0, '9/10', 5, '39/10').b),
  'ex-4am-tamthil-bayani-taalufi-l4-007:q2': R(ante(line(0, '9/10', 5, '39/10'), '21/10')),
  'ex-4am-tamthil-bayani-taalufi-l4-008:q1': pickFormula(line(1, 3, 4, 3), [[0, 3], [3, 0], [1, 2]]),
  'ex-4am-tamthil-bayani-taalufi-l4-008:q2': R(img(line(1, 3, 4, 3), 10)),
  'ex-4am-tamthil-bayani-taalufi-l4-009:q1': R(ante(line(0, -4, 2, -1), 2)),
  'ex-4am-tamthil-bayani-taalufi-l4-009:q2': R(img(line(0, -4, 2, -1), -2)),
  'ex-4am-tamthil-bayani-taalufi-l4-010:q1': P(ante(line(0, 1, 3, -1), -3), -3),
  'ex-4am-tamthil-bayani-taalufi-l5-001:q1': R(line(0, 100, 5, 300).a),
  'ex-4am-tamthil-bayani-taalufi-l5-001:q2': R(img(line(0, 100, 5, 300), 8)),
  'ex-4am-tamthil-bayani-taalufi-l5-001:q3': R(ante(line(0, 100, 5, 300), 500)),
  'ex-4am-tamthil-bayani-taalufi-l5-002:q1': R(line(0, '1/2', 4, '5/2').a),
  'ex-4am-tamthil-bayani-taalufi-l5-002:q2': R(ante(line(0, '1/2', 4, '5/2'), '3/2')),
  'ex-4am-tamthil-bayani-taalufi-l5-003:q1': R(line(0, 12, 4, 6).a),
  'ex-4am-tamthil-bayani-taalufi-l5-003:q2': R(ante(line(0, 12, 4, 6), 0)),
  'ex-4am-tamthil-bayani-taalufi-l5-004:q1': pickFormula(line(-1, '5/2', 1, '-1/2'), [['-3/2', 1], [1, '-3/2'], ['-2/3', 1], ['3/2', 1]]),
  'ex-4am-tamthil-bayani-taalufi-l5-004:q2': P(0, line(-1, '5/2', 1, '-1/2').b),
  'ex-4am-tamthil-bayani-taalufi-l5-005:q1': pickPair(fn('-2/3', 2), [[0, 2, 3, 0], [0, 2, 2, -1], [0, '-2/3', 3, 0], [3, 0, 0, -2]]),
  'ex-4am-tamthil-bayani-taalufi-l5-006:q1': P(0, line(4, 1, 6, 0).b),
  'ex-4am-tamthil-bayani-taalufi-l5-007:q1': R(line(2, -1, 6, 1).a),
  'ex-4am-tamthil-bayani-taalufi-l5-007:q2': R(line(2, -1, 6, 1).b),
  'ex-4am-tamthil-bayani-taalufi-l5-007:q3': R(ante(line(2, -1, 6, 1), 0)),
  'ex-4am-tamthil-bayani-taalufi-l5-008:q1': R(line(2, 4, 3, 7).b),
  'ex-4am-tamthil-bayani-taalufi-l5-009:q1': R(ante(line(0, 300, 2, 600), 1200)),
  'ex-4am-tamthil-bayani-taalufi-l5-009:q2': R(img(line(0, 300, 2, 600), '5/2')),
  'ex-4am-tamthil-bayani-taalufi-l5-010:q1': pickBelongs(fn(2, -1), 5, 9),
  'ex-4am-tamthil-bayani-taalufi-l5-010:q2': P(ante(line(0, -1, 2, 3), 0), 0),
};
