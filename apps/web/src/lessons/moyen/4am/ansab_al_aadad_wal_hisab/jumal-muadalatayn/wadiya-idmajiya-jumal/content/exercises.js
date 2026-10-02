/**
 * Les exercices du MANUEL rattachés à la synthèse (extraction › destinations :
 * ex-29, ex-30, ex-31 p. 63 — module 3 « أتعمّق »). Chaque énoncé est celui du
 * livre, au mot près ; un exercice à plusieurs questions est découpé en une
 * entrée par question (la première porte l'énoncé). Les inconnues que le manuel
 * ne nomme pas (ex. 29 et 30) sont nommées dans la QUESTION, jamais dans l'énoncé.
 *
 * L'exercice 31 est montré CORRIGÉ (décision du propriétaire, extraction ›
 * ex-31 › correction) : en 2) ب) le manuel écrit « x + y = 216 » alors que
 * 0,8(5x + 5y) = 1080 donne x + y = 270, la valeur que porte la جملة du 3) ;
 * une ligne discrète le dit (`EX31_CORRECTION`). Une MISE EN ÉQUATION est
 * demandée en choix, dont les distracteurs sont FAUX et viennent d'erreurs
 * réelles (unités mélangées, quantité multipliée par le prix de l'autre objet,
 * réduction oubliée ou prise pour le prix payé) ; une ثنائية est tapée (`pair`).
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-jumal_P1',
  P2: '4am_wadiya-idmajiya-jumal_P2',
};

const E = (n, part) => ({ ...src(`ex-${n}`, 63, 'أتعمّق', n), ...(part ? { part } : {}) });
const C = (prompt, options, correct, explain, cols = 1) => ({ prompt, options, correct, cols, explain });
const Pair = (prompt, x, y, explain) => ({ prompt, expected: { x, y }, explain });
const sys = (a, b) => `$\\begin{cases} ${a} \\\\ ${b} \\end{cases}$`;

/** Le texte du manuel (ex. 31) : « 216 » en 2) ب), corrigé en « 270 » dans la leçon. */
const EX31_TEXT = 'اشترى زبون من متجر كبير 6 علب من الحليب وقارورة عصير ودفع 720 DA. زبون آخر يملك بطاقة إخلاص تمكّنه من الاستفادة من تخفيض قدره 20% على ثمن كلّ مشترياته عند الدفع. اشترى هذا الزبون 5 علب من الحليب و5 قارورات عصير من النوع نفسه ودفع 1080 DA بعد استظهار بطاقته. 1) ماذا نعني بكلّ من $x$ و $y$ في المعادلة التي تترجم مشتريات الزبون الأوّل: $6x + y = 720$ . 2) أ) اشرح لماذا عند تطبيق تخفيض بـ 20%، نضرب الثمن في 0,8. ب) اكتب معادلة تعبّر عن مشتريات الزبون الثاني. بيّن أنّ هذه المعادلة تكتب على الشكل: $x + y = 270$ 3) حل الجملة: $\\begin{cases} 6x + y = 720 \\\\ x + y = 270 \\end{cases}$ 4) ما هو سعر علبة الحليب وسعر قارورة العصير؟';

export const EX31_CORRECTION = 'صحّحت المنصّة خطأً مطبعيًا في نص الكتاب: في 2) ب) الشكل هو $x + y = 270$ (كُتب في الكتاب $x + y = 216$ ، أي $1080 \\div 5$ دون التخفيض)، كما في جملة السؤال 3.';

