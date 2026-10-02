// Oracle du banc « mada-wasit-mutawassit » (unité 8 « الإحصاء ») — chaque réponse RECALCULÉE ici en rationnels exacts
// (helpers.mjs), sans lire le contenu ni le code testé : moyenne, médiane (par tri), étendue, classe médiane
// (effectifs cumulés), écrites ci-dessous. Fusionné dans scripts/practice-answer-oracle.test.mjs. Généré avec
// le banc par le script de l'auteur (gen.mjs, scratchpad) ; ne pas éditer une entrée sans recalculer l'autre côté.
import { R, C, q } from './helpers.mjs';

const LETTERS = ['A', 'B', 'C', 'D'];
function pick(flags) {
  const ok = flags.map((f, i) => (f ? LETTERS[i] : null)).filter(Boolean);
  if (ok.length !== 1) throw new Error(`mada-wasit-mutawassit oracle: ${ok.length} options vraies`);
  return C(ok[0]);
}
const S = (arr) => ({ value: arr.join(', ') });
const cmp = (a, b) => { const d = q(a).sub(q(b)); return d.n < 0n ? -1 : d.n > 0n ? 1 : 0; };
const eq = (a, b) => cmp(a, b) === 0;
const lt = (a, b) => cmp(a, b) < 0;
const expand = (vals, freqs) => vals.flatMap((v, i) => Array(freqs ? freqs[i] : 1).fill(v));
const sorted = (vals, freqs) => expand(vals, freqs).map((v) => q(v)).sort(cmp);
const mean = (vals, freqs) => { const s = expand(vals, freqs); return s.reduce((a, v) => a.add(v), q(0)).div(s.length); };
const med = (vals, freqs) => { const s = sorted(vals, freqs); const n = s.length; return n % 2 ? s[(n - 1) / 2] : s[n / 2 - 1].add(s[n / 2]).div(2); };
const rng = (vals) => { const s = sorted(vals); return s[s.length - 1].sub(s[0]); };
/** La classe (1-based) qui contient le rang médian (N impair) — par effectifs cumulés. */
const medClass = (freqs) => { const N = freqs.reduce((a, f) => a + f, 0); const k = (N + 1) / 2; let c = 0; for (let i = 0; i < freqs.length; i++) { c += freqs[i]; if (c >= Math.ceil(k)) return i + 1; } return -1; };
const sq = (x) => q(x).mul(x).mul(3); // (k√3)² = 3k²
const OASIS = [40, 35, 34, 41, 48, 37, 35, 46, 37, 40];
const S15 = [3, 5, 4, 5, 11, 8, 10, 7, 4, 3, 10, 3, 4, 6, 7];
const Q6 = [13, 1, 4, 10, 12];
const K18 = [2, 4, 5, 6, 3]; // √12 = 2√3, √75 = 5√3, √27 = 3√3
const rngK = rng(K18);
const m0 = mean([2, 5, 10, 1], [5, 2, 1, 5]);
const mA = mean([18, 15, 16, 20], [2, 18, 6, 4]);
const wm = mean([36, 40, 44, 48, 52], [4, 10, 12, 9, 6]);
/** ex-13 : toutes les séries a ≤ 13 ≤ c (entiers 0…40) de médiane 13, étendue 8, moyenne 13. */
function solve13() { const out = []; for (let a = 0; a <= 13; a++) for (let c = 13; c <= 40; c++) if (c - a === 8 && eq(mean([a, 13, c]), 13)) out.push([a, 13, c]); if (out.length !== 1) throw new Error('ex-13'); return out[0]; }
/** now-97 : 5 diviseurs distincts de 225, < 46, moyenne 15,4, médiane 9, étendue 42 — balayage exhaustif. */
function solve97() {
  const D = []; for (let d = 1; d < 46; d++) if (225 % d === 0) D.push(d);
  const out = [];
  const rec = (start, acc) => { if (acc.length === 5) { if (eq(mean(acc), '15.4') && eq(med(acc), 9) && eq(rng(acc), 42)) out.push([...acc]); return; } for (let i = start; i < D.length; i++) rec(i + 1, [...acc, D[i]]); };
  rec(0, []);
  if (out.length !== 1) throw new Error('now-97'); return out[0];
}
/** (10·3 + 20n) / (3 + n) = 15 : balayage des effectifs entiers 1…50. */
function solveN() { const out = []; for (let n = 1; n <= 50; n++) if (eq(mean([10, 20], [3, n]), 15)) out.push(n); if (out.length !== 1) throw new Error('n'); return q(out[0]); }

