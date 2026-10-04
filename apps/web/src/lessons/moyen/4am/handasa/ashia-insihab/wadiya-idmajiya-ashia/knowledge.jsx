import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION, analysisText } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont la DÉMARCHE du manuel
 * (قراءة → تحليل واختيار استراتيجية → تنفيذ) appliquée à la وضعية « ممر الراجلين », et l'outil que « أتعمّق » mobilise.
 *   thabit-mutaghayyir  module 1 — ce qui est fixe (A, B, MN = largeur) et ce qui varie (M, N)
 *   insihab-mamar       module 1 — B′ image de B par la translation de vecteur NM : MB′BN متوازي أضلاع, NB = MB′
 *   aqsar-masar         module 1 — M sur [AB′], N image de M par la translation de vecteur MN ; L = AB′ + MN
 *   tariqat-wadiya      module 1 — la démarche en trois phases (les mots du manuel)
 *   burhan-shuai        module 3 — prouver une nature avec des vecteurs (translation → égalité, Chasles, milieux)
 * Les réponses de « إختبار أولي » (la passerelle d'Oran) ne sont dans aucun item.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    1: [
      { id: 'thabit-mutaghayyir', type: 'concepts', title: 'الثابت والمتغيّر في المسلك', summary: 'طول المسلك هو AM + MN + NB: النقطتان A و B ثابتتان، والطول MN ثابت لأنه عرض الطريق، أمّا M و N فتتحرّكان مع الممر.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.thabit}</MathText></li>
            <li><MathText>{REMARKS.bud}</MathText></li>
          </ul>
        ) },
      { id: 'insihab-mamar', type: 'methodes', title: 'نقل B بشعاع الممر', summary: 'B′ صورة B بالانسحاب الذي شعاعه NM، فالرباعي MB′BN متوازي أضلاع و NB = MB′: المسلك المطلوب له نفس طول AM + MB′ + MN.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.istibdal}</MathText></li>
            <li><MathText>{REMARKS.mutawazi}</MathText></li>
            <li><MathText>{REMARKS.masar}</MathText></li>
          </ul>
        ) },
      { id: 'aqsar-masar', type: 'regles', title: 'أقصر مسلك: M على [AB′]', summary: 'MN ثابت، فالمسلك أقصر ما يمكن عندما تكون M على القطعة [AB′]، و N صورة M بالانسحاب الذي شعاعه MN؛ أقصر طول هو AB′ + MN.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.mutabayina}</MathText></li>
            <li><MathText>{REMARKS.M}</MathText></li>
            <li><MathText>{REMARKS.N}</MathText></li>
            <li><MathText>{REMARKS.min}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى الجواب', summary: 'نقرأ الوضعية ونحدّد الثابت والمتغيّر، نحلّلها باختيار الأداة (انسحاب، تساوي شعاعين، متوازي أضلاع، أقصر مسافة)، ثم ننفّذ ونحسب ونتحقّق.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: <MathText>{analysisText(a)}</MathText></li>)}
          </ol>
        ) },
    ],
    3: [
      { id: 'burhan-shuai', type: 'methodes', title: 'إثبات طبيعة شكل بالأشعة', summary: 'نترجم كل صورة بانسحاب إلى تساوي شعاعين، نُدخل نقطة بعلاقة شال، ثم نستنتج متوازي أضلاع أو منتصفا ونتمّم بخواص القطرين — مع الانتباه إلى ترتيب الرؤوس.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.burhan}</MathText></li>
            <li><MathText>{REMARKS.burhanRight}</MathText></li>
          </ul>
        ) },
    ],
  },
};
