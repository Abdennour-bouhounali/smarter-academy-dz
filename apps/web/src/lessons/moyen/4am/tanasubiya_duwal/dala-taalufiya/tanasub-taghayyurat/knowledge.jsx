import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 3 « تعيين دالة تآلفية انطلاقًا من عددين وصورتيهما » — SOURCE UNIQUE. Le
 * manuel fourni n'a pas d'encadré « معارف » : chaque item est une FORMALISATION déclarée de la plateforme
 * (content/textbook.js › KNOWLEDGE, `addition('knowledge_formalization')`), nommant ce que le نشاط 4 et
 * le laboratoire ont fait voir.
 *
 *   module 1 (نشاط 4)   tanasub-taghayyurat — nommé après les marches de l'élève (quotient constant) ;
 *   module 2 (تعيين)    burhan-taghayyurat, hisab-muamil-a, hisab-b, tariqat-jumla-ab.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'tanasub-taghayyurat', type: 'regles', title: 'تناسب التغيّرات',
        predictPrompt: 'في درجاتك وفي حواصل الكتاب الثلاثة وجدت العدد نفسه 200 ، مهما كان العددان. لو غيّر المركّب الاشتراك السنوي وثمن المقابلة، ماذا تتوقّع لحاصل قسمة فرق مبلغين على فرق عددي المقابلات؟ بماذا يتعلّق، وبماذا لا يتعلّق؟ اكتب القاعدة بكلماتك.',
        summary: 'في دالة تآلفية حاصل قسمة فرق صورتي عددين متمايزين على فرق هذين العددين ثابت، يساوي المعامل a مهما كان العددان: تغيّرات الصور متناسبة مع تغيّرات الأعداد.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.tanasub.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.tanasub.example}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'burhan-taghayyurat', type: 'regles', title: 'لماذا يساوي الحاصل a؟',
        predictPrompt: 'مع $f(x) = 200x + 2000$ وجدت الحاصل 200 في كل درجة، ولم يظهر الاشتراك 2000 أبدًا. اكتب الفرق $f(x_1) - f(x_2)$ لمناصرَين تابعا $x_1$ و $x_2$ مقابلة: ماذا يحدث للعدد 2000؟ ولماذا يعطي الحاصل دائمًا 200؟ ومتى لا يمكن حسابه؟',
        summary: 'فرق صورتي عددين يساوي a ضرب فرق العددين لأن الحد الثابت b يختفي في الطرح؛ وبما أن العددين متمايزان نقسم على فرقهما فنجد a.',
        body: (
          <div className="space-y-2">
            {KNOWLEDGE.burhan.lines.map((l) => <p key={l}><MathText>{l}</MathText></p>)}
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.burhan.remark}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hisab-muamil-a', type: 'methodes', title: 'حساب a من عددين وصورتيهما',
        predictPrompt: 'لا نعرف عبارة $f(x)$ ، نعرف فقط $f(10) = 50$ و $f(30) = 86$ . بما رأيته في درجات نشاط 4، كيف تحسب المعامل $a$ من هذه الأعداد الأربعة؟ اكتب الطريقة بكلماتك.',
        summary: 'نحسب المعامل a بقسمة فرق الصورتين على فرق العددين، مع الطرح بالترتيب نفسه في البسط وفي المقام.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.hisabA.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.hisabA.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hisab-b', type: 'methodes', title: 'حساب b وكتابة العبارة',
        predictPrompt: 'وجدت $a = 1{,}8$ ، وتعرف أنّ $f(10) = 50$ . كيف تجد العدد $b$ في $f(x) = ax + b$ ؟ وكيف تتأكّد بعد ذلك أنّ العبارة التي كتبتها صحيحة؟ اكتب الطريقة.',
        summary: 'بعد معرفة a نعوّض أحد العددين وصورته: b يساوي الصورة ناقص a ضرب العدد، ثم نكتب عبارة الدالة ونتحقق بالعدد الآخر.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.hisabB.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.hisabB.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tariqat-jumla-ab', type: 'methodes', title: 'طريقة ثانية: جملة معادلتين',
        predictPrompt: 'دون حساب حاصل القسمة: $f(x) = ax + b$ مع $f(10) = 50$ و $f(30) = 86$ . اكتب ما تعنيه كل معلومة بدلالة $a$ و $b$ . ماذا تحصل؟ وكيف تجد منه $a$ و $b$ بما تعلّمته من قبل؟',
        summary: 'نكتب أن صورتي العددين معلومتان فنحصل على جملة معادلتين مجهولاها a و b، نحلها بطرح المعادلتين لنتخلص من b.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.jumla.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.jumla.example}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
