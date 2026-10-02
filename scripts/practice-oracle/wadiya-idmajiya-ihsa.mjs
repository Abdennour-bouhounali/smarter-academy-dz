// Oracle du banc « wadiya-idmajiya-ihsa » (unité 8 « الإحصاء ») — chaque réponse construite RECALCULÉE ici en
// rationnels exacts (helpers.mjs), sans lire le contenu ni le code testé. Fusionné dans
// scripts/practice-answer-oracle.test.mjs.
//
// Méthode : chaque situation est re-traduite à partir des nombres de son énoncé —
//   · une série est (valeurs, effectifs) ; la médiane est lue sur la série DÉPLIÉE et TRIÉE ; la moyenne est
//     Σ v·f ÷ Σ f ; les effectifs cumulés comptent v ≤ t (« على الأكثر ») ou v ≥ t (« على الأقل ») ;
//   · une valeur cachée par la moyenne : (m·N − Σ des autres) ÷ son effectif ; par la médiane : CHERCHÉE pas à
//     pas entre ses bornes (unique, sinon erreur) ; un effectif inconnu par la médiane ou la moyenne : idem ;
//   · « le tout à partir d'un pourcentage » : partie ÷ (p/100) ; arrondi à l'unité la plus proche.
// Pour les QCM calculatoires, `onlyC(options, pred)` vérifie que l'option retenue est la SEULE vraie.
// Généré avec le banc par $S/work/wadiya-idmajiya-ihsa/gen_bank.py — ne pas éditer une entrée sans l'autre côté.
import { R, C, q, solve2 } from './helpers.mjs';

const sgn = (v) => { const n = q(v).n; return n > 0n ? 1 : n < 0n ? -1 : 0; };
const eqQ = (u, v) => sgn(q(u).sub(v)) === 0;
const lt = (u, v) => sgn(q(u).sub(v)) < 0;
const le = (u, v) => sgn(q(u).sub(v)) <= 0;
const ones = (v) => v.map(() => 1);
const total = (f) => String(f.reduce((s, k) => s + k, 0));
const wsum = (v, f = ones(v)) => v.reduce((s, x, i) => s.add(q(x).mul(f[i])), q(0)).toString();
const meanOf = (v, f = ones(v)) => q(wsum(v, f)).div(total(f)).toString();
const expand = (v, f = ones(v)) => v.flatMap((x, i) => Array.from({ length: f[i] }, () => q(x))).sort((a, b) => sgn(a.sub(b)));
const medianOf = (v, f = ones(v)) => {
  const s = expand(v, f); const n = s.length;
  return (n % 2 ? s[(n - 1) / 2] : s[n / 2 - 1].add(s[n / 2]).div(2)).toString();
};
const rangeOf = (v) => { const s = expand(v); return s[s.length - 1].sub(s[0]).toString(); };
const cumUp = (v, f, t) => String(v.reduce((s, x, i) => s + (le(x, t) ? f[i] : 0), 0));
const cumDown = (v, f, t) => String(v.reduce((s, x, i) => s + (le(t, x) ? f[i] : 0), 0));
const countAbove = (v, f, t) => String(v.reduce((s, x, i) => s + (lt(t, x) ? f[i] : 0), 0));
const pctOf = (p, n) => q(p).div(100).mul(n).toString();
const pctPart = (part, whole) => q(part).mul(100).div(whole).toString();
const wholeFromPctQ = (part, p) => q(part).div(q(p).div(100));
const wholeFromPct = (part, p) => wholeFromPctQ(part, p).toString();
const roundQ = (x) => Math.round(Number(x.n) / Number(x.d));
const centre = (a, b) => q(a).add(b).div(2).toString();
/** La valeur cachée d'indice `idx` (effectif f[idx]) qui donne la moyenne m. */
const hiddenMean = (v, f, idx, m) => {
  const others = v.map((x, i) => (i === idx ? 0 : x));
  return q(m).mul(total(f)).sub(wsum(others, f)).div(f[idx]).toString();
};
/** L'UNIQUE entier de [lo, hi] qui, posé en idx, donne la médiane `med`. */
const hiddenMedian = (v, f, idx, lo, hi, med) => {
  const ok = [];
  for (let x = lo; x <= hi; x += 1) { const w = v.slice(); w[idx] = x; if (eqQ(medianOf(w, f), med)) ok.push(x); }
  if (ok.length !== 1) throw new Error(`oracle: ${ok.length} valeurs cachées pour la médiane ${med}`);
  return String(ok[0]);
};
/** Les deux effectifs inconnus (indices 1 et 2) : somme imposée par N, couple UNIQUE donnant la médiane. */
const freqForMedian = (v, f0, f3, N, med) => {
  const s = N - f0 - f3; const ok = [];
  for (let a = 0; a <= s; a += 1) if (eqQ(medianOf(v, [f0, a, s - a, f3]), med)) ok.push([String(a), String(s - a)]);
  if (ok.length !== 1) throw new Error('oracle: couple non unique');
  return ok[0];
};
/** L'effectif inconnu d'indice idx (entier ≥ 0) qui donne la moyenne m, cherché pas à pas. */
const freqForMean = (v, f, idx, m) => {
  for (let a = 0; a < 1000; a += 1) { const g = f.slice(); g[idx] = a; if (eqQ(meanOf(v, g), m)) return String(a); }
  throw new Error('oracle: aucun effectif');
};
/** Le nombre d'élèves n quand on retire la valeur v : m·n − v = m′·(n − 1). */
const countFromRemoval = (m, v, m2) => q(v).sub(m2).div(q(m).sub(m2)).toString();
/** L'unique option (lettre) dont le prédicat est vrai ; sinon erreur. */
function onlyC(options, isRight) {
  const ok = Object.entries(options).filter(([, v]) => isRight(v)).map(([k]) => k);
  if (ok.length !== 1) throw new Error(`oracle: ${ok.length} options justes (${ok.join(',')})`);
  return C(ok[0]);
}

