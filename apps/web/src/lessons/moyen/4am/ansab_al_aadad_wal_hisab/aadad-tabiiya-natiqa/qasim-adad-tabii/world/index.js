/**
 * THE PACK of lesson `qasim-adad-tabii` for its game world: everything the kit's screens and frames need from the lesson,
 * in ONE object (`lesson`). The world's shell hands it down with `<LessonProvider lesson={lesson}>`; a screen of the kit
 * reads it with `useLesson()` and never imports this folder.
 */
import { T } from '../../../../../../common/gameworld/divisorIsles/strings';
import { evidence, trainerEvidence } from './evidence';
import { KEYS, journey } from './journey';
import { KNOWLEDGE } from './knowledge';
import { ladder } from './practice';
import { sittings } from './sitting';
import { TEXT } from './text';
import { trainer } from './trainer';

export const lesson = {
  /** The rules of the lesson, in the order the story gives them. */
  keys: KEYS,
  /** The tablet of each rule: { icon, title, lines, list?, math, notes }. */
  rules: Object.fromEntries(KEYS.map((key) => [key, T.tablets[key]])),
  ladder,
  sittings,
  /** « تدرّب »: its questions, how they are judged, and which of their answers are evidence. */
  trainer: { ...trainer, evidenceOf: trainerEvidence },
  journey,
  evidence,
  /** Which card of the knowledge map trains what: a key, or a kind of exam exercise that was missed. */
  cards: {
    ofKey: { 'qasim-baqi': 'baqi', 'qasim-jidaa': 'jidaa', 'siyagh-mutakafia': 'siyagh', 'wahid-wa-nafsuh': 'wahid' },
    ofExercise: { division: 'baqi', product: 'jidaa', cost: 'tahaqqaq', trip: 'tadhakkar' },
    fallback: 'baqi',
  },
  /** « خريطة المعارف »: { graph, modules, positions }. */
  knowledge: KNOWLEDGE,
  text: TEXT,
};
