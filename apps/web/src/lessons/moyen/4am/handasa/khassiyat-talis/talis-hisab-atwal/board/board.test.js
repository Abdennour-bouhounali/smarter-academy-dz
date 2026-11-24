import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { SCRIPT, BOARD, KEYS } from './script';
import { MEMO } from './memo';
import { MOMENTS } from '../../../../../../../features/classSession/boardLessons';
import { partKeys } from '../../../../../../../features/classSession/lessonMemos';
import { askWords, fills } from '../../../../../../../features/classSession/lessonScripts';
import { compare, equal, minus, over, plus, read, times, write } from '../../../../../../common/gameworld/kit/exact';
import { collisions, readBank, storiesOf } from '../../../../../../common/gameworld/kit/authoring/test/bank';

/** « حصّة القسم » of `talis-hisab-atwal`: every length the board and the memo say is computed here, never trusted. */
const KINDS = ['ask', 'name', 'trace'];
const asks = SCRIPT.steps.filter((s) => s.kind === 'ask');
const names = SCRIPT.steps.filter((s) => s.kind === 'name');
const step = (id) => SCRIPT.steps.find((s) => s.id === id);
const said = (s) => [s.title, s.text, s.question, s.after, s.cue].filter(Boolean).join(' ');
/** Every « $…$ » of a text, without its dollars. */
const formulas = (text) => [...String(text).matchAll(/\$([^$]+)\$/g)].map((m) => m[1]);
/** The lesson's world, once written by its agent: its tablets and its keys (one wording for the world and the board). */
const TABLETS_LOADER = Object.values(import.meta.glob('../world/tablets.js'))[0] ?? null;
const JOURNEY_LOADER = Object.values(import.meta.glob('../world/journey.js'))[0] ?? null;
const n = (x) => Number(write(x));

// ── an EXACT evaluator of the board's formulas: numbers « 7{,}5 », \dfrac{…}{…}, \times, +, −, ( ); sides with a letter
// (a segment « AM ») are skipped; relations =, \neq, <, > between the numeric sides ──
/** Reads one side; null when it holds a letter (a segment's name, k) or anything the board does not write. */
function side(src) {
  const s = src
    .replace(/\{,\}/g, ',')
    .replace(/\\times/g, '*')
    .replace(/\\dfrac/g, '§');
  if (/[A-Za-z\\]/.test(s)) return null;
  const t = s.match(/\d+(?:,\d+)?|§|[{}()*+-]|\S/g) ?? [];
  if (t.some((x) => !/^(\d+(?:,\d+)?|§|[{}()*+-])$/.test(x))) return null;
  let i = 0;
  const need = (x) => {
    expect(t[i], src).toBe(x);
    i += 1;
  };
  const braced = () => {
    need('{');
    const v = sum(); // eslint-disable-line no-use-before-define
    need('}');
    return v;
  };
  const atom = () => {
    const x = t[i];
    if (x === '(') {
      i += 1;
      const v = sum(); // eslint-disable-line no-use-before-define
      need(')');
      return v;
    }
    if (x === '§') {
      i += 1;
      const [a, b] = [braced(), braced()];
      return over(a, b);
    }
    i += 1;
    return read(x);
  };
  const product = () => {
    let v = atom();
    while (t[i] === '*') {
      i += 1;
      v = times(v, atom());
    }
    return v;
  };
  function sum() {
    let v = product();
    while (t[i] === '+' || t[i] === '-') {
      const op = t[i];
      i += 1;
      const u = product();
      v = op === '+' ? plus(v, u) : minus(v, u);
    }
    return v;
  }
  const v = sum();
  expect(i, `${src}: read whole`).toBe(t.length);
  return v;
}
/** Is every relation between the numeric sides of a formula true? null when fewer than two sides are numbers. */
function holds(f) {
  const parts = f.split(/\s*(=|\\neq|<|>)\s*/);
  const sides = parts.filter((_, k) => k % 2 === 0).map(side);
  const rels = parts.filter((_, k) => k % 2 === 1);
  let last = null;
  let between = [];
  let checked = 0;
  for (let k = 0; k < sides.length; k += 1) {
    if (k > 0) between.push(rels[k - 1]);
    if (sides[k] == null) continue;
    if (last != null) {
      const [a, b] = [sides[last], sides[k]];
      const c = compare(a, b);
      const ok = between.every((r) => r === '=')
        ? c === 0
        : between.length === 1 && between[0] === '\\neq'
          ? c !== 0
          : between.length === 1 && between[0] === '<'
            ? c < 0
            : between.length === 1 && between[0] === '>'
              ? c > 0
              : null;
      if (ok === null) return null;
      if (!ok) return false;
      checked += 1;
    }
    last = k;
    between = [];
  }
  return checked ? true : null;
}
/** Every relation written in these texts is true; how many formulas were checked. */
function allTrue(texts) {
  let count = 0;
  for (const t of texts)
    for (const f of formulas(t)) {
      const h = holds(f);
      if (h === null) continue;
      expect(h, `« ${f} » in « ${t} »`).toBe(true);
      count += 1;
    }
  return count;
}
/** The words a length never speaks (a plank's, a bridge's, a verdict of error). */
const FOREIGN = /(?<![ء-ي])(?:ال|بال|و|ب|ف)?(?:لوح|ألواح|يثبت|ثبت|ينهار|انهار|جسر|جسور|خطأ|خاطئ|غلط)(?![ء-ي])/;
/** The names of each key as a cue or a text could say them before its naming. */
const KEY_WORDS = [/طالس/, /الرابع المتناسب|متصالب/, /فراشة|الفراشة/, /معامل|تكبير|تصغير|يكبّر|يصغّر|تكبّر|تصغّر/];
/** The world's numbers, group by group (PYRAMIDS_WORLD_PLAN.md §3.8): no pair of one group stands in one station. */
const WORLD_GROUPS = [
  [63, 72, 81, 14, 16, 18, 49, 56],
  [63, 72, 81, 39, 28, 41, 24, 44],
  [38, 32, 19, 16],
  [66, 77, 88, 48, 56, 64, 18, 21],
  [90, 99, 10, 80, 88, 20, 70, 77, 55, 50, 40, 11, 89, 36, 279, 3564],
  [54, 72, 81, 42, 56, 63, 12, 16],
  [55, 66, 77, 45, 54, 63, 10, 12],
  [72, 9, 52, 416, 133],
  [35, 49, 63, 50, 70, 90],
  [60, 64, 92],
  [24, 32, 40, 54, 72, 90],
  [18, 21, 33, 48, 56, 88],
  [20, 40, 55, 24, 48, 66, 115, 138],
  [68, 92, 42.5, 57.5],
  [2, 3, 104, 115, 219, 230, 146, 73],
  [177, 292, 584],
];
const worldPair = (g) =>
  WORLD_GROUPS.find((w) => g.filter((x, i) => g.indexOf(x) === i && w.includes(Number(x))).length >= 2) ?? null;

