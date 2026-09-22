import { apiRequest, ApiError, classifyStatus } from './apiClient';
import { apiMessage } from './apiMessage';

/**
 * L'élève et sa classe (« قسمي ») : où il étudie, rejoindre, quitter.
 *
 * Le serveur reste l'autorité : rejoindre ne prend qu'un code ou un jeton
 * (jamais un identifiant de classe), et ce que l'élève voit ensuite —
 * dont les leçons que l'enseignant a masquées — revient par
 * GET /content/availability. Le MOTIF clos voyage sur l'erreur.
 */
async function call(path, options, messageKey) {
  const { ok, status, data } = await apiRequest(path, options);
  if (!ok) {
    const error = new ApiError(apiMessage(messageKey, data, status), classifyStatus(status), status);
    error.reason = data?.reason ?? null;
    throw error;
  }
  return data;
}

const auth = (token) => ({ Authorization: `Bearer ${token}` });

export function fetchStudyContext(token) {
  return call('/student/study-context', { headers: auth(token) }, 'studyContext').then((d) => d.studyContext);
}

/** @param {{code?: string, token?: string}} by */
export function joinClassGroup(token, by) {
  return call('/student/classrooms/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...auth(token) },
    body: JSON.stringify(by),
  }, 'classroomJoin');
}

export function leaveClassGroup(token, classroomId) {
  return call(`/student/classrooms/${encodeURIComponent(classroomId)}/leave`, {
    method: 'POST',
    headers: auth(token),
  }, 'classroomLeave');
}

/** Publique : ce qu'un lien d'invitation révèle avant tout compte. */
export function previewInvitation(inviteToken) {
  return call(`/invitations/${encodeURIComponent(inviteToken)}`, {}, 'invitationLoad').then((d) => d.invitation);
}
