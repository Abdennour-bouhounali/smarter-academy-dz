import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import PolygonForge from './PolygonForge';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * polygon-forge se rend à ses DEUX niveaux (l'alvéole de ruche, l'étoile du drapeau), seul et dans un workspace, à plat ou
 * par `numbers`, sans clé i18n brute, sans interpolation oubliée, et SANS la réponse sur le premier écran : ni 60° (la
 * cellule part de 50°), ni 72°, ni 8,51 cm, ni 16,18 cm (l'étoile part de 60°, sur l'étape des sommets).
 */
const RAW = /manipulation\.[a-zA-Z]/;
const clean = (html) => {
  expect(html).not.toMatch(RAW);
  expect(html).not.toContain('{{');
  expect(html).not.toContain('undefined');
  expect(html).not.toContain('NaN');
};

describe('polygon-forge — rendu', () => {
  it('cell (beginner): the hive, A alone on the circle, α = 50°, the dial and « دوّر » — no 60° yet', () => {
    const html = renderToString(<PolygonForge {...LEVELS['polygon-forge'].beginner.numbers} />);
    expect(html).toContain('data-polygon-forge');
    expect(html).toContain('data-mode="cell"');
    expect(html).toContain('data-world="honeycomb"');
    expect(html).toContain('data-pf-glance');
    expect(html).toContain('data-pf-handle="50"');
    expect(html).toContain('role="slider"');
    expect(html).toContain('data-pf-turn');
    expect(html).toContain('data-pf-verdict="start"');
    expect(html).toContain('data-deco="honeycomb"');
    expect((html.match(/data-pf-vertex="/g) ?? []).length).toBe(1);
    expect(html).not.toContain('data-pf-readings');
    expect(html).not.toContain('60°');
    // le compteur « 0 × 50° = 0° » est UNE île LTR isolée, l'étiquette arabe hors de l'île
    expect(html).toMatch(/<span dir="ltr"[^>]*unicode-bidi:isolate[^>]*data-pf-counter-formula[^>]*>0 × 50° = 0°<\/span>/);
    clean(html);
  });

  it('star (advanced, the تحدّ): the tifo, three stage tabs (only the first open), α = 60° — 72°, 8,51 and 16,18 nowhere', () => {
    const html = renderToString(<PolygonForge numbers={LEVELS['polygon-forge'].advanced.numbers} />);
    expect(html).toContain('data-mode="star"');
    expect(html).toContain('data-world="flag-star"');
    expect(html).toContain('data-stage="forge"');
    expect((html.match(/data-pf-stage-tab="/g) ?? []).length).toBe(3);
    expect(html).toContain('data-pf-handle="60"');
    expect(html).toContain('data-deco="flag-star"');
    expect(html).not.toContain('72°');
    expect(html).not.toContain('8,51');
    expect(html).not.toContain('16,18');
    expect(html).not.toContain('data-pf-next');
    clean(html);
  });

  it('inside a workspace: both levels mounted, the تحدّ by default', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <PolygonForge level="beginner" {...LEVELS['polygon-forge'].beginner.numbers} />,
        advanced: () => <PolygonForge level="advanced" {...LEVELS['polygon-forge'].advanced.numbers} />,
      }} />,
    );
    expect(html).toContain('data-mode="cell"');
    expect(html).toContain('data-mode="star"');
    clean(html);
  });
});
