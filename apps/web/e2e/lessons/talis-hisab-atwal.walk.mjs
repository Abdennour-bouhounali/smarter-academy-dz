// The walks of lesson `talis-hisab-atwal` « خاصية طالس وحساب الأطوال », the first lesson of the world « الأهرامات »
// (`nile-pyramids`) — a DESCRIPTOR for lib/lessonWalk (README there): only what the lesson's files cannot say — the walk's
// own arithmetic of every verdict (exact fractions, lib/lessonWalk/worlds/exact.mjs — never the lesson's `math.js`,
// `forges.js` or `trainer.js › solution`), the words no screen may show before their tablet, and the launch kit's tool.
//
// The world's walk handlers (written 2026-11-24, PYRAMIDS_WORLD_PLAN.md §2.5):
//   - `worlds/nilePyramids.mjs` (`NILE_PYRAMIDS = { id, story, practice, names }`, registered in WORLDS): « ابدأ »; E at a
//     stake; ← → held until `data-np-rope` shows the knot, released THERE; the order's box (`data-np-order`); the stick's
//     slide; the felucca's lanes; the mission's boxes; the dev handle `window.__world` (Zero placed at a stake or a dock,
//     the clock fast-forwarded, the state READ for the question only); the hooks `data-np-stake`, `data-np-register`,
//     `data-np-predict`, `data-np-fact`, `data-np-sight`, `data-np-stage`, `data-np-dock`;
//     the felucca's buoys are bare calculations since 2026-11-28 (`buoy` below): no `data-gr-figure` on this lesson's rail;
//     the half-turn's gauge turns with the triangle (`data-rf-gauge-turn=<angle>` on `.np-tg`, from the first press);
//   - `worlds/nilePyramidsExperiments.mjs`: the players of the kinds `plan` (📐), `halfturn` (🦋) and `scale` (🔍),
//     registered in `experiments.mjs › EXPERIMENTS`, and `NP_FRAME` for `checks.mjs › inquiryFits`;
//   - `gateRun.mjs`: `rcPractice` moved out of `rootCourts.mjs` (the felucca and the practice levels run on the kit's
//     rail; the crocodile lane read from `data-gr-hazard`);
//   - the board's `figure` station in `board.mjs` (this lesson's board has figure stations);
//   - the forge 🔑 opens on its tiles with NO experiment (its evidence is the field's log): `forge.mjs` must accept a
//     forge whose `inquiry` is absent and whose cases come from the world's log;
//   - the trainer's `ratioChoice` boxes (segment names chosen inside three fractions: `r1n`…`r3d`), its decimal boxes
//     (`decimal: true`) and its button choice (`kind`), in `trainer.mjs`;
//   - the launch kit's write with a fraction token whose DENOMINATOR is a box (« 2/4 = 3/▢ ») and a written unit after
//     the box (« AC = ▢ cm »), in `lib/launchKitTwoTools.mjs`.
// What it expects from those handlers, in its own functions below: a forge case is the world's Thalès case
// `{ kind: 'nested' | 'butterfly', names: { V, M, B, N, C }, len: { VM, VB, VN, VC, MN, BC } }` (lengths as text,
// « 42,5 »), plus `typed` and `unknown` on a 📐 course and `one` ('small' | 'big') and `x` on a 🔍 copy; a last step is
// the forge's `use.make()`; a trainer question carries `kind`, `names`, the lengths `f` and the keys the prompt GIVES
// (`sol`, `part`/`piece`/`other`, `one`/`two`) — the walk computes the asked lengths from the given ones only.
// Run (once the handlers exist): E2E_SIZE=1366x768 node apps/web/e2e/lesson.mjs talis-hisab-atwal [story|hub|trainer|board|launch|sitting|all] [outDir]
import { cmp, eq, mul, q, sub, write } from '../lib/lessonWalk/worlds/exact.mjs';

const inv = (b) => ({ n: q(b).d, d: q(b).n });
const div = (a, b) => mul(a, inv(b));
const add = (a, b) => sub(a, mul(b, '-1'));
/** The partner of a length in the other triangle (small VMN ↔ big VBC), and which side a length stands on. */
const PARTNER = { VM: 'VB', VB: 'VM', VN: 'VC', VC: 'VN', MN: 'BC', BC: 'MN' };
const SMALL = new Set(['VM', 'VN', 'MN']);
/** The letters of a length: « VB » with V = D, B = E → « DE » (the world's `segName`, by its letters). */
const seg = (names, key) =>
  key
    .split('')
    .map((ch) => names[ch] ?? ch)
    .join('');

