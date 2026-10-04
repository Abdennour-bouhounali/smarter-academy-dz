import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import ComponentSteps from './ComponentSteps';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * component-steps se rend aux deux niveaux de levels.js (le quartier de la plateforme ; le نشاط 1), seul et dans le
 * workspace, sans clé i18n brute, sans interpolation oubliée et sans mot latin hors des noms de points.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const LATIN_WORD = />[^<]*\b(?:Enter|send|rider|order|code|delivery|horn)\b[^<]*</i;

describe('component-steps — rendu', () => {
  it('beginner (le quartier) : la carte, le scooter, la croix, les compteurs en direct, cinq onglets, le décor', () => {
    const html = renderToString(<ComponentSteps {...LEVELS['component-steps'].beginner.numbers} theme="delivery" />);
    expect(html).toContain('data-component-steps');
    expect(html).toContain('data-kind="walk"');
    expect(html).toContain('data-cs-glance');
    expect(html).toContain('data-cs-rider');
    expect((html.match(/data-cs-tab="/g) ?? []).length).toBe(5);
    expect(html).toContain('data-cs-step="left"');
    expect(html).toContain('data-cs-column');
    expect(html).toContain('data-live="true"');
    expect((html.match(/data-cs-count="/g) ?? []).length).toBe(2);
    expect(html).toContain('data-cs-place="A"');
    expect(html).toContain('data-cs-place="B"');
    expect(html).toContain('data-cs-axes');
    expect(html).toContain('data-deco="city"');
    expect(html).toContain('data-deco="horn"');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
    expect(html).not.toMatch(LATIN_WORD);
  });

  it('advanced (نشاط 1) : A → B sans compteurs (« ؟ »), le point C du manuel n’est pas un lieu de commande', () => {
    const html = renderToString(<ComponentSteps {...LEVELS['component-steps'].advanced.numbers} theme="delivery" />);
    expect(html).toContain('data-kind="walkCode"');
    expect(html).toContain('data-live="false"');
    expect(html).toContain('؟');
    expect(html).toContain('data-cs-tab="AB"');
    expect(html).toContain('data-cs-tab="u"');
    expect(html).not.toContain('data-cs-place="D"'); // D hors figure tant que BD n'est pas livré
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <ComponentSteps level="beginner" {...LEVELS['component-steps'].beginner.numbers} />,
        advanced: () => <ComponentSteps level="advanced" {...LEVELS['component-steps'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-component-steps/g) ?? []).length).toBe(2);
    expect(html).not.toMatch(RAW);
  });
});
