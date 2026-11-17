/**
 * « الامتحان الأبيض » of lesson `qasim-adad-tabii` — the CONTENT of its exam sittings (PURE). The frame — the three phases,
 * a subject adapted to what was missed, the stars — is the kit's (`gameworld/kit/sitting.js`).
 * Here: the exercises of THIS lesson by tier of difficulty, the ladder of its five levels, and for each type of question:
 * `mark` the points of an answer, `model` the lines of the model copy, `scheme` what the corrector looks for on the paper,
 * `evidenceOf` the claim sent to the server (first and only try, unassisted: the strongest evidence of the game).
 */
import { divide } from '../../../../../../common/gameworld/divisorIsles/logic';
import { longDivision, conclusion } from '../../../../../../common/gameworld/kit/longDivision';
import { int, pick } from '../../../../../../common/gameworld/kit/random';
import { answered, createSittings, slot as S } from '../../../../../../common/gameworld/kit/sitting';
import { PHRASES } from './trainer';

const eq = (a, b, q, r) => (r ? `$${a} = ${b} \\times ${q} + ${r}$` : `$${a} = ${b} \\times ${q}$`);

/** The two words a verdict is chosen from, and the four phrasings of « أكمل بالعبارة المناسبة ». */
const VERDICT = [
  { value: 'yes', text: 'قاسم' },
  { value: 'no', text: 'ليس قاسمًا' },
];
const PHRASE_CHOICE = PHRASES.map((p) => ({ value: p.id, text: p.text }));

/** The points of each kind of exercise (the ladder shows a level's total before any subject exists). */
const POINTS = { division: 3, product: 3, cost: 4, trip: 5 };