/**
 * A length of the figure computed from the lengths GIVEN only (`known`: { VM, MB, … }): the pieces give the whole sides
 * from the vertex (VB = VM + MB, VC = VN + NC — a nested figure only), a pair small/big wholly known gives k = small/big,
 * then the asked length is its partner × k (or ÷ k).
 */
function lengthFrom(known, asked, kind = 'nested') {
  const L = { ...known };
  if (kind === 'nested') {
    if (L.VB == null && L.VM != null && L.MB != null) L.VB = add(L.VM, L.MB);
    if (L.VC == null && L.VN != null && L.NC != null) L.VC = add(L.VN, L.NC);
    if (L.VM == null && L.VB != null && L.MB != null) L.VM = sub(L.VB, L.MB);
    if (L.VN == null && L.VC != null && L.NC != null) L.VN = sub(L.VC, L.NC);
  }
  if (L[asked] != null) return q(L[asked]);
  // a piece asked: its whole side less the part from the vertex, each computed
  const PIECE = { MB: ['VB', 'VM'], NC: ['VC', 'VN'] };
  if (PIECE[asked]) {
    const [whole, part] = PIECE[asked];
    return sub(lengthFrom(known, whole, kind), lengthFrom(known, part, kind));
  }
  const pair = ['VM', 'VN', 'MN'].find((s) => L[s] != null && L[PARTNER[s]] != null);
  if (!pair) throw new Error(`the walk finds no ratio wholly given (${JSON.stringify(known)})`);
  const k = div(L[pair], L[PARTNER[pair]]);
  const partner = L[PARTNER[asked]];
  if (partner == null) throw new Error(`the walk cannot reach ${asked} from ${JSON.stringify(known)}`);
  return SMALL.has(asked) ? mul(partner, k) : div(partner, k);
}
const given = (f, keys) => Object.fromEntries(keys.map((k) => [k, f[k]]));
/** The three ratios from the vertex are equal (the world's verdict on a Thalès case), exactly. */
const chainHolds = (len) => {
  const r = [div(len.VM, len.VB), div(len.VN, len.VC), div(len.MN, len.BC)];
  return eq(r[0], r[1]) && eq(r[0], r[2]);
};
/** A number as a formula writes it: « 1{,}75 », « \\dfrac{7}{4} », « 13,75 ». */
const texNum = (t) => {
  const m = /\\dfrac\{([^}]*)\}\{([^}]*)\}/.exec(t);
  return m ? div(q(m[1]), q(m[2])) : q(String(t).replace(/[{}]/g, '').trim());
};
/**
 * A buoy of a leg or of a practice level is right? — the order read (`ask`, `tex`), the walk's own arithmetic. Since
 * 2026-11-28 a buoy is ONE bare calculation (owner, 2026-11-27: « speed calculation questions like: complete 4/12 = 5/… »):
 * « أكمل » an equality of two fractions with its box `\square` (a term may be a sum « 4 + 8 »), « احسب » the cross product
 * « \dfrac{12 \times 5}{4} », a side times k « 24 \times \dfrac{5}{6} », a coefficient « 9 \div 6 », and « أكمل »
 * « \dfrac{5}{6} \times \square = 1 ». No letter, no figure: a buoy that names a point is refused here.
 */
