/**
 * الدرس 1 من الوحدة 9 — خاصية طالس وحساب الأطوال (4AM, learning net item `4am.m2.r01`, unit « خاصية طالس »).
 * A v2 lesson since 2026-11-24: the student plays it in the world « الأهرامات » (`lesson.pack.js`, `world/`), built
 * from scratch on the platform's own numbers (docs/reports/PYRAMIDS_WORLD_PLAN.md §3); its module pages and its mission
 * player are deleted. The textbook only fixed its الكفاءات (LESSON_DEVELOPMENT_GUIDE §4ter).
 *
 * Every value below is a LITERAL (read by scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/talis-hisab-atwal';

export const LESSON_CONFIG = {
  id: 'talis-hisab-atwal',
  kind: 'lesson',
  unit: 'khassiyat-talis',
  unitTitle: 'خاصية طالس',
  sequentialUnlock: true,
  // A v2 lesson (docs/architecture/LESSON_V2.md §2): the student's home is the game world of `lesson.pack.js`. Its module
  // PAGES, the mission player (`studentView`, `mission`) and « مسألة الدرس » (`lessonProblem`) are deleted. The
  // `modules` below stay as DATA: their ids and numbers are how progress is stored (the world's end marks them all,
  // `kit/storyEnd.js`), every report reads them, and their addresses redirect home. Modules 1–4 are the four docks of
  // the world, one key each (🔑 P1, 📐 P2, 🦋 P1 and P2, 🔍 P3 — world/evidence.js › POINTS); module 5 is the last
  // dock, the mission that needs the whole lesson.
  title: 'خاصية طالس وحساب الأطوال',
  description:
    'على ضفاف النيل يقيس التلميذ بالحبل المعقود ويتوقّع ثمّ يتحقّق: متى تتساوى النسب بين أطوال مثلثين، وكيف يُحسب طول من ثلاثة أطوال معلومة، ثمّ يقرأ أحد المثلثين نسخة أصغر أو أكبر من الآخر.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '📐',
  estimatedDurationMin: 50,
  skills: [
    'التعرف على وضعية طالس واستخراج النسب الثلاث المتساوية',
    'توظيف خاصية طالس لحساب أطوال مجهولة في أشكال هندسية مستوية',
    'تحديد معامل التناسبية k وقراءة أحد المثلثين تكبيرا أو تصغيرا للآخر',
  ],
  teachingScope: {
    include: [
      'خاصية طالس في المثلث: إذا كان (MN) يوازي (BC) فإن النسب الثلاث متساوية، كلّ طول من الرأس على الضلع كلّه',
      'حساب طول مجهول من ثلاثة أطوال معلومة، ولو كانت المعطيات قطعًا تُجمع أو تُطرح',
      'وضعية الفراشة: النقطتان من الجهة الأخرى للرأس، والنسب نفسها',
      'معامل التناسبية k: عدد واحد لكلّ الأضلاع، تصغير إذا كان أصغر من 1 وتكبير إذا كان أكبر من 1، والعكس 1/k',
    ],
    exclude: [
      'الخاصية العكسية لخاصية طالس وإثبات التوازي (الدرس 2)',
      'تقسيم قطعة وإنشاء طول معلوم (الدرس 3)',
      'الوضعية الإدماجية للوحدة (أدمج تعلّماتي)',
    ],
  },
  knowledgeMap: true,
  // The lesson's progressive map is the world's « خريطة المعارف »: the `KNOWLEDGE_GRAPH` of the knowledge its pack declares
  // (`lesson.pack.js › knowledge`) — the only one; its home mounts no other (LESSON_V2.md §2).
  knowledgeMapMode: 'progressive',
  // what the lesson stands on (concept ids, data): the fourth proportional and the cross product, the proportionality
  // of the lengths of a triangle cut by a parallel (3AM), the proportionality table
  priorKnowledge: ['rabi-mutanasib', 'mustaqim-muntasafayn', 'jadwal-tanasub'],
  resources: [
    // DATA only (exported to the DB; `sourceElementIds` are read by scripts/check-textbook-coverage.mjs): the
    // `shadow-world` workspace below was the old module page's instrument; no page of this lesson mounts it any more (the
    // lab stays in the closed registry, mounted by the unit's synthesis). The lesson's instrument in « مختبري » is `rope`.
    {
      kind: 'manipulation',
      code: 'shadow-world-sahat-alhayy-5',
      type: 'shadow-world',
      module: 1,
      level: 'beginner',
      title: 'الشمس والظلال',
      objective:
        'إذا كان (B′C′) يوازي (BC) فإن AB′/AB = AC′/AC = B′C′/BC، أينما كانت B′ على المستقيم (AB)؛ ظلّ كل شيء شاقولي ÷ طوله عدد واحد في اللحظة نفسها لأنّ أشعة الشمس متوازية',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'platform_designed_entry', theme: 'minaret' },
      learningPointIds: ['4am_talis-hisab-atwal_P1'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation',
      code: 'shadow-world-sahat-alhayy-6-5',
      type: 'shadow-world',
      module: 1,
      level: 'advanced',
      title: 'الشمس والظلال — مئذنة أعلى',
      objective:
        'إذا كان (B′C′) يوازي (BC) فإن AB′/AB = AC′/AC = B′C′/BC، أينما كانت B′ على المستقيم (AB)؛ ظلّ كل شيء شاقولي ÷ طوله عدد واحد في اللحظة نفسها لأنّ أشعة الشمس متوازية',
      autonomy: '',
      experience: { type: 'textbook', reason: '', theme: 'minaret' },
      learningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2'],
      sourceElementIds: ['act-1'],
    },
    // The property itself (the textbook's « know-1 »), taught by the key 🔑 « وضعية طالس »: forged on the field's two
    // canals, named on its tablet (world/tablets.js) — data, read by scripts/check-textbook-coverage.mjs
    {
      kind: 'method',
      code: 'khassiyat-talis',
      module: 2,
      title: 'خاصية طالس',
      learningPointIds: ['4am_talis-hisab-atwal_P1'],
      sourceElementIds: ['know-1'],
    },
    // Modules 5–7 — the « مسائل »: platform additions (their pages and content/problems.js are deleted since the v2 —
    // data here), never evidence of mastery.
    {
      kind: 'situation',
      code: 'masala-1',
      module: 5,
      title: 'مسألة 1',
      learningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2', '4am_talis-hisab-atwal_P3'],
    },
    {
      kind: 'situation',
      code: 'masala-2',
      module: 6,
      title: 'مسألة 2',
      learningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2'],
    },
    {
      kind: 'situation',
      code: 'masala-3',
      module: 7,
      title: 'مسألة 3',
      learningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2', '4am_talis-hisab-atwal_P3'],
    },
  ],
  modules: [
    {
      id: '00',
      number: 0,
      slug: 'astaidd',
      path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ',
      desc: 'ما يلزم قبل الدرس، تقيسه « عُدّة الانطلاق ».',
      stage: 'prerequisite_check',
      color: 'teal',
      style: 'diagnostic',
      estimatedMin: 5,
      difficulty: 1,
      actionText: 'أتحقّق من مكتسباتي',
    },
    {
      id: '01',
      number: 1,
      slug: 'nashat',
      path: `${LESSON_BASE_PATH}/nashat`,
      title: 'حقل النيل',
      desc: 'قناتان في حقل مثلث: متى يصدق الحساب، ومتى يرفضه الحبل؟',
      stage: 'trigger',
      teachesLearningPointIds: ['4am_talis-hisab-atwal_P1'],
      color: 'indigo',
      style: 'featured',
      estimatedMin: 12,
      difficulty: 1,
      actionText: 'أدخل الحقل',
    },
    {
      id: '02',
      number: 2,
      slug: 'maarif',
      path: `${LESSON_BASE_PATH}/maarif`,
      title: 'ورشة البنّائين',
      desc: 'طول مجهول من ثلاثة أطوال معلومة، ولو كانت قطعًا.',
      stage: 'discovery',
      teachesLearningPointIds: ['4am_talis-hisab-atwal_P2'],
      color: 'violet',
      style: 'featured',
      estimatedMin: 10,
      difficulty: 2,
      actionText: 'أكتشف',
    },
    {
      id: '03',
      number: 3,
      slug: 'taraiq',
      path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'عرض النيل',
      desc: 'نقطتان من الجهة الأخرى للرأس: عرض النهر دون عبوره.',
      stage: 'formalization',
      teachesLearningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2'],
      color: 'emerald',
      style: 'featured',
      estimatedMin: 10,
      difficulty: 2,
      actionText: 'أقيس',
    },
    {
      id: '04',
      number: 4,
      slug: 'awazzif',
      path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'حجر القمّة',
      desc: 'عدد واحد لكلّ الأضلاع: نسخة أصغر أو أكبر.',
      stage: 'practice_lab',
      teachesLearningPointIds: ['4am_talis-hisab-atwal_P3'],
      color: 'amber',
      style: 'featured',
      estimatedMin: 10,
      difficulty: 2,
      actionText: 'أتدرّب',
    },
    // The « مسائل » (track: 'problem'): they count in completion, never in mastery; the story's end completes them.
    {
      id: '05',
      number: 5,
      slug: 'masala-1',
      path: `${LESSON_BASE_PATH}/masala-1`,
      title: 'مسألة الدرس',
      desc: 'المهمّة الأخيرة: تحتاج الدرس كلّه.',
      stage: 'practice_lab',
      track: 'problem',
      teachesLearningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2', '4am_talis-hisab-atwal_P3'],
      color: 'amber',
      style: 'featured',
      estimatedMin: 8,
      difficulty: 3,
      actionText: 'أحلّ المسألة',
    },
    {
      id: '06',
      number: 6,
      slug: 'masala-2',
      path: `${LESSON_BASE_PATH}/masala-2`,
      title: 'مسألة 2',
      desc: 'وضعية تُحسب عند إتمام الدرس.',
      stage: 'practice_lab',
      track: 'problem',
      teachesLearningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2'],
      color: 'amber',
      style: 'featured',
      estimatedMin: 8,
      difficulty: 3,
      actionText: 'أحلّ المسألة',
    },
    {
      id: '07',
      number: 7,
      slug: 'masala-3',
      path: `${LESSON_BASE_PATH}/masala-3`,
      title: 'مسألة 3',
      desc: 'وضعية أخرى تُحسب عند إتمام الدرس.',
      stage: 'practice_lab',
      track: 'problem',
      teachesLearningPointIds: ['4am_talis-hisab-atwal_P1', '4am_talis-hisab-atwal_P2', '4am_talis-hisab-atwal_P3'],
      color: 'amber',
      style: 'featured',
      estimatedMin: 8,
      difficulty: 3,
      actionText: 'أحلّ المسألة',
    },
    {
      id: '08',
      number: 8,
      slug: 'itqan',
      path: `${LESSON_BASE_PATH}/itqan`,
      title: 'التقويم',
      desc: 'تقويم الكفاءات: أسئلة على منوال الامتحان.',
      stage: 'evaluation',
      color: 'slate',
      style: 'boss',
      estimatedMin: 6,
      difficulty: 2,
      actionText: 'أدخل التقويم',
    },
  ],
};