// ── the exercises, by tier of difficulty (1 = small numbers … 3 = exam size) ──
const TIER = {
  division: [
    [6, 12, 6, 12],
    [12, 29, 11, 24],
    [23, 47, 21, 39],
  ],
  product: [
    [3, 9, 6, 12],
    [6, 15, 12, 28],
    [6, 15, 12, 28],
  ],
};
function exDivision(rand, tier) {
  const [bl, bh, ql, qh] = TIER.division[tier - 1];
  const b = int(rand, bl, bh);
  const q = int(rand, ql, qh);
  const r = rand() < 0.5 ? 0 : int(rand, 1, b - 1);
  const a = b * q + r;
  return {
    kind: 'division',
    title: 'القسمة والقاسم',
    points: POINTS.division,
    statement: `نعتبر العددين الطبيعيين ${a} و ${b}.`,
    questions: [
      {
        type: 'division',
        key: 'qasim-baqi',
        points: 1.5,
        a,
        b,
        text: `أجرِ القسمة الإقليدية للعدد ${a} على ${b}.`,
        tokens: [String(a), '=', String(b), '×', S('q', 'حاصل القسمة', 2), '+', S('r', 'الباقي', 2)],
      },
      {
        type: 'verdict',
        key: 'qasim-baqi',
        points: 1.5,
        a,
        b,
        text: `هل ${b} قاسم للعدد ${a}؟ علّل.`,
        sentence: [String(b), { choice: VERDICT }, 'للعدد', String(a)],
      },
    ],
  };
}
function exProduct(rand, tier) {
  const [bl, bh, ql, qh] = TIER.product[tier - 1];
  let b;
  let q;
  do {
    b = int(rand, bl, bh);
    q = int(rand, ql, qh);
  } while (b === q);
  const a = b * q;
  const smallFirst = rand() < 0.5;
  return {
    kind: 'product',
    title: 'القاسم والجداء',
    points: POINTS.product,
    statement: `نعطي المساواة: ${eq(a, b, q, 0).replace(String(q), '\\square')}.`,
    questions: [
      {
        type: 'factor',
        key: 'qasim-jidaa',
        points: 1,
        a,
        b,
        text: `أكمل المساواة، ثمّ بيّن أنّ ${b} قاسم للعدد ${a}.`,
        tokens: [String(a), '=', String(b), '×', S('x', 'العدد الناقص', 2)],
      },
      {
        type: 'other',
        key: 'qasim-jidaa',
        points: 1,
        a,
        b,
        text: `استنتج قاسمًا آخر للعدد ${a}.`,
        tokens: [S('x', 'قاسم آخر', 3)],
      },
      {
        type: 'phrase',
        key: 'siyagh-mutakafia',
        points: 1,
        a,
        b,
        x: smallFirst ? b : a,
        y: smallFirst ? a : b,
        smallFirst,
        text: 'أكمل بالعبارة المناسبة.',
        sentence: [String(smallFirst ? b : a), { choice: PHRASE_CHOICE }, String(smallFirst ? a : b)],
      },
    ],
  };
}
function exCost(rand, tier) {
  const b = pick(rand, tier === 1 ? [8, 10, 12] : [12, 15, 16, 18, 24]);
  const q = tier === 1 ? int(rand, 6, 10) : int(rand, 9, 16);
  const n = b * q;
  const price = pick(rand, tier === 1 ? [100, 150] : [150, 180, 250]);
  const bad =
    pick(
      rand,
      [b - 5, b - 3, b - 2, b + 2, b + 3, b + 5].filter((x) => x >= 5 && n % x !== 0),
    ) ?? b + 1;
  return {
    kind: 'cost',
    situation: true,
    title: 'وضعيّة: الصناديق',
    points: POINTS.cost,
    statement: `طلبت مدرسة ${n} علبة تمر من تعاونية الواحة، في صناديق مملوءة تمامًا. في المخزن نوعان من الصناديق: نوع يتّسع لـ ${bad} علبة ونوع يتّسع لـ ${b} علبة. ثمن الصندوق الواحد ${price} دج.`,
    questions: [
      {
        type: 'division',
        key: 'qasim-baqi',
        points: 1,
        a: n,
        b: bad,
        text: `أجرِ القسمة الإقليدية للعدد ${n} على ${bad}. هل يصلح هذا النوع؟`,
        tokens: [String(n), '=', String(bad), '×', S('q', 'حاصل القسمة', 2), '+', S('r', 'الباقي', 2)],
      },
      {
        type: 'count',
        key: 'qasim-baqi',
        points: 1.5,
        a: n,
        b,
        text: `بيّن أنّ ${b} قاسم للعدد ${n}، ثمّ استنتج عدد الصناديق اللازمة.`,
        tokens: [S('x', 'عدد الصناديق', 2)],
      },
      {
        type: 'money',
        key: null,
        points: 1.5,
        q,
        price,
        text: 'ما المبلغ الذي تدفعه المدرسة ثمنًا للصناديق؟',
        tokens: [S('x', 'المبلغ', 5), 'دج'],
      },
    ],
  };
}
/** The exam classic: the remainder MEANS something — one more truck, and empty places in it. */
function exTrip(rand) {
  const b = pick(rand, [24, 30, 36, 40, 48]);
  const q = int(rand, 3, 6);
  const r = int(rand, 5, b - 6);
  const n = b * q + r;
  const price = pick(rand, [4500, 6000, 7500]);
  return {
    kind: 'trip',
    situation: true,
    title: 'وضعيّة: الشاحنات',
    points: POINTS.trip,
    statement: `${n} صندوقًا جاهزة للتصدير. الشاحنة الواحدة تحمل ${b} صندوقًا، وكراؤها ${price} دج. كلّ الصناديق يجب أن ترحل.`,
    questions: [
      {
        type: 'division',
        key: 'qasim-baqi',
        points: 1,
        a: n,
        b,
        text: `أجرِ القسمة الإقليدية للعدد ${n} على ${b}.`,
        tokens: [String(n), '=', String(b), '×', S('q', 'حاصل القسمة', 2), '+', S('r', 'الباقي', 2)],
      },
      {
        type: 'ceil',
        key: 'qasim-baqi',
        points: 1.5,
        a: n,
        b,
        text: 'كم شاحنة نحتاج؟ علّل.',
        tokens: [S('x', 'عدد الشاحنات', 2)],
      },
      {
        type: 'value',
        key: null,
        points: 1,
        expected: b - r,
        text: 'كم مكانًا يبقى فارغًا في الشاحنة الأخيرة؟',
        tokens: [S('x', 'الأماكن الفارغة', 2)],
        lines: [`في الشاحنة الأخيرة ${r} صندوقًا من ${b}.`, `$${b} - ${r} = ${b - r}$ مكانًا فارغًا.`],
        checks: ['قرأتُ الباقي: هو ما تحمله الشاحنة الأخيرة', 'كتبتُ جملة الجواب كاملة'],
      },
      {
        type: 'money',
        key: null,
        points: 1.5,
        q: q + 1,
        price,
        text: 'ما المبلغ الذي ندفعه كراءً للشاحنات؟',
        tokens: [S('x', 'المبلغ', 5), 'دج'],
      },
    ],
  };
}
const BUILD = { division: exDivision, product: exProduct, cost: exCost, trip: exTrip };

/**
 * THE LADDER of « فضاء الامتحان »: five levels, from one exercise in five minutes to a full short exam.
 * Each level lists its exercises as [kind, tier]. `PASS` of the points climbs a level.
 */
