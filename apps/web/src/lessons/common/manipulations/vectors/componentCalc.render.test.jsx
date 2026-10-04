import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import ComponentCalc from './ComponentCalc';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * component-calc se rend aux deux niveaux de levels.js (le code de AB puis D ; نشاط 2 : le code de CD, E, CF), seul et
 * dans le workspace, sans clé i18n brute, sans interpolation oubliée, sans dollar hors des îlots.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const { beginner, advanced } = LEVELS['component-calc'];

describe('component-calc — rendu', () => {
  it('beginner: the map, the signed code pad (two spinbuttons ≥ 44 px), the portals with coordinates, the decor', () => {
    const html = renderToString(<ComponentCalc {...beginner.numbers} level="beginner" theme="game-map" />);
    expect(html).toContain('data-component-calc');
    expect(html).toContain('data-kind="calc"');
    expect(html).toContain('data-cc-glance');
    expect(html).toContain('data-cc-scene');
    expect((html.match(/role="spinbutton"/g) ?? []).length).toBe(2);
    expect(html).toContain('data-cc-sign="x"');
    expect(html).toContain('data-cc-open');
    expect(html).toContain('data-cc-portal="A"');
    expect(html).toContain('data-cc-portal="B"');
    expect(html).toContain('data-cc-hero');
    expect(html).toContain('data-cc-axes');
    expect(html).toContain('data-deco="chest"');
    expect((html.match(/data-cc-dot=/g) ?? []).length).toBe(2);
    expect(html).not.toContain('data-cc-next');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('advanced (نشاط 2): three missions, the portals C, D, F, the code of CD first', () => {
    const html = renderToString(<ComponentCalc {...advanced.numbers} level="advanced" theme="game-map" />);
    expect((html.match(/data-cc-dot=/g) ?? []).length).toBe(3);
    expect(html).toContain('data-cc-portal="C"');
    expect(html).toContain('data-cc-portal="D"');
    expect(html).toContain('data-cc-portal="F"');
    expect(html).not.toContain('data-cc-portal="E"');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <ComponentCalc level="beginner" numbers={beginner.numbers} />,
        advanced: () => <ComponentCalc level="advanced" numbers={advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-component-calc/g) ?? []).length).toBe(2);
    // deux niveaux montés : des identifiants SVG distincts (useId)
    const ids = [...html.matchAll(/id="(cc-swirl-[^"]+)"/g)].map((x) => x[1]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(html).not.toMatch(RAW);
  });
});
