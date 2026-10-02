import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import StoryModeller from './StoryModeller';

/**
 * story-modeller se rend pour ses TROIS mondes (stade : le niveau débutant ; musée : نشاط 3 ;
 * fête : la synthèse, avec exactement les props qu'elle passe), à chaque étape d'entrée
 * (المجاهيل, الترجمة, الحل), sans clé i18n brute.
 */
// aucune clé brute « manipulation.… » dans le TEXTE rendu (les attributs data-manipulation ne contiennent pas de point)
const RAW = /manipulation\.[a-zA-Z]/;

const PARTY = {
  system: '150x+150y=11250|24x+30y=2100',
  theme: 'party',
  unknowns: [{ id: 'x', noun: 'سعر علبة عصير' }, { id: 'y', noun: 'سعر قطعة حلوى' }],
  named: false,
  facts: [
    { quote: 'اقتنت البلدية 150 علبة عصير و 150 قطعة حلوى ودفعت 11250 DA', kind: 'money' },
    { quote: 'بقيت 24 علبة عصير و 30 قطعة حلوى ثمنها معا 2100 DA', kind: 'money' },
  ],
  chips: [
    { value: '150', label: 'علبة عصير' }, { value: '150', label: 'قطعة حلوى' }, { value: '11250', label: 'DA' },
    { value: '24', label: 'علبة عصير' }, { value: '30', label: 'قطعة حلوى' }, { value: '2100', label: 'DA' },
  ],
  answer: { options: ['سعر علبة العصير 25DA وسعر قطعة الحلوى 50DA.', 'سعر علبة العصير 50DA.', 'سعر قطعة الحلوى 25DA.'], correct: 0 },
};

it('le musée (نشاط 3, défaut) ouvre sur le choix des inconnues : lettres, noms mêlés aux données', () => {
  const html = renderToString(<StoryModeller />);
  expect(html).toContain('data-story-modeller');
  expect(html).toContain('data-theme="museum"');
  expect(html).toContain('data-stage="name"');
  expect(html).toContain('data-drag-source="unk:x"');
  expect(html).toContain('data-sm-noun="x"');
  expect(html).toContain('data-sm-noun="known:c0"');
  expect(html).toContain('عدد البالغين');
  expect(html).toContain('استقبل المتحف 140 زائرا');
  expect(html).toContain('data-deco');
  // la règle « d'un seul regard » : l'énoncé est un bloc repliable, l'instrument un cœur mesurable
  expect(html).toContain('data-lab-fold="story-modeller.story"');
  expect(html).toContain('data-sm-core');
  expect(html).not.toMatch(RAW);
});

it('le derby (débutant, inconnues déjà nommées) ouvre sur la traduction : deux rangs, six cases, le jeton « 1 »', () => {
  const html = renderToString(<StoryModeller system="x+y=20|300x+150y=4800" theme="stadium" named />);
  expect(html).toContain('data-stage="model"');
  expect(html).toContain('data-theme="stadium"');
  for (const z of ['slot:1:a', 'slot:1:b', 'slot:1:c', 'slot:2:a', 'slot:2:b', 'slot:2:c']) expect(html).toContain(`data-drop-zone="${z}"`);
  expect(html).toContain('data-drag-source="chip:one"');
  expect(html).toContain('data-sm-check');
  expect(html).toContain('عدد تذاكر الكبار');
  expect(html).not.toMatch(RAW);
});

it('la fête de la synthèse, avec SES props : deux informations d’argent, six jetons', () => {
  const html = renderToString(<StoryModeller {...PARTY} />);
  expect(html).toContain('data-theme="party"');
  expect(html).toContain('data-stage="name"');
  expect(html).toContain('سعر قطعة حلوى');
  expect(html).toContain('data-sm-noun="known:c5"');
  expect(html).not.toMatch(RAW);
  const solve = renderToString(<StoryModeller {...PARTY} startWith="solve" />);
  expect(solve).toContain('data-stage="solve"');
  expect(solve).toContain('data-sm-method="sub"');
  expect(solve).toContain('data-sm-method="add"');
  expect(solve).not.toMatch(RAW);
});

it('« startWith="solve" » épingle la résolution, le modèle du manuel déjà posé', () => {
  const html = renderToString(<StoryModeller startWith="solve" />);
  expect(html).toContain('data-stage="solve"');
  expect(html).toContain('data-sm-named');
  expect(html).not.toContain('data-sm-back');
  expect(html).not.toMatch(RAW);
});

it('une histoire dont un nombre n’a pas de jeton est une erreur de contenu', () => {
  expect(() => renderToString(<StoryModeller system="x+y=140|300x+150y=30300" chips={[{ value: '140', label: '' }]} />)).toThrow();
});
