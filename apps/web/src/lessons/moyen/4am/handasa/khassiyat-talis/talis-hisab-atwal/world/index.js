/**
 * THE CONTENT of lesson `talis-hisab-atwal` for its game world « الأهرامات » (`nile-pyramids`): everything the kit's
 * screens and frames need from the lesson, in ONE object (`lesson`). The world's shell hands it down with
 * `<LessonProvider lesson={lesson}>`; a screen of the kit reads it with `useLesson()` and never imports this folder.
 * Named in the lesson's pack (`lesson.pack.js`, wave 2).
 *
 * The four forges (`forges.js`, their experiments `inquiries.js`), the story the world plays (`story.js`: the forge
 * of each stage, the felucca's legs, the final mission and the box at noon) and the tablets (`tablets.js`) are wave 2.
 */
import { evidence, trainerEvidence } from './evidence';
import { FORGES } from './forges';
import { KEYS, journey } from './journey';
import { KNOWLEDGE } from './knowledge';
import { ladder, PRACTICE_MAP } from './practice';
import { LEGS } from './run';
import { sittings } from './sitting';
import { STORY } from './story';
import { TABLETS } from './tablets';
import { TEXT } from './text';
import { trainer } from './trainer';
import { K1, K2, K3, K4 } from './math';

export const lesson = {
  /** The rules of the lesson, in the order the story gives them. */
  keys: KEYS,
  /** The forge of each rule, keyed by its key. */
  forges: FORGES,
  /** The tablet of each rule: its name, after its forge. */
  rules: TABLETS,
  /** What the world « الأهرامات » plays: the forge of each stage, the legs, the mission, the box. */
  story: STORY,
  /** The felucca's four legs — the world reads them from the story (`story.legs`); kept here for the road's tests. */
  legs: LEGS,
  /** « فضاء التدريب »: a level is a run of the kit's rail (the world's `startPractice` — not built yet). */
  ladder,
  /** The practice hub: { root, positions, edges }. */
  practiceMap: PRACTICE_MAP,
  /** « الامتحان الأبيض »: the lesson's bank, as it is. */
  sittings,
  /** « تدرّب »: its questions, how they are judged, and which of their answers are evidence. */
  trainer: { ...trainer, evidenceOf: trainerEvidence },
  journey,
  evidence,
  /**
   * Which card of the knowledge map trains what a sitting missed. The sitting is the lesson's BANK (kit/bankSitting.js ›
   * `weakKinds`): the KEYS of the questions that lost points first — each has its card in `ofKey` — then `ex:<id>` for
   * the sheets; a sheet whose questions carry no key opens `fallback`.
   */
  cards: {
    ofKey: { [K1]: 'nisab', [K2]: 'hisab', [K3]: 'farasha', [K4]: 'muamil' },
    ofExercise: {},
    fallback: 'talis',
  },
  /** « خريطة المعارف »: { graph, modules, positions }. */
  knowledge: KNOWLEDGE,
  text: TEXT,
};
