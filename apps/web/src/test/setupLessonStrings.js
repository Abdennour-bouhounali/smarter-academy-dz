// Les tests de rendu lisent les textes des manipulations comme une page de leçon :
// en production ils arrivent avec la leçon (i18n/lessonManipulationStrings.js) ;
// ici ils sont fusionnés dans `lesson` dès qu'un test charge i18n, pour que
// « aucune clé brute » reste vérifiable (BUNDLE_BOUNDARIES.md §3, « lesson.manipulation »).
// Un test qui ne charge pas i18n n'en reçoit pas : rien n'est initialisé à sa place.
import { vi } from 'vitest';

vi.mock('../i18n/index.js', async (importOriginal) => {
  const mod = await importOriginal();
  const { default: manipulation } = await import('../i18n/locales/ar/lesson.manipulation.json');
  const { LOCALE } = await import('../locale.js');
  mod.default.addResourceBundle(LOCALE, 'lesson', { manipulation }, true, true);
  return mod;
});
