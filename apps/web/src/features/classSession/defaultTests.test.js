import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { getItem } from '@smarter-academy/core/curriculum/dz/net/learningNet.js';

/**
 * THE DEFAULT CLASS TESTS (content/class-tests/**): a teacher projects them in front of his class, so a default test never
 * ships a wrong answer. Every question carries a `check`; its answer is RE-COMPUTED here, and for a choice every other
 * option is proved wrong.
 */
const ROOT = new URL('../../../../../content/class-tests/', import.meta.url);
const files = readdirSync(ROOT, { recursive: true })
  .filter((f) => String(f).endsWith('.json'))
  .map((f) => ({ name: String(f), data: JSON.parse(readFileSync(new URL(String(f), ROOT), 'utf8')) }));

/** « $47 = 6 \times 7 + 5$ » → { a, b, q, sign, r }, or null. */
const eq = (text) => {
  const m = String(text).match(/^\$(\d+) = (\d+) \\times (\d+)(?: ([+-]) (\d+))?\$$/);
  return m ? { a: +m[1], b: +m[2], q: +m[3], sign: m[4] ?? '+', r: +(m[5] ?? 0) } : null;
};
const FORMS = {
  a_divides_b: { text: (a, b) => `${a} قاسم للعدد ${b}`, holds: (a, b) => b % a === 0 },
  b_divides_a: { text: (a, b) => `${b} قاسم للعدد ${a}`, holds: (a, b) => a % b === 0 },
  a_multiple_of_b: { text: (a, b) => `${a} مضاعف للعدد ${b}`, holds: (a, b) => a % b === 0 },
  b_multiple_of_a: { text: (a, b) => `${b} مضاعف للعدد ${a}`, holds: (a, b) => b % a === 0 },
};
/** What an equality a = b × q lets us conclude, in the three ways students say it — one is right. */
const FACTOR_FORMS = {
  both: { text: (a, b, q) => `${b} و ${q} قاسمان للعدد ${a}`, holds: true },
  onlyFirst: { text: (a, b) => `${b} قاسم للعدد ${a} فقط`, holds: false },
  reversed: { text: (a, b, q) => `${a} قاسم للعددين ${b} و ${q}`, holds: false },
};
const divisorsOf = (a) => Array.from({ length: a }, (_, i) => i + 1).filter((d) => a % d === 0);
/** The last number to try when listing the divisors of a: the biggest one whose square does not pass a. */
const lastToTry = (a) => Math.floor(Math.sqrt(a));
/** The facts « d divides a and b » that a property question stands on. */
const common = (q, c) => {
  expect(c.a % c.d, `${q.id}: ${c.d} must divide ${c.a}`).toBe(0);
  expect(c.b % c.d, `${q.id}: ${c.d} must divide ${c.b}`).toBe(0);
};
/** The forms of a sentence about the remainder r of a by b, when d divides a and b. */
const REST_FORMS = {
  divides: { text: (d, r) => `${d} قاسم للعدد ${r}`, holds: (d, r) => r % d === 0 },
  not: { text: (d, r) => `${d} ليس قاسمًا للعدد ${r}`, holds: (d, r) => r % d !== 0 },
  unknown: { text: (d, r) => `لا يمكن أن نعرف إن كان ${d} قاسمًا للعدد ${r}`, holds: () => false }, // d divides r: we know
};
/**
 * A proof with letters « $<expr> = <rhs>$ », a = d × k and b = d × m: it proves that d divides <expr> when <rhs> is d times
 * a bracket AND equals <expr> for every k > m tried (computed here, never read from the answer).
 */
