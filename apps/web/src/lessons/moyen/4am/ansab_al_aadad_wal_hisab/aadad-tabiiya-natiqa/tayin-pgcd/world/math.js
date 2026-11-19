/**
 * The arithmetic of lesson `tayin-pgcd` — PURE. ONE definition of a divisor list, the common divisors and the PGCD, read
 * by the story, the practice ladder, the trainer, the knowledge page and their tests: no number of the lesson is typed
 * where it can be computed.
 *
 * The story's NUMBERS live here too (and `story.js` re-exports them): the bench of the first workshop (`inquiries.js ›
 * LISTS_BENCH`) is a part of the story's first segment, so `story.js` imports `inquiries.js` — which must then read the
 * numbers from a module that imports neither (no import cycle).
 */

/**
 * The numbers of the story — ONE place: the segments, the sentences, the tablets, the forges and the tests read them.
 * A convoy (GAME_WORLD.md §2ter-1): consecutive bridges built with the plank made in the workshop of its FIRST island,
 * a coin of the purse per plank laid whatever its length; `plank` = the one length in 1 … the longest gap that builds
 * every bridge of the convoy with its coins (`story.test.js` computes it).
 */
export const NUMBERS = {
  /** Islands A–C, key 📋: no plank is offered; 19 coins = 8 + 11 planks of 4 (with 2: 16 + 22; with 1: 76). */
  lists: { gaps: [32, 44], purse: 19, plank: 4 },
  /** The last step of forge 📋: a new pair, its lists typed (39 ; 65 was a pair of the exercise bank: replaced). */
  use: { gaps: [58, 87], plank: 29 },
  /** Islands C–E, key ⚡: two gaps of the same length; 2 coins — one plank of 27 for each. */
  same: { gaps: [27, 27], purse: 2, plank: 27 },
  /** Islands E–G, key ⚡: the second gap has 0 cells (its bridge stands from the start); 1 coin. */
  full: { gaps: [27, 0], purse: 1, plank: 27 },
  /** Islands G–I, key 🎯: the shorter gap's own length builds both; 5 coins = 1 + 4. */
  nest: { gaps: [19, 76], purse: 5, plank: 19 },
  /** For forge 🎯 (its agent decides): a pair where the shorter gap does NOT build the longer; 7 coins = 5 + 2 planks of 18. */
  against: { gaps: [90, 36], purse: 7, plank: 18 },
  /**
   * The last bridge: the harbour's two piers laid end to end (154 cells, then 238), ONE kind of plank for both, the
   * longest; the store offers 22 (it fills the first pier only) and 14; the price of one plank (دج).
   */
  boss: { piers: [154, 238], options: [22, 14], plank: 14, price: 90 },
};

/** PGCD(x ; y) by Euclid's remainders (x, y natural numbers, not both 0) — used to JUDGE, never shown as a method. */
export const gcd = (x, y) => (y ? gcd(y, x % y) : x);

/** Every divisor of n (n ≥ 1), smallest first. */
export function divisorsOf(n) {
  const out = [];
  for (let d = 1; d <= n; d += 1) if (n % d === 0) out.push(d);
  return out;
}

/** The divisors that x and y share, smallest first (x, y ≥ 1). */
export const commonDivisors = (x, y) => divisorsOf(Math.min(x, y)).filter((d) => x % d === 0 && y % d === 0);

/** « PGCD(a ; b) » as LaTeX (inside `$…$`). */
export const pgcdTex = (a, b) => `\\mathrm{PGCD}(${a} ; ${b})`;

/**
 * « 1 ، 2 ، 4 » — a list of numbers as an Arabic sentence writes it. A no-break space BEFORE each comma: a list that wraps
 * breaks only after a comma, never starts a line with « ، » (defects.md B6).
 */
export const listAr = (xs) => xs.join(' ، ');

/** Arabic number agreement: forms = [one, two, three to ten, eleven and more]. « قطعة واحدة », « قطعتان », « 5 قطع ». */
export const counted = (n, [one, two, few, many]) =>
  n === 1 ? one : n === 2 ? two : n >= 3 && n <= 10 ? `${n} ${few}` : `${n} ${many}`;
/** The coins of a purse (one per plank laid, whatever its length). */
export const COINS = ['قطعة واحدة', 'قطعتان', 'قطع', 'قطعة'];
/** What is left in the purse: « وبقيت في الكيس 11 قطعة », « ولم يبقَ في الكيس شيء ». */
export const coinsLeft = (n) => (n > 0 ? `وبقيت في الكيس ${counted(n, COINS)}` : 'ولم يبقَ في الكيس شيء');

/** « بقيت خانتان فارغتان », « بقيت 18 خانة فارغة »: the empty cells a plank leaves, with their agreement. */
export const emptyCells = (r) =>
  r === 1
    ? 'بقيت خانة واحدة فارغة'
    : r === 2
      ? 'بقيت خانتان فارغتان'
      : r >= 3 && r <= 10
        ? `بقيت ${r} خانات فارغة`
        : `بقيت ${r} خانة فارغة`;

/**
 * q planks of length b, with the verb that agrees: « لوح واحد طوله 27 يملأ », « لوحان طولهما 38 يملآن »,
 * « 4 ألواح طولها 19 تملأ », « 11 لوحًا طولها 4 تملأ ».
 */
export function planksFill(q, b) {
  if (q === 1) return `لوح واحد طوله ${b} يملأ`;
  if (q === 2) return `لوحان طولهما ${b} يملآن`;
  return `${q >= 3 && q <= 10 ? `${q} ألواح` : `${q} لوحًا`} طولها ${b} تملأ`;
}
/** q planks of length b, without a verb: « لوح واحد طوله 14 », « لوحان طولهما 14 », « 28 لوحًا طولها 14 ». */
export function planksOf(q, b) {
  if (q === 1) return `لوح واحد طوله ${b}`;
  if (q === 2) return `لوحان طولهما ${b}`;
  return `${q >= 3 && q <= 10 ? `${q} ألواح` : `${q} لوحًا`} طولها ${b}`;
}
