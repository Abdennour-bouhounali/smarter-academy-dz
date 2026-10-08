import { validateGeoFigure } from './geoFigure.js';
import { validateSpaceFigure } from './spaceFigure.js';
import { validateStatChart } from './statChart.js';

/**
 * La figure d'un énoncé (`statement.figure` d'un exercice, `figure` d'une مسألة) a trois formes, choisies par
 * `kind` : plane (GeoFigure, par défaut), `'space'` (SpaceFigure, unité 14), `'chart'` (StatChart, unité 8).
 * Un seul aiguillage pour la validation (validateur des exercices, guidedProblem) — StatementFigure.jsx est
 * l'aiguillage du rendu.
 */
export function validateStatementFigure(fig) {
  if (fig?.kind === 'space') return validateSpaceFigure(fig);
  if (fig?.kind === 'chart') return validateStatChart(fig);
  return validateGeoFigure(fig);
}
