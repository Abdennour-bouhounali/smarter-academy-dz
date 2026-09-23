/**
 * L'ENTRAÎNEMENT « prédire → révéler → vérifier » (§25) — pur, testable.
 *
 * §25 fixe ce que ce module doit être ET ce qu'il ne doit pas devenir :
 *   « generate multiple variations · provide hints · provide explanations ·
 *     allow retry · **never permanently block the student** ·
 *     avoid excessive gamification »
 *
 * D'où trois décisions qui traversent tout le fichier :
 *
 * 1. **Une réponse fausse ne ferme rien.** `check()` rend un verdict, jamais
 *    un verrou. L'élève peut révéler, réessayer, ou partir explorer : le
 *    cercle reste manipulable derrière la question (§48). Il n'y a pas
 *    d'état « bloqué » dans ce module, donc il ne peut pas en arriver un.
 * 2. **La prédiction vaut par elle-même.** La question demande d'abord ce
 *    que l'élève PENSE, et la révélation montre le POURQUOI géométrique sur
 *    le cercle — `angle` dit toujours où amener le point. C'est la
 *    différence entre « observe → manipule → prédit » (§48) et un QCM.
 * 3. **Pas de score au-delà du nécessaire.** On compte les résolues et les
 *    vues, rien d'autre : ni série, ni médaille, ni son (§45).
 *
 * ── La lecture d'une réponse ─────────────────────────────────────────────
 * Un élève écrit `1/2`, `0,5`, `0.5`, `√3/2`, `racine(3)/2`… `parseAnswer`
 * accepte ces écritures parce qu'elles disent toutes la même chose, et
 * compare NUMÉRIQUEMENT à 1e−3 près. Refuser `0,5` quand on attend `1/2`
 * n'enseignerait rien sur la trigonométrie — seulement sur le parseur.
 */

import { sinOf, cosOf, tanOf, normalizeDegrees, quadrantOf, degToRad } from './trigMath.js';
import { SPECIAL_ANGLES, CURRICULUM_ANGLES, exactValue } from './exactValues.js';
import { exactToText } from './trigFormat.js';

/**
 * Un tirage reproductible : la même graine rend la même suite (comme le
 * labo de probabilités).
 *
 * ── Pourquoi la graine est BROUILLÉE d'abord ─────────────────────────────
 * Le générateur de Lehmer (`state × 16807 mod 2³¹−1`) a un défaut connu sur
 * les PETITES graines : avec `state = n`, le premier tirage vaut
 * `n × 16807 / 2³¹ ≈ n × 7,8e−6` — soit 0,000008 pour la graine 1, 0,000016
 * pour la 2… Les cent premières graines rendent donc toutes un premier
 * tirage quasi nul, et un `pick()` sur cette valeur choisit invariablement
 * le PREMIER élément de la liste. L'entraînement n'aurait posé qu'une seule
 * famille de questions — ce que `practice.test.js` a attrapé.
 *
 * Le mélange en trois temps (xorshift façon `splitmix`) disperse la graine
 * sur tout l'intervalle avant le premier appel, et les graines consécutives
 * — celles que l'interface produit, une par question — donnent alors des
 * suites franchement différentes.
 */
export function makeRandom(seed) {
  let state = Number.isFinite(seed) ? Math.floor(seed) : Date.now();
  state ^= 0x9e3779b9;
  state = Math.imul(state ^ (state >>> 16), 0x85ebca6b);
  state = Math.imul(state ^ (state >>> 13), 0xc2b2ae35);
  state = (state ^ (state >>> 16)) % 2147483647;
  if (state <= 0) state += 2147483646;

  return () => {
    state = (state * 16807) % 2147483647;

    return (state - 1) / 2147483646;
  };
}

const pick = (random, list) => list[Math.floor(random() * list.length) % list.length];

/**
 * Les six familles de questions de §25, dans son ordre.
 *
 * Chacune rend un « défi » de forme unique — `{kind, prompt, expected, angle,
 * hintKeys, explainKey, …}` — ce qui permet à l'interface de n'avoir qu'UN
 * rendu et qu'UNE vérification, quelle que soit la famille.
 */
