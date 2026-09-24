/**
 * Les ENQUÊTES du مختبر القياس — le catalogue déclaratif.
 *
 * §17 exige une primitive réutilisable plutôt que dix interfaces codées à la
 * main. Une enquête est donc une DONNÉE : l'objet qu'on manipule, ses
 * poignées, ce qu'on peut mesurer dessus, la grandeur cherchée, les indices,
 * et la relation que l'instrument reconnaîtra comme trouvée.
 *
 *     objet manipulable  →  `stage` + `handles` + `build(params)`
 *     ce qu'on mesure    →  `quantities` (clé, symbole, ce qui la calcule)
 *     ce qu'on cherche   →  `target`
 *     comment on aide    →  `hints` (trois paliers, jamais la réponse)
 *     ce qu'on cherchait →  `solution` (la relation, JAMAIS affichée avant §23)
 *
 * Ajouter une onzième enquête = une entrée ici. Aucun composant à écrire
 * tant qu'elle réutilise une scène existante (rectangle, triangle, cercle,
 * pavé, segment).
 *
 * ── Le secret (§23) ─────────────────────────────────────────────────────
 * `solution` vit dans ce fichier parce qu'il faut bien que l'instrument
 * sache reconnaître la règle quand l'élève la construit. Il n'est JAMAIS
 * rendu à l'écran avant que `stage` de l'enquête n'ait atteint `found` —
 * `investigationSecretKeys()` liste ce que l'interface n'a pas le droit de
 * lire, et `investigations.test.js` vérifie qu'aucun libellé i18n d'une
 * enquête non résolue ne contient sa formule.
 */

import * as M from './measureMath.js';
import * as R from './ruleEngine.js';

/** Les familles de scène — chacune a UN composant, réutilisé par plusieurs enquêtes. */
export const STAGES = Object.freeze(['rectangle', 'triangle', 'circle', 'cuboid', 'segment']);

/**
 * Une grandeur mesurable : sa clé (celle des colonnes du tableau et des
 * variables de la règle), son symbole mathématique, son unité, et la
 * fonction qui la MESURE sur l'objet courant.
 *
 * `role` dit ce que l'interface en fait :
 *   - `input`   une dimension que l'élève règle (elle a une poignée) ;
 *   - `derived` une mesure que l'instrument prend pour lui (l'aire comptée) ;
 *   - `target`  la grandeur cherchée — la colonne de droite du tableau.
 */
const quantity = (key, symbol, role, measure, options = {}) => Object.freeze({
  key, symbol, role, measure, decimals: options.decimals ?? 2, unit: options.unit ?? 'length',
});

/**
 * Le socle commun d'une enquête. `defineInvestigation` valide au CHARGEMENT
 * du module, comme `defineMathLabTool` : une enquête incomplète échoue au
 * démarrage des tests, pas au premier clic d'un élève.
 */
function defineInvestigation(definition) {
  const required = ['id', 'stage', 'params', 'quantities', 'target', 'solution', 'hintCount'];
  for (const key of required) {
    if (definition[key] === undefined) {
      throw new Error(`[measurement] l'enquête « ${definition.id ?? '?'} » n'a pas de « ${key} »`);
    }
  }
  if (!STAGES.includes(definition.stage)) {
    throw new Error(`[measurement] scène inconnue « ${definition.stage} » pour « ${definition.id} »`);
  }
  const keys = definition.quantities.map((q) => q.key);
  if (!keys.includes(definition.target)) {
    throw new Error(`[measurement] la cible « ${definition.target} » de « ${definition.id} » n'est pas mesurée`);
  }
  if (new Set(keys).size !== keys.length) {
    throw new Error(`[measurement] grandeurs en double dans « ${definition.id} »`);
  }

  return Object.freeze({ evidence: DEFAULT_EVIDENCE, ...definition });
}

