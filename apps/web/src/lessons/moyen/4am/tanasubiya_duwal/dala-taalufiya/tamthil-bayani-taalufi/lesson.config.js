/**
 * الدرس 2 — التمثيل البياني لدالة تآلفية وقراءته بيانيًا
 * Unité 7 du manuel (4AM), pp. 77–78 : « أستعدّ » items 6, 7 أ, 7 ب (p. 77), نشاط 3 (p. 78).
 * Source de vérité : docs/sources/4am/unit7/extraction.json. Le manuel fourni n'a ni معارف ni طرائق ni
 * exercices : la formalisation, les méthodes et les exercices sont des AJOUTS déclarés de la plateforme.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/tanasubiya_duwal/tamthil-bayani-taalufi';

export const LESSON_CONFIG = {
  id: 'tamthil-bayani-taalufi',
  kind: 'lesson',
  unit: 'dala-taalufiya',
  unitTitle: 'الدالة التآلفية',
  sequentialUnlock: true,
  title: 'التمثيل البياني لدالة تآلفية وقراءته بيانيًا',
  description: 'التمثيل البياني لدالة تآلفية مستقيم يقطع محور التراتيب في النقطة $(0 ; b)$ : إنشاؤه بنقطتين، تعيين المعاملين $a$ (معامل التوجيه) و $b$ (الترتيب عند المبدأ) انطلاقا من التمثيل البياني، والقراءة البيانية لصورة عدد أو للعدد الذي عُلمت صورته.',
  level: 'moyen',
  grade: '4am',
  chapter: 'tanasubiya_duwal',
  chapterTitle: 'ميدان التناسبية والدوال',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '📈',
  estimatedDurationMin: 50,
  textbookRef: { unit: 7, activity: 3, pages: '77, 78' },
  skills: [
    'إنشاء التمثيل البياني لدالة تآلفية: مستقيم لا يشمل المبدأ في الحالة العامة، تكفي نقطتان لرسمه',
    'معرفة أنّ النقطة $(0 ; b)$ تنتمي إلى تمثيل الدالة $x \\longmapsto ax + b$ (الترتيب عند المبدأ)',
    'قراءة $b$ و $a$ (معامل التوجيه) على التمثيل البياني وكتابة $f(x)$',
    'القراءة البيانية لصورة عدد وللعدد الذي علمت صورته',
  ],
  teachingScope: {
    include: [
      'أستعدّ (ص 77): البنود 6 و 7 أ و 7 ب — تمثيل دالة خطية وقراءته',
      'نشاط 3 (ص 78): $(d)$ تمثيل $g(x) = \\dfrac{3}{2}x$ و $(d\')$ تمثيل $f(x) = \\dfrac{3}{2}x + 1$ ، النقطة $(0 ; 1)$ (مصحّحة) ثم $(0 ; b)$ ، الترتيب عند المبدأ',
      'معارف من المنصّة: التمثيل البياني لدالة تآلفية، معامل التوجيه والترتيب عند المبدأ، المنحى وإشارة $a$ ، الحالة $b = 0$',
      'طرائق من المنصّة: الرسم بنقطتين، قراءة $a$ و $b$ ، قراءة صورة عدد والعدد الذي علمت صورته',
    ],
    exclude: [
      'تعريف الدالة التآلفية وحساب الصور والسوابق جبريا (الدرس 1)',
      'تعيين دالة تآلفية من عددين وصورتيهما وتناسب التغيّرات (الدرس 3)',
      'التفسير البياني لحل جملة معادلتين (الدرس 4)',
    ],
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : تمثيل دالة خطية (البند 6، الدرس 3 من الوحدة 6), قراءة دالة خطية
  // على تمثيلها (البند 7), تعليم نقطة (السنوات السابقة), صورة عدد بدالة تآلفية (الدرس 1 من هذه الوحدة).
  priorKnowledge: ['tamthil-khatti', 'qiraa-khatti', 'talim-nuqta', 'notation-fx'],
  resources: [
    // Module 1 : LA DROITE QUI A QUITTÉ L'ORIGINE (affine-line). مبتدئ = x ⟼ ½x montée de 2 (plateforme) ;
    // متقدم = le نشاط 3 (ouvert par défaut : c'est l'activité du module), puis une seconde rampe à lire.
    {
      kind: 'manipulation', code: 'affine-line-shift-1-2', type: 'affine-line', module: 1,
      level: 'beginner',
      title: 'منحدر أوّل: $x \\longmapsto \\dfrac{1}{2}x$ يصعد بـ 2',
      objective: 'التمثيل البياني للدالة التآلفية $x \\longmapsto ax + b$ هو تمثيل الدالة الخطية $x \\longmapsto ax$ مرفوعًا بـ $b$ : مستقيم يوازيه ويقطع محور التراتيب في $(0 ; b)$',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'ramp' },
      learningPointIds: ['4am_tamthil-bayani-taalufi_P1'],
      sourceElementIds: ['act-3'],
    },
    {
      kind: 'manipulation', code: 'affine-line-act-3', type: 'affine-line', module: 1,
      level: 'advanced',
      title: 'نشاط 3: من $(d)$ إلى $(d\')$',
      objective: 'التمثيل البياني للدالة التآلفية $x \\longmapsto ax + b$ هو تمثيل الدالة الخطية $x \\longmapsto ax$ مرفوعًا بـ $b$ : مستقيم يوازيه ويقطع محور التراتيب في $(0 ; b)$',
      autonomy: 'معاملات كسرية ($\\dfrac{3}{2}$) ثم مختبر ثانٍ يفتحه التلميذ: مستقيم عبارته مخفية يجب أن يقرأ عليه بنفسه $b$ و $a$ (درجة تنزل) بضبط مقبضين، دون أي اقتراح',
      experience: { type: 'textbook', reason: '', theme: 'ramp' },
      learningPointIds: ['4am_tamthil-bayani-taalufi_P1', '4am_tamthil-bayani-taalufi_P2'],
      sourceElementIds: ['act-3'],
    },
    // Module 2 (معارف) : le lab en tracé, posé seul — deux points suffisent, O refusé.
    {
      kind: 'manipulation', code: 'affine-line-draw-2-3', type: 'affine-line', module: 2,
      title: 'نرسم تمثيل $f(x) = 2x - 3$ بنقطتين',
      learningPointIds: ['4am_tamthil-bayani-taalufi_P1'],
    },
    // Module 3 (القراءة البيانية) : lire a et b, puis une image et un antécédent.
    {
      kind: 'manipulation', code: 'affine-line-identify-3-2', type: 'affine-line', module: 3,
      title: 'اقرأ $a$ و $b$ على المستقيم $(D)$',
      learningPointIds: ['4am_tamthil-bayani-taalufi_P2'],
    },
    {
      kind: 'manipulation', code: 'affine-line-read-4-4', type: 'affine-line', module: 3,
      title: 'صورة 4، والعدد الذي صورته 4',
      learningPointIds: ['4am_tamthil-bayani-taalufi_P3'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'البنود 6 و 7 من أستعدّ في الكتاب وثلاث عبارات من المنصّة: تمثيل دالة خطية وقراءته، إحداثيات نقطة، وصورة عدد بدالة تآلفية. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 3 — المستقيم الذي غادر المبدأ', desc: 'ارفع تمثيل الدالة الخطية $x \\longmapsto \\dfrac{3}{2}x$ حتى يصير تمثيل $x \\longmapsto \\dfrac{3}{2}x + 1$ ، وقارن ترتيبَي نقطتين لهما نفس الفاصلة: ما هو الترتيب عند المبدأ؟',
      stage: 'trigger', teachesLearningPointIds: ['4am_tamthil-bayani-taalufi_P1', '4am_tamthil-bayani-taalufi_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أرفع المستقيم' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — المستقيم الذي يمثّل دالة تآلفية', desc: 'التمثيل البياني لدالة تآلفية، معامل التوجيه والترتيب عند المبدأ، منحى المستقيم، ورسمه بنقطتين.',
      stage: 'discovery', teachesLearningPointIds: ['4am_tamthil-bayani-taalufi_P1', '4am_tamthil-bayani-taalufi_P2'],
      color: 'violet', style: 'featured', estimatedMin: 11, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'qiraa', path: `${LESSON_BASE_PATH}/qiraa`,
      title: 'القراءة البيانية', desc: 'نقرأ على المستقيم $b$ ثم $a$ لنكتب $f(x)$ ، ونقرأ صورة عدد والعدد الذي علمت صورته.',
      stage: 'manipulation', teachesLearningPointIds: ['4am_tamthil-bayani-taalufi_P2', '4am_tamthil-bayani-taalufi_P3'],
      color: 'blue', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أقرأ على البيان' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين من المنصّة: مستقيم نقرأ عليه كل شيء، منحدر حديقة التزلّج، ومستقيم نختار نقطتيه.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_tamthil-bayani-taalufi_P2', '4am_tamthil-bayani-taalufi_P3', '4am_tamthil-bayani-taalufi_P1'],
      color: 'amber', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
