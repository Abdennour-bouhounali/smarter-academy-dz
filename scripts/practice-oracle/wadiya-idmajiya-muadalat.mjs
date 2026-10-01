// Oracle du banc « wadiya-idmajiya-muadalat » (unité 4 « معادلات ومتراجحات ») — chaque réponse RECALCULÉE ici,
// sans lire le contenu ni le code testé. Fusionné dans scripts/practice-answer-oracle.test.mjs.
//
// Méthode : chaque OPTION d'un QCM est MODÉLISÉE (une inéquation, un ensemble de solutions, un polynôme,
// un encadrement, une affirmation sur des coûts), puis `only(options, isRight)` vérifie que l'option
// retenue est la SEULE vraie — un QCM dont deux options seraient justes, ou aucune, fait planter le
// chargement de l'oracle. Les réponses tapées sont recalculées en rationnels exacts (helpers.mjs `q`,
// `poly`) ; « ابتداءً من » = le PREMIER entier naturel qui vérifie l'inéquation, cherché pas à pas.
import { R, C, q, poly } from './helpers.mjs';

/* ── Arithmétique exacte ─────────────────────────────────────────────── */
const sign = (v) => { const n = q(v).n; return n > 0n ? 1 : n < 0n ? -1 : 0; };
const cmp = (a, b) => sign(q(a).sub(b));
const holds = (l, rel, r) => { const c = cmp(l, r); return { '<': c < 0, '<=': c <= 0, '>': c > 0, '>=': c >= 0, '=': c === 0 }[rel]; };
const FLIP = { '<': '>', '<=': '>=', '>': '<', '>=': '<=', '=': '=' };
/** a·x + b  rel  c·x + d  →  [rel', borne] (x rel' borne) ; division par un négatif ⇒ sens inversé. */
function ineq(a, b, rel, c, d) {
  const k = q(a).sub(c);
  if (sign(k) === 0) throw new Error('oracle: inéquation sans x');
  const bound = q(d).sub(b).div(k);
  return [sign(k) < 0 ? FLIP[rel] : rel, bound.toString()];
}
const sameRay = ([r1, b1], [r2, b2]) => r1 === r2 && cmp(b1, b2) === 0;
/** a·x + b = c·x + d → x */
const solve = (a, b, c, d) => q(d).sub(b).div(q(a).sub(c)).toString();
/** Les racines de (a1 x + b1)(a2 x + b2)… = 0, triées. */
const roots = (...f) => f.filter(([a]) => sign(a) !== 0).map(([a, b]) => q(b).neg().div(a).toString()).sort((u, v) => cmp(u, v));
const sameSet = (u, v) => u.length === v.length && [...u].sort((s, t) => cmp(s, t)).every((s, i) => cmp(s, [...v].sort((a, b) => cmp(a, b))[i]) === 0);
/** Le premier entier naturel n tel que pred(n). */
const firstNat = (pred) => { for (let n = 0; n <= 100000; n += 1) if (pred(n)) return n; throw new Error('oracle: aucun naturel'); };
/** Le plus grand entier naturel n tel que pred(n), pred décroissant. */
const lastNat = (pred) => { let last = null; for (let n = 0; n <= 100000; n += 1) { if (pred(n)) last = n; else if (last !== null) break; } return last; };

/** L'unique option (lettre) dont le prédicat est vrai ; sinon erreur. */
function only(options, isRight) {
  const ok = Object.entries(options).filter(([, v]) => isRight(v)).map(([k]) => k);
  if (ok.length !== 1) throw new Error(`oracle: ${ok.length} options justes (${ok.join(',')})`);
  return C(ok[0]);
}
const isRay = (target) => (v) => Array.isArray(v) && sameRay(v, target);
const isSet = (target) => (v) => Array.isArray(v) && sameSet(v, target);
const isPoly = (target) => (v) => v.equals(target);
const P = (...c) => c.reduce((acc, a, k) => acc.add(poly.x.pow(k).mul(a)), poly.of(0));
const lin = (a, b) => poly.x.mul(a).add(b);

