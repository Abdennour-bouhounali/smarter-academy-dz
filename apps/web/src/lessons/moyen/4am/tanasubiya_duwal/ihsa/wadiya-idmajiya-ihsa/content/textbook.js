import { src, addition, BASE } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — le « أستعدّ » du manuel (p. 91, items 1–4) est réparti entre les leçons
 * 1, 2 et 3 (extraction › destinations › prep) : la synthèse n'en reçoit aucun. Ses affirmations
 * sont donc des AFFIRMATIONS DE LA PLATEFORME (« عبارة إضافية من المنصّة »), dans la forme du manuel,
 * sur ce que la situation, « أؤكّد تعلّماتي » et « أتعمّق » mobilisent : l'effectif total, les
 * effectifs cumulés (درس 1), l'étendue, le rang de la médiane et la moyenne pondérée (درس 2), « أخذ
 * نسبة من عدد » à l'envers (le tout à partir d'une part) et une équation du premier degré (années
 * précédentes). Quatre vraies, quatre fausses ; jamais les nombres des médailles.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'takrar', text: 'في سلسلة قيمها 2 ، 5 ، 9 وتكراراتها على الترتيب 4 ، 7 ، 3 ، التكرار الكلي هو 3.', answer: false,
    why: 'التكرار الكلي مجموع التكرارات: $N = 4 + 7 + 3 = 14$ ؛ العدد 3 هو عدد القيم المختلفة.', source: addition('prerequisite_diagnostic') },
  { n: 2, skill: 'mujamma', text: 'في السلسلة نفسها، التكرار المجمع الصاعد للقيمة 5 هو 11.', answer: true,
    why: 'نجمع تكرار 5 وتكرارات القيم الأصغر منها: $4 + 7 = 11$.', source: addition('prerequisite_diagnostic') },
  { n: 3, skill: 'mujamma', text: 'في السلسلة نفسها، التكرار المجمع النازل للقيمة 5 هو 7.', answer: false,
    why: 'النازل يجمع تكرار 5 وتكرارات القيم الأكبر منها: $7 + 3 = 10$ ؛ العدد 7 تكرار القيمة 5 وحدها.', source: addition('prerequisite_diagnostic') },
  { n: 4, skill: 'mada', text: 'مدى السلسلة 12 ، 3 ، 18 ، 7 هو 18.', answer: false,
    why: 'المدى فرق: أكبر قيمة ناقص أصغر قيمة، $18 - 3 = 15$.', source: addition('prerequisite_diagnostic') },
  { n: 5, skill: 'wasit', text: 'سلسلة مرتّبة تكرارها الكلي 40: وسيطها نصف مجموع القيمتين اللتين رتبتاهما 20 و 21.', answer: true,
    why: '$N = 40$ زوجي: الرتبتان $\\dfrac{N}{2} = 20$ و $\\dfrac{N}{2} + 1 = 21$.', source: addition('prerequisite_diagnostic') },
  { n: 6, skill: 'mutawassit', text: 'متوسط سلسلة فيها القيمة 10 بتكرار 3 والقيمة 20 بتكرار 1 هو 15.', answer: false,
    why: 'المتوسط المتوازن: $\\dfrac{10 \\times 3 + 20 \\times 1}{4} = \\dfrac{50}{4} = 12{,}5$ ؛ العدد 15 متوسط القيمتين دون تكراريهما.', source: addition('prerequisite_diagnostic') },
  { n: 7, skill: 'nisba', text: 'إذا كان 40% من عدد يساوي 18 فإنّ هذا العدد هو 45.', answer: true,
    why: '$0{,}4 \\times 45 = 18$ : نجد العدد بقسمة 18 على $0{,}4$.', source: addition('prerequisite_diagnostic') },
  { n: 8, skill: 'muadala', text: 'حلّ المعادلة $2x + 24 = 40$ هو $x = 32$.', answer: false,
    why: '$2x = 40 - 24 = 16$ ، إذن $x = 8$ ؛ أمّا 32 فهو $40 - 8$.', source: addition('prerequisite_diagnostic') },
];

