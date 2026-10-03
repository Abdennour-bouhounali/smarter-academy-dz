import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import SegmentDivider from './SegmentDivider';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * segment-divider se rend aux deux niveaux de levels.js (3 parts égales ; MA/MB = 3/2), seul, sans
 * niveaux (levels={false}, دوري الآن 2/5) et dans le workspace — sans clé i18n brute ni interpolation oubliée.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('segment-divider — rendu', () => {
  it('beginner (equal): the ray, its angle handle, one ghost mark, the compass, the glance block', () => {
    const html = renderToString(<SegmentDivider {...LEVELS['segment-divider'].beginner.numbers} theme="tifo" />);
    expect(html).toContain('data-segment-divider');
    expect(html).toContain('data-mode="equal"');
    expect(html).toContain('data-step="ray"');
    expect(html).toContain('data-sd-glance');
    expect(html).toContain('data-sd-angle="40"');
    expect(html).toContain('data-sd-ghost="ray"');
    expect(html).toContain('data-sd-open="15"');
    expect(html).toContain('data-deco="tifo"');
    expect(html).toContain('لافتة التيفو');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('advanced (ratio): two parallels, four ghost rails, no ruler before marks', () => {
    const html = renderToString(<SegmentDivider {...LEVELS['segment-divider'].advanced.numbers} theme="tifo" />);
    expect(html).toContain('data-mode="ratio"');
    for (const rail of ['a+', 'a-', 'b+', 'b-']) expect(html).toContain(`data-sd-ghost="${rail}"`);
    expect(html).not.toContain('data-sd-end=');
    expect(html).toContain('(d₁)');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('a single level (levels={false}) — دوري الآن 2/5: no selector', () => {
    const html = renderToString(<SegmentDivider mode="ratio" p={2} q={5} marks={5} levels={false} />);
    expect(html).toContain('data-mode="ratio"');
    expect(html).not.toContain('data-manipulation-levels-selector');
    expect(html).not.toMatch(RAW);
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace levels={{
        beginner: () => <SegmentDivider level="beginner" parts={3} theme="tifo" />,
        advanced: () => <SegmentDivider level="advanced" mode="ratio" p={3} q={2} marks={5} theme="tifo" />,
      }} />,
    );
    expect((html.match(/data-segment-divider/g) ?? []).length).toBe(2);
    expect((html.match(/data-manipulation-levels-selector/g) ?? []).length).toBe(1);
    expect(html).not.toMatch(RAW);
  });
});
