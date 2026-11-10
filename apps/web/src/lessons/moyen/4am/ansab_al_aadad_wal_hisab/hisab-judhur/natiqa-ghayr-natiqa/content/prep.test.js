import { describe, it, expect } from 'vitest';
import { PREP_LADDER } from './prep';

const truthOf = (c) => {
  if (c.kind === 'eq') { const [p, q] = c.a; const [r, s] = c.b; return p * s === r * q; }
  if (c.kind === 'sqrt') { const [p, q] = c.a; const [r, s] = c.r; return r >= 0 && r * r * q === p * s * s; }
  throw new Error(c.kind);
};

describe('« أستعدّ » ladder of natiqa-ghayr-natiqa', () => {
  it('ten statements, numbered, the two skills alternating, levels never going down within a skill', () => {
    expect(PREP_LADDER).toHaveLength(10);
    PREP_LADDER.forEach((it, i) => { expect(it.n).toBe(i + 1); expect(it.skill).toBe(i % 2 === 0 ? 'natiq' : 'jidhr'); });
    ['natiq', 'jidhr'].forEach((sk) => {
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
  it('never uses the climax numbers (2,89 ; 1,7 ; √3 ; 1,74 ; 500)', () => {
    const text = JSON.stringify(PREP_LADDER.map((x) => `${x.text} ${x.why}`));
    ['2{,}89', '2,89', '1{,}7', '1,7', '\\\\sqrt{3}', '1{,}74', '500'].forEach((x) => expect(text.includes(x), x).toBe(false));
  });
});
