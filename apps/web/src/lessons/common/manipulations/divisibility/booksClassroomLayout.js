/**
 * La MISE EN RAYON du mode classe — mathématiques pures, sans DOM.
 *
 * En présentation, chaque rayon montre ses livres sur UNE SEULE RANGÉE (un
 * rayon est une rangée), et la taille des livres est calculée pour que TOUS
 * les rayons tiennent dans la zone que la scène offre : d'abord la plus
 * grande taille de livre qui fait tout tenir ; à défaut, la taille minimale
 * lisible, et la zone des rayons défile alors EN INTERNE (jamais la page —
 * compteurs, égalité et reste demeurent visibles).
 *
 * La géométrie (paddings, étiquette, planche) suit l'échelle de présentation
 * `scale` ; la taille des livres, elle, vient de la place disponible.
 */

/** Proportions du livre illustré (viewBox 38×72 dessiné dans 30×62). */
export const BOOK_RATIO = 62 / 30;

/** En dessous, un livre n'est plus qu'une barre colorée : on ne descend pas. */
export const MIN_BOOK_WIDTH = 15;

/** Au-dessus, la scène gaspille la place : les livres de la leçon font 22 px. */
export const MAX_BOOK_WIDTH = 44;

/** Nombre maximal de colonnes de rayons essayées. */
export const MAX_COLUMNS = 8;

/**
 * Résout la grille des rayons.
 *
 * @param {{width:number, height:number, shelves:number, capacity:number, scale?:number}} p
 *   width/height  la zone disponible pour la grille des rayons (px)
 *   shelves       nombre de rayons pleins (le quotient)
 *   capacity      livres par rayon (le diviseur essayé)
 * @returns {{cols:number, rows:number, bookW:number, bookH:number, bookGap:number,
 *            fits:boolean, gap:number}|null}
 *   `null` quand il n'y a rien à ranger (avant le premier choix).
 */
export function solveShelfLayout({ width, height, shelves, capacity, scale = 1 }) {
  if (!(shelves > 0) || !(capacity > 0) || !(width > 0)) return null;
  const s = Number.isFinite(scale) && scale > 0 ? scale : 1;

  const gap = Math.round(12 * s);                 // entre rayons (colonnes et rangées)
  const bookGap = Math.max(2, Math.round(3 * s)); // entre livres
  const shelfPadding = Math.round(48 * s);        // bordures + paddings horizontaux du rayon et de sa planche
  const shelfExtra = Math.round(46 * s);          // étiquette « رف n · x/y », planche, paddings verticaux

  const widthBoundFor = (cols) => {
    const colW = (width - (cols - 1) * gap) / cols;
    return (colW - shelfPadding - (capacity - 1) * bookGap) / capacity;
  };
  const heightBoundFor = (rows) => {
    if (!(height > 0)) return Infinity;
    return ((height - (rows - 1) * gap) / rows - shelfExtra) / BOOK_RATIO;
  };

  let best = null;      // tient en entier : le plus grand livre gagne
  let fallback = null;  // ne tient pas : le plus de colonnes possible ≥ MIN (le plus de rayons visibles)
  const maxCols = Math.min(MAX_COLUMNS, shelves);
  for (let cols = 1; cols <= maxCols; cols += 1) {
    const rows = Math.ceil(shelves / cols);
    const wBound = widthBoundFor(cols);
    const w = Math.floor(Math.min(wBound, heightBoundFor(rows), MAX_BOOK_WIDTH));
    if (w >= MIN_BOOK_WIDTH && (!best || w > best.bookW)) best = { cols, rows, bookW: w, fits: true };
    const wFallback = Math.floor(Math.min(wBound, MAX_BOOK_WIDTH));
    if (wFallback >= MIN_BOOK_WIDTH) fallback = { cols, rows, bookW: wFallback, fits: false };
  }

  const chosen = best ?? fallback ?? { cols: 1, rows: shelves, bookW: MIN_BOOK_WIDTH, fits: false };
  // Les livres RESTÉS AU SOL (le point pédagogique) ne sont PAS décidés ici :
  // leur taille suit la seule échelle, en CSS (clamp(22px, 36px × échelle,
  // 44px)), parce que la hauteur du sol entre dans le budget des rayons —
  // la faire dépendre de ce que le budget produit ferait boucler la mesure.
  return {
    ...chosen,
    bookH: Math.round(chosen.bookW * BOOK_RATIO),
    bookGap,
    gap,
  };
}
