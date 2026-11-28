/**
 * THE LIMITS of lesson `talis-hisab-atwal` against what the walks proved (`describeLimits`, kit/authoring/test/suites.js
 * › PROVEN_LIMITS — none raised: no walk of this lesson has run yet): its four forges' tiles, chips, leads, rules,
 * attacks and last steps; its tablets; every instruction the world « الأهرامات » shows on its stages; the felucca's
 * prompt on its one line (below).
 */
import { describe, expect, it } from 'vitest';
import { describeLimits } from '../../../../../../common/gameworld/kit/authoring/test/suites.js';
import { rng } from '../../../../../../common/gameworld/kit/random';
import { WORLD_TEXT } from '../../../../../../common/gameworld/nilePyramids/strings';
import { FORGES } from './forges';
import { TABLETS } from './tablets';
import { KEYS } from './journey';
import { GENERATORS, fairWave } from './run';

/** Every instruction of a stage: the world's, each template filled with the longest letters it is given. */
const fill = (v) => (typeof v === 'function' ? v('AB', 'BC', 'C') : v);
const OBJECTIVES = [
  ...Object.values(WORLD_TEXT.objective).map(fill),
  ...Object.values(WORLD_TEXT.stage.objective).map((v) => (typeof v === 'function' ? v('55') : v)),
];

describeLimits({ forges: FORGES, keys: KEYS, tablets: TABLETS, objectives: OBJECTIVES });

/**
 * THE RAIL'S PROMPT is ONE line (kit/GateRunHud.jsx › `data-gr-ask`: the order, then its calculation). Its width in
 * characters: the order's, a space, and the calculation as KaTeX draws it (spaces ignored, a fraction as wide as its
 * wider term, a relation « = » with its spacing ≈ 2, the box ≈ 1). The LIMIT: 40 characters — the French lessons of the
 * same world proved it at 1366 × 768 (`triangles-semblables/world/limits.test.js › RAIL_PROMPT`, their walk passed with
 * prompts wider than that); since 2026-11-28 a buoy here is one bare calculation (owner, 2026-11-27) and stands under it.
 * Every number of the calculation is MENTAL (`run.js › MAX`), a gate at most 6 characters, its formula at most four
 * numbers (`run.test.js`).
 */
const RAIL_PROMPT = 40;
const texWidth = (t) =>
  [
    ...String(t ?? '')
      .replace(/\\[dt]?frac\{([^}]*)\}\{([^}]*)\}/g, (_, a, b) => (a.length > b.length ? a : b))
      .replace(/\{,\}/g, ',')
      .replace(/\\square/g, '□')
      .replace(/\s+/g, '')
      .replace(/=/g, '==')
      .replace(/\\[a-zA-Z ]*/g, '×')
      .replace(/[{}]/g, ''),
  ].length;
describe('talis-hisab-atwal — the rail’s prompt fits its ONE line', () => {
  it('every buoy’s order and calculation, at both levels of numbers, are no wider than the width a walk proved', () => {
    let widest = 0;
    for (const kind of Object.keys(GENERATORS))
      for (const params of [{}, { big: true }])
        for (let s = 0; s < 120; s += 1) {
          const w = fairWave(rng((s + 1) * 7919 + kind.length), kind, params);
          const width = [...w.say].length + 1 + texWidth(w.tex);
          widest = Math.max(widest, width);
          expect(width, `${w.say} | ${w.tex}`).toBeLessThanOrEqual(RAIL_PROMPT);
          for (const g of w.gates) expect(String(g).length, w.tex).toBeLessThanOrEqual(6);
        }
    // the measure is real: the widest prompt is a calculation, not an empty line
    expect(widest).toBeGreaterThan(12);
  });
});
