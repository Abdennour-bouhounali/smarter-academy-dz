/**
 * THE FOUR FORGES of lesson `talis-hisab-atwal` « خاصية طالس وحساب الأطوال » — one per key, each of ITS OWN nature
 * (frame: kit/forge.js; screen: kit/RuleForge.jsx; a case of this world and how the mirror draws it:
 * nilePyramids/ruleForge.js › `thalesCase` and nilePyramids/forgeParts.jsx › FORGE_PARTS). No rule is told: every false
 * rule the tiles can write is refuted in front of him by a computed case, and the rule gets its name only on its tablet
 * (`tablets.js`). Design: docs/reports/PYRAMIDS_WORLD_PLAN.md §3.3–§3.6 (the numbers there, FINAL).
 *
 *   🔑 wadiyat-talis   found IN THE WORLD (no experiment): his evidence is the field's two canals (the world's log,
 *                      `Game.forgeLog('field')`). « النسب الثلاث متساوية عندما [شرط] ، وهي [سلسلة] » — 4 × 4 = 16 rules.
 *                      A rule says « my chain holds exactly when my condition holds »: on each case the mirror computes
 *                      HIS chain (`tests`), so a case's `held` is « his three ratios are equal there ». His canals refute
 *                      eleven rules; the midpoint field (attack 1) the last four; the right one survives a field in
 *                      another position (k = 8/11) and a crooked canal on it.
 *   📐 hisab-tul       the experiment `plan` WRITES the rule (`inquiry.writes`): one option per column; the false
 *                      procedures are refused where he makes them (inquiries.test.js). A case is a course laid at a
 *                      length for an unknown: does it fit? The mirror attacks with a piece to find, laid right, then
 *                      with a piece laid at the « difference » length.
 *   🦋 wadiyat-al-farasha the experiment `halfturn`, then the tiles « [ratio 1] = [ratio 2] = ER/AF » — 4 × 4 = 16 rules:
 *                      a rule says « these three ratios are equal exactly when the two sides are parallel ». The
 *                      parallel round refutes every false pair (the third ratio is named, gate P4).
 *   🔍 muamil-k        the experiment `scale`, then « k = [formula] ، (2) أكبر من (1) عندما [condition] » — 4 × 4 = 16
 *                      rules: a case is « the frame at x, fed (1) » — the copy is (2), or not; a rule says it is when
 *                      its k is x AND it calls (2) larger exactly when (2) is larger. Round 2 (6/5) refutes every
 *                      false k; round 2 also « k < 1 » and « natural »; round 4 (5/6) « always ».
 * `forges.test.js` writes every rule the tiles allow, proves exactly one holds, and refutes every other by a computed
 * case — on his own evidence or on a new one.
 *
 * The keys, as LITERALS (the status script finds each id quoted here): 'wadiyat-talis', 'hisab-tul',
 * 'wadiyat-al-farasha', 'muamil-k' — the ids of `math.js` (K1…K4) and `journey.js › KEYS` (forges.test.js checks).
 */
import { slot } from '../../../../../../common/gameworld/kit/forge';
import {
  attacksOf,
  choiceBox,
  decimalBox,
  firstWrong,
  fractionBox,
  judge,
  line,
  noPredictions,
  ratioChoice,
} from '../../../../../../common/gameworld/kit/authoring/forgeBlocks';
import { THALES_TEXT, caseId, segName, thalesCase } from '../../../../../../common/gameworld/nilePyramids/ruleForge';
import { chain } from '../../../../../../common/gameworld/nilePyramids/figure';
import { canalReading } from '../../../../../../common/gameworld/nilePyramids/logic';
import {
  isRational,
  lenEqual,
  lenOver,
  lenPlus,
  lenTex,
  lenWrite,
} from '../../../../../../common/gameworld/nilePyramids/surd';
import { HALFTURN_INQUIRY, PLAN_INQUIRY, SCALE_INQUIRY, TURN_RIVER } from './inquiries';
import {
  FIELD,
  K1,
  K2,
  K3,
  K4,
  NUMBERS,
  compare,
  equal,
  isInteger,
  ltr,
  minus,
  over,
  plus,
  read,
  tex,
  times,
  typedFrac,
  typedNumber,
  typedWhole,
  write,
} from './math';

// ───────────────────────── what every forge shares ─────────────────────────

/** A ratio over a real bar, in a MathText sentence. */
const frac = (a, b) => `\\dfrac{${a}}{${b}}`;
/** A number in a MathText sentence (« 42{,}5 », a fraction over a bar). */
const num = (x) => tex(x);
/** A ratio as a fraction in lowest terms, as text: « 9/2 », « 1/2 », « 4 » (never « 4,5 »: a ratio is read over its bar). */
export const fr = (x) => {
  const { n, d } = read(x);
  return d === 1n ? String(n) : `${n}/${d}`;
};
/** The same over a real bar, in a formula. */
const rt = (x) => {
  const { n, d } = read(x);
  return d === 1n ? String(n) : `\\dfrac{${n}}{${d}}`;
};
/** A value that may hold a root (the river's SE/SF, `surd.js`): « 1/8 », or « 9/22280√2785 » as text. */
const frL = (x) => (isRational(x) ? fr(x) : lenWrite(x));
/** The same in a formula: over a real bar, its root drawn as a root. */
const rtL = (x) => (isRational(x) ? rt(x) : lenTex(x));
/** A Latin run inside a PLAIN sentence (the bidi algorithm never scrambles it — defects B7). */
const L = (t) => ltr(t);
/** The triangle of the vertex and two points: « AMN ». */
const tri = (c, a, b) => `${c.names.V}${c.names[a]}${c.names[b]}`;
/** A list in Arabic: a no-break space before each comma (defects B6). */
const listAr = (xs) => xs.join(' ، ');
/** A figure of this lesson as a case of the world, with its letters. */
const fig = (names, lens, kind = 'nested') => ({
  kind,
  names,
  len: { VM: lens.VM, VB: lens.VB, VN: lens.VN, VC: lens.VC, MN: lens.MN, BC: lens.BC },
});

/**
 * THE MIRROR'S FIGURES (plan §3.3, §3.5; the two crooked ones are this file's own, checked against the bank and the
 * other stories by `forges.test.js`): each one nested or as a butterfly — the same lengths, the same angle.
 *   A1  the isosceles field KLP, its canal through the midpoints (k = 1/2)            attack 1 of 🔑
 *   R   the field RST in another position (k = 8/11)                                attack 2 of 🔑
 *   RX  the same field, a CROOKED canal: RU = 48, RV = 63, UV = 69 (cos R = 1/4)     48/66 ≠ 63/77
 *   O   OWT (54, 72, 90) and OUV (24, 32, 40) — k = 4/9                               the attack of 🦋
 *   OX  the same OWT, a crooked OUV: 33, 56, 65 (a right angle at O)               33/54 ≠ 56/72
 */
const NAMES_A1 = NUMBERS.talis.attack1.names;
const NAMES_R = NUMBERS.talis.attack2.names;
const NAMES_O = NUMBERS.farasha.attack.names;
export const FIGS = {
  A1: fig(NAMES_A1, NUMBERS.talis.attack1),
  R: fig(NAMES_R, NUMBERS.talis.attack2),
  RX: fig(NAMES_R, { VM: '48', VB: '66', VN: '63', VC: '77', MN: '69', BC: '88' }),
  O: fig(NAMES_O, NUMBERS.farasha.attack),
  OX: fig(NAMES_O, { VM: '33', VB: '54', VN: '56', VC: '72', MN: '65', BC: '90' }),
};

// ═════════════════════════ 1. 🔑 wadiyat-talis — when the three ratios are equal, and which ones ═════════════════════════

