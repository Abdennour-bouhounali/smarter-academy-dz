import { src } from '../../_unit/unitMeta.js';
export const LP = { P1: '4am_ikhtizal-kasr_P1', P2: '4am_ikhtizal-kasr_P2', P3: '4am_ikhtizal-kasr_P3', P4: '4am_ikhtizal-kasr_P4' };
const S = (n, part) => ({ ...src(`ex-${n}`, 15, 'أوظّف تعلّماتي', n), ...(part ? { part } : {}) });
const F = (prompt, expected, explain) => ({ prompt, expected, explain });

/** Module 3 : 188/252 (activité 8 د), دوري الآن 915/372, exercices 28, 34, 35, 36. */
export const EXERCISES_1 = [
  { id: 'act-8-d', source: src('act-8', 9, 'أنشطة', 8), learningPointId: LP.P3, difficulty: 'facile', statement: 'د) هل الكسر $\\dfrac{188}{252}$ قابل للاختزال؟ إذا كانت الإجابة «نعم»، اكتبه على شكل كسر غير قابل للاختزال.', interaction: 'fraction',
    question: F('الشكل غير القابل للاختزال:', '47/63', 'PGCD(188 ; 252) = 4: $252 = 188 \\times 1 + 64$ ، $188 = 64 \\times 2 + 60$ ، $64 = 60 \\times 1 + 4$ ، $60 = 4 \\times 15 + 0$. إذن $\\dfrac{188}{252} = \\dfrac{47}{63}$.') },
  { id: 'now-13-2', source: src('now-13-2', 13, 'دوري الآن', 2), learningPointId: LP.P3, difficulty: 'moyen', statement: 'اجعل الكسر $\\dfrac{915}{372}$ على شكل كسر غير قابل للاختزال.', interaction: 'fraction',
    question: F('الشكل غير القابل للاختزال:', '305/124', 'PGCD(915 ; 372) = 3، إذن $\\dfrac{915}{372} = \\dfrac{305}{124}$.') },
  ...[['529/69', '23/3', 'PGCD(529 ; 69) = 23'], ['91/28', '13/4', 'PGCD(91 ; 28) = 7'], ['707/909', '7/9', 'PGCD(707 ; 909) = 101'], ['1111/1919', '11/19', 'PGCD(1111 ; 1919) = 101'], ['20418/12190', '10209/6095', 'PGCD = 2'], ['42354/10080', '2353/560', 'PGCD = 18'], ['312054/21870', '52009/3645', 'PGCD = 6']]
    .map(([frac, red, why], i) => ({ id: `ex-28-${i + 1}`, source: S(28, `(${i + 1})`), learningPointId: LP.P3, difficulty: i < 4 ? 'moyen' : 'difficile',
      statement: i === 0 ? 'اكتب كل كسر من الكسور التالية على شكل كسر غير قابل للاختزال.' : undefined, interaction: 'fraction',
      question: F(`$\\dfrac{${frac.split('/')[0]}}{${frac.split('/')[1]}}$`, red, `${why}؛ نقسم البسط والمقام عليه.`) })),
  { id: 'ex-34', source: S(34), learningPointId: LP.P3, difficulty: 'moyen', items: ['1) هل العددان 1005 و 315 أوليان فيما بينهما؟ علّل.', '2) إذا كانت الإجابة «لا»، احسب عندئذ القاسم المشترك الأكبر لهما.', '3) اكتب الكسر $\\dfrac{1005}{315}$ على شكل كسر غير قابل للاختزال.'], interaction: 'fraction',
    question: F('3) الشكل غير القابل للاختزال:', '67/21', '1) لا: كلاهما يقبل القسمة على 5. 2) $1005 = 315 \\times 3 + 60$ ، $315 = 60 \\times 5 + 15$ ، $60 = 15 \\times 4 + 0$ → PGCD = 15. 3) $\\dfrac{1005}{315} = \\dfrac{67}{21}$.') },
  { id: 'ex-35', source: S(35), learningPointId: LP.P3, difficulty: 'moyen', items: ['1) احسب القاسم المشترك الأكبر للعددين 210 و 441.', '2) اكتب الكسر $\\dfrac{441}{210}$ على شكل كسر غير قابل للاختزال.'], interaction: 'fraction',
    question: F('2) الشكل غير القابل للاختزال:', '21/10', '$441 = 210 \\times 2 + 21$ ، $210 = 21 \\times 10 + 0$ → PGCD = 21؛ $\\dfrac{441}{210} = \\dfrac{21}{10}$.') },
  { id: 'ex-36', source: S(36), learningPointId: LP.P4, difficulty: 'difficile', items: ['1) احسب القاسم المشترك الأكبر للعددين 496 و 806.', '2) أكتب الكسر $\\dfrac{496}{806}$ على شكل كسر غير قابل للاختزال.', '3) احسب الفرق $\\dfrac{496}{806} - \\dfrac{3}{26}$ ثم اكتب النتيجة على شكل كسر غير قابل للاختزال.'], interaction: 'fraction',
    question: F('3) الفرق على شكل كسر غير قابل للاختزال:', '1/2', 'PGCD(496 ; 806) = 62 → $\\dfrac{496}{806} = \\dfrac{8}{13}$؛ $\\dfrac{8}{13} - \\dfrac{3}{26} = \\dfrac{16 - 3}{26} = \\dfrac{13}{26} = \\dfrac{1}{2}$.') },
];

