import { describe, it, expect } from 'vitest';
import { evidence, trainerEvidence } from './evidence';
import { KEYS } from './journey';
import { LESSON_CONFIG } from '../lesson.config';

const FIRST = { firstTry: true, helped: false };

describe('the evidence of « قواسم عدد طبيعي »', () => {
  it('each key proves one الكفاءة of the lesson, by its catalogue id', () => {
    const points = KEYS.map((key) => evidence.learningPointOf('qawasim-adad-tabii', key));
    expect(points).toEqual(['P1', 'P2', 'P3', 'P4'].map((p) => `4am_qawasim-adad-tabii_${p}`));
    const taught = new Set(LESSON_CONFIG.modules.flatMap((m) => m.teachesLearningPointIds ?? []));
    for (const p of points) expect(taught.has(p), p).toBe(true);
  });

  it('only an exam answer given at the first try without help is sent, as a claim', () => {
    const q = { format: 'exam', kind: 'stop', key: KEYS[2], a: 96 };
    const ev = trainerEvidence(q, { d: 9, e: 10 }, FIRST);
    expect(ev).toEqual({ key: KEYS[2], claim: { kind: 'stop', a: 96, b: 9 } });
    expect(evidence.payloadOf('qawasim-adad-tabii', 'trainer', ev, 'att-1')).toEqual({
      attemptId: 'att-1',
      learningPoint: '4am_qawasim-adad-tabii_P3',
      context: 'trainer',
      claim: { kind: 'stop', a: 96, b: 9 },
    });
    expect(trainerEvidence(q, { d: 9, e: 10 }, { firstTry: true, helped: true })).toBe(null);
    expect(trainerEvidence({ ...q, format: 'game' }, { d: 9, e: 10 }, FIRST)).toBe(null);
    expect(trainerEvidence({ format: 'exam', kind: 'tf', key: KEYS[0] }, { truth: true, reason: 0 }, FIRST)).toBe(null);
    expect(evidence.caseEvidence()).toBe(null);
    expect(evidence.verify({ kind: 'stop', a: 96, b: 9 })).toBe(true);
  });
});
