// Les TROIS LEÇONS GRATUITES du produit algérien
// (ALGERIA_PLATFORM_MASTER_SPEC.md §17 : « 3 leçons gratuites, le reste
// premium »).
//
// ── La règle, explicitement ─────────────────────────────────────────────
// La gratuité est une liste NOMMÉE, pas un rang. « Les trois premières »
// aurait fait dépendre le modèle commercial d'un ordre de tri : réordonner un
// chapitre, insérer une leçon, renommer un identifiant aurait rendu payante
// une leçon annoncée gratuite, ou l'inverse — sans qu'aucun code ne change,
// et sans que personne ne s'en aperçoive avant qu'un élève ne se plaigne.
//
// Ici, ouvrir une leçon est un geste : on écrit son identifiant. C'est ce que
// le cahier des charges appelle « data-driven » (§10 de la consigne de
// phase 6) : la décision vit dans cette liste, jamais dispersée dans des
// composants React.
//
// ── Ce que « gratuit » veut dire ────────────────────────────────────────
// Le palier (`tier`) voyage avec le catalogue jusqu'à la base :
//
//   freeLessons.js → coursesData.js → exportCurriculum.mjs
//                  → smarter:import-curriculum → lessons.tier
//                  → ContentAccess (l'autorité, côté serveur)
//
// Le frontend n'en déduit RIEN : il affiche un cadenas, le serveur refuse.
// La dérive entre les deux est surveillée par scripts/check-activation-drift.mjs.
//
// ── L'état de la liste ──────────────────────────────────────────────────
// UNE leçon ouverte sur les trois que le cahier des charges prévoit.
//
// `pgcd` — قواسم عدد طبيعي والقاسم المشترك الأكبر — est la PREMIÈRE leçon
// algérienne écrite (premier sujet du premier domaine du programme), et la
// seule qui existe aujourd'hui sur le disque. L'ouvrir donne à un visiteur
// une leçon complète à essayer : c'est précisément ce que le palier gratuit
// doit démontrer.
//
// Les DEUX autres restent à choisir, et ne peuvent l'être qu'entre des
// leçons ÉCRITES : inscrire ici l'identifiant d'une leçon `coming_soon`
// annoncerait « gratuit » sur une carte que personne ne peut ouvrir.
// `check-dormant-isolation.mjs` refuse de toute façon un identifiant qui ne
// correspond à aucune leçon du catalogue.
import { isGradeActive } from './activeGrades.js';

export const FREE_LESSON_IDS = Object.freeze(['pgcd']);

/**
 * Cette leçon est-elle explicitement gratuite ?
 */
export function isLessonFree(lessonId) {
  return FREE_LESSON_IDS.includes(lessonId);
}

/**
 * Le palier d'une leçon, en fonction de la classe qui la porte.
 *
 * DEUX RÉGIMES, et la distinction est ce qui protège l'héritage français :
 *
 *   classe ACTIVE (algérienne)  → la liste fait loi. Listée = gratuite,
 *                                 absente = payante. C'est le modèle
 *                                 commercial : trois leçons ouvertes, le
 *                                 reste vendu.
 *
 *   classe DORMANTE (française) → le palier hérité est laissé INTACT. Ces
 *                                 133 leçons ne sont de toute façon servies à
 *                                 personne (ContentAccess ferme sur
 *                                 grades.is_active), et les rendre payantes
 *                                 en masse ferait bouger 133 lignes de
 *                                 `lessons.tier` à chaque import — un bruit
 *                                 qui noierait la vraie dérive que le garde
 *                                 CI cherche à voir.
 *
 * Le défaut d'un palier hérité manquant reste `free`, comme partout ailleurs
 * dans cette base (AccessTier::normalize, et la migration
 * default_lesson_tier_to_free) : une leçon devient payante parce que
 * quelqu'un l'a décidé, jamais parce qu'une donnée manquait.
 *
 * @param {string} gradeId
 * @param {string} lessonId
 * @param {string|undefined} metaTier le palier hérité du catalogue français
 * @returns {'free'|'premium'}
 */
export function resolveLessonTier(gradeId, lessonId, metaTier) {
  if (!isGradeActive(gradeId)) {
    return metaTier === 'premium' ? 'premium' : 'free';
  }

  return isLessonFree(lessonId) ? 'free' : 'premium';
}
