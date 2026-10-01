/**
 * الدرس 1 من الوحدة 3 — نشر وتبسيط عبارة جبرية
 * Manuel 4AM, unité 3 « الحساب الحرفي » : أستعدّ items 3, 4, 7, 8 (p. 31), نشاط 1 (p. 32),
 * معارف 1 (p. 34), دوري الآن 1 (p. 35), exercices 1–8 (p. 37), QCM 1–3 (p. 40).
 * Source de vérité : docs/sources/4am/unit3/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/nashr-tabsit';

export const LESSON_CONFIG = {
  id: 'nashr-tabsit',
  kind: 'lesson',
  unit: 'hisab-harfi',
  unitTitle: 'الحساب الحرفي',
  sequentialUnlock: true,
  title: 'نشر وتبسيط عبارة جبرية',
  description: 'كتابة عبارة جبرية مكتوبة على شكل جداء على شكل مجموع أو فرق بتطبيق الخاصية التوزيعية k(a + b) = ka + kb و k(a − b) = ka − kb والقاعدة العامة (a + b)(c + d) = ac + ad + bc + bd، ثم تبسيطها بحذف الأقواس وتجميع الحدود المتشابهة.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '📐',
  estimatedDurationMin: 50,
  textbookRef: { unit: 3, activity: 1, pages: '31, 32, 34, 35, 37, 40' },
  skills: [
    'التمييز بين عبارة تدلّ على جداء وعبارة تدلّ على مجموع، وكتابة جداء على شكل مجموع أو فرق',
    'نشر جداء عدد في مجموع أو فرق: k(a + b) = ka + kb و k(a − b) = ka − kb',
    'نشر جداء قوسين: (a + b)(c + d) = ac + ad + bc + bd',
    'تبسيط عبارة جبرية بحذف الأقواس وجمع الحدود المتشابهة',
  ],
  teachingScope: {
    include: ['تعريف النشر: كتابة عبارة جداء على شكل مجموع أو فرق', 'الخاصية التوزيعية k(a + b) و k(a − b) وجداء قوسين (a + b)(c + d)', 'تبسيط عبارة: حذف الأقواس (المسبوقة بـ − أيضًا) وجمع الحدود المتشابهة', 'التحقّق من نشر بحساب قيمة العبارة من أجل قيمة لـ x'],
    exclude: ['المتطابقات الشهيرة والحساب المتمعن فيه (الدرس 2)', 'تحليل عبارة جبرية إلى جداء عوامل (الدرس 3)'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » (p. 31, items 3, 4, 7, 8 + six ajouts) diagnostique.
  priorKnowledge: ['khassiya-tawziiya', 'awlawiyat-hisab', 'jidaa-x-fi-x', 'hadhf-aqwas'],
  resources: [
    // Module 1 — WORKSPACE À DEUX NIVEAUX, un seul instrument : le terrain découpé.
    //   مبتدئ  — 3(x + 5) : deux zones, une seule distributivité ; pour x = 9 c'est
    //            le calcul 3 × (9 + 5) de la question 1 (lecture corrigée).
    //   متقدم  — (3x − 1)(3 + x) (question 3 de l'activité) : quatre zones dont deux
    //            retranchées, des termes semblables à réunir.
    {
      kind: 'manipulation', code: 'pitch-expansion-3-x5', type: 'pitch-expansion', module: 1,
      level: 'beginner',
      title: 'ملعب عرضه 3 وطوله x + 5',
      objective: 'النشر: مساحة الملعب (جداء بعديه) تساوي مجموع مساحات مناطقه، من أجل كل قيمة لـ x',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'smaller_numbers_for_first_contact', theme: 'football' },
      learningPointIds: ['4am_nashr-tabsit_P1', '4am_nashr-tabsit_P2'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'pitch-expansion-3x-1-3-x', type: 'pitch-expansion', module: 1,
      level: 'advanced',
      title: 'نشاط 1 — ملعب بعداه 3x − 1 و 3 + x',
      objective: 'النشر: مساحة الملعب (جداء بعديه) تساوي مجموع مساحات مناطقه، من أجل كل قيمة لـ x',
      autonomy: 'أربع مناطق منها اثنتان مقتطعتان (حدّ سالب): التلميذ يحسبها كلها بنفسه، يجمع الحدود المتشابهة ويُرفض جمع حدّين غير متشابهين، ثم يتحقّق من المساواة من أجل قيمتين لـ x على الأقل',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'football' },
      learningPointIds: ['4am_nashr-tabsit_P1', '4am_nashr-tabsit_P3', '4am_nashr-tabsit_P4'],
      sourceElementIds: ['act-1'],
    },
    // Module 2 (معارف) — l'exemple du livre (2x − 1)(x + 4) dans le MÊME instrument ;
    // un seul niveau (`levels={false}`) : c'est un exemple travaillé.
    {
      kind: 'manipulation', code: 'pitch-expansion-2x-1-x4', type: 'pitch-expansion', module: 2,
      title: 'مثال الكتاب: ملعب بعداه 2x − 1 و x + 4',
      learningPointIds: ['4am_nashr-tabsit_P3', '4am_nashr-tabsit_P4'],
      sourceElementIds: ['know-1'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'عشر عبارات: صحيح أم خاطئ؟ الخاصية التوزيعية، أولويات العمليات، x × x و x + x، حذف الأقواس.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 1 — نشر عبارة جبرية', desc: 'ملعب المتوسطة يكبر: احسب مساحته منطقةً منطقة، ثم أسئلة النشاط: بطريقتين، جداء أم مجموع، انشر وبسّط.',
      stage: 'trigger', teachesLearningPointIds: ['4am_nashr-tabsit_P1', '4am_nashr-tabsit_P2', '4am_nashr-tabsit_P3', '4am_nashr-tabsit_P4'],
      color: 'indigo', style: 'featured', estimatedMin: 14, difficulty: 1, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — النشر', desc: 'التعريف، الخاصيات الثلاث ومثالا الكتاب، ثم التبسيط بجمع الحدود المتشابهة.',
      stage: 'discovery', teachesLearningPointIds: ['4am_nashr-tabsit_P1', '4am_nashr-tabsit_P2', '4am_nashr-tabsit_P3', '4am_nashr-tabsit_P4'],
      color: 'violet', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'دوري الآن (ص 35)، ثم تمارين الكتاب 1 إلى 8 (ص 37).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_nashr-tabsit_P2', '4am_nashr-tabsit_P3', '4am_nashr-tabsit_P4'],
      color: 'amber', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
