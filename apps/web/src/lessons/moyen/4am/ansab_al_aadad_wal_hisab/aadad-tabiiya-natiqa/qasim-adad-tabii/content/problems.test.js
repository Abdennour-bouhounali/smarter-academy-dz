import { describe, it, expect } from 'vitest';
import { validateProblem } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

const div = (a, b) => ({ q: Math.floor(a / b), r: a % b });
const expectedOf = (id, part) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === 'numeric').map((s) => s.expected);

describe('les مسائل du درس 1', () => {
  it('respect the GuidedProblem contract', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
  });

  it('match their modules (4, 5, 6 — track problem, practice_lab, before the test)', () => {
    const problemModules = LESSON_CONFIG.modules.filter((m) => m.track === 'problem');
    expect(problemModules.map((m) => [m.number, m.slug, m.stage])).toEqual([
      [4, 'masala-1', 'practice_lab'], [5, 'masala-2', 'practice_lab'], [6, 'masala-3', 'practice_lab'],
    ]);
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ number: 7, stage: 'evaluation' });
    expect(LESSON_CONFIG.lessonProblem.module).toBe(4);
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    expect(LESSON_CONFIG.lessonProblem.questions.map((q) => [q.label, q.text]))
      .toEqual(PROBLEM['masala-1'].parts.map((p) => [p.label, p.question]));
  });

  it('every demand has its own answer (owner rule 2026-10-06)', () => {
    for (const p of PROBLEMS) for (const part of p.parts) {
      part.asks.forEach((_, k) => {
        expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution'), `${p.id} ${part.label} ask ${k + 1}`).toBe(true);
      });
    }
  });

  it('مسألة 2 — the four phrasings are four sentences to complete', () => {
    const batch = PROBLEM['masala-2'].parts[1].steps.find((s) => s.kind === 'batch');
    expect(batch.rows.map((r) => r.options[r.correct])).toEqual(['قاسم للعدد', 'يقسم', 'يقبل القسمة على', 'مضاعف للعدد']);
  });

  it('مسألة 1 — the numbers are computed, not typed', () => {
    const r32 = div(756, 32), r36 = div(756, 36);
    expect(expectedOf('masala-1', 0)).toEqual([r32.q, r32.r]);
    expect(r32.r).not.toBe(0);
    expect(r36.r).toBe(0);
    expect(expectedOf('masala-1', 1)).toEqual([r36.q, r36.q]); // q, puis le nombre de rayons
    expect(expectedOf('masala-1', 2)).toEqual([r36.q * 1850]);
  });

  it('مسألة 2 — the numbers are computed, not typed', () => {
    expect(expectedOf('masala-2', 0)).toEqual([div(2028, 6).r, div(2028, 12).r, div(2028, 30).r]);
    expect(expectedOf('masala-2', 1)).toEqual([2028 / 12]);
    const six = (2028 / 6) * 150, twelve = (2028 / 12) * 290;
    expect(expectedOf('masala-2', 2)).toEqual([six, twelve, six - twelve]);
    expect(six).toBeGreaterThan(twelve);
  });

  it('مسألة 3 — the numbers are computed, not typed', () => {
    const all = 252 + 18, present = all - 2, d = div(present, 54);
    expect(expectedOf('masala-3', 0)).toEqual([all, all / 54, all / 54]); // q, puis le nombre de bus
    expect(all % 54).toBe(0);
    expect(expectedOf('masala-3', 1)).toEqual([present, d.q, d.r, d.q + 1, (d.q + 1) * 54 - present]); // bus ET sièges : deux saisies
    const rent = (all / 54) * 12600;
    expect(rent % 252).toBe(0);
    expect(expectedOf('masala-3', 2)).toEqual([rent, rent / 252, rent / 252]);
  });
});
