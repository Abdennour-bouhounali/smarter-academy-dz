/**
 * Les trois « مسائل » du درس « القسمة الإقليدية » (modules 5, 6, 7) — exercices COMPLETS de type اختبار الفصل, résolus
 * pas à pas (GuidedProblem). AJOUTS DE LA PLATEFORME (`addition('exam_style_problem')`). Périmètre : la division
 * euclidienne, a = b × q + r avec r < b, le sens de q et de r dans une situation (groupes complets, ce qui reste, le groupe
 * de plus qu'il faut) — jamais les critères de divisibilité (leçon suivante) ni la division décimale.
 * La مسألة 1 est « مسألة الدرس » (`LESSON_CONFIG.lessonProblem`) ; chaque nombre est vérifié dans ./problems.test.js.
 */
import { addition } from '../../_unit/unitMeta.js';
import { LESSON_CONFIG } from '../lesson.config.js';

const SOURCE = addition('exam_style_problem');

export const PROBLEMS = [
  {
    id: 'masala-1',
    title: 'مسألة 1 — بائع الزهور',
    context: LESSON_CONFIG.lessonProblem.title,
    headline: 'مسألة الدرس',
    emoji: '💐',
    tone: 'rose',
    source: SOURCE,
    illustration: LESSON_CONFIG.lessonProblem.illustration,
    statement: LESSON_CONFIG.lessonProblem.statement,
    data: [
      { id: 'flowers', text: 'حضّر البائع 350 زهرة', useful: true },
      { id: 'size', text: 'في كل باقة 16 زهرة', useful: true },
      { id: 'price', text: 'ثمن الباقة الواحدة 450 دج', useful: true },
      { id: 'hour', text: 'يفتح المحلّ على الساعة 8 صباحًا', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'الباقات الكاملة',
        question: LESSON_CONFIG.lessonProblem.questions[0].text,
        asks: ['كم باقة كاملة يشكّل البائع؟', 'كم زهرة تبقى؟'],
        steps: [
          { kind: 'sort' },
          { kind: 'choice', role: 'translate', requires: ['qisma-iqlidiya'],
            prompt: 'عدد الباقات الكاملة هو:',
            options: ['حاصل القسمة الإقليدية لـ 350 على 16', 'باقي القسمة الإقليدية لـ 350 على 16', 'الجداء $350 \\times 16$'],
            correct: 0,
            explain: 'نبحث كم مرّة 16 في 350: هذا هو الحاصل.' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['qisma-amudiya'],
            prompt: 'عدد الباقات الكاملة:', expected: 21,
            explain: '$16 \\times 21 = 336$ و $16 \\times 22 = 352$ أكبر من 350.' },
          { kind: 'numeric', role: 'answer', ask: 1, requires: ['qisma-iqlidiya'],
            prompt: 'عدد الأزهار الباقية:', expected: 14,
            explain: '$350 - 336 = 14$ ، و $14 < 16$.' },
          { kind: 'solution', ask: 0, lines: [
            '$350 = 16 \\times 21 + 14$ مع $14 < 16$.',
            'يشكّل البائع 21 باقة كاملة، وتبقى 14 زهرة.',
          ] },
        ],
      },
      {
        label: '2)', title: 'باقة أخرى',
        question: LESSON_CONFIG.lessonProblem.questions[1].text,
        asks: ['كم زهرة يضيف على الأقل؟', 'كم باقة يصبح عنده؟'],
        steps: [
          { kind: 'choice', role: 'translate', requires: ['qisma-iqlidiya'],
            prompt: 'لتشكيل باقة أخرى من الأزهار الباقية، يجب أن يصبح عددها:',
            options: ['16 زهرة', '14 زهرة', '0 زهرة'],
            correct: 0,
            explain: 'الباقة الكاملة فيها 16 زهرة، والأزهار الباقية لا تكفي لها.' },
          { kind: 'numeric', role: 'answer', ask: 0,
            prompt: 'عدد الأزهار التي يضيفها على الأقل:', expected: 2,
            explain: '$16 - 14 = 2$.' },
          { kind: 'numeric', role: 'answer', ask: 1,
            prompt: 'عدد الباقات عندئذ:', expected: 22,
            explain: '$350 + 2 = 352 = 16 \\times 22$ : لا يبقى شيء.' },
          { kind: 'solution', ask: 0, lines: [
            'تنقص الأزهار الباقية $16 - 14 = 2$ زهرتان لتكوّن باقة.',
            'بإضافة زهرتين: $352 = 16 \\times 22 + 0$ ، أي 22 باقة دون أن تبقى أيّ زهرة.',
          ] },
        ],
      },
      {
        label: '3)', title: 'ثمن الباقات',
        question: LESSON_CONFIG.lessonProblem.questions[2].text,
        asks: ['ما المبلغ الذي تحصّل عليه؟'],
        steps: [
          { kind: 'choice', role: 'translate',
            prompt: 'أيّ عملية تعطي المبلغ؟',
            options: ['$22 \\times 450$', '$21 \\times 450$', '$352 \\times 450$'],
            correct: 0, cols: 3,
            explain: 'باع البائع كل الباقات، وهي 22 باقة بعد الإضافة، والباقة بـ 450 دج.' },
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'المبلغ:', expected: 9900, suffix: 'دج',
            explain: '$22 \\times 450 = 9900$.' },
          { kind: 'solution', lines: [
            'عدد الباقات المباعة 22 ، وثمن الباقة 450 دج.',
            'المبلغ: $22 \\times 450 = 9900$ ، أي 9900 دج.',
          ] },
        ],
      },
    ],
  },
  {
    id: 'masala-2',
    title: 'مسألة 2 — حافلات المخيّم',
    context: 'كم حافلة نحتاج؟',
    emoji: '🚌',
    tone: 'sky',
    source: SOURCE,
    illustration: { kind: 'scene', icon: 'bus', bg: 'blue', chips: [{ label: 'كشّافون', value: 248, tone: 'blue' }, { label: 'قادة مرافقون', value: 13, tone: 'green' }, { label: 'مقاعد الحافلة', value: 45, tone: 'amber' }, { label: 'كراء الحافلة', value: 9500, unit: 'دج', tone: 'rose' }], ariaLabel: 'حافلة: 248 كشّافًا و 13 قائدًا، في كل حافلة 45 مقعدًا وكراؤها 9500 دج' },
    statement: 'نظّم فوج كشفي مخيّمًا صيفيًا للتعاون وخدمة البيئة، شارك فيه 248 كشّافًا و 13 قائدًا مرافقًا. استأجر الفوج حافلات في كل منها 45 مقعدًا، وثمن كراء الحافلة الواحدة 9500 دج. يدوم المخيّم 12 يومًا.',
    data: [
      { id: 'scouts', text: 'شارك 248 كشّافًا', useful: true },
      { id: 'leaders', text: 'رافقهم 13 قائدًا', useful: true },
      { id: 'seats', text: 'في كل حافلة 45 مقعدًا', useful: true },
      { id: 'rent', text: 'كراء الحافلة الواحدة 9500 دج', useful: true },
      { id: 'days', text: 'يدوم المخيّم 12 يومًا', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'كم مشاركًا؟',
        question: 'احسب عدد المشاركين في المخيّم، ثم أجرِ القسمة الإقليدية لهذا العدد على 45.',
        asks: ['عدد المشاركين'],
        steps: [
          { kind: 'sort' },
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'عدد المشاركين:', expected: 261,
            explain: '$248 + 13 = 261$.' },
          { kind: 'numeric', role: 'compute', requires: ['qisma-amudiya'], prompt: 'حاصل القسمة الإقليدية لعدد المشاركين على 45:', expected: 5,
            explain: '$45 \\times 5 = 225$ و $45 \\times 6 = 270$ أكبر من 261.' },
          { kind: 'numeric', role: 'compute', requires: ['qisma-iqlidiya'], prompt: 'باقي هذه القسمة:', expected: 36,
            explain: '$261 - 225 = 36$ ، و $36 < 45$.' },
          { kind: 'solution', ask: 0, lines: [
            'عدد المشاركين: $248 + 13 = 261$.',
            '$261 = 45 \\times 5 + 36$ مع $36 < 45$.',
          ] },
        ],
      },
      {
        label: '2)', title: 'كم حافلة؟',
        question: 'كم حافلة يجب أن يستأجر الفوج ليركب كل المشاركين؟ وكم مقعدًا يبقى شاغرًا؟',
        asks: ['كم حافلة يجب أن يستأجر الفوج؟', 'كم مقعدًا يبقى شاغرًا؟'],
        steps: [
          { kind: 'choice', role: 'conclude', requires: ['qisma-iqlidiya'],
            prompt: 'ماذا يعني الباقي في هذه الوضعية؟',
            options: ['مشاركون لا يجدون مكانًا في الحافلات الكاملة: تلزم حافلة أخرى', 'مشاركون يبقون في المتوسطة', 'عدد الحافلات اللازمة'],
            correct: 0,
            explain: 'الحافلات الخمس تمتلئ، والباقون يحتاجون حافلة سادسة لا تمتلئ.' },
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'عدد الحافلات:', expected: 6,
            explain: '$5 + 1 = 6$.' },
          { kind: 'numeric', role: 'answer', ask: 1, prompt: 'عدد المقاعد الشاغرة:', expected: 9,
            explain: '$45 - 36 = 9$ ، أو $45 \\times 6 - 261 = 270 - 261 = 9$.' },
          { kind: 'solution', ask: 0, lines: [
            'الباقي 36 ليس معدومًا: 5 حافلات لا تكفي، ويركب 36 مشاركًا حافلة سادسة.',
            'يستأجر الفوج 6 حافلات، ويبقى $45 - 36 = 9$ مقاعد شاغرة.',
          ] },
        ],
      },
      {
        label: '3)', title: 'ثمن الكراء',
        question: 'ما المبلغ الذي يدفعه الفوج لكراء الحافلات؟',
        asks: ['ما المبلغ الذي يدفعه الفوج؟'],
        steps: [
          { kind: 'choice', role: 'translate',
            prompt: 'أيّ عملية تعطي المبلغ؟',
            options: ['$6 \\times 9500$', '$5 \\times 9500$', '$261 \\times 9500$'],
            correct: 0, cols: 3,
            explain: 'يستأجر الفوج 6 حافلات، وكراء الحافلة 9500 دج.' },
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'المبلغ:', expected: 57000, suffix: 'دج',
            explain: '$6 \\times 9500 = 57000$.' },
          { kind: 'solution', lines: [
            'عدد الحافلات 6 ، وكراء الحافلة 9500 دج.',
            'المبلغ: $6 \\times 9500 = 57000$ ، أي 57000 دج.',
          ] },
        ],
      },
    ],
  },
  {
    id: 'masala-3',
    title: 'مسألة 3 — حملة التشجير',
    context: 'أسابيع وأيام، صفوف وشجيرات',
    emoji: '🌳',
    tone: 'emerald',
    source: SOURCE,
    illustration: { kind: 'timeline', icon: 'plant', title: 'حملة تشجير تبدأ يوم الأحد', marks: [{ label: 'مدّة الحملة', value: 75, unit: 'يومًا' }, { label: 'شجيرات كل يوم', value: 13 }, { label: 'شجيرات كل صف', value: 24 }], ariaLabel: 'حملة تشجير تبدأ يوم الأحد وتدوم 75 يومًا، يُغرس فيها 13 شجيرة كل يوم وتُرتّب في صفوف من 24' },
    statement: 'نظّمت جمعية حيّ حملة تطوّعية للتشجير، حبًّا للوطن وحفاظًا على البيئة. تدوم الحملة 75 يومًا، وتبدأ يوم الأحد. يغرس المتطوّعون 13 شجيرة كل يوم، وعددهم 27 متطوّعًا. تُرتّب الشجيرات في صفوف، في كل صف 24 شجيرة.',
    data: [
      { id: 'days', text: 'تدوم الحملة 75 يومًا', useful: true },
      { id: 'start', text: 'تبدأ الحملة يوم الأحد', useful: true },
      { id: 'perday', text: 'يغرس المتطوّعون 13 شجيرة كل يوم', useful: true },
      { id: 'row', text: 'في كل صف 24 شجيرة', useful: true },
      { id: 'volunteers', text: 'عدد المتطوّعين 27', useful: false },
    ],
    parts: [
      {
        label: '1)', title: 'أسابيع الحملة',
        question: 'أجرِ القسمة الإقليدية للعدد 75 على 7. كم أسبوعًا كاملًا تدوم الحملة؟ وكم يومًا زائدًا؟',
        asks: ['كم أسبوعًا كاملًا؟', 'كم يومًا زائدًا؟'],
        steps: [
          { kind: 'sort' },
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['qisma-amudiya'], prompt: 'عدد الأسابيع الكاملة:', expected: 10,
            explain: '$7 \\times 10 = 70$ و $7 \\times 11 = 77$ أكبر من 75.' },
          { kind: 'numeric', role: 'answer', ask: 1, requires: ['qisma-iqlidiya'], prompt: 'عدد الأيام الزائدة:', expected: 5,
            explain: '$75 - 70 = 5$ و $5 < 7$.' },
          { kind: 'solution', ask: 0, lines: [
            '$75 = 7 \\times 10 + 5$ مع $5 < 7$.',
            'تدوم الحملة 10 أسابيع كاملة و 5 أيام.',
          ] },
        ],
      },
      {
        label: '2)', title: 'الشجيرات المغروسة',
        question: 'احسب عدد الشجيرات المغروسة خلال الحملة.',
        asks: ['عدد الشجيرات المغروسة'],
        steps: [
          { kind: 'choice', role: 'translate',
            prompt: 'أيّ عملية تعطي عدد الشجيرات؟',
            options: ['$75 \\times 13$', '$75 + 13$', '$13 \\times 7$'],
            correct: 0, cols: 3,
            explain: 'يتكرّر غرس 13 شجيرة كل يوم من الأيام الـ 75.' },
          { kind: 'numeric', role: 'answer', ask: 0, prompt: 'عدد الشجيرات:', expected: 975,
            explain: '$75 \\times 13 = 975$.' },
          { kind: 'solution', lines: [
            'يُغرس كل يوم 13 شجيرة خلال 75 يومًا.',
            'عدد الشجيرات: $75 \\times 13 = 975$.',
          ] },
        ],
      },
      {
        label: '3)', title: 'صفوف الشجيرات',
        question: 'كم صفًّا كاملًا من 24 شجيرة نحصل عليه؟ وكم شجيرة في الصف الأخير غير المكتمل؟ عبّر عن ذلك بمساواة.',
        asks: ['كم صفًّا كاملًا؟', 'كم شجيرة في الصف الأخير؟', 'المساواة'],
        steps: [
          { kind: 'numeric', role: 'answer', ask: 0, requires: ['qisma-amudiya'], prompt: 'عدد الصفوف الكاملة:', expected: 40,
            explain: '$24 \\times 40 = 960$ و $24 \\times 41 = 984$ أكبر من 975.' },
          { kind: 'numeric', role: 'answer', ask: 1, requires: ['qisma-iqlidiya'], prompt: 'عدد الشجيرات في الصف الأخير:', expected: 15,
            explain: '$975 - 960 = 15$ و $15 < 24$.' },
          { kind: 'choice', role: 'conclude', ask: 2, requires: ['qisma-mufradat'],
            prompt: 'أيّ مساواة تعبّر عن هذه القسمة الإقليدية؟',
            options: ['$975 = 24 \\times 40 + 15$', '$975 = 24 \\times 39 + 39$', '$975 = 40 \\times 24 + 39$'],
            correct: 0, cols: 1,
            explain: 'الباقي 15 أصغر من 24 ؛ في المساواة الثانية الباقي 39 أكبر من 24 ، والثالثة خاطئة حسابيًا.' },
          { kind: 'solution', ask: 0, lines: [
            '$975 = 24 \\times 40 + 15$ مع $15 < 24$.',
            'نحصل على 40 صفًّا كاملًا، وفي الصف الأخير 15 شجيرة.',
          ] },
        ],
      },
    ],
  },
];

export const PROBLEM = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