/** Each station's figure, re-computed from BOARD alone — the right length and the error each distractor makes. */
const { park: P, path: W, roof: R, easel: E, streets: S, yard: Y, corner: C } = BOARD;
const FIG = (() => {
  const kP = over(P.AM, P.AB);
  const MB = minus(P.AB, P.AM);
  const kW = over(W.AP, P.AB);
  const PB = minus(P.AB, W.AP);
  const AE = minus(R.AB, R.BE);
  const AB = plus(E.AE, E.EB);
  const kY = over(Y.AM, Y.AB);
  const per = plus(plus(Y.AB, Y.AC), Y.BC);
  return {
    park: {
      right: times(P.BC, kP),
      wrong: { piece: over(times(P.BC, P.AM), MB), difference: minus(P.BC, MB) },
      data: [P.AB, P.AC, P.BC, P.AM, write(times(P.AC, kP))],
    },
    path: {
      right: times(P.AC, kW),
      wrong: { sameDistance: W.AP, samePiece: minus(P.AC, PB) },
      data: [P.AB, P.AC, W.AP],
    },
    roof: {
      right: over(times(R.BC, AE), R.AB),
      wrong: { piece: over(times(R.BC, R.BE), R.AB), difference: minus(R.BC, R.BE) },
      data: [R.AB, R.BE, R.BC],
    },
    easel: {
      right: over(times(E.EF, AB), E.AE),
      wrong: { piece: over(times(E.EF, E.EB), E.AE), sum: plus(E.EF, E.EB) },
      data: [E.AE, E.EB, E.EF],
    },
    streets: {
      right: over(times(S.OB, S.OC), S.OA),
      wrong: {
        crossed: over(times(S.OB, S.OA), S.OC),
        difference: plus(S.OB, minus(S.OC, S.OA)),
        sum: plus(S.OA, S.OC),
      },
      data: [S.OA, S.OC, S.OB],
    },
    yard: {
      right: times(per, kY),
      wrong: {
        oneSide: plus(plus(Y.AM, Y.AC), Y.BC),
        // the line round the rest of the yard, MBCN: MB + BC + CN + NM
        rest: plus(plus(minus(Y.AB, Y.AM), Y.BC), plus(minus(Y.AC, times(Y.AC, kY)), times(Y.BC, kY))),
      },
      data: [Y.AB, Y.AC, Y.BC, Y.AM],
    },
    corner: {
      right: over(C.MN, C.k),
      wrong: { notTurned: times(C.MN, C.k), numeratorOnly: times(C.MN, String(read(C.k).n)) },
      data: [C.MN],
    },
  };
})();

