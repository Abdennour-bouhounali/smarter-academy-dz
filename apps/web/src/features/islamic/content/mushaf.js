import { AUDIENCES as A, THEMES as T } from '../islamicThemes.js';

/**
 * Le verset de l'ACCUEIL élève, composé « comme dans le مصحف » : la basmala,
 * puis le verset et son médaillon de fin de verset (MushafVerse.jsx). Le texte
 * est celui de Tanzil, édition `quran-simple` (api.alquran.cloud) — la même que
 * le reste du registre —, extrait par programme et jamais retapé : le test
 * d'intégrité le compare à `__fixtures__/tanzilSimple.json`.
 *
 * Pourquoi pas le rasm ʿuthmānī : il écrit la yāʾ finale sans points
 * (« ٱلَّذِى »), ce qui se lit comme une faute ; le propriétaire veut « الَّذِي »
 * (2026-10-07). Aucune édition ʿuthmānī consultée ne l'écrit ainsi
 * (quran-uthmani, -min, quran-unicode, quran-academy) : on prend l'édition
 * simple de Tanzil plutôt que de toucher au texte.
 *
 * « اقرأ » — le premier mot révélé — ouvre l'espace où l'élève apprend.
 * Petit et statique : importé par l'accueil sans charger le registre.
 */
export const BASMALA = { surah: 1, ayah: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' };

export const HOME_VERSE = {
  id: 'q-alaq-1-mushaf', type: 'quran', source: 'tanzil:quran-simple', sourceVerified: true,
  surah: 96, surahName: 'العلق', ayah: 1,
  verses: [{ ayah: 1, text: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ' }],
  audience: A.STUDENT, themes: [T.KNOWLEDGE, T.INTENTION],
};
