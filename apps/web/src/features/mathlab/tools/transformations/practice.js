/**
 * PRÉDIRE → TRANSFORMER → VÉRIFIER (§38 – §40) et les PUZZLES (§42).
 *
 * Logique PURE : générer une question, juger une réponse, dire où en est un
 * puzzle. Pas de React, pas de hasard caché — le générateur reçoit son
 * `random`, ce qui rend chaque question reproductible dans un test.
 *
 * ── Le principe qui gouverne tout ce fichier ─────────────────────────────
 * Une réponse fausse ne BLOQUE jamais (c'est la règle du مختبر, déjà tenue
 * par la trigonométrie et les suites) : l'élève prédit, l'instrument ANIME
 * la transformation, et la figure lui montre elle-même où il en était. Rien
 * ici ne rend « faux » sans rendre en même temps la bonne réponse et de quoi
 * la voir.
 */

import * as M from './transformMath.js';
import { matrixFor } from './transformModel.js';

/** Les familles de questions (§38, §39, §40). */
export const CHALLENGE_KINDS = Object.freeze(['predictPoint', 'choosePosition', 'multiStep']);

const randomInt = (random, min, max) => min + Math.floor(random() * (max - min + 1));
const pick = (random, list) => list[Math.floor(random() * list.length)];

/** Les pas que le générateur sait proposer : simples, à coefficients entiers, lisibles. */
function randomStep(random, { allowDilation = true } = {}) {
  const kinds = allowDilation
    ? ['translation', 'rotation', 'reflection', 'dilation']
    : ['translation', 'rotation', 'reflection'];
  switch (pick(random, kinds)) {
    case 'rotation':
      return { kind: 'rotation', enabled: true, angle: pick(random, [90, 180, 270]), center: { type: 'origin' } };
    case 'reflection':
      return { kind: 'reflection', enabled: true, axis: { type: pick(random, ['xAxis', 'yAxis', 'origin', 'diagonal']) } };
    case 'dilation':
      return { kind: 'dilation', enabled: true, k: pick(random, [2, -1, 3]), center: { type: 'origin' } };
    case 'translation':
    default:
      return {
        kind: 'translation',
        enabled: true,
        vx: randomInt(random, -5, 5),
        vy: randomInt(random, -5, 5),
      };
  }
}

/**
 * Une question d'entraînement.
 *
 * Elle porte TOUT ce qu'il faut pour être posée, jugée et animée :
 * l'énoncé (`point`, `steps`), la réponse (`answer`), et pour §39 les
 * positions proposées. L'interface n'en calcule aucune.
 */
export function generateChallenge(random = Math.random, options = {}) {
  const kind = options.kind && CHALLENGE_KINDS.includes(options.kind)
    ? options.kind
    : pick(random, CHALLENGE_KINDS);
  const point = { x: randomInt(random, -5, 5), y: randomInt(random, -5, 5) };

  if (kind === 'multiStep') {
    // Deux pas : assez pour que l'ordre compte, assez peu pour rester suivable.
    const steps = [randomStep(random, { allowDilation: false }), randomStep(random, { allowDilation: false })];
    const answer = applySteps(point, steps);

    return { kind, point, steps, answer, choices: null };
  }

  const steps = [randomStep(random)];
  const answer = applySteps(point, steps);

  if (kind === 'choosePosition') {
    return { kind, point, steps, answer, choices: buildChoices(random, answer, point, steps) };
  }

  return { kind, point, steps, answer, choices: null };
}

/** L'image d'un point par une suite de pas — la réponse attendue. */
export function applySteps(point, steps) {
  if (!M.isPoint(point)) return null;

  return (Array.isArray(steps) ? steps : []).reduce((current, step) => {
    const matrix = matrixFor(step, [current]);

    return matrix ? M.cleanPoint(M.applyMatrix(matrix, current)) : current;
  }, point);
}

/**
 * Les positions proposées de §39 — une juste, trois fausses PLAUSIBLES.
 *
 * Les leurres ne sont pas au hasard : ce sont les erreurs que l'élève commet
 * vraiment — le signe oublié, les coordonnées échangées, la transformation
 * appliquée à l'envers. Un leurre absurde n'apprend rien ; un leurre qui
 * ressemble à sa propre erreur, si.
 */
