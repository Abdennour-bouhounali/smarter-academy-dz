/**
 * « قنّاص القيم » — les constantes du jeu.
 *
 * SCHEDULE est le MIROIR de apps/api/config/madar.php › sniper : le calendrier
 * des manches est FIXE (la manche k commence à un instant connu), donc le
 * serveur borne la manche atteinte et le score par la durée réelle
 * (SniperScoring ↔ bound.js). Changer une valeur ici, c'est la changer là-bas.
 */
export const SCHEDULE = Object.freeze({
  firstAt: 2.5,
  cardsPerRound: 8,
  gapStart: 1.6,
  gapMin: 0.85,
  gapStep: 0.05,
  fallStart: 7.5,
  fallMin: 4,
  fallStep: 0.2,
  breather: 2.5,
  roundsPerLevel: 3,
  maxLevel: 6,
  pointsPerLevel: 10,
  maxMultiplier: 4,
  perfectBonus: 50,
});

/** Trois boucliers ; une manche parfaite en rend un. */
export const LIVES = 3;
/** Le multiplicateur monte toutes les STREAK_STEP cibles touchées d'affilée. */
export const STREAK_STEP = 5;
/** Les colonnes où tombent les cartes (cosmétique : le rendu les place). */
export const LANES = 4;

export const gap = (k) => Math.max(SCHEDULE.gapMin, SCHEDULE.gapStart - SCHEDULE.gapStep * k);
export const fall = (k) => Math.max(SCHEDULE.fallMin, SCHEDULE.fallStart - SCHEDULE.fallStep * k);
/** Le niveau de points (1…6) d'une manche k (0, 1, …). */
export const levelOf = (k) => Math.min(SCHEDULE.maxLevel, 1 + Math.floor(k / SCHEDULE.roundsPerLevel));

/** L'instant (s) où commence la manche k. */
export function roundStart(k) {
  let t = SCHEDULE.firstAt;
  for (let j = 0; j < k; j += 1) t += (SCHEDULE.cardsPerRound - 1) * gap(j) + fall(j) + SCHEDULE.breather;
  return t;
}

/** L'instant où la carte j de la manche k apparaît en haut. */
export const spawnAt = (k, j) => roundStart(k) + j * gap(k);
