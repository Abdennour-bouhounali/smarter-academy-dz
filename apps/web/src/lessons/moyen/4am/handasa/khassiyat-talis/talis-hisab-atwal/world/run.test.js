import { describe, it, expect } from 'vitest';
import { rng } from '../../../../../../common/gameworld/kit/random';
import { plain, trueEqualities } from '../../../../../../common/gameworld/kit/authoring/test/suites.js';
import { bankNumbers, linesWithBoth, readBank } from '../../../../../../common/gameworld/kit/authoring/test/bank.js';
import { sameRatio } from '../../../../../../common/gameworld/kit/authoring/test/ratios';
import {
  ENLARGE,
  GENERATORS,
  LEG_MIX,
  LEGS,
  MAX,
  REDUCE,
  SPARE,
  THINK,
  fairWave,
  gateOption,
  isRight,
  roundOf,
} from './run';
import { KEYS } from './journey';
import { compare, equal, minus, over, plus, read, times, write } from './math';

const KINDS = Object.keys(GENERATORS);
/** Every wave of every kind, at both levels of numbers, over many seeds. */
const waves = (seeds = 60) =>
  KINDS.flatMap((kind) =>
    [{}, { big: true }].flatMap((params) =>
      Array.from({ length: seeds }, (_, s) => fairWave(rng((s + 1) * 7919 + kind.length), kind, params)),
    ),
  );

/** A number of the calculation as the order writes it: « 7{,}5 » → « 7,5 »; a sum « 4 + 8 » → 12. */
const num = (t) => {
  const s = t.replace(/\{,\}/g, ',').trim();
  return s.includes('+') ? write(s.split('+').reduce((a, b) => plus(a, b.trim()), '0')) : s;
};
/** The formula with its decimal commas unbraced (« 7{,}5 » → « 7,5 »), to be read by the patterns below. */
const flat = (tex) => tex.replace(/\{,\}/g, ',');
/** The four places of « \\dfrac{a}{b} = \\dfrac{c}{d} » (null in the box), read from the formula. */
function equation(tex) {
  const m = /^\\dfrac\{([^}]+)\}\{([^}]+)\} = \\dfrac\{([^}]+)\}\{([^}]+)\}$/.exec(flat(tex));
  return m && m.slice(1).map((t) => (t === '\\square' ? null : num(t)));
}
/**
 * The right buoy, computed HERE from what the order shows (never by `truthOf`): the value x for which the two fractions
 * are equal, the product divided, the side times k, the number that brings k back to 1.
 */
function truth(w) {
  const eq = equation(w.tex);
  if (eq) {
    const [a, b, c, d] = eq;
    if (d == null) return write(over(times(b, c), a));
    if (c == null) return write(over(times(a, d), b));
    if (b == null) return write(over(times(a, d), c));
    return write(over(times(b, c), d));
  }
  let m = /^\\dfrac\{([\d,]+) \\times ([\d,]+)\}\{([\d,]+)\}$/.exec(flat(w.tex));
  if (m) return write(over(times(num(m[1]), num(m[2])), num(m[3])));
  m = /^(\d+) \\times \\dfrac\{(\d+)\}\{(\d+)\}$/.exec(w.tex);
  if (m) return write(over(times(m[1], m[2]), m[3]));
  m = /^(\d+) \\div (\d+)$/.exec(w.tex);
  if (m) return write(over(m[1], m[2]));
  m = /^\\dfrac\{(\d+)\}\{(\d+)\} \\times \\square = 1$/.exec(w.tex);
  if (m) return write(over(m[2], m[1]));
  return null;
}
/**
 * The MISTAKES a real student makes on the calculation the order shows — recomputed HERE from the formula: on a / b =
 * c / □ the gap added (c + b − a), the division forgotten, the wrong diagonal, the ratio upside down, the sum forgotten
 * (the piece alone); on « \\dfrac{x \\times y}{a} » the division forgotten, the gap added, the other quotients; on a side
 * × k the division or the multiplication forgotten, k upside down, the gap of k added; on b ÷ a the difference, the
 * product, the quotient upside down; on k × □ = 1 the same k, what is added to k to make 1, its terms' sum over p.
 */