export const CHALLENGE_KINDS = Object.freeze([
  'ratioValue',    // Challenge 1 : sin(30°) = ?
  'quadrantOf',    // Challenge 2 : cos θ = −1/2, quel quadrant ?
  'signs',         // Challenge 3 : θ = 135°, les signes
  'triangleRatio', // Challenge 4 : opp = 3, hyp = 5 → sin θ
  'degToRad',      // Challenge 5 : θ = π/3 en degrés
  'coordinates',   // le point du cercle
]);

/**
 * Fabrique un défi. `kinds` restreint les familles — le mode triangle ne
 * pose pas de question sur les quadrants, qui n'y ont pas de sens.
 */
export function generateChallenge(seed, kinds = CHALLENGE_KINDS) {
  const random = makeRandom(seed);
  const available = kinds.filter((kind) => CHALLENGE_KINDS.includes(kind));
  const kind = pick(random, available.length ? available : CHALLENGE_KINDS);

  switch (kind) {
    case 'ratioValue': return ratioValueChallenge(random);
    case 'quadrantOf': return quadrantChallenge(random);
    case 'signs': return signsChallenge(random);
    case 'triangleRatio': return triangleRatioChallenge(random);
    case 'degToRad': return degToRadChallenge(random);
    default: return coordinatesChallenge(random);
  }
}

/** Challenge 1 — `sin(30°) = ?` La réponse est un NOMBRE, exact ou décimal. */
function ratioValueChallenge(random) {
  const entry = pick(random, SPECIAL_ANGLES.filter((a) => !a.tan?.undefined || random() > 0.8));
  const ratio = pick(random, ['sin', 'cos', 'tan']);
  const exact = exactValue(entry.degrees, ratio);

  // tan(90°) n'a pas de valeur : la question devient « existe-t-elle ? ».
  if (exact?.undefined) {
    return {
      kind: 'undefinedRatio',
      answerType: 'choice',
      promptKey: 'tools.trigonometry.practice.q.undefinedRatio',
      promptParams: { ratio, angle: entry.degrees },
      choices: ['defined', 'undefined'],
      expected: 'undefined',
      angle: entry.degrees,
      hintKeys: ['tools.trigonometry.practice.h.tanQuotient', 'tools.trigonometry.practice.h.cosZero'],
      explainKey: 'tools.trigonometry.practice.e.undefinedRatio',
      explainParams: { angle: entry.degrees },
    };
  }

  const value = ratio === 'sin' ? sinOf(entry.degrees) : ratio === 'cos' ? cosOf(entry.degrees) : tanOf(entry.degrees);

  return {
    kind: 'ratioValue',
    answerType: 'number',
    promptKey: 'tools.trigonometry.practice.q.ratioValue',
    promptParams: { ratio, angle: entry.degrees },
    expected: value,
    expectedText: exactToText(exact),
    angle: entry.degrees,
    hintKeys: ['tools.trigonometry.practice.h.moveToAngle', 'tools.trigonometry.practice.h.readProjection'],
    explainKey: `tools.trigonometry.practice.e.${ratio}`,
    explainParams: { angle: entry.degrees, value: exactToText(exact) },
  };
}