function buoy(ask, tex, gate) {
  const say = ask.replace(/[\u2066-\u2069\u200e\u200f]/g, '').trim();
  const t = String(tex ?? '')
    .replace(/\\displaystyle\s*/g, '')
    .replace(/\{,\}/g, ',')
    .trim();
  if (!/^(أكمل|احسب)$/.test(say) || /[A-Z]/.test(t.replace(/\\[a-z]+/g, '')))
    throw new Error(`the walk reads only bare calculations, not « ${say} » ${t}`);
  const g = texNum(gate);
  // a term of the calculation: a number « 7,5 », or a sum « 4 + 8 »
  const term = (x) => x.split('+').reduce((acc, y) => add(acc, q(y.trim())), '0');
  let m = /^\\dfrac\{([^}]+)\}\{([^}]+)\} = \\dfrac\{([^}]+)\}\{([^}]+)\}$/.exec(t);
  if (m) {
    // a / b = c / d with g in the box: the two cross products are equal
    const [a, b, c, d] = m.slice(1).map((x) => (x.trim() === '\\square' ? g : term(x)));
    return eq(mul(a, d), mul(b, c));
  }
  m = /^\\dfrac\{([\d,]+) \\times ([\d,]+)\}\{([\d,]+)\}$/.exec(t);
  if (m) return eq(mul(g, m[3]), mul(m[1], m[2]));
  m = /^(\d+) \\times \\dfrac\{(\d+)\}\{(\d+)\}$/.exec(t);
  if (m) return eq(mul(g, m[3]), mul(m[1], m[2]));
  m = /^(\d+) \\div (\d+)$/.exec(t);
  if (m) return eq(mul(g, m[2]), q(m[1]));
  m = /^\\dfrac\{(\d+)\}\{(\d+)\} \\times \\square = 1$/.exec(t);
  if (m) return eq(mul(g, div(m[1], m[2])), '1');
  throw new Error(`the walk cannot read the buoy « ${say} » ${t}`);
}
/** The numbers of a sentence of the story (« $AH = 104$ »): the first number after `re`. */
const numAfter = (text, re) => {
  const m = new RegExp(`${re.source}[^\\d]*?([\\d]+(?:\\{?,\\}?\\d+)?)`).exec(text);
  if (!m) throw new Error(`the walk finds no number after ${re} in « ${text.slice(0, 80)} »`);
  return m[1].replace(/[{}]/g, '');
};

/** The lengths a board station's figure writes on its segments: « AB » → '98' (both orders; « ? » left out). */
const labelsOf = (step) => {
  const out = {};
  for (const x of step.figure.segments) {
    if (Array.isArray(x) || x.label == null || x.label === '?') continue;
    out[x.from + x.to] = String(x.label);
    out[x.to + x.from] = String(x.label);
  }
  return out;
};

/** A formula's value: « \dfrac{42 \times 81}{63} », « \dfrac{5}{8} », « 42{,}5 » — or null when it is not a number. */
function texValue(t) {
  const s = String(t).trim();
  const f = /^\\dfrac\{([^{}]+)\}\{([^{}]+)\}$/.exec(s);
  if (f) {
    const [a, b] = [texValue(f[1]), texValue(f[2])];
    return a && b ? div(a, b) : null;
  }
  if (s.includes('\\times')) {
    const xs = s.split('\\times').map(texValue);
    return xs.every(Boolean) ? xs.reduce((x, y) => mul(x, y)) : null;
  }
  try {
    return q(s.replace(/[{}]/g, ''));
  } catch {
    return null;
  }
}
/**
 * A reason of « صحيح أم خطأ؟ علّل » proves the statement when it WRITES its facts and every one is true: each equality
 * between numbers holds (computed here), and « أصغر من 1 » / « أكبر من 1 » holds of its last number. A sentence that
 * writes no number proves nothing.
 */
function reasonTrue(text) {
  const formulas = [...String(text).matchAll(/\$([^$]+)\$/g)].map((m) => m[1]);
  if (!formulas.length) return false;
  let last = null;
  for (const f of formulas) {
    const vals = f.split('=').map(texValue);
    if (vals.length < 2 || vals.some((v) => v == null) || !vals.every((v) => eq(v, vals[0]))) return false;
    last = vals.at(-1);
  }
  if (/أصغر من 1/.test(text) && !(cmp(last, '1') < 0)) return false;
  if (/أكبر من 1/.test(text) && !(cmp(last, '1') > 0)) return false;
  return true;
}

/** A fraction written in two whole boxes, reduced. */
const fracBoxes = (x, n = 'n', d = 'd') => ({ [n]: Number(q(x).n), [d]: Number(q(x).d) });

