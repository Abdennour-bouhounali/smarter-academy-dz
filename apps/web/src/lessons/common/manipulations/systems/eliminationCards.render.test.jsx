import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import EliminationCards from './EliminationCards';
import ManipulationWorkspace from '../ManipulationWorkspace';

/** Le TEXTE affiché (balises ôtées) : aucune clé i18n brute « manipulation.… » ne doit y paraître. */
const shownText = (html) => html.replace(/<[^>]+>/g, ' ');

/**
 * elimination-cards se rend pour chaque jumla que la leçon hall-jabri lui pose (les deux niveaux,
 * les deux jumal des طرائق), seul et dans un workspace à deux niveaux ouvert sur متقدم, sans clé
 * i18n brute, avec le contrat DOM des cartes, des tuiles, du multiplicateur et du décor.
 */
const SYSTEMS = ['x+y=10|x-y=2', '2x+y=7|3x-2y=4,2', '3x+y=-4|x-y=2', '4x+2y=9|-4x+3y=6'];

it('elimination-cards se rend pour chaque jumla, sur l’étape « cartes »', () => {
  for (const system of SYSTEMS) {
    const html = renderToString(<EliminationCards system={system} />);
    expect(html, system).toContain('data-elimination-cards');
    expect(html).toContain('data-stage="cards"');
    expect(html).toContain('data-method=""');
    expect(html).toContain('data-eq-card="1"');
    expect(html).toContain('data-eq-card="2"');
    expect(html).toContain('data-eq-tile="x"');
    expect(html).toContain('data-eq-tile="y"');
    expect(html).toContain('data-eq-tile="c"');
    expect(html).toContain('data-scale-handle="1"');
    expect(html).toContain('data-drag-source="card:1"');
    expect(html).toContain('data-drag-source="iso:1:x"');
    expect(html).toContain('data-drop-zone="tile:2:y"');
    expect(html).toContain('data-drop-zone="tray"');
    expect(html).toContain('data-deco');
    expect(shownText(html)).not.toMatch(/manipulation\./);
    expect(html).not.toMatch(/manipulation\.eliminationCards\./);
  }
});

it('les nombres décimaux du manuel restent décimaux (4,2), et les tuiles négatives sont marquées', () => {
  const html = renderToString(<EliminationCards system="2x+y=7|3x-2y=4,2" />);
  expect(html).toContain('4,2');
  expect(html).toContain('data-negative="true"');
});

it('elimination-cards se rend dans un workspace à deux niveaux, ouvert sur متقدم (نشاط 2)', () => {
  const html = renderToString(
    <ManipulationWorkspace
      defaultLevel="advanced"
      levels={{
        beginner: () => <EliminationCards level="beginner" system="x+y=10|x-y=2" />,
        advanced: () => <EliminationCards level="advanced" system="2x+y=7|3x-2y=4,2" title="نشاط 2" />,
      }}
    />,
  );
  expect(html).toContain('data-system="2x+y=7|3x-2y=4,2"');
  expect(html).toContain('data-system="x+y=10|x-y=2"');
  expect(shownText(html)).not.toMatch(/manipulation\./);
});
