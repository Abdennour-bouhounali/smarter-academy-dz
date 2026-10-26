/**
 * Les OPÉRATIONS sur les nombres relatifs (3AM, unité 1 « الأعداد النسبية », درس « جداء عددين نسبيين », 2026-10-26) —
 * arithmétique EXACTE (rationnels BigInt de `powers.js`, importés, jamais réécrits), sans virgule flottante. Module GRANDI
 * leçon par leçon (docs/sources/3am/unit1/plan/README.md) ; cette leçon (L1) ajoute : `parseRel`, `relText`, `relTex`,
 * `distance`, `productSign`, `times`, `repeatedSum`, `distributeCheck`. `relative.js` (2AM, centièmes) n'est PAS étendu :
 * son unité est le centième, et un produit de deux centièmes demande des dix-millièmes.
 *
 * Importé PAR CHEMIN (`@smarter-academy/core/arithmetic/relativeOps.js`), jamais par le barrel du cœur (BUNDLE_BOUNDARIES §4).
 */
import * as P from './powers.js';

/** Normalise un rationnel, un entier, un texte (powers.js n'exporte pas son `R`). */
const N = (x) => P.add(x, 0);

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** « −2,5 », « -2.5 », chiffres arabes-indiens, « 3/4 » → rationnel. Lève une erreur si illisible. */
export function parseRel(text) {
  const s = String(text)
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)))
    .replace(/[٫،]/g, ',')
    .replace(/[−–—]/g, '-');
  return P.parseRat(s);
}

/** Le dénominateur est de la forme 2ᵃ5ᵇ : le nombre s'écrit avec un nombre fini de décimales. */
export function isFiniteDecimal(r) {
  let d = N(r).d;
  while (d % 2n === 0n) d /= 2n;
  while (d % 5n === 0n) d /= 5n;
  return d === 1n;
}

function decimalDigits(r) {
  const { n, d } = N(r);
  const a = n < 0n ? -n : n;
  let k = 0;
  let scale = 1n;
  while ((a * scale) % d !== 0n) { scale *= 10n; k += 1; }
  const whole = (a * scale) / d;
  let s = String(whole).padStart(k + 1, '0');
  if (k > 0) s = `${s.slice(0, -k)},${s.slice(-k)}`;
  return s;
}

/** Texte d'affichage : virgule décimale et vrai signe moins (« −2,5 », « 12 ») ; « −1/3 » si non décimal. */
export function relText(r) {
  const p = N(r);
  const neg = p.n < 0n;
  const body = isFiniteDecimal(p) ? decimalDigits(p) : `${neg ? -p.n : p.n}/${p.d}`;
  return `${neg ? '−' : ''}${body}`;
}

/** LaTeX : « -2{,}5 », « 12 », « -\frac{1}{3} ». */
export function relTex(r) {
  const p = N(r);
  if (isFiniteDecimal(p)) return `${p.n < 0n ? '-' : ''}${decimalDigits(p).replace(',', '{,}')}`;
  return P.ratTex(p);
}

/** La distance à zéro (valeur absolue). */
export const distance = (a) => (P.sign(a) < 0 ? P.neg(a) : N(a));

/** −1 (signes différents), 1 (même signe), 0 (un facteur nul). */
export const productSign = (a, b) => (P.sign(a) * P.sign(b)) || 0;

/** Le produit exact. */
export const times = (a, b) => P.mul(a, b);

/**
 * La somme répétée a + a + … + a (n termes, n entier naturel ≥ 1) : la liste des sommes partielles. Le sens du produit a × n
 * pour n naturel ; le dernier terme est a × n.
 */
export function repeatedSum(a, n) {
  const k = Number(n);
  if (!Number.isInteger(k) || k < 1) throw new Error('n doit être un entier naturel non nul');
  const out = [];
  let acc = P.rat(0);
  for (let i = 0; i < k; i += 1) { acc = P.add(acc, a); out.push(acc); }
  return out;
}

/** L'argument de la règle des signes : k × b + k × (−b) = k × (b + (−b)) = k × 0 = 0. */
export function distributeCheck(k, b) {
  return { left: P.add(P.mul(k, b), P.mul(k, P.neg(b))), right: P.mul(k, 0) };
}

/* ── Leçon 2 « جداء عدة أعداد نسبية » (jidaa-ida-nisbiya, 2026-10-26) ─────────────────────────────────────────────── */

/** Un facteur peut être un rationnel, un entier ou un texte (« −0,5 »). */
const asRat = (x) => (typeof x === 'string' ? parseRel(x) : N(x));

/** Le produit exact d'une liste de facteurs (1 pour la liste vide). */
export function product(list) {
  return list.reduce((acc, x) => P.mul(acc, asRat(x)), P.rat(1));
}

/** Le nombre de facteurs strictement négatifs. */
export const negativesIn = (list) => list.filter((x) => P.sign(asRat(x)) < 0).length;

/** −1 si le nombre de facteurs négatifs est impair, 1 s'il est pair, 0 si un facteur est nul (le produit est nul). */
export function signByParity(list) {
  if (list.some((x) => P.sign(asRat(x)) === 0)) return 0;
  return negativesIn(list) % 2 === 1 ? -1 : 1;
}

/** Le nombre opposé (le symétrique par rapport à 0) : (−1) × a. */
export const opposite = (a) => P.mul(P.rat(-1), asRat(a));

/** Le carré a × a : jamais négatif. */
export const square = (a) => P.mul(asRat(a), asRat(a));

/** Les deux membres de k × a ± k × b = k × (a ± b) (op = '+' ou '-'). */
export function factorize(k, a, b, op = '+') {
  const [K, A, B] = [asRat(k), asRat(a), asRat(b)];
  const inner = op === '-' ? P.sub(A, B) : P.add(A, B);
  const split = op === '-' ? P.sub(P.mul(K, A), P.mul(K, B)) : P.add(P.mul(K, A), P.mul(K, B));
  return { split, factored: P.mul(K, inner) };
}
