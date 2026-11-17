/**
 * « الامتحان الأبيض » of lesson `qawasim-adad-tabii` — the CONTENT of its exam sittings (PURE). The frame — the three
 * phases, a subject adapted to what was missed, the stars — is the kit's (`gameworld/kit/sitting.js`).
 * Here: the exercises of THIS lesson by tier of difficulty, the ladder of its five levels, and for each type of question:
 * `mark` the points of an answer, `model` the lines of the model copy, `scheme` what the corrector looks for on the paper,
 * `evidenceOf` the claim sent to the server.
 */
import { int, pick } from '../../../../../../common/gameworld/kit/random';
import { answered, createSittings, slot as S } from '../../../../../../common/gameworld/kit/sitting';
import { divisorsOf, lastTry } from './practice';
import { READ } from './trainer';

const YES_NO = [
  { value: 'yes', text: 'يقبل' },
  { value: 'no', text: 'لا يقبل' },
];
/** The points of each kind of exercise (the ladder shows a level's total before any subject exists). */
const POINTS = { products: 3, method: 3, rules: 3, wall: 4 };
const pairsText = (a) =>
  divisorsOf(a)
    .filter((d) => d * d <= a)
    .map((d) => `${d} \\times ${a / d}`)
    .join(' = ');

// ── the exercises, by tier of difficulty (1 = small numbers … 3 = exam size) ──
const TIER = {
  products: [
    [12, 18, 20, 28],
    [30, 40, 42, 45, 50],
    [54, 56, 63, 66, 70],
  ],
  method: [
    [45, 50, 52, 63],
    [75, 88, 98, 99, 110],
    [117, 130, 147, 154, 175],
  ],
};
/** As many boxes as the number has divisors, separated by commas. */
const listTokens = (a) =>
  divisorsOf(a).flatMap((_, i) => (i ? ['،', S(`d${i}`, `القاسم ${i + 1}`, 3)] : [S('d0', 'القاسم 1', 3)]));

