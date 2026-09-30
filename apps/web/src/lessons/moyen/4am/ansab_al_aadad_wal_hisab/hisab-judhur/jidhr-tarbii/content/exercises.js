/**
 * Les exercices du MANUEL rattachés au درس « الجذر التربيعي لعدد موجب »
 * (extraction.json → destinations : ex-1 … ex-8 p. 26, دوري الآن 1 p. 23).
 * Chaque exercice garde son énoncé et ses nombres ; l'interaction le rend sans
 * changer sa tâche mathématique. Réponses calculées (le manuel n'a pas de corrigé).
 *
 * Les OPTIONS et CORRECTIONS d'une ligne `batch` passent par MathText
 * (TextbookExercise) : toute écriture mathématique y est un îlot `$…$`
 * (nombre négatif, puissance, égalité), jamais du texte brut.
 */
import { src } from '../../_unit/unitMeta.js';

export const LP = {
  P1: '4am_jidhr-tarbii_P1',
  P2: '4am_jidhr-tarbii_P2',
  P3: '4am_jidhr-tarbii_P3',
};

const S = (n) => src(`ex-${n}`, 26, 'أوظّف تعلّماتي', n);
const SQ = 'هو مربع العدد';
const RT = 'هو الجذر التربيعي للعدد';

export const EXERCISES = [
  {
    id: 'ex-1', source: S(1), learningPointId: LP.P1, difficulty: 'facile',
    statement: 'انقل وأتمم الجمل الآتية:',
    interaction: 'batch',
    question: {
      prompt: 'اختر ما يتمّم كل جملة.',
      rows: [
        { label: '144 هو مربع العدد ...', options: ['12 أو $-12$', '72', '20736'], correct: 0, correction: '$12^2 = 144$ و $(-12)^2 = 144$' },
        { label: '13 هو الجذر التربيعي للعدد ...', options: ['26', '169', '6,5'], correct: 1, correction: '13 موجب و $13^2 = 169$' },
        { label: '100 هو مربع العدد ...', options: ['50', '10000', '10 أو $-10$'], correct: 2, correction: '$10^2 = 100$ و $(-10)^2 = 100$' },
        { label: '2,5 هو الجذر التربيعي للعدد ...', options: ['6,25', '5', '1,25'], correct: 0, correction: '2,5 موجب و $2{,}5^2 = 6{,}25$' },
        { label: '... هو مربع العدد 25.', options: ['5', '625', '50'], correct: 1, correction: '$25^2 = 625$' },
        { label: '... هو الجذر التربيعي للعدد 25.', options: ['625', '12,5', '5'], correct: 2, correction: '5 موجب و $5^2 = 25$' },
      ],
      explain: 'مربع العدد $b$ هو $b^2$، والجذر التربيعي للعدد الموجب $a$ هو العدد الموجب الذي مربعه $a$. للعدد 144 عددان مربّعهما 144: 12 و $-12$؛ أما الجذر التربيعي للعدد 25 فهو 5 وحده لأنه موجب.',
    },
    method: 'نميّز الكلمتين: «مربع العدد $b$» هو $b^2$؛ «الجذر التربيعي للعدد $a$» هو العدد الموجب الذي مربعه $a$.',
    commonError: 'الخلط بين «مربع العدد» و«الجذر التربيعي للعدد»: الجذر التربيعي للعدد 25 هو 5، أما مربع العدد 25 فهو 625.',
    needsReview: 'الجملتان «144 هو مربع العدد ...» و «100 هو مربع العدد ...» تقبلان عددين (extraction.json → discrepancies, ex-1).',
  },
  {
    id: 'ex-2', source: S(2), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'اكتب العبارة المناسبة : «هو مربع العدد» أو «هو الجذر التربيعي للعدد» مكان النقط.',
    interaction: 'batch',
    question: {
      prompt: 'العدد المكتوب على اليمين هو فاعل الجملة: «64 ... 8» تُقرأ «64 هو ... 8».',
      rows: [
        // (−1)² = 1 = √1 : les DEUX formulations sont vraies ; l'option juste le dit (aucun distracteur vrai).
        { label: '$(-1)^2 \\ldots 1$', options: [`${SQ} فقط`, `${RT} فقط`, 'العبارتان صحيحتان'], correct: 2, correction: '$(-1)^2 = 1 = 1^2$ و $\\sqrt{1} = 1$' },
        { label: '$\\dfrac{1}{49} \\ldots \\dfrac{1}{7}$', options: [SQ, RT], correct: 0, correction: '$\\left(\\dfrac{1}{7}\\right)^2 = \\dfrac{1}{49}$' },
        { label: '$64 \\ldots 8$', options: [SQ, RT], correct: 0, correction: '$8^2 = 64$' },
        { label: '$0{,}8 \\ldots 0{,}64$', options: [SQ, RT], correct: 1, correction: '0,8 موجب و $0{,}8^2 = 0{,}64$' },
        { label: '$0{,}09 \\ldots 0{,}3$', options: [SQ, RT], correct: 0, correction: '$0{,}3^2 = 0{,}09$' },
        { label: '$0{,}0001 \\ldots 0{,}01$', options: [SQ, RT], correct: 0, correction: '$0{,}01^2 = 0{,}0001$' },
      ],
      explain: '«$x$ هو مربع العدد $y$» معناه $x = y^2$؛ «$x$ هو الجذر التربيعي للعدد $y$» معناه $x$ موجب و $x^2 = y$. وفي السطر الأول تصحّ العبارتان لأن $(-1)^2 = 1$ و $\\sqrt{1} = 1$.',
    },
    commonError: 'قراءة الجملة في الاتجاه المعاكس: «0,8 هو مربع العدد 0,64» خطأ لأن $0{,}64^2 = 0{,}4096$؛ الصحيح أن 0,8 هو الجذر التربيعي للعدد 0,64 لأن $0{,}8^2 = 0{,}64$.',
    needsReview: 'ترتيب قراءة كل زوج: العدد الأيسر في السطر المطبوع هو فاعل الجملة (extraction.json → discrepancies, ex-2).',
  },
  {
    id: 'ex-3', source: S(3), learningPointId: LP.P2, difficulty: 'facile',
    statement: 'اكتب كل عدد من الأعداد التالية كتابة عشرية.',
    interaction: 'batch',
    question: {
      prompt: 'اختر الكتابة العشرية لكل عدد.',
      rows: [
        { label: '$\\sqrt{81}$', options: ['40,5', '9', '6561'], correct: 1, correction: '$9^2 = 81$' },
        { label: '$\\sqrt{289}$', options: ['17', '144,5', '83521'], correct: 0, correction: '$17^2 = 289$' },
        { label: '$\\sqrt{0{,}04}$', options: ['0,02', '0,0016', '0,2'], correct: 2, correction: '$0{,}2^2 = 0{,}04$ أما $0{,}02^2 = 0{,}0004$' },
        { label: '$\\sqrt{1{,}44}$', options: ['1,2', '0,12', '0,72'], correct: 0, correction: '$1{,}2^2 = 1{,}44$' },
        { label: '$\\sqrt{1{,}21}$', options: ['0,11', '1,1', '0,605'], correct: 1, correction: '$1{,}1^2 = 1{,}21$' },
        { label: '$\\sqrt{6{,}25}$', options: ['0,25', '3,125', '2,5'], correct: 2, correction: '$2{,}5^2 = 6{,}25$' },
        { label: '$\\sqrt{0{,}0001}$', options: ['0,01', '0,001', '0,00005'], correct: 0, correction: '$0{,}01^2 = 0{,}0001$' },
      ],
      explain: 'نبحث عن العدد الموجب الذي مربعه العدد المعطى، ونتحقق بتربيعه: $17^2 = 289$ ، $1{,}1^2 = 1{,}21$ ، $0{,}01^2 = 0{,}0001$.',
    },
    commonError: 'كتابة $\\sqrt{0{,}04} = 0{,}02$، لكن $0{,}02^2 = 0{,}0004$؛ نتحقق دائمًا بتربيع النتيجة: $0{,}2^2 = 0{,}04$.',
  },
  {
    id: 'ex-4', source: S(4), learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'اكتب كل عدد من الأعداد التالية على شكل عدد طبيعي.',
    interaction: 'batch',
    question: {
      prompt: 'اختر العدد الطبيعي الذي يساوي كل عدد.',
      rows: [
        { label: '$\\sqrt{(-1)^2}$', options: ['$-1$', '1', 'لا معنى له'], correct: 1, correction: '$(-1)^2 = 1$ و $\\sqrt{1} = 1$' },
        { label: '$\\sqrt{0}$', options: ['0', '1', 'لا معنى له'], correct: 0, correction: '0 موجب و $0^2 = 0$' },
        { label: '$\\sqrt{(-1)^6}$', options: ['3', '$-1$', '1'], correct: 2, correction: '$(-1)^6 = 1$ و $\\sqrt{1} = 1$' },
        { label: '$\\sqrt{-(-49)}$', options: ['لا معنى له', '7', '$-7$'], correct: 1, correction: '$-(-49) = 49$ و $\\sqrt{49} = 7$' },
      ],
      explain: 'نحسب أولًا العدد تحت الجذر: $(-1)^2 = 1$ ، $(-1)^6 = 1$ ، $-(-49) = 49$؛ كلها أعداد موجبة، وجذورها التربيعية أعداد موجبة: 1 ، 1 ، 7.',
    },
    commonError: 'كتابة $\\sqrt{(-1)^2} = -1$: الجذر التربيعي عدد موجب دائمًا، و $(-1)^2 = 1$ إذن $\\sqrt{(-1)^2} = \\sqrt{1} = 1$.',
  },
  {
    id: 'ex-5', source: S(5), learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'اكتب كل عدد من الأعداد التالية على شكل قوة للعدد 10',
    interaction: 'batch',
    question: {
      prompt: 'اختر القوة للعدد 10 التي تساوي كل عدد.',
      rows: [
        { label: '$\\sqrt{10^2}$', options: ['10', '$10^2$', '5'], correct: 0, correction: '10 موجب و $10^2 = 100$' },
        { label: '$\\sqrt{10^4}$', options: ['$10^4$', '$10^2$', '$10^{16}$'], correct: 1, correction: '$(10^2)^2 = 10^4$' },
        { label: '$\\sqrt{10^6}$', options: ['$10^4$', '$10^{12}$', '$10^3$'], correct: 2, correction: '$(10^3)^2 = 10^6$' },
        { label: '$\\sqrt{10^{-6}}$', options: ['$10^{-3}$', '$10^3$', '$10^{-4}$'], correct: 0, correction: '$(10^{-3})^2 = 10^{-6}$' },
        { label: '$\\sqrt{10^{10}}$', options: ['$10^8$', '$10^5$', '$10^{20}$'], correct: 1, correction: '$(10^5)^2 = 10^{10}$' },
        { label: '$\\sqrt{10^{-20}}$', options: ['$10^{10}$', '$10^{-18}$', '$10^{-10}$'], correct: 2, correction: '$(10^{-10})^2 = 10^{-20}$' },
        { label: '$\\sqrt{10^{-100}}$', options: ['$10^{-50}$', '$10^{50}$', '$10^{-98}$'], correct: 0, correction: '$(10^{-50})^2 = 10^{-100}$' },
      ],
      explain: 'كل قوة للعدد 10 عدد موجب، و $(10^{3})^2 = 10^{6}$ ، $(10^{-3})^2 = 10^{-6}$: إذن $\\sqrt{10^{6}} = 10^{3}$ و $\\sqrt{10^{-6}} = 10^{-3}$.',
    },
    commonError: 'نسيان إشارة الأس: $\\sqrt{10^{-6}} = 10^{-3}$ وليس $10^{3}$، لأن $(10^{3})^2 = 10^{6}$.',
  },
  {
    id: 'ex-6', source: S(6), learningPointId: LP.P3, difficulty: 'facile',
    statement: 'احسب مربع كل عدد مما يلي:',
    interaction: 'batch',
    question: {
      prompt: 'اختر مربع كل عدد.',
      rows: [
        { label: '$\\sqrt{0{,}01}$', options: ['0,1', '0,01', '0,0001'], correct: 1, correction: '$(\\sqrt{0{,}01})^2 = 0{,}01$' },
        { label: '$\\sqrt{14}$', options: ['14', '196', '7'], correct: 0, correction: '$(\\sqrt{14})^2 = 14$' },
        { label: '$\\sqrt{25}$', options: ['5', '625', '25'], correct: 2, correction: '$(\\sqrt{25})^2 = 25$' },
        { label: '$\\sqrt{400}$', options: ['400', '20', '160000'], correct: 0, correction: '$(\\sqrt{400})^2 = 400$' },
        { label: '$\\sqrt{909}$', options: ['826281', '909', '454,5'], correct: 1, correction: '$(\\sqrt{909})^2 = 909$' },
        { label: '$\\sqrt{2019}$', options: ['1009,5', '4076361', '2019'], correct: 2, correction: '$(\\sqrt{2019})^2 = 2019$' },
      ],
      explain: '$a$ عدد موجب: $\\sqrt{a}$ هو العدد الموجب الذي مربعه $a$، أي $(\\sqrt{a})^2 = a$ — دون أي حساب، حتى لـ $\\sqrt{909}$ و $\\sqrt{2019}$.',
    },
    commonError: 'حساب الجذر بدل المربع: مربع $\\sqrt{25}$ هو 25، أما $\\sqrt{25}$ نفسه فهو 5.',
  },
  {
    id: 'ex-7', source: S(7), learningPointId: LP.P3, difficulty: 'moyen',
    statement: 'احسب مربع كل عدد مما يلي:',
    interaction: 'batch',
    question: {
      prompt: 'اختر مربع كل عدد.',
      rows: [
        { label: '$\\sqrt{\\dfrac{1}{9}}$', options: ['$\\dfrac{1}{3}$', '$\\dfrac{1}{9}$', '$\\dfrac{1}{81}$'], correct: 1, correction: '$\\left(\\sqrt{\\dfrac{1}{9}}\\right)^2 = \\dfrac{1}{9}$' },
        { label: '$\\sqrt{\\dfrac{100}{49}}$', options: ['$\\dfrac{100}{49}$', '$\\dfrac{10}{7}$', '$\\dfrac{10000}{2401}$'], correct: 0, correction: '$\\left(\\sqrt{\\dfrac{100}{49}}\\right)^2 = \\dfrac{100}{49}$' },
        { label: '$\\sqrt{\\dfrac{1}{25}}$', options: ['$\\dfrac{1}{625}$', '$\\dfrac{1}{5}$', '$\\dfrac{1}{25}$'], correct: 2, correction: '$\\left(\\sqrt{\\dfrac{1}{25}}\\right)^2 = \\dfrac{1}{25}$' },
        { label: '$-\\sqrt{17}$', options: ['$-17$', '17', '289'], correct: 1, correction: '$(-\\sqrt{17})^2 = (\\sqrt{17})^2 = 17$' },
      ],
      explain: '$\\left(\\sqrt{\\dfrac{1}{9}}\\right)^2 = \\dfrac{1}{9}$ لأن $(\\sqrt{a})^2 = a$؛ و $(-\\sqrt{17})^2 = (-\\sqrt{17}) \\times (-\\sqrt{17}) = (\\sqrt{17})^2 = 17$.',
    },
    commonError: 'كتابة $(-\\sqrt{17})^2 = -17$: جداء عددين سالبين عدد موجب، و $(-\\sqrt{17})^2 = (\\sqrt{17})^2 = 17$.',
  },
  {
    id: 'ex-8', source: S(8), learningPointId: LP.P3, difficulty: 'difficile',
    statement: 'اكتب الأعداد الآتية دون استعمال الرمز $\\sqrt{\\;}$',
    interaction: 'batch',
    question: {
      prompt: 'تذكّر أنّ $\\pi$ أكبر من 3 وأصغر من 4.',
      rows: [
        { label: '$\\sqrt{(14{,}2)^2}$', options: ['14,2', '$-14{,}2$'], correct: 0, correction: '14,2 عدد موجب' },
        { label: '$\\sqrt{(-3{,}5)^2}$', options: ['$-3{,}5$', '3,5'], correct: 1, correction: '$(-3{,}5)^2 = 3{,}5^2$ و 3,5 موجب' },
        { label: '$\\sqrt{\\pi^2}$', options: ['$\\pi$', '$-\\pi$'], correct: 0, correction: '$\\pi$ عدد موجب' },
        { label: '$\\sqrt{(3 - \\pi)^2}$', options: ['$3 - \\pi$', '$\\pi - 3$'], correct: 1, correction: '$3 - \\pi$ سالب، و $\\pi - 3$ موجب' },
        { label: '$\\sqrt{(\\pi - 5)^2}$', options: ['$5 - \\pi$', '$\\pi - 5$'], correct: 0, correction: '$\\pi - 5$ سالب، و $5 - \\pi$ موجب' },
        { label: '$\\sqrt{(\\pi - 2)^2}$', options: ['$2 - \\pi$', '$\\pi - 2$'], correct: 1, correction: '$\\pi - 2$ موجب' },
      ],
      explain: 'كما في الطريقة (جـ): $\\sqrt{a^2} = a$ عندما $a \\geq 0$. العدد $3 - \\pi$ سالب، و $(3 - \\pi)^2 = (\\pi - 3)^2$ مع $\\pi - 3$ موجب، إذن $\\sqrt{(3 - \\pi)^2} = \\pi - 3$.',
    },
    commonError: 'كتابة $\\sqrt{(3 - \\pi)^2} = 3 - \\pi$، مع أنّ العدد $3 - \\pi$ سالب والجذر التربيعي عدد موجب؛ الصحيح $\\sqrt{(3 - \\pi)^2} = \\pi - 3$.',
  },
];

