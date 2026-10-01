// Oracle du banc « jidaa-maadum » (unité 4 « معادلات ومتراجحات ») — chaque réponse RECALCULÉE ici,
// sans lire le contenu ni le code testé. Fusionné dans scripts/practice-answer-oracle.test.mjs.
//
// Les équations sont réécrites ici comme POLYNÔMES exacts (helpers.mjs, rationnels) :
//   L(a, b)        le facteur a·x + b ;  prod(…) leur produit ;  X = x.
//   sol(P, sets)   l'unique option dont l'ensemble est EXACTEMENT celui des racines de P = 0 :
//                  chaque élément annule P, et le nombre d'éléments est le nombre de racines
//                  distinctes (degré 1 : une ; degré 2 : selon le discriminant). Zéro ou deux
//                  options justes → l'oracle lève une erreur et le test échoue.
//   pick(P, polys) l'unique option polynomialement ÉGALE à P (une forme factorisée).
//   root / minRoot / maxRoot / positiveRoot : racines calculées, jamais recopiées.
// Les questions CONCEPTUELLES (reconnaître une معادلة جداء معدوم, choisir qui utilise la
// propriété) sont des C('…') commentés ; leurs affirmations sont vérifiées en bas du fichier.
// Généré avec le banc par le script de l'auteur ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, poly, q } from './helpers.mjs';

const X = poly.x;
const L = (a, b) => X.mul(poly.Q(String(a))).add(poly.Q(String(b)));
const prod = (...fs) => fs.reduce((p, f) => p.mul(f), poly.of(1));
const LETTERS = 'ABCD';

