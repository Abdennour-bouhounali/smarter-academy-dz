/**
 * Les exercices du MANUEL rattachés à la synthèse (extraction › destinations : ex-32, ex-37,
 * ex-38, ex-39 p. 75 — module 3 « أتعمّق »). Chaque énoncé est celui du livre, au mot près ;
 * un exercice est découpé en une entrée par étape (la première porte l'énoncé).
 *
 *   ex-32  g(x) = x√8(1/2 − x√2) + 8 − 16(x/2 − √2)² se développe en −8x² + 17√2x − 24 :
 *          g n'est PAS linéaire (relu à 300 dpi, énoncé inchangé — extraction › discrepancies).
 *   ex-37  8 mg dans 13 cL = 0,13 L : 800/13 ≈ 61,54 mg/L > 45 mg/L — eau non potable.
 *   ex-38  1/6 n'a pas voté : 5/6 ≈ 83,33 % ont voté, donc « 80 % ont voté » est vrai
 *          (au moins 80 % — lecture de l'extraction, dite dans la correction).
 *   ex-39  40 cg = 0,4 g dans 500 + 40 = 540 mL = 0,54 L : 20/27 ≈ 0,74 g/L.
 * Une valeur approchée est tapée (`numeric`, prédicat à 0,01 près, `parseDec` : « 61,54 »).
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-khattiya_P1',
  P2: '4am_wadiya-idmajiya-khattiya_P2',
  P3: '4am_wadiya-idmajiya-khattiya_P3',
};

const E = (n, part) => ({ ...src(`ex-${n}`, 75, 'أتعمّق', n), ...(part ? { part } : {}) });
const C = (prompt, options, correct, explain, cols = 1) => ({ prompt, options, correct, cols, explain });
/** Une valeur approchée à 0,01 près : `expected` est un prédicat (NumericQuestion). */
const Approx = (prompt, value, display, explain) => ({ prompt, expected: (n) => Number.isFinite(n) && Math.abs(n - value) <= 0.01, display, explain });

