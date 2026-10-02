import { src, addition, BASE } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — le « أستعدّ » du manuel (p. 55, items 1–10) est réparti
 * entre les leçons 1 et 2 (extraction › destinations › prep) : la synthèse n'en
 * reçoit aucun. Ses affirmations sont donc des AFFIRMATIONS DE LA PLATEFORME
 * (SourceTag « عبارة إضافية من المنصّة »), dans la forme du manuel, sur ce que la
 * situation et « أتعمّق » mobilisent : une équation à deux inconnues et la
 * solution d'une جملة (درس 1), la substitution et l'addition (درس 2), la
 * traduction d'un texte et la vérification dans le texte (درس 3), et le
 * pourcentage (années précédentes — ex. 31). Jamais les nombres du حفل.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'mafhum', text: '$x - 4y = 3$ معادلة من الدرجة الأولى بمجهولين $x$ و $y$.', answer: true,
    why: 'فيها مجهولان $x$ و $y$ ، كلّ منهما من الدرجة الأولى (لا مربّع ولا جداء بينهما).', source: addition('prerequisite_diagnostic') },
  { n: 2, skill: 'hall', text: 'الثنائية $(4 ; 1)$ حل للجملة $\\begin{cases} x + y = 5 \\\\ x - y = 2 \\end{cases}$', answer: false,
    why: '$4 + 1 = 5$ صحيحة، لكن $4 - 1 = 3$ وليس 2: الثنائية تحقق المعادلة الأولى فقط، وحل الجملة يحقق المعادلتين في آن واحد.', source: addition('prerequisite_diagnostic') },
  { n: 3, skill: 'tawid', text: 'من المعادلة $2x + y = 9$ ينتج $y = 9 + 2x$.', answer: false,
    why: 'ننقل $2x$ إلى الطرف الآخر بتغيير إشارته: $y = 9 - 2x$.', source: addition('prerequisite_diagnostic') },
  { n: 4, skill: 'jam', text: 'بجمع المعادلتين $3x + 2y = 12$ و $5x - 2y = 4$ طرفا بطرف نحصل على $8x = 16$.', answer: true,
    why: 'المعاملان $2$ و $-2$ متعاكسان فيختفي $y$ : $3x + 5x = 8x$ و $12 + 4 = 16$.', source: addition('prerequisite_diagnostic') },
  { n: 5, skill: 'tarjama', text: 'ثمن 3 أقلام و 2 كراريس هو 190 DA. إذا كان $x$ ثمن القلم و $y$ ثمن الكراس فإنّ $2x + 3y = 190$.', answer: false,
    why: 'كل عدد يُضرب في ثمن الشيء الذي يعدّه: 3 أقلام ثمنها $3x$ و 2 كراريس ثمنها $2y$ ، أي $3x + 2y = 190$.', source: addition('prerequisite_diagnostic') },
  { n: 6, skill: 'tahaqquq', text: 'نبحث عن عدد البنات وعدد الأولاد في قسم: يمكن أن يكون الجواب الثنائية $(12{,}5 ; 17{,}5)$.', answer: false,
    why: 'عدد التلاميذ عدد طبيعي: إذا وجدنا $12{,}5$ فهناك خطأ في الترييض أو في الحساب، فنعود إلى النص ونتحقق.', source: addition('prerequisite_diagnostic') },
  { n: 7, skill: 'nisba', text: 'تخفيض بـ 10% على ثمن قدره 500 DA يجعله 450 DA.', answer: true,
    why: 'بعد تخفيض 10% ندفع 90% من الثمن: $500 \\times 0{,}9 = 450$.', source: addition('prerequisite_diagnostic') },
];

/**
 * « أدمج تعلّماتي » (p. 62) — la وضعية du حفل البلدية, au mot près, et son
 * « تحليل الوضعية » en trois étapes NOMMÉES par le manuel (gardées telles
 * quelles, chacune avec ses questions du livre). La photographie n'existe pas
 * dans le manuel : la vignette (components/JumalFigures.jsx › PartyScene) est
 * un dessin décoratif de la plateforme.
 */
