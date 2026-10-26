import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle : ce sont la DÉMARCHE (deux températures, deux échelles) et les moments de choix.
 *   saffan-wahid   module 7 — on ne compare que deux températures du même سلّم : on convertit d'abord
 *   silsila-aksiya module 7 — la chaîne inverse de 1,8 × T_C + 32 : on défait dans l'ordre contraire
 *   tariqat-wadiya module 7 — la démarche complète, posée APRÈS les deux questions
 * La SOLUTION (26,6 °F ; −25 °C ; Montréal) n'est dans aucun item : c'est la réponse de l'évaluation.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'saffan-wahid', type: 'regles', title: 'نقارن بسلّم واحد', summary: 'لا تُقارَن درجتا حرارة إلا بالسلّم نفسه: نحوّل إحداهما أوّلًا.',
        body: (
          <div className="space-y-1">
            <p><MathText>{REMARKS.scaleWhy}</MathText></p>
            <p><MathText>{REMARKS.scaleRight}</MathText></p>
          </div>
        ) },
      { id: 'silsila-aksiya', type: 'methodes', title: 'عكس سلسلة حسابات', summary: 'نعكس العمليات بالترتيب المعاكس: ما فُعل أخيرًا يُفكّ أوّلًا.',
        body: (
          <div className="space-y-1">
            <p><MathText>{'الحساب $T_C \\to T_F$ : نضرب في $1{,}8$ ثم نضيف $32$ .'}</MathText></p>
            <p><MathText>{REMARKS.chainWhy}</MathText></p>
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