const CONDS = [
  { id: 'par', label: `القناة موازية للضلع ${L('(BC)')}`, test: (c) => chain(c) },
  { id: 'cut', label: 'القناة تقطع الضلعين', test: (c) => c.kind === 'nested' },
  { id: 'mid', label: `${L('M')} منتصف ${L('[AB]')}`, test: (c) => equal(times(c.len.VM, '2'), c.len.VB) },
  { id: 'same', label: L('AM = AN'), test: (c) => equal(c.len.VM, c.len.VN) },
];
/** The four chains: each the three pairs of segments it compares, by a ratio or by a difference. */
const CHAINS = [
  {
    id: 'whole',
    label: L('AM/AB = AN/AC = MN/BC'),
    pairs: [
      ['VM', 'VB'],
      ['VN', 'VC'],
      ['MN', 'BC'],
    ],
  },
  {
    id: 'piece',
    label: L('AM/MB = AN/NC = MN/BC'),
    pairs: [
      ['VM', 'MB'],
      ['VN', 'NC'],
      ['MN', 'BC'],
    ],
  },
  {
    id: 'diff',
    label: L('AB − AM = AC − AN = BC − MN'),
    minus: true,
    pairs: [
      ['VB', 'VM'],
      ['VC', 'VN'],
      ['BC', 'MN'],
    ],
  },
  {
    id: 'flip',
    label: L('AM/AB = AC/AN = MN/BC'),
    pairs: [
      ['VM', 'VB'],
      ['VC', 'VN'],
      ['MN', 'BC'],
    ],
  },
];
const CHAIN_OF = Object.fromEntries(CHAINS.map((x) => [x.id, x]));
/** The three values a chain compares on a case, exact. */
export const chainValues = (id, c) =>
  CHAIN_OF[id].pairs.map(([a, b]) => fr(CHAIN_OF[id].minus ? minus(c.len[a], c.len[b]) : over(c.len[a], c.len[b])));
/** Are the three values of a chain equal on a case? */
export const chainHolds = (id, c) => {
  const v = chainValues(id, c);
  return v.every((x) => equal(x, v[0]));
};
/** The three terms of a chain with the case's letters (LaTeX), one per value. */
const chainNames = (id, c) =>
  CHAIN_OF[id].pairs.map(([a, b]) =>
    CHAIN_OF[id].minus ? `${segName(c, a)} - ${segName(c, b)}` : frac(segName(c, a), segName(c, b)),
  );
/** The chain written with the case's letters (LaTeX). */
const chainTex = (id, c) =>
  CHAIN_OF[id].pairs
    .map(([a, b]) => (CHAIN_OF[id].minus ? `${segName(c, a)} - ${segName(c, b)}` : frac(segName(c, a), segName(c, b))))
    .join(' = ');

const J1 = judge({
  slots: [
    { id: 'cond', label: 'النسب الثلاث متساوية عندما:', options: CONDS },
    { id: 'chain', label: 'والنسب الثلاث هي:', options: CHAINS },
  ],
  right: { cond: 'par', chain: 'whole' },
  says: (rule, c, tile) => tile.cond[rule.cond].test(c),
});

/**
 * A case of 🔑 seen through a rule's chain: `held` = « his three values are equal there » — and the gauge shows THOSE
 * three values (`tested`, figure.js › gauge), so it agrees with `held` whatever chain he wrote.
 */
const throughChain = (id, c) => ({
  ...c,
  chainId: id,
  held: chainHolds(id, c),
  tested: { values: chainValues(id, c), names: chainNames(id, c) },
});
/** A case back to what the world shows (the gauge: the three ratios from the vertex). */
function plainCase(c) {
  const { chainId: _x, tested: _t, ...rest } = c;
  return { ...rest, held: chain(rest) };
}

const CANAL_HEAD = { new: 'القناة الجديدة', old: 'القناة القديمة' };
/** A canal of the field as a case: its rope's reading is MN; what he typed is kept. */
export function canalCase(canal, typed = null) {
  const [m, n] = canal.ends;
  const MN = canalReading(FIELD, canal);
  return thalesCase({
    id: `canal:${canal.id}`,
    of: K1,
    names: { V: 'A', M: m, B: 'B', N: n, C: 'C' },
    len: { VM: canal.AM, VB: FIELD.AB, VN: canal.AN, VC: FIELD.AC, MN, BC: FIELD.BC },
    head: CANAL_HEAD[canal.id],
    tag: `الحبل ${MN}`,
    ...(typed != null ? { typed: String(typed) } : {}),
  });
}
const CANAL_OF = Object.fromEntries(FIELD.canals.map((c) => [`canal:${c.id}`, c]));
/** A field the mirror builds (nested), named by its letters. */
const fieldCase = (f) =>
  thalesCase({
    ...f,
    of: K1,
    head: `الحقل ${L(`${f.names.V}${f.names.B}${f.names.C}`)}`,
    tag: `القناة ${f.len.MN}`,
  });
export const F1_CASES = {
  A1: fieldCase(FIGS.A1),
  R: fieldCase(FIGS.R),
  RX: fieldCase(FIGS.RX),
  O: fieldCase(FIGS.O),
  OX: fieldCase(FIGS.OX),
};
/** The right rule's attacks: a field in another position — then a crooked canal on it (a « yes », then a « no »). */
export const F1_HARD = [F1_CASES.R, F1_CASES.RX];
const F1_POOL = [F1_CASES.A1, F1_CASES.R, F1_CASES.RX, F1_CASES.O, F1_CASES.OX];

/**
 * His evidence: the field's two canals — what the world logged (`canal:new`, `canal:old`, his typed length kept), or,
 * when the log lost one, what the story guarantees (he cannot reach the table without both) — then the mirror's.
 */
function evidence1(rows) {
  const his = [];
  const mirror = [];
  const has = (list, c) => list.some((x) => caseId(x) === caseId(c));
  for (const r of rows) {
    const canal = CANAL_OF[r.id];
    if (canal && !r.mirror) {
      const c = canalCase(canal, r.typed ?? null);
      if (!has(his, c)) his.push(c);
    } else if (r.of === K1 && r.mirror) {
      const c = plainCase(r);
      if (!has(mirror, c)) mirror.push(c);
    }
  }
  for (const canal of FIELD.canals) {
    const c = canalCase(canal);
    if (!has(his, c)) his.push(c);
  }
  return [...his, ...mirror.filter((c) => !has(his, c))];
}

const eqWord = (yes) => (yes ? 'متساوية' : 'غير متساوية');
/** His condition read on a case, in words (MathText). */
function condWords(id, c) {
  const { V, M, B, N, C } = c.names;
  const yes = CONDS.find((x) => x.id === id).test(c);
  if (id === 'par') return yes ? `$(${M}${N}) \\parallel (${B}${C})$` : `$(${M}${N})$ لا توازي $(${B}${C})$`;
  if (id === 'cut') return `$[${M}${N}]$ تقطع الضلعين`;
  if (id === 'mid') return yes ? `$${M}$ منتصف $[${V}${B}]$` : `$${M}$ ليست منتصف $[${V}${B}]$`;
  return `$${V}${M} = ${num(c.len.VM)}$ و $${V}${N} = ${num(c.len.VN)}$`;
}
/** The three values of a chain on a case, as formulas. */
const valuesTex = (id, c) => chainValues(id, c).map(rt).join(' \\;;\\; ');

