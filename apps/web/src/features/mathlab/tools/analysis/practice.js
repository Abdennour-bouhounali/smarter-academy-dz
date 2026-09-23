/**
 * L'ENTRAÎNEMENT « prédire → révéler → vérifier » du مختبر التحليل
 * (§28 – §31, §43).
 *
 * Le cahier des charges fixe ce que ce module doit être ET ce qu'il ne doit
 * jamais devenir :
 *   §28 « Do not punish wrong predictions »
 *   §31 « Never immediately reveal the answer » — trois indices, gradués
 *   §43 « Wrong answers should not block exploration »
 *
 * D'où quatre décisions qui traversent le fichier :
 *
 * 1. **Une réponse fausse ne ferme rien.** `checkAnswer` rend un verdict,
 *    jamais un verrou. Il n'existe aucun état « bloqué » dans ce module,
 *    donc il ne peut pas en arriver un. Le graphe reste manipulable derrière
 *    la question, et c'est souvent EN le manipulant qu'on trouve.
 * 2. **L'explication est CALCULÉE, pas rédigée.** On ne dit pas « faux » : on
 *    rend la valeur vraie et l'endroit du graphe où elle se lit, et
 *    l'interface l'y montre.
 * 3. **Les indices sont progressifs** (§31) : indice visuel, puis relation
 *    mathématique, puis guidage explicite — jamais la réponse.
 * 4. **Pas de score au-delà du nécessaire** : résolues et vues, rien d'autre.
 *
 * ── Le générateur ────────────────────────────────────────────────────────
 * On réutilise `makeRng` (mulberry32) de `lessons/common/stats/randomUtils.js`
 * comme les suites et les coniques, plutôt que d'écrire un générateur de plus.
 */

import { makeRng } from '../../../../lessons/common/stats/randomUtils.js';
import { compileSource } from '../functionGrapher/expressionEvaluator.js';
import { parseExpression } from '../functionGrapher/expressionParser.js';
import { compileExpression } from '../functionGrapher/expressionEvaluator.js';
import { differentiate } from './symbolicDerivative.js';
import { printExpression } from './expressionPrinter.js';
import {
  averageRate, findCriticalPoints, findRoots, definiteIntegral, riemannSum, twoSidedLimit,
} from './analysisMath.js';

const KEY = 'tools.analysis.practice';

/** Les familles de défis de §30, dans son ordre. */
export const CHALLENGE_KINDS = Object.freeze([
  'averageRate',       // (f(b) − f(a))/(b − a) = ?           — programme 4AM
  'horizontalTangent', // où la tangente est-elle horizontale ?
  'slopeSign',         // f′ > 0 ou f′ < 0 sur cet intervalle ?
  'readLimit',         // lim x→a f(x) ≈ ?
  'derivativeValue',   // f′(a) = ?
  'monotonic',         // sur quel intervalle f décroît-elle ?
  'riemannClose',      // quel n approche l'aire à 0,01 près ?
  'rootCount',         // combien de solutions à f(x) = 0 ?
]);

/**
 * Un trinôme (x − r₁)(x − r₂) développé et ÉCRIT proprement.
 *
 * Écrire « x^2-4x+0 » ou « x^2+-3x » est une faute de forme qui devient une
 * faute de fond quand l'élève recopie l'énoncé : un terme nul ne s'écrit pas,
 * un coefficient 1 ne s'écrit pas. La QA a vu « x^2-4x+0 » sortir du
 * générateur.
 */
function quadraticFromRoots(root1, root2) {
  const sum = root1 + root2;
  const product = root1 * root2;
  let source = 'x^2';
  if (sum !== 0) source += `${sum > 0 ? '-' : '+'}${Math.abs(sum) === 1 ? '' : Math.abs(sum)}x`;
  if (product !== 0) source += `${product > 0 ? '+' : '-'}${Math.abs(product)}`;

  return { source, sum, product, vertex: sum / 2 };
}

