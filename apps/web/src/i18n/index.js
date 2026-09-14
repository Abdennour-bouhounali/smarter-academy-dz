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

i18n.use(initReactI18next).init({
  lng: LOCALE,
  fallbackLng: LOCALE,
  resources: {
    [LOCALE]: { common, nav, auth },
  },
  defaultNS: 'common',
  ns: ['common', 'nav', 'auth'],
  interpolation: { escapeValue: false }, // React already escapes.
  returnEmptyString: false,
});

export default i18n;
