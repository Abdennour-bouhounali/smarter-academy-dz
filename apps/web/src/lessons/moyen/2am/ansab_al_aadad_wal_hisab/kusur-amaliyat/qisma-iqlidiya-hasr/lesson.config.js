/**
 * الدرس — القسمة الإقليدية وحصر حاصل القسمة (2AM, unité 2 « الكسور والعمليات عليها ») — la PREMIÈRE leçon de 2AM.
 * Manuel 2AM (الجيل الثاني, منشورات الشهاب) : أستعدّ p. 23 (items 5, 9), نشاط 1 p. 24, معارف 1 p. 26, exercice 33 p. 32.
 * Généré DANS son entrée du catalogue (même code, items 2am.m1.r04 et 2am.m1.r06), cycle moyen phase 3, 2026-10-14.
 * Le réseau : 2am.m1.r04 PROLONGE 1am.m3.r01 (leçon publiée qisma-iqlidiya-baqi) — on la RAPPELLE, on ne la reconstruit
 * pas ; ce qui est ajouté : tout diviseur, et le quotient a ÷ b encadré entre deux entiers consécutifs (2am.m1.r06).
 * Source de vérité : docs/sources/2am/unit2/extraction.json ; brief : docs/sources/2am/unit2/brief-authors.md.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/2am/ansab_al_aadad_wal_hisab/qisma-iqlidiya-hasr';

export const LESSON_CONFIG = {
  id: 'qisma-iqlidiya-hasr',
  kind: 'lesson',
  unit: 'kusur-amaliyat',
  unitTitle: 'الكسور والعمليات عليها',
  sequentialUnlock: true,
  title: 'القسمة الإقليدية وحصر حاصل القسمة',
  description: 'نقسم على أيّ عدد غير معدوم، ونكتشف أنّ حاصل القسمة a ÷ b عدد يقع بين عددين طبيعيين متتاليين: الصفائح المملوءة والصفائح اللازمة، ويقع على عدد طبيعي بالضبط عندما يكون الباقي معدومًا.',
  level: 'moyen',
  grade: '2am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان الأنشطة العددية',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🥚',
  estimatedDurationMin: 86,
  textbookRef: { unit: 2, activity: 1, pages: '23, 24, 26, 32' },
  skills: [
    'تعيين حاصل وباقي القسمة الإقليدية لعدد طبيعي على أيّ عدد طبيعي غير معدوم، وكتابة a = b × q + r مع 0 ≤ r < b',
    'حصر حاصل القسمة a ÷ b بين عددين طبيعيين متتاليين وتسمية طرفيه قيمتين مقرّبتين إلى الوحدة بالنقصان وبالزيادة',
    'التعبير عن انعدام الباقي: a يقبل القسمة على b ، a مضاعف لـ b ، b يقسم a',
  ],
  teachingScope: {
    include: ['القسمة الإقليدية على أيّ قاسم (برقم أو رقمين أو ثلاثة) وبأعداد كبيرة', 'حصر a ÷ b بين عددين طبيعيين متتاليين: q < a ÷ b < q + 1', 'القيمتان المقرّبتان إلى الوحدة بالنقصان وبالزيادة ومعناهما في مشكلة', 'الباقي المعدوم: a ÷ b عدد طبيعي، يقبل القسمة، مضاعف، يقسم'],
    exclude: ['القسمة العشرية والقيم المقرّبة إلى 0,1 أو 0,01 (الدرس التالي)', 'إعادة بناء القسمة الإقليدية بقاسم برقم أو رقمين (السنة الأولى: نتذكّرها فقط)', 'العمليات على الكسور (دروس لاحقة من الوحدة)'],
  },
  // « مسألة الدرس » : montrée dès le sommaire, résolue au module 5 (content/problems.js).
  lessonProblem: {
    module: 5,
    title: 'تعاونية البيض: 4750 بيضة',
    statement: 'جمعت تعاونية فلاحية في قرية بالمدية 4750 بيضة في يوم واحد من دواجن أعضائها، فالتعاون يجعل البيع أسهل على الجميع. توضّب التعاونية البيض في صفائح من 30 بيضة، وتنقل الشاحنة الصغيرة 40 صفيحة على الأكثر. تفتح التعاونية أبوابها على الساعة 7 صباحًا.',
    questions: [
      { label: '1)', text: 'أجرِ القسمة الإقليدية للعدد 4750 على 30. كم صفيحة مملوءة؟ وكم بيضة تبقى؟' },
      { label: '2)', text: 'احصر حاصل القسمة $\\frac{4750}{30}$ بين عددين طبيعيين متتاليين. كم صفيحة تلزم لتوضيب كل البيض؟' },
      { label: '3)', text: 'كم شاحنة صغيرة تلزم لنقل كل الصفائح؟' },
    ],
    illustration: { kind: 'tags', cards: [{ title: 'البيض', icon: 'egg', lines: [{ label: 'العدد', value: 4750, unit: 'بيضة' }] }, { title: 'الصفيحة', icon: 'crate', lines: [{ label: 'فيها', value: 30, unit: 'بيضة' }] }, { title: 'الشاحنة', icon: 'car', lines: [{ label: 'تنقل', value: 40, unit: 'صفيحة' }] }], ariaLabel: 'ثلاث بطاقات: 4750 بيضة، الصفيحة فيها 30 بيضة، والشاحنة تنقل 40 صفيحة' },
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Ce que « أستعدّ » diagnostique : les items du réseau `1am.m3.r01` (division euclidienne 1AM, leçon publiée) et
  // `2am.m1.r05` (valeurs approchées — renvoi en avant : sa base 1AM, l'approximation à l'unité), plus la fraction comme
  // quotient (manuel p. 23, items 5 et 9).
  priorKnowledge: ['qisma-iqlidiya', 'kasr-hasil-qisma', 'qima-muqarraba-wahda'],
  resources: [
    // Module 1 — WORKSPACE À DEUX NIVEAUX, un seul type `egg-trays` (la main tient a, le nombre d'œufs) :
    //   مبتدئ — le panier de سلمى : 50 œufs dessinés, des boîtes de 12 ; puis 60 (plateforme).
    //   متقدم — نشاط 1 du manuel : 2145 œufs, des plateaux de 30, la division du fils (70, reste 45) à juger ; puis 2160.
    {
      kind: 'manipulation', code: 'egg-trays-carton', type: 'egg-trays', module: 1,
      level: 'beginner',
      title: 'سلّة سلمى: علب من 12 بيضة',
      objective: 'حاصل القسمة a ÷ b يقع بين عددين طبيعيين متتاليين (المملوءة واللازمة)، ويقع على عدد طبيعي بالضبط عندما يكون الباقي معدومًا',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'farm' },
      learningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2', '2am_qisma-iqlidiya-hasr_P3'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'egg-trays-2145', type: 'egg-trays', module: 1,
      level: 'advanced',
      title: 'نشاط 1: بيض المزرعة في صفائح من 30',
      objective: 'حاصل القسمة a ÷ b يقع بين عددين طبيعيين متتاليين (المملوءة واللازمة)، ويقع على عدد طبيعي بالضبط عندما يكون الباقي معدومًا',
      autonomy: 'أعداد الكتاب الكبيرة دون رسم كل بيضة: يقدّر التلميذ بنفسه موضع الحاصل (30 × 70 = 2100) قبل التعبئة، ويعبّئ بالرزم والصفائح والبيض، ثم يحكم على قسمة ابن صاحب المزرعة',
      experience: { type: 'textbook', reason: '', theme: 'farm' },
      learningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2', '2am_qisma-iqlidiya-hasr_P3'],
      sourceElementIds: ['act-1'],
    },
    { kind: 'situation', code: 'masala-1', module: 5, title: 'مسألة الدرس — تعاونية البيض: 4750 بيضة', learningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2'] },
    { kind: 'situation', code: 'masala-2', module: 6, title: 'مسألة — حافلات الرحلة المدرسية', learningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2'] },
    { kind: 'situation', code: 'masala-3', module: 7, title: 'مسألة — قفف التضامن', learningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2', '2am_qisma-iqlidiya-hasr_P3'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: صحيح أم خاطئ؟ القسمة الإقليدية، الكسر حاصل قسمة، والقيمة المقرّبة إلى الوحدة.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 7, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 1 — بيض المزرعة', desc: 'أين يقع حاصل القسمة على مسطرة الصفائح؟ ضع إطارك، ثم عبّئ.',
      stage: 'trigger', teachesLearningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 15, difficulty: 2, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — القسمة الإقليدية وحصر الحاصل', desc: 'التعريف مع 0 ≤ r < b، الباقي المعدوم، والقيمتان المقرّبتان إلى الوحدة.',
      stage: 'discovery', teachesLearningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2', '2am_qisma-iqlidiya-hasr_P3'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'tariqa', path: `${LESSON_BASE_PATH}/tariqa`,
      title: 'طريقة — أحصر حاصل قسمة كبيرة', desc: 'بالمضاعفات 10 و 100 أقترب من الحاصل دون آلة حاسبة.',
      stage: 'formalization', teachesLearningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2'],
      color: 'sky', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أتعلّم الطريقة' },
    { id: '04', number: 4, slug: 'atamarran', path: `${LESSON_BASE_PATH}/atamarran`,
      title: 'أتمرّن', desc: 'تمرين الكتاب 33 وتمارين على منوال اختبارات الفصل الأول.',
      stage: 'practice_lab', teachesLearningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2', '2am_qisma-iqlidiya-hasr_P3'],
      color: 'amber', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — تعاونية البيض', desc: 'مسألة الدرس: 4750 بيضة، صفائح من 30، وشاحنات من 40 صفيحة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — حافلات الرحلة', desc: 'كم حافلة مملوءة؟ وكم حافلة تلزم؟ وكم مقعدًا يبقى شاغرًا؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — قفف التضامن', desc: 'قفف كاملة، علب باقية، وكم علبة تجعل الباقي معدومًا.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['2am_qisma-iqlidiya-hasr_P1', '2am_qisma-iqlidiya-hasr_P2', '2am_qisma-iqlidiya-hasr_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم الكفاءات الثلاث.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
