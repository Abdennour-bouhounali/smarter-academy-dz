/**
 * Les FRACTIONS de 3AM, unité 2 « العمليات على الكسور والأعداد الناطقة » (2026-10-25) — arithmétique EXACTE en BigInt, au-dessus des rationnels de
 * `powers.js` (`rat`, `mul`, `div`, `eq`, `ratText`, `ratTex`, `parseRat` : importés, JAMAIS réécrits).
 *
 * `powers.js › rat` RÉDUIT toujours. Les labos et les exercices ont aussi besoin d'une écriture NON réduite (6/8 doit rester 6/8 sur une carte) : le couple
 * brut `{ n, d }` (BigInt, d > 0, jamais réduit) vit ici, à côté de `rat`.
 *
 * Ajouté par la leçon 1 `maqlub-qismat-kasrayn` : `raw`, `valueOf`, `rawTex`, `reciprocal`, `isReciprocalPair`, `divideFractions`,
 * `simplifyBeforeMultiply`, `gearTurns`, `teethFor` (le labo `gear-crank`). Les leçons suivantes de l'unité y ajoutent leurs fonctions (plan README).
 *
 * Importé PAR CHEMIN (`@smarter-academy/core/arithmetic/fractions3.js`), jamais par le barrel du cœur (BUNDLE_BOUNDARIES §3–§4).
 */
import { rat, parseRat, mul, div, eq, sign } from './powers.js';

const big = (x) => (typeof x === 'bigint' ? x : BigInt(x));
const abs = (x) => (x < 0n ? -x : x);
const gcdB = (a, b) => { a = abs(a); b = abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1n; };

/** Un couple NON réduit `{ n, d }` : d ≠ 0 (sinon exception), le dénominateur est rendu positif. `raw(6, 8)` reste 6/8. */
export function raw(n, d = 1) {
  let N = big(n); let D = big(d);
  if (D === 0n) throw new Error('dénominateur nul');
  if (D < 0n) { N = -N; D = -D; }
  return Object.freeze({ n: N, d: D });
}

const isRaw = (x) => x && typeof x === 'object' && 'n' in x && 'd' in x;

/** Toute entrée (naturel, « 0,8 », « 3/4 », rat, raw) → couple brut. Un décimal garde son dénominateur 10ᵏ : « 0,8 » → 8/10. */
export function toRaw(x) {
  if (isRaw(x)) return raw(x.n, x.d);
  if (typeof x === 'string') {
    const s = x.trim().replace(/−/g, '-').replace(/\s+/g, '').replace(',', '.');
    const m = /^([+-]?)(\d*)\.(\d+)$/.exec(s);
    if (m) return raw(BigInt(`${m[1]}${m[2] || '0'}${m[3]}`), 10n ** BigInt(m[3].length));
    const q = /^([+-]?\d+)\/([+-]?\d+)$/.exec(s);
    if (q) return raw(q[1], q[2]);
    return raw(parseRat(s).n, 1);
  }
  return raw(x, 1);
}

/** La valeur (rationnel irréductible de `powers.js`) d'un couple brut. */
export const valueOf = (x) => { const p = toRaw(x); return rat(p.n, p.d); };

/** LaTeX d'un couple brut, non réduit : « \frac{6}{8} » ; un dénominateur 1 s'écrit « 6 ». */
export function rawTex(x) {
  const p = toRaw(x);
  const body = p.d === 1n ? String(abs(p.n)) : `\\frac{${abs(p.n)}}{${p.d}}`;
  return p.n < 0n ? `-${body}` : body;
}

/** Texte « 6/8 » (ou « 6 ») d'un couple brut. */
export function rawText(x) { const p = toRaw(x); return p.d === 1n ? String(p.n) : `${p.n}/${p.d}`; }

/**
 * Le MIROIR (le mot de la leçon : مقلوب) d'un nombre non nul : naturel a → 1/a ; décimal « 0,8 » → 10/8 (la valeur est 5/4) ; fraction a/b → b/a. 0 n'a pas de inverse (exception).
 */
export function reciprocal(x) {
  const p = toRaw(x);
  if (p.n === 0n) throw new Error('0 n\'a pas de inverse');
  return raw(p.d, p.n);
}

/** Deux nombres sont-ils inverses l'un de l'autre : x · y = 1 ? (exact, sur les valeurs). */
export function isReciprocalPair(x, y) { return eq(mul(valueOf(x), valueOf(y)), 1); }

/**
 * a/b ÷ c/d = a/b × d/c. Retourne `{ product: [p, flip(q)], value }` : les deux facteurs écrits tels quels (non réduits) et la valeur réduite.
 * Diviser par 0 est refusé (exception).
 */
export function divideFractions(p, q) {
  const a = toRaw(p); const b = toRaw(q);
  if (b.n === 0n) throw new Error('division par 0');
  return { product: [a, reciprocal(b)], value: div(valueOf(a), valueOf(b)) };
}

/**
 * Simplifier AVANT de multiplier p × q (p = a/b, q = c/d) : on divise a et d par leur PGCD, c et b par le leur. Retourne
 * `{ cancels: [{ top, bottom, g }], after: { a, b, c, d }, result }` ; `result` est le produit (couple brut) des facteurs restants, donc irréductible
 * quand p et q le sont.
 */
export function simplifyBeforeMultiply(p, q) {
  const { n: a, d: b } = toRaw(p); const { n: c, d } = toRaw(q);
  const g1 = gcdB(a, d); const g2 = gcdB(c, b);
  const cancels = [];
  if (g1 > 1n) cancels.push({ top: 'a', bottom: 'd', g: g1 });
  if (g2 > 1n) cancels.push({ top: 'c', bottom: 'b', g: g2 });
  const after = { a: a / g1, b: b / g2, c: c / g2, d: d / g1 };
  return { cancels, after, result: raw(after.a * after.c, after.b * after.d) };
}

/**
 * Le labo `gear-crank` : un plateau de F dents et un pignon de R dents ; la chaîne avance de `teeth` dents. La pédale tourne de teeth/F tours et la roue
 * de teeth/R tours (rationnels réduits).
 */
export function gearTurns(F, R, teeth) {
  if (big(F) <= 0n || big(R) <= 0n) throw new Error('un plateau sans dents n\'entraîne rien');
  return { pedal: rat(big(teeth), big(F)), wheel: rat(big(teeth), big(R)) };
}

/** Le nombre de dents (rationnel) pour que la roue fasse `target` tours : target × R. Entier ⇔ le drapeau tombe pile sur une dent. */
export function teethFor(R, target) {
  if (big(R) <= 0n) throw new Error('un pignon sans dents n\'entraîne rien');
  return mul(valueOf(target), rat(big(R), 1));
}

export { sign };
