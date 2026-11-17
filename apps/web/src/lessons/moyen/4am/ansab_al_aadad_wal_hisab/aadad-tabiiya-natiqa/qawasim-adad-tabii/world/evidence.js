/**
 * The EVIDENCE of lesson `qawasim-adad-tabii` — PURE. Which answers count (written format, first try, no help) and what
 * is sent is the kit's rule (`gameworld/kit/evidence.js`); the verdict of a claim is the kit's too (`kit/claims.js`, the
 * same rule as the server's). Here: the الكفاءة each key proves, and the CLAIM each kind of trainer answer makes.
 */
import { counts, createEvidence } from '../../../../../../common/gameworld/kit/evidence';
import { READ, writtenList, writtenPairs } from './trainer';

/** The الكفاءة each key proves (the codes of the lesson's `learningPoints`). */
const POINTS = { 'jidaa-aamilayn': 'P1', 'qasim-rappel': 'P2', 'tariqa-qawasim': 'P3', 'qawaid-qisma': 'P4' };
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
    case 'pairs': {
      // every way of writing a as a product: all its divisors are on the sheet
      const list = writtenPairs(q, value).flat();
      return { key: q.key, claim: { kind: 'divisors', a: q.a, b: list.length, list } };
    }
    case 'show':
      return { key: q.key, claim: { kind: 'product', a: q.a, b: q.b, q: n('q'), other: n('x') } };
    case 'stop':
      return n('e') === n('d') + 1 ? { key: q.key, claim: { kind: 'stop', a: q.a, b: n('d') } } : null;
    case 'list': {
      const list = writtenList(q, value);
      return { key: q.key, claim: { kind: 'divisors', a: q.a, b: list.length, list } };
    }
    case 'rule':
      // the reading must be right too: a lucky verdict is not the rule
      return {
        key: q.key,
        claim: {
          kind: 'divisible',
          a: q.a,
          b: q.b,
          fits: n('v') === READ[q.b].of(q.a) ? Boolean(value?.fits) : !(q.a % q.b === 0),
        },
      };
    // « صحيح أم خطأ؟ علّل » is NOT evidence: its verdict cannot be re-computed from numbers
    default:
      return null;
  }
}
