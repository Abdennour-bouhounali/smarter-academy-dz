import { src, addition, BASE } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — le « أستعدّ » du manuel (p. 115, items 1–6) appartient aux leçons 1 et 2 (extraction ›
 * destinations › prep) : la synthèse n'en reçoit aucun. Ses affirmations sont donc des AFFIRMATIONS DE LA
 * PLATEFORME (« عبارة إضافية من المنصّة »), dans la forme du manuel, sur ce que la وضعية, « أؤكّد تعلّماتي » et
 * « أتعمّق » mobilisent : Thalès dans une ligne de visée (unité 9), la définition des rapports (درس 1), l'inconnue au
 * dénominateur (درس 4), la touche inverse (درس 2), Pythagore dans un solide, l'arrondi, cos² + sin² = 1 (درس 3).
 * Quatre vraies, trois fausses ; jamais les nombres du مقام, du pavé ou de la pyramide.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'nazar', text: 'عمودان شاقوليان [BA] و [DC] قاعدتاهما B و D على أرض مستوية، ورأساهما A و C على استقامة واحدة مع نقطة O من الأرض حيث D بين O و B. ينتج $\\dfrac{DC}{BA} = \\dfrac{OD}{OB}$ .', answer: true,
    why: 'العمودان عموديان على الأرض فهما متوازيان، والنقط O و D و B على استقامة والنقط O و C و A على استقامة: المثلثان ODC و OBA في وضعية طالس.', source: addition('prerequisite_diagnostic') },
  { n: 2, skill: 'tarif', text: 'في المثلث RST القائم في S لدينا $\\tan\\widehat{R} = \\dfrac{RS}{ST}$ .', answer: false,
    why: 'الضلع المقابل للزاوية R هو [ST] والمجاور لها هو [RS]: $\\tan\\widehat{R} = \\dfrac{ST}{RS}$ ، والعبارة كتبت مقلوبه.', source: addition('prerequisite_diagnostic') },
  { n: 3, skill: 'maqam', text: 'من المساواة $\\sin 40^{\\circ} = \\dfrac{3}{BC}$ ينتج $BC = \\dfrac{3}{\\sin 40^{\\circ}}$ .', answer: true,
    why: 'المجهول في المقام: $BC \\times \\sin 40^{\\circ} = 3$ ، ثم نقسم الطرفين على $\\sin 40^{\\circ}$ .', source: addition('prerequisite_diagnostic') },
  { n: 4, skill: 'hasiba', text: 'إذا كان $\\tan x = 0{,}7$ فإنّ قيس الزاوية x هو $0{,}7^{\\circ}$ .', answer: false,
    why: 'العدد $0{,}7$ هو ظل الزاوية لا قيسها: نعيّن القيس باللمسة العكسية للظل في حاسبة مبرمجة بالدرجة، فنجد $x \\approx 35^{\\circ}$ .', source: addition('prerequisite_diagnostic') },
  { n: 5, skill: 'fada', text: 'في متوازي مستطيلات أبعاده $3\\,\\mathrm{cm}$ و $4\\,\\mathrm{cm}$ و $12\\,\\mathrm{cm}$ ، طول القطر الذي يصل رأسين متقابلين هو $13\\,\\mathrm{cm}$ .', answer: true,
    why: 'قطر القاعدة: $\\sqrt{3^2 + 4^2} = 5$ ، ثم المثلث الذي يضمّ هذا القطر والحرف الشاقولي قائم: $\\sqrt{5^2 + 12^2} = \\sqrt{169} = 13$ .', source: addition('prerequisite_diagnostic') },
  { n: 6, skill: 'tadwir', text: 'المدوّر إلى الوحدة للعدد $38{,}62$ هو 38 .', answer: false,
    why: 'الرقم الموالي للوحدة هو 6 وهو أكبر من 5 أو يساويه، فالمدوّر إلى الوحدة هو 39 ؛ أمّا 38 فهو البتر (قيمة مقرّبة بالنقصان).', source: addition('prerequisite_diagnostic') },
  { n: 7, skill: 'alaqa', text: 'من أجل كل قيس زاوية حادة x لدينا $\\sin^2 x = 1 - \\cos^2 x$ .', answer: true,
    why: 'العلاقة $\\cos^2 x + \\sin^2 x = 1$ (الدرس 3)، ننقل $\\cos^2 x$ إلى الطرف الآخر.', source: addition('prerequisite_diagnostic') },
];

