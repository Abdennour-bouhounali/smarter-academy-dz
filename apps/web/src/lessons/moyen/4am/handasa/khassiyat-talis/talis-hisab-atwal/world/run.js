/**
 * THE FELUCCA'S LEGS of lesson `talis-hisab-atwal` — the content of the kit's rail (`kit/GateRun.js`) between two docks
 * of « الأهرامات », in the river's skin with its crocodiles (`nilePyramids/riverMeshes.js`; plan §1.3). PURE.
 *
 * Four right buoys reach the next dock (`total: 4`). Every leg is NUMERIC (the rail draws no figure: the order names
 * the segments), each buoy row placed its kind's thinking time plus five seconds ahead (`THINK`, `SPARE`) — MENTAL numbers: k = p/q with q ≤ 9, a side q × m with m ≤ 9.
 * Each leg trains only what he has just sealed:
 *   leg 0 (dock 1 → 2) 🔑  « AM = 6 ، AB = 14 ، AN = 9 — AC ؟ »          its wrong buoys: the piece, the inverted ratio
 *   leg 1 (dock 2 → 3) 📐  « AM / AB = p / q ، AB = q × m — AM ؟ »        AB − p ; AB × q / p
 *   leg 2 (dock 3 → 4) 🦋  « OC / OB = p / q ، OT = q × m — OD ؟ »        OT − (q − p) ; OT × q / p
 *   leg 3 (dock 4 → 5) 🔍  « k = 1,75 : تكبير أم تصغير ؟ » , « k = 7/4 ، ضلع 12 — صورته ؟ »   k < 1 read as an enlargement ; side + k
 * The SAME generators are the practice ladder's (`practice.js`): a leg is the first level of the node of the key just
 * sealed (plan §1.3).
 *
 * A wave is DATA (the kit's ladder): { type, key, say, tex, gates: [3], good, why: { right, wrong: { [gate]: fact } },
 * data, pairs } — `say` is PLAIN (a segment in it is isolated left to right), `tex` the formula after it, a gate a
 * whole number or a short text (« 13,75 », « 4/7 » drawn over a bar, « تكبير »), `why` ONE fact per gate (never
 * « wrong »: the cross products the buoy gives), `data` the numbers asked, `pairs` the (piece, side) pairs it shows.
 * `run.test.js` refuses every k the bank writes, every pair standing on one line of the bank, and any wave whose wrong
 * buoy equals the right one (AB − p = AM when m(q − p) = p; side × k = side + k).
 */
import { pick, shuffle } from '../../../../../../common/gameworld/kit/random';
import { compare, equal, isInteger, K1, K2, K3, K4, ltr, minus, over, plus, tex, times, write } from './math';

/** k < 1, q ≤ 9, none written by the bank (run.test.js reads the bank). */
export const REDUCE = ['5/6', '2/7', '6/7', '5/8', '7/8', '2/9', '4/9', '5/9', '7/9', '8/9'];
/** k > 1, q ≤ 9, none written by the bank. */
export const ENLARGE = ['7/4', '7/6', '8/7', '9/7', '10/7', '11/8', '10/9', '11/9'];
/** The multipliers m of a side q × m. */
const M = [2, 3, 4, 5, 6, 7, 8, 9];
/**
 * The (piece, side) pairs that stand on one line of the bank (computed from `content/practice/4am/talis-hisab-atwal`,
 * re-checked by run.test.js on every wave it draws): a wave that would show one is drawn again.
 */
const BANK_LINES = new Set(
  (
    '2;10 2;12 2;14 2;16 3;15 3;24 3;27 4;10 4;20 4;24 4;32 5;25 5;30 5;40 5;45 6;10 6;15 6;27 6;30 6;36 7;56 8;10 ' +
    '8;14 8;28 8;36 8;40 8;64 8;72 9;15 10;22 12;27 18;30 18;45 24;27 24;30 27;45 30;36 36;45 40;45 45;50'
  ).split(' '),
);
const pairKey = (a, b) => [Number(a), Number(b)].sort((x, y) => x - y).join(';');
/** No pair of the wave stands on a line of the bank. */
const clear = (pairs) => pairs.every(([a, b]) => !BANK_LINES.has(pairKey(a, b)));

