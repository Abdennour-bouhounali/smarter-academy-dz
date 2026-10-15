import { lazy } from 'react';
import { MANIPULATION_TYPE_IDS } from '@smarter-academy/core/curriculum/manipulationTypes.js';

/**
 * Le registre FERMÉ type → composant (le pendant React de
 * packages/core/curriculum/manipulationTypes.js, qui porte les types sans
 * React pour l'outillage). Un `lesson.config.js` nomme un type dans
 * `resources[]` ; un module rend `<Manipulation type=… />` ; jamais du code
 * arbitraire venu du contenu.
 *
 * `manipulationRegistry.test.js` vérifie que chaque type du registre pur a
 * son composant ici, et réciproquement.
 */
export const MANIPULATION_COMPONENTS = {
  'divisor-explorer': lazy(() => import('./divisibility/DivisorExplorer')),
  'divisor-explorer-books': lazy(() => import('./divisibility/DivisorExplorerBooks')),
  'team-builder': lazy(() => import('./divisibility/TeamBuilder')),
  'factor-pairs': lazy(() => import('./divisibility/FactorPairs')),
  'divisor-properties': lazy(() => import('./divisibility/DivisorProperties')),
  'common-divisors': lazy(() => import('./divisibility/CommonDivisors')),
  'pgcd-differences': lazy(() => import('./divisibility/DifferenceAlgorithm')),
  'euclidean-algorithm': lazy(() => import('./divisibility/EuclidAlgorithm')),
  'coprime-explorer': lazy(() => import('./divisibility/CoprimeExplorer')),
  'fraction-reduction': lazy(() => import('./divisibility/FractionReduction')),
  // Unité 2 « الحساب على الجذور » (2026-09-30).
  'square-root-side': lazy(() => import('./roots/SquareRootSide')),
  'square-fold': lazy(() => import('./roots/SquareFold')),
  'square-tiling': lazy(() => import('./roots/SquareTiling')),
  'pitch-expansion': lazy(() => import('./algebra/PitchExpansion')),
  'turf-factoring': lazy(() => import('./algebra/TurfFactoring')),
  // Unité 4 « معادلات ومتراجحات » (2026-10-01).
  'equation-balance': lazy(() => import('./equations/EquationBalance')),
  'vanishing-pitch': lazy(() => import('./equations/VanishingPitch')),
  'solution-ray': lazy(() => import('./equations/SolutionRay')),
  'growth-race': lazy(() => import('./equations/GrowthRace')),
  // Unité 5 « جمل معادلتين » (2026-10-01).
  'pair-scoreboard': lazy(() => import('./systems/PairScoreboard')),
  'elimination-cards': lazy(() => import('./systems/EliminationCards')),
  'story-modeller': lazy(() => import('./systems/StoryModeller')),
  // Unité 6 « الدالة الخطية والتناسبية » (2026-10-02).
  'ratio-ride': lazy(() => import('./proportion/RatioRide')),
  'linear-machine': lazy(() => import('./proportion/LinearMachine')),
  'origin-line': lazy(() => import('./proportion/OriginLine')),
  'percent-tag': lazy(() => import('./proportion/PercentTag')),
  // Unité 7 « الدالة التآلفية » (2026-10-02).
  'affine-meter': lazy(() => import('./affine/AffineMeter')),
  'affine-line': lazy(() => import('./affine/AffineLine')),
  'slope-stairs': lazy(() => import('./affine/SlopeStairs')),
  'line-crossing': lazy(() => import('./affine/LineCrossing')),
  'plan-compare': lazy(() => import('./affine/PlanCompare')),
  // Unité 8 « الإحصاء » (2026-10-02).
  'cumul-gate': lazy(() => import('./stats/CumulGate')),
  'stat-balance': lazy(() => import('./stats/StatBalance')),
  'sheet-lab': lazy(() => import('./stats/SheetLab')),
  'group-tanks': lazy(() => import('./stats/GroupTanks')),
  // Unité 9 « خاصية طالس » (2026-10-02).
  'thales-beam': lazy(() => import('./geometry/ThalesBeam')),
  'parallel-level': lazy(() => import('./geometry/ParallelLevel')),
  'segment-divider': lazy(() => import('./geometry/SegmentDivider')),
  'shadow-stick': lazy(() => import('./geometry/ShadowStick')),
  'shadow-world': lazy(() => import('./geometry/ShadowWorld')),
  'cone-cylinder': lazy(() => import('./geometry/ConeCylinder')),
  // Unité 10 « حساب المثلثات في المثلث القائم » (2026-10-04).
  'ramp-ratios': lazy(() => import('./geometry/RampRatios')),
  'trig-calculator': lazy(() => import('./geometry/TrigCalculator')),
  'angle-compass': lazy(() => import('./geometry/AngleCompass')),
  'clinometer': lazy(() => import('./geometry/Clinometer')),
  // Unités 11 « الأشعة والانسحاب » et 12 « الأشعة في معلم » (2026-10-04).
  'translation-glide': lazy(() => import('./vectors/TranslationGlide')),
  'parallelogram-pin': lazy(() => import('./vectors/ParallelogramPin')),
  'vector-sum': lazy(() => import('./vectors/VectorSum')),
  'vector-chain': lazy(() => import('./vectors/VectorChain')),
  'bridge-path': lazy(() => import('./vectors/BridgePath')),
  'component-steps': lazy(() => import('./vectors/ComponentSteps')),
  'component-calc': lazy(() => import('./vectors/ComponentCalc')),
  'midpoint-distance': lazy(() => import('./vectors/MidpointDistance')),
  'shape-prover': lazy(() => import('./vectors/ShapeProver')),
  'route-compare': lazy(() => import('./vectors/RouteCompare')),
  // Unité 13 « الدوران - الزوايا - المضلّعات المنتظمة » (2026-10-04).
  'rotation-dial': lazy(() => import('./rotation/RotationDial')),
  'shape-turn': lazy(() => import('./rotation/ShapeTurn')),
  'inscribed-angle': lazy(() => import('./rotation/InscribedAngle')),
  'polygon-forge': lazy(() => import('./rotation/PolygonForge')),
  'lamp-ring': lazy(() => import('./rotation/LampRing')),
  'sphere-probe': lazy(() => import('./space/SphereProbe')),
  'orange-peel': lazy(() => import('./space/OrangePeel')),
  'section-slicer': lazy(() => import('./space/SectionSlicer')),
  'scale-blocks': lazy(() => import('./space/ScaleBlocks')),
  'bucket-fill': lazy(() => import('./space/BucketFill')),
  // 1AM, unité 2 « الجمع والطرح » (2026-10-14).
  'story-bars': lazy(() => import('./operations/StoryBars')),
  // 1AM, unité 3 « الضرب والقسمة » (2026-10-14).
  'division-jumps': lazy(() => import('./operations/DivisionJumps')),
  'digit-cards': lazy(() => import('./operations/DigitCards')),
  // 1AM, unité 4 « الكتابات الكسرية » (2026-10-14).
  'fraction-knife': lazy(() => import('./operations/FractionKnife')),
  'fair-share': lazy(() => import('./operations/FairShare')),
  // 1AM, unité 1 « الأعداد الطبيعية والأعداد العشرية » (2026-10-14).
  'rank-exchange': lazy(() => import('./operations/RankExchange')),
  // 2AM, unité 2 « الكسور والعمليات عليها » (2026-10-14).
  'egg-trays': lazy(() => import('./operations/EggTrays')),
};

export const REGISTERED_TYPE_IDS = Object.freeze(Object.keys(MANIPULATION_COMPONENTS));

export function assertRegistryComplete() {
  const missing = MANIPULATION_TYPE_IDS.filter((id) => !MANIPULATION_COMPONENTS[id]);
  const extra = REGISTERED_TYPE_IDS.filter((id) => !MANIPULATION_TYPE_IDS.includes(id));
  return { missing, extra };
}
