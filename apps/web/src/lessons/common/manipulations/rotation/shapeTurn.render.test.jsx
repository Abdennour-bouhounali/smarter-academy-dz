import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import ShapeTurn from './ShapeTurn';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * shape-turn se rend dans ses deux scènes (la rosace de zellige, la طريقة p. 155) seul et dans un workspace, à plat ou
 * par `numbers`, sans clé i18n brute, sans interpolation oubliée, sans un mot latin hors des îlots — et SANS la réponse
 * sur le premier écran : ni « متعامدان », ni √41 = BD, ni W(2 ; 4).
 */
const RAW = /manipulation\.[a-zA-Z]/;
const clean = (html) => {
  expect(html).not.toMatch(RAW);
  expect(html).not.toContain('{{');
  expect(html).not.toMatch(/\b(undefined|NaN|null)\b/);
};

describe('shape-turn — rendu', () => {
  it('rosette (beginner) : le pétale, la feuille épinglée, la poignée, le mors, les jauges égales, pas encore de copie', () => {
    const html = renderToString(<ShapeTurn {...LEVELS['shape-turn'].beginner.numbers} />);
    expect(html).toContain('data-shape-turn');
    expect(html).toContain('data-mode="rosette"');
    expect(html).toContain('data-world="zellige"');
    expect(html).toContain('data-st-glance');
    expect(html).toContain('data-st-handle="0"');
    expect(html).toContain('role="slider"');
    expect(html).toContain('data-st-stretch="10"');
    expect(html).toContain('data-st-stamp');
    expect(html).toContain('data-st-sheet');
    expect(html).toContain('data-st-verdict="start"');
    expect(html).toContain('data-deco="zellige"');
    expect(html).toContain('data-st-claims-closed');
    expect(html).not.toContain('data-st-copy=');
    expect(html).not.toContain('data-st-claims=');
    clean(html);
  });

  it('prove (advanced) : OAB, OCD, [AC] et [BD] non posés, aucune conclusion affichée', () => {
    const html = renderToString(<ShapeTurn numbers={LEVELS['shape-turn'].advanced.numbers} />);
    expect(html).toContain('data-mode="prove"');
    expect(html).toContain('data-st-prove-figure');
    expect(html).toContain('data-st-seg="AC"');
    expect(html).toContain('data-landed="false"');
    expect(html).not.toContain('data-st-stamp');
    expect(html).not.toContain('data-st-center-open');
    expect(html).not.toContain('متعامدان');
    clean(html);
  });

  it('dans un workspace : les deux niveaux montés, ids SVG distincts (useId)', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="beginner" levels={{
        beginner: () => <ShapeTurn level="beginner" numbers={LEVELS['shape-turn'].beginner.numbers} />,
        advanced: () => <ShapeTurn level="advanced" numbers={LEVELS['shape-turn'].advanced.numbers} />,
      }} />,
    );
    expect(html).toContain('data-mode="rosette"');
    expect(html).toContain('data-mode="prove"');
    const ids = [...html.matchAll(/<pattern id="([^"]+)"/g)].map((x) => x[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    clean(html);
  });
});
