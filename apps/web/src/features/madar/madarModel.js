/**
 * Mise en forme pure de « مدار » (aucun appel réseau, aucun DOM).
 */
const NUMBER = new Intl.NumberFormat('en-US');

/** Les nombres du jeu en chiffres occidentaux groupés (ar-DZ), toujours en `dir="ltr"`. */
export function formatScore(n) {
  return NUMBER.format(Math.max(0, Math.round(n ?? 0)));
}

/** Les cœurs, un par case : plein / vide. */
export function heartSlots(hearts, max) {
  return Array.from({ length: Math.max(0, max) }, (_, i) => i < hearts);
}

/** La sortie de crash : continuer avec un cœur, gagner un cœur d'abord, ou finir. */
export function crashOptions({ hearts, revives, maxRevives }) {
  const canContinue = revives < maxRevives;
  return {
    revive: canContinue && hearts > 0,
    refuelToRevive: canContinue && hearts <= 0,
    revivesLeft: Math.max(0, maxRevives - revives),
  };
}

/** Une montée au classement, seulement si elle est réelle (jamais « tu as reculé »). */
export function rankMovement(rank) {
  if (!rank || rank.after == null) return null;
  if (rank.before == null || rank.after < rank.before) return { kind: 'up', to: rank.after };
  return { kind: 'same', to: rank.after };
}

/** Le prochain vaisseau à débloquer : le plus proche de son seuil. */
export function nextShipGoal(ships) {
  const locked = (ships ?? []).filter((s) => !s.unlocked && s.rule);
  if (locked.length === 0) return null;
  return locked
    .map((s) => ({ ...s, ratio: Math.min(1, s.rule.progress / s.rule.threshold) }))
    .sort((a, b) => b.ratio - a.ratio)[0];
}

/** Ce qui empêche de lancer une partie maintenant (null = rien). */
export function playBlocker(state) {
  if (!state) return 'loading';
  if (!state.available) return state.reason ?? 'disabled';
  if (state.runsToday >= state.dailyRunCap) return 'daily_cap';
  if (state.hearts < 1) return 'no_hearts';
  return null;
}

/** Le temps qui reste (ms) sur une question, d'après l'horloge corrigée du serveur. */
export function remainingMs(timeLimitS, elapsedMs) {
  return Math.max(0, timeLimitS * 1000 - elapsedMs);
}

/** La couleur du chronomètre : calme, puis ambre, puis rouge dans les dix dernières secondes. */
export function timerTone(remaining, total) {
  if (remaining <= 10_000) return 'danger';
  if (remaining <= total * 0.35) return 'warn';
  return 'calm';
}

/** Une absence de la page qui compte (une notification ou le clavier ne comptent pas). */
export const LEAVE_MIN_MS = 1500;

export function countsAsLeft(awayMs) {
  return awayMs >= LEAVE_MIN_MS;
}

/** Les ajustements de l'enseignant, en messages : signe, nombre, motif. */
export function adjustmentKind(applied) {
  if (applied > 0) return 'gave';
  if (applied < 0) return 'took';
  return 'warned';
}
