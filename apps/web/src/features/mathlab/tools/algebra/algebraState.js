/**
 * L'ÉTAT du مختبر الجبر — logique pure, sans React.
 *
 *     data = {
 *       source:  '2x + 3 = 11',     // la saisie d'origine, telle qu'écrite
 *       steps:   [ { equation, operation | null, flipped } , … ],
 *       cursor:  number,            // le pas AFFICHÉ — d'où viennent تراجع / إعادة
 *       showSolution: boolean,
 *       parameters:   { a, b, c } | null,   // le panneau ax + b = c, s'il est ouvert
 *       numberLine:   { center, span }      // la droite graduée d'une inégalité
 *     }
 *
 * `steps[0]` est l'équation de départ (operation: null) ; chaque opération
 * empile un pas. Le document ne garde donc pas un état courant mais un
 * CHEMIN — l'historique de §21 et l'annulation de §22 sont le même objet, et
 * « تراجع » n'est qu'un curseur qui recule. Refaire une opération après un
 * retour en arrière coupe la branche abandonnée, comme partout ailleurs.
 *
 * Un rationnel est stocké `{n, d}` : du JSON pur, relisible sans code.
 * Les bornes (MAX_STEPS, la portée de la droite) tiennent le document sous
 * le plafond d'octets du serveur (MathLabTools.php).
 *
 * ALGEBRA_SCHEMA_VERSION est la version de CE format.
 */

import * as R from './rational.js';
import { parseEquation, isRelation, sameEquation, equationToText } from './equation.js';

export const ALGEBRA_SCHEMA_VERSION = 1;

/** Un exercice de quatrième tient en quelques pas ; au-delà, on oublie les plus anciens. */
export const MAX_STEPS = 60;

export const DEFAULT_SOURCE = '2x + 3 = 11';

export const OPERATION_KINDS = Object.freeze(['add', 'subtract', 'multiply', 'divide']);

/** La droite graduée : une fenêtre centrée, jamais dégénérée. */
export const NUMBER_LINE_MIN_SPAN = 2;
export const NUMBER_LINE_MAX_SPAN = 200;

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/** Un `{n, d}` stocké → un rationnel sûr, ou null. */
export function normalizeRational(raw) {
  if (!isPlainObject(raw)) return null;
  const { n, d } = raw;
  if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) return null;
  if (Math.abs(n) > 1e12 || Math.abs(d) > 1e12) return null;
  try {
    return R.makeRational(n, d);
  } catch {
    return null;
  }
}

function normalizeForm(raw) {
  if (!isPlainObject(raw)) return null;
  const a = normalizeRational(raw.a);
  const b = normalizeRational(raw.b);
  if (!a || !b) return null;

  return { a, b };
}

/** Une équation stockée → sûre, ou null. */
export function normalizeEquation(raw) {
  if (!isPlainObject(raw)) return null;
  const left = normalizeForm(raw.left);
  const right = normalizeForm(raw.right);
  if (!left || !right || !isRelation(raw.relation)) return null;

  return { left, right, relation: raw.relation };
}

function normalizeOperation(raw) {
  if (!isPlainObject(raw)) return null;
  if (!OPERATION_KINDS.includes(raw.kind)) return null;
  const value = normalizeRational(raw.value);
  if (!value) return null;
  if ((raw.kind === 'multiply' || raw.kind === 'divide') && R.isZero(value)) return null;

  return { kind: raw.kind, value };
}

function normalizeNumberLine(raw) {
  const source = isPlainObject(raw) ? raw : {};
  const center = Number.isFinite(source.center) ? source.center : 0;
  const span = Number.isFinite(source.span) ? source.span : 10;

  return {
    center: Math.max(-1e6, Math.min(1e6, Math.round(center * 1000) / 1000)),
    span: Math.max(NUMBER_LINE_MIN_SPAN, Math.min(NUMBER_LINE_MAX_SPAN, Math.round(span * 1000) / 1000)),
  };
}

/**
 * Le panneau de paramètres (`a·x + b = c`) : trois entiers de manuel, ou
 * null quand le panneau est fermé. `a = 0` effacerait l'inconnue — refusé.
 */
export function normalizeParameters(raw) {
  if (!isPlainObject(raw)) return null;
  const read = (value, fallback) => (Number.isInteger(value) && Math.abs(value) <= 99 ? value : fallback);
  const a = read(raw.a, 2) || 2;

  return { a, b: read(raw.b, 3), c: read(raw.c, 11) };
}

