import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import ShapeProver from './ShapeProver';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * shape-prover se rend aux deux niveaux de levels.js (le triangle du ملعب الحي ; la droite de C de la طريقة p. 145),
 * seul et dans le workspace, sans clé i18n brute, sans interpolation oubliée et sans mot latin hors des noms de points.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const LATIN_WORD = />[^<]*\b(?:VAR|claim|card|check|Enter|cone|ball)\b[^<]*</i;
const { beginner, advanced } = LEVELS['shape-prover'];

describe('shape-prover — rendu', () => {
  it('beginner (triangle): the pitch, three cones, C held, two claims, the three right-angle cards, the check, the decor', () => {
    const html = renderToString(<ShapeProver {...beginner.numbers} level="beginner" theme="football" />);
    expect(html).toContain('data-shape-prover');
    expect(html).toContain('data-mode="triangle"');
    expect(html).toContain('data-sp-glance');
    expect(html).toContain('data-sp-handle="C"');
    expect(html).toContain('data-x="-1" data-y="2"');
    expect((html.match(/data-sp-cone=/g) ?? []).length).toBe(3);
    expect((html.match(/data-sp-move=/g) ?? []).length).toBe(4);
    expect(html).toContain('data-sp-claim="right:A"');
    expect(html).toContain('data-sp-claim="iso:C"');
    // les cartes de la famille de l'affirmation (« قائم في A ») : les trois sommets
    expect((html.match(/data-sp-card=/g) ?? []).length).toBe(3);
    // le départ a l'air droit en A : la carte du sommet A n'est pas équilibrée
    expect(html).toMatch(/data-sp-card="pyth:A" data-balanced="false"/);
    expect(html).toContain('data-sp-check');
    expect(html).toContain('data-deco="turf"');
    expect(html).toContain('data-deco="ball"');
    expect(html).toContain('data-deco="phone"');
    expect(html).not.toContain('data-sp-rail');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
    expect(html).not.toMatch(LATIN_WORD);
  });

  it('advanced (طرائق p. 145): C on its rail x = −2 (up / down only), the three right-angle cards, no quad yet', () => {
    const html = renderToString(<ShapeProver {...advanced.numbers} level="advanced" theme="football" />);
    expect(html).toContain('data-mode="unknown"');
    expect(html).toContain('data-stage="tri"');
    expect(html).toContain('data-sp-rail');
    expect(html).toContain('data-x="-2" data-y="4"');
    expect((html.match(/data-sp-move=/g) ?? []).length).toBe(2);
    expect((html.match(/data-sp-card=/g) ?? []).length).toBe(3);
    expect(html).toContain('data-sp-claim="right:B"');
    expect(html).not.toContain('data-sp-next-quad');
    expect(html).not.toContain('data-sp-circle');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
    expect(html).not.toMatch(LATIN_WORD);
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace levels={{
        beginner: () => <ShapeProver level="beginner" numbers={beginner.numbers} />,
        advanced: () => <ShapeProver level="advanced" numbers={advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-shape-prover/g) ?? []).length).toBe(2);
    expect(html).not.toMatch(RAW);
  });
});
