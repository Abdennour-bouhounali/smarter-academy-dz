import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { STEPS, TRANSLATION_RULE, CHECK_RULE, ACTIVITY_SOLUTION } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 3 « حل مشكلات بتوظيف جمل معادلتين » — SOURCE UNIQUE, construite à partir
 * de نشاط 3 (le musée, p. 57) et de son tableau (content/textbook.js). Une <KnowledgeBrick id="…">
 * dans un module et la carte rendent le même objet.
 *
 *   module 1  jumla-tarjama   ce que le laboratoire a fait : une information → une équation, une
 *                             seule unité par équation (des personnes, des dinars)
 *             khutuwat-hall   les cinq étapes du tableau du manuel
 *   module 2  tahaqquq-nas    on vérifie dans l'HISTOIRE (pas seulement dans la jumla), la réponse a
 *                             un sens (un nombre de personnes est naturel), et on répond par une phrase
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'jumla-tarjama', type: 'concepts', title: 'ترجمة مشكلة بجملة معادلتين',
        summary: 'نسمّي المجهولين x و y، ونترجم كل معلومة من النص بمعادلة بدلالتهما، بوحدة واحدة في المعادلة الواحدة: عدد مع عدد، ودنانير مع دنانير.',
        body: (
          <div className="space-y-2">
            <p><MathText>{TRANSLATION_RULE.text}</MathText></p>
            <p className="text-sm text-slate-600" dir="ltr"><MathText>{ACTIVITY_SOLUTION.system}</MathText></p>
          </div>
        ),
      },
      {
        id: 'khutuwat-hall', type: 'methodes', title: 'مراحل حل مشكلة بجملة معادلتين',
        summary: 'خمس مراحل: نختار المجهولين، نترجم المشكلة بجملة معادلتين، نحل الجملة بطريقة مناسبة، نتحقق من النتيجة، ثم نجيب عن السؤال.',
        body: (
          <ol className="space-y-1">
            {[STEPS.choose, STEPS.translate, STEPS.solve, STEPS.check, STEPS.answer].map((s) => <li key={s}><MathText>{s}</MathText></li>)}
          </ol>
        ),
      },
    ],
    2: [
      {
        id: 'tahaqquq-nas', type: 'regles', title: 'نتحقق في نص المشكلة ونجيب بجملة',
        summary: 'نعوّض العددين في معطيات النص نفسه، ونتأكد أن الجواب يلائم القصة (عدد أشخاص أو قطع يكون عددا طبيعيا)، ثم نجيب عن السؤال بجملة تذكر العددين.',
        body: <p><MathText>{CHECK_RULE.text}</MathText></p>,
      },
    ],
  },
};
