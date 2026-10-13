import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION, analysisText } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont les outils des quatre دروس de l'unité
 * mobilisés par la وضعية des deux coureurs, et la DÉMARCHE du manuel (قراءة → تحليل واختيار استراتيجية → تنفيذ).
 *   qiraat-masarayn      module 7 — lire la figure : (1) trois demi-cercles posés sur l'axe des abscisses, (2) une ligne brisée
 *   nisf-daira-markaz    module 7 — un demi-cercle : centre = milieu du diamètre, rayon = moitié, longueur π r
 *   tul-khatt-munkasir   module 7 — une ligne brisée : somme des distances √((Δx)² + (Δy)²)
 *   muqaranat-masarayn   module 7 — comparer : valeurs exactes, puis approchées (arrondir à la fin), jamais à l'œil
 *   tariqat-wadiya       module 7 — la démarche en trois phases (les mots du manuel)
 * Les réponses du « إختبار أولي » (les pistes de VTT de Constantine) ne sont dans aucun item.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'qiraat-masarayn', type: 'concepts', title: 'قراءة المسارين في المعلم', summary: 'المسار الأول ثلاثة أنصاف دوائر أطرافها على محور الفواصل، والمسار الثاني خط منكسر من ثلاث قطع؛ نقرأ إحداثيات أطراف كل جزء.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.tafsir1}</MathText></li>
            <li><MathText>{REMARKS.tartib}</MathText></li>
            <li><MathText>{REMARKS.axe}</MathText></li>
          </ul>
        ) },
      { id: 'nisf-daira-markaz', type: 'regles', title: 'نصف دائرة في معلم', summary: 'مركز نصف الدائرة هو منتصف قطرها، ونصف قطرها نصف طول القطر، وطولها يساوي π ضرب نصف القطر.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.markaz}</MathText></li>
            <li><MathText>{REMARKS.centres}</MathText></li>
            <li><MathText>{REMARKS.muhit}</MathText></li>
          </ul>
        ) },
      { id: 'tul-khatt-munkasir', type: 'regles', title: 'طول خط منكسر في معلم', summary: 'طول القطعة هو المسافة بين طرفيها في المعلم المتعامد والمتجانس، وطول الخط المنكسر مجموع أطوال قطعه.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.qita}</MathText></li>
            <li><MathText>{REMARKS.MP}</MathText></li>
          </ul>
        ) },
      { id: 'muqaranat-masarayn', type: 'methodes', title: 'مقارنة طولي مسارين', summary: 'نكتب الطولين بالقيمة المضبوطة، ثم نقارن قيمتيهما المقرّبتين مع التدوير في الأخير؛ العين لا تكفي عندما يتقارب الطولان.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.muqarana}</MathText></li>
            <li><MathText>{REMARKS.tadwir}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى الجواب', summary: 'نقرأ الوضعية ونرتّب المعطيات، نحلّلها بتفسير التمثيلين البيانيين، ثم ننفّذ: إحداثيات، منتصفات، مسافات، ونقارن.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: <MathText>{analysisText(a)}</MathText></li>)}
          </ol>
        ) },
    ],
  },
};
