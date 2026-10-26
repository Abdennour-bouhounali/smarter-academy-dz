import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import i18n from '../../../../i18n';
import ScoopScale, { discoveryOptions } from './ScoopScale';
import { LEVELS } from '../levels';
import * as L from '../logic/scoopScale';

const RAW = /manipulation\.[a-zA-Z]/;
const html = (props) => renderToString(<ScoopScale {...props} />);
const text = (out) => out.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&(lt|gt|amp);/g, ' ').replace(/[⁦⁩]/g, '').replace(/\s+/g, ' ');
const prose = (out) => text(out.replace(/<span class="katex[\s\S]*?<\/span><\/span><\/span>/g, ' ').replace(/<math[\s\S]*?<\/math>/g, ' '));
const k = (key, o) => i18n.t(`lesson:manipulation.scoopScale.${key}`, o);
const LV = LEVELS['scoop-scale'];

describe('scoop-scale — rendu', () => {
  for (const level of ['beginner', 'advanced']) {
    it(`${level} : la vue d'ensemble, l'écran, la louche, la bande, les commandes ; ni clé brute ni prose latine`, () => {
      const out = html({ ...LV[level].numbers, level });
      expect(out).toContain('data-scoop-scale');
      expect(out).toContain('data-ss-glance');
      for (const hook of ['data-ss-lcd', 'data-ss-scoop', 'data-ss-pan', 'role="slider"', 'data-ss-strip', 'data-ss-pill', 'data-ss-deliver', 'data-ss-less', 'data-ss-more', 'data-ss-free', 'data-ss-free-reading', 'data-ss-free-a', 'data-ss-free-b']) expect(out, hook).toContain(hook);
      expect(out).toContain('data-ss-verdict=""');
      expect(out).not.toContain('data-ss-next');
      expect(out).not.toContain('data-ss-formal');
      expect(out).not.toMatch(RAW);
      expect(out).not.toContain('{{');
      const words = (prose(out).match(/[A-Za-z]{2,}/g) ?? []).filter((w) => !['kg', 'x'].includes(w));
      expect(words).toEqual([]);
    });
  }

  it('مبتدئ : l\'écran lit la masse de départ (1,0) avec son ARRONDI ; le lampe n\'existe pas', () => {
    const out = html({ ...LV.beginner.numbers, level: 'beginner' });
    expect(out).toContain('data-reading="1,0"');
    expect(out).not.toContain('data-ss-lamp');
    expect(out).not.toContain('data-ss-ref');
  });

  it('متقدم : la tâche piège porte le sachet, la lampe et le repère 2/7 sur la bande', () => {
    const out = html({ ...LV.advanced.numbers, level: 'advanced', tasks: [LV.advanced.numbers.tasks[2]] });
    expect(out).toContain('data-ss-lamp');
    expect(out).toContain('data-ss-ref');
    expect(out).toContain('data-reading="0,250"');
  });

  it('ouvre sur son CONTEXTE puis UNE question qui nomme le but (§17.9), sans titre visible', () => {
    const out = html({ ...LV.beginner.numbers, level: 'beginner' });
    expect(out).toContain('data-lab-context');
    expect(out).toContain('data-lab-question');
    const t = text(out);
    expect(t.indexOf('املأ الكيس بأقلّ كمّية')).toBeGreaterThan(t.indexOf('تطلب زبونة كيس كمّون'));
    expect(t).not.toContain('نصف');
  });

  it('dit chaque chose UNE fois : le geste de verser n\'est écrit que dans l\'aria de la louche et dans le coach', () => {
    const t = text(html({ ...LV.beginner.numbers, level: 'beginner' }));
    expect(t.split('أقلّ كمّية').length - 1).toBe(1);
  });

  it('les réfutations de la découverte citent SES masses', () => {
    let s = L.init(LV.beginner.numbers);
    s = L.deliver(L.pour(s, 25));
    s = L.nextTask(s);
    s = L.deliver(L.pour(s, 9));
    const opts = discoveryOptions(s, k);
    expect(opts.filter((o) => o.correct)).toHaveLength(1);
    const wrong = opts.filter((o) => !o.correct).map((o) => renderToString(<span>{o.why}</span>)).join(' ');
    expect(text(wrong)).toContain('1,25');
    expect(text(wrong)).toContain('1,35');
    expect(text(wrong)).toContain('1,34');
  });
});
