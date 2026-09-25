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
  it('ne résout AUCUNE leçon française, alors que deux classes sont actives', () => {
    // La version positive du contrôle, et celle qui compte depuis la phase
    // 6F : les classes actives ne sont plus vides, donc « rien ne résout »
    // ne peut plus être vrai par accident. (Les dossiers français ont été
    // supprimés le 2026-09-25 ; ce test garde qu'aucun identifiant français
    // ne se résout, même si un dossier revenait.)
    expect(ACTIVE_GRADE_IDS.length).toBeGreaterThan(0);
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

// The glob in registry.js is a build-time boundary: only the active grades'
// configs are inlined into the bundle. It must be a literal, so this guards
// it against drifting from ACTIVE_GRADE_IDS (docs/architecture/BUNDLE_BOUNDARIES.md).
import registrySource from './registry.js?raw';

describe('registry — build-time glob scope', () => {
  it('globs exactly the active grades, never ./**', () => {
    const globCall = registrySource.match(/import\.meta\.glob\(\s*\[([^\]]*)\]/);
    expect(globCall, 'registry.js must glob an explicit list of grade patterns').not.toBeNull();
    const grades = [...globCall[1].matchAll(/'\.\/\*\/([^/]+)\/\*\*\/lesson\.config\.js'/g)].map((m) => m[1]);
    expect(grades.sort()).toEqual([...ACTIVE_GRADE_IDS].sort());
  });
});
