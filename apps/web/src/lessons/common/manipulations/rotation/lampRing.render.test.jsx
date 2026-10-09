import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import LampRing from './LampRing';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * lamp-ring se rend aux deux niveaux de levels.js (4 poteaux sur 2 m ; la وضعية, 6 poteaux sur 3 m), seul et dans un workspace,
 * sans clé i18n brute, sans interpolation oubliée, et sans la distance écrite avant que l'élève ne l'ait trouvée.
 */
const RAW = /manipulation\.[a-zA-Z]/;

describe('lamp-ring — rendu', () => {
  it('advanced (وضعية) : le jardin la nuit, six poteaux en tas, phase « à la main », lampes éteintes — la réponse nulle part', () => {
    // Les indices sont désormais affichés d'emblée (méthode générale, jamais la valeur) : la fuite se mesure hors d'eux.
    const html = renderToString(<LampRing {...LEVELS['lamp-ring'].advanced.numbers} />).replace(/<ol[^>]*data-manipulation-hints[\s\S]*?<\/ol>/, '');
    expect(html).toContain('data-lamp-ring');
    expect(html).toContain('data-world="flower-bed"');
    expect(html).toContain('data-phase="hand"');
    expect(html).toContain('data-lit=""');
    expect(html).toContain('data-lr-glance');
    expect(html).toContain('data-lr-light');
    expect(html).not.toContain('data-lr-to-rotate');
    expect((html.match(/data-lr-post="/g) ?? []).length).toBe(6);
    expect(html).toContain('data-deco="flower-bed"');
    expect(html).not.toContain('data-on="true"');
    for (const leak of ['60°', '60^\\circ', 'd = 3', '2\\sin', 'data-lr-card']) expect(html).not.toContain(leak);
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('beginner : quatre poteaux sur 2 m, aucune distance exacte écrite', () => {
    const html = renderToString(<LampRing level="beginner" {...LEVELS['lamp-ring'].beginner.numbers} />);
    expect((html.match(/data-lr-post="/g) ?? []).length).toBe(4);
    expect(html).toContain('data-r="2"');
    expect(html).not.toContain('\\sqrt{2}');
    expect(html).not.toContain('2,83');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('numbers groupés (contrat de la leçon) et workspace : deux niveaux montés, des ids SVG distincts', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <LampRing level="beginner" theme="flower-bed" numbers={LEVELS['lamp-ring'].beginner.numbers} />,
        advanced: () => <LampRing level="advanced" theme="flower-bed" numbers={LEVELS['lamp-ring'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-lamp-ring="true"/g) ?? []).length).toBe(2);
    const ids = [...html.matchAll(/ id="(lr[A-Za-z]+[^"]*)"/g)].map((m) => m[1]);
    expect(ids.length).toBe(8);
    expect(new Set(ids).size).toBe(8);
    expect(html).not.toMatch(RAW);
  });
});
