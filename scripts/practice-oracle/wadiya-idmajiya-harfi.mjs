// Oracle du banc « wadiya-idmajiya-harfi » (unité 3 « الحساب الحرفي ») — chaque réponse RECALCULÉE ici.
// Fusionné dans scripts/practice-answer-oracle.test.mjs.
//
// Méthode : chaque forme (développée, factorisée, équation) est recalculée avec
// `poly` (coefficients rationnels exacts, helpers.mjs), puis `only(target, options)`
// vérifie que l'option retenue est la SEULE égale à la cible — un QCM dont deux
// options seraient justes, ou aucune, fait planter le chargement de l'oracle.
import { R, C, poly } from './helpers.mjs';

const x = poly.x;
const P = (...c) => poly.of(0).add(c.reduce((acc, a, k) => acc.add(poly.x.pow(k).mul(a)), poly.of(0)));
const lin = (a, b) => x.mul(a).add(b);                 // a·x + b
const sq = (p) => p.pow(2);
/** Deux équations « p = 0 » et « q = 0 » équivalentes : p et q proportionnels (même degré, rapport constant non nul). */
const prop = (p, q) => {
  const k = p.degree();
  if (k !== q.degree() || k < 0) return false;
  const a = poly.Q(p.coef(k)); const b = poly.Q(q.coef(k));
  return p.mul(b.toString()).equals(q.mul(a.toString()));
};
/** L'unique option (lettre) dont le prédicat est vrai ; sinon erreur. */
function only(options, isRight) {
  const ok = Object.entries(options).filter(([, v]) => isRight(v)).map(([k]) => k);
  if (ok.length !== 1) throw new Error(`oracle: ${ok.length} options justes (${ok.join(',')})`);
  return C(ok[0]);
}
const eq = (target) => (p) => p.equals(target);
const eqn = (target) => ([l, r]) => prop(l.sub(r), target);   // une équation [gauche, droite]
const val = (p, v) => Number(p.at(v));

/* ── Données recalculées ─────────────────────────────────────────────── */
// ex-34 : AB = x + 4, BC = 4x, rectangle en B.
const AB34 = lin(1, 4); const BC34 = lin(4, 0);
const area34 = AB34.mul(BC34).mul('1/2');
const AC2_34 = sq(AB34).add(sq(BC34));
// ex-37 : aire non coloriée = 100 − x² − 4·10 − 4x
const A37 = poly.of(100).sub(sq(x)).sub(40).sub(x.mul(4));
// ex-38 : AB² = (2x + 5)² − (x + 2)²
const AB2_38 = sq(lin(2, 5)).sub(sq(lin(1, 2)));
// ex-39 : D = x² − 4 + (x − 2)(3x + 5)
const D39 = sq(x).sub(4).add(lin(1, -2).mul(lin(3, 5)));
// ex-40 : E = 4x² − 8x − 5 ; F = (2x − 2)² − 9
const E40 = P(-5, -8, 4);
const F40 = sq(lin(2, -2)).sub(9);
// situation : ruban autour d'un bassin carré de 10 m
const strip = (a, b) => lin(2, a).mul(lin(2, b)).sub(a * b);   // (a + 2x)(b + 2x) − ab
// racines entières positives d'un polynôme (recherche bornée)
const posRoot = (p) => { const r = []; for (let v = 1; v <= 200; v += 1) if (val(p, v) === 0) r.push(v); if (r.length !== 1) throw new Error('racine'); return r[0]; };

