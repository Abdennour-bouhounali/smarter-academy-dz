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
 * Ajouté par la leçon 2 `tasawi-muqaranat-kasrayn` (2026-10-26) : `crossProducts`, `sameFraction`, `compareFractions`, `lcm`, `commonMultiples`, `toDenominator`, `missingTerm`,
 * `matchNumerator`, `shadeVerdict`, `unitsDigitOfProduct` (le labo `shade-match`).
 *
 * Ajouté par la leçon 3 `jam-tarh-kasrayn` (2026-10-26) : `isCommonMultiple`, `smallestCommonMultiple`, `multiplesUntil`, `cellsOf`, `sumWith`, `widestUnit`,
 * `zoneEnds` (le labo `seed-rake`) : sommes et différences de fractions POSITIVES par un dénominateur commun.
 *
 * Importé PAR CHEMIN (`@smarter-academy/core/arithmetic/fractions3.js`), jamais par le barrel du cœur (BUNDLE_BOUNDARIES §3–§4).
 */
import { rat, parseRat, mul, div, eq, sign, add, sub } from './powers.js';

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

/* ── Leçon 2 `tasawi-muqaranat-kasrayn` (2026-10-26) : l'égalité et la comparaison de deux fractions POSITIVES ─────────────────────────────────── */

const lcmB = (a, b) => (a / gcdB(a, b)) * b;

/** Les DEUX produits en croix de a/b et c/d : `left = a × d`, `right = b × c`. Les entrées sont des couples bruts (ou tout ce que `toRaw` lit), dénominateurs > 0. */
export function crossProducts(p, q) {
  const x = toRaw(p); const y = toRaw(q);
  return { left: x.n * y.d, right: x.d * y.n };
}

/** a/b = c/d ⇔ a × d = b × c (exact, les deux sens ne sont qu'une seule égalité). */
export function sameFraction(p, q) { const { left, right } = crossProducts(p, q); return left === right; }

/** −1 si p < q, 0 si égaux, 1 si p > q — par les produits en croix (dénominateurs positifs, car `raw` rend le dénominateur positif). */
export function compareFractions(p, q) {
  const { left, right } = crossProducts(p, q);
  return left === right ? 0 : left < right ? -1 : 1;
}

/** Le plus petit multiple commun non nul de deux naturels. */
export function lcm(a, b) {
  const x = abs(big(a)); const y = abs(big(b));
  if (x === 0n || y === 0n) throw new Error('multiple commun de 0');
  return lcmB(x, y);
}

/** Les `count` premiers multiples communs non nuls de b et d : le plus petit, puis ses multiples (le produit b × d en est un). */
export function commonMultiples(b, d, count = 3) {
  const m = lcm(b, d);
  return Array.from({ length: count }, (_, i) => m * BigInt(i + 1));
}

/** Écrit p = a/b avec le dénominateur D (multiple de b, sinon exception) : `{ k, n, d }` avec n = a × k, d = D, k = D / b. */
export function toDenominator(p, D) {
  const { n, d } = toRaw(p);
  const T = big(D);
  if (T <= 0n || T % d !== 0n) throw new Error(`${D} n'est pas un multiple de ${d}`);
  const k = T / d;
  return Object.freeze({ k, n: n * k, d: T });
}

/**
 * Le terme manquant de a/b = c/d. `terms` = [a, b, c, d] avec UN `null` (ou `undefined`). Retourne le rationnel exact (de `powers.js`) ; une division par 0
 * (b ou d inconnu et l'autre produit nul, ou b = 0 / d = 0 donnés) est refusée (exception).
 */
export function missingTerm(terms) {
  const holes = terms.map((t, i) => (t == null ? i : -1)).filter((i) => i >= 0);
  if (holes.length !== 1) throw new Error('un seul terme manque');
  const [a, b, c, d] = terms.map((t) => (t == null ? null : big(t)));
  const at = holes[0];
  // a × d = b × c
  if ((at !== 1 && b === 0n) || (at !== 3 && d === 0n)) throw new Error('dénominateur nul');
  if (at === 0) return rat(b * c, d);
  if (at === 1) { if (c === 0n) throw new Error('b indéterminé'); return rat(a * d, c); }
  if (at === 2) return rat(a * d, b);
  if (a === 0n) throw new Error('d indéterminé');
  return rat(b * c, a);
}

/**
 * Le labo `shade-match` : la référence a/b est dans un seau, B reçoit d mesures de blanc et c mesures de bleu (c entier ≥ 0). Quel c fait c/d = a/b ?
 * c = a × d / b : `exact` ⇔ c entier. Sinon `below` = ⌊a·d/b⌋ (trop clair) et `above` = below + 1 (trop foncé). Retourne aussi `value` (le rationnel a·d/b).
 */
export function matchNumerator(a, b, d) {
  const A = big(a); const B = big(b); const D = big(d);
  if (A < 0n || B <= 0n || D <= 0n) throw new Error('référence ou blanc invalide');
  const value = rat(A * D, B);
  const exact = value.d === 1n;
  const below = (A * D) / B;
  return Object.freeze({ exact, c: exact ? below : null, below, above: exact ? below : below + 1n, value });
}

