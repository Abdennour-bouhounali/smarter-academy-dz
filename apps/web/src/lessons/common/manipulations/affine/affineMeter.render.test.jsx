import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import AffineMeter from './AffineMeter';
import ManipulationWorkspace from '../ManipulationWorkspace';
import lessonAr from '../../../../i18n/locales/ar/lesson.json';
import source from './AffineMeter.jsx?raw';

/**
 * affine-meter se rend à ses deux niveaux (la course en taxi-application, la paie du نشاط 1), seul et
 * dans un workspace, sans clé i18n brute, avec la poignée de x, −/+, le compteur (bloc b + tuiles), le
 * bloc « d'un seul regard » et le décor.
 */
it('affine-meter se rend aux deux niveaux, sans clé brute', () => {
  const cases = [
    { rule: '40x+100', mode: 'image', theme: 'ride' },
    { rule: '185x+35000', mode: 'image|antecedent|classify', target: '37775', marks: '5|8|10|12|15', theme: 'payroll' },
  ];
  for (const c of cases) {
    const html = renderToString(<AffineMeter {...c} />);
    expect(html, c.rule).toContain('data-affine-meter');
    expect(html).toContain(`data-rule="${c.rule}"`);
    expect(html).toContain('data-am-glance');
    expect((html.match(/data-stretch-handle/g) ?? []).length).toBe(1); // les boutons a et b n'existent qu'à l'étape classify
    expect(html).toContain('data-am-handle');
    expect(html).toContain('data-am-less');
    expect(html).toContain('data-am-more');
    expect(html).toContain('data-am-meter');
    expect(html).toContain('data-am-base');
    expect(html).toContain('data-am-screen');
    expect(html).toContain(`data-world="${c.theme}"`);
    expect(html).toContain('data-lab-fold="affine-meter.trials"');
    expect(html).not.toMatch(/manipulation\.[a-zA-Z]/);
    if (c.theme === 'payroll') {
      expect(html).toContain('data-deco="timecard"');
      expect(html).toContain('data-am-stage-tab="antecedent"');
      expect(html).toContain('data-am-mark="15"');
      expect(html).toContain('aria-valuemax="20"');
    } else {
      expect(html).toContain('data-deco="car"');
      expect(html).toContain('data-deco="street"');
      expect(html).not.toContain('data-am-stage-tab');
      expect(html).toContain('aria-valuemax="12"');
    }
  }
});

it('affine-meter se rend dans un workspace à deux niveaux', () => {
  const html = renderToString(
    <ManipulationWorkspace
      defaultLevel="advanced"
      levels={{
        beginner: () => <AffineMeter level="beginner" rule="40x+100" mode="image" theme="ride" />,
        advanced: () => <AffineMeter level="advanced" rule="185x+35000" mode="image|antecedent|classify" target="37775" marks="5|8|10|12|15" theme="payroll" />,
      }}
    />,
  );
  expect(html).toContain('data-rule="40x+100"');
  expect(html).toContain('data-rule="185x+35000"');
});

it('une cible sans antécédent entier est une faute de la leçon (erreur au rendu)', () => {
  expect(() => renderToString(<AffineMeter rule="185x+35000" mode="image|antecedent" target="37000" />)).toThrow();
});

it('chaque clé que le composant lit existe (aucune clé brute à l’écran)', () => {
  const ns = lessonAr.manipulation.affineMeter;
  const own = [...source.matchAll(/\bk\('([a-zA-Z0-9_]+)'/g)].map((m) => m[1]);
  expect(own.length).toBeGreaterThan(15);
  for (const key of own) expect(ns[key], `manipulation.affineMeter.${key}`).toBeTypeOf('string');
  const dyn = ['stage_image', 'stage_antecedent', 'stage_classify', 'vStage_image', 'vStage_antecedent', 'vStage_classify',
    'vKnobs_affine', 'vKnobs_linear', 'vKnobs_constant', 'kind_affine', 'kind_linear', 'kind_constant',
    'knobLess_a', 'knobMore_a', 'knobLess_b', 'knobMore_b', 'next_image', 'next_antecedent', 'dRight', 'dRightInverse',
    'hint2', 'hint2Marks', 'hint3', 'hint3Target', 'dWhyPropZero', 'dWhyPropDouble', 'vBelow', 'vAbove'];
  for (const key of dyn) expect(ns[key], key).toBeTypeOf('string');
  const worldKeys = [...source.matchAll(/\bw\('([a-zA-Z0-9_]+)'/g)].map((m) => m[1]);
  for (const world of ['ride', 'payroll']) {
    for (const key of [...worldKeys.filter((key) => key !== 'units'), 'mission', 'missionMulti', 'less', 'more']) expect(ns.worlds[world][key], `${world}.${key}`).toBeTypeOf('string');
    for (const form of ['zero', 'one', 'two', 'few', 'many', 'other']) expect(ns.worlds[world][`units_${form}`]).toBeTypeOf('string');
  }
});

it('affine-meter : le compteur n\'est jamais vide à l\'ouverture et « جرّب كل الإمكانيات » est offert (2026-10-09)', () => {
  const out = renderToString(<AffineMeter rule="40x+100" />);
  expect(out).not.toContain('data-am-x=""');
  expect(out).not.toContain('data-fx=""');
  expect(out).toContain('data-manipulation-autocomplete="ready"');
});
