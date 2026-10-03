import { src, addition, BASE } from '../../_unit/unitMeta.js';

/**
 * « أستعدّ » (module 0) — le « أستعدّ » du manuel (p. 103, items 1–5) appartient à la leçon 1 (extraction ›
 * destinations › prep) : la synthèse n'en reçoit aucun. Ses affirmations sont donc des AFFIRMATIONS DE LA
 * PLATEFORME (« عبارة إضافية من المنصّة »), dans la forme du manuel, sur ce que le تحدّ, la وضعية, « أؤكّد
 * تعلّماتي » et « أتعمّق » mobilisent : Thalès et sa réciproque (دروس 1 و 2), le quatrième proportionnel, la coupe
 * axiale d'un cône et le volume d'un cylindre (années précédentes), une équation du premier degré, les
 * médianes d'un triangle (ex. 20). Quatre vraies, trois fausses ; jamais les nombres de la minaret ni du cône.
 */
export const PREP_ITEMS = [
  { n: 1, skill: 'talis', text: 'ABC مثلث، M نقطة من [AB] و N نقطة من [AC] حيث (MN)//(BC). ينتج $\\dfrac{AM}{AB} = \\dfrac{AN}{AC} = \\dfrac{MN}{BC}$ .', answer: true,
    why: 'المستقيمان (BM) و (CN) متقاطعان في A و (MN)//(BC): المثلثان AMN و ABC في وضعية طالس، فأطوالهما متناسبة (خاصية طالس).', source: addition('prerequisite_diagnostic') },
  { n: 2, skill: 'aksiya', text: 'إذا كان $\\dfrac{AM}{AB} = \\dfrac{AN}{AC}$ فإنّ (MN)//(BC) مهما كان موقع النقطتين M و N على المستقيمين (AB) و (AC).', answer: false,
    why: 'تساوي النسبتين لا يكفي: يجب أيضا أن تكون النقط A ، B ، M مرتبة بنفس ترتيب النقط A ، C ، N (الخاصية العكسية لخاصية طالس).', source: addition('prerequisite_diagnostic') },
  { n: 3, skill: 'tanasub', text: 'من المساواة $\\dfrac{x}{4} = \\dfrac{15}{6}$ ينتج $x = 10$ .', answer: true,
    why: 'الجداء التصالبي: $6 \\times x = 4 \\times 15 = 60$ إذن $x = 10$ .', source: addition('prerequisite_diagnostic') },
  { n: 4, skill: 'maqta', text: 'مقطع مخروط دوران بمستوٍ يشمل محوره هو دائرة.', answer: false,
    why: 'المستوي الذي يشمل المحور يقطع المخروط وفق مثلث متساوي الساقين رأسه رأس المخروط؛ المستوي الموازي للقاعدة هو الذي يعطي دائرة.', source: addition('prerequisite_diagnostic') },
  { n: 5, skill: 'hajm', text: 'حجم أسطوانة دوران نصف قطر قاعدتها $2\\,\\mathrm{cm}$ وارتفاعها $7\\,\\mathrm{cm}$ هو $28\\pi\\,\\mathrm{cm}^3$ .', answer: true,
    why: '$V = \\pi \\times r^2 \\times h = \\pi \\times 2^2 \\times 7 = 28\\pi$ .', source: addition('prerequisite_diagnostic') },
  { n: 6, skill: 'muadala', text: 'حلّ المعادلة $3x = 2(20 - x)$ هو $x = 10$ .', answer: false,
    why: '$3x = 40 - 2x$ إذن $5x = 40$ ومنه $x = 8$ ؛ أمّا 10 فلا يحقّقها: $30 \\neq 20$ .', source: addition('prerequisite_diagnostic') },
  { n: 7, skill: 'mutawassitat', text: 'متوسطات مثلث الثلاثة تتقاطع في نقطة واحدة تسمّى مركز ثقل المثلث.', answer: true,
    why: 'خاصية المتوسطات في مثلث (السنة الثالثة): تتقاطع في نقطة واحدة هي مركز الثقل.', source: addition('prerequisite_diagnostic') },
];