function buildChoices(random, answer, point, steps) {
  const candidates = [
    { x: -answer.x, y: answer.y },
    { x: answer.x, y: -answer.y },
    { x: answer.y, y: answer.x },
    applySteps(point, steps.map(inverseStepOf).filter(Boolean)),
    { x: answer.x + randomInt(random, 1, 3), y: answer.y },
    { x: answer.x, y: answer.y + randomInt(random, 1, 3) },
  ].filter((candidate) => M.isPoint(candidate) && !M.samePoint(candidate, answer));

  const distractors = [];
  for (const candidate of candidates) {
    if (distractors.length >= 3) break;
    if (!distractors.some((existing) => M.samePoint(existing, candidate))) distractors.push(candidate);
  }
  // Si les leurres se sont effondrés les uns sur les autres, on complète par décalage.
  let offset = 1;
  while (distractors.length < 3) {
    const candidate = { x: answer.x + offset, y: answer.y - offset };
    if (!M.samePoint(candidate, answer) && !distractors.some((existing) => M.samePoint(existing, candidate))) {
      distractors.push(candidate);
    }
    offset += 1;
  }

  return shuffle(random, [answer, ...distractors]);
}

/** Le pas « à l'envers », pour fabriquer un leurre crédible. */
function inverseStepOf(step) {
  switch (step?.kind) {
    case 'translation': return { ...step, vx: -step.vx, vy: -step.vy };
    case 'rotation': return { ...step, angle: M.normalizeAngle(-step.angle) };
    case 'dilation': return step.k !== 0 ? { ...step, k: 1 / step.k } : null;
    default: return null;      // une réflexion est sa propre inverse : pas un leurre.
  }
}

function shuffle(random, list) {
  const items = [...list];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/**
 * Le jugement d'une réponse.
 *
 * La tolérance est LÂCHE (0,05) parce que la réponse arrive parfois d'un
 * clic sur le plan : l'élève qui vise (3, 2) et clique à (3,01 ; 1,98) a
 * raison, et lui dire le contraire serait juger sa souris, pas sa géométrie.
 * Une réponse TAPÉE, elle, tombe sur des entiers et cette tolérance ne la
 * concerne pas.
 */
export function checkAnswer(challenge, given, tolerance = 0.05) {
  if (!challenge?.answer || !M.isPoint(given)) {
    return { correct: false, expected: challenge?.answer ?? null };
  }

  return {
    correct: M.samePoint(challenge.answer, given, tolerance),
    expected: challenge.answer,
  };
}

// ── Les puzzles (§42) ───────────────────────────────────────────────────

/**
 * Les PUZZLES : « amène le triangle bleu sur le triangle cible ».
 *
 * Chaque puzzle donne une figure de départ et une pile CACHÉE qui fabrique
 * la cible. La solution n'est pas unique et ne doit pas l'être (§42) : le
 * puzzle est résolu quand les figures SE SUPERPOSENT, quelle que soit la
 * route prise — c'est `M.figuresCoincide` qui juge, jamais la comparaison
 * des piles.
 */
export const PUZZLES = Object.freeze([
  {
    id: 'slide',
    titleKey: 'puzzles.slide',
    figure: [{ x: -5, y: 1 }, { x: -2, y: 1 }, { x: -5, y: 3 }],
    solution: [{ kind: 'translation', enabled: true, vx: 7, vy: -2 }],
    hintKey: 'puzzles.slideHint',
  },
  {
    id: 'quarter',
    titleKey: 'puzzles.quarter',
    figure: [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 1, y: 3 }],
    solution: [{ kind: 'rotation', enabled: true, angle: 90, center: { type: 'origin' } }],
    hintKey: 'puzzles.quarterHint',
  },
  {
    id: 'mirror',
    titleKey: 'puzzles.mirror',
    figure: [{ x: 2, y: 1 }, { x: 5, y: 2 }, { x: 3, y: 4 }],
    solution: [{ kind: 'reflection', enabled: true, axis: { type: 'yAxis' } }],
    hintKey: 'puzzles.mirrorHint',
  },
  {
    id: 'grow',
    titleKey: 'puzzles.grow',
    figure: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 2 }],
    solution: [{ kind: 'dilation', enabled: true, k: 2, center: { type: 'origin' } }],
    hintKey: 'puzzles.growHint',
  },
  {
    id: 'twoSteps',
    titleKey: 'puzzles.twoSteps',
    figure: [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 1, y: 3 }],
    solution: [
      { kind: 'reflection', enabled: true, axis: { type: 'xAxis' } },
      { kind: 'translation', enabled: true, vx: -3, vy: 0 },
    ],
    hintKey: 'puzzles.twoStepsHint',
  },
]);

