import { src } from '../../_unit/unitMeta.js';
export const LP = { P1: '4am_khawass-qawasim_P1', P2: '4am_khawass-qawasim_P2', P3: '4am_khawass-qawasim_P3', P4: '4am_khawass-qawasim_P4' };
const S = (n) => src(`ex-${n}`, 14, 'أوظّف تعلّماتي', n);

export const EXERCISES = [
  { id: 'ex-12', source: S(12), learningPointId: LP.P1, difficulty: 'facile', statement: '$a$ و $b$ عددان طبيعيان حيث $a = 471$ و $b = 192$.',
    items: ['1) تحقّق من أنّ كلا من $a$ و $b$ يقبل القسمة على 3.', '2) ماذا تستنتج بالنسبة إلى قسمة كل من $a - b$ و $a + b$ على 3؟'], interaction: 'trueFalse',
    question: { rows: [
      { text: '471 يقبل القسمة على 3', answer: true, why: '4 + 7 + 1 = 12' }, { text: '192 يقبل القسمة على 3', answer: true, why: '1 + 9 + 2 = 12' },
      { text: '$a - b = 279$ يقبل القسمة على 3', answer: true, why: 'خاصية 1: قاسم مشترك يقسم الفرق' }, { text: '$a + b = 663$ يقبل القسمة على 3', answer: true, why: 'خاصية 1: قاسم مشترك يقسم المجموع' } ],
      explain: 'بما أن 3 يقسم كلا من 471 و 192 فإنه يقسم مجموعهما وفرقهما — دون الحاجة إلى حسابهما.' } },
  { id: 'ex-13', source: S(13), learningPointId: LP.P1, difficulty: 'moyen', statement: 'بيّن أنّ 11 من قواسم 14 300. استنتج أن 11 من قواسم 14 322.', interaction: 'reasoning',
    question: { solution: ['$14\\,300 = 11 \\times 1300$، إذن 11 قاسم للعدد 14 300.', '$14\\,322 = 14\\,300 + 22$ و $22 = 11 \\times 2$: 11 يقسم كلا من 14 300 و 22، فهو يقسم مجموعهما 14 322 (خاصية 1).'] },
    method: 'نكتب العدد الثاني مجموعًا لعددين يقسمهما 11.', commonError: 'إعادة القسمة كاملة بدل استعمال الخاصية.' },
  { id: 'ex-14', source: S(14), learningPointId: LP.P2, difficulty: 'moyen', statement: 'بيّن أنّ 7 من قواسم 217. استنتج أن 7 من قواسم 21 700 000.', interaction: 'reasoning',
    question: { solution: ['$217 = 7 \\times 31$، إذن 7 قاسم للعدد 217.', '$21\\,700\\,000 = 217 \\times 100\\,000$: مضاعف للعدد 217، و 7 يقسم 217، فهو يقسم كل مضاعف له (خاصية 1: إذا كان n يقسم a فإنه يقسم k × a).'] } },
  { id: 'ex-15', source: S(15), learningPointId: LP.P1, difficulty: 'difficile', statement: '$n$ عدد طبيعي كيفي و $d$ قاسم مشترك للعددين $a$ و $b$ حيث $a = n + 19$ و $b = n + 1$.',
    items: ['1) احسب $a - b$.', '2) استعمل خواص قواعد الأعداد الطبيعية لتبيّن أنّ $d$ من قواسم 18.', '3) عيّن كل الأعداد الطبيعية التي يمكن أن تكون قواسم مشتركة للعددين $a$ و $b$.'], interaction: 'integerSet',
    question: { prompt: '3) الأعداد التي يمكن أن تكون قواسم مشتركة لـ $a$ و $b$:', expected: [1, 2, 3, 6, 9, 18], explain: '$a - b = 18$؛ القاسم المشترك $d$ يقسم الفرق (خاصية 1) فهو من قواسم 18: 1 ، 2 ، 3 ، 6 ، 9 ، 18.' },
    commonError: 'الاعتقاد أن القاسم المشترك يتعلق بقيمة n: الفرق ثابت مهما كان n.' },
  { id: 'ex-16', source: S(16), learningPointId: LP.P1, difficulty: 'difficile', statement: '$n$ عدد طبيعي كيفي. عيّن كل الأعداد الطبيعية التي يمكن أن تكون قواسم مشتركة للعددين $n + 2$ و $n + 32$.', interaction: 'integerSet',
    question: { prompt: 'الأعداد الممكنة:', expected: [1, 2, 3, 5, 6, 10, 15, 30], explain: 'الفرق $(n + 32) - (n + 2) = 30$؛ كل قاسم مشترك يقسم 30، فهو من قواسم 30.' } },
];
export const EX = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
