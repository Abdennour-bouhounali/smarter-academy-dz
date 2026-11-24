import { describe, it, expect } from 'vitest';
import { describeEvidence } from '../../../../../../common/gameworld/kit/authoring/test/suites.js';
import { verifyClaim } from '../../../../../../common/gameworld/kit/claims';
import { rng } from '../../../../../../common/gameworld/kit/random';
import CATALOGUE from '../../../../../../../../../../packages/core/curriculum/dz/lessons_4am_2026_2027.json';
import { evidence, POINTS, trainerEvidence } from './evidence';
import { KEYS } from './journey';
import { KNOWLEDGE } from './knowledge';
import { check, solution, trainer } from './trainer';
import { K1, K2, K3, K4 } from './math';

const ID = 'talis-hisab-atwal';
const FIRST = { firstTry: true, helped: false };
const CARDS = KNOWLEDGE.graph.nodes.map((n) => n.id);
/**
 * The lesson's الكفاءات as the CATALOGUE counts them (`packages/core/curriculum/dz`): P1 … P3, in the order of its
 * `pointsToLearn`. Wave 2's new `lesson.config.js` teaches them (the old one is never read): until then the suite reads
 * them here — at wave 2, pass `config: LESSON_CONFIG`.
 */
const entry = CATALOGUE.lessons.find((l) => l.code === ID);
const CONFIG = { modules: [{ teachesLearningPointIds: entry.pointsToLearn.map((_, i) => `4am_${ID}_P${i + 1}`) }] };

/** The boxes of each kind of exam question that claims. */
const BOXES = {
  nisba: ['n', 'd'],
  tul: ['x'],
  tulJuz: ['w', 'x'],
  farasha: ['x', 'y'],
  muamil: ['kn', 'kd', 'kind', 'mn', 'bn', 'bd'],
};

/**
 * THE MISTAKES of this lesson's students, each a whole answer: the piece in place of the side, the inverted ratio, the
 * sum of two lengths, the inverted k, the other word, k added to a side, an equal fraction (right).
 */
function mistakes(q, right) {
  const f = q.f;
  switch (q.kind) {
    case 'nisba':
      return [
        { n: right.n * 2, d: right.d * 2 }, // equal: right
        { n: right.d, d: right.n },
        { n: Number(f.VM) || right.n, d: 1 },
      ];
    case 'tul':
    case 'tulJuz':
    case 'farasha': {
      const s = q.sol ?? q.sols[0];
      const box = q.kind === 'farasha' ? 'x' : 'x';
      const inverted = String(
        (Number(f[s.P].replace(',', '.')) * Number(f[s.D].replace(',', '.'))) / Number(f[s.Q].replace(',', '.')),
      ).replace('.', ',');
      return [
        { ...right, [box]: inverted },
        { ...right, [box]: `${right[box]},0` }, // equal: right
        ...(q.kind === 'tulJuz' ? [{ ...right, w: f[q.part] }] : []),
        ...(q.kind === 'farasha' ? [{ ...right, x: String(Number(f.VM) + Number(f.VB)) }] : []),
      ];
    }
    case 'muamil':
      return [
        { ...right, kn: right.bn, kd: right.bd }, // the inverted k
        { ...right, kind: right.kind === 'reduction' ? 'enlargement' : 'reduction' },
        { ...right, bn: right.kn, bd: right.kd }, // k' = k
        { ...right, kn: right.kn * 3, kd: right.kd * 3 }, // equal: right
        { ...right, kind: undefined },
      ];
    default:
      return [];
  }
}

// each key proves ONE الكفاءة of its own — 🦋's is 📐's (P2), so the shared check runs on the three others
describeEvidence({
  id: ID,
  keys: [K1, K2, K4],
  evidence,
  trainerEvidence,
  trainer,
  check,
  solution,
  config: CONFIG,
  cards: CARDS,
  boxes: (q) => BOXES[q.kind] ?? null,
  kinds: Object.keys(BOXES),
  mistakes,
  seeds: 30,
  minPerKind: 20,
});