export const EXERCISES = [
  /* ── تمرين 32 — هل g دالة خطية؟ ── */
  {
    id: 'ex-32-1', source: E(32, '1'), learningPointId: LP.P1, difficulty: 'difficile',
    statement: 'هل الدّالة $g$ المعرّفة بالدستور: $g(x) = x\\sqrt{8}\\left(\\dfrac{1}{2} - x\\sqrt{2}\\right) + 8 - 16\\left(\\dfrac{x}{2} - \\sqrt{2}\\right)^2$ دالة خطية؟ في حالة الإيجاب عيّن معاملها.',
    interaction: 'choice',
    question: C('ننشر ونبسّط العبارة أولا. $g(x)$ يساوي:', [
      '$-8x^2 + 17\\sqrt{2}\\,x - 24$',
      '$17\\sqrt{2}\\,x$',
      '$-8x^2 + 17\\sqrt{2}\\,x + 8$',
      '$-4x^2 + \\sqrt{2}\\,x - 24$',
    ], 0, '$x\\sqrt{8}\\left(\\dfrac{1}{2} - x\\sqrt{2}\\right) = \\sqrt{2}\\,x - 4x^2$ (لأنّ $\\dfrac{\\sqrt{8}}{2} = \\sqrt{2}$ و $\\sqrt{8} \\times \\sqrt{2} = 4$ ) ؛ و $16\\left(\\dfrac{x}{2} - \\sqrt{2}\\right)^2 = 4x^2 - 16\\sqrt{2}\\,x + 32$. إذن $g(x) = \\sqrt{2}\\,x - 4x^2 + 8 - 4x^2 + 16\\sqrt{2}\\,x - 32 = -8x^2 + 17\\sqrt{2}\\,x - 24$.'),
    method: 'ننشر كل جداء، ونطبّق المتطابقة $(a - b)^2 = a^2 - 2ab + b^2$ ، ثم نجمع الحدود المتشابهة.',
    commonError: 'نسيان أنّ الطرح يشمل كل حدود $16\\left(\\dfrac{x}{2} - \\sqrt{2}\\right)^2$ : الحد $-32$ يبقى.',
  },
  {
    id: 'ex-32-2', source: E(32, '2'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('إذن، هل $g$ دالة خطية؟', [
      'لا: بعد التبسيط يبقى حد في $x^2$ وحد ثابت $-24$ ، فهي ليست من الشكل $x \\longmapsto ax$',
      'نعم، ومعاملها $17\\sqrt{2}$',
      'نعم، ومعاملها $-8$',
      'لا، لأنّ معاملات عبارتها أعداد غير ناطقة',
    ], 0, '$g(0) = -24 \\neq 0$ وفيها حد في $x^2$. ووجود $\\sqrt{2}$ لا يمنع الخطية: $x \\longmapsto \\sqrt{2}\\,x$ دالة خطية.'),
    commonError: 'الحكم قبل التبسيط، أو اعتبار $17\\sqrt{2}$ معاملا مع بقاء الحدين الآخرين.',
  },

  /* ── تمرين 37 — نترات مياه الشرب ── */
  {
    id: 'ex-37-1', source: E(37, '1'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'يجب ألّا تتجاوز الكتلة الحجمية لنترات مياه الشرب $45\\,\\mathrm{mg/L}$. كأس سعته 13cL. عند ملئه بالماء تتحصل على 8mg من النترات. هل يمكن أن نقول أن هذا الماء صالح للشرب؟',
    interaction: 'numeric',
    question: Approx('الكتلة الحجمية للنترات في هذا الماء، بـ $\\mathrm{mg/L}$ (مدوّرة إلى $0{,}01$):', 800 / 13, '61,54',
      '$13\\,\\mathrm{cL} = 0{,}13\\,\\mathrm{L}$ ، و $\\dfrac{8}{0{,}13} = \\dfrac{800}{13} \\approx 61{,}54$ ، أي $61{,}54\\,\\mathrm{mg/L}$ تقريبا.'),
    method: 'نحوّل السعة إلى اللتر (وحدة الحد المسموح) ثم نقسم الكتلة على الحجم.',
    commonError: 'القسمة على 13 دون تحويل: $\\dfrac{8}{13} \\approx 0{,}62$ كتلة في السنتيلتر الواحد، لا في اللتر.',
  },
  {
    id: 'ex-37-2', source: E(37, '2'), learningPointId: LP.P3, difficulty: 'facile',
    interaction: 'choice',
    question: C('هل هذا الماء صالح للشرب؟', [
      'لا: $61{,}54\\,\\mathrm{mg/L} > 45\\,\\mathrm{mg/L}$',
      'نعم: $8\\,\\mathrm{mg} < 45\\,\\mathrm{mg}$',
      'نعم: $\\dfrac{8}{13} \\approx 0{,}62\\,\\mathrm{mg/L}$ وهي أقل من $45\\,\\mathrm{mg/L}$',
      'لا يمكن الحكم دون معرفة كمية الماء التي نشربها',
    ], 0, 'نقارن الكتلة الحجمية (لا الكتلة) بالحد المسموح وبالوحدة نفسها: $61{,}54 > 45$ ، فالماء غير صالح للشرب، مهما كانت الكمية التي نشربها.'),
    commonError: 'مقارنة كتلة ($8\\,\\mathrm{mg}$) بكتلة حجمية ($45\\,\\mathrm{mg/L}$): مقداران من نوعين مختلفين.',
  },

  /* ── تمرين 38 — الناخبون ── */
  {
    id: 'ex-38-1', source: E(38, '1'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'هل صحيح أنه إذا كان سُدس عدد الناخبين في انتخابات لم يصوتوا، فإنه يمكن القول أن 80% منهم صوتوا؟',
    interaction: 'numeric',
    question: Approx('النسبة المئوية للناخبين الذين صوّتوا (مدوّرة إلى $0{,}01$):', 500 / 6, '83,33',
      'صوّت $1 - \\dfrac{1}{6} = \\dfrac{5}{6}$ من الناخبين، و $\\dfrac{5}{6} \\times 100 = \\dfrac{250}{3} \\approx 83{,}33$ ، أي $83{,}33\\%$ تقريبا.'),
    commonError: 'حساب نسبة الذين لم يصوّتوا ($\\dfrac{1}{6} \\approx 16{,}67\\%$ ) بدل نسبة المصوّتين.',
  },
  {
    id: 'ex-38-2', source: E(38, '2'), learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'choice',
    question: C('هل القول «80% منهم صوّتوا» صحيح؟', [
      'صحيح: نسبة المصوّتين $\\dfrac{5}{6} \\approx 83{,}33\\%$ ، وهي أكبر من 80%',
      'خاطئ: نسبة المصوّتين $\\dfrac{1}{6} \\approx 16{,}67\\%$',
      'خاطئ: نسبة المصوّتين $100\\% - 6\\% = 94\\%$',
      'صحيح: نسبة المصوّتين 80% بالضبط',
    ], 0, 'السدس ليس 6%: $\\dfrac{1}{6} \\approx 16{,}67\\%$ لم يصوّتوا، فصوّت $83{,}33\\%$ تقريبا. إذن صوّت 80% منهم على الأقل: القول صحيح (بل صوّت أكثر).'),
    commonError: 'قراءة «السدس» كـ 6%: الكسر $\\dfrac{1}{6}$ يساوي $\\dfrac{100}{6}\\%$.',
  },

  /* ── تمرين 39 — عصير البرتقال ── */
  {
    id: 'ex-39-1', source: E(39, '1'), learningPointId: LP.P2, difficulty: 'moyen',
    statement: '500mL من عصير البرتقال يحتوي على 40cg من السكر. وجد عبد الحميد هذا المشروب حلوًا جدا فأضاف له 40mL من الماء. ما هو تركيز السكر في المشروب الجديد؟',
    interaction: 'choice',
    question: C('في المشروب الجديد:', [
      '$0{,}4\\,\\mathrm{g}$ من السكر في $540\\,\\mathrm{mL}$ ، أي $0{,}54\\,\\mathrm{L}$',
      '$40\\,\\mathrm{g}$ من السكر في $0{,}54\\,\\mathrm{L}$',
      '$0{,}4\\,\\mathrm{g}$ من السكر في $500\\,\\mathrm{mL}$',
      '$0{,}44\\,\\mathrm{g}$ من السكر في $0{,}54\\,\\mathrm{L}$',
    ], 0, 'الماء المضاف لا يغيّر كتلة السكر: $40\\,\\mathrm{cg} = 0{,}4\\,\\mathrm{g}$ ؛ ويزيد الحجم: $500 + 40 = 540\\,\\mathrm{mL} = 0{,}54\\,\\mathrm{L}$.'),
    commonError: 'نسيان أنّ الماء المضاف يغيّر الحجم ولا يغيّر كتلة السكر.',
  },
  {
    id: 'ex-39-2', source: E(39, '2'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'numeric',
    question: Approx('تركيز السكر في المشروب الجديد، بـ $\\mathrm{g/L}$ (مدوّرا إلى $0{,}01$):', 20 / 27, '0,74',
      '$\\dfrac{0{,}4}{0{,}54} = \\dfrac{20}{27} \\approx 0{,}74$ ، أي $0{,}74\\,\\mathrm{g/L}$ تقريبا (كان $\\dfrac{0{,}4}{0{,}5} = 0{,}8\\,\\mathrm{g/L}$ قبل إضافة الماء: المشروب صار أقل حلاوة).'),
    commonError: 'القسمة على $0{,}5\\,\\mathrm{L}$ : هذا تركيز العصير قبل إضافة الماء.',
  },
];

/** Les questions d'un exercice du manuel (numéro → entrées), dans l'ordre. */
export const partsOf = (n) => EXERCISES.filter((ex) => ex.id.startsWith(`ex-${n}-`));
