/**
 * الدرس 4 — القاسم المشترك الأكبر لعددين طبيعيين
 * Manuel 4AM, unité 1 : activité 4 (p. 8), معارف 3 (p. 10), معارف 4 تعريف + ملاحظة (p. 12), دوري الآن p. 11 (1), exercice 10 (p. 14).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/qasim-mushtarak-akbar';

export const LESSON_CONFIG = {
  id: 'qasim-mushtarak-akbar',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  title: 'القاسم المشترك الأكبر لعددين طبيعيين',
  description: 'القواسم المشتركة لعددين طبيعيين والقاسم المشترك الأكبر لهما، من وضعية تشكيل باقات متماثلة إلى التعريف والترميز PGCD (a ; b).',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '💐',
  estimatedDurationMin: 45,
  textbookRef: { unit: 1, activity: 4, pages: '8, 10, 11, 12, 14' },
  skills: [
    'تعيين القواسم المشتركة لعددين طبيعيين',
    'التعرّف على القاسم المشترك الأكبر لعددين والترميز له بـ PGCD (a ; b)',
    'تفسير وضعية توزيع في باقات متماثلة بلغة القواسم المشتركة والقاسم المشترك الأكبر',
    'معرفة أن القواسم المشتركة لعددين هي قواسم قاسمهما المشترك الأكبر',
  ],
  teachingScope: {
    include: ['القواسم المشتركة، القاسم المشترك الأكبر، الرمز PGCD (a ; b)', 'ملاحظة الكتاب: القواسم المشتركة هي قواسم PGCD'],
    exclude: ['طرق حساب PGCD بغير حصر القواسم (الدرسان 5 و 6)'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  priorKnowledge: ['tariqa-qawasim'],
  resources: [
    // Module 1 — workspace à deux niveaux. Même objectif, deux échelles :
    // 12 et 18 se comptent sur les doigts ; 90 et 54 sont les nombres du
    // manuel et demandent une stratégie.
    { kind: 'manipulation', code: 'common-divisors-12-18', type: 'common-divisors', module: 1,
      level: 'beginner',
      title: 'مجموعات متماثلة: 12 و 18',
      objective: 'القواسم المشتركة لعددين، وأكبرها هو القاسم المشترك الأكبر',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'football' },
      learningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2'], sourceElementIds: ['act-4'] },
    { kind: 'manipulation', code: 'common-divisors-90-54', type: 'common-divisors', module: 1,
      level: 'advanced',
      title: 'باقات متماثلة: 90 زهرة حمراء و 54 زهرة بيضاء',
      objective: 'القواسم المشتركة لعددين، وأكبرها هو القاسم المشترك الأكبر',
      autonomy: 'أعداد الكتاب: أكبر عدد من الباقات يُبحث عنه دون اقتراح، ثم قائمتان طويلتان يقارن بينهما التلميذ',
      experience: { type: 'textbook', reason: '', theme: 'garden' },
      learningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P3'], sourceElementIds: ['act-4'] },
    { kind: 'manipulation', code: 'common-divisors-28-42', type: 'common-divisors', module: 2, title: 'مثال الكتاب: 28 و 42',
      learningPointIds: ['4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P4'], sourceElementIds: ['know-4-def'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'أربع عبارات: صحيح أم خاطئ؟ البحث عن كل قواسم عدد.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'baqat', path: `${LESSON_BASE_PATH}/baqat`,
      title: 'نشاط 4 — باقات متماثلة', desc: '90 زهرة حمراء و 54 زهرة بيضاء: 9 باقات؟ وما أكبر عدد ممكن من الباقات؟',
      stage: 'trigger', teachesLearningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P3'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أشكّل الباقات' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — القواسم المشتركة والقاسم المشترك الأكبر', desc: 'التعريفان، الرمز PGCD (a ; b)، وملاحظة الكتاب مع 28 و 42.',
      stage: 'discovery', teachesLearningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2', '4am_qasim-mushtarak-akbar_P4'],
      color: 'violet', style: 'featured', estimatedMin: 15, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'دوري الآن (65 و 78) وتمرين 10.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_qasim-mushtarak-akbar_P1', '4am_qasim-mushtarak-akbar_P2'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمس أسئلة تُقيّم نقاط التعلّم الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 8, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
