import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « جداء عدة أعداد نسبية » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف et
 * طرائق réécrits). Le produit de deux relatifs (la leçon précédente), l'addition, la parité d'un entier et le معاكس d'un point ne sont PAS des items
 * ici : ce sont des prérequis (`priorKnowledge`), mesurés par « أستعدّ ».
 */
const { opposite, parity, square, roles, distribute } = KNOWLEDGE;
const P = (s) => <p><MathText>{s}</MathText></p>;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'maakus', type: 'vocabulaire', title: 'الضرب في −1 ومعاكس عدد', predict: false,
        summary: 'جداء عدد في −1 هو معاكسه (نظيره) : (−1) × a = −a ، وقد يكون −a موجبًا أو سالبًا.',
        body: <div className="space-y-2">{opposite.lines.map((t) => <React.Fragment key={t}>{P(t)}</React.Fragment>)}<p className="text-sm text-slate-600"><MathText>{opposite.examples}</MathText></p></div>,
      },
      {
        id: 'adad-salib', type: 'regles', title: 'إشارة جداء عدة أعداد',
        predictPrompt: 'في سجلّ الروبوت لاحظتَ برامج توقّف فيها في الجهة السالبة. ماذا تشترك فيه هذه البرامج؟ اكتب القاعدة بكلماتك.',
        summary: 'جداء عدة أعداد غير معدومة سالب إذا كان عدد عوامله السالبة فرديًا، وموجب إذا كان زوجيًا، ولا يتغيّر بتغيير ترتيب العوامل.',
        body: (
          <div className="space-y-2">
            {parity.lines.map((t) => <React.Fragment key={t}>{P(t)}</React.Fragment>)}
            <p className="text-sm text-slate-600"><MathText>{parity.examples}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'murabba', type: 'regles', title: 'مربّع عدد نسبي',
        predictPrompt: 'وضعتَ البطاقة نفسها مرّتين في برنامج الروبوت. هل وجدتَ عددًا يوقف الروبوت في الجهة السالبة؟ علّل في جملة.',
        summary: 'مربّع عدد نسبي a² = a × a لا يكون سالبًا، و (−a)² = a² .',
        body: P(square.text),
      },
      {
        id: 'adwar', type: 'vocabulaire', title: 'أدوار الإشارة −', predict: false,
        summary: 'للإشارة − ثلاثة أدوار: علامة طرح (17 − 9) ، وإشارة عدد سالب (−8) ، ومعاكس عدد (−b).',
        body: P(roles.text),
      },
    ],
    3: [
      {
        id: 'tariqat-iddat', type: 'methodes', title: 'أحسب جداء عدة أعداد',
        predictPrompt: 'حسبتَ $A = 2 \\times (-5) \\times (-1{,}5) \\times (-4)$ . ما الخطوات التي اتبعتها بالترتيب؟ اكتبها.',
        summary: 'نعدّ العوامل السالبة لنعيّن الإشارة، ثم نضرب المسافات إلى الصفر، ونغيّر ترتيب العوامل لتسهيل الحساب؛ وإذا وُجد عامل معدوم فالجداء معدوم.',
        body: (
          <div className="space-y-2">
            {P(METHOD.steps.rule)}
            <p className="text-sm text-slate-600"><MathText>{METHOD.reorder.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD.special.text}</MathText></p>
          </div>
        ),
      },
      {
        id: 'tawzi-aadad', type: 'methodes', title: 'توزيع الضرب في الاتجاهين',
        predictPrompt: 'حسبتَ $(-3{,}2) \\times 7 + (-3{,}2) \\times 3$ ذهنيًا. ماذا فعلتَ بالعامل $-3{,}2$ ؟',
        summary: 'k × a + k × b = k × (a + b) و k × (a − b) = k × a − k × b على الأعداد : نخرج العامل المشترك أو ننشر الجداء لنحسب ذهنيًا.',
        body: P(distribute.text),
      },
    ],
  },
};
