/**
 * الدرس 3 — خواص قواسم عدد طبيعي
 * Manuel 4AM, unité 1 : activité 3 (p. 8), معارف 2 (p. 10), « أتعلّم البرهنة » (p. 11), دوري الآن p. 11 (2),
 * exercices 12, 13, 14, 15, 16 (p. 14). Source : docs/sources/4am/unit1/extraction.json.
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/khawass-qawasim';

export const LESSON_CONFIG = {
  id: 'khawass-qawasim',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  title: 'خواص قواسم عدد طبيعي',
  description: 'خواص قواسم عدد طبيعي: القاسم المشترك لعددين يقسم مجموعهما وفرقهما وباقي القسمة الإقليدية لأحدهما على الآخر، وتعلّم البرهنة على خاصية من الشكل «إذا … فإنّ …».',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🧩',
  estimatedDurationMin: 55,
  textbookRef: { unit: 1, activity: 3, pages: '8, 10, 11, 14' },
  skills: [
    'معرفة أن القاسم المشترك لعددين يقسم مجموعهما وفرقهما',
    'معرفة أن قاسم عدد يقسم كل مضاعف له',
    'معرفة أن القاسم المشترك لعددين يقسم باقي القسمة الإقليدية لأحدهما على الآخر',
    'البرهان على خاصية من الشكل «إذا … فإنّ …» بإيجاد عدد طبيعي k حيث m = d × k',
  ],
  teachingScope: {
    include: ['خاصية 1 وخاصية 2 من الكتاب', 'البرهنة: المعطيات، المطلوب، البرهان'],
    exclude: ['القاسم المشترك الأكبر (الدرس 4)', 'خوارزميات البحث عن PGCD (الدرس 6) — تُبرَّر لاحقًا بهذه الخواص'],
  },
  knowledgeMap: true,
  priorKnowledge: ['qasim-jidaa', 'qisma-iqlidiya'],
  resources: [
    { kind: 'manipulation', code: 'divisor-properties-18-12', type: 'divisor-properties', module: 1, title: 'n يقسم a و b: ماذا يقسم أيضًا؟',
      learningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P3'], sourceElementIds: ['act-3'] },
    { kind: 'method', code: 'method-proof', module: 3, title: 'أتعلّم البرهنة: «إذا … فإنّ …»',
      learningPointIds: ['4am_khawass-qawasim_P4'], sourceElementIds: ['method-proof'] },
  ],
  modules: [
    { id: '01', number: 1, slug: 'thalath-halat', path: `${LESSON_BASE_PATH}/thalath-halat`,
      title: 'نشاط 3 — ثلاث حالات', desc: 'n يقسم a و b. هل يقسم a + b؟ و a − b؟ وباقي قسمة a على b؟',
      stage: 'trigger', teachesLearningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P3'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أتحقّق' },
    { id: '02', number: 2, slug: 'khassiyatan', path: `${LESSON_BASE_PATH}/khassiyatan`,
      title: 'معارف — خاصيتان', desc: 'من التخمين إلى الخاصية: 9 يقسم 90 و 900، و 5 يقسم 90 و 25.',
      stage: 'discovery', teachesLearningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P2', '4am_khawass-qawasim_P3'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أصوغ الخاصية' },
    { id: '03', number: 3, slug: 'ataallam-al-burhana', path: `${LESSON_BASE_PATH}/ataallam-al-burhana`,
      title: 'أتعلّم البرهنة', desc: 'كيف أبرهن صحة خاصية من الشكل «إذا … فإنّ …»؟',
      stage: 'discovery', teachesLearningPointIds: ['4am_khawass-qawasim_P4'],
      color: 'emerald', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أبرهن' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'دوري الآن، وتمارين الكتاب 12 ← 16.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_khawass-qawasim_P1', '4am_khawass-qawasim_P2', '4am_khawass-qawasim_P4'],
      color: 'amber', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إتقان', desc: 'خمس أسئلة تُقيّم نقاط التعلّم الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
