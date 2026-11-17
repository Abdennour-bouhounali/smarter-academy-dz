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
};
/** The hundred gaps of a chart: 1…99 on the first one (0 is no gap), then 100…199, 200…299. */
export const chartCells = (from = 0) => Array.from({ length: 100 }, (_, i) => from + i).filter((n) => n > 0);
export const holds = (n, b) => n % b === 0;

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
/** The cell of a long gap on the chart: the gap made of its last two digits. */
export const cellOf = (n) => n % 100;
