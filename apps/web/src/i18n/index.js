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

i18n.use(initReactI18next).init({
  lng: LOCALE,
  fallbackLng: LOCALE,
  resources: {
    [LOCALE]: { common, nav, auth, access, lesson, student, marketing },
  },
  defaultNS: 'common',
  ns: ['common', 'nav', 'auth', 'access', 'lesson', 'student', 'marketing'],
  interpolation: { escapeValue: false }, // React already escapes.
  returnEmptyString: false,
});

export default i18n;
