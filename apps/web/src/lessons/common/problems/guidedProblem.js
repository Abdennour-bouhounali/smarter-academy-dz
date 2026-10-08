/**
 * La LOGIQUE d'une مسألة guidée (GuidedProblem.jsx) — pure, sans React, lue
 * aussi par scripts/validate-lessons.mjs.
 *
 * Une مسألة est un exercice COMPLET « comme au امتحان » : un énoncé de
 * situation réelle, plusieurs questions numérotées (1), 2), 3)…), et pour
 * chacune un chemin guidé de sous-étapes :
 *
 *   sort      أستخرج المعطيات   InfoSorter sur `problem.data` (partie 1 seulement)
 *   choice    أترجم / أستنتج    TapQuestion (`role`: translate | conclude)
 *   numeric   أحسب / الجواب     NumericQuestion (`role`: compute | answer)
 *   batch     الجواب             BatchChoiceQuestion — plusieurs lignes à compléter
 *                                (ex. « عبّر بأربع صيغ » : les quatre phrases)
 *   solution  أحرّر الحلّ        WrittenAnswer : l'élève RÉDIGE, puis découvre la
 *                                rédaction modèle ligne par ligne (`lines`)
 *
 * CHAQUE DEMANDE A SA RÉPONSE (règle du propriétaire, 2026-10-06 : « deux
 * questions, une seule saisie » est un défaut). Une partie déclare ses
 * demandes dans `asks` — une entrée par « ؟ » et par impératif
 * بيّن / احسب / استنتج / عبّر / عيّن de `question` (au moins autant que
 * `demandsOf(question)`). Une sous-étape RÉPOND à la demande k en portant
 * `ask: k` ; seules peuvent répondre : `numeric` de rôle `answer`, `choice` de
 * rôle `conclude`, `batch` et `solution`. Chaque demande doit avoir au moins
 * une réponse qui ne soit pas la seule rédaction (une valeur saisie ou une
 * conclusion choisie) — la rédaction s'y AJOUTE. Une étape de raisonnement
 * (interpréter un reste…) ne porte pas d'`ask` et ne compte pas.
 *
 * Une sous-étape est FAITE dès qu'on y a RÉPONDU — juste ou faux (contrat non
 * bloquant, LESSON_CONTRACT.md) — et la suivante s'ouvre. Aucune réponse n'est
 * une preuve de maîtrise : le module est `practice_lab`, jamais d'`assessment`.
 *
 * Voir docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
 */

import { validateStatementFigure } from '../components/statementFigure.js';

/** Les props de CoordPlane qu'un `problem.visual` peut porter — la même liste fermée que la pratique
 *  (scripts/validate-exercises.mjs › COORDPLANE_PROPS) : une faute de frappe rendrait un plan vide. */
const COORDPLANE_PROPS = new Set([
  'range', 'unit', 'unitY', 'step', 'points', 'segments', 'polygons', 'arrows',
  'guides', 'ghost', 'target', 'overlay', 'showGrid', 'axisLabels', 'size',
  'ariaLabel', 'caption', 'functions', 'curves', 'cursor', 'readGuides',
  'staircase', 'intercept', 'highlightIntervals', 'xStep', 'yStep', 'labelEvery',
  'frozen', 'disabled',
]);
const MAX_PLOT_PX = 460;
const DEFAULT_UNIT = 34;

/** Les renvois d'un énoncé à un support (« مربّع الشكل » = de forme carrée, n'en est pas un). */
export const SUPPORT_REFERENCE = /في الشكل|الشكل المقابل|الشكل التالي|الجدول المقابل|في الجدول|الجدول التالي|الجدول الآتي|التمثيل البياني المقابل|في التمثيل البياني|على التمثيل البياني|بقراءة بيانية|المعلم المقابل/;

export const SUBSTEP_KINDS = ['sort', 'choice', 'numeric', 'batch', 'solution'];
export const SUBSTEP_ROLES = {
  sort: ['extract'],
  choice: ['translate', 'conclude'],
  numeric: ['compute', 'answer'],
  batch: ['answer'],
  solution: ['written'],
};

