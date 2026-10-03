import { describe, it, expect } from 'vitest';
import { linear as LIN } from '@smarter-academy/core';
import * as L from './coneCylinder';

const txt = LIN.fracText;

/**
 * cone-cylinder — « أدمج تعلّماتي » (p. 112) : cône H = 18, R = 6 ; le cylindre inscrit de hauteur h = r a
 * r = 4,5 et V = 91,125π ≈ 286,28 cm³ ; et le niveau مبتدئ de levels.js (H = 12, R = 4 → r = 3).
 */
describe('cone-cylinder — the cone refuses, the generatrix decides', () => {
  it('the situation: 24 graduations (h by 0,75, r by 0,25), h = r = 4,5 on the ruler', () => {
    const s = L.init({ H: 18, R: 6 });
    expect(s.n).toBe(24);
    expect([L.dec(s.hStep), L.dec(s.rStep)]).toEqual(['0,75', '0,25']);
    // la génératrice : au cran i de h, le bord permis est au cran n − i de r
    for (let i = 1; i < s.n; i += 1) expect(L.touchIndex(s, i)).toBe(s.n - i);
    const square = [];
    for (let i = 1; i < s.n; i += 1) if (L.probe(s, i, s.n - i).square) square.push(L.dec(L.hOf(s, i)));
    expect(square).toEqual(['4,5']);
    const st = L.probe(s, 6, 18);
    expect(txt(st.vop)).toBe('729/8');
    expect(L.dec(st.vop)).toBe('91,125');
    expect(L.volumeApprox(st.vop)).toBe('286,28');
  });

  it('starts inside, not touching (no answer on screen)', () => {
    const s = L.init({ H: 18, R: 6 });
    const st = L.status(s);
    expect(st.inscribed || st.pierce).toBe(false);
    expect(LIN.cmp(st.gap, LIN.frac(0))).toBeGreaterThan(0);
  });

  it('the cone refuses a rim that would pierce it — both handles', () => {
    let s = L.init({ H: 18, R: 6 }); // h = 9 (cran 12), r = 1 (cran 4) ; permis : r ≤ 3 (cran 12)
    s = L.setR(s, 13);
    expect(s.last.kind).toBe('pierceR');
    expect(s.rIdx).toBe(4);
    expect(L.dec(s.last.state.rMax)).toBe('3');
    s = L.setR(s, 12);
    expect(s.last.kind).toBe('r');
    expect(L.status(s).inscribed).toBe(true);
    // allonger un cylindre déjà au bord : il percerait
    s = L.setH(s, 14);
    expect(s.last.kind).toBe('pierceH');
    expect(s.hIdx).toBe(12);
    expect(s.refusals).toBe(2);
    // le raccourcir : il reste dedans, un jeu apparaît
    s = L.setH(s, 8);
    expect(L.status(s).inscribed).toBe(false);
    expect(L.dec(L.status(s).gap)).toBe('1');
  });

  it('every inscribed cylinder satisfies r ÷ R = (H − h) ÷ H; r + h and r × h are not constant', () => {
    const s = L.init({ H: 18, R: 6 });
    const sums = new Set(); const prods = new Set();
    for (let i = 1; i < s.n; i += 1) {
      const st = L.probe(s, i, s.n - i);
      expect(st.inscribed).toBe(true);
      const { left, right } = L.ratios(s, st.h, st.r);
      expect(LIN.eq(left, right)).toBe(true);
      sums.add(txt(LIN.add(st.h, st.r))); prods.add(txt(LIN.mul(st.h, st.r)));
    }
    expect(sums.size).toBeGreaterThan(1);
    expect(prods.size).toBeGreaterThan(1);
  });

  it('discovery: two inscribed lengths and a contrast; the goal is the square half-section', () => {
    let s = L.init({ H: 18, R: 6 });
    s = L.setR(s, 12); // h = 9, r = 3 inscrit
    expect(L.discoveryReady(s)).toBe(false);
    s = L.setH(s, 8); // h = 6, r = 3 : un jeu (contraste)
    s = L.setR(s, 16); // h = 6, r = 4 inscrit
    expect(L.discoveryReady(s)).toBe(true);
    expect(L.goalFound(s)).toBe(false);
    s = L.setH(s, 6); // h = 4,5 (r = 4 laisse un jeu)
    s = L.setR(s, 18); // r = 4,5
    expect(L.goalFound(s)).toBe(true);
    expect(L.evidenceOf(s)).toMatchObject({ kind: 'r', h: '4,5', r: '4,5', inscribed: true, square: true, vop: '91,125', approx: '286,28' });
  });

  it('beginner (levels.js): H = 12, R = 4 → 20 graduations, h = r = 3, V = 27π', () => {
    const s = L.init({ H: 12, R: 4 });
    expect(s.n).toBe(20);
    expect([L.dec(s.hStep), L.dec(s.rStep)]).toEqual(['0,6', '0,2']);
    const st = L.probe(s, 5, 15);
    expect(st.square).toBe(true);
    expect(L.dec(st.h)).toBe('3');
    expect(txt(st.vop)).toBe('27');
  });

  it('layout: the section fits the width and the height given, at five widths', () => {
    for (const [H, R] of [[18, 6], [12, 4]]) {
      const s = L.init({ H, R });
      for (const width of [280, 320, 390, 700, 1100]) {
        for (const height of [160, 240, 400]) {
          const g = L.layout(s, { width, height });
          expect(g.width).toBeLessThanOrEqual(width + 0.5);
          expect(g.height).toBeLessThanOrEqual(Math.max(height, 2 * 22 + 2 * R * 3) + 0.5);
          expect(g.X(H)).toBeLessThanOrEqual(width);
          expect(g.Y(R)).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});
