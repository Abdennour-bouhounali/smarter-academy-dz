import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import PairScoreboard from './PairScoreboard';
import ManipulationWorkspace from '../ManipulationWorkspace';
import manipulationAr from '../../../../i18n/locales/ar/lesson.manipulation.json';
import source from './PairScoreboard.jsx?raw';

/**
 * pair-scoreboard se rend pour chacun de ses mondes (la saison, le service du نشاط 1, la cagnotte
 * du تحدّ, une jumla quelconque), seul et dans un workspace à deux niveaux, sans clé i18n brute, avec
 * les deux poignées, les deux jauges, les deux gestes de réponse et le décor.
 */
const CASES = [
  { system: 'x+y=10|3x+y=22', theme: 'football', world: 'football', words: ['عدد الانتصارات', 'مجموع النقاط'] },
  { system: 'x+y=32|2(x-5)=y-3', theme: 'staff', world: 'staff', words: ['عدد الرجال', 'بعد الإحالة على التقاعد'] },
  { system: 'x+y=37|20x+10y=610', theme: 'coins', world: 'coins', words: ['عدد قطع 20DA', 'المبلغ'] },
  { system: 'x-y=2|2x-5y=4', theme: undefined, world: 'abstract', words: ['المعادلة (1)'] },
];

it('pair-scoreboard se rend pour chaque monde, sans clé brute', () => {
  for (const c of CASES) {
    const html = renderToString(<PairScoreboard system={c.system} theme={c.theme} />);
    expect(html, c.system).toContain('data-pair-scoreboard');
    expect(html).toContain(`data-world="${c.world}"`);
    expect((html.match(/data-stretch-handle/g) ?? []).length).toBe(2);
    expect(html).toContain('data-pair-handle="x"');
    expect(html).toContain('data-pair-handle="y"');
    expect(html).toContain('data-gauge="1"');
    expect(html).toContain('data-gauge="2"');
    expect(html).toContain('data-pair-claim');
    expect(html).toContain('data-pair-swap');
    expect(html).toContain('data-solved="false"');
    for (const word of c.words) expect(html, `${c.system}: ${word}`).toContain(word);
    if (c.world !== 'abstract') expect(html).toContain('data-deco');
    expect(html).not.toMatch(/manipulation\.[a-zA-Z]/);
  }
});

it('le service du نشاط 1 : 32 bureaux vides au départ, la règle des hommes commence à 5', () => {
  const html = renderToString(<PairScoreboard system="x+y=32|2(x-5)=y-3" theme="staff" levels={false} />);
  // la ثنائية par défaut occupe déjà quelques bureaux (jamais la solution) ; aucun essai n'est écrit
  expect((html.match(/data-pair-cell="empty"/g) ?? []).length).toBeLessThan(32);
  expect(html).not.toContain('data-pair-trial');
  expect(html).not.toContain('data-solved="true"');
  expect(html).toContain('aria-valuemin="5"');
  expect(html).toContain('aria-valuemin="3"');
});

it('pair-scoreboard se rend dans un workspace à deux niveaux, ouvert sur متقدم', () => {
  const html = renderToString(
    <ManipulationWorkspace
      defaultLevel="advanced"
      levels={{
        beginner: () => <PairScoreboard level="beginner" system="x+y=10|3x+y=22" theme="football" />,
        advanced: () => <PairScoreboard level="advanced" system="x+y=32|2(x-5)=y-3" theme="staff" />,
      }}
    />,
  );
  expect(html).toContain('data-system="x+y=32|2(x-5)=y-3"');
  expect(html).toContain('data-system="x+y=10|3x+y=22"');
});

it('chaque clé que le composant lit existe, pour chaque monde (aucune clé brute à l’écran)', () => {
  const ns = manipulationAr.pairScoreboard;
  const own = [...source.matchAll(/\bk\('([a-zA-Z0-9]+)'/g)].map((m) => m[1]);
  const world = [...source.matchAll(/\bw\('([a-zA-Z0-9]+)'/g)].map((m) => m[1]);
  // les clés conditionnelles écrites « k(ok ? 'a' : 'b') », « w(i === 0 ? 'g1' : 'g2') »
  const ternary = [...source.matchAll(/\?\s*'([a-zA-Z0-9]+)'\s*:\s*'([a-zA-Z0-9]+)'/g)].flatMap((m) => [m[1], m[2]]);
  expect(own.length).toBeGreaterThan(20);
  for (const key of own) expect(ns[key], `manipulation.pairScoreboard.${key}`).toBeTypeOf('string');
  for (const id of ['football', 'coins', 'staff']) {
    for (const key of world) {
      if (key === 'rangeNote' || key === 'leavingShort') continue;
      expect(ns.worlds[id][key], `worlds.${id}.${key}`).toBeTypeOf('string');
    }
  }
  for (const key of ['rangeNote', 'leavingShort']) expect(ns.worlds.staff[key]).toBeTypeOf('string');
  for (const key of ternary.filter((t) => /^(g1|g2|gaugeOk|gaugeKo|tBoth|tOnly1|tOnly2|tNone|sWait|sBoth|sOnly1|sOnly2|sNone)$/.test(t))) {
    expect(ns[key] ?? ns.worlds.staff[key], key).toBeTypeOf('string');
  }
});