export const SITUATION = {
  source: src('situation', 62, 'أدمج تعلّماتي'),
  title: 'وضعية',
  text: 'بمناسبة الاحتفال بالمولد النبوي الشريف، نظمت بلدية حفل استقبال لفائدة التلاميذ النجباء للمؤسسات التعليمية التابعة لها، حضره ممثلون عن قطاع التربية وبعض الأولياء. بهذه المناسبة، اقتنت البلدية 150 علبة عصير برتقال و 150 قطعة حلوى متماثلة ودفعت 11 250 DA لكل المصاريف. في نهاية الحفل، بقيت 24 علبة عصير و30 قطعة حلوى ثمنها معا 2 100 DA. ما هو سعر علبة عصير وسعر قطعة حلوى؟',
  intro: 'بمناسبة الاحتفال بالمولد النبوي الشريف، نظمت بلدية حفل استقبال لفائدة التلاميذ النجباء للمؤسسات التعليمية التابعة لها، حضره ممثلون عن قطاع التربية وبعض الأولياء.',
  fact1: 'بهذه المناسبة، اقتنت البلدية 150 علبة عصير برتقال و 150 قطعة حلوى متماثلة ودفعت 11 250 DA لكل المصاريف.',
  fact2: 'في نهاية الحفل، بقيت 24 علبة عصير و30 قطعة حلوى ثمنها معا 2 100 DA.',
  question: 'ما هو سعر علبة عصير وسعر قطعة حلوى؟',
  caption: 'حفل البلدية',
  analysis: [
    { label: 'قراءة الوضعية وفهمها', text: 'قراءة نص المشكل وتحديد المعطيات والمطلوب. كيف تجد روابط بين المعطيات والمفاهيم الرياضية المناسبة والمكتسبة.' },
    { label: 'تحليل الوضعية واختيار استراتيجية حل مناسبة', text: 'ماهي المهمة المطلوب إنجازها؟ كيف يتم ذلك؟ ماذا يلزمك لترييض الوضعية؟ ماهي الموارد الرياضية (معارف وإجراءات) التي تسمح بحل هذه الوضعية؟' },
    { label: 'تنفيذ استراتيجية الحل المختارة', text: 'ترييض الوضعية باختيار المجاهيل المناسبة وكتابة جملة المعادلتين التي تعبر عن هذه المعطيات. اختيار طريقة حل وتطبيقها. التحقق من صحة الحل وتحرير الإجابة المناسبة.' },
  ],
  // Les nombres de la situation : la plateforme ne les retape nulle part ailleurs.
  numbers: { bought: 150, paid: 11250, juiceLeft: 24, cakesLeft: 30, leftCost: 2100 },
};

/**
 * Le niveau مبتدئ du laboratoire (module 1) : une commande de la PLATEFORME
 * (déclarée, `platform_context`), MÊME structure que le حفل — deux informations
 * d'ARGENT avec des quantités différentes (autant de jus que de gâteaux, puis ce
 * qui reste) — avec de petits nombres et des prix entiers (30 et 50 DA). Elle
 * sert aussi les étapes « حل الجملة » et « التحقق » du module 1, pour que la
 * réponse du manuel (25 DA et 50 DA) reste celle de « أحلّ الوضعية ».
 */
export const WARMUP = {
  source: addition('interaction_generation'),
  text: 'قبل رحلة القسم إلى حديقة التجارب بالحامة، طلب مندوب القسم 10 علب عصير و 10 قطع حلوى متماثلة ودفع 800 DA. في طريق العودة بقيت 2 علب عصير و 3 قطع حلوى ثمنها معا 210 DA. ما هو سعر علبة عصير وسعر قطعة حلوى؟',
  numbers: { bought: 10, paid: 800, juiceLeft: 2, cakesLeft: 3, leftCost: 210 },
  system: '$\\begin{cases} 10x + 10y = 800 \\\\ 2x + 3y = 210 \\end{cases}$',
};

const UNKNOWNS = [{ id: 'x', noun: 'سعر علبة العصير' }, { id: 'y', noun: 'سعر قطعة الحلوى' }];