const pick = (rng, list) => list[Math.floor(rng() * list.length) % list.length];
const randomInt = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
const nonZero = (rng, max) => {
  const value = randomInt(rng, -max, max);

  return value === 0 ? max : value;
};

/** Une source → sa fonction et sa dérivée symbolique, ou null. */
function build(source) {
  const compiled = compileSource(source);
  if (!compiled.ok) return null;
  const parsed = parseExpression(source);
  const derivative = parsed.ok ? differentiate(parsed.ast) : null;

  return {
    source,
    fn: compiled.fn,
    derivative: derivative ? compileExpression(derivative) : null,
    derivativeSource: derivative ? printExpression(derivative) : null,
  };
}

/**
 * Fabrique un défi.
 *
 * Tous les défis ont la MÊME forme quelle que soit la famille : l'interface
 * n'a donc qu'un rendu et qu'une vérification à écrire.
 *
 * @param {number} seed
 * @param {{kinds?: string[], difficulty?: 'easy'|'normal'|'hard', level?: 'programme'|'all'}} [options]
 */
export function generateChallenge(seed, options = {}) {
  const rng = makeRng(Number.isFinite(seed) ? Math.floor(seed) : Date.now());
  // §37 : au niveau « programme », on ne pose que ce qui relève de 4AM —
  // le taux d'accroissement moyen sur une fonction affine.
  const pool = options.level === 'programme'
    ? ['averageRate']
    : (Array.isArray(options.kinds) && options.kinds.length
      ? options.kinds.filter((kind) => CHALLENGE_KINDS.includes(kind))
      : CHALLENGE_KINDS);
  const kind = pick(rng, pool.length ? pool : CHALLENGE_KINDS);
  const difficulty = ['easy', 'normal', 'hard'].includes(options.difficulty) ? options.difficulty : 'normal';

  switch (kind) {
    case 'averageRate': return averageRateChallenge(rng, difficulty);
    case 'horizontalTangent': return horizontalTangentChallenge(rng, difficulty);
    case 'slopeSign': return slopeSignChallenge(rng, difficulty);
    case 'readLimit': return readLimitChallenge(rng, difficulty);
    case 'derivativeValue': return derivativeValueChallenge(rng, difficulty);
    case 'monotonic': return monotonicChallenge(rng, difficulty);
    case 'riemannClose': return riemannChallenge(rng, difficulty);
    default: return rootCountChallenge(rng, difficulty);
  }
}

/**
 * §30 (programme 4AM) : le taux d'accroissement moyen entre deux points.
 * Sur une fonction AFFINE, c'est le coefficient directeur — et il ne dépend
 * pas des points choisis, ce que l'élève découvre en changeant a et b.
 */
function averageRateChallenge(rng, difficulty) {
  const slope = nonZero(rng, difficulty === 'easy' ? 5 : 9);
  const intercept = randomInt(rng, -6, 6);
  const a = randomInt(rng, -4, 1);
  const b = a + randomInt(rng, 1, 4);
  const source = `${slope === 1 ? '' : slope === -1 ? '-' : slope}x${intercept === 0 ? '' : `${intercept > 0 ? '+' : '-'}${Math.abs(intercept)}`}`;
  const model = build(source);
  const rate = averageRate(model.fn, a, b);

  return {
    kind: 'averageRate',
    source,
    answerType: 'number',
    promptKey: `${KEY}.q.averageRate`,
    promptParams: { a, b },
    expected: rate.slope,
    tolerance: 1e-6,
    focus: { lab: 'secant', point: a, secondPoint: b },
    hintKeys: [`${KEY}.h.rateIsSlope`, `${KEY}.h.rateFormula`, `${KEY}.h.rateAffine`],
    explainKey: `${KEY}.e.averageRate`,
    explainParams: {
      a, b,
      fa: formatNumberForPrompt(rate.fa),
      fb: formatNumberForPrompt(rate.fb),
      slope: formatNumberForPrompt(rate.slope),
    },
  };
}

