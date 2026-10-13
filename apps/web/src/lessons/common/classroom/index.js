/**
 * MODE CLASSE — « وضع القسم ».
 *
 *   <ClassroomPresentation scope="manipulation" title="…" entry="none">
 *     … votre contenu, qui peut poser <ClassroomEntryButton /> où il veut
 *     et lire useClassroomMode() pour adapter sa mise en page …
 *   </ClassroomPresentation>
 *
 * Voir docs/architecture/CLASSROOM_MODE.md.
 */
export { default as ClassroomPresentation } from './ClassroomPresentation';
export { default as ClassroomEntryButton } from './ClassroomEntryButton';
export { default as ClassroomFrame, ClassroomHidden, CLASSROOM_FRAME_BASE } from './ClassroomFrame';
export { default as LessonClassroomShell } from './LessonClassroomShell';
export { default as ClassroomPaged } from './ClassroomPaged';
export { useClassroomStage } from './useClassroomStage';
export { moduleUnits, clampUnit, resolveModuleNavigation, lessonNeighbours, isWithinLesson } from './classroomUnits';
export { MIN_PAGE_FIT, pageBudget, planPages, clampPage } from './classroomPages';
export { default as ClassroomToolbar, ClassroomNav } from './ClassroomToolbar';
export { ClassroomContext, useClassroomMode, useClassroomPortalTarget, CLASSROOM_INACTIVE } from './ClassroomContext';
export { useFullscreen, fullscreenApi } from './useFullscreen';
export { useScrollLock } from './useScrollLock';
export { usePresentationFit } from './usePresentationFit';
export {
  SCALE_STEPS, DEFAULT_SCALE, MIN_FIT_FACTOR,
  clampScale, stepScale, scalePercent, availableArea, nextFitFactor, effectiveScale,
} from './classroomFit';
