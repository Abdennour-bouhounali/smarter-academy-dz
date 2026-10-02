// Oracle du banc « tanasub-muamil » (unité 6 « الدالة الخطية والتناسبية », leçon 1) — chaque réponse
// RECALCULÉE ici, sans lire le contenu ni le code testé (packages/core/arithmetic/proportional.js).
// Fusionné dans scripts/practice-answer-oracle.test.mjs. Les données de chaque énoncé (tableaux, tarifs)
// sont RECOPIÉES dans l'expression ; l'arithmétique est celle de helpers.mjs (rationnels exacts) :
//   coef(xs, ys)               le quotient commun y ÷ x (lève une erreur si le tableau n'est pas proportionnel)
//   fourth(x1, y1, x2)         le quatrième proportionnel y1 × x2 ÷ x1
//   pickVerdict(xs, ys, opts)  l'unique option juste parmi ['yes', a] (proportionnel, coefficient a) / ['no']
//   pickRule(xs, ys, fns)      l'unique règle x ↦ y qui redonne TOUT le tableau
//   pickValue(target, opts)    l'unique option égale à la cible
//   pickSet(pred, sets, dom)   l'unique ensemble égal aux solutions de pred, cherchées par balayage de dom
//   pickClaims(fns, claims, cs) l'unique liste de verdicts « proportionnel ? » juste pour chaque règle
//   pickCheaper(x, A, B, tags) le tarif le moins cher pour la durée x (A, B = [prix unitaire, montant fixe])
// Généré avec le banc par le script de l'auteur ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, q } from './helpers.mjs';

const LETTERS = 'ABCDEF';
const unique = (flags, what) => {
  const hits = flags.map((f, i) => (f ? i : -1)).filter((i) => i >= 0);
  if (hits.length !== 1) throw new Error(`oracle tanasub-muamil : ${what} — ${hits.length} options justes`);
  return LETTERS[hits[0]];
};
const eqQ = (a, b) => q(a).sub(q(b)).isZero();
const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => String(lo + i));

function isProp(xs, ys) {
  if (xs.some((x, i) => q(x).isZero() && !q(ys[i]).isZero())) return false;
  const r = xs.map((x, i) => (q(x).isZero() ? null : q(ys[i]).div(q(x)))).filter(Boolean);
  return r.length > 0 && r.every((v) => eqQ(v, r[0]));
}
function coef(xs, ys) {
  if (!isProp(xs, ys)) throw new Error('oracle tanasub-muamil : tableau non proportionnel');
  const i = xs.findIndex((x) => !q(x).isZero());
  return q(ys[i]).div(q(xs[i])).toString();
}
const fourth = (x1, y1, x2) => q(y1).mul(q(x2)).div(q(x1)).toString();
function pickVerdict(xs, ys, opts) {
  const prop = isProp(xs, ys);
  const a = prop ? coef(xs, ys) : null;
  return C(unique(opts.map(([says, v]) => (says === 'yes' ? prop && eqQ(v, a) : !prop)), 'pickVerdict'));
}
const pickRule = (xs, ys, fns) => C(unique(fns.map((f) => xs.every((x, i) => eqQ(f(q(x)), ys[i]))), 'pickRule'));
const pickValue = (target, opts) => C(unique(opts.map((o) => o != null && eqQ(o, target)), 'pickValue'));
function pickSet(pred, sets, dom) {
  const sol = dom.filter((v) => pred(q(v))).map((v) => q(v).toString()).sort();
  return C(unique(sets.map((s) => s.map((v) => q(v).toString()).sort().join('|') === sol.join('|')), 'pickSet'));
}
const pickClaims = (fns, claims, cs) => {
  const truth = fns.map((f) => isProp(cs, cs.map((c) => f(q(c)))));
  return C(unique(claims.map((cl) => cl.every((v, i) => v === truth[i])), 'pickClaims'));
};
function pickCheaper(x, [a1, b1], [a2, b2], tags) {
  const A = q(a1).mul(x).add(b1); const B = q(a2).mul(x).add(b2);
  const d = A.sub(B);
  const tag = d.isZero() ? 'same' : d.n < 0n ? 'A' : 'B';
  return C(unique(tags.map((t) => t === tag), 'pickCheaper'));
}

