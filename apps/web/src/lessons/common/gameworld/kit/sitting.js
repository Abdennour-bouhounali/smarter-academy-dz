/**
 * « الامتحان الأبيض » — the FRAME of an exam SITTING (PURE; it names no lesson): a real exam in three phases.
 *   read  the whole subject, a minute to read and underline — nothing can be answered yet;
 *   sit   silence: the student works on PAPER and copies only his final answers; NO verdict, no hint, no sound;
 *   back  the copy handed back: a mark per question (the marking scheme), the model copy, his own paper to check.
 * A subject is generated: no two sittings are alike. The ladder of « فضاء الامتحان » is the lesson's `levels`.
 *
 * The lesson gives (`createSittings`):
 *   levels  [{ n, title, minutes, plan: [[kind, tier], …] }] — from one exercise to a full short exam
 *   build   { [kind]: (rand, tier) => exercise } — { kind, title, points, statement, situation?, questions: [question] }
 *   points  { [kind]: the points of an exercise of that kind } — the same number its builder writes
 *   mark    (question, answer) => points, by its marking scheme
 *   model, scheme, evidenceOf   per question: the lines of the model copy, what the corrector looks for on the paper,
 *                               the claim sent to the server (or null) — its mathematics, carried to the screen as they are

 *
 * A question is answered in ONE of two shapes:
 *   `sentence` — words around ONE choice `{ choice: [{ value, text }] }`: the answer is the value chosen (a string);
 *   `tokens`   — signs and numbers around boxes built with `slot`: the answer is { [slot]: value }.
 */
export const PASS = 0.8;
const ORDINAL = ['الأوّل', 'الثاني', 'الثالث', 'الرابع'];

/** A box to fill in a line of tokens: its name in the answer, its label for a screen reader, its width in digits. */
export const slot = (name, label, w) => ({ slot: name, label, w });

/** Stars of a sitting: none under 80 % of the points; then 1, 2 (≥ 90 %), 3 (a full paper). */
export const sittingStars = (m, total) => (m >= total ? 3 : m >= total * 0.9 ? 2 : m >= total * PASS ? 1 : 0);

export const allQuestions = (subject) =>
  subject.exercises.flatMap((e) => e.questions.map((q) => ({ ...q, exercise: e.id })));

/** Is the answer complete enough to be read (every box filled)? An empty answer earns 0 and is shown as « لم تُجب ». */
export function answered(q, v) {
  if (v == null) return false;
  if (q.sentence) return typeof v === 'string' && v !== '';
  return (q.tokens ?? []).filter((t) => typeof t === 'object').every((t) => v[t.slot] !== '' && v[t.slot] != null);
}

/** Has the student written ANYTHING for this question (one box is enough)? */
export function touched(q, v) {
  if (v == null) return false;
  if (typeof v === 'string') return v !== '';
  return Object.values(v).some((x) => x !== '' && x != null);
}

/**
 * The exercises left completely empty, as indexes — except the one on screen, which the student sees. A student who hands in
 * with such an exercise has most likely FORGOTTEN it (one exercise per page): the sitting shows it to him once before accepting.
 */
export const forgotten = (subject, answers, onScreen = -1) =>
  subject.exercises
    .map((e, i) => i)
    .filter((i) => i !== onScreen && subject.exercises[i].questions.every((q) => !touched(q, answers[q.id])));

/** Where the student should be: the share of the points he should have covered when `elapsed` of `total` seconds are gone. */
export const pace = (elapsed, total) => Math.max(0, Math.min(1, elapsed / total));

/** The appreciation written on the copy. */
export const appreciation = (m, total) =>
  m >= total * 0.9
    ? 'ممتاز'
    : m >= total * 0.7
      ? 'جيّد'
      : m >= total * 0.5
        ? 'متوسّط: راجع أخطاءك'
        : 'يحتاج إلى عمل: لا تيأس';

export function createSittings({ levels, build, mark, points, model, scheme, evidenceOf }) {
  /** The points of a whole level, known before any subject is generated: the ladder shows them on each step. */
  const levelPoints = (level) => level.plan.reduce((sum, [kind]) => sum + points[kind], 0);

  /**
   * The subject of a sitting at `level` (1 … levels.length). ADAPTED to the student: `weak` = the kinds of exercise where he
   * lost points at his last try of this level — they come FIRST on the new sheet (fresh mind), with new numbers (a similar
   * sheet, never the same).
   */
  function makeSubject(rand, level = levels.length - 1, weak = []) {
    const L = levels[Math.max(1, Math.min(levels.length, level)) - 1];
    const plan = [...L.plan].sort((x, y) => (weak.includes(y[0]) ? 1 : 0) - (weak.includes(x[0]) ? 1 : 0));
    const exercises = plan.map(([kind, tier], i) => {
      const e = build[kind](rand, tier);
      const id = `e${i + 1}`;
      return {
        ...e,
        id,
        title: `التمرين ${ORDINAL[i]}${e.situation ? ' (وضعيّة)' : ''}`,
        topic: e.title,
        focus: weak.includes(kind),
        questions: e.questions.map((q, k) => ({ ...q, id: `${id}q${k + 1}` })),
      };
    });
    return {
      level: L.n,
      minutes: L.minutes,
      total: exercises.reduce((t, e) => t + e.points, 0),
      title: `امتحان أبيض — الدرجة ${L.n}`,
      lesson: L.title,
      exercises,
    };
  }

  /** The kinds of exercise where points were lost: what the next sheet of this level will put first. */
  const weakKinds = (subject, answers) =>
    subject.exercises.filter((e) => e.questions.some((q) => mark(q, answers[q.id]) < q.points)).map((e) => e.kind);

  const totalMark = (subject, answers) => allQuestions(subject).reduce((sum, q) => sum + mark(q, answers[q.id]), 0);

  return { levels, levelPoints, makeSubject, weakKinds, totalMark, mark, model, scheme, evidenceOf };
}
