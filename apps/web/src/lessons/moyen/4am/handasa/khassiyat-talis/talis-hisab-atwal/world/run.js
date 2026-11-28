/**
 * THE FELUCCA'S LEGS of lesson `talis-hisab-atwal` — the content of the kit's rail (`kit/GateRun.js`) between two docks
 * of « الأهرامات », in the river's skin with its crocodiles (`nilePyramids/riverMeshes.js`; plan §1.3). PURE.
 *
 * THE RIVER ASKS SPEED CALCULATIONS ONLY (owner, 2026-11-27, said of France and applied here on 2026-11-28: « the river
 * game must never contain complicated questions: the questions must be speed calculation questions like: complete
 * 4/12 = 5/… → the student completes 15 → the type of questions is similar to the calculations he will get while solving
 * the exercises of the lesson »; it REPLACES his rule of 2026-11-25 « the river questions draw their figure »). Every
 * buoy is ONE bare calculation — no letter of a point, no figure, no sentence to interpret: `say` the order alone
 * (« أكمل », « احسب »), `tex` the calculation written as the bank's solutions write it, the box `\square`. Each leg
 * trains the computations of the key just sealed:
 *   leg 0 (dock 1 → 2) 🔑  `equality` « \dfrac{4}{12} = \dfrac{5}{\square} » (the box in any of the four places),
 *                          `cross` « \dfrac{12 \times 5}{4} » (the cross product, as the bank writes AC = AB × AN ÷ AM)
 *   leg 1 (dock 2 → 3) 📐  `sum` « \dfrac{4}{4 + 8} = \dfrac{5}{\square} » (a side from the vertex in its two pieces),
 *                          `decimal` « \dfrac{4}{6} = \dfrac{5}{\square} » (the length is a short decimal: 7,5)
 *   leg 2 (dock 3 → 4) 🦋  `halfCross` « \dfrac{14 \times 7{,}5}{6} », `halfEquality` « \dfrac{10}{14} = \dfrac{7{,}5}{\square} »
 *                          (the butterfly's exercises of the bank compute with a decimal length: « \dfrac{2 \times 7{,}5}{3} »)
 *   leg 3 (dock 4 → 5) 🔍  `image` « 24 \times \dfrac{5}{6} » (a side times k), `coefficient` « 9 \div 6 » (k from two
 *                          sides); the practice ladder's second level adds `back` « \dfrac{5}{6} \times \square = 1 »
 * MENTAL numbers: k = p/q (q ≤ 9, none the bank writes), a number p × m or q × m at most `MAX`, a decimal of one digit
 * after the comma. The wrong buoys are the REAL mistakes of that calculation (`slips`: the gap added instead of the
 * ratio, the division forgotten, the wrong diagonal, the ratio upside down; the sum forgotten; k added), never a random
 * number. The SAME generators are the practice ladder's (`practice.js`): a leg is the first level of the node of the key
 * just sealed; the second level draws bigger numbers (`{ big: true }`).
 *
 * A wave is DATA (the kit's ladder): { type, key, say, tex, gates: [3], good, why: { right, wrong: { [gate]: fact } },
 * data, pairs, seconds } — `data.eq` the four numbers a / b = c / d (null in the box; `cross` is b × c ÷ a, its d the
 * box), `data.k` / `data.side` for the kinds of k; a gate a whole number, a short decimal (« 7,5 ») or a fraction
 * (« 6/5 », drawn over a bar); `why` ONE fact per gate (never « wrong »: the two cross products, equal or different);
 * `pairs` every pair of the numbers the order writes with one of ten or more. `run.test.js` recomputes the right gate
 * from the `tex` itself, refuses every k the bank writes and every pair standing on one line of the bank, and checks
 * every equality a fact writes.
 */
import { pick, shuffle } from '../../../../../../common/gameworld/kit/random';
import { compare, equal, K1, K2, K3, K4, minus, over, plus, read, tex as tx, times, write } from './math';