/** Le rôle affiché d'une sous-étape (par défaut, celui de son type). */
export const substepRole = (step) => step.role ?? SUBSTEP_ROLES[step.kind]?.[0];

/** Les verbes de consigne qui sont une demande (avec la شدّة : « بين » seul est la préposition). */
const DEMAND_VERBS = /(^|[\s،.؛:])(بيّن|احسب|استنتج|عبّر|عيّن)(?=[\s،.؛:]|$)/g;

/** Nombre de demandes d'une question : ses « ؟ » et ses impératifs de consigne. */
export function demandsOf(question = '') {
  return (question.match(/؟/g) ?? []).length + (question.match(DEMAND_VERBS) ?? []).length;
}

/** Une sous-étape PEUT répondre à une demande (porter `ask`). */
const canAnswer = (s) => (s.kind === 'numeric' && s.role === 'answer') || (s.kind === 'choice' && s.role === 'conclude') || s.kind === 'batch' || s.kind === 'solution';

/**
 * Les erreurs de contrat d'une مسألة (tableau vide = conforme).
 * @param {object} problem
 * @returns {string[]}
 */
export function validateProblem(problem) {
  const errors = [];
  const at = (msg) => errors.push(`${problem?.id ?? '?'}: ${msg}`);
  if (!problem || typeof problem !== 'object') return ['problem: not an object'];
  if (!problem.id) at('missing id');
  if (!problem.title) at('missing title');
  if (!problem.statement) at('missing statement');
  if (problem.source?.type !== 'platform_addition' && problem.source?.type !== 'textbook') at('source must be a textbook src() or an addition()');
  const parts = problem.parts ?? [];
  if (parts.length < 2) at(`needs at least 2 parts (exam style), has ${parts.length}`);

  // Le support de l'énoncé (facultatif) : figure GeoFigure / SpaceFigure, repère CoordPlane, tableau.
  if (problem.figure != null) {
    const figErrors = validateStatementFigure(problem.figure);
    for (const e of figErrors) at(`figure: ${e}`);
  }
  // Un énoncé qui RENVOIE à un support le montre (règle du propriétaire : jamais « الشكل المقابل » sans figure).
  const texts = [problem.statement, ...parts.map((pt) => pt.question)].join(' ');
  if (SUPPORT_REFERENCE.test(texts) && !problem.figure && !problem.visual && !problem.table) {
    at('the statement refers to a figure / table / graph (« في الشكل », « الجدول المقابل », « بقراءة بيانية »…) but the problem has no figure, visual or table');
  }
  if (problem.visual != null) {
    const v = problem.visual;
    if (typeof v !== 'object' || Array.isArray(v)) at('visual must be an object of CoordPlane props');
    else {
      for (const k of Object.keys(v)) if (!COORDPLANE_PROPS.has(k)) at(`visual.${k} is not a CoordPlane prop`);
      if (v.range) {
        const unit = v.unit ?? DEFAULT_UNIT;
        const w = (v.range.xMax - v.range.xMin) * unit;
        const h = (v.range.yMax - v.range.yMin) * (v.unitY ?? unit);
        if (w > MAX_PLOT_PX || h > MAX_PLOT_PX) at(`visual is ${Math.round(w)}×${Math.round(h)} px (max ${MAX_PLOT_PX}): set unit / unitY`);
      }
    }
  }
  if (problem.table != null) {
    const { head, rows } = problem.table;
    if (!Array.isArray(head) || head.length < 2) at('table: head needs ≥ 2 cells');
    else if (!Array.isArray(rows) || rows.length < 1) at('table: needs ≥ 1 row');
    else rows.forEach((r, k) => { if (!Array.isArray(r) || r.length !== head.length) at(`table: row ${k + 1} must have ${head.length} cells`); });
  }

  parts.forEach((part, p) => {
    const where = `part ${p + 1}`;
    if (!part.question) at(`${where}: missing question`);
    const steps = part.steps ?? [];
    if (steps.length < 2) at(`${where}: needs at least 2 sub-steps`);

    // Les demandes, déclarées et couvertes.
    const asks = part.asks ?? [];
    const demands = Math.max(1, demandsOf(part.question));
    if (!Array.isArray(asks) || asks.length < demands) {
      at(`${where}: the question makes ${demands} demand(s) (؟ / بيّن / احسب / استنتج / عبّر / عيّن) but declares ${asks.length ?? 0} in 'asks'`);
    }
    const answeredBy = asks.map(() => []);

    steps.forEach((s, i) => {
      const w = `${where} step ${i + 1}`;
      if (!SUBSTEP_KINDS.includes(s.kind)) { at(`${w}: unknown kind '${s.kind}'`); return; }
      if (s.role && !SUBSTEP_ROLES[s.kind].includes(s.role)) at(`${w}: role '${s.role}' is not allowed for '${s.kind}'`);
      if (s.ask != null) {
        if (!canAnswer(s)) at(`${w}: only numeric 'answer', choice 'conclude', batch or solution steps may carry 'ask'`);
        else if (!Number.isInteger(s.ask) || s.ask < 0 || s.ask >= asks.length) at(`${w}: ask ${s.ask} is not one of the part's asks`);
        else answeredBy[s.ask].push(s.kind);
      } else if (s.kind === 'numeric' && s.role === 'answer') {
        at(`${w}: a numeric 'answer' must say which ask it answers ('ask')`);
      }
      if (s.kind === 'sort') {
        if (p !== 0) at(`${w}: data sorting belongs to part 1`);
        const data = problem.data ?? [];
        if (!data.some((d) => d.useful) || !data.some((d) => !d.useful)) at(`${w}: data needs useful AND useless items`);
      }
      if (s.kind === 'choice') {
        if (!Array.isArray(s.options) || s.options.length < 2) at(`${w}: needs ≥ 2 options`);
        else if (!Number.isInteger(s.correct) || s.correct < 0 || s.correct >= s.options.length) at(`${w}: correct out of range`);
      }
      if (s.kind === 'numeric' && typeof s.expected !== 'number') at(`${w}: expected must be a number`);
      if (s.kind === 'batch') {
        if (!Array.isArray(s.rows) || s.rows.length < 2) at(`${w}: batch needs ≥ 2 rows`);
        else s.rows.forEach((r, k) => {
          if (!Array.isArray(r.options) || r.options.length < 2 || !Number.isInteger(r.correct) || r.correct < 0 || r.correct >= r.options.length) at(`${w} row ${k + 1}: needs ≥ 2 options and a correct index in range`);
        });
      }
    });

    answeredBy.forEach((kinds, k) => {
      if (!kinds.some((kind) => kind !== 'solution')) at(`${where}: ask ${k + 1} « ${asks[k]} » has no answer step of its own (a value entered or a conclusion chosen)`);
    });

    const last = steps[steps.length - 1];
    // La rédaction modèle se révèle ligne à ligne : au moins 2 lignes.
    if (last?.kind !== 'solution') at(`${where}: must end with a 'solution' step`);
    else if (!Array.isArray(last.lines) || last.lines.length < 2) at(`${where}: written solution needs ≥ 2 lines`);
  });
  return errors;
}

/** Progression : nombre de sous-étapes faites par partie. */
export const initialProgress = (problem) => problem.parts.map(() => 0);

/** Marque la sous-étape `stepIdx` de la partie `partIdx` comme faite (monotone). */
export function completeSubstep(progress, partIdx, stepIdx) {
  if ((progress[partIdx] ?? 0) > stepIdx) return progress;
  const next = progress.slice();
  next[partIdx] = stepIdx + 1;
  return next;
}

export const isPartDone = (progress, problem, partIdx) => (progress[partIdx] ?? 0) >= problem.parts[partIdx].steps.length;
