import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Rappels et démarche seulement : une synthèse n'introduit rien (LESSON_CONTRACT :
 * le test final ne doit rien introduire de neuf). Tout est posé au module 1.
 *   masahat-mustatil  rappel — l'aire du rectangle (avant « المساحة بدلالة ℓ »)
 *   tadhkir-x2-a      rappel — les deux solutions de x² = a (leçon 3), avant « أيّ حل؟ »
 *   tariqat-wadiya    la démarche de la situation, posée APRÈS la dernière question du module 1
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'masahat-mustatil', type: 'regles', title: 'تذكير: مساحة المستطيل', summary: 'مساحة المستطيل هي جداء طوله في عرضه.',
        body: <p>مساحة مستطيل طوله <MathText>{'$L$'}</MathText> وعرضه <MathText>{'$\\ell$'}</MathText> هي <MathText>{'$L \\times \\ell$'}</MathText>.</p> },
      { id: 'tadhkir-x2-a', type: 'regles', title: 'تذكير: حلّان متعاكسان', summary: 'إذا كان العدد a موجبا تماما، فللمعادلة حلّان متعاكسان: جذره التربيعي ومعاكسه (الدرس 3).',
        body: <p>إذا كان <MathText>{'$a > 0$'}</MathText> فإنّ المعادلة <MathText>{'$x^2 = a$'}</MathText> تقبل حلين متعاكسين هما <MathText>{'$\\sqrt{a}$'}</MathText> و <MathText>{'$-\\sqrt{a}$'}</MathText> (الدرس 3).</p> },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من المساحة إلى البعدين', summary: 'نعبّر عن المساحة بدلالة العرض، نحل المعادلة ونحتفظ بالحل الموجب، نكتب الجذر على أبسط شكل، ثم ندوّر في النهاية فقط.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            <li><MathText>{REMARKS.masaha}</MathText></li>
            <li><MathText>{REMARKS.mujab}</MathText></li>
            <li>نكتب القيمة المضبوطة على الشكل <MathText>{'$a\\sqrt{b}$'}</MathText> حيث <MathText>{'$b$'}</MathText> أصغر ما يمكن (الدرس 5).</li>
            <li><MathText>{REMARKS.tadwirRight}</MathText></li>
          </ol>
        ) },
    ],
  },
};
