/**
 * الدرس 4 — حل مشكلات وإنجاز براهين بتوظيف الأشعة والانسحاب (unité 11 « الأشعة والانسحاب », manuel pp. 127–138).
 * La leçon n'a PAS d'activité du manuel : son entrée est le laboratoire `vector-chain` (le métro d'Alger), dont le
 * niveau متقدم est l'exercice 18 p. 137 (DÉCLARÉ — extraction › notes › labAdvancedLevel) ; ses éléments du manuel sont
 * la طريقة p. 133 et دوري الآن 1 (module 2), دوري الآن p. 138 (module 3) et les exercices 17, 18, 20, 21, 23, 24 (module 4).
 * La démarche de la preuve vectorielle est une ADDITION DÉCLARÉE (`knowledge_formalization`, « معارف من المنصّة »).
 *
 * Le parcours (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   0 أستعدّ                     diagnostic : Chasles, la règle du parallélogramme, l'égalité ⇔ ABDC, le milieu, les opposés,
 *                                les quadrilatères
 *   1 مترو الجزائر (trigger)     REAL (des tickets de métro) → MANIPULATE (raccorder, transporter, annuler) → UNDERSTAND
 *                                (ce qui se raccorde, ce que les données égalent, la figure qui ne prouve pas)
 *   2 طرائق (discovery)           TOUCH → FORMALIZE : traduire · transformer · conclure ; la طريقة p. 133 ligne à ligne ;
 *                                ce qu'on conclut ; دوري الآن 1 prouvé par l'élève
 *   3 إنشاءات (manipulation)      دوري الآن p. 138 FAIT au laboratoire (mode construct) : les centres de (Γ₁) et (Γ₂)
 *   4 أوظّف تعلّماتي (practice_lab) AUTOMATIZE → TRANSFER : تمارين 20, 17, 23, 21 (corrigé), 24, 18
 *   5 إختبار أولي (evaluation)
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/barahin-ashia';

export const LESSON_CONFIG = {
  id: 'barahin-ashia',
  kind: 'lesson',
  unit: 'ashia-insihab',
  unitTitle: 'الأشعة والانسحاب',
  sequentialUnlock: true,
  title: 'حل مشكلات وإنجاز براهين بتوظيف الأشعة والانسحاب',
  description: 'تذاكر مترو الجزائر أشعة: نربط المتتابعة منها بعلاقة شال، نعوّض شعاعا بشعاع يساويه حسب المعطيات، نحذف المتعاكسين، فنبرهن أن رباعيا متوازي أضلاع أو أن نقطة منتصف قطعة، وننشئ مجموع عدة أشعة.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '🚇',
  estimatedDurationMin: 55,
  textbookRef: { unit: 11, activity: 0, pages: '133, 137, 138' },
  skills: [
    'تبسيط عبارة شعاعية مركبة بعلاقة شال وقاعدة متوازي الأضلاع وتعويض شعاع بشعاع يساويه وحذف شعاعين متعاكسين',
    'ترجمة خاصية هندسية (متوازي أضلاع، منتصف، استقامية، توازي) إلى مساواة شعاعية وبرهانها بالمعطيات وحدها',
    'إنشاء ممثّل مجموع عدة أشعة وصورة دائرة بانسحاب',
  ],
  teachingScope: {
    include: [
      'طريقة «استعمال تساوي شعاعين لإنجاز برهان» ودوري الآن 1 (ص 133)',
      'خطوات البرهان باستعمال الأشعة وما نستنتجه من مساواة شعاعية (معارف من المنصّة)',
      'دوري الآن (ص 138): صور دائرة بانسحابات شعاعها مجموع شعاعين',
      'التمارين 17 و 18 و 20 و 21 و 23 و 24 (ص 137)',
    ],
    exclude: [
      'تعريف الشعاع والانسحاب وتساوي شعاعين (الدرسان 1 و 2)، إلا تذكيرًا',
      'علاقة شال وقاعدة متوازي الأضلاع كتعريفين (الدرس 3)',
      'ضرب شعاع في عدد ومركبتا شعاع في معلم (خارج هذا الدرس)',
    ],
  },
  knowledgeMap: true,
  // La carte PROGRESSIVE (knowledgeGraph.js) — KNOWLEDGE_MAP.md, Part A.
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique (leçons 1–3 de l'unité et années précédentes).
  priorKnowledge: ['shal', 'qaidat-mutawazi', 'tasawi-shuaayn', 'muntasaf-shuaa', 'mutaakisan', 'khawass-rubaiyat'],
  resources: [
    // Module 1 : l'entrée (pas d'activité du manuel). مبتدئ : le parallélogramme du métro (plateforme) — BC + AB, AB + AD ;
    // متقدم : l'exercice 18 — prouver OL = AC et HK = AC avec les seules données.
    {
      kind: 'manipulation', code: 'vector-chain-metro', type: 'vector-chain', module: 1,
      level: 'beginner',
      title: 'مترو الجزائر: تذكرتان في رحلة واحدة',
      objective: 'تبسيط عبارة شعاعية بعلاقة شال وتعويض شعاع بشعاع يساويه حسب المعطيات وحذف شعاعين متعاكسين، لإنجاز برهان',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'metro' },
      learningPointIds: ['4am_barahin-ashia_P1'],
      sourceElementIds: ['ex-18'],
    },
    {
      kind: 'manipulation', code: 'vector-chain-ex18', type: 'vector-chain', module: 1,
      level: 'advanced',
      title: 'التمرين 18: برهن أن OL = AC و HK = AC',
      objective: 'تبسيط عبارة شعاعية بعلاقة شال وتعويض شعاع بشعاع يساويه حسب المعطيات وحذف شعاعين متعاكسين، لإنجاز برهان',
      autonomy: 'ثماني محطات وستة معطيات دون اقتراح: التلميذ يختار المعطى الذي يعوّض به كل شعاع (مع الانتباه إلى الاتجاه)، ويصل إلى الشعاع المطلوب؛ والمساواة التي تُرى على الشكل دون معطى تُرفض',
      experience: { type: 'platform_adaptation', reason: 'improved_interactivity_and_age_appropriateness', theme: 'metro' },
      learningPointIds: ['4am_barahin-ashia_P1', '4am_barahin-ashia_P2'],
      sourceElementIds: ['ex-18'],
    },
    // Module 3 : دوري الآن ص 138 posé SEUL au laboratoire (mode construct, `levels={false}`) — l'exercice du manuel,
    // un seul niveau (précédent : inshaat-talis M2).
    {
      kind: 'manipulation', code: 'vector-chain-now138', type: 'vector-chain', module: 3,
      title: 'دوري الآن (ص 138): مركزا صورتي الدائرة',
      learningPointIds: ['4am_barahin-ashia_P3'],
      sourceElementIds: ['now-138'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'ست عبارات: علاقة شال، قاعدة متوازي الأضلاع، تساوي شعاعين وترتيب الرؤوس، المنتصف، الشعاعان المتعاكسان، الرباعيات. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'metro', path: `${LESSON_BASE_PATH}/metro`,
      title: 'مترو الجزائر — نختصر ونبرهن', desc: 'تذاكر المترو أشعة: اربط المتتابعة، انقل تذكرة إلى محطة تساويها رحلتها، واحذف الذهاب والإياب، حتى تبرهن التمرين 18.',
      stage: 'trigger', teachesLearningPointIds: ['4am_barahin-ashia_P1', '4am_barahin-ashia_P2'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 2, actionText: 'أركب المترو' },
    { id: '02', number: 2, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — كيف نبرهن بالأشعة؟', desc: 'خطوات البرهان، طريقة الكتاب (ص 133) سطرا سطرا، ماذا نستنتج من مساواة شعاعية، ودوري الآن تبرهنه بنفسك.',
      stage: 'discovery', teachesLearningPointIds: ['4am_barahin-ashia_P1', '4am_barahin-ashia_P2'],
      color: 'emerald', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أبرهن' },
    { id: '03', number: 3, slug: 'inshaat', path: `${LESSON_BASE_PATH}/inshaat`,
      title: 'إنشاءات — صور دائرة بانسحاب', desc: 'دوري الآن (ص 138) في المختبر: ممثّلات متتابعة على المرصوفة تعطي مركزي الدائرتين.',
      stage: 'manipulation', teachesLearningPointIds: ['4am_barahin-ashia_P3'],
      color: 'sky', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أنشئ' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 20 و 17 و 23 و 21 و 24 و 18 (ص 137).',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_barahin-ashia_P1', '4am_barahin-ashia_P2', '4am_barahin-ashia_P3'],
      color: 'amber', style: 'featured', estimatedMin: 11, difficulty: 3, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ستة أسئلة تُقيّم نقاط التعلّم الثلاث: التبسيط، البرهان والاستنتاج، الإنشاء.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 7, difficulty: 3, actionText: 'أدخل التقويم' },
  ],
};
