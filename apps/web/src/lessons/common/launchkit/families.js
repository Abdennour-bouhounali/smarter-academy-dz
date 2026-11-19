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
 * question is re-computed there). Phase 1 (2026-11-17): the two prerequisites of « التعرّف على قاسم لعدد طبيعي », then
 * « التعرّف على قاسم » itself, which the next lesson stands on; 2026-11-18: the 2AM Euclidean division (any divisor), the
 * second core tool of « قواسم عدد طبيعي » and « خواص قواسم » and a core tool of the PGCD lessons.
 * A sort card is a number or an equality (`text`), or a SENTENCE in Arabic (`say: true`, drawn right-to-left, smaller).
 * A card the student must ACCEPT may name the mistake of refusing it (`miss`), as a `trap` names the mistake of accepting.
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
  'product-false': 'انتبه: تحقّق من المساواة — احسب الجداء.',
  'rest-not-zero': 'انتبه: العدد قاسم عندما يكون باقي القسمة 0 — تحقّق بالقسمة.',
  'multiple-for-divisor': 'انتبه: لا تخلط بين القاسم والمضاعف — قاسم العدد لا يتجاوزه.',
  'sentence-reversed': 'انتبه: ترتيب العددين مهمّ — نقول « 6 قاسم للعدد 42 » و « 42 مضاعف للعدد 6 ».',
  'one-and-itself': 'انتبه: العدد 1 والعدد نفسه قاسمان دائمًا.',
  'quotient-zero': 'انتبه: إذا كان العدد أصغر من المقسوم عليه، فالحاصل 0 والباقي هو العدد نفسه.',
  'table-slip': 'انتبه: راجع جدول الضرب — جوابك جداء عدد مجاور.',
  'borrow-forgot': 'انتبه: إذا كان رقم الآحاد أصغر، نستلف عشرة — لا نطرح الرقم الصغير من الكبير.',
  'order-ops': 'انتبه: نحسب الجداء أوّلًا، ثمّ نضيف.',
  'add-for-sub': 'انتبه: الطرح يُنقص العدد — الراية ترجع نحو 0.',
};

// ───────────────────────── 1am.m1.r01 — الجمع والطرح والضرب ─────────────────────────
// What the Euclidean division of 1AM stands on (the net's `requires`): a product of the table, a difference « what is left »,
// and the recomposition « b × q + r » computed in the right order. A question of this family carries its operation in
// `calc` ({ op, x, y, z }): `grade` re-computes the value from it — never a stored answer.
const CALC = {
  times: (c) => c.x * c.y,
  minus: (c) => c.x - c.y,
  timesPlus: (c) => c.x * c.y + c.z,
};
const calcValue = (c) => CALC[c.op](c);
/** The difference written digit by digit, the small digit taken from the big one (the borrow forgotten). */
const borrowless = (x, y) => {
  const [a, b] = [String(x), String(y).padStart(String(x).length, '0')];
  return Number([...a].map((d, i) => Math.abs(Number(d) - Number(b[i]))).join(''));
};
const calcText = (c) =>
  c.op === 'minus' ? `${c.x} - ${c.y}` : c.op === 'times' ? `${c.x} \\times ${c.y}` : `${c.x} \\times ${c.y} + ${c.z}`;
const calcTokens = (c) => {
  const w = String(calcValue(c)).length;
  const head =
    c.op === 'minus'
      ? [String(c.x), '−', String(c.y)]
      : c.op === 'times'
        ? [String(c.x), '×', String(c.y)]
        : [String(c.x), '×', String(c.y), '+', String(c.z)];
  return [...head, '=', S('v', 'الناتج', w)];
};
/** A two-digit subtraction that needs a borrow: the units digit of x is smaller than that of y. */
const borrowPair = (rand, lo, hi) => {
  for (let i = 0; i < 200; i += 1) {
    const x = int(rand, lo, hi);
    const y = int(rand, 13, x - 10);
    if (x % 10 < y % 10) return { x, y };
  }
  return { x: 72, y: 47 };
};

