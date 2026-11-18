import { describe, it, expect } from 'vitest';
import { rng } from '../../../../../../common/gameworld/kit/random';
import { allQuestions } from '../../../../../../common/gameworld/kit/sitting';
import { verifyClaim } from '../../../../../../common/gameworld/kit/claims';
import { sittings, LEVELS, mark, model, scheme, evidenceOf } from './sitting';

/** What a student who knows the lesson writes for a question — computed from the numbers, never read from the question. */
function rightAnswer(q) {
  switch (q.type) {
    case 'k':
      return { x: q.m / q.d };
    case 'division':
      return { q: Math.floor(q.a / q.b), r: q.a % q.b };
    case 'proof':
      return 'right';
    case 'value':
      return { x: q.expected };
    default:
      return null;
  }
}

describe('الامتحان الأبيض — the sittings of « خواص قواسم عدد طبيعي »', () => {
  it('five levels, from one exercise to a short exam', () => {
    expect(LEVELS.map((l) => l.n)).toEqual([1, 2, 3, 4, 5]);
    expect(LEVELS.map((l) => sittings.levelPoints(l))).toEqual([3, 5, 5, 10, 11]);
  });

  it('a full-mark paper earns every point; an empty or wrong one earns none; the model copy and the scheme are written', () => {
    for (const level of LEVELS) {
      for (let seed = 1; seed <= 30; seed += 1) {
        const subject = sittings.makeSubject(rng(seed * 7919 + level.n), level.n);
        expect(subject.total).toBe(sittings.levelPoints(level));
        const answers = {};
        for (const q of allQuestions(subject)) {
          const right = rightAnswer(q);
          answers[q.id] = right;
          expect(mark(q, right), `${q.type} ${q.text}`).toBe(q.points);
          expect(mark(q, undefined)).toBe(0);
          expect(model(q).length, q.type).toBeGreaterThanOrEqual(2);
          expect(scheme(q).length, q.type).toBeGreaterThanOrEqual(2);
          expect(`${q.text} ${model(q).join(' ')}`).not.toMatch(/undefined|NaN/);
          expect(Boolean(q.tokens) !== Boolean(q.sentence), 'one shape per question').toBe(true);
          // the lesson's facts: d divides what it is asked to divide, the division has a remainder smaller than b
          if (q.type === 'k') expect(q.m % q.d, q.text).toBe(0);
          if (q.type === 'division') expect(q.b * q.quo + q.r).toBe(q.a);
          const ev = evidenceOf(q, right);
          if (q.type === 'k' || q.type === 'division') expect(verifyClaim(ev.claim), `${q.type} claim`).toBe(true);
          else expect(ev).toBe(null);
          // a wrong answer earns nothing
          const wrong =
            q.type === 'proof' ? 'f1' : q.type === 'division' ? { q: right.q - 1, r: right.r + q.b } : { x: 999 };
          expect(mark(q, wrong), q.type).toBe(0);
        }
        expect(sittings.totalMark(subject, answers)).toBe(subject.total);
        expect(sittings.weakKinds(subject, answers)).toEqual([]);
      }
    }
  });

  it('the situation: both lengths and the leftover are cut into whole pieces', () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const subject = sittings.makeSubject(rng(seed * 104729), 4);
      const wall = subject.exercises.find((e) => e.kind === 'wall');
      const [lengths] = [wall.statement.match(/\d+/g).map(Number)];
      const [long, short, piece] = lengths;
      expect([long % piece, short % piece, long % short === 0]).toEqual([0, 0, false]);
      expect(wall.questions.map((q) => q.expected)).toEqual([(long + short) / piece, (long % short) / piece]);
      expect((long % short) % piece).toBe(0);
    }
  });

  it('a remainder written bigger than the divisor is wrong, and sent as a false claim', () => {
    const q = { type: 'division', key: 'baqi-qisma', points: 1.5, a: 98, b: 42, quo: 2, r: 14, tokens: [] };
    expect(mark(q, { q: 1, r: 56 })).toBe(0);
    expect(verifyClaim(evidenceOf(q, { q: 1, r: 56 }).claim)).toBe(false);
    expect(verifyClaim(evidenceOf(q, { q: 2, r: 14 }).claim)).toBe(true);
  });
});
