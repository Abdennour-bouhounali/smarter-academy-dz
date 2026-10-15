import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import i18n from '../../../../i18n';
import FairShare from './FairShare';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

const RAW = /manipulation\.[a-zA-Z]/;
const html = (props) => renderToString(<FairShare {...props} />);
const text = (out) => out.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const say = (key, o) => i18n.t(`lesson:manipulation.fairShare.${key}`, o);
const attrs = (out, name) => [...out.matchAll(new RegExp(`${name}="([^"]*)"`, 'g'))].map((m) => m[1]);

describe('fair-share — rendu', () => {
  it('beginner (canteen): 3 loaves, 4 kids, four rulers with the cut one locked, no verdict yet', () => {
    const out = html({ ...LEVELS['fair-share'].beginner.numbers });
    expect(out).toContain('data-fair-share');
    expect(out).toContain('data-scene="canteen"');
    expect(out).toContain('data-order="3/4"');
    expect(attrs(out, 'data-fs-loaf')).toHaveLength(3);
    expect(attrs(out, 'data-fs-kid')).toHaveLength(4);
    expect(attrs(out, 'data-fs-ruler')).toEqual(['d1', 'd2', 'd3', 'cut']);
    expect(out).toMatch(/data-fs-ruler="cut"[^>]*disabled|disabled=""[^>]*data-fs-ruler="cut"/);
    expect(out).toContain('role="slider"');
    expect(out).toContain('data-fs-verdict=""');
    expect(out).not.toContain('data-fs-next');
    expect(out).not.toContain('data-fs-formal');
    expect(out).not.toMatch(RAW);
    expect(out).not.toContain('{{');
    expect(text(out).match(/[A-Za-z]{2,}/g) ?? []).toEqual([]);
  });
  it('advanced (family, نشاط 1): 5 loaves for 6 people, the textbook sentence', () => {
    const out = html({ ...LEVELS['fair-share'].advanced.numbers });
    expect(out).toContain('data-order="5/6"');
    expect(attrs(out, 'data-fs-kid')).toHaveLength(6);
    expect(text(out)).toContain('أرادت فاطمة وزميلتها مريم تقسيم 5 أرغفة متماثلة على 6 أشخاص بالتساوي.');
    expect(out).not.toMatch(RAW);
  });
  it('inside a workspace: one selector', () => {
    const out = renderToString(<ManipulationWorkspace levels={{
      beginner: () => <FairShare level="beginner" {...LEVELS['fair-share'].beginner.numbers} />,
      advanced: () => <FairShare level="advanced" {...LEVELS['fair-share'].advanced.numbers} />,
    }} />);
    expect((out.match(/data-manipulation-levels-selector/g) ?? []).length).toBe(1);
  });
  it('every string exists in Arabic, fully interpolated', () => {
    const o = { loaves: '3 أرغفة', kids: '4 أطفال', per: '4 قطع', pieces: '3 قطع', share: 'x', total: 't', have: 'h', gap: 'g', x: '0,66', a: 2, b: 3, dec: '0,75', below: '0,66', above: '0,67', order: '2 ÷ 3', word: 'w' };
    const keys = ['title', 'question', 'instruction', 'rulerLabel', 'handle', 'sceneAria', 'next.title', 'next.text', 'next.button', 'back', 'trial', 'trialsTitle', 'explanation',
      'context.canteen', 'context.family', 'discovery.prompt', 'discovery.right', 'discovery.dec', 'discovery.inv', 'discovery.whyDecNone', 'formal.decimal', 'formal.approx', 'formal.rule',
      'read.share', 'read.total', 'ruler.decAria', 'ruler.cutAria', 'step.less', 'step.more', 'coach.handle', 'coach.again', 'coach.rulers', 'coach.next',
      ...['dec', 'cut'].flatMap((w) => ['exact', 'short', 'over'].map((kd) => `v.${w}.${kd}`)),
      ...['short', 'over', 'exact'].flatMap((kd) => [`discovery.whyDec.${kd}`, `discovery.whyInv.${kd}`, `kind.${kd}`]), 'hints.0', 'hints.1', 'hints.2'];
    for (const key of keys) {
      const s = say(key, o);
      expect(s, key).not.toMatch(RAW);
      expect(s, key).not.toContain('{{');
      expect(/[؀-ۿ]/.test(s), key).toBe(true);
    }
    expect(say('discovery.right')).not.toMatch(/\d|\{\{/);
    for (let i = 0; i < 3; i += 1) expect(say(`hints.${i}`)).not.toMatch(/\d/);
  });
  it('says each thing ONCE and opens on CONTEXT then ONE question, no title banner', () => {
    for (const lv of ['beginner', 'advanced']) {
      const out = html({ ...LEVELS['fair-share'][lv].numbers });
      expect(out).not.toContain('data-manipulation-mission');
      expect(out).toMatch(/<h3 class="sr-only">/);
      expect(out.split(say('instruction')).length - 1).toBe(1);
      const t = text(out);
      expect(t.split(say('question')).length - 1).toBe(1);
      expect(say('question')).toMatch(/حتى/);
      expect(say('question')).not.toMatch(/اسحب|كسر|÷/);
    }
  });
  it('counted nouns agree', () => {
    expect([1, 2, 3, 11, 100].map((count) => say('loaves', { count }))).toEqual(['رغيف واحد', 'رغيفان', '3 أرغفة', '11 رغيفًا', '100 رغيف']);
    expect([1, 2, 6].map((count) => say('persons', { count }))).toEqual(['شخص واحد', 'شخصان', '6 أشخاص']);
  });
});
