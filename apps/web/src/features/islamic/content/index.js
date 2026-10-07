import { QURAN } from './quran.js';
import { HADITH } from './hadith.js';
import { DUAS } from './duas.js';
import { VALUES, WISDOMS, REFLECTIONS } from './values.js';

/**
 * LE registre des contenus — chargé À LA DEMANDE (`loadIslamicContent`, via
 * `import()`) : ni le lot d'entrée ni le runtime de leçon ne le portent
 * (BUNDLE_BOUNDARIES.md).
 *
 * Déclaratif et prêt pour un futur back-office : chaque élément porte
 * `status` (seul `published` est servi) et `active`. Les champs d'édition
 * (`approvedBy`, `publishedAt`) n'existent pas encore — Planned.
 */
const withDefaults = (item) => ({ status: 'published', active: true, priority: 1, ...item });

export const ISLAMIC_CONTENT = [...QURAN, ...HADITH, ...DUAS, ...VALUES, ...WISDOMS, ...REFLECTIONS].map(withDefaults);

export default ISLAMIC_CONTENT;