/**
 * N'importe quel `data` → l'état V1 complet et sûr. Un pas illisible
 * interrompt la relecture : on garde le chemin jusqu'à lui, jamais un
 * historique troué qui ne raconterait plus rien.
 */
export function normalizeAlgebraData(raw) {
  const source = isPlainObject(raw) ? raw : {};
  const steps = [];

  if (Array.isArray(source.steps)) {
    for (const rawStep of source.steps.slice(0, MAX_STEPS)) {
      const equation = normalizeEquation(rawStep?.equation);
      if (!equation) break;
      const operation = steps.length === 0 ? null : normalizeOperation(rawStep?.operation);
      if (steps.length > 0 && !operation) break;
      steps.push({ equation, operation, flipped: rawStep?.flipped === true });
    }
  }

  if (steps.length === 0) {
    const parsed = parseEquation(typeof source.source === 'string' && source.source.trim() ? source.source : DEFAULT_SOURCE);
    const fallback = parsed.ok ? parsed.equation : parseEquation(DEFAULT_SOURCE).equation;
    steps.push({ equation: fallback, operation: null, flipped: false });
  }

  const cursor = Number.isInteger(source.cursor) ? Math.max(0, Math.min(steps.length - 1, source.cursor)) : steps.length - 1;

  return {
    source: typeof source.source === 'string' && source.source.trim() ? source.source.slice(0, 200) : equationToText(steps[0].equation),
    steps,
    cursor,
    showSolution: source.showSolution === true,
    parameters: normalizeParameters(source.parameters),
    numberLine: normalizeNumberLine(source.numberLine),
  };
}

/**
 * L'état d'un document neuf. Une leçon (openMathLab.js) peut l'amorcer avec
 * `{ equation: '3x - 5 = 16' }` ; une saisie illisible retombe sur
 * l'équation par défaut plutôt que d'ouvrir un document vide.
 */
export function createAlgebraData(seed = undefined) {
  const wanted = isPlainObject(seed) && typeof seed.equation === 'string' ? seed.equation : DEFAULT_SOURCE;
  const parsed = parseEquation(wanted);
  const source = parsed.ok ? wanted : DEFAULT_SOURCE;

  return normalizeAlgebraData({
    source,
    showSolution: false,
    parameters: isPlainObject(seed) && seed.parameters === true ? { a: 2, b: 3, c: 11 } : null,
  });
}

/** Le pas affiché. */
export function currentStep(data) {
  return data.steps[data.cursor] ?? data.steps[data.steps.length - 1];
}

export function currentEquation(data) {
  return currentStep(data).equation;
}

export function canUndo(data) { return data.cursor > 0; }
export function canRedo(data) { return data.cursor < data.steps.length - 1; }

export function undo(data) {
  return canUndo(data) ? { ...data, cursor: data.cursor - 1 } : data;
}

export function redo(data) {
  return canRedo(data) ? { ...data, cursor: data.cursor + 1 } : data;
}

/**
 * Empile un pas APRÈS le pas courant : ce qui suivait est abandonné (on a
 * repris la main à cet endroit). Un pas qui ne change rien — ajouter 0,
 * multiplier par 1 — n'est pas empilé : l'historique ne raconterait rien.
 */
export function pushStep(data, equation, operation, flipped = false) {
  const kept = data.steps.slice(0, data.cursor + 1);
  if (sameEquation(kept[kept.length - 1]?.equation, equation)) return data;
  const steps = [...kept, { equation, operation, flipped }];
  const overflow = Math.max(0, steps.length - MAX_STEPS);
  const trimmed = steps.slice(overflow);

  return { ...data, steps: trimmed, cursor: trimmed.length - 1 };
}

/**
 * Repart d'une NOUVELLE équation : l'historique précédent n'a plus de sens,
 * il est remplacé. C'est ce que font « استكشاف », « معادلة جديدة » et le
 * panneau de paramètres.
 */
export function resetTo(data, equation, source) {
  return {
    ...data,
    source: typeof source === 'string' ? source.slice(0, 200) : equationToText(equation),
    steps: [{ equation, operation: null, flipped: false }],
    cursor: 0,
    showSolution: false,
  };
}
