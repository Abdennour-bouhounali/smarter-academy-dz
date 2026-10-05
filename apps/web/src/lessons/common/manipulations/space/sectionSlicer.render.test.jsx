import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import SectionSlicer from './SectionSlicer';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * section-slicer se rend à ses DEUX niveaux (la sphère de rayon 5 ; le نشاط 2 puis les solides des نشاطات 3–5), seul et dans
 * un workspace, à plat ou par `numbers`, sans clé i18n brute ni interpolation oubliée, avec TOUTES ses commandes visibles
 * sans WebGL (le rendu serveur voit le repli SpaceFigure à la place de la scène) — et SANS la réponse sur le premier écran :
 * aucune carte, aucun rayon, aucune règle avant la première impression.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const clean = (html) => {
  expect(html).not.toMatch(RAW);
  expect(html).not.toContain('{{');
  expect(html).not.toContain('undefined');
  expect(html).not.toContain('NaN');
};

describe('section-slicer — rendu', () => {
  it('مبتدئ : la sphère R = 5, le plan à h = 2, le rail, « اطبع » — pas de carte, pas de rayon, pas de règle', () => {
    const html = renderToString(<SectionSlicer {...LEVELS['section-slicer'].beginner.numbers} />);
    expect(html).toContain('data-section-slicer');
    expect(html).toContain('data-stage="sphere"');
    expect(html).toContain('data-world="3d-printer"');
    expect(html).toContain('data-sl-glance');
    expect(html).toContain('data-stage3d');
    expect(html).toContain('data-stage3d-fallback');
    expect(html).toContain('data-space-figure');
    expect(html).toContain('role="slider"');
    expect(html).toContain('data-sl-rail="2"');
    expect(html).toContain('aria-orientation="vertical"');
    expect(html).toContain('data-sl-less');
    expect(html).toContain('data-sl-more');
    expect(html).toContain('data-sl-print');
    expect(html).toContain('data-sl-verdict="start"');
    expect(html).toContain('data-deco="3d-printer"');
    expect(html).not.toContain('data-sl-tab=');
    expect(html).not.toContain('data-sl-card');
    expect(html).not.toContain('data-manipulation-discovery');
    expect(html).not.toContain('data-sl-formal');
    expect(html).not.toContain('R^2 - h^2');
    clean(html);
  });

  it('متقدم (نشاط 2 puis les solides) : quatre onglets, x = OI = 1,5 au départ, aucune des cinq valeurs du manuel lue', () => {
    const html = renderToString(<SectionSlicer numbers={LEVELS['section-slicer'].advanced.numbers} />);
    expect(html).toContain('data-stage="sphere"');
    expect((html.match(/data-sl-tab="/g) ?? []).length).toBe(4);
    for (const s of ['sphere', 'cuboid', 'cylinder', 'pyramid']) expect(html).toContain(`data-sl-tab="${s}"`);
    expect(html).toContain('data-sl-rail="1,5"');
    expect(html).toContain('data-sl-value="1,5"');
    expect(html).not.toContain('\\sqrt{119}');
    expect(html).not.toContain('data-sl-next');
    clean(html);
  });

  it('dans un workspace : les deux niveaux montés, le نشاط 2 par défaut, deux scènes indépendantes', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <SectionSlicer level="beginner" {...LEVELS['section-slicer'].beginner.numbers} />,
        advanced: () => <SectionSlicer level="advanced" {...LEVELS['section-slicer'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-section-slicer/g) ?? []).length).toBe(2);
    expect((html.match(/data-stage3d="true"/g) ?? []).length).toBe(2);
    clean(html);
  });
});
