import GeoFigure from './GeoFigure';
import SpaceFigure from './SpaceFigure';
import StatChart from './StatChart';
import ArcTape from './ArcTape';

/** Le rendu de la figure d'un énoncé selon `kind` (voir statementFigure.js) : plane, `space`, `chart` ou `tape`. */
export default function StatementFigure(fig) {
  if (fig.kind === 'space') return <SpaceFigure {...fig} />;
  if (fig.kind === 'chart') return <StatChart {...fig} />;
  if (fig.kind === 'tape') return <ArcTape {...fig} />;
  return <GeoFigure {...fig} />;
}
