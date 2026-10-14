import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import RatioRide from './RatioRide';
import ManipulationWorkspace from '../ManipulationWorkspace';
import manipulationAr from '../../../../i18n/locales/ar/lesson.manipulation.json';
import source from './RatioRide.jsx?raw';

/**
 * ratio-ride se rend à ses deux niveaux (un tarif / deux tarifs), seul et dans un workspace à deux
 * niveaux, sans clé i18n brute, avec la trottinette-poignée, −/+, « سجّل الرحلة », le compteur de chaque
 * tarif, les boutons de jugement et le décor.
 */
it('ratio-ride se rend avec un tarif puis deux, sans clé brute', () => {
  for (const plans of ['15x', '15x|10x+50']) {
    const html = renderToString(<RatioRide plans={plans} />);
    expect(html, plans).toContain('data-ratio-ride');
    expect(html).toContain(`data-plans="${plans}"`);
    expect((html.match(/data-stretch-handle/g) ?? []).length).toBe(1);
    expect(html).toContain('data-ride-handle');
    expect(html).toContain('data-ride-less');
    expect(html).toContain('data-ride-more');
    expect(html).toContain('data-ride-record');
    expect(html).toContain('data-ride-meter="A"');
    expect(html).toContain('data-ride-claim="A:yes"');
    expect(html).toContain('data-ride-claim="A:no"');
    expect(html).toContain('data-deco="scooter"');
    expect(html).toContain('data-deco="palms"');
    // la légende du lieu n'est posée qu'au-delà de 340 px (le rendu serveur mesure 300 px : la mise en page étroite)
    expect(html).toContain('data-layout="narrow"');
    expect(html).toContain('data-ride-overlay');
    expect(html).toContain('15DA للدقيقة');
    expect(html).not.toMatch(/manipulation\.[a-zA-Z]/);
    if (plans.includes('|')) {
      expect(html).toContain('data-ride-meter="B"');
      expect(html).toContain('data-ride-claim="B:no"');
      expect(html).toContain('data-ride-reveal');
      expect(html).toContain('50DA لفتح القفل + 10DA للدقيقة');
      expect(html).toContain('aria-valuemax="20"');
    } else {
      expect(html).not.toContain('data-ride-reveal');
      expect(html).toContain('aria-valuemax="10"');
    }
  }
});

it('ratio-ride se rend dans un workspace à deux niveaux', () => {
  const html = renderToString(
    <ManipulationWorkspace
      levels={{
        beginner: () => <RatioRide level="beginner" plans="15x" />,
        advanced: () => <RatioRide level="advanced" plans="15x|10x+50" />,
      }}
    />,
  );
  expect(html).toContain('data-plans="15x"');
  expect(html).toContain('data-plans="15x|10x+50"');
});

it('chaque clé que le composant lit existe (aucune clé brute à l’écran)', () => {
  const ns = manipulationAr.ratioRide;
  const own = [...source.matchAll(/\bk\('([a-zA-Z0-9]+)'/g)].map((m) => m[1]);
  const ternary = [...source.matchAll(/\?\s*'([a-zA-Z0-9]+)'\s*:\s*'([a-zA-Z0-9]+)'/g)].flatMap((m) => [m[1], m[2]])
    .filter((key) => /^(planA|planB|missionOne|missionTwo|hint2|hint2Two|claimYes|claimNo|claimYesAria|claimNoAria|judgedYes|judgedNo)$/.test(key));
  expect(own.length).toBeGreaterThan(30);
  for (const key of [...own, ...ternary]) {
    expect(ns[key] ?? ns[`${key}_other`], `manipulation.ratioRide.${key}`).toBeTypeOf('string');
  }
  for (const key of ['vYesRefused', 'vYesRefusedZero', 'vNoOk', 'vNoOkZero']) expect(ns[key]).toBeTypeOf('string');
  for (const key of ['place', 'planLinear', 'planAffine']) expect(ns.worlds.scooter[key]).toBeTypeOf('string');
  for (const form of ['zero', 'one', 'two', 'few', 'many', 'other']) {
    expect(ns[`minutes_${form}`]).toBeTypeOf('string');
    expect(ns[`repNote_${form}`]).toBeTypeOf('string');
  }
});

it('valeurs par défaut : la trottinette s’ouvre sur une durée (1 minute), aucune colonne enregistrée', () => {
  const html = renderToString(<RatioRide plans="15x" levels={false} />);
  expect(html).toContain('data-x="1"');
  expect(html).toMatch(/data-columns=""/);
});
