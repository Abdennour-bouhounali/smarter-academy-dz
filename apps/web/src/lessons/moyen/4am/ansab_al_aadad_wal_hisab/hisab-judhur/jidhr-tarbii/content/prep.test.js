import { describe, it, expect } from 'vitest';
import { PREP_LADDER } from './prep';

/** Pour le statement 7 (« 0,9² = 0,81 ET 0,09² = 0,81 »), la conjonction est fausse par sa seconde moitié : on vérifie les deux. */
const truthOf = (c) => {
  if (c.kind === 'sq') { const [p, q] = c.x; const [vp, vq] = c.v; return p * p * vq === vp * q * q; }
  if (c.kind === 'hyp') return c.a * c.a + c.b * c.b === c.c2;
  if (c.kind === 'leg') return c.c * c.c - c.a * c.a === c.b2;
  if (c.kind === 'right') { const [p, q, r] = c.sides; return p * p + q * q === r * r; }
  throw new Error(c.kind);
};

describe('« أستعدّ » ladder of jidhr-tarbii', () => {
  it('ten statements, numbered, the two skills alternating, levels never going down within a skill', () => {
    expect(PREP_LADDER).toHaveLength(10);
    PREP_LADDER.forEach((it, i) => { expect(it.n).toBe(i + 1); expect(it.skill).toBe(i % 2 === 0 ? 'murabba' : 'fithaghuras'); });
    ['murabba', 'fithaghuras'].forEach((sk) => {
      const lv = PREP_LADDER.filter((x) => x.skill === sk).map((x) => x.level);
      expect([...lv].sort((a, b) => a - b)).toEqual(lv);
    });
  });
  it('the first three are true, and both answers occur', () => {
    PREP_LADDER.slice(0, 3).forEach((it) => expect(it.answer).toBe(true));
    expect(PREP_LADDER.some((x) => !x.answer)).toBe(true);
  });
  it('every answer is the truth, recomputed', () => {
    PREP_LADDER.forEach((it) => {
      const truth = it.n === 7 ? truthOf({ kind: 'sq', x: [9, 10], v: [81, 100] }) && truthOf(it.check) : truthOf(it.check);
      expect(truth, it.text).toBe(it.answer);
    });
  });
  it('never uses the climax numbers (34, 5,83) nor the activity triangle (1 and 2 → 5)', () => {
    const text = JSON.stringify(PREP_LADDER.map((x) => x.text));
    ['34', '5{,}83', '5,83'].forEach((x) => expect(text.includes(x), x).toBe(false));
    expect(/(^|[^0-9,{}])1 و 2([^0-9]|$)/.test(text)).toBe(false);
  });
});
