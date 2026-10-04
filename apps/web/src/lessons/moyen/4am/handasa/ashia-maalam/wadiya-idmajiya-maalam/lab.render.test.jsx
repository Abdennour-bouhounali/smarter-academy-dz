import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { vectors as V, trigonometry as TR } from '@smarter-academy/core';
import '../../../../../../i18n';
import RouteCompare from '../../../../../common/manipulations/vectors/RouteCompare';
import ManipulationWorkspace from '../../../../../common/manipulations/ManipulationWorkspace';
import * as RC from '../../../../../common/manipulations/logic/routeCompare';
import { LEVELS } from '../../../../../common/manipulations/levels';
import { LAB, LAB_EXPECT } from './content/textbook';
import * as FIG from './content/figures';

/**
 * Le workspace du module 1 de la synthèse — `route-compare`, deux niveaux (le rallye ; le cross de la وضعية) — rendu avec
 * EXACTEMENT les props que le module étale (content/textbook.js › LAB) ; puis la mathématique que les modules 1, 3 et 4
 * supposent, recalculée avec packages/core (vectors.js) et posée par la main dans la logique du lab (logic/routeCompare.js).
 */
const workspace = () => (
  <ManipulationWorkspace
    defaultLevel="advanced"
    levels={{
      beginner: () => <RouteCompare level="beginner" {...LAB.beginner} />,
      advanced: () => <RouteCompare level="advanced" {...LAB.advanced} />,
    }}
  />
);
const P = (a) => V.point(a[0], a[1]);
const d = (a, b) => TR.surdText(V.distance(P(a), P(b)));

it('les deux niveaux se rendent dans le workspace, sans clé brute ni réponse', () => {
  const html = renderToString(workspace());
  expect((html.match(/data-route-compare="true"/g) ?? []).length).toBe(2);
  expect(html).toContain('data-world="rally"');
  expect(html).toContain('data-world="cross"');
  expect(html).toContain('data-rc-glance');
  expect(html).not.toMatch(/manipulation\.[a-zA-Z]+\.[a-zA-Z]/);
  expect(html).not.toContain('{{');
  for (const leak of ['9{,}42', '9{,}96', '8{,}28', '7{,}30', '3\\pi']) expect(html).not.toContain(leak);
});

it('les props du LAB sont les nombres de levels.js (une seule source)', () => {
  expect(LAB.beginner.numbers).toEqual(LEVELS['route-compare'].beginner.numbers);
  expect(LAB.advanced.numbers).toEqual(LEVELS['route-compare'].advanced.numbers);
});

it.each([['advanced'], ['beginner']])('%s : la main — pari, centres et balises, la montre ; les longueurs attendues', (lv) => {
  const exp = LAB_EXPECT[lv];
  let s = RC.placeBet(RC.init(LAB[lv].numbers), 0);
  while (!RC.allDone(s)) {
    const p = RC.nextPiece(s);
    s = RC.placePin(s, { x: (p.kind === 'arc' ? p.centre : p.to).x, y: (p.kind === 'arc' ? p.centre : p.to).y });
  }
  expect(RC.builtLength(s, 0).latex).toBe(exp.l1);
  expect(RC.builtLength(s, 1).latex).toBe(exp.l2);
  expect(RC.dec(s.routes[0].total.number)).toBe(exp.a1);
  expect(RC.dec(s.routes[1].total.number)).toBe(exp.a2);
  expect(RC.shorter(s) + 1).toBe(exp.shorter);
  expect(RC.discoveryReady(s)).toBe(true);
});

it('le module 1 : les centres (−1 ; 0), (1 ; 0), (3 ; 0) ; √13, √5, √17 ; 9,97 en arrondissant trop tôt ; MN = √61 ≈ 7,81', () => {
  expect([[-2, 0, 0, 0], [0, 0, 2, 0], [2, 0, 4, 0]].map(([a, b, c, e]) => V.pointLatex('I', V.midpoint(P([a, b]), P([c, e]))))).toEqual(['I(-1\\,;\\,0)', 'I(1\\,;\\,0)', 'I(3\\,;\\,0)']);
  expect([d([-2, 3], [1, 1]), d([1, 1], [3, 2]), d([3, 2], [4, -2])]).toEqual(['√13', '√5', '√17']);
  const r = [Math.sqrt(13), Math.sqrt(5), Math.sqrt(17)];
  expect(r.map((x) => TR.roundTo(x, 2))).toEqual(['3,61', '2,24', '4,12']);
  expect(TR.roundTo(r.reduce((a, b) => a + b), 2)).toBe('9,96');
  expect(TR.roundTo(3.61 + 2.24 + 4.12, 2)).toBe('9,97');
  expect(TR.roundTo(3 * Math.PI, 2)).toBe('9,42');
  expect(TR.roundTo(r.reduce((a, b) => a + b) - 3 * Math.PI, 2)).toBe('0,54');
  expect(d([-2, 3], [4, -2])).toBe('√61');
  expect(TR.roundTo(Math.sqrt(61), 2)).toBe('7,81');
  expect(TR.roundTo(Math.sqrt(13 + 5 + 17), 2)).toBe('5,92');
});

