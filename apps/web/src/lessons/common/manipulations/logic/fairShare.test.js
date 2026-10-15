import { describe, it, expect } from 'vitest';
import * as FS from './fairShare';
import { LEVELS } from '../levels';

const B = LEVELS['fair-share'].beginner.numbers.orders;
const A = LEVELS['fair-share'].advanced.numbers.orders;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

describe('fair-share — judge (exact, b × x against a)', () => {
  it('the lesson numbers: 3 loaves for 4 children lands at 0,75, 5 for 6 never in decimal', () => {
    expect(FS.judge(3, 4, 'd2', 75)).toMatchObject({ kind: 'exact', ok: true });
    expect(FS.judge(3, 4, 'd2', 74).kind).toBe('short');
    expect(FS.judge(3, 4, 'd2', 76).kind).toBe('over');
    expect(FS.judge(5, 6, 'd2', 83)).toMatchObject({ kind: 'short', left: { n: 1, d: 50 } });
    expect(FS.judge(5, 6, 'd2', 84)).toMatchObject({ kind: 'over', missing: { n: 1, d: 25 } });
    expect(FS.judge(7, 3, 'd2', 233).left).toEqual({ n: 1, d: 100 });
    expect(FS.judge(7, 3, 'd3', 2333).left).toEqual({ n: 1, d: 1000 });
  });

  it('the cut ruler lands at m = a for EVERY a and b (sweep), and nowhere else', () => {
    for (let a = 1; a <= 12; a += 1) {
      for (let b = 1; b <= 9; b += 1) {
        const max = FS.mMaxOf(a, b, 'cut');
        const hits = [];
        for (let m = 0; m <= max; m += 1) if (FS.judge(a, b, 'cut', m).ok) hits.push(m);
        expect(hits, `${a} / ${b}`).toEqual([a]);
        expect(a).toBeLessThanOrEqual(max);
      }
    }
  });

  it('a decimal ruler lands exactly when the decimal writing of a/b stops within its digits (sweep)', () => {
    for (let a = 1; a <= 12; a += 1) {
      for (let b = 2; b <= 9; b += 1) {
        for (const d of [1, 2, 3]) {
          const ruler = `d${d}`;
          let lands = false;
          for (let m = 0; m <= FS.mMaxOf(a, b, ruler); m += 1) if (FS.judge(a, b, ruler, m).ok) lands = true;
          // b·m = a·10^d  ⇔  b divides a·10^d
          expect(lands, `${a} / ${b} ${ruler}`).toBe((a * 10 ** d) % b === 0);
        }
        const g = gcd(a, b);
        const reduced = b / g;
        const dd = FS.decimalDigits(a, b);
        const stops = [2, 5].reduce((q, p) => { while (q % p === 0) q /= p; return q; }, reduced) === 1;
        expect(dd !== null, `${a} / ${b}`).toBe(stops && (() => { let k = 0; while ((a * 10 ** k) % b !== 0) k += 1; return k <= 3; })());
      }
    }
  });

  it('the rail always holds the exact share, never at its very end', () => {
    for (let a = 1; a <= 12; a += 1) for (let b = 1; b <= 9; b += 1) expect(FS.railMax(a, b) * b).toBeGreaterThan(a);
  });

  it('the lesson numbers: the two orders of each level — decimal lands for 3/4 only; every other order never lands', () => {
    expect(B.map(([a, b]) => FS.decimalLands(a, b))).toEqual([true, false]);
    expect(A.map(([a, b]) => FS.decimalLands(a, b))).toEqual([false, false]);
    expect(FS.decimalDigits(3, 4)).toBe(2);
    expect(FS.decimalDigits(9, 2)).toBe(1);
  });
});

