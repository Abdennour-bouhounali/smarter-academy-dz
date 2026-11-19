import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import Inquiry from './Inquiry';

// the screens expose their state to the walks on `window` (dev only): give the server render one
globalThis.window = globalThis.window ?? {};

/** A toy lesson: every sentence the three screens of the greatest common divisor ask for (GAME_WORLD.md), as plain tags. */
const say =
  (tag) =>
  (...args) =>
    `${tag}(${args.length})`;
const NX = { next: 'next', done: 'done', yes: 'yes', no: 'no' };

const SPECS = {
  common: {
    kind: 'common',
    rounds: [
      { a: 12, b: 18, candidates: [1, 2, 3, 4, 5, 6, 9, 12] },
      { a: 8, b: 15, candidates: [1, 2, 3, 5] },
    ],
    text: {
      ...NX,
      lead: say('lead'),
      goal: say('goal'),
      take: say('take'),
      ask: say('ask'),
      onA: say('onA'),
      onB: say('onB'),
      lay: 'lay',
      seen: say('seen'),
      shelf: { a: say('shelfA'), b: say('shelfB'), both: say('shelfBoth'), none: say('shelfNone') },
      sayLead: say('sayLead'),
      sayCount: 'count',
      check: 'check',
      sayMiss: say('sayMiss'),
      sayOk: say('sayOk'),
      foundLine: say('line'),
    },
  },
  ladder: {
    kind: 'ladder',
    mode: 'subtract',
    rounds: [
      { a: 84, b: 36 },
      { a: 84, b: 36, mode: 'divide' },
    ],
    text: {
      ...NX,
      lead: say('lead'),
      goal: say('goal'),
      ask: say('ask'),
      write: 'write',
      seen: say('seen'),
      planks: 'planks',
      folded: say('folded'),
      countAsk: say('countAsk'),
      countLabel: 'rows',
      finish: 'finish',
      end: say('end'),
      foundLine: say('line'),
    },
  },
  nest: {
    kind: 'nest',
    rounds: [{ a: 24, b: 36, probes: [5, 6, 8, 4, 24] }],
    text: {
      ...NX,
      lead: say('lead'),
      goal: say('goal'),
      given: say('given'),
      divisorsLabel: say('divisorsLabel'),
      ask: say('ask'),
      seen: say('seen'),
      foundLine: say('line'),
      compare: say('compare'),
      commonLabel: say('commonLabel'),
    },
  },
};

describe('the investigation screens — common, ladder, nest open on their question, their goal and their first act', () => {
  const first = {
    common: 'data-iq-plank="1"',
    ladder: 'data-iq-in="x"',
    nest: 'data-iq-say="yes"',
  };
  for (const [kind, spec] of Object.entries(SPECS))
    it(kind, () => {
      const html = renderToString(<Inquiry spec={spec} onDone={() => {}} />);
      expect(html).toContain(`data-iq="${kind}"`);
      expect(html).toContain('lead(');
      expect(html).toContain('data-iq-goal');
      expect(html).toContain('goal(');
      expect(html).toContain(first[kind]);
      expect(html).not.toMatch(/undefined|NaN/);
    });

  it('common shows its tray and its three shelves; nest shows g and its planks; ladder its first pair and its ticks', () => {
    const c = renderToString(<Inquiry spec={SPECS.common} onDone={() => {}} />);
    expect(c).toContain('data-iq-tray');
    for (const s of ['a', 'b', 'both']) expect(c).toContain(`data-iq-shelf="${s}"`);
    expect(c).toContain('data-iq-shelf="none"'); // plank 5 holds neither 12 nor 18
    const n = renderToString(<Inquiry spec={SPECS.nest} onDone={() => {}} />);
    expect(n).toContain('data-iq-divs="1,2,3,4,6,12"');
    expect(n).toContain('data-iq-strip="g"');
    const l = renderToString(<Inquiry spec={SPECS.ladder} onDone={() => {}} />);
    expect(l).toContain('data-iq-row="1"');
    expect(l).not.toContain('data-iq-row="2"');
    expect(l).toContain('data-iq-ticks="1,2,3,4,6,12"');
  });

  it('a ladder of one row asks for the count at once (b fills a)', () => {
    const one = { ...SPECS.ladder, mode: 'divide', rounds: [{ a: 36, b: 12 }] };
    const html = renderToString(<Inquiry spec={one} onDone={() => {}} />);
    expect(html).toContain('data-iq-in="count"');
    expect(html).toContain('countAsk(');
  });
});
