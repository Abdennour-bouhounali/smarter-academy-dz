/**
 * Le contenu du MANUEL pour le درس « القسمة الإقليدية وحصر حاصل القسمة » (2AM, unité 2) — données pures, au mot près,
 * chaque bloc cite son élément de docs/sources/2am/unit2/extraction.json. Les modules rendent ces données ; ils n'en
 * réécrivent aucune. Ce qui n'est pas du manuel est un ajout DÉCLARÉ (`addition(<raison>)`).
 */
import { src, addition } from '../../_unit/unitMeta.js';

/** نشاط 1 (p. 24) — 2145 œufs, des plateaux de 30, et la division du fils. */
export const ACTIVITY = {
  source: src('act-1', 24, 'أنشطة', 1),
  title: 'القسمة الإقليدية',
  situation: 'صاحب مزرعة لتربية الدجاج يبيع البيض في صفائح من 30 بيضة، جمع اليوم 2145 بيضة. نريد إيجاد عدد الصفائح اللازمة لوضع البيض.',
  questions: [
    '1) أوجد حصرا للعدد 2145 بين عددين طبيعيين متتاليين: $30 \\times \\ldots \\le 2145 < 30 \\times \\ldots$',
    '2) استنتج عدد الصفائح التي يمكنه ملؤها. هل تبقى له صفائح غير مملوءة؟ ما هو عددها وكم بيضة فيها؟',
    '3) أكمل المساواة: $2145 = 30 \\times \\ldots + \\ldots$ . ماذا يمثل كل من العددين اللذين وجدتهما؟',
    '4) طلب صاحب المزرعة من ابنه الذي يدرس في السنة الثانية متوسط إحضار الصفائح اللازمة فأجرى العملية كما في الشكل المقابل لحساب عدد الصفائح. هل توافقه؟',
  ],
  // La division posée du fils (le « شكل المقابل ») : 2145 | 30, 210, 45 ; quotient 70.
  son: { lines: ['2145 | 30', '210 | 70', '45'], q: 70, r: 45 },
  numbers: { a: 2145, b: 30, q: 71, r: 15, then: 2160 },
};

/**
 * LE PANIER DE سلمى — l'expérience de la plateforme au niveau مبتدئ (lab `egg-trays`, monde `carton`, thème `farm`),
 * jamais le manuel. La MATHÉMATIQUE est celle de نشاط 1 (boîtes pleines, boîte entamée, a ÷ b entre deux entiers) ;
 * seuls les nombres sont plus petits, pour que chaque œuf soit dessiné.
 */
export const BASKET = {
  source: addition('interaction_generation'),
  situation: 'تساعد سلمى جدّتها كل صباح: جمعت اليوم 50 بيضة من قنّ الدجاج، وتضعها في علب، في كل علبة 12 بيضة.',
  numbers: { a: 50, b: 12, q: 4, r: 2, then: 60 },
};

/** « تذكّر » — la division euclidienne de 1AM (leçon publiée qisma-iqlidiya-baqi) : rappelée, jamais reconstruite. */
export const RECALL = {
  source: addition('prior_year_reminder'),
  title: 'تذكّر — السنة الأولى متوسط',
  text: 'في القسمة الإقليدية لعدد طبيعي $a$ على عدد طبيعي غير معدوم $b$ نشكّل أكبر عدد ممكن $q$ من المجموعات الكاملة، ويبقى $r$ : $a = b \\times q + r$ مع $r < b$ ، أي $b \\times q \\le a < b \\times (q + 1)$.',
  lesson: 'qisma-iqlidiya-baqi',
};