/**
 * Le تحدّ de la page d'unité (p. 103) — DOUBLON DÉCLARÉ (extraction › destinations › challenge › duplicatedIn :
 * cette leçon, module 1). Le texte du manuel, son « الشكل المقابل » redessiné (components/MinaretFigure.jsx, le même
 * dessin que la page d'unité), et ses nombres : bâton 1 m à 10 m du pied, ombres finissant ensemble à 11,6 m.
 */
export const CHALLENGE = {
  source: src('challenge', 103, 'تحدّ'),
  text: 'في فترة معينة من يوم مشمس، تساءل فريد عن ارتفاع مئذنة المسجد الموجود بالحي الذي يسكن فيه. اقترح عليه مقران طريقة مكّنتهما من رسم الشكل المقابل ببعض القياسات. اشرح الطريقة المقترحة ثم ساعدهما على إيجاد ارتفاع المئذنة.',
  numbers: { stick: '1', stickAt: '10', tip: '11,6' },
};

/** L'encadré d'ouverture (p. 103) « طالس » — DOUBLON DÉCLARÉ (duplicatedIn : module 1) : la méthode de l'ombre. */
export const INTRO_THALES = {
  source: src('intro-thales', 103, 'مدخل الباب'),
  title: 'طالس',
  text: 'يُعتبر طالس أحد حكماء الإغريق السبعة والذي كان مهتما بدراسة الهندسة وله العديد من الأعمال العلمية منها: - مبرهنة حول نسب بين أطوال قطع المستقيمين المتقاطعين في نقطة عندما يقطعهما مستقيمان متوازيان. - قياس ارتفاع أهرامات مصر بطريقة الظل.',
};

/**
 * « أدمج تعلّماتي » (p. 112) — la وضعية du cylindre dans le cône, au mot près (les mesures écrites en îlots
 * mathématiques : « 18cm » nu s'inverse en RTL), et son « تحليل الوضعية » en trois étapes NOMMÉES par le manuel.
 * `questions` : ce que la مذكرة du professeur lit (buildLessonMemo › SITUATION).
 */
export const SITUATION = {
  source: src('situation', 112, 'أدمج تعلّماتي'),
  title: 'وضعية',
  text: 'الشكل المقابل يمثّل أسطوانة دوران ارتفاعها $h$ ونصف قطر قاعدتها $r$ ، مرسومة داخل مخروط دوران ارتفاعه $18\\,\\mathrm{cm}$ ونصف قطر قاعدته $6\\,\\mathrm{cm}$ . احسب حجم هذه الأسطوانة في الحالة $h = r$ .',
  questions: [
    'ما المطلوب في النص؟',
    'أي شكل هندسي يمكن ربطه بالصورة المعطاة؟',
    'تفسير الشكل بمثلثين يشتركان في النقطة O، ثم تطبيق خاصية طالس وحل معادلة لإيجاد r.',
  ],
  closing: 'المقطع المحوري يحوّل المجسّمين إلى مثلثين في وضعية طالس: نحصل على معادلة في r ثم على الحجم.',
  analysis: [
    { label: 'قراءة الوضعية وفهمها', items: ['ما المطلوب في النص؟', 'أي شكل هندسي يمكن ربطه بالصورة المعطاة؟', 'ما هي الموارد المعرفية التي لها علاقة بهذه الوضعية؟'] },
    { label: 'تحليل الوضعية واختيار استراتيجية حل مناسبة', items: ['اختر أجزاء الصورة التي اعتمد عليها لانجاز الشكل المطلوب.', 'اختر الخواص الهندسية المناسبة لحساب r.'] },
    { label: 'تنفيذ استراتيجية الحل المختارة', items: ['تفسير الشكل بمثلثين يشتركان في النقطة O.', 'تطبيق خاصية طالس وحل معادلة لإيجاد r.'] },
  ],
  numbers: { H: 18, R: 6 },
};

/** Le texte d'une analyse (puces du manuel) en une ligne. */
export const analysisText = (a) => a.items.map((s) => `• ${s}`).join(' ');

