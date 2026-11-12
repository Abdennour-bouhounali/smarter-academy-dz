/**
 * CE QU'AUCUN ÉCRAN AVANT SON HEURE NE MONTRE — la synthèse de l'unité 1 dans le lecteur de mission (2026-11-12 ; le propriétaire : « go ahead »
 * pour les synthèses des unités 1–4, recette PROVISOIRE de la synthèse — docs/reports/MISSION_ROLLOUT_PROGRESS.md › « The synthesis recipe »).
 * Lue par content/mission.test.js (le balayage par RÔLE, écrit AVANT la conversion : il a d'abord échoué sur la carte des معارف ouverte —
 * son nœud racine affichait la وضعية entière, 936 et 845 — rapport du constructeur).
 *
 * LE DÉFI 🏆 (module 8, `Module08Ahill.jsx` — JAMAIS retouché) est la وضعية des tabliers : 936 مئزرًا ورديًا و 845 مئزرًا أزرق sur le plus
 * grand nombre d'écoles → PGCD(936 ; 845) = 13 (Euclide : 936 = 845 × 1 + 91, 845 = 91 × 9 + 26, 91 = 26 × 3 + 13, 26 = 13 × 2 + 0), chaque
 * école reçoit 72 tabliers roses et 65 bleus ; leurres : 26 écoles (36 et 32, il reste 13), 91 écoles (10 et 9).
 * La وضعية DE L'UNITÉ (module 7) est la MÊME situation : le module 7 l'ANALYSE — ce que veut dire la condition, quel calcul, comment trouver
 * la part de chaque école — et ne la RÉSOUT jamais. Donc deux niveaux :
 *   1. LA SIGNATURE DU DÉFI (`ANSWER_TEXT`, rôles `BAD_*`) : ses restes, son PGCD, les parts — nulle part avant le 🏆, le module 7 compris ;
 *   2. LA SITUATION ELLE-MÊME (`SITUATION_TEXT`) : 936, 845, les tabliers — nulle part AVANT le module 7 (entraînements, cartes de mémoire et carte
 *      des معارف ouvertes dès le premier écran, ouverture, « أستعدّ »).
 * Rôles (`{ role, v }` d'un écran de manche — content/mission.test.js › shownOf, recalculé par core) :
 *   'pair'               jamais 936 ni 845 ;
 *   'pgcd' / 'groups'    jamais 13 (le nombre d'écoles), ni 26 ni 91 (les leurres) ;
 *   'remainder'          jamais 91, 26, 13 (les restes du défi) ;
 *   'share'              jamais 72 ni 65 (ce que reçoit chaque école), ni 36, 32, 10, 9 lus comme parts d'un leurre ;
 *   'quotient' / 'chip'  jamais 72 ni 65.
 */
export const NEVER = ['936', '845', '13', '72', '65', '91', '26'];
const BAD = {
  pair: ['936', '845'],
  pgcd: ['13', '26', '91'],
  groups: ['13', '26', '91'],
  remainder: ['91', '26', '13'],
  share: ['72', '65', '36', '32'],
  quotient: ['72', '65'],
  chip: ['72', '65', '13'],
};

/** Les violations pour ce qu'un écran de manche montre (`{ role, v }`) — vide si l'écran est propre. */
export function violations(shown, label = '') {
  const bad = [];
  shown.forEach((x) => {
    const v = String(x.v).replace(/\s+/g, '');
    if (['936', '845'].includes(v) || (BAD[x.role] ?? NEVER).includes(v)) bad.push(`${label}: ${x.v} (${x.role})`);
  });
  return bad;
}

/* ── Les mêmes signatures pour un TEXTE (un énoncé, une carte, la carte des معارف, l'ouverture, « أستعدّ », la feuille de camarade) ── */
// un nombre ENTIER isolé (ni dans 133, ni dans 1,3 ou 2.13, ni dans « 13{,}5 »)
const num = (n) => new RegExp(`(^|[^0-9,{}.])${n}(?![0-9]|\\{?,\\}?[0-9]|\\.[0-9])`);

/** 1. Le défi RÉSOLU : jamais avant le 🏆 (le module 7 compris). */
export const ANSWER_TEXT = [
  num('13'), num('72'), num('65'), num('91'), num('26'),
  // une ligne d'Euclide du défi, même écrite autrement
  /936\s*=\s*845/, /845\s*=\s*91/, /936\s*[-−]\s*845\s*=/,
  /(مدرسة|مدارس)[^.؛،:]{0,12}(?<![0-9])(13|26|91)(?![0-9])/,
];
/** 2. La situation elle-même : jamais AVANT le module 7. */
export const SITUATION_TEXT = [
  ...ANSWER_TEXT,
  num('936'), num('845'), num('1781'),
  /مآزر|مئزر|المآزر|مئزرًا|مئزرا/,
];

/** Les violations d'un texte — vide s'il est propre. `before7` : l'écran vient avant le module 7 (la situation elle-même y est interdite). */
export const textViolations = (s, label = '', { before7 = true } = {}) => (before7 ? SITUATION_TEXT : ANSWER_TEXT)
  .filter((re) => re.test(String(s))).map((re) => `${label}: ${re}`);

/** Les lignes d'un source sans ses commentaires ni ses métadonnées de source (comme `_unit/forbiddenShared.js` de l'unité 5). */
export const visibleLines = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')
  .replace(/\s\/\/ .*$/gm, '')
  .replace(/src\([^)]*\)/g, '')
  .split('\n');
