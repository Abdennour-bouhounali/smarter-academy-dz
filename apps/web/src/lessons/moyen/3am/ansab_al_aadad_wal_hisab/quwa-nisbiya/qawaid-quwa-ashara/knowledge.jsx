import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { KNOWLEDGE, METHOD, GUIDE } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس « قواعد الحساب على قوى العدد 10 » (3AM) — SOURCE UNIQUE, construite à partir du contenu (content/textbook.js : معارف 3 p. 42, طرائق et دوري الآن
 * p. 43, réécrits). La décimale de 10ⁿ, 10⁰ et 10⁻ⁿ (leçon `quwa-adad-ashara`) et les unités (`wahdat`) ne sont PAS des items ici : ce sont des prérequis (`priorKnowledge`),
 * mesurés par « أستعدّ ». Le rappel de `quwat-adad-nisbi` est un encadré lié du module 2, pas un item.
 */
const { product, quotient, power, noSum } = KNOWLEDGE;
const L = (s) => <p className="text-center" dir="ltr"><MathText>{s}</MathText></p>;

export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'jidaa-quwa-ashara', type: 'regles', title: 'جداء قوتين للعدد 10',
        predictPrompt: 'شريطان متتابعان قطعا 3 أعمدة ثم 3 أعمدة. كم عمودًا بين لوحتي البداية والنهاية؟ وماذا يحدث للأسّين في $10^m \\times 10^n$ ؟',
        summary: '10ᵐ × 10ⁿ = 10ᵐ⁺ⁿ : نجمع الأسّين.',
        body: (
          <div className="space-y-2">
            <p><MathText>{product.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{product.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'hasil-quwa-ashara', type: 'regles', title: 'حاصل قسمة قوتين للعدد 10',
        predictPrompt: 'بين لوحة كم ولوحة سم 5 أعمدة، وهما على جهتي لوحة المتر. اكتب قاعدة $\\frac{10^m}{10^n}$ ، وانتبه إلى إشارة الأسّ السالب.',
        summary: '10ᵐ / 10ⁿ = 10ᵐ⁻ⁿ : ننقص أسّ المقام من أسّ البسط.',
        body: (
          <div className="space-y-2">
            <p><MathText>{quotient.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{quotient.example}</MathText></p>
          </div>
        ),
      },
      {
        id: 'quwat-quwa-ashara', type: 'regles', title: 'قوة قوة للعدد 10',
        predictPrompt: 'في جدول المساحة لكل وحدة عمودان: من كم² إلى م² قطع الشريط 6 أعمدة. ماذا تفعل بالأسّين في $(10^m)^n$ ؟',
        summary: '(10ᵐ)ⁿ = 10ᵐⁿ : نضرب الأسّين.',
        body: (
          <div className="space-y-2">
            <p><MathText>{power.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{power.example}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'qawaid-thalatha', type: 'regles', title: 'القواعد الثلاث',
        predictPrompt: 'لخّص بكلماتك: ماذا نفعل بالأسّين في جداء قوتين؟ وفي حاصل قسمتهما؟ وفي قوة قوة؟',
        summary: 'جداء: نجمع الأسّين ؛ قسمة: ننقص ؛ قوة قوة: نضرب.',
        body: (
          <div className="space-y-2">
            {L('$10^m \\times 10^n = 10^{m+n}$')}
            {L('$\\frac{10^m}{10^n} = 10^{m-n}$')}
            {L('$(10^m)^n = 10^{m \\times n}$')}
          </div>
        ),
      },
      {
        id: 'majmu-laysa', type: 'regles', title: 'لا قاعدة للجمع',
        predictPrompt: 'هل $10^2 + 10^3$ يساوي $10^5$ ؟ وهل نصف $10^{10}$ هو $10^5$ ؟ جرّب بحساب كل قوة.',
        summary: 'في مجموع قوتين نحسب كل قوة ثم نجمع ؛ ونصف 10ⁿ ليس 10 أس n/2.',
        body: (
          <div className="space-y-2">
            <p><MathText>{noSum.text}</MathText></p>
          </div>
        ),
      },
    ],
    3: [
      {
        id: 'tabsit-ashara', type: 'methodes', title: 'اختصار عبارة إلى قوة واحدة',
        predictPrompt: 'أمامك عبارة فيها جداءات وقسمة وقوى قوى. بأيّ ترتيب تختصرها لتصل إلى قوة واحدة للعدد 10 ؟',
        summary: 'نختصر البسط والمقام أولًا (قوة قوة ثم جداءات)، ثم نطبّق قاعدة القسمة.',
        body: <p><MathText>{METHOD.chain.rule}</MathText></p>,
      },
      {
        id: 'adad-fi-quwa', type: 'methodes', title: 'جداء وحاصل قسمة عددين من الشكل k × 10ᵖ',
        predictPrompt: 'كيف تحسب $6 \\times 10^4 \\times 5 \\times 10^{-7}$ ؟ ماذا تجمع مع ماذا؟ وهل تعدّل شكل النتيجة؟',
        summary: 'نجمع الأعداد مع الأعداد وقوى العدد 10 مع قوى العدد 10 ثم نطبّق القواعد ؛ والنتيجة تبقى k × 10ᵖ.',
        body: <p><MathText>{METHOD.times.rule}</MathText></p>,
      },
    ],
  },
};
