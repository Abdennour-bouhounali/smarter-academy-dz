import { describe, it, expect } from 'vitest';
import { commonOf, nestOf } from '../../../../../../common/gameworld/divisorIsles/inquiry';
import { descentOf, outsideWitness, plankOn } from '../../../../../../common/gameworld/divisorIsles/summit';
import { dealOf, dealsThatWork, mostLots } from '../../../../../../common/gameworld/divisorIsles/deal';
import { COMMON_INQUIRY, DEAL_INQUIRY, NEST_INQUIRY, SUMMIT_INQUIRY, inVases } from './inquiries';
import { FORGES } from './forges';
import { KEYS } from './journey';
import { commonDivisors, gcd } from './math';
import { NUMBERS, STORY } from './story';

const [W1, W2] = NUMBERS.twin.gaps;
const said = (x) => expect(String(x)).not.toMatch(/undefined|NaN|null|\[object/);
/** Every sentence of an experiment is said, and none states the rule it leads to. */
const noRule = (lines, words) => {
  for (const line of lines) {
    said(line);
    expect(line, line).not.toMatch(words);
  }
};
/** A label drawn as plain text (SVG, a shelf, a column head): no formula. */
const plain = (x) => {
  said(x);
  expect(x, x).not.toMatch(/\$|\\/);
};
/** The words of each key's rule — none may be said by its experiment (the question it opens may name what it seeks). */
const RULE_WORDS = {
  // the shelves are « fills a », « fills b », « fills both »: the NAME of what is found comes with the tablet
  'qawasim-mushtaraka': /مشترك|قاسم|قواسم|PGCD|أطول|الأكبر|دائمًا/,
  // the search for the longest: neither its name nor where it stops
  'al-akbar': /PGCD|القاسم المشترك الأكبر|الأكبر|مشترك|يكفي|لا داعي|لا حاجة|نتوقّف|توقّف|دائمًا/,
  // the vases: not a word of divisors
  'baqat-mutamathila': /قاسم|قواسم|مشترك|يقسم|PGCD|الأكبر|دائمًا/,
  // the planks of the longest: never « divisors », never « the same », never « exactly »
  'qawasim-al-pgcd': /قاسم|قواسم|مشترك|بالضبط|نفسها|هي نفس|تساوي|دائمًا/,
};
/** The (kind, mode) of an experiment: two keys of the lesson never share one. */
const kindOf = (spec) =>
  `${spec.kind}:${spec.mode ?? spec.rounds?.[0]?.mode ?? ''}:${spec.crown === false ? 'nocrown' : ''}`;

describe('the four experiments of « القاسم المشترك الأكبر » — each rule found by an experiment of its own', () => {
  it('EVERY key opens on an experiment of its own kind — no two keys share a (kind, mode)', () => {
    const specs = KEYS.map((k) => FORGES[k].inquiry);
    expect(specs.map((s) => s.kind)).toEqual(['common', 'summit', 'deal', 'nest']);
    expect(new Set(specs.map(kindOf)).size).toBe(KEYS.length);
    expect([COMMON_INQUIRY, SUMMIT_INQUIRY, DEAL_INQUIRY, NEST_INQUIRY]).toEqual(specs);
    for (const s of specs) expect(s.writes, s.kind).toBeUndefined();
  });

  it('COMMON: the twins he crossed — 11 and 13 that he used, planks of both, one of neither, the plank 1; the longest is not asked', () => {
    expect(COMMON_INQUIRY.crown).toBe(false);
    const [round] = COMMON_INQUIRY.rounds;
    expect([round.a, round.b]).toEqual(NUMBERS.twin.gaps);
    const c = commonOf(round.a, round.b, round.candidates);
    const shelf = (r) => (r.both ? 'both' : r.holdsA ? 'a' : r.holdsB ? 'b' : 'none');
    expect(new Set(c.rows.map(shelf))).toEqual(new Set(['a', 'b', 'both', 'none'])); // every shelf lives
    expect(round.candidates.slice(0, 2)).toEqual([NUMBERS.twin.first, NUMBERS.twin.plank]);
    expect(shelf(c.rows[0])).toBe('a');
    expect(shelf(c.rows[1])).toBe('b');
    expect(round.candidates).toContain(1);
    // the pile holds EVERY plank of both: the count he types is the number of them
    expect(c.common).toEqual(commonDivisors(round.a, round.b));
    expect(c.longest).toBe(gcd(round.a, round.b));
    // a plank of neither that fills the gap the twins make glued — the false rule « the glued gap » is refuted by it
    const glued = c.rows.filter((r) => shelf(r) === 'none' && (round.a + round.b) % r.d === 0);
    expect(glued.map((r) => r.d)).toEqual([4]);
    expect(new Set(round.candidates).size).toBe(round.candidates.length);
  });

  it('COMMON: every sentence says what the planks did, and none states the rule nor names the longest', () => {
    const T = COMMON_INQUIRY.text;
    const lines = [T.take({}), T.yes, T.no, T.lay, T.sayCount, T.check, T.sayFirst({}), T.next, T.done];
    for (const { a, b, candidates } of COMMON_INQUIRY.rounds) {
      const c = commonOf(a, b, candidates);
      lines.push(T.lead(a, b), T.goal(a, b), T.sayLead({ a, b, crown: false }), T.onA(a), T.onB(b));
      for (const r of c.rows) {
        lines.push(T.ask({ a, b, d: r.d }));
        for (const guess of [
          { a: true, b: true },
          { a: r.holdsA, b: r.holdsB },
        ])
          lines.push(T.seen({ a, b, ...r, guessA: guess.a, guessB: guess.b }, guess));
      }
      const f = { a, b, crown: false, common: c.common, longest: null };
      lines.push(T.sayMiss({ ...f, said: { longest: null, count: 4 } }), T.sayOk({ ...f, said: { count: 6 } }));
      lines.push(T.foundLine({ ...f, rows: c.rows, said: { count: 6 } }));
      for (const k of ['a', 'b', 'both', 'none']) lines.push(T.shelf[k](a, b));
    }
    noRule(lines, RULE_WORDS['qawasim-mushtaraka']);
    for (const x of [
      T.goal(W1, W2),
      T.onA(W1),
      T.onB(W2),
      T.sayCount,
      ...['a', 'b', 'both', 'none'].map((k) => T.shelf[k](W1, W2)),
    ])
      plain(x);
    // a count agrees with what it counts; the miss never gives the count
    expect(T.sayOk({ a: W1, b: W2, common: [1, 2, 3, 6, 9, 18] })).toContain('6 ألواح على رفّ « يملأ 198 و 234 »');
    expect(T.sayMiss({ a: W1, b: W2, common: [1, 2, 3, 6, 9, 18], said: { count: 5 } })).not.toMatch(/\b6\b/);
  });

  it('SUMMIT: from the plank 14 down the planks of 266 — then the twins from the top: 198, 99, 66, 33, 22, 18', () => {
    const [first, second] = SUMMIT_INQUIRY.rounds;
    expect([first.a, first.b]).toEqual(NUMBERS.second.gaps);
    expect(first.start).toBe(NUMBERS.second.plank);
    expect(plankOn(first.a, first.b, first.start).both).toBe(true);
    expect(descentOf(first.a, first.b)).toMatchObject({ planks: [266, 133, 38, 19, 14], crown: 14, rest: [7, 2, 1] });
    expect(outsideWitness(first.a, first.b, [])).not.toBe(null); // the outside question is asked
    expect([second.a, second.b]).toEqual(NUMBERS.twin.gaps);
    expect(second.start).toBeUndefined();
    expect(descentOf(second.a, second.b)).toMatchObject({ planks: [198, 99, 66, 33, 22, 18], crown: 18 });
    for (const r of SUMMIT_INQUIRY.rounds) expect(descentOf(r.a, r.b).crown).toBe(gcd(r.a, r.b));
  });

  it('SUMMIT: every sentence says what the planks did, and none names the PGCD or where the search stops', () => {
    const T = SUMMIT_INQUIRY.text;
    const lines = [T.unit, T.lay, T.line, T.go, T.countUnit, T.countGo, T.yes, T.no, T.next, T.done];
    for (const r of SUMMIT_INQUIRY.rounds) {
      const { a, b } = r;
      const D = descentOf(a, b);
      const ctx = { a, b, short: D.short, long: D.long };
      lines.push(T.lead(a, b, 'search'), T.goal(a, b), T.chipsLabel(D.short), T.outsideAsk(ctx), T.countAsk(ctx));
      for (const d of [r.start ?? 7, 28, 1, 400].filter((x) => x <= D.long)) {
        const p = plankOn(a, b, d);
        lines.push(T.start({ a, b, ...p }), T.tried({ a, b, ...p, best: 14, isBest: p.both }));
        lines.push(T.outsideSeen({ ...ctx, ...p, mine: true, guess: false }));
      }
      lines.push(
        T.freeAsk({ a, b, best: null, left: 2 }),
        T.freeAsk({ a, b, best: 14, left: 1 }),
        T.freeBound({ max: D.long }),
      );
      for (const d of D.planks) {
        lines.push(T.descentAsk({ ...ctx, d }));
        for (const guess of [true, false, null]) lines.push(T.descentSeen({ ...ctx, ...plankOn(a, b, d), guess }));
      }
      const crowned = { ...ctx, crown: D.crown, tries: D.tries, guessCount: null };
      lines.push(T.crowned(crowned), T.restAsk({ ...ctx, crown: D.crown, rest: D.rest.length }));
      for (const checked of [true, false]) lines.push(T.restSeen({ ...crowned, rest: D.rest, checked }));
      lines.push(T.countSeen({ ...crowned, said: 3 }));
      lines.push(T.foundLine({ a, b, crown: D.crown, descent: D.planks.map((d) => ({ d })) }));
    }
    noRule(lines, RULE_WORDS['al-akbar']);
    for (const x of [T.goal(266, 322), T.unit, T.line, T.countUnit, T.chipsLabel(266)]) plain(x);
    // counts agree: « جرّبتَ 5 ألواح », « بقيت 3 ألواح », « بقي لوحان », « بقيت محاولتان »
    expect(T.crowned({ a: 266, b: 322, short: 266, long: 322, crown: 14, tries: 5 })).toContain('جرّبتَ 5 ألواح');
    expect(T.crowned({ a: 1, b: 2, short: 1, long: 2, crown: 1, tries: 2 })).toContain('جرّبتَ لوحين');
    expect(T.restAsk({ short: 266, crown: 14, rest: 3 })).toContain('بقيت 3 ألواح');
    expect(T.restAsk({ short: 9, crown: 3, rest: 2 })).toContain('بقي لوحان');
    expect(T.freeAsk({ best: 14, left: 2 })).toContain('بقيت محاولتان');
  });

  it('DEAL: 40 roses and 56 lilies — numbers of vases that leave roses only, lilies only, both, and 8 among them', () => {
    const { a, b, choices, minTries } = DEAL_INQUIRY;
    expect([a.n, b.n]).toEqual([NUMBERS.bouquets.roses, NUMBERS.bouquets.lilies]);
    expect(dealsThatWork(a.n, b.n)).toEqual([1, 2, 4, 8]);
    expect(mostLots(a.n, b.n)).toEqual({ k: 8, x: 5, y: 7 });
    expect(choices).toContain(8);
    expect(Math.max(...choices)).toBeLessThanOrEqual(12);
    const deals = choices.map((k) => dealOf(a.n, b.n, k));
    expect(deals.some((d) => d.rA > 0 && d.rB === 0)).toBe(true); // roses left only (7)
    expect(deals.some((d) => d.rA === 0 && d.rB > 0)).toBe(true); // lilies left only (5, 10)
    expect(deals.some((d) => d.rA > 0 && d.rB > 0)).toBe(true); // both left (3, 6, 12)
    expect(deals.filter((d) => d.ok).map((d) => d.k)).toEqual([2, 4, 8]);
    expect(minTries).toBe(4);
  });

  it('DEAL: every sentence says what the vases hold and what is left — never a word of divisors', () => {
    const T = DEAL_INQUIRY.text;
    const { a, b } = DEAL_INQUIRY;
    const lines = [
      T.lead(a, b),
      T.goal(a, b),
      T.toAnswer,
      T.back,
      T.check,
      T.answerLead({ a, b }),
      T.yes,
      T.no,
      T.done,
    ];
    lines.push(T.lotsUnit, T.unitA, T.unitB, ...Object.values(T.cols), T.bound({ max: 12 }));
    for (const tried of [0, 3]) lines.push(T.choose({ a, b, tried }));
    for (const k of [1, ...DEAL_INQUIRY.choices]) {
      const d = dealOf(a.n, b.n, k);
      const row = { k, qA: d.qA, qB: d.qB, restA: d.rA, restB: d.rB, ok: d.ok };
      lines.push(T.ask({ a, b, k }));
      for (const guess of [true, false, null]) lines.push(T.dealt({ a, b, ...row, guess }));
      lines.push(T.again({ a, b, ...row }));
      lines.push(T.miss({ a, b, kind: 'deal', said: { k, x: 3, y: 3 }, row }));
    }
    const row8 = { k: 8, qA: 5, qB: 7, restA: 0, restB: 0, ok: true };
    lines.push(T.miss({ a, b, kind: 'bigger', said: { k: 4, x: 10, y: 14 }, row: row8 }));
    lines.push(T.miss({ a, b, kind: 'open', said: { k: 4, x: 10, y: 14 }, row: null }));
    lines.push(T.ok({ a, b, said: { k: 8, x: 5, y: 7 } }));
    noRule(lines, RULE_WORDS['baqat-mutamathila']);
    for (const x of [T.goal(a, b), T.lotsUnit, T.unitA, T.unitB, ...Object.values(T.cols)]) plain(x);
    // the open miss never gives the answer; a deal says what is left, agreed
    expect(T.miss({ a, b, kind: 'open', said: { k: 4, x: 10, y: 14 }, row: null })).not.toMatch(/\d/);
    expect(T.dealt({ a, b, k: 6, qA: 6, qB: 9, restA: 4, restB: 2, ok: false, guess: false })).toContain(
      'وبقي على الطاولة 4 ورود و زنبقتان',
    );
    expect(T.dealt({ a, b, k: 2, qA: 20, qB: 28, restA: 0, restB: 0, ok: true, guess: true })).toMatch(
      /^مزهريتان: في كلّ واحدة 20 وردة و 28 زنبقة، ولم تبقَ أيّ زهرة\. كما توقّعت!$/,
    );
    expect(inVases(2)).toBe('مزهريتين');
    expect(inVases(12)).toBe('12 مزهرية');
  });

  it('NEST: 228 and 276, their longest common plank 12 given — planks of 12, of one gap only, longer, and 8', () => {
    const [round] = NEST_INQUIRY.rounds;
    expect([round.a, round.b]).toEqual([NUMBERS.baskets.dates, NUMBERS.baskets.figs]);
    const n = nestOf(round.a, round.b, round.probes);
    expect(n.g).toBe(NUMBERS.baskets.plank);
    expect(n.equal).toBe(true);
    const kinds = n.rows.map((r) => ({
      ...r,
      a: round.a % r.p === 0,
      b: round.b % r.p === 0,
    }));
    expect(kinds.filter((r) => r.inG).length).toBeGreaterThanOrEqual(3); // planks of 12
    expect(kinds.some((r) => r.a !== r.b)).toBe(true); // a plank of one gap only
    expect(kinds.some((r) => r.p > n.g && !r.a && !r.b)).toBe(true); // longer than 12, of neither
    expect(kinds.some((r) => r.p < n.g && !r.inG)).toBe(true); // under 12, not a plank of it
    for (const r of kinds) expect(r.inG).toBe(r.both); // the fact the experiment shows, probe by probe
    // the first probe is a plank of both, the second is not: the first answer does not give the pattern away
    expect([kinds[0].both, kinds[1].both]).toEqual([true, false]);
    // the stone's question came first: its baskets that work are planks of 12
    for (const k of STORY.text.quiz.baskets.answer) expect(n.g % k).toBe(0);
  });

  it('NEST: every sentence says what the planks did on the three gaps — never « divisors » nor « the same »', () => {
    const T = NEST_INQUIRY.text;
    const lines = [T.yes, T.no, T.next, T.done];
    for (const { a, b, probes } of NEST_INQUIRY.rounds) {
      const n = nestOf(a, b, probes);
      lines.push(T.lead(a, b), T.goal(a, b), T.divisorsLabel(n.g), T.commonLabel(a, b), T.compare({ a, b, ...n }));
      for (const r of n.rows) {
        const f = { a, b, g: n.g, ...r, holdsA: a % r.p === 0, holdsB: b % r.p === 0 };
        lines.push(T.ask(f));
        for (const guess of [true, false]) lines.push(T.seen({ ...f, guess }, guess), T.foundLine({ ...f, guess }));
      }
    }
    noRule(lines, RULE_WORDS['qawasim-al-pgcd']);
    for (const x of [T.goal(228, 276), T.divisorsLabel(12), T.commonLabel(228, 276)]) plain(x);
    // the notation, which 👑 has given, names the longest plank
    expect(T.given({ a: 228, b: 276, g: 12 })).toBe('$\\mathrm{PGCD}(228 ; 276) = 12$');
  });
});
