/**
 * Les PAGES d'une unité présentée — mathématiques pures, sans DOM.
 *
 * Une étape (ou une khulasa) qui réclame plus de hauteur que la zone offerte
 * ne doit pas être RÉDUITE jusqu'à l'illisible (le moteur d'ajustement
 * s'arrête à 0,55) : elle est DÉCOUPÉE en pages successives, chacune portant
 * l'en-tête de l'étape et une suite de BLOCS entiers (une carte, une
 * question…) — jamais un bloc coupé en deux.
 *
 *   hauteurs  : celles des blocs, ramenées à l'échelle 1 (hauteur mesurée ÷
 *               échelle effective), pour que le plan ne dépende pas de
 *               l'ajustement en cours — sinon réduire changerait le plan,
 *               qui changerait l'ajustement…
 *   budget    : la hauteur qu'une page peut réclamer SANS qu'il faille la
 *               réduire de plus de (1 − MIN_PAGE_FIT).
 *
 * ClassroomPaged.jsx mesure et applique ; ce fichier décide, et se teste seul.
 */

/**
 * Au-dessus de ce facteur, la page tient « sans se réduire » : un contenu qui
 * demanderait à être réduit de plus de 10 % est découpé plutôt que rétréci.
 */
export const MIN_PAGE_FIT = 0.9;

/** La hauteur (à l'échelle 1) qu'une page a le droit de réclamer. */
export function pageBudget({ areaHeight, userScale = 1, minFit = MIN_PAGE_FIT }) {
  const u = Number.isFinite(userScale) && userScale > 0 ? userScale : 1;
  if (!(areaHeight > 0)) return Infinity;
  return areaHeight / (u * minFit);
}

/**
 * Répartit les blocs en pages, dans l'ordre, en remplissant chaque page
 * jusqu'au budget (algorithme glouton : l'ordre pédagogique est sacré).
 *
 * @param {{heights:number[], budget:number, overhead?:number, gap?:number}} p
 *   `overhead` : ce que chaque page porte en plus des blocs (en-tête d'étape,
 *                marges du cadre) ; `gap` : l'espace entre deux blocs.
 * @returns {number[][]} pour chaque page, les index des blocs qu'elle montre.
 *   Toujours au moins une page ; un bloc plus haut que le budget a sa page.
 */
export function planPages({ heights, budget, overhead = 0, gap = 0 }) {
  const n = heights.length;
  if (n === 0) return [[]];
  const total = overhead + heights.reduce((s, h) => s + h, 0) + gap * (n - 1);
  if (!(budget > 0) || total <= budget) return [heights.map((_, i) => i)];

  const pages = [];
  let current = [];
  let used = overhead;
  heights.forEach((h, i) => {
    const add = h + (current.length ? gap : 0);
    if (current.length && used + add > budget) {
      pages.push(current);
      current = [];
      used = overhead;
    }
    used += h + (current.length ? gap : 0);
    current.push(i);
  });
  if (current.length) pages.push(current);
  return pages;
}

/** Ramène un index de page dans [0, count-1]. */
export function clampPage(index, count) {
  if (!(count > 0)) return 0;
  const i = Number.isFinite(index) ? Math.trunc(index) : 0;
  return Math.min(count - 1, Math.max(0, i));
}

/** La page qui montre le bloc `blockIndex` (0 si inconnu). */
export function pageOfBlock(pages, blockIndex) {
  const p = pages.findIndex((page) => page.includes(blockIndex));
  return p === -1 ? 0 : p;
}
