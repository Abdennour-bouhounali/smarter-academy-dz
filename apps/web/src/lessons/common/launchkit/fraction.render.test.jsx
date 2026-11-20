import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Write } from './gestures';
import { makeQuestion, slotsOf } from './families';

const rng = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};
const noop = () => {};

describe('عُدّة الانطلاق — a fraction written in its own shape', () => {
  it('draws the two fractions with a real bar and ONE box inside the second, in reading order', () => {
    for (let seed = 1; seed <= 20; seed += 1) {
      const q = makeQuestion(rng(seed), '1am.m5.r02', 1 + (seed % 2), 'write');
      const html = renderToString(<Write q={q} value={{}} onChange={noop} locked={false} play={noop} />);
      const { n, d, m, side } = q.calc;
      expect(html).toContain(`data-lk-frac="${n}/${d}"`);
      expect(html).toContain(`data-lk-frac="${side === 'bottom' ? `${m}/▢` : `▢/${m}`}"`);
      expect(html.match(/class="lk-frac"/g)).toHaveLength(2);
      expect(html.match(/data-lk-slot="v"/g)).toHaveLength(1);
      expect(html).not.toMatch(/\\frac|\$/); // no raw formula: the bar is drawn
    }
  });

  it('reads the boxes inside a fraction like any other box', () => {
    expect(slotsOf(['47', '=', { slot: 'q' }, '+', { slot: 'r' }]).map((s) => s.slot)).toEqual(['q', 'r']);
    expect(slotsOf([{ frac: ['6', '8'] }, '=', { frac: ['3', { slot: 'v' }] }]).map((s) => s.slot)).toEqual(['v']);
  });
});
