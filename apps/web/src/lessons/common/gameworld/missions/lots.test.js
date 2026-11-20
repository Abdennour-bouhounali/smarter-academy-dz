import { describe, expect, it } from 'vitest';
import { euclid, fill, gcd, NEEDED, pack, rehearse } from './lots';

const SMALL = { a: 12, b: 8 };
const REAL = { a: 1188, b: 528 };
const total = (r, k) => r.lots.reduce((s, l) => s + l[k], 0) + r.left[k];

describe('the scene « lots »: the world builds what he read', () => {
  it('the rehearsal never loses or invents a crate, whatever the model', () => {
    const ids = [...NEEDED, 'equalAB', 'apart'];
    for (let mask = 0; mask < 1 << ids.length; mask += 1) {
      const r = rehearse(
        ids.filter((_, i) => mask & (1 << i)),
        SMALL,
      );
      expect(total(r, 'a')).toBe(SMALL.a);
      expect(total(r, 'b')).toBe(SMALL.b);
      expect(r.lots.every((l) => l.a >= 0 && l.b >= 0)).toBe(true);
    }
  });

  it('only the whole reading gives the text’s lots; each missing condition shows in what is built', () => {
    expect(rehearse(NEEDED, SMALL)).toEqual({
      outcome: 'fair',
      lots: Array(4).fill({ a: 3, b: 2 }),
      left: { a: 0, b: 0 },
    });
    const without = (id) =>
      rehearse(
        NEEDED.filter((x) => x !== id),
        SMALL,
      );
    expect(without('most').outcome).toBe('few');
    expect(without('most').lots).toEqual([
      { a: 6, b: 4 },
      { a: 6, b: 4 },
    ]);
    expect(without('all').outcome).toBe('left');
    expect(without('all').left).toEqual({ a: 3, b: 2 });
    for (const id of ['sameA', 'sameB']) {
      const r = without(id);
      expect(r.outcome).toBe('unequal');
      const k = id === 'sameA' ? 'a' : 'b';
      expect(new Set(r.lots.map((l) => l[k])).size).toBeGreaterThan(1);
    }
    expect(rehearse([...NEEDED, 'equalAB'], SMALL)).toMatchObject({ outcome: 'equalAB', left: { a: 4, b: 0 } });
    expect(rehearse([...NEEDED, 'apart'], SMALL).lots.every((l) => !l.a || !l.b)).toBe(true);
  });

  it('BEM 2021: 1188 and 528 crates — 132 lots of 9 and 4, by four divisions', () => {
    expect(gcd(REAL.a, REAL.b)).toBe(132);
    expect(euclid(REAL.a, REAL.b)).toEqual([
      { a: 1188, b: 528, q: 2, r: 132 },
      { a: 528, b: 132, q: 4, r: 0 },
    ]);
    expect(pack(132, REAL)).toEqual({ outcome: 'most', n: 132, per: { a: 9, b: 4 }, left: { a: 0, b: 0 }, split: 1 });
    expect(pack(66, REAL)).toMatchObject({ outcome: 'more', per: { a: 18, b: 8 }, split: 2 });
    expect(pack(2, REAL)).toMatchObject({ outcome: 'more', split: 66 });
    expect(pack(100, REAL)).toMatchObject({ outcome: 'left', per: { a: 11, b: 5 }, left: { a: 88, b: 28 } });
    for (let n = 1; n <= 528; n += 1) {
      const p = pack(n, REAL);
      expect(p.per.a * n + p.left.a).toBe(REAL.a);
      expect(p.outcome === 'most').toBe(n === 132);
      expect(p.outcome === 'left').toBe(REAL.a % n !== 0 || REAL.b % n !== 0);
    }
  });

  it('the content of a lot as he wrote it: lots left empty, crates left, or exact', () => {
    expect(fill(132, { a: 9, b: 4 }, REAL)).toMatchObject({ outcome: 'exact', empty: 0 });
    expect(fill(132, { a: 132, b: 132 }, REAL)).toMatchObject({ outcome: 'short', full: 4, empty: 128 });
    expect(fill(132, { a: 8, b: 4 }, REAL)).toMatchObject({ outcome: 'left', left: { a: 132, b: 0 } });
  });
});
