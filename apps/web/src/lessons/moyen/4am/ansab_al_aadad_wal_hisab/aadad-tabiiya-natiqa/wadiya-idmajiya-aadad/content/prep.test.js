import { describe, it, expect } from 'vitest';
import * as divisibility from '@smarter-academy/core/arithmetic/divisibility.js';
import { PREP_LADDER, PREP_LESSON } from './prep.js';
import { textViolations } from './forbidden.js';
import { LESSON_CONFIG } from '../lesson.config.js';

const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

/** La vérité de chaque affirmation, RECALCULÉE (jamais recopiée). */
const truthOf = (c) => {
  if (c.kind === 'rule') return c.truth;
  if (c.kind === 'divides') return c.a % c.d === 0 && c.b % c.d === 0;
  if (c.kind === 'pgcd') return gcd(c.a, c.b) === c.claim;
  if (c.kind === 'step') return c.a === c.b * c.q + c.r && c.r < c.b && gcd(c.a, c.b) === gcd(...c.next) && c.next[0] === c.b && c.next[1] === c.r;
  if (c.kind === 'commons') { const da = divisors(c.a); return JSON.stringify(divisors(c.b).filter((d) => da.includes(d))) === JSON.stringify(c.claim); }
  if (c.kind === 'euclidLast') return divisibility.euclidSteps(c.a, c.b).gcd === c.claim;
  if (c.kind === 'share') return c.a % c.k === 0 && c.b % c.k === 0;
  throw new Error(c.kind);
};

describe('« أستعدّ » ladder of the unit-1 synthesis', () => {
  it('ten statements, numbered; the three skills cycle; levels never go down', () => {
    expect(PREP_LADDER).toHaveLength(10);
    const cycle = ['qawasim', 'pgcd', 'iqlidus'];
    PREP_LADDER.forEach((it, i) => { expect(it.n).toBe(i + 1); expect(it.skill).toBe(cycle[i % 3]); });
    const lv = PREP_LADDER.map((x) => x.level);
    expect([...lv].sort((a, b) => a - b)).toEqual(lv);
    expect(lv[0]).toBe(1);
  });
  it('the first three are true, and both answers occur', () => {
    PREP_LADDER.slice(0, 3).forEach((it) => expect(it.answer).toBe(true));
    expect(PREP_LADDER.filter((x) => !x.answer).length).toBeGreaterThanOrEqual(3);
  });
  it('every answer is the truth, recomputed', () => {
    PREP_LADDER.forEach((it) => expect(truthOf(it.check), `${it.n}: ${it.text}`).toBe(it.answer));
  });
  it('the Euclid remainders quoted in statement 9 are the real ones', () => {
    expect(divisibility.euclidSteps(132, 54).steps.map((s) => s.r)).toEqual([24, 6, 0]);
  });
  it('each skill revises one of the unit\'s lessons — « راجع » is never empty', () => {
    expect(Object.values(PREP_LESSON).sort()).toEqual(['bahth-pgcd', 'qasim-mushtarak-akbar', 'tayin-pgcd']);
    new Set(PREP_LADDER.map((x) => x.skill)).forEach((sk) => expect(PREP_LESSON[sk], sk).toBeTruthy());
    expect(LESSON_CONFIG.priorKnowledge).toEqual(expect.arrayContaining(['qawasim-mushtaraka', 'pgcd-taarif', 'khwarizmiyat-iqlidus']));
  });
  it('never uses the challenge nor the unit situation, a control character, « DA » or the textbook', () => {
    const text = PREP_LADDER.map((x) => `${x.text} ${x.why}`).join(' ');
    expect(textViolations(text, 'prep')).toEqual([]);
    expect(/[\t\n\r]/.test(text)).toBe(false);
    expect(text.includes('الكتاب')).toBe(false);
    expect(/\bDA\b/.test(text)).toBe(false);
  });
});
