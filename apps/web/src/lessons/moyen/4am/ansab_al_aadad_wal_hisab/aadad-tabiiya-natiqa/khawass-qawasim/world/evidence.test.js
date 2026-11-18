import { describe, it, expect } from 'vitest';
import { evidence, trainerEvidence } from './evidence';
import { KEYS } from './journey';
import { LESSON_CONFIG } from '../lesson.config';

const FIRST = { firstTry: true, helped: false };

describe('the evidence of « خواص قواسم عدد طبيعي »', () => {
  it('each key proves one الكفاءة of the lesson, by its catalogue id, and a module of the lesson teaches it', () => {
    const points = KEYS.map((key) => evidence.learningPointOf('khawass-qawasim', key));
    expect(points).toEqual(['P1', 'P2', 'P3', 'P4'].map((p) => `4am_khawass-qawasim_${p}`));
    const taught = new Set(LESSON_CONFIG.modules.flatMap((m) => m.teachesLearningPointIds ?? []));
    for (const p of points) expect(taught.has(p), p).toBe(true);
  });

  it('only an exam answer given at the first try without help is sent, as a claim', () => {
    // 7 divides 98 and 42: 98 = 42 × 2 + 14
    const q = { format: 'exam', kind: 'rest', key: KEYS[2], a: 98, b: 42, d: 7 };
    const ev = trainerEvidence(q, { q: 2, r: 14, k: 2 }, FIRST);
    expect(ev).toEqual({ key: KEYS[2], claim: { kind: 'division', a: 98, b: 42, q: 2, r: 14, fits: false } });
    expect(evidence.payloadOf('khawass-qawasim', 'trainer', ev, 'att-1')).toEqual({
      attemptId: 'att-1',
      learningPoint: '4am_khawass-qawasim_P3',
      context: 'trainer',
      claim: ev.claim,
    });
    expect(evidence.verify(ev.claim)).toBe(true);
    expect(trainerEvidence(q, { q: 2, r: 14, k: 2 }, { firstTry: true, helped: true })).toBe(null);
    expect(trainerEvidence({ ...q, format: 'game' }, { q: 2, r: 14, k: 2 }, FIRST)).toBe(null);
    // 12 divides 84 and 36: 84 + 36 = 12 × 10
    const sd = trainerEvidence(
      { format: 'exam', kind: 'sumDiff', key: KEYS[0], a: 84, b: 36, d: 12 },
      { s: 10 },
      FIRST,
    );
    expect(sd.claim).toEqual({ kind: 'pair', a: 120, b: 12, e: 10 });
    expect(evidence.verify(sd.claim)).toBe(true);
    expect(trainerEvidence({ format: 'exam', kind: 'tf', key: KEYS[0] }, { truth: true, reason: 0 }, FIRST)).toBe(null);
    expect(trainerEvidence({ format: 'exam', kind: 'proof', key: KEYS[3] }, {}, FIRST)).toBe(null);
    expect(evidence.caseEvidence()).toBe(null);
  });
});
