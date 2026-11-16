import { describe, it, expect } from 'vitest';
import { BOARD_LESSONS, hasClassBoard, classSessionPath, boardLessonOfPath, MOMENTS } from './boardLessons';
import { SCRIPTS } from './lessonScripts';
import { classDoor, canPresentPath, CLASSROOM_START_STATE } from '../teacher/lessonMemo/memoRoutes';
import { hasLab } from '../../lessons/common/lessonlab/registry';
import { LESSON_CONFIG } from '../../lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/lesson.config';

describe('حصّة القسم — the lessons that have their own board (and no « وضع القسم » any more)', () => {
  it('is exactly the list of the lessons that have a script: a lesson joins the day its script is written', () => {
    expect([...BOARD_LESSONS].sort()).toEqual(Object.keys(SCRIPTS).sort());
    expect(hasClassBoard('qasim-adad-tabii')).toBe(true); expect(hasClassBoard('qawasim-adad-tabii')).toBe(false); expect(hasClassBoard(undefined)).toBe(false);
    const config = LESSON_CONFIG; expect(config.id).toBe('qasim-adad-tabii'); expect(config.classSession).toBe(true); expect(hasLab(config.id)).toBe(true);
  });

  it('opens the class session, directly on one of the four moments when asked', () => {
    expect(MOMENTS).toEqual(['start', 'revise', 'lesson', 'end']);
    expect(classSessionPath('qasim-adad-tabii')).toBe('/enseignant/hissa/qasim-adad-tabii');
    expect(classSessionPath('qasim-adad-tabii', 'lesson')).toBe('/enseignant/hissa/qasim-adad-tabii?moment=lesson');
    expect(classSessionPath('qasim-adad-tabii', 'anything')).toBe('/enseignant/hissa/qasim-adad-tabii'); // an unknown moment is not passed on
  });

  it('turns every old door of such a lesson into « حصّة القسم », and leaves the other lessons their « وضع القسم »', () => {
    const base = '/courses/moyen/4am/ansab_al_aadad_wal_hisab';
    expect(classDoor('qasim-adad-tabii', `${base}/qasim-adad-tabii`)).toEqual({ to: '/enseignant/hissa/qasim-adad-tabii', state: undefined, session: true });
    expect(classDoor('qawasim-adad-tabii', `${base}/qawasim-adad-tabii`)).toEqual({ to: `${base}/qawasim-adad-tabii`, state: CLASSROOM_START_STATE, session: false });
    expect(boardLessonOfPath(`${base}/qasim-adad-tabii/2`)).toBe('qasim-adad-tabii'); expect(boardLessonOfPath(`${base}/qasim-adad-tabii?view=classic`)).toBe('qasim-adad-tabii');
    expect(boardLessonOfPath(`${base}/qawasim-adad-tabii/2`)).toBe(null); expect(boardLessonOfPath(null)).toBe(null);
    expect(canPresentPath(`${base}/qasim-adad-tabii/2`)).toBe(false); expect(canPresentPath(`${base}/qawasim-adad-tabii/2`)).toBe(true); expect(canPresentPath(undefined)).toBe(false);
  });
});
