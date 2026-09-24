import { describe, it, expect } from 'vitest';
import { isolateMathRuns } from './bidi';

const L = '⁦';
const P = '⁩';

describe('isolateMathRuns — une égalité en clair reste lisible en RTL', () => {
  it('isole le titre signalé « معارف — 120 = 6 × 20 »', () => {
    expect(isolateMathRuns('معارف — 120 = 6 × 20')).toBe(`معارف — ${L}120 = 6 × 20${P}`);
  });

  it('isole une fraction, une soustraction, une division euclidienne', () => {
    expect(isolateMathRuns('معارف — 28/42')).toBe(`معارف — ${L}28/42${P}`);
    expect(isolateMathRuns('407 − 253 = 154')).toBe(`${L}407 − 253 = 154${P}`);
    expect(isolateMathRuns('65 = 56 × 1 + 9 ثم')).toBe(`${L}65 = 56 × 1 + 9${P} ثم`);
    expect(isolateMathRuns('العدد 7,5 = 15/2')).toBe(`العدد ${L}7,5 = 15/2${P}`);
  });

  it('ne lie pas deux nombres par « : », « — » ou « ، »', () => {
    expect(isolateMathRuns('السؤال 2 : 120')).toBe('السؤال 2 : 120');
    expect(isolateMathRuns('910 ، 1000')).toBe('910 ، 1000');
    expect(isolateMathRuns('تمرين 4 — 910')).toBe('تمرين 4 — 910');
  });

  it('laisse un nombre seul, un texte sans nombre, et est idempotent', () => {
    expect(isolateMathRuns('رف 12')).toBe('رف 12');
    expect(isolateMathRuns('بدون أرقام')).toBe('بدون أرقام');
    const once = isolateMathRuns('15 = 3 × 5');
    expect(isolateMathRuns(once)).toBe(once);
  });

  it('isole un nombre suivi de son unité — « 24 L » ne se lit plus « L 24 »', () => {
    expect(isolateMathRuns('سعة الدنّ الأول 24 L وسعة الثاني 18 L.')).toBe(`سعة الدنّ الأول ${L}24 L${P} وسعة الثاني ${L}18 L${P}.`);
    expect(isolateMathRuns('المساحة 7,5 cm²')).toBe(`المساحة ${L}7,5 cm²${P}`);
    expect(isolateMathRuns('240x')).toBe(`${L}240x${P}`);
    expect(isolateMathRuns('2 cm × 3 cm')).toBe(`${L}2 cm × 3 cm${P}`);
  });

  it('« x » entre deux nombres reste l’opérateur, pas une unité', () => {
    expect(isolateMathRuns('2 x 3 = 6')).toBe(`${L}2 x 3 = 6${P}`);
  });
});