/**
 * « أدمج تعلّماتي » (p. 124) — la وضعية de مقام الشهيد, au mot près (les mesures écrites en îlots : « 2,30m » nu
 * s'inverse en RTL), et son « تحليل الوضعية » en trois étapes NOMMÉES par le manuel. La distance مقام–poteau est
 * une DÉCISION DE LECTURE (extraction › situation › reading : 95,65 m, qui donne la hauteur réelle du monument).
 * `questions` : ce que la مذكرة du professeur lit (buildLessonMemo › SITUATION).
 * Noms des points (la figure du manuel n'en a pas) : A أريس (l'œil, au sol — la figure néglige sa taille),
 * P et Q pied et sommet du poteau, M et S pied et sommet du مقام.
 */
export const SITUATION = {
  source: src('situation', 124, 'أدمج تعلّماتي'),
  title: 'وضعية',
  text: 'يريد أريس قياس ارتفاع المعلم التاريخي «مقام الشهيد» المتواجد بالجزائر العاصمة. لإنجاز هذه المهمة، استعان بعمود كهربائي طوله $2{,}30\\,\\mathrm{m}$ ووقف في مكان حيث يشاهد قمة العمود الكهربائي وقمة «مقام الشهيد». ساعد أريس على إيجاد ارتفاع هذا المقام. عيّن قيس الزاوية $x$ المحدّدة على الشكل. (يعطى المدوّر إلى الدرجة للزاوية $x$ )',
  questions: [
    'ما المطلوب في النص؟',
    'ما هي المعارف الرياضية التي قد تكون لها علاقة بالشكل؟ (خاصية طالس، النسب المثلثية في مثلث قائم، خاصية فيثاغورس…)',
    'كتابة المساواة اللازمة وحساب الارتفاع، ثم توظيف الارتفاع والمعارف المناسبة لحساب القيس x.',
  ],
  closing: 'العمود والمقام متوازيان وقمتاهما على خط النظر: خاصية طالس تعطي الارتفاع، والظل في المثلث القائم الصغير يعطي الزاوية x.',
  analysis: [
    { label: 'قراءة الوضعية وفهمها', items: ['المطلوب البحث عن ارتفاع مقام الشهيد وقيس الزاوية x، الأخذ بعين الاعتبار الشكل والأبعاد المُعطاة.'] },
    { label: 'تحليل الوضعية واختيار استراتيجية حل مناسبة', items: ['ماهي المعارف الرياضية التي قد تكون لها علاقة بالشكل؟ (خاصيّة طالس، النسب المثلثية في مثلث قائم، خاصيّة فيثاغورس،.....).', 'اختيار المعرفة المناسبة تبعا للمعطيات.'] },
    { label: 'تنفيذ استراتيجية الحل', items: ['كتابة المساواة اللازمة وحساب الارتفاع.', 'توظيف الارتفاع والمعارف المناسبة لحساب القيس x.'] },
  ],
  // les nombres de la figure (mètres) : poteau, distance مقام–poteau (lecture décidée), distance poteau–أريس
  numbers: { pole: 2.3, poleAt: 95.65, d: 2.45 },
  figure: { pole: '2,30', poleAt: '95,65', d: '2,45' },
};

/** Le texte d'une analyse (puces du manuel) en une ligne. */
export const analysisText = (a) => a.items.map((s) => `• ${s}`).join(' ');

/**
 * Les props du laboratoire du module 1 — `clinometer` (écrit par la leçon 4 « tarrid-muthallathiya », réutilisé ici
 * SANS modification, contrat fixé : MANIPULATION_CONTRACT / brief §4.D), mode `align`, monde `maqam`. Écrites ici une
 * fois : le module les étale, le test de rendu (lab.render.test.jsx) monte le workspace avec ces mêmes objets.
 *   مبتدئ  un réverbère de 3 m planté à 89 m du مقام : l'alignement se fait à 3 m du réverbère (h = 3 × 92 ÷ 3 = 92,
 *          tan x = 3 ÷ 3 = 1, x = 45° — le même monument par un autre poteau : la hauteur ne dépend pas du poteau) ;
 *   متقدم  la وضعية du manuel : poteau de 2,30 m à 95,65 m ; l'élève CHERCHE la place (2,45 m) où le sommet du
 *          poteau cache celui du مقام, puis lit les deux triangles (h ≈ 92,09 m, x ≈ 43°).
 * Le contrat du lab (logic/clinometer.js › init) : avec `total` (la distance de l'alignement au monument, ici
 * 95,65 + 2,45 = 98,1), H se DÉDUIT par Thalès — c'est la وضعية du manuel ; avec `height` (92 m, la hauteur réelle
 * du monument), c'est la place de l'alignement qui se déduit : 3 × 89 ÷ (92 − 3) = 3 m pour le réverbère.
 */
