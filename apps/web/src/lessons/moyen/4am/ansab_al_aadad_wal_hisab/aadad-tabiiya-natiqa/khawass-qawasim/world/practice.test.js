import { describe, it, expect } from 'vitest';
import { rng } from '../../../../../../common/gameworld/kit/random';
import { explain, waveSay } from '../../../../../../common/gameworld/divisorIsles/strings';
import { ladder, isRight, PRACTICE_NODES, PRACTICE_MAP } from './practice';
import { KEYS } from './journey';
import { TEXT } from './text';

describe('حلبة التدريب — the practice ladder of « خواص قواسم عدد طبيعي »', () => {
  it('has one node per key and a summary node, each level named and placed on the hub', () => {
    expect(PRACTICE_NODES.map((n) => n.id)).toEqual([...KEYS, 'exam']);
    for (const node of PRACTICE_NODES) {
      expect(TEXT.levels[node.id], node.id).toHaveLength(node.levels.length);
      expect(PRACTICE_MAP.positions[node.id], node.id).toBeTruthy();
    }
    expect(ladder.LEVEL_ORDER).toHaveLength(10);
  });

  it('every wave of every level has exactly ONE right gate, a sentence and a guidance', () => {
    for (const { node, level, id } of ladder.LEVEL_ORDER) {
      for (let seed = 1; seed <= 40; seed += 1) {
        for (const w of ladder.makeRun(rng(seed * 7919 + level), node, level)) {
          expect(
            w.gates.filter((n) => isRight(w, n)),
            `${id} ${JSON.stringify(w)}`,
          ).toHaveLength(1);
          expect(new Set(w.gates).size).toBe(3);
          expect(waveSay(w), id).toBeTruthy();
          const g = explain(
            w,
            w.gates.find((n) => !isRight(w, n)),
          );
          expect(g.wrong && g.right, `${id} ${w.type}`).toBeTruthy();
          expect(`${waveSay(w)} ${g.wrong} ${g.right}`).not.toMatch(/undefined|NaN/);
          expect(w.key === PRACTICE_NODES[node].id || PRACTICE_NODES[node].id === 'exam').toBe(true);
          // mental arithmetic: inside the tables
          expect(w.a ?? w.gates[w.good], id).toBeLessThanOrEqual(100);
          if (w.type === 'remainder') expect(w.b * w.q + w.r).toBe(w.a);
          if (w.type === 'missing') expect(w.b * w.q).toBe(w.a);
        }
      }
    }
  });

  it('« باقٍ يعرفه القاسم »: d divides a and b, and the remainder is the ONLY gate that d divides', () => {
    const node = PRACTICE_NODES.findIndex((n) => n.id === 'baqi-qisma');
    for (let seed = 1; seed <= 60; seed += 1) {
      for (const w of ladder.makeRun(rng(seed * 104729), node, 0)) {
        const { d } = w;
        expect([w.a % d, w.b % d, w.r % d], JSON.stringify(w)).toEqual([0, 0, 0]);
        expect(w.gates.filter((n) => n % d === 0)).toEqual([w.r]);
      }
    }
  });
});