describe('fair-share — the flow', () => {
  it('the contrast: 3/4 by decimals, then 2/3 where only the cut ruler lands', () => {
    let s = FS.init({ orders: B });
    expect(FS.shownVerdict(s)).toBeNull();
    expect(s.trials).toHaveLength(0);
    s = FS.setM(s, 7);
    expect(s.trials).toHaveLength(0); // a gesture in progress is not a trial
    s = FS.commitM(s, 7);
    expect(s.trials).toHaveLength(1);
    expect(FS.canCut(s)).toBe(false);
    expect(FS.setRuler(s, 'cut').ruler).toBe('d1'); // locked until two decimal trials
    s = FS.commitM(s, 8);
    expect(FS.canCut(s)).toBe(true);
    s = FS.commitM(FS.setRuler(s, 'd2'), 75);
    expect(FS.orderSolved(s)).toBe(true);
    expect(FS.shownVerdict(s)).toMatchObject({ kind: 'exact' });
    expect(FS.canNext(s)).toBe(true);
    expect(FS.discoveryReady(s)).toBe(false);
    s = FS.next(s);
    expect([s.a, s.b, s.ruler, s.m]).toEqual([2, 3, 'd1', 0]);
    expect(FS.canNext(s)).toBe(false);
    s = FS.commitM(s, 6);
    s = FS.commitM(s, 7);
    s = FS.commitM(FS.setRuler(FS.commitM(FS.setRuler(s, 'd2'), 66), 'd2'), 67);
    expect(FS.orderSolved(s)).toBe(false);
    s = FS.commitM(FS.setRuler(s, 'cut'), 2);
    expect(FS.solvedByCut(s)).toBe(true);
    expect(FS.discoveryReady(s)).toBe(true);
  });

  it('switching ruler keeps the share (to the nearest step) and is not a trial', () => {
    let s = FS.init({ orders: A });
    s = FS.commitM(s, 3); s = FS.commitM(s, 4); // 0,3 then 0,4 on d1 (5 loaves, 6 children)
    const n = s.trials.length;
    s = FS.setRuler(s, 'd2');
    expect([s.m, s.trials.length]).toEqual([40, n]);
    s = FS.setRuler(s, 'cut'); // 0,4 of a loaf = 2,4 sixths → 2 pieces
    expect(s.m).toBe(2);
    s = FS.setRuler(s, 'd3');
    expect(s.m).toBe(333); // 2/6 = 0,333
    expect(s.trials).toHaveLength(n);
  });

  it('identical consecutive releases count once; trials keep order of the student', () => {
    let s = FS.init({ orders: B });
    s = FS.commitM(s, 5); s = FS.commitM(s, 5); s = FS.commitM(s, 6);
    expect(s.trials.map((t) => t.m)).toEqual([5, 6]);
  });

  it('clamps to the rail; the cut ruler never exceeds railMax loaves', () => {
    let s = FS.init({ orders: A });
    s = FS.commitM(FS.setM(s, 99999), 99999);
    expect(s.m).toBe(FS.mMaxOf(5, 6, 'd1'));
    s = FS.commitM(FS.setRuler(FS.commitM(s, 1), 'd2'), 2);
    s = FS.setRuler(s, 'cut');
    expect(FS.mMaxOf(5, 6, 'cut')).toBe(6);
  });

  it('reset starts over, memory of trials included', () => {
    let s = FS.commitM(FS.init({ orders: B }), 3);
    s = FS.reset(s);
    expect(s.trials).toHaveLength(0);
    expect(s.i).toBe(0);
  });
});

