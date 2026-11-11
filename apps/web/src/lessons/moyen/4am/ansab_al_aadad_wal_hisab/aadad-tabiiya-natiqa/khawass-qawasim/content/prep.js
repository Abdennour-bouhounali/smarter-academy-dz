import { addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » DE LA PLATEFORME — 10 affirmations, de TRÈS FACILE à plus difficile (règle des pilotes, propriétaire 2026-11-07 :
 * commencer par des réussites, « شعور النشوة والذكاء », puis monter). Les deux كفاءات alternent : chacune monte de son côté
 * (jidaa « n يقسم a » : 1 → 3 → 5 → 7 → 9, qisma « القسمة الإقليدية » : 2 → 4 → 6 → 8 → 10), et les trois premières se réussissent
 * presque toujours. Écrites par la plateforme (indépendance du manuel) : ses six énoncés restent dans content/textbook.js › PREP_ITEMS.
 * `check` (recalculé par content/prep.test.js) : { kind: 'divides', n, d, product? } — « d divise n » ; { kind: 'division', a, b, q, r, claimed? } —
 * « a = b × q + r est la division euclidienne » (`claimed` : la fausse égalité que l'énoncé propose).
 */
export const PREP_LADDER = [
  { n: 1, skill: 'jidaa', level: 1, text: 'العدد 4 يقسم 20.', answer: true, why: '$20 = 4 \\times 5$ و 5 عدد طبيعي.', check: { kind: 'divides', n: 20, d: 4, product: [4, 5] } },
  { n: 2, skill: 'qisma', level: 1, text: 'باقي القسمة الإقليدية للعدد 17 على 5 هو 2.', answer: true, why: '$17 = 5 \\times 3 + 2$ و $2 < 5$.', check: { kind: 'division', a: 17, b: 5, q: 3, r: 2 } },
  { n: 3, skill: 'jidaa', level: 2, text: 'العدد 6 يقسم 30 لأنّ $30 = 6 \\times 5$.', answer: true, why: 'المساواة $30 = 6 \\times 5$ تعني أنّ 6 يقسم 30.', check: { kind: 'divides', n: 30, d: 6, product: [6, 5] } },
  { n: 4, skill: 'qisma', level: 2, text: 'باقي القسمة الإقليدية للعدد 20 على 5 هو 5.', answer: false, why: '$20 = 5 \\times 4 + 0$: الباقي 0، فهو أصغر من 5 دائمًا.', check: { kind: 'division', a: 20, b: 5, q: 4, r: 0, claimedR: 5 } },
  { n: 5, skill: 'jidaa', level: 3, text: 'العدد 7 يقسم 50.', answer: false, why: '$50 = 7 \\times 7 + 1$: الباقي 1 غير معدوم.', check: { kind: 'divides', n: 50, d: 7 } },
  { n: 6, skill: 'qisma', level: 3, text: 'المساواة $47 = 9 \\times 5 + 2$ تعبّر عن القسمة الإقليدية للعدد 47 على 9.', answer: true, why: '$9 \\times 5 + 2 = 47$ و $2 < 9$: الباقي أصغر من المقسوم عليه.', check: { kind: 'division', a: 47, b: 9, q: 5, r: 2 } },
  { n: 7, skill: 'jidaa', level: 4, text: 'من المساواة $84 = 7 \\times 12$ نستنتج أنّ 12 يقسم 84.', answer: true, why: 'كل عامل في الجداء يقسم الناتج: $84 = 12 \\times 7$.', check: { kind: 'divides', n: 84, d: 12, product: [7, 12] } },
  { n: 8, skill: 'qisma', level: 4, text: 'المساواة $75 = 8 \\times 8 + 11$ تعبّر عن القسمة الإقليدية للعدد 75 على 8.', answer: false, why: 'الباقي 11 ليس أصغر من 8. القسمة الإقليدية هي $75 = 8 \\times 9 + 3$.', check: { kind: 'division', a: 75, b: 8, q: 9, r: 3, claimed: { q: 8, r: 11 } } },
  { n: 9, skill: 'jidaa', level: 5, text: 'من المساواة $9 = 3 \\times 3$ نستنتج أنّ 9 يقسم 3.', answer: false, why: 'القاسم لا يتجاوز العدد الذي يقسمه: 3 يقسم 9، و 9 لا يقسم 3 ($3 = 9 \\times 0 + 3$).', check: { kind: 'divides', n: 3, d: 9 } },
  { n: 10, skill: 'qisma', level: 5, text: 'باقي القسمة الإقليدية للعدد 1000 على 12 هو 4.', answer: true, why: '$1000 = 12 \\times 83 + 4$ و $4 < 12$.', check: { kind: 'division', a: 1000, b: 12, q: 83, r: 4 } },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