const letterProof = (option, c) => {
  const m = String(option).match(/^\$(.+) = (.+)\$$/);
  if (!m || m[1] !== c.expr) return false;
  const js = (t) => t.replaceAll('\\times', '*');
  const value = (t) => new Function('a', 'b', 'k', 'm', `return ${js(t)};`); // eslint-disable-line no-new-func
  const [lhs, rhs] = [value(m[1]), value(m[2])];
  const same = [
    [5, 2],
    [9, 4],
    [13, 7],
    [3, 0],
  ].every(([k, n]) => lhs(c.d * k, c.d * n, k, n) === rhs(c.d * k, c.d * n, k, n));
  return same && m[2].startsWith(`${c.d} \\times (`) && m[2].endsWith(')');
};
/** The truth of each option of a choice (or the value of a number / a true-false), from the `check` alone. */
function truth(q) {
  const c = q.check;
  switch (c.type) {
    case 'partner':
      expect(c.a % c.b, `${q.id}: ${c.b} must divide ${c.a}`).toBe(0);
      return c.a / c.b;
    case 'divisorCount':
      return divisorsOf(c.a).length;
    case 'stopAt':
      return lastToTry(c.a);
    case 'stopClaim':
      return c.upTo === lastToTry(c.a);
    case 'divisorSet':
      return q.options.map((o) => {
        const mine = String(o)
          .split('،')
          .map((x) => Number(x.trim()));
        return mine.join() === divisorsOf(c.a).join();
      });
    case 'twoDivisors':
      expect(c.a % c.b, `${q.id}: ${c.b} must divide ${c.a}`).toBe(0);
      return q.options.map((o, i) => {
        const f = FACTOR_FORMS[c.forms[i]];
        expect(o, `${q.id}: the option is written as its form says`).toBe(f.text(c.a, c.b, c.a / c.b));
        return f.holds;
      });
    case 'remainder':
      return c.a % c.b;
    case 'quotient':
      return Math.floor(c.a / c.b);
    case 'divisible':
      return c.a % c.k === 0;
    case 'divisor':
      return c.a % c.b === 0;
    case 'restAllowed':
      return c.r < c.b;
    case 'oneAndItself':
      return c.a % 1 === 0 && c.a % c.a === 0;
    case 'euclid':
      return q.options.map((o) => {
        const e = eq(o);
        return Boolean(e) && e.a === c.a && e.b === c.b && e.sign === '+' && e.b * e.q + e.r === e.a && e.r < e.b;
      });
    case 'productProof':
      return q.options.map((o) => {
        const e = eq(o);
        return Boolean(e) && e.a === c.a && e.b === c.b && e.r === 0 && e.b * e.q === e.a;
      });
    case 'pickDivisible':
      return q.options.map((o) => Number(o) % c.k === 0);
    case 'pickDivisor':
      return q.options.map((o) => c.a % Number(o) === 0);
    case 'commonFactor': {
      common(q, c);
      expect(q.text, q.id).toContain(`${c.a} ${c.op} ${c.b} = ${c.d} \\times`);
      const n = c.op === '+' ? c.a + c.b : c.a - c.b;
      expect(n, `${q.id}: a length, never negative`).toBeGreaterThanOrEqual(0);
      return n / c.d;
    }
    case 'multipleFactor':
      expect(c.a % c.d, `${q.id}: ${c.d} must divide ${c.a}`).toBe(0);
      expect(q.text, q.id).toContain(`${c.m} \\times ${c.a} = ${c.d} \\times`);
      return (c.m * c.a) / c.d;
    case 'multipleDivides':
      expect(c.a % c.d, `${q.id}: ${c.d} must divide ${c.a}`).toBe(0);
      expect(q.text, q.id).toContain(`${c.m} \\times ${c.a}`);
      return (c.m * c.a) % c.d === 0;
    case 'converseSum':
      // the sum IS a multiple of d: the sentence tests the converse of the property, not a false premise
      expect((c.a + c.b) % c.d, `${q.id}: ${c.d} must divide ${c.a} + ${c.b}`).toBe(0);
      expect(q.text, q.id).toContain(`$${c.a} + ${c.b}$`);
      return c.a % c.d === 0 && c.b % c.d === 0;
    case 'commonRemainder':
      common(q, c);
      expect((c.a % c.b) % c.d, `${q.id}: ${c.d} divides the remainder`).toBe(0);
      return c.a % c.b;
    case 'remainderShares': {
      common(q, c);
      const [k, r] = [Math.floor(c.a / c.b), c.a % c.b];
      expect(q.text, `${q.id}: the division written is the Euclidean one`).toContain(
        `$${c.a} = ${c.b} \\times ${k} + ${r}$`,
      );
      return q.options.map((o, i) => {
        const f = REST_FORMS[c.forms[i]];
        expect(o, `${q.id}: the option is written as its form says`).toBe(f.text(c.d, r));
        return f.holds(c.d, r);
      });
    }
    case 'letterProof':
      expect(q.text, q.id).toContain(`$${c.expr}$`);
      return q.options.map((o) => letterProof(o, c));
    case 'phrase':
      return q.options.map((o, i) => {
        const f = FORMS[c.forms[i]];
        expect(o, `${q.id}: the option is written as its form says`).toBe(f.text(c.a, c.b));
        return f.holds(c.a, c.b);
      });
    default:
      throw new Error(`${q.id}: unknown check « ${c.type} »`);
  }
}

