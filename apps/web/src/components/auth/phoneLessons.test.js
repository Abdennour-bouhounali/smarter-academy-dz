import { describe, expect, it } from 'vitest';
import { PHONE_LESSONS, isPhoneLessonPath } from './phoneLessons';

const HOME = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/qasim-adad-tabii';

describe('the pages a phone may open', () => {
  it("opens the home of the pilot lesson, for the student and for the teacher's preview", () => {
    expect(PHONE_LESSONS).toContain('qasim-adad-tabii');
    expect(isPhoneLessonPath(HOME)).toBe(true);
    expect(isPhoneLessonPath(`${HOME}/`)).toBe(true);
    expect(isPhoneLessonPath(HOME, '?apercu=eleve')).toBe(true);
  });

  it('keeps the pages that were not designed for a phone closed: a module, the classic player', () => {
    expect(isPhoneLessonPath(`${HOME}/itqan`)).toBe(false);
    expect(isPhoneLessonPath(HOME, '?view=classic')).toBe(false);
  });

  it('opens two tools of the teacher on that lesson — the memo and the lesson file — and no other', () => {
    expect(isPhoneLessonPath('/enseignant/cours/qasim-adad-tabii/memoire')).toBe(true);
    expect(isPhoneLessonPath('/enseignant/milaff/qasim-adad-tabii')).toBe(true);
    expect(isPhoneLessonPath('/enseignant/hissa/qasim-adad-tabii')).toBe(false);
    expect(isPhoneLessonPath('/enseignant/mutabaa/qasim-adad-tabii')).toBe(false);
    expect(isPhoneLessonPath('/enseignant/bitaqa/qasim-adad-tabii')).toBe(false);
    expect(isPhoneLessonPath('/enseignant/cours/qawasim-adad-tabii/memoire')).toBe(false);
  });

  it('keeps every other lesson, and every page that is not a lesson, closed', () => {
    expect(isPhoneLessonPath('/courses/moyen/4am/ansab_al_aadad_wal_hisab/khawass-qawasim')).toBe(false);
    expect(isPhoneLessonPath('/espace/pratique/qasim-adad-tabii')).toBe(false);
    expect(isPhoneLessonPath(undefined)).toBe(false);
  });
});
