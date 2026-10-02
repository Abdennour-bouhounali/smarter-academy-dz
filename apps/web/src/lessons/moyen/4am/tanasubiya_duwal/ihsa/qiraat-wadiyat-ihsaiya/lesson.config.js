/**
 * الدرس 4 — ترييض وقراءة وضعيات إحصائية وتفسير المؤشرات (unité 8 « الإحصاء », manuel pp. 91–101).
 * La leçon n'a PAS d'activité du manuel : son entrée est le تحدّ de la page d'unité (doublon déclaré,
 * extraction › destinations › challenge), son contexte réel l'encart « تلوث البيئة » (doublon déclaré),
 * ses exercices ex-14 (p. 99), ex-19 et ex-22 (p. 101). Son savoir formel est une FORMULATION de la
 * plateforme (`addition('knowledge_formalization')`) dans le vocabulaire du manuel.
 *
 * Le parcours du propriétaire, module par module :
 *   0 أستعدّ                  diagnostic des acquis des leçons 1–2 (متوسط، وسيط، مدى، تواتر، قراءة مخطط)
 *   1 تحدّ (trigger)          REAL → DISCOVER → MANIPULATE → UNDERSTAND : les réservoirs `group-tanks`
 *                             (pari, vanne, effectifs) ; deux classes au MÊME niveau 384/33
 *   2 أقرأ وأترجم (discovery)  TOUCH THE MATH : lire un مخطط بالأعمدة (les voitures du club vert, après
 *                             « تلوث البيئة »), puis le casse-tête d'ex-19 (deux barres qui réunissent deux chaînes)
 *   3 أقارن وأقرّر (formalization) FORMALIZE : ex-14 (deux villes, position ET dispersion), ex-22 (retirer des
 *                             valeurs → N = 31), la méthode « أقرأ · أحسب المؤشرات · أقارن · أقرّر »
 *   4 أوظّف (practice_lab)     AUTOMATIZE → TRANSFER : temps d'écran, derby, plage (plateforme)
 *   5 إختبار أولي (evaluation)
 * Les exercices sont rangés aux modules 2–3 (et non tous au module 2 comme le plan l'esquissait) : la
 * lecture (P1) précède la comparaison (P2) et la modélisation (P3).
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/tanasubiya_duwal/qiraat-wadiyat-ihsaiya';

export const LESSON_CONFIG = {
  id: 'qiraat-wadiyat-ihsaiya',
  kind: 'lesson',
  unit: 'ihsa',
  unitTitle: 'الإحصاء',
  sequentialUnlock: true,
  title: 'ترييض وقراءة وضعيات إحصائية وتفسير المؤشرات',
  description: 'قراءة جداول ومخططات إحصائية من الحياة اليومية والمواضيع البيئية والاجتماعية، مقارنة سلسلتين بمؤشرات الموقع والتشتت (المتوسط، الوسيط، المدى) واتخاذ القرار، ونمذجة وضعيات واقعية تنطلق من «تحدّ» القسمين.',
  level: 'moyen',
  grade: '4am',
  chapter: 'tanasubiya_duwal',
  chapterTitle: 'ميدان التناسبية والدوال',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🔎',
  estimatedDurationMin: 50,
  textbookRef: { unit: 8, activity: 0, pages: '91, 99, 101' },
  skills: [
    'قراءة مخطط بالأعمدة (عنوان المحور، خطوة التدريج) وترجمته إلى جدول تكرارات وتواترات',
    'حساب متوسط سلسلة مكوّنة من مجموعات: المتوسط المتوازن وليس متوسط المتوسطات',
    'مقارنة سلسلتين بمؤشر موقع (المتوسط، الوسيط) ومؤشر تشتت (المدى)',
    'تفسير أثر قيمة متطرفة أو حذف قيم على المتوسط والوسيط',
    'اتخاذ قرار في وضعية واقعية وتبريره بالمؤشرات',
  ],
  teachingScope: {
    include: [
      'تحدّ ص 91: قسمان، ذكور وإناث، المعدّل نفسه 384/33',
      'نص «تلوث البيئة» ص 91 سياقًا لقراءة معطيات',
      'التمارين 14 (ص 99) و 19 و 22 (ص 101)',
      'طريقة: أقرأ، أحسب المؤشرات، أقارن، أقرّر (من المنصّة)',
      'وضعيات من حياة التلميذ: مدّة استعمال الهاتف، الدربي، تنظيف الشاطئ',
    ],
    exclude: [
      'تعريف التكرار المجمع والتواتر المجمع وحسابهما (الدرس 1)',
      'تعريفات المدى والوسيط والمتوسط وطرائق حسابها (الدرس 2)',
      'المجدولات (الدرس 3)',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis des leçons 1 et 2 que « أستعدّ » diagnostique : المتوسط، المتوسط المتوازن (par les effectifs),
  // الوسيط، المدى، التواتر، la lecture d'un مخطط بالأعمدة.
  priorKnowledge: ['mutawassit-silsila', 'mutawassit-mutawazin', 'wasit-silsila', 'mada-silsila', 'tawatur', 'qiraat-mukhattat-aamida'],
  resources: [
    // Module 1 : le تحدّ (p. 91). مبتدئ : مسابقة القسم, deux équipes d'amis (plateforme, plus petits nombres) ;
    // متقدم (défaut) : les deux classes du manuel.
    {
      kind: 'manipulation', code: 'group-tanks-quiz-4-6', type: 'group-tanks', module: 1,
      level: 'beginner',
      title: 'مسابقة القسم: فريقان من الأصدقاء',
      objective: 'متوسط مجموعات مجتمعة هو المتوسط المتوازن: مجموع (التكرار × المتوسط) مقسوم على التكرار الكلي، وليس متوسط المتوسطات',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'quiz' },
      learningPointIds: ['4am_qiraat-wadiyat-ihsaiya_P3'],
      sourceElementIds: ['challenge'],
    },
    {
      kind: 'manipulation', code: 'group-tanks-tahaddi-384-33', type: 'group-tanks', module: 1,
      level: 'advanced',
      title: 'تحدّ: القسمان (أ) و (ب)',
      objective: 'متوسط مجموعات مجتمعة هو المتوسط المتوازن: مجموع (التكرار × المتوسط) مقسوم على التكرار الكلي، وليس متوسط المتوسطات',
      autonomy: 'أربع مجموعات في قسمين وأعداد الكتاب: التلميذ يراهن وحده على مستوى كل قسم بدقّة عُشر، دون اقتراح، ثم يحكم على القسمين وقد تعاكست المقارنتان (الذكور ثم الإناث)',
      experience: { type: 'textbook', reason: '', theme: 'school' },
      learningPointIds: ['4am_qiraat-wadiyat-ihsaiya_P2', '4am_qiraat-wadiyat-ihsaiya_P3'],
      sourceElementIds: ['challenge'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: المتوسط، المتوسط بالتكرارات، الوسيط، المدى، التواتر، قراءة مخطط بالأعمدة. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'tahaddi', path: `${LESSON_BASE_PATH}/tahaddi`,
      title: 'تحدّ — قسمان ومعدّل واحد', desc: 'خزان لكل مجموعة: راهن على مستوى الماء، افتح الصمام، ثم قارن القسمين (أ) و (ب). الكتاب ص 91.',
      stage: 'trigger', teachesLearningPointIds: ['4am_qiraat-wadiyat-ihsaiya_P2', '4am_qiraat-wadiyat-ihsaiya_P3'],
      color: 'indigo', style: 'featured', estimatedMin: 13, difficulty: 3, actionText: 'أراهن وأفتح الصمام' },
    { id: '02', number: 2, slug: 'aqra', path: `${LESSON_BASE_PATH}/aqra`,
      title: 'أقرأ مخططًا وأترجمه', desc: 'سيارات أمام المدرسة بعد نص «تلوث البيئة»، ثم مخطط القنوات التلفزيونية وعموداه اللذان يجمعان قناتين (التمرين 19).',
      stage: 'discovery', teachesLearningPointIds: ['4am_qiraat-wadiyat-ihsaiya_P1'],
      color: 'violet', style: 'featured', estimatedMin: 10, difficulty: 3, actionText: 'أقرأ' },
    { id: '03', number: 3, slug: 'uqarin', path: `${LESSON_BASE_PATH}/uqarin`,
      title: 'أقارن وأقرّر', desc: 'مدينتان على مدار سنة (التمرين 14)، علامات قسم بعد حذف قيم (التمرين 22)، ثم طريقة: أقرأ، أحسب المؤشرات، أقارن، أقرّر.',
      stage: 'formalization', teachesLearningPointIds: ['4am_qiraat-wadiyat-ihsaiya_P2', '4am_qiraat-wadiyat-ihsaiya_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 10, difficulty: 4, actionText: 'أقارن' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'مدّة استعمال الهاتف، تذاكر الدربي، حملة تنظيف الشاطئ: أحسب، أقارن وأقرّر.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_qiraat-wadiyat-ihsaiya_P2', '4am_qiraat-wadiyat-ihsaiya_P3'],
      color: 'amber', style: 'featured', estimatedMin: 7, difficulty: 3, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث: القراءة والترجمة، المقارنة، النمذجة.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 5, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
