import * as squareRoots from '@smarter-academy/core/arithmetic/squareRoots.js';

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

/* ══════════════ Lecteur de mission (rollout 2026-11-10, unité 2 leçon 4 ; conseil du 2026-11-10) ══════════════
 * Tout ce que le lecteur AFFICHE est construit ici, en fonctions pures : les questions du labo (SquareTiling.jsx › QUESTIONS) les lisent,
 * et le test du contenu (`shownValues`) balaie les MÊMES valeurs contre les nombres interdits de la مسألة — jamais une copie à part.
 */

/** La vérité d'une prédiction « هل يعطي k = … بلاطًا مساحته عدد طبيعي؟ ». */
export const tilesWhole = (n, k) => Number.isInteger(k) && k >= 1 && k * k <= n && n % (k * k) === 0;
/** Les k > 1 qui donnent un pavage juste. */
export const validBig = (s) => validKs(s).filter((k) => k > 1);
/** Le décompte affiché « ✓ … · ✗ … » : pavages justes (k > 1) et pavages refusés que l'élève a faits. */
export const tally = (s) => ({ ok: s.tried.filter((t) => t.valid && t.k > 1).length, ko: s.tried.filter((t) => !t.valid).length });

/**
 * L'ONBOARDING (LabCoach, §8quater) : la poignée de k, puis un autre essai sur la règle — JAMAIS un k précis (le guide ne montre pas la
 * réponse : propriétaire du conseil, 2026-11-10). Plus rien une fois la découverte atteinte.
 */
export function coachOf(s) {
  if (!s || discoveryReady(s)) return null;
  if (s.tried.length === 0) return { id: 'drag', target: '[data-tiling-handle]', gesture: 'drag' };
  if (s.tried.length === 1) return { id: 'again', target: '[data-tiling-ruler]', gesture: 'tap' };
  return null;
}

/** Le côté d'une dalle d'aire b, en texte : « 3 » (carré parfait) ou « √3 ». */
export const rootText = (b) => { const r = integerSqrt(b); return r != null ? String(r) : `√${b}`; };
/** Le quotient n ÷ k² d'un pavage refusé, NON réduit (lecteur) : exact, et sans faire surgir un autre nombre (98 ÷ 36, jamais 49/18). */
export const refusedPlain = (n, k) => `${n} ÷ ${k * k}`;
export const refusedPlainTex = (n, k) => `${n} \\div ${k}^2 = \\dfrac{${n}}{${k * k}}`;

const uniqStr = (xs) => [...new Set(xs.map(String))];
/** « مساحة البلاطة؟ » : la vraie aire b, puis deux aires FAUSSES qui ne sont jamais un nombre de dalles (b × k, b + k, sinon 2b). */
export function areaOptions(n, k) {
  const b = n / (k * k);
  const wrong = uniqStr([b * k, b + k, 2 * b, b + 1]).filter((x) => x !== String(b) && x !== String(k * k));
  return [String(b), ...wrong.slice(0, 2)];
}
/** « الضلع؟ » : k × √b, k² × √b, √b × √b — en texte (k × √b juste). */
export function sideOptions(n, k) {
  const b = n / (k * k); const r = rootText(b);
  const right = `${k} × ${r}`;
  // n = k⁴ : √b = k, et « √b × √b » serait la bonne réponse écrite deux fois — on prend alors l'autre erreur, la somme
  const self = `${r} × ${r}`;
  return { right, wrongSquare: `${k * k} × ${r}`, wrongSelf: self === right ? `${k} + ${r}` : self };
}
/** Fait tourner une liste d'un nombre de crans tiré de `seed` (déterministe) : la bonne réponse ne garde pas toujours la même place. */
export function spin(list, seed) {
  const n = list.length;
  if (n < 2) return list;
  const s = ((Math.round(seed) % n) + n) % n;
  return [...list.slice(s), ...list.slice(0, s)];
}
/** BÂTIR « √n = k × √b » : les tuiles k, √b et la tuile de trop k² (« 9 × √3 » pour 27). */
export function tileBuildOf(n, k) {
  const b = n / (k * k);
  return { expected: [String(k), rootText(b)], tiles: [rootText(b), String(k * k), String(k)] };
}
/** Le PONT de la manche 2 : « √(k² × b) = √(k²) × … » → √b (choix : √b, b, k). */
export function bridgeOptions(n, k) {
  const b = n / (k * k);
  return { expected: rootText(b), options: uniqStr([rootText(b), b, k]) };
}
/** Le QUOTIENT de la manche 3 : « √b = √(n ÷ …) » → k² (choix : k², k, 2k). */
export function quotientOptions(n, k) {
  return { expected: String(k * k), options: uniqStr([k * k, k, 2 * k]) };
}
/**
 * (simplest, leçon 5) BÂTIR « √n = k × √m » avec le plus grand k : les tuiles km, √m, et la paire de trop — un k plus petit qui pave et la
 * racine de SA dalle, plus grande (pour 32 : 4 × √2 juste, 2 et √8 de trop). Sans autre pavage juste : 1 et √n.
 */
export function simplestBuildOf(s) {
  const km = kmax(s); const m = s.n / (km * km);
  const ko = validBig(s).filter((k) => k !== km)[0] ?? 1;
  const bo = s.n / (ko * ko);
  return { km, m, ko, bo, expected: [String(km), rootText(m)], tiles: [String(ko), rootText(m), rootText(bo), String(km)] };
}

/**
 * Tout ce qu'un écran du lecteur peut montrer pour un carré d'aire n : chaque aire de dalle, chaque côté « k√b », chaque quotient refusé,
 * les choix et les tuiles des questions, les k des prédictions. Le test de contenu y cherche les nombres interdits de la مسألة.
 */
export function shownValues(n, { predictKs = [] } = {}) {
  const s = init({ n });
  const out = [String(n), `√${n}`];
  for (let k = 1; k <= range(s).max; k += 1) {
    const t = tiling(n, k);
    out.push(String(k));
    if (t.valid) {
      out.push(String(t.b), rootText(t.b), `${k}${rootText(t.b)}`, `${k} × ${rootText(t.b)}`);
      if (k > 1) {
        const so = sideOptions(n, k);
        out.push(...areaOptions(n, k), so.right, so.wrongSquare, so.wrongSelf, ...tileBuildOf(n, k).tiles, ...bridgeOptions(n, k).options, ...quotientOptions(n, k).options);
      }
    } else out.push(refusedPlain(n, k), String(n), String(k * k));
  }
  if (validBig(s).length) out.push(...simplestBuildOf(s).tiles);
  out.push(...predictKs.map(String));
  return uniqStr(out);
}
