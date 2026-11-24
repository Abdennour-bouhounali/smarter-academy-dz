/**
 * The three experiments and the forge's cases, played without a browser on the plan's numbers (PYRAMIDS_WORLD_PLAN
 * §3.3–§3.6, final). These specs are EXAMPLES of the shapes a lesson's `inquiries.js` writes.
 */
import { describe, expect, it } from 'vitest';
import { initPlan, planReducer, planResult, toolsOf, unknownsOf, CARDS, hintCards } from './plan';
import { initHalfturn, halfturnReducer, rotate } from './halfturn';
import { initScale, scaleReducer, perimeterChoices } from './scale';
import { thalesCase, evidenceOf, caseId, runCase, segName } from './ruleForge';
import { gauge, points, chain } from './figure';

import { NESTED, PLAN_SPEC, HALFTURN_SPEC, SCALE_SPEC } from './test/specs';

const run = (reducer, spec, s, actions) => actions.reduce((acc, a) => reducer(spec, acc, a), s);

describe('plan « خطّة الحساب » (key 📐)', () => {
  it('round 1 is HIS course: the side SB and the piece BM give SM by a cut; 88 fits', () => {
    let s = initPlan(PLAN_SPEC);
    expect(toolsOf(s).map((t) => t.id)).toEqual(['VB-MB']);
    expect(unknownsOf(s, CARDS[0])).toBe(1);
    s = run(planReducer, PLAN_SPEC, s, [
      { type: 'tool', id: 'VB-MB' },
      { type: 'pick', card: 'VB' },
      { type: 'pick', card: 'BC' },
    ]);
    s = run(planReducer, PLAN_SPEC, s, [{ type: 'type', text: '88' }, { type: 'lay' }]);
    expect(s.laid).toMatchObject({ fact: 'fits', diff: '0' });
  });
  it('a card with two « ؟ » refuses itself; the piece 11 leaves a gap of 77, written (the mirror)', () => {
    let s = initPlan(PLAN_SPEC);
    s = planReducer(PLAN_SPEC, s, { type: 'pick', card: 'VC' });
    expect(s.refused).toBe('VC');
    expect(s.picked).toEqual([]);
    s = run(planReducer, PLAN_SPEC, s, [
      { type: 'pick', card: 'VB' },
      { type: 'pick', card: 'BC' },
      { type: 'type', text: '11' },
      { type: 'lay' },
    ]);
    expect(s.laid).toMatchObject({ fact: 'gap', diff: '77' });
    s = run(planReducer, PLAN_SPEC, s, [{ type: 'next' }, { type: 'type', text: '89' }, { type: 'lay' }]);
    expect(s.laid.fact).toBe('overhang');
    expect(hintCards(PLAN_SPEC, s)).toEqual(['BC']);
  });
  it('the whole experiment: a join, then the last round; the result carries every course and his plan', () => {
    let s = initPlan(PLAN_SPEC);
    s = run(planReducer, PLAN_SPEC, s, [
      { type: 'tool', id: 'VB-MB' },
      { type: 'pick', card: 'VB' },
      { type: 'pick', card: 'BC' },
      { type: 'type', text: '88' },
      { type: 'lay' },
      { type: 'next' },
      { type: 'tool', id: 'VM+MB' },
      { type: 'pick', card: 'VB' },
      { type: 'pick', card: 'BC' },
      { type: 'type', text: '63' },
      { type: 'lay' },
      { type: 'next' },
      { type: 'tool', id: 'VN+NC' },
      { type: 'pick', card: 'VC' },
      { type: 'pick', card: 'BC' },
      { type: 'type', text: '81' },
      { type: 'lay' },
      { type: 'next' },
    ]);
    expect(s.done).toBe(true);
    const out = planResult(s);
    expect(out.rows.map((r) => r.fact)).toEqual(['fits', 'fits', 'fits']);
    expect(out.plan).toEqual({ cards: ['VC', 'BC'], joins: ['VN+NC'] });
  });
});