const forge1 = {
  key: K1,
  ...J1,
  chip: (s, o) => (s.id === 'chain' ? `وهي ${o.label}` : o.label),
  ruleText: (rule) =>
    `النسب الثلاث متساوية عندما ${J1.tile.cond[rule.cond].label}، وهي ${J1.tile.chain[rule.chain].label}.`,
  explain(rule, c) {
    const yes = J1.says(rule, c);
    return `قاعدتك: ${condWords(rule.cond, c)}، فهي تقول إنّ $${chainTex(rule.chain, c)}$ ${eqWord(yes)} هنا. القيم الثلاث: $${valuesTex(rule.chain, c)}$.`;
  },
  caseId,
  evidence: evidence1,
  /** The mirror runs HIS chain on every case: what the gauge of his three values shows. */
  tests: (rule, rows) => rows.map((c) => throughChain(rule.chain, c)),
  predictCases: noPredictions,
  attacks(rule, rows) {
    const seen = new Set(rows.map(caseId));
    const free = (list) => list.filter((c) => !seen.has(caseId(c))).map((c) => throughChain(rule.chain, c));
    if (J1.isTheRule(rule)) return free(F1_HARD);
    const breaks = free(F1_POOL).filter((c) => J1.says(rule, c) !== c.held);
    const best = breaks.find((c) => J1.says(rule, c)) ?? breaks[0];
    return best ? [best] : [];
  },
  // never a choice between two written rules: two fields built in the mirror — the marks together on one, apart on the other
  nudge(k) {
    const pairs = [
      [F1_CASES.A1, F1_CASES.RX],
      [F1_CASES.O, F1_CASES.OX],
      [F1_CASES.R, F1_CASES.OX],
    ];
    return { kind: 'experiment', cases: pairs[Math.min(3, Math.max(1, k)) - 1] };
  },
  use: {
    /** The field DEF, G on [DE], H on [DF], the canal [GH] dug parallel to (EF): the names only — the ratios are written. */
    make: () => USE1,
    figure: () => USE1_FIG,
    lines: (c) => {
      const s = (k) => segName(c, k);
      const { M, N } = c.names;
      return [
        line(
          [
            'النسب الثلاث متساوية لأنّ',
            choiceBox('cond', 'السبب', [
              { id: 'par', text: L(`(${s('MN')}) ∥ (${s('BC')})`) },
              { id: 'cut', text: `${L(M)} و ${L(N)} على الضلعين` },
              { id: 'mid', text: `${L(M)} منتصف ${L(`[${s('VB')}]`)}` },
              { id: 'same', text: L(`${s('VM')} = ${s('VN')}`) },
            ]),
          ],
          'rtl',
        ),
        line([
          ratioChoice('an', 'ad', [s('VM'), s('VB'), s('MB')]),
          '=',
          ratioChoice('bn', 'bd', [s('VN'), s('VC'), s('NC')]),
          '=',
          ratioChoice('cn', 'cd', [s('MN'), s('BC')]),
        ]),
      ];
    },
    check(c, v) {
      const s = (k) => segName(c, k);
      if (v.cond !== 'par') return v.cond === 'cut' ? 'cut' : 'cond';
      const up = v.cn === s('MN') && v.cd === s('BC');
      const down = v.cn === s('BC') && v.cd === s('MN');
      if (!up && !down) return 'third';
      const pair = (top, bottom, n, d) => (up ? n === s(top) && d === s(bottom) : n === s(bottom) && d === s(top));
      const piece = (k, n, d) => n === s(k) || d === s(k);
      return firstWrong([
        [piece('MB', v.an, v.ad) ? 'piece' : 'first', pair('VM', 'VB', v.an, v.ad)],
        [piece('NC', v.bn, v.bd) ? 'piece' : 'second', pair('VN', 'VC', v.bn, v.bd)],
      ]);
    },
  },
  text: {
    ...THALES_TEXT,
    title: 'لوح الحقل',
    log: 'قناتا الحقل',
    frame: 'قاعدتك:',
    buildLead:
      'اختر بطاقة من كلّ عمود. المرآة تحسب نسبك على القناتين: التي قرأها الحبل كما كتبتَ، والتي قرأها غير ذلك.',
    testing: 'المرآة تحسب نسبك على قناتيك واحدةً واحدة…',
    agreed: 'قاعدتك توافق القناتين. الآن المرآة تتحدّاها بحقل لم تره.',
    yes: 'متساوية',
    no: 'غير متساوية',
    says: (yes) => `قاعدتك: ${eqWord(yes)}`,
    refuted: (m) =>
      `قاعدتك تقول إنّ النسب الثلاث ${eqWord(m.says)} في ${m.head} — لكنّ أطوال الحبل تعطي ثلاث قيم ${eqWord(m.held)}.`,
    attack: (c) =>
      `المرآة تتحدّى قاعدتك: الحقل $${tri(c, 'B', 'C')}$ وقناته $[${c.names.M}${c.names.N}]$، أطوالهما على الشكل. هل النسب الثلاث متساوية؟ ماذا تقول قاعدتك؟`,
    survived: 'صمدت قاعدتك: النسب فعلت ما قالته.',
    broken: (yes) => `قاعدتك انكسرت هنا: قالت « ${eqWord(yes)} »، والقيم الثلاث ${eqWord(!yes)}.`,
    wordsHint: 'مثال: النسب الثلاث متساوية عندما…',
    experiment: 'انظر جيّدًا: حقلان تبنيهما المرآة. في أيّهما تقف العلامات الثلاث على خطّ واحد؟',
    eq: (c) => valuesTex(c.chainId ?? 'whole', c),
    tryKey: (c) => {
      const s = (k) => segName(c, k);
      const { M, N } = c.names;
      return `في الحقل $${tri(c, 'B', 'C')}$: $${M}$ على $[${s('VB')}]$ و $${N}$ على $[${s('VC')}]$، والقناة $[${M}${N}]$ حُفرت موازية لـ $(${s('BC')})$. اختر السبب، ثمّ اكتب النسب الثلاث متساوية.`;
    },
    use: {
      cut: 'السبب: القناة القديمة أيضًا قطعت الضلعين، ونسبها لم تكن متساوية.',
      cond: `السبب: هذا لم يُقل عن الحقل. ماذا قيل عن القناة ${L('[GH]')}؟`,
      third: `النسبة الثالثة: القناة ${L('GH')} والضلع ${L('EF')} الموازي لها، أحدهما فوق الآخر.`,
      piece: `هذه قطعة من الضلع، لا الضلع كلّه من الرأس ${L('D')}.`,
      first: `النسبة الأولى على الضلع ${L('[DE]')}: طول من الرأس ${L('D')} والضلع كلّه، بترتيب النسبة الثالثة.`,
      second: `النسبة الثانية على الضلع ${L('[DF]')}: طول من الرأس ${L('D')} والضلع كلّه، بترتيب النسبة الثالثة.`,
    },
    useOk: 'السبب والنسب الثلاث كما هي: مفتاحك يعمل!',
  },
};

/** The last step's field: names only (plan §3.3 — « اكتب النسب الثلاث »). */
export const USE1 = { names: { ...NUMBERS.talis.use.names } };
/**
 * THE LAST STEPS' FIGURES (`use.figure`, drawn beside the lines by the world's `UseFigure`): what the question says,
 * drawn — never a length it does not give; an unknown is « ? ». 🔑's field DEF is drawn in the shape of RST (no length
 * written), turned on its side when it lies too high (figure.js › useFigure).
 */
export const USE1_FIG = { kind: 'nested', names: USE1.names, len: { ...FIGS.R.len }, show: [], parallel: true };

// ═════════════════════════ 2. 📐 hisab-tul — a length nobody can measure ═════════════════════════

/** The two sides from the vertex: a whole and its two parts. */
const SIDES = [
  ['VB', 'VM', 'MB'],
  ['VC', 'VN', 'NC'],
];
const RATIOS = [
  ['VM', 'VB'],
  ['VN', 'VC'],
  ['MN', 'BC'],
];
/**
 * THE PROCEDURE of 📐, run on what is GIVEN only: rebuild a whole side from its two pieces (or take a piece off it),
 * find a ratio whose two terms are known, then the unknown from it. → { value, steps } (steps: the joins and cuts, and
 * the ratio used) — or null when the data cannot give it.
 */