function mistakes(w) {
  const eq = equation(w.tex);
  if (eq) {
    const hole = eq.indexOf(null);
    const v = (i) => eq[i];
    const mate = v(hole ^ 1);
    const across = v(hole ^ 2);
    const opposite = v(3 - hole);
    const out = [
      minus(plus(mate, across), v(hole ^ 1 ^ 2)),
      times(mate, across),
      over(times(mate, opposite), across),
      over(times(across, opposite), mate),
    ];
    // a sum written « a + b »: the piece alone in its place
    const sum = /\\dfrac\{([^}]+)\}\{([^}]+)\}/g;
    const raw = [...flat(w.tex).matchAll(sum)].flatMap((x) => [x[1], x[2]]);
    const at = raw.findIndex((t) => t.includes('+'));
    if (at >= 0) {
      const alone = [...eq];
      alone[at] = num(raw[at].split('+')[1]);
      const [a, b, c, d] = alone;
      out.push(
        d == null
          ? over(times(b, c), a)
          : c == null
            ? over(times(a, d), b)
            : b == null
              ? over(times(a, d), c)
              : over(times(b, c), d),
      );
    }
    return out.map(write);
  }
  let m = /^\\dfrac\{([\d,]+) \\times ([\d,]+)\}\{([\d,]+)\}$/.exec(flat(w.tex));
  if (m) {
    const [x, y, a] = [num(m[1]), num(m[2]), num(m[3])];
    return [times(x, y), minus(plus(x, y), a), over(times(a, x), y), over(times(a, y), x)].map(write);
  }
  m = /^(\d+) \\times \\dfrac\{(\d+)\}\{(\d+)\}$/.exec(w.tex);
  if (m) {
    const [s, p, q] = m.slice(1);
    return [times(s, p), over(s, q), over(times(s, q), p), minus(plus(s, p), q)].map(write);
  }
  m = /^(\d+) \\div (\d+)$/.exec(w.tex);
  if (m) {
    const [b, a] = m.slice(1);
    return [String(Math.abs(b - a)), times(a, b), over(a, b)].map(write);
  }
  m = /^\\dfrac\{(\d+)\}\{(\d+)\} \\times \\square = 1$/.exec(w.tex);
  if (m) {
    const [p, q] = m.slice(1).map(Number);
    return [over(p, q), over(Math.abs(q - p), q), over(p + q, p)].map(write);
  }
  return [];
}
/** Every number the calculation writes (« 7{,}5 » read 7,5; the « 1 » of k × □ = 1 is not a length). */
const numbersOf = (tex) =>
  [...tex.replace(/= 1$/, '').matchAll(/\d+(?:\{,\}\d+)?/g)].map((m) => m[0].replace('{,}', ','));
