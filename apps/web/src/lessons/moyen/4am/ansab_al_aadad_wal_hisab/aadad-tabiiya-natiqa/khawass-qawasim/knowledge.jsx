import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, PROOF } from './content/textbook';
const [p1, p2] = KNOWLEDGE.properties;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'qasim-mushtarak-rappel', type: 'vocabulaire', title: 'تذكير: n يقسم a', summary: 'n يقسم a معناه a = n × q مع q عدد طبيعي.',
        body: <p>من الدرس 1: القول إنّ <MathText>{'$n$'}</MathText> يقسم <MathText>{'$a$'}</MathText> معناه يوجد عدد طبيعي <MathText>{'$q$'}</MathText> حيث <MathText>{'$a = n \\times q$'}</MathText>.</p> },
    ],
    2: [
      { id: 'khassiya-1', type: 'regles', title: 'خاصية 1: المجموع، الفرق، المضاعفات', summary: 'قاسم مشترك لعددين يقسم مجموعهما وفرقهما؛ قاسم عدد يقسم كل مضاعف له.',
        body: <div className="space-y-2"><p><MathText>{p1.text}</MathText></p><p className="text-sm text-slate-600"><MathText>{p1.example}</MathText></p></div> },
      { id: 'khassiya-2', type: 'regles', title: 'خاصية 2: باقي القسمة', summary: 'قاسم مشترك لعددين يقسم باقي القسمة الإقليدية لأحدهما على الآخر.',
        body: <div className="space-y-2"><p><MathText>{p2.text}</MathText></p><p className="text-sm text-slate-600"><MathText>{p2.example}</MathText></p></div> },
    ],
    3: [
      { id: 'burhan-idha-fainna', type: 'methodes', title: 'كيف أبرهن «إذا … فإنّ …»؟', summary: 'نفرض صحة الشرط ونتأكد من صحة النتيجة.', body: <p><MathText>{PROOF.rule[0]}</MathText></p> },
      { id: 'ithbat-qasim', type: 'methodes', title: 'لإثبات أن d يقسم m', summary: 'يكفي إيجاد عدد طبيعي k حيث m = d × k.', body: <p><MathText>{PROOF.rule[1]}</MathText></p> },
    ],
  },
};
