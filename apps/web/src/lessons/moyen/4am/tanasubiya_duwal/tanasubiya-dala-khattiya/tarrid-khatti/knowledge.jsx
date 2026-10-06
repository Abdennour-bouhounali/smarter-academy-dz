import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { PROPORTIONAL_GRAPH, NOT_PROPORTIONAL, METHOD_SPRING, BRIDGE, INTERPRET } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 5 « حل مشكلات وترييض وضعيات بتوظيف الدالة الخطية والتناسبية » —
 * SOURCE UNIQUE, construite à partir de نشاط 4 (p. 67) et de la طريقة du ressort (p. 71).
 *
 *   module 1  tanasub-bayan      une situation proportionnelle se lit : points alignés avec O ; a = la
 *                                quantité pour UNE unité (50 DA le kg), coefficient directeur de la droite
 *             laysat-tanasub     le contraste : droite qui ne passe pas par O, courbe → pas de fonction linéaire
 *   module 2  tariqat-jadwal     la طريقة : « لحساب مقدار بدلالة مقدار آخر يمكن الاستعانة بجدول تناسبية »
 *             tamthilat-thalath  le même a dans le tableau, la formule f(x) = ax et le graphique
 *             tafsir-siyaq       interpréter : une phrase, une unité, un résultat plausible
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'tanasub-bayan', type: 'concepts', title: 'وضعية تناسبية: نقط على مستقيم يشمل المبدأ',
        predictPrompt: 'ضبطتَ في المختبر حبل التلفريك ثم نقط النابض، ووجدت في التمثيل (1) أنّ سعر البطاطا وضعية تناسبية. ماذا تشترك فيه نقط وضعية تناسبية على تمثيلها البياني؟ وأين يظهر معامل التناسبية $a$ على هذا التمثيل؟ اكتب القاعدة بكلماتك.',
        summary: 'تكون الوضعية تناسبية عندما تقع نقط تمثيلها على مستقيم يشمل المبدأ O، ومعامل التناسبية a هو معامل توجيه هذا المستقيم: المقدار الموافق لوحدة واحدة.',
        body: <p><MathText>{PROPORTIONAL_GRAPH.text}</MathText></p>,
      },
      {
        id: 'laysat-tanasub', type: 'regles', title: 'مستقيم لا يشمل المبدأ أو منحنى: ليست تناسبية',
        predictPrompt: 'نقط محيط المستطيل في التمثيل (2) على استقامة واحدة، ومع ذلك فالوضعية ليست تناسبية، وكذلك مساحة المربع في التمثيل (3). متى نحكم من التمثيل البياني أنّ وضعية ليست تناسبية؟ اكتب القاعدة بكلماتك، في الحالتين.',
        summary: 'إذا كانت النقط على مستقيم لا يشمل المبدأ أو على منحنى، فالوضعية ليست تناسبية ولا ننمذجها بدالة خطية.',
        body: <p><MathText>{NOT_PROPORTIONAL.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'tariqat-jadwal', type: 'methodes', title: 'حساب مقدار بدلالة مقدار آخر',
        predictPrompt: 'في حلّ النابض انتقل الكتاب من القياسات إلى $y = 0{,}3x$ ، ثم وجد استطالة كتلة 10g والكتلة التي تعطي استطالة 2,1cm. لو أعطيناك وضعية أخرى يُعطى فيها مقدار بدلالة مقدار آخر، بأيّ خطوات تحسب أحدهما من الآخر؟ اكتب الطريقة.',
        summary: 'لحساب مقدار بدلالة مقدار آخر يمكن الاستعانة بجدول تناسبية: نعيّن المعامل a، نكتب الدستور، ثم نحسب صورة عدد أو العدد الذي علمت صورته.',
        body: (
          <div className="space-y-1">
            <p className="font-bold"><MathText>{METHOD_SPRING.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD_SPRING.solution[1]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tamthilat-thalath', type: 'regles', title: 'جدول، دستور، تمثيل بياني: العدد a نفسه',
        predictPrompt: 'وجدتَ العدد 0,3 وأنت تتمّم جدول النابض، ثم رأيته في الدستور $y = 0{,}3x$ . أين تجد هذا العدد نفسه على التمثيل البياني؟ اكتب القاعدة بكلماتك: كيف يظهر معامل التناسبية في الجدول، وفي الدستور، وفي التمثيل البياني؟',
        summary: 'المعامل a نفسه في الأشكال الثلاثة: نضرب فيه قيم الجدول، ويظهر في الدستور، وهو ترتيب نقطة المستقيم التي فاصلتها 1.',
        body: (
          <div className="space-y-1">
            <p><MathText>{BRIDGE.text}</MathText></p>
            <ul className="text-sm text-slate-700">
              {BRIDGE.rows.map((r) => <li key={r.form}><strong>{r.form}:</strong> <MathText>{r.reads}</MathText></li>)}
            </ul>
          </div>
        ),
      },
      {
        id: 'tafsir-siyaq', type: 'regles', title: 'نفسّر النتيجة في سياق الوضعية',
        predictPrompt: 'من $2{,}1 = 0{,}3x$ وجد الكتاب $x = 7$ ، لكنه لم يكتفِ بكتابة هذا العدد. كيف نكتب نتيجة الحساب جوابًا عن سؤال الوضعية؟ وبماذا نتحقّق قبل أن نقبلها؟ اكتب القاعدة بكلماتك.',
        summary: 'نكتب النتيجة بجملة وبوحدتها، ونتحقّق أنها معقولة: الكتلة والطول والمدة لا تكون سالبة، وعدد الأشخاص عدد طبيعي.',
        body: <p><MathText>{INTERPRET.text}</MathText></p>,
      },
    ],
  },
};
