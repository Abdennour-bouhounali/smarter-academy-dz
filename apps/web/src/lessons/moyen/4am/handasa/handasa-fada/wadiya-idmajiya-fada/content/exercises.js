/**
 * Les exercices du module 3 « أتعمّق » — le scan n'a ni exercices ni « أتعمّق » (extraction › scope.missing_pages) : c'est la
 * وضعية TRANSPOSÉE de la plateforme (`synthesis_generation`, content/textbook.js › ICE) — boule + cône + réduction, d'autres
 * nombres que le seau, réponses nulle part ailleurs :
 *   cornet : cône de hauteur 16 cm, ouverture de rayon 4 cm, pointe S en bas ; boule de glace de rayon 2 cm.
 *   V_boule = 4/3·π·2³ = 32π/3 ≈ 33,51 cm³ ; V_cornet = 1/3·π·4²·16 = 256π/3 ≈ 268,08 cm³ ; rapport 1/8 : rien ne déborde ;
 *   le liquide = un cône de sommet S, réduction du cornet de rapport k avec k³ = 1/8 ⇒ k = 1/2 : hauteur 8 cm, rayon 2 cm.
 * Toutes les réponses sont recalculées par lab.render.test.jsx avec packages/core (space.js). Une entrée par question (la
 * première porte l'énoncé, le module montre aussi la figure content/figures.js › ICE_FIGURE).
 */
import { addition } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-fada_P1',
  P2: '4am_wadiya-idmajiya-fada_P2',
  P3: '4am_wadiya-idmajiya-fada_P3',
};

const SOURCE = addition('synthesis_generation');
const C = (prompt, options, correct, explain, cols = 1) => ({ prompt, options, correct, cols, explain });

export const EXERCISES = [
  {
    id: 'ice-1', source: SOURCE, learningPointId: LP.P1, difficulty: 'facile',
    statement: 'مخروط بسكويت على شكل مخروط دوران رأسه S إلى الأسفل، ارتفاعه $16\\,\\mathrm{cm}$ ونصف قطر فتحته $4\\,\\mathrm{cm}$ ، وفوقه كرة مثلجات (جلّة) نصف قطرها $2\\,\\mathrm{cm}$ . تذوب المثلجات وتسيل داخل المخروط.',
    interaction: 'choice',
    question: C('حجم كرة المثلجات:', [
      '$16\\pi\\,\\mathrm{cm}^3$',
      '$\\dfrac{32}{3}\\pi\\,\\mathrm{cm}^3 \\approx 33{,}51\\,\\mathrm{cm}^3$',
      '$32\\pi\\,\\mathrm{cm}^3$',
      '$\\dfrac{8}{3}\\pi\\,\\mathrm{cm}^3$',
    ], 1, 'حجم الجلة $\\dfrac{4}{3}\\pi R^3 = \\dfrac{4}{3}\\pi \\times 2^3 = \\dfrac{32}{3}\\pi \\approx 33{,}51\\,\\mathrm{cm}^3$ . $16\\pi$ هي $4\\pi R^2$ (مساحة الكرة)، و $32\\pi$ بنسيان القسمة على 3، و $\\dfrac{8}{3}\\pi$ بنسيان المعامل 4.', 2),
    commonError: 'استعمال $4\\pi R^2$ (مساحة الكرة) بدل $\\dfrac{4}{3}\\pi R^3$ (حجم الجلة).',
  },
  {
    id: 'ice-2', source: SOURCE, learningPointId: LP.P1, difficulty: 'facile',
    interaction: 'choice',
    question: C('حجم مخروط البسكويت:', [
      '$256\\pi\\,\\mathrm{cm}^3$',
      '$\\dfrac{64}{3}\\pi\\,\\mathrm{cm}^3$',
      '$\\dfrac{256}{3}\\pi\\,\\mathrm{cm}^3 \\approx 268{,}08\\,\\mathrm{cm}^3$',
    ], 2, 'حجم المخروط $\\dfrac{1}{3}\\pi r^2 h = \\dfrac{1}{3}\\pi \\times 4^2 \\times 16 = \\dfrac{256}{3}\\pi \\approx 268{,}08\\,\\mathrm{cm}^3$ . $256\\pi$ بنسيان $\\dfrac{1}{3}$ (حجم أسطوانة)، و $\\dfrac{64}{3}\\pi$ بأخذ $r$ بدل $r^2$ .'),
    commonError: 'نسيان المعامل $\\dfrac{1}{3}$ في حجم المخروط.',
  },
  {
    id: 'ice-3', source: SOURCE, learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('هل تفيض المثلجات الذائبة من المخروط؟', [
      'نعم: حجمها أكبر من حجم المخروط',
      'لا: حجمها ربع حجم المخروط',
      'لا: حجمها $\\dfrac{1}{8}$ حجم المخروط',
    ], 2, '$\\dfrac{32}{3}\\pi \\div \\dfrac{256}{3}\\pi = \\dfrac{32}{256} = \\dfrac{1}{8}$ : السائل يملأ ثُمن المخروط فقط.'),
    commonError: 'مقارنة نصفي القطرين ( $2$ و $4$ ) بدل مقارنة الحجمين.',
  },
  {
    id: 'ice-4', source: SOURCE, learningPointId: LP.P3, difficulty: 'difficile',
    statement: 'السائل يملأ مخروطا صغيرا رأسه S ومحوره محور المخروط: هو تصغير لمخروط البسكويت نسبته $k$ .',
    interaction: 'numeric',
    question: {
      prompt: 'حجم السائل $\\dfrac{1}{8}$ حجم المخروط، أي $k^3 = \\dfrac{1}{8}$ . ارتفاع السائل في المخروط (بالسنتيمتر):',
      expected: 8, display: '8',
      explain: '$k^3 = \\dfrac{1}{8}$ ومنه $k = \\dfrac{1}{2}$ (لأنّ $\\left(\\dfrac{1}{2}\\right)^3 = \\dfrac{1}{8}$ )، فارتفاع السائل $16 \\times \\dfrac{1}{2} = 8\\,\\mathrm{cm}$ .',
    },
    commonError: 'أخذ $k = \\dfrac{1}{8}$ بدل $k^3 = \\dfrac{1}{8}$ ، فيُحسب ارتفاع $2\\,\\mathrm{cm}$ .',
  },
  {
    id: 'ice-5', source: SOURCE, learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'numeric',
    question: {
      prompt: 'نصف قطر سطح السائل (بالسنتيمتر):',
      expected: 2, display: '2',
      explain: 'سطح السائل دائرة هي تصغير لدائرة الفتحة بنفس النسبة $k = \\dfrac{1}{2}$ : $4 \\times \\dfrac{1}{2} = 2\\,\\mathrm{cm}$ .',
    },
    commonError: 'ضرب نصف القطر في $k^3$ بدل $k$ : الأطوال تُضرب في $k$ .',
  },
];

/** Les entrées d'un exercice (préfixe d'id), dans l'ordre. */
export const partsOf = (prefix) => EXERCISES.filter((ex) => ex.id.startsWith(`${prefix}-`));
