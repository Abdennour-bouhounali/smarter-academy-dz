import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import InscribedAngle from './InscribedAngle';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * inscribed-angle se rend dans ses DEUX modes (l'angle de tir, le نشاط 4), seul et dans un workspace, à plat ou par
 * `numbers`, sans clé i18n brute, sans interpolation oubliée, et SANS la réponse sur le premier écran : à مبتدئ l'angle de
 * tir (60°) reste caché tant que l'élève n'a pas parié ; à متقدم la relation n'est pas écrite avant l'étape de مزيان.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const clean = (html) => {
  expect(html).not.toMatch(RAW);
  expect(html).not.toContain('{{');
  expect(html).not.toContain('undefined');
  expect(html).not.toContain('NaN');
};

describe('inscribed-angle — rendu', () => {
  it('striker (beginner): the pitch, the circle, the central angle given, the shooting angle hidden until the bet', () => {
    const html = renderToString(<InscribedAngle {...LEVELS['inscribed-angle'].beginner.numbers} />);
    expect(html).toContain('data-inscribed-angle');
    expect(html).toContain('data-mode="striker"');
    expect(html).toContain('data-world="football"');
    expect(html).toContain('data-ia-glance');
    expect(html).toContain('data-ia-circle');
    expect(html).toContain('data-ia-central="120"');
    expect(html).toContain('data-ia-angle="?"');
    expect(html).toContain('data-ia-bet-input');
    expect(html).toContain('data-ia-handle="250"');
    expect(html).toContain('data-ia-verdict="start"');
    expect(html).toContain('data-deco="football"');
    expect((html.match(/data-ia-place="/g) ?? []).length).toBe(3);
    expect(html).not.toContain('60°');
    expect(html).not.toContain('60^');
    clean(html);
  });

  it('act4 (advanced, نشاط 4): stage mezian, D on the major arc, no relation written yet', () => {
    const html = renderToString(<InscribedAngle numbers={LEVELS['inscribed-angle'].advanced.numbers} />);
    expect(html).toContain('data-mode="act4"');
    expect(html).toContain('data-stage="mezian"');
    expect(html).toContain('data-ia-central="100"');
    expect(html).toContain('data-ia-stage-card="mezian"');
    expect(html).not.toContain('data-ia-mezian-equalities');
    expect(html).not.toContain('data-ia-relation');
    expect(html).not.toContain('data-ia-formal');
    expect(html).not.toContain('data-ia-bet-input');
    clean(html);
  });

  it('inside a workspace: both levels mounted, the نشاط 4 by default, distinct SVG ids', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <InscribedAngle level="beginner" {...LEVELS['inscribed-angle'].beginner.numbers} />,
        advanced: () => <InscribedAngle level="advanced" {...LEVELS['inscribed-angle'].advanced.numbers} />,
      }} />,
    );
    expect(html).toContain('data-mode="striker"');
    expect(html).toContain('data-mode="act4"');
    const ids = [...html.matchAll(/id="([^"]+-stand)"/g)].map((x) => x[1]);
    expect(ids.length).toBe(2);
    expect(new Set(ids).size).toBe(2);
    clean(html);
  });
});
