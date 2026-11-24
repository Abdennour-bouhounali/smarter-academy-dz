// The walks of lesson `talis-hisab-atwal` « خاصية طالس وحساب الأطوال », the first lesson of the world « الأهرامات »
// (`nile-pyramids`) — a DESCRIPTOR for lib/lessonWalk (README there): only what the lesson's files cannot say — the walk's
// own arithmetic of every verdict (exact fractions, lib/lessonWalk/worlds/exact.mjs — never the lesson's `math.js`,
// `forges.js` or `trainer.js › solution`), the words no screen may show before their tablet, and the launch kit's tool.
//
// NOT RUNNABLE YET (2026-11-24): the world's walk handlers do not exist. `worlds/index.mjs › WORLDS` knows only
// `root-courts`; this lesson needs, written by the walk agent (PYRAMIDS_WORLD_PLAN.md §2.5):
//   - `worlds/nilePyramids.mjs` (`NILE_PYRAMIDS = { id, story, practice, names }`, registered in WORLDS): « ابدأ »; E at a
//     stake; ← → held until `data-np-rope` shows the knot, released THERE; the order's box (`data-np-order`); the stick's
//     slide; the felucca's lanes; the mission's boxes; the dev handle `window.__world` (Zero placed at a stake or a dock,
//     the clock fast-forwarded, the state READ for the question only); the hooks `data-np-stake`, `data-np-register`,
//     `data-np-predict`, `data-np-fact`, `data-np-sight`, `data-np-stage`, `data-np-dock`;
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
  launch: {
    scenario: 'one',
    tool: {
      item: '3am.m2.r03',
      name: 'النسب في المثلث',
      year: 'من السنة الثالثة متوسط',
      home: 'تناسبية الأطوال في المثلث',
      memo: 4,
      // level 1 asks « a/b = c/▢ » first, then a length of the triangle: both written on the keypad
      second: 'write',
      // the very first question: a fourth proportional of a triangle with sides of 8 at most
      firstOk: (x) => x.calc?.op === 'fourth' && x.calc.b <= 8 && Number.isInteger((x.calc.b * x.calc.c) / x.calc.a),
    },
  },
};
