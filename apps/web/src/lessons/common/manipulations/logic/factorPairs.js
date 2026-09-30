import { divisibility } from '@smarter-academy/core';

const { divmod, divisionTestBound, divisors, factorPairs } = divisibility;

/**
 * factor-pairs — ranger `n` points en `d` colonnes.
 *
 * Un rectangle PARFAIT (dernière ligne pleine) livre le couple (d, n ÷ d) —
 * DEUX diviseurs d'un coup. Le tableau `pairs` garde les couples trouvés
 * (ordonnés petit × grand) ; quand un test au-delà de √n redonne un couple
 * déjà là, il est marqué `repeat` : c'est la règle d'arrêt, VÉCUE avant
 * d'être lue.
 */
export function init({ n }) {
  return { n, cols: null, rows: null, rest: null, pairs: [], tested: [], bound: divisionTestBound(n) };
}

export function canTest(state, d) {
  if (!Number.isInteger(d) || d < 1) return 'notNatural';
  if (d > state.n) return 'largerThanN';
  return true;
}

export function test(state, d) {
  if (canTest(state, d) !== true) return state;
  const { q, r } = divmod(state.n, d);
  const divides = r === 0;
  const key = divides ? `${Math.min(d, q)}x${Math.max(d, q)}` : null;
  // « TOURNÉ » est GÉOMÉTRIQUE, donc indépendant de l'ordre des essais : un
  // rectangle plus large que haut (d > q) est le rectangle q × d couché.
  // Avant (2026-09-29), `repeat` dépendait de ce qui avait été testé avant —
  // tester 8, 6, 5, 7 avant 1…4 marquait 3 et 4 « déjà vus ».
  const repeat = divides && d > q;
  const pairs = divides && !state.pairs.some((p) => p.key === key)
    ? [...state.pairs, { key, small: Math.min(d, q), big: Math.max(d, q), from: d }].sort((x, y) => x.small - y.small)
    : state.pairs;
  return {
    ...state, cols: d, rows: q, rest: r,
    pairs,
    tested: [...state.tested.filter((t) => t.d !== d), { d, divides, repeat, beyondBound: d > state.bound }].sort((x, y) => x.d - y.d),
  };
}

/**
 * La RÉGLETTE du rectangle : de 1 au premier diviseur au-delà de √n, et au
 * moins jusqu'à 2 × √n — assez pour voir les rectangles se coucher, jamais
 * jusqu'à n (105 colonnes ne se dessinent pas). Aucune marque ne signale √n :
 * c'est le rectangle qui devient carré qui le montre.
 */
export function widthRange(n) {
  const bound = divisionTestBound(n);
  let firstAbove = bound + 1;
  while (firstAbove <= n && n % firstAbove !== 0) firstAbove += 1;
  return { min: 1, max: Math.min(n, Math.max(firstAbove, 2 * bound)) };
}

/**
 * La GÉOMÉTRIE du rectangle, dans un cadre carré de côté `box` : `d` livres
 * par rangée, `rows` rangées pleines, et une rangée incomplète de `rest`. La
 * cellule est la plus grande qui fait tenir le rectangle ENTIER dans le cadre
 * : un rectangle haut et mince devient carré puis large et plat quand d
 * grandit — le carré, c'est √n, et l'élève le VOIT.
 */
export function rectangleLayout({ n, d, box }) {
  const rows = Math.floor(n / d);
  const rest = n - rows * d;
  const tall = rows + (rest > 0 ? 1 : 0);
  const cell = Math.max(2, Math.min(box / d, box / tall, 26));
  return { cell, cols: d, rows, rest, width: d * cell, height: tall * cell, square: d === rows && rest === 0 };
}

/** Tous les couples sont là quand les tests 1..√n sont faits. */
export function complete(state) {
  return Array.from({ length: state.bound }, (_, i) => i + 1).every((d) => state.tested.some((t) => t.d === d));
}

/** La règle d'arrêt est VISIBLE quand un test au-delà de √n a redonné un couple connu, le tableau étant complet. */
export function discoveryReady(state) {
  return complete(state) && state.tested.some((t) => t.beyondBound && t.repeat);
}

export function foundDivisors(state) {
  return [...new Set(state.pairs.flatMap((p) => [p.small, p.big]))].sort((x, y) => x - y);
}

export function allDivisors(state) {
  return divisors(state.n);
}

export function expectedPairs(state) {
  return factorPairs(state.n);
}
