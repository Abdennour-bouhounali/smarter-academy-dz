/**
 * Les exercices du MANUEL rattachés au درس 2 « حل جملة معادلتين من الدرجة الأولى بمجهولين جبرياً »
 * (couverture : extraction.json → destinations). Chaque énoncé est celui du livre, au mot près ;
 * un exercice à plusieurs jumal est découpé en une entrée par jumla (la première porte l'énoncé).
 *
 * Une solution est une ثنائية tapée (`pair`, évaluée comme le moteur de pratique : fractions,
 * décimaux à virgule, chiffres arabes ; un seul nombre juste est une réponse partielle). Les
 * inconnues gardent les lettres du livre — (a ; b), (d ; t) — par `names`. Les valeurs non entières
 * sont gardées EXACTES (68/19 ; 39/19), comme le livre les donne.
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_hall-jabri_P1',
  P2: '4am_hall-jabri_P2',
  P3: '4am_hall-jabri_P3',
};

const E = (n, part, page = 60, section = 'أوظّف تعلّماتي') => ({ ...src(`ex-${n}`, page, section, n), ...(part ? { part } : {}) });
const PAIR = (prompt, x, y, explain, names) => ({ interaction: 'pair', question: { prompt, expected: { x, y }, explain, ...(names ? { names } : {}) } });

/* ── Module 2 — دوري الآن (p. 59) ──────────────────────────────────────────── */
const NOW_SRC = (part) => ({ ...src('now-59', 59, 'دوري الآن'), part });
export const NOW_59 = [
  {
    id: 'now-59-1', source: NOW_SRC('1'), learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'حل الجملتين الآتيتين مبيّنا طريقة الحل المستعملة. $\\begin{cases} 2x + y = 6 \\\\ \\dfrac{1}{2}x - y = -2 \\end{cases}$ ، $\\begin{cases} 6x - 2y = 8 \\\\ x + 3y = 1 \\end{cases}$',
    ...PAIR('الجملة الأولى $\\begin{cases} 2x + y = 6 \\\\ \\dfrac{1}{2}x - y = -2 \\end{cases}$ ، حلها:', '8/5', '14/5',
      'معاملا $y$ متعاكسان ($y$ و $-y$): طريقة الجمع مباشرة. $2x + \\dfrac{1}{2}x = 6 - 2$ أي $\\dfrac{5}{2}x = 4$ ومنه $x = \\dfrac{8}{5}$ ؛ ثم $y = 6 - 2x = 6 - \\dfrac{16}{5} = \\dfrac{14}{5}$ . الحل $\\left(\\dfrac{8}{5} ; \\dfrac{14}{5}\\right)$ أي $(1{,}6 ; 2{,}8)$ .'),
    method: 'نختار الجمع لأنّ معاملي $y$ متعاكسان.',
    commonError: 'التوقف عند $x = \\dfrac{8}{5}$ : الحل ثنائية، فنعوّض لنجد $y$ أيضًا.',
  },
  {
    id: 'now-59-2', source: NOW_SRC('2'), learningPointId: LP.P3, difficulty: 'moyen',
    ...PAIR('الجملة الثانية $\\begin{cases} 6x - 2y = 8 \\\\ x + 3y = 1 \\end{cases}$ ، حلها:', '13/10', '-1/10',
      'معامل $x$ في $x + 3y = 1$ هو 1: طريقة التعويض مناسبة. $x = 1 - 3y$ ، فنجد $6(1 - 3y) - 2y = 8$ أي $6 - 20y = 8$ ومنه $y = -\\dfrac{1}{10}$ ؛ ثم $x = 1 - 3\\left(-\\dfrac{1}{10}\\right) = \\dfrac{13}{10}$ . الحل $\\left(\\dfrac{13}{10} ; -\\dfrac{1}{10}\\right)$ أي $(1{,}3 ; -0{,}1)$ .'),
    method: 'نختار التعويض لأنّ معامل $x$ في المعادلة الثانية هو 1.',
    commonError: 'خطأ الإشارة عند التعبير: $x = 1 + 3y$ بدل $x = 1 - 3y$ .',
  },
];

