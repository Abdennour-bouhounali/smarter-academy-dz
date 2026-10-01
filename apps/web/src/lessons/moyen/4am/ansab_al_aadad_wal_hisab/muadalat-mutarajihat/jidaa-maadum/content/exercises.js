/**
 * Les exercices du MANUEL rattachés au درس 2 « معادلات جداء معدوم » (couverture :
 * extraction.json → destinations). Chaque énoncé est celui du livre, au mot près ;
 * un exercice à plusieurs équations ou plusieurs questions est découpé en une
 * entrée par question (la première porte l'énoncé).
 *
 * Un ensemble de solutions est un CHOIX : chaque distracteur est FAUX (il oublie une
 * solution, ajoute un nombre qui n'annule aucun facteur, prend l'opposé ou l'inverse)
 * et vient d'une erreur réelle — la solution unique d'une équation qui en a deux, le
 * signe du nombre dans la parenthèse, le facteur constant pris pour une solution, la
 * division par x qui fait perdre 0, la division b/a inversée. Les formes factorisées
 * proposées sont, sauf la bonne, des polynômes DIFFÉRENTS de l'expression.
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_jidaa-maadum_P1',
  P2: '4am_jidaa-maadum_P2',
  P3: '4am_jidaa-maadum_P3',
};

const E = (n, page, part) => ({ ...src(`ex-${n}`, page, 'أوظّف تعلّماتي', n), ...(part ? { part } : {}) });
const C = (prompt, options, correct, explain, cols = 2) => ({ prompt, options, correct, cols, explain });

/* ── Module 3 — دوري الآن 2 (p. 47) ─────────────────────────────────────── */
const NOW = (part) => ({ ...src('now-47-2', 47, 'دوري الآن', 2), part });
export const NOW_47_2 = [
  {
    id: 'now-47-2-a', source: NOW('1'), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'حل كلا من المعادلات الآتية: $4x(-x + 1) = 0$ ، $(2x + 1)^2 = 0$ ، $4x^2 - 1 = 0$ ، $9x^2 = 4x$ .',
    interaction: 'choice',
    question: C('حلول المعادلة $4x(-x + 1) = 0$ :', ['$0$ و $1$', '$1$ فقط', '$4$ و $1$', '$0$ و $-1$'], 0,
      '$4x = 0$ أو $-x + 1 = 0$ ، أي $x = 0$ أو $x = 1$ : العامل $4x$ ينعدم من أجل $x = 0$ .'),
    method: 'نكتب: أحد العاملين معدوم، ثم نحلّ كل معادلة من الدرجة الأولى.',
    commonError: 'نسيان أنّ العامل $4x$ نفسه ينعدم: $4x = 0$ يعني $x = 0$ .',
  },
  {
    id: 'now-47-2-b', source: NOW('2'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('حلول المعادلة $(2x + 1)^2 = 0$ :', ['$-\\dfrac{1}{2}$ و $\\dfrac{1}{2}$', '$-\\dfrac{1}{2}$ فقط', '$-2$ فقط', 'لا تقبل أي حل'], 1,
      '$(2x + 1)^2 = (2x + 1)(2x + 1)$ : العاملان متساويان، و $2x + 1 = 0$ يعني $x = -\\dfrac{1}{2}$ — حلّ واحد.'),
    commonError: 'كتابة حلّين متعاكسين كما في $x^2 = a$ : هنا العاملان متساويان فلهما الصفر نفسه.',
  },
  {
    id: 'now-47-2-c', source: NOW('3'), learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'choice',
    question: C('حلول المعادلة $4x^2 - 1 = 0$ :', ['$\\dfrac{1}{2}$ فقط', '$-2$ و $2$', '$-\\dfrac{1}{2}$ و $\\dfrac{1}{2}$', '$\\dfrac{1}{4}$ فقط'], 2,
      '$4x^2 - 1 = (2x)^2 - 1^2 = (2x - 1)(2x + 1)$ ، و $(2x - 1)(2x + 1) = 0$ يعني $x = \\dfrac{1}{2}$ أو $x = -\\dfrac{1}{2}$ .'),
    method: 'نحلّل أولًا بالمتطابقة $a^2 - b^2 = (a - b)(a + b)$ ، ثم نطبّق خاصية الجداء المعدوم.',
    commonError: 'قلب حاصل القسمة: $2x = 1$ يعطي $x = \\dfrac{1}{2}$ لا $x = 2$ .',
  },
  {
    id: 'now-47-2-d', source: NOW('4'), learningPointId: LP.P3, difficulty: 'difficile',
    interaction: 'choice',
    question: C('حلول المعادلة $9x^2 = 4x$ :', ['$\\dfrac{4}{9}$ فقط', '$0$ و $\\dfrac{4}{9}$', '$0$ و $\\dfrac{9}{4}$', '$0$ و $-\\dfrac{4}{9}$'], 1,
      '$9x^2 = 4x$ يعني $9x^2 - 4x = 0$ أي $x(9x - 4) = 0$ ، إذن $x = 0$ أو $x = \\dfrac{4}{9}$ .'),
    method: 'ننقل كل الحدود إلى طرف واحد ليصير الطرف الآخر 0، ثم نستخرج العامل المشترك $x$ .',
    commonError: 'قسمة الطرفين على $x$ : نجد $9x = 4$ ونُضيّع الحل 0.',
  },
];

/* ── Module 4 — أوظّف تعلّماتي (pp. 50–51) ──────────────────────────────── */
const S14 = 'حل كل معادلة من المعادلات الآتية:';
const S18 = 'لتكن العبارة $p$ حيث $p = (9x^2 - 1) + 6x^2 + 7x - 3$ . 1) تحقّق أنّ: $(3x - 1)(2x + 3) = 6x^2 + 7x - 3$ 2) حلّل العبارة $9x^2 - 1$ . 3) حلّل العبارة $p$ إلى جداء عاملين من الدرجة الأولى 4) حل المعادلة $p = 0$ .';
const S19 = '$p$ عبارة حيث: $p = (x^2 + 10x + 25) - (x^2 - 25)$ . 1) حلّل كل عبارة من العبارتين: $A = x^2 + 10x + 25$ و $B = x^2 - 25$ 2) حلّل العبارة $p$ إلى جداء عاملين من الدرجة الأولى. حل المعادلة $p = 0$ .';
const S20 = '1) تحقّق أنّ $(2x - 1)^2 - 81 = 4x^2 - 4x - 80$ . 2) استنتج تحليلا للعبارة $A = 4x^2 - 4x - 80$ . 3) حل المعادلة $4x^2 - 4x - 80 = 0$ .';

export const EXERCISES = [
  {
    id: 'ex-14-1', source: E(14, 50, '1'), learningPointId: LP.P2, difficulty: 'facile', statement: S14,
    items: ['$7(x + 2) = 0$', '$(x + 5)(2 - x) = 0$', '$\\dfrac{2}{3}x(x - 4) = 0$', '$(5 - 3x)(2x - 4) = 0$'],
    interaction: 'choice',
    question: C('$7(x + 2) = 0$', ['$2$', '$-2$', '$-2$ و $7$', '$-7$ و $-2$'], 1,
      'بما أنّ $7 \\neq 0$ فإنّ $x + 2 = 0$ ، أي $x = -2$ : حلّ واحد.'),
    method: 'العامل الثابت 7 لا ينعدم: يكفي أن نحلّ $x + 2 = 0$ (طريقة أمين).',
    commonError: 'اعتبار العامل الثابت 7 حلًّا، أو أخذ إشارة العدد الذي في القوس: $x = 2$ .',
  },
  {
    id: 'ex-14-2', source: E(14, 50, '2'), learningPointId: LP.P2, difficulty: 'facile',
    interaction: 'choice',
    question: C('$(x + 5)(2 - x) = 0$', ['$5$ و $-2$', '$-5$ فقط', '$-5$ و $2$', '$-5$ و $-2$'], 2,
      '$x + 5 = 0$ أو $2 - x = 0$ ، أي $x = -5$ أو $x = 2$ .'),
    commonError: 'الاكتفاء بحلّ واحد، أو كتابة $x = -2$ من $2 - x = 0$ .',
  },
  {
    id: 'ex-14-3', source: E(14, 50, '3'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('$\\dfrac{2}{3}x(x - 4) = 0$', ['$4$ فقط', '$\\dfrac{2}{3}$ و $4$', '$0$ و $-4$', '$0$ و $4$'], 3,
      '$\\dfrac{2}{3}x = 0$ أو $x - 4 = 0$ ، أي $x = 0$ أو $x = 4$ .'),
    commonError: 'نسيان الحل 0 الذي يعدم العامل $\\dfrac{2}{3}x$ .',
  },
  {
    id: 'ex-14-4', source: E(14, 50, '4'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('$(5 - 3x)(2x - 4) = 0$', ['$\\dfrac{5}{3}$ و $2$', '$\\dfrac{3}{5}$ و $\\dfrac{1}{2}$', '$-\\dfrac{5}{3}$ و $-2$', '$5$ و $4$'], 0,
      '$5 - 3x = 0$ يعني $-3x = -5$ أي $x = \\dfrac{5}{3}$ ؛ و $2x - 4 = 0$ يعني $x = 2$ .'),
    commonError: 'قلب حاصل القسمة: $-3x = -5$ يعطي $\\dfrac{-5}{-3} = \\dfrac{5}{3}$ لا $\\dfrac{3}{5}$ .',
  },
  {
    id: 'ex-15-1', source: E(15, 50, '1)'), learningPointId: LP.P3, difficulty: 'facile',
    statement: '1) حلّل إلى جداء عاملين العبارة $6x^2 - 3x$ . 2) حل المعادلة $6x^2 - 3x = 0$ .',
    interaction: 'choice',
    question: C('1) $6x^2 - 3x = $', ['$3x(2x - 1)$', '$3x(2x - 3)$', '$6x(x - 3)$', '$3x(x - 1)$'], 0,
      '$6x^2 - 3x = 3x \\times 2x - 3x \\times 1 = 3x(2x - 1)$'),
    method: 'العامل المشترك بين $6x^2$ و $3x$ هو $3x$ .',
    commonError: 'نسيان الحدّ 1 بعد استخراج $3x$ من $3x$ .',
  },
  {
    id: 'ex-15-2', source: E(15, 50, '2)'), learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'choice',
    question: C('2) حلول المعادلة $6x^2 - 3x = 0$ :', ['$\\dfrac{1}{2}$ فقط', '$0$ و $\\dfrac{1}{2}$', '$0$ و $2$', '$-\\dfrac{1}{2}$ و $0$'], 1,
      '$3x(2x - 1) = 0$ يعني $3x = 0$ أو $2x - 1 = 0$ ، أي $x = 0$ أو $x = \\dfrac{1}{2}$ .'),
    commonError: 'قسمة الطرفين على $x$ فيضيع الحل 0.',
  },
  {
    id: 'ex-16-1', source: E(16, 50, '1)'), learningPointId: LP.P3, difficulty: 'moyen',
    statement: '1) حلّل إلى جداء عاملين العبارة : $5(x + 3) + (x - 1)(x + 3)$ . 2) حل المعادلة $5(x + 3) + (x - 1)(x + 3) = 0$ .',
    interaction: 'choice',
    question: C('1) $5(x + 3) + (x - 1)(x + 3) = $', ['$(x + 3)(x + 6)$', '$(x + 3)(5x - 5)$', '$(x + 3)(x + 4)$', '$(x + 3)(x - 4)$'], 2,
      'العامل المشترك $(x + 3)$ : $(x + 3)[5 + (x - 1)] = (x + 3)(x + 4)$'),
    method: 'العامل المشترك هو القوس $(x + 3)$ كلّه؛ نجمع ما بقي: $5 + (x - 1)$ .',
    commonError: 'ضرب ما بقي بدل جمعه: $(x + 3) \\times 5(x - 1)$ .',
  },
  {
    id: 'ex-16-2', source: E(16, 50, '2)'), learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'choice',
    question: C('2) حلول المعادلة:', ['$3$ و $4$', '$-4$ و $-3$', '$-3$ فقط', '$-3$ و $4$'], 1,
      '$(x + 3)(x + 4) = 0$ يعني $x + 3 = 0$ أو $x + 4 = 0$ ، أي $x = -3$ أو $x = -4$ .'),
    commonError: 'أخذ إشارة العدد الذي في القوس: $x + 4 = 0$ يعني $x = -4$ لا $4$ .',
  },
  {
    id: 'ex-17-1', source: E(17, 50, '1)'), learningPointId: LP.P3, difficulty: 'facile',
    statement: '1) حلّل إلى جداء عاملين العبارة $x^2 - 25$ . 2) حل المعادلة $x^2 - 25 = 0$ .',
    interaction: 'choice',
    question: C('1) $x^2 - 25 = $', ['$(x - 5)^2$', '$(x - 5)(x + 5)$', '$(x - 25)(x + 25)$'], 1,
      '$x^2 - 25 = x^2 - 5^2 = (x - 5)(x + 5)$', 3),
    method: 'نتعرّف على الشكل $a^2 - b^2$ حيث $a = x$ و $b = 5$ .',
    commonError: 'كتابة $(x - 5)^2$ التي تساوي $x^2 - 10x + 25$ .',
  },
  {
    id: 'ex-17-2', source: E(17, 50, '2)'), learningPointId: LP.P3, difficulty: 'facile',
    interaction: 'choice',
    question: C('2) حلول المعادلة $x^2 - 25 = 0$ :', ['$5$ فقط', '$-25$ و $25$', '$-5$ و $5$'], 2,
      '$(x - 5)(x + 5) = 0$ يعني $x = 5$ أو $x = -5$ .', 3),
    commonError: 'الاكتفاء بالحل 5 ونسيان أنّ العامل $x + 5$ ينعدم أيضًا.',
  },
  {
    id: 'ex-18-1', source: E(18, 50, '1)'), learningPointId: LP.P3, difficulty: 'facile', statement: S18,
    interaction: 'trueFalse',
    question: {
      rows: [{ text: '$(3x - 1)(2x + 3) = 6x^2 + 7x - 3$', answer: true, why: '$(3x - 1)(2x + 3) = 6x^2 + 9x - 2x - 3 = 6x^2 + 7x - 3$' }],
    },
    method: 'ننشر الطرف الأول ونبسّط ثم نقارن.',
  },
  {
    id: 'ex-18-2', source: E(18, 50, '2)'), learningPointId: LP.P3, difficulty: 'facile',
    interaction: 'choice',
    question: C('2) $9x^2 - 1 = $', ['$(3x - 1)(3x + 1)$', '$(3x - 1)^2$', '$(9x - 1)(9x + 1)$'], 0,
      '$9x^2 - 1 = (3x)^2 - 1^2 = (3x - 1)(3x + 1)$', 3),
    commonError: 'أخذ $a = 9x$ بدل $a = 3x$ (لأنّ $(3x)^2 = 9x^2$).',
  },
  {
    id: 'ex-18-3', source: E(18, 50, '3)'), learningPointId: LP.P3, difficulty: 'difficile',
    interaction: 'choice',
    question: C('3) $p = $', ['$(3x - 1)(x - 2)$', '$(3x + 1)(5x + 4)$', '$(3x - 1)(5x + 4)$'], 2,
      '$p = (3x - 1)(3x + 1) + (3x - 1)(2x + 3) = (3x - 1)[(3x + 1) + (2x + 3)] = (3x - 1)(5x + 4)$', 1),
    method: 'نعوّض كل جزء بتحليله ليظهر العامل المشترك $(3x - 1)$ .',
    commonError: 'طرح ما بقي بدل جمعه: $(3x + 1) - (2x + 3) = x - 2$ .',
  },
  {
    id: 'ex-18-4', source: E(18, 50, '4)'), learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'choice',
    question: C('4) حلول المعادلة $p = 0$ :', ['$-\\dfrac{4}{5}$ و $\\dfrac{1}{3}$', '$\\dfrac{4}{5}$ و $-\\dfrac{1}{3}$', '$\\dfrac{1}{3}$ فقط', '$-\\dfrac{5}{4}$ و $3$'], 0,
      '$(3x - 1)(5x + 4) = 0$ يعني $x = \\dfrac{1}{3}$ أو $x = -\\dfrac{4}{5}$ .'),
    commonError: 'قلب حاصل القسمة: $5x = -4$ يعطي $-\\dfrac{4}{5}$ لا $-\\dfrac{5}{4}$ .',
  },
  {
    id: 'ex-19-1', source: E(19, 51, '1)'), learningPointId: LP.P3, difficulty: 'facile', statement: S19,
    interaction: 'batch',
    question: {
      prompt: '1) تحليل كل من A و B :',
      rows: [
        { label: '$A = x^2 + 10x + 25$', options: ['$(x + 5)^2$', '$(x - 5)(x + 5)$', '$(x + 25)^2$'], correct: 0, correction: '$x^2 + 2 \\times x \\times 5 + 5^2 = (x + 5)^2$' },
        { label: '$B = x^2 - 25$', options: ['$(x - 5)^2$', '$(x - 5)(x + 5)$', '$(x + 5)^2$'], correct: 1, correction: '$x^2 - 5^2 = (x - 5)(x + 5)$' },
      ],
    },
    method: 'نتعرّف على المتطابقة: مربع مجموع لـ A، وفرق مربّعين لـ B.',
  },
  {
    id: 'ex-19-2', source: E(19, 51, '2)'), learningPointId: LP.P3, difficulty: 'difficile',
    interaction: 'choice',
    question: C('2) $p = $', ['$2x(x + 5)$', '$10(x + 5)$', '$-10(x + 5)$', '$(x + 5)(2x + 10)$'], 1,
      '$p = (x + 5)^2 - (x - 5)(x + 5) = (x + 5)[(x + 5) - (x - 5)] = 10(x + 5)$'),
    method: 'العامل المشترك $(x + 5)$ ، وما بقي $(x + 5) - (x - 5) = 10$ .',
    commonError: 'حذف القوس المسبوق بـ «−» دون تغيير إشارة $-5$ : نجد $2x$ بدل 10.',
  },
  {
    id: 'ex-19-3', source: E(19, 51, '3)'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'choice',
    question: C('حلول المعادلة $p = 0$ :', ['$-5$ و $5$', '$-5$', '$-5$ و $10$', '$5$'], 1,
      '$10(x + 5) = 0$ وبما أنّ $10 \\neq 0$ فإنّ $x + 5 = 0$ ، أي $x = -5$ : حلّ واحد.'),
    commonError: 'اعتبار العامل الثابت 10 حلًّا، أو البحث عن حلّين لأنّ العبارة الأصلية فيها $x^2$ .',
  },
  {
    id: 'ex-20-1', source: E(20, 51, '1)'), learningPointId: LP.P3, difficulty: 'facile', statement: S20,
    interaction: 'trueFalse',
    question: {
      rows: [{ text: '$(2x - 1)^2 - 81 = 4x^2 - 4x - 80$', answer: true, why: '$(2x - 1)^2 - 81 = 4x^2 - 4x + 1 - 81 = 4x^2 - 4x - 80$' }],
    },
    method: 'ننشر المربّع بالمتطابقة $(a - b)^2 = a^2 - 2ab + b^2$ ثم نبسّط.',
  },
  {
    id: 'ex-20-2', source: E(20, 51, '2)'), learningPointId: LP.P3, difficulty: 'difficile',
    interaction: 'choice',
    question: C('2) $A = 4x^2 - 4x - 80 = $', ['$(2x - 9)(2x + 9)$', '$(2x - 10)(2x + 8)$', '$(2x - 10)^2$', '$(2x - 82)(2x + 80)$'], 1,
      '$A = (2x - 1)^2 - 9^2 = (2x - 1 - 9)(2x - 1 + 9) = (2x - 10)(2x + 8)$'),
    method: 'نقرأ $(2x - 1)^2 - 81$ على الشكل $a^2 - b^2$ حيث $a = 2x - 1$ و $b = 9$ .',
    commonError: 'أخذ $b = 81$ بدل $b = 9$ .',
  },
  {
    id: 'ex-20-3', source: E(20, 51, '3)'), learningPointId: LP.P3, difficulty: 'moyen',
    interaction: 'choice',
    question: C('3) حلول المعادلة $4x^2 - 4x - 80 = 0$ :', ['$4$ و $-5$', '$5$ فقط', '$-4$ و $5$', '$10$ و $-8$'], 2,
      '$(2x - 10)(2x + 8) = 0$ يعني $2x = 10$ أو $2x = -8$ ، أي $x = 5$ أو $x = -4$ .'),
    commonError: 'أخذ العددين 10 و −8 الموجودين في القوسين حلّين دون القسمة على 2.',
  },
];

/** Toutes les parties d'un exercice du manuel (« 14 » → ex-14-1 … ex-14-4). */
export const partsOf = (n) => EXERCISES.filter((ex) => ex.id === `ex-${n}` || ex.id.startsWith(`ex-${n}-`));

/** Accès par id. */
export const EX = Object.fromEntries([...NOW_47_2, ...EXERCISES].map((ex) => [ex.id, ex]));