describe('خاصية طالس وحساب الأطوال — the evaluator of the board’s formulas', () => {
  it('says the truth on hand-worked cases', () => {
    expect(holds('\\dfrac{AM}{AB} = \\dfrac{84}{98} = \\dfrac{6}{7}')).toBe(true);
    expect(holds('\\dfrac{AM}{AB} = \\dfrac{84}{98} = \\dfrac{5}{7}')).toBe(false);
    expect(holds('MN = \\dfrac{49 \\times 84}{98} = 42')).toBe(true);
    expect(holds('\\dfrac{42}{133} \\neq \\dfrac{3}{7}')).toBe(true);
    expect(holds('\\dfrac{57}{133} \\neq \\dfrac{3}{7}')).toBe(false);
    expect(holds('\\dfrac{EF}{BC} = \\dfrac{AE}{AB}')).toBe(null);
    expect(holds('AE = 65 - 20 = 45')).toBe(true);
    expect(holds('\\dfrac{13}{6} > 1')).toBe(true);
    expect(holds('k = \\dfrac{5}{13} < 1')).toBe(true);
    expect(holds('\\dfrac{AM}{AB} = \\dfrac{AN}{AC}')).toBe(null); // letters only: not judged here
  });
});

describe('خاصية طالس وحساب الأطوال — the script of the lesson on the board', () => {
  it('uses only the kinds of step it needs, with unique ids, a chapter and a short oral question for each', () => {
    expect(SCRIPT.steps.every((s) => KINDS.includes(s.kind))).toBe(true);
    expect(new Set(SCRIPT.steps.map((s) => s.id)).size).toBe(SCRIPT.steps.length);
    expect(SCRIPT.steps.every((s) => s.chapter && s.cue)).toBe(true);
    expect(SCRIPT.steps[0].kind).toBe('ask');
    expect(SCRIPT.steps.at(-1).kind).toBe('trace');
    for (const s of SCRIPT.steps) {
      expect(s.cue.length, `${s.id}: « ${s.cue} » (${s.cue.length})`).toBeLessThanOrEqual(70);
      for (const k of ['cue', 'question', 'title']) {
        expect(s[k] ?? '', `${s.id}.${k}`).not.toContain('$');
        // a Latin name inside a plain Arabic sentence is scrambled by the bidi algorithm (defects.md B7): never there
        expect(s[k] ?? '', `${s.id}.${k}`).not.toMatch(/[A-Za-z]/);
      }
      for (const k of ['cue', 'question', 'title', 'text', 'after'])
        expect((s[k] ?? '').replace(/\$[^$]+\$/g, ''), `${s.id}.${k}`).not.toMatch(/\d\s*\/\s*\d|[A-Za-z]/);
    }
  });

  it('never names a key before the class has acted: every name follows an ask, and nothing before says its name', () => {
    SCRIPT.steps.forEach((s, i) => {
      if (s.kind === 'name') expect(SCRIPT.steps[i - 1].kind, s.id).toBe('ask');
    });
    names.forEach((nm, k) => {
      const before = SCRIPT.steps.slice(0, SCRIPT.steps.indexOf(nm)).map(said).join(' ');
      for (let j = k; j < KEY_WORDS.length; j += 1) expect(before, `${nm.id}: key ${j + 1}`).not.toMatch(KEY_WORDS[j]);
    });
  });

  it('every ask’s answer is the right length, computed from the figure — the card the board draws as filling', () => {
    expect(asks.map((s) => s.id)).toEqual(['park', 'path', 'roof', 'easel', 'streets', 'yard', 'corner']);
    for (const s of asks) {
      const f = FIG[s.id];
      expect(s.a, s.id).toBe(n(f.right));
      expect(s.answer, s.id).toEqual([n(f.right)]);
      // the board draws as « filling » the cards that divide `a`: exactly the right one (lessonScripts.js › fills)
      expect(
        s.options.filter((o) => fills(s, o)),
        s.id,
      ).toEqual(s.answer);
      // the other cards are the errors the lesson fights, each computed, each whole, each wrong
      const wrong = Object.values(f.wrong).map(n);
      expect(
        [...s.options].sort((x, y) => x - y),
        s.id,
      ).toEqual([n(f.right), ...wrong].sort((x, y) => x - y));
      for (const v of [f.right, ...Object.values(f.wrong)]) expect(read(v).d, `${s.id}: a whole length`).toBe(1n);
      expect(new Set(s.options).size, s.id).toBe(s.options.length);
      expect(s.options.length, s.id).toBeGreaterThanOrEqual(3);
      expect(s.options.length, s.id).toBeLessThanOrEqual(6);
      expect(s.options.indexOf(s.a), s.id).toBeGreaterThanOrEqual(0);
      expect(s.after, s.id).toContain('$');
    }
    // the right card is not always in the same place
    expect(new Set(asks.map((s) => s.options.indexOf(s.a))).size).toBeGreaterThanOrEqual(2);
  });

  it('draws possible figures: points on their sides, real triangles, the piece trap far from the truth', () => {
    const triangle = (a, b, c) => [a, b, c].map(Number).every((x, i, t) => x < t[(i + 1) % 3] + t[(i + 2) % 3]);
    expect(triangle(P.AB, P.AC, P.BC)).toBe(true);
    expect(triangle(R.AB, R.AB, R.BC)).toBe(true);
    expect(triangle(Y.AB, Y.AC, Y.BC)).toBe(true);
    expect(compare(P.AM, P.AB)).toBe(-1);
    expect(compare(W.AP, P.AB)).toBe(-1);
    expect(compare(FIG.path.right, P.AC)).toBe(-1);
    expect(compare(R.BE, R.AB)).toBe(-1);
    expect(compare(Y.AM, Y.AB)).toBe(-1);
    // the easel's feet: two legs of AE + EB, the floor narrower than the two legs
    expect(compare(FIG.easel.right, times('2', plus(E.AE, E.EB)))).toBe(-1);
    // 🔑 the piece makes the walkway longer than the side it is parallel to — the class can see it is impossible
    expect(compare(FIG.park.wrong.piece, P.BC)).toBe(1);
    // 🔑 « as far as P » and « as far from C as P from B » are not parallel: their ratio is not AP ÷ AB
    for (const v of Object.values(FIG.path.wrong)) expect(equal(over(v, P.AC), over(W.AP, P.AB))).toBe(false);
    // 🦋 the crossed partner and the sum are no length of the figure; 🔍 the yard is bigger than its corner
    expect(compare(over(Y.AM, Y.AB), '1')).toBe(-1);
    expect(compare(C.k, '1')).toBe(-1);
  });

  it('writes only true relations in what the class reads, every formula in LaTeX', () => {
    const count = allTrue(SCRIPT.steps.flatMap((s) => [s.text, s.after].filter(Boolean)));
    expect(count).toBeGreaterThanOrEqual(14);
    for (const s of SCRIPT.steps)
      for (const f of formulas([s.text, s.after].join(' '))) expect(f, s.id).not.toMatch(/[×*÷]/);
  });

  it('speaks of lengths — never a plank’s word, never « wrong »', () => {
    expect('لوح 5').toMatch(FOREIGN);
    expect(JSON.stringify(SCRIPT)).not.toMatch(FOREIGN);
    expect(JSON.stringify(MEMO)).not.toMatch(FOREIGN);
    for (const s of asks) expect(askWords(s), s.id).toEqual({ card: 'الطول', held: 'يوافق', fell: 'لا يوافق' });
  });

  it('holds ONE of its numbers a line of code, and uses its OWN numbers: none of the bank, of a story, of the world', () => {
    const headline = Object.values(BOARD)
      .flatMap((g) => Object.values(g))
      .filter((x) => String(x).length >= 2);
    for (const file of ['./script.js', './memo.js']) {
      const lines = readFileSync(new URL(file, import.meta.url), 'utf8').split('\n');
      for (const l of lines) {
        const found = headline.filter((x) => new RegExp(`(?<![0-9,/])${x}(?![0-9,/])`).test(l));
        expect(new Set(found).size, `${file}: « ${l.trim()} »`).toBeLessThanOrEqual(1);
      }
    }
    const bank = readBank('talis-hisab-atwal');
    const stories = storiesOf({ exceptId: 'talis-hisab-atwal' });
    for (const [id, f] of Object.entries(FIG)) {
      const group = [...new Set([...f.data, write(f.right)].map(String))];
      // every pair of a station's data and answer, and every number of 100 and more
      for (let i = 0; i < group.length; i += 1) {
        for (let j = i + 1; j < group.length; j += 1) {
          const c = collisions(
            bank,
            [group[i], group[j]].map((x) => Number(x.replace(',', '.'))),
            { stories },
          );
          expect(c.clear, `${id}: ${group[i]} ; ${group[j]}`).toBe(true);
        }
        const one = collisions(bank, [Number(group[i].replace(',', '.'))], { stories });
        expect(one.clear, `${id}: ${group[i]}`).toBe(true);
      }
      expect(worldPair(group), `${id}: a pair of the world`).toBe(null);
    }
    // the coefficients of the board are none the world sails with
    for (const k of [
      over(P.AM, P.AB),
      over(minus(R.AB, R.BE), R.AB),
      over(E.AE, plus(E.AE, E.EB)),
      over(Y.AM, Y.AB),
      read(C.k),
      over(S.OA, S.OC),
    ])
      for (const w of [
        '2/9',
        '8/11',
        '8/9',
        '7/9',
        '5/9',
        '9/11',
        '1/8',
        '7/10',
        '4/9',
        '3/8',
        '1/36',
        '6/5',
        '5/6',
        '5/8',
      ])
        expect(equal(k, w), `${write(k)} is a k of the world`).toBe(false);
  });

  it('names each key with the tablet of the STUDENT’S world: the four keys in order, then the copybook', () => {
    expect(names.map((s) => s.tablet)).toEqual(KEYS);
    expect(KEYS).toEqual(['wadiyat-talis', 'hisab-tul', 'wadiyat-al-farasha', 'muamil-k']);
    const traced = SCRIPT.steps.filter((s) => s.kind === 'trace').flatMap((s) => s.tablets);
    expect(traced).toEqual(KEYS);
    for (const s of names) expect(s.recall.length, s.id).toBeGreaterThanOrEqual(2);
  });

  // The world is written by another agent (world/tablets.js, world/journey.js): until it exists, this check is skipped
  // and the report names the recall words the tablets must hold.
  it.runIf(Boolean(TABLETS_LOADER))(
    'each recall word stands in its tablet’s words (never inside a formula)',
    async () => {
      const { TABLETS } = await TABLETS_LOADER();
      if (JOURNEY_LOADER) expect((await JOURNEY_LOADER()).KEYS).toEqual(KEYS);
      for (const s of names) {
        const t = TABLETS[s.tablet];
        expect(t, s.tablet).toBeTruthy();
        const text = [...t.lines, ...(t.list ?? [])].join(' ').replace(/\$[^$]+\$/g, ' ');
        for (const w of s.recall) expect(text, `${s.tablet}: « ${w} »`).toContain(w);
        expect(t.math.length, s.tablet).toBeLessThanOrEqual(2);
      }
    },
  );
});

