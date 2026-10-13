/**
 * أدمج تعلّماتي — الوحدة 2 « الحساب على الجذور » (kind: synthesis)
 * Manuel 4AM, unité 2 : « أدمج تعلّماتي » (وضعية « زربية وادي سوف » + تحليل الوضعية, p. 28).
 * Ce n'est PAS un sixième درس : c'est la synthèse de l'unité, affichée après les cinq leçons.
 * Depuis le 2026-10-13 (décision du propriétaire, recette de l'unité 1) : six « وضعيات تدريبية » d'examen
 * (modules 1 à 6, content/problems.js) précèdent « تحليل الوضعية النهائية للاختبار » (7) et
 * « وضعية الاختبار النهائي » (8, l'évaluation : la زربية de وادي سوف). « أؤكّد تعلّماتي » (QCM, p. 28) ne fait plus
 * partie de la synthèse (décision du propriétaire, 2026-10-13).
 * La deuxième étape de l'analyse est affichée CORRIGÉE (décision du propriétaire,
 * 2026-09-30, extraction.json `situation.correction`) : la donnée parasite est le prix 12000DA.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/wadiya-idmajiya-judhur';

export const LESSON_CONFIG = {
  id: 'wadiya-idmajiya-judhur',
  kind: 'synthesis',
  unit: 'hisab-judhur',
  unitTitle: 'الحساب على الجذور',
  sequentialUnlock: true,
  title: 'أدمج تعلّماتي — الحساب على الجذور',
  description: 'وضعية إدماجية (زربية وادي سوف: مساحتها 24m² وطولها ضعف عرضها) تُعبّئ الجذر التربيعي وحل معادلة من الشكل x² = a والحساب على الجذور، تسبقها ست وضعيات تدريبية.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🧶',
  estimatedDurationMin: 30,
  textbookRef: { unit: 2, pages: '28' },
  skills: ['حل وضعية إدماجية بتوظيف الجذر التربيعي وحل معادلة من الشكل x² = a والحساب على الجذور'],
  teachingScope: {
    include: ['ست وضعيات تدريبية حول الجذر التربيعي والمعادلة x² = a والكتابة a√b', 'وضعية الاختبار النهائي: زربية وادي سوف وتحليلها في ثلاث مراحل'],
    exclude: ['أي مفهوم جديد'],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Ce que les situations mobilisent (« أستعدّ » diagnostique √a, x² = a et a√b) : √a (leçon 1), irrationnels et valeur
  // arrondie (2), x² = a (3), √(ab) et √(a/b) (4), a√b, somme de radicaux, mise du dénominateur sous forme rationnelle (5).
  priorKnowledge: ['jidhr-taarif', 'ghayr-natiq', 'qima-muqarraba', 'hulul-x2-a', 'jidaa-jidhrayn', 'qismat-jidhrayn', 'kitaba-a-jidhr-b', 'tabsit-tawzii', 'naqt-maqam'],
  resources: [
    { kind: 'situation', code: 'situation-zarbiya-wadi-souf', module: 7, title: 'وضعية: زربية وادي سوف', learningPointIds: ['4am_wadiya-idmajiya-judhur_P1'], sourceElementIds: ['situation'] },
    // Modules 1–6 — six وضعيات d'entraînement (content/problems.js), ajouts de la plateforme ;
    // le module 7 analyse la situation évaluée au module 8.
    { kind: 'situation', code: 'wadiya-1', module: 1, title: 'وضعية 1 — حديقة مربّعة مساحتها 180 م²: ضلعها وسياجها', learningPointIds: ['4am_wadiya-idmajiya-judhur_P1'] },
    { kind: 'situation', code: 'wadiya-2', module: 2, title: 'وضعية 2 — سلّم طوله 5 م مسنَد إلى جدار', learningPointIds: ['4am_wadiya-idmajiya-judhur_P1'] },
    { kind: 'situation', code: 'wadiya-3', module: 3, title: 'وضعية 3 — مفرش بُعداه √18 دسم و √8 دسم', learningPointIds: ['4am_wadiya-idmajiya-judhur_P1'] },
    { kind: 'situation', code: 'wadiya-4', module: 4, title: 'وضعية 4 — شريط من ثلاث قطع مربّعة مساحاتها 12 و 27 و 48 دسم²', learningPointIds: ['4am_wadiya-idmajiya-judhur_P1'] },
    { kind: 'situation', code: 'wadiya-5', module: 5, title: 'وضعية 5 — طائرة ورقية مربّعة قطرها 10 دسم', learningPointIds: ['4am_wadiya-idmajiya-judhur_P1'] },
    { kind: 'situation', code: 'wadiya-6', module: 6, title: 'وضعية 6 — ورقة إجابات سلمى: أحكم وأصحّح', learningPointIds: ['4am_wadiya-idmajiya-judhur_P1'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: صحيح أم خاطئ؟ الجذر التربيعي، المعادلة x² = a، والكتابة a√b.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    // Les وضعيات d'entraînement (track: 'problem') : practice_lab, avant la situation évaluée (module 8, toujours
    // ouvert) ; elles comptent dans la complétion, jamais dans la maîtrise — docs/lessons/MASAIL_GENERATION_GUIDE.md, §14.
    { id: '01', number: 1, slug: 'wadiya-1', path: `${LESSON_BASE_PATH}/wadiya-1`,
      title: 'الوضعية التدريبية 1 — حديقة يوم الشجرة', desc: 'حديقة مربّعة مساحتها 180m²: ضلعها على الشكل a√b، وطول سياجها مضبوطًا ومدوّرًا.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-judhur_P1'],
      color: 'sky', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '02', number: 2, slug: 'wadiya-2', path: `${LESSON_BASE_PATH}/wadiya-2`,
      title: 'الوضعية التدريبية 2 — سلّم الجيران', desc: 'سلّم 5m مسنَد إلى جدار وقاعدته 2m من الجدار: ارتفاع رأسه، وهل يبلغ نافذة ارتفاعها 4,5m؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-judhur_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '03', number: 3, slug: 'wadiya-3', path: `${LESSON_BASE_PATH}/wadiya-3`,
      title: 'الوضعية التدريبية 3 — مفارش الخيّاطة', desc: 'مفرش بُعداه √18 و √8: مساحته، البُعدان على أبسط شكل، ثم المحيط.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-judhur_P1'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '04', number: 4, slug: 'wadiya-4', path: `${LESSON_BASE_PATH}/wadiya-4`,
      title: 'الوضعية التدريبية 4 — شريط الطاولة', desc: 'ثلاث قطع مربّعة مساحاتها 12 و 27 و 48: طول الشريط، وهل يكفي لطاولة طولها 16dm؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-judhur_P1'],
      color: 'emerald', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '05', number: 5, slug: 'wadiya-5', path: `${LESSON_BASE_PATH}/wadiya-5`,
      title: 'الوضعية التدريبية 5 — طائرة يوم العلم', desc: 'طائرة مربّعة قطرها 10dm: ضلعها، نطق المقام 10/√2، وطول إطارها.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-judhur_P1'],
      color: 'teal', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '06', number: 6, slug: 'wadiya-6', path: `${LESSON_BASE_PATH}/wadiya-6`,
      title: 'الوضعية التدريبية 6 — ورقة الإجابات', desc: 'أربع إجابات لتلميذة: أحكم على كل واحدة، أصحّح الخاطئة، وأحسب النقطة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_wadiya-idmajiya-judhur_P1'],
      color: 'violet', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ الوضعية' },
    { id: '07', number: 7, slug: 'al-wadiya', path: `${LESSON_BASE_PATH}/al-wadiya`,
      title: 'تحليل الوضعية النهائية للاختبار', desc: 'زربية وادي سوف: افرز المعطيات، عبّر عن المساحة بدلالة العرض، واختر الاستراتيجية.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_wadiya-idmajiya-judhur_P1'], color: 'amber', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أقرأ الوضعية' },
    { id: '08', number: 8, slug: 'ahill', path: `${LESSON_BASE_PATH}/ahill`,
      title: 'وضعية الاختبار النهائي', desc: 'خمس مراحل تُقيَّم: المطلوب، المعادلة، العرض والطول بالقيم المضبوطة، ثم التدوير إلى 1cm.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 12, difficulty: 4, actionText: 'أحلّ' },
  ],
};
