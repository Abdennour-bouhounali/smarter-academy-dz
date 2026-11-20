/**
 * THE SCENE « lots » of an integration mission (`docs/reports/INTEGRATION_LESSON_PLAN.md` §8) — PURE logic, no React.
 *
 * The rule of a mission: ONE SENTENCE OF THE EXAM TEXT ↔ ONE LINE OF NUMBERS. Whatever the student types, the depot
 * carries it out and this file says the line it writes — never « wrong »: what the depot built looks unfair, wasteful
 * or small, and the numbers say why. Two stocks (`{ a, b }`) are dealt into lots.
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

/** `total = n × q + r`: what dealing `total` things into `n` lots gives each lot and leaves. */
export const line = (total, n) => ({ a: total, b: n, q: Math.floor(total / n), r: total % n });

/**
 * He types a number of lots `n`: each stock is dealt into n lots — two lines — and what does not fit stays on the red
 * mat. `outcome`: 'left' (crates stay), 'more' (identical lots, nothing left, but a lot could still be split into
 * `split` identical lots: more houses could be served), 'most' (the greatest number of identical lots).
 */
export function deal(n, { a, b }) {
  const la = line(a, n);
  const lb = line(b, n);
  const per = { a: la.q, b: lb.q };
  const left = { a: la.r, b: lb.r };
  if (left.a || left.b) return { n, lines: [la, lb], per, left, split: 1, outcome: 'left' };
  const split = gcd(per.a, per.b);
  return { n, lines: [la, lb], per, left, split, outcome: split > 1 ? 'more' : 'most' };
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

/**
 * A division he typed in its shape, `a = b × q + r`: `null` when it is the Euclidean division; otherwise the fact that
 * shows it is not — the product he wrote, or a remainder that is not smaller than the divisor.
 */
export function slip(a, b, q, r) {
  if (b * q + r !== a) return { kind: 'sum', value: b * q + r };
  if (r >= b) return { kind: 'rest', value: r };
  return null;
}
