import { addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » DE LA PLATEFORME — 10 affirmations, de TRÈS FACILE à plus difficile (règle des pilotes, propriétaire 2026-11-07 ; rollout de l'unité 2,
 * 2026-11-09). Les deux كفاءات alternent : murabba « مربع عدد » (1 → 3 → 5 → 7 → 9) et fithaghuras « خاصية فيثاغورس » (2 → 4 → 6 → 8 → 10). Écrites
 * par la plateforme (indépendance du manuel) : les six énoncés d'avant restent dans content/textbook.js (PREP_ITEMS, PREP_PLATFORM_ITEMS).
 * `check` (recalculé par content/prep.test.js) :
 *   { kind: 'sq', x: [num, den], v: [num, den] }       — « le carré de x vaut v »
 *   { kind: 'hyp', a, b, c2 }                           — « triangle rectangle de côtés a, b de l'angle droit : le carré de l'hypoténuse vaut c2 »
 *   { kind: 'leg', c, a, b2 }                           — « hypoténuse c, un côté a : le carré de l'autre vaut b2 »
 *   { kind: 'right', sides: [p, q, r] }                 — « le triangle de côtés p, q, r (r le plus grand) est rectangle »
 * Aucun nombre de la مسألة (côtés 3 et 5, aire 34, la lecture 5,83…) ni de l'activité (1 et 2, aire 5).
 */
export const PREP_LADDER = [
  { n: 1, skill: 'murabba', level: 1, text: '$4^2 = 16$', answer: true, why: '$4^2 = 4 \\times 4 = 16$.', check: { kind: 'sq', x: [4, 1], v: [16, 1] } },
  { n: 2, skill: 'fithaghuras', level: 1, text: 'مثلث قائم ضلعا زاويته القائمة 6 و 8، إذن مربّع وتره 100.', answer: true, why: '$6^2 + 8^2 = 36 + 64 = 100$.', check: { kind: 'hyp', a: 6, b: 8, c2: 100 } },
  { n: 3, skill: 'murabba', level: 2, text: '$(-7)^2 = 49$', answer: true, why: '$(-7) \\times (-7) = 49$: جداء عددين سالبين موجب.', check: { kind: 'sq', x: [-7, 1], v: [49, 1] } },
  { n: 4, skill: 'fithaghuras', level: 2, text: 'مثلث قائم ضلعا زاويته القائمة 2 و 4، إذن مربّع وتره 6.', answer: false, why: 'نجمع المربّعين لا الطولين: $2^2 + 4^2 = 4 + 16 = 20$.', check: { kind: 'hyp', a: 2, b: 4, c2: 6 } },
  { n: 5, skill: 'murabba', level: 3, text: '$0{,}4^2 = 0{,}16$', answer: true, why: '$0{,}4 \\times 0{,}4 = 0{,}16$: رقمان بعد الفاصلة.', check: { kind: 'sq', x: [4, 10], v: [16, 100] } },
  { n: 6, skill: 'fithaghuras', level: 3, text: 'مثلث قائم وتره 10 وأحد ضلعي زاويته القائمة 6، إذن مربّع الضلع الآخر 64.', answer: true, why: '$10^2 - 6^2 = 100 - 36 = 64$.', check: { kind: 'leg', c: 10, a: 6, b2: 64 } },
  { n: 7, skill: 'murabba', level: 4, text: '$0{,}9^2 = 0{,}81$ و $0{,}09^2 = 0{,}81$', answer: false, why: '$0{,}09^2 = 0{,}0081$: مربّع عدد له رقمان بعد الفاصلة له أربعة أرقام بعد الفاصلة.', check: { kind: 'sq', x: [9, 100], v: [81, 100] } },
  { n: 8, skill: 'fithaghuras', level: 4, text: 'المثلث الذي أطوال أضلاعه 7 و 9 و 12 قائم.', answer: false, why: '$7^2 + 9^2 = 49 + 81 = 130$ و $12^2 = 144$: لا تساوي.', check: { kind: 'right', sides: [7, 9, 12] } },
  { n: 9, skill: 'murabba', level: 5, text: '$\\left(\\dfrac{2}{9}\\right)^2 = \\dfrac{4}{18}$', answer: false, why: 'نربّع البسط والمقام معًا: $\\left(\\dfrac{2}{9}\\right)^2 = \\dfrac{4}{81}$.', check: { kind: 'sq', x: [2, 9], v: [4, 18] } },
  { n: 10, skill: 'fithaghuras', level: 5, text: 'المثلث الذي أطوال أضلاعه 2,5 و 6 و 6,5 قائم.', answer: true, why: '$2{,}5^2 + 6^2 = 6{,}25 + 36 = 42{,}25 = 6{,}5^2$.', check: { kind: 'right', sides: [25, 60, 65] } },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
