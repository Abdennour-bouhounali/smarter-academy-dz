import { House, BookOpen, Compass, TrendingUp, NotebookPen } from 'lucide-react';

// The authenticated student area's own navigation — deliberately separate
// from data/navigation.js (the visitor IA). A student's workspace is a
// different kind of surface (LEARN → PRACTICE → PROGRESS → MASTER) with a
// different shape, not a filtered view of the marketing nav.
// `labelKey` → i18n `nav` namespace (src/i18n/locales/ar/nav.json).
export const studentNavLinks = [
  { labelKey: 'home', path: '/espace', icon: House, end: true },
  { labelKey: 'myCourses', path: '/espace/cours', icon: BookOpen },
  { labelKey: 'explore', path: '/espace/explorer', icon: Compass },
  { labelKey: 'progression', path: '/espace/progression', icon: TrendingUp },
  // Le cahier de l'élève : ses notes, ses erreurs, ses questions, sa
  // révision. Après la progression (« où en suis-je ? ») vient « qu'ai-je
  // écrit pour y arriver ? ».
  { labelKey: 'notebook', path: '/espace/cahier', icon: NotebookPen },
  // NI « activation » NI « profil » ici : le profil est le bloc d'identité
  // au bas de la barre (avatar + nom + classe, dans StudentNavbar), et la
  // saisie d'un code n'a qu'une seule porte, l'encart ambré juste au-dessus,
  // qui n'apparaît qu'à qui n'a pas encore accès. Deux entrées pour la même
  // destination, c'était une de trop.
];
