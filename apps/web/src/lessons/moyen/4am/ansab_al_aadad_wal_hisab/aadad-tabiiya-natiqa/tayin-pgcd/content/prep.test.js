import { describe, it, expect } from 'vitest';
import { PREP_LADDER } from './prep';

const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const truthOf = (c) => {
  if (c.kind === 'divisors') return JSON.stringify(divisors(c.n)) === JSON.stringify(c.list);
  if (c.kind === 'count') return divisors(c.n).length === c.count;
  if (c.kind === 'pgcd') return gcd(c.a, c.b) === c.value;
  throw new Error(c.kind);
};

describe('« أستعدّ » ladder of tayin-pgcd', () => {
  it('ten statements, numbered, the two skills alternating, levels never going down within a skill', () => {
    expect(PREP_LADDER).toHaveLength(10);
    PREP_LADDER.forEach((it, i) => { expect(it.n).toBe(i + 1); expect(it.skill).toBe(i % 2 === 0 ? 'qawasim' : 'pgcd'); });
    ['qawasim', 'pgcd'].forEach((sk) => {
      const lv = PREP_LADDER.filter((x) => x.skill === sk).map((x) => x.level);
      expect([...lv].sort((a, b) => a - b)).toEqual(lv);
    });
  });
  it('the first three are true, and both answers occur', () => {
    PREP_LADDER.slice(0, 3).forEach((it) => expect(it.answer).toBe(true));
    expect(PREP_LADDER.some((x) => !x.answer)).toBe(true);
  });
  it('every answer is the truth, recomputed', () => {
    PREP_LADDER.forEach((it) => expect(truthOf(it.check), it.text).toBe(it.answer));
  });
  it('never uses the climax numbers (90, 126, 18)', () => {
    const text = JSON.stringify(PREP_LADDER);
    [90, 126, 18].forEach((x) => expect(new RegExp(`(^|[^0-9])${x}([^0-9]|$)`).test(text), `${x}`).toBe(false));
  });
});
