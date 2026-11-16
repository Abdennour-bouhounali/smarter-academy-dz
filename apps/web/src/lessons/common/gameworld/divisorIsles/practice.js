/**
 * « حلبة التدريب » — PURE logic of the practice game of « أرخبيل القواسم » (no three.js, no React).
 *
 * The practice is the gate dash, level by level. Its levels hang on the LESSON'S MIND MAP: one node per knowledge item
 * (the four keys of the story) plus the summary node « تحدّي الامتحان »; a node holds its levels from the easiest to the most
 * advanced: runs of the gate dash first (a run is waves; a wave is one sentence, three gates, exactly one right), then a
 * real-world mission of « تعاونية الواحة » (`game: 'depot'`, logic in ./cases.js).
 *
 * A wave is DATA: { type, key, a?, b?, q?, r?, gates: [n, n, n], good: index }. The sentences and the guidance after a
 * mistake are written from it in strings.js — nothing is typed twice.
 */
import { divide } from './logic';

export const WAVES_PER_LEVEL = 6;
export const MAX_WAVES = 8; // a mistake brings the same kind of question back, as long as a gate is free on the rail
export const PRACTICE_HEARTS = 3;

/** Deterministic random numbers (mulberry32): the tests replay the same levels. */
export function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
const int = (rand, lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const pick = (rand, list) => list[Math.floor(rand() * list.length)];
const shuffle = (rand, list) => {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const divisorsOf = (a) => {
  const out = [];
  for (let d = 1; d <= a; d += 1) if (a % d === 0) out.push(d);
  return out;
};
const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

/** Builds a wave from the right value and a pool of wrong ones; refuses (null) when two wrong values cannot be found. */
function wave(rand, base, right, wrongPool) {
  const wrong = shuffle(
    rand,
    [...new Set(wrongPool)].filter((n) => n !== right && n >= 0),
  ).slice(0, 2);
  if (wrong.length < 2) return null;
  const gates = shuffle(rand, [right, ...wrong]);
  return { ...base, gates, good: gates.indexOf(right) };
}

/** Is gate value n right for this wave? ONE definition, used to build the wave, to judge the student and by the tests. */
export function isRight(w, n) {
  switch (w.type) {
    case 'divisorOf':
    case 'divides':
    case 'fromProduct':
      return n >= 1 && w.a % n === 0;
    case 'multipleOf':
    case 'divisibleBy':
      return n >= 1 && n % w.b === 0;
    case 'remainder':
      return n === w.r;
    case 'missing':
      return n * w.b === w.a;
    case 'everyNumber':
      return n === 1;
    case 'biggest':
      return n === w.a;
    case 'smallest':
      return n === 1;
    case 'sureOf':
      return n >= 1 && w.a % n === 0;
    default:
      return false;
  }
}

// ── the kinds of question ──
const G = {
  /** « قاسم للعدد a » / « عدد يقسم a »: one divisor, two numbers that leave a remainder. `trap` adds a multiple of a. */
  divisorOf(rand, { aMin, aMax, dMax, key, type = 'divisorOf', trap = false }) {
    const a = int(rand, aMin, aMax);
    const ds = divisorsOf(a).filter((d) => d > 1 && d < a && d <= dMax);
    if (!ds.length) return null;
    const right = pick(rand, ds);
    const near = [];
    for (let n = 2; n <= Math.min(10, Math.max(dMax, right + 3)); n += 1)
      if (a % n !== 0 && Math.abs(n - right) <= 4) near.push(n);
    const pool = trap ? [a * 2, a * 3, ...near] : near;
    const w = wave(rand, { type, key, a }, right, pool);
    if (w && trap && !w.gates.some((n) => n > a)) return null; // the trap must really be on the rail
    return w;
  },
  /** « مضاعف للعدد b » / « عدد يقبل القسمة على b ». `trap` adds a divisor of b. */
  multipleOf(rand, { bMin, bMax, kMax, key, type = 'multipleOf', trap = false }) {
    const b = int(rand, bMin, bMax);
    const right = b * int(rand, 2, kMax);
    const near = [];
    for (let n = right - 5; n <= right + 5; n += 1) if (n > b && n % b !== 0) near.push(n);
    const small = divisorsOf(b).filter((d) => d > 1 && d < b);
    if (trap && !small.length) return null;
    const pool = trap ? [pick(rand, small), ...shuffle(rand, near).slice(0, 1)] : near;
    return wave(rand, { type, key, b }, right, pool);
  },
  /** « باقي قسمة a على b ». */
  remainder(rand, { aMin, aMax, bMin, bMax, key }) {
    // built from the table: a = b × q + r with q ≤ 9, so the quotient is a product the student knows by heart
    const b = int(rand, bMin, bMax);
    const a = Math.min(aMax, Math.max(aMin, b * int(rand, 2, 9) + int(rand, 0, b - 1)));
    const { q, r } = divide(a, b);
    if (q > 10) return null;
    const pool = [];
    for (let n = 0; n < b; n += 1) if (n !== r) pool.push(n);
    return wave(rand, { type: 'remainder', key, a, b, q, r }, r, pool);
  },
  /** « a = b × ؟ ». */
  missing(rand, { bMin, bMax, qMin, qMax, key }) {
    const b = int(rand, bMin, bMax);
    const q = int(rand, qMin, qMax);
    return wave(
      rand,
      { type: 'missing', key, a: b * q, b, q },
      q,
      [q - 2, q - 1, q + 1, q + 2].filter((n) => n > 1),
    );
  },
  /** The equality a = b × q is written; « قاسم للعدد a »: one of its two factors, against two numbers that do not divide a. */
  fromProduct(rand, { bMin, bMax, qMin, qMax, key }) {
    const b = int(rand, bMin, bMax);
    const q = int(rand, qMin, qMax);
    const a = b * q;
    const right = rand() < 0.5 ? b : q;
    const pool = [];
    for (let n = right - 4; n <= Math.min(12, right + 4); n += 1) if (n > 1 && a % n !== 0) pool.push(n);
    return wave(rand, { type: 'fromProduct', key, a, b, q }, right, pool);
  },
  /** « قاسم لكلّ عدد طبيعي ». */
  everyNumber(rand, { key }) {
    return wave(rand, { type: 'everyNumber', key }, 1, [0, 2, 3, 5, 10]);
  },
  /** « أكبر قاسم للعدد a » (a itself) against a half and a multiple. */
  biggest(rand, { aMin, aMax, key }) {
    const a = int(rand, aMin, aMax) * 2;
    return wave(rand, { type: 'biggest', key, a }, a, [a / 2, a * 2, a - 1]);
  },
  /** « أصغر قاسم للعدد a » (1). */
  smallest(rand, { aMin, aMax, key }) {
    const a = int(rand, aMin, aMax);
    return wave(rand, { type: 'smallest', key, a }, 1, [0, 2, 3, a]);
  },
  /** « قاسم أكيد للعدد p » — p is prime: only 1 and p fit, no computation needed. */
  sureOf(rand, { key, big = false }) {
    const p = big ? pick(rand, [53, 59, 61, 67, 71, 73, 79, 83, 89, 97]) : pick(rand, PRIMES);
    const right = rand() < 0.5 ? 1 : p;
    return wave(
      rand,
      { type: 'sureOf', key, a: p },
      right,
      [2, 3, 5, 7, 9, p - 1, p + 1].filter((n) => n !== p && n !== 1),
    );
  },
};

const K = { baqi: 'qasim-baqi', jidaa: 'qasim-jidaa', siyagh: 'siyagh-mutakafia', wahid: 'wahid-wa-nafsuh' };

/**
 * The map: five nodes in the order of the lesson's mind map, three levels each (easiest first). A level lists the kinds of
 * question it draws from (`mix`: [generator, params]) and its speed. `EXAM` has no key of its own: every wave carries the key
 * of the rule it uses, so the reminder always opens the right tablet.
 */
export const EXAM = 'exam';
/**
 * THE GATE DASH IS MENTAL ARITHMETIC (owner, 2026-11-15): a gate arrives in a few seconds, so every number the student must
 * work with stays inside the multiplication tables — a ≤ 100, a divisor or a factor ≤ 10. Nothing here needs paper; problems
 * with bigger numbers belong to the real-world cases (cases.js) and to the exam-format training of the knowledge page.
 * `MENTAL` is that limit, enforced by the tests on every generated wave.
 */
export const MENTAL = { a: 100, b: 10 };
export const PRACTICE_NODES = [
  {
    id: K.baqi,
    levels: [
      { speed: 6.0, mix: [['divisorOf', { aMin: 6, aMax: 30, dMax: 6, key: K.baqi }]] },
      {
        speed: 6.5,
        mix: [
          ['divisorOf', { aMin: 20, aMax: 72, dMax: 9, key: K.baqi }],
          ['remainder', { aMin: 10, aMax: 50, bMin: 2, bMax: 9, key: K.baqi }],
        ],
      },
      { game: 'depot', mission: 'fit' },
    ],
  },
  {
    id: K.jidaa,
    levels: [
      { speed: 6.0, mix: [['missing', { bMin: 2, bMax: 5, qMin: 2, qMax: 9, key: K.jidaa }]] },
      {
        speed: 6.5,
        mix: [
          ['missing', { bMin: 6, bMax: 9, qMin: 3, qMax: 9, key: K.jidaa }],
          ['fromProduct', { bMin: 3, bMax: 9, qMin: 3, qMax: 9, key: K.jidaa }],
        ],
      },
      { game: 'depot', mission: 'count' },
    ],
  },
  {
    id: K.siyagh,
    levels: [
      {
        speed: 6.0,
        mix: [
          ['multipleOf', { bMin: 2, bMax: 5, kMax: 6, key: K.siyagh }],
          ['multipleOf', { bMin: 2, bMax: 5, kMax: 6, key: K.siyagh, type: 'divisibleBy' }],
        ],
      },
      {
        speed: 6.5,
        mix: [
          ['divisorOf', { aMin: 12, aMax: 40, dMax: 10, key: K.siyagh, trap: true }],
          ['multipleOf', { bMin: 6, bMax: 9, kMax: 6, key: K.siyagh, trap: true }],
          ['divisorOf', { aMin: 12, aMax: 40, dMax: 10, key: K.siyagh, type: 'divides', trap: true }],
          ['multipleOf', { bMin: 6, bMax: 9, kMax: 6, key: K.siyagh, type: 'divisibleBy', trap: true }],
        ],
      },
      { game: 'depot', mission: 'orders' },
    ],
  },
  {
    id: K.wahid,
    levels: [
      {
        speed: 6.0,
        mix: [
          ['everyNumber', { key: K.wahid }],
          ['smallest', { aMin: 12, aMax: 60, key: K.wahid }],
          ['biggest', { aMin: 6, aMax: 30, key: K.wahid }],
        ],
      },
      {
        speed: 6.5,
        mix: [
          ['sureOf', { key: K.wahid }],
          ['biggest', { aMin: 20, aMax: 50, key: K.wahid }],
          ['smallest', { aMin: 30, aMax: 99, key: K.wahid }],
        ],
      },
      { game: 'depot', mission: 'special' },
    ],
  },
  // the summary node: one mixed run (still mental arithmetic), then three full cases in the way of an exam situation
  {
    id: EXAM,
    levels: [
      {
        speed: 6.8,
        mix: [
          ['remainder', { aMin: 10, aMax: 50, bMin: 2, bMax: 9, key: K.baqi }],
          ['fromProduct', { bMin: 3, bMax: 9, qMin: 3, qMax: 9, key: K.jidaa }],
          ['divisorOf', { aMin: 12, aMax: 40, dMax: 10, key: K.siyagh, type: 'divides', trap: true }],
          ['multipleOf', { bMin: 6, bMax: 9, kMax: 6, key: K.siyagh, type: 'divisibleBy', trap: true }],
          ['sureOf', { key: K.wahid }],
        ],
      },
      { game: 'depot', mission: 'day' }, // the cooperative's depot: the invoice, the best packaging, the trucks
      { game: 'depot', mission: 'share' }, // another world: sweets shared fairly between friends
      { game: 'depot', mission: 'tiling' }, // another world: the tiler who cuts no tile and wastes none
    ],
  },
];
/** Is this level the real-world game (« تعاونية الواحة ») rather than a run of the gate dash? */
export const isDepot = (nodeIndex, level) => PRACTICE_NODES[nodeIndex].levels[level].game === 'depot';

export const levelId = (nodeIndex, level) => `${PRACTICE_NODES[nodeIndex].id}:${level + 1}`;
/** Every level in playing order: the easiest of the first node … the last of the exam. */
export const LEVEL_ORDER = PRACTICE_NODES.flatMap((n, i) =>
  n.levels.map((_, l) => ({ node: i, level: l, id: levelId(i, l) })),
);
export const MAX_PRACTICE_STARS = LEVEL_ORDER.length * 3;

/** One wave of ONE kind of question (always a valid one) — used by the trainer of the knowledge page. */
export function waveOf(rand, kind, params) {
  for (let tries = 0; tries < 400; tries += 1) {
    const w = G[kind](rand, params);
    if (w && w.gates.filter((n) => isRight(w, n)).length === 1) return w;
  }
  throw new Error(`practice: no wave of kind ${kind}`);
}

/** One wave of a level (always a valid one: the generator is asked again when it refuses). */
export function makeWave(rand, nodeIndex, level, avoid = null) {
  const { mix } = PRACTICE_NODES[nodeIndex].levels[level];
  for (let tries = 0; tries < 400; tries += 1) {
    const [kind, params] = pick(rand, mix);
    const w = G[kind](rand, params);
    if (!w || w.gates.filter((n) => isRight(w, n)).length !== 1) continue;
    if (avoid && avoid.type === w.type && avoid.a === w.a && avoid.b === w.b) continue;
    return w;
  }
  throw new Error(`practice: no wave for ${levelId(nodeIndex, level)}`);
}

/** The waves of a run: the level's kinds of question in turn, never the same numbers twice in a row. */
export function makeRun(rand, nodeIndex, level, count = WAVES_PER_LEVEL) {
  const out = [];
  while (out.length < count) out.push(makeWave(rand, nodeIndex, level, out.at(-1)));
  return out;
}

/**
 * What is open. A node opens with its key (earned in the story, on this device or another); the exam node opens once the
 * first level of each of the four nodes is passed. Inside a node the levels open one after the other.
 * `progress` = { [levelId]: { stars, best } }.
 */
export function nodeOpen(nodeIndex, keys, progress) {
  const node = PRACTICE_NODES[nodeIndex];
  if (node.id !== EXAM) return keys.includes(node.id);
  return PRACTICE_NODES.every((n, i) => n.id === EXAM || (progress[levelId(i, 0)]?.stars ?? 0) > 0);
}
export function levelOpen(nodeIndex, level, keys, progress) {
  if (!nodeOpen(nodeIndex, keys, progress)) return false;
  return level === 0 || (progress[levelId(nodeIndex, level - 1)]?.stars ?? 0) > 0;
}
/** The next level to play: the first open one not yet passed; when everything is passed, the first one below three stars. */
export function nextLevel(keys, progress) {
  const open = LEVEL_ORDER.filter((x) => levelOpen(x.node, x.level, keys, progress));
  return open.find((x) => !(progress[x.id]?.stars > 0)) ?? open.find((x) => (progress[x.id]?.stars ?? 0) < 3) ?? null;
}
export const practiceStars = (progress) => LEVEL_ORDER.reduce((sum, x) => sum + (progress[x.id]?.stars ?? 0), 0);

/** Points of a right gate: 100, more with the streak (×1, ×1.5 from 3 in a row, ×2 from 5). */
export const gatePoints = (streak) => Math.round(100 * (streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1));
