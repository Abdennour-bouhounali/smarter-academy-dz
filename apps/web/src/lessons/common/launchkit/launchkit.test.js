import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { toolsForLesson, getItem } from '@smarter-academy/core/curriculum/dz/net/learningNet.js';
import { FAMILIES, MISTAKES, familyFor, makeQuestion, pickForm, complete, grade } from './families';
import {
  planTools,
  nextStep,
  kitOf,
  scoreOf,
  honesty,
  priorities,
  flowOf,
  mergeKit,
  workshopTool,
  gateOf,
  CAP,
  BANDS,
} from './engine';

const rng = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};
/** The full-mark answer of a question, computed here — never read from the question. */
const right = (q) =>
  q.gesture === 'write'
    ? { q: String(Math.floor(q.a / q.b)), r: String(q.a % q.b) }
    : q.gesture === 'place'
      ? { x: q.b * Math.floor(q.a / q.b), moved: true }
      : Object.fromEntries(
          q.cards.map((c) => [
            c.id,
            (() => {
              const m = c.text.match(/^\$(\d+) = (\d+) \\times (\d+) ([+-]) (\d+)\$$/);
              if (!m) return c.n % q.k === 0 ? 'yes' : 'no';
              const [a, b, k, sign, r] = [Number(m[1]), Number(m[2]), Number(m[3]), m[4], Number(m[5])];
              return sign === '+' && b * k + r === a && r < b ? 'yes' : 'no';
            })(),
          ]),
        );
const each = (fn) => {
  for (const f of Object.values(FAMILIES))
    for (const level of [1, 2])
      for (const form of f.forms[level])
        for (let seed = 1; seed <= 150; seed += 1)
          fn(f, level, form, makeQuestion(rng(seed * 7 + level), f.item, level, form, { first: seed % 5 === 0 }), seed);
};

