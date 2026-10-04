// Oracle du banc « wadiya-idmajiya-muthallathat » (unité 10 « حساب المثلثات في المثلث القائم ») — chaque réponse
// construite RECALCULÉE ici à partir des nombres de son énoncé, sans lire le contenu ni
// packages/core/arithmetic/trigonometry.js : Math.sin/cos/tan en DEGRÉS (fonctions locales), Math.hypot pour
// Pythagore, l'arrondi décimal propre à ce fichier (`roundTo`, demi-supérieur), les rationnels exacts de helpers.mjs
// pour Thalès (h = poteau × distance totale ÷ distance au poteau). Pour les QCM qui portent une mesure en degrés,
// `onlyDeg` vérifie que l'option retenue est la SEULE égale à la mesure recalculée. Les autres QCM (conceptuels)
// sont couverts par l'aller-retour du validateur (C(...) : la lettre de la bonne réponse, relue du générateur).
// Fusionné dans scripts/practice-answer-oracle.test.mjs. Généré avec le banc (gen_bank.py de l'auteur).
import { R, C, q } from './helpers.mjs';

const RAD = Math.PI / 180;
const sinD = (d) => Math.sin(d * RAD);
const cosD = (d) => Math.cos(d * RAD);
const tanD = (d) => Math.tan(d * RAD);
const asinD = (v) => Math.asin(v) / RAD;
const acosD = (v) => Math.acos(v) / RAD;
const atanD = (v) => Math.atan(v) / RAD;
/** Arrondi décimal au demi-supérieur, en chaîne avec un point (sans zéros finaux). */
function roundTo(x, k) {
  const f = 10 ** k;
  const v = Math.round((x + Math.sign(x) * 1e-9) * f) / f;
  return String(Number(v.toFixed(k)));
}
const r0 = (x) => roundTo(x, 0);
const r1 = (x) => roundTo(x, 1);
const r2 = (x) => roundTo(x, 2);
/** L'unique option dont la mesure (en degrés) vaut `deg` ; sinon erreur. */
function onlyDeg(options, deg) {
  const ok = Object.entries(options).filter(([, v]) => v === deg).map(([k]) => k);
  if (ok.length !== 1) throw new Error(`oracle: ${ok.length} options justes (${ok.join(',')})`);
  return C(ok[0]);
}

export const ORACLE = {
  'ex-4am-wadiya-idmajiya-muthallathat-l1-009:q1': R(String(Math.round(atanD(0.616)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l1-010:q1': R(q('3.2').add('46.8').toString()),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-001:q1': R(q('2.45').add('95.65').toString()),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-001:q2': R(r2(2.3 * 98.1 / 2.45)),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-001:q3': R(String(Math.round(atanD(2.3 / 2.45)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-002:q1': R(q(3).mul(q(3).add(89)).div(3).toString()),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-002:q2': R(String(Math.round(atanD(3 / 3)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-003:q1': R(q(2).mul(q('1.5').add('78.75')).div('1.5').toString()),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-004:q1': R(String(Math.round(atanD(2.5 / 4)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-005:q1': R(r1(30 * tanD(52))),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-006:q1': R(r0(Math.hypot(105, 68))),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-006:q2': R(String(Math.round(atanD(68 / 105)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-008:q1': R(String(Math.hypot(8, 6))),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-008:q2': R(String(Math.hypot(Math.hypot(8, 6), 24))),
  'ex-4am-wadiya-idmajiya-muthallathat-l2-010:q1': R(String(Math.round(acosD(1.5 / 4)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-001:q2': R(r0(Math.hypot(3.15, 2.35))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-001:q3': R(r0(Math.hypot(3.15, 2.35, 1.55))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-002:q2': R(String(Math.round(asinD(1.55 / Math.hypot(3.15, 2.35, 1.55))))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-003:q1': R(q('1.2').mul(q(98).add(2)).div(2).toString()),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-003:q2': R(String(Math.round(atanD(1.2 / 2)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-004:q1': R(String(Math.round(atanD(60 / 75)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-004:q2': R(r0(Math.hypot(75, 60))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-005:q1': R(r0(64 / tanD(8))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-006:q2': R(r0(Math.sqrt(220 ** 2 - (231 * Math.SQRT2 / 2) ** 2))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-007:q1': R(r1(750 * sinD(12))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-007:q2': R(r1(750 * cosD(12))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-008:q1': R('12/13'),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-008:q2': R('5/12'),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-009:q1': onlyDeg({"A": 6, "B": 7, "D": 83}, Math.round(asinD(0.9 / 7))),
  'ex-4am-wadiya-idmajiya-muthallathat-l3-010:q2': R(r1(50 * sinD(40))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-001:q1': R(r0(Math.sqrt(220 ** 2 - 115.5 ** 2))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-001:q2': R(String(Math.round(acosD(115.5 / Math.sqrt(220 ** 2 - 115.5 ** 2))))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-002:q1': R(q(4).sub('1.5').toString()),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-002:q2': R(q('1.5').add(q('2.5').mul('72.4').div(2)).toString()),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-002:q3': R(String(Math.round(atanD(2.5 / 2)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-003:q1': R(r1(Math.hypot(8, 6, 3))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-003:q2': R(String(Math.round(atanD(3 / 10)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-004:q1': R(q(2).mul(q('46.4').add('1.6')).div('1.6').toString()),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-004:q2': R(r1(Math.hypot(48, Number(q(2).mul(48).div('1.6').toString())))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-005:q2': R(r0(40 * tanD(35))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-006:q2': R(String(Math.round(atanD(1 / Math.SQRT2)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-007:q1': R(r1(8 * tanD(35))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-007:q2': R(r1(8 / cosD(35))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-008:q1': R(r2(Math.hypot(1.2, 0.9))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-008:q2': R(String(Math.round(atanD(0.9 / 1.2)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-010:q1': R(r1(Math.hypot(15, 7))),
  'ex-4am-wadiya-idmajiya-muthallathat-l4-010:q2': R(String(Math.round(atanD(7 / 15)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-001:q2': R(r1(20 / (1 / tanD(30) - 1))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-002:q1': R(r1(Math.hypot(98.1, 2.3 * 98.1 / 2.45))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-002:q2': R(String(Math.round(90 - atanD(2.3 / 2.45)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-003:q2': R(r1(Math.sqrt(12 ** 2 + 200))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-003:q3': R(String(Math.round(atanD(12 / (10 * Math.SQRT2))))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-004:q1': R(r0(1 + 60 * sinD(50))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-004:q2': R(r1(60 * (sinD(50) - sinD(40)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-005:q1': R(String(Math.hypot(1200, 1150 - 800))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-005:q2': R(String(Math.round(atanD(350 / 1200)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-006:q1': R(r2(Math.hypot(2, 1.2, 1))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-007:q1': R(String(Math.round(atanD(1.8 / 2.4)))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-007:q2': R(q(16).mul('1.8').div('2.4').toString()),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-008:q2': R(r1(1.6 + 50 * tanD(28))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-009:q1': R(r0(1.6 + 104 * tanD(41))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-009:q2': R(r0(1.6 + 104 * tanD(40))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-010:q1': R(r2(Math.hypot(4, 2, 1.5))),
  'ex-4am-wadiya-idmajiya-muthallathat-l5-010:q2': onlyDeg({"A": 17, "B": 19, "C": 21}, Math.round(asinD(1.5 / Math.hypot(4, 2, 1.5)))),
};
