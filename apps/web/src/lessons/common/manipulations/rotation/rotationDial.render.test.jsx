import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import RotationDial from './RotationDial';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * rotation-dial se rend aux deux niveaux de levels.js (la grande roue de Ben Aknoun ; la feuille du نشاط 2 / 3), seul
 * et dans le workspace, sans clé i18n brute, sans interpolation oubliée, sans mot latin hors des noms de points.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const LATIN_WORD = />[^<]*\b(?:Enter|wheel|gondola|compass|image|direct|indirect)\b[^<]*</i;

describe('rotation-dial — rendu', () => {
  it('beginner (wheel): the dusk, six gondolas, 24 nodes, the image handle, four task tabs, the lamps, the décor', () => {
    const html = renderToString(<RotationDial {...LEVELS['rotation-dial'].beginner.numbers} theme="ferris-wheel" />);
    expect(html).toContain('data-rotation-dial');
    expect(html).toContain('data-scene="wheel"');
    expect(html).toContain('data-rd-glance');
    expect((html.match(/data-rd-gondola=/g) ?? []).length).toBe(6);
    expect((html.match(/data-rd-node=/g) ?? []).length).toBe(24);
    expect(html).toContain('data-rd-handle="image"');
    expect(html).not.toContain('data-rd-handle="compass"');
    expect((html.match(/data-rd-tab=/g) ?? []).length).toBe(4);
    expect(html).toContain('data-rd-lamp="sense"');
    expect(html).toContain('data-deco="sky"');
    expect(html).toContain('data-deco="tickets"');
    expect(html).toContain('data-task="t1"');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
    expect(html).not.toMatch(LATIN_WORD);
  });

  it('advanced (plane, نشاط 2 puis 3): three missions, the compass and the ruler knob, no lamps, no circle before the compass', () => {
    const html = renderToString(<RotationDial {...LEVELS['rotation-dial'].advanced.numbers} theme="ferris-wheel" />);
    expect(html).toContain('data-scene="plane"');
    expect(html).toContain('data-mission="point"');
    expect((html.match(/data-rd-tab=/g) ?? []).length).toBe(3);
    expect(html).toContain('data-rd-handle="compass"');
    expect(html).toContain('data-rd-handle="ray"');
    expect(html).toContain('data-rd-handle="image"');
    expect(html).not.toContain('data-rd-protractor'); // la منقلة apparaît après le compas (étape 2)
    expect(html).not.toContain('data-rd-circle');
    expect(html).not.toContain('data-rd-lamps');
    expect(html).toContain('data-rd-steps');
    expect(html).toContain('data-deco="sticker"');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
    expect(html).not.toMatch(LATIN_WORD);
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <RotationDial level="beginner" {...LEVELS['rotation-dial'].beginner.numbers} />,
        advanced: () => <RotationDial level="advanced" {...LEVELS['rotation-dial'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-rotation-dial/g) ?? []).length).toBe(2);
    expect((html.match(/data-manipulation-levels-selector/g) ?? []).length).toBe(1);
    expect(html).not.toMatch(RAW);
  });
});
