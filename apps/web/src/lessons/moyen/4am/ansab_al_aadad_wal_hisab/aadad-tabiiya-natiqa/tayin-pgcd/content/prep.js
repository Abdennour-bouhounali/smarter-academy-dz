import { addition } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » DE LA PLATEFORME — 10 affirmations, de TRÈS FACILE à plus difficile (règle des pilotes, propriétaire 2026-11-07). Les deux
 * كفاءات alternent : qawasim « كل قواسم عدد » (1 → 3 → 5 → 7 → 9) et pgcd « القاسم المشترك الأكبر » (2 → 4 → 6 → 8 → 10). Écrites par la
 * plateforme (indépendance du manuel) : ses quatre énoncés restent dans content/textbook.js › PREP_ITEMS. `check` (recalculé par
 * content/prep.test.js) : { kind: 'divisors', n, list } · { kind: 'count', n, count } · { kind: 'pgcd', a, b, value } — « PGCD(a ; b) = value ».
 */
export const PREP_LADDER = [
  { n: 1, skill: 'qawasim', level: 1, text: 'قواسم العدد 8 هي: 1 ، 2 ، 4 ، 8.', answer: true, why: '$8 = 1 \\times 8 = 2 \\times 4$: أربعة قواسم.', check: { kind: 'divisors', n: 8, list: [1, 2, 4, 8] } },
  { n: 2, skill: 'pgcd', level: 1, text: '$\\mathrm{PGCD}(4\\ ;\\ 6) = 2$.', answer: true, why: 'قواسم 4: 1 ، 2 ، 4 — قواسم 6: 1 ، 2 ، 3 ، 6. أكبر قاسم مشترك هو 2.', check: { kind: 'pgcd', a: 4, b: 6, value: 2 } },
  { n: 3, skill: 'qawasim', level: 2, text: 'قواسم العدد 9 هي: 1 ، 3 ، 9.', answer: true, why: '$9 = 1 \\times 9 = 3 \\times 3$: ثلاثة قواسم، و 3 يُعدّ مرّة واحدة.', check: { kind: 'divisors', n: 9, list: [1, 3, 9] } },
  { n: 4, skill: 'pgcd', level: 2, text: '$\\mathrm{PGCD}(6\\ ;\\ 9) = 9$.', answer: false, why: '9 لا يقسم 6، فليس قاسمًا مشتركًا. القواسم المشتركة 1 و 3، إذن $\\mathrm{PGCD}(6\\ ;\\ 9) = 3$.', check: { kind: 'pgcd', a: 6, b: 9, value: 9 } },
  { n: 5, skill: 'qawasim', level: 3, text: 'قواسم العدد 15 هي: 1 ، 3 ، 5.', answer: false, why: 'نُسي العدد 15 نفسه: كل عدد يقسم نفسه. قواسم 15 هي 1 ، 3 ، 5 ، 15.', check: { kind: 'divisors', n: 15, list: [1, 3, 5] } },
  { n: 6, skill: 'pgcd', level: 3, text: '$\\mathrm{PGCD}(12\\ ;\\ 20) = 4$.', answer: true, why: 'القواسم المشتركة لـ 12 و 20 هي 1 ، 2 ، 4؛ أكبرها 4.', check: { kind: 'pgcd', a: 12, b: 20, value: 4 } },
  { n: 7, skill: 'qawasim', level: 4, text: 'للعدد 24 ثمانية قواسم.', answer: true, why: '$24 = 1 \\times 24 = 2 \\times 12 = 3 \\times 8 = 4 \\times 6$: أربعة أزواج، أي ثمانية قواسم.', check: { kind: 'count', n: 24, count: 8 } },
  { n: 8, skill: 'pgcd', level: 4, text: '$\\mathrm{PGCD}(14\\ ;\\ 21) = 1$.', answer: false, why: '7 يقسم العددين: $14 = 7 \\times 2$ و $21 = 7 \\times 3$. إذن $\\mathrm{PGCD}(14\\ ;\\ 21) = 7$.', check: { kind: 'pgcd', a: 14, b: 21, value: 1 } },
  { n: 9, skill: 'qawasim', level: 5, text: 'قواسم العدد 28 هي: 1 ، 2 ، 4 ، 7 ، 28.', answer: false, why: 'نُسي شريك 2: $28 = 2 \\times 14$. قواسم 28 هي 1 ، 2 ، 4 ، 7 ، 14 ، 28.', check: { kind: 'divisors', n: 28, list: [1, 2, 4, 7, 28] } },
  { n: 10, skill: 'pgcd', level: 5, text: '$\\mathrm{PGCD}(45\\ ;\\ 30) = 15$.', answer: true, why: '$45 = 15 \\times 3$ و $30 = 15 \\times 2$، ولا قاسم مشترك أكبر من 15.', check: { kind: 'pgcd', a: 45, b: 30, value: 15 } },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));
