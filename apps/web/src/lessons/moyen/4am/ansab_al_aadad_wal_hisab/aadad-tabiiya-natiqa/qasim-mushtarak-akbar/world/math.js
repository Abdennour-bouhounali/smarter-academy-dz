/**
 * The arithmetic of lesson `qasim-mushtarak-akbar` — PURE. ONE definition of a divisor list, the common divisors and the
 * PGCD, read by the story, the practice ladder, the trainer, the knowledge page and their tests: no number of the lesson
 * is typed where it can be computed.
 */

/** PGCD(x ; y) by Euclid's remainders (x, y natural numbers, not both 0). */
export const gcd = (x, y) => (y ? gcd(y, x % y) : x);

/** Every divisor of n (n ≥ 1), smallest first. */
export function divisorsOf(n) {
  const out = [];
  for (let d = 1; d <= n; d += 1) if (n % d === 0) out.push(d);
  return out;
}

/** The divisors that x and y share, smallest first. */
export const commonDivisors = (x, y) => divisorsOf(Math.min(x, y)).filter((d) => x % d === 0 && y % d === 0);

/**
 * « 1 ، 2 ، 3 » — a list of numbers as an Arabic sentence writes it. A no-break space BEFORE each comma: a list that wraps
 * breaks only after a comma, never starts a line with « ، » (GAME_WORLD.md « A list never starts a line with its comma »).
 */
export const listAr = (xs) => xs.join('\u00a0، ');

/** Arabic number agreement: forms = [one, two, three to ten, eleven and more]. « باقة واحدة », « باقتان », « 8 ورود ». */
export const counted = (n, [one, two, few, many]) =>
  n === 1 ? one : n === 2 ? two : n >= 3 && n <= 10 ? `${n} ${few}` : `${n} ${many}`;
export const BOUQUETS = ['باقة واحدة', 'باقتان', 'باقات', 'باقة'];
export const ROSES = ['وردة واحدة', 'وردتان', 'ورود', 'وردة'];
export const LILIES = ['زنبقة واحدة', 'زنبقتان', 'زنبقات', 'زنبقة'];
export const DATES = ['تمرة واحدة', 'تمرتان', 'تمرات', 'تمرة'];
/** « بقيت خانتان فارغتان », « بقيت 12 خانة فارغة »: the empty cells a plank leaves, with their agreement. */
export const emptyCells = (r) =>
  r === 1
    ? 'بقيت خانة واحدة فارغة'
    : r === 2
      ? 'بقيت خانتان فارغتان'
      : r >= 3 && r <= 10
        ? `بقيت ${r} خانات فارغة`
        : `بقيت ${r} خانة فارغة`;
export const FIGS = ['تينة واحدة', 'تينتان', 'تينات', 'تينة'];
/** The coins of a purse (one per plank laid, whatever its length): « قطعة واحدة », « قطعتان », « 4 قطع », « 38 قطعة ». */
export const COINS = ['قطعة واحدة', 'قطعتان', 'قطع', 'قطعة'];