/**
 * Les props des DEUX laboratoires du module 1, dans UN workspace (MANIPULATION_CONTRACT §2undecies) — écrites ici une
 * fois : le module les étale, le test de rendu (lab.render.test.jsx) monte le workspace avec ces mêmes objets.
 *   مبتدئ  shadow-stick, le تحدّ : bâton de 1 m, ombres qui finissent ensemble à 11,6 m quand il est à 10 m ;
 *   متقدم  cone-cylinder, la وضعية : cône H = 18, R = 6 (le cylindre h = r est sur la règle).
 */
export const LAB = {
  beginner: { stick: '1', stickAt: '10', tip: '11,6', theme: 'minaret' },
  advanced: { H: 18, R: 6, theme: 'cornet' },
};

/**
 * Les phrases de la correction du module 1, importées aussi par knowledge.jsx et la carte (knowledgeGraph.js) :
 * une aide de la carte cite la leçon mot pour mot. Toute égalité dans `$…$`.
 */
export const REMARKS = {
  // le تحدّ
  zillMethod: 'نغرس عصا شاقولية بحيث ينتهي ظلّها حيث ينتهي ظلّ المئذنة، في نقطة نسمّيها O.',
  zillWhy: 'العصا والمئذنة عموديتان على الأرض فهما متوازيتان، وظلّاهما ينتهيان في O: المثلثان OBE و OAM في وضعية طالس.',
  zillWrong: 'نغرس العصا في أيّ مكان ونقارن ظلّها بظلّ المئذنة.',
  zillWrongWhy: 'إذا لم ينتهِ الظلّان في النقطة نفسها فلا رأس مشترك للمثلثين: الشعاعان منفصلان والمثلثان ليسا في وضعية طالس.',
  zillRight: 'نحرّك العصا حتى ينتهي ظلّها حيث ينتهي ظلّ المئذنة تمامًا.',
  zillOB: 'ظلّ العصا: $OB = 11{,}6 - 10 = 1{,}6$ ، وظلّ المئذنة $OA = 11{,}6$ .',
  zillEq: '$\\dfrac{AM}{BE} = \\dfrac{OA}{OB}$ أي $\\dfrac{AM}{1} = \\dfrac{11{,}6}{1{,}6}$ ومنه $AM = 7{,}25$ : ارتفاع المئذنة $7{,}25\\,\\mathrm{m}$ .',
  // la وضعية — la coupe
  maqta: 'نقطع المجسّمين بالمستوي الذي يشمل محورهما: يظهر المثلث القائم OSK للمخروط ( $SK = 6$ و $SO = 18$ ) والمستطيل SDCT للأسطوانة ( $ST = h$ و $TC = r$ ).',
  tawazi: '(TC) و (SK) عموديان كلاهما على المحور (SO) فهما متوازيان، والنقطة C من المولّد [OK].',
  talisSection: 'المثلثان OTC و OSK في وضعية طالس: $\\dfrac{OT}{OS} = \\dfrac{TC}{SK}$ أي $\\dfrac{18 - h}{18} = \\dfrac{r}{6}$ .',
  otWrong: 'نكتب $\\dfrac{r}{6} = \\dfrac{h}{18}$ .',
  otWhy: 'الضلع الذي رأسه O في المثلث الصغير هو $OT = 18 - h$ ، أمّا h فهو ST: طول الأسطوانة من قاعدة المخروط.',
  otRight: '$\\dfrac{r}{6} = \\dfrac{18 - h}{18}$',
  // la وضعية — l'équation, le volume, la vérification
  muadala: 'مع $h = r$ : $\\dfrac{r}{6} = \\dfrac{18 - r}{18}$ أي $18r = 6(18 - r)$ أي $18r = 108 - 6r$ ومنه $24r = 108$ .',
  halR: '$r = \\dfrac{108}{24} = 4{,}5$ ، إذن $h = r = 4{,}5\\,\\mathrm{cm}$ .',
  hajm: '$V = \\pi \\times r^2 \\times h = \\pi \\times 4{,}5^2 \\times 4{,}5 = 91{,}125\\pi$ ، أي $V \\approx 286{,}28\\,\\mathrm{cm}^3$ .',
  qutrWrong: 'نحسب الحجم بالقطر: $\\pi \\times 9^2 \\times 4{,}5$ .',
  qutrWhy: 'قانون حجم الأسطوانة $V = \\pi r^2 h$ بنصف القطر r ، والقطر $2r = 9$ يضاعف الحجم أربع مرات.',
  qutrRight: '$V = \\pi \\times 4{,}5^2 \\times 4{,}5 = 91{,}125\\pi$',
  mulaama: 'نتحقّق: $4{,}5 < 6$ (الأسطوانة لا تخرج من المخروط) و $4{,}5 < 18$ ، و $\\dfrac{4{,}5}{6} = \\dfrac{18 - 4{,}5}{18} = 0{,}75$ .',
  jumla: 'حجم الأسطوانة في الحالة $h = r$ هو $91{,}125\\pi\\,\\mathrm{cm}^3$ ، أي $286{,}28\\,\\mathrm{cm}^3$ تقريبا.',
  // أتعمّق
  masafa: 'المجهول جزء من ضلع: نكتب الطول الكامل بدلالته، مثل $OD = OB + BD$ ، ثم تساوي النسبتين في وضعية طالس، فنحلّ معادلة من الدرجة الأولى.',
  tajnid: 'وضعية طالس تظهر حيث يوجد مستقيمان متوازيان يقطعان مستقيمين متقاطعين: ظلّان، مقطع محوري، ضفّتا نهر، قاعدتا شبه منحرف.',
};

