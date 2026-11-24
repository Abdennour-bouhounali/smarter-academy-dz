import { describe, it, expect } from 'vitest';
import { describeTrainer } from '../../../../../../common/gameworld/kit/authoring/test/suites.js';
import { linesWithBoth, readBank } from '../../../../../../common/gameworld/kit/authoring/test/bank.js';
import { rng } from '../../../../../../common/gameworld/kit/random';
import { trainerFigure } from '../../../../../../common/gameworld/kit/trainerFigure';
import { validateGeoFigure } from '../../../../../../common/components/geoFigure';
import { answerLabel, check, PLAN_OF, solution, trainer } from './trainer';
import { trainerEvidence } from './evidence';
import { KNOWLEDGE } from './knowledge';
import { FIGURES, FIELD, NUMBERS, equal, minus, over, plus, read, times, write } from './math';
import { chainHolds, sameRatio } from '../../../../../../common/gameworld/kit/authoring/test/ratios';

const CARDS = KNOWLEDGE.graph.nodes.map((n) => n.id);
const EXAM = ['nisba', 'nisab', 'tul', 'tulJuz', 'farasha', 'farashaNisab', 'muamil'];

describeTrainer({
  trainer,
  check,
  solution,
  answerLabel,
  evidenceOf: trainerEvidence,
  planOf: PLAN_OF,
  cards: CARDS,
  kinds: ['tap', 'tf', ...EXAM],
});

const all = (seeds = 30) =>
  CARDS.flatMap((card) =>
    Array.from({ length: seeds }, (_, s) => trainer.makeSession(rng((s + 1) * 7907 + card.length), card)).flat(),
  );
const num = (x) => write(x);

