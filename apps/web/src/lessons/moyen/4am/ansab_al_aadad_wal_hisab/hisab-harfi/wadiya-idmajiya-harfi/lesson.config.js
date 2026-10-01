/**
 * أدمج تعلّماتي — الوحدة 3 « الحساب الحرفي » (kind: synthesis)
 * Manuel 4AM, unité 3 : « أؤكّد تعلّماتي » (QCM 1–13, p. 40), « أدمج تعلّماتي »
 * (وضعية الحوض والشريط + تحليل الوضعية, p. 40), « أتعمّق » (ex. 37–40, p. 41)
 * et l'exercice 34 (p. 39), le تحدّ de la page d'unité (p. 31) et les items 1–2
 * de « أستعدّ » (p. 31) — extraction.json › destinations.
 * Ce n'est PAS un quatrième درس : c'est la synthèse de l'unité, affichée après les trois leçons.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/wadiya-idmajiya-harfi';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-harfi',
  kind: 'synthesis',
  unit: 'hisab-harfi',
  unitTitle: 'الحساب الحرفي',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — الحساب الحرفي',
  description: 'حل وضعيات مركبة وتوظيف الحساب الحرفي: وضعية الحوض والشريط (مساحة الشريط 44m²) وتحدّي المثلث القائم، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه، ثم تمارين «أتعمّق».',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🏊',
  estimatedDurationMin: 50,
  textbookRef: { unit: 3, pages: '31, 39, 40, 41' },
  skills: [
    'تجنيد النشر والتبسيط والتحليل والمتطابقات الشهيرة لحل وضعيات هندسية وعددية مركبة',
    'نمذجة وضعية: التعبير عن أطوال ومساحات بعبارات جبرية بدلالة x',
    'اختيار الشكل المنشور أو المحلّل لحساب قيمة عبارة أو لكتابة معادلة وحلها',
  ],
  teachingScope: {
    include: ['أؤكّد تعلّماتي: 13 سؤالًا', 'أدمج تعلّماتي: الوضعية وتحليلها في ثلاث مراحل', 'تحدّ الوحدة: المثلث القائم', 'أتعمّق: التمارين 34 و 37 إلى 40'],
    exclude: ['أي مفهوم جديد', 'حل معادلة جداء معدوم بصفة عامة (تُستعمل مساعدة الكتاب فقط، مع التحقق بالتعويض)'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la situation mobilise, diagnostiqué par « أستعدّ » : la valeur d'une expression (p. 31, items 1–2),
  // le développement (درس 1), les identités (درس 2), la factorisation (درس 3), les aires, Pythagore.
  priorKnowledge: ['qimat-ibara', 'nashr-jadaa', 'mutatabiqat', 'tahlil-ibara', 'masahat-ashkal', 'khassiyat-fithaghuras'],
  resources: [
    { kind: 'situation', code: 'situation-hawd-shrit', module: 1, title: 'وضعية: الحوض والشريط', learningPointIds: ['4am_wadiya-idmajiya-harfi_P2'], sourceElementIds: ['situation'] },
    // Module 1 — la situation dans le terrain découpé : x + 10 + x de chaque côté,
    // 9 zones (le centre 10 × 10 est le bassin, les 8 autres le ruban). Un seul
    // niveau (`levels={false}`) : c'est la situation du manuel, modélisée.
    {
      kind: 'manipulation', code: 'pitch-expansion-hawd', type: 'pitch-expansion', module: 1,
      title: 'الحوض والشريط: مربع ضلعه x + 10 + x',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'football' },
      learningPointIds: ['4am_wadiya-idmajiya-harfi_P2', '4am_wadiya-idmajiya-harfi_P1'],
      sourceElementIds: ['situation'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'سبع عبارات: صحيح أم خاطئ؟ قيمة عبارة، النشر، المتطابقات، التحليل، المساحة وفيثاغورس.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'الحوض والشريط: اسحب عرض الشريط، عبّر عن مساحته بدلالة x، واكتب المساواة؛ ثم تحدّي المثلث القائم.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-harfi_P1', '4am_wadiya-idmajiya-harfi_P2', '4am_wadiya-idmajiya-harfi_P3'],
      color: 'amber', style: 'featured', estimatedMin: 14, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'ثلاثة عشر سؤالًا من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-harfi_P1'], color: 'sky', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'مثلثات ومربعات بدلالة x، ثم الشكل المناسب للحساب: التمارين 34 و 37 إلى 40.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-harfi_P2', '4am_wadiya-idmajiya-harfi_P3', '4am_wadiya-idmajiya-harfi_P1'],
      color: 'rose', style: 'featured', estimatedMin: 12, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'ahill', path: `${LESSON_BASE_PATH}/ahill`,
      title: 'أحلّ الوضعية', desc: 'خمس مراحل تُقيَّم: ضلع المربع الخارجي، مساحة الشريط، المساواة، الشكل المحلّل، ثم عرض الشريط والتحقق.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 4, actionText: 'أحلّ' },
  ],
};
