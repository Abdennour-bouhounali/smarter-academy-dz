/**
 * أدمج تعلّماتي — الوحدة 1 (kind: synthesis)
 * Manuel 4AM, unité 1 : « أؤكّد تعلّماتي » (QCM 1–9, p. 16) et « أدمج تعلّماتي » (وضعية + تحليل الوضعية, p. 16).
 * Ce n'est PAS un neuvième درس : c'est la synthèse de l'unité, affichée après les huit leçons.
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/wadiya-idmajiya-aadad';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-aadad',
  kind: 'synthesis',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — الأعداد الطبيعيّة والأعداد النّاطقة',
  description: 'وضعية إدماجية (ترميم واجهة معلم تاريخي) تُعبّئ قابلية القسمة وخواص القواسم، يسبقها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 3,
  masteryThreshold: 0.8,
  emoji: '🏛️',
  estimatedDurationMin: 40,
  textbookRef: { unit: 1, pages: '16' },
  skills: ['حل وضعية إدماجية بتعبئة قابلية القسمة والقواسم والقاسم المشترك الأكبر'],
  teachingScope: { include: ['أؤكّد تعلّماتي: 9 أسئلة', 'أدمج تعلّماتي: الوضعية وتحليلها في ثلاث مراحل'], exclude: ['أي مفهوم جديد'] },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  priorKnowledge: ['qawaid-qisma', 'khassiya-1', 'qawasim-mushtaraka'],
  resources: [
    { kind: 'situation', code: 'situation-qasr-al-rayas', module: 1, title: 'وضعية: ترميم واجهة قصر الرياس', learningPointIds: ['4am_wadiya-idmajiya-aadad_P1'], sourceElementIds: ['situation'] },
  ],
  modules: [
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`, title: 'الوضعية وتحليلها', desc: 'اقرأ، افرز المعطيات، واكتشف الاستراتيجية في ثلاث مراحل كما في الكتاب.',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-aadad_P1'], color: 'amber', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`, title: 'أؤكّد تعلّماتي', desc: 'تسعة أسئلة من الكتاب؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-aadad_P1'], color: 'sky', style: 'featured', estimatedMin: 16, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'ahill', path: `${LESSON_BASE_PATH}/ahill`, title: 'أحلّ الوضعية', desc: 'أربع مراحل تُقيَّم: ما المطلوب؟ رقم الآحاد، الترشيحات، ثم الجواب.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 12, difficulty: 4, actionText: 'أحلّ' },
  ],
};