describe('« تدرّب » of « خاصية طالس وحساب الأطوال » — the lesson’s own', () => {
  it('every exam answer is computed HERE from the lengths the question gives, by the proportion itself', () => {
    const seen = new Set();
    for (const q of all()) {
      if (q.format !== 'exam' || q.kind === 'tf') continue;
      seen.add(q.kind);
      const v = solution(q);
      const f = q.f;
      switch (q.kind) {
        case 'nisba':
          // the ratio asked equals AM / AB, the side rebuilt from its pieces when they are given
          expect(sameRatio([v.n, v.d], [f.VM, q.pieces ? plus(f.VM, f.MB) : f.VB])).toBe(true);
          break;
        case 'tul':
        case 'tulJuz':
        case 'farasha':
          for (const s of q.sols ?? [q.sol]) {
            const known = { ...f };
            known[s.U] = null;
            // with his value in place of the unknown, the three ratios of the figure are equal
            const x = q.kind === 'farasha' ? (s === q.sols[0] ? v.x : v.y) : v.x;
            const fig = { ...f, [s.U]: x };
            expect(chainHolds([fig.VM, fig.VB], [fig.VN, fig.VC], [fig.MN, fig.BC]), q.prompt).toBe(true);
          }
          if (q.kind === 'tulJuz') expect(num(v.w)).toBe(num(plus(f[q.part], f[q.piece])));
          break;
        case 'muamil': {
          expect(sameRatio([v.kn, v.kd], [f[q.two[0]], f[q.one[0]]])).toBe(true);
          expect(equal(times(v.mn, v.kd), times(f[q.one[1]], v.kn))).toBe(true);
          expect(equal(times(`${v.kn}/${v.kd}`, `${v.bn}/${v.bd}`), '1')).toBe(true);
          expect(v.kind).toBe(v.kn > v.kd ? 'enlargement' : 'reduction');
          break;
        }
        default: {
          // the three ratios: each a segment from the vertex over its partner, the parallel sides last
          const n = q.names;
          expect([v.r1n, v.r1d, v.r2n, v.r2d, v.r3n, v.r3d].join(' ')).toBe(
            [n.V + n.M, n.V + n.B, n.V + n.N, n.V + n.C, n.M + n.N, n.B + n.C].join(' '),
          );
        }
      }
    }
    expect([...seen].sort()).toEqual([...EXAM].sort());
  });

  it('the false rules students hold are refused with a hint: the piece, the inverted ratio, the sum, k added', () => {
    let refused = 0;
    for (const q of all(10)) {
      const v = solution(q);
      const f = q.f;
      const tries = [];
      if (q.kind === 'nisba') tries.push({ n: f.VM.replace(',5', ''), d: 1 }, { n: v.d, d: v.n });
      if (q.kind === 'tul') tries.push({ x: write(over(times(f[q.sol.P], f[q.sol.D]), f[q.sol.Q])) });
      if (q.kind === 'tulJuz') tries.push({ ...v, w: f[q.piece] });
      if (q.kind === 'farasha') tries.push({ ...v, x: write(plus(f.VM, f.VB)) });
      if (q.kind === 'nisab') tries.push({ ...v, r1d: v.r1d.replace(q.names.V, q.names.M) });
      if (q.kind === 'muamil')
        tries.push({ ...v, kn: v.bn, kd: v.bd }, { ...v, mn: write(plus(f[q.one[1]], `${v.kn}/${v.kd}`)) });
      for (const t of tries) {
        const r = check(q, t);
        if (equal(read(String(q.kind === 'nisba' ? `${t.n}/${t.d}` : 1)), q.kind === 'nisba' ? q.k : '0')) continue;
        expect(r.ok, `${q.kind} ${JSON.stringify(t)}`).toBe(false);
        expect(r.hint).toBeTruthy();
        refused += 1;
      }
    }
    expect(refused).toBeGreaterThan(40);
  });

  it('the figures are the platform’s own: no two of their lengths stand on one line of the bank, none is the story’s', () => {
    const bank = readBank('talis-hisab-atwal');
    const figs = [...FIGURES.nested, ...FIGURES.butterfly, ...FIGURES.scale];
    for (const fig of figs) {
      const f = { ...fig };
      if (f.VN) {
        f.MB = write(minus(f.VB, f.VM));
        f.NC = write(minus(f.VC, f.VN));
      }
      const xs = [...new Set(Object.values(f))].map((x) => x.replace(',', '.'));
      for (let i = 0; i < xs.length; i += 1)
        for (let j = i + 1; j < xs.length; j += 1)
          expect(linesWithBoth(bank, xs[i], xs[j]), `${xs[i]} ; ${xs[j]}`).toEqual([]);
    }
    // the story's figures: the field, and the lesson's NUMBERS — never the same ratio pair
    const story = [
      [FIELD.canals[0].AM, FIELD.AB],
      ...Object.values(NUMBERS)
        .flatMap((g) => Object.values(g))
        .filter((x) => x && x.VM && x.VB)
        .map((x) => [x.VM, x.VB]),
    ].map(([a, b]) => `${num(a)};${num(b)}`);
    for (const fig of figs) expect(story, JSON.stringify(fig)).not.toContain(`${num(fig.VM)};${num(fig.VB)}`);
  });

  it('every question about a configuration carries its figure, and it FITS the trainer at its 12 px floor — every kind, many seeds', () => {
    const DRAWN = ['tf', ...EXAM];
    const seen = new Set();
    for (const q of all(60)) {
      if (!DRAWN.includes(q.kind)) {
        expect(q.figure, q.kind).toBeUndefined();
        continue;
      }
      seen.add(q.kind);
      expect(q.figure, `${q.kind} ${q.prompt}`).toBeTruthy();
      expect(validateGeoFigure(q.figure), q.prompt).toEqual([]);
      const t = trainerFigure(q.figure);
      expect(t.kind).toBe('plane');
      // beside its question (a column), or above a form of three fractions (the whole width, low)
      const above = q.kind === 'nisab' || q.kind === 'farashaNisab';
      expect(above ? t.fitsAbove : t.fits, `${q.kind} ${t.width}×${t.height} k=${t.k}`).toBe(true);
      expect(t.label).toBeGreaterThanOrEqual(12);
      // the words no longer describe the configuration: the parallel and the lengths only
      expect(q.prompt).not.toMatch(/نقطة من|متقاطعان/);
    }
    expect([...seen].sort()).toEqual(DRAWN.sort());
  });

  it('a figure writes the lengths its question gives and « ? » on what it asks, never the answer', () => {
    const labels = (q) => q.figure.segments.map((x) => x.label).filter((x) => x != null);
    for (const q of all(10)) {
      if (!q.figure) continue;
      const shown = labels(q).join(' ');
      if (q.kind === 'tul') {
        expect(shown, q.prompt).toContain('?');
        const ans = solution(q).x;
        expect(
          labels(q).some((x) => x === ans || x.endsWith(`= ${ans}`)),
          q.prompt,
        ).toBe(false);
      }
      if (q.kind === 'farasha') expect(labels(q).filter((x) => x.includes('?')).length).toBe(2);
      if (q.kind === 'nisab' || q.kind === 'farashaNisab') expect(labels(q)).toEqual([]);
      if (q.kind === 'muamil') {
        expect(shown).toContain('?');
        expect(labels(q)).not.toContain(solution(q).mn);
      }
    }
  });
});
