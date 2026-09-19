import { src } from '../../_unit/unitMeta.js';
import { CHALLENGE } from './textbook.js';
export const LP = { P1: '4am_bahth-pgcd_P1', P2: '4am_bahth-pgcd_P2', P3: '4am_bahth-pgcd_P3', P4: '4am_bahth-pgcd_P4', P5: '4am_bahth-pgcd_P5' };
const S19 = (part) => ({ ...src('ex-19', 14, 'أوظّف تعلّماتي', 19), part });
export const EXERCISES = [
  { id: 'now-13-1', source: src('now-13-1', 13, 'دوري الآن', 1), learningPointId: LP.P4, difficulty: 'facile', statement: 'احسب PGCD(285 ; 45).', interaction: 'numeric',
    question: { prompt: 'PGCD(285 ; 45) = ?', expected: 15, explain: '$285 = 45 \\times 6 + 15$ و $45 = 15 \\times 3 + 0$: آخر باقٍ غير معدوم هو 15.' } },
  { id: 'ex-19a', source: S19('أ'), learningPointId: LP.P2, difficulty: 'moyen', statement: 'باستعمال الفوارق المتتالية، جد في كل حالة من الحالات الآتية القاسم المشترك الأكبر للعددين.', items: ['أ) $a = 437$ و $b = 1035$'], interaction: 'numeric',
    question: { prompt: 'PGCD(437 ; 1035) = ?', expected: 23, explain: '1035 − 437 = 598 ، 598 − 437 = 161 ، 437 − 161 = 276 ، 276 − 161 = 115 ، 161 − 115 = 46 ، 115 − 46 = 69 ، 69 − 46 = 23 ، 46 − 23 = 23 ، 23 − 23 = 0: آخر فرق غير معدوم 23.' } },
  { id: 'ex-19b', source: S19('ب'), learningPointId: LP.P2, difficulty: 'moyen', statement: 'ب) $a = 3906$ و $b = 7914$', interaction: 'numeric',
    question: { prompt: 'PGCD(3906 ; 7914) = ?', expected: 6, explain: 'الفروق المتتابعة تنتهي بـ 6 (يمكن التحقّق بإقليدس: 7914 = 3906 × 2 + 102 ، 3906 = 102 × 38 + 30 ، 102 = 30 × 3 + 12 ، 30 = 12 × 2 + 6 ، 12 = 6 × 2 + 0).' } },
  { id: 'ex-19c', source: S19('جـ'), learningPointId: LP.P2, difficulty: 'moyen', statement: 'جـ) $a = 943$ و $b = 861$', interaction: 'numeric',
    question: { prompt: 'PGCD(943 ; 861) = ?', expected: 41, explain: '943 − 861 = 82 ، ثم الفروق مع 82 تنتهي بـ 41: 861 = 82 × 10 + 41 و 82 = 41 × 2.' } },
  { id: 'ex-19d', source: S19('د'), learningPointId: LP.P2, difficulty: 'difficile', statement: 'د) $a = 1111$ و $b = 111111$', interaction: 'numeric',
    question: { prompt: 'PGCD(1111 ; 111111) = ?', expected: 11, explain: '111111 = 1111 × 100 + 11 و 1111 = 11 × 101 + 0: القاسم المشترك الأكبر 11 (الفروق تطول هنا؛ الخاصيتان تعطيان نفس النتيجة).' } },
  { id: 'ex-20', source: src('ex-20', 14, 'أوظّف تعلّماتي', 20), learningPointId: LP.P4, difficulty: 'moyen', statement: 'احسب القاسم المشترك الأكبر للعددين الطبيعيين 5858 و 6767.', interaction: 'numeric',
    question: { prompt: 'PGCD(5858 ; 6767) = ?', expected: 101, explain: '$6767 = 5858 \\times 1 + 909$ ، $5858 = 909 \\times 6 + 404$ ، $909 = 404 \\times 2 + 101$ ، $404 = 101 \\times 4 + 0$.' } },
  { id: 'ex-21', source: src('ex-21', 14, 'أوظّف تعلّماتي', 21), learningPointId: LP.P4, difficulty: 'difficile', statement: 'احسب PGCD(21 957 ; 43 351).', interaction: 'numeric',
    question: { prompt: 'PGCD(21957 ; 43351) = ?', expected: 563, explain: '$43351 = 21957 \\times 1 + 21394$ ، $21957 = 21394 \\times 1 + 563$ ، $21394 = 563 \\times 38 + 0$.' } },
  { id: 'challenge', source: CHALLENGE.source, learningPointId: LP.P5, difficulty: 'maitrise', statement: CHALLENGE.text, interaction: 'choice',
    question: { prompt: 'أكبر عدد ممكن من المدارس، وحصة كل مدرسة:', options: ['13 مدرسة: 72 مئزرًا ورديًا و 65 مئزرًا أزرقًا لكل مدرسة', '91 مدرسة', '7 مدارس', '1 مدرسة فقط'], correct: 0, cols: 1,
      explain: 'عدد المدارس قاسم مشترك لـ 936 و 845، وأكبره PGCD(936 ; 845). بإقليدس: 936 = 845 × 1 + 91 ، 845 = 91 × 9 + 26 ، 91 = 26 × 3 + 13 ، 26 = 13 × 2 + 0 → 13. ثم 936 ÷ 13 = 72 و 845 ÷ 13 = 65.' },
    method: 'ترجمة «أكبر عدد ممكن من المدارس، نفس العدد من كل لون» إلى PGCD، ثم خوارزمية إقليدس.', commonError: 'الخلط بين عدد المدارس (PGCD) وحصة كل مدرسة (حاصل القسمة على PGCD).' },
];
export const EX = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