/**
 * « أدمج تعلّماتي » (p. 100) — la وضعية des médailles d'or olympiques, au mot près, son tableau
 * (deux valeurs cachées par des hexagones colorés : la première entre 2 et 4, la seconde entre 26 et
 * 32) et son « تحليل الوضعية » en trois étapes NOMMÉES par le manuel, gardées telles quelles.
 * `values` porte `null` à la place d'une valeur cachée : la plateforme ne retape la réponse nulle part
 * dans la donnée (la réponse est CALCULÉE par le test de rendu, lab.render.test.jsx).
 */
export const SITUATION = {
  source: src('situation', 100, 'أدمج تعلّماتي'),
  title: 'وضعية',
  caption: 'الميداليات الذهبية الأولمبية',
  intro: 'إليك حصيلة الميداليات الذهبية للدول الفائزة بها خلال إحدى دورات الألعاب الأولمبية.',
  data: 'وسيط السلسلة : 3 ميداليات. متوسط السلسلة : 7 ميداليات.',
  q1: '1) حدّد القيم التي لا تظهر في الجدول.',
  q2: '2) 69% من الدول الفائزة بميداليات، تحصّلت على الأقل على ميدالية ذهبية. ما هو عدد الدول التي تحصّلت فقط على ميداليات فضية أو برونزية؟ (نعطى قيمة مقرّبة إلى الوحدة)',
  valueLabel: 'عدد الميداليات الذهبية',
  countLabel: 'التكرار',
  figure: 'قيمتان مخفيتان بشكلين سداسيين: الأولى بين 2 و 4 ، والثانية بين 26 و 32.',
  analysis: [
    { label: 'قراءة الوضعية وفهمها', items: ['فهم وتحليل النص المكتوب', 'عمّ يتحدث النص؟', 'رتّب المعطيات ثمّ حدّد التعليمة (أو التعليمات).'] },
    { label: 'تحليل الوضعية واختيار استراتيجية حل مناسبة', items: ['ما هي المعطيات التي تساعدني في البحث عن القيم المخفية في الجدول؟', 'ما هو الإجراء المناسب الذي أستعمله؟'] },
    { label: 'تنفيذ استراتيجية الحل المختارة', items: ['استعمال الوسيط.', 'استعمال الوسط الحسابي وحل معادلة.', 'استعمال «أخذ نسبة من عدد» وحل معادلة.', 'تحرير الحل والشرح بجمل واضحة.'] },
  ],
  // Les nombres de la situation (null = valeur cachée) : la plateforme ne les retape nulle part ailleurs.
  numbers: {
    values: [1, 2, null, 4, 5, 6, 7, 11, 13, 14, 16, 26, null, 32],
    counts: [11, 3, 2, 1, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1],
    hidden: [{ index: 2, lo: 2, hi: 4 }, { index: 12, lo: 26, hi: 32 }],
    median: 3, mean: 7, percent: 69,
  },
};

/** Le texte d'une analyse (puces du manuel) en une ligne. */
export const analysisText = (a) => a.items.map((s) => `• ${s}`).join(' ');

/**
 * Le niveau مبتدئ du laboratoire (`interactive_example`) : les ALGÉRIENS d'abord — la même structure
 * que le manuel, une seule valeur cachée, la plus grande, que seule la balance (l'متوسط) peut
 * trouver : le rideau du وسيط ne bouge pas quand on la déplace (rangs 5 et 6 dans la colonne 2).
 *   valeurs 1, 2, 4, 5, ⬡ ; effectifs 3, 3, 2, 1, 1 ; N = 10 ; médiane 2 ; moyenne 3.
 */
export const SCHOOL_GAMES = {
  source: addition('interactive_example'),
  text: 'في الألعاب المدرسية الولائية، هذه حصيلة الميداليات الذهبية لعشر متوسطات. وسيط السلسلة: ميداليتان. متوسط السلسلة: 3 ميداليات. أكبر قيمة مخفية.',
  numbers: {
    values: [1, 2, 4, 5, null],
    counts: [3, 3, 2, 1, 1],
    hidden: [{ index: 4, lo: 6, hi: 12 }],
    median: 2, mean: 3,
  },
};

