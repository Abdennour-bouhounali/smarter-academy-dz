/**
 * الدرس 5 — توظيف خواص الجذور التربيعية
 * Unité 2 du manuel (4AM) : طرائق p. 25 (تمرين 1, تمرين 2, نسبة مقامها عدد
 * غير ناطق, دوري الآن 1–2), exercices 18, 19, 22, 23, 24, 26, 27 (p. 27),
 * 28, 29, 30 (p. 27), 31 (2), 32, 34, 36, 37, 38 (p. 29), دوري الآن p. 30,
 * « أستعدّ » items 7–9 (p. 19), QCM item 7 (p. 28),
 * puis trois « مسائل » de la plateforme (modules 6–8).
 * Source de vérité : docs/sources/4am/unit2/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/tawzif-khawass-judhur';

export const LESSON_CONFIG = {
  id: 'tawzif-khawass-judhur',
  kind: 'lesson',
  unit: 'hisab-judhur',
  unitTitle: 'الحساب على الجذور',
  sequentialUnlock: true,
  title: 'توظيف خواص الجذور التربيعية',
  description: 'كتابة جذر على الشكل a√b حيث b أصغر ما يمكن، وتبسيط مجموع جذور بالخاصية التوزيعية، وكتابة نسبة مقامها عدد غير ناطق على شكل نسبة مقامها عدد ناطق.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🧱',
  estimatedDurationMin: 71,
  textbookRef: { unit: 2, activity: null, pages: '25, 27, 29, 30' },
  // « مسألة الدرس » : l'énoncé de la مسألة 1 (content/problems.js), montré au
  // sommaire de l'unité (LessonProblemCard, plus dans le module 1), résolu au module 6.
  // Elle prolonge le carré dallé du niveau متقدم : même instrument, autre aire.
  lessonProblem: {
    module: 6,
    title: 'طاولة فسيفساء مربّعة: أصغر قطعة ممكنة',
    illustration: { kind: 'plan', shape: 'square', fill: 'tile', side: '؟', unit: 'dm', area: '200', areaUnit: 'dm²', ariaLabel: 'سطح طاولة مربّع الشكل مساحته 200 دم² يُغطّى بقطع فسيفساء مربّعة متماثلة' },
    statement: 'في ورشة بغرداية، يصنع حِرفيّ بإتقان ودقّة طاولة سطحها مربّع الشكل مساحته $200\\,dm^2$، ويغطّيه كلّه بفسيفساء: قطع مربّعة متماثلة، مساحة كل منها عدد طبيعي من $dm^2$، مرصوفة صفوفًا وأعمدة. تُنجز الطاولة في 12 يومًا، وثمن القطعة الواحدة 120 دج مهما كان مقاسها. يريد الزبون أن تكون القطع أصغر ما يمكن.',
  },
  skills: [
    'كتابة الجذر التربيعي لعدد طبيعي على الشكل a√b حيث b أصغر ما يمكن',
    'تبسيط مجموع جذور متشابهة بالخاصية التوزيعية',
    'كتابة نسبة مقامها عدد غير ناطق على شكل نسبة مقامها عدد ناطق',
    'نشر وتبسيط عبارات تتضمن جذورًا تربيعية باستعمال المتطابقات الشهيرة',
  ],
  teachingScope: {
    include: [
      'طريقة الكتاب: البحث عن أكبر مربع a² يقسم n لكتابة √n على الشكل a√b',
      'تبسيط مجموع جذور بالخاصية التوزيعية',
      'نسبة مقامها عدد غير ناطق: ضرب البسط والمقام في √b',
      'نشر عبارات تتضمن جذورًا (تمارين الكتاب 28 ← 30، 36، 37)',
    ],
    exclude: [
      'تعريف الجذر التربيعي (الدرس 1)',
      'الأعداد الناطقة وغير الناطقة (الدرس 2)',
      'حل المعادلة x² = a (الدرس 3)',
      'إثبات خاصيتي الجداء والقسمة (الدرس 4)',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : les leçons 1 et 4 de l'unité, et
  // les متطابقات (أستعدّ p. 19, items 7–9).
  priorKnowledge: ['jidaa-jidhrayn', 'jidhr-a2b', 'qismat-jidhrayn', 'mutatabiqat', 'jidhr-taarif'],
  resources: [
    // Le module 1 n'a PAS d'activité du manuel (la leçon est une page de
    // طرائق) : le laboratoire est l'entrée de la PLATEFORME dans la طريقة
    // « نبحث عن أكبر مربع a² يقسم n », déclarée comme telle. Les deux aires
    // viennent de l'exercice 18 (√32 et √288).
    {
      kind: 'manipulation', code: 'square-tiling-32', type: 'square-tiling', module: 1,
      level: 'beginner',
      title: 'مربّع مساحته 32: أيّ تبليط يعطي أصغر بلاطة؟',
      objective: 'كتابة √n على الشكل a√b حيث b أصغر ما يمكن: a² أكبر مربّع يقسم n',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'improved_interactivity_and_age_appropriateness', theme: 'abstract' },
      learningPointIds: ['4am_tawzif-khawass-judhur_P1'],
      sourceElementIds: ['method-simplify', 'ex-18'],
    },
    {
      kind: 'manipulation', code: 'square-tiling-288', type: 'square-tiling', module: 1,
      level: 'advanced',
      title: 'مربّع مساحته 288: ستّة تبليطات، واحد فقط أبسطها',
      objective: 'كتابة √n على الشكل a√b حيث b أصغر ما يمكن: a² أكبر مربّع يقسم n',
      autonomy: 'ستة تبليطات صالحة (1، 2، 3، 4، 6 أو 12 بلاطة على الضلع) دون أي اقتراح: التلميذ يجرّب بنفسه ويقرّر أيّها يعطي بلاطة لا يمكن تبليطها من جديد؛ ست بلاطات على الضلع تعطي بلاطة مساحتها 8 تبدو صغيرة وليست أصغر ما يمكن',
      experience: { type: 'platform_adaptation', reason: 'improved_interactivity_and_age_appropriateness', theme: 'abstract' },
      learningPointIds: ['4am_tawzif-khawass-judhur_P1'],
      sourceElementIds: ['method-simplify', 'ex-18'],
    },
    // Les « مسائل » : exercices complets de type امتحان, AJOUTS de la
    // plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 6, title: 'مسألة الدرس — طاولة فسيفساء مربّعة: أصغر قطعة ممكنة', learningPointIds: ['4am_tawzif-khawass-judhur_P1'] },
    { kind: 'situation', code: 'masala-2', module: 7, title: 'مسألة — أحواض حديقة المتوسطة: هل يتّسع الممرّ؟', learningPointIds: ['4am_tawzif-khawass-judhur_P1', '4am_tawzif-khawass-judhur_P2'] },
    { kind: 'situation', code: 'masala-3', module: 8, title: 'مسألة — الطائرات الورقية: ضلع وشريط', learningPointIds: ['4am_tawzif-khawass-judhur_P2', '4am_tawzif-khawass-judhur_P3'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'تسع عبارات: المتطابقات الشهيرة من الكتاب، وجداء جذرين وحاصل قسمتهما. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'مربّع مبلّط — أبسط كتابة لجذر', desc: 'بلّط مربّعًا مساحته 288 بكل الطرق: أيّ بلاطة أصغر ما يمكن؟ ثم السؤال الأول من تمرين 1 في الكتاب.',
      stage: 'trigger', teachesLearningPointIds: ['4am_tawzif-khawass-judhur_P1'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أبلّط' },
    { id: '02', number: 2, slug: 'tabsit', path: `${LESSON_BASE_PATH}/tabsit`,
      title: 'طرائق — تبسيط عبارة تتضمن جذورًا', desc: 'تمرين 1 و 2 من طرائق الكتاب: تبسيط عبارة بالخاصية التوزيعية وحساب جداء جذور، ثم دوري الآن 1.',
      stage: 'discovery', teachesLearningPointIds: ['4am_tawzif-khawass-judhur_P1', '4am_tawzif-khawass-judhur_P2'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'nisba', path: `${LESSON_BASE_PATH}/nisba`,
      title: 'طرائق — نسبة مقامها عدد غير ناطق', desc: 'طريقة الكتاب لجعل المقام عددًا ناطقًا، ثم دوري الآن 2.',
      stage: 'discovery', teachesLearningPointIds: ['4am_tawzif-khawass-judhur_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 10, difficulty: 2, actionText: 'أكتشف' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 18، 19، 22، 23، 24، 26، 27 و 31 (2).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_tawzif-khawass-judhur_P1', '4am_tawzif-khawass-judhur_P2', '4am_tawzif-khawass-judhur_P3'],
      color: 'amber', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'atamaqq', path: `${LESSON_BASE_PATH}/atamaqq`,
      title: 'أتعمّق', desc: 'نشر وتبسيط، المكعّب، المثلث القائم، ومسائل من امتحان شهادة التعليم المتوسط: تمارين 28، 29، 30، 32، 34، 36، 37، 38.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_tawzif-khawass-judhur_P2', '4am_tawzif-khawass-judhur_P3'],
      color: 'rose', style: 'featured', estimatedMin: 12, difficulty: 4, actionText: 'أتعمّق' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    // 6 min chacune : la leçon est déjà à 71 min (71 + 18 = 89 ≤ 90).
    { id: '06', number: 6, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — طاولة الفسيفساء', desc: 'مسألة الدرس: سطح مربّع مساحته 200 مغطّى بقطع مربّعة متماثلة. أيّ قطعة أصغر ما يمكن؟ وكم تكلّف القطع؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_tawzif-khawass-judhur_P1'],
      color: 'amber', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — أحواض حديقة المتوسطة', desc: 'أحواض مربّعة متلاصقة: ما الطول الذي تشغله؟ وهل يتّسع الممرّ لحوض آخر؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_tawzif-khawass-judhur_P1', '4am_tawzif-khawass-judhur_P2'],
      color: 'amber', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — الطائرات الورقية', desc: 'من القطر إلى الضلع بمقام ناطق، ثم كم مترًا من الشريط يشتري النادي؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_tawzif-khawass-judhur_P2', '4am_tawzif-khawass-judhur_P3'],
      color: 'amber', style: 'featured', estimatedMin: 6, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '09', number: 9, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم الكفاءات الثلاث.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
