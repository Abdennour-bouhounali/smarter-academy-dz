import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import i18n from '../../../../i18n';
import SignMachine, { discoveryOptions, calcText } from './SignMachine';
import { LEVELS } from '../levels';
import * as L from '../logic/signMachine';

const RAW = /manipulation\.[a-zA-Z]/;
const html = (props) => renderToString(<SignMachine {...props} />);
const text = (out) => out.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[⁦⁩]/g, '').replace(/\s+/g, ' ');
const k = (key, o) => i18n.t(`lesson:manipulation.signMachine.${key}`, o);
const LV = LEVELS['sign-machine'];
const cases = { beginner: { ...LV.beginner.numbers, level: 'beginner' }, advanced: { ...LV.advanced.numbers, level: 'advanced' } };
const prose = (out) => text(out.replace(/<span class="katex[\s\S]*?<\/span><\/span><\/span>/g, ' ').replace(/<math[\s\S]*?<\/math>/g, ' '));

describe('sign-machine — rendu', () => {
  for (const [name, props] of Object.entries(cases)) {
    it(`${name}: the glance, nine columns, the factor card, the free card; no raw key, no Latin prose`, () => {
      const out = html(props);
      const hands = name === 'beginner' ? ['data-sm-knob', 'role="slider"', 'data-sm-less', 'data-sm-more'] : ['data-sm-cards'];
      for (const m of ['data-sign-machine', 'data-sm-glance', 'data-sm-board', 'data-sm-factor', ...hands, 'data-sm-free', 'data-sm-verdict=""']) expect(out).toContain(m);
      expect((out.match(/data-sm-col=/g) ?? []).length).toBe(9);
      expect(out).not.toContain('data-sm-next');
      expect(out).not.toContain('data-sm-formal');
      expect(out).not.toMatch(RAW);
      expect(out).not.toContain('{{');
      const words = (prose(out).match(/[A-Za-z]{2,}/g) ?? []).filter((w) => !['a', 'b'].includes(w));
      expect(words).toEqual([]);
    });
  }

  it('beginner: only the column 4 is lit, the four negative columns are locked « ؟ »; the first factor is −3', () => {
    const out = html(cases.beginner);
    expect((out.match(/data-lit="true"/g) ?? []).length).toBe(1);
    expect(out).toMatch(/data-sm-col="4" data-lit="true"[^>]*data-product="-12"/);
    expect((out.match(/data-locked="true"/g) ?? []).length).toBe(4);
    expect(out).toContain('data-sm-a-value="-3"');
    expect(out).not.toContain('data-sm-a=""'); // le signe de a n'est pas à la main en مبتدئ
    expect(out).not.toContain('data-sm-gap=');
  });

  it('advanced opens on the prediction cards of a1 (4 cards); the knob is disabled', () => {
    const out = html(cases.advanced);
    for (const c of ['8', '-8', '-6', '-2']) expect(out).toContain(`data-sm-card="${c}"`);
    expect(out).toMatch(/aria-disabled="true"[^>]*data-sm-knob/);
  });

  it('opens on its CONTEXT then ONE question that names the goal (§17.9) — no visible title', () => {
    const out = html(cases.beginner);
    expect(out).toContain('data-lab-context');
    expect(out).toContain('data-lab-question');
    const t = text(out);
    const q = k('question.fill', { from: '4', to: '0' });
    expect(t).toContain(q);
    expect(t.indexOf(k('context.machine').slice(0, 20))).toBeLessThan(t.indexOf(q));
    expect(out).toContain('class="sr-only"');
  });

  it('says each thing ONCE: the gesture line is the idle verdict, not repeated in a hint', () => {
    const t = text(html(cases.beginner));
    expect(t.split(k('idle.move')).length - 1).toBe(1);
    for (const h of [0, 1, 2]) expect(k(`hints.${h}`)).not.toContain('اسحب');
  });

  it('the coach never states the rule; a wrong card never shows the answer', () => {
    for (const id of ['grab', 'cards', 'sign', 'try', 'next']) expect(k(`coach.${id}`)).not.toMatch(/موجب|سالب|الإشارة|جداء|\\times/);
    expect(k('v.predictWrong', { pick: '−3' })).not.toMatch(/\{\{|calc/);
  });

  it('calcText: negative factors in brackets, a real minus, never −0', () => {
    expect(calcText(-3, -1)).toBe('(−3) × (−1) = 3');
    expect(calcText(-3, 0)).toBe('(−3) × 0 = 0');
    expect(calcText(2, -3)).toBe('2 × (−3) = −6');
  });

  it('the discovery: one correct option, the two others refuted with the student’s columns', () => {
    for (const lv of ['beginner', 'advanced']) {
      const opts = discoveryOptions(L.init(LV[lv].numbers), k);
      expect(opts.filter((o) => o.correct).length).toBe(1);
      expect(opts.filter((o) => o.why).length).toBe(2);
    }
  });
});
