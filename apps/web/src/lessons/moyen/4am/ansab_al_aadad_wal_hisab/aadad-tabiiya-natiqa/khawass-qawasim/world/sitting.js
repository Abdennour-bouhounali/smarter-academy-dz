/**
 * « الامتحان الأبيض » of lesson `khawass-qawasim` — the CONTENT of its exam sittings (PURE). The frame — the three
 * phases, a subject adapted to what was missed, the stars — is the kit's (`gameworld/kit/sitting.js`).
 * Here: the exercises of THIS lesson by tier of difficulty (generated: no two sheets alike, every answer computed), the
 * ladder of its five levels, and for each type of question: `mark` the points of an answer, `model` the lines of the model
 * copy, `scheme` what the corrector looks for on the paper, `evidenceOf` the claim sent to the server.
 * The shapes follow the exam sheet of the lesson's bank (`content/practice/4am/khawass-qawasim`): « اكتب … على الشكل
 * d × k », the Euclidean division then its remainder, the proof with letters, a situation with two lengths.
 */
import { int, pick, shuffle } from '../../../../../../common/gameworld/kit/random';
import { answered, createSittings, slot as S } from '../../../../../../common/gameworld/kit/sitting';
import { PROOFS } from './trainer';

/** The points of each kind of exercise (the ladder shows a level's total before any subject exists). */
const POINTS = { sumDiff: 3, multiple: 2, rest: 3, proof: 2, wall: 4 };
const K = { jam: 'jam-wal-farq', madaaf: 'madaaf', baqi: 'baqi-qisma', burhan: 'burhan' };

// ── the numbers, by tier of difficulty (1 = small numbers … 3 = exam size) ──
const TIER = {
  d: [
    [3, 9],
    [11, 19],
    [21, 45],
  ],
  p: [
    [4, 12],
    [8, 25],
    [12, 40],
  ],
  n: [
    [3, 9],
    [11, 30],
    [25, 99],
  ],
};
const draw = (rand, kind, tier) => int(rand, ...TIER[kind][tier - 1]);

/** A question « write m as d × k »: m is given by an expression the student must not compute by dividing. */
const kQuestion = ({ key, points, m, d, expr, text, how }) => ({
  type: 'k',
  key,
  points,
  m,
  d,
  expr,
  how,
  text,
  tokens: [expr.replace(/\\times/g, '×').replace(/-/g, '−'), '=', String(d), '×', S('x', 'العدد k', 4)],
});