/** k < 1, q ≤ 9, none written by the bank (run.test.js reads the bank). */
export const REDUCE = ['5/6', '2/7', '6/7', '5/8', '7/8', '2/9', '4/9', '5/9', '7/9', '8/9'];
/** k > 1, q ≤ 9, none written by the bank. */
export const ENLARGE = ['7/4', '7/6', '8/7', '9/7', '10/7', '11/8', '10/9', '11/9'];
/** The multipliers m of a number p × m or q × m: small on a leg and a first level, bigger on a second level. */
const M = { small: [1, 2, 3, 4, 5], big: [3, 4, 5, 6, 7, 8, 9] };
/** The largest number an order shows: a mental calculation. */
export const MAX = 72;
/**
 * The pairs of numbers (one of ten or more) that stand on one line of the bank `content/practice/4am/talis-hisab-atwal`,
 * among those the generators can write (computed with `kit/authoring/test/bank.js › linesWithBoth` over every number
 * they reach, 2026-11-28; re-checked by run.test.js on every wave it draws): a wave that would show one is drawn again.
 */
const TAKEN = new Set(
  (
    '1,5;25 10;10,5 10;15 10;2 10;20 10;22,5 10;3 10;36 10;4 10;4,5 10;5 10;6 10;7 10;7,5 10;8 10;9 12;2 ' +
    '12;25 12;27 12;3 12;4 12;4,5 12;5 12;6 12;8 12;9 13,5;5 14;15 14;2 14;25 14;3 14;5 14;6 14;7 14;8 14;9 ' +
    '15;2 15;3 15;5 15;6 15;7 15;8 15;9 16;2 16;25 16;3 16;4 16;5 16;6 16;8 16;9 17,5;5 18;24 18;25 18;27 ' +
    '18;30 18;36 18;45 18;7 1;10 1;12 1;25 1;30 1;32 1;45 20;3 20;4 20;5 20;6 20;7 22,5;5 22,5;7 22,5;9 ' +
    '24;27 24;3 24;30 24;36 24;4 24;6 25;3 25;4 25;4,5 25;5 25;6 25;9 27;3 27;36 27;45 27;6 27;9 28;3 28;30 ' +
    '28;5 28;8 2;20 2;22,5 2;25 2;27 2;28 2;32 2;36 2;56 2;72 30;36 30;4 30;5 30;6 30;8 32;4 32;5 32;6 36;6 ' +
    '36;8 3;30 3;32 3;36 3;45 40;45 40;5 40;6 40;8 45;5 4;40 4;45 56;6 56;7 5;72 64;8 72;8 '
  )
    .trim()
    .split(' '),
);
const pairKey = (a, b) => [String(a), String(b)].sort().join(';');
/** The numbers an order writes, as pairs: every two different numbers of which one is ten or more. */
const pairsOf = (xs) =>
  xs
    .map(String)
    .flatMap((x, i, all) => all.slice(i + 1).map((y) => [x, y]))
    .filter(([x, y]) => x !== y && Math.max(Number(x.replace(',', '.')), Number(y.replace(',', '.'))) >= 10);
/** No pair of the wave stands on a line of the bank. */
const clear = (pairs) => pairs.every(([a, b]) => !TAKEN.has(pairKey(a, b)));

const kOf = (k) => k.split('/').map(Number);
/** A gate: a whole number, or its writing (« 7,5 », « 6/5 »). */
const gate = (t) => (/^\d+$/.test(t) ? Number(t) : t);
/** A fraction written as one, even when it has a decimal writing: « 8/5 », never « 1,6 » (the buoys of `back`). */
const asFraction = (x) => {
  const { n, d } = read(x);
  return d === 1n ? String(n) : `${n}/${d}`;
};
/** A gate's writing is a whole number, or a decimal with one digit after the comma (« 7,5 »). */
const WHOLE = /^\d+$/;
const SHORT = /^\d+(,\d)?$/;
/** A whole number or a half (« 7,5 »): the buoys of the butterfly's calculations, which carry a half length. */
const HALF = /^\d+(,5)?$/;
const FRACTION = /^\d+\/\d+$/;

/**
 * The right value of a wave, from its data alone — ONE definition, used to build the wave and to judge him (the tests
 * compute it again from the order's `tex`): a / b = c / d, so a × d = b × c, the box from the three others.
 */
