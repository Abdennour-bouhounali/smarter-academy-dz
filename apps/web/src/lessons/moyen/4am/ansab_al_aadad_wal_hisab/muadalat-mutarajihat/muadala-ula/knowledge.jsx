import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, BALANCE_LINES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 1 « حل معادلة من الدرجة الأولى بمجهول واحد » — SOURCE UNIQUE.
 * Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 1)  muadala-tarafayn — la même opération sur les deux membres donne une
 *                      équation de même solution (ce que la balance vient de faire) ;
 *   module 2 (معارف 1) hal-ax-b — la propriété du livre : ax = b, a ≠ 0, solution b/a ;
 *   module 3 (طرائق)   tariqat-hal — la méthode des deux solutions de la p. 47.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'muadala-tarafayn', type: 'concepts', title: 'العملية نفسها على الطرفين',
        summary: 'نحصل على معادلة لها الحل نفسه إذا أجرينا العملية نفسها على طرفيها: نضيف العدد نفسه أو نطرحه، أو نقسم على العدد نفسه غير المعدوم.',
        body: (
          <div className="space-y-2">
            <p><MathText>{BALANCE_LINES.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{BALANCE_LINES.fatima}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'hal-ax-b', type: 'regles', title: 'المعادلة ax = b',
        summary: 'تؤول كل معادلة من الدرجة الأولى بمجهول واحد إلى معادلة من الشكل ax يساوي b حيث a غير معدوم، وحلّها الوحيد هو حاصل قسمة b على a.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.property}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.exampleLines.solution[2]}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-hal', type: 'methodes', title: 'طريقة: حل معادلة',
        summary: 'ننقل المجاهيل إلى طرف والمعاليم إلى الطرف الآخر بإجراء العملية نفسها على الطرفين، نجمع الحدود المتشابهة، ثم نقسم على معامل المجهول.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.b.solution[2]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
