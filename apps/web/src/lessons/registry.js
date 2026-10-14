// Registry of every built lesson implementation, discovered from the
// lesson.config.js files under this directory. This — not coursesData.js —
// is the source of truth for a lesson's module structure: the catalogue
// describes what a lesson teaches, the config describes how it is built.
//
// A lesson present in the catalogue but absent here simply has no
// implementation yet (status 'coming_soon'); progress utilities must skip it
// rather than assume a module count.
//
// Active-grade isolation (docs/ALGERIA_MIGRATION_AUDIT.md §15): only folders
// under an active grade (path shape `./<level>/<gradeId>/...`) are indexed
// here. (The French lesson folders this once filtered out were deleted on
// 2026-09-25.) This is defense in
// depth on top of the coursesData.js catalogue filter (activeGrades.js) —
// even if some other code path bypassed the catalogue, an inactive grade's
// lesson.config.js still could not be resolved through this registry.
//
// The glob itself is ALSO scoped to the active grades, at build time. A glob
// over './**' made Vite inline all 132 French configs into the entry bundle
// (≈ 1.1 MB of source, every visitor, discarded by the runtime filter below).
// `import.meta.glob` only accepts literals, so the grade list is spelled out
// here — registry.test.js fails if it drifts from ACTIVE_GRADE_IDS.
// See docs/architecture/BUNDLE_BOUNDARIES.md.
import { ACTIVE_GRADE_IDS } from '@smarter-academy/core';

const configModules = import.meta.glob(
  [
    './*/1am/**/lesson.config.js',
    './*/2am/**/lesson.config.js',
    './*/3am/**/lesson.config.js',
    './*/4am/**/lesson.config.js',
    './*/terminale_dz/**/lesson.config.js',
  ],
  { eager: true },
);

function gradeIdFromModulePath(path) {
  // './college/6e/domaine/lecon/lesson.config.js' -> '6e'
  const parts = path.split('/');
  return parts.length >= 3 ? parts[2] : null;
}

const configByLessonId = new Map();
for (const [path, mod] of Object.entries(configModules)) {
  const gradeId = gradeIdFromModulePath(path);
  if (!ACTIVE_GRADE_IDS.includes(gradeId)) continue;

  const config = mod.LESSON_CONFIG;
  if (config?.id) {
    configByLessonId.set(config.id, config);
  }
}

/**
 * @param {string} lessonId - the lesson's coursesData.js id / LESSON_CONFIG.id
 * @returns {object|null} the LESSON_CONFIG, or null when the lesson isn't built
 */
export function getLessonConfig(lessonId) {
  return configByLessonId.get(lessonId) ?? null;
}

/**
 * @param {string} lessonId
 * @returns {number|null} modules.length, or null when the lesson isn't built —
 *          never a fabricated default.
 */
export function getTotalModules(lessonId) {
  return configByLessonId.get(lessonId)?.modules?.length ?? null;
}

/**
 * Le NUMÉRO du premier module d'une leçon — pas toujours 1.
 *
 * Une leçon qui ouvre sur « أستعدّ » (stage `prerequisite_check`) commence à
 * 0. Sans cette information, « continuer » balayait 1..N et proposait le
 * module 1 à un élève qui n'avait pas encore fait le module 0.
 *
 * @param {string} lessonId
 * @returns {number|null} le plus petit `number` déclaré, ou null quand la
 *          leçon n'est pas construite — jamais un défaut fabriqué.
 */
export function getFirstModuleNumber(lessonId) {
  const modules = configByLessonId.get(lessonId)?.modules;
  if (!Array.isArray(modules) || modules.length === 0) return null;
  const numbers = modules.map((m) => Number(m.number)).filter(Number.isFinite);
  return numbers.length > 0 ? Math.min(...numbers) : null;
}

/**
 * Le CHEMIN du module `number` d'une leçon — jamais son numéro.
 *
 * Les routes d'un module sont déclarées avec `m.path`, construit sur son
 * SLUG (« /le-reservoir ») ; le modèle de progression, lui, raisonne en
 * NUMÉROS (1, 2, 3…). Assembler soi-même `${lesson.path}/${numéro}` produit
 * une URL qui ne correspond à aucune route : React Router la fait retomber
 * sur `*` — la page d'accueil marketing — sans la moindre erreur. C'est le
 * défaut qui rendait « Continuer » inopérant : le bouton n'était pas mort,
 * il menait à une porte qui n'existait pas.
 *
 * Cette fonction est le seul pont autorisé entre les deux mondes. Elle rend
 * `null` quand la leçon n'est pas construite ou quand le module n'existe
 * pas : l'appelant doit alors se rabattir sur l'index de la leçon plutôt que
 * de fabriquer un lien mort.
 *
 * @param {string} lessonId
 * @param {number|string} moduleNumber Le `number` du module (pas son index).
 * @returns {string|null}
 */
export function getModulePath(lessonId, moduleNumber) {
  const config = configByLessonId.get(lessonId);
  if (!config?.modules) return null;
  const wanted = Number(moduleNumber);
  if (!Number.isFinite(wanted)) return null;
  return config.modules.find((m) => Number(m.number) === wanted)?.path ?? null;
}

/**
 * The id of some lesson with 2+ modules currently in the active registry, or
 * `null` if none is active. Test-only escape hatch: lets registry-behavior
 * tests exercise a real, currently-active lesson without hardcoding one —
 * which grade is active can change (see activeGrades.js) independently of
 * what those tests are actually checking.
 */
export function getAnyRegisteredLessonId() {
  for (const [id, config] of configByLessonId) {
    if ((config.modules?.length ?? 0) >= 2) return id;
  }
  return null;
}
