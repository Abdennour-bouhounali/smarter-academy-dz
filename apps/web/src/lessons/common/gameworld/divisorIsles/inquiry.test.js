import { describe, it, expect } from 'vitest';
import {
  tryPlank,
  lastNeeded,
  missedBy,
  LENSES,
  chartCells,
  judgeClaim,
  cellOf,
  holds,
  lightsIn,
  wall,
  pieceOf,
  quotientTex,
} from './inquiry';

/** The divisors of a number, counted apart. */
const divisors = (a) => Array.from({ length: a }, (_, i) => i + 1).filter((d) => a % d === 0);

describe('the investigation of a rule — pairs: a plank and its partner cross', () => {
  it('stopping at the last needed plank loses no plank of the gap; stopping one earlier may', () => {
    for (let a = 2; a <= 200; a += 1) {
      const m = lastNeeded(a);
      expect(m * m, a).toBeLessThanOrEqual(a);
      expect((m + 1) * (m + 1), a).toBeGreaterThan(a);
      expect(missedBy(a, m), a).toBe(0);
      // the partner of every plank after the crossing is a plank that was tried before it
      for (let d = m + 1; d <= a; d += 1) {
        const t = tryPlank(a, d);
        expect(t.crossed).toBe(true);
        expect(t.partner).toBeLessThan(d);
        if (t.whole) expect(t.q).toBeLessThanOrEqual(m);
      }
      for (let d = 1; d <= m; d += 1) expect(tryPlank(a, d).partner, `${a} ÷ ${d}`).toBeGreaterThanOrEqual(d);
    }
    expect(missedBy(36, 5)).toBe(1); // 6 itself
    expect(missedBy(30, 4)).toBe(2); // 5 and 6
    expect(divisors(60).length - missedBy(60, 3)).toBe(6); // 1, 2, 3 and their partners
  });
});

describe('the investigation of a rule — chart: a lens, the values claimed, and what the chart answers', () => {
  const right = (b, lens, from) =>
    LENSES[lens].values(from).filter((v) => chartCells(from).some((n) => LENSES[lens].of(n) === v && holds(n, b)));
  const separates = (b, lens, from = 0) => judgeClaim(b, lens, right(b, lens, from), from).ok;

  it('has 99 gaps on the first chart and 100 on the next ones', () => {
    expect(chartCells(0)).toHaveLength(99);
    expect(chartCells(100)[0]).toBe(100);
    expect(chartCells(100)).toHaveLength(100);
  });

  it('exactly ONE lens separates the chart for 2, 5, 3 and 9 — and it still does on the next hundred, with the same values', () => {
    const one = { 2: 'units', 5: 'units', 3: 'sum', 9: 'sum' };
    for (const [b, lens] of Object.entries(one)) {
      for (const other of Object.keys(LENSES))
        expect(separates(Number(b), other), `${b} ${other}`).toBe(other === lens);
      const values = right(Number(b), lens, 0);
      expect(judgeClaim(Number(b), lens, values, 100).ok, `${b} on 100–199`).toBe(true);
    }
    expect(right(5, 'units', 0)).toEqual([0, 5]);
    expect(right(9, 'sum', 0)).toEqual([9, 18]);
    expect(right(3, 'sum', 0)).toEqual([3, 6, 9, 12, 15, 18]);
  });

  it('no lens separates the chart for 4, and every value of every lens takes a dark cell in', () => {
    for (const lens of Object.keys(LENSES)) {
      expect(separates(4, lens)).toBe(false);
      for (const v of LENSES[lens].values(0))
        expect(judgeClaim(4, lens, [v]).intruders.length, `${lens} ${v}`).toBeGreaterThan(0);
    }
    // …but every hundred lights the same cells: the cell of a long gap decides
    for (let n = 100; n < 1000; n += 1) expect(holds(n, 4)).toBe(holds(cellOf(n) || 100, 4));
  });

  it('counts the cells that light in a stretch of the chart — what rings while the chart is filled', () => {
    for (const b of [2, 3, 4, 5, 9])
      for (const from of [0, 100, 200])
        for (let lo = from; lo < from + 100; lo += 1)
          for (const hi of [lo, lo + 1, Math.min(lo + 4, from + 100), from + 100]) {
            const lit = chartCells(from).filter((n) => n >= lo && n < hi && holds(n, b)).length;
            expect(lightsIn(b, lo, hi), `${b}: ${lo}…${hi}`).toBe(lit);
          }
    expect(lightsIn(9, 10, 14)).toBe(0); // a silent step: no gap of 10…13 is filled by 9
    expect(lightsIn(5, 0, 100)).toBe(19);
  });

  it('counts what a claim leaves out and what it takes in', () => {
    expect(judgeClaim(5, 'units', [0])).toMatchObject({ ok: false, intruders: [] });
    expect(judgeClaim(5, 'units', [0]).orphans).toHaveLength(10); // 5, 15, … 95
    expect(judgeClaim(5, 'units', [0, 5, 6]).intruders).toHaveLength(10);
    expect(judgeClaim(5, 'units', []).ok).toBe(false);
    expect(judgeClaim(5, 'units', [0, 5]).ok).toBe(true);
  });
});

describe('the investigation of a rule — turn: a bridge as a wall, and cut: a whole number of planks or a piece', () => {
  it('a wall keeps every cell of the gap; its columns are equal exactly when the bridge holds', () => {
    for (let a = 2; a <= 60; a += 1)
      for (let d = 1; d <= a; d += 1) {
        const w = wall(a, d);
        expect(w.cells).toHaveLength(a);
        expect(w.heights.reduce((s, h) => s + h, 0)).toBe(a);
        expect(new Set(w.heights).size === 1, `${a} / ${d}`).toBe(a % d === 0);
        expect(w.even).toBe(a % d === 0);
        // read the other way, a wall that holds is d planks of e
        if (w.even) expect(w.heights).toEqual(Array(d).fill(a / d));
        expect(w.rows).toBe(Math.ceil(a / d));
      }
    expect(wall(40, 6)).toMatchObject({ e: 6, rest: 4, rows: 7, heights: [7, 7, 7, 7, 6, 6] });
  });

  it('the saw: whole planks and the piece make the gap; the quotient is written as a number of planks', () => {
    for (let a = 1; a <= 60; a += 1)
      for (let b = 1; b <= a; b += 1) {
        const p = pieceOf(a, b);
        expect(p.whole * b + p.piece).toBe(a);
        expect(p.piece).toBeLessThan(b);
        expect(p.exact).toBe(a % b === 0);
        expect(/^\d+$/.test(quotientTex(a, b)), `${a} ÷ ${b}`).toBe(p.exact);
      }
    expect(quotientTex(31, 4)).toBe('7{,}75');
    expect(quotientTex(31, 7)).toBe('4{,}42\\dots');
    expect(quotientTex(36, 9)).toBe('4');
  });
});
