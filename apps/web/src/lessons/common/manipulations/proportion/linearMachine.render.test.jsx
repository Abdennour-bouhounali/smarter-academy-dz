import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import LinearMachine from './LinearMachine';
import ManipulationWorkspace from '../ManipulationWorkspace';
import manipulationAr from '../../../../i18n/locales/ar/lesson.manipulation.json';
import source from './LinearMachine.jsx?raw';

/**
 * linear-machine se rend pour ses deux mondes (la remise de l'Aïd, les trois machines du نشاط 2),
 * seul et dans un workspace à deux niveaux, sans clé i18n brute, avec la trémie, les cartes (bloc
 * quasi carré), la carte vierge, la table, le cadran a, les affirmations et le décor.
 */
const CASES = [
  { rules: '0,8x', targets: '6|1,4', world: 'souk', cards: 8, words: ['آلة التخفيض', 'عيد الفطر', '20%'], claims: ['same'] },
  { rules: 'x^2|2x|2x-1', world: 'numbers', cards: 11, words: ['الآلة 1', 'الآلة 3', 'لا يوجد a يطابقها'], claims: ['same', 'none'] },
];

it('linear-machine se rend pour chaque monde, sans clé brute', () => {
  for (const c of CASES) {
    const html = renderToString(<LinearMachine rules={c.rules} targets={c.targets} theme="souk" />);
    expect(html, c.rules).toContain('data-linear-machine');
    expect(html).toContain(`data-world="${c.world}"`);
    expect(html).toContain('data-lm-hopper');
    expect(html).toContain('data-lm-dial-zone');
    expect(html).toContain('data-lm-blank');
    expect((html.match(/data-lm-card=/g) ?? []).length).toBe(c.cards);
    expect((html.match(/data-stretch-handle/g) ?? []).length).toBe(2);
    expect(html).toContain('data-lm-handle="dial"');
    expect(html).toContain('data-lm-handle="blank"');
    for (const cl of c.claims) expect(html).toContain(`data-lm-claim="${cl}"`);
    expect(html).toContain('data-deco');
    for (const word of c.words) expect(html, `${c.rules}: ${word}`).toContain(word);
    expect(html).not.toMatch(/manipulation\.[a-zA-Z]/);
  }
});

it('la remise : les étiquettes-cibles 6 et 1,4, le 0 parmi les cartes, un seul bouton d’affirmation', () => {
  const html = renderToString(<LinearMachine rules="0,8x" targets="6|1,4" levels={false} />);
  expect(html).toContain('data-lm-target="6"');
  expect(html).toContain('data-lm-target="1,4"');
  expect(html).toContain('data-lm-card="0"');
  expect(html).toContain('data-lm-card="200"');
  expect(html).not.toContain('data-lm-claim="none"');
  expect((html.match(/data-lm-machine-tab=/g) ?? []).length).toBe(0);
});

it('trois machines : trois onglets, aucune règle écrite avant la découverte', () => {
  const html = renderToString(<LinearMachine rules="x^2|2x|2x-1" levels={false} />);
  expect((html.match(/data-lm-machine-tab=/g) ?? []).length).toBe(3);
  const text = html.replace(/<[^>]+>/g, ' ');
  expect(text).not.toMatch(/x\^2|x²|2x - 1|longmapsto 2x/);
});

it('linear-machine se rend dans un workspace à deux niveaux', () => {
  const html = renderToString(
    <ManipulationWorkspace
      levels={{
        beginner: () => <LinearMachine level="beginner" rules="0,8x" targets="6|1,4" theme="souk" />,
        advanced: () => <LinearMachine level="advanced" rules="x^2|2x|2x-1" theme="souk" />,
      }}
    />,
  );
  expect(html).toContain('data-rules="0,8x"');
  expect(html).toContain('data-rules="x^2|2x|2x-1"');
});

it('chaque clé que le composant lit existe, pour chaque monde (aucune clé brute à l’écran)', () => {
  const ns = manipulationAr.linearMachine;
  const own = [...source.matchAll(/\bk\('([a-zA-Z0-9]+)'/g)].map((m) => m[1]);
  const world = [...source.matchAll(/\bw\('([a-zA-Z0-9]+)'/g), ...source.matchAll(/'w:([a-zA-Z0-9]+)'/g)].map((m) => m[1]);
  const ternary = [...source.matchAll(/\?\s*'([a-zA-Z0-9]+)'\s*:\s*'([a-zA-Z0-9]+)'/g)].flatMap((m) => [m[1], m[2]]);
  const quoted = [...source.matchAll(/T\('([a-zA-Z0-9]+)'/g)].map((m) => m[1]);
  expect(own.length).toBeGreaterThan(20);
  for (const key of [...own, ...quoted]) expect(ns[key], `manipulation.linearMachine.${key}`).toBeTypeOf('string');
  for (const key of ternary.filter((t) => /^(claimSame|vRefused|vRefusedMachine)$/.test(t))) expect(ns[key], key).toBeTypeOf('string');
  for (const id of ['souk', 'numbers']) for (const key of world) expect(ns.worlds[id][key], `worlds.${id}.${key}`).toBeTypeOf('string');
  for (const st of ['open', 'linear', 'notLinear']) expect(ns.status[st]).toBeTypeOf('string');
});

it('valeurs par défaut : le cadran a et la carte vierge s’ouvrent sur une valeur (jamais la réponse), aucun essai', () => {
  const html = renderToString(<LinearMachine rules="0,8x" targets="6|1,4" levels={false} />);
  expect(html).toContain('data-lm-a="1"');
  expect(html).not.toContain('data-lm-a=""');
  expect(html).not.toContain('data-lm-a="0,8"');
  expect(html).toMatch(/data-lm-blank="2"/);
  expect((html.match(/data-lm-col=/g) ?? []).length).toBe(0);
});
