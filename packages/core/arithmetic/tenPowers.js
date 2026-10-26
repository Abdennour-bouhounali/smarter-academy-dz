/**
 * Les PUISSANCES DE 10 (3AM, unité 3 « القوى ذات أسس نسبية صحيحة », درس « قوى العدد 10 », 2026-10-26) — le module de maths
 * PARTAGÉ des quatre leçons de l'unité (قوى العدد 10 · قواعد الحساب على قوى العدد 10 · الكتابة العلمية ورتبة القدر · la
 * synthèse) ; chaque leçon y AJOUTE ses fonctions, personne ne le réécrit. Importé PAR CHEMIN
 * (`@smarter-academy/core/arithmetic/tenPowers.js`), jamais par le barrel du cœur (BUNDLE_BOUNDARIES §4).
 *
 * Arithmétique EXACTE en BigInt. Un décimal est `{ m, e }` (BigInt m, entier e) = m × 10ᵉ, m sans zéros finaux (zéro = `{0n, 0}`).
 * Les rationnels non décimaux passent par `powers.js › rat` (`toRat`).
 *
 * Ce que la leçon 1 (قوى العدد 10) ajoute :
 *   parseDec / decText            « 1 000 000 », « 0,000001 », « 45 × 10^3 », « −6,5 × 10^7 » ⇄ décimal ; `null` sinon
 *   pow10 / pow10Text / exponentOfPow10
 *   zerosOf / rankOfOne / zerosBeforeOne / zerosAfterComma    les comptes que le labo et les erreurs types utilisent
 *   pow10Name / nameToExponent / PREFIXES / prefixOf          noms (ألف … ألف مليار, جزء من …) et préfixes (كيلو … نانو)
 *   expanded / expandedTex        le مفكوك d'un décimal (rangs vides absents)
 *   timesPow10                    k × 10ⁿ (le décalage de la virgule, rappel de 1AM — pas la règle des produits)
 */
import { rat } from './powers.js';

const NBSP = ' ';
const abs = (x) => (x < 0n ? -x : x);

/* ── décimaux exacts ─────────────────────────────────────────────────────────────────────────────────────────────────── */

/** Normalise `m × 10ᵉ` : retire les zéros finaux de m. */
export function norm(m, e = 0) {
  let M = BigInt(m); let E = Number(e);
  if (M === 0n) return Object.freeze({ m: 0n, e: 0 });
  while (M % 10n === 0n) { M /= 10n; E += 1; }
  return Object.freeze({ m: M, e: E || 0 });
}

export const isZeroDec = (v) => v.m === 0n;
export const eqDec = (u, v) => u.m === v.m && u.e === v.e;
export const negDec = (v) => norm(-v.m, v.e);
/** Comparaison exacte (−1, 0, 1). */
export function compareDec(u, v) {
  const e = Math.min(u.e, v.e);
  const a = u.m * 10n ** BigInt(u.e - e);
  const b = v.m * 10n ** BigInt(v.e - e);
  return a < b ? -1 : a > b ? 1 : 0;
}
/** Le décimal en rationnel de `powers.js`. */
export function toRat(v) {
  return v.e >= 0 ? rat(v.m * 10n ** BigInt(v.e), 1n) : rat(v.m, 10n ** BigInt(-v.e));
}
/** k × 10ⁿ : décale la virgule de n rangs (rappel 1AM). */
export const timesPow10 = (v, n) => norm(v.m, v.e + n);

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
function latin(text) {
  return String(text).replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d))).replace(/٫/g, ',').replace(/[−–—]/g, '-').replace(/[×✕·*]/g, '×')
    .replace(/[   ‎‏⁦-⁩]/g, ' ').replace(/\s+/g, ' ').trim();
}

function parsePlain(s) {
  const t = s.replace(/ /g, '');
  const m = /^(-)?(\d+)(?:[,.](\d+))?$/.exec(t);
  if (!m) return null;
  const frac = m[3] ?? '';
  const digits = BigInt(m[2] + frac);
  return norm(m[1] ? -digits : digits, -frac.length);
}

/**
 * « 1 000 000 » · « 0,000001 » · « -6,5 » · « 45 × 10^3 » · « 3,52 × 10^5 » · « 7 × 10^-2 » · « 10^-4 » → décimal exact ; `null` sinon.
 * Les groupes de trois chiffres (espaces) sont tolérés dans la partie entière uniquement.
 */
export function parseDec(text) {
  const s = latin(text).replace(/\^\{\s*(-?\d+)\s*\}/g, '^$1');
  const sci = /^(.*?)\s*×\s*10\s*\^\s*(-?\d+)$/.exec(s);
  if (sci) {
    const k = sci[1] === '' ? null : parseSpaced(sci[1]);
    return k === null ? null : timesPow10(k, Number(sci[2]));
  }
  const pw = /^(-)?10\s*\^\s*(-?\d+)$/.exec(s);
  if (pw) return pw[1] ? norm(-1n, Number(pw[2])) : norm(1n, Number(pw[2]));
  return parseSpaced(s);
}

function parseSpaced(s) {
  const [intPart, fracPart] = s.split(/[,.]/);
  if (fracPart !== undefined && /\s/.test(fracPart)) return null;
  if (/\s/.test(intPart.replace(/^-/, '')) && !/^-?\d{1,3}( \d{3})+$/.test(intPart)) return null;
  return parsePlain(s);
}

/**
 * L'écriture décimale. `group` (défaut true) : groupes de trois chiffres (U+00A0) dans la partie ENTIÈRE ; la partie
 * fractionnaire reste collée (« 0,000001 », comme le manuel). Moins typographique (−) pour un négatif.
 */
