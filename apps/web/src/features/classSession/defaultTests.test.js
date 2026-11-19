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
/** The value of « 7 \times 6 + 4 » or « 83 - 47 » (the product before the sum), computed here; NaN for another shape. */
const evalExpr = (expr) => {
  if (!/^\d+(?: (?:\\times|[+-]) \d+)*$/.test(String(expr).trim())) return NaN;
  const value = (t) => t.split(' \\times ').reduce((p, x) => p * Number(x), 1);
  return String(expr)
    .trim()
    .split(' + ')
    .reduce((sum, term) => sum + term.split(' - ').reduce((v, x, i) => (i === 0 ? value(x) : v - value(x)), 0), 0);
};
/** « $lhs = rhs$ » → is it true? */
const equalityHolds = (text) => {
  const m = String(text).match(/^\$(.+) = (.+)\$$/);
  return Boolean(m) && evalExpr(m[1]) === evalExpr(m[2]) && Number.isFinite(evalExpr(m[1]));
};
/** « بين 30 و 40 » → [30, 40]. */
const between = (text) => {
  const m = String(text).match(/^بين (\d+) و (\d+)$/);
  return m ? [+m[1], +m[2]] : null;
};
/** What a divisibility rule READS of a number: the units digit (2, 5, 10), the digit sum (3, 9), the last two digits (4). */
const READS = {
  units: { text: (n) => `رقم آحاده ${n % 10}`, by: [2, 5, 10] },
  sum: {
    text: (n) =>
      `مجموع أرقامه ${String(n)
        .split('')
        .reduce((s, d) => s + Number(d), 0)}`,
    by: [3, 9],
  },
  lastTwo: { text: (n) => `العدد ${n % 100} المكوَّن من رقميه الأخيرين`, by: [4] },
};
/** « $q < a \div b < q + 1$ » or « $a \div b = q$ » about a ÷ b → is it true? (a ÷ b compared as a fraction, never rounded) */
const bracketHolds = (option, a, b) => {
  const lt = String(option).match(/^\$(\d+) < (\d+) \\div (\d+) < (\d+)\$$/);
  if (lt) {
    const [lo, x, y, hi] = lt.slice(1).map(Number);
    return x === a && y === b && hi === lo + 1 && lo * b < a && a < hi * b;
  }
  const eqm = String(option).match(/^\$(\d+) \\div (\d+) = (\d+)\$$/);
  return Boolean(eqm) && +eqm[1] === a && +eqm[2] === b && a === b * +eqm[3];
};
const shows = (q, ...nums) => {
  for (const n of nums) expect(q.text, `${q.id}: the question shows ${n}`).toContain(String(n));
};

/** The truth of each option of a choice (or the value of a number / a true-false), from the `check` alone. */
function truth(q) {
  const c = q.check;
  switch (c.type) {
    // ── the operations (1AM): a product, a difference, « x × y + z » ──
    case 'product':
      shows(q, c.x, c.y);
      return c.x * c.y;
    case 'difference':
      shows(q, c.x, c.y);
      expect(c.x - c.y, `${q.id}: never negative`).toBeGreaterThanOrEqual(0);
      return c.x - c.y;
    case 'equality':
      expect(q.text, q.id).toContain(`$${c.expr}$`);
      return equalityHolds(`$${c.expr}$`);
    case 'valuePick':
      expect(q.text, q.id).toContain(`$${c.expr}$`);
      return q.options.map((o) => Number(o) === evalExpr(c.expr));
    case 'trueEquality':
      return q.options.map((o) => equalityHolds(o));
    // ── the Euclidean division ──
    case 'dividend':
      expect(c.r, `${q.id}: the remainder is smaller than the divisor`).toBeLessThan(c.b);
      shows(q, c.b, c.q, c.r);
      return c.b * c.q + c.r;
    case 'restMax':
      shows(q, c.b);
      return c.b - 1;
    case 'restPick':
      shows(q, c.b);
      return q.options.map((o) => Number(o) < c.b);
    case 'remainderIs':
      shows(q, c.a, c.b);
      return c.a % c.b === c.r;
    case 'euclidIs':
      expect(q.text, q.id).toContain(`$${c.a} = ${c.b} \\times ${c.q} + ${c.r}$`);
      return c.b * c.q + c.r === c.a && c.r < c.b;
    case 'quotientBetween': {
      shows(q, c.a, c.b);
      const k = Math.floor(c.a / c.b);
      return q.options.map((o) => {
        const lohi = between(o);
        return Boolean(lohi) && lohi[0] <= k && k < lohi[1];
      });
    }
    // ── the divisibility rules (1AM) ──
    case 'missingDigit': {
      const fits = Array.from({ length: 10 }, (_, d) => d).filter((d) => Number(`${c.prefix}${d}`) % c.k === 0);
      expect(fits, `${q.id}: exactly one digit fits`).toHaveLength(1);
      shows(q, c.prefix, c.k);
      return fits[0];
    }
    case 'ruleReads':
      shows(q, c.n, c.k);
      return q.options.map((o, i) => {
        const f = READS[c.forms[i]];
        expect(o, `${q.id}: the option is written as its form says`).toBe(f.text(c.n));
        return f.by.includes(c.k);
      });
    // ── bracketing a quotient (2AM) ──
    case 'needed':
      shows(q, c.a, c.b);
      return Math.ceil(c.a / c.b);
    case 'upper':
      shows(q, c.a, c.b);
      expect(c.a % c.b, `${q.id}: a value « by excess » needs a remainder`).not.toBe(0);
      return Math.floor(c.a / c.b) + 1;
    case 'bracket': {
      const [k, r] = [Math.floor(c.a / c.b), c.a % c.b];
      expect(q.text, `${q.id}: the division written is the Euclidean one`).toContain(
        `$${c.a} = ${c.b} \\times ${k} + ${r}$`,
      );
      return q.options.map((o) => bracketHolds(o, c.a, c.b));
    }
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
    // the division road (2026-11-18): two 1AM lessons and the 2AM one, each in its grade's folder
    for (const name of [
      '1am/qisma-iqlidiya-baqi.json',
      '1am/qawaid-qabiliyat-qisma.json',
      '2am/qisma-iqlidiya-hasr.json',
    ])
      expect(files.map((f) => f.name)).toContain(name);
    for (const { name, data } of files) {
      expect(name, 'the file sits in the folder of its grade, named after its lesson').toBe(
        `${data.grade}/${data.lesson}.json`,
      );
    }
  });

  it('the checks themselves say the truth (the arithmetic, the brackets, what a rule reads)', () => {
    expect(evalExpr('7 \\times 6 + 4')).toBe(46);
    expect(evalExpr('83 - 47')).toBe(36);
    expect(evalExpr('5 \\times 8 + 3')).toBe(43);
    expect(equalityHolds('$5 \\times 8 + 3 = 55$')).toBe(false);
    expect(bracketHolds('$22 < 527 \\div 23 < 23$', 527, 23)).toBe(true);
    expect(bracketHolds('$21 < 527 \\div 23 < 22$', 527, 23)).toBe(false);
    expect(bracketHolds('$22 < 527 \\div 23 < 24$', 527, 23)).toBe(false); // not two consecutive numbers
    expect(bracketHolds('$527 \\div 23 = 22$', 527, 23)).toBe(false);
    expect(bracketHolds('$936 \\div 26 = 36$', 936, 26)).toBe(true);
    expect(READS.lastTwo.text(5728)).toBe('العدد 28 المكوَّن من رقميه الأخيرين');
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
