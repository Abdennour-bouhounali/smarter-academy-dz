import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import ParallelogramPin from './ParallelogramPin';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * parallelogram-pin se rend aux deux niveaux de levels.js (le foulard et I ; la banderole et D), seul et dans le
 * workspace, sans clé i18n brute, sans interpolation oubliée, sans dollar hors des îlots.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const { beginner, advanced } = LEVELS['parallelogram-pin'];

describe('parallelogram-pin — rendu', () => {
  it('beginner (midpoint): I on the scarf as a slider, the 8 parts, the two arrows, the three criteria, the flip, the decor', () => {
    const html = renderToString(<ParallelogramPin {...beginner.numbers} level="beginner" theme="tifo" />);
    expect(html).toContain('data-parallelogram-pin');
    expect(html).toContain('data-mode="midpoint"');
    expect(html).toContain('data-pp-glance');
    expect(html).toContain('data-pp-handle="I"');
    expect(html).toContain('role="slider"');
    expect((html.match(/data-tick=/g) ?? []).length).toBe(9);
    expect(html).toContain('data-pp-arrow="AI"');
    expect(html).toContain('data-pp-arrow="IB"');
    expect(html).toContain('data-pp-flip');
    expect(html).toContain('data-pp-crit="tul" data-ok="false"');
    expect(html).toContain('data-pp-crit="ittijah" data-ok="true"');
    expect(html).toContain('data-deco="drum"');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('advanced (طرائق): the banner, the held corner D, the four moves, the two midpoint markers apart', () => {
    const html = renderToString(<ParallelogramPin {...advanced.numbers} level="advanced" theme="tifo" />);
    expect(html).toContain('data-mode="parallelogram"');
    expect(html).toContain('data-stage="D"');
    expect(html).toContain('data-pp-handle="D"');
    expect((html.match(/data-pp-move=/g) ?? []).length).toBe(4);
    expect(html).toContain('data-pp-commit');
    expect(html).toContain('data-pp-banner');
    expect(html).toContain('data-pp-mid="AD"');
    expect(html).toContain('data-pp-mid="BC"');
    expect(html).toContain('data-merged="false"');
    expect(html).not.toContain('data-pp-next-e');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <ParallelogramPin level="beginner" numbers={beginner.numbers} />,
        advanced: () => <ParallelogramPin level="advanced" numbers={advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-parallelogram-pin/g) ?? []).length).toBe(2);
    expect(html).not.toMatch(RAW);
  });
});
