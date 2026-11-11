import { addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » DE LA PLATEFORME — 10 affirmations, de TRÈS FACILE à plus difficile (règle des pilotes, propriétaire 2026-11-07). Les deux
 * كفاءات alternent : pgcd « PGCD وخوارزمية إقليدس » (1 → 3 → 5 → 7 → 9) et qawaid « قواعد قابلية القسمة » (2 → 4 → 6 → 8 → 10). Écrites par
 * la plateforme (indépendance du manuel) : les cinq énoncés d'avant restent dans content/textbook.js (PREP_ITEMS). `check` (recalculé par
 * content/prep.test.js) : { kind: 'pgcd', a, b, value } — « PGCD(a ; b) = value » · { kind: 'div', ns: [n…], ds: [d…], not? } — « chaque n est
 * divisible par chaque d » (`not` : l'énoncé dit le contraire). Aucun nombre de la مسألة (26, 45, 39, 65, ni leur PGCD 13).
 */
export const PREP_LADDER = [
  { n: 1, skill: 'pgcd', level: 1, text: '$\\mathrm{PGCD}(6\\ ;\\ 9) = 3$.', answer: true, why: 'قواسم 6: 1 ، 2 ، 3 ، 6؛ أكبرها يقسم 9 هو 3.', check: { kind: 'pgcd', a: 6, b: 9, value: 3 } },
  { n: 2, skill: 'qawaid', level: 1, text: 'العدد 48 يقبل القسمة على 2.', answer: true, why: 'رقم آحاده 8 زوجي.', check: { kind: 'div', ns: [48], ds: [2] } },
  { n: 3, skill: 'pgcd', level: 2, text: '$\\mathrm{PGCD}(14\\ ;\\ 21) = 7$.', answer: true, why: '$14 = 7 \\times 2$ و $21 = 7 \\times 3$، و 2 و 3 لا قاسم مشترك لهما غير 1.', check: { kind: 'pgcd', a: 14, b: 21, value: 7 } },
  { n: 4, skill: 'qawaid', level: 2, text: 'العدد 234 لا يقبل القسمة على 3.', answer: false, why: '$2 + 3 + 4 = 9$ و 9 يقبل القسمة على 3، إذن 234 يقبل القسمة على 3.', check: { kind: 'div', ns: [234], ds: [3], not: true } },
  { n: 5, skill: 'pgcd', level: 3, text: '$\\mathrm{PGCD}(20\\ ;\\ 30) = 5$.', answer: false, why: '10 يقسم 20 و 30 معًا: $\\mathrm{PGCD}(20\\ ;\\ 30) = 10$.', check: { kind: 'pgcd', a: 20, b: 30, value: 5 } },
  { n: 6, skill: 'qawaid', level: 3, text: 'العددان 54 و 72 يقبلان القسمة على 9.', answer: true, why: '$5 + 4 = 9$ و $7 + 2 = 9$.', check: { kind: 'div', ns: [54, 72], ds: [9] } },
  { n: 7, skill: 'pgcd', level: 4, text: '$84 = 36 \\times 2 + 12$ ؛ $36 = 12 \\times 3 + 0$، إذن $\\mathrm{PGCD}(84\\ ;\\ 36) = 12$.', answer: true, why: 'آخر باقٍ غير معدوم في القسمات المتتابعة هو 12.', check: { kind: 'pgcd', a: 84, b: 36, value: 12 } },
  { n: 8, skill: 'qawaid', level: 4, text: 'العددان 85 و 102 يقبلان القسمة على 3.', answer: false, why: '$8 + 5 = 13$ لا يقبل القسمة على 3، فالعدد 85 لا يقبل القسمة على 3 (أمّا 102 فيقبلها).', check: { kind: 'div', ns: [85, 102], ds: [3] } },
  { n: 9, skill: 'pgcd', level: 5, text: '$77 = 21 \\times 3 + 14$ ؛ $21 = 14 \\times 1 + 7$ ؛ $14 = 7 \\times 2 + 0$، إذن $\\mathrm{PGCD}(77\\ ;\\ 21) = 14$.', answer: false, why: 'القاسم المشترك الأكبر هو آخر باقٍ غير معدوم: 7، لا 14.', check: { kind: 'pgcd', a: 77, b: 21, value: 14 } },
  { n: 10, skill: 'qawaid', level: 5, text: 'العدد 5670 يقبل القسمة على 2 وعلى 5 وعلى 9.', answer: true, why: 'رقم آحاده 0، و $5 + 6 + 7 + 0 = 18$.', check: { kind: 'div', ns: [5670], ds: [2, 5, 9] } },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
