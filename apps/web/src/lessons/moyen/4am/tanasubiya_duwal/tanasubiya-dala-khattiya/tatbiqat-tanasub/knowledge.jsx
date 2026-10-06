import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOW, ACT5_ANSWERS, ACTIVITY_6, METHOD_PERCENT, METHOD_COMPOUND, TAHWIL, BIDALALA } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 4 « تطبيقات التناسبية (النسب المئوية والمقادير المركبة) » — SOURCE
 * UNIQUE. Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 5)   nisba-akhdh — prendre t % (les filles du collège) ;
 *                       takhfid-darb — diminuer de t % (la consommation) ;
 *                       ziyada-darb — augmenter de t % (1200 → 1260) ;
 *                       dala-murfaqa — la fonction linéaire associée (y = 1,05x) ;
 *   module 2 (نشاط 6)   miqdar-qisma — grandeur quotient (vitesse, débit, masse volumique) ;
 *                       tahwil-murakkab — convertir une grandeur composée ;
 *   module 3 (معارف)    tatabu-darb — changements successifs (le réservoir, طرائق) ;
 *                       miqdar-jida — grandeur produit (aire, énergie) ;
 *                       miqdar-bidalala — une grandeur donnée en fonction d'une autre (P3).
 * Les `summary` sont du texte simple (carte, مذكرة) : les formules restent dans `body`.
 */