/**
 * « أؤكّد تعلّماتي » (p. 112) : les quatre QCM, au mot près, chacun renvoyé au درس qui l'enseigne
 * (extraction › qcm › duplicatedIn : 1, 2 → درس 1 ; 3 → درس 2 ; 4 → درس 1 et درس 3) et à la colonne
 * « عند الحاجة أعود إلى الصفحة » du manuel. Items 1 et 2 : une ligne x et une ligne y, chaque cellule se juge
 * seule (item 1 : 9/2 et 4,5 sont DEUX bonnes cellules) ; item 4 : les trois réponses sont justes. Figures :
 * content/figures.js.
 */
export const QCM = [
  { n: 1, text: 'في الشكل الآتي (BC)//(IJ). ينتج ………', pages: [106, 107], lessons: ['talis-hisab-atwal'] },
  { n: 2, text: 'في الشكل الآتي، (LM)//(BC) ينتج ………', pages: [106, 107], lessons: ['talis-hisab-atwal'] },
  { n: 3, text: 'في الشكل الآتي، ينتج ………', options: ['(EF) لا يوازي (BC)', '(BC)//(EF)', '$BC = \\dfrac{1}{2}EF$'], correct: 0, pages: [108, 109], lessons: ['aksiya-talis'],
    explain: '$\\dfrac{AB}{AE} = \\dfrac{11}{33} = \\dfrac{1}{3}$ و $\\dfrac{AC}{AF} = \\dfrac{15}{60} = \\dfrac{1}{4}$ : النسبتان مختلفتان، فلو كان (BC)//(EF) لتساوتا حسب خاصية طالس. إذن (EF) لا يوازي (BC)، ولا معنى لـ $BC = \\dfrac{1}{2}EF$ .' },
  { n: 4, text: 'نختار تدريجا منتظما على [AB] ونرسم مستقيمات موازية لـ (BC)، كما هو مبيّن في الشكل. ينتج …', pages: [106, 107, 109], lessons: ['talis-hisab-atwal', 'inshaat-talis'],
    rows: ['$\\dfrac{AN}{AC} = \\dfrac{AM}{AB} = \\dfrac{3}{5}$', '$\\dfrac{AM}{AB} = \\dfrac{NM}{CB} = \\dfrac{3}{5}$', '$5 \\times NM = 3 \\times CB$'],
    explain: 'M النقطة الثالثة من خمس قطع متقايسة: $\\dfrac{AM}{AB} = \\dfrac{3}{5}$ ، و (MN)//(BC) فالمثلثان AMN و ABC في وضعية طالس: $\\dfrac{AM}{AB} = \\dfrac{AN}{AC} = \\dfrac{MN}{BC} = \\dfrac{3}{5}$ ، والجداء التصالبي يعطي $5 \\times NM = 3 \\times CB$ . الإجابات الثلاث صحيحة.' },
].map((it) => ({ ...it, source: src('qcm', 112, 'أؤكّد تعلّماتي', it.n), lessonPaths: it.lessons.map((l) => `${BASE}/${l}`) }));

