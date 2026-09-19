/**
 * Le contenu du MANUEL pour le درس 1 — données pures, au mot près, chaque
 * bloc cite son élément de docs/sources/4am/unit1/extraction.json.
 * Les modules rendent ces données ; ils n'en réécrivent aucune.
 */
import { src, addition } from '../../_unit/unitMeta.js';

export const ACTIVITY = {
  source: src('act-1', 8, 'أنشطة', 1),
  title: 'التعرّف على قاسم لعدد طبيعي',
  situation: 'أراد صاحب مكتبة ترتيب 420 كتابا في رفوف، بحيث يحتوي كل رفّ على نفس العدد من الكتب، ففكّر في كيفيتين:',
  options: ['أ) يضع 26 كتابا في كل رفّ.', 'ب) يضع 28 كتابا في كل رفّ.'],
  questions: ['أي الكيفيتين أنسب؟ اشرح.', 'ماذا يمثّل العدد 28 بالنّسبة إلى العدد 420؟'],
  numbers: { total: 420, candidates: [26, 28] },
};

export const KNOWLEDGE = {
  source: src('know-1', 10, 'معارف', 1),
  definitions: [
    { id: 'qasim-baqi', text: '$a$ و $b$ عددان طبيعيان حيث $b \\neq 0$. القول أن $b$ قاسم للعدد $a$، معناه أن باقي القسمة الإقليدية لـ $a$ على $b$ هو 0.',
      example: { text: '11 قاسم للعدد 143. 143 يقبل القسمة على 11.', division: { dividend: 143, divisor: 11, quotient: 13, remainder: 0 } } },
    { id: 'qasim-jidaa', text: '$a$ و $b$ عددان طبيعيان حيث $b \\neq 0$. القول أن $b$ قاسم للعدد $a$، معناه يوجد عدد طبيعي $q$ حيث $a = b \\times q$.',
      example: { text: '$120 = 6 \\times 20$ ومنه 6 قاسم للعدد 120 وحاصل القسمة $q = 20$ و لدينا أيضا $120 = 20 \\times 6$ ومنه 20 قاسم للعدد 120 و $q = 6$.' } },
  ],
  remarks: [
    { id: 'siyagh', text: 'كل الجمل الآتية لها نفس المعنى: • $b$ قاسم لـ $a$. • $b$ يقسم $a$. • $a$ يقبل القسمة على $b$. • $a$ مضاعف لـ $b$.',
      example: ['6 قاسم للعدد 120.', '6 يقسم 120.', '120 يقبل القسمة على 6.', '120 مضاعف للعدد 6.'] },
    { id: 'wahid', text: '1 قاسم لكل عدد طبيعي $a$ لأن $a = 1 \\times a$.' },
    { id: 'nafsuh', text: 'كل عدد طبيعي غير معدوم يقبل القسمة على نفسه و نكتب $a = a \\times 1$.' },
  ],
};

/** « أستعدّ » (p. 7), items 1 à 6 : القسمة الإقليدية وقواعد قابلية القسمة. */
export const PREP_ITEMS = [
  { n: 1, skill: 'qisma', text: 'حاصل قسمة 1954 على 4 هو 488.', answer: true, why: '$1954 = 4 \\times 488 + 2$: حاصل القسمة 488 والباقي 2.' },
  { n: 2, skill: 'qisma', text: 'المساواة $137 = 5 \\times 25 + 12$ تعبّر عن القسمة الإقليدية للعدد 137 على 5.', answer: false, why: 'الباقي 12 ليس أصغر من 5. القسمة الإقليدية هي $137 = 5 \\times 27 + 2$.' },
  { n: 3, skill: 'qisma', text: 'المساواة $72 = 24 \\times 3$ تعبّر عن القسمة الإقليدية للعدد 72 على 24 إذن باقي هذه القسمة هو 3.', answer: false, why: 'الباقي معدوم: $72 = 24 \\times 3 + 0$، و 3 هو حاصل القسمة.' },
  { n: 4, skill: 'qawaid', text: 'العدد 2017 يقبل القسمة على 2 لأن مجموع أرقامه يقبل القسمة على 2.', answer: false, why: 'قابلية القسمة على 2 تُقرأ من رقم الوحدات، و 2017 عدد فردي.' },
  { n: 5, skill: 'qawaid', text: 'العدد 2935 يقبل القسمة على 5 لأن رقم وحداته يقبل القسمة على 5.', answer: true, why: 'رقم الوحدات 5.' },
  { n: 6, skill: 'qawaid', text: 'العدد 70902 يقبل القسمة على 9 لأن مجموع أرقامه يقبل القسمة على 9.', answer: true, why: '$7 + 0 + 9 + 0 + 2 = 18$ و 18 يقبل القسمة على 9.' },
].map((it) => ({ ...it, source: src('prep', 7, 'أستعدّ', it.n) }));

/** Un ajout de la plateforme pour la manipulation : d'autres candidats que 26 et 28, déclaré comme tel. */
export const EXTRA_CANDIDATES = { source: addition('interaction_generation'), values: [10, 12, 14, 15, 16, 18, 20, 21, 25, 26, 28, 30, 32, 35, 40, 42, 60] };
