import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import ParallelLevel from './ParallelLevel';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * parallel-level se rend aux deux niveaux de levels.js (l'échelle double ; le tréteau en X de نشاط 2), seul et
 * dans le workspace, sans clé i18n brute, sans interpolation oubliée et sans texte latin hors des noms de points.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('parallel-level — rendu', () => {
  it('beginner (ladder): the two handles, the arrows, the bubble, the ratios line, the decor', () => {
    const html = renderToString(<ParallelLevel {...LEVELS['parallel-level'].beginner.numbers} theme="mural" />);
    expect(html).toContain('data-parallel-level');
    expect(html).toContain('data-mode="ladder"');
    expect(html).toContain('data-pl-glance');
    expect(html).toContain('data-pl-handle="B"');
    expect(html).toContain('data-pl-handle="C"');
    expect(html).toContain('role="slider"');
    expect(html).toContain('data-pl-up="C"');
    expect(html).toContain('data-pl-bubble');
    expect(html).toContain('data-parallel="false"');
    expect(html).toContain('data-bp="5"');
    expect(html).toContain('data-cp="8"');
    expect(html).toContain('data-deco="spray"');
    expect(html).not.toContain('data-pl-figures');
    expect((html.match(/data-notch=/g) ?? []).length).toBe(5 + 8);
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('advanced (نشاط 2): the X-trestle graduated on both sides of A, the three figure chips, the teacher\'s 1/3', () => {
    const html = renderToString(<ParallelLevel {...LEVELS['parallel-level'].advanced.numbers} theme="mural" />);
    expect(html).toContain('data-mode="crossing"');
    expect(html).toContain('data-pl-figures="0"');
    expect((html.match(/data-pl-figure="/g) ?? []).length).toBe(3);
    // (d) : 8 sous A + 6 au-delà ; (d′) : 11 + 8
    expect((html.match(/data-notch=/g) ?? []).length).toBe(14 + 19);
    expect(html).toContain('data-notch="-6"');
    expect(html).toContain('data-pl-side="same"');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <ParallelLevel level="beginner" AB={6} AC={9} mode="ladder" />,
        advanced: () => <ParallelLevel AB={9} AC={12} ratio="1/3" mode="crossing" />,
      }} />,
    );
    expect((html.match(/data-parallel-level/g) ?? []).length).toBe(2);
    expect(html).not.toMatch(RAW);
  });
});
