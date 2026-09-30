import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD_SIMPLIFY, METHOD_RATIONALIZE, TILING } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 5 — SOURCE UNIQUE, construite à partir des deux
 * encadrés « طريقة » de la page 25 (content/textbook.js). Une
 * <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 *
 *   module 1  kitaba-a-jidhr-b  la première طريقة, nommée après le carré dallé
 *   module 2  tabsit-tawzii     la seconde طريقة (la خاصية التوزيعية)
 *   module 3  naqt-maqam        la طريقة « نسبة مقامها عدد غير ناطق »
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'kitaba-a-jidhr-b', type: 'methodes', title: 'أبسط كتابة لجذر: b أصغر ما يمكن',
        summary: 'لكتابة $\\sqrt{n}$ على الشكل $a\\sqrt{b}$ حيث $b$ أصغر ما يمكن، نبحث عن أكبر مربع $a^2$ يقسم $n$، فيكون $n = a^2 \\times b$.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.simplest}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{TILING.example}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tabsit-tawzii', type: 'methodes', title: 'جمع جذور متشابهة بالخاصية التوزيعية',
        summary: '$x\\sqrt{b} + y\\sqrt{b} + z\\sqrt{b} = (x + y + z)\\sqrt{b}$',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.distributive}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD_SIMPLIFY.solution[1]}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'naqt-maqam', type: 'methodes', title: 'نسبة مقامها عدد ناطق',
        summary: 'لتحويل $\\dfrac{a}{\\sqrt{b}}$ إلى نسبة مقامها عدد ناطق، نضرب البسط والمقام في $\\sqrt{b}$.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD_RATIONALIZE.method}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD_RATIONALIZE.solution[0]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
