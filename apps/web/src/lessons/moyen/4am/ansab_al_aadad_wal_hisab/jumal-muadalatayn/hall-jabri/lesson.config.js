/**
 * الدرس 2 — حل جملة معادلتين من الدرجة الأولى بمجهولين جبرياً (طريقتا التعويض والجمع)
 * Unité 5 du manuel (4AM) : « أستعدّ » items 9–10 (p. 55), نشاط 2 (p. 56), طرائق p. 59 (التمرين
 * المحلول، الطريقة، دوري الآن), exercices 5 → 13 (pp. 60–61), 22 et 23 (أتعمّق p. 63), QCM 5 et 6
 * (p. 62). Source de vérité : docs/sources/4am/unit5/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/hall-jabri';

export const LESSON_CONFIG = {
  id: 'hall-jabri',
  kind: 'lesson',
  unit: 'jumal-muadalatayn',
  unitTitle: 'جمل معادلتين من الدرجة الأولى بمجهولين',
  sequentialUnlock: true,
  title: 'حل جملة معادلتين من الدرجة الأولى بمجهولين جبرياً (طريقتا التعويض والجمع)',
  description: 'حل جملة معادلتين جبريا: بطريقة التعويض (التعبير عن أحد المجهولين بدلالة الآخر ثم التعويض في المعادلة الأخرى) وبطريقة الجمع (ضرب طرفي معادلة أو كلتيهما في معامل مناسب ليصير معاملا أحد المجهولين متعاكسين ثم الجمع طرفا لطرف)، للحصول على معادلة من الدرجة الأولى بمجهول واحد، واختيار الطريقة الأنسب بحسب معاملات الجملة.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🔀',
  estimatedDurationMin: 54,
  textbookRef: { unit: 5, activity: 2, pages: '55, 56, 59, 60, 61, 62, 63' },
  skills: [
    'التخلّص من أحد المجهولين للحصول على معادلة من الدرجة الأولى بمجهول واحد',
    'حل جملة بطريقة التعويض: التعبير عن أحد المجهولين بدلالة الآخر ثم التعويض في المعادلة الأخرى',
    'حل جملة بطريقة الجمع: الضرب في معامل مناسب ثم الجمع طرفًا لطرف',
    'إتمام الحل بإيجاد المجهول الآخر والتحقق من الثنائية في المعادلتين',
    'اختيار الطريقة الأنسب بحسب معاملات الجملة',
  ],
  teachingScope: {
    include: [
      'جملة النشاط 2 وعمل التلميذين (التعويض والجمع)، وجملة السؤال جـ 2',
      'التمرين المحلول ص 59 بطريقتيه، وإطار «طريقة»، ودوري الآن',
      'جمل بمعاملات صحيحة أو عشرية أو كسرية، وجمل تُبسَّط قبل الحل (تمارين 5 ← 13، 22، 23)',
      'التحقق من الثنائية في المعادلتين',
      'اختيار الطريقة الأنسب بالنظر إلى المعاملات',
    ],
    exclude: [
      'مفهوم الجملة وحالاتها الخاصة (لا حل، عدد غير منته من الحلول) — الدرس 1',
      'ترييض المشكلات بجملة معادلتين — الدرس 3',
      'الحل البياني للجملة',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : transposer un terme (items 9 du manuel), remplacer
  // une inconnue par une valeur (item 10), multiplier les deux membres d'une égalité, résoudre
  // une équation du premier degré à une inconnue (leçon muadala-ula).
  priorKnowledge: ['naql-hudud', 'taawid-qima', 'darb-tarafayn', 'hal-muadala-ula'],
  resources: [
    // Le module 1 ouvre sur les CARTES DU KIOSQUE (elimination-cards). متقدم = la jumla du نشاط 2
    // (2x + y = 7 ; 3x − 2y = 4,2), ouverte par défaut ; مبتدئ = x + y = 10 ; x − y = 2 (plateforme).
    {
      kind: 'manipulation', code: 'cards-x-y-10-2', type: 'elimination-cards', module: 1,
      level: 'beginner',
      title: 'بطاقتا الكشك: x + y = 10 و x − y = 2',
      objective: 'حل جملة معادلتين بالتخلّص من أحد المجهولين — بالتعويض أو بالجمع — ثم إيجاد المجهول الآخر: الحل ثنائية (x ; y)',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'snack' },
      learningPointIds: ['4am_hall-jabri_P2', '4am_hall-jabri_P1'],
      sourceElementIds: ['act-2'],
    },
    {
      kind: 'manipulation', code: 'cards-act2-7-42', type: 'elimination-cards', module: 1,
      level: 'advanced',
      title: 'جملة النشاط 2: 2x + y = 7 و 3x − 2y = 4,2',
      objective: 'حل جملة معادلتين بالتخلّص من أحد المجهولين — بالتعويض أو بالجمع — ثم إيجاد المجهول الآخر: الحل ثنائية (x ; y)',
      autonomy: 'لا مجهولان متعاكسان جاهزان: على التلميذ أن يقرّر وحده أيّ مجهول يعزل ومن أيّ بطاقة (التلميذ 1)، أو بأيّ معامل يضرب أيّ بطاقة (التلميذ 2)، مع معاملات عشرية — دون اقتراح للخطوات، والطريقتان مطلوبتان',
      experience: { type: 'platform_adaptation', reason: 'multiple_representations', theme: 'snack' },
      learningPointIds: ['4am_hall-jabri_P1', '4am_hall-jabri_P2', '4am_hall-jabri_P3'],
      sourceElementIds: ['act-2'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ثماني عبارات: نقل حدّ، تعويض مجهول بقيمة، ضرب طرفي مساواة، حل معادلة بمجهول واحد. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 2 — تلميذان وطريقتان', desc: 'بطاقتا كشك الحي: اجعل مجهولًا يختفي بالتعويض ثم بالجمع، ثم اشرح عمل التلميذين واستنتج حل الجملة.',
      stage: 'trigger', teachesLearningPointIds: ['4am_hall-jabri_P1', '4am_hall-jabri_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 16, difficulty: 2, actionText: 'أجرّب البطاقتين' },
    { id: '02', number: 2, slug: 'tarayiq', path: `${LESSON_BASE_PATH}/tarayiq`,
      title: 'طرائق — التعويض أو الجمع', desc: 'التمرين المحلول ص 59 سطرًا سطرًا، إطار «طريقة»، كيف نختار الطريقة الأنسب، ثم دوري الآن.',
      stage: 'discovery', teachesLearningPointIds: ['4am_hall-jabri_P1', '4am_hall-jabri_P2', '4am_hall-jabri_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أتعلّم الطريقتين' },
    { id: '03', number: 3, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 5 ← 13 و 22، 23: بالتعويض، بالجمع، ثم بطريقة من اختيارك.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_hall-jabri_P1', '4am_hall-jabri_P2', '4am_hall-jabri_P3'],
      color: 'amber', style: 'featured', estimatedMin: 14, difficulty: 3, actionText: 'أتدرّب' },
    { id: '04', number: 4, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث، منها سؤالان من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
