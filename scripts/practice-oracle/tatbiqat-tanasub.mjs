// Oracle du banc « tatbiqat-tanasub » (unité 6 « الدالة الخطية والتناسبية ») — chaque réponse RECALCULÉE ici,
// sans lire le contenu ni le code testé (ni packages/core/arithmetic/proportional.js). Fusionné dans
// scripts/practice-answer-oracle.test.mjs. Les pourcentages sont refaits en rationnels EXACTS (`q` de
// helpers.mjs) : « augmenter de t % » = ×(1 + t/100), « diminuer de t % » = ×(1 − t/100), des changements
// successifs = le PRODUIT des multiplicateurs ; les grandeurs composées par leurs définitions (d / t, m / V,
// P × t) et les conversions d'unités (1 h = 3600 s, 1 m³ = 1000 L, 1 kg = 1000 g).
//
// Les QCM sont rejoués par le calcul quand ils portent sur un nombre :
//   pickValue(v, opts)   la lettre de l'UNIQUE option dont la valeur (chaîne exacte, null = option non
//                        numérique) est égale à v ; une erreur s'il y en a zéro ou deux ;
//   pickMax(vals)        la lettre de la plus grande valeur (le métal le plus lourd).
// Les QCM d'écriture (« v = d/t », une valeur approchée « حوالي … ») sont vérifiés par l'aller-retour du
// validateur. Généré avec le banc par le script de l'auteur ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, q } from './helpers.mjs';

const LETTERS = 'ABCD';
function pickValue(v, opts) {
  const hits = opts.map((o, i) => (o !== null && q(o).sub(v).isZero() ? i : -1)).filter((i) => i >= 0);
  if (hits.length !== 1) throw new Error(`oracle tatbiqat-tanasub : ${hits.length} options égales à ${v}`);
  return C(LETTERS[hits[0]]);
}
function pickMax(vals) {
  let best = 0;
  vals.forEach((v, i) => { if (!v.sub(vals[best]).isZero() && v.sub(vals[best]).n > 0n) best = i; });
  return C(LETTERS[best]);
}