/** معارف 1 (p. 26) — la définition, l'exemple des 180 crayons, le reste nul, l'encadrement du quotient. */
export const KNOWLEDGE = {
  source: src('know-1a', 26, 'معارف', 1),
  definition: 'إجراء القسمة الإقليدية للعدد الطبيعي $a$ على العدد الطبيعي غير المعدوم $b$ ($b \\ne 0$) معناه إيجاد عددين طبيعيين $q$ و $r$ حيث $a = b \\times q + r$ و $0 \\le r < b$ . $a$ هو المقسوم و $b$ هو المقسوم عليه و $q$ هو حاصل القسمة و $r$ باقي القسمة.',
  divisibility: 'عندما يكون $r = 0$ نقول إنّ $a$ يقبل القسمة على $b$ . ونقول أيضا إنّ $a$ مضاعف للعدد $b$ .',
  example: {
    text: 'وزّع المعلم 180 قلما على تلاميذه بحيث يكون نصيب كل تلميذ 8 أقلام. ما هو عدد التلاميذ الذين يمكنهم الاستفادة من هذه الحصة من الأقلام؟',
    lines: [
      'يوجد 22 تلميذا يستفيد كل واحد منهم من حصة مكوّنة من 8 أقلام، وتبقى أربعة أقلام.',
      'ونعبّر عن ذلك بالكتابة: $180 = (8 \\times 22) + 4$ ، (لاحظ أنّ $4 < 8$).',
      '22 هو أكبر عدد طبيعي إذا ضربناه في 8 نحصل على عدد أقرب ما يمكن إلى 180 وأصغر منه.',
    ],
    numbers: { a: 180, b: 8, q: 22, r: 4 },
  },
  hasr: {
    source: src('know-1b', 26, 'معارف', 1),
    title: 'حصر حاصل القسمة',
    text: 'عندما أجرينا القسمة الإقليدية للعدد 180 على 8 وجدنا الحاصل 22 والباقي 4. $\\frac{180}{8}$ هي القيمة المضبوطة لحاصل القسمة.',
    example: '22 هي قيمة تقريبية إلى الوحدة بالنقصان لحاصل القسمة، و 23 هي قيمة تقريبية له إلى الوحدة بالزيادة. ولدينا: $22 < \\frac{180}{8} < 23$ .',
  },
  // L'énoncé « b يقسم a » n'est pas dans le معارف p. 26 (qui dit يقبل القسمة / مضاعف) : il vient de 1AM (« 4 قاسم لـ 60 »).
  divides: 'ونقول كذلك إنّ $b$ يقسم $a$ (أو $b$ قاسم لـ $a$)، وعندئذ $\\frac{a}{b}$ عدد طبيعي.',
  dividesSource: addition('knowledge_formalization'),
};

/**
 * طريقة — AJOUT DE LA PLATEFORME (la page « طرائق » p. 27 traite des écritures fractionnaires : leçon kasr-hasil-qisma).
 * Le نشاط 1 demande d'encadrer 2145 entre deux multiples consécutifs de 30 SANS calculatrice : on approche le quotient
 * par les multiples de 10 et de 100 du diviseur, puis on affine.
 */
export const METHOD = {
  source: addition('knowledge_formalization'),
  exercise: 'دون آلة حاسبة: احصر حاصل القسمة $\\frac{4750}{37}$ بين عددين طبيعيين متتاليين، ثم اكتب المساواة التي تعبّر عن القسمة الإقليدية.',
  solution: [
    'نبدأ بمضاعفات 37 في 10 و 100: $37 \\times 100 = 3700 \\le 4750 < 7400 = 37 \\times 200$ : الحاصل بين 100 و 200.',
    'نضيف عشرات: $37 \\times 120 = 4440 \\le 4750 < 4810 = 37 \\times 130$ : الحاصل بين 120 و 130.',
    'نضيف آحادًا: $37 \\times 128 = 4736 \\le 4750 < 4773 = 37 \\times 129$ : الحاصل 128 .',
    'الباقي: $4750 - 4736 = 14$ و $14 < 37$ ، أي $4750 = 37 \\times 128 + 14$ و $128 < \\frac{4750}{37} < 129$ .',
  ],
  rule: 'لحصر حاصل قسمة كبيرة دون آلة حاسبة نقترب منه بمضاعفات المقسوم عليه في 100 ثم في 10 ثم في 1 ، ونتوقّف عندما يصبح الفرق أصغر من المقسوم عليه.',
  numbers: { a: 4750, b: 37, q: 128, r: 14 },
  practice: { a: 9000, b: 125, q: 72, r: 0 },
};