describe('حصّة القسم — the default tests', () => {
  it('there is a default test for every lesson that has its board', () => {
    expect(files.map((f) => f.name)).toContain('4am/qasim-adad-tabii.json');
    expect(files.map((f) => f.name)).toContain('4am/qawasim-adad-tabii.json');
    expect(files.map((f) => f.name)).toContain('4am/khawass-qawasim.json'); // lesson 3: written before its board
  });

  for (const { name, data } of files) {
    const all = [...data.start, ...data.end, ...data.pool];
    it(`${name}: every answer is re-computed from its check, and no other option is right`, () => {
      for (const q of all) {
        const t = truth(q);
        if (q.kind === 'choice') {
          expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
          expect(t.filter(Boolean), `${q.id}: exactly one right option`).toHaveLength(1);
          expect(t.indexOf(true), `${q.id}: its index`).toBe(q.answer);
          expect(new Set(q.options).size).toBe(q.options.length);
        } else expect(q.answer, `${q.id} « ${q.text} »`).toBe(t);
        expect(['choice', 'truefalse', 'number']).toContain(q.kind);
        expect(getItem(q.item), `${q.id}: its الكفاءة is an item of the learning net`).toBeTruthy();
        expect(q.text).not.toMatch(/الكتاب|ص \d|خمر|قمار|خنزير/);
      }
      expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
    });
    it(`${name}: short enough for the start of an hour, the right option never always in the same place, true and false both asked`, () => {
      expect(data.start.length).toBeGreaterThanOrEqual(6);
      expect(data.start.length).toBeLessThanOrEqual(10);
      expect(data.end.length).toBeGreaterThanOrEqual(5);
      expect(data.end.length).toBeLessThanOrEqual(8);
      for (const part of [data.start, data.end]) {
        expect(
          new Set(part.filter((q) => q.kind === 'choice').map((q) => q.answer)).size,
          'the right option moves',
        ).toBeGreaterThanOrEqual(2);
        expect(new Set(part.filter((q) => q.kind === 'truefalse').map((q) => q.answer)).size, 'true and false').toBe(2);
      }
    });
    it(`${name}: the two questions of the new lesson asked at the start come back at the end with other numbers`, () => {
      const teasers = data.start.filter((q) => q.teaser);
      expect(teasers.length).toBe(2);
      for (const tq of teasers) {
        const back = data.end.find((q) => q.pairOf === tq.id);
        expect(back, tq.id).toBeTruthy();
        expect(back.item).toBe(tq.item);
        expect(back.text).not.toBe(tq.text);
        expect(back.answer).toBe(tq.answer);
      }
      expect(
        data.start.slice(-2).every((q) => q.teaser),
        'the new lesson comes last in the start test',
      ).toBe(true);
      expect(data.start[0].teaser).toBeFalsy();
    });
  }
});