/** The pairs the calculation shows: two different numbers of which one is ten or more — recomputed HERE. */
const pairsShown = (tex) => {
  const xs = numbersOf(tex);
  return xs
    .flatMap((x, i) => xs.slice(i + 1).map((y) => [x, y]))
    .filter(([x, y]) => x !== y && Math.max(...[x, y].map((t) => Number(t.replace(',', '.')))) >= 10);
};

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

  it('every buoy is ONE bare calculation: a short order, the calculation, no letter, no figure (owner, 2026-11-27)', () => {
    for (const w of waves(30)) {
      const r = roundOf(w);
      expect(['أكمل', 'احسب'], `${w.type} ${w.say}`).toContain(w.say);
      expect(r).not.toHaveProperty('figure');
      // no letter of a point, no Arabic word, no « $ » in the calculation — only numbers, operations and the box
      expect(w.tex.replace(/\\[a-z]+/g, ''), w.tex).not.toMatch(/[A-Za-z]|[؀-ۿ]|\$/);
      // a box to fill for « أكمل », none for « احسب »
      expect(w.tex.includes('\\square'), w.tex).toBe(w.say === 'أكمل');
    }
    expect(LEGS[0].round(1, rng(3), 0)).not.toHaveProperty('figure');
    expect(LEGS[3].round(1, rng(3), 0)).not.toHaveProperty('figure');
  });

  it('every buoy: exactly ONE right gate — the one the calculation gives — and the wrong ones are REAL mistakes', () => {
    const seen = new Set();
    for (const w of waves()) {
      seen.add(w.type);
      const tag = `${w.type} ${w.tex} ${JSON.stringify(w.gates)}`;
      const t = truth(w);
      expect(t, tag).toBeTruthy();
      expect(
        w.gates.filter((g) => isRight(w, g)),
        tag,
      ).toHaveLength(1);
      const right = w.gates[w.good];
      expect(write(String(right)), tag).toBe(write(t));
      // the equality with the right number in the box holds by its cross products
      const eq = equation(w.tex);
      if (eq) {
        const full = eq.map((v) => v ?? String(right));
        expect(sameRatio([full[0], full[1]], [full[2], full[3]]), tag).toBe(true);
      }
      const values = w.gates.map((g) => write(String(g)));
      expect(new Set(values).size, tag).toBe(3);
      const slips = mistakes(w);
      for (const g of w.gates.filter((_, i) => i !== w.good)) {
        expect(equal(String(g), t), tag).toBe(false);
        // a wrong buoy is one of the mistakes of THAT calculation, never a random number
        expect(
          slips.some((s) => equal(s, String(g))),
          `${tag}: ${g} is no mistake of ${slips}`,
        ).toBe(true);
      }
      for (const g of w.gates) expect(String(g).length, tag).toBeLessThanOrEqual(6);
      plain(w.say);
    }
    expect([...seen].sort()).toEqual([...KINDS].sort());
  });

  it('the buoys of one calculation look alike: whole beside a whole answer, a decimal beside a decimal, fractions for k back', () => {
    for (const w of waves(40)) {
      const shown = w.gates.map(String);
      if (w.type === 'back') for (const g of shown) expect(g, w.tex).toMatch(/^\d+\/\d+$/);
      else if (['halfCross', 'halfEquality'].includes(w.type))
        for (const g of shown) expect(g, w.tex).toMatch(/^\d+(,5)?$/);
      else if (w.type === 'decimal') for (const g of shown) expect(g, w.tex).toMatch(/^\d+(,\d)?$/);
      else if (w.type === 'coefficient') for (const g of shown) expect(g, w.tex).toMatch(/^\d+(,\d{1,2})?$/);
      else for (const g of shown) expect(g, w.tex).toMatch(/^\d+$/);
      if (w.type === 'decimal') expect(String(w.gates[w.good]), w.tex).toContain(',');
      // the butterfly's calculations carry a decimal length: written in the order, or the one he finds
      if (w.type === 'halfCross') expect(w.tex, w.type).toContain('{,}5');
      if (w.type === 'halfEquality') expect(`${w.tex} ${w.gates[w.good]}`, w.type).toMatch(/\{,\}5|,5/);
    }
  });

  it('MENTAL numbers: every number a calculation writes is at most MAX, a decimal has one digit after its comma', () => {
    expect(MAX).toBe(72);
    for (const w of waves(40)) {
      for (const n of numbersOf(w.tex)) {
        expect(compare(n, String(MAX)), `${w.tex}: ${n}`).toBeLessThanOrEqual(0);
        expect(n, w.tex).toMatch(/^\d+(,5)?$/);
      }
      // the formula itself stays short: at most four numbers
      expect(numbersOf(w.tex).length, w.tex).toBeLessThanOrEqual(4);
    }
  });

  it('the second level draws bigger numbers than the first (`{ big: true }`)', () => {
    const biggest = (kind, params) =>
      Math.max(
        ...Array.from({ length: 40 }, (_, s) => fairWave(rng((s + 1) * 211 + kind.length), kind, params)).flatMap((w) =>
          numbersOf(w.tex).map((n) => Number(n.replace(',', '.'))),
        ),
      );
    for (const kind of KINDS.filter((k) => !['coefficient', 'back'].includes(k)))
      expect(biggest(kind, { big: true }), kind).toBeGreaterThan(biggest(kind, {}));
  });

  it('a FACT for every buoy (never « wrong »), and every equality it writes is true', () => {
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
        // a fact stays mental too: no number of four digits
        expect(line.replace(/\{,\}/g, ','), line).not.toMatch(/\d{4}/);
        checked += trueEqualities(line);
      }
    }
    expect(checked).toBeGreaterThan(400);
  });

  it('a gate is drawn over a real bar when it is a fraction', () => {
    expect(gateOption('4/7')).toEqual({ tex: '\\dfrac{4}{7}' });
    expect(gateOption(21)).toEqual({ t: '21' });
    expect(gateOption('7,5')).toEqual({ t: '7,5' });
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

  it('no pair of numbers a buoy shows (one of ten or more) stands on one line of the bank', () => {
    const pairs = new Set();
    for (const w of waves(40)) {
      // the wave's own `pairs` are the ones its calculation shows
      const own = new Set(w.pairs.map((p) => [...p].sort().join(';')));
      expect([...own].sort(), w.tex).toEqual([...new Set(pairsShown(w.tex).map((p) => p.sort().join(';')))].sort());
      for (const key of own) pairs.add(key);
    }
    expect(pairs.size).toBeGreaterThan(60);
    for (const key of pairs) {
      const [a, b] = key.split(';');
      expect(linesWithBoth(bank, a, b), key).toEqual([]);
    }
  });
});
