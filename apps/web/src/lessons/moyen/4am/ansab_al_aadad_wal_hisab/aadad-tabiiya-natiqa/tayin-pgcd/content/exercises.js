import { src } from '../../_unit/unitMeta.js';
export const LP = { P1: '4am_tayin-pgcd_P1', P2: '4am_tayin-pgcd_P2', P3: '4am_tayin-pgcd_P3' };
export const EXERCISES = [
  { id: 'ex-17a', source: { ...src('ex-17', 14, 'أوظّف تعلّماتي', 17), part: 'أ' }, learningPointId: LP.P3, difficulty: 'facile',
    statement: 'جد في كل حالة من الحالات الآتية القواسم المشتركة للعددين $a$ و $b$ ثم استنتج القاسم المشترك الأكبر لهما.', items: ['أ) $a = 18$ و $b = 36$'], interaction: 'numeric',
    question: { prompt: 'PGCD(18 ; 36) = ?', expected: 18, explain: 'قواسم 18: 1 ، 2 ، 3 ، 6 ، 9 ، 18 — كلها تقسم 36. أكبرها 18: عندما يكون b قاسمًا لـ a يكون PGCD(a ; b) = b.' } },
  { id: 'ex-17b', source: { ...src('ex-17', 14, 'أوظّف تعلّماتي', 17), part: 'ب' }, learningPointId: LP.P1, difficulty: 'facile', statement: 'ب) $a = 27$ و $b = 30$', interaction: 'numeric',
    question: { prompt: 'PGCD(27 ; 30) = ?', expected: 3, explain: 'قواسم 27: 1 ، 3 ، 9 ، 27. قواسم 30: 1 ، 2 ، 3 ، 5 ، 6 ، 10 ، 15 ، 30. المشتركة: 1 و 3.' } },
  { id: 'ex-17c', source: { ...src('ex-17', 14, 'أوظّف تعلّماتي', 17), part: 'جـ' }, learningPointId: LP.P1, difficulty: 'moyen', statement: 'جـ) $a = 57$ و $b = 95$', interaction: 'numeric',
    question: { prompt: 'PGCD(57 ; 95) = ?', expected: 19, explain: 'قواسم 57: 1 ، 3 ، 19 ، 57. قواسم 95: 1 ، 5 ، 19 ، 95. المشتركة: 1 و 19.' } },
  { id: 'ex-18', source: src('ex-18', 14, 'أوظّف تعلّماتي', 18), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'عيّن القاسم المشترك الأكبر للعددين 112 و 120 ثم للعددين 120 و 88. نسمي $d$ القاسم المشترك الأكبر للعددين 112 و 120. احسب القاسم المشترك الأكبر للعددين $d$ و 88.', interaction: 'choice',
    question: { prompt: 'النتائج الثلاث:', options: ['PGCD(112 ; 120) = 8 ؛ PGCD(120 ; 88) = 8 ؛ PGCD(8 ; 88) = 8', 'PGCD(112 ; 120) = 4 ؛ PGCD(120 ; 88) = 4 ؛ PGCD(4 ; 88) = 4', 'PGCD(112 ; 120) = 8 ؛ PGCD(120 ; 88) = 4 ؛ PGCD(8 ; 88) = 4', 'PGCD(112 ; 120) = 16'], correct: 0, cols: 1,
      explain: 'القواسم المشتركة لـ 112 و 120: 1 ، 2 ، 4 ، 8 → d = 8. القواسم المشتركة لـ 120 و 88: 1 ، 2 ، 4 ، 8 → 8. و 8 قاسم لـ 88 فـ PGCD(8 ; 88) = 8.' } },
  { id: 'ex-22', source: src('ex-22', 15, 'أوظّف تعلّماتي', 22), learningPointId: LP.P3, difficulty: 'difficile',
    statement: 'عيّن العدد الطبيعي $a$ المحصور بين 40 و 55 والذي يحقّق PGCD$(a ; 15) = 5$.', interaction: 'numeric',
    question: { prompt: 'a = ?', expected: 50, explain: 'PGCD(a ; 15) = 5 يعني أن 5 قاسم لـ a وأن 15 ليس قاسمًا له (وإلا كان PGCD = 15). بين 40 و 55: 45 يقبل القسمة على 15، يبقى 50.',
      explainFor: (n) => (n === 45 ? 'PGCD(45 ; 15) = 15 لأن 15 قاسم لـ 45.' : n === 40 || n === 55 ? 'العدد المطلوب محصور تمامًا بين 40 و 55.' : 'ابحث عن مضاعف للعدد 5 ليس مضاعفًا للعدد 15.') },
    commonError: 'اختيار 45: هو مضاعف لـ 15 فقاسمه المشترك الأكبر مع 15 هو 15 لا 5.' },
];
export const EX = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
