/**
 * الدرس 8 — اختزال كسر
 * Manuel 4AM, unité 1 : أستعدّ 7–10 (p. 7), activité 8 (p. 9), معارف 6 (p. 12), طريقة الاختزال 595/560 (p. 13), دوري الآن p. 13 (2),
 * exercices 28–38, 40 (p. 15).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/ikhtizal-kasr';

export const LESSON_CONFIG = {
  id: 'ikhtizal-kasr',
  kind: 'lesson',
  unit: 'aadad-tabiiya-natiqa',
  unitTitle: 'الأعداد الطبيعيّة والأعداد النّاطقة',
  sequentialUnlock: true,
  title: 'اختزال كسر',
  description: 'اختزال كسر بالقسمة المتتابعة على قواسم مشتركة، التعرّف على الكسر غير القابل للاختزال، وكتابة كسر على الشكل غير القابل للاختزال بالقسمة على القاسم المشترك الأكبر.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '➗',
  estimatedDurationMin: 65,
  textbookRef: { unit: 1, activity: 8, pages: '7, 9, 12, 13, 15' },
  skills: [
    'اختزال كسر بالقسمة المتتابعة على قواسم مشتركة',
    'التعرّف على الكسر غير القابل للاختزال (بسطه ومقامه أوليان فيما بينهما)',
    'كتابة كسر على الشكل غير القابل للاختزال بالقسمة على القاسم المشترك الأكبر',
    'إعطاء نتيجة حساب على الأعداد الناطقة على شكل كسر غير قابل للاختزال',
  ],
  teachingScope: { include: ['اختزال خطوة بخطوة، والاختزال بـ PGCD في خطوة واحدة', 'الكسر غير القابل للاختزال ≡ بسط ومقام أوليان فيما بينهما'], exclude: ['التحليل إلى عوامل أولية', 'العمليات على الكسور كموضوع مستقل (مكتسب سابق)'] },
  knowledgeMap: true,
  // Acquis des années antérieures (أستعدّ 7–10) et du درس 7.
  priorKnowledge: ['al-aadad-al-natiqa', 'awwaliyan-taarif', 'khwarizmiyat-iqlidus'],
  resources: [
    // Module 1 — workspace à deux niveaux. Réduire, c'est diviser les deux
    // termes par un diviseur COMMUN jusqu'à ce qu'il n'en reste plus. Le
    // kasr est DESSINÉ en recette (thème `kitchen`) : diviser par k, c'est
    // répartir sucre et farine en k parts identiques et lire UNE part. Les
    // nombres du manuel sont gardés ; la situation est une adaptation
    // déclarée de la plateforme.
    //   مبتدئ  — 12/18 : peu de chemins, l'idée nue.
    //   متقدم  — 84/48, le kasr de سمير : plusieurs chemins, et la question
    //            « أي الطريقين أوفر؟ » qui donne son sens au PGCD.
    { kind: 'manipulation', code: 'fraction-reduction-12-18', type: 'fraction-reduction', module: 1,
      level: 'beginner',
      title: 'وصفة صغيرة: 12 ملعقة سكّر لـ 18 كوب دقيق (12/18)',
      objective: 'اختزال كسر = القسمة على قاسم مشترك؛ نتوقف عندما لا يبقى قاسم مشترك أكبر من 1',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'smaller_numbers_for_first_contact', theme: 'kitchen' },
      learningPointIds: ['4am_ikhtizal-kasr_P1'], sourceElementIds: ['act-8'] },
    { kind: 'manipulation', code: 'fraction-reduction-84-48', type: 'fraction-reduction', module: 1,
      level: 'advanced',
      title: 'اختزال الكسر 84/48 كما فعل سمير',
      objective: 'اختزال كسر = القسمة على قاسم مشترك؛ نتوقف عندما لا يبقى قاسم مشترك أكبر من 1',
      autonomy: 'عدّة قواسم مشتركة ممكنة في كل خطوة: التلميذ يختار طريقه ويقارن عدد الخطوات',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'kitchen' },
      learningPointIds: ['4am_ikhtizal-kasr_P1', '4am_ikhtizal-kasr_P2', '4am_ikhtizal-kasr_P3'], sourceElementIds: ['act-8'] },
    { kind: 'method', code: 'method-reduce-595-560', module: 2, title: 'طريقة: استعمال PGCD لكتابة كسر على الشكل غير القابل للاختزال', learningPointIds: ['4am_ikhtizal-kasr_P3'], sourceElementIds: ['method-reduce'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`, title: 'أستعدّ', desc: 'أربع عبارات من الكتاب عن الأعداد الناطقة: صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'samir', path: `${LESSON_BASE_PATH}/samir`, title: 'نشاط 8 — كيف اختزل سمير 84/48؟', desc: '÷4 ثم ÷3 … لماذا لا يمكن مواصلة اختزال 7/4؟',
      stage: 'trigger', teachesLearningPointIds: ['4am_ikhtizal-kasr_P1', '4am_ikhtizal-kasr_P2'], color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أختزل' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`, title: 'معارف — الكسور غير القابلة للاختزال، وطريقة PGCD', desc: 'التعريف، ملاحظة الكتاب، 15/22 و 28/42، ثم 595/560 بإقليدس.',
      stage: 'discovery', teachesLearningPointIds: ['4am_ikhtizal-kasr_P2', '4am_ikhtizal-kasr_P3'], color: 'violet', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif-1', path: `${LESSON_BASE_PATH}/awazzif-1`, title: 'أوظّف تعلّماتي (1)', desc: '188/252، دوري الآن 915/372، وتمارين 28، 34، 35، 36.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_ikhtizal-kasr_P3'], color: 'amber', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'awazzif-2', path: `${LESSON_BASE_PATH}/awazzif-2`, title: 'أوظّف تعلّماتي (2)', desc: 'كسور بحرف n، وحساب على الأعداد الناطقة: تمارين 29 ← 33، 37، 38، 40.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_ikhtizal-kasr_P2', '4am_ikhtizal-kasr_P4'], color: 'rose', style: 'featured', estimatedMin: 14, difficulty: 3, actionText: 'أتدرّب أكثر' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`, title: 'إختبار أولي', desc: 'خمس أسئلة تُقيّم نقاط التعلّم الأربع.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
