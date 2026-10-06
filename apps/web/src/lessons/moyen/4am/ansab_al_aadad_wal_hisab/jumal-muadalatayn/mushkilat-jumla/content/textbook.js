/**
 * Le contenu du MANUEL pour le درس 3 « حل مشكلات بتوظيف جمل معادلتين من الدرجة الأولى بمجهولين » —
 * données pures (aucun JSX), au mot près ; chaque bloc cite son élément de
 * docs/sources/4am/unit5/extraction.json (destinations : act-3 → module 1 ; le تحدّ et أبو كامل
 * dupliqués en module 2 ; ex-14 → 21 et 24 → 28 → module 3 ; QCM 7 → module 7 ; مسائل → modules 4–6, content/problems.js).
 */
import { src, addition } from '../../_unit/unitMeta.js';

/** نشاط 3 (p. 57) — le musée : l'énoncé et le TABLEAU des étapes du manuel (trois colonnes). */
export const ACTIVITY = {
  source: src('act-3', 57, 'أنشطة', 3),
  title: 'حل مشكلات بتوظيف جمل معادلتين من الدرجة الأولى بمجهولين',
  text: 'يقترح متحف تذكرتين لعطلة نهاية الأسبوع: • 300 DA للبالغين. • 150 DA للصّغار. في هذا اليوم، استقبل المتحف 140 زائرا وبلغت مداخيله 30300 DA. أوجد عدد البالغين وعدد الصغار الذين زاروا المتحف هذا اليوم.',
  tableColumns: ['مراحل (خطوات) الحل', 'المهمات', 'حل'],
  table: [
    { stage: '1) اختيار المجاهيل.', task: 'ما هي المجاهيل في هذه المشكلة؟' },
    { stage: '2) ترجمة المشكلة بجملة معادلتين.', task: 'عبّر بدلالة المجاهيل السابقة عن المعلومة «استقبل المتحف 140 زائرا»' },
    { stage: '2) ترجمة المشكلة بجملة معادلتين.', task: 'عبّر بدلالة المجاهيل السابقة عن المعلومة «بلغت مداخيل المتحف 30300DA»' },
    { stage: '2) ترجمة المشكلة بجملة معادلتين.', task: 'ما هي جملة المعادلتين التي تترجم معطيات المشكلة؟' },
    { stage: '3) حل الجملة', task: 'حل جملة المعادلتين باختيار طريقة مناسبة.' },
    { stage: '4) تحقق', task: 'تحقق من صحة النتيجة.' },
    { stage: '5) الإجابة', task: 'ترجم النتيجة واجب عن السؤال.' },
  ],
  // ce que la مذكرة du professeur lit comme questions de la phase de déclenchement
  questions: [
    'ما هي المجاهيل في هذه المشكلة؟',
    'ما هي جملة المعادلتين التي تترجم معطيات المشكلة؟',
    'حل جملة المعادلتين باختيار طريقة مناسبة.',
    'تحقق من صحة النتيجة.',
    'ترجم النتيجة واجب عن السؤال.',
  ],
  closing: 'زار المتحف 62 بالغا و 78 صغيرا.',
  numbers: { visitors: 140, adult: 300, child: 150, income: 30300, adults: 62, children: 78 },
};

/** Les réponses du tableau, telles que la leçon les écrit (extraction → act-3.answer). */
export const ACTIVITY_SOLUTION = {
  source: ACTIVITY.source,
  unknowns: 'نسمّي $x$ عدد البالغين و $y$ عدد الصغار.',
  count: '«استقبل المتحف 140 زائرا»: $x + y = 140$',
  money: '«بلغت مداخيل المتحف 30300DA»: $300x + 150y = 30300$',
  system: '$\\begin{cases} x + y = 140 \\\\ 300x + 150y = 30300 \\end{cases}$',
  solve: 'من المعادلة الأولى $y = 140 - x$ ، نعوّض: $300x + 150(140 - x) = 30300$ أي $150x = 9300$ ومنه $x = 62$ ، ثم $y = 140 - 62 = 78$ .',
  check: '$62 + 78 = 140$ و $300 \\times 62 + 150 \\times 78 = 18600 + 11700 = 30300$',
  answer: 'زار المتحف 62 بالغا و 78 صغيرا.',
};

