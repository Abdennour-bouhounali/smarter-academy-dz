import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle : ce sont la DÉMARCHE (les départs décalés de la piste) et les moments de choix.
 *   ma-yataghayyar  module 7 — ce qui change d'un couloir à l'autre (les demi-cercles) et ce qui ne change pas (les droits)
 *   bil-huruf       module 7 — pourquoi on écrit en lettres : une valeur essayée ne juge pas tous les stades
 *   tariqat-wadiya  module 7 — la démarche complète, posée APRÈS les trois questions
 * La SOLUTION n’est dans aucun item : c'est la réponse de l'évaluation.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'ma-yataghayyar', type: 'regles', title: 'ما الذي يتغيّر؟', summary: 'من رواق إلى آخر يتّسع نصفا الدائرة، أمّا المستقيمان فلا يتغيّران.',
        body: (<div className="space-y-1"><p><MathText>{REMARKS.sameWhy}</MathText></p></div>) },
      { id: 'bil-huruf', type: 'methodes', title: 'لماذا نكتب بالحروف؟', summary: 'قيمة مجرَّبة وحدها لا تحكم؛ العبارة المبسَّطة تحكم لكل القيم.',
        body: (<div className="space-y-1"><p><MathText>{REMARKS.letterWhy}</MathText></p><p><MathText>{REMARKS.valueWhy}</MathText></p></div>) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من الوضعية إلى الحساب', summary: 'نقرأ، نختار الكتابة والتبسيط، ثم ننفّذ ونتحقّق.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: <MathText>{a.text}</MathText></li>)}
          </ol>
        ) },
    ],
  },
};
