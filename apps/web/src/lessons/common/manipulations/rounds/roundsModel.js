/**
 * LES MANCHES D'UN LABO (« الجولات », propriétaire 2026-11-04 : « le système de manches au lieu des niveaux, avec les étoiles »).
 * Logique PURE — LabRounds.jsx l'affiche. Un labo joué en manches : un chemin que l'élève parcourt (manche 1 → 2 → 3 → défi ⭐),
 * plus un terrain libre toujours ouvert, au lieu du sélecteur مبتدئ / متقدم qu'il devait choisir lui-même.
 *
 * Une manche : { id, title, props (pour <Manipulation>), goal: Condition[], stars: { firstTry?: true, maxTrials?: n }, optional?, free? }
 * Condition : { checkpoint: 'first' | 'contrast' }   — la suite de questions du labo terminée
 *             { exact: k }                          — une répartition JUSTE avec k groupes vue
 *             { allExact: [k…] }                    — toutes ces répartitions justes vues (le défi : tous les قواسم)
 * Ce que la manche a VU (`log`) : { verdicts: [{ groups, exact }], checkpoints: { [id]: true }, answers: [{ ok, tries, revealed }] }
 */

export const emptyLog = () => ({ verdicts: [], checkpoints: {}, answers: [] });

/** Le journal d'une manche après un événement du labo (onVerdict → 'verdict', onTrial → les événements LabCheckpoint). */
export function logEvent(log, kind, ev) {
  if (kind === 'verdict') return { ...log, verdicts: [...log.verdicts, { groups: Number(ev.groups), exact: Boolean(ev.exact) }] };
  if (ev?.tk === 'checkpoint') return { ...log, answers: [...log.answers, { ok: Boolean(ev.ok), tries: ev.tries ?? 1, revealed: Boolean(ev.revealed) }] };
  if (ev?.tk === 'checkpoint-done') return { ...log, checkpoints: { ...log.checkpoints, [ev.id]: true } };
  return log;
}

const exactGroups = (log) => new Set(log.verdicts.filter((v) => v.exact).map((v) => v.groups));

/** Une condition de but est-elle remplie ? */
export function conditionMet(cond, log) {
  if (cond.checkpoint) return Boolean(log.checkpoints[cond.checkpoint]);
  if (cond.exact != null) return exactGroups(log).has(Number(cond.exact));
  if (cond.allExact) { const seen = exactGroups(log); return cond.allExact.every((k) => seen.has(Number(k))); }
  return false;
}

/** La manche est-elle gagnée ? (une manche libre n'a pas de but : jamais « gagnée », jamais bloquante) */
export function roundWon(round, log) {
  if (round.free || !round.goal?.length) return false;
  return round.goal.every((c) => conditionMet(c, log));
}

/**
 * Les ÉTOILES d'une manche gagnée (1 à 3) : ★ gagnée ; ★ ses questions justes du PREMIER coup (aucune erreur, aucune réponse
 * révélée — sans question, l'étoile est acquise) ; ★ peu d'essais (au plus `maxTrials` répartitions). Mesurables, jamais un
 * chronomètre : l'étoile récompense la réflexion, pas la vitesse.
 */
export function starsFor(round, log) {
  if (!roundWon(round, log)) return 0;
  let stars = 1;
  const clean = log.answers.every((a) => a.ok && a.tries <= 1 && !a.revealed);
  if (round.stars?.firstTry === false || clean) stars += 1;
  const max = round.stars?.maxTrials;
  if (max == null || log.verdicts.length <= max) stars += 1;
  return Math.min(3, stars);
}

/** Une manche est-elle ouverte ? La première, une manche libre, ou celle dont la manche requise précédente est gagnée. */
export function roundUnlocked(rounds, index, best) {
  const round = rounds[index];
  if (!round) return false;
  if (index === 0 || round.free) return true;
  for (let i = index - 1; i >= 0; i -= 1) {
    if (rounds[i].free) continue;
    return (best[rounds[i].id] ?? 0) > 0;
  }
  return true;
}

/** La manche où reprendre : la première manche requise non gagnée, sinon la dernière gagnée. */
export function resumeRound(rounds, best) {
  const i = rounds.findIndex((r) => !r.free && !r.optional && !(best[r.id] > 0));
  if (i >= 0) return i;
  const won = rounds.map((r, k) => (best[r.id] > 0 ? k : -1)).filter((k) => k >= 0);
  return won.length ? won[won.length - 1] : 0;
}

// ── Les meilleures étoiles, par élève (scopedStorage) : { [labId]: { [roundId]: 1..3 } } pour toute la leçon ───────────
export const starsKey = (lessonId) => `smarter_stars_${lessonId}`;
export const STARS_EVENT = 'sa-stars-changed';

export function readStars(storage, lessonId) {
  try {
    const raw = JSON.parse(storage?.getItem(starsKey(lessonId)) ?? 'null');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

/** Garde la MEILLEURE note d'une manche (rejouer ne fait jamais perdre d'étoiles) ; renvoie le nouvel état. */
export function recordStars(storage, lessonId, labId, roundId, stars) {
  const all = readStars(storage, lessonId);
  const lab = all[labId] ?? {};
  if ((lab[roundId] ?? 0) >= stars) return all;
  const next = { ...all, [labId]: { ...lab, [roundId]: stars } };
  try { storage?.setItem(starsKey(lessonId), JSON.stringify(next)); } catch { /* stockage indisponible : les étoiles restent à l'écran */ }
  return next;
}

/** Le total d'étoiles de la leçon (la barre de mission l'affiche). */
export function totalStars(all) {
  return Object.values(all ?? {}).reduce((sum, lab) => sum + Object.values(lab ?? {}).reduce((a, b) => a + (Number(b) || 0), 0), 0);
}