/** « أستعدّ » — أستعدّ (p. 23), items 5 et 9 (les autres items vont aux autres leçons de l'unité). */
export const PREP_ITEMS = [
  { n: 5, skill: 'kasr', text: 'حاصل القسمة $\\frac{11}{7}$ يساوي $11 \\div 7$ .', answer: true, why: 'الكتابة الكسرية لحاصل قسمة 11 على 7 هي $\\frac{11}{7}$ ، أي $11 \\div 7 = \\frac{11}{7}$ (وليس $7 \\div 11$).' },
  { n: 9, skill: 'kasr', text: 'الكسر $\\frac{19}{5}$ يساوي $3 + \\frac{4}{5}$ .', answer: true, why: '$19 = 5 \\times 3 + 4$ ، إذن $\\frac{19}{5} = \\frac{15}{5} + \\frac{4}{5} = 3 + \\frac{4}{5}$ .' },
].map((it) => ({ ...it, source: src('prep', 23, 'أستعدّ', it.n) }));

/**
 * Les items de la PLATEFORME : le réseau dit que la leçon s'appuie sur `1am.m3.r01` (القسمة الإقليدية — leçon publiée
 * qisma-iqlidiya-baqi) et sur `2am.m1.r05` (القيمة المقرّبة — renvoi en avant vers kasr-hasil-qisma : on mesure sa base
 * 1AM, l'approximation à l'unité), que « أستعدّ » doit mesurer (LEARNING_NET.md §4.4).
 */
export const PREP_PLATFORM_ITEMS = [
  { skill: 'qisma', text: 'في القسمة الإقليدية للعدد 47 على 6 ، الحاصل 7 والباقي 5 .', answer: true, why: '$47 = 6 \\times 7 + 5$ و $5 < 6$ .' },
  { skill: 'qisma', text: 'المساواة $50 = 6 \\times 7 + 8$ تعبّر عن القسمة الإقليدية للعدد 50 على 6 .', answer: false, why: 'المساواة صحيحة لكنّ الباقي 8 أكبر من 6 : $50 = 6 \\times 8 + 2$ .' },
  { skill: 'taqrib', text: 'القيمة المقرّبة إلى الوحدة بالنقصان للعدد $7{,}4$ هي 7 ، وبالزيادة هي 8 .', answer: true, why: '$7 < 7{,}4 < 8$ : 7 أكبر عدد طبيعي أصغر منه، و 8 أصغر عدد طبيعي أكبر منه.' },
  { skill: 'taqrib', text: 'العدد $12{,}6$ محصور بين العددين الطبيعيين المتتاليين 11 و 12 .', answer: false, why: '$12 < 12{,}6 < 13$ : العدد محصور بين 12 و 13 .' },
].map((it) => ({ ...it, source: addition('prerequisite_diagnostic') }));

/**
 * Les phrases de correction partagées par les modules ET la carte (knowledgeGraph.js les cite mot pour mot).
 */
export const GUIDE = {
  son: {
    wrong: 'ابن صاحب المزرعة وجد الحاصل 70 والباقي 45 : هذه هي القسمة الإقليدية لـ 2145 على 30.',
    why: 'المساواة صحيحة، لكنّ 45 بيضة تملأ صفيحة أخرى: $45 = 30 + 15$ .',
    right: 'في القسمة الإقليدية الباقي أصغر من المقسوم عليه: $2145 = 30 \\times 71 + 15$ و $15 < 30$ .',
  },
  frame: {
    wrong: 'حاصل القسمة $\\frac{2145}{30}$ محصور بين الباقي 15 والعدد 16.',
    why: 'الباقي يعدّ البيض في الصفيحة غير المملوءة، لا الصفائح: الحاصل يقع بين عدد الصفائح المملوءة 71 وعدد الصفائح اللازمة 72.',
    right: '$71 < \\frac{2145}{30} < 72$ .',
  },
  exact: 'عندما يكون الباقي معدومًا يقع حاصل القسمة على عدد طبيعي بالضبط: $\\frac{2160}{30} = 72$ .',
  ends: 'الطرف الأصغر في الحصر هو عدد الصفائح المملوءة (قيمة مقرّبة إلى الوحدة بالنقصان)، والطرف الأكبر هو عدد الصفائح اللازمة لكل البيض (بالزيادة).',
};