function truthOf(w) {
  const d = w.data ?? {};
  if (w.type === 'image') return write(times(d.side, d.k));
  if (w.type === 'coefficient') return write(over(d.b, d.a));
  if (w.type === 'back') return write(over('1', d.k));
  const e = d.eq;
  if (!e) return null;
  const [a, b, c, x] = e;
  if (x == null) return write(over(times(b, c), a));
  if (c == null) return write(over(times(a, x), b));
  if (b == null) return write(over(times(a, x), c));
  if (a == null) return write(over(times(b, c), x));
  return null;
}
/** Is gate value n right for this wave? */
export function isRight(w, n) {
  try {
    return equal(String(n), truthOf(w));
  } catch {
    return false;
  }
}

/**
 * How long each kind of buoy takes a 4AM student, in seconds, computing in his head while he steers (owner, 2026-11-25:
 * « estimate the time of each question and then five seconds »): reading the calculation, its one or two steps, the
 * choice of a buoy. `SPARE` is the owner's five seconds; the rail places the buoy row `seconds` of travel ahead
 * (`kit/GateRun.js › next`).
 */
export const THINK = {
  cross: 8, // one product, one division
  back: 8, // invert a fraction
  equality: 10, // which two numbers cross, then the same
  image: 10, // side ÷ q × p
  coefficient: 10, // a quotient of two small numbers, a short decimal
  sum: 11, // the sum first, then the same
  decimal: 12, // the same, the division ends on a comma
  halfCross: 12, // a product with a decimal, then the division
  halfEquality: 12, // the same, read in a proportion
};
export const SPARE = 5;

/** « $a \\times b = c$ » — a formula (the rail draws `why` with MathText; true: `run.test.js` checks every one). */
const prod = (a, b) => `$${tx(a)} \\times ${tx(b)} = ${tx(times(a, b))}$`;
/** The two cross products of a / b = c / d with the box holding x: « a × d » and « b × c ». */
const cross = (eq, x) => {
  const [a, b, c, d] = eq.map((v) => (v == null ? x : v));
  return [prod(a, d), prod(b, c)];
};
/** The fact of a gate x: its two cross products, equal or different. */
const crossFact = (eq, x, right) => {
  const [p, q] = cross(eq, x);
  return `مع $${tx(x)}$ في الخانة: ${p} و ${q}، ${right ? 'الجداءان متساويان' : 'الجداءان مختلفان'}.`;
};

/**
 * A wave: the right gate, two others drawn from `pool` (never one the wave would count right, never twice the same, of
 * the wave's `shape` — a whole number beside a whole answer: a decimal one would be dropped at a glance —, at most 6
 * characters, positive, its fact writing no number of four digits), each with its fact, every value written by
 * `fmt`. null (« ask again ») when the pool has fewer than two.
 */
function waveOf(rand, base, pool, fact, shape = WHOLE, fmt = write) {
  const truth = truthOf(base);
  const right = truth && fmt(truth);
  if (!right || !shape.test(right) || right.length > 6) return null;
  // a fact stays mental too: no number of four digits in it (a buoy whose fact would write one is not offered)
  const long = (f) => /\d{4}/.test(f.replace(/\{,\}/g, ','));
  if (long(fact(right, true))) return null;
  const seen = new Set([right]);
  const wrong = [];
  for (const g of shuffle(rand, pool)) {
    if (g == null) continue;
    let k;
    try {
      if (compare(g, '0') <= 0) continue;
      k = fmt(g);
    } catch {
      continue;
    }
    if (seen.has(k) || isRight(base, k) || !shape.test(k) || k.length > 6 || long(fact(k, false))) continue;
    seen.add(k);
    wrong.push(k);
  }
  if (wrong.length < 2) return null;
  const others = wrong.slice(0, 2);
  const facts = [right, ...others].map((g, i) => fact(g, i === 0));
  const gates = shuffle(rand, [gate(right), ...others.map(gate)]);
  return {
    ...base,
    seconds: THINK[base.type] + SPARE,
    // the ladder never draws the same numbers twice in a row: its `a` / `b` are the order's calculation
    a: base.tex,
    b: base.say,
    gates,
    good: gates.indexOf(gate(right)),
    why: { right: facts[0], wrong: Object.fromEntries(others.map((g, i) => [gate(g), facts[i + 1]])) },
  };
}