/**
 * La PREUVE exigée avant qu'une conjecture soit retenue (§25).
 *
 * Trois observations, dont deux au moins qui diffèrent sur chaque dimension
 * réglable, et un essai sur un objet que l'élève n'a pas choisi. C'est ce
 * qui empêche de valider « A = L × l » après avoir mesuré trois fois un
 * carré de côté 2 — où L + l et L × l donnent la même chose.
 */
const DEFAULT_EVIDENCE = Object.freeze({ minObservations: 3, minDistinct: 2, requiresUnseenTest: true });

// ── Les paramètres réglables d'un objet ──────────────────────────────────

/** Une dimension réglable : bornes, pas, valeur d'ouverture. */
const param = (key, min, max, step, initial) => Object.freeze({ key, min, max, step, initial });

// ─────────────────────────────────────────────────────────────────────────
// §5 — L'aire du rectangle
// ─────────────────────────────────────────────────────────────────────────

const rectangleArea = defineInvestigation({
  id: 'rectangle-area',
  stage: 'rectangle',
  concept: 'area',
  params: [param('length', 1, 12, 1, 5), param('width', 1, 9, 1, 3)],
  unitGrid: true,
  quantities: [
    quantity('length', 'L', 'input', (p) => p.length, { decimals: 0 }),
    quantity('width', 'l', 'input', (p) => p.width, { decimals: 0 }),
    quantity('area', 'A', 'target', (p) => M.rectangleArea(p.length, p.width), { decimals: 0, unit: 'area' }),
  ],
  target: 'area',
  hintCount: 3,
  // La relation cherchée. Jamais affichée avant la découverte (§23).
  solution: R.operation('*', R.variable('length'), R.variable('width')),
  // Ce que la manipulation finale explique (§21) : une ligne de L carrés,
  // répétée l sur l fois.
  explanation: 'rows',
});

// ─────────────────────────────────────────────────────────────────────────
// §8 — Le périmètre du rectangle
// ─────────────────────────────────────────────────────────────────────────

const rectanglePerimeter = defineInvestigation({
  id: 'rectangle-perimeter',
  stage: 'rectangle',
  concept: 'perimeter',
  params: [param('length', 1, 12, 1, 6), param('width', 1, 9, 1, 4)],
  unitGrid: true,
  traceBoundary: true,
  quantities: [
    quantity('length', 'L', 'input', (p) => p.length, { decimals: 0 }),
    quantity('width', 'l', 'input', (p) => p.width, { decimals: 0 }),
    quantity('perimeter', 'P', 'target', (p) => M.rectanglePerimeter(p.length, p.width), { decimals: 0 }),
  ],
  target: 'perimeter',
  hintCount: 3,
  solution: R.operation('*', R.number(2), R.operation('+', R.variable('length'), R.variable('width'))),
  // §8 : L + l + L + l est JUSTE aussi. L'élève peut s'arrêter là, et
  // l'instrument le félicite avant de lui proposer de raccourcir.
  alternateSolutions: [
    R.operation('+',
      R.operation('+', R.variable('length'), R.variable('width')),
      R.operation('+', R.variable('length'), R.variable('width'))),
    R.operation('+',
      R.operation('*', R.number(2), R.variable('length')),
      R.operation('*', R.number(2), R.variable('width'))),
  ],
  explanation: 'boundary',
});

// ─────────────────────────────────────────────────────────────────────────
// §9 — L'aire du triangle
// ─────────────────────────────────────────────────────────────────────────

const triangleArea = defineInvestigation({
  id: 'triangle-area',
  stage: 'triangle',
  concept: 'area',
  params: [param('base', 2, 12, 1, 6), param('height', 1, 9, 1, 4), param('apex', -6, 12, 1, 2)],
  unitGrid: true,
  quantities: [
    quantity('base', 'b', 'input', (p) => p.base, { decimals: 0 }),
    quantity('height', 'h', 'input', (p) => p.height, { decimals: 0 }),
    quantity('area', 'A', 'target', (p) => M.cleanNumber((p.base * p.height) / 2), { decimals: 2, unit: 'area' }),
  ],
  target: 'area',
  hintCount: 3,
  solution: R.operation('/', R.operation('*', R.variable('base'), R.variable('height')), R.number(2)),
  // §9 : le ½ ne se raconte pas, il se VOIT — deux triangles identiques
  // font le rectangle. C'est `mirror` qui pose le second.
  explanation: 'mirror',
  // Le sommet glisse le long de la parallèle à la base : l'aire ne bouge
  // pas. C'est l'invariant qui montre que seule la HAUTEUR compte.
  slideInvariant: true,
});

