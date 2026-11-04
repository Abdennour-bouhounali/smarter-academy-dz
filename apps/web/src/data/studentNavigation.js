import { House, BookOpen, Compass, TrendingUp, NotebookPen, PencilRuler, Users, Flame, Rocket, Brain } from 'lucide-react';

// The authenticated student area's own navigation — deliberately separate
// from data/navigation.js (the visitor IA). A student's workspace is a
// different kind of surface (LEARN → PRACTICE → PROGRESS → MASTER) with a
// different shape, not a filtered view of the marketing nav.
// `labelKey` → i18n `nav` namespace (src/i18n/locales/ar/nav.json).
export const studentNavLinks = [
  { labelKey: 'home', path: '/espace', icon: House, end: true },
  { labelKey: 'myCourses', path: '/espace/cours', icon: BookOpen },
  // « التحدّي اليومي » : cinq minutes par jour pour RETROUVER ce qu'on a
  // appris — l'habitude quotidienne, juste après les cours.
  { labelKey: 'dailyChallenge', shortLabelKey: 'dailyChallengeShort', path: '/espace/defi', icon: Flame },
  // « فضاء الألعاب » : trois jeux, des cœurs communs gagnés par des réponses
  // justes à SES كفاءات — juste après le défi, l'autre porte « jouer pour
  // réviser » (docs/architecture/MADAR_GAME.md). Plein écran, hors de la coquille.
  { labelKey: 'madar', shortLabelKey: 'madarShort', path: '/espace/jeux', icon: Rocket },
  // « مختبر التفكير » : des défis HORS programme, un numéro à la fois — essayer d'abord, puis
  // voir comment pense un رياضي (docs/architecture/THINKING_LAB.md). Tablette et ordinateur.
  { labelKey: 'thinkingLab', shortLabelKey: 'thinkingLabShort', path: '/espace/tafkir', icon: Brain },
  { labelKey: 'explore', path: '/espace/explorer', icon: Compass },
  // Le مختبر الرياضيات : les instruments LIBRES (سبّورة, et demain les
  // autres), hors de toute leçon. Après « explorer » (le programme) vient
  // « expérimenter » (docs/architecture/MATH_LAB.md).
  { labelKey: 'mathLab', path: '/espace/atelier', icon: PencilRuler },
  { labelKey: 'progression', path: '/espace/progression', icon: TrendingUp },
  // Le cahier de l'élève : ses notes, ses erreurs, ses questions, sa
  // révision. Après la progression (« où en suis-je ? ») vient « qu'ai-je
  // écrit pour y arriver ? ».
  { labelKey: 'notebook', path: '/espace/cahier', icon: NotebookPen },
  // « قسمي » : la classe de l'enseignant que l'élève a rejointe (ou peut
  // rejoindre par code). Un CONTEXTE d'étude, pas un contenu : le programme
  // reste le même, l'enseignant règle seulement ce qui est visible.
  { labelKey: 'myClass', path: '/espace/qism', icon: Users },
  // NI « activation » NI « profil » ici : le profil est le bloc d'identité
  // au bas de la barre (avatar + nom + classe, dans StudentNavbar), et la
  // saisie d'un code n'a qu'une seule porte, l'encart ambré juste au-dessus,
  // qui n'apparaît qu'à qui n'a pas encore accès. Deux entrées pour la même
  // destination, c'était une de trop.
];
