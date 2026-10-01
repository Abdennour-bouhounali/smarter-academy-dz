import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { MODEL_RULE, STEPS, INEQUALITY_RULE, REALITY_RULE, METHOD_MODELLING } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 4 « ترييض مشكلة » — SOURCE UNIQUE, construite à partir de la
 * طريقة p. 49 et des exercices du manuel (content/textbook.js). Une <KnowledgeBrick id="…">
 * dans un module et la carte rendent le même objet.
 *
 *   module 1  tarrid-namdhaja   ce que le laboratoire a fait : chaque grandeur qui change
 *                               porte x, l'équation est l'instant où deux grandeurs s'égalent
 *   module 2  tarrid-tariqa     les quatre étapes du manuel (أ ب جـ التحقق)
 *             tarrid-mutarajiha « أكبر من أو يساوي », « أقصر » → une متراجحة (دوري الآن 2)
 *             tahaqquq-waqi     la solution doit convenir à la situation (ex. 30, 40)
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'tarrid-namdhaja', type: 'concepts', title: 'ترييض مشكلة: من النص إلى المعادلة',
        summary: 'نسمّي المجهول x، ونعبّر بدلالته عن كل كمية تتغيّر معه؛ المعادلة تترجم لحظة تساوي كميتين.',
        body: (
          <div className="space-y-2">
            <p><MathText>{MODEL_RULE.text}</MathText></p>
            <p className="text-sm text-slate-600"><MathText>{METHOD_MODELLING.solution[1]}</MathText></p>
          </div>
        ),
      },
    ],
    2: [
      {
        id: 'tarrid-tariqa', type: 'methodes', title: 'طريقة ترييض مشكلة',
        summary: 'أربع خطوات: نسمّي المجهول، نعبّر عن الوضعية بمعادلة أو متراجحة، نحلّها، ثم نتحقّق من الحل في نص المشكلة.',
        body: (
          <ol className="space-y-1">
            {[STEPS.name, STEPS.express, STEPS.solve, STEPS.check].map((s) => <li key={s}><MathText>{s}</MathText></li>)}
          </ol>
        ),
      },
      {
        id: 'tarrid-mutarajiha', type: 'concepts', title: 'مشكلة تترجمها متراجحة',
        summary: 'عندما يسأل النص عن «أكبر من» أو «أصغر من» أو «أقصر» نعبّر بمتراجحة، ثم نختار من حلولها ما يجيب عن السؤال.',
        body: <p><MathText>{INEQUALITY_RULE.text}</MathText></p>,
      },
      {
        id: 'tahaqquq-waqi', type: 'regles', title: 'حلّ يلائم الواقع',
        summary: 'نحتفظ فقط بالحلول التي تلائم الوضعية: طول أو مدة لا يكون سالبًا، وعدد أشياء يكون عددًا طبيعيًا.',
        body: <p><MathText>{REALITY_RULE.text}</MathText></p>,
      },
    ],
  },
};
