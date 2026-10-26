import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import i18n from '../../../../i18n';
import LoomThreads, { discoveryOptions, opText } from './LoomThreads';
import { LEVELS } from '../levels';
import * as L from '../logic/loomThreads';
import * as Lin from '@smarter-academy/core/arithmetic/linear.js';

const RAW = /manipulation\.[a-zA-Z]/;
const html = (props) => renderToString(<LoomThreads {...props} />);
const text = (out) => out.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&(lt|gt|amp);/g, ' ').replace(/[⁦⁩]/g, '').replace(/\s+/g, ' ');
const prose = (out) => text(out.replace(/<span class="katex[\s\S]*?<\/span><\/span><\/span>/g, ' ').replace(/<math[\s\S]*?<\/math>/g, ' '));
const k = (key, o) => i18n.t(`lesson:manipulation.loomThreads.${key}`, o);
const LV = LEVELS['loom-threads'];

describe('loom-threads — rendu', () => {
  for (const level of ['beginner', 'advanced']) {
    it(`${level} : la vue d'ensemble, les deux fils, les commandes ; ni clé brute ni prose latine`, () => {
      const out = html({ ...LV[level].numbers, level });
      expect(out).toContain('data-loom-threads');
      expect(out).toContain('data-lt-glance');
      for (const hook of ['data-lt-tools', 'data-lt-knob', 'role="slider"', 'data-lt-tie', 'data-lt-undo', 'data-lt-orders', 'data-lt-free', 'data-lt-beam="0"', 'data-lt-beam="1"']) expect(out, hook).toContain(hook);
      expect(out.match(/data-lt-tool="/g)?.length).toBe(2);
      expect(out).toContain('data-lt-verdict=""');
      expect(out).not.toContain('data-lt-next');
      expect(out).not.toContain('data-lt-formal');
      expect(out).not.toMatch(RAW);
      expect(out).not.toContain('{{');
      const words = (prose(out).match(/[A-Za-z]{2,}/g) ?? []).filter((w) => !['a', 'b', 'c', 'x'].includes(w));
      expect(words).toEqual([]);
    });
  }

  it('مبتدئ : deux fils (rouge et bleu) et aucun croisement au départ ; متقدم T1 : le même', () => {
    const out = html({ ...LV.beginner.numbers, level: 'beginner' });
    expect(out.match(/data-lt-thread="/g)?.length).toBe(2);
    expect(out).not.toContain('data-lt-cross');
  });

  it('ouvre sur son CONTEXTE puis UNE question qui nomme le but (§17.9), sans titre visible', () => {
    const out = html({ ...LV.beginner.numbers, level: 'beginner' });
    expect(out).toContain('data-lab-context');
    expect(out).toContain('data-lab-question');
    const t = text(out);
    expect(t.indexOf('الخيط الأحمر ينزل')).toBeGreaterThan(t.indexOf('على النول خيطان'));
  });

  it('dit chaque chose UNE fois : le geste n\'est écrit que dans la ligne d\'attente', () => {
    const t = text(html({ ...LV.beginner.numbers, level: 'beginner' }));
    expect(t.split('اربط').length - 1).toBeLessThanOrEqual(3);
  });

  it('une tâche bande se dessine : la bande peinte, la bascule, aucun fil rouge', () => {
    const out = html({ ...LV.advanced.numbers, level: 'advanced', tasks: [LV.advanced.numbers.tasks[1]] });
    expect(out).toContain('data-lt-band');
    expect(out).not.toContain('data-lt-thread="red"');
  });

  it('« × (−1/2) » dit aussi la division', () => {
    const kk = (key) => i18n.t(`lesson:manipulation.loomThreads.${key}`);
    expect(opText('nail', Lin.frac(-1, 2), kk)).toContain('÷');
    expect(opText('nail', Lin.frac(-3), kk)).not.toContain('÷');
    expect(opText('comb', Lin.frac(-4), kk)).toBe('+ (-4)'.replace('-', '−'));
  });

  it('les réfutations de la découverte citent SES essais', () => {
    let s = L.init(LV.beginner.numbers);
    s = L.tie(L.dragKnot(L.setTool(s, 'comb'), -4));
    s = L.tie(L.dragKnot(L.setTool(s, 'nail'), 2));
    const opts = discoveryOptions(s, k);
    expect(opts.filter((o) => o.correct)).toHaveLength(1);
    const wrong = opts.filter((o) => !o.correct).map((o) => renderToString(<span>{o.why}</span>)).join(' ');
    expect(text(wrong)).toContain('أزحتَ بـ −4');
    expect(text(wrong)).toContain('مدّدتَ بـ 2');
  });
});
