import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, NINE, METHOD } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « قواعد قابلية القسمة » (1AM) — SOURCE UNIQUE (content/textbook.js : معارف 3 p. 41, طريقة
 * p. 42 ; la règle de 9 formalisée par la plateforme à partir de l'exercice 23).
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'qabiliya-2-5', type: 'regles', title: 'القسمة على 2 وعلى 5',
        predictPrompt: 'في الجدول لوّنت مضاعفات 2 ثم مضاعفات 5، وجمعت أرقام آحادها. كيف نعرف دون أن نقسم أنّ عددًا يقبل القسمة على 2؟ وعلى 5؟ اكتب القاعدتين بكلماتك.',
        summary: 'يقبل عدد طبيعي القسمة على 2 إذا كان رقم آحاده 0 أو 2 أو 4 أو 6 أو 8 (عدد زوجي)، وعلى 5 إذا كان رقم آحاده 0 أو 5.',
        body: (
          <div className="space-y-2">
            <p>{KNOWLEDGE.rule2}</p>
            <p>{KNOWLEDGE.rule5}</p>
            <p className="text-sm text-slate-600">{KNOWLEDGE.examples[0]} {KNOWLEDGE.examples[1]}</p>
          </div>
        ),
      },
      {
        id: 'qabiliya-3', type: 'regles', title: 'القسمة على 3',
        predictPrompt: 'في الجدول، مضاعفات 3 لا تنتهي برقم واحد (3 ، 12 ، 21 ، 30…). ماذا لاحظت عندما جمعت أرقام كل واحد منها؟ متى يقبل عدد القسمة على 3؟ اكتب القاعدة بكلماتك.',
        summary: 'يقبل عدد طبيعي القسمة على 3 إذا كان مجموع أرقامه يقبل القسمة على 3.',
        body: (
          <div className="space-y-2">
            <p>{KNOWLEDGE.rule3}</p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[2]}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'qabiliya-9', type: 'regles', title: 'القسمة على 9',
        predictPrompt: '150 و 174 يقبلان القسمة على 3 ولا يقبلانها على 9، أمّا 918 فيقبلها على 9. اجمع أرقام كل عدد: متى يقبل عدد القسمة على 9؟ اكتب القاعدة بكلماتك.',
        summary: 'يقبل عدد طبيعي القسمة على 9 إذا كان مجموع أرقامه يقبل القسمة على 9؛ وكل عدد يقبل القسمة على 9 يقبلها على 3.',
        body: (
          <div className="space-y-2">
            <p>{NINE.rule}</p>
            <p className="text-sm text-slate-600"><MathText>{NINE.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'qabiliya-baqi', type: 'concepts', title: 'معنى «يقبل القسمة على»', predict: false,
        summary: 'يقبل العدد a القسمة على العدد b (غير المعدوم) معناه أنّ باقي القسمة الإقليدية لـ a على b هو 0، أي a مضاعف لـ b.',
        body: (
          <div className="space-y-2">
            <p><MathText>{'العدد $a$ يقبل القسمة على $b$ ($b \\neq 0$) معناه: باقي القسمة الإقليدية لـ $a$ على $b$ هو 0 ، أي $a = b \\times q$.'}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{'مثال: $2019 = 3 \\times 673 + 0$ : 2019 يقبل القسمة على 3. أمّا $2018 = 3 \\times 672 + 2$ فلا.'}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'qabiliya-4', type: 'methodes', title: 'القسمة على 4',
        predictPrompt: '100 حبّة حلوى تُوزّع بالتساوي على 4 أكياس، ثم 116 = 100 + 16 و 103 = 100 + 3. أيّ جزء من العدد يكفي أن ننظر إليه لنعرف إن كان يقبل القسمة على 4؟ اكتب الطريقة.',
        summary: 'لمعرفة قابلية قسمة عدد على 4 نختبر العدد المشكّل من رقمي آحاده وعشراته: إذا قبل القسمة على 4 قبلها العدد كلّه، وإلّا فلا.',
        body: (
          <div className="space-y-2">
            <p>{METHOD.box}</p>
            <p className="text-sm text-slate-600">{METHOD.examples[0]} {METHOD.examples[1]}</p>
          </div>
        ),
      },
    ],
  },
};
