// The single allowlist of grade `id`s active in the Algerian product.
//
// smarter-academy-dz was cloned from the French platform (see
// docs/ALGERIA_MIGRATION_AUDIT.md §15) and physically carries every French
// grade's content. Per ALGERIA_PLATFORM_MASTER_SPEC.md §3, that content must
// stay on disk but become undiscoverable through every active surface —
// navigation, catalogue, search, progression, admin, API, SEO — until each
// grade is explicitly reactivated.
//
// This list starts EMPTY on purpose: no Algerian grade (4AM, Terminale-DZ)
// exists in the curriculum yet — that is blocked on the official Algerian
// curriculum sources (master spec §4, §23; roadmap Phase 7). An empty
// allowlist is the only value that is honest about that: it makes every
// inherited French grade dormant and activates nothing else, rather than
// guessing at which grade should be visible in the meantime.
//
// When Phase 7 lands the first Algerian grade code(s) into courseLevels
// (coursesData.js), add them here. This file — not a filter duplicated
// per-component — is what every downstream consumer (frontend catalogue,
// lesson registry, admin default views) must read from.
export const ACTIVE_GRADE_IDS = Object.freeze([]);

export function isGradeActive(gradeId) {
  return ACTIVE_GRADE_IDS.includes(gradeId);
}

/**
 * Filters a courseLevels-shaped tree (level -> grades[]) down to only active
 * grades, dropping levels left with zero grades. Structure-preserving: every
 * other field on a level/grade passes through untouched.
 */
export function filterActiveCourseLevels(courseLevels) {
  return courseLevels
    .map((level) => ({
      ...level,
      grades: level.grades.filter((grade) => isGradeActive(grade.id)),
    }))
    .filter((level) => level.grades.length > 0);
}
