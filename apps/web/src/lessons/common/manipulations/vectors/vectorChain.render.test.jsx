import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import VectorChain from './VectorChain';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * vector-chain se rend aux deux niveaux de levels.js (le parallélogramme du métro ; l'ex-18) et en mode construct
 * (دوري الآن ص 138), seul et dans le workspace, sans clé i18n brute, sans interpolation oubliée, sans dollar visible.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const NOW138 = {
  mode: 'construct', stations: { A: [0, 0], B: [4, 1], C: [1, 3], E: [6, 4] }, radius: 2,
  builds: [{ terms: ['AB', 'AC'], centre: 'E', name: 'E_1' }, { terms: ['BE', 'CA'], centre: 'E', name: 'E_2' }],
};
const clean = (html) => {
  expect(html).not.toMatch(RAW);
  expect(html).not.toContain('{{');
  expect(html).not.toContain('undefined');
  expect(html).not.toContain('NaN');
};

describe('vector-chain — rendu', () => {
  it('beginner: four stations as drop zones, the two coupling hooks, the tickets, the givens, the decor', () => {
    const html = renderToString(<VectorChain {...LEVELS['vector-chain'].beginner.numbers} theme="metro" />);
    expect(html).toContain('data-vector-chain');
    expect(html).toContain('data-mode="reduce"');
    expect(html).toContain('data-vc-glance');
    expect((html.match(/data-vc-station="/g) ?? []).length).toBe(4);
    expect(html).toContain('data-vc-zone="head"');
    expect(html).toContain('data-vc-zone="tail"');
    expect(html).toContain('data-vc-card="BC"');
    expect(html).toContain('data-vc-card="AB"');
    expect(html).toContain('data-vc-given="para"');
    expect((html.match(/data-vc-tab="/g) ?? []).length).toBe(2);
    expect(html).toContain('data-deco="validator"');
    expect(html).toContain('data-deco="station-name"');
    expect(html).toContain('data-lab-fold="vector-chain.proof"');
    clean(html);
  });

  it('advanced (ex-18): eight stations, six givens, the goal to prove, no station names (decor kept light)', () => {
    const html = renderToString(<VectorChain {...LEVELS['vector-chain'].advanced.numbers} theme="metro" />);
    expect((html.match(/data-vc-station="/g) ?? []).length).toBe(8);
    expect(html).toContain('data-vc-givens="6"');
    expect(html).toContain('data-vc-given="def"');
    expect(html).toContain('data-vc-goal');
    expect(html).not.toContain('data-deco="station-name"');
    clean(html);
  });

  it('construct (دوري الآن ص 138): the stations, the two circles as tabs, the tickets of Γ1', () => {
    const html = renderToString(<VectorChain {...NOW138} levels={false} theme="metro" />);
    expect(html).toContain('data-mode="construct"');
    expect((html.match(/data-vc-tab="/g) ?? []).length).toBe(2);
    expect(html).toContain('data-vc-card="AB"');
    expect(html).toContain('data-vc-card="AC"');
    expect(html).not.toContain('data-vc-zone="head"');
    expect(html).not.toContain('data-manipulation-levels-selector');
    clean(html);
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace levels={{
        beginner: () => <VectorChain level="beginner" {...LEVELS['vector-chain'].beginner.numbers} />,
        advanced: () => <VectorChain level="advanced" {...LEVELS['vector-chain'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-vector-chain/g) ?? []).length).toBe(2);
    clean(html);
  });
});