function exSumDiff(rand, tier) {
  const d = draw(rand, 'd', tier);
  const p = draw(rand, 'p', tier) + 2;
  const q = int(rand, 2, p - 2);
  const [a, b] = [d * p, d * q];
  const line = (sign, k) => `$${a} ${sign} ${b} = ${d} \\times ${p} ${sign} ${d} \\times ${q} = ${d} \\times ${k}$`;
  return {
    kind: 'sumDiff',
    title: 'المجموع والفرق',
    points: POINTS.sumDiff,
    statement: `نعلم أنّ العدد ${d} يقسم كلًّا من العددين ${a} و ${b}. أجب دون إجراء أيّ قسمة.`,
    questions: [
      kQuestion({
        key: K.jam,
        points: 1.5,
        m: a + b,
        d,
        expr: `${a} + ${b}`,
        text: `اكتب $${a} + ${b}$ على الشكل $${d} \\times k$ حيث $k$ عدد طبيعي.`,
        how: line('+', p + q),
      }),
      kQuestion({
        key: K.jam,
        points: 1.5,
        m: a - b,
        d,
        expr: `${a} - ${b}`,
        text: `اكتب $${a} - ${b}$ على الشكل $${d} \\times k$ حيث $k$ عدد طبيعي.`,
        how: line('-', p - q),
      }),
    ],
  };
}
function exMultiple(rand, tier) {
  const d = draw(rand, 'd', tier);
  const p = draw(rand, 'p', tier);
  const n = draw(rand, 'n', tier);
  const a = d * p;
  return {
    kind: 'multiple',
    title: 'المضاعفات',
    points: POINTS.multiple,
    statement: `نعلم أنّ العدد ${d} يقسم ${a}.`,
    questions: [
      kQuestion({
        key: K.madaaf,
        points: 2,
        m: a * n,
        d,
        expr: `${a} \\times ${n}`,
        text: `دون حساب الجداء، اكتب $${a} \\times ${n}$ على الشكل $${d} \\times k$.`,
        how: `$${a} \\times ${n} = ${d} \\times ${p} \\times ${n} = ${d} \\times ${p * n}$`,
      }),
    ],
  };
}
function exRest(rand, tier) {
  const d = draw(rand, 'd', tier);
  const m = int(rand, 2 + tier, 6 + 3 * tier);
  const quo = int(rand, 2, 6);
  const s = int(rand, 1, m - 1);
  const [a, b, r] = [d * (m * quo + s), d * m, d * s];
  return {
    kind: 'rest',
    title: 'باقي القسمة',
    points: POINTS.rest,
    statement: `نعلم أنّ العدد ${d} يقسم كلًّا من العددين ${a} و ${b}.`,
    questions: [
      {
        type: 'division',
        key: K.baqi,
        points: 1.5,
        a,
        b,
        quo,
        r,
        text: `أجرِ القسمة الإقليدية للعدد ${a} على ${b}.`,
        tokens: [String(a), '=', String(b), '×', S('q', 'حاصل القسمة', 3), '+', S('r', 'الباقي', 4)],
      },
      {
        type: 'k',
        key: K.baqi,
        points: 1.5,
        m: r,
        d,
        expr: String(r),
        how: `$${r} = ${a} - ${b} \\times ${quo} = ${d} \\times ${s}$`,
        text: `دون قسمة، بيّن أنّ ${d} يقسم الباقي: اكتبه على الشكل $${d} \\times k$.`,
        tokens: ['الباقي', '=', String(d), '×', S('x', 'العدد k', 3)],
      },
    ],
  };
}
function exProof(rand, tier) {
  const target = tier === 1 ? 'sum' : pick(rand, ['diff', 'mult']);
  const P = PROOFS[target];
  return {
    kind: 'proof',
    title: 'البرهان',
    points: POINTS.proof,
    statement:
      target === 'mult'
        ? '$d$ و $a$ و $n$ أعداد طبيعية، و $d$ يقسم $a$.'
        : `$d$ و $a$ و $b$ أعداد طبيعية${target === 'diff' ? ' حيث $a \\geq b$' : ''}، و $d$ يقسم $a$ و $b$.`,
    questions: [
      {
        type: 'proof',
        key: K.burhan,
        points: 2,
        target,
        text: `برهن أنّ $d$ يقسم $${P.goalTex}$. نفرض: $${P.givenTex}$ حيث ${target === 'mult' ? '$p$ عدد طبيعي' : '$p$ و $q$ عددان طبيعيان'}. أكمل.`,
        sentence: [
          P.goal,
          '=',
          {
            choice: shuffle(rand, [
              { value: 'right', text: P.right },
              { value: 'f1', text: P.foils[0] },
              { value: 'f2', text: P.foils[1] },
            ]),
          },
        ],
      },
    ],
  };
}
/** A situation: two lengths cut into equal pieces; the pieces of both together, and of what is left of the longer. */
const SITUATIONS = [
  { long: 462, short: 168, piece: 42, unit: 'سم', what: 'شريطان من القماش', place: 'ورشة خياطة' },
  { long: 585, short: 225, piece: 45, unit: 'م', what: 'أنبوبا سقي', place: 'مشتلة' },
  { long: 576, short: 216, piece: 36, unit: 'سم', what: 'لوحان من الخشب', place: 'ورشة نجارة' },
];
const pieces = (k) => (k >= 3 && k <= 10 ? `${k} قطع` : `${k} قطعة`);
function exWall(rand) {
  const { long, short, piece, unit, what, place } = pick(rand, SITUATIONS);
  const sum = long + short;
  const q = Math.floor(long / short);
  const r = long % short;
  return {
    kind: 'wall',
    title: 'طولان وقطع متساوية',
    points: POINTS.wall,
    situation: true,
    statement: `في ${place} ${what}، طولاهما ${long} ${unit} و ${short} ${unit}. نريد قطعهما إلى قطع متساوية طول كلّ منها ${piece} ${unit} دون أن يبقى شيء.`,
    questions: [
      {
        type: 'value',
        points: 2,
        expected: sum / piece,
        text: 'كم قطعة نحصل عليها من الاثنين معًا؟',
        tokens: [S('x', 'عدد القطع', 3), 'قطعة'],
        lines: [`$${long} + ${short} = ${sum} = ${piece} \\times ${sum / piece}$`, `نحصل على ${pieces(sum / piece)}.`],
        checks: [`كتبتُ مجموع الطولين على الشكل ${piece} × k`, 'كتبتُ جملة الجواب كاملة'],
      },
      {
        type: 'value',
        points: 2,
        expected: r / piece,
        text: `قبل ذلك، نقصّ من الأطول أكبر عدد ممكن من قطع طولها ${short} ${unit}. كم قطعة طولها ${piece} ${unit} تخرج ممّا يبقى منه؟`,
        tokens: [S('x', 'عدد القطع', 2), 'قطعة'],
        lines: [
          `$${long} = ${short} \\times ${q} + ${r}$`,
          `${piece} يقسم ${long} و ${short} فيقسم الباقي: $${r} = ${piece} \\times ${r / piece}$، أي ${pieces(r / piece)}.`,
        ],
        checks: ['أجريتُ القسمة الإقليدية للأطول على الأقصر', 'استعملتُ الخاصية: القاسم المشترك يقسم الباقي'],
      },
    ],
  };
}
const BUILD = { sumDiff: exSumDiff, multiple: exMultiple, rest: exRest, proof: exProof, wall: exWall };

