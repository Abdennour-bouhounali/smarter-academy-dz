/**
 * الدرس 5 — تعيين القاسم المشترك الأكبر لعددين طبيعيين
 * Manuel 4AM, unité 1 : activité 5 (p. 8), معارف 4 نتائج مباشرة (p. 12), exercices 17, 18 (p. 14), 22 (p. 15).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/tayin-pgcd';

export const LESSON_CONFIG = {
  id: 'tayin-pgcd',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  title: 'تعيين القاسم المشترك الأكبر لعددين طبيعيين',
  description: 'تعيين القاسم المشترك الأكبر لعددين بحصر قواسم كل عدد ثم القواسم المشتركة ثم أكبرها، والنتائج المباشرة: PGCD(a ; a) = a، PGCD(a ; 0) = a، PGCD(a ; b) = PGCD(b ; a).',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 3,
  masteryThreshold: 0.8,
  emoji: '🎯',
  estimatedDurationMin: 40,
  textbookRef: { unit: 1, activity: 5, pages: '8, 12, 14, 15' },
  skills: [
    'تعيين PGCD (a ; b) بحصر قواسم كل عدد ثم القواسم المشتركة ثم أكبرها',
    'استعمال النتائج المباشرة: PGCD(a ; a) = a، PGCD(a ; 0) = a، PGCD(a ; b) = PGCD(b ; a)',
    'معرفة أن PGCD (a ; b) = b عندما يكون b قاسما للعدد a',
  ],
  teachingScope: { include: ['تعيين PGCD بحصر القواسم (42 و 60)', 'النتائج المباشرة الأربع'], exclude: ['الفروق المتتابعة وخوارزمية إقليدس (الدرس 6)'] },
  knowledgeMap: true,
  priorKnowledge: ['pgcd-taarif', 'tariqa-qawasim'],
  resources: [
    { kind: 'manipulation', code: 'common-divisors-42-60', type: 'common-divisors', module: 1, title: 'قواسم 42 و 60: من القائمتين إلى PGCD',
      learningPointIds: ['4am_tayin-pgcd_P1'], sourceElementIds: ['act-5'] },
    { kind: 'method', code: 'method-hasr', module: 1, title: 'طريقة: حصر القواسم ثم القواسم المشتركة ثم أكبرها', learningPointIds: ['4am_tayin-pgcd_P1'], sourceElementIds: ['act-5'] },
  ],
  modules: [
    { id: '01', number: 1, slug: '42-wa-60', path: `${LESSON_BASE_PATH}/42-wa-60`,
      title: 'نشاط 5 — 42 و 60', desc: 'أوجد قواسم كل عدد، ثم القواسم المشتركة، ثم أكبرها.',
      stage: 'trigger', teachesLearningPointIds: ['4am_tayin-pgcd_P1'], color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أعيّن' },
    { id: '02', number: 2, slug: 'nataij-mubashira', path: `${LESSON_BASE_PATH}/nataij-mubashira`,
      title: 'معارف — نتائج مباشرة', desc: 'PGCD(a ; a)، PGCD(a ; 0)، PGCD(a ; b) عندما يكون b قاسمًا لـ a، والتبديل.',
      stage: 'discovery', teachesLearningPointIds: ['4am_tayin-pgcd_P2', '4am_tayin-pgcd_P3'], color: 'violet', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 17، 18 و 22.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_tayin-pgcd_P1', '4am_tayin-pgcd_P3'], color: 'amber', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إتقان', desc: 'أربع أسئلة تُقيّم نقاط التعلّم الثلاث.', stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
