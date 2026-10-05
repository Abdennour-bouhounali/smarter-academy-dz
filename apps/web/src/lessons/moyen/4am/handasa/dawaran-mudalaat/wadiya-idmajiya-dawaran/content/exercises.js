/**
 * Les exercices du module 3 « أتعمّق » (p. 161) — extraction › destinations : ex-15 et ex-20 → la synthèse.
 *   ex-15 — AB = 4 cm ; C, D, E, F images successives de B par le دوران (A, 72°, direct). 5 × 72° = 360° : l'image de F est B,
 *           le دوران garde les longueurs ⇒ FB = BC = CD = DE = EF ; dans le triangle ABF isocèle en A (angle 72°), la hauteur
 *           donne FB = 2 × 4 × sin 36° ≈ 4,70 cm. CORRIGÉ : le manuel écrit « ABCDEF » — A est le CENTRE (AB = 4 ≠ BC ≈ 4,70),
 *           le polygone régulier est BCDEF (pentagone de centre A) ; son cercle circonscrit (centre A, rayon 4) : 16π ≈ 50,27 cm² ;
 *   ex-20 (BEM) — AB = 8 cm diamètre, BC = 3 cm : ABC rectangle en C, sin BAC = 3/8, BAC ≈ 22° (22,02°) ; BOC = 2 BAC ≈ 44°
 *           (exact 44,05°, la même valeur arrondie) ; F image de B par la translation de vecteur OB : AF = 12 ; Thales dans AFD,
 *           (BC) // (DF) : 8/12 = 3/DF, DF = 4,5 cm.
 * Toutes les réponses sont recalculées par lab.render.test.jsx avec packages/core (rotation.js, trigonometry.js). Un exercice
 * est découpé en une entrée par question (la première porte l'énoncé). Figures : content/figures.js (EX15, EX20).
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-dawaran_P1',
  P2: '4am_wadiya-idmajiya-dawaran_P2',
  P3: '4am_wadiya-idmajiya-dawaran_P3',
};

const C = (prompt, options, correct, explain, cols = 1) => ({ prompt, options, correct, cols, explain });

export const EX15_SOURCE = src('ex-15', 161, 'أتعمّق', 15);
export const EX20_SOURCE = src('ex-20', 161, 'أتعمّق', 20);

/** La ligne de correction de l'ex. 15 (extraction › ex-15 › correction). */
export const EX15_CORRECTION = 'صحّحت المنصّة خطأً مطبعيًا: الكتاب يكتب «المضلع ABCDEF» و«الدائرة المحيطة بـ ABCDEF»، لكن A مركز الدوران وليست رأسا ( $AB = 4$ بينما $BC \\approx 4{,}70$ ): المضلع المنتظم هو الخماسي BCDEF.';