export function planValue(c) {
  const known = Object.fromEntries(c.given.map((k) => [k, c.len[k]]));
  const steps = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (const [whole, a, b] of SIDES) {
      if (known[whole] == null && known[a] != null && known[b] != null) {
        known[whole] = write(plus(known[a], known[b]));
        steps.push({ op: '+', a, b, out: whole });
        changed = true;
      }
      for (const [x, y] of [
        [a, b],
        [b, a],
      ])
        if (known[y] == null && known[whole] != null && known[x] != null) {
          known[y] = write(minus(known[whole], known[x]));
          steps.push({ op: '-', a: whole, b: x, out: y });
          changed = true;
        }
    }
    if (known[c.unknown] != null) break;
    const full = RATIOS.find(([t, b]) => known[t] != null && known[b] != null);
    const open = full && RATIOS.find(([t, b]) => (known[t] == null) !== (known[b] == null));
    if (open) {
      const k = over(known[full[0]], known[full[1]]);
      const [t, b] = open;
      if (known[t] == null) known[t] = write(times(known[b], k));
      else known[b] = write(over(known[t], k));
      steps.push({ op: 'ratio', with: full, on: open });
      changed = true;
    }
  }
  return known[c.unknown] == null ? null : { value: known[c.unknown], steps };
}

const LAID = { fits: 'يطابق', gap: 'فراغ', overhang: 'يتجاوز' };
/** A course laid at `typed` for the unknown of a figure, from what is given: does it fit? */
export function courseCase(f, given, unknown, typed, extra = {}) {
  const c = thalesCase({ ...f, len: { ...f.len } });
  const truth = c.len[unknown];
  const cmp = compare(typed, truth);
  return {
    ...c,
    ...extra,
    of: K2,
    id: `plan|${caseId({ ...c, id: undefined })}|${unknown}|${write(typed)}`,
    given: [...given],
    unknown,
    typed: write(typed),
    held: cmp === 0,
    show: [...given],
    parallel: true,
    head: `${L(segName(c, unknown))} في ${L(tri(c, 'B', 'C'))}`,
    tag: LAID[cmp === 0 ? 'fits' : cmp < 0 ? 'gap' : 'overhang'],
  };
}

/** The field's new canal as a figure (14, 16, 18 on 63, 72, 81). */
function fieldNew() {
  const canal = FIELD.canals[0];
  return fig(
    { V: 'A', M: 'M', B: 'B', N: 'N', C: 'C' },
    { VM: canal.AM, VB: FIELD.AB, VN: canal.AN, VC: FIELD.AC, MN: canalReading(FIELD, canal), BC: FIELD.BC },
  );
}
/**
 * The right rule's attacks: a PIECE to find — NC from AM, MB and AN, laid at 56 (« yes ») — then a piece from a piece
 * and two whole sides — NC from MB, RS and RT, laid at the « difference » length 77 − (66 − 18) = 29 (« no »: it is 21).
 */
export const F2_HARD = [
  courseCase(fieldNew(), ['VM', 'MB', 'VN'], 'NC', '56'),
  courseCase(FIGS.R, ['MB', 'VB', 'VC'], 'NC', '29'),
];

const J2 = judge({
  slots: [
    { id: 'side', label: 'الضلع:', options: [{ id: 'whole', label: 'أعيده كلّه من قطعتيه' }] },
    { id: 'pair', label: 'ثمّ:', options: [{ id: 'two', label: 'نسبتان فيهما المجهول' }] },
  ],
  right: { side: 'whole', pair: 'two' },
  says: (rule, c) => {
    const p = planValue(c);
    return p != null && equal(p.value, c.typed);
  },
});
const RULE2 = { side: 'whole', pair: 'two' };

/** His plan on a case, in words: the joins and cuts, then the ratio — and the length it gives. */
function planWords(c) {
  const p = planValue(c);
  const n = (k) => segName(c, k);
  const parts = p.steps.map((s) => {
    if (s.op === 'ratio') {
      const [[t1, b1], [t2, b2]] = [s.with, s.on];
      return `$${frac(n(t2), n(b2))} = ${frac(n(t1), n(b1))}$`;
    }
    const known = (k) => c.len[k];
    return `$${n(s.out)} = ${num(known(s.a))} ${s.op === '+' ? '+' : '-'} ${num(known(s.b))} = ${num(known(s.out))}$`;
  });
  return `${listAr(parts)}، إذن $${n(c.unknown)} = ${num(p.value)}$`;
}
const givenWords = (c) => listAr(c.given.map((k) => `$${segName(c, k)} = ${num(c.len[k])}$`));

const forge2 = {
  key: K2,
  ...J2,
  ruleText: () =>
    'أعيد الضلع كلّه من الرأس من قطعتيه، أو أقتطع منه القطعة؛ ثمّ نسبتان فيهما المجهول وثلاثة أطوال معلومة.',
  explain: (rule, c) => `خطّتك: ${planWords(c)}. المدماك الموضوع $${num(c.typed)}$ م.`,
  caseId,
  // his evidence is what he laid in the experiment (`fromInquiry`) and what the mirror showed; the world's courses
  // were round 1 of that experiment (the world's log carries no `of`, and is not read here)
  evidence: (rows) => {
    const own = rows.filter((r) => r.of === K2);
    return own.filter((c, i) => own.findIndex((x) => caseId(x) === caseId(c)) === i);
  },
  inquiry: PLAN_INQUIRY,
  fromInquiry: (result) => {
    const rows = result.rows
      .map((r) => {
        const round = PLAN_INQUIRY.rounds[r.round];
        return courseCase(round.fig, round.given, round.unknown, r.typed);
      })
      .filter((c, i, all) => all.findIndex((x) => caseId(x) === caseId(c)) === i);
    return { rows, rule: { ...RULE2 } };
  },
  predictCases: noPredictions,
  attacks: (rule, rows) => attacksOf({ ...J2, caseId, pool: () => F2_HARD, hard: F2_HARD })(rule, rows),
  nudge: () => ({ kind: 'experiment', cases: [...F2_HARD] }),
  use: {
    make: () => USE2,
    figure: () => USE2_FIG,
    lines: () => [
      line(['AB', '=', slot('p1', 'القطعة الأولى', 2), '+', slot('p2', 'القطعة الثانية', 2), '=', slot('ab', 'AB', 3)]),
      line(['AF', '=', slot('af', 'AF', 3)]),
      line(['EF', '=', slot('ef', 'EF', 3)]),
    ],
    check(c, v) {
      const parts = [typedWhole(v.p1), typedWhole(v.p2)].sort((a, b) => a - b).join(';');
      const want = [Number(c.len.VM), Number(c.len.MB)].sort((a, b) => a - b).join(';');
      const af = typedNumber(v.af);
      const ef = typedNumber(v.ef);
      const piece = (whole) => write(over(times(whole, c.len.MB), c.len.VB));
      return firstWrong([
        ['parts', parts === want],
        ['sum', typedWhole(v.ab) != null && equal(String(typedWhole(v.ab)), c.len.VB)],
        [af != null && equal(af, piece(c.len.VC)) ? 'afPiece' : 'af', af != null && equal(af, c.len.VN)],
        [ef != null && equal(ef, piece(c.len.BC)) ? 'efPiece' : 'ef', ef != null && equal(ef, c.len.MN)],
      ]);
    },
  },
  text: {
    ...THALES_TEXT,
    title: 'لوح البنّائين',
    log: 'مداميكك',
    frame: 'خطّتك:',
    buildLead: 'خطّتك هي ما بنيتَه في التجربة: المرآة تتحدّاها الآن.',
    testing: 'المرآة تمرّ على مداميكك واحدًا واحدًا…',
    agreed: 'خطّتك توافق كلّ مداميكك. الآن المرآة تتحدّاها بأشكال لم ترها.',
    yes: 'يطابق',
    no: 'لا يطابق',
    says: (yes) => `خطّتك: ${yes ? 'يطابق' : 'لا يطابق'}`,
    refuted: (m) =>
      `خطّتك تقول إنّ المدماك ${m.says ? 'يطابق' : 'لا يطابق'} — لكنّه ${m.held ? 'طابق الحافّتين' : 'لم يطابق الحافّتين'}.`,
    attack: (c) =>
      `في الشكل $${tri(c, 'B', 'C')}$ المعلوم ${givenWords(c)}. يضع البنّاؤون $${segName(c, c.unknown)} = ${num(c.typed)}$ م. هل يطابق؟ ماذا تقول خطّتك؟`,
    survived: 'صمدت خطّتك: المدماك فعل ما قالته.',
    broken: (yes) => `خطّتك انكسرت هنا: قالت « ${yes ? 'يطابق' : 'لا يطابق'} »، والمدماك ${yes ? 'لم يطابق' : 'طابق'}.`,
    wordsHint: 'مثال: أعيد الضلع كلّه، ثمّ…',
    experiment: 'انظر جيّدًا: مدماكان تضعهما المرآة. أيّهما يطابق الحافّتين؟',
    eq: (c) => `${segName(c, c.unknown)} = ${num(c.len[c.unknown])}`,
    tryKey: () =>
      '$(EF) \\parallel (BC)$، $E$ على $[AB]$ و $F$ على $[AC]$: $AE = 45$ و $EB = 10$ و $AC = 66$ و $BC = 77$. احسب $AB$ ثمّ $AF$ و $EF$.',
    use: {
      parts: `السطر الأوّل: الضلع ${L('AB')} من قطعتيه ${L('AE')} و ${L('EB')}.`,
      sum: 'السطر الأوّل: اجمع القطعتين.',
      afPiece: `${L('AF')}: هذا ما تعطيه القطعة ${L('EB')}، لا الضلع ${L('AB')} كلّه.`,
      af: `${L('AF')}: النسبة التي فيها ${L('AF')} وطولان معلومان، ثمّ النسبة التي تساويها.`,
      efPiece: `${L('EF')}: هذا ما تعطيه القطعة ${L('EB')}، لا الضلع ${L('AB')} كلّه.`,
      ef: `${L('EF')}: النسبة التي فيها ${L('EF')} و ${L('BC')}، ثمّ النسبة التي تساويها.`,
    },
    useOk: 'ثلاثة أطوال لم يقسها أحد، كتبتَها بالضبط: مفتاحك يعمل!',
  },
};