/**
 * Le laboratoire `story-modeller` aux DEUX niveaux — les props passées telles quelles.
 *   مبتدئ : le derby (plateforme, inconnues déjà nommées) — 20 billets, 300 / 150 DA, 4800 DA
 *   متقدم : نشاط 3, les mots et les nombres du manuel
 */
export const LAB = {
  source: addition('interaction_generation'),
  beginner: {
    system: 'x+y=20|300x+150y=4800',
    theme: 'stadium',
    named: true,
    unknowns: [{ id: 'x', noun: 'عدد تذاكر الكبار' }, { id: 'y', noun: 'عدد تذاكر الصغار' }],
    story: 'ديربي العاصمة يوم الجمعة! اشترت رابطة مناصري الحي 20 تذكرة للمدرجات: تذكرة الكبار بـ 300 DA وتذكرة الصغار بـ 150 DA، ودفعت 4800 DA. كم تذكرة للكبار وكم تذكرة للصغار اشترت الرابطة؟',
    facts: [
      { quote: 'اشترت الرابطة 20 تذكرة', kind: 'count' },
      { quote: 'دفعت الرابطة 4800 DA', kind: 'money' },
    ],
    chips: [
      { value: '20', label: 'تذكرة' },
      { value: '300', label: 'DA للكبير' },
      { value: '150', label: 'DA للصغير' },
      { value: '4800', label: 'DA المجموع' },
    ],
    answer: {
      options: ['اشترت الرابطة 12 تذكرة للكبار و 8 تذاكر للصغار.', 'اشترت الرابطة 8 تذاكر للكبار و 12 تذكرة للصغار.', 'اشترت الرابطة 12 تذكرة.'],
      correct: 0,
    },
  },
  advanced: {
    system: 'x+y=140|300x+150y=30300',
    theme: 'museum',
    named: false,
    unknowns: [{ id: 'x', noun: 'عدد البالغين' }, { id: 'y', noun: 'عدد الصغار' }],
    story: 'يقترح متحف تذكرتين لعطلة نهاية الأسبوع: 300 DA للبالغين، 150 DA للصّغار. في هذا اليوم، استقبل المتحف 140 زائرا وبلغت مداخيله 30300 DA. أوجد عدد البالغين وعدد الصغار الذين زاروا المتحف هذا اليوم.',
    facts: [
      { quote: 'استقبل المتحف 140 زائرا', kind: 'count' },
      { quote: 'بلغت مداخيله 30300 DA', kind: 'money' },
    ],
    chips: [
      { value: '140', label: 'زائرا' },
      { value: '300', label: 'DA للبالغ' },
      { value: '150', label: 'DA للصغير' },
      { value: '30300', label: 'DA المداخيل' },
    ],
    answer: {
      options: ['زار المتحف 62 بالغا و 78 صغيرا.', 'زار المتحف 78 بالغا و 62 صغيرا.', 'زار المتحف 62 بالغا.'],
      correct: 0,
    },
  },
};

/**
 * Les CINQ étapes du tableau du manuel (p. 57) : ce que la brique « khutuwat-hall » pose et ce
 * que la carte relie. Les noms d'étapes sont ceux du manuel ; la phrase après « : » dit l'action.
 */
export const STEPS = {
  source: src('act-3', 57, 'أنشطة', 3),
  choose: '1) اختيار المجاهيل: نسمّي $x$ و $y$ ما يسأل عنه السؤال.',
  translate: '2) ترجمة المشكلة بجملة معادلتين: كل معلومة من النص تعطي معادلة.',
  solve: '3) حل الجملة باختيار طريقة مناسبة (التعويض أو الجمع).',
  check: '4) تحقق: نعوّض العددين في معطيات النص نفسه.',
  answer: '5) الإجابة: نترجم النتيجة ونجيب عن السؤال بجملة.',
};

