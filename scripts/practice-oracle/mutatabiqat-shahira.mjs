// Oracle du banc « mutatabiqat-shahira » (unité 3 « الحساب الحرفي ») — chaque réponse RECALCULÉE ici.
// Fusionné dans scripts/practice-answer-oracle.test.mjs.
//
// Une réponse construite est recalculée par les polynômes exacts de helpers.mjs
// (le développement est REFAIT : poly.x.add(5).pow(2).coef(1), jamais lu dans
// le JSON) ou par l'arithmétique exacte q(…) (le calcul mental par l'identité
// que la question enseigne : 105 × 95 = 100² − 5²). Les nombres irrationnels
// (√2, √7…) sont recalculés en flottants puis arrondis : la valeur exacte est entière.
//
// Un QCM : chaque option est réécrite ici comme polynôme (ou nombre, ou fonction
// de x quand un coefficient est irrationnel) et `only` vérifie qu'UNE SEULE est
// égale à l'expression recalculée — l'option juste ET la fausseté des distracteurs.
import { R, C, poly, q } from './helpers.mjs';

/** Le polynôme de coefficients [c0, c1, c2, …] (chaînes exactes). */
const P = (cs) => cs.reduce((acc, c, i) => acc.add(poly.x.pow(i).mul(c)), poly.of(0));
const pick = (ok, where) => {
  if (ok.length !== 1) throw new Error(`oracle: ${ok.length} options justes (${ok.join(', ')}) ${where}`);
  return C(ok[0]);
};
/** L'option dont le polynôme égale la cible — et elle seule. */
const only = (target, options) => pick(Object.entries(options).filter(([, p]) => poly.of(p).equals(target)).map(([k]) => k), String(target.c));
/** Idem pour des nombres (une écriture irrationnelle, un calcul) : égalité à 1e-9 près. */
const onlyNum = (target, options) => {
  const t = typeof target === 'number' ? target : String(target).split('/').map(Number).reduce((a, b) => a / b);
  return pick(Object.entries(options).filter(([, v]) => Math.abs(v - t) < 1e-9).map(([k]) => k), String(t));
};
/** Idem pour des expressions en x à coefficients irrationnels : comparées en trois valeurs de x. */
const onlyFn = (target, options) => pick(Object.entries(options)
  .filter(([, f]) => [0.7, 1.3, 2.9].every((v) => Math.abs(f(v) - target(v)) < 1e-9)).map(([k]) => k), 'fn');

