import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { MODEL_RULE, IMAGE_RULE, EQUAL_RULE, CHEAPER_RULE, METHOD } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Les connaissances du درس 5 « حل مشكلات وترييض وضعيات بتوظيف الدالة التآلفية » — SOURCE UNIQUE.
 * Le manuel n'a ni معارف ni طرائق pour ce sujet : chaque texte est une formulation de la PLATEFORME
 * (`addition('knowledge_formalization')`, content/textbook.js), dans le vocabulaire du manuel, bâtie sur
 * نشاط 4 (p. 79).
 *
 *   module 1  namdhaja-taalufiya   coût = partie fixe b (une fois) + a par unité : f(x) = ax + b, دالة تآلفية
 *             sura-fi-wadiya       le coût de x unités = une image ; les unités pour un budget = l'antécédent
 *   module 2  tasawi-taqatu        coûts égaux ⇔ f(x) = g(x) ⇔ abscisse du point d'intersection
 *             sigha-afdal          la moins chère : f(x) < g(x), la droite du dessous ; elle dépend de x
 *   module 3  khutuwat-mufadala    les étapes : variable, coûts, résoudre / comparer, lire, répondre
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      {
        id: 'namdhaja-taalufiya', type: 'concepts', title: 'تكلفة بجزء ثابت وجزء متغير: دالة تآلفية',
        summary: 'عندما تتكوّن تكلفة من جزء ثابت b يُدفع مرّة واحدة وثمن a يُدفع عن كل وحدة، فإن تكلفة x وحدة هي ax + b: دالة تآلفية.',
        body: <p><MathText>{MODEL_RULE.text}</MathText></p>,
      },
      {
        id: 'sura-fi-wadiya', type: 'methodes', title: 'مبلغ عدد معلوم، وعدد الوحدات لمبلغ معلوم',
        summary: 'مبلغ عدد معلوم من الوحدات هو صورته، وعدد الوحدات لمبلغ معلوم هو العدد الذي صورته هذا المبلغ: نجده بحلّ معادلة.',
        body: <p><MathText>{IMAGE_RULE.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'tasawi-taqatu', type: 'regles', title: 'تساوي تكلفتين: معادلة ونقطة تقاطع',
        summary: 'تتساوى تكلفتا صيغتين عندما تتساوى صورتا x بالدالتين: حلّ هذه المعادلة هو فاصلة نقطة تقاطع المستقيمين.',
        body: <p><MathText>{EQUAL_RULE.text}</MathText></p>,
      },
      {
        id: 'sigha-afdal', type: 'regles', title: 'الصيغة الأرخص: متراجحة ومستقيم تحت الآخر',
        summary: 'تكون صيغة أرخص من أخرى عندما تكون صورة x بدالتها أصغر: نحلّ متراجحة، وبيانيا مستقيمها تحت الآخر. الصيغة الأفضل تتعلّق بقيمة x.',
        body: <p><MathText>{CHEAPER_RULE.text}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'khutuwat-mufadala', type: 'methodes', title: 'خطوات الترييض والمفاضلة بين صيغتين',
        summary: 'نختار المتغير، نعبّر عن كل تكلفة بدالة تآلفية، نحلّ معادلة التساوي ثم المتراجحة، نقرأ على التمثيل البياني، ونجيب بجملة في سياق الوضعية.',
        body: (
          <div className="space-y-1">
            <p className="font-bold"><MathText>{METHOD.rule[0]}</MathText></p>
          </div>
        ),
      },
    ],
  },
};