export function getPuzzle(id) {
  return PUZZLES.find((puzzle) => puzzle.id === id) ?? null;
}

/** La figure CIBLE d'un puzzle : l'image de sa figure par sa pile cachée. */
export function puzzleTarget(puzzle) {
  if (!puzzle) return [];

  return puzzle.solution.reduce((vertices, step) => {
    const matrix = matrixFor(step, puzzle.figure);

    return matrix ? vertices.map((vertex) => M.cleanPoint(M.applyMatrix(matrix, vertex))) : vertices;
  }, puzzle.figure);
}

/**
 * Le puzzle est-il résolu ?
 *
 * La tolérance (0,01) est plus serrée que celle de §38 : ici l'élève règle
 * des curseurs et des champs, pas un doigt. Elle reste assez lâche pour
 * qu'une rotation de 90° obtenue en flottant ne soit pas refusée.
 */
export function isPuzzleSolved(puzzle, currentVertices, tolerance = 0.01) {
  if (!puzzle) return false;

  return M.figuresCoincide(puzzleTarget(puzzle), currentVertices, tolerance);
}

// ── Les expériences guidées (§41, §44) ──────────────────────────────────

/**
 * « QU'EST-CE QUI CHANGE ? » — les expériences de §41.
 *
 * Chacune POSE la scène (une figure, une pile) et une question, puis laisse
 * l'élève manipuler. La réponse (`revealKey`) n'est affichée qu'après, et
 * l'instrument, lui, a déjà mesuré : le panneau des invariants dit la même
 * chose, mesurée sur la figure de l'élève. Le texte ne fait que NOMMER ce
 * qu'il a vu — il ne le remplace jamais.
 */
export const EXPERIMENTS = Object.freeze([
  {
    id: 'rotateSquare',
    titleKey: 'experiments.rotateSquare',
    promptKey: 'experiments.rotateSquarePrompt',
    revealKey: 'experiments.rotateSquareReveal',
    figure: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 3, y: 3 }, { x: 1, y: 3 }],
    steps: [{ kind: 'rotation', enabled: true, angle: 90, center: { type: 'origin' } }],
    watch: ['distances', 'area', 'coordinates'],
  },
  {
    id: 'dilateLengths',
    titleKey: 'experiments.dilateLengths',
    promptKey: 'experiments.dilateLengthsPrompt',
    revealKey: 'experiments.dilateLengthsReveal',
    figure: [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 1, y: 3 }],
    steps: [{ kind: 'dilation', enabled: true, k: 2, center: { type: 'origin' } }],
    watch: ['distances', 'perimeter'],
  },
  {
    id: 'dilateArea',
    titleKey: 'experiments.dilateArea',
    promptKey: 'experiments.dilateAreaPrompt',
    revealKey: 'experiments.dilateAreaReveal',
    figure: [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 1, y: 3 }],
    steps: [{ kind: 'dilation', enabled: true, k: 2, center: { type: 'origin' } }],
    watch: ['area'],
  },
  {
    id: 'reflectX',
    titleKey: 'experiments.reflectX',
    promptKey: 'experiments.reflectXPrompt',
    revealKey: 'experiments.reflectXReveal',
    figure: [{ x: 1, y: 1 }, { x: 4, y: 2 }, { x: 2, y: 4 }],
    steps: [{ kind: 'reflection', enabled: true, axis: { type: 'xAxis' } }],
    watch: ['coordinates', 'orientation'],
  },
  {
    id: 'translateAngles',
    titleKey: 'experiments.translateAngles',
    promptKey: 'experiments.translateAnglesPrompt',
    revealKey: 'experiments.translateAnglesReveal',
    figure: [{ x: -4, y: -2 }, { x: -1, y: -2 }, { x: -3, y: 1 }],
    steps: [{ kind: 'translation', enabled: true, vx: 5, vy: 1 }],
    watch: ['angles', 'distances', 'coordinates'],
  },
  {
    id: 'order',
    titleKey: 'experiments.order',
    promptKey: 'experiments.orderPrompt',
    revealKey: 'experiments.orderReveal',
    figure: [{ x: 1, y: 1 }, { x: 4, y: 1 }, { x: 1, y: 3 }],
    steps: [
      { kind: 'translation', enabled: true, vx: 3, vy: 0 },
      { kind: 'rotation', enabled: true, angle: 90, center: { type: 'origin' } },
    ],
    watch: ['coordinates'],
  },
]);

