import { describe, it, expect } from 'vitest';
import { complete, runOn, testsOf, ruleKey } from '../../../../../../common/gameworld/kit/forge';
import { joinOf, stackOf, peelOf, fitsRow } from '../../../../../../common/gameworld/divisorIsles/inquiry';
import { FORGES } from './forges';
import { KEYS } from './journey';
import { JOIN_INQUIRY, STACK_INQUIRY, PEEL_INQUIRY, LETTERS_INQUIRY } from './inquiries';

/** Every rule that can be written with the tiles of a forge (the product of its slots' options). */
const allRules = (forge) =>
  forge.slots.reduce((rules, s) => rules.flatMap((rule) => s.options.map((o) => ({ ...rule, [s.id]: o.id }))), [{}]);
const rng = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};
const clean = (text) => expect(String(text)).not.toMatch(/undefined|NaN|\[object/);

/** What each investigation hands back when the student plays it through (the facts are the world's, computed). */
const RESULTS = {
  'jam-wal-farq': {
    rounds: JOIN_INQUIRY.rounds.map((r) => {
      const d = r.d ?? JOIN_INQUIRY.d;
      const { holds } = joinOf(d, r.a, r.b, r.op);
      return { op: r.op, a: r.a, b: r.b, d, guess: true, holds };
    }),
  },
  madaaf: {
    rounds: [STACK_INQUIRY, STACK_INQUIRY.free].flatMap((r) =>
      r.times.map((k) => ({ d: r.d, base: r.base, k, guess: true, holds: stackOf(r.d, r.base, k).holds })),
    ),
  },
  'baqi-qisma': {
    rounds: PEEL_INQUIRY.rounds.map(({ a, b, candidates }) => ({
      a,
      b,
      ...peelOf(a, b),
      rows: candidates.map((d) => {
        const f = fitsRow(a, b, d);
        return { d, fitsA: f.a, fitsB: f.b, fitsR: f.r, guess: true };
      }),
    })),
    claim: { cols: ['a', 'b'], link: 'and' },
  },
  burhan: { order: LETTERS_INQUIRY.order, tries: 0, refuted: [] },
};
/** What a student who holds the rule writes at the last step of each forge. */
const SOLVE = {
  'jam-wal-farq': (c) => ({ x: (c.A + c.B) / c.d, y: (c.A - c.B) / c.d }),
  madaaf: (c) => ({ x: (c.k * c.base) / c.d }),
  'baqi-qisma': (c) => ({ q: Math.floor(c.A / c.B), r: c.A % c.B, k: (c.A % c.B) / c.d }),
  burhan: (c) => ({ x: 3 * c.k + 2 * c.k2, y: c.k + c.k2 }),
};
/** How many rules the tiles of each forge allow. */
const RULES = { 'jam-wal-farq': 16, madaaf: 16, 'baqi-qisma': 12, burhan: 4 };

describe('the four forges of « خواص قواسم عدد طبيعي » — no rule is told', () => {
  it('there is one forge per key of the lesson, each opening on an investigation', () => {
    expect(Object.keys(FORGES)).toEqual(KEYS);
    for (const key of KEYS) {
      expect(FORGES[key].key).toBe(key);
      expect(FORGES[key].inquiry?.kind, key).toBeTruthy();
      expect(typeof FORGES[key].fromInquiry).toBe('function');
    }
  });

  for (const key of KEYS) {
    const F = FORGES[key];
    const out = F.fromInquiry(RESULTS[key]);
    const rows = F.evidence(out.rows);
    const rules = allRules(F);
    const THE = rules.filter(F.isTheRule);

    describe(key, () => {
      it('many rules can be written with the tiles and exactly ONE holds', () => {
        expect(rules).toHaveLength(RULES[key]);
        expect(THE).toHaveLength(1);
        for (const rule of rules) expect(complete(F, rule), ruleKey(F, rule)).toBe(true);
        expect(complete(F, { ...THE[0], [F.slots[0].id]: null })).toBe(false);
        expect(rows.length).toBeGreaterThanOrEqual(2);
        expect(rows).toHaveLength(out.rows.length); // nothing he did is lost
      });

      it('an investigation that writes the rule hands the mirror the right one; the others leave the tiles to him', () => {
        if (F.inquiry.writes) expect(F.isTheRule(out.rule)).toBe(true);
        else expect(out.rule).toBeUndefined();
      });

      it('EVERY false rule is refuted in front of him — by what he did, or by a new case the world computes', () => {
        for (const rule of rules.filter((r) => !F.isTheRule(r))) {
          const run = runOn(F, rule, testsOf(F, rule, rows));
          if (run.bad >= 0) {
            const m = run.marks[run.bad];
            expect(m.says, ruleKey(F, rule)).not.toBe(m.held);
            clean(F.text.refuted(m));
            continue;
          }
          const [c] = F.attacks(rule, rows);
          expect(c, ruleKey(F, rule)).toBeTruthy();
          expect(F.says(rule, c), ruleKey(F, rule)).not.toBe(c.held);
          expect(rows.some((row) => F.caseId(row) === F.caseId(c))).toBe(false); // a NEW case
          clean(F.text.attack(c));
        }
      });

      it('the right rule agrees with all his evidence and survives two hard attacks', () => {
        const run = runOn(F, THE[0], testsOf(F, THE[0], rows));
        expect(run.bad).toBe(-1);
        expect(run.marks.length).toBeGreaterThanOrEqual(2);
        const hard = F.attacks(THE[0], rows);
        expect(hard).toHaveLength(2);
        for (const c of hard) {
          expect(F.says(THE[0], c)).toBe(c.held);
          expect(rows.some((row) => F.caseId(row) === F.caseId(c))).toBe(false);
        }
      });

      it('predictions on cases he has not seen, which hold and fail in turn, all drawable', () => {
        for (let seed = 1; seed <= 25; seed += 1) {
          const list = F.predictCases(rows, rng(seed * 7919));
          expect(list.length).toBeGreaterThanOrEqual(4);
          expect(list.map((c) => c.held).slice(0, 4)).toEqual([true, false, true, false]);
          expect(new Set(list.map(F.caseId)).size).toBe(list.length);
          for (const c of list) {
            expect(Number.isInteger(c.a) && Number.isInteger(c.b) && c.a >= 1 && c.b >= 1, F.caseId(c)).toBe(true);
            expect(rows.some((row) => F.caseId(row) === F.caseId(c))).toBe(false);
            expect(Math.max(c.a, c.b)).toBeLessThanOrEqual(126); // the mirror can draw it
            clean(F.text.ask(c));
            clean(F.text.fact(c));
            clean(F.text.eq(c));
          }
        }
      });

      it('says every rule and applies it to a case in words, and words every moment of the forge', () => {
        for (const rule of rules) {
          clean(F.ruleText(rule));
          for (const c of [...rows, ...F.attacks(rule, rows)]) clean(F.explain(rule, c));
        }
        const T = F.text;
        for (const k of ['title', 'sub', 'log', 'yes', 'no', 'next', 'frame', 'buildLead', 'testing', 'agreed', 'fire'])
          expect(typeof T[k], `${key} text.${k}`).toBe('string');
        for (const k of ['survived', 'wordsHint', 'experiment', 'useOk'])
          expect(typeof T[k], `${key} text.${k}`).toBe('string');
        for (const c of [...rows, ...F.attacks(THE[0], rows)]) {
          clean(T.attack(c));
          clean(T.refuted({ ...c, says: !c.held }));
          clean(T.fact(c));
        }
        for (const yes of [true, false]) {
          clean(T.says(yes));
          clean(T.broken(yes));
        }
        // what the screen writes as PLAIN text (not through MathText) never carries a formula: no raw LaTeX on screen
        const plain = [T.agreed, T.survived, T.useOk, ...Object.values(T.use), T.says(true), T.broken(false)];
        for (const c of rows) plain.push(T.refuted({ ...c, says: !c.held }));
        for (const x of plain) expect(x, x).not.toMatch(/\$|\\/);
      });

      it('the robot helps without ever giving the rule: three more pairs of cases, never a choice of rules', () => {
        for (const n of [1, 2, 3]) {
          const h = F.nudge(n, rows);
          expect(h.kind).toBe('experiment');
          expect(h.cases).toHaveLength(2);
          for (const c of h.cases) {
            expect(Math.max(c.a, c.b)).toBeLessThanOrEqual(126);
            clean(F.text.fact(c));
          }
          // each pair shows two different outcomes or two sides of one fact: never twice the same case
          expect(F.caseId(h.cases[0])).not.toBe(F.caseId(h.cases[1]));
        }
      });

      it('ends on a case the mirror does not build: the rule decides, typed in its own shape', () => {
        for (let seed = 1; seed <= 25; seed += 1) {
          const c = F.use.make(rng(seed * 104729));
          const vals = SOLVE[key](c);
          for (const v of Object.values(vals)) expect(Number.isInteger(v) && v >= 0).toBe(true);
          const slots = F.use.lines(c).flatMap((l) => l.tokens.filter((t) => typeof t === 'object').map((t) => t.slot));
          expect(slots.sort()).toEqual(Object.keys(vals).sort());
          expect(F.use.check(c, Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, String(v)])))).toBe('ok');
          clean(F.text.tryKey(c));
          for (const name of slots) {
            const fb = F.use.check(c, { ...vals, [name]: Number(vals[name]) + 100 });
            expect(fb, `${key} ${name}`).not.toBe('ok');
            expect(typeof F.text.use[fb], `${key} text.use.${fb}`).toBe('string');
          }
        }
      });
    });
  }
});