it('le module 2 (QCM) : (−5 ; −4), (−3/2 ; 0), 5, 6√2, 2√2', () => {
  expect(V.vecLatex(V.vec(P([3, 2]), P([-2, -2])))).toBe('\\begin{pmatrix} -5 \\\\ -4 \\end{pmatrix}');
  expect(V.pointLatex('I', V.midpoint(P([-2, -1]), P([-1, 1])))).toBe('I(-1{,}5\\,;\\,0)'); // -3/2
  expect(d([0, 0], [4, 3])).toBe('5');
  expect(d([3, 3], [-3, -3])).toBe('6√2');
  expect(d([2, 3], [4, 1])).toBe('2√2');
});

it('le module 3 : ex. 22, 23, 25 recalculés', () => {
  // ex-22
  expect(V.triangleNature(P([1, 3]), P([2, 4]), P([5, 1])).right).toBe('B');
  const I = V.midpoint(P([1, 3]), P([5, 1]));
  expect(V.pointLatex('I', I)).toBe('I(3\\,;\\,2)');
  for (const X of [[1, 3], [2, 4], [5, 1], [2, 0]]) expect(TR.surdText(V.distance(I, P(X)))).toBe('√5');
  expect(TR.roundTo(Math.atan(1 / 3) * 180 / Math.PI, 1)).toBe('18,4');
  expect(TR.roundTo(45 + Math.atan(1 / 3) * 180 / Math.PI, 1)).toBe('63,4');
  expect(TR.roundTo(180 - 45 - Math.atan(1 / 3) * 180 / Math.PI, 1)).toBe('116,6');
  // ex-23
  const [A, B, C] = [P([-3, 1]), P([3, 5]), P([5, 2])];
  expect(V.triangleNature(A, B, C).right).toBe('B');
  const D = V.parallelogramSum(B, A, C);
  expect(V.pointLatex('D', D)).toBe('D(-1\\,;\\,-2)');
  expect(V.quadNature(A, B, C, D)).toBe('rectangle');
  expect(TR.surdText(TR.surdMul(V.distance(A, B), V.distance(B, C)))).toBe('26');
  expect([A, B, C, D].map((X) => V.pointLatex('X', V.translate(X, P([2, 0]))))).toEqual(['X(-1\\,;\\,1)', 'X(5\\,;\\,5)', 'X(7\\,;\\,2)', 'X(1\\,;\\,-2)']);
  // ex-25
  const [A2, B2, C2] = [P([-2, -3]), P([4, 1]), P([2, 4])];
  expect(TR.surdText(V.distance(A2, B2))).toBe('2√13');
  expect(V.triangleNature(A2, B2, C2).right).toBe('B');
  const E = V.translate(A2, V.vec(B2, C2));
  expect(V.pointLatex('E', E)).toBe('E(-4\\,;\\,0)');
  expect(V.quadNature(A2, B2, C2, E)).toBe('rectangle');
});

it('« إختبار أولي » (VTT à Constantine) : (−1 ; 0), 4π ≈ 12,57 ; 5 ; 5 + 5√2 ≈ 12,07 ; la piste (2) gagne', () => {
  const T = FIG.TEST_FIGURE.points;
  expect(V.pointLatex('I', V.midpoint(P(T.C), P(T.K)))).toBe('I(-1\\,;\\,0)');
  const r1 = V.routeLength({ start: T.C, pieces: [{ to: T.K, arc: 'cw' }, { to: T.D, arc: 'ccw' }] });
  const r2 = V.routeLength({ start: T.E, pieces: [{ to: T.F }, { to: T.G }, { to: T.H }] });
  expect(r1.latex).toBe('4\\pi');
  expect(r2.latex).toBe('5 + 5\\sqrt{2}');
  expect(TR.roundTo(r1.number, 2)).toBe('12,57');
  expect(TR.roundTo(r2.number, 2)).toBe('12,07');
  expect(d(T.E, T.F)).toBe('5');
  expect(r2.number < r1.number).toBe(true);
  expect(TR.roundTo(8 * Math.PI, 2)).toBe('25,13');
  expect(TR.roundTo(5 + Math.sqrt(26), 2)).not.toBe('12,07');
});

it('la figure de la وضعية porte les nombres de l’extraction (rien retapé)', () => {
  const S = FIG.SITUATION_FIGURE.points;
  expect([S.A, S.B, S.M, S.N, S.P, S.Q]).toEqual([[-2, 0], [4, 0], [-2, 3], [4, -2], [1, 1], [3, 2]]);
  const adv = LAB.advanced.numbers.routes;
  expect(adv[0].start).toEqual(S.A);
  expect(adv[1].pieces.map((p) => p.to)).toEqual([S.P, S.Q, S.N]);
});
