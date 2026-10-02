// Oracle du banc « wadiya-idmajiya-khattiya » (unité 6 « الدالة الخطية والتناسبية ») — chaque réponse
// RECALCULÉE ici, sans lire le contenu ni le code testé. Fusionné dans scripts/practice-answer-oracle.test.mjs.
//
// Méthode : chaque situation est RE-TRADUITE ici à partir des nombres de son énoncé —
//   · un câble : Pythagore sur (distance horizontale, différence d'altitudes), racine exacte quand elle
//     est entière (`isqrt`), sinon valeur approchée au centième ;
//   · une famille : coefficient a = adultes + enfants × (1 − t/100) en rationnels exacts ; le plus grand
//     prix entier dans le budget est le PREMIER entier n tel que a·(n + 1) > budget (cherché pas à pas,
//     pas par un arrondi) ;
//   · un pourcentage, une concentration, une conversion : en rationnels exacts (`q`), arrondis au
//     centième seulement quand l'énoncé le demande (tolérance 0,01 dans le banc).
// Pour les QCM calculatoires, chaque option est MODÉLISÉE et `only(options, pred)` vérifie que l'option
// retenue est la SEULE vraie — un QCM dont deux options seraient justes, ou aucune, fait planter l'oracle.
import { R, C, q, poly } from './helpers.mjs';

/* ── Arithmétique exacte ─────────────────────────────────────────────── */
const sign = (v) => { const n = q(v).n; return n > 0n ? 1 : n < 0n ? -1 : 0; };
const eq = (u, v) => sign(q(u).sub(v)) === 0;
const le = (u, v) => sign(q(u).sub(v)) <= 0;
const val = (v) => q(v).toString();
/** Racine carrée entière exacte d'un entier carré parfait, sinon erreur. */
function isqrt(n) {
  const N = BigInt(n); let r = BigInt(Math.floor(Math.sqrt(Number(N))));
  while (r * r > N) r -= 1n; while ((r + 1n) * (r + 1n) <= N) r += 1n;
  if (r * r !== N) throw new Error(`oracle: ${n} n'est pas un carré parfait`);
  return r.toString();
}
const hyp = (a, b) => isqrt(BigInt(a) * BigInt(a) + BigInt(b) * BigInt(b));
/** Valeur approchée au centième d'un rationnel (chaîne décimale, point). */
const r2 = (v) => { const x = q(v); return (Math.round(Number(x.n) * 100 / Number(x.d)) / 100).toFixed(2).replace(/0$/, '').replace(/\.$/, ''); };
/** Ce que paie un enfant à t % de réduction : 1 − t/100 (multiplicateur). */
const pays = (t) => q(1).sub(q(t).div(100));
/** Coefficient de la famille : adultes + enfants × (1 − t/100). */
const family = (adults, children, t) => q(adults).add(q(children).mul(pays(t)));
/** Le plus grand entier n ≥ 0 tel que a·n ≤ budget, cherché pas à pas. */
function maxWhole(a, budget) {
  let n = 0; while (le(q(a).mul(n + 1), budget)) n += 1;
  if (n > 1e6) throw new Error('oracle: boucle'); return String(n);
}
/** L'unique option (lettre) dont le prédicat est vrai ; sinon erreur. */
function only(options, isRight) {
  const ok = Object.entries(options).filter(([, v]) => isRight(v)).map(([k]) => k);
  if (ok.length !== 1) throw new Error(`oracle: ${ok.length} options justes (${ok.join(',')})`);
  return C(ok[0]);
}

const K = (s) => `ex-4am-wadiya-idmajiya-khattiya-${s}`;

