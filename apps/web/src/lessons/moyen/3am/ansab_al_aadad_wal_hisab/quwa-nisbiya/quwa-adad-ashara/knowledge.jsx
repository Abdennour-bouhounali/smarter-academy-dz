import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « قوى العدد 10 » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 1–2 p. 42, طرائق p. 43 et
 * le مفكوك, réécrits). Le décalage de la virgule de 1AM (`darb-ashara`), le مقلوب (`maqlub`) et les unités (`wahdat`) ne sont PAS des items ici : ce sont des
 * prérequis (`priorKnowledge`), mesurés par « أستعدّ ». Les règles sur les produits et quotients de puissances de 10 sont celles de la leçon SUIVANTE.
 */
const { definition, zero, inverse, names, prefixes } = KNOWLEDGE;
const L = (s) => <p className="text-center" dir="ltr"><MathText>{s}</MathText></p>;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'ashara-taarif', type: 'regles', title: 'القوة 10ⁿ',
        predictPrompt: 'ستة عوامل كلّها 10 تعطي مليونًا. كيف تقترح أن نكتب جداء $n$ عاملًا كلّها 10 باختصار؟ وكيف نقرؤه؟',
        summary: 'من أجل عدد طبيعي غير معدوم n ، 10ⁿ جداء n عاملًا كلّها تساوي 10 ، ويُقرأ « 10 أس n ».',
        body: (
          <div className="space-y-2">
            <p><MathText>{definition.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{definition.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'ashara-asfar', type: 'regles', title: 'عدد الأصفار',
        predictPrompt: 'بعد 3 نقرات قرأتَ 1 000 وبعد 6 نقرات 1 000 000. ماذا تلاحظ عن عدد الأصفار وعدد النقرات؟ عمّم على $n$ نقرة.',
        summary: 'الكتابة العشرية لـ 10ⁿ هي الرقم 1 متبوعًا بـ n صفرًا.',
        body: <p><MathText>{GUIDE.zeros}</MathText></p>,
      },
      {
        id: 'ashara-sifr', type: 'regles', title: 'الأس صفر',
        predictPrompt: 'الإطار بلا أيّ نقرة: ماذا يساوي ضلعه؟ ماذا تستنتج عن $10^0$ ؟',
        summary: '10¹ = 10 و 10⁰ = 1.',
        body: (
          <div className="space-y-2">
            <p><MathText>{zero.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.zero}</MathText></p>
          </div>
        ),
      },
      {
        id: 'ashara-salib', type: 'regles', title: 'الأس السالب',
        predictPrompt: 'ثلاث نقرات تصغير أعطت $0{,}001$ م. أين الرقم 1 في هذه الكتابة؟ وما علاقة $10^{-3}$ بـ $10^3$ ؟ اكتب القاعدة لأيّ $n$ .',
        summary: 'من أجل عدد طبيعي غير معدوم n : 10⁻ⁿ = 1/10ⁿ ، مقلوب 10ⁿ ، والرقم 1 فيه في الرتبة n بعد الفاصلة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{inverse.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{inverse.example}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'ashara-asma', type: 'regles', title: 'الأسماء والبادئات',
        predictPrompt: 'ميكرومتر واحد جزء من مليون من المتر. ماذا تكتب من القوى للميكرومتر وللكيلومتر؟ حاول أن تعمّم على ميلي ونانو.',
        summary: 'كيلو 10³ ، ميغا 10⁶ ، جيغا 10⁹ ؛ ميلي 10⁻³ ، ميكرو 10⁻⁶ ، نانو 10⁻⁹ : كل بادئة قوة للعدد 10 ، وكذلك الأسماء ألف ومليون ومليار.',
        body: (
          <div className="space-y-2">
            <p><MathText>{names.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{[prefixes.text, ...prefixes.lines].join(' ')}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'ashara-adad', type: 'methodes', title: 'من الكتابة العشرية إلى القوة',
        predictPrompt: 'كيف تكتب $100\\,000$ و $0{,}0001$ على شكل قوة للعدد 10 دون أن تخطئ؟ ماذا تعدّ في كل حالة؟',
        summary: 'نعدّ الأصفار بعد الرقم 1 لنكتب 10ⁿ ، ونعدّ رتبة الرقم 1 بعد الفاصلة لنكتب 10⁻ⁿ.',
        body: <p><MathText>{METHOD.count.rule}</MathText></p>,
      },
      {
        id: 'ashara-mafkuk', type: 'methodes', title: 'مفكوك عدد عشري',
        predictPrompt: 'كيف تكتب $3\\,985$ كمجموع حدود كل منها رقم مضروب في قوة للعدد 10 ؟ وماذا تفعل بصفر في عدد مثل $5\\,030$ ؟',
        summary: 'مفكوك عدد عشري مجموع حدود، كل منها رقم مضروب في 10ⁿ حيث n رتبته؛ والأصفار لا تظهر.',
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.expand.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.mafkuk.right}</MathText></p>
          </div>
        ),
      },
      {
        id: 'ashara-kn', type: 'methodes', title: 'الكتابة k × 10ⁿ',
        predictPrompt: 'كيف تكتب $45\\,000$ بدلالة $45$ وقوة للعدد 10 ؟ وهل لهذا العدد كتابة واحدة بهذا الشكل؟',
        summary: 'نكتب عددًا على الشكل k × 10ⁿ بإزاحة الفاصلة ؛ وليس للعدد كتابة وحيدة بهذا الشكل.',
        body: <p><MathText>{METHOD.times.rule}</MathText></p>,
      },
    ],
  },
};