export const LAB = {
  beginner: { numbers: { mode: 'align', pole: 3, poleAt: 89, height: 92 }, theme: 'maqam' },
  advanced: { numbers: { mode: 'align', pole: 2.3, poleAt: 95.65, total: 98.1 }, theme: 'maqam' },
};
/** Ce que le lab fait trouver (vérifié par lab.render.test.jsx) : la place de l'alignement, depuis le poteau. */
export const LAB_EXPECT = { beginner: { d: 3, x: 45 }, advanced: { d: 2.45, x: 43 } };

/**
 * Les phrases de la correction du module 1, importées aussi par knowledge.jsx et la carte (knowledgeGraph.js) :
 * une aide de la carte cite la leçon mot pour mot. Toute égalité dans `$…$`.
 */
export const REMARKS = {
  reading: 'قراءة من المنصّة: المسافة بين المقام والعمود مطبوعة في الكتاب بخط صغير؛ قرأناها $95{,}65\\,\\mathrm{m}$ ، وهي التي تعطي الارتفاع الحقيقي للمعلم.',
  names: 'نسمّي A موضع أريس، و P قاعدة العمود و Q قمّته، و M قاعدة المقام و S قمّته.',
  // la وضعية — Thalès dans la ligne de visée
  nazar: 'العمود [PQ] والمقام [MS] عموديان على الأرض فهما متوازيان، وقمّتاهما Q و S على خط النظر نفسه الذي يبدأ من A: المثلثان APQ و AMS في وضعية طالس.',
  AM: '$AM = AP + PM = 2{,}45 + 95{,}65 = 98{,}1$',
  talisEq: '$\\dfrac{MS}{PQ} = \\dfrac{AM}{AP}$ أي $\\dfrac{h}{2{,}30} = \\dfrac{98{,}1}{2{,}45}$',
  hCalc: '$h = \\dfrac{2{,}30 \\times 98{,}1}{2{,}45} \\approx 92{,}09$ : ارتفاع «مقام الشهيد» حوالي $92{,}09\\,\\mathrm{m}$ ، أي $92\\,\\mathrm{m}$ بالتدوير إلى الوحدة.',
  real: 'وهو فعلا الارتفاع الحقيقي لمقام الشهيد ( $92\\,\\mathrm{m}$ ): النتيجة ملائمة للواقع.',
  nazarWrong: 'نكتب $\\dfrac{h}{2{,}30} = \\dfrac{95{,}65}{2{,}45}$ .',
  nazarWhy: 'الضلع الذي رأسه A في المثلث الكبير هو AM ، المسافة من أريس إلى قاعدة المقام، وليس المسافة PM بين العمود والمقام.',
  nazarRight: '$\\dfrac{h}{2{,}30} = \\dfrac{2{,}45 + 95{,}65}{2{,}45}$',
  // la وضعية — l'angle x
  tanX: 'في المثلث APQ القائم في P: الضلع المقابل للزاوية x هو العمود $PQ = 2{,}30$ والضلع المجاور لها هو $AP = 2{,}45$ ، إذن $\\tan x = \\dfrac{2{,}30}{2{,}45}$ .',
  xCalc: 'باللمسة العكسية للظل في حاسبة مبرمجة بالدرجة: $x \\approx 43{,}19^{\\circ}$ ، والمدوّر إلى الدرجة $x \\approx 43^{\\circ}$ .',
  qaysWrong: 'نكتب $x = \\dfrac{2{,}30}{2{,}45} \\approx 0{,}94$ .',
  qaysWhy: 'العدد $0{,}94$ هو ظل الزاوية لا قيسها: القيس يُعيَّن باللمسة العكسية للظل في الحاسبة المبرمجة بالدرجة.',
  qaysRight: '$\\tan x \\approx 0{,}94$ ومنه $x \\approx 43^{\\circ}$',
  // la وضعية — la vérification
  check: 'نتحقّق في المثلث الكبير AMS القائم في M: $\\tan x = \\dfrac{MS}{AM}$ ، و $\\dfrac{MS}{AM} = \\dfrac{PQ}{AP}$ حسب خاصية طالس: للمثلثين الزاوية x نفسها.',
  tadwirMubakkir: 'لو دوّرنا $\\tan x$ إلى $0{,}9$ قبل اللمسة العكسية لوجدنا $x \\approx 42^{\\circ}$ : ندوّر النتيجة في آخر الحساب فقط.',
  mutammima: 'الزاوية التي يصنعها خط النظر مع المقام في S تتمّم x : قيسها $90^{\\circ} - 43^{\\circ} = 47^{\\circ}$ تقريبا، وليست x.',
  jumla: 'ارتفاع «مقام الشهيد» $h \\approx 92{,}09\\,\\mathrm{m}$ (أي $92\\,\\mathrm{m}$ تقريبا)، وقيس الزاوية $x \\approx 43^{\\circ}$ .',
  // أتعمّق — ex. 31 (le pavé) et ex. 32 (la pyramide)
  fada: 'في المجسّم نبحث عن مثلث قائم يضمّ الطول المطلوب: الحرف [CD] عمودي على الوجه ABCH فهو عمودي على [AC]، والمثلث ACD قائم في C.',
  fadaPyth: '$AC^2 = AB^2 + BC^2 = 3{,}15^2 + 2{,}35^2 = 15{,}445$ ثم $AD^2 = AC^2 + CD^2 = 15{,}445 + 1{,}55^2 = 17{,}8475$ .',
  fadaSin: '$\\sin\\widehat{DAC} = \\dfrac{CD}{AD} = \\dfrac{1{,}55}{\\sqrt{17{,}8475}}$ ومنه $\\widehat{DAC} \\approx 21{,}5^{\\circ}$ ، والمدوّر إلى الدرجة $22^{\\circ}$ .',
  fadaWrong: 'ندوّر AD إلى 4 أولا ثم نحسب $\\sin\\widehat{DAC} = \\dfrac{1{,}55}{4}$ .',
  fadaWhy: 'التدوير قبل نهاية الحساب يغيّر النتيجة: $\\dfrac{1{,}55}{4}$ يعطي حوالي $23^{\\circ}$ ، أمّا القيمة المضبوطة $\\dfrac{1{,}55}{\\sqrt{17{,}8475}}$ فتعطي حوالي $22^{\\circ}$ .',
  fadaRight: '$\\sin\\widehat{DAC} = \\dfrac{1{,}55}{\\sqrt{17{,}8475}}$ ثم ندوّر قيس الزاوية فقط',
  haram: 'في الهرم المنتظم: الرأس S وقدم الارتفاع O (مركز المربع) ورأس A من القاعدة يشكّلون مثلثا قائما في O، و OA نصف قطر المربع: $OA = \\dfrac{231\\sqrt{2}}{2}$ .',
  haramH: '$SO^2 = SA^2 - OA^2 = 220^2 - \\left(\\dfrac{231\\sqrt{2}}{2}\\right)^2 = 21719{,}5$ ومنه $SO \\approx 147\\,\\mathrm{m}$ .',
  haramWrong: 'نأخذ نصف ضلع القاعدة $115{,}5\\,\\mathrm{m}$ بدل OA.',
  haramWhy: 'الحرف الجانبي [SA] يصل الرأس برأس من القاعدة، والمسافة من مركز المربع إلى رأسه نصف القطر، لا نصف الضلع.',
  tajnid: 'في كل وضعية نبحث عن المثلث القائم (أو المثلثين في وضعية طالس) الذي يضمّ المعلوم والمطلوب، ثم نختار الخاصية: طالس، فيثاغورس، أو النسبة المثلثية التي تربطهما.',
};

