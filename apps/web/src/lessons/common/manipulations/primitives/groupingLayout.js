import { equalGrouping } from '@smarter-academy/core';

const { groupInto } = equalGrouping;

/**
 * LA MISE EN PAGE D'UNE RÉPARTITION EN GROUPES IDENTIQUES — pure, testée.
 *
 * `a` objets d'un premier type et `b` d'un second, répartis en `k` groupes
 * identiques : chaque groupe reçoit `qa` et `qb`, et `ra` / `rb` restent en
 * dehors. C'est la double lecture de la division euclidienne (core,
 * equalGrouping.groupInto) ; ici on décide seulement COMMENT la dessiner :
 *
 *   • combien de groupes sont dessinés (`shown`) et combien résumés
 *     (`hidden`) — 90 bouquets ne tiennent sur aucun écran, 18 oui ;
 *   • la largeur d'un objet, qui suit la CHARGE d'un groupe : plus un groupe
 *     contient d'objets, plus ils sont petits, jamais moins que lisible ;
 *   • combien d'objets par rangée dans un groupe, pour rester lisible à 320 px.
 *
 * Aucun nœud n'est tronqué silencieusement dans un groupe dessiné : le compte
 * que l'élève lit dans « 10 حمراء و 6 بيضاء » est le compte qu'il voit.
 */
export function groupingLayout({ a, b, k, maxGroups = 18 }) {
  if (k === null || k === undefined) {
    return { k: null, qa: null, qb: null, ra: null, rb: null, works: null, shown: 0, hidden: 0, itemWidth: itemWidthFor(a + b), perRow: perRowFor(a + b) };
  }
  const A = groupInto(a, k);
  const B = groupInto(b, k);
  const qa = A ? A.perGroup : 0;
  const qb = B ? B.perGroup : 0;
  const ra = A ? A.leftOver : a;
  const rb = B ? B.leftOver : b;
  const shown = Math.min(k, maxGroups);
  const perGroup = qa + qb;
  return {
    k, qa, qb, ra, rb,
    works: ra === 0 && rb === 0,
    shown,
    hidden: k - shown,
    itemWidth: itemWidthFor(perGroup),
    perRow: perRowFor(perGroup),
  };
}

/** La largeur d'un objet (px) selon le nombre d'objets à dessiner ensemble. */
export function itemWidthFor(count) {
  if (count > 120) return 10;
  if (count > 60) return 12;
  if (count > 24) return 14;
  if (count > 10) return 16;
  return 20;
}

/** Combien d'objets par rangée dans un cadre — borné pour tenir sur un téléphone. */
export function perRowFor(count) {
  if (count > 60) return 12;
  if (count > 24) return 8;
  if (count > 10) return 6;
  return 5;
}
