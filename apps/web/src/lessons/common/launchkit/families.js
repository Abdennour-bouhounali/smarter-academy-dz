/**
 * « عُدّة الانطلاق » — the question FAMILIES, one per earlier الكفاءة (programme item of the learning net), PURE.
 *
 * A family GENERATES its questions (a retake never shows the same numbers) on two levels — 1 very easy, 2 harder — and in
 * several FORMS, each answered by one of the three gestures of the game:
 *   write  the student writes the value in its own shape (« 47 = 6 × ▢ + ▢ »);
 *   sort   three cards, each sent to one of two boxes;
 *   place  a flag dragged on a number line.
 * A question is plain data; `grade(question, answer)` says right or not and, when it is not, NAMES the mistake when the
 * answer shows one (`MISTAKES`): a wrong answer is information, not just « false ». The quick workshop opens on that mistake.
 * A family also carries its repair (`example`: a worked example in steps) and its revision card (`memo`).
 *
 * Adding a family = one entry in FAMILIES keyed by the item id of the net, with tests in launchkit.test.js (every generated
 * question is re-computed there). Phase 1 (2026-11-17): the two prerequisites of « التعرّف على قاسم لعدد طبيعي ».
 */
const int = (rand, lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const pick = (rand, list) => list[Math.floor(rand() * list.length)];
const shuffle = (rand, list) => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const digitSum = (n) =>
  String(n)
    .split('')
    .reduce((s, d) => s + Number(d), 0);
const sumText = (n) => String(n).split('').join(' + ');
const S = (slot, label, w) => ({ slot, label, w });

/** The named mistakes: what the workshop says first when an answer showed one. Never shown during a station. */
export const MISTAKES = {
  'rest-too-big': 'انتبه: الباقي دائمًا أصغر من المقسوم عليه.',
  'rest-negative': 'انتبه: في القسمة الإقليدية نضيف الباقي، ولا نطرح.',
  'equality-false': 'انتبه: تحقّق من المساواة — احسب الجداء ثمّ أضف الباقي.',
  swapped: 'انتبه: لا تخلط بين حاصل القسمة والباقي.',
  overshoot: 'انتبه: المضاعف الذي نبحث عنه لا يتجاوز العدد.',
  'not-greatest': 'انتبه: نبحث عن أكبر مضاعف لا يتجاوز العدد.',
  'not-multiple': 'انتبه: الراية تقف على مضاعف — عدد من جدول الضرب.',
  'digit-anywhere': 'انتبه: القاعدة تنظر إلى آخر رقم فقط.',
  'last-digit': 'انتبه: في قاعدتي 3 و 9 نجمع الأرقام، ولا ننظر إلى آخر رقم.',
  'three-for-nine': 'انتبه: مجموع الأرقام يجب أن يكون في جدول 9، لا في جدول 3 فقط.',
  'even-for-four': 'انتبه: العدد الزوجي لا يقبل دائمًا القسمة على 4 — انظر إلى العدد المكوَّن من آخر رقمين.',
};

// ───────────────────────── 1am.m3.r01 — القسمة الإقليدية ─────────────────────────
const divisionTokens = (a, b) => [
  String(a),
  '=',
  String(b),
  '×',
  S('q', 'حاصل القسمة', String(Math.floor(a / b)).length),
  '+',
  S('r', 'الباقي', String(b - 1).length),
];

function divisionWrite(rand, level, first) {
  const [b, q] =
    level === 1
      ? first
        ? [int(rand, 2, 5), int(rand, 2, 5)]
        : [int(rand, 3, 9), int(rand, 3, 9)]
      : [int(rand, 11, 19), int(rand, 6, 12)];
  const r = int(rand, 1, b - 1);
  const a = b * q + r;
  return { gesture: 'write', a, b, prompt: `أكمل القسمة الإقليدية للعدد ${a} على ${b}.`, tokens: divisionTokens(a, b) };
}

function divisionPlace(rand) {
  const b = int(rand, 4, 9);
  const q = int(rand, 3, Math.min(9, Math.floor(57 / b)));
  const r = int(rand, 1, b - 1);
  const a = b * q + r;
  return {
    gesture: 'place',
    a,
    b,
    max: 60,
    target: b * q,
    prompt: `العدد ${a} مثبَّت على المستقيم. اسحب الراية إلى أكبر مضاعف للعدد ${b} لا يتجاوز ${a}.`,
  };
}

/** Three equalities, each its own division: is it THE Euclidean division of the number by the first factor? */
function divisionSort(rand) {
  const make = (kind, id) => {
    const b = int(rand, 6, 9);
    const q = int(rand, 4, 9);
    const r = int(rand, 2, b - 2);
    const a = b * q + r;
    if (kind === 'ok') return { id, text: `$${a} = ${b} \\times ${q} + ${r}$`, bin: 'yes', trap: null, a, b };
    if (kind === 'big')
      return { id, text: `$${a} = ${b} \\times ${q - 1} + ${r + b}$`, bin: 'no', trap: 'rest-too-big', a, b };
    if (kind === 'neg')
      return { id, text: `$${a} = ${b} \\times ${q + 1} - ${b - r}$`, bin: 'no', trap: 'rest-negative', a, b };
    return { id, text: `$${a} = ${b} \\times ${q} + ${r + 1}$`, bin: 'no', trap: 'equality-false', a, b };
  };
  const kinds = shuffle(
    rand,
    pick(rand, [
      ['ok', 'big', 'neg'],
      ['ok', 'big', 'false'],
      ['ok', 'ok', 'big'],
      ['ok', 'neg', 'big'],
    ]),
  );
  return {
    gesture: 'sort',
    prompt: 'في كلّ مساواة، العدد الأوّل في الجداء هو المقسوم عليه. أرسل كلّ مساواة إلى صندوقها.',
    bins: [
      { id: 'yes', label: 'قسمة إقليدية' },
      { id: 'no', label: 'ليست قسمة إقليدية' },
    ],
    cards: kinds.map((k, i) => make(k, `c${i + 1}`)),
  };
}

function divisionExample(rand, level) {
  const b = level === 1 ? int(rand, 4, 8) : int(rand, 12, 16);
  const q = level === 1 ? int(rand, 4, 8) : int(rand, 6, 9);
  const r = int(rand, 1, b - 1);
  const a = b * q + r;
  return {
    title: `القسمة الإقليدية للعدد ${a} على ${b}`,
    steps: [
      `أبحث في مضاعفات ${b} عن أكبر مضاعف لا يتجاوز ${a}: $${b} \\times ${q} = ${b * q}$ (و $${b} \\times ${q + 1} = ${b * (q + 1)}$ أكبر من ${a}).`,
      `أحسب ما يبقى: $${a} - ${b * q} = ${r}$.`,
      `أتحقّق: الباقي ${r} أصغر من المقسوم عليه ${b}.`,
      `أكتب: $${a} = ${b} \\times ${q} + ${r}$.`,
    ],
  };
}

// ───────────────────────── 1am.m3.r02 — قواعد قابلية القسمة ─────────────────────────
const RULE_TRAPS = {
  2: (n) => (n % 2 !== 0 && /[02468]/.test(String(n).slice(0, -1)) ? 'digit-anywhere' : null),
  5: (n) => (n % 5 !== 0 && /[05]/.test(String(n).slice(0, -1)) ? 'digit-anywhere' : null),
  3: (n) => (n % 3 !== 0 && [3, 6, 9].includes(n % 10) ? 'last-digit' : null),
  9: (n) => (n % 9 !== 0 && n % 3 === 0 ? 'three-for-nine' : n % 9 !== 0 && n % 10 === 9 ? 'last-digit' : null),
  4: (n) => (n % 4 !== 0 && n % 2 === 0 ? 'even-for-four' : null),
};
/** What a « yes » number must look like so that the WRONG rule would refuse it (a rule is tested on both sides). */
const HARD_YES = {
  2: () => true,
  5: () => true,
  3: (n) => ![3, 6, 9].includes(n % 10),
  9: (n) => n % 10 !== 9,
  4: (n) => true,
};

function rulesSort(rand, k, first) {
  const lo = first ? 20 : 100;
  const hi = first ? 99 : 999;
  const find = (test) => {
    for (let i = 0; i < 400; i += 1) {
      const n = int(rand, lo, hi);
      if (test(n)) return n;
    }
    return null;
  };
  const yes = () => find((n) => n % k === 0 && HARD_YES[k](n)) ?? k * int(rand, 12, 30);
  const trap = () => find((n) => RULE_TRAPS[k](n) !== null);
  const no = () => find((n) => n % k !== 0 && RULE_TRAPS[k](n) === null) ?? k * int(rand, 12, 30) + 1;
  const shape = pick(rand, [
    ['yes', 'trap', 'no'],
    ['yes', 'trap', 'yes'],
    ['yes', 'trap', 'trap'],
  ]);
  const used = new Set();
  const cards = [];
  for (const kind of shuffle(rand, shape)) {
    let n = null;
    for (let i = 0; i < 30 && (n === null || used.has(n)); i += 1)
      n = kind === 'yes' ? yes() : kind === 'trap' ? (trap() ?? no()) : no();
    used.add(n);
    cards.push({
      id: `c${cards.length + 1}`,
      text: String(n),
      n,
      bin: n % k === 0 ? 'yes' : 'no',
      trap: RULE_TRAPS[k](n),
    });
  }
  return {
    gesture: 'sort',
    k,
    prompt: `هل يقبل كلّ عدد القسمة على ${k}؟ أرسله إلى صندوقه.`,
    bins: [
      { id: 'yes', label: `يقبل القسمة على ${k}` },
      { id: 'no', label: `لا يقبل القسمة على ${k}` },
    ],
    cards,
  };
}

function rulesExample(rand, level, { k: asked } = {}) {
  const k = asked ?? (level === 1 ? pick(rand, [2, 5]) : pick(rand, [3, 9, 4]));
  const n = (() => {
    for (let i = 0; i < 400; i += 1) {
      const x = int(rand, 100, 999);
      if (RULE_TRAPS[k](x) !== null) return x;
    }
    return 100 * k + 1;
  })();
  const ok = n % k === 0;
  const verdict = `إذن ${n} ${ok ? 'يقبل' : 'لا يقبل'} القسمة على ${k}.`;
  const last = n % 10;
  const two = n % 100;
  if (k === 2 || k === 5)
    return {
      title: `هل يقبل ${n} القسمة على ${k}؟`,
      steps: [
        `أنظر إلى آخر رقم فقط: آخر رقم في ${n} هو ${last}.`,
        k === 2
          ? `العدد يقبل القسمة على 2 عندما يكون آخر رقمه 0 أو 2 أو 4 أو 6 أو 8.`
          : 'العدد يقبل القسمة على 5 عندما يكون آخر رقمه 0 أو 5.',
        verdict,
      ],
    };
  if (k === 4)
    return {
      title: `هل يقبل ${n} القسمة على 4؟`,
      steps: [
        `أنظر إلى العدد المكوَّن من آخر رقمين: ${two}.`,
        `هل ${two} من مضاعفات 4؟ $${two} = 4 \\times ${Math.floor(two / 4)}${two % 4 ? ` + ${two % 4}` : ''}$: ${two % 4 === 0 ? 'نعم' : 'لا'}.`,
        verdict,
      ],
    };
  const s = digitSum(n);
  return {
    title: `هل يقبل ${n} القسمة على ${k}؟`,
    steps: [
      `أجمع أرقام ${n}: $${sumText(n)} = ${s}$.`,
      `هل ${s} من مضاعفات ${k}؟ ${s % k === 0 ? 'نعم' : 'لا'}.`,
      verdict,
    ],
  };
}

export const FAMILIES = {
  '1am.m3.r01': {
    item: '1am.m3.r01',
    lesson: 'qisma-iqlidiya-baqi',
    name: 'القسمة الإقليدية',
    icon: '➗',
    labTool: 'paper',
    mistakes: ['rest-too-big', 'swapped', 'rest-negative'],
    forms: { 1: ['write', 'place'], 2: ['write', 'sort'] },
    make: (rand, level, form, { first = false } = {}) =>
      form === 'place' ? divisionPlace(rand) : form === 'sort' ? divisionSort(rand) : divisionWrite(rand, level, first),
    example: divisionExample,
    // the rules a teacher revises with his class before the lesson, one per screen (« حصّة القسم », CLASS_SESSION.md §5bis)
    rules: [
      {
        id: 'division',
        title: 'القسمة الإقليدية',
        text: 'قسمة عدد طبيعي $a$ على عدد طبيعي غير معدوم $b$ تعطي حاصلًا $q$ وباقيًا $r$، حيث: $a = b \\times q + r$',
        example: '$47 = 6 \\times 7 + 5$: الحاصل 7 والباقي 5.',
        check: { a: 47, b: 6, q: 7, r: 5 },
      },
      {
        id: 'rest',
        title: 'الباقي أصغر من المقسوم عليه',
        text: 'في القسمة الإقليدية، الباقي $r$ دائمًا أصغر من المقسوم عليه $b$: $r < b$',
        example: 'في $38 = 5 \\times 7 + 3$: الباقي 3 أصغر من 5.',
        check: { a: 38, b: 5, q: 7, r: 3 },
      },
    ],
    memo: [
      'القسمة الإقليدية للعدد $a$ على $b$ تعطي حاصلًا $q$ وباقيًا $r$: $a = b \\times q + r$.',
      'الباقي $r$ دائمًا أصغر من المقسوم عليه $b$.',
      'مثال: $47 = 6 \\times 7 + 5$، و $5 < 6$.',
    ],
  },
  '1am.m3.r02': {
    item: '1am.m3.r02',
    lesson: 'qawaid-qabiliyat-qisma',
    name: 'قواعد قابلية القسمة',
    icon: '💡',
    labTool: 'rules',
    mistakes: ['last-digit', 'three-for-nine', 'even-for-four'],
    forms: { 1: ['two', 'five'], 2: ['three', 'nine', 'four'] },
    make: (rand, level, form, { first = false } = {}) =>
      rulesSort(rand, { two: 2, five: 5, three: 3, nine: 9, four: 4 }[form], first),
    example: rulesExample,
    rules: [
      {
        id: 'two-five',
        title: 'قابلية القسمة على 2 وعلى 5',
        text: 'يقبل عدد القسمة على 2 إذا كان آخر رقمه 0 أو 2 أو 4 أو 6 أو 8، ويقبل القسمة على 5 إذا كان آخر رقمه 0 أو 5.',
        example: 'العدد 135 يقبل القسمة على 5، ولا يقبل القسمة على 2.',
        check: { n: 135, yes: [5], no: [2] },
      },
      {
        id: 'three-nine',
        title: 'قابلية القسمة على 3 وعلى 9',
        text: 'يقبل عدد القسمة على 3 (أو على 9) إذا كان مجموع أرقامه من مضاعفات 3 (أو من مضاعفات 9).',
        example: '$1 + 3 + 8 = 12$: العدد 138 يقبل القسمة على 3، ولا يقبل القسمة على 9.',
        check: { n: 138, yes: [3], no: [9], sum: 12 },
      },
      {
        id: 'four',
        title: 'قابلية القسمة على 4',
        text: 'يقبل عدد القسمة على 4 إذا كان العدد المكوَّن من رقميه الأخيرين من مضاعفات 4.',
        example: 'العدد 316 يقبل القسمة على 4، لأنّ $16 = 4 \\times 4$.',
        check: { n: 316, yes: [4], no: [] },
      },
    ],
    memo: [
      'على 2: آخر رقم 0 أو 2 أو 4 أو 6 أو 8. على 5: آخر رقم 0 أو 5.',
      'على 3 (أو 9): مجموع الأرقام من مضاعفات 3 (أو 9).',
      'على 4: العدد المكوَّن من آخر رقمين من مضاعفات 4.',
      'مثال: $138$ → $1 + 3 + 8 = 12$، و 12 من مضاعفات 3: إذن 138 يقبل القسمة على 3.',
    ],
  },
};

export const familyFor = (item) => FAMILIES[item] ?? null;

/** A question of a family: its level and form, the very first of a launch being a near-certain win. */
export function makeQuestion(rand, item, level, form, opts = {}) {
  const f = FAMILIES[item];
  const q = f.make(rand, level, form, opts);
  return { ...q, item, level, form };
}

/** The form of the next question of a level: one not used yet in this launch when the family has another. */
export function pickForm(item, level, used = []) {
  const forms = FAMILIES[item].forms[level];
  return forms.find((f) => !used.includes(`${level}:${f}`)) ?? forms[used.length % forms.length];
}

const num = (x) => (x === '' || x == null ? NaN : Number(x));

/** Is the answer complete enough to be handed in? (every box written, every card sent, the flag moved) */
export function complete(q, answer) {
  if (!answer) return false;
  if (q.gesture === 'write')
    return q.tokens.filter((t) => typeof t === 'object').every((t) => answer[t.slot] !== '' && answer[t.slot] != null);
  if (q.gesture === 'sort') return q.cards.every((c) => answer[c.id] === 'yes' || answer[c.id] === 'no');
  return Number.isFinite(answer.x) && answer.moved === true;
}

/** Right or not — and the NAME of the mistake when the answer shows one. */
export function grade(q, answer) {
  if (q.gesture === 'write') {
    const tq = Math.floor(q.a / q.b);
    const tr = q.a % q.b;
    const aq = num(answer?.q);
    const ar = num(answer?.r);
    if (aq === tq && ar === tr) return { correct: true, mistake: null };
    if (aq === tr && ar === tq && tq !== tr) return { correct: false, mistake: 'swapped' };
    if (q.b * aq + ar === q.a && ar >= q.b) return { correct: false, mistake: 'rest-too-big' };
    return { correct: false, mistake: Number.isFinite(aq) && Number.isFinite(ar) ? 'equality-false' : null };
  }
  if (q.gesture === 'sort') {
    const wrong = q.cards.filter((c) => answer?.[c.id] !== c.bin);
    if (wrong.length === 0) return { correct: true, mistake: null };
    return {
      correct: false,
      mistake:
        wrong.find((c) => c.trap && c.bin === 'no')?.trap ??
        (q.k === 3 || q.k === 9 ? (wrong.some((c) => c.bin === 'yes') ? 'last-digit' : null) : null),
    };
  }
  const x = Number(answer?.x);
  if (x === q.target) return { correct: true, mistake: null };
  if (x > q.a) return { correct: false, mistake: 'overshoot' };
  return { correct: false, mistake: x % q.b === 0 ? 'not-greatest' : 'not-multiple' };
}
