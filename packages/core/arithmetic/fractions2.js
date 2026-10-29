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
 * E2 — درس « جمع وطرح كسرين » (`jam-tarh-kusur`, labo `trail-odometer`) :
 *   isMultipleCase(b, d)            les deux dénominateurs sont-ils un cas de 2AM (l'un multiple de l'autre) ? { big, small, k } ou null ;
 *   rewriteTo(p, D)                 p = a/b écrit avec le dénominateur D (= toDenominator) ; refuse un D qui n'est pas un multiple de b ;
 *   sumMultipleCase(terms)          somme signée de termes `{ p, sign? }` dont UN dénominateur est multiple de tous les autres (garde 2AM : sinon exception) :
 *                                   { D, numerators[], total (brut), reduced: { n, d } } ; un résultat négatif est refusé ;
 *   complement(p, n = 1)            n − p, brut (sur le dénominateur de p), positif exigé.
 * Les nombres sont écrits « 15,96 » (virgule algérienne ou point) ; les valeurs rendues sont des `{ n, k }` de `decimals.js`.
 */
import * as D from './decimals.js';
import { raw, toRaw, toDenominator } from './fractions3.js';

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

/* ── E2 — جمع وطرح كسرين ─────────────────────────────────────────────────────────────────────── */

/** Le cas de 2AM : l'un des dénominateurs est un multiple de l'autre. */
export function isMultipleCase(b, d) {
  const x = big(b); const y = big(d);
  if (x <= 0n || y <= 0n) return null;
  const [bigD, small] = x >= y ? [x, y] : [y, x];
  return bigD % small === 0n ? { big: bigD, small, k: bigD / small } : null;
}

/** p = a/b écrit avec le dénominateur D (multiple de b, sinon exception). */
export function rewriteTo(p, Dn) { return toDenominator(p, Dn); }

/** Somme signée : terms = [{ p, sign: 1 | -1 }] ; le plus grand dénominateur doit être multiple de tous les autres (garde 2AM). */
export function sumMultipleCase(terms) {
  const items = terms.map((t) => ({ p: toRaw(t.p), s: t.sign === -1 ? -1n : 1n }));
  const Dn = items.reduce((m, t) => (t.p.d > m ? t.p.d : m), 1n);
  if (items.some((t) => Dn % t.p.d !== 0n)) throw new RangeError('fractions2.sumMultipleCase: hors du programme de 2AM (aucun dénominateur multiple de tous les autres)');
  const numerators = items.map((t) => t.s * t.p.n * (Dn / t.p.d));
  const total = numerators.reduce((a, b) => a + b, 0n);
  if (total < 0n) throw new RangeError('fractions2.sumMultipleCase: résultat négatif');
  const g = gcd(total, Dn) || 1n;
  return { D: Dn, numerators, total: raw(total, Dn), reduced: { n: total / g, d: Dn / g } };
}

/** n − p, brut (le dénominateur de p) ; positif exigé. */
export function complement(p, n = 1) {
  const x = toRaw(p);
  const num = big(n) * x.d - x.n;
  if (num < 0n) throw new RangeError('fractions2.complement: p dépasse n');
  return raw(num, x.d);
}
