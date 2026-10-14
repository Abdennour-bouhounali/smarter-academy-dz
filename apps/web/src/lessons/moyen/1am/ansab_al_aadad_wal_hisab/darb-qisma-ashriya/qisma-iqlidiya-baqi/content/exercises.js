/**
 * Les exercices du MANUEL rattachés au درس « القسمة الإقليدية » (couverture : extraction.json → destinations). Chaque
 * exercice garde son énoncé au mot près et déclare l'interaction qui le rend ; les réponses sont celles calculées dans
 * docs/sources/1am/unit3/build-extraction.py (et recalculées dans ./content.test.js).
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '1am_qisma-iqlidiya-baqi_P1',
  P2: '1am_qisma-iqlidiya-baqi_P2',
  P3: '1am_qisma-iqlidiya-baqi_P3',
};

export const EXERCISES = [
  {
    id: 'ex-15', source: src('ex-15', 45, 'أتمرّن', 15), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'أ) أتمم كل حصر مما يأتي بعددين طبيعيين متتاليين. ب) استنتج ممّا سبق حاصل وباقي القسمة الإقليدية لكل من 1) 43 على 8 2) 99 على 13 3) 215 على 7',
    interaction: 'batch',
    question: {
      rows: [
        { label: '$8 \\times \\ldots < 43 < 8 \\times \\ldots$', options: ['5 و 6', '4 و 5', '6 و 7'], correct: 0, correction: '$8 \\times 5 = 40 < 43 < 48 = 8 \\times 6$ : الحاصل 5 والباقي $43 - 40 = 3$.' },
        { label: '$13 \\times \\ldots < 99 < 13 \\times \\ldots$', options: ['6 و 7', '7 و 8', '8 و 9'], correct: 1, correction: '$13 \\times 7 = 91 < 99 < 104 = 13 \\times 8$ : الحاصل 7 والباقي $99 - 91 = 8$.' },
        { label: '$7 \\times \\ldots < 215 < 7 \\times \\ldots$', options: ['30 و 31', '31 و 32', '29 و 30'], correct: 0, correction: '$7 \\times 30 = 210 < 215 < 217 = 7 \\times 31$ : الحاصل 30 والباقي 5.' },
      ],
      explain: 'العدد الأصغر في الحصر هو الحاصل، والفرق بين العدد وأكبر مضاعف أصغر منه هو الباقي.',
    },
    commonError: 'اختيار حصر يكون فيه المضاعف الأكبر أصغر من العدد: عندئذ يمكن تشكيل مجموعة أخرى.',
  },
  {
    id: 'ex-16', source: src('ex-16', 45, 'أتمرّن', 16), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'المساويات $2017 = 25 \\times 80 + 17$ ، $2017 = 21 \\times 90 + 127$ ، $2017 = 24 \\times 84 + 1$ صحيحة. إحدى المساويات السّابقة لا تعبّر عن قسمة إقليدية، حدّدها مبررا اختيارك.',
    interaction: 'choice',
    question: {
      prompt: 'أيّ مساواة لا تعبّر عن قسمة إقليدية؟',
      options: ['$2017 = 25 \\times 80 + 17$', '$2017 = 21 \\times 90 + 127$', '$2017 = 24 \\times 84 + 1$'],
      correct: 1, cols: 1,
      explain: 'في $2017 = 21 \\times 90 + 127$ الباقي 127 أكبر من 21 ومن 90: يمكن تشكيل مجموعات أخرى. أمّا المساواتان الأخريان فباقياهما (17 و 1) أصغر من كل من العاملين.',
    },
    commonError: 'الحكم على المساواة بصحّة الحساب وحده: المساواة صحيحة لكنّ الباقي أكبر من المقسوم عليه.',
  },
  {
    id: 'ex-17', source: src('ex-17', 46, 'أتمرّن', 17), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'أُنقل ثمّ أتمم القسمات الإقليدية الآتية، ثم ترجمها إلى مساويات تعبّر عن قسمة إقليدية: 762 على 3 ، 408 على 9 ، 457 على 6.',
    interaction: 'batch',
    question: {
      rows: [
        { label: '762 على 3', options: ['$762 = 3 \\times 254 + 0$', '$762 = 3 \\times 250 + 12$', '$762 = 3 \\times 245 + 27$'], correct: 0, correction: '$3 \\times 254 = 762$ : الباقي 0.' },
        { label: '408 على 9', options: ['$408 = 9 \\times 44 + 12$', '$408 = 9 \\times 45 + 3$', '$408 = 9 \\times 40 + 48$'], correct: 1, correction: '$9 \\times 45 = 405$ و $408 - 405 = 3 < 9$.' },
        { label: '457 على 6', options: ['$457 = 6 \\times 75 + 7$', '$457 = 6 \\times 70 + 37$', '$457 = 6 \\times 76 + 1$'], correct: 2, correction: '$6 \\times 76 = 456$ و $457 - 456 = 1 < 6$.' },
      ],
      explain: 'كل الخيارات مساويات صحيحة حسابيًا؛ القسمة الإقليدية هي التي يكون فيها الباقي أصغر من المقسوم عليه.',
    },
    commonError: 'قبول باقٍ أكبر من المقسوم عليه أو يساويه (12 أو 7).',
  },
  {
    id: 'ex-18-a', source: src('ex-18', 46, 'أتمرّن', 18), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'أنجز عمليا القسمة الإقليدية لـ 3025 على 48.',
    interaction: 'numeric',
    question: { prompt: 'حاصل القسمة:', expected: 63, explain: '$48 \\times 63 = 3024$ و $48 \\times 64 = 3072$ أكبر من 3025 : الحاصل 63 والباقي 1.' },
    commonError: 'نسيان رقم في الحاصل عند إنزال رقم لا يكفي للقسمة.',
  },
  {
    id: 'ex-18-b', source: src('ex-18', 46, 'أتمرّن', 18), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'أنجز عمليا القسمة الإقليدية لـ 659 على 32.',
    interaction: 'numeric',
    question: { prompt: 'باقي القسمة:', expected: 19, explain: '$32 \\times 20 = 640$ و $659 - 640 = 19 < 32$ : $659 = 32 \\times 20 + 19$.' },
    commonError: 'نسيان صفر الحاصل: 65 تعطي 2 ثم 19 لا تكفي، فنكتب 0 في الحاصل (20 لا 2).',
  },
  {
    id: 'ex-19', source: src('ex-19', 46, 'أتمرّن', 19), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'اكتشف الأخطاء في كل عملية ثمّ صحّحها. (تلميذ قسم 531 على 5 فوجد الحاصل 16 والباقي 1 ، وقسم 602 على 4 فوجد الحاصل 15 والباقي 2.)',
    interaction: 'batch',
    question: {
      rows: [
        { label: '531 على 5', options: ['الحاصل الصحيح 106 والباقي 1', 'الحاصل الصحيح 16 والباقي 11', 'لا خطأ'], correct: 0, correction: 'بعد 5 ننزل 3 : 3 أصغر من 5 فنكتب 0 في الحاصل، ثم 31 : $5 \\times 6 = 30$. $531 = 5 \\times 106 + 1$.' },
        { label: '602 على 4', options: ['لا خطأ', 'الحاصل الصحيح 150 والباقي 2', 'الحاصل الصحيح 151 والباقي 0'], correct: 1, correction: 'بعد 20 ننزل 2 : 2 أصغر من 4 فنكتب 0 في الحاصل. $602 = 4 \\times 150 + 2$.' },
      ],
      explain: 'كلّما أنزلنا رقمًا ولم يكفِ للقسمة كتبنا 0 في الحاصل.',
    },
    commonError: 'إهمال الصفر في الحاصل.',
  },
  {
    id: 'ex-20', source: src('ex-20', 46, 'أتمرّن', 20), learningPointId: LP.P3, difficulty: 'facile',
    statement: 'بعد أن جمع مربي دواجن 123 بيضة، وضعها في أطباق، يحتوي كل طبق على 30 خانة. كم يكون قد وضع من البيض في آخر طبق، علما أنّ الأطباق الأخرى مملوءة كلّها؟',
    interaction: 'numeric',
    question: { prompt: 'عدد البيض في آخر طبق:', expected: 3, explain: '$123 = 30 \\times 4 + 3$ : 4 أطباق مملوءة، وفي الطبق الخامس 3 بيضات.' },
    commonError: 'الإجابة بالحاصل 4 بدل الباقي 3: السؤال عن آخر طبق.',
  },
  {
    id: 'ex-21', source: src('ex-21', 46, 'أتمرّن', 21), learningPointId: LP.P3, difficulty: 'difficile',
    statement: 'يصادف تاريخ ميلاد يونس هذه السنة يوم الثلاثاء، ماهو اليوم الذي يصادف تاريخ ميلاده السنة المقبلة؟',
    interaction: 'choice',
    question: {
      prompt: 'إذا كانت بين التاريخين 365 يومًا، فيوم ميلاده في السنة المقبلة هو:',
      options: ['الأربعاء', 'الثلاثاء', 'الجمعة'],
      correct: 0, cols: 3,
      explain: '$365 = 7 \\times 52 + 1$ : 52 أسبوعًا كاملًا ويوم واحد زائد، فننتقل من الثلاثاء إلى الأربعاء. (لو كانت بينهما 366 يومًا لكان الخميس.)',
    },
    commonError: 'الظنّ أنّ اليوم نفسه يتكرّر لأنّ السنة «أسابيع كاملة»: الباقي 1 هو الذي يحرّك اليوم.',
  },
];

/** « أقوّم تعلّماتي » (p. 47) — repris dans le إختبار أولي (module 8). */
export const SELF = {
  7: { source: src('self-7', 47, 'أقوّم تعلّماتي', 7) },
  8: { source: src('self-8', 47, 'أقوّم تعلّماتي', 8) },
};

export const EX = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