/** The last step (plan §3.4): (EF) ∥ (BC), AE = 45, EB = 10, AC = 66, BC = 77 → AB = 55, AF = 54, EF = 63 (k = 9/11). */
export const USE2 = thalesCase({
  names: { ...NUMBERS.hisab.use.names },
  len: {
    VM: NUMBERS.hisab.use.VM,
    VB: NUMBERS.hisab.use.VB,
    VN: NUMBERS.hisab.use.VN,
    VC: NUMBERS.hisab.use.VC,
    MN: NUMBERS.hisab.use.MN,
    BC: NUMBERS.hisab.use.BC,
  },
});

/** AE, EB, AC and BC given (« AC = 66 » on its line); AF and EF asked. */
export const USE2_FIG = { ...USE2, show: ['VM', 'MB', 'VC', 'BC', 'VN', 'MN'], ask: ['VN', 'MN'], parallel: true };

// ═════════════════════════ 3. 🦋 wadiyat-al-farasha — the points on the other side of the vertex ═════════════════════════

/**
 * The tiles are written with the river's letters: S the crossing, E and R on this side, A and F across (S = V, E = M,
 * A = B, R = N, F = C). On a case, EA = SE + SA and RF = SR + SF (the two points stand on both sides of S).
 */
// a length may be a root (the river: SR = √2785, SF = 8√2785 — `surd.js`): every ratio is computed exactly
const across = (c, a, b) => lenPlus(c.len[a], c.len[b]);
const ONE = [
  { id: 'se_sa', label: L('SE/SA'), t: ['VM', 'VB'], v: (c) => lenOver(c.len.VM, c.len.VB) },
  { id: 'se_sf', label: L('SE/SF'), t: ['VM', 'VC'], v: (c) => lenOver(c.len.VM, c.len.VC) },
  { id: 'sa_se', label: L('SA/SE'), t: ['VB', 'VM'], v: (c) => lenOver(c.len.VB, c.len.VM) },
  { id: 'se_ea', label: L('SE/EA'), t: ['VM', 'MB'], v: (c) => lenOver(c.len.VM, across(c, 'VM', 'VB')) },
];
const TWO = [
  { id: 'sr_sf', label: L('SR/SF'), t: ['VN', 'VC'], v: (c) => lenOver(c.len.VN, c.len.VC) },
  { id: 'sr_sa', label: L('SR/SA'), t: ['VN', 'VB'], v: (c) => lenOver(c.len.VN, c.len.VB) },
  { id: 'sf_sr', label: L('SF/SR'), t: ['VC', 'VN'], v: (c) => lenOver(c.len.VC, c.len.VN) },
  { id: 'sr_rf', label: L('SR/RF'), t: ['VN', 'NC'], v: (c) => lenOver(c.len.VN, across(c, 'VN', 'VC')) },
];
const third3 = (c) => lenOver(c.len.MN, c.len.BC);
/** The three values of a rule of 🦋 on a case: his two ratios and the third one, MN/BC. */
export const values3 = (rule, c, tile = J3.tile) =>
  [tile.one[rule.one].v(c), tile.two[rule.two].v(c), third3(c)].map(frL);

const J3 = judge({
  slots: [
    { id: 'one', label: 'النسبة الأولى:', options: ONE },
    { id: 'two', label: 'النسبة الثانية:', options: TWO },
  ],
  right: { one: 'se_sa', two: 'sr_sf' },
  says: (rule, c, tile) => {
    const [a, b, t] = values3(rule, c, tile);
    return lenEqual(a, b) && lenEqual(b, t);
  },
});

/** A segment of a butterfly by its key: MB is « EA » (M and B on both sides of V), NC is « RF ». */
const seg3 = (c, k) => `${c.names[k[0]] ?? k[0]}${c.names[k[1]] ?? k[1]}`;
/** A pair of triangles round the vertex, as a case of 🦋: its two triangles name it. */
export const turnCase = (f) =>
  thalesCase({
    ...f,
    len: { ...f.len },
    of: K3,
    head: f.head ?? `${L(tri(f, 'M', 'N'))} و ${L(tri(f, 'B', 'C'))}`,
    tag: chain(f) ? 'متوازيان' : 'غير متوازيين',
  });
const asTurn = (f) => turnCase({ ...f, kind: 'butterfly' });
/**
 * HIS RIVER (stage 3) as a case of 🦋, whole (`logic.js › riverFigure`: SR = √2785, SF = 8√2785 — both lines square
 * to the bank): SE/SA = SR/SF = ER/AF = 1/8. Round 1 of the experiment, and his evidence when the world logs it.
 */
export const RIVER_CASE = turnCase(TURN_RIVER);
/** A row of the world's log that is his river (`Game.forgeLog('river')`). */
const isRiver = (r) => r.kind === 'butterfly' && !r.of && caseId({ ...r, id: undefined }) === caseId(RIVER_CASE);
/** What the world's row of the river carries besides the figure: what he typed for the ferry, the rope's fact. */
const riverExtras = (r) => ({
  ...(r.typed != null ? { typed: r.typed } : {}),
  ...(r.ferry != null ? { ferry: r.ferry } : {}),
  mirror: Boolean(r.mirror),
});
const FIELD_OLD = fig(
  { V: 'A', M: 'P', B: 'B', N: 'Q', C: 'C' },
  {
    VM: FIELD.canals[1].AM,
    VB: FIELD.AB,
    VN: FIELD.canals[1].AN,
    VC: FIELD.AC,
    MN: canalReading(FIELD, FIELD.canals[1]),
    BC: FIELD.BC,
  },
);
export const F3_CASES = {
  O: asTurn(FIGS.O),
  OX: asTurn(FIGS.OX),
  R: asTurn(FIGS.R),
  RX: asTurn(FIGS.RX),
  A1: asTurn(FIGS.A1),
  OLD: asTurn(FIELD_OLD),
};
/** The right rule's attacks (plan §3.5): other letters (k = 4/9) — then a crooked pair on the same big triangle. */
export const F3_HARD = [F3_CASES.O, F3_CASES.OX];
const F3_POOL = [F3_CASES.O, F3_CASES.OX, F3_CASES.R, F3_CASES.RX];

