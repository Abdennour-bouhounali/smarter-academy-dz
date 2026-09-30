/**
 * أدمج تعلّماتي — الوحدة 2 « الحساب على الجذور » (kind: synthesis)
 * Manuel 4AM, unité 2 : « أؤكّد تعلّماتي » (QCM 1–11, p. 28) et « أدمج تعلّماتي »
 * (وضعية « زربية وادي سوف » + تحليل الوضعية, p. 28).
 * Ce n'est PAS un sixième درس : c'est la synthèse de l'unité, affichée après les cinq leçons.
 * La deuxième étape de l'analyse est affichée CORRIGÉE (décision du propriétaire,
 * 2026-09-30, extraction.json `situation.correction`) : la donnée parasite est le prix 12000DA.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/wadiya-idmajiya-judhur';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-judhur',
  kind: 'synthesis',
  unit: 'hisab-judhur',
  unitTitle: 'الحساب على الجذور',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — الحساب على الجذور',
  description: 'وضعية إدماجية (زربية وادي سوف: مساحتها 24m² وطولها ضعف عرضها) تُعبّئ الجذر التربيعي وحل معادلة من الشكل x² = a والحساب على الجذور، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🧶',
  estimatedDurationMin: 45,
  textbookRef: { unit: 2, pages: '28' },
  skills: ['حل وضعية إدماجية بتوظيف الجذر التربيعي وحل معادلة من الشكل x² = a والحساب على الجذور'],
  teachingScope: {
    include: ['أؤكّد تعلّماتي: 11 سؤالًا', 'أدمج تعلّماتي: الوضعية وتحليلها في ثلاث مراحل'],
    exclude: ['أي مفهوم جديد'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la situation mobilise, diagnostiqué par « أستعدّ » : √a (leçon 1), x² = a (leçon 3), a√b (leçon 5).
  priorKnowledge: ['jidhr-taarif', 'hulul-x2-a', 'kitaba-a-jidhr-b'],
  resources: [
    { kind: 'situation', code: 'situation-zarbiya-wadi-souf', module: 1, title: 'وضعية: زربية وادي سوف', learningPointIds: ['4am_wadiya-idmajiya-judhur_P1'], sourceElementIds: ['situation'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: صحيح أم خاطئ؟ الجذر التربيعي، المعادلة x² = a، والكتابة a√b.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'زربية وادي سوف: افرز المعطيات، عبّر عن المساحة بدلالة العرض، واختر الاستراتيجية.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-judhur_P1'], color: 'amber', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'أحد عشر سؤالًا من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-judhur_P1'], color: 'sky', style: 'featured', estimatedMin: 15, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'ahill', path: `${LESSON_BASE_PATH}/ahill`,
      title: 'أحلّ الوضعية', desc: 'خمس مراحل تُقيَّم: المطلوب، المعادلة، العرض والطول بالقيم المضبوطة، ثم التدوير إلى 1cm.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 12, difficulty: 4, actionText: 'أحلّ' },
  ],
};
