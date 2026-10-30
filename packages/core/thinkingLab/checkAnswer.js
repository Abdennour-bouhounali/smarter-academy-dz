/**
 * « مختبر التفكير » — le jugement d'une réponse de défi (`answer.check`).
 *
 *   integer | rational | choice → DÉLÈGUE à l'évaluateur de la pratique
 *                                 (practice/answerEvaluator.js, miroir PHP AnswerEvaluator) ;
 *   number                      → lecture rationnelle (sinon expression sans variable) + tolérance ;
 *   expression                  → équivalence par évaluation (./expression.js).
 *
 * Les issues sont celles de la pratique (correct / equivalent_correct /
 * incorrect / syntax_error) : une saisie illisible n'est PAS une erreur et ne
 * compte pas comme tentative (THINKING_LAB.md §6.1).
 *
 * Erreurs déclarées (`mistakes[]`) : la première qui correspond donne son
 * indice (`mistakeIndex`) — le serveur en tire la réponse « ليس بعد … ».
 *   { value, scaleWith?, reply }          → égale à value (× scaleWith pour une expression) ;
 *   { value, outside: [lo, hi], at?, reply } → valeur ≤ lo ou ≥ hi au point `at`
 *                                            (`value` est alors un EXEMPLE, que le validateur refuse).
 *
 * Ce module sert au validateur de contenu et à l'oracle ; la note de l'élève est
 * donnée par le serveur (AnswerChecker.php, phase 1), jamais par le client.
 */
import { evaluateAnswer, OUTCOMES, isSuccessOutcome } from '../practice/answerEvaluator.js';
import { Rational } from '../practice/rational.js';
import { parseExpression, evaluateAst, equivalentExpressions, closeEnough, DEFAULTS } from './expression.js';

export const CHECKS = Object.freeze(['integer', 'number', 'rational', 'expression', 'choice']);

const verdict = (outcome, normalized = '', mistakeIndex = null) => ({
  outcome,
  correct: isSuccessOutcome(outcome),
  normalized,
  mistakeIndex,
});

/** Les options d'équivalence d'une réponse `expression`. */
export function expressionOptions(spec) {
  return {
    vars: spec.vars ?? [],
    samples: spec.samples ?? DEFAULTS.samples,
    relTol: spec.relTol ?? DEFAULTS.relTol,
    absTol: spec.absTol ?? DEFAULTS.absTol,
    domain: spec.domain ?? {},
    seed: spec.seed ?? DEFAULTS.seed,
  };
}

/** Valeur numérique d'une saisie (nombre, fraction, %, ou expression sans variable). */
function numericValue(raw, scope = {}, vars = []) {
  if (vars.length === 0) {
    const r = Rational.parse(raw);
    if (r) return r.n / r.d;
  }
  const parsed = parseExpression(raw, vars);
  if (!parsed.ok) return null;
  const v = evaluateAst(parsed.ast, scope);
  return Number.isNaN(v) ? null : v;
}

/** Une erreur « hors de [lo, hi] » : la valeur au point `at` est ≤ lo ou ≥ hi. */
function matchesRange(mistake, raw, spec) {
  const vars = spec.check === 'expression' ? spec.vars ?? [] : [];
  const v = numericValue(raw, mistake.at ?? {}, vars);
  if (v === null) return false;
  const [lo, hi] = mistake.outside;
  return v <= lo || v >= hi;
}

/** L'expression d'une erreur déclarée, telle que le validateur la soumet (× scaleWith). */
export function mistakeExpression(mistake) {
  return mistake.scaleWith ? `(${mistake.value})*(${mistake.scaleWith})` : String(mistake.value);
}

function findMistake(spec, raw, mistakes, sameValue) {
  // Les erreurs par VALEUR d'abord (plus précises), puis les plages.
  const byValue = mistakes.findIndex((m) => !m.outside && sameValue(m));
  if (byValue !== -1) return byValue;
  const byRange = mistakes.findIndex((m) => m.outside && matchesRange(m, raw, spec));
  return byRange === -1 ? null : byRange;
}

