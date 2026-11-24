/**
 * The ARABIC words of the pyramids world (`strings.ar.js`) — the tests whose point is the wording itself. France does not
 * copy this file: its own `strings.fr.test.js` holds the same checks on its words.
 */
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import Inquiry from './Inquiry';
import { DIR, FIGURE_TEXT, KIND_TEXT, WORLD_TEXT } from './strings.ar';
import { PLAN_SPEC, HALFTURN_SPEC, SCALE_SPEC } from './test/specs';

globalThis.window = globalThis.window ?? {};
const plain = (html) => html.replace(/<annotation[^>]*>.*?<\/annotation>/g, '').replace(/<[^>]+>/g, ' ');
/** The words that would NAME a rule of the unit: Thalès, the butterfly, the ratio k, proportional, parallel. */
const RULE_WORDS = /طالس|فراشة|معامل|متناسب|يوازي|متوازي/;

describe('the Arabic words of the pyramids world', () => {
  it('the experiments name no rule on screen', () => {
    for (const spec of [PLAN_SPEC, HALFTURN_SPEC, SCALE_SPEC]) {
      const out = renderToString(createElement(Inquiry, { spec, game: null, onDone: () => {} }));
      expect(out).toContain(`data-iq="${spec.kind}"`);
      expect(plain(out)).not.toMatch(RULE_WORDS);
    }
  });

  it('read right to left; no dock name and no experiment sentence says a rule', () => {
    expect(DIR).toBe('rtl');
    for (const name of WORLD_TEXT.docks) expect(name).not.toMatch(RULE_WORDS);
    for (const k of ['plan', 'halfturn', 'scale'])
      for (const v of Object.values(KIND_TEXT[k]))
        if (typeof v === 'string') expect(v, `${k}: ${v}`).not.toMatch(RULE_WORDS);
  });

  it('a rope from the vertex is said with its own words, never the course’s', () => {
    const { line, fact } = KIND_TEXT.plan;
    expect(line.gap('2')).not.toBe(fact.gap('2'));
    expect(line.overhang('2')).toContain('$2$');
    expect(line.gap('2')).toContain('$2$');
    expect(line.fits).not.toBe(fact.fits);
  });

  it('a screen reader hears the figure’s letters', () => {
    expect(FIGURE_TEXT.butterfly('O')).toContain('O');
    expect(FIGURE_TEXT.nested('A', 'B', 'C', 'M', 'N')).toContain('ABC');
    expect(FIGURE_TEXT.nested('A', 'B', 'C', 'M', 'N')).toContain('[MN]');
    expect(FIGURE_TEXT.pair('I')).toContain('I');
  });
});
