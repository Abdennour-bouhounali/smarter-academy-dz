import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import VectorSum from './VectorSum';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * vector-sum se rend dans ses DEUX modes (la trottinette de علاقة شال, le nageur du تحدّ) seul et dans un workspace, à
 * plat ou par `numbers`, sans clé i18n brute, sans interpolation oubliée, et SANS la réponse sur le premier écran :
 * ni la somme AC (avant la pose), ni 30°, ni 2√3 / 3,46 (avant l'arrivée en B).
 */
const RAW = /manipulation\.[a-zA-Z]/;
const clean = (html) => {
  expect(html).not.toMatch(RAW);
  expect(html).not.toContain('{{');
};

describe('vector-sum — rendu', () => {
  it('chasles (beginner): la carte, AB fait, trois cartes de trajet, quatre stations, pas encore de somme', () => {
    const html = renderToString(<VectorSum {...LEVELS['vector-sum'].beginner.numbers} />);
    expect(html).toContain('data-vector-sum');
    expect(html).toContain('data-mode="chasles"');
    expect(html).toContain('data-world="scooter"');
    expect(html).toContain('data-vs-glance');
    expect(html).toContain('data-vs-first');
    expect((html.match(/data-vs-card="/g) ?? []).length).toBe(3);
    expect((html.match(/data-vs-station="/g) ?? []).length).toBe(4);
    expect(html).toContain('data-vs-verdict="start"');
    expect(html).toContain('data-deco="scooter"');
    expect(html).not.toContain('data-vs-sum');
    expect(html).not.toContain('5,66');
    clean(html);
  });

  it('parallelogram (advanced, the تحدّ): A, B, the current, the swimmer aiming at B — 30° and 2√3 nowhere', () => {
    const html = renderToString(<VectorSum numbers={LEVELS['vector-sum'].advanced.numbers} />);
    expect(html).toContain('data-mode="parallelogram"');
    expect(html).toContain('data-world="swim"');
    expect(html).toContain('data-vs-handle="0"');
    expect(html).toContain('data-vs-current');
    expect(html).toContain('data-vs-swim');
    expect(html).toContain('data-vs-sum="live"');
    expect(html).toContain('data-vs-verdict="start"');
    expect(html).toContain('data-deco="swim"');
    expect(html).not.toContain('30°');
    expect(html).not.toContain('3,46');
    expect(html).not.toContain('\\sqrt{3}');
    clean(html);
  });

  it('inside a workspace: both levels mounted, the تحدّ by default', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <VectorSum level="beginner" {...LEVELS['vector-sum'].beginner.numbers} />,
        advanced: () => <VectorSum level="advanced" {...LEVELS['vector-sum'].advanced.numbers} />,
      }} />,
    );
    expect(html).toContain('data-mode="chasles"');
    expect(html).toContain('data-mode="parallelogram"');
    clean(html);
  });
});
