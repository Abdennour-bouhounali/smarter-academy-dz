/**
 * The EVIDENCE of lesson `qasim-adad-tabii` — PURE. Which answers count (written format, first try, no help) and what is
 * sent is the kit's rule (`gameworld/kit/evidence.js`). Here: the الكفاءة each key proves, the CLAIM each kind of answer
 * makes about a Euclidean division, and `verify` — the verdict of a claim from its numbers alone, the same rule the
 * server applies (it never trusts the browser's verdict).
 */
import { counts, createEvidence } from '../../../../../../common/gameworld/kit/evidence';

/** The الكفاءة each key proves (the codes of the lesson's `learningPoints`). */
const POINTS = { 'qasim-baqi': 'P1', 'qasim-jidaa': 'P2', 'siyagh-mutakafia': 'P3', 'wahid-wa-nafsuh': 'P4' };
export const { payloadOf } = createEvidence({ grade: '4am', points: POINTS });

/** The calculation steps of the real cases that prove a learning point (an invoice or a sum proves arithmetic, not the lesson). */
const STEP_KEY = {
  'count.capacity': 'qasim-jidaa',
  'cost.first': 'qasim-baqi',
  'cost.second': 'qasim-baqi',
  'profit.small': 'qasim-jidaa',
  'profit.big': 'qasim-jidaa',
  'trip.trucks': 'qasim-baqi',
  'share.each': 'qasim-baqi',
  'tiling.boxes': 'qasim-baqi',
};

/**
 * Evidence of a TRAINER answer, or null when it does not count.
 * ctx = { firstTry, helped } — helped: a model sheet or the rule was opened before this answer.
 */
export function trainerEvidence(q, value, ctx) {
  if (q.format !== 'exam' || !counts(ctx)) return null;
  const n = (k) => Number(value?.[k]);
  switch (q.kind) {
    case 'division':
      return {
        key: q.key,
        claim: { kind: 'division', a: q.a, b: q.b, q: n('q'), r: n('r'), fits: Boolean(value?.fits) },
      };
    case 'show':
      return { key: q.key, claim: { kind: 'product', a: q.a, b: q.b, q: n('q'), other: n('x') } };
    case 'complete':
      return { key: q.key, claim: { kind: 'phrase', a: q.a, b: q.b, first: q.x, phrase: String(value ?? '') } };
    case 'two':
      return { key: q.key, claim: { kind: 'sure', a: q.a, x: n('x'), y: n('y') } };
    // « صحيح أم خطأ؟ علّل » is NOT evidence: its verdict cannot be re-computed from numbers, so the server could only trust the browser
    default:
      return null;
  }
}

/** Evidence of a calculation STEP of a real case, or null. Same rule: first try, no help before it. */
export function caseEvidence(order, stepIndex, value, ctx) {
  const step = order.steps[stepIndex];
  const key = STEP_KEY[`${order.kind}.${step.id}`];
  if (!key || step.type !== 'number' || !step.div || !counts(ctx)) return null;
  const [a, b] = step.div;
  const n = (k) => (value?.[k] == null ? null : Number(value[k]));
  // what the student wrote, as a claim about the Euclidean division of a by b
  if (step.id === 'trucks' || step.id === 'boxes') return { key, claim: { kind: 'containers', a, b, count: n('x') } };
  if (step.id === 'capacity') return { key, claim: { kind: 'product', a, b: n('x'), q: b, other: b } };
  return { key, claim: { kind: 'division', a, b, q: n('q'), r: n('r') ?? 0, fits: (n('r') ?? 0) === 0 } };
}

/**
 * The verdict of a claim, from its numbers alone — the SAME rule the server applies (one shared fixture, evidence.test.js).
 */
export function verify(claim) {
  const int = (x) => Number.isInteger(x) && x >= 0;
  const c = claim;
  switch (c.kind) {
    case 'division':
      return int(c.q) && int(c.r) && c.b > 0 && c.b * c.q + c.r === c.a && c.r < c.b && c.fits === (c.r === 0);
    case 'product':
      return (
        int(c.q) &&
        int(c.b) &&
        c.b > 0 &&
        c.b * c.q === c.a &&
        int(c.other) &&
        c.other > 0 &&
        c.a % c.other === 0 &&
        (c.other !== c.b || c.b === c.q)
      );
    case 'phrase': {
      const small = Math.min(c.a, c.b);
      const divisorFirst = c.first === small;
      return ['qasim', 'yaqsim'].includes(c.phrase)
        ? divisorFirst
        : ['mudaaf', 'yaqbal'].includes(c.phrase)
          ? !divisorFirst
          : false;
    }
    case 'sure':
      return new Set([c.x, c.y]).size === 2 && [c.x, c.y].includes(1) && [c.x, c.y].includes(c.a);
    case 'containers':
      return int(c.count) && c.b > 0 && c.count === Math.ceil(c.a / c.b);
    default:
      return false;
  }
}