function checkPractice(spec, raw, mistakes) {
  const question = { id: spec.id ?? 'thinking-lab', misconceptionSignatures: [] };
  let answer;
  if (spec.check === 'choice') {
    question.answerType = 'choice';
    question.choices = (spec.choices ?? []).map((c) => ({ id: c.id, isCorrect: c.id === spec.value }));
    answer = { choiceId: typeof raw === 'object' && raw !== null ? raw.choiceId : raw };
  } else {
    question.answerType = 'rational';
    question.expectedAnswer = String(spec.value);
    if (spec.tolerance) question.evaluationPolicy = { tolerance: String(spec.tolerance) };
    answer = { value: raw };
  }
  const r = evaluateAnswer(answer, question);
  if (r.outcome === OUTCOMES.SYNTAX_ERROR || isSuccessOutcome(r.outcome)) return verdict(r.outcome, r.normalized);
  const sameValue = spec.check === 'choice'
    ? (m) => String(m.value) === String(answer.choiceId)
    : (m) => {
      const a = Rational.parse(m.value);
      const b = Rational.parse(raw);
      return Boolean(a && b && a.equals(b));
    };
  return verdict(OUTCOMES.INCORRECT, r.normalized, findMistake(spec, raw, mistakes, sameValue));
}

function checkNumber(spec, raw, mistakes) {
  const expected = numericValue(spec.value);
  if (expected === null) throw new Error(`answer.value illisible : ${spec.value}`);
  const given = numericValue(raw);
  if (given === null) return verdict(OUTCOMES.SYNTAX_ERROR, String(raw ?? ''));
  const relTol = spec.relTol ?? DEFAULTS.relTol;
  const absTol = spec.absTol ?? DEFAULTS.absTol;
  const normalized = String(given);
  if (closeEnough(given, expected, relTol, absTol)) return verdict(OUTCOMES.CORRECT, normalized);
  const sameValue = (m) => {
    const v = numericValue(m.value);
    return v !== null && closeEnough(given, v, relTol, absTol);
  };
  return verdict(OUTCOMES.INCORRECT, normalized, findMistake(spec, raw, mistakes, sameValue));
}

function checkExpression(spec, raw, mistakes) {
  const opts = expressionOptions(spec);
  const expected = parseExpression(spec.value, opts.vars);
  if (!expected.ok) throw new Error(`answer.value illisible (${expected.error}) : ${spec.value}`);
  const r = equivalentExpressions(raw, spec.value, opts);
  if (r.reason === 'syntax') return verdict(OUTCOMES.SYNTAX_ERROR, String(raw ?? ''));
  if (r.equivalent) {
    return verdict(r.normalized === expected.normalized ? OUTCOMES.CORRECT : OUTCOMES.EQUIVALENT_CORRECT, r.normalized);
  }
  const sameValue = (m) => equivalentExpressions(raw, mistakeExpression(m), opts).equivalent;
  return verdict(OUTCOMES.INCORRECT, r.normalized, findMistake(spec, raw, mistakes, sameValue));
}

/**
 * @param {{check: string, value: string|number, vars?: string[], choices?: {id:string}[]}} spec  le `answer` d'un défi (params déjà remplis)
 * @param {string|{choiceId:string}|null} raw  la saisie
 * @param {{mistakes?: object[]}} [options]
 * @returns {{outcome: string, correct: boolean, normalized: string, mistakeIndex: number|null}}
 */
export function checkAnswer(spec, raw, { mistakes = [] } = {}) {
  if (raw === null || raw === undefined || (typeof raw === 'string' && raw.trim() === '')) {
    return verdict(OUTCOMES.SYNTAX_ERROR, '');
  }
  switch (spec?.check) {
    case 'integer':
    case 'rational':
    case 'choice':
      return checkPractice(spec, raw, mistakes);
    case 'number':
      return checkNumber(spec, raw, mistakes);
    case 'expression':
      return checkExpression(spec, raw, mistakes);
    default:
      throw new Error(`answer.check inconnu : ${spec?.check}`);
  }
}

