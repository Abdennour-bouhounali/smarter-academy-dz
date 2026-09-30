/**
 * الدرس 2 — الأعداد الناطقة والأعداد غير الناطقة
 * Unité 2 du manuel (4AM), نشاط 2 (p. 20), معارف 2 (p. 22), exercices 9, 10
 * (p. 26), 25 (p. 27), 31-1 et 35 (p. 29), أوظّف تكنولوجيات الإعلام والاتصال
 * « √2 » (p. 30). Source de vérité : docs/sources/4am/unit2/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/natiqa-ghayr-natiqa';

export const LESSON_CONFIG = {
  id: 'natiqa-ghayr-natiqa',
  kind: 'lesson',
  unit: 'hisab-judhur',
  unitTitle: 'الحساب على الجذور',
  sequentialUnlock: true,
  title: 'الأعداد الناطقة والأعداد غير الناطقة',
  description: 'التمييز بين العدد الناطق والعدد غير الناطق من خلال جذره التربيعي: جذر مربع عدد ناطق عدد ناطق، وجذر عدد ليس مربعًا لعدد ناطق عدد غير ناطق، نكتفي له بقيم مقرّبة.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🔍',
  estimatedDurationMin: 45,
  textbookRef: { unit: 2, activity: 2, pages: '20, 22, 26, 27, 29, 30' },
  skills: [
    'تصنيف جذور تربيعية: جذر ناطق أو جذر غير ناطق',
    'التعرّف على الأعداد التي هي مربعات لأعداد ناطقة وحساب جذورها التربيعية',
    'معرفة أن الجذر التربيعي لعدد ليس مربعًا لعدد ناطق ليس عددًا ناطقًا، وأن الحاسبة لا تعرض له إلا قيمة مقرّبة',
    'حصر جذر تربيعي بين قيمتين مقرّبتين بالنقصان وبالزيادة، وإعطاء مدوّره',
  ],
  teachingScope: {
    include: [
      'معارف 2: إذا كان a مربعًا لعدد ناطق فإن √a عدد ناطق، وإلا فإن √a ليس عددًا ناطقًا',
      'القيمة التي تعرضها الحاسبة لعدد غير ناطق قيمة مقرّبة (√2)',
      'القيم المقرّبة بالنقصان وبالزيادة والمدوّر لجذر تربيعي (تمارين 9، 10، 25، 35)',
    ],
    exclude: [
      'تعريف الجذر التربيعي وخاصيتاه (الدرس 1)',
      'حل المعادلة x² = a (الدرس 3)',
      'جداء جذرين وحاصل قسمتهما (الدرس 4)',
      'برهان أنّ عددًا ما غير ناطق: الكتاب يكتفي بالنتيجة',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // الدرس 1 (jidhr-taarif, qima-mudbuta) et l'année précédente (adad-natiq),
  // diagnostiqués par « أستعدّ » (module 0).
  priorKnowledge: ['jidhr-taarif', 'qima-mudbuta', 'adad-natiq'],
  resources: [
    // Le module 1 est un WORKSPACE À DEUX NIVEAUX : la même règle graduée,
    // les nombres du manuel aux deux niveaux (نشاط 2 p. 20).
    //   مبتدئ  — trois aires du classement (9, 0,25, 7), graduations 1/1 … 1/10.
    //   متقدم  — les six autres aires du classement, graduations 1/1 … 1/12.
    {
      kind: 'manipulation', code: 'square-root-side-act2-3', type: 'square-root-side', module: 1,
      level: 'beginner',
      title: 'على أيّ تدريجة يقع الجذر؟ — ثلاث مساحات',
      objective: 'إذا كان a مربعًا لعدد ناطق فإن √a عدد ناطق يقع على تدريجة، وإلا فإن √a ليس عددًا ناطقًا',
      autonomy: '',
      experience: { type: 'textbook', reason: '', theme: '' },
      learningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2'],
      sourceElementIds: ['act-2'],
    },
    {
      kind: 'manipulation', code: 'square-root-side-act2-6', type: 'square-root-side', module: 1,
      level: 'advanced',
      title: 'تصنيف الكتاب — ست مساحات وتدريجات حتى الجزء من 12',
      objective: 'إذا كان a مربعًا لعدد ناطق فإن √a عدد ناطق يقع على تدريجة، وإلا فإن √a ليس عددًا ناطقًا',
      autonomy: 'ست مساحات الكتاب دون ترتيب مقترح وتدريجات من الوحدة إلى الجزء من 12: التلميذ يختار بنفسه التدريجة التي قد يقع عليها كل جذر، ويقرّر متى يتوقّف عن البحث',
      experience: { type: 'textbook', reason: '', theme: '' },
      learningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2', '4am_natiqa-ghayr-natiqa_P3'],
      sourceElementIds: ['act-2'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'خمس عبارات: صحيح أم خاطئ؟ العدد الناطق، الجذر التربيعي، القيمة المضبوطة والقيمة المقرّبة.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 2 — صنفان من الجذور', desc: 'اسحب ضلع المربّع على مسطرة مدرّجة: بعض الجذور تقع على تدريجة وبعضها لا يقع أبدًا.',
      stage: 'trigger', teachesLearningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — ناطق أم غير ناطق؟', desc: 'نتيجتا الكتاب ومثالاه، ثم ما تخفيه الحاسبة عن √2.',
      stage: 'discovery', teachesLearningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P2', '4am_natiqa-ghayr-natiqa_P3'],
      color: 'violet', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'قيم مقرّبة بالنقصان وبالزيادة ومدوّرات: تمارين الكتاب 9، 10، 25، 35 و 31.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_natiqa-ghayr-natiqa_P1', '4am_natiqa-ghayr-natiqa_P3'],
      color: 'amber', style: 'featured', estimatedMin: 11, difficulty: 2, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
