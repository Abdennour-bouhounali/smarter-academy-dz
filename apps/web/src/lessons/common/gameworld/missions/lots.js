/**
 * THE SCENE « lots » of an integration mission (`docs/reports/INTEGRATION_LESSON_PLAN.md` §6) — PURE logic, no React.
 *
 * Two stocks are packed in lots. The student never hears « wrong »: the world BUILDS what he read — his misreadings too
 * — and what it builds looks unfair, wasteful or small. Two moments use this file:
 *   - `rehearse(conditions, stock)`: on a SMALL rehearsal stock (12 and 8 crates), the world packs by the conditions he
 *     placed on his model of the situation — and only by them;
 *   - `pack(n, stock)`: on the real stock, the world makes the `n` lots he computed and says what that leaves.
 * A condition is an id; the situation's data gives each one its sentence of the text.
 */
export const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/** Euclid's divisions of a by b, down to the remainder 0: `[{ a, b, q, r }]`. */
export function euclid(a, b) {
  const rows = [];
  let [x, y] = a >= b ? [a, b] : [b, a];
  while (y) {
    rows.push({ a: x, b: y, q: Math.floor(x / y), r: x % y });
    [x, y] = [y, x % y];
  }
  return rows;
}

/** What a model MUST hold for the lots to be the text's lots, and the two classic misreadings. */
export const NEEDED = ['all', 'sameA', 'sameB', 'most'];
export const MISREADINGS = ['equalAB', 'apart'];

const spread = (total, n) =>
  // an UNFAIR share of `total` between n lots: the first lots take more
  Array.from({ length: n }, (_, i) => Math.floor(total / n) + (i === 0 ? (total % n) + 1 : i === n - 1 ? -1 : 0));

/**
 * The rehearsal: the world packs a small stock `{ a, b }` by the conditions of HIS model. Returns the lots it made
 * (`[{ a, b }]`), what stays on the quay (`left`) and `outcome`, the name of what happened:
 *   'apart'    each lot holds one kind only            (he read « lots for one, lots for the other »)
 *   'equalAB'  as many of one kind as of the other     (he read « the same number » ACROSS the kinds): crates are left
 *   'unequal'  the lots do not hold the same thing     (a « the same number in every lot » is missing)
 *   'left'     identical lots, but crates stay         (« every crate goes » is missing)
 *   'few'      identical, nothing left, but few lots   (« the greatest number » is missing)
 *   'fair'     the text's lots
 */
export function rehearse(conditions, { a, b }) {
  const has = (id) => conditions.includes(id);
  const g = gcd(a, b);
  if (has('apart')) {
    const n = Math.max(2, g / 2);
    return {
      outcome: 'apart',
      lots: [
        ...Array.from({ length: n }, () => ({ a: a / n, b: 0 })),
        ...Array.from({ length: n }, () => ({ a: 0, b: b / n })),
      ],
      left: { a: 0, b: 0 },
    };
  }
  if (has('equalAB')) {
    const n = Math.min(a, b);
    return {
      outcome: 'equalAB',
      lots: Array.from({ length: n }, () => ({ a: 1, b: 1 })),
      left: { a: a - n, b: b - n },
    };
  }
  if (!has('sameA') || !has('sameB')) {
    const as = has('sameA') ? Array(g).fill(a / g) : spread(a, g);
    const bs = has('sameB') ? Array(g).fill(b / g) : spread(b, g);
    return { outcome: 'unequal', lots: as.map((x, i) => ({ a: x, b: bs[i] })), left: { a: 0, b: 0 } };
  }
  if (!has('all')) {
    const n = g - 1;
    return {
      outcome: 'left',
      lots: Array.from({ length: n }, () => ({ a: a / g, b: b / g })),
      left: { a: a / g, b: b / g },
    };
  }
  if (!has('most')) {
    const n = [2, 3, 5, 7].find((d) => g % d === 0 && d < g) ?? 1;
    return { outcome: 'few', lots: Array.from({ length: n }, () => ({ a: a / n, b: b / n })), left: { a: 0, b: 0 } };
  }
  return { outcome: 'fair', lots: Array.from({ length: g }, () => ({ a: a / g, b: b / g })), left: { a: 0, b: 0 } };
}

/**
 * The real stock packed in the `n` lots he computed: each lot takes ⌊a / n⌋ and ⌊b / n⌋, the rest stays on the quay.
 * `outcome`: 'left' (crates stay: n does not divide both), 'more' (identical lots, nothing left — but each lot could
 * still be split into `split` identical lots: n is not the greatest), 'most' (the greatest number of identical lots).
 */
export function pack(n, { a, b }) {
  const per = { a: Math.floor(a / n), b: Math.floor(b / n) };
  const left = { a: a - per.a * n, b: b - per.b * n };
  if (left.a || left.b) return { outcome: 'left', n, per, left, split: 1 };
  const split = gcd(per.a, per.b);
  return { outcome: split > 1 ? 'more' : 'most', n, per, left, split };
}

/**
 * The content of a lot as he typed it, on `n` lots of the real stock: 'short' (the stock does not reach: lots stay
 * empty), 'left' (crates stay on the quay), 'exact'.
 */
export function fill(n, per, { a, b }) {
  const need = { a: per.a * n, b: per.b * n };
  if (need.a > a || need.b > b) {
    const full = Math.min(per.a ? Math.floor(a / per.a) : n, per.b ? Math.floor(b / per.b) : n);
    return { outcome: 'short', full, empty: n - full, left: { a: 0, b: 0 } };
  }
  const left = { a: a - need.a, b: b - need.b };
  return { outcome: left.a || left.b ? 'left' : 'exact', full: n, empty: 0, left };
}
