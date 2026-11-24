/**
 * THE EXPERIMENTS of lesson `talis-hisab-atwal`: 📐 `plan` (it writes the rule), 🦋 `halfturn`, 🔍 `scale` (key 🔑 has
 * none — it is met on the field's canals). The shared checks (`describeExperiments`: no two keys share a (kind, mode);
 * no sentence names a key or states its rule; Arabic agreement), then the lesson's own: each experiment played through
 * its world's reducer on the lesson's numbers — the false procedures refused where he makes them (the plan writes the
 * rule, so they never reach a tile), the turned side lands straight or crooked, the frame covers, falls inside or goes
 * beyond — and each screen renders whole.
 */
import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describeExperiments } from '../../../../../../common/gameworld/kit/authoring/test/suites.js';
import Inquiry from '../../../../../../common/gameworld/nilePyramids/Inquiry';
import { textOf } from '../../../../../../common/gameworld/nilePyramids/inquiryParts';
import {
  initPlan,
  planReducer,
  planResult,
  toolsOf,
  unknownsOf,
  CARDS,
  roundFig,
} from '../../../../../../common/gameworld/nilePyramids/plan';
import {
  initHalfturn,
  halfturnReducer,
  halfturnResult,
} from '../../../../../../common/gameworld/nilePyramids/halfturn';
import {
  initScale,
  scaleReducer,
  scaleResult,
  perimeterChoices,
} from '../../../../../../common/gameworld/nilePyramids/scale';
import { chain } from '../../../../../../common/gameworld/nilePyramids/figure';
import { HALFTURN_INQUIRY, PLAN_INQUIRY, SCALE_INQUIRY } from './inquiries';
import { FORGES } from './forges';
import { K2, K3, K4, over, times, write } from './math';

// the screens expose their state to the walks on `window` (dev only)
globalThis.window = globalThis.window ?? {};

/** Every string of a value: a string, a function called with sample letters, an object's values. */
const stringsOf = (v) => {
  if (typeof v === 'string') return [v];
  if (typeof v === 'function') return stringsOf(v('M', 'A', 'B'));
  if (v && typeof v === 'object') return Object.values(v).flatMap(stringsOf);
  return [];
};
const SPECS = { [K2]: PLAN_INQUIRY, [K3]: HALFTURN_INQUIRY, [K4]: SCALE_INQUIRY };

describeExperiments({
  ofKey: SPECS,
  linesOf: (key, spec) => [
    ...stringsOf(textOf(spec.kind, spec)),
    ...(spec.rounds ?? []).flatMap((r) => r.fact?.lines ?? []),
  ],
  // no key's name, no word that states a rule of the lesson
  never: /طالس|فراشة|وضعية|معامل|تناسب|متصالب|تكبير|تصغير/,
  own: {
    [K2]: /الرابع|الجداء|نسبتين فيهما/,
    [K3]: /متساوية|توازي|متوازي/,
    [K4]: /k\s*[<>]|يحوّل/,
  },
});

const run = (reducer, spec, s, actions) => actions.reduce((acc, a) => reducer(spec, acc, a), s);
const lay = (text) => [{ type: 'type', text }, { type: 'lay' }];

describe('📐 `plan` on the lesson’s numbers — the false procedures are refused where he makes them', () => {
  it('round 1 is HIS first course: SB = 90, BM = 10, BC = 99 → a cut gives SM = 80, and 88 fits', () => {
    const s = initPlan(PLAN_INQUIRY);
    expect(toolsOf(s).map((t) => t.id)).toEqual(['VB-MB']);
    expect(roundFig(PLAN_INQUIRY, 0).fig.len.MN).toBe(write(over(times('99', '80'), '90')));
  });

  it('the piece (11), the difference (89) and the ratio upside down (111,375) are laid with a gap or an overhang', () => {
    const base = run(planReducer, PLAN_INQUIRY, initPlan(PLAN_INQUIRY), [
      { type: 'tool', id: 'VB-MB' },
      { type: 'pick', card: 'VB' },
      { type: 'pick', card: 'BC' },
    ]);
    const piece = write(over(times('99', '10'), '90'));
    const inverted = write(over(times('99', '90'), '80'));
    expect([piece, inverted]).toEqual(['11', '111,375']);
    for (const [typed, fact] of [
      [piece, 'gap'],
      ['89', 'overhang'],
      [inverted, 'overhang'],
    ]) {
      const s = run(planReducer, PLAN_INQUIRY, base, lay(typed));
      expect(s.laid.fact, typed).toBe(fact);
    }
  });

  it('a card with two « ؟ » refuses itself: the second ratio of HIS course holds SN and SC, neither given', () => {
    const s = planReducer(PLAN_INQUIRY, initPlan(PLAN_INQUIRY), { type: 'pick', card: 'VC' });
    expect(unknownsOf(initPlan(PLAN_INQUIRY), CARDS[1])).toBe(2);
    expect(s.refused).toBe('VC');
  });

  it('the whole experiment: a cut, two joins, a side rebuilt then cut — the result writes his rule, the forge takes it', () => {
    const s = run(planReducer, PLAN_INQUIRY, initPlan(PLAN_INQUIRY), [
      { type: 'tool', id: 'VB-MB' },
      { type: 'pick', card: 'VB' },
      { type: 'pick', card: 'BC' },
      ...lay('88'),
      { type: 'next' },
      { type: 'tool', id: 'VM+MB' },
      { type: 'pick', card: 'VB' },
      { type: 'pick', card: 'BC' },
      ...lay('63'),
      { type: 'next' },
      { type: 'tool', id: 'VN+NC' },
      { type: 'pick', card: 'VC' },
      { type: 'pick', card: 'BC' },
      ...lay('81'),
      { type: 'next' },
      { type: 'tool', id: 'VN+NC' },
      { type: 'pick', card: 'VB' },
      { type: 'pick', card: 'VC' },
      ...lay('12'),
      { type: 'next' },
    ]);
    expect(s.done).toBe(true);
    const result = planResult(s);
    expect(result.rows.map((r) => r.fact)).toEqual(['fits', 'fits', 'fits', 'fits']);
    const out = FORGES[K2].fromInquiry(result);
    expect(FORGES[K2].isTheRule(out.rule)).toBe(true);
    expect(out.rows.every((c) => c.held)).toBe(true);
  });
});