/** THE LADDER of « فضاء الامتحان »: five levels, from one exercise in five minutes to a full short exam. */
export const LEVELS = [
  { n: 1, title: 'المجموع والفرق', minutes: 5, plan: [['sumDiff', 1]] },
  {
    n: 2,
    title: 'المضاعفات',
    minutes: 8,
    plan: [
      ['sumDiff', 1],
      ['multiple', 1],
    ],
  },
  {
    n: 3,
    title: 'الباقي والبرهان',
    minutes: 10,
    plan: [
      ['rest', 1],
      ['proof', 1],
    ],
  },
  {
    n: 4,
    title: 'امتحان قصير',
    minutes: 12,
    plan: [
      ['sumDiff', 2],
      ['rest', 2],
      ['wall', 1],
    ],
  },
  {
    n: 5,
    title: 'على منوال الامتحان',
    minutes: 15,
    plan: [
      ['rest', 3],
      ['multiple', 3],
      ['proof', 2],
      ['wall', 1],
    ],
  },
];

/** The points of an answer, by the marking scheme. */
export function mark(q, v) {
  if (!answered(q, v)) return 0;
  const n = (k) => Number(v[k]);
  switch (q.type) {
    case 'k':
      return n('x') * q.d === q.m ? q.points : 0;
    case 'division':
      return q.b * n('q') + n('r') === q.a && n('r') >= 0 && n('r') < q.b ? q.points : 0;
    case 'proof':
      return v === 'right' ? q.points : 0;
    case 'value':
      return n('x') === q.expected ? q.points : 0;
    default:
      return 0;
  }
}
/** The model copy of a question: what a full-mark paper carries, line by line. */
export function model(q) {
  switch (q.type) {
    case 'k':
      return [q.how, `${q.m / q.d} عدد طبيعي، إذن ${q.d} يقسم $${q.expr}$.`];
    case 'division':
      return [
        `$${q.a} = ${q.b} \\times ${q.quo} + ${q.r}$`,
        `الحاصل ${q.quo} والباقي ${q.r}، و ${q.r} أصغر من ${q.b}.`,
      ];
    case 'proof': {
      const P = PROOFS[q.target];
      return [
        `نفرض أنّ ${P.cond}: $${P.givenTex}$.`,
        `$${P.goalTex} = ${P.rightTex}$ و $${P.kTex}$ عدد طبيعي، إذن $d$ يقسم $${P.goalTex}$.`,
      ];
    }
    case 'value':
      return q.lines;
    default:
      return [];
  }
}
/** What the corrector looks for ON THE PAPER — the student ticks it against his own sheet. */
export function scheme(q) {
  switch (q.type) {
    case 'k':
      return ['كتبتُ كلّ عدد على الشكل d × …', 'قلتُ إنّ k عدد طبيعي ثمّ استنتجتُ'];
    case 'division':
      return ['كتبتُ المساواة a = b × q + r كاملة', 'تحقّقتُ أنّ الباقي أصغر من القاسم'];
    case 'proof':
      return ['بدأتُ من الشرط وكتبتُه بحروف', 'أخرجتُ d عاملًا مشتركًا', 'قلتُ لماذا k عدد طبيعي'];
    case 'value':
      return q.checks;
    default:
      return [];
  }
}
/**
 * The claim the server re-computes (kit/claims.js › verifyClaim), or null. A proof written with letters cannot be
 * re-computed from numbers: it is not evidence (nor is a situation's count).
 */
export function evidenceOf(q, v) {
  if (!q.key || !answered(q, v)) return null;
  const n = (k) => Number(v[k]);
  switch (q.type) {
    case 'k':
      return { key: q.key, claim: { kind: 'pair', a: q.m, b: q.d, e: n('x') } };
    case 'division':
      return { key: q.key, claim: { kind: 'division', a: q.a, b: q.b, q: n('q'), r: n('r'), fits: n('r') === 0 } };
    default:
      return null;
  }
}
/** The sittings of this lesson: its levels, its exercises and its marking, bound to the kit's frame. */
export const sittings = createSittings({
  levels: LEVELS,
  build: BUILD,
  points: POINTS,
  mark,
  model,
  scheme,
  evidenceOf,
});
