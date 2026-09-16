import { LESSON_CONFIG, LESSON_BASE_PATH } from './lesson.config';

/**
 * Le contexte commun passé à <ModuleLayout> par chacun des modules.
 *
 * `levelLabel` et `gradeLabel` sont en ARABE : ils sont affichés tels quels
 * dans le fil d'Ariane du module. ModuleLayout ne déduit plus « Collège » /
 * « Lycée » — c'est la leçon qui nomme sa classe, dans la langue de l'élève.
 */
export const MODULE_CTX = {
  lessonId: LESSON_CONFIG.id,
  coursePath: LESSON_BASE_PATH,
  courseTitle: LESSON_CONFIG.title,
  chapter: LESSON_CONFIG.chapter,
  chapterTitle: LESSON_CONFIG.chapterTitle,
  levelLabel: 'التعليم المتوسط',
  gradeLabel: 'السنة الرابعة متوسط',
  levelId: 'moyen',
  gradeId: '4am',
  totalModules: LESSON_CONFIG.modules.length,
  lastModuleNumber: LESSON_CONFIG.modules[LESSON_CONFIG.modules.length - 1].number,
  sequentialUnlock: LESSON_CONFIG.sequentialUnlock,
};

/** Liens précédent / suivant à partir du numéro du module courant. */
export const getNavLinks = (currentModuleNumber) => {
  const idx = LESSON_CONFIG.modules.findIndex((m) => m.number === currentModuleNumber);
  if (idx === -1) return { prevLink: null, nextLink: null };
  return {
    prevLink: idx > 0 ? LESSON_CONFIG.modules[idx - 1].path : LESSON_BASE_PATH,
    nextLink: idx < LESSON_CONFIG.modules.length - 1 ? LESSON_CONFIG.modules[idx + 1].path : null,
  };
};