describe('the false rules students really hold can be written — and the world refutes each', () => {
  /** The rule is refuted in front of him: on his evidence, or by the first attack. */
  const refutedBy = (key, rule) => {
    const F = FORGES[key];
    const rows = F.evidence(F.fromInquiry(RESULTS[key]).rows);
    const run = runOn(F, rule, testsOf(F, rule, rows));
    return run.bad >= 0 ? run.marks[run.bad] : F.attacks(rule, rows)[0];
  };

  it('« the sum of two gaps always holds » falls on a gap the plank fills alone; « only the difference » on 56', () => {
    const always = refutedBy('jam-wal-farq', { if: 'any', then: 'both' });
    expect(always.held).toBe(false);
    expect(always.fa !== always.fb).toBe(true);
    const onlyDiff = refutedBy('jam-wal-farq', { if: 'both', then: 'diff' });
    expect([onlyDiff.op, onlyDiff.a, onlyDiff.held]).toEqual(['sum', 56, true]);
  });

  it('« if the plank fills neither, the glued gap fails » falls on 22 + 20 = 42 with the plank 7', () => {
    const c = refutedBy('jam-wal-farq', { if: 'none', then: 'neither' });
    expect([c.A, c.B, c.d, c.a, c.held]).toEqual([22, 20, 7, 42, true]);
    expect(joinOf(7, 22, 20, 'sum')).toMatchObject({ fillsA: false, fillsB: false, holds: true });
  });

  it('« two copies are filled, so the gap itself must be » falls on 14 and 21', () => {
    const c = refutedBy('madaaf', { if: 'two', then: 'all' });
    expect([c.d, c.base, c.held]).toEqual([14, 21, false]);
    expect(stackOf(14, 21, 2).holds).toBe(true);
    expect(stackOf(14, 21, 1).holds).toBe(false);
  });

  it('« it divides the quotient » and « the remainder is shorter, it cannot be filled » fall on 735 and 280', () => {
    const quotient = refutedBy('baqi-qisma', { if: 'and', then: 'q' });
    expect([quotient.A, quotient.B, quotient.target, quotient.held]).toEqual([735, 280, 'q', false]);
    const never = refutedBy('baqi-qisma', { if: 'and', then: 'never' });
    expect([never.A, never.B, never.R, never.held]).toEqual([735, 280, 175, true]);
    expect(175 % never.d).toBe(0);
  });

  it('« one example proves it » falls on 22 + 20 with 7: d divides the sum and not a', () => {
    const c = refutedBy('burhan', { how: 'one' });
    expect(c.held).toBe(false);
    expect(c.nums).toEqual({ d: 7, a: 22, b: 20 });
    expect((22 + 20) % 7).toBe(0);
    expect(22 % 7).not.toBe(0);
    const same = refutedBy('burhan', { how: 'same' });
    expect(same.held).toBe(false);
    expect(FORGES.burhan.says({ how: 'same' }, same)).toBe(true);
  });
});
