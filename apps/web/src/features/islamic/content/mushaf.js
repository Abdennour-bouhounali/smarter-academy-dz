import { AUDIENCES as A, THEMES as T } from '../islamicThemes.js';

/**
 * Le verset de l'ACCUEIL élève, composé « comme dans le مصحف » : la basmala,
 * puis le verset en rasm ʿuthmānī et son médaillon de fin de verset
 * (MushafVerse.jsx). Le texte est celui de Tanzil, édition `quran-uthmani`
 * (api.alquran.cloud), extrait par programme et jamais retapé : le test
 * d'intégrité le compare à `__fixtures__/tanzilUthmani.json`
 * (scripts/islamic-fetch-sources.mjs).
 *
 * « اقرأ » — le premier mot révélé — ouvre l'espace où l'élève apprend.
 * Petit et statique : importé par l'accueil sans charger le registre.
 */
export const BASMALA_UTHMANI = { surah: 1, ayah: 1, text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' };

export const HOME_VERSE = {
  id: 'q-alaq-1-mushaf', type: 'quran', source: 'tanzil:quran-uthmani', sourceVerified: true,
  surah: 96, surahName: 'العلق', ayah: 1,
  verses: [{ ayah: 1, text: 'ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ' }],
  audience: A.STUDENT, themes: [T.KNOWLEDGE, T.INTENTION],
};
