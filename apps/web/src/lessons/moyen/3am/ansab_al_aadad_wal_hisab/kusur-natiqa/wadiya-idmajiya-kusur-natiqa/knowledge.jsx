import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle : ce sont la DÉMARCHE (la tirelire de Meriem) et les moments de choix.
 *   kasr-minhu    module 7 — un كسر est toujours « d'un tout » : du tout (1/3, 1/4) ou du reste (3/5)
 *   tartib-hisab  module 7 — l'ordre des calculs : chaque calcul a besoin du précédent
 *   tariqat-wadiya module 7 — la démarche complète, posée APRÈS les trois questions
 * La SOLUTION (7/12 ; 5/12 ; 1/4 ; 1/6 ; 9000 DA) n'est dans aucun item : c'est la réponse de l'évaluation.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'kasr-minhu', type: 'regles', title: 'كسر من ماذا؟', summary: 'كل كسر هو كسر من شيء: من الكلّ، أو من الباقي بعد ما أُخذ.',
        body: (
          <div className="space-y-1">
            <p><MathText>{REMARKS.baseWhy}</MathText></p>
            <p><MathText>{REMARKS.wholeRight}</MathText></p>
          </div>
        ) },
      { id: 'tartib-hisab', type: 'methodes', title: 'ترتيب الحسابات', summary: 'نبدأ بما نعرفه، وكل حساب يعتمد على نتيجة الذي قبله.',
        body: (
          <div className="space-y-1">
            <p><MathText>{REMARKS.orderWhy}</MathText></p>
            <p><MathText>{'الكلّ مجموع أجزائه، فما بقي هو $1$ ناقص المُنفَق؛ وحين يُعطى كسر من الباقي نضربه في الباقي.'}</MathText></p>
          </div>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من الوضعية إلى الحساب', summary: 'نقرأ، نختار العمليات وترتيبها، ثم ننفّذ ونتحقّق.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: <MathText>{a.text}</MathText></li>)}
          </ol>
        ) },
    ],
  },
};
