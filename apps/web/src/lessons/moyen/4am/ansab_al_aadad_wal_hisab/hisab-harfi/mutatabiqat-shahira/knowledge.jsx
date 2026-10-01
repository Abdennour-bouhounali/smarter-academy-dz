import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, ACTIVITY_B, ACTIVITY_C, KNOWLEDGE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « المتطابقات الشهيرة » — SOURCE UNIQUE, construite
 * à partir de معارف 2 (content/textbook.js). Une <KnowledgeBrick> dans un
 * module et la carte rendent le même objet.
 *
 *   محور 1  murabba-majmu, hisab-mutamaan, murabba-farq — établies par
 *           l'activité 2 (1) et 2) : le terrain carré, les chaînes « انقل وأكمل »,
 *           le calcul mental 21², 53², 19², 37²)
 *   محور 2  jidaa-majmu-farq — l'activité 2 (3)
 *   محور 3  mutatabiqa — la définition de معارف 2
 *   محور 4  tariqat-nashr — la طريقة p. 35
 *
 * Les `summary` restent du texte simple (carte, مذكرة) : les formules sont dans `body`.
 */
const { squareSum, squareDiff, sumDiff, examples } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'murabba-majmu', type: 'regles', title: 'مربع مجموع',
        summary: 'مربع مجموع حدّين يساوي مربع الأول زائد ضعف جداء الحدّين زائد مربع الثاني.',
        body: (
          <div className="space-y-2">
            <p><MathText>{squareSum.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{examples[0]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hisab-mutamaan', type: 'methodes', title: 'الحساب الذهني بمتطابقة',
        summary: 'نكتب العدد مجموعًا أو فرقًا لعدد مدوّر وعدد صغير، ثم نستعمل متطابقة شهيرة فنحسب دون وضع العملية.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY.questions[4]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'$21^2 = (20 + 1)^2 = 400 + 40 + 1 = 441$'}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'$19^2 = (20 - 1)^2 = 400 - 40 + 1 = 361$'}</MathText></p>
          </div>
        ),
      },
      {
        id: 'murabba-farq', type: 'regles', title: 'مربع فرق',
        summary: 'مربع فرق حدّين يساوي مربع الأول ناقص ضعف جداء الحدّين زائد مربع الثاني.',
        body: (
          <div className="space-y-2">
            <p><MathText>{squareDiff.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{examples[1]}</MathText></p>
            <p className="text-xs text-slate-500"><MathText>{ACTIVITY_B.closing}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'jidaa-majmu-farq', type: 'regles', title: 'جداء مجموع حدين وفرقهما',
        summary: 'جداء مجموع حدّين في فرقهما يساوي مربع الأول ناقص مربع الثاني.',
        body: (
          <div className="space-y-2">
            <p><MathText>{sumDiff.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{examples[2]}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'$105 \\times 95 = (100 + 5)(100 - 5) = 10\\,000 - 25 = 9975$'}</MathText></p>
            <p className="text-xs text-slate-500"><MathText>{ACTIVITY_C.closing}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'mutatabiqa', type: 'concepts', title: 'المتطابقة',
        summary: KNOWLEDGE.identity,
        body: (
          <div className="space-y-2">
            <p>{KNOWLEDGE.identity}</p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.remarkable}</MathText></p>
            <ul className="text-sm text-slate-700 list-disc ms-5 space-y-1">
              {[squareSum, squareDiff, sumDiff].map((p) => <li key={p.title}>{p.title}: <MathText>{p.text}</MathText></li>)}
            </ul>
          </div>
        ),
      },
    ],
    4: [
      {
        id: 'tariqat-nashr', type: 'methodes', title: 'نشر عبارة بمتطابقة شهيرة',
        summary: METHOD.rule,
        body: (
          <div className="space-y-2">
            <p>{METHOD.rule}</p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.solution[0]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
