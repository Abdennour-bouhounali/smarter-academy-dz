import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { PROPERTIES, METHOD_DIFF, METHOD_EUCLID } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

const [pd, pr] = PROPERTIES.items;
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'pgcd-farq', type: 'regles', title: 'PGCD(a ; b) = PGCD(b ; a − b)', summary: 'الطرح لا يغيّر القاسم المشترك الأكبر (a ≥ b).',
        body: <div className="space-y-1"><p><MathText>{pd.text}</MathText></p><p className="text-sm text-slate-600">لأن كل قاسم مشترك لـ a و b يقسم a − b (خاصية 1 من الدرس 3). مثال: <span dir="ltr" className="font-mono">{pd.example}</span>.</p></div> },
      { id: 'khwarizmiyat-al-furuq', type: 'methodes', title: 'خوارزمية الفروق المتتابعة', summary: 'نطرح الأصغر من الأكبر ونعيد؛ PGCD هو آخر فرق غير معدوم.',
        body: <p>{METHOD_DIFF.remark}</p> },
    ],
    2: [
      { id: 'pgcd-baqi', type: 'regles', title: 'PGCD(a ; b) = PGCD(b ; r)', summary: 'r باقي قسمة a على b: القسمة تختصر عدة طرحات.',
        body: <div className="space-y-1"><p><MathText>{pr.text}</MathText></p><p className="text-sm text-slate-600">لأن كل قاسم مشترك لـ a و b يقسم الباقي (خاصية 2). مثال: <MathText>{pr.example}</MathText></p></div> },
    ],
    3: [
      { id: 'khwarizmiyat-iqlidus', type: 'methodes', title: 'خوارزمية إقليدس', summary: 'قسمات إقليدية متتابعة؛ PGCD هو آخر باقٍ غير معدوم.',
        body: <div className="space-y-1"><p>{METHOD_EUCLID.remark}</p><p className="text-sm text-slate-600">{METHOD_EUCLID.rule}</p></div> },
      { id: 'ikhtiyar-al-tariqa', type: 'memoriser', title: 'أي طريقة أختار؟', summary: 'الطريقتان تعطيان النتيجة نفسها؛ إقليدس أقل خطوات عندما تتباعد الأعداد.',
        body: <p>مع 765 و 135: ثمان خطوات بالفروق المتتابعة، ثلاث قسمات بخوارزمية إقليدس. النتيجة واحدة: 45.</p> },
    ],
  },
};
