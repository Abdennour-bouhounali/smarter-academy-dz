/**
 * Le DOCUMENT du مختبر الرياضيات, côté client — logique pure, sans React.
 *
 * Un document est l'enveloppe commune à tous les instruments :
 *
 *     { id, tool, title, schemaVersion, data, createdAt, updatedAt }
 *
 * `data` appartient à l'instrument (`tool`) : la coquille et la persistance
 * le transportent sans le lire. Un document NEUF n'a pas d'`id` : il naît sur
 * le serveur à son premier changement (useMathLabDocument), pas à l'ouverture
 * — ouvrir la سبّورة et repartir ne laisse aucune ligne vide.
 */

export const MATH_LAB_BASE_PATH = '/espace/atelier';

/** Le délai entre le dernier changement et la sauvegarde automatique. */
export const MATH_LAB_AUTOSAVE_MS = 2500;

/**
 * L'URL d'un instrument, ou d'un document ouvert dans cet instrument.
 *
 * @param {{slug: string}} tool
 * @param {number | string | null} [documentId]
 */
export function mathLabToolPath(tool, documentId = null) {
  const base = `${MATH_LAB_BASE_PATH}/${tool.slug}`;

  return documentId == null ? base : `${base}/${documentId}`;
}

/**
 * Un document neuf, jamais enregistré.
 *
 * @param {import('./toolContract.js').MathLabTool} tool
 * @param {{title: string, seed?: unknown}} options
 */
export function newMathLabDocument(tool, { title, seed }) {
  return {
    id: null,
    tool: tool.id,
    title,
    schemaVersion: tool.schemaVersion,
    data: tool.createInitialData(seed),
    createdAt: null,
    updatedAt: null,
  };
}

/** Un document tel que l'API le rend, ramené à la forme du client. */
export function fromApiDocument(payload) {
  return {
    id: payload.id,
    tool: payload.tool,
    title: payload.title ?? '',
    schemaVersion: payload.schemaVersion ?? 1,
    data: payload.data ?? null,
    dataBytes: payload.dataBytes ?? 0,
    createdAt: payload.createdAt ?? null,
    updatedAt: payload.updatedAt ?? null,
  };
}

export function isPersisted(document) {
  return document != null && document.id != null;
}

/** Un identifiant de route (`:documentId`) → nombre, ou null s'il est absent ou invalide. */
export function parseDocumentId(raw) {
  if (raw == null || raw === '') return null;
  const id = Number(raw);

  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Ce que le serveur reçoit : le titre, toujours propre et borné. */
export function cleanTitle(title, fallback) {
  const clean = String(title ?? '').replace(/\s+/g, ' ').trim();

  return (clean === '' ? fallback : clean).slice(0, 160);
}
