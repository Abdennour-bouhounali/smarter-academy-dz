import { MANIPULATION_LEVEL_IDS, resolveLevelId } from '@smarter-academy/core';

/**
 * Les DEUX NIVEAUX de chaque type de manipulation — مبتدئ / متقدم, et rien
 * d'autre (décision du propriétaire, 2026-09-24 : l'ancienne échelle à quatre
 * paliers اكتشاف · موجّه · استقلالية · تحدّ est supprimée, pas cachée).
 *
 *   beginner   l'entrée : des nombres petits ou familiers, la relation
 *              visible d'un coup d'œil, l'outil qu'on découvre
 *   advanced   le MÊME outil, une demande mathématique plus forte : des
 *              nombres moins évidents, plus d'étapes, une stratégie à choisir
 *              — jamais une interface plus compliquée
 *
 * Ces paires sont celles d'une manipulation POSÉE SEULE dans un module. Dans
 * un `ManipulationWorkspace`, c'est la leçon qui déclare sa propre paire
 * (lesson.config.js, `level` + `autonomy`) et le workspace qui porte le
 * sélecteur : la manipulation n'en affiche pas un second.
 *
 * La difficulté suit la DEMANDE COGNITIVE. Les nombres sont ceux du manuel
 * (`ref` = identifiant dans l'extraction) ; un niveau ajouté par la
 * plateforme est marqué `source: 'platform'` et rendu avec « مثال تفاعلي
 * إضافي » (rien d'ajouté sans le dire). Aucun texte arabe ici : les libellés
 * sont dans lesson.json (`manipulation.level.*`).
 *
 * CONVERSION depuis les quatre paliers (choix par type, pas « 1-2 → مبتدئ,
 * 3-4 → متقدم ») — la raison est notée sur chaque paire.
 */
const T = (ref) => ({ source: 'textbook', ref });
const P = { source: 'platform' };

export const LEVELS = Object.freeze({
  // 24 : six diviseurs visibles d'un coup ; 1512 : il faut les règles de
  // divisibilité (le calcul direct n'est plus praticable) — l'ex-« تحدّ ».
  'divisor-explorer': {
    beginner: { numbers: { a: 24, b: 0 }, candidates: [3, 4, 5, 6, 8, 12], ...P },
    advanced: { numbers: { a: 1512, b: 0 }, candidates: [21, 72, 25, 9], ...T('ex-1') },
  },
  // Le RAYON QU'ON ÉTIRE (quotition). 24 livres, rayons de 2 à 12 : six
  // longueurs qui vident le sol sur onze, des rayons qu'on compte d'un
  // regard. 420 : l'activité du manuel — le serre-livres de 10 à 60, sans
  // longueur proposée, les deux propositions du libraire (26, 28) marquées
  // sur la réglette comme dans l'énoncé, et 11 longueurs sur 51 qui vident
  // le sol : il faut chercher.
  'divisor-explorer-books': {
    beginner: { numbers: { total: 24 }, range: { min: 2, max: 12 }, marks: [], ...P },
    advanced: { numbers: { total: 420 }, range: { min: 10, max: 60 }, marks: [26, 28], ...T('act-1') },
  },
  // 15 en 3 : le partage tombe juste ; 42 en 5 : plus grand, et il reste
  // deux joueurs — le contraste se construit seul, sans choix proposés.
  'team-builder': {
    beginner: { numbers: { total: 15, groups: 3 }, ...P },
    advanced: { numbers: { total: 42, groups: 5 }, ...T('act-1') },
  },
  // 24 : pair, des couples évidents ; 105 : impair (3 × 5 × 7), il faut
  // tester jusqu'à √105 — la méthode du manuel. 910 (ancien palier 4)
  // restait un exercice de calcul, pas une manipulation lisible.
  'factor-pairs': {
    beginner: { numbers: { n: 24 }, ...P },
    advanced: { numbers: { n: 105 }, ...T('method-divisors') },
  },
  // n = 3 sur 18 et 12 ; n = 9 sur 900 et 90 : même propriété, des nombres
  // qu'on ne peut plus « voir » — la paire que la leçon déclare déjà.
  'divisor-properties': {
    beginner: { numbers: { n: 3, a: 18, b: 12 }, ...T('act-3') },
    advanced: { numbers: { n: 9, a: 900, b: 90 }, ...T('know-2') },
  },
  // 12 et 18 : PGCD 6, des listes courtes ; 65 et 78 : PGCD 13, un diviseur
  // commun qu'aucun réflexe (2, 3, 5) ne trouve.
  'common-divisors': {
    beginner: { numbers: { a: 12, b: 18 }, ...T('know-3') },
    advanced: { numbers: { a: 65, b: 78 }, ...T('try-1a') },
  },
  // 21 et 14 : trois soustractions ; 378 et 315 : le second calcul de
  // l'activité 6, une longue suite de différences à mener seul.
  'pgcd-differences': {
    beginner: { numbers: { a: 21, b: 14 }, ...T('know-4') },
    advanced: { numbers: { a: 378, b: 315 }, ...T('act-6a') },
  },
  // 45 et 18 : deux divisions ; 3356 et 1528 : le second calcul de
  // l'activité 6, des restes qu'on ne devine pas.
  'euclidean-algorithm': {
    beginner: { numbers: { a: 45, b: 18 }, ...T('know-4') },
    advanced: { numbers: { a: 3356, b: 1528 }, ...T('act-6b') },
  },
  // 17 et 18 : consécutifs, premiers entre eux « à vue » ; 27 et 36 : le
  // piège de l'activité (« هل مريم على صواب؟ ») — ils ne le sont pas.
  'coprime-explorer': {
    beginner: { numbers: { a: 17, b: 18 }, ...T('act-7') },
    advanced: { numbers: { a: 27, b: 36 }, ...T('act-7') },
  },
  // 28/42 : une simplification par 14 qui se voit ; 595/560 : PGCD 35, il
  // faut le chercher avant de simplifier — l'exemple de la méthode.
  'fraction-reduction': {
    beginner: { numbers: { n: 28, d: 42 }, ...T('know-6') },
    advanced: { numbers: { n: 595, d: 560 }, ...T('method-reduce') },
  },
  // ── Unité 2 (2026-09-30). `scale` est la graduation la plus fine de la
  // règle (1/scale) : c'est elle qui porte la demande du niveau avancé.
  // 36 : le côté tombe juste sur une graduation entière (نشاط 1، س 3) ;
  // 5 : l'aire du carré construit sur BC (نشاط 1) — aucun décimal jusqu'au
  // millième, il faut encadrer à chaque graduation.
  'square-root-side': {
    beginner: { numbers: { num: 36, den: 1, scale: 10 }, ...T('act-1') },
    advanced: { numbers: { num: 5, den: 1, scale: 1000 }, ...T('act-1') },
  },
  // 9 au pas de 1/2 (مراد و عمر) ; 25 au pas de 0,1 avec 3, 0,04, 0 et −9 :
  // la liste de l'activité 3, dont √3 qu'aucune graduation n'atteint.
  'square-fold': {
    beginner: { numbers: { a: 9, scale: 2 }, targets: [9, 0, -9], ...T('act-3') },
    advanced: { numbers: { a: 25, scale: 10 }, targets: [25, 3, 0.04, 0, -9], ...T('act-3') },
  },
  // 28 = 2² × 7 (معارف 4 : √28 = 2√7), deux pavages seulement ; 288 (تمرين
  // 18) : six pavages possibles, il faut trouver celui dont la dalle est la
  // plus petite.
  'square-tiling': {
    beginner: { numbers: { n: 28 }, ...T('know-4') },
    advanced: { numbers: { n: 288 }, ...T('ex-18') },
  },
  // ── Unité 3 (2026-10-01). `expr` écrit les deux facteurs « f1|f2 ».
  // 3(x + 5) : une seule distributivité, deux zones ; (3x − 1)(3 + x)
  // (نشاط 1، س 3) : quatre zones dont deux RETRANCHÉES, et des termes à réunir.
  'pitch-expansion': {
    beginner: { numbers: { expr: '3|x+5' }, ...T('know-1') },
    advanced: { numbers: { expr: '3x-1|3+x' }, ...T('act-1') },
  },
  // Mode rows. 9x + 3 (نشاط 3، س 2) : rangées de hauteur 1, un seul r > 1
  // juste ; 6x² + 4x (معارف 3) : rangées de hauteur x, le facteur 2x à trouver
  // entier (le plus grand r ET la hauteur x).
  'turf-factoring': {
    beginner: { numbers: { expr: '9x+3' }, ...T('act-3') },
    advanced: { numbers: { expr: '6x^2+4x' }, ...T('know-3') },
  },
});

