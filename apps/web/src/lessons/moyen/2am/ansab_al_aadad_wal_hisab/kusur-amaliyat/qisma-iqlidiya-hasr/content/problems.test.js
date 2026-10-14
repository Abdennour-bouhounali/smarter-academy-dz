import { describe, it, expect } from 'vitest';
import { validateProblem } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

const dm = (a, b) => ({ q: Math.floor(a / b), r: a % b });
const expectedOf = (id, part) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === 'numeric').map((s) => s.expected);
const choiceOf = (id, part, k = 0) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === 'choice')[k];

describe('les مسائل du درس « القسمة الإقليدية وحصر حاصل القسمة »', () => {
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

  it('مسألة 1 — 4750 = 30 × 158 + 10 ; 158 < 4750/30 < 159 ; 159 = 40 × 3 + 39 → 4 camions', () => {
    const d = dm(4750, 30);
    expect(expectedOf('masala-1', 0)).toEqual([d.q, d.r]);
    expect(30 * d.q < 4750 && 4750 < 30 * (d.q + 1)).toBe(true);
    expect(expectedOf('masala-1', 1)).toEqual([d.q + 1]);
    const t = dm(d.q + 1, 40);
    expect(t).toEqual({ q: 3, r: 39 });
    expect(expectedOf('masala-1', 2)).toEqual([t.q + 1]);
    expect([40 * 2 + 79, 40 * 3 + 38]).toEqual([159, 158]);
  });

  it('مسألة 2 — 380 = 52 × 7 + 16 : 7 bus pleins, 8 à louer, 36 places, 96000 دج', () => {
    const n = 352 + 28;
    const d = dm(n, 52);
    expect(expectedOf('masala-2', 0)).toEqual([n, d.q, d.r]);
    expect(expectedOf('masala-2', 1)).toEqual([d.q, d.q + 1]);
    expect(expectedOf('masala-2', 2)).toEqual([52 - d.r, (d.q + 1) * 12000]);
  });

  it('مسألة 3 — 1250 = 24 × 52 + 2 ; 22 boîtes de plus : 1272 = 24 × 53', () => {
    const d = dm(1250, 24);
    expect(expectedOf('masala-3', 0)).toEqual([d.q, d.r]);
    expect(choiceOf('masala-3', 1, 0).options[choiceOf('masala-3', 1, 0).correct]).toContain('52 < ');
    expect(expectedOf('masala-3', 2)).toEqual([24 - d.r, 1250 + 24 - d.r]);
    expect((1250 + 24 - d.r) % 24).toBe(0);
  });
});