function exProducts(rand, tier) {
  const a = pick(rand, TIER.products[tier - 1]);
  const b = pick(
    rand,
    divisorsOf(a).filter((d) => d > 1 && d * d < a),
  );
  return {
    kind: 'products',
    title: 'جداء عاملين وقواسم عدد',
    points: POINTS.products,
    statement: `نعتبر العدد الطبيعي ${a}.`,
    questions: [
      {
        type: 'factor',
        key: 'jidaa-aamilayn',
        points: 1,
        a,
        b,
        text: `أكمل المساواة، ثمّ اذكر القاسمين اللذين تعطيهما.`,
        tokens: [String(a), '=', String(b), '×', S('x', 'العدد الناقص', 3)],
      },
      {
        type: 'list',
        key: 'qasim-rappel',
        points: 2,
        a,
        text: `اكتب ${a} على شكل جداء عاملين بكلّ الأشكال الممكنة على ورقتك، ثمّ عيّن كلّ قواسمه (عددها ${divisorsOf(a).length}).`,
        tokens: listTokens(a),
      },
    ],
  };
}
function exMethod(rand, tier) {
  const a = pick(rand, TIER.method[tier - 1]);
  return {
    kind: 'method',
    title: 'طريقة تعيين القواسم',
    points: POINTS.method,
    statement: `نريد تعيين كلّ قواسم العدد ${a}.`,
    questions: [
      {
        type: 'stop',
        key: 'tariqa-qawasim',
        points: 1.5,
        a,
        text: `أحصر ${a} بين مربّعي عددين طبيعيين متتاليين: إلى أيّ عدد نجرّب القسمة؟`,
        tokens: [S('d', 'العدد الذي مربّعه لا يتجاوز', 2), '² ≤', String(a), '<', S('e', 'العدد الموالي', 2), '²'],
      },
      {
        type: 'list',
        key: 'tariqa-qawasim',
        points: 1.5,
        a,
        text: `طبّق الطريقة على ورقتك، ثمّ اكتب كلّ قواسم ${a} (عددها ${divisorsOf(a).length}).`,
        tokens: listTokens(a),
      },
    ],
  };
}
function exRules(rand, tier) {
  const a = tier === 1 ? int(rand, 120, 400) : tier === 2 ? int(rand, 400, 990) : int(rand, 1000, 4000);
  const planks = tier === 1 ? [2, 5, 3] : tier === 2 ? [3, 4, 9] : [4, 9, 5];
  return {
    kind: 'rules',
    title: 'قواعد قابلية القسمة',
    points: POINTS.rules,
    statement: `نعتبر العدد ${a}. أجب دون إجراء أيّ قسمة.`,
    questions: planks.map((b) => ({
      type: 'verdict',
      key: 'qawaid-qisma',
      points: 1,
      a,
      b,
      text: `هل ${a} يقبل القسمة على ${b}؟ علّل بالقاعدة.`,
      sentence: [String(a), { choice: YES_NO }, 'القسمة على', String(b)],
    })),
  };
}
/** A situation: things set in equal rows, a row holding between two numbers of them. */
function exWall(rand) {
  const [n, lo, hi, thing, place] = pick(rand, [
    [96, 5, 15, 'كتابًا', 'رفوف'],
    [84, 5, 13, 'شتلة', 'أحواض'],
    [90, 4, 12, 'كرسيًّا', 'صفوف'],
    [72, 5, 11, 'لوحة', 'صفوف'],
  ]);
  const fits = divisorsOf(n).filter((d) => d >= lo && d <= hi);
  const big = fits.at(-1);
  return {
    kind: 'wall',
    title: 'ترتيب في صفوف متساوية',
    points: POINTS.wall,
    situation: true,
    statement: `نريد ترتيب ${n} ${thing} في ${place} متساوية تمامًا، دون أن يبقى شيء. يحمل كلّ واحد منها ما بين ${lo} و ${hi}.`,
    questions: [
      {
        type: 'value',
        points: 2,
        expected: fits.length,
        text: 'ما عدد الإمكانيات؟ عيّن على ورقتك كلّ الأعداد الممكنة في الصفّ الواحد.',
        tokens: [S('x', 'عدد الإمكانيات', 2), 'إمكانيات'],
        lines: [
          `$${n} = ${pairsText(n)}$`,
          `الأعداد الممكنة بين ${lo} و ${hi}: ${fits.join(' ، ')} — أي ${fits.length} إمكانيات.`,
        ],
        checks: ['كتبتُ العدد جداءَ عاملين بكلّ الأشكال', 'احتفظتُ فقط بالقواسم المحصورة بين الحدّين'],
      },
      {
        type: 'value',
        points: 2,
        expected: n / big,
        text: `نختار أكبر عدد ممكن في الصفّ الواحد. كم صفًّا نحتاج؟`,
        tokens: [S('x', 'عدد الصفوف', 3), 'صفًّا'],
        lines: [`أكبر عدد ممكن هو ${big}.`, `$${n} = ${big} \\times ${n / big}$: نحتاج ${n / big} صفًّا.`],
        checks: ['اخترتُ أكبر قاسم بين الحدّين', 'كتبتُ جملة الجواب كاملة'],
      },
    ],
  };
}
const BUILD = { products: exProducts, method: exMethod, rules: exRules, wall: exWall };

/** THE LADDER of « فضاء الامتحان »: five levels, from one exercise in five minutes to a full short exam. */
export const LEVELS = [
  { n: 1, title: 'جداء عاملين', minutes: 5, plan: [['products', 1]] },
  {
    n: 2,
    title: 'القواسم والقواعد',
    minutes: 8,
    plan: [
      ['products', 1],
      ['rules', 1],
    ],
  },
  {
    n: 3,
    title: 'الطريقة',
    minutes: 10,
    plan: [
      ['method', 1],
      ['rules', 2],
    ],
  },
  {
    n: 4,
    title: 'امتحان قصير',
    minutes: 12,
    plan: [
      ['products', 2],
      ['method', 2],
      ['wall', 1],
    ],
  },
  {
    n: 5,
    title: 'على منوال الامتحان',
    minutes: 15,
    plan: [
      ['method', 3],
      ['rules', 3],
      ['wall', 1],
    ],
  },
];

