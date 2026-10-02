import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import PercentTag from './PercentTag';
import ManipulationWorkspace from '../ManipulationWorkspace';
import lessonAr from '../../../../i18n/locales/ar/lesson.json';
import source from './PercentTag.jsx?raw';

/**
 * percent-tag se rend pour ses deux mondes (la vitrine de نشاط 5, le réservoir des طرائق), seul
 * et dans un workspace à deux niveaux, sans clé i18n brute, avec la poignée au bout de la barre,
 * les boutons زيادة / تخفيض, l'essai additif (vitrine) ou le pari et l'ajout d'un pas (réservoir),
 * et le décor.
 */
const CASES = [
  { price: '1200', steps: '+5', theme: 'mall', mode: 'single', words: ['حذاء رياضي', 'قميص المنتخب', 'زيادة بـ 5%', '1200'] },
  { price: '30', steps: '-30|+15', theme: 'tank', mode: 'chain', words: ['خزان ماء مملوء سعته', 'نُفرغ 30% منه', 'نضيف 15% مما فيه', 'رهاني على التغيّر الكلي'] },
];

it('percent-tag se rend pour chaque monde, sans clé brute', () => {
  for (const c of CASES) {
    const html = renderToString(<PercentTag price={c.price} steps={c.steps} theme={c.theme} />);
    expect(html, c.theme).toContain('data-percent-tag');
    expect(html).toContain(`data-world="${c.theme}"`);
    expect(html).toContain(`data-mode="${c.mode}"`);
    expect(html).toContain('data-percent-handle="t"');
    expect(html).toContain('data-percent-dir="up"');
    expect(html).toContain('data-percent-dir="down"');
    expect(html).toContain('data-percent-glance');
    expect(html).toContain('data-deco');
    if (c.mode === 'single') {
      expect(html).toContain('data-percent-try');
      expect((html.match(/data-percent-article=/g) ?? []).length).toBe(3);
    } else {
      expect(html).toContain('data-percent-handle="bet"');
      expect(html).toContain('data-percent-commit');
      expect(html).toContain('data-percent-tank');
    }
    for (const word of c.words) expect(html, `${c.theme}: ${word}`).toContain(word);
    expect(html).not.toMatch(/manipulation\.[a-zA-Z]/);
  }
});

it('au départ : aucune variation (0 %), le multiplicateur 1, rien de découvert', () => {
  const html = renderToString(<PercentTag price="1200" steps="+5" theme="mall" levels={false} />);
  expect(html).toContain('data-s="0"');
  expect(html).toContain('data-k="1"');
  expect(html).toContain('data-y="1200"');
  expect(html).toContain('data-solved="false"');
  expect(html).toContain('aria-valuemin="-50"');
  expect(html).toContain('aria-valuemax="50"');
});

it('percent-tag se rend dans un workspace à deux niveaux', () => {
  const html = renderToString(
    <ManipulationWorkspace
      levels={{
        beginner: () => <PercentTag level="beginner" price="1200" steps="+5" theme="mall" />,
        advanced: () => <PercentTag level="advanced" price="30" steps="-30|+15" theme="tank" />,
      }}
    />,
  );
  expect(html).toContain('data-world="mall"');
  expect(html).toContain('data-world="tank"');
});

it('chaque clé que le composant lit existe (aucune clé brute à l’écran)', () => {
  const ns = lessonAr.manipulation.percentTag;
  const own = [...source.matchAll(/\bk\('([a-zA-Z0-9.]+)'/g)].map((m) => m[1]);
  const ternary = [...source.matchAll(/\?\s*'([a-zA-Z0-9.]+)'\s*:\s*'([a-zA-Z0-9.]+)'/g)].flatMap((m) => [m[1], m[2]]);
  const arrays = ['hint1Single', 'hint2Single', 'hint3Single', 'hint1Chain', 'hint2Chain', 'hint3Chain', 'up', 'down'];
  const get = (key) => key.split('.').reduce((o, p) => o?.[p], ns);
  expect(own.length).toBeGreaterThan(30);
  for (const key of [...own, ...arrays]) expect(get(key), `manipulation.percentTag.${key}`).toBeTypeOf('string');
  for (const key of ternary.filter((x) => /^(vAdd|vBet|try|change|worlds|dPrompt|dWhy|dOpt|explanation|hint)/.test(x))) expect(get(key), key).toBeTypeOf('string');
  for (const id of ['mall', 'tank']) for (const key of ['name', 'what', 'unit']) expect(ns.worlds[id][key]).toBeTypeOf('string');
  for (const id of ['sneakers', 'jersey', 'cap', 'tank']) expect(ns.articles[id]).toBeTypeOf('string');
});
