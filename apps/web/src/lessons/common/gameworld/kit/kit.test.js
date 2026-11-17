// THE KIT NAMES NO LESSON. These tests drive every frame of the kit with a TOY lesson that has nothing to do with the
// pilot (« is n a multiple of 10? », two keys), and a boundary test reads the kit's own files.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rng, int, pick, shuffle } from './random';
import { createLadder, buildWave, gatePoints, SUMMARY } from './ladder';
import { createTrainer, SESSION, sessionStars } from './trainer';
import { createSittings, slot, answered, touched, forgotten, allQuestions, sittingStars, PASS, pace } from './sitting';
import { createJourney, emptyExam, examLevelOpen } from './journey';
import { createEvidence, counts } from './evidence';

// ── a toy lesson ──
const isRight = (w, n) => (w.type === 'tens' ? n % 10 === 0 : n % 2 === 1);
const generators = {
  tens: (rand, { max }) => {
    const right = 10 * int(rand, 1, max);
    return buildWave(rand, { type: 'tens', key: 'tens', a: right }, right, [right + 1, right + 3, right - 4]);
  },
  odd: (rand) => buildWave(rand, { type: 'odd', key: 'odd', a: 0 }, pick(rand, [3, 5, 7]), [2, 4, 6, 8]),
  never: () => null,
};
const nodes = [
  {
    id: 'tens',
    levels: [
      { speed: 6, mix: [['tens', { max: 5 }]] },
      { game: 'shop', mission: 'coins' },
    ],
  },
  { id: 'odd', levels: [{ speed: 6, mix: [['odd', {}]] }] },
  {
    id: SUMMARY,
    levels: [
      {
        speed: 7,
        mix: [
          ['tens', { max: 9 }],
          ['odd', {}],
        ],
      },
    ],
  },
];
const ladder = createLadder({ nodes, generators, isRight });
const levels = [
  { n: 1, title: 'one', minutes: 5, plan: [['count', 1]] },
  {
    n: 2,
    title: 'two',
    minutes: 8,
    plan: [
      ['count', 2],
      ['say', 1],
    ],
  },
];
const build = {
  count: (rand, tier) => ({
    kind: 'count',
    title: 'counting',
    points: 2,
    statement: 's',
    questions: [
      { type: 'n', points: 2, expected: tier * int(rand, 1, 3), tokens: ['x', '=', slot('x', 'the number', 2)] },
    ],
  }),
  say: () => ({
    kind: 'say',
    title: 'saying',
    points: 1,
    situation: true,
    statement: 's',
    questions: [{ type: 'word', points: 1, expected: 'yes', sentence: ['10', { choose: true }] }],
  }),
};
const mark = (q, v) =>
  !answered(q, v) ? 0 : (q.type === 'word' ? v === q.expected : Number(v.x) === q.expected) ? q.points : 0;
const sittings = createSittings({ levels, build, mark });
const journey = createJourney({ keys: ['tens', 'odd'], ladder, levels, stages: 3, cards: 5 });

