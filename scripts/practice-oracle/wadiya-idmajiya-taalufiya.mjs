// Oracle du banc « wadiya-idmajiya-taalufiya » (unité 7 « الدالة التآلفية ») — chaque réponse RECALCULÉE ici en
// rationnels exacts (helpers.mjs), sans lire le contenu ni le code testé. Fusionné dans
// scripts/practice-answer-oracle.test.mjs.
//
// Méthode : chaque situation est RE-TRADUITE à partir des nombres de son énoncé —
//   · une fonction affine est un couple [a, b] ; img(a, b, x) = a·x + b ; ante(a, b, m) = (m − b)/a ;
//   · deux devis (x1 ; y1), (x2 ; y2) → two(…) = [a, b] par تناسب التغيّرات ; slope(…) = a seul ;
//   · deux tarifs se coupent en cross(a1, b1, a2, b2) = [x, y] ; une جملة ax + by = c se résout par
//     `solve2` (Cramer, helpers.mjs) ;
//   · « le plus grand nombre entier dans le budget » est cherché PAS À PAS (maxWhole), « à partir de combien »
//     aussi (firstWhole) — jamais par un arrondi ;
//   · le tarif le moins cher est l'UNIQUE indice de coût minimal (cheapestIdx lève une erreur en cas d'égalité).
// Pour les QCM calculatoires, `only(options, pred)` vérifie que l'option retenue est la SEULE vraie.
// Généré avec le banc par le script de l'auteur ($S/work/wadiya-idmajiya-taalufiya/gen_bank.py) ;
// ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, P, q, solve2 } from './helpers.mjs';

const sgn = (v) => { const n = q(v).n; return n > 0n ? 1 : n < 0n ? -1 : 0; };
const eqQ = (u, v) => sgn(q(u).sub(v)) === 0;
const lt = (u, v) => sgn(q(u).sub(v)) < 0;
const le = (u, v) => sgn(q(u).sub(v)) <= 0;
/** Le coût d'un tarif [a, b] pour x (rationnel exact). */
const cost = ([a, b], x) => q(a).mul(x).add(b);
const img = (a, b, x) => cost([a, b], x).toString();
const ante = (a, b, m) => q(m).sub(b).div(a).toString();
const slope = (x1, y1, x2, y2) => q(y2).sub(y1).div(q(x2).sub(x1)).toString();
const two = (x1, y1, x2, y2) => { const a = slope(x1, y1, x2, y2); return [a, q(y1).sub(q(a).mul(x1)).toString()]; };
const cross = (a1, b1, a2, b2) => { const x = q(b2).sub(b1).div(q(a1).sub(a2)); return [x.toString(), cost([a1, b1], x).toString()]; };
/** (x ; y) est-il sur la droite y = a·x + b ? */
const on = (a, b, x, y) => eqQ(cost([a, b], x), y);
/** [a, b] passe-t-il par tous les points donnés ? */
const fits = (a, b, pts) => pts.every(([x, y]) => on(a, b, x, y));
/** Le plus grand entier n ≥ 0 tel que a·n + b ≤ m (a > 0), cherché pas à pas. */
function maxWhole(a, b, m) {
  let n = 0; while (le(cost([a, b], n + 1), m)) { n += 1; if (n > 1e6) throw new Error('oracle: boucle'); }
  return String(n);
}
/** Le plus grand entier n ≥ 0 tel que a·n + b ≥ m (a < 0 : une réserve qui s'épuise). */
function maxWholeDown(a, b, m) {
  let n = 0; while (!lt(cost([a, b], n + 1), m)) { n += 1; if (n > 1e6) throw new Error('oracle: boucle'); }
  return String(n);
}
/** Le premier entier n ≥ 0 qui vérifie `pred`. */
function firstWhole(pred) {
  for (let n = 0; n < 1e5; n += 1) if (pred(n)) return String(n);
  throw new Error('oracle: aucun entier');
}
/** L'indice de l'UNIQUE tarif le moins cher en x (erreur s'il y a égalité, sauf `soft` : −1). */
function cheapestIdx(plans, x, soft = false) {
  const costs = plans.map((p) => cost(p, x));
  const min = costs.reduce((m, c) => (lt(c, m) ? c : m));
  const idx = costs.map((c, i) => (eqQ(c, min) ? i : -1)).filter((i) => i >= 0);
  if (idx.length !== 1) { if (soft) return -1; throw new Error(`oracle: égalité de tarifs en x = ${x}`); }
  return idx[0];
}
/** L'unique option (lettre) dont le prédicat est vrai ; sinon erreur. */
function only(options, isRight) {
  const ok = Object.entries(options).filter(([, v]) => isRight(v)).map(([k]) => k);
  if (ok.length !== 1) throw new Error(`oracle: ${ok.length} options justes (${ok.join(',')})`);
  return C(ok[0]);
}

