/**
 * Les deux portes du flux enseignant « trouver → préparer → projeter » —
 * en un seul endroit, pour que la carte, la مذكرة et la coquille de leçon
 * parlent le même langage.
 */

/** Le catalogue de l'enseignant : le retour par défaut de la مذكرة. */
export const TEACHER_COURSES_PATH = '/enseignant/cours';

/** La مذكرة الدرس d'une leçon (route sous ProtectedRoute(teacher)). */
export function lessonMemoPath(lessonId) {
  return `${TEACHER_COURSES_PATH}/${encodeURIComponent(lessonId)}/memoire`;
}

/**
 * L'état de navigation qui demande à LessonClassroomShell d'ouvrir la
 * séance « وضع القسم » dès l'arrivée sur la leçon. Un état de navigation et
 * non un paramètre d'URL : un lien partagé ou un rafraîchissement n'ouvre
 * jamais une présentation tout seul.
 */
export const CLASSROOM_START_STATE = Object.freeze({ startClassroom: 'lesson' });

/** @param {unknown} state  `location.state` */
export function wantsClassroomStart(state) {
  return !!state && typeof state === 'object' && state.startClassroom === 'lesson';
}
