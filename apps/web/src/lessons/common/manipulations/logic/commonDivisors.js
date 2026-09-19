import { divisibility } from '@smarter-academy/core';

const { divmod, divisors, commonDivisors, gcdByDefinition } = divisibility;

/**
 * common-divisors — deux temps, deux états.
 *
 * BOUQUETS (activité 4) : l'élève choisit un nombre de bouquets `k` ; les
 * `a` fleurs rouges et les `b` blanches se répartissent ; les restes se
 * voient. Le rail garde la marque de chaque essai :
 *   'common' — tombe juste des deux côtés (k divise a ET b)
 *   'single' — un seul côté
 *   'no'     — aucun
 * La régularité apparaît d'elle-même : les k qui marchent sont exactement
 * les diviseurs communs.
 *
 * LISTES (activité 5, معارف 3–4) : les diviseurs de a et de b comme jetons ;
 * l'élève porte les COMMUNS dans la zone du milieu, puis le plus grand dans
 * la case PGCD — le 6 de « PGCD(42 ; 60) = 6 » vient de son geste.
 */
export function initBouquets({ a, b }) {
  return { a, b, k: null, tried: {} };
}

export function canChoose(state, k) {
  if (!Number.isInteger(k) || k < 1) return 'notNatural';
  if (k > Math.min(state.a, state.b)) return 'tooMany';
  return true;
}

export function choose(state, k) {
  if (canChoose(state, k) !== true) return state;
  const A = divmod(state.a, k); const B = divmod(state.b, k);
  const mark = A.r === 0 && B.r === 0 ? 'common' : A.r === 0 || B.r === 0 ? 'single' : 'no';
  return { ...state, k, qa: A.q, ra: A.r, qb: B.q, rb: B.r, works: mark === 'common', tried: { ...state.tried, [k]: mark } };
}

/** Prête quand l'élève a trouvé au moins deux répartitions qui marchent (k > 1) et une qui échoue. */
export function bouquetsDiscoveryReady(state) {
  const marks = Object.entries(state.tried);
  const ok = marks.filter(([k, m]) => m === 'common' && Number(k) > 1).length;
  const ko = marks.filter(([, m]) => m !== 'common').length;
  return ok >= 2 && ko >= 1;
}

export function initLists({ a, b }) {
  return { a, b, da: divisors(a), db: divisors(b), common: commonDivisors(a, b), g: gcdByDefinition(a, b), placed: [], pgcd: null, attempts: 0 };
}

/** Un jeton `d` peut-il aller dans la zone des communs ? */
export function canPlaceCommon(state, d) {
  if (state.placed.includes(d)) return 'alreadyPlaced';
  const inA = state.a % d === 0; const inB = state.b % d === 0;
  if (inA && inB) return true;
  return inA ? 'dividesOnlyA' : inB ? 'dividesOnlyB' : 'dividesNeither';
}

export function placeCommon(state, d) {
  const verdict = canPlaceCommon(state, d);
  if (verdict !== true) return { ...state, attempts: state.attempts + 1 };
  return { ...state, placed: [...state.placed, d].sort((x, y) => x - y) };
}

export function allCommonPlaced(state) {
  return state.common.every((d) => state.placed.includes(d));
}

/** La case PGCD n'accepte que le plus grand des communs, une fois tous posés. */
export function canPlacePgcd(state, d) {
  if (!allCommonPlaced(state)) return 'notAllCommon';
  if (!state.placed.includes(d)) return 'notCommon';
  if (d !== state.g) return 'notGreatest';
  return true;
}

export function placePgcd(state, d) {
  if (canPlacePgcd(state, d) !== true) return { ...state, attempts: state.attempts + 1 };
  return { ...state, pgcd: d };
}

export function listsDiscoveryReady(state) {
  return state.pgcd !== null;
}