describe('kit/random', () => {
  it('replays the same sequence for the same seed', () => {
    const a = rng(42);
    const b = rng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(shuffle(rng(1), [1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4]);
    for (let i = 0; i < 50; i += 1) expect(int(rng(i), 3, 5)).toBeGreaterThanOrEqual(3);
  });
});

describe('kit/ladder — with a toy lesson', () => {
  it('lists the levels in playing order and counts three stars each', () => {
    expect(ladder.LEVEL_ORDER.map((x) => x.id)).toEqual(['tens:1', 'tens:2', 'odd:1', `${SUMMARY}:1`]);
    expect(ladder.MAX_PRACTICE_STARS).toBe(12);
    expect(ladder.isCase(0, 1)).toBe(true);
    expect(ladder.isCase(0, 0)).toBe(false);
  });

  it('makes fair waves only: three different gates, exactly one right', () => {
    for (let seed = 1; seed <= 40; seed += 1)
      for (const w of ladder.makeRun(rng(seed), 2, 0)) {
        expect(new Set(w.gates).size).toBe(3);
        expect(w.gates.filter((n) => isRight(w, n))).toEqual([w.gates[w.good]]);
      }
    expect(() => ladder.waveOf(rng(1), 'never', {})).toThrow();
  });

  it('opens a node with its key, a level after the one before it, the summary after every first level', () => {
    expect(ladder.nodeOpen(0, [], {})).toBe(false);
    expect(ladder.nodeOpen(0, ['tens'], {})).toBe(true);
    expect(ladder.levelOpen(0, 1, ['tens'], {})).toBe(false);
    expect(ladder.levelOpen(0, 1, ['tens'], { 'tens:1': { stars: 1 } })).toBe(true);
    expect(ladder.nodeOpen(2, ['tens', 'odd'], { 'tens:1': { stars: 1 } })).toBe(false);
    const both = { 'tens:1': { stars: 1 }, 'odd:1': { stars: 3 } };
    expect(ladder.nodeOpen(2, ['tens', 'odd'], both)).toBe(true);
    expect(ladder.nextLevel(['tens', 'odd'], both).id).toBe('tens:2');
    expect(ladder.practiceStars(both)).toBe(4);
    expect([gatePoints(0), gatePoints(3), gatePoints(5)]).toEqual([100, 150, 200]);
  });
});

describe('kit/trainer — with a toy lesson', () => {
  it('asks six questions in the order game, game, exam, game, exam, exam, from the plan of the card', () => {
    const kinds = { q: (rand, format, tag) => ({ format, kind: 'q', tag }) };
    const plan = (tag) => SESSION.map(() => ['q', tag]);
    const trainer = createTrainer({
      kinds,
      plans: { a: plan('a'), mix: plan('mix') },
      planOf: { card: 'a' },
      fallback: 'mix',
    });
    expect(trainer.makeSession(rng(1), 'card').map((q) => q.format)).toEqual(SESSION);
    expect(trainer.makeSession(rng(1), 'card')[0].tag).toBe('a');
    expect(trainer.makeSession(rng(1), 'unknown-card')[0].tag).toBe('mix');
    expect([0, 2, 4, 6].map(sessionStars)).toEqual([0, 1, 2, 3]);
  });
});

describe('kit/sitting — with a toy lesson', () => {
  it('builds a subject from the level plan, numbers its questions and names a situation', () => {
    const s = sittings.makeSubject(rng(3), 2);
    expect(s.level).toBe(2);
    expect(s.total).toBe(3);
    expect(s.exercises.map((e) => e.id)).toEqual(['e1', 'e2']);
    expect(s.exercises[1].title).toContain('وضعيّة');
    expect(s.exercises[0].title).not.toContain('وضعيّة');
    expect(allQuestions(s).map((q) => q.id)).toEqual(['e1q1', 'e2q1']);
  });

  it('puts the weak kinds first on the next sheet', () => {
    expect(sittings.makeSubject(rng(3), 2, ['say']).exercises.map((e) => e.kind)).toEqual(['say', 'count']);
    expect(sittings.makeSubject(rng(3), 2, ['say']).exercises[0].focus).toBe(true);
  });

  it('reads an answer in its two shapes and marks by the lesson scheme', () => {
    const s = sittings.makeSubject(rng(5), 2);
    const [n, word] = allQuestions(s);
    expect(answered(n, { x: '' })).toBe(false);
    expect(answered(n, { x: '4' })).toBe(true);
    expect(answered(word, '')).toBe(false);
    expect(answered(word, 'yes')).toBe(true);
    expect(touched(n, { x: '' })).toBe(false);
    const full = { [n.id]: { x: String(n.expected) }, [word.id]: 'yes' };
    expect(sittings.totalMark(s, full)).toBe(3);
    expect(sittings.weakKinds(s, { ...full, [word.id]: 'no' })).toEqual(['say']);
    expect(forgotten(s, { [n.id]: { x: '1' } })).toEqual([1]);
    expect(forgotten(s, { [n.id]: { x: '1' } }, 1)).toEqual([]);
    expect([sittingStars(10, 10), sittingStars(9, 10), sittingStars(8, 10), sittingStars(7.9, 10)]).toEqual([
      3, 2, 1, 0,
    ]);
    expect(PASS).toBe(0.8);
    expect(pace(30, 60)).toBe(0.5);
  });
});

describe('kit/journey — with a toy lesson', () => {
  const played = { 'tens:1': { stars: 1 }, 'odd:1': { stars: 1 } };
  it('opens the exam space once every key is held and its first run passed', () => {
    expect(journey.examOpen(['tens'], played)).toBe(false);
    expect(journey.examOpen(['tens', 'odd'], { 'tens:1': { stars: 1 } })).toBe(false);
    expect(journey.examOpen(['tens', 'odd'], played)).toBe(true);
  });

  it('promotes at 80 %, keeps what to work on after a miss, and finishes on the last level', () => {
    let { exam, result } = journey.applySitting(emptyExam(), 1, 1, 2, ['count']);
    expect(result).toMatchObject({ passed: false, weak: ['count'], fails: 1, nextLevel: null });
    expect(examLevelOpen(exam, 2)).toBe(false);
    ({ exam, result } = journey.applySitting(exam, 1, 2, 2, []));
    expect(result).toMatchObject({ passed: true, promoted: true, nextLevel: 2, finished: false });
    expect(examLevelOpen(exam, 2)).toBe(true);
    expect(journey.nextExamLevel(exam)).toBe(2);
    ({ exam, result } = journey.applySitting(exam, 2, 3, 3, []));
    expect(result.finished).toBe(true);
    expect(journey.nextExamLevel(exam)).toBe(null);
  });

  it('shows the road with the numbers of THIS lesson and gives one next step', () => {
    const p = journey.lessonProgress({ stage: 1, openKeys: ['tens'], practice: played, know: { read: ['a'] } });
    const nbsp = (label) => label.replace(/ /g, String.fromCharCode(160));
    expect(p.road.map((r) => r.label)).toEqual(['1 / 3', '1 / 2', '2 / 12', '0 / 2', '1 / 5'].map(nbsp));
    expect(p.rows.map((r) => r.game.max)).toEqual([6, 3]);
    expect(journey.nextStep({ stage: 0 })).toEqual({ do: 'story' });
    expect(journey.nextStep({ stage: 3, openKeys: ['tens', 'odd'], practice: {} })).toMatchObject({
      do: 'game',
      node: 0,
    });
    expect(journey.nextStep({ stage: 3, openKeys: ['tens', 'odd'], practice: played })).toEqual({
      do: 'exam',
      level: 1,
    });
    const failed = { ...emptyExam(), fails: { 1: 2 } };
    const tally = { tens: { ok: 3, n: 3 }, odd: { ok: 0, n: 2 } };
    expect(journey.nextStep({ stage: 3, openKeys: ['tens', 'odd'], practice: played, exam: failed, tally })).toEqual({
      do: 'train',
      key: 'odd',
      level: 1,
    });
  });
});

describe('kit/evidence — with a toy lesson', () => {
  it('counts a first try without help only, and names the الكفاءة of the key', () => {
    expect(counts({ firstTry: true, helped: false })).toBe(true);
    expect(counts({ firstTry: true, helped: true })).toBe(false);
    expect(counts({ firstTry: false })).toBe(false);
    const ev = createEvidence({ grade: '2am', points: { tens: 'P2' } });
    expect(ev.learningPointOf('some-lesson', 'tens')).toBe('2am_some-lesson_P2');
    expect(ev.payloadOf('some-lesson', 'case', { key: 'tens', claim: { n: 30 } }, 'id-1')).toEqual({
      attemptId: 'id-1',
      learningPoint: '2am_some-lesson_P2',
      context: 'case',
      claim: { n: 30 },
    });
    expect(ev.payloadOf('some-lesson', 'case', { key: 'odd', claim: {} }, 'id-2')).toBe(null);
    expect(ev.payloadOf('some-lesson', 'case', null, 'id-3')).toBe(null);
  });
});

describe('the kit boundary', () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const files = fs.readdirSync(here).filter((f) => /\.jsx?$/.test(f) && !/\.test\./.test(f));

  it('no kit file imports a lesson or a world', () => {
    for (const file of files) {
      const text = fs.readFileSync(path.join(here, file), 'utf8');
      const specs = [...text.matchAll(/from\s*'([^']+)'/g)].map((m) => m[1]);
      for (const spec of specs) {
        expect(spec, file).not.toMatch(/divisorIsles|\/moyen\/|\/worlds\//);
      }
    }
  });

  it('no kit file writes the id of a lesson or of a key of the pilot', () => {
    for (const file of files) {
      const text = fs.readFileSync(path.join(here, file), 'utf8');
      expect(text, file).not.toMatch(
        /qasim-adad-tabii|qasim-baqi|qasim-jidaa|siyagh-mutakafia|wahid-wa-nafsuh|divisor-isles/,
      );
    }
  });
});