export const ORACLE = {
  'ex-4am-mada-wasit-mutawassit-l1-001:q1': R(rng([30000, 35000, 40000, 45000, 50000, 60000, 75000])),
  'ex-4am-mada-wasit-mutawassit-l1-002:q1': R(mean([3, -3, 4, -2])),
  'ex-4am-mada-wasit-mutawassit-l1-003:q1': R(rng(["37.3", 39, 38, "38.7", "39.5"])),
  'ex-4am-mada-wasit-mutawassit-l1-004:q1': pick(["6", "6.9", "5.3"].map((v) => eq(v, rng(["8.1", "5.7", 3, "2.8"])))),
  'ex-4am-mada-wasit-mutawassit-l1-005:q1': pick(["30", "20", "40"].map((v) => eq(v, med([8, 20, 40, 60])))),
  'ex-4am-mada-wasit-mutawassit-l1-006:q1': R(med([4, 5, 11, 11, 15, 17, 23, 23, 25])),
  'ex-4am-mada-wasit-mutawassit-l1-007:q1': R(mean([2, 3, 3, 4, 8])),
  'ex-4am-mada-wasit-mutawassit-l1-008:q1': R(rng([12, 7, 19, 9])),
  'ex-4am-mada-wasit-mutawassit-l1-009:q1': R(med([14, 9, 12, 20, 11, 16, 10])),
  'ex-4am-mada-wasit-mutawassit-l1-010:q1': R(mean([3, 5, 2, 4, 6])),
  'ex-4am-mada-wasit-mutawassit-l2-001:q1': R(rng([18, 15, 16, 20])),
  'ex-4am-mada-wasit-mutawassit-l2-001:q2': R(rng([10, 18, 15, 20])),
  'ex-4am-mada-wasit-mutawassit-l2-002:q1': pick([eq("4.5", m0), eq("35/13", m0), eq("35/4", m0)]),
  'ex-4am-mada-wasit-mutawassit-l2-003:q1': R(med([42000, 35000, 55000, 42000, 60000, 50000, 35000, 42000, 50000, 65000, 35000])),
  'ex-4am-mada-wasit-mutawassit-l2-004:q1': R(q(97).add(1).div(2)),
  'ex-4am-mada-wasit-mutawassit-l2-005:q1': R(rng(OASIS)),
  'ex-4am-mada-wasit-mutawassit-l2-005:q2': R(mean(OASIS)),
  'ex-4am-mada-wasit-mutawassit-l2-006:q1': R(med([2, 5, 7, 7, 9, 12, 13, 13, 20, 22])),
  'ex-4am-mada-wasit-mutawassit-l2-007:q1': pick([lt(mean(Q6), med(Q6)), lt(med(Q6), mean(Q6)), eq(mean(Q6), med(Q6))]),
  'ex-4am-mada-wasit-mutawassit-l2-008:q1': R(mean([9, 11, 14], [3, 4, 3])),
  'ex-4am-mada-wasit-mutawassit-l2-009:q1': R(med([38, 39, 40, 41, 42], [2, 4, 5, 3, 1])),
  'ex-4am-mada-wasit-mutawassit-l2-010:q1': R(rng([-4, 3, 7, -1, 5])),
  'ex-4am-mada-wasit-mutawassit-l3-001:q1': pick([eq("17.25", mA), eq("482/30", mA), eq("482/4", mA)]),
  'ex-4am-mada-wasit-mutawassit-l3-002:q1': C("B") /* même moyenne exacte 482/30 ; l'étendue mesure la dispersion, pas la chaleur */,
  'ex-4am-mada-wasit-mutawassit-l3-003:q1': R(med(OASIS)),
  'ex-4am-mada-wasit-mutawassit-l3-004:q1': R(mean(S15)),
  'ex-4am-mada-wasit-mutawassit-l3-004:q2': R(med(S15)),
  'ex-4am-mada-wasit-mutawassit-l3-004:q3': R(rng(S15)),
  'ex-4am-mada-wasit-mutawassit-l3-005:q1': R(med([50, 51, 53, 54, 55, 56, 57, 58, 60], [11, 8, 12, 9, 6, 5, 2, 3, 1])),
  'ex-4am-mada-wasit-mutawassit-l3-006:q1': R(med([12, 8, 6, 10, 2, 4])),
  'ex-4am-mada-wasit-mutawassit-l3-006:q2': pick([[[6, 12, 18, 24, 30, 36]], [[21, 21, 21]], [[6, 12, 18, 21, 24, 30]]].map(([v]) => v.length === 6 && eq(med(v), q(3).mul(med([12, 8, 6, 10, 2, 4]))))),
  'ex-4am-mada-wasit-mutawassit-l3-007:q1': pick([[7, 7, 7, 7, 7, 7], [1, 3, 5, 7, 9, 11, 14], [4, 5, 6, 7, 8, 9, 10]].map((v) => v.length === 7 && eq(mean(v), 7))),
  'ex-4am-mada-wasit-mutawassit-l3-008:q1': pick([[2, 9, 1, 7, 3, 4, 8], [1, 3, 5, 7, 9, 11, 13], [5, 6, 7, 7, 8, 9]].map((v) => v.length === 7 && eq(med(v), 7))),
  'ex-4am-mada-wasit-mutawassit-l3-009:q1': R(mean([0, 1, 2, 3, 4], [2, 5, 6, 4, 3])),
  'ex-4am-mada-wasit-mutawassit-l3-010:q1': pick([1, 2, 3].map((k) => medClass([6, 9, 7, 3]) === k)),
  'ex-4am-mada-wasit-mutawassit-l4-001:q1': pick([eq(44, wm), eq("1816/41", wm), eq("1734/41", wm)]),
  'ex-4am-mada-wasit-mutawassit-l4-001:q2': pick([2, 3, 4].map((k) => medClass([4, 10, 12, 9, 6]) === k)),
  'ex-4am-mada-wasit-mutawassit-l4-002:q1': R(mean([...S15, 3, 43])),
  'ex-4am-mada-wasit-mutawassit-l4-002:q2': R(med([...S15, 3, 43])),
  'ex-4am-mada-wasit-mutawassit-l4-002:q3': R(rng([...S15, 3, 43])),
  'ex-4am-mada-wasit-mutawassit-l4-003:q1': R(med([54, 55, 56, 57, 58, 60], [12, 18, 10, 8, 9, 3])),
  'ex-4am-mada-wasit-mutawassit-l4-004:q1': pick([[2, 9, 16], [9, 16], [1, 9, 17]].map((v) => eq(mean(v), 9) && eq(rng(v), 16))),
  'ex-4am-mada-wasit-mutawassit-l4-005:q1': pick([[14, 17, 20], [11, 20, 20], [17, 20, 23]].map((v) => eq(med(v), 20) && eq(mean(v), 17))),
  'ex-4am-mada-wasit-mutawassit-l4-006:q1': pick([1, 2, 3].map((k) => medClass([5, 6, 14]) === k)),
  'ex-4am-mada-wasit-mutawassit-l4-007:q1': R(mean([12, 16, 20], [5, 10, 5])),
  'ex-4am-mada-wasit-mutawassit-l4-008:q1': R(q(13).mul(4).sub(12).sub(15).sub(9)),
  'ex-4am-mada-wasit-mutawassit-l4-009:q1': pick([lt(rng([9, 10, 10, 11]), rng([4, 8, 12, 16])), lt(rng([4, 8, 12, 16]), rng([9, 10, 10, 11])), false]),
  'ex-4am-mada-wasit-mutawassit-l4-010:q1': R(mean([30000, 32000, 35000, 36000, 300000])),
  'ex-4am-mada-wasit-mutawassit-l4-010:q2': R(med([30000, 32000, 35000, 36000, 300000])),
  'ex-4am-mada-wasit-mutawassit-l5-001:q1': S(solve13()),
  'ex-4am-mada-wasit-mutawassit-l5-002:q1': S(solve97()),
  'ex-4am-mada-wasit-mutawassit-l5-003:q1': pick([[2, 4, 8], [1, 2, 4], [4, 8, 12]].map((v) => eq(rng(v), mean(v)) && eq(mean(v), med(v)))),
  'ex-4am-mada-wasit-mutawassit-l5-004:q1': pick([eq(63, sq(rngK)), eq(48, sq(rngK)), eq(108, sq(rngK))]),
  'ex-4am-mada-wasit-mutawassit-l5-004:q2': pick([5, 3, 4].map((k) => eq(k, med(K18)))),
  'ex-4am-mada-wasit-mutawassit-l5-004:q3': pick([eq(4, mean(K18)), eq(20, mean(K18)), false /* √54 = 3√6 n'est pas un multiple rationnel de √3 */]),
  'ex-4am-mada-wasit-mutawassit-l5-005:q1': R(med([1, 2, 3, 4, 5], [6, 10, 12, 8, 4])),
  'ex-4am-mada-wasit-mutawassit-l5-006:q1': R(mean([6, 9, 11, 14, 45])),
  'ex-4am-mada-wasit-mutawassit-l5-006:q2': R(med([6, 9, 11, 14, 45])),
  'ex-4am-mada-wasit-mutawassit-l5-007:q1': R(q(9).mul(6).sub(q(8).mul(5))),
  'ex-4am-mada-wasit-mutawassit-l5-008:q1': R(solveN()),
  'ex-4am-mada-wasit-mutawassit-l5-009:q1': R(q(20).mul(12).add(q(30).mul(10)).div(50)),
  'ex-4am-mada-wasit-mutawassit-l5-010:q1': C("A") /* N = 11 → rang 6 = ancien rang 5 (une valeur ajoutée avant) = 20 */,
};