// ─────────────────────────────────────────────────────────────────────────
// §10 — La circonférence du cercle
// ─────────────────────────────────────────────────────────────────────────

const circleCircumference = defineInvestigation({
  id: 'circle-circumference',
  stage: 'circle',
  concept: 'circumference',
  params: [param('radius', 1, 8, 0.5, 2)],
  quantities: [
    quantity('diameter', 'd', 'input', (p) => M.cleanNumber(2 * p.radius), { decimals: 2 }),
    quantity('circumference', 'C', 'target', (p) => M.circleCircumference(p.radius), { decimals: 2 }),
    // La COLONNE qui fait tout le travail (§10) : le quotient reste stable.
    // Elle est `derived` : l'instrument la calcule, l'élève la lit.
    quantity('ratio', 'C ÷ d', 'derived', (p) => M.cleanNumber(M.circleCircumference(p.radius) / (2 * p.radius)), { decimals: 3, unit: 'none' }),
  ],
  target: 'circumference',
  hintCount: 3,
  solution: R.operation('*', R.constant('pi'), R.variable('diameter')),
  alternateSolutions: [],
  explanation: 'unroll',
  // La constante à NOMMER une fois qu'on l'a vue stable (§10).
  revealsConstant: 'pi',
});

// ─────────────────────────────────────────────────────────────────────────
// §11 — L'aire du disque
// ─────────────────────────────────────────────────────────────────────────

const circleArea = defineInvestigation({
  id: 'circle-area',
  stage: 'circle',
  concept: 'area',
  params: [param('radius', 1, 8, 0.5, 3), param('sectors', 4, 48, 2, 8)],
  quantities: [
    quantity('radius', 'r', 'input', (p) => p.radius, { decimals: 2 }),
    quantity('area', 'A', 'target', (p) => M.circleArea(p.radius), { decimals: 2, unit: 'area' }),
    quantity('ratio', 'A ÷ r²', 'derived', (p) => M.cleanNumber(M.circleArea(p.radius) / (p.radius * p.radius)), { decimals: 3, unit: 'none' }),
  ],
  target: 'area',
  hintCount: 3,
  solution: R.operation('*', R.constant('pi'), R.power(R.variable('radius'), 2)),
  explanation: 'sectors',
  revealsConstant: 'pi',
});

// ─────────────────────────────────────────────────────────────────────────
// §12 — Le volume du cube
// ─────────────────────────────────────────────────────────────────────────

const cubeVolume = defineInvestigation({
  id: 'cube-volume',
  stage: 'cuboid',
  concept: 'volume',
  params: [param('edge', 1, 7, 1, 3)],
  lockedCube: true,
  quantities: [
    quantity('edge', 'a', 'input', (p) => p.edge, { decimals: 0 }),
    quantity('perLayer', '—', 'derived', (p) => p.edge * p.edge, { decimals: 0 }),
    quantity('layers', '—', 'derived', (p) => p.edge, { decimals: 0 }),
    quantity('volume', 'V', 'target', (p) => M.cubeVolume(p.edge), { decimals: 0, unit: 'volume' }),
  ],
  target: 'volume',
  hintCount: 3,
  solution: R.power(R.variable('edge'), 3),
  alternateSolutions: [
    R.operation('*', R.operation('*', R.variable('edge'), R.variable('edge')), R.variable('edge')),
  ],
  explanation: 'layers',
});

