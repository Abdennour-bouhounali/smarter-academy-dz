import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'awwaliyan-taarif', type: 'concepts', title: 'عددان أوليان فيما بينهما', summary: 'قاسمهما المشترك الأكبر يساوي 1؛ نكتب PGCD(a ; b) = 1.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.definition}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.example}</MathText></p></div> },
      { id: 'nafy-awwaliyan', type: 'methodes', title: 'لنفي أنهما أوليان فيما بينهما', summary: 'يكفي إظهار قاسم مشترك يختلف عن 1 (قواعد قابلية القسمة تساعد).',
        body: <p>27 و 36 ليسا أوليين فيما بينهما لأن 9 يقسمهما معًا: PGCD(27 ; 36) = 9 ≠ 1.</p> },
    ],
    2: [
      { id: 'ithbat-awwaliyan', type: 'methodes', title: 'لإثبات أنهما أوليان فيما بينهما', summary: 'نحسب PGCD (بالحصر أو بخوارزمية إقليدس) ونجده 1.',
        body: <p>نبيّن أن القاسم المشترك الأكبر يساوي 1: بحصر القواسم للأعداد الصغيرة، وبخوارزمية إقليدس للأعداد الكبيرة (آخر باقٍ غير معدوم هو 1).</p> },
      { id: 'laysa-awwali', type: 'memoriser', title: 'أوليان فيما بينهما ≠ عددان أوليان', summary: '15 و 22 أوليان فيما بينهما وليس أيّ منهما أوليًا.',
        body: <p>«أوليان فيما بينهما» صفة للزوج لا لكل عدد: 15 = 3 × 5 و 22 = 2 × 11 ليسا أوليين، ومع ذلك PGCD(15 ; 22) = 1.</p> },
    ],
  },
};
