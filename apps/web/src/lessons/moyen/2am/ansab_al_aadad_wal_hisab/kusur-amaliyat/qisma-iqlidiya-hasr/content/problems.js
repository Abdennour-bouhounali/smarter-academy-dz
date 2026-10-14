/**
 * Les trois « مسائل » du درس « القسمة الإقليدية وحصر حاصل القسمة » (modules 5, 6, 7) — exercices COMPLETS de type
 * اختبار الفصل الأول, résolus pas à pas (GuidedProblem). AJOUTS DE LA PLATEFORME (`addition('exam_style_problem')`).
 * Périmètre : la division euclidienne pour tout diviseur, l'encadrement de a ÷ b entre deux entiers consécutifs et le sens
 * de ses deux bouts (par défaut : les groupes pleins ; par excès : les groupes nécessaires), le reste nul — jamais la
 * division décimale ni les valeurs approchées à 0,1 (leçon suivante). La مسألة 1 est « مسألة الدرس »
 * (`LESSON_CONFIG.lessonProblem`) ; chaque nombre est vérifié dans ./problems.test.js.
 */
import { addition } from '../../_unit/unitMeta.js';
import { LESSON_CONFIG } from '../lesson.config.js';

const SOURCE = addition('exam_style_problem');

export const PROBLEMS = [
  {
    id: 'masala-1',
    title: 'مسألة 1 — تعاونية البيض',
    context: LESSON_CONFIG.lessonProblem.title,
    headline: 'مسألة الدرس',
    emoji: '🥚',
    tone: 'amber',
    source: SOURCE,
    illustration: LESSON_CONFIG.lessonProblem.illustration,
    statement: LESSON_CONFIG.lessonProblem.statement,
    data: [
      { id: 'eggs', text: 'جمعت التعاونية 4750 بيضة', useful: true },
      { id: 'tray', text: 'في كل صفيحة 30 بيضة', useful: true },
      { id: 'truck', text: 'تنقل الشاحنة الصغيرة 40 صفيحة على الأكثر', useful: true },
      { id: 'hour', text: 'تفتح التعاونية على الساعة 7 صباحًا', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'الصفائح المملوءة',
        question: LESSON_CONFIG.lessonProblem.questions[0].text,
        asks: ['كم صفيحة مملوءة؟', 'كم بيضة تبقى؟'],
        steps: [
          { kind: 'sort' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['hasr-tariqa'],
            prompt: 'عدد الصفائح المملوءة:', expected: 158,
            explain: '$30 \\times 158 = 4740$ و $30 \\times 159 = 4770$ أكبر من 4750.' },
          { kind: 'numeric', role: 'answer', ask: 1, requires: ['qisma-taarif'],
            prompt: 'عدد البيض الباقي:', expected: 10,
            explain: '$4750 - 4740 = 10$ ، و $10 < 30$.' },
          { kind: 'solution', ask: 0, lines: [
            '$4750 = 30 \\times 158 + 10$ مع $10 < 30$.',
            'تملأ التعاونية 158 صفيحة، وتبقى 10 بيضات.',
          ] },
        ],
      },
      {
        label: '2)', title: 'حصر الحاصل والصفائح اللازمة',
        question: LESSON_CONFIG.lessonProblem.questions[1].text,
        asks: ['الحصر', 'كم صفيحة تلزم؟'],
        steps: [
          { kind: 'choice', role: 'conclude', ask: 0, requires: ['hasr-hasil'],
            prompt: 'حصر $\\frac{4750}{30}$ بين عددين طبيعيين متتاليين:',
            options: ['$10 < \\frac{4750}{30} < 11$', '$158 < \\frac{4750}{30} < 159$', '$157 < \\frac{4750}{30} < 158$'],
            correct: 1, cols: 1,
            explain: '$30 \\times 158 < 4750 < 30 \\times 159$ : الحاصل بين الصفائح المملوءة والعدد الذي يليه.' },
          { kind: 'numeric', role: 'answer', ask: 1, requires: ['qiyam-muqarraba'],
            prompt: 'عدد الصفائح اللازمة لتوضيب كل البيض:', expected: 159,
            explain: 'البيضات العشر الباقية تحتاج صفيحة أخرى: 159 ، القيمة المقرّبة إلى الوحدة بالزيادة.' },
          { kind: 'solution', ask: 0, lines: [
            '$158 < \\frac{4750}{30} < 159$ .',
            'تلزم 159 صفيحة: 158 مملوءة، وواحدة فيها 10 بيضات.',
          ] },
        ],
      },
      {
        label: '3)', title: 'الشاحنات',
        question: LESSON_CONFIG.lessonProblem.questions[2].text,
        asks: ['كم شاحنة تلزم؟'],
        steps: [
          { kind: 'choice', role: 'translate', requires: ['qisma-iqlidiya'],
            prompt: 'نقسم عدد الصفائح اللازمة على 40. القسمة الإقليدية هي:',
            options: ['$159 = 40 \\times 2 + 79$', '$158 = 40 \\times 3 + 38$', '$159 = 40 \\times 3 + 39$'],
            correct: 2, cols: 1,
            explain: 'نوزّع كل الصفائح، أي 159 ، والباقي 39 أصغر من 40. (79 أكبر من 40 ؛ و 158 تنسى الصفيحة غير المملوءة.)' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['qiyam-muqarraba'], prompt: 'عدد الشاحنات:', expected: 4,
            explain: '3 شاحنات تنقل 120 صفيحة فقط، والصفائح الـ 39 الباقية تحتاج شاحنة رابعة: $3 < \\frac{159}{40} < 4$ .' },
          { kind: 'solution', lines: [
            '$159 = 40 \\times 3 + 39$ و $3 < \\frac{159}{40} < 4$ .',
            'تلزم 4 شاحنات صغيرة.',
          ] },
        ],
      },
    ],
  },
  {
    id: 'masala-2',
    title: 'مسألة 2 — حافلات الرحلة',
    context: 'كم حافلة نحتاج؟',
    emoji: '🚌',
    tone: 'sky',
    source: SOURCE,
    illustration: { kind: 'scene', icon: 'bus', bg: 'blue', chips: [{ label: 'تلاميذ', value: 352, tone: 'blue' }, { label: 'أساتذة', value: 28, tone: 'green' }, { label: 'مقاعد الحافلة', value: 52, tone: 'amber' }, { label: 'كراء الحافلة', value: 12000, unit: 'دج', tone: 'rose' }], ariaLabel: 'حافلة: 352 تلميذًا و 28 أستاذًا، في كل حافلة 52 مقعدًا وكراؤها 12000 دج' },
    statement: 'نظّمت متوسطة رحلة علمية إلى حديقة التجارب بالحامّة، شارك فيها 352 تلميذًا و 28 أستاذًا. في كل حافلة 52 مقعدًا، وثمن كراء الحافلة الواحدة 12000 دج. تنطلق الحافلات على الساعة 6 صباحًا، فيحضر الجميع قبل الموعد احترامًا للوقت.',
    data: [
      { id: 'pupils', text: 'شارك 352 تلميذًا', useful: true },
      { id: 'teachers', text: 'رافقهم 28 أستاذًا', useful: true },
      { id: 'seats', text: 'في كل حافلة 52 مقعدًا', useful: true },
      { id: 'rent', text: 'كراء الحافلة الواحدة 12000 دج', useful: true },
      { id: 'hour', text: 'تنطلق الحافلات على الساعة 6 صباحًا', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'القسمة الإقليدية',
        question: 'احسب عدد المشاركين، ثم أجرِ القسمة الإقليدية لهذا العدد على 52.',
        asks: ['عدد المشاركين'],
        steps: [
          { kind: 'sort' },
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'عدد المشاركين:', expected: 380,
            explain: '$352 + 28 = 380$.' },
          { kind: 'numeric', role: 'compute', requires: ['qisma-taarif'], prompt: 'حاصل القسمة الإقليدية لـ 380 على 52:', expected: 7,
            explain: '$52 \\times 7 = 364$ و $52 \\times 8 = 416$ أكبر من 380.' },
          { kind: 'numeric', role: 'compute', requires: ['qisma-taarif'], prompt: 'باقي هذه القسمة:', expected: 16,
            explain: '$380 - 364 = 16$ ، و $16 < 52$.' },
          { kind: 'solution', ask: 0, lines: [
            'عدد المشاركين: $352 + 28 = 380$.',
            '$380 = 52 \\times 7 + 16$ مع $16 < 52$.',
          ] },
        ],
      },
      {
        label: '2)', title: 'الحافلات',
        question: 'احصر $\\frac{380}{52}$ بين عددين طبيعيين متتاليين. كم حافلة مملوءة تمامًا؟ وكم حافلة يجب كراؤها ليركب الجميع؟',
        asks: ['الحصر', 'كم حافلة مملوءة؟', 'كم حافلة يجب كراؤها؟'],
        steps: [
          { kind: 'choice', role: 'conclude', ask: 0, requires: ['hasr-hasil'],
            prompt: 'حصر $\\frac{380}{52}$ :',
            options: ['$16 < \\frac{380}{52} < 17$', '$7 < \\frac{380}{52} < 8$', '$6 < \\frac{380}{52} < 7$'],
            correct: 1, cols: 1,
            explain: '$52 \\times 7 < 380 < 52 \\times 8$ .' },
          { kind: 'numeric', role: 'answer', ask: 1, requires: ['qiyam-muqarraba'], prompt: 'عدد الحافلات المملوءة:', expected: 7,
            explain: 'القيمة المقرّبة إلى الوحدة بالنقصان: 7 حافلات مملوءة.' },
          { kind: 'numeric', role: 'answer', ask: 2, requires: ['qiyam-muqarraba'], prompt: 'عدد الحافلات التي يجب كراؤها:', expected: 8,
            explain: 'يبقى 16 مشاركًا بلا مقعد في 7 حافلات: تلزم حافلة ثامنة — القيمة بالزيادة.' },
          { kind: 'solution', ask: 0, lines: [
            '$7 < \\frac{380}{52} < 8$ .',
            '7 حافلات مملوءة، ويجب كراء 8 حافلات.',
          ] },
        ],
      },
      {
        label: '3)', title: 'المقاعد والكراء',
        question: 'كم مقعدًا يبقى شاغرًا؟ وما المبلغ الذي تدفعه المتوسطة؟',
        asks: ['كم مقعدًا شاغرًا؟', 'المبلغ'],
        steps: [
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'عدد المقاعد الشاغرة:', expected: 36,
            explain: '$52 - 16 = 36$ ، أو $52 \\times 8 - 380 = 416 - 380 = 36$.' },
          { kind: 'choice', role: 'translate',
            prompt: 'أيّ عملية تعطي المبلغ؟',
            options: ['$8 \\times 12000$', '$7 \\times 12000$', '$380 \\times 12000$'],
            correct: 0, cols: 3,
            explain: 'تكتري المتوسطة 8 حافلات.' },
          { kind: 'numeric', role: 'answer', ask: 1, prompt: 'المبلغ:', expected: 96000, suffix: 'دج',
            explain: '$8 \\times 12000 = 96000$.' },
          { kind: 'solution', ask: 0, lines: [
            'المقاعد الشاغرة: $52 - 16 = 36$.',
            'المبلغ: $8 \\times 12000 = 96000$ ، أي 96000 دج.',
          ] },
        ],
      },
    ],
  },
  {
    id: 'masala-3',
    title: 'مسألة 3 — قفف التضامن',
    context: 'قفف كاملة وباقٍ معدوم',
    emoji: '🧺',
    tone: 'emerald',
    source: SOURCE,
    illustration: { kind: 'tags', cards: [{ title: 'علب الحليب', icon: 'bottle', lines: [{ label: 'العدد', value: 1250, unit: 'علبة' }] }, { title: 'القفّة', icon: 'sack', lines: [{ label: 'فيها', value: 24, unit: 'علبة' }] }], ariaLabel: 'بطاقتان: 1250 علبة حليب، والقفّة فيها 24 علبة' },
    statement: 'جمعت جمعية خيرية 1250 علبة حليب لقفف التضامن في شهر رمضان، وتضع في كل قفّة 24 علبة. شارك في التوزيع 15 متطوّعًا.',
    data: [
      { id: 'boxes', text: 'جمعت الجمعية 1250 علبة حليب', useful: true },
      { id: 'basket', text: 'في كل قفّة 24 علبة', useful: true },
      { id: 'volunteers', text: 'شارك 15 متطوّعًا', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'القفف الكاملة',
        question: 'أجرِ القسمة الإقليدية للعدد 1250 على 24. كم قفّة كاملة؟ وكم علبة تبقى؟',
        asks: ['كم قفّة كاملة؟', 'كم علبة تبقى؟'],
        steps: [
          { kind: 'sort' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['hasr-tariqa'], prompt: 'عدد القفف الكاملة:', expected: 52,
            explain: '$24 \\times 50 = 1200$ ، $24 \\times 52 = 1248$ و $24 \\times 53 = 1272$ أكبر من 1250.' },
          { kind: 'numeric', role: 'answer', ask: 1, requires: ['qisma-taarif'], prompt: 'عدد العلب الباقية:', expected: 2,
            explain: '$1250 - 1248 = 2$ و $2 < 24$.' },
          { kind: 'solution', ask: 0, lines: [
            '$1250 = 24 \\times 52 + 2$ مع $2 < 24$.',
            '52 قفّة كاملة، وتبقى علبتان.',
          ] },
        ],
      },
      {
        label: '2)', title: 'هل 1250 مضاعف لـ 24؟',
        question: 'احصر $\\frac{1250}{24}$ بين عددين طبيعيين متتاليين. هل 1250 مضاعف للعدد 24؟',
        asks: ['الحصر', 'هل 1250 مضاعف لـ 24؟'],
        steps: [
          { kind: 'choice', role: 'conclude', ask: 0, requires: ['hasr-hasil'],
            prompt: 'حصر $\\frac{1250}{24}$ :',
            options: ['$2 < \\frac{1250}{24} < 3$', '$51 < \\frac{1250}{24} < 52$', '$52 < \\frac{1250}{24} < 53$'],
            correct: 2, cols: 1,
            explain: '$24 \\times 52 < 1250 < 24 \\times 53$ .' },
          { kind: 'choice', role: 'conclude', ask: 1, requires: ['qabiliya'],
            prompt: 'هل 1250 مضاعف للعدد 24؟',
            options: ['نعم، لأنّ 1250 عدد زوجي', 'لا، لأنّ الباقي 2 ليس معدومًا', 'نعم، لأنّ 24 أصغر من 1250'],
            correct: 1, cols: 1,
            explain: '$\\frac{1250}{24}$ ليس عددًا طبيعيًا: يقع بين 52 و 53.' },
          { kind: 'solution', ask: 0, lines: [
            '$52 < \\frac{1250}{24} < 53$ .',
            'الباقي 2 ليس معدومًا: 1250 ليس مضاعفًا للعدد 24.',
          ] },
        ],
      },
      {
        label: '3)', title: 'قفّة أخرى',
        question: 'تبرّع محسن بعلب أخرى حتى لا تبقى أيّ علبة وتمتلئ قفّة أخرى. كم علبة أضاف؟ أكمل: 24 يقسم … .',
        asks: ['كم علبة أضاف؟', 'العدد الذي يقسمه 24'],
        steps: [
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'عدد العلب المضافة:', expected: 22,
            explain: '$24 - 2 = 22$.' },
          { kind: 'numeric', role: 'answer', ask: 1, requires: ['qabiliya'], prompt: '24 يقسم العدد:', expected: 1272,
            explain: '$1250 + 22 = 1272 = 24 \\times 53$ : الباقي معدوم و $\\frac{1272}{24} = 53$ .' },
          { kind: 'solution', ask: 0, lines: [
            'أضاف المحسن $24 - 2 = 22$ علبة.',
            '$1272 = 24 \\times 53$ : 24 يقسم 1272 ، و 1272 مضاعف لـ 24 ، و $\\frac{1272}{24} = 53$ قفّة.',
          ] },
        ],
      },
    ],
  },
];

export const PROBLEM = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