/* ── Module 3 — أوظّف تعلّماتي (pp. 60–61) et أتعمّق (p. 63) ──────────────────────── */
export const EXERCISES = [
  // تمرين 5 — التعويض
  { id: 'ex-5-a', source: E(5, 'أ'), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'حل الجملتين الآتيتين باستعمال طريقة التعويض.',
    items: ['أ) $\\begin{cases} x + 3y = 10 \\\\ 3x + 5y = 18 \\end{cases}$', 'ب) $\\begin{cases} 3a + 2b = 0 \\\\ 6a + 3b = -24 \\end{cases}$'],
    ...PAIR('أ) الحل:', '1', '3', 'من $x + 3y = 10$ ينتج $x = 10 - 3y$ ؛ بالتعويض: $3(10 - 3y) + 5y = 18$ أي $30 - 4y = 18$ ، ومنه $y = 3$ ثم $x = 10 - 9 = 1$ . الحل $(1 ; 3)$ .'),
    method: 'نعبّر عن المجهول الذي معامله 1 ($x$ في المعادلة الأولى) بدلالة الآخر، ثم نعوّض في المعادلة الأخرى.',
    commonError: 'التعويض في المعادلة نفسها $x + 3y = 10$ : نجد $10 - 3y + 3y = 10$ أي $10 = 10$ ، ولا نتعلّم شيئًا.' },
  { id: 'ex-5-b', source: E(5, 'ب'), learningPointId: LP.P1, difficulty: 'moyen',
    ...PAIR('ب) الحل $(a ; b)$:', '-16', '24', 'من $3a + 2b = 0$ ينتج $b = -\\dfrac{3}{2}a$ ؛ بالتعويض: $6a + 3\\left(-\\dfrac{3}{2}a\\right) = -24$ أي $\\dfrac{3}{2}a = -24$ ، ومنه $a = -16$ ثم $b = 24$ . للتحقق: $3 \\times (-16) + 2 \\times 24 = 0$ و $6 \\times (-16) + 3 \\times 24 = -24$ .', ['a', 'b']),
    commonError: 'قلب ترتيب الثنائية: $(24 ; -16)$ بدل $(a ; b) = (-16 ; 24)$ .' },
  // تمرين 6
  { id: 'ex-6-a', source: E(6, 'أ'), learningPointId: LP.P1, difficulty: 'difficile',
    statement: 'نفس التمرين مع الجملتين:',
    items: ['أ) $\\begin{cases} 2x - 3y = 1 \\\\ 3x + 5y = 21 \\end{cases}$', 'ب) $\\begin{cases} d = 90t \\\\ d + 50t = 280 \\end{cases}$'],
    ...PAIR('أ) الحل:', '68/19', '39/19', 'من $2x - 3y = 1$ ينتج $x = \\dfrac{1 + 3y}{2}$ ؛ بالتعويض ثم الضرب في 2: $3(1 + 3y) + 10y = 42$ أي $19y = 39$ ، ومنه $y = \\dfrac{39}{19}$ ثم $x = \\dfrac{68}{19}$ . القيمتان غير صحيحتين: هما عددا الكتاب.'),
    commonError: 'تقريب القيمتين: نكتب الحل كسرين $\\left(\\dfrac{68}{19} ; \\dfrac{39}{19}\\right)$ .' },
  { id: 'ex-6-b', source: E(6, 'ب'), learningPointId: LP.P1, difficulty: 'facile',
    ...PAIR('ب) الحل $(d ; t)$:', '180', '2', 'المجهول $d$ معطى بدلالة $t$ : نعوّضه في المعادلة الثانية، $90t + 50t = 280$ أي $140t = 280$ ، ومنه $t = 2$ ثم $d = 90 \\times 2 = 180$ .', ['d', 't']) },
  // تمرين 7 — الجمع والتعويض
  { id: 'ex-7-a', source: E(7, 'أ'), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'حل الجملتين الآتيتين باستعمال طريقة الجمع والتعويض.',
    items: ['أ) $\\begin{cases} -x + 3y = 2 \\\\ 2x + y = 3 \\end{cases}$', 'ب) $\\begin{cases} 5x + 4y = 16 \\\\ 3x + 6y = 15 \\end{cases}$'],
    ...PAIR('أ) الحل:', '1', '1', 'نضرب طرفي المعادلة الأولى في 2: $-2x + 6y = 4$ ، ونجمعها مع الثانية طرفًا لطرف: $7y = 7$ ، ومنه $y = 1$ ؛ ثم $2x + 1 = 3$ أي $x = 1$ .'),
    method: 'نضرب طرفي معادلة في معامل مناسب ليصير معاملا أحد المجهولين متعاكسين، ثم نجمع طرفًا لطرف.',
    commonError: 'ضرب طرف واحد: $-2x + 6y = 2$ بدل $-2x + 6y = 4$ .' },
  { id: 'ex-7-b', source: E(7, 'ب'), learningPointId: LP.P2, difficulty: 'moyen',
    ...PAIR('ب) الحل:', '2', '3/2', 'لنتخلّص من $y$ : نضرب الأولى في 3 والثانية في $-2$ : $15x + 12y = 48$ و $-6x - 12y = -30$ ؛ بالجمع $9x = 18$ ، ومنه $x = 2$ ثم $6 + 6y = 15$ أي $y = \\dfrac{3}{2}$ .'),
    commonError: 'الجمع دون أن يكون المعاملان متعاكسين: $8x + 10y = 31$ يبقى فيها المجهولان.' },
  // تمرين 8
  { id: 'ex-8-a', source: E(8, 'أ'), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'نفس التمرين مع الجملتين:',
    items: ['أ) $\\begin{cases} 2x - y = 1 \\\\ 3x + 5y = 21 \\end{cases}$', 'ب) $\\begin{cases} 3x + 7y = 11 \\\\ -5x + 2y = 5 \\end{cases}$'],
    ...PAIR('أ) الحل:', '2', '3', 'نضرب الأولى في 5: $10x - 5y = 5$ ، ونجمع مع الثانية: $13x = 26$ ، ومنه $x = 2$ ثم $y = 2x - 1 = 3$ .') },
  { id: 'ex-8-b', source: E(8, 'ب'), learningPointId: LP.P2, difficulty: 'difficile',
    ...PAIR('ب) الحل:', '-13/41', '70/41', 'لنتخلّص من $x$ : نضرب الأولى في 5 والثانية في 3: $15x + 35y = 55$ و $-15x + 6y = 15$ ؛ بالجمع $41y = 70$ ، ومنه $y = \\dfrac{70}{41}$ ثم $3x = 11 - \\dfrac{490}{41} = -\\dfrac{39}{41}$ أي $x = -\\dfrac{13}{41}$ .'),
    commonError: 'ضرب معادلة واحدة: لا يتعاكس $15x$ و $-5x$ ؛ نضرب الثانية في 3 أيضًا.' },
  // تمرين 9 — طريقة من اختيارك
  { id: 'ex-9-a', source: E(9, 'أ'), learningPointId: LP.P3, difficulty: 'facile',
    statement: 'حل الجملتين الآتيتين باستعمال طريقة من اختيارك.',
    items: ['أ) $\\begin{cases} -2x + y = 0 \\\\ 3x - y = 4 \\end{cases}$', 'ب) $\\begin{cases} \\dfrac{x}{6} - y = -1 \\\\ 3x - 2y = 6 \\end{cases}$'],
    ...PAIR('أ) الحل:', '4', '8', 'معاملا $y$ متعاكسان: بالجمع مباشرة $x = 4$ ، ثم $y = 2x = 8$ .'),
    method: 'ننظر إلى المعاملات قبل أن نختار: معاملان متعاكسان → الجمع؛ معامل 1 أو $-1$ → التعويض.' },
  { id: 'ex-9-b', source: E(9, 'ب'), learningPointId: LP.P3, difficulty: 'moyen',
    ...PAIR('ب) الحل:', '3', '3/2', 'من الأولى $y = \\dfrac{x}{6} + 1$ ؛ بالتعويض: $3x - 2\\left(\\dfrac{x}{6} + 1\\right) = 6$ أي $\\dfrac{8}{3}x = 8$ ، ومنه $x = 3$ ثم $y = \\dfrac{1}{2} + 1 = \\dfrac{3}{2}$ .') },
  // تمرين 10
  { id: 'ex-10-a', source: E(10, 'أ'), learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'نفس التمرين السابق مع الجملتين:',
    items: ['أ) $\\begin{cases} 3x = 2y \\\\ y = 3(x - 3) \\end{cases}$', 'ب) $\\begin{cases} x = y \\\\ 3x + 2y = 0 \\end{cases}$'],
    ...PAIR('أ) الحل:', '6', '9', 'المجهول $y$ معطى بدلالة $x$ : نعوّضه في الأولى، $3x = 2 \\times 3(x - 3) = 6x - 18$ أي $-3x = -18$ ، ومنه $x = 6$ ثم $y = 3(6 - 3) = 9$ .') },
  { id: 'ex-10-b', source: E(10, 'ب'), learningPointId: LP.P3, difficulty: 'facile',
    ...PAIR('ب) الحل:', '0', '0', 'نعوّض $x$ بـ $y$ : $3y + 2y = 0$ أي $5y = 0$ ، ومنه $y = 0$ و $x = 0$ . الحل $(0 ; 0)$ .') },
  // تمرين 11 — باختيار طريقة مناسبة
  { id: 'ex-11-a', source: E(11, 'أ'), learningPointId: LP.P3, difficulty: 'facile',
    statement: 'حل كلّ جملة باختيار طريقة مناسبة.',
    items: ['أ) $\\begin{cases} x + y = 12 \\\\ 3x + 2y = 31 \\end{cases}$', 'ب) $\\begin{cases} 4x - 3y = 1 \\\\ 12x - y = -5 \\end{cases}$', 'جـ) $\\begin{cases} 6x - 5y = 0 \\\\ 2x - y = 12 \\end{cases}$', 'د) $\\begin{cases} a - b = 6 \\\\ 3a - \\dfrac{b}{2} = 3 \\end{cases}$'],
    ...PAIR('أ) الحل:', '7', '5', '$y = 12 - x$ ؛ بالتعويض: $3x + 2(12 - x) = 31$ أي $x + 24 = 31$ ، ومنه $x = 7$ ثم $y = 5$ .') },
  { id: 'ex-11-b', source: E(11, 'ب'), learningPointId: LP.P3, difficulty: 'moyen',
    ...PAIR('ب) الحل:', '-1/2', '-1', 'معامل $y$ في الثانية $-1$ : $y = 12x + 5$ ؛ بالتعويض: $4x - 3(12x + 5) = 1$ أي $-32x = 16$ ، ومنه $x = -\\dfrac{1}{2}$ ثم $y = -6 + 5 = -1$ .'),
    commonError: 'خطأ الإشارة: من $12x - y = -5$ ينتج $y = 12x + 5$ وليس $y = 12x - 5$ .' },
  { id: 'ex-11-c', source: E(11, 'جـ'), learningPointId: LP.P3, difficulty: 'moyen',
    ...PAIR('جـ) الحل:', '15', '18', 'من الثانية $y = 2x - 12$ ؛ بالتعويض: $6x - 5(2x - 12) = 0$ أي $-4x + 60 = 0$ ، ومنه $x = 15$ ثم $y = 18$ .') },
  { id: 'ex-11-d', source: E(11, 'د'), learningPointId: LP.P3, difficulty: 'difficile',
    ...PAIR('د) الحل $(a ; b)$:', '0', '-6', '$a = b + 6$ ؛ بالتعويض: $3(b + 6) - \\dfrac{b}{2} = 3$ أي $\\dfrac{5}{2}b = -15$ ، ومنه $b = -6$ ثم $a = 0$ .', ['a', 'b']) },
  // تمرين 12 — جملة تُبسَّط أولًا
  { id: 'ex-12-1', source: E(12, '1', 61), learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'حلّ الجملة باستعمال طريقة من اختيارك. $\\begin{cases} x + 3y = 7 \\\\ 5y - 2 = 3(x - 1) \\end{cases}$',
    interaction: 'choice',
    question: {
      prompt: 'نبدأ بتبسيط المعادلة الثانية $5y - 2 = 3(x - 1)$ ، فتُكتب:',
      options: ['$3x - 5y = 1$', '$3x - 5y = -1$', '$3x - 5y = 5$'],
      correct: 0, cols: 3,
      explain: '$5y - 2 = 3x - 3$ ، ننقل $5y$ إلى الطرف الثاني و $-3$ إلى الأول: $3x - 5y = -2 + 3 = 1$ .',
    },
    commonError: 'نشر $3(x - 1)$ إلى $3x - 1$ : العدد 3 يُضرب في الحدّين.' },
  { id: 'ex-12-2', source: E(12, '2', 61), learningPointId: LP.P3, difficulty: 'difficile',
    ...PAIR('الحل:', '19/7', '10/7', 'معامل $x$ في الأولى 1: $x = 7 - 3y$ ؛ بالتعويض في $3x - 5y = 1$ : $21 - 9y - 5y = 1$ أي $14y = 20$ ، ومنه $y = \\dfrac{10}{7}$ ثم $x = 7 - \\dfrac{30}{7} = \\dfrac{19}{7}$ .') },
  // تمرين 13
  { id: 'ex-13-1', source: E(13, '1', 61), learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'السؤال نفسه مع الجملة: $\\begin{cases} x - 2y = 1 \\\\ -3(x - y) = 6 \\end{cases}$',
    interaction: 'choice',
    question: {
      prompt: 'المعادلة $-3(x - y) = 6$ تُكتب أبسط:',
      options: ['$x - y = -2$', '$x - y = 2$', '$x - y = 3$'],
      correct: 0, cols: 3,
      explain: 'نقسم الطرفين على $-3$ : $x - y = \\dfrac{6}{-3} = -2$ .',
    } },
  { id: 'ex-13-2', source: E(13, '2', 61), learningPointId: LP.P3, difficulty: 'moyen',
    ...PAIR('الحل:', '-5', '-3', 'معاملا $x$ متساويان في $x - 2y = 1$ و $x - y = -2$ : نضرب الثانية في $-1$ ثم نجمع، $-y = 3$ ، ومنه $y = -3$ ثم $x = 1 + 2y = -5$ .'),
    commonError: 'جمع المعادلتين كما هما: $2x - 3y = -1$ ، معاملا $x$ متساويان وليسا متعاكسين.' },
  // أتعمّق — تمرين 22 و 23
  { id: 'ex-22', source: E(22, null, 63, 'أتعمّق'), learningPointId: LP.P3, difficulty: 'difficile',
    statement: 'حل الجملة الآتية باستعمال طريقة من اختيارك. $\\begin{cases} 8x + 3y = 39{,}5 \\\\ 7x + 9y = 50{,}5 \\end{cases}$',
    ...PAIR('الحل:', '4', '2,5', 'لا معامل 1 هنا: الجمع أنسب. نضرب الأولى في $-3$ : $-24x - 9y = -118{,}5$ ، ونجمع مع الثانية: $-17x = -68$ ، ومنه $x = 4$ ثم $3y = 39{,}5 - 32 = 7{,}5$ أي $y = 2{,}5$ .') },
  { id: 'ex-23', source: E(23, null, 63, 'أتعمّق'), learningPointId: LP.P3, difficulty: 'facile',
    statement: 'حل الجملة باستعمال طريقة من اختيارك. $\\begin{cases} 2x + y = 1 \\\\ -2x + 4y = -6 \\end{cases}$',
    ...PAIR('الحل:', '1', '-1', 'معاملا $x$ متعاكسان: بالجمع $5y = -5$ ، ومنه $y = -1$ ثم $2x - 1 = 1$ أي $x = 1$ .') },
];

/** Les entrées d'un exercice (« 5 », « 12 », « 22 »). */
export const partsOf = (n) => EXERCISES.filter((ex) => ex.source.number === Number(n));
/** Accès par id (la carte de connaissances cite ces textes). */
export const EX = Object.fromEntries([...EXERCISES, ...NOW_59].map((ex) => [ex.id, ex]));