export const ORACLE = {
  'ex-4am-tanasub-muamil-l1-001:q1': R(fourth('-2', '6', '3')),
  'ex-4am-tanasub-muamil-l1-002:q1': R(coef(['2','4','6'], ['10','20','30'])),
  'ex-4am-tanasub-muamil-l1-003:q1': pickVerdict(['1','2','5'], ['3','6','15'], [['yes','3'], ['yes','1/3'], ['no']]),
  'ex-4am-tanasub-muamil-l1-004:q1': R(q(15).mul(8)),
  'ex-4am-tanasub-muamil-l1-004:q2': pickRule(['1','2','8'], ['15','30','120'], [(x) => x.add(15), (x) => q(15).mul(x), (x) => x.div(15)]),
  'ex-4am-tanasub-muamil-l1-005:q1': pickVerdict(['3','4','5'], ['5','6','7'], [['yes','2'], ['no'], ['yes','2']]),
  'ex-4am-tanasub-muamil-l1-006:q1': R(coef(['1','2','4'], ['250','500','1000'])),
  'ex-4am-tanasub-muamil-l1-007:q1': R(fourth('1', '100', '3')),
  'ex-4am-tanasub-muamil-l1-007:q2': pickVerdict(['1','2','3'], ['100','200','300'], [['yes','100'], ['no'], ['no']]),
  'ex-4am-tanasub-muamil-l1-008:q1': pickVerdict(['1','2','3'], [q(30).add(100), q(60).add(100), q(90).add(100)], [['yes','30'], ['no'], ['yes','30']]),
  'ex-4am-tanasub-muamil-l1-009:q1': R(fourth('2', '8', '5')),
  'ex-4am-tanasub-muamil-l1-010:q1': R(q(4).mul(7)),
  'ex-4am-tanasub-muamil-l2-001:q1': R(q(150).sub(q(150).mul(20).div(100))),
  'ex-4am-tanasub-muamil-l2-001:q2': R(coef(['50','100'], ['40','80'])),
  'ex-4am-tanasub-muamil-l2-002:q1': R(q(6).add(9)),
  'ex-4am-tanasub-muamil-l2-003:q1': R(q(7).mul(4)),
  'ex-4am-tanasub-muamil-l2-004:q1': R(coef(['4','10','20'], ['3','7,5','15'])),
  'ex-4am-tanasub-muamil-l2-005:q1': R(coef(['500','1000','2500'], ['600','1200','3000'])),
  'ex-4am-tanasub-muamil-l2-005:q2': pickRule(['500','1000','2500'], ['600','1200','3000'], [(x) => x.div(q('1,2')), (x) => x.add(100), (x) => q('1,2').mul(x)]),
  'ex-4am-tanasub-muamil-l2-006:q1': R(q(200).mul(4).add(500).div(4)),
  'ex-4am-tanasub-muamil-l2-006:q2': pickVerdict(['1','4'], [q(700), q(1300)], [['yes','200'], ['no'], ['yes','200']]),
  'ex-4am-tanasub-muamil-l2-008:q1': R(fourth('5', '12', '8')),
  'ex-4am-tanasub-muamil-l2-009:q1': R(coef(['2','3','7'], ['9','13,5','31,5'])),
  'ex-4am-tanasub-muamil-l2-010:q1': R(q(300).mul(25)),
  'ex-4am-tanasub-muamil-l2-010:q2': R(q(4800).div(300)),
  'ex-4am-tanasub-muamil-l3-001:q1': pickSet((b) => b.sub(1).mul(q(1).sub(b)).sub(q(4).mul(-16)).isZero(), [['9'], ['-7','9'], ['7','-9'], ['-7']], range(-20, 20)),
  'ex-4am-tanasub-muamil-l3-002:q1': pickValue(q(2).mul(8), ['64', '16', '10']),
  'ex-4am-tanasub-muamil-l3-002:q2': pickVerdict(['2,5','3','8','9,5'], ['5','6','16','19'], [['yes','2'], ['yes','1'], ['no']]),
  'ex-4am-tanasub-muamil-l3-002:q3': pickVerdict(['2,5','3','8'], ['6,25','9','64'], [['yes','1'], ['no'], ['yes','2,5']]),
  'ex-4am-tanasub-muamil-l3-003:q2': R(coef(['1','0,5'], ['1,5','0,75'])),
  'ex-4am-tanasub-muamil-l3-004:q1': R(fourth('65', '260', '100')),
  'ex-4am-tanasub-muamil-l3-005:q1': R(coef(['-2','4','6'], ['5','-10','-15'])),
  'ex-4am-tanasub-muamil-l3-006:q1': R(q(10).mul(6).add(50)),
  'ex-4am-tanasub-muamil-l3-006:q2': R(q(10).mul(5).add(50).div(5)),
  'ex-4am-tanasub-muamil-l3-006:q3': pickVerdict(['1','5'], [q(60), q(100)], [['yes','10'], ['no'], ['yes','10']]),
  'ex-4am-tanasub-muamil-l3-007:q1': R(coef(['3','6','9'], ['2','4','6'])),
  'ex-4am-tanasub-muamil-l3-008:q1': R(q(12).mul(25)),
  'ex-4am-tanasub-muamil-l3-008:q2': R(q(180).div(12)),
  'ex-4am-tanasub-muamil-l3-010:q1': R(q('4').add(q('4,8'))),
  'ex-4am-tanasub-muamil-l4-001:q1': R(fourth('6', '3', '14')),
  'ex-4am-tanasub-muamil-l4-002:q1': pickSet((m) => m.mul(m).sub(36).isZero(), [['6'], ['6','-6'], ['36'], ['-6']], range(-40, 40)),
  'ex-4am-tanasub-muamil-l4-003:q1': R(coef(['6','9','15'], ['4','6','10'])),
  'ex-4am-tanasub-muamil-l4-003:q2': pickRule(['6','9','15'], ['4','6','10'], [(x) => x.sub(2), (x) => q('2/3').mul(x), (x) => q('3/2').mul(x)]),
  'ex-4am-tanasub-muamil-l4-004:q1': R(q(20).mul(10)),
  'ex-4am-tanasub-muamil-l4-004:q2': R(q(12).mul(10).add(60)),
  'ex-4am-tanasub-muamil-l4-005:q1': pickVerdict(['1,5','2,5','4'], ['6','10','15'], [['yes','4'], ['no'], ['yes','1/4']]),
  'ex-4am-tanasub-muamil-l4-006:q1': R(q('2,5').mul(q('7,4'))),
  'ex-4am-tanasub-muamil-l4-007:q1': R(fourth('0,8', '3,2', '2')),
  'ex-4am-tanasub-muamil-l4-008:q1': R(q(20).div(q('1,25'))),
  'ex-4am-tanasub-muamil-l4-009:q1': pickClaims([(c) => q(4).mul(c), (c) => c.mul(c)], [[true, false], [true, true], [false, true]], ['1','2','3']),
  'ex-4am-tanasub-muamil-l4-010:q1': R(coef(['-3','1','4'], ['6','-2','-8'])),
  'ex-4am-tanasub-muamil-l4-010:q2': pickRule(['-3','1','4'], ['6','-2','-8'], [(x) => q(-2).mul(x), (x) => q(2).mul(x), (x) => x.sub(3)]),
  'ex-4am-tanasub-muamil-l5-001:q1': pickCheaper(8, [15, 0], [10, 50], ['A', 'B', 'same']),
  'ex-4am-tanasub-muamil-l5-001:q2': R(q(50).div(q(15).sub(10))),
  'ex-4am-tanasub-muamil-l5-001:q3': R(q(15).mul(15).sub(q(10).mul(15).add(50))),
  'ex-4am-tanasub-muamil-l5-002:q1': R(fourth('1,5', '200', '4,5')),
  'ex-4am-tanasub-muamil-l5-002:q2': R(coef(['1,5','3','6'], ['200','400','800'])),
  'ex-4am-tanasub-muamil-l5-003:q1': R(fourth('6', '300', '15')),
  'ex-4am-tanasub-muamil-l5-003:q2': pickRule(['6','15'], ['300','750'], [(x) => q(300).mul(x), (x) => q(50).mul(x), (x) => x.add(294)]),
  'ex-4am-tanasub-muamil-l5-003:q3': R(q(1000).div(50)),
  'ex-4am-tanasub-muamil-l5-004:q1': R(fourth('100', '2,5', '340')),
  'ex-4am-tanasub-muamil-l5-004:q2': R(coef(['100'], ['2,5'])),
  'ex-4am-tanasub-muamil-l5-005:q1': R(q(4000).sub(q(4000).mul(30).div(100))),
  'ex-4am-tanasub-muamil-l5-005:q2': R(q(1).sub(q(30).div(100))),
  'ex-4am-tanasub-muamil-l5-005:q3': R(q(5600).div(q('0,7'))),
  'ex-4am-tanasub-muamil-l5-006:q2': R(q(120).mul(35)),
  'ex-4am-tanasub-muamil-l5-007:q1': R(fourth('4', '6', '10')),
  'ex-4am-tanasub-muamil-l5-007:q2': R(q(21).div(q(6).div(4))),
  'ex-4am-tanasub-muamil-l5-008:q1': pickVerdict(['6,25','9','64'], ['6,25','9','64'], [['yes','1'], ['no'], ['yes','2']]),
  'ex-4am-tanasub-muamil-l5-008:q2': R(q(10).mul(10)),
  'ex-4am-tanasub-muamil-l5-009:q1': R(fourth('60', '4,5', '40')),
  'ex-4am-tanasub-muamil-l5-009:q2': R(fourth('4,5', '60', '6')),
  'ex-4am-tanasub-muamil-l5-010:q1': R(q('4,5').mul(200).add(400)),
  'ex-4am-tanasub-muamil-l5-010:q2': R(q('4,5').mul(100).add(400).div(100)),
  'ex-4am-tanasub-muamil-l5-010:q3': pickVerdict(['100','200'], [q(850), q(1300)], [['yes','4,5'], ['no'], ['yes','8,5']]),
};