/**
 * Les props du laboratoire `stat-balance` du module 1, à ses DEUX niveaux — contrat des props du brief
 * de l'unité 8 §6 (manipulations/stats/StatBalance.jsx, écrit par la leçon 2), mode `hidden` : les
 * jetons cachés (`hidden` = « indice:min-max » de chaque colonne cachée, bornes = voisins du tableau)
 * sont glissés par l'élève jusqu'à ce que le rideau du وسيط tombe sur `targetMedian` et que la poutre
 * s'équilibre sur `targetMean`. Une valeur cachée s'écrit « ? » dans `series`. Écrites ici une fois :
 * le module les étale, le test de rendu (lab.render.test.jsx) monte le laboratoire avec ces props.
 *   مبتدئ  les jeux scolaires (plateforme) : UNE valeur cachée, l'extrême — seule la balance la trouve.
 *   متقدم  les médailles olympiques du manuel : DEUX valeurs cachées — le rideau puis la balance.
 */
export const LAB = {
  beginner: {
    series: '1:3|2:3|4:2|5:1|?:1', mode: 'hidden', hidden: '4:6-12', targetMean: '3', targetMedian: '2',
    unit: 'ميدالية', axis: '0:12:1', theme: 'medals',
  },
  advanced: {
    series: '1:11|2:3|?:2|4:1|5:2|6:2|7:1|11:1|13:1|14:2|16:1|26:1|?:1|32:1', mode: 'hidden', hidden: '2:2-4|12:26-32',
    targetMean: '7', targetMedian: '3', unit: 'ميدالية', axis: '0:32:4', theme: 'medals',
  },
};

/**
 * Les corrections et les méthodes du module 1 — importées aussi par la carte (knowledgeGraph.js) :
 * une aide de la carte cite la leçon mot pour mot. Toute égalité dans `$…$`.
 */
export const REMARKS = {
  jadwal: 'كل قيمة في السطر الأول عدد ميداليات ذهبية، وتكرارها في السطر الثاني عدد الدول التي فازت بذلك العدد من الميداليات.',
  takrarKulli: 'التكرار الكلي $N$ مجموع التكرارات، بما فيها تكرارا العمودين المخفيين: $N = 30$ دولة فازت بميدالية ذهبية واحدة على الأقل.',
  readWrong: 'نقرأ العدد 11 تحت القيمة 1 على أنّه دولة واحدة فازت بـ 11 ميدالية ذهبية.',
  readWhy: 'السطر الأول يعطي عدد الميداليات، والسطر الثاني يعطي عدد الدول: القيمة والتكرار لا يتبادلان.',
  readRight: '11 دولة فازت كلّ منها بميدالية ذهبية واحدة.',
  rutab: '$N = 30$ زوجي: الوسيط نصف مجموع القيمتين اللتين رتبتاهما $\\dfrac{30}{2} = 15$ و $16$.',
  mujamma: 'التكرارات المجمعة الصاعدة: 11 (القيمة 1)، ثم $11 + 3 = 14$ (القيمة 2)، ثم $14 + 2 = 16$ (القيمة المخفية الأولى): الرتب من 15 إلى 16 في عمودها.',
  wasitX: 'الرتبتان 15 و 16 كلتاهما في عمود القيمة المخفية الأولى، فالوسيط يساويها: القيمة المخفية الأولى 3 ، وهي فعلا بين 2 و 4.',
  wasitWrong: 'الوسيط نصف مجموع القيمتين الوسطيين في سطر الجدول (العمودان السابع والثامن): $\\dfrac{7 + 11}{2} = 9$.',
  wasitWhy: 'سطر الجدول يرتّب القيم المختلفة لا الدول: 11 دولة عند القيمة 1 وحدها. الوسيط يُعيَّن برتبته باستعمال التكرارات المجمعة.',
  wasitRight: 'نجمع التكرارات من البداية حتى نبلغ الرتبتين 15 و 16.',
  maloum: 'مجموع جداءات القيم الظاهرة في تكراراتها: $11 + 6 + 4 + 10 + 12 + 7 + 11 + 13 + 28 + 16 + 26 + 32 = 176$.',
  muadala: 'المتوسط 7 والتكرار الكلي 30 : مجموع الميداليات $7 \\times 30 = 210$ ، إذن $176 + 2 \\times 3 + y = 210$.',
  halY: '$182 + y = 210$ ، إذن $y = 28$ ، وهي فعلا بين 26 و 32.',
  tahqiq: 'نتحقّق: $\\dfrac{176 + 2 \\times 3 + 28}{30} = \\dfrac{210}{30} = 7$ ، والوسيط لم يتغيّر.',
  tarjihWrong: 'نكتب $176 + 3 + y = 210$.',
  tarjihWhy: 'القيمة المخفية الأولى تكرارها 2: فازت بها دولتان، فتُحسب مرتين في المجموع.',
  tarjihRight: 'نضرب كل قيمة في تكرارها: $176 + 2 \\times 3 + y = 210$.',
  nisbaEq: '30 دولة هي 69% من عدد الدول الفائزة بميداليات $T$ : $0{,}69 \\times T = 30$.',
  nisbaT: '$T = \\dfrac{30}{0{,}69} \\approx 43{,}48$ ، أي 43 دولة تقريبا (عدد الدول عدد طبيعي).',
  nisbaFaqat: '$43 - 30 = 13$ : 13 دولة تقريبا تحصّلت فقط على ميداليات فضية أو برونزية.',
  nisbaWrong: 'نحسب $0{,}69 \\times 30 = 20{,}7$.',
  nisbaWhy: 'العدد 30 هو 69% من الكل، وليس الكل: الكل هو المجهول.',
  nisbaRight: 'نكتب $0{,}69 \\times T = 30$ ثم نقسم 30 على $0{,}69$.',
  jumla: 'القيمتان المخفيتان 3 و 28 ، وعدد الدول التي تحصّلت فقط على ميداليات فضية أو برونزية 13 دولة تقريبا.',
  majhul: 'التكرار الكلي يعطي مجموع التكرارين المجهولين، ثم تحدّد رتبتا الوسيط أيّ توزيع هو الصحيح.',
  tajnid: '«على الأكثر» و«على الأقل» تُقرآن بالتكرار المجمع، التشتت بالمدى، «النصف» بالوسيط، والمجموع بالمتوسط.',
};