/**
 * Les props du laboratoire story-modeller du module 1, à ses DEUX niveaux
 * (contrat des props : brief de l'unité 5 §5, manipulations/systems/StoryModeller.jsx).
 * Écrites ici une fois : le module les étale, le test de rendu (lab.render.test.jsx)
 * rend le laboratoire avec exactement ces props. Deux informations d'ARGENT
 * (`kind: 'money'`), chacune avec ses quantités : la première n'est pas un
 * « nombre de personnes ». La réponse de l'étape 5 : l'option 0.
 */
export const LAB = {
  beginner: {
    system: '10x+10y=800|2x+3y=210',
    theme: 'party',
    unknowns: UNKNOWNS,
    named: true,
    facts: [
      { quote: 'طلب مندوب القسم 10 علب عصير و 10 قطع حلوى متماثلة ودفع 800 DA', kind: 'money' },
      { quote: 'بقيت 2 علب عصير و 3 قطع حلوى ثمنها معا 210 DA', kind: 'money' },
    ],
    chips: [
      { value: '10', label: 'علب عصير' }, { value: '10', label: 'قطع حلوى' }, { value: '800', label: 'DA المبلغ المدفوع' },
      { value: '2', label: 'علب عصير بقيت' }, { value: '3', label: 'قطع حلوى بقيت' }, { value: '210', label: 'DA ثمن ما بقي' },
    ],
    story: WARMUP.text,
    answer: {
      options: ['سعر علبة العصير 30 DA وسعر قطعة الحلوى 50 DA.', 'سعر علبة العصير 50 DA وسعر قطعة الحلوى 30 DA.', 'سعر علبة العصير 40 DA وسعر قطعة الحلوى 40 DA.'],
      correct: 0,
    },
  },
  advanced: {
    system: '150x+150y=11250|24x+30y=2100',
    theme: 'party',
    unknowns: UNKNOWNS,
    named: false,
    facts: [
      { quote: 'اقتنت البلدية 150 علبة عصير برتقال و 150 قطعة حلوى متماثلة ودفعت 11 250 DA لكل المصاريف', kind: 'money' },
      { quote: 'بقيت 24 علبة عصير و30 قطعة حلوى ثمنها معا 2 100 DA', kind: 'money' },
    ],
    chips: [
      { value: '150', label: 'علبة عصير' }, { value: '150', label: 'قطعة حلوى' }, { value: '11250', label: 'DA لكل المصاريف' },
      { value: '24', label: 'علبة عصير بقيت' }, { value: '30', label: 'قطعة حلوى بقيت' }, { value: '2100', label: 'DA ثمن ما بقي' },
    ],
    story: SITUATION.text,
    answer: {
      options: ['سعر علبة العصير 25 DA وسعر قطعة الحلوى 50 DA.', 'سعر علبة العصير 50 DA وسعر قطعة الحلوى 25 DA.', 'سعر علبة العصير 37,5 DA وسعر قطعة الحلوى 37,5 DA.'],
      correct: 0,
    },
  },
};

/**
 * Les corrections et les méthodes du module 1 — importées aussi par la carte
 * (knowledgeGraph.js) : une aide de la carte cite la leçon mot pour mot. Toute
 * égalité dans `$…$`. Les exemples chiffrés sont ceux de la رحلة القسم (niveau
 * مبتدئ) : la solution du حفل n'apparaît qu'en évaluation.
 */
