/**
 * La borne du serveur pour « قنّاص القيم » — MIROIR de
 * apps/api/app/Domain/Madar/SniperScoring.php (sans la tolérance ni la marge).
 * `sim.test.js` vérifie qu'une partie parfaite ne la dépasse jamais.
 */
import { SCHEDULE, gap, levelOf, roundStart } from './constants';

/** Le nombre de manches commencées en `seconds`. */
export function maxRound(seconds) {
  let k = 0;
  while (k < 1000 && roundStart(k) <= seconds) k += 1;
  return k;
}

export function perfectScore(seconds) {
  const perHit = SCHEDULE.pointsPerLevel * SCHEDULE.maxMultiplier;
  let score = 0;
  for (let k = 0; k < 1000 && roundStart(k) <= seconds; k += 1) {
    const level = levelOf(k);
    for (let j = 0; j < SCHEDULE.cardsPerRound && roundStart(k) + j * gap(k) <= seconds; j += 1) score += perHit * level;
    score += SCHEDULE.perfectBonus * level;
  }
  return score;
}
