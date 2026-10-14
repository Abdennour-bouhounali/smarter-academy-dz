/**
 * Les exercices du درس « القسمة الإقليدية وحصر حاصل القسمة » (module 4 أتمرّن). Le manuel n'en a qu'un sur la division
 * euclidienne (ex-33 p. 32, couverture : extraction.json → destinations) ; les autres sont des AJOUTS DÉCLARÉS de la
 * plateforme, « على منوال » les examens du 1er trimestre de 2AM (corpus docs/sources/moyen/exams/exams-index.json :
 * 2am-s1-79 ex 1, 2am-s1-87 ex 3, 2am-s1-77 ex 2), avec d'autres nombres. Chaque clé est recalculée dans ./content.test.js.
 */
import { src, addition } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '2am_qisma-iqlidiya-hasr_P1',
  P2: '2am_qisma-iqlidiya-hasr_P2',
  P3: '2am_qisma-iqlidiya-hasr_P3',
};

const PLATFORM = addition('practice_generation');

export const EXERCISES = [
  {
    id: 'ex-33', source: src('ex-33', 32, 'أوظّف تعلّماتي', 33), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'في البلدان الأنجلو-سكسونية يفككون الكسر الأكبر من 1 إلى مجموع عدد طبيعي والكسر الأصغر من 1، كما في المثال: $\\frac{7}{5} = 1 + \\frac{2}{5}$ . استعمل نفس الطريقة مع الكسور التالية: $\\frac{129}{11}$ ؛ $\\frac{81}{7}$ ؛ $\\frac{67}{15}$ ؛ $\\frac{17}{3}$ .',
    interaction: 'batch',
    question: {
      rows: [
        { label: '$\\frac{129}{11}$', options: ['$11 + \\frac{8}{11}$', '$8 + \\frac{11}{11}$', '$10 + \\frac{9}{11}$'], correct: 0, correction: '$129 = 11 \\times 11 + 8$ و $8 < 11$ .' },
        { label: '$\\frac{81}{7}$', options: ['$11 + \\frac{4}{7}$', '$10 + \\frac{4}{7}$', '$4 + \\frac{11}{7}$'], correct: 0, correction: '$81 = 7 \\times 11 + 4$ و $4 < 7$ .' },
        { label: '$\\frac{67}{15}$', options: ['$3 + \\frac{7}{15}$', '$4 + \\frac{7}{15}$', '$7 + \\frac{4}{15}$'], correct: 1, correction: '$67 = 15 \\times 4 + 7$ و $7 < 15$ .' },
        { label: '$\\frac{17}{3}$', options: ['$5 + \\frac{2}{3}$', '$4 + \\frac{2}{3}$', '$2 + \\frac{5}{3}$'], correct: 0, correction: '$17 = 3 \\times 5 + 2$ و $2 < 3$ .' },
      ],
      explain: 'العدد الطبيعي هو حاصل القسمة الإقليدية والبسط الجديد هو الباقي: الكسر الباقي أصغر من 1 لأنّ الباقي أصغر من المقام. ومنه مثلا $11 < \\frac{129}{11} < 12$ .',
    },
    commonError: 'الخلط بين الحاصل والباقي: العدد الطبيعي هو الحاصل (عدد المرّات)، والبسط الجديد هو الباقي.',
  },
  {
    id: 'ex-p1', source: PLATFORM, learningPointId: LP.P1, difficulty: 'facile',
    statement: 'على منوال اختبار الفصل الأول: أوجد حاصل وباقي القسمة الإقليدية للعدد 337 على 13 ، ثم استنتج حصرا لحاصل القسمة $\\frac{337}{13}$ بين عددين طبيعيين متتاليين.',
    interaction: 'batch',
    question: {
      rows: [
        { label: 'المساواة', options: ['$337 = 13 \\times 25 + 12$', '$337 = 13 \\times 24 + 25$', '$337 = 13 \\times 26 - 1$'], correct: 0, correction: '$13 \\times 25 = 325$ و $337 - 325 = 12 < 13$ . (الباقي 25 أكبر من 13.)' },
        { label: 'الحصر', options: ['$12 < \\frac{337}{13} < 13$', '$24 < \\frac{337}{13} < 25$', '$25 < \\frac{337}{13} < 26$'], correct: 2, correction: '$13 \\times 25 < 337 < 13 \\times 26$ ، نقسم على 13 : $25 < \\frac{337}{13} < 26$ .' },
      ],
      explain: 'الحاصل والعدد الذي يليه يحصران حاصل القسمة؛ الباقي لا يدخل في الحصر.',
    },
    commonError: 'حصر حاصل القسمة بالباقي 12 والعدد 13.',
  },
  {
    id: 'ex-p2', source: PLATFORM, learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'على منوال اختبار الفصل الأول: كتب أنس ثلاث مساويات صحيحة حسابيًا للعدد 1000 والعدد 45. أيّها تعبّر عن القسمة الإقليدية للعدد 1000 على 45؟',
    interaction: 'choice',
    question: {
      prompt: 'المساواة التي تعبّر عن القسمة الإقليدية للعدد 1000 على 45 هي:',
      options: ['$1000 = 45 \\times 21 + 55$', '$1000 = 45 \\times 22 + 10$', '$1000 = 45 \\times 20 + 100$'],
      correct: 1, cols: 1,
      explain: 'في $1000 = 45 \\times 22 + 10$ الباقي 10 أصغر من 45 . في المساواتين الأخريين الباقي (55 و 100) أكبر من 45 : يمكن تشكيل مجموعات أخرى.',
    },
    commonError: 'الحكم على المساواة بصحّة الحساب وحده (كما فعل ابن صاحب المزرعة).',
  },
  {
    id: 'ex-p3', source: PLATFORM, learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'على منوال اختبار الفصل الأول: لبناء مدرسة جديدة في الحيّ يجب نقل 32,46 طنا من الرمل بشاحنات صغيرة، حمولة الواحدة منها 4 أطنان. تُظهر الآلة الحاسبة: $32{,}46 \\div 4 = 8{,}115$ .',
    interaction: 'batch',
    question: {
      rows: [
        { label: 'حصر $\\frac{32{,}46}{4}$ بين عددين طبيعيين متتاليين', options: ['8 و 9', '32 و 33', '8,1 و 8,2'], correct: 0, correction: '$8 < 8{,}115 < 9$ .' },
        { label: 'عدد الشاحنات اللازمة لنقل كل الرمل', options: ['8', '9', '33'], correct: 1, correction: '8 شاحنات تنقل 32 طنا فقط؛ يلزم 9 شاحنات: القيمة المقرّبة إلى الوحدة بالزيادة.' },
      ],
      explain: 'العدد اللازم هو القيمة المقرّبة بالزيادة لأنّ الرمل الباقي يحتاج شاحنة أخرى.',
    },
    commonError: 'الإجابة بـ 8 شاحنات: القيمة بالنقصان لا تنقل كل الرمل.',
  },
  {
    id: 'ex-p4', source: PLATFORM, learningPointId: LP.P3, difficulty: 'facile',
    statement: 'نعلم أنّ $2160 = 30 \\times 72$ و $2145 = 30 \\times 71 + 15$ . أجب بصحيح أو خاطئ.',
    interaction: 'trueFalse',
    question: {
      rows: [
        { text: '2160 مضاعف للعدد 30 .', answer: true, why: 'الباقي معدوم: $2160 = 30 \\times 72$ .' },
        { text: '30 يقسم 2160 ، و $\\frac{2160}{30} = 72$ .', answer: true, why: 'الباقي معدوم، فحاصل القسمة عدد طبيعي.' },
        { text: '30 يقبل القسمة على 2160 .', answer: false, why: 'العكس: 2160 يقبل القسمة على 30 .' },
        { text: '$\\frac{2145}{30}$ عدد طبيعي.', answer: false, why: 'الباقي 15 ليس معدومًا: $71 < \\frac{2145}{30} < 72$ .' },
      ],
    },
    commonError: 'قلب الاتجاه: « 30 يقبل القسمة على 2160 » بدل « 2160 يقبل القسمة على 30 ».',
  },
];

export const EX = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