const ratioTex3 = (c, t) => frac(seg3(c, t[0]), seg3(c, t[1]));
const forge3 = {
  key: K3,
  ...J3,
  chip: (s, o) => (s.id === 'two' ? `= ${o.label} = ${L('ER/AF')}` : o.label),
  ruleText: (rule) =>
    `حول نقطة التقاطع ${L('S')}، مع ${L('(AF) ∥ (ER)')}: ${L(
      `${J3.tile.one[rule.one].label.replace(/[⁦⁩]/g, '')} = ${J3.tile.two[rule.two].label.replace(/[⁦⁩]/g, '')} = ER/AF`,
    )}.`,
  explain(rule, c) {
    const [a, b, t] = values3(rule, c);
    const yes = J3.says(rule, c);
    const one = J3.tile.one[rule.one];
    const two = J3.tile.two[rule.two];
    return `قاعدتك على هذا الشكل: $${ratioTex3(c, one.t)} = ${rtL(a)}$ و $${ratioTex3(c, two.t)} = ${rtL(b)}$، والنسبة الثالثة $${frac(seg3(c, 'MN'), seg3(c, 'BC'))} = ${rtL(t)}$ — فهي تقول إنّ النسب الثلاث ${eqWord(yes)}.`;
  },
  caseId,
  // his river as the world logged it (the same case as round 1 of the experiment), the experiment's, then the mirror's
  evidence: (rows) => {
    const own = rows
      .filter((r) => r.of === K3 || isRiver(r))
      .map((r) => (r.of === K3 ? r : { ...RIVER_CASE, ...riverExtras(r) }));
    const uniq = own.filter((c, i) => own.findIndex((x) => caseId(x) === caseId(c)) === i);
    return [...uniq.filter((c) => !c.mirror), ...uniq.filter((c) => c.mirror)];
  },
  inquiry: HALFTURN_INQUIRY,
  fromInquiry: (result) => ({
    rows: result.rows
      .map((r) => turnCase(HALFTURN_INQUIRY.rounds[r.round].fig))
      .filter((c, i, all) => all.findIndex((x) => caseId(x) === caseId(c)) === i),
  }),
  predictCases: noPredictions,
  attacks: (rule, rows) => attacksOf({ ...J3, caseId, pool: () => F3_POOL, hard: F3_HARD })(rule, rows),
  // two pairs built in the mirror: parallel on one, crooked on the other — never the hard attacks of the right rule
  nudge(k) {
    const pairs = [
      [F3_CASES.R, F3_CASES.RX],
      [F3_CASES.A1, F3_CASES.OLD],
      [F3_CASES.R, F3_CASES.OLD],
    ];
    return { kind: 'experiment', cases: pairs[Math.min(3, Math.max(1, k)) - 1] };
  },
  use: {
    make: () => USE3,
    figure: () => USE3_FIG,
    lines: () => [line(['OD', '=', slot('od', 'OD', 3)]), line(['AB', '=', slot('ab', 'AB', 3)])],
    check(c, v) {
      const od = typedNumber(v.od);
      const ab = typedNumber(v.ab);
      return firstWrong([
        [od != null && equal(od, plus(c.len.VM, c.len.VB)) ? 'sum' : 'od', od != null && equal(od, c.len.VC)],
        [ab != null && equal(ab, plus(c.len.VM, c.len.VB)) ? 'sum' : 'ab', ab != null && equal(ab, c.len.MN)],
      ]);
    },
  },
  text: {
    ...THALES_TEXT,
    title: 'لوح النهر',
    log: 'ما أدرتَه',
    frame: `مستقيمان يتقاطعان في ${L('S')}، و ${L('(AF) ∥ (ER)')}:`,
    buildLead:
      'اختر نسبة من كلّ عمود: تكتب مع النسبة الثالثة ثلاث نسب متساوية. المرآة تحسبها على المثلّثين اللذين أدرتَهما.',
    testing: 'المرآة تحسب نسبك على ما أدرتَه، شكلًا شكلًا…',
    agreed: 'قاعدتك توافق كلّ ما أدرتَه. الآن المرآة تتحدّاها بحروف أخرى.',
    yes: 'متساوية',
    no: 'غير متساوية',
    says: (yes) => `قاعدتك: ${eqWord(yes)}`,
    refuted: (m) =>
      m.held
        ? `قاعدتك تقول إنّ نسبتيك لا تساويان ${L(`${seg3(m, 'MN')}/${seg3(m, 'BC')} = ${frL(third3(m))}`)} — لكنّ الضلعين متوازيان هنا: بعد نصف الدورة وقفت العلامات الثلاث على خطّ واحد.`
        : `قاعدتك تقول إنّ النسب الثلاث متساوية في ${m.head} — لكنّ الضلعين غير متوازيين: بعد نصف الدورة لم تقف العلامات على خطّ واحد.`,
    attack: (c) =>
      `المرآة تتحدّى قاعدتك: المثلّثان $${tri(c, 'M', 'N')}$ و $${tri(c, 'B', 'C')}$ حول $${c.names.V}$، أطوالهما على الشكل. هل النسب الثلاث متساوية؟ ماذا تقول قاعدتك؟`,
    survived: 'صمدت قاعدتك: النسب فعلت ما قالته.',
    broken: (yes) => `قاعدتك انكسرت هنا: قالت « ${eqWord(yes)} »، والنسب ${eqWord(!yes)}.`,
    wordsHint: 'مثال: حول نقطة التقاطع…',
    experiment: 'انظر جيّدًا: شكلان تبنيهما المرآة. في أيّهما تقف العلامات الثلاث على خطّ واحد؟',
    eq: (c) =>
      `${frac(seg3(c, 'VM'), seg3(c, 'VB'))} = ${rtL(lenOver(c.len.VM, c.len.VB))} \\;;\\; ${frac(seg3(c, 'VN'), seg3(c, 'VC'))} = ${rtL(lenOver(c.len.VN, c.len.VC))} \\;;\\; ${frac(seg3(c, 'MN'), seg3(c, 'BC'))} = ${rtL(third3(c))}`,
    tryKey: () =>
      '$[AC]$ و $[BD]$ يتقاطعان في $O$، و $(AB) \\parallel (CD)$: $OA = 18$ و $OC = 48$ و $OB = 21$ و $CD = 88$. احسب $OD$ و $AB$.',
    use: {
      od: `${L('OD')}: النسبة التي فيها ${L('OD')} وطول معلوم من الجهة نفسها، ثمّ النسبة التي تساويها.`,
      ab: `${L('AB')}: النسبة التي فيها ${L('AB')} و ${L('CD')}، ثمّ النسبة التي تساويها.`,
      sum: `${L('OA + OC')} ليس ضلعًا من المثلّثين: النقطتان على جهتي ${L('O')}.`,
    },
    useOk: 'طولان على الضفّة الأخرى، كتبتَهما بالضبط: مفتاحك يعمل!',
  },
};

