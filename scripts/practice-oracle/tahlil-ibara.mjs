// Oracle du banc « tahlil-ibara » (unité 3 « الحساب الحرفي ») — chaque réponse RECALCULÉE ici.
// Fusionné dans scripts/practice-answer-oracle.test.mjs.
//
// Une forme factorisée est un CHOIX : `pick(expr, options)` développe l'expression ET
// chaque option avec `poly` (rationnels exacts) et renvoie l'unique option ÉGALE dont
// la forme est acceptable (`true`). Une option marquée `false` est une écriture égale
// mais refusée par l'énoncé (facteur commun incomplet quand on demande le PLUS GRAND,
// somme quand on demande un produit). Zéro ou deux options justes → l'oracle lève une
// erreur et le test échoue. Les questions de FORME (« de quel type ? », « laquelle ne
// se factorise pas ? ») sont vérifiées par une égalité polynomiale écrite à la main.
// Généré avec le banc par le script de l'auteur ; ne pas éditer une entrée sans
// recalculer l'autre côté.
import { R, C, poly, q } from './helpers.mjs';

const X = poly.x;
const k = (v) => poly.of(poly.Q(v));
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
function pick(expr, options) {
  const ok = options.map(([p, form], i) => (form && expr.equals(p) ? 'ABCD'[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`tahlil-ibara oracle: ${ok.length} acceptable options`);
  return C(ok[0]);
}

export const ORACLE = {
  'ex-4am-tahlil-ibara-l1-001:q1': pick(k(2).mul(X).add(k(6)), [[k(2).mul(X.add(k(3))), true], [k(2).mul(X.add(k(6))), true], [k(2).mul(X).mul(k(1).add(k(3))), true]]),
  'ex-4am-tahlil-ibara-l1-001:q2': pick(k(7).mul(X).sub(k(21)), [[k(7).mul(X.add(k(3))), true], [k(7).mul(X.sub(k(3))), true], [k(7).mul(X.sub(k(21))), true]]),
  'ex-4am-tahlil-ibara-l1-001:q3': pick(X.pow(2).sub(k(3).mul(X)), [[X.mul(X.pow(2).sub(k(3))), true], [k(3).mul(X).mul(X.sub(k(1))), true], [X.mul(X.sub(k(3))), true]]),
  'ex-4am-tahlil-ibara-l1-002:q1': R(q('2.9').mul(13 + 87)),
  'ex-4am-tahlil-ibara-l1-002:q2': R(q('2.35').mul(176 - 76)),
  'ex-4am-tahlil-ibara-l1-002:q3': pick(k(9).mul(X).add(k(3)), [[k(3).mul(k(3).mul(X).add(k(3))), true], [k(3).mul(k(3).mul(X).add(k(1))), true], [k(9).mul(X).mul(k(1).add(k(3))), true]]),
  // B est la seule écriture dont la dernière opération est un produit (A : … + 2, C : somme de monômes, D : somme de deux parenthèses).
  'ex-4am-tahlil-ibara-l1-003:q1': C('B'),
  'ex-4am-tahlil-ibara-l1-003:q2': pick(X.pow(2).add(k(5).mul(X)), [[X.mul(X).add(k(5).mul(X)), false], [X.mul(X.add(k(5).mul(X))), true], [k(5).mul(X).mul(X.add(k(1))), true], [X.mul(X.add(k(5))), true]]),
  'ex-4am-tahlil-ibara-l1-004:q1': pick(k(5).mul(X).add(k(15)), [[k(5).mul(X.add(k(15))), true], [k(5).mul(X).mul(k(1).add(k(3))), true], [k(5).mul(X.add(k(3))), true]]),
  'ex-4am-tahlil-ibara-l1-004:q2': pick(k(12).mul(X).sub(k(8)), [[k(4).mul(k(3).mul(X).sub(k(2))), true], [k(2).mul(k(6).mul(X).sub(k(4))), false], [k(4).mul(k(3).mul(X).sub(k(8))), true]]), // 2(6x − 4) est égal mais son facteur n’est pas le PLUS GRAND (énoncé : أكبر عامل مشترك).
  // x² + 8x + 16 = (x + 4)² : forme a² + 2ab + b² (a = x, b = 4).
  'ex-4am-tahlil-ibara-l1-005:q1': (poly.x.add(4).pow(2).equals(poly.x.pow(2).add(poly.x.mul(8)).add(16)) ? C('A') : null),
  // x² − 49 = (x − 7)(x + 7) : forme a² − b².
  'ex-4am-tahlil-ibara-l1-005:q2': (poly.x.sub(7).mul(poly.x.add(7)).equals(poly.x.pow(2).sub(49)) ? C('C') : null),
  // x² − 12x + 36 = (x − 6)² : forme a² − 2ab + b².
  'ex-4am-tahlil-ibara-l1-005:q3': (poly.x.sub(6).pow(2).equals(poly.x.pow(2).sub(poly.x.mul(12)).add(36)) ? C('B') : null),
  'ex-4am-tahlil-ibara-l1-006:q1': pick(X.pow(2).sub(k(36)), [[X.sub(k(6)).pow(2), true], [X.sub(k(6)).mul(X.add(k(6))), true], [X.sub(k(18)).mul(X.add(k(18))), true]]),
  'ex-4am-tahlil-ibara-l1-006:q2': pick(X.pow(2).add(k(2).mul(X)).add(k(1)), [[X.add(k(1)).pow(2), true], [X.add(k(2)).pow(2), true], [X.sub(k(1)).mul(X.add(k(1))), true]]),
  'ex-4am-tahlil-ibara-l1-007:q1': pick(X.pow(2).add(k(7).mul(X)), [[X.mul(X.pow(2).add(k(7))), true], [X.mul(X.add(k(7))), true], [k(7).mul(X).mul(X.add(k(1))), true]]),
  'ex-4am-tahlil-ibara-l1-007:q2': pick(k(3).mul(X.pow(2)).sub(k(6).mul(X)), [[k(3).mul(X.pow(2).sub(k(2).mul(X))), false], [k(3).mul(X).mul(X.sub(k(6))), true], [k(3).mul(X).mul(X.sub(k(2))), true]]), // 3(x² − 2x) est égal mais le facteur n’est pas complet (أكبر عامل مشترك).
  'ex-4am-tahlil-ibara-l1-008:q1': R(X.sub(4).mul(X.mul(2).add(1)).at(4)),
  'ex-4am-tahlil-ibara-l1-008:q2': R(X.sub(4).mul(X.mul(2).add(1)).at(0)),
  'ex-4am-tahlil-ibara-l1-009:q1': R(gcd(8, 12)),
  'ex-4am-tahlil-ibara-l1-009:q2': pick(k(8).mul(X).add(k(12)), [[k(2).mul(k(4).mul(X).add(k(6))), false], [k(4).mul(k(2).mul(X).add(k(3))), true], [k(4).mul(k(2).mul(X).add(k(12))), true]]), // 2(4x + 6) est égal mais r = 2 n’est pas le plus grand nombre de rangées.
  'ex-4am-tahlil-ibara-l1-010:q1': R(X.add(5).pow(2).coef(0)),
  'ex-4am-tahlil-ibara-l1-010:q2': R(X.sub(3).pow(2).coef(1).replace('-', '')),
  'ex-4am-tahlil-ibara-l2-001:q1': pick(X.pow(2).sub(k(5).mul(X)), [[X.mul(X.sub(k(5))), true], [X.mul(X.pow(2).sub(k(5))), true], [k(5).mul(X).mul(X.sub(k(1))), true]]),
  'ex-4am-tahlil-ibara-l2-001:q2': pick(X.add(k(3)).mul(k(1).sub(k(2).mul(X))).add(k(5).mul(k(1).sub(k(2).mul(X)))), [[k(1).sub(k(2).mul(X)).mul(k(5).mul(X).add(k(15))), true], [k(1).sub(k(2).mul(X)).mul(X.sub(k(2))), true], [k(1).sub(k(2).mul(X)).mul(X.add(k(8))), true]]),
  'ex-4am-tahlil-ibara-l2-001:q3': pick(k(1).add(X).mul(X.sub(k(5))).sub(k(1).add(k(2).mul(X)).mul(k(1).add(X))), [[k(1).add(X).mul(k(3).mul(X).sub(k(4))), true], [k(1).add(X).mul(X.mul(-1).sub(k(6))), true], [k(1).add(X).mul(k(3).mul(X).sub(k(6))), true]]),
  'ex-4am-tahlil-ibara-l2-002:q1': pick(k(5).mul(X).mul(k(2).mul(X).add(k(1))).add(k(2).mul(X).add(k(1))), [[k(5).mul(X).mul(k(2).mul(X).add(k(1))), true], [k(2).mul(X).add(k(1)).mul(k(5).mul(X).add(k(1))), true], [k(6).mul(X).mul(k(2).mul(X).add(k(1))), true]]),
  'ex-4am-tahlil-ibara-l2-002:q2': pick(X.add(k(7)).mul(X.sub(k(3))).sub(X.sub(k(3))), [[X.sub(k(3)).mul(X.add(k(6))), true], [X.sub(k(3)).mul(X.add(k(7))), true], [X.sub(k(3)).mul(X.add(k(8))), true]]),
  'ex-4am-tahlil-ibara-l2-002:q3': pick(X.add(k(1)).mul(X.sub(k(4))).sub(X).add(k(4)), [[X.sub(k(4)).mul(X.add(k(2))), true], [X.add(k(1)).mul(X.sub(k(5))), true], [X.mul(X.sub(k(4))), true]]),
  'ex-4am-tahlil-ibara-l2-003:q1': pick(X.sub(k(1)).mul(k(5).mul(X).add(k(4))).add(k(3).add(X).mul(X.sub(k(1)))), [[X.sub(k(1)).mul(k(4).mul(X).add(k(1))), true], [X.sub(k(1)).mul(k(5).mul(X).add(k(7))), true], [X.sub(k(1)).mul(k(6).mul(X).add(k(7))), true]]),
  'ex-4am-tahlil-ibara-l2-003:q2': pick(k(2).mul(X).sub(k(5)).mul(X.add(k(2))).sub(X.sub(k(2)).mul(X.add(k(2)))), [[X.add(k(2)).mul(X.sub(k(3))), true], [X.add(k(2)).mul(X.sub(k(7))), true], [X.add(k(2)).mul(k(3).mul(X).sub(k(7))), true]]),
  'ex-4am-tahlil-ibara-l2-004:q1': pick(X.pow(2).add(k(6).mul(X)).add(k(9)), [[X.add(k(9)).pow(2), true], [X.add(k(3)).pow(2), true], [X.sub(k(3)).mul(X.add(k(3))), true]]),
  'ex-4am-tahlil-ibara-l2-004:q2': pick(k(4).mul(X.pow(2)).add(k(20).mul(X)).add(k(25)), [[k(4).mul(X).add(k(5)).pow(2), true], [k(2).mul(X).add(k(10)).pow(2), true], [k(2).mul(X).add(k(5)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l2-004:q3': pick(k(9).mul(X.pow(2)).add(k(42).mul(X)).add(k(49)), [[k(3).mul(X).add(k(7)).pow(2), true], [k(9).mul(X).add(k(7)).pow(2), true], [k(3).mul(X).add(k(14)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l2-004:q4': pick(k(1).add(k(8).mul(X)).add(k(16).mul(X.pow(2))), [[k(1).add(k(8).mul(X)).pow(2), true], [k(1).add(k(4).mul(X)).pow(2), true], [k(4).add(X).pow(2), true]]),
  'ex-4am-tahlil-ibara-l2-005:q1': pick(X.pow(2).sub(k(10).mul(X)).add(k(25)), [[X.sub(k(5)).mul(X.add(k(5))), true], [X.sub(k(5)).pow(2), true], [X.add(k(5)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l2-005:q2': pick(k(9).mul(X.pow(2)).sub(k(12).mul(X)).add(k(4)), [[k(3).mul(X).sub(k(2)).pow(2), true], [k(9).mul(X).sub(k(2)).pow(2), true], [k(3).mul(X).add(k(2)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l2-005:q3': pick(k(81).mul(X.pow(2)).sub(k(18).mul(X)).add(k(1)), [[k(81).mul(X).sub(k(1)).pow(2), true], [k(9).mul(X).sub(k(9)).pow(2), true], [k(9).mul(X).sub(k(1)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l2-005:q4': pick(k(9).sub(k(6).mul(X)).add(X.pow(2)), [[k(3).add(X).pow(2), true], [k(3).sub(X).pow(2), true], [k(9).sub(X).pow(2), true]]),
  // only B : x² + 6x + 9 = (x + 3)² ; (x + 6)² = x² + 12x + 36 ; (x + 3)² ≠ x² + 6x + 3.
  'ex-4am-tahlil-ibara-l2-006:q1': C([[36, X.add(6)], [9, X.add(3)], [3, X.add(3)]].map(([c, f], i) => [i, X.pow(2).add(X.mul(6)).add(c).equals(f.pow(2))]).filter(([, ok]) => ok).map(([i]) => 'ABC'[i]).join('')),
  // only A : (6x − 1)² = 36x² − 12x + 1.
  'ex-4am-tahlil-ibara-l2-006:q2': C([[36, -12, 1, X.mul(6).sub(1)], [36, -6, 1, X.mul(6).sub(1)], [36, -12, 1, X.mul(36).sub(1)]].map(([a, b, c, f], i) => [i, X.pow(2).mul(a).add(X.mul(b)).add(c).equals(f.pow(2))]).filter(([, ok]) => ok).map(([i]) => 'ABC'[i]).join('')),
  // only C : (x − 5)² = x² − 10x + 25.
  'ex-4am-tahlil-ibara-l2-006:q3': C([-5, -25, -10].map((b, i) => [i, X.pow(2).add(X.mul(b)).add(25).equals(X.sub(5).pow(2))]).filter(([, ok]) => ok).map(([i]) => 'ABC'[i]).join('')),
  // only A : (x + 9)(x − 9) = x² − 81.
  'ex-4am-tahlil-ibara-l2-006:q4': C([9, 81, 3].map((b, i) => [i, X.pow(2).sub(81).equals(X.add(b).mul(X.sub(b)))]).filter(([, ok]) => ok).map(([i]) => 'ABC'[i]).join('')),
  'ex-4am-tahlil-ibara-l2-007:q1': pick(k(3).mul(X.add(k(2))).add(X.mul(X.add(k(2)))), [[X.add(k(2)).mul(k(3).add(X)), true], [k(3).mul(X).mul(X.add(k(2))), true], [X.add(k(2)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l2-007:q2': pick(X.sub(k(1)).mul(X.add(k(5))).sub(k(2).mul(X.sub(k(1)))), [[X.sub(k(1)).mul(X.add(k(7))), true], [X.sub(k(1)).mul(X.add(k(3))), true], [X.add(k(5)).mul(X.sub(k(3))), true]]),
  'ex-4am-tahlil-ibara-l2-008:q1': pick(k(2).mul(X).add(k(3)).mul(X.sub(k(4))).add(k(2).mul(X).add(k(3))), [[k(2).mul(X).add(k(3)).mul(X.sub(k(4))), true], [k(2).mul(X).add(k(3)).mul(X.sub(k(3))), true], [k(2).mul(X).add(k(3)).mul(X.sub(k(5))), true]]),
  'ex-4am-tahlil-ibara-l2-008:q2': pick(X.add(k(6)).pow(2).sub(X.add(k(6))), [[X.add(k(6)).pow(2), true], [X.add(k(6)).mul(X.add(k(7))), true], [X.add(k(6)).mul(X.add(k(5))), true]]),
  'ex-4am-tahlil-ibara-l2-009:q1': pick(k(4).mul(X.pow(2)).sub(k(9)), [[k(4).mul(X).sub(k(3)).mul(k(4).mul(X).add(k(3))), true], [k(2).mul(X).sub(k(3)).mul(k(2).mul(X).add(k(3))), true], [k(2).mul(X).sub(k(3)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l2-009:q2': pick(k(25).sub(X.pow(2)), [[X.sub(k(5)).mul(X.add(k(5))), true], [k(5).sub(X).pow(2), true], [k(5).sub(X).mul(k(5).add(X)), true]]),
  'ex-4am-tahlil-ibara-l2-010:q1': R(gcd(14, 21)),
  'ex-4am-tahlil-ibara-l2-010:q2': R(14 / gcd(14, 21)),
  'ex-4am-tahlil-ibara-l3-001:q1': R(X.sub(1).mul(X.add(2)).add(X.mul(X.add(2))).sub(X.add(2)).at(0)),
  'ex-4am-tahlil-ibara-l3-001:q2': R(X.add(2).mul(X.mul(2).sub(1)).at(0)),
  'ex-4am-tahlil-ibara-l3-001:q3': pick(X.sub(k(1)).mul(X.add(k(2))).add(X.mul(X.add(k(2)))).sub(X.add(k(2))), [[X.add(k(2)).mul(k(2).mul(X).sub(k(1))), true], [X.add(k(2)).mul(k(2).mul(X).sub(k(2))), true], [X.add(k(2)).mul(k(2).mul(X).add(k(1))), true]]),
  // facteur commun (x − √2) identique dans les trois options : il suffit de comparer les cofacteurs, (4x + 3) − (x + 2) = 3x + 1 (calcul exact sur Q[x]).
  'ex-4am-tahlil-ibara-l3-002:q1': C([X.mul(3).add(1), X.mul(5).add(5), X.mul(3).add(5)].map((f, i) => [i, X.mul(4).add(3).sub(X.add(2)).equals(f)]).filter(([, ok]) => ok).map(([i]) => 'ABC'[i]).join('')),
  'ex-4am-tahlil-ibara-l3-002:q2': pick(k(2).sub(k(5).mul(X)).mul(X.sub(k('2/3'))).add(k(2).sub(k(5).mul(X)).mul(X.sub(k('4/3')))), [[k(2).sub(k(5).mul(X)).mul(k(2).mul(X).add(k('2/3'))), true], [k(2).sub(k(5).mul(X)).mul(k(2).mul(X).sub(k(2))), true], [k(2).sub(k(5).mul(X)).mul(X.pow(2).sub(k('8/9'))), true]]),
  'ex-4am-tahlil-ibara-l3-003:q1': pick(k(9).mul(X.pow(2)).add(k(24).mul(X)).add(k(16)), [[k(9).mul(X).add(k(4)).pow(2), true], [k(3).mul(X).add(k(4)).pow(2), true], [k(3).mul(X).add(k(8)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l3-003:q2': pick(k(121).sub(k(22).mul(X)).add(X.pow(2)), [[k(11).sub(X).pow(2), true], [k(11).add(X).pow(2), true], [k(121).sub(X).pow(2), true]]),
  'ex-4am-tahlil-ibara-l3-004:q1': pick(k(3).sub(k(2).mul(X)).pow(2).sub(k(9)), [[k(2).mul(-1).mul(X).mul(k(6).sub(k(2).mul(X))), true], [k(6).mul(-1).sub(k(2).mul(X)).mul(k(12).sub(k(2).mul(X))), true], [k(2).mul(-1).mul(X).pow(2), true]]),
  'ex-4am-tahlil-ibara-l3-004:q2': pick(k('1/4').sub(X.add(k('3/2')).pow(2)), [[k(2).sub(X).mul(X.add(k(2))), true], [X.mul(-1).sub(k(1)).mul(X.add(k(2))), true], [k('1/4').sub(X).sub(k('3/2')).mul(k('1/4').add(X).add(k('3/2'))), true]]),
  'ex-4am-tahlil-ibara-l3-004:q3': pick(X.add(k(2)).pow(2).sub(k(3).mul(X).sub(k(1)).pow(2)), [[k(2).mul(-1).mul(X).add(k(1)).mul(k(4).mul(X).add(k(1))), true], [k(2).mul(-1).mul(X).add(k(3)).mul(k(4).mul(X).add(k(1))), true], [X.add(k(2)).sub(k(3).mul(X)).sub(k(1)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l3-005:q1': pick(k(144).mul(X.pow(2)).sub(k(24).mul(X)).add(k(1)), [[k(12).mul(X).add(k(1)).pow(2), true], [k(72).mul(X).sub(k(1)).pow(2), true], [k(12).mul(X).sub(k(1)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l3-005:q2': pick(k(4).mul(X.pow(2)).sub(k(1)).add(k(12).mul(X.pow(2)).sub(k(6).mul(X))), [[k(2).mul(X).sub(k(1)).mul(k(8).mul(X).add(k(1))), true], [k(2).mul(X).sub(k(1)).mul(k(6).mul(X).add(k(1))), true], [k(2).mul(X).sub(k(1)).mul(k(8).mul(X).sub(k(1))), true]]),
  'ex-4am-tahlil-ibara-l3-006:q1': R((98 - 2) * (98 + 2)),
  'ex-4am-tahlil-ibara-l3-006:q2': R((408 - 407) * (408 + 407)),
  'ex-4am-tahlil-ibara-l3-006:q3': R((777 - 223) * (777 + 223)),
  'ex-4am-tahlil-ibara-l3-007:q1': pick(X.pow(2).add(k(6).mul(X)).add(k(9)), [[X.add(k(3)).pow(2), true], [X.add(k(9)).pow(2), true], [X.sub(k(3)).mul(X.add(k(3))), true]]),
  'ex-4am-tahlil-ibara-l3-007:q2': pick(X.pow(2).sub(k(4).mul(X)).add(k(4)), [[X.add(k(2)).pow(2), true], [X.sub(k(2)).pow(2), true], [X.sub(k(2)).mul(X.add(k(2))), true]]),
  'ex-4am-tahlil-ibara-l3-007:q3': pick(X.pow(2).sub(k(16)), [[X.sub(k(4)).pow(2), true], [X.sub(k(8)).mul(X.add(k(8))), true], [X.sub(k(4)).mul(X.add(k(4))), true]]),
  'ex-4am-tahlil-ibara-l3-008:q1': pick(X.add(k(2)).pow(2).sub(k(3).mul(X.add(k(2)))), [[X.pow(2).add(X).sub(k(2)), true], [X.pow(2).add(k(7).mul(X)).add(k(10)), true], [X.pow(2).sub(k(3).mul(X)).sub(k(2)), true]]),
  'ex-4am-tahlil-ibara-l3-008:q2': pick(X.add(k(2)).pow(2).sub(k(3).mul(X.add(k(2)))), [[X.add(k(2)).mul(X.add(k(5))), true], [X.add(k(2)).mul(X.sub(k(3))), true], [X.add(k(2)).mul(X.sub(k(1))), true]]),
  'ex-4am-tahlil-ibara-l3-008:q3': R(X.add(2).pow(2).sub(X.add(2).mul(3)).at(1)),
  'ex-4am-tahlil-ibara-l3-009:q1': pick(k(6).mul(X.pow(2)).sub(k(9).mul(X)), [[k(3).mul(k(2).mul(X.pow(2)).sub(k(3).mul(X))), false], [k(3).mul(X).mul(k(2).mul(X).sub(k(3))), true], [X.mul(k(6).mul(X).sub(k(9))), false], [k(3).mul(X).mul(k(2).mul(X).sub(k(9))), true]]), // 3(2x² − 3x) et x(6x − 9) sont égaux mais le facteur n’est pas complet.
  'ex-4am-tahlil-ibara-l3-009:q2': pick(k(10).mul(X.pow(2)).add(k(15).mul(X)), [[k(5).mul(X).mul(k(2).mul(X).add(k(3))), true], [k(5).mul(k(2).mul(X.pow(2)).add(k(3).mul(X))), false], [k(5).mul(X).mul(k(2).mul(X).add(k(15))), true]]), // 5(2x² + 3x) est égal mais incomplet.
  'ex-4am-tahlil-ibara-l3-010:q1': R(gcd(18, 12)),
  'ex-4am-tahlil-ibara-l3-010:q2': R(18 / gcd(18, 12) + 12 / gcd(18, 12)),
  'ex-4am-tahlil-ibara-l4-001:q1': pick(k(2).mul(X).mul(k('2/7').sub(X)).add(k('2/7').sub(X).mul(k(5).mul(X).sub(k(4)).mul(k('1/3')))), [[k('2/7').sub(X).mul(k(7).mul(X).sub(k(4))).mul(k('1/3')), true], [k('2/7').sub(X).mul(k(11).mul(X).sub(k(4))).mul(k('1/3')), true], [k('2/7').sub(X).mul(k(7).mul(X).sub(k(4))), true]]),
  'ex-4am-tahlil-ibara-l4-001:q2': pick(k('6/5').mul(X).sub(k('7/2')).mul(k('37/10').add(X)).sub(k('1/5').mul(X).sub(k('13/2')).mul(k('37/10').add(X))).add(k('37/10').add(X)), [[k('37/10').add(X).mul(X.add(k(3))), true], [k('37/10').add(X).mul(X.add(k(4))), true], [k('37/10').add(X).mul(k('7/5').mul(X).sub(k(9))), true]]),
  'ex-4am-tahlil-ibara-l4-002:q1': pick(k('1/9').mul(X.pow(2)).add(k('1/3').mul(X)).add(k('1/4')), [[X.mul(k('1/3')).add(k('1/4')).pow(2), true], [X.mul(k('1/3')).add(k('1/2')).pow(2), true], [X.mul(k('1/9')).add(k('1/2')).pow(2), true]]),
  'ex-4am-tahlil-ibara-l4-002:q2': pick(k('25/9').mul(X.pow(2)).sub(k('5/2').mul(X)).add(k('9/16')), [[k('5/3').mul(X).add(k('3/4')).pow(2), true], [k('5/3').mul(X).sub(k('9/16')).pow(2), true], [k('5/3').mul(X).sub(k('3/4')).pow(2), true]]),
  'ex-4am-tahlil-ibara-l4-003:q1': pick(k(2).sub(X).pow(2).sub(k(4).mul(X.pow(2))), [[k(2).sub(k(3).mul(X)).mul(k(2).add(X)), true], [k(2).sub(k(5).mul(X)).mul(k(2).add(k(3).mul(X))), true], [k(2).sub(k(3).mul(X)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l4-003:q2': pick(k(2).mul(X).add(k(3)).pow(2).sub(X.add(k(1)).pow(2)), [[X.add(k(4)).mul(k(3).mul(X).add(k(4))), true], [X.add(k(2)).pow(2), true], [X.add(k(2)).mul(k(3).mul(X).add(k(4))), true]]),
  'ex-4am-tahlil-ibara-l4-003:q3': R((X.mul(-1).add(2)).pow(2).sub(X.pow(2).mul(4)).sub(X.mul(2).add(3).pow(2).sub(X.add(1).pow(2))).coef(1)),
  'ex-4am-tahlil-ibara-l4-004:q1': pick(X.sub(k(3)).mul(k(2).mul(X).add(k(1))).add(k(3).sub(X).mul(X.add(k(4)))), [[X.sub(k(3)).pow(2), true], [X.sub(k(3)).mul(k(3).mul(X).add(k(5))), true], [X.sub(k(3)).mul(X.add(k(5))), true]]),
  'ex-4am-tahlil-ibara-l4-004:q2': pick(X.pow(2).sub(k(9)).add(X.add(k(3)).mul(k(2).mul(X).sub(k(1)))), [[X.add(k(3)).mul(X.sub(k(3))).mul(k(2).mul(X).sub(k(1))), true], [X.add(k(3)).mul(k(3).mul(X).sub(k(4))), true], [X.add(k(3)).mul(k(3).mul(X).sub(k(2))), true]]),
  'ex-4am-tahlil-ibara-l4-005:q1': pick(k(2).mul(X).add(k(1)).pow(2).sub(X.sub(k(3)).pow(2)), [[X.sub(k(2)).mul(k(3).mul(X).sub(k(2))), true], [X.add(k(4)).mul(k(3).mul(X).sub(k(2))), true], [X.add(k(4)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l4-005:q2': pick(k(9).mul(X.pow(2)).sub(X.add(k(2)).pow(2)), [[k(2).mul(X).sub(k(2)).mul(k(4).mul(X).add(k(2))), true], [k(2).mul(X).add(k(2)).mul(k(4).mul(X).sub(k(2))), true], [k(8).mul(X).sub(k(2)).mul(k(10).mul(X).add(k(2))), true]]),
  'ex-4am-tahlil-ibara-l4-006:q1': pick(X.pow(2).add(X).add(k('1/4')), [[X.add(k('1/2')).pow(2), true], [X.add(k('1/4')).pow(2), true], [X.add(k(1)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l4-006:q2': pick(k('1/4').mul(X.pow(2)).sub(k(1)), [[X.mul(k('1/4')).sub(k(1)).mul(X.mul(k('1/4')).add(k(1))), true], [X.mul(k('1/2')).sub(k(1)).mul(X.mul(k('1/2')).add(k(1))), true], [X.mul(k('1/2')).sub(k(1)).pow(2), true]]),
  'ex-4am-tahlil-ibara-l4-007:q1': pick(k(4).mul(X.pow(2)).sub(k(12).mul(X)).add(k(9)).sub(k(2).mul(X).sub(k(3)).mul(X.add(k(1)))), [[k(2).mul(X).sub(k(3)).mul(X.sub(k(2))), true], [k(2).mul(X).sub(k(3)).mul(k(3).mul(X).sub(k(2))), true], [k(2).mul(X).sub(k(3)).mul(X.sub(k(4))), true]]),
  'ex-4am-tahlil-ibara-l4-007:q2': R(X.mul(2).sub(3).mul(X.sub(4)).at(4)),
  'ex-4am-tahlil-ibara-l4-008:q1': R(gcd(12, 18)),
  'ex-4am-tahlil-ibara-l4-008:q2': pick(k(12).mul(X.pow(2)).add(k(18).mul(X)), [[k(6).mul(k(2).mul(X.pow(2)).add(k(3).mul(X))), false], [k(3).mul(X).mul(k(4).mul(X).add(k(6))), false], [k(6).mul(X).mul(k(2).mul(X).add(k(3))), true], [k(6).mul(X).mul(k(2).mul(X).add(k(18))), true]]), // 6(2x² + 3x) et 3x(4x + 6) sont égaux mais incomplets.
  'ex-4am-tahlil-ibara-l4-009:q1': pick(k('1/2').mul(X).mul(X.sub(k(2))).add(k('3/2').mul(X.sub(k(2)))), [[X.sub(k(2)).mul(k('1/2').mul(X).add(k('3/2'))), true], [X.sub(k(2)).mul(k(2)).mul(X), true], [X.sub(k(2)).mul(k('1/2').mul(X).sub(k('3/2'))), true]]),
  'ex-4am-tahlil-ibara-l4-009:q2': pick(X.mul(k('1/3')).sub(k('2/3')), [[X.sub(k('2/3')).mul(k('1/3')), true], [X.sub(k(2)).mul(k('1/3')), true], [k(3).mul(X.sub(k(2))), true]]),
  'ex-4am-tahlil-ibara-l4-010:q1': R(X.mul(3).sub(1).mul(X.add(2)).sub(X.add(2)).at(0)),
  'ex-4am-tahlil-ibara-l4-010:q2': R(X.add(2).mul(X.mul(3).sub(1)).at(0)),
  'ex-4am-tahlil-ibara-l4-010:q3': pick(k(3).mul(X).sub(k(1)).mul(X.add(k(2))).sub(X.add(k(2))), [[X.add(k(2)).mul(k(3).mul(X).sub(k(1))), true], [X.add(k(2)).mul(k(3)).mul(X), true], [X.add(k(2)).mul(k(3).mul(X).sub(k(2))), true]]),
  'ex-4am-tahlil-ibara-l5-001:q1': R((105 - 95) * (105 + 95)),
  'ex-4am-tahlil-ibara-l5-001:q2': R((51 - 49) * (51 + 49)),
  'ex-4am-tahlil-ibara-l5-001:q3': R((1001 - 999) * (1001 + 999)),
  'ex-4am-tahlil-ibara-l5-002:q1': pick(X.pow(2).add(k(7).mul(X)).add(k(10)), [[X.add(k(2)).mul(X.add(k(7))), true], [X.add(k(2)).mul(X.add(k(5))), true], [X.add(k(2)).mul(X.add(k(10))), true]]), // chaque option L est jugée sur (x + 2) × L.
  'ex-4am-tahlil-ibara-l5-002:q2': R(X.add(2).mul(X.add(5)).at(20)),
  'ex-4am-tahlil-ibara-l5-003:q1': pick(k(4).mul(X.pow(2)).add(k(12).mul(X)).add(k(9)), [[k(4).mul(X).add(k(3)).pow(2), true], [k(2).mul(X).add(k(9)).pow(2), true], [k(2).mul(X).add(k(3)).pow(2), true]]), // chaque option c est jugée sur c².
  'ex-4am-tahlil-ibara-l5-003:q2': R(X.mul(2).add(3).at(10)),
  'ex-4am-tahlil-ibara-l5-004:q1': R(X.sub(3).mul(X.mul(2).add(5)).at(3)),
  'ex-4am-tahlil-ibara-l5-004:q2': R(X.sub(3).mul(X.mul(2).add(5)).at(0)),
  'ex-4am-tahlil-ibara-l5-004:q3': pick(X.sub(k(3)).mul(k(2).mul(X).add(k(5))), [[k(2).mul(X.pow(2)).sub(X).sub(k(15)), true], [k(2).mul(X.pow(2)).add(k(11).mul(X)).sub(k(15)), true], [k(2).mul(X.pow(2)).sub(k(15)), true]]),
  'ex-4am-tahlil-ibara-l5-005:q1': pick(X.add(k(5)).pow(2).sub(k(9)), [[X.add(k(2)).pow(2), true], [X.add(k(2)).mul(X.add(k(8))), true], [X.sub(k(4)).mul(X.add(k(14))), true]]),
  'ex-4am-tahlil-ibara-l5-005:q2': R(X.add(2).mul(X.add(8)).at(2)),
  'ex-4am-tahlil-ibara-l5-006:q1': R(gcd(gcd(6, 9), 3)),
  'ex-4am-tahlil-ibara-l5-006:q2': pick(k(6).mul(X.pow(2)).add(k(9).mul(X)).add(k(3)), [[k(3).mul(k(2).mul(X.pow(2)).add(k(3).mul(X))), true], [k(3).mul(k(2).mul(X.pow(2)).add(k(3).mul(X)).add(k(1))), true], [k(3).mul(k(2).mul(X.pow(2)).add(k(9).mul(X)).add(k(3))), true]]),
  'ex-4am-tahlil-ibara-l5-007:q1': R(X.add(5).pow(2).sub(X.add(5)).at(0)),
  'ex-4am-tahlil-ibara-l5-007:q2': pick(X.add(k(5)).pow(2).sub(X.add(k(5))), [[X.add(k(5)).mul(X.add(k(6))), true], [X.add(k(5)).pow(2), true], [X.add(k(5)).mul(X.add(k(4))), true]]),
  // A = (x − 4)(x + 4), B = (x + 4)², D = (x − 4)² ; x² + 16 has no middle term and is a sum: C.
  'ex-4am-tahlil-ibara-l5-008:q1': (X.sub(4).mul(X.add(4)).equals(X.pow(2).sub(16)) && X.add(4).pow(2).equals(X.pow(2).add(X.mul(8)).add(16)) && X.sub(4).pow(2).equals(X.pow(2).sub(X.mul(8)).add(16)) ? C('C') : null),
  // (x + 2)² ≠ x² + 4 and (x + 2)(x − 2) ≠ x² + 4 : C.
  'ex-4am-tahlil-ibara-l5-008:q2': (!X.add(2).pow(2).equals(X.pow(2).add(4)) && !X.add(2).mul(X.sub(2)).equals(X.pow(2).add(4)) ? C('C') : null),
  'ex-4am-tahlil-ibara-l5-009:q1': pick(k(3).mul(X).sub(k(2)).pow(2).sub(k(3).mul(X).sub(k(2)).mul(X.add(k(1)))), [[k(3).mul(X).sub(k(2)).mul(k(4).mul(X).sub(k(1))), true], [k(3).mul(X).sub(k(2)).mul(k(2).mul(X).sub(k(3))), true], [k(3).mul(X).sub(k(2)).mul(k(2).mul(X).sub(k(1))), true]]),
  'ex-4am-tahlil-ibara-l5-009:q2': R(X.mul(3).sub(2).pow(2).sub(X.mul(3).sub(2).mul(X.add(1))).at(1)),
  'ex-4am-tahlil-ibara-l5-010:q1': R(17 * (23 + 77)),
  'ex-4am-tahlil-ibara-l5-010:q2': R(q('4.6').mul(58 - 48)),
};
