/**
 * The EVIDENCE of lesson `khawass-qawasim` — PURE. Which answers count (written format, first try, no help) and what
 * is sent is the kit's rule (`gameworld/kit/evidence.js`); the verdict of a claim is the kit's too (`kit/claims.js`, the
 * same rule as the server's). Here: the الكفاءة each key proves, and the CLAIM each kind of trainer answer makes.
 */
import { counts, createEvidence } from '../../../../../../common/gameworld/kit/evidence';

/** The الكفاءة each key proves (the codes of the lesson's `learningPoints`). */
const POINTS = { 'jam-wal-farq': 'P1', madaaf: 'P2', 'baqi-qisma': 'P3', burhan: 'P4' };
/** The evidence of this lesson. It has no real-world case yet: nothing is claimed from one. */
export const evidence = { ...createEvidence({ grade: '4am', points: POINTS }), caseEvidence: () => null };

/**
 * Evidence of a TRAINER answer, or null when it does not count.
 * ctx = { firstTry, helped } — helped: a model sheet or the rule was opened before this answer.
 */
export function trainerEvidence(q, value, ctx) {
  if (q.format !== 'exam' || !counts(ctx)) return null;
  const n = (k) => Number(value?.[k]);
  switch (q.kind) {
    case 'sumDiff':
      // the sum written as d × k: a product of two factors
      return { key: q.key, claim: { kind: 'pair', a: q.a + q.b, b: q.d, e: n('s') } };
    case 'multiple':
      return { key: q.key, claim: { kind: 'pair', a: q.a * q.n, b: q.d, e: n('k') } };
    case 'rest':
      // the Euclidean division he wrote: the server re-computes a = b × q + r with r < b
      return { key: q.key, claim: { kind: 'division', a: q.a, b: q.b, q: n('q'), r: n('r'), fits: n('r') === 0 } };
    // a proof written with letters, and « صحيح أم خطأ؟ علّل », are NOT evidence: no verdict re-computed from numbers
    default:
      return null;
  }
}