/** Ce que le laboratoire a rendu physique : chaque information, une équation, une seule unité. */
export const TRANSLATION_RULE = {
  source: src('act-3', 57, 'أنشطة', 3),
  text: 'نترجم كل معلومة من النص بمعادلة، وفي المعادلة الواحدة وحدة واحدة: «استقبل المتحف 140 زائرا» تعدّ أشخاصا، فكل زائر يُعدّ مرة واحدة: $x + y = 140$ ؛ و«بلغت مداخيله 30300 DA» تجمع دنانير، فكل بالغ يدفع 300 وكل صغير 150: $300x + 150y = 30300$ .',
};

/** L'erreur que le laboratoire refuse (MISC-JUMLA-TARJAMA) : un prix compté comme une personne. */
export const MISTAKE_TARJAMA = {
  source: src('act-3', 57, 'أنشطة', 3),
  wrong: 'ترجمة «استقبل المتحف 140 زائرا» بالمعادلة $300x + 150y = 140$ .',
  why: '$300x + 150y$ مبلغ بالدينار، و 140 عدد زوار: لا نساوي مالًا بعدد أشخاص.',
  right: 'كل زائر يُعدّ مرة واحدة: $x + y = 140$ ، والأثمان تدخل في معلومة المداخيل: $300x + 150y = 30300$ .',
};

/** La règle de l'étape 4 (MISC-JUMLA-TAHAQQUQ-NAS) : on vérifie dans le TEXTE, et la réponse a un sens. */
export const CHECK_RULE = {
  source: src('act-3', 57, 'أنشطة', 3),
  text: 'نتحقق من النتيجة في معطيات النص نفسه، لا في الجملة فقط: $62 + 78 = 140$ زائرا و $300 \\times 62 + 150 \\times 78 = 30300$ DA. وعدد أشخاص أو قطع يكون عددًا طبيعيًا، ثم نكتب جملة تجيب عن السؤال.',
};

/** L'erreur que la résolution du laboratoire refuse (MISC-JUMLA-NISF-HALL). */
export const MISTAKE_HALF = {
  source: src('act-3', 57, 'أنشطة', 3),
  wrong: 'التوقف عند $x = 62$ والإجابة: «زار المتحف 62 زائرا».',
  why: 'السؤال يطلب عدد البالغين وعدد الصغار: حل الجملة ثنائية، و $x$ وحده نصف الجواب.',
  right: 'نعوّض $x = 62$ لنجد $y = 78$ ، ونجيب: زار المتحف 62 بالغا و 78 صغيرا.',
};

/** تحدّ (p. 55) — les pièces de la classe, résolues par les cinq étapes (module 2). */
export const CHALLENGE = {
  source: src('challenge', 55, 'تحدّ'),
  text: 'لتزيين قسمهم، جمع التلاميذ مبلغ 610DA مُشكّلا من 37 قطعة نقدية من فئتي 20DA و 10DA. ما هو عدد القطع النقدية التي جمعها التلاميذ من كل فئة؟',
};

/** أبو كامل (p. 55) — le problème du أجير, une jumla écrite mille ans avant la notation (module 2). */
export const ABU_KAMIL = {
  source: src('history-abu-kamil', 55, 'أبو كامل'),
  intro: 'أبو كامل شجاع بن أسلم محمد (850م - 930م) عالم مصري اهتم بالحساب و الجبر و الهندسة. و يُعرف أيضا باسم كامل الحاسب.',
  problem: '«إذا وظفت أجيرا و اشترطت عليه أنه إذا عمل شهرا كاملا يتقاضى 6 دراهم و إذا انقطع عن العمل شهرا كاملا يدفع 4 دراهم و في أحد الشهور عمل و انقطع و في النهاية لم يدفع و لم يتقاض أي درهم. كم يوما عمل في الشهر؟»',
};

/**
 * La LECTURE retenue du problème d'أبو كامل (extraction → discrepancy) : le texte ne dit ni la durée
 * du mois ni que le salaire suit les jours — la lecture classique, dite en une ligne.
 */
export const ABU_KAMIL_READING = {
  source: addition('interaction_generation'),
  text: 'نقرأ النص قراءته المعروفة: الشهر 30 يوما، والأجر والغرامة يُحسبان بعدد الأيام. نسمّي $x$ عدد أيام العمل و $y$ عدد أيام الانقطاع: $x + y = 30$ ، وما يتقاضاه يساوي ما يدفعه: $6x = 4y$ .',
};

