/**
 * « حلبة التدريب » of lesson `khawass-qawasim` — the CONTENT of its practice ladder (PURE). The ladder itself is the
 * kit's (`gameworld/kit/ladder.js`). Here: the kinds of question of THIS lesson, when a gate is right, the map of its levels.
 * A wave is DATA: { type, key, a?, b?, q?, r?, gates, good }; its sentence and the guidance after a mistake are written from
 * it in the world's strings.js (`waveSay`, `explain`) — so a wave of this lesson uses the world's types of sentence.
 * THE GATE DASH IS MENTAL ARITHMETIC: a gate arrives in a few seconds, so the numbers stay inside the tables (a ≤ 100).
 * The numbers are BUILT from the lesson's rules: a sum of two multiples of d, a multiple of a multiple, a remainder of two
 * multiples of d — where the rule finds the gate before the arithmetic does (only one gate is a multiple of d).
 */
import { int } from '../../../../../../common/gameworld/kit/random';
import { buildWave as wave, createLadder, SUMMARY } from '../../../../../../common/gameworld/kit/ladder';

/** Is gate value n right for this wave? ONE definition, used to build the wave, to judge the student and by the tests. */
export function isRight(w, n) {
  switch (w.type) {
    case 'missing':
      return n * w.b === w.a;
    case 'divides':
      return n >= 1 && w.a % n === 0;
    case 'multipleOf':
    case 'divisibleBy':
      return n >= 1 && n % w.b === 0;
    case 'remainder':
      return n === w.r;
    default:
      return false;
  }
}

const near = (k) => [k - 2, k - 1, k + 1, k + 2].filter((n) => n > 1);
const notMultiples = (right, b) =>
  [right - 3, right - 2, right - 1, right + 1, right + 2, right + 3].filter((n) => n > 0 && n % b !== 0);

// ── the kinds of question ──
const G = {
  /** « d·p + d·q = d × ؟ »: the sum of two multiples of d is d times the sum of their partners. */
  sum(rand, { dMin, dMax, key }) {
    const d = int(rand, dMin, dMax);
    const k = int(rand, 2, 6) + int(rand, 2, 6);
    const a = d * k;
    if (a > 100) return null;
    return wave(rand, { type: 'missing', key, a, b: d, q: k }, k, near(k));
  },
  /** « d·p − d·q = d × ؟ »: the difference, with a partner of at least 2. */
  diff(rand, { dMin, dMax, key }) {
    const d = int(rand, dMin, dMax);
    const p = int(rand, 5, 12);
    const k = p - int(rand, 1, p - 2);
    const a = d * k;
    if (a > 100 || k < 2) return null;
    return wave(rand, { type: 'missing', key, a, b: d, q: k }, k, near(k));
  },
  /** « عدد يقسم a »: a divisor of a multiple, against numbers that leave a remainder. */
  common(rand, { key }) {
    const d = int(rand, 3, 9);
    const a = d * int(rand, 3, 11);
    if (a > 100) return null;
    const pool = [];
    for (let n = Math.max(2, d - 4); n <= d + 4; n += 1) if (a % n !== 0) pool.push(n);
    return wave(rand, { type: 'divides', key, a }, d, pool);
  },
  /** « مضاعف للعدد b » — b a two-digit number: one of its multiples among two neighbours that are not. */
  multiple(rand, { bMin, bMax, kMax, key }) {
    const b = int(rand, bMin, bMax);
    const right = b * int(rand, 2, kMax);
    if (right > 100) return null;
    return wave(rand, { type: 'multipleOf', key, b }, right, notMultiples(right, b));
  },
  /** « عدد يقبل القسمة على b »: the same question in the other phrasing. */
  divisible(rand, { key }) {
    const b = int(rand, 6, 9);
    const right = b * int(rand, 3, 11);
    if (right > 100) return null;
    return wave(rand, { type: 'divisibleBy', key, b }, right, notMultiples(right, b));
  },
  /**
   * « باقي قسمة a على b » where d divides a and b: the remainder is a multiple of d, and only ONE gate is — the rule finds
   * it before the division does.
   */
  rest(rand, { key }) {
    const d = int(rand, 3, 7);
    const m = int(rand, 2, 4);
    const b = d * m;
    const q = int(rand, 2, 4);
    const r = d * int(rand, 1, m - 1);
    const a = b * q + r;
    if (a > 100) return null;
    const pool = [];
    for (let n = 1; n < b; n += 1) if (n % d !== 0) pool.push(n);
    return wave(rand, { type: 'remainder', key, a, b, q, r, d }, r, pool);
  },
  /** « باقي قسمة a على b » — any two numbers: the division itself. */
  remainder(rand, { key }) {
    const b = int(rand, 6, 12);
    const q = int(rand, 2, 8);
    const r = int(rand, 1, b - 1);
    const a = b * q + r;
    if (a > 100) return null;
    const pool = [];
    for (let n = 0; n < b; n += 1) if (n !== r) pool.push(n);
    return wave(rand, { type: 'remainder', key, a, b, q, r }, r, pool);
  },
  /** « m = d × ؟ »: the k of the proof, found by the head. */
  factor(rand, { dMin, dMax, kMin, kMax, key }) {
    const d = int(rand, dMin, dMax);
    const k = int(rand, kMin, kMax);
    const a = d * k;
    if (a > 100) return null;
    return wave(rand, { type: 'missing', key, a, b: d, q: k }, k, near(k));
  },
};

