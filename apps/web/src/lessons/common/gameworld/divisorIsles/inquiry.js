/**
 * THE INVESTIGATION of a rule forge in this world (PURE) — what the student does BEFORE any tile is offered, so that the
 * rule he writes afterwards is the name of something he saw. Each rule has its own nature (owner, 2026-11-17: « each rule
 * has its own nature and way of discovery »), so each kind is its own experiment; the screen is `Inquiry.jsx`.
 *
 *   pairs   « where does the search stop? » — planks are tried IN ORDER on one gap; a plank and its partner (gap ÷ plank,
 *           whole or not) walk toward each other on the strip and CROSS: after the crossing every partner is a plank that
 *           was already tried.
 *   chart   « what to read instead of dividing? » — a chart of gaps (a row per tens digit, a column per units digit); the
 *           student tests gaps one after the other with ONE plank, then chooses a LENS (what he looks at in a number) and
 *           the values of that lens he claims hold: the chart answers (a lit cell left out, a dark cell taken in).
 *   turn, cut           see `InquiryMoves.jsx`.
 *   join, stack         gaps PUT TOGETHER — glued (a + b), cut (a − b), or k copies of one gap (`InquiryCombine.jsx`).
 *   peel, letters       the piece left when b is peeled off a, then a claim on the table; a proof assembled from cards
 *                       (`InquiryProof.jsx`).
 *
 * Nothing here says a rule. The verdict is always a fact of the chart or of the strip.
 */

// ───────────────────────── pairs ─────────────────────────
/** One plank tried on a gap: its partner (a real number), whether the bridge holds, and whether the partner is BEHIND it. */
export function tryPlank(a, d) {
  const whole = a % d === 0;
  return { d, whole, q: whole ? a / d : null, partner: a / d, square: d * d, crossed: d * d > a };
}
/** The last plank that HAS to be tried: the last one whose partner is not behind it. */
export const lastNeeded = (a) => {
  let d = 1;
  while ((d + 1) * (d + 1) <= a) d += 1;
  return d;
};
/** How many planks of a gap would be MISSED by stopping after plank d (with their partners): 0 from `lastNeeded` on. */
export function missedBy(a, d) {
  const found = new Set();
  for (let k = 1; k <= d; k += 1)
    if (a % k === 0) {
      found.add(k);
      found.add(a / k);
    }
  let all = 0;
  for (let k = 1; k <= a; k += 1) if (a % k === 0) all += 1;
  return all - found.size;
}

