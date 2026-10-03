// Oracle du banc « wadiya-idmajiya-talis » (unité 9 « خاصية طالس ») — chaque réponse construite RECALCULÉE ici en
// rationnels exacts (helpers.mjs), sans lire le contenu ni packages/core/arithmetic/thales.js. Fusionné dans
// scripts/practice-answer-oracle.test.mjs.
//
// Méthode : chaque situation est re-traduite à partir des nombres de son énoncé —
//   · Thalès : a ÷ b = c ÷ x ⇒ x = b·c ÷ a (`fourth`) ; un côté écrit comme somme (OD = OB + BD) avant l'égalité ;
//   · l'ombre : le bâton de hauteur s planté à d du pied, les ombres finissant ensemble à t ⇒ h = s·t ÷ (t − d) ;
//   · le cylindre inscrit dans le cône (H, R) : r = R(H − h) ÷ H, h = H(R − r) ÷ R ; h = k·r ⇒ r = R·H ÷ (H + R·k) ;
//     son volume ÷ π = r²·h ;
//   · une valeur approchée : arrondi au centième de x·π.
// Pour les QCM calculatoires, `onlyC(options, pred)` vérifie que l'option retenue est la SEULE vraie.
// Généré avec le banc par le script de l'auteur (gen_bank.py) — ne pas éditer une entrée sans l'autre côté.
import { R, C, q } from './helpers.mjs';

const eqQ = (u, v) => q(u).sub(v).isZero();
const gtQ = (u, v) => q(u).sub(v).n > 0n;
const fourth = (a, b, c) => q(b).mul(c).div(a);
const shadowH = (stick, at, tip) => q(stick).mul(tip).div(q(tip).sub(at)).toString();
const rIns = (H, R0, h) => q(R0).mul(q(H).sub(h)).div(H).toString();
const hIns = (H, R0, r) => q(H).mul(q(R0).sub(r)).div(R0).toString();
const rHk = (H, R0, k) => q(R0).mul(H).div(q(H).add(q(R0).mul(k))).toString();
const vop = (r, h) => q(r).mul(r).mul(h).toString();
const round2 = (x) => Math.round(x * 100) / 100;
/** L'unique option (lettre) dont le prédicat est vrai ; sinon erreur. */
function onlyC(options, isRight) {
  const ok = Object.entries(options).filter(([, v]) => isRight(v)).map(([k]) => k);
  if (ok.length !== 1) throw new Error(`oracle: ${ok.length} options justes (${ok.join(',')})`);
  return C(ok[0]);
}

