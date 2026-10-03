import { describe, it, expect } from 'vitest';
import { linear as LIN } from '@smarter-academy/core';
import * as L from './segmentDivider';
import { LEVELS } from '../levels';

/**
 * segment-divider — la logique de l'éventail des parallèles, sur les nombres du manuel :
 * [AB] en 3 parts (طرائق ص 107), MA/MB = 3/2 (طرائق ص 109, point intérieur ET extérieur K/N),
 * دوري الآن CA/CB = 2/5 (AC = 2/7 AB et 2/3 AB), تمرين 17 (AM/AB = 3/7), تمرين 19 (11/7 → 11/18 et 11/4).
 */
const T = (f) => LIN.fracText(f);
const repeat = (s, f, n) => { let x = s; for (let i = 0; i < n; i += 1) x = f(x); return x; };
const carryN = (s, n, rail) => repeat(s, (x) => L.carry(x, rail), n);
/** Trace toutes les parallèles des marques 0..joined-1 en glissant l'équerre sur chacune. */
const drawAll = (s) => { let x = s; for (let i = 0; i < x.joined; i += 1) x = L.draw(L.setSlide(x, L.rayMarks(x)[i].pos)); return x; };

describe('segment-divider — mode equal (3 parts égales)', () => {
  it('les niveaux de levels.js s’initialisent', () => {
    const b = L.init(LEVELS['segment-divider'].beginner.numbers);
    expect(b.mode).toBe('equal');
    expect(b.parts).toBe(3);
    expect(b.cap).toBe(4);
    const a = L.init(LEVELS['segment-divider'].advanced.numbers);
    expect(a.mode).toBe('ratio');
    expect([a.p, a.q, a.cap]).toEqual([3, 2, 5]);
  });

  it('trois reports égaux, la 3e marque reliée à B : [AB] en 3 parts égales de 10/3 cm', () => {
    let s = carryN(L.init({ parts: 3 }), 3);
    expect(L.rayMarks(s).map((m) => m.pos)).toEqual([15, 30, 45]);
    s = L.join(s, 2);
    expect(s.slide).toBe(45);
    s = drawAll(s);
    expect(L.complete(s)).toBe(true);
    const tr = s.trials.at(-1);
    expect(tr).toMatchObject({ n: 3, even: true, kind: 'ok', ok: true });
    expect(tr.parts.map(T)).toEqual(['1/3', '1/3', '1/3']);
    expect(L.lengthTex(s, tr.parts[0])).toBe('\\dfrac{10}{3} \\approx 3{,}33');
    expect(L.cutsOf(s).map((c) => T(c.t))).toEqual(['1/3', '2/3']);
  });

  it('les points de partage NE DÉPENDENT NI de l’ouverture NI de l’angle (balayage)', () => {
    for (let r = L.OPEN.equal.min; r <= 20; r += 1) {
      for (const angle of [20, 33, 47, 70]) {
        let s = L.setOpening(L.setAngle(L.init({ parts: 3 }), angle), r);
        s = drawAll(L.join(carryN(s, 3), 2));
        expect(s.trials.at(-1).parts.map(T)).toEqual(['1/3', '1/3', '1/3']);
      }
    }
  });

  it('une ouverture changée en route : des parts inégales, mesurées exactement', () => {
    let s = carryN(L.init({ parts: 3 }), 2); // 15, 30
    s = L.carry(L.setOpening(s, 25)); // 55
    expect(s.last).toMatchObject({ kind: 'carried', changed: true });
    s = drawAll(L.join(s, 2));
    const tr = s.trials.at(-1);
    expect(tr).toMatchObject({ kind: 'unequal', even: false, ok: false });
    expect(tr.parts.map(T)).toEqual(['3/11', '3/11', '5/11']);
    expect(tr.openings).toEqual([15, 15, 25]);
  });

  it('relier la mauvaise marque : (n − 1) marques → 2 parts (MISC-TALIS-ADAD-AL-ALAMAT), une marque au-delà coupe hors de [AB]', () => {
    let s = carryN(L.init({ parts: 3 }), 3);
    s = drawAll(L.join(s, 1));
    expect(s.trials.at(-1)).toMatchObject({ n: 2, kind: 'count', ok: false });
    expect(s.trials.at(-1).parts.map(T)).toEqual(['1/2', '1/2']);
    // la 3e marque, au-delà de la marque reliée : sa parallèle tombe à 3/2 de AB
    s = L.draw(L.setSlide(s, 45));
    expect(T(L.cutsOf(s).at(-1).t)).toBe('3/2');
  });

  it('les refus : angle verrouillé, rail plein, report après la jonction, tracé hors marque / sur la droite reliée / en double', () => {
    let s = L.carry(L.init({ parts: 3 }));
    expect(L.setAngle(s, 60).last.kind).toBe('angleLocked');
    s = carryN(s, 3);
    expect(L.canCarry(s)).toBe('full');
    expect(L.carry(s).last.kind).toBe('full');
    s = L.join(s, 2);
    expect(L.carry(L.fresh(s)).last.kind).toBe('carried');
    expect(L.draw(L.setSlide(s, 20)).last).toMatchObject({ kind: 'offMark', near: 0 });
    expect(L.draw(L.setSlide(s, 45)).last.kind).toBe('joinedLine');
    const once = L.draw(L.setSlide(s, 15));
    expect(L.draw(once).last.kind).toBe('already');
    expect(L.join(once, 3).last.kind).toBe('joinLocked');
    expect(L.draw(L.carry(L.init({ parts: 3 }))).last.kind).toBe('joinFirst');
  });

  it('l’équerre s’aimante à 3 mm d’une marque', () => {
    const s = L.join(carryN(L.init({ parts: 3 }), 3), 2);
    expect(L.snapSlide(s, 13)).toBe(15);
    expect(L.snapSlide(s, 18)).toBe(15);
    expect(L.snapSlide(s, 19)).toBe(19);
    expect(L.snapSlide(s, 99)).toBe(45);
    expect(L.neighbourMark(L.setSlide(s, 20), 1)).toBe(30);
    expect(L.neighbourMark(L.setSlide(s, 20), -1)).toBe(15);
  });

  it('la découverte : un essai juste ET un contraste (un essai raté, ou deux réglages)', () => {
    const one = drawAll(L.join(carryN(L.init({ parts: 3 }), 3), 2));
    expect(L.discoveryReady(one)).toBe(false);
    const same = drawAll(L.join(carryN(L.fresh(one), 3), 2));
    expect(L.discoveryReady(same)).toBe(false); // le même réglage : rien de nouveau
    const other = drawAll(L.join(carryN(L.setOpening(L.fresh(one), 22), 3), 2));
    expect(L.discoveryReady(other)).toBe(true);
    const wrong = drawAll(L.join(carryN(L.fresh(one), 2), 1));
    expect(L.discoveryReady(wrong)).toBe(true);
    const onlyWrong = drawAll(L.join(carryN(L.init({ parts: 3 }), 2), 1));
    expect(L.discoveryReady(drawAll(L.join(carryN(L.fresh(onlyWrong), 4), 3)))).toBe(false);
  });

  it('تمرين 17 : AM/AB = 3/7 — sept marques, la 7e reliée, la parallèle par la 3e', () => {
    let s = L.setOpening(carryN(L.init({ parts: 7 }), 0), 10);
    s = L.join(carryN(s, 7), 6);
    s = L.draw(L.setSlide(s, 30));
    expect(T(L.cutsOf(s)[0].t)).toBe('3/7');
  });

  it('la géométrie de l’équerre : V sur la règle, le bord passe par R(pos) et par C(pos) sur (AB), tout dans la boîte', () => {
    for (const angle of [20, 40, 70]) {
      let s = L.setAngle(L.init({ parts: 3 }), angle);
      s = L.join(carryN(L.setOpening(s, 25), 4), 3);
      const box = L.sceneBox(s);
      for (let pos = 0; pos <= L.slideMax(s); pos += 5) {
        const g = L.setSquareAt(s, pos);
        // V, R, C alignés selon u
        const cross = (p, q) => (p[0] - g.V[0]) * (q[1] - g.V[1]) - (p[1] - g.V[1]) * (q[0] - g.V[0]);
        expect(Math.abs(cross(g.R, g.C))).toBeLessThan(1e-6);
        // V sur la règle : V·u = c
        expect(Math.abs(g.V[0] * g.u[0] + g.V[1] * g.u[1] - g.c)).toBeLessThan(1e-9);
        for (const p of g.tri) {
          expect(p[0]).toBeGreaterThanOrEqual(box.x0 - 1e-6);
          expect(p[0]).toBeLessThanOrEqual(box.x1 + 1e-6);
          expect(p[1]).toBeGreaterThanOrEqual(box.y0 - 1e-6);
          expect(p[1]).toBeLessThanOrEqual(box.y1 + 1e-6);
        }
      }
    }
  });

  it('la boîte de la scène ne dépend pas de l’angle avant la jonction', () => {
    const a = L.sceneBox(L.setAngle(L.init({ parts: 3 }), 20));
    const b = L.sceneBox(L.setAngle(L.init({ parts: 3 }), 70));
    expect(a).toEqual(b);
    // le rayon entier tient dans la boîte, à tous les angles
    for (let ang = 20; ang <= 70; ang += 5) {
      const s = L.setAngle(L.init({ parts: 3 }), ang);
      const end = L.railPoint(s, 'ray', L.railLength(s));
      expect(end[0]).toBeLessThanOrEqual(a.x1);
      expect(end[1]).toBeLessThanOrEqual(a.y1);
    }
  });
});

