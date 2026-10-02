/**
 * Les exercices du MANUEL rattachés au درس 1 « مفهوم جملة معادلتين من الدرجة الأولى بمجهولين »
 * (couverture : extraction.json → destinations : ex-1 … ex-4, p. 60). Chaque énoncé est celui du
 * livre, au mot près ; un exercice à plusieurs parties est découpé en une entrée par partie (la
 * première porte l'énoncé).
 *
 * Une ثنائية demandée est une réponse `pair` (évaluateur `point`) ; « est-ce une solution ? » est
 * un choix ou une rangée صحيح / خطأ ; « اذكر حلين مختلفين » (تمرين 3، 1) est posé comme un choix
 * entre couples de ثنائيات (une seule rangée juste ; chaque distracteur contient une ثنائية qui ne
 * vérifie PAS l'équation — vérifié par le calcul). Tous les distracteurs sont faux.
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_mafhum-jumla_P1',
  P2: '4am_mafhum-jumla_P2',
  P3: '4am_mafhum-jumla_P3',
  P4: '4am_mafhum-jumla_P4',
};

const E = (n, part) => ({ ...src(`ex-${n}`, 60, 'أوظّف تعلّماتي', n), ...(part ? { part } : {}) });

export const EXERCISES = [
  // تمرين 1 — une équation, trois ثنائيات
  {
    id: 'ex-1', source: E(1), learningPointId: LP.P3, difficulty: 'facile',
    statement: 'نعتبر المعادلة من الدرجة الأولى بمجهولين الآتية: $x - 2y = 7$ . اذكر إن كانت كلّ من الثنائيات الآتية حلا لهذه المعادلة. علل. أ) $(0 ; 1)$ ب) $(7 ; 0)$ جـ) $(1 ; -3)$',
    interaction: 'batch',
    question: {
      prompt: 'هل الثنائية حل للمعادلة $x - 2y = 7$ ؟',
      rows: [
        { label: 'أ) $(0 ; 1)$', options: ['حل', 'ليست حلا'], correct: 1, correction: '$0 - 2 \\times 1 = -2 \\neq 7$' },
        { label: 'ب) $(7 ; 0)$', options: ['حل', 'ليست حلا'], correct: 0, correction: '$7 - 2 \\times 0 = 7$' },
        { label: 'جـ) $(1 ; -3)$', options: ['حل', 'ليست حلا'], correct: 0, correction: '$1 - 2 \\times (-3) = 1 + 6 = 7$' },
      ],
      explain: 'نعوّض $x$ بالعدد الأول و $y$ بالعدد الثاني من الثنائية، ثم نقارن النتيجة بـ 7.',
    },
    method: 'نعوّض $x$ بالعدد الأول من الثنائية و $y$ بالعدد الثاني، ثم نتحقّق من المساواة.',
    commonError: 'قلب الترتيب: في $(0 ; 1)$ لدينا $x = 0$ و $y = 1$ وليس العكس.',
  },
  // تمرين 2 — cinq équations, cinq ثنائيات
  {
    id: 'ex-2', source: E(2), learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'أرفق بكل معادلة الثنائية أو الثنائيات (في حالة وجودها) التي هي حلول لها فيما يأتي:',
    items: ['المعادلات: أ) $3x + 2y = -1$ ب) $3x + 5y = 1$ جـ) $x - 2y = 4$ د) $x - y = 2$ هـ) $5x + 3y = 1$', 'الثنائيات: $(0{,}5 ; -1{,}5)$ ، $(0 ; -2)$ ، $\\left(0 ; \\dfrac{1}{3}\\right)$ ، $(1 ; -2)$ ، $\\left(\\dfrac{1}{5} ; 0\\right)$'],
    interaction: 'batch',
    question: {
      prompt: 'لكل معادلة، اختر الثنائيات التي هي حلول لها:',
      rows: [
        { label: 'أ) $3x + 2y = -1$', options: ['$(1 ; -2)$ فقط', '$(0 ; -2)$ و $(1 ; -2)$', 'لا شيء من الثنائيات'], correct: 0, correction: '$3 \\times 1 + 2 \\times (-2) = -1$ ؛ أما $(0 ; -2)$ فتعطي $-4$.' },
        { label: 'ب) $3x + 5y = 1$', options: ['$\\left(\\dfrac{1}{5} ; 0\\right)$ فقط', 'لا شيء من الثنائيات', '$\\left(0 ; \\dfrac{1}{3}\\right)$ فقط'], correct: 1, correction: 'لا تحقّقها أي ثنائية: مثلا $\\left(\\dfrac{1}{5} ; 0\\right)$ تعطي $\\dfrac{3}{5}$ و $\\left(0 ; \\dfrac{1}{3}\\right)$ تعطي $\\dfrac{5}{3}$.' },
        { label: 'جـ) $x - 2y = 4$', options: ['$(0 ; -2)$ فقط', '$(0{,}5 ; -1{,}5)$ و $(0 ; -2)$', '$(1 ; -2)$ فقط'], correct: 0, correction: '$0 - 2 \\times (-2) = 4$ ؛ أما $(0{,}5 ; -1{,}5)$ فتعطي $3{,}5$ و $(1 ; -2)$ تعطي $5$.' },
        { label: 'د) $x - y = 2$', options: ['$(0 ; -2)$ فقط', '$(0{,}5 ; -1{,}5)$ و $(0 ; -2)$', '$(1 ; -2)$ و $(0 ; -2)$'], correct: 1, correction: '$0{,}5 - (-1{,}5) = 2$ و $0 - (-2) = 2$ ؛ أما $(1 ; -2)$ فتعطي $3$.' },
        { label: 'هـ) $5x + 3y = 1$', options: ['$\\left(0 ; \\dfrac{1}{3}\\right)$ و $\\left(\\dfrac{1}{5} ; 0\\right)$', '$\\left(\\dfrac{1}{5} ; 0\\right)$ فقط', '$(0 ; -2)$ و $\\left(0 ; \\dfrac{1}{3}\\right)$'], correct: 0, correction: '$3 \\times \\dfrac{1}{3} = 1$ و $5 \\times \\dfrac{1}{5} = 1$ ؛ أما $(0 ; -2)$ فتعطي $-6$.' },
      ],
      explain: 'قد تقبل المعادلة الواحدة أكثر من ثنائية، وقد لا تقبل أيًّا من الثنائيات المقترحة (المعادلة ب).',
    },
    method: 'نعوّض كل ثنائية في كل معادلة، ونحتفظ بالثنائيات التي تحقّق المساواة.',
    commonError: 'الظنّ أنّ لكل معادلة ثنائية واحدة: المعادلة د) تقبل ثنائيتين، والمعادلة ب) لا تقبل أيًّا منها.',
  },
  // تمرين 3، 1) — deux solutions différentes de chaque équation
  {
    id: 'ex-3-1', source: E(3, '1)'), learningPointId: LP.P3, difficulty: 'moyen',
    statement: '1) اذكر حلين مختلفين لكل معادلة من المعادلات الآتية: أ) $x - y = 0$ ب) $4x + 2y = 5$ جـ) $4x - 5y = -2$ . 2) عيّن ذهنيا الثنائية حل كلّ جملة: أ) $\\begin{cases} x = \\dfrac{1}{3} \\\\ 3x - y = 4 \\end{cases}$ ب) $\\begin{cases} y = x - 1 \\\\ y = 2x \\end{cases}$',
    interaction: 'batch',
    question: {
      prompt: '1) في كل سطر، أيّ ثنائيتين هما حلان مختلفان للمعادلة؟',
      rows: [
        { label: 'أ) $x - y = 0$', options: ['$(0 ; 0)$ و $(1 ; 1)$', '$(1 ; -1)$ و $(2 ; 2)$', '$(0 ; 0)$ و $(2 ; 1)$'], correct: 0, correction: '$0 - 0 = 0$ و $1 - 1 = 0$ ؛ أما $(1 ; -1)$ فتعطي $2$ و $(2 ; 1)$ تعطي $1$.' },
        { label: 'ب) $4x + 2y = 5$', options: ['$(0 ; 2{,}5)$ و $(1 ; 1)$', '$(0 ; 2{,}5)$ و $(1 ; 0{,}5)$', '$(1 ; 0{,}5)$ و $(2 ; 0)$'], correct: 1, correction: '$2 \\times 2{,}5 = 5$ و $4 + 2 \\times 0{,}5 = 5$ ؛ أما $(1 ; 1)$ فتعطي $6$ و $(2 ; 0)$ تعطي $8$.' },
        { label: 'جـ) $4x - 5y = -2$', options: ['$(1 ; 1)$ و $(-0{,}5 ; 0)$', '$(2 ; 2)$ و $(0 ; -0{,}4)$', '$(2 ; 2)$ و $(-0{,}5 ; 0)$'], correct: 2, correction: '$8 - 10 = -2$ و $4 \\times (-0{,}5) = -2$ ؛ أما $(1 ; 1)$ فتعطي $-1$ و $(0 ; -0{,}4)$ تعطي $2$.' },
      ],
      explain: 'لمعادلة واحدة بمجهولين حلول كثيرة: نختار قيمة لـ $x$ ونحسب $y$ (مثلا في ب: $x = 0$ يعطي $2y = 5$ أي $y = 2{,}5$).',
    },
    method: 'نختار قيمة لأحد المجهولين، ثم نحسب الآخر بحل معادلة من الدرجة الأولى بمجهول واحد.',
  },
  // تمرين 3، 2) أ — x est donné
  {
    id: 'ex-3-2a', source: E(3, '2) أ'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'pair',
    question: {
      prompt: '2) أ) $\\begin{cases} x = \\dfrac{1}{3} \\\\ 3x - y = 4 \\end{cases}$ ، الحل:',
      expected: { x: '1/3', y: '-3' },
      explain: '$x = \\dfrac{1}{3}$ ، ثم $3 \\times \\dfrac{1}{3} - y = 4$ أي $1 - y = 4$ ومنه $y = -3$. الحل $\\left(\\dfrac{1}{3} ; -3\\right)$.',
    },
    commonError: 'كتابة $x = \\dfrac{1}{3}$ وحده: حل الجملة ثنائية، ونحسب $y$ أيضًا.',
  },
  // تمرين 3، 2) ب — y = x − 1 et y = 2x
  {
    id: 'ex-3-2b', source: E(3, '2) ب'), learningPointId: LP.P2, difficulty: 'moyen',
    interaction: 'pair',
    question: {
      prompt: '2) ب) $\\begin{cases} y = x - 1 \\\\ y = 2x \\end{cases}$ ، الحل:',
      expected: { x: '-1', y: '-2' },
      explain: '$y$ يساوي $x - 1$ ويساوي $2x$ في آن واحد: $2x = x - 1$ أي $x = -1$ ، ثم $y = 2 \\times (-1) = -2$. وللتحقّق: $-1 - 1 = -2$.',
    },
    commonError: 'قلب الثنائية: الحل $(-1 ; -2)$ وليس $(-2 ; -1)$.',
  },
  // تمرين 4 — une ثنائية est-elle حل للجملة ?
  {
    id: 'ex-4-a', source: E(4, 'أ'), learningPointId: LP.P3, difficulty: 'facile',
    statement: 'أ) هل الثنائية $(3 ; -2)$ حل للجملة $\\begin{cases} 2x + y = 4 \\\\ x + y = 3 \\end{cases}$ ؟ ب) نفس السؤال من أجل الثنائية $(1 ; 2)$ .',
    interaction: 'choice',
    question: {
      prompt: 'أ) الثنائية $(3 ; -2)$:',
      options: ['حل للجملة', 'ليست حلا للجملة'],
      correct: 1,
      cols: 2,
      explain: '$2 \\times 3 + (-2) = 4$ : المعادلة الأولى محقّقة، لكن $3 + (-2) = 1 \\neq 3$ : الثانية غير محقّقة. إذن $(3 ; -2)$ ليست حلا للجملة.',
    },
    method: 'نعوّض في المعادلتين كلتيهما؛ الثنائية حل للجملة إذا تحقّقت المعادلتان في آن واحد.',
    commonError: 'الاكتفاء بالمعادلة الأولى: $(3 ; -2)$ تحقّق $2x + y = 4$ لكنها لا تحقّق $x + y = 3$.',
  },
  {
    id: 'ex-4-b', source: E(4, 'ب'), learningPointId: LP.P3, difficulty: 'facile',
    interaction: 'choice',
    question: {
      prompt: 'ب) الثنائية $(1 ; 2)$:',
      options: ['حل للجملة', 'ليست حلا للجملة'],
      correct: 0,
      cols: 2,
      explain: '$2 \\times 1 + 2 = 4$ و $1 + 2 = 3$ : المعادلتان محقّقتان في آن واحد، إذن $(1 ; 2)$ حل للجملة.',
    },
  },
];

/** Les parties d'un exercice. */
export const partsOf = (n) => EXERCISES.filter((ex) => ex.id === `ex-${n}` || ex.id.startsWith(`ex-${n}-`));

/** Accès par id. */
export const EX = Object.fromEntries(EXERCISES.map((ex) => [ex.id, ex]));
