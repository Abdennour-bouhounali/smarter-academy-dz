import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { PROPERTIES, METHOD_DIFF, METHOD_EUCLID } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** `memo` — la FICHE DE MÉMOIRE (MemoCard) : ce qui CHANGE est en rouge (`R`). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

const [pd, pr] = PROPERTIES.items;
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'pgcd-farq', type: 'regles', title: 'PGCD(a ; b) = PGCD(b ; a − b)',
        memo: {
          rule: `\\begin{gathered}\\mathrm{PGCD}(a\\,;\\,b)\\\\ =\\mathrm{PGCD}(b\\,;\\,${R('a-b')})\\end{gathered}`,
          hook: 'الطرح لا يغيّر القاسم',
          example: `(252\\,;\\,140)\\to(140\\,;\\,${R('112')})`,
          trap: 'نسيان إبقاء العدد الأصغر في الزوج الجديد',
          exam: 'اكتب الزوج الجديد بعد كل طرح',
          chip: `(a\\,;\\,b)\\to(b\\,;\\,${R('a-b')})`,
          quiz: [
            { q: '$\\mathrm{PGCD}(252\\ ;\\ 140)=\\mathrm{PGCD}(140\\ ;\\ ?)$ ، العدد المطلوب:', options: ['$392$', '$112$', '$252$'], correct: 1 },
            { q: '$\\mathrm{PGCD}(48\\ ;\\ 18)=\\mathrm{PGCD}(18\\ ;\\ ?)$ ، العدد المطلوب:', options: ['$66$', '$18$', '$30$'], correct: 2 },
          ],
        },
        // « أتوقّع القاعدة » : ce que l'élève conclut des rubans 252 et 140 avant de lire la règle.
        predictPrompt: 'في الورشة قصصت الشريط 140 سم من الشريط 252 سم فبقيت قطعة 112 سم، ثم واصلت القصّ. ماذا لاحظت على القاسم المشترك الأكبر لطولي الشريطين قبل كل قصّة وبعدها؟ اكتب القاعدة بالحرفين $a$ و $b$ (مع $a \\geq b$).',
        summary: 'الطرح لا يغيّر القاسم المشترك الأكبر (a ≥ b).',
        body: <div className="space-y-1"><p><MathText>{pd.text}</MathText></p><p className="text-sm text-slate-600">لأن كل قاسم مشترك لـ a و b يقسم a − b (خاصية 1 من الدرس 3). مثال: <span dir="ltr" className="font-mono">{pd.example}</span>.</p></div> },
      { id: 'khwarizmiyat-al-furuq', type: 'methodes', title: 'خوارزمية الفروق المتتابعة',
        memo: {
          rule: `\\begin{gathered}(a\\,;\\,b)\\to\\cdots\\to(g\\,;\\,${R('0')})\\\\ \\Rightarrow \\mathrm{PGCD}=g\\end{gathered}`,
          hook: 'اطرح وكرّر حتى يظهر الصفر',
          example: `(252\\,;\\,140)\\to\\cdots\\to(28\\,;\\,${R('0')})`,
          trap: 'التوقف قبل ظهور الصفر',
          exam: 'اكتب كل سطر ثم اذكر آخر فرق غير معدوم',
          chip: `\\mathrm{PGCD}=${R('g')}`,
          quiz: [
            { q: 'نواصل الطرح إلى أن نصل إلى فرق يساوي:', options: ['$1$', '$0$', 'العدد الأصغر'], correct: 1 },
            { q: '$\\mathrm{PGCD}(252\\ ;\\ 140)$ يساوي:', options: ['$112$', '$14$', '$28$'], correct: 2 },
          ],
        },
        predictPrompt: 'مع 252 و 140 قصصت وعوّضت مرّة بعد مرّة، ثم وضعت أحد أعداد السلسلة في خانة PGCD. لو أعطيناك عددين آخرين: ماذا تطرح من ماذا؟ متى تتوقّف؟ وأيّ عدد من السلسلة هو القاسم المشترك الأكبر؟ اكتب الطريقة.',
        summary: 'نطرح الأصغر من الأكبر ونعيد؛ PGCD هو آخر فرق غير معدوم.',
        body: <p>{METHOD_DIFF.remark}</p> },
    ],
    2: [
      { id: 'pgcd-baqi', type: 'regles', title: 'PGCD(a ; b) = PGCD(b ; r)',
        memo: {
          rule: `\\begin{gathered}\\mathrm{PGCD}(a\\,;\\,b)\\\\ =\\mathrm{PGCD}(b\\,;\\,${R('r')})\\end{gathered}`,
          hook: 'الباقي يختصر عدة طرحات',
          example: `\\mathrm{PGCD}(91\\,;\\,26)=\\mathrm{PGCD}(26\\,;\\,${R('13')})`,
          trap: 'وضع حاصل القسمة بدل الباقي في الزوج الجديد',
          exam: 'اكتب القسمة الإقليدية ثم الزوج الجديد',
          chip: `(a\\,;\\,b)\\to(b\\,;\\,${R('r')})`,
          quiz: [
            { q: '$91=26\\times3+13$ إذن $\\mathrm{PGCD}(91\\ ;\\ 26)=$', options: ['$\\mathrm{PGCD}(3\\ ;\\ 13)$', '$\\mathrm{PGCD}(26\\ ;\\ 13)$', '$\\mathrm{PGCD}(26\\ ;\\ 3)$'], correct: 1 },
            { q: '$100=36\\times2+28$ ، الزوج الجديد هو:', options: ['$(36\\ ;\\ 28)$', '$(2\\ ;\\ 28)$', '$(36\\ ;\\ 2)$'], correct: 0 },
          ],
        },
        predictPrompt: 'في الطريقة طرحت 26 ثلاث مرّات متتالية: من 91 إلى 65 ثم 39 ثم 13. بأيّ عملية واحدة تنتقل مباشرة من 91 و 26 إلى 13؟ اكتب قاعدة تعوّض فيها PGCD$(a ; b)$ بالقاسم المشترك الأكبر لزوج أصغر، دون كل هذه الطرحات.',
        summary: 'r باقي قسمة a على b: القسمة تختصر عدة طرحات.',
        body: <div className="space-y-1"><p><MathText>{pr.text}</MathText></p><p className="text-sm text-slate-600">لأن كل قاسم مشترك لـ a و b يقسم الباقي (خاصية 2). مثال: <MathText>{pr.example}</MathText></p></div> },
    ],
    3: [
      { id: 'khwarizmiyat-iqlidus', type: 'methodes', title: 'خوارزمية إقليدس',
        memo: {
          rule: `\\begin{gathered}\\mathrm{PGCD}(a\\,;\\,b)=${R('r_n')}\\\\ (r_{n+1}=0)\\end{gathered}`,
          hook: 'اقسم ثم انقل الباقي',
          example: `\\mathrm{PGCD}(765\\,;\\,135)=${R('45')}`,
          trap: 'أخذ الباقي المعدوم جوابًا بدل الذي قبله',
          exam: 'اكتب القسمات واحدة تحت أخرى ثم اقرأ آخر باقٍ غير معدوم',
          chip: `\\mathrm{PGCD}=${R('r_n')}`,
          quiz: [
            { q: '$765=135\\times5+90$ ، السطر التالي يقسم:', options: ['$765$ على $90$', '$135$ على $90$', '$90$ على $135$'], correct: 1 },
            { q: 'باقيات القسمات للعددين $765$ و $135$: $90$ ثم $45$ ثم $0$. إذن PGCD يساوي:', options: ['$0$', '$90$', '$45$'], correct: 2 },
          ],
        },
        predictPrompt: 'مع 765 و 135 وضعت نسخ الشريط الأصغر على الأكبر، ونقلت ما بقي إلى السطر التالي، وأعدت إلى أن توقّفت. لو أعطيناك عددين آخرين: ماذا تقسم على ماذا في كل سطر؟ متى تتوقّف؟ وأين تقرأ القاسم المشترك الأكبر؟ اكتب الطريقة.',
        summary: 'قسمات إقليدية متتابعة؛ PGCD هو آخر باقٍ غير معدوم.',
        body: <div className="space-y-1"><p>{METHOD_EUCLID.remark}</p><p className="text-sm text-slate-600">{METHOD_EUCLID.rule}</p></div> },
      { id: 'ikhtiyar-al-tariqa', type: 'memoriser', title: 'أي طريقة أختار؟',
        memo: {
          rule: `\\begin{gathered}\\mathrm{PGCD}(765\\,;\\,135)=45\\\\ ${R('3')}\\leq8\\end{gathered}`,
          hook: 'النتيجة واحدة والخطوات تختلف',
          example: `\\mathrm{PGCD}(765\\,;\\,135)=${R('45')}`,
          trap: 'ظنّ أنّ الطريقتين تعطيان نتيجتين مختلفتين',
          exam: 'اختر إقليدس عندما يتباعد العددان',
          chip: `${R('3')}<8`,
          quiz: [
            { q: 'الطريقتان للعددين $765$ و $135$ تعطيان:', options: ['$45$ للفروق و $135$ لإقليدس', 'النتيجة نفسها $45$', '$90$ لهما معًا'], correct: 1 },
            { q: 'متى تفيد خوارزمية إقليدس أكثر؟', options: ['عندما يكون العددان متقاربين', 'عندما يكون أحدهما زوجيًا', 'عندما يكون أحد العددين أكبر بكثير من الآخر'], correct: 2 },
          ],
        },
        predictPrompt: 'لتعيين PGCD$(765 ; 135)$: كم خطوة لزمتك بالفروق المتتابعة؟ وكم قسمة بخوارزمية إقليدس؟ وهل تغيّرت النتيجة؟ ماذا تستنتج: أيّ الطريقتين تختار، ومتى؟',
        summary: 'الطريقتان تعطيان النتيجة نفسها؛ إقليدس أقل خطوات عندما تتباعد الأعداد.',
        body: <p>مع 765 و 135: ثمان خطوات بالفروق المتتابعة، ثلاث قسمات بخوارزمية إقليدس. النتيجة واحدة: 45.</p> },
    ],
  },
};