describe('عُدّة الانطلاق — the question families', () => {
  it('every family is an item of the learning net, with its home lesson, its instrument and its revision card', () => {
    for (const f of Object.values(FAMILIES)) {
      expect(getItem(f.item), f.item).toBeTruthy();
      expect(f.memo.length).toBeGreaterThanOrEqual(3);
      expect(f.forms[1].length).toBeGreaterThanOrEqual(1);
      expect(f.forms[2].length).toBeGreaterThanOrEqual(2);
      expect(readFileSync(new URL('../lessonlab/registry.js', import.meta.url), 'utf8')).toContain(
        `id: '${f.labTool}'`,
      );
    }
    expect(familyFor('4am.m1.r01')).toBe(null);
  });

  it('every generated question is true: the answer computed apart is graded right, and it can be handed in', () => {
    let n = 0;
    each((f, level, form, q) => {
      n += 1;
      const a = right(q);
      expect(complete(q, a), `${f.item} ${form}`).toBe(true);
      expect(grade(q, a), `${f.item} L${level} ${form}: ${JSON.stringify(q).slice(0, 200)}`).toEqual({
        correct: true,
        mistake: null,
      });
      expect(q.prompt).not.toMatch(/undefined|NaN/);
    });
    expect(n).toBeGreaterThan(1300);
  });

  it('keeps the numbers of each level where they belong', () => {
    each((f, level, form, q, seed) => {
      if (q.gesture === 'write' && level === 1) {
        expect(q.b).toBeLessThanOrEqual(9);
        expect(Math.floor(q.a / q.b)).toBeLessThanOrEqual(9);
        expect(q.a % q.b).toBeGreaterThan(0);
      }
      if (q.gesture === 'write' && level === 1 && seed % 5 === 0) expect(q.a).toBeLessThanOrEqual(29); // the very first question of a launch: a near-certain win
      if (q.gesture === 'write' && level === 2) {
        expect(q.b).toBeGreaterThanOrEqual(11);
        expect(q.a).toBeLessThanOrEqual(250);
      }
      if (q.gesture === 'place') {
        expect(q.a).toBeLessThan(q.max);
        expect(q.target).toBe(q.b * Math.floor(q.a / q.b));
        expect(q.a % q.b).toBeGreaterThan(0);
      }
      if (q.gesture === 'sort') {
        expect(q.cards).toHaveLength(3);
        expect(new Set(q.cards.map((c) => c.text)).size).toBe(3);
        expect(q.cards.some((c) => c.bin === 'yes')).toBe(true);
        expect(q.cards.some((c) => c.bin === 'no')).toBe(true);
      }
    });
  });

  it('a wrong answer names its mistake when it shows one', () => {
    const w = { gesture: 'write', a: 47, b: 6 };
    expect(grade(w, { q: '6', r: '11' })).toEqual({ correct: false, mistake: 'rest-too-big' });
    expect(grade(w, { q: '5', r: '7' })).toEqual({ correct: false, mistake: 'swapped' });
    expect(grade(w, { q: '7', r: '4' })).toEqual({ correct: false, mistake: 'equality-false' });
    const p = { gesture: 'place', a: 47, b: 6, target: 42 };
    expect([48, 36, 45].map((x) => grade(p, { x }).mistake)).toEqual(['overshoot', 'not-greatest', 'not-multiple']);
    each((f, level, form, q) => {
      if (q.gesture !== 'sort') return;
      for (const c of q.cards) {
        if (c.trap) {
          expect(MISTAKES[c.trap], c.trap).toBeTruthy();
          expect(c.bin).toBe('no');
          const a = { ...right(q), [c.id]: 'yes' };
          expect(grade(q, a)).toEqual({ correct: false, mistake: grade(q, a).mistake });
          expect(grade(q, a).mistake).toBeTruthy();
        }
      }
    });
    expect(complete({ gesture: 'place' }, { x: 12 })).toBe(false);
    expect(complete(makeQuestion(rng(3), '1am.m3.r01', 1, 'write'), { q: '7', r: '' })).toBe(false);
  });

  it('the workshop example is a true worked example, on the rule that was missed', () => {
    for (let seed = 1; seed <= 80; seed += 1)
      for (const level of [1, 2]) {
        const d = FAMILIES['1am.m3.r01'].example(rng(seed), level);
        const m = d.steps.at(-1).match(/\$(\d+) = (\d+) \\times (\d+) \+ (\d+)\$/);
        expect(Number(m[2]) * Number(m[3]) + Number(m[4])).toBe(Number(m[1]));
        expect(Number(m[4])).toBeLessThan(Number(m[2]));
        for (const k of [2, 3, 4, 5, 9]) {
          const e = FAMILIES['1am.m3.r02'].example(rng(seed), level, { k });
          const n = Number(e.title.match(/\d+/)[0]);
          expect(e.steps.at(-1)).toContain(n % k === 0 ? `${n} يقبل` : `${n} لا يقبل`);
          expect(e.steps.join(' ')).not.toMatch(/undefined|NaN/);
        }
      }
  });

  it('changes the form of the question inside a launch', () => {
    expect(pickForm('1am.m3.r01', 1, [])).toBe('write');
    expect(pickForm('1am.m3.r01', 1, ['1:write'])).toBe('place');
    expect(pickForm('1am.m3.r01', 2, ['1:write'])).toBe('write');
    expect(pickForm('1am.m3.r02', 2, ['2:three', '2:nine'])).toBe('four');
  });
});

