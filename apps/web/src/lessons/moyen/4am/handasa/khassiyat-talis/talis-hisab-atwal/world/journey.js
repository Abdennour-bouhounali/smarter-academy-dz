/**
 * The student's road through lesson `talis-hisab-atwal`: its four keys, bound to its practice ladder and its exam
 * levels. What a road is — when the exam space opens, a promotion, « تقدّمي », the next step — is the kit's
 * (`kit/journey.js`).
 */
import { createJourney } from '../../../../../../common/gameworld/kit/journey';
import { KNOWLEDGE_GRAPH } from './knowledge';
import { ladder } from './practice';
import { LEVELS } from './sitting';

/**
 * The four rules of the lesson, in the order the story gives them — 🔑 📐 🦋 🔍 (plan §3.3–§3.6). The ONE list: the
 * status script reads this line (single-quoted literals); `math.js` holds the same ids as K1…K4, and `forges.js`
 * (wave 2) will quote each one: journey.test.js checks they agree.
 */
export const KEYS = ['wadiyat-talis', 'hisab-tul', 'wadiyat-al-farasha', 'muamil-k'];

/** The stages of the world « الأهرامات »: its five docks (`nilePyramids/strings.js › docks`). */
export const STAGES = 5;

export const journey = createJourney({
  keys: KEYS,
  ladder,
  levels: LEVELS,
  stages: STAGES,
  cards: KNOWLEDGE_GRAPH.nodes.length,
});
