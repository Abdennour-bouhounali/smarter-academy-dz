import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, PROOF } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

const [p1, p2] = KNOWLEDGE.properties;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'qasim-mushtarak-rappel', type: 'vocabulaire', title: 'تذكير: n يقسم a', summary: 'n يقسم a معناه a = n × q مع q عدد طبيعي.',
        body: <p>من الدرس 1: القول إنّ <MathText>{'$n$'}</MathText> يقسم <MathText>{'$a$'}</MathText> معناه يوجد عدد طبيعي <MathText>{'$q$'}</MathText> حيث <MathText>{'$a = n \\times q$'}</MathText>.</p> },
    ],
    2: [
      { id: 'khassiya-1', type: 'regles', title: 'خاصية 1: المجموع، الفرق، المضاعفات',
        predictPrompt: 'في الورشة كان $n$ يقسم طولَي الجدارين $a$ و $b$ (مثلًا 5 يقسم 35 و 15). اكتب الخاصية بكلماتك: ماذا يقسم $n$ أيضًا حين تُلصق الجدارين أو تنزع أحدهما من الآخر؟ وماذا عن جدار طوله $7 \\times a$؟', summary: 'قاسم مشترك لعددين يقسم مجموعهما وفرقهما؛ قاسم عدد يقسم كل مضاعف له.',
        body: <div className="space-y-2"><p><MathText>{p1.text}</MathText></p><p className="text-sm text-slate-600"><MathText>{p1.example}</MathText></p></div> },
      { id: 'khassiya-2', type: 'regles', title: 'خاصية 2: باقي القسمة',
        predictPrompt: 'في الورشة قِست جدار $a$ بألواح طولها $b$ فبقي في الطرف جزء: مع 35 و 15 بقي 5، ومع 56 و 21 بقي 14. إذا كان $n$ يقسم كلًّا من $a$ و $b$، ماذا تتوقّع لهذا الجزء الباقي؟ اكتب الخاصية بكلماتك مستعملًا القسمة الإقليدية للعدد $a$ على $b$.', summary: 'قاسم مشترك لعددين يقسم باقي القسمة الإقليدية لأحدهما على الآخر.',
        body: <div className="space-y-2"><p><MathText>{p2.text}</MathText></p><p className="text-sm text-slate-600"><MathText>{p2.example}</MathText></p></div> },
    ],
    3: [
      { id: 'burhan-idha-fainna', type: 'methodes', title: 'كيف أبرهن «إذا … فإنّ …»؟',
        predictPrompt: 'في البرهان الذي قرأته: ما الذي استعملناه في البداية دون أن نتحقّق منه، وما الذي وصلنا إليه في آخر سطر؟ لو طُلب منك أن تبرهن خاصية أخرى من الشكل «إذا … فإنّ …»، كيف تبدأ وإلى أين تصل؟ اكتب الطريقة بكلماتك.', summary: 'نفرض صحة الشرط ونتأكد من صحة النتيجة.', body: <p><MathText>{PROOF.rule[0]}</MathText></p> },
      { id: 'ithbat-qasim', type: 'methodes', title: 'لإثبات أن d يقسم m',
        predictPrompt: 'في الورشة تحقّقت بالأعداد؛ أمّا هنا فـ $n$ و $a$ و $b$ حروف لا نعرف قيمها، والمطلوب أن نثبت أنّ $n$ يقسم $a + b$. بكلماتك: ما الذي يكفي أن تجده لتُثبت أنّ عددًا $d$ يقسم عددًا $m$؟', summary: 'يكفي إيجاد عدد طبيعي k حيث m = d × k.', body: <p><MathText>{PROOF.rule[1]}</MathText></p> },
    ],
  },
};