describe('the evidence of « خاصية طالس وحساب الأطوال » — the lesson’s own', () => {
  it('🔑 P1, 📐 P2, 🦋 P2 (its answers are lengths computed), 🔍 P3 — by the catalogue’s ids', () => {
    expect(KEYS.map((k) => evidence.learningPointOf(ID, k))).toEqual([
      `4am_${ID}_P1`,
      `4am_${ID}_P2`,
      `4am_${ID}_P2`,
      `4am_${ID}_P3`,
    ]);
    expect(POINTS[K3]).toBe(POINTS[K2]);
    expect(CONFIG.modules[0].teachesLearningPointIds).toHaveLength(3);
    expect(evidence.caseEvidence()).toBe(null);
  });

  it('a right answer states itself whole, on natural numbers of the server’s range (≤ 10^6); every kind is seen', () => {
    const seen = new Set();
    for (const card of CARDS)
      for (let seed = 1; seed <= 30; seed += 1)
        for (const q of trainer.makeSession(rng(seed * 31 + 7), card)) {
          const ev = trainerEvidence(q, solution(q), FIRST);
          if (!BOXES[q.kind] || q.format !== 'exam') {
            expect(ev, q.kind).toBe(null);
            continue;
          }
          seen.add(q.kind);
          expect(ev.key).toBe(q.key);
          expect(verifyClaim(ev.claim), `${q.prompt} ${JSON.stringify(ev.claim)}`).toBe(true);
          const nums = Object.values(ev.claim)
            .flat()
            .filter((x) => typeof x === 'number');
          for (const x of nums) expect(x, q.kind).toBeLessThanOrEqual(1000000);
        }
    expect([...seen].sort()).toEqual(Object.keys(BOXES).sort());
  });

  it('the claims, written out: a ratio, a length by the cross product, a side from its pieces, k and its image', () => {
    const ex = (q) => ({ format: 'exam', ...q });
    const f = { VM: '35', VB: '42', VN: '55', VC: '66', MN: '65', BC: '78', MB: '7', NC: '11' };
    // AN / AC = AM / AB = 35 / 42 — any equal writing
    const nisba = ex({ kind: 'nisba', key: K1, k: '5/6', f });
    expect(trainerEvidence(nisba, { n: 10, d: 12 }, FIRST).claim).toEqual({
      kind: 'fraction',
      a: 5,
      b: 6,
      p: 10,
      q: 12,
      reduced: false,
    });
    expect(verifyClaim(trainerEvidence(nisba, { n: 5, d: 1 }, FIRST).claim)).toBe(false); // the piece 35 / 7
    // MN = 35 × 78 ÷ 42 = 65
    const tul = ex({ kind: 'tul', key: K2, f, sol: { U: 'MN', P: 'BC', Q: 'VM', D: 'VB' } });
    expect(trainerEvidence(tul, { x: '65' }, FIRST).claim).toEqual({
      kind: 'fraction',
      a: 65,
      b: 1,
      p: 65,
      q: 1,
      op: '*',
      x: 2730,
      y: 1,
      z: 1,
      w: 42,
      reduced: false,
    });
    expect(verifyClaim(trainerEvidence(tul, { x: '93,6' }, FIRST).claim)).toBe(false); // the inverted ratio
    // AB = 35 + 7 = 42 first
    const juz = ex({
      kind: 'tulJuz',
      key: K2,
      f,
      part: 'VM',
      piece: 'MB',
      side: 'VB',
      sol: { U: 'MN', P: 'BC', Q: 'VM', D: 'VB' },
    });
    expect(trainerEvidence(juz, { w: '35', x: '65' }, FIRST).claim).toMatchObject({ op: '+', a: 35, x: 35, z: 7 });
    expect(verifyClaim(trainerEvidence(juz, { w: '35', x: '65' }, FIRST).claim)).toBe(false);
    // ABC → AMN, k = 5/8: 32 × 5 = 20 × 8 and 44 × 5 = 27,5 × 8 (in halves: 88 × 5 = 55 × 8)
    const g = { VB: '32', BC: '44', VM: '20', MN: '27,5' };
    const mu = ex({ kind: 'muamil', key: K4, f: g, one: ['VB', 'BC'], two: ['VM', 'MN'], k: '5/8' });
    const right = { kn: 5, kd: 8, kind: 'reduction', mn: '27,5', bn: 8, bd: 5 };
    expect(trainerEvidence(mu, { ...right, kind: 'enlargement' }, FIRST).claim).toEqual({
      kind: 'scale',
      from: [64, 88],
      to: [40, 55],
      p: 5,
      q: 8,
      says: 'enlargement',
    });
    expect(verifyClaim(trainerEvidence(mu, { ...right, kind: 'enlargement' }, FIRST).claim)).toBe(false);
    expect(verifyClaim(trainerEvidence(mu, right, FIRST).claim)).toBe(true);
    expect(verifyClaim(trainerEvidence(mu, { ...right, bn: 5, bd: 8 }, FIRST).claim)).toBe(false);
    // never: a second try, a helped answer, the game format, a true / false, the three ratios written with names
    expect(trainerEvidence(mu, right, { firstTry: false, helped: false })).toBe(null);
    expect(trainerEvidence(mu, right, { firstTry: true, helped: true })).toBe(null);
    expect(trainerEvidence({ ...mu, format: 'game' }, right, FIRST)).toBe(null);
    expect(trainerEvidence(ex({ kind: 'tf', key: K1, truth: true }), { truth: true }, FIRST)).toBe(null);
    expect(trainerEvidence(ex({ kind: 'nisab', key: K1 }), {}, FIRST)).toBe(null);
  });

  it('the payload of a butterfly’s length names P2', () => {
    const f = { VM: '20', VB: '32', VN: '35', VC: '56', MN: '45', BC: '72' };
    const q = {
      format: 'exam',
      kind: 'farasha',
      key: K3,
      f,
      sols: [
        { U: 'VC', P: 'VN', Q: 'VB', D: 'VM' },
        { U: 'MN', P: 'BC', Q: 'VM', D: 'VB' },
      ],
    };
    const ev = trainerEvidence(q, { x: '56', y: '45' }, FIRST);
    expect(verifyClaim(ev.claim)).toBe(true);
    expect(evidence.payloadOf(ID, 'trainer', ev, 'att-1')).toMatchObject({
      learningPoint: `4am_${ID}_P2`,
      context: 'trainer',
    });
  });
});
