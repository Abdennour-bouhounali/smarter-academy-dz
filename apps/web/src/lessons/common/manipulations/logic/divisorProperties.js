import { divisibility } from '@smarter-academy/core';

const { divmod } = divisibility;

export const TARGETS = Object.freeze(['sum', 'diff', 'rem']);

/**
 * divisor-properties — n divise a et b ; l'élève CONSTRUIT a + b, a − b et le
 * reste de a par b avec des blocs de taille n, et voit que chacun est un
 * nombre entier de blocs.
 *
 *   a = n × q  (q blocs)      b = n × q'  (q' blocs)
 *   a + b → q + q' blocs      a − b → q − q' blocs
 *   a = b × k + r → r = n × (q − k q') blocs
 */
export function init({ n, a, b }) {
  const { q: k, r } = divmod(a, b);
  return { n, a, b, q: a / n, qp: b / n, k, r, built: [], predictions: {}, valid: a % n === 0 && b % n === 0 && a >= b };
}

/**
 * LA PRÉDICTION (niveau متقدم, 2026-09-30). Avec 900 et 90 en briques de 9,
 * les briques ne se comptent plus : l'élève doit PRÉDIRE avec la propriété —
 * « طوب كامل » (whole) ou « يبقى جزء من طوبة » (partial) — avant de bâtir.
 * Le mur bâti confirme ou réfute. Jusque-là le niveau promettait cette
 * prédiction (en-tête, `autonomy`, lead) sans l'implémenter.
 */
export const PREDICTIONS = Object.freeze(['whole', 'partial']);
export function predict(state, target, guess) {
  if (!TARGETS.includes(target) || !PREDICTIONS.includes(guess) || state.built.includes(target)) return state;
  return { ...state, predictions: { ...state.predictions, [target]: guess } };
}

/** Ce que le mur MONTRE : toujours des briques entières quand n | a et n | b. */
export function outcome(state, target) {
  return blocks(state, target).value % state.n === 0 ? 'whole' : 'partial';
}

export function canBuild(state, target, { requirePrediction = false } = {}) {
  if (!TARGETS.includes(target)) return 'unknownTarget';
  if (state.built.includes(target)) return 'alreadyBuilt';
  if (requirePrediction && !state.predictions[target]) return 'predictFirst';
  return true;
}

export function build(state, target) {
  if (canBuild(state, target) !== true) return state;
  return { ...state, built: [...state.built, target] };
}

/** Le résultat d'une construction, en blocs de n. */
export function blocks(state, target) {
  const { n, a, b, q, qp, k, r } = state;
  if (target === 'sum') return { value: a + b, count: q + qp, tex: `${a} + ${b} = ${n} \\times ${q} + ${n} \\times ${qp} = ${n} \\times (${q} + ${qp}) = ${n} \\times ${q + qp}` };
  if (target === 'diff') return { value: a - b, count: q - qp, tex: `${a} - ${b} = ${n} \\times ${q} - ${n} \\times ${qp} = ${n} \\times (${q} - ${qp}) = ${n} \\times ${q - qp}` };
  return { value: r, count: r / n, tex: `${a} = ${b} \\times ${k} + ${r} \\quad\\Rightarrow\\quad ${r} = ${n} \\times ${q} - ${n} \\times ${qp * k} = ${n} \\times ${q - qp * k}` };
}

export function discoveryReady(state) {
  return TARGETS.every((t) => state.built.includes(t));
}

