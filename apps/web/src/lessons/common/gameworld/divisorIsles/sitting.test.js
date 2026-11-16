import { describe, it, expect } from 'vitest';
import { rng } from './practice';
import { verify } from './evidence';
import { PHRASES } from './trainer';
import {
  makeSubject,
  allQuestions,
  mark,
  totalMark,
  model,
  scheme,
  evidenceOf,
  answered,
  appreciation,
  pace,
  LEVELS,
  weakKinds,
  sittingStars,
  forgotten,
  touched,
} from './sitting';

/** The full-mark answer of a question. */
const right = (q) => {
  switch (q.type) {
    case 'division':
      return { q: Math.floor(q.a / q.b), r: q.a % q.b };
    case 'verdict':
      return q.a % q.b === 0 ? 'yes' : 'no';
    case 'factor':
    case 'other':
    case 'count':
      return { x: q.a / q.b };
    case 'ceil':
      return { x: Math.ceil(q.a / q.b) };
    case 'value':
      return { x: q.expected };
    case 'phrase':
      return PHRASES.find((p) => p.small === q.smallFirst).id;
    default:
      return { x: q.q * q.price };
  }
};

describe('الامتحان الأبيض — the sitting', () => {
  it('builds a subject of three exercises worth 10 points, every question with its model copy and its scheme', () => {
    for (let seed = 1; seed <= 80; seed += 1) {
      const s = makeSubject(rng(seed));
      const qs = allQuestions(s);
      expect(s.exercises.map((e) => e.points)).toEqual([3, 3, 4]);
      expect(s.level).toBe(4);
      expect(qs).toHaveLength(8);
      expect(qs.reduce((t, q) => t + q.points, 0)).toBe(s.total);
      for (const e of s.exercises) expect(e.questions.reduce((t, q) => t + q.points, 0)).toBe(e.points);
      for (const q of qs) {
        expect(model(q).length).toBeGreaterThan(0);
        expect(scheme(q).length).toBeGreaterThan(0);
        expect(`${q.text}${model(q).join('')}`).not.toMatch(/undefined|NaN/);
      }
      const cost = s.exercises[2].questions;
      expect(cost[0].a % cost[0].b).not.toBe(0);
      expect(cost[1].a % cost[1].b).toBe(0);
    }
  });

  it('gives full marks to the right paper and nothing to an empty one', () => {
    for (let seed = 1; seed <= 60; seed += 1) {
      const s = makeSubject(rng(seed));
      const qs = allQuestions(s);
      const full = Object.fromEntries(qs.map((q) => [q.id, right(q)]));
      expect(totalMark(s, full)).toBe(10);
      expect(totalMark(s, {})).toBe(0);
      for (const q of qs) expect(answered(q, right(q))).toBe(true);
      expect(answered(qs[0], { q: 3, r: '' })).toBe(false);
    }
  });

  it('marks by the scheme: half of a division for the quotient, half for the remainder', () => {
    const q = allQuestions(makeSubject(rng(5)))[0];
    const d = right(q);
    expect(mark(q, { q: d.q, r: d.r + 1 })).toBe(q.points / 2);
    expect(mark(q, { q: d.q + 1, r: d.r })).toBe(q.points / 2);
    expect(mark(q, { q: d.q + 1, r: d.r + 1 })).toBe(0);
    const other = allQuestions(makeSubject(rng(5)))[3];
    expect(mark(other, { x: other.b })).toBe(0); // the divisor already shown is not « another » one
    expect(mark(other, { x: 1 })).toBe(other.points); // 1 is another divisor: a right answer the model copy did not expect
  });

  it('sends as evidence only what the server can re-compute, with the same verdict as the mark', () => {
    for (let seed = 1; seed <= 60; seed += 1)
      for (const q of allQuestions(makeSubject(rng(seed)))) {
        const ev = evidenceOf(q, right(q));
        expect(Boolean(ev)).toBe(['division', 'factor', 'phrase', 'count', 'ceil'].includes(q.type));
        if (ev) expect(verify(ev.claim), `${q.type}`).toBe(true);
        expect(evidenceOf(q, null)).toBe(null); // an unanswered question is not evidence
      }
    const q = allQuestions(makeSubject(rng(2)))[0];
    expect(verify(evidenceOf(q, { q: 1, r: 1 }).claim)).toBe(false);
  });

  it('climbs a LADDER of five levels: more exercises, bigger numbers, more minutes — every level solvable to full marks', () => {
    expect(LEVELS.map((l) => l.n)).toEqual([1, 2, 3, 4, 5]);
    let last = 0;
    for (const L of LEVELS)
      for (let seed = 1; seed <= 40; seed += 1) {
        const s = makeSubject(rng(seed * 3 + L.n), L.n);
        const qs = allQuestions(s);
        expect(s.level).toBe(L.n);
        expect(s.exercises.map((e) => e.kind)).toEqual(L.plan.map((p) => p[0]));
        expect(new Set(qs.map((q) => q.id)).size).toBe(qs.length);
        expect(totalMark(s, Object.fromEntries(qs.map((q) => [q.id, right(q)])))).toBe(s.total);
        for (const q of qs) {
          expect(model(q).length).toBeGreaterThan(0);
          expect(scheme(q).length).toBeGreaterThan(0);
          expect(`${q.text}${model(q).join('')}`).not.toMatch(/undefined|NaN/);
        }
        if (seed === 1) {
          expect(s.total).toBeGreaterThan(last);
          last = s.total;
        }
      }
    expect(LEVELS.map((l) => l.minutes)).toEqual([5, 8, 10, 12, 15]);
    const trip = makeSubject(rng(4), 5).exercises[2].questions; // the remainder MEANS one more truck
    expect(mark(trip[1], { x: Math.floor(trip[1].a / trip[1].b) })).toBe(0);
    expect(mark(trip[1], { x: Math.floor(trip[1].a / trip[1].b) + 1 })).toBe(trip[1].points);
  });

  it('ADAPTS the next sheet: what was missed comes first, with other numbers', () => {
    const s = makeSubject(rng(9), 4);
    const qs = allQuestions(s);
    const answers = Object.fromEntries(qs.map((q) => [q.id, right(q)]));
    delete answers[s.exercises[2].questions[2].id]; // the invoice left blank
    expect(weakKinds(s, answers)).toEqual(['cost']);
    const again = makeSubject(rng(10), 4, ['cost']);
    expect(again.exercises[0].kind).toBe('cost');
    expect(again.exercises[0].focus).toBe(true);
    expect(again.exercises.map((e) => e.kind).sort()).toEqual(['cost', 'division', 'product']);
    expect(again.exercises[0].statement).not.toBe(s.exercises[2].statement); // similar, never the same
    expect(again.total).toBe(s.total);
    expect([sittingStars(10, 10), sittingStars(9, 10), sittingStars(8, 10), sittingStars(7.9, 10)]).toEqual([
      3, 2, 1, 0,
    ]);
  });

  it('finds the exercises left completely empty, except the one on screen', () => {
    const s = makeSubject(rng(4), 4);
    const [e1, e2, e3] = s.exercises;
    expect(forgotten(s, {}, 0)).toEqual([1, 2]); // nothing written: the two pages he is not looking at
    const first = Object.fromEntries(e1.questions.map((q) => [q.id, right(q)]));
    expect(forgotten(s, first, 0)).toEqual([1, 2]);
    expect(forgotten(s, first, 1)).toEqual([2]); // the empty exercise on screen is not a forgotten one
    // one box of one question is enough: the exercise was started, so it is his choice
    const box = e2.questions.find((q) => q.tokens);
    const started = { ...first, [box.id]: { [box.tokens.find((t) => typeof t === 'object').slot]: '7' } };
    expect(touched(box, started[box.id])).toBe(true);
    expect(answered(box, started[box.id]) && box.tokens.filter((t) => typeof t === 'object').length > 1).toBe(false);
    expect(forgotten(s, started, 0)).toEqual([2]);
    expect(touched(e3.questions[0], undefined)).toBe(false);
    expect(touched(e1.questions[0], { q: '', r: '' })).toBe(false);
    expect(touched({}, '')).toBe(false);
    expect(forgotten(makeSubject(rng(4), 1), {}, 0)).toEqual([]); // a single exercise: nothing can be forgotten
  });

  it('writes an appreciation and a pace', () => {
    expect([10, 7.5, 5, 2].map((m) => appreciation(m, 10))).toEqual([
      'ممتاز',
      'جيّد',
      'متوسّط: راجع أخطاءك',
      'يحتاج إلى عمل: لا تيأس',
    ]);
    expect([pace(0, 720), pace(360, 720), pace(900, 720)]).toEqual([0, 0.5, 1]);
  });
});
