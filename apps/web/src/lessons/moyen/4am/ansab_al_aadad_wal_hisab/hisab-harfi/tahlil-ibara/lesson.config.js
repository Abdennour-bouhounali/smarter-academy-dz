/**
 * الدرس 3 — تحليل عبارة جبرية
 * Unité 3 du manuel (4AM) : نشاط 3 (p. 33), معارف 3 (p. 34), طرائق pp. 35–36
 * (تحليل عبارة باستخراج عامل مشترك, دوري الآن 2 p. 35, تحليل عبارة باستعمال
 * المتطابقات الشهيرة, تمرين 2, دوري الآن 2 p. 36), exercices 20–27, 28 (ب),
 * 29–33 (pp. 38–39), « أستعدّ » items 9–10 (p. 31), QCM 4, 5, 6, 9, 10, 11,
 * 12 (p. 40), puis trois « مسائل » de la plateforme (modules 5–7).
 * Source de vérité : docs/sources/4am/unit3/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/tahlil-ibara';

export const LESSON_CONFIG = {
  id: 'tahlil-ibara',
  kind: 'lesson',
  unit: 'hisab-harfi',
  unitTitle: 'الحساب الحرفي',
  sequentialUnlock: true,
  title: 'تحليل عبارة جبرية',
  description: 'كتابة عبارة جبرية معطاة على شكل مجموع أو فرق على شكل جداء عاملين من الدرجة الأولى: باستخراج العامل المشترك أو بالتعرّف على شكل متطابقة شهيرة.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🧩',
  estimatedDurationMin: 55,
  textbookRef: { unit: 3, activity: 3, pages: '33, 34, 35, 36, 38, 39, 40' },
  skills: [
    'كتابة عبارة جبرية مكتوبة على شكل مجموع أو فرق على شكل جداء عاملين من الدرجة الأولى',
    'التعرّف على العامل المشترك واستخراجه بالخاصية التوزيعية: ka + kb = k(a + b)',
    'التعرّف على شكل متطابقة شهيرة واستعمالها لتحليل عبارة',
    'التحقّق من صحة تحليل بالنشر أو بحساب قيمة العبارة من أجل قيمة لـ x',
  ],
  teachingScope: {
    include: [
      'تعريف التحليل: كتابة عبارة مجموع على شكل جداء (نشاط 3 ومعارف 3)',
      'استخراج عامل مشترك عددي أو حرفي أو عبارة بين قوسين: ka + kb = k(a + b) و ka − kb = k(a − b)',
      'التحليل باستعمال المتطابقات الشهيرة: a² + 2ab + b² ، a² − 2ab + b² ، a² − b²',
      'طرائق الكتاب ص 35 و 36، وتمارين أوظّف تعلّماتي 20 ← 33',
      'الحساب الذهني بالمتطابقة a² − b² = (a + b)(a − b) (تمرين 28 ب)',
    ],
    exclude: [
      'نشر وتبسيط عبارة جبرية (الدرس 1)',
      'نشر المتطابقات الشهيرة والحساب المتمعّن فيه للجداءات (الدرس 2، تمرين 28 أ)',
      'حل المعادلات من الشكل جداء معدوم (غير مبرمج في هذه الوحدة)',
    ],
  },
  // « مسألة الدرس » : l'énoncé de la مسألة 1 (module 5), montré au sommaire et
  // à la fin du module 1 (LessonProblemCard) — le monde du niveau متقدم (le
  // gazon en rangées identiques, 6x² + 4x), d'autres nombres.
  lessonProblem: {
    module: 5,
    title: 'الملعب الجواري: كم صفًّا من العشب؟',
    statement: 'وصلت إلى الملعب الجواري لحيّنا، هديّةً من أهل الخير، قطع من العشب الاصطناعي: 10 مربّعات كبيرة، طول ضلع كل منها $x$ مترًا، و 15 شريطًا، طول كل منها $x$ مترًا وعرضه متر واحد. يريد العمّال فرشها كلّها في ملعب واحد مستطيل، صفوفًا متماثلة ارتفاع كل صفّ منها $x$ مترًا، دون قطع أيّ قطعة. في هذا الملعب $x = 6$، وسيُحاط الملعب بسياج ثمن المتر الواحد منه 1500 دج. يتّسع مدرّج الملعب لـ 200 متفرّج، وأنجز الأشغال 4 عمّال.',
    illustration: { kind: 'stacks', rows: [{ icon: 'tile', count: 10, label: 'مربّعات كبيرة' }, { icon: 'leaf', count: 15, label: 'أشرطة' }], ariaLabel: 'عشر مربّعات كبيرة من العشب الاصطناعي و 15 شريطًا تُفرش صفوفًا في ملعب' },
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : le نشر (leçon 1), la réduction des
  // termes semblables (leçon 1), les trois متطابقات (leçon 2), les diviseurs
  // communs et le PGCD des coefficients (unité 1).
  priorKnowledge: ['nashr-tawzii', 'tabsit-mutashabiha', 'mutatabiqat', 'pgcd'],
  resources: [
    // Le module 1 ouvre sur le نشاط 3 : le gazon d'un terrain de football posé
    // en rangées IDENTIQUES (turf-factoring, mode rows). مبتدئ = les nombres
    // du نشاط 3 (س 2 : 9x + 3) ; متقدم = le premier exemple de معارف 3
    // (6x² + 4x), la paire du type. Même objectif aux deux niveaux.
    {
      kind: 'manipulation', code: 'turf-rows-9x-3', type: 'turf-factoring', module: 1,
      level: 'beginner',
      title: 'ملعب من 9 شرائط و 3 مربّعات صغيرة: كم صفًّا متماثلًا؟',
      objective: 'التحليل باستخراج عامل مشترك: ka + kb = k(a + b)، والعامل المشترك الكامل هو أكبر عدد من الصفوف المتماثلة',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'football' },
      learningPointIds: ['4am_tahlil-ibara_P2'],
      sourceElementIds: ['act-3'],
    },
    {
      kind: 'manipulation', code: 'turf-rows-6x2-4x', type: 'turf-factoring', module: 1,
      level: 'advanced',
      title: 'ملعب من 6 مربّعات x² و 4 شرائط: العامل المشترك كاملًا',
      objective: 'التحليل باستخراج عامل مشترك: ka + kb = k(a + b)، والعامل المشترك الكامل هو أكبر عدد من الصفوف المتماثلة',
      autonomy: 'قطع من نوعين (مربّعات x² وشرائط x) والصفوف ارتفاعها x: التلميذ يقرأ وحده العامل المشترك كاملًا، العدد 2 من أكبر عدد صفوف يصلح والحرف x من ارتفاع الصف، دون أي اقتراح لعدد الصفوف — و 2(3x² + 2x) صحيحة لكنها ليست التحليل الكامل',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'football' },
      learningPointIds: ['4am_tahlil-ibara_P2', '4am_tahlil-ibara_P1'],
      sourceElementIds: ['know-3'],
    },
    // Le السؤال 3 du نشاط 3 : x² + 6x + 9 fermé à la main en CARRÉ (mode square).
    {
      kind: 'manipulation', code: 'turf-square-x2-6x-9', type: 'turf-factoring', module: 1,
      title: 'مربّع x² و 6 شرائط و 9 مربّعات صغيرة: متى يُغلق الملعب مربّعًا؟',
      learningPointIds: ['4am_tahlil-ibara_P3'],
      sourceElementIds: ['act-3'],
    },
    // معارف 3 : le contraste « لا تقبل تحليلا » (QCM 9) — x² + 25 ne ferme jamais.
    {
      kind: 'manipulation', code: 'turf-square-x2-25', type: 'turf-factoring', module: 2,
      title: 'مربّع x² و 25 مربّعًا صغيرًا بلا شرائط: هل يُغلق الملعب؟',
      learningPointIds: ['4am_tahlil-ibara_P3'],
      sourceElementIds: ['know-3', 'qcm'],
    },
    // Modules 5–7 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 5, title: 'مسألة الدرس — الملعب الجواري: كم صفًّا من العشب؟', learningPointIds: ['4am_tahlil-ibara_P2', '4am_tahlil-ibara_P1'] },
    { kind: 'situation', code: 'masala-2', module: 6, title: 'مسألة — مصنع البسكويت: أبعاد العلب', learningPointIds: ['4am_tahlil-ibara_P3', '4am_tahlil-ibara_P2'] },
    { kind: 'situation', code: 'masala-3', module: 7, title: 'مسألة — ساحة المتوسطة: حديقة مربّعة وجزء مبلّط', learningPointIds: ['4am_tahlil-ibara_P1', '4am_tahlil-ibara_P2'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ثماني عبارات: النشر وتبسيط الحدود المتشابهة، المتطابقات الشهيرة، والقواسم المشتركة. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 3 — تحليل عبارة جبرية', desc: 'افرش قطع العشب في ملعب واحد مستطيل: صفوف متماثلة، ثم مربّع يُغلق. ثم كرّاس إيمان وأسئلة النشاط 3 من الكتاب.',
      stage: 'trigger', teachesLearningPointIds: ['4am_tahlil-ibara_P1', '4am_tahlil-ibara_P2', '4am_tahlil-ibara_P3'],
      color: 'indigo', style: 'featured', estimatedMin: 13, difficulty: 2, actionText: 'أفرش العشب' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — التحليل', desc: 'التعريف، الخاصية التوزيعية والمتطابقات الشهيرة مقروءة من اليمين إلى اليسار، وأمثلة الكتاب الخمسة.',
      stage: 'discovery', teachesLearningPointIds: ['4am_tahlil-ibara_P1', '4am_tahlil-ibara_P2', '4am_tahlil-ibara_P3'],
      color: 'violet', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'tarayiq', path: `${LESSON_BASE_PATH}/tarayiq`,
      title: 'طرائق — تحليل عبارة', desc: 'باستخراج عامل مشترك، باستعمال المتطابقات الشهيرة، ونشر عبارة ثم تحليلها — حلول الكتاب سطرًا سطرًا، ثم دوري الآن.',
      stage: 'formalization', teachesLearningPointIds: ['4am_tahlil-ibara_P1', '4am_tahlil-ibara_P2', '4am_tahlil-ibara_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 10, difficulty: 3, actionText: 'أتعلّم الطريقة' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 20 ← 27، 28 (ب)، 29 ← 33، وسؤالا أؤكّد تعلّماتي 5 و 9.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_tahlil-ibara_P1', '4am_tahlil-ibara_P2', '4am_tahlil-ibara_P3'],
      color: 'amber', style: 'featured', estimatedMin: 11, difficulty: 3, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '05', number: 5, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — عشب الملعب الجواري', desc: 'مسألة الدرس: قطع عشب في صفوف متماثلة. العامل المشترك كاملًا، بعدا الملعب، وثمن السياج.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_tahlil-ibara_P2', '4am_tahlil-ibara_P1'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — مصنع البسكويت', desc: 'مساحتا قاعدتين بدلالة x: أبعاد العلبتين بالمتطابقات الشهيرة، ثم الكراتين وثمنها.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_tahlil-ibara_P3', '4am_tahlil-ibara_P2'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — ساحة المتوسطة', desc: 'ساحة مستطيلة يُقتطع منها مربّع: تحليل مساحة الجزء المبلّط، خطأ زميل، وثمن التبليط.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_tahlil-ibara_P1', '4am_tahlil-ibara_P2'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ستة أسئلة تُقيّم الكفاءات الثلاث، منها خمسة من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
