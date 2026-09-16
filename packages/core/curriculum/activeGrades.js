// The single allowlist of grade `id`s active in the Algerian product.
//
// Les DEUX classes du produit algérien, et elles seules
// (ALGERIA_PLATFORM_MASTER_SPEC.md §3 : « The initial active curriculum
// contains ONLY: 4AM — السنة الرابعة متوسط · Terminale — السنة الثالثة ثانوي »).
//
// ── Ce qu'« active » veut dire, et ce qu'il ne veut PAS dire ────────────
// Active = la classe EXISTE : un élève peut s'y inscrire, elle apparaît dans
// les sélecteurs, l'API la sert. Ce n'est PAS « du contenu est disponible » :
//
//   4am          → programme arrêté (4 domaines, 28 sujets), AUCUNE leçon
//                  écrite. Le catalogue montre le programme, pas des cours.
//   terminale_dz → identité seule. Aucun programme n'a été fourni
//                  (rapport de reprise §19, B1).
//
// Confondre les deux est le défaut que l'invariant I2 de la phase 6F existe
// pour empêcher : chaque classe porte un `curriculumStatus` que l'interface
// DOIT lire pour dire à l'élève où en est sa classe, au lieu de lui servir
// un catalogue vide qu'il prendra pour une panne.
//
// ── L'héritage français ─────────────────────────────────────────────────
// Jusqu'à la phase 6F, cette liste était vide et les 8 classes françaises
// étaient DORMANTES : présentes dans le catalogue, cachées par ce filtre.
// Ce n'est plus le cas. Le catalogue algérien (coursesData.js,
// `dzCourseLevels`) ne les contient plus du tout, et la base non plus. Elles
// ne survivent que comme ARBRE DE RÉFÉRENCE, hors produit, pour que
// l'outillage puisse continuer à valider les 132 dossiers de leçons restés
// sur le disque.
export const ACTIVE_GRADE_IDS = Object.freeze(['4am', 'terminale_dz']);

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
