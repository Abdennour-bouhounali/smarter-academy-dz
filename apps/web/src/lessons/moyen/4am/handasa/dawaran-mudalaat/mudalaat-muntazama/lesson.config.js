/**
 * الدرس 4 — المضلعات المنتظمة وتطبيقاتها (الوحدة 13 « الدوران - الزوايا - المضلّعات المنتظمة »)
 * Manuel (4AM) : أستعدّ 1 (p. 151, module 0), le تحدّ « نجمة العلم » (p. 151, l'ENTRÉE) et مدخل الباب « نجمة البحر »
 * (doublon déclaré), نشاط 5 (p. 153) — module 1 ; معارف 5 (p. 156, module 2) ; طرائق et دوري الآن (p. 157, module 3) ;
 * تمارين 9, 13, 14 (p. 159), 19 et 15 (p. 161, doublon déclaré) — module 4 ; أؤكّد تعلّماتي 4 (p. 160, doublon déclaré,
 * module 5). Source de vérité : docs/sources/4am/unit13/extraction.json.
 *
 * LE PARCOURS (REAL → DISCOVER → MANIPULATE → UNDERSTAND → TOUCH THE MATH → FORMALIZE → AUTOMATIZE → TRANSFER) :
 *   M0 أستعدّ        — le triangle équilatéral par ses angles (manuel), le triangle isocèle, l'image d'un point par une
 *                      rotation, inscrit = moitié du central, le sinus (plateforme) ;
 *   M1 تحدّ ونشاط 5  — REAL (le tifo de l'étoile du drapeau ; la نجمة البحر) → DISCOVER / MANIPULATE (polygon-forge :
 *                      tourner α, appliquer la rotation, la figure ne se ferme qu'à 360°/n ; مبتدئ l'alvéole de ruche,
 *                      متقدم l'étoile : 72°, R, les branches) → UNDERSTAND (le نشاط 5 : 120°, P ↦ M) → le تحدّ résolu ;
 *   M2 معارف 5       — FORMALIZE : définition, cercle circonscrit et centre, 360°/n, la rotation qui laisse le polygone ;
 *   M3 طرائق         — TOUCH THE MATH / FORMALIZE : l'angle 108° (coquille corrigée), la construction par une rotation de
 *                      108° autour de A, le côté à partir de R = √3, دوري الآن (l'heptagone) ;
 *   M4 أوظّف تعلّماتي — AUTOMATIZE (ex-13, ex-19) et TRANSFER (ex-9, ex-14, ex-15 corrigé) ;
 *   M5 إختبار أولي   — l'item 4 de أؤكّد تعلّماتي et quatre épreuves de la plateforme ; P1, P2, P3 couverts.
 *
 * Toutes les valeurs ci-dessous sont des LITTÉRAUX (lues par scripts/validate-lessons.mjs).
 */
export const LESSON_BASE_PATH = '/courses/moyen/4am/handasa/mudalaat-muntazama';

