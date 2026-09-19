/**
 * الدرس 7 — العددان الأوّليّان فيما بينهما
 * Manuel 4AM, unité 1 : activité 7 (p. 9), معارف 5 (p. 12), exercices 23–27, 39 (p. 15).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/awwaliyan-fima-baynahuma';

export const LESSON_CONFIG = {
  id: 'awwaliyan-fima-baynahuma',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  title: 'العددان الأوّليّان فيما بينهما',
  description: 'العددان الأوليان فيما بينهما: قاسمهما المشترك الأكبر يساوي 1؛ إثبات ذلك بحساب PGCD، ونفيه بإظهار قاسم مشترك يختلف عن 1.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 3,
  masteryThreshold: 0.8,
  emoji: '1️⃣',
  estimatedDurationMin: 40,
  textbookRef: { unit: 1, activity: 7, pages: '9, 12, 15' },
  skills: [
    'التعرّف على عددين أوليين فيما بينهما (PGCD (a ; b) = 1)',
    'إثبات أن عددين أوليان فيما بينهما بحساب قاسمهما المشترك الأكبر',
    'إثبات أن عددين ليسا أوليين فيما بينهما بإظهار قاسم مشترك يختلف عن 1',
  ],
  teachingScope: { include: ['تعريف الكتاب ومثاله (22 و 15)', 'الإثبات والنفي'], exclude: ['الأعداد الأولية (موضوع رسمي آخر)', 'الكسور غير القابلة للاختزال (الدرس 8)'] },
  knowledgeMap: true,
  priorKnowledge: ['pgcd-taarif', 'khwarizmiyat-iqlidus', 'qawaid-qisma'],
  resources: [
    { kind: 'manipulation', code: 'coprime-17-18', type: 'coprime-explorer', module: 1, title: 'هل 17 و 18 أوليان فيما بينهما؟', learningPointIds: ['4am_awwaliyan-fima-baynahuma_P1', '4am_awwaliyan-fima-baynahuma_P3'], sourceElementIds: ['act-7'] },
  ],
  modules: [
    { id: '01', number: 1, slug: '17-wa-18', path: `${LESSON_BASE_PATH}/17-wa-18`,
      title: 'نشاط 7 — 17 و 18، 22 و 35، ومريم', desc: 'لماذا PGCD(17 ; 18) = 1؟ هل مريم على صواب بشأن 27 و 36؟',
      stage: 'trigger', teachesLearningPointIds: ['4am_awwaliyan-fima-baynahuma_P1', '4am_awwaliyan-fima-baynahuma_P3'], color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أتوقّع وأكشف' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — التعريف', desc: 'أوليان فيما بينهما يعني PGCD(a ; b) = 1. مثال الكتاب: 22 و 15.',
      stage: 'discovery', teachesLearningPointIds: ['4am_awwaliyan-fima-baynahuma_P1', '4am_awwaliyan-fima-baynahuma_P2'], color: 'violet', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 23 ← 27 و 39.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_awwaliyan-fima-baynahuma_P2', '4am_awwaliyan-fima-baynahuma_P3'], color: 'amber', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إتقان', desc: 'خمس أسئلة تُقيّم نقاط التعلّم الثلاث.', stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
