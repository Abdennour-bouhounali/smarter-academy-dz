import { addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » DE LA PLATEFORME — 10 affirmations, de TRÈS FACILE à plus difficile (règle des pilotes, propriétaire 2026-11-07 :
 * commencer par des réussites, « شعور النشوة والذكاء », puis monter). Les deux كفاءات alternent : chacune monte de son côté
 * (jidaa : 1 → 3 → 5 → 7 → 9, qawaid : 2 → 4 → 6 → 8 → 10), et les trois premières se réussissent presque toujours.
 * Écrites par la plateforme (indépendance du manuel) : ses six énoncés restent dans content/textbook.js › PREP_ITEMS comme source.
 * `check` : { n, ds, product? } — « chaque d de ds divise n » est la valeur de vérité (recalculée par content/prep.test.js) ;
 * `product: [a, b, c]` quand l'énoncé lit un قاسم dans une égalité a × b = c.
 */
export const PREP_LADDER = [
  { n: 1, skill: 'jidaa', level: 1, text: 'العدد 3 قاسم للعدد 12.', answer: true, why: '$12 = 3 \\times 4$ و 4 عدد طبيعي.', check: { n: 12, ds: [3], product: [3, 4, 12] } },
  { n: 2, skill: 'qawaid', level: 1, text: 'العدد 50 يقبل القسمة على 5.', answer: true, why: 'رقم وحداته 0.', check: { n: 50, ds: [5] } },
  { n: 3, skill: 'jidaa', level: 2, text: 'العدد 5 قاسم للعدد 20 لأنّ $20 = 5 \\times 4$.', answer: true, why: 'المساواة $20 = 5 \\times 4$ تعني أنّ 5 يقسم 20.', check: { n: 20, ds: [5], product: [5, 4, 20] } },
  { n: 4, skill: 'qawaid', level: 2, text: 'العدد 27 يقبل القسمة على 2.', answer: false, why: 'رقم وحداته 7: العدد فردي، فلا يقبل القسمة على 2.', check: { n: 27, ds: [2] } },
  { n: 5, skill: 'jidaa', level: 3, text: 'العدد 4 قاسم للعدد 18.', answer: false, why: '$18 = 4 \\times 4 + 2$: الباقي 2 غير معدوم.', check: { n: 18, ds: [4] } },
  { n: 6, skill: 'qawaid', level: 3, text: 'العدد 231 يقبل القسمة على 3.', answer: true, why: '$2 + 3 + 1 = 6$ و 6 يقبل القسمة على 3.', check: { n: 231, ds: [3] } },
  { n: 7, skill: 'jidaa', level: 4, text: 'من المساواة $84 = 7 \\times 12$ نستنتج أنّ 7 و 12 قاسمان للعدد 84.', answer: true, why: 'كل عامل في الجداء يقسم الناتج: $84 = 7 \\times 12 = 12 \\times 7$.', check: { n: 84, ds: [7, 12], product: [7, 12, 84] } },
  { n: 8, skill: 'qawaid', level: 4, text: 'العدد 2314 يقبل القسمة على 4 لأنّ رقم آحاده زوجي.', answer: false, why: 'قاعدة القسمة على 4 تُقرأ من العدد المكوَّن من رقمي العشرات والآحاد: 14 لا يقبل القسمة على 4، و $2314 = 4 \\times 578 + 2$.', check: { n: 2314, ds: [4] } },
  { n: 9, skill: 'jidaa', level: 5, text: 'من المساواة $65 = 5 \\times 13$ نستنتج أنّ 65 قاسم للعدد 5.', answer: false, why: '$65 = 5 \\times 13$ تعني أنّ 5 و 13 يقسمان 65، لا أنّ 65 يقسم 5: القاسم لا يتجاوز العدد الذي يقسمه.', check: { n: 5, ds: [65], product: [5, 13, 65] } },
  { n: 10, skill: 'qawaid', level: 5, text: 'العدد 1620 يقبل القسمة على 4 وعلى 9 معًا.', answer: true, why: 'الرقمان الأخيران 20 يقبلان القسمة على 4، و $1 + 6 + 2 + 0 = 9$ يقبل القسمة على 9.', check: { n: 1620, ds: [4, 9] } },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