export const REMARKS = {
  majahil: 'نسمّي $x$ و $y$ الكميتين المطلوبتين في السؤال: $x$ سعر علبة العصير و $y$ سعر قطعة الحلوى (بالدينار)، لا الأعداد المعلومة في النص.',
  tarjamaWrong: 'نترجم «بقيت 2 علب عصير و 3 قطع حلوى ثمنها معا 210 DA» بـ $3x + 2y = 210$.',
  tarjamaWhy: 'كل عدد يُضرب في سعر الشيء الذي يعدّه: علبتا العصير ثمنهما $2x$ ، والقطع الثلاث ثمنها $3y$.',
  tarjamaRight: 'المعلومة تُترجم بـ $2x + 3y = 210$ : عدد العلب في سعر العلبة، زائد عدد القطع في سعر القطعة، يساوي المبلغ المدفوع.',
  tabsit: 'قبل الحل نبسّط ما أمكن: $10x + 10y = 800$ تكافئ $x + y = 80$ (نقسم الطرفين على 10).',
  tariqa: 'إذا كان معامل أحد المجهولين 1 نعبّر عنه بدلالة الآخر ونعوّض في المعادلة الأخرى (التعويض)؛ وإذا كان المعاملان متعاكسين، أو يصيران كذلك بالضرب في معامل مناسب، نجمع طرفا بطرف (الجمع).',
  nisfWrong: 'وجدنا $x = 30$ : سعر علبة العصير 30 DA، وانتهى الحل.',
  nisfWhy: 'السؤال يطلب السعرين معا: حل الجملة ثنائية $(x ; y)$ ، لا عدد واحد.',
  nisfRight: 'نعوّض $x = 30$ في $x + y = 80$ فنجد $y = 50$ : الحل $(30 ; 50)$.',
  tahaqquq: 'نتحقق في نص الوضعية نفسه: $10 \\times 30 + 10 \\times 50 = 800$ و $2 \\times 30 + 3 \\times 50 = 210$ ، ثم نحرّر الجواب بوحدته: سعر علبة العصير 30 DA وسعر قطعة الحلوى 50 DA.',
  notSolvedHere: 'حل وضعية الحفل كاملا في «أحلّ الوضعية»: هنا قرأنا الوضعية، ترجمنا المعلومتين واخترنا طريقة الحل، ثم حللنا وتحققنا على رحلة القسم.',
  wihda: 'نكتب المعادلة بوحدة واحدة: $7\\,\\mathrm{kg} = 7000\\,\\mathrm{g}$ ، فتُترجم الكتلة بـ $500x + 250y = 7000$.',
  takhfid: 'تخفيض بـ 20%: ندفع $100\\% - 20\\% = 80\\%$ من الثمن، أي نضرب الثمن في $0{,}8$.',
};

/**
 * « أؤكّد تعلّماتي » (p. 62) : les sept QCM, au mot près ; chaque item renvoie
 * au درس qui l'enseigne (colonne « عند الحاجة أعود إلى الصفحة ») — items 1–4 →
 * درس 1, 5–6 → درس 2, 7 → درس 3 (extraction › qcm › duplicatedIn). Les items 2 et
 * 6 ont PLUSIEURS bonnes réponses dans le manuel (deux, puis trois) : posés en
 * lignes « صحيح / خاطئ », chaque ligne ayant une seule réponse juste.
 */
