import { call, get, send } from './teacherClient';

/**
 * « Mon offre » — enseignant ou élève, les mêmes routes /me.
 *
 * AUCUN paiement en ligne : ce module MONTRE les offres (prix informatif en
 * dinars), ENREGISTRE une demande, et rend l'état. Il n'active rien — c'est
 * l'administration qui active, à la main ou par code. Aucun import d'un
 * service de paiement ici, et le test de contrat le vérifie.
 */
export function fetchPlans(token) {
  return call('/me/plans', get(token), 'plansLoad').then((d) => d.plans);
}

/** Les offres ET ce que le gratuit accorde déjà en sièges (freeSeats). */
export function fetchPlanCatalog(token) {
  return call('/me/plans', get(token), 'plansLoad').then((d) => ({ plans: d.plans, freeSeats: d.freeSeats ?? null }));
}

/** Le devis SERVEUR pour N élèves — l'autorité ; le client n'affiche qu'un aperçu. */
export function fetchPlanQuote(token, planId, seats) {
  return call(`/me/plans/${encodeURIComponent(planId)}/quote?seats=${encodeURIComponent(seats)}`, get(token), 'planRequest').then((d) => d.quote);
}

export function fetchCapacity(token) {
  return call('/teacher/capacity', get(token), 'plansLoad').then((d) => d.capacity);
}

export function fetchMySubscription(token) {
  return call('/me/subscription', get(token), 'plansLoad');
}

/** Une DEMANDE : le nombre d'élèves voulu, jamais un prix — le serveur le calcule. */
export function requestPlan(token, planId, note, studentSeats) {
  return call('/me/subscription-requests', send('POST', token, { planId, note: note || undefined, studentSeats: studentSeats || undefined }), 'planRequest');
}

export function cancelPlanRequest(token, requestId) {
  return call(`/me/subscription-requests/${encodeURIComponent(requestId)}/cancel`, send('POST', token), 'planRequest');
}
