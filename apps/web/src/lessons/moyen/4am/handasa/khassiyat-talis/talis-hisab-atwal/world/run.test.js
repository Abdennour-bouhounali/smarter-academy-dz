import { describe, it, expect } from 'vitest';
import { rng } from '../../../../../../common/gameworld/kit/random';
import { plain, trueEqualities } from '../../../../../../common/gameworld/kit/authoring/test/suites.js';
import { bankNumbers, linesWithBoth, readBank } from '../../../../../../common/gameworld/kit/authoring/test/bank.js';
import {
  ENLARGE,
  GENERATORS,
  LEG_MIX,
  LEGS,
  REDUCE,
  SPARE,
  THINK,
  fairWave,
  gateOption,
  isRight,
  roundOf,
} from './run';
import { KEYS } from './journey';
import { compare, equal, over, read, times, write } from './math';
import { chainHolds, sameRatio } from '../../../../../../common/gameworld/kit/authoring/test/ratios';

const KINDS = Object.keys(GENERATORS);
const PARAMS = { nested: [{ find: 'VC' }, { find: 'MN' }] };
/** Every wave of every kind, over many seeds. */
const waves = (seeds = 60) =>
  KINDS.flatMap((kind) =>
    (PARAMS[kind] ?? [{}]).flatMap((params) =>
      Array.from({ length: seeds }, (_, s) => fairWave(rng((s + 1) * 7919 + kind.length), kind, params)),
    ),
  );
/** The numbers of a wave's order, read from its formula « AM = 6 \\quad AB = 14 … ». */
const given = (w) => Object.fromEntries([...w.tex.matchAll(/([A-Z]{2}) = (\d+)/g)].map(([, seg, n]) => [seg, n]));
/** k written in the order: « \\dfrac{7}{4} » or « 1{,}75 ». */
const kGiven = (w) => {
  const f = /\\dfrac\{(\d+)\}\{(\d+)\}/.exec(w.tex);
  return f ? `${f[1]}/${f[2]}` : write(read(/k = ([\d{},]+)/.exec(w.tex)[1]));
};
/**
 * The right buoy, computed HERE from what the order shows, by the proportion itself (never by `truthOf`): the value x
 * for which the lesson's ratios are equal.
 */
function truth(w) {
  const g = given(w);
  switch (w.type) {
    case 'nested':
      return w.find === 'VC' ? write(over(times(g.AB, g.AN), g.AM)) : write(over(times(g.AM, g.BC), g.AB));
    case 'whole':
      return write(over(times(Number(g.AM) + Number(g.MB), g.AN), g.AM));
    case 'fourth':
      return write(times(g.AB, kGiven(w)));
    case 'butterfly':
      return write(times(g.OT, kGiven(w)));
    case 'butterflyLen':
      return write(over(times(g.OC, g.OB), g.OA));
    case 'image':
      return write(times(/طوله (\d+)/.exec(w.say)[1], kGiven(w)));
    case 'back':
      return write(over('1', kGiven(w)));
    case 'direction':
      return compare(kGiven(w), '1') > 0 ? 'تكبير' : 'تصغير';
    default:
      return null;
  }
}
/** The right buoy makes the order a PROPORTION of the lesson: the chain of ratios holds with it, exactly. */
function proportion(w, x) {
  const g = given(w);
  const k = /\\dfrac\{(\d+)\}\{(\d+)\}/.test(w.tex) || /k = /.test(w.tex) ? kGiven(w) : null;
  switch (w.type) {
    case 'nested':
      return w.find === 'VC' ? sameRatio([g.AM, g.AB], [g.AN, x]) : sameRatio([g.AM, g.AB], [x, g.BC]);
    case 'whole':
      return sameRatio([g.AM, String(Number(g.AM) + Number(g.MB))], [g.AN, x]);
    case 'fourth':
      return sameRatio([x, g.AB], [read(k).n, read(k).d]);
    case 'butterfly':
      return sameRatio([x, g.OT], [read(k).n, read(k).d]);
    case 'butterflyLen':
      return chainHolds([g.OA, g.OC], [g.OB, x]);
    case 'image':
      return sameRatio([x, /طوله (\d+)/.exec(w.say)[1]], [read(k).n, read(k).d]);
    case 'back':
      return equal(times(x, k), '1');
    case 'direction':
      return x === (compare(k, '1') > 0 ? 'تكبير' : 'تصغير');
    default:
      return false;
  }
}

