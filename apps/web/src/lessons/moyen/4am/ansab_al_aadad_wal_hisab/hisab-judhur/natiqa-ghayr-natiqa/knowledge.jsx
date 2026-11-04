import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, QIMA_MUQARRABA } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/** `R(x)` : ce qui CHANGE dans la règle d'une fiche `memo`, en rouge. */
const R = (x) => `\\textcolor{#e11d48}{${x}}`;

/**
 * Les connaissances du درس 2 de l'unité 2 — SOURCE UNIQUE, construite depuis
 * content/textbook.js (معارف 2 p. 22, et le rappel des valeurs approchées).
 *
 *   module 1  murabba-natiq    1er résultat de معارف 2 et l'exemple 25/9 — nommé après le geste
 *                              (نشاط 2 : les racines tombées sur une graduation)
 *   module 2  ghayr-natiq      2e résultat de معارف 2 et l'exemple √6
 *   module 3  qima-muqarraba   rappel (années antérieures) : بالنقصان / بالزيادة / المدوّر
 */
const [resNatiq, resGhayr] = KNOWLEDGE.results;
const [exNatiq, exGhayr] = KNOWLEDGE.examples;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'murabba-natiq', type: 'regles', title: 'جذر مربع عدد ناطق',
        memo: {
          rule: `a=${R('\\left(\\dfrac{p}{q}\\right)^2')}\\Rightarrow\\sqrt{a}=\\dfrac{p}{q}`,
          hook: 'مربّع كسر يعني جذر ناطق',
          example: `\\sqrt{\\dfrac{16}{9}}=${R('\\dfrac{4}{3}')}`,
          trap: 'الظنّ أنّ الجذر ناطق لمجرّد أنّ العدد صحيح',
          exam: 'بيّن أنّ العدد مربّع كسر ثم استنتج أنّ جذره ناطق',
          chip: `\\sqrt{\\tfrac{p^2}{q^2}}=${R('\\tfrac{p}{q}')}`,
          quiz: [
            { q: '$\\sqrt{\\dfrac{25}{4}}=$', options: ['$\\dfrac{5}{2}$', '$\\dfrac{25}{2}$', '$\\dfrac{5}{4}$'], correct: 0 },
            { q: 'أيّ هذه الجذور عدد ناطق؟', options: ['$\\sqrt{\\dfrac{49}{9}}$', '$\\sqrt{7}$', '$\\sqrt{\\dfrac{3}{4}}$'], correct: 0 },
          ],
        },
        predictPrompt: 'على المسطرة وقع ضلع المربّع على تدريجة للمساحات 9 و 0,25 و $\\frac{16}{9}$ (الأضلاع 3 و $\\frac{1}{2}$ و $\\frac{4}{3}$)، ولم يقع على أيّ تدريجة للمساحات 7 و 6 و 13. ما الذي يميّز العدد $a$ تحت الجذر في الصنف الأول؟ اكتب بكلماتك متى يكون $\\sqrt{a}$ عددًا ناطقًا.',
        summary: 'إذا كان a مربعًا لعدد ناطق فإن الجذر التربيعي لـ a عدد ناطق.',
        body: (
          <div className="space-y-2">
            <p><MathText>{KNOWLEDGE.text}</MathText></p>
            <p><MathText>{resNatiq}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{exNatiq}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'ghayr-natiq', type: 'regles', title: 'جذر عدد ليس مربعًا لعدد ناطق',
        memo: {
          rule: `a\\neq\\left(\\dfrac{p}{q}\\right)^2\\Rightarrow${R('\\sqrt{a}\\notin\\mathbb{Q}')}`,
          hook: 'ليس مربّع كسر: غير ناطق',
          example: `\\sqrt{6}${R('\\notin\\mathbb{Q}')}`,
          trap: 'اعتبار القيمة العشرية للحاسبة قيمة مضبوطة فيبدو الجذر ناطقًا',
          exam: 'علّل بأنّ العدد ليس مربّع عدد ناطق',
          chip: `\\sqrt{6}${R('\\notin\\mathbb{Q}')}`,
          quiz: [
            { q: 'أيّ هذه الأعداد غير ناطق؟', options: ['$\\sqrt{6}$', '$\\sqrt{36}$', '$\\sqrt{0{,}25}$'], correct: 0 },
            { q: 'لماذا $\\sqrt{10}$ عدد غير ناطق؟', options: ['لأنّ $10$ ليس مربّع عدد ناطق', 'لأنّ $10$ عدد زوجي', 'لأنّ $10$ أكبر من $9$'], correct: 0 },
          ],
        },
        predictPrompt: 'في النشاط لم يقع $\\sqrt{7}$ ولا $\\sqrt{6}$ ولا $\\sqrt{13}$ على أيّ تدريجة، حتى مع الأجزاء من 12، ولا تجد عددًا ناطقًا مربعه 7 أو 6 أو 13. ماذا تستنتج عن نوع العدد $\\sqrt{a}$ في هذه الحالة؟ اكتب القاعدة بكلماتك.',
        summary: 'إذا لم يكن a مربعًا لعدد ناطق فإن الجذر التربيعي لـ a ليس عددًا ناطقًا.',
        body: (
          <div className="space-y-2">
            <p><MathText>{resGhayr}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{exGhayr}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'qima-muqarraba', type: 'methodes', title: 'القيم المقرّبة والمدوّر',
        memo: {
          rule: `${R('a')}<\\sqrt{x}<${R('b')}`,
          hook: 'احصر ثم اختر الأقرب',
          example: `1{,}7<\\sqrt{3}<1{,}8\\Rightarrow\\sqrt{3}\\approx${R('1{,}7')}`,
          trap: 'اعتبار القيمة المقرّبة بالزيادة هي المدوّر دائمًا',
          exam: 'اكتب الحصر ثم قارن المسافتين لاختيار المدوّر',
          chip: `a<\\sqrt{x}<${R('b')}`,
          quiz: [
            { q: 'الحصر الصحيح لـ $\\sqrt{5}$ بوحدة $0{,}1$ :', options: ['$2{,}2<\\sqrt{5}<2{,}3$', '$2{,}3<\\sqrt{5}<2{,}4$', '$2{,}1<\\sqrt{5}<2{,}2$'], correct: 0 },
            { q: 'مدوّر $\\sqrt{2}$ إلى $0{,}1$ هو:', options: ['$1{,}4$', '$1{,}5$', '$1{,}41$'], correct: 0 },
          ],
        },
        predictPrompt: 'في «معارف» عرضت الحاسبة للعدد $\\sqrt{2}$ القيمة 1,414213562، وهي ليست قيمته المضبوطة. بين أيّ عددين عشريين متتاليين برقمين بعد الفاصلة يقع $\\sqrt{2}$؟ أيّهما تسمّيه القيمة المقرّبة بالنقصان، وأيّهما بالزيادة، وكيف تختار المدوّر؟ اكتب الطريقة.',
        summary: 'القيمة المقرّبة بالنقصان والقيمة المقرّبة بالزيادة تحصران العدد؛ المدوّر أقربهما إليه.',
        body: (
          <div className="space-y-2">
            <p><MathText>{QIMA_MUQARRABA.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{QIMA_MUQARRABA.example}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{QIMA_MUQARRABA.rule}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
