import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, PROOF } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** `memo` — la FICHE DE MÉMOIRE (MemoCard) : ce qui CHANGE est en rouge (`R`). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

const [p1, p2] = KNOWLEDGE.properties;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'qasim-mushtarak-rappel', type: 'vocabulaire', title: 'تذكير: n يقسم a',
        memo: {
          rule: `n\\mid a\\Leftrightarrow a=n\\times${R('q')}`,
          hook: 'القسمة تعني وجود حاصل طبيعي',
          example: `5\\mid35\\Leftrightarrow35=5\\times${R('7')}`,
          trap: 'قلب اتجاه العبارة بين القاسم والمقسوم',
          exam: 'اكتب العدد جداء القاسم في عدد طبيعي',
          chip: `n\\mid a`,
          quiz: [
            { q: '$7$ يقسم $42$ لأنّ:', options: ['$7=42\\times6$', '$42+7=49$', '$42=7\\times6$'], correct: 2 },
            { q: 'أيّ عبارة صحيحة؟', options: ['$24$ يقسم $6$', '$6$ يقسم $24$', '$6$ يقسم $25$'], correct: 1 },
          ],
        }, summary: 'n يقسم a معناه a = n × q مع q عدد طبيعي.',
        body: <p>من الدرس 1: القول إنّ <MathText>{'$n$'}</MathText> يقسم <MathText>{'$a$'}</MathText> معناه يوجد عدد طبيعي <MathText>{'$q$'}</MathText> حيث <MathText>{'$a = n \\times q$'}</MathText>.</p> },
    ],
    2: [
      { id: 'khassiya-1', type: 'regles', title: 'خاصية 1: المجموع، الفرق، المضاعفات',
        memo: {
          rule: `\\begin{gathered}n\\mid a,\\ n\\mid b\\\\ \\Rightarrow n\\mid(a${R('\\pm')}b)\\end{gathered}`,
          hook: 'قاسم الجزأين يقسم المجموع والفرق',
          example: `5\\mid35,\\ 5\\mid15\\Rightarrow5\\mid(35${R('+')}15)`,
          trap: 'تعميمها على قاسم أحد العددين فقط',
          exam: 'اذكر أنّ العدد يقسم كلًّا منهما ثم استنتج',
          chip: `n\\mid a,b\\Rightarrow n\\mid a${R('\\pm')}b`,
          quiz: [
            { q: '$5\\mid35$ و $5\\mid15$ إذن $5$ يقسم:', options: ['$35-15$', '$35+15+1$', '$35\\div15$'], correct: 0 },
            { q: 'إذا كان $4$ يقسم $a$ فإنّ $4$ يقسم:', options: ['$a+1$', '$a\\div2$', '$7\\times a$'], correct: 2 },
          ],
        },
        predictPrompt: 'في الورشة كان $n$ يقسم طولَي الجدارين $a$ و $b$ (مثلًا 5 يقسم 35 و 15). اكتب الخاصية بكلماتك: ماذا يقسم $n$ أيضًا حين تُلصق الجدارين أو تنزع أحدهما من الآخر؟ وماذا عن جدار طوله $7 \\times a$؟', summary: 'قاسم مشترك لعددين يقسم مجموعهما وفرقهما؛ قاسم عدد يقسم كل مضاعف له.',
        body: <div className="space-y-2"><p><MathText>{p1.text}</MathText></p><p className="text-sm text-slate-600"><MathText>{p1.example}</MathText></p></div> },
      { id: 'khassiya-2', type: 'regles', title: 'خاصية 2: باقي القسمة',
        memo: {
          rule: `\\begin{gathered}n\\mid a,\\ n\\mid b,\\ a=bq+${R('r')}\\\\ \\Rightarrow n\\mid${R('r')}\\end{gathered}`,
          hook: 'يقسم الباقي أيضًا',
          example: `35=15\\times2+${R('5')}\\Rightarrow5\\mid${R('5')}`,
          trap: 'نسيان أنّ الباقي يقسمه القاسم نفسه',
          exam: 'اكتب القسمة الإقليدية ثم استنتج أنّ القاسم يقسم الباقي',
          chip: `n\\mid a,b\\Rightarrow n\\mid${R('r')}`,
          quiz: [
            { q: '$56=21\\times2+14$ و $7\\mid56$ و $7\\mid21$ إذن $7$ يقسم:', options: ['$2$', '$14$', '$35$'], correct: 1 },
            { q: 'قاسم مشترك لـ $a$ و $b$ يقسم أيضًا:', options: ['حاصل قسمة $a$ على $b$', '$a+b+1$', 'باقي قسمة $a$ على $b$'], correct: 2 },
          ],
        },
        predictPrompt: 'في الورشة قِست جدار $a$ بألواح طولها $b$ فبقي في الطرف جزء: مع 35 و 15 بقي 5، ومع 56 و 21 بقي 14. إذا كان $n$ يقسم كلًّا من $a$ و $b$، ماذا تتوقّع لهذا الجزء الباقي؟ اكتب الخاصية بكلماتك مستعملًا القسمة الإقليدية للعدد $a$ على $b$.', summary: 'قاسم مشترك لعددين يقسم باقي القسمة الإقليدية لأحدهما على الآخر.',
        body: <div className="space-y-2"><p><MathText>{p2.text}</MathText></p><p className="text-sm text-slate-600"><MathText>{p2.example}</MathText></p></div> },
    ],
    3: [
      { id: 'burhan-idha-fainna', type: 'methodes', title: 'كيف أبرهن «إذا … فإنّ …»؟',
        memo: {
          rule: `${R('P')}\\ \\text{vraie}\\ \\Rightarrow\\ Q\\ \\text{vraie}`,
          hook: 'نفرض الشرط ونصل إلى النتيجة',
          example: `${R('5\\mid a,\\ 5\\mid b')}\\Rightarrow5\\mid a+b`,
          trap: 'البدء من النتيجة المطلوبة بدل الشرط',
          exam: 'ابدأ بنفرض ثم تدرّج في الخطوات واختم بما طُلب',
          chip: `${R('P')}\\Rightarrow Q`,
          quiz: [
            { q: 'في برهان «إذا … فإنّ …» نبدأ بـ:', options: ['فرض أنّ النتيجة محققة', 'فرض أنّ الشرط محقق', 'التحقق بأعداد خاصة'], correct: 1 },
            { q: 'التحقق بالأعداد (مثل $5\\mid35$ و $5\\mid15$) يكفي لإثبات الخاصية العامة؟', options: ['نعم، إذا جربنا ثلاثة أمثلة', 'نعم، إذا كانت الأعداد صغيرة', 'لا، لأنه مثال وليس برهانًا'], correct: 2 },
          ],
        },
        predictPrompt: 'في البرهان الذي قرأته: ما الذي استعملناه في البداية دون أن نتحقّق منه، وما الذي وصلنا إليه في آخر سطر؟ لو طُلب منك أن تبرهن خاصية أخرى من الشكل «إذا … فإنّ …»، كيف تبدأ وإلى أين تصل؟ اكتب الطريقة بكلماتك.', summary: 'نفرض صحة الشرط ونتأكد من صحة النتيجة.', body: <p><MathText>{PROOF.rule[0]}</MathText></p> },
      { id: 'ithbat-qasim', type: 'methodes', title: 'لإثبات أن d يقسم m',
        memo: {
          rule: `m=d\\times${R('k')}\\Rightarrow d\\mid m`,
          hook: 'اكتب العدد جداء فيه القاسم',
          example: `a+b=5\\times${R('(p+q)')}\\Rightarrow5\\mid a+b`,
          trap: 'الاكتفاء بالتحقق على أعداد خاصة',
          exam: 'اكتب العدد جداء القاسم في عدد طبيعي ثم اختم',
          chip: `m=d\\times${R('k')}`,
          quiz: [
            { q: 'لإثبات أنّ $d$ يقسم $m$ يكفي أن نجد:', options: ['$m>d$', 'عددًا طبيعيًا $k$ حيث $m=d\\times k$', 'عددًا طبيعيًا $k$ حيث $d=m\\times k$'], correct: 1 },
            { q: 'إذا كان $a=5p$ و $b=5q$ فإنّ $a+b=$', options: ['$5pq$', '$5p+q$', '$5(p+q)$'], correct: 2 },
          ],
        },
        predictPrompt: 'في الورشة تحقّقت بالأعداد؛ أمّا هنا فـ $n$ و $a$ و $b$ حروف لا نعرف قيمها، والمطلوب أن نثبت أنّ $n$ يقسم $a + b$. بكلماتك: ما الذي يكفي أن تجده لتُثبت أنّ عددًا $d$ يقسم عددًا $m$؟', summary: 'يكفي إيجاد عدد طبيعي k حيث m = d × k.', body: <p><MathText>{PROOF.rule[1]}</MathText></p> },
    ],
  },
};
