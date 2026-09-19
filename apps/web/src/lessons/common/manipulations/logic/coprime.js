import { divisibility } from '@smarter-academy/core';

const { divisors, commonDivisors, gcdByDefinition } = divisibility;

/**
 * coprime-explorer — deux nombres, leurs diviseurs en orbite ; l'élève porte
 * dans la zone partagée ceux qui divisent LES DEUX. Quand il n'y reste que 1,
 * les nombres sont premiers entre eux ; sinon le diviseur ≠ 1 qui s'y trouve
 * le réfute (27 et 36 → 3 et 9).
 */
export function init({ a, b }) {
  return { a, b, da: divisors(a), db: divisors(b), common: commonDivisors(a, b), g: gcdByDefinition(a, b), shared: [], attempts: 0, checked: false };
}

/** L'id d'un jeton : `a:3` (le 3 de la liste de a). */
export const chipId = (side, d) => `${side}:${d}`;
export const parseChip = (id) => { const [side, d] = id.split(':'); return { side, d: Number(d) }; };

export function canShare(state, id) {
  const { d } = parseChip(id);
  if (state.shared.includes(d)) return 'alreadyShared';
  const inA = state.a % d === 0; const inB = state.b % d === 0;
  if (inA && inB) return true;
  return inA ? 'dividesOnlyA' : 'dividesOnlyB';
}

export function share(state, id) {
  if (canShare(state, id) !== true) return { ...state, attempts: state.attempts + 1 };
  const { d } = parseChip(id);
  return { ...state, shared: [...state.shared, d].sort((x, y) => x - y), checked: false };
}

export function allShared(state) {
  return state.common.every((d) => state.shared.includes(d));
}

/** « تحقّق » : la zone contient-elle exactement les communs ? */
export function check(state) {
  return { ...state, checked: true };
}

export function verdict(state) {
  if (!allShared(state)) return 'missing';
  return state.g === 1 ? 'coprime' : 'notCoprime';
}

export function isCoprime(state) {
  return state.g === 1;
}
