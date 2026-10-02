// Oracle du banc « tarrid-taalufi » (unité 7 « الدالة التآلفية ») — chaque réponse RECALCULÉE ici en
// rationnels exacts (helpers.mjs), sans lire le contenu ni le code testé. Fusionné dans
// scripts/practice-answer-oracle.test.mjs. Généré avec le banc par le script de l'auteur (gen.mjs,
// scratchpad) ; ne pas éditer une entrée sans recalculer l'autre côté.
//   R(q(...))    une réponse rationnelle recalculée
//   pick(flags)  la lettre de l'UNIQUE option vraie (zéro ou deux options vraies → erreur)
//   C('X')       un choix conceptuel, justifié en commentaire
import { R, C, q } from './helpers.mjs';

const LETTERS = ['A', 'B', 'C', 'D'];
function pick(flags) {
  const ok = flags.map((f, i) => (f ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`tarrid-taalufi oracle: ${ok.length} options vraies`);
  return C(ok[0]);
}

export const ORACLE = {
  'ex-4am-tarrid-taalufi-l1-001:q1': C('A') /* b = 2000 une fois, a = 200 par match */,
  'ex-4am-tarrid-taalufi-l1-001:q2': R(q(200).mul(7).add(2000)),
  'ex-4am-tarrid-taalufi-l1-002:q1': R(q(150).mul(4).add(500)),
  'ex-4am-tarrid-taalufi-l1-003:q1': C('B') /* b = 100 une fois, a = 40 par km */,
  'ex-4am-tarrid-taalufi-l1-004:q1': C('B') /* f(0) = 1500 : la partie fixe */,
  'ex-4am-tarrid-taalufi-l1-005:q1': C('A') /* aucune partie fixe : 20x */,
  'ex-4am-tarrid-taalufi-l1-006:q1': R(q(150).mul(3).add(300)),
  'ex-4am-tarrid-taalufi-l1-007:q1': R(q(50).mul(6).add(600)),
  'ex-4am-tarrid-taalufi-l1-008:q1': pick([q(200).mul(2).add(2000).sub(q(400).mul(2)).n < 0n, q(400).mul(2).sub(q(200).mul(2).add(2000)).n < 0n, q(200).mul(2).add(2000).sub(q(400).mul(2)).n === 0n]),
  'ex-4am-tarrid-taalufi-l1-009:q1': C('A') /* f(x) = g(x) */,
  'ex-4am-tarrid-taalufi-l1-010:q1': pick([q(250).mul(4).sub(q(150).mul(4).add(1000)).n < 0n, q(150).mul(4).add(1000).sub(q(250).mul(4)).n < 0n, false]),
  'ex-4am-tarrid-taalufi-l2-001:q1': R(q(4800).sub(2000).div(200)),
  'ex-4am-tarrid-taalufi-l2-001:q2': R(q(3000).sub(2000).div(200)),
  'ex-4am-tarrid-taalufi-l2-002:q1': R(q(2240).sub(800).div(120)),
  'ex-4am-tarrid-taalufi-l2-003:q1': R(q(580).sub(100).div(40)),
  'ex-4am-tarrid-taalufi-l2-004:q1': R(q(1200).sub(300).div(150)),
  'ex-4am-tarrid-taalufi-l2-005:q1': C('B') /* f(1) − f(0) = 80 */,
  'ex-4am-tarrid-taalufi-l2-006:q1': R(q(1200).div(q(350).sub(150))),
  'ex-4am-tarrid-taalufi-l2-007:q1': R(q(600).div(q(200).sub(50))),
  'ex-4am-tarrid-taalufi-l2-008:q1': pick([q(100).mul(12).add(1500).sub(q(250).mul(12)).n < 0n, q(250).mul(12).sub(q(100).mul(12).add(1500)).n < 0n, false]),
  'ex-4am-tarrid-taalufi-l2-009:q1': R(q(100).mul(10)),
  'ex-4am-tarrid-taalufi-l2-010:q1': C('A') /* abscisse = x où f(x) = g(x) */,
  'ex-4am-tarrid-taalufi-l3-001:q1': R(q(120).div(q(60).sub(40))),
  'ex-4am-tarrid-taalufi-l3-001:q2': pick([q(40).mul(4).add(120).sub(q(60).mul(4)).n < 0n, q(60).mul(4).sub(q(40).mul(4).add(120)).n < 0n, false]),
  'ex-4am-tarrid-taalufi-l3-002:q1': R(q(1000).div(q(500).sub(300))),
  'ex-4am-tarrid-taalufi-l3-002:q2': pick([q(300).mul(8).add(1000).sub(q(500).mul(8)).n < 0n, q(500).mul(8).sub(q(300).mul(8).add(1000)).n < 0n, false]),
  'ex-4am-tarrid-taalufi-l3-003:q1': C('B') /* 300 < 15x ⇔ x > 20 */,
  'ex-4am-tarrid-taalufi-l3-004:q1': C('C') /* b = 900, a = 70 */,
  'ex-4am-tarrid-taalufi-l3-005:q1': R(q(1640).sub(1000).div(80)),
  'ex-4am-tarrid-taalufi-l3-006:q1': R(q(6000).div(q(3000).sub(1500))),
  'ex-4am-tarrid-taalufi-l3-007:q1': pick([q(3000).mul(2).sub(q(1500).mul(2).add(6000)).n < 0n, q(1500).mul(2).add(6000).sub(q(3000).mul(2)).n < 0n, false]),
  'ex-4am-tarrid-taalufi-l3-008:q1': R(q(6000).div(q(3000).sub(1500)).add(1)),
  'ex-4am-tarrid-taalufi-l3-009:q1': R(q(40).mul(15).add(600)),
  'ex-4am-tarrid-taalufi-l3-010:q1': C('A') /* ordonnée plus petite */,
  'ex-4am-tarrid-taalufi-l4-001:q1': C('A') /* 1200 < 60x ⇔ x > 20 */,
  'ex-4am-tarrid-taalufi-l4-002:q1': R(q(50).div(q(25).sub(15))),
  'ex-4am-tarrid-taalufi-l4-002:q2': pick([q(15).mul(12).add(50).sub(q(25).mul(12)).n < 0n, q(25).mul(12).sub(q(15).mul(12).add(50)).n < 0n, false]),
  'ex-4am-tarrid-taalufi-l4-003:q1': pick((() => { const v = [q(100).mul(35), q(40).mul(35).add(600), q(1800)]; const m = v.reduce((a, b) => (a.sub(b).n <= 0n ? a : b)); return v.map((x) => x.sub(m).n === 0n); })()),
  'ex-4am-tarrid-taalufi-l4-004:q1': pick((() => { const v = [q(100).mul(5), q(40).mul(5).add(600), q(1800)]; const m = v.reduce((a, b) => (a.sub(b).n <= 0n ? a : b)); return v.map((x) => x.sub(m).n === 0n); })()),
  'ex-4am-tarrid-taalufi-l4-005:q1': R(q(900).div(q(150).sub(60)).add(1)),
  'ex-4am-tarrid-taalufi-l4-006:q1': C('C') /* 400x + 100 : partie fixe multipliée par x ; 100x + 400 = 400 + 100x */,
  'ex-4am-tarrid-taalufi-l4-007:q1': R(q(5000).sub(1500).div(250)),
  'ex-4am-tarrid-taalufi-l4-008:q1': R((() => { const t = q(500).div(q(200).sub(120)); return q(t.n / t.d + 1n); })()),
  'ex-4am-tarrid-taalufi-l4-009:q1': C('A') /* 200x < 2000 ⇔ x < 10 */,
  'ex-4am-tarrid-taalufi-l4-010:q1': R(q(400).mul(20).sub(q(200).mul(20).add(2000))),
  'ex-4am-tarrid-taalufi-l5-001:q1': R(q(600).div(q(100).sub(40))),
  'ex-4am-tarrid-taalufi-l5-001:q2': R(q(1800).sub(600).div(40)),
  'ex-4am-tarrid-taalufi-l5-002:q1': R((() => { const t = q(500).div(q(80).sub(45)); return q(t.n / t.d + 1n); })()),
  'ex-4am-tarrid-taalufi-l5-003:q1': pick((() => { const v = [q(200).mul(8), q(50).mul(8).add(600), q(1500)]; const m = v.reduce((a, b) => (a.sub(b).n <= 0n ? a : b)); return v.map((x) => x.sub(m).n === 0n); })()),
  'ex-4am-tarrid-taalufi-l5-004:q1': R(q(3000).sub(600).div(50)),
  'ex-4am-tarrid-taalufi-l5-004:q2': pick([q(3000).sub(600).div(50).sub(q(3000).div(100)).n > 0n, q(3000).div(100).sub(q(3000).sub(600).div(50)).n > 0n, false]),
  'ex-4am-tarrid-taalufi-l5-005:q1': C(q(50).sub(50).n === 0n && q(400).sub(250).n > 0n ? 'B' : 'A'),
  'ex-4am-tarrid-taalufi-l5-006:q1': R(q(150).div(q(4).sub('2.5'))),
  'ex-4am-tarrid-taalufi-l5-007:q1': C('B') /* b = 2400 une fois, a = 1200 par mois */,
  'ex-4am-tarrid-taalufi-l5-008:q1': pick((() => { const a = q(3000).div(12); const b = q(3000).sub(1200).div(12); const A = a.mul(20); const B = b.mul(20).add(1200); return [A.sub(B).n < 0n, B.sub(A).n < 0n, A.sub(B).n === 0n]; })()),
  'ex-4am-tarrid-taalufi-l5-009:q1': R(q(6000).sub(2000).div(200).sub(q(6000).div(400))),
  'ex-4am-tarrid-taalufi-l5-010:q1': C(q(300).div(q(250).sub(150)).toString() === '3' ? 'B' : 'A'),
};