const M = ({ children }) => <MathText>{children}</MathText>;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'nisba-akhdh', type: 'concepts', title: 'أخذ نسبة مئوية من مقدار',
        predictPrompt: 'في الجدول: 40% من 95 تلميذًا في السنة الثانية بنات، فعددهنّ 38؛ ثم قارنت 205 بنتًا بـ 375 تلميذًا. اكتب القاعدتين بكلماتك: كيف تحسب $t\\%$ من مقدار $x$ ؟ وكيف تحسب النسبة المئوية لجزء من كلّ؟',
        summary: 'أخذ t بالمئة من مقدار x يعني ضرب x في t على 100. والنسبة المئوية لجزء من كلّ هي حاصل قسمة الجزء على الكلّ مضروبًا في 100.',
        body: (
          <div className="space-y-1">
            <p><M>{`${KNOW.percentTable[0].case} ${KNOW.percentTable[0].means} : ${KNOW.percentTable[0].fn}`}</M></p>
            <p className="text-sm text-slate-600"><M>{ACT5_ANSWERS.girlsPercent}</M></p>
          </div>
        ),
      },
      {
        id: 'takhfid-darb', type: 'regles', title: 'التخفيض بنسبة مئوية',
        predictPrompt: 'انخفض الاستهلاك من $6{,}7L$ إلى $6{,}1L$ ، أي بحوالي $8{,}96\\%$ . لو انخفض مقدار $x$ بنسبة $t\\%$ ، كيف تحسب المقدار الجديد مباشرة، بعملية واحدة؟ اكتب القاعدة بدلالة $x$ و $t$ .',
        summary: 'تخفيض مقدار x بنسبة t بالمئة يعني ضربه في 1 ناقص t على 100: نضرب ولا نطرح العدد t.',
        body: (
          <div className="space-y-1">
            <p><M>{`${KNOW.percentTable[2].case} ${KNOW.percentTable[2].means} : ${KNOW.percentTable[2].fn}`}</M></p>
            <p className="text-sm text-slate-600"><M>{ACT5_ANSWERS.fuel}</M></p>
          </div>
        ),
      },
      {
        id: 'ziyada-darb', type: 'regles', title: 'الزيادة بنسبة مئوية',
        predictPrompt: 'على بطاقة السعر: 1200 دج بعد زيادة 5% صارت 1260 دج، أمّا «إضافة 5» فأعطت 1205 دج فقط. كيف تحسب مباشرة، بعملية واحدة، سعرًا $x$ بعد زيادته بـ $t\\%$ ؟ اكتب القاعدة بدلالة $x$ و $t$ .',
        summary: 'زيادة مقدار x بنسبة t بالمئة تعني ضربه في 1 زائد t على 100: نضرب ولا نضيف العدد t.',
        body: (
          <div className="space-y-1">
            <p><M>{`${KNOW.percentTable[1].case} ${KNOW.percentTable[1].means} : ${KNOW.percentTable[1].fn}`}</M></p>
            <p className="text-sm text-slate-600"><M>{ACT5_ANSWERS.price}</M></p>
          </div>
        ),
      },
      {
        id: 'dala-murfaqa', type: 'concepts', title: 'الدالة الخطية المرفقة',
        predictPrompt: 'في جدولك طبّقت الزيادة 5% نفسها على قطع مختلفة وقسمت $y$ على $x$ . ماذا تلاحظ في العمود الأخير؟ لو كانت الزيادة $t\\%$ بدل 5%، ماذا تستنتج عن العلاقة بين السعر بعد الزيادة والسعر قبلها؟ أيّ نوع من الدوال يربطهما، وما معاملها؟',
        summary: 'المقدار بعد زيادة أو تخفيض بنسبة ثابتة يتناسب مع المقدار قبلها: المضاعف نفسه لكل المقادير، فهو دالة خطية معاملها هذا المضاعف.',
        body: (
          <div className="space-y-1">
            <p><M>{ACT5_ANSWERS.fn}</M></p>
            <p className="text-sm text-slate-600"><M>{KNOW.percentExamples[2]}</M></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'miqdar-qisma', type: 'concepts', title: 'مقدار حاصل القسمة',
        predictPrompt: 'السرعة $25m/s$ تعني 25 مترًا في كل ثانية، وحوّلتها إلى $90km/h$ لتقارنها باللافتة. كيف تحسب السرعة المتوسطة من مسافة ومدة؟ اكتب القاعدة، ثم اذكر مقدارًا آخر يُحسب بالطريقة نفسها من مقدارين.',
        summary: 'عندما نحسب حاصل قسمة مقدارين نتحصل على مقدار حاصل القسمة: السرعة المتوسطة (المسافة على المدة)، التدفق (الحجم على المدة)، الكتلة الحجمية (الكتلة على الحجم).',
        body: (
          <div className="space-y-1">
            <p><M>{KNOW.quotientQuantity}</M></p>
            <p className="text-sm"><M>{KNOW.quotientExamples[0]}</M></p>
            <p className="text-sm"><M>{KNOW.quotientExamples[1]}</M></p>
            <p className="text-sm text-slate-600"><M>{ACTIVITY_6.answers.flow}</M></p>
          </div>
        ),
      },
      {
        id: 'tahwil-murakkab', type: 'methodes', title: 'تحويل وحدة مقدار مركّب',
        predictPrompt: 'لتكتب $7\\,200\\,000L$ في الساعة بالمتر المكعب في الثانية: ماذا فعلت بوحدة الحجم؟ وماذا فعلت بوحدة الزمن؟ اكتب الطريقة لتحويل وحدة أيّ مقدار مركّب.',
        summary: 'لتحويل وحدة مقدار مركّب نحوّل وحدة البسط ووحدة المقام كلًّا على حدة، ثم نحسب حاصل القسمة من جديد.',
        body: (
          <div className="space-y-1">
            <p><M>{TAHWIL.text}</M></p>
            <p className="text-sm text-slate-600"><M>{TAHWIL.rule}</M></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tatabu-darb', type: 'methodes', title: 'تغيّرات مئوية متتابعة',
        predictPrompt: 'في الخزان: تفريغ 30% ثم إضافة 15% ممّا بقي أعطيا $24{,}15m^3$ ، وفي الحذاء: تخفيض 20% ثم زيادة 20% أعطيا 960 دج لا 1000 دج. لو تغيّر مقدار $x$ بنسبتين متتابعتين، كيف تحسب المقدار في النهاية مباشرة؟ اكتب الطريقة.',
        summary: 'تغيّران متتابعان بنسبتين مئويتين يعنيان الضرب في جداء المضاعفين: النسب المتتابعة لا تُجمع.',
        body: (
          <div className="space-y-1">
            <p><M>{METHOD_PERCENT.method}</M></p>
            <p className="text-sm text-slate-600"><M>{METHOD_PERCENT.solution[2]}</M></p>
          </div>
        ),
      },
      {
        id: 'miqdar-jida', type: 'concepts', title: 'مقدار جداء',
        summary: 'عندما نحسب جداء مقدارين نتحصل على مقدار جداء: مساحة المستطيل (الطول في العرض)، الطاقة الكهربائية (الاستطاعة في المدة).',
        body: (
          <div className="space-y-1">
            <p><M>{KNOW.productQuantity}</M></p>
            {KNOW.productExamples.map((e) => <p key={e} className="text-sm"><M>{e}</M></p>)}
          </div>
        ),
      },
      {
        id: 'miqdar-bidalala', type: 'memoriser', title: 'مقدار بدلالة مقدار آخر',
        predictPrompt: 'في المعارف: دراجة قطعت $42km$ في $1{,}5h$ ، فسرعتها المتوسطة $28km/h$ . إذا بقيت سرعتها ثابتة، جرّب: كم تقطع في $1h$ ؟ في $2h$ ؟ في $3h$ ؟ اكتب المسافة $d$ بدلالة المدة $t$ ، ثم اكتب ما تستنتجه عندما يكون المقدار المركّب ثابتًا.',
        summary: 'عندما يكون المقدار المركّب ثابتًا يُعطى مقدار بدلالة مقدار آخر بالضرب في هذا الثابت: المسافة بدلالة المدة، الكتلة بدلالة الحجم، الطاقة بدلالة المدة — دالة خطية.',
        body: (
          <div className="space-y-1">
            <p><M>{BIDALALA.text}</M></p>
            <p className="text-sm text-slate-600"><M>{BIDALALA.example}</M></p>
            <p className="text-sm text-slate-600"><M>{METHOD_COMPOUND.method}</M></p>
          </div>
        ),
      },
    ],
  },
};
