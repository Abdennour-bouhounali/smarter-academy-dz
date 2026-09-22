/**
 * L'ÉTAT du laboratoire des probabilités et statistiques — logique pure,
 * sans React.
 *
 *     data = {
 *       mode:       'experiment' | 'dataset',
 *       experiment: 'coin' | 'die' | 'twoDice' | 'random',
 *       range:      { min, max },          // les bornes du générateur d'entiers
 *       draws:      number,                // combien de tirages au prochain lancer
 *       simulation: { experimentId, seed, total, counts, drawn, trajectory } | null,
 *       dataset:    string,                // la série TELLE QUE SAISIE
 *       settings:   { compare, showMean, showMedian, watchRolls },
 *     }
 *
 * `dataset` garde le TEXTE, pas les nombres : une saisie fautive doit se
 * retrouver telle quelle au rechargement, pour que l'élève voie ce qu'il a
 * écrit et le corrige — exactement comme le grapheur garde une expression
 * invalide (MATH_LAB.md § 5b.6).
 *
 * `simulation` ne garde que des effectifs et une graine : cent mille
 * lancers pèsent le même poids que dix.
 *
 * PROBABILITY_STATS_SCHEMA_VERSION est la version de CE format.
 */

import {
  DEFAULT_DRAWS, DEFAULT_EXPERIMENT, MAX_DRAWS, isExperimentId, normalizeRange,
} from './experiments.js';
import { fromStoredSimulation, toStoredSimulation } from './simulationEngine.js';
import { MAX_DATASET_VALUES } from './datasetStatistics.js';

export const PROBABILITY_STATS_SCHEMA_VERSION = 1;

export const MODES = Object.freeze(['experiment', 'dataset']);
export const DEFAULT_MODE = 'experiment';

/** Assez long pour porter MAX_DATASET_VALUES nombres, assez court pour borner le document. */
const MAX_DATASET_TEXT = MAX_DATASET_VALUES * 12;

/** La série d'exemple d'un laboratoire neuf : sept valeurs, une médiane lisible, une moyenne qui n'est pas ronde. */
export const EXAMPLE_DATASET = '12 ; 15 ; 14 ; 18 ; 10 ; 12 ; 16';

function clampDraws(value) {
  const n = typeof value === 'number' && Number.isFinite(value) ? Math.floor(value) : DEFAULT_DRAWS;

  return Math.min(MAX_DRAWS, Math.max(1, n));
}

/** N'importe quel `data` (document, amorce, version antérieure) → l'état V1 complet et sûr. */
export function normalizeProbabilityStatsData(raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const mode = MODES.includes(source.mode) ? source.mode : DEFAULT_MODE;
  const experiment = isExperimentId(source.experiment) ? source.experiment : DEFAULT_EXPERIMENT;
  const range = normalizeRange(source.range);
  const settings = source.settings && typeof source.settings === 'object' ? source.settings : {};

  return {
    mode,
    experiment,
    range,
    draws: clampDraws(source.draws),
    // Une simulation qui ne correspond plus à son expérience est écartée :
    // des effectifs sans univers ne veulent rien dire.
    simulation: fromStoredSimulation(source.simulation, experiment, range),
    dataset: typeof source.dataset === 'string' ? source.dataset.slice(0, MAX_DATASET_TEXT) : EXAMPLE_DATASET,
    settings: {
      compare: settings.compare !== false,
      showMean: settings.showMean !== false,
      showMedian: settings.showMedian !== false,
      // Regarder chaque lancer (jusqu'à WATCH_MAX) plutôt qu'un lot : le geste par défaut.
      watchRolls: settings.watchRolls !== false,
    },
  };
}

/**
 * L'état d'un document neuf : la pièce, cent lancers prêts, aucune
 * simulation (rien n'est tiré avant que l'élève le demande), la série
 * d'exemple en réserve pour le mode « données ». Une amorce de leçon
 * (openMathLab.js) peut fixer le mode, l'expérience, ses paramètres et la
 * série — jamais une simulation : une expérience aléatoire se lance, elle
 * ne se reçoit pas toute faite.
 */
export function createProbabilityStatsData(seed = undefined) {
  if (seed && typeof seed === 'object') {
    return normalizeProbabilityStatsData({
      ...seed,
      simulation: null,
      dataset: typeof seed.dataset === 'string'
        ? seed.dataset
        : Array.isArray(seed.values) ? seed.values.filter((v) => Number.isFinite(v)).join(' ; ') : EXAMPLE_DATASET,
    });
  }

  return normalizeProbabilityStatsData({});
}

/** L'état → ce qu'on enregistre : la simulation y perd tout ce qui se recalcule. */
export function toStoredData(data) {
  return {
    mode: data.mode,
    experiment: data.experiment,
    range: data.range,
    draws: data.draws,
    simulation: toStoredSimulation(data.simulation),
    dataset: data.dataset,
    settings: { ...data.settings },
  };
}