export const EXERCISES = [
  /* ── تمرين 15 ── */
  {
    id: 'ex-15-1', source: EX15_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'A و B نقطتان حيث AB = 4cm. C هي صورة B بالدّوران الذي مركزه A و زاويته $72^\\circ$ في الاتجاه المباشر. D هي صورة C، E صورة D و F صورة E بالدوران السابق. 1) احسب FB.',
    interaction: 'choice',
    question: C('أوّلا: لماذا $FB = BC$ ؟', [
      'لأنّ $5 \\times 72^\\circ = 360^\\circ$ : صورة F بنفس الدوران هي B، والدوران يحافظ على الأطوال، فـ $FB = EF = DE = CD = BC$',
      'لأنّ F و B على الدائرة التي مركزها A، فـ $FB = AB = 4\\,\\mathrm{cm}$',
      'لأنّ F و B متناظرتان بالنسبة إلى A',
    ], 0, 'بعد أربعة دورانات F على بعد $4 \\times 72^\\circ = 288^\\circ$ من B، والدوران الخامس يعيدها إلى B ( $360^\\circ$ ). صورة القطعة $[BC]$ هي $[CD]$ ثم $[DE]$ ثم $[EF]$ ثم $[FB]$ : كلها بنفس الطول. FB ليس نصف القطر (المثلث ABF ليس متقايس الأضلاع: زاويته عند A $72^\\circ$ )، و F ليست نظيرة B بالنسبة إلى A (الزاوية $\\widehat{BAF} = 72^\\circ$ لا $180^\\circ$ ).'),
    commonError: 'أخذ المسافة بين نقطتين متتاليتين مساوية لنصف القطر، وهذا لا يصحّ إلا في السداسي المنتظم.',
  },
  {
    id: 'ex-15-2', source: EX15_SOURCE, learningPointId: LP.P3, difficulty: 'difficile',
    interaction: 'numeric',
    question: {
      prompt: 'المثلث ABF متساوي الساقين في A و $\\widehat{BAF} = 72^\\circ$ ، والارتفاع النازل من A يقطع $[FB]$ في منتصفها H. احسب FB (بالسنتيمتر) مدوّرا إلى $0{,}01$ .',
      expected: 4.7, display: '4,70',
      explain: 'في المثلث AHB القائم في H: $\\widehat{BAH} = 36^\\circ$ و $\\sin 36^\\circ = \\dfrac{BH}{4}$ ، ومنه $BH = 4\\sin 36^\\circ \\approx 2{,}351$ و $FB = 2 \\times BH = 8\\sin 36^\\circ \\approx 4{,}70\\,\\mathrm{cm}$ .',
    },
    commonError: 'استعمال $\\sin 72^\\circ$ بدل $\\sin 36^\\circ$ : الارتفاع ينصّف الزاوية الرئيسية.',
  },
  {
    id: 'ex-15-3', source: EX15_SOURCE, learningPointId: LP.P1, difficulty: 'difficile',
    statement: '2) برهن أن المضلع BCDEF منتظم.',
    interaction: 'choice',
    question: C('أيّ برهان صحيح؟', [
      'النقط B، C، D، E، F على الدائرة التي مركزها A، وأضلاع BCDEF متقايسة والزوايا المركزية $\\widehat{BAC} = \\widehat{CAD} = \\dots = 72^\\circ$ : BCDEF خماسي منتظم مركزه A',
      'ABCDEF منتظم لأنّ كل رأس صورة الذي قبله بالدوران',
      'BCDEF خماسي منتظم مركزه B لأنّ الدورانات تبدأ من B',
    ], 0, 'الدوران يحافظ على الأطوال وعلى الأقياس: الأضلاع الخمسة متقايسة، والرؤوس على دائرة مركزها A، فالزوايا الخمس متقايسة أيضا. A مركز الخماسي وليست رأسا: $AB = 4$ بينما $BC \\approx 4{,}70$ ، فالمضلع ABCDEF ليس منتظما؛ ومركز المضلع هو مركز الدوران A لا الرأس B.'),
    commonError: 'عدّ مركز الدوران رأسا من رؤوس المضلع.',
  },
  {
    id: 'ex-15-4', source: EX15_SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    statement: '3) احسب مساحة الدائرة المحيطة بـ BCDEF.',
    interaction: 'choice',
    question: C('مساحة الدائرة المحيطة بالخماسي BCDEF:', [
      '$16\\pi \\approx 50{,}27\\,\\mathrm{cm^2}$',
      '$8\\pi \\approx 25{,}13\\,\\mathrm{cm^2}$',
      '$4{,}70^2\\,\\pi \\approx 69{,}40\\,\\mathrm{cm^2}$',
    ], 0, 'الدائرة المحيطة بـ BCDEF مركزها A ونصف قطرها $AB = 4\\,\\mathrm{cm}$ : مساحتها $\\pi \\times 4^2 = 16\\pi \\approx 50{,}27\\,\\mathrm{cm^2}$ . $8\\pi$ هو محيطها (بالسنتيمتر)، و $4{,}70$ طول ضلع الخماسي لا نصف قطر الدائرة.'),
    commonError: 'خلط المساحة $\\pi r^2$ بالمحيط $2\\pi r$ ، أو أخذ الضلع مكان نصف القطر.',
  },

  /* ── تمرين 20 — من امتحان شهادة التعليم المتوسط ── */
  {
    id: 'ex-20-1', source: EX20_SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'من امتحان شهادة التعليم المتوسط. (T) دائرة مركزها O وقطرها AB = 8cm، C نقطة من الدائرة حيث: BC = 3cm. 1) احسب بالتدوير إلى الوحدة من الدرجة قيس الزاوية $\\widehat{BAC}$ ثم استنتج قيس الزاوية $\\widehat{BOC}$ .',
    interaction: 'numeric',
    question: {
      prompt: 'المثلث ABC قائم في C لأنّ [AB] قطر. قيس الزاوية $\\widehat{BAC}$ بالدرجة، مدوّرا إلى الوحدة:',
      expected: 22, display: '22',
      explain: '$\\sin\\widehat{BAC} = \\dfrac{BC}{AB} = \\dfrac{3}{8}$ ومنه $\\widehat{BAC} \\approx 22{,}02^\\circ$ ، أي $22^\\circ$ مدوّرا إلى الوحدة.',
    },
    commonError: 'استعمال $\\cos$ بدل $\\sin$ : الضلع [BC] يقابل الزاوية A.',
  },
  {
    id: 'ex-20-2', source: EX20_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('استنتج قيس الزاوية المركزية $\\widehat{BOC}$ :', [
      '$\\widehat{BOC} \\approx 44^\\circ$ ، لأنّ الزاوية المركزية ضعف الزاوية المحيطية التي تحصر معها نفس القوس BC',
      '$\\widehat{BOC} \\approx 11^\\circ$ ، نصف الزاوية المحيطية',
      '$\\widehat{BOC} \\approx 22^\\circ$ ، لأنّ الزاويتين تحصران نفس القوس',
    ], 0, '$\\widehat{BAC}$ محيطية و $\\widehat{BOC}$ مركزية تحصران القوس BC: $\\widehat{BOC} = 2\\widehat{BAC} \\approx 44^\\circ$ (والحساب بالقيمة المضبوطة $2 \\times 22{,}02^\\circ \\approx 44{,}05^\\circ$ يعطي نفس التدوير). المحيطية هي النصف، لا المركزية.'),
    commonError: 'قسمة الزاوية المحيطية على 2 بدل ضربها في 2.',
  },
  {
    id: 'ex-20-3', source: EX20_SOURCE, learningPointId: LP.P3, difficulty: 'difficile',
    statement: '2) F هي صورة B بالإنسحاب الذي شعاعه $\\overrightarrow{OB}$ ، المستقيم الذي يشمل F ويوازي (BC) يقطع (AC) في D. - أحسب DF. ملاحظة: يُطلب إنجاز الشكل الهندسي.',
    interaction: 'numeric',
    question: {
      prompt: '$BF = OB = 4$ فـ $AF = 12$ ، و (BC) // (DF). احسب DF (بالسنتيمتر):',
      expected: 4.5, display: '4,5',
      explain: 'في المثلث AFD: B من [AF] و C من [AD] و (BC) // (FD)، فحسب خاصية طالس $\\dfrac{AB}{AF} = \\dfrac{BC}{FD}$ أي $\\dfrac{8}{12} = \\dfrac{3}{DF}$ ومنه $DF = \\dfrac{3 \\times 12}{8} = 4{,}5\\,\\mathrm{cm}$ .',
    },
    commonError: 'أخذ $AF = 8 + 8$ (نقل B بشعاع AB بدل OB)، أو قلب النسبة.',
  },
];

/** Les entrées d'un exercice (préfixe d'id), dans l'ordre. */
export const partsOf = (prefix) => EXERCISES.filter((ex) => ex.id.startsWith(`${prefix}-`));