// ───────────────────────── chart ─────────────────────────
const digitsOf = (n) => String(n).split('').map(Number);
/** What a student may LOOK AT in a number. `values`: every value the lens can show on a chart that starts at `from`. */
export const LENSES = {
  units: { of: (n) => n % 10, values: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
  tens: { of: (n) => Math.floor(n / 10) % 10, values: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
  sum: {
    of: (n) => digitsOf(n).reduce((s, x) => s + x, 0),
    values: (from) => Array.from({ length: 18 + (from ? 1 : 0) }, (_, i) => i + 1),
  },
  // the number written by the tens digit and the units digit: 16 for 316 (on the first chart it is the gap itself)
  last2: {
    of: (n) => n % 100,
    values: (from) => Array.from({ length: from ? 100 : 99 }, (_, i) => i + (from ? 0 : 1)),
  },
};
/** The hundred gaps of a chart: 1…99 on the first one (0 is no gap), then 100…199, 200…299. */
export const chartCells = (from = 0) => Array.from({ length: 100 }, (_, i) => from + i).filter((n) => n > 0);
export const holds = (n, b) => n % b === 0;
/** How many gaps from `lo` up to (not counting) `hi` the plank fills: what the chart lights, and rings, while it is filled. */
export const lightsIn = (b, lo, hi) => Math.max(0, Math.ceil(hi / b) - Math.ceil(Math.max(lo, 1) / b));

/**
 * A claim « the plank holds when this lens shows one of these values », put in front of the chart:
 *   intruders  dark cells the claim takes in (the lens does not separate, or a value is too many)
 *   orphans    lit cells the claim leaves out (a value is missing)
 */
export function judgeClaim(b, lens, values, from = 0) {
  const intruders = [];
  const orphans = [];
  for (const n of chartCells(from)) {
    const claimed = values.includes(LENSES[lens].of(n));
    if (claimed && !holds(n, b)) intruders.push(n);
    if (!claimed && holds(n, b)) orphans.push(n);
  }
  return { intruders, orphans, ok: values.length > 0 && intruders.length === 0 && orphans.length === 0 };
}
/**
 * What a claim takes in, as values of its lens. A plank says its claim in one of two ways (its `link`):
 *   equals   the lens shows one of the values he pressed              « رقم الآحاد · يساوي · 0 أو 5 »
 *   divides  the lens shows a number divisible by the one he pressed  « مجموع الأرقام · يقبل القسمة على · 9 »
 */
export const claimValues = (link, lens, picked, from = 0) =>
  link === 'divides' ? LENSES[lens].values(from).filter((v) => picked.some((k) => v % k === 0)) : picked;

// ───────────────────────── turn: the planks of a bridge, stacked into a wall and read the other way ─────────────────────────
/**
 * The cells of a bridge (gap a, planks of d) as a wall: one ROW per plank (`r`), `d` columns; the cells no plank covers
 * make a last, shorter row (`rest`). `heights[c]` = the cells of column c: the planks the wall gives when it is read the
 * other way — equal only when the bridge holds.
 */
export function wall(a, d) {
  const e = Math.floor(a / d);
  const rest = a % d;
  const cells = [];
  for (let r = 0; r < e; r += 1) for (let c = 0; c < d; c += 1) cells.push({ r, c, rest: false });
  for (let c = 0; c < rest; c += 1) cells.push({ r: e, c, rest: true });
  const heights = Array.from({ length: d }, (_, c) => e + (c < rest ? 1 : 0));
  return { a, d, e, rest, rows: e + (rest ? 1 : 0), cells, heights, even: rest === 0 };
}

// ───────────────────────── cut: how many planks — a whole number, or a piece to saw ─────────────────────────
/** Planks of b laid on a gap of a: the whole ones, and the cells of the piece that would have to be sawn from one more. */
export const pieceOf = (a, b) => ({ whole: Math.floor(a / b), piece: a % b, exact: a % b === 0 });
/** The exact quotient a ÷ b as a formula: a natural number, or a decimal (comma) — cut after two places with « … ». */
export function quotientTex(a, b) {
  const v = a / b;
  if (Number.isInteger(v)) return String(v);
  const two = Math.floor(v * 100) / 100;
  return `${String(two).replace('.', '{,}')}${Math.abs(two - v) > 1e-9 ? '\\dots' : ''}`;
}

// ───────────────────────── join: two gaps glued end to end, or the shorter cut off the longer ─────────────────────────
/**
 * Plank d on the gaps a and b, then on the gap they make together: glued (`sum`, a + b) or cut (`diff`, a − b, a ≥ b).
 * Every field is a FACT the world draws: the planks each gap takes, whether it is filled, and the piece the new gap leaves.
 */
export function joinOf(d, a, b, op) {
  if (op === 'diff' && b > a) throw new RangeError(`join: ${a} − ${b} is not a gap`);
  const value = op === 'sum' ? a + b : a - b;
  return {
    value,
    planksA: Math.floor(a / d),
    planksB: Math.floor(b / d),
    fillsA: a % d === 0,
    fillsB: b % d === 0,
    planks: Math.floor(value / d),
    rest: value % d,
    holds: value % d === 0,
  };
}

// ───────────────────────── stack: k copies of one gap, glued end to end ─────────────────────────
/** Plank d on k copies of the gap `base`: the whole gap, the planks it takes, the piece left. */
export function stackOf(d, base, k) {
  const total = k * base;
  return { total, planks: Math.floor(total / d), rest: total % d, holds: total % d === 0, fillsBase: base % d === 0 };
}

// ───────────────────────── peel: planks of b laid on a until a piece shorter than b is left ─────────────────────────
/** The gap a peeled by planks of b: every length left (a, a − b, a − 2b … r), how many planks (q) and the piece r < b. */
export function peelOf(a, b) {
  if (!(b > 0 && a >= b)) throw new RangeError(`peel: ${a} by ${b}`);
  const steps = [a];
  while (steps.at(-1) >= b) steps.push(steps.at(-1) - b);
  return { q: steps.length - 1, r: steps.at(-1), steps };
}
/** Does plank d fill the gap a, the gap b, the piece r left when b is peeled off a? (three facts of one row) */
export const fitsRow = (a, b, d) => ({ a: a % d === 0, b: b % d === 0, r: (a % b) % d === 0 });
/**
 * His claim « when a plank fills [the column(s) he chose], it fills the piece left », put in front of the table of every
 * round. `claim = { cols: ['a'] | ['b'] | ['a', 'b'], link: 'and' | 'or' }` (`link` counts only with two columns).
 *   taken      the rows his claim takes in (every row when no column is chosen)
 *   intruders  rows it takes in whose plank does NOT fill the piece — the only thing that refutes it
 *   orphans    rows whose plank fills the piece although the claim does not take them in (a fact; it refutes nothing)
 * `ok`: a column is chosen, at least one row is taken, and no row is an intruder.
 */
export function judgePeelClaim(rounds, claim) {
  const cols = claim?.cols ?? [];
  const takes = (f) => (cols.length > 1 && claim.link === 'or' ? cols.some((c) => f[c]) : cols.every((c) => f[c]));
  const rows = rounds.flatMap(({ a, b, candidates }) =>
    candidates.map((d) => ({ ...fitsRow(a, b, d), gap: a, bridge: b, d })),
  );
  const taken = rows.filter(takes);
  const intruders = taken.filter((f) => !f.r);
  const orphans = rows.filter((f) => f.r && !takes(f));
  return { taken, intruders, orphans, ok: cols.length > 0 && taken.length > 0 && intruders.length === 0 };
}

// ───────────────────────── letters: a proof assembled from cards ─────────────────────────
/**
 * Walks a proof in the order of `ids`: each card may use only what the statement (`given`) or a card ABOVE it introduced
 * (`card.needs` ⊆ what came before; `card.gives` is what it introduces). `{ ok, at, missing }`: `at` = the first card
 * that uses something not written yet, `missing` = what it uses (tokens of the lesson, e.g. « k′ »).
 */
export function checkProofOrder(cards, ids, given = []) {
  const byId = Object.fromEntries(cards.map((c) => [c.id, c]));
  const known = new Set(given);
  for (let i = 0; i < ids.length; i += 1) {
    const c = byId[ids[i]];
    const missing = (c.needs ?? []).filter((t) => !known.has(t));
    if (missing.length) return { ok: false, at: i, missing };
    for (const t of c.gives ?? []) known.add(t);
  }
  return { ok: true, at: -1, missing: [] };
}
/** The first sample of numbers on which a card's line is FALSE (`card.holdsOn(sample)`), or null: the world's answer to a line. */
export const refuteCard = (card, samples) => samples.find((s) => !card.holdsOn(s)) ?? null;
