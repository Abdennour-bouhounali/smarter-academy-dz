import { CONTEXTS as C } from './islamicThemes.js';

/**
 * LA FRÉQUENCE — combien de fois un rappel peut paraître. Pure (`planMoment`,
 * `recordShown`) + une persistance locale tolérante (`readFrequencyState`,
 * `writeFrequencyState` : un navigateur privé ou un stockage bloqué donne un
 * état vide, jamais une erreur).
 *
 *   stickyMinutes   — le même rappel est REPRIS pendant ce délai (l'accueil
 *                     ne change pas de verset à chaque navigation) ;
 *   cooldownMinutes — après un rappel, ce moment se TAIT pendant ce délai
 *                     (une pause, une difficulté : jamais en rafale).
 *
 * Pas de notification, pas de compteur, pas de série : la fréquence ne sert
 * qu'à se faire RARE (aucune gamification — doc § Règles).
 */
export const MOMENT_POLICY = Object.freeze({
  [C.HOME]: { stickyMinutes: 360, cooldownMinutes: 0 },
  [C.TEACHER_HOME]: { stickyMinutes: 360, cooldownMinutes: 0 },
  [C.TEACHER_START]: { stickyMinutes: 360, cooldownMinutes: 0 },
  [C.STUDY_START]: { stickyMinutes: 60, cooldownMinutes: 0 },
  [C.LESSON_START]: { stickyMinutes: 60, cooldownMinutes: 0 },
  [C.STUDY_PROGRESS]: { stickyMinutes: 60, cooldownMinutes: 0 },
  [C.LESSON_COMPLETION]: { stickyMinutes: 60, cooldownMinutes: 0 },
  [C.EXERCISE_SUCCESS]: { stickyMinutes: 30, cooldownMinutes: 0 },
  [C.MODULE_START]: { stickyMinutes: 0, cooldownMinutes: 30 },
  [C.STUDY_BREAK]: { stickyMinutes: 0, cooldownMinutes: 25 },
  [C.DIFFICULTY]: { stickyMinutes: 0, cooldownMinutes: 15 },
  [C.MISTAKE]: { stickyMinutes: 0, cooldownMinutes: 15 },
  [C.GENERAL]: { stickyMinutes: 60, cooldownMinutes: 0 },
});

/** Les N derniers rappels montrés, tous moments confondus, évités par le sélecteur. */
export const RECENT_LIMIT = 12;
export const STORAGE_KEY = 'sa_islamic_moments_v1';
const MINUTE = 60 * 1000;

export const emptyFrequencyState = () => ({ recent: [], lastShown: {} });

/**
 * Que faire pour `context` maintenant ?
 *   { action: 'reuse', id }  — reprendre le rappel en cours (sticky) ;
 *   { action: 'skip' }       — se taire (cooldown) ;
 *   { action: 'select' }     — choisir un nouveau rappel.
 */
export function planMoment({ context, state, now }) {
  const policy = MOMENT_POLICY[context] ?? MOMENT_POLICY[C.GENERAL];
  const last = state?.lastShown?.[context];
  if (!last) return { action: 'select' };
  const elapsed = now - last.at;
  if (elapsed < 0) return { action: 'select' }; // horloge reculée : on repart proprement
  if (policy.stickyMinutes > 0 && elapsed < policy.stickyMinutes * MINUTE) return { action: 'reuse', id: last.id };
  if (policy.cooldownMinutes > 0 && elapsed < policy.cooldownMinutes * MINUTE) return { action: 'skip' };
  return { action: 'select' };
}

export function recordShown(state, { context, id, now }) {
  const base = state ?? emptyFrequencyState();
  return {
    recent: [id, ...base.recent.filter((x) => x !== id)].slice(0, RECENT_LIMIT),
    lastShown: { ...base.lastShown, [context]: { id, at: now } },
  };
}

/** Une graine qui change chaque jour : les ex æquo tournent, le test reste déterministe. */
export const daySeed = (now) => Math.floor(now / (24 * 60 * MINUTE));

export function readFrequencyState(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return emptyFrequencyState();
    const parsed = JSON.parse(raw);
    return {
      recent: Array.isArray(parsed?.recent) ? parsed.recent.filter((x) => typeof x === 'string') : [],
      lastShown: parsed?.lastShown && typeof parsed.lastShown === 'object' ? parsed.lastShown : {},
    };
  } catch {
    return emptyFrequencyState();
  }
}

export function writeFrequencyState(state, storage = globalThis.localStorage) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Stockage plein ou bloqué : le rappel reste affiché, seule la mémoire se perd.
  }
}
