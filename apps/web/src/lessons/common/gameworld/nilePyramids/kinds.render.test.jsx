/**
 * The experiment screens and the forge parts rendered without a DOM: their hooks, their words (no rule named), and no
 * fraction written « p/q » as text (defects D41, D47).
 */
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import Inquiry from './Inquiry';
import { PlanView } from './InquiryPlan';
import { HalfturnView } from './InquiryHalfturn';
import { ScaleView } from './InquiryScale';
import { Mirror, Line, beats, FORGE_PARTS } from './forgeParts';
import { initPlan, planReducer } from './plan';
import { initHalfturn, halfturnReducer } from './halfturn';
import { initScale, scaleReducer } from './scale';
import { thalesCase } from './ruleForge';
import { PLAN_SPEC, HALFTURN_SPEC, SCALE_SPEC } from './test/specs';

globalThis.window = globalThis.window ?? {};
const noop = () => {};
const act = new Proxy({}, { get: () => noop });
const plain = (html) => html.replace(/<annotation[^>]*>.*?<\/annotation>/g, '').replace(/<[^>]+>/g, ' ');
const RULE_WORDS = /طالس|فراشة|معامل|متناسب|يوازي|متوازي/;

describe('the experiments on screen', () => {
  it('the dispatcher mounts each kind, and refuses an unknown one', () => {
    for (const spec of [PLAN_SPEC, HALFTURN_SPEC, SCALE_SPEC]) {
      const out = renderToString(<Inquiry spec={spec} game={null} onDone={noop} />);
      expect(out).toContain(`data-iq="${spec.kind}"`);
      expect(plain(out)).not.toMatch(RULE_WORDS);
    }
    expect(() => renderToString(<Inquiry spec={{ kind: 'nope' }} onDone={noop} />)).toThrow();
  });

  it('plan: its three cards, a refused card, a join and a course laid', () => {
    let s = initPlan(PLAN_SPEC);
    s = planReducer(PLAN_SPEC, s, { type: 'pick', card: 'VC' });
    let out = renderToString(<PlanView spec={PLAN_SPEC} state={s} act={act} />);
    for (const c of ['VB', 'VC', 'BC']) expect(out).toContain(`data-iq-card="${c}"`);
    expect(out).toContain('data-iq-refused="VC"');
    expect(out).toContain('data-iq-join="VB-MB"');
    s = [
      { type: 'pick', card: 'VB' },
      { type: 'pick', card: 'BC' },
      { type: 'type', text: '11' },
      { type: 'lay' },
    ].reduce((acc, a) => planReducer(PLAN_SPEC, acc, a), s);
    out = renderToString(<PlanView spec={PLAN_SPEC} state={s} act={act} />);
    expect(out).toContain('data-iq-laid="gap"');
    expect(out).toContain('data-iq-fact="gap"');
    expect(out).toContain('data-geo-figure');
  });

  it('halfturn: the two lines to predict, the turn, then the landing with its gauge', () => {
    let s = initHalfturn(HALFTURN_SPEC);
    let out = renderToString(<HalfturnView spec={HALFTURN_SPEC} state={s} act={act} />);
    expect(out).toContain('data-iq-predict="B"');
    expect(out).toContain('data-iq-predict="C"');
    s = halfturnReducer(HALFTURN_SPEC, s, { type: 'predict', line: 'B' });
    out = renderToString(<HalfturnView spec={HALFTURN_SPEC} state={s} act={act} />);
    expect(out).toContain('data-iq-turn="1"');
    for (let k = 0; k < 6; k += 1) s = halfturnReducer(HALFTURN_SPEC, s, { type: 'turn', d: 1 });
    out = renderToString(<HalfturnView spec={HALFTURN_SPEC} state={s} act={act} />);
    expect(out).toContain('data-iq-landed="B"');
    expect(out).toContain('data-rf-aligned="yes"');
  });

  it('scale: the fact round, the prediction, the dial set by hand, the perimeters', () => {
    let s = initScale(SCALE_SPEC);
    let out = renderToString(<ScaleView spec={SCALE_SPEC} state={s} act={act} />);
    expect(out).toContain('data-iq-stage="fact"');
    s = scaleReducer(SCALE_SPEC, s, { type: 'next' });
    out = renderToString(<ScaleView spec={SCALE_SPEC} state={s} act={act} />);
    for (const v of ['larger', 'exact', 'smaller']) expect(out).toContain(`data-iq-predict="${v}"`);
    s = scaleReducer(SCALE_SPEC, scaleReducer(SCALE_SPEC, s, { type: 'say', v: 'exact' }), { type: 'feed' });
    out = renderToString(<ScaleView spec={SCALE_SPEC} state={s} act={act} />);
    expect(out).toContain('data-iq-image="exact"');
    s = { ...initScale(SCALE_SPEC), i: 3, stage: 'set', k: null };
    out = renderToString(<ScaleView spec={SCALE_SPEC} state={s} act={act} />);
    expect(out).toContain('data-iq-kn');
    s = { ...initScale(SCALE_SPEC), i: 4, stage: 'perimeter', k: '6/5' };
    out = renderToString(<ScaleView spec={SCALE_SPEC} state={s} act={act} />);
    expect(out).toContain('data-iq-choose="times3"');
    expect(plain(out)).not.toMatch(/\d+\/\d+/);
  });
});

describe('the forge parts draw through GeoFigure', () => {
  const c = thalesCase({
    names: { V: 'A', M: 'M', B: 'B', N: 'N', C: 'C' },
    len: { VM: '14', VB: '63', VN: '16', VC: '72', MN: '18', BC: '81' },
  });
  it('the mirror shows the figure, then the gauge with its marks together', () => {
    expect(renderToString(<Mirror c={c} stage="ask" />)).not.toContain('data-rf-gauge');
    const out = renderToString(<Mirror c={c} stage="done" />);
    expect(out).toContain('data-geo-figure');
    expect(out).toContain('data-rf-aligned="yes"');
    expect(out).toContain('data-rf-kind="aligned"');
  });
  it('a line of evidence and the parts object', () => {
    const out = renderToString(<Line c={{ ...c, head: 'القناة', tag: '⭐' }} />);
    expect(out).toContain('data-np-line="aligned"');
    expect(beats()).toBe(3);
    expect(Object.keys(FORGE_PARTS)).toEqual(['Mirror', 'Line', 'beats', 'Inquiry']);
  });
});
