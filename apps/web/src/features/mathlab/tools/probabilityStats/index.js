import { Dice5 } from 'lucide-react';
import { defineMathLabTool } from '../../toolContract.js';
import { PROBABILITY_STATS_SCHEMA_VERSION, createProbabilityStatsData } from './probabilityState.js';

/**
 * الاحتمالات والإحصاء (probabilités & statistiques) — le quatrième
 * instrument du مختبر الرياضيات.
 *
 * Lancer une expérience aléatoire, voir les données s'accumuler, comparer la
 * fréquence expérimentale à la probabilité théorique ; ou saisir une série
 * et lire sa distribution, sa moyenne, sa médiane. Tout est dessiné en SVG
 * et calculé ici : aucune bibliothèque de graphiques n'est embarquée, et le
 * noyau de calcul statistique est celui que les leçons utilisent déjà
 * (lessons/common/stats). Voir docs/architecture/MATH_LAB.md § 5d.
 *
 * Cet instrument remplace à lui seul les deux qui étaient annoncés
 * (« الإحصاء » et « الاحتمالات ») : la loi des grands nombres est le pont
 * entre les deux, et la couper en deux outils l'aurait cassée.
 */
export const probabilityStatsTool = defineMathLabTool({
  id: 'probabilityStats',
  slug: 'probabilites-statistiques',
  labelKey: 'tools.probabilityStats.name',
  descriptionKey: 'tools.probabilityStats.description',
  newLabelKey: 'tools.probabilityStats.new',
  defaultTitleKey: 'tools.probabilityStats.defaultTitle',
  icon: Dice5,
  schemaVersion: PROBABILITY_STATS_SCHEMA_VERSION,
  createInitialData: createProbabilityStatsData,
  load: () => import('./ProbabilityStatsTool.jsx'),
});
