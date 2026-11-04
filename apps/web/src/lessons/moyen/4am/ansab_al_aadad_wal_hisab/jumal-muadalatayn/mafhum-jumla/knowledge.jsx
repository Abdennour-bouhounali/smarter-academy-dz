import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, ACTIVITY_LINES, KNOWLEDGE, CASES_LINES, CHECK_METHOD, EXAMPLE_LINES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** `R(x)` : ce qui CHANGE dans la règle d'une fiche `memo`, en rouge. */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

/**
 * Les connaissances du درس 1 « مفهوم جملة معادلتين من الدرجة الأولى بمجهولين » — SOURCE UNIQUE.
 * Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 1)  jumla-nashat — « نقول أنّ … » : la jumla des 32 agents et sa ثنائية (13 ; 19) ;
 *   module 2 (معارف)   jumla-tarif (معارف 1), hall-jumla (معارف 2), ikhtibar-thunaiya (ses deux
 *                      exemples), tartib-thunaiya (la ملاحظة), halat-khassa (حالات خاصة).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'jumla-nashat', type: 'concepts', title: 'شرطان في آن واحد',
        memo: {
          rule: `\\begin{cases}ax+by=c\\\\a'x+b'y=c'\\end{cases}\\quad ${R('(x\\,;\\,y)')}`,
          hook: 'شرطان معًا في آن واحد',
          example: `\\begin{cases}x+y=32\\\\2x-y=7\\end{cases}\\ ;\\ ${R('(13\\,;\\,19)')}`,
          trap: 'الاكتفاء بثنائية تحقّق معادلة واحدة فقط',
          exam: 'عوّض الثنائية في المعادلتين واكتب النتيجة',
          chip: `${R('(13\\,;\\,19)')}\\ :\\ \\checkmark\\ \\checkmark`,
          quiz: [
            { q: 'الثنائية $(13 ; 19)$ حل للجملة $x + y = 32$ ، $2x - y = 7$ لأنها:', options: ['تحقّق المعادلتين معًا', 'تحقّق المعادلة الأولى وحدها', 'مجموع عدديها 32 فقط'], correct: 0 },
            { q: 'الثنائية $(24 ; 8)$ والجملة نفسها:', options: ['ليست حلا: تحقّق المعادلة (1) فقط', 'حل لأنها تحقّق المعادلة (1)', 'ليست حلا: لا تحقّق أيًّا من المعادلتين'], correct: 0 },
          ],
        },
        predictPrompt: 'على لوحة العمّال أضاءت اللوحتان معًا مع $(13 ; 19)$ ، أمّا $(24 ; 8)$ فأضاءت اللوحة (1) وحدها. ماذا يميّز $(13 ; 19)$ عن $(24 ; 8)$ بالنسبة إلى المعادلتين $x + y = 32$ و $2x - y = 7$ ؟ اكتب بكلماتك متى تكون ثنائية هي الجواب الذي نبحث عنه لمعادلتين بمجهولين.',
        summary: 'عددا الرجال والنساء قبل التقاعد يحقّقان المعادلتين معًا؛ نقول إنّ المعادلتين تشكّلان جملة معادلتين من الدرجة الأولى بمجهولين، وإنّ ثنائية هذين العددين حل لهذه الجملة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY.closing}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACTIVITY_LINES.check24}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'jumla-tarif', type: 'concepts', title: 'جملة معادلتين بمجهولين',
        memo: {
          rule: `\\begin{cases}${R('a')}x+${R('b')}y=${R('c')}\\\\${R("a'")}x+${R("b'")}y=${R("c'")}\\end{cases}`,
          hook: 'معادلتان بمجهولين معًا',
          example: `\\begin{cases}x+y=37\\\\20x+10y=610\\end{cases}`,
          trap: 'عدّ معادلة واحدة بمجهولين جملة',
          exam: 'اكتب المعادلتين واحدة تحت الأخرى بين قوسين كبيرين',
          chip: `ax+by=${R('c')}`,
          quiz: [
            { q: 'أيّ مما يلي جملة معادلتين من الدرجة الأولى بمجهولين؟', options: ['$x + y = 5$ و $x - y = 1$', '$x^2 + y = 5$ و $x - y = 1$', '$x + y = 5$ وحدها'], correct: 0 },
            { q: 'في الجملة $x + y = 37$ ، $20x + 10y = 610$ معاملا $x$ هما:', options: ['$1$ و $20$', '$37$ و $610$', '$1$ و $10$'], correct: 0 },
          ],
        },
        predictPrompt: 'في النشاط 1 كانت المعادلتان $x + y = 32$ و $2x - y = 7$ ، وفي التحدّي $x + y = 37$ و $20x + 10y = 610$. ماذا تشترك فيه كل هذه المعادلات في شكلها؟ اكتب شكلًا عامًا لمعادلتين كهاتين، بحروف مكان الأعداد المعلومة.',
        summary: 'جملة معادلتين من الدرجة الأولى بمجهولين معادلتان، في كل منهما المجهولان من الدرجة الأولى ومعاملاتهما والطرف الثاني أعداد معلومة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.system.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.system.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hall-jumla', type: 'concepts', title: 'حل الجملة',
        memo: {
          rule: `\\begin{cases}a${R('x_0')}+b${R('y_0')}=c\\\\a'${R('x_0')}+b'${R('y_0')}=c'\\end{cases}`,
          hook: 'نعوّض فتتحقّق المعادلتان',
          example: `\\begin{cases}13+19=32\\\\2\\times13-19=7\\end{cases}`,
          trap: 'التوقف بعد التحقق من معادلة واحدة',
          exam: 'اكتب: الثنائية حل لأنها تحقّق المعادلتين',
          chip: `x=${R('x_0')}\\,,\\ y=${R('y_0')}`,
          quiz: [
            { q: 'الثنائية $(2 ; 0)$ حل للجملة $x - y = 2$ ، $2x - 5y = 4$ لأنّ:', options: ['$2 - 0 = 2$ و $2 \\times 2 - 5 \\times 0 = 4$', '$2 - 0 = 2$ فقط', '$2 + 0 = 2$'], correct: 0 },
            { q: 'حل جملة معادلتين هو:', options: ['ثنائية تحقّق المعادلتين معًا', 'عدد يحقّق معادلة واحدة', 'كل ثنائية تحقّق إحدى المعادلتين'], correct: 0 },
          ],
        },
        summary: 'حل جملة معادلتين كل ثنائية تكون من أجلها المعادلتان محقّقتين في آن واحد، وحل الجملة يعني إيجاد كل هذه الثنائيات.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.solution.definition}</MathText></p>
            <p><MathText>{KNOWLEDGE.solution.rule}</MathText></p>
          </div>
        ),
      },
      {
        id: 'ikhtibar-thunaiya', type: 'methodes', title: 'نختبر ثنائية',
        memo: {
          rule: `x\\to${R('x_0')}\\,,\\ y\\to${R('y_0')}`,
          hook: 'عوّض ثم قارن الطرفين',
          example: `(3\\,;\\,1):\\ 2\\times3-5\\times1=${R('1\\neq4')}`,
          trap: 'الحكم من معادلة واحدة فقط',
          exam: 'اكتب التعويض في كل معادلة ثم احكم',
          chip: `x\\to${R('3')}\\,,\\ y\\to${R('1')}`,
          quiz: [
            { q: 'نختبر $(3 ; 1)$ في $x - y = 2$ ، $2x - 5y = 4$ . النتيجة:', options: ['ليست حلا: المعادلة الثانية تعطي $1 \\neq 4$', 'حل لأن $3 - 1 = 2$', 'ليست حلا: $3 - 1 \\neq 2$'], correct: 0 },
            { q: 'لاختبار ثنائية $(a ; b)$ نعوّض:', options: ['$a$ مكان $x$ و $b$ مكان $y$ في المعادلتين', '$b$ مكان $x$ و $a$ مكان $y$', 'في المعادلة الأولى فقط'], correct: 0 },
          ],
        },
        predictPrompt: 'في المثالين عوّض الكتاب الثنائيتين $(2 ; 0)$ و $(3 ; 1)$ في الجملة نفسها، فكانت الأولى حلًّا والثانية لا. لو أعطيناك ثنائية أخرى وجملة أخرى، بأيّ خطوات تتحقّق؟ اكتب الطريقة: ماذا تعوّض، وفي أيّ معادلة، ومتى تحكم بأنّها ليست حلًّا؟',
        summary: 'نعوّض المجهول الأول بالعدد الأول من الثنائية والمجهول الثاني بالعدد الثاني في كل معادلة: الثنائية حل إذا تحقّقت المعادلتان معًا، وليست حلا إذا لم تتحقّق إحداهما.',
        body: (
          <div className="space-y-2">
            <p><MathText>{CHECK_METHOD.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{EXAMPLE_LINES.yes}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{EXAMPLE_LINES.no}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tartib-thunaiya', type: 'memoriser', title: 'الترتيب في الثنائية مهم',
        memo: {
          rule: `(${R('a')}\\,;\\,${R('b')})\\neq(${R('b')}\\,;\\,${R('a')})`,
          hook: 'الترتيب مهم: الأول للمجهول الأول',
          example: `(2\\,;\\,0)\\neq(0\\,;\\,2)`,
          trap: 'كتابة العدد الثاني قبل الأول في الثنائية',
          exam: 'اكتب الثنائية بالترتيب نفسه الذي رتّبتَ به المجهولين',
          chip: `(x\\,;\\,y)\\neq(y\\,;\\,x)`,
          quiz: [
            { q: 'الثنائية $(2 ; 0)$ حل للجملة $x - y = 2$ ، $2x - 5y = 4$ . أمّا الثنائية $(0 ; 2)$ فهي:', options: ['ليست حلا: $0 - 2 \\neq 2$', 'حل أيضًا لأنّ فيها العددين نفسيهما', 'حل لأنها تحقّق المعادلة الثانية'], correct: 0 },
            { q: 'في الثنائية $(x ; y)$ العدد الأول هو:', options: ['قيمة $x$', 'قيمة $y$', 'مجموع القيمتين'], correct: 0 },
          ],
        },
        predictPrompt: 'الثنائية $(2 ; 0)$ حلّ للجملة $\\begin{cases} x - y = 2 \\\\ 2x - 5y = 4 \\end{cases}$. عوّض الثنائية $(0 ; 2)$ في المعادلتين: هل هي حلّ أيضًا؟ ماذا تستنتج عن ثنائيتين فيهما العددان نفسهما، كلٌّ في مكان الآخر؟',
        summary: 'في الثنائية العدد الأول قيمة x والعدد الثاني قيمة y: ثنائيتان بالعددين نفسهما في ترتيبين مختلفين ثنائيتان مختلفتان.',
        body: <p><MathText>{KNOWLEDGE.solution.note}</MathText></p>,
      },
      {
        id: 'halat-khassa', type: 'regles', title: 'حالات خاصة',
        memo: {
          rule: `E_2=kE_1\\Rightarrow ${R('\\infty')}`,
          hook: 'معادلة واحدة أو معادلتان متناقضتان',
          example: `\\begin{cases}x+y=2\\\\2x+2y=4\\end{cases}\\Rightarrow ${R('\\infty')}`,
          trap: 'ظنّ أنّ لكل جملة حلًّا واحدًا',
          exam: 'اختصر المعادلتين ثم حدّد: متطابقتان أم متناقضتان',
          chip: `${R('\\infty')}\\ /\\ ${R('\\varnothing')}`,
          quiz: [
            { q: 'الجملة $x + y = 2$ ، $2x + 2y = 4$ لها:', options: ['عدد غير منته من الحلول', 'حل وحيد', 'لا حل'], correct: 0 },
            { q: 'الجملة $x + y = 2$ ، $x + y = 5$ لها:', options: ['لا حل: معادلتان متناقضتان', 'حل وحيد', 'عدد غير منته من الحلول'], correct: 0 },
          ],
        },
        predictPrompt: 'في النشاط 1 كان للجملة حلّ واحد. بسّط الجملة $\\begin{cases} 4x + 6y = 2 \\\\ -2x - 3y = -1 \\end{cases}$ (اقسم الأولى على 2 واضرب الثانية في $-1$)، ثم الجملة $\\begin{cases} 2x - y = 0 \\\\ -x + \\dfrac{y}{2} = -2 \\end{cases}$ (اضرب الثانية في $-2$). ماذا تلاحظ في كل مرّة؟ كم حلًّا تتوقّع لكل جملة، ولماذا؟',
        summary: 'إذا آلت المعادلتان إلى معادلة واحدة فللجملة عدد غير منته من الحلول، وإذا آلتا إلى معادلتين متناقضتين فليس لها حلول.',
        body: (
          <div className="space-y-2">
            {KNOWLEDGE.cases.items.map((it) => <p key={it}><MathText>{it}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{CASES_LINES.unique}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
