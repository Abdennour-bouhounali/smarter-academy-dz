import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import TranslationGlide from './TranslationGlide';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * translation-glide se rend aux deux niveaux de levels.js (le ciel du spectacle ; la figure du نشاط 1), seul et dans
 * le workspace, sans clé i18n brute, sans interpolation oubliée et sans texte latin hors des noms de points.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const LATIN_WORD = />[^<]*\b(?:Enter|drone|vector|image|leader)\b[^<]*</i;

describe('translation-glide — rendu', () => {
  it('beginner (show): the sky, three drones, the leader and two drones to grab, the beacon, the lamps, the decor', () => {
    const html = renderToString(<TranslationGlide {...LEVELS['translation-glide'].beginner.numbers} theme="drone-show" />);
    expect(html).toContain('data-translation-glide');
    expect(html).toContain('data-scene="show"');
    expect(html).toContain('data-tg-glance');
    expect(html).toContain('data-tg-grab="leader"');
    expect(html).toContain('data-tg-grab="drone:B"');
    expect(html).toContain('data-tg-grab="drone:C"');
    expect((html.match(/data-tg-drone=/g) ?? []).length).toBe(3);
    expect(html).toContain('data-tg-beacon');
    expect(html).toContain('data-tg-lamp="direction"');
    expect(html).toContain('data-deco="sky"');
    expect(html).toContain('data-deco="remote"');
    expect(html).not.toContain('data-tg-tabs');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
    expect(html).not.toMatch(LATIN_WORD);
  });

  it('advanced (نشاط 1): the textbook figure, four tableaux, the given arrow A ↦ G, no lamps', () => {
    const html = renderToString(<TranslationGlide {...LEVELS['translation-glide'].advanced.numbers} theme="drone-show" />);
    expect(html).toContain('data-scene="act1"');
    expect(html).toContain('data-tableau="G"');
    expect((html.match(/data-tg-tab="/g) ?? []).length).toBe(4);
    expect((html.match(/data-tg-drone=/g) ?? []).length).toBe(4);
    expect(html).toContain('data-tg-arrow="ref"');
    expect(html).toContain('data-tg-carrier');
    expect(html).toContain('data-tg-grab="drone:B"');
    expect(html).toContain('data-tg-grab="drone:C"');
    expect(html).not.toContain('data-tg-grab="leader"');
    expect(html).not.toContain('data-tg-lamps');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('inside a workspace: both levels mounted, one selector', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <TranslationGlide level="beginner" {...LEVELS['translation-glide'].beginner.numbers} />,
        advanced: () => <TranslationGlide level="advanced" {...LEVELS['translation-glide'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-translation-glide/g) ?? []).length).toBe(2);
    expect(html).not.toMatch(RAW);
  });
});
