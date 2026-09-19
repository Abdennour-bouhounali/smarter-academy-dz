import { divisibility } from '@smarter-academy/core';

const { commonDivisors, reduceByCommonDivisor, isIrreducible, reduceFraction } = divisibility;

/**
 * fraction-reduction — deux chemins pour le même kasr.
 *
 * CHEMIN أ (pas à pas) : l'élève porte un diviseur commun sur la fraction ;
 * numérateur et dénominateur rétrécissent ensemble ; il recommence jusqu'à
 * ce qu'aucun jeton > 1 ne reste : le kasr est irréductible.
 * CHEMIN ب (en une fois) : il porte le PGCD ; une seule division.
 * Puis la question : « أي الطريقين أوفر؟ » — l'utilité du PGCD, découverte.
 */
export function init({ n, d }) {
  const red = reduceFraction(n, d);
  return { n, d, pathA: [], pathB: null, gcd: red.gcd, final: { n: red.n, d: red.d }, euclid: red.euclid };
}

/** La fraction courante du chemin أ. */
export function currentA(state) {
  let cur = { n: state.n, d: state.d };
  for (const k of state.pathA) { const next = reduceByCommonDivisor(cur.n, cur.d, k); if (!next) break; cur = { n: next.n, d: next.d }; }
  return cur;
}

/** Les jetons proposés : les diviseurs communs > 1 de la fraction courante. */
export function candidatesA(state) {
  const { n, d } = currentA(state);
  return commonDivisors(n, d).filter((k) => k > 1);
}

export function canReduceA(state, k) {
  const { n, d } = currentA(state);
  if (isIrreducible(n, d)) return 'irreducible';
  if (!Number.isInteger(k) || k <= 1) return 'notGreaterThanOne';
  if (n % k !== 0 && d % k !== 0) return 'dividesNeither';
  if (n % k !== 0) return 'dividesOnlyDenominator';
  if (d % k !== 0) return 'dividesOnlyNumerator';
  return true;
}

export function reduceA(state, k) {
  if (canReduceA(state, k) !== true) return state;
  return { ...state, pathA: [...state.pathA, k] };
}

export function pathAFinished(state) {
  const { n, d } = currentA(state);
  return isIrreducible(n, d);
}

/** Le chemin ب n'accepte que le PGCD, et seulement après le chemin أ. */
export function canReduceB(state, k) {
  if (!pathAFinished(state)) return 'pathANotFinished';
  if (state.pathB !== null) return 'alreadyDone';
  if (k !== state.gcd) return 'notPgcd';
  return true;
}

export function reduceB(state, k) {
  if (canReduceB(state, k) !== true) return state;
  return { ...state, pathB: k };
}

export function discoveryReady(state) {
  return state.pathB !== null;
}

/** Les états successifs du chemin أ (pour la trace). */
export function chainA(state) {
  const chain = [{ n: state.n, d: state.d, k: null }];
  let cur = { n: state.n, d: state.d };
  for (const k of state.pathA) { const next = reduceByCommonDivisor(cur.n, cur.d, k); if (!next) break; chain.push(next); cur = next; }
  return chain;
}