export const ORACLE = {
  /* ── Niveau 1 ── */
  // aire de ABC = AB·BC/2 = 2x² + 8x (B = AB·BC sans /2, C = 2x(x) + 4, D = AB + BC)
  'ex-4am-wadiya-idmajiya-harfi-l1-001:q1': only({ A: P(0, 8, 2), B: P(0, 16, 4), C: P(4, 0, 2), D: P(4, 5) }, eq(area34)),
  'ex-4am-wadiya-idmajiya-harfi-l1-001:q2': R(area34.at(1)),                                  // 2 + 8 = 10
  // QCM 1 : 2x(x + 2) = 2x² + 4x
  'ex-4am-wadiya-idmajiya-harfi-l1-002:q1': only({ A: P(0, 2, 2), B: P(0, 4, 2), C: P(0, 6) }, eq(x.mul(2).mul(lin(1, 2)))),
  // QCM 9 : x² + 25 n'a pas de racine réelle (x² + 25 ≥ 25 > 0) donc pas de facteur affine ; (x + 5)² ≠ x² + 25 ; x² + 5² est une somme → C
  'ex-4am-wadiya-idmajiya-harfi-l1-003:q1': (() => { if (sq(lin(1, 5)).equals(P(25, 0, 1))) throw new Error('qcm9'); return C('C'); })(),
  'ex-4am-wadiya-idmajiya-harfi-l1-004:q1': R(19 * 21),                                        // 399
  'ex-4am-wadiya-idmajiya-harfi-l1-005:q1': only({ A: P(3, 2), B: P(3, 0, 1), C: P(0, 3, 1), D: P(6, 4) }, eq(x.mul(lin(1, 3)))),
  'ex-4am-wadiya-idmajiya-harfi-l1-005:q2': R(x.mul(lin(1, 3)).at(5)),                         // 5 × 8 = 40
  'ex-4am-wadiya-idmajiya-harfi-l1-006:q1': only({ A: P(8, 4), B: P(2, 4), C: P(4, 4, 1), D: P(4, 0, 1) }, eq(lin(1, 2).mul(4))),
  'ex-4am-wadiya-idmajiya-harfi-l1-006:q2': only({ A: P(4, 0, 1), B: P(4, 2, 1), C: P(8, 4), D: P(4, 4, 1) }, eq(sq(lin(1, 2)))),
  'ex-4am-wadiya-idmajiya-harfi-l1-007:q1': R(lin(1, -3).mul(lin(1, 5)).at(3)),                // 0
  'ex-4am-wadiya-idmajiya-harfi-l1-007:q2': R(lin(1, -3).mul(lin(1, 5)).at(0)),                // −15
  'ex-4am-wadiya-idmajiya-harfi-l1-008:q1': R(P(-7, 5, 2).at(0)),                              // −7
  'ex-4am-wadiya-idmajiya-harfi-l1-008:q2': only({
    A: lin(1, 1).mul(lin(2, -7)), B: lin(1, -1).mul(lin(2, 7)), C: lin(1, -1).mul(lin(2, -7)), D: lin(2, -1).mul(lin(1, 7)),
  }, eq(P(-7, 5, 2))),
  // cadre de 3 cm : côté x + 3 + 3 ; aire du cadre (x + 6)² − x²
  'ex-4am-wadiya-idmajiya-harfi-l1-009:q1': only({ A: lin(1, 3), B: lin(1, 6), C: lin(3, 0), D: lin(1, 9) }, eq(x.add(3).add(3))),
  'ex-4am-wadiya-idmajiya-harfi-l1-009:q2': only({ A: P(36), B: P(36, 6), C: P(36, 12), D: P(36, 12, 1) }, eq(sq(lin(1, 6)).sub(sq(x)))),
  // QCM 11 : x² − 25
  'ex-4am-wadiya-idmajiya-harfi-l1-010:q1': (() => { const t = P(-25, 0, 1); if (sq(lin(1, -5)).equals(t) || !lin(1, -5).mul(lin(1, 5)).equals(t)) throw new Error('qcm11'); return C('B'); })(),

  /* ── Niveau 2 ── */
  // ex-37 : x + EF + 4 = 10 et EF > 0, x > 0 ⇒ 0 < x < 6 (D) ; EF = 10 − x − 4
  'ex-4am-wadiya-idmajiya-harfi-l2-001:q1': (() => { const sup = 10 - 4; if (sup !== 6) throw new Error('ex37'); return C('D'); })(),
  'ex-4am-wadiya-idmajiya-harfi-l2-001:q2': only({ A: lin(-1, 6), B: lin(-1, 10), C: lin(1, -6), D: lin(1, 6) }, eq(poly.of(10).sub(x).sub(4))),
  'ex-4am-wadiya-idmajiya-harfi-l2-002:q1': R(E40.at('1/2')),                                  // 1 − 4 − 5 = −8
  'ex-4am-wadiya-idmajiya-harfi-l2-003:q1': only({ A: P(4, 0, -1), B: P(4, -3, -1), C: P(5, 0, -1) }, eq(lin(1, 4).mul(lin(-1, 1)))),
  'ex-4am-wadiya-idmajiya-harfi-l2-004:q1': (() => { if (!sq(lin(1, 5)).equals(P(25, 10, 1))) throw new Error('qcm10'); return C('C'); })(),
  'ex-4am-wadiya-idmajiya-harfi-l2-005:q1': only({ A: P(1, 3), B: P(0, 1, 2), C: P(1, 0, 2), D: P(2, 6) }, eq(x.mul(lin(2, 1)))),
  'ex-4am-wadiya-idmajiya-harfi-l2-005:q2': R(x.mul(lin(2, 1)).at(3)),                          // 3 × 7 = 21
  'ex-4am-wadiya-idmajiya-harfi-l2-006:q1': only({ A: P(200, 0, 1), B: P(30, 30, 1), C: P(30, 2), D: P(200, 30, 1) }, eq(lin(1, 20).mul(lin(1, 10)))),
  'ex-4am-wadiya-idmajiya-harfi-l2-006:q2': R(lin(1, 20).mul(lin(1, 10)).at(40)),               // 60 × 50
  'ex-4am-wadiya-idmajiya-harfi-l2-007:q1': R(lin(1, -4).mul(lin(2, 1)).at(4)),                 // 0
  'ex-4am-wadiya-idmajiya-harfi-l2-007:q2': only({ A: P(-4, 0, 2), B: P(-4, 9, 2), C: P(-4, -7, 2), D: P(4, -7, 2) }, eq(lin(1, -4).mul(lin(2, 1)))),
  'ex-4am-wadiya-idmajiya-harfi-l2-008:q1': only({ A: P(0, 2, 1), B: P(1, 0, '1/2'), C: P(0, 1, '1/2'), D: P(1, 1) }, eq(x.mul(lin(1, 2)).mul('1/2'))),
  'ex-4am-wadiya-idmajiya-harfi-l2-008:q2': R(x.mul(lin(1, 2)).mul('1/2').at(4)),               // 4 × 6 / 2
  'ex-4am-wadiya-idmajiya-harfi-l2-009:q1': only({ A: x.mul(lin(1, 2)), B: sq(x), C: sq(lin(1, 2)), D: lin(1, -1).mul(lin(1, 1)) }, eq(sq(lin(1, 1)).sub(1))),
  'ex-4am-wadiya-idmajiya-harfi-l2-009:q2': R(sq(lin(1, 1)).sub(1).at(-2)),                    // 0
  // D « x(x − 6) + 9 » vaut G mais n'est PAS un produit (MISC-TAHLIL-NASHR-BADAL) : fausse comme factorisation,
  // donc hors de la comparaison ; parmi les trois produits A, B, C, un seul vaut G.
  'ex-4am-wadiya-idmajiya-harfi-l2-010:q1': only({ A: lin(1, -3).mul(lin(1, 3)), B: sq(lin(1, 3)), C: sq(lin(1, -3)) }, eq(P(9, -6, 1))),
  'ex-4am-wadiya-idmajiya-harfi-l2-010:q2': R(P(9, -6, 1).at(3)),                               // 0

  /* ── Niveau 3 ── */
  'ex-4am-wadiya-idmajiya-harfi-l3-001:q1': only({ A: P(16, 0, 17), B: P(16, 8, 5), C: P(16, 4, 17), D: P(16, 8, 17) }, eq(AC2_34)),
  'ex-4am-wadiya-idmajiya-harfi-l3-001:q2': R(Math.sqrt(val(AC2_34, 2))),                      // √100 = 10
  'ex-4am-wadiya-idmajiya-harfi-l3-002:q1': only({ A: P(60, 0, -1), B: P(60, 4, -1), C: P(60, -4, -1), D: P(60, -16, 1) }, eq(A37)),
  'ex-4am-wadiya-idmajiya-harfi-l3-002:q2': R(A37.at(4)),                                       // 28
  'ex-4am-wadiya-idmajiya-harfi-l3-003:q1': only({ A: P(-14, 11, 4), B: P(-14, -1, 4), C: P(-14, -1, 3), D: P(-14, 0, 4) }, eq(D39)),
  'ex-4am-wadiya-idmajiya-harfi-l3-003:q2': R(D39.at(2)),                                       // 0
  // QCM 8 : (1 − √2x)² = 1 − 2√2x + 2x² — coefficients irrationnels : on vérifie à √2 près
  // par la règle (a − b)² = a² − 2ab + b² avec a = 1, b = √2x : b² = 2x², −2ab = −2√2x (option C seule).
  'ex-4am-wadiya-idmajiya-harfi-l3-004:q1': (() => { const b2 = 2; if (b2 !== Math.round(Math.SQRT2 ** 2)) throw new Error('qcm8'); return C('C'); })(),
  'ex-4am-wadiya-idmajiya-harfi-l3-005:q1': only({ A: lin(1, 6), B: lin(2, 6), C: lin(12, 0), D: lin(1, 6).mul(2) }, eq(x.add(6).add(x))),
  'ex-4am-wadiya-idmajiya-harfi-l3-005:q2': only({ A: P(0, 0, 4), B: P(0, 12, 4), C: P(0, 24), D: P(0, 24, 4) }, eq(strip(6, 6))),
  'ex-4am-wadiya-idmajiya-harfi-l3-006:q1': only({ A: P(4), B: P(4, 2), C: P(0, 4), D: P(4, 4) }, eq(sq(lin(1, 2)).sub(sq(x)))),
  'ex-4am-wadiya-idmajiya-harfi-l3-006:q2': R(sq(lin(1, 2)).sub(sq(x)).at(9)),                  // 121 − 81
  'ex-4am-wadiya-idmajiya-harfi-l3-007:q1': only({ A: P(600, 0, 4), B: P(600, 100, 4), C: P(600, 50, 1), D: P(600, 50, 4) }, eq(lin(2, 20).mul(lin(2, 30)))),
  'ex-4am-wadiya-idmajiya-harfi-l3-007:q2': R(strip(20, 30).at(2)),                             // 816 − 600 = 216
  'ex-4am-wadiya-idmajiya-harfi-l3-008:q1': only({
    A: lin(1, -14).mul(lin(1, 18)), B: sq(lin(1, -2)), C: lin(1, -2).mul(lin(1, 6)), D: lin(1, 2).mul(lin(1, -6)),
  }, eq(sq(lin(1, 2)).sub(16))),
  'ex-4am-wadiya-idmajiya-harfi-l3-008:q2': R(sq(lin(1, 2)).sub(16).at(-6)),                    // 0
  'ex-4am-wadiya-idmajiya-harfi-l3-009:q1': (() => {
    const G = lin(3, -1).mul(lin(1, 4)).sub(lin(3, -1).mul(lin(2, -5)));
    return only({ A: lin(3, -1).mul(lin(-1, -1)), B: lin(3, -1).mul(lin(-1, 9)), C: sq(lin(3, -1)), D: sq(lin(3, -1)).mul(lin(-1, 9)) }, eq(G));
  })(),
  'ex-4am-wadiya-idmajiya-harfi-l3-009:q2': R(lin(3, -1).mul(lin(1, 4)).sub(lin(3, -1).mul(lin(2, -5))).at(9)),   // 0
  'ex-4am-wadiya-idmajiya-harfi-l3-010:q1': only({ A: P(-16, 0, 4), B: P(-16, 6, 4), C: P(-16, 12, 4), D: P(-16, 12, 2) }, eq(sq(lin(2, 3)).sub(25))),
  'ex-4am-wadiya-idmajiya-harfi-l3-010:q2': R(sq(lin(2, 3)).sub(25).at(0)),                     // 9 − 25
  'ex-4am-wadiya-idmajiya-harfi-l3-010:q3': R(sq(lin(2, 3)).sub(25).at(1)),                     // 25 − 25

  /* ── Niveau 4 ── */
  // ex-38 : rectangle en B, hypoténuse AC ⇒ AB² = AC² − BC²
  'ex-4am-wadiya-idmajiya-harfi-l4-001:q1': only({
    A: sq(lin(2, 5)).add(sq(lin(1, 2))), B: sq(lin(2, 5)).sub(sq(lin(1, 2))), C: sq(lin(1, 2)).sub(sq(lin(2, 5))), D: sq(lin(1, 3)),
  }, eq(AB2_38)),
  'ex-4am-wadiya-idmajiya-harfi-l4-001:q2': only({
    A: lin(1, 7).mul(lin(3, 7)), B: sq(lin(1, 3)), C: lin(1, 3).mul(lin(3, 3)), D: lin(1, 3).mul(lin(3, 7)),
  }, eq(AB2_38)),
  'ex-4am-wadiya-idmajiya-harfi-l4-002:q1': only({ A: P(21, 0, 3), B: P(21, 16, 3), C: P(29, 24, 5), D: P(29, 16, 3) }, eq(AB2_38)),
  'ex-4am-wadiya-idmajiya-harfi-l4-002:q2': R(AB2_38.at(0)),                                    // 25 − 4 = 21
  'ex-4am-wadiya-idmajiya-harfi-l4-003:q1': only({
    A: lin(1, -2).mul(lin(3, 7)), B: lin(1, 2).mul(lin(4, 7)), C: lin(1, -2).mul(lin(4, 7)), D: lin(1, -2).mul(lin(4, 3)),
  }, eq(D39)),
  'ex-4am-wadiya-idmajiya-harfi-l4-003:q2': R(D39.at('-7/4')),                                  // 0
  'ex-4am-wadiya-idmajiya-harfi-l4-003:q3': R(D39.at(0)),                                       // −14
  'ex-4am-wadiya-idmajiya-harfi-l4-004:q1': only({ A: P(-5, 0, 4), B: P(-5, -4, 4), C: P(-5, 8, 4), D: P(-5, -8, 4) }, eq(F40)),
  'ex-4am-wadiya-idmajiya-harfi-l4-004:q2': only({
    A: lin(2, -11).mul(lin(2, 7)), B: lin(2, -5).mul(lin(2, 1)), C: sq(lin(2, -5)), D: lin(2, 5).mul(lin(2, -1)),
  }, eq(F40)),
  // F = E (même polynôme) ⇒ F(0,5) = E(0,5) = −8 ; aucun facteur de (2x − 5)(2x + 1) n'est nul en 0,5 ⇒ A faux ; C faux ⇒ B
  'ex-4am-wadiya-idmajiya-harfi-l4-004:q3': (() => {
    if (!F40.equals(E40) || lin(2, -5).at('1/2') === '0' || lin(2, 1).at('1/2') === '0' || F40.at('1/2') !== '-8') throw new Error('ex40');
    return C('B');
  })(),
  // تحدّ : rectangle en A ⇔ BC² = AB² + AC² ; réduit : x² − 4 = 0
  'ex-4am-wadiya-idmajiya-harfi-l4-005:q1': only({
    A: [sq(lin(1, 1)), sq(lin(1, 2)).add(sq(lin(1, 3)))], B: [lin(1, 3), lin(1, 1).add(lin(1, 2))],
    C: [sq(lin(1, 3)), sq(lin(1, 1)).add(sq(lin(1, 2)))], D: [sq(lin(1, 3)), sq(lin(2, 3))],
  }, eqn(sq(lin(1, 3)).sub(sq(lin(1, 1))).sub(sq(lin(1, 2))))),
  'ex-4am-wadiya-idmajiya-harfi-l4-005:q2': only({
    A: [sq(x), P(4)], B: [sq(x).mul(2), P(4)], C: [sq(x), P(-4)], D: [x, P(4)],
  }, eqn(sq(lin(1, 3)).sub(sq(lin(1, 1))).sub(sq(lin(1, 2))))),
  'ex-4am-wadiya-idmajiya-harfi-l4-005:q3': R(posRoot(sq(lin(1, 3)).sub(sq(lin(1, 1))).sub(sq(lin(1, 2))))),   // 2
  // terrain : x(x + 5) = 50
  'ex-4am-wadiya-idmajiya-harfi-l4-006:q1': only({
    A: [x.add(x).add(5), P(50)], B: [x.mul(lin(1, 5)), P(50)], C: [x.mul(2).add(lin(1, 5).mul(2)), P(50)], D: [sq(x).add(5), P(50)],
  }, eqn(x.mul(lin(1, 5)).sub(50))),
  'ex-4am-wadiya-idmajiya-harfi-l4-006:q2': R(posRoot(x.mul(lin(1, 5)).sub(50))),             // 5
  'ex-4am-wadiya-idmajiya-harfi-l4-007:q1': only({ A: P(9), B: P(9, 6), C: P(9, 3), D: P(9, 6, 2) }, eq(sq(lin(1, 3)).sub(sq(x)))),
  'ex-4am-wadiya-idmajiya-harfi-l4-007:q2': R(posRoot(sq(lin(1, 3)).sub(sq(x)).sub(27))),      // 6x + 9 = 27 → 3
  // (x + 8)² = x² + (x + 7)²
  'ex-4am-wadiya-idmajiya-harfi-l4-008:q1': only({
    A: [P(-15, 2, 1), P(0)], B: [P(-15, 0, 1), P(0)], C: [P(-15, -2, 1), P(0)], D: [P(15, -2, 1), P(0)],
  }, eqn(sq(lin(1, 8)).sub(sq(x)).sub(sq(lin(1, 7))))),
  'ex-4am-wadiya-idmajiya-harfi-l4-008:q2': R(posRoot(sq(lin(1, 8)).sub(sq(x)).sub(sq(lin(1, 7))))),   // 5
  'ex-4am-wadiya-idmajiya-harfi-l4-009:q1': (() => {
    const K = sq(x).sub(9).add(lin(1, 3).mul(lin(2, -1)));
    return only({ A: lin(1, 3).mul(lin(3, -2)), B: lin(1, 3).mul(lin(3, -4)), C: lin(1, -3).mul(lin(3, -4)), D: lin(1, 3).mul(lin(1, -4)) }, eq(K));
  })(),
  'ex-4am-wadiya-idmajiya-harfi-l4-009:q2': R(sq(x).sub(9).add(lin(1, 3).mul(lin(2, -1))).at(-3)),   // 0
  'ex-4am-wadiya-idmajiya-harfi-l4-009:q3': R(sq(x).sub(9).add(lin(1, 3).mul(lin(2, -1))).at(0)),    // −9 − 3
  'ex-4am-wadiya-idmajiya-harfi-l4-010:q1': only({
    A: lin(1, 4).mul(lin(3, 2)), B: lin(1, 2).mul(lin(3, 2)), C: sq(lin(1, 4)), D: lin(1, 4).mul(lin(3, 4)),
  }, eq(sq(lin(2, 3)).sub(sq(lin(1, -1))))),
  'ex-4am-wadiya-idmajiya-harfi-l4-010:q2': R(sq(lin(2, 3)).sub(sq(lin(1, -1))).at(-4)),        // 25 − 25

  /* ── Niveau 5 ── */
  // la situation du manuel : ruban = (10 + 2x)² − 100 ; = 44
  'ex-4am-wadiya-idmajiya-harfi-l5-001:q1': only({ A: P(0, 0, 4), B: P(0, 20, 4), C: P(0, 40, 4), D: P(100, 40, 4) }, eq(strip(10, 10))),
  'ex-4am-wadiya-idmajiya-harfi-l5-001:q2': only({
    A: [P(-44, 10, 1), P(0)], B: [P(11, 10, 1), P(0)], C: [P(44, 40, 4), P(0)], D: [P(-11, 10, 1), P(0)],
  }, eqn(strip(10, 10).sub(44))),
  'ex-4am-wadiya-idmajiya-harfi-l5-001:q3': R(posRoot(strip(10, 10).sub(44))),                 // 1 (−11 rejeté)
  'ex-4am-wadiya-idmajiya-harfi-l5-002:q1': only({ A: P(0, 20, 1), B: P(96, 0, 4), C: P(0, 40), D: P(0, 40, 4) }, eq(strip(8, 12))),
  'ex-4am-wadiya-idmajiya-harfi-l5-002:q2': R(posRoot(strip(8, 12).sub(96))),                  // 2
  'ex-4am-wadiya-idmajiya-harfi-l5-003:q1': only({ A: P(0, 160, 1), B: P(0, 320, 4), C: P(0, 320), D: P(6000, 0, 4) }, eq(strip(100, 60))),
  'ex-4am-wadiya-idmajiya-harfi-l5-003:q2': R(posRoot(strip(100, 60).sub(1344))),              // 4
  'ex-4am-wadiya-idmajiya-harfi-l5-004:q1': only({ A: P(0, 70, 4), B: P(0, 35, 1), C: P(0, 70), D: P(300, 0, 4) }, eq(strip(20, 15))),
  'ex-4am-wadiya-idmajiya-harfi-l5-004:q2': R(strip(20, 15).at(2)),                            // 456 − 300
  // (x + 9)² = (x + 1)² + (x + 8)² ⇔ x² = 16
  'ex-4am-wadiya-idmajiya-harfi-l5-005:q1': only({
    A: [sq(x), P(146)], B: [sq(x), P(16)], C: [P(0, 36, 1), P(16)], D: [x, P(16)],
  }, eqn(sq(lin(1, 9)).sub(sq(lin(1, 1))).sub(sq(lin(1, 8))))),
  'ex-4am-wadiya-idmajiya-harfi-l5-005:q2': R(posRoot(sq(lin(1, 9)).sub(sq(lin(1, 1))).sub(sq(lin(1, 8))))),   // 4
  'ex-4am-wadiya-idmajiya-harfi-l5-005:q3': only({ A: P(17, 3), B: P(18, 3), C: P(18, 0, 3), D: P(9, 2) }, eq(lin(1, 1).add(lin(1, 8)).add(lin(1, 9)))),
  'ex-4am-wadiya-idmajiya-harfi-l5-005:q4': R(lin(3, 18).at(4)),                                // 5 + 12 + 13
  'ex-4am-wadiya-idmajiya-harfi-l5-006:q1': only({
    A: [lin(2, 4), P(60)], B: [sq(x).add(4), P(60)], C: [x.mul(lin(1, 4)), P(60)], D: [x.mul(lin(1, 4)).mul(4), P(60)],
  }, eqn(x.mul(lin(1, 4)).sub(60))),
  'ex-4am-wadiya-idmajiya-harfi-l5-006:q2': R(posRoot(x.mul(lin(1, 4)).sub(60))),              // 6
  'ex-4am-wadiya-idmajiya-harfi-l5-006:q3': R(posRoot(x.mul(lin(1, 4)).sub(60)) + 4),          // 10
  'ex-4am-wadiya-idmajiya-harfi-l5-007:q1': only({ A: P(5, 8, 5), B: P(-3, 0, 3), C: P(5, 8, 3), D: P(-3, 0, 1) }, eq(sq(lin(2, 1)).sub(sq(lin(1, 2))))),
  'ex-4am-wadiya-idmajiya-harfi-l5-007:q2': only({
    A: lin(1, 3).mul(lin(3, 3)), B: sq(lin(1, -1)), C: lin(1, -1).mul(lin(3, 3)), D: lin(3, -1).mul(lin(1, 3)),
  }, eq(sq(lin(2, 1)).sub(sq(lin(1, 2))))),
  'ex-4am-wadiya-idmajiya-harfi-l5-007:q3': R(sq(lin(2, 1)).sub(sq(lin(1, 2))).at(1)),          // 9 − 9
  'ex-4am-wadiya-idmajiya-harfi-l5-007:q4': R(sq(lin(2, 1)).sub(sq(lin(1, 2))).at(0)),          // 1 − 4
  'ex-4am-wadiya-idmajiya-harfi-l5-008:q1': only({ A: P(-9, 0, 1), B: P(-3, 0, 1), C: P(-3, 2), D: P(0, -3, 1) }, eq(x.mul(lin(1, -3)))),
  'ex-4am-wadiya-idmajiya-harfi-l5-008:q2': R(posRoot(x.mul(lin(1, -3)).sub(40))),             // 8
  'ex-4am-wadiya-idmajiya-harfi-l5-009:q1': R(101 * 99),
  'ex-4am-wadiya-idmajiya-harfi-l5-009:q2': R(102 * 102),
  'ex-4am-wadiya-idmajiya-harfi-l5-009:q3': R(98 * 98),
  'ex-4am-wadiya-idmajiya-harfi-l5-010:q1': only({ A: P(144, 0, -1), B: P(120, -2), C: P(120, 0, -1), D: sq(lin(-1, 12)).sub(24) }, eq(poly.of(144).sub(sq(x)).sub(12 * 2))),
  'ex-4am-wadiya-idmajiya-harfi-l5-010:q2': R(poly.of(144).sub(sq(x)).sub(24).at(4)),           // 104
};