// ─────────────────────────────────────────────────────────────────────────
// §13 — Le volume du pavé droit
// ─────────────────────────────────────────────────────────────────────────

const cuboidVolume = defineInvestigation({
  id: 'cuboid-volume',
  stage: 'cuboid',
  concept: 'volume',
  params: [param('length', 1, 7, 1, 4), param('width', 1, 7, 1, 3), param('height', 1, 7, 1, 2)],
  quantities: [
    quantity('length', 'L', 'input', (p) => p.length, { decimals: 0 }),
    quantity('width', 'l', 'input', (p) => p.width, { decimals: 0 }),
    quantity('height', 'h', 'input', (p) => p.height, { decimals: 0 }),
    quantity('perLayer', '—', 'derived', (p) => p.length * p.width, { decimals: 0 }),
    quantity('volume', 'V', 'target', (p) => M.cuboidVolume(p.length, p.width, p.height), { decimals: 0, unit: 'volume' }),
  ],
  target: 'volume',
  hintCount: 3,
  solution: R.operation('*', R.operation('*', R.variable('length'), R.variable('width')), R.variable('height')),
  explanation: 'layers',
});

// ─────────────────────────────────────────────────────────────────────────
// §14 — Les conversions d'unités
// ─────────────────────────────────────────────────────────────────────────

/**
 * L'enquête porte sur l'AIRE — « pourquoi 1 m² = 10 000 cm² » — et non sur
 * les trois dimensions à la fois.
 *
 * C'est une contrainte du constructeur de règles, et elle est SAINE : une
 * règle y est une relation FIXE entre des grandeurs, et « F = k^n » avec un
 * exposant variable n'en est pas une — l'élève ne peut pas poser un exposant
 * qui change. Vouloir couvrir n = 1, 2 et 3 dans une seule enquête
 * reviendrait à lui faire conjecturer trois relations sous un seul énoncé,
 * et l'instrument accepterait « k² » pour une observation en dimension 1 où
 * la mesure dit k. La découverte de §14 est bien celle du CARRÉ ; le cube
 * est la même idée d'un cran plus loin, et la manipulation `nesting` la
 * montre en volume une fois le carré trouvé.
 *
 * Le côté du carré varie (du dm au km) : c'est ce qui rend la relation
 * observable plutôt que récitée, puisque le facteur change avec lui.
 */
const unitConversion = defineInvestigation({
  id: 'unit-conversion',
  stage: 'segment',
  concept: 'conversion',
  // Le rang de l'unité de départ parmi m, dm, cm… : il FAIT varier le
  // facteur de longueur, donc le tableau a quelque chose à montrer.
  params: [param('scale', 1, 4, 1, 2)],
  quantities: [
    // k : combien de fois la petite unité entre dans la grande, en LONGUEUR.
    quantity('lengthFactor', 'k', 'input', (p) => SCALE_FACTORS[Math.round(p.scale)] ?? 10, { decimals: 0, unit: 'none' }),
    // Ce que l'élève COMPTE : les carrés unités qui pavent le grand carré.
    quantity('factor', 'F', 'target', (p) => {
      const k = SCALE_FACTORS[Math.round(p.scale)] ?? 10;

      return M.cleanNumber(k * k);
    }, { decimals: 0, unit: 'none' }),
  ],
  target: 'factor',
  hintCount: 3,
  // 1 m² = 100² cm² : le facteur des LONGUEURS, élevé au carré.
  solution: R.power(R.variable('lengthFactor'), 2),
  alternateSolutions: [
    R.operation('*', R.variable('lengthFactor'), R.variable('lengthFactor')),
  ],
  explanation: 'nesting',
  evidence: Object.freeze({ minObservations: 3, minDistinct: 3, requiresUnseenTest: true }),
});

/**
 * Les facteurs de longueur explorables : dm→cm, m→cm, m→mm, km→m.
 * Ils sont volontairement DIFFÉRENTS les uns des autres — un tableau où k
 * vaudrait toujours 100 ne laisserait rien découvrir.
 */
