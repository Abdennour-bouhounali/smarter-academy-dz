import { apiRequest, ApiError, classifyStatus } from '../../services/apiClient';
import { call, get, send, query } from '../../services/admin/adminClient';

const json = { 'Content-Type': 'application/json' };

/** Premier message de validation Laravel, sinon le message générique. */
function problem(data, fallback) {
  const first = data?.errors && Object.values(data.errors)[0]?.[0];
  return first || data?.message || fallback;
}

async function publicCall(path, options, fallback) {
  const { ok, status, data } = await apiRequest(path, options);
  if (!ok) throw new ApiError(problem(data, fallback), classifyStatus(status), status);
  return data;
}

// ── Vitrine publique ─────────────────────────────────────────────────────
export const fetchBooks = () => publicCall('/books', undefined, 'Impossible de charger les livres.');
export const fetchBook = (slug) => publicCall(`/books/${encodeURIComponent(slug)}`, undefined, 'Livre introuvable.');
export const fetchWilayas = () => publicCall('/books/wilayas', undefined, 'Impossible de charger les wilayas.');

export const submitBookOrder = (slug, payload) => publicCall(
  `/books/${encodeURIComponent(slug)}/orders`,
  { method: 'POST', headers: json, body: JSON.stringify(payload) },
  'Impossible d’envoyer la commande.',
);

export const submitBookMessage = (payload) => publicCall(
  '/books/messages',
  { method: 'POST', headers: json, body: JSON.stringify(payload) },
  'Impossible d’envoyer le message.',
);

// ── Administration (le jeton est toujours le premier argument) ───────────
export const fetchAdminBooks = (token) => call('/admin/books', get(token), 'Impossible de charger les livres.');
export const saveAdminBook = (token, id, body) => call(id ? `/admin/books/${id}` : '/admin/books', send(id ? 'PUT' : 'POST', token, body), 'Enregistrement impossible.');
export const fetchBookOrders = (token, filters) => call(`/admin/book-orders${query(filters)}`, get(token), 'Impossible de charger les commandes.');
export const fetchBookOrderStats = (token, filters) => call(`/admin/book-orders/stats${query(filters)}`, get(token), 'Impossible de charger les statistiques.');
export const fetchBookOrder = (token, id) => call(`/admin/book-orders/${id}`, get(token), 'Commande introuvable.');
export const updateBookOrder = (token, id, body) => call(`/admin/book-orders/${id}`, send('PATCH', token, body), 'Mise à jour impossible.');
export const updateBookOrderStatus = (token, id, status) => call(`/admin/book-orders/${id}/status`, send('PATCH', token, { status }), 'Changement d’état impossible.');
export const addBookOrderPayment = (token, id, body) => call(`/admin/book-orders/${id}/payments`, send('POST', token, body), 'Enregistrement impossible.');
export const removeBookOrderPayment = (token, paymentId) => call(`/admin/book-order-payments/${paymentId}`, send('DELETE', token), 'Suppression impossible.');
export const deleteBookOrder = (token, id) => call(`/admin/book-orders/${id}`, send('DELETE', token), 'Suppression impossible.');
export const fetchBookMessages = (token, filters) => call(`/admin/book-messages${query(filters)}`, get(token), 'Impossible de charger les messages.');
export const updateBookMessage = (token, id, body) => call(`/admin/book-messages/${id}`, send('PATCH', token, body), 'Mise à jour impossible.');
