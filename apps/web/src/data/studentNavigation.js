import { House, BookOpen, Compass, TrendingUp, UserCircle, KeyRound } from 'lucide-react';

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
  // La saisie d'un code d'activation : le chemin d'achat du produit algérien
  // (master spec §17). Placée avant le profil parce qu'un élève venant
  // d'acheter une carte la cherche, alors que le profil se visite rarement.
  { labelKey: 'activation', path: '/espace/activation', icon: KeyRound },
  { labelKey: 'profile', path: '/espace/profil', icon: UserCircle },
];
