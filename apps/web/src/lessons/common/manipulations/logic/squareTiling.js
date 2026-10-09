import { squareRoots } from '@smarter-academy/core';

const { squareDivisors, integerSqrt, reduce, simplifiedRootText } = squareRoots;

/**
 * square-tiling — LE CARRÉ DALLÉ (unité 2, leçons 4 et 5).
 *
 * Un carré d'aire n. L'élève étire k, le nombre de dalles par côté : le carré
 * est découpé en k × k dalles carrées, chacune d'aire b = n ÷ k². Le côté du
 * grand carré est fait de k côtés de dalle : √n = k × √b — c'est
 * √(k² × b) = √(k²) × √b (خاصية 1, معارف 4) sous les yeux.
 *
 * RÉSISTANCE : la dalle doit être un nombre naturel (le manuel : « a و b
 * عددان طبيعيان »). Si k² ne divise pas n, la dalle n'a pas d'aire entière —
 * le pavage est dessiné en pointillés et refusé, avec n ÷ k² lu exactement.
 *
 * Deux découvertes, selon le mode :
 *   product   (leçon 4) deux pavages justes avec k > 1 et un refus : le côté
 *             est TOUJOURS k × √b — la racine d'un produit est le produit des
 *             racines ;
 *   simplest  (leçon 5) le plus grand k juste ET un autre k juste : la dalle
 *             du plus grand k est la plus petite, et on ne peut plus la
 *             paver — « b أصغر ما يمكن ».
 */

export function init({ n, mode = 'product' }) {
  return { n, mode, k: null, tried: [] };
}

/** La règle : de 1 au plus grand k tel que k² ≤ n. */
export const range = (s) => ({ min: 1, max: Math.max(1, Math.floor(Math.sqrt(s.n))) });

export function canTile(s, k) {
  if (!Number.isInteger(k) || k < 1) return 'notNatural';
  if (k * k > s.n) return 'tooMany';
  return true;
}

/** Le pavage à k dalles par côté : { k, valid, b (si juste), frac (n ÷ k² réduit) }. */
export function tiling(n, k) {
  const valid = n % (k * k) === 0;
  const frac = reduce({ num: n, den: k * k });
  return { k, valid, b: valid ? n / (k * k) : null, frac };
}

export function tile(s, k) {
  if (canTile(s, k) !== true) return s;
  const t = tiling(s.n, k);
  return { ...s, k, tried: [...s.tried.filter((x) => x.k !== k), t].sort((a, b) => a.k - b.k) };
}

export const kmax = (s) => squareDivisors(s.n).at(-1);
export const validKs = (s) => squareDivisors(s.n);

export function discoveryReady(s) {
  const valid = s.tried.filter((t) => t.valid);
  if (s.mode === 'simplest') {
    const km = kmax(s);
    if (km === 1 || !valid.some((t) => t.k === km)) return false;
    // Le contraste : un autre pavage juste (k > 1) dont la dalle se pave encore
    // — ou, quand n n'a qu'un pavage non trivial (18, 8, 50 du manuel), un k
    // plus grand que km REFUSÉ : on ne peut pas aller plus loin.
    const others = validKs(s).filter((k) => k > 1 && k !== km);
    return others.length
      ? valid.some((t) => t.k !== km && t.k > 1)
      : s.tried.some((t) => !t.valid && t.k > km);
  }
  return valid.filter((t) => t.k > 1).length >= Math.min(2, validKs(s).length - 1) && s.tried.some((t) => !t.valid);
}

/** Le côté d'une dalle d'aire b, écrit : « 6 » (carré parfait) ou « \sqrt{7} ». */
export function tileSideTex(b) {
  const r = integerSqrt(b);
  return r != null ? String(r) : `\\sqrt{${b}}`;
}

/** L'égalité du pavage : \sqrt{288} = \sqrt{12^2 \times 2} = \sqrt{12^2} \times \sqrt{2} = 12\sqrt{2} (… = entier si b carré). */
export function equationTex(n, t) {
  if (!t.valid) return null;
  const { k, b } = t;
  const rb = integerSqrt(b);
  const parts = [`\\sqrt{${n}}`, `\\sqrt{${k}^2 \\times ${b}}`, `\\sqrt{${k}^2} \\times \\sqrt{${b}}`];
  if (rb != null) parts.push(`${k} \\times ${rb}`, String(k * rb));
  else parts.push(k === 1 ? `\\sqrt{${b}}` : `${k}\\sqrt{${b}}`);
  return parts.join(' = ');
}

/** n ÷ k² en LaTeX quand le pavage est refusé : \dfrac{72}{25} = 2{,}88 si décimal fini, sinon la fraction. */
export function refusedTex(n, k) {
  const { num, den } = reduce({ num: n, den: k * k });
  let d = den; while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5;
  const exact = d === 1 ? String(num / den).replace('.', '{,}') : null;
  return `${n} \\div ${k}^2 = \\dfrac{${num}}{${den}}${exact ? ` = ${exact}` : ''}`;
}

export const simplestText = (n) => simplifiedRootText(n);

/**
 * Le k PAR DÉFAUT à l'ouverture (jamais un essai, jamais écrit dans `tried`) :
 * 1, la dalle unité — un pavage trivial qui n'est ni un pavage cherché (k > 1)
 * ni le plus grand k. Si 1 EST le plus grand k (n sans facteur carré), on
 * ouvre sur 2 (refusé) pour ne pas donner la réponse.
 */
export function defaultK(s) {
  const r = range(s);
  return kmax(s) === 1 && r.max > 1 ? 2 : r.min;
}