export default {
  id: 'talis-hisab-atwal',
  uid: 9850,
  // the words of each key's name that no screen shows before its tablet (its tablet's title is always added; the
  // lesson's own title « خاصية طالس وحساب الأطوال » stands on the title screen and is excepted by the library)
  forbidden: {
    'wadiyat-talis': ['وضعية طالس'],
    'hisab-tul': ['طول مجهول'],
    'wadiyat-al-farasha': ['فراشة', 'الفراشة'],
    'muamil-k': ['معامل', 'تكبير', 'تصغير'],
  },
  // what the world does with a case of each forge, computed here
  truth: {
    // 🔑 a field and its canal: the three ratios from the vertex are equal — or not
    'wadiyat-talis': (c) => chainHolds(c.len),
    // 📐 a course laid at `typed` for the unknown, from what is given: it fits exactly when typed IS that length
    'hisab-tul': (c) => eq(c.typed, lengthFrom(given(c.len, c.given), c.unknown, c.kind)),
    // 🦋 the two triangles across V after the half-turn: the three ratios are equal — or not
    'wadiyat-al-farasha': (c) => chainHolds(c.len),
    // 🔍 the frame at x fed (1): the copy IS (2) exactly when x × a side of (1) = its partner in (2)
    'muamil-k': (c) => {
      const [from, to] = c.one === 'small' ? ['VM', 'VB'] : ['VB', 'VM'];
      return eq(mul(c.len[from], c.x), c.len[to]);
    },
  },
  use: {
    // 🔑 the field DEF, the canal [GH] ∥ (EF): the reason, then the three ratios from the vertex, in one order
    'wadiyat-talis': (u) => ({
      cond: 'par',
      an: seg(u.names, 'VM'),
      ad: seg(u.names, 'VB'),
      bn: seg(u.names, 'VN'),
      bd: seg(u.names, 'VC'),
      cn: seg(u.names, 'MN'),
      cd: seg(u.names, 'BC'),
    }),
    // 📐 AB from its two pieces, then AF and EF from the whole side (given: VM, MB, VC, BC)
    'hisab-tul': (u) => {
      const known = given(u.len, ['VM', 'MB', 'VC', 'BC']);
      return {
        p1: Number(u.len.VM),
        p2: Number(u.len.MB),
        ab: Number(write(add(u.len.VM, u.len.MB))),
        af: write(lengthFrom(known, 'VN')),
        ef: write(lengthFrom(known, 'MN')),
      };
    },
    // 🦋 OD across O from OA, OC, OB; AB from CD (given: VM, VB, VN, BC — the butterfly has no pieces)
    'wadiyat-al-farasha': (u) => {
      const known = given(u.len, ['VM', 'VB', 'VN', 'BC']);
      return { od: write(lengthFrom(known, 'VC', 'butterfly')), ab: write(lengthFrom(known, 'MN', 'butterfly')) };
    },
    // 🔍 from ABC to AMN: k = AM / AB, its direction, MN = BC × k, and the number back 1/k
    'muamil-k': (u) => {
      const k = div(u.AM, u.AB);
      return {
        ...fracBoxes(k, 'kn', 'kd'),
        kind: cmp(k, '1') < 0 ? 'reduction' : 'enlargement',
        mn: write(mul(u.BC, k)),
        ...fracBoxes(inv(k), 'bn', 'bd'),
      };
    },
  },
  // the trainer's forms, each answered from what its prompt GIVES (expected fields: see the header)
  solve: {
    // the ratio asked, from VM and VB (or VM and its piece MB): every ratio of the chain is VM / VB
    nisba: (x) => fracBoxes(div(x.f.VM, x.pieces ? add(x.f.VM, x.f.MB) : x.f.VB)),
    nisab: (x) => ({
      r1n: seg(x.names, 'VM'),
      r1d: seg(x.names, 'VB'),
      r2n: seg(x.names, 'VN'),
      r2d: seg(x.names, 'VC'),
      r3n: seg(x.names, 'MN'),
      r3d: seg(x.names, 'BC'),
    }),
    farashaNisab: (x) => ({
      r1n: seg(x.names, 'VM'),
      r1d: seg(x.names, 'VB'),
      r2n: seg(x.names, 'VN'),
      r2d: seg(x.names, 'VC'),
      r3n: seg(x.names, 'MN'),
      r3d: seg(x.names, 'BC'),
    }),
    tul: (x) => ({ x: write(lengthFrom(given(x.f, [x.sol.P, x.sol.Q, x.sol.D]), x.sol.U)) }),
    tulJuz: (x) => {
      const known = given(x.f, [x.part, x.piece, x.other]);
      return { w: write(lengthFrom(known, x.side)), x: write(lengthFrom(known, x.sol.U)) };
    },
    farasha: (x) => {
      const known = given(x.f, ['VM', 'VB', 'VN', 'BC']);
      return { x: write(lengthFrom(known, 'VC', 'butterfly')), y: write(lengthFrom(known, 'MN', 'butterfly')) };
    },
    muamil: (x) => {
      const k = div(x.f[x.two[0]], x.f[x.one[0]]);
      return {
        ...fracBoxes(k, 'kn', 'kd'),
        kind: cmp(k, '1') < 0 ? 'reduction' : 'enlargement',
        mn: write(mul(x.f[x.one[1]], k)),
        ...fracBoxes(inv(k), 'bn', 'bd'),
      };
    },
  },
  // the board: the length each figure station asks, from the lengths its figure writes (lib/lessonWalk/board.mjs)
  board: {
    // a walkway parallel to (BC): MN from AM over the WHOLE side AB
    park: (st) => {
      const l = labelsOf(st);
      return lengthFrom({ VM: l.AM, VB: l.AB, BC: l.BC }, 'MN');
    },
    // where Q must stand for (PQ) ∥ (BC): AQ / AC = AP / AB
    path: (st) => {
      const l = labelsOf(st);
      return lengthFrom({ VM: l.AP, VB: l.AB, VC: l.AC }, 'VN');
    },
    // E marked from the corner B: AE = AB − BE first
    roof: (st) => {
      const l = labelsOf(st);
      return lengthFrom({ VB: l.AB, MB: l.BE, BC: l.BC }, 'MN');
    },
    // the bar marked from the top: AB = AE + EB
    easel: (st) => {
      const l = labelsOf(st);
      return lengthFrom({ VM: l.AE, MB: l.EB, MN: l.EF }, 'BC');
    },
    // two streets crossing at O, (AB) ∥ (CD): OA / OC = OB / OD
    streets: (st) => {
      const l = labelsOf(st);
      return lengthFrom({ VM: l.OA, VB: l.OC, VN: l.OB }, 'VC', 'butterfly');
    },
    // the painted corner's perimeter: the yard's × k, k = AM / AB
    yard: (st) => {
      const l = labelsOf(st);
      return mul(add(add(l.AB, l.AC), l.BC), div(l.AM, l.AB));
    },
    // from the corner back to the yard: BC = MN ÷ k, k written in the station's text
    corner: (st) => {
      const l = labelsOf(st);
      return div(l.MN, texNum(/\\dfrac\{\d+\}\{\d+\}/.exec(st.text)[0]));
    },
  },
  // a tap of « تدرّب » is a buoy of the same waves: judged by the same arithmetic, from its order and its formula
  gate: Object.fromEntries(
    ['equality', 'cross', 'sum', 'decimal', 'halfCross', 'halfEquality', 'image', 'coefficient', 'back'].map((t) => [
      t,
      (x, n) => buoy(x.say, x.tex, String(n)),
    ]),
  ),
  // « علّل »: the reason that proves (lib/lessonWalk/trainer.mjs)
  reasonTrue,
  // a buoy of the felucca's legs and of the practice levels (lib/lessonWalk/gateRun.mjs)
  run: buoy,
  // the final mission, from its card's lead: AB = AH + HB (HB half the base), MN ∥ BC both vertical, AM / AB = MN / h
  mission: (lead) => {
    const stick = numAfter(lead, /طولها/);
    const am = numAfter(lead, /AM =/);
    const ah = numAfter(lead, /AH =/);
    const hb = write(div(numAfter(lead, /وضلع القاعدة/), '2'));
    const ab = add(ah, hb);
    return {
      ah: Number(ah),
      hb: Number(hb),
      ab: Number(write(ab)),
      why: 'vertical',
      rn: Number(am),
      rd: Number(write(ab)),
      mn: Number(stick),
      h: write(div(mul(ab, stick), am)),
      k: write(div(ab, am)),
    };
  },
  // the box at noon: OB = from the hole to the base edge + half the base (the mission's), BC = image × OB / depth
  box: (lead, missionLead) => {
    const o1 = numAfter(lead, /على بعد/);
    const o2 = write(div(numAfter(missionLead, /وضلع القاعدة/), '2'));
    const depth = numAfter(lead, /الخلفيّ،/);
    const image = numAfter(lead, /مقلوبة طولها/);
    const ob = add(o1, o2);
    return { o1: Number(o1), o2: Number(o2), ob: Number(write(ob)), bc: write(div(mul(image, ob), depth)) };
  },
  launch: {
    scenario: 'one',
    tool: {
      item: '3am.m2.r03',
      name: 'النسب في المثلث',
      year: 'من السنة الثالثة متوسط',
      home: 'تناسبية الأطوال في المثلث',
      // a 3AM lesson not built on the platform: the result card says « الدرس قريبًا »
      homeSoon: true,
      memo: 4,
      // level 1 asks « a/b = c/▢ » first, then a length of the triangle: both written on the keypad
      second: 'write',
      // the very first question: a fourth proportional of a triangle with sides of 8 at most
      firstOk: (x) => x.calc?.op === 'fourth' && x.calc.b <= 8 && Number.isInteger((x.calc.b * x.calc.c) / x.calc.a),
    },
  },
};