/** §30 : « عند أي قيمة لـ x يكون المماس أفقيًا؟ » sur f(x) = x² − 4x + 3. */
function horizontalTangentChallenge(rng, difficulty) {
  const root1 = randomInt(rng, -4, 2);
  const root2 = root1 + randomInt(rng, 2, difficulty === 'hard' ? 6 : 4);
  // (x − r₁)(x − r₂) = x² − (r₁+r₂)x + r₁r₂ : le sommet est en (r₁+r₂)/2.
  const { source, sum } = quadraticFromRoots(root1, root2);
  const model = build(source);

  return {
    kind: 'horizontalTangent',
    source,
    answerType: 'number',
    promptKey: `${KEY}.q.horizontalTangent`,
    promptParams: {},
    expected: sum / 2,
    tolerance: 0.05,
    focus: { lab: 'tangent', point: sum / 2 },
    derivativeSource: model.derivativeSource,
    hintKeys: [`${KEY}.h.tangentFlat`, `${KEY}.h.derivativeZero`, `${KEY}.h.solveDerivative`],
    explainKey: `${KEY}.e.horizontalTangent`,
    explainParams: { x: formatNumberForPrompt(sum / 2), derivative: model.derivativeSource ?? '' },
  };
}

/** §30 : la fonction croît-elle ou décroît-elle ici ? (§17, sans confondre f et f′) */
function slopeSignChallenge(rng, difficulty) {
  const source = pick(rng, ['x^2-4x+3', 'x^3-3x', 'x^2', '4-x^2', 'x^3']);
  const model = build(source);
  const probe = Number((randomInt(rng, -20, 20) / 10).toFixed(1));
  const slope = model.derivative ? model.derivative(probe) : NaN;
  // Une pente trop proche de zéro rend la question ambiguë : on décale.
  const x = Math.abs(slope) < 0.3 ? probe + 0.9 : probe;
  const value = model.derivative ? model.derivative(x) : NaN;

  return {
    kind: 'slopeSign',
    source,
    answerType: 'choice',
    choices: ['increasing', 'decreasing'],
    promptKey: `${KEY}.q.slopeSign`,
    promptParams: { x: formatNumberForPrompt(x) },
    expected: value > 0 ? 'increasing' : 'decreasing',
    focus: { lab: 'derivative', point: x },
    hintKeys: [`${KEY}.h.lookAtCurve`, `${KEY}.h.signOfDerivative`, `${KEY}.h.tangentDirection`],
    explainKey: `${KEY}.e.slopeSign`,
    explainParams: { x: formatNumberForPrompt(x), value: formatNumberForPrompt(value) },
  };
}

/** §30 : « estimate lim x→2 f(x) using the graph ». */
function readLimitChallenge(rng, difficulty) {
  const a = randomInt(rng, 1, 3);
  // Une expression à TROU : (x² − a²)/(x − a) se simplifie en x + a.
  const source = `\\frac{x^2-${a * a}}{x-${a}}`;
  const model = build(source);
  const limit = twoSidedLimit(model.fn, a);

  return {
    kind: 'readLimit',
    source,
    answerType: 'number',
    promptKey: `${KEY}.q.readLimit`,
    promptParams: { a },
    expected: 2 * a,
    tolerance: 0.15,
    focus: { lab: 'limit', limitPoint: a },
    hintKeys: [`${KEY}.h.approachBothSides`, `${KEY}.h.factorNumerator`, `${KEY}.h.simplifyThenSubstitute`],
    explainKey: `${KEY}.e.readLimit`,
    explainParams: { a, value: formatNumberForPrompt(2 * a), agree: limit.agree },
  };
}

