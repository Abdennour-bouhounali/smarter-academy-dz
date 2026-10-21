import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import i18n from '../../../../i18n';
import EqualityLanes, { discoveryOptions } from './EqualityLanes';
import { LEVELS } from '../levels';
import * as L from '../logic/equalityLanes';

const RAW = /manipulation\.[a-zA-Z]/;
const html = (props) => renderToString(<EqualityLanes {...props} />);
const text = (out) => out.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[⁦⁩]/g, '').replace(/\s+/g, ' ');
const prose = (out) => text(out.replace(/<span class="katex[\s\S]*?<\/span><\/span><\/span>/g, ' ').replace(/<math[\s\S]*?<\/math>/g, ' '));
const k = (key, o) => i18n.t(`lesson:manipulation.equalityLanes.${key}`, o);
const LV = LEVELS['equality-lanes'];

describe('equality-lanes — rendu', () => {
  for (const level of ['beginner', 'advanced']) {
    it(`${level} : la vue d'ensemble, les deux coureurs, les commandes ; ni clé brute ni prose latine`, () => {
      const out = html({ ...LV[level].numbers, level });
      expect(out).toContain('data-equality-lanes');
      expect(out).toContain('data-el-glance');
      expect(out.match(/data-el-runner="/g)?.length).toBe(2);
      for (const hook of ['data-el-ops', 'data-el-knob', 'role="slider"', 'data-el-whos', 'data-el-apply', 'data-el-undo', 'data-el-readout', 'data-el-free', 'data-el-guide']) expect(out, hook).toContain(hook);
      expect(out.match(/data-el-op="/g)?.length).toBe(4);
      expect(out.match(/data-el-who="/g)?.length).toBe(3);
      expect(out).toContain('data-el-verdict=""');
      expect(out).not.toContain('data-el-next');
      expect(out).not.toContain('data-el-formal');
      expect(out).not.toMatch(RAW);
      expect(out).not.toContain('{{');
      const words = (prose(out).match(/[A-Za-z]{2,}/g) ?? []).filter((w) => !['a', 'b', 'c', 'x'].includes(w));
      expect(words).toEqual([]);
    });
  }

  it('ouvre sur son CONTEXTE puis UNE question qui nomme le but (§17.9), sans titre visible', () => {
    const out = html({ ...LV.beginner.numbers, level: 'beginner' });
    expect(out).toContain('data-lab-context');
    expect(out).toContain('data-lab-question');
    const t = text(out);
    expect(t.indexOf(k('legend.left'))).toBeGreaterThan(t.indexOf('خفيّ'));
  });

  it('dit chaque chose UNE fois : le geste n\'est écrit que dans la ligne d\'attente', () => {
    const t = text(html({ ...LV.beginner.numbers, level: 'beginner' }));
    expect(t.split('نفّذ').length - 1).toBeLessThanOrEqual(3);
  });

  it('les réfutations de la découverte citent SES essais', () => {
    let s = L.init(LV.beginner.numbers);
    s = L.apply(L.setC(s, -2));
    s = L.apply(L.setWho(L.setC(L.nextTask(s), 4), 'left'));
    const opts = discoveryOptions(s, k);
    expect(opts.filter((o) => o.correct)).toHaveLength(1);
    const wrong = opts.filter((o) => !o.correct).map((o) => renderToString(<span>{o.why}</span>));
    expect(wrong.join(' ')).toContain('سلمى وحدها');
  });
});
