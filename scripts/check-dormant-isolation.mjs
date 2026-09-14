// Dormant-grade isolation gate — Algeria-specific (not present in the French
// upstream). Fails the build if any grade outside ACTIVE_GRADE_IDS
// (packages/core/curriculum/activeGrades.js) becomes reachable from a
// student-facing surface.
//
// Complements, and is deliberately separate from, check-routes.mjs (which
// covers the App.jsx mount surface) and the registry.js filter (covered by
// apps/web/src/lessons/registry.test.js, since import.meta.glob is a
// Vite-only API this plain-Node script cannot exercise directly). Also
// distinct from check-level-leak.mjs (check:level-leak), which despite its
// name is an unrelated PEDAGOGICAL vocabulary check — it verifies 6e
// lessons don't use 3e-level vocabulary, nothing to do with grade
// activation; see docs/ALGERIA_MIGRATION_AUDIT.md §25's open question about
// this script, now resolved by reading it.
//
//   node scripts/check-dormant-isolation.mjs
import { courseLevels, allCourseLevels } from '../packages/core/curriculum/coursesData.js';
import { ACTIVE_GRADE_IDS } from '../packages/core/curriculum/activeGrades.js';

const problems = [];

// The active catalogue (coursesData.js's `courseLevels` export — the
// highest-priority leak point per the migration audit §15) must contain
// ONLY active grades.
for (const level of courseLevels) {
  for (const grade of level.grades) {
    if (!ACTIVE_GRADE_IDS.includes(grade.id)) {
      problems.push(`coursesData.js's active courseLevels export includes dormant grade '${grade.id}' (level '${level.id}') — filterActiveCourseLevels() did not filter it out.`);
    }
  }
}

// Sanity check the other direction too: every id in ACTIVE_GRADE_IDS should
// actually exist in the full catalogue, or it's a typo silently activating
// nothing.
const allGradeIds = new Set(allCourseLevels.flatMap((l) => l.grades.map((g) => g.id)));
for (const id of ACTIVE_GRADE_IDS) {
  if (!allGradeIds.has(id)) {
    problems.push(`ACTIVE_GRADE_IDS contains '${id}', which does not exist in coursesData.js's allCourseLevels — likely a typo (this silently activates nothing).`);
  }
}

if (problems.length) {
  console.error(`\n${problems.length} problème(s) d'isolement de contenu dormant :\n`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  console.error('\nUn contenu français désactivé (activeGrades.js) fuite par un point de découverte actif.\n');
  process.exit(1);
}

console.log(`✅ Isolement du contenu dormant : ${ACTIVE_GRADE_IDS.length} classe(s) active(s) (${ACTIVE_GRADE_IDS.join(', ') || 'aucune'}), aucune classe dormante détectée dans le catalogue actif.`);