/** Two different multipliers of the level's set. */
const twoM = (rand, big) => {
  const set = big ? M.big : M.small;
  const a = pick(rand, set);
  const b = pick(
    rand,
    set.filter((x) => x !== a),
  );
  return [a, b];
};
/** The four numbers a / b = c / d at a k of `ks`: a = p × m, b = q × m, c = p × n, d = q × n. */
function fourOf(rand, big, ks = REDUCE) {
  const [p, q] = kOf(pick(rand, ks));
  const [m, n] = twoM(rand, big);
  return [p * m, q * m, p * n, q * n];
}
/** « \\dfrac{a}{b} = \\dfrac{c}{d} », the box written `\\square`; `show` writes a number its own way (a sum). */
const fracs = (eq, show = (v) => tx(v)) => {
  const t = eq.map((v, i) => (v == null ? '\\square' : show(v, i)));
  return `\\dfrac{${t[0]}}{${t[1]}} = \\dfrac{${t[2]}}{${t[3]}}`;
};
/** The numbers of the order, and a check that none is too big for the head. */
const mental = (xs) => xs.every((x) => compare(x, '0') > 0 && compare(x, String(MAX)) <= 0);
/** The equality as the wave keeps it: text, null in the box. */
const keep = (eq) => eq.map((v) => (v == null ? null : write(String(v))));
/**
 * The mistakes a real student makes on a / b = c / d with one box (`hole`): adding the gap instead of multiplying (the
 * box's fraction-mate plus the other fraction's difference), forgetting the division, the wrong diagonal, the ratio
 * upside down.
 */
function slips(full, hole) {
  const v = (i) => String(full[i]);
  const mate = hole ^ 1;
  const added = minus(plus(v(mate), v(hole ^ 2)), v(mate ^ 2));
  const opposite = v(3 - hole);
  const [p, q] = [v(hole ^ 1), v(hole ^ 2)];
  return [added, times(p, q), over(times(p, opposite), q), over(times(q, opposite), p)].map(write);
}
/** A half: « 7,5 » from 15. */
const half = (n) => write(over(String(n), '2'));

/** An equality to complete, its box in any of the four places (`equality`, `halfEquality`). */
function complete(rand, type, key, full, shape) {
  const hole = pick(rand, [0, 1, 2, 3]);
  const eq = keep(full.map((v, i) => (i === hole ? null : v)));
  const pairs = pairsOf(eq.filter((v) => v != null));
  if (!mental(full.map(String)) || !clear(pairs)) return null;
  const base = { type, key, say: 'أكمل', tex: fracs(eq), data: { eq }, pairs };
  return waveOf(rand, base, slips(full, hole), (x, right) => crossFact(eq, x, right), shape);
}

/** The cross product as the bank writes it: « \\dfrac{b \\times c}{a} » — a / b = c / d gives d (`cross`, `halfCross`). */
function crossWave(rand, type, key, [a, b, c], shape) {
  const [x, y] = pick(rand, [
    [b, c],
    [c, b],
  ]);
  const pairs = pairsOf([a, x, y].map((v) => write(String(v))));
  const bc = times(b, c);
  if (!mental([a, b, c].map(String)) || compare(bc, '999') > 0 || !clear(pairs)) return null;
  const base = {
    type,
    key,
    say: 'احسب',
    tex: `\\dfrac{${tx(x)} \\times ${tx(y)}}{${tx(a)}}`,
    data: { eq: keep([a, b, c, null]) },
    pairs,
  };
  const fact = (g, right) => {
    if (right) return `${prod(x, y)}، و ${prod(g, a)}: حاصل قسمة $${tx(bc)}$ على $${tx(a)}$ هو $${tx(g)}$.`;
    // the division forgotten: the product itself, not yet divided
    if (equal(g, bc)) return `${prod(x, y)}: هذا هو الجداء، قبل قسمته على $${tx(a)}$.`;
    return `${prod(x, y)}، و ${prod(g, a)}، لا $${tx(bc)}$.`;
  };
  // the division forgotten, the gap added, the wrong diagonal, the ratio upside down
  const pool = [write(bc), write(minus(plus(b, c), a)), write(over(times(a, c), b)), write(over(times(a, b), c))];
  return waveOf(rand, base, pool, fact, shape);
}