/**
 * « أؤكّد تعلّماتي » (p. 124) : les six QCM, au mot près, chacun renvoyé au درس qui l'enseigne et à la colonne
 * « عند الحاجة أعود إلى الصفحة » du manuel (items 1–5 → pp. 118–119, درس 1 ; item 6 → pp. 120–121, درس 3).
 * Item 3 : DEUX bonnes réponses (une ligne صحيح / خاطئ par réponse) ; item 5 : deux lignes IE et EL jugées
 * séparément (les colonnes (1) et (3) de la ligne EL impriment la même expression : on la montre une fois).
 * Les options sont dans l'ordre (1), (2), (3) du manuel. Figures : content/figures.js.
 */
const QCM_RAW = [
  { n: 1, text: 'في المثلث MOB القائم في O، لدينا:', options: ['$\\cos\\widehat{M} = \\dfrac{OM}{OB}$', '$\\cos\\widehat{M} = \\dfrac{OM}{MB}$', '$\\cos\\widehat{M} = \\dfrac{OB}{MB}$'], correct: 1,
    pages: [118, 119], lessons: ['nisab-muthallathiya'],
    explain: 'الوتر هو [MB] (يقابل الزاوية القائمة O) والضلع المجاور للزاوية M هو [OM]: $\\cos\\widehat{M} = \\dfrac{OM}{MB}$ . $\\dfrac{OM}{OB}$ هو مقلوب ظل M، و $\\dfrac{OB}{MB}$ هو جيب M.' },
  { n: 2, text: 'في المثلث LMN القائم في M، لدينا:', options: ['$\\sin\\widehat{L} = \\dfrac{MN}{LN}$', '$\\sin\\widehat{L} = \\dfrac{LM}{LN}$', '$\\sin\\widehat{L} = \\dfrac{MN}{LM}$'], correct: 0,
    pages: [118, 119], lessons: ['nisab-muthallathiya'],
    explain: 'الضلع المقابل للزاوية L هو [MN] والوتر [LN]: $\\sin\\widehat{L} = \\dfrac{MN}{LN}$ . $\\dfrac{LM}{LN}$ هو جيب تمام L، و $\\dfrac{MN}{LM}$ هو ظلها.' },
  { n: 3, text: 'في المثلث ABC القائم في B، لدينا:', options: ['$\\sin 35^{\\circ} = \\dfrac{7}{AC}$', '$\\sin 35^{\\circ} = \\dfrac{AC}{7}$', '$\\sin 35^{\\circ} \\times AC = 7$'], correct: [0, 2],
    pages: [118, 119], lessons: ['nisab-muthallathiya', 'tarrid-muthallathiya'],
    explain: 'الزاوية $35^{\\circ}$ في C: الضلع المقابل لها $AB = 7$ والوتر AC، إذن $\\sin 35^{\\circ} = \\dfrac{7}{AC}$ ، أي $\\sin 35^{\\circ} \\times AC = 7$ (الجداء التصالبي): الإجابتان (1) و (3) صحيحتان. $\\dfrac{AC}{7}$ أكبر من 1 فلا يمكن أن يكون جيبا.' },
  { n: 4, text: 'إذا كان $\\cos 70^{\\circ} = \\dfrac{2}{MN}$ فإن…', options: ['$MN = 2 \\times \\cos 70^{\\circ}$', '$MN = \\dfrac{\\cos 70^{\\circ}}{2}$', '$MN = \\dfrac{2}{\\cos 70^{\\circ}}$'], correct: 2,
    pages: [118, 119], lessons: ['nisab-muthallathiya', 'tarrid-muthallathiya'],
    explain: 'المجهول في المقام: $MN \\times \\cos 70^{\\circ} = 2$ ومنه $MN = \\dfrac{2}{\\cos 70^{\\circ}}$ . الضرب في $\\cos 70^{\\circ}$ يعطي طولا أصغر من 2، والوتر أطول من الضلع المجاور.' },
  { n: 5, text: 'في الشكل المقابل، لدينا:', pages: [118, 119], lessons: ['nisab-muthallathiya', 'tarrid-muthallathiya'],
    rows: {
      IE: { label: 'IE', options: ['$IE = \\dfrac{6}{\\tan 50^{\\circ}}$', '$IE = 6 \\times \\tan 50^{\\circ}$', '$IE = 6 \\times \\sin 50^{\\circ}$'], correct: 1 },
      EL: { label: 'EL', options: ['$EL = 6 \\times \\sin 50^{\\circ}$', '$EL = \\dfrac{6}{\\cos 50^{\\circ}}$'], correct: 1 },
    },
    note: 'في سطر EL تطبع الخانتان (1) و (3) العبارة نفسها: نعرضها مرة واحدة.',
    explain: 'الزاوية $50^{\\circ}$ في L: المجاور $IL = 6$ ، والمقابل IE ، والوتر EL. $\\tan 50^{\\circ} = \\dfrac{IE}{6}$ ومنه $IE = 6 \\times \\tan 50^{\\circ}$ ؛ و $\\cos 50^{\\circ} = \\dfrac{6}{EL}$ ومنه $EL = \\dfrac{6}{\\cos 50^{\\circ}}$ .' },
  { n: 6, text: 'من أجل كل قيس زاوية حادة في مثلث قائم، لدينا:', options: ['$\\cos^2 x = \\sin^2 x - 1$', '$\\cos^2 x = 1 - \\sin^2 x$', '$\\cos x = 1 - \\sin x$'], correct: 1,
    pages: [120, 121], lessons: ['alaqat-muthallathiya'],
    explain: '$\\cos^2 x + \\sin^2 x = 1$ ومنه $\\cos^2 x = 1 - \\sin^2 x$ . $\\sin^2 x - 1$ سالب، والعلاقة تخصّ المربعين لا النسبتين: مع $x = 30^{\\circ}$ ، $\\cos 30^{\\circ} \\approx 0{,}87$ و $1 - \\sin 30^{\\circ} = 0{,}5$ .' },
];
export const QCM = QCM_RAW.map((it) => ({ ...it, source: src('qcm', 124, 'أؤكّد تعلّماتي', it.n), lessonPaths: it.lessons.map((l) => `${BASE}/${l}`) }));