describe('🦋 `halfturn` — the turned side lands straight on the parallel pair, crooked on the other', () => {
  it('round 1 is HIS river, whole: SE 9, SA 72, ER 52, AF 416 — SR = √2785, SF = 8√2785; only the measured lengths drawn', () => {
    const river = HALFTURN_INQUIRY.rounds[0].fig;
    expect(river.names).toEqual({ V: 'S', M: 'E', B: 'A', N: 'R', C: 'F' });
    expect(river.len).toEqual({ VM: '9', VB: '72', VN: '√2785', VC: '8√2785', MN: '52', BC: '416' });
    expect(river.show).toEqual(['VM', 'VB', 'MN', 'BC']);
  });
  it('the parallel pair (k = 7/10) holds its chain, the crooked one (PQ = 92) does not; the point always lands on its own line', () => {
    expect(HALFTURN_INQUIRY.rounds.map((r) => chain(r.fig))).toEqual([true, true, false]);
    let s = initHalfturn(HALFTURN_INQUIRY);
    for (const guess of ['B', 'C', 'B']) {
      s = halfturnReducer(HALFTURN_INQUIRY, s, { type: 'predict', line: guess });
      for (let i = 0; i < 6; i += 1) s = halfturnReducer(HALFTURN_INQUIRY, s, { type: 'turn', d: 1 });
      expect(s.rows.at(-1)).toMatchObject({ landed: 'B', right: guess === 'B' });
      s = halfturnReducer(HALFTURN_INQUIRY, s, { type: 'next' });
    }
    expect(s.done).toBe(true);
    const rows = FORGES[K3].fromInquiry(halfturnResult(s)).rows;
    expect(rows.map((c) => c.held)).toEqual([true, true, false]);
    expect(rows[0].head).toBe('النهر');
  });
});

describe('🔍 `scale` — the frame covers, goes beyond, falls inside', () => {
  it('6/5 fed AMN covers ABC; fed ABC goes beyond; 1/2 falls inside, 5/6 brings ABC back; × k gives the perimeter 138', () => {
    let s = initScale(SCALE_INQUIRY);
    expect(s.stage).toBe('fact');
    s = scaleReducer(SCALE_INQUIRY, s, { type: 'next' });
    s = run(scaleReducer, SCALE_INQUIRY, s, [{ type: 'say', v: 'larger' }, { type: 'feed' }]);
    expect(s.copy.image).toBe('exact');
    s = run(scaleReducer, SCALE_INQUIRY, s, [{ type: 'next' }, { type: 'say', v: 'smaller' }, { type: 'feed' }]);
    expect(s.copy.image).toBe('outside');
    s = run(scaleReducer, SCALE_INQUIRY, s, [
      { type: 'next' },
      { type: 'frac', part: 'n', text: '1' },
      { type: 'frac', part: 'd', text: '2' },
      { type: 'feed' },
    ]);
    expect(s.copy.image).toBe('inside');
    s = run(scaleReducer, SCALE_INQUIRY, s, [
      { type: 'next' },
      { type: 'frac', part: 'n', text: '5' },
      { type: 'frac', part: 'd', text: '6' },
      { type: 'feed' },
    ]);
    expect(s.copy.image).toBe('exact');
    s = scaleReducer(SCALE_INQUIRY, s, { type: 'next' });
    const choices = perimeterChoices(SCALE_INQUIRY, 'small', '6/5');
    expect(choices).toEqual({ times: '138', plus: '116,2', times3: '414' });
    s = run(scaleReducer, SCALE_INQUIRY, s, [{ type: 'choose', v: 'times' }, { type: 'feed' }, { type: 'next' }]);
    expect(s.done).toBe(true);
    const rows = FORGES[K4].fromInquiry(scaleResult(s)).rows;
    expect(rows.map((c) => [c.one, c.x, c.held])).toEqual([
      ['big', '1/36', true],
      ['small', '6/5', true],
      ['big', '6/5', false],
      ['big', '1/2', false],
      ['big', '5/6', true],
    ]);
  });

  it('the capstone’s fact lines are true: 99 × 1/36 = 2,75 and 90 × 1/36 = 2,5', () => {
    expect(write(times('99', '1/36'))).toBe('2,75');
    expect(write(times('90', '1/36'))).toBe('2,5');
  });
});

describe('each experiment renders whole on its lesson’s spec', () => {
  it.each(Object.entries(SPECS))('%s', (_, spec) => {
    const html = renderToString(createElement(Inquiry, { spec, game: { audio: { play() {} } }, onDone() {} }));
    expect(html).toContain(`data-iq="${spec.kind}"`);
    expect(html).not.toMatch(/undefined|NaN/);
  });
});
