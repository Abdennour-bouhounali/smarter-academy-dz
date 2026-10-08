import GeoFigure from './GeoFigure';
import SpaceFigure from './SpaceFigure';
import StatChart from './StatChart';

/** Le rendu de la figure d'un énoncé selon `kind` (voir statementFigure.js) : plane, `space` ou `chart`. */
export default function StatementFigure(fig) {
  if (fig.kind === 'space') return <SpaceFigure {...fig} />;
  if (fig.kind === 'chart') return <StatChart {...fig} />;
  return <GeoFigure {...fig} />;
}
