import { apiRequest, ApiError, classifyStatus } from './apiClient';

/**
 * Le battement du temps d'étude (docs/architecture/PARENT_SPACE.md §3).
 * `keepalive` : l'envoi part même quand l'onglet se ferme (pagehide).
 *
 * @param {string} token
 * @param {Array<{surface: string, active: number, idle: number, away: number, leaves: number}>} segments
 */
export async function sendStudyTime(token, segments) {
  const { ok, status, data } = await apiRequest('/student/study-time', {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ segments }),
  });
  if (!ok) throw new ApiError('study-time', classifyStatus(status), status);
  return data;
}
