import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import StatBalance from './StatBalance';
import ManipulationWorkspace from '../ManipulationWorkspace';
import * as L from '../logic/statBalance';

/**
 * stat-balance se rend pour CHAQUE mode × CHAQUE monde avec les props du contrat de l'unité (brief §6) —
 * exactement celles que la leçon 2 et la synthèse passent — sans clé i18n brute. La synthèse (`medals`,
 * `mode="hidden"`, 30 pays dont onze à 1 médaille, poutre 0 → 32) s'appuie sur ce test.
 */
const RAW = /manipulation\.[a-zA-Z]/;
const EL_OUED = '40|35|34|41|48|37|35|46|37|40';
const ESPORT = '2|3|3|4|8';
const CONTRACT = {
  'range|mean': { series: EL_OUED, mode: 'range|mean' },
  'mean|median': { series: ESPORT, mode: 'mean|median' },
  'range|mean|median': { series: EL_OUED, mode: 'range|mean|median' },
  median: { series: ESPORT, mode: 'median' },
};
/** La synthèse (L5) — `content/textbook.js › LAB` y écrit exactement ceci. */
const MEDALS = {
  series: '1:11|2:3|?:2|4:1|5:2|6:2|7:1|11:1|13:1|14:2|16:1|26:1|?:1|32:1',
  mode: 'hidden', hidden: '2:2-4|12:26-32', targetMean: '7', targetMedian: '3', unit: 'ميدالية', axis: '0:32:4', theme: 'medals',
};
const THEMES = ['esport', 'heatwave', 'medals'];
const FIRST = { range: 'range', mean: 'mean', median: 'median' };

describe('stat-balance — chaque mode × chaque monde', () => {
  for (const [name, props] of Object.entries(CONTRACT)) {
    for (const theme of THEMES) {
      it(`${name} × ${theme}`, () => {
        const html = renderToString(<StatBalance {...props} theme={theme} />);
        expect(html).toContain('data-stat-balance');
        expect(html).toContain(`data-theme="${theme}"`);
        expect(html).toContain(`data-stage="${FIRST[name.split('|')[0]]}"`);
        expect(html).toContain('data-sb-glance');
        expect(html).toContain('data-sb-scene');
        expect(html).toContain('data-sb-controls');
        expect(html).toContain(`data-deco="${theme}"`);
        expect(html).not.toMatch(RAW);
        expect(html).not.toContain('{{');
        expect(html).not.toContain('NaN');
        const n = props.series.split('|').length;
        expect((html.match(/data-sb-token=/g) ?? []).length).toBe(n);
      });
    }
  }
});

describe('stat-balance — ce que chaque étape pose', () => {
  it('range (El Oued) : deux mâchoires serrées au centre, des valeurs dehors, la largeur écrite', () => {
    const html = renderToString(<StatBalance {...CONTRACT['range|mean']} theme="heatwave" />);
    expect(html).toContain('data-sb-jaw="lo"');
    expect(html).toContain('data-sb-jaw="hi"');
    expect(html).toContain('data-sb-handle="lo"');
    expect(html).toContain('data-sb-handle="hi"');
    expect(html).toContain('data-side="out"');
    expect(html).toContain('خارج الكلّاب');
    expect(html).toContain('data-sb-stage-tab="mean"');
    expect(html).not.toContain('data-sb-curtain');
    // l'appui part du milieu de l'étendue (41), la poutre penche
    expect(html).toContain('data-p="41"');
    expect(html).toContain('data-tilt="left"');
  });

  it('mean (mini-tournoi) : l’appui, ses −/+, les deux sommes de distances ; la poutre penche (5 ≠ 4)', () => {
    const html = renderToString(<StatBalance {...CONTRACT['mean|median']} />);
    expect(html).toContain('data-sb-handle="fulcrum"');
    expect(html).toContain('data-sb-less="fulcrum"');
    expect(html).toContain('data-sb-more="fulcrum"');
    expect(html).toContain('data-sb-sums');
    expect(html).toContain('data-p="5"');
    expect(html).toContain('data-tilt="left"');
    expect(html).not.toContain('data-sb-formal');
  });

  it('median seul : la poutre de niveau à la moyenne (apprise), le rideau tout à gauche, les effectifs', () => {
    const html = renderToString(<StatBalance {...CONTRACT.median} />);
    expect(html).toContain('data-sb-curtain');
    expect(html).toContain('data-c="0"');
    expect(html).toContain('data-locked="false"');
    expect(html).toContain('data-tilt="level"');
    expect(html).toContain('data-sb-counts');
    expect(html).toContain('data-sb-stage-tab="contrast"');
  });

  it('les unités : °C dans un îlot KaTeX, un mot arabe en texte', () => {
    const heat = renderToString(<StatBalance {...CONTRACT['range|mean']} theme="heatwave" />);
    expect(heat).toContain('درجات الحرارة القصوى بمدينة الوادي');
    expect(heat).toContain('katex');
    const medals = renderToString(<StatBalance {...MEDALS} />);
    expect(medals).toContain('عدد الميداليات الذهبية لكل دولة');
  });
});

