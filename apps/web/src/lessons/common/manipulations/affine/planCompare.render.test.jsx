import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import PlanCompare from './PlanCompare';
import ManipulationWorkspace from '../ManipulationWorkspace';

/**
 * plan-compare se rend pour CHAQUE monde × 1, 2 et 3 formules avec les props du contrat de l'unité
 * (brief §6) — exactement celles que la leçon 5 et la synthèse passent — sans clé i18n brute.
 * La synthèse (thème « rental », jusqu'à trois formules) s'appuie sur ce test.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const THEMES = ['stadium', 'gaming', 'rental'];
const CASES = {
  1: { plans: '150x+500', mode: 'model' },
  2: { plans: '200x+2000|400x', mode: 'model|compare', ask: 'x:7|y:4800' },
  3: { plans: '300x|150x+500|2400', mode: 'compare', xMax: '16' },
};

describe('plan-compare — chaque monde × 1, 2, 3 formules', () => {
  for (const theme of THEMES) {
    for (const n of [1, 2, 3]) {
      it(`${theme} × ${n}`, () => {
        const html = renderToString(<PlanCompare {...CASES[n]} theme={theme} />);
        expect(html).toContain('data-plan-compare');
        expect(html).toContain(`data-theme="${theme}"`);
        expect(html).toContain('data-pc-glance');
        expect(html).toContain('data-pc-plane');
        expect(html).toContain('data-pc-strip');
        expect(html).toContain(`data-deco="${theme}"`);
        expect(html).not.toMatch(RAW);
        expect(html).not.toContain('{{');
        if (n === 3) {
          // comparer seul : les trois barres et les trois droites tout de suite, la marque à poser
          expect(html).toContain('data-stage="compare"');
          expect(html).toContain('data-step="mark"');
          for (const id of ['A', 'B', 'C']) {
            expect(html).toContain(`data-pc-bar="${id}"`);
            expect(html).toContain(`data-pc-line="${id}"`);
          }
          expect(html).toContain('data-pc-pin');
          expect(html).toContain('data-pc-nocross');
        } else {
          // modéliser d'abord : la facture, ses deux cases, les deux montants
          expect(html).toContain('data-stage="model"');
          expect(html).toContain('data-step="build"');
          expect(html).toContain('data-drop-zone="slot:once"');
          expect(html).toContain('data-drop-zone="slot:each"');
          expect(html).toContain('data-drag-source="chip:fixed"');
          expect(html).toContain('data-drag-source="chip:unit"');
          expect(html).toContain('data-pc-check');
          expect(html).not.toContain('data-pc-line=');
        }
      });
    }
  }
});

describe('plan-compare — ce que le contrat promet', () => {
  it('نشاط 4 : les mots du stade, les deux cibles, le budget 4800 tracé, la piste x fermée avant le modèle', () => {
    const html = renderToString(<PlanCompare {...CASES[2]} theme="stadium" />);
    expect(html).toContain('الاشتراك السنوي 2000DA');
    expect(html).toContain('دخول مقابلة 200DA');
    expect(html).toContain('عدد المقابلات x');
    expect(html).toContain('data-pc-budget="4800"');
    expect(html).toContain('data-disabled="true"');
    expect(html).toContain('f(x) = 0');
  });

  it('les mondes parlent leur langue : heures de jeu, heures de location', () => {
    expect(renderToString(<PlanCompare {...CASES[1]} theme="gaming" />)).toContain('البطاقة الشهرية 500DA');
    expect(renderToString(<PlanCompare {...CASES[1]} theme="rental" />)).toContain('الرسم الثابت 500DA');
  });

  it('dans un workspace, les deux niveaux se rendent ensemble', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <PlanCompare level="beginner" plans="150x+500" mode="model" theme="gaming" />,
        advanced: () => <PlanCompare {...CASES[2]} theme="stadium" />,
      }} />,
    );
    expect((html.match(/data-plan-compare/g) ?? []).length).toBe(2);
    expect(html).not.toMatch(RAW);
  });

  it('un contenu faux est une erreur de rendu', () => {
    expect(() => renderToString(<PlanCompare plans="200x+2000" mode="model" ask="y:4900" />)).toThrow();
    expect(() => renderToString(<PlanCompare plans="2x+1|2x+1" mode="compare" />)).toThrow();
  });
});
