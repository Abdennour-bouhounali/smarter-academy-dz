// i18n foundation for the shared application shell (nav, auth, common
// buttons/errors/loading/empty states) — NOT for lesson/curriculum content,
// which stays out of scope for this phase per ALGERIA_PLATFORM_MASTER_SPEC.md
// §4/§23 (curriculum is a later, separately-gated phase).
//
// Single locale today (ar-DZ, see ../locale.js) — this is infrastructure for
// Arabic-first UI, not a language switcher. Adding a second locale later
// means adding a resource bundle here, not restructuring this file.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LOCALE } from '../locale.js';
import common from './locales/ar/common.json';
import nav from './locales/ar/nav.json';
import auth from './locales/ar/auth.json';
import access from './locales/ar/access.json';
// Le CHROME du moteur de leçon (navigation entre modules, libellés des
// questions du kit, test final, diagnostic). Pas le CONTENU pédagogique :
// celui-ci est écrit en arabe directement dans chaque leçon, comme le
// programme l'exige. Voir apps/web/src/lessons/common/.
import lesson from './locales/ar/lesson.json';
// L'espace élève : tableau de bord, catalogue, exploration, profil,
// progression. Le CHROME de l'espace, pas le contenu des leçons.
import student from './locales/ar/student.json';
// Les pages VISITEUR (accueil, méthode, mission, FAQ, pied de page, palette
// de commandes). Le discours produit, pas le contenu pédagogique.
import marketing from './locales/ar/marketing.json';
// L'espace ENSEIGNANT (« فضاء الأستاذ ») : ses classes, ses élèves, son
// offre. Le chrome seulement — l'enseignant lit les leçons dans la coquille
// visiteur, il n'a pas de contenu à lui.
import teacher from './locales/ar/teacher.json';

// LA LOUVE DE L'ADMINISTRATION (« لوحة الإدارة ») : le chrome du panneau —
// navigation, titres, colonnes, états, pastilles, dialogues. Le panneau parle
// la MÊME langue que l'espace élève : le produit algérien est arabe pour tous
// ses rôles, l'administration comprise (master spec §14, ARABIC_RTL_CONTRACT).
// Livré avec l'application et NON à la demande : ses primitives (Modal,
// DataTable, FilterBar, states) sont aussi rendues par l'espace enseignant et
// par « قسمي » — un dialogue qui suspend à son ouverture ferait disparaître
// la page derrière son repli.
import admin from './locales/ar/admin.json';

// ── Le namespace CHARGÉ À LA DEMANDE : `mathlab` ─────────────────────────
// Le chrome du مختبر الرياضيات (Math Lab) — instruments et accueil,
// ≈ 250 Ko de JSON qui partaient dans le lot d'entrée de CHAQUE visiteur.
// Il n'est lu que par features/mathlab, dont chaque écran est derrière une
// frontière <Suspense> : les pages /atelier (lots paresseux sous
// StudentLayout / TeacherLayout) et le calque posé sur la leçon
// (MathLabOverlayProvider). Le seul libellé rendu sur une page de leçon
// (« المختبر », MathLabEntryButton) vit dans `lesson`.
//
// `useTranslation('mathlab')` SUSPEND jusqu'à l'arrivée du catalogue : la
// frontière montre son repli, puis le texte arabe complet — jamais une clé
// brute. Un namespace ajouté ici doit donc n'être lu QUE sous une telle
// frontière, jamais par un composant partagé. Voir
// docs/architecture/BUNDLE_BOUNDARIES.md.
const ON_DEMAND_NAMESPACES = {
  mathlab: () => import('./locales/ar/mathlab.json'),
  // « التحدّي اليومي » : les écrans du défi (élève, onglet enseignant, mode
  // d'affichage). Chacun est un lot paresseux sous <Suspense> ; la carte de
  // l'accueil et l'onglet de la classe lisent `student` / `teacher`.
  challenge: () => import('./locales/ar/challenge.json'),
  // « مذكرة الدرس » : la page de préparation de l'enseignant
  // (pages/teacher/LessonMemoPage.jsx, lot paresseux, sa propre <Suspense>).
  // Les deux libellés des boutons qui y mènent vivent dans `teacher`.
  memo: () => import('./locales/ar/memo.json'),
};

const onDemandBackend = {
  type: 'backend',
  init() {},
  read(language, namespace, callback) {
    const load = ON_DEMAND_NAMESPACES[namespace];
    if (!load) return callback(null, {});
    load().then((module) => callback(null, module.default), (error) => callback(error, null));
  },
};

i18n.use(onDemandBackend).use(initReactI18next).init({
  lng: LOCALE,
  fallbackLng: LOCALE,
  resources: {
    [LOCALE]: { common, nav, auth, access, lesson, student, marketing, teacher, admin },
  },
  // Les namespaces ci-dessus sont livrés avec l'application ; les autres
  // passent par `onDemandBackend`.
  partialBundledLanguages: true,
  defaultNS: 'common',
  // Chargés à l'initialisation. `mathlab` n'y est PAS : il est demandé par le
  // premier `useTranslation('mathlab')`.
  ns: ['common', 'nav', 'auth', 'access', 'lesson', 'student', 'marketing', 'teacher', 'admin'],
  interpolation: { escapeValue: false }, // React already escapes.
  returnEmptyString: false,
});

export default i18n;
