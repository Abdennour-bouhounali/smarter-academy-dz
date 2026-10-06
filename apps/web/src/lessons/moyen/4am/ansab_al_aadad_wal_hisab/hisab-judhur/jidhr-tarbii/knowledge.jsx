import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, KNOWLEDGE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « الجذر التربيعي لعدد موجب » — SOURCE UNIQUE,
 * construite à partir du manuel (content/textbook.js). Une <KnowledgeBrick id>
 * dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 1)  qima-mudbuta — l'encadré « نرمز بـ √5 … », posé après la
 *                      calculatrice et إيمان ; jidhr-taarif — la définition
 *                      générale (معارف 1), posée avant la question 3.
 *   module 2 (معارف 1) murabba-jidhr, jidhr-murabba — les deux propriétés.
 */
const [propSquareOfRoot, propRootOfSquare] = KNOWLEDGE.properties;
const [exSquareOfRoot, exRootOfSquare] = KNOWLEDGE.propertyExamples;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'qima-mudbuta', type: 'concepts', title: 'القيمة المضبوطة',
        predictPrompt: 'ربّعتَ العدد 2,236067978 الذي عرضته الحاسبة فلم تجد 5، ومع ذلك فالطول $BC$ موجود ومربّعه 5. ماذا يمثّل هذا العدد بالنسبة إلى $BC$؟ وكيف تقترح أن نكتب $BC$ دون أيّ خطأ في الأرقام؟ اكتب ما تستنتجه بكلماتك.',
        summary: 'نرمز بـ $\\sqrt{5}$ للقيمة المضبوطة للعدد الموجب الذي مربعه 5؛ العدد 2,236067978 الذي تعرضه الحاسبة قيمة مقربة له فقط، لأن مربعه لا يساوي 5.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY.box}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACTIVITY.questions[2]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'jidhr-taarif', type: 'concepts', title: 'الجذر التربيعي لعدد موجب',
        predictPrompt: 'الطول $BC$ مربّعه 5، وضلع المربّع الذي مساحته 36 طوله 6. لو أعطيناك عددًا موجبًا آخر $a$ (مثلًا 81 أو 0,49)، ما العدد الذي نرمز له بـ $\\sqrt{a}$؟ اكتب تعريفه بكلماتك، ثم كيف نقرأ هذا الرمز.',
        summary: '$a$ عدد موجب: $\\sqrt{a}$ هو العدد الموجب الذي مربعه يساوي $a$، ونقرأ «الجذر التربيعي لـ $a$».',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[0]}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'murabba-jidhr', type: 'regles', title: 'مربع الجذر التربيعي',
        predictPrompt: 'في النشاط أكملتَ $(\\sqrt{5})^2$، وهنا تحقّقتَ أنّ ضلع المربّع الذي مساحته 0,04 هو $\\sqrt{0{,}04}$. ماذا تحصل عليه دائمًا عندما تربّع الجذر التربيعي لعدد موجب $a$؟ اكتب القاعدة بمساواة.',
        summary: '$a$ عدد موجب: $(\\sqrt{a})^2 = a$.',
        body: (
          <div className="space-y-2">
            <p><MathText>{propSquareOfRoot}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{exSquareOfRoot}</MathText></p>
          </div>
        ),
      },
      {
        id: 'jidhr-murabba', type: 'regles', title: 'الجذر التربيعي لمربع',
        predictPrompt: 'في النشاط أكملتَ $\\sqrt{2^2}$ ، $\\sqrt{3^2}$ ، $\\sqrt{5^2}$. إذا كان $a$ عددًا موجبًا، كيف تكتب $\\sqrt{a^2}$ دون أن تحسب $a^2$؟ اكتب القاعدة بمساواة، واذكر الشرط على $a$.',
        summary: '$a$ عدد موجب: $\\sqrt{a^2} = a$.',
        body: (
          <div className="space-y-2">
            <p><MathText>{propRootOfSquare}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{exRootOfSquare}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
