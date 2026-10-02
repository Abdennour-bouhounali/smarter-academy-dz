/**
 * الدرس 2 — مدى ووسيط ومتوسط سلسلة إحصائية
 * Unité 8 du manuel (4AM) : أستعدّ 1–2 (p. 91), نشاط 3 et نشاط 4 (p. 93), معارف 3–4 (p. 96), طرائق et دوري الآن
 * (p. 97), exercices 8 → 13 (p. 99), 17 et 18 (أتعمّق, p. 101), QCM 3–6 (p. 100).
 * Source de vérité : docs/sources/4am/unit8/extraction.json.
 *
 * LE PARCOURS (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH THE MATH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   M0 أستعدّ        diagnostic (moyenne simple, moyenne pondérée — les deux items FAUX du manuel —, ordre, effectifs)
 *   M1 نشاط 3        REAL (les salaires, les deux villes de novembre) + MANIPULATE (stat-balance : le كلّاب puis
 *                    l'appui, range|mean) + UNDERSTAND (même moyenne 482/30, étendues 5 et 10 : la réponse honnête)
 *   M2 نشاط 4        DISCOVER (le rideau du lab, médiane ; la valeur extrême : la moyenne court, la médiane reste) +
 *                    TOUCH THE MATH (les 11 salaires, El Oued, les 41 poids en classes) + FORMALIZE (معارف 3–4)
 *   M3 طرائق         FORMALIZE (la méthode des rangs, les deux exercices résolus, 3 et 43) + دوري الآن
 *   M4 أوظّف          AUTOMATIZE (تمارين 8 → 13) + TRANSFER (أتعمّق 17, 18 : racines, familles de séries)
 *   M5 إختبار أولي   QCM 3–6 + une moyenne pondérée de la plateforme
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/tanasubiya_duwal/mada-wasit-mutawassit';

export const LESSON_CONFIG = {
  id: 'mada-wasit-mutawassit',
  kind: 'lesson',
  unit: 'ihsa',
  unitTitle: 'الإحصاء',
  sequentialUnlock: true,
  title: 'مدى ووسيط ومتوسط سلسلة إحصائية',
  description: 'المدى مقياسا لتشتت المعطيات، المتوسط الحسابي المتوازن لسلسلة بقيم منفصلة أو مجمعة في فئات (مراكز الفئات)، والوسيط Med لسلسلة مرتبة (رتبة القيمة المركزية) أو الفئة الوسيطية، وتفسير هذه المؤشرات.',
  level: 'moyen',
  grade: '4am',
  chapter: 'tanasubiya_duwal',
  chapterTitle: 'ميدان التناسبية والدوال',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🌡️',
  estimatedDurationMin: 55,
  textbookRef: { unit: 8, activity: 3, pages: '91, 93, 96, 97, 99, 100, 101' },
  skills: [
    'حساب مدى سلسلة إحصائية (الفرق بين أكبر قيمة وأصغر قيمة) كقياس لتشتت المعطيات',
    'حساب المتوسط الحسابي المتوازن $m$ لسلسلة إحصائية (سواء كانت بقيم منفصلة أو مجمعة في فئات بتعيين مراكز الفئات)',
    'تعيين وسيط سلسلة إحصائية $Med$ (قيم منفصلة مرتبة تصاعدياً/تنازلياً أو تحديد الفئة الوسيطية في حالة الفئات)',
  ],
  teachingScope: {
    include: [
      'نشاط 3: مدى سلسلة الرواتب، مدى ومتوسط درجات حرارة مدينتين (المتوسط نفسه $\\dfrac{482}{30}$ والمديان 5 و 10)',
      'نشاط 4: وسيط 11 راتبًا، مدى ومتوسط ووسيط حرارة الوادي، الوزن المتوسط بمراكز الفئات والفئة الوسيطية',
      'معارف 3 و 4: المدى، الوسيط وملاحظاته، الفئة الوسيطية (مع تصحيح مثالَي الكتاب)',
      'طرائق: تعيين المتوسط والوسيط والمدى وتفسيرها (إضافة 3 و 43)، الوسيط بالرتب، ودوري الآن',
      'تمارين الكتاب 8 ← 13، 17 و 18، وأسئلة أؤكّد تعلّماتي 3 ← 6',
    ],
    exclude: [
      'التكرار المجمع والتواتر المجمع (الدرس 1) — يُستعمل هنا لتعيين الفئة الوسيطية فقط',
      'المجدولات (الدرس 3) وقراءة الوضعيات الإحصائية (الدرس 4)',
      'المنوال كمؤشّر مدروس',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que « أستعدّ » diagnostique : la moyenne d'une série (années précédentes), la moyenne pondérée par les
  // effectifs, ranger des nombres, lire un tableau d'effectifs (التكرار الكلّي), l'effectif cumulé croissant (leçon 1).
  priorKnowledge: ['mutawassit-basit', 'mutawassit-tarjih', 'tartib-adad', 'jadwal-takrarat', 'takrar-mujamma-said'],
  resources: [
    // Module 1 — LA BALANCE DES VALEURS (stat-balance), étapes كلّاب puis appui (range|mean).
    {
      kind: 'manipulation', code: 'stat-balance-esport-range-mean', type: 'stat-balance', module: 1,
      level: 'beginner',
      title: 'ميزان النقاط: خمسة لاعبين',
      objective: 'المدى هو الفرق بين أكبر قيمة وأصغر قيمة، والمتوسط هو نقطة توازن القيم (مجموع القيم مقسومًا على عددها)',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'esport' },
      learningPointIds: ['4am_mada-wasit-mutawassit_P1', '4am_mada-wasit-mutawassit_P2'],
      sourceElementIds: ['act-3'],
    },
    {
      kind: 'manipulation', code: 'stat-balance-oasis-range-mean', type: 'stat-balance', module: 1,
      level: 'advanced',
      title: 'ميزان الحرارة: عشرة أيام بالوادي',
      objective: 'المدى هو الفرق بين أكبر قيمة وأصغر قيمة، والمتوسط هو نقطة توازن القيم (مجموع القيم مقسومًا على عددها)',
      autonomy: 'عشر قراءات لا تُعدّ بنظرة، وأعمدة متباعدة: الكلّاب يُضبط دون قيمة مقترحة، والمتوسط $39{,}3$ عشري لا يُصاب إلا بتدريجة العُشر — التلميذ يقترب بنفسه بقراءة مجموعي المسافات',
      experience: { type: 'textbook', reason: '', theme: 'heatwave' },
      learningPointIds: ['4am_mada-wasit-mutawassit_P1', '4am_mada-wasit-mutawassit_P2'],
      sourceElementIds: ['act-4', 'act-3'],
    },
    // Module 2 — le RIDEAU (median), puis la valeur extrême tirée (contrast).
    {
      kind: 'manipulation', code: 'stat-balance-esport-median', type: 'stat-balance', module: 2,
      level: 'beginner',
      title: 'الستارة: خمس نقاط (عدد فردي)',
      objective: 'الوسيط يجزئ السلسلة المرتّبة إلى سلسلتين لهما نفس التكرار، ولا يتأثّر بقيمة متطرّفة بخلاف المتوسط',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'esport' },
      learningPointIds: ['4am_mada-wasit-mutawassit_P3'],
      sourceElementIds: ['act-4'],
    },
    {
      kind: 'manipulation', code: 'stat-balance-oasis-median', type: 'stat-balance', module: 2,
      level: 'advanced',
      title: 'الستارة: عشر قراءات (عدد زوجي)',
      objective: 'الوسيط يجزئ السلسلة المرتّبة إلى سلسلتين لهما نفس التكرار، ولا يتأثّر بقيمة متطرّفة بخلاف المتوسط',
      autonomy: 'عدد زوجي من القيم: لا قيمة واحدة في الوسط، فالستارة تقف بين قيمتين ويقرأ التلميذ منتصفهما بنفسه؛ أعمدة فيها قيمتان متساويتان تُقطع بارتفاع اليد',
      experience: { type: 'textbook', reason: '', theme: 'heatwave' },
      learningPointIds: ['4am_mada-wasit-mutawassit_P3'],
      sourceElementIds: ['act-4'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات (اثنتان من الكتاب): المتوسط، المتوسط المتوازن، الترتيب، التكرار الكلّي والتكرار المجمع. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat-3', path: `${LESSON_BASE_PATH}/nashat-3`,
      title: 'نشاط 3 — المدى والمتوسط', desc: 'رواتب مؤسسة، وحرارة مدينتين في نوفمبر: نضبط كلّابًا على القيم الطرفية، ونحرّك نقطة ارتكاز حتى تتوازن القيم.',
      stage: 'trigger', teachesLearningPointIds: ['4am_mada-wasit-mutawassit_P1', '4am_mada-wasit-mutawassit_P2'],
      color: 'rose', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أوازن القيم' },
    { id: '02', number: 2, slug: 'nashat-4', path: `${LESSON_BASE_PATH}/nashat-4`,
      title: 'نشاط 4 ومعارف — الوسيط', desc: 'ستارة تقسم القيم المرتّبة نصفين، قيمة بعيدة تحرّك المتوسط ولا تحرّك الوسيط، ثم المدى والوسيط والفئة الوسيطية بكلمات الكتاب.',
      stage: 'discovery', teachesLearningPointIds: ['4am_mada-wasit-mutawassit_P3', '4am_mada-wasit-mutawassit_P1', '4am_mada-wasit-mutawassit_P2'],
      color: 'violet', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — الوسيط بالرتب والقيم المتطرّفة', desc: 'تمرينان محلولان من الكتاب: ماذا يحدث عند إضافة 3 و 43؟ ثم رتبة الوسيط في جدول كبير، ودوري الآن.',
      stage: 'formalization', teachesLearningPointIds: ['4am_mada-wasit-mutawassit_P3', '4am_mada-wasit-mutawassit_P2', '4am_mada-wasit-mutawassit_P1'],
      color: 'emerald', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أطبّق الطريقة' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 8 ← 13، و 17 و 18 من أتعمّق: سلاسل بشروط على المدى والمتوسط والوسيط.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_mada-wasit-mutawassit_P2', '4am_mada-wasit-mutawassit_P3', '4am_mada-wasit-mutawassit_P1'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 3, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث، منها أربعة من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