/** Le nombre de racines réelles distinctes d'un polynôme de degré ≤ 2 (non nul). */
function rootCount(P) {
  const d = P.degree();
  if (d === 1) return 1;
  if (d !== 2) throw new Error(`jidaa-maadum oracle: degré ${d}`);
  const [c, b, a] = [P.coef(0), P.coef(1), P.coef(2)].map((v) => q(v));
  const disc = b.mul(b).sub(a.mul(c).mul(4));
  return disc.isZero() ? 1 : disc.n > 0n ? 2 : 0;
}
function sol(P, sets) {
  const n = rootCount(P);
  const ok = sets.map((S, i) => (S.length === n && new Set(S).size === S.length && S.every((s) => P.at(s) === '0') ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`jidaa-maadum oracle: ${ok.length} ensembles justes`);
  return C(ok[0]);
}
function pick(P, polys) {
  const ok = polys.map((Q, i) => (P.equals(Q) ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`jidaa-maadum oracle: ${ok.length} formes égales`);
  return C(ok[0]);
}
/** La racine de a·x + b (a ≠ 0), exacte. */
const root = (F) => q(F.coef(0)).neg().div(q(F.coef(1))).toString();
const cmpQ = (u, v) => { const d = q(u).sub(q(v)); return d.isZero() ? 0 : d.n < 0n ? -1 : 1; };
const minRoot = (...fs) => fs.map(root).sort(cmpQ)[0];
const maxRoot = (...fs) => fs.map(root).sort(cmpQ).at(-1);
/** L'unique racine strictement positive d'un trinôme (cherchée parmi les entiers −200 … 200). */
function positiveRoot(P) {
  const found = [];
  for (let k = 1; k <= 200; k += 1) if (P.at(k) === '0') found.push(String(k));
  if (found.length !== 1) throw new Error(`jidaa-maadum oracle: ${found.length} racines positives`);
  return found[0];
}

export const ORACLE = {
  'ex-4am-jidaa-maadum-l1-001:q1': sol(prod(L(0, 7), L(1, 2)), [['-7', '-2'], ['-2'], ['2'], ['-2', '7']]),
  'ex-4am-jidaa-maadum-l1-001:q2': sol(prod(L(1, 5), L(-1, 2)), [['-5', '2'], ['5', '-2'], ['-5'], ['-5', '-2']]),
  // conceptuel : 0 × 5 = 0 réfute « les deux », 1 × 1 = 1 ≠ 0 réfute « = 1 »
  'ex-4am-jidaa-maadum-l1-002:q1': C('B'),
  'ex-4am-jidaa-maadum-l1-002:q2': R(q('0')),
  // conceptuel : seule A est un produit égal à 0 (B : second membre 2, C : somme)
  'ex-4am-jidaa-maadum-l1-003:q1': C('B'),
  // conceptuel : (2x + 3)(x − 6) est le produit de 2x + 3 par x − 6
  'ex-4am-jidaa-maadum-l1-003:q2': C('A'),
  // conceptuel : x(x + 9) = (1x + 0)(1x + 9)
  'ex-4am-jidaa-maadum-l1-004:q1': C('A'),
  // conceptuel : x² + 9x + 1 est écrit comme une somme
  'ex-4am-jidaa-maadum-l1-004:q2': C('B'),
  'ex-4am-jidaa-maadum-l1-005:q1': sol(prod(L(1, -3), L(1, 8)), [['-24'], ['3', '-8'], ['-3', '8'], ['3']]),
  'ex-4am-jidaa-maadum-l1-005:q2': R(minRoot(L(1, -3), L(1, 8))),
  'ex-4am-jidaa-maadum-l1-006:q1': sol(prod(L(0, 4), L(1, -6)), [['-6'], ['24'], ['6'], ['4', '6']]),
  'ex-4am-jidaa-maadum-l1-006:q2': R(root(L(-2, 0))),
  'ex-4am-jidaa-maadum-l1-007:q1': sol(prod(L(1, 0), L(1, -1)), [['0', '-1'], ['0', '1'], ['1']]),
  'ex-4am-jidaa-maadum-l1-007:q2': sol(L(1, 7).pow(2), [['-7'], ['-7', '7'], ['7']]),
  // conceptuel : seul أمين passe de 3(x − 5) = 0 à x − 5 = 0 par « 3 ≠ 0 »
  'ex-4am-jidaa-maadum-l1-008:q1': C('B'),
  'ex-4am-jidaa-maadum-l1-008:q2': R(root(L(1, -5))),
  'ex-4am-jidaa-maadum-l1-009:q1': R(q('5')),
  'ex-4am-jidaa-maadum-l1-009:q2': R(q('4')),
  // conceptuel : seule A a un second membre non nul
  'ex-4am-jidaa-maadum-l1-010:q1': C('B'),
  // conceptuel : x = 5 donne x − 1 = 4 mais (4)(7) = 28 ≠ 4
  'ex-4am-jidaa-maadum-l1-010:q2': C('B'),
  'ex-4am-jidaa-maadum-l2-001:q1': sol(prod(L('2/3', 0), L(1, -4)), [['2/3', '4'], ['0', '-4'], ['0', '4'], ['4']]),
  'ex-4am-jidaa-maadum-l2-001:q2': sol(prod(L(-3, 5), L(2, -4)), [['5', '4'], ['5/3', '2'], ['3/5', '1/2'], ['-5/3', '-2']]),
  'ex-4am-jidaa-maadum-l2-002:q1': sol(prod(L(3, -4), L(-2, 1)), [['-1/2', '-4/3'], ['3/4', '2'], ['4/3'], ['1/2', '4/3']]),
  'ex-4am-jidaa-maadum-l2-002:q2': R(maxRoot(L(3, -4), L(-2, 1))),
  'ex-4am-jidaa-maadum-l2-003:q1': pick(prod(L(0, '-1.2'), L(3, '2.7')), [L('-3.6', '-3.24'), L('-3.6', '2.7'), L('3.6', '-3.24')]),
  'ex-4am-jidaa-maadum-l2-003:q2': R(root(L(3, '2.7'))),
  'ex-4am-jidaa-maadum-l2-004:q1': sol(prod(L(1, -2), L(1, 5)), [['-10'], ['2', '-5'], ['-2', '5'], ['2']]),
  // conceptuel : (x − 2)(x + 5) = x² + 3x − 10 (vérifié ci-dessous par expandsTo)
  'ex-4am-jidaa-maadum-l2-004:q2': C('C'),
  'ex-4am-jidaa-maadum-l2-005:q1': sol(prod(L(2, -5), L(3, 1)), [['2/5', '-3'], ['5/2'], ['5/2', '-1/3'], ['-5/2', '1/3']]),
  'ex-4am-jidaa-maadum-l2-005:q2': R(minRoot(L(2, -5), L(3, 1))),
  'ex-4am-jidaa-maadum-l2-006:q1': sol(prod(L(7, 0), L(-1, 4)), [['4'], ['7', '4'], ['0', '-4'], ['0', '4']]),
  'ex-4am-jidaa-maadum-l2-006:q2': sol(prod(L(-2, 1), L(1, 3)), [['2', '-3'], ['1/2'], ['1/2', '-3'], ['-1/2', '3']]),
  'ex-4am-jidaa-maadum-l2-007:q1': sol(prod(L(1, '-1.5'), L(2, '0.6')), [['1.5', '-0.3'], ['-1.5', '0.3'], ['1.5', '-1.2'], ['1.5']]),
  'ex-4am-jidaa-maadum-l2-007:q2': R(q(root(L(1, '-1.5'))).add(root(L(2, '0.6')))),
  'ex-4am-jidaa-maadum-l2-008:q1': R(q('-3')),
  // conceptuel : معارف 2, propriété des solutions
  'ex-4am-jidaa-maadum-l2-008:q2': C('C'),
  // conceptuel : seule A est écrite comme une somme
  'ex-4am-jidaa-maadum-l2-009:q1': C('A'),
  // conceptuel : la dernière opération est une addition
  'ex-4am-jidaa-maadum-l2-009:q2': C('B'),
  'ex-4am-jidaa-maadum-l2-010:q1': R(maxRoot(L(1, 6), L(5, -1))),
  'ex-4am-jidaa-maadum-l2-010:q2': R(minRoot(L(1, 6), L(5, -1))),
  'ex-4am-jidaa-maadum-l3-001:q1': pick(X.pow(2).mul(6).sub(X.mul(3)), [prod(L(3, 0), L(2, -3)), prod(L(3, 0), L(1, -1)), prod(L(3, 0), L(2, -1))]),
  'ex-4am-jidaa-maadum-l3-001:q2': sol(X.pow(2).mul(6).sub(X.mul(3)), [['0', '2'], ['-1/2', '0'], ['0', '1/2'], ['1/2']]),
  'ex-4am-jidaa-maadum-l3-002:q1': pick(L(1, 3).mul(5).add(prod(L(1, -1), L(1, 3))), [prod(L(1, 3), L(1, 6)), prod(L(1, 3), L(5, -5)), prod(L(1, 3), L(1, 4))]),
  'ex-4am-jidaa-maadum-l3-002:q2': sol(L(1, 3).mul(5).add(prod(L(1, -1), L(1, 3))), [['3', '4'], ['-3'], ['-3', '4'], ['-4', '-3']]),
  'ex-4am-jidaa-maadum-l3-003:q1': pick(prod(L(-4, 1), L(1, 3)).add(L(1, 3).mul(7)), [prod(L(1, 3), L(-4, -6)), prod(L(0, 7), L(1, 3), L(-4, 1)), prod(L(1, 3), L(-4, 8))]),
  'ex-4am-jidaa-maadum-l3-003:q2': sol(prod(L(-4, 1), L(1, 3)).add(L(1, 3).mul(7)), [['-3', '2'], ['3', '-2'], ['-3'], ['-3', '8']]),
  'ex-4am-jidaa-maadum-l3-004:q1': sol(prod(L(4, 0), L(-1, 1)), [['4', '1'], ['0', '-1'], ['0', '1'], ['1']]),
  'ex-4am-jidaa-maadum-l3-004:q2': sol(X.pow(2).mul(9).sub(X.mul(4)), [['0', '-4/9'], ['0', '4/9'], ['4/9'], ['0', '9/4']]),
  'ex-4am-jidaa-maadum-l3-005:q1': pick(X.pow(2).add(X.mul(5)), [prod(L(5, 0), L(1, 1)), X.mul(X.pow(2).add(5)), prod(L(1, 0), L(1, 5))]),
  'ex-4am-jidaa-maadum-l3-005:q2': sol(X.pow(2).add(X.mul(5)), [['0', '5'], ['0', '-5'], ['-5']]),
  'ex-4am-jidaa-maadum-l3-006:q1': sol(X.pow(2).mul(3).sub(X.mul(12)), [['0', '4'], ['4'], ['0', '-4'], ['0', '1/4']]),
  'ex-4am-jidaa-maadum-l3-006:q2': R(root(L(1, -4))),
  'ex-4am-jidaa-maadum-l3-007:q1': pick(prod(L(1, -1), L(2, 3)).sub(prod(L(1, -1), L(1, 5))), [prod(L(1, -1), L(3, 8)), prod(L(1, -1), L(1, 8)), prod(L(1, -1), L(1, -2))]),
  'ex-4am-jidaa-maadum-l3-007:q2': sol(prod(L(1, -1), L(2, 3)).sub(prod(L(1, -1), L(1, 5))), [['1', '2'], ['1', '-8/3'], ['-1', '-2'], ['1']]),
  'ex-4am-jidaa-maadum-l3-008:q1': pick(prod(L(-2, 1), L(4, -3)).sub(L(4, -3).mul(3)), [prod(L(4, -3), L(-2, 4)), prod(L(4, -3), L(-6, 0)), prod(L(4, -3), L(-2, -2))]),
  'ex-4am-jidaa-maadum-l3-008:q2': sol(prod(L(-2, 1), L(4, -3)).sub(L(4, -3).mul(3)), [['-1', '4/3'], ['-1', '3/4'], ['1', '-3/4'], ['3/4']]),
  'ex-4am-jidaa-maadum-l3-009:q1': pick(prod(L(2, 1), L(1, -4)).add(prod(L(2, 1), L(-2, 3))), [prod(L(2, 1), L(3, -7)), prod(L(2, 1), L(-1, 1)), prod(L(2, 1), L(-1, -1))]),
  'ex-4am-jidaa-maadum-l3-009:q2': sol(prod(L(2, 1), L(1, -4)).add(prod(L(2, 1), L(-2, 3))), [['-1/2', '1'], ['-1/2'], ['-1/2', '-1'], ['1/2', '1']]),
  'ex-4am-jidaa-maadum-l3-010:q1': sol(X.pow(2).mul(-1).add(X.mul(6)), [['6'], ['0', '-6'], ['0', '6']]),
  'ex-4am-jidaa-maadum-l3-010:q2': R(root(L(-1, 6))),
  'ex-4am-jidaa-maadum-l4-001:q1': pick(X.pow(2).sub(25), [prod(L(1, -25), L(1, 25)), prod(L(1, -5), L(1, 5)), L(1, -5).pow(2)]),
  'ex-4am-jidaa-maadum-l4-001:q2': sol(X.pow(2).sub(25), [['-5', '5'], ['5'], ['-25', '25']]),
  'ex-4am-jidaa-maadum-l4-002:q1': pick(X.pow(2).mul(9).sub(1), [prod(L(9, -1), L(9, 1)), prod(L(3, -1), L(3, 1)), L(3, -1).pow(2)]),
  'ex-4am-jidaa-maadum-l4-002:q2': pick(X.pow(2).mul(9).sub(1).add(X.pow(2).mul(6)).add(X.mul(7)).sub(3), [prod(L(3, -1), L(5, 4)), prod(L(3, -1), L(1, -2)), prod(L(3, 1), L(5, 4))]),
  'ex-4am-jidaa-maadum-l4-002:q3': sol(X.pow(2).mul(9).sub(1).add(X.pow(2).mul(6)).add(X.mul(7)).sub(3), [['4/5', '-1/3'], ['1/3'], ['-5/4', '3'], ['-4/5', '1/3']]),
  'ex-4am-jidaa-maadum-l4-003:q1': pick(X.pow(2).add(X.mul(10)).add(25).sub(X.pow(2).sub(25)), [prod(L(0, -10), L(1, 5)), prod(L(0, 10), L(1, 5)), prod(L(2, 0), L(1, 5))]),
  'ex-4am-jidaa-maadum-l4-003:q2': sol(X.pow(2).add(X.mul(10)).add(25).sub(X.pow(2).sub(25)), [['5'], ['-5'], ['-5', '5'], ['-5', '10']]),
  'ex-4am-jidaa-maadum-l4-004:q1': pick(X.pow(2).mul(4).sub(X.mul(4)).sub(80), [prod(L(2, -82), L(2, 80)), prod(L(2, -10), L(2, 8)), prod(L(2, -9), L(2, 9))]),
  'ex-4am-jidaa-maadum-l4-004:q2': sol(X.pow(2).mul(4).sub(X.mul(4)).sub(80), [['5'], ['-8', '10'], ['-4', '5'], ['4', '-5']]),
  'ex-4am-jidaa-maadum-l4-005:q1': sol(L(2, 1).pow(2), [['-1/2'], ['-1/2', '1/2'], ['-2'], []]),
  'ex-4am-jidaa-maadum-l4-005:q2': sol(X.pow(2).mul(4).sub(1), [['1/2'], ['-2', '2'], ['1/4'], ['-1/2', '1/2']]),
  'ex-4am-jidaa-maadum-l4-006:q1': sol(X.pow(2).sub(49), [['-49', '49'], ['-7', '7'], ['7']]),
  'ex-4am-jidaa-maadum-l4-006:q2': sol(X.pow(2).mul(9).sub(25), [['-5/3', '5/3'], ['5/3'], ['-3/5', '3/5'], ['-25/9', '25/9']]),
  'ex-4am-jidaa-maadum-l4-007:q1': sol(X.pow(2).sub(X.mul(6)).add(9), [['-3'], ['9'], ['3'], ['-3', '3']]),
  'ex-4am-jidaa-maadum-l4-007:q2': R(root(L(1, -3))),
  'ex-4am-jidaa-maadum-l4-008:q1': pick(X.pow(2).mul(4).add(X.mul(4)).add(1), [L(2, -1).pow(2), L(2, 1).pow(2), L(4, 1).pow(2)]),
  'ex-4am-jidaa-maadum-l4-008:q2': sol(X.pow(2).mul(4).add(X.mul(4)).add(1), [['-1'], ['-1/4'], ['-1/2'], ['-1/2', '1/2']]),
  'ex-4am-jidaa-maadum-l4-009:q1': pick(L(1, 2).pow(2).sub(16), [L(1, -2).pow(2), prod(L(1, -2), L(1, 6)), prod(L(1, -14), L(1, 18))]),
  'ex-4am-jidaa-maadum-l4-009:q2': sol(L(1, 2).pow(2).sub(16), [['-2', '6'], ['2'], ['-18', '14'], ['-6', '2']]),
  'ex-4am-jidaa-maadum-l4-010:q1': pick(L(3, -1).pow(2).sub(L(1, 3).pow(2)), [L(2, -4).pow(2), prod(L(2, -4), L(4, 2)), prod(L(2, 2), L(4, 2))]),
  'ex-4am-jidaa-maadum-l4-010:q2': sol(L(3, -1).pow(2).sub(L(1, 3).pow(2)), [['-1/2', '2'], ['2'], ['1/2', '-2'], ['-1', '-1/2']]),
  'ex-4am-jidaa-maadum-l5-001:q1': R(q(85).add(36)),
  'ex-4am-jidaa-maadum-l5-001:q2': pick(L(1, 6).pow(2).sub(121), [L(1, -5).pow(2), prod(L(1, -115), L(1, 127)), prod(L(1, -5), L(1, 17))]),
  'ex-4am-jidaa-maadum-l5-001:q3': R(positiveRoot(L(1, 6).pow(2).sub(121))),
  'ex-4am-jidaa-maadum-l5-002:q1': pick(X.pow(2).add(21).sub(X.mul(10)), [prod(L(1, -3), L(1, -7)), prod(L(1, 3), L(1, 7)), prod(L(1, -1), L(1, -21))]),
  'ex-4am-jidaa-maadum-l5-002:q2': sol(X.pow(2).add(21).sub(X.mul(10)), [['3'], ['3', '7'], ['-3', '-7'], ['21', '10']]),
  'ex-4am-jidaa-maadum-l5-003:q1': sol(X.pow(2).sub(X.mul(2)), [['2'], ['-2', '2'], ['0', '-2'], ['0', '2']]),
  'ex-4am-jidaa-maadum-l5-003:q2': R(positiveRoot(X.pow(2).sub(X.mul(2)))),
  'ex-4am-jidaa-maadum-l5-004:q1': pick(L(1, 3).pow(2).sub(64), [prod(L(1, -5), L(1, 11)), prod(L(1, -61), L(1, 67)), prod(L(1, 3), L(1, -61))]),
  'ex-4am-jidaa-maadum-l5-004:q2': R(positiveRoot(L(1, 3).pow(2).sub(64))),
  'ex-4am-jidaa-maadum-l5-005:q1': sol(prod(L(1, -4), L(2, 1)).sub(prod(L(1, -4), L(1, 6))), [['4'], ['4', '5'], ['5'], ['4', '-5']]),
  'ex-4am-jidaa-maadum-l5-005:q2': R(q(root(L(1, -4))).add(root(L(1, -5)))),
  'ex-4am-jidaa-maadum-l5-006:q1': pick(L(2, -3).pow(2).sub(prod(L(2, -3), L(1, 1))), [prod(L(2, -3), L(1, -4)), prod(L(2, -3), L(1, -2)), prod(L(2, -3), L(3, -2))]),
  'ex-4am-jidaa-maadum-l5-006:q2': sol(L(2, -3).pow(2).sub(prod(L(2, -3), L(1, 1))), [['2/3', '4'], ['3/2', '4'], ['3/2', '-4'], ['3/2']]),
  'ex-4am-jidaa-maadum-l5-007:q1': sol(X.pow(2).sub(X.mul(5)), [['0', '5'], ['5'], ['-5']]),
  // conceptuel : x = 9 donne x + 1 = 10 mais 10 × 7 = 70 ≠ 10 (vérifié par notSolution)
  'ex-4am-jidaa-maadum-l5-007:q2': C('A'),
  'ex-4am-jidaa-maadum-l5-008:q1': pick(X.pow(2).add(X.mul(4)).sub(12), [prod(L(1, -2), L(1, 6)), prod(L(1, -14), L(1, 18)), prod(L(1, 2), L(1, -2))]),
  'ex-4am-jidaa-maadum-l5-008:q2': R(positiveRoot(X.pow(2).add(X.mul(4)).sub(12))),
  'ex-4am-jidaa-maadum-l5-009:q1': pick(poly.of(25).sub(L(1, -1).pow(2)), [prod(L(-1, 6), L(1, 4)), prod(L(-1, 4), L(1, 6)), L(-1, 6).pow(2)]),
  'ex-4am-jidaa-maadum-l5-009:q2': sol(poly.of(25).sub(L(1, -1).pow(2)), [['-4', '6'], ['-6', '4'], ['6'], ['-5', '5']]),
  'ex-4am-jidaa-maadum-l5-010:q1': R(q(3)),
  'ex-4am-jidaa-maadum-l5-010:q2': R(root(L(1, 2))),
};

// Les affirmations des questions conceptuelles, vérifiées (le module lève à l'import si l'une est fausse).
const assert = (cond, msg) => { if (!cond) throw new Error(`jidaa-maadum oracle: ${msg}`); };
assert(prod(L(1, -2), L(1, 5)).equals(X.pow(2).add(X.mul(3)).sub(10)), '(x − 2)(x + 5) = x² + 3x − 10');
assert(q(0).mul(5).isZero() && !q(5).isZero(), '0 × 5 = 0 avec 5 ≠ 0');
assert(prod(L(1, -1), L(1, 2)).at(5) !== '4', 'x = 5 ne vérifie pas (x − 1)(x + 2) = 4');
assert(prod(L(1, 1), L(1, -2)).at(9) !== '10', 'x = 9 ne vérifie pas (x + 1)(x − 2) = 10');
assert(prod(L(0, 3), L(1, -5)).at(5) === '0', '3(5 − 5) = 0');