/** The last step (plan §3.5): (AB) ∥ (CD) cut at O — OA = 18, OC = 48, OB = 21, CD = 88 → OD = 56, AB = 33 (k = 3/8). */
export const USE3 = thalesCase({
  kind: 'butterfly',
  names: { ...NUMBERS.farasha.use.names },
  len: {
    VM: NUMBERS.farasha.use.VM,
    VB: NUMBERS.farasha.use.VB,
    VN: NUMBERS.farasha.use.VN,
    VC: NUMBERS.farasha.use.VC,
    MN: NUMBERS.farasha.use.MN,
    BC: NUMBERS.farasha.use.BC,
  },
});

/** OA, OC, OB and CD given; OD and AB asked. */
export const USE3_FIG = { ...USE3, show: ['VM', 'VB', 'VN', 'BC', 'VC', 'MN'], ask: ['VC', 'MN'], parallel: true };

// ═════════════════════════ 4. 🔍 muamil-k — one number, and its direction ═════════════════════════

/** The sides of triangle (1) or (2) of a case: the small one VMN or the big one VBC. */
const sidesOf = (c, which) => (which === 'small' ? [c.len.VM, c.len.VN, c.len.MN] : [c.len.VB, c.len.VC, c.len.BC]);
const SIDE_KEYS = { small: ['VM', 'VN', 'MN'], big: ['VB', 'VC', 'BC'] };
const otherOf = (which) => (which === 'small' ? 'big' : 'small');
const triOf = (c, which) => (which === 'small' ? tri(c, 'M', 'N') : tri(c, 'B', 'C'));
const maxOf = (xs) => xs.reduce((a, b) => (compare(a, b) >= 0 ? a : b));
const minOf = (xs) => xs.reduce((a, b) => (compare(a, b) <= 0 ? a : b));

const KS = [
  { id: 'two_one', label: 'ضلع من (2) ÷ موافقه من (1)', k: (o, t) => over(t[0], o[0]) },
  { id: 'one_two', label: 'ضلع من (1) ÷ موافقه من (2)', k: (o, t) => over(o[0], t[0]) },
  { id: 'minus', label: 'ضلع من (2) − موافقه من (1)', k: (o, t) => minus(t[0], o[0]) },
  { id: 'long', label: 'أطول ضلع ÷ أقصر ضلع', k: (o, t) => over(maxOf(t), minOf(o)) },
];
const BIGGER = [
  { id: 'gt', label: L('k > 1'), test: (k) => compare(k, '1') > 0 },
  { id: 'lt', label: L('k < 1'), test: (k) => compare(k, '1') < 0 },
  { id: 'always', label: 'دائمًا', test: () => true },
  { id: 'nat', label: `${L('k')} عدد طبيعي`, test: (k) => compare(k, '0') > 0 && isInteger(k) },
];
/** The k a rule computes on a case, exact. */
export const kOf = (rule, c, tile = J4.tile) => fr(tile.k[rule.k].k(sidesOf(c, c.one), sidesOf(c, otherOf(c.one))));
const J4 = judge({
  slots: [
    { id: 'k', label: 'العدد k الذي يحوّل (1) إلى (2):', options: KS },
    { id: 'big', label: '(2) أكبر من (1) عندما:', options: BIGGER },
  ],
  right: { k: 'two_one', big: 'gt' },
  says: (rule, c, tile) => {
    const k = kOf(rule, c, tile);
    return equal(k, c.x) && tile.big[rule.big].test(k) === (c.one === 'small');
  },
});

/**
 * « The frame at x, fed triangle (1) » — a case of 🔍 on a figure: (1) is its small triangle VMN or its big one VBC,
 * (2) the other; `held` = the copy covers (2) exactly (x is the number that turns (1) into (2)).
 */
export function frameCase(f, one, x, extra = {}) {
  const c = thalesCase({ ...f, len: { ...f.len } });
  const k = over(sidesOf(c, otherOf(one))[0], sidesOf(c, one)[0]);
  return {
    ...c,
    ...extra,
    of: K4,
    id: `frame|${caseId({ ...c, id: undefined })}|${one}|${fr(x)}`,
    one,
    x: fr(x),
    held: equal(k, x),
    // the gauge: each side of the copy (x × a side of (1)) over its partner in (2) — the three reach 1 exactly when
    // the copy IS (2), so the gauge agrees with `held` (the pair itself is always a Thalès one)
    tested: {
      values: sidesOf(c, one).map((s, i) => fr(over(times(s, x), sidesOf(c, otherOf(one))[i]))),
      to: '1',
      names: SIDE_KEYS[one].map(
        (k, i) => `${rt(x)} \\times ${frac(segName(c, k), segName(c, SIDE_KEYS[otherOf(one)][i]))}`,
      ),
    },
    head: `من ${L(triOf(c, one))} إلى ${L(triOf(c, otherOf(one)))}`,
    tag: `القرص ${fr(x)}`,
  };
}
const FRAME_FIG = fig(
  { V: 'A', M: 'M', B: 'B', N: 'N', C: 'C' },
  {
    VM: NUMBERS.muamil.small[0],
    VN: NUMBERS.muamil.small[1],
    MN: NUMBERS.muamil.small[2],
    VB: NUMBERS.muamil.big[0],
    VC: NUMBERS.muamil.big[1],
    BC: NUMBERS.muamil.big[2],
  },
);
/** The capstone he ordered (stage 4, the world's fact): the face SBC (90, 90, 99) to the capstone's (2,5, 2,5, 2,75). */
export const CAPSTONE_CASE = frameCase(
  fig({ V: 'S', M: 'M', B: 'B', N: 'N', C: 'C' }, { VM: '2,5', VB: '90', VN: '2,5', VC: '90', MN: '2,75', BC: '99' }),
  'big',
  '1/36',
  { head: 'حجر القمّة', capstone: true },
);
export const F4_CASES = {
  OT: frameCase(FIGS.O, 'big', '4/9'),
  OF: frameCase(FIGS.O, 'small', '4/9'),
  OU: frameCase(FIGS.O, 'small', '9/4'),
  OB: frameCase(FIGS.O, 'big', '9/4'),
  RT: frameCase(FIGS.R, 'big', '8/11'),
  RF: frameCase(FIGS.R, 'small', '8/11'),
  RU: frameCase(FIGS.R, 'small', '11/8'),
  RB: frameCase(FIGS.R, 'big', '11/8'),
};
/** The right rule's attacks: a reduction with its k (« yes »), then the same k fed the small triangle (« no »). */
export const F4_HARD = [F4_CASES.OT, F4_CASES.OF];
const F4_POOL = [F4_CASES.OT, F4_CASES.OF, F4_CASES.OU, F4_CASES.RT, F4_CASES.RF, F4_CASES.RU];

const kTex = (rule, c) => {
  const o = sidesOf(c, c.one);
  const t = sidesOf(c, otherOf(c.one));
  const k = kOf(rule, c);
  if (rule.k === 'minus') return `${num(t[0])} - ${num(o[0])} = ${rt(k)}`;
  const [p, q] = rule.k === 'two_one' ? [t[0], o[0]] : rule.k === 'one_two' ? [o[0], t[0]] : [maxOf(t), minOf(o)];
  return `${frac(num(p), num(q))} = ${rt(k)}`;
};
const isTwo = (yes) => (yes ? 'هي (2)' : 'ليست (2)');