describe('عُدّة الانطلاق — the engine of a launch', () => {
  const links = toolsForLesson('qasim-adad-tabii');
  const has = (id) => Boolean(familyFor(id));
  const tools = planTools(links, has);
  const [A, B] = tools.map((t) => t.item);
  const ans = (item, level, correct, extra = {}) => ({
    item,
    level,
    correct,
    unsure: false,
    phase: 'station',
    mistake: null,
    ...extra,
  });
  const play = (answers, extra = {}) => nextStep({ tools, answers, elapsed: 30, ...extra });

  it('takes its tools from the learning net: the two earlier الكفاءات of the pilot lesson, each with its home lesson', () => {
    expect(tools.map((t) => [t.item, t.lesson.code, t.grade, t.weight])).toEqual([
      ['1am.m3.r01', 'qisma-iqlidiya-baqi', '1am', 'core'],
      ['1am.m3.r02', 'qawaid-qabiliyat-qisma', '1am', 'support'],
    ]); // the core tool is measured first
    expect(planTools(links, () => false)).toEqual([]);
  });

  it('asks an easy question then a harder one, and stops as soon as it knows', () => {
    expect(play([])).toEqual({ type: 'question', item: A, level: 1, phase: 'station', first: true });
    expect(play([ans(A, 1, true)])).toMatchObject({ item: A, level: 2, first: false });
    expect(play([ans(A, 1, true), ans(A, 2, true)])).toMatchObject({ item: B, level: 1 });
    expect(play([ans(A, 1, true), ans(A, 2, true), ans(B, 1, true), ans(B, 2, true)])).toEqual({ type: 'result' }); // four answers, no workshop
  });

  it('never judges a tool on one answer, and a doubt is not a success', () => {
    expect(play([ans(A, 1, false)])).toMatchObject({ item: A, level: 1 }); // a second easy one
    expect(play([ans(A, 1, false), ans(A, 1, true)])).toMatchObject({ item: A, level: 2 });
    expect(play([ans(A, 1, true, { unsure: true })])).toMatchObject({ item: A, level: 1 });
    const kit = kitOf(tools, [ans(A, 1, false), ans(A, 1, false), ans(B, 1, true), ans(B, 2, false)]);
    expect(kit.map((t) => [t.band, t.segments])).toEqual([
      [BANDS.START, 0],
      [BANDS.CONSOLIDATE, 1],
    ]);
    expect(scoreOf(kit)).toEqual({ lit: 1, total: 4, percent: 25 });
  });

  it('repairs the weakest tool on the spot: an example, two questions — and a repaired tool is not « ثابتة » yet', () => {
    const base = [ans(A, 1, false, { mistake: 'rest-too-big' }), ans(A, 1, false), ans(B, 1, true), ans(B, 2, false)];
    expect(workshopTool(tools, base)).toEqual({ item: A, level: 1 });
    expect(play(base)).toEqual({ type: 'example', item: A, level: 1 });
    expect(play(base, { exampleSeen: true })).toMatchObject({ type: 'question', item: A, level: 1, phase: 'workshop' });
    const shop = (c1, c2) => [...base, ans(A, 1, c1, { phase: 'workshop' }), ans(A, 1, c2, { phase: 'workshop' })];
    expect(play(shop(true, true), { exampleSeen: true })).toEqual({ type: 'result' }); // ONE workshop: B is not repaired in the same launch
    expect(kitOf(tools, shop(true, true))[0]).toMatchObject({
      band: BANDS.CONSOLIDATE,
      repaired: true,
      segments: 1,
      mistakes: ['rest-too-big'],
    });
    expect(kitOf(tools, shop(true, false))[0]).toMatchObject({ band: BANDS.START, repaired: false });
    expect(priorities(kitOf(tools, shop(true, false))).first.item).toBe(A);
    expect(priorities(kitOf(tools, shop(true, true))).first.item).toBe(B); // not repaired comes before repaired
    expect(play(base, { skipWorkshop: true })).toEqual({ type: 'result' });
  });

  it('respects the five minutes and the twelve questions: what was not asked stays « لم نفحصها بعد » and does not cost points', () => {
    expect(nextStep({ tools, answers: [ans(A, 1, true), ans(A, 2, true)], elapsed: CAP.seconds })).toEqual({
      type: 'result',
    });
    const kit = kitOf(tools, [ans(A, 1, true), ans(A, 2, true)]);
    expect(kit[1].band).toBe(BANDS.UNSEEN);
    expect(scoreOf(kit)).toEqual({ lit: 2, total: 2, percent: 100 });
    expect(
      nextStep({
        tools,
        answers: [ans(A, 1, false), ans(A, 1, false), ans(B, 1, true), ans(B, 2, true)],
        elapsed: CAP.seconds - 10,
      }),
    ).toEqual({ type: 'result' }); // no time left for a workshop
    expect(scoreOf(kitOf(tools, [])).percent).toBe(null);
  });

  it('a tool measured « ثابتة » in the last three weeks arrives charged and is not asked again', () => {
    const now = 1e12;
    const store = mergeKit(
      {},
      'qasim-adad-tabii',
      kitOf(tools, [ans(A, 1, true), ans(A, 2, true), ans(B, 1, true), ans(B, 2, false)]),
      now,
    );
    expect(store.items[A]).toEqual({ band: BANDS.SOLID, repaired: false, at: now });
    expect(store.lessons['qasim-adad-tabii']).toMatchObject({
      tries: 1,
      last: { percent: 75 },
      first: { percent: 75 },
    });
    const again = planTools(links, has, store.items, now + 5 * 86400000);
    expect(again.map((t) => t.known)).toEqual([true, false]);
    expect(nextStep({ tools: again, answers: [] })).toMatchObject({ item: B, level: 1, first: true });
    expect(planTools(links, has, store.items, now + 30 * 86400000).map((t) => t.known)).toEqual([false, false]); // three weeks later it is asked again
    const second = mergeKit(store, 'qasim-adad-tabii', kitOf(again, [ans(B, 1, true), ans(B, 2, true)]), now + 9);
    expect(second.lessons['qasim-adad-tabii']).toMatchObject({
      tries: 2,
      first: { percent: 75 },
      last: { percent: 100 },
    });
    expect(second.items[A].at).toBe(now); // a tool that was not asked keeps its date
  });

  it('the gate: ONE capsule for a CORE tool left empty — it opens by doing, whatever the answers say', () => {
    const miss = (item) => [ans(item, 1, false), ans(item, 1, false)];
    const solid = (item) => [ans(item, 1, true), ans(item, 2, true)];
    const cap = (item, c1, c2) => [ans(item, 1, c1, { phase: 'capsule' }), ans(item, 1, c2, { phase: 'capsule' })];
    expect(gateOf(kitOf(tools, [...solid(A), ...solid(B)]))).toBe(null);
    expect(gateOf(kitOf(tools, [...miss(A), ...solid(B)])).item).toBe(A); // the division is core: the lesson cannot be passed without it
    expect(gateOf(kitOf(tools, [...solid(A), ...miss(B)]))).toBe(null); // the rules are a support: they never close the door
    expect(gateOf(kitOf(tools, [ans(A, 1, true), ans(A, 2, false), ...miss(B)]))).toBe(null); // « تحتاج تثبيتًا » is enough to go
    expect(gateOf(kitOf(tools, [ans(A, 1, false)]))).toBe(null); // a tool the clock did not let finish is not « نبدأ منها »
    const failed = kitOf(tools, [...miss(A), ...solid(B), ...cap(A, false, true)]);
    expect(failed[0]).toMatchObject({ band: BANDS.START, capsule: true, repaired: false });
    expect(gateOf(failed)).toBe(null); // done, not passed: he goes in, the tool stays flagged
    const passed = kitOf(tools, [...miss(A), ...solid(B), ...cap(A, true, true)]);
    expect(passed[0]).toMatchObject({ band: BANDS.CONSOLIDATE, capsule: true, repaired: true });
    expect(gateOf(kitOf(tools, [...miss(A), ...solid(B), ans(A, 1, true, { phase: 'capsule' })])).item).toBe(A); // one answer is not the capsule
    expect(mergeKit({}, 'qasim-adad-tabii', failed, 5).items[A]).toEqual({
      band: BANDS.START,
      repaired: false,
      capsule: true,
      at: 5,
    });
    const unclassified = tools.map((t) => ({ ...t, weight: null }));
    expect(gateOf(kitOf(unclassified, [...solid(A), ...miss(B)])).item).toBe(B); // not classified yet counts as core
  });

  it('gives the honesty star to a student who knows what he knows', () => {
    const a = (correct, unsure) => ({ correct, unsure });
    expect(honesty([a(true, false), a(true, false), a(false, true), a(true, false)])).toMatchObject({
      star: true,
      matched: 4,
    });
    expect(honesty([a(true, false), a(false, false), a(false, false), a(true, false)]).star).toBe(false); // sure and wrong twice
    expect(honesty([a(true, true), a(true, true), a(true, true)]).star).toBe(false); // doubting everything is not knowing
    expect(honesty([a(true, false), a(true, false)]).star).toBe(false); // too few answers to say
    expect([
      flowOf([]),
      flowOf([ans(A, 1, true), ans(A, 2, true)]),
      flowOf([ans(A, 1, true), ans(A, 2, false)]),
      flowOf(Array(6).fill(ans(A, 1, true))),
    ]).toEqual([0, 2, 0, 3]);
  });
});