/** §30 : f′(a) = ? — sur une fonction dont la dérivée est simple. */
function derivativeValueChallenge(rng, difficulty) {
  const coefficient = randomInt(rng, 1, difficulty === 'easy' ? 3 : 5);
  const power = difficulty === 'easy' ? 2 : pick(rng, [2, 2, 3]);
  const source = `${coefficient === 1 ? '' : coefficient}x^${power}`;
  const model = build(source);
  const x = randomInt(rng, 1, 4);

  return {
    kind: 'derivativeValue',
    source,
    answerType: 'number',
    promptKey: `${KEY}.q.derivativeValue`,
    promptParams: { x },
    expected: model.derivative(x),
    tolerance: 1e-6,
    focus: { lab: 'derivative', point: x },
    derivativeSource: model.derivativeSource,
    hintKeys: [`${KEY}.h.powerRule`, `${KEY}.h.writeDerivative`, `${KEY}.h.substituteX`],
    explainKey: `${KEY}.e.derivativeValue`,
    explainParams: {
      x, derivative: model.derivativeSource ?? '',
      value: formatNumberForPrompt(model.derivative(x)),
    },
  };
}

/** §30 : « Find the interval where the function is decreasing. » */
function monotonicChallenge(rng, difficulty) {
  const root1 = randomInt(rng, -3, 0);
  const root2 = root1 + randomInt(rng, 2, 4);
  const { source, vertex } = quadraticFromRoots(root1, root2);

  return {
    kind: 'monotonic',
    source,
    answerType: 'choice',
    choices: ['beforeVertex', 'afterVertex'],
    promptKey: `${KEY}.q.monotonic`,
    promptParams: {},
    expected: 'beforeVertex',
    focus: { lab: 'study', point: vertex },
    hintKeys: [`${KEY}.h.parabolaShape`, `${KEY}.h.vertexSplits`, `${KEY}.h.derivativeNegative`],
    explainKey: `${KEY}.e.monotonic`,
    explainParams: { vertex: formatNumberForPrompt(vertex) },
  };
}

/** §30 : « Adjust n until the Riemann approximation is sufficiently close. » */
function riemannChallenge(rng, difficulty) {
  const source = pick(rng, ['x^2', 'x^3', '\\sqrt{x}']);
  const model = build(source);
  const b = randomInt(rng, 1, 3);
  const exact = definiteIntegral(model.fn, 0, b);
  // Le plus petit n (parmi les crans proposés) dont l'erreur passe sous le seuil.
  const threshold = 0.05 * Math.max(1, Math.abs(exact.value));
  const steps = [2, 5, 10, 20, 50, 100];
  const answer = steps.find((n) => Math.abs(riemannSum(model.fn, 0, b, n, 'left').sum - exact.value) < threshold) ?? 100;

  return {
    kind: 'riemannClose',
    source,
    answerType: 'threshold',
    promptKey: `${KEY}.q.riemannClose`,
    promptParams: { b, threshold: formatNumberForPrompt(threshold) },
    expected: answer,
    tolerance: 0,
    exactValue: exact.ok ? exact.value : null,
    threshold,
    bounds: { a: 0, b },
    focus: { lab: 'integral', bounds: { a: 0, b } },
    hintKeys: [`${KEY}.h.narrowerRectangles`, `${KEY}.h.compareToExact`, `${KEY}.h.increaseUntilClose`],
    explainKey: `${KEY}.e.riemannClose`,
    explainParams: { n: answer, value: formatNumberForPrompt(exact.value ?? 0) },
  };
}

/** §30 : combien de solutions à f(x) = 0 ? (§27 : la lecture graphique d'abord) */
function rootCountChallenge(rng, difficulty) {
  const source = pick(rng, ['x^2-4x+3', 'x^2+1', 'x^3-3x', 'x^2', '4-x^2']);
  const model = build(source);
  const roots = findRoots(model.fn, -8, 8);

  return {
    kind: 'rootCount',
    source,
    answerType: 'number',
    promptKey: `${KEY}.q.rootCount`,
    promptParams: {},
    expected: roots.length,
    tolerance: 0,
    focus: { lab: 'study' },
    hintKeys: [`${KEY}.h.rootsAreCrossings`, `${KEY}.h.countCrossings`, `${KEY}.h.touchCountsOnce`],
    explainKey: `${KEY}.e.rootCount`,
    explainParams: {
      count: roots.length,
      xs: roots.map((root) => formatNumberForPrompt(root.x)).join(' ؛ '),
    },
  };
}

