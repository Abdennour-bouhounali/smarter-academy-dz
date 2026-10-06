import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE_3, KNOWLEDGE_4 } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'qawasim-mushtaraka', type: 'concepts', title: 'القواسم المشتركة لعددين',
        predictPrompt: 'في الباقات: مع 9 باقات دخلت كل الزهور، الحمراء (90) والبيضاء (54)؛ ومع 5 باقات دخلت كل الحمراء لكن بقيت 4 زهور بيضاء خارجها. متى نقول إنّ عددًا قاسم «مشترك» لعددين $a$ و $b$؟ اكتب القاعدة بكلماتك.', summary: 'الأعداد غير المعدومة التي تقسم العددين في آن واحد.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE_3.definition}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE_3.example}</MathText></p></div> },
    ],
    2: [
      { id: 'pgcd-taarif', type: 'concepts', title: 'القاسم المشترك الأكبر',
        predictPrompt: 'مع 90 و 54 كان أكبر عدد ممكن من الباقات 18، ومع 28 و 42 كشفت القواسم المشتركة 1 ، 2 ، 7 ، 14. كيف تعرّف «القاسم المشترك الأكبر» لعددين $a$ و $b$؟ اكتب التعريف بكلماتك.', summary: 'أكبر قاسم مشترك لعددين؛ الرمز PGCD (a ; b).',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE_4.definition}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE_4.example}</MathText></p></div> },
      { id: 'pgcd-ramz', type: 'vocabulaire', title: 'الرمز PGCD (a ; b)', summary: 'نكتب PGCD(28 ; 42) = 14.',
        body: <p>الرمز <MathText>{'$\\mathrm{PGCD}(a\\ ;\\ b)$'}</MathText> يُقرأ «القاسم المشترك الأكبر للعددين a و b». مثال: <MathText>{'$\\mathrm{PGCD}(28\\ ;\\ 42) = 14$'}</MathText>.</p> },
      { id: 'qawasim-al-pgcd', type: 'regles', title: 'القواسم المشتركة هي قواسم PGCD',
        predictPrompt: 'القواسم المشتركة للعددين 28 و 42 هي 1 ، 2 ، 7 ، 14، و $\\mathrm{PGCD}(28\\ ;\\ 42) = 14$. ما العلاقة بين كل عدد من هذه القائمة والعدد 14؟ وهل تجد العلاقة نفسها مع 90 و 54 (القواسم المشتركة 1 ، 2 ، 3 ، 6 ، 9 ، 18)؟ اكتب القاعدة.', summary: 'مجموعة القواسم المشتركة لعددين = مجموعة قواسم قاسمهما المشترك الأكبر.',
        body: <p><MathText>{KNOWLEDGE_4.remark}</MathText></p> },
    ],
  },
};