// ───────────────────────────── the kinds of buoy ─────────────────────────────
export const GENERATORS = {
  /** 🔑 complete an equality of two fractions, the box in any of the four places: « 4/12 = 5/□ ». */
  equality(rand, { big = false } = {}) {
    return complete(rand, 'equality', K1, fourOf(rand, big), WHOLE);
  },

  /** 🔑 the cross product itself: « \\dfrac{12 \\times 5}{4} » (a / b = c / d, d = b × c ÷ a). */
  cross(rand, { big = false } = {}) {
    const [a, b, c] = fourOf(rand, big);
    return crossWave(rand, 'cross', K1, [a, b, c], WHOLE);
  },

  /**
   * 📐 a side from the vertex written as the sum of its two pieces: « 4 / (4 + 8) = 5 / □ » (AB = AM + MB first). The
   * box is in the other fraction, above or below; the fraction of the sum on the left or on the right.
   */
  sum(rand, { big = false } = {}) {
    const [a, b, c, d] = fourOf(rand, big);
    const piece = b - a;
    if (piece === a) return null;
    const hole = pick(rand, [2, 3]);
    const left = pick(rand, [true, false]);
    // the four numbers in the order written, the sum's fraction first or second
    const full = left ? [a, b, c, d] : [c, d, a, b];
    const at = left ? hole : hole - 2;
    const sumAt = left ? 1 : 3;
    const eq = keep(full.map((v, i) => (i === at ? null : v)));
    const pairs = pairsOf([a, piece, ...[c, d].filter((_, i) => i + 2 !== hole)]);
    if (!mental(full.map(String)) || !clear(pairs)) return null;
    const base = {
      type: 'sum',
      key: K2,
      say: 'أكمل',
      tex: fracs(eq, (v, i) => (i === sumAt ? `${tx(a)} + ${tx(piece)}` : tx(v))),
      data: { eq },
      pairs,
    };
    const sum = `$${tx(a)} + ${tx(piece)} = ${tx(b)}$`;
    const fact = (x, right) => `${sum}. ${crossFact(eq, x, right)}`;
    // the piece alone (the sum forgotten), then the slips of the equality
    const alone = [...full];
    alone[sumAt] = piece;
    const forgot = truthOf({ data: { eq: keep(alone.map((v, i) => (i === at ? null : v))) } });
    return waveOf(rand, base, [forgot, ...slips(full, at)], fact, WHOLE);
  },

  /** 📐 an equality whose box is a short decimal: « 4/6 = 5/□ » gives 7,5. */
  decimal(rand, { big = false } = {}) {
    const [p, q] = kOf(pick(rand, ['5/6', '2/7', '5/8', '2/9', '4/9', '5/9', '8/9']));
    const m = pick(rand, big ? [2, 3] : [1, 2]);
    const [a, b] = [p * m, q * m];
    const c = pick(
      rand,
      Array.from({ length: big ? 14 : 9 }, (_, i) => i + 3).filter((x) => x !== a && x !== b),
    );
    const d = write(over(b * c, a));
    if (WHOLE.test(d)) return null;
    const eq = keep([a, b, c, null]);
    const pairs = pairsOf([a, b, c]);
    if (!mental([a, b, c].map(String)) || !clear(pairs)) return null;
    const base = { type: 'decimal', key: K2, say: 'أكمل', tex: fracs(eq), data: { eq }, pairs };
    return waveOf(rand, base, slips([a, b, c, d], 3), (x, right) => crossFact(eq, x, right), SHORT);
  },

  /**
   * 🦋 the cross product with a decimal length, as the butterfly's exercises of the bank compute it
   * (« \\dfrac{2 \\times 7{,}5}{3} »): a = p × m, b = q × m, c a half; the answer whole or a half.
   */
  halfCross(rand, { big = false } = {}) {
    const [p, q] = kOf(pick(rand, REDUCE));
    const m = pick(rand, big ? M.big : M.small);
    const odd = pick(
      rand,
      Array.from({ length: big ? 14 : 8 }, (_, i) => 2 * i + 3),
    );
    return crossWave(rand, 'halfCross', K3, [p * m, q * m, half(odd)], HALF);
  },

  /** 🦋 an equality with a decimal length to complete: « \\dfrac{10}{14} = \\dfrac{7{,}5}{\\square} ». */
  halfEquality(rand, { big = false } = {}) {
    const [p, q] = kOf(pick(rand, REDUCE));
    const m = pick(rand, big ? M.big : M.small);
    const n = pick(rand, big ? [3, 5, 7, 9, 11] : [1, 3, 5, 7]);
    const pair = [
      [p * m, q * m],
      [half(p * n), half(q * n)],
    ];
    // the fraction with a decimal on the left or on the right
    const [l, r] = pick(rand, [true, false]) ? pair : [pair[1], pair[0]];
    return complete(rand, 'halfEquality', K3, [...l, ...r], HALF);
  },

  /** 🔍 a side times k: « 24 \\times \\dfrac{5}{6} » (the side of the image). data: { k, side }. */
  image(rand, { big = false } = {}) {
    const k = pick(rand, [...REDUCE, ...ENLARGE]);
    const [p, q] = kOf(k);
    const m = pick(rand, big ? M.big : M.small.filter((x) => x > 1));
    const side = q * m;
    const pairs = pairsOf([side, p, q]);
    if (!mental([String(side)]) || !clear(pairs)) return null;
    const base = {
      type: 'image',
      key: K4,
      say: 'احسب',
      tex: `${side} \\times \\dfrac{${p}}{${q}}`,
      data: { k, side: String(side) },
      pairs,
    };
    // g / side = p / q ⟺ g × q = side × p
    const fact = (g, right) =>
      `مع $${tx(g)}$: ${prod(g, q)} و ${prod(side, p)}، ${right ? 'الجداءان متساويان' : 'الجداءان مختلفان'}.`;
    // the division by q forgotten, the multiplication by p forgotten, k upside down, the gap of k added
    const pool = [String(side * p), write(over(side, q)), write(over(side * q, p)), String(side + p - q)];
    return waveOf(rand, base, pool, fact, WHOLE);
  },

  /** 🔍 a coefficient from two sides: « 9 \\div 6 », a short decimal (first level: whole or « ,5 »). data: { a, b }. */
  coefficient(rand, { big = false } = {}) {
    const DIGITS = [2, 3, 4, 5, 6, 7, 8, 9];
    const all = DIGITS.flatMap((a) => DIGITS.filter((b) => b !== a).map((b) => [a, b])).filter(([a, b]) => {
      const k = write(over(String(b), String(a)));
      if (!SHORT.test(k) && !/^\d+,\d\d$/.test(k)) return false;
      const easy = /^\d+(,5)?$/.test(k);
      return big ? !easy : easy;
    });
    const [a, b] = pick(rand, all);
    const base = {
      type: 'coefficient',
      key: K4,
      say: 'احسب',
      tex: `${b} \\div ${a}`,
      data: { a: String(a), b: String(b) },
      pairs: [],
    };
    const shape = /^\d+(,\d{1,2})?$/;
    const fact = (g, right) => (right ? `${prod(a, g)}.` : `${prod(a, g)}، لا $${b}$.`);
    // the difference of the two sides, a product instead of a quotient, the quotient upside down
    const pool = [String(Math.abs(b - a)), String(a * b), write(over(String(a), String(b)))];
    return waveOf(rand, base, pool, fact, shape);
  },

  /** 🔍 the number back from (2) to (1): « \\dfrac{5}{6} \\times \\square = 1 ». data: { k }. */
  back(rand, { big = false } = {}) {
    const k = pick(rand, big ? ENLARGE : REDUCE);
    const [p, q] = kOf(k);
    const pairs = pairsOf([p, q]);
    if (!clear(pairs)) return null;
    const base = {
      type: 'back',
      key: K4,
      say: 'أكمل',
      tex: `\\dfrac{${p}}{${q}} \\times \\square = 1`,
      data: { k },
      pairs,
    };
    // a fraction stays a fraction in the fact, as on its buoy
    const ft = (x) => {
      const [n, d] = asFraction(x).split('/');
      return d ? `\\dfrac{${n}}{${d}}` : n;
    };
    const fact = (g, right) =>
      right
        ? `$\\dfrac{${p}}{${q}} \\times ${ft(g)} = 1$.`
        : `$\\dfrac{${p}}{${q}} \\times ${ft(g)} = ${ft(times(k, g))}$، لا $1$.`;
    // the same number, what is ADDED to it to make 1, the sum of its terms under p
    const pool = [k, write(over(String(Math.abs(q - p)), String(q))), write(over(String(p + q), String(p)))];
    return waveOf(rand, base, pool, fact, FRACTION, asFraction);
  },
};

