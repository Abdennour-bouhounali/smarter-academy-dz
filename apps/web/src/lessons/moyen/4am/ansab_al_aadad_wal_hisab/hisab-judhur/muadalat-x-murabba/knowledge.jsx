import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 3 (unité 2) — SOURCE UNIQUE, construite à partir
 * du manuel (content/textbook.js). Une <KnowledgeBrick id="…"> et la carte
 * rendent le même objet. Le `summary` est du TEXTE BRUT (la brique et la carte
 * le rendent sans MathText) : pas de `$…$` ici.
 *
 *   محور 1  murabba-mutaakisayn — la خاصية 1, NOMMÉE après le geste : l'élève
 *           vient de voir deux flèches arriver au même carré et de prouver
 *           (−b)² = b² (نشاط 3, question 1 جـ).
 *   محور 2  hulul-x2-a — la خاصية 2 (trois cas selon le signe de a).
 *   محور 3  tariqat-hall-x2 — la طريقة p. 23.
 */
const { prop1, prop2 } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'murabba-mutaakisayn', type: 'regles', title: 'عددان متعاكسان، مربع واحد',
        summary: 'لعددين متعاكسين نفس المربع: الجذر التربيعي للعدد الموجب a ومعاكسه مربع كل منهما يساوي a. ومربع أي عدد هو دائما عدد موجب.',
        body: (
          <div className="space-y-2">
            <p><MathText>{prop1.text}</MathText></p>
            <ul className="list-disc ms-5 text-sm text-slate-700">
              {prop1.aside.map((line) => <li key={line}><MathText>{line}</MathText></li>)}
            </ul>
            <p className="text-sm font-semibold text-slate-800"><MathText>{prop1.note}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'hulul-x2-a', type: 'regles', title: 'عدد الحلول حسب إشارة a',
        summary: 'عدد الحلول يتعلّق بإشارة a: حلان متعاكسان إذا كان a موجبا تماما، حل واحد هو 0 إذا كان a معدوما، ولا حل إذا كان a سالبا تماما.',
        body: (
          <div className="space-y-2">
            <p><MathText>{prop2.text}</MathText></p>
            <ul className="list-disc ms-5 space-y-1">
              {prop2.cases.map((c) => <li key={c}><MathText>{c}</MathText></li>)}
            </ul>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-hall-x2', type: 'methodes', title: 'طريقة حل المعادلة',
        summary: 'نحدد إشارة العدد a؛ إذا كان a موجبا تماما نكتب a على شكل مربع جذره التربيعي، ثم نعيّن الحلين المتعاكسين.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.rule}</MathText></p>
            <p className="text-sm text-slate-700"><MathText>{METHOD.solution[0]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