describe('halfturn « نصف دورة » (key 🦋)', () => {
  it('he says where K lands, turns by 30° steps, and K lands on line (IP); the crooked one lands crooked', () => {
    let s = initHalfturn(HALFTURN_SPEC);
    s = halfturnReducer(HALFTURN_SPEC, s, { type: 'predict', line: 'C' });
    for (let k = 0; k < 6; k += 1) s = halfturnReducer(HALFTURN_SPEC, s, { type: 'turn', d: 1 });
    expect(s.stage).toBe('landed');
    expect(s.rows[0]).toMatchObject({ landed: 'B', right: false, parallel: true });
    s = run(halfturnReducer, HALFTURN_SPEC, s, [{ type: 'next' }, { type: 'predict', line: 'B' }]);
    for (let k = 0; k < 6; k += 1) s = halfturnReducer(HALFTURN_SPEC, s, { type: 'turn', d: 1 });
    expect(s.rows[1]).toMatchObject({ right: true, parallel: false });
    expect(halfturnReducer(HALFTURN_SPEC, s, { type: 'next' }).done).toBe(true);
  });
  it('the turn stops at 0° and at 180°; the half-turn carries K onto the ray of P', () => {
    let s = halfturnReducer(HALFTURN_SPEC, initHalfturn(HALFTURN_SPEC), { type: 'predict', line: 'B' });
    s = halfturnReducer(HALFTURN_SPEC, s, { type: 'turn', d: -1 });
    expect(s.angle).toBe(0);
    const P = points(HALFTURN_SPEC.rounds[0].fig);
    const k = rotate(P.K, 180);
    expect(k[0]).toBeCloseTo(35, 9);
    expect(Math.abs(k[1])).toBeLessThan(1e-9);
    expect(P.P[0]).toBeCloseTo(50, 9);
  });
});

describe('scale « آلة النسخ » (key 🔍)', () => {
  it('the capstone is a fact; 6/5 on AMN covers ABC; on ABC it goes beyond; 5/6 brings ABC back; × k is the perimeter', () => {
    let s = initScale(SCALE_SPEC);
    expect(s.stage).toBe('fact');
    s = run(scaleReducer, SCALE_SPEC, s, [{ type: 'next' }, { type: 'say', v: 'exact' }, { type: 'feed' }]);
    expect(s.copy).toMatchObject({ sides: ['24', '48', '66'], image: 'exact', perimeter: '138' });
    expect(s.rows.at(-1).right).toBe(true);
    s = run(scaleReducer, SCALE_SPEC, s, [{ type: 'next' }, { type: 'say', v: 'smaller' }, { type: 'feed' }]);
    expect(s.copy.image).toBe('outside');
    expect(s.rows.at(-1).right).toBe(false);
    s = run(scaleReducer, SCALE_SPEC, s, [
      { type: 'next' },
      { type: 'frac', part: 'n', text: '6' },
      { type: 'frac', part: 'd', text: '5' },
      { type: 'feed' },
    ]);
    expect(s.copy.image).toBe('outside');
    s = run(scaleReducer, SCALE_SPEC, s, [
      { type: 'next' },
      { type: 'frac', part: 'n', text: '5' },
      { type: 'frac', part: 'd', text: '6' },
      { type: 'feed' },
    ]);
    expect(s.copy).toMatchObject({ image: 'exact', sides: ['20', '40', '55'] });
    s = scaleReducer(SCALE_SPEC, s, { type: 'next' });
    expect(perimeterChoices(SCALE_SPEC, 'small', '6/5')).toEqual({ times: '138', plus: '116,2', times3: '414' });
    s = run(scaleReducer, SCALE_SPEC, s, [{ type: 'choose', v: 'times' }, { type: 'feed' }]);
    expect(s.rows.at(-1)).toMatchObject({ right: true, perimeter: '138' });
    expect(scaleReducer(SCALE_SPEC, s, { type: 'next' }).done).toBe(true);
  });
});

describe('a case of the forge is a Thalès figure (plan §2.3)', () => {
  const fresh = thalesCase({
    names: NESTED,
    len: { VM: '14', VB: '63', VN: '16', VC: '72', MN: '18', BC: '81' },
    head: 'new',
  });
  const old = thalesCase({
    names: { ...NESTED, M: 'P', N: 'Q' },
    len: { VM: '39', VB: '63', VN: '28', VC: '72', MN: '41', BC: '81' },
  });
  it('the new canal holds the chain, the old one does not; the pieces are added', () => {
    expect(fresh.held).toBe(true);
    expect(old.held).toBe(false);
    expect(fresh.len).toMatchObject({ MB: '49', NC: '56' });
    expect(runCase(fresh).ratios).toEqual({ VB: '2/9', VC: '2/9', BC: '2/9' });
    expect(gauge(fresh).aligned).toBe(true);
    expect(gauge(old).aligned).toBe(false);
  });
  it('the evidence keeps one row per case, his own before the mirror', () => {
    const rows = evidenceOf([fresh, { ...old, mirror: true }, fresh]);
    expect(rows.map((r) => caseId(r))).toEqual([caseId(old), caseId(fresh)]);
    expect(segName(old, 'VM')).toBe('AP');
  });
  it('the drawing puts every point at its lengths', () => {
    const P = points(fresh);
    const d = (a, b) => Math.hypot(P[a][0] - P[b][0], P[a][1] - P[b][1]);
    expect(d('B', 'C')).toBeCloseTo(81, 9);
    expect(d('M', 'N')).toBeCloseTo(18, 9);
    expect(chain(fresh)).toBe(true);
  });
});
