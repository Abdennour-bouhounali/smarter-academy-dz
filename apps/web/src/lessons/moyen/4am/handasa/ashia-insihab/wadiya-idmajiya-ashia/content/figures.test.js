import { describe, it, expect } from 'vitest';
import { validateGeoFigure, figureQuality } from '../../../../../../common/components/geoFigure';
import * as FIG from './figures';

/**
 * Chaque figure de la leçon (modules, إختبار أولي) est une donnée GeoFigure valide ET lisible (règle du propriétaire,
 * guide §5 « Textbook figures ») : pas de bande étroite, aucune étiquette sur une autre ni sur un point.
 */
const ALL = {
  MODEL: FIG.MODEL, QCM1: FIG.QCM1, QCM3: FIG.QCM3, EX19: FIG.EX19, EX22: FIG.EX22, TEST_FIGURE: FIG.TEST_FIGURE,
  ...Object.fromEntries(FIG.QCM4_OPTIONS.map((f, i) => [`QCM4_OPTIONS[${i}]`, f])),
};

describe('wadiya-idmajiya-ashia — figures', () => {
  it.each(Object.entries(ALL))('%s : valide et lisible', (_, fig) => {
    expect(validateGeoFigure(fig)).toEqual([]);
    expect(figureQuality(fig)).toEqual([]);
  });
});
