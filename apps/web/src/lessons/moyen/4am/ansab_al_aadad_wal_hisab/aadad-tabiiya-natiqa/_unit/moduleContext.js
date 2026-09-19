import { LEVEL_LABEL, GRADE_LABEL, LEVEL_ID, GRADE_ID } from './unitMeta';

/** Le MODULE_CTX et getNavLinks d'une leçon, construits depuis son LESSON_CONFIG. */
export function buildModuleContext(LESSON_CONFIG, LESSON_BASE_PATH) {
  const MODULE_CTX = {
    lessonId: LESSON_CONFIG.id,
    coursePath: LESSON_BASE_PATH,
    courseTitle: LESSON_CONFIG.title,
    chapter: LESSON_CONFIG.chapter,
    chapterTitle: LESSON_CONFIG.chapterTitle,
    levelLabel: LEVEL_LABEL,
    gradeLabel: GRADE_LABEL,
    levelId: LEVEL_ID,
    gradeId: GRADE_ID,
    totalModules: LESSON_CONFIG.modules.length,
    // Le PREMIER et le DERNIER module de la leçon. Le premier n'est pas
    // toujours 1 : une leçon qui ouvre par « أستعدّ » commence à 0, et le
    // déverrouillage séquentiel doit le savoir, sinon le module 0 attend un
    // module -1 qui n'existe pas et la leçon reste scellée.
    firstModuleNumber: LESSON_CONFIG.modules[0].number,
    // L'étape de chaque module, par numéro : ContentModule y lit celle du
    // module PRÉCÉDENT, pour qu'un diagnostic (`prerequisite_check`) ne
    // barre pas la route au module suivant.
    stageByNumber: Object.fromEntries(LESSON_CONFIG.modules.map((m) => [m.number, m.stage])),
    lastModuleNumber: LESSON_CONFIG.modules[LESSON_CONFIG.modules.length - 1].number,
    sequentialUnlock: LESSON_CONFIG.sequentialUnlock,
  };
  const getNavLinks = (currentModuleNumber) => {
    const idx = LESSON_CONFIG.modules.findIndex((m) => m.number === currentModuleNumber);
    if (idx === -1) return { prevLink: null, nextLink: null };
    return {
      prevLink: idx > 0 ? LESSON_CONFIG.modules[idx - 1].path : LESSON_BASE_PATH,
      nextLink: idx < LESSON_CONFIG.modules.length - 1 ? LESSON_CONFIG.modules[idx + 1].path : null,
    };
  };
  return { MODULE_CTX, getNavLinks };
}
