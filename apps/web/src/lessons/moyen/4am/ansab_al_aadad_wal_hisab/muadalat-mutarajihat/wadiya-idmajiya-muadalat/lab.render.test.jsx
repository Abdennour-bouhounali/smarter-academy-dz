import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../../../i18n';
import GrowthRace from '../../../../../common/manipulations/equations/GrowthRace';
import ManipulationWorkspace from '../../../../../common/manipulations/ManipulationWorkspace';
import * as L from '../../../../../common/manipulations/logic/growthRace';
import { LAB, SITUATION, WARMUP } from './content/textbook';

/**
 * Le laboratoire du module 7 de la synthèse (growth-race, réutilisé de « ترييض مشكلة »)
 * rendu avec EXACTEMENT les props que le module étale (content/textbook.js › LAB), dans le
 * workspace à deux niveaux ouvert sur متقدم — et la mathématique que le module suppose :
 * la formule 2 meilleure à partir de 9 séances (égalité à 8, 600 دج), à partir de 6 au
 * niveau مبتدئ (égalité à 5) — la réponse de l'étape « تفسير النتائج ».
 */
const workspace = (extra = {}) => (
  <ManipulationWorkspace
    defaultLevel="advanced"
    levels={{
      beginner: () => <GrowthRace level="beginner" {...LAB.beginner} {...extra} />,
      advanced: () => <GrowthRace level="advanced" {...LAB.advanced} {...extra} />,
    }}
  />
);

it('les deux niveaux se rendent dans le workspace, monde « piscine », mots de la leçon', () => {
  const html = renderToString(workspace());
  expect((html.match(/data-growth-race/g) ?? []).length).toBe(2);
  expect(html).toContain('data-stage="build"');
  expect(html).toContain('data-theme="pool"');
  expect(html).toContain('data-op="mul"');
  for (const w of ['الصيغة الأولى', 'الصيغة الثانية', 'الصيغة (أ)', 'الصيغة (ب)', 'الاشتراك السنوي', 'تذكرة الحصّة']) expect(html, w).toContain(w);
  expect(html).not.toMatch(/manipulation\.growthRace\./);
  expect(html).toContain('data-decor');
});

it('la course s’ouvre sur la règle et les colonnes (à 0 séance, la formule 1 est la moins chère)', () => {
  const html = renderToString(workspace({ startWith: 'race' }));
  expect(html).toContain('data-stage="race"');
  expect(html).toContain('data-gr-ruler');
  expect(html).toContain('data-rel="&lt;"');
});

it('la mathématique que le module suppose', () => {
  const big = L.parseModel(LAB.advanced.left, LAB.advanced.right);
  const a = L.answer(big, LAB.advanced.goal);
  expect(L.toNumber(a.sol.x)).toBe(8);
  expect(a.first).toBe(9);
  expect(a.toInfinity).toBe(true);
  const at8 = L.trialAt(big, 8);
  expect([L.valueText(at8.left), L.valueText(at8.right), at8.rel]).toEqual(['600', '600', '=']);
  expect(L.xRange(big, LAB.advanced.maxX).max).toBeGreaterThanOrEqual(10);
  // les nombres du manuel, lus dans la situation et non retapés
  const { perSession1, yearly, perSession2 } = SITUATION.numbers;
  expect(LAB.advanced.left).toBe(`${perSession1}x`);
  expect(LAB.advanced.right).toBe(`${yearly}+${perSession2}x`);

  const small = L.parseModel(LAB.beginner.left, LAB.beginner.right);
  const b = L.answer(small, LAB.beginner.goal);
  expect(L.toNumber(b.sol.x)).toBe(5);
  expect(b.first).toBe(6);
  expect(LAB.beginner.right).toBe(`${WARMUP.numbers.fixedB}+${WARMUP.numbers.perSessionB}x`);
});

it('les demi-droites du manuel : crochet tourné vers le rouge quand la borne est une solution', async () => {
  const { NumberLine } = await import('./components/MuadalatFigures');
  // Le crochet : « M(cx + s) … » — s > 0 : son ouverture regarde la droite.
  const opening = (html) => {
    const m = html.match(/<path d="M([\d.]+) [\d.]+ L([\d.]+) /g).map((d) => d.match(/M([\d.]+) [\d.]+ L([\d.]+)/)).find((p) => Math.abs(Number(p[1]) - Number(p[2])) === 7);
    return Math.sign(Number(m[1]) - Number(m[2]));
  };
  expect(opening(renderToString(<NumberLine bound={-3} side="left" included label="x ≤ −3" />))).toBe(-1);   // ] vers la gauche, rouge à gauche
  expect(opening(renderToString(<NumberLine bound={-3} side="right" included={false} label="x > −3" />))).toBe(-1); // ] tourné vers l'extérieur
  expect(opening(renderToString(<NumberLine bound={-2} side="left" included={false} label="x < −2" />))).toBe(1);   // [ tourné vers l'extérieur
});
