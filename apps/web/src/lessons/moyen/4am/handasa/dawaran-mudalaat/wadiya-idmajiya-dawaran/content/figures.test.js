import { describe, it, expect } from 'vitest';
import { validateGeoFigure, figureQuality } from '../../../../../../common/components/geoFigure';
import * as FIG from './figures';

/**
 * Chaque figure de la leçon (modules, إختبار أولي) est une donnée GeoFigure valide ET lisible (règle du propriétaire,
 * guide §5 « Textbook figures ») : pas de bande étroite, aucune étiquette sur une autre ni sur un point.
 */
const ALL = { PLAN: FIG.PLAN, QCM1: FIG.QCM1, QCM2: FIG.QCM2, QCM3: FIG.QCM3, QCM4: FIG.QCM4, EX15: FIG.EX15, EX20: FIG.EX20, TEST_FIGURE: FIG.TEST_FIGURE };

describe('wadiya-idmajiya-dawaran — figures', () => {
  it.each(Object.entries(ALL))('%s : valide et lisible', (_, fig) => {
    expect(validateGeoFigure(fig)).toEqual([]);
    expect(figureQuality(fig)).toEqual([]);
    expect(Object.keys(fig.points)).not.toContain('undefined');
  });
});
