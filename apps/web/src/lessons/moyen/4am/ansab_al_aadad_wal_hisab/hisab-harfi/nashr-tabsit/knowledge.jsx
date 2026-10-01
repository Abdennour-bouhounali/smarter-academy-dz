import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, PLATFORM_NOTES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « نشر وتبسيط عبارة جبرية » — SOURCE UNIQUE,
 * construite à partir du manuel (content/textbook.js, معارف 1 p. 34). Une
 * <KnowledgeBrick id> dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 1)  nashr-taarif — la définition, posée après « جداء أم
 *                      مجموع ؟ » (question 2) et avant « انشر » (question 3) ;
 *                      nashr-qawsayn — (a + b)(c + d), posée quand l'élève a
 *                      vérifié son terrain (3x − 1)(3 + x).
 *   module 2 (معارف 1) tawziiya-nashr — k(a ± b) ; tabsit — réduire.
 */
const [propSum, propDiff, propDouble] = KNOWLEDGE.properties;
const [exSimple, exDouble] = KNOWLEDGE.examples;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'nashr-taarif', type: 'concepts', title: 'نشر عبارة جداء',
        summary: 'نشر عبارة جداء يعني كتابة هذه العبارة على شكل مجموع (أو فرق).',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{PLATFORM_NOTES.classify}</MathText></p>
          </div>
        ),
      },
      {
        id: 'nashr-qawsayn', type: 'regles', title: 'نشر جداء قوسين',
        summary: 'نضرب كل حد من القوس الأول في كل حد من القوس الثاني: أربعة جداءات نجمعها.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.propertiesIntro}</MathText></p>
            <p><MathText>{propDouble}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tawziiya-nashr', type: 'regles', title: 'ضرب عدد في مجموع أو فرق',
        summary: 'نضرب العدد k في كل حد من حدّي المجموع أو الفرق، مع الإشارة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.propertiesIntro}</MathText></p>
            <p><MathText>{`${propSum} ، ${propDiff}`}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{exSimple}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tabsit', type: 'methodes', title: 'تبسيط عبارة',
        summary: 'نبسّط عبارة بحذف الأقواس (قوسان مسبوقان بإشارة ناقص تتغيّر إشارة كل حد بداخلهما)، ثم بجمع الحدود المتشابهة، أي التي لها نفس قوة x.',
        body: (
          <div className="space-y-2">
            <p className="text-sm text-slate-600"><MathText>{exDouble}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{PLATFORM_NOTES.unlike}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
