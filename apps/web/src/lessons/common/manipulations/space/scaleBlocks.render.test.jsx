import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import ScaleBlocks from './ScaleBlocks';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * scale-blocks se rend à ses DEUX niveaux (le cube d'arête 1, le pavé du نشاط 6), seul et dans un workspace, à plat ou par
 * `numbers`, sans clé i18n brute ni interpolation oubliée, avec TOUTES ses commandes HTML (le rendu serveur n'a pas de WebGL :
 * la scène est remplacée par son repli SpaceFigure) — et SANS la réponse sur le premier écran : ni 8 ni 27 cubes, ni 12,96,
 * ni 33,84, ni 480 ; la lecture écrit « ؟ » pour l'aire et le volume du solide image tant qu'il n'est pas bâti.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const clean = (html) => {
  expect(html).not.toMatch(RAW);
  expect(html).not.toContain('{{');
  expect(html).not.toContain('undefined');
  expect(html).not.toContain('NaN');
  expect(html).not.toContain('[object Object]');
};

describe('scale-blocks — rendu', () => {
  it('beginner (the cube of edge 1): k = 1, the slider and its − / +, no « + 1 cm » for a cube, no 8 nor 27 yet', () => {
    const html = renderToString(<ScaleBlocks {...LEVELS['scale-blocks'].beginner.numbers} />);
    expect(html).toContain('data-scale-blocks');
    expect(html).toContain('data-world="voxel-blocks"');
    expect(html).toContain('data-sb-glance');
    expect(html).toContain('data-stage3d');
    expect(html).toContain('data-stage3d-fallback');
    expect(html).toContain('data-space-figure');
    expect(html).toContain('data-sb-k="1"');
    expect(html).toContain('role="slider"');
    expect(html).toContain('data-sb-less');
    expect(html).toContain('data-sb-more');
    // à k = 1 il n'y a rien à prédire ni à bâtir : « ابنِ » et les trois volumes n'apparaissent qu'avec un autre rapport
    expect(html).not.toContain('data-sb-build');
    expect(html).toContain('data-sb-verdict="start"');
    expect(html).toContain('data-sb-readings');
    // le rendu serveur se mesure à 320 px (« étroit ») : le compteur flottant y cède sa place à la ligne « الحجم »
    expect(html).toContain('data-sb-row="volume"');
    expect(html).toContain('data-deco="voxel-blocks"');
    expect(html).not.toContain('data-sb-plus');
    expect(html).not.toContain('data-sb-option');
    expect(html).not.toContain('data-sb-trials');
    expect(html).not.toMatch(/>8</);
    expect(html).not.toMatch(/>27</);
    clean(html);
  });

  it('advanced (نشاط 6): the 5 × 4 × 3 cuboid, the « + 1 cm » contrast button, and no 12,96 / 33,84 / 480 on the first screen', () => {
    const html = renderToString(<ScaleBlocks numbers={LEVELS['scale-blocks'].advanced.numbers} />);
    expect(html).toContain('data-sb-plus');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('data-sb-ratio="volume"');
    // les lectures du départ sont là (60, 94), pas celles du solide image
    expect(html).toContain('60');
    expect(html).toContain('94');
    expect(html).not.toContain('12{,}96');
    expect(html).not.toContain('12,96');
    expect(html).not.toContain('33{,}84');
    expect(html).not.toContain('480');
    expect(html).toContain('؟');
    clean(html);
  });

  it('inside a workspace: both levels mounted, the textbook activity by default, two separate 3D windows', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <ScaleBlocks level="beginner" {...LEVELS['scale-blocks'].beginner.numbers} />,
        advanced: () => <ScaleBlocks level="advanced" {...LEVELS['scale-blocks'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-scale-blocks/g) ?? []).length).toBe(2);
    expect((html.match(/data-stage3d="true"/g) ?? []).length).toBe(2);
    clean(html);
  });
});
