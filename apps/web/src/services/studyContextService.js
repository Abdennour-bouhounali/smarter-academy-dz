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

/**
 * Rejoindre = CONSENTIR au partage : le serveur refuse (422
 * `consent_required`) tout corps sans `consent: true`. Le drapeau ne part
 * que si l'appelant le passe explicitement — il doit venir d'un geste de
 * l'élève (« أوافق وأنضمّ »), jamais d'un défaut du service.
 *
 * @param {{code?: string, token?: string, consent?: boolean}} by
 */
export function joinClassGroup(token, by) {
  const body = by.token ? { token: by.token } : { code: by.code };
  if (by.consent === true) body.consent = true;
  return call('/student/classrooms/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...auth(token) },
    body: JSON.stringify(body),
  }, 'classroomJoin');
}

/**
 * Confirmer le texte de partage ACTUEL pour une adhésion déjà active
 * (`consentRequired` : adhésion antérieure au texte, ou texte modifié).
 */
export function confirmClassConsent(token, classroomId) {
  return call(`/student/classrooms/${encodeURIComponent(classroomId)}/consent`, {
    method: 'POST',
    headers: auth(token),
  }, 'classroomJoin').then((d) => d.studyContext);
}

/** Les suggestions des enseignants de l'élève — jamais un verrou. */
export function fetchTeacherRecommendations(token) {
  return call('/student/teacher-recommendations', { headers: auth(token) }, 'studyContext')
    .then((d) => (Array.isArray(d.recommendations) ? d.recommendations : []));
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
