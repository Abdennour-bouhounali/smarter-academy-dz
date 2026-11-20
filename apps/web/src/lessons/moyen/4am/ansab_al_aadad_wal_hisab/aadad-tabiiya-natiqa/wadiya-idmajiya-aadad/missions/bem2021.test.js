import { describe, expect, it } from 'vitest';
import {
  euclid,
  fill,
  gcd,
  MISREADINGS,
  NEEDED,
  pack,
  rehearse,
} from '../../../../../../common/gameworld/missions/lots';
import { BEM_2021 as S } from './bem2021';

describe('mission 1 — BEM 2021, the identical lots: every number of the situation is computed', () => {
  it('the paper’s stock: 1188 and 528 crates — 132 lots of 9 and 4, by two divisions', () => {
    expect(S.stock).toEqual({ a: 1188, b: 528 });
    expect(gcd(S.stock.a, S.stock.b)).toBe(132);
    expect(euclid(S.stock.a, S.stock.b).map((r) => [r.q, r.r])).toEqual([
      [2, 132],
      [4, 0],
    ]);
    expect(pack(132, S.stock).outcome).toBe('most');
    expect(fill(132, { a: 9, b: 4 }, S.stock).outcome).toBe('exact');
    expect(S.exam.lines.join(' ')).toContain('1188');
    expect(S.exam.lines.join(' ')).toContain('528');
  });

  it('the story hides exactly the two numbers the robot must count; the other things asked are facts it does not need', () => {
    const holes = S.story.filter((p) => typeof p !== 'string').map((p) => p.ask);
    expect(holes).toEqual(S.asks.filter((a) => a.needed).map((a) => a.id));
    expect(S.story.filter((p) => typeof p === 'string').join('')).not.toMatch(/\d/);
    expect(S.asks.filter((a) => !a.needed).length).toBeGreaterThanOrEqual(2);
  });

  it('the model: the four sentences of the text and the two misreadings — only the whole reading rehearses fair', () => {
    expect(S.phrases.map((p) => p.id).sort()).toEqual([...NEEDED, ...MISREADINGS].sort());
    expect(rehearse(NEEDED, S.small).outcome).toBe('fair');
    for (const id of NEEDED)
      expect(
        rehearse(
          NEEDED.filter((x) => x !== id),
          S.small,
        ).outcome,
      ).not.toBe('fair');
    for (const id of MISREADINGS) expect(rehearse([...NEEDED, id], S.small).outcome).toBe(id);
  });

  it('each flag has exactly one tile that says the goal; every other tile is answered by what it would build', () => {
    for (const f of S.flags)
      for (const list of [f.starts, f.units].filter(Boolean)) {
        expect(list.filter((x) => x.right)).toHaveLength(1);
        for (const x of list.filter((y) => !y.right)) expect(x.built.length).toBeGreaterThan(10);
      }
    expect(S.flags.map((f) => f.id)).toContain(S.chain.first);
    expect(S.tools.filter((t) => t.right)).toHaveLength(1);
  });

  it('money is « دج » and nothing sends to a book', () => {
    const all = JSON.stringify(S);
    expect(all).not.toMatch(/\bDA\b/);
    expect(all).not.toMatch(/الكتاب|صفحة/);
  });
});
