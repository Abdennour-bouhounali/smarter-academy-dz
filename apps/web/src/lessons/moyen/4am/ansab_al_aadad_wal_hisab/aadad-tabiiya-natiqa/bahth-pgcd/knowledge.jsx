import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { PROPERTIES, METHOD_DIFF, METHOD_EUCLID } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

const [pd, pr] = PROPERTIES.items;
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'pgcd-farq', type: 'regles', title: 'PGCD(a ; b) = PGCD(b ; a − b)',
        // « أتوقّع القاعدة » : ce que l'élève conclut des rubans 252 et 140 avant de lire la règle.
        predictPrompt: 'في الورشة قصصت الشريط 140 سم من الشريط 252 سم فبقيت قطعة 112 سم، ثم واصلت القصّ. ماذا لاحظت على القاسم المشترك الأكبر لطولي الشريطين قبل كل قصّة وبعدها؟ اكتب القاعدة بالحرفين $a$ و $b$ (مع $a \\geq b$).',
        summary: 'الطرح لا يغيّر القاسم المشترك الأكبر (a ≥ b).',
        body: <div className="space-y-1"><p><MathText>{pd.text}</MathText></p><p className="text-sm text-slate-600">لأن كل قاسم مشترك لـ a و b يقسم a − b (خاصية 1 من الدرس 3). مثال: <span dir="ltr" className="font-mono">{pd.example}</span>.</p></div> },
      { id: 'khwarizmiyat-al-furuq', type: 'methodes', title: 'خوارزمية الفروق المتتابعة',
        predictPrompt: 'مع 252 و 140 قصصت وعوّضت مرّة بعد مرّة، ثم وضعت أحد أعداد السلسلة في خانة PGCD. لو أعطيناك عددين آخرين: ماذا تطرح من ماذا؟ متى تتوقّف؟ وأيّ عدد من السلسلة هو القاسم المشترك الأكبر؟ اكتب الطريقة.',
        summary: 'نطرح الأصغر من الأكبر ونعيد؛ PGCD هو آخر فرق غير معدوم.',
        body: <p>{METHOD_DIFF.remark}</p> },
    ],
    2: [
      { id: 'pgcd-baqi', type: 'regles', title: 'PGCD(a ; b) = PGCD(b ; r)',
        predictPrompt: 'في طريقة الكتاب طرحت 26 ثلاث مرّات متتالية: من 91 إلى 65 ثم 39 ثم 13. بأيّ عملية واحدة تنتقل مباشرة من 91 و 26 إلى 13؟ اكتب قاعدة تعوّض فيها PGCD$(a ; b)$ بالقاسم المشترك الأكبر لزوج أصغر، دون كل هذه الطرحات.',
        summary: 'r باقي قسمة a على b: القسمة تختصر عدة طرحات.',
        body: <div className="space-y-1"><p><MathText>{pr.text}</MathText></p><p className="text-sm text-slate-600">لأن كل قاسم مشترك لـ a و b يقسم الباقي (خاصية 2). مثال: <MathText>{pr.example}</MathText></p></div> },
    ],
    3: [
      { id: 'khwarizmiyat-iqlidus', type: 'methodes', title: 'خوارزمية إقليدس',
        predictPrompt: 'مع 765 و 135 وضعت نسخ الشريط الأصغر على الأكبر، ونقلت ما بقي إلى السطر التالي، وأعدت إلى أن توقّفت. لو أعطيناك عددين آخرين: ماذا تقسم على ماذا في كل سطر؟ متى تتوقّف؟ وأين تقرأ القاسم المشترك الأكبر؟ اكتب الطريقة.',
        summary: 'قسمات إقليدية متتابعة؛ PGCD هو آخر باقٍ غير معدوم.',
        body: <div className="space-y-1"><p>{METHOD_EUCLID.remark}</p><p className="text-sm text-slate-600">{METHOD_EUCLID.rule}</p></div> },
      { id: 'ikhtiyar-al-tariqa', type: 'memoriser', title: 'أي طريقة أختار؟',
        predictPrompt: 'لتعيين PGCD$(765 ; 135)$: كم خطوة لزمتك بالفروق المتتابعة؟ وكم قسمة بخوارزمية إقليدس؟ وهل تغيّرت النتيجة؟ ماذا تستنتج: أيّ الطريقتين تختار، ومتى؟',
        summary: 'الطريقتان تعطيان النتيجة نفسها؛ إقليدس أقل خطوات عندما تتباعد الأعداد.',
        body: <p>مع 765 و 135: ثمان خطوات بالفروق المتتابعة، ثلاث قسمات بخوارزمية إقليدس. النتيجة واحدة: 45.</p> },
    ],
  },
};
