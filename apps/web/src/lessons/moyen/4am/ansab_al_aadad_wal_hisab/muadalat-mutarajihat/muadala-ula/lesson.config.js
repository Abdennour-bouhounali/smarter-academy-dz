/**
 * الدرس 1 — حل معادلة من الدرجة الأولى بمجهول واحد
 * Unité 4 du manuel (4AM) : نشاط 1 (p. 44), معارف 1 (p. 46), طرائق p. 47 (حل معادلة من
 * الدرجة الأولى بمجهول واحد, دوري الآن 1), exercices 1 → 9 (p. 50), « أستعدّ » items 1–2
 * (p. 43), l'aparté du خوارزمي (p. 43, repris), QCM 1 et 2 (p. 52),
 * puis trois « مسائل » de la plateforme (modules 5–7).
 * Source de vérité : docs/sources/4am/unit4/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/muadala-ula';

export const LESSON_CONFIG = {
  id: 'muadala-ula',
  kind: 'lesson',
  unit: 'muadalat-mutarajihat',
  unitTitle: 'معادلات ومتراجحات من الدرجة الأولى بمجهول واحد',
  sequentialUnlock: true,
  title: 'حل معادلة من الدرجة الأولى بمجهول واحد',
  description: 'حل معادلة من الدرجة الأولى بمجهول واحد بإجراء العمليات نفسها على طرفيها: نقل المجاهيل إلى طرف والمعاليم إلى الطرف الآخر وتجميع الحدود المتشابهة حتى الشكل ax = b حيث a ≠ 0، ثم استخراج الحل الوحيد b/a والتحقق منه بالتعويض.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '⚖️',
  estimatedDurationMin: 52,
  textbookRef: { unit: 4, activity: 1, pages: '43, 44, 46, 47, 50, 52' },
  skills: [
    'ترجمة برنامج حساب إلى عبارة جبرية ثم إلى معادلة',
    'إجراء العملية نفسها على طرفي معادلة للحصول على معادلة لها الحل نفسه',
    'نقل المجاهيل إلى طرف والمعاليم إلى الطرف الآخر وتجميع الحدود المتشابهة حتى الشكل ax = b',
    'استخراج الحل الوحيد b/a للمعادلة ax = b حيث a ≠ 0، والتحقق منه بالتعويض',
  ],
  teachingScope: {
    include: [
      'برنامج الحساب ومعادلتا فاطمة ومصطفى (نشاط 1)',
      'المعادلة ax = b حيث a ≠ 0 وحلها الوحيد b/a (معارف 1)',
      'طريقة الكتاب ص 47: إضافة عدد أو طرحه من الطرفين، نقل المجاهيل والمعاليم، القسمة على المعامل',
      'معادلات بمعاملات عشرية أو كسرية أو جذرية، وبعد النشر والتبسيط (تمارين 1 ← 9)',
      'التحقق من الحل بالتعويض في المعادلة الأولى',
    ],
    exclude: [
      'معادلات الجداء المعدوم (الدرس 2)',
      'المتراجحات (الدرس 3)',
      'ترييض المشكلات (الدرس 4)',
      'نظرية المعادلات التي ليس لها حل أو لها ما لا نهاية من الحلول: نكتفي بملاحظة أنّه لا يوجد أي عدد يحقّق المساواة',
    ],
  },
  // « مسألة الدرس » : montrée dès le sommaire et rappelée au module 1 (la balance du
  // vestiaire du niveau متقدم, d'autres nombres, l'inconnue dans les deux plateaux),
  // résolue au module 5 (content/problems.js).
  lessonProblem: {
    module: 5,
    title: 'ميزان غرفة الملابس: أكياس في الكفّتين',
    statement: 'في غرفة ملابس فريق كرة القدم، وقد حافظ اللاعبون على نظافتها وترتيبها، ميزان بكفّتين، وأكياس مغلقة متماثلة في كل منها العدد نفسه من الكرات. الكرة تزن $1$ ، والبالون المنفوخ يشدّ الكفّة إلى الأعلى فيزن $-1$ ، والكيس يزن ما فيه: $x$. وضع المدرّب في الكفّة اليسرى 7 أكياس و 4 بالونات، وفي الكفّة اليمنى كيسين و 26 كرة، فتوازن الميزان. في الفريق 22 لاعبًا. اشترى النادي الكرات التي في الأكياس التسعة بـ 70200 دج، وكل الكرات لها الثمن نفسه.',
    illustration: { kind: 'scene', icon: 'sack', bg: 'violet', chips: [{ label: 'يسار: أكياس', value: 7 }, { label: 'يسار: بالونات', value: 4 }, { label: 'يمين: أكياس', value: 2 }, { label: 'يمين: كرات', value: 26 }], extra: ['ball', 'sack'], ariaLabel: 'ميزان بكفّتين: في اليسرى 7 أكياس و 4 بالونات، وفي اليمنى كيسان و 26 كرة' },
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : tester une égalité par substitution (manuel,
  // items 1–2), les opérations sur les deux membres d'une égalité, le نشر et le تبسيط
  // (leçon nashr-tabsit).
  priorKnowledge: ['taawid-musawat', 'amaliyat-tarafayn', 'nashr-tabsit'],
  resources: [
    // Le module 1 ouvre sur la BALANCE du vestiaire (equation-balance). متقدم = le نشاط 1,
    // س 3 (فاطمة : 9x + 1 = −26), ouvert par défaut ; مبتدئ = 3x + 2 = 11 (plateforme).
    {
      kind: 'manipulation', code: 'balance-3x-2-11', type: 'equation-balance', module: 1,
      level: 'beginner',
      title: 'ميزان: 3 أكياس وكرتان مقابل 11 كرة',
      objective: 'حل معادلة من الدرجة الأولى بإجراء العملية نفسها على طرفيها حتى الشكل ax = b ثم x = b/a',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'football' },
      learningPointIds: ['4am_muadala-ula_P2', '4am_muadala-ula_P1'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'balance-9x-1-m26', type: 'equation-balance', module: 1,
      level: 'advanced',
      title: 'ميزان فاطمة: 9 أكياس وكرة مقابل 26 بالونًا',
      objective: 'حل معادلة من الدرجة الأولى بإجراء العملية نفسها على طرفيها حتى الشكل ax = b ثم x = b/a',
      autonomy: 'لا توجد كرة في الكفّة اليمنى لتؤخذ: على التلميذ أن يكتشف وحده أنّ وضع بالون هو العملية نفسها (طرح 1)، وأنّ الكيس يحتوي على بالونات (حل سالب) — دون أي اقتراح للخطوات',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'football' },
      learningPointIds: ['4am_muadala-ula_P2', '4am_muadala-ula_P1'],
      sourceElementIds: ['act-1'],
    },
    // معارف 1 : l'exemple du livre 4x − 3 = 2x + 6, posé en laboratoire travaillé (un niveau).
    {
      kind: 'manipulation', code: 'balance-4x-3-2x-6', type: 'equation-balance', module: 2,
      title: 'مثال الكتاب على الميزان: 4x − 3 = 2x + 6',
      learningPointIds: ['4am_muadala-ula_P1', '4am_muadala-ula_P2'],
      sourceElementIds: ['know-1'],
    },
    // Modules 5–7 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 5, title: 'مسألة الدرس — ميزان غرفة الملابس: أكياس في الكفّتين', learningPointIds: ['4am_muadala-ula_P2', '4am_muadala-ula_P1'] },
    { kind: 'situation', code: 'masala-2', module: 6, title: 'مسألة — سيارات الأجرة في وهران: أيّ تسعيرة؟', learningPointIds: ['4am_muadala-ula_P2', '4am_muadala-ula_P1'] },
    { kind: 'situation', code: 'masala-3', module: 7, title: 'مسألة — نادي الإنترنت: بطاقة الاشتراك أم لا؟', learningPointIds: ['4am_muadala-ula_P2', '4am_muadala-ula_P1'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: اختبار مساواة بتعويض المجهول، العمليات على طرفي مساواة، والنشر والتبسيط. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 1 — برنامج حساب', desc: 'أبقِ ميزان غرفة الملابس متوازنًا حتى تعرف ما في كيس واحد، ثم برنامج الحساب وعددا فاطمة ومصطفى.',
      stage: 'trigger', teachesLearningPointIds: ['4am_muadala-ula_P1', '4am_muadala-ula_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أوازن الميزان' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — المعادلة ax = b', desc: 'الشكل ax = b حيث a ≠ 0 وحلّه الوحيد b/a، ومثال الكتاب 4x − 3 = 2x + 6 على الميزان.',
      stage: 'discovery', teachesLearningPointIds: ['4am_muadala-ula_P1', '4am_muadala-ula_P2'],
      color: 'violet', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'tarayiq', path: `${LESSON_BASE_PATH}/tarayiq`,
      title: 'طرائق — حل معادلة', desc: 'حلّا الكتاب ص 47 سطرًا سطرًا (2x − 5 = 8 ومعادلة بمعاملات عشرية)، ثم دوري الآن.',
      stage: 'formalization', teachesLearningPointIds: ['4am_muadala-ula_P2', '4am_muadala-ula_P1'],
      color: 'emerald', style: 'featured', estimatedMin: 9, difficulty: 3, actionText: 'أتعلّم الطريقة' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 1 ← 9: من ax = b إلى معادلات تُنشر وتُبسَّط، ومعادلة لا يحقّقها أي عدد.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_muadala-ula_P1', '4am_muadala-ula_P2'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 3, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '05', number: 5, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — ميزان غرفة الملابس', desc: 'مسألة الدرس: أكياس في الكفّتين، ثم أكياس من البالونات، ثم ثمن الكرة. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_muadala-ula_P2', '4am_muadala-ula_P1'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — سيارات الأجرة', desc: 'ثلاث تسعيرات في وهران: كم كيلومترًا؟ متى تتساوى الأجرتان؟ وأيّها أرخص إلى المطار؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_muadala-ula_P2', '4am_muadala-ula_P1'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — نادي الإنترنت', desc: 'بطاقة اشتراك أم لا؟ نتحقّق من ادّعاء بالتعويض، ثم معادلة فيها أقواس.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_muadala-ula_P2', '4am_muadala-ula_P1'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم الكفاءتين، منها سؤالان من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