export const EXERCISES = [
  /* ── تمرين 29 — العسل : 7kg في 18 علبة من فئتي 500g و 250g ── */
  {
    id: 'ex-29-1', source: E(29, '1'), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'تحصل فلّاح مختصّ في تربية النحل على 7kg من العسل. لتسويق هذه الكمية، تمكّن من توزيعها على 18 علبة زجاجية، بعضها من فئة 500g والأخرى من فئة 250g، ممتلئة بالعسل. ما هو عدد قارورات كلّ فئة؟',
    interaction: 'choice',
    question: C('نسمّي $x$ عدد علب فئة 500g و $y$ عدد علب فئة 250g. الجملة التي تترجم المعطيات هي:', [
      sys('x + y = 18', '500x + 250y = 7000'),
      sys('x + y = 18', '500x + 250y = 7'),
      sys('x + y = 7000', '500x + 250y = 18'),
      sys('x + y = 18', '250x + 500y = 7000'),
    ], 0, 'عدد العلب: $x + y = 18$ ؛ والكتلة بالغرام: $x$ علبة فيها $500x$ غرام و $y$ علبة فيها $250y$ غرام، و $7\\,\\mathrm{kg} = 7000\\,\\mathrm{g}$ : $500x + 250y = 7000$.', 2),
    method: 'معلومة عن العدد (18 علبة) ومعلومة عن الكتلة (7kg): معادلة لكل معلومة، والكتلة كلها بوحدة واحدة.',
    commonError: 'كتابة $500x + 250y = 7$ : الكتل بالغرام والمجموع بالكيلوغرام.',
  },
  {
    id: 'ex-29-2', source: E(29, '2'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'pair',
    question: Pair('حل الجملة: ما هو عدد العلب $(x ; y)$ من كل فئة؟', '10', '8',
      'من $x + y = 18$ : $y = 18 - x$ ، نعوّض: $500x + 250(18 - x) = 7000$ أي $250x + 4500 = 7000$ ، $x = 10$ ثم $y = 8$. نتحقق: $10 \\times 500 + 8 \\times 250 = 7000$ غرام، و $10 + 8 = 18$ علبة.'),
    commonError: 'التوقف عند $x = 10$ : السؤال يطلب عدد العلب من الفئتين.',
  },

  /* ── تمرين 30 — الموزّع الآلي : 356 ورقة، 454 000 DA ── */
  {
    id: 'ex-30-1', source: E(30, '1'), learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'خلال يوم واحد، سُحب من موزّع آلي للأوراق النقدية 356 ورقة نقدية كلها من فئة 1000DA أو 2000 DA. وبلغ المبلغ الإجمالي الموزّع 454 000 DA. ما هو عدد أوراق كلّ فئة؟',
    interaction: 'choice',
    question: C('نسمّي $x$ عدد أوراق فئة 1000DA و $y$ عدد أوراق فئة 2000DA. الجملة التي تترجم المعطيات هي:', [
      sys('x + y = 356', '1000x + 2000y = 454000'),
      sys('x + y = 454000', '1000x + 2000y = 356'),
      sys('x + y = 356', '2000x + 1000y = 454000'),
      sys('1000x + 2000y = 356', 'x + y = 454000'),
    ], 0, 'عدد الأوراق: $x + y = 356$ ؛ والمبلغ: $x$ ورقة من 1000DA قيمتها $1000x$ ، و $y$ ورقة من 2000DA قيمتها $2000y$ : $1000x + 2000y = 454000$.', 2),
    commonError: 'الخلط بين العدد والمبلغ: 356 عدد أوراق، و 454 000 مبلغ بالدينار.',
  },
  {
    id: 'ex-30-2', source: E(30, '2'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'pair',
    question: Pair('حل الجملة: ما هو عدد الأوراق $(x ; y)$ من كل فئة؟', '258', '98',
      'نقسم طرفي المعادلة الثانية على 1000: $x + 2y = 454$ ، ثم نطرح منها $x + y = 356$ : $y = 98$ ، و $x = 356 - 98 = 258$. نتحقق: $258 \\times 1000 + 98 \\times 2000 = 258000 + 196000 = 454000$.'),
    method: 'نبسّط أولا بالقسمة على 1000، ثم نطرح المعادلتين طرفا بطرف فيختفي $x$.',
  },

  /* ── تمرين 31 — الحليب والعصير، تخفيض 20% (مصحَّح : x + y = 270) ── */
  {
    id: 'ex-31-1', source: E(31, '1)'), learningPointId: LP.P2, difficulty: 'facile',
    statement: EX31_TEXT,
    interaction: 'choice',
    question: C('1) ماذا نعني بكلّ من $x$ و $y$ في المعادلة $6x + y = 720$ ؟', [
      '$x$ سعر علبة الحليب و $y$ سعر قارورة العصير (بالدينار)',
      '$x$ عدد علب الحليب و $y$ عدد قارورات العصير',
      '$x$ سعر قارورة العصير و $y$ سعر علبة الحليب (بالدينار)',
      '$x$ المبلغ المدفوع و $y$ التخفيض',
    ], 0, 'الزبون الأوّل اشترى 6 علب حليب وقارورة واحدة ودفع 720 DA: $6x$ ثمن العلب الست إذا كان $x$ سعر العلبة، و $y$ سعر القارورة.'),
    commonError: 'تسمية الأعداد المعلومة (6 علب) مجهولا: المجهولان هما السعران المطلوبان.',
  },
  {
    id: 'ex-31-2a', source: E(31, '2) أ)'), learningPointId: LP.P1, difficulty: 'facile',
    interaction: 'choice',
    question: C('2) أ) لماذا نضرب الثمن في 0,8 عند تطبيق تخفيض بـ 20%؟', [
      'لأنّ الثمن بعد التخفيض هو الثمن ناقص 20% منه، أي 80% من الثمن، و $80\\% = 0{,}8$',
      'لأنّ 20% من الثمن تساوي 0,8 من الثمن',
      'لأنّ الزبون يدفع 20% فقط من الثمن',
      'لأنّ التخفيض يُطرح من الثمن: نطرح 0,8 دينار من كل علبة',
    ], 0, 'تخفيض 20% يعني أنّنا ندفع $100\\% - 20\\% = 80\\%$ من الثمن: الثمن $\\times 0{,}8$. مثلا ثمن 100 DA يصبح $100 \\times 0{,}8 = 80$ DA.'),
    commonError: 'الضرب في $0{,}2$ : هذا مقدار التخفيض، لا ما يُدفع.',
  },
  {
    id: 'ex-31-2b', source: E(31, '2) ب)'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('2) ب) المعادلة التي تعبّر عن مشتريات الزبون الثاني:', [
      '$0{,}8(5x + 5y) = 1080$',
      '$5x + 5y = 1080$',
      '$0{,}2(5x + 5y) = 1080$',
      '$0{,}8 \\times 5x + 5y = 1080$',
    ], 0, 'ثمن 5 علب و 5 قارورات قبل التخفيض: $5x + 5y$ ؛ والتخفيض يشمل كل المشتريات: $0{,}8(5x + 5y) = 1080$.', 2),
    commonError: 'نسيان التخفيض: $5x + 5y = 1080$ يعطي $x + y = 216$ ، وهو ما طُبع خطأً في الكتاب.',
  },
  {
    id: 'ex-31-2c', source: E(31, '2) ب)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('بيّن أنّ هذه المعادلة تكتب على الشكل $x + y = 270$ : أيّ حساب يوصلنا إليه؟', [
      '$0{,}8 \\times 5 = 4$ ، فالمعادلة $4x + 4y = 1080$ ، ثم نقسم الطرفين على 4',
      'نقسم 1080 على 5: $x + y = 216$',
      'نضرب 1080 في 0,8: $x + y = 864$',
      'نطرح 20 من 1080 ثم نقسم على 4',
    ], 0, '$0{,}8(5x + 5y) = 4x + 4y$ ، و $4x + 4y = 1080$ يعني $x + y = \\dfrac{1080}{4} = 270$.'),
  },
  {
    id: 'ex-31-3', source: E(31, '3)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'pair',
    question: Pair('3) حل الجملة $\\begin{cases} 6x + y = 720 \\\\ x + y = 270 \\end{cases}$', '90', '180',
      'معاملا $y$ متساويان: نطرح المعادلة الثانية من الأولى طرفا بطرف: $5x = 450$ ، $x = 90$ ، ثم $y = 270 - 90 = 180$.'),
    method: 'معامل $y$ هو 1 في المعادلتين: الطرح طرفا بطرف (أو التعويض بـ $y = 270 - x$) يحذف $y$ مباشرة.',
  },
  {
    id: 'ex-31-4', source: E(31, '4)'), learningPointId: LP.P2, difficulty: 'facile',
    interaction: 'choice',
    question: C('4) ما هو سعر علبة الحليب وسعر قارورة العصير؟', [
      'علبة الحليب 90DA وقارورة العصير 180DA',
      'علبة الحليب 180DA وقارورة العصير 90DA',
      'علبة الحليب 72DA وقارورة العصير 144DA',
      'علبة الحليب 90DA فقط؛ لا يمكن معرفة سعر العصير',
    ], 0, 'نتحقق في النص: $6 \\times 90 + 180 = 720$ ، و $0{,}8 \\times (5 \\times 90 + 5 \\times 180) = 0{,}8 \\times 1350 = 1080$.'),
    commonError: 'إعطاء الأسعار بعد التخفيض ($72$ و $144$): السعر هو الثمن قبل التخفيض.',
  },
];

/** Les questions d'un exercice du manuel (numéro → entrées), dans l'ordre. */
export const partsOf = (n) => EXERCISES.filter((ex) => ex.id.startsWith(`ex-${n}-`));
