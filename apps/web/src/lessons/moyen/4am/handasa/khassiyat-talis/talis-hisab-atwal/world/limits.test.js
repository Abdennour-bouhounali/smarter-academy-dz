/**
 * THE LIMITS of lesson `talis-hisab-atwal` against what the walks proved (`describeLimits`, kit/authoring/test/suites.js
 * › PROVEN_LIMITS — none raised: no walk of this lesson has run yet): its four forges' tiles, chips, leads, rules,
 * attacks and last steps; its tablets; every instruction the world « الأهرامات » shows on its stages.
 */
import { describeLimits } from '../../../../../../common/gameworld/kit/authoring/test/suites.js';
import { WORLD_TEXT } from '../../../../../../common/gameworld/nilePyramids/strings';
import { FORGES } from './forges';
import { TABLETS } from './tablets';
import { KEYS } from './journey';

/** Every instruction of a stage: the world's, each template filled with the longest letters it is given. */
const fill = (v) => (typeof v === 'function' ? v('AB', 'BC', 'C') : v);
const OBJECTIVES = [
  ...Object.values(WORLD_TEXT.objective).map(fill),
  ...Object.values(WORLD_TEXT.stage.objective).map((v) => (typeof v === 'function' ? v('55') : v)),
];

describeLimits({ forges: FORGES, keys: KEYS, tablets: TABLETS, objectives: OBJECTIVES });