// ───────────────────────────── the legs ─────────────────────────────

/** What each leg asks, by the key just sealed (the first level of its practice node — `practice.js` reads the same). */
export const LEG_MIX = [
  [
    ['equality', {}],
    ['cross', {}],
  ],
  [
    ['sum', {}],
    ['decimal', {}],
  ],
  [
    ['halfCross', {}],
    ['halfEquality', {}],
  ],
  [
    ['image', {}],
    ['coefficient', {}],
  ],
];
const TRIES = 400;
/** One fair wave of a kind: exactly one right gate. */
export function fairWave(rand, kind, params) {
  for (let i = 0; i < TRIES; i += 1) {
    const w = GENERATORS[kind](rand, params);
    if (w && w.gates.filter((g) => isRight(w, g)).length === 1) return w;
  }
  throw new Error(`run: no wave of kind ${kind}`);
}
/** A gate as the rail draws it: « 6/5 » over a real bar, anything else as text. */
export const gateOption = (g) => {
  const m = /^(\d+)\/(\d+)$/.exec(String(g));
  return m ? { tex: `\\dfrac{${m[1]}}{${m[2]}}` } : { t: String(g) };
};
/** A wave as the rail plays it: { ask, tex, options × 3, right, why × 3, seconds } — no figure (owner, 2026-11-27). */
export const roundOf = (w) => ({
  ask: w.say,
  tex: w.tex ?? null,
  options: w.gates.map(gateOption),
  right: w.good,
  why: w.gates.map((g, i) => (i === w.good ? w.why.right : (w.why.wrong?.[g] ?? w.why.right))),
  seconds: w.seconds,
});

