/**
 * Les exercices du module 3 « أتعمّق » (p. 125) :
 *   ex-31 (MANUEL) — le pavé ABCDEFGH (AB = 3,15 ; FG = BC = 2,35 ; AF = CD = 1,55) : Pythagore DEUX fois (la diagonale
 *         du sol AC = √15,445, puis la diagonale du pavé AD = √17,8475, ≈ 4 et ≈ 4), puis le sinus exact
 *         sin DAC = 1,55 ÷ √17,8475 et DAC ≈ 21,5° → 22° (arrondir AD à 4 d'abord donnerait 23° : l'arrondi en fin) ;
 *   ex-32 (MANUEL) — la pyramide de Khéops (côté 231 m, arêtes 220 m) : le triangle SOA rectangle en O, OA la
 *         demi-diagonale 231√2 ÷ 2 ≈ 163,34, h = √21719,5 ≈ 147 m ; puis une question de la PLATEFORME
 *         (`synthesis_generation`, suggérée par la note de l'extraction) : l'angle d'une arête avec la base,
 *         cos α = OA ÷ SA ⇒ α ≈ 42°.
 * Figures : content/figures.js (EX31, EX32). Un exercice est découpé en une entrée par question (la première porte
 * l'énoncé).
 */
import { src, addition } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-muthallathat_P1',
  P2: '4am_wadiya-idmajiya-muthallathat_P2',
  P3: '4am_wadiya-idmajiya-muthallathat_P3',
};

const C = (prompt, options, correct, explain, cols = 1) => ({ prompt, options, correct, cols, explain });
const N = (prompt, expected, explain) => ({ prompt, expected, display: String(expected).replace('.', ','), explain });

export const EX31_SOURCE = src('ex-31', 125, 'أتعمّق', 31);
export const EX32_SOURCE = src('ex-32', 125, 'أتعمّق', 32);
export const EDGE_ANGLE = { source: addition('synthesis_generation') };

