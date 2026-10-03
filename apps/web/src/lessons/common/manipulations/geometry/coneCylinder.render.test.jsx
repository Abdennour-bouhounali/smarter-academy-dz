import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import ConeCylinder from './ConeCylinder';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * cone-cylinder se rend aux deux niveaux de levels.js (cornet 12 / 4 ; la وضعية 18 / 6), seul et dans un
 * workspace, sans clé i18n brute ; l'écran de départ ne montre ni r = 4,5 ni 91,125π.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('cone-cylinder — rendu', () => {
  it('beginner: the cone, the cylinder inside (a gap), both handles, the volume line', () => {
    const html = renderToString(<ConeCylinder {...LEVELS['cone-cylinder'].beginner.numbers} />);
    expect(html).toContain('data-cone-cylinder');
    expect(html).toContain('data-cc-glance');
    expect(html).toContain('data-n="20"');
    expect(html).toContain('data-state="gap"');
    expect(html).toContain('data-cc-h-handle="10"');
    expect(html).toContain('data-cc-r-handle="3"');
    expect(html).toContain('data-cc-volume');
    expect(html).toContain('data-deco="cornet"');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('advanced (وضعية): 24 graduations, starts at h = 9, r = 1, no answer shown', () => {
    const html = renderToString(<ConeCylinder {...LEVELS['cone-cylinder'].advanced.numbers} />);
    expect(html).toContain('data-n="24"');
    expect(html).toContain('data-cc-h-value="9"');
    expect(html).toContain('data-cc-r-value="1"');
    expect(html).not.toContain('91,125');
    expect(html).not.toContain('4{,}5');
    expect(html).not.toMatch(RAW);
  });

  it('inside a workspace: both levels mounted', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <ConeCylinder level="beginner" {...LEVELS['cone-cylinder'].beginner.numbers} />,
        advanced: () => <ConeCylinder {...LEVELS['cone-cylinder'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-cone-cylinder/g) ?? []).length).toBe(2);
    expect(html).not.toMatch(RAW);
  });
});
