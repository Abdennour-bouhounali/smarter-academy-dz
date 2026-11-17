/**
 * « تدرّب » inside « خريطة المعارف » — the FRAME of the trainer that opens ON a card (PURE; it names no lesson).
 *
 * A session is six questions on the point of the card, in TWO FORMATS that alternate and drift toward the exam:
 *   game — the quick formats of the games: tap the right gate, true / false in one tap (small numbers, mental arithmetic);
 *   exam — the written formats of a real exam sheet (paper numbers, the answer typed in its own shape).
 * The order of a session is game, game, exam, game, exam, exam: the student meets the exam wording early, and ends on it.
 *
 * The lesson gives (`createTrainer`):
 *   kinds     { [kind]: (rand, format, ...args) => question } — a question is DATA: { format, kind, key, prompt, … }
 *   plans     { [plan]: [[kind, ...args] × 6] } — what a session asks, slot by slot of SESSION
 *   planOf    { [cardId]: plan } — which plan a card of the lesson's mind map trains
 *   fallback  the plan of a card that names none
 * and keeps for itself how an answer is judged (`check`), its solution and its one-line label: they are its mathematics.
 */
export const SESSION = ['game', 'game', 'exam', 'game', 'exam', 'exam'];

/** Stars of a session: the questions right at the FIRST try. */
export const sessionStars = (firstTry) => (firstTry >= 6 ? 3 : firstTry >= 4 ? 2 : firstTry >= 2 ? 1 : 0);

export function createTrainer({ kinds, plans, planOf, fallback }) {
  /** The six questions of a session on card `nodeId`. */
  function makeSession(rand, nodeId) {
    const plan = plans[planOf[nodeId] ?? fallback];
    return SESSION.map((format, i) => {
      const [kind, ...args] = plan[i];
      return kinds[kind](rand, format, ...args);
    });
  }
  return { makeSession };
}