describe('fair-share — what the formal phase and the discovery say (the student\'s own numbers)', () => {
  const play = (orders, plan) => plan.reduce((s, step) => {
    if (step === 'next') return FS.next(s);
    if (step[0] === 'ruler') return FS.setRuler(s, step[1]);
    return FS.commitM(s, step[1]);
  }, FS.init({ orders }));

  it('formal: a/b for every order, the decimal when it exists, else the student\'s two decimal bounds', () => {
    const s = play(B, [['m', 7], ['m', 8], ['ruler', 'd2'], ['m', 75], 'next', ['m', 6], ['m', 7], ['ruler', 'd2'], ['m', 66], ['m', 67], ['ruler', 'cut'], ['m', 2]]);
    const f = FS.formalOf(s);
    expect(f.map((o) => o.fraction)).toEqual(['3/4', '2/3']);
    expect(f[0].decimal).toBe('0,75');
    expect(f[1].decimal).toBeNull();
    // 2/3 : the student's biggest short part and smallest over part
    expect(f[1].approx).toEqual({ below: '0,66', above: '0,67', fromTrials: true });
  });

  it('formal without both bounds falls back to the hundredths of the true quotient', () => {
    const s = play(A, [['m', 1], ['m', 2], ['ruler', 'cut'], ['m', 5]]);
    expect(FS.formalOf(s)[0].approx).toEqual({ below: '0,83', above: '0,84', fromTrials: false });
    expect(FS.formalOf(s)[1].approx.below).toBe('2,33');
    expect(FS.formalOf(s)[1].approx.above).toBe('2,34');
  });

  it('refutations: the nearest decimal part is shown with its exact total and gap; the upside-down fraction overshoots', () => {
    const s = play([[2, 3]], [['m', 6], ['ruler', 'd2'], ['m', 66], ['m', 60]]);
    const r = FS.refutations(s, 0);
    expect(r.decimal).toEqual({ x: '0,66', total: '1,98', gap: '0,02', kind: 'short' });
    expect(r.inverse).toEqual({ x: '3/2', total: '9/2', kind: 'over' });
  });
});

