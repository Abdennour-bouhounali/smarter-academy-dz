import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « المساويات والعمليات » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 1
 * p. 74 et طرائق p. 75, réécrits). Le test d'une égalité par une valeur et le produit de nombres relatifs sont des prérequis
 * (`priorKnowledge`), mesurés par « أستعدّ », jamais des items ici.
 */
const { add, times, both, zero } = KNOWLEDGE;
const L = (s) => <p className="text-center" dir="ltr"><MathText>{s}</MathText></p>;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'musawat-jam', type: 'regles', title: 'المساواة والجمع والطرح',
        predictPrompt: 'في المضمار بقي المتسابقان معًا عندما أضفتَ العدد نفسه إلى الطرفين. إذا كان $a = b$ فماذا يمكنك أن تقول عن $a + c$ و $b + c$ ؟ وعن $a - c$ و $b - c$ ؟ اكتب القاعدة بكلماتك.',
        summary: 'إذا كان a = b فإنّ a + c = b + c و a − c = b − c : لا تتغيّر مساواة عندما نضيف إلى طرفيها العدد نفسه أو نطرحه منهما.',
        body: (
          <div className="space-y-2">
            <p><MathText>{add.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{add.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tarafayn', type: 'regles', title: 'العملية على الطرفين معًا',
        predictPrompt: 'حين تلقّى متسابق واحد العملية افترق المتسابقان. على أيّ جزء من المساواة يجب أن نُجري العملية حتى تبقى صحيحة؟',
        summary: 'العملية تُجرى على الطرفين معًا: إذا أُجريت على طرف واحد فلا تبقى المساواة صحيحة.',
        body: <p><MathText>{both.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'musawat-darb', type: 'regles', title: 'المساواة والضرب والقسمة',
        predictPrompt: 'ضربتَ الطرفين في العدد نفسه (موجبًا أو سالبًا) أو قسمتهما عليه فبقيا معًا. إذا كان $a = b$ فماذا تعطي $a \\times c$ و $\\frac{a}{c}$ ؟ وما الشرط على $c$ في القسمة؟',
        summary: 'إذا كان a = b فإنّ ac = bc ، وإذا كان c ≠ 0 فإنّ a/c = b/c.',
        body: (
          <div className="space-y-2">
            <p><MathText>{times.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{times.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'sifr', type: 'regles', title: 'القسمة على صفر والضرب في صفر',
        predictPrompt: 'رفض المضمار القسمة على $0$ ، وأفرغ الضرب في $0$ المساواة من معناها. ماذا تقول عن $0$ ؟',
        summary: 'لا قسمة على 0 ؛ والضرب في 0 يعطي 0 = 0 : صحيحة لكنها لا تفيد.',
        body: <p><MathText>{zero.text}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'tahwil', type: 'methodes', title: 'أحوّل مساواة معطاة',
        predictPrompt: 'كيف تتحقّق من صحة مساواة جديدة انطلاقًا من مساواة معطاة دون أن تبحث عن $x$ ؟ اكتب طريقتك.',
        summary: 'نحوّل المساواة المعطاة بعملية أو عمليتين على الطرفين؛ فإذا وصلنا إلى المساواة المطلوبة فهي صحيحة.',
        body: <p><MathText>{METHOD.transform.rule}</MathText></p>,
      },
      {
        id: 'hukm', type: 'regles', title: 'الضرب يشمل كل الحدود',
        predictPrompt: 'في $2x + 3 = 7$ ضربتَ الطرفين في $2$ . ماذا يحدث للحدّ $3$ ؟ اكتب ما يجب فعله بكل حدود الطرف.',
        summary: 'الضرب أو القسمة يشملان كل حدود الطرف؛ ويكفي حدّ واحد منسيّ ليفسد النتيجة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.scale.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.allTerms.right}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