/** Challenge 2 — `cos θ = −1/2` : quels quadrants ? Il y en a DEUX, et c'est le sujet. */
function quadrantChallenge(random) {
  const ratio = pick(random, ['sin', 'cos']);
  const entry = pick(random, SPECIAL_ANGLES.filter((a) => {
    const v = ratio === 'sin' ? sinOf(a.degrees) : cosOf(a.degrees);

    return v !== 0 && Math.abs(v) !== 1;
  }));
  const value = ratio === 'sin' ? sinOf(entry.degrees) : cosOf(entry.degrees);

  // Les quadrants où ce rapport a CE signe : la réponse est un ensemble.
  const expected = [1, 2, 3, 4].filter((q) => {
    const signs = { 1: { sin: 1, cos: 1 }, 2: { sin: 1, cos: -1 }, 3: { sin: -1, cos: -1 }, 4: { sin: -1, cos: 1 } };

    return signs[q][ratio] === (value > 0 ? 1 : -1);
  });

  return {
    kind: 'quadrantOf',
    answerType: 'multi',
    promptKey: 'tools.trigonometry.practice.q.quadrantOf',
    promptParams: { ratio, value: exactToText(exactValue(entry.degrees, ratio)) },
    choices: [1, 2, 3, 4],
    expected,
    angle: entry.degrees,
    hintKeys: ['tools.trigonometry.practice.h.signTable', 'tools.trigonometry.practice.h.twoSolutions'],
    explainKey: 'tools.trigonometry.practice.e.quadrantOf',
    explainParams: { ratio, quadrants: expected.join('، ') },
  };
}

/** Challenge 3 — `θ = 135°` : les trois signes, avant de voir les valeurs. */
function signsChallenge(random) {
  const entry = pick(random, SPECIAL_ANGLES.filter((a) => quadrantOf(a.degrees).quadrant >= 1));
  const tan = tanOf(entry.degrees);

  return {
    kind: 'signs',
    answerType: 'signs',
    promptKey: 'tools.trigonometry.practice.q.signs',
    promptParams: { angle: entry.degrees },
    expected: {
      sin: sinOf(entry.degrees) > 0 ? 1 : -1,
      cos: cosOf(entry.degrees) > 0 ? 1 : -1,
      tan: tan > 0 ? 1 : -1,
    },
    angle: entry.degrees,
    hintKeys: ['tools.trigonometry.practice.h.whichQuadrant', 'tools.trigonometry.practice.h.tanQuotient'],
    explainKey: 'tools.trigonometry.practice.e.signs',
    explainParams: { angle: entry.degrees, quadrant: quadrantOf(entry.degrees).quadrant },
  };
}

/**
 * Challenge 4 — le triangle : `opp = 3`, `hyp = 5` → `sin θ`.
 *
 * Les triplets sont PYTHAGORICIENS : (3,4,5) et ses cousins. Le troisième
 * côté est alors entier, le rapport est une fraction simple, et l'élève
 * peut vérifier de tête — c'est le triangle du manuel de 4AM, pas un
 * exercice de calculatrice.
 */
const TRIPLES = Object.freeze([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]]);

function triangleRatioChallenge(random) {
  const [opposite, adjacent, hypotenuse] = pick(random, TRIPLES);
  const ratio = pick(random, ['sin', 'cos', 'tan']);
  const expected = ratio === 'sin' ? opposite / hypotenuse
    : ratio === 'cos' ? adjacent / hypotenuse
      : opposite / adjacent;
  const pair = ratio === 'sin' ? { a: opposite, b: hypotenuse, aKey: 'opposite', bKey: 'hypotenuse' }
    : ratio === 'cos' ? { a: adjacent, b: hypotenuse, aKey: 'adjacent', bKey: 'hypotenuse' }
      : { a: opposite, b: adjacent, aKey: 'opposite', bKey: 'adjacent' };

  return {
    kind: 'triangleRatio',
    answerType: 'number',
    promptKey: 'tools.trigonometry.practice.q.triangleRatio',
    promptParams: { ratio, opposite, adjacent, hypotenuse },
    expected,
    expectedText: `${pair.a}/${pair.b}`,
    // Le triangle qu'il faut poser pour VOIR la question (§25 : « Then visualize the ratio »).
    triangle: { given: 'opp-adj', opposite, adjacent, hypotenuse },
    hintKeys: [`tools.trigonometry.practice.h.${ratio}Formula`, 'tools.trigonometry.practice.h.readSides'],
    explainKey: 'tools.trigonometry.practice.e.triangleRatio',
    explainParams: { ratio, a: pair.a, b: pair.b, value: `${pair.a}/${pair.b}` },
  };
}