export const EXERCISES = [
  /* ── تمرين 31 — متوازي مستطيلات ── */
  {
    id: 'ex-31-1', source: EX31_SOURCE, learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'ABCDEFGH متوازي مستطيلات (الشكل): $AB = 3{,}15\\,\\mathrm{cm}$ ، $FG = 2{,}35\\,\\mathrm{cm}$ ، $AF = 1{,}55\\,\\mathrm{cm}$ . 1) احسب القيمتين المضبوطتين لكل من AC و AD. أعط المدوّر إلى الوحدة لكل من AC و AD.',
    interaction: 'choice',
    question: C('القيمة المضبوطة للطول AC هي:', [
      '$AC = \\sqrt{3{,}15^2 + 2{,}35^2} = \\sqrt{15{,}445}$',
      '$AC = 3{,}15 + 2{,}35 = 5{,}5$',
      '$AC = \\sqrt{3{,}15^2 + 1{,}55^2} = \\sqrt{12{,}325}$',
    ], 0, 'المثلث ABC قائم في B (وجه القاعدة مستطيل) و $BC = FG = 2{,}35$ : $AC^2 = 3{,}15^2 + 2{,}35^2 = 15{,}445$ . الوتر لا يساوي مجموع الضلعين، و $1{,}55$ هو الارتفاع AF لا ضلع القاعدة.'),
    commonError: 'جمع الضلعين بدل مربعيهما، أو أخذ الارتفاع AF ضلعا في القاعدة.',
  },
  {
    id: 'ex-31-2', source: EX31_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'numeric',
    question: N('المدوّر إلى الوحدة للطول AC (بالسنتيمتر):', 4, '$\\sqrt{15{,}445} \\approx 3{,}93$ ، والمدوّر إلى الوحدة 4 (الرقم الموالي 9 أكبر من 5).'),
    commonError: 'البتر: كتابة 3 بدل 4.',
  },
  {
    id: 'ex-31-3', source: EX31_SOURCE, learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('القيمة المضبوطة للطول AD هي:', [
      '$AD = \\sqrt{15{,}445 + 1{,}55^2} = \\sqrt{17{,}8475}$',
      '$AD = \\sqrt{3{,}15^2 + 1{,}55^2}$',
      '$AD = \\sqrt{15{,}445} + 1{,}55$',
    ], 0, 'الحرف [CD] عمودي على القاعدة فهو عمودي على [AC]: المثلث ACD قائم في C و $AD^2 = AC^2 + CD^2 = 15{,}445 + 1{,}55^2 = 17{,}8475$ . $\\sqrt{3{,}15^2 + 1{,}55^2}$ هو قطر الوجه الأمامي AE ، والجذور لا تُجمع.'),
    commonError: 'حساب قطر الوجه الأمامي AE بدل قطر المجسّم AD.',
  },
  {
    id: 'ex-31-4', source: EX31_SOURCE, learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'numeric',
    question: N('المدوّر إلى الوحدة للطول AD (بالسنتيمتر):', 4, '$\\sqrt{17{,}8475} \\approx 4{,}22$ ، والمدوّر إلى الوحدة 4.'),
  },
  {
    id: 'ex-31-5', source: EX31_SOURCE, learningPointId: LP.P3, difficulty: 'difficile',
    statement: '2) عيّن القيمة المضبوطة للعدد $\\sin\\widehat{DAC}$ . احسب المدوّر إلى الدرجة لقيس الزاوية $\\widehat{DAC}$ .',
    interaction: 'choice',
    question: C('القيمة المضبوطة للعدد $\\sin\\widehat{DAC}$ هي:', [
      '$\\dfrac{1{,}55}{\\sqrt{17{,}8475}}$',
      '$\\dfrac{1{,}55}{\\sqrt{15{,}445}}$',
      '$\\dfrac{\\sqrt{15{,}445}}{\\sqrt{17{,}8475}}$',
    ], 0, 'في المثلث ACD القائم في C: الضلع المقابل للزاوية A هو $CD = 1{,}55$ والوتر AD: $\\sin\\widehat{DAC} = \\dfrac{1{,}55}{\\sqrt{17{,}8475}}$ . $\\dfrac{1{,}55}{\\sqrt{15{,}445}}$ هو الظل، و $\\dfrac{AC}{AD}$ هو جيب التمام.'),
    commonError: 'المجاور AC بدل الوتر AD في المقام (الظل بدل الجيب).',
  },
  {
    id: 'ex-31-6', source: EX31_SOURCE, learningPointId: LP.P3, difficulty: 'difficile',
    interaction: 'numeric',
    question: N('المدوّر إلى الدرجة لقيس الزاوية $\\widehat{DAC}$ :', 22, '$\\sin\\widehat{DAC} \\approx 0{,}367$ واللمسة العكسية للجيب تعطي $\\widehat{DAC} \\approx 21{,}52^{\\circ}$ ، والمدوّر إلى الدرجة $22^{\\circ}$ . لو دوّرنا AD إلى 4 أولا لوجدنا $23^{\\circ}$ : ندوّر في آخر الحساب.'),
    commonError: 'تدوير AD إلى 4 قبل الحساب: $\\dfrac{1{,}55}{4}$ يعطي $23^{\\circ}$ .',
  },

  /* ── تمرين 32 — هرم خوفو ── */
  {
    id: 'ex-32-1', source: EX32_SOURCE, learningPointId: LP.P2, difficulty: 'moyen',
    statement: 'هرم «خوفو» هو هرم منتظم قاعدته مربع طول ضلعه $231\\,\\mathrm{m}$ . رأسه متواجد على المستقيم العمودي على قاعدة الهرم في مركزها. يبعد هذا الرأس بنفس المسافة $220\\,\\mathrm{m}$ عن رؤوس القاعدة. احسب طول ارتفاع هذا الهرم. تدوّر النتيجة إلى الوحدة.',
    interaction: 'choice',
    question: C('في المثلث SOA القائم في O (S الرأس، O مركز القاعدة، A رأس من القاعدة)، الطول OA هو:', [
      '$OA = \\dfrac{231\\sqrt{2}}{2} \\approx 163{,}34\\,\\mathrm{m}$',
      '$OA = \\dfrac{231}{2} = 115{,}5\\,\\mathrm{m}$',
      '$OA = 231\\sqrt{2} \\approx 326{,}68\\,\\mathrm{m}$',
    ], 0, 'O مركز المربع فهو منتصف قطره: قطر المربع $231\\sqrt{2}$ (فيثاغورس)، ونصفه $\\dfrac{231\\sqrt{2}}{2}$ . $115{,}5$ هي المسافة من O إلى منتصف ضلع، و $231\\sqrt{2}$ القطر كاملا.'),
    commonError: 'نصف الضلع بدل نصف القطر.',
  },
  {
    id: 'ex-32-2', source: EX32_SOURCE, learningPointId: LP.P1, difficulty: 'difficile',
    interaction: 'numeric',
    question: N('ارتفاع الهرم SO مدوّرا إلى الوحدة (بالمتر):', 147, '$SO^2 = 220^2 - \\left(\\dfrac{231\\sqrt{2}}{2}\\right)^2 = 48400 - 26680{,}5 = 21719{,}5$ ، و $SO = \\sqrt{21719{,}5} \\approx 147{,}38$ ، أي $147\\,\\mathrm{m}$ — قريب من الارتفاع الأصلي للهرم الأكبر (حوالي $146\\,\\mathrm{m}$ ).'),
    commonError: 'استعمال نصف الضلع: $\\sqrt{220^2 - 115{,}5^2} \\approx 187$ هو ارتفاع وجه جانبي لا ارتفاع الهرم.',
  },
  {
    id: 'ex-32-3', source: EDGE_ANGLE.source, learningPointId: LP.P3, difficulty: 'difficile',
    statement: 'سؤال من المنصّة: ما قيس الزاوية $\\widehat{SAO}$ التي يصنعها الحرف [SA] مع القاعدة؟ (المدوّر إلى الدرجة)',
    interaction: 'numeric',
    question: N('المدوّر إلى الدرجة لقيس الزاوية $\\widehat{SAO}$ :', 42, '$\\cos\\widehat{SAO} = \\dfrac{OA}{SA} = \\dfrac{231\\sqrt{2}}{2 \\times 220} \\approx 0{,}742$ ، واللمسة العكسية لجيب التمام تعطي $\\widehat{SAO} \\approx 42{,}06^{\\circ}$ ، أي $42^{\\circ}$ .'),
    commonError: 'إعطاء $0{,}742$ (جيب تمام الزاوية) بدل قيسها.',
  },
];

/** Les entrées d'un exercice (préfixe d'id), dans l'ordre. */
export const partsOf = (prefix) => EXERCISES.filter((ex) => ex.id.startsWith(`${prefix}-`));
