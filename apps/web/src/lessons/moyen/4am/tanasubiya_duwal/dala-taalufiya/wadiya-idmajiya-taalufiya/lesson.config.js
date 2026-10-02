/**
 * أدمج تعلّماتي — الوحدة 7 « الدالة التآلفية » (kind: synthesis)
 * Le manuel fourni (pp. 77–79) n'a ni « أدمج تعلّماتي », ni « أؤكّد تعلّماتي », ni « أتعمّق » pour cette
 * unité : la situation (رحلة إلى شاطئ تيبازة), le QCM et les problèmes sont des AJOUTS DÉCLARÉS de la
 * plateforme (`addition('synthesis_generation')`, content/*.js). Ce n'est PAS un sixième درس : c'est la
 * synthèse de l'unité, qui mobilise les cinq دروس (chaque partie renvoie au sien).
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/tanasubiya_duwal/wadiya-idmajiya-taalufiya';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-taalufiya',
  kind: 'synthesis',
  unit: 'dala-taalufiya',
  unitTitle: 'الدالة التآلفية',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — الدالة التآلفية',
  description: 'إدماج موارد الوحدة في وضعية مركبة: رحلة القسم إلى شاطئ تيبازة (عدد المشاركين بجملة معادلتين تُقرأ بيانيا، ثمن الحافلة دالة تآلفية، عرض ناقل ثانٍ من عددين وصورتيهما، المقارنة بنقطة تقاطع المستقيمين، ثم اختيار صيغة كراء القوارب بين ثلاث صيغ)، يليها اختبار «أؤكّد تعلّماتي» الذي يعيد كل سؤال إلى درسه، ثم تمارين «أتعمّق».',
  level: 'moyen',
  grade: '4am',
  chapter: 'tanasubiya_duwal',
  chapterTitle: 'ميدان التناسبية والدوال',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🏖️',
  estimatedDurationMin: 50,
  textbookRef: { unit: 7, pages: '77, 78, 79' },
  skills: [
    'تجنيد موارد الوحدة (الدالة التآلفية، الدالة الخطية، التفسير البياني لجملة معادلتين، والمفاضلة بين الصيغ) لحل وضعية مركبة',
    'تحليل وضعية واقعية مركبة ونمذجة معطياتها: عدد المشاركين، ثمن الحافلة، وصيغ كراء القوارب',
    'اختيار استراتيجية جبرية أو بيانية لكل جزء، ثم تفسير النتائج في سياق الوضعية (عدد طبيعي، بالدينار، في حدود المبلغ المتاح)',
  ],
  teachingScope: {
    include: ['أدمج تعلّماتي: وضعية رحلة إلى شاطئ تيبازة وتحليلها في ثلاث مراحل', 'أؤكّد تعلّماتي: 8 أسئلة يعيد كل منها إلى درسه', 'أتعمّق: باقتا الإنترنت، بطارية الهاتف، قاعة الرياضة'],
    exclude: ['أي مفهوم جديد', 'الحل الجبري للمتراجحات خارج سياق المفاضلة'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la situation, « أؤكّد تعلّماتي » et « أتعمّق » mobilisent, diagnostiqué par « أستعدّ »
  // (affirmations de la plateforme), une ressource par درس : image et antécédent, famille تآلفية /
  // خطية / ثابتة (درس 1) ; ترتيب عند المبدأ et معامل التوجيه lus sur la droite (درس 2) ; تناسب
  // التغيّرات (درس 3) ; la solution d'une جملة = le point d'intersection (درس 4) ; comparer deux tarifs (درس 5).
  priorKnowledge: ['sura-taalufiya', 'adad-sura', 'naw-dala', 'tartib-mabda', 'muamil-tawjih', 'tanasub-taghayyurat', 'taqatu-jumla', 'mufadala'],
  resources: [
    { kind: 'situation', code: 'situation-rihla-tipaza', module: 1, title: 'وضعية: رحلة إلى شاطئ تيبازة', learningPointIds: ['4am_wadiya-idmajiya-taalufiya_P1', '4am_wadiya-idmajiya-taalufiya_P2'] },
    // Module 1 — les tarifs comparés (plan-compare, RÉUTILISÉ de « حل مشكلات وترييض وضعيات بتوظيف الدالة
    // التآلفية », monde `rental`) : la mathématique est l'objectif 8 de l'unité (p. 77) « إنجاز تمثيل
    // بياني لوضعية يتدخل فيها مقداران أحدهما معطى بدلالة الآخر، قراءته وتفسيره ».
    {
      kind: 'manipulation', code: 'plan-compare-darrajat', type: 'plan-compare', module: 1, level: 'beginner',
      title: 'كراء دراجة: رسم ثابت 200 DA و 50 DA للساعة، أو 100 DA للساعة',
      objective: 'المفاضلة بين صيغ تآلفية بدلالة عدد الساعات: نقطة تقاطع المستقيمين حيث تتساوى التكلفتان، والصيغة الأرخص قبلها وبعدها',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'rental' },
      learningPointIds: ['4am_wadiya-idmajiya-taalufiya_P1'],
      sourceElementIds: ['objectives'],
    },
    {
      kind: 'manipulation', code: 'plan-compare-kayak', type: 'plan-compare', module: 1, level: 'advanced',
      title: 'كراء قارب كاياك: ثلاث صيغ 150x و 50x + 300 و 600',
      objective: 'المفاضلة بين صيغ تآلفية بدلالة عدد الساعات: نقطة تقاطع المستقيمين حيث تتساوى التكلفتان، والصيغة الأرخص قبلها وبعدها',
      autonomy: 'ثلاث صيغ بدل اثنتين ودون مرحلة النمذجة الموجّهة: التلميذ يجد بنفسه نقطتي التقاطع المفيدتين (3 و 6 ساعات) ويقسّم عدد الساعات إلى ثلاثة مجالات، ثم يقرّر الصيغة الأنسب لـ 5 ساعات',
      experience: { type: 'platform_context', reason: 'larger_numbers_for_autonomy', theme: 'rental' },
      learningPointIds: ['4am_wadiya-idmajiya-taalufiya_P1', '4am_wadiya-idmajiya-taalufiya_P2'],
      sourceElementIds: ['objectives'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ثماني عبارات: صحيح أم خاطئ؟ الصورة والعدد الذي صورته، الترتيب عند المبدأ ومعامل التوجيه، تناسب التغيّرات، الجملة بيانيا، والمقارنة بين صيغتين.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'الوضعية وتحليلها', desc: 'رحلة إلى شاطئ تيبازة: عدد المشاركين بيانيا، ثمن ناقلين نقارنهما بنقطة التقاطع، ثم ثلاث صيغ لكراء قارب كاياك على المخبر — وهل يكفي المبلغ المتبقّي؟',
      stage: 'trigger', teachesLearningPointIds: ['4am_wadiya-idmajiya-taalufiya_P1', '4am_wadiya-idmajiya-taalufiya_P2'],
      color: 'amber', style: 'featured', estimatedMin: 18, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '02', number: 2, slug: 'uakkid', path: `${LESSON_BASE_PATH}/uakkid`,
      title: 'أؤكّد تعلّماتي', desc: 'ثمانية أسئلة على الدروس الخمسة؛ عند الحاجة أعود إلى الدرس.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-taalufiya_P1'], color: 'sky', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أؤكّد' },
    { id: '03', number: 3, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'مستقيمان متوازيان (باقتا الإنترنت)، دالة متناقصة (بطارية الهاتف)، ومتراجحة بعدد طبيعي (قاعة الرياضة).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-taalufiya_P1', '4am_wadiya-idmajiya-taalufiya_P2'],
      color: 'rose', style: 'featured', estimatedMin: 10, difficulty: 4, actionText: 'أتعمّق' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'رحلة أخرى إلى شاطئ الصابلات: عدد المشاركين، دستور ثمن ناقل، المقارنة، صيغة الكراء، وأكبر عدد من التلاميذ في حدود المبلغ.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 4, actionText: 'أحلّ' },
  ],
};
