import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import BucketFill from './BucketFill';
import ManipulationWorkspace from '../ManipulationWorkspace';
import { LEVELS } from '../levels';

/**
 * bucket-fill se rend aux deux niveaux de levels.js (le petit seau plein de la plateforme ; le تحدّ du manuel), seul et dans un
 * workspace : sans WebGL (rendu serveur), la fenêtre 3D montre son repli SpaceFigure et TOUTES les commandes sont là ; aucune
 * clé i18n brute, aucune interpolation oubliée, et aucun résultat écrit avant que l'élève ne l'ait trouvé.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const LEAKS = ['SO = 105', '{105}', '24388', '25\\,539', '25{,}54', '\\dfrac{15}{19}', 'data-bf-card', 'data-bf-to-apex'];

describe('bucket-fill — rendu', () => {
  it('advanced (le تحدّ) : la plage, le seau au repli, phase « مستوى الماء », le curseur et « ثبّت » — la réponse nulle part', () => {
    const html = renderToString(<BucketFill {...LEVELS['bucket-fill'].advanced.numbers} />);
    expect(html).toContain('data-bucket-fill');
    expect(html).toContain('data-world="beach-bucket"');
    expect(html).toContain('data-phase="level"');
    expect(html).toContain('data-bf-glance');
    expect(html).toContain('data-stage3d');
    expect(html).toContain('data-stage3d-fallback');
    expect(html).toContain('data-space-figure');
    expect(html).toContain('data-bf-level-slider');
    expect(html).toContain('data-bf-level-minus');
    expect(html).toContain('data-bf-level-plus');
    expect(html).toContain('data-bf-fix');
    expect(html).toContain('data-deco="beach-bucket"');
    expect(html).toContain('data-bf-depth="14"');
    for (const leak of LEAKS) expect(html).not.toContain(leak);
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('beginner : le petit seau (r = 3, R = 4, H = 6) à remplir jusqu’au bord, sans 74π ni 18', () => {
    const html = renderToString(<BucketFill level="beginner" {...LEVELS['bucket-fill'].beginner.numbers} />);
    expect(html).toContain('data-phase="level"');
    expect(html).toContain('max="6"');
    expect(html).not.toContain('74\\pi');
    expect(html).not.toContain('SO = 18');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('{{');
  });

  it('numbers groupés (contrat de la leçon) et workspace : deux niveaux montés, des ids SVG distincts', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <BucketFill level="beginner" theme="beach-bucket" numbers={LEVELS['bucket-fill'].beginner.numbers} />,
        advanced: () => <BucketFill level="advanced" theme="beach-bucket" numbers={LEVELS['bucket-fill'].advanced.numbers} />,
      }} />,
    );
    expect((html.match(/data-bucket-fill="true"/g) ?? []).length).toBe(2);
    const ids = [...html.matchAll(/ id="(bf[A-Za-z]+[^"]*)"/g)].map((m) => m[1]);
    expect(ids.length).toBe(6);
    expect(new Set(ids).size).toBe(6);
    expect(html).not.toMatch(RAW);
  });
});
