/**
 * الدرس 6 — البحث عن القاسم المشترك الأكبر لعددين طبيعيين
 * Manuel 4AM, unité 1 : activité 6 أ/ب (p. 9), معارف 4 خاصيتان (p. 12), طرائق p. 13 (الفروق المتتابعة، خوارزمية إقليدس),
 * دوري الآن p. 13 (1), exercices 19, 20, 21 (p. 14), et le تحدّ d'ouverture (p. 7).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/bahth-pgcd';

export const LESSON_CONFIG = {
  id: 'bahth-pgcd',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  title: 'البحث عن القاسم المشترك الأكبر لعددين طبيعيين',
  description: 'البحث عن القاسم المشترك الأكبر لعددين بخوارزمية الفروق المتتابعة ثم بخوارزمية عمليات القسمات المتتابعة (خوارزمية إقليدس)، مع تبرير كل خطوة بالخاصيتين PGCD(a ; b) = PGCD(b ; a − b) و PGCD(a ; b) = PGCD(b ; r).',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🔁',
  estimatedDurationMin: 65,
  textbookRef: { unit: 1, activity: 6, pages: '7, 9, 12, 13, 14' },
  skills: [
    'تبرير المساواة PGCD(a ; b) = PGCD(b ; a − b) واستعمالها',
    'حساب القاسم المشترك الأكبر بخوارزمية الفروق المتتابعة (آخر فرق غير معدوم)',
    'تبرير المساواة PGCD(a ; b) = PGCD(b ; r) واستعمالها',
    'حساب القاسم المشترك الأكبر بخوارزمية إقليدس (آخر باقٍ غير معدوم)',
    'مقارنة الخوارزميتين من حيث عدد الخطوات واختيار الأنسب',
  ],
  teachingScope: { include: ['الخاصيتان وخوارزميتا الكتاب', 'مقارنة عدد الخطوات (765 و 135)'], exclude: ['التحليل إلى عوامل أولية', 'المضاعف المشترك الأصغر (غير وارد في البرنامج)'] },
  knowledgeMap: true,
  priorKnowledge: ['khassiya-1', 'khassiya-2', 'pgcd-taarif'],
  resources: [
    { kind: 'manipulation', code: 'pgcd-differences-252-140', type: 'pgcd-differences', module: 1, title: 'الفروق المتتابعة: 252 و 140', learningPointIds: ['4am_bahth-pgcd_P1', '4am_bahth-pgcd_P2'], sourceElementIds: ['act-6a'] },
    { kind: 'method', code: 'method-differences-117-91', module: 2, title: 'طريقة: خوارزمية الفروق المتتابعة (117 و 91)', learningPointIds: ['4am_bahth-pgcd_P2'], sourceElementIds: ['method-differences'] },
    { kind: 'manipulation', code: 'euclid-765-135', type: 'euclidean-algorithm', module: 3, title: 'خوارزمية إقليدس: 765 و 135 (3 قسمات بدل 8 خطوات)', learningPointIds: ['4am_bahth-pgcd_P3', '4am_bahth-pgcd_P4', '4am_bahth-pgcd_P5'], sourceElementIds: ['act-6b'] },
    { kind: 'method', code: 'method-euclid-1938-836', module: 3, title: 'طريقة: خوارزمية إقليدس (836 و 1938)', learningPointIds: ['4am_bahth-pgcd_P4'], sourceElementIds: ['method-euclid'] },
    { kind: 'situation', code: 'challenge-936-845', module: 4, title: 'تحدّ: 936 مئزرًا ورديًا و 845 مئزرًا أزرقًا', learningPointIds: ['4am_bahth-pgcd_P5'], sourceElementIds: ['challenge'] },
  ],
  modules: [
    { id: '01', number: 1, slug: 'al-furuq', path: `${LESSON_BASE_PATH}/al-furuq`,
      title: 'نشاط 6 أ — الفروق المتتابعة', desc: '252 و 140: اطرح، وعوّض، وأعد — إلى أن يصير الفرق معدومًا.',
      stage: 'trigger', teachesLearningPointIds: ['4am_bahth-pgcd_P1', '4am_bahth-pgcd_P2'], color: 'indigo', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أطرح وأعيد' },
    { id: '02', number: 2, slug: 'khassiyatan', path: `${LESSON_BASE_PATH}/khassiyatan`,
      title: 'معارف — خاصيتان، وطريقة الفروق', desc: 'PGCD(a ; b) = PGCD(b ; a − b) و PGCD(a ; b) = PGCD(b ; r)، ثم مثال الكتاب 117 و 91.',
      stage: 'discovery', teachesLearningPointIds: ['4am_bahth-pgcd_P1', '4am_bahth-pgcd_P2', '4am_bahth-pgcd_P3'], color: 'violet', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أبرّر' },
    { id: '03', number: 3, slug: 'khwarizmiyat-iqlidus', path: `${LESSON_BASE_PATH}/khwarizmiyat-iqlidus`,
      title: 'نشاط 6 ب — خوارزمية إقليدس', desc: '765 و 135: ثمان خطوات بالفروق، ثلاث قسمات بإقليدس. ثم 836 و 1938.',
      stage: 'manipulation', teachesLearningPointIds: ['4am_bahth-pgcd_P3', '4am_bahth-pgcd_P4', '4am_bahth-pgcd_P5'], color: 'emerald', style: 'featured', estimatedMin: 15, difficulty: 3, actionText: 'أقسم وأعيد' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'دوري الآن (285 و 45)، تمارين 19 ← 21، والعودة إلى تحدّي المآزر.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_bahth-pgcd_P2', '4am_bahth-pgcd_P4', '4am_bahth-pgcd_P5'], color: 'amber', style: 'featured', estimatedMin: 14, difficulty: 3, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إتقان', desc: 'ست أسئلة تُقيّم نقاط التعلّم الخمس.', stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 8, difficulty: 4, actionText: 'أدخل التقويم' },
  ],
};