const K = { jam: 'jam-wal-farq', madaaf: 'madaaf', baqi: 'baqi-qisma', burhan: 'burhan' };

/** The map: five nodes in the order of the lesson's mind map, levels from the easiest. */
const EXAM = SUMMARY;
export const PRACTICE_NODES = [
  {
    id: K.jam,
    levels: [
      { speed: 6.0, mix: [['sum', { dMin: 2, dMax: 7, key: K.jam }]] },
      {
        speed: 6.5,
        mix: [
          ['diff', { dMin: 3, dMax: 9, key: K.jam }],
          ['common', { key: K.jam }],
        ],
      },
    ],
  },
  {
    id: K.madaaf,
    levels: [
      { speed: 6.0, mix: [['multiple', { bMin: 11, bMax: 25, kMax: 4, key: K.madaaf }]] },
      {
        speed: 6.5,
        mix: [
          ['divisible', { key: K.madaaf }],
          ['multiple', { bMin: 12, bMax: 33, kMax: 3, key: K.madaaf }],
        ],
      },
    ],
  },
  {
    id: K.baqi,
    levels: [
      { speed: 6.0, mix: [['rest', { key: K.baqi }]] },
      {
        speed: 6.5,
        mix: [
          ['rest', { key: K.baqi }],
          ['remainder', { key: K.baqi }],
        ],
      },
    ],
  },
  {
    id: K.burhan,
    levels: [
      { speed: 6.0, mix: [['factor', { dMin: 3, dMax: 9, kMin: 6, kMax: 12, key: K.burhan }]] },
      { speed: 6.5, mix: [['factor', { dMin: 11, dMax: 19, kMin: 3, kMax: 5, key: K.burhan }]] },
    ],
  },
  // the summary node: two mixed runs, the second faster
  {
    id: EXAM,
    levels: [
      {
        speed: 6.2,
        mix: [
          ['sum', { dMin: 3, dMax: 9, key: K.jam }],
          ['multiple', { bMin: 11, bMax: 25, kMax: 4, key: K.madaaf }],
          ['rest', { key: K.baqi }],
          ['factor', { dMin: 3, dMax: 9, kMin: 6, kMax: 12, key: K.burhan }],
        ],
      },
      {
        speed: 6.6,
        mix: [
          ['diff', { dMin: 3, dMax: 9, key: K.jam }],
          ['divisible', { key: K.madaaf }],
          ['remainder', { key: K.baqi }],
          ['factor', { dMin: 11, dMax: 19, kMin: 3, kMax: 5, key: K.burhan }],
        ],
      },
    ],
  },
];
/** The ladder of this lesson: its levels, bound to its nodes and its generators. */
export const ladder = createLadder({ nodes: PRACTICE_NODES, generators: G, isRight });
export const { waveOf } = ladder;

/** The practice hub draws the ladder as the lesson's mind map (percent of the map box; RTL: « start » is on the right). */
export const PRACTICE_MAP = {
  root: 'خواص قواسم عدد طبيعي',
  positions: {
    root: [50, 9],
    [K.jam]: [77, 34],
    [K.madaaf]: [23, 34],
    [K.baqi]: [50, 57],
    [K.burhan]: [75, 84],
    [EXAM]: [25, 84],
  },
  edges: [
    ['root', K.jam, 'قاسم مشترك يقسم'],
    [K.jam, K.madaaf, 'جمع متكرّر', true],
    [K.jam, K.baqi, 'الباقي فرق'],
    [K.madaaf, K.baqi, null],
    [K.baqi, K.burhan, 'نبرهن بـ'],
    [K.baqi, EXAM, 'نستخلص'],
    [K.burhan, EXAM, null, true],
  ],
};
