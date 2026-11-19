/**
 * The arithmetic of lesson `bahth-pgcd` — PURE. ONE definition of the PGCD, of the two algorithms (the subtractions and
 * Euclid's divisions) and of the Arabic agreement of the counted words, read by the story, the practice ladder, the
 * trainer, the knowledge page and their tests: no number of the lesson is typed where it can be computed.
 *
 * The story's NUMBERS live here too (and `story.js` re-exports them): the benches of the workshops (`inquiries.js`) are
 * parts of the story's segments, so `story.js` imports `inquiries.js` — which must then read the numbers from a module
 * that imports neither (no import cycle).
 */

/**
 * The numbers of the story — ONE place: the segments, the sentences, the tablets, the forges and the tests read them.
 * A convoy (GAME_WORLD.md §2ter-1): consecutive bridges built with the planks of ITS FIRST island; with a purse, a coin
 * per plank laid whatever its length, and `plank` = the one length in 1 … the longest gap that builds every bridge of
 * the convoy with its coins (`story.test.js` computes it). Every pair was checked against the lesson's exercise bank
 * (none is a pair it names, none stands on one line of it) and against the stories of the lessons already built.
 */
export const NUMBERS = {
  /**
   * Islands A–D, key ➖: THREE gaps, the third the first minus the second; island A offers four planks and no workshop —
   * 19 fills the three, 8 fills 152 only, 5 fills 95 only, 3 fills 57 only. No purse.
   */
  diff: { gaps: [152, 95, 57], moulds: [8, 19, 5, 3], plank: 19 },
  /**
   * Islands D–F, key 🪜: a workshop (its bench: the subtraction ladder), a purse of 12 coins = 7 + 5 planks of 37.
   * (The design's 119 ; 85 is lesson 7's trap pair; 161 ; 115 stands on a line of this lesson's bank: replaced.)
   */
  tarh: { gaps: [259, 185], purse: 12, plank: 37 },
  /** Forge 🧮 keeps its experiment in the mirror (`ladder`, mode `fold`): three subtractions of 296, one division. */
  fold: { gaps: [962, 296] },
  /** Islands F–H, key 🔁: long gaps, a workshop (its bench: the division ladder), 61 coins = 47 + 14 planks of 39. */
  iqlidis: { gaps: [1833, 546], purse: 61, plank: 39 },
  /** Islands H–J, key ⏱️: a workshop (its bench: both ladders side by side), 61 coins = 59 + 2 planks of 17. */
  sibaq: { gaps: [1003, 34], purse: 61, plank: 17 },
  /**
   * The last bridge: the landing's two lanes laid end to end (1176 cells, then 868), ONE kind of plank for both, the
   * longest; the store offers 56 (it fills the first lane only — and it is the remainder just before the last one that is
   * not 0 in Euclid's ladder of the two lanes) and 28; the price of one plank (دج).
   */
  boss: { lanes: [1176, 868], options: [56, 28], plank: 28, price: 85 },
};

/** PGCD(x ; y) by Euclid's remainders (x, y natural numbers, not both 0). */
export const gcd = (x, y) => (y ? gcd(y, x % y) : x);

/** Euclid's algorithm on (a ; b), a ≥ b > 0: every division x = y × q + r, down to the remainder 0. */
export function euclid(a, b) {
  const steps = [];
  let [x, y] = [Math.max(a, b), Math.min(a, b)];
  while (y > 0) {
    steps.push({ a: x, b: y, q: Math.floor(x / y), r: x % y });
    [x, y] = [y, x % y];
  }
  return steps;
}

/** The subtraction algorithm on (a ; b), b > 0: every subtraction x − y = d (bigger minus smaller), down to 0. */
export function differences(a, b) {
  const steps = [];
  let [x, y] = [Math.max(a, b), Math.min(a, b)];
  while (y > 0) {
    const d = x - y;
    steps.push({ x, y, d });
    [x, y] = [Math.max(y, d), Math.min(y, d)];
  }
  return steps;
}

/** « PGCD(a ; b) » as LaTeX (inside `$…$`). */
export const pgcdTex = (a, b) => `\\mathrm{PGCD}(${a} ; ${b})`;
/** « a = b × q + r » as LaTeX, from a step of `euclid`. */
export const divTex = (s) => `${s.a} = ${s.b} \\times ${s.q} + ${s.r}`;
/** « x − y = d » as LaTeX, from a step of `differences`. */
export const subTex = (s) => `${s.x} - ${s.y} = ${s.d}`;

/**
 * « 1 ، 2 ، 4 » — a list as an Arabic sentence writes it. A no-break space BEFORE each comma: a list that wraps breaks
 * only after a comma, never starts a line with « ، » (defects.md B6).
 */
export const listAr = (xs) => xs.join('\u00a0، ');

/**
 * An equality inside a plain Arabic sentence, isolated left to right (LRI … PDI): without it the bidi algorithm draws
 * « 7 + 5 = 12 » as « 12 = 5 + 7 » (defects.md B7, B16).
 */
export const ltr = (s) => `⁦${s}⁩`;

/** Arabic number agreement: forms = [one, two, three to ten, eleven and more]. « قطعة واحدة », « قطعتان », « 5 قطع ». */
export const counted = (n, [one, two, few, many]) =>
  n === 1 ? one : n === 2 ? two : n >= 3 && n <= 10 ? `${n} ${few}` : `${n} ${many}`;
/** The coins of a purse (one per plank laid, whatever its length). */
export const COINS = ['قطعة واحدة', 'قطعتان', 'قطع', 'قطعة'];
/** Euclid's divisions: « قسمة واحدة », « قسمتان », « 4 قسمات », « 12 قسمة ». */
export const DIVISIONS = ['قسمة واحدة', 'قسمتان', 'قسمات', 'قسمة'];
/** The subtractions: « عملية طرح واحدة », « عمليتا طرح », « 5 عمليات طرح », « 31 عملية طرح ». */
export const SUBTRACTIONS = ['عملية طرح واحدة', 'عمليتا طرح', 'عمليات طرح', 'عملية طرح'];
/** The rows of a notebook (a ladder), as a subject: « سطر واحد », « سطران », « 5 أسطر », « 31 سطرًا ». */
export const ROWS = ['سطر واحد', 'سطران', 'أسطر', 'سطرًا'];
/** …as an object: « كتب سطرًا واحدًا », « كتب سطرين », « كتب 5 أسطر », « كتب 31 سطرًا ». */
export const ROWS_ACC = ['سطرًا واحدًا', 'سطرين', 'أسطر', 'سطرًا'];
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
/** q planks of length b, without a verb: « لوح واحد طوله 14 », « لوحان طولهما 14 », « 73 لوحًا طولها 28 ». */
export function planksOf(q, b) {
  if (q === 1) return `لوح واحد طوله ${b}`;
  if (q === 2) return `لوحان طولهما ${b}`;
  return `${q >= 3 && q <= 10 ? `${q} ألواح` : `${q} لوحًا`} طولها ${b}`;
}
