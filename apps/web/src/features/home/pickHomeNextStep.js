/**
 * « 🎯 خطوتك التالية » — la règle qui choisit le HÉROS de l'accueil.
 *
 * Une règle DÉTERMINISTE et lisible, pas un moteur de recommandation. Elle
 * ne fait qu'ordonner des sources qui existent déjà :
 *
 *  1. `getResumeLesson` (toutes classes confondues — ARCHITECTURE.md §10) :
 *     une leçon entamée passe TOUJOURS avant tout le reste. On ne détourne
 *     jamais un élève d'un travail en cours vers une lacune. Quand la leçon
 *     proposée n'a pas encore été ouverte (0 %), c'est « درسك التالي », pas
 *     « واصل ».
 *  2. Sinon, tant que le profil de maîtrise n'est pas arrivé, on ne tranche
 *     pas (`loading`) : décider « commence ta première leçon » puis remplacer
 *     par « une compétence à revoir » une seconde plus tard ferait sauter
 *     la page.
 *  3. Sinon, une compétence à retravailler (pickWorkNow, états réels
 *     gap/reinforce, jamais « non évalué »).
 *  4. Sinon, la première leçon de la classe qui n'est pas terminée.
 *  5. Sinon, tout est fini (`done`) — ou il n'y a rien à faire (`empty`).
 *
 * @param {object} args
 * @param {object|null} args.resume        retour de getResumeLesson
 * @param {Array}  args.workItems          pickWorkNow(tree).items (déjà vide
 *                                         si le profil n'est pas prêt)
 * @param {'loading'|'ready'|'error'|'anonymous'} args.profileStatus
 * @param {Array}  args.lessons            getStudentActivity(...).lessons
 *                                         (cadrées sur la classe)
 * @returns {{kind: 'continue'|'next'|'loading'|'mastery'|'start'|'done'|'empty'}}
 */
export function pickHomeNextStep({ resume, workItems = [], profileStatus, lessons = [] }) {
  if (resume) {
    return { kind: resume.progress > 0 ? 'continue' : 'next', resume };
  }
  if (profileStatus === 'loading') return { kind: 'loading' };
  if (workItems.length > 0) return { kind: 'mastery', item: workItems[0] };
  if (lessons.length === 0) return { kind: 'empty' };
  const first = lessons.find((l) => l.progressPercent < 100);
  if (first) return { kind: 'start', entry: first };
  return { kind: 'done' };
}