describe('fair-share — the coach is FOLLOWED to the end of the task (MANIPULATION_CONTRACT §8quater)', () => {
  const SELECTOR = /^\[data-[a-z-]+(="[^"]+")?\]$/;
  /** L'élève joue : il tire le curseur où il veut ; le test lui fait choisir une valeur proche du but ou la bonne. */
  const follow = (orders, { cheat = false } = {}) => {
    let s = FS.init({ orders });
    const ids = [];
    for (let n = 0; n < 600; n += 1) {
      const c = FS.coachOf(s);
      if (!c) break;
      ids.push(c.id);
      expect(c.target).toMatch(SELECTOR);
      if (c.id === 'handle' || c.id === 'again') {
        const unit = FS.unitOf(s.ruler, s.b);
        const exact = (s.a * unit.d) / (s.b * unit.n); // le pas juste (décimal ou morceaux)
        // le test joue un élève qui s'approche : la valeur juste si elle existe sur la règle, sinon un entier voisin
        const target = Number.isInteger(exact) ? exact : Math.floor(exact) + (n % 2);
        s = FS.commitM(s, cheat ? target : Math.max(0, target - 1 - (n % 3)));
        if (Number.isInteger(exact) && !cheat) s = FS.commitM(s, exact);
      } else if (c.id === 'rulers') {
        const tried = new Set(s.trials.filter((t) => t.i === s.i).map((t) => t.ruler));
        const nextRuler = FS.RULERS.find((r) => r !== s.ruler && !tried.has(r) && (r !== 'cut' || FS.canCut(s)));
        s = FS.setRuler(s, nextRuler);
      } else if (c.id === 'next') s = FS.next(s);
      else throw new Error(`étape inconnue ${c.id}`);
    }
    return { s, ids };
  };
  for (const [name, orders] of [['beginner', B], ['advanced', A]]) {
    it(`${name}: following the coach opens the discovery and then the coach is silent`, () => {
      const { s, ids } = follow(orders);
      expect(FS.discoveryReady(s)).toBe(true);
      expect(ids[0]).toBe('handle');
      expect(ids).toContain('rulers');
      expect(ids).toContain('next');
      expect(FS.coachOf(s)).toBeNull();
    });
  }
  it('never names a value or the right ruler: only controls (handle, the group of rulers, the next card)', () => {
    const { ids } = follow(B);
    expect(new Set(ids)).toEqual(new Set(['handle', 'again', 'rulers', 'next']));
  });
  it('the first thing shown is the handle; the rulers are shown only after two tries of one ruler fell short', () => {
    let s = FS.init({ orders: A });
    expect(FS.coachOf(s)).toEqual({ id: 'handle', target: '[data-fs-handle]', gesture: 'drag' });
    s = FS.commitM(s, 3);
    expect(FS.coachOf(s).id).toBe('again');
    s = FS.commitM(s, 4);
    expect(FS.coachOf(s)).toEqual({ id: 'rulers', target: '[data-fs-rulers]', gesture: 'tap' });
  });
});

describe('fair-share — geometry swept at five widths', () => {
  const widths = [210, 256, 320, 480, 720];
  it('the table: loaves, shares and the rail agree', () => {
    for (const w of widths) {
      for (const [a, b] of [...B, ...A, [8, 5]]) {
        const t = FS.tableLayout({ width: w, a, b });
        expect(t.x0).toBeGreaterThanOrEqual(0);
        expect(t.x1).toBeLessThanOrEqual(w);
        expect(t.A).toBe(b * FS.railMax(a, b));
        // the loaves end where the table ends
        expect(t.loaf(a - 1).x + t.loaf(a - 1).w).toBeCloseTo(t.tableEnd, 6);
        // b shares of x loaves laid end to end span b × x × u
        const x = 0.75;
        expect(t.share(b - 1, x).x1 - t.share(0, x).x0).toBeCloseTo(b * x * t.u, 6);
        expect(t.total(x)).toBeCloseTo(t.x0 + b * x * t.u, 6);
        // the largest legal total still fits on the axis
        expect(t.total(t.rail)).toBeLessThanOrEqual(t.x1 + 1e-6);
      }
    }
  });
  it('the ruler: ticks inside, never crushed under 3,2 px, the handle where the share is, pointer ↔ step round-trip', () => {
    for (const w of widths) {
      for (const [a, b] of [...B, ...A]) {
        for (const ruler of FS.RULERS) {
          const r = FS.rulerLayout({ width: w, rail: FS.railMax(a, b), ruler, b });
          for (const tk of r.ticks) expect(tk.x).toBeGreaterThanOrEqual(r.x0 - 1e-6);
          const xs = r.ticks.map((tk) => tk.x);
          for (let i = 1; i < xs.length; i += 1) expect(xs[i] - xs[i - 1], `${w} ${a}/${b} ${ruler}`).toBeGreaterThanOrEqual(3.2 - 1e-6);
          const max = FS.mMaxOf(a, b, ruler);
          for (const m of [0, 1, Math.floor(max / 2), max]) {
            expect(r.valueAt(r.handleX(m))).toBeCloseTo(m, 6);
          }
          expect(r.handleX(max)).toBeLessThanOrEqual(r.x1 + 1e-6);
          // piece numbers are never closer than 18 px
          const labels = r.ticks.filter((tk) => tk.label != null && ruler === 'cut').map((tk) => tk.x);
          for (let i = 1; i < labels.length; i += 1) expect(labels[i] - labels[i - 1]).toBeGreaterThanOrEqual(18 - 1e-6);
        }
      }
    }
  });
  it('the cut ruler has exactly one tick per piece, b per loaf', () => {
    const r = FS.rulerLayout({ width: 720, rail: 1, ruler: 'cut', b: 6 });
    expect(r.ticks.map((t) => t.j)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(r.ticks.filter((t) => t.whole).map((t) => t.j)).toEqual([0, 6]);
  });
  it('the kids: b slots across the width', () => {
    for (const w of widths) {
      for (const b of [3, 4, 5, 6]) {
        const k = FS.kidsLayout({ width: w, b });
        for (let i = 0; i < b; i += 1) {
          expect(k.cx(i) - k.slot / 2).toBeGreaterThanOrEqual(0);
          expect(k.cx(i) + k.slot / 2).toBeLessThanOrEqual(w);
        }
      }
    }
  });
});
