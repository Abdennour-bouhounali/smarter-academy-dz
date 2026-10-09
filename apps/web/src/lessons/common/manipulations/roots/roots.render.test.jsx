import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import SquareFold from './SquareFold';
import SquareRootSide from './SquareRootSide';
import SquareTiling from './SquareTiling';

// L'ouverture n'est jamais vide : une valeur par défaut est posée (sans être un essai).
it('square-tiling s\'ouvre sur un k par défaut, sans pavage essayé', () => {
  const html = renderToString(<SquareTiling n={28} />);
  expect(html).toContain('data-tiling-k');
  expect(html).not.toContain('>?<');
  expect(html).not.toContain('data-tiled-k=');
  expect(html).not.toContain('data-tried-k=');
});
it('square-fold s\'ouvre sur un x par défaut qui n\'est solution d\'aucune carte', () => {
  const html = renderToString(<SquareFold a={9} />);
  expect(html).toContain('data-fold-x');
  expect(html).not.toContain('>?<');
  expect(html).not.toContain('data-fold-pin=');
});
it('square-root-side s\'ouvre sur le début de la règle, sans essai', () => {
  for (const mode of ['refine', 'graduation']) {
    const html = renderToString(<SquareRootSide mode={mode} num={36} den={1} />);
    expect(html).toContain('data-root-value');
    expect(html).not.toContain('>?<');
  }
});