export function decText(v, { group = true } = {}) {
  if (v.m === 0n) return '0';
  const neg = v.m < 0n;
  const digits = String(abs(v.m));
  let intPart; let fracPart = '';
  if (v.e >= 0) intPart = digits + '0'.repeat(v.e);
  else {
    const k = -v.e;
    const padded = digits.padStart(k + 1, '0');
    intPart = padded.slice(0, padded.length - k);
    fracPart = padded.slice(padded.length - k);
  }
  const grouped = group ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP) : intPart;
  return `${neg ? '−' : ''}${grouped}${fracPart ? `,${fracPart}` : ''}`;
}

/* ── les puissances de 10 ───────────────────────────────────────────────────────────────────────────────────────────── */

export const pow10 = (n) => Object.freeze({ m: 1n, e: Number(n) });
export const pow10Text = (n, opts) => decText(pow10(n), opts);

/** n si le texte est l'écriture décimale de 10ⁿ (« 100 000 » → 5, « 0,0001 » → −4), `null` sinon (« 120 », « 6 000 000 », « −100 »). */
export function exponentOfPow10(text) {
  const v = parseDec(text);
  return v && v.m === 1n ? v.e : null;
}

/** n ≥ 0 : le nombre de zéros APRÈS le 1 dans 10ⁿ. */
export const zerosOf = (n) => {
  if (n < 0) throw new RangeError('zerosOf: n ≥ 0');
  return n;
};
/** n < 0 : la RANG du 1 après la virgule dans 10ⁿ (= −n). */
export const rankOfOne = (n) => {
  if (n >= 0) throw new RangeError('rankOfOne: n < 0');
  return -n;
};
/** n < 0 : le nombre de zéros AVANT le 1, le zéro des unités compris (= −n). */
export const zerosBeforeOne = (n) => {
  if (n >= 0) throw new RangeError('zerosBeforeOne: n < 0');
  return -n;
};
/** n < 0 : le nombre de zéros entre la virgule et le 1 (= −n − 1). */
export const zerosAfterComma = (n) => {
  if (n >= 0) throw new RangeError('zerosAfterComma: n < 0');
  return -n - 1;
};

/* ── les noms et les préfixes ───────────────────────────────────────────────────────────────────────────────────────── */

const NAME_POS = Object.freeze({
  0: 'واحد', 1: 'عشرة', 2: 'مئة', 3: 'ألف', 4: 'عشرة آلاف', 5: 'مئة ألف', 6: 'مليون', 7: 'عشرة ملايين', 8: 'مئة مليون',
  9: 'مليار', 10: 'عشرة ملايير', 11: 'مئة مليار', 12: 'ألف مليار',
});

/** « مليون » pour 6, « جزء من ألف » pour −3 … ; `null` hors de −12 … 12. */
export function pow10Name(n) {
  if (!Number.isInteger(n) || Math.abs(n) > 12) return null;
  return n >= 0 ? NAME_POS[n] : `جزء من ${NAME_POS[-n]}`;
}

/** Le contraire : un nom de la liste → l'exposant, `null` sinon (« ألف مليار » → 12, « جزء من مليار » → −9). Tolère « مائة ». */
export function nameToExponent(text) {
  const s = String(text).replace(/مائة/g, 'مئة').replace(/\s+/g, ' ').trim();
  for (let n = -12; n <= 12; n += 1) if (pow10Name(n) === s) return n;
  return null;
}

/** Les préfixes du système international (nom arabe tel qu'on le lit sur un cours de physique). */
export const PREFIXES = Object.freeze([
  { symbol: 'T', name: 'تيرا', exp: 12 },
  { symbol: 'G', name: 'جيغا', exp: 9 },
  { symbol: 'M', name: 'ميغا', exp: 6 },
  { symbol: 'k', name: 'كيلو', exp: 3 },
  { symbol: 'h', name: 'هكتو', exp: 2 },
  { symbol: 'da', name: 'ديكا', exp: 1 },
  { symbol: '', name: '', exp: 0 },
  { symbol: 'd', name: 'ديسي', exp: -1 },
  { symbol: 'c', name: 'سنتي', exp: -2 },
  { symbol: 'm', name: 'ميلي', exp: -3 },
  { symbol: 'µ', name: 'ميكرو', exp: -6 },
  { symbol: 'n', name: 'نانو', exp: -9 },
  { symbol: 'p', name: 'بيكو', exp: -12 },
].map(Object.freeze));
export const prefixOf = (exp) => PREFIXES.find((p) => p.exp === exp) ?? null;
export const prefixByName = (name) => PREFIXES.find((p) => p.name && p.name === String(name).trim()) ?? null;

/* ── le مفكوك ───────────────────────────────────────────────────────────────────────────────────────────────────────── */

/** Le développement en puissances de 10, du rang le plus haut au plus bas : 3985 → [{3,3},{9,2},{8,1},{5,0}] ; les rangs vides ABSENTS. Valeur positive. */
export function expanded(v) {
  if (v.m <= 0n) throw new RangeError('expanded: décimal strictement positif');
  const s = String(v.m);
  const out = [];
  for (let i = 0; i < s.length; i += 1) {
    const digit = Number(s[i]);
    if (digit !== 0) out.push({ digit, exp: v.e + (s.length - 1 - i) });
  }
  return out;
}
/** « 5\times10^{3}+3\times10^{1}+7\times10^{-2} » */
export function expandedTex(v) {
  return expanded(v).map((t) => `${t.digit}\\times10^{${t.exp}}`).join('+');
}
/** La somme des termes du développement, retrouvée exactement (contrôle). */
export function sumExpanded(terms) {
  const e = Math.min(...terms.map((t) => t.exp));
  const m = terms.reduce((acc, t) => acc + BigInt(t.digit) * 10n ** BigInt(t.exp - e), 0n);
  return norm(m, e);
}
