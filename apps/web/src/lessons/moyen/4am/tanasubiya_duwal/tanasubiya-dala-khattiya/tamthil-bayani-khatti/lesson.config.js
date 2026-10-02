/**
 * الدرس 3 — التمثيل البياني لدالة خطية وقراءته بيانيًا
 * Unité 6 du manuel (4AM) : نشاط 3 (p. 66), معارف (p. 68), طرائق et دوري الآن (p. 69),
 * exercices 2, 10 → 15 (p. 72–73), 30 et 33 (أتعمّق, p. 75), QCM 1 et 4 (p. 74), le زالق de
 * جيوجيبرا (p. 76). Source de vérité : docs/sources/4am/unit6/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/tanasubiya_duwal/tamthil-bayani-khatti';

export const LESSON_CONFIG = {
  id: 'tamthil-bayani-khatti',
  kind: 'lesson',
  unit: 'tanasubiya-dala-khattiya',
  unitTitle: 'الدالة الخطية والتناسبية',
  sequentialUnlock: true,
  title: 'التمثيل البياني لدالة خطية وقراءته بيانيًا',
  description: 'إنشاء التمثيل البياني لدالة خطية في معلم متعامد ومتجانس (مستقيم يشمل المبدأ O تكفي لرسمه نقطة ثانية)، القراءة البيانية لصورة عدد وللعدد الذي علمت صورته، وربط منحى المستقيم بإشارة المعامل $a$ .',
  level: 'moyen',
  grade: '4am',
  chapter: 'tanasubiya_duwal',
  chapterTitle: 'ميدان التناسبية والدوال',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '📈',
  estimatedDurationMin: 50,
  textbookRef: { unit: 6, activity: 3, pages: '66, 68, 69, 72, 73, 74, 75, 76' },
  skills: [
    'إنشاء التمثيل البياني لدالة خطية: مستقيم يشمل المبدأ O تكفي لرسمه نقطة ثانية',
    'معرفة أنّ $y = ax$ معادلة هذا المستقيم وأنّ $a$ معامل توجيهه',
    'القراءة البيانية لصورة عدد وللعدد الذي علمت صورته',
    'ربط منحى المستقيم (يصعد / ينزل) بإشارة المعامل $a$',
  ],
  teachingScope: {
    include: [
      'نشاط 3: الدالة $x \\longmapsto 0{,}5x$ ، جدولها، النقط O و A و B على استقامة، النقطة C ذات الفاصلة $-2$ ، والمعادلة $y = 0{,}5x$',
      'الزالق (أوظّف تكنولوجيات الإعلام والاتصال ص 76) في صيغة المنصّة: منحى المستقيم وإشارة $a$',
      'معارف: التمثيل البياني لدالة خطية، معادلته ومعامل توجيهه، ومثال $-2x$ و $2x$',
      'طرائق: تمثيل دالة خطية بيانيا ($1{,}5x$) وقراءة تمثيل بياني ($f(4) = 1{,}6$ والعدد الذي صورته 3,5)',
      'دوري الآن: الدالة التي يشمل تمثيلها $A\\left(-\\dfrac{2}{3} ; -\\dfrac{3}{2}\\right)$ ، وانتماء نقطة إلى التمثيل',
      'تمارين الكتاب 2، 10 ← 15، 30 و 33',
    ],
    exclude: [
      'تعريف الدالة الخطية وحساب الصور وتعيين المعامل من ثنائية (الدرس 2)',
      'تطبيقات التناسبية: النسب المئوية والمقادير المركّبة (الدرس 4)',
      'الدالة التآلفية وتمثيلها (ليس في هذه الوحدة)',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : تعليم نقطة وقراءة إحداثياتها (السنوات السابقة), la صورة
  // d'un nombre par x ⟼ ax et le معامل depuis un couple (الدرس 2 dala-khattiya), les règles des signes.
  priorKnowledge: ['talim-nuqta', 'notation-fx', 'qawaid-ishara', 'tayin-muamil'],
  resources: [
    // Le module 1 ouvre sur LA DROITE ÉPINGLÉE À O (origin-line). مبتدئ = le نشاط 3 (f = 0,5x, ouvert
    // par défaut : c'est l'activité du module) ; متقدم = le زالق de جيوجيبرا (p. 76) dans sa version
    // plateforme : aucune fonction donnée, l'élève fait pivoter la droite et décide du lien entre le
    // signe de a et le sens.
    {
      kind: 'manipulation', code: 'origin-line-draw-0-5', type: 'origin-line', module: 1,
      level: 'beginner',
      title: 'نشاط 3: تمثيل الدالة $x \\longmapsto 0{,}5x$',
      objective: 'التمثيل البياني لدالة خطية $x \\longmapsto ax$ مستقيم يشمل المبدأ O معادلته $y = ax$ ، ومنحاه تعيّنه إشارة $a$',
      autonomy: '',
      experience: { type: 'textbook', reason: '', theme: 'cablecar' },
      learningPointIds: ['4am_tamthil-bayani-khatti_P1', '4am_tamthil-bayani-khatti_P2'],
      sourceElementIds: ['act-3'],
    },
    {
      kind: 'manipulation', code: 'origin-line-pivot', type: 'origin-line', module: 1,
      level: 'advanced',
      title: 'الزالق: كيف يتحرّك المستقيم عندما يتغيّر $a$ ؟',
      objective: 'التمثيل البياني لدالة خطية $x \\longmapsto ax$ مستقيم يشمل المبدأ O معادلته $y = ax$ ، ومنحاه تعيّنه إشارة $a$',
      autonomy: 'لا دالة معطاة ولا نقطة مقترحة: التلميذ يدير المستقيم حول O بنفسه، يثبّت مستقيمات يختارها، ويحكم بنفسه على العلاقة بين إشارة $a$ ومنحى المستقيم — الاكتشاف لا يُفتح إلا بمستقيم يصعد ومستقيم ينزل',
      experience: { type: 'platform_adaptation', reason: 'improved_interactivity_and_age_appropriateness', theme: 'cablecar' },
      learningPointIds: ['4am_tamthil-bayani-khatti_P3', '4am_tamthil-bayani-khatti_P1'],
      sourceElementIds: ['tech-76'],
    },
    // طرائق ص 69 (قراءة تمثيل بياني) : le lab en lecture, posé seul (un exemple travaillé, un niveau).
    {
      kind: 'manipulation', code: 'origin-line-read-0-4', type: 'origin-line', module: 2,
      title: 'طرائق: صورة 4، والعدد الذي صورته 3,5',
      learningPointIds: ['4am_tamthil-bayani-khatti_P2'],
      sourceElementIds: ['method-read'],
    },
    // دوري الآن ص 69 : représenter x ⟼ 9/4 x (la droite par A(−2/3 ; −3/2)), posé seul.
    {
      kind: 'manipulation', code: 'origin-line-draw-9-4', type: 'origin-line', module: 2,
      title: 'دوري الآن: تمثيل الدالة $x \\longmapsto \\dfrac{9}{4}x$',
      learningPointIds: ['4am_tamthil-bayani-khatti_P1'],
      sourceElementIds: ['now-69'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات من المنصّة: إحداثيات نقطة، صورة عدد بدالة خطية، قواعد الإشارات، ومعامل دالة من ثنائية. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 3 — حبل يشدّه المبدأ', desc: 'ضع نقطًا من تمثيل الدالة $x \\longmapsto 0{,}5x$ في معلم ثُبّت مبدؤه، ثم أدر المستقيم بالزالق: متى يصعد ومتى ينزل؟',
      stage: 'trigger', teachesLearningPointIds: ['4am_tamthil-bayani-khatti_P1', '4am_tamthil-bayani-khatti_P2', '4am_tamthil-bayani-khatti_P3'],
      color: 'indigo', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أرسم المستقيم' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف وطرائق — المستقيم وقراءته', desc: 'التمثيل البياني لدالة خطية ومعامل توجيهه، منحى المستقيم، رسمه بنقطة ثانية، وقراءة صورة عدد وعدد صورته معلومة.',
      stage: 'discovery', teachesLearningPointIds: ['4am_tamthil-bayani-khatti_P1', '4am_tamthil-bayani-khatti_P3', '4am_tamthil-bayani-khatti_P2'],
      color: 'violet', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 2، 10 ← 15، 30 و 33: نرسم، نقرأ على الشكل، ونحذر من إشارة المعامل.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_tamthil-bayani-khatti_P2', '4am_tamthil-bayani-khatti_P1', '4am_tamthil-bayani-khatti_P3'],
      color: 'amber', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث، منها اثنان من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
