import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { RESULTS } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'tayin-bil-hasr', type: 'methodes', title: 'تعيين PGCD بحصر القواسم', summary: 'قواسم كل عدد ← القواسم المشتركة ← أكبرها.',
        body: <div className="space-y-1"><p>1) أوجد قواسم كلٍّ من العددين. 2) أوجد القواسم المشتركة. 3) أكبرها هو القاسم المشترك الأكبر.</p><p className="text-sm text-slate-600">مثال الكتاب: 42 و 60 → القواسم المشتركة 1 ، 2 ، 3 ، 6 → <MathText>{'$\\mathrm{PGCD}(42\\ ;\\ 60) = 6$'}</MathText>.</p></div> },
    ],
    2: [
      { id: 'nataij-mubashira', type: 'regles', title: 'نتائج مباشرة', summary: 'PGCD(a ; a) = a · PGCD(a ; 0) = a · PGCD(a ; b) = PGCD(b ; a).',
        body: <div className="space-y-1"><p><MathText>{RESULTS.intro}</MathText></p><ul className="list-disc ms-5">{RESULTS.items.map((it) => <li key={it}><MathText>{it}</MathText></li>)}</ul></div> },
      { id: 'pgcd-idha-qasim', type: 'regles', title: 'إذا كان b قاسمًا لـ a', summary: 'PGCD(a ; b) = b — مثال: PGCD(40 ; 8) = 8.',
        body: <p>إذا كان <MathText>{'$b$'}</MathText> قاسما للعدد <MathText>{'$a$'}</MathText> فإن <MathText>{'$\\mathrm{PGCD}(a\\ ;\\ b) = b$'}</MathText>: لا قاسم مشترك أكبر من b نفسه.</p> },
    ],
  },
};
