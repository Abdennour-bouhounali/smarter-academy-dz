/**
 * « تدرّب » of lesson `talis-hisab-atwal` — the CONTENT of its trainer (PURE). The frame — six questions, two formats
 * that drift toward the exam, the stars — is the kit's (`gameworld/kit/trainer.js`, the screen `kit/Trainer.jsx`).
 * Here: the kinds of question of THIS lesson, the plan of each card of its mind map, and how an answer is judged:
 * `check` gives first a HINT that says what the answer gives (never the answer), then the written correction.
 *
 *   game formats: a buoy of the felucca (`practice.js › waveOf`, its facts as hints), a true / false in one tap;
 *   exam formats, the asks of the bank on the platform's OWN figures (`math.js › FIGURES`) and letters —
 *     🔑 « احسب النسبة » (a fraction over a bar), « اكتب النسب الثلاث » (segment names chosen inside fractions);
 *     📐 « احسب الطول » (a decimal box, its unit printed), the same when a side from the vertex is given in two pieces;
 *     🦋 two lengths of a butterfly, its three ratios written;
 *     🔍 k (a fraction), « تكبير / تصغير », the image of a side, and the number back.
 *
 * EVERY QUESTION ABOUT A CONFIGURATION CARRIES ITS FIGURE (`q.figure`, drawn above it by the kit's trainer —
 * `kit/trainerFigure.js`, at its 12 px label floor): the world's Thalès figure (`nilePyramids/figure.js › figureSpec`,
 * never a second drawing) with the lengths the question gives and « ? » on what it asks, the chevrons of the parallel;
 * turned by 15° steps when it would stand too high for the trainer's room (`trainerFigure(fig).fits`, asserted for every
 * question of every kind in trainer.test.js). The words say only « في الشكل: (MN) ∥ (BC) » and the lengths. A length is
 * the kit's DECIMAL box `{ num, decimal: true }` (« 32,5 »), read exactly (`math.js › typedNumber`); a ratio of segment
 * names is a fraction of two CHOICES (`{ frac: { n: { choice }, d: { choice } } }`, buttons); a line of a form is plain
 * text, its Arabic words to the RIGHT of the boxes on a left-to-right line (defects.md D22).
 */
