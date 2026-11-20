import { describe, expect, it } from 'vitest';
import { deal, euclid, fill, gcd, line, slip } from './lots';

const REAL = { a: 1188, b: 528 };

describe('the scene « lots »: every act is a line of numbers', () => {
  it('a number of lots writes two lines, and the stock is never lost or invented', () => {
    for (let n = 1; n <= 600; n += 1) {
      const d = deal(n, REAL);
      for (const l of d.lines) {
        expect(l.b * l.q + l.r).toBe(l.a);
        expect(l.r).toBeLessThan(n);
      }
      expect(d.outcome === 'left').toBe(REAL.a % n !== 0 || REAL.b % n !== 0);
      expect(d.outcome === 'most').toBe(n === 132);
    }
    expect(deal(5, REAL).lines).toEqual([
      { a: 1188, b: 5, q: 237, r: 3 },
      { a: 528, b: 5, q: 105, r: 3 },
    ]);
    expect(deal(4, REAL)).toMatchObject({ outcome: 'more', per: { a: 297, b: 132 }, left: { a: 0, b: 0 } });
    expect(deal(264, REAL).left).toEqual({ a: 132, b: 0 });
  });

  it('BEM 2022: the carrots laid twice against the potatoes leave 132 — and every number of lots that works splits them', () => {
    expect(euclid(REAL.a, REAL.b)).toEqual([
      { a: 1188, b: 528, q: 2, r: 132 },
      { a: 528, b: 132, q: 4, r: 0 },
    ]);
    expect(gcd(REAL.a, REAL.b)).toBe(132);
    // THE argument of « the greatest »: a number of lots that splits both stocks splits the 132 crates left alone
    for (let n = 1; n <= 1188; n += 1)
      if (deal(n, REAL).outcome !== 'left') {
        expect(line(132, n).r).toBe(0);
        expect(n).toBeLessThanOrEqual(132);
      }
  });

  it('the content of a lot as he wrote it: lots left empty, crates left, or exact', () => {
    expect(fill(132, { a: 9, b: 4 }, REAL)).toMatchObject({ outcome: 'exact', empty: 0 });
    expect(fill(132, { a: 132, b: 132 }, REAL)).toMatchObject({ outcome: 'short', full: 4, empty: 128 });
    expect(fill(132, { a: 8, b: 4 }, REAL)).toMatchObject({ outcome: 'left', left: { a: 132, b: 0 } });
  });

  it('a division typed in its shape is answered by a fact, not by « wrong »', () => {
    expect(slip(1188, 528, 2, 132)).toBeNull();
    expect(slip(1188, 528, 3, 132)).toEqual({ kind: 'sum', value: 1716 });
    expect(slip(1188, 528, 1, 660)).toEqual({ kind: 'rest', value: 660 });
  });
});