/**
 * « أؤكّد تعلّماتي » (p. 100) : les six QCM, au mot près ; chaque item renvoie au درس qui l'enseigne
 * (extraction › qcm › duplicatedIn) — 1, 2 → درس 1 (التكرار المجمع) ; 3–6 → درس 2 (مدى ووسيط ومتوسط) —
 * et la colonne « عند الحاجة أعود إلى الصفحة » du manuel (pp. 94–97). Les tableaux des items 1 et 2
 * sont redessinés (components/StatTable.jsx). Chaque item a UNE bonne réponse.
 */
export const QCM = [
  { n: 1, text: 'في الجدول الإحصائي أدناه التكرار المجمع الصاعد للقيمة 14 هو', table: { values: ['7', '9', '14', '28'], counts: ['6', '10', '3', '1'] },
    options: ['13', '19', '30'], correct: 1, pages: [94, 95], lesson: 'takrar-mujamma',
    explain: 'الصاعد يجمع تكرار 14 وتكرارات القيم الأصغر منها: $6 + 10 + 3 = 19$. العدد 13 يهمل تكرار القيمة 14 نفسها، و 30 هو التكرار الكلي.' },
  { n: 2, text: 'في الجدول الإحصائي أدناه التكرار المجمع النازل للقيمة 40 هو', table: { values: ['10', '20', '30', '40'], counts: ['50', '60', '70', '80'] },
    options: ['40', '80', '260'], correct: 1, pages: [94, 95], lesson: 'takrar-mujamma',
    explain: '40 أكبر قيمة: لا قيمة أكبر منها، فتكرارها المجمع النازل هو تكرارها 80. العدد 260 مجموع كل التكرارات (الصاعد لـ 40)، و 40 هي القيمة لا تكرارها.' },
  { n: 3, text: 'وسيط السلسلة الإحصائية : 8 20 40 60 هو', options: ['30', '20', '40'], correct: 0, pages: [96, 97], lesson: 'mada-wasit-mutawassit',
    explain: 'السلسلة مرتّبة و $N = 4$ زوجي: الوسيط نصف مجموع القيمتين اللتين رتبتاهما 2 و 3 ، $\\dfrac{20 + 40}{2} = 30$.' },
  { n: 4, text: 'مدى السلسلة 8,1 5,7 3 2,8 هو', options: ['6', '6,9', '5,3'], correct: 2, pages: [96, 97], lesson: 'mada-wasit-mutawassit',
    explain: 'أكبر قيمة $8{,}1$ وأصغر قيمة $2{,}8$ : المدى $8{,}1 - 2{,}8 = 5{,}3$.' },
  { n: 5, text: 'سلسلة إحصائية مرتّبة تكرارها الكلي 97. وسيط هذه السلسلة هو القيمة التي رتبتها...', options: ['49', '50', '51'], correct: 0, pages: [96, 97], lesson: 'mada-wasit-mutawassit',
    explain: '$N = 97$ فردي: الوسيط القيمة ذات الرتبة $\\dfrac{97 + 1}{2} = 49$ ، قبلها 48 قيمة وبعدها 48 قيمة.' },
  { n: 6, text: 'متوسط السلسلة 13 1 4 10 12', options: ['أصغر من وسيطها', 'أكبر من وسيطها', 'يساوي وسيطها'], correct: 0, pages: [97], lesson: 'mada-wasit-mutawassit',
    explain: 'المتوسط $\\dfrac{13 + 1 + 4 + 10 + 12}{5} = \\dfrac{40}{5} = 8$ ؛ وبعد الترتيب 1 ، 4 ، 10 ، 12 ، 13 الوسيط 10. إذن $8 < 10$ : القيمة الصغيرة 1 تسحب المتوسط نحو الأسفل ولا تحرّك الوسيط.' },
].map((it) => ({ ...it, source: src('qcm', 100, 'أؤكّد تعلّماتي', it.n), lessonPath: `${BASE}/${it.lesson}` }));

