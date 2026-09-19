import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD } from './content/textbook';
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'ikhtizal', type: 'methodes', title: 'اختزال كسر', summary: 'نقسم البسط والمقام على قاسم مشترك لهما؛ قيمة الكسر لا تتغيّر.',
        body: <p>طريقة سمير: <MathText>{'$\\dfrac{84}{48} = \\dfrac{84 \\div 4}{48 \\div 4} = \\dfrac{21}{12} = \\dfrac{21 \\div 3}{12 \\div 3} = \\dfrac{7}{4}$'}</MathText>. كل قسمة على قاسم مشترك اختزال.</p> },
      { id: 'kasr-ghayr-qabil', type: 'concepts', title: 'كسر غير قابل للاختزال', summary: 'بسطه ومقامه أوليان فيما بينهما (PGCD = 1).',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.definition}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[0]}</MathText></p></div> },
    ],
    2: [
      { id: 'ikhtizal-bil-pgcd', type: 'methodes', title: 'الاختزال بـ PGCD في خطوة واحدة', summary: 'نقسم البسط والمقام على قاسمهما المشترك الأكبر.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.remark}</MathText></p><p><MathText>{METHOD.rule}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[1]}</MathText></p></div> },
      { id: 'tahaqquq-al-ikhtizal', type: 'memoriser', title: 'كيف أتأكد أنني انتهيت؟', summary: 'الكسر غير قابل للاختزال عندما يكون PGCD(البسط ; المقام) = 1.',
        body: <p>بعد الاختزال، نتحقق: هل بسط الكسر ومقامه أوليان فيما بينهما؟ إن نعم فقد انتهينا؛ وإلا نواصل.</p> },
    ],
  },
};
