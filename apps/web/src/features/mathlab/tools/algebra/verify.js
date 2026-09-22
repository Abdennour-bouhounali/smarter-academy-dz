/**
 * La VÉRIFICATION du مختبر الجبر — logique pure, sans React.
 *
 * « التحقق » substitue la valeur trouvée dans l'équation de DÉPART et montre
 * le calcul des deux membres :
 *
 *     2x + 3 = 11   avec x = 4
 *     2 × 4 + 3 = 11
 *     11 = 11        ✓
 *
 * C'est l'idée que la V1 doit faire passer : une solution n'est pas le
 * résultat d'une recette, c'est la valeur qui rend la relation VRAIE. Le
 * calcul reste rationnel exact — vérifier 1/3 ne doit pas buter sur
 * 0,33333 × 3 ≠ 1.
 */

import * as R from './rational.js';
import { RELATION_LATEX } from './equation.js';
import { formToLatex } from './linearForm.js';

/** La valeur d'une forme `a·x + b` en un point. */
export function evaluateForm(form, value) {
  return R.add(R.multiply(form.a, value), form.b);
}

/** La relation est-elle vraie pour ces deux nombres ? */
export function relationHolds(left, right, relation) {
  const diff = R.sign(R.subtract(left, right));
  switch (relation) {
    case '=': return diff === 0;
    case '<': return diff < 0;
    case '>': return diff > 0;
    case '<=': return diff <= 0;
    case '>=': return diff >= 0;
    default: return false;
  }
}

/**
 * Le membre avec la valeur SUBSTITUÉE, pas encore calculée : `2 × 4 + 3`.
 * C'est la ligne qui fait comprendre la vérification ; l'écrire à partir de
 * la forme (et non de la saisie) garantit qu'elle correspond à ce que
 * l'équation dit vraiment.
 */
export function substitutedLatex(form, value, variable = 'x') {
  if (R.isZero(form.a)) return R.toLatex(form.b);
  const v = R.isNegative(value) || !R.isInteger(value) ? `\\left(${R.toLatex(value)}\\right)` : R.toLatex(value);

  let head;
  if (R.equals(form.a, R.ONE)) head = v;
  else if (R.equals(form.a, { n: -1, d: 1 })) head = `-${v}`;
  else head = `${R.toLatex(form.a)} \\times ${v}`;

  if (R.isZero(form.b)) return head;
  const sign = R.isNegative(form.b) ? '-' : '+';

  return `${head} ${sign} ${R.toLatex(R.isNegative(form.b) ? R.negate(form.b) : form.b)}`;
}

/**
 * Vérifie une valeur dans une équation.
 *
 * @returns {{holds: boolean, left: object, right: object, lines: {original: string, substituted: string, evaluated: string}}}
 */
export function verifySolution(equation, value, variable = 'x') {
  const left = evaluateForm(equation.left, value);
  const right = evaluateForm(equation.right, value);
  const symbol = RELATION_LATEX[equation.relation];

  return {
    holds: relationHolds(left, right, equation.relation),
    left,
    right,
    lines: {
      original: `${formToLatex(equation.left, variable)} ${symbol} ${formToLatex(equation.right, variable)}`,
      substituted: `${substitutedLatex(equation.left, value, variable)} ${symbol} ${substitutedLatex(equation.right, value, variable)}`,
      evaluated: `${R.toLatex(left)} ${symbol} ${R.toLatex(right)}`,
    },
  };
}