/**
 * Le nombre tel qu'il doit APPARAÎTRE dans une question arabe : virgule
 * décimale et vrai signe moins, comme partout ailleurs. On ne peut pas
 * appeler analysisFormat ici sans créer un cycle (practice ← format ←
 * grapheur) : la règle est courte, on la tient sur place.
 */
function formatNumberForPrompt(value) {
  if (!Number.isFinite(value)) return '—';
  const rounded = Number(value.toFixed(3));

  return String(Math.abs(rounded) < 1e-12 ? 0 : rounded).replace('.', ',').replace('-', '−');
}

/**
 * Le VERDICT sur une réponse. Jamais un verrou (§43) : il dit juste,
 * et l'interface montre POURQUOI.
 *
 * @param {object} challenge
 * @param {string|number} answer
 * @returns {{correct: boolean, parsed: number|string|null, reason?: string}}
 */
export function checkAnswer(challenge, answer) {
  if (!challenge) return { correct: false, parsed: null, reason: 'empty' };

  if (challenge.answerType === 'choice') {
    const value = String(answer ?? '').trim();
    if (!value) return { correct: false, parsed: null, reason: 'empty' };

    return { correct: value === challenge.expected, parsed: value };
  }

  // « Écris une réponse d'abord » et « je n'ai pas compris » ne se disent pas
  // de la même façon : un champ vide n'est pas une erreur de l'élève.
  if (String(answer ?? '').trim() === '') return { correct: false, parsed: null, reason: 'empty' };

  const parsed = parseStudentNumber(answer);
  if (parsed === null) return { correct: false, parsed: null, reason: 'unparsed' };

  if (challenge.answerType === 'threshold') {
    // §30 : « adjust n until close enough » — TOUT n assez grand est juste.
    // Exiger le n minimal exact serait punir une bonne réponse (§43).
    return { correct: parsed >= challenge.expected, parsed };
  }

  const tolerance = challenge.tolerance ?? 1e-6;

  return { correct: Math.abs(parsed - challenge.expected) <= tolerance, parsed };
}

/**
 * La saisie d'un élève → un nombre.
 *
 * Elle accepte la virgule décimale (« 2,5 »), le vrai signe moins (« −3 »),
 * les espaces, et une fraction simple (« 1/2 ») — ce qu'un élève algérien
 * écrit vraiment. Rend null si ce n'est pas un nombre, JAMAIS NaN (qui se
 * comparerait silencieusement faux).
 */
export function parseStudentNumber(input) {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  const raw = String(input ?? '').trim();
  if (!raw) return null;

  const text = raw
    .replace(/\u2212/g, '-')
    .replace(/\s+/g, '')
    .replace(',', '.');

  // Le cas courant, ecrit a la main : « 2,5 », « -3 ».
  if (/^-?\d*\.?\d+$/.test(text)) {
    const value = Number(text);

    return Number.isFinite(value) ? value : null;
  }

  // « 1/2 », tape au clavier systeme.
  const fraction = /^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/.exec(text);
  if (fraction) {
    const denominator = Number(fraction[2]);
    if (denominator === 0) return null;
    const value = Number(fraction[1]) / denominator;

    return Number.isFinite(value) ? value : null;
  }

  /**
   * Ce que MathLive produit : `\frac{1}{2}`, `\sqrt{4}`, `-\frac{3}{4}`, `\pi`.
   *
   * On ne l'analyse PAS a la main — on confie la chaine a l'analyseur du
   * grapheur, qui connait deja ce sous-ensemble, refuse ce qu'il ne comprend
   * pas, et n'execute jamais la saisie de l'eleve. Ecrire un second lecteur
   * de LaTeX ici aurait ete un doublon, et un doublon qui diverge.
   *
   * La reponse doit rester un NOMBRE : une expression qui depend encore de x
   * (« 2x ») n'est pas une reponse a « combien vaut f'(2) ? », donc on
   * l'evalue sans variable et on refuse ce qui n'est pas fini.
   */
  let compiled;
  try {
    compiled = compileSource(raw);
  } catch {
    return null;
  }
  if (!compiled.ok) return null;
  const value = compiled.fn(NaN);

  return Number.isFinite(value) ? value : null;
}


