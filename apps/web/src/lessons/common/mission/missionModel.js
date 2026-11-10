/**
 * LE FIL DE MISSION (pilote 2026-11-04, leçon qasim-adad-tabii) — LESSON_DEVELOPMENT_GUIDE « Le mode mission ».
 * Logique PURE, sans React : qui voit la mission, quels outils sont gagnés, quel point d'étape attend, l'état local.
 *
 * Une leçon l'active par `studentView: 'mission'` et décrit sa mission dans `LESSON_CONFIG.mission` :
 *   { title, opening: { text, cta }, tools: [{ id, icon, label }], climaxModule, checkpoints: [{ id, afterModule, prompt, options, correct, explain }] }
 * Les outils sont des connaissances de la leçon (knowledge.jsx) : un outil est gagné quand sa brique est établie.
 * Les points d'étape sont formatifs : ni preuve de maîtrise, ni blocage (comme les مسائل).
 */

/** La mission ne change que le regard de l'ÉLÈVE : jamais l'enseignant (lecteur libre) ni le mode classe. */
export function isMissionView(studentView, viewer, classroom) {
  return studentView === 'mission' && !viewer?.freeNavigation && !classroom?.isClassroomMode;
}

/** Les outils de la mission, chacun marqué gagné ou non d'après les connaissances déjà établies. */
export function missionTools(mission, itemIds) {
  const have = new Set(itemIds);
  return (mission?.tools ?? []).map((tool) => ({ ...tool, earned: have.has(tool.id) }));
}

const num = (n) => Number(n);
const done = (completedModules, n) => completedModules.some((m) => num(m) === num(n));

/**
 * Le point d'étape à poser en ARRIVANT sur `moduleNumber` : celui du module précédent, s'il est terminé et que
 * l'élève n'y a pas encore répondu (ni ne l'a passé). Sinon null.
 */
export function pendingCheckpoint(mission, completedModules, answered, moduleNumber) {
  const cp = (mission?.checkpoints ?? []).find((c) => num(c.afterModule) === num(moduleNumber) - 1);
  if (!cp || !done(completedModules, cp.afterModule) || cp.id in (answered ?? {})) return null;
  return cp;
}

/**
 * Les STATIONS du parcours, dans l'ordre des modules. `statusOf(module)` vient du verrou réel de la leçon
 * (moduleGate.resolveModuleStatus) : la carte ne déverrouille rien elle-même.
 * kind : 'climax' (la mission), 'bonus' (après elle), sinon 'stage'.
 */
export function missionStations(config, statusOf) {
  const climax = num(config.mission?.climaxModule);
  return config.modules.map((m) => ({
    number: num(m.number),
    slug: m.slug,
    title: m.title,
    status: statusOf(m),
    kind: num(m.number) === climax ? 'climax' : num(m.number) > climax ? 'bonus' : 'stage',
  }));
}

/** Le nom COURT d'une station : « نشاط 1 — 420 كتابًا في رفوف » → « 420 كتابًا في رفوف » (la partie qui dit quoi). */
export function stationLabel(title) {
  const parts = String(title ?? '').split(' — ');
  return (parts.length > 1 ? parts.slice(1).join(' — ') : parts[0]).trim();
}

/** L'ACCUEIL d'une station (la carte « أنت هنا ») : à la première arrivée seulement, et jamais par-dessus un point d'étape. */
export function shouldWelcome(seen, moduleNumber, checkpoint) {
  return !checkpoint && !(seen ?? {})[String(moduleNumber)];
}

/** La station où l'élève reprend : la première non terminée (`mastered` = faite ; null : tout est fait). */
export function resumeStation(stations) {
  return stations.find((s) => s.status !== 'mastered') ?? null;
}

// ── L'état local de la mission : l'ouverture vue, les réponses aux points d'étape, les stations déjà accueillies ──────────────────────────
export const missionKey = (lessonId) => `smarter_mission_${lessonId}`;

export function readMissionState(storage, lessonId) {
  try {
    const raw = JSON.parse(storage?.getItem(missionKey(lessonId)) ?? 'null');
    const obj = (v) => (v && typeof v === 'object' ? v : {});
    return { opened: Boolean(raw?.opened), answered: obj(raw?.answered), seen: obj(raw?.seen) };
  } catch {
    return { opened: false, answered: {}, seen: {} };
  }
}

export function writeMissionState(storage, lessonId, state) {
  try { storage?.setItem(missionKey(lessonId), JSON.stringify(state)); } catch { /* stockage indisponible : la mission reste jouable */ }
}

/**
 * L'ORDRE D'AFFICHAGE des choix d'un point d'étape (revue ECC 2026-11-10) : les leçons écrivent presque toujours la bonne réponse en
 * premier (`correct: 0`) — l'élève l'aurait vite appris. Une permutation DÉTERMINISTE, tirée de l'`id` du point d'étape : la même à chaque
 * rechargement, différente d'un point d'étape à l'autre. `order[k]` = l'indice d'origine du choix affiché en k ; la réponse gardée reste
 * l'indice d'ORIGINE (MissionCheckpoint le remet).
 */
export function checkpointOrder(id, n) {
  let h = 2166136261;
  for (const ch of String(id)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i -= 1) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    const j = (h >>> 8) % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  // jamais l'ordre ÉCRIT : il remettrait la bonne réponse en tête pour ce point d'étape — on le fait tourner d'un cran
  if (n > 1 && order.every((v, i) => v === i)) order.push(order.shift());
  return order;
}