export const ORACLE = {
  'ex-4am-mutatabiqat-shahira-l1-001:q1': R(q(8).mul(8).add(q(2).mul(8).mul(2)).add(4)), // = 100
  'ex-4am-mutatabiqat-shahira-l1-001:q2': R(q('3.5').mul('3.5')), // = 12.25
  'ex-4am-mutatabiqat-shahira-l1-002:q1': R(q(81).sub(q(2).mul(9).mul(3)).add(9)), // = 36
  'ex-4am-mutatabiqat-shahira-l1-002:q2': R(q('2.4').sub(3).mul(q('2.4').sub(3))), // = 0.36
  'ex-4am-mutatabiqat-shahira-l1-003:q1': only(poly.x.add(5).pow(2), { A: P(['25', '0', '1']), B: P(['25', '10', '1']), C: P(['25', '5', '1']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l1-003:q2': R(poly.x.add('3/10').pow(2).coef(1)), // = 0.6
  'ex-4am-mutatabiqat-shahira-l1-004:q1': only(poly.x.sub(4).pow(2), { A: P(['-16', '0', '1']), B: P(['-16', '-8', '1']), C: P(['16', '-8', '1']), D: P(['16', '-4', '1']) }), // seule C
  'ex-4am-mutatabiqat-shahira-l1-004:q2': R(poly.x.sub('3/2').pow(2).coef(0)), // = 2.25
  'ex-4am-mutatabiqat-shahira-l1-005:q1': only(poly.x.add(7).mul(poly.x.sub(7)), { A: P(['49', '0', '1']), B: P(['-49', '0', '1']), C: P(['-49', '-14', '1']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l1-005:q2': R(poly.x.add('1/5').mul(poly.x.sub('1/5')).coef(0)), // = -0.04
  'ex-4am-mutatabiqat-shahira-l1-006:q1': only(poly.x.sub(3).mul(poly.x.add(3)), { A: P(['-9', '-6', '1']), B: P(['9', '0', '1']), C: P(['-9', '0', '1']) }), // seule C
  'ex-4am-mutatabiqat-shahira-l1-006:q2': R(q(100).mul(100).sub(25)), // = 9975
  'ex-4am-mutatabiqat-shahira-l1-007:q1': R(q(900).add(60).add(1)), // = 961
  'ex-4am-mutatabiqat-shahira-l1-007:q2': R(q(10000).add(1000).add(25)), // = 11025
  'ex-4am-mutatabiqat-shahira-l1-008:q1': only(poly.x.add(6).pow(2), { A: P(['36', '6', '1']), B: P(['36', '0', '1']), C: P(['36', '12', '1']) }), // seule C
  'ex-4am-mutatabiqat-shahira-l1-008:q2': R(poly.x.add(6).pow(2).at(4)), // = 100
  'ex-4am-mutatabiqat-shahira-l1-009:q1': only(poly.x.sub(9).pow(2), { A: P(['81', '-18', '1']), B: P(['-81', '0', '1']), C: P(['81', '18', '1']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l1-009:q2': R(poly.x.sub(9).pow(2).coef(1)), // = -18
  'ex-4am-mutatabiqat-shahira-l1-010:q1': R(q(1600).add(80).add(1)), // = 1681
  'ex-4am-mutatabiqat-shahira-l1-010:q2': R(q(2500).sub(1)), // = 2499
  'ex-4am-mutatabiqat-shahira-l2-001:q1': only(poly.x.mul(2).add(3).pow(2), { A: P(['9', '12', '2']), B: P(['9', '12', '4']), C: P(['9', '6', '4']), D: P(['9', '0', '4']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l2-001:q2': R(q(2500).add(300).add(9)), // = 2809
  'ex-4am-mutatabiqat-shahira-l2-002:q1': only(poly.of(5).sub(poly.x.mul(2)).pow(2), { A: P(['25', '0', '-4']), B: P(['25', '-10', '4']), C: P(['25', '-20', '4']), D: P(['25', '20', '4']) }), // seule C
  'ex-4am-mutatabiqat-shahira-l2-002:q2': R(q(400).sub(40).add(1)), // = 361
  'ex-4am-mutatabiqat-shahira-l2-002:q3': R(q(1600).sub(240).add(9)), // = 1369
  'ex-4am-mutatabiqat-shahira-l2-003:q1': only(poly.x.mul(4).add(1).pow(2), { A: P(['1', '8', '16']), B: P(['1', '8', '4']), C: P(['1', '4', '16']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l2-003:q2': R(poly.x.mul(2).add('1/2').pow(2).coef(1)), // = 2
  'ex-4am-mutatabiqat-shahira-l2-003:q3': R(poly.x.mul(3).add('5/3').pow(2).coef(0)), // = 25/9
  'ex-4am-mutatabiqat-shahira-l2-004:q1': only(poly.x.mul(2).sub(3).pow(2), { A: P(['9', '-6', '4']), B: P(['9', '-12', '2']), C: P(['9', '-12', '4']), D: P(['-9', '0', '4']) }), // seule C
  'ex-4am-mutatabiqat-shahira-l2-004:q2': R(poly.x.mul(5).sub('7/5').pow(2).coef(1)), // = -14
  'ex-4am-mutatabiqat-shahira-l2-005:q1': only(poly.x.mul(3).add(5).mul(poly.x.mul(3).sub(5)), { A: P(['-25', '0', '3']), B: P(['25', '0', '9']), C: P(['-25', '0', '9']) }), // seule C
  'ex-4am-mutatabiqat-shahira-l2-005:q2': R(poly.of('3/2').add(poly.x.mul(2)).mul(poly.of('3/2').sub(poly.x.mul(2))).coef(0)), // = 2.25
  'ex-4am-mutatabiqat-shahira-l2-005:q3': R(poly.of('3/2').add(poly.x.mul(2)).mul(poly.of('3/2').sub(poly.x.mul(2))).coef(2)), // = -4
  'ex-4am-mutatabiqat-shahira-l2-006:q1': only(poly.x.mul(2).sub(5).mul(poly.x.mul(2).add(5)), { A: P(['-25', '0', '4']), B: P(['-25', '0', '2']), C: P(['-25', '-20', '4']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l2-006:q2': R(q(97).add(3).mul(q(97).sub(3))), // = 9400
  'ex-4am-mutatabiqat-shahira-l2-007:q1': R(q(400).sub(1)), // = 399
  'ex-4am-mutatabiqat-shahira-l2-007:q2': R(q(10000).sub(1)), // = 9999
  'ex-4am-mutatabiqat-shahira-l2-007:q3': R(q(1000000).sub(64)), // = 999936
  'ex-4am-mutatabiqat-shahira-l2-008:q1': only(poly.x.mul(3).add(2).pow(2), { A: P(['4', '0', '9']), B: P(['4', '12', '9']), C: P(['4', '12', '3']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l2-008:q2': only(poly.of(4).sub(poly.x.mul(2)).pow(2), { A: P(['16', '-16', '4']), B: P(['16', '0', '-4']), C: P(['16', '-8', '4']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l2-008:q3': only(poly.x.mul(5).sub(1).mul(poly.x.mul(5).add(1)), { A: P(['-1', '0', '5']), B: P(['1', '0', '25']), C: P(['-1', '0', '25']) }), // seule C
  'ex-4am-mutatabiqat-shahira-l2-009:q1': only(poly.x.mul(3).add(4).pow(2), { A: P(['16', '24', '9']), B: P(['16', '12', '9']), C: P(['16', '24', '3']), D: P(['16', '0', '9']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l2-009:q2': R(poly.x.mul(3).add(4).pow(2).at(-1)), // = 1
  'ex-4am-mutatabiqat-shahira-l2-010:q1': only(poly.of(7).sub(poly.x).mul(poly.of(7).add(poly.x)), { A: P(['-49', '0', '1']), B: P(['49', '0', '-1']), C: P(['49', '-14', '1']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l2-010:q2': R(poly.of(7).sub(poly.x).mul(poly.of(7).add(poly.x)).at(2)), // = 45
  'ex-4am-mutatabiqat-shahira-l3-001:q1': only(poly.x.add(3).pow(2), { A: P(['9', '3', '1']), B: P(['9', '6', '1']), C: P(['3', '6', '1']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l3-001:q2': only(poly.x.mul(3).add(1).pow(2), { A: P(['1', '6', '9']), B: P(['1', '3', '9']), C: P(['1', '0', '9']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l3-001:q3': only(poly.x.add(5).pow(2), { A: P(['25', '10', '25']), B: P(['25', '10', '1']), C: P(['25', '5', '1']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l3-002:q1': only(poly.x.mul(3).sub(4).pow(2).add(poly.x.sub(3).pow(2)), { A: P(['25', '0', '10']), B: P(['25', '-15', '10']), C: P(['25', '-30', '10']) }), // seule C
  'ex-4am-mutatabiqat-shahira-l3-002:q2': R(poly.of(1).sub(poly.x.mul(2)).pow(2).mul(4).add(poly.x.mul(4).sub(1).pow(2)).coef(1)), // = -24
  'ex-4am-mutatabiqat-shahira-l3-003:q1': only(poly.x.mul(5).add(1).pow(2).add(poly.x.sub(1).pow(2).mul(5)), { A: P(['6', '20', '30']), B: P(['6', '0', '30']), C: P(['-4', '10', '30']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l3-003:q2': R(poly.x.mul(3).sub(4).pow(2).sub(poly.of(1).sub(poly.x).pow(2).mul(4)).coef(0)), // = 12
  'ex-4am-mutatabiqat-shahira-l3-004:q1': R(poly.x.mul(2).add(1).pow(2).coef(1)), // = 4
  'ex-4am-mutatabiqat-shahira-l3-004:q2': onlyFn((x) => (Math.sqrt(3) - 4 * x) ** 2, { A: (x) => 3 - 16*Math.pow(x, 2), B: (x) => 16*Math.pow(x, 2) - 8*Math.sqrt(3)*x + 3, C: (x) => 16*Math.pow(x, 2) - 4*Math.sqrt(3)*x + 3 }), // seule B
  'ex-4am-mutatabiqat-shahira-l3-004:q3': onlyFn((x) => (2 * x - Math.sqrt(5)) * (2 * x + Math.sqrt(5)), { A: (x) => 4*Math.pow(x, 2) - 5, B: (x) => 4*Math.pow(x, 2) + 5, C: (x) => 2*Math.pow(x, 2) - 5 }), // seule A
  'ex-4am-mutatabiqat-shahira-l3-005:q1': only(poly.x.mul(2).add(1).pow(2), { A: P(['1', '4', '4']), B: P(['1', '2', '2']), C: P(['1', '0', '4']), D: P(['1', '2', '4']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l3-005:q2': R(poly.x.mul(4).mul(poly.x).add(poly.x.mul(4)).add(1).at(10)), // = 441
  'ex-4am-mutatabiqat-shahira-l3-006:q1': only(poly.x.sub(8).mul(poly.x.add(8)), { A: P(['-64', '-16', '1']), B: P(['-64', '0', '1']), C: P(['64', '0', '1']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l3-006:q2': R(poly.x.sub(8).mul(poly.x.add(8)).sub(poly.x.pow(2)).coef(0)), // = -64
  'ex-4am-mutatabiqat-shahira-l3-007:q1': R(poly.x.mul('1/2').sub(4).pow(2).coef(1)), // = -4
  'ex-4am-mutatabiqat-shahira-l3-007:q2': R(poly.x.mul('1/2').sub(4).pow(2).coef(2)), // = 0.25
  'ex-4am-mutatabiqat-shahira-l3-008:q1': onlyNum(q(99).mul(99), { A: 9999, B: 9801, C: 10201 }), // seule B
  'ex-4am-mutatabiqat-shahira-l3-008:q2': R(q(10000).sub(200).add(1)), // = 9801
  'ex-4am-mutatabiqat-shahira-l3-009:q1': R(q(1000000).add(2000).add(1)), // = 1002001
  'ex-4am-mutatabiqat-shahira-l3-009:q2': R(q(1000000).sub(4)), // = 999996
  'ex-4am-mutatabiqat-shahira-l3-010:q1': R(poly.x.mul(2).add(7).mul(poly.x.mul(2).sub(7)).coef(2)), // = 4
  'ex-4am-mutatabiqat-shahira-l3-010:q2': R(poly.x.mul(2).add(7).mul(poly.x.mul(2).sub(7)).coef(0)), // = -49
  'ex-4am-mutatabiqat-shahira-l4-001:q1': only(poly.x.sub(2).pow(2).add(poly.x.mul(3).sub(1).mul(poly.x.mul(3).add(3)).mul(4)), { A: P(['-8', '28', '37']), B: P(['-8', '20', '37']), C: P(['-16', '24', '37']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l4-001:q2': R(poly.x.mul(9).mul(poly.x.mul(9).add(1).pow(2)).sub(poly.x.mul(poly.x.sub(1).pow(2))).coef(2)), // = 164
  'ex-4am-mutatabiqat-shahira-l4-002:q1': only(poly.x.pow(2).sub(poly.x.sub(1).mul(poly.x.add(1))), { A: P(['-1', '0', '2']), B: P(['-1']), C: P(['1']) }), // seule C
  'ex-4am-mutatabiqat-shahira-l4-002:q2': R(poly.x.pow(2).sub(poly.x.sub(1).mul(poly.x.add(1))).at(978654321)), // = 1
  'ex-4am-mutatabiqat-shahira-l4-003:q1': only(poly.x.add(1).mul(poly.x.add(9)).sub(poly.x.add(3).pow(2)), { A: P(['0', '10']), B: P(['0', '4']), C: P(['18', '16']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l4-003:q2': R(poly.x.add(1).mul(poly.x.add(9)).sub(poly.x.add(3).pow(2)).at(100)), // = 400
  'ex-4am-mutatabiqat-shahira-l4-003:q3': R(poly.x.add(1).mul(poly.x.add(9)).sub(poly.x.add(3).pow(2)).at('1/2')), // = 2
  'ex-4am-mutatabiqat-shahira-l4-004:q1': R(q(35).mul(35).sub(q(36).mul(34))), // = 1
  'ex-4am-mutatabiqat-shahira-l4-004:q2': R(q(2018).mul(2018).sub(q(2019).mul(2017))), // = 1
  'ex-4am-mutatabiqat-shahira-l4-004:q3': only(poly.x.sub(1).pow(2).sub(poly.x.mul(poly.x.sub(2))), { A: P(['1', '-4']), B: P(['1']), C: P(['1', '-4', '2']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l4-005:q1': R(poly.x.add(4).pow(2).sub(poly.x.add(2).pow(2)).coef(1)), // = 4
  'ex-4am-mutatabiqat-shahira-l4-005:q2': R(poly.x.add(4).pow(2).sub(poly.x.add(2).pow(2)).coef(0)), // = 12
  'ex-4am-mutatabiqat-shahira-l4-006:q1': only(poly.x.mul(2).sub(1).pow(2).sub(poly.x.pow(2).mul(4)), { A: P(['1', '-4']), B: P(['-1']), C: P(['1', '-2']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l4-006:q2': R(poly.x.mul(2).sub(1).pow(2).sub(poly.x.pow(2).mul(4)).at(10)), // = -39
  'ex-4am-mutatabiqat-shahira-l4-007:q1': only(poly.x.add(5).mul(poly.x.sub(5)).sub(poly.x.sub(5).pow(2)), { A: P(['-50', '10']), B: P(['-50']), C: P(['0', '-10']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l4-007:q2': R(poly.x.add(5).mul(poly.x.sub(5)).sub(poly.x.sub(5).pow(2)).at(5)), // = 0
  'ex-4am-mutatabiqat-shahira-l4-008:q1': only(poly.x.add(3).pow(2).sub(poly.x.sub(3).pow(2)), { A: P(['18']), B: P(['0', '12']), C: P(['0']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l4-008:q2': R(poly.x.add(3).pow(2).sub(poly.x.sub(3).pow(2)).at(50)), // = 600
  'ex-4am-mutatabiqat-shahira-l4-009:q1': R(q(10000).add(400).add(4)), // = 10404
  'ex-4am-mutatabiqat-shahira-l4-009:q2': R(q(102).add(98).mul(q(102).sub(98))), // = 800
  'ex-4am-mutatabiqat-shahira-l4-010:q1': only(poly.x.mul(3).sub(2).mul(poly.x.mul(3).add(2)).add(4), { A: P(['0', '0', '9']), B: P(['8', '0', '9']), C: P(['0', '0', '3']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l4-010:q2': R(poly.x.mul(3).sub(2).mul(poly.x.mul(3).add(2)).add(4).at('1/3')), // = 1
  'ex-4am-mutatabiqat-shahira-l5-001:q1': only(poly.x.add(3).pow(2).sub(poly.x.pow(2)), { A: P(['9']), B: P(['9', '3']), C: P(['9', '6']) }), // seule C
  'ex-4am-mutatabiqat-shahira-l5-001:q2': R(poly.x.add(3).pow(2).sub(poly.x.pow(2)).at(20)), // = 129
  'ex-4am-mutatabiqat-shahira-l5-002:q1': only(poly.x.sub(2).pow(2), { A: P(['-4', '0', '1']), B: P(['-4', '-4', '1']), C: P(['4', '-4', '1']) }), // seule C
  'ex-4am-mutatabiqat-shahira-l5-002:q2': R(poly.x.sub(2).pow(2).at(30)), // = 784
  'ex-4am-mutatabiqat-shahira-l5-003:q1': only(poly.x.add(5).mul(poly.x.sub(5)), { A: P(['-25', '0', '1']), B: P(['0', '0', '1']), C: P(['-25', '-10', '1']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l5-003:q2': R(poly.x.pow(2).sub(poly.x.add(5).mul(poly.x.sub(5))).coef(0)), // = 25
  'ex-4am-mutatabiqat-shahira-l5-004:q1': R(q(1600).add(400).add(25)), // = 2025
  'ex-4am-mutatabiqat-shahira-l5-004:q2': R(q(1).sub(q('0.01').mul('0.01'))), // = 0.9999
  'ex-4am-mutatabiqat-shahira-l5-004:q3': R(q(49).add(7).add('0.25')), // = 56.25
  'ex-4am-mutatabiqat-shahira-l5-005:q1': only(poly.of(7).sub(poly.x).pow(2), { A: P(['49', '-14', '1']), B: P(['49', '0', '-1']), C: P(['49', '14', '1']) }), // seule A
  'ex-4am-mutatabiqat-shahira-l5-005:q2': R(poly.of(7).sub(poly.x).pow(2).sub(poly.x.sub(7).pow(2)).at(3)), // = 0
  'ex-4am-mutatabiqat-shahira-l5-006:q1': onlyNum((Math.SQRT2 + 1) ** 2, { A: 3, B: 2*Math.sqrt(2) + 3, C: Math.sqrt(2) + 3 }), // seule B
  'ex-4am-mutatabiqat-shahira-l5-006:q2': R(Math.round((Math.SQRT2 + 1) ** 2 - 2 * Math.SQRT2)), // = 3
  'ex-4am-mutatabiqat-shahira-l5-007:q1': R(Math.round((Math.sqrt(7) - 2) * (Math.sqrt(7) + 2))), // = 3
  'ex-4am-mutatabiqat-shahira-l5-007:q2': R(Math.round((2 * Math.sqrt(3) + 3) * (2 * Math.sqrt(3) - 3))), // = 3
  'ex-4am-mutatabiqat-shahira-l5-008:q1': onlyNum((Math.sqrt(5) - 1) ** 2, { A: 4, B: 2*Math.sqrt(5) + 6, C: 6 - 2*Math.sqrt(5) }), // seule C
  'ex-4am-mutatabiqat-shahira-l5-008:q2': R(Math.round((Math.sqrt(5) - 1) ** 2 + 2 * Math.sqrt(5))), // = 6
  'ex-4am-mutatabiqat-shahira-l5-009:q1': R(q(2025).mul(2025).sub(q(2024).mul(2026))), // = 1
  'ex-4am-mutatabiqat-shahira-l5-009:q2': R(q(2025).add(2024).mul(q(2025).sub(2024))), // = 4049
  'ex-4am-mutatabiqat-shahira-l5-010:q1': only(poly.x.add(1).pow(2).sub(poly.x.pow(2)), { A: P(['1']), B: P(['1', '2']), C: P(['1', '1']) }), // seule B
  'ex-4am-mutatabiqat-shahira-l5-010:q2': R(poly.x.add(1).pow(2).sub(poly.x.pow(2)).at(50)), // = 101
};
