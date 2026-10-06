/**
 * الدرس 1 — مفهوم جملة معادلتين من الدرجة الأولى بمجهولين
 * Unité 5 du manuel (4AM) : تحدّ (p. 55, repris), « أستعدّ » items 1–8 (p. 55), نشاط 1 (p. 56),
 * معارف 1, 2 et حالات خاصة (p. 58), exercices 1 → 4 (p. 60), QCM 1 → 4 (p. 62),
 * puis trois « مسائل » de la plateforme (modules 4–6).
 * Source de vérité : docs/sources/4am/unit5/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/mafhum-jumla';

export const LESSON_CONFIG = {
  id: 'mafhum-jumla',
  kind: 'lesson',
  unit: 'jumal-muadalatayn',
  unitTitle: 'جمل معادلتين من الدرجة الأولى بمجهولين',
  sequentialUnlock: true,
  title: 'مفهوم جملة معادلتين من الدرجة الأولى بمجهولين',
  description: 'التعرف على جملة معادلتين من الدرجة الأولى بمجهولين x و y من الشكل { ax + by = c ; a\'x + b\'y = c\' }، وإدراك أن حلها ثنائية (x ; y) تحقق المعادلتين في آن واحد: اختبار ثنائية معطاة بالتعويض، والتمييز بين جملة تقبل حلا وحيدا وجملة ليس لها حل وجملة لها عدد غير منته من الحلول.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '⚽',
  estimatedDurationMin: 50,
  textbookRef: { unit: 5, activity: 1, pages: '55, 56, 58, 60, 62' },
  skills: [
    'التعرف على جملة معادلتين من الدرجة الأولى بمجهولين ومعاملاتها',
    'إدراك أن حل الجملة ثنائية (x ; y) تحقق المعادلتين في آن واحد، وأن الترتيب في الثنائية مهم',
    'اختبار ثنائية معطاة بالتعويض في معادلتي الجملة',
    'التمييز بين جملة لها حل وحيد وجملة ليس لها حلول وجملة لها عدد غير منته من الحلول',
  ],
  teachingScope: {
    include: [
      'نشاط 1: العمّال الـ 32 قبل التقاعد وبعده، وترجمته بالمعادلتين x + y = 32 و 2(x − 5) = y − 3',
      'تعريف جملة معادلتين من الدرجة الأولى بمجهولين ومعاملاتها (معارف 1)',
      'تعريف حل الجملة: ثنائية تحقق المعادلتين في آن واحد، والترتيب في الثنائية (معارف 2)',
      'اختبار ثنائية بالتعويض في معادلة وفي جملة (تمارين 1 ← 4)',
      'الحالات الخاصة: معادلتان تؤولان إلى معادلة واحدة، ومعادلتان متناقضتان (معارف، حالات خاصة)',
      'تحدّ القسم (37 قطعة و 610DA) بالتجريب على لوحة الشرطين',
    ],
    exclude: [
      'طريقتا التعويض والجمع لحل جملة جبريا (الدرس 2)',
      'ترييض مشكلة بجملة معادلتين وخطواتها الخمس (الدرس 3)',
      'الحل البياني لجملة معادلتين (ليس في الكتاب)',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique (items 1–8 du manuel, p. 55) : résoudre une équation
  // du premier degré à une inconnue (leçon muadala-ula), tester un nombre dans une équation,
  // remplacer DEUX lettres pour tester une égalité.
  priorKnowledge: ['hal-muadala-ula', 'taawid-qima', 'taawid-majhulayn'],
  // « مسألة الدرس » (MASAIL_GENERATION_GUIDE.md) : le monde du lab متقدم (les agents d'une مصلحة
  // avant et après le تقاعد, deux conditions à la fois) avec d'autres nombres — résolue au module 4.
  lessonProblem: {
    module: 4,
    title: 'مصلحة الحالة المدنية: 42 عاملًا وشرطان',
    statement: 'تشغّل مصلحة الحالة المدنية بإحدى البلديات 42 عاملًا، رجالًا ونساءً، وتستقبل المواطنين ابتداءً من الساعة 8 صباحًا. أُحيل 6 رجال و 4 نساء على التقاعد ولم يُعوَّضوا، فأصبح عدد الرجال بالمصلحة ثلاثة أضعاف عدد النساء. بعد ذلك قرّرت البلدية توظيف 10 عمّال جدد، بحيث يصبح عدد الرجال بالمصلحة ضعف عدد النساء.',
  },
  resources: [
    // Le module 1 ouvre sur le TABLEAU DES DEUX CONDITIONS (pair-scoreboard). متقدم = le نشاط 1
    // (32 agents), ouvert par défaut ; مبتدئ = la carte de saison d'un club (plateforme).
    {
      kind: 'manipulation', code: 'pair-scoreboard-season-10-22', type: 'pair-scoreboard', module: 1,
      level: 'beginner',
      title: 'بطاقة الموسم: 10 مباريات و 22 نقطة',
      objective: 'حل جملة معادلتين ثنائية (x ; y) تحقق المعادلتين في آن واحد، والترتيب في الثنائية مهم',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'football' },
      learningPointIds: ['4am_mafhum-jumla_P2', '4am_mafhum-jumla_P3'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'pair-scoreboard-staff-32', type: 'pair-scoreboard', module: 1,
      level: 'advanced',
      title: 'نشاط 1: 32 عاملا قبل التقاعد وبعده',
      objective: 'حل جملة معادلتين ثنائية (x ; y) تحقق المعادلتين في آن واحد، والترتيب في الثنائية مهم',
      autonomy: 'الشرط الثاني لا يُقرأ مباشرة على العدد: يقارن ما بقي بعد إحالة 5 رجال و 3 نساء على التقاعد (2(x − 5) = y − 3)، والأعداد كبيرة (حتى 32 لكل مجهول) لا تُعدّ بنظرة، ولا يُقترح على التلميذ أي ثنائية — ومنها فخّ الكتاب (24 ; 8) الذي يحقق الشرط الأول وحده',
      experience: { type: 'textbook', reason: '', theme: 'staff' },
      learningPointIds: ['4am_mafhum-jumla_P2', '4am_mafhum-jumla_P3'],
      sourceElementIds: ['act-1'],
    },
    // Le تحدّ de la page d'ouverture (p. 55), posé seul en fin de module 1 : même instrument,
    // monde de la cagnotte — le TRANSFERT (37 pièces, 610DA).
    {
      kind: 'manipulation', code: 'pair-scoreboard-coins-37-610', type: 'pair-scoreboard', module: 1,
      title: 'تحدّ القسم: 37 قطعة و 610DA',
      learningPointIds: ['4am_mafhum-jumla_P2', '4am_mafhum-jumla_P3'],
      sourceElementIds: ['challenge'],
    },
    { kind: 'situation', code: 'masala-1', module: 4, title: 'مسألة الدرس — مصلحة الحالة المدنية: 42 عاملًا', learningPointIds: ['4am_mafhum-jumla_P1', '4am_mafhum-jumla_P2', '4am_mafhum-jumla_P3'] },
    { kind: 'situation', code: 'masala-2', module: 5, title: 'مسألة — مكتبة الحيّ: كراريس كبيرة وصغيرة', learningPointIds: ['4am_mafhum-jumla_P1', '4am_mafhum-jumla_P2', '4am_mafhum-jumla_P3', '4am_mafhum-jumla_P4'] },
    { kind: 'situation', code: 'masala-3', module: 6, title: 'مسألة — مزرعة الدجاج والأرانب: رؤوس وأرجل', learningPointIds: ['4am_mafhum-jumla_P1', '4am_mafhum-jumla_P2', '4am_mafhum-jumla_P3'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ثماني عبارات من الكتاب: حل معادلة بمجهول واحد، واختبار عدد بالتعويض، وتعويض حرفين معًا. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 1 — 32 عاملا وشرطان', desc: 'حرّك عدد الرجال وعدد النساء حتى تُضيء لوحتا الشرطين معًا، ثم أسئلة النشاط وتحدّ القسم.',
      stage: 'trigger', teachesLearningPointIds: ['4am_mafhum-jumla_P2', '4am_mafhum-jumla_P3', '4am_mafhum-jumla_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 16, difficulty: 2, actionText: 'أجرّب الثنائيات' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — الجملة وحلّها', desc: 'تعريف جملة معادلتين ومعاملاتها، حل الجملة والترتيب في الثنائية، والحالتان الخاصتان.',
      stage: 'discovery', teachesLearningPointIds: ['4am_mafhum-jumla_P1', '4am_mafhum-jumla_P2', '4am_mafhum-jumla_P3', '4am_mafhum-jumla_P4'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 1 ← 4: ثنائيات تحقق معادلة، حلول كثيرة لمعادلة واحدة، وثنائية تحقق جملة.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_mafhum-jumla_P3', '4am_mafhum-jumla_P2'],
      color: 'amber', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — مصلحة الحالة المدنية', desc: 'مسألة الدرس: 42 عاملًا قبل التقاعد وبعده، ثم توظيف 10 عمّال. حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_mafhum-jumla_P1', '4am_mafhum-jumla_P2', '4am_mafhum-jumla_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '05', number: 5, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — مكتبة الحيّ في الدخول المدرسي', desc: 'كراريس كبيرة وصغيرة: أيّ تسجيل صحيح؟ وتصريح بمدخول مستحيل.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_mafhum-jumla_P1', '4am_mafhum-jumla_P2', '4am_mafhum-jumla_P3', '4am_mafhum-jumla_P4'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — مزرعة الدجاج والأرانب', desc: '50 رأسًا و 140 رِجلًا: قول خاطئ، تجريب، ثم ثمن البيع.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_mafhum-jumla_P1', '4am_mafhum-jumla_P2', '4am_mafhum-jumla_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ستة أسئلة تُقيّم الكفاءات الأربع، منها أربعة من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
