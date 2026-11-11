import { addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » DE LA PLATEFORME — 10 affirmations, de TRÈS FACILE à plus difficile (règle des pilotes, propriétaire 2026-11-07). Les deux
 * كفاءات alternent : khawass « خاصيتا القواسم » (1 → 3 → 5 → 7 → 9) et pgcd « PGCD ونتائجه المباشرة » (2 → 4 → 6 → 8 → 10). Écrites par la
 * plateforme (indépendance du manuel) : ses six énoncés restent dans content/textbook.js › PREP_ITEMS. `check` (recalculé par
 * content/prep.test.js) : { kind: 'divides', n, d } — « d divise n » · { kind: 'pgcd', a, b, value } — « PGCD(a ; b) = value ».
 */
export const PREP_LADDER = [
  { n: 1, skill: 'khawass', level: 1, text: '5 يقسم 20 و 5 يقسم 15، إذن 5 يقسم $20 + 15 = 35$.', answer: true, why: 'القاسم المشترك لعددين يقسم مجموعهما: $35 = 5 \\times 7$.', check: { kind: 'divides', n: 35, d: 5 } },
  { n: 2, skill: 'pgcd', level: 1, text: '$\\mathrm{PGCD}(9\\ ;\\ 9) = 9$.', answer: true, why: 'قاسم مشترك أكبر لعدد مع نفسه هو العدد نفسه.', check: { kind: 'pgcd', a: 9, b: 9, value: 9 } },
  { n: 3, skill: 'khawass', level: 2, text: '4 يقسم 28 و 4 يقسم 12، إذن 4 يقسم $28 - 12 = 16$.', answer: true, why: 'القاسم المشترك لعددين يقسم فرقهما: $16 = 4 \\times 4$.', check: { kind: 'divides', n: 16, d: 4 } },
  { n: 4, skill: 'pgcd', level: 2, text: '$\\mathrm{PGCD}(8\\ ;\\ 0) = 0$.', answer: false, why: 'كل عدد يقسم 0، فالقواسم المشتركة لـ 8 و 0 هي قواسم 8، وأكبرها 8.', check: { kind: 'pgcd', a: 8, b: 0, value: 0 } },
  { n: 5, skill: 'khawass', level: 3, text: '6 يقسم 42 و 6 يقسم 18، إذن 6 يقسم $42 - 18$.', answer: true, why: '$42 - 18 = 24 = 6 \\times 4$.', check: { kind: 'divides', n: 24, d: 6 } },
  { n: 6, skill: 'pgcd', level: 3, text: '$\\mathrm{PGCD}(48\\ ;\\ 12) = 48$.', answer: false, why: '12 قاسم للعدد 48، فـ $\\mathrm{PGCD}(48\\ ;\\ 12) = 12$، لا الأكبر 48.', check: { kind: 'pgcd', a: 48, b: 12, value: 48 } },
  { n: 7, skill: 'khawass', level: 4, text: '7 يقسم 56 و 7 يقسم 21، إذن 7 يقسم باقي قسمة 56 على 21.', answer: true, why: '$56 = 21 \\times 2 + 14$ و $14 = 7 \\times 2$: القاسم المشترك يقسم الباقي.', check: { kind: 'divides', n: 14, d: 7 } },
  { n: 8, skill: 'pgcd', level: 4, text: '$\\mathrm{PGCD}(35\\ ;\\ 14) = 7$.', answer: true, why: 'قواسم 14: 1 ، 2 ، 7 ، 14؛ المشتركة مع 35 هي 1 و 7، وأكبرها 7.', check: { kind: 'pgcd', a: 35, b: 14, value: 7 } },
  { n: 9, skill: 'khawass', level: 5, text: '3 يقسم 25 + 2، إذن 3 يقسم 25 و 3 يقسم 2.', answer: false, why: 'العكس غير صحيح: 3 يقسم 27 لكنه لا يقسم 25 ولا 2.', check: { kind: 'divides', n: 25, d: 3 } },
  { n: 10, skill: 'pgcd', level: 5, text: '$\\mathrm{PGCD}(39\\ ;\\ 26) = 13$.', answer: true, why: '$39 = 13 \\times 3$ و $26 = 13 \\times 2$، و 3 و 2 لا قاسم مشترك لهما غير 1.', check: { kind: 'pgcd', a: 39, b: 26, value: 13 } },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
