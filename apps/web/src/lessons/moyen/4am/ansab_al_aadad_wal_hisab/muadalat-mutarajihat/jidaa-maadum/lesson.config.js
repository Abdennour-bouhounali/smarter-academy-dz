/**
 * الدرس 2 — معادلات جداء معدوم
 * Unité 4 du manuel (4AM) : نشاط 2 (p. 44 : الجداء المعدوم، تطبيق أ، تطبيق ب),
 * معارف 2 (p. 46), طرائق p. 47 (حل معادلة من الشكل (ax + b)(cx + d) = 0,
 * دوري الآن 2), exercices 14 → 20 (pp. 50–51), « أستعدّ » items 3–5 (p. 43),
 * QCM 3 et 4 (p. 52), et — déclarés `duplicatedIn` — le تحدّ (x² + 12x = 85) et
 * l'encadré الخوارزمي (x² + 21 = 10x) de la page d'ouverture (p. 43).
 * Source de vérité : docs/sources/4am/unit4/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/jidaa-maadum';

export const LESSON_CONFIG = {
  id: 'jidaa-maadum',
  kind: 'lesson',
  unit: 'muadalat-mutarajihat',
  unitTitle: 'معادلات ومتراجحات من الدرجة الأولى بمجهول واحد',
  sequentialUnlock: true,
  title: 'معادلات جداء معدوم',
  description: 'التعرف على معادلة جداء معدوم من الشكل (ax + b)(cx + d) = 0 وحلها بخاصية الجداء المعدوم: ينعدم جداء عاملين إذا وفقط إذا انعدم أحدهما، ثم حل معادلات تؤول إليها بالتحليل.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🎯',
  estimatedDurationMin: 50,
  textbookRef: { unit: 4, activity: 2, pages: '43, 44, 46, 47, 50, 51, 52' },
  skills: [
    'التعرّف على معادلة جداء معدوم من الشكل (ax + b)(cx + d) = 0',
    'تطبيق خاصية الجداء المعدوم: A × B = 0 يعني A = 0 أو B = 0',
    'حل معادلة جداء معدوم بحل معادلتين من الدرجة الأولى',
    'حل معادلة تؤول إلى معادلة جداء معدوم بعد التحليل (عامل مشترك أو متطابقة شهيرة)',
  ],
  teachingScope: {
    include: [
      'خاصية الجداء المعدوم (نشاط 2 ومعارف 2): إذا كان جداء عاملين معدومًا فإن أحد هذين العاملين على الأقل معدوم',
      'تعريف معادلة جداء معدوم وحلولها: حلول المعادلتين ax + b = 0 و cx + d = 0',
      'عامل ثابت غير معدوم لا ينعدم: 3(x − 5) = 0 يعني x − 5 = 0 (طريقة أمين)',
      'حل معادلة تؤول إلى جداء معدوم بالتحليل: طرائق ص 47، دوري الآن 2، تمارين 14 ← 20',
      'المربّع المكمَّل في تحدّي الوحدة (x² + 12x = 85) ومعادلة الخوارزمي x² + 21 = 10x',
    ],
    exclude: [
      'حل معادلة من الدرجة الأولى بمجهول واحد وخواص المساواة (الدرس 1)',
      'المتراجحات من الدرجة الأولى (الدرس 3)',
      'المعادلات من الدرجة الثانية بالمميّز (غير مبرمجة في المتوسط)',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : le نشر (unité 3), l'analyse par
  // facteur commun et par identité remarquable (unité 3), la résolution d'une
  // équation du premier degré (leçon 1 de l'unité), le produit de relatifs.
  priorKnowledge: ['nashr-jidaa', 'tahlil-amil', 'tahlil-huwiya', 'hal-muadala-ula', 'darb-nisbiya'],
  resources: [
    // Le module 1 ouvre sur le نشاط 2 (تطبيق أ) : le TERRAIN dont les deux côtés sont
    // les deux FACTEURS (vanishing-pitch). مبتدئ = س 1, 3(x − 5) : un côté constant
    // qui ne s'écrase jamais ; متقدم = س 3, (x − 2)(x + 5), l'équation même de
    // l'activité, ouverte par défaut. Même objectif aux deux niveaux.
    {
      kind: 'manipulation', code: 'pitch-3-x-5', type: 'vanishing-pitch', module: 1,
      level: 'beginner',
      title: 'ملعب ضلعاه 3 و x − 5: متى يختفي؟',
      objective: 'خاصية الجداء المعدوم: A × B = 0 يعني A = 0 أو B = 0 — مساحة الملعب تنعدم فقط عندما ينعدم أحد ضلعيه',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'football' },
      learningPointIds: ['4am_jidaa-maadum_P2'],
      sourceElementIds: ['act-2b'],
    },
    {
      kind: 'manipulation', code: 'pitch-x-2-x-5', type: 'vanishing-pitch', module: 1,
      level: 'advanced',
      title: 'ملعب ضلعاه x − 2 و x + 5: كل القيم التي يختفي عندها',
      objective: 'خاصية الجداء المعدوم: A × B = 0 يعني A = 0 أو B = 0 — مساحة الملعب تنعدم فقط عندما ينعدم أحد ضلعيه',
      autonomy: 'الضلعان يتغيّران معًا وأحدهما ينقلب سالبًا بين −5 و 2: على التلميذ أن يجد وحده كل قيم x التي يختفي عندها الملعب ثم أن يحكم «لا حلول أخرى» بعد مسح المسطرة، ونشر إلياس لا يعطي معادلة من الدرجة الأولى',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'football' },
      learningPointIds: ['4am_jidaa-maadum_P2', '4am_jidaa-maadum_P1'],
      sourceElementIds: ['act-2b'],
    },
    // معارف 2, مثال 3 : (3x − 4)(−2x + 1) = 0 — la règle graduée en sixièmes (zéros 1/2 et 4/3).
    {
      kind: 'manipulation', code: 'pitch-3x-4-2x-1', type: 'vanishing-pitch', module: 2,
      title: 'مثال الكتاب: ملعب ضلعاه 3x − 4 و −2x + 1',
      learningPointIds: ['4am_jidaa-maadum_P2'],
      sourceElementIds: ['know-2'],
    },
    // دوري الآن 2 (p. 47) : (2x + 1)² = 0 — un terrain CARRÉ, les deux côtés s'annulent ensemble.
    {
      kind: 'manipulation', code: 'pitch-square-2x-1', type: 'vanishing-pitch', module: 3,
      title: 'ملعب مربّع ضلعه 2x + 1: كم حلًّا؟',
      learningPointIds: ['4am_jidaa-maadum_P2'],
      sourceElementIds: ['now-47-2'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'تسع عبارات: النشر، التحليل، حل معادلة من الدرجة الأولى، وضرب الأعداد النسبية. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 2 — خاصية الجداء المعدوم', desc: 'حرّك x فيتغيّر ضلعا الملعب: متى يختفي؟ ثم كرّاسا إلياس وأمين والمعادلة (x − 2)(x + 5) = 0 من الكتاب.',
      stage: 'trigger', teachesLearningPointIds: ['4am_jidaa-maadum_P1', '4am_jidaa-maadum_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أحرّك x' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — معادلات جداء معدوم', desc: 'التعريف، خاصية الجداء المعدوم وحلول المعادلة، أمثلة الكتاب الثلاثة، ثم المعادلة (E) من النشاط.',
      stage: 'discovery', teachesLearningPointIds: ['4am_jidaa-maadum_P1', '4am_jidaa-maadum_P2', '4am_jidaa-maadum_P3'],
      color: 'violet', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'tarayiq', path: `${LESSON_BASE_PATH}/tarayiq`,
      title: 'طرائق — نحلّل ثم نحلّ', desc: 'حلّ الكتاب سطرًا سطرًا، دوري الآن، ثم تحدّي الوحدة (المربّع AEGF) ومعادلة الخوارزمي.',
      stage: 'formalization', teachesLearningPointIds: ['4am_jidaa-maadum_P2', '4am_jidaa-maadum_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 9, difficulty: 3, actionText: 'أتعلّم الطريقة' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 14 ← 20: معادلات جداء معدوم ومعادلات تؤول إليها.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_jidaa-maadum_P1', '4am_jidaa-maadum_P2', '4am_jidaa-maadum_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث، منها سؤالا أؤكّد تعلّماتي 3 و 4.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