describe('segment-divider — mode ratio (MA/MB = p/q, deux parallèles graduées)', () => {
  const R = (s, a, b) => L.commitRuler(L.setEnd(L.setEnd(s, 'a', a), 'b', b));
  const textbook = () => {
    let s = L.init({ mode: 'ratio', p: 3, q: 2, marks: 5 });
    s = carryN(s, 3, 'a+'); s = carryN(s, 3, 'a-'); s = carryN(s, 2, 'b+'); s = carryN(s, 2, 'b-');
    return s;
  };

  it('طرائق ص 109 : F à 3 sous A, E à 2 au-dessus de B → M dans [AB], AM/AB = 3/5, MA/MB = 3/2', () => {
    const s = R(textbook(), -36, 24);
    const j = s.joins.at(-1);
    expect(j).toMatchObject({ kind: 'inside', ok: true, inside: true, rankA: 3, rankB: 2 });
    expect(T(j.t)).toBe('3/5');
    expect(T(j.ratio)).toBe('3/2');
  });

  it('K du même côté que E : le point N hors de [AB], AN/AB = 3 (NA/NB = 3/2)', () => {
    const s = R(textbook(), 36, 24);
    const j = s.joins.at(-1);
    expect(j).toMatchObject({ kind: 'outside', inside: false });
    expect(T(j.t)).toBe('3');
    expect(T(j.ratio)).toBe('3/2');
    expect(L.found(s)).toEqual({ inside: false, outside: true });
  });

  it('inversé (2 côté A, 3 côté B) : MA/MB = 2/3 ; même rang : parallèle à (AB) ; ouvertures différentes : « units »', () => {
    let s = textbook();
    s = carryN(s, 2, 'b+'); // b+ : 24, 36, 48, 60
    expect(R(s, -24, 36).joins.at(-1).kind).toBe('inverted');
    expect(R(s, 24, 24).joins.at(-1)).toMatchObject({ kind: 'parallel', parallel: true });
    let u = L.init({ mode: 'ratio', p: 3, q: 2, marks: 5 });
    u = carryN(u, 3, 'a-');            // 12, 24, 36
    u = carryN(L.setOpening(u, 20), 2, 'b+'); // 20, 40 : deux marques mais une autre unité
    const j = R(u, -36, 40).joins.at(-1);
    expect(j.kind).toBe('units');
    expect(T(j.ratio)).toBe('9/10');
  });

  it('la découverte : le point intérieur ET le point extérieur', () => {
    let s = R(textbook(), -36, 24);
    expect(L.discoveryReady(s)).toBe(false);
    s = R(s, 36, 24);
    expect(L.discoveryReady(s)).toBe(true);
  });

  it('دوري الآن ص 109 : CA/CB = 2/5 → AC = 2/7 AB (dedans) et 2/3 AB (dehors, côté A)', () => {
    let s = L.init({ mode: 'ratio', p: 2, q: 5, marks: 5 });
    s = carryN(s, 2, 'a+'); s = carryN(s, 5, 'b-'); s = carryN(s, 5, 'b+');
    const inside = R(s, 24, -60).joins.at(-1);
    expect([inside.kind, T(inside.t)]).toEqual(['inside', '2/7']);
    const outside = R(s, 24, 60).joins.at(-1);
    expect([outside.kind, T(outside.t)]).toEqual(['outside', '-2/3']);
  });

  it('تمرين 19 : PM/PN = 11/7 → 11/18 (dedans) et 11/4 (dehors) — balayé sur t = a/(a − b)', () => {
    const s = L.init({ mode: 'ratio', p: 5, q: 5, marks: 5 });
    expect(T(L.rulerPoint(s, 110, -70).t)).toBe('11/18');
    expect(T(L.rulerPoint(s, 110, 70).t)).toBe('11/4');
    for (let a = -60; a <= 60; a += 6) {
      for (let b = -60; b <= 60; b += 6) {
        if (a === 0 || b === 0 || a === b) continue;
        const p = L.rulerPoint(s, a, b);
        expect(LIN.eq(p.t, LIN.div(LIN.frac(a), LIN.frac(a - b)))).toBe(true);
        expect(p.inside).toBe(LIN.cmp(p.t, LIN.frac(0)) > 0 && LIN.cmp(p.t, LIN.frac(1)) < 0);
      }
    }
  });

  it('la règle à moitié posée ne valide rien ; une marque inexistante n’est pas un bout de règle', () => {
    const s = textbook();
    expect(L.commitRuler(L.setEnd(s, 'a', 12)).last.kind).toBe('rulerHalf');
    expect(L.setEnd(s, 'a', 13)).toBe(s);
    expect(L.lineMarks(s, 'a')).toEqual([-36, -24, -12, 12, 24, 36]);
  });

  it('la boîte s’élargit pour montrer N (t = 3), pas au-delà de t ∈ [−3 ; 4]', () => {
    const s0 = textbook();
    const base = L.sceneBox(s0);
    const s = R(s0, 36, 24);
    expect(L.sceneBox(s).x1).toBeGreaterThanOrEqual(300);
    expect(base.x1).toBeLessThan(300);
  });
});
