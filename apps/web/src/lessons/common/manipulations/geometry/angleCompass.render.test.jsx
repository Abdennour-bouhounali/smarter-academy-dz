import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import AngleCompass from './AngleCompass';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * angle-compass se rend aux deux niveaux de levels.js (sin 3/5 ; sin 2/5 puis tan 7/3), seul sans niveaux
 * (levels={false}, دوري الآن 2 : cos 3/4) et dans le workspace — sans clé i18n brute ni interpolation oubliée.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('angle-compass — rendu', () => {
  it('beginner: the target, the set square to place, the glance block, the beach decoration', () => {
    const html = renderToString(<AngleCompass {...LEVELS['angle-compass'].beginner.numbers} theme="kite" />);
    expect(html).toContain('data-angle-compass');
    expect(html).toContain('data-step="square"');
    expect(html).toContain('data-ac-glance');
    expect(html).toContain('data-ac-target="sin:3/5"');
    expect(html).toContain('data-ac-square');
    expect(html).toContain('data-deco="kite"');
    expect(html).toContain('data-deco="gull"');
    expect(html).not.toContain('data-ac-leg=');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('advanced: two targets, the first one is sin 2/5 (1 of 2)', () => {
    const html = renderToString(<AngleCompass {...LEVELS['angle-compass'].advanced.numbers} level="advanced" theme="kite" />);
    expect(html).toContain('data-ac-target="sin:2/5"');
    expect(html).toContain('الزاوية 1 من 2');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('a single level (levels={false}) — دوري الآن 2, cos 3/4: no selector', () => {
    const html = renderToString(<AngleCompass targets={[{ ratio: 'cos', value: '3/4' }]} levels={false} />);
    expect(html).toContain('data-ac-target="cos:3/4"');
    expect(html).not.toContain('data-manipulation-levels-selector');
    expect(html).not.toMatch(RAW);
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace levels={{
        beginner: () => <AngleCompass level="beginner" targets={[{ ratio: 'sin', value: '3/5' }]} theme="kite" />,
        advanced: () => <AngleCompass level="advanced" targets={[{ ratio: 'sin', value: '2/5' }, { ratio: 'tan', value: '7/3' }]} theme="kite" />,
      }} />,
    );
    expect((html.match(/data-angle-compass/g) ?? []).length).toBe(2);
    expect((html.match(/data-manipulation-levels-selector/g) ?? []).length).toBe(1);
    expect(html).not.toMatch(RAW);
  });
});
