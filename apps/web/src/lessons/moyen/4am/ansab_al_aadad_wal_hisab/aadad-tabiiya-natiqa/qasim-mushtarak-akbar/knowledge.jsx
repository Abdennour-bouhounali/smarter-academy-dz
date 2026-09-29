import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE_3, KNOWLEDGE_4 } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'qawasim-mushtaraka', type: 'concepts', title: 'القواسم المشتركة لعددين', summary: 'الأعداد غير المعدومة التي تقسم العددين في آن واحد.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE_3.definition}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE_3.example}</MathText></p></div> },
    ],
    2: [
      { id: 'pgcd-taarif', type: 'concepts', title: 'القاسم المشترك الأكبر', summary: 'أكبر قاسم مشترك لعددين؛ الرمز PGCD (a ; b).',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE_4.definition}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE_4.example}</MathText></p></div> },
      { id: 'pgcd-ramz', type: 'vocabulaire', title: 'الرمز PGCD (a ; b)', summary: 'نكتب PGCD(28 ; 42) = 14.',
        body: <p>الرمز <MathText>{'$\\mathrm{PGCD}(a\\ ;\\ b)$'}</MathText> يُقرأ «القاسم المشترك الأكبر للعددين a و b». مثال: <MathText>{'$\\mathrm{PGCD}(28\\ ;\\ 42) = 14$'}</MathText>.</p> },
      { id: 'qawasim-al-pgcd', type: 'regles', title: 'القواسم المشتركة هي قواسم PGCD', summary: 'مجموعة القواسم المشتركة لعددين = مجموعة قواسم قاسمهما المشترك الأكبر.',
        body: <p><MathText>{KNOWLEDGE_4.remark}</MathText></p> },
    ],
  },
};