/** Module 4 : exercices 29–33, 37, 38, 40. */
export const EXERCISES_2 = [
  { id: 'ex-29', source: S(29), learningPointId: LP.P2, difficulty: 'difficile', statement: 'نضع $A = \\dfrac{n + 7}{n + 1}$ حيث $n$ عدد طبيعي كيفي.', items: ['1) عيّن، في كل حالة من الحالات الآتية، الكسر غير القابل للاختزال الذي يساوي $A$. $n = 13$ ؛ $n = 11$ ؛ $n = 9$', '2) بيّن أن $A = 1 + \\dfrac{6}{n + 1}$.', '3) استنتج قيم $n$ التي يكون من أجلها $A$ عددا طبيعيا.'], interaction: 'integerSet',
    question: { prompt: '3) قيم $n$:', expected: [0, 1, 2, 5], explain: '1) $\\dfrac{20}{14} = \\dfrac{10}{7}$ ، $\\dfrac{18}{12} = \\dfrac{3}{2}$ ، $\\dfrac{16}{10} = \\dfrac{8}{5}$. 2) $n + 7 = (n + 1) + 6$. 3) $A$ طبيعي عندما يقسم $n + 1$ العدد 6: $n + 1 \\in \\{1 ; 2 ; 3 ; 6\\}$.' } },
  { id: 'ex-30', source: S(30), learningPointId: LP.P2, difficulty: 'difficile', statement: '$n$ عدد طبيعي كيفي. هل الكسر $\\dfrac{n}{n + 1}$ غير قابل للاختزال؟ علّل.', interaction: 'choice',
    question: { options: ['نعم: كل قاسم مشترك لـ n و n + 1 يقسم فرقهما 1، فـ PGCD(n ; n + 1) = 1', 'لا: يمكن اختزاله على n', 'يتوقف على n', 'نعم لأن n + 1 عدد أولي'], correct: 0, cols: 1, explain: 'البسط والمقام أوليان فيما بينهما لكل n.' } },
  { id: 'ex-31', source: S(31), learningPointId: LP.P2, difficulty: 'difficile', statement: 'هل الكسر $\\dfrac{35n + 7}{55n + 11}$ غير قابل للاختزال من أجل كل عدد طبيعي $n$؟ علل.', interaction: 'choice',
    question: { options: ['لا: $35n + 7 = 7(5n + 1)$ و $55n + 11 = 11(5n + 1)$، فيُختزل على $5n + 1$ ويساوي $\\dfrac{7}{11}$', 'نعم لأن 7 و 11 أوليان فيما بينهما', 'نعم من أجل كل n', 'لا لأن 35 و 55 يقبلان القسمة على 5'], correct: 0, cols: 1, explain: 'الكسر غير قابل للاختزال فقط عندما $5n + 1 = 1$، أي $n = 0$.' } },
  ...[['A', '\\dfrac{2}{7} - \\dfrac{3}{7} \\times \\dfrac{8}{21}', '6/49', '$\\dfrac{2}{7} - \\dfrac{8}{49} = \\dfrac{14 - 8}{49}$'], ['B', '\\left(\\dfrac{7}{6} - \\dfrac{3}{4}\\right) \\times \\dfrac{4}{5}', '1/3', '$\\dfrac{5}{12} \\times \\dfrac{4}{5} = \\dfrac{20}{60}$'], ['C', '10 \\div \\left(\\dfrac{7}{3} - \\dfrac{3}{7}\\right)', '21/4', '$10 \\div \\dfrac{40}{21} = \\dfrac{210}{40}$'], ['D', '\\dfrac{2}{3} - \\dfrac{14}{3} \\div \\dfrac{5}{24}', '-326/15', '$\\dfrac{2}{3} - \\dfrac{112}{5} = \\dfrac{10 - 336}{15}$']]
    .map(([name, tex, red, why]) => ({ id: `ex-32-${name}`, source: S(32, name), learningPointId: LP.P4, difficulty: 'moyen', statement: name === 'A' ? 'احسب وأعط النتيجة على شكل كسر غير قابل للاختزال.' : undefined, interaction: 'fraction',
      question: F(`$${name} = ${tex}$`, red, `${why} ثم نختزل.`) })),
  ...[['A', '\\dfrac{1 + \\dfrac{1}{2}}{1 + \\dfrac{1}{1 + \\dfrac{1}{3}}}', '6/7', '$\\dfrac{3}{2} \\div \\dfrac{7}{4} = \\dfrac{12}{14}$'], ['B', '\\dfrac{24}{25} \\times \\dfrac{\\dfrac{5}{8} - \\dfrac{5}{6}}{\\dfrac{1}{3} + \\dfrac{3}{4}}', '-12/65', '$\\dfrac{24}{25} \\times \\left(-\\dfrac{5}{24}\\right) \\times \\dfrac{12}{13} = -\\dfrac{120}{650}$']]
    .map(([name, tex, red, why]) => ({ id: `ex-33-${name}`, source: S(33, name), learningPointId: LP.P4, difficulty: 'difficile', statement: name === 'A' ? 'احسب وأعط النتيجة على شكل كسر غير قابل للاختزال.' : undefined, interaction: 'fraction',
      question: F(`$${name} = ${tex}$`, red, `${why} ثم نختزل.`) })),
  { id: 'ex-37', source: S(37), learningPointId: LP.P3, difficulty: 'difficile', statement: '$a$ و $b$ عددان طبيعيان غير معدومين حيث $162\\,a = 45\\,b$.', items: ['1) عيّن القاسم المشترك الأكبر للعددين 45 و 162.', '2) اكتب الكسر $\\dfrac{a}{b}$ على الشكل كسر غير قابل للاختزال.'], interaction: 'fraction',
    question: F('2) $\\dfrac{a}{b}$ على الشكل غير القابل للاختزال:', '5/18', 'من $162a = 45b$: $\\dfrac{a}{b} = \\dfrac{45}{162}$؛ PGCD(45 ; 162) = 9؛ إذن $\\dfrac{a}{b} = \\dfrac{5}{18}$.') },
  { id: 'ex-38', source: S(38), learningPointId: LP.P4, difficulty: 'maitrise', statement: 'إليك العدد $A$ حيث $A = \\dfrac{5175}{3825} + \\dfrac{19}{17}$.', items: ['1) احسب PGCD (5175 ; 3825).', '2) اكتب الكسر $\\dfrac{5175}{3825}$ على الشكل غير القابل للاختزال.', '3) استنتج كتابة للعدد $A$ على الشكل $b + \\dfrac{c}{d}$ حيث $b$ ، $c$ و $d$ أعداد طبيعية مع $b$ أكبر ما يمكن و $c$ أصغر ما يمكن.'], interaction: 'choice',
    question: { prompt: '3) الكتابة المطلوبة:', options: ['$A = 2 + \\dfrac{8}{17}$', '$A = 1 + \\dfrac{25}{17}$', '$A = 2 + \\dfrac{16}{34}$', '$A = 42 + \\dfrac{0}{17}$'], correct: 0, cols: 2,
      explain: '1) $5175 = 3825 + 1350$ ، $3825 = 1350 \\times 2 + 1125$ ، $1350 = 1125 + 225$ ، $1125 = 225 \\times 5$ → PGCD = 225. 2) $\\dfrac{5175}{3825} = \\dfrac{23}{17}$. 3) $A = \\dfrac{23 + 19}{17} = \\dfrac{42}{17} = 2 + \\dfrac{8}{17}$.' } },
  { id: 'ex-40', source: S(40), learningPointId: LP.P3, difficulty: 'maitrise', items: ['1) احسب PGCD (19 251 ; 22 816).', '2) اكتب الكسر $\\dfrac{22816}{19251}$ على شكل كسر غير قابل للاختزال.'], interaction: 'fraction',
    question: F('2) الشكل غير القابل للاختزال:', '32/27', '$22816 = 19251 + 3565$ ، $19251 = 3565 \\times 5 + 1426$ ، $3565 = 1426 \\times 2 + 713$ ، $1426 = 713 \\times 2 + 0$ → PGCD = 713؛ $\\dfrac{22816}{19251} = \\dfrac{32}{27}$.') },
];