export const ORACLE = {
  'ex-4am-tatbiqat-tanasub-l1-001:q1': pickValue(q(1).add(q(5).div(100)), ['0.05', '1.05', '0.95']),
  'ex-4am-tatbiqat-tanasub-l1-001:q2': R(q(25000).mul(q(1).add(q(5).div(100)))),
  'ex-4am-tatbiqat-tanasub-l1-002:q1': pickValue(q(1).sub(q(15).div(100)), ['0.15', '0.85', '1.15', null]),
  'ex-4am-tatbiqat-tanasub-l1-002:q2': R(q(40).mul(q(1).sub(q(15).div(100)))),
  'ex-4am-tatbiqat-tanasub-l1-003:q1': R(q(30).mul(20).div(100)),
  'ex-4am-tatbiqat-tanasub-l1-003:q2': R(q(10).mul(30).div(100)),
  'ex-4am-tatbiqat-tanasub-l1-003:q3': R(q(40).sub(q(30).mul(20).div(100)).sub(q(10).mul(30).div(100))),
  'ex-4am-tatbiqat-tanasub-l1-004:q1': pickValue(q(25).div(100), ['0.25', '1.25', '0.75', '25']),
  'ex-4am-tatbiqat-tanasub-l1-004:q2': R(q(640).mul(25).div(100)),
  'ex-4am-tatbiqat-tanasub-l1-005:q1': pickValue(q(1).sub(q(30).div(100)), ['0.3', '1.3', '0.7', '0.97']),
  'ex-4am-tatbiqat-tanasub-l1-005:q2': R(q(4500).mul(q(1).sub(q(30).div(100)))),
  'ex-4am-tatbiqat-tanasub-l1-006:q2': R(q(150).div(2)),
  'ex-4am-tatbiqat-tanasub-l1-007:q1': R(q(540).div(200)),
  'ex-4am-tatbiqat-tanasub-l1-008:q1': R(q('1.5').mul(2)),
  'ex-4am-tatbiqat-tanasub-l1-009:q1': pickValue(q(1).add(q(20).div(100)), ['1.2', null, '0.2', '0.8']),
  'ex-4am-tatbiqat-tanasub-l1-009:q2': R(q(500).mul(q(1).add(q(20).div(100)))),
  'ex-4am-tatbiqat-tanasub-l1-010:q2': R(q(90).mul(3)),
  'ex-4am-tatbiqat-tanasub-l2-001:q1': R(q(560).mul(q(1).sub(q(6).div(100)))),
  'ex-4am-tatbiqat-tanasub-l2-002:q1': pickValue(q(1).sub(q(5).div(100)), ['1.05', '0.95', null, '0.05']),
  'ex-4am-tatbiqat-tanasub-l2-002:q2': R(q(1200).mul(q(1).sub(q(5).div(100)))),
  'ex-4am-tatbiqat-tanasub-l2-003:q1': R(q(3240).div(3000)),
  'ex-4am-tatbiqat-tanasub-l2-003:q2': R(q(3240).div(3000).sub(1).mul(100)),
  'ex-4am-tatbiqat-tanasub-l2-004:q1': R(q(1).add(q(8).div(100))),
  'ex-4am-tatbiqat-tanasub-l2-005:q1': R(q(25).mul(3600).div(1000)),
  'ex-4am-tatbiqat-tanasub-l2-006:q1': R(q(7200000).div(1000).div(3600)),
  'ex-4am-tatbiqat-tanasub-l2-007:q1': R(q(54).mul(1000).div(3600)),
  'ex-4am-tatbiqat-tanasub-l2-008:q1': R(q(42).div('1.5')),
  'ex-4am-tatbiqat-tanasub-l2-008:q2': R(q('2.4').div('0.01')),
  'ex-4am-tatbiqat-tanasub-l2-009:q2': R(q('0.92').mul(5)),
  'ex-4am-tatbiqat-tanasub-l2-010:q1': R(q(2400).div(q(1).sub(q(25).div(100)))),
  'ex-4am-tatbiqat-tanasub-l3-001:q1': R(q(1).sub(q(4140).div(4500)).mul(100)),
  'ex-4am-tatbiqat-tanasub-l3-002:q1': R(q(100).mul(50).div(100).add(q(95).mul(40).div(100)).add(q(90).mul(60).div(100)).add(q(90).mul(70).div(100))),
  'ex-4am-tatbiqat-tanasub-l3-004:q1': R(q(1900).div(q(1).sub(q(5).div(100)))),
  'ex-4am-tatbiqat-tanasub-l3-005:q1': R(q(2300).div(q(1).add(q(15).div(100)))),
  'ex-4am-tatbiqat-tanasub-l3-006:q1': R(q('57.9').mul(1000).div(3000)),
  'ex-4am-tatbiqat-tanasub-l3-006:q2': R(q(63).div(6)),
  'ex-4am-tatbiqat-tanasub-l3-006:q3': R(q('71.2').div(8)),
  'ex-4am-tatbiqat-tanasub-l3-006:q4': pickMax([q('57.9').mul(1000).div(3000), q(63).div(6), q('71.2').div(8)]),
  'ex-4am-tatbiqat-tanasub-l3-008:q1': R(q(300).div(250).sub(1).mul(100)),
  'ex-4am-tatbiqat-tanasub-l3-010:q1': R(q(9).div(2)),
  'ex-4am-tatbiqat-tanasub-l4-001:q1': R(q(30).mul(q(1).sub(q(30).div(100))).mul(q(1).add(q(15).div(100)))),
  'ex-4am-tatbiqat-tanasub-l4-001:q2': pickValue(q(1).sub(q(30).div(100)).mul(q(1).add(q(15).div(100))).sub(1).mul(100), ['-19.5', '-15', '15', '-45']),
  'ex-4am-tatbiqat-tanasub-l4-002:q1': R(q(1).add(q(3).div(100)).mul(q(1).sub(q(2).div(100))).mul(q(1).sub(q(1).div(100)))),
  'ex-4am-tatbiqat-tanasub-l4-003:q1': R(q(48000).mul(q(1).sub(q(3).div(100))).mul(q(1).sub(q(4).div(100)))),
  'ex-4am-tatbiqat-tanasub-l4-003:q2': R(q(1).sub(q(1).sub(q(3).div(100)).mul(q(1).sub(q(4).div(100)))).mul(100)),
  'ex-4am-tatbiqat-tanasub-l4-004:q1': R(q(1000).mul(q(1).sub(q(20).div(100))).mul(q(1).add(q(20).div(100)))),
  'ex-4am-tatbiqat-tanasub-l4-004:q2': pickValue(q(1).sub(q(20).div(100)).mul(q(1).add(q(20).div(100))).sub(1).mul(100), ['-4', '0', '4']),
  'ex-4am-tatbiqat-tanasub-l4-005:q1': R(q(1).add(q(10).div(100)).mul(q(1).add(q(10).div(100)))),
  'ex-4am-tatbiqat-tanasub-l4-005:q2': pickValue(q(1).add(q(10).div(100)).mul(q(1).add(q(10).div(100))).sub(1).mul(100), ['20', '21', '11']),
  'ex-4am-tatbiqat-tanasub-l4-006:q1': R(q(2200).mul(1000).mul(60)),                 // تمرين 27 : 2200 m³/s → L/min (typed since the 2^53 bound, 2026-10-02)
  'ex-4am-tatbiqat-tanasub-l4-007:q1': R(q(3).mul(1000).mul(3600)),
  'ex-4am-tatbiqat-tanasub-l4-008:q1': R(q('10.5').div(1000).mul(1000000)),
  'ex-4am-tatbiqat-tanasub-l4-009:q1': R(q(63).mul(75).div(100)),
  'ex-4am-tatbiqat-tanasub-l4-009:q2': R(q(63).mul(75).div(100).mul(1000).div(1).div(1000)),
  'ex-4am-tatbiqat-tanasub-l4-010:q1': R(q(5).mul(2).mul(3600).div(1000)),
  'ex-4am-tatbiqat-tanasub-l5-001:q1': R(q(8000).mul(q(1).sub(q(30).div(100))).mul(q(1).sub(q(20).div(100)))),
  'ex-4am-tatbiqat-tanasub-l5-001:q2': pickValue(q(1).sub(q(1).sub(q(30).div(100)).mul(q(1).sub(q(20).div(100)))).mul(100), ['44', '50', '56', '6']),
  'ex-4am-tatbiqat-tanasub-l5-002:q1': pickValue(q(1).add(q(25).div(100)).mul(q(1).sub(q(20).div(100))).sub(1).mul(100), ['-5', '0', '5']),
  'ex-4am-tatbiqat-tanasub-l5-003:q1': R(q(30000).mul(q(1).add(q(4).div(100))).mul(q(1).add(q(4).div(100)))),
  'ex-4am-tatbiqat-tanasub-l5-004:q1': R(q(1).sub(q(1).div(q(1).add(q(25).div(100)))).mul(100)),
  'ex-4am-tatbiqat-tanasub-l5-005:q1': pickValue(q('6.5').div(100), ['0.065', '6.5', '200/13', null]),
  'ex-4am-tatbiqat-tanasub-l5-005:q2': R(q('6.5').div(100).mul(340)),
  'ex-4am-tatbiqat-tanasub-l5-006:q1': R(q('1.8').mul(1000).div(12)),
  'ex-4am-tatbiqat-tanasub-l5-007:q1': R(q('21.6').div(q(2).mul(2).mul(2))),
  'ex-4am-tatbiqat-tanasub-l5-008:q1': R(q('1.5').mul(1000).div('12.5')),
  'ex-4am-tatbiqat-tanasub-l5-009:q1': R(q(45000).div(30)),
  'ex-4am-tatbiqat-tanasub-l5-010:q1': R(q(5950).div(q(1).add(q(19).div(100)))),
};
