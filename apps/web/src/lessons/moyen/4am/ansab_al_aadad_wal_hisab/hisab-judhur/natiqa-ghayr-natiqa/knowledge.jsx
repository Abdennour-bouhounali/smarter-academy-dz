import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, QIMA_MUQARRABA } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 2 de l'unité 2 — SOURCE UNIQUE, construite depuis
 * content/textbook.js (معارف 2 p. 22, et le rappel des valeurs approchées).
 *
 *   module 1  murabba-natiq    1er résultat de معارف 2 et l'exemple 25/9 — nommé après le geste
 *                              (نشاط 2 : les racines tombées sur une graduation)
 *   module 2  ghayr-natiq      2e résultat de معارف 2 et l'exemple √6
 *   module 3  qima-muqarraba   rappel (années antérieures) : بالنقصان / بالزيادة / المدوّر
 */
const [resNatiq, resGhayr] = KNOWLEDGE.results;
const [exNatiq, exGhayr] = KNOWLEDGE.examples;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'murabba-natiq', type: 'regles', title: 'جذر مربع عدد ناطق',
        predictPrompt: 'على المسطرة وقع ضلع المربّع على تدريجة للمساحات 9 و 0,25 و $\\frac{16}{9}$ (الأضلاع 3 و $\\frac{1}{2}$ و $\\frac{4}{3}$)، ولم يقع على أيّ تدريجة للمساحات 7 و 6 و 13. ما الذي يميّز العدد $a$ تحت الجذر في الصنف الأول؟ اكتب بكلماتك متى يكون $\\sqrt{a}$ عددًا ناطقًا.',
        summary: 'إذا كان a مربعًا لعدد ناطق فإن الجذر التربيعي لـ a عدد ناطق.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.text}</MathText></p>
            <p><MathText>{resNatiq}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{exNatiq}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'ghayr-natiq', type: 'regles', title: 'جذر عدد ليس مربعًا لعدد ناطق',
        predictPrompt: 'في النشاط لم يقع $\\sqrt{7}$ ولا $\\sqrt{6}$ ولا $\\sqrt{13}$ على أيّ تدريجة، حتى مع الأجزاء من 12، ولا تجد عددًا ناطقًا مربعه 7 أو 6 أو 13. ماذا تستنتج عن نوع العدد $\\sqrt{a}$ في هذه الحالة؟ اكتب القاعدة بكلماتك.',
        summary: 'إذا لم يكن a مربعًا لعدد ناطق فإن الجذر التربيعي لـ a ليس عددًا ناطقًا.',
        body: (
          <div className="space-y-2">
            <p><MathText>{resGhayr}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{exGhayr}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'qima-muqarraba', type: 'methodes', title: 'القيم المقرّبة والمدوّر',
        predictPrompt: 'في «معارف» عرضت الحاسبة للعدد $\\sqrt{2}$ القيمة 1,414213562، وهي ليست قيمته المضبوطة. بين أيّ عددين عشريين متتاليين برقمين بعد الفاصلة يقع $\\sqrt{2}$؟ أيّهما تسمّيه القيمة المقرّبة بالنقصان، وأيّهما بالزيادة، وكيف تختار المدوّر؟ اكتب الطريقة.',
        summary: 'القيمة المقرّبة بالنقصان والقيمة المقرّبة بالزيادة تحصران العدد؛ المدوّر أقربهما إليه.',
        body: (
          <div className="space-y-2">
            <p><MathText>{QIMA_MUQARRABA.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{QIMA_MUQARRABA.example}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{QIMA_MUQARRABA.rule}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
