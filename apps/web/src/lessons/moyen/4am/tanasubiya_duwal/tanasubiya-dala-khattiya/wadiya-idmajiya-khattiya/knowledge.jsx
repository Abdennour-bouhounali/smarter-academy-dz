import React from 'react';
import MathText from '../../../../../common/components/MathText';
import { REMARKS, SITUATION } from './content/textbook';

// La carte progressive de la leçon (structure, relations, aides) — KNOWLEDGE_MAP.md, Part A.
export { KNOWLEDGE_GRAPH } from './knowledgeGraph';

/**
 * Une synthèse n'introduit aucune notion nouvelle (LESSON_CONTRACT) : ce sont la DÉMARCHE du
 * manuel (قراءة → تحليل واختيار استراتيجية → تنفيذ) appliquée au téléphérique.
 *   masafa-fithaghuras  module 7 — le câble, hypoténuse du triangle AHB (Pythagore)
 *   mudda-sura          module 7 — durée = distance ÷ vitesse, puis minutes et secondes
 *   taklifa-khattiya    module 7 — le coût de la famille, fonction LINÉAIRE du prix adulte
 *   hadd-mizaniya       module 7 — le plus grand prix permis : intersection avec la ligne du budget, arrondi vers le bas
 *   tariqat-wadiya      module 7 — la démarche complète en trois étapes (les mots du manuel)
 * Les exemples chiffrés sont ceux de la PLATEFORME (autre téléphérique, autre famille) ; les
 * réponses du manuel (500√26 m, ≈ 7 min 43,55 s, 3,8x, 526 DA) ne sont dans aucun item : ce sont
 * celles de l'évaluation.
 */
export const LESSON_KNOWLEDGE = {
  modules: {
    7: [
      { id: 'masafa-fithaghuras', type: 'methodes', title: 'طول الحبل بمبرهنة فيثاغورس', summary: 'الحبل وتر مثلث قائم ضلعاه المسافة الأفقية والفرق بين الارتفاعين، فمربّع طوله يساوي مجموع مربّعي الضلعين.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.hatab}</MathText></li>
            <li><MathText>{REMARKS.pythagore}</MathText></li>
          </ul>
        ) },
      { id: 'mudda-sura', type: 'methodes', title: 'المدة من المسافة والسرعة', summary: 'المدة تساوي المسافة مقسومة على السرعة بوحدات متوافقة، ثم نكتب الثواني دقائق وثواني.',
        body: <p><MathText>{REMARKS.mudda}</MathText></p> },
      { id: 'taklifa-khattiya', type: 'regles', title: 'التكلفة دالة خطية للسعر', summary: 'كل بالغ يدفع السعر وكل طفل يدفع جزءا ثابتا منه، فالتكلفة الكلية عدد ثابت مضروب في السعر: دالة خطية.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.tifl}</MathText></li>
            <li><MathText>{REMARKS.taklifa}</MathText></li>
          </ul>
        ) },
      { id: 'hadd-mizaniya', type: 'methodes', title: 'أكبر سعر في حدود الميزانية', summary: 'نقرأ فاصلة نقطة تقاطع مستقيم التكلفة مع خط الميزانية أو نقسم الميزانية على المعامل، ثم ندوّر نحو الأسفل حتى لا نتجاوزها.',
        body: (
          <ul className="list-disc ms-5 space-y-1">
            <li><MathText>{REMARKS.mizaniya}</MathText></li>
            <li><MathText>{REMARKS.tadwirRight}</MathText></li>
          </ul>
        ) },
      { id: 'tariqat-wadiya', type: 'methodes', title: 'طريقة: من النص إلى الجواب', summary: 'نقرأ الوضعية ونحدد المهام والمتغير، نختار الموارد المناسبة لكل جزء، ثم ننفّذ ونفسّر النتيجة بوحدتها.',
        body: (
          <ol className="list-decimal ms-5 space-y-1">
            {SITUATION.analysis.map((a) => <li key={a.label}><strong>{a.label}</strong>: <MathText>{a.text}</MathText></li>)}
          </ol>
        ) },
    ],
  },
};
