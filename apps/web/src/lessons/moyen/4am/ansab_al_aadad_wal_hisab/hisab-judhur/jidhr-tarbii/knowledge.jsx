import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { ACTIVITY, KNOWLEDGE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** `R(x)` : ce qui CHANGE dans la règle d'une fiche `memo`, en rouge. */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

/**
 * Les connaissances du درس « الجذر التربيعي لعدد موجب » — SOURCE UNIQUE,
 * construite à partir du manuel (content/textbook.js). Une <KnowledgeBrick id>
 * dans un module et la carte rendent le même objet.
 *
 *   module 1 (نشاط 1)  qima-mudbuta — l'encadré « نرمز بـ √5 … », posé après la
 *                      calculatrice et إيمان ; jidhr-taarif — la définition
 *                      générale (معارف 1), posée avant la question 3.
 *   module 2 (معارف 1) murabba-jidhr, jidhr-murabba — les deux propriétés.
 */
const [propSquareOfRoot, propRootOfSquare] = KNOWLEDGE.properties;
const [exSquareOfRoot, exRootOfSquare] = KNOWLEDGE.propertyExamples;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'qima-mudbuta', type: 'concepts', title: 'القيمة المضبوطة',
        memo: {
          rule: `(${R('\\sqrt{5}')})^2=5`,
          hook: 'الرمز مضبوط والحاسبة تقرّب',
          example: `2{,}236^2=4{,}999696${R('\\neq')}5`,
          trap: 'اعتبار ما تعرضه الحاسبة هو الجذر نفسه',
          exam: 'اترك الجواب على شكل جذر ولا تكتب القيمة العشرية إلا للتقريب',
          chip: `\\sqrt{5}${R('\\approx')}2{,}236`,
          quiz: [
            { q: 'القيمة المضبوطة للعدد الموجب الذي مربّعه $5$ هي:', options: ['$\\sqrt{5}$', '$2{,}236$', '$2{,}5$'], correct: 0 },
            { q: 'لماذا تُعدّ $2{,}236$ قيمة مقرّبة لـ $\\sqrt{5}$ ؟', options: ['لأنّ مربّعها $4{,}999696$ وليس $5$', 'لأنّ مربّعها يساوي $5$ بالضبط', 'لأنّها أكبر من $\\sqrt{5}$ دائمًا'], correct: 0 },
          ],
        },
        predictPrompt: 'ربّعتَ العدد 2,236067978 الذي عرضته الحاسبة فلم تجد 5، ومع ذلك فالطول $BC$ موجود ومربّعه 5. ماذا يمثّل هذا العدد بالنسبة إلى $BC$؟ وكيف تقترح أن نكتب $BC$ دون أيّ خطأ في الأرقام؟ اكتب ما تستنتجه بكلماتك.',
        summary: 'نرمز بـ $\\sqrt{5}$ للقيمة المضبوطة للعدد الموجب الذي مربعه 5؛ العدد 2,236067978 الذي تعرضه الحاسبة قيمة مقربة له فقط، لأن مربعه لا يساوي 5.',
        body: (
          <div className="space-y-2">
            <p><MathText>{ACTIVITY.box}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{ACTIVITY.questions[2]}</MathText></p>
          </div>
        ),
      },
      {
        id: 'jidhr-taarif', type: 'concepts', title: 'الجذر التربيعي لعدد موجب',
        memo: {
          rule: `\\sqrt{a}=x\\iff x^2=a\\quad ${R('x\\geq 0')}`,
          hook: 'الموجب الذي مربّعه العدد',
          example: `\\sqrt{49}=${R('7')}\\quad(7^2=49)`,
          trap: 'كتابة جذرين تربيعيين مع أنّ الجذر التربيعي واحد وموجب',
          exam: 'اكتب: العدد الموجب الذي مربّعه كذا',
          chip: `\\sqrt{a}${R('\\geq 0')}`,
          quiz: [
            { q: '$\\sqrt{81}=$', options: ['$9$', '$\\pm 9$', '$40{,}5$'], correct: 0 },
            { q: '$\\sqrt{0{,}04}=$', options: ['$0{,}2$', '$0{,}02$', '$0{,}4$'], correct: 0 },
          ],
        },
        predictPrompt: 'الطول $BC$ مربّعه 5، وضلع المربّع الذي مساحته 36 طوله 6. لو أعطيناك عددًا موجبًا آخر $a$ (مثلًا 81 أو 0,49)، ما العدد الذي نرمز له بـ $\\sqrt{a}$؟ اكتب تعريفه بكلماتك، ثم كيف نقرأ هذا الرمز.',
        summary: '$a$ عدد موجب: $\\sqrt{a}$ هو العدد الموجب الذي مربعه يساوي $a$، ونقرأ «الجذر التربيعي لـ $a$».',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.definition}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{KNOWLEDGE.examples[0]}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'murabba-jidhr', type: 'regles', title: 'مربع الجذر التربيعي',
        memo: {
          rule: `(\\sqrt{a})^2=${R('a')}`,
          hook: 'تربيع الجذر يعيد العدد',
          example: `(\\sqrt{7})^2=${R('7')}`,
          trap: 'ضرب الجذر في اثنين بدل ضربه في نفسه',
          exam: 'اذكر أن العدد تحت الجذر موجب ثم اكتب الناتج',
          chip: `(\\sqrt{a})^2=${R('a')}`,
          quiz: [
            { q: '$(\\sqrt{13})^2=$', options: ['$13$', '$\\sqrt{13}$', '$26$'], correct: 0 },
            { q: '$(3\\sqrt{2})^2=$', options: ['$18$', '$6$', '$9\\sqrt{2}$'], correct: 0 },
          ],
        },
        predictPrompt: 'في النشاط أكملتَ $(\\sqrt{5})^2$، وهنا تحقّقتَ أنّ ضلع المربّع الذي مساحته 0,04 هو $\\sqrt{0{,}04}$. ماذا تحصل عليه دائمًا عندما تربّع الجذر التربيعي لعدد موجب $a$؟ اكتب القاعدة بمساواة.',
        summary: '$a$ عدد موجب: $(\\sqrt{a})^2 = a$.',
        body: (
          <div className="space-y-2">
            <p><MathText>{propSquareOfRoot}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{exSquareOfRoot}</MathText></p>
          </div>
        ),
      },
      {
        id: 'jidhr-murabba', type: 'regles', title: 'الجذر التربيعي لمربع',
        memo: {
          rule: `\\sqrt{a^2}=${R('a')}\\quad(a\\geq 0)`,
          hook: 'جذر المربّع يعيد الموجب',
          example: `\\sqrt{(-3)^2}=\\sqrt{9}=${R('3')}`,
          trap: 'اعتبار جذر مربّع عدد سالب سالبًا',
          exam: 'إن كان العدد سالبًا فالناتج هو معاكسه الموجب',
          chip: `\\sqrt{a^2}=${R('a')}`,
          quiz: [
            { q: '$\\sqrt{11^2}=$', options: ['$11$', '$121$', '$22$'], correct: 0 },
            { q: '$\\sqrt{(-5)^2}=$', options: ['$5$', '$-5$', '$25$'], correct: 0 },
          ],
        },
        predictPrompt: 'في النشاط أكملتَ $\\sqrt{2^2}$ ، $\\sqrt{3^2}$ ، $\\sqrt{5^2}$. إذا كان $a$ عددًا موجبًا، كيف تكتب $\\sqrt{a^2}$ دون أن تحسب $a^2$؟ اكتب القاعدة بمساواة، واذكر الشرط على $a$.',
        summary: '$a$ عدد موجب: $\\sqrt{a^2} = a$.',
        body: (
          <div className="space-y-2">
            <p><MathText>{propRootOfSquare}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{exRootOfSquare}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