/** The words of the rail's cards (`kit/GateRunHud.jsx › content.text`): never a rule, never « wrong ». */
const TEXT = {
  title: 'الفلوكة إلى المرسى التالي',
  say: 'أربع عوّامات صحيحة توصلك إلى المرسى. على كلّ عوّامة عدد.',
  rule: 'اختر عوّامتك بالسهمين ← →، واحذر التمساح. لك ثلاثة قلوب.',
  start: 'أبحر',
  again: 'أعيد الرحلة',
  leave: 'الرجوع إلى المرسى',
  order: 'مرّ بالعوّامة التي تحمل الجواب',
  gate: 'العوّامة',
  of: 'من',
  pause: 'توقّف',
  resume: 'متابعة',
  quit: 'خروج',
  pausedTitle: 'الفلوكة متوقّفة',
  pausedText: 'العوّامات تنتظرك حيث تركتها. اضغط « متابعة » أو مفتاح المسافة.',
  left: 'يسار',
  right: 'يمين',
  bump: 'التمساح! خسرت قلبًا.',
  won: { title: 'وصلتَ إلى المرسى', text: 'المرحلة التالية تنتظرك على الضفّة.' },
  lost: { title: 'انتهت القلوب', text: 'تعود الفلوكة إلى مرساها: أعد الرحلة.' },
};
/** The names of the legs, on the rail's card (a place of the river, never a rule). */
const LEG_NAMES = ['من الحقل إلى الورشة', 'من الورشة إلى عرض النيل', 'من عرض النيل إلى القمّة', 'من القمّة إلى الهضبة'];

/** Leg i (from dock i to dock i + 1): the content `story.legs[i]` hands the world (`nilePyramids/Game.js › board`). */
export function legOf(i) {
  const mix = LEG_MIX[i];
  return {
    total: 4,
    gates: 4,
    levels: [{ name: LEG_NAMES[i], from: '' }],
    round: (_level, random, n) => {
      const [kind, params] = mix[n % mix.length];
      return roundOf(fairWave(random, kind, params));
    },
    text: { ...TEXT, title: `${TEXT.title}: ${LEG_NAMES[i]}` },
  };
}
/** The four legs, in the order of the docks: `story.legs` at wave 2. */
export const LEGS = LEG_MIX.map((_, i) => legOf(i));
