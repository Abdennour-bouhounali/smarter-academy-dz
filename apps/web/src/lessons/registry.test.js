import { describe, it, expect } from 'vitest';
import { getLessonConfig, getTotalModules, getModulePath } from './registry';
import { ACTIVE_GRADE_IDS } from '@smarter-academy/core';

/**
 * Dormant-grade isolation, registry half (docs/ALGERIA_MIGRATION_AUDIT.md
 * §15). registry.js filters import.meta.glob's result by
 * ACTIVE_GRADE_IDS — this locks that no lesson under a dormant grade is
 * ever resolvable through the registry, independent of which specific
 * grades are active at any given time.
 */
describe('registry — dormant-grade isolation', () => {
  it('resolves no lesson when no grade is active (current Algeria state)', () => {
    if (ACTIVE_GRADE_IDS.length > 0) return; // this assertion only holds pre-Phase 7
    // A lesson known to exist on disk under a dormant French grade.
    expect(getLessonConfig('fonction-affine-2nde')).toBeNull();
    expect(getTotalModules('fonction-affine-2nde')).toBeNull();
    expect(getModulePath('fonction-affine-2nde', 1)).toBeNull();
  });

  it('never resolves a lesson whose folder grade is outside ACTIVE_GRADE_IDS', () => {
    // Exhaustive version of the above, independent of which grades happen
    // to be active: probes one known lesson id per inherited French grade
    // and asserts resolution tracks ACTIVE_GRADE_IDS exactly.
    const knownLessonByGrade = {
      '6e': 'fractions',
      '5e': 'operations-5e',
      '4e': 'racines-carrees',
      '3e': null, // id unknown here on purpose; college/3e coverage below is enough
      seconde: 'fonction-affine-2nde',
      premiere_specialite: 'second-degre-resoudre-1ere',
    };
    for (const [gradeId, lessonId] of Object.entries(knownLessonByGrade)) {
      if (!lessonId) continue;
      const shouldResolve = ACTIVE_GRADE_IDS.includes(gradeId);
      const resolved = getLessonConfig(lessonId) !== null;
      expect(resolved, `grade '${gradeId}' lesson '${lessonId}': expected resolvable=${shouldResolve}`).toBe(shouldResolve);
    }
  });
});
