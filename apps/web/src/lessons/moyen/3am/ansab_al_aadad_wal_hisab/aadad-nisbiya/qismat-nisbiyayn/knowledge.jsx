import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « حاصل قسمة عددين نسبيين » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف et
 * طرائق réécrits). Le produit de deux relatifs et de plusieurs (les deux leçons précédentes), les priorités (2AM) et la somme algébrique ne sont PAS des items
 * ici : ce sont des prérequis (`priorKnowledge`), mesurés par « أستعدّ ».
 */
const { definition, signs, fraction, zero, priorities } = KNOWLEDGE;
const P = (s) => <p><MathText>{s}</MathText></p>;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'qisma-aamil', type: 'vocabulaire', title: 'حاصل القسمة عاملٌ مجهول', predict: false,
        summary: 'حاصل قسمة a على b (b ≠ 0) هو العدد q الذي إذا ضُرب في b أعطى a : a ÷ b = q معناه b × q = a .',
        body: <div className="space-y-2">{definition.lines.map((t) => <React.Fragment key={t}>{P(t)}</React.Fragment>)}<p className="text-sm text-slate-600"><MathText>{definition.examples}</MathText></p></div>,
      },
      {
        id: 'ishara-qisma', type: 'regles', title: 'إشارة حاصل قسمة عددين نسبيين',
        predictPrompt: 'في الخزائن التي كان رمزها موجبًا لاحظتَ شيئًا على العددين المكتوبين على بابها. ماذا تلاحظ؟ اكتب القاعدة بكلماتك.',
        summary: 'حاصل قسمة عددين لهما الإشارة نفسها موجب، وحاصل قسمة عددين مختلفي الإشارة سالب؛ ومسافته إلى الصفر حاصل قسمة المسافتين.',
        body: (
          <div className="space-y-2">
            {signs.lines.map((t) => <React.Fragment key={t}>{P(t)}</React.Fragment>)}
            <p className="text-sm text-slate-600"><MathText>{signs.examples}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{signs.remark}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'kasr-qisma', type: 'regles', title: 'حاصل القسمة غير العشري وكتاباته',
        predictPrompt: 'فتحتَ الخزانة (−6) × ؟ = 4 بأكثر من كتابة. ما الذي يجمع بين هذه الكتابات؟ اكتب ما لاحظته.',
        summary: 'إذا لم يكن حاصل القسمة عشريًا كتبناه كسرًا a/b ؛ ووضع إشارة السالب في البسط أو المقام أو أمام الكسر لا يغيّر العدد، و (−a)/(−b) = a/b .',
        body: (
          <div className="space-y-2">
            {fraction.lines.map((t) => <React.Fragment key={t}>{P(t)}</React.Fragment>)}
            <p className="text-sm text-slate-600"><MathText>{fraction.examples}</MathText></p>
          </div>
        ),
      },
      {
        id: 'qisma-sifr', type: 'regles', title: 'لا قسمة على الصفر',
        predictPrompt: 'هل يوجد رمز يفتح القفل 0 × ؟ = 5 ؟ ماذا ترى؟ اكتب ملاحظتك.',
        summary: 'لا نقسم على العدد 0 : لا يوجد q يحقّق 0 × q = 5 لأنّ 0 × q = 0 مهما كان q .',
        body: P(zero.text),
      },
    ],
    3: [
      {
        id: 'tariqat-qisma', type: 'methodes', title: 'أحسب حاصل قسمة عددين',
        predictPrompt: 'حسبتَ (−63) ÷ 7 و 0,36 ÷ (−0,001) . ما الخطوات التي اتبعتها بالترتيب؟ اكتبها.',
        summary: 'نعيّن إشارة حاصل القسمة بقاعدة الإشارات، ثم نقسم المسافة إلى الصفر للأوّل على المسافة إلى الصفر للثاني، ونتحقّق بالضرب.',
        body: <div className="space-y-2">{P(METHOD.compute.rule[0])}<p className="text-sm text-slate-600"><MathText>{METHOD.sign.text}</MathText></p></div>,
      },
      {
        id: 'ishara-jadaa', type: 'regles', title: 'إشارة حاصل قسمة جداءين',
        predictPrompt: 'عيّنتَ إشارة بسط Q ومقامها ثم إشارة Q . كيف عرفتها دون أن تحسب؟ اكتب الطريقة.',
        summary: 'في حاصل قسمة جداءين نعدّ العوامل السالبة في البسط وفي المقام، فنعرف إشارة كل منهما ثم إشارة الحاصل بقاعدة الإشارات.',
        body: P(METHOD.products.text),
      },
      {
        id: 'tariqat-awlawiya', type: 'methodes', title: 'سلسلة حسابات على الأعداد النسبية',
        predictPrompt: 'حسبتَ A = 5 − (3 × (−4) + 7) . بأيّ ترتيب أنجزتَ العمليات؟ اكتبه.',
        summary: 'نحسب ما بين الأقواس أوّلًا، ثم الضرب والقسمة من اليسار إلى اليمين، ثم الجمع والطرح من اليسار إلى اليمين.',
        body: <div className="space-y-2">{priorities.lines.map((t) => <React.Fragment key={t}>{P(t)}</React.Fragment>)}<p className="text-sm text-slate-600"><MathText>{priorities.examples}</MathText></p></div>,
      },
    ],
  },
};