export { MANIPULATION_LEVEL_IDS };

/** La paire { beginner, advanced } d'un type, ou `null` s'il n'en déclare pas. */
export function levelsFor(type) {
  return LEVELS[type] ?? null;
}

const sameNumbers = (preset, numbers) =>
  !!preset && Object.keys(preset.numbers).every((k) => preset.numbers[k] === numbers?.[k]);

/** Le niveau dont les nombres sont exactement ceux passés, ou `null`. */
export function levelMatching(type, numbers) {
  const pair = levelsFor(type);
  if (!pair) return null;
  return MANIPULATION_LEVEL_IDS.find((id) => sameNumbers(pair[id], numbers)) ?? null;
}

/**
 * Les deux niveaux d'UNE manipulation posée par un module.
 *
 * Les nombres écrits par la leçon (`authored`) sont TOUJOURS l'un des deux
 * niveaux — l'élève arrive sur l'exemple de la leçon, jamais sur autre chose.
 * Lequel ? Celui demandé (`requested`), sinon celui dont la paire du type a
 * exactement ces nombres, sinon `beginner`. L'autre niveau est celui du type.
 *
 *   authored 27/36 (coprime)  → advanced = 27/36 (la leçon), beginner = 17/18
 *   authored 28/42 (common)   → beginner = 28/42 (la leçon), advanced = 65/78
 *
 * Retourne `{ initial, levels }` ou `null` si le type n'a pas de paire.
 */
export function resolveManipulationLevels(type, authored, requested) {
  const pair = levelsFor(type);
  if (!pair) return null;
  const matched = levelMatching(type, authored);
  const initial = requested != null ? resolveLevelId(requested) : (matched ?? MANIPULATION_LEVEL_IDS[0]);
  const base = matched === initial ? pair[initial] : { source: 'lesson' };
  return {
    initial,
    levels: { ...pair, [initial]: { ...base, numbers: authored, authored: true } },
  };
}
