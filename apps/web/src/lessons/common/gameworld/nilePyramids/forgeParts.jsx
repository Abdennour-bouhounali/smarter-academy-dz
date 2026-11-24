/**
 * How THIS world draws a case of a rule forge (kit/RuleForge.jsx › `parts`): a Thalès figure (ruleForge.js › thalesCase),
 * drawn by the shared `components/GeoFigure.jsx` — never a second renderer.
 *   Mirror({ c, stage, tight })  the figure with its lengths; at `done`, THE RATIO GAUGE (§2.3): each whole side from the
 *                                vertex stretched to one common length, its piece marked on it — the three marks on one
 *                                vertical line (gold) when the ratios are equal, apart otherwise
 *   Line({ c, children })        one line of evidence: a thumbnail, the case's name, the gauge in small
 *   beats()                      three strokes: the three marks of the gauge
 * The world's investigations (`Inquiry`) are another file: the parts object is `{ Mirror, Line, beats, Inquiry }`.
 */
import GeoFigure from '../../components/GeoFigure';
import { figureSpec } from './figure';
import { caseId, runCase, THALES_TEXT } from './ruleForge';
import { Gauge } from './Gauge';
import Inquiry from './Inquiry';
import './forge.css';

export { Gauge };

/** The case in the mirror: its figure, then (built) the gauge beside it. */
export function Mirror({ c, stage, tight = false }) {
  const done = stage === 'done';
  return (
    <div
      className={`np-mirror ${tight ? 'is-tight' : ''}`}
      data-rf-stage={stage}
      data-rf-case={caseId(c)}
      data-rf-kind={done ? (runCase(c).aligned ? 'aligned' : 'apart') : undefined}
    >
      <div className="np-mirror__fig">
        <GeoFigure
          {...figureSpec(c, { show: c.show ?? 'all', parallel: c.parallel ?? null })}
          maxWidth={tight ? 260 : 340}
        />
      </div>
      {done && <Gauge c={c} />}
    </div>
  );
}

/** A case as one line of the evidence. */
export function Line({ c, children }) {
  const { aligned } = runCase(c);
  return (
    <div className="np-line" data-np-line={aligned ? 'aligned' : 'apart'}>
      <div className="np-line__thumb">
        <GeoFigure {...figureSpec(c, { small: true })} />
      </div>
      <div className="np-line__text">
        <div className="np-line__head">
          {c.mirror && (
            <i className="rf-inmirror" title={THALES_TEXT.mirrored}>
              🪞
            </i>
          )}
          <span>{c.head ?? `${c.names.V}${c.names.B}${c.names.C}`}</span>
        </div>
        <div className="np-line__foot">
          <Gauge c={c} small />
          {c.tag && <small className="np-line__tag">{c.tag}</small>}
          {children}
        </div>
      </div>
    </div>
  );
}

/** Three strokes: the three marks of the gauge. */
export const beats = () => 3;

/** The parts object a lesson's forge is played with (NilePyramids.jsx passes it to the kit's RuleForge). */
export const FORGE_PARTS = { Mirror, Line, beats, Inquiry };