/**
 * Le verdict d'une dose de bleu : le seau B (c bleus pour d blancs) contre la référence a/b — sur le signe de c × b − a × d.
 * 'lighter' (c × b < a × d : moins de bleu par blanc), 'match', 'darker'. `gap` = c × b − a × d (BigInt, signé).
 */
export function shadeVerdict(a, b, c, d) {
  const gap = big(c) * big(b) - big(a) * big(d);
  return { verdict: gap < 0n ? 'lighter' : gap === 0n ? 'match' : 'darker', gap };
}

/** Le dernier chiffre (l'unité) d'un produit de deux naturels, sans calculer le produit : (a mod 10)(b mod 10) mod 10. */
export function unitsDigitOfProduct(a, b) { return Number(((big(a) % 10n) * (big(b) % 10n)) % 10n); }

/* ── Leçon 3 `jam-tarh-kasrayn` (2026-10-26) : somme et différence de fractions POSITIVES par un dénominateur commun ─────────────────────────────── */

const posRaw = (x) => { const p = toRaw(x); if (p.n < 0n) throw new Error('fraction négative'); return p; };

/** N est-il un multiple commun (non nul) de tous les dénominateurs `dens` (naturels) ? */
export function isCommonMultiple(N, dens) {
  const n = big(N);
  return n > 0n && dens.every((d) => n % big(d) === 0n);
}

/** Le plus petit multiple commun non nul d'une liste de dénominateurs (naturels ≥ 1). */
export function smallestCommonMultiple(dens) {
  if (!dens.length) throw new Error('aucun dénominateur');
  return dens.map(big).reduce((m, d) => lcm(m, d));
}

/**
 * La méthode du livre pour le plus petit multiple commun de deux dénominateurs : on énumère les multiples du PLUS GRAND jusqu'au premier qui est
 * divisible par l'autre. Retourne `{ larger, other, list: [bigint…], lcm }` (la liste finit par le plus petit multiple commun).
 */
export function multiplesUntil(a, b) {
  const x = big(a); const y = big(b);
  if (x <= 0n || y <= 0n) throw new Error('dénominateur invalide');
  const [larger, other] = x >= y ? [x, y] : [y, x];
  const list = [];
  for (let m = larger; ; m += larger) { list.push(m); if (m % other === 0n) return Object.freeze({ larger, other, list, lcm: m }); }
}

/**
 * Le nombre de cases de largeur 1/N dans la fraction p (positive) : `{ whole, count, cells }` — `cells` = p × N (rationnel exact), `count` = p × N si entier
 * (sinon null). Une zone de largeur p est remplie de plants entiers ⇔ `whole`.
 */
export function cellsOf(p, N) {
  const x = posRaw(p); const n = big(N);
  if (n <= 0n) throw new Error('N doit être ≥ 1');
  const cells = rat(x.n * n, x.d);
  const whole = cells.d === 1n;
  return Object.freeze({ whole, count: whole ? cells.n : null, cells });
}

/** Les extrémités (rationnels exacts, croissantes depuis 0 sauf une récolte) des zones d'une somme algébrique : `terms` = [{ p, sub? }] ; une zone `sub` retire sa largeur de la fin. */
export function zoneEnds(terms) {
  let total = rat(0, 1);
  const out = [];
  for (const t of terms) {
    const w = valueOf(posRaw(t.p));
    const before = total;
    total = t.sub ? sub(total, w) : add(total, w);
    if (sign(total) < 0) throw new Error('résultat négatif : hors de cette leçon');
    out.push(Object.freeze({ from: t.sub ? total : before, to: t.sub ? before : total, sub: !!t.sub }));
  }
  return Object.freeze({ zones: out, total });
}

/**
 * Planter à l'espacement 1/N : chaque zone doit contenir un nombre ENTIER de cases. `terms` = [{ p, sub? }] (fractions positives, la dernière zone peut être une
 * récolte). Retourne `{ ok, counts: [bigint|null…], signed: bigint|null (le nombre net de plants), total (rationnel), borderAt: index de la 1re zone qui tombe en
 * travers d'une case (ou -1), cells }`. Aucun flottant.
 */
export function sumWith(terms, N) {
  const { zones, total } = zoneEnds(terms);
  const cells = terms.map((t) => cellsOf(t.p, N));
  const borderAt = cells.findIndex((c) => !c.whole);
  const ok = borderAt < 0;
  let signed = null;
  if (ok) signed = cells.reduce((acc, c, i) => acc + (terms[i].sub ? -c.count : c.count), 0n);
  return Object.freeze({ ok, counts: cells.map((c) => c.count), signed, total, borderAt, zones });
}

/** Le plus petit N ≤ maxN qui convient (le plus large espacement 1/N) ou null : un multiple commun des dénominateurs des zones. */
export function widestUnit(dens, maxN = 60) {
  const m = smallestCommonMultiple(dens);
  return m <= big(maxN) ? m : null;
}

export { sign };