/** Challenge 5 — `θ = π/3` : combien de degrés ? La conversion, dans les deux sens. */
function degToRadChallenge(random) {
  const entry = pick(random, SPECIAL_ANGLES.filter((a) => a.degrees !== 0));
  const toDegrees = random() > 0.5;

  return {
    kind: 'degToRad',
    answerType: 'number',
    promptKey: toDegrees ? 'tools.trigonometry.practice.q.toDegrees' : 'tools.trigonometry.practice.q.toRadians',
    promptParams: {
      radians: radianText(entry.radians),
      degrees: entry.degrees,
    },
    expected: toDegrees ? entry.degrees : degToRad(entry.degrees),
    expectedText: toDegrees ? `${entry.degrees}°` : radianText(entry.radians),
    // En radians on tolère plus large : π/3 ≈ 1,047 et l'élève écrira 1,05.
    tolerance: toDegrees ? 0.5 : 0.02,
    angle: entry.degrees,
    hintKeys: ['tools.trigonometry.practice.h.piIs180', 'tools.trigonometry.practice.h.proportion'],
    explainKey: toDegrees ? 'tools.trigonometry.practice.e.toDegrees' : 'tools.trigonometry.practice.e.toRadians',
    explainParams: { degrees: entry.degrees, radians: radianText(entry.radians) },
  };
}

/** Le point du cercle — la question qui relie l'angle aux deux coordonnées. */
function coordinatesChallenge(random) {
  const entry = pick(random, SPECIAL_ANGLES);
  const axis = pick(random, ['x', 'y']);
  const ratio = axis === 'x' ? 'cos' : 'sin';

  return {
    kind: 'coordinates',
    answerType: 'number',
    promptKey: 'tools.trigonometry.practice.q.coordinates',
    promptParams: { angle: entry.degrees, axis },
    expected: axis === 'x' ? cosOf(entry.degrees) : sinOf(entry.degrees),
    expectedText: exactToText(exactValue(entry.degrees, ratio)),
    angle: entry.degrees,
    hintKeys: ['tools.trigonometry.practice.h.pointIsCosSin', 'tools.trigonometry.practice.h.readProjection'],
    explainKey: 'tools.trigonometry.practice.e.coordinates',
    explainParams: { angle: entry.degrees, axis, ratio },
  };
}

function radianText({ numerator, denominator }) {
  if (numerator === 0) return '0';
  const head = numerator === 1 ? 'π' : `${numerator}π`;

  return denominator === 1 ? head : `${head}/${denominator}`;
}

// ── La lecture et la vérification d'une réponse ───────────────────────────

/**
 * Lit ce que l'élève a écrit : `1/2`, `0,5`, `√3/2`, `-1`, `sqrt(3)/2`,
 * `racine(2)/2`. Rend un nombre, ou `NaN` si la saisie n'est pas lisible.
 *
 * On accepte large À DESSEIN : la question porte sur la trigonométrie, pas
 * sur la syntaxe. Un élève qui écrit la bonne valeur d'une autre manière a
 * raison, et un instrument qui lui dit le contraire lui apprend une fausseté.
 */