export const QCM = [
  { n: 1, text: 'المعادلة $8x - 1 = y$ هي معادلة من الدرجة الأولى ...', options: ['ذات المجهول $x$ .', 'ذات المجهولين $x$ و $y$ .', 'ذات المجهول $y$ .'], correct: 1, pages: [58], lesson: 'mafhum-jumla',
    explain: 'في $8x - 1 = y$ مجهولان $x$ و $y$ ، كلّ منهما من الدرجة الأولى.' },
  { n: 2, text: 'الثنائية $(0 ; 0)$ هي حل للمعادلة ...', options: ['$3x + y = 0$', '$x - 3y = 0$', '$\\dfrac{1}{3}x - y = 3$'], correctSet: [0, 1], pages: [58], lesson: 'mafhum-jumla',
    rowCorrections: [
      '$3 \\times 0 + 0 = 0$ : المساواة محققة.',
      '$0 - 3 \\times 0 = 0$ : المساواة محققة.',
      '$\\dfrac{1}{3} \\times 0 - 0 = 0$ وليس 3: المساواة غير محققة.',
    ] },
  { n: 3, text: 'الثنائية $\\left(\\dfrac{1}{2} ; -\\dfrac{1}{2}\\right)$ هي حل للمعادلة...', options: ['$x + y = 0$', '$2x - \\dfrac{1}{2}y = 0$', '$\\dfrac{1}{2}x + y - \\dfrac{1}{4} = 0$'], correct: 0, pages: [58], lesson: 'mafhum-jumla',
    explain: '$\\dfrac{1}{2} + \\left(-\\dfrac{1}{2}\\right) = 0$ ؛ أمّا $2 \\times \\dfrac{1}{2} - \\dfrac{1}{2} \\times \\left(-\\dfrac{1}{2}\\right) = \\dfrac{5}{4}$ و $\\dfrac{1}{4} - \\dfrac{1}{2} - \\dfrac{1}{4} = -\\dfrac{1}{2}$.' },
  { n: 4, text: 'الجملة $\\begin{cases} 2a - b = 3 \\\\ a - 2b = -5 \\end{cases}$ ...', options: ['هي جملة معادلتين ذات مجهول واحد.', 'ليست جملة معادلتين من الدرجة الأولى.', 'هي جملة معادلتين من الدرجة الأولى ذات المجهولين $a$ و $b$ .'], correct: 2, pages: [58], lesson: 'mafhum-jumla',
    explain: 'معادلتان من الدرجة الأولى، في كل منهما المجهولان $a$ و $b$ : اسم الحرفين لا يغيّر شيئا.' },
  { n: 5, text: 'إليك الجملة الآتية: $\\begin{cases} 3x - y = -1 \\\\ 3x + y = 5 \\end{cases}$ حل هذه الجملة هو...', options: ['$(1 ; 4)$', '$(4 ; 1)$', '$\\left(\\dfrac{2}{3} ; 3\\right)$'], correct: 2, pages: [59], lesson: 'hall-jabri',
    explain: 'بجمع المعادلتين طرفا بطرف: $6x = 4$ أي $x = \\dfrac{2}{3}$ ، ثم $y = 3x + 1 = 3$. أمّا $(1 ; 4)$ فتحقق المعادلة الأولى فقط ($3 + 4 = 7$).' },
  { n: 6, text: 'من المعادلة $3x - y = 1$ ينتج أن...', options: ['$y = 3x - 1$', '$x = \\dfrac{y + 1}{3}$', '$3x = y + 1$'], correctSet: [0, 1, 2], pages: [58], lesson: 'hall-jabri',
    rowCorrections: [
      'ننقل $-y$ و $1$ بتغيير إشارتيهما: $3x - 1 = y$.',
      'من $3x = y + 1$ نقسم الطرفين على 3: $x = \\dfrac{y + 1}{3}$.',
      'ننقل $-y$ إلى الطرف الآخر بتغيير إشارته: $3x = y + 1$.',
    ] },
  { n: 7, text: '$x$ و $y$ قيسا زاويتين متكاملتين بالدرجات. يزيد $x$ عن $y$ بـ $15°$ . لإيجاد $x$ و $y$ ، نحل الجملة الآتية:', options: ['$\\begin{cases} x + y = 180 \\\\ x = y + 15 \\end{cases}$', '$\\begin{cases} y + x = 90 \\\\ y + 15 = x \\end{cases}$', '$\\begin{cases} y = 180 - x \\\\ y + x = 15 \\end{cases}$'], correct: 0, pages: [58, 59], lesson: 'mushkilat-jumla',
    explain: 'زاويتان متكاملتان مجموعهما $180°$ : $x + y = 180$ ؛ و«يزيد $x$ عن $y$ بـ $15°$» : $x = y + 15$. (المجموع $90°$ هو مجموع زاويتين متتامتين.)' },
].map((it) => ({ ...it, source: src('qcm', 62, 'أؤكّد تعلّماتي', it.n), lessonPath: `${BASE}/${it.lesson}` }));

export const LESSON_TITLES = {
  'mafhum-jumla': 'الدرس 1 — مفهوم جملة معادلتين من الدرجة الأولى بمجهولين',
  'hall-jabri': 'الدرس 2 — حل جملة معادلتين جبرياً (طريقتا التعويض والجمع)',
  'mushkilat-jumla': 'الدرس 3 — حل مشكلات بتوظيف جمل معادلتين',
};