describe('the felucca’s legs of « خاصية طالس وحساب الأطوال »', () => {
  it('four legs, one per key in the order of the docks, each a course of four buoys', () => {
    expect(LEGS).toHaveLength(4);
    LEGS.forEach((leg, i) => {
      expect(leg.total).toBe(4);
      expect(leg.levels).toHaveLength(1);
      for (let n = 0; n < 8; n += 1) {
        const r = leg.round(1, rng(i * 31 + n + 1), n);
        expect(r.options).toHaveLength(3);
        expect(r.why).toHaveLength(3);
        expect(r.right).toBeGreaterThanOrEqual(0);
      }
      for (const [kind, params] of LEG_MIX[i]) expect(fairWave(rng(5), kind, params).key).toBe(KEYS[i]);
      // every buoy row is its kind's thinking time plus the owner's five seconds ahead (2026-11-25)
      for (let n = 0; n < 4; n += 1) {
        const [kind] = LEG_MIX[i][n % LEG_MIX[i].length];
        expect(leg.round(1, rng(n + 1), n).seconds).toBe(THINK[kind] + SPARE);
      }
    });
    expect(JSON.stringify(LEGS.map((l) => l.text))).not.toMatch(/خطأ|خاطئ|غلط/);
  });

  it('every buoy: exactly ONE right gate — the one the proportion gives — and no wrong buoy equals it', () => {
    const seen = new Set();
    for (const w of waves()) {
      seen.add(w.type);
      const tag = `${w.type} ${w.tex} ${JSON.stringify(w.gates)}`;
      const t = truth(w);
      expect(
        w.gates.filter((g) => isRight(w, g)),
        tag,
      ).toHaveLength(1);
      const right = w.gates[w.good];
      expect(w.type === 'direction' ? right : write(String(right)), tag).toBe(t);
      expect(proportion(w, String(right)), tag).toBe(true);
      // the wrong buoys: never the right value, never twice the same, never a proportion of the order
      const values = w.gates.map((g) => (w.type === 'direction' ? g : write(String(g))));
      expect(new Set(values).size, tag).toBe(3);
      for (const g of w.gates.filter((_, i) => i !== w.good)) {
        expect(w.type === 'direction' ? g : write(String(g)), tag).not.toBe(t);
        expect(proportion(w, String(g)), tag).toBe(false);
      }
      for (const g of w.gates) expect(String(g).length, tag).toBeLessThanOrEqual(6);
      plain(w.say);
      expect(w.tex, tag).not.toMatch(/[؀-ۿ]|\$/);
    }
    expect([...seen].sort()).toEqual([...KINDS].sort());
  });

  it('a wrong buoy equal to the right one is never offered: AB − p = AM when m(q − p) = p (k = 5/6, m = 5)', () => {
    // pick(REDUCE) → 5/6 (index 0), pick(M) → 5 (index 3), then the shuffles
    const seq = [0, 3.5 / 8];
    let i = 0;
    const rand = () => (i < seq.length ? seq[i++] : 0.37);
    const w = GENERATORS.fourth(rand);
    expect(w.tex).toContain('AB = 30');
    expect(w.gates.filter((g) => String(g) === '25')).toHaveLength(1); // 30 − 5 = 25 = AM: one buoy only, the right one
    expect(w.gates[w.good]).toBe(25);
  });

  it('a FACT for every buoy (never « wrong »), and every equality it isolates is true', () => {
    let checked = 0;
    for (const w of waves(30)) {
      const r = roundOf(w);
      for (const line of r.why) {
        expect(line, w.tex).toBeTruthy();
        expect(line).not.toMatch(/خطأ|خاطئ|غلط|undefined|NaN|null/);
        // a formula in a fact is read by MathText; the rest is plain and writes no fraction « p/q » as text
        const rest = line.replace(/\$[^$]*\$/g, '');
        plain(rest);
        expect(rest, line).not.toMatch(/\d\s*\/\s*\d/);
        checked += trueEqualities(line);
      }
    }
    expect(checked).toBeGreaterThan(400);
  });

  it('a gate is drawn over a real bar when it is a fraction', () => {
    expect(gateOption('4/7')).toEqual({ tex: '\\dfrac{4}{7}' });
    expect(gateOption(21)).toEqual({ t: '21' });
    expect(gateOption('13,75')).toEqual({ t: '13,75' });
  });
});

describe('the numbers of the legs are the platform’s own', () => {
  const bank = readBank('talis-hisab-atwal');
  it('no k of the legs is a number the bank writes', () => {
    const written = new Set([...bankNumbers(bank).keys()].filter((n) => /[,/]/.test(n)).map((n) => write(read(n))));
    expect(written.size).toBeGreaterThan(50);
    for (const k of [...REDUCE, ...ENLARGE]) {
      expect(written.has(write(k)), k).toBe(false);
      const [p, q] = k.split('/').map(Number);
      expect(q).toBeLessThanOrEqual(9);
      expect(p === q).toBe(false);
    }
    for (const k of REDUCE) expect(compare(k, '1')).toBe(-1);
    for (const k of ENLARGE) expect(compare(k, '1')).toBe(1);
  });

  it('no (piece, side) pair a buoy shows stands on one line of the bank', () => {
    const pairs = new Set();
    for (const w of waves(40)) for (const [a, b] of w.pairs) pairs.add([a, b].sort((x, y) => x - y).join(';'));
    expect(pairs.size).toBeGreaterThan(60);
    for (const key of pairs) {
      const [a, b] = key.split(';');
      expect(linesWithBoth(bank, a, b), key).toEqual([]);
    }
  });
});