/** Une inéquation entre deux polynômes, réduite : L − R rel 0, les x² doivent s'annuler. */
function reduce([L, rel, Rr]) {
  const D = L.sub(Rr);
  if (D.degree() > 1) return null;              // pas du premier degré : jamais l'équivalent cherché
  if (D.degree() < 1) return ['const', rel, D.coef(0)];
  return ineq(D.coef(1), D.coef(0), rel, 0, 0);
}
const sameIneq = (target) => (opt) => { const a = reduce(opt); const b = reduce(target); return a !== null && a[0] !== 'const' && sameRay(a, b); };
/** Un encadrement lo (≤|<) x (≤|<) hi, comparé à l'intersection de deux demi-droites. */
function meet(r1, r2) {
  const lower = [r1, r2].find(([r]) => r === '>' || r === '>=');
  const upper = [r1, r2].find(([r]) => r === '<' || r === '<=');
  if (!lower || !upper) throw new Error('oracle: pas un encadrement');
  return { lo: lower[1], loIn: lower[0] === '>=', hi: upper[1], hiIn: upper[0] === '<=' };
}
const sameIv = (t) => (v) => v && v.lo !== undefined && cmp(v.lo, t.lo) === 0 && cmp(v.hi, t.hi) === 0 && v.loIn === t.loIn && v.hiIn === t.hiIn;
const Iv = (lo, loIn, hi, hiIn) => ({ lo, loIn, hi, hiIn });
const intsIn = ({ lo, loIn, hi, hiIn }) => { let n = 0; for (let k = -1000; k <= 1000; k += 1) if ((loIn ? cmp(k, lo) >= 0 : cmp(k, lo) > 0) && (hiIn ? cmp(k, hi) <= 0 : cmp(k, hi) < 0)) n += 1; return n; };
/** Une demi-droite décrite en mots (QCM 6 et 9) : côté du rouge et borne incluse ou non. */
const ray = (side, bound, included) => [side === 'right' ? (included ? '>=' : '>') : (included ? '<=' : '<'), String(bound)];

/* ── Les coûts des situations ─────────────────────────────────────────── */
const cost = (fixed, per) => (n) => q(fixed).add(q(per).mul(n));
const better = (cheap, dear) => (n) => cmp(cheap(n), dear(n)) < 0;

// La situation du manuel (p. 52) : formule 1 = 75 par séance ; formule 2 = 560 + 5 par séance.
const F1 = cost(0, 75); const F2 = cost(560, 5);
const sitRay = ineq(5, 560, '<', 75, 0);           // 560 + 5x < 75x

/* ── Données recalculées ─────────────────────────────────────────────── */
// ex-34 : E = (5x − 1)² − (2x + 3)(5x − 1)
const E34 = lin(5, -1).pow(2).sub(lin(2, 3).mul(lin(5, -1)));
// ex-36 : A = (x + 4)² − x(x − 2) ; B = (3x − 1)(3x + 1) − (3x − 2)²
const A36 = lin(1, 4).pow(2).sub(poly.x.mul(lin(1, -2)));
const B36 = lin(3, -1).mul(lin(3, 1)).sub(lin(3, -2).pow(2));
// ex-35 : A = (3x + 4)(x − 7) − (54x² − 96)
const A35 = lin(3, 4).mul(lin(1, -7)).sub(P(-96, 0, 54));
// ex-41 : E = (4x − 1)² − (3x + 2)(4x − 1)
const E41 = lin(4, -1).pow(2).sub(lin(3, 2).mul(lin(4, -1)));
const F47 = lin(2, 1).pow(2).sub(lin(2, 1).mul(lin(1, 5)));   // l4-007
const G57 = lin(3, -2).pow(2).sub(lin(3, -2).mul(lin(1, 4))); // l5-007

if (!lin(3, 4).mul(lin(3, -4)).mul(6).equals(P(-96, 0, 54))) throw new Error('oracle: ex-35 q1');
if (!B36.equals(lin(12, -5))) throw new Error('oracle: ex-36 B');
if (!E41.equals(P(3, -13, 4))) throw new Error('oracle: ex-41 E');
if (!G57.equals(P(12, -22, 6))) throw new Error('oracle: l5-007 G');

