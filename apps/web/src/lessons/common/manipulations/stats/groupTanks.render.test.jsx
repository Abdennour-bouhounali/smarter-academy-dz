import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import GroupTanks from './GroupTanks';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * group-tanks se rend aux deux niveaux de levels.js (les deux amis du quiz ; les deux classes du تحدّ),
 * seul et dans le workspace, sans clé i18n brute ni interpolation oubliée.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('group-tanks — rendu', () => {
  it('beginner (quiz): one class, two group tanks, the bet handle, the valve', () => {
    const html = renderToString(<GroupTanks {...LEVELS['group-tanks'].beginner.numbers} theme="quiz" />);
    expect(html).toContain('data-group-tanks');
    expect(html).toContain('data-classes="1"');
    expect(html).toContain('data-gt-glance');
    expect((html.match(/data-gt-tank="/g) ?? []).length).toBe(2);
    expect(html).toContain('data-gt-bet-handle="0"');
    expect(html).toContain('data-gt-open="0"');
    expect(html).toContain('data-deco="quiz"');
    expect(html).toContain('فريق أمين');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('advanced (تحدّ): two classes of two groups, both valves', () => {
    const html = renderToString(<GroupTanks {...LEVELS['group-tanks'].advanced.numbers} theme="school" />);
    expect(html).toContain('data-classes="2"');
    expect((html.match(/data-gt-tank="/g) ?? []).length).toBe(4);
    expect(html).toContain('data-gt-open="1"');
    expect(html).toContain('data-level="128/11"');
    expect(html).toContain('القسم (أ)');
    expect(html).toContain('ذكور (ب)');
    expect(html).not.toMatch(RAW);
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <GroupTanks level="beginner" groups="4:12|6:7" theme="quiz" />,
        advanced: () => <GroupTanks groups="15:10|18:13|14:12,5|19:11" classes="2|2" theme="school" />,
      }} />,
    );
    expect((html.match(/data-group-tanks/g) ?? []).length).toBe(2);
    expect(html).not.toMatch(RAW);
  });
});
