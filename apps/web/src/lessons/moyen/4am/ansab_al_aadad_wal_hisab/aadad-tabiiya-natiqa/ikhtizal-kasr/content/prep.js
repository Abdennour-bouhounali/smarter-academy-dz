import { addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » DE LA PLATEFORME — 10 affirmations, de TRÈS FACILE à plus difficile (règle des pilotes, propriétaire 2026-11-07). Les deux
 * كفاءات alternent : kusur « الكسور المتساوية » (1 → 3 → 5 → 7 → 9) et pgcd « PGCD » (2 → 4 → 6 → 8 → 10). Écrites par la plateforme
 * (indépendance du manuel) : les énoncés d'avant restent dans content/textbook.js (PREP_ITEMS, PREP_PLATFORM_ITEMS). `check` (recalculé par
 * content/prep.test.js) : { kind: 'eq', a: [n, d], b: [n, d] } — « a = b » · { kind: 'pgcd', a, b, value } — « PGCD(a ; b) = value ».
 */
export const PREP_LADDER = [
  { n: 1, skill: 'kusur', level: 1, text: '$\\dfrac{6}{8} = \\dfrac{3}{4}$.', answer: true, why: 'قسمنا البسط والمقام على 2.', check: { kind: 'eq', a: [6, 8], b: [3, 4] } },
  { n: 2, skill: 'pgcd', level: 1, text: '$\\mathrm{PGCD}(10\\ ;\\ 4) = 2$.', answer: true, why: 'قواسم 4: 1 ، 2 ، 4؛ و 4 لا يقسم 10، فأكبر قاسم مشترك هو 2.', check: { kind: 'pgcd', a: 10, b: 4, value: 2 } },
  { n: 3, skill: 'kusur', level: 2, text: '$\\dfrac{2}{3} = \\dfrac{10}{15}$.', answer: true, why: 'ضربنا البسط والمقام في 5.', check: { kind: 'eq', a: [2, 3], b: [10, 15] } },
  { n: 4, skill: 'pgcd', level: 2, text: '$\\mathrm{PGCD}(9\\ ;\\ 12) = 1$.', answer: false, why: '3 يقسم 9 و 12 معًا: $\\mathrm{PGCD}(9\\ ;\\ 12) = 3$.', check: { kind: 'pgcd', a: 9, b: 12, value: 1 } },
  { n: 5, skill: 'kusur', level: 3, text: '$\\dfrac{5}{7} = \\dfrac{6}{8}$ لأنّنا أضفنا 1 إلى البسط وإلى المقام.', answer: false, why: 'الجمع لا يحفظ قيمة الكسر: $\\dfrac{5}{7} \\approx 0{,}71$ و $\\dfrac{6}{8} = 0{,}75$.', check: { kind: 'eq', a: [5, 7], b: [6, 8] } },
  { n: 6, skill: 'pgcd', level: 3, text: '$\\mathrm{PGCD}(24\\ ;\\ 36) = 12$.', answer: true, why: '$24 = 12 \\times 2$ و $36 = 12 \\times 3$، و 2 و 3 لا قاسم مشترك لهما غير 1.', check: { kind: 'pgcd', a: 24, b: 36, value: 12 } },
  { n: 7, skill: 'kusur', level: 4, text: '$\\dfrac{12}{16} = \\dfrac{3}{4}$.', answer: true, why: 'قسمنا البسط والمقام على 4.', check: { kind: 'eq', a: [12, 16], b: [3, 4] } },
  { n: 8, skill: 'pgcd', level: 4, text: '$\\mathrm{PGCD}(25\\ ;\\ 35) = 1$.', answer: false, why: '5 يقسم 25 و 35 معًا: $\\mathrm{PGCD}(25\\ ;\\ 35) = 5$.', check: { kind: 'pgcd', a: 25, b: 35, value: 1 } },
  { n: 9, skill: 'kusur', level: 5, text: '$\\dfrac{18}{24} = \\dfrac{9}{16}$.', answer: false, why: 'قُسم البسط على 2 أمّا المقام فلا: $\\dfrac{18}{24} = \\dfrac{9}{12}$.', check: { kind: 'eq', a: [18, 24], b: [9, 16] } },
  { n: 10, skill: 'pgcd', level: 5, text: '$\\mathrm{PGCD}(91\\ ;\\ 65) = 13$.', answer: true, why: '$91 = 13 \\times 7$ و $65 = 13 \\times 5$، و 7 و 5 أوليان فيما بينهما.', check: { kind: 'pgcd', a: 91, b: 65, value: 13 } },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
