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
        predictPrompt: 'في فاتورة المناصر وضعتَ 2000 دج في خانة و 200 دج في خانة أخرى، ثم حرّكت عدد المقابلات $x$ . لو كانت تكلفة أخرى فيها مبلغ يُدفع مرّة واحدة ومبلغ يُدفع عن كل وحدة، كيف تكتب تكلفة $x$ وحدة؟ وأيّ نوع من الدوال تحصل عليه؟ اكتب القاعدة بكلماتك.',
        summary: 'عندما تتكوّن تكلفة من جزء ثابت b يُدفع مرّة واحدة وثمن a يُدفع عن كل وحدة، فإن تكلفة x وحدة هي ax + b: دالة تآلفية.',
        body: <p><MathText>{MODEL_RULE.text}</MathText></p>,
      },
      {
        id: 'sura-fi-wadiya', type: 'methodes', title: 'مبلغ عدد معلوم، وعدد الوحدات لمبلغ معلوم',
        predictPrompt: 'أجبتَ عن سؤالين: كم يدفع المناصر لـ 7 مقابلات، وكم مقابلة تابع من دفع 4800 دج. بلغة الدالة $f$ ، ماذا حسبتَ في كل سؤال؟ وكيف تجد عدد الوحدات عندما يُعطى المبلغ؟ اكتب الطريقة.',
        summary: 'مبلغ عدد معلوم من الوحدات هو صورته، وعدد الوحدات لمبلغ معلوم هو العدد الذي صورته هذا المبلغ: نجده بحلّ معادلة.',
        body: <p><MathText>{IMAGE_RULE.text}</MathText></p>,
      },
    ],
    2: [
      {
        id: 'tasawi-taqatu', type: 'regles', title: 'تساوي تكلفتين: معادلة ونقطة تقاطع',
        predictPrompt: 'في المختبر وضعتَ علامة على التمثيل البياني، ثم وجدتَ بالحساب أنّ الاشتراك والتذكرة يكلّفان المبلغ نفسه من أجل 10 مقابلات. لو أعطيناك صيغتين أخريين $f$ و $g$ ، بأيّ حساب تجد عدد الوحدات الذي تتساوى عنده التكلفتان؟ وأين تراه على التمثيل البياني؟ اكتب القاعدة.',
        summary: 'تتساوى تكلفتا صيغتين عندما تتساوى صورتا x بالدالتين: حلّ هذه المعادلة هو فاصلة نقطة تقاطع المستقيمين.',
        body: <p><MathText>{EQUAL_RULE.text}</MathText></p>,
      },
      {
        id: 'sigha-afdal', type: 'regles', title: 'الصيغة الأرخص: متراجحة ومستقيم تحت الآخر',
        predictPrompt: 'من أجل 6 مقابلات كانت التذكرة أرخص، ومن أجل 15 مقابلة كان الاشتراك أرخص، ولوّنتَ محور الفواصل في المختبر. كيف تعرف، بالحساب وعلى التمثيل البياني، أيّ الصيغتين $f$ و $g$ أرخص من أجل عدد $x$ ؟ وهل الجواب نفسه لكل $x$ ؟ اكتب القاعدة.',
        summary: 'تكون صيغة أرخص من أخرى عندما تكون صورة x بدالتها أصغر: نحلّ متراجحة، وبيانيا مستقيمها تحت الآخر. الصيغة الأفضل تتعلّق بقيمة x.',
        body: <p><MathText>{CHEAPER_RULE.text}</MathText></p>,
      },
    ],
    3: [
      {
        id: 'khutuwat-mufadala', type: 'methodes', title: 'خطوات الترييض والمفاضلة بين صيغتين',
        predictPrompt: 'قرأتَ حلّ أمين لباقتي الأنترنت في خمسة أسطر. لو عُرضت عليك صيغتان أخريان (كراء، اشتراك، باقة…)، بأيّ خطوات تختار الأفضل منهما؟ اكتب الطريقة بكلماتك، خطوة بعد خطوة، دون أرقام هذا المثال.',
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
