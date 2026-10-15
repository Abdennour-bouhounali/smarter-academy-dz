import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD_COMPARE } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « مقارنة الأعداد العشرية وترتيبها » (1AM) — SOURCE UNIQUE (content/textbook.js : les mots de la plateforme,
 * tirés de معارف 6 et 7, de طريقة 3 et de نشاط 5 du manuel ; rien n'est copié au mot).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'taqarun-rutab', type: 'regles', title: 'المقارنة رتبةً برتبة',
        predictPrompt: 'على المسطرة فصلتَ بين قفزتين: 4,6 م و 4,35 م. بأيّ رقم من الرقمين تمكّنتَ من معرفة الأبعد؟ وبأيّ رتبة بدأتَ؟ اكتب كيف تقارن عددين عشريين.',
        summary: 'نقارن الجزأين الصحيحين أوّلًا؛ فإن تساويا قارنّا رقمي الأعشار، ثم الأجزاء من مائة، وهكذا: أوّل رتبة يختلف فيها الرقمان تحسم المقارنة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.wholeParts.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.rankByRank.text}</MathText></p>
          </div>
        ),
      },
      {
        id: 'itmam-asfar', type: 'methodes', title: 'إتمام الأرقام بأصفار غير ضرورية',
        predictPrompt: 'قفزتان طولهما 12,70 م و 12,7 م: ماذا لاحظتَ على المسطرة؟ وكيف يمكن أن نقارن 4,6 و 4,35 بعدد واحد من الأرقام بعد الفاصلة في الكتابتين؟ اكتب ما تفعله.',
        summary: 'نتمّ العددين بأصفار غير ضرورية حتى يكون لهما عدد الأرقام نفسه بعد الفاصلة ($4{,}6=4{,}60$)، فنقارن عددين طبيعيين من القطع نفسها: 60 جزءًا من مائة و 35 جزءًا من مائة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.zeros.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.trap.text}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tartib-silsila', type: 'concepts', title: 'ترتيب سلسلة أعداد عشرية',
        predictPrompt: 'على منصّة التتويج وضعتَ خمس قفزات من الأقصر إلى الأبعد. كيف قرّرتَ أيّ القفزتين تأتي قبل الأخرى؟ وما التدريج الذي اخترتَه لقراءة السلسلة كلها؟',
        summary: 'لترتيب سلسلة نختار عدد أرقام بعد الفاصلة يكفي لها كلها (نتمّ بأصفار)، ثم نقارن مثنى مثنى: الأصغر أوّلًا في الترتيب التصاعدي، والأكبر أوّلًا في التنازلي.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.order.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.order.how}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'ramz-muqarana', type: 'concepts', title: 'الرمزان < و > وقراءتهما', predict: false,
        summary: 'الرمز $<$ أو $>$ يفتح فمه نحو العدد الأكبر: $4{,}35<4{,}6$ تُقرأ «أصغر من»، و $4{,}6>4{,}35$ تُقرأ «أكبر من» وهما تعنيان الشيء نفسه.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.symbols.definition}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-muqarana', type: 'methodes', title: 'أقارن وأرتّب',
        predictPrompt: 'لمقارنة 23,48 و 23,5 ثم لترتيب أربعة أعداد جزؤها الصحيح 23 أو 19: بماذا تبدأ؟ وماذا تفعل إن تساوى الجزآن الصحيحان؟ اكتب الطريقة.',
        summary: 'الجزآن الصحيحان أوّلًا؛ إن تساويا قارنّا الأرقام رتبةً برتبة من الأعشار (أو أتممنا بأصفار)؛ ولترتيب سلسلة نقارنها مثنى مثنى ثم نكتبها بالرمز $<$ أو $>$ .',
        body: (
          <div className="space-y-2">
            {METHOD_COMPARE.solution.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600">{METHOD_COMPARE.rule}</p>
          </div>
        ),
      },
    ],
  },
};
