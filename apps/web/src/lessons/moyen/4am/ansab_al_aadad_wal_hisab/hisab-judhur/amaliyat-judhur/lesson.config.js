/**
 * الدرس 4 من الوحدة 2 — العمليات على الجذور التربيعية (الجداء والقسمة)
 * Manuel 4AM, unité 2 : نشاط 4 (p. 21), معارف 4 (p. 24), تمارين 15, 16, 17,
 * 20, 21 (p. 26–27), 33 (p. 29), أؤكّد تعلّماتي 8–9 (p. 28), أستعدّ 5–6 (p. 19),
 * puis trois « مسائل » de la plateforme (modules 5–7).
 * Source de vérité : docs/sources/4am/unit2/extraction.json.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/amaliyat-judhur';

export const LESSON_CONFIG = {
  id: 'amaliyat-judhur',
  kind: 'lesson',
  unit: 'hisab-judhur',
  unitTitle: 'الحساب على الجذور',
  sequentialUnlock: true,
  title: 'العمليات على الجذور التربيعية (الجداء والقسمة)',
  description: 'جذر جداء عددين موجبين هو جداء جذريهما، وجذر حاصل قسمتهما هو حاصل قسمة جذريهما — نكتشفهما بتبليط مربّع وبإكمال جدولَي الكتاب ونبرهنهما بالتربيع — أما الجمع والطرح فلا تتحقق فيهما المساواة.',
  level: 'moyen',
  grade: '4am',
  chapter: 'ansab_al_aadad_wal_hisab',
  chapterTitle: 'ميدان أنساب الأعداد والحساب',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '✖️',
  estimatedDurationMin: 59,
  textbookRef: { unit: 2, activity: 4, pages: '21, 24, 26, 27, 29' },
  skills: [
    'حساب جداء جذرين تربيعيين وجذر جداء: √a × √b = √(a × b) من أجل a و b موجبين',
    'حساب حاصل قسمة جذرين تربيعيين وجذر حاصل قسمة: √a ÷ √b = √(a ÷ b) من أجل a موجب و b موجب تماما',
    'البرهان على الخاصيتين بالتربيع: عددان موجبان لهما نفس المربع متساويان',
    'معرفة أن المساواة غير محقّقة في الجمع والطرح: √(a + b) ≠ √a + √b',
  ],
  teachingScope: {
    include: [
      'خاصية 1 (جداء جذرين) وملاحظاتها: الانتقال في الاتجاهين، √(a²b) = a√b، حالة عددين سالبين',
      'خاصية 2 (حاصل قسمة جذرين) وملاحظتها',
      'ملاحظة 3: لا مساواة في الجمع والطرح، بالمثالين 16 + 9 و 100 − 36',
    ],
    exclude: [
      'كتابة جذر على الشكل a√b حيث b أصغر ما يمكن، وتبسيط مجموع جذور (الدرس 5)',
      'جعل مقام نسبة عددًا ناطقًا (الدرس 5)',
      'حل المعادلة x² = a (الدرس 3)',
    ],
  },
  // « مسألة الدرس » (rollout مسائل, 2026-10-06) : montrée dès le sommaire,
  // rappelée au module 1, résolue pas à pas au module 5 (content/problems.js).
  // Prolonge le carré dallé du niveau متقدم : un carré couvert de dalles
  // carrées identiques, d'autres nombres (180 = 36 × 5 : √180 = 6√5).
  lessonProblem: {
    module: 5,
    title: 'لوحة الزليج: بلاطات مربّعة على مربّع',
    statement: 'يصنع حِرَفيّ في تلمسان، يُتقن عمله ولا يرضى بالنقص، لوحة زليج مربّعة الشكل مساحتها $180\\,dm^2$ لمدخل دار الثقافة، ويريد أن يغطّيها كلّها ببلاطات مربّعة متماثلة، مصفوفة في صفوف وأعمدة، دون أن يقطع أيّ بلاطة. في ورشته نوعان من البلاطات: بلاطات مساحة الواحدة منها $5\\,dm^2$، وبلاطات مساحة الواحدة منها $12\\,dm^2$. ثمن البلاطة الواحدة 150 دج مهما كان نوعها، وسُمكها $1\\,cm$. يعمل في الورشة 3 متربّصين.',
    illustration: { kind: 'plan', shape: 'square', fill: 'tile', side: '؟', area: 180, areaUnit: 'dm²', grid: true, ariaLabel: 'لوحة زليج مربّعة مساحتها 180 dm² تُغطّى ببلاطات مربّعة متماثلة' },
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Leçon 1 de l'unité (jidhr-taarif, murabba-jidhr) et années antérieures
  // (quwa-jidaa-kasr : (ab)² = a²b², (a/b)² = a²/b² — « أستعدّ » 5 et 6).
  priorKnowledge: ['jidhr-taarif', 'murabba-jidhr', 'quwa-jidaa-kasr'],
  resources: [
    // Module 1 : le CARRÉ DALLÉ à deux niveaux (MANIPULATION_CONTRACT §7bis-levels).
    //   مبتدئ  — 36 = 4 × 9 : petits nombres de la plateforme, déclarés.
    //   متقدم  — 144 = 4 × 36, la première ligne du tableau du manuel.
    {
      kind: 'manipulation', code: 'square-tiling-36', type: 'square-tiling', module: 1,
      level: 'beginner',
      title: 'مربّع مساحته 36 — كم بلاطة على الضلع؟',
      objective: 'جذر جداء عددين موجبين يساوي جداء جذريهما: √(k² × b) = √(k²) × √b = k√b',
      autonomy: '',
      experience: { type: 'platform_adaptation', reason: 'smaller_numbers_for_first_contact', theme: 'abstract' },
      learningPointIds: ['4am_amaliyat-judhur_P1'],
      sourceElementIds: ['act-4a'],
    },
    {
      kind: 'manipulation', code: 'square-tiling-144', type: 'square-tiling', module: 1,
      level: 'advanced',
      title: 'مربّع مساحته 144 = 4 × 36 — السطر الأول من جدول الكتاب',
      objective: 'جذر جداء عددين موجبين يساوي جداء جذريهما: √(k² × b) = √(k²) × √b = k√b',
      autonomy: 'ستة تبليطات صالحة (k = 1، 2، 3، 4، 6، 12) وأخرى مرفوضة دون اقتراح: التلميذ يختار k بنفسه، ويقرأ الضلع جداءً في كل مرة، ويجد بينها السطر الأول من الجدول √(4 × 36) = √4 × √36',
      experience: { type: 'textbook', reason: '', theme: '' },
      learningPointIds: ['4am_amaliyat-judhur_P1'],
      sourceElementIds: ['act-4a'],
    },
    // Modules 5–7 — les « مسائل » : exercices complets de type امتحان, ajouts
    // de la plateforme (content/problems.js), sans aucune preuve de maîtrise.
    { kind: 'situation', code: 'masala-1', module: 5, title: 'مسألة الدرس — لوحة الزليج: أيّ البلاطات تصلح؟', learningPointIds: ['4am_amaliyat-judhur_P1'] },
    { kind: 'situation', code: 'masala-2', module: 6, title: 'مسألة — الحديقة العمومية: ممرّ قطري وسياج', learningPointIds: ['4am_amaliyat-judhur_P1', '4am_amaliyat-judhur_P3'] },
    { kind: 'situation', code: 'masala-3', module: 7, title: 'مسألة — شارات المسابقة الولائية', learningPointIds: ['4am_amaliyat-judhur_P1', '4am_amaliyat-judhur_P2'] },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: صحيح أم خاطئ؟ مربع جداء ومربع حاصل قسمة، الجذر التربيعي ومربعه.',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 6, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat-jidaa', path: `${LESSON_BASE_PATH}/nashat-jidaa`,
      title: 'نشاط 4 — جداء جذرين وحاصل قسمتهما', desc: 'بلّط مربّعًا، أكمل جدولَي الكتاب، ضع تخمينًا ثم برهنه بالتربيع.',
      stage: 'trigger', teachesLearningPointIds: ['4am_amaliyat-judhur_P1', '4am_amaliyat-judhur_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 14, difficulty: 2, actionText: 'أجرّب' },
    { id: '02', number: 2, slug: 'majmu', path: `${LESSON_BASE_PATH}/majmu`,
      title: 'نشاط 4 — مجموع جذرين وفرقهما', desc: 'هل √(16 + 9) = √16 + √9؟ احسب وقارن.',
      stage: 'discovery', teachesLearningPointIds: ['4am_amaliyat-judhur_P3'],
      color: 'rose', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — العمليات على الجذور التربيعية', desc: 'الخاصيتان 1 و 2 بملاحظاتهما وأمثلتهما، والملاحظة 3.',
      stage: 'discovery', teachesLearningPointIds: ['4am_amaliyat-judhur_P1', '4am_amaliyat-judhur_P2', '4am_amaliyat-judhur_P3'],
      color: 'violet', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أتعلّم' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 15، 16، 17، 20، 21 و 33 (العدد الذهبي).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_amaliyat-judhur_P1', '4am_amaliyat-judhur_P2'],
      color: 'amber', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أتدرّب' },
    // Les « مسائل » (track: 'problem') : practice_lab, avant le test, qui
    // reste toujours ouvert. Elles comptent dans la complétion, jamais dans
    // la maîtrise — docs/architecture/LESSON_CONTRACT.md § Modules « مسائل ».
    { id: '05', number: 5, slug: 'masala-1', path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة 1 — لوحة الزليج', desc: 'مسألة الدرس: لوحة مربّعة وبلاطات مربّعة. أيّ البلاطات تصلح؟ حلّ كامل خطوة بخطوة.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_amaliyat-judhur_P1'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '06', number: 6, slug: 'masala-2', path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2 — الحديقة العمومية', desc: 'ضلع الحديقة، طول الممرّ القطري، وثمن السياج.',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_amaliyat-judhur_P1', '4am_amaliyat-judhur_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '07', number: 7, slug: 'masala-3', path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3 — شارات المسابقة الولائية', desc: 'من الملصق إلى الشارة: كم مرّة صغُر الضلع؟ وكم ورقة يلزم؟',
      stage: 'practice_lab', track: 'problem', teachesLearningPointIds: ['4am_amaliyat-judhur_P1', '4am_amaliyat-judhur_P2'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أحلّ المسألة' },
    { id: '08', number: 8, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ستة أسئلة تُقيّم الكفاءات الثلاث.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
