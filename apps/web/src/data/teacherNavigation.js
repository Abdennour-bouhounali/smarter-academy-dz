import { House, BookOpen, PencilRuler, NotebookPen, Users, ClipboardCheck, BadgeCheck, UserRound, Gamepad2 } from 'lucide-react';

/**
 * L'espace ENSEIGNANT (« فضاء الأستاذ ») — sa propre navigation, comme
 * data/studentNavigation.js : des DONNÉES, pas du balisage. `labelKey` →
 * i18n `nav`.
 *
 * Deux moitiés. APPRENDRE comme un élève — les leçons (le même moteur,
 * tous les modules ouverts, rien d'écrit), le مختبر, son cahier — puis
 * ENSEIGNER : les classes (leur suivi vit dans la page de la classe), l'offre. Les mêmes mots que
 * l'espace élève (الدروس, المختبر, كرّاسي) : c'est la même plateforme.
 * `mobile: false` retire une entrée de la barre basse (six onglets au plus).
 */
export const teacherNavLinks = [
  { labelKey: 'teacherHome', path: '/enseignant', icon: House, end: true },
  { labelKey: 'courses', path: '/enseignant/cours', icon: BookOpen },
  { labelKey: 'mathLab', path: '/enseignant/atelier', icon: PencilRuler },
  { labelKey: 'notebook', path: '/enseignant/cahier', icon: NotebookPen },
  { labelKey: 'myClasses', path: '/enseignant/classes', icon: Users },
  // « تصحيح الإجابات » (2026-10-06) : les copies de SES élèves en « تصحيح الأستاذ ».
  // `badge` : le nombre en attente (useReviewCount).
  { labelKey: 'answerReviews', path: '/enseignant/tashih', icon: ClipboardCheck, badge: 'reviews' },
  // « فضاء الألعاب » : gérer les trois jeux de ses classes (MADAR_GAME.md §8).
  { labelKey: 'teacherGames', path: '/enseignant/jeux', icon: Gamepad2, mobile: false },
  { labelKey: 'myPlan', path: '/enseignant/offre', icon: BadgeCheck, mobile: false },
  { labelKey: 'profile', path: '/enseignant/profil', icon: UserRound, mobile: false },
];