describe('stat-balance — le contrat de la synthèse (medals, hidden)', () => {
  it('30 jetons, deux valeurs cachées à poser, deux cibles, l’appui fixé à 7, le rideau sur la médiane courante', () => {
    const html = renderToString(<StatBalance {...MEDALS} />);
    expect((html.match(/data-sb-token=/g) ?? []).length).toBe(30);
    expect(html).toContain('data-stage="hidden"');
    expect(html).toContain('data-sb-handle="hole-0"');
    expect(html).toContain('data-sb-handle="hole-1"');
    expect(html).toContain('data-sb-target="median"');
    expect(html).toContain('data-sb-target="mean"');
    expect(html).toContain('data-ok="false"');
    expect(html).toContain('data-p="7"');
    expect(html).toContain('data-sb-curtain');
    expect(html).toContain('data-c="30"');
    expect(html).not.toMatch(RAW);
    expect(html).not.toContain('NaN');
    // les jetons cachés partent de leur borne basse : 2 et 26
    expect(html).toContain('data-sb-token="2.0" data-v="2"');
    expect(html).toContain('data-sb-token="12.0" data-v="26"');
  });

  it('d’un seul regard : la poutre des médailles (onze jetons empilés) tient avec ses commandes dans le budget', () => {
    const html = renderToString(<StatBalance {...MEDALS} />);
    const num = (attr) => Number(html.match(new RegExp(`${attr}="(\\d+)"`))[1]);
    const h = num('data-h');
    const budget = num('data-budget');
    const ctrl = num('data-ctrl-h');
    expect(num('data-token')).toBeGreaterThanOrEqual(5);
    expect(h + ctrl + 12).toBeLessThanOrEqual(budget);
    // la géométrie pure, aux largeurs d'un téléphone (320 → 260 px de scène) et d'un portable
    const lab = L.init(MEDALS);
    for (const width of [240, 260, 300, 420, 700]) {
      const g = L.beamLayout(lab, { width, height: 300, reserved: 112 });
      expect(g.tall).toBe(11);
      expect(g.tall * g.token).toBeLessThanOrEqual(300 - 112);
    }
  });

  it('320×640 (régression unit e2e, synthèse avancée : 576 px pour 568) : commandes compactes, total ≤ 540 px', () => {
    const html = renderToString(<StatBalance {...MEDALS} />);
    // les deux pavés −/+ côte à côte (une grille), une ligne courte chacun ; pas de verdict doublé ni de \dfrac haut
    expect((html.match(/data-sb-hole=/g) ?? []).length).toBe(2);
    expect(html).toContain('grid-template-columns:repeat(2, minmax(0, 1fr))');
    expect(html).toContain('min-h-[1.25rem]');
    const chips = html.slice(html.indexOf('data-sb-target="median"'), html.indexOf('</ul>', html.indexOf('data-sb-target="median"')));
    expect(chips).not.toContain('mfrac');
    expect(chips).toContain('6,87');
    // le budget mesuré au navigateur (port 5186, 2026-10-02) : commandes 253 px, titre 30 px, écart 12 px, à 320 px
    // (scène ≈ 288 px) ; la poutre de 30 médailles tient dans le reste avec ≥ 5 px par jeton
    const lab = L.init(MEDALS);
    const CTRL = 253; const TITLE = 30; const GAP = 12; const TARGET = 540;
    const reserved = 2 * 14 + 16 + 6 + 18 + 22 + 6;
    const g = L.beamLayout(lab, { width: 288, height: TARGET - CTRL - TITLE - GAP, reserved, maxToken: 34 });
    const H = reserved + g.tall * g.token;
    expect(g.token).toBeGreaterThanOrEqual(5);
    expect(TITLE + H + GAP + CTRL).toBeLessThanOrEqual(TARGET);
  });

  it('un contrat faux est une erreur de contenu', () => {
    expect(() => renderToString(<StatBalance {...MEDALS} targetMean={undefined} />)).toThrow();
    expect(() => renderToString(<StatBalance series={MEDALS.series} mode="mean" />)).toThrow();
    expect(() => renderToString(<StatBalance series="5" mode="mean" />)).toThrow();
  });
});

describe('stat-balance — dans un workspace, les deux niveaux de la leçon', () => {
  it('مبتدئ (esport) et متقدم (heatwave) se rendent ensemble', () => {
    const html = renderToString(
      <ManipulationWorkspace defaultLevel="advanced" levels={{
        beginner: () => <StatBalance level="beginner" series={ESPORT} mode="range|mean" theme="esport" />,
        advanced: () => <StatBalance level="advanced" series={EL_OUED} mode="range|mean" theme="heatwave" />,
      }} />,
    );
    expect((html.match(/data-stat-balance/g) ?? []).length).toBe(2);
    expect(html).toContain('data-theme="esport"');
    expect(html).toContain('data-theme="heatwave"');
    expect(html).not.toMatch(RAW);
  });
});
