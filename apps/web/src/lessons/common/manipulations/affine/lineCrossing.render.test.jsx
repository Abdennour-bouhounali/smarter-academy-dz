import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import LineCrossing from './LineCrossing';

/**
 * line-crossing se rend pour chaque monde et chaque point d'entrée, avec les props que la leçon 4
 * (tafsir-bayani-jumla) passe — sans clé i18n brute, avec le bloc « d'un seul regard » mesuré par l'e2e.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const ACT5 = { system: 'x+y=43|100x+200y=5000', cases: 'true', theme: 'coins' };
const BEG = { system: '2x-y=1|x+y=5', theme: 'laser' };
const CASES = { system: 'x+y=3|2x-y=0', startWith: 'cases', theme: 'laser', levels: false };

describe('line-crossing — rendu', () => {
  it('نشاط 5 (coins) : l’équation (1) à écrire, quatre cartes, le monde du manuel, le bloc mesuré', () => {
    const html = renderToString(<LineCrossing {...ACT5} />);
    expect(html).toContain('data-line-crossing');
    expect(html).toContain('data-stage="build"');
    expect(html).toContain('data-theme="coins"');
    expect(html).toContain('data-lc-glance');
    expect(html).toContain('data-lc-plane');
    expect((html.match(/data-lc-card="0:/g) ?? []).length).toBe(4);
    expect(html).toContain('data-lc-build="1"');
    expect(html).not.toContain('data-lc-eq=');
    expect(html).toContain('data-deco="coins"');
    expect(html).toContain('عدد قطع 100DA');
    expect(html).not.toContain('data-lc-line=');
    expect(html).not.toContain('data-lc-pin');
    expect(html).not.toMatch(RAW);
  });

  it('مبتدئ (laser) : le monde du spectacle, pas encore de point', () => {
    const html = renderToString(<LineCrossing {...BEG} />);
    expect(html).toContain('data-theme="laser"');
    expect(html).toContain('data-deco="laser"');
    expect(html).not.toMatch(RAW);
  });

  it('startWith="cases" (معارف) : les deux droites tracées, P, les deux lampes, les pistes p et m', () => {
    const html = renderToString(<LineCrossing {...CASES} />);
    expect(html).toContain('data-stage="cases"');
    expect(html).toContain('data-lc-line="1"');
    expect(html).toContain('data-lc-line="2"');
    expect(html).toContain('data-lc-eq="1"');
    expect(html).toContain('data-lc-eq="2"');
    expect(html).toContain('data-lc-pin');
    expect(html).toContain('data-lc-lamp="1"');
    expect(html).toContain('data-lc-lamp="2"');
    expect(html).toContain('data-lc-strip="p"');
    expect(html).toContain('data-lc-strip="m"');
    expect(html).toContain('data-lc-rel="unique"');
    expect(html).not.toContain('data-lc-back');
    expect(html).not.toMatch(RAW);
  });

  it('un contenu invalide est une erreur', () => {
    expect(() => renderToString(<LineCrossing system="x=3|x+y=2" />)).toThrow();
  });
});
