import { addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » DE LA PLATEFORME — 10 affirmations, de TRÈS FACILE à plus difficile (règle des pilotes, propriétaire 2026-11-07 :
 * commencer par des réussites, puis monter). Les deux كفاءات alternent : jidaa « d يقسم n » (1 → 3 → 5 → 7 → 9) et qawasim
 * « كل قواسم عدد » (2 → 4 → 6 → 8 → 10). Écrites par la plateforme (indépendance du manuel) : ses quatre énoncés restent dans
 * content/textbook.js › PREP_ITEMS. `check` (recalculé par content/prep.test.js) : { kind: 'divides', n, d, product? } — « d divise n » ;
 * { kind: 'divisors', n, list } — « les diviseurs de n sont exactement `list` » ; { kind: 'count', n, count } — « n a `count` diviseurs ».
 */
export const PREP_LADDER = [
  { n: 1, skill: 'jidaa', level: 1, text: 'العدد 3 يقسم 12.', answer: true, why: '$12 = 3 \\times 4$ و 4 عدد طبيعي.', check: { kind: 'divides', n: 12, d: 3, product: [3, 4] } },
  { n: 2, skill: 'qawasim', level: 1, text: 'قواسم العدد 6 هي: 1 ، 2 ، 3 ، 6.', answer: true, why: '$6 = 1 \\times 6 = 2 \\times 3$: أربعة قواسم.', check: { kind: 'divisors', n: 6, list: [1, 2, 3, 6] } },
  { n: 3, skill: 'jidaa', level: 2, text: 'العدد 5 يقسم 35 لأنّ $35 = 5 \\times 7$.', answer: true, why: 'المساواة $35 = 5 \\times 7$ تعني أنّ 5 يقسم 35 (و 7 أيضًا).', check: { kind: 'divides', n: 35, d: 5, product: [5, 7] } },
  { n: 4, skill: 'qawasim', level: 2, text: 'قواسم العدد 10 هي: 1 ، 2 ، 5.', answer: false, why: 'نُسي العدد 10 نفسه: كل عدد يقسم نفسه. قواسم 10 هي 1 ، 2 ، 5 ، 10.', check: { kind: 'divisors', n: 10, list: [1, 2, 5] } },
  { n: 5, skill: 'jidaa', level: 3, text: 'العدد 4 يقسم 18.', answer: false, why: '$18 = 4 \\times 4 + 2$: الباقي 2 غير معدوم.', check: { kind: 'divides', n: 18, d: 4 } },
  { n: 6, skill: 'qawasim', level: 3, text: 'للعدد 16 خمسة قواسم: 1 ، 2 ، 4 ، 8 ، 16.', answer: true, why: '$16 = 1 \\times 16 = 2 \\times 8 = 4 \\times 4$: خمسة قواسم، و 4 يُعدّ مرّة واحدة.', check: { kind: 'divisors', n: 16, list: [1, 2, 4, 8, 16] } },
  { n: 7, skill: 'jidaa', level: 4, text: 'العدد 9 يقسم 54.', answer: true, why: '$54 = 9 \\times 6$.', check: { kind: 'divides', n: 54, d: 9, product: [9, 6] } },
  { n: 8, skill: 'qawasim', level: 4, text: 'قواسم العدد 20 هي: 1 ، 2 ، 4 ، 5 ، 20.', answer: false, why: 'نُسي شريك 2: $20 = 2 \\times 10$. قواسم 20 هي 1 ، 2 ، 4 ، 5 ، 10 ، 20.', check: { kind: 'divisors', n: 20, list: [1, 2, 4, 5, 20] } },
  { n: 9, skill: 'jidaa', level: 5, text: 'العدد 7 يقسم 91.', answer: true, why: '$91 = 7 \\times 13$: لا يكفي أن ننظر إلى رقم الآحاد.', check: { kind: 'divides', n: 91, d: 7, product: [7, 13] } },
  { n: 10, skill: 'qawasim', level: 5, text: 'للعدد 36 ثمانية قواسم.', answer: false, why: '$36 = 1 \\times 36 = 2 \\times 18 = 3 \\times 12 = 4 \\times 9 = 6 \\times 6$: تسعة قواسم، لأنّ 6 لا شريك له غير نفسه.', check: { kind: 'count', n: 36, count: 8 } },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