const SCALE_FACTORS = Object.freeze({ 1: 10, 2: 100, 3: 1000, 4: 1000 });

// ─────────────────────────────────────────────────────────────────────────
// §15 — La relation de Pythagore
// ─────────────────────────────────────────────────────────────────────────

const pythagoras = defineInvestigation({
  id: 'pythagoras',
  stage: 'triangle',
  concept: 'pythagoras',
  rightAngled: true,
  params: [param('side1', 1, 10, 1, 3), param('side2', 1, 10, 1, 4)],
  showSquares: true,
  quantities: [
    quantity('square1', 'a²', 'derived', (p) => M.cleanNumber(p.side1 * p.side1), { decimals: 2, unit: 'area' }),
    quantity('square2', 'b²', 'derived', (p) => M.cleanNumber(p.side2 * p.side2), { decimals: 2, unit: 'area' }),
    quantity('squareHyp', 'c²', 'target', (p) => M.cleanNumber(p.side1 * p.side1 + p.side2 * p.side2), { decimals: 2, unit: 'area' }),
    quantity('side1', 'a', 'input', (p) => p.side1, { decimals: 2 }),
    quantity('side2', 'b', 'input', (p) => p.side2, { decimals: 2 }),
    quantity('hypotenuse', 'c', 'derived', (p) => M.cleanNumber(Math.hypot(p.side1, p.side2)), { decimals: 3 }),
  ],
  target: 'squareHyp',
  hintCount: 3,
  // C'est bien la relation entre les AIRES des carrés que l'élève cherche.
  solution: R.operation('+', R.variable('square1'), R.variable('square2')),
  explanation: 'squares',
  // Le nom du théorème n'arrive qu'APRÈS (§15).
  namesTheorem: true,
});

// ─────────────────────────────────────────────────────────────────────────
// §16 — La somme des angles d'un triangle
// ─────────────────────────────────────────────────────────────────────────

const angleSum = defineInvestigation({
  id: 'triangle-angle-sum',
  stage: 'triangle',
  concept: 'angles',
  freeVertices: true,
  params: [param('base', 3, 12, 1, 7), param('height', 1, 9, 1, 4), param('apex', -6, 12, 1, 3)],
  showAngles: true,
  quantities: [
    quantity('angleA', 'Â', 'derived', (p) => triangleAnglesOf(p)[0], { decimals: 1, unit: 'angle' }),
    quantity('angleB', 'B̂', 'derived', (p) => triangleAnglesOf(p)[1], { decimals: 1, unit: 'angle' }),
    quantity('angleC', 'Ĉ', 'derived', (p) => triangleAnglesOf(p)[2], { decimals: 1, unit: 'angle' }),
    quantity('sum', 'S', 'target', (p) => {
      const [a, b, c] = triangleAnglesOf(p);

      return M.cleanNumber(a + b + c);
    }, { decimals: 1, unit: 'angle' }),
  ],
  target: 'sum',
  hintCount: 3,
  solution: R.operation('+', R.operation('+', R.variable('angleA'), R.variable('angleB')), R.variable('angleC')),
  // L'invariant : la somme ne dépend d'AUCUNE dimension. C'est une constante,
  // et c'est cela qui est remarquable.
  invariantValue: 180,
  explanation: 'tear',
  evidence: Object.freeze({ minObservations: 4, minDistinct: 3, requiresUnseenTest: true }),
});

/** Les sommets du triangle d'une enquête, depuis ses paramètres. */
export function triangleVertices(params) {
  const base = Number(params?.base) || 0;
  const height = Number(params?.height) || 0;
  const apex = Number.isFinite(Number(params?.apex)) ? Number(params.apex) : base / 2;

  return [{ x: 0, y: 0 }, { x: base, y: 0 }, { x: apex, y: height }];
}

