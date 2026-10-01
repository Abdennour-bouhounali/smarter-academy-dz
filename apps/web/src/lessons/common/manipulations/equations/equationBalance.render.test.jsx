import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import '../../../../i18n';
import EquationBalance, { layoutPan } from './EquationBalance';

it('la balance se rend pour les équations de la leçon (sacs, ballons, baudruches, sacs volants)', () => {
  for (const eq of ['3x+2=11', '9x+1=-26', '4x-3=2x+6', '9x+1=2x', '4x-3=-2x+5', '2x-3=3x+1']) {
    const html = renderToString(<EquationBalance eq={eq} />);
    expect(html).toContain('data-equation-balance');
    expect(html).toContain('data-balance-reserve');
    expect(html).not.toMatch(/manipulation\.equationBalance\./); // aucune clé i18n brute
  }
  expect(renderToString(<EquationBalance eq="4x-3=2x+6" levels={false} />)).not.toContain('data-manipulation-levels-selector');
});

it('le plateau reste dans sa largeur et chaque objet est dessiné une fois, pour toute charge', () => {
  for (let bags = 0; bags <= 12; bags += 3) {
    for (let units = -40; units <= 40; units += 7) {
      const c = { bags, antis: 0, balls: Math.max(0, units), balloons: Math.max(0, -units), part: null };
      const lay = layoutPan(c);
      expect(lay.ground.length + lay.float.length).toBe(bags + Math.abs(units));
      for (const it of [...lay.ground, ...lay.float]) {
        expect(Math.abs(it.x) + it.size / 2).toBeLessThanOrEqual(100);
        expect(it.y).toBeLessThan(0);
      }
    }
  }
});
