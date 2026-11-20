import { describe, expect, it } from 'vitest';
import { deal, euclid, fill, gcd } from '../../../../../../common/gameworld/missions/lots';
import { BEM_2022 as S } from './bem2022';

describe('mission 1 — BEM 2022, the identical lots: every number of the situation is computed', () => {
  it('the paper’s stock: 1188 and 528 crates — 132 lots of 9 and 4, by two divisions', () => {
    expect(S.stock).toEqual({ a: 1188, b: 528 });
    expect(gcd(S.stock.a, S.stock.b)).toBe(132);
    expect(euclid(S.stock.a, S.stock.b).map((r) => [r.q, r.r])).toEqual([
      [2, 132],
      [4, 0],
    ]);
    expect(deal(132, S.stock).outcome).toBe('most');
    expect(fill(132, { a: 9, b: 4 }, S.stock).outcome).toBe('exact');
  });

  it('the paper is whole: its two numbers are the stocks he taps, and the four phrases that light are in it', () => {
    const text = S.paper.map((p) => p.t).join('');
    expect(text).toContain('1188 صندوق من البطاطا و 528 صندوقًا من الجزر');
    expect(S.paper.filter((p) => p.stock).map((p) => [p.stock, Number(p.t)])).toEqual([
      ['a', S.stock.a],
      ['b', S.stock.b],
    ]);
    expect(S.paper.filter((p) => p.id).map((p) => p.id)).toEqual(['all', 'same', 'most', 'content']);
  });

  it('one name says what he found; each other name is answered by a fact about 132', () => {
    expect(S.names.filter((n) => n.right)).toHaveLength(1);
    for (const n of S.names.filter((x) => !x.right)) expect(n.said).toContain('132');
    expect(1188 % 528).toBe(132);
  });

  it('his copy: the data, the two goals, what each question needs — and the second needs the answer of the first', () => {
    expect(S.data.map((d) => d.id)).toEqual(['a', 'b', 'all', 'same']);
    expect(S.data.filter((d) => d.phrase).map((d) => d.phrase)).toEqual(['all', 'same']);
    expect(S.goals.map((g) => g.id)).toEqual(['most', 'content']);
    for (const g of S.goals) {
      const need = S.needs[g.id];
      expect(Object.keys(need.without).sort()).toEqual([...need.must].sort());
    }
    expect(S.needs.content.must).toContain('ans');
    expect(S.minutes).toBeGreaterThanOrEqual(20);
    expect(S.marker.length).toBeGreaterThanOrEqual(5);
  });

  it('money is « دج » and nothing sends to a book', () => {
    const all = JSON.stringify(S);
    expect(all).not.toMatch(/\bDA\b/);
    expect(all).not.toMatch(/الكتاب|صفحة/);
  });
});