const kOf = (k) => k.split('/').map(Number);
/** A ratio as a formula: « \\dfrac{7}{4} », or « 1{,}75 » when `decimal` and it has a short decimal writing. */
const kTex = (k, decimal = false) => {
  const w = write(k);
  return decimal && !w.includes('/') && w.length <= 4 ? tex(k) : `\\dfrac{${kOf(k)[0]}}{${kOf(k)[1]}}`;
};
/** A gate: a whole number, or its writing (« 13,75 », « 4/7 »). */
const gate = (x) => {
  const t = write(x);
  return /^\d+$/.test(t) ? Number(t) : t;
};
/** The product « a × b = c » isolated left to right (true: `run.test.js` checks every one). */
const prod = (a, b) => ltr(`${write(a)} × ${write(b)} = ${write(times(a, b))}`);
/** The two cross products « a × d » and « b × c » of a / b = c / d, written as two facts. */
const cross = (a, b, c, d) => `${prod(a, d)} و ${prod(b, c)}`;

/**
 * The right value of a wave, from its data alone — ONE definition, used to build the wave, to judge him and by the
 * tests (which compute it again by the proportion itself).
 */
export function truthOf(w) {
  const d = w.data;
  switch (w.type) {
    case 'nested':
    case 'whole':
      return write(over(times(d.big, d.other), d.small));
    case 'fourth':
    case 'butterfly':
    case 'image':
      return write(times(d.side, d.k));
    case 'butterflyLen':
      return write(over(times(d.OC, d.OB), d.OA));
    case 'back':
      return write(over('1', d.k));
    case 'direction':
      return compare(d.k, '1') > 0 ? 'تكبير' : 'تصغير';
    default:
      return null;
  }
}
/** Is gate value n right for this wave? */
export function isRight(w, n) {
  const t = truthOf(w);
  if (w.type === 'direction') return n === t;
  try {
    return equal(String(n), t);
  } catch {
    return false;
  }
}

/**
 * How long each kind of buoy takes a 4AM student, in seconds, computing in his head while he steers (owner, 2026-11-25:
 * « estimate the time of each question and then five seconds »): reading the order, the steps of the computation, the
 * choice of a buoy. `SPARE` is the owner's five seconds; the rail places the buoy row `seconds` of travel ahead
 * (`kit/GateRun.js › next`).
 */
export const THINK = {
  direction: 5, // compare k with 1
  back: 8, // invert a fraction
  fourth: 12, // AB ÷ q × p
  butterfly: 12, // OT ÷ q × p
  image: 12, // side ÷ q × p
  nested: 20, // simplify AM / AB, then AN ÷ p × q
  butterflyLen: 20, // simplify OA / OC, then OB ÷ p × q
  whole: 25, // AB = AM + MB first, then the nested computation
};
export const SPARE = 5;

/**
 * A wave: the right gate, two others drawn from `pool` (never one the wave would count right, never twice the same, at
 * most 6 characters, positive), each with its fact. null (« ask again ») when the pool has fewer than two.
 */
function waveOf(rand, base, pool, fact, rightFact) {
  const right = truthOf(base);
  if (!right || right.length > 6) return null;
  const seen = new Set([right]);
  const wrong = [];
  for (const g of shuffle(rand, pool)) {
    if (g == null) continue;
    let k;
    try {
      if (base.type !== 'direction' && compare(g, '0') <= 0) continue;
      k = base.type === 'direction' ? g : write(g);
    } catch {
      continue;
    }
    if (seen.has(k) || isRight(base, k) || k.length > 6) continue;
    seen.add(k);
    wrong.push(k);
  }
  if (wrong.length < 2) return null;
  const shown = (x) => (base.type === 'direction' ? x : gate(x));
  const others = wrong.slice(0, 2);
  const gates = shuffle(rand, [shown(right), ...others.map(shown)]);
  return {
    ...base,
    seconds: THINK[base.type] + SPARE,
    // the ladder never draws the same numbers twice in a row: its `a` / `b` are the order's formula
    a: base.tex,
    b: base.say,
    gates,
    good: gates.indexOf(shown(right)),
    why: { right: rightFact, wrong: Object.fromEntries(others.map((g) => [shown(g), fact(g)])) },
  };
}
/** Two different multipliers. */
const twoM = (rand) => {
  const a = pick(rand, M);
  const b = pick(
    rand,
    M.filter((x) => x !== a),
  );
  return [a, b];
};
/** The value of an exact product or quotient as text, or null when it is not a whole number (a buoy of mental numbers). */
const whole = (x) => (isInteger(x) ? write(x) : null);

