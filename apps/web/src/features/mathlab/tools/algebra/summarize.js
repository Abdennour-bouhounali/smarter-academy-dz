import { equationToText } from './equation.js';

/**
 * Le RÉSUMÉ d'un document du مختبر الجبر : l'équation de DÉPART et celle où
 * l'élève en est. La carte affiche les deux — « 2x + 3 = 11 → x = 4 » dit
 * d'un coup d'œil où en est le travail — et la recherche mord sur les deux.
 *
 * @param {object} data
 * @returns {import('../../toolContract.js').MathLabSummary | null}
 */
export function summarizeAlgebra(data) {
  const steps = Array.isArray(data?.steps) ? data.steps : [];
  if (steps.length === 0) return null;

  const first = safeText(steps[0]?.equation);
  const cursor = Number.isInteger(data?.cursor) ? Math.max(0, Math.min(steps.length - 1, data.cursor)) : steps.length - 1;
  const current = safeText(steps[cursor]?.equation);
  if (!first && !current) return null;

  return {
    kind: 'equation',
    // `source` est ce que l'élève a TAPÉ : on le cherche tel quel.
    text: [typeof data?.source === 'string' ? data.source.slice(0, 60) : null, first, current].filter(Boolean),
    detail: { first, current, steps: steps.length, solved: cursor === steps.length - 1 && steps.length > 1 },
  };
}

/** Une équation illisible ne casse pas la carte : elle n'a simplement pas de texte. */
function safeText(equation) {
  if (!equation) return null;
  try {
    return equationToText(equation).slice(0, 60);
  } catch {
    return null;
  }
}
