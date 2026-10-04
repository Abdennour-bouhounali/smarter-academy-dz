import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import RouteCompare from './RouteCompare';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * route-compare se rend aux deux niveaux de levels.js (le rallye du Sahara ; le cross des Sablettes de la وضعية), seul et
 * dans un workspace, sans clé i18n brute, sans interpolation oubliée, et sans aucune longueur écrite avant la construction.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('route-compare — rendu', () => {
  it('advanced (وضعية) : le cross, le pari d’abord, les deux montres à zéro — la réponse nulle part', () => {
    const html = renderToString(<RouteCompare theme="cross" {...LEVELS['route-compare'].advanced.numbers} />);
    expect(html).toContain('data-route-compare');
    expect(html).toContain('data-world="cross"');
    expect(html).toContain('data-stage="bet"');
    expect(html).toContain('data-rc-glance');
    expect(html).toContain('data-rc-bet="1"');
    expect(html).toContain('data-rc-bet="2"');
    expect(html).toContain('data-rc-watch="1"');
    expect(html).toContain('data-deco="cross"');
    expect(html).not.toContain('data-rc-pin');
    for (const leak of ['9,42', '9{,}42', '9,96', '9{,}96', '3\\pi', '\\sqrt{13}']) expect(html).not.toContain(leak);
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('beginner : le rallye, les balises', () => {
    const html = renderToString(<RouteCompare theme="rally" level="beginner" {...LEVELS['route-compare'].beginner.numbers} />);
    expect(html).toContain('data-world="rally"');
    expect(html).toContain('data-deco="rally"');
    expect(html).not.toContain('8,28');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('numbers groupés (contrat de la leçon) et workspace : deux niveaux montés, des ids SVG distincts', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <RouteCompare level="beginner" theme="rally" numbers={LEVELS['route-compare'].beginner.numbers} />,
        advanced: () => <RouteCompare level="advanced" theme="cross" numbers={LEVELS['route-compare'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-route-compare="true"/g) ?? []).length).toBe(2);
    const ids = [...html.matchAll(/ id="(rc[A-Za-z]+[^"]*)"/g)].map((m) => m[1]);
    expect(ids.length).toBe(2);
    expect(new Set(ids).size).toBe(2);
    expect(html).not.toMatch(RAW);
  });
});
