import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'ikhtizal', type: 'methodes', title: 'اختزال كسر',
        // « أتوقّع القاعدة » : ce que l'élève conclut de la recette 84/48 avant de lire la méthode.
        predictPrompt: 'في الوصفة وزّعتَ 84 ملعقة سكّر و 48 كوب دقيق على حصص متماثلة حتى وصلت إلى $\\frac{7}{4}$، كما فعل سمير بالعددين 4 ثم 3. أيّ عدد يصلح للقسمة في كل خطوة، وماذا يحدث لقيمة الكسر؟ اكتب طريقة الاختزال بكلماتك.',
        summary: 'نقسم البسط والمقام على قاسم مشترك لهما؛ قيمة الكسر لا تتغيّر.',
        body: <p>طريقة سمير: <MathText>{'$\\dfrac{84}{48} = \\dfrac{84 \\div 4}{48 \\div 4} = \\dfrac{21}{12} = \\dfrac{21 \\div 3}{12 \\div 3} = \\dfrac{7}{4}$'}</MathText>. كل قسمة على قاسم مشترك اختزال.</p> },
      { id: 'kasr-ghayr-qabil', type: 'concepts', title: 'كسر غير قابل للاختزال',
        predictPrompt: 'في الوصفة استطعت أن توزّع $\\frac{21}{12}$ على حصص متماثلة أصغر، أمّا $\\frac{7}{4}$ فلم تستطع. ماذا يميّز العددين 7 و 4 عن العددين 21 و 12؟ اكتب بكلماتك متى نقول إنّ كسرًا غير قابل للاختزال، بدلالة بسطه ومقامه.',
        summary: 'بسطه ومقامه أوليان فيما بينهما (PGCD = 1).',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.definition}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[0]}</MathText></p></div> },
    ],
    2: [
      { id: 'ikhtizal-bil-pgcd', type: 'methodes', title: 'الاختزال بـ PGCD في خطوة واحدة',
        predictPrompt: 'في المناولة وصلتَ من $\\frac{84}{48}$ إلى $\\frac{7}{4}$ بقسمة واحدة: على أيّ عدد قسمت، وما علاقته بالعددين 84 و 48؟ اكتب طريقة تكتب بها أيّ كسر على الشكل غير القابل للاختزال في خطوة واحدة.',
        summary: 'نقسم البسط والمقام على قاسمهما المشترك الأكبر.',
        body: <div className="space-y-2"><p><MathText>{KNOWLEDGE.remark}</MathText></p><p><MathText>{METHOD.rule}</MathText></p><p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[1]}</MathText></p></div> },
      { id: 'tahaqquq-al-ikhtizal', type: 'memoriser', title: 'كيف أتأكد أنني انتهيت؟',
        predictPrompt: 'في السؤال السابق كان $\\frac{2}{3}$ هو الجواب، لا $\\frac{14}{21}$ ولا $\\frac{4}{6}$. بعد كل اختزال، كيف تتأكّد أنّك انتهيت ولا تحتاج إلى خطوة أخرى؟ جرّب على هذه الكسور الثلاثة، ثم اكتب الاختبار الذي تجريه على البسط والمقام.',
        summary: 'الكسر غير قابل للاختزال عندما يكون PGCD(البسط ; المقام) = 1.',
        body: <p>بعد الاختزال، نتحقق: هل بسط الكسر ومقامه أوليان فيما بينهما؟ إن نعم فقد انتهينا؛ وإلا نواصل.</p> },
    ],
  },
};