function calcWrite(rand, level, first) {
  const op = first
    ? 'times'
    : level === 1
      ? pick(rand, ['times', 'minus'])
      : pick(rand, ['times', 'minus', 'timesPlus']);
  let c;
  if (op === 'times')
    c =
      level === 1
        ? first
          ? { op, x: int(rand, 3, 5), y: int(rand, 3, 5) }
          : { op, x: int(rand, 3, 9), y: int(rand, 3, 9) }
        : { op, x: int(rand, 12, 29), y: int(rand, 3, 9) };
  else if (op === 'minus')
    c =
      level === 1
        ? {
            op,
            ...(() => {
              const x = int(rand, 30, 69);
              return { x, y: int(rand, 11, x - 3) };
            })(),
          }
        : { op, ...borrowPair(rand, 120, 199) };
  else {
    const x = int(rand, 6, 9);
    c = { op, x, y: int(rand, 6, 12), z: int(rand, 1, x - 1) };
  }
  const prompt =
    c.op === 'times'
      ? `في كلّ علبة ${c.y} أقلام، وعدد العلب ${c.x}. كم قلمًا في المجموع؟`
      : c.op === 'minus'
        ? `مع سارة ${c.x} دج، اشترت كرّاسًا بـ ${c.y} دج. كم بقي معها؟`
        : `في كلّ صفيحة ${c.x} بيضات، وعدد الصفائح ${c.y}، وخارج الصفائح ${c.z} من البيض. كم بيضة في المجموع؟`;
  return { gesture: 'write', calc: c, prompt, tokens: calcTokens(c) };
}

/** The flag on « a − d »: the number a is pinned on the 0–60 line, the student counts back d. */
function calcPlace(rand) {
  const a = int(rand, 25, 58);
  const d = int(rand, 3, 9);
  return {
    gesture: 'place',
    a,
    max: 60,
    target: a - d,
    calc: { op: 'minus', x: a, y: d },
    prompt: `العدد ${a} مثبَّت على المستقيم. اسحب الراية إلى ناتج $${a} - ${d}$.`,
  };
}

/** Three equalities: true, or false the way a student slips — a neighbour of the table, the sum before the product, the borrow. */
function calcSort(rand) {
  const make = (kind, id) => {
    const card = (c, shown, trap = null) => ({
      id,
      text: `$${calcText(c)} = ${shown}$`,
      bin: shown === calcValue(c) ? 'yes' : 'no',
      trap,
    });
    if (kind === 'times' || kind === 'slip') {
      const c = { op: 'times', x: int(rand, 6, 9), y: int(rand, 6, 9) };
      return kind === 'times' ? card(c, calcValue(c)) : card(c, c.x * (c.y + pick(rand, [-1, 1])), 'table-slip');
    }
    if (kind === 'tp' || kind === 'order') {
      const x = int(rand, 4, 9);
      const c = { op: 'timesPlus', x, y: int(rand, 4, 9), z: int(rand, 2, x - 1) };
      return kind === 'tp' ? card(c, calcValue(c)) : card(c, c.x * (c.y + c.z), 'order-ops');
    }
    const c = { op: 'minus', ...borrowPair(rand, 52, 98) };
    return kind === 'minus' ? card(c, calcValue(c)) : card(c, borrowless(c.x, c.y), 'borrow-forgot');
  };
  const kinds = shuffle(
    rand,
    pick(rand, [
      ['tp', 'order', 'borrow'],
      ['times', 'order', 'minus'],
      ['minus', 'borrow', 'slip'],
      ['tp', 'slip', 'times'],
      ['order', 'tp', 'borrow'],
    ]),
  );
  const cards = [];
  for (const kind of kinds) {
    let c = make(kind, `c${cards.length + 1}`);
    for (let i = 0; i < 20 && cards.some((o) => o.text === c.text); i += 1) c = make(kind, c.id);
    cards.push(c);
  }
  return {
    gesture: 'sort',
    prompt: 'هل كلّ مساواة صحيحة؟ أرسلها إلى صندوقها.',
    bins: [
      { id: 'yes', label: 'صحيحة' },
      { id: 'no', label: 'خاطئة' },
    ],
    cards,
  };
}

