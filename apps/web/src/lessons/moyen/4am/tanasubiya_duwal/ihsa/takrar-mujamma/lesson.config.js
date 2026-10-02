/**
 * الدرس 1 — التكرار المجمع والتواتر المجمع (الصاعد والنازل)
 * Unité 8 du manuel (4AM) « الإحصاء » : « أستعدّ » item 4 (p. 91), نشاط 1 et 2 (p. 92), معارف 1 et 2 (p. 94),
 * طرائق « حساب التكرار والتواتر المجمعين » + دوري الآن (p. 95), exercices 1–6 (p. 98) et 21 (p. 101),
 * QCM 1–2 (p. 100). Source de vérité : docs/sources/4am/unit8/extraction.json.
 *
 * LE PARCOURS (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH THE MATH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   M0 أستعدّ           — les acquis : تكرار, تواتر, « على الأكثر / على الأقل », ترتيب تصاعدي ;
 *   M1 نشاط 1           — REAL (la file du manège / les 20 élèves) → DISCOVER → MANIPULATE (cumul-gate : la barre
 *                         de la toise, t compté des deux côtés, le tableau rempli par ses propres comptes),
 *                         puis les questions du نشاط 1 et le مخطط des âges ; la brique qui NOMME (les phrases du manuel) ;
 *   M2 معارف            — UNDERSTAND (معارف 1 : la somme des effectifs) → TOUCH THE MATH (نشاط 2 : ÷ 30, des fractions)
 *                         → FORMALIZE (معارف 2, « التواتر », ce que montrent les deux bouts des colonnes) ;
 *   M3 طرائق            — FORMALIZE (les deux طرائق du manuel : valeurs, puis فئات) + دوري الآن ;
 *   M4 أوظّف تعلّماتي   — AUTOMATIZE (ex-1, 2, 4, 5, 21) et TRANSFER (ex-3 accidents en %, ex-6 électricité) ;
 *   M5 إختبار أولي      — QCM 1–2 et quatre épreuves de la plateforme ; P1, P2, P3 couverts.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/tanasubiya_duwal/takrar-mujamma';

export const LESSON_CONFIG = {
  id: 'takrar-mujamma',
  kind: 'lesson',
  unit: 'ihsa',
  unitTitle: 'الإحصاء',
  sequentialUnlock: true,
  title: 'التكرار المجمع والتواتر المجمع (الصاعد والنازل)',
  description: 'مدخل الوحدة: قامات التلاميذ وعلاماتهم تقود إلى التكرار المجمع الصاعد والنازل لقيمة أو لفئة، ثم إلى التكرار النسبي المجمع (التواتر المجمع الصاعد والنازل)، وتنظيم المعطيات في جداول تكرارية مجمعة وقراءتها وتفسيرها.',
  level: 'moyen',
  grade: '4am',
  chapter: 'tanasubiya_duwal',
  chapterTitle: 'ميدان التناسبية والدوال',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '📶',
  estimatedDurationMin: 50,
  textbookRef: { unit: 8, activity: 1, pages: '91, 92, 94, 95, 98, 100, 101' },
  skills: [
    'حساب التكرار المجمع الصاعد والتكرار المجمع النازل لقيمة من سلسلة إحصائية',
    'حساب التواتر المجمع الصاعد والنازل لقيمة أو لفئة',
    'تنظيم المعطيات في جدول تكرارات مجمعة وقراءته وتفسيره («على الأكثر»، «على الأقل»)',
  ],
  teachingScope: {
    include: [
      'نشاط 1: قامات 20 تلميذا — «159cm على الأقل» و«160cm على الأكثر»، جدولا الصاعد والنازل، ومخطط الأعمار',
      'نشاط 2: علامات 30 تلميذا — التكرار النسبي المجمع الصاعد والنازل',
      'تعريفا التكرار المجمع الصاعد والنازل (معارف 1) والتكرار النسبي المجمع = التواتر المجمع (معارف 2)',
      'طريقتا الحساب لقيمة ولفئة (طرائق، الزلازل والعمال) ودوري الآن',
    ],
    exclude: [
      'المدى والوسيط والمتوسط (الدرس 2)',
      'المجدولات وتمثيل السلسلة بمخطط في الإكسال (الدرس 3، ومنه السؤال هـ من التمرين 1)',
      'تفسير المؤشرات ومقارنة السلاسل (الدرس 4)',
    ],
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique (années antérieures) : le تكرار d'une valeur, le تواتر (= التكرار
  // النسبي), « على الأكثر / على الأقل », le ترتيب تصاعدي.
  priorKnowledge: ['takrar-qima', 'tawatur-nisbi', 'ala-aqal-akthar', 'tartib-tasaudi'],
  resources: [
    // Le module 1 ouvre sur LA TOISE DU MANÈGE (cumul-gate). متقدم (ouvert par défaut : le نشاط 1 du manuel) :
    // les 20 élèves dans l'ordre du manuel, le tableau des questions 4–5 ; مبتدئ : la file d'un manège.
    {
      kind: 'manipulation', code: 'cumul-gate-funpark-8', type: 'cumul-gate', module: 1,
      level: 'beginner',
      title: 'طابور اللعبة: 130cm على الأقل',
      objective: 'التكرار المجمع الصاعد لقيمة t هو عدد القيم الأصغر من أو تساوي t، والنازل عدد القيم الأكبر من أو تساوي t؛ والقيمة t تُعدّ في الجهتين',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'funpark' },
      learningPointIds: ['4am_takrar-mujamma_P1'],
      sourceElementIds: ['act-1'],
    },
    {
      kind: 'manipulation', code: 'cumul-gate-act1-20', type: 'cumul-gate', module: 1,
      level: 'advanced',
      title: 'نشاط 1: قامات 20 تلميذا',
      objective: 'التكرار المجمع الصاعد لقيمة t هو عدد القيم الأصغر من أو تساوي t، والنازل عدد القيم الأكبر من أو تساوي t؛ والقيمة t تُعدّ في الجهتين',
      autonomy: 'عشرون تلميذا في ترتيب الكتاب (غير مرتّبين): التلميذ يقرّر بنفسه أن يرتّبهم، ويختار الشرط والقيمة t، ويعلن العدد دون أي اقتراح؛ كل عدد صحيح يملأ خانة من جدول الكتاب، والخطأ يُرفض بشاهد (المنسيّون الذين قامتهم t بالضبط، أو غير المضائين)',
      experience: { type: 'textbook', reason: '', theme: 'school' },
      learningPointIds: ['4am_takrar-mujamma_P1', '4am_takrar-mujamma_P3'],
      sourceElementIds: ['act-1'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'خمس عبارات: تكرار قيمة، التواتر، «على الأكثر / على الأقل»، والترتيب التصاعدي. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'nashat', path: `${LESSON_BASE_PATH}/nashat`,
      title: 'نشاط 1 — بوابة القامة', desc: 'حرّك شريط المقياس وأعلن كم تلميذا قامته t على الأكثر أو على الأقل، ثم أسئلة النشاط: الترتيب، 159cm على الأقل، 160cm على الأكثر، الجدولان، ومخطط الأعمار.',
      stage: 'trigger', teachesLearningPointIds: ['4am_takrar-mujamma_P1', '4am_takrar-mujamma_P3'],
      color: 'indigo', style: 'featured', estimatedMin: 12, difficulty: 1, actionText: 'أجرّب البوابة' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — التكرار والتواتر المجمعان', desc: 'تعريفا التكرار المجمع الصاعد والنازل، نشاط 2 (علامات 30 تلميذا مقسومة على 30)، التواتر المجمع، وما نقرؤه في طرفي الجدول.',
      stage: 'discovery', teachesLearningPointIds: ['4am_takrar-mujamma_P1', '4am_takrar-mujamma_P2', '4am_takrar-mujamma_P3'],
      color: 'violet', style: 'featured', estimatedMin: 11, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — الحساب لقيمة ولفئة', desc: 'الزلازل (لكل قيمة) والعمال (لكل فئة، مدرّج تكراري)، ثم دوري الآن.',
      stage: 'formalization', teachesLearningPointIds: ['4am_takrar-mujamma_P1', '4am_takrar-mujamma_P2', '4am_takrar-mujamma_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أتعلّم الطريقة' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 1 إلى 6 و 21: درجات الحرارة، العلامات، حوادث المرور، القامات، مدة التنقل، استهلاك الكهرباء.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_takrar-mujamma_P1', '4am_takrar-mujamma_P2', '4am_takrar-mujamma_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 2, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'ستة أسئلة تُقيّم نقاط التعلّم الثلاث، منها السؤالان 1 و 2 من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 6, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