const forge4 = {
  key: K4,
  ...J4,
  chip: (s, o) => (s.id === 'k' ? `k = ${o.label}` : `(2) أكبر من (1) عندما ${o.label}`),
  ruleText: (rule) =>
    `العدد ${L('k')} الذي يحوّل (1) إلى (2) = ${J4.tile.k[rule.k].label}، و(2) أكبر من (1) عندما ${J4.tile.big[rule.big].label}.`,
  explain(rule, c) {
    const k = kOf(rule, c);
    const bigger = J4.tile.big[rule.big].test(k);
    return `قاعدتك: $k = ${kTex(rule, c)}$، ${equal(k, c.x) ? 'وهو' : 'وليس'} عدد القرص $${rt(c.x)}$؛ وتقول إنّ $(2)$ ${bigger ? 'أكبر من' : 'ليست أكبر من'} $(1)$. فهي تقول: النسخة ${isTwo(J4.says(rule, c))}.`;
  },
  caseId,
  evidence: (rows) => {
    const own = rows.filter((r) => r.of === K4);
    const uniq = own.filter((c, i) => own.findIndex((x) => caseId(x) === caseId(c)) === i);
    return [...uniq.filter((c) => !c.mirror), ...uniq.filter((c) => c.mirror)];
  },
  inquiry: SCALE_INQUIRY,
  /** His copies (the frame's rows), after the capstone he ordered at the summit — the experiment's first round. */
  fromInquiry: (result) => {
    const rows = [CAPSTONE_CASE, ...result.rows.map((r) => frameCase(FRAME_FIG, r.feed, r.k))];
    return { rows: rows.filter((c, i) => rows.findIndex((x) => caseId(x) === caseId(c)) === i) };
  },
  predictCases: noPredictions,
  attacks: (rule, rows) => attacksOf({ ...J4, caseId, pool: () => F4_POOL, hard: F4_HARD })(rule, rows),
  nudge(k) {
    const pairs = [
      [F4_CASES.RT, F4_CASES.RF],
      [F4_CASES.RU, F4_CASES.RB],
      [F4_CASES.OU, F4_CASES.OB],
    ];
    return { kind: 'experiment', cases: pairs[Math.min(3, Math.max(1, k)) - 1] };
  },
  use: {
    make: () => USE4,
    figure: () => USE4_FIG,
    lines: () => [
      line(
        [
          `من ${L('ABC')} إلى ${L('AMN')}:`,
          'k =',
          fractionBox('kn', 'kd', { w: 3 }),
          '،',
          choiceBox('kind', 'نوع التحويل', [
            { id: 'reduction', text: 'تصغير' },
            { id: 'enlargement', text: 'تكبير' },
          ]),
        ],
        'rtl',
      ),
      line(['MN', '=', decimalBox('mn', 'MN', 5)]),
      line([`من ${L('AMN')} إلى ${L('ABC')}:`, "k' =", fractionBox('bn', 'bd', { w: 3 })], 'rtl'),
    ],
    check(c, v) {
      const k = typedFrac(v.kn, v.kd);
      const back = typedFrac(v.bn, v.bd);
      const mn = typedNumber(v.mn);
      const kBack = fr(over('1', c.k));
      return firstWrong([
        [k != null && equal(k, kBack) ? 'kInv' : 'k', k != null && equal(k, c.k)],
        ['kind', v.kind === (compare(c.k, '1') < 0 ? 'reduction' : 'enlargement')],
        [mn != null && equal(mn, times(c.BC, kBack)) ? 'mnInv' : 'mn', mn != null && equal(mn, c.MN)],
        [back != null && equal(back, c.k) ? 'back' : 'backOther', back != null && equal(back, kBack)],
      ]);
    },
  },
  text: {
    ...THALES_TEXT,
    title: 'لوح النحّات',
    log: 'نسخ آلتك',
    frame: 'قاعدتك:',
    buildLead: 'اختر بطاقة من كلّ عمود. المرآة تجرّب قاعدتك على حجر القمّة وعلى كلّ نسخة صنعتها الآلة.',
    testing: 'المرآة تمرّ على نسخك واحدةً واحدة…',
    agreed: 'قاعدتك توافق كلّ نسخك. الآن المرآة تتحدّاها بمثلّثين لم ترهما.',
    yes: 'هي (2)',
    no: 'ليست (2)',
    says: (yes) => `قاعدتك: ${isTwo(yes)}`,
    refuted: (m) => {
      const [one, two] = [L(triOf(m, m.one)), L(triOf(m, otherOf(m.one)))];
      return `قاعدتك تقول إنّ نسخة ${one} بالقرص ${L(m.x)} ${m.says ? 'هي' : 'ليست'} ${two} كما تصفها — لكنّ النسخة ${m.held ? 'غطّت' : 'لم تغطِّ'} ${two} بالضبط، و${two} ${m.one === 'small' ? 'أكبر' : 'أصغر'} من ${one}.`;
    },
    attack: (c) =>
      `المرآة تضبط القرص على $${rt(c.x)}$ وتغذّيه $(1) = ${triOf(c, c.one)}$. هل النسخة هي $(2) = ${triOf(c, otherOf(c.one))}$ بالضبط، كما تصفها قاعدتك؟`,
    survived: 'صمدت قاعدتك: الآلة فعلت ما قالته.',
    broken: (yes) => `قاعدتك انكسرت هنا: قالت « ${isTwo(yes)} »، والنسخة ${isTwo(!yes)}.`,
    wordsHint: 'مثال: العدد الذي يحوّل (1) إلى (2) هو…',
    experiment: 'انظر جيّدًا: نسختان تصنعهما المرآة. أيّهما تغطّي المثلّث الآخر بالضبط؟',
    eq: (c) => {
      const o = sidesOf(c, c.one);
      return o.map((s) => `${num(s)} \\times ${rt(c.x)} = ${num(times(s, c.x))}`).join(' \\;;\\; ');
    },
    tryKey: () =>
      '$(MN) \\parallel (BC)$، $M$ على $[AB]$: $AB = 68$ و $BC = 92$ و $AM = 42{,}5$. اكتب $k$ ونوع التحويل و $MN$، ثمّ العدد من $AMN$ إلى $ABC$.',
    use: {
      k: `${L('k')}: ضلع من ${L('AMN')} على موافقه من ${L('ABC')}.`,
      kInv: `${L('k')}: هذا العدد يحوّل ${L('AMN')} إلى ${L('ABC')}، لا العكس.`,
      kind: `نوع التحويل: قارن ${L('k')} بالعدد ${L('1')}.`,
      mn: `${L('MN')}: كلّ ضلع من ${L('ABC')} × ${L('k')} يعطي موافقه.`,
      mnInv: `${L('MN')}: هذا ${L('BC')} × العدد المقلوب.`,
      back: `العدد الأخير: من ${L('AMN')} إلى ${L('ABC')} — الاتّجاه الآخر.`,
      backOther: `العدد الأخير: ضلع من ${L('ABC')} على موافقه من ${L('AMN')}.`,
    },
    useOk: 'عدد واحد لكلّ الأضلاع، واتّجاهه: مفتاحك يعمل!',
  },
};

/** The last step (plan §3.6): AB = 68, BC = 92, AM = 42,5 → k = 5/8 (a reduction), MN = 57,5, back 8/5. */
export const USE4 = {
  AB: NUMBERS.muamil.use.AB,
  BC: NUMBERS.muamil.use.BC,
  AM: NUMBERS.muamil.use.AM,
  MN: NUMBERS.muamil.use.MN,
  k: fr(over(NUMBERS.muamil.use.AM, NUMBERS.muamil.use.AB)),
};

/**
 * 🔍's last step drawn: AB = 68 (« AB = 68 » on its line), BC = 92, AM = 42,5, MN asked. AC is not given: the drawing
 * takes AC = 80 (AN = 50 at k = 5/8) for its shape only, and writes neither.
 */
export const USE4_FIG = thalesCase({
  names: { V: 'A', M: 'M', B: 'B', N: 'N', C: 'C' },
  len: { VM: USE4.AM, VB: USE4.AB, VN: write(times('80', USE4.k)), VC: '80', MN: USE4.MN, BC: USE4.BC },
  show: ['VM', 'VB', 'MN', 'BC'],
  ask: ['MN'],
  parallel: true,
});

/** The forges of the lesson, keyed by its keys in the order of the story. */
export const FORGES = {
  'wadiyat-talis': forge1,
  'hisab-tul': forge2,
  'wadiyat-al-farasha': forge3,
  'muamil-k': forge4,
};
