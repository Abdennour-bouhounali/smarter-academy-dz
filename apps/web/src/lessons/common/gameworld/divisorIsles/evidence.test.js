import { describe, it, expect } from 'vitest';
import { rng } from './practice';
import { makeSession, solution, check, PLAN_OF } from './trainer';
import { MISSIONS, makeMission, judge, answerOf } from './cases';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { trainerEvidence, caseEvidence, verify, learningPointOf, payloadOf } from './evidence';

const FIXTURE = JSON.parse(readFileSync(fileURLToPath(new URL('../../../../../../api/tests/Fixtures/game-claims.json', import.meta.url)), 'utf8'));

const FIRST = { firstTry: true, helped: false };

describe('which game answers count toward الكفاءات', () => {
  it('maps the four keys to the four learning points of the lesson', () => {
    expect(['qasim-baqi', 'qasim-jidaa', 'siyagh-mutakafia', 'wahid-wa-nafsuh'].map((k) => learningPointOf('qasim-adad-tabii', k))).toEqual(['4am_qasim-adad-tabii_P1', '4am_qasim-adad-tabii_P2', '4am_qasim-adad-tabii_P3', '4am_qasim-adad-tabii_P4']);
    expect(learningPointOf('qasim-adad-tabii', 'exam')).toBe(null);
  });

  it('counts only the exam format, the first try, with no help opened before', () => {
    for (const id of Object.keys(PLAN_OF)) for (const q of makeSession(rng(7), id)) {
      const ev = trainerEvidence(q, solution(q), FIRST);
      expect(Boolean(ev), `${id} ${q.format} ${q.kind}`).toBe(q.format === 'exam' && q.kind !== 'tf');
      expect(trainerEvidence(q, solution(q), { firstTry: false, helped: false })).toBe(null); // a second try proves nothing
      expect(trainerEvidence(q, solution(q), { firstTry: true, helped: true })).toBe(null); // nor an answer after the model sheet
    }
  });

  it('the verdict re-computed from the numbers agrees with the game on every exam question, right or wrong', () => {
    let seen = 0;
    for (const id of Object.keys(PLAN_OF)) for (let seed = 1; seed <= 60; seed += 1) for (const q of makeSession(rng(seed * 19 + 2), id)) {
      if (q.format !== 'exam' || q.kind === 'tf') continue;
      const right = solution(q); const ev = trainerEvidence(q, right, FIRST);
      expect(verify(ev.claim), `${q.kind} right`).toBe(true); expect(check(q, right).ok).toBe(true); seen += 1;
      // a wrong answer of each kind is refused by the same rule
      const wrong = q.kind === 'division' ? { q: q.q + 1, r: q.r, fits: q.r === 0 } : q.kind === 'show' ? { q: q.q, x: q.a + 1 } : q.kind === 'complete' ? (right === 'qasim' ? 'mudaaf' : 'qasim') : { x: 1, y: 2 };
      expect(verify(trainerEvidence(q, wrong, FIRST).claim), `${q.kind} wrong`).toBe(false); expect(check(q, wrong).ok).toBe(false);
    }
    expect(seen).toBeGreaterThan(700);
    // a division that is right but concluded wrongly is NOT evidence of the learning point
    expect(verify({ kind: 'division', a: 143, b: 11, q: 13, r: 0, fits: false })).toBe(false);
    expect(verify({ kind: 'division', a: 143, b: 11, q: 12, r: 11, fits: false })).toBe(false); // remainder not smaller than the divisor
  });

  it('gives the SAME verdict as the server on the shared fixture (apps/api/tests/Fixtures/game-claims.json)', () => {
    expect(FIXTURE.cases.length).toBeGreaterThan(30);
    for (const c of FIXTURE.cases) expect(verify(c.claim), JSON.stringify(c.claim)).toBe(c.ok);
  });

  it('builds the payload the server expects, and nothing for a question without a learning point', () => {
    const ev = { key: 'qasim-baqi', claim: { kind: 'division', a: 756, b: 36, q: 21, r: 0, fits: true } };
    expect(payloadOf('qasim-adad-tabii', 'trainer', ev, 'id-1')).toEqual({ attemptId: 'id-1', learningPoint: '4am_qasim-adad-tabii_P1', context: 'trainer', claim: ev.claim });
    expect(payloadOf('qasim-adad-tabii', 'trainer', null, 'id-2')).toBe(null);
    expect(payloadOf('qasim-adad-tabii', 'case', { key: 'exam', claim: {} }, 'id-3')).toBe(null);
  });

  it('counts the division steps of the real cases, and never an invoice, a sum or a choice', () => {
    const counted = new Set();
    for (const mission of Object.keys(MISSIONS)) for (let seed = 1; seed <= 40; seed += 1) for (const o of makeMission(rng(seed * 5 + 1), mission)) {
      o.steps.forEach((st, i) => {
        const ev = caseEvidence(o, i, answerOf(o, i), FIRST);
        if (!ev) { if (st.type === 'choose') expect(ev).toBe(null); return; }
        counted.add(`${o.kind}.${st.id}`);
        expect(verify(ev.claim), `${o.kind}.${st.id}`).toBe(true); expect(judge(o, i, answerOf(o, i)).ok).toBe(true);
        expect(caseEvidence(o, i, answerOf(o, i), { firstTry: false, helped: false })).toBe(null);
      });
    }
    expect([...counted].sort()).toEqual(['cost.first', 'cost.second', 'count.capacity', 'profit.big', 'profit.small', 'share.each', 'tiling.boxes', 'trip.trucks']);
    const trip = makeMission(rng(3), 'day')[2];
    expect(verify(caseEvidence(trip, 0, { x: trip.q }, FIRST).claim)).toBe(false); // the classic mistake: the last truck forgotten
  });
});