const K = (s) => `ex-4am-wadiya-idmajiya-muadalat-${s}`;

export const ORACLE = {
  /* ── Niveau 1 ── */
  [K('l1-001:q1')]: only({ A: '2', B: '7', C: '3' }, (v) => cmp(v, solve(1, -2, 0, 5)) === 0),
  [K('l1-002:q1')]: only({ A: '5/4', B: '0', C: '4/5' }, (v) => cmp(v, solve(4, 0, 5, 0)) === 0),
  [K('l1-003:q1')]: only({ A: ['3'], B: ['-1'], C: ['3', '-1'] }, isSet(roots([1, -3], [2, 2]))),
  [K('l1-004:q1')]: only({ A: ['>', '3'], B: ['<', '-3'], C: ['>', '-3'] }, isRay(ineq('-1/3', 0, '>', 0, 1))),
  [K('l1-005:q1')]: only({ A: P(300, 5), B: P(0, 305), C: P(5, 300), D: P(0, 20) }, isPoly(P(300, 5))),
  [K('l1-005:q2')]: R(cost(300, 5)(10)),                                   // 350
  [K('l1-006:q1')]: only({ A: P(50, 30), B: P(0, 80), C: P(30, 50), D: P(30, 1) }, isPoly(P(50, 30))),
  [K('l1-006:q2')]: R(cost(50, 30)(7)),                                    // 260
  [K('l1-007:q1')]: R(solve(3, -4, 2, 5)),                                 // 9
  [K('l1-008:q1')]: only({ A: ['6'], B: ['-6', '3'], C: ['6', '-9'], D: ['6', '-3'] }, isSet(roots([1, -6], [3, 9]))),
  // 4 séances : (أ) 40·4 = 160 ; (ب) 150 + 10·4 = 190
  [K('l1-009:q1')]: only({ A: 'a', B: 'b', C: '=' }, (v) => v === (cmp(cost(0, 40)(4), cost(150, 10)(4)) < 0 ? 'a' : cmp(cost(0, 40)(4), cost(150, 10)(4)) > 0 ? 'b' : '=')),
  [K('l1-009:q2')]: R(cost(150, 10)(4).sub(cost(0, 40)(4))),              // 30
  [K('l1-010:q1')]: only({ A: ['>', '4'], B: ['<', '7'], C: ['<', '4'], D: ['=', '4'] }, isRay(ineq(2, 3, '<', 0, 11))),

  /* ── Niveau 2 ── */
  [K('l2-001:q1')]: only({ A: ['1', '-1'], B: ['1'], C: ['-1'] }, isSet(roots([1, -1], [1, 1]))),
  // QCM 5 : x ≥ −1 ⇒ ? Une affirmation affine est vraie sur tout le rayon ssi elle l'est à la borne et loin.
  [K('l2-002:q1')]: (() => {
    const implied = (a, b, rel) => [-1, 1000].every((x) => holds(q(a).mul(x).add(b), rel, 0));
    const s = { 1: implied(2, 2, '>='), 2: implied(2, -2, '<'), 3: implied(2, 2, '>=') };   // (3) 2x ≥ −2 ⇔ 2x + 2 ≥ 0
    const set = Object.keys(s).filter((k) => s[k]).join('+');
    return only({ A: '1+3', B: '1', C: '2', D: '2+3' }, (v) => v === set);
  })(),
  // QCM 7 : −1 vérifie-t-il chaque inéquation ?
  [K('l2-003:q1')]: (() => {
    const s = { 1: holds(q(2).mul(-1), '<', -3), 2: holds(q(2).mul(-1).add(1), '<', 0), 3: holds(q(-1).mul(-1).add(1), '>', 0) };
    const set = Object.keys(s).filter((k) => s[k]).join('+');
    return only({ A: '1', B: '2+3', C: '2', D: '1+2+3' }, (v) => v === set);
  })(),
  [K('l2-004:q1')]: only({ A: ray('right', -3, false), B: ray('left', -3, true), C: ray('right', -3, true), D: ray('left', 0, false) }, isRay(['>', '-3'])),
  [K('l2-005:q1')]: only({ A: [P(600, 40), '>', P(0, 100)], B: [P(600, 40), '<', P(0, 100)], C: [P(600, 40), '=', P(0, 100)], D: [P(0, 640), '<', P(0, 100)] },
    (o) => o[1] !== '=' && sameIneq([P(600, 40), '<', P(0, 100)])(o)),
  [K('l2-005:q2')]: R(firstNat(better(cost(600, 40), cost(0, 100)))),     // 11
  [K('l2-006:q1')]: R(solve(3, 0, 1, 200)),                                 // 100
  [K('l2-006:q2')]: R(firstNat(better(cost(200, 1), cost(0, 3)))),        // 101
  [K('l2-007:q1')]: R(solve(5, -10, 3, 4)),                                 // 5(x − 2) = 3x + 4 → 7
  [K('l2-008:q1')]: only({ A: ['>=', '-3'], B: ['<=', '3'], C: ['<=', '-3'], D: ['<=', '-13/2'] }, isRay(ineq(-4, 7, '>=', 0, 19))),
  [K('l2-009:q1')]: only({ A: ['5/2', '-4'], B: ['2/5', '-4'], C: ['5', '-4'], D: ['-5/2', '4'] }, isSet(roots([2, -5], [1, 4]))),
  [K('l2-010:q1')]: R(solve(120, 0, 80, 200)),                              // 5
  [K('l2-010:q2')]: only({ A: 'b', B: 'a', C: '=' }, (v) => v === (cmp(cost(0, 120)(3), cost(200, 80)(3)) < 0 ? 'a' : 'b')),

  /* ── Niveau 3 ── */
  [K('l3-001:q1')]: only({ A: P(4, -23, 15), B: P(-2, 3, 15), C: P(4, -13, 15), D: P(-2, -23, 15) }, isPoly(E34)),
  [K('l3-001:q2')]: R(E34.at(-1)),                                          // 42
  [K('l3-002:q1')]: only({ A: P(16, 6), B: P(16, 10), C: P(16, 2), D: P(16, 6, 2) }, isPoly(A36)),
  [K('l3-002:q2')]: only({ A: ['>=', '21/2'], B: ['<=', '2/21'], C: ['<=', '11/2'], D: ['<=', '21/2'] }, isRay(reduce([A36, '>=', B36]))),
  [K('l3-003:q1')]: only({ A: ray('left', -2, false), B: ray('left', 0, false), C: ray('right', -2, false), D: ray('right', -2, true) }, isRay(ineq(1, 1, '>', 0, -1))),
  [K('l3-004:q1')]: only({ A: P(0, 565), B: P(5, 560), C: P(560, 5), D: P(560, 75) }, isPoly(P(560, 5))),
  [K('l3-004:q2')]: R(F1(8)),                                               // 600
  [K('l3-004:q3')]: R(F2(8)),                                               // 600
  [K('l3-005:q1')]: only({ A: [P(1500, 100), '<', P(0, 250)], B: [P(1500, 100), '>', P(0, 250)], C: [P(0, 1600), '<', P(0, 250)], D: [P(1500, 100), '=', P(0, 250)] },
    (o) => o[1] !== '=' && sameIneq([P(1500, 100), '<', P(0, 250)])(o)),
  [K('l3-005:q2')]: R(firstNat(better(cost(1500, 100), cost(0, 250)))),   // 11
  [K('l3-006:q1')]: R(solve(15, 0, 5, 400)),                                // 40
  [K('l3-006:q2')]: (() => {
    const a = cost(0, 15)(40); const b = cost(400, 5)(40);
    const truth = { A: cmp(b, a) < 0, B: cmp(a, b) < 0 && cmp(b.sub(a), 400) === 0, C: cmp(b, a) < 0 && cmp(a.sub(b), 200) === 0, D: cmp(a, b) === 0 && cmp(a, 600) === 0 };
    return only(truth, (v) => v === true);
  })(),
  [K('l3-007:q1')]: only({ A: P(9), B: P(9, 6), C: P(9, 3), D: P(9, 6, 2) }, isPoly(lin(1, 3).pow(2).sub(poly.x.pow(2)))),
  [K('l3-007:q2')]: R(solve(6, 9, 0, 33)),                                  // 4
  [K('l3-008:q1')]: only({ A: ['>', '6'], B: ['>', '2'], C: ['<', '6'], D: ['>', '4'] }, isRay(reduce([lin(1, -2).mul(3).sub(lin(1, 4)), '>', P(2)]))),
  // x² = 9x : x(x − 9) = 0
  [K('l3-009:q1')]: only({ A: ['9'], B: ['0', '9'], C: ['3', '-3'], D: ['0'] }, isSet(roots([1, 0], [1, -9]))),
  [K('l3-009:q2')]: R(roots([1, 0], [1, -9]).find((r) => sign(r) !== 0)),   // 9
  // périmètres : triangle 3x ; rectangle 2(x + 3 + 5)
  [K('l3-010:q1')]: only({ A: [P(0, 3), '>', P(16, 2)], B: [P(0, 3), '>', P(8, 1)], C: [P(0, 3), '<', P(16, 2)], D: [P(0, 1), '>', P(16, 2)] },
    sameIneq([P(0, 3), '>', lin(1, 8).mul(2)])),
  [K('l3-010:q2')]: R(firstNat((n) => cmp(q(3).mul(n), q(2).mul(n + 8)) > 0)), // 17

  /* ── Niveau 4 ── */
  [K('l4-001:q1')]: only({ A: lin(3, 4).mul(lin(-17, -31)), B: lin(3, 4).mul(lin(-17, 17)), C: lin(3, 4).mul(lin(-2, -3)), D: lin(3, 4).mul(lin(19, -31)) }, isPoly(A35)),
  [K('l4-001:q2')]: only({ A: ['-4/3', '1'], B: ['4/3', '-1'], C: ['-4/3'], D: ['-4/3', '17'] }, isSet(roots([3, 4], [-17, 17]))),
  // 54x² − 96 ≤ 18x(3x + 1) − 90
  [K('l4-001:q3')]: only({ A: ['<=', '-1/3'], B: ['>=', '-3'], C: ['>=', '-1/3'], D: ['>=', '1/3'] }, isRay(reduce([P(-96, 0, 54), '<=', poly.x.mul(18).mul(lin(3, 1)).sub(90)]))),
  [K('l4-002:q1')]: only({ A: lin(4, -1).mul(lin(1, -3)), B: lin(4, -1).mul(lin(7, 1)), C: lin(4, -1).mul(lin(1, 1)), D: lin(4, 1).mul(lin(1, -3)) }, isPoly(E41)),
  [K('l4-002:q2')]: only({ A: ['<=', '-2'], B: ['>=', '2'], C: ['>=', '-1/2'], D: ['>=', '-2'] }, isRay(reduce([E41, '<=', P(29, 0, 4)]))),
  [K('l4-003:q1')]: only({ A: ['>', '-1'], B: ['<', '-1'], C: ['<', '1'], D: ['<', '-5/2'] }, isRay(ineq(-3, 1, '>', 7, 11))),
  [K('l4-003:q2')]: only({ A: Iv('-4', true, '-1', false), B: Iv('-4', false, '-1', true), C: ['<', '-4'], D: ['>=', '-4'] },
    sameIv(meet(ineq(-3, 1, '>', 7, 11), ineq('1/2', -3, '<=', 1, -1)))),
  [K('l4-004:q1')]: only({ A: [P(560, 5), '>', P(0, 75)], B: [P(0, 565), '<', P(0, 75)], C: [P(560, 5), '<', P(0, 75)], D: [P(560, 5), '=', P(0, 75)] },
    (o) => o[1] !== '=' && sameIneq([P(560, 5), '<', P(0, 75)])(o)),
  [K('l4-004:q2')]: R(firstNat(better(F2, F1))),                           // 9
  [K('l4-005:q1')]: R(solve(60, 0, 20, 400)),                               // 10
  [K('l4-005:q2')]: R(firstNat(better(cost(400, 20), cost(0, 60)))),       // 11
  [K('l4-005:q3')]: R(cost(0, 60)(15).sub(cost(400, 20)(15))),             // 200
  // après x semaines : Sara 500 + 300x, Ahmed 2000 + 150x
  [K('l4-006:q1')]: only({ A: [P(0, 800), '>', P(0, 2150)], B: [P(500, 300), '<', P(2000, 150)], C: [P(300, 500), '>', P(150, 2000)], D: [P(500, 300), '>', P(2000, 150)] },
    sameIneq([P(500, 300), '>', P(2000, 150)])),
  [K('l4-006:q2')]: R(firstNat((n) => cmp(cost(500, 300)(n), cost(2000, 150)(n)) > 0)), // 11
  [K('l4-007:q1')]: only({ A: lin(2, 1).mul(lin(1, -4)), B: lin(2, 1).mul(lin(3, 6)), C: lin(2, 1).mul(lin(1, 6)), D: lin(2, 1).pow(2).mul(lin(1, 5)) }, isPoly(F47)),
  [K('l4-007:q2')]: only({ A: ['1/2', '-4'], B: ['-1/2', '4'], C: ['-2', '4'], D: ['4'] }, isSet(roots([2, 1], [1, -4]))),
  [K('l4-008:q1')]: only({ A: P(4, 5), B: P(4, 1), C: P(4, 3), D: P(4, 5, 2) }, isPoly(lin(1, 2).pow(2).sub(poly.x.mul(lin(1, 1))))),
  [K('l4-008:q2')]: only({ A: ['<', '5'], B: ['>', '5'], C: ['<', '23/3'], D: ['=', '5'] }, isRay(reduce([lin(1, 2).pow(2).sub(poly.x.mul(lin(1, 1))), '<', P(19)]))),
  // aires : rectangle x(x + 6) ; carré (x + 2)²
  [K('l4-009:q1')]: only({ A: [P(0, 6, 1), '>', P(4, 4, 1)], B: [P(0, 6, 1), '>', P(4, 0, 1)], C: [P(6, 2), '>', P(2, 2)], D: [P(0, 6, 1), '<', P(4, 4, 1)] },
    (o) => sameIneq([poly.x.mul(lin(1, 6)), '>', lin(1, 2).pow(2)])(o) && o[0].equals(poly.x.mul(lin(1, 6))) && o[2].equals(lin(1, 2).pow(2))),
  [K('l4-009:q2')]: only({ A: ['<', '2'], B: ['>', '2'], C: ['>', '4'], D: ['=', '2'] }, isRay(reduce([poly.x.mul(lin(1, 6)), '>', lin(1, 2).pow(2)]))),
  [K('l4-010:q1')]: only({ A: Iv('2', false, '7', true), B: Iv('2', true, '7', false), C: ['>', '2'], D: Iv('1', false, '17', true) },
    sameIv(meet(ineq(2, -1, '>', 0, 3), ineq(1, 5, '<=', 0, 12)))),
  [K('l4-010:q2')]: R(intsIn(meet(ineq(2, -1, '>', 0, 3), ineq(1, 5, '<=', 0, 12)))), // 5

  /* ── Niveau 5 ── */
  [K('l5-001:q1')]: only({ A: ['<', '8'], B: ['>', '7'], C: ['>', '1/8'], D: ['>', '8'] }, isRay(sitRay)),
  [K('l5-001:q2')]: R(firstNat(better(F2, F1))),                           // 9
  [K('l5-001:q3')]: R(F1(12).sub(F2(12))),                                 // 280
  [K('l5-002:q1')]: only({ A: lin(5, -1).mul(lin(7, 2)), B: lin(5, -1).mul(lin(3, 2)), C: lin(5, -1).mul(lin(3, -4)), D: lin(5, -1).pow(2).mul(lin(2, 3)) }, isPoly(E34)),
  [K('l5-002:q2')]: only({ A: ['1/5', '4/3'], B: ['1/5'], C: ['-1/5', '-4/3'], D: ['5', '3/4'] }, isSet(roots([5, -1], [3, -4]))),
  [K('l5-003:q1')]: only({ A: P(-1, -3, 4), B: P(3, -13, 4), C: P(-1, -3, 28), D: P(-1, -13, 4) }, isPoly(E41)),
  [K('l5-003:q2')]: only({ A: ['1/4', '3'], B: ['4', '3'], C: ['-1/4', '-3'], D: ['3'] }, isSet(roots([4, -1], [1, -3]))),
  // trois formules : (أ) 70x ; (ب) 300 + 40x ; (ج) 900
  [K('l5-004:q1')]: R(firstNat(better(cost(300, 40), cost(0, 70)))),       // 11
  [K('l5-004:q2')]: R(firstNat(better(cost(900, 0), cost(300, 40)))),      // 16
  [K('l5-004:q3')]: (() => {
    const c = { a: cost(0, 70)(13), b: cost(300, 40)(13), c: cost(900, 0)(13) };
    const min = Object.entries(c).sort(([, u], [, v]) => cmp(u, v));
    if (cmp(min[0][1], min[1][1]) === 0) throw new Error('oracle: égalité');
    return only({ A: 'a', B: 'b', C: 'c', D: 'a=c' }, (v) => v === min[0][0]);
  })(),
  [K('l5-005:q1')]: R(firstNat(better(cost(250, '1.5'), cost(0, 4)))),     // 101
  // a + 30·12 = 80·12
  [K('l5-006:q1')]: R(q(80).mul(12).sub(q(30).mul(12))),                  // 600
  [K('l5-006:q2')]: R(firstNat(better(cost(q(80).mul(12).sub(q(30).mul(12)), 30), cost(0, 80)))), // 13
  [K('l5-007:q1')]: only({ A: lin(3, -2).mul(lin(4, 2)), B: lin(3, -2).mul(lin(2, 2)), C: lin(3, -2).mul(lin(2, -2)), D: lin(3, -2).mul(lin(2, -6)) }, isPoly(G57)),
  [K('l5-007:q2')]: only({ A: ['2/3', '3'], B: ['3/2', '3'], C: ['-2/3', '-3'], D: ['2/3', '6'] }, isSet(roots([3, -2], [2, -6]))),
  [K('l5-007:q3')]: only({ A: ['>=', '1'], B: ['<=', '-1'], C: ['<=', '1'], D: ['<=', '1/11'] }, isRay(reduce([G57, '>=', P(-10, 0, 6)]))),
  [K('l5-008:q1')]: only({ A: Iv('-3', false, '3', true), B: ['<', '-3'], C: Iv('-3', true, '3', false), D: ['<=', '3'] },
    sameIv(meet(ineq(-2, 5, '<', 0, 11), ineq(3, -1, '<=', 0, 8)))),
  [K('l5-008:q2')]: R(intsIn(meet(ineq(-2, 5, '<', 0, 11), ineq(3, -1, '<=', 0, 8)))), // 6
  // périmètre 2(20 + x) < 64
  [K('l5-009:q1')]: only({ A: [lin(1, 20).mul(2), '<', P(64)], B: [lin(1, 20), '<', P(64)], C: [P(0, 20), '<', P(64)], D: [lin(1, 20).mul(2), '>', P(64)] },
    sameIneq([lin(1, 20).mul(2), '<', P(64)])),
  [K('l5-009:q2')]: R(lastNat((n) => holds(q(2).mul(q(20).add(n)), '<', 64))), // 11
  // (x + 5)(x − 3) = 0 — une équation est la bonne si son polynôme est proportionnel au produit.
  [K('l5-010:q1')]: (() => {
    const target = lin(1, 5).mul(lin(1, -3));
    const prop = (p) => p.degree() === 2 && p.mul(target.coef(2)).equals(target.mul(p.coef(2)));
    return only({ A: lin(1, 0).add(poly.x.mul(5)).sub(3), B: target, C: lin(1, 5).add(lin(1, -3)), D: poly.x.mul(5).mul(lin(1, -3)) }, prop);
  })(),
  [K('l5-010:q2')]: only({ A: ['-5', '3'], B: ['5', '-3'], C: ['3'], D: ['-1'] }, isSet(roots([1, 5], [1, -3]))),
};