/** أؤكّد تعلّماتي, item 7 (p. 62) — dans le test final de la leçon (destinations → qcm items [7]). */
export const QCM7 = {
  source: src('qcm', 62, 'أؤكّد تعلّماتي', 7),
  text: '$x$ و $y$ قيسا زاويتين متكاملتين بالدرجات. يزيد $x$ عن $y$ بـ $15°$ . لإيجاد $x$ و $y$ ، نحل الجملة الآتية:',
  options: [
    '$\\begin{cases} x + y = 180 \\\\ x = y + 15 \\end{cases}$',
    '$\\begin{cases} y + x = 90 \\\\ y + 15 = x \\end{cases}$',
    '$\\begin{cases} y = 180 - x \\\\ y + x = 15 \\end{cases}$',
  ],
  correct: 0,
};

/**
 * « أستعدّ » — le manuel n'a AUCUN item pour ce sujet (ses items 1–10 p. 55 vont aux leçons 1 et 2) :
 * neuf affirmations de la PLATEFORME, dans la forme du manuel (« أصحيح أم خاطئ؟ برّر إجابتك »), sur
 * les prérequis du propriétaire : traduire une phrase, périmètres et aires, pourcentages, vérifier
 * une ثنائية, résoudre une jumla. Les deux réponses présentes ; aucune n'utilise les nombres du
 * laboratoire (140, 300, 150, 20, 4800) ni ceux du تحدّ.
 */
export const PREP_ITEMS = [
  { skill: 'tarjama', text: '«ضعف عدد مضافًا إليه 5» يُكتب $2x + 5$ حيث $x$ هو العدد.', answer: true, why: 'ضعف العدد $2x$ ، ثم نضيف 5: $2x + 5$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'tarjama', text: '«مجموع عددين $a$ و $b$ هو 50» يُكتب $ab = 50$ .', answer: false, why: 'المجموع ناتج الجمع: $a + b = 50$ ؛ أما $ab$ فهو جداؤهما.', source: addition('prerequisite_diagnostic') },
  { skill: 'hisab', text: 'محيط مستطيل بعداه $L$ و $l$ هو $L + l$ .', answer: false, why: 'المحيط مجموع الأضلاع الأربعة: $2(L + l) = 2L + 2l$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'hisab', text: 'مساحة مستطيل بعداه $L - 2$ و $l + 2$ هي $Ll + 2L - 2l - 4$ .', answer: true, why: '$(L - 2)(l + 2) = Ll + 2L - 2l - 4$ بالنشر.', source: addition('prerequisite_diagnostic') },
  { skill: 'nisba', text: '20% من 450 هو 90.', answer: true, why: '$0{,}2 \\times 450 = 90$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'nisba', text: 'بعد تخفيض 25% يصبح ثمن سلعة سعرها 600 DA هو 575 DA.', answer: false, why: 'التخفيض $0{,}25 \\times 600 = 150$ ، فالثمن الجديد $600 - 150 = 450$ DA ، أي $0{,}75 \\times 600$ .', source: addition('prerequisite_diagnostic') },
  { skill: 'jumla', text: 'الثنائية $(3 ; 5)$ حل للجملة $\\begin{cases} x + y = 8 \\\\ 2x - y = 1 \\end{cases}$ .', answer: true, why: '$3 + 5 = 8$ و $2 \\times 3 - 5 = 1$ : المعادلتان محققتان معا.', source: addition('prerequisite_diagnostic') },
  { skill: 'jumla', text: 'الثنائية $(5 ; 3)$ حل للجملة نفسها $\\begin{cases} x + y = 8 \\\\ 2x - y = 1 \\end{cases}$ .', answer: false, why: '$5 + 3 = 8$ لكن $2 \\times 5 - 3 = 7 \\neq 1$ : الترتيب مهم.', source: addition('prerequisite_diagnostic') },
  { skill: 'jumla', text: 'حل الجملة $\\begin{cases} x + y = 12 \\\\ x - y = 4 \\end{cases}$ هو الثنائية $(8 ; 4)$ .', answer: true, why: 'بالجمع طرفا لطرف: $2x = 16$ أي $x = 8$ ، ثم $y = 12 - 8 = 4$ .', source: addition('prerequisite_diagnostic') },
];