/** Les titres des leçons du propriétaire (catalogue) — et la leçon de Thalès de l'unité 9, même ميدان. */
export const LESSON_TITLES = {
  'nisab-muthallathiya': 'الدرس 1 — النسب المثلثية لزاوية حادة في مثلث قائم',
  'hasiba-muthallathiya': 'الدرس 2 — استعمال الحاسبة لحساب النسب المثلثية وتعيين قياس زاوية',
  'alaqat-muthallathiya': 'الدرس 3 — العلاقات بين النسب المثلثية والإنشاءات الهندسية',
  'tarrid-muthallathiya': 'الدرس 4 — حل مشكلات وترييض وضعيات بتوظيف النسب المثلثية',
  'talis-hisab-atwal': 'الوحدة 9 — خاصية طالس وحساب الأطوال',
};

/**
 * « إختبار أولي » (module 4) — la وضعية TRANSPOSÉE (`synthesis_generation`) : mêmes ressources, autres nombres, pour que
 * leurs réponses n'apparaissent nulle part ailleurs dans la leçon.
 *   la minaret de جامع الجزائر (265 m, la plus haute du monde) visée par-dessus un réverbère de 4 m planté à 195,75 m,
 *   ليندة à 3 m du réverbère : AM = 198,75 ; h = 4 × 198,75 ÷ 3 = 265 m ; tan x = 4 ÷ 3 ⇒ x ≈ 53,13° ≈ 53° ;
 *   un conteneur 12 m × 2,4 m × 2,4 m : diagonale du sol √149,76 ≈ 12,24, diagonale √155,52 ≈ 12,47 m.
 */
export const TEST = {
  source: addition('synthesis_generation'),
  title: 'وضعية أخرى: مئذنة جامع الجزائر، وحاوية في ميناء الجزائر',
  minaret: { pole: '4', poleAt: '195,75', d: '3',
    text: 'أرادت ليندة تقدير ارتفاع مئذنة «جامع الجزائر». غُرس عمود إنارة شاقولي طوله $4\\,\\mathrm{m}$ على بعد $195{,}75\\,\\mathrm{m}$ من قاعدة المئذنة، ووقفت ليندة على بعد $3\\,\\mathrm{m}$ من العمود، في المكان الذي ترى فيه قمة العمود وقمة المئذنة على استقامة واحدة (نهمل طول ليندة). نسمّي x الزاوية بين الأرض وخط النظر.' },
  container: { AB: '12', BC: '2,4', CD: '2,4',
    text: 'حاوية على شكل متوازي مستطيلات ABCDEFGH ، طولها $AB = 12\\,\\mathrm{m}$ وعرضها $BC = 2{,}4\\,\\mathrm{m}$ وارتفاعها $CD = 2{,}4\\,\\mathrm{m}$ (الحرف [CD] شاقولي).' },
};