describe('عُدّة الانطلاق — the sounds', () => {
  const read = (f) => readFileSync(new URL(f, import.meta.url), 'utf8');
  const namesIn = (src) =>
    [...src.matchAll(/(?:play|playRef\.current)\(([^)]*?)[,)]/g)].flatMap((m) =>
      [...m[1].matchAll(/'([a-zA-Z]+)'/g)].map((x) => x[1]),
    );

  it('every sound the launch plays exists in its palette, and every sound of the palette is played', async () => {
    const { SOUND_NAMES, GAP, SOUNDS } = await import('./sound');
    const used = new Set(['./LaunchKit.jsx', './gestures.jsx'].flatMap((f) => namesIn(read(f))));
    for (const name of used) expect(SOUND_NAMES, `« ${name} » is played but not in sound.js`).toContain(name);
    for (const name of SOUND_NAMES) expect([...used], `« ${name} » is in sound.js but never played`).toContain(name);
    for (const k of Object.keys(GAP)) expect(Object.keys(SOUNDS)).toContain(k);
  });

  it('a sound is short and quiet; the two boxes of a sort have each their note, whatever the card', async () => {
    const { LaunchSound, SOUNDS } = await import('./sound');
    const s = new LaunchSound();
    const made = [];
    let now = 0;
    s.wake = () => {
      s.ctx = {
        get currentTime() {
          return now;
        },
        state: 'running',
      };
    };
    s.tone = (o) => made.push({ kind: 'tone', ...o });
    s.noise = (o) => made.push({ kind: 'noise', ...o });
    for (const name of Object.keys(SOUNDS)) {
      made.length = 0;
      now += 5;
      expect(s.play(name, 2), name).toBe(true);
      expect(made.length, name).toBeGreaterThan(0);
      for (const o of made) {
        expect((o.t ?? 0) + (o.d ?? 0.2), name).toBeLessThanOrEqual(name === 'liftoff' ? 1.7 : 1.3);
        /* only the take-off lasts */ expect(o.g ?? 0.2, name).toBeLessThanOrEqual(0.3);
      }
    }
    const notes = (yes) => {
      made.length = 0;
      now += 5;
      s.play('drop', yes);
      return made
        .filter((o) => o.kind === 'tone')
        .map((o) => Math.round(o.f))
        .join();
    };
    expect(notes(1)).not.toBe(notes(0)); // a box is recognised by its note — which says nothing about right or wrong
  });

  it('the bed of music gains a layer with the flow, and is silent about the answers', async () => {
    const { LaunchSound } = await import('./sound');
    const count = (flow) =>
      Array.from({ length: 32 }, (_, beat) => LaunchSound.layers(flow, beat).length).reduce((a, b) => a + b, 0);
    expect(count(0)).toBeGreaterThan(0);
    expect(count(1)).toBeGreaterThan(count(0));
    expect(count(2)).toBeGreaterThan(count(1));
    expect(count(3)).toBeGreaterThan(count(2));
    for (let beat = 0; beat < 64; beat += 1)
      for (const o of LaunchSound.layers(3, beat)) expect(o.g).toBeLessThanOrEqual(0.06);
  });
});