export const LESSON_TITLES = {
  'takrar-mujamma': 'الدرس 1 — التكرار المجمع والتواتر المجمع (الصاعد والنازل)',
  'mada-wasit-mutawassit': 'الدرس 2 — مدى ووسيط ومتوسط سلسلة إحصائية',
};

/**
 * « إختبار أولي » (module 4) — la situation TRANSPOSÉE (`synthesis_generation`) : mêmes ressources,
 * autres nombres, pour que ses réponses n'apparaissent nulle part ailleurs dans la leçon.
 *   valeurs 1, 2, ⬡, 5, 6, 8, 9, 12, ⬡, 21 ; effectifs 6, 2, 3, 2, 1, 1, 1, 1, 1, 2 ; N = 20 ;
 *   médiane 4 → rangs 10 et 11 (cumulés 6, 8, 11) dans la colonne cachée → première valeur 4 ;
 *   moyenne 6,2 → 97 + 3 × 4 + y = 124 → y = 15 ; 64 % → 20 ÷ 0,64 = 31,25 ≈ 31 → 11 pays.
 */
export const TEST = {
  source: addition('synthesis_generation'),
  title: 'البطولة الإفريقية لألعاب القوى: قيمتان مخفيتان وعدد الدول',
  intro: 'إليك حصيلة الميداليات الذهبية للدول الفائزة بها خلال إحدى دورات البطولة الإفريقية لألعاب القوى.',
  data: 'وسيط السلسلة : 4 ميداليات. متوسط السلسلة : $6{,}2$ ميدالية.',
  q2: '64% من الدول الفائزة بميداليات تحصّلت على الأقل على ميدالية ذهبية.',
  numbers: {
    values: [1, 2, null, 5, 6, 8, 9, 12, null, 21],
    counts: [6, 2, 3, 2, 1, 1, 1, 1, 1, 2],
    hidden: [{ index: 2, lo: 2, hi: 5 }, { index: 8, lo: 12, hi: 21 }],
    median: 4, mean: '6,2', percent: 64,
  },
};
