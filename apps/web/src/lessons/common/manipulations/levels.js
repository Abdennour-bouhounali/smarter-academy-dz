/**
 * Les PALIERS de difficulté de chaque manipulation (§18 du brief) :
 *
 *   1. اكتشاف     petits nombres, tout est visible d'un coup d'œil
 *   2. موجّه      l'exemple du manuel qui ouvre l'activité
 *   3. استقلالية  l'exemple de la méthode (طرائق) ou un second cas du manuel
 *   4. تحدّ       des nombres qui obligent à une stratégie (règles de
 *                divisibilité, nombres à 4 chiffres…)
 *
 * La difficulté suit la DEMANDE COGNITIVE, jamais le hasard. Les nombres sont
 * ceux du manuel (référence `ref` = identifiant dans l'extraction) ; les deux
 * seules exceptions sont marquées `source: 'platform'` et rendues avec
 * l'étiquette « مثال تفاعلي إضافي » (règle du propriétaire : rien d'ajouté
 * sans le dire). Aucun texte arabe ici : les libellés des paliers sont dans
 * lesson.json (`manipulation.levels.*`).
 */
const T = (ref) => ({ source: 'textbook', ref });
const P = { source: 'platform' };

export const LEVELS = Object.freeze({
  'divisor-explorer': [
    { id: 1, key: 'discover', numbers: { a: 24, b: 0 }, candidates: [3, 4, 5, 6, 8, 12], ...P },
    { id: 2, key: 'guided', numbers: { a: 420, b: 0 }, candidates: [26, 28, 15, 20, 21, 30, 35, 42], ...T('act-1') },
    { id: 3, key: 'autonomy', numbers: { a: 143, b: 0 }, candidates: [11, 12, 13], ...T('know-1') },
    { id: 4, key: 'challenge', numbers: { a: 1512, b: 0 }, candidates: [21, 72, 25, 9], ...T('ex-1') },
  ],
  'divisor-explorer-books': [
    { id: 1, key: 'discover', numbers: { total: 24 }, candidates: [3, 4, 5, 6, 8, 12], ...P },
    { id: 2, key: 'guided', numbers: { total: 420 }, candidates: [10, 12, 14, 15, 16, 18, 20, 21, 25, 26, 28, 30, 32, 35, 40, 42, 60], ...T('act-1') },
    { id: 3, key: 'autonomy', numbers: { total: 143 }, candidates: [11, 12, 13], ...T('know-1') },
    { id: 4, key: 'challenge', numbers: { total: 1512 }, candidates: [21, 72, 25, 9], ...T('ex-1') },
  ],
  'factor-pairs': [
    { id: 1, key: 'discover', numbers: { n: 24 }, ...P },
    { id: 2, key: 'guided', numbers: { n: 60 }, ...T('act-2') },
    { id: 3, key: 'autonomy', numbers: { n: 105 }, ...T('method-divisors') },
    { id: 4, key: 'challenge', numbers: { n: 910 }, ...T('ex-4') },
  ],
  'divisor-properties': [
    { id: 1, key: 'discover', numbers: { n: 3, a: 18, b: 12 }, ...T('act-3') },
    { id: 2, key: 'guided', numbers: { n: 5, a: 35, b: 15 }, ...T('act-3') },
    { id: 3, key: 'autonomy', numbers: { n: 7, a: 56, b: 21 }, ...T('act-3') },
    { id: 4, key: 'challenge', numbers: { n: 9, a: 900, b: 90 }, ...T('know-2') },
  ],
  'common-divisors': [
    { id: 1, key: 'discover', numbers: { a: 12, b: 18 }, ...T('know-3') },
    { id: 2, key: 'guided', numbers: { a: 90, b: 54 }, ...T('act-4') },
    { id: 3, key: 'autonomy', numbers: { a: 42, b: 60 }, ...T('act-5') },
    { id: 4, key: 'challenge', numbers: { a: 65, b: 78 }, ...T('try-1a') },
  ],
  'pgcd-differences': [
    { id: 1, key: 'discover', numbers: { a: 21, b: 14 }, ...T('know-4') },
    { id: 2, key: 'guided', numbers: { a: 252, b: 140 }, ...T('act-6a') },
    { id: 3, key: 'autonomy', numbers: { a: 117, b: 91 }, ...T('method-differences') },
    { id: 4, key: 'challenge', numbers: { a: 378, b: 315 }, ...T('act-6a') },
  ],
  'euclidean-algorithm': [
    { id: 1, key: 'discover', numbers: { a: 45, b: 18 }, ...T('know-4') },
    { id: 2, key: 'guided', numbers: { a: 765, b: 135 }, ...T('act-6b') },
    { id: 3, key: 'autonomy', numbers: { a: 1938, b: 836 }, ...T('method-euclid') },
    { id: 4, key: 'challenge', numbers: { a: 3356, b: 1528 }, ...T('act-6b') },
  ],
  'coprime-explorer': [
    { id: 1, key: 'discover', numbers: { a: 17, b: 18 }, ...T('act-7') },
    { id: 2, key: 'guided', numbers: { a: 22, b: 15 }, ...T('know-5') },
    { id: 3, key: 'autonomy', numbers: { a: 22, b: 35 }, ...T('act-7') },
    { id: 4, key: 'challenge', numbers: { a: 27, b: 36 }, ...T('act-7') },
  ],
  'fraction-reduction': [
    { id: 1, key: 'discover', numbers: { n: 28, d: 42 }, ...T('know-6') },
    { id: 2, key: 'guided', numbers: { n: 84, d: 48 }, ...T('act-8') },
    { id: 3, key: 'autonomy', numbers: { n: 188, d: 252 }, ...T('act-8') },
    { id: 4, key: 'challenge', numbers: { n: 595, d: 560 }, ...T('method-reduce') },
  ],
});

export const LEVEL_KEYS = Object.freeze(['discover', 'guided', 'autonomy', 'challenge']);

export function levelsFor(type) {
  return LEVELS[type] ?? [];
}

/** Le palier dont les nombres sont exactement ceux passés (pour marquer le palier courant). */
export function levelMatching(type, numbers) {
  return levelsFor(type).find((l) => Object.keys(l.numbers).every((k) => l.numbers[k] === numbers?.[k])) ?? null;
}