function triangleAnglesOf(params) {
  const [a, b, c] = triangleVertices(params);

  return M.triangleAngles(a, b, c).map((angle) => (Number.isFinite(angle) ? angle : 0));
}

// ── Le catalogue ─────────────────────────────────────────────────────────

/** Les dix enquêtes, dans l'ordre du cahier (§5 → §16). */
export const INVESTIGATIONS = Object.freeze([
  rectangleArea,
  rectanglePerimeter,
  triangleArea,
  circleCircumference,
  circleArea,
  cubeVolume,
  cuboidVolume,
  unitConversion,
  pythagoras,
  angleSum,
]);

export const INVESTIGATION_IDS = Object.freeze(INVESTIGATIONS.map((investigation) => investigation.id));

/** L'enquête derrière un identifiant, ou `null`. */
export function getInvestigation(id) {
  return INVESTIGATIONS.find((investigation) => investigation.id === id) ?? null;
}

/** L'enquête d'ouverture : l'aire du rectangle, la plus élémentaire. */
export const DEFAULT_INVESTIGATION = 'rectangle-area';

/**
 * Les champs qu'une interface N'A PAS le droit de lire avant la découverte
 * (§23). `investigations.test.js` s'en sert pour vérifier qu'aucun libellé
 * ne trahit la formule.
 */
export function investigationSecretKeys() {
  return Object.freeze(['solution', 'alternateSolutions', 'invariantValue', 'revealsConstant']);
}

/** Les paramètres d'ouverture d'une enquête. */
export function initialParams(investigation) {
  const params = {};
  for (const entry of investigation?.params ?? []) params[entry.key] = entry.initial;

  return params;
}

/**
 * MESURE toutes les grandeurs d'une enquête sur un objet donné.
 *
 * C'est la seule porte entre les paramètres de l'objet et les nombres que
 * l'élève lit : le tableau, la règle et la vérification lisent tous ceci.
 *
 * @param {object} investigation
 * @param {object} params        les dimensions courantes
 * @param {number} precision     la graduation de l'instrument (0 = exact)
 */
export function measureAll(investigation, params, precision = 0) {
  const values = {};
  for (const entry of investigation?.quantities ?? []) {
    const raw = entry.measure(params);
    // Les grandeurs SANS unité (un quotient, un facteur, une dimension) ne
    // passent pas par la graduation d'une règle : arrondir C ÷ d au
    // millimètre n'aurait aucun sens.
    values[entry.key] = entry.unit === 'none' || entry.unit === 'angle'
      ? M.cleanNumber(raw)
      : M.readWithPrecision(raw, precision);
  }

  return values;
}

/** Les grandeurs qu'une enquête montre en colonnes, dans l'ordre du tableau. */
export function tableColumns(investigation) {
  const order = { input: 0, derived: 1, target: 2 };

  return [...(investigation?.quantities ?? [])]
    .filter((entry) => entry.symbol !== '—')
    .sort((a, b) => (order[a.role] ?? 1) - (order[b.role] ?? 1));
}

/** Les variables que le constructeur de règles propose pour une enquête. */
export function ruleVariablesFor(investigation) {
  return (investigation?.quantities ?? [])
    .filter((entry) => entry.key !== investigation.target && entry.symbol !== '—')
    .map((entry) => ({ key: entry.key, symbol: entry.symbol }));
}

/**
 * La règle proposée est-elle CELLE qu'on cherchait ?
 *
 * On compare par les valeurs (`sameRelation`), jamais par la forme de
 * l'arbre : un élève qui écrit `l × L` a trouvé la même règle que `L × l`,
 * et un élève qui écrit `2 × (L + l)` a trouvé la même que `L + l + L + l`.
 */
export function matchesSolution(investigation, rule) {
  if (!investigation || !R.isComplete(rule)) return false;
  const names = (investigation.quantities ?? []).map((entry) => entry.key);
  const candidates = [investigation.solution, ...(investigation.alternateSolutions ?? [])];

  return candidates.some((candidate) => R.sameRelation(candidate, rule, names));
}
