import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import i18n from '../../../../i18n';
import PinRails, { discoveryOptions, clipLine } from './PinRails';
import { LEVELS } from '../levels';
import * as L from '../logic/pinRails';

const RAW = /manipulation\.[a-zA-Z]/;
const html = (props) => renderToString(<PinRails {...props} />);
const text = (out) => out.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[⁦⁩]/g, '').replace(/\s+/g, ' ');
const prose = (out) => text(out.replace(/<span class="katex[\s\S]*?<\/span><\/span><\/span>/g, ' ').replace(/<math[\s\S]*?<\/math>/g, ' '));
const k = (key, o) => i18n.t(`lesson:manipulation.pinRails.${key}`, o);
const LV = LEVELS['pin-rails'];

describe('pin-rails — rendu', () => {
  for (const level of ['beginner', 'advanced']) {
    it(`${level} : la vue d'ensemble, le repère, les extrémités de la règle ; ni clé brute ni prose latine`, () => {
      const out = html({ ...LV[level].numbers, level });
      expect(out).toContain('data-pin-rails');
      expect(out).toContain('data-pr-glance');
      expect(out).toContain('data-pr-plane');
      for (const hook of ['data-pr-end="0"', 'data-pr-end="1"', 'data-pr-readout', 'data-pr-free', 'data-pr-verdict=""', 'data-pr-node="0"']) expect(out, hook).toContain(hook);
      expect(out).not.toContain('data-pr-next');
      expect(out).not.toContain('data-pr-formal');
      expect(out).not.toMatch(RAW);
      expect(out).not.toContain('{{');
      const words = (prose(out).match(/[A-Za-z]{2,}/g) ?? []).filter((w) => !['a', 'b', 'c', 'x', 'y', 'O'].includes(w));
      expect(words).toEqual([]);
    });
  }

  it('مبتدئ : le premier tableau a ses 4 punaises sur leurs rainures et son tableau de prix', () => {
    const out = html({ ...LV.beginner.numbers, level: 'beginner' });
    expect(out.match(/data-pr-pin="/g)?.length).toBe(4);
    expect(out).toContain('data-pr-table');
    expect(out.match(/data-placed="false"/g)?.length).toBe(4);
    expect(out).toContain('data-lab-context');
    expect(out).toContain('data-lab-question');
  });

  it('متقدم : une lecture montre la règle fixe et la punaise de lecture, sans tableau', () => {
    const out = html({ tasks: LV.advanced.numbers.tasks.slice(2), level: 'advanced' });
    expect(out).toContain('data-pr-read');
    expect(out).toContain('data-pr-rod');
    expect(out).not.toContain('data-pr-table');
  });

  it('clipLine : la droite découpée dans le cadre', () => {
    expect(clipLine(5, 0, 16, 80)).toEqual([[0, 0], [16, 80]]);
    const [p, q] = clipLine(2.5, 10, 16, 80);
    expect(p).toEqual([0, 10]); expect(q[0]).toBe(16); expect(q[1]).toBe(50);
    expect(clipLine(0, 100, 16, 80)).toBeNull();
  });

  it('les réfutations de la découverte citent SES essais', () => {
    let s = { ...L.init(LV.beginner.numbers) };
    s = [10, 30, 60, 70].reduce((st, y, c) => L.placePin(st, c, y), s);
    s = L.nextTask({ ...s, done: { 0: true } });
    s = L.setRodEnd(L.setRodEnd(s, 0, 0), 1, 1);
    s = L.setRodEnd(L.setRodEnd(s, 1, 4), 0, 1);
    const opts = discoveryOptions(s, k);
    expect(opts.filter((o) => o.correct)).toHaveLength(1);
    const wrong = opts.filter((o) => !o.correct).map((o) => renderToString(<span>{o.why}</span>)).join(' ');
    expect(wrong).toContain('10');
  });
});
