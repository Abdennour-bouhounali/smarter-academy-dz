/**
 * fractions2 — l'arithmétique des FRACTIONS de 2AM, unité 2 « الكسور والعمليات عليها » (درس après درس, 2026-10-28). Exacte (BigInt), importée PAR
 * CHEMIN (`@smarter-academy/core/arithmetic/fractions2.js`), jamais depuis le barrel du cœur. Elle s'appuie sur `decimals.js` (valeurs `{ n, k }`)
 * et ne refait ni `fractions3.js` ni `powers.js` ni `divisibility.js`.
 *
 * E1 — درس « الكسر: نسبة وحاصل قسمة وقيم مقرّبة » (`kasr-hasil-qisma`, labo `mooring-lines`) :
 *   clearDecimals(a, b)             « 4,2 / 0,35 » → { ka, kb, k, a10, b10 } : le plus petit k tel que 10^k·a et 10^k·b sont naturels (kb = rang qui
 *                                   rend le seul DIVISEUR naturel) — 4,2 / 0,35 = 420 / 35 ;
 *   decimalQuotientBracket(a, b, k) les deux valeurs approchées à 10^-k de a ÷ b (a, b décimaux, b ≠ 0) : { lo, hi, exact } ;
 *   fitsAtRank(a, b, q)             q est-il assez long ? b × q comparé à a, exactement : { product, verdict: 'fits' | 'exact' | 'over', gap } ;
 *   isDecimalQuotient(a, b)         le quotient est-il décimal (dénominateur réduit de la forme 2^i·5^j) ?
 * Les nombres sont écrits « 15,96 » (virgule algérienne ou point) ; les valeurs rendues sont des `{ n, k }` de `decimals.js`.
 */
import * as D from './decimals.js';

const big = (x) => BigInt(x);
const P10 = (k) => 10n ** big(k);
const gcd = (a, b) => { let x = a < 0n ? -a : a; let y = b < 0n ? -b : b; while (y) [x, y] = [y, x % y]; return x; };

const dec = (text) => {
  const v = typeof text === 'object' && text !== null && 'n' in text ? text : D.parse(String(text));
  if (!v) throw new RangeError(`fractions2: nombre décimal illisible « ${text} »`);
  return v;
};

/** Le plus petit k rendant a et b naturels après ×10^k ; `kb` : le rang du seul diviseur. */
export function clearDecimals(a, b) {
  const x = dec(a); const y = dec(b);
  if (y.n === 0) throw new RangeError('fractions2.clearDecimals: b ≠ 0');
  const kb = trimmedRank(y);
  const ka = trimmedRank(x);
  const k = Math.max(ka, kb);
  const to = (v) => Number(big(v.n) * P10(k) / P10(v.k));
  return { ka, kb, k, a10: to(x), b10: to(y) };
}
/** Le nombre de décimales réellement utiles (2,50 → 1). */
function trimmedRank(v) {
  let n = big(v.n); let k = v.k;
  while (k > 0 && n % 10n === 0n) { n /= 10n; k -= 1; }
  return k;
}

/** Les valeurs approchées à 10^-k, par défaut et par excès, de a ÷ b (décimaux, b ≠ 0). */
export function decimalQuotientBracket(a, b, k) {
  const { a10, b10 } = clearDecimals(a, b);
  const num = big(a10) * P10(k);
  const lo = num / big(b10);
  const exact = num % big(b10) === 0n;
  return { lo: D.make(Number(lo), k), hi: D.make(Number(exact ? lo : lo + 1n), k), exact };
}

/** b × q contre a, exactement. `gap` = |a − b·q| (reste, ou débordement). */
export function fitsAtRank(a, b, q) {
  const x = dec(a); const y = dec(b); const z = dec(q);
  const k = y.k + z.k;
  const prod = big(y.n) * big(z.n);              // 10^-k
  const ka = Math.max(k, x.k);
  const P = prod * P10(ka - k);
  const A = big(x.n) * P10(ka - x.k);
  const verdict = P < A ? 'fits' : P === A ? 'exact' : 'over';
  const diff = P < A ? A - P : P - A;
  return { product: D.make(Number(P), ka), verdict, gap: D.make(Number(diff), ka) };
}

/** Le quotient a ÷ b est décimal ssi son dénominateur réduit n'a que les facteurs 2 et 5. */
export function isDecimalQuotient(a, b) {
  const { a10, b10 } = clearDecimals(a, b);
  let d = big(b10) / gcd(big(a10), big(b10));
  for (const p of [2n, 5n]) while (d % p === 0n) d /= p;
  return d === 1n;
}