export const ORACLE = {
  'ex-4am-wadiya-idmajiya-talis-l1-001:q1': onlyC({A: 6, B: '1.5', C: '3/2'}, (v) => eqQ(v, fourth(q(3).add(2), 10, 3))),
  'ex-4am-wadiya-idmajiya-talis-l1-002:q1': onlyC({A: '1/2', B: 4, C: 8}, (v) => eqQ(v, fourth(2, 2, 4))),
  'ex-4am-wadiya-idmajiya-talis-l1-002:q2': onlyC({A: 24, B: 3, C: 6}, (v) => eqQ(v, fourth(2, 3, 4))),
  'ex-4am-wadiya-idmajiya-talis-l1-003:q1': onlyC({A: 'par', B: 'half', C: 'nonpar'}, (v) => v === (eqQ(q(11).div(33), q(15).div(60)) ? 'par' : 'nonpar')),
  'ex-4am-wadiya-idmajiya-talis-l1-006:q1': R(vop(3, 5)),
  'ex-4am-wadiya-idmajiya-talis-l1-007:q1': R(fourth(2, 9, 1)),
  'ex-4am-wadiya-idmajiya-talis-l1-010:q1': onlyC({A: 'no', B: 'yes', C: 'cant'}, (v) => v === (eqQ(q(2).div(5), q(4).div(10)) ? 'yes' : 'no')),
  'ex-4am-wadiya-idmajiya-talis-l2-001:q1': R(q('11.6').sub(10).toString()),
  'ex-4am-wadiya-idmajiya-talis-l2-001:q2': R(shadowH(1, 10, '11.6')),
  'ex-4am-wadiya-idmajiya-talis-l2-002:q1': R(rIns(12, 4, 9)),
  'ex-4am-wadiya-idmajiya-talis-l2-003:q1': R(hIns(12, 4, 3)),
  'ex-4am-wadiya-idmajiya-talis-l2-004:q1': R(q(3).mul(9).div(q('7.5').sub(3)).toString()),
  'ex-4am-wadiya-idmajiya-talis-l2-005:q1': R(fourth(2, 24, '1.5')),
  'ex-4am-wadiya-idmajiya-talis-l2-006:q1': onlyC({A: '91.13', B: '286.27', C: '286.28', D: '273.38'}, (v) => Number(v) === round2(Number(q('91.125').n) / Number(q('91.125').d) * Math.PI)),
  'ex-4am-wadiya-idmajiya-talis-l2-007:q1': R(vop('1.5', 4)),
  'ex-4am-wadiya-idmajiya-talis-l2-009:q1': onlyC({A: 'yes', B: 'no', C: 'yes2'}, (v) => v === (eqQ(q('1.2').div(2), q('1.3').div(2)) ? 'yes' : 'no')),
  'ex-4am-wadiya-idmajiya-talis-l3-001:q1': R(rHk(18, 6, 1)),
  'ex-4am-wadiya-idmajiya-talis-l3-001:q2': R(vop(rHk(18, 6, 1), rHk(18, 6, 1))),
  'ex-4am-wadiya-idmajiya-talis-l3-002:q1': R(q(2).mul(6).div(q(5).sub(2)).toString()),
  'ex-4am-wadiya-idmajiya-talis-l3-002:q2': R(q(2).mul(6).div(q(5).sub(2)).add(6).toString()),
  'ex-4am-wadiya-idmajiya-talis-l3-003:q1': R(rHk(10, 5, 1)),
  'ex-4am-wadiya-idmajiya-talis-l3-003:q2': R(vop(rHk(10, 5, 1), rHk(10, 5, 1))),
  'ex-4am-wadiya-idmajiya-talis-l3-004:q2': R(fourth('1.2', q(214).div(2).add(61), 1)),
  'ex-4am-wadiya-idmajiya-talis-l3-005:q1': onlyC({A: 'par', B: 'no', C: 'par2'}, (v) => v === (eqQ(q(4).div(10), q(6).div(15)) ? 'par' : 'no')),
  'ex-4am-wadiya-idmajiya-talis-l3-005:q2': R(fourth(4, 10, 3)),
  'ex-4am-wadiya-idmajiya-talis-l3-007:q1': R(rIns(15, 5, 6)),
  'ex-4am-wadiya-idmajiya-talis-l3-007:q2': R(vop(rIns(15, 5, 6), 6)),
  'ex-4am-wadiya-idmajiya-talis-l3-008:q1': R(fourth(2, q(4).add(2), '1.8')),
  'ex-4am-wadiya-idmajiya-talis-l3-010:q1': R(rHk(9, 3, 1)),
  'ex-4am-wadiya-idmajiya-talis-l4-001:q1': R(q(1).div(2).toString()),
  'ex-4am-wadiya-idmajiya-talis-l4-002:q1': R(rHk(12, 4, 1)),
  'ex-4am-wadiya-idmajiya-talis-l4-002:q2': R(vop(rHk(12, 4, 1), rHk(12, 4, 1))),
  'ex-4am-wadiya-idmajiya-talis-l4-002:q3': onlyC({A: '84.82', B: '27', C: '84.81'}, (v) => Number(v) === round2(27 * Math.PI)),
  'ex-4am-wadiya-idmajiya-talis-l4-003:q1': R(q('1.5').mul(10).div(q(4).sub('1.5')).toString()),
  'ex-4am-wadiya-idmajiya-talis-l4-003:q2': R(q('1.5').mul(10).div(q(4).sub('1.5')).add(10).toString()),
  'ex-4am-wadiya-idmajiya-talis-l4-004:q1': R(rHk(20, 5, 2)),
  'ex-4am-wadiya-idmajiya-talis-l4-004:q2': R(q(2).mul(rHk(20, 5, 2)).toString()),
  'ex-4am-wadiya-idmajiya-talis-l4-005:q1': onlyC({A: '1/2', B: '9/2', C: 'none'}, (v) => { const r = q(6).mul(q(18).sub(20)).div(q(18).add(6)); return r.n < 0n ? v === 'none' : eqQ(v, r); }),
  'ex-4am-wadiya-idmajiya-talis-l4-006:q1': R(q(9).sub('7.5').toString()),
  'ex-4am-wadiya-idmajiya-talis-l4-006:q2': R(shadowH(2, '7.5', 9)),
  'ex-4am-wadiya-idmajiya-talis-l4-007:q1': onlyC({A: 'par', B: 'no', C: 'par2'}, (v) => v === (eqQ(q(4).div(7), q(5).div(9)) ? 'par' : 'no')),
  'ex-4am-wadiya-idmajiya-talis-l4-008:q1': onlyC({A: 3, B: 6, C: 9}, (h) => [3, 6, 9].every((g) => !gtQ(vop(rIns(18, 6, g), g), vop(rIns(18, 6, h), h)))),
  'ex-4am-wadiya-idmajiya-talis-l4-008:q2': R(vop(rIns(18, 6, 6), 6)),
  'ex-4am-wadiya-idmajiya-talis-l4-009:q1': R((round2(27 * Math.PI / 1000)).toString()),
  'ex-4am-wadiya-idmajiya-talis-l4-010:q1': R(fourth('0.8', q(150).div(2).add(39), 1)),
  'ex-4am-wadiya-idmajiya-talis-l5-001:q2': R(rHk(24, 8, 1)),
  'ex-4am-wadiya-idmajiya-talis-l5-001:q3': R(vop(rHk(24, 8, 1), rHk(24, 8, 1))),
  'ex-4am-wadiya-idmajiya-talis-l5-001:q4': onlyC({A: 'ok', B: 'nopi', C: 'bad'}, (v) => v === (round2(216 * Math.PI) === 678.58 ? 'ok' : 'x')),
  'ex-4am-wadiya-idmajiya-talis-l5-002:q1': onlyC({A: 'par', B: 'no', C: 'cant'}, (v) => v === (eqQ(q(3).div('7.5'), q(4).div(10)) ? 'par' : 'no')),
  'ex-4am-wadiya-idmajiya-talis-l5-002:q2': R(fourth(3, '7.5', '2.4')),
  'ex-4am-wadiya-idmajiya-talis-l5-003:q1': R(q(1).div(3).mul(36).mul(18).toString()),
  'ex-4am-wadiya-idmajiya-talis-l5-003:q2': R(q('91.125').div(q(1).div(3).mul(36).mul(18)).toString()),
  'ex-4am-wadiya-idmajiya-talis-l5-004:q1': R(fourth('1.5', 6, 2).sub(2).toString()),
  'ex-4am-wadiya-idmajiya-talis-l5-005:q1': onlyC({A: 'approx', B: 'false', C: 'exact'}, (v) => v === (eqQ(q(8).mul('6.5'), q('5.2').mul(10)) ? 'exact' : 'false')),
  'ex-4am-wadiya-idmajiya-talis-l5-006:q1': R(rHk(12, 4, 2)),
  'ex-4am-wadiya-idmajiya-talis-l5-006:q2': R(vop(rHk(12, 4, 2), q(2).mul(rHk(12, 4, 2)))),
  'ex-4am-wadiya-idmajiya-talis-l5-007:q1': R(q(1).div(3).toString()),
  'ex-4am-wadiya-idmajiya-talis-l5-007:q2': R(fourth(1, 3, 2)),
  'ex-4am-wadiya-idmajiya-talis-l5-008:q1': onlyC({A: 'par', B: 'order', C: 'ratio'}, (v) => v === (eqQ(q(2).div(4), q(3).div(6)) ? 'order' : 'ratio')),
  'ex-4am-wadiya-idmajiya-talis-l5-009:q1': R(String(Math.sqrt(10 * 10 - 6 * 6))),
  'ex-4am-wadiya-idmajiya-talis-l5-009:q2': R(rHk(Math.sqrt(10 * 10 - 6 * 6), 6, 1)),
  'ex-4am-wadiya-idmajiya-talis-l5-010:q1': R(rHk(14, 7, 1)),
  'ex-4am-wadiya-idmajiya-talis-l5-010:q2': onlyC({A: 'no', B: 'yes', C: 'cant'}, (v) => v === (Number(q(vop(rHk(14, 7, 1), rHk(14, 7, 1))).n) / Number(q(vop(rHk(14, 7, 1), rHk(14, 7, 1))).d) * Math.PI > 300 ? 'yes' : 'no')),
};
