/**
 * Le GÉNÉRATEUR d'équations du مختبر الجبر — logique pure, sans React.
 *
 * « معادلة جديدة » doit rendre un exercice de manuel, pas une équation
 * tirée au hasard : une équation pédagogique se reconnaît à ce qu'elle
 * ÉVITE.
 *
 *   niveau 1   x + a = b        l'inconnue seule, une opération
 *   niveau 2   a·x = b          le coefficient, une division
 *   niveau 3   a·x + b = c      les deux — le cœur du chapitre
 *   niveau 4   a·x + b = c·x + d   l'inconnue des deux côtés
 *
 * Les garde-fous, tous délibérés :
 *   — la solution est un ENTIER de [−10, 10] : l'élève doit pouvoir
 *     vérifier de tête, pas découvrir 47/13 à la fin ;
 *   — aucun coefficient nul (`0x + 3 = 5` n'est pas une équation) ;
 *   — aucun coefficient 1 pour les niveaux 2 et 3 (sinon il n'y a rien à
 *     diviser, et le niveau s'effondre sur le précédent) ;
 *   — au niveau 4, a ≠ c, sinon l'inconnue disparaît et l'exercice devient
 *     « aucune solution » — un cas à RENCONTRER, pas à tirer au sort ;
 *   — une solution nulle reste possible mais rare : `x = 0` surprend, et
 *     c'est bien, mais un exercice sur deux serait décourageant.
 *
 * Le tirage est injectable (`random`) pour que les tests soient
 * déterministes — même discipline que simulationEngine.js du laboratoire de
 * probabilités.
 */

import * as R from './rational.js';
import { makeLinear } from './linearForm.js';
import { equationToText } from './equation.js';

export const LEVELS = Object.freeze([1, 2, 3, 4]);
export const DEFAULT_LEVEL = 3;

const SOLUTION_MIN = -10;
const SOLUTION_MAX = 10;
const COEFFICIENT_MAX = 9;

function pickInt(random, min, max) {
  return min + Math.floor(random() * (max - min + 1));
}

/** Un coefficient non nul, et ≠ 1 quand le niveau a besoin d'une vraie division. */
function pickCoefficient(random, { allowOne }) {
  for (;;) {
    const value = pickInt(random, -COEFFICIENT_MAX, COEFFICIENT_MAX);
    if (value === 0) continue;
    if (!allowOne && Math.abs(value) === 1) continue;

    return value;
  }
}

/** Une solution entière lisible ; zéro seulement une fois sur dix. */
function pickSolution(random) {
  const value = pickInt(random, SOLUTION_MIN, SOLUTION_MAX);
  if (value !== 0) return value;

  return random() < 0.1 ? 0 : pickInt(random, 1, SOLUTION_MAX);
}

/**
 * Une équation du niveau demandé, construite À PARTIR de sa solution : on
 * choisit x, puis des coefficients, et on calcule le membre qui fait
 * l'égalité. L'équation tombe donc toujours juste par construction — jamais
 * de tirage-rejet, jamais de fraction surprise.
 *
 * @param {{level?: number, relation?: string, random?: () => number}} [options]
 * @returns {{equation: object, source: string, level: number, solution: number}}
 */
export function generateEquation(options = {}) {
  const level = LEVELS.includes(options.level) ? options.level : DEFAULT_LEVEL;
  const random = typeof options.random === 'function' ? options.random : Math.random;
  const relation = options.relation ?? '=';
  const x = pickSolution(random);

  let left;
  let right;

  if (level === 1) {
    // x + b = c
    const b = pickCoefficient(random, { allowOne: true });
    left = makeLinear(R.ONE, R.makeRational(b));
    right = makeLinear(R.ZERO, R.makeRational(x + b));
  } else if (level === 2) {
    // a·x = c
    const a = pickCoefficient(random, { allowOne: false });
    left = makeLinear(R.makeRational(a), R.ZERO);
    right = makeLinear(R.ZERO, R.makeRational(a * x));
  } else if (level === 3) {
    // a·x + b = c
    const a = pickCoefficient(random, { allowOne: false });
    const b = pickCoefficient(random, { allowOne: true });
    left = makeLinear(R.makeRational(a), R.makeRational(b));
    right = makeLinear(R.ZERO, R.makeRational(a * x + b));
  } else {
    // a·x + b = c·x + d, avec a ≠ c pour que l'inconnue survive.
    const a = pickCoefficient(random, { allowOne: true });
    let c = pickCoefficient(random, { allowOne: true });
    let guard = 0;
    while (c === a && guard < 32) { c = pickCoefficient(random, { allowOne: true }); guard += 1; }
    if (c === a) c = a === COEFFICIENT_MAX ? a - 1 : a + 1;
    const b = pickCoefficient(random, { allowOne: true });
    const d = (a - c) * x + b;
    left = makeLinear(R.makeRational(a), R.makeRational(b));
    right = makeLinear(R.makeRational(c), R.makeRational(d));
  }

  const equation = { left, right, relation };

  return { equation, source: equationToText(equation), level, solution: x };
}
