import { describe, it, expect } from 'vitest';
import { validateProblem } from '../../../../../../common/problems/guidedProblem';
import { PROBLEMS, PROBLEM } from './problems';
import { LESSON_CONFIG } from '../lesson.config';

const div = (n, d) => n % d === 0;
const perms = (xs) => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p])));
const leap = (y) => (div(y, 4) && !div(y, 100)) || div(y, 400);
const expectedOf = (id, part) => PROBLEM[id].parts[part].steps.filter((s) => s.kind === 'numeric').map((s) => s.expected);

describe('les مسائل du درس « قواعد قابلية القسمة »', () => {
  it('respect the GuidedProblem contract and the module layout', () => {
    for (const p of PROBLEMS) expect(validateProblem(p)).toEqual([]);
    expect(LESSON_CONFIG.modules.filter((m) => m.track === 'problem').map((m) => [m.number, m.slug])).toEqual([[6, 'masala-1'], [7, 'masala-2'], [8, 'masala-3']]);
    expect(LESSON_CONFIG.modules.at(-1)).toMatchObject({ number: 9, stage: 'evaluation' });
    expect(PROBLEM['masala-1'].statement).toBe(LESSON_CONFIG.lessonProblem.statement);
    expect(LESSON_CONFIG.lessonProblem.questions.map((q) => q.text)).toEqual(PROBLEM['masala-1'].parts.map((p) => p.question));
    for (const p of PROBLEMS) for (const part of p.parts) part.asks.forEach((_, k) => expect(part.steps.some((s) => s.ask === k && s.kind !== 'solution')).toBe(true));
  });

  it('مسألة 1 — the codes from 2, 7, 5, 1 (decided by n % d)', () => {
    const codes = perms([2, 7, 5, 1]).map((p) => Number(p.join(''))).sort((a, b) => b - a);
    expect(expectedOf('masala-1', 0)).toEqual([codes.find((n) => div(n, 5))]);
    expect(expectedOf('masala-1', 1)).toEqual([2 + 7 + 5 + 1]);
    expect(codes.every((n) => div(n, 3))).toBe(true);
    expect(codes.some((n) => div(n, 9))).toBe(false);
    expect(expectedOf('masala-1', 2)).toEqual([codes.find((n) => div(n, 4))]);
    expect([...new Set(codes.map((n) => n % 100).filter((e) => div(e, 4)))].sort((a, b) => a - b)).toEqual([12, 52, 72]);
  });

  it('مسألة 2 — 2340 then 2355', () => {
    expect([div(2340, 4), div(2340, 9)]).toEqual([true, true]);
    expect(expectedOf('masala-2', 1)).toEqual([2340 + 15]);
    const rows = PROBLEM['masala-2'].parts[1].steps.find((s) => s.kind === 'batch').rows;
    expect(rows.map((r) => r.correct === 0)).toEqual([2, 3, 4, 5, 9].map((d) => div(2355, d)));
    expect(expectedOf('masala-2', 2)).toEqual([2355 / 5]);
  });

  it('مسألة 3 — the leap years, 1461 days, 2100 and 2400', () => {
    expect([2024, 2025, 2026, 2027].filter(leap)).toEqual([2024]);
    const days = [2024, 2025, 2026, 2027].reduce((a, y) => a + (leap(y) ? 366 : 365), 0);
    expect(expectedOf('masala-3', 1)).toEqual([days, Math.floor(days / 7)]);
    expect([leap(2100), leap(2400)]).toEqual([false, true]);
  });
});
