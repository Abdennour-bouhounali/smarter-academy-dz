import { describe, it, expect } from 'vitest';
import { rng } from '../../../../../../common/gameworld/kit/random';
import { allQuestions } from '../../../../../../common/gameworld/kit/sitting';
import { verifyClaim } from '../../../../../../common/gameworld/kit/claims';
import { sittings, LEVELS, mark, model, scheme, evidenceOf } from './sitting';
import { divisorsOf, lastTry } from './practice';

/** What a student who knows the lesson writes for a question. */
function rightAnswer(q) {
  switch (q.type) {
    case 'factor':
      return { x: q.a / q.b };
    case 'list':
      return Object.fromEntries(divisorsOf(q.a).map((d, i) => [`d${i}`, d]));
    case 'stop':
      return { d: lastTry(q.a), e: lastTry(q.a) + 1 };
    case 'verdict':
      return q.a % q.b === 0 ? 'yes' : 'no';
    case 'value':
      return { x: q.expected };
    default:
      return null;
  }
}

describe('الامتحان الأبيض — the sittings of « قواسم عدد طبيعي »', () => {
  it('five levels, from one exercise to a short exam', () => {
    expect(LEVELS.map((l) => l.n)).toEqual([1, 2, 3, 4, 5]);
    expect(LEVELS.map((l) => sittings.levelPoints(l))).toEqual([3, 6, 6, 10, 10]);
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
          const ev = evidenceOf(q, right);
          if (q.key && q.type !== 'value') expect(verifyClaim(ev.claim), `${q.type} claim`).toBe(true);
          if (q.type === 'value') expect(ev).toBe(null);
        }
        expect(sittings.totalMark(subject, answers)).toBe(subject.total);
        expect(sittings.weakKinds(subject, answers)).toEqual([]);
      }
    }
  });

  it('marks the usual mistakes as the scheme says, and sends them as false claims', () => {
    const list = { type: 'list', key: 'k', points: 2, a: 20 };
    const forgot = { d0: 1, d1: 2, d2: 4, d3: 5, d4: 10, d5: 10 };
    expect(mark(list, forgot)).toBe(0);
    expect(verifyClaim(evidenceOf(list, forgot).claim)).toBe(false);
    const stop = { type: 'stop', key: 'k', points: 1.5, a: 70 };
    expect(mark(stop, { d: 8, e: 9 })).toBe(1.5);
    expect(mark(stop, { d: 35, e: 36 })).toBe(0);
    expect(verifyClaim(evidenceOf(stop, { d: 35, e: 36 }).claim)).toBe(false);
    const verdict = { type: 'verdict', key: 'k', points: 1, a: 252, b: 5 };
    expect(mark(verdict, 'no')).toBe(1);
    expect(verifyClaim(evidenceOf(verdict, 'yes').claim)).toBe(false);
  });
});