export const LEVELS = [
  { n: 1, title: 'القسمة والقاسم', minutes: 5, plan: [['division', 1]] },
  {
    n: 2,
    title: 'القاسم والجداء',
    minutes: 8,
    plan: [
      ['division', 1],
      ['product', 1],
    ],
  },
  {
    n: 3,
    title: 'أوّل وضعيّة',
    minutes: 10,
    plan: [
      ['product', 2],
      ['cost', 1],
    ],
  },
  {
    n: 4,
    title: 'امتحان قصير',
    minutes: 12,
    plan: [
      ['division', 2],
      ['product', 2],
      ['cost', 2],
    ],
  },
  {
    n: 5,
    title: 'على منوال الامتحان',
    minutes: 15,
    plan: [
      ['division', 3],
      ['cost', 2],
      ['trip', 1],
    ],
  },
];
/** The points of an answer, by the marking scheme. Half the points of a division for the quotient, half for the remainder. */
export function mark(q, v) {
  if (!answered(q, v)) return 0;
  const n = (k) => Number(v[k]);
  switch (q.type) {
    case 'division': {
      const d = divide(q.a, q.b);
      return (n('q') === d.q ? q.points / 2 : 0) + (n('r') === d.r ? q.points / 2 : 0);
    }
    case 'verdict':
      return (v === 'yes') === (q.a % q.b === 0) ? q.points : 0;
    case 'factor':
    case 'count':
      return n('x') * q.b === q.a ? q.points : 0;
    case 'ceil':
      return n('x') === Math.ceil(q.a / q.b) ? q.points : 0;
    case 'value':
      return n('x') === q.expected ? q.points : 0;
    case 'other':
      return n('x') > 0 && q.a % n('x') === 0 && (n('x') !== q.b || q.b * q.b === q.a) ? q.points : 0;
    case 'phrase':
      return PHRASES.find((p) => p.id === v)?.small === q.smallFirst ? q.points : 0;
    case 'money':
      return n('x') === q.q * q.price ? q.points : 0;
    default:
      return 0;
  }
}
/** The model copy of a question: what a full-mark paper carries, line by line. */
export function model(q) {
  switch (q.type) {
    case 'division': {
      const c = conclusion(longDivision(q.a, q.b));
      return [c.equality, c.check];
    }
    case 'verdict': {
      const c = conclusion(longDivision(q.a, q.b));
      return [c.equality, c.sentence];
    }
    case 'factor':
      return [eq(q.a, q.b, q.a / q.b, 0), `${q.a / q.b} عدد طبيعي، إذن ${q.b} قاسم للعدد ${q.a}.`];
    case 'other':
      return [
        `$${q.a} = ${q.b} \\times ${q.a / q.b} = ${q.a / q.b} \\times ${q.b}$`,
        `إذن ${q.a / q.b} قاسم للعدد ${q.a} أيضًا.`,
      ];
    case 'phrase':
      return [
        eq(q.a, q.b, q.a / q.b, 0),
        PHRASES.filter((p) => p.small === q.smallFirst)
          .map((p) => `«${q.x} ${p.text} ${q.y}»`)
          .join(' أو '),
      ];
    case 'count':
      return [eq(q.a, q.b, q.a / q.b, 0), `الباقي 0، إذن ${q.b} قاسم للعدد ${q.a}: نحتاج ${q.a / q.b} صندوقًا.`];
    case 'money':
      return [`$${q.q} \\times ${q.price} = ${q.q * q.price}$`, `المبلغ: ${q.q * q.price} دج.`];
    case 'ceil': {
      const d = divide(q.a, q.b);
      return [
        eq(q.a, q.b, d.q, d.r),
        `${d.q} شاحنة مملوءة، وتبقى ${d.r} صندوقًا: نحتاج $${d.q} + 1 = ${d.q + 1}$ شاحنة.`,
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
  const sentence = 'كتبتُ جملة الجواب كاملة';
  switch (q.type) {
    case 'division':
      return [
        'وضعتُ القسمة على الورقة',
        'كتبتُ المساواة $a = b \\times q + r$',
        'تحقّقتُ أنّ الباقي أصغر من المقسوم عليه',
      ];
    case 'verdict':
      return ['ذكرتُ الباقي في التعليل', sentence];
    case 'factor':
      return ['كتبتُ المساواة كاملة', 'قلتُ إنّ العدد الناقص عدد طبيعي'];
    case 'other':
      return ['قرأتُ المساواة في الاتجاهين', sentence];
    case 'phrase':
      return ['حدّدتُ من القاسم ومن المضاعف'];
    case 'count':
      return ['كتبتُ القسمة وباقيها 0', sentence];
    case 'money':
      return ['كتبتُ العمليّة قبل النتيجة', 'كتبتُ الوحدة (دج)'];
    case 'ceil':
      return ['كتبتُ القسمة وباقيها', 'لم أنسَ شاحنة الباقي', sentence];
    case 'value':
      return q.checks;
    default:
      return [];
  }
}

/** The claim the server re-computes (evidence.js › verify), or null (a sum of money proves arithmetic, not the lesson). */
export function evidenceOf(q, v) {
  if (!q.key || !answered(q, v)) return null;
  const n = (k) => Number(v[k]);
  switch (q.type) {
    case 'division':
      return { key: q.key, claim: { kind: 'division', a: q.a, b: q.b, q: n('q'), r: n('r'), fits: n('r') === 0 } };
    case 'factor':
      return { key: q.key, claim: { kind: 'product', a: q.a, b: q.b, q: n('x'), other: n('x') } };
    case 'phrase':
      return { key: q.key, claim: { kind: 'phrase', a: q.a, b: q.b, first: q.x, phrase: v } };
    case 'count':
    case 'ceil':
      return { key: q.key, claim: { kind: 'containers', a: q.a, b: q.b, count: n('x') } };
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
