import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import MANIPULATION_AR from '../../../../i18n/locales/ar/lesson.manipulation.json';
import SRC from './RampRatios.jsx?raw';
import RampRatios from './RampRatios';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * ramp-ratios se rend aux deux niveaux de levels.js (la rampe à nommer ; les rampes du نشاط 2), seul et dans le
 * workspace, sans clé i18n brute ni interpolation oubliée, et toutes les clés que le composant lit existent.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('ramp-ratios — rendu', () => {
  it('beginner (name): the scene, the three vertices, the rise handle, the reading, the decor', () => {
    const html = renderToString(<RampRatios {...LEVELS['ramp-ratios'].beginner.numbers} />);
    expect(html).toContain('data-ramp-ratios');
    expect(html).toContain('data-mode="name"');
    expect(html).toContain('data-stage="pick"');
    expect(html).toContain('data-rr-glance');
    for (const v of ['A', 'B', 'C']) expect(html).toContain(`data-rr-vertex="${v}"`);
    expect(html).toContain('data-rr-handle="rise"');
    expect(html).toContain('role="slider"');
    expect(html).toContain('data-rr-reading');
    expect(html).toContain('data-deco="skatepark"');
    expect(html).toContain('data-rr-ghost');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('advanced (نشاط 2): 40°, the board and angle handles, record, the marks 4, 6, 8', () => {
    const html = renderToString(<RampRatios {...LEVELS['ramp-ratios'].advanced.numbers} />);
    expect(html).toContain('data-mode="scale"');
    expect(html).toContain('data-b="40"');
    expect(html).toContain('data-rr-handle="len"');
    expect(html).toContain('data-rr-handle="angle"');
    expect(html).toContain('data-rr-record');
    for (const mk of ['4', '6', '8']) expect(html).toContain(`>${mk}</text>`);
    expect(html).toContain('data-rr-need');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <RampRatios level="beginner" {...LEVELS['ramp-ratios'].beginner.numbers} />,
        advanced: () => <RampRatios level="advanced" {...LEVELS['ramp-ratios'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-ramp-ratios="/g) ?? []).length).toBe(2);
    expect(html).not.toMatch(RAW);
  });

  it('every key the component reads exists in Arabic, no Latin word outside point names and maths', () => {
    const src = SRC;
    const keys = new Set();
    for (const mm of src.matchAll(/\bk\(\s*'([A-Za-z0-9_]+)'/g)) keys.add(mm[1]);
    for (const mm of src.matchAll(/k\(`([a-zA-Z]+)_\$\{/g)) keys.add(`${mm[1]}_`);
    const ns = MANIPULATION_AR.rampRatios;
    for (const key of keys) {
      if (key.endsWith('_')) expect(Object.keys(ns).some((x) => x.startsWith(key)), key).toBe(true);
      else expect(ns[key], key).toBeTruthy();
    }
    for (const [key, v] of Object.entries(ns)) {
      const plain = v.replace(/\$[^$]*\$/g, '').replace(/\{\{[a-z0-9]+\}\}/gi, '').replace(/\[[A-C]{2}\]/g, '');
      expect(/[a-z]{2,}/i.test(plain.replace(/\b[A-C]{1,3}\b/g, '')), `${key}: ${v}`).toBe(false);
    }
  });
});