export function getExperiment(id) {
  return EXPERIMENTS.find((experiment) => experiment.id === id) ?? null;
}

// ── Les préréglages (§35) ───────────────────────────────────────────────

/** Les transformations remarquables, prêtes à poser dans la pile. */
export const PRESETS = Object.freeze([
  { id: 'translate', labelKey: 'presets.translate', step: { kind: 'translation', vx: 3, vy: 2 } },
  { id: 'rotate90', labelKey: 'presets.rotate90', step: { kind: 'rotation', angle: 90, center: { type: 'origin' } } },
  { id: 'rotate180', labelKey: 'presets.rotate180', step: { kind: 'rotation', angle: 180, center: { type: 'origin' } } },
  { id: 'rotate270', labelKey: 'presets.rotate270', step: { kind: 'rotation', angle: 270, center: { type: 'origin' } } },
  { id: 'reflectX', labelKey: 'presets.reflectX', step: { kind: 'reflection', axis: { type: 'xAxis' } } },
  { id: 'reflectY', labelKey: 'presets.reflectY', step: { kind: 'reflection', axis: { type: 'yAxis' } } },
  { id: 'reflectOrigin', labelKey: 'presets.reflectOrigin', step: { kind: 'reflection', axis: { type: 'origin' } } },
  { id: 'reflectDiagonal', labelKey: 'presets.reflectDiagonal', step: { kind: 'reflection', axis: { type: 'diagonal' } } },
  { id: 'dilate2', labelKey: 'presets.dilate2', step: { kind: 'dilation', k: 2, center: { type: 'origin' } } },
  { id: 'dilateHalf', labelKey: 'presets.dilateHalf', step: { kind: 'dilation', k: 0.5, center: { type: 'origin' } } },
]);

// ── Les motifs (§37) ────────────────────────────────────────────────────

/**
 * Un MOTIF : la même transformation répétée n fois (§37).
 *
 * Rend les n copies successives de la figure — la première est l'image par
 * un pas, la dernière par n pas. C'est délibérément le même `matrixFor` que
 * la pile : répéter une transformation n'est pas un mode à part, c'est la
 * composer avec elle-même, et l'élève qui a compris §20 a déjà compris §37.
 *
 * Le nombre de copies est BORNÉ (24) : au-delà le motif devient illisible et
 * le rendu coûte sans rien apprendre.
 */
export const MAX_PATTERN_COPIES = 24;

export function patternCopies(figure, step, count) {
  const source = Array.isArray(figure) ? figure : [];
  const repetitions = Math.min(MAX_PATTERN_COPIES, Math.max(0, Math.floor(Number(count) || 0)));
  const matrix = matrixFor(step, source);
  if (!matrix || source.length === 0 || repetitions === 0) return [];

  const copies = [];
  let current = source;
  for (let i = 0; i < repetitions; i += 1) {
    current = current.map((vertex) => M.cleanPoint(M.applyMatrix(matrix, vertex)));
    copies.push(current);
  }

  return copies;
}