export const ORACLE = {
  'ex-4am-wadiya-idmajiya-taalufiya-l1-001:q1': R(img('35', '80', '6')),
  'ex-4am-wadiya-idmajiya-taalufiya-l1-002:q1': R(ante('100', '200', '700')),
  'ex-4am-wadiya-idmajiya-taalufiya-l1-003:q1': only({ A: ['12', '300'], B: ['300', '12'], C: ['312', '0'], D: ['12', '0'] }, ([a, b]) => fits(a, b, [[0, 300], [10, 420]])),
  'ex-4am-wadiya-idmajiya-taalufiya-l1-004:q1': R(img(45, 250, 0)),
  'ex-4am-wadiya-idmajiya-taalufiya-l1-005:q1': R(slope(5, 4000, 9, 6400)),
  'ex-4am-wadiya-idmajiya-taalufiya-l1-006:q1': P(...cross(1, 2, -1, 8)),
  'ex-4am-wadiya-idmajiya-taalufiya-l1-007:q1': C(['A', 'B'][cheapestIdx([['50', '400'], ['90', '0']], 12)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l1-008:q1': R(maxWhole(150, 200, 1000)),
  'ex-4am-wadiya-idmajiya-taalufiya-l1-009:q1': R(cross(30, 120, 50, 0)[0]),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-001:q1': only({ A: ['10', '80'], B: ['18', '0'], C: ['150', '180'], D: ['10', '180'] }, ([a, b]) => fits(a, b, [[10, 180], [25, 330]])),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-001:q2': R(img(...two(10, 180, 25, 330), 40)),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-002:q1': R(img(20, 150, 7)),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-002:q2': R(ante(20, 150, 450)),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-003:q1': only({ A: ['-1/2', '20'], B: ['1/2', '20'], C: ['-2', '40'] }, ([a, b]) => fits(a, b, [[0, 20], [40, 0]])),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-003:q2': P(...solve2(1, 1, 30, 100, 200, 4000)),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-004:q1': R(cross(100, 500, 200, 0)[0]),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-004:q2': C(['A', 'B'][cheapestIdx([['100', '500'], ['200', '0']], 8)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-005:q1': R(two(0, 3, 2, 7)[1]),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-005:q2': R(two(0, 3, 2, 7)[0]),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-006:q1': R(img(-150, 2000, 6)),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-006:q2': R(maxWholeDown(-150, 2000, 0)),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-007:q1': R(slope(4, 340, 10, 700)),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-007:q2': R(two(4, 340, 10, 700)[1]),
  'ex-4am-wadiya-idmajiya-taalufiya-l2-010:q1': R(maxWhole(120, 1500, 5000)),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-001:q1': only({ A: ['150', '2000'], B: ['3000', '2000'], C: ['350', '0'], D: ['150', '3500'] }, ([a, b]) => fits(a, b, [[10, 3500], [30, 6500]])),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-001:q2': R(cross(100, 4000, ...two(10, 3500, 30, 6500))[0]),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-001:q3': C(['A', 'B'][cheapestIdx([['100', '4000'], two(10, 3500, 30, 6500)], 28)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-002:q1': P(...solve2(1, 1, 25, 300, 500, 9100)),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-003:q1': C(['A', 'B', 'C'][cheapestIdx([['300', '0'], ['100', '800'], ['0', '2000']], 6)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-003:q2': R(cross(300, 0, 100, 800)[0]),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-004:q1': R(cross(150, 2000, 350, 0)[0]),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-004:q2': R(firstWhole((n) => lt(cost(['150', '2000'], n), cost(['350', '0'], n)))),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-005:q1': only({ A: ['-15', '100'], B: ['15', '70'], C: ['-45', '130'], D: ['85', '0'] }, ([a, b]) => fits(a, b, [[1, 85], [4, 40]])),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-005:q2': only({ A: q(6).add(q(40).div(60)), B: q(6).add(q(67).div(60)), C: q(7) }, (t) => eqQ(t, ante(...two(1, 85, 4, 40), 0))),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-006:q1': R(two(0, 500, 4, 900)[0]),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-006:q2': R(img(...two(0, 500, 4, 900), 7)),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-007:q2': R(cost(['50', '600'], 7).sub(cost(['50', '450'], 7)).toString()),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-008:q1': R(img(45, 120, 10)),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-008:q2': R(maxWhole(45, 120, 1000)),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-009:q1': P(...cross(2, -1, -1, 8)),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-009:q2': only({ A: [true, false], B: [true, true], C: [false, true] }, ([u, v]) => u === on(2, -1, 4, 7) && v === on(-1, 8, 4, 7)),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-010:q1': P(...cross(80, 0, 40, 200)),
  'ex-4am-wadiya-idmajiya-taalufiya-l3-010:q2': C(['A', 'B'][cheapestIdx([['80', '0'], ['40', '200']], 3)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-001:q1': P(...solve2(1, 1, 30, 400, 800, 13600)),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-001:q2': R(img(250, 3000, solve2(1, 1, 30, 400, 800, 13600)[0])),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-001:q3': R(q(13600).sub(img(250, 3000, solve2(1, 1, 30, 400, 800, 13600)[0])).toString()),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-002:q1': only({ A: ['150', '4000'], B: ['3000', '4000'], C: ['350', '0'] }, ([a, b]) => fits(a, b, [[20, 7000], [40, 10000]])),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-002:q3': R(cost(['180', '5000'], 30).sub(cost(two(20, 7000, 40, 10000), 30)).toString()),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-003:q1': C(['A', 'B', 'C'][cheapestIdx([['120', '0'], ['60', '240'], ['0', '540']], 3)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-003:q2': C(['A', 'B', 'C'][cheapestIdx([['120', '0'], ['60', '240'], ['0', '540']], 7)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-003:q3': R(cross(60, 240, 0, 540)[0]),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-004:q1': R(cross(100, 600, 250, 0)[0]),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-004:q2': C(['A', 'B'][cheapestIdx([['100', '600'], ['250', '0']], 6)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-004:q3': R(maxWhole(100, 600, 1500)),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-005:q1': R(slope(3, 310, 8, 560)),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-005:q2': R(two(3, 310, 8, 560)[1]),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-005:q3': R(ante(...two(3, 310, 8, 560), 1060)),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-006:q1': R(slope(20, 84, 45, 64)),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-006:q2': R(ante(...two(20, 84, 45, 64), 0)),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-006:q3': only({ A: 125, B: 85, C: 170 }, (m) => eqQ(m, ante(...two(20, 84, 45, 64), 0))),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-007:q1': only({ A: ['-1/3', '18'], B: ['-3', '54'], C: ['1/3', '18'] }, ([a, b]) => fits(a, b, [[0, 18], [54, 0]])),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-007:q2': P(...solve2(1, 1, 30, 200, 600, 10800)),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-008:q1': R(cross(120, 1800, 270, 0)[0]),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-008:q2': R(firstWhole((n) => lt(cost(['120', '1800'], n), cost(['270', '0'], n)))),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-008:q3': R(cost(['120', '1800'], 10).sub(cost(['270', '0'], 10)).toString()),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-009:q1': C(['A', 'B', 'C'][cheapestIdx([['30', '150'], ['60', '0'], ['0', '400']], 4)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-009:q2': C(['A', 'B', 'C'][cheapestIdx([['30', '150'], ['60', '0'], ['0', '400']], 7)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-009:q3': C(['A', 'B', 'C'][cheapestIdx([['30', '150'], ['60', '0'], ['0', '400']], 10)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-010:q1': only({ A: ['-2', '9'], B: ['2', '9'], C: ['-1/2', '9'] }, ([a, b]) => fits(a, b, [[0, 9], [3, 3]])),
  'ex-4am-wadiya-idmajiya-taalufiya-l4-010:q2': P(...cross(2, 3, ...two(0, 9, 3, 3))),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-001:q1': P(...solve2(1, 1, 45, 300, 500, 14500)),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-001:q2': C(['A', 'B'][cheapestIdx([two(20, 7400, 50, 12200), ['100', '7000']], solve2(1, 1, 45, 300, 500, 14500)[0])]),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-001:q3': R(maxWhole(...two(20, 7400, 50, 12200), 14500)),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-002:q1': P(...cross(200, 0, 80, 360)),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-002:q2': C(['A', 'B', 'C'][cheapestIdx([['200', '0'], ['80', '360'], ['0', '800']], 4)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-002:q3': R(maxWhole(160, 720, 1500)),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-003:q1': C(['A', 'B', 'C'][cheapestIdx([['200', '0'], ['80', '1500'], ['0', '3000']], 10)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-003:q2': R(firstWhole((n) => lt(cost(['80', '1500'], n), cost(['200', '0'], n)))),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-003:q3': C(['A', 'B', 'C'][cheapestIdx([['200', '0'], ['80', '1500'], ['0', '3000']], 20)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-004:q1': only({ A: ['-15', '180'], B: ['15', '120'], C: ['-45', '240'] }, ([a, b]) => fits(a, b, [[2, 150], [5, 105]])),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-004:q2': R(ante(...two(2, 150, 5, 105), 0)),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-004:q3': R(firstWhole((n) => lt(cost(two(2, 150, 5, 105), n), 60))),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-005:q1': only({ A: q(3).add(q(20).div(60)), B: q(3).add(q(33).div(60)), C: q(2) }, (t) => eqQ(t, cross(25, 50, 40, 0)[0])),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-005:q2': C(['A', 'B'][cheapestIdx([['40', '0'], ['25', '50']], 3)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-005:q3': C(['A', 'B'][cheapestIdx([['25', '50'], ['40', '0']], 5)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-006:q1': P(...solve2(1, 1, 50, 300, 450, 16200)),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-006:q2': R(img(140, 6000, solve2(1, 1, 50, 300, 450, 16200)[0])),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-006:q3': R(q(16200).sub(img(140, 6000, solve2(1, 1, 50, 300, 450, 16200)[0])).toString()),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-007:q1': only({ A: ['30', '100'], B: ['50', '0'], C: ['210', '250'] }, ([a, b]) => fits(a, b, [[5, 250], [12, 460]])),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-007:q2': R(ante(...two(5, 250, 12, 460), 700)),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-007:q3': R(maxWhole(...two(5, 250, 12, 460), 600)),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-008:q1': only({ A: ['40', '300'], B: ['100', '0'], C: ['200', '500'] }, ([a, b]) => fits(a, b, [[5, 500], [10, 700]])),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-009:q1': P(...cross(100, 0, 50, 150)),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-009:q2': C(['A', 'B', 'C'][cheapestIdx([['100', '0'], ['50', '150'], ['0', '400']], 4)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-009:q3': R(firstWhole((n) => cheapestIdx([['100', '0'], ['50', '150'], ['0', '400']], n, true) === 2)),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-010:q1': R(cross(300, 8000, 500, 0)[0]),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-010:q2': C(['A', 'B'][cheapestIdx([['500', '0'], ['300', '8000']], 35)]),
  'ex-4am-wadiya-idmajiya-taalufiya-l5-010:q3': R(maxWhole(300, 8000, 20000)),
};
