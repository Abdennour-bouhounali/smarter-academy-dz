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
