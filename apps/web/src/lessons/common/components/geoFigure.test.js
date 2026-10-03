import { describe, it, expect } from 'vitest';
import { validateGeoFigure, layoutGeoFigure, rightAngleSquare } from './geoFigure';

const TRIANGLE = {
  points: { A: [0, 4], B: [-2, 0], C: [3, 0], M: [-1, 2], N: [1.5, 2] },
  segments: [['A', 'B'], ['A', 'C'], { from: 'B', to: 'C', label: '10' }, { from: 'M', to: 'N', label: 'x', arrows: 1 }],
  ariaLabel: 'مثلث ABC و (MN) يوازي (BC)',
};

describe('geoFigure — la figure déclarative', () => {
  it('une figure correcte ne produit aucune erreur', () => {
    expect(validateGeoFigure(TRIANGLE)).toEqual([]);
  });
  it('refuse une clé inconnue, un point inconnu, un ton inconnu et un ariaLabel non arabe', () => {
    const errs = validateGeoFigure({ ...TRIANGLE, colour: 'red', segments: [['A', 'Z']], polygons: [{ points: ['A', 'B', 'C'], tone: 'pink' }], ariaLabel: 'triangle' });
    expect(errs.join('|')).toMatch(/clé inconnue « colour »/);
    expect(errs.join('|')).toMatch(/point inconnu « Z »/);
    expect(errs.join('|')).toMatch(/ton inconnu « pink »/);
    expect(errs.join('|')).toMatch(/ariaLabel arabe/);
  });
  it('met la figure à l’échelle, y vers le bas, et sort les étiquettes du triangle', () => {
    const L = layoutGeoFigure(TRIANGLE, { size: 300, pad: 30 });
    expect(L.P.A[1]).toBeLessThan(L.P.B[1]);                 // A est en haut
    expect(L.pointLabels.A[1]).toBeLessThan(L.P.A[1]);       // l'étiquette de A au-dessus
    expect(L.width).toBeCloseTo(300 + 60, 5);
  });
  it('les droites prolongées entrent dans le cadre', () => {
    const L = layoutGeoFigure({ points: { A: [0, 0], B: [1, 0] }, lines: [{ through: ['A', 'B'], extend: 1 }], ariaLabel: 'مستقيم' }, { size: 300, pad: 0 });
    expect(L.width).toBeCloseTo(300, 5);
    expect(L.lineEnds({ through: ['A', 'B'], extend: 1 })[0][0]).toBeCloseTo(0, 5);
  });
  it('le carré d’angle droit est collé au sommet', () => {
    const sq = rightAngleSquare([10, 0], [0, 0], [0, 10], 4);
    expect(sq).toEqual([[4, 0], [4, 4], [0, 4]]);
  });
});
