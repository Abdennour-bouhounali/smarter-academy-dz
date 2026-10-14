import { describe, it, expect } from 'vitest';
import { validateProblem } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

const dm = (a, b) => ({ q: Math.floor(a / b), r: a % b });
const expectedOf = (id, part) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === 'numeric').map((s) => s.expected);

describe('les مسائل du درس « القسمة الإقليدية »', () => {
  it('respect the GuidedProblem contract', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
  });

  it('match their modules (5, 6, 7 — track problem, practice_lab, before the test)', () => {
    expect(LESSON_CONFIG.modules.filter((m) => m.track === 'problem').map((m) => [m.number, m.slug, m.stage])).toEqual([
      [5, 'masala-1', 'practice_lab'], [6, 'masala-2', 'practice_lab'], [7, 'masala-3', 'practice_lab'],
    ]);
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ number: 8, stage: 'evaluation' });
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    expect(LESSON_CONFIG.lessonProblem.questions.map((q) => [q.label, q.text])).toEqual(PROBLEM['masala-1'].parts.map((p) => [p.label, p.question]));
  });

  it('every demand has its own answer', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      part.asks.forEach((_, k) => expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ${k}`).toBe(true));
    }
  });

  it('مسألة 1 — 350 = 16 × 21 + 14, puis 2 fleurs de plus, 22 bouquets, 9900 دج', () => {
    const d = dm(350, 16);
    expect(expectedOf('masala-1', 0)).toEqual([d.q, d.r]);
    expect(expectedOf('masala-1', 1)).toEqual([16 - d.r, (350 + 16 - d.r) / 16]);
    expect((350 + 16 - d.r) % 16).toBe(0);
    expect(expectedOf('masala-1', 2)).toEqual([((350 + 16 - d.r) / 16) * 450]);
  });

  it('مسألة 2 — 261 = 45 × 5 + 36 : 6 bus, 9 places vides, 57000 دج', () => {
    const n = 248 + 13;
    const d = dm(n, 45);
    expect(expectedOf('masala-2', 0)).toEqual([n, d.q, d.r]);
    expect(expectedOf('masala-2', 1)).toEqual([d.q + 1, 45 - d.r]);
    expect(expectedOf('masala-2', 2)).toEqual([(d.q + 1) * 9500]);
  });

  it('مسألة 3 — 75 = 7 × 10 + 5 ; 975 = 24 × 40 + 15', () => {
    expect(expectedOf('masala-3', 0)).toEqual([dm(75, 7).q, dm(75, 7).r]);
    expect(expectedOf('masala-3', 1)).toEqual([75 * 13]);
    expect(expectedOf('masala-3', 2)).toEqual([dm(975, 24).q, dm(975, 24).r]);
    expect([24 * 39 + 39, 40 * 24 + 39]).toEqual([975, 999]);
  });
});