/* ── Vérifications de l'énoncé du manuel (téléphérique p. 74) ───────────── */
// AB² = 2500² + 500² = 6 500 000 = 500² × 26 : AB = 500√26 (et non un entier).
const AB2 = 2500 * 2500 + (1400 - 900) ** 2;
if (AB2 !== 500 * 500 * 26) throw new Error('oracle: AB²');
const AB = 500 * Math.sqrt(26);
// ex-32 : x√8(1/2 − x√2) + 8 − 16(x/2 − √2)² en écrivant √2 = s (s² = 2) : on développe en
// polynôme de x à coefficients a + b·s, représentés comme deux polynômes (partie rationnelle, partie en s).
{
  const x = poly.x;
  // x√8(1/2 − x√2) = 2s·x·(1/2) − 2s·s·x² = s·x − 4x²
  const rat1 = x.mul(x).mul(-4); const s1 = x;
  // (x/2 − s)² = x²/4 − s·x + 2  →  8 − 16(…) = 8 − 4x² + 16s·x − 32
  const rat2 = poly.of(8).sub(x.mul(x).mul(4).add(32)); const s2 = x.mul(16);
  const rat = rat1.add(rat2); const sPart = s1.add(s2);
  if (rat.coef(2) !== '-8' || rat.coef(0) !== '-24' || sPart.coef(1) !== '17') throw new Error('oracle: ex-32');
}