/**
 * Les EXPÉRIENCES guidées de §29 : un geste à faire, une chose à observer.
 *
 * Une expérience n'est pas un texte à lire : c'est un état de départ + une
 * question. L'interface pose l'état, affiche la question, et laisse l'élève
 * manipuler. C'est le « Each experiment should produce an observable
 * phenomenon » de §29.
 */
export const EXPERIMENTS = Object.freeze([
  {
    id: 'secantToTangent',
    lab: 'secant',
    source: 'x^2',
    setup: { point: 1, secondPoint: 3 },
    /** Le geste que l'interface propose d'animer : B glisse vers A. */
    action: 'approach',
    questionKey: `${KEY}.experiments.secantToTangent.question`,
    observationKey: `${KEY}.experiments.secantToTangent.observation`,
  },
  {
    id: 'slopeAtExtremum',
    lab: 'derivative',
    source: 'x^2-4x+3',
    setup: { point: 0 },
    action: 'sweep',
    questionKey: `${KEY}.experiments.slopeAtExtremum.question`,
    observationKey: `${KEY}.experiments.slopeAtExtremum.observation`,
  },
  {
    id: 'riemannRefine',
    lab: 'integral',
    source: 'x^2',
    setup: { bounds: { a: 0, b: 2 }, riemann: { n: 2, mode: 'left' } },
    action: 'refine',
    questionKey: `${KEY}.experiments.riemannRefine.question`,
    observationKey: `${KEY}.experiments.riemannRefine.observation`,
  },
  {
    id: 'parameterA',
    lab: 'transform',
    source: 'ax^2+bx+c',
    setup: { parameters: { a: 1, b: 0, c: 0 } },
    action: 'slide',
    questionKey: `${KEY}.experiments.parameterA.question`,
    observationKey: `${KEY}.experiments.parameterA.observation`,
  },
  {
    id: 'oneSidedLimits',
    lab: 'limit',
    source: '\\frac{1}{x}',
    setup: { limitPoint: 0 },
    action: 'approach',
    questionKey: `${KEY}.experiments.oneSidedLimits.question`,
    observationKey: `${KEY}.experiments.oneSidedLimits.observation`,
  },
  {
    id: 'constantShift',
    lab: 'integral',
    source: 'x^2',
    setup: { constant: 0 },
    action: 'slide',
    questionKey: `${KEY}.experiments.constantShift.question`,
    observationKey: `${KEY}.experiments.constantShift.observation`,
  },
]);

export function getExperiment(id) {
  return EXPERIMENTS.find((experiment) => experiment.id === id) ?? null;
}

/**
 * Les questions de PRÉDICTION de §28 : posées AVANT de révéler, jamais après.
 *
 * Elles portent sur un phénomène que l'élève est en train de provoquer — ce
 * qui les distingue d'un QCM. Chacune nomme le laboratoire où elle a un sens.
 */
export const PREDICTIONS = Object.freeze([
  { id: 'tangentSlopeAtVertex', lab: 'tangent', choices: ['positive', 'zero', 'negative'], expected: 'zero' },
  { id: 'derivativeSignWhenIncreasing', lab: 'derivative', choices: ['positive', 'zero', 'negative'], expected: 'positive' },
  { id: 'areaWhenBoundMoves', lab: 'integral', choices: ['larger', 'same', 'smaller'], expected: 'larger' },
  { id: 'riemannWhenNGrows', lab: 'integral', choices: ['better', 'same', 'worse'], expected: 'better' },
  { id: 'limitFromBothSides', lab: 'limit', choices: ['same', 'different'], expected: 'different' },
]);

export function getPrediction(id) {
  return PREDICTIONS.find((prediction) => prediction.id === id) ?? null;
}
