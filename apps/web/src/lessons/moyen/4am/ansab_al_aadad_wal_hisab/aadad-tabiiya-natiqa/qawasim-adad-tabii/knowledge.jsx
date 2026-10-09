import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'jidaa-aamilayn', type: 'methodes', title: 'كتابة عدد على شكل جداء عاملين',
        predictPrompt: 'في الجدول كتبت 60 على شكل جداءات مثل $60 = 4 \\times 15$ و $60 = 6 \\times 10$. لو أعطيناك عددًا آخر، كيف تجد كل قواسمه دون أن تنسى واحدًا؟ اكتب الطريقة بكلماتك.',
        summary: 'كل كتابة a = d × e تعطي قاسمين للعدد a في آن واحد: d و e.',
        body: <div className="space-y-2"><p>لتعيين قواسم عدد، نكتبه على شكل جداء عاملين بكل الأشكال الممكنة: <MathText>{'$60 = 1 \\times 60 = 2 \\times 30 = 3 \\times 20 = 4 \\times 15 = 5 \\times 12 = 6 \\times 10$'}</MathText>.</p><p>كل عامل في هذه الجداءات قاسم للعدد 60.</p></div> },
      { id: 'qasim-rappel', type: 'vocabulaire', title: 'تذكير: قاسم عدد طبيعي', summary: 'b قاسم لـ a معناه a = b × q مع q عدد طبيعي.',
        body: <p>من الدرس 1: القول إنّ <MathText>{'$b$'}</MathText> قاسم للعدد <MathText>{'$a$'}</MathText> معناه يوجد عدد طبيعي <MathText>{'$q$'}</MathText> حيث <MathText>{'$a = b \\times q$'}</MathText>.</p> },
    ],
    2: [
      { id: 'tariqa-qawasim', type: 'methodes', title: 'طريقة: للبحث عن قواسم عدد طبيعي',
        predictPrompt: 'في مستطيلات الكتب لـ 105 ظهرت الجداءات نفسها مقلوبةً بعد حدّ معيّن، فلم يعد يظهر قاسم جديد. لو طُلب منك تعيين كل قواسم عدد آخر $a$، على أيّ الأعداد تُجري القسمة ومتى تتوقّف؟ وماذا تستنتج كلّما كان الباقي معدومًا؟ اكتب الطريقة بخطواتها.',
        summary: 'نختبر الأعداد التي مربعها ≤ a؛ كل باقٍ معدوم يعطي قاسمين.',
        body: <div className="space-y-2">{METHOD.rule.map((r) => <p key={r}><MathText>{r}</MathText></p>)}<p className="text-sm text-slate-600">مثال الكتاب: 105 محصور بين <MathText>{'$10^2$'}</MathText> و <MathText>{'$11^2$'}</MathText>، فنختبر من 1 إلى 10.</p></div> },
      { id: 'qawaid-qisma', type: 'memoriser', title: 'قواعد قابلية القسمة تُسرّع الاختبار',
        // Pas de prédiction : la ligne « في حالة الأعداد 2 ، 3 ، 4 ، 5 و 9 نطبق قواعد
        // قابلية القسمة » vient d'être lue (fin de la طريقة, étape 2 : corps de
        // `tariqa-qawasim` et boîte du manuel), et les règles sont des acquis antérieurs.
        predict: false,
        summary: 'من أجل 2 و3 و4 و5 و9 نطبق القواعد بدل إجراء القسمة.',
        body: <p>في حالة الأعداد 2 ، 3 ، 4 ، 5 و 9 نطبق قواعد قابلية القسمة (رقم الوحدات، مجموع الأرقام، الرقمان الأخيران) بدل القسمة.</p> },
    ],
  },
};