/** Le corrigé ligne par ligne des items 1 et 2 (cellules x et y). */
export const QCM_CELLS = {
  1: {
    rows: [
      { id: 'x6', label: '$x = 6$', correct: 0 }, { id: 'x15', label: '$x = 1{,}5$', correct: 1 }, { id: 'x32', label: '$x = \\dfrac{3}{2}$', correct: 1 },
      { id: 'y6', label: '$y = 6$', correct: 1 }, { id: 'y92', label: '$y = \\dfrac{9}{2}$', correct: 0 }, { id: 'y45', label: '$y = 4{,}5$', correct: 0 },
    ],
    explain: '$AB = 3 + 2 = 5$ ، والمثلثان AIJ و ABC في وضعية طالس: $\\dfrac{AI}{AB} = \\dfrac{IJ}{BC} = \\dfrac{AJ}{AC}$ . إذن $\\dfrac{3}{5} = \\dfrac{x}{10}$ ومنه $x = 6$ ؛ و $\\dfrac{3}{5} = \\dfrac{y}{y + 3}$ ومنه $5y = 3y + 9$ أي $y = \\dfrac{9}{2} = 4{,}5$ : خانتا y الثانية والثالثة صحيحتان معًا.',
  },
  2: {
    x: { options: ['4', '$\\dfrac{1}{2}$', '8'], correct: 0 },
    y: { options: ['6', '24', '3'], correct: 0 },
    explain: 'المثلثان ALM و ABC في وضعية طالس (A بين النقطتين): $\\dfrac{AL}{AB} = \\dfrac{AM}{AC} = \\dfrac{LM}{BC} = \\dfrac{2}{4} = \\dfrac{1}{2}$ . إذن $AB = 2 \\times AL = 4$ و $AC = 2 \\times AM = 6$ .',
  },
};

export const LESSON_TITLES = {
  'talis-hisab-atwal': 'الدرس 1 — خاصية طالس وحساب الأطوال',
  'aksiya-talis': 'الدرس 2 — الخاصية العكسية لخاصية طالس وإثبات التوازي',
  'inshaat-talis': 'الدرس 3 — إنشاءات هندسية وتطبيقات خاصية طالس',
};

/**
 * « إختبار أولي » (module 4) — la وضعية et le تحدّ TRANSPOSÉS (`synthesis_generation`) : mêmes ressources, autres
 * nombres, pour que leurs réponses n'apparaissent nulle part ailleurs dans la leçon.
 *   le cornet  H = 12, R = 6 : r ÷ 6 = (12 − h) ÷ 12 ; h = r ⇒ 18r = 72 ⇒ r = 4 ; V = 64π ≈ 201,06 cm³ ;
 *   la minaret  bâton de 1,5 m à 12 m, ombres finissant ensemble à 14 m ⇒ OB = 2 ⇒ AM = 1,5 × 14 ÷ 2 = 10,5 m.
 */
export const TEST = {
  source: addition('synthesis_generation'),
  title: 'وضعية أخرى: علبة مثلجات في مخروط، ومنارة الحيّ',
  cone: { H: 12, R: 6, text: 'أسطوانة دوران ارتفاعها $h$ ونصف قطر قاعدتها $r$ ، مرسومة داخل مخروط دوران ارتفاعه $12\\,\\mathrm{cm}$ ونصف قطر قاعدته $6\\,\\mathrm{cm}$ ، بنفس الطريقة التي في الوضعية.' },
  minaret: { stick: '1,5', stickAt: '12', tip: '14', text: 'غرست ريم عصا شاقولية طولها $1{,}5\\,\\mathrm{m}$ على بعد $12\\,\\mathrm{m}$ من قاعدة منارة، فانتهى ظلّها حيث ينتهي ظلّ المنارة، على بعد $14\\,\\mathrm{m}$ من قاعدة المنارة.' },
};