export function parseAnswer(text) {
  if (typeof text !== 'string') return NaN;
  let source = text.trim().toLowerCase();
  if (!source) return NaN;

  source = source
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))  // chiffres arabes-indiens
    .replace(/−/g, '-')                                         // vrai signe moins
    .replace(/،/g, ',')
    .replace(/,/g, '.')
    .replace(/\s+/g, '')
    .replace(/racine|sqrt|rac/g, '√');

  // π porte un COEFFICIENT dès qu'on sort du premier tour : 315° s'écrit
  // `7π/4`, et un élève qui tape cela a raison. Remplacer π par sa valeur
  // sans rétablir la multiplication implicite donnerait `73.14159…/4` —
  // la concaténation de « 7 » et de « 3,14 », c'est-à-dire un refus de la
  // bonne réponse. Le `*` est donc rétabli des deux côtés avant la
  // substitution.
  source = source
    .replace(/(\d)(π|pi)/g, '$1*$2')
    .replace(/(π|pi)(\d|√)/g, '$1*$2')
    .replace(/π|pi/g, String(Math.PI));

  // `7*3.14159…/4` : un petit produit/quotient, évalué à la main plutôt que
  // par `eval` — on n'exécute jamais la saisie d'un élève.
  const chain = source.match(/^(-?\d+(?:\.\d+)?)\*(\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/);
  if (chain) {
    const denominator = chain[3] === undefined ? 1 : Number(chain[3]);

    return denominator === 0 ? NaN : (Number(chain[1]) * Number(chain[2])) / denominator;
  }

  // √3/2, -√2/2, 2√3, √3
  const root = source.match(/^(-?)(\d*(?:\.\d+)?)?√(\d+(?:\.\d+)?)(?:\/(\d+(?:\.\d+)?))?$/);
  if (root) {
    const [, sign, coefficient, radicand, denominator] = root;
    const value = (Number(coefficient || 1) * Math.sqrt(Number(radicand))) / Number(denominator || 1);

    return sign === '-' ? -value : value;
  }

  // 1/2, -3/4
  const fraction = source.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (fraction) {
    const denominator = Number(fraction[2]);

    return denominator === 0 ? NaN : Number(fraction[1]) / denominator;
  }

  // 0.5, -1, 45
  if (/^-?\d+(?:\.\d+)?$/.test(source)) return Number(source);

  return NaN;
}

/**
 * Le verdict. `correct: false` n'est PAS un échec fermé : l'appelant
 * réaffiche la question, l'indice suivant, ou la révélation — au choix de
 * l'élève (§25 : « allow retry · never permanently block »).
 *
 * @returns {{correct: boolean, readable: boolean}}
 */
export function checkAnswer(challenge, answer) {
  if (!challenge) return { correct: false, readable: false };

  switch (challenge.answerType) {
    case 'number': {
      const value = parseAnswer(answer);
      if (!Number.isFinite(value)) return { correct: false, readable: false };
      const tolerance = challenge.tolerance ?? 1e-3;

      return { correct: Math.abs(value - challenge.expected) <= tolerance, readable: true };
    }
    case 'choice':
      return { correct: answer === challenge.expected, readable: typeof answer === 'string' && answer.length > 0 };
    case 'multi': {
      const given = Array.isArray(answer) ? [...answer].sort() : [];
      const expected = [...challenge.expected].sort();

      return {
        correct: given.length === expected.length && given.every((v, i) => v === expected[i]),
        readable: given.length > 0,
      };
    }
    case 'signs': {
      if (!answer || typeof answer !== 'object') return { correct: false, readable: false };
      const keys = ['sin', 'cos', 'tan'];
      const readable = keys.every((k) => answer[k] === 1 || answer[k] === -1);

      return { correct: readable && keys.every((k) => answer[k] === challenge.expected[k]), readable };
    }
    default:
      return { correct: false, readable: false };
  }
}

/**
 * Où amener le cercle pour que la révélation MONTRE la réponse (§25 :
 * « The unit circle animates to 30°. Show the geometric explanation. »).
 * Une question de triangle rend le triangle à poser, pas un angle.
 */
export function revealTarget(challenge) {
  if (!challenge) return null;
  if (challenge.triangle) return { mode: 'triangle', triangle: challenge.triangle };
  if (Number.isFinite(challenge.angle)) return { mode: 'circle', angle: normalizeDegrees(challenge.angle) };

  return null;
}

/** Les familles de questions qui ont un sens dans le mode courant. */
export function kindsForMode(mode) {
  return mode === 'triangle'
    ? ['triangleRatio', 'ratioValue', 'degToRad']
    : CHALLENGE_KINDS;
}

/** Les angles du programme de 4AM — ce que le mode triangle tire en priorité. */
export { CURRICULUM_ANGLES };
