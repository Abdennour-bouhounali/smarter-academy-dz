/**
 * أدمج تعلّماتي — الوحدة 4 « معادلات ومتراجحات من الدرجة الأولى بمجهول واحد » (kind: synthesis)
 * Manuel 4AM, unité 4 : « أدمج تعلّماتي » (وضعية المسبح البلدي + تحليل الوضعية, p. 52).
 * Ce n'est PAS un cinquième درس : c'est la synthèse de l'unité, affichée après les quatre leçons.
 * Depuis le 2026-10-13 (schéma de l'unité 1, `wadiya-idmajiya-aadad`) : six وضعيات d'entraînement
 * (modules 1 à 6, content/problems.js, ajouts de la plateforme), « تحليل الوضعية النهائية للاختبار »
 * (module 7, la situation du مسبح lue et analysée, rien n'est résolu) puis « وضعية الاختبار النهائي »
 * (module 8, le test). Le QCM de fin d'unité (p. 52) et les exercices d'approfondissement (p. 53) ne font plus partie de la
 * synthèse (décision du propriétaire) ; les anciens modules 1 à 4 sont devenus 7, 0, 0 et 8
 * (remap {1→7, 2→0, 3→0, 4→8}).
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/wadiya-idmajiya-muadalat';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-muadalat',
  kind: 'synthesis',
  unit: 'muadalat-mutarajihat',
  unitTitle: 'معادلات ومتراجحات من الدرجة الأولى بمجهول واحد',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — المعادلات والمتراجحات',
  description: 'ست وضعيات تدريبية (مكتبة، ورقة نادي الرياضيات، حصّالتان، حديقة، رحلة، سجّادتان) تعبّئ المعادلات والجداء المعدوم والمتراجحات وتمثيل حلولها وترييض النص، ثم وضعية المسبح البلدي: صيغتان للاشتراك (75 دينارًا للحصة، أو 560 دينارًا سنويًا و 5 دنانير للحصة) نترجمهما بعبارتين حرفيتين ونقارنهما بمتراجحة، تحليلها ثم اختبار الوضعية النهائية.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🏊',
  estimatedDurationMin: 90,
  textbookRef: { unit: 4, pages: '52' },
  skills: [
    'حل ست وضعيات تدريبية من نوع الامتحان بتجنيد المعادلات والجداء المعدوم والمتراجحات وتمثيل حلولها',
    'تجنيد مكتسبات الوحدة (المعادلات، الجداء المعدوم، المتراجحات وتمثيل حلولها) لحل وضعيات مركبة وتنافسية',
    'ترجمة صيغ تسعير أو اشتراك بعبارات حرفية بدلالة عدد الحصص',
    'كتابة متراجحة للمفاضلة بين خيارين، حلها، وتفسير النتيجة للوصول إلى الخيار الأفضل',
  ],
  teachingScope: {
    include: ['ست وضعيات تدريبية حول المعادلات والمتراجحات', 'وضعية الاختبار النهائي: المسبح البلدي وتحليلها في ثلاث مراحل'],
    exclude: ['أي مفهوم جديد', 'المتراجحات من الدرجة الثانية (الحدود $x^2$ تختفي من الطرفين في كل تمارين الكتاب)'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que la situation mobilise, diagnostiqué par « أستعدّ » (affirmations de la
  // plateforme : les items du manuel sont ceux des leçons 1–3) : résoudre une équation (درس 1), le produit
  // nul (درس 2), résoudre une inéquation (درس 3) et la représenter (درس 3), traduire un texte (درس 4),
  // développer / factoriser (الوحدة 3).
  priorKnowledge: ['hall-muadala', 'jidaa-maadum-khassiya', 'hall-mutarajiha', 'tamthil-hulul', 'tarrid-tarjama', 'nashr-tahlil'],
  resources: [
    // Modules 1–6 — six وضعيات d'entraînement (content/problems.js), ajouts de la plateforme de type امتحان ;
    // le module 7 analyse la situation évaluée au module 8.
    { kind: 'situation', code: 'wadiya-1', module: 1, title: 'وضعية 1 — بطاقة المكتبة: 450x أم 3000 + 300x', learningPointIds: ['4am_wadiya-idmajiya-muadalat_P2', '4am_wadiya-idmajiya-muadalat_P1'] },
    { kind: 'situation', code: 'wadiya-2', module: 2, title: 'وضعية 2 — ورقة نادي الرياضيات: النشر والتحليل والمقارنة', learningPointIds: ['4am_wadiya-idmajiya-muadalat_P1'] },
    { kind: 'situation', code: 'wadiya-3', module: 3, title: 'وضعية 3 — حصّالتا سمير وياسين: 1200 + 150x و 800 + 250x', learningPointIds: ['4am_wadiya-idmajiya-muadalat_P2', '4am_wadiya-idmajiya-muadalat_P1'] },
    { kind: 'situation', code: 'wadiya-4', module: 4, title: 'وضعية 4 — حديقة يوم الشجرة: محيط 4x + 16', learningPointIds: ['4am_wadiya-idmajiya-muadalat_P2', '4am_wadiya-idmajiya-muadalat_P1'] },
    { kind: 'situation', code: 'wadiya-5', module: 5, title: 'وضعية 5 — رحلة النادي: شرطان على عدد المشاركين', learningPointIds: ['4am_wadiya-idmajiya-muadalat_P2', '4am_wadiya-idmajiya-muadalat_P1'] },
    { kind: 'situation', code: 'wadiya-6', module: 6, title: 'وضعية 6 — سجّادتا المصلّى: (x + 4)² و x(x + 10)', learningPointIds: ['4am_wadiya-idmajiya-muadalat_P1'] },
    { kind: 'situation', code: 'situation-masbah-baladi', module: 7, title: 'وضعية: المسبح البلدي', learningPointIds: ['4am_wadiya-idmajiya-muadalat_P2', '4am_wadiya-idmajiya-muadalat_P1'], sourceElementIds: ['situation'] },
    // Module 7 — la course des deux formules (growth-race, réutilisé de « ترييض مشكلة ») :
    // l'élève CONSTRUIT chaque formule en portant « × x » sur ce qui se paie à chaque séance,
    // puis ÉTIRE x (le nombre de séances) et voit les deux coûts se rejoindre puis se dépasser.
    {
      kind: 'manipulation', code: 'growth-race-masbah-hayy', type: 'growth-race', module: 7, level: 'beginner',
      title: 'مسبح الحيّ: 50x أم 200 + 10x؟',
      objective: 'المفاضلة بين صيغتين: نترجم كل صيغة بعبارة حرفية بدلالة عدد الحصص x، ونبحث عن الأعداد x التي تجعل إحداهما أقل تكلفة',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'smaller_numbers_for_first_contact', theme: 'pool' },
      learningPointIds: ['4am_wadiya-idmajiya-muadalat_P2'],
      sourceElementIds: ['situation'],
    },
    {
      kind: 'manipulation', code: 'growth-race-masbah-baladi', type: 'growth-race', module: 7, level: 'advanced',
      title: 'المسبح البلدي: 75x أم 560 + 5x؟',
      objective: 'المفاضلة بين صيغتين: نترجم كل صيغة بعبارة حرفية بدلالة عدد الحصص x، ونبحث عن الأعداد x التي تجعل إحداهما أقل تكلفة',
      autonomy: 'أرقام الكتاب كما هي: لا يلتقي الثمنان إلا بعد ثماني حصص، فيختار التلميذ بنفسه مدى التجريب ويقرّر متى تكفي محاولاته قبل لحظة التساوي وبعدها',
      experience: { type: 'textbook', reason: '', theme: 'pool' },
      learningPointIds: ['4am_wadiya-idmajiya-muadalat_P2', '4am_wadiya-idmajiya-muadalat_P1'],
      sourceElementIds: ['situation'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'سبع عبارات: صحيح أم خاطئ؟ المعادلة، الجداء المعدوم، المتراجحة وتمثيل حلولها، الترجمة، والتحليل.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    // Les وضعيات d'entraînement (track: 'problem') : practice_lab, avant la situation du مسبح (module 7)
    // et le test (module 8, toujours ouvert). Elles comptent dans la complétion, jamais dans la maîtrise —
    // docs/lessons/MASAIL_GENERATION_GUIDE.md, §14 (synthèses).
    { id: '01', number: 1, slug: 'wadiya-1', path: `${LESSON_BASE_PATH}/wadiya-1`,
      title: 'الوضعية التدريبية 1 — بطاقة المكتبة', desc: 'صيغتان لشراء الكتب (450x أو 3000 + 300x): تكلفة 12 كتابًا، ثم ابتداءً من أي عدد تكون الصيغة (ب) أفضل؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-muadalat_P1', '4am_wadiya-idmajiya-muadalat_P2'],
      color: 'sky', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '02', number: 2, slug: 'wadiya-2', path: `${LESSON_BASE_PATH}/wadiya-2`,
      title: 'الوضعية التدريبية 2 — ورقة نادي الرياضيات', desc: 'نشر عبارة وتحليلها، المعادلة E = 0، ثم المتراجحة E < B وتمثيل حلولها.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-muadalat_P1', '4am_wadiya-idmajiya-muadalat_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 7, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '03', number: 3, slug: 'wadiya-3', path: `${LESSON_BASE_PATH}/wadiya-3`,
      title: 'الوضعية التدريبية 3 — حصّالتا سمير وياسين', desc: 'متى يتساوى المبلغان؟ ومتى يتفوّق ياسين؟ وبعد كم أسبوعًا يكفي المجموع لشراء الكسوة؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-muadalat_P1', '4am_wadiya-idmajiya-muadalat_P2'],
      color: 'amber', style: 'featured', estimatedMin: 7, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '04', number: 4, slug: 'wadiya-4', path: `${LESSON_BASE_PATH}/wadiya-4`,
      title: 'الوضعية التدريبية 4 — حديقة يوم الشجرة', desc: 'محيط حديقة مستطيلة بدلالة x: معادلة (72 م من الشبك) ثم متراجحة (100 م على الأكثر).',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-muadalat_P1', '4am_wadiya-idmajiya-muadalat_P2'],
      color: 'emerald', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '05', number: 5, slug: 'wadiya-5', path: `${LESSON_BASE_PATH}/wadiya-5`,
      title: 'الوضعية التدريبية 5 — رحلة النادي', desc: 'تكلفة رحلة ومبلغ محصَّل: متراجحتان معًا تعيّنان عدد التلاميذ المشاركين.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-muadalat_P1', '4am_wadiya-idmajiya-muadalat_P2'],
      color: 'teal', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '06', number: 6, slug: 'wadiya-6', path: `${LESSON_BASE_PATH}/wadiya-6`,
      title: 'الوضعية التدريبية 6 — سجّادتا المصلّى', desc: 'مساحة مربّع ومستطيل: نشر، الفرق B − A، ثم المتراجحة B > A.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-muadalat_P1', '4am_wadiya-idmajiya-muadalat_P2'],
      color: 'rose', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '07', number: 7, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'تحليل الوضعية النهائية للاختبار', desc: 'المسبح البلدي: ابنِ عبارتي الصيغتين، مدّد عدد الحصص في السباق، واكتب المتراجحة التي تقارن بينهما — دون حلّ الوضعية بعد.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-muadalat_P2', '4am_wadiya-idmajiya-muadalat_P1'],
      color: 'amber', style: 'featured', estimatedMin: 16, difficulty: 3, actionText: 'أحلّل الوضعية' },
    { id: '08', number: 8, slug: 'ahill', path: `${LESSON_BASE_PATH}/ahill`,
      title: 'وضعية الاختبار النهائي', desc: 'خمس مراحل تُقيَّم: عبارتا الصيغتين، المتراجحة، حلها، لحظة التساوي، ثم الصيغة الأفضل.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 4, actionText: 'أحلّ' },
  ],
};