import { pick, shuffle } from '../../../../../../common/gameworld/kit/random';
import { createTrainer } from '../../../../../../common/gameworld/kit/trainer';
import { trainerFigure } from '../../../../../../common/gameworld/kit/trainerFigure';
import { figureSpec } from '../../../../../../common/gameworld/nilePyramids/figure';
import {
  equal,
  FIGURES,
  K1,
  K2,
  K3,
  K4,
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
import { isRight } from './run';
import { waveOf } from './practice';

// ───────────────────────────── the letters and the figures ─────────────────────────────

/** The letters of a nested figure: V the vertex, M on [VB], N on [VC]. */
export const NESTED_NAMES = [
  { V: 'A', M: 'M', B: 'B', N: 'N', C: 'C' },
  { V: 'E', M: 'G', B: 'F', N: 'H', C: 'D' },
  { V: 'K', M: 'I', B: 'L', N: 'J', C: 'P' },
  { V: 'R', M: 'U', B: 'S', N: 'W', C: 'T' },
];
/** The letters of a butterfly: the lines (MB) and (NC) cut at V, M and B on both sides of V. */
export const BUTTERFLY_NAMES = [
  { V: 'O', M: 'A', B: 'C', N: 'B', C: 'D' },
  { V: 'I', M: 'E', B: 'G', N: 'F', C: 'H' },
  { V: 'S', M: 'K', B: 'M', N: 'L', C: 'N' },
];
/** The three ratios of a figure, by their keys: [numerator, denominator]. */
const RATIOS = [
  ['VM', 'VB'],
  ['VN', 'VC'],
  ['MN', 'BC'],
];
/** A segment named with the figure's letters: « VM » → « AM ». */
const seg = (names, key) =>
  key
    .split('')
    .map((ch) => names[ch])
    .join('');
/** The pieces of a figure: MB and NC (nested: the side less its part; butterfly: the two parts together). */
const withPieces = (f, butterfly) => ({
  ...f,
  MB: write(butterfly ? plus(f.VM, f.VB) : minus(f.VB, f.VM)),
  NC: write(butterfly ? plus(f.VN, f.VC) : minus(f.VC, f.VN)),
});
/** The configuration in words, now that the figure is drawn: the parallel only (the figure shows the rest). */
function describe(names) {
  const s = (k) => seg(names, k);
  return `في الشكل: $(${s('MN')}) \\parallel (${s('BC')})$.`;
}
/**
 * THE FIGURE of a question (`q.figure`): the world's Thalès figure with its letters, the lengths `show` written and
 * those `ask` written « ? ». Drawn as it is when it fits the trainer's room at its 12 px floor, else turned by 15°
 * steps to the turn that stands lowest. `f` holds the lengths (`draw`: other lengths for its shape only).
 */
function figureOf(f, names, butterfly, { show = [], ask = [], draw = null } = {}) {
  const fig = {
    kind: butterfly ? 'butterfly' : 'nested',
    names,
    len: { VM: f.VM, VB: f.VB, VN: f.VN, VC: f.VC, MN: f.MN, BC: f.BC, MB: f.MB, NC: f.NC },
    ...(draw ? { draw } : {}),
  };
  const at = (turn) => {
    const spec = figureSpec(fig, { show, ask, parallel: true, turn });
    return { spec, t: trainerFigure(spec) };
  };
  const flat = at(0);
  if (flat.t.fits) return flat.spec;
  const turns = Array.from({ length: 23 }, (_, i) => at((i + 1) * 15)).filter((x) => x.t.fits);
  return (turns.sort((a, b) => a.t.height - b.t.height)[0] ?? flat).spec;
}
/** A scale figure (only AB, BC, AM, MN given): its AC for the drawing only — 3/5 of AB + BC, AN at the same k. */
function scaleDraw(f) {
  const VC = write(times(plus(f.VB, f.BC), '3/5'));
  return { VM: f.VM, VB: f.VB, VN: write(times(VC, over(f.VM, f.VB))), VC, MN: f.MN, BC: f.BC };
}
/** « $AM = 35$ و $AB = 42$ … » — the lengths given, each a formula. */
const lengths = (names, f, keys) => keys.map((k) => `$${seg(names, k)} = ${tex(f[k])}$`).join(' و ');
const UNIT = 'سم';
const UNIT_NOTE = '(وحدة الطول هي السنتيمتر)';
/** A figure of the trainer, its letters and its pieces. */
function drawFigure(rand, butterfly, { whole = false } = {}) {
  const pool = butterfly ? FIGURES.butterfly : FIGURES.nested;
  const f = pick(rand, whole ? pool.filter((x) => !Object.values(x).some((v) => v.includes(','))) : pool);
  return { f: withPieces(f, butterfly), names: pick(rand, butterfly ? BUTTERFLY_NAMES : NESTED_NAMES) };
}

// ───────────────────────────── the tokens of a form ─────────────────────────────
const fracBox = (n, d) => ({ frac: { n: { num: n, label: 'البسط' }, d: { num: d, label: 'المقام' } } });
const lengthBox = (name, label) => ({ num: name, label, decimal: true, w: 5 });
const choice = (name, label, options) => ({
  choice: name,
  label,
  buttons: true,
  options: options.map((o) => ({ value: o, text: o })),
});
/** A ratio of segment names, each part a choice among `options`. */
const ratioChoice = (n, d, options) => ({ frac: { n: choice(n, 'البسط', options), d: choice(d, 'المقام', options) } });

// ───────────────────────────── true / false ─────────────────────────────

/** The statements of each key: [statement, truth, why] — `why` opens on a formula (the reason reads « لأنّ » + why). */
const TF = {
  [K1]: (rand) => {
    const { f, names } = drawFigure(rand, false, { whole: true });
    const s = (k) => seg(names, k);
    const head = `${describe(names)} ${lengths(names, f, ['VM', 'VB', 'VN', 'VC'])}.`;
    const figure = figureOf(f, names, false, { show: ['VM', 'VB', 'VN', 'VC'] });
    const fr = (a, b) => `\\dfrac{${s(a)}}{${s(b)}}`;
    const num = (a, b) => `\\dfrac{${f[a]}}{${f[b]}}`;
    return pick(rand, [
      [
        `${head} إذن $${fr('VM', 'VB')} = ${fr('VN', 'VC')}$`,
        true,
        `$${num('VM', 'VB')} = ${num('VN', 'VC')}$`,
        figure,
      ],
      [
        `${head} إذن $${fr('VM', 'MB')} = ${fr('VN', 'VC')}$`,
        false,
        `$${num('VM', 'MB')} = ${tex(over(f.VM, f.MB))}$ و $${num('VN', 'VC')} = ${tex(over(f.VN, f.VC))}$`,
        figure,
      ],
      [
        `${head} إذن $${fr('VM', 'VB')} = ${fr('VC', 'VN')}$`,
        false,
        `$${num('VM', 'VB')} = ${tex(over(f.VM, f.VB))}$ و $${num('VC', 'VN')} = ${tex(over(f.VC, f.VN))}$`,
        figure,
      ],
    ]);
  },
  [K2]: (rand) => {
    const { f, names } = drawFigure(rand, false, { whole: true });
    const s = (k) => seg(names, k);
    const head = `${describe(names)} ${lengths(names, f, ['VM', 'VB', 'BC'])}.`;
    const figure = figureOf(f, names, false, { show: ['VM', 'VB', 'BC', 'MN'], ask: ['MN'] });
    const right = `$\\dfrac{${f.VM} \\times ${f.BC}}{${f.VB}} = ${tex(f.MN)}$`;
    const piece = write(over(times(f.MB, f.BC), f.VB));
    const inverted = write(over(times(f.VB, f.BC), f.VM));
    return pick(rand, [
      [`${head} إذن $${s('MN')} = ${tex(f.MN)}$`, true, right, figure],
      [`${head} إذن $${s('MN')} = ${tex(piece)}$`, false, right, figure],
      [`${head} إذن $${s('MN')} = ${tex(inverted)}$`, false, right, figure],
    ]);
  },
  [K3]: (rand) => {
    const { f, names } = drawFigure(rand, true);
    const s = (k) => seg(names, k);
    const head = `${describe(names)} ${lengths(names, f, ['VM', 'VB', 'VN'])}.`;
    const figure = figureOf(f, names, true, { show: ['VM', 'VB', 'VN', 'VC'], ask: ['VC'] });
    const right = `$\\dfrac{${f.VB} \\times ${f.VN}}{${f.VM}} = ${tex(f.VC)}$`;
    const crossed = write(over(times(f.VM, f.VN), f.VB));
    return pick(rand, [
      [`${head} إذن $${s('VC')} = ${tex(f.VC)}$`, true, right, figure],
      [`${head} إذن $${s('VC')} = ${tex(crossed)}$`, false, right, figure],
      [`${head} إذن $${s('VC')} = ${tex(plus(f.VM, f.VN))}$`, false, right, figure],
    ]);
  },
  [K4]: (rand) => {
    const f = pick(rand, FIGURES.scale);
    const k = over(f.VM, f.VB);
    const head = `في الشكل: $(MN) \\parallel (BC)$ ، $AB = ${tex(f.VB)}$ و $AM = ${tex(f.VM)}$.`;
    const figure = figureOf(f, SCALE_NAMES, false, { show: ['VM', 'VB'], draw: scaleDraw(f) });
    const down = `$\\dfrac{${tex(f.VM)}}{${tex(f.VB)}} = ${tex(k)}$ أصغر من 1`;
    const up = `$\\dfrac{${tex(f.VB)}}{${tex(f.VM)}} = ${tex(over('1', k))}$ أكبر من 1`;
    return pick(rand, [
      [`${head} المثلث $AMN$ تصغير للمثلث $ABC$`, true, down, figure],
      [`${head} المثلث $AMN$ تكبير للمثلث $ABC$`, false, down, figure],
      [`${head} المعامل من $AMN$ إلى $ABC$ هو $${tex(over('1', k))}$`, true, up, figure],
      [`${head} المعامل من $AMN$ إلى $ABC$ هو $${tex(k)}$`, false, up, figure],
    ]);
  },
};
/** The letters of the scale figures (🔍): ABC and AMN. */
const SCALE_NAMES = { V: 'A', M: 'M', B: 'B', N: 'N', C: 'C' };
/** Two reasons that prove nothing, per key: each states a false fact. */
const FOILS = {
  [K1]: ['لأنّ كلّ قطعة تقسم على القطعة التي تليها', 'لأنّ النسب متساوية في كلّ مثلث مهما كان المستقيم'],
  [K2]: ['لأنّ الطول المجهول هو فرق الضلعين', 'لأنّ الطول المجهول يُحسب بقسمة الضلع على القطعة'],
  [K3]: ['لأنّ الطول المجهول هو مجموع الطولين على المستقيم نفسه', 'لأنّ النسبتين في الفراشة مقلوبتان دائمًا'],
  [K4]: ['لأنّ كلّ معامل تكبير', 'لأنّ المعامل يُضاف إلى كلّ طول'],
};
const TF_HINT = {
  [K1]: 'تحقّق: احسب كلّ نسبة، والطول من الرأس على الضلع كلّه.',
  [K2]: 'تحقّق بالجداء المتصالب على النسبتين اللتين فيهما المجهول.',
  [K3]: 'تحقّق: الشريكان على مستقيم واحد يمرّ بنقطة التقاطع.',
  [K4]: 'تحقّق: قارن المعامل بالعدد 1.',
};

// ───────────────────────────── the right length of a ratio, and its claim ─────────────────────────────

/**
 * The unknown U of ratio i from the ratio j (both of `RATIOS`): U = P × Q / D, its three known lengths. Returned with
 * the cross product's writing.
 */
function solve(i, pos, j) {
  const [ri, rj] = [RATIOS[i], RATIOS[j]];
  // ri[0] / ri[1] = rj[0] / rj[1]: the numerator = ri[1] × rj[0] / rj[1]; the denominator = ri[0] × rj[1] / rj[0]
  return pos === 0 ? { U: ri[0], P: ri[1], Q: rj[0], D: rj[1] } : { U: ri[1], P: ri[0], Q: rj[1], D: rj[0] };
}
/** The formula of a length computed: « \\dfrac{35 \\times 78}{42} = 65 ». */
const computed = (f, s) => `\\dfrac{${tex(f[s.P])} \\times ${tex(f[s.Q])}}{${tex(f[s.D])}} = ${tex(f[s.U])}`;

// ───────────────────────────── the kinds of question ─────────────────────────────
const Q = {
  /** game — one sentence, three buoys (the felucca, standing still). */
  tap(rand, f, kind, params) {
    const wave = waveOf(rand, kind, params);
    const prompt = `${wave.say} $${wave.tex}$`;
    return { format: 'game', kind: 'tap', key: wave.key, wave, options: wave.gates, prompt };
  },

  /** true / false. game: one tap. exam: « صحيح أم خطأ؟ علّل » — the truth AND its reason. */
  tf(rand, format, key) {
    const [statement, truth, why, figure] = TF[key](rand);
    return {
      format,
      kind: 'tf',
      key,
      statement,
      truth,
      why,
      figure,
      reasons:
        format === 'exam'
          ? shuffle(rand, [{ t: `لأنّ ${why}`, ok: true }, ...FOILS[key].map((t) => ({ t, ok: false }))])
          : null,
      prompt: statement,
    };
  },

  /** 🔑 exam — « احسب النسبة »: a ratio of the chain from the two lengths of another (a side maybe in pieces). */
  nisba(rand) {
    const { f, names } = drawFigure(rand, false);
    const s = (k) => seg(names, k);
    const pieces = rand() < 0.5;
    const ask = pick(rand, ['VN', 'MN']);
    const asked = ask === 'VN' ? ['VN', 'VC'] : ['MN', 'BC'];
    const k = over(f.VM, f.VB);
    return {
      format: 'exam',
      kind: 'nisba',
      key: K1,
      f,
      names,
      pieces,
      asked,
      k: write(k),
      figure: figureOf(f, names, false, { show: pieces ? ['VM', 'MB'] : ['VM', 'VB'] }),
      prompt: `${describe(names)} ${lengths(names, f, pieces ? ['VM', 'MB'] : ['VM', 'VB'])}. احسب النسبة $\\dfrac{${s(asked[0])}}{${s(asked[1])}}$.`,
      form: {
        tip: 'tipCompute',
        lines: [{ ltr: true, tokens: [{ frac: { n: s(asked[0]), d: s(asked[1]) } }, '=', fracBox('n', 'd')] }],
      },
    };
  },

  /** 🔑 exam — « اكتب النسب الثلاث المتساوية »: segment names chosen inside three fractions. */
  nisab(rand, format, butterfly = false) {
    const { f, names } = drawFigure(rand, butterfly);
    const s = (k) => seg(names, k);
    const options = [
      [s('VM'), s('VB'), s('MB')],
      [s('VN'), s('VC'), s('NC')],
      [s('MN'), s('BC')],
    ];
    return {
      format: 'exam',
      kind: butterfly ? 'farashaNisab' : 'nisab',
      key: butterfly ? K3 : K1,
      names,
      figure: figureOf(f, names, butterfly),
      prompt: `${describe(names)} اكتب النسب الثلاث المتساوية.`,
      form: {
        tip: 'tipWrite',
        lines: [
          {
            ltr: true,
            tokens: [
              ratioChoice('r1n', 'r1d', options[0]),
              '=',
              ratioChoice('r2n', 'r2d', options[1]),
              '=',
              ratioChoice('r3n', 'r3d', options[2]),
            ],
          },
        ],
      },
    };
  },

  /** 🦋 exam — the three ratios of a butterfly. */
  farashaNisab(rand, format) {
    return Q.nisab(rand, format, true);
  },

  /** 📐 exam — « احسب الطول »: the unknown of one ratio from a ratio wholly known. */
  tul(rand) {
    const { f, names } = drawFigure(rand, false);
    const i = pick(rand, [0, 1, 2]);
    const j = pick(
      rand,
      [0, 1, 2].filter((x) => x !== i),
    );
    const sol = solve(i, pick(rand, [0, 1]), j);
    return {
      format: 'exam',
      kind: 'tul',
      key: K2,
      f,
      names,
      sol,
      figure: figureOf(f, names, false, { show: [sol.P, sol.Q, sol.D, sol.U], ask: [sol.U] }),
      prompt: `${describe(names)} ${UNIT_NOTE} ${lengths(names, f, [sol.P, sol.Q, sol.D])}. احسب الطول $${seg(names, sol.U)}$.`,
      form: {
        tip: 'tipCompute',
        lines: [{ ltr: true, tokens: [seg(names, sol.U), '=', lengthBox('x', seg(names, sol.U)), UNIT] }],
      },
    };
  },

  /** 📐 exam — a side from the vertex given in two pieces: the whole side first, then the unknown. */
  tulJuz(rand) {
    const { f, names } = drawFigure(rand, false);
    const v = pick(rand, ['VC', 'MN', 'BC']);
    // VC from VM, MB and VN (VB = VM + MB); MN from VM, MB and BC; BC from VN, NC and MN (VC = VN + NC)
    const spec = {
      VC: { part: 'VM', piece: 'MB', side: 'VB', other: 'VN', sol: solve(1, 1, 0) },
      MN: { part: 'VM', piece: 'MB', side: 'VB', other: 'BC', sol: solve(2, 0, 0) },
      BC: { part: 'VN', piece: 'NC', side: 'VC', other: 'MN', sol: solve(2, 1, 1) },
    }[v];
    return {
      format: 'exam',
      kind: 'tulJuz',
      key: K2,
      f,
      names,
      ...spec,
      figure: figureOf(f, names, false, {
        show: [spec.part, spec.piece, spec.other, spec.sol.U],
        ask: [spec.sol.U],
      }),
      prompt: `${describe(names)} ${UNIT_NOTE} ${lengths(names, f, [spec.part, spec.piece, spec.other])}. احسب الطول $${seg(names, spec.side)}$ ، ثمّ الطول $${seg(names, spec.sol.U)}$.`,
      form: {
        tip: 'tipCompute',
        lines: [
          { ltr: true, tokens: [seg(names, spec.side), '=', lengthBox('w', seg(names, spec.side)), UNIT] },
          { ltr: true, tokens: [seg(names, spec.sol.U), '=', lengthBox('x', seg(names, spec.sol.U)), UNIT] },
        ],
      },
    };
  },

  /** 🦋 exam — two lengths of a butterfly from the ratio of one line: the partner across V, then the parallel side. */
  farasha(rand) {
    const { f, names } = drawFigure(rand, true);
    // VC = VB × VN / VM ; MN = VM × BC / VB
    const sols = [solve(1, 1, 0), solve(2, 0, 0)];
    return {
      format: 'exam',
      kind: 'farasha',
      key: K3,
      f,
      names,
      sols,
      figure: figureOf(f, names, true, { show: ['VM', 'VB', 'VN', 'BC', 'VC', 'MN'], ask: ['VC', 'MN'] }),
      prompt: `${describe(names)} ${UNIT_NOTE} ${lengths(names, f, ['VM', 'VB', 'VN', 'BC'])}. احسب الطولين $${seg(names, 'VC')}$ و $${seg(names, 'MN')}$.`,
      form: {
        tip: 'tipCompute',
        lines: sols.map((s, i) => ({
          ltr: true,
          tokens: [seg(names, s.U), '=', lengthBox(i ? 'y' : 'x', seg(names, s.U)), UNIT],
        })),
      },
    };
  },

  /** 🔍 exam — k from the first triangle to the second, the direction, the image of a side, and the number back. */
  muamil(rand) {
    const f = pick(rand, FIGURES.scale);
    const down = rand() < 0.5;
    // the first triangle (1) and the second (2): ABC → AMN (a reduction) or AMN → ABC (an enlargement)
    const [one, two] = down
      ? [
          ['VB', 'BC'],
          ['VM', 'MN'],
        ]
      : [
          ['VM', 'MN'],
          ['VB', 'BC'],
        ];
    const names = SCALE_NAMES;
    const [t1, t2] = down ? ['ABC', 'AMN'] : ['AMN', 'ABC'];
    const s = (key) => seg(names, key);
    return {
      format: 'exam',
      kind: 'muamil',
      key: K4,
      f,
      one,
      two,
      k: write(over(f[two[0]], f[one[0]])),
      figure: figureOf(f, names, false, {
        show: [one[0], one[1], two[0], two[1]],
        ask: [two[1]],
        draw: scaleDraw(f),
      }),
      prompt: `في الشكل: $(MN) \\parallel (BC)$. ${UNIT_NOTE} ${lengths(names, f, [one[0], one[1], two[0]])}. أعط معامل التناسبية $k$ من المثلث الأوّل $${t1}$ إلى المثلث الثاني $${t2}$ ، ثمّ احسب $${s(two[1])}$ ، ثمّ المعامل $k'$ من الثاني إلى الأوّل.`,
      form: {
        tip: 'tipCompute',
        lines: [
          { ltr: true, tokens: ['k', '=', fracBox('kn', 'kd')] },
          {
            tokens: [
              'المثلث الثاني',
              {
                choice: 'kind',
                label: 'تكبير أم تصغير',
                buttons: true,
                options: [
                  { value: 'reduction', text: 'تصغير' },
                  { value: 'enlargement', text: 'تكبير' },
                ],
              },
              'للمثلث الأوّل',
            ],
          },
          { ltr: true, tokens: [s(two[1]), '=', lengthBox('mn', s(two[1])), UNIT] },
          { ltr: true, tokens: ["k'", '=', fracBox('bn', 'bd')] },
        ],
      },
    };
  },
};

/** What a session asks, by family of card: [kind, …arguments] for the six slots (game, game, exam, game, exam, exam). */
const PLANS = {
  k1: [
    ['tap', 'nested', { find: 'VC' }],
    ['tf', K1],
    ['nisba'],
    ['tap', 'nested', { find: 'MN' }],
    ['nisab'],
    ['nisba'],
  ],
  k2: [['tap', 'fourth', {}], ['tf', K2], ['tul'], ['tap', 'whole', {}], ['tulJuz'], ['tul']],
  k3: [['tap', 'butterfly', {}], ['tf', K3], ['farasha'], ['tap', 'butterflyLen', {}], ['farashaNisab'], ['farasha']],
  k4: [['tap', 'direction', {}], ['tf', K4], ['muamil'], ['tap', 'image', {}], ['tf', K4], ['muamil']],
  mix: [['tap', 'nested', { find: 'VC' }], ['tf', K2], ['tulJuz'], ['tap', 'image', {}], ['farasha'], ['muamil']],
};
/** Which plan a card of the lesson's mind map trains (`knowledge.js`). */
export const PLAN_OF = {
  talis: 'k1',
  tasaluib: 'k1',
  nisab: 'k1',
  qitaa: 'k1',
  hisab: 'k2',
  tajmi: 'k2',
  maqluba: 'k2',
  farasha: 'k3',
  'farasha-hisab': 'k3',
  muamil: 'k4',
  takbir: 'k4',
  khulasa: 'mix',
};

// ───────────────────────────── the right answers ─────────────────────────────

/** A length as the decimal box writes it: « 32,5 ». */
const boxOf = (x) => write(x);
/** The ratios a student must choose: [[num, den] × 3] with the letters of the question. */
const chainOf = (q) => RATIOS.map(([a, b]) => [seg(q.names, a), seg(q.names, b)]);

/** The right answer of a question — for the tests and the automated walk, never shown before the correction. */
export function solution(q) {
  switch (q.kind) {
    case 'tap':
      return q.wave.gates[q.wave.good];
    case 'tf':
      return q.reasons ? { truth: q.truth, reason: q.reasons.findIndex((r) => r.ok) } : { truth: q.truth };
    case 'nisba': {
      const k = read(q.k);
      return { n: Number(k.n), d: Number(k.d) };
    }
    case 'nisab':
    case 'farashaNisab': {
      const [[a, b], [c, d], [e, g]] = chainOf(q);
      return { r1n: a, r1d: b, r2n: c, r2d: d, r3n: e, r3d: g };
    }
    case 'tul':
      return { x: boxOf(q.f[q.sol.U]) };
    case 'tulJuz':
      return { w: boxOf(q.f[q.side]), x: boxOf(q.f[q.sol.U]) };
    case 'farasha':
      return { x: boxOf(q.f[q.sols[0].U]), y: boxOf(q.f[q.sols[1].U]) };
    case 'muamil': {
      const k = read(q.k);
      return {
        kn: Number(k.n),
        kd: Number(k.d),
        kind: k.n > k.d ? 'enlargement' : 'reduction',
        mn: boxOf(q.f[q.two[1]]),
        bn: Number(k.d),
        bd: Number(k.n),
      };
    }
    default:
      return null;
  }
}

// ───────────────────────────── judging ─────────────────────────────

/** Is the typed length v the right one? */
const sameLength = (v, x) => v != null && equal(v, x);
/** A hint for a length typed: the piece, the inverted ratio, the sum, or what to write. */
function lengthHint(q, s, typed) {
  if (typed == null) return `اكتب الطول $${seg(q.names, s.U)}$ عددًا، بفاصلة إن لزم: مثل $32{,}5$.`;
  const f = q.f;
  const inverted = over(times(f[s.P], f[s.D]), f[s.Q]);
  if (equal(typed, inverted))
    return `النسبة مقلوبة: اكتب النسبتين بالترتيب نفسه، $${seg(q.names, 'VM')}$ على $${seg(q.names, 'VB')}$ مثلًا، ثمّ احسب بالجداء المتصالب.`;
  if (equal(typed, plus(f[s.P], f[s.Q])) || equal(typed, minus(f[s.P], f[s.Q])) || equal(typed, minus(f[s.Q], f[s.P])))
    return 'الأطوال لا تُجمع ولا تُطرح هنا: النسب متساوية، فاحسب بالجداء المتصالب.';
  return `اكتب النسبتين اللتين فيهما $${seg(q.names, s.U)}$ وثلاثة أطوال معلومة، ثمّ احسب بالجداء المتصالب.`;
}
/** The ratios chosen are the chain (or the chain upside down, every ratio)? */
function chainHint(q, v) {
  const chain = chainOf(q);
  const picked = [
    [v.r1n, v.r1d],
    [v.r2n, v.r2d],
    [v.r3n, v.r3d],
  ];
  if (picked.some(([a, b]) => a == null || b == null))
    return { ok: false, hint: 'اختر البسط والمقام في النسب الثلاث.' };
  const same = picked.every(([a, b], i) => a === chain[i][0] && b === chain[i][1]);
  const flipped = picked.every(([a, b], i) => a === chain[i][1] && b === chain[i][0]);
  if (same || flipped) return { ok: true };
  const pieces = [seg(q.names, 'MB'), seg(q.names, 'NC')];
  if (picked.some(([a, b]) => pieces.includes(a) || pieces.includes(b)))
    return {
      ok: false,
      hint: `$${pieces[0]}$ و $${pieces[1]}$ ${q.kind === 'farashaNisab' ? 'يمرّان بنقطة التقاطع ولا يبدآن منها' : 'قطعتان لا تبدآن من الرأس'}: كلّ طول في النسب يُقاس من $${q.names.V}$.`,
    };
  return { ok: false, hint: 'اكتب النسب الثلاث بالترتيب نفسه: طول من المثلث الصغير على موافقه من المثلث الكبير.' };
}

/**
 * Judges an answer. Returns { ok, hint, fix }:
 *   hint — after a first wrong answer: what the answer gives, or what is still missing (never the answer);
 *   fix  — the written correction, shown after a right answer or a second wrong one.
 */
export function check(q, v) {
  const val = v ?? {};
  switch (q.kind) {
    case 'tap': {
      const right = isRight(q.wave, v);
      const fact = right ? q.wave.why.right : (q.wave.why.wrong?.[v] ?? q.wave.why.right);
      return { ok: right, hint: fact, fix: q.wave.why.right };
    }
    case 'tf': {
      const truthOk = val.truth === q.truth;
      const reasonOk = !q.reasons || q.reasons[val.reason]?.ok === true;
      return {
        ok: truthOk && reasonOk,
        hint: !truthOk ? TF_HINT[q.key] : 'الحكم في محلّه، لكنّ هذا التعليل لا يثبته: ابحث عن المساواة التي تبرهن.',
        fix: `العبارة ${q.truth ? 'صحيحة' : 'ليست صحيحة'}: ${q.why}.`,
      };
    }
    case 'nisba': {
      const { f, names, asked } = q;
      const s = (k) => seg(names, k);
      const side = q.pieces ? ` و $${tex(f.VM)} + ${tex(f.MB)} = ${tex(f.VB)}$` : '';
      const fix = `$(${s('MN')}) \\parallel (${s('BC')})$ ، إذن $\\dfrac{${s(asked[0])}}{${s(asked[1])}} = \\dfrac{${s('VM')}}{${s('VB')}}$${side} ، و $\\dfrac{${tex(f.VM)}}{${tex(f.VB)}} = ${tex(q.k)}$.`;
      const typed = typedFrac(val.n, val.d);
      if (typed == null) return { ok: false, hint: 'املأ البسط والمقام.', fix };
      if (equal(typed, q.k)) return { ok: true, fix };
      return {
        ok: false,
        hint: equal(typed, over(f.VM, f.MB))
          ? `$${s('MB')}$ قطعة: في النسبة يُقسم الطول من الرأس على الضلع كلّه $${s('VB')}$.`
          : equal(typed, over(f.VB, f.VM))
            ? 'النسبة مقلوبة: الطول القصير من الرأس في البسط، والضلع كلّه في المقام.'
            : `النسبة $\\dfrac{${s(asked[0])}}{${s(asked[1])}}$ تساوي نسبة أخرى من النسب الثلاث، أطوالها معلومة.`,
        fix,
      };
    }
    case 'nisab':
    case 'farashaNisab': {
      const [[a, b], [c, d], [e, g]] = chainOf(q);
      const fix = `$(${seg(q.names, 'MN')}) \\parallel (${seg(q.names, 'BC')})$ ، إذن $\\dfrac{${a}}{${b}} = \\dfrac{${c}}{${d}} = \\dfrac{${e}}{${g}}$.`;
      const r = chainHint(q, val);
      return r.ok ? { ok: true, fix } : { ok: false, hint: r.hint, fix };
    }
    case 'tul': {
      const { f, names, sol } = q;
      const fix = `$\\dfrac{${seg(names, RATIOS[0][0])}}{${seg(names, RATIOS[0][1])}} = \\dfrac{${seg(names, RATIOS[1][0])}}{${seg(names, RATIOS[1][1])}} = \\dfrac{${seg(names, RATIOS[2][0])}}{${seg(names, RATIOS[2][1])}}$ ، إذن $${computed(f, sol)}$ ${UNIT}.`;
      const typed = typedNumber(val.x);
      if (sameLength(typed, f[sol.U])) return { ok: true, fix };
      return { ok: false, hint: lengthHint(q, sol, typed), fix };
    }
    case 'tulJuz': {
      const { f, names, sol } = q;
      const fix = `$${tex(f[q.part])} + ${tex(f[q.piece])} = ${tex(f[q.side])}$ ، ثمّ $${computed(f, sol)}$ ${UNIT}.`;
      const w = typedNumber(val.w);
      if (!sameLength(w, f[q.side]))
        return {
          ok: false,
          hint:
            w == null
              ? `اكتب الطول $${seg(names, q.side)}$ أوّلًا.`
              : `$${seg(names, q.side)}$ ضلع من الرأس، قطعتاه $${seg(names, q.part)}$ و $${seg(names, q.piece)}$.`,
          fix,
        };
      const x = typedNumber(val.x);
      if (sameLength(x, f[sol.U])) return { ok: true, fix };
      return { ok: false, hint: lengthHint(q, sol, x), fix };
    }
    case 'farasha': {
      const { f, names, sols } = q;
      const fix = `$${computed(f, sols[0])}$ ${UNIT} ، و $${computed(f, sols[1])}$ ${UNIT}.`;
      for (const [s, box] of [
        [sols[0], 'x'],
        [sols[1], 'y'],
      ]) {
        const t = typedNumber(val[box]);
        if (sameLength(t, f[s.U])) continue;
        const sum = t != null && equal(t, plus(f.VM, f.VB));
        return {
          ok: false,
          hint: sum
            ? `$${tex(f.VM)} + ${tex(f.VB)}$ طول $[${seg(names, 'MB')}]$ ، وليس ضلعًا في أحد المثلثين: الأطوال تُقاس من $${names.V}$.`
            : lengthHint(q, s, t),
          fix,
        };
      }
      return { ok: true, fix };
    }
    case 'muamil': {
      const { f, one, two } = q;
      const names = { V: 'A', M: 'M', B: 'B', N: 'N', C: 'C' };
      const s = (key) => seg(names, key);
      const k = q.k;
      const big = read(k).n > read(k).d;
      const fix = `$k = \\dfrac{${s(two[0])}}{${s(one[0])}} = \\dfrac{${tex(f[two[0]])}}{${tex(f[one[0]])}} = ${tex(k)}$ ، ${big ? 'أكبر' : 'أصغر'} من 1: ${big ? 'تكبير' : 'تصغير'}. $${tex(f[one[1]])} \\times ${tex(k)} = ${tex(f[two[1]])}$ ${UNIT} ، و $k' = ${tex(over('1', k))}$.`;
      const typedK = typedFrac(val.kn, val.kd);
      if (typedK == null || !equal(typedK, k))
        return {
          ok: false,
          hint:
            typedK != null && equal(typedK, over('1', k))
              ? 'هذا المعامل من الثاني إلى الأوّل: k طول من المثلث الثاني على موافقه من الأوّل.'
              : 'k طول من المثلث الثاني على موافقه من المثلث الأوّل.',
          fix,
        };
      if (val.kind !== (big ? 'enlargement' : 'reduction'))
        return { ok: false, hint: 'قارن k بالعدد 1: أكبر منه يكبّر الأطوال، وأصغر منه يصغّرها.', fix };
      const mn = typedNumber(val.mn);
      if (!sameLength(mn, f[two[1]]))
        return {
          ok: false,
          hint:
            mn != null && equal(mn, plus(f[one[1]], k))
              ? 'المعامل يُضرب في الطول، لا يُضاف إليه.'
              : `صورة $${s(one[1])}$ هي $${s(one[1])} \\times k$.`,
          fix,
        };
      const back = typedFrac(val.bn, val.bd);
      if (back == null || !equal(back, over('1', k)))
        return { ok: false, hint: "k' يعيد كلّ طول من الثاني إلى الأوّل: $k \\times k' = 1$.", fix };
      return { ok: true, fix };
    }
    default:
      return { ok: false, hint: '', fix: '' };
  }
}

/** A typed number as a formula, or « … » when the box is empty or not a number. */
const shown = (x) => (x == null ? '\\ldots' : tex(x));
const fracShown = (n, d) => (typedFrac(n, d) == null ? '\\ldots' : `\\dfrac{${typedWhole(n)}}{${typedWhole(d)}}`);

/** An answer as the student gave it, in one line, to read again later. */
export function answerLabel(q, v) {
  const val = v ?? {};
  switch (q.kind) {
    case 'tap':
      return String(v);
    case 'tf':
      return `${val.truth ? 'صحيح' : 'ليس صحيحًا'}${q.reasons && q.reasons[val.reason] ? ` — ${q.reasons[val.reason].t}` : ''}`;
    case 'nisba':
      return `$\\dfrac{${seg(q.names, q.asked[0])}}{${seg(q.names, q.asked[1])}} = ${fracShown(val.n, val.d)}$`;
    case 'nisab':
    case 'farashaNisab': {
      const r = (n, d) => `\\dfrac{${val[n] ?? '\\ldots'}}{${val[d] ?? '\\ldots'}}`;
      return `$${r('r1n', 'r1d')} = ${r('r2n', 'r2d')} = ${r('r3n', 'r3d')}$`;
    }
    case 'tul':
      return `$${seg(q.names, q.sol.U)} = ${shown(typedNumber(val.x))}$ ${UNIT}`;
    case 'tulJuz':
      return `$${seg(q.names, q.side)} = ${shown(typedNumber(val.w))}$ ، $${seg(q.names, q.sol.U)} = ${shown(typedNumber(val.x))}$`;
    case 'farasha':
      return `$${seg(q.names, q.sols[0].U)} = ${shown(typedNumber(val.x))}$ ، $${seg(q.names, q.sols[1].U)} = ${shown(typedNumber(val.y))}$`;
    case 'muamil': {
      const word = val.kind === 'enlargement' ? 'تكبير' : val.kind === 'reduction' ? 'تصغير' : '…';
      const side = seg({ V: 'A', M: 'M', B: 'B', N: 'N', C: 'C' }, q.two[1]);
      return `$k = ${fracShown(val.kn, val.kd)}$ ، ${word} ، $${side} = ${shown(typedNumber(val.mn))}$ ، $k' = ${fracShown(val.bn, val.bd)}$`;
    }
    default:
      return '';
  }
}

/** The trainer of this lesson: its questions and how they are judged, bound to the kit's frame. */
export const trainer = createTrainer({
  kinds: Q,
  plans: PLANS,
  planOf: PLAN_OF,
  fallback: 'mix',
  check,
  solution,
  answerLabel,
});