export const ORACLE = {
  'ex-4am-wadiya-idmajiya-ihsa-l1-001:q1': onlyC({A: 13, B: 19, C: 30}, (x) => eqQ(x, cumUp([7, 9, 14, 28], [6, 10, 3, 1], 14))),
  'ex-4am-wadiya-idmajiya-ihsa-l1-002:q1': onlyC({A: 40, B: 80, C: 260}, (x) => eqQ(x, cumDown([10, 20, 30, 40], [50, 60, 70, 80], 40))),
  'ex-4am-wadiya-idmajiya-ihsa-l1-003:q1': onlyC({A: 30, B: 20, C: 40}, (x) => eqQ(x, medianOf([8, 20, 40, 60]))),
  'ex-4am-wadiya-idmajiya-ihsa-l1-004:q1': onlyC({A: '6', B: '6.9', C: '5.3'}, (x) => eqQ(x, rangeOf(['8.1', '5.7', 3, '2.8']))),
  'ex-4am-wadiya-idmajiya-ihsa-l1-005:q1': R(total([3, 4, 2, 1])),
  'ex-4am-wadiya-idmajiya-ihsa-l1-006:q1': R(rangeOf([3, 5, 2, 8, 7])),
  'ex-4am-wadiya-idmajiya-ihsa-l1-007:q1': R(cumUp([38, 39, 40, 41, 42], [2, 5, 8, 4, 1], 40)),
  'ex-4am-wadiya-idmajiya-ihsa-l1-009:q1': R(pctOf(25, 40)),
  'ex-4am-wadiya-idmajiya-ihsa-l1-010:q1': R(meanOf([12, 15, 9, 14])),
  'ex-4am-wadiya-idmajiya-ihsa-l2-001:q1': onlyC({A: 49, B: 50, C: 51}, (r) => eqQ(r, q(97 + 1).div(2))),
  'ex-4am-wadiya-idmajiya-ihsa-l2-002:q1': onlyC({A: -1, B: 1, C: 0}, (s) => s === sgn(q(meanOf([13, 1, 4, 10, 12])).sub(medianOf([13, 1, 4, 10, 12])))),
  'ex-4am-wadiya-idmajiya-ihsa-l2-003:q1': R(total([11, 3, 2, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1])),
  'ex-4am-wadiya-idmajiya-ihsa-l2-003:q2': onlyC({A: [15, 16], B: [7, 8], C: [15.5]}, (r) => r.length === 2 && r[0] === 30 / 2 && r[1] === 30 / 2 + 1),
  'ex-4am-wadiya-idmajiya-ihsa-l2-004:q1': R(meanOf([1, 2, 3], [4, 3, 3])),
  'ex-4am-wadiya-idmajiya-ihsa-l2-005:q1': R(cumDown([1, 2, 3, 4, 5], [3, 6, 7, 4, 5], 3)),
  'ex-4am-wadiya-idmajiya-ihsa-l2-005:q2': R(pctPart(cumDown([1, 2, 3, 4, 5], [3, 6, 7, 4, 5], 3), total([3, 6, 7, 4, 5]))),
  'ex-4am-wadiya-idmajiya-ihsa-l2-006:q1': R(medianOf([152, 147, 160, 155, 149, 158, 151])),
  'ex-4am-wadiya-idmajiya-ihsa-l2-007:q1': R(wholeFromPct(9, 30)),
  'ex-4am-wadiya-idmajiya-ihsa-l2-008:q1': R(hiddenMean([12, 15, 0, 9], [1, 1, 1, 1], 2, 12)),
  'ex-4am-wadiya-idmajiya-ihsa-l2-010:q1': R(rangeOf([12, 15, 20, 30])),
  'ex-4am-wadiya-idmajiya-ihsa-l3-001:q1': R(cumUp([1, 2], [11, 3], 2)),
  'ex-4am-wadiya-idmajiya-ihsa-l3-001:q2': R(hiddenMedian([1, 2, 0, 4, 5, 6, 7, 11, 13, 14, 16, 26, 28, 32], [11, 3, 2, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1], 2, 2, 4, 3)),
  'ex-4am-wadiya-idmajiya-ihsa-l3-002:q1': R(hiddenMean([0, 1, 2, 3, 0], [3, 5, 4, 2, 1], 4, "1.6")),
  'ex-4am-wadiya-idmajiya-ihsa-l3-003:q1': R(medianOf([10, 12, 14, 16], [3, 4, 5, 4])),
  'ex-4am-wadiya-idmajiya-ihsa-l3-004:q1': R(wholeFromPct(23, 46)),
  'ex-4am-wadiya-idmajiya-ihsa-l3-005:q1': onlyC({A: true, B: false, C: false}, (t) => t === lt(rangeOf([14, 15, 15, 16, 15]), rangeOf([8, 12, 15, 18, 22]))),
  'ex-4am-wadiya-idmajiya-ihsa-l3-006:q1': R(pctPart(cumUp([6, 8, 10, 12, 14], [2, 5, 6, 4, 3], 10), total([2, 5, 6, 4, 3]))),
  'ex-4am-wadiya-idmajiya-ihsa-l3-007:q1': onlyC({A: [1, 0], B: [1, 1], C: [0, 0]}, ([m, d]) => m === sgn(q(meanOf([30000, 32000, 35000, 38000, 90000])).sub(meanOf([30000, 32000, 35000, 38000, 40000]))) && d === sgn(q(medianOf([30000, 32000, 35000, 38000, 90000])).sub(medianOf([30000, 32000, 35000, 38000, 40000])))),
  'ex-4am-wadiya-idmajiya-ihsa-l3-008:q1': R(q(20).sub(4 + 6 + 5).toString()),
  'ex-4am-wadiya-idmajiya-ihsa-l3-008:q2': R(meanOf([1, 2, 3, 4], [4, 5, 6, 5])),
  'ex-4am-wadiya-idmajiya-ihsa-l3-009:q1': R(meanOf([centre(0, 10), centre(10, 20), centre(20, 30)], [2, 5, 3])),
  'ex-4am-wadiya-idmajiya-ihsa-l3-010:q1': R(wholeFromPct(15, 60)),
  'ex-4am-wadiya-idmajiya-ihsa-l3-010:q2': R(q(wholeFromPct(15, 60)).sub(15).toString()),
  'ex-4am-wadiya-idmajiya-ihsa-l4-001:q1': R(wsum([1, 2, 0, 4, 5, 6, 7, 11, 13, 14, 16, 26, 0, 32], [11, 3, 2, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1])),
  'ex-4am-wadiya-idmajiya-ihsa-l4-001:q2': R(hiddenMean([1, 2, 3, 4, 5, 6, 7, 11, 13, 14, 16, 26, 0, 32], [11, 3, 2, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1], 12, 7)),
  'ex-4am-wadiya-idmajiya-ihsa-l4-002:q1': R(roundQ(wholeFromPctQ(30, 69))),
  'ex-4am-wadiya-idmajiya-ihsa-l4-002:q2': R(roundQ(wholeFromPctQ(30, 69)) - 30),
  'ex-4am-wadiya-idmajiya-ihsa-l4-003:q1': R(q(10).sub(3 + 4).toString()),
  'ex-4am-wadiya-idmajiya-ihsa-l4-003:q2': R(freqForMedian([4, 5, 8, 12], 3, 4, 10, "6.5")[0]),
  'ex-4am-wadiya-idmajiya-ihsa-l4-003:q3': R(freqForMedian([4, 5, 8, 12], 3, 4, 10, "6.5")[1]),
  'ex-4am-wadiya-idmajiya-ihsa-l4-004:q1': R(hiddenMedian([1, 2, 0, 6, 8, 9, 15], [2, 3, 4, 2, 2, 1, 1], 2, 3, 5, 4)),
  'ex-4am-wadiya-idmajiya-ihsa-l4-004:q2': R(hiddenMean([1, 2, 4, 6, 8, 0, 15], [2, 3, 4, 2, 2, 1, 1], 5, "5.4")),
  'ex-4am-wadiya-idmajiya-ihsa-l4-005:q1': R(wholeFromPct(27, 75)),
  'ex-4am-wadiya-idmajiya-ihsa-l4-005:q2': R(q(wholeFromPct(27, 75)).sub(27).toString()),
  'ex-4am-wadiya-idmajiya-ihsa-l4-006:q1': onlyC({A: true, B: false, C: false}, (t) => t === (eqQ(medianOf([8, 10, 12, 14, 16], [3, 4, 6, 5, 2]), 12) && 2 * Number(cumDown([8, 10, 12, 14, 16], [3, 4, 6, 5, 2], 12)) >= 20)),
  'ex-4am-wadiya-idmajiya-ihsa-l4-007:q1': R(q(24 * 11 + 16).div(25).toString()),
  'ex-4am-wadiya-idmajiya-ihsa-l4-008:q1': R(freqForMean([6, 10, 14], [3, 0, 1], 1, 9)),
  'ex-4am-wadiya-idmajiya-ihsa-l4-009:q1': R(pctPart(cumUp([13, 14, 15, 16], [10, 14, 10, 6], 14), 40)),
  'ex-4am-wadiya-idmajiya-ihsa-l4-009:q2': R(pctPart(cumDown([13, 14, 15, 16], [10, 14, 10, 6], 15), 40)),
  'ex-4am-wadiya-idmajiya-ihsa-l5-001:q1': R(hiddenMedian([0, 1, 0, 4, 5, 6, 9], [2, 6, 5, 3, 2, 1, 1], 2, 2, 3, 3)),
  'ex-4am-wadiya-idmajiya-ihsa-l5-001:q2': R(hiddenMean([0, 1, 3, 4, 5, 0, 9], [2, 6, 5, 3, 2, 1, 1], 5, "2.9")),
  'ex-4am-wadiya-idmajiya-ihsa-l5-001:q3': R(wholeFromPct(20, 80)),
  'ex-4am-wadiya-idmajiya-ihsa-l5-002:q1': R(hiddenMean([2, 3, 5, 6, 0], [1, 1, 1, 1, 1], 4, 5)),
  'ex-4am-wadiya-idmajiya-ihsa-l5-002:q2': R(rangeOf([2, 3, 5, 6, 9])),
  'ex-4am-wadiya-idmajiya-ihsa-l5-002:q3': onlyC({A: [0, 1], B: [1, 1], C: [0, 0]}, ([d, m]) => d === sgn(q(medianOf([2, 3, 5, 6, 20])).sub(medianOf([2, 3, 5, 6, 9]))) && m === sgn(q(meanOf([2, 3, 5, 6, 20])).sub(meanOf([2, 3, 5, 6, 9])))),
  'ex-4am-wadiya-idmajiya-ihsa-l5-003:q1': onlyC({A: [2, "x"], B: ["x", "x"], C: [2, 2]}, ([a, b]) => { const s = expand([1, 2, 3, 5, 7], [4, 3, 2, 3, 2]); return String(a) === s[6].toString() && (b === "x") === eqQ(s[7], 3); }),
  'ex-4am-wadiya-idmajiya-ihsa-l5-003:q2': R(hiddenMedian([1, 2, 0, 5, 7], [4, 3, 2, 3, 2], 2, 3, 4, 3)),
  'ex-4am-wadiya-idmajiya-ihsa-l5-004:q1': R(q(30).sub(3 + 7 + 5 + 4 + 1).toString()),
  'ex-4am-wadiya-idmajiya-ihsa-l5-004:q2': R(medianOf([1, 2, 3, 4, 5, 6], [3, 7, 10, 5, 4, 1])),
  'ex-4am-wadiya-idmajiya-ihsa-l5-004:q3': R(pctPart(countAbove([1, 2, 3, 4, 5, 6], [3, 7, 10, 5, 4, 1], 3), 30)),
  'ex-4am-wadiya-idmajiya-ihsa-l5-005:q1': R(meanOf([12, "10.5"], [20, 30])),
  'ex-4am-wadiya-idmajiya-ihsa-l5-006:q1': R(countFromRemoval(12, 20, "11.5")),
  'ex-4am-wadiya-idmajiya-ihsa-l5-007:q1': R(hiddenMedian([2, 4, 0, 9], [2, 3, 2, 3], 2, 5, 8, "5.5")),
  'ex-4am-wadiya-idmajiya-ihsa-l5-008:q1': R(pctOf(60, 45)),
  'ex-4am-wadiya-idmajiya-ihsa-l5-008:q2': R(q(pctOf(60, 45)).div(3).toString()),
  'ex-4am-wadiya-idmajiya-ihsa-l5-009:q1': R(q(10).sub(3 + 2).toString()),
  'ex-4am-wadiya-idmajiya-ihsa-l5-009:q2': R(solve2(1, 1, 5, 2, 3, q("2.4").mul(10).sub(3 + 8).toString())[1]),
  'ex-4am-wadiya-idmajiya-ihsa-l5-009:q3': R(solve2(1, 1, 5, 2, 3, q("2.4").mul(10).sub(3 + 8).toString())[0]),
  'ex-4am-wadiya-idmajiya-ihsa-l5-010:q1': R(q(wholeFromPct(48, 75)).sub(48).toString()),
};
