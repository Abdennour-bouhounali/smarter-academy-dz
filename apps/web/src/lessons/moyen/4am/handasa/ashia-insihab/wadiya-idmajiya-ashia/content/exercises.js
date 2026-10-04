/**
 * Les exercices du module 3 « أتعمّق » (p. 137) :
 *   ex-19 (MANUEL, « من امتحان شهادة التعليم المتوسط ») — EFG rectangle isocèle en F (EF = FG = 4 cm) ; D image de F
 *         par la translation de vecteur EF (F milieu de [ED]) ; C image de E par la translation de vecteur GD
 *         (EC = GD ⇒ EGDC متوازي أضلاع) ; les diagonales [ED] et [GC] se coupent en leur milieu F, mesurent 8 cm et sont
 *         perpendiculaires : EGDC est un CARRÉ, d'aire 8 × 8 ÷ 2 = 32 cm² (côté 4√2) ; U = EF + EC + FG = EG + EC = ED ;
 *   ex-22 (MANUEL) — ABCD quelconque, M, N, P, Q milieux de [DA], [AB], [BC], [CD] : AD + BC = AC + BD par Chasles
 *         (on insère C puis D), et MNPQ متوازي أضلاع par la droite des milieux dans ABD et CBD (MN et QP parallèles à
 *         (BD), de longueur BD ÷ 2, de même sens) — « MN = ½ DB » sort du programme vectoriel de 4AM (extraction ›
 *         ex-22 › note) : la preuve passe par la propriété des milieux, en longueurs.
 * Un exercice est découpé en une entrée par question (la première porte l'énoncé). Figures : content/figures.js.
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-ashia_P1',
  P2: '4am_wadiya-idmajiya-ashia_P2',
  P3: '4am_wadiya-idmajiya-ashia_P3',
};

const C = (prompt, options, correct, explain, cols = 1) => ({ prompt, options, correct, cols, explain });
const N = (prompt, expected, explain) => ({ prompt, expected, display: String(expected).replace('.', ','), explain });

export const EX19_SOURCE = src('ex-19', 137, 'أتعمّق', 19);
export const EX22_SOURCE = src('ex-22', 137, 'أتعمّق', 22);

export const EXERCISES = [
  /* ── تمرين 19 — من امتحان شهادة التعليم المتوسط ── */
  {
    id: 'ex-19-1', source: EX19_SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'من امتحان شهادة التعليم المتوسط. 1) أنشئ مثلثا EFG قائما في F حيث $EF = FG = 4\\,\\mathrm{cm}$ . 2) أنشئ النقطتين: D صورة النقطة F بالإنسحاب الذي شعاعه $\\overrightarrow{EF}$ و C صورة النقطة E بالإنسحاب الذي شعاعه $\\overrightarrow{GD}$ .',
    interaction: 'choice',
    question: C('D صورة F بالانسحاب الذي شعاعه $\\overrightarrow{EF}$ ، إذن:', [
      '$\\overrightarrow{FD} = \\overrightarrow{EF}$ ، أي F منتصف [ED]',
      '$\\overrightarrow{DF} = \\overrightarrow{EF}$ ، أي D منتصف [EF]',
      '$\\overrightarrow{ED} = \\overrightarrow{EF}$ ، أي D هي F',
    ], 0, 'صورة F هي D حيث $\\overrightarrow{FD} = \\overrightarrow{EF}$ (من النقطة إلى صورتها)، و $\\overrightarrow{EF} = \\overrightarrow{FD}$ معناه أنّ F منتصف [ED]: D على امتداد [EF] و $ED = 8\\,\\mathrm{cm}$ .'),
    commonError: 'كتابة الشعاع من الصورة إلى النقطة ( $\\overrightarrow{DF}$ بدل $\\overrightarrow{FD}$ ).',
  },
  {
    id: 'ex-19-2', source: EX19_SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'choice',
    question: C('C صورة E بالانسحاب الذي شعاعه $\\overrightarrow{GD}$ ، أي $\\overrightarrow{EC} = \\overrightarrow{GD}$ . نستنتج أنّ:', [
      'الرباعي EGDC متوازي أضلاع، قطراه [ED] و [GC]',
      'الرباعي ECGD متوازي أضلاع',
      'النقطة E منتصف [CD]',
    ], 0, '$\\overrightarrow{EC} = \\overrightarrow{GD}$ يعطي متوازي الأضلاع ECDG، وهو نفسه EGDC (الرؤوس نفسها في الترتيب المعاكس): الضلعان المتقابلان [EC] و [GD]، والقطران [ED] و [GC]. في ECGD يتقاطع الضلعان [EC] و [GD].'),
    commonError: 'ترتيب الرؤوس: $\\overrightarrow{EC} = \\overrightarrow{GD}$ لا يعطي ECGD.',
  },
  {
    id: 'ex-19-3', source: EX19_SOURCE, learningPointId: LP.P1, difficulty: 'difficile',
    statement: '3) بيّن أنّ الرباعي EGDC مربع. - احسب مساحته.',
    interaction: 'choice',
    question: C('لماذا EGDC مربع؟', [
      'قطراه [ED] و [GC] متناصفان في F، ومتقايسان ( $8\\,\\mathrm{cm}$ )، ومتعامدان',
      'أضلاعه الأربعة طولها $4\\,\\mathrm{cm}$',
      'زاويته في F قائمة',
    ], 0, 'EGDC متوازي أضلاع فقطراه متناصفان، و F منتصف [ED] فهي منتصف [GC] أيضا: $FC = FG = 4$ ومنه $GC = 8 = ED$ (قطران متقايسان: مستطيل)، و $(FG) \\perp (EF)$ أي القطران متعامدان (معيّن): مربع. ضلعه $EG = 4\\sqrt{2}$ لا 4، و F مركزه لا رأس من رؤوسه.'),
    commonError: 'الخلط بين ضلع المربع ( $4\\sqrt{2}\\,\\mathrm{cm}$ ) ونصف قطره ( $4\\,\\mathrm{cm}$ ).',
  },
  {
    id: 'ex-19-4', source: EX19_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'numeric',
    question: N('مساحة المربع EGDC (بالسنتيمتر المربع):', 32, 'قطرا المربع طولهما $8\\,\\mathrm{cm}$ : $\\mathcal{A} = \\dfrac{8 \\times 8}{2} = 32\\,\\mathrm{cm^2}$ ، أو $EG^2 = (4\\sqrt{2})^2 = 32$ .'),
    commonError: 'حساب $4 \\times 4 = 16$ (مساحة المثلث EFG مضاعفة) أو $8 \\times 8 = 64$ (نسيان القسمة على 2).',
  },
  {
    id: 'ex-19-5', source: EX19_SOURCE, learningPointId: LP.P3, difficulty: 'difficile',
    statement: '4) ليكن الشعاع $\\vec{U}$ حيث $\\vec{U} = \\overrightarrow{EF} + \\overrightarrow{EC} + \\overrightarrow{FG}$ ، بيّن أنّ $\\vec{U} = \\overrightarrow{ED}$ .',
    interaction: 'choice',
    question: C('أيّ سلسلة تبيّن ذلك؟', [
      '$\\overrightarrow{EF} + \\overrightarrow{FG} = \\overrightarrow{EG}$ (شال) ثم $\\overrightarrow{EG} + \\overrightarrow{EC} = \\overrightarrow{ED}$ (قاعدة متوازي الأضلاع في EGDC)',
      '$\\overrightarrow{EF} + \\overrightarrow{EC} = \\overrightarrow{FC}$ (شال) ثم $\\overrightarrow{FC} + \\overrightarrow{FG} = \\overrightarrow{CG}$',
      '$\\overrightarrow{EF} + \\overrightarrow{FG} = \\overrightarrow{EG}$ ثم $\\overrightarrow{EG} + \\overrightarrow{EC} = \\overrightarrow{GC}$',
    ], 0, 'نرتّب المجموع لتتعاقب الأشعة: $\\overrightarrow{EF} + \\overrightarrow{FG} = \\overrightarrow{EG}$ ، ثم الشعاعان $\\overrightarrow{EG}$ و $\\overrightarrow{EC}$ لهما نفس المبدأ E في متوازي الأضلاع EGDC، فمجموعهما القطر $\\overrightarrow{ED}$ . $\\overrightarrow{EF} + \\overrightarrow{EC}$ ليس سلسلة (نهاية الأول F ليست مبدأ الثاني)، والقطر الآخر $\\overrightarrow{GC}$ ليس مجموعهما.'),
    commonError: 'تطبيق علاقة شال على شعاعين غير متعاقبين.',
  },

  /* ── تمرين 22 — منتصفات أضلاع رباعي ── */
  {
    id: 'ex-22-1', source: EX22_SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'ABCD رباعي و M، N، P، Q هي على الترتيب، منتصفات [DA]، [AB]، [BC]، [CD]. 1) بيّن أن $\\overrightarrow{AD} + \\overrightarrow{BC} = \\overrightarrow{AC} + \\overrightarrow{BD}$ .',
    interaction: 'choice',
    question: C('الإثبات الصحيح:', [
      '$\\overrightarrow{AD} = \\overrightarrow{AC} + \\overrightarrow{CD}$ و $\\overrightarrow{BC} = \\overrightarrow{BD} + \\overrightarrow{DC}$ ، و $\\overrightarrow{CD} + \\overrightarrow{DC} = \\overrightarrow{0}$',
      '$\\overrightarrow{AD} + \\overrightarrow{BC} = \\overrightarrow{AC}$ لأنّ D و B تختصران حسب علاقة شال',
      '$\\overrightarrow{AD} = \\overrightarrow{BC}$ لأنّ ABCD متوازي أضلاع',
    ], 0, 'نُدخل C في الشعاع الأول و D في الثاني بعلاقة شال: $\\overrightarrow{AD} + \\overrightarrow{BC} = \\overrightarrow{AC} + \\overrightarrow{CD} + \\overrightarrow{BD} + \\overrightarrow{DC} = \\overrightarrow{AC} + \\overrightarrow{BD}$ لأنّ $\\overrightarrow{CD}$ و $\\overrightarrow{DC}$ متعاكسان. علاقة شال لا تختصر شعاعين غير متعاقبين، و ABCD رباعي كيفي.'),
    commonError: 'اختصار نقطتين في شعاعين غير متعاقبين ( $\\overrightarrow{AD} + \\overrightarrow{BC}$ ).',
  },
  {
    id: 'ex-22-2', source: EX22_SOURCE, learningPointId: LP.P1, difficulty: 'difficile',
    statement: '2) برهن أن الرباعي MNPQ متوازي أضلاع.',
    interaction: 'choice',
    question: C('البرهان الصحيح:', [
      'في المثلث ABD: (MN)//(BD) و $MN = \\dfrac{BD}{2}$ ؛ وفي المثلث CBD: (QP)//(BD) و $QP = \\dfrac{BD}{2}$ ، والشعاعان في اتجاه D نحو B: $\\overrightarrow{MN} = \\overrightarrow{QP}$ ومنه MNPQ متوازي أضلاع',
      '$\\overrightarrow{MN} = \\overrightarrow{PQ}$ ومنه MNPQ متوازي أضلاع',
      'ABCD متوازي أضلاع فمنتصفات أضلاعه تشكّل متوازي أضلاع',
    ], 0, 'خاصية مستقيم المنتصفين في المثلثين ABD و CBD تعطي ضلعين [MN] و [QP] موازيين لـ (BD) وطول كل منهما $\\dfrac{BD}{2}$ ، في نفس الاتجاه (من جهة D نحو جهة B): $\\overrightarrow{MN} = \\overrightarrow{QP}$ ، وهذا يعني أنّ MNPQ متوازي أضلاع. $\\overrightarrow{MN} = \\overrightarrow{PQ}$ خاطئة (الاتجاه معاكس) وكانت ستعطي MNQP، و ABCD ليس متوازي أضلاع.'),
    commonError: 'ترتيب الرؤوس في متوازي الأضلاع ( $\\overrightarrow{MN} = \\overrightarrow{QP}$ لا $\\overrightarrow{PQ}$ ).',
  },
];

/** Les entrées d'un exercice (préfixe d'id), dans l'ordre. */
export const partsOf = (prefix) => EXERCISES.filter((ex) => ex.id.startsWith(`${prefix}-`));