export const LESSON_CONFIG = {
  id: 'mudalaat-muntazama',
  kind: 'lesson',
  unit: 'dawaran-mudalaat',
  unitTitle: 'الدوران - الزوايا - المضلّعات المنتظمة',
  sequentialUnlock: true,
  title: 'المضلعات المنتظمة وتطبيقاتها',
  description: 'نجمة العلم في تيفو المدرجات وخلية النحل: رؤوس المضلع المنتظم صور متتالية لرأس واحد بالدوران الذي زاويته 360° على n، ومنها زواياه وطول ضلعه وإنشاؤه بالمدور أو بالدوران.',
  level: 'moyen',
  grade: '4am',
  chapter: 'handasa',
  chapterTitle: 'ميدان الهندسة',
  passingScore: 4,
  masteryThreshold: 0.8,
  emoji: '⬡',
  estimatedDurationMin: 55,
  textbookRef: { unit: 13, activity: 5, pages: '151, 153, 156, 157, 159, 160, 161' },
  skills: [
    'التعرّف على المضلع المنتظم والدائرة المحيطة به ومركزه',
    'حساب قيس الزاوية المركزية لمضلع منتظم وقيس زاويته',
    'إنشاء المثلث المتقايس الأضلاع والمربع والسداسي والخماسي المنتظم بالمدور أو بالدوران، وحساب طول ضلعه',
  ],
  teachingScope: {
    include: [
      'التحدّي: نجمة العلم الجزائري، المسافة بين رأسين متتاليين 10 cm',
      'نشاط 5: المثلث المتقايس الأضلاع في دائرته، الزوايا المركزية، الدوران الذي زاويته 120°',
      'معارف 5: التعريف، الدائرة المحيطة ومركز المضلع، الزاوية المركزية 360° على n، صورة المضلع بالدوران',
      'طرائق: زاوية الخماسي المنتظم 108°، إنشاء خماسي منتظم بالدوران، طول ضلع مضلع منتظم من نصف القطر، السباعي المنتظم',
    ],
    exclude: [
      'مفهوم الدوران وإنشاء الصور (الدرس 1) وخواصه (الدرس 2)',
      'برهان العلاقة بين الزاوية المحيطية والزاوية المركزية (الدرس 3)',
      'الوضعية الإدماجية: أعمدة الإنارة حول حوض الأزهار (أدمج تعلّماتي)',
    ],
  },
  knowledgeMap: true,
  knowledgeMapMode: 'progressive',
  // Les acquis que « أستعدّ » diagnostique : les angles d'un triangle (équilatéral), le triangle isocèle, l'image d'un
  // point par une rotation (درس 1), l'angle inscrit et l'angle au centre (درس 3), le sinus (unité 10).
  priorKnowledge: ['majmu-zawaya-muthallath', 'mutasawi-saqayn', 'surat-nuqta-dawaran', 'muhitiya-markaziya', 'nisab-muthallathiya'],
  resources: [
    // Le module 1 ouvre sur LA FORGE DE POLYGONES (polygon-forge). متقدم (ouvert par défaut : le تحدّ de l'unité) : l'étoile
    // du drapeau en tifo ; مبتدئ : l'alvéole d'une ruche de Kabylie.
    {
      kind: 'manipulation', code: 'polygon-forge-cell', type: 'polygon-forge', module: 1,
      level: 'beginner',
      title: 'خلية النحل: سداسي منتظم بالدوران',
      objective: 'رؤوس المضلع المنتظم ذي n ضلعا صور متتالية لرأس واحد بالدوران الذي مركزه مركز المضلع: الحلقة تنغلق مضلعا منتظما فقط إذا كان n × α = 360°، ومنها الزاوية المركزية وزاوية المضلع وطول ضلعه',
      autonomy: '',
      experience: { type: 'platform_context', reason: 'smaller_numbers_for_first_contact', theme: 'honeycomb' },
      learningPointIds: ['4am_mudalaat-muntazama_P2', '4am_mudalaat-muntazama_P3'],
      sourceElementIds: ['challenge', 'act-5'],
    },
    {
      kind: 'manipulation', code: 'polygon-forge-flag-star', type: 'polygon-forge', module: 1,
      level: 'advanced',
      title: 'التحدّي: نجمة العلم، رأسان متتاليان على بعد 10 cm',
      objective: 'رؤوس المضلع المنتظم ذي n ضلعا صور متتالية لرأس واحد بالدوران الذي مركزه مركز المضلع: الحلقة تنغلق مضلعا منتظما فقط إذا كان n × α = 360°، ومنها الزاوية المركزية وزاوية المضلع وطول ضلعه',
      autonomy: 'ثلاث مراحل يفتحها التلميذ بنفسه دون زاوية مقترحة: يجد زاوية الرؤوس الخمسة، ثم نصف القطر الذي يجعل المسافة بين رأسين متتاليين 10 cm بالضبط إلى 0,01 (بالسحب أو بحساب جيب 36° في المثلث القائم)، ثم يرسم الفروع رأسا بعد رأس — ضلع الخماسي مرفوض فرعا',
      experience: { type: 'textbook', reason: '', theme: 'flag-star' },
      learningPointIds: ['4am_mudalaat-muntazama_P3'],
      sourceElementIds: ['challenge'],
    },
  ],
  modules: [
    { id: '00', number: 0, slug: 'astaidd', path: `${LESSON_BASE_PATH}/astaidd`,
      title: 'أستعدّ', desc: 'خمس عبارات: زوايا المثلث، المثلث المتساوي الساقين، صورة نقطة بدوران، الزاوية المحيطية والمركزية، والجيب. صحيح أم خاطئ؟',
      stage: 'prerequisite_check', color: 'teal', style: 'diagnostic', estimatedMin: 5, difficulty: 1, actionText: 'أتحقّق من مكتسباتي' },
    { id: '01', number: 1, slug: 'tahaddi', path: `${LESSON_BASE_PATH}/tahaddi`,
      title: 'التحدّي ونشاط 5 — نجمة العلم وخلية النحل', desc: 'دوّر رأسا حول المركز حتى تنغلق الحلقة: خلية نحل سداسية، ثم رؤوس نجمة العلم وفروعها. ثم المثلث المتقايس الأضلاع في دائرته (نشاط 5) وحلّ التحدّي.',
      stage: 'trigger', teachesLearningPointIds: ['4am_mudalaat-muntazama_P1', '4am_mudalaat-muntazama_P2', '4am_mudalaat-muntazama_P3'],
      color: 'indigo', style: 'featured', estimatedMin: 16, difficulty: 2, actionText: 'أبدأ التحدّي' },
    { id: '02', number: 2, slug: 'maarif', path: `${LESSON_BASE_PATH}/maarif`,
      title: 'معارف — المضلعات المنتظمة', desc: 'التعريف، الدائرة المحيطة ومركز المضلع، الزاوية المركزية 360° على n، والدوران الذي يحوّل المضلع إلى نفسه.',
      stage: 'discovery', teachesLearningPointIds: ['4am_mudalaat-muntazama_P1', '4am_mudalaat-muntazama_P2'],
      color: 'violet', style: 'featured', estimatedMin: 9, difficulty: 2, actionText: 'أكتشف' },
    { id: '03', number: 3, slug: 'taraiq', path: `${LESSON_BASE_PATH}/taraiq`,
      title: 'طرائق — زاوية المضلع وإنشاؤه وطول ضلعه', desc: 'زاوية الخماسي المنتظم، إنشاء خماسي منتظم بالدوران، طول ضلع المثلث من نصف قطر دائرته، والسباعي المنتظم.',
      stage: 'formalization', teachesLearningPointIds: ['4am_mudalaat-muntazama_P2', '4am_mudalaat-muntazama_P3'],
      color: 'emerald', style: 'featured', estimatedMin: 12, difficulty: 3, actionText: 'أتعلّم الطرائق' },
    { id: '04', number: 4, slug: 'awazzif', path: `${LESSON_BASE_PATH}/awazzif`,
      title: 'أوظّف تعلّماتي', desc: 'تمارين الكتاب 13 و 19 و 9 و 14 و 15.',
      stage: 'practice_lab', teachesLearningPointIds: ['4am_mudalaat-muntazama_P1', '4am_mudalaat-muntazama_P2', '4am_mudalaat-muntazama_P3'],
      color: 'amber', style: 'featured', estimatedMin: 8, difficulty: 3, actionText: 'أتدرّب' },
    { id: '05', number: 5, slug: 'itqan', path: `${LESSON_BASE_PATH}/itqan`,
      title: 'إختبار أولي', desc: 'خمسة أسئلة تُقيّم نقاط التعلّم الثلاث، منها السؤال 4 من أؤكّد تعلّماتي.',
      stage: 'evaluation', color: 'slate', style: 'boss', estimatedMin: 5, difficulty: 2, actionText: 'أدخل التقويم' },
  ],
};
