import React from 'react';
import MathText from '../../../../../common/components/MathText';
import ArcTape from '../../../../../common/components/ArcTape';
import { KNOWLEDGE, METHOD, TAPES } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « معنى الجمع والطرح » — SOURCE UNIQUE, construite à partir du contenu du manuel
 * (content/textbook.js). Une <KnowledgeBrick id="…"> dans un module et la carte rendent le même objet.
 *
 * La règle du module 1 n'est PAS une phrase du manuel : le manuel la fait vivre (نشاط 1 : « ينقصه » ⇒ 24,5 + 11,5 ;
 * « زادت » ⇒ 17,5 − 1,5) et la méthode p. 29 l'outille (« تمثيل معطيات عددية بقطع مستقيمات ») ; la plateforme la
 * nomme avec les mots du schéma (الكلّ / الأجزاء).
 */
const { sum, difference } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'ikhtiyar-amaliya', type: 'regles', title: 'الكلّ أم الجزء؟',
        predictPrompt: 'في المختبر: «تزيد قامة سارة عن قامة نزيم» ومع ذلك وجدت قامة نزيم بالطرح، و«ينقصه 11,5» ومع ذلك وجدنا ثمن الكرّاس بالجمع. فمتى نجمع ومتى نطرح؟ اكتب القاعدة بكلماتك دون أن تعتمد على كلمة «يزيد» أو «ينقص».',
        summary: 'إذا كان المجهول هو الكلّ نجمع الأجزاء، وإذا كان المجهول جزءًا نطرح الجزء الآخر من الكلّ. الكلمة وحدها (يزيد، ينقص، أكثر، أقل) لا تقرّر العملية.',
        body: (
          <div className="space-y-2">
            <p>نبحث في الوضعية عن <strong>الكلّ</strong> (الأكبر) و<strong>الجزأين</strong> اللذين يكوّنانه:</p>
            <ul className="list-disc space-y-1 ps-5">
              <li><MathText>{'المجهول هو الكلّ ⟵ نجمع: $\\square = 24{,}5 + 11{,}5$ (ثمن الكرّاس، رغم كلمة «ينقصه»).'}</MathText></li>
              <li><MathText>{'المجهول جزء ⟵ نطرح من الكلّ الجزء الآخر: $\\square = 17{,}5 - 1{,}5$ (علامة يونس، رغم كلمة «زادت»).'}</MathText></li>
            </ul>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'majmu-hadda', type: 'vocabulaire', title: 'المجموع وحدّاه', predict: false,
        summary: 'ناتج جمع عددين يسمّى مجموعهما، والعددان اللذان نجمعهما يسمّيان حدّي المجموع.',
        body: (
          <div className="space-y-2">
            {sum.definitions.map((t) => <p key={t}>{t}</p>)}
            <p className="text-sm text-slate-600"><MathText>{`${sum.example.equality} : ${sum.example.text}`}</MathText></p>
            <ArcTape {...TAPES.sum} maxWidth={320} />
          </div>
        ),
      },
      {
        id: 'farq-hadda', type: 'vocabulaire', title: 'الفرق وحدّاه', predict: false,
        summary: 'نتيجة طرح عددين تسمّى فرقهما، والعددان اللذان نطرح أحدهما من الآخر يسمّيان حدّي الفرق.',
        body: (
          <div className="space-y-2">
            {difference.definitions.map((t) => <p key={t}>{t}</p>)}
            <p className="text-sm text-slate-600"><MathText>{`${difference.example.equality} : ${difference.example.text}`}</MathText></p>
            <ArcTape {...TAPES.difference} maxWidth={320} />
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tamthil-aqwas', type: 'methodes', title: 'نمثّل قبل أن نحسب',
        predictPrompt: 'هدى أخطأت لأنّ «المعطيات كثيرة ومتداخلة»، وإيناس أصابت. لو أعطيناك مشكلة جديدة فيها «يزيد» أو «أقل»، بأيّ خطوات تبدأ قبل أن تحسب؟ اكتب الطريقة.',
        summary: 'لتفادي الالتباس في «يزيد، ينقص، أكثر، أقل»: نمثّل المعطيات بقطع مستقيمات، الكلّ تحت الخط والأجزاء فوقه، ونضع رمزًا مكان المجهول، ثم نقرأ العملية.',
        body: (
          <div className="space-y-2">
            <p>{METHOD.box}</p>
            <ol className="list-decimal space-y-1 ps-5 text-sm">
              <li>نرسم خطًّا ونحدّد عليه <strong>الكلّ</strong> (قوس تحت الخط) و<strong>الجزأين</strong> (قوسان فوقه).</li>
              <li>نضع رمزًا (□، △، ؟) مكان المجهول، والأعداد المعلومة مكانها.</li>
              <li>نقرأ العملية: الرمز تحت الخط ⟵ جمع؛ الرمز فوق الخط ⟵ طرح.</li>
              <li>نتحقّق أنّ النتيجة معقولة: الكلّ هو الأكبر.</li>
            </ol>
            <ArcTape {...TAPES.method1} maxWidth={320} />
          </div>
        ),
      },
    ],
  },
};
