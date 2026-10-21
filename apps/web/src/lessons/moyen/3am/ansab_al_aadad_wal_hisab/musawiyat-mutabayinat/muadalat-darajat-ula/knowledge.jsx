import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « المعادلات من الدرجة الأولى بمجهول واحد » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js :
 * معارف 4–5 p. 76 et طرائق p. 77, réécrits). L'équation « a ÷ … = b » (2AM), la réduction d'une expression et les propriétés des égalités sont des
 * prérequis (`priorKnowledge`), mesurés par « أستعدّ », jamais des items ici.
 */
const { definition, solution, check, sign, divide, model } = KNOWLEDGE;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'naql-hadd', type: 'regles', title: 'الحدّ الذي يعبر يغيّر إشارته',
        predictPrompt: 'في العبّارة عبر الصندوق إلى الضفّة الأخرى بعكس إشارته ولم تنكسر المعادلة. ماذا يحدث لإشارة حدّ ينتقل من طرف إلى آخر؟ ولماذا؟ اكتب القاعدة بكلماتك.',
        summary: 'عندما ينتقل حدّ إلى الطرف الآخر تتغيّر إشارته، لأنّنا أضفنا معاكسه إلى الطرفين.',
        body: (
          <div className="space-y-2">
            <p><MathText>{sign.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{GUIDE.moved}</MathText></p>
          </div>
        ),
      },
      {
        id: 'qisma-muamil', type: 'regles', title: 'نقسم على معامل x',
        predictPrompt: 'بقي $x$ وحده مضروبًا في عدد، مثل $4x = 12$ . ماذا فعلتَ بالعدد $4$ لتجد $x$ ؟ اكتب ما تفعله دائمًا.',
        summary: 'عندما يبقى ax = n (a ≠ 0) نقسم الطرفين على a فنجد x = n/a.',
        body: <p><MathText>{divide.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'muadala-taarif', type: 'vocabulaire', title: 'المعادلة من الدرجة الأولى', predict: false,
        summary: 'المعادلة مساواة فيها مجهول؛ ومن الشكل ax + b = cx + d بمجهول واحد هي معادلة من الدرجة الأولى بمجهول واحد.',
        body: <p><MathText>{definition.text}</MathText></p>,
      },
      {
        id: 'hall-muadala', type: 'vocabulaire', title: 'حلّ معادلة', predict: false,
        summary: 'حلّ معادلة هو قيمة المجهول التي تجعل الطرفين متساويين.',
        body: <p><MathText>{solution.text}</MathText></p>,
      },
      {
        id: 'tahqqaq-taawid', type: 'methodes', title: 'أتحقق بالتعويض',
        predictPrompt: 'كيف تتأكّد أنّ عددًا حلّ لمعادلة دون أن تحلّها من جديد؟ اكتب ما تحسبه.',
        summary: 'نعوّض العدد في الطرفين ونحسب كلًّا منهما: إذا ساويا العدد نفسه فهو حلّ.',
        body: <p><MathText>{check.text}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'tariqat-hall', type: 'methodes', title: 'مراحل حلّ معادلة',
        predictPrompt: 'في $6x - 5 = 2x + 7$ ماذا فعلتَ أوّلًا، وماذا ثانيًا، وماذا أخيرًا؟ اكتب المراحل بترتيبها.',
        summary: METHOD.solve.rule,
        body: <p><MathText>{METHOD.solve.rule}</MathText></p>,
      },
      {
        id: 'tarhiq-mushkila', type: 'methodes', title: 'أرييض مشكلة',
        predictPrompt: 'قبل أن تكتب المعادلة في مشكلة الأقلام: ماذا اخترتَ، وماذا ترجمتَ؟ وبعد الحلّ ماذا فعلتَ؟ اكتب المراحل.',
        summary: 'نختار المجهول مع وحدته، نترجم المعطيات، نكتب معادلة ونحلّها، نصرّح بالحلّ ونتحقق منه في نص المشكلة.',
        body: (
          <div className="space-y-2">
            <p><MathText>{model.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{model.example}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
