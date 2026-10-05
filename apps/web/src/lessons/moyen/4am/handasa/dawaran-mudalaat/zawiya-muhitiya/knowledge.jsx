import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { SourceTag } from '../../../../../common/textbook';
import { ACTIVITY, ACTIVITY_LINES, KNOW4, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « الزاوية المحيطية والزاوية المركزية والعلاقة بينهما » — SOURCE UNIQUE.
 *
 *   module 1 (نشاط 4)   tasmiya — la زاوية مركزية et la زاوية محيطية qui « تحصران نفس القوس » (les mots du نشاط 4) ;
 *                       alaqa-nashat — AOB = 2 ADB : prouvé pour un diamètre (مزيان), vrai pour deux cordes quelconques (هوارية) ;
 *   module 2 (معارف 4)  tarif (les deux définitions), khassiya-nisf (خاصية 1), khassiya-tasawi (خاصية 2) ;
 *   module 3 (طريقة)    tariqa-qaws (trouver un angle par l'arc — plateforme, déclaré), qutr-qaima (le cas du diamètre).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'tasmiya', type: 'concepts', title: 'زاوية مركزية وزاوية محيطية',
        summary: 'الزاوية AOB رأسها مركز الدائرة: زاوية مركزية. الزاوية ADB رأسها D من الدائرة وضلعاها وتران: زاوية محيطية. نقول إنهما تحصران نفس القوس AB.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{ACTIVITY.naming}</MathText></p>
            <SourceTag source={ACTIVITY.source} />
          </div>
        ),
      },
      {
        id: 'alaqa-nashat', type: 'regles', title: 'المركزية ضعف المحيطية',
        summary: 'قول مزيان صحيح: إذا كان [AD] قطرا فإن AOB ضعف ADB؛ وهوارية على صواب: تبقى العلاقة صحيحة مهما كان موضع D على الدائرة خارج القوس الملونة.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{ACTIVITY_LINES.deduce}</MathText></p>
            <p><MathText>{ACTIVITY.closing}</MathText></p>
            <SourceTag source={ACTIVITY_LINES.source} />
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tarif', type: 'concepts', title: 'تعريف الزاويتين',
        summary: 'الزاوية المركزية في دائرة رأسها المركز O؛ والزاوية المحيطية رأسها ينتمي إلى الدائرة وضلعاها يقطعان الدائرة.',
        body: (
          <div className="space-y-1.5">
            <p>{KNOW4.definitionIntro}</p>
            <ul className="list-disc space-y-0.5 ps-5">
              <li>{KNOW4.central}</li>
              <li>{KNOW4.inscribed}</li>
            </ul>
            <SourceTag source={KNOW4.source} />
          </div>
        ),
      },
      {
        id: 'khassiya-nisf', type: 'regles', title: 'المحيطية نصف المركزية',
        summary: 'قيس الزاوية المحيطية في دائرة هو نصف قيس الزاوية المركزية التي تحصر معها نفس القوس.',
        body: (
          <div className="space-y-1.5">
            <p>{KNOW4.property1}</p>
            <p><MathText>{KNOW4.example2}</MathText></p>
            <SourceTag source={KNOW4.source} />
          </div>
        ),
      },
      {
        id: 'khassiya-tasawi', type: 'regles', title: 'محيطيتان تحصران نفس القوس',
        summary: 'إذا كانت زاويتان محيطيتان في دائرة تحصران القوس نفسه فهما متقايستان.',
        body: (
          <div className="space-y-1.5">
            <p>{KNOW4.property2}</p>
            <p><MathText>{KNOW4.example3}</MathText></p>
            <SourceTag source={KNOW4.source} />
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqa-qaws', type: 'methodes', title: 'من القوس إلى الزاوية',
        summary: 'أحدد رأس الزاوية (مركزية أو محيطية أو غير ذلك)، ثم القوس الذي تحصره، ثم زاوية معلومة تحصر نفس القوس: المحيطية نصف المركزية، والمحيطيتان متقايستان.',
        body: (
          <div className="space-y-1.5">
            <ol className="list-decimal space-y-0.5 ps-5">{METHOD.steps.map((l) => <li key={l}>{l}</li>)}</ol>
            <SourceTag source={METHOD.source} />
          </div>
        ),
      },
      {
        id: 'qutr-qaima', type: 'regles', title: 'حالة القطر',
        summary: 'إذا كان [BC] قطرا فالزاوية BOC مستقيمة قيسها 180 درجة، وكل زاوية محيطية BAC تحصر نصف الدائرة قيسها 90 درجة.',
        body: (
          <div className="space-y-1.5">
            <p><MathText>{METHOD.diameter}</MathText></p>
            <SourceTag source={METHOD.source} />
          </div>
        ),
      },
    ],
  },
};
