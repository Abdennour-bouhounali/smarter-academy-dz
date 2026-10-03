// Oracle du banc « aksiya-talis » (unité 9 « خاصية طالس ») — chaque réponse construite RECALCULÉE ici en rationnels
// exacts (helpers.mjs), à partir des nombres de l'énoncé, sans lire le contenu ni packages/core/arithmetic/thales.js :
// un rapport est une longueur depuis le sommet commun sur la longueur correspondante (une longueur obtenue d'abord par
// somme ou différence de segments), un produit en croix est un produit, une longueur manquante vient de l'égalité des
// rapports, Pythagore d'une racine EXACTE, le compte des figures d'une énumération des côtés (abscisses signées).
// Fusionné dans scripts/practice-answer-oracle.test.mjs. Les QCM sont vérifiés par l'aller-retour du validateur.
import { R, q } from './helpers.mjs';

/** La racine carrée EXACTE d'un rationnel carré parfait (sinon une erreur : l'énoncé ne serait pas exact). */
function root(x) {
  const isq = (n) => { if (n < 0n) throw new Error('racine négative'); let r = BigInt(Math.floor(Math.sqrt(Number(n)))); while (r * r > n) r -= 1n; while ((r + 1n) * (r + 1n) <= n) r += 1n; if (r * r !== n) throw new Error(`pas un carré : ${n}`); return r; };
  return q(`${isq(x.n)}/${isq(x.d)}`);
}
/** Le rapport part / tout. */
const ratio = (part, whole) => q(part).div(whole);
/** La longueur x telle que a/b = c/x (x = b·c / a) — le « quatrième » de l'égalité des rapports. */
const fourth = (a, b, c) => q(b).mul(c).div(a);
/** Combien des 4 placements (B′ et C′ chacun d'un côté de A) donnent des abscisses signées proportionnelles. */
function parallelPlacements(k) {
  let n = 0;
  for (const sb of [1, -1]) for (const sc of [1, -1]) if (q(k).mul(sb).sub(q(k).mul(sc)).isZero()) n += 1;
  return n;
}

export const ORACLE = {
  // ── المستوى 1 ──
  'ex-4am-aksiya-talis-l1-002:q1': R(ratio(4, 6)),                         // CB/CF
  'ex-4am-aksiya-talis-l1-003:q1': R(ratio(3, 12)),                        // AC′/AC
  'ex-4am-aksiya-talis-l1-006:q1': R(ratio('1.2', '1.8')),                 // EA/EC
  'ex-4am-aksiya-talis-l1-006:q2': R(ratio('3.2', '4.8')),                 // ED/EB
  'ex-4am-aksiya-talis-l1-008:q1': R(ratio(3, '2.4')),                     // OM/OR
  'ex-4am-aksiya-talis-l1-008:q2': R(ratio(5, 4)),                         // ON/OP
  'ex-4am-aksiya-talis-l1-010:q1': R(q('2.4').mul(4)),
  // ── المستوى 2 ──
  'ex-4am-aksiya-talis-l2-001:q1': R(q(36).sub(20)),                       // AM = AB − MB
  'ex-4am-aksiya-talis-l2-001:q2': R(ratio(q(36).sub(20), 36)),
  'ex-4am-aksiya-talis-l2-002:q1': R(ratio(2, 10)),                        // AB = DC
  'ex-4am-aksiya-talis-l2-002:q2': R(ratio(3, 15)),                        // AD = BC
  'ex-4am-aksiya-talis-l2-003:q1': R(ratio(6, 15)),
  'ex-4am-aksiya-talis-l2-004:q1': R(q(5).mul(9)),
  'ex-4am-aksiya-talis-l2-004:q2': R(q(12).mul(4)),
  'ex-4am-aksiya-talis-l2-008:q1': R(fourth(5, 3, 10)),                    // 3/5 = AN/10 ⇔ 5/3 = 10/AN
  'ex-4am-aksiya-talis-l2-009:q1': R(q(8).sub('2.4')),                     // AE = AB − EB
  // ── المستوى 3 ──
  'ex-4am-aksiya-talis-l3-001:q1': R(q('3.5').mul('1.8')),
  'ex-4am-aksiya-talis-l3-001:q2': R(q('1.5').mul('4.2')),
  'ex-4am-aksiya-talis-l3-002:q1': R(q('3.5').add('1.5')),                 // AF = AD + DF
  'ex-4am-aksiya-talis-l3-002:q2': R(q('4.6').mul('3.5')),
  'ex-4am-aksiya-talis-l3-003:q1': R(ratio(q(4).sub(1), 4)),               // AI/AB, AI = AB − BI
  'ex-4am-aksiya-talis-l3-003:q2': R(ratio(q(5).sub(1), 5)),               // AJ/AC
  'ex-4am-aksiya-talis-l3-005:q1': R(q('2.8').mul('5.4')),
  'ex-4am-aksiya-talis-l3-006:q1': R(q('2.5').mul('7.5')),
  'ex-4am-aksiya-talis-l3-009:q1': R(fourth('4.5', 3, 6)),                 // OM/OR = ON/OP
  'ex-4am-aksiya-talis-l3-010:q1': R(ratio(5, q(5).add(3))),               // AC = AN + NC
  // ── المستوى 4 ──
  'ex-4am-aksiya-talis-l4-002:q1': R(q(1).sub(q(2).div(3))),               // OJ = OA − AJ, AJ = 2/3 AO
  'ex-4am-aksiya-talis-l4-004:q1': R(fourth(7, 3, 14)),                    // AB′/AB = AC′/AC
  'ex-4am-aksiya-talis-l4-007:q1': R(root(q(5).mul(5).sub(q(4).mul(4)))),  // OD (ODC rectangle en O)
  'ex-4am-aksiya-talis-l4-007:q2': R(root(q('2.5').mul('2.5').sub(q('1.5').mul('1.5')))), // OA
  'ex-4am-aksiya-talis-l4-008:q1': R(parallelPlacements('1/4')),
  'ex-4am-aksiya-talis-l4-009:q1': R(q('4.2').add('2.8')),
  // ── المستوى 5 ──
  'ex-4am-aksiya-talis-l5-001:q1': R(ratio(30, q(30).add(20)).mul(30)),    // LK = (AK/AB) × CB
  'ex-4am-aksiya-talis-l5-001:q2': R(q(20).div(ratio(30, 50)).sub(20)),     // LC = AC − AL, AC = AL ÷ (AK/AB)
  'ex-4am-aksiya-talis-l5-003:q1': R(fourth('2.4', '1.6', 3)),             // 1,6/2,4 = AC′/3
  'ex-4am-aksiya-talis-l5-004:q1': R(q('1.5').mul(3)),
  'ex-4am-aksiya-talis-l5-005:q1': R(ratio(3, '7.5')),
  'ex-4am-aksiya-talis-l5-007:q1': R(q(6).sub(2)),                         // BM = AB − AM
  'ex-4am-aksiya-talis-l5-008:q1': R(root(q(3).mul(3).add(q(4).mul(4)))),  // BC
  'ex-4am-aksiya-talis-l5-008:q3': R(ratio('1.2', 3).mul(root(q(25)))),    // MN = (AM/AB) × BC
  'ex-4am-aksiya-talis-l5-009:q1': R(q(300).add(200)),
};