/** The worked example answers the mistake shown: the order (product first), the borrow, or the product of the table. */
function calcExample(rand, level, { mistake = null } = {}) {
  if (mistake === 'order-ops') {
    const x = int(rand, 6, 9);
    const [y, z] = [int(rand, 4, 9), int(rand, 1, x - 1)];
    return {
      title: 'نضرب أوّلًا، ثمّ نضيف',
      steps: [
        `أحسب الجداء أوّلًا: $${x} \\times ${y} = ${x * y}$.`,
        `ثمّ أضيف: $${x * y} + ${z} = ${x * y + z}$.`,
        `أكتب: $${x} \\times ${y} + ${z} = ${x * y + z}$.`,
      ],
    };
  }
  if (mistake === 'borrow-forgot' || mistake === 'add-for-sub') {
    const { x, y } = borrowPair(rand, 52, 98);
    const [xt, xu, yt, yu] = [Math.floor(x / 10), x % 10, Math.floor(y / 10), y % 10];
    return {
      title: 'الطرح مع الاستلاف',
      steps: [
        `في الآحاد ${xu} أصغر من ${yu}: أستلف عشرة، $${xu + 10} - ${yu} = ${xu + 10 - yu}$.`,
        `في العشرات بقي ${xt - 1}: $${xt - 1} - ${yt} = ${xt - 1 - yt}$.`,
        `أكتب: $${x} - ${y} = ${x - y}$.`,
        `أتحقّق بالجمع: $${x - y} + ${y} = ${x}$.`,
      ],
    };
  }
  if (level === 1) {
    const [x, y] = [int(rand, 4, 9), int(rand, 3, 9)];
    return {
      title: `جداء من جدول ${y}`,
      steps: [
        `أنطلق من جداء أعرفه: $${x - 1} \\times ${y} = ${(x - 1) * y}$.`,
        `أضيف ${y} مرّة أخرى: $${(x - 1) * y} + ${y} = ${x * y}$.`,
        `أكتب: $${x} \\times ${y} = ${x * y}$.`,
      ],
    };
  }
  const [x, y] = [int(rand, 12, 29), int(rand, 3, 9)];
  const [t, u] = [Math.floor(x / 10) * 10, x % 10];
  return {
    title: 'جداء عدد من رقمين في عدد من رقم واحد',
    steps: [
      `أفكّك ${x} إلى عشرات وآحاد: $${x} = ${t} + ${u}$.`,
      `$${t} \\times ${y} = ${t * y}$ و $${u} \\times ${y} = ${u * y}$.`,
      `أجمع: $${t * y} + ${u * y} = ${x * y}$.`,
      `أكتب: $${x} \\times ${y} = ${x * y}$.`,
    ],
  };
}

/** Right or not for a question that carries its operation (`calc`): the value is re-computed, the slip named. */
function gradeCalc(q, answer) {
  if (q.gesture === 'place') {
    const x = Number(answer?.x);
    if (x === q.target) return { correct: true, mistake: null };
    return { correct: false, mistake: x === q.calc.x + q.calc.y ? 'add-for-sub' : null };
  }
  const c = q.calc;
  const v = num(answer?.v);
  if (v === calcValue(c)) return { correct: true, mistake: null };
  if (!Number.isFinite(v)) return { correct: false, mistake: null };
  const p = c.x * c.y;
  const slip = (w) => [c.x * (c.y - 1), c.x * (c.y + 1), (c.x - 1) * c.y, (c.x + 1) * c.y].includes(w) && w !== p;
  if (c.op === 'times') return { correct: false, mistake: slip(v) ? 'table-slip' : null };
  if (c.op === 'timesPlus')
    return { correct: false, mistake: v === c.x * (c.y + c.z) ? 'order-ops' : slip(v - c.z) ? 'table-slip' : null };
  return {
    correct: false,
    mistake: v === borrowless(c.x, c.y) ? 'borrow-forgot' : v === c.x + c.y ? 'add-for-sub' : null,
  };
}

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
  4: () => true,
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

// ───────────────────────── 2am.m1.r04 — القسمة الإقليدية على أيّ عدد غير معدوم ─────────────────────────
// What 2AM adds to the 1AM division (the net's `extends`): the divisor is ANY number — two digits here, a quotient of two
// digits at level 2 — and the remainder keeps 0 ≤ r < b, a number smaller than the divisor included (quotient 0).
function anyWrite(rand, level, first) {
  const [b, q, r] = (() => {
    if (level === 2) {
      const d = int(rand, 12, 25);
      return [d, int(rand, 10, 25), int(rand, 0, d - 1)];
    }
    if (first) return [int(rand, 10, 12), 2, int(rand, 1, 5)];
    const d = int(rand, 11, 19);
    return [d, int(rand, 2, 5), int(rand, 1, d - 1)];
  })();
  const a = b * q + r;
  return { gesture: 'write', a, b, prompt: `أكمل القسمة الإقليدية للعدد ${a} على ${b}.`, tokens: divisionTokens(a, b) };
}

