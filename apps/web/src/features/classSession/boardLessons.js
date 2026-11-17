/**
 * The lessons whose class has ITS OWN BOARD — « حصّة القسم » with a script of the lesson (CLASS_SESSION.md §5ter).
 *
 * Owner, 2026-11-18: for such a lesson « no need for the older version » — the old « وضع القسم » (Classroom Mode of the
 * lesson page) no longer exists there: no entry button on the lesson page nor on its modules, no « عرض » of a lab or a
 * test inside it, and every door that used to open it (the teacher's catalogue card, the مذكرة) opens « حصّة القسم ».
 * The other lessons keep « وضع القسم » until each gets its script. A lesson has its board the day its script and its
 * memo are written and named in ITS pack (`lesson.pack.js › board`, LESSON_V2.md): this list is read from the generated
 * lesson index, never typed here.
 *
 * Deliberately tiny: the lesson runtime and the teacher's catalogue read it.
 */
import { lessonsWithPack } from '../../lessons/registry';

export const BOARD_LESSONS = Object.freeze(lessonsWithPack('board'));

export const hasClassBoard = (lessonId) => BOARD_LESSONS.includes(lessonId);

/** The four moments of the hour, in order (the set-up screen and the teacher's card show them the same way). */
export const MOMENTS = Object.freeze(['start', 'revise', 'lesson', 'end']);

/** The class session of a lesson; `moment` opens it directly on one moment of the hour. */
export const classSessionPath = (lessonId, moment = null) =>
  `/enseignant/hissa/${encodeURIComponent(lessonId)}${moment && MOMENTS.includes(moment) ? `?moment=${moment}` : ''}`;

/** « متابعة القسم »: the class on this lesson, student by student — a tab of the set-up screen of the class session. */
export const classTrackingPath = (lessonId) => `/enseignant/mutabaa/${encodeURIComponent(lessonId)}`;

/** « بطاقة المعارف » of the lesson on the board of the class: a quick revision with the whole class. */
export const classCardPath = (lessonId) => `/enseignant/bitaqa/${encodeURIComponent(lessonId)}`;

/** Is this lesson path (the lesson page or one of its modules) the path of a lesson that has its board? */
export const boardLessonOfPath = (path) =>
  typeof path === 'string' ? (BOARD_LESSONS.find((id) => path.split(/[/?#]/).includes(id)) ?? null) : null;