/** The divisors a student wrote in the boxes of a « list » question. */
const written = (q, v) => divisorsOf(q.a).map((_, i) => Number(v[`d${i}`]));
const sameSet = (mine, all) => new Set(mine).size === all.length && all.every((d) => mine.includes(d));

/** The points of an answer, by the marking scheme. */
export function mark(q, v) {
  if (!answered(q, v)) return 0;
  const n = (k) => Number(v[k]);
  switch (q.type) {
    case 'factor':
      return n('x') * q.b === q.a ? q.points : 0;
    case 'list':
      return sameSet(written(q, v), divisorsOf(q.a)) ? q.points : 0;
    case 'stop':
      return (n('d') === lastTry(q.a) ? q.points / 2 : 0) + (n('e') === lastTry(q.a) + 1 ? q.points / 2 : 0);
    case 'verdict':
      return (v === 'yes') === (q.a % q.b === 0) ? q.points : 0;
    case 'value':
      return n('x') === q.expected ? q.points : 0;
    default:
      return 0;
  }
}
/** The model copy of a question: what a full-mark paper carries, line by line. */
export function model(q) {
  switch (q.type) {
    case 'factor':
      return [`$${q.a} = ${q.b} \\times ${q.a / q.b}$`, `${q.b} و ${q.a / q.b} قاسمان للعدد ${q.a}.`];
    case 'list':
      return [`$${q.a} = ${pairsText(q.a)}$`, `قواسم ${q.a} هي: ${divisorsOf(q.a).join(' ، ')}.`];
    case 'stop': {
      const d = lastTry(q.a);
      return [
        `$${d}^2 = ${d * d} \\leq ${q.a} < ${(d + 1) * (d + 1)} = ${d + 1}^2$`,
        `نجرّب القسمة على الأعداد من 1 إلى ${d}.`,
      ];
    }
    case 'verdict': {
      const val = READ[q.b].of(q.a);
      const yes = q.a % q.b === 0;
      return [
        `${READ[q.b].label}: ${val}.`,
        `${val} ${val % q.b === 0 ? 'من' : 'ليس من'} مضاعفات ${q.b}، إذن ${q.a} ${yes ? 'يقبل' : 'لا يقبل'} القسمة على ${q.b}.`,
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
    case 'factor':
      return ['كتبتُ المساواة كاملة', 'ذكرتُ القاسمين معًا'];
    case 'list':
      return ['كتبتُ الجداءات بالترتيب: 1 ثمّ 2 ثمّ 3…', 'لم أنسَ شريك أيّ قاسم', 'رتّبتُ القواسم في جملة الجواب'];
    case 'stop':
      return ['كتبتُ الحصر بين المربّعين', 'قلتُ إلى أيّ عدد أجرّب'];
    case 'verdict':
      return ['ذكرتُ القاعدة التي طبّقتُها', 'كتبتُ جملة الجواب كاملة'];
    case 'value':
      return q.checks;
    default:
      return [];
  }
}
/** The claim the server re-computes (kit/claims.js › verifyClaim), or null (a situation's count proves reading, not the rule). */
export function evidenceOf(q, v) {
  if (!q.key || !answered(q, v)) return null;
  const n = (k) => Number(v[k]);
  switch (q.type) {
    case 'factor':
      return { key: q.key, claim: { kind: 'pair', a: q.a, b: q.b, e: n('x') } };
    case 'list': {
      const list = written(q, v);
      return { key: q.key, claim: { kind: 'divisors', a: q.a, b: list.length, list } };
    }
    case 'stop':
      return n('e') === n('d') + 1 ? { key: q.key, claim: { kind: 'stop', a: q.a, b: n('d') } } : null;
    case 'verdict':
      return { key: q.key, claim: { kind: 'divisible', a: q.a, b: q.b, fits: v === 'yes' } };
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