/** The flag on the greatest multiple of a two-digit divisor — the line stays the 0–60 one, so the quotient is small. */
function anyPlace(rand) {
  const b = int(rand, 11, 15);
  const q = int(rand, 2, Math.floor(57 / b));
  const r = int(rand, 1, Math.min(b - 1, 59 - b * q));
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

/** Three equalities with a two-digit divisor; a number SMALLER than the divisor (quotient 0) must be accepted. */
function anySort(rand) {
  const make = (kind, id) => {
    const b = int(rand, 12, 25);
    const q = int(rand, 3, 9);
    const r = int(rand, 2, b - 2);
    const a = b * q + r;
    const card = (text, bin, trap = null, miss = null) => ({ id, text, bin, trap, miss });
    if (kind === 'small') {
      const s = int(rand, 2, b - 1);
      return card(`$${s} = ${b} \\times 0 + ${s}$`, 'yes', null, 'quotient-zero');
    }
    if (kind === 'exact') return card(`$${b * q} = ${b} \\times ${q} + 0$`, 'yes');
    if (kind === 'ok') return card(`$${a} = ${b} \\times ${q} + ${r}$`, 'yes');
    if (kind === 'big') return card(`$${a} = ${b} \\times ${q - 1} + ${r + b}$`, 'no', 'rest-too-big');
    if (kind === 'neg') return card(`$${a} = ${b} \\times ${q + 1} - ${b - r}$`, 'no', 'rest-negative');
    return card(`$${a} = ${b} \\times ${q} + ${r + 1}$`, 'no', 'equality-false');
  };
  const kinds = shuffle(
    rand,
    pick(rand, [
      ['ok', 'big', 'small'],
      ['small', 'neg', 'false'],
      ['ok', 'big', 'neg'],
      ['exact', 'big', 'small'],
      ['small', 'big', 'ok'],
    ]),
  );
  const cards = [];
  for (const kind of kinds) {
    let c = make(kind, `c${cards.length + 1}`);
    for (let i = 0; i < 20 && cards.some((o) => o.text === c.text); i += 1) c = make(kind, c.id);
    cards.push(c);
  }
  return {
    gesture: 'sort',
    prompt: 'في كلّ مساواة، العدد الأوّل في الجداء هو المقسوم عليه. أرسل كلّ مساواة إلى صندوقها.',
    bins: [
      { id: 'yes', label: 'قسمة إقليدية' },
      { id: 'no', label: 'ليست قسمة إقليدية' },
    ],
    cards,
  };
}

/** The worked example: the quotient estimated by tens (level 2), then the greatest multiple; or the quotient 0 when that was missed. */
function anyExample(rand, level, { mistake = null } = {}) {
  if (mistake === 'quotient-zero') {
    const b = int(rand, 12, 25);
    const a = int(rand, 2, b - 1);
    return {
      title: `القسمة الإقليدية للعدد ${a} على ${b}`,
      steps: [
        `العدد ${a} أصغر من المقسوم عليه ${b}: لا يحتوي ${a} على ${b} ولا مرّة واحدة.`,
        `إذن الحاصل 0، والباقي هو ${a} نفسه، وهو أصغر من ${b}.`,
        `أكتب: $${a} = ${b} \\times 0 + ${a}$.`,
      ],
    };
  }
  const b = level === 1 ? int(rand, 11, 19) : int(rand, 12, 25);
  const q = level === 1 ? int(rand, 2, 6) : int(rand, 11, 29);
  const r = int(rand, 1, b - 1);
  const a = b * q + r;
  const t = Math.floor(q / 10) * 10;
  return {
    title: `القسمة الإقليدية للعدد ${a} على ${b}`,
    steps: [
      ...(level === 2
        ? [
            `أقدّر الحاصل بالعشرات: $${b} \\times ${t} = ${b * t}$ و $${b} \\times ${t + 10} = ${b * (t + 10)}$، إذن الحاصل بين ${t} و ${t + 10}.`,
          ]
        : []),
      `أبحث عن أكبر مضاعف للعدد ${b} لا يتجاوز ${a}: $${b} \\times ${q} = ${b * q}$ (و $${b} \\times ${q + 1} = ${b * (q + 1)}$ أكبر من ${a}).`,
      `أحسب ما يبقى: $${a} - ${b * q} = ${r}$، و ${r} أصغر من ${b}.`,
      `أكتب: $${a} = ${b} \\times ${q} + ${r}$.`,
    ],
  };
}

// ───────────────────────── 4am.m1.r01 — التعرّف على قاسم لعدد طبيعي ─────────────────────────
/** « a = b × ▢ »: the equality that SHOWS b is a divisor of a (no remainder to write: the box of the remainder is gone). */
function divisorWrite(rand, level, first) {
  const [b, q] =
    level === 1
      ? first
        ? [int(rand, 2, 5), int(rand, 3, 5)]
        : [int(rand, 3, 9), int(rand, 3, 9)]
      : [int(rand, 11, 19), int(rand, 4, 9)];
  const a = b * q;
  return {
    gesture: 'write',
    a,
    b,
    prompt: `العدد ${b} قاسم للعدد ${a}. أكمل المساواة التي تبيّن ذلك.`,
    tokens: [String(a), '=', String(b), '×', S('q', 'حاصل القسمة', String(q).length)],
  };
}

const PICK_FROM = { first: [12, 18, 20, 24], 1: [24, 28, 30, 36, 40, 42, 48], 2: [54, 56, 60, 63, 72, 84, 90, 96] };
const PICK_SHAPES = {
  1: [
    ['yes', 'near', 'multiple'],
    ['yes', 'near', 'yes'],
    ['yes', 'near', 'near'],
  ],
  // level 2 always shows 1 or the number itself: the two divisors a student forgets
  2: [
    ['yes', 'near', 'edge'],
    ['edge', 'multiple', 'near'],
    ['yes', 'multiple', 'edge'],
  ],
};

/** Three numbers: is each one a divisor of `of`? A multiple of it (the usual confusion) is one of the traps. */
function divisorPick(rand, level, first) {
  const of = pick(rand, PICK_FROM[level === 1 && first ? 'first' : level]);
  const top = level === 1 ? 9 : 16;
  const range = [];
  for (let n = 2; n <= top; n += 1) range.push(n);
  const draw = {
    yes: () =>
      pick(
        rand,
        range.filter((n) => of % n === 0),
      ),
    near: () =>
      pick(
        rand,
        range.filter((n) => of % n !== 0),
      ),
    multiple: () => of * pick(rand, [2, 3]),
    edge: () => pick(rand, [1, of]),
  };
  const used = new Set();
  const cards = [];
  for (const kind of shuffle(rand, pick(rand, PICK_SHAPES[level]))) {
    let n = null;
    for (let i = 0; i < 40 && (n === null || used.has(n)); i += 1) n = draw[kind]();
    used.add(n);
    const yes = of % n === 0;
    cards.push({
      id: `c${cards.length + 1}`,
      text: String(n),
      n,
      bin: yes ? 'yes' : 'no',
      trap: yes ? null : n > of ? 'multiple-for-divisor' : 'rest-not-zero',
      miss: yes && (n === 1 || n === of) ? 'one-and-itself' : null,
    });
  }
  return {
    gesture: 'sort',
    of,
    prompt: `هل كلّ عدد قاسم للعدد ${of}؟ أرسله إلى صندوقه.`,
    bins: [
      { id: 'yes', label: `قاسم للعدد ${of}` },
      { id: 'no', label: `ليس قاسمًا للعدد ${of}` },
    ],
    cards,
  };
}

/** The three ways of saying it; a card is { x, y, verb } and is TRUE when `SENTENCES[verb].holds(x, y)`. */
const SENTENCES = {
  divisor: { say: (x, y) => `${x} قاسم للعدد ${y}`, holds: (x, y) => y % x === 0 },
  multiple: { say: (x, y) => `${x} مضاعف للعدد ${y}`, holds: (x, y) => x % y === 0 },
  divisible: { say: (x, y) => `${x} يقبل القسمة على ${y}`, holds: (x, y) => x % y === 0 },
};
const VERBS = Object.keys(SENTENCES);

/** Three sentences, each on its own two numbers: true, turned round (the two numbers swapped), or with a remainder. */
function divisorSentences(rand) {
  const make = (kind, id) => {
    const b = int(rand, 6, 12);
    const a = b * int(rand, 4, 9);
    const big = kind === 'rest' ? a + int(rand, 1, b - 1) : a;
    const verb = pick(rand, VERBS);
    // said the right way round, the small number comes first only with « قاسم »
    const straight = verb === 'divisor' ? [b, big] : [big, b];
    const [x, y] = kind === 'reversed' ? [straight[1], straight[0]] : straight;
    return {
      id,
      text: SENTENCES[verb].say(x, y),
      say: true,
      x,
      y,
      verb,
      bin: kind === 'true' ? 'yes' : 'no',
      trap: kind === 'reversed' ? 'sentence-reversed' : kind === 'rest' ? 'rest-not-zero' : null,
    };
  };
  const kinds = shuffle(
    rand,
    pick(rand, [
      ['true', 'reversed', 'rest'],
      ['true', 'reversed', 'true'],
      ['true', 'rest', 'reversed'],
    ]),
  );
  const cards = [];
  for (const kind of kinds) {
    let c = make(kind, `c${cards.length + 1}`);
    for (let i = 0; i < 20 && cards.some((o) => o.text === c.text); i += 1) c = make(kind, c.id);
    cards.push(c);
  }
  return {
    gesture: 'sort',
    prompt: 'هل كلّ جملة صحيحة؟ أرسلها إلى صندوقها.',
    bins: [
      { id: 'yes', label: 'صحيحة' },
      { id: 'no', label: 'خاطئة' },
    ],
    cards,
  };
}

/**
 * The worked example answers the mistake the student showed: the order of the two numbers or a multiple taken for a
 * divisor, 1 and the number itself refused, or — by default — the division and its remainder.
 */
function divisorExample(rand, level, { mistake = null } = {}) {
  const b = level === 1 ? int(rand, 4, 9) : int(rand, 11, 15);
  const q = int(rand, 4, 9);
  if (mistake === 'sentence-reversed' || mistake === 'multiple-for-divisor') {
    const a = b * q;
    return {
      title: `هل ${a} قاسم للعدد ${b}؟`,
      steps: [
        `أكتب المساواة: $${a} = ${b} \\times ${q}$.`,
        `العدد ${b} هو الذي يقسم ${a}: إذن ${b} قاسم للعدد ${a}، و ${a} مضاعف للعدد ${b}.`,
        `العدد ${a} أكبر من ${b}: إذن ${a} ليس قاسمًا للعدد ${b}.`,
      ],
    };
  }
  if (mistake === 'one-and-itself') {
    const a = b * q;
    return {
      title: `هل 1 و ${a} قاسمان للعدد ${a}؟`,
      steps: [
        `أكتب المساواة: $${a} = 1 \\times ${a}$.`,
        `الباقي 0 في قسمة ${a} على 1، وفي قسمة ${a} على ${a}.`,
        `إذن 1 و ${a} قاسمان للعدد ${a}: لكلّ عدد غير معدوم هذان القاسمان.`,
      ],
    };
  }
  const r = rand() < 0.5 ? 0 : int(rand, 1, b - 1);
  const a = b * q + r;
  return {
    title: `هل ${b} قاسم للعدد ${a}؟`,
    steps: [
      `أقسم ${a} على ${b}: $${a} = ${b} \\times ${q}${r ? ` + ${r}` : ''}$.`,
      r ? `الباقي ${r}، وهو ليس 0.` : 'الباقي 0.',
      r ? `إذن ${b} ليس قاسمًا للعدد ${a}.` : `إذن ${b} قاسم للعدد ${a}، و ${a} مضاعف للعدد ${b}.`,
    ],
  };
}

export const FAMILIES = {
  '1am.m1.r01': {
    item: '1am.m1.r01',
    name: 'الجمع والطرح والضرب',
    icon: '✖️',
    // NO instrument: this kit is shown BEFORE « القسمة الإقليدية », and the only tool that writes products and subtractions
    // (« القسمة على الورقة ») is the one that lesson itself introduces — a family's instrument belongs to a lesson the student
    // has already studied (launchkit.test.js). The capsule skips its lab step, the result shows no « مختبري » button.
    labTool: null,
    mistakes: ['table-slip', 'borrow-forgot', 'order-ops', 'add-for-sub'],
    forms: { 1: ['write', 'place'], 2: ['write', 'sort'] },
    make: (rand, level, form, { first = false } = {}) =>
      form === 'place' ? calcPlace(rand) : form === 'sort' ? calcSort(rand) : calcWrite(rand, level, first),
    example: calcExample,
    rules: [
      {
        id: 'product',
        title: 'الضرب جمع متكرّر',
        text: 'الجداء $a \\times b$ هو مجموع $b$ مكرّرًا $a$ مرّة: $4 \\times 6 = 6 + 6 + 6 + 6$',
        example: '$7 \\times 8 = 56$: في 7 علب، في كلّ واحدة 8 أقلام، 56 قلمًا.',
        check: { a: 56, b: 7, q: 8, r: 0 },
      },
      {
        id: 'order',
        title: 'نضرب قبل أن نجمع',
        text: 'في $a \\times b + c$ نحسب الجداء $a \\times b$ أوّلًا، ثمّ نضيف $c$.',
        example: '$6 \\times 9 + 5 = 54 + 5 = 59$.',
        check: { a: 59, b: 6, q: 9, r: 5 },
      },
      {
        id: 'difference',
        title: 'الطرح والتحقّق بالجمع',
        text: 'إذا كان $a - b = d$ فإنّ $d + b = a$: نتحقّق من الطرح بالجمع.',
        example: '$72 - 47 = 25$، و $25 + 47 = 72$.',
        check: { x: 72, y: 47, diff: 25 },
      },
    ],
    memo: [
      'الجداء $a \\times b$: نضيف $b$ إلى نفسه $a$ مرّة — $7 \\times 8 = 56$.',
      'في $6 \\times 9 + 5$ نضرب أوّلًا ثمّ نضيف: $54 + 5 = 59$.',
      'في الطرح نستلف عشرة إذا كان رقم الآحاد أصغر: $72 - 47 = 25$.',
      'نتحقّق من الطرح بالجمع: $25 + 47 = 72$.',
    ],
  },
  '4am.m1.r01': {
    item: '4am.m1.r01',
    // no `lesson` here: the home lesson of a tool is read from the learning net (`toolsForLesson`), and shared code names
    // no lesson that has a pack (lessonPack.test.js)
    name: 'قاسم عدد طبيعي',
    icon: '🔑',
    labTool: 'rows',
    mistakes: ['rest-not-zero', 'multiple-for-divisor', 'sentence-reversed'],
    forms: { 1: ['write', 'pick'], 2: ['sentences', 'pick'] },
    make: (rand, level, form, { first = false } = {}) =>
      form === 'pick'
        ? divisorPick(rand, level, first)
        : form === 'sentences'
          ? divisorSentences(rand)
          : divisorWrite(rand, level, first),
    example: divisorExample,
    rules: [
      {
        id: 'divisor',
        title: 'قاسم عدد طبيعي',
        text: 'العدد $b$ قاسم للعدد $a$ عندما يكون باقي القسمة الإقليدية للعدد $a$ على $b$ معدومًا: $a = b \\times k$',
        example: '$42 = 6 \\times 7$: العدد 6 قاسم للعدد 42.',
        check: { a: 42, b: 6, q: 7, r: 0 },
      },
      {
        id: 'sentences',
        title: 'جمل مختلفة، معنى واحد',
        text: '« $b$ قاسم للعدد $a$ » و « $a$ مضاعف للعدد $b$ » و « $a$ يقبل القسمة على $b$ » تعني الشيء نفسه.',
        example: '6 قاسم للعدد 54، و 54 مضاعف للعدد 6، و 54 يقبل القسمة على 6.',
        check: { a: 54, b: 6, q: 9, r: 0 },
      },
      {
        id: 'always',
        title: '1 والعدد نفسه',
        text: 'العدد 1 قاسم لكلّ عدد طبيعي، وكلّ عدد طبيعي غير معدوم قاسم لنفسه: $a = 1 \\times a$',
        example: '$17 = 1 \\times 17$: العددان 1 و 17 قاسمان للعدد 17.',
        check: { a: 17, b: 1, q: 17, r: 0 },
      },
    ],
    memo: [
      'العدد $b$ قاسم للعدد $a$ عندما يكون باقي قسمة $a$ على $b$ هو 0: $a = b \\times k$.',
      '« $b$ قاسم للعدد $a$ » و « $a$ مضاعف للعدد $b$ » و « $a$ يقبل القسمة على $b$ »: المعنى نفسه.',
      'العدد 1 والعدد نفسه قاسمان دائمًا.',
      'مثال: $42 = 6 \\times 7$، إذن 6 قاسم للعدد 42؛ و $44 = 6 \\times 7 + 2$، إذن 6 ليس قاسمًا للعدد 44.',
    ],
  },
  '1am.m3.r01': {
    item: '1am.m3.r01',
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
  '2am.m1.r04': {
    item: '2am.m1.r04',
    name: 'القسمة الإقليدية على أيّ عدد',
    icon: '🧮',
    labTool: 'paper',
    mistakes: ['rest-too-big', 'quotient-zero', 'swapped'],
    forms: { 1: ['write', 'place'], 2: ['write', 'sort'] },
    make: (rand, level, form, { first = false } = {}) =>
      form === 'place' ? anyPlace(rand) : form === 'sort' ? anySort(rand) : anyWrite(rand, level, first),
    example: anyExample,
    rules: [
      {
        id: 'any-divisor',
        title: 'القسمة على أيّ عدد غير معدوم',
        text: 'لكلّ عدد طبيعي $a$ وعدد طبيعي غير معدوم $b$، مهما كان عدد أرقامه، حاصل $q$ وباقٍ $r$: $a = b \\times q + r$ مع $0 \\le r < b$',
        example: '$347 = 23 \\times 15 + 2$: الحاصل 15 والباقي 2، و $2 < 23$.',
        check: { a: 347, b: 23, q: 15, r: 2 },
      },
      {
        id: 'smaller',
        title: 'عدد أصغر من المقسوم عليه',
        text: 'إذا كان $a < b$ فإنّ $a = b \\times 0 + a$: الحاصل 0 والباقي $a$ نفسه.',
        example: '$9 = 14 \\times 0 + 9$: الحاصل 0 والباقي 9.',
        check: { a: 9, b: 14, q: 0, r: 9 },
      },
    ],
    memo: [
      'قسمة $a$ على أيّ عدد غير معدوم $b$: $a = b \\times q + r$ مع $0 \\le r < b$.',
      'أقدّر الحاصل بالعشرات أوّلًا: $23 \\times 10 = 230$ و $23 \\times 20 = 460$، إذن حاصل قسمة 347 على 23 بين 10 و 20.',
      'إذا كان $a < b$: الحاصل 0 والباقي $a$.',
      'مثال: $347 = 23 \\times 15 + 2$، و $2 < 23$.',
    ],
  },
  '1am.m3.r02': {
    item: '1am.m3.r02',
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

/**
 * The forms of a level in the order a launch asks them. At level 2 a family's `sort` comes FIRST (2026-11-18): the
 * level-2 question of a tool is asked ONCE per station, the workshop repeats the form that was missed and the capsule
 * asks level 1 only — so a level-2 form listed second was never asked in a launch, and the sort is where a family keeps
 * its traps and the cards to ACCEPT (« $9 = 14 \times 0 + 9$ », `quotient-zero`). A family with no level-2 `sort` keeps
 * its own order.
 */
const formsOf = (item, level) => {
  const forms = FAMILIES[item].forms[level];
  return level === 2 && forms.includes('sort') ? ['sort', ...forms.filter((f) => f !== 'sort')] : forms;
};

/** The form of the next question of a level: one not used yet in this launch when the family has another. */
export function pickForm(item, level, used = []) {
  const forms = formsOf(item, level);
  return forms.find((f) => !used.includes(`${level}:${f}`)) ?? forms[used.length % forms.length];
}

/**
 * The form of the question `step` (`nextStep`) asks, given the answers so far and the forms `used` in this launch: a
 * workshop question repeats the form of the tool's last station miss when that form exists at the workshop's level (two
 * questions LIKE the one he missed); otherwise `pickForm`.
 */
export function nextForm(step, answers, used = []) {
  const missed = [...answers]
    .reverse()
    .find((a) => a.item === step.item && a.phase === 'station' && !(a.correct && !a.unsure));
  if (step.phase === 'workshop' && missed && FAMILIES[step.item].forms[step.level].includes(missed.form))
    return missed.form;
  return pickForm(step.item, step.level, used);
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
  if (q.calc) return gradeCalc(q, answer);
  if (q.gesture === 'write') {
    const tq = Math.floor(q.a / q.b);
    const tr = q.a % q.b;
    const aq = num(answer?.q);
    // an equality with no box for the remainder (« a = b × ▢ »): only the factor is judged
    if (q.tokens && !q.tokens.some((t) => t.slot === 'r'))
      return aq === tq && tr === 0
        ? { correct: true, mistake: null }
        : { correct: false, mistake: Number.isFinite(aq) ? 'product-false' : null };
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
        wrong.find((c) => c.miss)?.miss ??
        (q.k === 3 || q.k === 9 ? (wrong.some((c) => c.bin === 'yes') ? 'last-digit' : null) : null),
    };
  }
  const x = Number(answer?.x);
  if (x === q.target) return { correct: true, mistake: null };
  if (x > q.a) return { correct: false, mistake: 'overshoot' };
  return { correct: false, mistake: x % q.b === 0 ? 'not-greatest' : 'not-multiple' };
}
