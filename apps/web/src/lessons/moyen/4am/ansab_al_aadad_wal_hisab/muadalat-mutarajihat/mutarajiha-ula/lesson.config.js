/**
 * الدرس 3 — المتراجحات من الدرجة الأولى بمجهول واحد وتمثيل حلولها بيانيًا
 * Unité 4 du manuel (4AM) : نشاط 3 (p. 45 : « المتراجحة وحلولها » et « حل متراجحة »),
 * معارف 3 et 4 (p. 48), طرائق p. 49 (حل متراجحة, دوري الآن 1), exercices 21–29, 31,
 * 32 (p. 51), « أستعدّ » items 6–11 (p. 43), QCM 5–9 (p. 52), puis trois « مسائل » de la plateforme (modules 6–8).
 * Source de vérité : docs/sources/4am/unit4/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/mutarajiha-ula';

export const LESSON_CONFIG = {
  id: 'mutarajiha-ula',
  kind: 'lesson',
  unit: 'muadalat-mutarajihat',
  unitTitle: 'معادلات ومتراجحات من الدرجة الأولى بمجهول واحد',
  sequentialUnlock: true,
  title: 'المتراجحات من الدرجة الأولى بمجهول واحد وتمثيل حلولها بيانيًا',
  description: 'متى تكون متباينةٌ بمجهول صحيحة؟ نختبر قيمًا لـ x، نحلّ المتراجحة بقواعد المتباينات — ونغيّر الاتجاه عند الضرب أو القسمة على عدد سالب — ثم نمثّل حلولها على مستقيم مدرّج.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '📏',
  estimatedDurationMin: 60,
  textbookRef: { unit: 4, activity: 3, pages: '43, 45, 48, 49, 51, 52' },
  skills: [
    'التمييز بين متباينة (عددية، صحيحة أو خاطئة) ومتراجحة ذات مجهول x',
    'اختبار ما إذا كان عدد معطى حلًّا لمتراجحة بتعويض x',
    'حل متراجحة من الدرجة الأولى بمجهول واحد بقواعد المتباينات: نحافظ على الاتجاه بإضافة عدد أو طرحه أو بالضرب أو القسمة على عدد موجب، ونغيّره بالضرب أو القسمة على عدد سالب',
    'تمثيل حلول متراجحة على مستقيم مدرّج: الجزء الملوّن بالأحمر، والرمز موجّه نحوه إذا كان الحدّ حلًّا وبعيدًا عنه إذا لم يكن',
  ],
  teachingScope: {
    include: [
      'المتراجحة وحلولها (نشاط 3: رسائل يونس، و معارف 3)',
      'المتراجحة من الدرجة الأولى: الأشكال ax + b < cx + d ، ax + b > cx + d ، ax + b ≤ cx + d ، ax + b ≥ cx + d',
      'قواعد الحل الثلاث (معارف 3) وطريقة الكتاب ص 49، ودوري الآن 1',
      'التمثيل البياني لحلول متراجحة على مستقيم مدرّج (معارف 4): الجزء الملوّن بالأحمر واتجاه الرمز',
      'تمارين أوظّف تعلّماتي 21 ← 29، 31 و 32، وأسئلة أؤكّد تعلّماتي 5 ← 9',
    ],
    exclude: [
      'حل المعادلات من الدرجة الأولى (الدرس 1) — يُستعمل ولا يُدرَّس هنا',
      'ترييض مشكلة بمتراجحة (الدرس 4، تمرين 30 و 33)',
      'جمل المتراجحات وكتابة المجالات بالرموز (غير مبرمجة في المتوسط)',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : comparer / tester une متباينة pour une valeur,
  // les opérations sur les متباينات (années précédentes — items 6–11 du manuel), le
  // repérage sur un مستقيم مدرّج (années précédentes) et la résolution d'une معادلة
  // (leçon 1 de l'unité, prérequis du catalogue).
  priorKnowledge: ['muqarana-adad', 'amaliyat-mutabayinat', 'mustaqim-mudarraj', 'hal-muadala'],
  // « مسألة الدرس » (MASAIL_GENERATION_GUIDE.md) : l'énoncé de la مسألة 1, montré au sommaire et à
  // la fin du module 1 ; le monde du laboratoire solution-ray (un رصيد de téléphone), avec la
  // division par un nombre négatif de l'atelier متقدم. Résolue au module 6.
  lessonProblem: {
    module: 6,
    title: 'رصيد رياض: كم رسالة دون أن ينزل الرصيد تحت 200 دج؟',
    statement: 'شحن رياض رصيد هاتفه النقّال بـ 600 دج. اشترى هاتفه قبل سنة بـ 18500 دج، وفي قائمة أصدقائه 45 اسمًا. يقتطع المتعامل من الرصيد 120 دج مقابل باقة أنترنت أسبوعية، ثم 3 دج عن كل رسالة قصيرة يرسلها رياض. يريد رياض أن يبقى في رصيده 200 دج على الأقل لمكالمات الطوارئ. نرمز بـ $x$ إلى عدد الرسائل القصيرة التي يرسلها.',
  },
  resources: [
    // Module 1 : la situation du manuel (رسائل يونس) posée UNE fois, sur ses nombres —
    // 2,5x + 100 ≤ 150, x entier (un nombre de messages). Pas d'atelier à deux niveaux :
    // la question est « quels x conviennent ? », et la paire du type est au module 2.
    {
      kind: 'manipulation', code: 'solution-ray-younes', type: 'solution-ray', module: 1,
      title: 'رصيد يونس: كم رسالة يمكنه أن يرسل؟',
      learningPointIds: ['4am_mutarajiha-ula_P1'],
      sourceElementIds: ['act-3a'],
    },
    // Module 2 : l'atelier à deux niveaux. مبتدئ = la première ligne du tableau du
    // نشاط 3 (x < 3 : la borne se lit, le crochet est à décider) ; متقدم = l'inéquation
    // du نشاط 3 (−3x + 5 ≤ 20), transformée carte par carte au-dessus des traces.
    {
      kind: 'manipulation', code: 'solution-ray-x-3', type: 'solution-ray', module: 2,
      level: 'beginner',
      title: 'المتراجحة x < 3 : أين الحلول، وإلى أين يتّجه الرمز؟',
      objective: 'حلول متراجحة من الدرجة الأولى نصف مستقيم يحدّه عدد: نختبر القيم، ونمثّلها بالجزء الملوّن بالأحمر والرمز موجّه نحوه إذا كان الحدّ حلًّا',
      autonomy: '',
      experience: { type: 'textbook', reason: '', theme: 'abstract' },
      learningPointIds: ['4am_mutarajiha-ula_P1', '4am_mutarajiha-ula_P3'],
      sourceElementIds: ['act-3b'],
    },
    {
      kind: 'manipulation', code: 'solution-ray-3x-5-20', type: 'solution-ray', module: 2,
      level: 'advanced',
      title: 'المتراجحة −3x + 5 ≤ 20 : حلّها خطوة خطوة فوق نقاطك',
      objective: 'حلول متراجحة من الدرجة الأولى نصف مستقيم يحدّه عدد: نختبر القيم، ونمثّلها بالجزء الملوّن بالأحمر والرمز موجّه نحوه إذا كان الحدّ حلًّا',
      autonomy: 'الحدّ لا يُقرأ في المتراجحة: التلميذ يجده بتجاربه، ثم يحوّل المتراجحة بنفسه — يختار العملية واتجاه كل سطر جديد، والمختبر يرفض كل اتجاه يناقض نقاطه الحمراء حتى يكتشف أنّ القسمة على −3 تغيّر الاتجاه',
      experience: { type: 'textbook', reason: '', theme: 'abstract' },
      learningPointIds: ['4am_mutarajiha-ula_P2', '4am_mutarajiha-ula_P3'],
      sourceElementIds: ['act-3b'],
    },
    { kind: 'situation', code: 'masala-1', module: 6, title: 'مسألة الدرس — رصيد رياض: 600 دج ورسائل بـ 3 دج', learningPointIds: ['4am_mutarajiha-ula_P1', '4am_mutarajiha-ula_P2', '4am_mutarajiha-ula_P3'] },
    { kind: 'situation', code: 'masala-2', module: 7, title: 'مسألة — نادي اللياقة البدنية: بطاقة شهرية أم دفع عن كل حصة؟', learningPointIds: ['4am_mutarajiha-ula_P1', '4am_mutarajiha-ula_P2'] },
    { kind: 'situation', code: 'masala-3', module: 8, title: 'مسألة — كراء سيارة: مسافة غير محدودة أم ثمن للكيلومتر؟', learningPointIds: ['4am_mutarajiha-ula_P1', '4am_mutarajiha-ula_P2', '4am_mutarajiha-ula_P3'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'عشر عبارات: اختبار متباينة من أجل قيمة، العمليات على المتباينات، المستقيم المدرّج وحل معادلة. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'rasail-yunus', path: `${LESSON_BASE_PATH}/rasail-yunus`,
      title: 'نشاط 3 — رسائل يونس', desc: 'رصيد 150DA، والرسالة بـ 2,5DA بعد اقتطاع 100DA: جرّب أعدادًا من الرسائل، ثم سمِّ المتراجحة وحلولها كما يسمّيها الكتاب.',
      stage: 'trigger', teachesLearningPointIds: ['4am_mutarajiha-ula_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 9, difficulty: 1, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'hal-mutarajiha', path: `${LESSON_BASE_PATH}/hal-mutarajiha`,
      title: 'نشاط 3 — حل متراجحة وتمثيل حلولها', desc: 'المسبار على المستقيم المدرّج يترك نقاطًا حمراء حيث المتباينة صحيحة؛ ثم تحويل −3x + 5 ≤ 20 خطوة خطوة: متى يتغيّر الاتجاه؟',
      stage: 'discovery', teachesLearningPointIds: ['4am_mutarajiha-ula_P2', '4am_mutarajiha-ula_P3'],
      color: 'violet', style: 'featured', estimatedMin: 11, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — المتراجحات وتمثيل حلولها', desc: 'تعريف المتراجحة وحلولها، المتراجحة من الدرجة الأولى، القواعد الثلاث، والتمثيل البياني بالجزء الملوّن بالأحمر — بأمثلة الكتاب.',
      stage: 'formalization', teachesLearningPointIds: ['4am_mutarajiha-ula_P1', '4am_mutarajiha-ula_P2', '4am_mutarajiha-ula_P3'],
      color: 'sky', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أتعلّم' },
    { id: '04', number: 4, slug: 'tarayiq', path: `${LESSON_BASE_PATH}/tarayiq`,
      title: 'طرائق — حل متراجحة', desc: 'حلّا الكتاب سطرًا سطرًا ($-7x + 1 < x - 3$ والكسران)، والتمثيل البياني لكل حل، ثم دوري الآن.',
      stage: 'formalization', teachesLearningPointIds: ['4am_mutarajiha-ula_P2', '4am_mutarajiha-ula_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أتعلّم الطريقة' },
    { id: '05', number: 5, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 21 ← 29، 31 و 32، وسؤالا أؤكّد تعلّماتي 5 و 7 (لكلٍّ منهما إجابتان صحيحتان).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_mutarajiha-ula_P1', '4am_mutarajiha-ula_P2', '4am_mutarajiha-ula_P3'],
      color: 'amber', style: 'featured', estimatedMin: 11, difficulty: 3, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '06', number: 6, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — رصيد رياض', desc: 'مسألة الدرس: رصيد 600 دج وحدّ أدنى 200 دج. نقسم على عدد سالب، نمثّل الحلول، ثم أكبر عدد من الرسائل.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_mutarajiha-ula_P1', '4am_mutarajiha-ula_P2', '4am_mutarajiha-ula_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — نادي اللياقة البدنية', desc: 'بطاقة شهرية أم دفع عن كل حصة؟ ابتداءً من كم حصة تصبح البطاقة أقلّ كلفة؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_mutarajiha-ula_P1', '4am_mutarajiha-ula_P2'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — كراء سيارة', desc: 'مسافة غير محدودة أم ثمن للكيلومتر؟ نحلّ متراجحة ونمثّل حلولها، ثم نختار الصيغة لكل يوم.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_mutarajiha-ula_P1', '4am_mutarajiha-ula_P2', '4am_mutarajiha-ula_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '09', number: 9, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ستة أسئلة تُقيّم الكفاءات الثلاث، منها ثلاثة من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