// ───────────────────────────── the kinds of buoy ─────────────────────────────
export const GENERATORS = {
  /**
   * 🔑 the nested chain: AM, AB and AN given — AC (`find: 'VC'`); or AM, AB and BC — MN (`find: 'MN'`).
   * data: { small, big, other } with unknown = big × other / small (the cross product).
   */
  nested(rand, { find = 'VC' } = {}) {
    const [p, q] = kOf(pick(rand, REDUCE));
    const [m, n] = twoM(rand);
    const [AM, AB] = [p * m, q * m];
    const side = find === 'VC';
    // AC from AN: AC = AB × AN / AM; MN from BC: MN = AM × BC / AB
    const [given, asked] = side ? ['AN', 'AC'] : ['BC', 'MN'];
    const g = side ? p * n : q * n;
    const data = side ? { small: AM, big: AB, other: g } : { small: AB, big: AM, other: g };
    const pairs = [[AM, AB], side ? [g, q * n] : [p * n, g]];
    if (!clear(pairs)) return null;
    const base = {
      type: 'nested',
      key: K1,
      find,
      say: `احسب ${ltr(asked)}`,
      tex: `AM = ${AM} \\quad AB = ${AB} \\quad ${given} = ${g}`,
      data,
      pairs,
    };
    const right = truthOf(base);
    // the piece: NC (= AN × MB / AM) for AC, MB × BC / AB for MN; the inverted ratio; a difference added
    const piece = side ? (q - p) * n : (q - p) * n;
    const inverted = side ? whole(over(times(AM, g), AB)) : whole(over(times(AB, g), AM));
    const diff = side ? g + (AB - AM) : g - (AB - AM);
    // AM / AB = AN / AC ⟺ AM × AC = AB × AN ; AM / AB = MN / BC ⟺ AM × BC = AB × MN
    const products = (x) => (side ? cross(AM, AB, g, x) : cross(AM, AB, x, g));
    const fact = (x) =>
      equal(x, piece)
        ? `${ltr(`${side ? 'NC' : 'MB × BC ÷ AB'} = ${piece}`)}: ${side ? `قطعة من ${ltr('[AC]')}، لا الضلع كلّه` : 'حساب بالقطعة MB لا بالضلع AB'}. ${products(x)}.`
        : `مع ${ltr(`${asked} = ${write(x)}`)}: ${products(x)}، والجداءان مختلفان.`;
    const rightFact = `${ltr(`${asked} = ${right}`)}: ${products(right)} — جداءان متساويان.`;
    return waveOf(rand, base, [String(piece), inverted, String(diff), String(AM + g)], fact, rightFact);
  },

  /** 📐 the ratio given: AM / AB = p / q and AB = q × m — AM. data: { k, side }. */
  fourth(rand) {
    const k = pick(rand, REDUCE);
    const [p, q] = kOf(k);
    const m = pick(rand, M);
    const AB = q * m;
    const pairs = [[p * m, AB]];
    if (!clear(pairs)) return null;
    const base = {
      type: 'fourth',
      key: K2,
      say: `احسب ${ltr('AM')}`,
      tex: `\\dfrac{AM}{AB} = ${kTex(k)} \\quad AB = ${AB}`,
      data: { k, side: String(AB) },
      pairs,
    };
    const right = truthOf(base);
    const fact = (x) => `مع ${ltr(`AM = ${write(x)}`)}: ${cross(x, AB, p, q)}، والجداءان مختلفان.`;
    const rightFact = `${ltr(`AM = ${right}`)}: ${cross(right, AB, p, q)} — جداءان متساويان.`;
    return waveOf(rand, base, [String(AB - p), whole(over(AB * q, p)), String(AB * p)], fact, rightFact);
  },

  /** 📐 a side from the vertex given in two pieces: AM, MB and AN — AC (AB = AM + MB first). */
  whole(rand) {
    const [p, q] = kOf(pick(rand, REDUCE));
    const [m, n] = twoM(rand);
    const [AM, MB, AN] = [p * m, (q - p) * m, p * n];
    const AB = AM + MB;
    const pairs = [
      [AM, MB],
      [AN, q * n],
    ];
    if (AM === MB || !clear(pairs)) return null;
    const base = {
      type: 'whole',
      key: K2,
      say: `احسب ${ltr('AC')}`,
      tex: `AM = ${AM} \\quad MB = ${MB} \\quad AN = ${AN}`,
      data: { small: AM, big: AB, other: AN },
      pairs,
    };
    const right = truthOf(base);
    const piece = (q - p) * n; // AN × MB / AM: NC, the piece
    const fact = (x) =>
      equal(x, piece)
        ? `${ltr(`NC = ${piece}`)}: قطعة. الضلع ${ltr(`AB = ${AM} + ${MB} = ${AB}`)}، و ${cross(AM, AB, AN, right)}.`
        : `${ltr(`AB = ${AM} + ${MB} = ${AB}`)}. مع ${ltr(`AC = ${write(x)}`)}: ${cross(AM, AB, AN, x)}، والجداءان مختلفان.`;
    const rightFact = `${ltr(`AB = ${AM} + ${MB} = ${AB}`)}، و ${cross(AM, AB, AN, right)} — جداءان متساويان.`;
    return waveOf(
      rand,
      base,
      [String(piece), String(AN + MB), whole(over(AN * MB, AM)), String(AN + AB)],
      fact,
      rightFact,
    );
  },

  /** 🦋 the butterfly's ratio given: OC / OB = p / q and OT = q × m — OD. data: { k, side }. */
  butterfly(rand) {
    const k = pick(rand, REDUCE);
    const [p, q] = kOf(k);
    const m = pick(
      rand,
      M.filter((x) => x > 1),
    );
    const OT = q * m;
    const pairs = [[p * m, OT]];
    if (!clear(pairs)) return null;
    const base = {
      type: 'butterfly',
      key: K3,
      say: `احسب ${ltr('OD')}`,
      tex: `\\dfrac{OC}{OB} = ${kTex(k)} \\quad OT = ${OT}`,
      data: { k, side: String(OT) },
      pairs,
    };
    const right = truthOf(base);
    const fact = (x) => `مع ${ltr(`OD = ${write(x)}`)}: ${cross(x, OT, p, q)}، والجداءان مختلفان.`;
    const rightFact = `${ltr(`OD = ${right}`)}: ${cross(right, OT, p, q)} — جداءان متساويان.`;
    return waveOf(rand, base, [String(OT - (q - p)), whole(over(OT * q, p)), String(OT - p)], fact, rightFact);
  },

  /** 🦋 (AB) ∥ (CD), the lines cut at O: OA, OC and OB — OD. data: { OA, OC, OB }. */
  butterflyLen(rand) {
    const [p, q] = kOf(pick(rand, REDUCE));
    const [m, n] = twoM(rand);
    const [OA, OC, OB] = [p * m, q * m, p * n];
    const pairs = [
      [OA, OC],
      [OB, q * n],
    ];
    if (!clear(pairs)) return null;
    const base = {
      type: 'butterflyLen',
      key: K3,
      say: `${ltr('(AB) ∥ (CD)')} : احسب ${ltr('OD')}`,
      tex: `OA = ${OA} \\quad OC = ${OC} \\quad OB = ${OB}`,
      data: { OA: String(OA), OC: String(OC), OB: String(OB) },
      pairs,
    };
    const right = truthOf(base);
    const fact = (x) =>
      equal(x, OA + OC)
        ? `${ltr(`AC = ${OA} + ${OC} = ${OA + OC}`)}: هذا طول ${ltr('[AC]')}، لا ضلع من أضلاع المثلثين.`
        : `مع ${ltr(`OD = ${write(x)}`)}: ${cross(OA, OC, OB, x)}، والجداءان مختلفان.`;
    const rightFact = `${ltr(`OD = ${right}`)}: ${cross(OA, OC, OB, right)} — جداءان متساويان.`;
    return waveOf(rand, base, [whole(over(OB * OA, OC)), String(OA + OC), String(OB + (OC - OA))], fact, rightFact);
  },

  /** 🔍 one number k, from (1) to (2): an enlargement or a reduction? */
  direction(rand) {
    const k = pick(rand, [...REDUCE, ...ENLARGE]);
    const big = compare(k, '1') > 0;
    const base = {
      type: 'direction',
      key: K4,
      say: 'تكبير أم تصغير؟',
      tex: `k = ${kTex(k, true)}`,
      data: { k },
      pairs: [],
    };
    const how = big ? `$k = ${kTex(k, true)}$ أكبر من 1` : `$k = ${kTex(k, true)}$ أصغر من 1`;
    const rightFact = `${how}: كلّ طول من (1) يُضرب في k فيصير ${big ? 'أطول' : 'أقصر'}.`;
    const fact = (g) =>
      g === 'تطابق'
        ? `المثلثان متطابقان حين $k = 1$ فقط. هنا ${how}.`
        : `${how}: كلّ طول من (1) يصير ${big ? 'أطول' : 'أقصر'}، فـ(2) ${big ? 'تكبير' : 'تصغير'} لـ(1).`;
    return waveOf(rand, base, ['تكبير', 'تصغير', 'تطابق'], fact, rightFact);
  },

  /** 🔍 k and a side of (1): the length of its image in (2). data: { k, side }. */
  image(rand) {
    const k = pick(rand, [...REDUCE, ...ENLARGE]);
    const [p, q] = kOf(k);
    const m = pick(rand, M);
    const side = q * m;
    const pairs = [[side, p * m]];
    if (!clear(pairs)) return null;
    const base = {
      type: 'image',
      key: K4,
      say: `ضلع من (1) طوله ${side}. طول صورته في (2)؟`,
      tex: `k = ${kTex(k)}`,
      data: { k, side: String(side) },
      pairs,
    };
    const right = truthOf(base);
    const fact = (x) =>
      equal(x, plus(side, k))
        ? `${ltr(`${side} × k = ${right}`)}: المعامل يُضرب في الطول، لا يُضاف إليه.`
        : `${ltr(`${side} × k = ${right}`)}، وليس ${write(x)}.`;
    const rightFact = `${prod(side, p)}، ثمّ القسمة على ${q}: ${ltr(`${side} × k = ${right}`)}.`;
    return waveOf(rand, base, [write(plus(side, k)), whole(over(side * q, p)), String(side * p)], fact, rightFact);
  },

  /** 🔍 k from (1) to (2): the number from (2) back to (1). data: { k }. */
  back(rand) {
    const k = pick(rand, [...REDUCE, ...ENLARGE]);
    const [p, q] = kOf(k);
    const base = {
      type: 'back',
      key: K4,
      say: 'المعامل من (2) إلى (1)؟',
      tex: `k = ${kTex(k)}`,
      data: { k },
      pairs: [],
    };
    const rightFact = `$${kTex(k)} \\times \\dfrac{${q}}{${p}} = 1$: ما يضربه k يعيده $\\dfrac{${q}}{${p}}$ إلى طوله.`;
    const fact = (g) => `$${kTex(k)} \\times ${tex(g)} = ${tex(times(k, g))}$، لا 1: هذا العدد لا يعيد (2) إلى (1).`;
    const pool = [k, write(minus(k, '1')), write(minus('1', k)), write(over(q, p + q)), write(over(p + q, q))];
    return waveOf(rand, base, pool, fact, rightFact);
  },
};

// ───────────────────────────── the legs ─────────────────────────────

/** What each leg asks, by the key just sealed (the first level of its practice node — `practice.js` reads the same). */
export const LEG_MIX = [
  [
    ['nested', { find: 'VC' }],
    ['nested', { find: 'MN' }],
  ],
  [
    ['fourth', {}],
    ['whole', {}],
  ],
  [
    ['butterfly', {}],
    ['butterflyLen', {}],
  ],
  [
    ['direction', {}],
    ['image', {}],
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
/** A gate as the rail draws it: « 4/7 » over a real bar, anything else as text. */
export const gateOption = (g) => {
  const m = /^(\d+)\/(\d+)$/.exec(String(g));
  return m ? { tex: `\\dfrac{${m[1]}}{${m[2]}}` } : { t: String(g) };
};
/** A wave as the rail plays it: { ask, tex, options × 3, right, why × 3 }. */
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
