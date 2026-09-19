import { divisibility } from '@smarter-academy/core';

const { divmod } = divisibility;

/**
 * divisor-explorer — l'état de l'exploration « b قاسم لـ a ؟ ».
 *
 * L'élève POSE une taille de rayon `b` : les `a` livres se rangent en `q`
 * rayons pleins et `r` livres restent au sol. Le verdict n'est pas calculé
 * « à part » : il EST le reste. `tried` garde la mémoire des essais (le
 * verdict de chacun) — c'est ce semis de découvertes qui fait apparaître la
 * régularité (reste nul ⇔ diviseur) sans qu'on l'énonce.
 */
export function init({ a, b = null, candidates = [] }) {
  const state = { a, b: null, q: null, r: null, divides: null, tried: {}, candidates };
  return b ? place(state, b) : state;
}

/** Peut-on poser `b` comme taille de rayon ? Une chaîne = refus (raison). */
export function canPlace(state, b) {
  if (!Number.isInteger(b) || b < 1) return 'notNatural';
  if (b > state.a) return 'largerThanA';
  return true;
}

export function place(state, b) {
  if (canPlace(state, b) !== true) return state;
  const { q, r } = divmod(state.a, b);
  return { ...state, b, q, r, divides: r === 0, tried: { ...state.tried, [b]: r === 0 } };
}

/** La relation est visible quand l'élève a vu AU MOINS un reste nul et un reste non nul. */
export function discoveryReady(state) {
  const verdicts = Object.values(state.tried);
  return verdicts.includes(true) && verdicts.includes(false);
}

export function summary(state) {
  const yes = Object.entries(state.tried).filter(([, v]) => v).map(([k]) => Number(k)).sort((x, y) => x - y);
  const no = Object.entries(state.tried).filter(([, v]) => !v).map(([k]) => Number(k)).sort((x, y) => x - y);
  return { yes, no };
}
