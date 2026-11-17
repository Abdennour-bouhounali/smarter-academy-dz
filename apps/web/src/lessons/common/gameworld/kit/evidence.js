/**
 * WHICH GAME ANSWERS COUNT TOWARD « الكفاءات » (owner decision, 2026-11-15) — PURE, and it names no lesson.
 * Only an answer that looks like an exam answer is evidence: written format, FIRST try, in paper mode, with no help opened
 * before it (no rule reminder, no model sheet). Right or wrong, the first try is what is reported — later tries, the gate
 * dash, the story and every game-format question count for nothing. The SERVER re-computes the result from the numbers
 * (`claim`): the browser's own verdict is never trusted.
 *
 * The lesson gives (`createEvidence`): its grade and, per key (rule), the code of the الكفاءة it proves. It keeps for
 * itself WHAT a claim is and how it is verified: that is its mathematics (and the server's own copy of the rule).
 */

/** Does this answer count? ctx = { firstTry, helped } — helped: a model sheet or the rule was opened before it. */
export const counts = (ctx) => Boolean(ctx?.firstTry) && !ctx.helped;

export function createEvidence({ grade, points }) {
  /** The id of the الكفاءة a key proves, as the catalogue writes it — or null for a key that proves none. */
  const learningPointOf = (lessonId, key) => (points[key] ? `${grade}_${lessonId}_${points[key]}` : null);

  /** What is sent to the server for one answer that counts: POST /lessons/{lesson}/game-evidence (GameEvidenceController). */
  function payloadOf(lessonId, context, ev, attemptId) {
    const learningPoint = ev && learningPointOf(lessonId, ev.key);
    return learningPoint ? { attemptId, learningPoint, context, claim: ev.claim } : null;
  }

  return { learningPointOf, payloadOf };
}
