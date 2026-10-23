import { call, get, send } from './teacher/teacherClient';

/**
 * Transport de « مدار » côté élève (docs/architecture/MADAR_GAME.md).
 *
 * Le client n'envoie jamais un cœur, une durée ou une justesse : un score
 * (borné par le serveur avec la durée RÉELLE de la partie) et une réponse
 * brute. Les erreurs portent un `reason` clos (`no_hearts`, `daily_cap`,
 * `hearts_full`…) que l'écran traduit en arabe.
 */
const KEY = 'madar';

export const fetchMadar = (token) => call('/madar', get(token), KEY);
export const startRun = (token, game = 'orbit', level = null) => call('/madar/runs', send('POST', token, { game, ...(level ? { level } : {}) }), KEY);
export const reviveRun = (token, runId) => call(`/madar/runs/${encodeURIComponent(runId)}/revive`, send('POST', token), KEY);
export const finishRun = (token, runId, score, stars, wave, completed, extra = {}) => call(`/madar/runs/${encodeURIComponent(runId)}/finish`, send('POST', token, { score, stars, ...(wave != null ? { wave } : {}), ...(completed != null ? { completed } : {}), ...extra }), KEY);
export const chooseShip = (token, ship) => call('/madar/ship', send('PATCH', token, { ship }), KEY);
export const fetchRefuel = (token) => call('/madar/refuel', send('POST', token), KEY);
export const answerRefuel = (token, refuelId, answer, left = false) => call(`/madar/refuel/${encodeURIComponent(refuelId)}/answer`, send('POST', token, { answer, left }), KEY);
/** La page a été quittée pendant la question (au retour, avec la durée de l'absence). */
export const markRefuelLeft = (token, refuelId, awayMs) => call(`/madar/refuel/${encodeURIComponent(refuelId)}/left`, send('POST', token, { awayMs }), KEY);