/** دوري الآن 1 (p. 23) — l'application directe de la طريقة (جـ). */
export const NOW_EXERCISE = {
  id: 'now-23-1', source: src('now-23-1', 23, 'دوري الآن', 1), learningPointId: LP.P3, difficulty: 'difficile',
  statement: 'احسب ما يلي: $\\sqrt{(3{,}301 - \\pi)^2} + \\sqrt{(3{,}141 - \\pi)^2}$ .',
  interaction: 'numeric',
  question: {
    prompt: 'اكتب الناتج (كتابة عشرية):',
    expected: 0.16, display: '0,16',
    explain: '$3{,}301 - \\pi$ موجب و $3{,}141 - \\pi$ سالب، إذن المجموع يساوي $(3{,}301 - \\pi) + (\\pi - 3{,}141) = 0{,}16$.',
  },
  method: 'نحدّد إشارة العدد داخل المربع قبل حذف الجذر: $\\sqrt{a^2} = a$ عندما $a \\geq 0$.',
  commonError: 'كتابة $\\sqrt{(3{,}141 - \\pi)^2} = 3{,}141 - \\pi$ مع أنّ $3{,}141 - \\pi$ سالب.',
};

export const EX = Object.fromEntries([...EXERCISES, NOW_EXERCISE].map((e) => [e.id, e]));
