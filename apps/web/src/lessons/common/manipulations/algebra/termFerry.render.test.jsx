import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import i18n from '../../../../i18n';
import TermFerry, { discoveryOptions } from './TermFerry';
import { LEVELS } from '../levels';
import * as L from '../logic/termFerry';

const RAW = /manipulation\.[a-zA-Z]/;
const html = (props) => renderToString(<TermFerry {...props} />);
const text = (out) => out.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[⁦⁩]/g, '').replace(/\s+/g, ' ');
const prose = (out) => text(out.replace(/<span class="katex[\s\S]*?<\/span><\/span><\/span>/g, ' ').replace(/<math[\s\S]*?<\/math>/g, ' '));
const k = (key, o) => i18n.t(`lesson:manipulation.termFerry.${key}`, o);
const LV = LEVELS['term-ferry'];

describe('term-ferry — rendu', () => {
  for (const level of ['beginner', 'advanced']) {
    it(`${level} : la vue d'ensemble, les rives, les caisses, les quais et « جرّب أعدادك » ; ni clé brute ni prose latine`, () => {
      const out = html({ ...LV[level].numbers, level });
      expect(out).toContain('data-term-ferry');
      expect(out).toContain('data-tf-glance');
      expect(out.match(/data-tf-bank="/g)?.length).toBe(2);
      expect(out.match(/data-tf-dock="/g)?.length).toBe(4);
      expect(out).toContain('data-tf-crate=');
      for (const hook of ['data-tf-paper', 'data-tf-divide', 'data-tf-stepper', 'data-tf-divide-go', 'data-tf-undo', 'data-tf-check', 'data-tf-free', 'data-tf-verdict=""']) expect(out, hook).toContain(hook);
      expect(out).not.toContain('data-tf-next');
      expect(out).not.toContain('data-tf-formal');
      expect(out).not.toMatch(RAW);
      expect(out).not.toContain('{{');
      const words = (prose(out).match(/[A-Za-z]{2,}/g) ?? []).filter((w) => !['a', 'x', 'n'].includes(w));
      expect(words).toEqual([]);
    });
  }

  it('ouvre sur son CONTEXTE puis UNE question qui nomme le but (§17.9)', () => {
    const out = html({ ...LV.beginner.numbers, level: 'beginner' });
    expect(out).toContain('data-lab-context');
    expect(out).toContain('data-lab-question');
  });

  it('les réfutations de la découverte citent SES essais', () => {
    let s = L.init(LV.beginner.numbers);
    s = L.move(s, 'R:x', false);
    s = L.move(s, 'R:x', true);
    const opts = discoveryOptions(s, false, k);
    expect(opts.filter((o) => o.correct)).toHaveLength(1);
    const wrong = opts.filter((o) => !o.correct).map((o) => renderToString(<span>{o.why}</span>)).join(' ');
    expect(wrong).toContain('الحلّ الخفيّ');
    const adv = discoveryOptions(L.init(LV.advanced.numbers), true, k);
    expect(adv.filter((o) => o.correct)).toHaveLength(1);
  });
});
