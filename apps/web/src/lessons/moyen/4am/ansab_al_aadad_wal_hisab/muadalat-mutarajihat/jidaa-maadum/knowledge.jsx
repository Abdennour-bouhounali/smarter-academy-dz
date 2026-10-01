import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, ACTIVITY_A, KNOWLEDGE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 2 « معادلات جداء معدوم » — SOURCE UNIQUE, construite à
 * partir du manuel (content/textbook.js). Une <KnowledgeBrick id="…"> dans un module
 * et la carte rendent le même objet.
 *
 *   module 1 (نشاط 2)  khassiya-jidaa-maadum — la phrase de س 3 du نشاط (« عبّر
 *                      لغويا »), posée quand le terrain a disparu sous la main ;
 *   module 2 (معارف 2) taarif-muadala-jidaa — la définition ;
 *                      hulul-muadala-jidaa — la propriété formelle et les
 *                      solutions = celles des deux équations du premier degré ;
 *   module 3 (طرائق)   tariqat-jidaa-maadum — factoriser, puis la propriété.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'khassiya-jidaa-maadum', type: 'regles', title: 'خاصية الجداء المعدوم',
        summary: 'إذا كان جداء عاملين معدوما فإن أحد هذين العاملين على الأقل معدوم.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY_A.statement}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACTIVITY.amine.join(' ؛ ')}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'taarif-muadala-jidaa', type: 'concepts', title: 'معادلة جداء معدوم',
        summary: 'كل معادلة من الشكل (ax + b)(cx + d) = 0 حيث a و b و c و d أعداد معلومة تسمى معادلة جداء معدوم.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[0]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hulul-muadala-jidaa', type: 'regles', title: 'حلول معادلة جداء معدوم',
        summary: 'إذا كان جداء عددين معدوما فأحدهما معدوم، لذلك حلول معادلة جداء معدوم هي حلول المعادلتين من الدرجة الأولى.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.property[1]}</MathText></p>
            <p><MathText>{KNOWLEDGE.solutions}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[1]}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-jidaa-maadum', type: 'methodes', title: 'طريقة: نحلّل ثم نحلّ',
        summary: 'نحلّل الطرف الأول إلى جداء عاملين من الدرجة الأولى، ثم نطبّق خاصية الجداء المعدوم ونحلّ المعادلتين.',
        body: (
          <div className="space-y-2">
            {METHOD.steps.lines.map((line) => <p key={line}><MathText>{line}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{METHOD.solution[2]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
