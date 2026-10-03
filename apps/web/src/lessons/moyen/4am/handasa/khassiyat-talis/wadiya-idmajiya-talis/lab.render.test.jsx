import { it, expect } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { thales as TH, linear as LIN } from '@smarter-academy/core';
import '../../../../../../i18n';
import ShadowStick from '../../../../../common/manipulations/geometry/ShadowStick';
import ConeCylinder from '../../../../../common/manipulations/geometry/ConeCylinder';
import ManipulationWorkspace from '../../../../../common/manipulations/ManipulationWorkspace';
import * as SH from '../../../../../common/manipulations/logic/shadowStick';
import * as CC from '../../../../../common/manipulations/logic/coneCylinder';
import { LAB, CHALLENGE, SITUATION, TEST } from './content/textbook';

/**
 * Le workspace du module 1 de la synthèse — deux TYPES dans un workspace (shadow-stick à مبتدئ, cone-cylinder à
 * متقدم) — rendu avec EXACTEMENT les props que le module étale (content/textbook.js › LAB) ; puis la mathématique
 * que les modules 1 et 4 supposent, recalculée avec packages/core (thales.js) et posée par la main dans la
 * logique des deux labs.
 */
const workspace = () => (
  <ManipulationWorkspace
    levels={{
      beginner: () => <ShadowStick level="beginner" {...LAB.beginner} />,
      advanced: () => <ConeCylinder level="advanced" {...LAB.advanced} />,
    }}
  />
);
const t = LIN.fracText;

it('les deux labs se rendent dans le workspace, chacun son monde, sans clé i18n brute ni réponse affichée', () => {
  const html = renderToString(workspace());
  expect(html).toContain('data-shadow-stick');
  expect(html).toContain('data-cone-cylinder');
  expect(html).toContain('data-sh-glance');
  expect(html).toContain('data-cc-glance');
  expect(html).toContain('data-world="minaret"');
  expect(html).toContain('data-world="cornet"');
  expect(html).not.toMatch(/manipulation\.[a-zA-Z]+\.[a-zA-Z]/);
  expect(html).not.toContain('{{');
  expect(html).not.toContain('7,25');
  expect(html).not.toContain('91,125');
});

it('les props du LAB sont les nombres du تحدّ et de la وضعية (rien retapé)', () => {
  expect(LAB.beginner).toMatchObject(CHALLENGE.numbers);
  expect(LAB.advanced).toMatchObject(SITUATION.numbers);
});

it('le تحدّ : la main plante le bâton à 10 m, la perche monte au pied — 7,25 m', () => {
  expect(t(TH.heightFromShadow({ stick: 1, stickAt: 10, tip: '11,6' }))).toBe('29/4');
  let lab = SH.init(LAB.beginner);
  lab = SH.placeStick(lab, lab.iStar - 5);
  expect(lab.trials.at(-1).kind).toBe('before');
  lab = SH.placeStick(lab, lab.iStar);
  expect(SH.meets(lab)).toBe(true);
  lab = SH.placePole(lab, lab.jA - 7);
  lab = SH.placePole(lab, lab.jA);
  expect(SH.dec(lab.poleTrials.at(-1).height)).toBe('7,25');
  expect(SH.discoveryReady(lab)).toBe(true);
});

it('la وضعية : deux cylindres inscrits, un refus, puis h = r = 4,5 et V = 91,125π ≈ 286,28', () => {
  const cone = TH.cylinderInCone({ H: 18, R: 6 });
  expect(t(cone.equalHR.r)).toBe('9/2');
  expect(t(cone.equalHR.volumeOverPi)).toBe('729/8');
  let lab = CC.init(LAB.advanced);
  lab = CC.setR(lab, CC.touchIndex(lab) + 1);
  expect(lab.last.kind).toBe('pierceR');
  lab = CC.setR(lab, CC.touchIndex(lab));
  lab = CC.setH(lab, 6);
  lab = CC.setR(lab, CC.touchIndex(lab));
  expect(CC.discoveryReady(lab)).toBe(true);
  expect(CC.goalFound(lab)).toBe(true);
  expect(CC.volumeApprox(CC.status(lab).vop)).toBe('286,28');
});

it('« إختبار أولي » (autres nombres) : r = 4, V = 64π ≈ 201,06 ; la minaret 10,5 m', () => {
  const cone = TH.cylinderInCone({ H: TEST.cone.H, R: TEST.cone.R });
  expect(t(cone.equalHR.r)).toBe('4');
  expect(t(cone.equalHR.volumeOverPi)).toBe('64');
  expect(CC.volumeApprox(cone.equalHR.volumeOverPi)).toBe('201,06');
  expect(TH.thalesText(TH.heightFromShadow({ stick: TEST.minaret.stick, stickAt: TEST.minaret.stickAt, tip: TEST.minaret.tip }))).toBe('10,5');
  // les distracteurs du test sont faux
  expect(CC.volumeApprox(LIN.frac(256))).toBe('804,25');
  expect(LIN.eq(cone.radiusFor(3), LIN.frac(3))).toBe(false);
});
