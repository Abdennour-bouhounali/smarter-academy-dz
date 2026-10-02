// Oracle du banc « majdulat-ihsaiya » (unité 8 « الإحصاء ») — chaque réponse RECALCULÉE ici en rationnels exacts
// (helpers.mjs), sans lire le contenu ni le code testé. Fusionné dans scripts/practice-answer-oracle.test.mjs.
// Généré avec le banc par le script de l'auteur (gen_bank.py, scratchpad) ; ne pas éditer une entrée sans
// recalculer l'autre côté.
//   R(q(...))    une valeur d'indicateur recalculée (somme, quotient, tri pour la médiane)
//   pick(flags)  la lettre de l'UNIQUE option vraie (zéro ou deux options vraies → erreur)
//   C('X')       un choix conceptuel (plage, fonction, graphique), justifié en commentaire
import { R, C, q } from './helpers.mjs';

const LETTERS = ['A', 'B', 'C', 'D'];
function pickAt(order, flags) {
  const ok = flags.map((f, i) => (f ? i : -1)).filter((i) => i >= 0);
  if (ok.length !== 1) throw new Error(`majdulat-ihsaiya oracle: ${ok.length} options vraies`);
  return C(LETTERS[order.indexOf(ok[0])]);
}

export const ORACLE = {
  'ex-4am-majdulat-ihsaiya-l1-001:q1': C('A') /* 7 valeurs en ligne 1 depuis A : A..G */,
  'ex-4am-majdulat-ihsaiya-l1-002:q1': C('D') /* colonne C, ligne 4 → C4 */,
  'ex-4am-majdulat-ihsaiya-l1-003:q1': R(q(5)) /* A, B, C, D, E */,
  'ex-4am-majdulat-ihsaiya-l1-004:q1': C('C') /* un دستور commence par = */,
  'ex-4am-majdulat-ihsaiya-l1-005:q1': C('B') /* MOYENNE = moyenne */,
  'ex-4am-majdulat-ihsaiya-l1-006:q1': R(q(9).sub(5)),
  'ex-4am-majdulat-ihsaiya-l1-007:q1': R(q(5).add(8).add(6).add(9).add(7).div(5)),
  'ex-4am-majdulat-ihsaiya-l1-008:q1': C('C') /* valeurs isolées → barres */,
  'ex-4am-majdulat-ihsaiya-l1-009:q1': C('B') /* parts d'un tout → secteurs */,
  'ex-4am-majdulat-ihsaiya-l1-010:q1': C('A') /* classes contiguës → histogramme */,
  'ex-4am-majdulat-ihsaiya-l2-001:q1': R(q(10).sub(2)),
  'ex-4am-majdulat-ihsaiya-l2-001:q2': R([4, 10, 8, 4, 3, 2, 4].sort((a, b) => a - b)[3]),
  'ex-4am-majdulat-ihsaiya-l2-002:q1': R(q(4).add(10).add(8).add(4).add(3).add(2).add(4).div(7)),
  'ex-4am-majdulat-ihsaiya-l2-002:q2': R(q(4)) /* 4 apparaît 3 fois, les autres une fois */,
  'ex-4am-majdulat-ihsaiya-l2-003:q1': R(q(9).add(10).div(2)) /* rangés 7 8 9 10 12 15 */,
  'ex-4am-majdulat-ihsaiya-l2-004:q1': R(q(43)) /* 43 trois fois, 41 deux fois */,
  'ex-4am-majdulat-ihsaiya-l2-005:q1': C('C') /* 12e lettre = L */,
  'ex-4am-majdulat-ihsaiya-l2-006:q1': R(q(60).div(q(60).add(40).add(50)).mul(360)),
  'ex-4am-majdulat-ihsaiya-l2-007:q1': R(q(50).div(150).mul(360)),
  'ex-4am-majdulat-ihsaiya-l2-007:q2': R(q(40).div(150).mul(360)),
  'ex-4am-majdulat-ihsaiya-l2-008:q1': R(q(30).div(120).mul(360)),
  'ex-4am-majdulat-ihsaiya-l2-009:q1': R(q(21).sub(9)),
  'ex-4am-majdulat-ihsaiya-l2-010:q1': C('C') /* non enregistré → perdu */,
  'ex-4am-majdulat-ihsaiya-l3-001:q1': pickAt([3, 0, 1, 2], [q(31).div(6), q(5), q(31).div(7), q(35).div(6)].map((v) => Math.abs(Number(v.n) / Number(v.d) - 5.17) < 0.005)) /* A1:F1 = 31 sur 6 cellules */,
  'ex-4am-majdulat-ihsaiya-l3-002:q1': R(q(10)) /* plus grande valeur */,
  'ex-4am-majdulat-ihsaiya-l3-002:q2': C('C') /* étendue = 10 − 2 = 8 ≠ 10 */,
  'ex-4am-majdulat-ihsaiya-l3-003:q1': R([9, 3, 7, 1, 5].sort((a, b) => a - b)[2]),
  'ex-4am-majdulat-ihsaiya-l3-004:q1': R(q(4).add(17).add(8).add(4).add(3).add(2).add(4).div(7)),
  'ex-4am-majdulat-ihsaiya-l3-005:q1': R([4, 17, 8, 4, 3, 2, 4].sort((a, b) => a - b)[3]),
  'ex-4am-majdulat-ihsaiya-l3-006:q1': C('C') /* B2 à B13 = 12 cellules */,
  'ex-4am-majdulat-ihsaiya-l3-007:q1': C('C') /* 10 ≠ 7 pour la 3e classe ; 8 = 8 */,
  'ex-4am-majdulat-ihsaiya-l3-008:q1': R(q(8).add(9).add(4).add(6).add(2).add(1)),
  'ex-4am-majdulat-ihsaiya-l3-008:q2': C('B') /* plus grand effectif 9 ↔ 32 */,
  'ex-4am-majdulat-ihsaiya-l3-009:q1': C('A') /* histogramme = rectangles contigus sur classes */,
  'ex-4am-majdulat-ihsaiya-l3-010:q1': C('C') /* AVERAGE = MOYENNE */,
  'ex-4am-majdulat-ihsaiya-l4-001:q1': R(q(97).mul(2).add(q(104).mul(3)).add(q(99).mul(5))),
  'ex-4am-majdulat-ihsaiya-l4-001:q2': R(q(1001).div(q(2).add(3).add(5))),
  'ex-4am-majdulat-ihsaiya-l4-002:q1': R(q(12).mul(3).add(q(15).mul(5)).add(q(20).mul(2)).div(10)),
  'ex-4am-majdulat-ihsaiya-l4-003:q1': R(q(6).add(8).add(10).add(4).div(4)) /* 4 cellules non vides */,
  'ex-4am-majdulat-ihsaiya-l4-004:q1': R(q(10).sub(1)),
  'ex-4am-majdulat-ihsaiya-l4-005:q1': R(q(600).div(2400).mul(360)),
  'ex-4am-majdulat-ihsaiya-l4-006:q1': R(q(360).sub(150).sub(90)),
  'ex-4am-majdulat-ihsaiya-l4-007:q1': pickAt([1, 2, 0], [[2, 9], [0, 2], [9, 13]].map(([lo, hi]) => 7 > lo && 7 <= hi)) /* N = 13, rang 7, cumuls 2, 9, 13 */,
  'ex-4am-majdulat-ihsaiya-l4-008:q1': C('C') /* colonne A1:A50, fonction MEDIANE, avec = */,
  'ex-4am-majdulat-ihsaiya-l4-009:q1': C('C') /* max < 1 et min ≥ 0 ⇒ max − min < 1 */,
  'ex-4am-majdulat-ihsaiya-l4-010:q1': C('B') /* de A2, 25 cellules → A26 */,
  'ex-4am-majdulat-ihsaiya-l5-001:q1': R(q(14).add(15).div(2)) /* rangés 9 11 12 14 15 15 18 20 */,
  'ex-4am-majdulat-ihsaiya-l5-001:q2': R(q(12).add(15).add(9).add(18).add(15).add(11).add(20).add(14).div(8)),
  'ex-4am-majdulat-ihsaiya-l5-002:q1': R(q(120).add(150).add(130).add(140).add(2000).div(5)),
  'ex-4am-majdulat-ihsaiya-l5-002:q2': C('C') /* médiane 140 (rangés 120 130 140 150 2000) ; 4 vidéos sur 5 sous 508 */,
  'ex-4am-majdulat-ihsaiya-l5-003:q1': R(q(15).div(q(12).add(9).add(15)).mul(360)),
  'ex-4am-majdulat-ihsaiya-l5-003:q2': C('B') /* parts d'un tout */,
  'ex-4am-majdulat-ihsaiya-l5-004:q1': R(q(12).mul(5).sub(10).sub(14).sub(9).sub(13)),
  'ex-4am-majdulat-ihsaiya-l5-005:q1': R(q(15).add(7)),
  'ex-4am-majdulat-ihsaiya-l5-006:q1': R(q(13).mul(10).add(24).div(11)),
  'ex-4am-majdulat-ihsaiya-l5-007:q1': pickAt([2, 0, 1], [[5, 14], [0, 5], [14, 20]].map(([lo, hi]) => 10 > lo && 11 <= hi)) /* N = 20, rangs 10 et 11, cumuls 5, 14, 20 */,
  'ex-4am-majdulat-ihsaiya-l5-008:q1': R(q(6).add(2).add(1)),
  'ex-4am-majdulat-ihsaiya-l5-009:q1': R(q(1)) /* 1 trois fois, 2 deux fois, 3 une fois */,
  'ex-4am-majdulat-ihsaiya-l5-010:q1': R(q(7).mul(3)) /* colonnes A..G (7) × lignes 1..3 */,
};
