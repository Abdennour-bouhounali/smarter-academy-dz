import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import Clinometer from './Clinometer';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';
import * as L from '../logic/clinometer';

/**
 * clinometer se rend dans ses TROIS modes (le projecteur, l'échelle du تحدّ, l'alignement de la synthèse sur les nombres
 * du manuel), seul et dans un workspace, à plat ou par `numbers`, sans clé i18n brute, sans interpolation oubliée et
 * sans la réponse écrite sur le premier écran (24 m, 1,9 m, 92,09 m, 43°).
 */
const RAW = /manipulation\.[a-zA-Z]/;
const ALIGN = { mode: 'align', pole: 2.3, poleAt: 95.65, total: 98.1 };
const clean = (html) => {
  expect(html).not.toMatch(RAW);
  expect(html).not.toContain('{{');
};

describe('clinometer — rendu', () => {
  it('height (beginner): the floodlight, the phone on the touchline, the two handles, the shutter, no height written', () => {
    const html = renderToString(<Clinometer {...LEVELS.clinometer.beginner.numbers} />);
    expect(html).toContain('data-clinometer');
    expect(html).toContain('data-cl-glance');
    expect(html).toContain('data-mode="height"');
    expect(html).toContain('data-world="floodlight"');
    expect(html).toContain('data-stage="hand"');
    expect(html).toContain('data-aimed="false"');
    expect(html).toContain('data-cl-hand="15"');
    expect(html).toContain('data-cl-tilt="20"');
    expect(html).toContain('data-cl-shutter');
    expect(html).toContain('data-cl-phone="height"');
    expect(html).toContain('data-deco="floodlight"');
    expect(html).not.toContain('data-cl-plan');
    expect(html).not.toContain('24 m');
    clean(html);
  });

  it('ladder (advanced, the تحدّ): the ladder starts at 1,6 m and reaches 1,37 m; 1,9 nowhere', () => {
    const html = renderToString(<Clinometer {...LEVELS.clinometer.advanced.numbers} />);
    expect(html).toContain('data-mode="ladder"');
    expect(html).toContain('data-world="mural"');
    expect(html).toContain('data-cl-ladder="1,6"');
    expect(html).toContain('data-cl-top="1,37"');
    expect(html).toContain('data-cl-mark="1,6"');
    expect(html).toContain('data-deco="mural"');
    expect(html).not.toContain('1,9 m');
    expect(html).not.toContain('1{,}9');
    expect(html).not.toContain('1,87');
    clean(html);
  });

  it('align (the synthesis, textbook numbers, passed as `numbers`): the zoom, the observer, no H and no x on screen', () => {
    const html = renderToString(<Clinometer numbers={ALIGN} theme="maqam" />);
    expect(html).toContain('data-mode="align"');
    expect(html).toContain('data-world="maqam"');
    expect(html).toContain('data-cl-zoom');
    expect(html).toContain('data-cl-hand=');
    expect(html).toContain('data-deco="maqam"');
    expect(html).toContain('data-cl-phone-angle=""');
    expect(html).not.toContain('92,09');
    expect(html).not.toContain('92{,}09');
    expect(html).not.toContain('43°');
    clean(html);
  });

  it('align: the logic behind it gives the textbook answers H ≈ 92,09 m and x ≈ 43°', () => {
    let s = L.init(ALIGN);
    s = L.moveTo(s, s.iStar + 3);
    s = L.moveTo(s, s.iStar);
    s = L.chooseRatio(s, 'tan');
    expect(L.result(s)).toMatchObject({ H100: '92,09', x: '43' });
  });

  it('inside a workspace: both levels mounted, one selector, the synthesis align on one panel', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <Clinometer level="beginner" {...LEVELS.clinometer.beginner.numbers} />,
        advanced: () => <Clinometer {...LEVELS.clinometer.advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-mode="/g) ?? []).length).toBe(2);
    clean(html);
    const syn = renderToString(
      <ManipulationWorkspace levels={{
        beginner: () => <Clinometer level="beginner" {...ALIGN} theme="maqam" />,
        advanced: () => <Clinometer {...LEVELS.clinometer.advanced.numbers} />,
      }} />,
    );
    expect(syn).toContain('data-mode="align"');
    expect(syn).toContain('data-mode="ladder"');
    clean(syn);
  });
});