export const ORACLE = {
  /* ── Niveau 1 ── */
  // A(2 ; 7) : a = 7/2
  [K('l1-001:q1')]: only({ A: 2, B: '3.5', C: 7 }, (a) => eq(q(a).mul(2), 7)),
  // −9 image de −6
  [K('l1-002:q1')]: only({ A: '-6/4', B: '1.5', C: '-4/6' }, (a) => eq(q(a).mul(-6), -9)),
  // 8 a pour image 14
  [K('l1-003:q1')]: only({ A: '1.75', B: '8/14', C: '4/7' }, (a) => eq(q(a).mul(8), 14)),
  // (D) par O et (1 ; 0,25) : f(0) = 0 et f(1) = 0,25 — chaque option comme (pente, ordonnée à l'origine)
  [K('l1-004:q1')]: only({ A: [1, '0.25'], B: ['0.75', 0], C: ['0.25', 0] }, ([m, p]) => eq(p, 0) && eq(q(m).add(p), '0.25')),
  // tableau : −5 → 2, 25 → −10, 10 → −4
  [K('l1-006:q1')]: only({ A: '52/130', B: '-0.4', C: '-5/2' }, (a) => [[-5, 2], [25, -10], [10, -4]].every(([u, w]) => eq(q(a).mul(u), w))),
  // −10 % : on garde 0,9 ; options comme (multiplicateur, terme constant)
  [K('l1-008:q1')]: only({ A: ['0.9', 0], B: [1, -10], C: ['0.1', 0] }, ([m, c]) => eq(c, 0) && eq(m, pays(10))),
  [K('l1-009:q1')]: R(hyp(120, 50)),                                                   // 130
  [K('l1-010:q1')]: R(val(q(300).mul(pays(40)))),                                      // 180

  /* ── Niveau 2 ── */
  [K('l2-002:q1')]: R(r2(q(8).div(q(13).div(100)))),                                   // 61.54 (13 cL = 0,13 L)
  [K('l2-003:q1')]: R(r2(q(1).sub(q(1).div(6)).mul(100))),                            // 83.33
  [K('l2-004:q1')]: R(val(q(500 + 40).div(1000))),                                     // 0.54 L
  [K('l2-004:q2')]: R(r2(q(40).div(100).div(q(540).div(1000)))),                      // 0.74 g/L
  [K('l2-005:q1')]: R(val(q(1300).div(5))),                                            // 260
  [K('l2-006:q1')]: R(val(family(3, 1, 50))),                                          // 7/2
  [K('l2-006:q2')]: R(val(family(3, 1, 50).mul(400))),                                 // 1400
  [K('l2-007:q1')]: only({ A: ['1.2', 0], B: [1, 20], C: ['0.2', 0], D: ['0.8', 0] }, ([m, c]) => eq(c, 0) && eq(m, q(1).add('0.2'))),
  [K('l2-007:q2')]: R(val(q(250).mul(q(1).add(q(20).div(100))))),                     // 300
  [K('l2-008:q1')]: R(val(q(1000).div(4))),                                            // 250
  [K('l2-010:q1')]: R(val(q('52.5').div(5))),                                          // 21/2 g/cm³

  /* ── Niveau 3 ── */
  [K('l3-001:q1')]: R(1000 - 600),
  [K('l3-001:q2')]: R(hyp(300, 1000 - 600)),                                           // 500
  [K('l3-001:q3')]: R(val(q(hyp(300, 400)).div(4))),                                   // 125
  [K('l3-002:q1')]: only({ A: [1, 4, 25], B: [1, 4, 75], C: 'affine', D: [0, 5, 25] }, (o) => Array.isArray(o) && eq(family(...o), family(1, 4, 25)) && eq(family(...o), 4)),
  [K('l3-002:q2')]: R(maxWhole(family(1, 4, 25), 1800)),                               // 450
  [K('l3-003:q2')]: R(maxWhole(15, 500)),                                              // 33
  [K('l3-004:q1')]: only({ A: 80, B: 20, C: 'affine', D: 120 }, (m) => typeof m === 'number' && eq(m, q(100).mul(pays(20)))),
  [K('l3-004:q2')]: R(maxWhole(q(100).mul(pays(20)), 1000)),                           // 12
  [K('l3-005:q1')]: R(hyp(48, 25 - 5)),                                                // 52
  [K('l3-005:q2')]: R(val(q(hyp(48, 20)).div(4))),                                     // 13
  [K('l3-006:q1')]: R(val(q('2.5').mul(600))),                                         // 1500
  [K('l3-006:q2')]: R(val(q(2000).div('2.5'))),                                        // 800
  [K('l3-007:q1')]: R(val(q(6000).mul(pays(30)))),                                     // 4200
  [K('l3-007:q2')]: only({ A: ['0.7', 0], B: ['0.3', 0], C: [1, -30] }, ([m, c]) => eq(c, 0) && eq(m, pays(30))),
  [K('l3-008:q1')]: R(val(q(2).div(q(250).div(1000)))),                                // 8
  [K('l3-008:q2')]: R(val(q(2).div(q(250 + 150).div(1000)))),                          // 5
  [K('l3-009:q1')]: R(val(q(1).sub(q(1).div(8)).mul(100))),                            // 175/2
  [K('l3-010:q1')]: R(val([[1, 250], [2, 500], [3, 750], [4, 1000]].map(([n, p]) => q(p).div(n)).reduce((a, b) => { if (!eq(a, b)) throw new Error('oracle: non proportionnel'); return a; }))),
  [K('l3-010:q2')]: R(val(q(250).mul(7))),                                             // 1750

  /* ── Niveau 4 ── */
  [K('l4-001:q1')]: R(hyp(400, 1100 - 800)),                                           // 500
  [K('l4-001:q2')]: R(val(q(hyp(400, 300)).div('2.5'))),                               // 200
  [K('l4-001:q3')]: only({ A: [3, 20], B: [2, 0], C: [3, 33] }, ([m, s]) => m * 60 + s === Number(val(q(500).div('2.5')))),
  [K('l4-002:q1')]: R(val(family(3, 2, 30))),                                          // 22/5
  [K('l4-002:q2')]: R(maxWhole(family(3, 2, 30), 2200)),                               // 500
  [K('l4-003:q1')]: R(maxWhole(family(2, 4, 50), 2500)),                               // 625
  [K('l4-003:q2')]: R(val(q(2500).sub(family(2, 4, 50).mul(600)))),                    // 100
  [K('l4-004:q1')]: R(val(q(1050).div(300))),                                          // 7/2
  [K('l4-004:q2')]: R(val(q(1750).div(q(1050).div(300)))),                             // 500
  // h(x) = (x + 2)² − x² − 4
  [K('l4-005:q1')]: R((() => { const h = poly.x.add(2).pow(2).sub(poly.x.pow(2)).sub(4); if (h.coef(0) !== '0' || h.coef(2) !== '0') throw new Error('oracle: h'); return h.coef(1); })()),
  [K('l4-006:q1')]: R(r2(q(15).div(q(33).div(100)))),                                  // 45.45
  [K('l4-007:q1')]: R(val(q(1).sub(q(3).div(8)).mul(100))),                            // 125/2
  [K('l4-007:q2')]: only({ A: 'false', B: 'true60', C: 'trueHalf' }, (v) => (v === 'false') === !le(q(2).div(3), q(5).div(8))),
  [K('l4-008:q1')]: only({ A: '0.72', B: '0.7', C: 'affine', D: '0.3' }, (m) => m !== 'affine' && eq(m, pays(20).mul(pays(10)))),
  [K('l4-008:q2')]: R(val(q(5000).mul(pays(20)).mul(pays(10)))),                       // 3600
  [K('l4-009:q1')]: R(val(q(18).mul(1000).div(3600))),                                 // 5
  [K('l4-009:q2')]: R(val(q(1500).div(q(18).mul(1000).div(3600)).div(60))),            // 5
  [K('l4-010:q1')]: R(val(family(3, 30, 40))),                                         // 21
  [K('l4-010:q2')]: R(maxWhole(family(3, 30, 40), 8400)),                              // 400

  /* ── Niveau 5 ── */
  [K('l5-001:q2')]: R(r2(q(Math.round(AB * 1e6)).div(1e6).div('5.5'))),              // 463.55
  [K('l5-001:q3')]: R(val(family(2, 3, 40))),                                          // 19/5
  [K('l5-001:q4')]: R(maxWhole(family(2, 3, 40), 2000)),                               // 526
  [K('l5-002:q1')]: only({ A: 'first', B: 'second', C: 'same', D: 'depends' }, (w) => w === (sign(family(2, 3, 40).sub(q(5).mul(pays(20)))) < 0 ? 'first' : 'second')),
  [K('l5-002:q2')]: R(val(q(5).mul(pays(20)).sub(family(2, 3, 40)).mul(500))),        // 100
  [K('l5-003:q1')]: R(hyp(800, 1050 - 450)),                                           // 1000
  [K('l5-003:q2')]: R(val(q(hyp(800, 600)).div(4).mul(2).add(2 * 60))),               // 620
  [K('l5-004:q1')]: R(maxWhole('4.4', 2000)),                                          // 454
  [K('l5-004:q2')]: only({ A: 'yes', B: 'no410', C: 'no2200' }, (v) => (v === 'yes') === le(q('4.4').mul(q(400).mul(q(1).add('0.1'))), 2000)),
  // g(x) = (2x − 1)² − 4x² − 1
  [K('l5-005:q1')]: R((() => { const g = poly.x.mul(2).sub(1).pow(2).sub(poly.x.pow(2).mul(4)).sub(1); if (g.coef(0) !== '0' || g.coef(2) !== '0') throw new Error('oracle: g'); return g.coef(1); })()),
  [K('l5-005:q2')]: R(poly.x.mul(2).sub(1).pow(2).sub(poly.x.pow(2).mul(4)).sub(1).at('-2.5')),   // 10
  [K('l5-006:q1')]: R(val(q(30).div('0.5'))),                                          // 60
  [K('l5-006:q2')]: R(val(q(30).div(40).sub('0.5').mul(1000))),                       // 250 mL
  [K('l5-007:q1')]: R(val(q(2400).mul('1.25').mul(pays(20)))),                         // 2400
  [K('l5-008:q1')]: only({ A: 9, B: 3, C: 'affine', D: 15 }, (m) => m !== 'affine' && eq(m, q(12).mul(pays(25)))),
  [K('l5-008:q2')]: R(maxWhole(q(12).mul(pays(25)), 600)),                             // 66
  [K('l5-009:q2')]: R(val(q(1300).div(5))),                                            // 260
  [K('l5-010:q1')]: R(maxWhole(family(2, 3, 40), 2500)),                               // 657
  [K('l5-010:q2')]: R(val(q(2500).sub(family(2, 3, 40).mul(650)))),                    // 30
};
