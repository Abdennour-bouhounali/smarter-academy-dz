import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import OriginLine from './OriginLine';

/**
 * origin-line se rend pour CHAQUE mode × CHAQUE monde avec les props du contrat de l'unité (brief §6),
 * exactement celles que les leçons 3, 5 et 6 passent — sans clé i18n brute. Les leçons 5 (ressort) et
 * 6 (budget) s'appuient sur ce test : un prop du contrat qui casse ici casse leur module.
 */
const RAW = /manipulation\.[a-zA-Z]/;

/** Les props du contrat, par mode (fenêtres et cibles des trois leçons). */
const CONTRACT = {
  draw: { a: '0,5', mode: 'draw' },
  read: { a: '0,4', mode: 'read', reads: 'x:4|y:3,5', xMin: '0', xMax: '10', yMin: '0', yMax: '5' },
  fit: { mode: 'fit', points: '2:0,6|3:0,9|4:1,2|5:1,5', xMin: '0', xMax: '7', yMin: '0', yMax: '3' },
  pivot: { mode: 'pivot' },
};
const BUDGET = { a: '3,8', mode: 'read', cap: '2000', xMin: '0', xMax: '700', yMin: '0', yMax: '2600' };
const THEMES = ['cablecar', 'spring', 'budget'];

describe('origin-line — chaque mode × chaque monde', () => {
  for (const mode of Object.keys(CONTRACT)) {
    for (const theme of THEMES) {
      it(`${mode} × ${theme}`, () => {
        const html = renderToString(<OriginLine {...CONTRACT[mode]} theme={theme} />);
        expect(html).toContain('data-origin-line');
        expect(html).toContain(`data-mode="${mode}"`);
        expect(html).toContain(`data-theme="${theme}"`);
        expect(html).toContain('data-ol-plane');
        expect(html).toContain('data-ol-origin');
        expect(html).toContain('data-ol-controls');
        expect(html).not.toMatch(RAW);
        // les mots de l'axe viennent du monde (DOM, arabe)
        if (theme === 'spring') expect(html).toContain('الكتلة x (g)');
        if (theme === 'budget') expect(html).toContain('سعر تذكرة البالغ x (DA)');
        if (theme === 'cablecar') expect(html).toContain('محور الفواصل');
      });
    }
  }
});

describe('origin-line — ce que chaque mode pose', () => {
  it('draw (نشاط 3) : l\'épingle, ses quatre flèches, « ضع النقطة », la sonde x fermée tant que (OA) n\'existe pas', () => {
    const html = renderToString(<OriginLine {...CONTRACT.draw} />);
    expect(html).toContain('data-ol-pin');
    for (const d of ['left', 'right', 'up', 'down']) expect(html).toContain(`data-ol-move="${d}"`);
    expect(html).toContain('data-ol-place');
    expect(html).toContain('data-ol-strip="x"');
    expect(html).toContain('data-disabled="true"');
    expect(html).not.toContain('data-ol-line=');
    expect(html).toContain('f : x \\longmapsto 0{,}5x');
  });

  it('read (طرائق ص 69) : la droite donnée, deux sondes, deux cibles, la formule cachée dans le monde du manuel', () => {
    const html = renderToString(<OriginLine {...CONTRACT.read} />);
    expect(html).toContain('data-ol-line="0,4"');
    expect(html).toContain('data-ol-strip="x"');
    expect(html).toContain('data-ol-strip="y"');
    expect(html).toContain('data-ol-target="0"');
    expect(html).toContain('data-ol-target="1"');
    expect(html).toContain('(D)');
    expect(html).not.toContain('y = 0,4x');
  });

  it('budget (leçon 6) : le plafond, la région au-dessus, la formule montrée', () => {
    const html = renderToString(<OriginLine {...BUDGET} theme="budget" />);
    expect(html).toContain('data-ol-cap="2000"');
    expect(html).toContain('الميزانية');
    expect(html).toContain('data-ol-line="3,8"');
    expect(html).toContain('data-deco="budget"');
  });

  it('fit (leçon 5) : les données, le زالق, le compteur de points traversés', () => {
    const html = renderToString(<OriginLine {...CONTRACT.fit} theme="spring" />);
    expect((html.match(/data-ol-data=/g) ?? []).length).toBe(4);
    expect(html).toContain('data-ol-strip="pivot"');
    expect(html).toContain('data-ol-hits');
    expect(html).toContain('data-deco="spring"');
  });

  it('pivot (le زالق de جيوجيبرا) : la droite tenue et son sens', () => {
    const html = renderToString(<OriginLine {...CONTRACT.pivot} />);
    expect(html).toContain('data-ol-strip="pivot"');
    expect(html).toContain('data-dir="rising"');
    expect(html).toContain('يصعد من اليسار إلى اليمين');
  });

  it('a = 9/4 (دوري الآن ص 69) se rend exactement, avec le point donné', () => {
    const html = renderToString(<OriginLine a="9/4" mode="draw" points="-2/3:-3/2" />);
    expect(html).toContain('data-ol-given="(-2/3 ; -1,5)"');
    expect(html).not.toMatch(RAW);
  });

  it('un contrat incomplet est une erreur de contenu', () => {
    expect(() => renderToString(<OriginLine mode="fit" />)).toThrow();
  });
});
