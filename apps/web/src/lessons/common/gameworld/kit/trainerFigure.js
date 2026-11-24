/**
 * « تدرّب » — how wide the trainer draws a question's FIGURE (`q.figure`, the data of a bank sheet's `statement.figure`:
 * plane — points, segments, parallels, lengths — or `space` / `chart` / `tape`), drawn by the practice space's own
 * `components/StatementFigure.jsx` — never a second renderer. Its size follows the exam sitting's rule (`sheetFigure.js`:
 * `k`, the figure's width in units of its smallest label): never narrower than `k × 12 px`, so its smallest label is drawn
 * at 12 px or more however far the panel's `Fit` zooms the question down (the CSS width is `k × --di-min-font`, the floor
 * in the units of every zoom above it — `Fit.jsx › floor`).
 *
 * Above the floor it takes at most its natural width (GeoFigure's 360) and no more than TRAINER_FIGURE.tall px of height,
 * so the question, its gates or its boxes and the correction stay on the screen at 1366 × 768 (the room it may take is
 * TRAINER_FIGURE.room: the trainer's panel is about 600 px wide while it trains, and it shares its height with the bar,
 * the question and the feedback). `fits` says whether a figure is drawn within that room AT its floor: a lesson's trainer
 * test asserts it for every figure it gives (a figure too wide for its labels is redrawn smaller in its own units, never
 * shrunk below its floor).
 */
import { layoutGeoFigure } from '../../components/geoFigure';
import { sheetFigure } from './sheetFigure';

export const TRAINER_FIGURE = {
  label: 12,
  tall: 220,
  room: { width: 560, height: 260 },
};

/**
 * { kind, k, width, height, label, fits } for a question's figure, or null when there is nothing to draw: its width and
 * height in px at zoom 1 (the panel unzoomed), and the size its smallest label is drawn at (plane figures only).
 */
export function trainerFigure(fig) {
  const f = sheetFigure(fig);
  if (!f) return null;
  const natural = Math.min(f.natural, 360);
  if (f.kind !== 'plane') return { kind: f.kind, k: 0, width: natural, height: null, label: null, fits: true };
  const [, , vw, vh] = layoutGeoFigure(fig).viewBox;
  const floor = Math.ceil(f.k * TRAINER_FIGURE.label);
  const width = Math.max(floor, Math.min(natural, Math.floor((TRAINER_FIGURE.tall * vw) / vh)));
  const height = Math.ceil((width * vh) / vw);
  const { room } = TRAINER_FIGURE;
  return {
    kind: 'plane',
    k: f.k,
    width,
    height,
    label: Math.round((width / f.k) * 100) / 100,
    fits: floor <= room.width && Math.ceil((floor * vh) / vw) <= room.height,
  };
}
