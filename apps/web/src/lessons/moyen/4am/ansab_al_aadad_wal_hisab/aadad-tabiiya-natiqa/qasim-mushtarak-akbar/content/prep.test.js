import { describe, it, expect } from 'vitest';
import { PREP_LADDER } from './prep';

const divisors = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const truthOf = (c) => {
  if (c.kind === 'divides') return c.n % c.d === 0;
  if (c.kind === 'divisors') return JSON.stringify(divisors(c.n)) === JSON.stringify(c.list);
  if (c.kind === 'count') return divisors(c.n).length === c.count;
  throw new Error(c.kind);
};

describe('« أستعدّ » ladder of qasim-mushtarak-akbar', () => {
  it('ten statements, numbered, levels never going down within a skill, the two skills alternating', () => {
    expect(PREP_LADDER).toHaveLength(10);
    PREP_LADDER.forEach((it, i) => { expect(it.n).toBe(i + 1); expect(it.skill).toBe(i % 2 === 0 ? 'jidaa' : 'qawasim'); });
    ['jidaa', 'qawasim'].forEach((sk) => {
      const lv = PREP_LADDER.filter((x) => x.skill === sk).map((x) => x.level);
      expect([...lv].sort((a, b) => a - b)).toEqual(lv);
    });
  });
  it('the first three are true (start with successes), and both answers occur', () => {
    PREP_LADDER.slice(0, 3).forEach((it) => expect(it.answer).toBe(true));
    expect(PREP_LADDER.some((x) => !x.answer)).toBe(true);
  });
  it('every answer is the truth, recomputed', () => {
    PREP_LADDER.forEach((it) => {
      expect(truthOf(it.check), it.text).toBe(it.answer);
      if (it.check.product) expect(it.check.product[0] * it.check.product[1]).toBe(it.check.n);
    });
  });
  it('never uses the climax numbers (120, 84)', () => {
    const text = JSON.stringify(PREP_LADDER);
    [120, 84].forEach((x) => expect(new RegExp(`(^|[^0-9])${x}([^0-9]|$)`).test(text)).toBe(false));
  });
});
