/**
 * Les exercices du MANUEL rattachés à la synthèse (extraction › destinations :
 * ex-34, ex-35, ex-36, ex-41, ex-42 p. 53 — module 3 « أتعمّق »). Chaque énoncé
 * est celui du livre, au mot près ; un exercice à plusieurs questions est
 * découpé en une entrée par question (la première porte l'énoncé). L'exercice
 * 41 est un exercice d'examen : le manuel l'annonce « من امتحان شهادة التعليم
 * المتوسط », et la leçon le dit aussi.
 *
 * Une FORME (développée, factorisée, ensemble de solutions) est demandée en
 * choix, dont les distracteurs sont FAUX et viennent d'erreurs réelles (le
 * « − » qui ne porte que sur le premier terme, 2ab oublié, le sens gardé après
 * une division par un négatif, le quotient renversé) ; une VALEUR est tapée
 * (`numeric`, lue par parseDec). Les représentations graphiques (ex. 35 et 42)
 * sont posées dans le module, avec les dessins (components/MuadalatFigures.jsx).
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_wadiya-idmajiya-muadalat_P1',
  P2: '4am_wadiya-idmajiya-muadalat_P2',
};

const E = (n, part) => ({ ...src(`ex-${n}`, 53, 'أتعمّق', n), ...(part ? { part } : {}) });
const C = (prompt, options, correct, explain, cols = 2) => ({ prompt, options, correct, cols, explain });
const N = (prompt, expected, explain, display) => ({ prompt, expected, explain, ...(display ? { display } : {}) });

export const EXERCISES = [
  /* ── تمرين 34 — E = (5x − 1)² − (2x + 3)(5x − 1) ── */
  {
    id: 'ex-34-1', source: E(34, '1)'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'لتكن العبارة E حيث $E = (5x - 1)^2 - (2x + 3)(5x - 1)$ 1) انشر وبسّط العبارة E. 2) حلّل العبارة E إلى جداء عاملين. 3) احسب قيمة E من أجل كل من: $x = \\dfrac{1}{5}$ و $x = -1$ . 4) حل المعادلة $E = 0$ .',
    interaction: 'choice',
    question: C('1) النشر المبسّط للعبارة E هو:', ['$15x^2 - 23x + 4$', '$15x^2 + 3x - 2$', '$15x^2 - 13x + 4$', '$15x^2 - 23x - 2$'], 0,
      '$(5x - 1)^2 = 25x^2 - 10x + 1$ و $(2x + 3)(5x - 1) = 10x^2 + 13x - 3$ ، فـ $E = 25x^2 - 10x + 1 - 10x^2 - 13x + 3 = 15x^2 - 23x + 4$.'),
    method: 'ننشر كل جزء، ثم نحذف القوسين المسبوقين بـ «−» بتغيير إشارة كل حدّ داخلهما، ونجمع الحدود المتشابهة.',
    commonError: 'تغيير إشارة الحد الأول فقط بعد «−»: $-10x^2 + 13x - 3$ بدل $-10x^2 - 13x + 3$.',
  },
  {
    id: 'ex-34-2', source: E(34, '2)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('2) تحليل العبارة E إلى جداء عاملين:', ['$(5x - 1)(3x - 4)$', '$(5x - 1)(7x + 2)$', '$(5x - 1)(3x + 2)$', '$(5x - 1)(3x + 4)$'], 0,
      'العامل المشترك $5x - 1$ : $E = (5x - 1)[(5x - 1) - (2x + 3)] = (5x - 1)(5x - 1 - 2x - 3) = (5x - 1)(3x - 4)$.'),
    commonError: 'كتابة $(5x - 1) - (2x + 3) = 3x + 2$ : الإشارة «−» تشمل العدد 3 أيضًا.',
  },
  {
    id: 'ex-34-3a', source: E(34, '3)'), learningPointId: LP.P1, difficulty: 'facile',
    interaction: 'numeric',
    question: N('3) قيمة E من أجل $x = \\dfrac{1}{5}$ :', 0, 'الشكل المحلّل: $5 \\times \\dfrac{1}{5} - 1 = 0$ ، فالجداء $E = 0 \\times \\left(3 \\times \\dfrac{1}{5} - 4\\right) = 0$.'),
  },
  {
    id: 'ex-34-3b', source: E(34, '3)'), learningPointId: LP.P1, difficulty: 'facile',
    interaction: 'numeric',
    question: N('3) قيمة E من أجل $x = -1$ :', 42, '$E = (5 \\times (-1) - 1)(3 \\times (-1) - 4) = (-6) \\times (-7) = 42$ ؛ وبالشكل المنشور: $15 + 23 + 4 = 42$.'),
  },
  {
    id: 'ex-34-4', source: E(34, '4)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('4) حلول المعادلة $E = 0$ :', ['$x = \\dfrac{1}{5}$ أو $x = \\dfrac{4}{3}$', '$x = \\dfrac{1}{5}$ فقط', '$x = -\\dfrac{1}{5}$ أو $x = -\\dfrac{4}{3}$', '$x = \\dfrac{1}{5}$ أو $x = \\dfrac{3}{4}$'], 0,
      '$(5x - 1)(3x - 4) = 0$ يعني $5x - 1 = 0$ أو $3x - 4 = 0$ ، أي $x = \\dfrac{1}{5}$ أو $x = \\dfrac{4}{3}$.', 1),
    commonError: 'الاكتفاء بالقيمة التي حسبنا E من أجلها في السؤال 3: لكل عامل حلّه.',
  },

  /* ── تمرين 35 ── */
  {
    id: 'ex-35-1', source: E(35, '1)'), learningPointId: LP.P1, difficulty: 'facile',
    statement: '1) تحقّق من صحة المساواة $6(3x + 4)(3x - 4) = 54x^2 - 96$ 2) حلّل العبارة A بحيث $A = (3x + 4)(x - 7) - (54x^2 - 96)$ 3) حل المعادلة $A = 0$ . 4) حل المتراجحة $54x^2 - 96 \\leq 18x(3x + 1) - 90$ . مثّل بيانيا حلولها على مستقيم مدرّج.',
    interaction: 'choice',
    question: C('1) المساواة $6(3x + 4)(3x - 4) = 54x^2 - 96$ :', ['صحيحة، لأنّ $6(9x^2 - 16) = 54x^2 - 96$', 'خاطئة، لأنّ $6(3x + 4)(3x - 4) = 54x^2 - 16$', 'خاطئة، لأنّ $6(3x + 4)(3x - 4) = 18x^2 - 96$'], 0,
      'جداء مجموع وفرق: $(3x + 4)(3x - 4) = 9x^2 - 16$ ، ثم $6 \\times 9x^2 - 6 \\times 16 = 54x^2 - 96$.', 1),
  },
  {
    id: 'ex-35-2', source: E(35, '2)'), learningPointId: LP.P1, difficulty: 'difficile',
    interaction: 'choice',
    question: C('2) تحليل العبارة A :', ['$(3x + 4)(-17x + 17)$', '$(3x + 4)(-17x - 31)$', '$(3x + 4)(-2x - 3)$', '$(3x + 4)(19x - 31)$'], 0,
      'حسب السؤال 1: $A = (3x + 4)(x - 7) - 6(3x + 4)(3x - 4) = (3x + 4)[(x - 7) - 6(3x - 4)] = (3x + 4)(x - 7 - 18x + 24) = (3x + 4)(-17x + 17)$.'),
    method: 'نعوّض $54x^2 - 96$ بشكله المحلّل (السؤال 1) ليظهر العامل المشترك $3x + 4$.',
    commonError: 'نسيان العامل 6: $(x - 7) - (3x - 4)$ ، أو كتابة $-6 \\times (-4) = -24$.',
  },
  {
    id: 'ex-35-3', source: E(35, '3)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('3) حلول المعادلة $A = 0$ :', ['$x = -\\dfrac{4}{3}$ أو $x = 1$', '$x = \\dfrac{4}{3}$ أو $x = -1$', '$x = -\\dfrac{4}{3}$ فقط', '$x = -\\dfrac{4}{3}$ أو $x = 17$'], 0,
      '$3x + 4 = 0$ أو $-17x + 17 = 0$ ، أي $x = -\\dfrac{4}{3}$ أو $x = 1$.', 1),
  },
  {
    id: 'ex-35-4', source: E(35, '4)'), learningPointId: LP.P1, difficulty: 'difficile',
    interaction: 'choice',
    question: C('4) حلول المتراجحة $54x^2 - 96 \\leq 18x(3x + 1) - 90$ هي الأعداد $x$ حيث:', ['$x \\geq -\\dfrac{1}{3}$', '$x \\leq -\\dfrac{1}{3}$', '$x \\geq -3$', '$x \\geq \\dfrac{1}{3}$'], 0,
      'ننشر: $54x^2 - 96 \\leq 54x^2 + 18x - 90$ ، يختفي $54x^2$ من الطرفين: $-6 \\leq 18x$ ، والقسمة على 18 (موجب) تحافظ على الاتجاه: $x \\geq -\\dfrac{1}{3}$.'),
    method: 'ننشر الطرف الأيمن: الحدّان $54x^2$ يختفيان، فتبقى متراجحة من الدرجة الأولى.',
    commonError: 'تغيير اتجاه المتراجحة عند القسمة على 18، وهو عدد موجب.',
  },

  /* ── تمرين 36 ── */
  {
    id: 'ex-36-1a', source: E(36, '1)'), learningPointId: LP.P1, difficulty: 'facile',
    statement: '1) انشر كلا من العبارتين وبسطها: $A = (x + 4)^2 - x(x - 2)$ ، $B = (3x - 1)(3x + 1) - (3x - 2)^2$ 2) حل المتراجحة $A \\geq B$ ذات المجهول $x$ .',
    interaction: 'choice',
    question: C('1) $A = $', ['$10x + 16$', '$6x + 16$', '$2x + 16$', '$2x^2 + 6x + 16$'], 0,
      '$(x + 4)^2 = x^2 + 8x + 16$ و $x(x - 2) = x^2 - 2x$ ، فـ $A = x^2 + 8x + 16 - x^2 + 2x = 10x + 16$.'),
    commonError: 'كتابة $(x + 4)^2 = x^2 + 16$ (نسيان الحد المضاعف $8x$).',
  },
  {
    id: 'ex-36-1b', source: E(36, '1)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('1) $B = $', ['$12x - 5$', '$12x + 3$', '$-12x - 5$', '$6x - 5$'], 0,
      '$(3x - 1)(3x + 1) = 9x^2 - 1$ و $(3x - 2)^2 = 9x^2 - 12x + 4$ ، فـ $B = 9x^2 - 1 - 9x^2 + 12x - 4 = 12x - 5$.'),
    commonError: 'حذف القوسين المسبوقين بـ «−» دون تغيير إشارة $-12x$ أو $+4$.',
  },
  {
    id: 'ex-36-2', source: E(36, '2)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('2) حلول المتراجحة $A \\geq B$ هي الأعداد $x$ حيث:', ['$x \\leq \\dfrac{21}{2}$', '$x \\geq \\dfrac{21}{2}$', '$x \\leq \\dfrac{2}{21}$', '$x \\leq \\dfrac{11}{2}$'], 0,
      '$10x + 16 \\geq 12x - 5$ يعني $-2x \\geq -21$ ، والقسمة على $-2$ (سالب) تغيّر الاتجاه: $x \\leq \\dfrac{21}{2}$.'),
    commonError: 'الحفاظ على الاتجاه بعد القسمة على $-2$.',
  },

  /* ── تمرين 41 — من امتحان شهادة التعليم المتوسط ── */
  {
    id: 'ex-41-1', source: E(41, '1)'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: 'من امتحان شهادة التعليم المتوسط لتكن العبارة E حيث : $E = (4x - 1)^2 - (3x + 2)(4x - 1)$ 1) انشر وبسط العبارة E. 2) حلل العبارة E الى جداء عاملين. 3) حل المعادلة: $(4x - 1)(x - 3) = 0$ حل المتراجحة: $4x^2 - 13x + 3 \\leq 4x^2 + 29$',
    interaction: 'choice',
    question: C('1) النشر المبسّط للعبارة E :', ['$4x^2 - 13x + 3$', '$4x^2 - 3x - 1$', '$28x^2 - 3x - 1$', '$4x^2 - 13x - 1$'], 0,
      '$(4x - 1)^2 = 16x^2 - 8x + 1$ و $(3x + 2)(4x - 1) = 12x^2 + 5x - 2$ ، فـ $E = 16x^2 - 8x + 1 - 12x^2 - 5x + 2 = 4x^2 - 13x + 3$.'),
    commonError: 'تغيير إشارة الحد الأول فقط بعد «−».',
  },
  {
    id: 'ex-41-2', source: E(41, '2)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('2) تحليل العبارة E :', ['$(4x - 1)(x - 3)$', '$(4x - 1)(7x + 1)$', '$(4x - 1)(x + 1)$', '$(4x + 1)(x - 3)$'], 0,
      '$E = (4x - 1)[(4x - 1) - (3x + 2)] = (4x - 1)(4x - 1 - 3x - 2) = (4x - 1)(x - 3)$.'),
  },
  {
    id: 'ex-41-3', source: E(41, '3)'), learningPointId: LP.P1, difficulty: 'facile',
    interaction: 'choice',
    question: C('3) حلول المعادلة $(4x - 1)(x - 3) = 0$ :', ['$x = \\dfrac{1}{4}$ أو $x = 3$', '$x = -\\dfrac{1}{4}$ أو $x = -3$', '$x = 4$ أو $x = 3$', '$x = \\dfrac{1}{4}$ فقط'], 0,
      '$4x - 1 = 0$ أو $x - 3 = 0$ ، أي $x = \\dfrac{1}{4}$ أو $x = 3$.', 1),
    commonError: 'من $4x = 1$ كتابة $x = 4$ : نقسم 1 على 4.',
  },
  {
    id: 'ex-41-4', source: E(41, '3)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('حلول المتراجحة $4x^2 - 13x + 3 \\leq 4x^2 + 29$ هي الأعداد $x$ حيث:', ['$x \\geq -2$', '$x \\leq -2$', '$x \\geq 2$', '$x \\geq -\\dfrac{1}{2}$'], 0,
      'يختفي $4x^2$ من الطرفين: $-13x + 3 \\leq 29$ ، أي $-13x \\leq 26$ ، والقسمة على $-13$ تغيّر الاتجاه: $x \\geq -2$.'),
    method: 'الطرف الأيسر هو النشر المبسّط للعبارة E (السؤال 1): نطرح $4x^2$ من الطرفين.',
  },

  /* ── تمرين 42 ── */
  {
    id: 'ex-42-1a', source: E(42, '1)'), learningPointId: LP.P1, difficulty: 'moyen',
    statement: '1) عيّن قيم $x$ التي من أجلها تتحقق المتراجحتان الآتيتان معًا: $-3x + 1 > 7x + 11$ و $\\dfrac{1}{2}x - 3 \\leq x - 1$ 2) مثّل بيانيا هذه الحلول.',
    interaction: 'choice',
    question: C('حلول المتراجحة $-3x + 1 > 7x + 11$ :', ['$x < -1$', '$x > -1$', '$x < 1$', '$x > 1$'], 0,
      '$-3x - 7x > 11 - 1$ أي $-10x > 10$ ، والقسمة على $-10$ تغيّر الاتجاه: $x < -1$.'),
  },
  {
    id: 'ex-42-1b', source: E(42, '1)'), learningPointId: LP.P1, difficulty: 'moyen',
    interaction: 'choice',
    question: C('حلول المتراجحة $\\dfrac{1}{2}x - 3 \\leq x - 1$ :', ['$x \\geq -4$', '$x \\leq -4$', '$x \\geq 4$', '$x \\leq 4$'], 0,
      '$\\dfrac{1}{2}x - x \\leq -1 + 3$ أي $-\\dfrac{1}{2}x \\leq 2$ ، والضرب في $-2$ يغيّر الاتجاه: $x \\geq -4$.'),
  },
  {
    id: 'ex-42-1c', source: E(42, '1)'), learningPointId: LP.P1, difficulty: 'difficile',
    interaction: 'choice',
    question: C('قيم $x$ التي تحقّق المتراجحتين معًا:', ['$-4 \\leq x < -1$', '$-4 < x \\leq -1$', '$x < -4$', '$-1 < x \\leq 4$'], 0,
      'نريد $x < -1$ و $x \\geq -4$ في آن واحد: الأعداد المحصورة بين $-4$ (حل) و $-1$ (ليس حلًا).', 2),
    commonError: 'تبديل الحدّين: $-4$ حلّ للمتراجحة الثانية ($\\geq$)، و $-1$ ليس حلًا للأولى ($<$).',
  },
];

/** Les questions d'un exercice, dans l'ordre (« 34 » → ex-34-1, ex-34-2, …). */
export const partsOf = (n) => EXERCISES.filter((ex) => ex.id.startsWith(`ex-${n}-`));
