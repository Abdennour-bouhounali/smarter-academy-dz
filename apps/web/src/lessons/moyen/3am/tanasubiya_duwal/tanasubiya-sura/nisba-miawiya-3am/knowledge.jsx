import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « النسبة المئوية » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 2 p. 90 et طرائق p. 91,
 * réécrits). Le pourcentage de la 2AM (leçon `nisba-miawiya`) est un prérequis (`priorKnowledge`), mesuré par « أستعدّ », jamais un item ici : la leçon
 * le TRAITE comme une situation de proportionnalité.
 */
const { definition, property, table, example, change, base } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'khana-qima', type: 'regles', title: 'قيمة الخانة الواحدة',
        predictPrompt: 'في الصينية قُسِّم المخزون إلى مئة خانة متساوية. ماذا تساوي الخانة الواحدة من المخزون؟ اكتب كيف تحسبها.',
        summary: 'الخانة الواحدة تساوي المخزون مقسومًا على 100.',
        body: <p><MathText>{GUIDE.oneCell}</MathText></p>,
      },
      {
        id: 'hissa-t', type: 'regles', title: 'نسبة مئوية من عدد',
        predictPrompt: 'رسمتَ $t$ خانة من مخزون $x$ فحملت السلّة جزءًا منه. كيف تحسب ما تحمله السلّة من $t$ و $x$ ؟ اكتب القاعدة بكلماتك.',
        summary: 't % من عدد x هي x × t/100: t خانة من المئة، كلّ خانة x/100.',
        body: <p><MathText>{property.text}</MathText></p>,
      },
      {
        id: 'ziyada-nuqsan', type: 'regles', title: 'الزيادة والتخفيض بنسبة مئوية',
        predictPrompt: 'زاد المخزون بـ $15\\%$ فأضفتَ خانات إلى المئة. كم خانة صار المخزون؟ وبأيّ عدد ضربتَ المخزون الأول لتجد الجديد؟ وماذا لو نقص بـ $15\\%$ ؟',
        summary: 'الزيادة بـ t % هي الضرب في 1 + t/100 ، والتخفيض بـ t % هو الضرب في 1 − t/100.',
        body: (
          <div className="space-y-2">
            <p><MathText>{change.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.moved}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'nisba-taarif', type: 'vocabulaire', title: 'النسبة المئوية', predict: false,
        summary: 'النسبة المئوية t % هي الكسر t/100 : t جزءًا من مئة جزء متساوٍ.',
        body: <p><MathText>{definition.text}</MathText></p>,
      },
      {
        id: 'nisba-jadwal', type: 'methodes', title: 'جدول التناسبية 100 ↔ الكلّ',
        predictPrompt: 'في الصينية رسمتَ خانات حتى حملت السلّة عددًا معلومًا. كيف تجد النسبة المئوية من الجزء $a$ والكلّ $b$ ؟ اكتب المساواة التي استعملتها.',
        summary: 'الكلّ b يقابله 100 والجزء a يقابله t : a/b = t/100.',
        body: (
          <div className="space-y-2">
            <p><MathText>{table.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{example.text}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tariqat-hisab', type: 'methodes', title: 'ثلاث حالات للنسبة المئوية',
        predictPrompt: 'في جدول التناسبية (الكلّ ↔ 100 ، الجزء ↔ $t$ ) قد يكون المجهول الجزء أو النسبة أو الكلّ. كيف تحسب كلّ حالة؟ اكتب الحالات الثلاث.',
        summary: METHOD.cases.rule,
        body: <p><MathText>{METHOD.cases.rule}</MathText></p>,
      },
      {
        id: 'tatabu', type: 'regles', title: 'تغيّران متتاليان',
        predictPrompt: 'زاد ثمن بـ $20\\%$ ثم نقص بـ $20\\%$ . هل عاد إلى ثمنه الأول؟ ولماذا؟ اكتب ما تفعله بالمعاملين.',
        summary: METHOD.change.rule,
        body: (
          <div className="space-y-2">
            <p><MathText>{METHOD.change.rule}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{base.text}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
