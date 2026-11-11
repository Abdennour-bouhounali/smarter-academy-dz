import { addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » DE LA PLATEFORME — 10 affirmations, de TRÈS FACILE à plus difficile (propriétaire, 2026-11-07 : commencer par des
 * réussites, « شعور النشوة والذكاء », puis monter). Les deux كفاءات alternent : chacune monte de son côté (qisma : 1 → 3 → 5 → 7 → 9,
 * qawaid : 2 → 4 → 6 → 8 → 10), et les trois premières se réussissent presque toujours.
 * Écrites par la plateforme (indépendance du manuel) : ses six énoncés restent dans content/textbook.js › PREP_ITEMS comme source.
 * Chaque égalité est vérifiée par content/prep.test.js.
 */
export const PREP_LADDER = [
  { n: 1, skill: 'qisma', level: 1, text: 'حاصل قسمة 12 على 3 هو 4.', answer: true, why: '$12 = 3 \\times 4 + 0$.', check: { a: 12, b: 3, q: 4, r: 0 } },
  { n: 2, skill: 'qawaid', level: 1, text: 'العدد 40 يقبل القسمة على 10.', answer: true, why: 'رقم وحداته 0.', check: { n: 40, d: 10, divisible: true } },
  { n: 3, skill: 'qisma', level: 2, text: 'باقي القسمة الإقليدية للعدد 17 على 5 هو 2.', answer: true, why: '$17 = 5 \\times 3 + 2$ و $2 < 5$.', check: { a: 17, b: 5, q: 3, r: 2 } },
  { n: 4, skill: 'qawaid', level: 2, text: 'العدد 135 يقبل القسمة على 2.', answer: false, why: 'رقم وحداته 5: العدد فردي، فلا يقبل القسمة على 2.', check: { n: 135, d: 2, divisible: false } },
  { n: 5, skill: 'qisma', level: 3, text: 'المساواة $23 = 4 \\times 5 + 3$ تعبّر عن القسمة الإقليدية للعدد 23 على 4.', answer: true, why: '$23 = 4 \\times 5 + 3$ و $3 < 4$: الباقي أصغر من المقسوم عليه.', check: { a: 23, b: 4, q: 5, r: 3 } },
  { n: 6, skill: 'qawaid', level: 3, text: 'العدد 412 يقبل القسمة على 3.', answer: false, why: '$4 + 1 + 2 = 7$ و 7 لا يقبل القسمة على 3.', check: { n: 412, d: 3, divisible: false } },
  { n: 7, skill: 'qisma', level: 4, text: 'المساواة $50 = 6 \\times 7 + 8$ تعبّر عن القسمة الإقليدية للعدد 50 على 6.', answer: false, why: 'الباقي 8 ليس أصغر من 6. القسمة الإقليدية هي $50 = 6 \\times 8 + 2$.', check: { a: 50, b: 6, q: 8, r: 2, claimed: { q: 7, r: 8 } } },
  { n: 8, skill: 'qawaid', level: 4, text: 'العدد 2025 يقبل القسمة على 9.', answer: true, why: '$2 + 0 + 2 + 5 = 9$ و 9 يقبل القسمة على 9.', check: { n: 2025, d: 9, divisible: true } },
  { n: 9, skill: 'qisma', level: 5, text: 'باقي القسمة الإقليدية للعدد 1000 على 7 هو 6.', answer: true, why: '$1000 = 7 \\times 142 + 6$ و $6 < 7$.', check: { a: 1000, b: 7, q: 142, r: 6 } },
  { n: 10, skill: 'qawaid', level: 5, text: 'العدد 7246 يقبل القسمة على 3 وعلى 5 معًا.', answer: false, why: '$7 + 2 + 4 + 6 = 19$ لا يقبل القسمة على 3، ورقم وحداته 6 فلا يقبل القسمة على 5.', check: { n: 7246, d: 15, divisible: false } },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
