import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, NINE, METHOD } from './content/textbook';

// La carte progressive de la leçon — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « قواعد قابلية القسمة » (1AM) — SOURCE UNIQUE (content/textbook.js : معارف 3 p. 41, طريقة
 * p. 42 ; la règle de 9 formalisée par la plateforme à partir de l'exercice 23).
 */
/** La partie de la règle qui CHANGE, en couleur, dans la fiche de mémoire (`memo`, KNOWLEDGE_MAP « The memo card »). */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'qabiliya-2-5', type: 'regles', title: 'القسمة على 2 وعلى 5',
        memo: {
          rule: `${R('0,2,4,6,8')}\\to 2\\quad ${R('0,5')}\\to 5`,
          hook: 'رقم الآحاد يقرّر',
          example: `953${R('4')}\\to 2,\\quad 943${R('5')}\\to 5`,
          trap: 'لا تجمع الأرقام لـ 2 و 5: انظر إلى رقم الآحاد فقط',
          exam: 'اذكر رقم الآحاد، ثم احكم',
          chip: `${R('u')}\\to 2,\\,5`,
          quiz: [
            { q: 'أيّ عدد يقبل القسمة على 5؟', options: ['$3470$', '$3457$', '$5543$'], correct: 0 },
            { q: 'أيّ عدد يقبل القسمة على 2؟', options: ['$9534$', '$9543$', '$2225$'], correct: 0 },
          ],
        },
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
        memo: {
          rule: `\\overline{abc}\\to ${R('a+b+c')}`,
          hook: 'اجمع الأرقام، ثم احكم',
          example: `9534:\\ 9+5+3+4=${R('21')}`,
          trap: 'رقم الآحاد لا يكفي لـ 3: 13 و 33 لهما الآحاد نفسه',
          exam: 'اكتب مجموع الأرقام، ثم احكم على المجموع',
          chip: `${R('a+b+c')}\\to 3`,
          quiz: [
            { q: 'أيّ عدد يقبل القسمة على 3؟', options: ['$2019$', '$2018$', '$2020$'], correct: 0 },
            { q: 'مجموع أرقام $474$ :', options: ['$15$', '$14$', '$474$'], correct: 0 },
          ],
        },
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
        memo: {
          rule: `${R('a+b+c')}\\to 9`,
          hook: 'المجموع مضاعف لـ 9',
          example: `918:\\ 9+1+8=${R('18')}`,
          trap: 'كل مضاعف لـ 9 مضاعف لـ 3، والعكس غير صحيح: 150',
          exam: 'اجمع الأرقام: إن قبل المجموع القسمة على 9 قبلها العدد',
          chip: `${R('a+b+c')}\\to 9`,
          quiz: [
            { q: 'أيّ عدد يقبل القسمة على 9؟', options: ['$918$', '$174$', '$150$'], correct: 0 },
            { q: '$174$ يقبل القسمة على 3. وعلى 9؟', options: ['لا يقبلها', 'يقبلها', 'لا نعرف دون قسمة'], correct: 0 },
          ],
        },
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
        memo: {
          rule: `a=b\\times q+${R('0')}`,
          hook: 'يقبل القسمة: الباقي صفر',
          example: `2019=3\\times 673+${R('0')}`,
          trap: 'الحاصل لا يقرّر: الباقي وحده يقرّر',
          exam: 'اكتب القسمة الإقليدية، وبيّن أنّ الباقي 0',
          chip: `r=${R('0')}`,
          quiz: [
            { q: '$48=5\\times 9+3$ ، إذن العدد 48 :', options: ['لا يقبل القسمة على 5', 'يقبل القسمة على 5', 'يقبل القسمة على 9'], correct: 0 },
            { q: 'أيّ مساواة تبيّن أنّ $36$ يقبل القسمة على 4؟', options: ['$36=4\\times 9+0$', '$36=4\\times 8+4$', '$36=5\\times 7+1$'], correct: 0 },
          ],
        },
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
        memo: {
          rule: `\\overline{ab${R('cd')}}\\to ${R('\\overline{cd}')}`,
          hook: 'آخر رقمين يكفيان',
          example: `1${R('16')}:\\ ${R('16')}=4\\times 4`,
          trap: 'الزوجي لا يقبل دائمًا القسمة على 4: 9534',
          exam: 'اختبر العدد المكوَّن من رقمَي العشرات والآحاد',
          chip: `${R('\\overline{cd}')}\\to 4`,
          quiz: [
            { q: 'أيّ عدد يقبل القسمة على 4؟', options: ['$2024$', '$2018$', '$2030$'], correct: 0 },
            { q: '$9534$ عدد زوجي. هل يقبل القسمة على 4؟', options: ['لا: 34 لا يقبلها', 'نعم: لأنّه زوجي', 'نعم: لأنّ 4 أحد أرقامه'], correct: 0 },
          ],
        },
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
