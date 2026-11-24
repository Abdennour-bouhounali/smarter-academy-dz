/**
 * THE CONTENT of lesson `talis-hisab-atwal` for its game world « الأهرامات » (`nile-pyramids`): everything the kit's
 * screens and frames need from the lesson, in ONE object (`lesson`). The world's shell hands it down with
 * `<LessonProvider lesson={lesson}>`; a screen of the kit reads it with `useLesson()` and never imports this folder.
 * Named in the lesson's pack (`lesson.pack.js`, wave 2).
 *
 * WAVE 1a (the written world) exports what exists, so that its tests run. Wave 2 adds, in this file:
 *   import { FORGES } from './forges';         → forges: FORGES          (the four forges, keyed by KEYS)
 *   import { STORY } from './story';           → story: STORY            (legs: LEGS from './run', forges by stage,
 *                                                                         mission, box, recall, onArrive…)
 *   import { TABLETS } from './tablets';       → rules: TABLETS          (the tablet of each key)
 * and the inquiries through FORGES. Until then the lesson names the doors it has not got (`notYet`, the kit's rule:
 * a door never opens on nothing).
 */
import { evidence, trainerEvidence } from './evidence';
import { KEYS, journey } from './journey';
import { KNOWLEDGE } from './knowledge';
import { ladder, PRACTICE_MAP } from './practice';
import { LEGS } from './run';
import { sittings } from './sitting';
import { TEXT } from './text';
import { trainer } from './trainer';
import { K1, K2, K3, K4 } from './math';

export const lesson = {
  /** The rules of the lesson, in the order the story gives them. */
  keys: KEYS,
  /** The forge of each rule (wave 2). */
  forges: {},
  /** The felucca's four legs (`story.legs` at wave 2 — the world reads them from the story). */
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
