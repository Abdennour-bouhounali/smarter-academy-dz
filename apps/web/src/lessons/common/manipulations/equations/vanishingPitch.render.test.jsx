import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import VanishingPitch from './VanishingPitch';
import ManipulationWorkspace from '../ManipulationWorkspace';

/**
 * Le lab de la leçon jidaa-maadum se rend pour chaque forme de produit qu'elle pose
 * (côté constant, deux facteurs, sixièmes, carré, décimaux), seul et dans un workspace
 * à deux niveaux, sans clé i18n brute.
 */
it('vanishing-pitch se rend pour chaque forme de produit', () => {
  for (const expr of ['3|x-5', 'x-2|x+5', '3x-4|-2x+1', '2x+1', '-1,2|3x+2,7', '4x|-x+1']) {
    const html = renderToString(<VanishingPitch expr={expr} />);
    expect(html).toContain('data-vanishing-pitch');
    expect(html).toContain('data-vanishing-ruler');
    expect(html).toContain('data-decor-ball');
    expect(html).not.toMatch(/manipulation\.vanishingPitch\./);
  }
  expect(renderToString(<VanishingPitch expr="3x-4|-2x+1" levels={false} />)).toContain('data-graduation="6"');
});

it('vanishing-pitch se rend dans un workspace à deux niveaux, ouvert sur متقدم', () => {
  const html = renderToString(
    <ManipulationWorkspace
      defaultLevel="advanced"
      levels={{
        beginner: () => <VanishingPitch level="beginner" expr="3|x-5" />,
        advanced: () => <VanishingPitch level="advanced" expr="x-2|x+5" />,
      }}
    />,
  );
  expect(html).toContain('data-expr="x-2|x+5"');
  expect(html).toContain('data-expr="3|x-5"');
});
