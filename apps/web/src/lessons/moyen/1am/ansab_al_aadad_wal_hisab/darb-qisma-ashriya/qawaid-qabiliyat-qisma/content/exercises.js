/**
 * Les exercices du MANUEL rattachés au درس « قواعد قابلية القسمة » (couverture : extraction.json → destinations). Chaque
 * exercice garde son énoncé et déclare l'interaction qui le rend ; toutes les clés sont recalculées par `n % d` dans
 * ./content.test.js (jamais par une règle de chiffres).
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '1am_qawaid-qabiliyat-qisma_P1',
  P2: '1am_qawaid-qabiliyat-qisma_P2',
  P3: '1am_qawaid-qabiliyat-qisma_P3',
  P4: '1am_qawaid-qabiliyat-qisma_P4',
};

const TWO_FIVE = ['على 2 فقط', 'على 5 فقط', 'على 2 وعلى 5', 'لا على 2 ولا على 5'];
const THREE_NINE = ['على 3 وعلى 9', 'على 3 فقط', 'لا على 3 ولا على 9'];
const TWO_FOUR = ['على 2 وعلى 4', 'على 2 فقط', 'لا على 2 ولا على 4'];

export const EXERCISES = [
  {
    id: 'ex-22', source: src('ex-22', 46, 'أتمرّن', 22), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'من بين الأعداد الآتية: 185 ، 150 ، 174 ، 10000 ، 44 ، 2015 ، 2020 ، حدّد تلك التي تقبل القسمة على 2 ، وتلك التي تقبل القسمة على 5 ، وتلك التي تقبل القسمة على 2 و 5 في آن واحد.',
    interaction: 'batch',
    question: {
      rows: [
        { label: '185', options: TWO_FIVE, correct: 1, correction: 'رقم آحاده 5.' },
        { label: '150', options: TWO_FIVE, correct: 2, correction: 'رقم آحاده 0.' },
        { label: '174', options: TWO_FIVE, correct: 0, correction: 'رقم آحاده 4.' },
        { label: '10000', options: TWO_FIVE, correct: 2, correction: 'رقم آحاده 0.' },
        { label: '44', options: TWO_FIVE, correct: 0, correction: 'رقم آحاده 4.' },
        { label: '2015', options: TWO_FIVE, correct: 1, correction: 'رقم آحاده 5.' },
        { label: '2020', options: TWO_FIVE, correct: 2, correction: 'رقم آحاده 0.' },
      ],
      explain: 'يقبل العدد القسمة على 2 وعلى 5 في آن واحد عندما يكون رقم آحاده 0.',
    },
    commonError: 'اعتبار 185 يقبل القسمة على 2 لأنّ فيه الرقم 8: رقم الآحاد وحده يقرّر.',
  },
  {
    id: 'ex-23', source: src('ex-23', 46, 'أتمرّن', 23), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'من بين الأعداد الآتية: 185 ، 150 ، 174 ، 2015 ، حدّد تلك التي تقبل القسمة على 3. هل هي تقبل القسمة على 9؟ ماذا تستنتج؟',
    interaction: 'batch',
    question: {
      rows: [
        { label: '185', options: THREE_NINE, correct: 2, correction: '$1 + 8 + 5 = 14$ لا يقبل القسمة على 3.' },
        { label: '150', options: THREE_NINE, correct: 1, correction: '$1 + 5 + 0 = 6$ يقبل القسمة على 3 ولا يقبلها على 9.' },
        { label: '174', options: THREE_NINE, correct: 1, correction: '$1 + 7 + 4 = 12$ يقبل القسمة على 3 ولا يقبلها على 9.' },
        { label: '2015', options: THREE_NINE, correct: 2, correction: '$2 + 0 + 1 + 5 = 8$.' },
      ],
      explain: 'العدد الذي يقبل القسمة على 3 لا يقبلها بالضرورة على 9: 150 و 174 مثالان.',
    },
    commonError: 'الظنّ أنّ كل مضاعف لـ 3 مضاعف لـ 9.',
  },
  {
    id: 'ex-24', source: src('ex-24', 46, 'أتمرّن', 24), learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'من بين الأعداد الآتية: 123 ، 84 ، 2016 ، 2018 ، 408 ، 123456 ، 2024 ، حدّد تلك التي تقبل القسمة على 2 . هل هي تقبل القسمة على 4 ؟ ماذا تستنتج؟',
    interaction: 'batch',
    question: {
      rows: [
        { label: '123', options: TWO_FOUR, correct: 2, correction: 'رقم آحاده 3: عدد فردي.' },
        { label: '84', options: TWO_FOUR, correct: 0, correction: '$84 = 4 \\times 21$.' },
        { label: '2016', options: TWO_FOUR, correct: 0, correction: '16 يقبل القسمة على 4.' },
        { label: '2018', options: TWO_FOUR, correct: 1, correction: '18 لا يقبل القسمة على 4.' },
        { label: '408', options: TWO_FOUR, correct: 0, correction: '08 أي 8 يقبل القسمة على 4.' },
        { label: '123456', options: TWO_FOUR, correct: 0, correction: '56 يقبل القسمة على 4.' },
        { label: '2024', options: TWO_FOUR, correct: 0, correction: '24 يقبل القسمة على 4.' },
      ],
      explain: 'كل عدد يقبل القسمة على 4 يقبلها على 2، والعكس غير صحيح (2018).',
    },
    commonError: 'الحكم بقابلية القسمة على 4 لأنّ العدد زوجي.',
  },
  {
    id: 'ex-26', source: src('ex-26', 46, 'أتمرّن', 26), learningPointId: LP.P1, difficulty: 'difficile',
    statement: 'إليك البطاقات 4 ، 5 ، 9 ، 3 . باستعمال جميع البطاقات السّابقة وبدون تكرار، شكّل أكبر عدد مكوّن من أربعة أرقام يقبل القسمة : أ) على 2 ب) على 3 ج) على 5',
    interaction: 'batch',
    question: {
      rows: [
        { label: 'أ) على 2', options: ['9534', '9354', '9543'], correct: 0, correction: 'رقم الآحاد زوجي: 4 ، ثم نرتّب 9 ، 5 ، 3 تنازليًا: 9534.' },
        { label: 'ب) على 3', options: ['9534', '9543', '9453'], correct: 1, correction: '$4 + 5 + 9 + 3 = 21$ : كل ترتيب يقبل القسمة على 3، وأكبرها 9543.' },
        { label: 'ج) على 5', options: ['9345', '9435', '9543'], correct: 1, correction: 'رقم الآحاد 5 ، ثم نرتّب 9 ، 4 ، 3 تنازليًا: 9435.' },
      ],
      explain: 'نضع أوّلًا رقم الآحاد الذي تفرضه القاعدة، ثم نرتّب الأرقام الباقية من الأكبر إلى الأصغر.',
    },
    commonError: 'اختيار عدد يقبل القسمة لكنه ليس الأكبر (9354، 9534 للقسمة على 3).',
  },
  {
    id: 'ex-32', source: src('ex-32', 46, 'أتمرّن', 32), learningPointId: LP.P4, difficulty: 'difficile',
    statement: 'لدى إيناس مجموعة من الجواهر عددها أقل من 100، تستعملها لتصنع بها عقودا للزينة. إذا وضعت في كل عقد جوهرتين أو ثلاث ، أو خمس جواهر لم يتبق معها أية جوهرة، بينما إذا وضعت في كل عقد سبع جواهر يتبقى معها ستة جواهر. ماهو عدد الجواهر لدى إيناس؟',
    interaction: 'numeric',
    question: { prompt: 'عدد الجواهر:', expected: 90, explain: 'العدد يقبل القسمة على 2 و 3 و 5: 30 ، 60 أو 90 (أقل من 100). $30 = 7 \\times 4 + 2$ ، $60 = 7 \\times 8 + 4$ ، $90 = 7 \\times 12 + 6$ : الجواب 90.' },
    commonError: 'الاكتفاء بالقسمة على 2 و 3 و 5 دون اختبار باقي القسمة على 7.',
  },
  {
    id: 'now-42', source: src('now-42', 42, 'دوري الآن'), learningPointId: LP.P3, difficulty: 'facile',
    statement: 'اختبر قابلية قسمة كل عدد من الأعداد الآتية على 4 : 108 ، 2020 ، 527 ، 4356748 .',
    interaction: 'batch',
    question: {
      rows: [
        { label: '108', options: ['يقبل القسمة على 4', 'لا يقبل القسمة على 4'], correct: 0, correction: '$08 = 8 = 4 \\times 2$.' },
        { label: '2020', options: ['يقبل القسمة على 4', 'لا يقبل القسمة على 4'], correct: 0, correction: '$20 = 4 \\times 5$.' },
        { label: '527', options: ['يقبل القسمة على 4', 'لا يقبل القسمة على 4'], correct: 1, correction: '27 عدد فردي.' },
        { label: '4356748', options: ['يقبل القسمة على 4', 'لا يقبل القسمة على 4'], correct: 0, correction: '$48 = 4 \\times 12$.' },
      ],
      explain: 'ننظر فقط إلى العدد المشكّل من رقمي الآحاد والعشرات.',
    },
    commonError: 'قسمة العدد كلّه بدل رقميه الأخيرين.',
  },
  {
    id: 'deep-8', source: src('deep-8', 48, 'أتعمّق', 8), learningPointId: LP.P3, difficulty: 'difficile',
    statement: 'حدّد السنوات الكبيسة من بين السنوات الآتية: 222، 816، 1700، 1414، 1576، 2002، 2017، 2020، 2196.',
    interaction: 'integerSet',
    question: { prompt: 'اكتب السنوات الكبيسة:', expected: [816, 1576, 2020, 2196], explain: '16، 76، 20، 96 تقبل القسمة على 4. 1700 يقبل القسمة على 100 ولا يقبلها على 400. 222، 1414، 2002 زوجية لكنّ 22، 14، 02 لا تقبل القسمة على 4، و 2017 فردي.' },
    commonError: 'اعتبار 1700 كبيسة لأنّ 00 يقبل القسمة على 4: السنوات المئوية استثناء.',
  },
];

/** « أقوّم تعلّماتي » 12 (p. 47) — repris dans le إختبار أولي (module 9). */
export const SELF_12 = { source: src('self-12', 47, 'أقوّم تعلّماتي', 12), numbers: [918, 4805, 120, 3216] };

export const EX = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
