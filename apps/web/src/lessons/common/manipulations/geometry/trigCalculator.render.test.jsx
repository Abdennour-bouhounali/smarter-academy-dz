import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import TrigCalculator from './TrigCalculator';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * trig-calculator se rend aux deux niveaux de levels.js (30°, 45°, 60° ; le tableau du نشاط 4 + les trois angles),
 * seul et dans un workspace, sans clé i18n brute, sans interpolation oubliée, sans aucune réponse du tableau écrite.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('trig-calculator — rendu', () => {
  it('beginner: the drone scene, the calculator in R mode, every key, the table fold, no answer', () => {
    const html = renderToString(<TrigCalculator {...LEVELS['trig-calculator'].beginner.numbers} />);
    expect(html).toContain('data-trig-calculator');
    expect(html).toContain('data-tc-glance');
    expect(html).toContain('data-stage="table"');
    expect(html).toContain('data-mode="RAD"');
    expect(html).toContain('data-tc-mode-flag="RAD"');
    for (const k of ['2nd', 'DRG', 'sin', 'cos', 'tan', 'ON', 'DEL', '=', ',', '0', '9']) expect(html).toContain(`data-tc-key="${k}"`);
    expect(html).toContain('data-tc-cell="30|cos"');
    expect(html).toContain('data-deco="hud"');
    expect(html).toContain('data-lab-fold="trig-calculator.table"');
    expect(html).not.toContain('data-tc-next');
    expect(html).not.toContain('0,87');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('advanced (نشاط 4): seven angles, the inverse stage closed, 31,33 nowhere', () => {
    const html = renderToString(<TrigCalculator {...LEVELS['trig-calculator'].advanced.numbers} />);
    expect(html).toContain('data-tc-cell="75|tan"');
    expect(html).not.toContain('data-tc-task');
    expect(html).not.toContain('31,33');
    expect(html).not.toContain('3,73');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <TrigCalculator level="beginner" {...LEVELS['trig-calculator'].beginner.numbers} />,
        advanced: () => <TrigCalculator {...LEVELS['trig-calculator'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-trig-calculator/g) ?? []).length).toBe(2);
    expect(html).not.toMatch(RAW);
  });
});
