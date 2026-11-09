import { describe, it, expect } from 'vitest';
import { PREP_LADDER } from './prep';

const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const truthOf = (c) => {
  if (c.kind === 'pgcd') return gcd(c.a, c.b) === c.value;
  if (c.kind === 'div') { const all = c.ns.every((n) => c.ds.every((d) => n % d === 0)); return c.not ? !all : all; }
  throw new Error(c.kind);
};

describe('« أستعدّ » ladder of awwaliyan-fima-baynahuma', () => {
  it('ten statements, numbered, the two skills alternating, levels never going down within a skill', () => {
    expect(PREP_LADDER).toHaveLength(10);
    PREP_LADDER.forEach((it, i) => { expect(it.n).toBe(i + 1); expect(it.skill).toBe(i % 2 === 0 ? 'pgcd' : 'qawaid'); });
    ['pgcd', 'qawaid'].forEach((sk) => {
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
  it('never uses the climax numbers (26, 45, 39, 65) nor their PGCD 13 as an operand', () => {
    const text = JSON.stringify(PREP_LADDER.map((x) => x.text));
    [26, 45, 39, 65].forEach((x) => expect(new RegExp(`(^|[^0-9])${x}([^0-9]|$)`).test(text), `${x}`).toBe(false));
  });
});