describe('خاصية طالس وحساب الأطوال — the written memo', () => {
  it('has every part of a good lesson plan and runs the four moments in a 45-minute hour', () => {
    expect(partKeys()).toHaveLength(9);
    for (const k of [
      'glance',
      'criteria',
      'openings',
      'phases',
      'anticipated',
      'sequence',
      'written',
      'exit',
      'support',
      'extend',
      'next',
      'connect',
      'stands',
    ])
      expect(MEMO[k], k).toBeTruthy();
    expect(MEMO.title).toBe(SCRIPT.title);
    expect(MEMO.phases.map((p) => p.moment)).toEqual([...MOMENTS]);
    expect(MEMO.glance.minutes.map((m) => m.moment)).toEqual([...MOMENTS]);
    expect(MEMO.glance.minutes.reduce((s, m) => s + m.min, 0)).toBe(45);
    expect(MEMO.phases.map((p) => p.min)).toEqual(MEMO.glance.minutes.map((m) => m.min));
    expect(JSON.stringify(MEMO)).not.toContain('وضع القسم');
    expect(JSON.stringify(MEMO)).not.toContain('نقطة التعلّم');
    // the three الكفاءات of the lesson and the butterfly, each with what can be seen
    expect(MEMO.criteria).toHaveLength(4);
  });

  it('writes no formula where the memo page draws plain text', () => {
    const plain = [
      MEMO.glance.goal,
      MEMO.glance.idea,
      MEMO.glance.trap,
      MEMO.stands,
      MEMO.next,
      ...MEMO.sequence,
      ...MEMO.criteria.map((c) => c.can),
      ...MEMO.openings.flatMap((o) => [o.title, o.story, o.ask, o.why, o.expect]),
      ...MEMO.phases.flatMap((p) => [p.name, p.aim, p.teacher, p.class, p.watch]),
    ];
    for (const t of plain) expect(t, t).not.toContain('$');
    for (const t of plain) expect(t, t).not.toMatch(/\d\s*\/\s*\d|[A-Za-z]/);
  });

  it('proposes three openings, the board’s one first, every number of it the board’s', () => {
    expect(MEMO.openings.map((o) => o.id)).toEqual(['park', 'tent', 'cross']);
    expect(MEMO.openings.filter((o) => o.board).map((o) => o.id)).toEqual([step('park').id]);
    const [park, tent, cross] = MEMO.openings;
    for (const x of [P.AB, P.AC, P.BC, P.AM]) expect(park.story).toContain(x);
    expect(park.expect).toContain(write(FIG.park.right));
    expect(park.expect).toContain(write(FIG.park.wrong.piece));
    // the tent: a stick of 6 at 15 from the peg, the pole at 65 → 26 dm; the streets: 10, 26 and 15 → 39 m
    expect(write(over(times('6', '65'), '15'))).toBe('26');
    expect(tent.story).toMatch(/65.*15.*6/);
    expect(write(over(times('15', '26'), '10'))).toBe('39');
    expect(cross.story).toMatch(/10.*15.*26/);
  });

  it('anticipates answers (right and wrong) with a question to check and one to push forward — the wrong ones ARE wrong', () => {
    expect(MEMO.anticipated.filter((a) => a.kind === 'miss').length).toBeGreaterThanOrEqual(3);
    expect(MEMO.anticipated.some((a) => a.kind === 'right')).toBe(true);
    for (const a of MEMO.anticipated) {
      expect(a.assess, a.says).toBeTruthy();
      expect(a.advance, a.says).toBeTruthy();
      expect(a.assess).not.toBe(a.advance);
    }
    expect(allTrue(MEMO.anticipated.filter((a) => a.kind === 'right').map((a) => a.says))).toBeGreaterThanOrEqual(2);
    // the misses: the piece (its formula is true arithmetic, its length is not MN), the beam less the piece, k not turned
    expect(equal(FIG.park.wrong.piece, FIG.park.right)).toBe(false);
    expect(equal(FIG.roof.wrong.difference, FIG.roof.right)).toBe(false);
    expect(equal(over('1', over(Y.AM, Y.AB)), over(Y.AM, Y.AB))).toBe(false);
  });

  it('writes only true relations: the glance, the criteria, the written trace, the exit ticket, the support', () => {
    const texts = [
      ...MEMO.glance.three,
      ...MEMO.criteria.map((c) => c.see),
      MEMO.connect,
      ...MEMO.written,
      ...MEMO.exit.flatMap((e) => [e.q, e.a]),
      ...MEMO.support,
      ...MEMO.extend,
    ];
    expect(allTrue(texts)).toBeGreaterThanOrEqual(14);
    expect(MEMO.exit).toHaveLength(3);
    // exit 1: AB = 9 + 15, MN = 32 × 9 ÷ 24; exit 2: GH = 12 × 26 ÷ 8; exit 3: 13/6 > 1, turned 6/13
    expect(write(over(times('32', '9'), plus('9', '15')))).toBe('12');
    expect(write(over(times('12', '26'), '8'))).toBe('39');
    expect(MEMO.exit[2].a).toContain('تكبير');
    // the extension: the walkway half of BC starts at half of AB; no walkway parallel to (BC) inside the park is longer
    // than BC; one coefficient only makes the sides whole with one of them 15
    expect(write(times(P.AB, '0,5'))).toBe('49');
    const { sides, one } = MEMO.extendCheck;
    const ks = sides.map((s) => over(one, s)).filter((k) => sides.every((s) => read(times(s, k)).d === 1n));
    expect(ks.map(write)).toEqual(['1,5']);
  });
});
